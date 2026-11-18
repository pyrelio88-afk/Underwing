from __future__ import annotations

import base64
import json
import re
import time
from typing import Any

DESKTOP = {"width": 1440, "height": 900}
MOBILE = {"width": 390, "height": 844}

SHEET_SEL = (
    "dialog[open], "
    "[role='dialog'][aria-modal='true'], "
    ".cupertino-pane-wrapper:not([data-persistent]):not([aria-modal='false']) "
    ".pane:not([data-persistent]):not([aria-modal='false'])"
)

EXPECTED_15_CARDS = [
    "bp", "glucose", "followup", "medlog", "symptom",
    "inhaler", "weight", "fall", "wound", "hypo",
    "breathing", "dementia", "transfer", "insulin_pen", "eyedrops",
]
CLINICAL_12_CARDS = [
    "bp", "glucose", "inhaler", "weight", "fall", "wound",
    "hypo", "breathing", "dementia", "transfer", "insulin_pen", "eyedrops",
]
ORGANIZE_3_CARDS = ["followup", "medlog", "symptom"]

PNG_1X1_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC"
)

DOSE_RE = re.compile(
    r"\d+(\.\d+)?\s*(mg|毫克|微克|μg|IU|单位|片|粒|袋|毫升|ml|mL)(?![a-zA-Z])"
    r"|剂量为"
    r"|每次.{0,3}\d+(\.\d+)?\s*(片|粒|袋|毫克|mg|微克|μg|IU|单位|毫升|ml|mL)"
)
PCT_CLAIM_RE = re.compile(r"覆盖.{0,8}\d+\s*%|\b99\s*%")
GLOBAL_PHONE_RE = re.compile(r"(?<!\d)(120|110|911|999|112)(?!\d)")
RAW_PROMPT_TAG_RE = re.compile(r"（通用）|\(通用\)|\(v1\s*§")

_JS_DOM_VISIBLE = """const isDomVisible = (el, minOp = 0, selfRect = true) => {
  if (!el || el.nodeType !== 1) return false;
  if (selfRect) {
    if (!el.getClientRects().length) return false;
    const er = el.getBoundingClientRect();
    if (er.width <= 0 || er.height <= 0) return false;
  }
  for (let cur = el; cur && cur.nodeType === 1; cur = cur.parentElement) {
    if (cur.hasAttribute('inert') || cur.getAttribute('aria-hidden') === 'true') return false;
    const cs = getComputedStyle(cur);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const op = parseFloat(cs.opacity);
    if (minOp > 0 ? op < minOp : op === 0) return false;
    if (cs.position === 'fixed' || cur.matches('.cupertino-pane-wrapper .pane')) {
      const fr = cur.getBoundingClientRect();
      if (fr.width <= 0 || fr.height <= 0) return false;
      if (fr.bottom <= 1 || fr.top >= innerHeight - 1 || fr.right <= 1 || fr.left >= innerWidth - 1) return false;
    }
  }
  return true;
};"""

JS_CONTRAST = f"""() => {{
  {_JS_DOM_VISIBLE}
  const parseRGBA = c => {{ const m = (c || '').match(/[\\d.]+/g); return (!m || m.length < 3) ? [255,255,255,0] : [+m[0],+m[1],+m[2],m[3]===undefined?1:+m[3]]; }};
  const lum = ([r,g,b]) => {{ const f = v => {{ v /= 255; return v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; }}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); }};
  const bgOf = el => {{
    const chain = [];
    for (let c = el; c && c.nodeType === 1; c = c.parentElement) chain.push(parseRGBA(getComputedStyle(c).backgroundColor));
    let base = document.documentElement.dataset.theme === 'dark' ? [18,20,19] : [242,244,242];
    for (let i = chain.length - 1; i >= 0; i--) {{
      const [r,g,b,a] = chain[i];
      if (a > 0) base = [r*a+base[0]*(1-a), g*a+base[1]*(1-a), b*a+base[2]*(1-a)];
    }}
    return base;
  }};
  const out = [];
  document.querySelectorAll('body *').forEach(e => {{
    if (!e.childNodes.length || /^(SCRIPT|STYLE|TEMPLATE|TEXTAREA|SELECT|OPTION|INPUT|SVG|CANVAS)$/.test(e.tagName)) return;
    if (e.closest('.sr,#scene3d,canvas,svg,:disabled,[aria-disabled="true"]') || !isDomVisible(e, 0.5)) return;
    const cs = getComputedStyle(e);
    const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
    if (t.length < 2) return;
    const [fr,fg,fb,fa] = parseRGBA(cs.color);
    if (fa < 0.5) return;
    const bg = bgOf(e), eff = [fr*fa+bg[0]*(1-fa), fg*fa+bg[1]*(1-fa), fb*fa+bg[2]*(1-fa)];
    const l1 = lum(eff), l2 = lum(bg), ratio = (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
    const fs = parseFloat(cs.fontSize), big = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
    if (ratio < (big ? 3.0 : 4.5)) out.push(`${{t.slice(0,22)}} (${{ratio.toFixed(2)}})`);
  }});
  return [...new Set(out)].slice(0, 8);
}}"""

