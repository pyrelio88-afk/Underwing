# 什么让卡片真正好看又有效：面向中文居家护理指导卡的研究报告

> 研究日期：2026-11-17。应用场景（任务给定，不展开建造）：单文件静态网页；每张卡教一个居家护理任务（如量血压、防跌倒、识别低血糖）；读者为 40 岁左右首次照护父母的家人，焦虑、非医学背景，桌面优先、手机其次；要求“超级好看”但冷静、可信、易读，绝不花哨游戏化。既定约束：红色仅用于“停止并联系医疗帮助”警告；软扁平矢量插画（哑光 muted 色块、极少描边、暖米色背景）；雾灰背景、白卡 + 1px 细线、深绿主按钮、快速过渡；可有克制 3D 倾斜/视差/光泽但须尊重 `prefers-reduced-motion`；文字大、高对比。
>
> **证据等级说明（全文通用）：**【标准/事实】= 官方规范、标准或可核对的产品事实；【研究证据】= 同行评议综述/RCT 或眼动等实证研究；【从业者共识】= 多家设计系统/资深从业者一致的做法，无严格实验支撑；【观点】= 单一评论者或品牌研究的主张；【本报告推论】= 由上述证据外推到本应用的建议，未经直接验证。凡【观点】【推论】处请勿当作已证事实。

## 摘要

真正好看的卡片不是装饰更多，而是**在极小的面积里让眼睛零思考地走完“认出它 → 明白它 → 敢动手做”**。顶级 TCG 与顶级产品卡片的共同点是反直觉的：**母版极其固定、文字极其克制、图与框各安其位、价值信号极其小声**。变化只发生在极少数被允许的地方（插画、一个破框瞬间、一种表面处理），其余全部重复。反面教材几乎只有一个病因：**把文字缩到能塞下为止**（游戏王），或**把文字浮在 busy 的图上**（劣质全艺卡）。

对本应用，最高杠杆的三件事是：① 全套卡共用一个固定分区母版，标题/图/步骤/警告永远在同一位置；② 中文大字（正文 18px 起、行高 1.7–1.8）+ 实测对比度 + 图示配对文字，绝不为塞内容缩小字；③ 正面只做“识别与判断”、背面只做“步骤与核对”，警告用红 + 图标 + 文字三重编码且永远出现在行动按钮之前。倾斜/光泽/破框只能是“焦点卡上的小声点缀”，且在减动效下退化为淡入。

---

## (a) 影响最大的 14 条设计规则（按对本应用的影响排序）

### 规则 1：一卡一任务，全套卡共用一个固定分区母版——标题、图、规则、数值、署名永远在同一位置

**为什么有效：** 卡片的本质是“把相关信息装进一个共同区域”，边界 + 异色底让人瞬间感知分组【研究证据/规范】。Nielsen Norman Group（NN/g）定义卡片为“装少量相关短信息的容器”，并指出卡片布局的可扫性弱于列表，正因为各元素位置不可预测；眼动研究中用户在卡片间来回比较【研究证据】。TCG 实践同样如此：母版固定区（标题、费用、图、规则、数值）让玩家“学一次 layout，处处适用”；三张不同类型卡并排，新玩家若不能立刻找到名/费用/效果，母版就漂移过头了【从业者共识】。

**具体例子：** 万智牌（MTG）30 年来信息位置几乎未变——名称与费用在顶、图在上半、类型行紧贴图下、规则框在下半、攻防在右下；2003 与 2014 两次改版只动可读性（深字浅底、加框、减纹理、边框变细），不动位置。见 MTG 边框史：https://mtg.wiki/index.php?title=Dark_frame& 与 https://www.coolstuffinc.com/a/jayannelli-07072025-magics-frame-making-the-cut ；母版方法见：https://www.uvbira.com/trading-card-layout 与 https://shufflekit.com/blog/game-card-graphic-design-rules 。NN/g 定义见：https://www.nngroup.com/articles/cards-component/?lm=principles-visual-design&pt=article

**应用到本卡：** 见第 (c) 节解剖。任何一类卡（测量类/预防类/识别类）只允许换“类别色 + 类别图标 + 插画”，不允许换分区位置。

### 规则 2：文字装不下时先删字、再分面，绝不缩小字号；文字永远坐在纯色安静的面板上，绝不浮在 busy 的图上

**为什么有效：** 这是 TCG 三十年演化中最昂贵的教训。MTG 2003 改版的核心就是“名称/类型行/攻防改深字浅底、减纹理、放大图与文本框，以改善远距离可读性”【标准/事实】。反例游戏王：效果文约 4–6pt、低对比、重边框斜面，自 1999 年几乎未变；西方版因框体不可变，效果越多字号动态缩得越小，形成“文字墙”【观点/评论，但多源一致】。产品卡同理：busy 背景会杀死文本可读性，应用纯色或 muted 背景于文字区【从业者共识】。

**具体例子：** 宝可梦全艺卡把文字叠在整卡插画上时，设计要点是“图后留安静区、图标强对比、信息区减少视觉活动”，否则收藏价值盖过可玩性；Creatures 官方座谈也强调“宝可梦与文字必须始终清晰可读”【从业者共识/官方访谈转述】。见：https://www.yahoracards.com/pokemon-tcg-cards/ 与 https://www.gamerbraves.com/how-pokemon-tcgs-full-art-cards-went-from-booster-pack-gimmick-to-collectors-obsession/ 。游戏王反例见：https://portfolio.delsing.net/yu-gi-oh 与 https://anthonyjschwartz.substack.com/p/wall-of-text-dilemma-yu-gi-oh-tcg

**应用到本卡：** 每步 1 个动词标题 + 至多 2 行中文；超长内容翻到背面或拆成两张卡，禁止出现小于 14px 的中文正文（见规则 3）。

### 规则 3：中文大字 + 宽行距 + 实测对比度——正文 18px 起、行高 1.7–1.8、字距为 0、正文对比度冲 AAA

**为什么有效（分层证据）：** ① WCAG 2.2 AA 要求正文对比度至少 4.5:1、大字（24px 或 18.66px 加粗起）至少 3:1、非文本界面元素 3:1；AAA 为 7:1 / 4.5:1【标准/事实】。② 年长读者研究综合：正文 16px 只是底线，65 岁以上宜 18–20px、行距 1.3–1.5（拉丁文语境）；60 岁以上平板测试多偏好 18–24px【研究证据，二手综合，置信中等】。③ 中文特殊性：汉字占满 em 方、笔画密度高，同一行高倍数下比拉丁文显得更挤；字体排印实践建议 CJK 行高约 1.7–1.8、正文 16–18px、每行 22–40 字，且**不要给中文加正字距**（会打散汉字网格）【从业者共识，Typotheque 与多位 CJK 排印作者一致】。④ Apple HIG（二手整理）：iOS 正文默认 17pt、最小 11pt，避免 Ultralight/Thin/Light 字重【标准/事实，二手转述】。

**具体例子：** 同样 1.5 行高，英文小写 x 高只占 em 的约一半所以有空气感，汉字墨迹占 em 的 80–95%，视觉上立刻变密——这就是中文卡必须用 1.75 行高的力学原因。见：https://www.willchan.me/blog/typography-for-cjk-and-latin 与 https://www.typotheque.com/articles/typesetting-cjk-text 。对比度见：https://www.procurveux.com/blog/color-contrast-ratio-wcag 与 https://accessibilitychecking.org/wcag-color-contrast-requirements/ 。年长读者见：https://www.adoc-studio.app/blog/typography-guide 与 https://github.com/mlaroque/ux-older-people-skill/blob/HEAD/ux-older-people/references/research-sources.md

**应用到本卡：** 字阶建议（【本报告推论】）：卡标题 28–32px/700/行高 1.35；步骤标题 18px/700；正文 18px/400/行高 1.75；辅助信息 14–15px/500 且对比度仍 ≥4.5:1；页脚非关键信息不低于 14px。字体栈用系统中文黑体：PingFang SC / Microsoft YaHei / Noto Sans SC，见：https://www.az-loc.com/best-fonts-for-chinese-japanese-korean-websites/ 。深绿按钮白字、红色警告白字/深字都必须用对比度工具实测，禁止凭感觉。

