# Elsen — Product Requirements Document

**Product:** Elsen, a static website where you open a pack and get five collectible cards of the
dog Elsa. Each card pairs one supplied photo with its bilingual, photo-specific name, mood and
caption; optional `/10` values are manually matched jokes, visibly marked as imaginary.
**Audience for this document:** the owner, plus whoever helps build, design, write and ship it.
**Status:** v1 built and running locally; awaiting real photos and the upload to the IONOS domain.
**Version:** 2.0 · 2026-10-31

**Assumptions stated up front** (they shape everything below and can be overwritten by the owner):

1. The site is personal and private by default: friends and family get a link, search engines get
   nothing.
2. Hosting is the existing IONOS webspace with FTP and the webspace explorer, plus PHP if the host
   offers it. No build pipeline, no database, no service worker.
3. Photos arrive by FTP, through the IONOS webspace explorer, or later through a visitor upload.
   Dropping the file and reloading the page stays the whole workflow.
4. **German is the default language; English is a full second language, switchable in the header.**

---

## 1. Problem

Elsa's photos pile up on a phone and in a camera roll, and nobody outside the household ever sees
more than the two that get sent in a chat. Sending photos one by one is work, and it always shows
the same three pictures. Sharing a gallery link asks too much of a family group: it needs an
account, an app, or the patience to scroll.

There is also no moment. A folder of photos is browsed; a pack is *opened*. The photos want one
reason to be looked at again, and the family wants one reason to look.

**Problem statement:** *"I have hundreds of Elsa photos that nobody gets to enjoy, because sharing
them is either work for me or boring for them."*

**Why a pack:** five cards at once gives a small payoff per click and something to keep and compare,
without pretending to be a product. Each supplied photo gets its own title and caption, so it becomes
"my" card rather than the fourth picture in a folder.

---

## 2. Personas

| Persona | Who | Situation | What they want | Device |
| --- | --- | --- | --- | --- |
| **Der Sammler / The collector** (owner) | Elsa's human, takes most of the photos | Has hundreds of photos, an IONOS domain, FTP access and no wish to run a server | Get photos in front of people with as little admin as possible, and not expose them publicly | Mac, desktop |
| **Die Oma / The grandparent** | Family member, German-speaking, not technical | Gets a link in a chat, taps it | See a picture of the dog, no login, no fuss, big text | Phone, tablet, sometimes a desktop |
| **Der Freundeskreis / The friends** | Mixed German and English speakers, some abroad | Shares the link around, compares which cards they pulled | Something fun to open a few times, and to send on | Phone |
| **Der Gast mit Handicap / Guest using assistive tech** | Any visitor using a screen reader, keyboard or reduced-motion setting | Lands on the page | Get the same content without the pack being a black box | Any |

---

## 3. User stories

**Core**

- As a visitor, I want to tap one big thing and get five cards at once, so that I do not have to
  decide where to look.
- As a visitor, I want a pack to hold cards I have not had yet, so that opening another one is worth
  it.
- As a visitor, I want each card to say something silly and specific, so that there is a reason to
  laugh and to send it on.
- As a visitor, I want at least one card in every pack to shine, so that opening a pack feels like a
  find.
- As a visitor, I want the same photo to keep the same rarity and the same text, so that my card
  stays my card.
- As a German visitor, I want everything in German without choosing anything, because that is the
  language of the household.
- As an English-speaking visitor, I want to switch to English with one tap, and not have to switch
  again next time.

**Sharing**

- As a visitor, I want to send the exact card I just pulled to someone else, so they see the same
  one.
- As a visitor, I want to save a photo to my phone, so I can keep it.

**Owner**

- As the owner, I want to drop new photos into one folder and have them become cards, so keeping the
  site alive costs minutes per month.
- As the owner, I want to write my own words for a card only when I feel like it, so the site works
  when I have not.
- As the owner, I want the photos not to be indexed or listed, so Elsa stays inside the family.

**Edge cases**

- As a visitor with JavaScript off, I want to know why nothing opens.
- As a visitor with reduced motion on, I want the five cards without the reveal animation.
- As a visitor, I want to look through every card in the binder if I prefer browsing over opening
  packs.

---

## 4. Functional requirements

### 4.1 Core (P0 — must ship in v1)

