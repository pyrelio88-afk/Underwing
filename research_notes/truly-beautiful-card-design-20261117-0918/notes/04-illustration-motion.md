# 笔记 04：插画系统 + 动效（2026-11-17，index）

插画系统（品牌指南/从业者实践，属观点与惯例）：
- https://origin-brandworld.lenovo.com/visual-identity/illustration/ — 仅用批准调色板、色彩克制有意图、用色引导注意与深度；人物比例成人站姿 6-9 头高、儿童 3-5 头高；人物始终扁平、深度选择性使用。
- https://getillustrations.com/blog/flat-vector-illustration-guide/ — 每图 3-6 色、主色占 40-60%、4 色法（主/次/中性/强调）；最大错误是混 2 种以上扁平子风格；几何背景+曲线人物会割裂；角色扁平风 30+ 资产后一致性易崩。
- https://github.com/studio-manfred/manfred-shared-knowledge/blob/HEAD/plugins/manfred-ui-design/skills/illustration-style/SKILL.md — 每图用品牌色 2-4 色、无额外 hex；默认 2D 扁平，阴影/渐变/伪 3D 须有功能理由；与 4/8px 网格对齐。
- 角色系统：https://www.rmcad.edu/blog/illustration-for-mobile-apps-enhancing-user-experience-with-visuals/ — Headspace 插画目标是让冥想“易接近、不吓人，尤其对新手”。https://www.manypixels.co/blog/brand-design/brand-guides — Duolingo 给 Duo 写人格规则而不只是姿态表；Headspace 插画系统与情绪状态挂钩。

动效（组件库默认值/从业者共识，非实验数据）：
- 倾斜：https://mail.webdevpuneet.com/ui-snippets/atropos-3d-card/ — rotateX/Y Max 约 14°、25°+ 远缘文字难读、回正约 320ms、背景负偏移反向移动。https://github.com/garvit1000/animbits/blob/HEAD/content/docs/animations/cards/parallax-tilt.mdx — 默认 maxTilt 15°、0.3s、stiffness 300/damping 30；紧网格中降至 5° 或改用 hover lift；仅焦点卡用。https://www.nexus-ui.com/components/vector-tilt-scene — 12°、弹簧 240/22、透视 1100px、主要桌面悬停。https://docs-staging.heroui.pro/docs/react/components/holo-card — 小卡用 maxTilt 8、hoverScale 1.04、shineOpacity 0.55；网格中多张 3D 卡耗移动端内存，activateOnHover 按需建 3D 上下文；默认 302x453px（TCG 比例）。
- 翻卡时长分歧：https://components.auroratide.com/flip-card — 默认 0.75s，减动效时禁用翻转、仅播报可见面、不可见面不可聚焦。Android 指南转述（copyprogramming）称 200-400ms、超 500ms 显迟缓；多份教程用 0.6s。见开放问题。
- M3 动效 token：https://github.com/danieldevfull/material-design-3-skill/blob/HEAD/material-design-3/references/motion.md （二手整理 M3）— short 50-200ms、medium 250-400ms；卡展开 medium2 300ms + emphasized；进入减速、退出加速且更快；面积越大/移动越远时长越长。
- 减动效（标准+实践）：https://accessibility.build/wcag/2-3-3 — WCAG 2.3.3 AAA：交互触发的运动动画须可禁用，除非必不可少；颜色/透明度/模糊不算运动动画。https://www.humanstandards.org/perception/vision/motion-peripheral-vision/ — 大面积视差/多向运动可触发前庭症状；“不超中央视野 10%”为经验法则；过渡多为 200-400ms；勿超 3 次/秒闪烁。https://www.modern-css-layouts.com/css-only-micro-interactions-animations/accessibility-in-css-animations/ — reduce 是“减少而非移除”，以淡入/变色替代位移，保留信息传达；JS 视差须用 matchMedia 设门。
