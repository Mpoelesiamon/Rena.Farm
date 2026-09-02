# Rena Farm — Public Website UI/UX Guidelines

> How the public website (renafarm.co.ke) looks and behaves. This is a marketing site — different priorities than the management dashboard (`RENAFarm.Analysis.site-FrontEnd.`), which has its own separate guidelines. If you're editing an HTML page, adding a section, or wiring up a new dynamic block, this is the check-list.

Last reviewed: 2026-09-03

---

## 1. What this site is for

The public website exists to answer four questions for a first-time visitor:

1. **What does Rena Farm produce?** — livestock, fodder, dairy, poultry
2. **How do I buy?** — the enquire → visit → deliver / pickup → pay flow
3. **Where are they and who are the people?** — location + team credibility
4. **Can I trust them?** — awards, certificates, testimonials, gallery

Everything on the site serves those four questions. If a section doesn't, it doesn't belong.

Secondary purpose: the site hosts a small client portal (`portal.html` → `login.html` → `register.html`) for repeat buyers to see their orders. Kept minimal — the management dashboard is where staff work.

## 2. Brand palette

Values live in `css/styles.css` as CSS custom properties. Use `var(--f-…)`, never raw hex.

| Token | Hex | Use |
|---|---|---|
| `--f950` | `#071E07` | Deep green — heading text, nav bar background, hero overlays |
| `--f900` | `#0D330E` | Primary CTA on hover |
| `--f700` | `#2D531A` | Primary accent — CTAs, section eyebrows, key stats |
| `--f500` | `#7CB548` | Sage — active nav states, small highlights |
| `--f300` | `#7CB548` | Same sage, used for hairlines and card borders |
| `--f100` | `#E8F2DE` | Subtle wash for zebra rows / callout backgrounds |
| `--f50` | `#F5FAF0` | Lightest tint — hero background sections |
| `--gold` | `#C5972B` | Award badges, "Featured" ribbons. Never for primary CTAs. |
| `--ivory` | `#FAF8F2` | Warm off-white for content sections (matches the paper aesthetic of our proposals + PDFs) |
| `--charcoal` | `#3A2E17` | Body text on light backgrounds |

**Rules**

- One accent per screen. The Rena forest green (`--f700`/`--f900`) does 90% of the emphasis. Gold appears only on awards and premium tags.
- Two backgrounds: warm ivory `--f50`/`--ivory` for content sections; dark `--f950` for nav and footer. Alternate them to create rhythm down the page.
- Photography-first — brand green is a frame around photos, not a wash over them. Don't overlay dark green tint on hero images unless the photo demands it for text legibility.

## 3. Typography

**Font stack (loaded via Google Fonts in every `<head>`):**

- **Display:** `Playfair Display` — headings, hero copy, section titles. Weights 400 / 600 / 700.
- **Body:** `Inter` — everything else. Weights 400 / 500 / 700.

