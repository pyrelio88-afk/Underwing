from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any

from helpers import (
    CLINICAL_12_CARDS,
    DESKTOP,
    EXPECTED_15_CARDS,
    MOBILE,
    ORGANIZE_3_CARDS,
    PNG_1X1_BYTES,
    SHEET_SEL,
    assert_all_refs_resolve,
    assert_sheet_refs_resolve,
    click_nav,
    close_sheet,
    decode_image_urls,
    get_db,
    get_prefs,
    nav_hash,
    set_db_and_reload,
    sheet_text,
    visible_sheet,
    wait_sheet_open,
)
from runtime import TestRunner

ALL_99_DISEASE_FILES = [
    f"{s}.webp" for s in (
        "01_heart 02_stroke 03_lrti 04_diabetes 05_copd 06_fall 07_backpain 08_diarrhea 09_depression 10_anxiety "
        "11_hearing 12_malaria 13_cancer 14_ckd 15_headache 16_hiv 17_tb 18_cirrhosis 19_dementia 20_anemia "
        "21_oral 22_hypertension 23_obesity 24_gerd 25_osteoarthritis 26_osteoporosis 27_rhinitis 28_neckpain 29_asthma 30_gallbladder "
        "31_osa 32_vision 33_myopia 34_rhd 35_heartfailure 36_afib 37_pad 38_bph 39_stones 40_gout "
        "41_ild 42_pancreatitis 43_psoriasis 44_ra 45_ibd 46_fibroids 47_ulcer 48_epilepsy 49_parkinsons 50_eczema "
        "51_thyroid 52_lipids 53_dengue 54_hepatitis 55_incontinence 56_ms 57_sle 58_as 59_endometriosis 60_pcos "
        "61_scd 62_cp 63_burn 64_gastro 65_pneumonia 66_cold 67_gdm 68_ghtn 69_fungal 70_scabies "
        "71_uti 72_skin_infection 73_contact_derm 74_urticaria 75_acne 76_pms 77_gastritis 78_otitis 79_sebderm 80_varicella "
        "81_pop 82_glaucoma 83_amd 84_g6pd 85_thalassemia 86_pressure 87_pneumoconiosis 88_mnd 89_autism 90_adhd "
        "91_ppd 92_chd 93_preterm 94_longcovid 95_idd 96_conduct 97_downs 98_ntd 99_cleft"
    ).split()
]


