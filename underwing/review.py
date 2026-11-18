#!/usr/bin/env python3
# 鹤伴 独立合规审查器：python underwing/review.py（只读页面、不改业务文件）
# 全面审查：
#   1. 全部 15 张就绪照护卡 + 核心视图 + 疾病枢纽扇形展开 + 一页复诊单
#   2. 桌面 (1440x900) 与 手机 (390x844) × 浅色 (light) 与 深色 (dark) 全矩阵
#   3. 零控制台错误 / 零横向溢出 / 零 undefined·NaN 渲染泄漏
#   4. 手机可点区域高度 >= 40px
#   5. 正文对比度 >= 4.5:1（大字 >= 3.0:1），浅色与深色双模式实测
#   6. 红色排他铁规：仅允许用于 .stop/.gen-stop/[data-stop]/.dlg .stop/.lvl-120/.stopstrip/.jump
#   7. 零药物剂量字样（DOSE 正则覆盖卡片详情、卡面与疾病枢纽）、零覆盖率百分比宣称、零甲减->低血糖错配
#   8. 临床卡每条步骤·易错·联系医护·适用均带 .ref 角标，且 100% 命中页面 #src-* 来源条目
#   9. 所有 <img> 具备 alt 属性，且真实解码成功（naturalWidth > 0）
#  10. 尊重 prefers-reduced-motion: reduce（无关键帧动画播放）

import glob
import json
import os
import pathlib
import re
import sys
import tempfile
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

HERE = pathlib.Path(__file__).resolve().parent
DEFAULT_INDEX = HERE.parent / "index.html"
URL = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else DEFAULT_INDEX.as_uri()
if len(sys.argv) > 1 and sys.argv[1] == "--root":
    URL = DEFAULT_INDEX.as_uri()

EXPECTED_15_CARDS = [
    "bp", "glucose", "followup", "medlog", "symptom",
    "inhaler", "weight", "fall", "wound", "hypo",
    "breathing", "dementia", "transfer", "insulin_pen", "eyedrops",
]

DOSE = re.compile(
    r"\d+(\.\d+)?\s*(mg|毫克|微克|μg|IU|单位|片|粒|袋|毫升|ml|mL)(?![a-zA-Z])"
    r"|剂量为"
    r"|每次.{0,3}\d+(\.\d+)?\s*(片|粒|袋|毫克|mg|微克|μg|IU|单位|毫升|ml|mL)"
)
PCT_CLAIM = re.compile(r"覆盖.{0,8}\d+\s*%|\b99\s*%")
GLOBAL_PHONE = re.compile(r"(?<!\d)(120|110|911|999|112)(?!\d)")
RAW_PROMPT_TAG = re.compile(r"（通用）|\(通用\)|\(v1\s*§")


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


issues = []
checked = []


def bad(where, rule, detail):
    issues.append({"where": where, "rule": rule, "detail": str(detail)[:240]})


JS_CONTRAST = """() => {
  const parseRGBA = c => {
    const m = (c || '').match(/[\\d.]+/g);
    if (!m || m.length < 3) return [255, 255, 255, 0];
    return [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]];
  };
  const lum = ([r, g, b]) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = el => {
    const chain = [];
    let cur = el;
    while (cur && cur.nodeType === 1) {
      chain.push(parseRGBA(getComputedStyle(cur).backgroundColor));
      cur = cur.parentElement;
    }
    const dark = document.documentElement.dataset.theme === 'dark';
    let base = dark ? [18, 20, 19] : [242, 244, 242];
    for (let i = chain.length - 1; i >= 0; i--) {
      const [r, g, b, a] = chain[i];
      if (a <= 0) continue;
      base = [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)];
    }
    return base;
  };
  const sel = '#app p,#app li,#app h1,#app h2,#app h3,#app .muted,#app b,#app span,dialog[open] p,dialog[open] li,dialog[open] h1,dialog[open] h2,dialog[open] h3,dialog[open] .muted,dialog[open] b,dialog[open] span';
  const out = [];
  document.querySelectorAll(sel).forEach(e => {
    if (!e.offsetParent || !e.childNodes.length) return;
    if (e.closest('[inert],[aria-hidden="true"],.sr')) return;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.5) return;
    const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
    if (t.length < 2) return;
    const [fr, fg, fb, fa] = parseRGBA(cs.color);
    if (fa < 0.5) return;
    const bg = bgOf(e);
    const effFg = [fr * fa + bg[0] * (1 - fa), fg * fa + bg[1] * (1 - fa), fb * fa + bg[2] * (1 - fa)];
    const l1 = lum(effFg), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const fs = parseFloat(cs.fontSize);
    const big = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
    if (ratio < (big ? 3.0 : 4.5)) {
      out.push(`${t.slice(0, 22)} (${ratio.toFixed(2)})`);
    }
  });
  return [...new Set(out)].slice(0, 8);
}"""

