# 照护卡内容 JSON 规范（研究子任务产出）
每张卡一个对象，写入 research/<任务名>.json，形如 {"cards":[...], "notes":"..."}。
{
 "id": "eyedrops",                 // 英文短 id
 "title": "滴眼药水",               // ≤8 字
 "type": "给药|测量|安全|护理|记录",
 "sub": "一句副标题 ≤10 字",
 "keyline": "最关键的一招，≤24 字，可带出处",
 "keyline_refs": ["srcKey"],
 "flavor": "一句温和、非临床的话，≤16 字（可省）",
 "stats": [{"k":"用时","v":"约 3 分钟"},{"k":"准备","v":"..."},{"k":"适合","v":"..."}],  // 只写有把握的
 "why": [{"text":"为什么这件事重要（2–4 句，大白话）","refs":["srcKey"]}],
 "for": ["适用情境"], "notfor": ["不适用：……请直接看何时联系医护"],
 "steps": [{"t":"步骤标题","d":"怎么做","why":"为什么这样做","refs":["srcKey"]}],
 "mistakes": [{"t":"常见错误","why":"为什么不对/该怎么做","refs":["srcKey"]}],
 "freq": [{"text":"多久做一次（如果来源有）","refs":["srcKey"]}],
 "stop": [{"level":"120|urgent|doctor|followup","text":"出现什么情况联系谁","refs":["srcKey"]}],
 "conditions": ["适用病种中文名"],
 "sources": [{"key":"srcKey","title":"原标题","publisher":"发布机构/期刊，年份","url":"真实可打开的网址","verified":"read_full|read_section|abstract_only","quotes":[{"for":"对应哪条内容","quote":"原文逐字摘录（中文或英文）"}]}]
}
硬规则：
1. 每条临床内容（steps/why/mistakes/freq/stop/keyline）都要有 refs，且 refs 必须对应 sources 里真的打开读过的页面，并给出逐字 quote。查不到出处的内容不要写。
2. 不写任何药物剂量、不写「吃多少」「打几个单位」、不建议停药/加药/换药；只写操作技巧和观察要点。
3. 急救电话统一写 120（若来源是 911，在 notes 里说明本地化）。
4. 来源优先级：国家卫健委/国家疾控局/中国疾控中心 > 中华医学会等学会指南/共识 > 国家药监局、医院药学部官方科普 > WHO/NHS/CDC/NIH/AHA 等。论文用 PubMed/PMC 可读全文的。
5. 用 web_search 找，用 web_fetch 打开读；PDF 用 web_fetch。不能只看搜索摘要就引用。
6. 面向老人和家属：大白话，短句。

## 补充（2026-11-17 第二阶段）
- 每张卡写成 research/cards/<id>.json，内容为单个卡对象（不是 {"cards":[...]}）。
- 额外字段："kind":"clinical"，"updated":"2026-11-17"，"related":["其他卡 id"]，"illus":"给插画师的一句画面描述（中文）：一个什么样的人在家里做什么动作，突出关键动作，不画文字"。
- steps 4–8 步；mistakes 3–6 条；stop 2–4 条（必须至少一条 level=120 或 urgent，除非来源确无急症）；why 2–4 条。
- 每个 source 的 quotes 至少覆盖它被引用的每条内容；quote 必须是从你 web_fetch 打开的页面里逐字复制的原文（可英文）。
- 所有字段的中文面向老人/家属：短句、大白话、不用缩写（第一次出现的专业词加括号解释）。
- 优先中文权威来源；没有好的中文来源时用 NHS / CDC / NIH(MedlinePlus, NIDDK, NHLBI) / AHA / WHO / 美国 FDA / 澳洲 NPS / 英国 NICE / 医院药学部官网 / 中华医学会系列杂志 / PMC 全文。
- 完成后用 python3 -c "import json;json.load(open('cards/<id>.json'))" 自检 JSON 合法。