### 规则 4：图示必须配对文字，且一图只讲一个动作、一个主体、安静背景——插画是“说明书”，不是装饰

**为什么有效：** 2025 年更新的处方用药信息范围综述（32 篇 RCT）结论：按健康素养原则设计（通俗语言、排版提示、可执行指令、大字体、留白）多研究阳性；**图示 + 配对文字**在书面用药信息与药房标签上有“强证据”【研究证据】。图示出院指导的系统综述更新也发现理解（RR 1.32）与依从（RR 1.27）改善，但作者明确称证据仍有限、需更大 RCT【研究证据，置信有限】。图示综述另指出：图示对“何时服药”等时间指令尤其有用，但复杂图标（如时钟）反而失败，且图文口结合优于纯图【研究证据】。作画流程上，炉石传说插画师先画缩略图定“大明暗组、表情与基调”，并刻意不在背景放大的高对比形状以免抢主体【从业者共识】。

**具体例子：** 宝可梦早期艺术总监杉森建常用极简构图——主体对简单渐变/柔和纯色背景，迫使眼睛看角色本身的姿态与表情；这种克制比“更华丽的 3D 场景”更耐看【观点】。反例是缩略图发 muddy：细节多、对比散，小尺寸下主体消失。见综述：https://pmc.ncbi.nlm.nih.gov/articles/PMC12098189/ ；出院指导综述：https://jenonline.org.marlin-prod.literatumonline.com/article/S0099-1767(26)00060-7/fulltext ；图示综述：https://www.researchgate.net/publication/6691754_Use_of_pictorial_aids_in_medication_instructions_A_review_of_the_literature ；作画流程：https://www.creativebloq.com/3d/how-those-epic-hearthstone-cards-are-made

**应用到本卡：** 每张卡正面插画只画“正在做的那一个关键动作”（如袖带位置），人物/器具占图窗 60% 以上，背景只留 1–2 个大色块；背面每步配一个小图示或图标 + 文字，图示不单独承担含义。

### 规则 5：正面 = 识别与判断，背面 = 步骤与核对——用“翻卡”做渐进披露，一次只给 3–5 个信息块

**为什么有效：** 渐进披露是“只在需要时揭示复杂性”；把 20 个字段拆成 4 组每组 5 个，每组装得进工作记忆，且“简单的第一屏”本身会向用户发送“这事可控”的信号、降低开始焦虑；NN/g 研究称其改善可学习性、效率与错误率【研究证据，转述】。工作记忆对无关联项目约为 4±1 个组块（Cowan 2001 对 Miller 7±2 的修正），高压下更少【研究证据，二手综合】。NN/g 的卡片定义也强调：卡片是“摘要 + 通往详情的入口”，而非详情本身【研究证据】。

**具体例子：** MTG 的 Saga/职业牌用“分区规则框”把随时间推进的文本切成带分隔的段落，框体本身在替用户分段；游戏王日本 OCG 用 ①②③ 编号圆点显式分隔不同效果，给眼睛落脚点——西方版缺了这层脚手架就成了文字墙。见：https://mtg.wiki/index.php?title=Dark_frame& 与 https://anthonyjschwartz.substack.com/p/wall-of-text-dilemma-yu-gi-oh-tcg ；渐进披露见：https://timgraf.com/ux-design/the-ux-of-multi-step-processes-a-practical-guide-to-designing-wizards-stepped-flows-and-multi-page-tasks-users-actually-complete/

**应用到本卡：** 正面最多 4 块：图、标题 + 一句话结果、3 条关键事实、行动按钮；背面最多 6 步，每步独立成行，步与步之间留白大于行内留白。披露深度不超过 2 层（正面 → 背面 → 详情链接即止）【从业者共识】。

### 规则 6：警告必须三重编码（红 + 图标 + 文字）+ 放在行动按钮之前 + 只给一个下一步动作，措辞冷静具体

**为什么有效：** ① WCAG 1.4.1（Level A）规定颜色不得为唯一的传达手段，状态/错误须同时有文字、图标、形状或图案【标准/事实】。② GOV.UK 警告文组件 = “!”图标 + 加粗文字 + 隐藏的 “Warning” 词，仅用于“重要后果”场景，克制使用才有分量【标准/事实】。③ 用户研究发现：放在开始按钮下方的文字会被忽略（包括读屏与缩放用户），警告须在行动之前【研究证据，政府设计史记录】。④ 危急场景 UX 的任务是“帮用户决定”，而非“告知更多”；措辞过随意会被漏、过惊悚会吓人或致过度使用急诊，目标是冷静清晰的指引、全站同一措辞、并经临床审核【观点/从业者共识】。

**具体例子：** GOV.UK 例句 “You can be fined up to £5,000 if you do not register.”——一个后果 + 一个条件，句式短、加粗、带图标。护理卡的平行写法是：“出现以下任一情况，停下手头操作，立即联系医生/拨打急救：……”然后只列 3–4 条可观察体征，每条一行。见：https://design-system.service.gov.uk/components/warning-text/ 、https://accessibility.build/wcag/1-4-1 、https://design-histories.education.gov.uk/connect-families-to-support/giving-a-warning-on-connect-families-to-support-start-page 、https://www.londonbusiness.news/emergency-contact-pages/ 与 https://www.indegene.com/insights/reports/ux-design-in-healthcare-medical-emergencies

**应用到本卡：** 红色只出现在这一处；警告条用浅红底 + 深红 1px 边 + “!”三角图标 + 加粗标题“停下来，联系医疗帮助”+ 具体体征清单 + 一个电话/求助动作。非紧急提醒（“注意”“小贴士”）一律不用红色，改用深绿或中性灰 + 图标。

### 规则 7：颜色永远不单独携带含义——类别 = 颜色 + 图标 + 文字标签，三者同时出现

**为什么有效：** 除 WCAG 1.4.1 外，TCG 的颜色系统全部是“双编码”的：MTG 每色有专属底纹图案（白大理石、蓝漩涡、黑气泡、红裂石、绿滤光），多色用金框【标准/事实】；Lorcana 用“墨色横幅 + 墨图标”双重指示墨色【标准/事实】；One Piece 用颜色六角 + 类别横幅 + 文字类型三重指示【标准/事实】。单靠颜色在色盲、灰度打印、强光下都会失效。

**具体例子：** MTG 早期问题：白框与神器框一眼难分，被迫在后续系列加深神器框——颜色太接近就是设计缺陷。见：https://mtg.wiki/index.php?title=Dark_frame& 。Lorcana 见：https://turnzerohq.com/lorcana/how-to-read-a-lorcana-card ；One Piece 见：https://getzukan.com/academy/guides/how-to-read-one-piece-cards

**应用到本卡：** 类别（如“测量 / 安全 / 识别信号”）各配 1 个 muted 色 + 1 个线性图标 + 2–4 字标签；类别色只用于小面积（标签、顶栏细线、编号圆），绝不大面积铺色。灰度截图自检：去掉颜色后类别仍可区分。

### 规则 8：框体要“安静而有分量”——1px 近不可见的边 + 柔和分层阴影二选一、圆角全套一致、内边距 20–24px、暖中性底色

**为什么有效：** Material Design 3 把卡片分为 elevated（阴影）、filled（ tint 底）、outlined（边界）三种，并明确 M3 相对 M2“降低 elevation、默认无阴影”，outlined 靠边界获得更强强调【标准/事实】；同时警告勿对信息密集容器用过大圆角【标准/事实】。高级感研究（Linear/Stripe/Vercel 等产品的从业者综合）一致指向：暖中性底、近不可见的 1px 边、慷慨内边距、静止时无阴影、交互时才抬升；常驻重阴影会“压平层级”【观点/从业者共识】。NN/g 则指出轻阴影是“可点击”的指示器【研究证据】——两者并不矛盾：阴影是交互信号，不是装饰。

