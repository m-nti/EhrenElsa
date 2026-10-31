#!/usr/bin/env node
// Makes assets/og.png, the preview image shown when the link is shared.
// Run it after changing the headline or the sample cards:
//
//   npm run og

import { existsSync } from "node:fs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const fontDir = join(root, "assets", "fonts");
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const candidates = [
  chrome,
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
];

const browserPath = candidates.find((candidate) => existsSync(candidate));
if (!browserPath) {
  console.error("No Chrome or Chromium found. Set CHROME=/path/to/browser and try again.");
  process.exit(1);
}

const ultra = pathToFileURL(join(fontDir, "ultra-latin.woff2")).href;
const chivo = pathToFileURL(join(fontDir, "chivo-latin.woff2")).href;
const thumb = (name) => pathToFileURL(join(root, "demo", "thumbs", name)).href;

const paw = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <ellipse cx="6.1" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="12" cy="6.7" rx="2.2" ry="3.1"/>
    <ellipse cx="17.9" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="21" cy="14.4" rx="1.8" ry="2.4"/>
    <path d="M12 11.3c3.5 0 6.3 2.7 6.3 5.9 0 2.1-1.7 3.8-3.8 3.8-1.2 0-1.9-.7-2.5-.7s-1.3.7-2.5.7c-2.1 0-3.8-1.7-3.8-3.8 0-3.2 2.8-5.9 6.3-5.9Z"/>
  </svg>`;

// Three cards fanned out, the middle one foiled like a holo pull.
const cards = [
  { file: "sample-03.jpg", rarity: "back", rotate: -13, offset: -132 },
  { file: "sample-01.jpg", rarity: "holo", rotate: 3, offset: 0 },
  { file: "sample-06.jpg", rarity: "plain", rotate: 15, offset: 136 }
].map((card, index) => `
    <div class="card ${card.rarity}" style="--rotate:${card.rotate}deg;--offset:${card.offset}px;--z:${10 + index}">
      <span class="card__foil"></span>
      <span class="card__photo"><img src="${thumb(card.file)}" alt=""></span>
      <span class="card__head"><span class="card__number">Nr. ${String(index + 1).padStart(2, "0")}</span><span class="card__rarity">${card.rarity === "holo" ? "Holo" : "Serie I"}</span></span>
      <span class="card__name">Elsa</span>
      <span class="card__line">Fünf Karten, mindestens eine mit Folie.</span>
    </div>`).join("");

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Ultra"; src: url("${ultra}") format("woff2"); }
  @font-face { font-family: "Chivo"; font-weight: 400 700; src: url("${chivo}") format("woff2"); }
  * { box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
  body {
    background: #f6efdf;
    color: #2b1d16;
    font-family: "Chivo", sans-serif;
    background-image: radial-gradient(#d8c7a8 1px, transparent 1.1px);
    background-size: 8px 8px;
  }
  .og {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 430px;
    align-items: center;
    gap: 40px;
    width: 1200px;
    height: 630px;
    padding: 52px 58px;
    border: 10px solid #2b1d16;
  }
  .copy { position: relative; z-index: 30; }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 38px;
    font-family: "Ultra", serif;
    font-size: 40px;
    line-height: 1;
  }
  .brand svg { width: 38px; fill: #0d5f53; }
  h1 {
    margin: 0;
    font-family: "Ultra", serif;
    font-size: 77px;
    font-weight: 400;
    line-height: 1.02;
  }
  p { margin: 22px 0 0; max-width: 560px; font-size: 25px; line-height: 1.4; color: #4a382c; }
  .rule { width: 120px; height: 8px; margin-top: 36px; background: #0d5f53; }

  .fan { position: relative; height: 470px; }
  .card {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: var(--z);
    display: grid;
    width: 250px;
    padding: 12px;
    gap: 8px;
    border: 5px solid #2b1d16;
    border-radius: 4px;
    background: #f6efdf;
    transform: translate(-50%, -50%) translateX(var(--offset)) rotate(var(--rotate));
  }
  .card.holo { box-shadow: 0 0 0 3px #72efdd, 0 18px 30px rgba(43, 29, 22, 0.28); }
  .card.holo .card__foil {
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: conic-gradient(from 40deg,
      rgba(114, 239, 221, 0.75), rgba(255, 255, 255, 0) 30%,
      rgba(13, 95, 83, 0.55) 55%, rgba(255, 255, 255, 0) 78%,
      rgba(114, 239, 221, 0.7));
    mix-blend-mode: screen;
    opacity: 0.85;
  }
  .card:not(.holo) .card__foil { display: none; }
  .card.back { opacity: 0.92; }
  .card__photo {
    position: relative;
    z-index: 1;
    display: block;
    height: 230px;
    overflow: hidden;
    border: 3px solid #2b1d16;
  }
  .card__photo img { width: 100%; height: 100%; object-fit: cover; }
  .card__head {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 700;
  }
  .card.holo .card__rarity { color: #0d5f53; }
  .card__name { position: relative; z-index: 1; font-family: "Ultra", serif; font-size: 26px; }
  .card__line { position: relative; z-index: 1; font-size: 15px; line-height: 1.25; color: #4a382c; }
</style>
</head>
<body>
  <div class="og">
    <div class="copy">
      <div class="brand">
        <svg viewBox="0 0 24 24" aria-hidden="true">${paw.replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, "")}</svg>
        Lucky Elsa
      </div>
      <h1>Was steckt<br>im Pack?</h1>
      <p>Fünf Elsa-Karten auf einmal, mindestens eine davon holografisch.</p>
      <div class="rule"></div>
    </div>
    <div class="fan">${cards}</div>
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--disable-gpu", "--disable-breakpad", "--disable-crash-reporter", "--no-first-run"]
});

const work = mkdtempSync(join(tmpdir(), "lucky-elsa-og-"));
const htmlPath = join(work, "og.html");
writeFileSync(htmlPath, html);

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, "assets", "og.png"), type: "png" });
  console.log("assets/og.png");
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
