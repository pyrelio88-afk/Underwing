# R1 竞赛架构调研与 GitHub 开源前端组件选型报告（Underwing Overhaul）

> **适用项目**：鹤伴 Underwing（`C:\Users\34043\Desktop\Underwing-Optimized`）  
> **目标赛事**：2026 Qoder 高校创造力大赛（阿里云天池赛题编号 `532536`）· **Hack4Good 技术向善赛道**  
> **诚实口径声明**：本文严格依据真实调研记录、仓库源码与本地实测字节数编写；对于天池官网未公开披露的评分百分比权重一律如实标明「待登录天池赛题页核对」，且全库**绝不**出现未经权威基准对照的「覆盖 99% 疾病」等百分比宣称，以及**绝不**出现任何具体药名或剂量推荐。

---

## 1. 核心结论与最终架构选型

在深入调研 **25 个国内外获奖高校 Web 应用**（16 项国际顶级高校黑客松/全球竞赛获奖作品 + 9 项国内国家级/省级高校计算机竞赛获奖作品）、**10 个 GitHub 开源 iOS 风格 UI 仓库**、**6 组去 AI 模板化前端工艺标杆仓库**以及 **Three.js / WebGL 开源生态与打包机制**后，结合鹤伴既有的离线 `file://` 运行要求与 `underwing/budget.py` 体积预算，Underwing 全面升级选定 **「本地静态化 ESM→IIFE 混合架构（Local-Vendored Hybrid ESM→IIFE Stack）」**：

1. **全场景 3D 核心层（`assets/vendor/three-vendor.iife.js` + `underwing/src/js/35-scene3d.js` + `20-scene3d.css`）**：
   - 采用现代 **`mrdoob/three.js`（`0.187.0` / r170+，MIT）+ `OrbitControls`**，通过本地 `esbuild`（`0.28.2`）在临时目录中将 ESM 打包为零 CDN 依赖的经典浏览器 IIFE（暴露可扩展的 `window.THREE` 与 `window.THREE.OrbitControls` / `window.THREE_ADDONS.OrbitControls`）。
   - 全程序化构建「鹤翼守护空间 / Underwing Sanctuary」3D 沉浸式舞台（流光折纸鹤意象、昼夜光影切换、浮尘粒子与可射线拾取的照护站点热点），无需数十 MB 的 `.glb` 模型，秒级加载并支持 WebGL 降级与 `prefers-reduced-motion` 静默模式。
2. **原生级 iOS UI 与弹簧物理层（`assets/vendor/ios-vendor.iife.js` + `00-ios-tokens.css` + `10-ios-components.css`）**：
   - **`roman-rr/cupertino-pane`（`1.5.4`，MIT，0 依赖）** 负责 Apple Maps / Apple Health 风格多断点可拖拽底部抽屉与详情面板（`window.CupertinoPane`）。
   - **`motion`（`motiondivision/motion` `14.14.0`，MIT，纯 Vanilla DOM 入口，无 React 依赖）** 暴露 `window.Motion = { animate, spring, stagger }`，驱动 120fps 弹簧过渡与分段器滑块。
   - **Apple HIG 设计令牌 + Framework7 iOS 视觉规范 + 精选 `lucide-static@1.74.0` 内联 SVG `<symbol>` 精灵**：实现 `-apple-system` / `SF Pro` / `PingFang SC` 字体栈、Retina `0.5px` 发丝线、`backdrop-filter: blur(20px) saturate(180%)` 毛玻璃活力层、安全区适配与 `≥44px` 触控目标，同时保留鹤伴「山林鼠尾草绿 `#255A41` / `#68CEA9`」与 NHS 启发式「红色唯一性停手警示 `#A61B1B` / `#FA8989`」。
3. **临床知识与本地隐私核心层（完整保留并零破坏衔接）**：
   - 保留 `10-sources.js`（51 份已通读核对 `ok` 的临床指南/官方资料）、`20-cards.js`（15 张居家照护卡：12 张临床卡 + 3 张整理卡）、`25-conditions.js`（48 种常见情况）、`26-disease-hubs.js`（86 个疾病照护枢纽，配合 99 张 `512×512` WebP 器官/病程示意）、`30-store.js`（`localStorage` + `IndexedDB` + 上传前本地正则脱敏与人工两步核对）。

---

## 2. Underwing 现有技术基线与 Qoder Hack4Good 赛事约束

### 2.1 现有工程与预算基线（实测对照）

基于对 `underwing/build.py`、`underwing/budget.py` 与 `underwing/src/index.html` 的逐行审计及基准运行结果：