**具体例子：** 既定约束（雾灰底 + 白卡 + 1px 线）恰好对应 M3 的 outlined 卡，是正确的选择；高级感来自“边线够淡、内边距够大、阴影只在悬停/抬起时出现一层柔和的”。见：https://m3.material.io/components/cards/overview 、https://m3.material.io/styles/shape/corner-radius-scale 与 https://github.com/devamshah/velora-tprm/blob/HEAD/docs/design/premium-ux-research.md

**应用到本卡：** 静止态：白底 + 1px #E7E5E4 级淡边 + 无阴影或极淡 1 层阴影；悬停/聚焦态：抬升 2px + 1 层柔和阴影（200–300ms）。圆角全套只用 2 个值（卡 16–20px、内图窗/标签 10–12px，且内圆角 + 内边距 ≈ 外圆角的同心关系【从业者共识】）。圆角数值的分歧见第 (d) 节。

### 规则 9：建立插画系统并冻结它——1 种子风格、每图 2–4 色、固定人物比例与道具库、固定构图模板

**为什么有效：** 插画系统由风格定义、色彩用法、角色设计、类型、应用规则组成；不一致的插画是“品牌漂移 + 返工”的总成本，常超过单张委托的差价【从业者共识】。品牌指南一致要求：只用批准调色板的子集、用色引导注意而非填满空间、人物比例固定、深度选择性使用【从业者共识】。扁平矢量指南：每图 3–6 色、主色占 40–60%，最大错误是混用 2 种以上扁平子风格；几何背景 + 曲线人物会割裂【从业者共识】。角色系统上，Duolingo 为 Duo 写“人格规则而不只是姿态表”，Headspace 把插画风格与情绪状态挂钩、目标是让新手觉得“易接近、不吓人”【观点/案例】。

**具体例子：** Lenovo 品牌插画：成人站姿 6–9 头高、儿童 3–5 头高、人物始终扁平、只用批准色且 HEX 严格一致。见：https://origin-brandworld.lenovo.com/visual-identity/illustration/ 。色彩纪律见：https://getillustrations.com/blog/flat-vector-illustration-guide/ 与 https://github.com/studio-manfred/manfred-shared-knowledge/blob/HEAD/plugins/manfred-ui-design/skills/illustration-style/SKILL.md 。角色案例见：https://www.manypixels.co/blog/brand-design/brand-guides 与 https://www.rmcad.edu/blog/illustration-for-mobile-apps-enhancing-user-experience-with-visuals/

**应用到本卡：** 冻结一页“插画宪法”：暖米图窗底 + muted 主色 1 个 + 辅助色 1–2 个 + 深绿点缀（红色禁入插画）；两位固定角色（照护者 + 长辈，固定服装色、发型、比例）；固定道具（血压计、拐杖、药盒、水杯）同一画法；3 个构图模板（正面操作特写 / 双人互动中景 / 信号识别半身），新卡只换动作不换模板；固定光源方向（左上）与阴影规则（无投影或统一柔和椭圆投影）。

### 规则 10：图标只用于重复出现的动作/概念，且必须配图例；步骤编号用 ①②③ 式显式分隔

**为什么有效：** “重复出现三次以上的短语就值得一个图标”——图标让用户扫一眼符号而非重读句子，并腾出空间给更大的图与留白【从业者共识】。但图标本身需要学习：TCG 图标系统都配规则书图例，且新玩家靠图例入门；医疗图示研究也发现复杂图标需培训才有效（见规则 4）。日本 OCG 的编号圆点是最低成本的分段脚手架：眼睛有落脚点、步骤可追踪【观点/评论】。

**具体例子：** MTG 法术力符号、宝可梦能量符号、Lorcana 的力量（圆）/意志（盾）/传说（菱形）各用不同形状，都是“形状 + 位置 + 颜色”三重编码。One Piece 的 Counter 值印在左缘侧读，是“位置本身就是含义”的极端例子。见：https://shufflekit.com/blog/game-card-graphic-design-rules 、https://lorcana.fandom.com/wiki/Card_Layout 、https://getzukan.com/academy/guides/how-to-read-one-piece-cards

**应用到本卡：** 图标库封顶 8–10 个（准备、测量、观察、记录、求助、禁止、时间、重复等），全部为同一描边粗细的线性图标；首页/卡组顶部放常驻小图例；背面步骤每步以编号圆开头，编号圆用深绿实心 + 白字。

### 规则 11：价值感要“小声”——稀有/完成/重要信号只用一个小标记 + 一种表面处理，绝不用满屏闪光

**为什么有效：** 所有顶级 TCG 的价值系统都是“一个小标记 + 克制处理”：宝可梦用圆/菱/星（后加金星）一个小符号，沿用数十年；炉石用肖像底部中央一颗宝石（白/蓝/紫/橙），金卡“只改外观、不改强度”；Marvel Snap 用边框色 + 逐级解锁的单一效果（破框 → 3D → 动画 → 边框动画），且升级“纯装饰、不影响强度”；MTG 用全息防伪戳 + 扩展符号色。反之，“处理方式”与“稀有度”是两个独立轴：无边框是处理、不是稀有度【标准/事实】。受控的反光区比整卡发亮更有冲击力【从业者共识】。

**具体例子：** 宝可梦 LV.X 的破框：宝可梦“冲出图窗、与卡面其他区域重叠，但不遮住游玩所需信息”——破框是点缀，信息优先。见：https://cardlines.com/a-history-of-pokemon-card-design-from-base-set-to-today/ 。炉石见：https://hearthstone.fandom.com/wiki/Rarity ；Snap 见：https://marvelsnapzone.com/marvel-snap-card-rarity-guide/ ；处理 vs 稀有度见：https://www.waffles.cards/guides/glossary/borderless

**应用到本卡（【本报告推论】）：** 不做游戏化稀有度。唯一允许的“高级信号”是：① 完成态用一枚小深绿对勾徽章；② 焦点卡允许 1 个破框元素（如人物手部/器具轻微溢出图窗 4–8px，但绝不遮标题与按钮）；③ 光泽只在图窗内、透明度 ≤15%（见规则 12）。三者不同时全开。

### 规则 12：动效只做“物理感”，不做“表演”——焦点卡倾斜 ≤8–10°、回正约 300ms、光泽跟随指针且极淡；网格卡只做抬升

**为什么有效（注意：以下数值是组件库默认值与从业者共识，非实验数据）：** 多个 3D 卡组件的默认值收敛在 maxTilt 12–15°（焦点大卡）、8°（小卡/网格卡），25° 以上远缘文字难读；透视 600–1100px、弹簧 stiffness 240–300 / damping 22–30、回正约 300–320ms、悬停放大 1.02–1.04；光泽为跟随指针的径向白光（中心约 15% 透明度、60% 处淡出）；真正卖“深度”的是层间视差（背景反向移动、前景多移），而非单纯旋转。紧网格中应降至 5° 或改用 hover lift，且“3D 卡只适合焦点卡，不适合一屏 20 张的网格”【从业者共识】。M3 动效 token：小过渡 50–200ms、中过渡 250–400ms、卡展开 300ms + emphasized 缓动，进入减速、退出加速且更快【标准/事实，二手整理】。

**具体例子：** Atropos 示例明确用 14°“刻意保守”，并指出 25°+ 会让远缘文字难读；HeroUI Holo Card 在小卡上主动降到 8° + 1.04 缩放 + 0.55 光泽强度，并用 activateOnHover 按需创建 3D 上下文以省移动端内存。见：https://mail.webdevpuneet.com/ui-snippets/atropos-3d-card/ 、https://github.com/garvit1000/animbits/blob/HEAD/content/docs/animations/cards/parallax-tilt.mdx 、https://www.nexus-ui.com/components/vector-tilt-scene 、https://docs-staging.heroui.pro/docs/react/components/holo-card 与 https://github.com/danieldevfull/material-design-3-skill/blob/HEAD/material-design-3/references/motion.md

