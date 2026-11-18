# Notes — UX, IA, local-first, measurement (read 2026-11-17, index)

## Progressive disclosure / onboarding / empty states
- Progressive disclosure: essentials first, deeper on explicit action; over-hiding buries critical info. https://quality.arc42.org/approaches/progressive-disclosure (citing NN/g)
- Contextual help > tutorials: NN/g via secondary — tutorials interrupt, don't necessarily improve performance, quickly forgotten; mobile tutorial skippers did at least as well, slightly faster. https://www.theafrodity.com/post/the-ux-of-onboarding-how-to-turn-new-users-into-engaged-ones — SECONDARY summary, treat as directional.
- Empty states: NN/g 3 jobs — communicate why absent, teach what belongs, direct path to task; don't show "no records" while loading. https://www.uxia.app/blog/empty-state-design ; http://umatechnology.org/empty-state-design-what-should-users-do-when-content-is-missing/
- Low-literacy health UX: anxiety reduces working memory; simplify 10th->6th grade improved comprehension >40% (JGIM study cited secondarily); icons ambiguous without labels. https://www.UXMATE-BLOG.COM/2025/11/28/how-to-design-health-apps-low-literacy-patients-actually-use/ — SECONDARY, numbers unverified primary.

## Icons
- NN/g Icon Usability: universal icons rare (home, print, search magnifier); text label must be present, visible at all times, don't rely on hover. https://www.nngroup.com/articles/icon-usability/ (updated 2024-01-29)

## Alert fatigue
- 85-99% of alarm signals call for no action (Joint Commission estimate via Halo); clinicians override 49-96% med alerts; habituation mechanism; tier, dedupe, reserve interruption. https://www.halo-lab.com/blog/alert-fatigue-in-healthcare
- 72-99% clinical alarms false; likelihood of accepting alert dropped 30% per reminder (study cited). https://www.atlassian.com/incident-management/on-call/alert-fatigue
- Remedies: cut false/low-value, tier severity, every alert says what + what to do. https://www.ux-guidelines.com/alarm-fatigue.html

## Facets / guided
- NN/g: filter excludes; faceted navigation = multiple filters comprehensively describing set; facets significantly more expensive, add interaction cost, confirm need first. Via https://www.fernandoux.com/en/wiki/techniques/filters-and-faceted-search/ ; https://hybrismart.com/2019/02/13/facet-search-the-most-comprehensible-guide-best-practices-design-patterns/
- GOV.UK: one question per page default, back link + heading + Continue; routing questions inside service, not complex eligibility upfront; task list for multi-task. https://www.gov.uk/service-manual/design/govuk-content-transactions ; https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ ; https://gov-cy.github.io/govcy-design-system-docs-v0/patterns/question_pages/

## Caregiver apps
- Invisible second user: caregiver piggybacks on patient account, shares logins, translates medical language; own identity/profile switching needed (in account-based apps — here: no-account analogue is named profiles/exports). https://www.zaid.design/portfolio/the-invisible-second-user
- Two experiences, one shared truth; default least intrusive; sharing visible both sides. https://dtailstudio.com/blog/designing-for-patients-and-caregivers
- Dovetail: calm predictable UX for exhausted caregivers, cut steps. https://www.ideinteractive.com/our-work/from-a-promising-prototype-to-a-caregiving-platform-built-for-real-families/
- Eunoia: event-based storage (infection/surgery/treatment with history), appointment-time retrieval. https://www.lucassemelin.com/en/cases/eunoia-care

## Spaced repetition
- Cepeda 2006 meta-analysis 317 experiments/839 assessments; spacing effect; testing effect Roediger & Karpicke; Dunlosky: practice testing + distributed practice high utility, rereading/highlighting low. Via https://www.stepgenie.app/blog/spaced-repetition-usmle-flashcards
- Anki SM-2 lineage, FSRS newer; systematic review: associations heterogeneous, mostly observational. https://link.springer.com/article/10.1007/s40670-026-02643-5
- Caution: evidence is largely declarative factual recall / medical students, NOT caregiver procedural skills under stress — transfer is open question.

## Gamification harms
- Streaks: guilt/shame, pressure; flexible goals + optional reminders healthier than shame-based streaks; engagement != effectiveness. https://www.gamificationhub.org/ethical-concerns-gamified-mental-health-apps/ ; https://uxpamagazine.org/ethical-ux-patterns-building-trust-without-manipulation/
- Meta-analysis 36 trials/10079: gamification +489 steps/day described as trivial (via secondary). Treat as directional.

## Local-first
- Ink & Switch 2019 essay coined term; 7 ideals: no spinners, not trapped on one device, network optional, seamless collaboration, Long Now, privacy/security by default, ultimate ownership/control. Primary hub: https://www.inkandswitch.com/local-first-software/ ; summary: https://www.offlineprotocol.com/learning/local-first/seven-ideals-of-local-first-software ; export to JSON/PDF as Long Now first step.
- Indenta example: IndexedDB + PWA offline, no account, P2P WebRTC sync, Markdown export; sync != backup. https://indenta.app/blog/local-first-note-taking

## Chinese search
- Chinese clinical synonyms: everyday text varies from nomenclature (synonyms/abbreviations/jargon/misspellings); terminology without enough synonyms inadequate; harder for Chinese due to absence of natural spaces. https://pmc.ncbi.nlm.nih.gov/articles/PMC5414139/ ; https://link.springer.com/article/10.1186/s12911-017-0455-z

## Trust / versioning
- HONcode principles: authority, complementarity (support not replace), confidentiality, attribution + date last modified, justifiability, transparency, financial disclosure, advertising separation. BUT program shut Dec 2022 — do not claim certification. https://openmd.com/guide/health-information-quality-seals ; archived principles https://webarchive.library.unt.edu/eot2008/20090508174648mp_/http://www.hon.ch/HONcode/Conduct.html
- Credibility checklist: who/wrote-reviewed, sources, currency/date, agreement with major orgs, privacy. https://www.tramelovixa.com/evaluate-online-health-information ; https://libguides.mssm.edu/blogs/levylibrary/How-to-Evaluate-a-Consumer-Health-Website

## Measurement / testing
- NN/g 5 users: model N(1-L)^n, L~31%, 5 users ~85% issues; start with 5, fix, test again; qualitative finds issues, quantitative needs ~20-40. https://www.nngroup.com/articles/5-test-users-qual-quant/
- Faulkner: 5 users found 55-95% depending on subset; 10 users min 80%, 20 users 95%. Via https://www.userlytics.com/resources/blog/why-10-participants-give-you-the-complete-ux-picture/ — variance matters.
- Plausible model (for hosted future only): no cookies/personal data, daily-rotated identifier, aggregates only. https://cdn.mattias.engineer/privacy-focused-web-analytics — INCOMPATIBLE with file:// + nothing-leaves-device promise if it phones home; cite as contrast, not recommendation for this build.
- SVG/icon system: define grid/stroke/corners/detail before expanding; reusable components + tokens (color/size), currentColor, decorative aria-hidden, icon-only needs name. https://futuramo.com/blog/icon-system-design-practical-guide/ ; http://umatechnology.org/how-to-build-a-scalable-svg-icon-system-for-your-web-app/