def run_tier1(runner: TestRunner) -> None:
    # ---------------- Area 1: 3D Sanctuary (7 tests) ----------------
    def t1_3d_01() -> None:
        s = runner.open_session(viewport=DESKTOP)
        info = s.page.evaluate(
            """() => ({
              hasThree: typeof window.THREE === 'object' && window.THREE !== null,
              hasOrbit: typeof (window.THREE_ADDONS?.OrbitControls || window.THREE?.OrbitControls) === 'function',
              moduleScripts: document.querySelectorAll('script[type="module"]').length
            })"""
        )
        assert info["hasThree"], "window.THREE global not loaded (M1 Three.js vendor IIFE missing)"
        assert info["hasOrbit"], "OrbitControls not attached on window.THREE_ADDONS or window.THREE"
        assert info["moduleScripts"] == 0, f"Found {info['moduleScripts']} <script type='module'> tags"

    def t1_3d_02() -> None:
        for label, vp in [("desktop", DESKTOP), ("mobile", MOBILE)]:
            s = runner.open_session(viewport=vp)
            res = s.page.evaluate(
                """() => {
                  const box = document.getElementById('scene3d');
                  if (!box) return { exists: false };
                  const c = box.querySelector('canvas');
                  if (!c) return { exists: true, hasCanvas: false };
                  const r = c.getBoundingClientRect();
                  const gl = c.getContext('webgl2') || c.getContext('webgl');
                  return {
                    exists: true,
                    hasCanvas: true,
                    cw: r.width,
                    ch: r.height,
                    pw: c.width,
                    ph: c.height,
                    hasGL: Boolean(gl) && !box.classList.contains('scene3d--fallback'),
                  };
                }"""
            )
            assert res["exists"], f"#scene3d container missing on {label}"
            assert res.get("hasCanvas"), f"#scene3d has no <canvas> on {label}"
            assert res.get("hasGL"), f"#scene3d WebGL inactive or in fallback mode on {label}: {res}"
            assert res["cw"] >= 300 and res["ch"] >= 300, f"#scene3d canvas too small on {label}: {res['cw']}x{res['ch']}"
            assert res["pw"] > 0 and res["ph"] > 0, f"#scene3d canvas backing buffer is 0 on {label}"

    def t1_3d_03() -> None:
        s = runner.open_session(viewport=DESKTOP)
        methods = s.page.evaluate(
            """() => {
              const u = window.UnderwingScene;
              if (!u || typeof u !== 'object') return null;
              return ['init', 'setTheme', 'setReducedMotion', 'focusZone', 'setSuspended']
                .filter(k => typeof u[k] !== 'function');
            }"""
        )
        assert methods is not None, "window.UnderwingScene global missing (M3 missing)"
        assert methods == [], f"Missing UnderwingScene methods: {methods}"

    def t1_3d_04() -> None:
        s = runner.open_session(viewport=DESKTOP)
        ok = s.page.evaluate("typeof window.UnderwingScene?.focusZone === 'function'")
        assert ok, "window.UnderwingScene.focusZone not defined"
        for z in ("home", "cards", "hubs", "folder", "redlines"):
            s.page.evaluate("(z) => window.UnderwingScene.focusZone(z)", z)
            s.page.wait_for_timeout(40)
        dim = s.page.evaluate("document.querySelector('#scene3d canvas')?.getBoundingClientRect()?.width || 0")
        assert dim >= 300, "Canvas lost dimensions after focusZone sequence"

    def t1_3d_05() -> None:
        s = runner.open_session(viewport=DESKTOP)
        ok = s.page.evaluate("typeof window.UnderwingScene?.setTheme === 'function'")
        assert ok, "window.UnderwingScene.setTheme not defined"
        s.page.evaluate("() => { window.UnderwingScene.setTheme('dark'); window.UnderwingScene.setTheme('light'); }")
        s.page.wait_for_timeout(50)
        dim = s.page.evaluate("document.querySelector('#scene3d canvas')?.getBoundingClientRect()?.width || 0")
        assert dim >= 300, "Canvas dimensions invalid after setTheme"

    def t1_3d_06() -> None:
        s = runner.open_session(viewport=DESKTOP)
        box = s.page.locator("#scene3d canvas").first
        assert box.count() == 1, "#scene3d canvas not found"
        rect = box.bounding_box()
        assert rect and rect["width"] >= 200 and rect["height"] >= 200, "Canvas bounding box too small"
        cx, cy = rect["x"] + rect["width"] * 0.5, rect["y"] + rect["height"] * 0.5
        s.page.mouse.move(cx, cy)
        s.page.mouse.down()
        s.page.mouse.move(cx + 80, cy - 40, steps=5)
        s.page.mouse.up()
        s.page.mouse.wheel(0, -120)
        s.page.wait_for_timeout(80)
        assert not s.page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"), "Orbit drag caused overflow"

    def t1_3d_07() -> None:
        s = runner.open_session(viewport=DESKTOP)
        assert s.page.evaluate("typeof window.UnderwingScene?.init === 'function'"), "window.UnderwingScene.init not defined"
        hotspot = s.page.locator("[data-hotspot], [data-zone]").locator("visible=true")
        if hotspot.count() > 0:
            before = s.page.evaluate("({hash:location.hash,zone:window.UnderwingScene.getState?.().zone||null})")
            b_sh = visible_sheet(s.page).count()
            idx = 0
            for i in range(hotspot.count()):
                el = hotspot.nth(i)
                dz, dh = el.get_attribute("data-zone"), el.get_attribute("data-hotspot")
                if (dz and dz != before["zone"]) or (dh and dh not in before["hash"]):
                    idx = i
                    break
            hotspot.nth(idx).click()
            s.page.wait_for_timeout(150)
            after = s.page.evaluate("({hash:location.hash,zone:window.UnderwingScene.getState?.().zone||null})")
            a_sh = visible_sheet(s.page).count()
            assert after["hash"] != before["hash"] or a_sh > b_sh or after["zone"] != before["zone"], (
                f"Hotspot click produced no route/sheet/zone reaction: before={before}, after={after}"
            )
            if a_sh > 0:
                close_sheet(s.page)
        else:
            res = s.page.evaluate(
                """() => {
  const h = document.createElement('div');
  h.style.cssText = 'position:fixed;left:0;top:0;width:480px;height:360px;z-index:99999';
  document.body.appendChild(h);
  let picked = null;
  const ctrl = window.UnderwingScene.init(h, { onHotspotSelect: t => { picked = t; } });
  const c = h.querySelector('canvas'), r = c ? c.getBoundingClientRect() : null;
  if (c && r) for (let y = .25; y <= .85 && !picked; y += .05) for (let x = .15; x <= .85 && !picked; x += .05)
    c.dispatchEvent(new MouseEvent('click', { clientX: r.left + r.width * x, clientY: r.top + r.height * y, bubbles: true }));
  const out = { ok: Boolean(ctrl && typeof ctrl.destroy === 'function'), hasWebglProp: typeof ctrl?.webgl === 'boolean', webgl: Boolean(ctrl?.webgl), picked };
  ctrl?.destroy?.(); h.remove();
  return out;
}"""
            )
            assert res["ok"] and res["hasWebglProp"] and res["webgl"], f"UnderwingScene.init invalid: {res}"
            assert isinstance(res["picked"], dict) and (
                res["picked"].get("route") or res["picked"].get("zone") or res["picked"].get("id")
            ), f"onHotspotSelect callback not invoked on 3D hotspot click: {res}"
        nav_hash(s.page, "#/card/bp")
        assert "#/card/bp" in s.page.evaluate("location.hash"), "Route bridge failed for #/card/bp"
        nav_hash(s.page, "#/library")
        assert "#/library" in s.page.evaluate("location.hash"), "Route bridge failed for #/library"

    runner.run_case("T1-3D-01", 1, "F2/F6", "Vendor globals THREE, OrbitControls, classic scripts", t1_3d_01)
    runner.run_case("T1-3D-02", 1, "F6", "#scene3d WebGL canvas dimensions on desktop & mobile", t1_3d_02)
    runner.run_case("T1-3D-03", 1, "F6", "window.UnderwingScene contract surface", t1_3d_03)
    runner.run_case("T1-3D-04", 1, "F6", "UnderwingScene.focusZone transitions", t1_3d_04)
    runner.run_case("T1-3D-05", 1, "F6", "UnderwingScene.setTheme dark/light switch", t1_3d_05)
    runner.run_case("T1-3D-06", 1, "F6", "OrbitControls pointer drag and wheel zoom", t1_3d_06)
    runner.run_case("T1-3D-07", 1, "F6", "Hotspot selection & route bridge", t1_3d_07)

    # ---------------- Area 2: Navigation & Sheets (6 tests) ----------------
    def t1_nav_01() -> None:
        s = runner.open_session(viewport=DESKTOP)
        res = s.page.evaluate(
            """() => ({
              hasPane: typeof window.CupertinoPane === 'function',
              hasAnimate: typeof window.Motion?.animate === 'function',
              hasSpring: typeof window.Motion?.spring === 'function'
            })"""
        )
        assert res["hasPane"], "window.CupertinoPane constructor missing (M1 iOS vendor IIFE missing)"
        assert res["hasAnimate"] and res["hasSpring"], "window.Motion.{animate,spring} missing"

    def t1_nav_02() -> None:
        s = runner.open_session(viewport=MOBILE)
        for view in ("library", "folder", "settings", "cards"):
            btn = s.page.locator(f"[data-nav='{view}']:visible")
            assert btn.count() > 0, f"Mobile nav target [data-nav='{view}'] not visible at 390x844"
            btn.first.click()
            s.page.wait_for_timeout(100)
            h = s.page.evaluate("location.hash")
            assert f"#/{view}" in h, f"Expected hash #/{view}, got {h}"
            cur = s.page.locator(f"[data-nav='{view}']:visible").first.get_attribute("aria-current")
            assert cur in ("true", "page"), f"aria-current not set on active mobile tab {view}: {cur}"

    def t1_nav_03() -> None:
        s = runner.open_session(viewport=DESKTOP)
        for view in ("library", "folder", "settings", "cards"):
            btn = s.page.locator(f"[data-nav='{view}']:visible")
            assert btn.count() > 0, f"Desktop nav target [data-nav='{view}'] not visible at 1440x900"
            btn.first.click()
            s.page.wait_for_timeout(90)
            assert f"#/{view}" in s.page.evaluate("location.hash")

    def t1_nav_04() -> None:
        s = runner.open_session(viewport=DESKTOP)
        trigger = s.page.locator("[data-act='addbp']:visible, [data-act='redlines']:visible").first
        assert trigger.count() == 1, "No [data-act='addbp'|'redlines'] trigger visible"
        trigger.click()
        wait_sheet_open(s.page)
        assert visible_sheet(s.page).count() >= 1, "Sheet/dialog did not open"
        close_sheet(s.page)
        assert visible_sheet(s.page).count() == 0, "Sheet/dialog remained open after dismiss"

    def t1_nav_05() -> None:
        s = runner.open_session(viewport=DESKTOP)
        missing = s.page.evaluate(
            """() => [...document.querySelectorAll('svg use')]
              .map(u => u.getAttribute('href') || u.getAttribute('xlink:href') || '')
              .filter(href => href.startsWith('#') && !document.querySelector(href))"""
        )
        assert not missing, f"Unresolved SVG <use> references: {missing[:6]}"

    def t1_nav_06() -> None:
        s = runner.open_session(viewport=DESKTOP)
        s.page.keyboard.press("2")
        s.page.wait_for_timeout(80)
        assert "#/library" in s.page.evaluate("location.hash")
        s.page.keyboard.press("/")
        s.page.wait_for_timeout(80)
        assert s.page.evaluate("document.activeElement?.id === 'q'"), "'/' did not focus #q"
        s.page.keyboard.press("Escape")
        s.page.evaluate("document.activeElement?.blur?.()")
        s.page.keyboard.press("3")
        s.page.wait_for_timeout(80)
        assert "#/folder" in s.page.evaluate("location.hash")
        s.page.keyboard.press("4")
        s.page.wait_for_timeout(80)
        assert "#/settings" in s.page.evaluate("location.hash")
        s.page.keyboard.press("1")
        s.page.wait_for_timeout(80)
        assert "#/cards" in s.page.evaluate("location.hash")
        s.page.keyboard.press("n")
        wait_sheet_open(s.page)
        assert s.page.locator("#fs").count() == 1, "'n' did not open BP entry sheet"
        close_sheet(s.page)

    runner.run_case("T1-NAV-01", 1, "F2/F7", "CupertinoPane & Motion vendor globals", t1_nav_01)
    runner.run_case("T1-NAV-02", 1, "F7", "Mobile 390x844 tab bar navigation", t1_nav_02)
    runner.run_case("T1-NAV-03", 1, "F7", "Desktop 1440x900 sidebar/HUD navigation", t1_nav_03)
    runner.run_case("T1-NAV-04", 1, "F7", "Sheet/dialog open and dismiss lifecycle", t1_nav_04)
    runner.run_case("T1-NAV-05", 1, "F3", "Inline SVG <symbol> sprite resolution", t1_nav_05)
    runner.run_case("T1-NAV-06", 1, "F7", "Desktop keyboard shortcuts 1-4, /, N", t1_nav_06)

    # ---------------- Area 3: Care Deck & 15 Cards (7 tests) ----------------
    def t1_deck_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        deck = get_db(s.page).get("deck", [])
        assert deck == ["bp", "followup", "medlog"], f"Unexpected seed deck: {deck}"
        assert s.page.locator("[data-tile='symptom'] [data-deck='symptom']").count() >= 1, "symptom not recommended on initial home"

    def t1_deck_02() -> None:
        s = runner.open_session(viewport=DESKTOP)
        res = s.page.evaluate(
            """(expected) => {
              const keys = Object.keys(CARDS);
              const missing = expected.filter(k => !keys.includes(k));
              const notReady = keys.filter(k => !CARDS[k].ready);
              const badClin = keys.filter(k => CARDS[k].kind === 'clinical' && (!(CARDS[k].srcKeys || []).length || CARDS[k].srcKeys.some(s => SOURCES[s]?.v !== 'ok')));
              const badOrg = keys.filter(k => CARDS[k].kind === 'organize' && !CARDS[k].ready);
              return { count: keys.length, missing, notReady, badClin, badOrg };
            }""",
            EXPECTED_15_CARDS,
        )
        assert res["count"] == 15 and not res["missing"], f"Card count/keys mismatch: {res}"
        assert not res["notReady"], f"Unready cards: {res['notReady']}"
        assert not res["badClin"] and not res["badOrg"], f"Card clinical/organize contract mismatch: {res}"

    def t1_deck_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        flip_btn = s.page.locator("[data-tile='bp'] [data-flip='bp']").first
        flip_btn.click()
        s.page.wait_for_timeout(80)
        assert flip_btn.get_attribute("aria-expanded") == "true"
        st = s.page.evaluate(
            """() => {
  const t = document.querySelector("[data-tcg='bp']");
  return { flipped: t?.classList.contains('flipped'), frontInert: t?.querySelector('.front')?.hasAttribute('inert'), backInert: t?.querySelector('.back')?.hasAttribute('inert'), frontAria: t?.querySelector('.front')?.getAttribute('aria-hidden'), backAria: t?.querySelector('.back')?.getAttribute('aria-hidden') };
}"""
        )
        assert st["flipped"] and st["frontInert"] and not st["backInert"], f"Invalid flip state: {st}"
        assert st["frontAria"] == "true" and st["backAria"] == "false"
        flip_btn.click()
        s.page.wait_for_timeout(80)
        assert flip_btn.get_attribute("aria-expanded") == "false"
        s.page.locator("[data-tcg='bp'] .front img").first.click()
        s.page.wait_for_timeout(60)
        assert flip_btn.get_attribute("aria-expanded") == "true"
        s.page.locator("[data-tcg='bp'] .back > div").first.click()
        s.page.wait_for_timeout(60)
        assert flip_btn.get_attribute("aria-expanded") == "false"

    def t1_deck_04() -> None:
        s = runner.open_session(viewport=DESKTOP)
        for k in EXPECTED_15_CARDS:
            nav_hash(s.page, f"#/card/{k}", wait_ms=50)
            info = s.page.evaluate(
                """(key) => ({
                  hash: location.hash,
                  h1: document.querySelector('#app h1')?.textContent?.trim() || '',
                  hasStop: Boolean(document.querySelector('#stopH')),
                  hasStepsOrTool: document.querySelectorAll('#app ol.steps li, #medForm, #symForm').length > 0
                })""",
                k,
            )
            assert f"#/card/{k}" in info["hash"] and info["h1"], f"Card {k} did not render title"
            assert info["hasStop"], f"Card {k} missing #stopH"
            assert info["hasStepsOrTool"], f"Card {k} missing steps/tool UI"

    def t1_deck_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/insulin_pen")
        s.page.locator("ol.steps li").nth(0).locator(".stepbtn").click()
        s.page.locator("ol.steps li").nth(1).locator(".stepbtn").click()
        s.page.wait_for_timeout(60)
        pt = s.page.locator("#ptext").text_content() or ""
        assert pt.startswith("2 /"), f"Expected '2 / ...', got {pt}"
        assert s.page.evaluate("document.querySelectorAll('ol.steps li')[2]?.classList.contains('is-next')"), "Step 2 missing .is-next"
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        assert s.page.locator("ol.steps li.done").count() == 2, "Step progress did not persist across reload"
        s.page.locator("[data-act='resetsteps']").click()
        s.page.wait_for_timeout(60)
        assert s.page.locator("ol.steps li.done").count() == 0
        assert (s.page.locator("#ptext").text_content() or "").startswith("0 /")

    def t1_deck_06() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        s.page.fill("#q", "中风")
        s.page.wait_for_timeout(80)
        s.page.locator("[data-deck='fall']").first.click()
        s.page.wait_for_timeout(60)
        assert "fall" in get_db(s.page).get("deck", [])
        nav_hash(s.page, "#/cards", wait_ms=80)
        s.page.locator("[data-undeck='fall']").first.click()
        s.page.wait_for_timeout(60)
        assert "fall" not in get_db(s.page).get("deck", [])
        s.page.locator("#toastUndo").click()
        s.page.wait_for_timeout(60)
        assert "fall" in get_db(s.page).get("deck", []), "Undo did not restore 'fall' to deck"

    def t1_deck_07() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/medlog")
        s.page.fill("#mn", "示例降压片")
        s.page.fill("#mh", "每日早一次")
        s.page.locator("#medForm button").click()
        s.page.wait_for_timeout(60)
        s.page.locator("[data-take]").last.click()
        s.page.wait_for_timeout(60)
        assert "今天已记 1 次" in (s.page.locator("#app").inner_text())
        nav_hash(s.page, "#/card/symptom", wait_ms=80)
        s.page.fill("#sw", "夜间咳嗽")
        s.page.fill("#sl", "4")
        s.page.fill("#sd", "平躺后加重")
        s.page.locator("#symForm button").click()
        s.page.wait_for_timeout(60)
        syms = get_db(s.page).get("symptoms", [])
        assert any(x.get("what") == "夜间咳嗽" and x.get("lvl") == 4 for x in syms), f"Symptom not persisted: {syms}"

    runner.run_case("T1-DECK-01", 1, "F8", "Initial 3-card seed deck & recommendation", t1_deck_01)
    runner.run_case("T1-DECK-02", 1, "F8", "All 15 CARDS ready & rarity invariants", t1_deck_02)
    runner.run_case("T1-DECK-03", 1, "F8", "TCG W3C Disclosure flip & inert toggle", t1_deck_03)
    runner.run_case("T1-DECK-04", 1, "F8", "All 15 card detail views open & render", t1_deck_04)
    runner.run_case("T1-DECK-05", 1, "F8", "Step checkoff, .is-next, persistence & reset", t1_deck_05)
    runner.run_case("T1-DECK-06", 1, "F8", "Deck add, remove & toast undo", t1_deck_06)
    runner.run_case("T1-DECK-07", 1, "F8", "Organize cards medlog & symptom live logging", t1_deck_07)

    # ---------------- Area 4: 51 Clinical Sources (5 tests) ----------------
    def t1_src_01() -> None:
        s = runner.open_session(viewport=DESKTOP)
        res = s.page.evaluate(
            """() => {
              const vals = Object.values(SOURCES);
              const bad = Object.entries(SOURCES)
                .filter(([, v]) => v.v !== 'ok' || !v.t || !v.pub || !v.url)
                .map(([k]) => k);
              return { count: vals.length, bad };
            }"""
        )
        assert res["count"] == 51 and not res["bad"], f"SOURCES integrity failure: {res}"

    def t1_src_02() -> None:
        s = runner.open_session(viewport=DESKTOP)
        for k in CLINICAL_12_CARDS:
            nav_hash(s.page, f"#/card/{k}", wait_ms=40)
            assert_all_refs_resolve(s.page, "#app")
            bedside_btn = s.page.locator("[data-act='bedside']:visible")
            assert bedside_btn.count() > 0, f"Bedside button missing on clinical card {k}"
            bedside_btn.first.click()
            wait_sheet_open(s.page)
            assert_sheet_refs_resolve(s.page, f"Bedside {k}")
            close_sheet(s.page)
        nav_hash(s.page, "#/cards", wait_ms=40)
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        assert visible_sheet(s.page).locator(".ref a[href^='#src-']").count() >= 1, "Red-Lines sheet missing .ref links"
        assert_sheet_refs_resolve(s.page, "Red-Lines")
        close_sheet(s.page)

    def t1_src_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/bp")
        bad = s.page.evaluate(
            """() => [...document.querySelectorAll('#srcH a')]
              .filter(a => !/^https?:\\/\\//.test(a.getAttribute('href') || '') || a.target !== '_blank' || !(a.rel || '').includes('noopener'))
              .map(a => a.outerHTML.slice(0, 80))"""
        )
        assert not bad, f"Unsafe external source links: {bad}"

    def t1_src_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/dementia")
        tags = s.page.evaluate("[...document.querySelectorAll('#srcH .vtag')].map(e => e.textContent.trim())")
        assert len(tags) == 10 and all(t == "已通读核对" for t in tags), f"Dementia source badges invalid: {tags}"

    def t1_src_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        txt = s.page.locator("#app").inner_text()
        assert "51 条" in txt and "51 条已通读核对" in txt and "0 条待人工通读" in txt, "Settings 51/51 source summary missing"

    runner.run_case("T1-SRC-01", 1, "F8", "All 51 SOURCES verified v:'ok'", t1_src_01)
    runner.run_case("T1-SRC-02", 1, "F8", "100% .ref links resolve to #src-* across 12 clinical cards", t1_src_02)
    runner.run_case("T1-SRC-03", 1, "F8", "External source link safety attributes", t1_src_03)
    runner.run_case("T1-SRC-04", 1, "F8", "Dementia 10 source verification badges", t1_src_04)
    runner.run_case("T1-SRC-05", 1, "F8", "Settings source changelog 51/51 summary", t1_src_05)

    # ---------------- Area 5: 48 Conditions (5 tests) ----------------
    def t1_cond_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        g_count = s.page.evaluate("Object.keys(GROUPS).length")
        c_count = s.page.locator("[data-cond]").count()
        assert g_count == 8, f"Expected 8 GROUPS, got {g_count}"
        assert c_count == 48, f"Expected 48 conditions, got {c_count}"

    def t1_cond_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        s.page.locator("[data-cond='t2d']").click()
        s.page.locator("[data-cond='copd']").click()
        s.page.wait_for_timeout(80)
        assert s.page.locator("[data-cond='t2d']").get_attribute("aria-pressed") == "true"
        assert s.page.locator("[data-cond='copd']").get_attribute("aria-pressed") == "true"
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        my_conds = get_db(s.page).get("myConds", [])
        assert "t2d" in my_conds and "copd" in my_conds, f"Conditions did not persist: {my_conds}"

    def t1_cond_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        s.page.locator("[data-cond='t2d']").click()
        s.page.wait_for_timeout(60)
        click_nav(s.page, "cards")
        app_txt = s.page.locator("#app").inner_text()
        assert "2 型糖尿病" in app_txt, "Recommendation reason '2 型糖尿病' missing on Home"
        for k in ("glucose", "hypo", "insulin_pen"):
            assert s.page.locator(f"[data-tile='{k}']").count() >= 1, f"Recommended card {k} missing for t2d"

    def t1_cond_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        s.page.fill("#q", "中风")
        s.page.wait_for_timeout(80)
        assert s.page.locator("[data-cond='stroke']").count() == 1
        assert s.page.locator("[data-card='fall'], [data-deck='fall']").count() >= 1
        s.page.fill("#q", "老年痴呆")
        s.page.wait_for_timeout(80)
        assert s.page.locator("[data-cond='dementia']").count() == 1, "Alias '老年痴呆' did not match dementia"

    def t1_cond_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        s.page.fill("#q", "渐冻症")
        s.page.wait_for_timeout(80)
        s.page.locator("[data-addcustom]").first.click()
        s.page.wait_for_timeout(80)
        db = get_db(s.page)
        assert "渐冻症" in db.get("customConds", [])
        for k in ("followup", "medlog", "symptom"):
            assert k in db.get("deck", []), f"GENERAL card {k} not synced on custom condition"
        s.page.locator("[data-libtab='conds']").click()
        s.page.wait_for_timeout(60)
        s.page.locator("[data-rmcustom='渐冻症']").first.click()
        s.page.wait_for_timeout(60)
        assert "渐冻症" not in get_db(s.page).get("customConds", [])

    runner.run_case("T1-COND-01", 1, "F9", "48 CONDITIONS across 8 GROUPS", t1_cond_01)
    runner.run_case("T1-COND-02", 1, "F9", "Multi-select condition toggle & persistence", t1_cond_02)
    runner.run_case("T1-COND-03", 1, "F9", "Condition selection drives Home recommendations", t1_cond_03)
    runner.run_case("T1-COND-04", 1, "F9", "Search by condition name & alias", t1_cond_04)
    runner.run_case("T1-COND-05", 1, "F9", "Custom condition add/remove & GENERAL sync", t1_cond_05)

    # ---------------- Area 6: 86 Active Disease Hubs (5 tests) ----------------
    def t1_hub_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        meta = s.page.evaluate("({ len: DISEASE_HUBS.length, t1: DISEASE_HUBS.filter(h => h.tier === 1).length, t2: DISEASE_HUBS.filter(h => h.tier === 2).length })")
        dom_cnt = s.page.locator("[data-hub]").count()
        assert meta["len"] == 86 and dom_cnt == 86, f"Expected 86 hubs, got data={meta['len']} dom={dom_cnt}"
        assert meta["t1"] == 20 and meta["t2"] == 66, f"Tier count mismatch: {meta}"

    def t1_hub_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        assert s.page.evaluate("AGE_BANDS.length") == 6
        s.page.locator("[data-age='0-5']").click()
        s.page.wait_for_timeout(80)
        cnt = s.page.locator("[data-hub]").count()
        assert 0 < cnt < 86 and "age=0-5" in s.page.evaluate("location.hash"), f"0-5 filter failed: cnt={cnt}"
        s.page.locator("[data-age='all']").click()
        s.page.wait_for_timeout(80)
        assert s.page.locator("[data-hub]").count() == 86

    def t1_hub_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        s.page.locator("[data-sys='cv']").click()
        s.page.wait_for_timeout(80)
        cnt = s.page.locator("[data-hub]").count()
        assert 0 < cnt < 86, f"cv filter count unexpected: {cnt}"
        s.page.locator("[data-sys='all']").click()
        s.page.wait_for_timeout(80)
        assert s.page.locator("[data-hub]").count() == 86

    def t1_hub_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        btn = s.page.locator("[data-hub='01_heart']").first
        btn.click()
        s.page.wait_for_timeout(120)
        assert btn.get_attribute("aria-expanded") == "true"
        assert "hub=01_heart" in s.page.evaluate("location.hash")
        assert s.page.locator("[data-hub='01_heart'][aria-expanded='true']").count() >= 1
        assert s.page.locator("[data-deckbatch]").count() >= 1

    def t1_hub_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs&hub=04_diabetes")
        batch_btn = s.page.locator("[data-deckbatch]").first
        keys = [x.strip() for x in (batch_btn.get_attribute("data-deckbatch") or "").split(",") if x.strip()]
        assert len(keys) >= 1
        batch_btn.click()
        s.page.wait_for_timeout(80)
        deck = get_db(s.page).get("deck", [])
        assert all(k in deck for k in keys), f"Batch add missing keys from {keys} in {deck}"

    runner.run_case("T1-HUB-01", 1, "F9", "86 active DISEASE_HUBS catalog load", t1_hub_01)
    runner.run_case("T1-HUB-02", 1, "F9", "6 AGE_BANDS filtering & reset", t1_hub_02)
    runner.run_case("T1-HUB-03", 1, "F9", "8 GROUPS system filtering & reset", t1_hub_03)
    runner.run_case("T1-HUB-04", 1, "F9", "Hub fan-out stage overview & sub-cards", t1_hub_04)
    runner.run_case("T1-HUB-05", 1, "F9", "Hub batch-add [data-deckbatch] to deck", t1_hub_05)

    # ---------------- Area 7: Health Folder, Vitals, Charts & Print (6 tests) ----------------
    def t1_fldr_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        s.page.locator("[data-filter='pend']").click()
        s.page.wait_for_timeout(60)
        pend_before = s.page.locator("[data-confirm]").count()
        assert pend_before >= 1, "Expected >=1 pending item in seed"
        s.page.locator("[data-confirm]").first.click()
        s.page.wait_for_timeout(60)
        assert s.page.locator("[data-confirm]").count() == pend_before - 1
        s.page.locator("[data-filter='all']").click()
        s.page.wait_for_timeout(60)
        del_btns = s.page.locator("[data-del]")
        assert del_btns.count() > 0, "Expected >= 1 [data-del] button in folder timeline"
        ev_count = len(get_db(s.page).get("events", [])) + len(get_db(s.page).get("readings", []))
        del_btns.first.click()
        s.page.wait_for_timeout(60)
        s.page.locator("#toastUndo").click()
        s.page.wait_for_timeout(60)
        after_count = len(get_db(s.page).get("events", [])) + len(get_db(s.page).get("readings", []))
        assert after_count == ev_count, "Delete undo did not restore record"

    def t1_fldr_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        with s.page.expect_file_chooser() as fc:
            s.page.locator("[data-act='upload']").click()
        fc.value.set_files([{"name": "clinic_record.png", "mimeType": "image/png", "buffer": PNG_1X1_BYTES}])
        s.page.wait_for_timeout(150)
        s.page.fill("#ut", "社区门诊病历")
        s.page.locator("#upf button[type='submit'], #upf button:not([data-close])").first.click()
        s.page.wait_for_timeout(350)
        assert s.page.locator("text=社区门诊病历").count() >= 1
        has_blob = s.page.evaluate("[...document.querySelectorAll('img[data-fid]')].some(i => i.src.startsWith('blob:'))")
        assert has_blob, "Uploaded thumbnail did not bind blob: URL"
        idb_count = s.page.evaluate(
            """() => new Promise((res, rej) => {
              const req = indexedDB.open('underwing-files');
              req.onerror = () => rej(req.error);
              req.onsuccess = () => {
                const db = req.result;
                const store = db.objectStoreNames[0];
                const tx = db.transaction(store, 'readonly').objectStore(store).count();
                tx.onsuccess = () => res(tx.result);
                tx.onerror = () => rej(tx.error);
              };
            })"""
        )
        assert idb_count >= 1, "Uploaded file not stored in IndexedDB 'underwing-files'"

    def t1_fldr_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        # BP
        s.page.locator("[data-act='addbp']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fs", "128")
        s.page.fill("#fdi", "78")
        s.page.locator("#f button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        assert any(r["sys"] == 128 and r["dia"] == 78 for r in get_db(s.page).get("readings", []))
        # Glucose
        s.page.locator("[data-act='addglucose']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fgv", "6.2")
        s.page.locator("#fg button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        assert any(abs(g["val"] - 6.2) < 0.05 for g in get_db(s.page).get("glucoseReadings", []))
        # Weight
        s.page.locator("[data-act='addweight']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fwk", "60.5")
        s.page.locator("#fw button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        assert any(abs(w["kg"] - 60.5) < 0.05 for w in get_db(s.page).get("weightReadings", []))

    def t1_fldr_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        for ck in ("bp", "glucose", "weight"):
            s.page.locator(f"[data-chart='{ck}']").click()
            s.page.wait_for_timeout(60)
            assert s.page.locator("svg[role='img'][aria-label*='趋势'] polyline").count() >= 1, f"Chart {ck} missing polyline SVG"
            pt_ok = s.page.evaluate(
                """() => {
                  const pt = document.querySelector("svg[role='img'][aria-label*='趋势'] circle[data-pt][tabindex='0']");
                  if (!pt) return false;
                  const expected = pt.getAttribute('data-pt') || '';
                  pt.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
                  const ro = document.getElementById('chartReadout')?.textContent || '';
                  return expected.length > 0 && ro.includes(expected) && (pt.classList.contains('is-active') || pt.getAttribute('aria-current') === 'true');
                }"""
            )
            assert pt_ok, f"Chart {ck} #chartReadout hover update failed"

    def t1_fldr_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        before_lbl = s.page.locator("#app [role='img'][aria-label*='复诊准备']").get_attribute("aria-label") or ""
        assert "共 5 项" in before_lbl
        s.page.locator("[data-prep='questions']").click()
        wait_sheet_open(s.page)
        s.page.fill("#qa", "早上血压偏高怎么记录？")
        s.page.locator("#qsave").click()
        s.page.wait_for_timeout(60)
        s.page.locator("[data-prep='meds']").click()
        s.page.wait_for_timeout(60)
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        prep = get_db(s.page).get("prep", {})
        assert "早上血压偏高" in prep.get("questions", "") and prep.get("medsReady") is True

    def t1_fldr_06() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        txt = sheet_text(s.page)
        for must in ("王秀兰", "虚构", "1. 本次最想问医生的问题", "2. 目前用药记录", "3. 近期已确认居家监测汇总", "4. 近期症状日记", "5. 关键病历事件"):
            assert must in txt, f"Clinic sheet missing '{must}'"
        s.page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
        printf = s.page.locator("#printf").text_content() or ""
        assert "打印于" in printf and "鹤伴" in printf
        s.page.emulate_media(media="print")
        no_print_vis = s.page.evaluate(
            "[...document.querySelectorAll('.no-print')].some(e => getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0)"
        )
        assert not no_print_vis, ".no-print elements still visible in @media print"

    runner.run_case("T1-FLDR-01", 1, "F10", "Folder timeline filters, confirm & delete-undo", t1_fldr_01)
    runner.run_case("T1-FLDR-02", 1, "F10", "IndexedDB file upload & blob preview", t1_fldr_02)
    runner.run_case("T1-FLDR-03", 1, "F10", "2-step BP, Glucose & Weight logging", t1_fldr_03)
    runner.run_case("T1-FLDR-04", 1, "F10", "3-metric SVG charts & #chartReadout", t1_fldr_04)
    runner.run_case("T1-FLDR-05", 1, "F10", "5-item prep ring & question persistence", t1_fldr_05)
    runner.run_case("T1-FLDR-06", 1, "F10/F12", "One-Page Clinic Sheet & @media print", t1_fldr_06)

    # ---------------- Area 8: Bedside Companion & Red-Lines (5 tests) ----------------
    def t1_safe_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/bp")
        s.page.locator("[data-act='bedside']").first.click()
        wait_sheet_open(s.page)
        txt = sheet_text(s.page)
        assert "第 1 /" in txt and "出现以下情况请立刻停下联系医护" in txt

    def t1_safe_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/insulin_pen")
        s.page.locator("[data-act='bedside']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#bsNext").click()
        s.page.wait_for_timeout(60)
        assert "第 2 /" in sheet_text(s.page)
        s.page.locator("[data-bsjump='4']").click()
        s.page.wait_for_timeout(60)
        assert "第 5 /" in sheet_text(s.page)
        s.page.locator("#bsPrev").click()
        s.page.wait_for_timeout(60)
        assert "第 4 /" in sheet_text(s.page)
        s.page.keyboard.press("ArrowRight")
        s.page.wait_for_timeout(60)
        assert "第 5 /" in sheet_text(s.page)
        last_idx = s.page.locator("[data-bsjump]").count() - 1
        s.page.locator(f"[data-bsjump='{last_idx}']").click()
        s.page.wait_for_timeout(60)
        s.page.locator("#bsFinish").click()
        s.page.wait_for_timeout(80)
        done = get_db(s.page).get("stepDone", {}).get("insulin_pen", [])
        assert 0 in done and last_idx in done, f"Bedside step sync mismatch: {done}"

    def t1_safe_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/bp")
        s.page.evaluate(
            """() => {
              window.__ttsLog = { spoke: [], canceled: 0 };
              window.SpeechSynthesisUtterance = function(t) { this.text = t; this.lang = ''; };
              Object.defineProperty(window, 'speechSynthesis', {
                configurable: true,
                value: {
                  getVoices: () => [],
                  speak: u => window.__ttsLog.spoke.push({ text: u.text, lang: u.lang }),
                  cancel: () => { window.__ttsLog.canceled++; }
                }
              });
            }"""
        )
        s.page.locator("[data-act='bedside']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#bsSpeakBtn").click()
        s.page.wait_for_timeout(50)
        log = s.page.evaluate("window.__ttsLog")
        assert len(log["spoke"]) == 1 and log["spoke"][0]["lang"] == "zh-CN", f"TTS speak mismatch: {log}"
        s.page.evaluate("window.__ttsLog.canceled = 0")
        close_sheet(s.page)
        canceled = s.page.evaluate("window.__ttsLog.canceled")
        assert canceled >= 1, f"speechSynthesis.cancel not called on close: {canceled}"

    def t1_safe_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        s.page.locator("[data-act='redlines']").first.click()
        wait_sheet_open(s.page)
        for grp in ("all", "cv", "dm", "fall", "re", "care"):
            s.page.locator(f"[data-rlgrp='{grp}']").click()
            s.page.wait_for_timeout(50)
            txt = sheet_text(s.page)
            assert "120" in txt and s.page.locator("[data-redcard]").count() >= 1, f"Redlines grp {grp} incomplete"
        assert visible_sheet(s.page).locator("details .sources li").count() >= 1

    def t1_safe_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        s.page.locator("[data-act='redlines']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("[data-rlgrp='dm']").click()
        s.page.locator("[data-redcard='hypo']").click()
        s.page.wait_for_timeout(100)
        assert visible_sheet(s.page).count() == 0
        assert "#/card/hypo" in s.page.evaluate("location.hash")

    runner.run_case("T1-SAFE-01", 1, "F11", "Bedside Companion opens & shows step & stopMini", t1_safe_01)
    runner.run_case("T1-SAFE-02", 1, "F11", "Bedside navigation, ArrowRight & DB.stepDone sync", t1_safe_02)
    runner.run_case("T1-SAFE-03", 1, "F11", "Bedside zh-CN TTS speak & cancel on close", t1_safe_03)
    runner.run_case("T1-SAFE-04", 1, "F11/F12", "Red-Lines Lookup opens & cycles 6 groups", t1_safe_04)
    runner.run_case("T1-SAFE-05", 1, "F11", "Red-Lines jump closes sheet & opens #/card/hypo", t1_safe_05)

    # ---------------- Area 9: Settings, AI Redaction, Backup & Hash Routing (7 tests) ----------------
    def t1_set_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        s.page.locator("[data-pref='theme'][data-val='dark']").click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.documentElement.dataset.theme") == "dark"
        assert get_prefs(s.page).get("theme") == "dark"
        s.page.locator("[data-pref='theme'][data-val='light']").click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.documentElement.dataset.theme") == "light"

    def t1_set_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        sizes = {}
        for sz in ("md", "lg", "xl"):
            s.page.locator(f"[data-pref='size'][data-val='{sz}']").click()
            s.page.wait_for_timeout(50)
            assert s.page.evaluate("document.documentElement.dataset.size") == sz
            sizes[sz] = s.page.evaluate("parseFloat(getComputedStyle(document.documentElement).fontSize)")
        assert sizes["md"] < sizes["lg"] < sizes["xl"], f"Font size did not scale: {sizes}"

    def t1_set_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        s.page.locator("[data-pref='motion'][data-val='reduce']").click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.documentElement.classList.contains('rm')")
        assert get_prefs(s.page).get("motion") == "reduce"

    def t1_set_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        s.page.locator("[data-act='ai']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#aiSample").click()
        s.page.locator("#aiNext1").click()
        s.page.wait_for_timeout(60)
        clean = s.page.input_value("#aiClean")
        for leak in ("王秀兰", "110101195405061234", "13812345678", "幸福小区", "李明华", "MZ20261020-0388", "社区卫生服务中心"):
            assert leak not in clean, f"PII leaked in #aiClean: {leak}"
        s.page.locator("#aiNext2").click()
        s.page.wait_for_timeout(60)
        assert s.page.locator(".disclose").is_visible()
        s.page.locator("#aiSend").click()
        s.page.wait_for_timeout(120)
        assert s.page.locator("[data-pick]").count() >= 3
        s.page.locator("#aiSave").click()
        s.page.wait_for_timeout(80)
        ai_evs = [e for e in get_db(s.page).get("events", []) if e.get("ai") and e.get("status") == "pend"]
        assert len(ai_evs) >= 3

    def t1_set_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        with s.page.expect_download() as dl_info:
            s.page.locator("[data-act='exportjson']").click()
        dl_path = dl_info.value.path()
        raw = open(dl_path, encoding="utf-8").read()
        payload = json.loads(raw)
        assert payload.get("schema") == "underwing.backup.v1" and payload.get("app") == "underwing"
        set_db_and_reload(s.page, "d => { d.customConds = ['待恢复临时条目']; }")
        s.page.locator("[data-act='importjson']").click()
        wait_sheet_open(s.page)
        s.page.fill("#impText", raw)
        s.page.locator("#impConfirmBtn").click()
        s.page.wait_for_timeout(100)
        assert "待恢复临时条目" not in get_db(s.page).get("customConds", [])

    def t1_set_06() -> None:
        for h, view in (
            ("#/cards", "cards"),
            ("#/library", "library"),
            ("#/folder", "folder"),
            ("#/settings", "settings"),
            ("#/card/wound", "card"),
        ):
            s = runner.open_session(viewport=DESKTOP, hash_path=h)
            assert h in s.page.evaluate("location.hash"), f"Boot hash {h} lost"
            h1 = s.page.locator("#app h1").first.inner_text().strip()
            assert h1, f"Boot hash {h} rendered empty h1"
            if view == "card":
                assert s.page.locator("#stopH").count() == 1 and s.page.evaluate("CARDS.wound.title") in h1
            else:
                assert s.page.locator(f"[data-nav='{view}'][aria-current='true'], [data-nav='{view}'][aria-current='page']").count() >= 1, f"Nav {view} not aria-current"

    def t1_set_07() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs&age=60%2B&sys=cv&hub=01_heart")
        assert s.page.locator("[data-libtab='hubs']").get_attribute("aria-selected") == "true"
        assert s.page.locator("[data-age='60+']").get_attribute("aria-pressed") == "true"
        assert s.page.locator("[data-sys='cv']").get_attribute("aria-pressed") == "true"
        assert s.page.locator("[data-hub='01_heart']").first.get_attribute("aria-expanded") == "true"
        assert s.page.locator("[data-deckbatch]").count() == 1
        nav_hash(s.page, "#/folder?filter=bp&chart=weight", wait_ms=100)
        assert s.page.locator("[data-nav='folder'][aria-current='true'], [data-nav='folder'][aria-current='page']").count() >= 1
        assert s.page.locator("[data-filter='bp']").get_attribute("aria-pressed") == "true"
        assert s.page.locator("[data-chart='weight']").get_attribute("aria-pressed") == "true"

    runner.run_case("T1-SET-01", 1, "F11", "Theme switcher light/dark/auto", t1_set_01)
    runner.run_case("T1-SET-02", 1, "F11/F3", "Font size md/lg/xl scaling", t1_set_02)
    runner.run_case("T1-SET-03", 1, "F11", "In-app reduced motion preference", t1_set_03)
    runner.run_case("T1-SET-04", 1, "F11", "4-step AI local PII redaction & extraction", t1_set_04)
    runner.run_case("T1-SET-05", 1, "F11", "JSON backup export & import restore", t1_set_05)
    runner.run_case("T1-SET-06", 1, "F7", "Boot hash routing across all 5 routes", t1_set_06)
    runner.run_case("T1-SET-07", 1, "F7", "Query-param hash deep links & hashchange", t1_set_07)

    # ---------------- Area 10: Mascot & WebP Assets (5 tests) ----------------
    def t1_art_01() -> None:
        for label, vp in [("desktop", DESKTOP), ("mobile", MOBILE)]:
            s = runner.open_session(viewport=vp, hash_path="#/cards")
            info = s.page.evaluate(
                """() => [...document.querySelectorAll('img')]
                  .filter(i => (i.getAttribute('src') || '').includes('mascot'))
                  .map(i => ({ src: i.getAttribute('src'), complete: i.complete, w: i.naturalWidth, h: i.naturalHeight }))"""
            )
            assert info, f"No mascot <img> found on {label}"
            assert all(x["src"].endswith("assets/art/cards/mascot.webp") and x["complete"] and x["w"] > 0 for x in info), f"Mascot broken on {label}: {info}"

    def t1_art_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        art_info = s.page.evaluate(
            "({ medArt: CARDS.medlog?.art, urls: [...new Set(Object.values(CARDS).map(c => `assets/art/cards/${c.art}.webp`))] })"
        )
        assert art_info["medArt"] == "meds", f"Expected medlog.art === 'meds', got {art_info['medArt']}"
        urls = art_info["urls"]
        assert len(urls) == 15
        res = decode_image_urls(s.page, urls)
        bad = [r for r in res if not r["ok"]]
        assert not bad, f"Broken card WebP(s): {bad[:5]}"
        dom_res = s.page.evaluate(
            """async () => {
  const imgs = [...document.querySelectorAll('#app img')];
  imgs.forEach(i => { if (i.loading === 'lazy') i.loading = 'eager'; });
  await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 3000); })));
  return { total: imgs.length, broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')) };
}"""
        )
        assert dom_res["total"] >= 15 and not dom_res["broken"], f"Surfaced card DOM <img> failures: {dom_res}"

    def t1_art_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        urls = s.page.evaluate("DISEASE_HUBS.map(h => `assets/art/disease/${h.artSlug}.webp`)")
        assert len(urls) == 86
        res = decode_image_urls(s.page, urls)
        bad = [r for r in res if not r["ok"]]
        assert not bad, f"Broken active hub WebP(s): {bad[:5]}"
        dom_res = s.page.evaluate(
            """async () => {
  const imgs = [...document.querySelectorAll('#app [data-hub] img')];
  imgs.forEach(i => { if (i.loading === 'lazy') i.loading = 'eager'; });
  await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 3000); })));
  return { total: imgs.length, broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')) };
}"""
        )
        assert dom_res["total"] >= 86 and not dom_res["broken"], f"Surfaced hub DOM <img> failures: {dom_res}"

    def t1_art_04() -> None:
        s = runner.open_session(viewport=DESKTOP)
        urls = [f"assets/art/disease/{fn}" for fn in ALL_99_DISEASE_FILES]
        res = decode_image_urls(s.page, urls)
        bad = [r for r in res if not r["ok"]]
        assert not bad, f"Broken disease WebP(s) among 99 files: {bad[:5]}"
        # Ensure diabetes_alt leak returns 404
        base = runner.base_url.rsplit("/", 1)[0]
        status: int | None = None
        try:
            with urllib.request.urlopen(f"{base}/assets/art/disease/diabetes_alt.webp", timeout=2.0) as resp:
                status = resp.status
        except urllib.error.HTTPError as exc:
            status = exc.code
            exc.close()
        assert status is not None and 400 <= status < 500, (
            f"Legacy diabetes_alt.webp should not exist (got HTTP {status})"
        )

    def t1_art_05() -> None:
        s = runner.open_session(viewport=DESKTOP)
        for h in ("#/cards", "#/library", "#/library?tab=hubs", "#/folder", "#/settings", "#/card/bp"):
            nav_hash(s.page, h, wait_ms=60)
            missing_alt = s.page.evaluate(
                "[...document.querySelectorAll('#app img, dialog[open] img, [role=\"dialog\"] img, .cupertino-pane-wrapper img')].filter(i => !i.hasAttribute('alt')).length"
            )
            assert missing_alt == 0, f"Found {missing_alt} <img> without alt on {h}"

    runner.run_case("T1-ART-01", 1, "F4", "Crane mascot.webp renders on desktop & mobile", t1_art_01)
    runner.run_case("T1-ART-02", 1, "F5", "All 15 Card WebPs decode & medlog.art==='meds'", t1_art_02)
    runner.run_case("T1-ART-03", 1, "F5", "All 86 active Disease Hub WebPs decode", t1_art_03)
    runner.run_case("T1-ART-04", 1, "F5", "All 99 assets/art/disease/*.webp valid & zero diabetes_alt", t1_art_04)
    runner.run_case("T1-ART-05", 1, "F4/F5", "All rendered <img> elements have alt attributes", t1_art_05)