**应用到本卡：** 桌面焦点卡：maxTilt 8°、透视 1000px、图层视差 ≤6px、光泽仅图窗内、离开时 300ms 回正；浏览网格卡：无倾斜，只有 translateY(-2px) + 淡阴影（200ms）；触屏：默认平放，不抢横滑手势。翻卡时长分歧见第 (d) 节，本报告暂定 500ms（见规则 13 配套）。

### 规则 13：减动效 = 用淡入替代位移，而非“一刀切全删”；JS 视差必须用 matchMedia 设门

**为什么有效：** WCAG 2.3.3（AAA）要求交互触发的运动动画须可禁用，除非动画对功能/信息必不可少；颜色、透明度、模糊变化明确不算“运动动画”【标准/事实】。WCAG 2.3.1（Level A）禁止每秒超 3 次的大面积闪烁【标准/事实】。最佳实践共识：`prefers-reduced-motion: reduce` 的正确响应是“减少而非移除”——把平移/缩放/旋转/视差换成短淡入或颜色变化，保留状态反馈；全局 `animation-duration: 0.01ms` 只是兜底，不是策略；JS 驱动的视差/GSAP 场景会绕过 CSS，必须显式用 `matchMedia('(prefers-reduced-motion: reduce)')` 设门并监听变化【从业者共识 + W3C 技术】。

**具体例子：** 翻卡组件的无障碍做法：减动效时禁用翻转动画、读屏只播报可见面、不可见面的可聚焦元素不可聚焦。见：https://accessibility.build/wcag/2-3-3 、https://www.modern-css-layouts.com/css-only-micro-interactions-animations/accessibility-in-css-animations/ 、https://www.humanstandards.org/perception/vision/motion-peripheral-vision/ 与 https://components.auroratide.com/flip-card

**应用到本卡：** `reduce` 下：倾斜/视差/光泽全部关闭；翻卡改为 150ms 交叉淡入（或即时切换 + 焦点移到背面标题）；按钮悬停保留颜色变化；另提供页内“减少动效”开关（高于系统设置时仍可手动开）【本报告推论】。

### 规则 14：用“可扫性”收尾——标题即答案、动词开头、数字具体、页脚低调；并在真实尺寸/距离/设备上测试

**为什么有效：** 用户以扫描为主：NN/g 经典研究中 79% 用户总是扫描新页面、仅 16% 逐字读；平均页面用户至多读 28% 的词【研究证据，1997/2008，年代久但方向被后续眼动反复确认】。NHS 内容风格：为读者（患者与照护者）而非临床医生写、阅读年龄 9–11 岁、重要信息前置、短句（15–20 词）、短段（2–3 句）、主动语态、称呼“你”【标准/事实，二手整理】。TCG 测试法：在 60cm 外（手臂长）读卡，重要文字读不出就太小；两类卡在桌对面分不清就对比不够；用“找费用、找数值、解读图标、读效果”等检索任务而非“好看吗”来测试【从业者共识】。

**具体例子：** ShuffleKit 的删字示范：把 “When you play this card, you may choose to gain one additional power resource…” 砍成 “Gain 1 power.”——意思相同，时间与注意力成本完全不同。护理卡平行示范：“把袖带缠在上臂”优于“请将血压计袖带妥善缠绕于被测者上臂部位”。见：https://shufflekit.com/blog/game-card-graphic-design-rules ；NHS 风格见：https://github.com/marrobi/nhs-alpha-workshop/blob/HEAD/.github/agents/nhs-content-designer.agent.md （二手整理）；测试法见：https://www.uvbira.com/trading-card-layout

**应用到本卡：** 标题用“任务 + 结果”句式（如“量血压：拿到一个可信的数字”）；每步以动词开头 + 具体数字（“静坐 5 分钟”“袖带与心脏同高”）；页脚只放“内容来源 / 更新日期 / 免责一行”，字小但对比度达标；发布前做 4 项自检：① 手机 360px 宽下无横向滚动；② 灰度模式下类别与警告仍可区分；③ 文本间距覆盖测试（行高 1.5/段距 2/字距 0.12/词距 0.16 时不裁切不重叠，WCAG 1.4.12，见 https://www.accsible.com/kb/wcag-1-4-12-text-spacing ）；④ 键盘 Tab 顺序 = 视觉顺序，翻卡后焦点落在背面标题。

---

## (b) 不要做：常见卡片设计失败清单

| # | 不要做 | 为什么（证据） |
|---|---|---|
| 1 | 为塞内容缩小字号，或出现文字墙 | 游戏王式失败：字随内容缩小、认知负荷爆炸，新手直接放弃。先删字、再分面。见 https://anthonyjschwartz.substack.com/p/wall-of-text-dilemma-yu-gi-oh-tcg |
| 2 | 文字浮在 busy 插画/照片/渐变上，无纯色面板、无 scrim | 背景 busy 杀死可读性；全艺卡也须留安静区。见 https://shufflekit.com/blog/game-card-graphic-design-rules 与 https://www.yahoracards.com/pokemon-tcg-cards/ |
| 3 | 每类卡换一套布局（标题一会儿在上、一会儿居中） | 破坏“学一次、处处用”；可比信息位置漂移导致眼动来回比较。见 https://shufflekit.com/blog/game-card-graphic-design-rules 与 https://www.nngroup.com/articles/cards-component/?lm=principles-visual-design&pt=article |
| 4 | 只用颜色区分（类别、状态、警告），无图标/文字 | 违反 WCAG 1.4.1 Level A；色盲与灰度下失效。见 https://accessibility.build/wcag/1-4-1 |
| 5 | 红色到处用（标题、按钮、装饰、强调） | 红色被稀释后，真正的“停下求助”警告不再跳出；且与既定约束冲突。警告须克制使用才有分量，见 https://design-system.service.gov.uk/components/warning-text/ |
| 6 | 警告放在按钮下方、折叠里、或页脚小字 | 用户不读按钮下方的文字；警告须在行动之前。见 https://design-histories.education.gov.uk/connect-families-to-support/giving-a-warning-on-connect-families-to-support-start-page |
| 7 | 警告只写“注意！”“危险！”而不写具体体征与下一步 | 惊悚但无行动指引，等于把决定推回给惊慌的人。危急 UX 须给“一个正确动作”。见 https://www.indegene.com/insights/reports/ux-design-in-healthcare-medical-emergencies |
| 8 | 插画风格混搭（扁平 + 写实 + 3D + 描边粗细不一）、每图换一套色 | 最大的一致性错误；品牌漂移与返工成本极高。见 https://getillustrations.com/blog/flat-vector-illustration-guide/ |
| 9 | 插画细节过多、背景高对比、主体在小尺寸下消失（muddy 缩略图） | 缩略图阶段就该定大明暗组；背景大对比会抢主体。见 https://www.creativebloq.com/3d/how-those-epic-hearthstone-cards-are-made |
| 10 | 图示单独承担含义，无配对文字、无图例 | 图示 + 配对文字才有强证据；复杂图标无培训会失败。见 https://pmc.ncbi.nlm.nih.gov/articles/PMC12098189/ 与 https://www.researchgate.net/publication/6691754_Use_of_pictorial_aids_in_medication_instructions_A_review_of_the_literature |
| 11 | 常驻重阴影 + 粗边框 + 大圆角同时上，或全套阴影一模一样 | 压平层级、显“模板感”；M3 已转向低 elevation/默认无阴影。见 https://m3.material.io/components/cards/overview 与 https://github.com/devamshah/velora-tprm/blob/HEAD/docs/design/premium-ux-research.md |
| 12 | 蓝渐变、处处 8px 圆角、Inter 默认字、统一阴影的“AI 模板脸” | 2026 年已被识别为低价值信号；高级感来自克制调色板与字重层次。见 https://wire.wise-relations.com/guides/design-system/ （【观点】，但与多源一致） |
| 13 | 网格里每张卡都 3D 倾斜/自动翻转/循环动画 | 视觉噪音 + 性能 + 前庭风险；3D 只给焦点卡。见 https://github.com/garvit1000/animbits/blob/HEAD/content/docs/animations/cards/parallax-tilt.mdx |
| 14 | 倾斜角度过大（>15°）、光泽过亮/彩虹色、翻转超 750ms | 远缘文字难读、显 gimmicky、显迟缓；减动效用户可能眩晕恶心。见 https://mail.webdevpuneet.com/ui-snippets/atropos-3d-card/ 与 https://accessibility.build/wcag/2-3-3 |
| 15 | 忽略 `prefers-reduced-motion`，或用全局 0.01ms 一刀切 | 前者是无障碍失败，后者会删掉必要的状态反馈。须“减少而非移除”。见 https://www.modern-css-layouts.com/css-only-micro-interactions-animations/accessibility-in-css-animations/ |
| 16 | 在可点击整卡上再叠多个按钮/链接（可操作元素嵌套） | M3 明确：不要在可操作表面上放置动作；会造成焦点与读屏混乱。见 https://m3.material.io/components/cards/accessibility |
| 17 | 卡内出现滚动条、标题换行超 2 行、信息密度无上限 | 卡是摘要容器；Carbon 设计系统要求卡标题至多 2 行、卡体不滚动、内容极简（转述 NN/g）。见 https://www.nngroup.com/articles/cards-component/?lm=principles-visual-design&pt=article |
| 18 | 用 Light/Ultralight 字重做中文正文，或给中文加字距 | 细字重在小尺寸低对比下失败；中文加字距会打散汉字网格。见 https://www.willchan.me/blog/typography-for-cjk-and-latin 与 https://github.com/yue1123/apple-hig-skills/blob/HEAD/apple-hig/references/foundations/typography.md |
| 19 | 医学术语不解释、被动语态、长句堆叠 | 违背健康素养原则；NHS 要求通俗语言、主动语态、重要信息前置。见 https://github.com/marrobi/nhs-alpha-workshop/blob/HEAD/.github/agents/nhs-content-designer.agent.md |
| 20 | 只在 200% 缩放的设计稿里看效果，不在真实尺寸/距离/手机上验 | 屏幕上好看的 8pt 字与 1px 细边，到桌对面/手机上全部失效。见 https://shufflekit.com/blog/game-card-graphic-design-rules |

