#!/usr/bin/env node
// Temporary design geometry audit v2 - compact numeric report.

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

async function measureCard(page) {
  return await page.evaluate(() => {
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
    const plate = card.querySelector(".card__plate");
    const name = card.querySelector(".card__name");
    const strip = card.querySelector(".card__strip");
    const line = card.querySelector(".card__line");
    const stats = card.querySelector(".card__stats");
    const stat = card.querySelector(".card__stat");
    const foot = card.querySelector(".card__foot");
    const serial = card.querySelector(".card__serial");
    const credit = card.querySelector(".card__credit");
    const dialog = document.getElementById("card-dialog");
    const actions = dialog.querySelector(".lightbox__actions");
    const close = dialog.querySelector(".lightbox__close");
    const slot = document.getElementById("card-full-slot");
    const rectOf = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), top: +r.top.toFixed(2), left: +r.left.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) }; };
    const cs = (el, p, pseudo) => getComputedStyle(el, pseudo || null)[p];
    const alphaOf = (bg) => { const m = (bg || "").match(/rgba?\(([^)]+)\)/); if (!m) return 1; const parts = m[1].split(",").map((x) => parseFloat(x)); return parts.length > 3 ? parts[3] : 1; };
    const content = ["card__plate", "card__strip", "card__line", "card__stats-label", "card__stats", "card__foot"].map((cls) => { const el = card.querySelector("." + cls); if (!el) return { name: cls, missing: true }; const r = el.getBoundingClientRect(); return { name: cls, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; });
    const inCard = (r) => { const c = card.getBoundingClientRect(); return r && r.left >= c.left - 0.75 && r.right <= c.right + 0.75 && r.top >= c.top - 0.75 && r.bottom <= c.bottom + 0.75; };
    const nameRect = name ? name.getBoundingClientRect() : null;
    const nameOverflowX = name ? (name.scrollWidth > name.clientWidth + 0.5) : null;
    return {
      card: rectOf(card),
      cardCs: { overflow: cs(card, "overflow"), overflowX: cs(card, "overflowX"), overflowY: cs(card, "overflowY"), borderRadius: cs(card, "borderRadius"), padding: cs(card, "padding"), borderTopWidth: cs(card, "borderTopWidth"), backgroundColor: cs(card, "backgroundColor"), position: cs(card, "position") },
      back: { rect: rectOf(back), overflow: cs(back, "overflow"), overflowX: cs(back, "overflowX"), overflowY: cs(back, "overflowY"), borderRadius: cs(back, "borderRadius"), border: cs(back, "border"), backgroundColor: back.style.backgroundColor || cs(back, "backgroundColor"), backgroundImage: cs(back, "backgroundImage"), opacity: cs(back, "opacity"), position: cs(back, "position"), display: cs(back, "display"), backfaceVisibility: cs(back, "backfaceVisibility"), transform: cs(back, "transform") },
      foil: { rect: rectOf(foil), overflow: cs(foil, "overflow"), overflowX: cs(foil, "overflowX"), overflowY: cs(foil, "overflowY"), borderRadius: cs(foil, "borderRadius"), position: cs(foil, "position"), mixBlendMode: cs(foil, "mixBlendMode"), opacity: cs(foil, "opacity") },
      foilBefore: { position: cs(foil, "position", "::before"), inset: cs(foil, "inset", "::before"), padding: cs(foil, "padding", "::before"), borderRadius: cs(foil, "borderRadius", "::before"), maskImage: cs(foil, "maskImage", "::before"), mask: cs(foil, "mask", "::before"), maskComposite: cs(foil, "maskComposite", "::before"), backgroundImage: cs(foil, "backgroundImage", "::before"), backgroundSize: cs(foil, "backgroundSize", "::before"), backgroundPosition: cs(foil, "backgroundPosition", "::before"), backgroundBlendMode: cs(foil, "backgroundBlendMode", "::before"), mixBlendMode: cs(foil, "mixBlendMode", "::before"), opacity: cs(foil, "opacity", "::before"), content: cs(foil, "content", "::before"), display: cs(foil, "display", "::before") },
      foilAfter: { position: cs(foil, "position", "::after"), inset: cs(foil, "inset", "::after"), opacity: cs(foil, "opacity", "::after"), mixBlendMode: cs(foil, "mixBlendMode", "::after"), backgroundImage: cs(foil, "backgroundImage", "::after") },
      glit: { rect: rectOf(glit), position: cs(glit, "position"), inset: cs(glit, "inset"), borderRadius: cs(glit, "borderRadius"), maskImage: cs(glit, "maskImage"), mask: cs(glit, "mask"), maskComposite: cs(glit, "maskComposite"), mixBlendMode: cs(glit, "mixBlendMode"), opacity: cs(glit, "opacity"), backgroundImage: cs(glit, "backgroundImage"), backgroundSize: cs(glit, "backgroundSize") },
      glitWhole: { rect: rectOf(glitWhole), position: cs(glitWhole, "position"), inset: cs(glitWhole, "inset"), borderRadius: cs(glitWhole, "borderRadius"), maskImage: cs(glitWhole, "maskImage"), mixBlendMode: cs(glitWhole, "mixBlendMode"), opacity: cs(glitWhole, "opacity"), backgroundImage: cs(glitWhole, "backgroundImage"), backgroundSize: cs(glitWhole, "backgroundSize") },
      rays: { rect: rectOf(rays), position: cs(rays, "position"), inset: cs(rays, "inset"), borderRadius: cs(rays, "borderRadius"), maskImage: cs(rays, "maskImage"), mask: cs(rays, "mask"), maskComposite: cs(rays, "maskComposite"), mixBlendMode: cs(rays, "mixBlendMode"), opacity: cs(rays, "opacity"), backgroundImage: cs(rays, "backgroundImage") },
      frame: { rect: rectOf(frame), position: cs(frame, "position"), inset: cs(frame, "inset"), borderRadius: cs(frame, "borderRadius"), borderTopWidth: cs(frame, "borderTopWidth"), overflow: cs(frame, "overflow") },
      photo: { rect: rectOf(photo), overflow: cs(photo, "overflow"), overflowX: cs(photo, "overflowX"), overflowY: cs(photo, "overflowY"), borderRadius: cs(photo, "borderRadius"), borderTopWidth: cs(photo, "borderTopWidth"), boxShadow: cs(photo, "boxShadow"), aspectRatio: cs(photo, "aspectRatio"), isolation: cs(photo, "isolation") },
      plate: rectOf(plate), strip: rectOf(strip), line: rectOf(line), stats: rectOf(stats), stat: rectOf(stat), foot: rectOf(foot), serial: rectOf(serial), credit: rectOf(credit),
      content,
      nameRect: nameRect ? { x: +nameRect.x.toFixed(2), y: +nameRect.y.toFixed(2), w: +nameRect.width.toFixed(2), h: +nameRect.height.toFixed(2) } : null,
      nameOverflowX,
      dialog: { rect: rectOf(dialog), overflow: cs(dialog, "overflow"), scrollH: dialog.scrollHeight, clientH: dialog.clientHeight, scrollW: dialog.scrollWidth, clientW: dialog.clientWidth },
      slot: rectOf(slot),
      actions: rectOf(actions),
      close: rectOf(close),
      backAlpha: alphaOf(back.style.backgroundColor || cs(back, "backgroundColor"))
    };
  });
}

async function main() {
  const out = {};
  for (const vp of viewports) {
    const page = await newPage(vp);
    await openHolo(page);
    const m = await measureCard(page);
    m.name = vp.name;
    out[vp.name] = m;
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(out, (k, v) => (typeof v === "string" && v.length > 200 && k !== undefined ? v.slice(0, 200) + "<<B64>>" : v), 1));
}

main();
