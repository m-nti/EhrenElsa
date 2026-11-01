#!/usr/bin/env node
// Temporary design audit v4 - album grid card geometry.

import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const shotsDir = join(root, "qa-shots");
const base = process.env.BASE_URL || "http://localhost:4173";
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
mkdirSync(shotsDir, { recursive: true });
const browserPath = [chrome, "/Applications/Chromium.app/Contents/MacOS/Chromium", "/usr/bin/google-chrome"].find((c) => existsSync(c));
if (!browserPath) { console.error("no chrome"); process.exit(1); }
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--disable-gpu", "--disable-breakpad", "--disable-crash-reporter", "--no-first-run"] });

const viewports = [
  { name: "1280x900", width: 1280, height: 900, dsf: 1 },
  { name: "886x741", width: 886, height: 741, dsf: 2 },
  { name: "390x844", width: 390, height: 844, dsf: 2 },
  { name: "326x650", width: 326, height: 650, dsf: 2 }
];

async function newPage(viewport) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: viewport.dsf });
  await page.evaluateOnNewDocument(() => { window.__audioContextCreations = 0; });
  return page;
}

const out = {};
for (const vp of viewports) {
  const page = await newPage(vp);
  await page.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0, { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1200));
  const cards = await page.evaluate(() => [...document.querySelectorAll("#album-grid .album__item")].map((item) => {
    const card = item.querySelector(".card") || item;
    const spin = card.querySelector(".card__spin");
    const front = card.querySelector(".card__face--front");
    const back = card.querySelector(".card__face--back");
    const foil = card.querySelector(".card__foil");
    const glit = card.querySelector(".card__glit");
    const glitWhole = card.querySelector(".card__glit--whole");
    const rays = card.querySelector(".card__rays");
    const frame = card.querySelector(".card__frame");
    const photo = card.querySelector(".card__photo");
    const plate = card.querySelector(".card__plate");
    const strip = card.querySelector(".card__strip");
    const line = card.querySelector(".card__line");
    const stats = card.querySelector(".card__stats");
    const stat = card.querySelector(".card__stat");
    const foot = card.querySelector(".card__foot");
    const serial = card.querySelector(".card__serial");
    const credit = card.querySelector(".card__credit");
    const backPattern = card.querySelector(".card__back-pattern");
    const backMark = card.querySelector(".card__back-mark");
    const rectOf = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), top: +r.top.toFixed(2), left: +r.left.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) }; };
    const inRect = (r, c, tol = 0.75) => !!(r && c && r.left >= c.left - tol && r.right <= c.right + tol && r.top >= c.top - tol && r.bottom <= c.bottom + tol);
    const frontLayers = { foil, glit, glitWhole, rays, frame, photo, plate, strip, line, stats, stat, foot, serial, credit };
    const backLayers = { backPattern, backMark };
    const frontOob = Object.keys(frontLayers).filter((n) => { const el = frontLayers[n]; const r = rectOf(el); return r && !inRect(r, rectOf(card)); });
    const backOob = Object.keys(backLayers).filter((n) => { const el = backLayers[n]; const r = rectOf(el); return r && !inRect(r, rectOf(back)); });
    const fcs = getComputedStyle(front);
    const bcs = getComputedStyle(back);
    const textOverflow = [];
    for (const el of [plate, strip, line, stats, stat, foot, serial, credit, card.querySelector(".card__name"), card.querySelector(".card__mood"), card.querySelector(".card__rarity"), card.querySelector(".card__kind"), card.querySelector(".card__copy"), card.querySelector(".card__print")]) {
      if (!el) continue;
      const s = getComputedStyle(el);
      const o = (s.overflow || "") + (s.overflowX || "") + (s.overflowY || "");
      if (/auto|hidden|clip|scroll/.test(o) || el.scrollWidth > el.clientWidth + 1) textOverflow.push({ name: el.className || el.tagName, over: el.scrollWidth > el.clientWidth + 1 });
    }
    return {
      cls: card.className, itemCls: item.className, rarity: card.dataset.rarity,
      card: rectOf(card), item: rectOf(item),
      front: rectOf(front), frontCs: { overflow: fcs.overflow, borderRadius: fcs.borderRadius, display: fcs.display },
      back: rectOf(back), backCs: { overflow: bcs.overflow, borderRadius: bcs.borderRadius, display: bcs.display },
      frontLayersOob: frontOob, backLayersOob: backOob, textOverflow,
      dialog: null
    };
  }));
  out[vp.name] = { vp, cards };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