JS_RED = """() => {
  const out = [];
  document.querySelectorAll('#app *, dialog[open] *').forEach(e => {
    if (!e.offsetParent) return;
    const cs = getComputedStyle(e);
    for (const p of ['color', 'backgroundColor', 'borderLeftColor', 'borderTopColor']) {
      const m = (cs[p] || '').match(/[\\d.]+/g);
      if (!m || m.length < 3) continue;
      const [r, g, b, a] = m.map(Number);
      if (a === 0) continue;
      if (r > 150 && g < 90 && b < 90 && r - g > 90) {
        if (!e.closest('.stop,.gen-stop,[data-stop],.dlg .stop,dialog .stop,.lvl-120,.stopstrip,.jump')) {
          out.push((e.className || e.tagName) + ':' + p);
          break;
        }
      }
    }
  });
  return [...new Set(out)].slice(0, 8);
}"""

JS_IMAGES = """async () => {
  const imgs = [...document.querySelectorAll('#app img, dialog[open] img')];
  const noalt = imgs.filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src') || i.outerHTML.slice(0, 60));
  for (const img of imgs) {
    if (img.getAttribute('src') && img.loading === 'lazy') img.loading = 'eager';
  }
  await Promise.all(imgs.map(img => {
    const s = img.getAttribute('src');
    if (!s || img.complete) return Promise.resolve();
    return new Promise(r => {
      img.addEventListener('load', r, { once: true });
      img.addEventListener('error', r, { once: true });
      setTimeout(r, 3000);
    });
  }));
  const broken = imgs
    .filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0))
    .map(i => i.getAttribute('src'));
  return { noalt, broken: [...new Set(broken)] };
}"""


