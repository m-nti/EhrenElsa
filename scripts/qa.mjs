#!/usr/bin/env node
// A small smoke test and screenshot pass. Start the site first:
//
//   npm run serve
//   npm run qa
//
// Screenshots go to qa-shots/ by default. Set SHOTS_DIR to change that.
// This is a development helper, not part of the deployed site.

import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const shotsDir = process.env.SHOTS_DIR || join(root, "qa-shots");
const base = process.env.BASE_URL || "http://localhost:4173";
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const channels = [
  chrome,
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
];

mkdirSync(shotsDir, { recursive: true });

const browserPath = channels.find((candidate) => existsSync(candidate));
if (!browserPath) {
  console.error("No Chrome or Chromium found. Set CHROME=/path/to/browser and try again.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: browserPath,
  headless: true,
  args: ["--disable-gpu", "--disable-breakpad", "--disable-crash-reporter", "--no-first-run"]
});

const problems = [];
const results = {};

async function shot(page, name) {
  await page.screenshot({ path: join(shotsDir, `${name}.png`) });
}

async function openPage(viewport) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport(viewport);
  // Smooth scrolling makes click coordinates unreliable in automation.
  await page.evaluateOnNewDocument(() => {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.style.scrollBehavior = "auto";
    });
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  return page;
}

function check(condition, message) {
  if (!condition) problems.push(message);
}

async function openPack(page) {
  if (await page.$("#card-dialog[open]")) await page.click("#close-dialog");
  await page.waitForFunction(() => document.getElementById("open-pack").disabled === false, { timeout: 15000 });
  await page.click("#open-pack");
  await page.waitForFunction(() => document.querySelectorAll("#pack-drop .pack__slot").length === 5, { timeout: 15000 });
  await page.waitForFunction(() => document.getElementById("open-pack").disabled === false, { timeout: 15000 });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
}

