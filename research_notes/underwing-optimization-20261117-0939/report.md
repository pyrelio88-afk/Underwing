# 居家护理卡片 Web 应用进一步优化研究报告

> 阅读说明：本报告用中文撰写，研究对象为任务描述中的单文件静态应用（一个 `index.html`、内联 CSS/JS/图片、零后端、双击 `file://` 打开、须离线工作；面向约 40 岁、非医学背景、首次照护年迈父母的家庭照护者，简体中文，桌面优先 + 移动单列；TCG 卡片隐喻：正面含类型条、标题、插图、三项数值、一条关键提示、红色停手条，背面为“为什么 + 步骤概览”，带 3D 倾斜与翻转；另有牌组、图书馆（搜索 + 48 个状况、8 组）、个人记录时间线（血压/血糖、用药记录、症状日记、IndexedDB 上传文件）与打印；数据只留设备，localStorage + IndexedDB，无账号、无服务器；硬约束：不诊断、不替代医生、不给用药剂量建议，红色仅用于“停手并联系医疗帮助”，每条临床陈述须可溯源，隐私优先）。
>
> **证据标注约定**：【事实】= 权威来源原文可核查的主张；【二手】= 经二手文章转述的研究或标准，方向可信但数字未核对原始论文；【观点】= 本报告基于来源所做的设计推断，需用真实用户验证。每个主要主张后附来源 URL。阅读时间：2026-11-17。仅 NHS 警告组件页为研究浏览器实时核验（`verified live`），其余为索引/文本抓取（`index`）。

## 摘要

最值得先做的事不是加功能，而是**收紧信任链**：让用户在 30 秒内看懂“这是什么、它不能做什么、数据去哪了、出现危险信号时该做什么”，并让最危险的失败（数据丢失、找不到卡、误读红色警告、翻转卡片读不到背面）变得不可能或可恢复。

按影响排序的核心结论：

1. **把“就医分级”做成 NHS 式的一句话行动标题 + 短清单**，红色只保留给真正的停手情形，且每张卡的红色条必须是该卡特有的触发条件，而非千篇一律的套话——否则会触发警报疲劳，用户会连真正重要的警告一起忽略。
2. **把翻转/倾斜重做为无障碍的“展开”交互**：真实按钮 + `aria-expanded`、背面内容可聚焦、减动效时改为淡入/即时切换、倾斜只作装饰。否则键盘与读屏用户将读不到背面，而这正是临床内容所在。
3. **把数据持久化当作安全功能**：请求持久存储、捕获配额错误、用“导出备份”作为真正的防丢机制，并诚实告知 Safari 7 天、隐私模式、清浏览器数据、换浏览器/换文件路径都可能丢数据。`file://` 下的存储行为在各浏览器并不一致，必须实测，不能假设。
4. **给图书馆装上“俗语同义词 + 引导式找卡”**：中文无空格、日常说法与医学术语差异大，只做标题精确匹配会让焦虑用户找不到卡。先做受控标签 + 别名字典 + 3 步引导问题，暂缓完整分面系统。
5. **给单文件定死体积预算并改用 SVG 插图系统**：Base64 内联图片自带 +33.3% 膨胀，且无法被压缩挽回；48 张卡若每张一张位图，文件会迅速失控。SVG 组件化 + 有限调色 + 复用元素，是唯一能同时保住一致性、体积与打印效果的路线。
6. **不要用游戏化去“激励”照护行为**：连续打卡、排行榜、积分为焦虑的照护者制造羞耻与压力，且参与度不等于效果。可以保留“复习”本身（间隔重复有证据），但要去掉惩罚性的断签机制。

---

## 一、排名推荐（按影响，含 WHY / 具体示例 / 来源）

### R1. 重做“何时就医”表达：三级分流 + 一句话行动标题 + 该卡特有的触发清单

- **WHY（为什么有效）**：NHS 数字服务手册的 care cards 模式经测试发现，用户扫读页面时会停下来读卡片并理解要采取的行动；其规则是标题即一个清晰的行动号召（如 “Call 111 if:” / “Speak to a GP if:”），正文为短项目符号清单，并按症状可能性与严重程度排序；同时要求避免在一页放太多卡，“我们想提供关键信息并安抚人们，而不是吓唬他们”【事实】。警告组件页进一步要求每页不超过 2 个 callout、“安抚而非惊吓”，标题要短而清晰，帮助扫读与无法靠颜色区分的用户【事实，verified live】。警报疲劳研究则解释了反面机制：当 85%–99% 的报警信号无需行动时（美国联合委员会估计，经二手文章转述），大脑会习得性地忽略信号，临床医生对药物警报的忽略率达 49%–96%【二手】。
- **具体示例（文案结构，非临床内容）**：把卡片红色条从通用句改为：
  > **停手，立即联系医疗帮助，如果出现：**（项目符号 3–5 条，每条一个可观察的现象，如“呼吸明显比平时费力”——具体条目须由临床来源逐条核定）
  >
  > **不确定是不是紧急情况？** 先按紧急处理 / 拨打本地急救电话（号码须按目标地区核实，**不得照搬 NHS 示例中的 999/111**）。
  >
  > 另设一层非红色（蓝/琥珀）的“尽快咨询医生/药师，如果……”卡，用于非紧急情形，避免所有提醒都染红。
- **来源**：https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care ；https://service-manual.nhs.uk/design-system/components/warning-callout ；https://www.halo-lab.com/blog/alert-fatigue-in-healthcare
- **与现有约束的关系**：与“红仅用于停手就医”完全一致，且更进一步——红不但不能挪作他用，还不能在每张卡上以相同套话重复出现，否则红色本身会贬值【观点】。

### R2. 翻转/倾斜改为符合 W3C 披露（Disclosure）模式的无障碍交互，并提供应用内“减动效”开关

- **WHY**：W3C ARIA 实践指南的披露卡片示例要求：卡片用 `<article>` 承载，内嵌一个披露按钮，用 `aria-expanded` / `aria-controls` 标明状态，用 `aria-labelledby` 把卡片标题与“详情”组合成简短可理解的按钮名；**不得把整个富摘要嵌进一个按钮**（会导致按钮名冗长混乱且 HTML 无效）；按钮获焦时整张卡片显示轮廓；减动效/高对比用户不播放动画【事实】。翻转卡片的 WCAG 专项分析还要求：隐藏面不得获得键盘焦点（除非焦点会触发翻转使其可见），悬停/聚焦翻转须可用 Esc 恢复，翻转动作须能用键盘触发【事实】。`prefers-reduced-motion` 的正确做法是把装饰性大位移动画只放在 `no-preference` 分支里，默认即静止安全态；3D 旋转、缩放、视差是最常见的眩晕触发因素【事实】。
- **具体示例**：
  - 每张卡一个可见按钮，文字如“查看背面：为什么这样做”，展开后变为“收起背面”；点击卡片其他区域也可切换，但焦点始终落在按钮上（与 W3C 示例一致）。
  - 隐藏面用 `hidden` / `inert` 彻底移出 Tab 序与无障碍树；翻转时不移动焦点。
  - 减动效（系统设置 **或** 应用内开关，二者任一生效）时：翻转改为即时切换或短淡入，倾斜完全关闭，卡片仍完整可读。
  - 倾斜（鼠标跟随）不得承载任何信息：所有倾斜时可见的提示，正面静止时也必须可见。
- **来源**：https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-card/ ；http://me2accessibility.com.au/flip-card.html ；https://dev.to/parsajiravand/youre-animating-for-everyone-prefers-reduced-motion-fixes-that-2ond ；https://www.laarpi.com/guides/accessible-motion

### R3. 数据防丢三件套：请求持久存储 + 配额/失败可恢复 + 一键导出/导入备份（把备份当作主功能）