| 约束 / 指标 | M1 前原始基线 | 工程规则与影响 | 来源 |
|---|---|---|---|
| **构建流水线** | 纯 Python（`underwing/build.py`）：按字典序拼接 `src/css/*.css` → `assets/app.css`、`src/js/*.js` → `assets/app.js`，输出根目录 `index.html` | 无需 Node 运行时即可反复增量构建；`00-ios-tokens.css` 在字典序上天然排在 `app.css` 之前 | `underwing/build.py:1-63` |
| **`file://` 离线铁规** | `assert 'type="module"' not in html` | 严禁使用 ES Module `<script type="module">` 或外部 CDN `importmap`，必须使用相对路径经典 `<script>`，保障双击本地 HTML 与 Qoder Sites 子路径零跨域错误 | `underwing/build.py:59` |
| **核心代码预算** | `364.0 KB`（`index.html` 10.4 KB + `app.css` 48.6 KB + `app.js` 305.1 KB）vs 上限 `< 400.0 KB`（`CODE_CAP_BYTES`） | 剩余约 `36.0 KB` 空间；**若将 ~770 KB 的 Three.js 直接塞入 `app.js` 会立即爆预算**，因此必须拆分至独立 `assets/vendor/` 并设专属 `VENDOR_CAP_BYTES` | `underwing/budget.py:26` |
| **WebP 插画预算** | 16 张卡片 WebP（`301.8 KB`）+ 99 张疾病图 WebP（`2640.9 KB`）= `2.87 MB` vs `< 3.50 MB`（`WEBP_CAP_BYTES`） | 预留约 `0.63 MB` 给 R3 吉祥物重构与 9 张线稿卡片的 3D 粘土风升级 | `underwing/budget.py:27, 95-141` |
| **仓库总磁盘上限** | `4.45 MB`（176 个文件）vs `< 8.00 MB`（`REPO_CAP_BYTES`） | **严禁在仓库中遗留 `node_modules/`**；打包须在 `$env:TEMP` 临时目录中完成，仅保留静态产出 `assets/vendor/*.iife.js` | `underwing/budget.py:28, 160-171` |
| **自动化审查门禁** | `review.py`（104 视图状态：亮/暗双模式 AA 对比度、红色唯一性、零药名/剂量、零 `%` 覆盖率、100% `.ref` 溯源、减动效无残留 `@keyframes`、移动端 `≥39.5px` 触控高度、零横向溢出）+ `test_e2e.py`（108 项回归） | 新引入的 iOS 令牌与 `CupertinoPane` 动态样式必须严格遵守 AA 对比度、禁用 `#FF3B30` 泛滥红色、并在 `prefers-reduced-motion` 下关闭所有动画 | `underwing/review.py`, `underwing/test_e2e.py` |

### 2.2 Qoder Hack4Good（天池 `532536`）与 Qoder Sites 部署对齐

根据 `docs/contest-rules.md` 与 `docs/qoder-hack4good-research.md` 核实的信息：
- **赛制漏斗与「初筛 60 秒」**：Hack4Good 赛道初筛仅选出 **14 支队伍**进入线上直播路演决赛（恰好对应每赛道 14 个现金奖席位）。评委点开 Qoder Sites 公开链接后的前 60 秒直觉体验（首屏秒开、痛点真实、3D 沉浸感、iOS 级交互流畅度、无粗糙 AI 模板感）是核心分水岭。
- **Hack4Good 四维精准命中**：同时覆盖 **医疗健康辅助**（51 份指南溯源卡片 + A4 一页复诊单）、**老年人数字鸿沟与无障碍**（床旁大字语音伴读 + WCAG AA + W3C 披露翻牌 + 减动效模式）、**防灾与居家突发应急**（红色唯一性停手警示 + 红线速查）与 **弱网韧性与隐私保护**（纯本地存储 + 本地正则脱敏）。
- **Qoder Sites 静态托管与 Hash 路由**：静态部署于 `*.qoder.website` 时，采用 `#/cards`、`#/library`、`#/folder`、`#/settings`、`#/card/<k>` Hash 路由完全不依赖服务端重写规则；所有资源采用纯相对路径，兼顾公网秒开与答辩现场断网双击 `index.html` 演示。
- **未公开信息诚实标注**：天池赛题页未公开披露初筛/决赛具体分值百分比权重表（需参赛团队登录后在天池赛题页或官方赛事群核对），本文及路演材料均不编造任何评分权重数字。

---

## 3. 25 个国内外获奖高校 Web 应用深度调研

### 3.1 国际顶级高校黑客松与全球竞赛获奖项目（16 项）