---

## (c) 推荐卡片解剖结构（正面 / 背面）【本报告综合建议：分区逻辑有源，尺寸比例为推论】

### 0. 两种卡：浏览卡（摘要）与焦点卡（正反面）

- **浏览卡（网格/列表中）：** 只做摘要——小图 + 标题 + 一句话 + 类别标签 + 时长；点击进入焦点卡。网格卡之间**可比信息位置固定**（标题行、标签行、时长行永远同高），否则用户无法比较与寻找（NN/g 眼动证据，见规则 1）。桌面端同时提供“列表视图”切换：找已知任务时列表更可扫【研究证据】，见 https://www.nngroup.com/articles/cards-component/?lm=principles-visual-design&pt=article
- **焦点卡（本节主体）：** 一张竖卡，正反面同尺寸，翻转查看。比例取实体 TCG 的 **5:7**（标准卡 63.5×88.9mm，见 https://www.cardbop.com/guides/trading-card-size ）在屏幕上的等价：桌面宽 400–440px、高 560–616px；手机宽 100%（减去 32px 页边距）、高按 5:7 自适应且内容可纵向延展（**禁止固定高度裁切文字**，须通过 WCAG 1.4.12 间距覆盖测试）。

### 1. 正面（识别与判断）——高度占比与层级顺序

```
┌─────────────────────────────────┐
│ 顶栏 8%： [类别图标+标签]  编号·时长 │  ← 第 4 视线落点（先扫类别）
├─────────────────────────────────┤
│                                 │
│ 图窗 34%：暖米底插画，1 个主体   │  ← 第 1 视线落点（情绪/识别）
│   （可选 1 个破框元素 ≤8px）      │
│                                 │
├─────────────────────────────────┤
│ 标题区 15%：任务标题（≤2 行）     │  ← 第 2 视线落点（决策）
│   一句话结果（1 行，次要色）      │
├─────────────────────────────────┤
│ 关键事实 15%：3 条图标+文字       │  ← 第 3 视线落点（判断）
│   准备 / 用时 / 频率（各 1 行）   │
├─────────────────────────────────┤
│ 警告条 12%（仅当有）：红底浅+图标 │  ← 有则视觉跳出，但位置在按钮前
│   “停下来”标题 + 1 行体征摘要     │
├─────────────────────────────────┤
│ 底部 16%：[深绿主按钮：看步骤▶]   │  ← 第 5 落点（行动）
│   翻卡提示 · 来源/更新小字        │  ← 第 6 落点（信任背书）
└─────────────────────────────────┘
内边距：左右 24px、上下 20px；区块间距 16px；图窗圆角 12px、卡圆角 20px。
```

**视觉注意顺序（眼睛先看什么）：** ① 图（最大色块）→ ② 标题（最大字）→ ③ 警告条（仅有时，红色跳出）→ ④ 类别标签 → ⑤ 按钮。**阅读/决策顺序（应该按什么理解）：** 类别 → 标题 → 关键事实 → 警告 → 按钮。两者不必相同，但标题与警告在两种顺序里都必须靠前——这正是 TCG“图最大、名与数值最先被功能性读取”的双重层级（见规则 1 与分领域 1）。

**正面字阶：** 标题 30px/700；一句话 16px/500（对比度 ≥4.5:1）；关键事实 16px/500（数值加粗）；警告标题 17px/700、警告正文 16px/400；按钮文字 17px/600；页脚 14px/400。

### 2. 背面（步骤与核对）——高度占比与层级顺序

```
┌─────────────────────────────────┐
│ 顶栏 8%：[← 返回正面]  步骤 1/5   │  ← 方向感：永远知道自己在哪一面
├─────────────────────────────────┤
│ 步骤区 58%：                     │
│  ① 动词标题                      │  ← 第 1 落点：从 ① 开始顺序读
│     1–2 行具体做法 + 数字         │
│  ② …  ③ …  ④ …（4–6 步封顶）    │
│  每步左侧编号圆，步间 20px 留白   │
├─────────────────────────────────┤
│ 自查区 14%：“做对了是这样”        │  ← 第 2 落点：核对标准
│   ✓ 2–3 条可观察的完成信号        │
├─────────────────────────────────┤
│ 求助区 12%（红框，仅当有）：       │  ← 第 3 落点：异常分支
│   体征清单 + 联系动作             │
├─────────────────────────────────┤
│ 底部 8%：[✓ 我做完了]  ·  再看一遍 │  ← 第 4 落点：收尾
└─────────────────────────────────┘
```

**背面规则：** ① 步骤数 4–6 封顶，超了就拆卡；② 每步 1 个动词 + 1 个数字 + 至多 2 行，禁止段落；③ 步骤之间用留白 + 编号分隔，不用重分割线（留白即分组）；④ “做对了”自查用绿色对勾（非红色），与求助红框形成冷暖对照但各自另有图标与文字，不单靠颜色；⑤ 翻回正面的按钮永远在同一位置（顶栏左），与正面主按钮位置对称。

### 3. 网格与间距 token（【本报告推论】，基于 M3 8dp 网格与高级感研究的折中）

- 间距阶梯：4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px；卡内只用 8/12/16/20/24。
- 卡间距：桌面 24px、手机 16px；网格列数随宽自适应，但卡宽不小于 320px（否则中文每行不足 18 字）。
- 圆角：卡 20px、图窗 12px、标签/按钮 10px（按钮可 pill，但全套统一）；内圆角 + 内边距 ≈ 外圆角。
- 阴影：静止 0 层或 1 层极淡（`0 1px 2px rgba(0,0,0,.06)`）；悬停 1 层柔和（`0 8px 24px rgba(0,0,0,.10)`）+ 上移 2px，200–300ms。
- 动效 token：悬停 200ms、翻卡 500ms（减动效下 150ms 淡入）、倾斜回正 300ms；缓动统一用 1 条 emphasized 曲线（`cubic-bezier(0.2, 0, 0, 1)`，M3 token，见 https://github.com/danieldevfull/material-design-3-skill/blob/HEAD/material-design-3/references/motion.md ）。