def audit_static_data(pg):
    data = pg.evaluate("""() => {
      const cardKeys = Object.keys(CARDS);
      const notReady = cardKeys.filter(k => !CARDS[k].ready);
      const whyUndef = [];
      const badSrcs = [];
      for (const k of cardKeys) {
        const c = CARDS[k];
        for (const sk of (c.srcKeys || [])) {
          if (!SOURCES[sk] || !SOURCES[sk].url || !SOURCES[sk].t) badSrcs.push(`${k}:${sk}`);
        }
        const C = CONTENT[k];
        if (c.kind === 'clinical' && c.ready) {
          if (!C) whyUndef.push(`${k}:missing_CONTENT`);
          else {
            (C.why || []).forEach((w, idx) => {
              if (typeof w.d !== 'string') whyUndef.push(`${k}.why[${idx}].d_not_string`);
            });
            for (const sk of (C.srcs || [])) {
              if (!SOURCES[sk] || !SOURCES[sk].url || !SOURCES[sk].t) badSrcs.push(`${k}.CONTENT:${sk}`);
            }
          }
        }
      }
      const hypoCond = typeof condById === 'function' ? condById('hypo') : null;
      const hypoMappedToLowSugar = !!(hypoCond && (hypoCond.cards || []).includes('hypo'));

      const hasHubs = typeof DISEASE_HUBS !== 'undefined' && Array.isArray(DISEASE_HUBS);
      const hubs = hasHubs ? DISEASE_HUBS : [];
      const invalidHubSubCards = [];
      const hubArtUrls = [];
      for (const h of hubs) {
        for (const sc of (h.subCards || [])) {
          if (!CARDS[sc]) invalidHubSubCards.push(`${h.id}->${sc}`);
        }
        if (typeof DISEASE_ART === 'function' && h.artSlug) {
          hubArtUrls.push({ id: h.id, url: DISEASE_ART(h.artSlug) });
        }
      }
      return {
        cardKeys,
        notReady,
        whyUndef,
        badSrcs,
        hypoMappedToLowSugar,
        hasHubs,
        hubCount: hubs.length,
        hubsDump: hubs.map(h => ({
          id: h.id,
          callouts: h.callouts || [],
          scopeNote: h.scopeNote || '',
          sexNote: h.sexNote || '',
        })),
        invalidHubSubCards,
        hubArtUrls,
        cardsTextDump: cardKeys.map(k => ({
          k,
          text: [CARDS[k].key || '', CARDS[k].stopMini || '', CARDS[k].desc || ''].join(' \\n '),
        })),
      };
    }""")

    missing_15 = [k for k in EXPECTED_15_CARDS if k not in data["cardKeys"]]
    if missing_15:
        bad("static:CARDS", "全部15张卡片齐全", f"缺少卡片: {missing_15}")
    if data["notReady"]:
        bad("static:CARDS", "全部15张卡片ready:true", f"未就绪卡片: {data['notReady']}")
    if data["whyUndef"]:
        bad("static:CONTENT", "CONTENT字段完整无undefined隐患", data["whyUndef"][:6])
    if data["badSrcs"]:
        bad("static:SOURCES", "所有引用来源存在于SOURCES", data["badSrcs"][:6])
    if data["hypoMappedToLowSugar"]:
        bad("static:CONDITIONS", "甲减(hypo)绝不映射到低血糖卡", "condById('hypo').cards contains 'hypo'")

    for item in data["cardsTextDump"]:
        for m in DOSE.finditer(item["text"]):
            bad(f"static:CARDS:{item['k']}", "卡面摘要不出现剂量", item["text"][max(0, m.start() - 10):m.end() + 8])

    if not data["hasHubs"] or data["hubCount"] < 70:
        bad("static:DISEASE_HUBS", "疾病卡枢纽目录已加载(>=70)", f"hasHubs={data['hasHubs']} count={data['hubCount']}")
    else:
        if data["invalidHubSubCards"]:
            bad("static:DISEASE_HUBS", "疾病枢纽子卡映射有效", data["invalidHubSubCards"][:6])
        for h in data["hubsDump"]:
            joined = " | ".join(h["callouts"]) + " | " + h["scopeNote"] + " | " + h["sexNote"]
            for m in DOSE.finditer(joined):
                bad(f"static:hub:{h['id']}", "疾病枢纽不出现剂量", joined[max(0, m.start() - 8):m.end() + 8])
            if PCT_CLAIM.search(joined):
                bad(f"static:hub:{h['id']}", "不宣称覆盖率百分比", joined[:80])
            if RAW_PROMPT_TAG.search(joined):
                bad(f"static:hub:{h['id']}", "清理提示词残留标记(通用/v1§)", joined[:80])
            if GLOBAL_PHONE.search(" | ".join(h["callouts"])):
                bad(f"static:hub:{h['id']}", "全球疾病卡标签不写具体急救号码", " | ".join(h["callouts"]))

        # Verify every single hub's DISEASE_ART WebP decodes cleanly in browser
        broken_hub_art = pg.evaluate("""async (items) => {
          const bad = [];
          await Promise.all(items.map(it => new Promise(resolve => {
            const im = new Image();
            im.onload = () => { if (im.naturalWidth === 0) bad.push(it.id + ':' + it.url); resolve(); };
            im.onerror = () => { bad.push(it.id + ':' + it.url); resolve(); };
            im.src = it.url;
            setTimeout(() => { if (!im.complete) bad.push(it.id + ':timeout:' + it.url); resolve(); }, 4000);
          })));
          return bad;
        }""", data["hubArtUrls"])
        if broken_hub_art:
            bad("static:DISEASE_ART", "全部疾病枢纽WebP图片可加载且naturalWidth>0", broken_hub_art[:6])