| # | 项目名称 | 竞赛 / 奖项与年份 | 参考链接 / 出处 | 领域与核心功能 | 前端架构与技术栈 | 对 Underwing 的关键启示 |
|---|---|---|---|---|---|---|
| 1 | **Vitality** | TreeHacks（Devpost Winner, Women's Health） | https://devpost.com/software/vitality | 多模态女性健康症状追踪 + 交互式 3D 人体标记与红旗分流 | **React, TypeScript, Tailwind CSS, Three.js / React Three Fiber**（射线拾取 3D 表面标记），Python/Uvicorn, Deepgram, Twilio | 3D 射线拾取热点 + 清晰的「安全优先红旗警示」临床分流逻辑，与 Underwing 3D 守护空间 + 红线速查高度同构 |
| 2 | **OpenReality** | HackIllinois 2026（1st Place - Best AI Inference & Most Creative） | https://devpost.com/software/openreality | 实时 3D 空间无障碍与应急设施路径问答 | **Three.js, TypeScript**, SAM, Python/Flask, Modal, Claude | 将简洁的 3D 空间几何与清晰的应急/无障碍标注直接叠加在 3D 画布之上 |
| 3 | **HAVEN: Nobody Gets Left Behind** | Cal Hacks 13.0（Winner: Best Use of Fetch.ai & Convex） | https://devpost.com/software/haven-nobody-gets-left-behind | 多建筑应急协调与安全数字孪生 | **Next.js, TypeScript, Vercel, React Three Fiber (Three.js)**（100% 程序化 3D 场景，无外部大模型），WebSockets, Web Push | **关键架构启示**：纯代码程序化构建可识别的 3D 场景可彻底免除数 MB 的 `.glb` 下载，实现毫秒级冷启动 |
| 4 | **Pukaar (पुकार)** | EurekaDev 2026（1st Place - Coding Track） | https://devpost.com/software/pukaar | 面向低识字人群的本地化防灾预警与社区韧性工具 | **React, TypeScript, Three.js**, MapLibre, FastAPI, AWS Bedrock/Polly/IoT | 展示了在交互式 3D 空间画布上方叠加高可读性、无障碍危机 UI 的有效层级 |
| 5 | **WoundWatch** | Collegiate Hackathon（Winner: Social Impact Award） | https://devpost.com/software/woundwatch | 基于 2D 照片的慢性伤口（溃疡/烧伤）3D 量化进展追踪 | **React Native, Expo, TypeScript, Three.js** + Open3D, Flask, PyTorch, DepthAnythingV2, SAM, Gemini | 照护工具利用 Three.js 将抽象的病程/护理信息转化为直观可检查的三维对象 |
| 6 | **Mira** | TreeHacks 2026（Most Impactful & 1st Place OpenAI Track） | Devpost (TreeHacks 2026) | 语音优先的老年/失智症照护助手 + 3D 室内场景定位与指南核查 | **Next.js, React**, Python, Supabase, ONNX Runtime, OpenAI | 老年与失智照护应用只要把低门槛交互与权威指南核验结合，极易在社会价值赛道拿头奖 |
| 7 | **OpenRx** | CruzHacks（Best New Technologies Hack） | https://devpost.com/software/openrx | 面向老人与阿尔茨海默患者的药瓶 OCR 扫描与用药提醒 Web 应用 | **React, Tailwind CSS**, Firebase, Azure OCR, OpenAI, Twilio | 面向高龄患者与家属的高对比度、大触控目标界面是医疗适老化的硬性得分点 |
| 8 | **Elda AI** | Collegiate Hackathon（Best Use of Claude） | https://devpost.com/software/elda-ai | 老年陪伴、行为观察与家属照护摘要门户 | **Next.js, React Native**, FastAPI, Claude, Letta, Chroma | 清晰的家属摘要单与安全护栏比复杂仪表盘更适合真实家庭照护场景 |
| 9 | **PatientPrivy** | Collegiate Hackathon（Devpost Featured） | https://devpost.com/software/patientprivy | 医疗门户隐私可观测性工具（3D 展示第三方追踪节点） | **React Three Fiber, Three.js**, Chrome Extension APIs | 用交互式 3D 节点让「看不见的隐私保护与本地安全边界」瞬间变得可见可感 |
| 10 | **AnatoMate.ai** | Collegiate Hackathon（Devpost Featured） | Devpost (AnatoMate.ai) | 患者自主持有的本地病历 + 二维码分享 + 3D 体征历史 | **Three.js**，本地优先存储，QR 分享，ML 风险预测 | **本地优先病历隐私** + 3D 体征可视化，直接印证 Underwing 本地存储架构的赛道竞争力 |
| 11 | **Fourteenth Floor** | HackGT（Winner: The Lighthouse Laboratory Track） | Devpost (Fourteenth Floor) | 具有空间任务检查能力的无障碍 3D/VR 交互工作台 | **Three.js, TypeScript, WebXR** | 展示了全景概览与聚焦目标点之间丝滑的相机轨道缓动过渡（`focusZone`） |
| 12 | **Therapute** | Google Solution Challenge 2024（Global Top 10 Finalist） | https://github.com/ohmcpatel/Therapute-Google-Solution-Challenge | 康复训练姿态反馈与恢复追踪 | **Next.js, React**, MediaPipe, Flask, Firebase, GCP, Gemini | 渐进式披露：保持主卡片步骤极简，把复杂原理与遥测折叠在可展开视图之后 |
| 13 | **ATTI** | Google Solution Challenge 2024（Global Top 3 Winner） | https://github.com/H0ngJu/atti | 轻度失智症语音辅助日常照护与家属记忆应用 | **Flutter**, Dart, Firebase, OpenAI/Gemini | 原生移动端的卡片节奏、超大触控按钮与沉静柔和的色彩系统非常适合失智/老年照护 |
| 14 | **S'mile** | Cal Hacks 13.0（Best People-First Social Impact & Best Solo Hack） | Devpost (Cal Hacks 13.0) | 交互式 3D 校园/交通枢纽与学生协作平台 | **Three.js, React**, 多智能体后端, Visa API | 证明即便是轻量团队，只要严格收敛 3D 几何体规模，也能做出稳健的 3D+UI 作品 |
| 15 | **BeeMovr** | HackMIT 2023（3rd Place） | https://devpost.com/software/beemovr | 智能调度与协同导航平台 | **Next.js, TypeScript**, Mapbox, Docker, Cloudflare | 「全屏画布 + 悬浮抽屉/卡片」分栏架构同时兼顾手机竖屏与电脑评委宽屏路演 |
| 16 | **PantryPuzzle** | HackMIT 2023（Sustainability Track Winner） | https://devpost.com/software/pantrypuzzle | 家庭食物库存与可持续食谱生成 | **React**, Flask, Firebase, OpenAI | 卡片化快捷动作与零弹窗摩擦的即时检索/筛选 |

