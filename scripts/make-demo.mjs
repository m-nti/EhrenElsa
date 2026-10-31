#!/usr/bin/env node
// Generates the eight sample pictures in demo/ so the site has something to
// show before the real photos arrive. Each one carries a different motif, so a
// pack of five never looks like the same card twice.
//
// Everything is drawn locally with the copy of Chrome already installed on the
// Mac and the local puppeteer-core dev dependency — no image service, no
// network, nothing third-party ends up on the server.
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

const INK = "#2b1d16";
const MINT = "#41c9b4";
const CREAM = "#efe3c9";

function star(cx, cy, outer, inner, points) {
  let path = "";
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = ((-90 + (index * 180) / points) * Math.PI) / 180;
    path += `${index === 0 ? "M" : "L"}${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`;
  }
  return `${path}Z`;
}

/* One motif per card, drawn from primitives so nothing has to be licensed. */
const MOTIFS = {
  bone: `
    <rect x="30" y="52" width="60" height="17" rx="8.5"/>
    <circle cx="30" cy="50" r="13"/><circle cx="30" cy="71" r="13"/>
    <circle cx="90" cy="50" r="13"/><circle cx="90" cy="71" r="13"/>`,
  ball: `
    <circle cx="60" cy="60" r="38" fill="none" stroke="${INK}" stroke-width="11"/>
    <path d="M30 40c22 10 38 26 42 52" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
    <path d="M30 82c24-6 38-22 42-46" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>`,
  stick: `
    <rect x="12" y="55" width="96" height="10" rx="5" transform="rotate(-17 60 60)"/>
    <circle cx="17" cy="41" r="10"/><circle cx="103" cy="79" r="10"/>`,
  bowl: `
    <path d="M18 58h84a42 42 0 0 1-84 0Z"/>
    <rect x="10" y="46" width="100" height="12" rx="6"/>
    <rect x="46" y="24" width="28" height="8" rx="4"/>
    <circle cx="40" cy="26" r="8"/><circle cx="80" cy="26" r="8"/>`,
  rain: `
    <circle cx="42" cy="44" r="18"/><circle cx="66" cy="40" r="22"/><circle cx="86" cy="50" r="15"/>
    <rect x="26" y="52" width="70" height="18" rx="9"/>
    <rect x="36" y="80" width="9" height="22" rx="4.5"/>
    <rect x="57" y="88" width="9" height="20" rx="4.5"/>
    <rect x="78" y="78" width="9" height="20" rx="4.5"/>`,
  sofa: `
    <rect x="24" y="30" width="72" height="34" rx="9"/>
    <rect x="10" y="60" width="100" height="26" rx="8"/>
    <rect x="8" y="48" width="16" height="40" rx="7"/>
    <rect x="96" y="48" width="16" height="40" rx="7"/>
    <rect x="18" y="86" width="10" height="14" rx="4"/>
    <rect x="92" y="86" width="10" height="14" rx="4"/>`,
  leaves: `
    <ellipse cx="42" cy="62" rx="34" ry="11" transform="rotate(-28 42 62)"/>
    <ellipse cx="70" cy="72" rx="34" ry="11" transform="rotate(-12 70 72)"/>
    <ellipse cx="56" cy="50" rx="32" ry="11" transform="rotate(14 56 50)"/>
    <rect x="54" y="78" width="84" height="12" rx="6" transform="rotate(-8 96 84)"/>`,
  rosette: `
    <circle cx="60" cy="60" r="46" fill="none" stroke="${INK}" stroke-width="9"/>
    <path d="${star(60, 60, 32, 14, 5)}"/>`
};