def navigate_state(pg, v, k):
    # Close any open modal dialog before switching state
    pg.evaluate("() => { const d = document.getElementById('dlg'); if (d && d.open) d.close(); }")
    if v == "cards":
        pg.evaluate("go('cards')")
    elif v == "library_search":
        pg.evaluate("() => { state.libTab = 'search'; state.q = ''; state.hub = null; go('library'); }")
    elif v == "library_query":
        pg.evaluate(f"() => {{ state.libTab = 'search'; state.q = {json.dumps(k)}; go('library'); }}")
    elif v == "library_hubs":
        pg.evaluate("() => { state.libTab = 'hubs'; state.q = ''; state.age = 'all'; state.sys = 'all'; state.hub = null; go('library'); }")
    elif v == "library_hub_open":
        pg.evaluate("""() => {
          const hid = (typeof DISEASE_HUBS !== 'undefined' && DISEASE_HUBS[0]) ? DISEASE_HUBS[0].id : null;
          state.libTab = 'hubs'; state.q = ''; state.age = 'all'; state.sys = 'all'; state.hub = hid;
          go('library');
        }""")
    elif v == "library_conds":
        pg.evaluate("() => { state.libTab = 'conds'; state.q = ''; go('library'); }")
    elif v == "folder":
        pg.evaluate("() => { state.filter = 'all'; go('folder'); }")
    elif v == "settings":
        pg.evaluate("go('settings')")
    elif v == "card":
        pg.evaluate(f"go('card', {json.dumps(k)})")
    elif v == "dialog_clinicsheet":
        pg.evaluate("""() => {
          go('folder');
          const btn = document.querySelector('[data-act="clinicsheet"]');
          if (btn) btn.click();
          else if (typeof openClinicSheet === 'function') openClinicSheet();
        }""")
    elif v == "dialog_bedside":
        pg.evaluate(f"""() => {{
          go('card', {json.dumps(k or 'insulin_pen')});
          const btn = document.querySelector('[data-act="bedside"]');
          if (btn) btn.click();
          else if (typeof openBedside === 'function') openBedside({json.dumps(k or 'insulin_pen')});
        }}""")
    elif v == "dialog_redlines":
        pg.evaluate("""() => {
          go('cards');
          const btn = document.querySelector('[data-act="redlines"]');
          if (btn) btn.click();
          else if (typeof openRedLines === 'function') openRedLines();
        }""")
    pg.wait_for_timeout(70)


