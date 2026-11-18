from __future__ import annotations

import json
import re
import urllib.request

from helpers import (
    CLINICAL_12_CARDS,
    DESKTOP,
    DOSE_RE,
    EXPECTED_15_CARDS,
    GLOBAL_PHONE_RE,
    JS_CONTRAST,
    JS_IMAGES_CHECK,
    JS_RED_EXCLUSIVITY,
    MOBILE,
    PCT_CLAIM_RE,
    PNG_1X1_BYTES,
    RAW_PROMPT_TAG_RE,
    SHEET_SEL,
    assert_sheet_refs_resolve,
    cdp_ime_compose,
    check_mobile_tap_targets,
    click_nav,
    close_sheet,
    get_db,
    has_overflow,
    nav_hash,
    set_db_and_reload,
    sheet_text,
    visible_sheet,
    wait_sheet_closed,
    wait_sheet_open,
)
from runtime import TestRunner


def run_tier2(runner: TestRunner) -> None:
    # ---------------- Area 1: 3D Sanctuary Boundaries (5 tests) ----------------
    def t2_3d_01() -> None:
        s = runner.open_session(viewport=DESKTOP, webgl=False)
        gl_null = s.page.evaluate(
            """() => {
              const c1 = document.createElement('canvas');
              const c2 = document.createElement('canvas');
              return !c1.getContext('webgl2') && !c2.getContext('webgl');
            }"""
        )
        assert gl_null, "WebGL unexpectedly active in webgl=False browser profile"
        fb = s.page.evaluate(
            """() => {
              const el = document.getElementById('scene3d');
              return { exists: Boolean(el), fallback: el?.classList.contains('scene3d--fallback') || false };
            }"""
        )
        assert fb["exists"] and fb["fallback"], f"#scene3d missing .scene3d--fallback when WebGL unavailable: {fb}"
        click_nav(s.page, "library")
        assert "#/library" in s.page.evaluate("location.hash")
        click_nav(s.page, "cards")
        assert "#/cards" in s.page.evaluate("location.hash")

    def t2_3d_02() -> None:
        s = runner.open_session(viewport=DESKTOP)
        assert s.page.evaluate("typeof window.UnderwingScene?.focusZone === 'function'"), "UnderwingScene missing"
        s.page.evaluate(
            """() => {
              window.UnderwingScene.focusZone('nonexistent_zone_xyz');
              window.UnderwingScene.setTheme('dark');
              window.UnderwingScene.setTheme('dark');
              window.UnderwingScene.setTheme('light');
            }"""
        )
        s.page.wait_for_timeout(50)
        assert s.page.evaluate("document.querySelector('#scene3d canvas')?.getBoundingClientRect()?.width >= 200")

    def t2_3d_03() -> None:
        s = runner.open_session(viewport=DESKTOP)
        assert s.page.evaluate("typeof window.UnderwingScene?.setSuspended === 'function'"), "UnderwingScene.setSuspended missing"
        s.page.evaluate(
            """() => {
              window.UnderwingScene.setSuspended(true);
              document.dispatchEvent(new Event('visibilitychange'));
              window.UnderwingScene.setSuspended(false);
            }"""
        )
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.querySelector('#scene3d canvas')?.width > 0")

    def t2_3d_04() -> None:
        s = runner.open_session(viewport=DESKTOP, device_scale_factor=3)
        assert s.page.locator("#scene3d canvas").count() == 1, "#scene3d canvas missing"
        for vp in (MOBILE, DESKTOP, MOBILE, DESKTOP):
            s.page.set_viewport_size(vp)
            s.page.wait_for_timeout(50)
        info = s.page.evaluate(
            """() => {
              const c = document.querySelector('#scene3d canvas');
              const r = c.getBoundingClientRect();
              return { cssW: r.width, cssH: r.height, bufW: c.width, bufH: c.height };
            }"""
        )
        assert info["cssW"] >= 300 and info["cssH"] >= 300
        assert info["bufW"] <= info["cssW"] * 2 + 4, f"Canvas DPR exceeded cap <=2: {info}"

    def t2_3d_05() -> None:
        s = runner.open_session(viewport=DESKTOP)
        assert s.page.evaluate("typeof window.UnderwingScene?.init === 'function'"), "UnderwingScene.init missing"
        ok = s.page.evaluate(
            """() => {
              const host = document.createElement('div');
              host.style.cssText = 'width:320px;height:240px';
              document.body.appendChild(host);
              const ctrl = window.UnderwingScene.init(host, {});
              ctrl?.destroy?.();
              host.remove();
              return typeof ctrl?.destroy === 'function';
            }"""
        )
        assert ok, "UnderwingScene.init().destroy() missing"

    runner.run_case("T2-3D-01", 2, "F6", "WebGL unavailable .scene3d--fallback & usable UI", t2_3d_01)
    runner.run_case("T2-3D-02", 2, "F6", "Unknown focusZone & repeated setTheme safety", t2_3d_02)
    runner.run_case("T2-3D-03", 2, "F6", "setSuspended(true/false) & visibilitychange pause", t2_3d_03)
    runner.run_case("T2-3D-04", 2, "F6", "Rapid resize 1440x900 <-> 390x844 & DPR <= 2", t2_3d_04)
    runner.run_case("T2-3D-05", 2, "F6", "UnderwingScene destroy() teardown safety", t2_3d_05)

    # ---------------- Area 2: iOS Nav & Responsive Boundaries (5 tests) ----------------
    def t2_nav_01() -> None:
        for label, vp in [("mobile", MOBILE), ("desktop", DESKTOP)]:
            s = runner.open_session(viewport=vp)
            for h in ("#/cards", "#/library", "#/library?tab=hubs", "#/library?tab=conds", "#/folder", "#/settings", "#/card/bp"):
                nav_hash(s.page, h, wait_ms=50)
                assert not has_overflow(s.page), f"Horizontal overflow on {label} at {h}"
            s.page.locator("[data-act='redlines']:visible").first.click()
            wait_sheet_open(s.page)
            assert not has_overflow(s.page), f"Horizontal overflow on {label} with redlines sheet open"
            close_sheet(s.page)

    def t2_nav_02() -> None:
        s = runner.open_session(viewport=MOBILE)
        for h in ("#/cards", "#/library", "#/folder", "#/settings", "#/card/bp"):
            nav_hash(s.page, h, wait_ms=60)
            small = check_mobile_tap_targets(s.page, min_px=43.5)
            assert not small, f"Mobile tap targets < 44px on {h}: {small[:6]}"

    def t2_nav_03() -> None:
        s = runner.open_session(viewport=DESKTOP, reduced_motion="reduce")
        res = s.page.evaluate(
            """() => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anims = [...document.querySelectorAll('*')].filter(e => {
    const cs = getComputedStyle(e);
    return cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0.01 && cs.animationPlayState === 'running';
  }).length;
  return { mq, anims, rmClass: document.documentElement.classList.contains('rm') };
}"""
        )
        assert res["mq"] and res["rmClass"], f"Reduced motion media query not honored: {res}"
        assert res["anims"] == 0, f"Found {res['anims']} running CSS animations under reduced motion"
        card = s.page.locator("[data-tcg='bp']").first
        bb = card.bounding_box()
        if bb:
            s.page.mouse.move(bb["x"] + bb["width"] * 0.2, bb["y"] + bb["height"] * 0.2)
        card.dispatch_event("pointermove", {"clientX": 100, "clientY": 100})
        s.page.wait_for_timeout(50)
        tilt = s.page.evaluate(
            """() => {
  const el = document.querySelector("[data-tcg='bp']"), inner = el?.querySelector(".tcg-inner");
  return { exists: Boolean(el && inner), live: Boolean(el?.classList.contains("live")), inlineTransform: inner?.style.transform || "", computedTransform: inner ? getComputedStyle(inner).transform : "" };
}"""
        )
        assert tilt["exists"], "TCG card [data-tcg='bp'] / .tcg-inner missing"
        assert not tilt["live"] and tilt["inlineTransform"] == "" and tilt["computedTransform"] in ("none", ""), (
            f"TCG card tilted under reduced-motion: {tilt}"
        )

    def t2_nav_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        is_dlg = visible_sheet(s.page).evaluate_all("els => els.some(e => e.tagName === 'DIALOG' || e.getAttribute('role') === 'dialog')")
        s.page.keyboard.press("Escape")
        esc_ok = wait_sheet_closed(s.page, 450)
        if is_dlg:
            assert esc_ok, "Escape did not dismiss <dialog>/[role='dialog'] sheet"
        elif not esc_ok:
            close_sheet(s.page)
            assert wait_sheet_closed(s.page, 450), "Non-dialog CupertinoPane remained open after fallback close"

        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        close_btn = visible_sheet(s.page).locator("[data-close]:visible")
        if close_btn.count() > 0:
            close_btn.first.click()
            assert wait_sheet_closed(s.page, 450), "[data-close] failed to dismiss sheet"
        else:
            close_sheet(s.page)
            assert wait_sheet_closed(s.page, 450), "close_sheet failed to dismiss sheet"

        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        s.page.keyboard.press("Escape")
        if not wait_sheet_closed(s.page, 450):
            if is_dlg:
                raise AssertionError("Escape failed on rapid reopen of <dialog>/[role='dialog']")
            close_sheet(s.page)
        assert visible_sheet(s.page).count() == 0, "Orphan sheet remained open after rapid dismiss cycles"

    def t2_nav_05() -> None:
        for theme in ("light", "dark"):
            s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
            s.page.locator(f"[data-pref='theme'][data-val='{theme}']").click()
            s.page.wait_for_timeout(60)
            for h in ("#/cards", "#/library", "#/folder", "#/card/bp"):
                nav_hash(s.page, h, wait_ms=50)
                bad = s.page.evaluate(JS_CONTRAST)
                assert not bad, f"WCAG AA contrast violation in {theme} at {h}: {bad}"

    runner.run_case("T2-NAV-01", 2, "F7/F3", "Zero horizontal overflow at 390x844 & 1440x900", t2_nav_01)
    runner.run_case("T2-NAV-02", 2, "F3", "Mobile 390x844 touch targets >= 44px", t2_nav_02)
    runner.run_case("T2-NAV-03", 2, "F6/F7", "prefers-reduced-motion static mode", t2_nav_03)
    runner.run_case("T2-NAV-04", 2, "F7", "Rapid sheet open/close & ESC cleanup", t2_nav_04)
    runner.run_case("T2-NAV-05", 2, "F3", "WCAG AA contrast in light & dark modes", t2_nav_05)

    # ---------------- Area 3: Deck & Cards Boundaries (5 tests) ----------------
    def t2_deck_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/does_not_exist")
        assert s.page.locator("[data-nav='cards'][aria-current='true'], [data-nav='cards'][aria-current='page']").count() >= 1 and s.page.locator("[data-tile]").count() >= 1, "Invalid card route did not fall back to cards"
        txt = s.page.locator("#app").inner_text()
        assert len(txt.strip()) > 20 and "undefined" not in txt

    def t2_deck_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        set_db_and_reload(s.page, "d => { d.deck = []; }")
        assert len(get_db(s.page).get("deck", [])) == 0
        txt = s.page.locator("#app").inner_text()
        assert "还没有" in txt or "找" in txt, "Empty deck guidance missing"

    def t2_deck_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/bp")
        set_db_and_reload(s.page, "d => { d.stepDone = { bp: [-1, 0, 1, 2, 3, 4, 999] }; }")
        pt = s.page.locator("#ptext").text_content() or ""
        assert "5 / 5" in pt and "做完了" in pt, f"Unexpected completion text: {pt}"
        assert s.page.locator("ol.steps li.is-next").count() == 0

    def t2_deck_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        flip_btn = s.page.locator("[data-tile='bp'] [data-flip='bp']").first
        assert flip_btn.get_attribute("aria-expanded") == "false"
        back_inert = s.page.evaluate("document.querySelector(\"[data-tcg='bp'] .back\")?.hasAttribute('inert')")
        assert back_inert, "Unflipped card .back lacks inert attribute"
        ref_link = s.page.locator("[data-tcg='bp'] .ref a").first
        assert ref_link.count() > 0, "Expected .ref a link on [data-tcg='bp']"
        ref_link.click()
        s.page.wait_for_timeout(50)
        assert flip_btn.get_attribute("aria-expanded") == "false", "Clicking .ref unexpectedly flipped card"

    def t2_deck_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/medlog")
        m_before = len(get_db(s.page).get("meds", []))
        s.page.locator("#medForm button").click()
        s.page.wait_for_timeout(40)
        assert len(get_db(s.page).get("meds", [])) == m_before, "Empty med submit mutated DB.meds"
        nav_hash(s.page, "#/card/symptom", wait_ms=60)
        s_before = len(get_db(s.page).get("symptoms", []))
        s.page.locator("#symForm button").click()
        assert len(get_db(s.page).get("symptoms", [])) == s_before, "Empty symptom submit mutated DB.symptoms"
        s.page.fill("#sw", "乏力")
        s.page.fill("#sl", "-3")
        s.page.locator("#symForm button").click()
        # Native HTML5 min/max may block invalid submit; also verify JS defense-in-depth clamping
        s.page.evaluate("() => { document.getElementById('symForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }")
        s.page.fill("#sw", "胸闷")
        s.page.fill("#sl", "99")
        s.page.evaluate("() => { document.getElementById('symForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }")
        syms = get_db(s.page).get("symptoms", [])
        assert len(syms) >= 2 and syms[-2]["lvl"] == 0 and syms[-1]["lvl"] == 10, f"Symptom lvl clamping failed: {syms[-2:]}"

    runner.run_case("T2-DECK-01", 2, "F8", "Invalid #/card/does_not_exist safe fallback", t2_deck_01)
    runner.run_case("T2-DECK-02", 2, "F8", "Empty DB.deck renders guidance without breakage", t2_deck_02)
    runner.run_case("T2-DECK-03", 2, "F8", "Out-of-bounds stepDone filtered & full completion", t2_deck_03)
    runner.run_case("T2-DECK-04", 2, "F8", "TCG inert isolation & .ref non-flip", t2_deck_04)
    runner.run_case("T2-DECK-05", 2, "F8", "medlog/symptom empty no-op & lvl [0,10] clamp", t2_deck_05)

    # ---------------- Area 4: Medical Safety Iron Rules (5 tests) ----------------
    def t2_safe_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        assert s.page.evaluate("CONDITIONS.some(c => c.id === 'hypo')"), "hypo condition missing from CONDITIONS"
        mapped = s.page.evaluate("CONDITIONS.find(c => c.id === 'hypo')?.cards || []")
        assert "hypo" not in mapped, f"CRITICAL SAFETY BUG: hypo condition cards contains 'hypo': {mapped}"
        s.page.locator("[data-cond='hypo']").click()
        nav_hash(s.page, "#/cards", wait_ms=60)
        assert s.page.locator("#app [data-tile='hypo'], #app [data-tcg='hypo'], #app [data-card='hypo'], #app [data-deck='hypo']").count() == 0, (
            "hypo thyroid condition recommended hypoglycemia card"
        )
        nav_hash(s.page, "#/library", wait_ms=60)
        s.page.fill("#q", "甲减")
        s.page.wait_for_timeout(60)
        assert s.page.locator("#app [data-tile='hypo'], #app [data-tcg='hypo'], #app [data-card='hypo'], #app [data-deck='hypo']").count() == 0, (
            "Search '甲减' returned hypo card"
        )

    def t2_safe_02() -> None:
        for theme in ("light", "dark"):
            for vp_name, vp in [("desktop", DESKTOP), ("mobile", MOBILE)]:
                s = runner.open_session(viewport=vp, hash_path="#/settings")
                s.page.locator(f"[data-pref='theme'][data-val='{theme}']").click()
                s.page.wait_for_timeout(40)
                for h in ("#/cards", "#/library", "#/library?tab=hubs", "#/folder", "#/card/bp"):
                    nav_hash(s.page, h, wait_ms=40)
                    viol = s.page.evaluate(JS_RED_EXCLUSIVITY)
                    assert not viol, f"Red exclusivity violated ({vp_name}/{theme} at {h}): {viol}"
                s.page.locator("[data-act='redlines']:visible").first.click()
                wait_sheet_open(s.page)
                viol_dlg = s.page.evaluate(JS_RED_EXCLUSIVITY)
                assert not viol_dlg, f"Red exclusivity violated in redlines sheet ({vp_name}/{theme}): {viol_dlg}"
                close_sheet(s.page)

    def t2_safe_03() -> None:
        s = runner.open_session(viewport=DESKTOP)
        dump = s.page.evaluate(
            """() => ({
  cards: Object.entries(CARDS).map(([k, c]) => [k, [c.title||'', c.sub||'', c.key||'', c.stopMini||'', c.desc||'', c.flavor||'', ...(c.stats||[]).flat()].join(' ')]),
  hubs: DISEASE_HUBS.map(h => [h.id, `${(h.callouts||[]).join(' ')} ${h.scopeNote||''} ${h.sexNote||''}`])
})"""
        )
        for k, txt in dump["cards"]:
            m_c = DOSE_RE.search(txt)
            assert not m_c, f"DOSE regex matched card {k} ({m_c.group(0)}): {txt}"
        for hid, txt in dump["hubs"]:
            m_h = DOSE_RE.search(txt)
            assert not m_h, f"DOSE regex matched hub {hid} ({m_h.group(0)}): {txt}"
        for k in EXPECTED_15_CARDS:
            nav_hash(s.page, f"#/card/{k}", wait_ms=40)
            full_txt = s.page.locator("#app").inner_text()
            m = DOSE_RE.search(full_txt)
            assert not m, f"DOSE regex matched #app card view on {k}: {m.group(0)}"
            bedside_btn = s.page.locator("[data-act='bedside']:visible")
            if k in CLINICAL_12_CARDS:
                assert bedside_btn.count() > 0, f"Bedside button missing on {k}"
            if bedside_btn.count() > 0:
                bedside_btn.first.click()
                wait_sheet_open(s.page)
                m_bs = DOSE_RE.search(sheet_text(s.page))
                assert not m_bs, f"DOSE regex matched bedside sheet on {k}: {m_bs.group(0)}"
                close_sheet(s.page)
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        m_rl = DOSE_RE.search(sheet_text(s.page))
        assert not m_rl, f"DOSE regex matched redlines sheet: {m_rl.group(0)}"
        close_sheet(s.page)

    def t2_safe_04() -> None:
        s = runner.open_session(viewport=DESKTOP)
        hubs = s.page.evaluate(
            "DISEASE_HUBS.map(h => ({ id: h.id, callouts: (h.callouts||[]).join(' | '), all: `${(h.callouts||[]).join(' | ')} | ${h.scopeNote||''} | ${h.sexNote||''}` }))"
        )
        for h in hubs:
            assert not PCT_CLAIM_RE.search(h["all"]), f"PCT_CLAIM in hub {h['id']}"
            assert not RAW_PROMPT_TAG_RE.search(h["all"]), f"RAW_PROMPT_TAG in hub {h['id']}"
            assert not GLOBAL_PHONE_RE.search(h["callouts"]), f"GLOBAL_PHONE in hub {h['id']} callouts: {h['callouts']}"
        for route in ("#/cards", "#/library", "#/library?tab=hubs", "#/folder", "#/settings", "#/card/bp"):
            nav_hash(s.page, route, wait_ms=40)
            app_txt = s.page.locator("#app").inner_text()
            assert not PCT_CLAIM_RE.search(app_txt), f"PCT_CLAIM rendered on {route}"

    def t2_safe_05() -> None:
        s = runner.open_session(viewport=DESKTOP)
        for k in CLINICAL_12_CARDS:
            nav_hash(s.page, f"#/card/{k}", wait_ms=40)
            miss = s.page.evaluate(
                """() => [...document.querySelectorAll('#app ol.steps>li, #app .mistake, #app .stop .lvl, #app [data-needref]')]
                  .filter(e => !e.querySelector('.ref')).map(e => e.innerText.trim().slice(0, 24))"""
            )
            assert not miss, f"Clinical card {k} items missing .ref: {miss[:4]}"
            leak = s.page.evaluate("(/\\bundefined\\b|\\bNaN\\b/.exec(document.getElementById('app')?.innerText || '') || [null])[0]")
            assert leak is None, f"Text leak '{leak}' on card {k}"
        nav_hash(s.page, "#/card/bp", wait_ms=40)
        s.page.locator("[data-act='bedside']:visible").first.click()
        wait_sheet_open(s.page)
        assert_sheet_refs_resolve(s.page, "Bedside bp")
        assert not re.search(r"\bundefined\b|\bNaN\b", sheet_text(s.page)), "Text leak in Bedside sheet"
        close_sheet(s.page)
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        assert visible_sheet(s.page).locator(".ref a[href^='#src-']").count() >= 1, "Red-Lines sheet missing .ref links"
        assert_sheet_refs_resolve(s.page, "Red-Lines")
        assert not re.search(r"\bundefined\b|\bNaN\b", sheet_text(s.page)), "Text leak in Red-Lines sheet"
        close_sheet(s.page)

    runner.run_case("T2-SAFE-01", 2, "F9/F12", "hypo thyroid condition !== hypo low-glucose card", t2_safe_01)
    runner.run_case("T2-SAFE-02", 2, "F12", "Red exclusivity sweep (light/dark, mobile/desktop)", t2_safe_02)
    runner.run_case("T2-SAFE-03", 2, "F12", "Zero drug names or dosages (DOSE regex)", t2_safe_03)
    runner.run_case("T2-SAFE-04", 2, "F12", "Zero % claims, prompt residue & hub emergency phones", t2_safe_04)
    runner.run_case("T2-SAFE-05", 2, "F8/F12", "100% .ref citations & zero undefined/NaN leaks", t2_safe_05)

    # ---------------- Area 5: Search, Conditions & Hubs Boundaries (5 tests) ----------------
    def t2_srch_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        ime = cdp_ime_compose(s.page, "#q", "tang", "糖尿病")
        assert ime["mid_marker"] == 777 and ime["end_marker"] == 777, f"#q DOM node replaced during IME: {ime}"
        assert ime["end_val"] == "糖尿病" and ime["focused"], f"IME final value/focus invalid: {ime}"
        assert s.page.locator("#app [data-cond]").count() >= 2, "IME compositionend did not render diabetes results"

    def t2_srch_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        s.page.fill("#q", "   ")
        s.page.wait_for_timeout(60)
        assert s.page.locator("[data-tcg], [data-tile], [data-card]").count() >= 15, "Whitespace query did not show full 15 cards"
        s.page.fill("#q", "xyz不存在999")
        s.page.wait_for_timeout(60)
        assert s.page.locator("[data-addcustom]").count() == 1, "Zero-match search missing custom condition CTA"

    def t2_srch_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        long_str = "甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥"
        s.page.fill("#q", long_str)
        s.page.wait_for_timeout(60)
        s.page.locator("[data-addcustom]").first.click()
        s.page.wait_for_timeout(60)
        customs = get_db(s.page).get("customConds", [])
        assert customs and len(customs[-1]) == 20, f"Custom condition not capped at 20 chars: {customs}"
        s.page.evaluate("window.__xssHit = 0")
        s.page.fill("#q", "<script>window.__xssHit=1</script>")
        s.page.wait_for_timeout(60)
        s.page.locator("[data-addcustom]").first.click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("window.__xssHit === 0"), "XSS executed from custom condition!"

    def t2_srch_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs&hub=01_heart")
        assert s.page.locator("[data-hub='01_heart'][aria-expanded='true']").count() == 1 and s.page.locator("[data-deckbatch]").count() == 1
        s.page.locator("[data-age='0-5']").click()
        s.page.wait_for_timeout(60)
        assert "hub=" not in s.page.evaluate("location.hash") and s.page.locator("[data-deckbatch], [data-hub='01_heart'][aria-expanded='true']").count() == 0, "Filtered-out active hub was not pruned"
        s.page.locator("[data-sys='ne']").click()
        s.page.wait_for_timeout(60)
        assert s.page.locator("[data-age='all'], [data-sys='all']").count() >= 1

    def t2_srch_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs&hub=04_diabetes")
        btn = s.page.locator("[data-deckbatch]").first
        btn.click()
        s.page.wait_for_timeout(60)
        deck1 = get_db(s.page).get("deck", [])
        btn.click()
        s.page.wait_for_timeout(60)
        deck2 = get_db(s.page).get("deck", [])
        assert deck1 == deck2 and len(deck2) == len(set(deck2)), f"Batch-add not idempotent: {deck2}"

    runner.run_case("T2-SRCH-01", 2, "F9", "CDP IME compositionstart/end zero-clobber resilience", t2_srch_01)
    runner.run_case("T2-SRCH-02", 2, "F9", "Whitespace-only & zero-match search states", t2_srch_02)
    runner.run_case("T2-SRCH-03", 2, "F9", "Custom condition 20-char cap & XSS escaping", t2_srch_03)
    runner.run_case("T2-SRCH-04", 2, "F9", "Hub active-hub pruning & filter reset", t2_srch_04)
    runner.run_case("T2-SRCH-05", 2, "F9", "Hub batch-add idempotency", t2_srch_05)

    # ---------------- Area 6: Health Folder & Vitals Boundaries (5 tests) ----------------
    def t2_fldr_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        for bad_s, bad_d in (("59", "40"), ("281", "90"), ("120", "125"), ("abc", "80")):
            s.page.locator("[data-act='addbp']").first.click()
            wait_sheet_open(s.page)
            s.page.fill("#fs", bad_s)
            s.page.fill("#fdi", bad_d)
            s.page.locator("#f button:not([data-close])").click()
            assert len(s.page.locator("#ferr").text_content() or "") > 4, f"Invalid BP {bad_s}/{bad_d} not rejected"
            close_sheet(s.page)
        # Boundary 180/120 -> NO .stop
        s.page.locator("[data-act='addbp']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fs", "180")
        s.page.fill("#fdi", "120")
        s.page.locator("#f button:not([data-close])").click()
        assert visible_sheet(s.page).locator("[data-stop]").count() == 0, "180/120 boundary falsely triggered .stop"
        close_sheet(s.page)
        # 181/85 and 130/121 -> .stop
        for hi_s, hi_d in (("181", "85"), ("130", "121")):
            s.page.locator("[data-act='addbp']").first.click()
            wait_sheet_open(s.page)
            s.page.fill("#fs", hi_s)
            s.page.fill("#fdi", hi_d)
            s.page.locator("#f button:not([data-close])").click()
            assert visible_sheet(s.page).locator("[data-stop]").count() >= 1, f"{hi_s}/{hi_d} missed .stop alert"
            close_sheet(s.page)

    def t2_fldr_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        for bad_g in ("0.9", "35.1", "abc"):
            s.page.locator("[data-act='addglucose']").first.click()
            wait_sheet_open(s.page)
            s.page.fill("#fgv", bad_g)
            s.page.locator("#fg button:not([data-close])").click()
            assert len(s.page.locator("#fgerr").text_content() or "") > 4, f"Invalid glucose {bad_g} not rejected"
            close_sheet(s.page)
        for val, expect_stop in (("3.9", True), ("4.0", False), ("16.6", False), ("16.7", True)):
            s.page.locator("[data-act='addglucose']").first.click()
            wait_sheet_open(s.page)
            s.page.fill("#fgv", val)
            s.page.locator("#fg button:not([data-close])").click()
            has_stop = visible_sheet(s.page).locator("[data-stop]").count() >= 1
            assert has_stop == expect_stop, f"Glucose {val} stop={has_stop}, expected {expect_stop}"
            close_sheet(s.page)

    def t2_fldr_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        for bad_w in ("1.5", "301"):
            s.page.locator("[data-act='addweight']").first.click()
            wait_sheet_open(s.page)
            s.page.fill("#fwk", bad_w)
            s.page.locator("#fw button:not([data-close])").click()
            assert len(s.page.locator("#fwerr").text_content() or "") > 4, f"Invalid weight {bad_w} not rejected"
            close_sheet(s.page)
        set_db_and_reload(s.page, "d => { d.weightReadings = (d.weightReadings || []).slice(0, 1); }")
        s.page.locator("[data-chart='weight']").click()
        s.page.wait_for_timeout(60)
        assert s.page.locator("svg[role='img'][aria-label*='趋势']").count() == 0, "Weight chart rendered SVG with < 2 ok readings"
        assert "满 2 条后显示趋势" in s.page.locator("#app").inner_text()

    def t2_fldr_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        set_db_and_reload(s.page, "d => { d.customConds = ['保持完整']; }")
        bad_payloads = [
            "{corrupt json",
            "[]",
            json.dumps({"app": "other", "events": [], "readings": [], "deck": []}),
            json.dumps({"app": "underwing", "data": {"events": "bad", "readings": [], "deck": []}}),
            json.dumps({"app": "underwing", "data": {"events": [{"title": "x", "date": "2026/11/01"}], "readings": [], "deck": []}}),
            json.dumps({"app": "underwing", "data": {"events": [], "readings": [{"sys": 39, "dia": 80}], "deck": []}}),
            json.dumps({"app": "underwing", "data": {"events": [], "readings": [], "glucoseReadings": [{"val": 41}], "deck": []}}),
            json.dumps({"app": "underwing", "data": {"events": [], "readings": [], "weightReadings": [{"kg": 351}], "deck": []}}),
        ]
        s.page.locator("[data-act='importjson']").click()
        wait_sheet_open(s.page)
        for p_txt in bad_payloads:
            s.page.fill("#impText", p_txt)
            s.page.locator("#impConfirmBtn").click()
            assert len(s.page.locator("#impErr").text_content() or "") > 4, f"Corrupt backup accepted: {p_txt[:40]}"
        close_sheet(s.page)
        assert get_db(s.page).get("customConds") == ["保持完整"], "DB altered by rejected backup"

    def t2_fldr_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        assert s.page.locator("#app .fict").first.text_content() == "虚构", "Demo persona 王秀兰 missing #app .fict badge"
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        assert visible_sheet(s.page).locator(".fict").first.text_content() == "虚构", "Clinic sheet missing .fict badge"
        close_sheet(s.page)
        big_buf = PNG_1X1_BYTES + b"\x00" * (15 * 1024 * 1024)
        with s.page.expect_file_chooser() as fc:
            s.page.locator("[data-act='upload']").click()
        fc.value.set_files([{"name": "too_big.png", "mimeType": "image/png", "buffer": big_buf}])
        wait_sheet_open(s.page)
        assert "超过 15 MB" in sheet_text(s.page), ">15MB upload was not flagged"
        close_sheet(s.page)
        nav_hash(s.page, "#/settings", wait_ms=60)
        s.page.fill("#aiEp", "http://evil.example.com/api")
        s.page.locator("[data-act='saveEp']").click()
        s.page.wait_for_timeout(50)
        assert s.page.evaluate("prefs.aiEndpoint") == "", "Non-HTTPS non-localhost AI endpoint accepted"

    runner.run_case("T2-FLDR-01", 2, "F10", "BP >180/120 alerts & invalid rejections", t2_fldr_01)
    runner.run_case("T2-FLDR-02", 2, "F10", "Glucose <=3.9 / >=16.7 alerts & invalid rejections", t2_fldr_02)
    runner.run_case("T2-FLDR-03", 2, "F10", "Weight invalid rejections & <2 ok chart threshold", t2_fldr_03)
    runner.run_case("T2-FLDR-04", 2, "F10/F11", "Corrupt & out-of-range JSON backup rejections", t2_fldr_04)
    runner.run_case("T2-FLDR-05", 2, "F10/F12", ">15MB upload, non-HTTPS AI endpoint & 虚构 badge", t2_fldr_05)

    # ---------------- Area 7: Settings & Storage Boundaries (5 tests) ----------------
    def t2_set_01() -> None:
        s = runner.open_session(viewport=DESKTOP, color_scheme="dark", hash_path="#/settings")
        s.page.locator("[data-pref='theme'][data-val='auto']").click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.documentElement.dataset.theme") == "dark", "auto theme did not follow OS dark scheme"

    def t2_set_02() -> None:
        s = runner.open_session(viewport=DESKTOP)
        s.page.evaluate("() => { localStorage.setItem('underwing.v3', '{corrupt'); localStorage.setItem('underwing.prefs', '{bad'); }")
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        assert s.page.evaluate("DB.person?.name") == "王秀兰", "Corrupt localStorage did not recover to SEED"

    def t2_set_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        s.page.locator("[data-act='ai']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#aiSample").click()
        s.page.locator("#aiNext1").click()
        s.page.wait_for_timeout(50)
        s.page.fill("#aiClean", s.page.input_value("#aiClean") + "\n补充联系：13912345678")
        s.page.locator("#aiNext2").click()
        s.page.wait_for_timeout(60)
        assert s.page.locator("#aiClean").count() == 1, "Residual PII passed Step 2 without re-check stop"
        assert "13912345678" not in s.page.input_value("#aiClean"), "Re-check did not mask re-inserted phone"

    def t2_set_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        set_db_and_reload(s.page, "d => { d.customConds = ['待清除项']; }")
        s.page.on("dialog", lambda d: d.accept())
        s.page.locator("[data-act='wipe']").click()
        s.page.wait_for_timeout(120)
        assert s.page.evaluate("localStorage.getItem('underwing.v3') === null"), "localStorage key not cleared"
        assert "待清除项" not in s.page.evaluate("DB.customConds || []"), "DB not reset to SEED"
        idb_cnt = s.page.evaluate(
            """() => new Promise((res) => {
              const req = indexedDB.open('underwing-files');
              req.onerror = () => res(0);
              req.onsuccess = () => {
                const db = req.result;
                if (!db.objectStoreNames.length) { res(0); return; }
                const st = db.objectStoreNames[0];
                const c = db.transaction(st, 'readonly').objectStore(st).count();
                c.onsuccess = () => res(c.result);
                c.onerror = () => res(-1);
              };
            })"""
        )
        assert idb_cnt == 0, f"IndexedDB not cleared on wipe: count={idb_cnt}"

    def t2_set_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=invalid&age=unknown&hub=missing")
        txt = s.page.locator("#app").inner_text()
        assert len(txt.strip()) > 20 and "undefined" not in txt

    runner.run_case("T2-SET-01", 2, "F11", "auto theme follows OS prefers-color-scheme: dark", t2_set_01)
    runner.run_case("T2-SET-02", 2, "F11", "Corrupted localStorage boot recovery", t2_set_02)
    runner.run_case("T2-SET-03", 2, "F11", "Double-pass PII redaction catches residual phone", t2_set_03)
    runner.run_case("T2-SET-04", 2, "F11", "wipe clears localStorage & IndexedDB", t2_set_04)
    runner.run_case("T2-SET-05", 2, "F7", "Unknown/malformed hash query param resilience", t2_set_05)

    # ---------------- Area 8: Media & WebP Asset Boundaries (5 tests) ----------------
    def t2_art_01() -> None:
        for theme in ("light", "dark"):
            for vp_name, vp in [("desktop", DESKTOP), ("mobile", MOBILE)]:
                s = runner.open_session(viewport=vp, hash_path="#/settings")
                s.page.locator(f"[data-pref='theme'][data-val='{theme}']").click()
                for h in ("#/cards", "#/library", "#/card/bp"):
                    nav_hash(s.page, h, wait_ms=50)
                    res = s.page.evaluate(JS_IMAGES_CHECK)
                    assert not res["noalt"] and not res["broken"], f"Image failure ({vp_name}/{theme} at {h}): {res}"

    def t2_art_02() -> None:
        s = runner.open_session(viewport=DESKTOP)
        art_vals = s.page.evaluate("['assets/art/cards/mascot.webp', ...Object.values(CARDS).map(c => `assets/art/cards/${c.art}.webp`)]")
        assert len(art_vals) == 16 and all(isinstance(v, str) and v.endswith(".webp") for v in art_vals)
        base = runner.base_url.rsplit("/", 1)[0]
        for rel in art_vals:
            with urllib.request.urlopen(f"{base}/{rel}", timeout=3.0) as resp:
                data = resp.read()
                assert resp.status == 200 and len(data) > 0, f"Empty/failed asset {rel}"

    def t2_art_03() -> None:
        s = runner.open_session(viewport=MOBILE, hash_path="#/library?tab=hubs")
        s.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        s.page.wait_for_timeout(200)
        res = s.page.evaluate(JS_IMAGES_CHECK)
        assert not res["broken"], f"Lazy-loaded images failed after scroll: {res['broken'][:5]}"

    def t2_art_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        leaks = s.page.evaluate(
            """() => {
              const badHubs = DISEASE_HUBS.filter(h => String(h.artSlug||'').includes('diabetes_alt')).map(h => h.id);
              const badImgs = [...document.querySelectorAll('img')].map(i => i.src).filter(u => u.includes('diabetes_alt') || u.includes('art.json'));
              return { badHubs, badImgs };
            }"""
        )
        assert not leaks["badHubs"] and not leaks["badImgs"], f"Legacy art leak detected: {leaks}"

    def t2_art_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        res = s.page.evaluate(
            """async () => {
              const medArt = CARDS.medlog?.art;
              const im = new Image();
              await new Promise(r => { im.onload = r; im.onerror = r; im.src = 'assets/art/cards/mascot.webp'; });
              return { medArt, w: im.naturalWidth, h: im.naturalHeight };
            }"""
        )
        assert res["medArt"] == "meds", f"medlog.art !== 'meds': {res}"
        assert res["w"] >= 128 and res["h"] >= 128 and abs(res["w"] - res["h"]) <= 2, f"Mascot dimensions unexpected: {res}"

    runner.run_case("T2-ART-01", 2, "F4/F5", "Zero broken <img> & universal alt in light/dark", t2_art_01)
    runner.run_case("T2-ART-02", 2, "F4/F5", "All 16 ART entries resolve to non-empty .webp", t2_art_02)
    runner.run_case("T2-ART-03", 2, "F5", "Lazy-loaded offscreen images decode on scroll", t2_art_03)
    runner.run_case("T2-ART-04", 2, "F5", "Zero diabetes_alt or art.json leaks", t2_art_04)
    runner.run_case("T2-ART-05", 2, "F4/F5", "medlog.art==='meds' & mascot dimensions >=128px", t2_art_05)
