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
  await page.setViewport(viewport);
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  return page;
}

function check(condition, message) {
  if (!condition) problems.push(message);
}

try {
  const page = await openPage({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll(".wheel__photo").length === 8);
  await shot(page, "desktop-hero");

  results.lang = await page.$eval("html", (el) => el.lang);
  results.headline = await page.$eval("#stage-title", (el) => el.innerText);
  results.overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  results.wheelPhotos = await page.$$eval(".wheel__photo", (nodes) => nodes.length);
  check(results.lang === "de", "Default language is not German.");
  check(results.overflow <= 0, `Desktop page overflows horizontally by ${results.overflow}px.`);

  await page.click("#spin");
  await page.waitForSelector("#photo-dialog[open]");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 450));
  await shot(page, "desktop-dialog");
  results.firstAward = await page.$eval("#photo-title", (el) => el.textContent);
  results.dialogProgress = await page.$eval("#photo-progress", (el) => el.textContent);
  await page.click("#close-dialog");

  await page.click('[data-lang="en"]');
  await page.waitForFunction(() => document.documentElement.lang === "en");
  results.englishHeadline = await page.$eval("#stage-title", (el) => el.innerText);
  results.englishSpin = await page.$eval("#spin", (el) => el.textContent);
  check(results.englishHeadline.includes("Which Elsa"), "English headline did not switch.");
  check(results.englishSpin === "Spin the wheel", "English spin label did not switch.");
  await shot(page, "desktop-english");

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.click("#reset-lap");
  const seen = new Set();
  for (let index = 0; index < 8; index += 1) {
    if (await page.$("#photo-dialog[open]")) await page.click("#close-dialog");
    await page.click("#spin");
    await page.waitForSelector("#photo-dialog[open]");
    seen.add(await page.$eval("#photo-img", (el) => el.getAttribute("src")));
    await page.click("#close-dialog");
  }
  results.uniqueFirstLap = seen.size;
  results.progressAfterLap = await page.$eval("#progress-label", (el) => el.textContent);
  check(seen.size === 8, `First lap showed ${seen.size} unique photos instead of 8.`);
  check(results.progressAfterLap === "8 of 8 seen", `Progress after a lap was "${results.progressAfterLap}".`);

  await page.click("#spin");
  await page.waitForSelector("#photo-dialog[open]");
  results.progressAfterRestart = await page.$eval("#photo-progress", (el) => el.textContent);
  check(results.progressAfterRestart.startsWith("You have seen 1 of 8"), "The lap did not restart on the ninth spin.");
  await page.click("#close-dialog");

  await page.reload({ waitUntil: "networkidle0" });
  results.langAfterReload = await page.$eval("html", (el) => el.lang);
  check(results.langAfterReload === "en", "Language did not persist after reload.");

  await page.goto(`${base}/?photo=sample-03&lang=de`, { waitUntil: "networkidle0" });
  await page.waitForSelector("#photo-dialog[open]");
  results.deepLink = await page.$eval("#photo-title", (el) => el.textContent);
  results.deepLinkLang = await page.$eval("html", (el) => el.lang);
  check(results.deepLinkLang === "de", "?lang=de did not override the stored language.");
  await shot(page, "desktop-deeplink");
  await page.close();

  const mobile = await openPage({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobile.goto(base, { waitUntil: "networkidle0" });
  await mobile.waitForFunction(() => document.querySelectorAll(".wheel__photo").length === 8);
  results.mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  results.mobileLangSwitch = await mobile.$eval(".lang-switch", (el) => el.getBoundingClientRect().width);
  check(results.mobileOverflow <= 0, `Mobile page overflows horizontally by ${results.mobileOverflow}px.`);
  await shot(mobile, "mobile-hero");

  await mobile.click("#spin");
  await mobile.waitForSelector("#photo-dialog[open]");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 450));
  await shot(mobile, "mobile-dialog");
  await mobile.close();

  const empty = await openPage({ width: 1280, height: 800, deviceScaleFactor: 1 });
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
  results.emptySpin = await empty.$eval("#spin", (el) => el.textContent);
  results.emptyAlbum = await empty.$eval("#album-grid", (el) => el.innerText);
  check(results.emptySpin === "Noch keine Fotos", "Empty state did not use the German label.");
  await shot(empty, "desktop-empty");
  await empty.close();

  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
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
