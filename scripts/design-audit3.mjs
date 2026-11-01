#!/usr/bin/env node
// Temporary design edge/corner audit v3 - comprehensive.

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
  await page.evaluateOnNewDocument(() => {
    document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.scrollBehavior = "auto"; });
    window.__audioContextCreations = 0;
  });
  return page;
}

async function openHolo(page) {
  await page.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0, { timeout: 20000 });
  await page.click("#open-pack");
  await page.waitForSelector("#pack-dialog[open]");
  await page.waitForFunction(() => document.querySelectorAll("#pack-drop .pack__slot").length === Math.min(5, document.querySelectorAll("#album-grid .album__item").length), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.click('#pack-drop .card[data-rarity="holo"]');
  await page.waitForSelector("#card-dialog[open]");
  await new Promise((r) => setTimeout(r, 900));
}

async function measure(page) {
  return await page.evaluate(() => {
    const rectOf = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), top: +r.top.toFixed(2), left: +r.left.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) }; };
    const inRect = (r, c, tol = 0.75) => !!(r && c && r.left >= c.left - tol && r.right <= c.right + tol && r.top >= c.top - tol && r.bottom <= c.bottom + tol);
    const card = document.querySelector("#card-full-slot .card--full") || document.querySelector("#card-full-slot .card");
    const front = card.querySelector(".card__face--front");
    const back = card.querySelector(".card__face--back");
    const foil = card.querySelector(".card__foil");
    const glit = card.querySelector(".card__glit");
    const glitWhole = card.querySelector(".card__glit--whole");
    const rays = card.querySelector(".card__rays");
    const frame = card.querySelector(".card__frame");
    const photo = card.querySelector(".card__photo");
    const plate = card.querySelector(".card__plate");
    const name = card.querySelector(".card__name");
    const strip = card.querySelector(".card__strip");
    const line = card.querySelector(".card__line");
    const statsLabel = card.querySelector(".card__stats-label");
    const stats = card.querySelector(".card__stats");
    const stat = card.querySelector(".card__stat");
    const foot = card.querySelector(".card__foot");
    const serial = card.querySelector(".card__serial");
    const credit = card.querySelector(".card__credit");
    const backPattern = card.querySelector(".card__back-pattern");
    const backMark = card.querySelector(".card__back-mark");
    const cardBefore = getComputedStyle(card, "::before");
    const foilBefore = getComputedStyle(foil, "::before");
    const foilAfter = getComputedStyle(foil, "::after");
    const raysCs = getComputedStyle(rays);
    const photoAfter = getComputedStyle(photo, "::after");
    const frontCs = getComputedStyle(front);
    const backCs = getComputedStyle(back);
    const textOverflow = [];
    for (const el of [plate, strip, line, statsLabel, stats, stat, foot, serial, credit, name, card.querySelector(".card__mood"), card.querySelector(".card__rarity"), card.querySelector(".card__kind"), card.querySelector(".card__keyword"), card.querySelector(".card__copy"), card.querySelector(".card__print")]) {
      if (!el) continue;
      const s = getComputedStyle(el);
      const o = (s.overflow || "") + (s.overflowX || "") + (s.overflowY || "");
      if (/auto|hidden|clip|scroll/.test(o) || el.scrollWidth > el.clientWidth + 1) {
        textOverflow.push({ name: el.className || el.tagName, sw: el.scrollWidth, cw: el.clientWidth, over: el.scrollWidth > el.clientWidth + 1 });
      }
    }
    const frontLayers = { foil, glit, glitWhole, rays, frame, photo, plate, strip, line, statsLabel, stats, stat, foot, serial, credit };
    const backLayers = { backPattern, backMark };
    const frontOob = Object.keys(frontLayers).filter((n) => { const el = frontLayers[n]; const r = rectOf(el); return r && !inRect(r, rectOf(card)); });
    const backOob = Object.keys(backLayers).filter((n) => { const el = backLayers[n]; const r = rectOf(el); return r && !inRect(r, rectOf(back)); });
    const raysInFace = rectOf(rays) && rectOf(front) ? inRect(rectOf(rays), rectOf(front)) : null;
    const cardBeforeRect = rectOf(card);
    const beforeR = { x: cardBeforeRect.x + parseFloat(cardBefore.inset) || 0, y: cardBeforeRect.y + parseFloat(cardBefore.inset) || 0, w: cardBeforeRect.width - ((parseFloat(cardBefore.inset) || 0) * 2 + (parseFloat(cardBefore.borderTopWidth) || 0) * 2), h: cardBeforeRect.height - ((parseFloat(cardBefore.inset) || 0) * 2 + (parseFloat(cardBefore.borderTopWidth) || 0) * 2) };
    const dialog = document.getElementById("card-dialog");
    return {
      name: null,
      card: rectOf(card),
      cardBeforeCs: { position: cardBefore.position, inset: cardBefore.inset, zIndex: cardBefore.zIndex, borderRadius: cardBefore.borderRadius, overflow: cardBefore.overflow, pointerEvents: cardBefore.pointerEvents },
      front: rectOf(front),
      frontCs: { overflow: frontCs.overflow, overflowX: frontCs.overflowX, overflowY: frontCs.overflowY, borderRadius: frontCs.borderRadius, display: frontCs.display, position: frontCs.position, visibility: frontCs.visibility, contentVisibility: frontCs.contentVisibility, gridTemplateRows: frontCs.gridTemplateRows },
      back: rectOf(back),
      backCs: { overflow: backCs.overflow, overflowX: backCs.overflowX, overflowY: backCs.overflowY, borderRadius: backCs.borderRadius, display: backCs.display, position: backCs.position, visibility: backCs.visibility, gridTemplateRows: backCs.gridTemplateRows },
      foil: { rect: rectOf(foil), overflow: getComputedStyle(foil).overflow, borderRadius: getComputedStyle(foil).borderRadius, position: getComputedStyle(foil).position, mixBlendMode: getComputedStyle(foil).mixBlendMode, opacity: getComputedStyle(foil).opacity },
      foilBefore: { position: foilBefore.position, inset: foilBefore.inset, padding: foilBefore.padding, borderRadius: foilBefore.borderRadius, maskImage: foilBefore.maskImage, mask: foilBefore.mask, maskComposite: foilBefore.maskComposite, backgroundImage: foilBefore.backgroundImage, backgroundSize: foilBefore.backgroundSize, backgroundPosition: foilBefore.backgroundPosition, backgroundBlendMode: foilBefore.backgroundBlendMode, mixBlendMode: foilBefore.mixBlendMode, opacity: foilBefore.opacity, content: foilBefore.content, display: foilBefore.display },
      foilAfter: { position: foilAfter.position, inset: foilAfter.inset, opacity: foilAfter.opacity, mixBlendMode: foilAfter.mixBlendMode, backgroundImage: foilAfter.backgroundImage },
      glit: { rect: rectOf(glit), opacity: getComputedStyle(glit).opacity, mixBlendMode: getComputedStyle(glit).mixBlendMode, mask: getComputedStyle(glit).maskImage, borderRadius: getComputedStyle(glit).borderRadius },
      glitWhole: { rect: rectOf(glitWhole), opacity: getComputedStyle(glitWhole).opacity },
      rays: { rect: rectOf(rays), position: raysCs.position, inset: raysCs.inset, borderRadius: raysCs.borderRadius, mask: raysCs.maskImage, maskComposite: raysCs.maskComposite, mixBlendMode: raysCs.mixBlendMode, opacity: raysCs.opacity, backgroundImage: raysCs.backgroundImage, backgroundSize: raysCs.backgroundSize, pointerEvents: raysCs.pointerEvents, display: raysCs.display, animationName: raysCs.animationName, animationDuration: raysCs.animationDuration },
      raysInFace,
      frame: { rect: rectOf(frame), overflow: getComputedStyle(frame).overflow, borderRadius: getComputedStyle(frame).borderRadius, borderTopWidth: getComputedStyle(frame).borderTopWidth, pointerEvents: getComputedStyle(frame).pointerEvents },
      photo: { rect: rectOf(photo), overflow: getComputedStyle(photo).overflow, overflowX: getComputedStyle(photo).overflowX, overflowY: getComputedStyle(photo).overflowY, borderRadius: getComputedStyle(photo).borderRadius, borderTopWidth: getComputedStyle(photo).borderTopWidth, boxShadow: getComputedStyle(photo).boxShadow, aspectRatio: getComputedStyle(photo).aspectRatio, isolation: getComputedStyle(photo).isolation, position: getComputedStyle(photo).position, display: getComputedStyle(photo).display, scroll: { sw: photo.scrollWidth, cw: photo.clientWidth } },
      photoAfter: { mask: photoAfter.maskImage, opacity: photoAfter.opacity, mixBlendMode: photoAfter.mixBlendMode, backgroundImage: photoAfter.backgroundImage, backgroundSize: photoAfter.backgroundSize },
      content: ["card__plate", "card__strip", "card__line", "card__stats-label", "card__stats", "card__foot"].map((cls) => { const el = card.querySelector("." + cls); if (!el) return { name: cls, missing: true }; const r = el.getBoundingClientRect(); return { name: cls, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }),
      frontTextOverflow: textOverflow,
      backLayersOob: backOob,
      dialog: { rect: rectOf(dialog), overflow: getComputedStyle(dialog).overflow, scrollH: dialog.scrollHeight, clientH: dialog.clientHeight, scrollW: dialog.scrollWidth, clientW: dialog.clientWidth },
      slot: rectOf(document.getElementById("card-full-slot")),
      actions: rectOf(document.querySelector("#card-dialog .lightbox__actions")),
      close: rectOf(document.querySelector("#card-dialog .lightbox__close"))
    };
  });
}

const out = {};
for (const vp of viewports) {
  const page = await newPage(vp);
  await openHolo(page);
  const m = await measure(page);
  m.name = vp.name;
  out[vp.name] = m;
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