with sync_playwright() as p:
    b = launch(p)
    static_audited = False

    for vw, vh, vtag in [(1440, 900, "desktop"), (390, 844, "mobile")]:
        for theme in ["light", "dark"]:
            tag = f"{vtag}:{theme}"
            pg = b.new_page(viewport={"width": vw, "height": vh}, reduced_motion="reduce")
            errs = []
            pg.on("pageerror", lambda e, bucket=errs: bucket.append(str(e)))
            pg.on("console", lambda m, bucket=errs: bucket.append(m.text) if m.type == "error" else None)

            pg.goto(URL)
            pg.evaluate("localStorage.clear()")
            pg.reload()
            pg.wait_for_timeout(200)

            pg.evaluate(f"() => {{ prefs.theme = '{theme}'; applyPrefs(); render(); }}")
            pg.wait_for_timeout(80)

            if not static_audited:
                audit_static_data(pg)
                static_audited = True

            ready_cards = pg.evaluate("Object.keys(CARDS).filter(k => CARDS[k].ready)")
            views = [
                ("cards", None),
                ("library_search", None),
                ("library_query", "糖尿病"),
                ("library_hubs", None),
                ("library_hub_open", None),
                ("library_conds", None),
                ("folder", None),
                ("settings", None),
                ("dialog_clinicsheet", None),
                ("dialog_bedside", "insulin_pen"),
                ("dialog_redlines", None),
            ] + [("card", k) for k in ready_cards]

            for v, k in views:
                where = f"{tag}:{v}{(':' + k) if k else ''}"
                checked.append(where)
                navigate_state(pg, v, k)

                # Verify card view actually opened when v == "card"
                if v == "card":
                    on_card = pg.evaluate(f"state.view === 'card' && state.card === {json.dumps(k)}")
                    if not on_card:
                        bad(where, "就绪卡片可打开详情页", f"go('card','{k}') 未进入详情视图")
                        continue

                if pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"):
                    sw = pg.evaluate("document.documentElement.scrollWidth")
                    bad(where, "无横向溢出", f"scrollWidth={sw} > {vw}")

                txt_leak = pg.evaluate("""() => {
                  const t = (document.getElementById('app')?.innerText || '') + '\\n' + (document.querySelector('dialog[open]')?.innerText || '');
                  const m = t.match(/\\bundefined\\b|\\bNaN\\b/);
                  return m ? m[0] : null;
                }""")
                if txt_leak:
                    bad(where, "无undefined/NaN文本泄漏", txt_leak)

                pct_leak = pg.evaluate("""() => {
                  const t = document.getElementById('app')?.innerText || '';
                  return t;
                }""")
                if PCT_CLAIM.search(pct_leak):
                    bad(where, "产品内不宣称覆盖率百分比", PCT_CLAIM.search(pct_leak).group(0))

                if vtag == "mobile":
                    small = pg.evaluate("""() => [...document.querySelectorAll('button,a.btn,input:not([type=checkbox]):not([type=radio]):not([type=hidden]),select')]
                      .filter(b => b.offsetParent && !b.closest('.ref') && !b.classList.contains('sr') && b.getBoundingClientRect().height < 39.5)
                      .map(b => `${(b.textContent || b.placeholder || b.getAttribute('aria-label') || b.type || b.tagName).trim().slice(0, 14)}(${Math.round(b.getBoundingClientRect().height)}px)`)""")
                    if small:
                        bad(where, "手机可点区域≥40px", small[:6])

                for c in pg.evaluate(JS_CONTRAST):
                    bad(where, "正文对比度≥4.5:1", c)

                for c in pg.evaluate(JS_RED):
                    bad(where, "红色只用于联系医护", c)

                img_res = pg.evaluate(JS_IMAGES)
                if img_res["noalt"]:
                    bad(where, "图片要有 alt", img_res["noalt"][:5])
                if img_res["broken"]:
                    bad(where, "图片真实加载(naturalWidth>0)", img_res["broken"][:5])

                if v in ("dialog_bedside", "dialog_redlines") and theme == "light" and vtag == "desktop":
                    dlg_txt = pg.evaluate("document.querySelector('dialog[open]')?.innerText || ''")
                    if not dlg_txt.strip():
                        bad(where, "弹窗正常打开", f"{v} 未打开 dialog[open]")
                    for m in DOSE.finditer(dlg_txt):
                        bad(where, "指导内容不出现剂量", dlg_txt[max(0, m.start() - 12):m.end() + 8])
                    dead_dlg = pg.evaluate("""[...document.querySelectorAll('dialog[open] .ref a[href^="#"]')]
                      .filter(a => !document.querySelector(a.getAttribute('href')))
                      .map(a => a.textContent + '->' + a.getAttribute('href'))""")
                    if dead_dlg:
                        bad(where, "弹窗内来源角标可跳转", dead_dlg[:6])

                if v == "card" and theme == "light" and vtag == "desktop":
                    guide = pg.evaluate("[...document.querySelectorAll('#app [data-guidance], #app .stop, #app .gen-stop')].map(e => e.innerText).join('\\n')")
                    for m in DOSE.finditer(guide):
                        bad(where, "指导内容不出现剂量", guide[max(0, m.start() - 12):m.end() + 8])
                    clin = pg.evaluate(f"CARDS[{json.dumps(k)}].kind === 'clinical'")
                    if clin:
                        miss = pg.evaluate("""[...document.querySelectorAll('#app ol.steps>li,#app .mistake,#app .stop .lvl,#app [data-needref]')]
                          .filter(e => !e.querySelector('.ref'))
                          .map(e => e.innerText.trim().slice(0, 24))""")
                        if miss:
                            bad(where, "临床内容每条都有来源", miss[:5])
                    dead = pg.evaluate("""[...document.querySelectorAll('.ref a')]
                      .filter(a => !document.querySelector(a.getAttribute('href')))
                      .map(a => a.textContent + '->' + a.getAttribute('href'))""")
                    if dead:
                        bad(where, "来源角标可跳转", dead[:6])

            if errs:
                bad(tag, "无控制台错误", errs[:4])

            anim = pg.evaluate("""[...document.querySelectorAll('*')].filter(e => {
              const s = getComputedStyle(e);
              return s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.01;
            }).length""")
            if anim:
                bad(tag, "减弱动态时不播放动画", anim)

            pg.close()
    b.close()

rep = {"url": URL, "checked_count": len(checked), "checked": checked, "issues": issues, "pass": not issues}
out_path = pathlib.Path(tempfile.gettempdir()) / "underwing_review.json"
out_path.write_text(json.dumps(rep, ensure_ascii=False, indent=2), encoding="utf-8")

print(f"REVIEW {'PASS' if not issues else 'FAIL'}  views={len(checked)} issues={len(issues)}  report={out_path}")
for i in issues:
    print(" -", i["where"], "|", i["rule"], "|", i["detail"])
sys.exit(0 if not issues else 1)
