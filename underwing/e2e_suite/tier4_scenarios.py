from __future__ import annotations

from helpers import (
    DESKTOP,
    JS_CONTRAST,
    JS_IMAGES_CHECK,
    JS_RED_EXCLUSIVITY,
    MOBILE,
    PNG_1X1_BYTES,
    assert_all_refs_resolve,
    check_mobile_tap_targets,
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


def run_tier4(runner: TestRunner) -> None:
    def t4_01() -> None:
        """Nighttime Fall Prevention & Urgent Triage (Mobile 390x844, Dark + XL)."""
        s = runner.open_session(viewport=MOBILE, hash_path="#/settings")
        s.page.locator("[data-pref='theme'][data-val='dark']").click()
        s.page.locator("[data-pref='size'][data-val='xl']").click()
        click_nav(s.page, "library")
        s.page.fill("#q", "起夜摔倒")
        s.page.wait_for_timeout(80)
        s.page.locator("[data-card='fall']").first.click()
        s.page.wait_for_timeout(80)
        s.page.locator("ol.steps li").nth(0).locator(".stepbtn").click()
        s.page.locator("ol.steps li").nth(1).locator(".stepbtn").click()
        s.page.locator("[data-act='bedside']").first.click()
        wait_sheet_open(s.page)
        assert "第 3 /" in sheet_text(s.page)
        close_sheet(s.page)
        s.page.locator("[data-act='redlines']:visible").first.click()
        wait_sheet_open(s.page)
        s.page.locator("[data-rlgrp='fall']").click()
        assert "120" in sheet_text(s.page)
        assert not has_overflow(s.page)
        assert not s.page.evaluate(JS_CONTRAST)
        assert not check_mobile_tap_targets(s.page, min_px=43.5)
        close_sheet(s.page)

    def t4_02() -> None:
        """Hypertension & Diabetes Dual-Chronic Daily Logging (1440x900, Light)."""
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        s.page.locator("[data-cond='t2d']").click()
        assert "hypo" not in s.page.evaluate("CONDITIONS.find(c => c.id === 'hypo')?.cards || []")
        nav_hash(s.page, "#/library?tab=hubs&hub=04_diabetes", wait_ms=100)
        s.page.locator("[data-deckbatch]").first.click()
        click_nav(s.page, "folder")
        # BP 142/88 ok
        s.page.locator("[data-act='addbp']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fs", "142")
        s.page.fill("#fdi", "88")
        s.page.locator("#f button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        # Low glucose 3.7 -> red alert -> save
        s.page.locator("[data-act='addglucose']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fgv", "3.7")
        s.page.locator("#fg button:not([data-close])").click()
        assert visible_sheet(s.page).locator("[data-stop]").count() >= 1, "Low glucose 3.7 missed .stop alert"
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        # Normal glucose 6.4
        s.page.locator("[data-act='addglucose']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fgv", "6.4")
        s.page.locator("#fg button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        # Weight 58.3
        s.page.locator("[data-act='addweight']").first.click()
        wait_sheet_open(s.page)
        s.page.fill("#fwk", "58.3")
        s.page.locator("#fw button:not([data-close])").click()
        s.page.locator("[data-saveok]").click()
        s.page.wait_for_timeout(80)
        for ck in ("bp", "glucose", "weight"):
            s.page.locator(f"[data-chart='{ck}']").click()
            s.page.wait_for_timeout(50)
            assert s.page.locator("svg[role='img'][aria-label*='趋势']").count() >= 1
            assert len(s.page.locator("#chartReadout").text_content() or "") > 5
        nav_hash(s.page, "#/card/medlog", wait_ms=60)
        s.page.locator("[data-take]").first.click()
        assert "今天已记" in s.page.locator("#app").inner_text()

    def t4_03() -> None:
        """Pre-Clinic Visit Prep & One-Page Clinic Sheet (1440x900)."""
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        assert "共 5 项" in (s.page.locator("#app [role='img'][aria-label*='复诊准备']").get_attribute("aria-label") or "")
        s.page.locator("[data-filter='pend']").click()
        while s.page.locator("[data-confirm]").count() > 0:
            s.page.locator("[data-confirm]").first.click()
            s.page.wait_for_timeout(40)
        s.page.locator("[data-prep='questions']").click()
        wait_sheet_open(s.page)
        s.page.fill("#qa", "1. 早上血压偏高要换时间吃药吗？\n2. 血糖波动需要复查糖化吗？\n3. 下次复诊查什么？")
        s.page.locator("#qsave").click()
        s.page.locator("[data-prep='meds']").click()
        nav_hash(s.page, "#/card/followup", wait_ms=60)
        s.page.locator("[data-act='clinicsheet']").first.click()
        wait_sheet_open(s.page)
        txt = sheet_text(s.page)
        for must in ("王秀兰", "虚构", "早上血压偏高", "1. 本次最想问医生的问题", "5. 关键病历事件"):
            assert must in txt, f"Clinic sheet missing {must}"
        assert "待核对」条目未计入" not in txt
        s.page.emulate_media(media="print")
        assert not s.page.evaluate("[...document.querySelectorAll('.no-print')].some(e => getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0)")

    def t4_04() -> None:
        """Discharge Summary Upload, PII Redaction & Verification (1440x900)."""
        s = runner.open_session(viewport=DESKTOP, hash_path="#/folder")
        with s.page.expect_file_chooser() as fc:
            s.page.locator("[data-act='upload']").click()
        fc.value.set_files([{"name": "discharge_sum.png", "mimeType": "image/png", "buffer": PNG_1X1_BYTES}])
        s.page.wait_for_timeout(120)
        s.page.fill("#ut", "心内科出院小结")
        s.page.locator("#upf button[type='submit'], #upf button:not([data-close])").first.click()
        s.page.wait_for_timeout(250)
        assert "心内科出院小结" in s.page.locator("#app").inner_text()
        s.page.locator("#app [data-act='ai'][data-from]").first.click()
        wait_sheet_open(s.page)
        raw_txt = (
            "北京协和医院 出院小结\n"
            "姓名：张桂芳  住院号：ZY20261101\n"
            "身份证号：110101195405061234  电话：13812345678\n"
            "住址：北京市西城区金融街1号\n"
            "就诊日期：2026-11-01\n"
            "诊断：高血压病\n"
            "血红蛋白 132 g/L\n"
            "医嘱：低盐饮食，2026-12-01 复诊。\n"
            "主治：陈建国"
        )
        s.page.fill("#aiRaw", raw_txt)
        s.page.locator("#aiNext1").click()
        clean = s.page.input_value("#aiClean")
        for pii in ("张桂芳", "ZY20261101", "110101195405061234", "13812345678", "金融街1号", "陈建国", "北京协和医院"):
            assert pii not in clean, f"PII {pii} not masked in discharge redaction"
        s.page.locator("#aiNext2").click()
        assert s.page.locator(".disclose").is_visible()
        s.page.locator("#aiSend").click()
        s.page.wait_for_timeout(100)
        s.page.locator("#aiSave").click()
        s.page.wait_for_timeout(80)
        s.page.locator("img[data-fid]").first.click()
        wait_sheet_open(s.page)
        imgs = visible_sheet(s.page).locator("img")
        assert imgs.count() >= 1 and imgs.evaluate_all("els => els.some(i => (i.src || '').startsWith('blob:'))"), "Sheet image preview missing blob: URL"
        close_sheet(s.page)
        s.page.locator("[data-confirm]").first.click()
        s.page.wait_for_timeout(50)

    def t4_05() -> None:
        """Device Migration: Backup Export, Wipe & Reload Recovery (1440x900)."""
        s = runner.open_session(viewport=DESKTOP, hash_path="#/library?tab=conds")
        s.page.locator("[data-cond='copd']").click()
        s.page.locator("[data-cond='t2d']").click()
        nav_hash(s.page, "#/library", wait_ms=60)
        s.page.fill("#q", "进行性肌营养不良")
        s.page.wait_for_timeout(60)
        s.page.locator("[data-addcustom]").first.click()
        nav_hash(s.page, "#/card/bp", wait_ms=60)
        s.page.locator("ol.steps li").nth(0).locator(".stepbtn").click()
        click_nav(s.page, "settings")
        with s.page.expect_download() as dl_info:
            s.page.locator("[data-act='exportjson']").click()
        backup_json = open(dl_info.value.path(), encoding="utf-8").read()
        s.page.on("dialog", lambda d: d.accept())
        s.page.locator("[data-act='wipe']").click()
        s.page.wait_for_timeout(100)
        assert "进行性肌营养不良" not in get_db(s.page).get("customConds", [])
        s.page.locator("[data-act='importjson']").click()
        wait_sheet_open(s.page)
        s.page.fill("#impText", backup_json)
        s.page.locator("#impConfirmBtn").click()
        s.page.wait_for_timeout(100)
        s.page.reload(wait_until="domcontentloaded")
        s.page.wait_for_timeout(120)
        db = get_db(s.page)
        assert "copd" in db.get("myConds", []) and "进行性肌营养不良" in db.get("customConds", [])
        assert 0 in db.get("stepDone", {}).get("bp", [])

    def t4_06() -> None:
        """Competition Jury Demo Walkthrough (Desktop Split-HUD + Mobile + 3D + 86 Hubs)."""
        s = runner.open_session(viewport=DESKTOP, hash_path="#/cards")
        assert s.page.locator("#scene3d canvas").count() == 1, "3D Sanctuary canvas missing (M3)"
        assert s.page.evaluate("typeof window.UnderwingScene?.focusZone === 'function'"), "UnderwingScene missing"
        for z in ("cards", "hubs", "folder", "redlines"):
            s.page.evaluate("(z) => window.UnderwingScene.focusZone(z)", z)
        s.page.locator("[data-tile='bp'] [data-flip='bp']").first.click()
        assert s.page.evaluate("document.querySelector(\"[data-tcg='bp'] .front\")?.hasAttribute('inert')")
        nav_hash(s.page, "#/card/bp", wait_ms=60)
        assert_all_refs_resolve(s.page, "#app")
        nav_hash(s.page, "#/library?tab=hubs", wait_ms=80)
        assert s.page.locator("[data-hub]").count() == 86
        assert not s.page.evaluate(JS_RED_EXCLUSIVITY)
        img_res = s.page.evaluate(JS_IMAGES_CHECK)
        assert not img_res["broken"] and not img_res["noalt"]
        s.page.set_viewport_size(MOBILE)
        s.page.wait_for_timeout(80)
        assert not has_overflow(s.page)

    def t4_07() -> None:
        """Low-Vision Accessibility-First Keyboard-Only Caregiver Flow."""
        s = runner.open_session(viewport=DESKTOP, reduced_motion="reduce")
        s.page.keyboard.press("4")
        s.page.wait_for_timeout(60)
        s.page.locator("[data-pref='size'][data-val='xl']").click()
        s.page.keyboard.press("1")
        s.page.wait_for_timeout(60)
        assert s.page.evaluate("document.documentElement.classList.contains('rm') && window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.size === 'xl'")
        s.page.locator("[data-tile='bp'] [data-flip='bp']").first.focus()
        s.page.keyboard.press("Enter")
        s.page.wait_for_timeout(60)
        assert s.page.locator("[data-tile='bp'] [data-flip='bp']").first.get_attribute("aria-expanded") == "true"
        s.page.keyboard.press("3")
        s.page.wait_for_timeout(80)
        s.page.locator("svg[role='img'][aria-label*='趋势'] circle[data-pt][tabindex='0']").first.focus()
        s.page.keyboard.press("ArrowRight")
        assert "查看读数" in (s.page.locator("#chartReadout").text_content() or "")
        nav_hash(s.page, "#/card/bp", wait_ms=60)
        s.page.locator("[data-act='bedside']").first.focus()
        s.page.keyboard.press("Enter")
        wait_sheet_open(s.page)
        s.page.keyboard.press("ArrowRight")
        s.page.wait_for_timeout(50)
        assert "第 2 /" in sheet_text(s.page)
        close_sheet(s.page)

    runner.run_case("T4-01", 4, "F3/F6/F7/F8/F11", "Nighttime fall prevention & triage (Mobile Dark+XL)", t4_01)
    runner.run_case("T4-02", 4, "F8/F9/F10/F12", "Hypertension & diabetes dual-chronic daily logging", t4_02)
    runner.run_case("T4-03", 4, "F8/F10/F12", "Pre-clinic visit prep & A4 one-page clinic sheet", t4_03)
    runner.run_case("T4-04", 4, "F10/F11", "Discharge summary upload, PII redaction & verify", t4_04)
    runner.run_case("T4-05", 4, "F10/F11", "Device migration: backup export, wipe & recovery", t4_05)
    runner.run_case("T4-06", 4, "F2/F4-F9/F12", "Competition jury demo walkthrough (Desktop + Mobile)", t4_06)
    runner.run_case("T4-07", 4, "F3/F7/F8/F11", "Low-vision keyboard-only reduced-motion + XL flow", t4_07)