const PAW = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <ellipse cx="6.1" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="12" cy="6.7" rx="2.2" ry="3.1"/>
    <ellipse cx="17.9" cy="9.2" rx="2.1" ry="2.9"/>
    <ellipse cx="21" cy="14.4" rx="1.8" ry="2.4"/>
    <path d="M12 11.3c3.5 0 6.3 2.7 6.3 5.9 0 2.1-1.7 3.8-3.8 3.8-1.2 0-1.9-.7-2.5-.7s-1.3.7-2.5.7c-2.1 0-3.8-1.7-3.8-3.8 0-3.2 2.8-5.9 6.3-5.9Z"/>
  </svg>`;

function cardHtml({ number, motif, paper, accent, tilt }) {
  const label = String(number).padStart(2, "0");
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Ultra"; src: url("${ultra}") format("woff2"); }
  @font-face { font-family: "Chivo"; font-weight: 400 700; src: url("${chivo}") format("woff2"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 1200px; overflow: hidden; }
  body {
    display: grid;
    place-items: center;
    background: ${INK};
    color: ${INK};
    font-family: "Chivo", sans-serif;
  }
  .sheet {
    position: relative;
    width: 1120px;
    height: 1120px;
    padding: 56px;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: ${paper};
  }
  .sheet::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(${INK} 1.4px, transparent 1.5px);
    background-size: 11px 11px;
    opacity: 0.15;
  }
  .top, .bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
  }
  .top { border-bottom: 5px solid ${INK}; padding-bottom: 18px; }
  .bottom { border-top: 5px solid ${INK}; padding-top: 20px; align-items: flex-end; }
  .brand { font-family: "Ultra", serif; font-size: 52px; line-height: 1; }
  .number { font-family: "Ultra", serif; font-size: 52px; line-height: 1; }
  .bottom span { display: block; margin-top: 6px; color: #6d5b4c; font-size: 21px; }
  .sample { font-size: 25px; font-weight: 700; letter-spacing: 0.08em; }
  .middle {
    position: relative;
    z-index: 1;
    align-self: center;
    justify-self: center;
    display: grid;
    justify-items: center;
    gap: 26px;
    transform: rotate(${tilt}deg);
  }
  .motif {
    display: grid;
    place-items: center;
    width: 250px;
    aspect-ratio: 1;
    border: 8px solid ${INK};
    border-radius: 50%;
    background: ${accent};
  }
  .motif svg { width: 100%; height: 100%; fill: ${INK}; }
  .paw { display: grid; place-items: center; width: 118px; aspect-ratio: 1;
    border: 7px solid ${INK}; border-radius: 50%; transform: rotate(-8deg); }
  .paw svg { width: 60px; fill: ${INK}; }
</style>
</head>
<body>
  <article class="sheet">
    <div class="top">
      <p class="brand">Lucky Elsa</p>
      <p class="number">No. ${label}</p>
    </div>
    <div class="middle">
      <span class="motif"><svg viewBox="0 0 120 120">${motif}</svg></span>
    </div>
    <div class="bottom">
      <p class="sample">SAMPLE PICTURE<span>Platzhalter · ${label}</span></p>
      <span class="paw">${PAW}</span>
    </div>
  </article>
</body>
</html>`;
}

/* Eight different cards. Motif, paper, accent and tilt all move together, so
   a pack of five reads as five different pictures. */
const SPECS = [
  { motif: MOTIFS.bone, paper: "#f6efdf", accent: CREAM, tilt: -3 },
  { motif: MOTIFS.ball, paper: "#efe3c9", accent: MINT, tilt: 2 },
  { motif: MOTIFS.stick, paper: "#f6efdf", accent: MINT, tilt: -2 },
  { motif: MOTIFS.bowl, paper: "#efe3c9", accent: CREAM, tilt: 3 },
  { motif: MOTIFS.rain, paper: "#f2e7d5", accent: MINT, tilt: -4 },
  { motif: MOTIFS.sofa, paper: "#f6efdf", accent: CREAM, tilt: 2 },
  { motif: MOTIFS.leaves, paper: "#efe3c9", accent: MINT, tilt: -1 },
  { motif: MOTIFS.rosette, paper: "#f6efdf", accent: CREAM, tilt: 4 }
];

mkdirSync(demoDir, { recursive: true });
mkdirSync(thumbDir, { recursive: true });

const work = mkdtempSync(join(tmpdir(), "lucky-elsa-demo-"));

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

  for (let index = 0; index < SPECS.length; index += 1) {
    const file = `sample-${String(index + 1).padStart(2, "0")}`;
    const htmlPath = join(work, `${file}.html`);
    const jpgPath = join(demoDir, `${file}.jpg`);
    const thumbPath = join(thumbDir, `${file}.jpg`);

    writeFileSync(htmlPath, cardHtml({ number: index + 1, ...SPECS[index] }));

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
