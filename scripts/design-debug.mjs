#!/usr/bin/env node
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto("http://localhost:4173/?lang=de", { waitUntil: "networkidle0" });
await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0, { timeout: 20000 });
await page.click("#open-pack");
await page.waitForSelector("#pack-dialog[open]");
await page.waitForFunction(() => document.querySelectorAll("#pack-drop .pack__slot").length === 5, { timeout: 20000 });
await new Promise((r) => setTimeout(r, 900));
await page.click('#pack-drop .card[data-rarity="holo"]');
await page.waitForSelector("#card-dialog[open]");
await new Promise((r) => setTimeout(r, 900));
const out = await page.evaluate(() => {
  const card = document.querySelector("#card-full-slot .card--full");
  const res = {
    hasCard: Boolean(card),
    cls: card && card.className,
    qFoil: Boolean(card.querySelector(".card__foil")),
    qPlate: Boolean(card.querySelector(".card__plate")),
    qGlit: Boolean(card.querySelector(".card__glit")),
    qGlitWhole: Boolean(card.querySelector(".card__glit--whole")),
    qRays: Boolean(card.querySelector(".card__rays")),
    qFrame: Boolean(card.querySelector(".card__frame")),
    qPhoto: Boolean(card.querySelector(".card__photo")),
    qStrip: Boolean(card.querySelector(".card__strip")),
    qLine: Boolean(card.querySelector(".card__line")),
    qStats: Boolean(card.querySelector(".card__stats")),
    qFoot: Boolean(card.querySelector(".card__foot")),
    qSerial: Boolean(card.querySelector(".card__serial")),
    qCredit: Boolean(card.querySelector(".card__credit")),
    cardKids: [...card.children].map((c) => c.className),
    spinKids: [...(card.querySelector(".card__spin")).children].map((c) => c.className),
    frontKids: [...(card.querySelector(".card__face--front")).children].map((c) => c.className),
    backKids: [...(card.querySelector(".card__face--back")).children].map((c) => c.className),
    cs: (() => { const s = getComputedStyle(card.querySelector(".card__foil")); return { position: s.position, overflow: s.overflow, borderRadius: s.borderRadius, maskImage: s.maskImage, mask: s.mask, opacity: s.opacity, isolation: s.isolation, mixBlendMode: s.mixBlendMode }; })(),
    rects: Object.fromEntries(["card", "card__foil", "card__glit", "card__glit--whole", "card__rays", "card__frame", "card__photo", "card__plate", "card__strip", "card__line", "card__stats", "card__stat", "card__foot", "card__serial", "card__credit", "card__back-pattern", "card__back-mark"].map((n) => {
      const el = n === "card" ? card : card.querySelector(n) || card.querySelector(".card__spin").querySelector(n) || card.querySelector(".card__face--back").querySelector(n);
      const r = el ? el.getBoundingClientRect() : null;
      return [n, r ? { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom } : null];
    })),
    mapCheck: ["card__plate", "card__foil", "card__glit", "card__stats"].map((n) => ({
      n,
      viaDot: Boolean(card.querySelector("." + n)),
      viaAttr: Boolean(card.querySelector('[class*="' + n + '"]')),
      viaHash: Boolean(card.querySelector("#card-full-slot .card--full .card__plate")),
      viaChain: Boolean(card.querySelector(".card__spin").querySelector(".card__plate"))
    })),
    mapEl: ["card__plate", "card__foil", "card__glit", "card__stats"].map((n) => { const el = card.querySelector(n); return el ? el.className : null; }),
    content: ["card__plate", "card__strip", "card__line", "card__stats-label", "card__stats", "card__foot"].map((n) => {
      const el = card.querySelector(n);
      if (!el) return { name: n, missing: true };
      const r = el.getBoundingClientRect();
      return { name: n, x: r.x, y: r.y, w: r.width, h: r.height };
    }),
    direct: {
      plate: Boolean(card.querySelector(".card__plate")),
      strip: Boolean(card.querySelector(".card__strip")),
      line: Boolean(card.querySelector(".card__line")),
      stats: Boolean(card.querySelector(".card__stats")),
      foot: Boolean(card.querySelector(".card__foot")),
      all: [...card.querySelectorAll("[class*='card__']")].map((e) => e.className).filter(Boolean)
    }
  };
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