### 3.2 国内高校计算机竞赛获奖项目（9 项）

| # | 项目名称 | 竞赛 / 奖项与年份 | 参考链接 / 出处 | 领域与核心功能 | 前端架构与技术栈 | 对 Underwing 的关键启示 |
|---|---|---|---|---|---|---|
| 17 | **古韵新章——3D 国画创作平台 (`arnc`)** | 中国大学生计算机设计大赛 软件应用赛道 **国家一等奖** | https://github.com/qianyu0415/arnc | 交互式 3D 中国传统绘画创作与文化展示平台 | **Web 3D / Three.js / Canvas** + 现代 Web 前端 | 将中国传统美学意象（白鹤、水墨、暖纸）融入交互式 Web 3D，在国赛评审中辨识度极高 |
| 18 | **通慧智教 (AI-Assistant)** | 第 16 届中国大学生计算机设计大赛 软件应用与开发赛道 **国家一等奖** | GitHub / 4C 第 16 届国一公示 | 结合语音与文本助手的智能教学 Web 应用 | **Vue / React 现代 SPA** + SSE + 语音合成 | 任务驱动的清晰引导与语音伴读交互，显著优于静态表格展示 |
| 19 | **雪境智判一张图 (`SkiOneMap`)** | “挑战杯”省赛 **一等奖** | https://github.com/ThisIsLittleSky/SkiOneMap | 智慧数字孪生安全监测与空间研判一张图 | **Vue 3, Vite, Three.js, Pinia, ECharts**, Spring Boot, FastAPI, YOLO11 | **国内 3D 竞赛主流范式**：全屏 Three.js 3D 视口 + 悬浮半透明毛玻璃 HUD 面板 |
| 20 | **基于 YOLOv7 与无人机辅助的城市道路质量监测系统** | 2023 中国大学生计算机设计大赛 人工智能赛道 **国家二等奖 / 省一等奖** | https://github.com/hjhxy/2023-Chinese-Collegiate-Computing-Competition | 道路缺陷检测与可视化管理门户 | **Vue (`vue-admin-template`), Element UI**, Flask, YOLOv7 | 反面对比参考：传统后台管理模板偏工具化，评委更偏爱定制视觉打磨与可感交互 |
| 21 | **Ancient_Books（古籍智能理解系统）** | 中国大学生计算机设计大赛 **国家二等奖** | https://github.com/Fyuan0206/Ancient_Books | 古典文学与诗词智能问答桌面/Web 应用 | **React, TypeScript, Tauri**, Python RAG | 本地离线打包运行（如 Tauri 或 `file://` 纯静态包）能确保答辩现场断网零翻车 |
| 22 | **慧眼识垃圾 (`the-eye-knows-the-garbage`)** | 第 15 届中国大学生计算机设计大赛 程序设计组 **全国三等奖** | https://github.com/thomas-yanxin/the-eye-knows-the-garbage | 公益向 AI 垃圾分类移动小程序与监管门户 | **微信小程序（移动优先）** + Django + PaddlePaddle | 移动优先卡片流与即时视觉反馈在技术向善/公益方向表现稳健 |
| 23 | **羊谷 (`Crop-Group/open-source`)** | 2022 中国高校计算机大赛 微信小程序应用开发赛 **全国一等奖** | https://github.com/Crop-Group/open-source | 交互式助农与校园社区应用 | **微信小程序** + CloudBase + 定制插画体系 | 统一的定制插画与吉祥物视觉系统能大幅抬升作品完整度与温度 |
| 24 | **Virtual Campus Guide (`virtual-campus-guide-threejs`)** | 高校双创 / “互联网+”数字孪生参考项目 | https://github.com/ClearloveLA/virtual-campus-guide-threejs | 交互式 3D 校园导航与地标导览 | **Vue 3, Vite, Three.js** | 射线点击聚焦相机过渡 + 底部/侧边详情抽屉，是 3D 场景与图文卡片联动的最自然桥梁 |
| 25 | **dewhale (OpenTiny Challenge)** | 开放原子开源大赛 OpenTiny 前端 Web 应用开发挑战赛 **一等奖** | https://competition.atomgit.com/ | 基于开源 UI 原语构建的现代组件化 Web 应用 | **Vue 3 / TypeScript / Vite** + 标准化 OpenTiny 组件体系 | 竞赛评委明确青睐**基于标准化开源组件体系**而非散装手写 CSS 拼接的项目 |

