#!/usr/bin/env python3
# 鹤伴 端到端自动化测试：python underwing/test_e2e.py
# 覆盖：桌面端 (1440x900) 与 手机端 (390x844)、全部 15 张就绪照护卡、TCG 翻面与无障碍属性、
#       疾病枢纽标签页 + 年龄段/系统筛选 + 扇形飞出展开 + 一键入组、步骤勾选持久化与重置、
#       病历上传 (IndexedDB) + AI 四步自动脱敏整理、血压高值预警、指尖血糖记录(含低血糖<=3.9红警) + 晨起体重记录、
#       多体征趋势图切换 (血压/血糖/体重)、一页复诊单、JSON 备份导出与导入恢复、深色模式 + 特大字号。

import glob
import json
import os
import pathlib
import sys
import tempfile
from PIL import Image
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def launch(p):
    for kwargs in ({}, {"channel": "msedge"}, {"channel": "chrome"}):
        try:
            return p.chromium.launch(**kwargs)
        except Exception:
            pass
    patterns = [
        os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"),
        os.path.expanduser("~/AppData/Local/ms-playwright/chromium*-*/chrome-win*/chrome.exe"),
        os.path.expanduser("~/AppData/Local/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe"),
    ]
    for pat in patterns:
        exes = sorted(glob.glob(pat))
        if exes:
            return p.chromium.launch(executable_path=exes[-1])
    raise RuntimeError("No usable Chromium/Edge/Chrome browser found for Playwright")


HERE = pathlib.Path(__file__).resolve().parent
DEFAULT_INDEX = HERE.parent / "index.html"
URL = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else DEFAULT_INDEX.as_uri()
if len(sys.argv) > 1 and sys.argv[1] == "--root":
    URL = DEFAULT_INDEX.as_uri()

TMP_DIR = pathlib.Path(tempfile.gettempdir()) / "underwing_e2e"
SHOT_DIR = TMP_DIR / "shots"
SHOT_DIR.mkdir(parents=True, exist_ok=True)

REC_PNG = TMP_DIR / "rec.png"
if not REC_PNG.exists():
    Image.new("RGB", (600, 800), "white").save(REC_PNG)

errs = []
R = []


def chk(name, cond):
    R.append((name, bool(cond)))


def get_db(pg):
    return pg.evaluate("JSON.parse(localStorage.getItem('underwing.v3'))")