JS_RED_EXCLUSIVITY = f"""() => {{
  {_JS_DOM_VISIBLE}
  const out = [], wl = '.stop,.gen-stop,[data-stop],.dlg .stop,dialog .stop,.lvl-120,.stopstrip,.jump';
  document.querySelectorAll('body *').forEach(e => {{
    if (e.closest('#scene3d,canvas,.sr,[inert],[aria-hidden="true"]') || !isDomVisible(e, 0)) return;
    const cs = getComputedStyle(e);
    for (const p of ['color','backgroundColor','borderLeftColor','borderTopColor','borderRightColor','borderBottomColor']) {{
      const m = (cs[p] || '').match(/[\\d.]+/g);
      if (!m || m.length < 3 || m[3] === '0') continue;
      const [r,g,b] = [+m[0],+m[1],+m[2]];
      if (r > 150 && g < 90 && b < 90 && r - g > 90 && !e.closest(wl)) {{
        out.push(`${{(e.className || e.tagName).toString().slice(0,30)}}:${{p}}`); break;
      }}
    }}
  }});
  return [...new Set(out)].slice(0, 8);
}}"""

JS_IMAGES_CHECK = f"""async () => {{
  {_JS_DOM_VISIBLE}
  const imgs = [...document.querySelectorAll('img')].filter(i => !i.closest('#scene3d,.sr') && isDomVisible(i, 0, false));
  const noalt = imgs.filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src') || i.outerHTML.slice(0, 60));
  for (const img of imgs) if (img.getAttribute('src') && img.loading === 'lazy') img.loading = 'eager';
  await Promise.all(imgs.map(img => (!img.getAttribute('src') || img.complete) ? Promise.resolve() : new Promise(r => {{
    img.addEventListener('load', r, {{ once: true }});
    img.addEventListener('error', r, {{ once: true }});
    setTimeout(r, 3000);
  }})));
  const broken = imgs.filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0)).map(i => i.getAttribute('src'));
  return {{ count: imgs.length, noalt, broken: [...new Set(broken)] }};
}}"""


def nav_hash(pg: Any, hash_str: str, wait_ms: int = 120) -> None:
    target = hash_str if hash_str.startswith("#") else f"#{hash_str}"
    pg.evaluate(
        """(h) => {
          if (location.hash === h) {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else {
            location.hash = h;
          }
        }""",
        target,
    )
    pg.wait_for_timeout(wait_ms)


def click_nav(pg: Any, nav_name: str, wait_ms: int = 120) -> None:
    loc = pg.locator(f"[data-nav='{nav_name}']:visible")
    if loc.count() > 0:
        loc.first.click()
        pg.wait_for_timeout(wait_ms)
        return
    nav_hash(pg, f"#/{nav_name}", wait_ms=wait_ms)


_JS_OPEN_SHEET_INDICES = """(sel) => {
  const els = [...document.querySelectorAll(sel)], idxs = [];
  for (let i = 0; i < els.length; i++) {
    const e = els[i];
    if (e.closest('[inert],[aria-hidden="true"]')) continue;
    const w = e.closest('.cupertino-pane-wrapper');
    if (w) { const wcs = getComputedStyle(w); if (wcs.display === 'none' || wcs.visibility === 'hidden') continue; }
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = e.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    if (r.top >= innerHeight - 1 || r.bottom <= 1 || r.left >= innerWidth - 1 || r.right <= 1) continue;
    idxs.push(i);
  }
  return idxs;
}"""