**Scale** (use these; don't invent):

| Purpose | Size / weight | Notes |
|---|---|---|
| Hero headline | 44–56 px / Playfair 700 | Two lines max; use `text-wrap: balance` |
| Section title | 28–34 px / Playfair 600 | Sentence case; not ALL CAPS |
| Eyebrow (above section title) | 11 px / Inter 700 uppercase, `letter-spacing: 0.18em` | Gold or forest — never both |
| Body large | 18 px / Inter 400 | Hero subhead, key intro paragraphs |
| Body | 15–16 px / Inter 400 | Everything else |
| Small / caption | 12–13 px / Inter 400 | Image captions, footnotes |
| Nav item | 13 px / Inter 500 uppercase, `letter-spacing: 0.1em` | The nav is quiet, not shouty |
| Button | 14 px / Inter 700 | Never smaller than 14 px |

**Rules**

- Line-height: 1.15 on headlines, 1.6 on body text.
- Line-length target ~65 characters for prose. If a paragraph runs edge-to-edge on a wide screen, wrap it in a `max-width: 65ch` container.
- Never use both Playfair and Inter on the same line. Headline = Playfair; the whole headline stays Playfair.
- Reserve italic Playfair for pull-quotes and testimonials. Not for emphasis in body text (use bold Inter for that).

## 4. Layout patterns

The site is a stack of self-contained sections, each 600–900 px tall, alternating background tones for rhythm. Every section should read on its own — a visitor lands on the middle of the page, still gets it.

### Section anatomy

```
[ optional eyebrow "AWARDS" ]
[ section title ]
[ short intro sentence — 1-2 lines max ]
[ the content: cards / grid / carousel / gallery ]
[ optional CTA button ]
```

### Grid rules

- Content max-width: `1200px` for desktop, centered
- Section padding: `80–120 px` vertical on desktop, `48–64 px` on mobile
- Card grids: 3 columns on desktop, 2 on tablet, 1 on mobile — via CSS `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- Never let a section fill edge-to-edge — always some breathing room

### Nav bar

Fixed to top, `--f950` background, height 64 px desktop / 56 px mobile. Compresses to a hamburger below 768 px. See `js/layout.js` — it's injected on every page; don't hard-code nav in individual HTML files.

### Footer

4-column grid on desktop, single column on mobile. Injected by `js/layout.js`. Contains: contact info, quick links, socials, credit line.

## 5. Buttons

Two intents, one style each. Never invent a new colour.

**Primary** — for the main call-to-action on a section (buy, enquire, book visit)

```css
background: var(--f700);
color: white;
padding: 14px 28px;
border-radius: 12px;
font-family: Inter;
font-weight: 700;
font-size: 14px;
letter-spacing: 0.02em;
transition: background 150ms;
```
Hover: `background: var(--f900)`.

**Secondary** — for less-important actions on the same section (learn more, download, view all)

```css
background: transparent;
color: var(--f700);
border: 2px solid var(--f300);
padding: 12px 26px;   /* -2 to compensate for the border */
border-radius: 12px;
font-weight: 700;
```
Hover: `background: var(--f50)`.

**Rules**

- Never more than one primary button visible in a single section
- Never more than three total buttons in the hero (usually one primary + one secondary is enough)
- Buttons say exactly what happens: "Enquire about Boma Rhodes", "Book a farm visit", "Call us". Never "Submit" or "Click here".
- Minimum touch target 44 × 44 px on mobile — the padding above delivers this.

## 6. Images + gallery

The public site is photography-first. The farm is beautiful; the site is a portfolio for it. Never use stock imagery.

- **Format:** WebP with JPEG fallback via `<picture>` where the client's a JPEG-only browser (rare — but Vimexx serves it, don't rely on Vercel image optimisation)
- **Sizes:** cover images ≤ 1600 px wide; grid thumbnails ≤ 800 px wide
- **Compression:** hand-run through `squoosh.app` (ClickUp `869dwerce` tracks batch optimisation). Target ≤ 300 KB per photo, ≤ 100 KB for thumbnails.
- **Lazy loading:** every below-fold `<img>` gets `loading="lazy"` (ClickUp `869dwercw`)
- **Alt text is not optional.** Describe the subject: "Nathan holding a Dorper ram in the barn" — not "IMG_4523.jpg" and not "photo of animal". If truly decorative, `alt=""` (empty string, not missing).

Photos in the Gallery section pull dynamically from Supabase Storage bucket `website-media` via `js/supabase-client.js` — new photos uploaded from the management dashboard appear here automatically.

## 7. Forms — enquiry + contact

Two live forms: `contact.html` (general enquiry) and `enquire.html` (product-specific).

**Rules**

- Every input has a `<label>` right above it — never placeholder-only
- Placeholders are examples, not repeats of the label: label `Phone`, placeholder `+254 7… …`
- Required fields marked with an asterisk in the label; also `required` attribute on the input for browser-level validation
- On submit: disable the button, swap text to "Sending…", show a green success message on completion. Never leave the user wondering.
- Success message stays visible for 6 seconds, then fades. Reset the form after.
- Failure: red inline banner with the reason ("Couldn't reach the server — try again in a moment") and a Retry button. No modal dialogs, ever, on the public site.
- Never `alert()` on the public site — feels like a virus warning.

## 8. Dynamic content sections

These sections read from Supabase directly (no Next.js — vanilla JS + `js/supabase-client.js`):

- **Product Listings** (`products.html`) — pulls from `product_listings` where `listing_status IN ('on_sale','featured')`
- **Livestock for sale** (`livestock.html`) — pulls from `animals` where `listing_status IN ('on_sale','featured')`
- **Gallery** (`gallery.html`) — pulls from `gallery_items`
- **Events & Awards** — future (see `docs/UI_GUIDELINES.md` in the management repo for the source-of-truth CMS)
- **Testimonials / Certificates / Partners** — future

**Rules for dynamic sections**

- Show a **skeleton loader** while fetching — never a blank space
- Show an **empty state** if the query returns zero rows: e.g. "No animals listed at the moment. [Contact us] if you're looking for something specific." — never leave the section empty and confusing
- Show an **error state** if the Supabase call fails: a small friendly message, and (crucially) log the error to console for debugging. Never break the page.
- **Cache-bust** — dynamic HTML lands in browser cache. Include a `no-cache` meta or version query on the fetch URL if you notice stale content.

## 9. Responsive behaviour

Same non-negotiables as the management guidelines, adapted for a marketing site:

- **375 px** minimum viewport tested; **768 px** tablet break; **1024 px** desktop; wide screens (`>=1440`) show wider cards but content doesn't stretch beyond `1200px` container.
- Nav collapses to hamburger below 768 px (handled by `js/layout.js`).
- Hero text scales fluidly with `clamp(28px, 5vw, 56px)` on the display headline — no jarring size jumps.
- Card grids reflow via `auto-fit, minmax(280px, 1fr)` — no fixed column counts.
- Every image is `max-width: 100%; height: auto;` — no fixed pixel widths that break on narrow screens.
- Never a horizontal scroll on the body. Wide content (rare — mostly tables or code) scrolls inside its container with an `overflow-x: auto` wrapper.

## 10. Accessibility non-negotiables

- Every `<img>` has `alt`. Decorative: `alt=""`.
- Every icon-only button has `aria-label`.
- Every form input has a `<label>` (or `aria-label`).
- Colour is never the only carrier of information — a status is a label + colour, not just colour.
- Contrast: WCAG AA (4.5:1 body, 3:1 large text). Rena forest green on ivory meets this comfortably; watch out for grey-on-grey secondary text.
- Keyboard: every interactive element reachable via Tab, in logical order; focus ring visible.
- Skip-nav link at the top of every page: `<a class="skip-nav" href="#main">Skip to content</a>`.
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` — not a sea of `<div>`s.
- Respect `prefers-reduced-motion` — no scroll-triggered animations if the user has opted out.

## 11. Copy tone

Rena's voice is **warm, honest, competent**. Not corporate, not folksy, not aspirational-lifestyle.

- Write to a specific farmer or buyer, not a demographic
- Say what you sell in plain terms — "Dorper rams for breeding" — not "premium genetics for the discerning ovine investor"
- Numbers ground claims: "120 acres in Kajiado Central" beats "expansive farm operations"
- Include real names where you can — "Ask for Nathan on WhatsApp" beats "Contact our team"
- No superlatives without evidence — don't say "best" or "leading" unless you have an award pinned to it

## 12. SEO + metadata

- Every page has a unique `<title>` in the pattern: `<Page name> · Rena Farm · Kajiado Central, Kenya`
- Every page has a `<meta name="description">` — one sentence, 140–160 chars, mentions what the page is about + location
- OG image on every page: `<meta property="og:image">` pointing to a farm photo (not the logo alone)
- Canonical URL on every page — matters because we're deployed to two places (`renafarm.co.ke` and the Vercel preview URL)
- Structured data (`application/ld+json`) on the Location, About, and Products pages — LocalBusiness schema at minimum

## 13. What NOT to do

- Don't reach for a framework. This site is deliberately static + vanilla JS so it deploys via FTP to Vimexx without a build step.
- Don't add npm dependencies unless truly needed. Every dep is a supply-chain risk on a public site.
- Don't inline CSS/JS unless the fragment is < 200 chars. Everything else in `css/styles.css` or a `js/` file.
- Don't hard-code the nav / footer in HTML pages — `js/layout.js` owns them, edit there.
- Don't commit `Media/` or personal test files — see `DEV_GUIDELINES.md`.
- Never use `alert()` / `confirm()` / `prompt()` on the public site.
- Never use custom fonts beyond Playfair Display + Inter — the more fonts, the slower the load, the more anonymous the site looks.

---

## Quick reference

**One accent per section.** Playfair Display for headings, Inter for everything else.
**Photography-first.** Real Rena photos, WebP with JPEG fallback, lazy-loaded, alt text mandatory.
**Say what happens.** Buttons and copy in plain, specific language.
**Never crash on the visitor.** Skeleton → empty state → error state — all handled on every dynamic section.
