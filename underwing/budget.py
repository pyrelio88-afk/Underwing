#!/usr/bin/env python3
"""Lightweight Web App size & deduplicated disk budget audit for Underwing (鹤伴).

Canonical Build Output (Root `Underwing-Optimized/`):
  - Core code bundle (`index.html` + `assets/app.css` + `assets/app.js`): < 400 KB
  - Local vendor IIFEs (`assets/vendor/three-vendor.iife.js`, `ios-vendor.iife.js`): < 1024 KB (1.00 MB)
  - Card WebP assets (`assets/art/cards/*.webp`, 16 keys): > 0 B each
  - Disease Hub WebP assets (`assets/art/disease/*.webp`, 99 files): > 0 B each
  - Total WebP assets (`cards` + `disease`): < 3.5 MB (3584 KB)
  - Deduplication check: no duplicate `underwing/index.html`, `underwing/assets/`, or `node_modules/`
  - Total repository folder size: < 8.0 MB
"""
import pathlib
import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
KB = 1024
MB = 1024 * 1024

CODE_CAP_BYTES = 400 * KB
VENDOR_CAP_BYTES = 1024 * KB  # 1.00 MB (three-vendor + ios-vendor IIFEs)
WEBP_CAP_BYTES = int(3.5 * MB)  # 3,670,016 bytes (3584 KB)
REPO_CAP_BYTES = int(8.0 * MB)

EXPECTED_VENDOR_FILES = (
    "three-vendor.iife.js",
    "ios-vendor.iife.js",
)

EXPECTED_CARD_KEYS = {
    "bp", "followup", "meds", "symptom", "glucose",
    "inhaler", "weight", "fall", "wound", "hypo",
    "breathing", "dementia", "transfer", "eyedrops",
    "insulin_pen", "mascot",
}
EXPECTED_DISEASE_COUNT = 99


def fmt_kb(n: int) -> str:
    return f"{n / KB:7.1f} KB"


def fmt_mb(n: int) -> str:
    return f"{n / MB:6.2f} MB"


def dir_files(d: pathlib.Path, suffix: str = ""):
    if not d.is_dir():
        return []
    return sorted(
        p for p in d.iterdir()
        if p.is_file() and (not suffix or p.name.lower().endswith(suffix))
    )