| # | Requirement | Done when |
| --- | --- | --- |
| F1 | Opening the pack produces five cards at once (all of them, if there are fewer photos) | One click fills the drop row with five cards |
| F2 | Every supplied card shows its photo-specific bilingual name, mood and caption | All ten current images use their explicit overrides; missing real-photo captions fall back to neutral copy, not invented activities |
| F2a | Optional `/10` values are explicitly imaginary and matched to the depicted photo | A visible "Fantasiewerte · nur zum Spaß" / "Imaginary stats · just for fun" label precedes them |
| F3 | A photo's rarity belongs to the photo: it comes from its own id, not from the shuffle | The same photo is always häufig, selten or holo — after a reload, after another pack, and in a deep link |
| F4 | Every pack holds at least one rare or holographic card | If the draw is all commons, one card in that pack is promoted to holographic |
| F5 | No card appears twice inside one pack | With five cards, five different photos come out |
| F6 | Unseen cards come first; every card comes up once before the set starts over | Opening packs walks through the whole binder; when it starts over, it is shown in the progress line and announced |
| F7 | German is the default on first visit | `<html lang="de">` and German card text before any interaction |
| F8 | `DE` / `EN` toggle switches every visible string immediately | Headline, buttons, card names, sentences, moods, rarity labels, aria labels, `<title>`, progress and `og:locale` all switch |
| F9 | Language choice persists and is overridable by URL | Stored in `localStorage`; `?lang=de` beats a stored English; `?lang=en` beats the German default |
| F10 | Photo overrides for name, sentence, mood and alt text are bilingual | Switching language preserves the same pictured moment and joke |
| F11 | Binder grid below the pack with every card as a reachable button, openable one by one | Each tile has an accessible name and says whether it has been seen |
| F12 | Deep link to one card | `?photo=<id>` opens that card big, in the right language |
| F13 | Progress display | "Du hast 3 von 24 gesehen" / "You have seen 3 of 24", with a progress bar |
| F14 | Card source resolution | PHP live list first (`photos.php?list=1`), otherwise `photos.json`, otherwise a friendly empty state |
| F15 | Empty state in the right language | Tells the owner what to do, not "error" |
| F16 | Privacy defaults | `noindex`, `robots.txt`, directory listing off, no script execution in `photos/` |
| F17 | Mobile layout without horizontal overflow | No overflow at 320, 390, 414, 640, 1280, 1920 |

### 4.2 Secondary (P1 — shipped in v1 because they were cheap)

| # | Requirement |
| --- | --- |
| F18 | Big card dialog with the printed card, plus save, share and "another pack" |
| F19 | WebAudio rip when the pack opens, a tick per card, a chime for rare and holographic cards, and a sound toggle that remembers the choice |
| F20 | Keyboard support: `P` opens a pack, `←` / `→` moves through the cards, focus returns to the pack button when the dialog closes |
| F21 | Live region announcements for the opening, the five card names, the restart and the language switch |
| F22 | `prefers-reduced-motion` support: the five cards appear at once, no foil movement, no confetti |
| F23 | Optional per-photo overrides from `photos/captions.json`: caption and alt text, and the card's name, sentence, mood and rarity |
| F24 | Thumbnails: generated locally into `photos/thumbs/`, or built on demand by PHP into `photos/.cache/` |
| F22b | **HEIC support:** iPhone HEIC and HEIF files are listed, converted once to JPEG in `photos/converted/` (macOS `sips` locally, Imagick on the server) and converted in the visitor's own browser when the server cannot (`assets/vendor/heic2any`, loaded only for HEIC files). From the owner's side nothing changes: drop the file and reload. |
| F25 | Share via `navigator.share` with clipboard fallback, and an absolute OG image for link previews |
| F26 | Manual "Von vorn / Start over" to clear everything the visitor has seen |

### 4.3 Nice to have (P2 — deliberately not built)

| # | Idea | Why it waits |
| --- | --- | --- |
| F27 | Upload photos through the browser into a moderation inbox, with bulk approve and delete behind a shared code | **Now wanted for round two**; needs PHP and an approval page, see §10.4 |
| F28 | Comments or reactions per card | Needs storage and moderation |
| F29 | Slideshow / autoplay through the binder | Opening packs and the grid already cover browsing |
| F30 | Weekly email or RSS with one card | Adds a server-side cron to a static site |
| F31 | Sorting, tagging, favourites, trading between visitors | Needs a data model; the bank of names covers the storytelling for now |
| F32 | Prettier photo names than filenames | Ids are stable slugs; good enough for a family link |
| F33 | Other languages beyond German and English | No audience for it yet; the copy deck is already structured for more |

