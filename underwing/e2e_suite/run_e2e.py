#!/usr/bin/env python3
from __future__ import annotations

import sys

sys.dont_write_bytecode = True

import argparse
import datetime
import json
import pathlib
import time
from contextlib import nullcontext
from typing import Any

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from playwright.sync_api import sync_playwright

from runtime import EphemeralStaticServer, InfraError, TestRunner, check_url_reachable
from tier1_features import run_tier1
from tier2_boundaries import run_tier2
from tier3_combos import run_tier3
from tier4_scenarios import run_tier4

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        try:
            _stream.reconfigure(encoding="utf-8")
        except Exception:
            pass


def parse_tiers(raw: str) -> list[int]:
    val = (raw or "").strip().lower()
    if val == "all":
        return [1, 2, 3, 4]
    parts = [p.strip() for p in val.split(",") if p.strip()]
    if not parts:
        raise InfraError(f"Invalid --tier value: {raw!r}")
    out: list[int] = []
    for p in parts:
        if p not in ("1", "2", "3", "4"):
            raise InfraError(f"Invalid --tier value {p!r}; expected 1, 2, 3, 4, or all")
        t = int(p)
        if t not in out:
            out.append(t)
    return out


def validate_json_path(path_str: str | None) -> pathlib.Path | None:
    if not path_str:
        return None
    p = pathlib.Path(path_str)
    try:
        p.parent.mkdir(parents=True, exist_ok=True)
        with open(p, "w", encoding="utf-8") as fh:
            fh.write("{}")
    except OSError as exc:
        raise InfraError(f"Cannot write --json output path {p}: {exc}") from exc
    return p


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(description="Underwing-Optimized Opaque-Box 4-Tier E2E Suite")
    ap.add_argument("--tier", default="all", help="Tier(s) to execute: 1, 2, 3, 4, comma-list, or all (default: all)")
    ap.add_argument("--url", default=None, help="Target http(s):// URL (default: ephemeral 127.0.0.1 HTTP server)")
    ap.add_argument("--json", default=None, help="Optional path to write structured JSON report")
    ap.add_argument("--timeout-ms", type=int, default=8000, help="Playwright action timeout in ms (default: 8000)")
    ap.add_argument("--headed", action="store_true", help="Run browser in headed mode")
    return ap


def main(argv: list[str] | None = None) -> int:
    ap = build_parser()
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code != 0 else 0

    try:
        tiers = parse_tiers(args.tier)
        if args.timeout_ms <= 0:
            raise InfraError(f"--timeout-ms must be > 0, got {args.timeout_ms}")
        json_out = validate_json_path(args.json)
        if args.url is not None:
            check_url_reachable(args.url, timeout_s=3.0)
            server_cm: Any = nullcontext(args.url)
        else:
            server_cm = EphemeralStaticServer(ROOT)
    except InfraError as exc:
        print(f"[INFRA ERROR] {exc}", file=sys.stderr)
        return 2

    t0 = time.perf_counter()
    try:
        with server_cm as target_url:
            with sync_playwright() as pw:
                runner = TestRunner(pw, target_url, timeout_ms=args.timeout_ms, headed=args.headed)
                try:
                    tier_map = {1: run_tier1, 2: run_tier2, 3: run_tier3, 4: run_tier4}
                    for t in tiers:
                        tier_map[t](runner)
                finally:
                    runner.close()
    except InfraError as exc:
        print(f"[INFRA ERROR] {exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"[INFRA ERROR] Unexpected runner infrastructure failure: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2

    dur_ms = int((time.perf_counter() - t0) * 1000)
    results = runner.results
    total = len(results)
    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status == "FAIL")
    errored = sum(1 for r in results if r.status == "ERROR")
    c_errs = sum(len(r.console_errors) for r in results)
    p_errs = sum(len(r.page_errors) for r in results)
    all_pass = (total > 0 and failed == 0 and errored == 0 and c_errs == 0 and p_errs == 0)

    tier_summary: dict[str, dict[str, int]] = {}
    for t in tiers:
        tr = [r for r in results if r.tier == t]
        tier_summary[str(t)] = {
            "total": len(tr),
            "passed": sum(1 for r in tr if r.status == "PASS"),
            "failed": sum(1 for r in tr if r.status == "FAIL"),
            "errored": sum(1 for r in tr if r.status == "ERROR"),
        }

    print("\n=== E2E SUMMARY ===")
    print(f"Target  : {target_url}")
    print(f"Browser : {runner.browser_meta.get('channel')} (WebGL2: {runner.browser_meta.get('webgl2')})")
    for t in tiers:
        ts = tier_summary[str(t)]
        print(f"Tier {t}  : {ts['passed']} PASS / {ts['failed']} FAIL / {ts['errored']} ERROR ({ts['total']} total)")
    print(
        f"TOTAL   : {passed} PASS / {failed} FAIL / {errored} ERROR | "
        f"console_errors={c_errs} | page_errors={p_errs} | duration={dur_ms / 1000:.2f}s"
    )
    print(f"RESULT  : {'PASS' if all_pass else 'FAIL'} (exit={0 if all_pass else 1})")

    if json_out is not None:
        report = {
            "schema_version": "1.0",
            "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "target_url": target_url,
            "browser": {
                "channel": runner.browser_meta.get("channel"),
                "webgl2": runner.browser_meta.get("webgl2"),
                "renderer": runner.browser_meta.get("renderer"),
            },
            "tiers_requested": [str(t) for t in tiers],
            "summary": {
                "total": total,
                "passed": passed,
                "failed": failed,
                "errored": errored,
                "console_errors": c_errs,
                "page_errors": p_errs,
                "duration_ms": dur_ms,
                "pass": all_pass,
            },
            "tiers": tier_summary,
            "results": [r.to_dict() for r in results],
        }
        json_out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