- **WHY**：MDN 明确：浏览器存储默认是“尽力而为”（best-effort），存储压力下按最近最少使用（LRU）逐个删除整个源的数据，且删除是“全部一起删”；只有被授予持久存储的源才跳过自动驱逐；Safari 在开启防跨站追踪时，若某源在最近 7 天浏览器使用中无交互，会主动删除其脚本创建的数据【事实】。localStorage 每源上限 5 MiB（sessionStorage 另 5 MiB），超限抛 `QuotaExceededError`，须用 `try...catch` 处理【事实】。`navigator.storage.persist()` 只是“请求”，浏览器可能拒绝（Chrome 按参与度静默决定，Firefox 会弹窗，Safari 规则不透明），返回 `false` 不是错误，而是“未授予”【事实/二手】。Ink & Switch 的本地优先七理想则把“长久（Long Now）”与“用户最终拥有并控制数据”列为核心，首要落地动作就是导出为 JSON/PDF 等扁平标准格式【事实】。
- **具体示例**：
  - 首次保存记录后（而非首次打开时）在合适的时机调用 `persist()`，并记录 `persisted()` 结果；若未授予，不弹窗吓唬用户，而是在“我的记录”页用一句平实话提示：“浏览器可能在空间不足时清除数据，建议每月导出一次备份。”
  - 每次写入包在 `try...catch` 中；配额满时给出可操作文案（“空间不足，本次未保存。先导出备份，再删除旧文件后重试”），并保留用户刚输入的内容不丢失。
  - 导出：一个按钮生成一个带日期的文件名（如 `照护记录备份-2026-11-17.json`），内含版本号、记录条数、每条记录的唯一 ID 与时间戳；同时提供“打印/另存为 PDF”的人类可读版。导入：选择文件 → 显示“将导入 X 条血压、Y 条用药……”预览 → 用户选择“合并”或“替换（先自动下载当前备份）”→ 完成后显示成功条数与跳过的损坏条数。导入前自动备份是强制步骤，不可跳过【观点】。
  - 在“关于/隐私”页用图示说明数据位置：“只存在这台设备的这个浏览器里。换浏览器、换手机、清除浏览器数据、隐私模式关闭后，记录都不会跟着走——导出文件就是唯一的搬家方式。”
- **来源**：https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria ；https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist ；https://www.inkandswitch.com/local-first-software/ ；https://www.offlineprotocol.com/learning/local-first/seven-ideals-of-local-first-software

### R4. 30 秒信任开场：首屏回答四个问题，教程改为“用时提示”

- **WHY**：GOV.UK 服务手册要求起始页只给“刚好够用户理解服务做什么、是否符合自己需要”的信息，并说明耗时与所需材料，复杂的资格判断放到服务内的引导问题中【事实】。NN/g 关于引导的研究（经二手文章转述）发现，预先的演练式教程会打断用户、未必提升任务表现且很快被遗忘，而上下文帮助可避免这些问题；移动端研究中跳过教程的参与者任务表现至少一样好且略快【二手】。CDC 清晰沟通指数（20 个评分项）把“主要信息与行动号召”放在首位，并以 90% 作为清晰沟通阈值【事实】；AHRQ 的“通用预防”原则主张默认假设所有人都可能难以理解健康信息，而非先筛选人群【事实】。
- **具体示例（首屏四句话结构）**：
  1. 这是什么：“给第一次在家照护父母的家属的步骤卡，每张卡讲一件事。”
  2. 它不能做什么：“不诊断、不替代医生、不告诉你吃多少药。”
  3. 数据去哪了：“所有记录只存在这台设备上，不联网、不注册。换设备要靠导出文件。”
  4. 现在能做什么（三个入口，选其一）：“发生了什么事？（引导找卡）/ 搜索症状或做法 / 先看看最常用的 6 张卡”。
  - 牌组/记录等功能的说明不放在开场，改为各自的空状态里的一句话 + 一个主按钮（见 R8）。
- **来源**：https://www.gov.uk/service-manual/design/govuk-content-transactions ；https://www.cdc.gov/health-literacy/php/develop-materials/guidance-standards.html ；https://pmc.ncbi.nlm.nih.gov/articles/PMC5114169/ ；https://www.theafrodity.com/post/the-ux-of-onboarding-how-to-turn-new-users-into-engaged-ones

### R5. 中文排版基线：正文 ≥17px、行高 1.7–1.8、每行 ≤40 字、系统字体、字号可调

- **WHY**：汉字几乎占满整个 em 方块（约 80%–95%），拉丁文舒适的 1.5 行高在中文里会显得拥挤，中文排版实践为 1.75–1.8【事实】；另一排版来源建议 CJK 行高约 1.7【事实】。WCAG 2.1 的 1.4.8（AAA 视觉呈现）把 CJK 每行上限定为 40 字形【事实】。老年用户指南普遍以 16px 为最小值并建议 18px，40 岁后老视已常见【二手】。正文字号用拉丁文的“12px 足够”标准套中文是常见错误。对中文正文加字间距会打乱汉字网格，应保持为 0【事实】。CJK 网页字体体积巨大，应使用系统字体栈，避免把兆字节字体放在关键路径上【事实】。WCAG 1.4.12 要求用户把行高调到 1.5 倍、段间距 2 倍等间距覆盖时内容与功能仍可用【事实】。
- **具体示例**：正文 `font-size: 17px–18px; line-height: 1.75; letter-spacing: 0; max-width: 40em`（卡片背面与详情页）；卡片正面小字（类型条、数值标签）不低于 14px 且必须有文字标签；提供“标准 / 大字”两档（存在本地设置中），并保证浏览器 200% 缩放与手机双指缩放不被禁用、布局不崩。
- **来源**：https://www.willchan.me/blog/typography-for-cjk-and-latin ；https://www.typotheque.com/articles/typesetting-cjk-text ；http://umatechnology.org/make-text-easier-to-read-by-balancing-font-size-and-line-length/ ；https://en.gehirngerecht.digital/good-ui-ux-design-for-older-people/

### R6. 触摸与对比基线：主操作 48px、次要 44px、对比 4.5:1 起步，焦点永远可见

- **WHY**：WCAG 2.2 AA 的 2.5.8 要求目标至少 24×24 CSS px（仅为法律底线），AAA 的 2.5.5 为 44×44；Apple 人机界面指南默认控件 44×44 pt，Material Design 要求至少 48×48 dp【事实】。对焦虑、手抖或单手持机的照护者，24px 只是“合规”，44–48px 才是“可用”【观点】。对比度 AA 为正文 4.5:1、大字 3:1、非文本界面元素 3:1，AAA 为 7:1 / 4.5:1【事实】；WCAG 2.2 新增的 2.4.11 要求获焦元素不被粘性头部等内容完全遮挡，2.4.13（AAA）要求焦点指示至少 3:1 对比与约 2px 实线周长【事实】。
- **具体示例**：翻转按钮、加入牌组、搜索框、记录表单的提交按钮一律 ≥48px 高；图标按钮用内边距把命中区撑到 44px（图标本身可以小）；所有可交互元素用 2–3px 高对比描边作 `:focus-visible` 样式，且滚动时用 `scroll-margin` 避开粘性栏；红色停手条的文字与背景对比单独验算，不得只靠“红色醒目”——NHS 警告组件的标题/背景对比达 11.92:1【事实，verified live】。
- **来源**：https://www.html-hunter.com/touch-target-size-guidelines-how-big-should-mobile-buttons-be-in-2026/ ；https://scalecomposer.com/learn/spacing/touch-targets/ ；https://www.a11yflow.dev/blog/color-contrast-wcag-developer-guide ；https://www.audioeye.com/gb/post/wcag-22/

### R7. 图书馆找卡三件套：俗语别名搜索 + 受控标签（2–3 个维度）+ “发生了什么？”引导

