#!/usr/bin/env node
// Cuts square crops out of one photo so every card shows Elsa.
// Writes photos/crop-01..07.jpg at 1200x1200 from photos/elsa-01.jpg.
//
//   node scripts/make-crops.mjs
//
// Set CROP_SOURCE to use a different original.

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const photosDir = join(root, "photos");
const source = join(photosDir, process.env.CROP_SOURCE || "elsa-01.jpg");

if (!existsSync(source)) {
  console.error(`Missing ${source}. Put at least one photo in photos/ first.`);
  process.exit(1);
}

const browserPath = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(browserPath)) {
  console.error("No Chrome or Chromium found. Set CHROME=/path/to/browser and try again.");
  process.exit(1);
}

// zoom is the background size in percent; x/y are the focal point.
const variants = [
  { zoom: 190, x: 34, y: 30, rotate: -2 },
  { zoom: 260, x: 60, y: 38, rotate: 3 },
  { zoom: 150, x: 50, y: 52, rotate: 0 },
  { zoom: 310, x: 22, y: 62, rotate: -4 },
  { zoom: 220, x: 70, y: 25, rotate: 2 },
  { zoom: 400, x: 46, y: 40, rotate: 0 },
  { zoom: 170, x: 18, y: 44, rotate: 4 }
];

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--disable-gpu", "--no-first-run"]
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });

  for (let index = 0; index < variants.length; index += 1) {
    const { zoom, x, y, rotate } = variants[index];
    const file = `crop-${String(index + 1).padStart(2, "0")}.jpg`;

    await page.setContent(`<!doctype html>
<html lang="de">
<head><meta charset="utf-8">
<style>
  html, body { width: 1200px; height: 1200px; margin: 0; overflow: hidden; background: #2b1d16; }
  .crop {
    width: 1200px;
    height: 1200px;
    background-image: url("${pathToFileURL(source).href}");
    background-repeat: no-repeat;
    background-size: ${zoom}%;
    background-position: ${x}% ${y}%;
    transform: rotate(${rotate}deg) scale(1.06);
  }
</style></head>
<body><div class="crop"></div></body>
</html>`, { waitUntil: "load" });

    await page.screenshot({ path: join(photosDir, file), type: "jpeg", quality: 88 });
    console.log(`photos/${file}`);
  }
} finally {
  await browser.close();
}
