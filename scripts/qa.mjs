#!/usr/bin/env node
// A small smoke test and screenshot pass. Start the site first:
//
//   npm run serve
//   npm run qa
//
// Screenshots go to qa-shots/ by default. Set SHOTS_DIR to change that.
// This is a development helper, not part of the deployed site.

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(new URL("..", import.meta.url).pathname);
const photoManifest = JSON.parse(readFileSync(join(root, "photos.json"), "utf8"));
const photoCaptions = JSON.parse(readFileSync(join(root, "photos", "captions.json"), "utf8"));
const photoById = new Map((photoManifest.photos || []).map((photo) => [photo.id, photo]));
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
const delay = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

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
    window.__audioContextCreations = 0;
    window.__confettiContextCalls = 0;
    ["AudioContext", "webkitAudioContext"].forEach((name) => {
      const Native = window[name];
      if (typeof Native !== "function") return;
      window[name] = new Proxy(Native, {
        construct(target, args, newTarget) {
          window.__audioContextCreations += 1;
          return Reflect.construct(target, args, newTarget);
        }
      });
    });
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      if (this.id === "confetti-stage") window.__confettiContextCalls += 1;
      return getContext.apply(this, args);
    };
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

async function openPack(page, { inspect = false } = {}) {
  if (await page.$("#card-dialog[open]")) await page.click("#close-dialog");
  if (await page.$("#pack-dialog[open]")) await page.click("#close-pack-dialog");
  await page.waitForFunction(() => document.getElementById("open-pack").disabled === false, { timeout: 15000 });
  if (inspect) {
    await page.evaluate(() => {
      window.__revealOrder = [];
      const list = document.getElementById("pack-drop");
      const observer = new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(".pack__slot")) {
            window.__revealOrder.push({ index: node.style.getPropertyValue("--i"), at: performance.now() });
          }
        }));
      });
      observer.observe(list, { childList: true });
    });
  }
  await page.click("#open-pack");
  await page.waitForSelector("#pack-dialog[open]");
  let openingBounds = null;
  if (inspect) {
    await page.waitForSelector("#pack-dialog.is-revealing");
    await delay(480);
    openingBounds = await page.evaluate(() => {
      const viewport = { width: innerWidth, height: innerHeight };
      const opening = document.querySelector(".pack-dialog__opening").getBoundingClientRect();
      const sachet = document.querySelector(".pack-dialog__sachet").getBoundingClientRect();
      return {
        viewport,
        opening: { x: opening.x, y: opening.y, width: opening.width, height: opening.height },
        sachet: { x: sachet.x, y: sachet.y, width: sachet.width, height: sachet.height },
        centerX: sachet.left + sachet.width / 2,
        centerY: sachet.top + sachet.height / 2
      };
    });
    await shot(page, "desktop-pack-opening");
  }
  await page.waitForFunction(() => {
    const total = document.querySelectorAll("#album-grid .album__item").length;
    return document.querySelectorAll("#pack-drop .pack__slot").length === Math.min(5, total);
  }, { timeout: 15000 });
  await page.waitForFunction(() => document.getElementById("open-pack").disabled === false, { timeout: 15000 });
  await delay(250);
  if (inspect) {
    results.revealOrder = await page.evaluate(() => window.__revealOrder);
    results.packCenter = openingBounds;
  }
}