def main() -> int:
    issues = []
    lines = ["== Underwing Lightweight Web App Budget Audit =="]

    # 1. Source size (informational)
    src_html = HERE / "src" / "index.html"
    src_css = sum(p.stat().st_size for p in dir_files(HERE / "src" / "css", ".css"))
    src_js = sum(p.stat().st_size for p in dir_files(HERE / "src" / "js", ".js"))
    src_html_sz = src_html.stat().st_size if src_html.exists() else 0
    src_total = src_html_sz + src_css + src_js
    lines.append(
        f"src total          : {fmt_kb(src_total)} "
        f"(html {src_html_sz / KB:.1f} + css {src_css / KB:.1f} + js {src_js / KB:.1f} KB)"
    )

    # 2. Canonical root core code bundle
    idx_path = ROOT / "index.html"
    css_path = ROOT / "assets" / "app.css"
    js_path = ROOT / "assets" / "app.js"

    missing_core = [str(p.relative_to(ROOT)) for p in (idx_path, css_path, js_path) if not p.exists()]
    if missing_core:
        issues.append(f"Missing canonical built core files in root: {missing_core}")
        lines.append(f"built core bundle  : MISSING {missing_core}")
    else:
        idx_sz = idx_path.stat().st_size
        css_sz = css_path.stat().st_size
        js_sz = js_path.stat().st_size
        code_total = idx_sz + css_sz + js_sz
        status = "OK" if code_total < CODE_CAP_BYTES else "OVER"
        if code_total >= CODE_CAP_BYTES:
            issues.append(f"Core code bundle {code_total / KB:.1f} KB >= 400.0 KB budget")
        lines.append(
            f"built core bundle  : {fmt_kb(code_total)} "
            f"(index.html {idx_sz / KB:.1f} + app.css {css_sz / KB:.1f} + app.js {js_sz / KB:.1f} KB) "
            f"[budget < 400.0 KB] -> {status}"
        )

    # 2b. Local vendor IIFE bundles (assets/vendor/*.iife.js)
    vendor_dir = ROOT / "assets" / "vendor"
    vendor_files = dir_files(vendor_dir, ".js")
    vendor_names = {p.name for p in vendor_files}
    vendor_bytes = sum(p.stat().st_size for p in vendor_files)
    missing_vendor = [name for name in EXPECTED_VENDOR_FILES if name not in vendor_names]
    zero_vendor = [p.name for p in vendor_files if p.stat().st_size == 0]
    if missing_vendor:
        issues.append(f"Missing vendor IIFE bundles in assets/vendor/: {missing_vendor}")
    if zero_vendor:
        issues.append(f"Empty 0-byte vendor IIFE bundles: {zero_vendor}")
    if vendor_bytes >= VENDOR_CAP_BYTES:
        issues.append(f"Vendor IIFE bundle {vendor_bytes / KB:.1f} KB >= {VENDOR_CAP_BYTES / KB:.1f} KB budget")
    vendor_ok = (not missing_vendor) and (not zero_vendor) and (0 < vendor_bytes < VENDOR_CAP_BYTES)
    vendor_parts = " + ".join(f"{p.name} {p.stat().st_size / KB:.1f}" for p in vendor_files) or "none"
    lines.append(
        f"vendor IIFEs       : {fmt_kb(vendor_bytes)} ({vendor_parts} KB) "
        f"[budget < {VENDOR_CAP_BYTES / KB:.1f} KB] -> {'OK' if vendor_ok else 'FAIL'}"
    )

    # 3. Card WebP assets (canonical root)
    cards_dir = ROOT / "assets" / "art" / "cards"
    card_files = dir_files(cards_dir, ".webp")
    card_stems = {p.stem for p in card_files}
    cards_bytes = sum(p.stat().st_size for p in card_files)
    missing_cards = sorted(EXPECTED_CARD_KEYS - card_stems)
    zero_cards = [p.name for p in card_files if p.stat().st_size == 0]
    if missing_cards:
        issues.append(f"Missing card WebP keys ({len(missing_cards)}): {missing_cards}")
    if zero_cards:
        issues.append(f"Empty 0-byte card WebPs: {zero_cards}")
    card_max = max((p.stat().st_size for p in card_files), default=0)
    lines.append(
        f"card WebPs         : {len(card_files):3d} files, {fmt_kb(cards_bytes)} "
        f"(max {card_max / KB:.1f} KB) [expected 16] -> {'OK' if not missing_cards and not zero_cards else 'FAIL'}"
    )

    # 4. Disease Hub WebP assets (canonical root)
    dis_dir = ROOT / "assets" / "art" / "disease"
    dis_files = dir_files(dis_dir, ".webp")
    dis_bytes = sum(p.stat().st_size for p in dis_files)
    zero_dis = [p.name for p in dis_files if p.stat().st_size == 0]
    alt_leaks = [p.name for p in dis_files if "diabetes_alt" in p.name]
    if len(dis_files) != EXPECTED_DISEASE_COUNT:
        issues.append(f"Disease WebP count is {len(dis_files)}, expected {EXPECTED_DISEASE_COUNT}")
    if zero_dis:
        issues.append(f"Empty 0-byte disease WebPs: {zero_dis}")
    if alt_leaks:
        issues.append(f"Excluded backup file leaked into disease WebPs: {alt_leaks}")
    dis_avg = (dis_bytes / len(dis_files)) if dis_files else 0
    dis_max = max((p.stat().st_size for p in dis_files), default=0)
    lines.append(
        f"disease WebPs      : {len(dis_files):3d} files, {fmt_kb(dis_bytes)} "
        f"(avg {dis_avg / KB:.1f} KB, max {dis_max / KB:.1f} KB) [expected 99] -> "
        f"{'OK' if len(dis_files) == EXPECTED_DISEASE_COUNT and not zero_dis and not alt_leaks else 'FAIL'}"
    )

    # 5. Total WebP budget
    webp_total = cards_bytes + dis_bytes
    webp_ok = 0 < webp_total < WEBP_CAP_BYTES
    if webp_total >= WEBP_CAP_BYTES:
        issues.append(f"Total WebP size {webp_total / MB:.2f} MB >= 3.50 MB budget")
    elif webp_total == 0:
        issues.append("Total WebP size is 0 B (assets not generated yet)")
    lines.append(
        f"total WebP assets  : {fmt_mb(webp_total)} ({webp_total / KB:.1f} KB) "
        f"[budget < 3.50 MB / 3584.0 KB] -> {'OK' if webp_ok else 'FAIL'}"
    )

    # 6. Deduplication & legacy bloat cleanup check
    dup_idx = (HERE / "index.html").exists()
    dup_assets = (HERE / "assets").exists()
    legacy_art_json = (HERE / "art" / "art.json").exists()
    legacy_work = (ROOT / "work").exists()
    has_node_modules = any(p.is_dir() and p.name == "node_modules" for p in ROOT.rglob("node_modules"))
    dedup_ok = not (dup_idx or dup_assets or legacy_art_json or legacy_work or has_node_modules)
    if has_node_modules:
        issues.append("node_modules/ directory found in repo (must stage npm/esbuild in temp dir)")
    if dup_idx or dup_assets or legacy_art_json or legacy_work:
        issues.append(
            f"Duplicate or scratch artifacts still present: underwing/index.html={dup_idx}, "
            f"underwing/assets={dup_assets}, art.json={legacy_art_json}, work/={legacy_work}"
        )
    lines.append(
        f"dedup & clean      : underwing/index={dup_idx}, underwing/assets={dup_assets}, "
        f"work={legacy_work}, node_modules={has_node_modules} -> "
        f"{'OK' if dedup_ok else 'FAIL'}"
    )

    # 7. Total folder footprint
    all_repo_files = [
        p for p in ROOT.rglob("*")
        if p.is_file() and "__pycache__" not in p.parts and ".git" not in p.parts
    ]
    repo_bytes = sum(p.stat().st_size for p in all_repo_files)
    repo_ok = repo_bytes < REPO_CAP_BYTES
    if not repo_ok:
        issues.append(f"Total folder size {repo_bytes / MB:.2f} MB >= 8.00 MB cap")
    lines.append(
        f"total folder size  : {fmt_mb(repo_bytes)} ({len(all_repo_files)} files) "
        f"[cap < 8.00 MB] -> {'OK' if repo_ok else 'FAIL'}"
    )

    lines.append(f"BUDGET {'PASS' if not issues else 'FAIL'}  issues={len(issues)}")
    for it in issues:
        lines.append(f" - {it}")

    print("\n".join(lines))
    return 0 if not issues else 1


if __name__ == "__main__":
    sys.exit(main())
