#!/usr/bin/env python3
"""Lightweight canonical-root build pipeline for Underwing.

1. Bundles underwing/src/css/*.css -> <root>/assets/app.css (UTF-8)
2. Bundles sorted underwing/src/js/*.js -> <root>/assets/app.js (UTF-8)
3. Validates assets/vendor/*.iife.js and generates canonical <root>/index.html from underwing/src/index.html
   linking assets/app.css, classic vendor IIFEs, and classic <script src="assets/app.js"></script>
   (compatible with both file:// and http://)
4. Asserts no /*STYLE*/, /*VENDOR*/, /*SCRIPT*/, or {{ART_ placeholders remain anywhere
5. Ensures no duplicate underwing/index.html or underwing/assets/ lingers
"""
import pathlib
import re
import shutil

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent

VENDOR_SCRIPTS = (
    "assets/vendor/three-vendor.iife.js",
    "assets/vendor/ios-vendor.iife.js",
)


def main() -> None:
    assets_dir = ROOT / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    for rel in VENDOR_SCRIPTS:
        vp = ROOT / rel
        assert vp.is_file() and vp.stat().st_size > 0, f"Missing or empty vendor bundle: {rel}"

    # 1. Bundle CSS (sorted, UTF-8) -> canonical <root>/assets/app.css
    css_files = sorted((HERE / "src" / "css").glob("*.css"))
    css_bundle = "\n".join(p.read_text(encoding="utf-8") for p in css_files)
    assert (
        "/*STYLE*/" not in css_bundle
        and "/*VENDOR*/" not in css_bundle
        and "{{ART_" not in css_bundle
    ), "Placeholder left in CSS bundle"
    app_css = assets_dir / "app.css"
    app_css.write_text(css_bundle, encoding="utf-8", newline="\n")

    # 2. Bundle JS (sorted, UTF-8) -> canonical <root>/assets/app.js
    js_files = sorted((HERE / "src" / "js").glob("*.js"))
    js_bundle = "\n".join(p.read_text(encoding="utf-8") for p in js_files)
    assert (
        "/*SCRIPT*/" not in js_bundle
        and "/*VENDOR*/" not in js_bundle
        and "{{ART_" not in js_bundle
    ), "Placeholder left in JS bundle"
    app_js = assets_dir / "app.js"
    app_js.write_text(js_bundle, encoding="utf-8", newline="\n")

    # 3. Generate canonical <root>/index.html linking assets/app.css, vendor IIFEs, and classic assets/app.js
    html = (HERE / "src" / "index.html").read_text(encoding="utf-8")
    vendor_tags = "\n".join(f'<script src="{rel}"></script>' for rel in VENDOR_SCRIPTS)
    html = re.sub(
        r"<style>\s*/\*STYLE\*/\s*</style>",
        '<link rel="stylesheet" href="assets/app.css">',
        html,
    )
    html = re.sub(
        r"(?:<script>\s*/\*VENDOR\*/\s*</script>|<!--\s*/\*VENDOR\*/\s*-->)",
        vendor_tags,
        html,
    )
    html = re.sub(
        r"<script>\s*/\*SCRIPT\*/\s*</script>",
        '<script src="assets/app.js"></script>',
        html,
    )
    if "/*STYLE*/" in html:
        html = html.replace("/*STYLE*/", '<link rel="stylesheet" href="assets/app.css">')
    if "/*VENDOR*/" in html:
        html = html.replace("/*VENDOR*/", vendor_tags)
    if "/*SCRIPT*/" in html:
        html = html.replace("/*SCRIPT*/", '<script src="assets/app.js"></script>')
    if VENDOR_SCRIPTS[0] not in html and '<script src="assets/app.js"></script>' in html:
        html = html.replace(
            '<script src="assets/app.js"></script>',
            f'{vendor_tags}\n<script src="assets/app.js"></script>',
        )

    assert "/*STYLE*/" not in html, "/*STYLE*/ still present in index.html"
    assert "/*VENDOR*/" not in html, "/*VENDOR*/ still present in index.html"
    assert "/*SCRIPT*/" not in html, "/*SCRIPT*/ still present in index.html"
    assert "{{ART_" not in html, "{{ART_ placeholder still present in index.html"
    assert 'href="assets/app.css"' in html, "Missing assets/app.css link in index.html"
    assert '<script src="assets/app.js"></script>' in html, "Missing classic assets/app.js script in index.html"
    app_idx = html.index('<script src="assets/app.js"></script>')
    for rel in VENDOR_SCRIPTS:
        tag = f'<script src="{rel}"></script>'
        assert tag in html, f"Missing vendor script tag in index.html: {rel}"
        assert html.index(tag) < app_idx, f"Vendor script must load before assets/app.js: {rel}"
    assert 'type="module"' not in html, "Script must NOT use type=module (breaks file://)"

    out_html = ROOT / "index.html"
    out_html.write_text(html, encoding="utf-8", newline="\n")

    # 4. Eliminate any duplicate underwing/index.html or underwing/assets/
    dup_html = HERE / "index.html"
    if dup_html.exists():
        dup_html.unlink()
    dup_assets = HERE / "assets"
    if dup_assets.exists():
        shutil.rmtree(dup_assets)

    html_sz = out_html.stat().st_size
    css_sz = app_css.stat().st_size
    js_sz = app_js.stat().st_size
    code_sz = html_sz + css_sz + js_sz
    vendor_sz = sum((ROOT / rel).stat().st_size for rel in VENDOR_SCRIPTS)

    webp_files = list(assets_dir.rglob("*.webp"))
    webp_sz = sum(p.stat().st_size for p in webp_files)

    print(
        f"built ok -> {ROOT} | index.html={html_sz:,}B ({html_sz/1024:.1f}KB) "
        f"app.css={css_sz:,}B ({css_sz/1024:.1f}KB) "
        f"app.js={js_sz:,}B ({js_sz/1024:.1f}KB) "
        f"code_total={code_sz/1024:.1f}KB | "
        f"vendor={vendor_sz/1024:.1f}KB | "
        f"webp={len(webp_files)} files ({webp_sz/(1024*1024):.2f}MB)"
    )


if __name__ == "__main__":
    main()
