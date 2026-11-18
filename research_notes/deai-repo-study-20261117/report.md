# De-AI Repo Study — Report (2026-11-17)

Source: research agent 2c9c5309-5440-4482-89b1-d938084adad5, completed 2026-11-17 19:11 CST.
User instruction: study each de-AI repo in the X post by @BenjaminUIX seriously and read them all, then start Qoder.

## 0. The X-post caveat (read first)

The X post was NOT recovered. https://x.com/BenjaminUIX/status/2122286309855338953 failed on
browser.open (domain policy), 9 browser.search queries found no post text or repo list, and
social.search does not cover X. The URL and mirrors/proxies were not retried.

Consequence: every repo below was found by general web search on de-AI / anti-slop discourse.
None is confirmed to be in the user's post. The account @BenjaminUIX itself was confirmed
(~6K followers, product designer). The list must be re-checked against the post once retrieved
(live browser attempt pending at time of writing) — some repos below may not be in it, and some
in it may be missing here. Repo names/owners below are all verified from the clones themselves,
never invented.

## 1. Repo list (13 studied + 1 router containing 10 sub-skills)

| # | Repo | One-liner |
|---|---|---|
| 1 | `heydamir/unslop` | Quiet-chrome UI skill: one bright element, 9 passes in fixed order, 5-line direction before editing. CC BY 4.0 (credit Damir Sokolovsky if text copied/adapted). |
| 2 | `miqdadbadjuber/anti-slop` v3.2.30 (MIT) | A 40-rule filter (R-01–R-40, 3 tiers) with Hard Gate absolutes and a mandatory 4-block Delivery Gate; DESIGN.md before building. |
| 3 | `LeoStehlik/no-slop-ui` v0.7.0 (MIT) | "Functional, honest, clean. Not impressive." Linear/Raycast/Stripe-flavoured restraint + PASS/REVISE/ESCALATE verdicts. |
| 4 | `ibelick/ui-skills` (~11k stars, MIT) | 9 narrow skills: accessible primitives, motion-perf fixes, a11y fixes, read-only audits, design.md authoring, preview canvases. |
| 5 | `Leonxlnx/taste-skill` v2.5.1 (MIT) | "Deal, never choose by taste": dealt palettes/layouts/moments, copy-first, real photos, browser-verified finish gate. Bar: figma.com/x.ai. |
| 6 | `blader/humanizer` v4.0.0 (MIT) | 26 English prose patterns in 6 groups, strongest first; mark → rewrite → check → final. Does NOT try to beat AI detectors. |
| 7 | `golovatskygroup/deai-code` v2.0.0 | Code smells, not UI: 26 research-backed patterns, 38 sources; security > correctness > maintainability > style. |
| 8 | `shannhk/avoid-slop` | Curated directory of 13 de-slop tools + comparison; the meta-lesson: prescribing a "better" style creates new slop. |
| 9 | `Vanszs/AntiSlopUI` v3.0.0 (MIT) | Deterministic contract: ban filter + 126-row tell catalogue + pattern library + CSV design-system generator + opt-in awards craft tier. (Cloned under the name Anti-AI-UI; README's own clone URL proves canonical name AntiSlopUI.) |
| 10 | `YuliangXiu/de-ai-router` | Router over 10 writing sub-skills; Chinese → qu-ai-wei first, humanizer-zh backup; academic → deslop; general → no-ai-slop. |
| 11 | `nutlope/hallmark` v2.0.0 (MIT, Together AI) | 50 "material" themes dealt 3/pick 1; Floor (unwaivable) / Reflex / Finish tiers; ~85 gates + 26 F-checks; eyebrow + tracked-caps are Floor bans. |
| 12 | `nextlevelbuilder/ui-ux-pro-max-skill` | BM25-searchable CSV design intelligence (80 styles, 192 palettes, 74 font pairings, 120 UX guidelines) + design-system generator; Qoder install template exists. |
| 13 | `pbakaus/impeccable` (Apache 2.0) | 24 commands, 62–64 deterministic detector rules, craft floor, Operate/Persuade/Read modes, critique/audit scoring. Qoder harness supported. The existing spaces-design skill already incorporates it — verify overlap, don't duplicate blindly. |
| 14 | `github/awesome-copilot` → `skills/anti-ui-slop` (UIZZE, v1.2.13, MIT) | Minimal router over 800k+ real screens; load ONE playbook; product's existing system outranks the skill; audit returns max 3 findings. |

Deliberately not pursued (seen and skipped, not studied): `iamneilroberts/unslop-ui`,
`felipebasurto/unslop-ui`, `maxgoff/unslop`, `ediiloupatty/declaude`, `podo/design-agent-skills`,
`bencium`, Vercel web-design-guidelines, Anthropic frontend-design, `hardikpandya/stop-slop`
(owner learned from a CHANGELOG citation, repo itself not read), `Humanizer-zh` standalone (read
only as vendored inside de-ai-router). Names seen in search without verified owners — do not
guess: `anti-ai-slop-ui`, `unslop-ui-skill`, `anti-ai-slop-skills`.

Read scope, honestly: fully read — unslop, anti-slop, no-slop-ui, humanizer (SKILL+README+AGENTS+
CHANGELOG), deai-code, avoid-slop README, ui-skills (all 9 SKILL.md + README + DESIGN/AGENTS
skim), awesome-copilot anti-ui-slop. Read in full except noted tails — taste-skill (SKILL.md +
all 17 refs read or sampled; sections-library recipes indexed by heading; effects-objects/creative
by heading + key sections), AntiSlopUI (SKILL.md + all 11 refs incl. charts.md and
slop-code-patterns.md in full; scripts/tests surveyed via README + listing; CSVs not hand-read,
per the skill's own instruction), de-ai-router (root + all 10 sub-skill SKILL.md + slopbeth
refs/docs/benchmarks + all sub-skill references dirs surveyed, evaluation.md/eval.md/tells.md in
full; slopbeth PowerShell/Python scripts listed, not read line-by-line). Bounded reads — hallmark
(README/SKILL/gates + all core refs + 2 themes + all 4 genres + flow/app/microinteraction sections;
48 theme files, macrostructure details, agents/scripts/eval/site unread), ui-ux-pro-max
(skill-content + quick-reference full; internals/CSV contents not read), impeccable (README/PRODUCT/
DESIGN + detector registry + command heads; SKILL.src.md body, most command files, crates/cli/
extension/site/tests unread).

## 2. Per-repo key lessons (tied to files read)

### 1. `heydamir/unslop` — direction first, then 9 passes
- `SKILL.md`: write a 5-line direction (audience, one job, one bright element, one restraint, one
  proof) before touching anything; then 9 passes in fixed order: Spacing, Color, Icons, Copy, Type,
  Layout, Details, Visuals, Motion.
- Tokens/refs: 4px grid; one accent, 4.5:1; no hue gradients/glows; lucide icons 16/18px, 1.5
  stroke; weights 400/500, max 600; nested radius (inner = outer − padding); motion one easing
  `cubic-bezier(0.22,1,0.36,1)`, 120–500ms.
- One bright element per view; headlines sit on left-empty space.
- For Underwing: the "one bright element" rule is the strongest single check for the card front:
  one thing stands out (the device image or the action), everything else quiet.

### 2. `miqdadbadjuber/anti-slop` — the filter, not a style guide
- `antislop.md` (745 lines) + 6 skills: 40 rules R-01–R-40 in 3 tiers. Hard Gate absolutes: no em
  dash, mobile-perfect with 44px targets, no unsourced numbers/fake testimonials, honest
  placeholders, WCAG AA, everything works, all states covered, run/build + click-through evidence.
- R-37: DESIGN.md required before building. Dials ENERGY/RHYTHM/MOTION 1–3. Mandatory 4-block
  Delivery Gate (what changed / evidence / states checked / known gaps).
- For Underwing: adopt the Delivery Gate shape for every Qoder build handoff; the "no unsourced
  numbers" rule is already R12 — this repo gives it enforcement language.

### 3. `LeoStehlik/no-slop-ui` — restraint with verdicts
- Sidebar 240–260px; cards 8–12px radius, 1px border, shadow ≤ `0 2px 8px rgba(0,0,0,0.08)`; buttons
  6–10px radius; body 14–16px; transitions 100–200ms, opacity/color only.
- Verdicts PASS/REVISE/ESCALATE; ≥2 failed checklist sections = revise. References Linear/Raycast/
  Stripe/GitHub.
- For Underwing: its shadow cap and radius range are a useful ceiling — Underwing's `--r: 12px`
  already sits at the top of it; do not go rounder/glossier.

### 4. `ibelick/ui-skills` — narrow tools, honest reporting
- `baseline-ui`: accessible primitives only, never mix design systems, ≤200ms feedback, never
  gradients unless requested, one accent per view. `fixing-motion-performance`: FLIP, no
  scroll-driven animation, blur ≤8px. `improve-ui`: read-only audit, 3 proofs per finding, max 3
  findings. `create-design-md`: Google design.md spec, strict YAML.
- DESIGN.md/AGENTS.md: semantic tokens, `text-base` body, `text-lg` section copy, `text-3xl` major
  headings, headings `font-medium`, sentence case, light borders + generous spacing.
- For Underwing: "one accent per view" + "never mix systems" reinforce the single-token-system
  discipline; the 3-findings audit cap is a good review format.

### 5. `Leonxlnx/taste-skill` — deal, don't taste; verify in a browser
- "Deal, never choose by taste"; never violet; copy first; `gate.mjs` until `GATE: PASS` (max 3
  rounds); one system, 12-col grid, ink ≥7:1, one accent <3% of screen, radius sharp/soft/round per
  kind, 44px buttons, one filled button per view; cards "barely there" (hairline, padding ≥24,
  title 20/18, all text 16/24); only 3 motion layers, no scroll reveals/parallax; one section per
  screen; photos hierarchy client > library > stand-ins > nothing, no AI images; perf budgets;
  13 copy registers; effects tech-only.
- `references/sections.md` §§1–2: one idea per section, one h2, one action; one object (product
  whole) in hero + at most 2 more sections; two boxes deep at most; merge short blocks (<495px);
  a card layout at most twice per page, neighbours never share a layout; proof as small exact
  objects only from the brief — no big-stat rows, no check-icon lists, no logo walls; the main
  action reads word-for-word identical in nav, hero, close, and phone bar; every link goes
  somewhere real, never bare `#`.
- For Underwing: translate "one section per screen / one idea per section" to one idea per card
  face (already R7's spirit); the "two boxes deep" rule constrains the hub/fly-out architecture;
  the "one object max 3 sections" rule warns against repeating the same device image across the
  deck. Tension: taste-skill bans AI images, but Underwing's illustration style is locked as
  ChatGPT-generated infographics — the locked direction wins; apply layout/copy rules only.

### 6. `blader/humanizer` — English prose, strongest patterns first
- 26 patterns in 6 groups, strongest/frequent first (not-X-but-Y contrast, one-line closer,
  chatbot residue — "most certain tell" — bold-as-decoration); workflow mark → rewrite → check →
  final; user writing sample overrides all rules including the dash rule.
- CHANGELOG — v4.0.0 REVERSES the no-invention rule (2.9.0): "no longer forbids adding facts…
  adds a specific detail it knows to be true." Do NOT adopt this for Underwing. Medical/care copy
  must keep the 2.9.0 no-invention rule + qu-ai-wei's 信息守恒.
- For Underwing: use for English UI strings only; Chinese copy is governed by qu-ai-wei/
  humanizer-zh, not by this skill's English bans.

### 7. `golovatskygroup/deai-code` — code smells
- 26 research-backed patterns, 38 sources; priority security > correctness > maintainability >
  style. Key smells: over-engineering, phantom edge cases, error-handling theater, hardcoded
  secrets, hallucinated dependencies ("slopsquatting"), test theater, churn, silent failures.
- For Underwing: applies to `build.py` and the single-file JS: no phantom edge cases, no test
  theater (the existing 57-pass e2e suite is real evidence — keep it that way), no silent failures
  in search/filter state.

### 8. `shannhk/avoid-slop` — the meta-warning
- Directory of 13 tools + comparison. Agreement: LLMs collapse to defaults; prescribing a "better"
  style creates new slop; the fix is remove defaults + add context + make the pattern fail a
  check. Sterile, voiceless output is its own tell. Notes impeccable's OKLCH +0.01 chroma
  neutrals rule.
- For Underwing: the single most important guardrail — applying every ban mechanically without
  the app's own direction (Crane, TCG, locked illustration) would produce a generic quiet shell
  that is itself a tell.

### 9. `Vanszs/AntiSlopUI` — the deterministic contract
- "If you could swap the logo with a competitor and nobody would notice — it's slop." Decision
  rule: any P0 tell blocks delivery, as does 3+ P0/HIGH tells; MEDIUM/LOW recorded; `UNVERIFIED`
  P0 blocks like FAIL; never mark unmeasured items PASS. House rules: no claim without a validated
  number, no ban without a compliant default, never invent proof. `scripts/` enforces 23 checks +
  artifact gate + golden fixtures.
- Ban filter + pattern library + CSV generator post-filtered; domain colors (health/care #0E7490 —
  must not override Underwing --brand #255A41; the skill's own decision order puts user brand
  assets first); display faces by category, ≤2 families / ≤3 weights; motion 100–300ms, craft
  exception ≤400ms; 126 tell rows incl. K6 left-border = P0, K3 hover:scale = HIGH.
- `references/charts.md`: 15-point anti-slop chart scan; color system (product hue + semantic
  tokens, single-hue sequential ramp, categorical max ~5–7 colorblind-safe, OKLCH); "premium
  minimal" chrome — custom tooltip card, circle legend icons, minimal axes, soft dashed
  horizontal-only gridlines; bar/line/donut rules; KPI cards; motion 200ms ease-out; dark mode
  never pure black; a11y mandatory; empty/loading/error states never blank.
- `references/slop-code-patterns.md`: React/TSX code tells (derived state, state soup, fetch-in-
  effect, god components, `any`, conflicting Tailwind classes, unsanitized innerHTML = P0, secrets
  client-side = P0, zero tests, forms without `<form>`). Cites CMU arXiv:2604.06373.
- Overlap note: AntiSlopUI vendors `ui-ux-pro-max/` under MIT with local fixes — its CSV stats
  are older/smaller than upstream's. Do not double-count as two independent sources.
- For Underwing: the most directly applicable UI contract of the set. Adopt its decision rule and
  audit shape; charts.md governs any data display; code-patterns governs JS hygiene (adapted:
  single-file HTML, no React — principles transfer, framework specifics don't).

### 10. `YuliangXiu/de-ai-router` — the writing router (Chinese-first)
- Router: Chinese → qu-ai-wei first, humanizer-zh backup; academic → deslop; general →
  no-ai-slop; short → anti-ai-slop-writing.
- qu-ai-wei (414-line SKILL.md + README): merged 王佩 v4.0 + humanizer-zh + lieflat corpus study
  (300 AI samples, 117.9万字， 5 models); upstream `baibanbao/qu-ai-wei`. Three hard boundaries
  outrank all de-AI rules: 信息守恒 (no new facts/numbers/names/dates/quotes/causation; losing a
  hedge = tampering), 最小改动， 结构不动. Two modes: 自家稿 (red-pen report, author decides) vs
  白名单 (only listed hits touched, rest verbatim). Three thresholds: full-width punctuation /
  ~zero bold / zero exclamations. 11 measured rules （翻案腔， 顿号， 句式同款， 破折号 5.3×, 冒号，
  序数词， 拟人， 概括盖具体， 起手式， 翻译腔 5种， 段首零主语）. §七 NON-tells: passive voice,
  首先……其次， in-sentence 排比， and length variance are NOT tells — do not "fix" them. Seven
  adjudications where the three sources contradicted, decided on measured evidence. "宁可留一点
  AI 味，不可造一个假事实。"
- humanizer-zh: 31 patterns + F-group Chinese checks §26–31; preserve facts/numbers/negation/
  conditions/time/attribution; "可能" must not become "确定"; real 3-item lists, necessary dashes,
  Chinese 排比 and connectives may stay; match register per genre.
- no-ai-slop eval.md: detect = name each pattern with a quoted line + short fix, without
  rewriting; 11 editing principles; final read ("would the writer recognize this as their own
  voice?").
- slopbeth: density + Orwell + evidence boundary. 100-point score model; block release when a
  rewrite adds unsupported facts, changes obligations, weakens uncertainty/timing, flattens voice,
  or claims detector safety. Detector-immunity gate was rejected — public detectors disagreed and
  one flagged a human control. Benchmarks honestly note scoring competitors with its own
  instruments is circular.
- Others: unslop/Cursor (soul pass), humanizer-aboudjem (55 patterns, score formula, burstiness),
  deslop (scientific; passive OK in methods), anti-ai-slop-writing (generation-time constraints),
  anti-slop/elithrar (preserve voice; false positive worse than leftover tell; 5 validation
  questions), humanize/soundshuman (41 patterns + sloplint CLI; rules-as-data JSON).
- For Underwing: qu-ai-wei + humanizer-zh are the governing authorities for ALL Chinese card
  copy. English-derived bans do not transfer mechanically. The router's unanimous position — never
  invent a fact to sound human, never chase detector scores, false positives are worse than
  leftover tells — matches the user's own honesty rules exactly.

### 11. `nutlope/hallmark` — themes as materials, Floor/Reflex/Finish
- 50 themes as materials (deal 3, pick 1); Floor (16 rules, unwaivable) / Reflex (waivable on
  record) / Finish tiers; ~85 numbered gates + 26 F-checks; eyebrow + tracked-caps + template
  punctuation are house-rule Floor bans; OKLCH, tinted neutrals chroma ≥0.005, accent <5% viewport;
  8 control states; motion 120/220/420ms, one reveal per page; app screens: marketing rules step
  aside, theme lends palette/faces/radius only, density is design, 4 data states, motion = state
  only.
- Dose theme (family medication): pharmacy green `oklch(50% 0.13 160)`, DM Mono dose/time labels;
  do-not: red/amber for missed states — conflicts with Underwing R2, see §3.
- For Underwing: the Floor/Reflex/Finish tiering is the best model for absolute vs waivable
  rules; the app-screens section fits a card app better than any marketing-page rule set.

### 12. `nextlevelbuilder/ui-ux-pro-max-skill` — searchable design intelligence
- BM25-searchable CSVs (80 styles/51 active, 192 palettes, 74 font pairings, 120 UX guidelines,
  25 charts, 22 stacks); `--design-system` generator + MASTER.md/overrides persistence + DTCG/CSS
  tokens + variance/motion/density dials; Qoder install template exists (`.qoder/skills/
  ui-ux-pro-max/SKILL.md`); quick-reference 10 priority categories with a11y/touch CRITICAL
  first; Phosphor icons default; 6-viewport Playwright audit script.
- For Underwing: the Qoder-native option — if one skill is installed into the Qoder build, this
  is the one with a Qoder path. But generator output must be post-filtered (AntiSlopUI's
  post-filter table shows how), and CSV intelligence must not override the locked Qoder tokens.

### 13. `pbakaus/impeccable` — deterministic detectors + modes
- 24 commands; Qoder supported harness (`.qoder/`); 62–64 deterministic detector rules incl.
  side-tab, overused-font (incl. Fraunces), cream-palette, nested-cards, icon-tile-stack,
  hero-eyebrow-chip, kicker ban, ghost card, grid background; craft floor verify/refuse lists;
  modes Operate/Persuade/Read; critique = Nielsen 10 heuristics /40 + specificity verdict + P0–P3;
  audit = 5 dimensions /20.
- For Underwing: the detector-registry idea (mechanical checks that fail the build) is the right
  enforcement shape; the spaces-design skill already incorporates the 24 commands/62 rules —
  reconcile before adding anything new.

### 14. `awesome-copilot` anti-ui-slop (UIZZE) — reference-first router
- Minimal router over 800k+ real screens; load ONE playbook; paid UIZZE MCP optional; product's
  existing system outranks the skill; audit returns max 3 findings.
- Its policy says never tell the user evidence was missing — do NOT follow that; plain reporting
  wins.

## 3. Conflicts — flagged, resolved per standing user rules

1. Tilt/flip vs bans. Repos ban tilting/scaling cards, but Underwing's TCG flip + pointer tilt
   (±8°/±7°) is user-mandated (R9/R10) and is the core interaction. Resolution: keep it as the ONE
   deliberate mechanism, with reduced-motion = fade. Do not add any second tilt/scale effect.
2. Brand hue. AntiSlopUI's health/care #0E7490 must NOT override `--brand #255A41`. Same for
   hallmark Dose's pharmacy green — reference only.
3. Purple bans vs type accents. Repos' purple bans target purple-as-primary. Underwing's `--indigo
   #3F4FA8` / `--plum #8C3460` are restrained type accents on a green/neutral system. Keep them
   small, never as gradients, never dominant.
4. English vs Chinese copy rules. English bans (zero em dash, no rule of three, no passive, no
   "first/second/finally") do NOT transfer mechanically to Chinese. qu-ai-wei §七/§八 + humanizer-zh
   govern. Real 3-item lists, necessary dashes, Chinese 排比， and connectives may stay.
5. Sterile-default warning. Over-filtering without direction is its own tell. Underwing already HAS
   direction (Crane reference, TCG, locked illustration, Qoder tokens) — apply bans against it,
   don't strip to a generic quiet shell.
6. Hallmark Dose "never red/amber for missed states" vs R2. Different uses: Dose is about
   medication-adherence states; R2 reserves red ONLY for "何时停下联系医护". R2 wins; do not use
   red/amber for any other state — use words + icons + neutral color.
7. humanizer v4.0 "add a true detail" vs honesty rules. Rejected for Underwing. Keep no-invention
   + 信息守恒 absolute. Never let a de-AI rewrite add a symptom, number, or step the source didn't
   have.
8. taste-skill "no AI images" vs locked illustration. Locked direction wins (ChatGPT-generated
   infographics). Apply taste-skill's layout/copy rules only.
9. awesome-copilot "never say evidence was missing" vs plain reporting. Plain reporting wins.

## 4. Synthesized prescription for Underwing (Qoder build)

### A. Card UI — DO
- One card = one thing, one idea per face (R7 + taste-skill). Front: recognise + decide. Back:
  steps + check.
- One bright element per view (unslop): on the card front, either the device illustration OR the
  primary action stands out — never both competing.
- Two boxes deep at most (taste-skill): card + picture panel is the limit. Fly-out cards must not
  contain boxed panels containing boxed chips. Flatten: card → content.
- Barely-there cards (taste-skill): hairline border (`--line #E6E6E6`), padding ≥24px on desktop
  faces, shadow ≤ `0 2px 8px rgba(0,0,0,0.08)`. No glow, no glass, no gradient border.
- One filled button per view (taste-skill); the main action reads word-for-word identical
  everywhere it appears. Secondary actions are text or hairline-outline.
- Warnings triple-coded BEFORE the action button: red + icon + words, never color alone. Red
  appears ONLY for R2's stop-and-contact-medical.
- All states designed: loading, empty, error, success — for search results, filters, fly-out.
  Never a blank box; empty state = icon + one line + one action.
- 44px minimum touch targets, 48px preferred for primary actions. Flip affordance must be a real
  `<button>` with visible focus, not a div.
- Real controls, real links: every button does something; no dead `#` links; no decorative buttons.
- Vary card anatomy deliberately: a card layout at most twice per screen-group; neighbouring
  groups never share a layout; repeat the scaffold so it's learned once. For the 32-card deck:
  vary by card KIND (disease hub / drug / device / care-step), not randomly per card.
- Don't repeat one object across the deck: the same device image in more than ~3 cards reads as
  template filler. Care-series cards must each show a DIFFERENT action frame.

### B. Card UI — AVOID
- Hover scale / tilt on anything except the one mandated TCG tilt. No `hover:scale`, no
  lift-on-hover shadows.
- Left-border accent bars (AntiSlopUI K6 = P0). No `border-left: 4px solid` callouts.
- Icon-tile stacks, hero eyebrow chips, kickers/eyebrows with tracked caps.
- Nested cards, ghost cards, grid/dot backgrounds.
- Glassmorphism, backdrop-blur panels, gradient meshes as decoration. Blur ≤8px only where
  functionally needed.
- 3-card grids as the default layout. The deck grid must earn its structure from the content
  (age/sex grouping, hub/fly-out), not from a template.
- Check-icon lists, big-stat rows, logo walls, fake social proof. Record `NO-PROOF` and omit.
- Emoji headings, decorative bold, bullets where prose fits.

### C. Typography — DO
- Chinese body 18px (html 18px already set), line-height 1.7–1.8. Titles: serif per Crane
  reference (R18), body: system sans. ≤2 families, ≤3 weights; weights 400/500, max 600.
- Ink contrast ≥7:1 for body text. `--ink #0F0D0C` on `--card #FFFFFF` clears this; check every
  accent text pairing the same way.
- Tabular numerals for all numbers and stats. Dose/time labels in mono (hallmark-Dose idea) for
  drug cards.
- Sentence case for labels/links; full-width Chinese punctuation in Chinese copy.
- One h2-equivalent per card face.

### D. Typography — AVOID
- Tracked all-caps labels / letterspaced eyebrows. Chinese equivalent: letterspaced, small, grey
  section labels stacked above every heading. Don't.
- Overused display faces as a shortcut to "character". The Crane serif must be a chosen system
  face, not a Google-Fonts-of-the-week.
- Italic or letterspacing on Chinese text.
- Bold-as-decoration: bold only for the one thing on the face that must be found first (e.g., the
  stop-condition line), never for emphasis sprinkling.

### E. Color — DO
- One system, locked tokens win: `--bg #F2F4F2`, `--card #FFFFFF`, `--line #E6E6E6`,
  `--ink #0F0D0C`, `--brand #255A41`, `--brand-2 #80C776`, `--coral #B4532A`, `--amber #8A6512`,
  `--indigo #3F4FA8`, `--plum #8C3460`, `--r 12px`.
- One accent per view, <3–5% of screen. The 5 type accents distinguish card KINDS; each card face
  shows at most one of them, small.
- Tinted neutrals: if OKLCH is used, neutrals carry chroma ≥0.005 / +0.01.
- Semantic color discipline: red = R2 only; amber = caution within a step, never a state color;
  green = brand/confirmation. Color never the only signal.
- Dark surfaces (if any): never pure black — `#0f1419`/zinc-900 range.

### F. Color — AVOID
- Purple/violet as primary or gradient. Indigo/plum stay as small type accents.
- Hue gradients, multi-hue gradients, glows, aurora/mesh decoration. The ONE permitted gradient:
  a single-hue vertical data fill inside a chart/sparkline, if charts are ever added.
- Hardcoded hex in markup when a token exists. Every color through a CSS variable.
- The health-care teal #0E7490 (AntiSlopUI domain default) — brand wins.

### G. Layout — DO
- 12-col grid, equal left/right edges; one card-group per viewport band, generous section padding,
  calm rhythm.
- Density is design (hallmark app screens): marketing rules step aside; the deck grid's density,
  the search's prominence, and the fly-out's clarity ARE the design.
- 4px spacing grid; nested radius rule (inner radius = outer − padding).
- Mobile-first, verified at 390px AND tablet 768px. At 390: keep desktop order, each image after
  its text.
- Search: one unified search, top-right. Chinese alias search per optimization research.

### H. Layout — AVOID
- Centered dual-CTA hero, 3-card feature grid, glass navbar. Underwing has no hero — don't add one
  for the contest.
- Two picture-less sections adjacent: every band needs its real visual (card art) or earns its
  plainness.
- Hairline-only rhythm with no spatial grouping.

### I. Motion — DO
- One easing, one table: feedback 100–200ms, state change 200–300ms, TCG flip ~300ms focal, craft
  exception ≤400ms for the fly-out only. Easing `cubic-bezier(0.22,1,0.36,1)`.
- Motion = state only: flip = face change; fly-out = hub expansion; fade = reduced-motion
  substitute. No decorative motion.
- Reduced-motion = fade. Disable pointer tilt entirely under reduced motion, keep tap-to-flip
  with fade.
- Exits faster than entrances; ease-out for entrances.
- ≤200ms feedback on every tap — the flip must START immediately.

### J. Motion — AVOID
- Scroll reveals, parallax, scroll-driven animation.
- Spring/bounce, infinite pulse, re-animate on every update, `transition-all`, typewriter.
- Stagger beyond 5 items; the fly-out fan must not cascade 10+ cards.
- Animating layout properties (width/height/top/left) — transform/opacity only.

### K. Copy (Chinese — governed by qu-ai-wei + humanizer-zh) — DO
- 信息守恒 / 最小改动 / 结构不动 outrank every de-AI rule. Never add a fact, number, step, or
  causal claim the source didn't have. Never drop a hedge ("可能" stays "可能"). Never flatten a
  warning into a smoother sentence that weakens it.
- Concrete over abstract, using only values already in the source. Card steps name the device, the
  body part, the number, the time — all from the verified source.
- Full-width punctuation, ~zero bold, zero exclamation marks.
- Second person, direct verbs, front-loaded: the card front says what to do first, in the order it
  must be done.
- End on a concrete point or next action, not a summary-recap or kicker line. Card backs end with
  the check step or the stop-condition, never "让我们一起守护家人健康" style closers.
- Portability test: if a sentence could be swapped onto a competitor's card without anyone
  noticing, cut it or make it specific to THIS condition/device/step.
- Validation questions before cutting anything: does cutting lose meaning? Formula or choice?
  Announce or deliver? Heat or light? Trust more or less without it? If it survives all five,
  leave it.
- Leave good text alone. The nursing-accurate phrasing in verified sources is voice, not slop.
- R13 discipline: medication cards cover operation methods only, no doses.

### L. Copy — AVOID (Chinese-specific, measured rules from qu-ai-wei + humanizer-zh)
- 翻案腔， 顿号 pile-ups, adjacent sentences reusing the same syntactic skeleton （句式同款 — in-
  sentence 排比 is fine), 破折号 overuse (5.3× human rate), 冒号 reveals, 序数词 scaffolding on
  short passages, 拟人 of devices/systems, 概括盖具体， 起手式 throat-clearing openers
  （值得注意的是/需要注意的是）, 翻译腔 (5 kinds), 段首零主语.
- Do NOT "fix" the NON-tells: passive voice, 首先……其次， in-sentence 排比， length variance.
  Manufacturing raggedness （毛边） to look human is itself wrong.
- English-tell imports that don't apply: zero-em-dash absolutism, rule-of-three bans,
  "delve/tapestry/leverage" word lists.
- Chatbot residue: "当然可以""希望这对您有帮助""如果您还有其他问题" — no assistant voice anywhere
  in the app. No meta-commentary about the app itself on cards.
- Importance puffery and weasel attribution: "非常重要""专家建议" without a named source — cut or
  name the source; if no source, flag, don't invent one.
- Never chase AI-detector scores. No detector claim may appear in any contest material.

### M. Process — the pre-delivery gate (for the Qoder build)
1. Direction line first (unslop 5-line direction, one sentence each): audience, one job, one
   bright element, one restraint, one proof. Written before any code change.
2. DESIGN.md / token check: build against the locked Qoder tokens only; any new color/radius/
   spacing value is a FAIL until added to the token list with a reason.
3. Ban scan (mechanical where possible): no `hover:scale`, no left-border accents, no
   gradient/glass, no bare `#` links, no hardcoded hex, no emoji headings, no exclamation marks in
   Chinese copy, no red outside R2.
4. Copy pass (qu-ai-wei whitelist mode + humanizer-zh): check each card's copy against the 11
   measured rules + NON-tells; verify 信息守恒 against the source.
5. States + a11y check: all 4 data states per interactive surface; 44px targets; focus visible;
   role/aria-label on flip controls; color never the only signal; reduced-motion verified.
6. Evidence block (4-block Delivery Gate): what changed / run+click-through evidence / states
   checked / known gaps. `UNVERIFIED` is never reported as PASS.
7. Fresh-eyes review: one pass by an agent/context that didn't write the change, max 3 findings
   with 3 proofs each.

## 5. What could not be accessed (plainly)

1. The X post itself — see §0. All repo selection is unconfirmed against the user's list.
2. Hallmark git clone — failed twice (pack/index errors); recovered via GitHub connector (commit
   04977e15). 48 theme files + macrostructure details + agents/scripts/eval/site remain unread.
3. Impeccable internals — SKILL.src.md body, most command files, crates/cli/extension/site/tests
   unread (bounded read; the spaces-design skill already incorporates its rules).
4. ui-ux-pro-max internals — search/design_system internals and CSV contents not read (the skill
   itself forbids hand-reading CSVs; queried stats only).
5. AntiSlopUI scripts/tests — surveyed via README + listing, not executed; vendored CSVs not
   hand-read.
6. slopbeth scripts — PowerShell/Python linters listed, not read line-by-line; benchmark JSONL
   corpora not opened.
7. Repos seen but not studied — listed in §1 with owners where verified; `stop-slop`,
   `Humanizer-zh` standalone, and the three ownerless names were not read.
8. No live-browser verification — the research agent cannot operate the browser; nothing here rests
   on a live site visit. Qoder contest rules / deadline (2026-11-30 18:00) inherited from parent
   context, not re-verified.

## 7. Post-recovery reconciliation (2026-11-17 19:15)

The X post WAS recovered by a live-browser read (read-only, no login) at 19:12–19:15 CST.
Post: @BenjaminUIX, 19:11 2026-11-16, "10 skills that kill AI slop". All 10 t.co short links
were followed and their final destinations verified. The post advises installing 2 or 3, not
all 10. The 46 replies require login; no author follow-up was visible in the un-logged-in view.

Verified 10 items:
1. Anti UI Slop — https://uizze.com/
2. Impeccable — https://impeccable.style/
3. Taste Skill — https://github.com/Leonxlnx/taste-skill
4. Emil Design Engineering — https://github.com/emilkowalski/skills
5. Vercel Web Design Guidelines — https://github.com/vercel-labs/agent-skills
6. Frontend Design (Anthropic) — https://github.com/anthropics/skills
7. Hallmark — https://github.com/Nutlope/hallmark
8. Make Interfaces Feel Better — https://github.com/jakubkrehel/make-interfaces-feel-better
9. UI UX Pro Max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
10. Stageshow (Benji Taylor) — https://github.com/benjitaylor/skills

Reconciliation against this study (§1): studied already — Taste Skill, Impeccable (bounded),
Hallmark (bounded), UI UX Pro Max (bounded), Anti UI Slop (via the awesome-copilot vendored
skill only; uizze.com itself not read). NOT studied — Emil Design Engineering, Vercel Web
Design Guidelines, Anthropic Frontend Design, Make Interfaces Feel Better, Stageshow. A
follow-up study of those 5 plus uizze.com was spawned 2026-11-17 19:15; its deltas will be
appended here.

The other 9 repos in §1 (unslop, anti-slop, no-slop-ui, ui-skills, humanizer, deai-code,
avoid-slop, AntiSlopUI, de-ai-router) are NOT in the post. Prescriptions in §4 that cite
AntiSlopUI and qu-ai-wei therefore come from outside the post; they stand as reference, not
as post content.

## 8. Follow-up study: the 5 unstudied post items + uizze.com (2026-11-17 19:23)

Research agent aaa2a420-2034-4145-be83-7aad09aee686. Clones in /tmp/deai2/ (all 5 repos cloned
successfully). Baseline report §1–§5, §7 re-read first; this section records deltas only.

### 8.1 Per-item key points

1. emilkowalski/skills (Emil Design Engineering) — 20 skills read. Motion decision framework:
   frequency gate (UI used 100+/day never animated, keyboard-triggered never animated); purpose
   classes (spatial consistency, state, explanation, feedback, anti-jolt); easing order (enter/exit
   ease-out, movement ease-in-out, hover/color ease, linear for constant speed, NEVER ease-in);
   named curves `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out:
   cubic-bezier(0.77,0,0.175,1)`, `--ease-drawer: cubic-bezier(0.32,0.72,0,1)`; durations
   (press 100–160ms, tooltip 125–200ms, dropdown 150–250ms, modal/drawer 200–500ms; UI animation
   <300ms except modal/drawer/sheet/toast). Springs: Apple-style {duration:0.5, bounce:0.2},
   bounce 0.1–0.3, must be interruptible (retarget from current value, velocity blending).
   Buttons: `:active scale(0.97)`; never `scale(0)`, start from 0.9–0.97 + opacity; origin-aware
   popovers; interruptible UI uses transitions, not keyframes. Choreography: one entrance per
   container; never stagger high-frequency/keyboard UI; no uniform stagger; stagger 30–80ms,
   total <300ms, animate only first 5 of long lists; exits simultaneous/shorter/simpler.
   Break-UI: plausible worst-case data only; numbers/dates never truncated; check 320px, 200%
   zoom, dark, RTL. Mobile baseline (11 items): hover gating, 16px inputs (no iOS zoom),
   100dvh/100svh, tap-highlight transparent, touch-action manipulation, safe-area, never disable
   zoom. Learn-taste: never invent a why, mark inferences as inferred; DESIGN.md entries carry
   date + user's own words.
2. vercel-labs/agent-skills (Vercel Web Design Guidelines) — both SKILL.md files are 39-line
   fetchers; the real guides (command.md) were fetched and read in full. web-interface-guidelines
   (191 lines): a11y + visible focus; forms with fix-direction errors; animation (reduced-motion,
   transform/opacity, no `transition-all`, interruptible); typography (curly quotes, nbsp between
   number and unit, tabular-nums, `text-wrap: balance` + `pretty`); empty/loading/error states;
   images (alt, aspect-ratio reserved); performance (>50 items virtualize); URL reflects state,
   deep-linkable; destructive actions need confirm or undo; every drag needs a non-drag
   alternative; touch-action manipulation; safe areas; dark mode; i18n. writing-guidelines (257
   lines): banned easy/simple/quick + very/just/really (English); weasel words and vague
   quantifiers need cited numbers; AI-tell patterns; sentence-case headings; bold only for UI
   elements or key facts; English never uses em dash.
3. anthropics/skills — only `frontend-design/SKILL.md` (71 lines) read. Theme-first; hero = the
   most characteristic thing; typography carries personality, 1–2 families, line length <80 chars.
   Bans: single-word title emphasis, all-caps labels, unnecessary eyebrows; numbered markers only
   for true sequences; one orchestrated moment; AI design clusters 1–5 (incl. cluster 1: warm
   cream #F4F1EA + serif + terracotta #D97757; template chrome: tracked-caps eyebrow, mid-dot
   meta, WORD — fragment, mono data labels, → on links). Brief's words always win; two-pass
   plan/review/build/critique; 4–6 hex token system + ASCII wireframes. Writing: user perspective,
   active voice, CTA states what will happen, one name per thing throughout, errors give
   direction not emotion, one task per element.
4. jakubkrehel/make-interfaces-feel-better — all files read. 19 core principles + error table +
   review format. Animations: exit −12px/150ms ease-out, shorter than entrance; context icon
   animation exact values (scale 0.25→1, opacity 0→1, blur 4px→0, spring duration 0.3 bounce 0,
   CSS cubic-bezier(0.2,0,0,1)); press scale always 0.96, never below 0.95; animation is never the
   only feedback channel. Surfaces: concentric radii; >24px padding = separate surface; optical
   alignment; shadow = elevation (3-layer light tokens + single ring dark); image stroke pure
   black oklch(0 0 0/0.1) light / pure white dark, never tinted; hit areas 44×44 touch / 40×40
   dense desktop, pseudo-element extension, no overlap. Typography: `text-wrap: balance` ≤6/10
   line headings, `pretty` default for short/medium text, neither for 10+ lines; no forced font
   family. Icons: stroke matches text weight (1.5px@400 / 2px@500–600 / 2.5px@700), single SVG
   currentColor, outline default / fill active, designed at render size (16/20/24 grid), RTL flip
   table. Performance: never `transition:all`; will-change sparingly, only after observed jank.
5. benjitaylor/skills (Stageshow) — SKILL.md + all 15 references read in full; scripts surveyed by
   header; kit spot-checked. SCOPE WARNING: Stageshow builds faux product-UI illustrations
   (static images, feature cards, scripted cursor demos, bento grids) — a React illustration tool,
   not real app UI. Only composition/craft/motion rules transfer, and transfers must be marked.
   Craft: one idea; 5 failure modes; 3–7 real-string word budget; labels/values same treatment;
   one big number; say it once; no invented logos/marks; no AI sparkles/purple; small text lh
   ≥1.3; one font family; sentence case; concentric radii; no 1–3px near-tangencies; one neutral
   family, five inks + one accent; gradients/halos serve the story or go; never use an accent ring
   to point at things. Framing: 20 rules (one hero + ≤2 satellites, hero ≥2/3 stage width, tilt
   must be earned, etc.). Motion: 3 story shapes; poster frame is the most-seen frame; stagger
   40–80ms; feedback fast, storytelling slow; nothing pops; neighbours yield; soft landings, no
   bounce. Teaching (10 bad/good pairs): animate the "space" on insert (neighbours follow);
   exiting elements stay mounted through a 320ms exit; interrupted motion retargets from current
   position; measure the object itself, not a padded wrapper (the 4px lesson); text moves via
   transform inside a stable grid (margin moves shift baselines). Annotations: 1px quiet leader
   lines, landing 4–6px from object, max one bend, never crossing content. Bento: 14 rules incl.
   1:1 display, one Stage per tile (never wrap a grid in one scaling Stage — text shrinks);
   narrow screens get a redesign, not a shrink; stat on one line, number+unit never wraps
   (nowrap). Looks/brands: real company names pair with real marks, never invented approximations.
   Choreography: readable still frame first; header/surface/action positions stable, content
   changes inside; staggered-but-overlapping related changes. Review: judge from frames, not code;
   ranking framing→hierarchy→motion→polish; first question "could this be any product in the
   category?".
6. uizze.com (Anti UI Slop home site) vs the awesome-copilot skill (v1.2.13) already read.
   Homepage text capture was thin (JS-heavy landing: hero, Without/With comparison, "real screens,
   journeys, licensed design materials", 9 USD price metadata; no playbook text). Comparison rests
   on two public SKILL.md mirrors (innernet.live anti-ui-slop full text; appndo ui-taste v0.3.0,
   2026-10-18) + search summaries. Core consistent; 6 substantive changes in the current version:
   (1) "load ONE playbook" changed to playbook + platform/craft guidance, multiple complementary
   playbooks allowed; (2) two new playbooks, `reference/craft.md` and `reference/overdrive.md`
   (Overdrive = opt-in exceptional interaction work, needs a chosen direction first; per
   claudemarket, they adapt licensed Impeccable guidance under Uizze terminology); playbook texts
   not read; (3) evidence policy REVERSED — old "continue silently" replaced by "distinguish an
   exact reference, a related example, no match, and a service error; briefly disclose a
   limitation that affected the result; never claim an image was inspected without evidence" —
   consistent with plain reporting; §3.9's rejection now applies only to the old awesome-copilot
   snapshot; (4) `ui-taste` adds "Image first, then implement" (generate and inspect a realistic
   UI image first, implement 1:1 with semantic components); (5) work-from-product + Finish
   greatly expanded (render checks at representative sizes incl. user-reported failing sizes,
   distinguish code inspection from visual verification, three-part handoff); (6) ecosystem split
   into `ui-taste`, `ios-design`, uizze-mcp (`uizze-ui-research`, `ui-slop-review`), free preview
   MCP with single tool `check_ui_slop`, paid full MCP. License note: SKILL.md claims MIT while
   the directory LICENSE is Apache-2.0 — clarify before reuse (no impact: Underwing references
   rules only, reuses no text).

### 8.2 Deltas to §4 prescription (new material only)

Motion (largest delta — §4's motion table was too coarse):
- I-N1 frequency gate (Emil): high-frequency/keyboard-triggered actions get zero animation;
  search/filter taps never stagger. Flip/fly-out are low-frequency deliberate actions — earned.
- I-N2 easing split, revising §4 "one easing": default ease-out cubic-bezier(0.23,1,0.32,1);
  fly-out travel segment ease-in-out cubic-bezier(0.77,0,0.175,1); hover/color transitions ease;
  never ease-in.
- I-N3 interruptibility is a hard requirement (Emil + stageshow): rapid repeated flip taps
  retarget from the current position, no queueing, no restart from zero; exiting elements stay
  mounted through their exit; interruptible UI uses transitions, not keyframes.
- I-N4 press feedback exact value: unified press scale 0.96, never below 0.95, buttons only.
  Clarifies (not conflicts with) §4B's hover:scale ban: press scale ≠ hover scale; card hover
  still bans scaling.
- I-N5 exit spec: fly-out close −12px / 150ms ease-out, shorter than entrance; exits simultaneous,
  not staggered.
- I-N6 stagger refined, revising §4J: 30–80ms, total <300ms, first 5 items only; one entrance per
  container; the fly-out fan is the single orchestrated moment (Anthropic); hub cards do not enter
  one by one on page load.
- I-N7 spring ban narrowed, revising §4J's blanket ban: content landings ban bounce; fly-out
  arrival and flip settle MAY use a restrained spring (bounce ≤0.2, duration 0.5) but default
  stays CSS ease-out and any spring must be interruptible. Decision: default unchanged (ease-out).
- I-N8 animation is never the only feedback channel: flip must also change button text; fly-out
  open/close must also change text/icon/color.
- I-N9 reduced-motion nuanced, revising §4I's absolute "fade": less/softer, not zero — keep fade
  and color/opacity changes; pointer tilt fully disabled, tap flip becomes fade (§4 sentence kept).
- I-N10 hover gating (Emil): all hover styles inside `@media (hover:hover) and (pointer:fine)`,
  preventing stuck hover on touch. Mandatory in the gate.
- I-N11 neighbours yield (stageshow, transferred): fly-out opening yields layout space from
  surrounding cards without jump/overlap; insert/delete animates the "space" itself; measure the
  visible box, not a padded wrapper; text changes move via transform in a stable grid.
- I-N12 performance: tilt transform written directly on the card element, not driven via a parent
  CSS var (recalc trap); will-change only after observed jank, transform/opacity/filter only.

Card UI additions:
- A-N1 still-frame first (stageshow poster frame, transferred): design the static state first
  (most-seen frame), then add motion; card frame position stable during flip; hub position stable
  during fly-out.
- A-N2 front-face word budget (stageshow 3–7 real strings, transferred): front holds title + one
  line + action; numbers must be real; same string not repeated front/back without reason.
- A-N3 no 1–3px near-tangencies (stageshow): add to visual gate checks.
- A-N4 image stroke (Make Interfaces): illustration frame uses neutral 10% stroke (pure black
  oklch 10% on light), never brand-tinted.
- A-N5 hit-area extension via pseudo-elements; check adjacent hit areas do not overlap.
- A-N6 numbered markers only for true sequences (Anthropic): numbered badges only on real step
  sequences (care-series cards); hub cards get no decorative numbers.
- A-N7 no accent ring to point at things (stageshow): emphasize the flip button via text and
  position, not a brand-color ring.
- A-N8 grid rebuild rule (stageshow bento, transferred): the deck grid must never adapt via
  transform scaling (text shrinks); rebuild per width; breakpoints set by content; number+unit
  never wraps (nowrap).
- A-N9 state icon switch values (Make Interfaces): scale 0.25→1 + opacity 0→1 + blur 4px→0,
  cubic-bezier(0.2,0,0,1).
- A-N10 icon stroke table (Make Interfaces, revising round-1's fixed 1.5): stroke follows adjacent
  text weight — 1.5px@400 / 2px@500–600 / 2.5px@700; outline default, fill active; designed on
  16/20/24 render grids.

Typography additions + one correction:
- C-N1 text-wrap split (Vercel + Make Interfaces): headings `balance` (≤6/10 lines), short/medium
  text `pretty`, 10+ lines neither; root font smoothing.
- C-N2 line length <80 chars (Anthropic); verify Chinese card text at 390px.
- C-N3 CORRECTION to §4C "mono dose/time labels": Anthropic lists mono data labels as template
  chrome. Changed: dose/time labels use body font + tabular-nums, not mono.
- D-N1 bans (Anthropic): no single-word title emphasis (e.g., coloring one character of a disease
  name); no mid-dot meta lines ("护理 · 3 分钟 · 初级"); no "WORD — fragment" title style; no →
  on links/buttons (use words).
- D-N2 no invented brands inside illustrations (stageshow brands, transferred to illustration
  prompt constraints): devices drawn generic and unbranded; no invented brand logos/trademarks;
  source attribution uses real names only, no fake badges.

Color additions:
- E-N1 ink cap (stageshow five inks + one accent): grey scale capped (ink + at most 2–3 greys);
  no new grey tokens; of the 10 locked tokens, 5 are kind accents — no more added.
- E-N2 shadows tokenized (Make Interfaces): shadows as layered tokens; borders carry
  structure/state; §4's `0 2px 8px` cap kept.

Layout additions:
- G-N1 URL reflects state (Vercel): filter/open card in URL hash, deep-linkable; destructive
  actions (clear progress) need confirm or undo.
- G-N2 drag alternative (Vercel, conditional): any future drag must ship with a tap alternative.
- G-N3 mobile baseline (Emil): search input 16px (no iOS auto-zoom); 100dvh/100svh;
  tap-highlight transparent; touch-action manipulation; overscroll control; safe-area env; never
  disable zoom.
- G-N4 images reserve aspect-ratio (Vercel): illustration frames reserve ratio, no layout shift.
- G-N5 boxed-failure diagnosis (stageshow, transferred): no "desktop layout shrunk" boxes on
  phones; compact is a second design.

Copy additions (English rules govern English strings only; Chinese stays under qu-ai-wei):
- K-N1 CTA states what will happen (Anthropic): "查看步骤" not "了解更多"; one name per thing
  throughout (no alternating 血压计/血压仪）; errors give direction, not emotion.
- K-N2 no difficulty promises (Vercel writing, transferred): no 轻松/简单/快速 — for medical
  procedures these are factual claims; write the steps only.
- K-N3 spec-sheet voice warning (Vercel writing): card backs write actions, not feature lists;
  no summary-transition closers (consistent with §4K, adds the spec-sheet form).
- K-N4 cited numbers (Vercel writing): vague quantifiers need cited numbers — consistent with
  R12, adds "quantifier" as a check point.
- L-N1 boundary clarification: Vercel's Title Case headings and never-em-dash govern English
  strings only; Chinese heading case and dash rules stay under qu-ai-wei (§3.4 unchanged).

Process additions:
- M-N1 review format upgrade (Emil + Make Interfaces + stageshow): fresh-eyes review judges from
  screenshots, each finding cites a frame file, ranking framing→hierarchy→motion→polish, first
  question "could this be any product in the category?"; findings table + Block/Approve verdict;
  remedy ladder delete→reduce→easing→origin→interruptible→GPU→asymmetric→polish→a11y; include a
  rejected-candidates section.
- M-N2 break testing in the gate (Emil): worst-case real data (overlong disease names/labels) at
  320px and 200% zoom; numbers/dates never truncated.
- M-N3 two-pass flow (Anthropic): plan/review pass (ASCII wireframe + token list) before build;
  screenshot critique mandatory.
- M-N4 Finish distinction (current uizze): handoff distinguishes code inspection from visual
  verification; render checks must include user-reported failing sizes.
- M-N5 direction-doc format (Emil learn-taste): DESIGN.md entries carry date + user's own words;
  never invent a why, mark inferences as inferred.
- M-N6 footnote correction to §3.9: current uizze evidence policy matches plain reporting; §3.9
  resolution unchanged, but the "old policy" footnote now reads "exists only in the
  awesome-copilot old snapshot".

### 8.3 Conflicts with locked directions

1. TCG flip+tilt vs motion rules — no head-on conflict, 3 tightenings: Emil's frequency gate
   (flip is low-frequency, earned) and stageshow's "earn tilt" both support the §3.1 one-mechanism
   resolution; new constraints are interruptibility (I-N3), origin-aware fly-out (from the hub
   card), hover gating (I-N10). Spring: §4J's ban narrows per I-N7; default unchanged (ease-out).
2. Brand green #255A41 / locked tokens vs token-count arguments — already resolved: Anthropic's
   4–6 hex and stageshow's five-ink-plus-accent do not mean deleting tokens; the 5 core + 5 kind
   accent structure stays, resolution is no new tokens (E-N1). Make Interfaces adds: illustration
   frames must not use brand-green strokes. No other conflict.
3. ChatGPT infographic illustrations vs sources — no conflict, 2 new constraints: Anthropic has
   no "no AI images" rule (that was taste-skill's; §3.8 unchanged); stageshow bento's "never pass
   a CSS/SVG scene off as a photo" transfers to — illustrations must read as illustrations at a
   glance, not photos (locked style already satisfies this); stageshow brands rule adds — devices
   drawn generic/unbranded, no invented brand logos (D-N2), to be written into illustration
   prompts. uizze ui-taste's "Image first, then implement" NOT adopted: direction and tokens are
   locked and the app is already built; that workflow would add a useless step.
4. No-invention medical copy vs sources — zero conflict, all same-direction: Vercel writing
   (cited numbers, no difficulty claims, bold only for key facts), Anthropic (one name throughout,
   errors give direction), Emil learn-taste (never invent a why, mark inferences), stageshow
   (real strings/real numbers, say it once) all align with 信息守恒. Boundary: Vercel's English
   banned-word/punctuation rules do not transfer mechanically to Chinese (§3.4 unchanged).
5. New risk flag (not a conflict): Anthropic cluster 1 = warm cream + serif + terracotta —
   Underwing's Crane reference (warm base + serif titles) resembles that cluster on its own;
   differentiation must ride on the TCG mechanism + locked green + real content and illustration
   style, not on palette alone. Review's first question (M-N1) exists for this.

### 8.4 Not accessed (plainly)

1. emilkowalski/skills: `animate-expo` (React Native) and `write-swift` (Swift 6) skimmed by
   title only — irrelevant to a single-file Web App; `ask-sonner` header only, API.md prop table
   unread (toast is not an Underwing need).
2. vercel-labs/agent-skills: `vercel-optimize` skill unread — outside the post's "Web Design
   Guidelines" item; the zip contains only the same SKILL.md.
3. anthropics/skills: the other 19 skills unread — scope-limited by task.
4. benjitaylor/skills: 71 example folders listed, not read individually; kit source spot-checked
   only (`ease.ts`, `reduced-motion.ts`, `stage.tsx` headers); scripts surveyed by header
   (`film-checks.mjs` 2120 lines not read in full); `teaching/` spot-checked one file header (rest
   via teaching.md descriptions); `products.md` 16 product studies unopened.
5. uizze.com: homepage JS-heavy, only hero + price metadata captured, no playbook text; current
   `craft.md`/`overdrive.md` and current playbook texts not read (comparison via SKILL.md router
   mirrors + search summaries); `github.com/uizze/uizze-mcp` clone failed (auth); paid MCP's 800k
   screen library unverified, no account; preview MCP `check_ui_slop` not called.
6. X post's 46 replies still unchecked (login required) — carried from §7.
7. No live-browser verification — same limitation as §5.8.