---

## 5. Non-functional requirements

| Area | Requirement |
| --- | --- |
| **Hosting** | Static files on IONOS via FTP or the webspace explorer; PHP optional and optional-only. Nothing needs to be built on the server. |
| **Compatibility** | Current Safari, Chrome, Firefox, Edge; iOS Safari and Android Chrome. Graceful, understandable degradation without JavaScript. |
| **Performance** | No layout shift on load, no blocking third-party requests, thumbnails lazy-loaded in the binder, display copies capped at 720 px. Feels instant on mobile data. |
| **Accessibility** | WCAG 2.2 AA target: keyboard operable, visible focus, `aria-pressed` on toggles, live regions, reduced motion honoured, readable contrast, German and English declared per element where it matters. |
| **Bilingual** | UI copy lives in `assets/js/app.js` (`COPY.de`, `COPY.en`); supplied-photo descriptions live in `photos/captions.json`; the bank is only fallback/demo content. German is what a first-time visitor sees. |
| **Privacy** | No cookies, no analytics, no third-party embeds, no external fonts or CDNs. Local storage only, on the visitor's device. Photos are not indexed or listable. |
| **Security** | No executable code in `photos/`; PHP resolves real paths inside `photos/` only and refuses anything that is not an image; `X-Content-Type-Options: nosniff`, `Referrer-Policy`, no directory indexing. |
| **Maintainability** | Five files carry the product: `index.html`, `assets/css/style.css`, `assets/css/cards.css`, `assets/js/app.js`, `assets/js/card-bank.js`. Everything else is a helper or generated. Adding a photo is a file drop. |
| **Design** | Dark velvet gallery, soft overhead spotlight, pearl-metal card frames, indigo-black plates, layered iridescent foil, diagonal glare and procedural glitter. Elsa's photographs remain the art. Rarity changes the foil strength, not the photo. The pack tears open in the center of the viewport and cards reveal one at a time. |
| **Tone of voice** | Family-and-friends register in both languages. German card text addresses the reader as *du*, never *Sie*. No marketing voice, no invented numbers, no testimonials, no exclamation-mark confetti. English is plain and warm. |

---

## 6. Success metrics

There is no analytics and there will not be. Success is judged by direct observation and by the
owner's own counters.

| # | Metric | Target | How to measure |
| --- | --- | --- | --- |
| M1 | It ships and stays up | Public URL opens without an error, 100% of manual checks after each upload | Manual load on desktop and phone |
| M2 | A pack is complete and fair | 5 cards, none repeated inside the pack, at least one rare or holographic | `npm run qa` |
| M3 | A card keeps its identity | The same photo retains its bilingual caption, stable rarity and manually assigned imaginary play values | Reopen it by deep link in either language |
| M4 | Both languages are complete | 0 untranslated strings after switching; German default confirmed every session | Manual pass plus `npm run qa` assertions |
| M5 | Nobody gets stuck | Every person who receives the link opens a pack unaided | Watch 3–5 people once, do not explain |
| M6 | Cards actually get opened | More than one card out of the five gets opened big | Ask which card they liked; count the "gesehen" marks when someone hands the phone back |
| M7 | Adding photos is cheap | A new photo is a card within 5 minutes of the first attempt, by file drop only | Owner times themselves once |
| M8 | Nothing leaked | No search result for the domain after one month; no `/photos/` listing | Search once, try `yourdomain/photos/` |
| M9 | Accessibility floor | Keyboard-only and screen-reader spot check can open a pack and read a card | Manual check with VoiceOver or similar |

---

## 7. Scope and constraints

**In scope (v1, built)**

- Static one-page site: pack, five-card drop, big card dialog, binder grid, progress, start over.
- Cards with photo-specific bilingual name, mood, caption and clearly imaginary per-photo play values.
- Fixed rarity per photo from its own id, with at least one rare or holographic card per pack.
- German default and English option with a `DE` / `EN` toggle, persisted and URL-overridable.
- Photo discovery from PHP live list or `photos.json`, with an empty state that explains itself.
- HEIC handling server-side where possible, in the browser otherwise.
- Thumbnails made locally or cached by PHP; optional captions and card overrides per photo.
- Save, share, deep link, keyboard control, sound toggle, reduced motion.
- Noindex, robots, hardened `photos/` directory.
- Sample cards so the site is never empty while the real photos are missing.

**Explicitly out of scope**