try {
  const page = await openPage({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length === 8, { timeout: 15000 });
  await shot(page, "desktop-pack-closed");

  results.lang = await page.$eval("html", (el) => el.lang);
  results.headline = await page.$eval("#stage-title", (el) => el.innerText);
  results.overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  results.binderCards = await page.$$eval("#album-grid .album__item", (nodes) => nodes.length);
  check(results.lang === "de", "Default language is not German.");
  check(results.overflow <= 0, `Desktop page overflows horizontally by ${results.overflow}px.`);

  await openPack(page);
  await shot(page, "desktop-pack-open");

  results.firstPackIds = await page.$$eval("#pack-drop .card", (nodes) => nodes.map((n) => n.dataset.photoId));
  results.rarities = await page.$$eval("#pack-drop .card", (nodes) => nodes.map((n) => n.dataset.rarity));
  results.cardNames = await page.$$eval("#pack-drop .card__name", (nodes) => nodes.map((n) => n.textContent));
  results.hasHit = results.rarities.some((rarity) => rarity !== "common");
  results.firstCardMood = await page.$eval("#pack-drop .card__mood", (el) => el.textContent);
  results.firstCardLine = await page.$eval("#pack-drop .card__line", (el) => el.textContent);

  check(results.firstPackIds.length === 5, `First pack held ${results.firstPackIds.length} cards instead of 5.`);
  check(new Set(results.firstPackIds).size === 5, "A pack repeated a card inside itself.");
  check(results.hasHit, "No holographic or rare card in the pack.");
  check(results.cardNames.every((name) => name && name.length > 1), "A card has no printed name.");

  await page.click("#pack-drop .pack__slot:nth-child(2) .card");
  await page.waitForSelector("#card-dialog[open]");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 400));
  results.dialogName = await page.$eval("#card-full-slot .card__name", (el) => el.textContent);
  results.dialogRarity = await page.$eval("#card-full-slot .card", (el) => el.dataset.rarity);
  await shot(page, "desktop-card");
  await page.click("#close-dialog");

  await page.click('[data-lang="en"]');
  await page.waitForFunction(() => document.documentElement.lang === "en", { timeout: 15000 });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 320));
  results.englishHeadline = await page.$eval("#stage-title", (el) => el.innerText);
  results.englishOpen = await page.$eval("#open-pack", (el) => el.textContent);
  check(results.englishHeadline.includes("What"), "English headline did not switch.");
  check(results.englishOpen === "Open a pack", "English pack button did not switch.");
  await shot(page, "desktop-english");

  await openPack(page);
  results.englishCardName = await page.$eval("#pack-drop .card__name", (el) => el.textContent);
  results.englishMood = await page.$eval("#pack-drop .card__mood", (el) => el.textContent);
  results.englishRarity = await page.$eval("#pack-drop .card__rarity", (el) => el.textContent);
  check(results.englishMood.toLowerCase().startsWith("mood"), "Card mood did not switch to English.");
  check(/Common|Rare|Holo/i.test(results.englishRarity), "Rarity label did not switch to English.");
  await page.click("#pack-drop .pack__slot:nth-child(1) .card");
  await page.waitForSelector("#card-dialog[open]");
  await shot(page, "desktop-english-card");
  await page.click("#close-dialog");

  // Two packs of five cover eight cards; the third one must start over.
  const ids = new Set();
  await page.click("#reset-lap");
  for (let round = 0; round < 2; round += 1) {
    await openPack(page);
    (await page.$$eval("#pack-drop .card", (nodes) => nodes.map((n) => n.dataset.photoId)))
      .forEach((id) => ids.add(id));
  }
  results.uniqueAfterTwoPacks = ids.size;
  results.progressAfterTwoPacks = await page.$eval("#progress-label", (el) => el.textContent);
  check(ids.size === 8, `Two packs showed ${ids.size} unique cards instead of 8.`);
  check(results.progressAfterTwoPacks === "8 of 8 seen", `Progress read "${results.progressAfterTwoPacks}".`);

  await openPack(page);
  results.progressAfterRestart = await page.$eval("#progress-label", (el) => el.textContent);
  check(results.progressAfterRestart.startsWith("5 of 8"), `The lap did not restart: "${results.progressAfterRestart}".`);

  await page.reload({ waitUntil: "networkidle0" });
  results.langAfterReload = await page.$eval("html", (el) => el.lang);
  check(results.langAfterReload === "en", "Language did not persist after reload.");

  await page.goto(`${base}/?photo=elsa-01&lang=de`, { waitUntil: "networkidle0" });
  await page.waitForSelector("#card-dialog[open]");
  results.deepLinkName = await page.$eval("#card-full-slot .card__name", (el) => el.textContent);
  results.deepLinkLang = await page.$eval("html", (el) => el.lang);
  check(results.deepLinkLang === "de", "?lang=de did not override the stored language.");
  await shot(page, "desktop-deeplink");
  await page.close();

  const mobile = await openPage({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobile.goto(base, { waitUntil: "networkidle0" });
  await mobile.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length === 8);
  results.mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(results.mobileOverflow <= 0, `Mobile page overflows horizontally by ${results.mobileOverflow}px.`);
  await shot(mobile, "mobile-pack-closed");

  await openPack(mobile);
  await shot(mobile, "mobile-pack-open");
  await mobile.click("#pack-drop .pack__slot:nth-child(1) .card");
  await mobile.waitForSelector("#card-dialog[open]");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 400));
  await shot(mobile, "mobile-card");
  await mobile.close();

  const empty = await openPage({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await empty.setRequestInterception(true);
  empty.on("request", (request) => {
    if (request.url().includes("photos.json")) {
      request.respond({ status: 200, contentType: "application/json", body: '{"photos":[]}' });
    } else {
      request.continue();
    }
  });
  await empty.goto(base, { waitUntil: "networkidle0" });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  results.emptyPackButton = await empty.$eval("#open-pack", (el) => el.textContent);
  results.emptyBinder = await empty.$eval("#album-grid", (el) => el.innerText);
  check(results.emptyPackButton === "Noch keine Karten", "Empty state did not use the German label.");
  await shot(empty, "desktop-empty");
  await empty.close();

  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await nojs.goto(base, { waitUntil: "networkidle0" });
  results.noscript = await nojs.$eval(".noscript", (el) => el.innerText);
  check(results.noscript.includes("JavaScript"), "No-JS notice is missing.");
  await nojs.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));

if (problems.length) {
  console.error("\nProblems:");
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log(`\nAll checks passed. Screenshots: ${shotsDir}`);