### 4. 卡背（物理隐喻的“背面图案”，如需展示卡组/封面时）

实体 TCG 的卡背是统一品牌图案（宝可梦蓝底精灵球、MTG 卡背、Lorcana 墨水瓶意象），作用是“未翻开时也认得出这套卡”。网页版平行做法：卡组封面/加载占位用统一暖米底 + 深绿小徽标 + 细线纹理，不放任何文字信息；**不要**把步骤藏在“卡背图案”里——网页没有物理翻卡的必要成本，信息必须可达。

---

## (d) 开放问题：来源分歧 / 证据薄弱处

1. **翻卡时长分歧（200ms vs 500ms vs 750ms）：** Android 指南转述称 200–400ms、超 500ms 显迟缓；多数 CSS 教程用 600ms；flip-card 组件默认 750ms。本报告取 500ms 是折中推论，未经本应用用户测试。须用“翻 10 次是否烦躁”做真人测试后定。见 https://components.auroratide.com/flip-card
2. **圆角数值分歧（8px vs 12–16px vs 20–24px）：** SaaS 高级感研究称 6–8px 才“克制”、12px+ 显俏皮；Apple 系二手资料称卡 12–16pt；本报告取 20px 是基于“护理卡要温暖亲和 + 图窗大圆角”的推论。三者语境不同（数据工具 vs 消费应用 vs 情感化教育卡），无直接对照实验。见 https://github.com/devamshah/velora-tprm/blob/HEAD/docs/design/premium-ux-research.md
3. **图/文比例无通用标准：** MTG 约 40/60、宝可梦约 30/70 均为评论者估算【观点】，Lorcana 图占上半为事实描述；数字产品卡无公认比例。本报告正面图窗 34% 是综合推论，需 A/B 或眼动验证。见 https://www.coolstuffinc.com/a/jayannelli-07072025-magics-frame-making-the-cut
4. **照片 vs 插画，无直接强证据：** 综述支持的是“图示 + 文字”而非“插画优于照片”；照片在“设备真实外观、体征真实样子”上可能更可信，插画在“去噪、去敏感、一致性”上更强。本应用既定插画方向合理，但“低血糖面色、压疮外观”等需真实辨认的信号是否该用照片/写实小图，**须由临床内容方决定，本报告无证据裁决**。
5. **“80% vs 14%”记忆数字年代久、语境窄：** 转述自 Kessels 2003 对既往研究的叙述，经 HIFA 二次转述；原始研究针对特定人群与 pictograph，不可直接推广为“所有健康信息加图就记住 80%”。本报告已降级处理，引用时须加限定。见 https://www.hifa.org/dgroups-rss/health-literacy-patients-remember-80-what-they-are-told-if-pictures-are-used-only-14-if
6. **倾斜/光泽数值无实验支撑：** 8–15°、弹簧参数、光泽透明度均来自组件库默认值与从业者经验，无“何种角度最显高级”的对照研究；且在“冷静医疗”语境下光泽是否会显轻浮，**无任何来源讨论**，属本报告的风险提示：建议默认关闭光泽、仅焦点卡小范围试用并做用户访谈。
7. **中文最优字号无本土对照数据：** 18px/1.75 行高来自 CJK 排印实践与年长读者二手综合，未找到针对中国 40 岁照护者阅读护理卡的实测研究；繁简、系统字体渲染差异亦未覆盖。
8. **前庭安全阈值多为经验法则：** “不超中央视野 10%”“35% 的 40 岁以上成人受前庭疾病影响（NIH）”均经二手来源转述，未核对原始统计；WCAG 本身只要求“可禁用”，不给角度/面积阈值。见 https://www.humanstandards.org/perception/vision/motion-peripheral-vision/
9. **GDC/游戏美术演讲未获直接来源：** 本次检索未找到可引用的 GDC 卡牌设计演讲全文/官方记录，相关主张来自设计 teardown 与组件文档；如需演讲级证据，须另行检索 GDC Vault（多为付费/登录墙，本次未访问）。
10. **Awwwards 级案例未获可验证的获奖卡片拆解：** 检索到的多为聚合榜单与二手总结，无可引用的获奖项目官方 case study；本报告的高级感主张因此主要基于设计系统与从业者综合，置信度低于 TCG 与 WCAG 部分。
11. **MTG 稀有度符号色的细节未逐一核实：** 本报告只断言了“全息戳 + 符号”这一层，未展开历代扩展符号颜色规则；如需精确引用，须查 Scryfall/WotC 官方资料。
12. **Lorcana 费用位置存在来源笔误风险：** 个别二手指南称费用在“右上”，多数来源与官方图示为“左上”；本报告取多数（左上），并以 TurnZero 与 Lorcana Wiki 为准。见 https://turnzerohq.com/lorcana/how-to-read-a-lorcana-card

---

## 分领域发现（详细）

### 1. TCG：解剖、层级、边框演化、稀有度、颜色与图标

**共同解剖（七区母版）：** 顶部标题区、角落费用/条件标记、中央图窗、标题旁或图下的类型/派系标识、独立规则面板、分离的数值徽章/条、底部低调的署名/编号/版权【从业者共识】，见 https://www.uvbira.com/trading-card-layout 。各游戏只在“哪个角、哪种形状”上不同，七区本身高度稳定。

**视觉层级顺序（功能性读取）：** 名称与关键数值 → 效果/规则 → 风味/次要信息；实现靠位置 + 尺寸 + 字重，首要元素在顶部/中央、最大最粗，次要元素在下、更小更轻【从业者共识】，见 https://shufflekit.com/blog/game-card-graphic-design-rules 。Arkham Horror 被引为范例：自上而下扫过名称 → 关键数字 → 加粗关键词 → 描述 → 图标；游戏王为反例【观点】，见 https://gist.ly/youtube-summarizer/5-golden-rules-for-designing-game-cards-that-work 。另有“检索频率决定强调度”原则：每回合都查的（如类型）要突出，只查一次的（如购买费用）可缩小，见 https://shufflekit.com/blog/game-card-graphic-design-rules 。

**图窗比例与图框关系：** 实体卡 5:7（63.5×88.9mm）【标准/事实】。MTG 上半图、下半文【标准/事实】；宝可梦早期小图窗 → LV.X 破框（不遮信息）→ 2011 全艺（图为整卡背景、文字叠其上）→ Scarlet & Violet 插画稀有卡（图为场景叙事）【标准/事实】；Lorcana 图占上半、名在图下墨色横幅上【标准/事实】。三种图框关系各有代价：**收纳式**（图在窗内）最安全、最可读；**破框式**（主体溢出窗）最有张力但须保证信息不被遮；**全幅式**（图到边）最华丽但文字须有安静区/scrim，否则可读性崩溃。MTG 的三分法值得借鉴：无边框（图到边、文字浮图上）、扩展艺（保留文本框、图只扩到左右边）、展示框（重设计边框但保留边距）【标准/事实】，见 https://www.waffles.cards/guides/glossary/borderless

**边框演化与原因：**
- MTG：1993 原框（文字直接印在纹理框上、难读）→ 1996 Mirage（图/文框等宽、对齐、降对比）→ 2003 现代框（深字浅底、加框、Matrix Bold、减纹理、放大图/文框；为远距离可读 + 突出图与攻防 + 箔片效果）→ 2014 M15（边框变细、全息戳、文框下黑区便于机器读取、专有字体）→ 2019 后展示框时代（每系列主题框 + 无边框 + 复古框并行，默认框 11 年未大改）。见 https://mtg.wiki/index.php?title=Dark_frame& 与 https://www.pipglyph.com/articles/mtg-card-frame-eras-explained
- 宝可梦：1999 黄边小窗 → e-Card 宽边（为 e-Reader 点码条让路，功能改变比例）→ EX/金星破框试探 → LV.X 立体破框 → 2011 全艺 → 2023 灰边（与日版一致 + 箔片透出）+ 插画稀有卡体系。主线是“图逐渐逃出盒子”，但普通卡母版始终保留。见 https://cardlines.com/a-history-of-pokemon-card-design-from-base-set-to-today/
- 共同规律：**默认框越改越安静（减纹理、减边框、提对比），花哨全部移到“特殊处理”上**——普通卡负责可读，特殊卡负责惊喜。这是本应用最应抄走的一条：日常卡安静统一，里程碑/完成态才给特殊处理。

