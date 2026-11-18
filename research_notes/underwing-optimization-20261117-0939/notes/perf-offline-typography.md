# Notes — typography, motion, performance, offline (read 2026-11-17, index unless noted)

## Chinese typography
- Will Chan: Han fills 80-95% of em square; body line-height 1.75-1.8; 16px/640px column = 40 chars top of comfortable range; letter-spacing breaks grid, use 0; system stack, no webfont for Han. https://www.willchan.me/blog/typography-for-cjk-and-latin
- Typotheque: CJK leading ~1.7. https://www.typotheque.com/articles/typesetting-cjk-text
- Bob Tung: line-height 1.5-2.0, 1.7em practical; no letter-spacing for body. https://bobtung.medium.com/best-practice-in-chinese-layout-f933aff1728f
- WCAG 1.4.8 AAA: <=80 chars, 40 for CJK; Digital.gov >=16px, 45-75 chars English. Via http://umatechnology.org/make-text-easier-to-read-by-balancing-font-size-and-line-length/
- Older adults: min 16px, recommend 18px body, 150% line spacing (Latin-centric). https://en.gehirngerecht.digital/good-ui-ux-design-for-older-people/ ; https://www.toptal.com/designers/ui/ui-design-for-older-adults ; presbyopia affects most >40 (secondary, numberanalytics).

## Reduced motion
- prefers-reduced-motion: gate decorative motion behind no-preference; keep informative motion, remove large translate/scale/3D; vestibular triggers: parallax, zoom, rotation. https://dev.to/parsajiravand/youre-animating-for-everyone-prefers-reduced-motion-fixes-that-2ond ; https://www.laarpi.com/guides/accessible-motion ; WCAG 2.3.3 AAA animation from interactions, 2.2.2 pause/stop/hide, 2.3.1 flashes <=3/sec.

## Performance budgets / Core Web Vitals
- Web Almanac 2025: median home page 2.86MB desktop / 2.56MB mobile; images 1058KB/911KB most bytes. https://almanac.httparchive.org/en/2025/page-weight
- <1MB mobile home pages 57% pass all CWV vs 30% at 5MB+. Via https://ieudora.com/2026/09/28/why-a-fast-website-matters-more-than-ever/ and https://www.ecomtoolkit.net/blog/ecommerce-performance-statistics-page-weight-budget-by-template-2026/
- CWV good: LCP <=2.5s, INP <=200ms, CLS <=0.1 at 75th percentile; INP replaced FID 12 Mar 2024. https://digitalmatters.me/search-engine-optimization-seo/core-web-vitals/

## Images
- web.dev choose format: vector for geometric; WebP/AVIF generally better compression, use with JPEG/PNG fallback via picture; text in images not selectable/searchable. https://web.dev/articles/choose-the-right-image-format?source=mytechmint.com
- Sizes (secondary, directional): WebP 25-35% smaller than JPEG; AVIF 40-50% smaller than JPEG, 20-30% smaller than WebP; AVIF encode slow, wins less at tiny sizes. https://www.fileshrinkr.com/blog/best-image-format-for-websites ; https://www.zyff.app/guides/webp-vs-avif-vs-jpeg-vs-png
- Base64: exactly +33.3% (3 bytes -> 4 chars); gzip does not recover it for already-compressed images. https://web.lumintu.workers.dev/read-https-dev.to/toolstead/base64-overhead-why-data-uris-make-files-33-bigger-406c

## Lazy rendering
- MDN content-visibility: auto skips layout/paint offscreen, stays in DOM + a11y tree + find-in-page/tab order; pair with contain-intrinsic-size. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
- Support notes (secondary, check before shipping): Chrome 85+, Firefox 125+, Safari 18. https://www.network-priority.com/core-browser-loading-mechanics-priority-queues/lazy-loading-and-viewport-driven-fetching/

## PWA / file://
- Service worker only HTTPS/localhost; file:// will not register SW; PWA needs manifest+SW+HTTPS. https://fit.neu.edu.vn/en/post/service-worker-va-pwa-xay-dung-ung-dung-web-hoat-dong-ngoai-tuyen ; https://www.ggames.mobi/blog/2026/03/23/pwa-without-a-framework/
- file:// localStorage: behavior inconsistent; Firefox blocks with SecurityError, Chrome per-file/per-origin variations, Safari blocks — SECONDARY, conflicting details, MUST test live on target browsers. https://www.xjavascript.com/blog/javascript-html-storage-options-under-file-protocol-file/ ; https://www.xjavascript.com/blog/does-localstorage-in-firefox-only-work-when-the-page-is-online/ ; MDN note via WebView article: file: behaviour undefined.
- Safari 7-day: MDN primary above; secondaries agree script-writable storage deleted after 7 days Safari use without interaction, scrolling doesn't count. https://kukie.io/blog/safari-itp-cookie-banner-reappears

## Print
- @media print, break-inside:avoid for cards/figures/tables, break-before:page sparingly, hide chrome, expand links. https://thevalleyofcode.com/css-printing/ ; https://www.mironsoft.de/en/blog/css-print-stylesheets-modern-print-layouts ; https://www.pdf4.dev/blog/css-print-styles-pdf-guide
- Caveat: element taller than page must split; excessive avoid creates white gaps.