class _OpenSheetLocator:
    def __init__(self, pg: Any, steps: tuple[str, ...] = ()) -> None:
        self._pg = pg
        self._steps = steps

    def _open_indices(self) -> list[int]:
        return self._pg.evaluate(_JS_OPEN_SHEET_INDICES, SHEET_SEL)

    def _locators(self) -> list[Any]:
        base = self._pg.locator(SHEET_SEL)
        locs = [base.nth(i) for i in self._open_indices()]
        for step in self._steps:
            locs = [loc.locator(step) for loc in locs]
        return locs

    def count(self) -> int:
        if not self._steps:
            return len(self._open_indices())
        return sum(loc.count() for loc in self._locators())

    def locator(self, sub_sel: str) -> "_OpenSheetLocator":
        return _OpenSheetLocator(self._pg, (*self._steps, sub_sel))

    @property
    def first(self) -> Any:
        locs = self._locators()
        for loc in locs:
            if loc.count() > 0:
                return loc.first
        return locs[0].first if locs else self._pg.locator("dialog[open][data-uw-never-match]")

    def nth(self, idx: int) -> Any:
        locs = self._locators()
        return locs[idx] if 0 <= idx < len(locs) else self._pg.locator("dialog[open][data-uw-never-match]")

    def evaluate_all(self, js_expr: str, arg: Any = None) -> Any:
        expr = js_expr.strip().rstrip(";")
        call = f"({expr})(cur, arg)" if arg is not None else f"({expr})(cur)"
        return self._pg.evaluate(
            f"""([sel, steps, arg]) => {{
  const base = [...document.querySelectorAll(sel)];
  let cur = ({_JS_OPEN_SHEET_INDICES})(sel).map(i => base[i]).filter(Boolean);
  for (const s of steps) {{
    const next = [];
    for (const p of cur) for (const c of p.querySelectorAll(s)) if (!next.includes(c)) next.push(c);
    cur = next;
  }}
  return {call};
}}""",
            [SHEET_SEL, list(self._steps), arg],
        )


def visible_sheet(pg: Any) -> Any:
    return _OpenSheetLocator(pg)


def wait_sheet_open(pg: Any, timeout_ms: int = 4000) -> Any:
    pg.wait_for_function(
        f"() => ({_JS_OPEN_SHEET_INDICES})({json.dumps(SHEET_SEL)}).length > 0",
        timeout=timeout_ms,
    )
    pg.wait_for_timeout(60)
    return visible_sheet(pg).first


def wait_sheet_closed(pg: Any, timeout_ms: int = 550) -> bool:
    deadline = time.monotonic() + timeout_ms / 1000.0
    while True:
        if visible_sheet(pg).count() == 0:
            return True
        if time.monotonic() >= deadline:
            return False
        pg.wait_for_timeout(40)


def close_sheet(pg: Any, wait_ms: int = 100) -> None:
    if visible_sheet(pg).count() == 0:
        return
    dismiss_wait_ms = max(wait_ms, 550)
    for sel in ("[data-close]", ".destroy-button", "button[aria-label*='关闭']"):
        loc = visible_sheet(pg).locator(sel).locator("visible=true")
        if loc.count() > 0:
            loc.first.click()
            if wait_sheet_closed(pg, dismiss_wait_ms):
                return
    pg.keyboard.press("Escape")
    if wait_sheet_closed(pg, dismiss_wait_ms):
        return
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")
    wait_sheet_closed(pg, max(wait_ms, 200))


def sheet_text(pg: Any) -> str:
    return pg.evaluate(
        f"""(sel) => {{
          const els = [...document.querySelectorAll(sel)];
          const idxs = ({_JS_OPEN_SHEET_INDICES})(sel);
          return idxs.map(i => els[i].innerText || '').join('\\n');
        }}""",
        SHEET_SEL,
    )


def get_db(pg: Any) -> dict[str, Any]:
    return pg.evaluate(
        "JSON.parse(localStorage.getItem('underwing.v3') || 'null') || (typeof DB !== 'undefined' ? DB : {})"
    )


def get_prefs(pg: Any) -> dict[str, Any]:
    return pg.evaluate("JSON.parse(localStorage.getItem('underwing.prefs') || '{}')")


def set_db_and_reload(pg: Any, patch_js: str) -> None:
    pg.evaluate(
        f"""() => {{
          const d = JSON.parse(localStorage.getItem('underwing.v3') || 'null') || JSON.parse(JSON.stringify(DB));
          ({patch_js})(d);
          localStorage.setItem('underwing.v3', JSON.stringify(d));
        }}"""
    )
    pg.reload(wait_until="domcontentloaded")
    pg.wait_for_timeout(120)