- Any login, user account, comment, like or upload from the browser.
- Anything that needs a database or a cron job.
- Analytics of any kind, including privacy-friendly ones — it would still be a number nobody needs.
- Automatic image editing, face detection, or deduplication. Choosing a rarity by hand for every
  photo: the id decides instead.
- Languages beyond German and English.
- A CMS or admin interface.

**Constraints**

- IONOS shared webspace; PHP may be available but must never be required.
- The owner's time is the scarcest resource. Adding a photo must stay a file drop.
- Personal photos: privacy failures are worse than feature gaps.
- No external network dependencies at runtime: fonts, CSS, JS and the HEIC decoder are self-hosted.
- German and English photo captions and play-value labels must stay paired; new photos need explicit factual captions before descriptive copy ships.

**Timeline**

All of v1 was built in one session. Remaining work is content, not code: put real photos in
`photos/`, run `npm run photos`, upload, send the link.

---

## 8. Risks and mitigations

| # | Risk | Severity | Mitigation |
| --- | --- | --- | --- |
| R1 | Photos become publicly findable (search, image search, directory listing) | High | `noindex` meta, `robots.txt` disallow, `Options -Indexes`, no scripts in `photos/`; re-check after each upload |
| R2 | Adding photos gets annoying and the site goes stale | High | File drop plus either PHP live listing or one `npm run photos` command; nothing else to remember |
| R3 | A pack repeats a card too soon and the visitor thinks it is broken | Medium | Unseen-first draw, no repeat inside a pack, automatic new round with an announcement, progress display, manual "Von vorn" |
| R4 | Very large originals make the binder slow on mobile | Medium | 720 px display copies on cards and tiles; the original only in the dialog and in "Foto speichern" |
| R5 | German and English drift apart after an edit | Medium | One copy deck and one card bank with both languages next to each other; index-aligned arrays; `npm run qa` checks key strings in both |
| R6 | A new photo gets inaccurate or generic copy | Medium | Add bilingual per-photo name, mood, description and alt text in `photos/captions.json`; unknown real photos use neutral copy until then |
| R7 | HEIC cannot be converted anywhere (no Imagick on the host, decoder fails in the browser) | Medium | Owner converts to JPEG locally; the site still lists the file, and the card frame stays readable without the picture |
| R8 | Holographic effects distract from Elsa's photo or still read as a static gradient | Medium | Keep the strongest foil on rare/holo cards, drive it from pointer tilt and spring motion, add glitter and glare as independent layers, and check against the real photos at desktop and mobile sizes |
| R9 | `photos.php` misbehaves or PHP is disabled | Low | It only ever serves files inside `photos/`, and the app falls back to `photos.json` on any failure. Note: PHP could not be syntax-checked locally (no PHP binary); it needs a first load on the server. |
| R10 | Facebook or WhatsApp do not render the preview image | Low | Use an absolute `https://…/assets/og.png` once the domain is live |
| R11 | Font licensing on the server | Low | Chivo is open-licensed and self-hosted; no Google Fonts request |

**Design experiment (planned, not a claim of validated success):** at least 4 of 5 family or
friend testers should open a pack, understand the reveal, and open one card without instructions.
Use the sessions to find usability problems, not to make a statistical claim from a small sample.

---

## 9. Open questions

1. **Domain and path:** what exactly is the public URL? Needed for absolute OG tags and to check
   that `/photos/` cannot be listed.
2. **Volume:** how many photos will realistically be in there? Above roughly 200, the static
   `photos.json` and the binder grid may need paging. It is also where R6 starts to bite.
3. **Owner overrides:** are hand-written names and sentences wanted, and by whom? If not,
   `captions.json` stays empty and the bank carries the joke alone.
4. **English audience size:** is English for a handful of friends abroad, or half the family? If it
   is half, consider auto-detecting browser language on first visit instead of always starting in
   German. (Current behaviour: always German first.)
5. **The bank:** are 24 names, 30 sentences and 14 moods the right jokes? The lists are easy to
   extend, but must be extended in both languages at the same position.
6. **Rarity mix:** about one in eight cards is rare and one in eight holographic today, decided by
   the photo's own id. Should the owner be able to hand-pick the holographic ones instead?
7. **Share text:** should a shared link include the card's sentence, or only its printed name?
8. **Download vs. keep:** "Foto speichern" downloads the original. Is a smaller version better for
   sharing over messaging apps — and should the site keep every card forever, or retire old ones?

---

## 10. Support plan: who and what does the work