with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

    pg.goto(URL)
    pg.evaluate("localStorage.clear()")
    pg.reload()
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(SHOT_DIR / "d1-deck.png"))

    # 1. 初始卡组、全部 15 张卡就绪与 TCG W3C 披露翻面
    chk("deck 3 cards", pg.locator(".cardgrid >> nth=0 >> .tcg-wrap").count() == 3)
    chk("recommend symptom", pg.locator("[data-tile=symptom] [data-deck=symptom]").count() == 1)
    chk("all 15 cards ready", pg.evaluate("Object.keys(CARDS).length === 15 && Object.values(CARDS).every(c => c.ready === true)"))
    chk("all 51 sources v:ok & 12 r3 clinical cards", pg.evaluate("""() => {
      const srcs = Object.values(SOURCES);
      const clinOk = Object.keys(CARDS).filter(k => CARDS[k].kind === 'clinical').every(k => rarity(k).n === 3);
      return srcs.length === 51 && srcs.every(s => s.v === 'ok') && clinOk;
    }"""))

    flip_btn = pg.locator(".cardgrid >> nth=0 >> [data-tile=bp] [data-flip=bp]")
    flip_btn.click()
    pg.wait_for_timeout(80)
    chk("tcg flip aria-expanded true", flip_btn.get_attribute("aria-expanded") == "true")
    chk("tcg flip front inert & back active", pg.evaluate("""() => {
      const el = document.querySelector('.cardgrid [data-tcg="bp"]');
      return el.classList.contains('flipped') && el.querySelector('.front').hasAttribute('inert') && !el.querySelector('.back').hasAttribute('inert');
    }"""))
    flip_btn.click()
    pg.wait_for_timeout(80)
    chk("tcg flip back aria-expanded false", flip_btn.get_attribute("aria-expanded") == "false")

    # 直接点击卡牌表面翻面（不点按钮、不点引用角标）
    pg.locator(".cardgrid >> nth=0 >> [data-tcg=bp] .tcg-art").click()
    pg.wait_for_timeout(80)
    chk("direct card-face click flips to back", flip_btn.get_attribute("aria-expanded") == "true")
    pg.locator(".cardgrid >> nth=0 >> [data-tcg=bp] .tcg-face.back .tcg-type").click()
    pg.wait_for_timeout(80)
    chk("direct card-face click flips back to front", flip_btn.get_attribute("aria-expanded") == "false")

    # 2. 搜索病名、快捷键 / 、病种映射与自定义病名
    pg.keyboard.press("/")
    pg.wait_for_timeout(80)
    if pg.locator("#q").count() == 0:
        pg.keyboard.press("2")
        pg.wait_for_timeout(80)
        pg.keyboard.press("/")
    chk("slash focuses #q", pg.evaluate("document.activeElement && document.activeElement.id === 'q'"))

    pg.fill("#q", "中风")
    pg.wait_for_timeout(150)
    pg.screenshot(path=str(SHOT_DIR / "d2-search.png"))
    chk("search stroke -> cond", pg.locator("[data-cond=stroke]").count() == 1)
    chk("stroke -> fall card", pg.locator(".res [data-deck=fall]").count() == 1)
    pg.click(".res [data-deck=fall]")
    chk("fall added", "fall" in get_db(pg)["deck"])

    pg.fill("#q", "糖尿病")
    chk("diabetes >=2 conds", pg.locator(".condgrid [data-cond]").count() >= 2)
    pg.fill("#q", "老年痴呆")
    chk("alias hit dementia", pg.locator("[data-cond=dementia]").count() == 1)
    pg.fill("#q", "渐冻症")
    chk("not found -> custom", pg.locator("[data-addcustom]").count() == 1)
    pg.click("[data-addcustom]")
    chk("custom saved", "渐冻症" in get_db(pg)["customConds"])

    pg.fill("#q", "")
    pg.click("[data-libtab=conds]")
    pg.click("[data-cond=t2d]")
    pg.wait_for_timeout(100)
    pg.screenshot(path=str(SHOT_DIR / "d3-conds.png"))
    chk("t2d selected", "t2d" in get_db(pg)["myConds"])
    chk("conds >= 45", pg.locator("[data-cond]").count() >= 45)
    chk("cond mappings include new cards & safe hypo", pg.evaluate("""() => {
      const t2d = condById('t2d')?.cards || [];
      const copd = condById('copd')?.cards || [];
      const hf = condById('hf')?.cards || [];
      const hypo = condById('hypo')?.cards || [];
      return t2d.includes('insulin_pen') && copd.includes('inhaler') && hf.includes('weight') && !hypo.includes('hypo');
    }"""))

    # 3. 疾病照护图谱（Disease Hubs）：年龄段筛选、系统筛选、扇形飞出展开与一键入组
    pg.click("[data-libtab=hubs]")
    pg.wait_for_timeout(150)
    chk("hubs tab hash", "tab=hubs" in pg.evaluate("location.hash"))
    total_hubs = pg.locator("[data-hub]").count()
    chk("disease hubs >= 70", total_hubs >= 70)

    if pg.locator("[data-age='0-5']").count() > 0:
        pg.click("[data-age='0-5']")
        pg.wait_for_timeout(80)
        infant_hubs = pg.locator("[data-hub]").count()
        chk("age filter 0-5 narrows hubs", 0 < infant_hubs < total_hubs)
        pg.click("[data-age='all']")
        pg.wait_for_timeout(80)
        chk("age filter all restores hubs", pg.locator("[data-hub]").count() == total_hubs)
    else:
        chk("age filter 0-5 narrows hubs", False)
        chk("age filter all restores hubs", False)

    sys_btns = pg.locator("[data-sys]:not([data-sys='all'])")
    if sys_btns.count() > 0:
        sys_btns.first.click()
        pg.wait_for_timeout(80)
        sys_hubs = pg.locator("[data-hub]").count()
        chk("system filter narrows hubs", 0 < sys_hubs < total_hubs)
        pg.click("[data-sys='all']")
        pg.wait_for_timeout(80)
    else:
        chk("system filter narrows hubs", False)

    pg.locator("[data-hub]").first.click()
    pg.wait_for_timeout(180)
    pg.screenshot(path=str(SHOT_DIR / "d3b-hub-fanout.png"))
    chk("hub fan-out hash & stage", "hub=" in pg.evaluate("location.hash") and pg.locator("[data-deckbatch]").count() >= 1)
    batch_btn = pg.locator("[data-deckbatch]").first
    batch_keys = [k.strip() for k in (batch_btn.get_attribute("data-deckbatch") or "").split(",") if k.strip()]
    batch_btn.click()
    pg.wait_for_timeout(100)
    deck_now = get_db(pg)["deck"]
    chk("hub batch add to deck", len(batch_keys) >= 1 and all(k in deck_now for k in batch_keys))

    # 4. 全部 15 张卡片详情、整理工具交互、步骤勾选持久化与重置
    pg.keyboard.press("1")
    pg.click("[data-tile=bp] [data-card=bp]")
    pg.wait_for_timeout(100)
    pg.screenshot(path=str(SHOT_DIR / "d4-bp.png"))
    chk("bp stop", pg.is_visible(".stop"))

    pg.evaluate("go('card','medlog')")
    pg.wait_for_timeout(80)
    pg.click("[data-take=m1]")
    chk("med logged", pg.locator("text=今天已记 1 次").count() == 1)

    pg.evaluate("go('card','symptom')")
    pg.wait_for_timeout(80)
    pg.fill("#sw", "头晕")
    pg.fill("#sd", "起床时")
    pg.click("#symForm button")
    chk("symptom saved", pg.locator("text=头晕 · 程度 3/10").count() == 1)

    pg.evaluate("go('card','glucose')")
    pg.wait_for_timeout(100)
    chk("glucose stop", pg.locator(".stop .lvl").count() == 4)
    chk("glucose sources >=3", pg.locator(".sources li").count() >= 3)
    chk("glucose refs resolve", pg.evaluate("[...document.querySelectorAll('.ref a')].every(a => document.querySelector(a.getAttribute('href')))"))
    pg.screenshot(path=str(SHOT_DIR / "d4b-glucose.png"), full_page=True)

    # 原 5 张临床卡精确计数 + 新增 5 张临床卡完整核验
    for k, nsrc, nsteps in [("fall", 3, 8), ("hypo", 4, 7), ("breathing", 4, 7), ("dementia", 10, 8), ("transfer", 7, 8)]:
        pg.evaluate(f"go('card','{k}')")
        pg.wait_for_timeout(70)
        chk(f"{k} sources {nsrc}", pg.locator(".sources li").count() == nsrc)
        chk(f"{k} steps {nsteps}", pg.locator("ol.steps>li").count() == nsteps)
        chk(f"{k} stop lvls", pg.locator(".stop .lvl").count() == 4)
        chk(f"{k} refs resolve", pg.evaluate("[...document.querySelectorAll('.ref a')].every(a => document.querySelector(a.getAttribute('href')))"))

    for k in ["inhaler", "weight", "wound", "insulin_pen", "eyedrops"]:
        pg.evaluate(f"go('card','{k}')")
        pg.wait_for_timeout(80)
        chk(f"{k} clinical detail ready", pg.locator("ol.steps>li").count() >= 4 and pg.locator(".sources li").count() >= 1 and pg.locator(".stop .lvl").count() >= 2)
        chk(f"{k} refs resolve & img ok", pg.evaluate("""() => {
          const refsOk = [...document.querySelectorAll('.ref a')].every(a => document.querySelector(a.getAttribute('href')));
          const heroImg = document.querySelector('.dcard img');
          return refsOk && !!heroImg && heroImg.naturalWidth > 0;
        }"""))

    # 步骤勾选持久化与重置步骤
    pg.evaluate("go('card','insulin_pen')")
    pg.wait_for_timeout(80)
    pg.locator("ol.steps li >> nth=0 >> .stepbtn").click()
    pg.locator("ol.steps li >> nth=1 >> .stepbtn").click()
    pg.wait_for_timeout(60)
    chk("steps 2 checked", (pg.locator("#ptext").text_content() or "").startswith("2 /"))
    pg.evaluate("go('cards')")
    pg.reload()
    pg.wait_for_timeout(150)
    pg.evaluate("go('card','insulin_pen')")
    pg.wait_for_timeout(80)
    chk("steps persisted across reload", pg.locator("ol.steps li.done").count() == 2)
    chk("resetsteps button visible", pg.locator("[data-act=resetsteps]").count() >= 1)
    pg.click("[data-act=resetsteps]")
    pg.wait_for_timeout(60)
    chk("steps reset to 0", pg.locator("ol.steps li.done").count() == 0 and (pg.locator("#ptext").text_content() or "").startswith("0 /"))

    # 5. 病历夹：上传图片 (IndexedDB) + AI 四步脱敏整理
    pg.keyboard.press("3")
    pg.wait_for_timeout(100)
    with pg.expect_file_chooser() as fc:
        pg.click("[data-act=upload]")
    fc.value.set_files(str(REC_PNG))
    pg.wait_for_timeout(200)
    pg.fill("#ut", "社区门诊病历")
    pg.click("#upf .btn-primary")
    pg.wait_for_timeout(450)
    chk("upload event", pg.locator("text=社区门诊病历").count() == 1)
    chk("thumb loaded", pg.evaluate("[...document.querySelectorAll('img[data-fid]')].some(i => i.src.startsWith('blob:'))"))
    pg.screenshot(path=str(SHOT_DIR / "d5-folder.png"))

    pg.click(".ev:has-text('社区门诊病历') [data-act=ai]")
    pg.click("#aiSample")
    pg.click("#aiNext1")
    pg.wait_for_timeout(100)
    clean = pg.input_value("#aiClean")
    for leak in ["王秀兰", "110101195405061234", "13812345678", "幸福小区", "李明华", "MZ20261020-0388", "社区卫生服务中心"]:
        chk("redacted " + leak, leak not in clean)
    chk("kept dates", ("2026-10-20" in clean) and ("2026-11-24" in clean))
    chk("kept lab values", "肌酐 92" in clean)
    pg.screenshot(path=str(SHOT_DIR / "d6-redact.png"))

    pg.click("#aiNext2")
    pg.wait_for_timeout(100)
    chk("disclose shown", pg.is_visible(".disclose"))
    pg.screenshot(path=str(SHOT_DIR / "d7-disclose.png"))

    pg.click("#aiSend")
    pg.wait_for_timeout(200)
    n = pg.locator("[data-pick]").count()
    chk("extracted >=3", n >= 3)
    pg.screenshot(path=str(SHOT_DIR / "d8-result.png"))

    pg.click("#aiSave")
    pg.wait_for_timeout(200)
    chk("ai events pending", len([e for e in get_db(pg)["events"] if e.get("ai") and e.get("status") == "pend"]) >= 3)

    # 6. 血压高值预警 + 血糖记录(低血糖<=3.9红警) + 体重记录 + 多体征趋势图切换
    pg.keyboard.press("n")
    pg.wait_for_selector("#fs")
    pg.fill("#fs", "186")
    pg.fill("#fdi", "112")
    pg.click("#f .btn-primary")
    pg.wait_for_selector("[data-savepend]")
    chk("high bp alert", pg.is_visible("dialog .stop"))
    pg.click("[data-savepend]")
    pg.wait_for_timeout(100)

    # 指尖血糖记录（测 <=3.9 低血糖红色警告 + 保存）
    g_before = len(get_db(pg).get("glucoseReadings", []))
    pg.evaluate("() => { const b = document.querySelector('[data-act=\"addglucose\"]'); if (b) b.click(); else if (typeof openAddGlucose === 'function') openAddGlucose(); }")
    pg.wait_for_timeout(120)
    num_in = pg.locator("#fgv") if pg.locator("#fgv").count() > 0 else pg.locator("dialog[open] input:not([type=date]):not([type=time]):not([type=hidden])").first
    num_in.fill("3.4")
    pg.wait_for_timeout(80)
    low_warn_live = pg.is_visible("dialog[open] .stop")
    pg.locator("dialog[open] .btn-primary").first.click()
    pg.wait_for_timeout(120)
    low_warn_confirm = pg.is_visible("dialog[open] .stop")
    chk("low glucose <=3.9 stop alert", low_warn_live or low_warn_confirm)
    if pg.locator("dialog[open] [data-saveok]").count() > 0:
        pg.click("dialog[open] [data-saveok]")
    elif pg.locator("dialog[open] [data-savepend]").count() > 0:
        pg.click("dialog[open] [data-savepend]")
    pg.wait_for_timeout(120)
    g_after = len(get_db(pg).get("glucoseReadings", []))
    chk("glucose reading saved", g_after == g_before + 1)

    # 晨起体重记录
    w_before = len(get_db(pg).get("weightReadings", []))
    pg.evaluate("() => { const b = document.querySelector('[data-act=\"addweight\"]'); if (b) b.click(); else if (typeof openAddWeight === 'function') openAddWeight(); }")
    pg.wait_for_timeout(120)
    w_in = pg.locator("#fwk") if pg.locator("#fwk").count() > 0 else pg.locator("dialog[open] input:not([type=date]):not([type=time]):not([type=hidden])").first
    w_in.fill("64.8")
    pg.locator("dialog[open] .btn-primary").first.click()
    pg.wait_for_timeout(120)
    if pg.locator("dialog[open] [data-saveok]").count() > 0:
        pg.click("dialog[open] [data-saveok]")
    elif pg.locator("dialog[open] [data-savepend]").count() > 0:
        pg.click("dialog[open] [data-savepend]")
    pg.wait_for_timeout(120)
    w_after = len(get_db(pg).get("weightReadings", []))
    chk("weight reading saved", w_after == w_before + 1)

    pg.evaluate("go('folder')")
    pg.wait_for_timeout(120)

    for ck in ["bp", "glucose", "weight"]:
        pg.click(f"[data-chart='{ck}']")
        pg.wait_for_timeout(80)
        chk(f"chart switch {ck} renders svg", pg.locator(".chartbox svg").count() >= 1)

    # 交互式趋势图读数条 (#chartReadout) 悬停/点击/聚焦即时更新
    pg.click("[data-chart='bp']")
    pg.wait_for_timeout(80)
    chk("chart readout default visible", pg.locator("#chartReadout").count() == 1 and len((pg.locator("#chartReadout").text_content() or "").strip()) > 4)
    pt_ok = pg.evaluate("""() => {
      const pts = [...document.querySelectorAll('.chartbox circle.pt-node[data-pt]')];
      if (!pts.length) return false;
      const first = pts[0];
      const expected = first.getAttribute('data-pt') || '';
      first.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      first.click?.();
      const txt = document.getElementById('chartReadout')?.textContent || '';
      return expected.length > 0 && txt.includes(expected) && first.classList.contains('is-active');
    }""")
    chk("chart point hover/tap updates #chartReadout", pt_ok)

    # 7. 一页复诊单 (Clinic Summary Sheet)
    pg.evaluate("() => { const b = document.querySelector('[data-act=\"clinicsheet\"]'); if (b) b.click(); else if (typeof openClinicSheet === 'function') openClinicSheet(); }")
    pg.wait_for_timeout(150)
    pg.screenshot(path=str(SHOT_DIR / "d8b-clinicsheet.png"))
    sheet_txt = pg.evaluate("(document.querySelector('dialog[open]') || document.getElementById('app')).innerText")
    chk("clinic sheet shows patient & fict badge & meds", ("王秀兰" in sheet_txt) and ("虚构" in sheet_txt) and ("降压药" in sheet_txt))
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")

    # 8. JSON 备份导出与导入恢复
    pg.keyboard.press("4")
    pg.wait_for_timeout(100)
    backup_file = TMP_DIR / "underwing-backup-test.json"
    with pg.expect_download(timeout=5000) as dl_info:
        pg.click("[data-act=exportjson]")
    dl = dl_info.value
    dl.save_as(str(backup_file))
    exported_obj = json.loads(backup_file.read_text(encoding="utf-8"))
    chk("exportjson valid json", isinstance(exported_obj, dict) and ("person" in exported_obj or "DB" in exported_obj or "data" in exported_obj or "db" in exported_obj))

    # 修改本地数据后执行导入恢复（先测试坏 JSON 拦截，再测试有效 JSON 恢复）
    pg.evaluate("() => { DB.customConds = ['临时脏数据待恢复']; save(); render(); }")
    chk("mutated before import", "临时脏数据待恢复" in get_db(pg)["customConds"])

    pg.click("[data-act=importjson]")
    pg.wait_for_timeout(120)
    if pg.locator("#impText").count() > 0 and pg.locator("#impConfirmBtn").count() > 0:
        pg.fill("#impText", "{not valid json!!!")
        pg.click("#impConfirmBtn")
        pg.wait_for_timeout(80)
        chk("invalid json rejected safely", "临时脏数据待恢复" in get_db(pg)["customConds"])
        pg.fill("#impText", backup_file.read_text(encoding="utf-8"))
        pg.click("#impConfirmBtn")
        pg.wait_for_timeout(150)
        imported_ok = True
    elif pg.locator("dialog[open] input[type=file]").count() > 0:
        pg.locator("dialog[open] input[type=file]").set_input_files(str(backup_file))
        pg.wait_for_timeout(150)
        if pg.locator("#impConfirmBtn").count() > 0:
            pg.click("#impConfirmBtn")
        elif pg.locator("dialog[open] .btn-primary").count() > 0:
            pg.locator("dialog[open] .btn-primary").first.click()
        pg.wait_for_timeout(150)
        imported_ok = True
    else:
        imported_ok = False

    chk("importjson restored backup", imported_ok and ("临时脏数据待恢复" not in get_db(pg)["customConds"]) and ("渐冻症" in get_db(pg)["customConds"]))
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")

    # 8b. Wave 2 Hack4Good 专属体验：零闪烁搜索框与输入法保护、当前步骤引导 (.is-next)、床旁伴读 (bedside)、红线速查 (redlines)
    pg.evaluate("() => { state.libTab = 'search'; state.q = ''; go('library'); }")
    pg.wait_for_timeout(80)
    pg.evaluate("() => { const q = document.getElementById('q'); if (q) q.__nodeMarker = 777; }")
    pg.fill("#q", "血压")
    pg.wait_for_timeout(80)
    chk("search #q preserves DOM node (zero jank)", pg.evaluate("document.getElementById('q')?.__nodeMarker === 777"))

    pg.evaluate("""() => {
      const q = document.getElementById('q');
      q.dispatchEvent(new CompositionEvent('compositionstart'));
      q.value = 'tang';
      q.dispatchEvent(new Event('input', { bubbles: true }));
      q.value = '糖尿病';
      q.dispatchEvent(new CompositionEvent('compositionend'));
      q.dispatchEvent(new Event('input', { bubbles: true }));
    }""")
    pg.wait_for_timeout(80)
    chk("pinyin IME composition search works", pg.locator(".condgrid [data-cond]").count() >= 2)

    pg.evaluate("() => { DB.stepDone['insulin_pen'] = []; save(); go('card', 'insulin_pen'); }")
    pg.wait_for_timeout(80)
    chk("step 0 highlighted as .is-next", pg.evaluate("document.querySelectorAll('ol.steps > li')[0]?.classList.contains('is-next') === true"))

    pg.click('[data-act="bedside"]')
    pg.wait_for_timeout(120)
    pg.screenshot(path=str(SHOT_DIR / "d8c-bedside.png"))
    chk("bedside companion dialog opens", pg.is_visible("dialog[open] .bedside-dlg, dialog[open]"))
    # 点击床旁伴读内的「完成本步」按钮并验证与 DB.stepDone 实时同步
    pg.evaluate("""() => {
      const btns = [...document.querySelectorAll('dialog[open] button')];
      const doneBtn = btns.find(b => /完成本步|下一步/.test(b.textContent));
      if (doneBtn) doneBtn.click();
    }""")
    pg.wait_for_timeout(100)
    chk("bedside step synced to DB.stepDone", len(get_db(pg).get("stepDone", {}).get("insulin_pen", [])) >= 1)
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")
    pg.wait_for_timeout(60)
    chk("after bedside step 0, step 1 is .is-next", pg.evaluate("document.querySelectorAll('ol.steps > li')[1]?.classList.contains('is-next') === true"))

    pg.evaluate("() => { go('cards'); }")
    pg.wait_for_timeout(60)
    pg.locator('[data-act="redlines"]').first.click()
    pg.wait_for_timeout(120)
    pg.screenshot(path=str(SHOT_DIR / "d8d-redlines.png"))
    rl_txt = pg.evaluate("document.querySelector('dialog[open]')?.innerText || ''")
    chk("redlines lookup dialog shows urgent stop rules", pg.is_visible("dialog[open]") and ("120" in rl_txt) and ("低血糖" in rl_txt or "胸痛" in rl_txt))
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")

    # 9. 深色模式 + 特大字号
    pg.keyboard.press("4")
    pg.click("[data-pref=theme][data-val=dark]")
    pg.click("[data-pref=size][data-val=xl]")
    pg.keyboard.press("1")
    pg.wait_for_timeout(150)
    pg.screenshot(path=str(SHOT_DIR / "d9-dark.png"))
    chk("dark & xl applied", pg.evaluate("document.documentElement.dataset.theme === 'dark' && document.documentElement.dataset.size === 'xl'"))

    # 10. 手机端 (390x844) 布局、无横向溢出与触控尺寸
    m = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    m.on("pageerror", lambda e: errs.append(str(e)))
    m.goto(URL)
    m.wait_for_timeout(250)
    chk("m tabs visible", m.is_visible("nav.mtabs"))
    chk("m deck no overflow", not m.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"))
    m.screenshot(path=str(SHOT_DIR / "m1-deck.png"))

    m.click(".mtab[data-nav=library]")
    m.fill("#q", "高血压")
    m.wait_for_timeout(100)
    m.screenshot(path=str(SHOT_DIR / "m2-search.png"))
    chk("m search no overflow", not m.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"))

    m.fill("#q", "")
    m.click("[data-libtab=hubs]")
    m.wait_for_timeout(120)
    m.locator("[data-hub]").first.click()
    m.wait_for_timeout(150)
    m.screenshot(path=str(SHOT_DIR / "m3-hub-fanout.png"))
    chk("m hub fanout no overflow", not m.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"))

    small = m.evaluate("""[...document.querySelectorAll('button')]
      .filter(b => b.offsetParent && !b.closest('.ref') && b.getBoundingClientRect().height < 39.5)
      .map(b => b.textContent.trim().slice(0, 12))""")
    chk("m tap>=40 " + str(small), not small)

    b.close()

passed = sum(1 for _, ok in R if ok)
failed = sum(1 for _, ok in R if not ok)
for name, ok in R:
    print(("PASS " if ok else "FAIL ") + name)
print(f"SUMMARY: {passed} PASS / {failed} FAIL | console_errors={len(errs)} | shots={SHOT_DIR}")
if errs:
    print("ERRORS:", errs[:5])
sys.exit(0 if (failed == 0 and not errs) else 1)