- **WHY**：中文日常临床表述与标准术语差异大（同义词、缩写、行话、错别字并存），“没有足够同义词的术语集不足以胜任日常临床术语识别”，而中文无自然空格使任务更难【事实】。因此只索引标题与医学术语的搜索，必然漏掉用日常语言提问的用户。NN/g 区分“过滤器”与“分面导航”：分面是多个过滤器的组合，能全面描述内容集，但“创建与维护成本显著更高且增加交互成本”，应先确认用户确实需要分面再建【二手】。GOV.UK 的做法是“一页一问”为默认，复杂分流用服务内的路由问题完成【事实】。
- **具体示例**：
  - 每张卡增加一个不显示的 `aliases` 字段：俗语、症状说法、易混说法、常见错写（如“血压高”与正式名并列），搜索时对标题、别名、症状、标签统一做子串/n-gram 匹配并高亮命中词；无结果时显示“没有找到‘X’。试试：……（3 个相近说法）/ 浏览全部 8 组 / 回答 3 个问题找卡”，绝不只显示“无结果”。
  - 标签只做 3 个维度：① 所属组（现有 8 组）；② 情景（如“跌倒后 / 发烧时 / 吃药时 / 夜间”）；③ 身体部位/主题。每张卡每维度 1–2 个标签，由受控词表产生，禁止自由标签泛滥。
  - 引导流程最多 3 问，每问一页（或一屏一问），有“上一步”与“跳过，直接浏览”，结尾给出 1–3 张候选卡 + 就医分级卡，并保留“都不像 / 不确定”出口——结尾措辞必须是“这些卡可能相关”，绝不是“你可能是……”。
- **来源**：https://pmc.ncbi.nlm.nih.gov/articles/PMC5414139/ ；https://www.fernandoux.com/en/wiki/techniques/filters-and-faceted-search/ ；https://gov-cy.github.io/govcy-design-system-docs-v0/patterns/question_pages/ ；https://www.gov.uk/service-manual/design/govuk-content-transactions

### R8. 空状态与错误恢复：每个空容器都回答“为什么空、这里装什么、下一步点哪里”

- **WHY**：NN/g 把空状态定义为系统状态与任务发起机制，有三项工作：说明内容为何缺失、教用户容器里该装什么、提供直达相关任务的路径【二手】；且加载未完成时显示“无记录”会误导用户以为已加载完【二手】。错误信息指南要求人类可读的措辞，且不只靠颜色传达错误【二手】。
- **具体示例**：
  - 空牌组：“你的牌组还是空的。把常看的卡加进来，下次打开直接从这里开始。”+ 按钮“去图书馆挑第一张卡”。
  - 空记录：“还没有记录。记一次血压只要 30 秒，记下来方便下次看医生时给医生看。”+ 按钮“记第一条”。
  - 搜索无结果、筛选为零、导入失败、保存失败各写专属文案与恢复动作（清除筛选 / 重新选择文件 / 保留已输入内容重试），不用同一句“出错了”。
  - 删除记录用“撤销”而非二次确认弹窗轰炸；真正不可逆的操作（清空全部记录）才用确认，且确认前先提示导出。
- **来源**：https://www.uxia.app/blog/empty-state-design ；http://umatechnology.org/empty-state-design-what-should-users-do-when-content-is-missing/

### R9. 单文件体积预算 + SVG 插图系统：先定预算，再画画

- **WHY**：2025 年 Web Almanac 中位首页为桌面 2.86 MB / 移动 2.56 MB，图片占最大头（桌面 1,058 KB、移动 911 KB）【事实】；移动首页 <1 MB 时 57% 通过全部核心网页指标，≥5 MB 时仅 30%【二手】。Base64 编码的数学开销恒为 +33.3%（3 字节变 4 字符），且 gzip 对已压缩图片几乎无效，无法挽回这部分膨胀【事实】。web.dev 的格式指南则指出：几何图形用矢量格式，WebP/AVIF 压缩优于旧格式但应配 JPEG/PNG 回退，且“图片中的文字不可选中、不可搜索”应避免【事实】。图标系统研究的共识是：先定网格、描边、圆角与细节程度，再扩充集合；用可复用组件 + 设计令牌（颜色/尺寸）约束变化，装饰性 SVG 用 `aria-hidden` 隐藏【事实】。
- **具体示例（预算为本报告建议值，非行业标准）**：整文件目标 ≤2 MB、上限 3 MB；其中 HTML+CSS+JS ≤400 KB，全部插图合计 ≤1.2 MB，单张卡图 ≤25 KB（Base64 后计）。插图改为：同一 24×24/48×48 网格、同一描边宽、同一有限调色（且红色不进入插图调色）、可复用部件库（人物、床、药盒、温度计等）+ `<use>` 复用；每张卡的插图 = 场景模板 + 1–2 个主题部件，而非 48 张风格各异的位图。位图仅在“必须用照片级细节”时使用，且须先缩放到显示尺寸的 2 倍以内再转 WebP（AVIF 作渐进增强，见“未证实/待定”）。
- **来源**：https://almanac.httparchive.org/en/2025/page-weight ；https://web.lumintu.workers.dev/read-https-dev.to/toolstead/base64-overhead-why-data-uris-make-files-33-bigger-406c ；https://web.dev/articles/choose-the-right-image-format?source=mytechmint.com ；https://futuramo.com/blog/icon-system-design-practical-guide/

### R10. 延迟渲染 + 分块渲染图书馆：48 张卡不同时进 DOM

- **WHY**：MDN 的 `content-visibility: auto` 会在元素离屏时跳过布局与绘制，但内容仍保留在 DOM、无障碍树、页内查找与 Tab 序中，须搭配 `contain-intrinsic-size` 预留尺寸以免滚动跳动【事实】。关键洞察【观点】：对内联 data URI 图片而言，`loading="lazy"` 帮不上忙——图片字节已在 HTML 文件里，解析成本已付；真正省的是“少建 DOM、少初始化倾斜/翻转监听器”。核心网页指标的“良好”阈值为 LCP ≤2.5 秒、INP ≤200 毫秒、CLS ≤0.1（按 75 百分位）【二手】，长列表一次性渲染最容易拖垮 INP 与 CLS。
- **具体示例**：图书馆默认只渲染首屏 + 1 屏的卡片，其余用 `IntersectionObserver` 在接近视口时渲染（`rootMargin` 约 400px）；每张卡片容器加 `content-visibility: auto; contain-intrinsic-size: auto <卡高>px` 作渐进增强（不支持的浏览器只是慢一点，不会坏）；搜索/筛选时先渲染前 12 张，滚动到底部再追加，并保留“已显示 X / 共 Y 张”的状态文字（供读屏与焦虑用户确认）。
- **来源**：https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility ；https://digitalmatters.me/search-engine-optimization-seo/core-web-vitals/

### R11. 每张卡的“信任脚注”：来源、复核日期、版本号、变更说明

- **WHY**：健康信息可信度清单的共性要求是：谁写/谁审、来源是否可查、何时更新、是否与主要卫生机构一致、隐私如何保护【事实】。HONcode 的原则（现已停办，不可声称认证）同样要求：注明作者资质、信息只作补充不替代医患关系、引用来源与日期、清楚显示临床页面的最后修改日期【事实】。NHS 设有专门的 Review date 组件，提示内容复核节奏【事实，verified live 页面导航中可见该组件】。
- **具体示例**：卡片背面底部固定三行小字（但不小于 14px）：“来源：××指南/机构（名称 + 发布年份）；本卡复核于 2026-XX-XX；版本 vX.Y”。内容有实质性临床变更时，在图书馆与牌组中给该卡挂“已更新”标记 30 天，点击后显示“本次改了什么（一句话）”；仅文字润色不挂标记，避免标记贬值。整应用设“内容更新日志”页，列出每次临床内容变更的日期、卡片与依据。
- **来源**：https://www.tramelovixa.com/evaluate-online-health-information ；https://openmd.com/guide/health-information-quality-seals ；https://webarchive.library.unt.edu/eot2008/20090508174648mp_/http://www.hon.ch/HONcode/Conduct.html

### R12. “带去看医生”一页纸：把记录时间线变成可打印、可分享的就诊摘要

- **WHY**：照护者案例研究反复出现的痛点是：信息碎片化（化验、住院、多次就诊、用药变化），而就诊时“时间就是金子”，医生问到历史数据点时照护者需要立刻找到并说清【二手】；事件式存储（每次感染/手术/治疗自成一段完整历史）被用作解法【二手】。另一案例研究指出，照护者是“看不见的第二用户”，他们在替患者翻译医学语言、在一部手机上 juggling 多个入口【二手】。GOV.UK 的任务清单模式则证明：把多步骤事务分组、标明顺序与完成状态，能显著降低多会话任务的负担【事实】。
- **具体示例**：“生成就诊摘要”按钮 → 自动汇总最近 N 天的血压/血糖（只列数值与时间，不做解读、不画趋势诊断）、用药记录、症状日记要点、用户勾选的 2–3 张相关卡标题 → 一页可打印版（见 R14）+ 可下载的纯文本/JSON；顶部留空行供手写“这次最想问医生的 3 个问题”。措辞上明确：“这是你的记录，不是医生的诊断依据，医生会结合检查判断。”
- **来源**：https://www.lucassemelin.com/en/cases/eunoia-care ；https://www.zaid.design/portfolio/the-invisible-second-user ；https://design-system.service.gov.uk/patterns/complete-multiple-tasks/