async function inspectCardDialog(page, name) {
  await delay(340);
  const metrics = await page.evaluate(() => {
    const box = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x * 10) / 10,
        y: Math.round(rect.y * 10) / 10,
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
        top: Math.round(rect.top * 10) / 10,
        right: Math.round(rect.right * 10) / 10,
        bottom: Math.round(rect.bottom * 10) / 10
      };
    };
    const dialog = document.getElementById("card-dialog");
    const card = document.querySelector("#card-full-slot .card--full");
    const actions = dialog.querySelector(".lightbox__actions");
    const close = dialog.querySelector(".lightbox__close");
    const face = card.querySelector(".card__face--back");
    const dialogRect = dialog.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const closeRect = close.getBoundingClientRect();
    const backgroundColor = getComputedStyle(face).backgroundColor;
    const rgba = backgroundColor.match(/rgba?\(([^)]+)\)/);
    const alpha = rgba && rgba[1].split(",")[3] !== undefined ? Number(rgba[1].split(",")[3]) : 1;
    const content = [...card.querySelectorAll(".card__plate,.card__photo,.card__strip,.card__line,.card__stats-label,.card__stats,.card__foot")];
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      dialog: box(dialog),
      card: box(card),
      photo: box(card.querySelector(".card__photo")),
      actions: box(actions),
      close: box(close),
      cardContent: content.map(box),
      scroll: { clientHeight: dialog.clientHeight, scrollHeight: dialog.scrollHeight },
      margins: {
        left: dialogRect.left,
        right: innerWidth - dialogRect.right,
        top: dialogRect.top,
        bottom: innerHeight - dialogRect.bottom
      },
      fit: {
        card: cardRect.top >= dialogRect.top && cardRect.bottom <= dialogRect.bottom,
        actions: actionsRect.top >= dialogRect.top && actionsRect.bottom <= dialogRect.bottom,
        close: closeRect.top >= dialogRect.top && closeRect.bottom <= dialogRect.bottom,
        allCardContent: content.every((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top >= cardRect.top - 1 && rect.bottom <= cardRect.bottom + 1;
        })
      },
      back: {
        backgroundColor,
        alpha,
        opacity: Number(getComputedStyle(face).opacity),
        backgroundImage: getComputedStyle(face).backgroundImage,
        backfaceVisibility: getComputedStyle(face).backfaceVisibility
      },
      cardName: card.querySelector(".card__name").textContent,
      rarity: card.dataset.rarity,
      photoLoaded: card.querySelector(".card__img").complete && card.querySelector(".card__img").naturalWidth > 0,
      statsLabel: card.querySelector(".card__stats-label")?.textContent || "",
      stats: [...card.querySelectorAll(".card__stat")].map((stat) => stat.innerText.replaceAll("\n", " ")),
      focus: document.activeElement.id || document.activeElement.className || document.activeElement.tagName
    };
  });
  results[`${name}Dialog`] = metrics;
  await shot(page, name);
  return metrics;
}

function checkCardGeometry(metrics, label) {
  check(metrics.scroll.scrollHeight <= metrics.scroll.clientHeight + 1, `${label} dialog requires scrolling.`);
  check(metrics.fit.card && metrics.fit.actions && metrics.fit.close && metrics.fit.allCardContent, `${label} clips the card, its content, actions or close button.`);
  check(Math.min(metrics.margins.left, metrics.margins.right, metrics.margins.top, metrics.margins.bottom) >= 12, `${label} modal does not leave viewport margin on every side.`);
  check(metrics.dialog.width <= metrics.viewport.width * 0.9, `${label} modal is too wide for its viewport.`);
  check(metrics.photo.height >= 110, `${label} card art window is too short (${metrics.photo.height}px).`);
  check(Math.min(Math.abs(metrics.actions.x - metrics.card.right), Math.abs(metrics.actions.y - metrics.card.bottom)) <= 40, `${label} action controls are detached from the card.`);
  check(metrics.photoLoaded, `${label} card photo did not load.`);
}

async function openHoloFromPack(page) {
  await openPack(page);
  await page.waitForSelector('#pack-drop .card[data-rarity="holo"]');
  await page.click('#pack-drop .card[data-rarity="holo"]');
  await page.waitForSelector("#card-dialog[open]");
  await delay(340);
}

async function checkPhotoCopy(page, lang, label) {
  const visible = await page.$eval("#card-full-slot .card--full", (card) => ({
    id: card.dataset.photoId,
    name: card.querySelector(".card__name").textContent,
    mood: card.querySelector(".card__mood").textContent,
    description: card.querySelector(".card__copy").textContent,
    photoNote: card.querySelector(".card__print")?.textContent || ""
  }));
  const photo = photoById.get(visible.id);
  const caption = photo && photoCaptions[photo.filename];
  check(Boolean(caption), `${label} photo ${visible.id} has no explicit caption override.`);
  if (caption) {
    check(visible.name === caption.name[lang], `${label} card name does not match the ${lang} photo override.`);
    check(visible.mood.includes(caption.mood[lang]), `${label} card mood does not match the ${lang} photo override.`);
    check(visible.description === caption.description[lang], `${label} card story does not match the ${lang} photo override.`);
    check(visible.photoNote === `${lang === "de" ? "Im Bild" : "In the photo"}: ${caption.alt[lang]}`, `${label} visible photo note does not match the ${lang} alt override.`);
  }
  return visible;
}

