# Notes — standards & health patterns (read 2026-11-17)

## MDN Storage quotas and eviction criteria — index + browser_open
URL: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- localStorage 5MiB, sessionStorage 5MiB per origin, 10MiB total; QuotaExceededError, try/catch.
- Best-effort default; persistent only evicted by user choice; persist() via navigator.storage.persist().
- Chrome origin up to 60% disk; Firefox best-effort smaller of 10% disk / 10GiB group limit, persistent up to 50%; Safari browser apps ~60% disk (macOS14/iOS17+).
- Eviction: storage pressure LRU, least-recently-used first, skips persistent; whole origin deleted at once.
- Safari: proactively evicts when cross-site tracking prevention on, no interaction in last 7 days of browser use, script-created data deleted; server cookies exempt.
- Private browsing: different quotas, data usually deleted at end.

## MDN persist/estimate/persisted — index
URLs: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist ; https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
- persist() returns true/false, browser may or may not honor; secure context only in some/all browsers; opaque origin can throw TypeError.

## NHS care cards — browser_open
URL: https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care
- 3 cards: non-urgent blue, urgent red, emergency red+dark grey. Avoid too many; reassure not scare. Order by likelihood/seriousness.
- Heading = 1 clear CTA "Call 111 if:" / "Speak to a GP if:" + bullets; keep brief/specific; hidden text for screen readers; updated Aug 2026; retested 2026.

## NHS warning callout — VERIFIED LIVE in research browser 2026-11-17
URL: https://service-manual.nhs.uk/design-system/components/warning-callout
- Avoid >2 callouts per page: "We want to reassure people, not to scare them." Short clear heading, concise specific self-contained. Headings help scanning + users who cannot distinguish by colour; better than icons/exclamation marks. Contrast 11.92:1 / 13.69:1. Updated June 2026.

## W3C APG Disclosure Card — browser_open
URL: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-card/
- Card = article + nested disclosure button, aria-expanded/aria-controls, aria-labelledby combines heading+"Details". Do NOT nest whole rich summary in button (cumbersome label, invalid HTML). Whole-card focus outline when button focused, chevron matches state, suppress toggle on text selection / nested focusable, animation suppressed for reduced motion/high contrast.

## Flip card WCAG — index
URL: http://me2accessibility.com.au/flip-card.html
- Relevant: 2.1.1 keyboard, 4.1.2 name/role/value, 1.4.13 content on hover/focus (Esc to return), 2.4.7 focus visible; hidden side must not take focus unless flip reveals it; button-trigger with aria-expanded, back display:none when hidden.

## WCAG 2.2 — index (secondary summaries, consistent)
URLs: https://www.audioeye.com/gb/post/wcag-22/ ; https://www.a11yflow.dev/blog/color-contrast-wcag-developer-guide
- 2.2 published 5 Oct 2023, 9 new criteria. 2.5.8 target 24x24 AA; 2.4.11 focus not obscured; 2.4.13 focus appearance AAA 3:1 + 2px perimeter.
- Contrast AA 4.5:1 normal, 3:1 large (>=24px or 18.66px bold), 3:1 non-text 1.4.11; AAA 7:1 / 4.5:1.
- Touch: Apple 44x44pt, Material 48x48dp, WCAG AAA 44x44. Sources: https://www.html-hunter.com/touch-target-size-guidelines-how-big-should-mobile-buttons-be-in-2026/ ; https://scalecomposer.com/learn/spacing/touch-targets/

## CDC Clear Communication Index / health literacy — index
URLs: https://www.cdc.gov/health-literacy/php/develop-materials/guidance-standards.html ; https://pmc.ncbi.nlm.nih.gov/articles/PMC5114169/
- Index: 20 scored items, 7 areas incl main message+call to action, language, information design, numbers, risk; 90% threshold for clear communication in PMC study; portal scored 72%.
- AHRQ universal precautions: assume all may have difficulty. Via https://libguides.massgeneral.org/communication
