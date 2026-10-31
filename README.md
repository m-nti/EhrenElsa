# Lucky Elsa

A small static site where you open a pack and get five random collectible cards of Elsa — each
with its own name, mood, ratings and, if you are lucky, a holographic finish. Made to share with
friends and family. Everything a visitor sees comes out of one folder, so it can be
dropped on any IONOS webspace over FTP.

- **German is the default.** Visitors can switch to English with the `DE` / `EN` toggle in the
  header; the choice is remembered and can also be forced with `?lang=de` or `?lang=en`.
- **No build step for the visitor.** Plain HTML, CSS and JavaScript, self-hosted fonts, no
  framework, no cookie banner, no tracking.
- **Mint `#72efdd` is the only spot colour.** Because it is light, every piece of text and every
  border that needs to be readable uses the dark teal `--color-accent-strong` instead.

## What is in here

```
index.html              the page
assets/css/style.css    layout and theme (Hallmark "Halftone": butter-cream paper, brown-black ink)
assets/js/app.js        pack and card logic, German and English copy, sharing, keyboard
assets/js/card-bank.js  the bank of German and English card names, lines, moods and rarities
assets/css/cards.css    the card itself: holographic foil, rarity, mood and ratings
assets/fonts/           Ultra and Chivo, self-hosted
assets/og.png           preview image for shared links
demo/                   eight sample cards so the site works out of the box
photos/                 your real photos go here (empty until you fill it)
photos.php              optional live photo list for FTP-only hosting
photos.json             generated list of what the site should show
scripts/                local helpers (not uploaded to the server)
```

## Look at it locally

```bash
npm install       # only needed for the helper scripts (puppeteer-core)
npm run serve     # serves the folder at http://localhost:4173
```

Open <http://localhost:4173> and click the pack. Five cards drop out; click one to see it big.

There is also `PRD.md`: why the site exists, what it promises, what it deliberately does not do,
and which skills and agents own which part of it.

## Get the photos in

1. Copy Elsa's photos into `photos/` — JPG, PNG, WebP, GIF, AVIF or HEIC (straight from an
   iPhone), flat, no subfolders.
2. Run:

   ```bash
   npm run photos
   ```

   This writes `photos.json`, makes 720 px thumbnails in `photos/thumbs/`, and rewrites the
   manifest. Run it again whenever photos change.
3. Upload everything to the server (except `node_modules/`, `scripts/`, `qa-shots/`, `.hallmark/`).

HEIC files from an iPhone are converted to JPEG once, into `photos/converted/`, because most
browsers cannot show HEIC. On the server `photos.php` does the same through Imagick when your
hosting has it; if it does not, the visitor's own browser converts the photo instead, so nothing
is missing either way.

If `photos/` holds fewer than eight photos, sample cards fill the set up to eight. Once there
are eight real ones the samples drop out on their own.

Optional: add captions and alt text in `photos/captions.json`, keyed by filename:

```json
{
  "elsa-im-garten.jpg": {
    "caption": "Im Garten, Sommer 2025",
    "alt": "Elsa steht im Garten und schaut in die Kamera"
  },
  "elsa-am-see.jpg": "Nach dem Baden am See"
}
```

See `photos/captions.example.json`. Captions show under the photo's award; alt text is what screen
readers read.

### If you only want to drag photos onto the server

Leave `photos.php` on the server next to `index.html`. The site asks `photos.php?list=1` first and
uses its answer when there are photos in `photos/`; otherwise it falls back to `photos.php`'s empty
answer and then to `photos.json`. With PHP enabled you can drop new images into `photos/` over FTP
and they appear after a reload, with thumbnails built by PHP on first request. With PHP disabled
the site still works from `photos.json` alone.

`photos/.htaccess` blocks directory listing and any script execution inside `photos/`.

## Deploy to IONOS

Upload these to the document root of the domain:

```
index.html
photos.php
robots.txt
.htaccess
assets/          (css, js, fonts, favicon.svg, og.png) and assets/vendor/heic2any/
photos/          (your photos, plus photos/thumbs/, photos/converted/, photos/.htaccess)
demo/            (only while photos/ holds fewer than eight photos)
photos.json      (only when you rely on the static manifest)
```

Nothing else. Leave `scripts/`, `node_modules/`, `package.json`, `qa-shots/` and `.hallmark/` on the
Mac.

Two things to know:

- **Shared links need an absolute URL.** `og:image` currently points at `assets/og.png`, which is
  fine for most messengers once the page itself is reachable, but WhatsApp and Facebook like a full
  address. Replace it in `index.html` with `https://yourdomain/assets/og.png` to be safe.
- **The site asks not to be indexed.** `robots.txt` and the `noindex` meta tag keep Elsa out of
  search engines and out of image search. If you want it findable later, remove both.

## Privacy

There is nothing to declare. No login, no cookies, no analytics, no third-party requests. The only
data stored is on the visitor's own device: which photos were already seen and whether sound and
German or English are preferred (`localStorage`). Nothing leaves the browser.

Because it is a family site with personal photos, the default stays private: no indexing, no
directory listing, no script execution inside `photos/`.

## Helper scripts

| Command          | What it does                                                     |
| ---------------- | ---------------------------------------------------------------- |
| `npm run photos` | Writes `photos.json` and thumbnails for everything in `photos/`   |
| `npm run demo`   | Rebuilds the eight sample cards in `demo/`                        |
| `npm run og`     | Rebuilds `assets/og.png`, the share preview image                 |
| `npm run serve`  | Serves the folder at <http://localhost:4173>                      |
| `npm run qa`     | Runs the smoke test and writes screenshots to `qa-shots/`         |
| `npm run check`  | Syntax check for `assets/js/app.js`                               |

`npm run qa` needs `npm run serve` running in another terminal. It checks the German default, the
English switch, that a lap shows every photo once before repeating, the deep link
`?photo=<id>`, horizontal overflow at desktop and mobile width, the empty state, and the no-JS
notice.

## How the pack behaves

- One pack holds five cards, drawn from the ones the visitor has not seen yet, and at least one of
  them is rare or holographic.
- A photo keeps the same card forever: same name, same sentence, same mood, same ratings — in German
  and in English, because both decks are picked by the same index.
- Once every photo has been drawn the set starts over on its own, so no one runs out of cards.
- Cards can be opened from the pack or from the binder below, walked through with `←` and `→`, saved
  or shared as a link. Press `P` to open a pack.
- Rarity comes from the photo itself, not from luck alone: common cards are flat printed, rare ones
  get a foil rule, holographic ones shimmer and follow the pointer.
- Every pack tears open with a foil rip and a confetti burst, and a card opening gets its own small
  burst and a short chime. Confetti is a canvas drawn in the set's own colours — no library, no
  image, and nothing at all when sound is off or motion is reduced.
- Reduced-motion preferences are respected: cards appear without the stagger, the foil keeps still.