async function checkFoilMoves(page, label) {
  const bounds = await page.$eval("#card-full-slot .card", (card) => {
    const rect = card.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await delay(220);
  const first = await page.$eval("#card-full-slot .card__face--front", (face) => [face.style.getPropertyValue("--px"), face.style.getPropertyValue("--py"), face.style.getPropertyValue("--hyp"), face.style.getPropertyValue("--bp")]);
  await page.mouse.move(bounds.x + bounds.width - 8, bounds.y + bounds.height - 8);
  await delay(220);
  const second = await page.$eval("#card-full-slot .card__face--front", (face) => [face.style.getPropertyValue("--px"), face.style.getPropertyValue("--py"), face.style.getPropertyValue("--hyp"), face.style.getPropertyValue("--bp")]);
  results[`${label}Foil`] = { first, second };
  check(first[0] !== second[0] && first[1] !== second[1] && first[2] !== second[2] && first[3] !== second[3], `${label} pointer tilt did not move all foil coordinates.`);
}

try {
  const page = await openPage({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0, { timeout: 15000 });
  await shot(page, "desktop-pack-closed");

  results.lang = await page.$eval("html", (el) => el.lang);
  results.headline = await page.$eval("#stage-title", (el) => el.innerText);
  results.overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  results.binderCards = await page.$$eval("#album-grid .album__item", (nodes) => nodes.length);
  const totalCards = results.binderCards;
  check(results.lang === "de", "Default language is not German.");
  check(results.overflow <= 0, `Desktop page overflows horizontally by ${results.overflow}px.`);
  results.brandCheck = await page.evaluate(() => ({ title: document.title, bodyHasOldBrand: /Lucky Elsa|EhrenElsa/i.test(document.body.innerText), ogTitle: document.querySelector('meta[property="og:title"]')?.content }));
  check(results.brandCheck.title.startsWith("Elsen") && results.brandCheck.ogTitle === "Elsen" && !results.brandCheck.bodyHasOldBrand, "Visible title or Open Graph brand is not consistently Elsen.");

  const captionsAudit = photoManifest.photos.filter((photo) => !photo.demo).map((photo) => {
    const caption = photoCaptions[photo.filename];
    return { filename: photo.filename, complete: Boolean(caption?.name?.de && caption?.name?.en && caption?.mood?.de && caption?.mood?.en && caption?.description?.de && caption?.description?.en && caption?.alt?.de && caption?.alt?.en) };
  });
  results.photoCaptionAudit = captionsAudit;
  check(captionsAudit.length === 10 && captionsAudit.every((photo) => photo.complete), "Not all ten real photos have bilingual name, mood, description and alt text.");

  await openPack(page, { inspect: true });
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
  check(results.rarities.includes("holo"), "The pack did not guarantee a holographic card.");
  check(results.cardNames.every((name) => name && name.length > 1), "A card has no printed name.");
  const revealTimes = results.revealOrder.map((entry) => entry.at);
  check(results.revealOrder.length === 5, `Reveal observer saw ${results.revealOrder.length} cards, not five.`);
  check(results.revealOrder.map((entry) => entry.index).join(",") === "0,1,2,3,4", "Cards did not reveal in numbered order.");
  check(revealTimes.slice(1).every((time, index) => time - revealTimes[index] >= 100), "Cards appeared simultaneously instead of one by one.");
  check(Math.abs(results.packCenter.centerX - results.packCenter.viewport.width / 2) <= 24, "The opening sachet is not centered horizontally.");
  check(Math.abs(results.packCenter.centerY - results.packCenter.viewport.height / 2) <= 40, "The opening sachet is not centered vertically.");

  await page.click('#pack-drop .card[data-rarity="holo"]');
  await page.waitForSelector("#card-dialog[open]");
  await delay(340);
  results.dialogName = await page.$eval("#card-full-slot .card__name", (el) => el.textContent);
  results.dialogRarity = await page.$eval("#card-full-slot .card", (el) => el.dataset.rarity);
  check(results.dialogRarity === "holo", "Opening the guaranteed holo from the pack lost its rarity.");
  const desktopDialog = await inspectCardDialog(page, "desktop-card");
  checkCardGeometry(desktopDialog, "1280x900");
  check(desktopDialog.back.alpha >= 0.99 && desktopDialog.back.opacity >= 0.99, "Card back is not opaque.");
  check(desktopDialog.back.backgroundImage.includes("repeating-radial-gradient"), "Card back guilloche pattern is missing.");
  check(desktopDialog.statsLabel.includes("Fantasiewerte"), "The playful values are not visibly marked as imaginary.");
  check(desktopDialog.stats.length === 3, `Expected three photo-matched play values, got ${desktopDialog.stats.length}.`);
  results.realHoloPhotoCopy = await checkPhotoCopy(page, "de", "desktop holo");

  await page.focus("#card-full-slot .card--full");
  await page.keyboard.press("Enter");
  results.keyboardFlipped = await page.$eval("#card-full-slot .card", (el) => el.dataset.flipped === "true" && el.getAttribute("aria-pressed") === "true");
  results.backAria = await page.$eval("#card-full-slot .card", (el) => ({ front: el.querySelector(".card__face--front").getAttribute("aria-hidden"), back: el.querySelector(".card__face--back").getAttribute("aria-hidden"), background: getComputedStyle(el.querySelector(".card__face--back")).backgroundColor }));
  check(results.keyboardFlipped, "Enter did not flip the focused card.");
  check(results.backAria.front === "true" && results.backAria.back === "false", "The flipped card's accessible face did not update.");
  check(results.backAria.background.startsWith("rgb("), "The back face has no opaque base color.");
  await page.keyboard.press("Space");
  check(await page.$eval("#card-full-slot .card", (el) => el.dataset.flipped === "false"), "Space did not flip the card back to its front.");
  await page.keyboard.press("Enter");
  await delay(740);
  await shot(page, "desktop-card-back");
  await page.keyboard.press("f");
  await delay(740);

  await checkFoilMoves(page, "desktop");

  await page.click("#close-dialog");
  check(await page.evaluate(() => document.activeElement.matches("#pack-drop .card[data-rarity='holo']")), "Closing the card did not return focus to its pack card.");
  await page.click("#close-pack-dialog");

  await page.click('[data-lang="en"]');
  await page.waitForFunction(() => document.documentElement.lang === "en", { timeout: 15000 });
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 320));
  results.englishHeadline = await page.$eval("#stage-title", (el) => el.innerText);
  results.englishOpen = await page.$eval("#open-pack", (el) => el.textContent);
  check(results.englishHeadline.includes("Five cards"), "English headline did not switch.");
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

  // Open enough packs to see the full set, then confirm the next pack restarts.
  const ids = new Set();
  if (await page.$("#pack-dialog[open]")) await page.click("#close-pack-dialog");
  await page.click("#reset-lap");
  for (let round = 0; round < Math.ceil(totalCards / 5); round += 1) {
    await openPack(page);
    (await page.$$eval("#pack-drop .card", (nodes) => nodes.map((n) => n.dataset.photoId)))
      .forEach((id) => ids.add(id));
  }
  results.uniqueAfterTwoPacks = ids.size;
  results.progressAfterFullSet = await page.$eval("#progress-label", (el) => el.textContent);
  check(ids.size === totalCards, `Packs showed ${ids.size} unique cards instead of ${totalCards}.`);
  check(results.progressAfterFullSet === `${totalCards} of ${totalCards} seen`, `Progress read "${results.progressAfterFullSet}".`);

  await openPack(page);
  results.progressAfterRestart = await page.$eval("#progress-label", (el) => el.textContent);
  check(results.progressAfterRestart.startsWith(`${Math.min(5, totalCards)} of ${totalCards}`), `The set did not restart: "${results.progressAfterRestart}".`);

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

  const desktopCompact = await openPage({ width: 886, height: 741, deviceScaleFactor: 2 });
  await desktopCompact.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await desktopCompact.evaluate(() => localStorage.clear());
  await desktopCompact.reload({ waitUntil: "networkidle0" });
  await desktopCompact.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length === 10);
  await openHoloFromPack(desktopCompact);
  const dialog886 = await inspectCardDialog(desktopCompact, "card-886x741");
  results.rarity886 = dialog886.rarity;
  check(dialog886.rarity === "holo", "886x741 verification card is not holo.");
  checkCardGeometry(dialog886, "886x741");
  check(dialog886.margins.left >= 40 && dialog886.margins.top >= 40, "886x741 dialog lacks generous visual breathing room.");
  check(dialog886.back.alpha >= 0.99 && dialog886.back.opacity >= 0.99, "886x741 card back is translucent.");
  results.photoCopy886 = await checkPhotoCopy(desktopCompact, "de", "886x741");
  await checkFoilMoves(desktopCompact, "886x741");
  await desktopCompact.keyboard.press("Escape");
  await desktopCompact.click("#close-pack-dialog");
  await desktopCompact.close();

  const mobile = await openPage({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobile.goto(base, { waitUntil: "networkidle0" });
  await mobile.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0);
  results.mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(results.mobileOverflow <= 0, `Mobile page overflows horizontally by ${results.mobileOverflow}px.`);
  await shot(mobile, "mobile-pack-closed");

  await mobile.click("#album-grid .card--tile");
  await mobile.waitForSelector("#card-dialog[open]");
  await delay(340);
  results.binderAudioBefore = await mobile.evaluate(() => window.__audioContextCreations);
  results.binderConfettiBefore = await mobile.evaluate(() => window.__confettiContextCalls);
  await mobile.click("#close-dialog");
  await delay(30);
  results.binderAudioAfter = await mobile.evaluate(() => window.__audioContextCreations);
  results.binderConfettiAfter = await mobile.evaluate(() => window.__confettiContextCalls);
  check(results.binderAudioAfter === results.binderAudioBefore, "Opening a binder card created or played audio.");
  check(results.binderConfettiAfter === results.binderConfettiBefore, "Opening a binder card created confetti.");

  await openPack(mobile);
  await shot(mobile, "mobile-pack-open");
  await mobile.click('#pack-drop .card[data-rarity="holo"]');
  await mobile.waitForSelector("#card-dialog[open]");
  const dialog390 = await inspectCardDialog(mobile, "mobile-card");
  results.mobileDialogScroll = dialog390.scroll.scrollHeight - dialog390.scroll.clientHeight;
  checkCardGeometry(dialog390, "390x844");
  check(dialog390.rarity === "holo", "390x844 screenshot card is not holo.");
  await checkPhotoCopy(mobile, "de", "390x844");
  await checkFoilMoves(mobile, "390x844");
  await mobile.keyboard.press("Escape");
  await mobile.click("#close-pack-dialog");
  await mobile.close();

  const compact = await openPage({ width: 326, height: 650, deviceScaleFactor: 2 });
  await compact.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await compact.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length > 0);
  await compact.evaluate(() => localStorage.clear());
  await compact.reload({ waitUntil: "networkidle0" });
  await compact.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length === 10);
  await openHoloFromPack(compact);
  const dialog326 = await inspectCardDialog(compact, "mobile-compact-card");
  results.compactDialogScroll = dialog326.scroll.scrollHeight - dialog326.scroll.clientHeight;
  checkCardGeometry(dialog326, "326x650");
  check(dialog326.rarity === "holo", "326x650 screenshot card is not holo.");
  check(dialog326.margins.left >= 12 && dialog326.margins.top >= 20, "326x650 modal is too close to viewport edges.");
  await checkPhotoCopy(compact, "de", "326x650");
  await checkFoilMoves(compact, "326x650");
  await compact.keyboard.press("Escape");
  await compact.click("#close-pack-dialog");
  await compact.close();

  const reduced = await openPage({ width: 390, height: 844, deviceScaleFactor: 1 });
  await reduced.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reduced.goto(`${base}/?lang=de`, { waitUntil: "networkidle0" });
  await reduced.waitForFunction(() => document.querySelectorAll("#album-grid .album__item").length === 10);
  await openPack(reduced);
  results.reducedMotion = await reduced.evaluate(() => ({
    preference: matchMedia("(prefers-reduced-motion: reduce)").matches,
    openingState: document.getElementById("pack-dialog").classList.contains("is-revealing"),
    animations: [...document.querySelectorAll("#pack-drop .pack__slot")].map((slot) => getComputedStyle(slot).animationName),
    cards: document.querySelectorAll("#pack-drop .card").length
  }));
  check(results.reducedMotion.preference && !results.reducedMotion.openingState, "Reduced motion still ran the wrapper-opening animation.");
  check(results.reducedMotion.cards === 5 && results.reducedMotion.animations.every((name) => name === "none"), "Reduced-motion pack did not reveal five cards without animation.");
  await reduced.close();

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