def has_overflow(pg: Any) -> bool:
    return bool(pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"))


def check_mobile_tap_targets(pg: Any, min_px: float = 43.5) -> list[str]:
    return pg.evaluate(
        f"""(minPx) => {{
  {_JS_DOM_VISIBLE}
  const sel = "button, a.btn, [role='tab'], input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select";
  return [...document.querySelectorAll(sel)]
    .filter(el => isDomVisible(el, 0) && !el.closest('.ref,.sr,[aria-hidden="true"],[inert]') && !el.classList.contains('sr'))
    .filter(el => {{ const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < minPx || r.width < minPx); }})
    .map(el => {{ const r = el.getBoundingClientRect(), l = (el.textContent || el.getAttribute('aria-label') || el.placeholder || el.tagName).trim().slice(0, 16); return `${{l}}(${{Math.round(r.width)}}x${{Math.round(r.height)}})`; }});
}}""",
        min_px,
    )


def cdp_ime_compose(pg: Any, selector: str, composing_text: str, final_text: str, marker_prop: str = "__uwImeMarker") -> dict[str, Any]:
    inp = pg.locator(selector)
    inp.click()
    pg.evaluate(f"document.querySelector({json.dumps(selector)}).{marker_prop} = 777")
    cdp = pg.context.new_cdp_session(pg)
    try:
        cdp.send("Input.imeSetComposition", {"text": composing_text, "selectionStart": len(composing_text), "selectionEnd": len(composing_text)})
        pg.wait_for_timeout(60)
        mid_marker = pg.evaluate(f"document.querySelector({json.dumps(selector)})?.{marker_prop}")
        mid_val = pg.evaluate(f"document.querySelector({json.dumps(selector)})?.value || ''")
        cdp.send("Input.insertText", {"text": final_text})
        pg.wait_for_timeout(80)
        end_marker = pg.evaluate(f"document.querySelector({json.dumps(selector)})?.{marker_prop}")
        end_val = pg.evaluate(f"document.querySelector({json.dumps(selector)})?.value || ''")
        focused = pg.evaluate(f"document.activeElement === document.querySelector({json.dumps(selector)})")
    finally:
        try:
            cdp.detach()
        except Exception:
            pass
    return {
        "mid_marker": mid_marker,
        "mid_val": mid_val,
        "end_marker": end_marker,
        "end_val": end_val,
        "focused": focused,
    }


def decode_image_urls(pg: Any, urls: list[str]) -> list[dict[str, Any]]:
    return pg.evaluate(
        """async (items) => {
  const out = [];
  const loadOne = url => new Promise(resolve => {
    const im = new Image(); let done = false;
    const fin = (ok, w, h) => { if (!done) { done = true; resolve({ url, ok, w, h }); } };
    im.onload = () => fin(im.naturalWidth > 0, im.naturalWidth, im.naturalHeight);
    im.onerror = () => fin(false, 0, 0);
    im.src = url;
    setTimeout(() => fin(Boolean(im.complete && im.naturalWidth > 0), im.naturalWidth || 0, im.naturalHeight || 0), 4000);
  });
  for (let i = 0; i < items.length; i += 16) out.push(...await Promise.all(items.slice(i, i + 16).map(loadOne)));
  return out;
}""",
        urls,
    )


def assert_all_refs_resolve(pg: Any, scope_sel: str = "#app") -> None:
    dead = pg.evaluate(
        """(scope) => [...document.querySelectorAll(`${scope} .ref a`)]
          .filter(a => !document.querySelector(a.getAttribute('href')))
          .map(a => a.textContent + '->' + a.getAttribute('href'))""",
        scope_sel,
    )
    assert not dead, f"Unresolved .ref anchors in {scope_sel}: {dead[:5]}"


def assert_sheet_refs_resolve(pg: Any, label: str = "sheet") -> None:
    dead = visible_sheet(pg).locator(".ref a").evaluate_all(
        "(ls)=>ls.filter(a=>{const h=a.getAttribute('href')||'';return !h.startsWith('#src-')||!document.querySelector(h);}).map(a=>a.textContent+'->'+a.getAttribute('href'))"
    )
    assert not dead, f"Unresolved .ref anchors in {label}: {dead[:5]}"