### 3.3 跨竞赛共性规律总结

1. **全屏 3D 舞台 + 半透明毛玻璃 HUD / 抽屉**：无论国际（*Vitality, HAVEN, OpenReality, Fourteenth Floor*）还是国内（*SkiOneMap, 古韵新章, Virtual Campus Guide*），Three.js 都占据全视口主舞台，而非蜷缩在 `300px` 框内；业务内容则通过悬浮毛玻璃导航与可拖拽抽屉优雅呈现。
2. **程序化几何优于沉重 `.glb` 资产**：*HAVEN* 与大量黑客松冠军项目采用纯 Three.js 几何体、灯光与自定义着色器构建场景，免除了外部模型下载卡顿。
3. **适老/医疗赛道胜在克制与触控可达性**：*ATTI, OpenRx, Elda AI, Vitality* 摒弃繁杂表格，聚焦 `≥44px` 大按钮、清晰排版层级与前置红旗预警。
4. **线下/断网路演韧性**：*Ancient_Books* 与 *AnatoMate.ai* 验证了本地离线运行与零 CDN 外部强依赖在评审现场的关键价值。

---

## 4. GitHub 开源 iOS UI 组件生态与去 AI 模板化前端工艺

### 4.1 10 个开源 iOS 风格 UI 组件仓库横向对比

