(() => {
  "use strict";

  const COPY = {
    de: {
      title: "Lucky Elsa — ein Glücksrad voller Elsa-Fotos",
      description: "Dreh das Rad und ein zufälliges Foto von Elsa kommt zum Vorschein. Alle Fotos kommen einmal dran, bevor sich eines wiederholt.",
      ogTitle: "Lucky Elsa",
      ogDescription: "Ein Glücksrad voller Elsa-Fotos. Dreh es und schau, welches kommt.",
      skip: "Direkt zum Rad",
      wordmarkLabel: "Lucky Elsa, zurück zum Rad",
      navAlbum: "Alle Fotos",
      languageLabel: "Sprache",
      menuLabel: "Hauptmenü",
      soundLabel: "Ton",
      soundOn: "Ton an",
      soundOff: "Ton aus",
      headline: "Welche Elsa<br>wird es?",
      lede: "Dreh am Rad, und ein Foto kommt heraus. Es wandert durch den ganzen Stapel, bevor es von vorn losgeht.",
      spin: "Rad drehen",
      spinning: "Rad dreht sich",
      seeAlbum: "Alle Fotos ansehen",
      progressLoading: "Fotos werden gesucht",
      progressNote: "Jedes Foto kommt einmal dran, bevor das Rad von vorn beginnt.",
      spinHint: "Drück <kbd>S</kbd>, um zu drehen.",
      wheelLoading: "Fotos werden geladen",
      wheelCaption: "Acht Fotos auf einmal, aus denen, die du noch nicht gesehen hast.",
      wheelAria: "Dreh das Rad für ein zufälliges Foto von Elsa. {count} Fotos sind auf dem Rad.",
      albumTitle: "Alle Fotos",
      albumLede: "Jedes Foto bekommt seine eigene Auszeichnung. Öffne eins und schau, was es gewonnen hat.",
      albumLabel: "Alle Fotos von Elsa",
      albumCountLoading: "Fotos werden geladen",
      reset: "Von vorn",
      demoNote: "Das hier sind Beispielkarten. Die echten Fotos fehlen noch.",
      loadingDots: "Fotos werden geladen…",
      footerLine: "Zu Hause für Elsa gebaut. Keine Anmeldung, nichts wird getrackt.",
      backToWheel: "Zurück zum Rad",
      closePhoto: "Dieses Foto schließen",
      stampTop: "Brave Elsa",
      stampBottom: "Geprüft",
      dialogProgress: "Du hast {seen} von {total} gesehen.",
      dialogProgressAll: "Du hast alle {total} gesehen. Das Rad beginnt von vorn.",
      dialogProgressDefault: "Du hast 1 von 24 gesehen.",
      spinAgain: "Nochmal drehen",
      savePhoto: "Foto speichern",
      share: "Teilen",
      dialogHint: "Mit <kbd>←</kbd> und <kbd>→</kbd> durch die Fotos gehen.",
      noscript: "Das Rad braucht JavaScript. Die Fotos liegen trotzdem im Ordner <code>photos</code>.",
      photoAlt: "Elsa, Foto {number}",
      photoNumber: "Nr. {number}",
      emptyShort: "Noch keine Fotos",
      emptyAlbumCount: "Noch nichts da",
      emptyLine: "Hier sind noch keine Fotos. Leg Elsa-Fotos in den Ordner photos und führe dann aus:",
      albumEmpty: "Noch keine Fotos. Leg Elsa-Fotos in den Ordner photos und führe dann npm run photos aus.",
      photoAnnounce: "Foto {number}. {award}.",
      spinningAnnounce: "Das Rad dreht sich.",
      lastOneAnnounce: "Das war das letzte. Jetzt geht es von vorn los, damit alle Fotos wieder drankommen.",
      restartAnnounce: "Von vorn. Alle Fotos können wieder kommen.",
      languageAnnounce: "Auf Deutsch umgestellt.",
      shared: "Geteilt.",
      linkCopied: "Link kopiert.",
      linkCopyFailed: "Link konnte nicht kopiert werden. Er steht oben in der Adresszeile.",
      shareTitle: "{award} — ein Foto von Elsa",
      shareText: "Das ist Elsa. Sie hat gewonnen: {award}.",
      seenTag: "gesehen",
      seenLabel: "{seen} von {total} gesehen",
      photoCount: "{total} Fotos",
      photoCountOne: "1 Foto",
      demoCount: "{total} Beispielkarten",
      demoCountOne: "1 Beispielkarte",
      albumOpenLabel: "Foto {number} öffnen: {award}",
      albumOpenSeenLabel: "Foto {number} öffnen: {award}, gesehen",
      awards: [
        "Beste Ohrenhaltung",
        "Chefin im Schlamm",
        "Bester Mittagsschlaf",
        "Meisterin der Zoomies",
        "Beste Nebenrolle: Schnauze",
        "Herausragende Schwanzleistung",
        "Beste Spürnase, erste Liga",
        "Lebenswerk: Leckerlis",
        "Bester Platz auf dem Sofa",
        "Goldene Pfote für hartnäckiges Betteln",
        "Klaut am wahrscheinlichsten den Ball",
        "Erster Platz, Kategorie nasser Hund",
        "Bestes Fell, Kategorie Fell",
        "Ehrenprofessorin für Stöcke",
        "Großmeisterin der Türklingel",
        "Bestes Haar nach Regen",
        "Treueste Begleiterin der Menschen",
        "Preis für besonders höfliches Sitzen",
        "Bester Welpenblick",
        "Der Elsa-Preis fürs Elsa-Sein",
        "Beste Gartenpatrouille",
        "Kreativste Ausrede für einen Spaziergang",
        "Beste Leistung im Laubhaufen",
        "Weltrekord für die fröhlichste Begrüßung"
      ]
    },
    en: {
      title: "Lucky Elsa — a wheel of Elsa photos",
      description: "Spin the wheel and a random photo of Elsa comes up. Keep going and you will see every photo before any of them repeat.",
      ogTitle: "Lucky Elsa",
      ogDescription: "A wheel of Elsa photos. Give it a spin and see which one comes up.",
      skip: "Skip to the wheel",
      wordmarkLabel: "Lucky Elsa, back to the wheel",
      navAlbum: "All the photos",
      languageLabel: "Language",
      menuLabel: "Main",
      soundLabel: "Sound",
      soundOn: "Sound on",
      soundOff: "Sound off",
      headline: "Which Elsa<br>will it be?",
      lede: "Spin the wheel and one photo comes up. It works through the whole pile before starting over.",
      spin: "Spin the wheel",
      spinning: "Spinning",
      seeAlbum: "See all the photos",
      progressLoading: "Finding the photos",
      progressNote: "Every photo comes up once before the wheel starts over.",
      spinHint: "Press <kbd>S</kbd> to spin.",
      wheelLoading: "Getting the photos",
      wheelCaption: "Eight photos at a time, picked from the ones you have not seen.",
      wheelAria: "Spin the wheel for a random photo of Elsa. {count} photos are on the wheel.",
      albumTitle: "All the photos",
      albumLede: "Each one gets its own award. Open a photo to see what it won.",
      albumLabel: "All photos of Elsa",
      albumCountLoading: "Loading photos",
      reset: "Start over",
      demoNote: "These are sample cards. The real photos are not in yet.",
      loadingDots: "Loading photos…",
      footerLine: "Made at home for Elsa. No accounts, nothing tracked.",
      backToWheel: "Back to the wheel",
      closePhoto: "Close this photo",
      stampTop: "Good girl",
      stampBottom: "Certified",
      dialogProgress: "You have seen {seen} of {total}.",
      dialogProgressAll: "You have seen all {total}. The wheel will start over.",
      dialogProgressDefault: "You have seen 1 of 24.",
      spinAgain: "Spin again",
      savePhoto: "Save this photo",
      share: "Share",
      dialogHint: "Use <kbd>←</kbd> and <kbd>→</kbd> to go through the photos.",
      noscript: "The wheel needs JavaScript to spin. The photos are still in the <code>photos</code> folder.",
      photoAlt: "Elsa, photo {number}",
      photoNumber: "No. {number}",
      emptyShort: "No photos yet",
      emptyAlbumCount: "Nothing here yet",
      emptyLine: "There are no photos here yet. Put Elsa's photos in the photos folder, then run:",
      albumEmpty: "No photos yet. Put Elsa's photos in the photos folder, then run npm run photos.",
      photoAnnounce: "Photo {number}. {award}.",
      spinningAnnounce: "Spinning the wheel.",
      lastOneAnnounce: "That was the last one. Starting over so every photo can come up again.",
      restartAnnounce: "Starting over. Every photo can come up again.",
      languageAnnounce: "Switched to English.",
      shared: "Shared.",
      linkCopied: "Link copied.",
      linkCopyFailed: "Could not copy the link. It is up in the address bar.",
      shareTitle: "{award} — a photo of Elsa",
      shareText: "This is Elsa. She won {award}.",
      seenTag: "seen",
      seenLabel: "{seen} of {total} seen",
      photoCount: "{total} photos",
      photoCountOne: "1 photo",
      demoCount: "{total} sample cards",
      demoCountOne: "1 sample card",
      albumOpenLabel: "Open photo {number}: {award}",
      albumOpenSeenLabel: "Open photo {number}: {award}, seen",
      awards: [
        "Best Ear Deployment",
        "Chief Mud Officer",
        "Most Improved Nap",
        "Excellence in Zoomies",
        "Best Supporting Snout",
        "Outstanding Tail Performance",
        "Top Sniffer, Division One",
        "Lifetime Achievement in Treats",
        "Best in Show, Sofa Class",
        "Golden Paw for Persistent Asking",
        "Most Likely to Steal the Ball",
        "First Place, Wet Dog Category",
        "Best Dressed, Fur Division",
        "Honorary Professor of Sticks",
        "Grand Champion of the Doorbell",
        "Best Hair After Rain",
        "Most Dedicated Follower of Humans",
        "Award for Sitting Very Politely",
        "Best Use of Puppy Eyes",
        "The Elsa Prize for Being Elsa",
        "Best Garden Patrol",
        "Most Creative Excuse for a Walk",
        "Top Performer in the Leaf Pile",
        "World Record for Happiest Greeting"
      ]
    }
  };

  const STORAGE = {
    seen: "lucky-elsa.seen.v1",
    sound: "lucky-elsa.sound.v1",
    lang: "lucky-elsa.lang.v1"
  };

  const MAX_WHEEL = 8;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const state = {
    lang: "de",
    photos: [],
    seen: new Set(),
    sound: true,
    demo: false,
    wheel: null,
    spinning: false,
    needsReroll: false,
    current: null,
    statusTimer: null,
    reduceMotion: motionQuery.matches
  };

  const els = {};
  let audioContext = null;
  let noiseBuffer = null;

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
    observeWheel();
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
    state.demo = state.photos.every((photo) => photo.demo);
    updateProgress();
    renderAlbum();
    renderWheel();

    const requested = new URLSearchParams(window.location.search).get("photo");
    if (requested) {
      const photo = state.photos.find((item) => item.id === requested);
      if (photo) {
        openPhoto(photo, { updateUrl: false });
      }
    }
  }

  function cacheElements() {
    els.wheel = document.getElementById("wheel");
    els.wheelDisc = document.getElementById("wheel-disc");
    els.wheelLoading = document.getElementById("wheel-loading");
    els.wheelFrame = document.querySelector(".wheel-frame");
    els.spin = document.getElementById("spin");
    els.progressLabel = document.getElementById("progress-label");
    els.progressTrack = document.getElementById("progress-track");
    els.progressFill = document.getElementById("progress-fill");
    els.mastheadCount = document.getElementById("masthead-count");
    els.albumCount = document.getElementById("album-count");
    els.albumGrid = document.getElementById("album-grid");
    els.reset = document.getElementById("reset-lap");
    els.demoNote = document.getElementById("demo-note");
    els.soundToggle = document.getElementById("sound-toggle");
    els.dialog = document.getElementById("photo-dialog");
    els.photoNumber = document.getElementById("photo-number");
    els.photoImg = document.getElementById("photo-img");
    els.photoTitle = document.getElementById("photo-title");
    els.photoCaption = document.getElementById("photo-caption");
    els.photoProgress = document.getElementById("photo-progress");
    els.photoStamp = document.getElementById("photo-stamp");
    els.download = document.getElementById("download-photo");
    els.share = document.getElementById("share-photo");
    els.close = document.getElementById("close-dialog");
    els.spinAgain = document.getElementById("spin-again");
    els.shareStatus = document.getElementById("share-status");
    els.live = document.getElementById("live");
  }

  function bindEvents() {
    els.spin.addEventListener("click", spin);
    els.wheel.addEventListener("click", spin);
    els.spinAgain.addEventListener("click", spinAgain);
    els.close.addEventListener("click", () => els.dialog.close());
    els.share.addEventListener("click", shareCurrent);
    els.reset.addEventListener("click", resetLap);
    els.soundToggle.addEventListener("click", toggleSound);

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.lang));
    });

    els.dialog.addEventListener("close", onDialogClose);
    els.dialog.addEventListener("click", (event) => {
      if (event.target === els.dialog) {
        els.dialog.close();
      }
    });

    els.albumGrid.addEventListener("click", (event) => {
      const tile = event.target.closest("[data-photo-id]");
      if (!tile || state.spinning) return;
      const photo = state.photos.find((item) => item.id === tile.dataset.photoId);
      if (photo) openPhoto(photo);
    });

    document.addEventListener("keydown", onKeydown);

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", (event) => {
        state.reduceMotion = event.matches;
      });
    }
  }

  function observeWheel() {
    const setSize = () => {
      const width = els.wheelFrame.getBoundingClientRect().width;
      if (width > 0) {
        els.wheelFrame.style.setProperty("--wheel-px", `${width}px`);
      }
    };

    setSize();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(setSize);
      observer.observe(els.wheelFrame);
    } else {
      window.addEventListener("resize", setSize);
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

      const caption = typeof raw.caption === "string" ? raw.caption.trim() : "";
      const alt = typeof raw.alt === "string" ? raw.alt.trim() : "";

      normalized.push({
        id,
        src,
        thumb: String(raw.thumb || src),
        view: String(raw.view || src),
        filename,
        caption,
        alt,
        demo: Boolean(raw.demo),
        width: Number(raw.width) || 1200,
        height: Number(raw.height) || 1200
      });
    });

    return normalized;
  }

  function slugify(value) {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
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
      renderAlbum();
      updateWheelAria();
      if (state.current) refreshCurrentPhoto();
      setBusy(state.spinning);
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
      ? `${awardFor(state.current.id)} — Lucky Elsa`
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
      // A private window can refuse storage; the wheel still works for this visit.
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

  function ensureLap() {
    if (!state.photos.length) return false;
    if (unseenPhotos().length > 0) return false;

    state.seen.clear();
    writeStorage(STORAGE.seen, []);
    state.needsReroll = true;
    updateProgress();
    renderAlbum();
    announce(t("lastOneAnnounce"));
    return true;
  }

  function renderWheel() {
    els.wheelDisc.querySelectorAll(".wheel__photo").forEach((node) => node.remove());

    if (!state.photos.length) {
      els.wheel.disabled = true;
      els.spin.disabled = true;
      return;
    }

    const sample = pickWheelPhotos();
    const target = sample.find((photo) => !state.seen.has(photo.id)) || sample[0];
    const segment = 360 / sample.length;

    state.wheel = {
      sample,
      target,
      targetAngle: sample.indexOf(target) * segment,
      segment
    };
    state.needsReroll = false;
    state.rotation = 0;

    els.wheelFrame.dataset.few = sample.length <= 5 ? "true" : "false";
    els.wheelDisc.style.background = wheelGradient(sample.length, segment);
    els.wheelDisc.style.transform = "rotate(0deg)";

    sample.forEach((photo, index) => {
      const angle = index * segment;
      const wrapper = document.createElement("span");
      wrapper.className = "wheel__photo";
      wrapper.style.setProperty("--angle", `${angle}deg`);
      wrapper.dataset.photoId = photo.id;

      const image = document.createElement("img");
      image.src = photo.thumb;
      image.alt = "";
      image.width = 240;
      image.height = 240;
      image.decoding = "async";
      image.draggable = false;

      wrapper.append(image);
      els.wheelDisc.append(wrapper);
    });

    if (els.wheelLoading) {
      els.wheelLoading.remove();
      els.wheelLoading = null;
    }

    els.wheel.disabled = false;
    els.spin.disabled = false;
    updateWheelAria();
  }

  function updateWheelAria() {
    if (!state.wheel) return;
    els.wheel.setAttribute("aria-label", t("wheelAria", { count: state.wheel.sample.length }));
  }

  function pickWheelPhotos() {
    const count = Math.min(MAX_WHEEL, state.photos.length);
    const unseen = shuffle(unseenPhotos());
    const sample = unseen.slice(0, count);

    if (sample.length < count) {
      const seen = shuffle(state.photos.filter((photo) => state.seen.has(photo.id)));
      sample.push(...seen.slice(0, count - sample.length));
    }

    return shuffle(sample);
  }

  function wheelGradient(count, segment) {
    if (count === 1) {
      return "conic-gradient(from -180deg, var(--color-accent) 0deg 359.2deg, var(--color-ink) 359.2deg 360deg)";
    }

    const line = Math.min(0.8, segment * 0.03);
    const stops = [];

    for (let index = 0; index < count; index += 1) {
      const start = index * segment;
      const end = (index + 1) * segment;
      const fill = index % 2 === 0 ? "var(--color-accent)" : "var(--color-paper-2)";
      stops.push(`${fill} ${start}deg ${end - line}deg`);
      stops.push(`var(--color-ink) ${end - line}deg ${end}deg`);
    }

    return `conic-gradient(from ${-segment / 2}deg, ${stops.join(", ")})`;
  }

  async function spin() {
    if (state.spinning || !state.photos.length) return;

    ensureAudioContext();
    ensureLap();

    if (state.needsReroll || !state.wheel) {
      renderWheel();
    }

    if (!state.wheel || !state.wheel.target) return;

    state.spinning = true;
    setBusy(true);
    announce(t("spinningAnnounce"));

    els.wheelDisc.querySelectorAll(".wheel__photo").forEach((node) => node.classList.remove("is-winner"));

    const targetRotation = landingRotation(state.wheel.targetAngle);
    const duration = state.reduceMotion ? 0 : 3800 + Math.random() * 700;

    await animateWheel(targetRotation, duration, state.wheel.segment);

    const winner = els.wheelDisc.querySelector(`[data-photo-id="${cssEscape(state.wheel.target.id)}"]`);
    if (winner) winner.classList.add("is-winner");

    playWin();
    await wait(state.reduceMotion ? 80 : 430);

    markSeen(state.wheel.target.id);
    openPhoto(state.wheel.target, { fromSpin: true });

    state.spinning = false;
    state.needsReroll = true;
    setBusy(false);
  }

  function landingRotation(targetAngle) {
    const desired = (360 - (targetAngle % 360)) % 360;
    const turns = state.reduceMotion ? 0 : 5 + Math.floor(Math.random() * 2);
    const minimum = turns * 360;
    return minimum + ((desired - (minimum % 360) + 360) % 360);
  }

  function animateWheel(target, duration, segment) {
    return new Promise((resolve) => {
      if (duration <= 0) {
        els.wheelDisc.style.transform = `rotate(${target}deg)`;
        resolve();
        return;
      }

      const start = performance.now();
      let lastSegment = 0;
      let lastTick = 0;

      const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        const rotation = target * eased;

        els.wheelDisc.style.transform = `rotate(${rotation}deg)`;

        const currentSegment = Math.floor((rotation % 360) / segment);
        if (currentSegment !== lastSegment && now - lastTick > 38) {
          playTick();
          lastSegment = currentSegment;
          lastTick = now;
        }

        if (progress < 1) {
          window.requestAnimationFrame(frame);
        } else {
          els.wheelDisc.style.transform = `rotate(${target}deg)`;
          resolve();
        }
      };

      window.requestAnimationFrame(frame);
    });
  }

  function setBusy(busy) {
    els.spin.disabled = busy;
    els.wheel.disabled = busy;
    els.spinAgain.disabled = busy;
    els.wheel.setAttribute("aria-busy", busy ? "true" : "false");
    els.spin.textContent = t(busy ? "spinning" : "spin");
  }

  function spinAgain() {
    if (state.spinning) return;
    state.needsReroll = true;
    els.dialog.close();
    window.setTimeout(spin, 160);
  }

  function openPhoto(photo, options = {}) {
    if (!photo) return;

    state.current = photo;
    const index = state.photos.findIndex((item) => item.id === photo.id);
    const number = index + 1;
    const award = awardFor(photo.id);

    markSeen(photo.id);

    els.photoNumber.textContent = t("photoNumber", { number: pad2(number) });
    els.photoTitle.textContent = award;
    els.photoImg.src = photo.view;
    els.photoImg.alt = altFor(photo, number);

    els.photoImg.onerror = () => {
      if (els.photoImg.dataset.fallback === "true") return;
      els.photoImg.dataset.fallback = "true";
      els.photoImg.src = photo.src;
    };
    els.photoImg.dataset.fallback = "false";

    if (photo.caption) {
      els.photoCaption.textContent = photo.caption;
      els.photoCaption.hidden = false;
      els.dialog.setAttribute("aria-describedby", "photo-caption");
    } else {
      els.photoCaption.textContent = "";
      els.photoCaption.hidden = true;
      els.dialog.removeAttribute("aria-describedby");
    }

    els.photoProgress.textContent = progressSentence(seenCountNow());

    els.download.href = photo.src;
    els.download.download = photo.filename || `${photo.id}.jpg`;
    els.shareStatus.textContent = "";
    els.photoStamp.classList.remove("is-stamping");
    void els.photoStamp.offsetWidth;
    els.photoStamp.classList.add("is-stamping");

    if (options.updateUrl !== false) {
      setPhotoUrl(photo.id);
    }

    updateDocumentTitle();

    if (!els.dialog.open) {
      els.dialog.showModal();
    }
    els.dialog.scrollTop = 0;
    els.dialog.focus({ preventScroll: true });
    announce(t("photoAnnounce", { number, award }));
  }

  function refreshCurrentPhoto() {
    if (!state.current) return;

    const index = state.photos.findIndex((item) => item.id === state.current.id);
    updatePhotoCopy(state.current, index + 1);
    updateDocumentTitle();
  }

  function updatePhotoCopy(photo, number) {
    els.photoTitle.textContent = awardFor(photo.id);
    els.photoImg.alt = altFor(photo, number);
    els.photoProgress.textContent = progressSentence(seenCountNow());
  }

  function altFor(photo, number) {
    return photo.alt || photo.caption || t("photoAlt", { number });
  }

  function progressSentence(seen) {
    const total = state.photos.length;
    return seen >= total
      ? t("dialogProgressAll", { total })
      : t("dialogProgress", { seen, total });
  }

  function onDialogClose() {
    state.current = null;
    els.shareStatus.textContent = "";
    els.photoStamp.classList.remove("is-stamping");
    updateDocumentTitle();
    clearPhotoUrl();
    window.setTimeout(() => els.spin.focus({ preventScroll: true }), 0);
  }

  function markSeen(id) {
    if (!state.seen.has(id)) {
      state.seen.add(id);
      writeStorage(STORAGE.seen, [...state.seen]);
      updateProgress();
      updateTile(id);
    }
  }

  function seenCountNow() {
    return state.photos.reduce((count, photo) => count + (state.seen.has(photo.id) ? 1 : 0), 0);
  }

  function photoCount(total) {
    return t(total === 1 ? "photoCountOne" : "photoCount", { total });
  }

  function demoCount(total) {
    return t(total === 1 ? "demoCountOne" : "demoCount", { total });
  }

  function updateProgress() {
    const total = state.photos.length;
    const seen = seenCountNow();
    const ratio = total ? seen / total : 0;

    els.progressLabel.textContent = total ? t("seenLabel", { seen, total }) : t("emptyShort");
    els.progressFill.style.setProperty("--progress", String(ratio));
    els.progressTrack.setAttribute("aria-valuemax", String(total || 1));
    els.progressTrack.setAttribute("aria-valuenow", String(seen));

    els.mastheadCount.textContent = total
      ? state.demo ? demoCount(total) : photoCount(total)
      : t("emptyShort");

    els.albumCount.textContent = total
      ? state.demo ? demoCount(total) : photoCount(total)
      : t("emptyShort");

    els.demoNote.hidden = !state.demo;
  }

  function renderAlbum() {
    const fragment = document.createDocumentFragment();

    if (!state.photos.length) {
      const item = document.createElement("li");
      item.className = "album__placeholder";
      item.append(t("albumEmpty"));
      fragment.append(item);
      els.albumGrid.replaceChildren(fragment);
      return;
    }

    state.photos.forEach((photo, index) => {
      const number = index + 1;
      const award = awardFor(photo.id);
      const seen = state.seen.has(photo.id);

      const item = document.createElement("li");
      item.className = "album__item";
      item.dataset.photoId = photo.id;

      const tile = document.createElement("button");
      tile.className = "album__tile";
      tile.type = "button";
      tile.dataset.photoId = photo.id;
      tile.setAttribute("aria-label", t(seen ? "albumOpenSeenLabel" : "albumOpenLabel", { number, award }));

      const frame = document.createElement("span");
      frame.className = "album__frame";

      const image = document.createElement("img");
      image.src = photo.thumb;
      image.alt = "";
      image.width = 480;
      image.height = 480;
      image.loading = "lazy";
      image.decoding = "async";
      frame.append(image);

      const meta = document.createElement("span");
      meta.className = "album__meta";

      const numberEl = document.createElement("span");
      numberEl.className = "album__number";
      numberEl.textContent = t("photoNumber", { number: pad2(number) });

      const seenEl = document.createElement("span");
      seenEl.className = "album__seen";
      seenEl.textContent = seen ? t("seenTag") : "";

      meta.append(numberEl, seenEl);
      tile.append(frame, meta);
      item.append(tile);
      fragment.append(item);
    });

    els.albumGrid.replaceChildren(fragment);
  }

  function updateTile(id) {
    const item = els.albumGrid.querySelector(`[data-photo-id="${cssEscape(id)}"]`);
    if (!item) return;

    const index = state.photos.findIndex((photo) => photo.id === id);
    const tile = item.querySelector(".album__tile");
    const seenEl = item.querySelector(".album__seen");

    if (seenEl) seenEl.textContent = t("seenTag");
    if (tile) {
      tile.setAttribute("aria-label", t("albumOpenSeenLabel", {
        number: index + 1,
        award: awardFor(id)
      }));
    }
  }

  function resetLap() {
    if (!state.photos.length) return;
    state.seen.clear();
    writeStorage(STORAGE.seen, []);
    state.needsReroll = true;
    updateProgress();
    renderAlbum();
    announce(t("restartAnnounce"));
    if (!state.spinning) {
      renderWheel();
    }
  }

  function renderEmpty() {
    state.demo = false;
    els.wheel.disabled = true;
    els.spin.disabled = true;
    els.wheel.setAttribute("aria-label", t("emptyShort"));
    els.spin.textContent = t("emptyShort");
    els.progressLabel.textContent = t("emptyShort");
    els.progressTrack.setAttribute("aria-valuemax", "1");
    els.progressTrack.setAttribute("aria-valuenow", "0");
    els.progressFill.style.setProperty("--progress", "0");
    els.mastheadCount.textContent = t("emptyShort");
    els.albumCount.textContent = t("emptyAlbumCount");
    els.demoNote.hidden = true;

    if (els.wheelLoading) {
      els.wheelLoading.textContent = t("emptyShort");
    }

    const item = document.createElement("li");
    item.className = "album__placeholder";

    const line = document.createElement("p");
    line.textContent = t("emptyLine");

    const command = document.createElement("p");
    const code = document.createElement("code");
    code.textContent = "npm run photos";
    command.append(code);

    item.append(line, command);
    els.albumGrid.replaceChildren(item);
    updateDocumentTitle();
  }

  function awardFor(id) {
    const awards = COPY[state.lang].awards;
    let hash = 5381;
    for (let index = 0; index < id.length; index += 1) {
      hash = ((hash << 5) + hash + id.charCodeAt(index)) >>> 0;
    }
    return awards[hash % awards.length];
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

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return value.replace(/["\\]/g, "\\$&");
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

  function onKeydown(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTyping(event.target)) return;

    if (els.dialog.open) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigatePhoto(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigatePhoto(-1);
      }
      return;
    }

    if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      spin();
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

  function navigatePhoto(direction) {
    if (!state.current || state.photos.length < 2) return;
    const index = state.photos.findIndex((photo) => photo.id === state.current.id);
    const next = (index + direction + state.photos.length) % state.photos.length;
    openPhoto(state.photos[next]);
  }

  async function shareCurrent() {
    if (!state.current) return;

    const photo = state.current;
    const award = awardFor(photo.id);
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("lang", state.lang);
    url.searchParams.set("photo", photo.id);

    const shareData = {
      title: t("shareTitle", { award }),
      text: t("shareText", { award }),
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

  function playTick() {
    const context = ensureAudioContext();
    if (!context) return;

    if (!noiseBuffer) {
      const duration = 0.05;
      noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) {
        data[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / data.length, 2);
      }
    }

    const now = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2100;
    filter.Q.value = 1.1;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    source.connect(filter).connect(gain).connect(context.destination);
    source.start(now);
    source.stop(now + 0.055);
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
})();