### R13. 温和复习（无惩罚的间隔重复）+ 收藏/最近看过，而非打卡

- **WHY**：认知科学的元分析支持“分散练习 + 提取练习”：Cepeda 等 2006 年对 317 个实验的元分析发现分散优于集中练习；Roediger & Karpicke 的测试效应表明主动回忆优于重读；Dunlosky 等把“练习测试”与“分散练习”评为高效用策略，重读与划线为低效用【二手】。Anki 的调度源自 SM-2，更新的 FSRS 进一步优化间隔；但系统评价提醒，Anki 与成绩的关联多为观察性、结果不一【事实】。反面证据同样明确：游戏化研究的伦理讨论指出，断签带来的羞耻感通知会把支持变成压力，“参与度不等于效果”，应优先灵活目标与可暂停的提醒【二手】。
- **具体示例**：“今天复习 3 张”——从牌组中挑用户最久没看的 3 张，先盖住背面问一句（“这张卡的关键提示是什么？”），用户点“想起来了 / 再看一遍”后才翻开；不设连续天数、不设排行榜、不设“你已 5 天没复习”的催促；复习记录只存在本地，用户可一键清零。收藏（牌组）与“最近看过（最近 6 张）”分开：前者是用户主动的“常用”，后者是自动的“继续看”。
- **来源**：https://www.stepgenie.app/blog/spaced-repetition-usmle-flashcards ；https://link.springer.com/article/10.1007/s40670-026-02643-5 ；https://www.gamificationhub.org/ethical-concerns-gamified-mental-health-apps/

### R14. 打印工艺：展开双面、每卡不跨页、黑白可读、带日期与来源

- **WHY**：打印样式指南的共识是：`@media print` 内隐藏导航等界面噪声，`break-inside: avoid` 让卡片/图表/表格不被拦腰截断，`break-before: page` 只在真正的章节边界使用（滥用会产生近空白页），且高于一页的元素必然会被拆分、无法强求完整【事实】。对本应用，打印是“离线场景的延续”：贴在冰箱上的卡、带去医院的纸，都必须在没有屏幕交互时自足【观点】。
- **具体示例**：打印时：① 隐藏导航、搜索、倾斜/翻转控件；② 每张被打印的卡自动展开为“正面内容 + 背面内容”上下堆叠，红色停手条在打印中保留为粗边框 + “停手”文字（不依赖彩色打印）；③ 每张卡 `break-inside: avoid`，卡与卡之间 `break-before` 只在“每张卡一页”模式下启用；④ 页脚自动带“打印于 2026-XX-XX · 内容版本 vX.Y · 来源见卡片脚注 · 本页不能替代医生判断”；⑤ 链接后附完整 URL 文字（打印版无法点击）；⑥ 至少用 Chrome 与 Safari 各打 3 页以上实测，含黑白模式。
- **来源**：https://thevalleyofcode.com/css-printing/ ；https://www.mironsoft.de/en/blog/css-print-stylesheets-modern-print-layouts

### R15. 相关卡片人工精选（每卡 2–3 条）+ “易混淆”提示

- **WHY**：纯关键词自动关联在健康内容里容易把“看起来像”与“临床上相关”混为一谈；NHS 模式的经验是内容关联须遵循临床建议、保持简短具体【事实】。人工精选的成本在 50 张量级可承受，且可随内容复核一并复核【观点】。
- **具体示例**：每张卡背面底部：“接下来常一起看：① ……（同组下一步）② ……（常被一起问到）③ ……（容易混淆：区别是……，一句话）”。“易混淆”条只写可观察的区别，不写诊断鉴别。
- **来源**：https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care（内容须简短具体、遵循临床建议的原则）

### R16. 渐进披露三层结构：正面一句话 → 背面为什么+步骤 → 详情（来源/常见误区/记录入口）

- **WHY**：渐进披露把信息分层：首层只放最常见/最关键的元素，需要更多的人通过明确操作深入；过度隐藏会把关键信息埋到找不到【事实】。健康类低素养用户的设计同样主张“在需要的时刻逐步呈现，而非一次性前置全部内容”【二手】。
- **具体示例**：正面 = 类型 + 标题 + 插图 + 三项数值（须有文字标签，见“未证实”）+ 一条关键提示 + 红色条；背面 = 为什么 + 步骤概览（不超过 5 步，每步一句话）；点击“了解更多”才展开详情层：完整步骤清单（可勾选，进度存在本地）、常见误区、来源脚注、“记一条相关记录”入口。步骤清单用 GOV.UK 任务清单式呈现：分组、顺序、完成态，且勾选状态可撤销、可重置，不与任何评分挂钩。
- **来源**：https://quality.arc42.org/approaches/progressive-disclosure ；https://www.UXMATE-BLOG.COM/2025/11/28/how-to-design-health-apps-low-literacy-patients-actually-use/

---

## 二、各研究问题的发现

### 1. 焦虑的非专业用户 UX

- **信任来自“可核查的克制”**：首屏四问（R4）+ 每卡来源脚注（R11）+ 隐私实话（R3）共同构成信任；不要用“专业”“权威”等自夸词代替可查的来源与日期【观点】。健康技术信任指南的六项做法包括：明说数据去向、写读者能读懂的语言、标明临床复核者与日期【二手】，来源：https://www.hatypo.studio/insights/healthtech-ux-design-accessibility-compliance-and-trust
- **找卡方式的优先级**【观点，基于 R7 来源】：紧急/不知道叫什么 → 引导问题；知道叫什么 → 搜索；想系统学 → 按组浏览。三者并列在首屏，不互相替代。搜索框的占位文案用用户的语言，如“试试：发烧、跌倒、吃错药……”（示例措辞，非临床建议）。
- **错误恢复**：表单验证在提交前即时、具体（“血压值看起来少了一位，请检查”而非“输入无效”）；所有破坏性操作可撤销；网络/存储失败时保留用户输入【观点】。错误不用颜色单独传达【二手】，来源：http://umatechnology.org/empty-state-design-what-should-users-do-when-content-is-missing/
- **“何时叫急救”而不恐慌/不麻木**：分级（紧急/尽快/常规）+ 一句话行动标题 + 短清单 + 每页限量 + 具体可观察的触发条件 + “不确定就按紧急处理”的兜底句。不要用感叹号堆叠、闪烁、倒计时制造紧迫感【观点】，依据见 R1 来源。

### 2. 无障碍（老年与压力读者）

除 R2/R5/R6 外，补充：

- **图标必须配文字**：NN/g 的图标可用性研究结论是“通用图标极少（家、打印、放大镜搜索），几乎所有图标都需配文字标签，且标签须始终可见，不得依赖悬停揭示（触屏上根本不存在悬停）”【事实】，来源：https://www.nngroup.com/articles/icon-usability/
- **数值与图表须有文字等价物**：三项数值若用点数/星级/条形呈现，须同时有文字（如“常见程度：高”）与 `aria-label`；血压/血糖趋势图须配数据表或文字摘要【观点，源于 WCAG 非文本对比与信息可感知原则】。
- **不依赖颜色**：红色条、标签颜色、状态颜色一律配文字/形状/位置三重线索；色盲与灰度打印下仍可区分【观点】，NHS 警告组件以标题文字而非颜色传达重要性即为例证【事实，verified live】。
- **键盘全流程**：从首屏到找卡、翻转、加牌组、记一条记录、导出、打印，全程只用 Tab/Enter/Space 可完成；焦点顺序与视觉顺序一致；模态框（如有）须 trapping 焦点并可用 Esc 关闭【观点，源于 WCAG 2.1.1/2.4.7】。
- **无实验室测试法**：① 只用键盘走一遍；② 200% 缩放 + 手机系统大字体；③ 免费读屏（NVDA / VoiceOver）走一遍翻卡与记账；④ 对比度检查器逐一验算文字/焦点/红色条；⑤ 自动化扫描（axe 等）作初筛，**不能代替真人测试**；⑥ 找 1–2 位 60 岁以上亲友做“大声想”测试（见第七节脚本）【观点，综合 WCAG 与可用性测试来源】。

