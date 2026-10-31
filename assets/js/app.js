(() => {
  "use strict";

  const COPY = {
    de: {
      title: "Lucky Elsa — ein Pack voller Elsa-Karten",
      description: "Pack öffnen und fünf zufällige Karten von Elsa bekommen. Jede Karte hat ihren eigenen Titel, ihre Laune und ihre Werte.",
      ogTitle: "Lucky Elsa",
      ogDescription: "Ein Pack voller Elsa-Karten. Öffne es und schau, was drin ist.",
      skip: "Direkt zum Pack",
      wordmarkLabel: "Lucky Elsa, zurück zum Pack",
      menuLabel: "Hauptmenü",
      navBinder: "Sammelheft",
      languageLabel: "Sprache",
      soundLabel: "Ton",
      soundOn: "Ton an",
      soundOff: "Ton aus",
      headline: "Was steckt<br>im Pack?",
      lede: "Fünf Karten auf einmal, mindestens eine davon holografisch. Es gehen alle einmal durch, bevor das Pack von vorn beginnt.",
      openPack: "Pack öffnen",
      openPackLabel: "Ein Pack Elsa-Karten öffnen",
      seriesLabel: "Serie I",
      opening: "Pack wird geöffnet",
      seeBinder: "Sammelheft ansehen",
      packCaption: "Fünf Karten, mindestens eine mit Folie.",
      packHint: "Drück <kbd>P</kbd>, um ein Pack zu öffnen.",
      progressLoading: "Karten werden gesucht",
      progressNote: "Jede Karte kommt einmal dran, bevor das Pack von vorn beginnt.",
      binderTitle: "Sammelheft",
      binderLede: "Alle Karten, die es gibt. Öffne eine und schau, was darauf steht.",
      binderLabel: "Alle Karten von Elsa",
      dropLabel: "Die Karten aus diesem Pack",
      albumCountLoading: "Karten werden geladen",
      reset: "Von vorn",
      demoNote: "Das hier sind Beispielkarten. Die echten Fotos fehlen noch.",
      mixedNote: "Ein paar Karten sind noch Platzhalter. Die echten Fotos kommen dazu, sobald sie da sind.",
      loadingDots: "Karten werden geladen…",
      footerLine: "Zu Hause für Elsa gebaut. Keine Anmeldung, nichts wird getrackt.",
      backToTop: "Nach oben",
      closeCard: "Diese Karte schließen",
      openAnother: "Noch ein Pack",
      savePhoto: "Foto speichern",
      share: "Teilen",
      dialogHint: "Mit <kbd>←</kbd> und <kbd>→</kbd> durch die Karten gehen.",
      noscript: "Das Pack braucht JavaScript. Die Karten liegen trotzdem im Ordner <code>photos</code>.",
      photoAlt: "Elsa, Karte {number}",
      cardNumber: "Nr. {number}",
      seenTag: "gesehen",
      seenLabel: "{seen} von {total} gesehen",
      cardCount: "{total} Karten",
      cardCountOne: "1 Karte",
      demoCount: "{total} Beispielkarten",
      demoCountOne: "1 Beispielkarte",
      openCardLabel: "Karte {number} öffnen: {name}",
      openCardSeenLabel: "Karte {number} öffnen: {name}, schon gehabt",
      emptyShort: "Noch keine Karten",
      emptyBinderCount: "Noch nichts da",
      emptyLine: "Hier sind noch keine Karten. Leg Elsa-Fotos in den Ordner photos und führe dann aus:",
      binderEmpty: "Noch keine Karten. Leg Elsa-Fotos in den Ordner photos und führe dann npm run photos aus.",
      openingAnnounce: "Das Pack geht auf.",
      packAnnounce: "{count} Karten: {names}.",
      restartAnnounce: "Von vorn. Alle Karten können wieder kommen.",
      lastOneAnnounce: "Das waren alle Karten. Jetzt beginnt das Pack von vorn.",
      languageAnnounce: "Auf Deutsch umgestellt.",
      shared: "Geteilt.",
      linkCopied: "Link kopiert.",
      linkCopyFailed: "Link konnte nicht kopiert werden. Er steht oben in der Adresszeile.",
      shareTitle: "{name} — eine Elsa-Karte",
      shareText: "Ich habe Elsa gezogen: {name}.",
      moodLabel: "Laune",
      packProgressDefault: "Du hast 1 von 24 gesehen.",
      dialogProgress: "Du hast {seen} von {total} gesehen.",
      dialogProgressAll: "Du hast alle {total} gesehen. Das Pack beginnt von vorn.",
      cardPrint: "Serie I · {number} von {total}"
    },
    en: {
      title: "Lucky Elsa — a pack of Elsa cards",
      description: "Open a pack and get five random cards of Elsa. Every card keeps its own title, mood and ratings.",
      ogTitle: "Lucky Elsa",
      ogDescription: "A pack of Elsa cards. Open it and see what is inside.",
      skip: "Skip to the pack",
      wordmarkLabel: "Lucky Elsa, back to the pack",
      menuLabel: "Main",
      navBinder: "Binder",
      languageLabel: "Language",
      soundLabel: "Sound",
      soundOn: "Sound on",
      soundOff: "Sound off",
      headline: "What's in<br>the pack?",
      lede: "Five cards at a time, at least one of them holographic. Every card comes up once before the pack starts over.",
      openPack: "Open a pack",
      openPackLabel: "Open a pack of Elsa cards",
      seriesLabel: "Series I",
      opening: "Opening",
      seeBinder: "See the binder",
      packCaption: "Five cards, at least one of them foiled.",
      packHint: "Press <kbd>P</kbd> to open a pack.",
      progressLoading: "Finding the cards",
      progressNote: "Every card comes up once before the pack starts over.",
      binderTitle: "Binder",
      binderLede: "Every card there is. Open one and see what it says.",
      binderLabel: "All cards of Elsa",
      dropLabel: "The cards in this pack",
      albumCountLoading: "Loading cards",
      reset: "Start over",
      demoNote: "These are sample cards. The real photos are not in yet.",
      mixedNote: "A few cards are still placeholders. Real photos take their place as they arrive.",
      loadingDots: "Loading cards…",
      footerLine: "Made at home for Elsa. No accounts, nothing tracked.",
      backToTop: "Back to the top",
      closeCard: "Close this card",
      openAnother: "Another pack",
      savePhoto: "Save this photo",
      share: "Share",
      dialogHint: "Use <kbd>←</kbd> and <kbd>→</kbd> to go through the cards.",
      noscript: "The pack needs JavaScript. The cards are still in the <code>photos</code> folder.",
      photoAlt: "Elsa, card {number}",
      cardNumber: "No. {number}",
      seenTag: "seen",
      seenLabel: "{seen} of {total} seen",
      cardCount: "{total} cards",
      cardCountOne: "1 card",
      demoCount: "{total} sample cards",
      demoCountOne: "1 sample card",
      openCardLabel: "Open card {number}: {name}",
      openCardSeenLabel: "Open card {number}: {name}, already had it",
      emptyShort: "No cards yet",
      emptyBinderCount: "Nothing here yet",
      emptyLine: "There are no cards here yet. Put Elsa's photos in the photos folder, then run:",
      binderEmpty: "No cards yet. Put Elsa's photos in the photos folder, then run npm run photos.",
      openingAnnounce: "Opening the pack.",
      packAnnounce: "{count} cards: {names}.",
      restartAnnounce: "Starting over. Every card can come up again.",
      lastOneAnnounce: "That was every card. The pack starts over.",
      languageAnnounce: "Switched to English.",
      shared: "Shared.",
      linkCopied: "Link copied.",
      linkCopyFailed: "Could not copy the link. It is up in the address bar.",
      shareTitle: "{name} — an Elsa card",
      shareText: "I pulled Elsa: {name}.",
      moodLabel: "Mood",
      packProgressDefault: "You have seen 1 of 24.",
      dialogProgress: "You have seen {seen} of {total}.",
      dialogProgressAll: "You have seen all {total}. The pack starts over.",
      cardPrint: "Series I · {number} of {total}"
    }
  };

  const FALLBACK_BANK = {
    de: {
      names: ["Elsa"], lines: ["Ein guter Hund."], moods: ["zufrieden"],
      stats: [{ de: "Energie", en: "Energy" }],
      rarities: { common: "Häufig", rare: "Selten", holo: "Holo" }
    },
    en: {
      names: ["Elsa"], lines: ["A good dog."], moods: ["content"],
      stats: [{ de: "Energie", en: "Energy" }],
      rarities: { common: "Common", rare: "Rare", holo: "Holo" }
    }
  };

  const STORAGE = {
    seen: "lucky-elsa.seen.v1",
    sound: "lucky-elsa.sound.v1",
    lang: "lucky-elsa.lang.v1"
  };

  const PACK_SIZE = 5;
  const HOLO_THRESHOLD = 88;
  const RARE_THRESHOLD = 64;
  const HEIC_PATTERN = /\.(heic|heif)(?:[?#].*)?$/i;
  const HEIC_LIBRARY = "assets/vendor/heic2any/heic2any.min.js";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const state = {
    lang: "de",
    photos: [],
    seen: new Set(),
    sound: true,
    hasSamples: false,
    allSamples: false,
    pack: [],
    opening: false,
    current: null,
    needsRestart: false,
    statusTimer: null,
    reduceMotion: motionQuery.matches
  };

  const els = {};
  let audioContext = null;
  let noiseBuffer = null;
  let heicLibrary = null;
  const heicCache = new Map();

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    state.lang = detectLanguage();
    document.documentElement.lang = state.lang;
    writeStorage(STORAGE.lang, state.lang);

    applyStaticCopy();
    updateLangUi();
    loadPreferences();
    bindEvents();
    updateSoundUi();

    try {
      state.photos = await loadPhotos();
    } catch (error) {
      console.error(error);
      state.photos = [];
    }

    if (!state.photos.length) {
      renderEmpty();
      return;
    }

    pruneSeen();
    state.hasSamples = state.photos.some((photo) => photo.demo);
    state.allSamples = state.photos.every((photo) => photo.demo);
    updateProgress();
    renderBinder();

    const requested = new URLSearchParams(window.location.search).get("photo");
    if (requested) {
      const photo = state.photos.find((item) => item.id === requested);
      if (photo) openCard(photo, { updateUrl: false });
    }
  }

  function cacheElements() {
    els.openPack = document.getElementById("open-pack");
    els.packSeal = document.getElementById("pack-seal");
    els.packDrop = document.getElementById("pack-drop");
    els.progressLabel = document.getElementById("progress-label");
    els.progressTrack = document.getElementById("progress-track");
    els.progressFill = document.getElementById("progress-fill");
    els.mastheadCount = document.getElementById("masthead-count");
    els.binderCount = document.getElementById("album-count");
    els.binderGrid = document.getElementById("album-grid");
    els.reset = document.getElementById("reset-lap");
    els.demoNote = document.getElementById("demo-note");
    els.soundToggle = document.getElementById("sound-toggle");
    els.dialog = document.getElementById("card-dialog");
    els.fullSlot = document.getElementById("card-full-slot");
    els.save = document.getElementById("save-card");
    els.share = document.getElementById("share-card");
    els.close = document.getElementById("close-dialog");
    els.openAnother = document.getElementById("open-another");
    els.shareStatus = document.getElementById("share-status");
    els.live = document.getElementById("live");
    els.lightboxInner = document.querySelector(".lightbox__inner");
    els.confettiStage = document.getElementById("confetti-stage");
    els.confettiCard = document.getElementById("confetti-card");
  }

  function bindEvents() {
    els.openPack.addEventListener("click", openPack);
    els.packSeal.addEventListener("click", openPack);
    els.openAnother.addEventListener("click", () => {
      els.dialog.close();
      window.setTimeout(openPack, 160);
    });
    els.close.addEventListener("click", () => els.dialog.close());
    els.share.addEventListener("click", shareCurrent);
    els.reset.addEventListener("click", resetLap);
    els.soundToggle.addEventListener("click", toggleSound);

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.lang));
    });

    els.dialog.addEventListener("close", onDialogClose);
    els.dialog.addEventListener("click", (event) => {
      if (event.target === els.dialog) els.dialog.close();
    });

    els.packDrop.addEventListener("click", (event) => {
      const card = event.target.closest("[data-photo-id]");
      if (!card || state.opening) return;
      const photo = state.photos.find((item) => item.id === card.dataset.photoId);
      if (photo) openCard(photo);
    });

    els.binderGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-photo-id]");
      if (!card || state.opening) return;
      const photo = state.photos.find((item) => item.id === card.dataset.photoId);
      if (photo) openCard(photo);
    });

    document.addEventListener("keydown", onKeydown);

    bindCardShine(els.packDrop);
    bindCardShine(els.binderGrid);
    bindCardShine(els.fullSlot);

    document.addEventListener("error", (event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement && target.dataset.heic === "true") {
        convertHeicImage(target);
      }
    }, true);

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", (event) => {
        state.reduceMotion = event.matches;
      });
    }
  }

  async function loadPhotos() {
    const fromPhp = await fetchJson("photos.php?list=1", 3000);
    if (fromPhp && Array.isArray(fromPhp.photos) && fromPhp.photos.length) {
      return normalizePhotos(fromPhp.photos);
    }

    const manifest = await fetchJson(`photos.json?ts=${Date.now()}`, 4000);
    if (manifest && Array.isArray(manifest.photos)) {
      return normalizePhotos(manifest.photos);
    }

    return [];
  }

  async function fetchJson(url, timeout) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function normalizePhotos(rawPhotos) {
    const used = new Set();
    const normalized = [];

    rawPhotos.forEach((raw, index) => {
      if (!raw || typeof raw !== "object") return;
      const src = String(raw.src || raw.file || "");
      if (!src) return;

      const filename = String(raw.filename || src.split("/").pop() || `photo-${index + 1}`);
      let id = slugify(String(raw.id || filename.replace(/\.[^.]+$/, ""))) || `photo-${index + 1}`;
      let attempt = 2;
      while (used.has(id)) {
        id = `${slugify(String(raw.id || filename.replace(/\.[^.]+$/, "")))}-${attempt}`;
        attempt += 1;
      }
      used.add(id);

      const text = (value) => (typeof value === "string" ? value.trim() : "");

      normalized.push({
        id,
        src,
        thumb: String(raw.thumb || src),
        view: String(raw.view || src),
        filename,
        caption: text(raw.caption),
        alt: text(raw.alt),
        name: text(raw.name),
        mood: text(raw.mood),
        description: text(raw.description),
        rarity: text(raw.rarity),
        demo: Boolean(raw.demo),
        heic: Boolean(raw.heic) || HEIC_PATTERN.test(src),
        width: Number(raw.width) || 1200,
        height: Number(raw.height) || 1200
      });
    });

    return normalized;
  }

  function slugify(value) {
    return value
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function detectLanguage() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "de" || param === "en") return param;

    const stored = readStorage(STORAGE.lang);
    if (stored === "de" || stored === "en") return stored;

    return "de";
  }

  function t(key, vars) {
    let value = COPY[state.lang][key];
    if (typeof value !== "string") value = COPY.en[key] || key;

    if (vars) {
      Object.entries(vars).forEach(([name, replacement]) => {
        value = value.split(`{${name}}`).join(String(replacement));
      });
    }

    return value;
  }

  function bank() {
    const source = window.ELSA_CARD_BANK || FALLBACK_BANK;
    return source[state.lang] || source.en || FALLBACK_BANK.en;
  }

  function applyStaticCopy() {
    document.title = t("title");

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("description"));
    setMeta("og:title", t("ogTitle"));
    setMeta("og:description", t("ogDescription"));
    setMeta("og:locale", state.lang === "de" ? "de_DE" : "en_US");

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = COPY[state.lang][node.dataset.i18n];
      if (typeof value === "string") node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const value = COPY[state.lang][node.dataset.i18nHtml];
      if (typeof value === "string") node.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      const value = COPY[state.lang][node.dataset.i18nAriaLabel];
      if (typeof value === "string") node.setAttribute("aria-label", value);
    });
  }

  function setMeta(key, content) {
    const node = document.querySelector(`meta[property="${key}"]`) ||
      document.querySelector(`meta[name="${key}"]`);
    if (node) node.setAttribute("content", content);
  }

  function updateLangUi() {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function setLanguage(code) {
    if (!COPY[code] || code === state.lang) return;

    state.lang = code;
    document.documentElement.lang = code;
    writeStorage(STORAGE.lang, code);

    applyStaticCopy();
    updateLangUi();
    updateSoundUi();

    if (state.photos.length) {
      updateProgress();
      renderBinder();
      renderPack();
      if (state.current) openCard(state.current, { updateUrl: false });
    } else {
      renderEmpty();
    }

    updateLangUrl();
    updateDocumentTitle();
    announce(t("languageAnnounce"));
  }

  function updateLangUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", state.lang);
    window.history.replaceState(null, "", url);
  }

  function updateDocumentTitle() {
    document.title = state.current
      ? `${cardFor(state.current).name} — Lucky Elsa`
      : t("title");
  }

  function loadPreferences() {
    const storedSound = readStorage(STORAGE.sound);
    if (typeof storedSound === "boolean") {
      state.sound = storedSound;
    }

    const storedSeen = readStorage(STORAGE.seen);
    if (Array.isArray(storedSeen)) {
      state.seen = new Set(storedSeen.filter((id) => typeof id === "string"));
    }
  }

  function readStorage(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // A private window can refuse storage; the packs still work for this visit.
    }
  }

  function pruneSeen() {
    const ids = new Set(state.photos.map((photo) => photo.id));
    let changed = false;
    state.seen.forEach((id) => {
      if (!ids.has(id)) {
        state.seen.delete(id);
        changed = true;
      }
    });
    if (changed) writeStorage(STORAGE.seen, [...state.seen]);
  }

  function unseenPhotos() {
    return state.photos.filter((photo) => !state.seen.has(photo.id));
  }

  function seenCountNow() {
    return state.photos.reduce((count, photo) => count + (state.seen.has(photo.id) ? 1 : 0), 0);
  }

  function hashOf(value) {
    let hash = 5381;
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  }

  /* Card identity walks through the bank by the photo's position instead of by
     a hash, so two cards in the same pack never wear the same name. The steps
     are coprime with the list lengths, which spreads them until the bank is
     used up, and the choice still belongs to the photo, not to the shuffle. */
  function pickAt(list, ordinal, step) {
    if (!list || !list.length) return "";
    return list[(ordinal * step) % list.length];
  }

  function rarityOf(photo) {
    if (photo.rarity === "holo" || photo.rarity === "rare" || photo.rarity === "common") {
      return photo.rarity;
    }

    const roll = hashOf(`${photo.id}#rarity`) % 100;
    if (roll >= HOLO_THRESHOLD) return "holo";
    if (roll >= RARE_THRESHOLD) return "rare";
    return "common";
  }

  function localized(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const direct = value[state.lang];
      if (typeof direct === "string") return direct;
      return typeof value.en === "string" ? value.en : "";
    }
    return "";
  }

  function cardFor(photo) {
    const index = state.photos.findIndex((item) => item.id === photo.id);
    const number = index + 1;
    const deck = bank();
    const stats = (deck.stats || []).slice(0, 3).map((stat, position) => ({
      key: localized(stat.key) || localized(stat) || "—",
      value: 1 + (hashOf(`${photo.id}#stat${position}`) % 10)
    }));

    return {
      photo,
      index,
      number,
      name: photo.name || pickAt(deck.names, index, 7) || "Elsa",
      line: photo.description || photo.caption || pickAt(deck.lines, index, 7),
      mood: photo.mood || pickAt(deck.moods, index, 5),
      rarity: rarityOf(photo),
      stats
    };
  }

  function rarityLabel(rarity) {
    const deck = bank();
    const entry = (deck.rarities || {})[rarity];
    if (!entry) return rarity;
    return localized(entry.label) || localized(entry) || rarity;
  }

  function rarityFlavour(rarity) {
    const deck = bank();
    const entry = (deck.rarities || {})[rarity];
    return entry ? localized(entry.flavour) : "";
  }

  /* The card anatomy, top to bottom: a name plate with number, name, mood and
     the rarity chip, the art window with its holographic layers, a category
     strip with the rarity stars, the ability panel (keyword, funny line,
     flavour quote), three stat chips and the serial row.
     A tile keeps the name, the stars and the photo; the drop compresses the
     ability panel to the keyword and the line. */
  const CARD_STARS = { common: 3, rare: 4, holo: 5 };
  const CARD_STAR_PATH = "M12 2.4l2.7 5.9 6.4.9-4.7 4.5 1.2 6.4L12 17.2l-5.6 2.9 1.2-6.4L2.9 9.2l6.4-.9z";

  function cardSpan(className, text) {
    const node = document.createElement("span");
    node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function cardStars(rarity) {
    const row = cardSpan("card__stars");
    row.setAttribute("aria-hidden", "true");
    const lit = CARD_STARS[rarity] || CARD_STARS.common;
    const parts = [];
    for (let index = 0; index < 5; index += 1) {
      const litClass = index < lit ? " card__star--on" : "";
      parts.push('<svg class="card__star' + litClass + '" viewBox="0 0 24 24" focusable="false"><path d="' + CARD_STAR_PATH + '"/></svg>');
    }
    row.innerHTML = parts.join("");
    return row;
  }

  function cardElement(photo, size) {
    const card = cardFor(photo);
    const node = document.createElement("button");
    node.type = "button";
    node.className = `card card--${size}`;
    node.dataset.rarity = card.rarity;
    node.dataset.photoId = photo.id;
    node.setAttribute("aria-label", t(state.seen.has(photo.id) ? "openCardSeenLabel" : "openCardLabel", {
      number: pad2(card.number),
      name: card.name
    }));

    const foil = cardSpan("card__foil");
    foil.setAttribute("aria-hidden", "true");

    const frame = cardSpan("card__frame");
    frame.setAttribute("aria-hidden", "true");

    /* 1 · the name plate: number, name, mood, rarity chip */
    const plate = cardSpan("card__plate");
    plate.append(
      cardSpan("card__number", t("cardNumber", { number: pad2(card.number) })),
      cardSpan("card__name", card.name)
    );

    if (size !== "tile") {
      const mood = cardSpan("card__mood", card.mood);
      /* The label rides along for screen readers; the face prints the mood alone. */
      mood.prepend(cardSpan("visually-hidden", `${t("moodLabel")}: `));
      plate.append(mood);
    }

    const rarity = cardSpan("card__rarity", rarityLabel(card.rarity));
    const flavour = rarityFlavour(card.rarity);
    if (flavour) rarity.title = flavour;
    plate.append(rarity);

    /* 2 · the art window: photo, holographic rays, printed frame */
    const photoWrap = cardSpan("card__photo");
    const image = document.createElement("img");
    image.className = "card__img";
    image.src = size === "full" ? photo.view : photo.thumb;
    image.alt = "";
    image.width = 480;
    image.height = 480;
    image.loading = size === "full" ? "eager" : "lazy";
    image.decoding = "async";
    image.dataset.heic = photo.heic ? "true" : "false";
    const rays = cardSpan("card__rays");
    rays.setAttribute("aria-hidden", "true");
    photoWrap.append(image, rays, frame);

    /* 3 · the strip under the art: what it is and how rare it is */
    const strip = cardSpan("card__strip");
    if (size !== "tile") strip.append(cardSpan("card__kind", `Elsa · ${t("seriesLabel")}`));
    strip.append(cardStars(card.rarity));

    node.append(foil, plate, photoWrap, strip);
    if (size === "tile") return node;

    /* 4 · the ability panel: keyword, the funny line, the flavour quote */
    const ability = cardSpan("card__line");
    ability.append(cardSpan("card__keyword", card.name), cardSpan("card__copy", card.line));
    if (size === "full" && flavour) {
      ability.append(cardSpan("card__print", `„${flavour}“`));
    }
    node.append(ability);

    /* 5 · three stat chips */
    const stats = cardSpan("card__stats");
    card.stats.forEach((stat) => {
      const row = cardSpan("card__stat");
      row.style.setProperty("--v", String(stat.value / 10));

      const bar = cardSpan("card__stat-bar");
      bar.setAttribute("aria-hidden", "true");

      row.append(
        cardSpan("card__stat-key", stat.key),
        cardSpan("card__stat-value", `${stat.value}/10`),
        bar
      );
      stats.append(row);
    });
    node.append(stats);

    /* 6 · serial and credit line */
    const foot = cardSpan("card__foot");
    foot.append(cardSpan("card__serial", `${pad2(card.number)}/${pad2(state.photos.length)}`));
    if (size === "full") foot.append(cardSpan("card__credit", `Lucky Elsa · ${t("seriesLabel")}`));
    node.append(foot);

    return node;
  }

  function ensurePackFresh() {
    if (!state.photos.length) return false;
    if (unseenPhotos().length > 0) return false;

    state.seen.clear();
    writeStorage(STORAGE.seen, []);
    state.needsRestart = true;
    updateProgress();
    renderBinder();
    announce(t("lastOneAnnounce"));
    return true;
  }

  async function openPack() {
    if (state.opening || !state.photos.length) return;

    ensureAudioContext();
    ensurePackFresh();

    const size = Math.min(PACK_SIZE, state.photos.length);
    const unseen = shuffle(unseenPhotos());
    const chosen = unseen.slice(0, size);

    if (chosen.length < size) {
      const rest = shuffle(state.photos.filter((photo) => state.seen.has(photo.id)));
      chosen.push(...rest.slice(0, size - chosen.length));
    }

    // Every pack deserves one card that shines, even when the shuffle
    // handed out nothing but commons.
    if (chosen.length && !chosen.some((photo) => rarityOf(photo) === "holo")) {
      const promote = Math.floor(Math.random() * chosen.length);
      chosen[promote] = { ...chosen[promote], rarity: "holo" };
    }

    state.opening = true;
    setBusy(true);
    announce(t("openingAnnounce"));
    playRip();

    els.packDrop.replaceChildren();
    chosen.forEach((photo, index) => {
      if (state.reduceMotion) {
        appendCard(photo, index);
        return;
      }

      window.setTimeout(() => {
        appendCard(photo, index);
        playTick();
        if (rarityOf(photo) !== "common") playWin();
      }, 180 + index * 220);
    });

    await wait(state.reduceMotion ? 0 : 180 + chosen.length * 220 + 200);

    chosen.forEach((photo) => markSeen(photo.id));
    state.pack = chosen;
    state.opening = false;
    setBusy(false);

    celebrate(els.confettiStage, els.packSeal,
      chosen.some((photo) => rarityOf(photo) === "holo") ? "big" : "normal");

    announce(t("packAnnounce", {
      count: chosen.length,
      names: chosen.map((photo) => cardFor(photo).name).join(", ")
    }));
  }

  function appendCard(photo, index) {
    const item = document.createElement("li");
    item.className = "pack__slot pack__slot--reveal";
    item.style.setProperty("--i", String(index));
    item.append(cardElement(photo, "drop"));
    els.packDrop.append(item);

    window.setTimeout(() => item.classList.remove("pack__slot--reveal"), 700);
  }

  function renderPack() {
    if (!state.pack.length) return;
    const chosen = state.pack;
    els.packDrop.replaceChildren();
    chosen.forEach((photo, index) => appendCard(photo, index));
  }

  function setBusy(busy) {
    els.openPack.disabled = busy;
    els.packSeal.disabled = busy;
    els.openAnother.disabled = busy;
    els.openPack.textContent = t(busy ? "opening" : "openPack");
  }

  function openCard(photo, options = {}) {
    if (!photo) return;

    state.current = photo;
    const card = cardFor(photo);

    markSeen(photo.id);

    els.fullSlot.replaceChildren(cardElement(photo, "full"));
    els.fullSlot.querySelectorAll("[data-heic='true']").forEach((node) => {
      delete node.dataset.heicDone;
    });

    els.save.href = photo.src;
    els.save.download = photo.filename || `${photo.id}.jpg`;
    els.shareStatus.textContent = "";

    if (options.updateUrl !== false) {
      setPhotoUrl(photo.id);
    }

    updateDocumentTitle();

    const wasOpen = els.dialog.open;
    if (!wasOpen) {
      els.dialog.showModal();
    }
    els.dialog.scrollTop = 0;
    els.dialog.focus({ preventScroll: true });

    if (!wasOpen) {
      playReveal(card.rarity);
      const full = els.fullSlot.querySelector(".card");
      if (full) {
        celebrate(els.confettiCard, full, card.rarity === "holo" ? "big" : "normal");
      }
    } else {
      playTick();
    }

    announce(`${t("cardNumber", { number: pad2(card.number) })}. ${card.name}. ${rarityLabel(card.rarity)}.`);
  }

  function onDialogClose() {
    state.current = null;
    els.shareStatus.textContent = "";
    updateDocumentTitle();
    clearPhotoUrl();
    window.setTimeout(() => els.openPack.focus({ preventScroll: true }), 0);
  }

  function markSeen(id) {
    if (!state.seen.has(id)) {
      state.seen.add(id);
      writeStorage(STORAGE.seen, [...state.seen]);
      updateProgress();
    }
  }

  function updateProgress() {
    const total = state.photos.length;
    const seen = seenCountNow();
    const ratio = total ? seen / total : 0;

    els.progressLabel.textContent = total ? t("seenLabel", { seen, total }) : t("emptyShort");
    els.progressFill.style.setProperty("--progress", String(ratio));
    els.progressTrack.setAttribute("aria-valuemax", String(total || 1));
    els.progressTrack.setAttribute("aria-valuenow", String(seen));

    els.mastheadCount.textContent = total ? countLabel(total) : t("emptyShort");
    els.binderCount.textContent = total ? countLabel(total) : t("emptyShort");

    if (state.allSamples) {
      els.demoNote.textContent = t("demoNote");
      els.demoNote.hidden = false;
    } else if (state.hasSamples) {
      els.demoNote.textContent = t("mixedNote");
      els.demoNote.hidden = false;
    } else {
      els.demoNote.hidden = true;
    }
  }

  function countLabel(total) {
    if (state.allSamples) return t(total === 1 ? "demoCountOne" : "demoCount", { total });
    return t(total === 1 ? "cardCountOne" : "cardCount", { total });
  }

  function renderBinder() {
    const fragment = document.createDocumentFragment();

    if (!state.photos.length) {
      const item = document.createElement("li");
      item.className = "album__placeholder";
      item.append(t("binderEmpty"));
      fragment.append(item);
      els.binderGrid.replaceChildren(fragment);
      return;
    }

    state.photos.forEach((photo) => {
      const item = document.createElement("li");
      item.className = "album__item";
      item.dataset.photoId = photo.id;
      item.append(cardElement(photo, "tile"));
      fragment.append(item);
    });

    els.binderGrid.replaceChildren(fragment);
  }

  function resetLap() {
    if (!state.photos.length) return;
    state.seen.clear();
    writeStorage(STORAGE.seen, []);
    updateProgress();
    renderBinder();
    announce(t("restartAnnounce"));
  }

  function renderEmpty() {
    state.hasSamples = false;
    state.allSamples = false;
    els.openPack.disabled = true;
    els.packSeal.disabled = true;
    els.openPack.textContent = t("emptyShort");
    els.progressLabel.textContent = t("emptyShort");
    els.progressTrack.setAttribute("aria-valuemax", "1");
    els.progressTrack.setAttribute("aria-valuenow", "0");
    els.progressFill.style.setProperty("--progress", "0");
    els.mastheadCount.textContent = t("emptyShort");
    els.binderCount.textContent = t("emptyBinderCount");
    els.demoNote.hidden = true;

    const item = document.createElement("li");
    item.className = "album__placeholder";

    const line = document.createElement("p");
    line.textContent = t("emptyLine");

    const command = document.createElement("p");
    const code = document.createElement("code");
    code.textContent = "npm run photos";
    command.append(code);

    item.append(line, command);
    els.binderGrid.replaceChildren(item);
    updateDocumentTitle();
  }

  async function convertHeicImage(image) {
    if (image.dataset.heicBusy === "true" || image.dataset.heicDone === "true") return;

    const source = image.currentSrc || image.src;
    if (!source || !HEIC_PATTERN.test(source)) return;

    image.dataset.heicBusy = "true";

    try {
      if (!heicCache.has(source)) {
        heicCache.set(source, convertHeicUrl(source));
      }

      const objectUrl = await heicCache.get(source);
      if (!image.isConnected) return;

      image.src = objectUrl;
      image.dataset.heicDone = "true";
    } catch {
      image.dataset.heicDone = "true";
    } finally {
      image.dataset.heicBusy = "false";
    }
  }

  async function convertHeicUrl(url) {
    const convert = await loadHeicLibrary();
    if (!convert) throw new Error("HEIC support is unavailable.");

    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Could not fetch ${url}`);

    const blob = await convert({
      blob: await response.blob(),
      toType: "image/jpeg",
      quality: 0.9
    });

    return URL.createObjectURL(blob);
  }

  function loadHeicLibrary() {
    if (heicLibrary) return heicLibrary;

    heicLibrary = new Promise((resolve, reject) => {
      if (typeof window.heic2any === "function") {
        resolve(window.heic2any);
        return;
      }

      const script = document.createElement("script");
      script.src = HEIC_LIBRARY;
      script.async = true;
      script.onload = () => (
        typeof window.heic2any === "function"
          ? resolve(window.heic2any)
          : reject(new Error("Decoder did not register itself."))
      );
      script.onerror = () => reject(new Error(`Could not load ${HEIC_LIBRARY}`));
      document.head.append(script);
    });

    return heicLibrary;
  }

  function onKeydown(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTyping(event.target)) return;

    if (els.dialog.open) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateCard(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateCard(-1);
      }
      return;
    }

    if (event.key === "p" || event.key === "P") {
      event.preventDefault();
      openPack();
    }
  }

  function isTyping(target) {
    return target instanceof HTMLElement && (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable
    );
  }

  function navigateCard(direction) {
    if (!state.current || state.photos.length < 2) return;
    const index = state.photos.findIndex((photo) => photo.id === state.current.id);
    const next = (index + direction + state.photos.length) % state.photos.length;
    openCard(state.photos[next]);
  }

  async function shareCurrent() {
    if (!state.current) return;

    const photo = state.current;
    const card = cardFor(photo);
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("lang", state.lang);
    url.searchParams.set("photo", photo.id);

    const shareData = {
      title: t("shareTitle", { name: card.name }),
      text: t("shareText", { name: card.name }),
      url: url.toString()
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setShareStatus(t("shared"));
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    const copied = await copyText(url.toString());
    if (copied) {
      setShareStatus(t("linkCopied"));
    } else {
      setShareStatus(t("linkCopyFailed"));
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the selection method.
    }

    const field = document.createElement("textarea");
    field.className = "visually-hidden";
    field.value = text;
    field.setAttribute("readonly", "");
    document.body.append(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    field.remove();
    return copied;
  }

  function setShareStatus(message) {
    window.clearTimeout(state.statusTimer);
    els.shareStatus.textContent = message;
    state.statusTimer = window.setTimeout(() => {
      els.shareStatus.textContent = "";
    }, 3400);
  }

  function setPhotoUrl(id) {
    const url = new URL(window.location.href);
    url.searchParams.set("photo", id);
    window.history.replaceState(null, "", url);
  }

  function clearPhotoUrl() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("photo")) return;
    url.searchParams.delete("photo");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function toggleSound() {
    state.sound = !state.sound;
    writeStorage(STORAGE.sound, state.sound);
    updateSoundUi();

    if (state.sound) {
      ensureAudioContext();
      playTick();
    }
  }

  function updateSoundUi() {
    els.soundToggle.setAttribute("aria-pressed", state.sound ? "true" : "false");
    els.soundToggle.setAttribute("aria-label", t("soundLabel"));
    els.soundToggle.querySelector(".sound-toggle__label").textContent =
      t(state.sound ? "soundOn" : "soundOff");
  }

  function ensureAudioContext() {
    if (!state.sound) return null;

    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  }

  function noise(duration) {
    const context = ensureAudioContext();
    if (!context) return null;

    if (!noiseBuffer) {
      const length = Math.ceil(context.sampleRate * 0.4);
      noiseBuffer = context.createBuffer(1, length, context.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let index = 0; index < length; index += 1) {
        data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / length, 2);
      }
    }

    const now = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(gain).connect(context.destination);
    source.start(now);
    source.stop(now + duration + 0.02);

    return { source, gain, now };
  }

  function playTick() {
    const context = ensureAudioContext();
    if (!context) return;

    const parts = noise(0.05);
    if (!parts) return;

    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2100;
    filter.Q.value = 1.1;

    parts.source.disconnect();
    parts.source.connect(filter).connect(parts.gain);
  }

  function playRip() {
    const context = ensureAudioContext();
    if (!context) return;

    const parts = noise(0.26);
    if (!parts) return;

    const filter = context.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(900, parts.now);
    filter.frequency.linearRampToValueAtTime(2800, parts.now + 0.24);
    filter.Q.value = 0.7;

    parts.source.disconnect();
    parts.source.connect(filter).connect(parts.gain);
  }

  function playWin() {
    const context = ensureAudioContext();
    if (!context) return;

    const notes = [523.25, 659.25, 783.99];
    const now = context.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.085;

      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.085, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    });
  }

  /* Reward moments --------------------------------------------------------- */

  /* A small canvas burst, drawn only when motion is welcome. No library, no
     images: rectangles in the colours the set already uses. */
  function celebrate(canvas, origin, intensity) {
    if (!canvas || state.reduceMotion) return;

    const host = canvas.parentElement;
    if (!host) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const hostBox = host.getBoundingClientRect();
    const originBox = origin ? origin.getBoundingClientRect() : hostBox;
    const ox = originBox.left + originBox.width / 2 - hostBox.left;
    const oy = originBox.top + originBox.height * 0.42 - hostBox.top;

    const colors = ["#72efdd", "#2fd3bd", "#171310", "#f6efdf", "#efe3c9", "#c9b6ff"];
    const count = intensity === "big" ? 150 : 90;
    const pieces = [];

    for (let index = 0; index < count; index += 1) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const speed = 260 + Math.random() * (intensity === "big" ? 520 : 380);
      pieces.push({
        x: ox + (Math.random() - 0.5) * originBox.width * 0.55,
        y: oy + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 5 + Math.random() * 8,
        h: 3 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 11,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        ttl: 1.1 + Math.random() * 0.8
      });
    }

    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      context.clearRect(0, 0, width, height);
      let alive = false;

      pieces.forEach((piece) => {
        if (piece.life > piece.ttl) return;
        alive = true;

        piece.life += dt;
        piece.vy += 900 * dt;
        piece.vx *= 0.986;
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.rot += piece.vr * dt;

        const fade = Math.max(0, 1 - Math.max(0, piece.life - piece.ttl * 0.55) / (piece.ttl * 0.45));
        context.save();
        context.globalAlpha = fade;
        context.translate(piece.x, piece.y);
        context.rotate(piece.rot);
        context.fillStyle = piece.color;
        context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        context.restore();
      });

      if (alive) {
        window.requestAnimationFrame(frame);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    window.requestAnimationFrame(frame);
  }

  /* The foil follows the pointer: a slight tilt and the highlight moving with
     it. Never on touch, never when motion is reduced. */
  function bindCardShine(root) {
    if (!root) return;
    let active = null;

    const reset = (card) => {
      if (!card) return;
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    };

    root.addEventListener("pointermove", (event) => {
      if (state.reduceMotion || event.pointerType === "touch") return;

      const card = event.target.closest ? event.target.closest(".card") : null;
      if (!card) {
        reset(active);
        active = null;
        return;
      }

      if (active && active !== card) reset(active);
      active = card;

      const box = card.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width;
      const py = (event.clientY - box.top) / box.height;

      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      card.style.setProperty("--tilt-y", `${((px - 0.5) * 9).toFixed(2)}deg`);
      card.style.setProperty("--tilt-x", `${((0.5 - py) * 7).toFixed(2)}deg`);
    });

    root.addEventListener("pointerleave", () => {
      reset(active);
      active = null;
    });
  }

  function playReveal(rarity) {
    const context = ensureAudioContext();
    if (!context) return;

    const notes = rarity === "holo"
      ? [523.25, 659.25, 783.99, 1046.5]
      : [523.25, 659.25, 783.99];
    const now = context.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.085;

      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.085, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    });

    if (rarity === "holo") {
      const shimmer = noise(0.4);
      if (shimmer) {
        const filter = context.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(3200, shimmer.now);
        filter.frequency.exponentialRampToValueAtTime(9000, shimmer.now + 0.36);
        filter.Q.value = 1.4;

        shimmer.source.disconnect();
        shimmer.source.connect(filter).connect(shimmer.gain);
      }
    }
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function shuffle(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function announce(message) {
    els.live.textContent = "";
    window.setTimeout(() => {
      els.live.textContent = message;
    }, 30);
  }
})();
