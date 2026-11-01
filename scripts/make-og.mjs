#!/usr/bin/env node
// Render the social preview with the current Elsen card treatment.

import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
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

const manifestPath = join(root, "photos.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { photos: [] };
const captionsPath = join(root, "photos", "captions.json");
const captions = existsSync(captionsPath) ? JSON.parse(readFileSync(captionsPath, "utf8")) : {};
const photos = (manifest.photos || []).filter((photo) => !photo.demo).slice(0, 3);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
}[character]));
const cards = [
  { photo: photos[1], fallback: "sample-03.jpg", style: "back back--left" },
  { photo: photos[0], fallback: "sample-01.jpg", style: "front" },
  { photo: photos[2], fallback: "sample-06.jpg", style: "back back--right" }
].map((item, index) => `
  <article class="card ${item.style}" style="--order:${index}">
    <div class="foil"></div>
    <div class="head"><span>NR. ${String(index + 1).padStart(2, "0")}</span><span>${index === 1 ? "HOLO-PRACHT" : "ERSTE AUFLAGE"}</span></div>
    <div class="photo"><img src="../${item.photo ? item.photo.thumb : `demo/thumbs/${item.fallback}`}" alt=""></div>
    <div class="body"><strong>${escapeHtml(item.photo ? captions[item.photo.filename]?.name?.de || "Elsen" : "Elsen")}</strong><span>${escapeHtml(item.photo ? captions[item.photo.filename]?.description?.de || "Erste Auflage" : "Erste Auflage")}</span></div>
  </article>`).join("");

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><style>
  @font-face { font-family: Chivo; font-weight: 400 700; src: url("fonts/chivo-latin.woff2") format("woff2"); }
  * { box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
  body {
    color: #f5f0ea;
    font-family: Chivo, "Avenir Next", system-ui, sans-serif;
    background: radial-gradient(ellipse at 72% 45%, rgb(136 101 156 / 28%), transparent 42%), #111017;
  }
  .scene { position: relative; display: grid; grid-template-columns: 1fr 540px; align-items: center; gap: 34px; width: 1200px; height: 630px; padding: 52px 64px; }
  .copy { position: relative; z-index: 4; }
  .eyebrow { color: #d4c2a8; font-size: 12px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }
  h1 { margin: 26px 0 0; font-size: 82px; font-weight: 700; letter-spacing: -.075em; line-height: .9; }
  .lede { max-width: 380px; margin: 23px 0 0; color: #aaa3b2; font-size: 24px; line-height: 1.35; }
  .rule { width: 96px; height: 2px; margin-top: 32px; background: linear-gradient(90deg,#f1d7b4,#e6c5d3,#d5c8ef); }
  .stack { position: relative; display: grid; height: 500px; place-items: center; perspective: 1200px; }
  .card { position: absolute; width: 290px; height: 430px; padding: 7px; overflow: hidden; border: 1px solid rgb(255 255 255 / 65%); border-radius: 17px; background: linear-gradient(135deg,#f5f3fc,#a6aac8 22%,#f6f5fc 42%,#9598bd 64%,#eeebf8 82%,#aca8ce); box-shadow: 0 28px 70px rgb(0 0 0 / 56%); }
  .card.front { z-index: 3; transform: rotate(2deg) translateY(-4px); }
  .card.back--left { z-index: 1; transform: translateX(-150px) rotate(-13deg) scale(.9); opacity: .86; }
  .card.back--right { z-index: 2; transform: translateX(145px) rotate(12deg) scale(.92); opacity: .92; }
  .foil { position: absolute; inset: 0; z-index: 2; background: repeating-linear-gradient(118deg,#ffc0e4 0%,#ffe2ad 6%,#bfffe2 12%,#b3e3ff 18%,#d3bfff 24%,#ffc0e4 30%); background-size: 320% 320%; mix-blend-mode: multiply; opacity: .6; }
  .head { position: relative; z-index: 3; display: flex; justify-content: space-between; padding: 10px 12px; border-radius: 9px; background: linear-gradient(110deg,#30283c,#15131a); color: #f1e9df; font-size: 9px; font-weight: 700; letter-spacing: .08em; }
  .photo { position: relative; height: 284px; margin-top: 8px; overflow: hidden; border: 2px solid white; border-radius: 9px; background: #302b35; }
  .photo::after { content:""; position:absolute; inset:0; background:repeating-linear-gradient(112deg,hsl(328 72% 52% / 24%),hsl(38 78% 54% / 18%) 7%,hsl(262 68% 60% / 24%) 14%); mix-blend-mode:color-dodge; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 42%; }
  .body { position:relative; z-index:3; display:grid; gap:5px; padding:12px 8px; color:#f5f0ea; }
  .body strong { font-size:25px; letter-spacing:-.05em; }
  .body span { color:#d1c5d3; font-size:11px; }
  .grain { position:absolute; inset:0; z-index:5; pointer-events:none; opacity:.12; background-image:radial-gradient(rgb(255 255 255 / 70%) .6px,transparent .8px); background-size:5px 5px; mix-blend-mode:overlay; }
</style></head><body>
  <main class="scene">
    <div class="copy"><p class="eyebrow">Erste Auflage · für Elsa</p><h1>Elsen</h1><p class="lede">Fünf Karten.<br>Ganz Elsa.</p><div class="rule"></div></div>
    <div class="stack">${cards}</div>
    <div class="grain"></div>
  </main>
</body></html>`;

const htmlPath = join(root, "assets", ".render-og.html");
writeFileSync(htmlPath, html);
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--disable-gpu", "--no-first-run"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, "assets", "og.png"), type: "png" });
  console.log("assets/og.png");
} finally {
  await browser.close();
  unlinkSync(htmlPath);
}