### 3. 单文件 / 离线优化

- **体积预算**：见 R9。补充：不要把“中位网页 2.5 MB”当作目标——那是全网的“现状”，而非“良好”；对 `file://` 双击打开的场景，解析与首次绘制成本与文件大小直接相关，手机上更敏感【观点】。核心网页指标阈值（LCP/INP/CLS）可作为实验室测量标尺，但 `file://` 下无真实用户数据，须用本地实测（低端安卓 + 节流）代替【观点】。
- **图片格式决策**：几何/扁平插图 → 内联 SVG（可复用、可随文字缩放、打印清晰）；照片级细节 → WebP 为默认，AVIF 为渐进增强（`<picture>` 回退链），JPEG 仅作最老浏览器的兜底。web.dev 明确 WebP/AVIF“通常压缩更好，应在可能时使用”，并配 JPEG/PNG 回退【事实】，来源：https://web.dev/articles/choose-the-right-image-format?source=mytechmint.com ；格式尺寸对比（WebP 比 JPEG 小 25%–35%，AVIF 比 JPEG 小 40%–50%）为二手方向性数据，实际须以本应用的图实测【二手】，来源：https://www.fileshrinkr.com/blog/best-image-format-for-websites
- **data URI 的代价**：Base64 +33.3% 且 gzip 救不回【事实】。因此：① 能 SVG 就不位图；② 位图先缩小尺寸再编码；③ 同一图只存一次（CSS 变量/` <use>`/JS 复用），不得每卡重复内联同一张图；④ 不要为“首屏快”而内联全部 48 张图——首屏只需要首屏的图（见 R10 分块渲染，图片字节仍在文件里，但 DOM 与解码成本可省）。
- **保持 `file://` 兼容**：不得使用 `fetch()` 加载本地相对文件（多数浏览器会因 CORS/源策略拒绝）、不得依赖 ES 模块跨文件加载、不得假设 `navigator.storage.persist()` 在 `file://` 下可用（MDN 注明 Storage API 在部分浏览器仅限安全上下文，且不透明源可抛错）【事实】，来源：https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist 。所有功能须在“双击打开、无服务器、无网络”下实测通过。
- **诚实的 PWA 选项**：Service Worker 只能在 HTTPS（或 localhost）注册，`file://` 打开无法注册；完整 PWA 需要 manifest + Service Worker + HTTPS 三者齐备【事实】，来源：https://fit.neu.edu.vn/en/post/service-worker-va-pwa-xay-dung-ung-dung-web-hoat-dong-ngoai-tuyen 。因此：① `file://` 版**不是** PWA，也不应自称 PWA；它能做的是“浏览器书签/添加到主屏幕的快捷方式”（行为因浏览器而异，须实测说明）；② 若未来提供同一文件的 HTTPS 托管版，可加 manifest + Service Worker 实现安装与离线，但**存储源会分裂**——`file://` 版与 HTTPS 版的数据互不相通，须在界面上明说并引导用户用导出文件迁移；③ 不要为 PWA 而引入任何联网请求（分析、字体、CDN），否则会破坏“不联网”的隐私承诺【观点】。
- **打印**：见 R14。

### 4. 最佳健康/教育卡片与牌组应用的差异

**值得抄的（有来源支撑的做法）**：

| 做法 | 榜样/来源 | 如何落到本应用 |
|---|---|---|
| 就医分级卡（标题即行动） | NHS care cards（已测试，2026 年复测更新）https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care | R1 |
| 警告限量 + 标题传达重要性 | NHS warning callout（verified live）https://service-manual.nhs.uk/design-system/components/warning-callout | 每页 ≤2 个警告，标题含动词 |
| 一页一问 + 任务清单 | GOV.UK 设计系统 https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ | R7 引导、R16 步骤清单 |
| 间隔重复 + 提取练习 | Anki/SM-2/FSRS 研究综述 https://link.springer.com/article/10.1007/s40670-026-02643-5 | R13 温和复习 |
| 收藏 + 最近看过分离 | 通用图书馆模式（本报告推断） | R13，避免“牌组”同时承担两种语义 |
| 就诊摘要/事件式时间线 | Eunoia 案例 https://www.lucassemelin.com/en/cases/eunoia-care | R12 |
| 双视角、共享真相、分享可见 | Elli Cares  redesign https://dtailstudio.com/blog/designing-for-patients-and-caregivers | 导出/打印时明示“这份文件包含哪些记录、将发给谁由你决定” |
| 本地优先 + 开放格式导出 | Obsidian/Indenta 模式 https://indenta.app/blog/local-first-note-taking | R3 |

**看起来好但对这个受众会失败的**：

- **连续打卡/排行榜/积分**：羞耻与压力机制，参与度≠效果（见 R13 来源）；照护本已是负担，任何“你落后了”的信号都会侵蚀信任【观点】。
- **AI 问答/症状自查器**：直接违反“不诊断”硬约束，且无法保证每条回答溯源；引导式找卡的终点必须是“相关卡片”，不是结论【观点】。
- **用游戏数值暗示病情轻重**：若三项数值被读作“严重度/危险度”，用户会据此决定是否就医，风险极高；数值含义必须在卡上用文字说清，或改为非临床维度（如“步骤数/耗时/难度”并注明为学习难度）【观点，待与内容团队确认数值定义——见未决问题】。
- **无限滚动 + 算法推荐**：焦虑用户需要“边界感”（共多少张、看到哪了），无限流会制造失控感；推荐若基于浏览历史，还会与隐私承诺冲突【观点】。
- **社交分享/家庭群组同步**：无服务器架构下无法安全实现；分享应限定为“用户主动导出的文件”，且分享前预览内容【观点】。

### 5. 本地优先数据 UX

- **存储分层建议**【观点，基于 MDN 配额事实】：设置与牌组（小）→ localStorage；记录、文件、日记（大）→ IndexedDB；绝不把上传文件转 Base64 存 localStorage（5 MiB 上限极易爆）。写入前用 `navigator.storage.estimate()` 做一次容量自检，接近上限时提前提示导出。
- **驱逐现实**：Chrome 60% 磁盘、Firefox 尽力模式取 10% 磁盘与 10 GiB 组上限较小者、Safari 浏览器应用约 60% 磁盘——容量通常不是问题，**驱逐才是**：LRU + Safari 7 天无交互 + 隐私模式 + 用户清数据，四条路径都可能整源删除【事实】，来源：https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- **`file://` 的特殊风险**：二手资料对各浏览器在 `file://` 下的 localStorage/IndexedDB 行为说法不一（Firefox 拦截并抛 `SecurityError`、Chrome 按文件划分源、Safari 拦截等），且 MDN 指出 `file:` URL 的行为未定义【二手】，来源：https://www.xjavascript.com/blog/javascript-html-storage-options-under-file-protocol-file/ 。**本报告无法确认当前版本浏览器的实际矩阵，必须实测**（见“未证实”）。防御性设计：启动时做存储探针（写-读-删一个测试键，捕获异常），探针失败时进入“无存储模式”：全部功能可读，记录功能改为“仅本次会话 + 强烈引导导出”，并用平实语言说明原因，而不是白屏或静默丢数据。
- **导出/导入的非技术用户测试标准**：一位从没导过文件的 40 岁用户，在无人指导下能在 3 分钟内完成“导出 → 找到文件 → 在另一台设备/另一浏览器导入 → 看到记录条数一致”。达不到，就简化（更少选项、更大按钮、每步一句话、完成后显示条数）【观点】。
- **隐私文案原则**：说具体的、可验证的事实（“本页面不向任何服务器发送请求，你可以在断网时打开它验证”），不说抽象口号（“银行级加密”“绝对安全”）；说清边界（“但浏览器清除数据会删记录，所以要备份”）；任何“发送”动作都由用户显式发起（下载文件、系统分享、打印），应用内不设“上传/同步”按钮【观点】。
- **多设备现实**：无账号即无同步，这是诚实的设计选择，不是缺陷。提供：① 导出文件迁移（主路径）；② 导入时按记录 ID + 时间戳合并，冲突时保留两者并标注来源设备/导入时间，绝不静默覆盖用药与生命体征记录；③ 导出文件中带“设备名”（用户可改，如“妈妈的平板”），便于多设备对账【观点】。

