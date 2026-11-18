from __future__ import annotations

import functools
import glob
import http.server
import os
import pathlib
import threading
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Callable


class InfraError(RuntimeError):
    """Infrastructure, CLI, target reachability, or browser launch error (exit 2)."""


class QuietStaticHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".webp": "image/webp",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".json": "application/json; charset=utf-8",
    }

    def log_message(self, format: str, *args: Any) -> None:
        pass


class _ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 128


class EphemeralStaticServer:
    def __init__(self, root_dir: pathlib.Path) -> None:
        self.root_dir = root_dir.resolve()
        self._httpd: _ReusableThreadingHTTPServer | None = None
        self._thread: threading.Thread | None = None

    def __enter__(self) -> str:
        if not (self.root_dir / "index.html").is_file():
            raise InfraError(f"Missing index.html in project root: {self.root_dir}")
        handler = functools.partial(QuietStaticHandler, directory=str(self.root_dir))
        self._httpd = _ReusableThreadingHTTPServer(("127.0.0.1", 0), handler)
        port = self._httpd.server_address[1]
        self._thread = threading.Thread(target=self._httpd.serve_forever, daemon=True)
        self._thread.start()
        return f"http://127.0.0.1:{port}/index.html"

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        if self._httpd is not None:
            try:
                self._httpd.shutdown()
            except Exception:
                pass
            try:
                self._httpd.server_close()
            except Exception:
                pass
            self._httpd = None
        if self._thread is not None:
            self._thread.join(timeout=2.0)
            self._thread = None


def check_url_reachable(url: str, timeout_s: float = 3.0) -> None:
    if not (url.startswith("http://") or url.startswith("https://")):
        raise InfraError(f"Invalid --url scheme (expected http:// or https://): {url}")
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            if resp.status >= 400:
                raise InfraError(f"Target URL returned HTTP {resp.status}: {url}")
    except InfraError:
        raise
    except (urllib.error.URLError, OSError, ValueError) as exc:
        raise InfraError(f"Target URL unreachable ({url}): {exc}") from exc


def _probe_webgl(browser: Any) -> dict[str, Any]:
    ctx = browser.new_context(viewport={"width": 640, "height": 480})
    try:
        pg = ctx.new_page()
        return pg.evaluate(
            """() => {
              const c2 = document.createElement('canvas');
              const gl2 = c2.getContext('webgl2');
              const c1 = document.createElement('canvas');
              const gl1 = c1.getContext('webgl') || c1.getContext('experimental-webgl');
              const gl = gl2 || gl1;
              let renderer = null;
              if (gl) {
                const ext = gl.getExtension('WEBGL_debug_renderer_info');
                renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
              }
              return { webgl2: Boolean(gl2), webgl1: Boolean(gl1), renderer };
            }"""
        )
    finally:
        ctx.close()


def _find_chromium_exes() -> list[str]:
    patterns = [
        os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"),
        os.path.expanduser("~/AppData/Local/ms-playwright/chromium*-*/chrome-win*/chrome.exe"),
        os.path.expanduser("~/AppData/Local/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe"),
    ]
    out: list[str] = []
    for pat in patterns:
        out.extend(sorted(glob.glob(pat)))
    return out


def launch_browser(playwright: Any, *, webgl: bool = True, headed: bool = False) -> tuple[Any, dict[str, Any]]:
    swift_args = [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
        "--ignore-gpu-blocklist",
    ]
    no_gl_args = ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis"]
    headless = not headed

    if webgl:
        candidates: list[tuple[str, dict[str, Any]]] = [
            ("msedge", {"channel": "msedge", "headless": headless}),
            ("msedge-swiftshader", {"channel": "msedge", "headless": headless, "args": swift_args}),
            ("chrome", {"channel": "chrome", "headless": headless}),
            ("chrome-swiftshader", {"channel": "chrome", "headless": headless, "args": swift_args}),
            ("chromium", {"headless": headless}),
        ]
        for exe in _find_chromium_exes():
            candidates.append((f"exe:{os.path.basename(exe)}", {"executable_path": exe, "headless": headless}))

        last_err: Exception | None = None
        fallback_candidate: tuple[Any, dict[str, Any]] | None = None
        for label, kwargs in candidates:
            try:
                browser = playwright.chromium.launch(**kwargs)
            except Exception as exc:
                last_err = exc
                continue
            try:
                probe = _probe_webgl(browser)
            except Exception:
                probe = {"webgl2": False, "webgl1": False, "renderer": None}
            meta = {"channel": label, **probe}
            if probe.get("webgl2"):
                if fallback_candidate is not None:
                    try:
                        fallback_candidate[0].close()
                    except Exception:
                        pass
                return browser, meta
            if fallback_candidate is None:
                fallback_candidate = (browser, meta)
            else:
                try:
                    browser.close()
                except Exception:
                    pass

        if fallback_candidate is not None:
            return fallback_candidate
        raise InfraError(f"Failed to launch Playwright Chromium/Edge browser: {last_err}")

    # webgl=False profile
    candidates = [
        ("msedge-nowebgl", {"channel": "msedge", "headless": headless, "args": no_gl_args}),
        ("chrome-nowebgl", {"channel": "chrome", "headless": headless, "args": no_gl_args}),
        ("chromium-nowebgl", {"headless": headless, "args": no_gl_args}),
    ]
    for exe in _find_chromium_exes():
        candidates.append((f"exe-nowebgl:{os.path.basename(exe)}", {"executable_path": exe, "headless": headless, "args": no_gl_args}))

    last_err = None
    for label, kwargs in candidates:
        try:
            browser = playwright.chromium.launch(**kwargs)
            probe = _probe_webgl(browser)
            if probe.get("webgl2") or probe.get("webgl1"):
                browser.close()
                continue
            return browser, {"channel": label, **probe}
        except Exception as exc:
            last_err = exc
    raise InfraError(f"Failed to launch WebGL-disabled browser profile: {last_err}")