The build was routed through `@skill-router` and these are the skills and agents that own each part
of this document's plan.

### 10.1 Skills

| Skill | Owns |
| --- | --- |
| `skill-router` | Matching each task to a skill or agent, keeping the catalogue honest |
| `create-prd` | This document's structure, the "specify only what changes a decision" discipline |
| `product-designer` | Design critique, component hierarchy, usability checks and visual handoff |
| `brainstorm-experiments` | A low-cost pack-opening usability experiment with a pre-set threshold |
| `product-vision` | Keeping the why (one moment for photos nobody sees) ahead of the what |
| `job-stories` | Personas and user stories in §2 and §3 |
| `brand-guidelines` | German/English tone of voice, the *du* register, what the copy is never allowed to sound like |
| `content-humanizer` + `copywriting` | All site copy from scratch; the earlier product-pitch voice was thrown out |
| `copy-editing` | Final read of both languages for drift, length and consistency |
| `senior-frontend` | The file architecture, the copy deck pattern, no-build constraint |
| `a11y-audit` | WCAG 2.2 AA checks: keyboard, focus, live regions, contrast, reduced motion |
| `qa-browser-automation` | `scripts/qa.mjs`, the smoke test and screenshots |
| `privacy-compliance` | Noindex, no cookies, hardened `photos/`, nothing leaving the browser |
| `seo-analyst` | Only in the negative direction here: title, description, OG image, and staying unlisted |
| `launch-playbook` | FTP deployment checklist, OG domain note, post-upload verification |

### 10.2 Agents

| Agent | Supports |
| --- | --- |
| `cs-product-manager` | Prioritising P0/P1/P2, deciding what never gets built |
| `cs-ux-researcher` | Personas, and the "watch once, do not explain" way of validating M5 |
| `cs-design-lead` | Sign-off on the dark gallery, procedural holo treatment and card/pack hierarchy |
| `cs-frontend-engineer` | Pack mechanics, fixed rarity, card bank wiring, deep links, the copy deck |
| `cs-accessibility-engineer` | Screen-reader pass on the pack, the card dialog and the language toggle |
| `cs-qa-automation-lead` | Automated checks for pack size, uniqueness, one shine per pack, language switch, overflow, empty state |
| `cs-devops-engineer` | IONOS FTP deployment, `.htaccess`, caching headers |
| `cs-security-engineer` | `photos.php` path handling, no execution in `photos/`, response headers |
| `cs-privacy-officer` | Confirming there is genuinely nothing to declare |
| `cs-seo-analyst` | Metadata and OG image in both languages; verifying the site stays unindexed |
| `cs-content-creator` | The card bank: German *du* lines and their English twins, names, moods |
| `cs-release-manager` | Version, changelog, and the upload checklist before the link goes out |
| `cs-doc-writer` | This PRD and `README.md` |

### 10.3 Definition of done for v1

- `npm run qa` passes: German default, English switch and persistence, five cards per pack, no card
  twice in a pack, at least one rare or holographic card, a printed name on every card,
  `?photo=` deep link, no horizontal overflow at 390 and 1280, empty state, no-JS notice.
- Open a pack at desktop and phone sizes; the wrapper tears away and the five cards reveal in order.
- Opened card fits the phone dialog without scrolling; card flip, share and download controls work.
- Real photos in `photos/`, `npm run photos` run, uploaded together with `index.html`, `assets/`,
  `photos.php`, `.htaccess`, `robots.txt`.
- The link opens on a phone in the family chat and produces a laugh within ten seconds.

### 10.4 Next round: visitor upload with moderation (decided, not yet built)

Friends and family should be able to add their own Elsa photos on the site. Model chosen:

- **Shared code gate.** A small protected page asks for one family code before anything is
  accepted. The code never appears in the repo or in the site copy; it lives in `upload.php` config
  on the server.
- **Inbox, not the binder.** Uploads land in `photos/inbox/`, are validated by real content sniffing
  (never by filename), capped in size and count, and are not listed anywhere public.
- **Bulk moderation.** An approval page for the owner shows the arrivals as thumbnails with
  checkboxes: select all, accept, reject. Accepted files move into `photos/` (HEIC converted on the
  way), rejected ones are deleted. Nothing becomes a card before it is accepted.
- **Dependencies.** This makes PHP required for uploads, though the rest of the site keeps working
  without it. It also introduces abuse risk: anyone with the code can upload, so size caps, a rate
  limit and the inbox are mandatory, never optional.