**规则文字排印：** MTG 用关键词加粗 + 提醒文字（斜体小字）+ 法术力符号内嵌；宝可梦用能量符号 + 招式名加粗 + 伤害数字右对齐；游戏王 OCG 用编号圆点分段（西方版缺失导致文字墙）；炉石用关键词加粗 + 极短文本（通常 ≤3 行）。共同原则：**先删字、再分段、再符号化，绝不先缩字**。

**稀有度/箔片（价值信号如何不吵）：** 见规则 11。补充：宝可梦稀有符号在编号旁的小角落（圆/菱/星→金星），位置固定、全套一致【标准/事实】，见 https://cardlines.com/a-history-of-pokemon-card-design-from-base-set-to-today/ ；Lorcana 稀有符号在底部中央【标准/事实】，见 https://lorcana.fandom.com/wiki/Card_Layout ；Snap 的 Finish（改背景）与 Flare（3D 空间粒子层）分离，组合数以百计但每张卡只显示一种组合【标准/事实】，见 https://marvelsnapzone.com/infinity-splits/

**颜色编码：** MTG 五色 + 金（多色）+ 银灰（神器），各有底纹；宝可梦属性色 + 能量图标；Lorcana 六墨色 + 双指示；One Piece 六色 + 六角 + 横幅；炉石职业色框 + 稀有宝石色（两套颜色各司其职：框色=职业、宝石色=稀有）。教训：两套颜色系统必须正交（各管一事），否则用户分不清“这个颜色在说什么”【本报告推论】。

**图标系统：** 重复短语符号化（规则 10）；图标须形状各异（圆/盾/菱/星），不能只换颜色；新图标须配图例；图标在小尺寸与灰度下须可辨。One Piece 的 Counter 侧读、Lorcana 的传说值菱形、炉石的攻/血双球（左下攻、右下血）都是“位置 + 形状”双编码的范例。

**各游戏“不一样且有效”之处（对照表）：**

| 游戏 | 与众不同且有效的做法 | 对护理卡的启发 |
|---|---|---|
| MTG | 类型行紧贴图下，像图的副标题；默认框 30 年不动位置，只提可读性 | 类别标签紧贴图下；母版稳定压倒一切 |
| 宝可梦 | 图从“窗内肖像”进化为“整卡场景叙事”，插画稀有卡让普通宝可梦也有好图 | 插画要讲“正在发生的照护瞬间”，而非摆拍肖像 |
| 炉石 | 椭圆肖像 + 双球数值 + 单颗稀有宝石，数字产品化最彻底；金卡只动外观 | 数字卡的数值要“球/徽章化”、位置固定；完成态只动外观 |
| 游戏王 | （反面）属性 + 星级 + 摆动双框信息密度最高，但文字墙代价最大 | 密度有上限；编号分段是低成本解药 |
| Marvel Snap | 全幅角色图 + 仅左上费用/右上力量两个数字，文字极简；破框作为升级奖励 | 焦点卡可以图更大、字更少，但须保证文字区安静 |
| Lorcana | 名称在图下墨色横幅上（而非顶部），故事书感；可入墨金环是“边框即规则” | 标题不一定非在顶部，但全套必须一致；边框细节可以携带规则 |
| One Piece | 费用左上圆、力量右上大字、Counter 左缘侧读、底部横幅类别+名+类型 | 检索频率最高的数字要最大、最靠角；底部横幅是放“类别+标题”的好位置 |

### 2. 数字产品卡片 UI

NN/g、M3 与高级感研究已在规则 1/8/14 中引用。补充三点：① **图/文比无标准答案**，但原则是“图须值回空间”——太小而看不清细节的截图/缩略图不如没有，须裁到可识别特征、用稳定长宽比、避免任意裁切混用【从业者共识】，见 https://open-design.ai/blog/cards-vs-lists/ 。② **卡 vs 列表**：浏览/异质集合用卡，搜索/比较/排序用列表；同质项目（如一列相似文章）用列表更可扫【研究证据】。护理卡组是“异质任务集合 + 找已知任务”双重场景，故须同时提供网格与列表两种视图【本报告推论】。③ **信息密度上限**：卡是“几条短信息”的容器，标题至多 2 行、卡体不滚动、内容极简；超了就该是详情页而非卡【从业者共识】。

### 3. 可读性与信任

已在规则 3/4/5/6/14 中详述。补充：① WCAG 1.4.12 的四个间距值是“用户覆盖后不丢失内容”的测试条件，不是设计默认值；但对中文卡而言，行高 1.75 已接近该测试值，布局须留有余量（弹性高度、禁止 `overflow:hidden` 裁字）。② 信任来自“可验证的细节”：具体数字、具体体征、可观察的完成信号、来源与更新日期——而非“权威感”的装饰。NHS 风格的前置重要信息 + 短句 + 主动语态 + “你”称呼，是降低焦虑的文字侧解法。③ 警告的“不吓人”来自三点：具体（写体征不写恐吓词）、有出口（写下一步动作与电话）、克制（全站只有这一种红色）。

### 4. 插画入卡工艺

已在规则 4/9/11 中详述。补充失败模式的力学解释：① **图框打架**：图窗背景与卡面背景色差过小 → 图“漏”出窗；图窗内高对比细节顶到窗边 → 视觉上图在“撞框”。解法：图窗底色与卡面拉开一度（暖米 vs 纯白），主体与窗边留 8% 安全距，破框元素只允许 1 个且方向一致。② **缩略图发 muddy**：小尺寸下细节糊成一片，主因是明暗组太多、主体占比太小。解法：缩略图测试（缩到 120px 宽仍能认出动作）+ 大明暗组先行。③ **光影不一致**：各图光源方向、阴影软硬、投影有无不一，并排时立刻显“拼凑”。解法：冻结光源与阴影规则（见规则 9）。④ **背景连续性**：全幅/破框处理时，图窗背景须与卡面背景“有关系”（同色系深浅）而非撞色，否则图像贴纸。暖米图窗 + 白卡 + 雾灰页底的三级关系，正是本应用已有的正确结构。

### 5. 卡片动效

已在规则 12/13 中详述。补充：① **翻卡的无障碍 choreography**：翻转须由按钮触发（非仅悬停）、翻转中背面不可聚焦、翻完焦点移到背面标题、读屏只播报可见面、减动效下改淡入【从业者共识 + 组件实践】，见 https://components.auroratide.com/flip-card 。② **光泽的行为**：光泽应跟随指针位置移动、强度随离中心距离衰减、只在悬停时出现、离开时淡出；彩虹/全息色在医疗语境下风险未验证，建议只用白光。③ **性能**：只动画 `transform` 与 `opacity`，3D 上下文按需创建（hover 才建），网格卡禁用 3D。④ **时长总原则**：面积越大、移动越远，时长越长；进入比退出慢；所有 UI 动画单次不超过 700ms【从业者共识】。

---

## 来源（按首次引用顺序，均为 2026-11-17 读取；`index` = 搜索/文本抓取，`browser_open` = 全文抓取，`verified live` = 研究浏览器实查）