| 仓库 / 库 | GitHub Stars | 开源协议 | 压缩 / Gzip 体积 | 框架耦合度 | iOS 原生视觉保真度 | 与 Underwing（`build.py` + `file://`）兼容性评估 |
|---|---|---|---|---|---|---|
| **[`framework7io/framework7`](https://github.com/framework7io/framework7)** | ~17.1k–18.7k | MIT | 完整 JS ~805 KB min；完整 CSS ~485 KB min；精简模块 < 60–90 KB gz | Vanilla JS（自带 Dom7 + 路由）或 Vue/React/Svelte | **行业标杆（10/10）**：iOS 17/18 导航栏、大标题折叠、分组内嵌列表、手势返回、发丝线、毛玻璃 | **CSS 模式极高兼容**：全量引入会超出 400 KB 核心代码上限，但其 MIT 协议的 **iOS CSS 规范与令牌**（分组列表、发丝边框、分段控件）可直接按需精简落地 |
| **[`konstaui/konsta`](https://github.com/konstaui/konsta)** | ~4.2k+ | MIT | 极低（按组件 + Tailwind 裁剪） | **强耦合** React / Vue / Svelte + Tailwind CSS | **9.5/10**：Framework7 同作者出品的像素级 iOS 组件 | **低-中**：要求重写为 React/Vue/Svelte + Tailwind 编译链，不符合 Underwing 零框架核心 |
| **[`ionic-team/ionic-framework`](https://github.com/ionic-team/ionic-framework)** | ~52.6k+ | MIT | 中偏重（Stencil Web Components 运行时） | Web Components（偏向打包器/ESM 环境） | **9/10**：专设 `mode="ios"` 导航与分段控件 | **低-中**：Stencil 异步按需加载块在 `file://` 协议下易触发限制，不利于单包离线直开 |
| **[`OnsenUI/OnsenUI`](https://github.com/OnsenUI/OnsenUI)** | ~8.8k–8.9k | Apache-2.0 | 中等 | Custom Elements + 框架封装 | **7.5/10**：偏早期 iOS 风格，迭代放缓 | **低**：生态活跃度与现代 iOS 动效精细度不及 Framework7 / Cupertino Pane |
| **[`roman-rr/cupertino-pane`](https://github.com/roman-rr/cupertino-pane)** | ~730 | MIT | **65,909 B min（64.36 KB，~12 KB gz）**，**0 依赖** | **纯 Vanilla JS / TS**，零框架耦合 | **9.5/10**：直接复刻 Apple Maps / Apple Health 多断点（top/middle/bottom）可拖拽底部抽屉 | **极佳（10/10）**：M1 实测打包为 `ios-vendor.iife.js` 无报错运行于 `file://`，运行时自动注入轻量样式并暴露 7 个 `--cupertino-pane-*` CSS 变量定制亮暗外观 |
| **[`emilkowalski/vaul`](https://github.com/emilkowalski/vaul)** | ~8.5k+ | MIT | ~18 KB min+gz（含 Radix Dialog） | **仅 React**（依赖 `@radix-ui/react-dialog`） | **9.5/10**：标志性的 iOS 抽屉拖拽回弹与背景微缩景深 | **参考其交互规范**：无法直接脱离 React 引入，但其拖拽阻尼与背景缩放规范可结合 `CupertinoPane` 与 `Motion` 复现 |
| **[`motiondivision/motion`](https://github.com/motiondivision/motion)** | ~28k+ | MIT | 完整 Vanilla DOM 入口 **73,047 B min（71.33 KB）**；`motion/mini` 仅 8.38 KB（缺 `spring`/`stagger`） | **原生 Vanilla JS**（`hasReact=false`）+ React | **9.5/10**：真正基于物理刚度/阻尼（`stiffness`/`damping`）的 120fps 弹簧曲线 | **极佳（10/10）**：M1 实测 `motion@14.14.0` 完整入口零 React 依赖，可同时提供 `animate`、`spring`、`stagger` |
| **[`emilkowalski/sonner`](https://github.com/emilkowalski/sonner)** | ~13k+ | MIT | ~2.5 KB min+gz | 仅 React | **9/10**：iOS 堆叠可滑动 Toast 提示 | **参考其交互规范**：启发 Underwing `#toast` 的轻弹层堆叠与撤销动效 |
| **[`framework7io/framework7-icons`](https://github.com/framework7io/framework7-icons)** | ~230+ | MIT | 解压 ~12.7 MB；字体文件 ~100–250 KB（无法裁剪） | 字体图标 / 独立 SVG | **10/10**：最接近 Apple SF Symbols 的开源图标语言 | **中等（按需摘取 SVG）**：不可全量引入字体，可按需提取单个 SVG 路径至内联精灵 |
| **[`lucide-icons/lucide`](https://github.com/lucide-icons/lucide)** | ~25.8k+ | ISC | 单图标约 140–250 B（按需内联 `<symbol>`） | 零框架依赖 SVG `<symbol>` | **8.5/10**：统一圆角端点、等宽描边，与 `.ico` CSS 无缝兼容 | **极佳（10/10）**：M1 从 `lucide-static@1.74.0` 精选 24 个 UI 图标并新增 `#i-crane` 共 25 个新 SVG `<symbol>`（保留原有 39 个 `#i-*` 图标），总新增仅约 4.3 KB，完全支持 `file://` |

### 4.2 6 组去 AI 模板化前端工艺仓库融合（延续与深化）

结合 `docs/qoder-hack4good-research.md` 与 `docs/design-direction.md` 的工程积累，M1–M5 将 Apple HIG 规范与 6 组标杆仓库的微交互工艺深度融合：
1. **`simeydotme/pokemon-cards-css`**：`rAF` 弹簧阻尼 3D 卡牌倾角（收敛至 `±6.5°–8°` 保汉字清晰度）+ 哑光铜版柔光遮罩（放弃刺眼彩虹镭射，保证 `#0F0D0C` 对比度 `> 7:1`）。
2. **`emilkowalski/skills` + `raunofreiberg/interfaces`**：**频率门控（Frequency Gate）**——高频搜索输入（IME 拼音局部刷新）与筛选切换零延迟无动画，低频空间动作（翻牌、枢纽扇形展开、抽屉弹出）使用可中断弹簧/减速曲线（`cubic-bezier(0.23, 1, 0.32, 1)`，绝不用 `ease-in`，绝不对普通卡片做 `hover:scale`）。
3. **`pyrelio88-afk/Crane` + Qoder 品牌令牌**：保留暖纸编辑排版层级、衬线大标题与无衬线正文的对比、核对卡与带撤销 Toast，锁定 Qoder 鼠尾草绿主色（`--ios-tint: #255A41` / `#68CEA9`）与一屏最多一个深绿实心主按钮规则。
4. **`nhsuk/nhsuk-frontend`**：采纳 Care Card 分级语言与**红色唯一性铁规**——全站彻底禁用 Apple 默认系统红 `#FF3B30`，仅允许在 `.stop` / 红线急诊区使用低眩光深红 `#A61B1B`（暗色 `#FA8989`）。
5. **`digital-go-jp/design-system-example-components-html`**：面向高龄人群的无框架 WCAG 2.2 AA 实践——`18px` 基准字号 + `rem` 等比缩放（支持 `lg 20px` / `xl 22px`）、`tabular-nums` 等宽体征数字、`≥44px` 触控目标、W3C 披露式 `inert` 隐藏面管理，以及完整的 `prefers-reduced-motion: reduce` / `html.rm` 零动画退化。

### 4.3 M1 阶段实测的 Vendor 运行时陷阱与工程避坑

在 `$env:TEMP` 隔离环境与 Chromium `file://` 无头实测中，Spec Miner 团队提前锁定了 4 项必须写入架构契约的关键细节：
1. **Three.js ESM 命名空间冻结问题**：`import * as THREE_NS from 'three'` 返回的 Module Namespace 对象按 ECMAScript 规范为不可扩展对象（`Object.isExtensible(THREE_NS) === false`），直接执行 `THREE_NS.OrbitControls = OrbitControls` 在严格模式 IIFE 中会抛出 `TypeError`。M1 的 `build_vendor.mjs` 已通过 `const THREE = Object.assign({}, THREE_NS, { OrbitControls })` 创建可扩展普通对象（实测 444 个自有可枚举属性，`Object.isExtensible(window.THREE) === true`）。
2. **`CupertinoPane` `handleKeyboard` 视口篡改问题**：当 `handleKeyboard` 为默认 `true` 时，`CupertinoPane` 在关闭/失焦时会调用 `document.querySelector('meta[name=viewport]').setAttribute('content', ...)` 注入 `user-scalable=no`（若缺失标签则直接抛 `TypeError`）。M4/M5 实例化 `new window.CupertinoPane(el, opts)` 时**必须显式传入 `handleKeyboard: false`**。
3. **`CupertinoPane` 动态 `@keyframes` 与减动效检查**：`CupertinoPane` 会在 `<head>` 动态注入 `<style id="cupertino-pane-...">`（含 `.pane.modal-flying` 的 `@keyframes`）。为此，`00-ios-tokens.css` 在 `@media (prefers-reduced-motion: reduce)` 与 `html.rm` 中显式补充了对 `.cupertino-pane-wrapper` 及其后代的 `animation: none !important; transition-duration: 0s !important;` 抑制，确保 `review.py` 减动效审查零失败。
4. **`Motion.spring()` 参数形态约束**：`motion@14.14.0` 中直接调用 `Motion.spring({ stiffness: 300, damping: 28 })` 而不传 `keyframes` 会因访问 `options.keyframes[0]` 抛出 `TypeError`。正确用法为：`Motion.animate(el, props, { type: 'spring', stiffness: 300, damping: 28 })`，或使用数值简写 `Motion.spring(0.35, 0.2)` / 显式传入 `keyframes: [0, 1]`。

---

## 5. Three.js / WebGL 开源生态与本地打包机制

| 仓库 / 方案 | GitHub Stars | 协议 | 技术定位 | 对 Underwing 的适用性结论 |
|---|---|---|---|---|
| **[`mrdoob/three.js`](https://github.com/mrdoob/three.js)** | ~118k–119k | MIT | WebGL2/WebGPU 3D 核心引擎及 `examples/jsm/`（`addons/`）官方扩展 | **主选引擎**：零前端框架胶水开销，可直接精细控制渲染循环、显存释放与移动端 DPR 上限 |
| **[`pmndrs/react-three-fiber`](https://github.com/pmndrs/react-three-fiber)** + **[`pmndrs/drei`](https://github.com/pmndrs/drei)** | ~31.5k + ~10.2k | MIT | React 声明式 Three.js 协调器与常用封装（`Float`, `Sparkles`, `Html`, `Environment`） | 不引入 React 依赖，但将其 `Float`/`Sparkles`/平滑聚焦相机思路用 ~80 行原生 Three.js 优雅实现 |
| **[`Tresjs/tres`](https://github.com/Tresjs/tres)** | ~3.8k+ | MIT | Vue 3 声明式 Three.js 封装 | 不引入 Vue 3，仅作 API 风格对照 |

### 为什么必须采用「本地 `esbuild` ESM → IIFE 打包」

1. **UMD 构建移除（`r150` 弃用 → `r160+` 彻底移除）**：现代 Three.js（`0.187.0`）仅提供 ES Module（`three` + `three/addons/controls/OrbitControls.js`），不再提供单文件 UMD `<script>` 产物。
2. **CDN `importmap` 违反离线与稳定性底线**：外网 CDN 在答辩断网环境、`file://` 本地打开或部分校内网下极易超时失败，且 `type="module"` 在 Chrome/Edge `file://` 下受 CORS 限制。
3. **`WebGLRenderer` 无法被 Tree-Shaking 显著裁剪**：由于 `WebGLRenderer` 内部索引着色器与材质注册表，完整引入 `three`（`751.48 KB` min）与手动列举 49 个导出（`598.03 KB` min）差距仅 `~153 KB`。将其打包在 `assets/vendor/three-vendor.iife.js` 中，不仅稳稳落在 `1024 KB` 供应商预算内（还余 `136.76 KB`），更赋予 M3 完整调用任何 `THREE.*` 类的自由度而无需反复重编。
4. **移动端 GPU 与防报错护栏（M3 契约）**：
   - 限制像素比 `Math.min(window.devicePixelRatio, 2)`，防止 3x 手机屏掉帧；
   - 在 `document.hidden` 或全屏弹层遮挡时自动挂起 `requestAnimationFrame`；
   - 在 `try { new THREE.WebGLRenderer(...) }` 捕获异常时无缝切换至 `.scene3d--fallback` 静态鹤伴守护视觉，确保任何无 GPU 环境均零 `console.error` / `pageerror`。

---

## 6. Underwing 目标架构与 M1–M6 模块契约

### 6.1 目录与构建产物结构

- **根目录权威静态产物（供 `file://` 直开与 Qoder Sites 部署）**：
  - `index.html`：由 `underwing/build.py` 生成，顺序加载 `assets/app.css` → `assets/vendor/three-vendor.iife.js` → `assets/vendor/ios-vendor.iife.js` → `assets/app.js`（全经典 `<script>`，零 `type="module"`）。
  - `assets/vendor/`：`three-vendor.iife.js`（`three@0.187.0` + `OrbitControls`）与 `ios-vendor.iife.js`（`cupertino-pane@1.5.4` + `motion@14.14.0`）。
  - `assets/art/cards/*.webp`（16 张，`mascot.webp` + 15 张照护卡）与 `assets/art/disease/*.webp`（99 张只读病程图）。
- **源码与工具链（`underwing/`）**：
  - `underwing/package.json` + `underwing/scripts/build_vendor.mjs`：锁定版本号的临时目录 IIFE 打包脚手架（`node_modules` 永不落盘至工作区）。
  - `underwing/src/css/00-ios-tokens.css`（M1）→ `10-ios-components.css`（M4）→ `20-scene3d.css`（M3）→ `app.css`。
  - `underwing/src/js/00-core.js`、`10-sources.js`、`20-cards.js`、`25-conditions.js`、`26-disease-hubs.js`、`30-store.js`、`35-scene3d.js`（M3）、`40-browse.js`、`45-tcg.js`、`50-card-detail.js`、`60-folder-settings.js`、`70-dialogs.js`、`90-main.js`。
  - `underwing/build.py`、`underwing/budget.py`、`underwing/review.py`、`underwing/test_e2e.py`、`underwing/e2e_suite/`。

### 6.2 跨阶段接口契约（M1 → M3 / M4 / M5 / M6）

1. **Vendor 全局对象（M1 已交付并实测）**：
   - `window.THREE`（`REVISION === "187"`，可扩展普通对象，含 `OrbitControls`）及 `window.THREE_ADDONS.OrbitControls`；
   - `window.CupertinoPane`（构造器，实例化须传 `handleKeyboard: false`）；
   - `window.Motion`（`{ animate, spring, stagger }`）。
2. **3D 守护空间桥接接口（`35-scene3d.js` ↔ `90-main.js` / `40-browse.js`，M3↔M4）**：
   - 挂载容器：`<div id="scene3d" class="scene3d" aria-hidden="true"></div>`（WebGL 不可用时附加 `.scene3d--fallback`）。
   - 全局控制器 `window.UnderwingScene`：`init(containerEl, opts)`、`setTheme(theme)`、`setReducedMotion(enabled)`、`focusZone(zoneKey)`、`setSuspended(hidden)`。
3. **临床与无障碍铁规（全阶段不变量）**：
   - 51 份 `SOURCES`（`ok`）、15 张 `CARDS`（`ready`）、48 条 `CONDITIONS`（`hypo` 保持 `cards: []`）、86 个 `DISEASE_HUBS`（全局不硬编码单一国家急救号）、虚构演示人物「王秀兰」显式 `虚构` 徽章、`100%` `.ref` 来源角标、零药名/零剂量、零 `%` 覆盖宣称。

---

## 7. 体积预算实测与 M1–M6 演进对照（`underwing/budget.py`）

下表结合 M1 实测字节数与 `underwing/budget.py` 强制门限给出精确投影：

| 审计项 | M1 前基线 | M1 实测值 | M2–M5 目标区间 | `budget.py` 硬性上限 |
|---|---|---|---|---|
| **核心代码包**（`index.html` + `assets/app.css` + `assets/app.js`） | `364.0 KB` | **`373.9 KB`**（`14.8 + 54.0 + 305.1 KB`，增设 `00-ios-tokens.css` 与 25 个 SVG `<symbol>`） | `~360–395 KB`（M4/M5 清理冗余旧样式为新组件腾出空间） | **`< 400.0 KB`**（`CODE_CAP_BYTES`） |
| **本地 Vendor IIFEs**（`assets/vendor/*.iife.js`） | `0.0 KB` | **`887.2 KB`**（`three-vendor` `751.5 KB` + `ios-vendor` `135.8 KB`） | `887.2 KB`（锁定版本不再膨胀） | **`< 1024.0 KB`**（`VENDOR_CAP_BYTES`） |
| **WebP 插画资产**（16 张卡片 + 99 张疾病图） | `2.87 MB` | `2.87 MB`（M1 未改动 `assets/art/`） | `~2.8–3.2 MB`（M2 升级吉祥物与 9 张卡片 WebP） | **`< 3.50 MB`**（`WEBP_CAP_BYTES`） |
| **仓库总磁盘占用**（含 `docs/`、`research/`、`underwing/`，严禁 `node_modules/`） | `4.45 MB` | **`5.50 MB`**（189 个文件） | **`~5.5–6.0 MB`** | **`< 8.00 MB`**（`REPO_CAP_BYTES`） |

> **关键结论**：通过将 `three@0.187.0`、`cupertino-pane@1.5.4` 与 `motion@14.14.0` 在临时目录打包为本地经典 IIFE 并引入 `VENDOR_CAP_BYTES = 1024 * KB` 与 `node_modules/` 禁令，Underwing 在获得完整现代 Three.js 3D 渲染能力与原生级 iOS 交互底座的同时，核心业务包仍保持在 `373.9 KB < 400 KB`、总仓库保持在 `5.50 MB < 8.00 MB`，完全契合 Qoder Sites 极速首屏与 `file://` 离线交付的双重要求。
