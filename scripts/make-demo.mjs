#!/usr/bin/env node
// Generates the eight typographic sample cards in demo/ so the site has
// something to show before the real photos arrive. Uses the copy of Chrome
// already installed on the Mac and the local puppeteer-core dev dependency.
//
//   npm run demo
//
// Override the browser with CHROME=/path/to/chrome if needed.

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const demoDir = join(root, "demo");
const thumbDir = join(demoDir, "thumbs");
const fontDir = join(root, "assets", "fonts");
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const chromeCandidates = [
  chrome,
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
];

const browserPath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!browserPath) {
  console.error("No Chrome or Chromium found. Set CHROME=/path/to/browser and try again.");
  process.exit(1);
}

const ultra = pathToFileURL(join(fontDir, "ultra-latin.woff2")).href;
const chivo = pathToFileURL(join(fontDir, "chivo-latin.woff2")).href;

const paw = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <ellipse cx="6.1" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="12" cy="6.7" rx="2.2" ry="3.1"/>
    <ellipse cx="17.9" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="21" cy="14.4" rx="1.8" ry="2.4"/>
    <path d="M12 11.3c3.5 0 6.3 2.7 6.3 5.9 0 2.1-1.7 3.8-3.8 3.8-1.2 0-1.9-.7-2.5-.7s-1.3.7-2.5.7c-2.1 0-3.8-1.7-3.8-3.8 0-3.2 2.8-5.9 6.3-5.9Z"/>
  </svg>`;

function cardHtml(number, accent, paper) {
  const label = String(number).padStart(2, "0");
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Ultra";
    src: url("${ultra}") format("woff2");
  }
  @font-face {
    font-family: "Chivo";
    font-weight: 400 700;
    src: url("${chivo}") format("woff2");
  }
  * { box-sizing: border-box; }
  p { margin: 0; }
  html, body {
    width: 1200px;
    height: 1200px;
    margin: 0;
    overflow: hidden;
  }
  body {
    display: grid;
    place-items: center;
    background: #2b1d16;
    color: #2b1d16;
    font-family: "Chivo", sans-serif;
  }
  .card {
    position: relative;
    width: 1120px;
    height: 1120px;
    padding: 58px;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: ${paper};
    border: 8px solid #2b1d16;
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(#2b1d16 1.4px, transparent 1.5px);
    background-size: 11px 11px;
    opacity: 0.14;
  }
  .top {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 4px solid #2b1d16;
    padding-bottom: 20px;
  }
  .brand {
    font-family: "Ultra", serif;
    font-size: 50px;
    line-height: 1;
  }
  .sample {
    font-size: 25px;
    font-weight: 700;
  }
  .middle {
    position: relative;
    z-index: 1;
    align-self: center;
    display: grid;
    justify-items: center;
    gap: 18px;
  }
  .paw {
    display: grid;
    place-items: center;
    width: 142px;
    aspect-ratio: 1;
    border: 6px solid ${accent};
    border-radius: 50%;
  }
  .paw svg {
    width: 72px;
    fill: ${accent};
    transform: translateY(5%);
  }
  .number {
    font-family: "Ultra", serif;
    font-size: 260px;
    line-height: 1;
    letter-spacing: 0.01em;
  }
  .bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    border-top: 4px solid #2b1d16;
    padding-top: 22px;
  }
  .bottom p {
    margin: 0;
    font-size: 27px;
    font-weight: 700;
    line-height: 1.2;
  }
  .bottom span {
    display: block;
    margin-top: 4px;
    color: #6d5b4c;
    font-size: 21px;
    font-weight: 400;
  }
  .mark {
    display: grid;
    place-items: center;
    min-width: 140px;
    min-height: 140px;
    padding: 12px;
    border: 7px solid ${accent};
    color: ${accent};
    font-size: 20px;
    font-weight: 700;
    line-height: 1.1;
    text-align: center;
    transform: rotate(-8deg);
  }
</style>
</head>
<body>
  <article class="card">
    <div class="top">
      <p class="brand">Lucky Elsa</p>
      <p class="sample">BEISPIEL ${label}</p>
    </div>
    <div class="middle">
      <span class="paw">${paw}</span>
      <p class="number">${label}</p>
    </div>
    <div class="bottom">
      <p>Hier kommt Elsa hin.<span>Sample card / Beispielkarte</span></p>
      <span class="mark">FOTO<br>FOLGT</span>
    </div>
  </article>
</body>
</html>`;
}

mkdirSync(demoDir, { recursive: true });
mkdirSync(thumbDir, { recursive: true });

const work = mkdtempSync(join(tmpdir(), "lucky-elsa-demo-"));
const papers = ["#f6efdf", "#efe3c9"];
const accents = ["#c03a22", "#a8341c"];

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: true,
  args: [
    "--disable-gpu",
    "--disable-breakpad",
    "--disable-crash-reporter",
    "--no-first-run",
    "--no-default-browser-check"
  ]
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });

  for (let number = 1; number <= 8; number += 1) {
    const file = `sample-${String(number).padStart(2, "0")}`;
    const htmlPath = join(work, `${file}.html`);
    const jpgPath = join(demoDir, `${file}.jpg`);
    const thumbPath = join(thumbDir, `${file}.jpg`);

    writeFileSync(htmlPath, cardHtml(number, accents[(number - 1) % accents.length], papers[(number - 1) % papers.length]));

    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: jpgPath, type: "jpeg", quality: 86 });

    execFileSync("sips", [
      "-Z", "720",
      "-s", "format", "jpeg",
      "-s", "formatOptions", "82",
      jpgPath,
      "--out", thumbPath
    ], { stdio: "ignore" });

    console.log(`demo/${file}.jpg`);
  }
} finally {
  await browser.close();
  if (!process.env.KEEP) {
    rmSync(work, { recursive: true, force: true });
  } else {
    console.log(`Kept ${work}`);
  }
}