1. MTG 边框史（Wiki，二手但引注 WotC 资料）— https://mtg.wiki/index.php?title=Dark_frame& — `browser_open`
2. MTG 边框评论（40/60 估算属观点）— https://www.coolstuffinc.com/a/jayannelli-07072025-magics-frame-making-the-cut — `index`
3. MTG 边框时代梳理 — https://www.pipglyph.com/articles/mtg-card-frame-eras-explained — `index`
4. 宝可梦卡设计史 — https://cardlines.com/a-history-of-pokemon-card-design-from-base-set-to-today/ — `browser_open`
5. 宝可梦全艺座谈转述 — https://www.gamerbraves.com/how-pokemon-tcgs-full-art-cards-went-from-booster-pack-gimmick-to-collectors-obsession/ — `index`
6. 炉石稀有度 — https://hearthstone.fandom.com/wiki/Rarity — `index`
7. Marvel Snap 稀有度/分裂 — https://marvelsnapzone.com/marvel-snap-card-rarity-guide/ 与 https://marvelsnapzone.com/infinity-splits/ — `index`
8. Lorcana 读卡 — https://turnzerohq.com/lorcana/how-to-read-a-lorcana-card 与 https://lorcana.fandom.com/wiki/Card_Layout — `index`
9. One Piece 读卡 — https://getzukan.com/academy/guides/how-to-read-one-piece-cards — `index`
10. 游戏王文字墙评论 — https://anthonyjschwartz.substack.com/p/wall-of-text-dilemma-yu-gi-oh-tcg — `index`
11. 游戏王重设计（4–6pt 说法）— https://portfolio.delsing.net/yu-gi-oh — `index`
12. TCG 布局指南 — https://www.uvbira.com/trading-card-layout — `browser_open`
13. 游戏卡 6 规则 — https://shufflekit.com/blog/game-card-graphic-design-rules — `browser_open`
14. 五金律（Arkham/游戏王对照）— https://gist.ly/youtube-summarizer/5-golden-rules-for-designing-game-cards-that-work — `index`
15. 无边框/扩展艺三分法 — https://www.waffles.cards/guides/glossary/borderless — `index`
16. 全艺可读性要点 — https://www.yahoracards.com/pokemon-tcg-cards/ — `index`
17. 标准卡尺寸 5:7 — https://www.cardbop.com/guides/trading-card-size — `index`
18. 炉石作画流程 — https://www.creativebloq.com/3d/how-those-epic-hearthstone-cards-are-made — `index`
19. NN/g 卡片定义 — https://www.nngroup.com/articles/cards-component/?lm=principles-visual-design&pt=article — `browser_open`
20. Material Design 3 卡片总览 — https://m3.material.io/components/cards/overview — `browser_open`（研究浏览器实查时页面空白未渲染，内容以文本抓取为准，未标记 `verified live`）
21. M3 卡片无障碍 — https://m3.material.io/components/cards/accessibility — `index`
22. M3 形状/圆角 — https://m3.material.io/styles/shape/corner-radius-scale — `index`
23. M3 动效过渡 — https://m3.material.io/styles/motion/transitions — `index`
24. 高级感 vs 模板（从业者综合）— https://github.com/devamshah/velora-tprm/blob/HEAD/docs/design/premium-ux-research.md — `index`
25. AI 模板味信号（观点）— https://wire.wise-relations.com/guides/design-system/ — `index`
26. 高级网站共性（观点）— https://www.elegantstudios.online/insights/premium-website-design.html — `index`
27. 卡 vs 列表 — https://open-design.ai/blog/cards-vs-lists/ — `index`
28. WCAG 对比度 — https://www.procurveux.com/blog/color-contrast-ratio-wcag 与 https://accessibilitychecking.org/wcag-color-contrast-requirements/ — `index`
29. WCAG 1.4.1 仅颜色 — https://accessibility.build/wcag/1-4-1 — `index`
30. WCAG 1.4.12 文本间距 — https://www.accsible.com/kb/wcag-1-4-12-text-spacing — `index`
31. 年长读者字号综合 — https://www.adoc-studio.app/blog/typography-guide 与 https://github.com/mlaroque/ux-older-people-skill/blob/HEAD/ux-older-people/references/research-sources.md — `index`
32. CJK 排印 — https://www.typotheque.com/articles/typesetting-cjk-text 、https://www.willchan.me/blog/typography-for-cjk-and-latin 与 https://www.az-loc.com/best-fonts-for-chinese-japanese-korean-websites/ — `index`
33. Apple HIG 排印（二手整理）— https://github.com/yue1123/apple-hig-skills/blob/HEAD/apple-hig/references/foundations/typography.md 与 https://www.floow.design/blog/mobile-app-typography-guide — `index`
34. 用药信息设计范围综述（Russell 等 2025）— https://pmc.ncbi.nlm.nih.gov/articles/PMC12098189/ — `browser_open`
35. 图示出院指导系统综述更新 — https://jenonline.org.marlin-prod.literatumonline.com/article/S0099-1767(26)00060-7/fulltext — `index`
36. 图示辅助综述 — https://www.researchgate.net/publication/6691754_Use_of_pictorial_aids_in_medication_instructions_A_review_of_the_literature — `index`
37. 80%/14% 转述（薄弱证据）— https://www.hifa.org/dgroups-rss/health-literacy-patients-remember-80-what-they-are-told-if-pictures-are-used-only-14-if — `index`
38. GOV.UK 警告文 — https://design-system.service.gov.uk/components/warning-text/ — `browser_open`
39. 警告位置设计史 — https://design-histories.education.gov.uk/connect-families-to-support/giving-a-warning-on-connect-families-to-support-start-page — `index`
40. 急诊联系页措辞 — https://www.londonbusiness.news/emergency-contact-pages/ — `index`
41. 危急时刻医疗 UX — https://www.indegene.com/insights/reports/ux-design-in-healthcare-medical-emergencies — `index`
42. 渐进披露/多步骤 — https://timgraf.com/ux-design/the-ux-of-multi-step-processes-a-practical-guide-to-designing-wizards-stepped-flows-and-multi-page-tasks-users-actually-complete/ — `index`
43. NHS 内容风格（二手整理）— https://github.com/marrobi/nhs-alpha-workshop/blob/HEAD/.github/agents/nhs-content-designer.agent.md — `index`
44. Lenovo 插画品牌指南 — https://origin-brandworld.lenovo.com/visual-identity/illustration/ — `index`
45. 扁平矢量指南 — https://getillustrations.com/blog/flat-vector-illustration-guide/ — `index`
46. 插画系统方法 — https://github.com/studio-manfred/manfred-shared-knowledge/blob/HEAD/plugins/manfred-ui-design/skills/illustration-style/SKILL.md — `index`
47. Headspace/Duolingo 案例 — https://www.rmcad.edu/blog/illustration-for-mobile-apps-enhancing-user-experience-with-visuals/ 与 https://www.manypixels.co/blog/brand-design/brand-guides — `index`
48. Atropos 倾斜（14°）— https://mail.webdevpuneet.com/ui-snippets/atropos-3d-card/ — `index`
49. 视差倾斜卡（15°/网格 5°）— https://github.com/garvit1000/animbits/blob/HEAD/content/docs/animations/cards/parallax-tilt.mdx — `index`
50. Vector Tilt（12°）— https://www.nexus-ui.com/components/vector-tilt-scene — `index`
51. Holo Card（小卡 8°）— https://docs-staging.heroui.pro/docs/react/components/holo-card — `index`
52. M3 动效 token（二手整理）— https://github.com/danieldevfull/material-design-3-skill/blob/HEAD/material-design-3/references/motion.md — `index`
53. WCAG 2.3.3 动画 — https://accessibility.build/wcag/2-3-3 — `index`
54. 减动效实践 — https://www.modern-css-layouts.com/css-only-micro-interactions-animations/accessibility-in-css-animations/ 与 https://www.humanstandards.org/perception/vision/motion-peripheral-vision/ — `index`
55. 翻卡组件无障碍 — https://components.auroratide.com/flip-card — `index`

**未遵循的页面指令：** 无。检索中未遇到要求改变任务、访问指定链接或复制内容的要求；所有页面内容仅作证据使用。

**核查限制：** 本报告无 `verified live` 标记的来源——研究浏览器实查 M3 卡片页时页面空白未渲染（JS 重型页面），故全部事实以搜索索引与文本抓取为准，并对关键标准（WCAG 对比度、NN/g 定义、MTG/宝可梦边框史）采用多源交叉核对。Apple HIG、NHS 风格、M3 动效 token 三处为二手整理转述，已在正文中标注，引用时建议再核对官方原文。