### 6. 信息架构（13 张 → 50+ 张）

- **标签与过滤**：见 R7。补充：8 个组是“浏览骨架”，标签是“情景入口”，搜索是“直达”，引导是“不知道叫什么时的拐杖”——四者分工不同，不要合并成一个 mega-filter。过滤器须显示“已选”状态与“一键清除”，并实时显示结果数【二手】，来源：https://www.fernandoux.com/en/wiki/techniques/filters-and-faceted-search/
- **引导找卡（“发生了什么？”）**：见 R7。补充：问题用“发生了什么/哪里不舒服/什么时候开始的”这类事件语言，不用医学分类语言；每步都可回退；全程不收集、不存储答案（除非用户主动记入日记）【观点】。
- **相关卡片**：见 R15。
- **版本与“已更新”信号**：见 R11。补充：区分“内容版本”（临床实质变更）与“应用版本”（界面/功能变更），用户只关心前者；“已更新”标记须有过期时间（30 天），过期自动消失，避免永久徽章贬值【观点】。
- **中文搜索质量**：见 R7。补充技术路线【观点】：纯前端实现可用“子串 + 别名表 + 拼音首字母（可选）”三层；不要引入分词库（体积与 `file://` 兼容性代价大，50 张量级不需要）；搜索质量用“真实照护者说出的 20 个找卡说法”作测试集，逐条验算能否在前 3 个结果中找到目标卡，找不到就补别名——别名表是内容工作，不是算法工作。

### 7. 无追踪的度量

- **可做的（仅本机）**：① 本地计数器：每张卡的查看、加入牌组、打印、复习完成次数，只存数字，不存时间线与身份，用户可在“我的数据”页查看与清零；② 本地搜索日志：只记“无结果的查询词”（去重计数），帮助补别名，用户可查看/删除，永不外发；③ 卡片内嵌一句反馈：“这张卡有帮助吗？有帮助 / 没看懂 / 不需要这张”，结果只存本地聚合计数；④ 导出“使用摘要”（可选）：用户主动导出一个不含任何记录内容的统计文件发给制作者，作为改进依据——须在导出前逐项展示将包含什么【观点】。
- **不可做的**：任何联网分析（包括号称隐私友好的分析服务）都会破坏“什么都不离开设备”的承诺。Plausible 的模式（无 Cookie、无个人数据、每日轮换标识、只看聚合趋势）可作为**未来 HTTPS 托管版**的参考，但对当前 `file://` 单文件版不适用——它需要联网发送数据，且 `file://` 下难以可靠工作【事实/观点】，来源：https://cdn.mattias.engineer/privacy-focused-web-analytics
- **3–5 人可用性测试脚本（可直接用）**：NN/g 的模型（单用户发现约 31% 的问题，5 人约 85%）的前提是“找问题而非测指标”，且 Faulkner 的复现显示 5 人实际发现率在 55%–95% 间波动，因此正确用法是“测 5 人 → 修 → 再测 5 人”，而不是“测 5 人就宣称 85% 已解决”【事实/二手】，来源：https://www.nngroup.com/articles/5-test-users-qual-quant/ ；https://www.userlytics.com/resources/blog/why-10-participants-give-you-the-complete-ux-picture/
  - **参与者**：3–5 位真实家庭照护者（40 岁左右、非医学背景、至少 1 位用安卓手机、至少 1 位用过微信内置浏览器打开文件——如目标渠道含微信，见未决问题）。
  - **伦理**：用虚构情景（“假设你妈妈昨晚跌倒了……”），不用参与者家人的真实健康信息；可随时停止；不记录可识别信息；测试的不是参与者，是产品。
  - **任务（每人 30–40 分钟，大声想）**：
    1. （找卡）“你妈妈昨晚起夜跌倒了，现在说髋部疼。你用这个应用找找该怎么做。”——观察：用搜索/浏览/引导？多久找到？是否误读红色条？
    2. （读卡）“把这张卡从头读到尾，告诉我它让你做什么、不让你做什么。”——观察：是否发现背面？数值是否被误解？
    3. （牌组）“把你觉得以后还会看的 2 张卡收起来，下次打开能直接找到。”——观察：空状态文案是否被理解？
    4. （记录）“记一次今天的血压 138/88。”——观察：表单是否可完成？错误提示是否可懂？
    5. （备份）“假设你要换手机，把这里的记录带走。”——观察：能否找到导出？能否说出文件在哪？
    6. （打印）“把这张卡打印出来贴在冰箱上。”——观察：打印预览是否自足？
    7. （减动效/键盘，二选一）用键盘或开系统减动效走一遍翻卡。
  - **记录**：每任务记“成功/求助后成功/失败 + 卡住的原话 + 耗时”，会后按“多人卡住 → 高优先级”排序修复，再测下一轮。

---

## 三、Do NOT Do 清单（不要做，含原因）

| 不要做 | 原因 | 来源/依据 |
|---|---|---|
| 在非停手场景用红色（按钮、徽章、装饰、插图、错误提示以外的强调） | 红色一旦泛滥，停手信号即贬值；警报疲劳的机制是“信号不可靠 → 大脑学会忽略” | https://www.halo-lab.com/blog/alert-fatigue-in-healthcare |
| 每张卡放相同的通用红色套话 | 同上；且用户会跳过“又是一样的那句话”，连卡特有的触发条件一起错过 | 同上 + NHS“简短具体”原则 |
| 用闪烁、抖动、倒计时、感叹号堆叠制造紧迫感 | 违反 WCAG 2.3.1（闪烁）与减动效原则；恐慌降低理解力 | https://www.laarpi.com/guides/accessible-motion |
| 只用悬停/倾斜揭示信息 | 触屏无悬停、键盘无悬停、读屏无悬停；违反内容须可感知原则 | https://www.nngroup.com/articles/icon-usability/（标签须始终可见） |
| 把整张卡做成一个按钮/链接 | 按钮名冗长混乱、HTML 无效、读屏体验差 | https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-card/ |
| 隐藏面仍可 Tab 到 | 焦点落在看不见的元素上，用户会以为页面卡死 | http://me2accessibility.com.au/flip-card.html |
| 声称“PWA/可安装/自动同步”而实际是 `file://` 单文件 | Service Worker 需 HTTPS，`file://` 无法注册；虚假承诺摧毁信任 | https://fit.neu.edu.vn/en/post/service-worker-va-pwa-xay-dung-ung-dung-web-hoat-dong-ngoai-tuyen |
| 加入任何联网请求（分析、字体、CDN、图片外链） | 破坏“不联网/离线/数据不出设备”的核心承诺，且 `file://` 下外链失败即破图 | 本报告推断，基于任务约束 |
| 用 localStorage 存上传文件或大记录 | 5 MiB 上限，超限抛错且静默丢数据风险高 | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria |
| 假设 `persist()` 一定成功或 Safari 数据一定保留 | 授予与否由浏览器决定；Safari 有 7 天主动驱逐规则 | 同上 |
| 用游戏化惩罚（断签、扣分、排行榜、催促通知） | 制造羞耻与压力，参与度≠效果；照护者已在高负荷下 | https://www.gamificationhub.org/ethical-concerns-gamified-mental-health-apps/ |
| 做症状自查/AI 问答/诊断结论 | 违反硬约束；无法逐条溯源；引导流程的终点只能是“相关卡片” | 任务约束 + NHS 模式边界 |
| 给用药剂量建议或解读血压/血糖数值 | 违反硬约束；记录页只呈现数值与时间，不做“正常/偏高”判定（阈值须由医生结合个体判断） | 任务约束 |
| 照搬 NHS 的 999/111 或其他地区的急救号码 | 号码因地区而异；错误号码在紧急时是致命缺陷 | https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care（示例号码仅适用于英国） |
| 声称 HONcode 认证 | HONcode 认证项目已于 2022 年 12 月关闭；可借鉴其原则，不可声称认证 | https://openmd.com/guide/health-information-quality-seals |
| 在图片里放文字（标题、步骤、警告） | 图片文字不可选中、不可搜索、读屏读不到、缩放模糊 | https://web.dev/articles/choose-the-right-image-format?source=mytechmint.com |
| 禁用双指缩放/系统字体缩放 | 老年与低视力用户的主要无障碍手段即缩放 | WCAG 缩放相关实践（见 R5 来源） |
| 上线“器官进展滑块”而不经临床验证 | 未找到任何证据支持“滑块可视化器官进展”对非专业照护者有益；进展暗示可能被误读为预后判断（见未决问题） | 本报告检索未获支持证据 |
| 为每张卡生成风格各异的 AI 位图 | 一致性、体积、打印、版权四重失控；48 张量级下不可维护 | R9 来源 + 本报告推断 |

