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
const center = 196;
const radius = 140;
const photos = Array.from({ length: 6 }, (_, index) => {
  const angle = (index * 60 - 90) * (Math.PI / 180);
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);
  const file = `sample-${String(index + 1).padStart(2, "0")}.jpg`;
  return `<img class="photo" src="${pathToFileURL(join(root, "demo", "thumbs", file)).href}" style="left:${x}px;top:${y}px" alt="">`;
}).join("");

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
  .copy { position: relative; z-index: 2; }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 38px;
    font-family: "Ultra", serif;
    font-size: 40px;
    line-height: 1;
  }
  .brand svg { width: 38px; fill: #c03a22; }
  h1 {
    margin: 0;
    font-family: "Ultra", serif;
    font-size: 77px;
    font-weight: 400;
    line-height: 1.02;
  }
  p { margin: 22px 0 0; max-width: 560px; font-size: 25px; line-height: 1.4; color: #4a382c; }
  .rule {
    width: 120px;
    height: 8px;
    margin-top: 36px;
    background: #c03a22;
  }
  .wheel {
    position: relative;
    width: 392px;
    height: 392px;
    border: 12px solid #2b1d16;
    border-radius: 50%;
    background: repeating-conic-gradient(from -30deg, #c03a22 0 60deg, #efe3c9 60deg 120deg);
  }
  .wheel::after {
    content: "";
    position: absolute;
    inset: 9px;
    border: 5px solid #f6efdf;
    border-radius: 50%;
  }
  .photo {
    position: absolute;
    z-index: 1;
    width: 92px;
    height: 92px;
    border: 4px solid #f6efdf;
    border-radius: 50%;
    object-fit: cover;
    transform: translate(-50%, -50%);
  }
  .hub {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 92px;
    height: 92px;
    border: 7px solid #f6efdf;
    border-radius: 50%;
    background: #2b1d16;
    transform: translate(-50%, -50%);
  }
  .hub svg { width: 44px; fill: #c03a22; }
  .pointer {
    position: absolute;
    top: -34px;
    left: 50%;
    z-index: 4;
    width: 54px;
    color: #2b1d16;
    transform: translateX(-50%);
  }
</style>
</head>
<body>
  <div class="og">
    <div class="copy">
      <div class="brand">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="6.1" cy="9.2" rx="2.1" ry="2.9"/>
          <ellipse cx="12" cy="6.7" rx="2.2" ry="3.1"/>
          <ellipse cx="17.9" cy="9.2" rx="2.1" ry="2.9"/>
          <ellipse cx="21" cy="14.4" rx="1.8" ry="2.4"/>
          <path d="M12 11.3c3.5 0 6.3 2.7 6.3 5.9 0 2.1-1.7 3.8-3.8 3.8-1.2 0-1.9-.7-2.5-.7s-1.3.7-2.5.7c-2.1 0-3.8-1.7-3.8-3.8 0-3.2 2.8-5.9 6.3-5.9Z"/>
        </svg>
        Lucky Elsa
      </div>
      <h1>Welche Elsa<br>wird es?</h1>
      <p>Ein Glücksrad voller Elsa-Fotos. Dreh es und schau, welches kommt.</p>
      <div class="rule"></div>
    </div>

    <div class="wheel">
      ${photos}
      <span class="hub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="6.1" cy="9.2" rx="2.1" ry="2.9"/>
          <ellipse cx="12" cy="6.7" rx="2.2" ry="3.1"/>
          <ellipse cx="17.9" cy="9.2" rx="2.1" ry="2.9"/>
          <ellipse cx="21" cy="14.4" rx="1.8" ry="2.4"/>
          <path d="M12 11.3c3.5 0 6.3 2.7 6.3 5.9 0 2.1-1.7 3.8-3.8 3.8-1.2 0-1.9-.7-2.5-.7s-1.3.7-2.5.7c-2.1 0-3.8-1.7-3.8-3.8 0-3.2 2.8-5.9 6.3-5.9Z"/>
        </svg>
      </span>
      <svg class="pointer" viewBox="0 0 48 52" aria-hidden="true">
        <path d="M24 49 5 9h38L24 49Z" fill="currentColor" stroke="#f6efdf" stroke-width="4" stroke-linejoin="round"/>
      </svg>
    </div>
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
