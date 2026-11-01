#!/usr/bin/env node
// Temporary design geometry audit for the card edges/corners task.

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

const results = {};

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

const LAYER_NAMES = ["card", "card__foil", "card__glit", "card__glit--whole", "card__rays", "card__frame", "card__photo", "card__plate", "card__strip", "card__line", "card__stats", "card__stat", "card__foot", "card__serial", "card__credit", "card__back-pattern", "card__back-mark"];

async function measure(page) {
  return await page.evaluate(() => {
    const LAYER_NAMES = ["card", "card__foil", "card__glit", "card__glit--whole", "card__rays", "card__frame", "card__photo", "card__plate", "card__strip", "card__line", "card__stats", "card__stat", "card__foot", "card__serial", "card__credit", "card__back-pattern", "card__back-mark"];
    const rectOf = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), top: +r.top.toFixed(2), left: +r.left.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) };
    };
    const pick = (el, props) => Object.fromEntries(props.map((k) => [k, getComputedStyle(el)[k]]));
    const card = document.querySelector("#card-full-slot .card--full") || document.querySelector("#card-full-slot .card");
    const spin = card.querySelector(".card__spin");
    const front = card.querySelector(".card__face--front");
    const back = card.querySelector(".card__face--back");
    const foil = card.querySelector(".card__foil");
    const glit = card.querySelector(".card__glit");
    const glitWhole = card.querySelector(".card__glit--whole");
    const rays = card.querySelector(".card__rays");
    const frame = card.querySelector(".card__frame");
    const photo = card.querySelector(".card__photo");
    const dialog = document.getElementById("card-dialog");
    const actions = dialog.querySelector(".lightbox__actions");
    const close = dialog.querySelector(".lightbox__close");
    const slot = document.getElementById("card-full-slot");

    const rects = {};
    for (const name of LAYER_NAMES) {
      const el = name === "card" ? card : card.querySelector("." + name) || spin.querySelector("." + name) || back.querySelector("." + name);
      rects[name] = rectOf(el);
    }
    const inBounds = (name) => {
      const r = rects[name];
      if (!r) return null;
      const c = rects.card;
      return r.left >= c.left - 0.75 && r.right <= c.right + 0.75 && r.top >= c.top - 0.75 && r.bottom <= c.bottom + 0.75;
    };
    const escapes = LAYER_NAMES.filter((n) => rects[n] && inBounds(n) === false).map((n) => ({ layer: n, rect: rects[n] }));

    const overflowReport = [];
    const checkOverflow = (name, el) => {
      const s = getComputedStyle(el);
      const o = (s.overflow || "") + (s.overflowX || "") + (s.overflowY || "");
      if (/auto|hidden|clip|scroll/.test(o)) {
        if (el.scrollWidth > el.clientWidth + 0.5) overflowReport.push(`${name}: h-overflow scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`);
      }
    };
    ["card", "foil", "front", "back", "photo", "line", "name", "plate", "stats", "foot"].forEach((key) => {
      const el = key === "card" ? card : key === "foil" ? foil : key === "front" ? front : key === "back" ? back : key === "photo" ? photo : key === "line" ? card.querySelector(".card__line") : key === "name" ? card.querySelector(".card__name") : key === "plate" ? card.querySelector(".card__plate") : key === "stats" ? card.querySelector(".card__stats") : card.querySelector(".card__foot");
      if (el) checkOverflow(key, el);
    });

    const frontCs = getComputedStyle(front);
    const backCs = getComputedStyle(back);
    const alphaOf = (bg) => {
      const m = (bg || "").match(/rgba?\(([^)]+)\)/);
      if (!m) return 1;
      const parts = m[1].split(",").map((p) => parseFloat(p));
      return parts.length > 3 ? parts[3] : 1;
    };

    const content = ["card__plate", "card__strip", "card__line", "card__stats-label", "card__stats", "card__foot"].map((cls) => {
      const el = card.querySelector("." + cls);
      if (!el) return { name: cls, missing: true };
      const r = el.getBoundingClientRect();
      return { name: cls, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    });

    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      dialog: { ...rectOf(dialog), overflow: getComputedStyle(dialog).overflow, scroll: { client: dialog.clientHeight, scroll: dialog.scrollHeight } },
      slot: rectOf(slot),
      card: { ...rectOf(card), computed: pick(card, ["overflow", "overflowX", "overflowY", "borderRadius", "padding", "borderTopWidth", "boxShadow", "backgroundColor", "position"]) },
      layers: Object.fromEntries(LAYER_NAMES.map((n) => [n, { rect: rects[n], inCardBounds: inBounds(n) }])),
      escapes,
      overflowReport,
      foil: { rect: rects.card__foil, cs: pick(foil, ["position", "overflow", "borderRadius", "maskImage", "maskComposite", "mask", "mixBlendMode", "opacity", "backgroundImage", "backgroundSize", "isolation"]) },
      foilBefore: pick(foil, ["position", "inset", "padding", "borderRadius", "maskImage", "maskComposite", "mask", "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundBlendMode", "mixBlendMode", "opacity", "content", "display"]),
      foilAfter: pick(foil, ["position", "inset", "opacity", "backgroundImage", "mixBlendMode", "content", "display"]),
      glit: { rect: rects.card__glit, cs: pick(glit, ["position", "inset", "borderRadius", "maskImage", "maskComposite", "mixBlendMode", "opacity", "backgroundImage", "backgroundSize", "pointerEvents", "display"]) },
      "card__glit--whole": { rect: rects["card__glit--whole"], cs: pick(glitWhole, ["opacity", "position", "inset", "borderRadius", "mixBlendMode", "backgroundImage", "backgroundSize"]) },
      rays: { rect: rects.card__rays, cs: pick(rays, ["position", "inset", "borderRadius", "maskImage", "mixBlendMode", "opacity", "backgroundImage", "backgroundSize", "pointerEvents", "display"]), parentOverflow: getComputedStyle(photo).overflow, photoRect: rects.card__photo },
      frame: { rect: rects.card__frame, cs: pick(frame, ["position", "inset", "borderRadius", "borderTopWidth", "overflow", "pointerEvents"]) },
      photo: { rect: rects.card__photo, cs: pick(photo, ["overflow", "overflowX", "overflowY", "borderRadius", "borderTopWidth", "boxShadow", "aspectRatio", "isolation", "position", "display"]), scroll: { sw: photo.scrollWidth, cw: photo.clientWidth }, img: rectOf(photo.querySelector(".card__img")) },
      plate: rectOf(card.querySelector(".card__plate")),
      strip: rectOf(card.querySelector(".card__strip")),
      line: rectOf(card.querySelector(".card__line")),
      stats: rectOf(card.querySelector(".card__stats")),
      stat: rectOf(card.querySelector(".card__stat")),
      foot: rectOf(card.querySelector(".card__foot")),
      serial: rectOf(card.querySelector(".card__serial")),
      credit: rectOf(card.querySelector(".card__credit")),
      content,
      frontCs: pick(front, ["overflow", "borderRadius", "backgroundColor", "position", "display"]),
      backCs: pick(back, ["overflow", "borderRadius", "backgroundColor", "backgroundImage", "opacity", "position", "border", "display", "backfaceVisibility"]),
      actions: rectOf(actions),
      close: rectOf(close),
      backAlpha: alphaOf(backCs.backgroundColor)
    };
  });
}

async function runViewport(viewport, name) {
  const page = await newPage(viewport);
  await page.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0, { timeout: 20000 });
  await page.click("#open-pack");
  await page.waitForSelector("#pack-dialog[open]");
  await page.waitForFunction(() => document.querySelectorAll("#pack-drop .pack__slot").length === Math.min(5, document.querySelectorAll("#album-grid .album__item").length), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.click('#pack-drop .card[data-rarity="holo"]');
  await page.waitForSelector("#card-dialog[open]");
  await new Promise((r) => setTimeout(r, 900));
  const m = await measure(page);
  m.name = name;
  results[name] = m;
  await page.screenshot({ path: join(shotsDir, `design-audit-${name}.png`) });
  await page.close();
}

for (const vp of viewports) {
  await runViewport(vp, vp.name);
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