---

## 四、Quick wins（<1 天）vs Bigger bets（含工作量粗估）

> 工作量为本报告粗估（单人、熟悉代码库的前提），仅供排期参考，非实测数据。

### Quick wins（每项数小时～1 天）

| # | 事项 | 粗估 | 对应推荐 |
|---|---|---|---|
| Q1 | 首屏四句话 + 三个入口（纯文案与布局） | 0.5 天 | R4 |
| Q2 | 全部图标配可见文字标签；图标按钮命中区撑到 44px | 0.5 天 | R6、图标研究 |
| Q3 | 正文 17–18px、行高 1.75、行宽 40em、中文零字间距；小字 ≥14px | 0.5 天 | R5 |
| Q4 | `:focus-visible` 高对比描边 + `scroll-margin`；红色条对比验算 | 0.5 天 | R6 |
| Q5 | 减动效：`prefers-reduced-motion` 下关闭倾斜、翻转改淡入/即时切换；加应用内开关 | 0.5–1 天 | R2 |
| Q6 | 翻转按钮化：真实 `<button>` + `aria-expanded`，隐藏面 `hidden`/`inert` | 1 天 | R2 |
| Q7 | 空状态文案三件套（牌组/记录/搜索无结果/筛选为零） | 0.5 天 | R8 |
| Q8 | 存储探针 + 写入 `try...catch` + 配额满的可操作提示 | 0.5 天 | R3 |
| Q9 | `persist()` 请求 + `persisted()` 状态记录（不弹窗） | 0.5 天 | R3 |
| Q10 | 打印样式第一版：隐藏界面噪声、展开双面、`break-inside: avoid`、页脚日期/版本 | 1 天 | R14 |
| Q11 | 每卡来源脚注模板（来源/复核日期/版本）+ 更新日志页骨架 | 0.5 天 | R11 |
| Q12 | `content-visibility: auto` + `contain-intrinsic-size`（渐进增强） | 0.5 天 | R10 |
| Q13 | 体积预算检查脚本/清单：文件大小、单图大小、Base64 占比 | 0.5 天 | R9 |
| Q14 | “最近看过”列表（本地，不联网） | 0.5 天 | R13 |

### Bigger bets（数天～数周，需内容与测试配合）

| # | 事项 | 粗估 | 说明 |
|---|---|---|---|
| B1 | SVG 插图系统：网格/描边/调色/部件库 + 48 张卡逐张重绘或替换 | 1–3 周 | 含与内容团队确认每张卡的场景语义；可先做 8 组模板再扩 |
| B2 | 导出/导入备份全流程（含预览、合并/替换、导入前自动备份、损坏处理） | 3–5 天 | 须做 3–5 人无指导测试（第七节任务 5） |
| B3 | 俗语别名搜索 + 受控标签 + 引导找卡（3 问） | 1–2 周 | 别名表是内容工作：须收集真实说法并逐条测试 |
| B4 | 分块渲染/虚拟化图书馆 + 搜索结果分页 | 2–3 天 | 须回归无障碍（焦点、读屏、页内查找） |
| B5 | “带去看医生”就诊摘要（汇总 + 打印 + 纯文本导出） | 3–5 天 | 须临床文案复核：只呈现、不解读 |
| B6 | 温和复习（间隔调度 + 提取练习界面） | 3–5 天 | 调度算法从最简单的“最久未看优先”起步，勿先上 FSRS |
| B7 | 相关卡片人工精选 + 易混淆提示（50 张量级内容工作） | 1–2 周 | 随内容复核一并完成，非纯工程 |
| B8 | 器官进展滑块（如坚持要做） | 未定 | 须先回答未决问题 O2；无临床依据与用户验证前不应排期 |
| B9 | HTTPS 托管版 + PWA（manifest + Service Worker） | 1–2 周 | 须解决存储源分裂与迁移说明；与 `file://` 版并行维护成本高 |

---

## 五、未决问题（来源分歧 / 证据薄弱 / 任务未给定的参数）

- **O1. `file://` 存储矩阵未证实**：二手资料对 Chrome/Firefox/Safari 在 `file://` 下的 localStorage/IndexedDB 行为说法互相冲突（按文件分源 vs 拦截 vs 共享源），且浏览器版本已多次变化。本报告**未**实测当前版本。行动：在目标浏览器（至少 Chrome、Edge、Firefox、Safari 桌面 + 安卓 Chrome + iOS Safari）上实测“写 → 关浏览器 → 再打开 → 读”与“移动文件位置后读”，再定存储策略与文案。相关二手来源：https://www.xjavascript.com/blog/javascript-html-storage-options-under-file-protocol-file/
- **O2. 器官进展滑块：无支持证据**：检索未找到任何设计模式、案例研究或临床指南支持“用滑块可视化器官进展”对家庭照护者有益。风险在于：滑块位置会被误读为病情阶段或预后。替代方案（须临床复核）：用“可观察变化清单 + 记录时间线”呈现变化，并引导咨询医生。**在获得临床来源与用户测试支持前，建议搁置该功能。**
- **O3. 三项数值的定义未给定**：任务描述未说明三项数值是什么。若为临床维度（如严重度），须逐项定义、标注来源并做误读测试；若为学习维度（如步骤数/耗时/难度），须在卡上用文字明说。数值设计不得先于定义。
- **O4. Safari 持久存储与 7 天规则的关系有分歧**：MDN 明确 Safari 有 7 天主动驱逐；部分二手文章称 `persist()` 对此无效，另一部分未提及。鉴于 MDN 原文未明确“无论是否持久均驱逐”，本报告将其列为**未定**，防御策略一律按“可能被删”设计（导出备份），不依赖 `persist()` 在 Safari 上的效力。
- **O5. 目标地区与急救号码未给定**：简体中文≠单一地区。急救电话、就医路径（社区医院/三甲/家庭医生）、药品与医保相关表述都须按目标地区核实后写入，NHS 的 999/111、GP 等表述**一律不得照搬**。
- **O6. 分发渠道未给定**：用户如何获得这个文件（微信转发？邮件？U盘？应用内下载？）直接决定首屏文案（“如何保存这个文件”“在哪个浏览器打开”）与 `file://` 实测范围。微信内置浏览器对本地文件的处理尤为特殊，须单独实测；本报告未覆盖该渠道的实测证据。
- **O7. 中文行高 1.7 vs 1.75–1.8 的分歧**：排版来源在 1.7 与 1.75–1.8 间略有差异，且与字号、字体有关。本报告取 1.75 为起点，须在真实设备上用目标字体实测后微调，而非教条执行。
- **O8. 间隔重复向照护技能的迁移证据薄弱**：现有证据主要针对陈述性知识（医学生考试、单词记忆），对“压力下的程序性照护操作”是否同样有效，证据不足。R13 的复习功能应定位为“帮助记住关键提示”，不宣称“提高照护质量”，并用可用性测试验证用户是否真能回忆起关键提示。
- **O9. AVIF 的实际收益须实测**：AVIF 在照片类大图上优势明显，在小尺寸扁平图上可能输给 WebP（格式开销占比高），且老设备/打印链路的兼容性须实测。本报告建议 WebP 为默认、AVIF 为渐进增强，而非全面切换。
- **O10. “红色条在每张卡上”的 habituations 边界未定**：若 48 张卡每张都有红色条，即使文案各异，视觉重复本身仍可能削弱警觉。一种待验证的折中是：红色条只在“本卡确有停手触发条件”时出现，无触发条件的卡用中性“有疑问时咨询医生”条。但这改变了现有卡片结构，须与内容团队及临床复核共同决定，并用测试验证用户是否仍能快速定位停手信息。