@dataclass
class TestResult:
    id: str
    tier: int
    feature: str
    name: str
    status: str  # PASS | FAIL | ERROR
    duration_ms: int
    detail: str = ""
    console_errors: list[str] = field(default_factory=list)
    page_errors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "tier": self.tier,
            "feature": self.feature,
            "name": self.name,
            "status": self.status,
            "duration_ms": self.duration_ms,
            "detail": self.detail,
            "console_errors": self.console_errors,
            "page_errors": self.page_errors,
        }


class PageSession:
    def __init__(self, ctx: Any, page: Any, console_errors: list[str], page_errors: list[str]) -> None:
        self.ctx = ctx
        self.page = page
        self.console_errors = console_errors
        self.page_errors = page_errors

    def clear_errors(self) -> None:
        self.console_errors.clear()
        self.page_errors.clear()

    def close(self) -> None:
        try:
            self.ctx.close()
        except Exception:
            pass


class TestRunner:
    def __init__(self, playwright: Any, base_url: str, *, timeout_ms: int = 8000, headed: bool = False) -> None:
        self.playwright = playwright
        self.base_url = base_url
        self.timeout_ms = timeout_ms
        self.headed = headed
        self.browser_webgl, self.browser_meta = launch_browser(playwright, webgl=True, headed=headed)
        self._browser_nowebgl: Any | None = None
        self.results: list[TestResult] = []
        self._active_sessions: list[PageSession] = []

    def get_nowebgl_browser(self) -> Any:
        if self._browser_nowebgl is None:
            self._browser_nowebgl, _ = launch_browser(self.playwright, webgl=False, headed=self.headed)
        return self._browser_nowebgl

    def open_session(
        self,
        *,
        viewport: dict[str, int] | None = None,
        device_scale_factor: int = 1,
        reduced_motion: str | None = None,
        color_scheme: str | None = None,
        webgl: bool = True,
        hash_path: str = "",
    ) -> PageSession:
        browser = self.browser_webgl if webgl else self.get_nowebgl_browser()
        ctx_kwargs: dict[str, Any] = {
            "viewport": viewport or {"width": 1440, "height": 900},
            "device_scale_factor": device_scale_factor,
            "accept_downloads": True,
        }
        if reduced_motion is not None:
            ctx_kwargs["reduced_motion"] = reduced_motion
        if color_scheme is not None:
            ctx_kwargs["color_scheme"] = color_scheme
        ctx = browser.new_context(**ctx_kwargs)
        pg = ctx.new_page()
        pg.set_default_timeout(self.timeout_ms)
        c_errs: list[str] = []
        p_errs: list[str] = []
        pg.on("pageerror", lambda e, b=p_errs: b.append(str(e)))
        pg.on("console", lambda m, b=c_errs: b.append(m.text) if m.type == "error" else None)
        sess = PageSession(ctx, pg, c_errs, p_errs)
        self._active_sessions.append(sess)
        target = self.base_url.split("#")[0] + (hash_path if hash_path.startswith("#") else f"#{hash_path}" if hash_path else "")
        pg.goto(target, wait_until="domcontentloaded")
        pg.wait_for_timeout(120)
        return sess

    def run_case(
        self,
        case_id: str,
        tier: int,
        feature: str,
        name: str,
        fn: Callable[[], None],
    ) -> TestResult:
        t0 = time.perf_counter()
        before_idx = len(self._active_sessions)
        status = "PASS"
        detail = ""
        c_errs: list[str] = []
        p_errs: list[str] = []
        try:
            fn()
        except AssertionError as exc:
            status = "FAIL"
            detail = str(exc).strip() or "Assertion failed"
        except Exception as exc:
            cls_name = type(exc).__name__
            if "playwright" in type(exc).__module__.lower() or cls_name in ("TimeoutError", "Error"):
                status = "FAIL"
            else:
                status = "ERROR"
            detail = f"{cls_name}: {exc}"
        finally:
            opened = self._active_sessions[before_idx:]
            for s in opened:
                c_errs.extend(s.console_errors)
                p_errs.extend(s.page_errors)
                s.close()
            del self._active_sessions[before_idx:]

        if status == "PASS" and (c_errs or p_errs):
            status = "FAIL"
            sample = (p_errs + c_errs)[0]
            detail = f"Unexpected browser error(s): {sample}"

        dur = int((time.perf_counter() - t0) * 1000)
        if len(detail) > 280:
            detail = detail[:277] + "..."
        res = TestResult(
            id=case_id,
            tier=tier,
            feature=feature,
            name=name,
            status=status,
            duration_ms=dur,
            detail=detail,
            console_errors=c_errs[:10],
            page_errors=p_errs[:10],
        )
        self.results.append(res)
        suffix = f" -> {detail}" if detail else ""
        print(f"[{status}] {case_id} (tier{tier}/{feature}) {name} ({dur}ms){suffix}", flush=True)
        return res

    def close(self) -> None:
        for s in list(self._active_sessions):
            s.close()
        self._active_sessions.clear()
        for b in (self.browser_webgl, self._browser_nowebgl):
            if b is not None:
                try:
                    b.close()
                except Exception:
                    pass
        self._browser_nowebgl = None
