from __future__ import annotations

import json

from helpers import (
    DESKTOP,
    JS_CONTRAST,
    JS_IMAGES_CHECK,
    MOBILE,
    PNG_1X1_BYTES,
    assert_all_refs_resolve,
    cdp_ime_compose,
    click_nav,
    close_sheet,
    get_db,
    has_overflow,
    nav_hash,
    sheet_text,
    visible_sheet,
    wait_sheet_open,
)
from runtime import TestRunner


def run_tier3(runner: TestRunner) -> None:
    def t3_01() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        assert s.page.evaluate("typeof window.UnderwingScene?.focusZone === 'function'"), "UnderwingScene missing (M3)"
        bp_hotspot = s.page.locator("[data-hotspot='bp']:visible")
        zone_cards = s.page.locator("[data-zone='cards']:visible")
        if bp_hotspot.count() > 0:
            bp_hotspot.first.click()
            s.page.wait_for_timeout(100)
        elif zone_cards.count() > 0:
            before_zone = s.page.evaluate("window.UnderwingScene.getState?.().zone || null")
            zone_cards.first.click()
            s.page.wait_for_timeout(100)
            assert "#/cards" in s.page.evaluate("location.hash"), "Zone [data-zone='cards'] failed to activate #/cards"
            if before_zone is not None:
                assert s.page.evaluate("window.UnderwingScene.getState?.().zone") == "cards", "Zone [data-zone='cards'] did not focus 'cards'"
            s.page.locator("#app [data-tile='bp'] [data-card='bp'], #app [data-card='bp']").first.click()
            s.page.wait_for_timeout(100)
        else:
            before_hash = s.page.evaluate("location.hash")
            before_sheet = visible_sheet(s.page).count()
            bridge_ok = s.page.evaluate(
                """() => {
  const c = document.querySelector('#scene3d canvas');
  if (!c) return { hasCanvas: false, triggered: false };
  const r = c.getBoundingClientRect(), h0 = location.hash;
  for (let y = .25; y <= .85; y += .05) for (let x = .15; x <= .85; x += .05) {
    c.dispatchEvent(new MouseEvent('click', { clientX: r.left + r.width * x, clientY: r.top + r.height * y, bubbles: true }));
    if (location.hash !== h0 || document.querySelector('dialog[open],[role="dialog"][aria-modal="true"],.cupertino-pane-wrapper .pane'))
      return { hasCanvas: true, triggered: true, hash: location.hash };
  }
  return { hasCanvas: true, triggered: false, hash: location.hash };
}"""
            )
            assert bridge_ok["hasCanvas"], "#scene3d canvas missing for hotspot bridge"
            s.page.wait_for_timeout(80)
            after_sheet = visible_sheet(s.page).count()
            assert bridge_ok["triggered"] or s.page.evaluate("location.hash") != before_hash or after_sheet > before_sheet, (
                f"3D canvas hotspot click triggered no route or sheet reaction: {bridge_ok}"
            )
            if after_sheet > 0:
                close_sheet(s.page)
            if "#/cards" not in s.page.evaluate("location.hash"):
                click_nav(s.page, "cards")
            s.page.evaluate("window.UnderwingScene.focusZone('cards')")
            s.page.locator("#app [data-tile='bp'] [data-card='bp'], #app [data-card='bp']").first.click()
            s.page.wait_for_timeout(100)
        assert "#/card/bp" in s.page.evaluate("location.hash")
        s.page.locator("ol.steps li").nth(0).locator(".stepbtn").click()
        s.page.locator("ol.steps li").nth(1).locator(".stepbtn").click()
        s.page.wait_for_timeout(60)
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        assert s.page.locator("ol.steps li.done").count() == 2
        assert s.page.evaluate("document.querySelectorAll('ol.steps li')[2]?.classList.contains('is-next')")

    def t3_02() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=hubs")
        s.page.locator("[data-age='60+']").click()
        s.page.locator("[data-sys='cv']").click()
        s.page.wait_for_timeout(80)
        s.page.locator("[data-hub='35_heartfailure']").first.click()
        s.page.wait_for_timeout(100)
        s.page.locator("[data-deckbatch]").first.click()
        s.page.wait_for_timeout(80)
        deck = get_db(s.page).get("deck", [])
        assert "weight" in deck and "bp" in deck, f"Heart failure batch-add missing weight/bp: {deck}"
        click_nav(s.page, "cards")
        assert s.page.locator("[data-tile='weight']").count() >= 1
        click_nav(s.page, "folder")
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        assert "高血压" in sheet_text(s.page)
        close_sheet(s.page)

    def t3_03() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        s.page.locator("[data-cond='t2d']").click()
        click_nav(s.page, "cards")
        assert s.page.locator("[data-tile='insulin_pen']").count() >= 1
        s.page.locator("[data-tile='insulin_pen'] [data-card='insulin_pen']").first.click()
        s.page.wait_for_timeout(80)
        s.page.locator("[data-act='bedside']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#bsNext").click()
        s.page.wait_for_timeout(60)
        close_sheet(s.page)
        assert 0 in get_db(s.page).get("stepDone", {}).get("insulin_pen", [])
        click_nav(s.page, "folder")
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        assert "2 型糖尿病" in sheet_text(s.page)
        s.page.emulate_media(media="print")
        assert not s.page.evaluate("[...document.querySelectorAll('.no-print')].some(e => getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0)")

    def t3_04() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library")
        ime = cdp_ime_compose(s.page, "#q", "xiaochuan", "哮喘")
        assert ime["end_val"] == "哮喘"
        s.page.locator("[data-card='inhaler']").first.click()
        s.page.wait_for_timeout(80)
        assert "#/card/inhaler" in s.page.evaluate("location.hash")
        assert_all_refs_resolve(s.page, "#app")
        s.page.locator("[data-act='redlines']").first.click()
        wait_sheet_open(s.page)
        s.page.locator("[data-rlgrp='re']").click()
        s.page.locator("[data-redcard='breathing']").click()
        s.page.wait_for_timeout(80)
        assert "#/card/breathing" in s.page.evaluate("location.hash") and visible_sheet(s.page).count() == 0

    def t3_05() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/settings")
        s.page.locator("[data-pref='theme'][data-val='dark']").click()
        s.page.locator("[data-pref='size'][data-val='xl']").click()
        s.page.locator("[data-pref='motion'][data-val='reduce']").click()
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("typeof window.UnderwingScene === 'object'"), "UnderwingScene missing for 3D sync (M3)"
        assert s.page.evaluate("document.documentElement.dataset.theme === 'dark' && document.documentElement.dataset.size === 'xl' && document.documentElement.classList.contains('rm')")
        nav_hash(s.page, "#/folder?chart=glucose", wait_ms=100)
        contrast_bad = s.page.evaluate(JS_CONTRAST)
        assert not contrast_bad, f"Contrast issues in dark+xl: {contrast_bad}"
        s.page.locator("svg[role='img'][aria-label*='趋势'] circle[data-pt][tabindex='0']").first.focus()
        s.page.keyboard.press("ArrowRight")
        s.page.wait_for_timeout(60)
        ro = s.page.locator("#chartReadout").text_content() or ""
        assert "查看读数" in ro and "mmol/L" in ro, f"#chartReadout did not update via ArrowRight: {ro}"

    def t3_06() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        with s.page.expect_file_chooser() as fc:
            s.page.locator("[data-act='upload']").click()
        fc.value.set_files([{"name": "discharge.png", "mimeType": "image/png", "buffer": PNG_1X1_BYTES}])
        s.page.wait_for_timeout(120)
        s.page.fill("#ut", "出院小结原件")
        s.page.locator("#upf button[type='submit'], #upf button:not([data-close])").first.click()
        s.page.wait_for_timeout(250)
        assert "出院小结原件" in s.page.locator("#app").inner_text()
        s.page.locator("#app [data-act='ai'][data-from]").first.click()
        wait_sheet_open(s.page)
        s.page.locator("#aiSample").click()
        s.page.locator("#aiNext1").click()
        s.page.locator("#aiNext2").click()
        s.page.locator("#aiSend").click()
        s.page.wait_for_timeout(120)
        s.page.locator("#aiSave").click()
        s.page.wait_for_timeout(80)
        s.page.locator("[data-filter='pend']").click()
        s.page.locator("[data-confirm]").first.click()
        s.page.wait_for_timeout(60)
        with s.page.expect_download() as dl_info:
            s.page.locator("[data-act='exportjson']").click()
        backup_raw = open(dl_info.value.path(), encoding="utf-8").read()
        nav_hash(s.page, "#/settings", wait_ms=60)
        s.page.on("dialog", lambda d: d.accept())
        s.page.locator("[data-act='wipe']").click()
        s.page.wait_for_timeout(100)
        s.page.locator("[data-act='importjson']").click()
        wait_sheet_open(s.page)
        s.page.fill("#impText", backup_raw)
        s.page.locator("#impConfirmBtn").click()
        s.page.wait_for_timeout(100)
        titles = [e.get("title") for e in get_db(s.page).get("events", [])]
        assert "出院小结原件" in titles, f"Restored events missing upload event: {titles}"

    def t3_07() -> None:
        s = runner.open_session(viewport=MOBILE, hash_path="#/cards")
        for view in ("library", "folder", "settings", "cards"):
            click_nav(s.page, view)
            assert not has_overflow(s.page), f"Overflow on mobile tab {view}"
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        assert not has_overflow(s.page)
        close_sheet(s.page)
        nav_hash(s.page, "#/library?tab=hubs&age=60%2B&hub=06_fall", wait_ms=120)
        assert s.page.locator("[data-hub='06_fall'][aria-expanded='true']").count() >= 1 and s.page.locator("[data-deckbatch]").count() == 1 and not has_overflow(s.page)

    def t3_08() -> None:
        s = runner.open_session(viewport=DESKTOP, hash_path="#/card/medlog")
        s.page.fill("#mn", "示例降压片")
        s.page.fill("#mh", "早晚各一次")
        s.page.locator("#medForm button").click()
        s.page.locator("[data-take]").last.click()
        nav_hash(s.page, "#/card/symptom", wait_ms=80)
        s.page.fill("#sw", "夜间咳嗽")
        s.page.fill("#sl", "4")
        s.page.fill("#sd", "持续 10 分钟")
        s.page.locator("#symForm button").click()
        click_nav(s.page, "folder")
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        txt = sheet_text(s.page)
        assert "示例降压片" in txt and "夜间咳嗽" in txt

    runner.run_case("T3-01", 3, "F6/F7/F8", "3D hotspot -> card -> step checkoff -> reload persistence", t3_01)
    runner.run_case("T3-02", 3, "F9/F8/F10", "Hub filter + fan-out (35_heartfailure) -> batch-add -> folder", t3_02)
    runner.run_case("T3-03", 3, "F9/F8/F11/F10", "Condition t2d -> insulin_pen -> bedside -> clinic sheet print", t3_03)
    runner.run_case("T3-04", 3, "F9/F8/F11", "IME search 哮喘 -> inhaler -> .ref -> redlines -> breathing", t3_04)
    runner.run_case("T3-05", 3, "F3/F6/F10/F11", "Dark + XL + Reduced Motion -> 3D sync -> glucose chart ArrowRight", t3_05)
    runner.run_case("T3-06", 3, "F10/F11", "IndexedDB upload -> AI 4-step redaction -> confirm -> backup/wipe/restore", t3_06)
    runner.run_case("T3-07", 3, "F7/F9", "Mobile 390x844 tab switch -> sheet dismiss -> deep hub hash", t3_07)
    runner.run_case("T3-08", 3, "F8/F10", "Medlog + Symptom organize cards -> Clinic Sheet integration", t3_08)