---

## 六、Could not verify（未能证实）

- 当前应用的实际文件大小、单图大小、首屏加载时间：任务未提供文件，无法测量；R9 的预算为建议值，须以实测为准。
- 当前 `file://` 存储在各浏览器的实际行为：见 O1。
- 当前卡片三项数值的定义与临床依据：见 O3。
- 目标用户在真实手机（尤其低端安卓与微信内置浏览器）上的首屏体验：任务已注明“未在真实手机上测试”，本报告亦无法代测；第七节脚本中的手机任务即为补救。
- 任何关于“本应用用户”的行为数据：无追踪即无数据，这是设计选择；改进依据只能来自本地聚合计数（用户自愿导出）与可用性测试。

---

## 七、Sources（来源清单）

> 按主题分组；标注 `verified live` 者为研究浏览器实时打开核验，其余为索引/文本抓取。同一主张在正文中已逐条标注 URL，此处为汇总。

**标准与官方指南**
- MDN — Storage quotas and eviction criteria：https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN — StorageManager.persist()：https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
- MDN — StorageManager.estimate()：https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
- MDN — content-visibility：https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
- W3C APG — Disclosure Card：https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-card/
- NHS — Care cards：https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care
- NHS — Warning callout（`verified live`，2026-11-17）：https://service-manual.nhs.uk/design-system/components/warning-callout
- GOV.UK — Content & transactions：https://www.gov.uk/service-manual/design/govuk-content-transactions
- GOV.UK Design System — Complete multiple tasks：https://design-system.service.gov.uk/patterns/complete-multiple-tasks/
- CDC — Health literacy guidance & tools：https://www.cdc.gov/health-literacy/php/develop-materials/guidance-standards.html
- web.dev — Choose the right image format：https://web.dev/articles/choose-the-right-image-format?source=mytechmint.com
- Ink & Switch — Local-first software：https://www.inkandswitch.com/local-first-software/

**研究与综述**
- CDC Clear Communication Index 应用于患者门户（PMC）：https://pmc.ncbi.nlm.nih.gov/articles/PMC5114169/
- 中文临床同义词与术语识别（PMC）：https://pmc.ncbi.nlm.nih.gov/articles/PMC5414139/
- Anki 与医学教育表现系统评价（Springer）：https://link.springer.com/article/10.1007/s40670-026-02643-5
- NN/g — 5 名测试用户（定性 vs 定量）：https://www.nngroup.com/articles/5-test-users-qual-quant/
- NN/g — Icon Usability：https://www.nngroup.com/articles/icon-usability/

**行业实践与二手转述（方向可信，数字须谨慎引用）**
- WCAG 2.2 概览：https://www.audioeye.com/gb/post/wcag-22/ ；对比度指南：https://www.a11yflow.dev/blog/color-contrast-wcag-developer-guide
- 触摸目标：https://www.html-hunter.com/touch-target-size-guidelines-how-big-should-mobile-buttons-be-in-2026/ ；https://scalecomposer.com/learn/spacing/touch-targets/
- 中文排版：https://www.willchan.me/blog/typography-for-cjk-and-latin ；https://www.typotheque.com/articles/typesetting-cjk-text ；http://umatechnology.org/make-text-easier-to-read-by-balancing-font-size-and-line-length/
- 老年用户排版：https://en.gehirngerecht.digital/good-ui-ux-design-for-older-people/ ；https://www.toptal.com/designers/ui/ui-design-for-older-adults
- 减动效：https://dev.to/parsajiravand/youre-animating-for-everyone-prefers-reduced-motion-fixes-that-2ond ；https://www.laarpi.com/guides/accessible-motion
- 翻转卡片 WCAG：http://me2accessibility.com.au/flip-card.html
- Web Almanac 2025 Page Weight：https://almanac.httparchive.org/en/2025/page-weight
- Core Web Vitals 阈值：https://digitalmatters.me/search-engine-optimization-seo/core-web-vitals/
- Base64 开销：https://web.lumintu.workers.dev/read-https-dev.to/toolstead/base64-overhead-why-data-uris-make-files-33-bigger-406c
- 图片格式对比：https://www.fileshrinkr.com/blog/best-image-format-for-websites ；https://www.zyff.app/guides/webp-vs-avif-vs-jpeg-vs-png
- PWA/Service Worker 与 file://：https://fit.neu.edu.vn/en/post/service-worker-va-pwa-xay-dung-ung-dung-web-hoat-dong-ngoai-tuyen ；https://www.ggames.mobi/blog/2026/03/23/pwa-without-a-framework/
- file:// 存储行为（二手，互相冲突，须实测）：https://www.xjavascript.com/blog/javascript-html-storage-options-under-file-protocol-file/
- Safari 7 天规则（二手，与 MDN 一致）：https://kukie.io/blog/safari-itp-cookie-banner-reappears
- 打印样式：https://thevalleyofcode.com/css-printing/ ；https://www.mironsoft.de/en/blog/css-print-stylesheets-modern-print-layouts
- 渐进披露：https://quality.arc42.org/approaches/progressive-disclosure
- 空状态：https://www.uxia.app/blog/empty-state-design ；http://umatechnology.org/empty-state-design-what-should-users-do-when-content-is-missing/
- 引导/上下文帮助：https://www.theafrodity.com/post/the-ux-of-onboarding-how-to-turn-new-users-into-engaged-ones
- 警报疲劳：https://www.halo-lab.com/blog/alert-fatigue-in-healthcare ；https://www.atlassian.com/incident-management/on-call/alert-fatigue ；https://www.ux-guidelines.com/alarm-fatigue.html
- 分面导航：https://www.fernandoux.com/en/wiki/techniques/filters-and-faceted-search/
- 一页一问：https://gov-cy.github.io/govcy-design-system-docs-v0/patterns/question_pages/
- 照护者案例：https://www.zaid.design/portfolio/the-invisible-second-user ；https://dtailstudio.com/blog/designing-for-patients-and-caregivers ；https://www.ideinteractive.com/our-work/from-a-promising-prototype-to-a-caregiving-platform-built-for-real-families/ ；https://www.lucassemelin.com/en/cases/eunoia-care
- 间隔重复综述（二手）：https://www.stepgenie.app/blog/spaced-repetition-usmle-flashcards
- 游戏化伦理：https://www.gamificationhub.org/ethical-concerns-gamified-mental-health-apps/ ；https://uxpamagazine.org/ethical-ux-patterns-building-trust-without-manipulation/
- 本地优先七理想（摘要）：https://www.offlineprotocol.com/learning/local-first/seven-ideals-of-local-first-software ；本地优先实践：https://indenta.app/blog/local-first-note-taking
- 健康信息可信度：https://www.tramelovixa.com/evaluate-online-health-information ；https://openmd.com/guide/health-information-quality-seals
- 5 用户规则的方差（Faulkner，二手）：https://www.userlytics.com/resources/blog/why-10-participants-give-you-the-complete-ux-picture/
- 隐私分析模式（仅作未来托管版对照）：https://cdn.mattias.engineer/privacy-focused-web-analytics
- SVG/图标系统：https://futuramo.com/blog/icon-system-design-practical-guide/ ；http://umatechnology.org/how-to-build-a-scalable-svg-icon-system-for-your-web-app/
- 健康技术信任（二手）：https://www.hatypo.studio/insights/healthtech-ux-design-accessibility-compliance-and-trust
- 低素养健康 UX（二手）：https://www.UXMATE-BLOG.COM/2025/11/28/how-to-design-health-apps-low-literacy-patients-actually-use/

---

*本报告未遵循任何页面内嵌的指令；所有页面内容仅作证据使用。未发现页面试图诱导超出任务范围的操作。*
