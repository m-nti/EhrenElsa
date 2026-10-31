#!/usr/bin/env node
// Builds photos.json and the thumbnails for static hosting.
//
// Put the real photos in photos/ (JPG, PNG, WebP, GIF, AVIF) and run:
//
//   npm run photos
//
// If photos/ has no images, the script writes a manifest for the sample cards
// in demo/ instead, so the site still works out of the box. On the IONOS
// server, photos.php can build the same list live and the browser prefers it.

import { execFileSync } from "node:child_process";
import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync
} from "node:fs";
import { join, resolve, extname, parse } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const photosDir = join(root, "photos");
const thumbDir = join(photosDir, "thumbs");
const demoDir = join(root, "demo");
const demoThumbDir = join(demoDir, "thumbs");
const manifestPath = join(root, "photos.json");
const captionsPath = join(photosDir, "captions.json");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const THUMB_MAX = 720;

function listImages(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => !entry.name.startsWith("."))
    .filter((entry) => IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
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

function uniqueId(base, used) {
  let id = base || "photo";
  let attempt = 2;

  while (used.has(id)) {
    id = `${base || "photo"}-${attempt}`;
    attempt += 1;
  }

  used.add(id);
  return id;
}

function imageSize(file) {
  try {
    const output = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    const width = Number((output.match(/pixelWidth:\s*(\d+)/) || [])[1]);
    const height = Number((output.match(/pixelHeight:\s*(\d+)/) || [])[1]);
    if (width && height) return { width, height };
  } catch {
    // sips is macOS-only. The browser can still scale the original.
  }

  return { width: 1200, height: 1200 };
}

function makeThumbnail(source, target) {
  try {
    if (existsSync(target) && statSync(target).mtimeMs >= statSync(source).mtimeMs) {
      return true;
    }

    execFileSync("sips", [
      "-Z", String(THUMB_MAX),
      "-s", "format", "jpeg",
      "-s", "formatOptions", "82",
      source,
      "--out", target
    ], { stdio: "ignore" });

    return true;
  } catch {
    return false;
  }
}

function loadCaptions() {
  if (!existsSync(captionsPath)) return {};

  try {
    const parsed = JSON.parse(readFileSync(captionsPath, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    console.warn(`Could not read photos/captions.json: ${error.message}`);
    return {};
  }
}

function captionFor(captions, filename) {
  const entry = captions[filename];

  if (typeof entry === "string") {
    return { caption: entry.trim(), alt: "" };
  }

  if (entry && typeof entry === "object") {
    return {
      caption: typeof entry.caption === "string" ? entry.caption.trim() : "",
      alt: typeof entry.alt === "string" ? entry.alt.trim() : ""
    };
  }

  return { caption: "", alt: "" };
}

function encodeName(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

function realPhotos() {
  const captions = loadCaptions();
  const used = new Set();

  return listImages(photosDir).map((filename, index) => {
    const id = uniqueId(slugify(parse(filename).name), used);
    const source = join(photosDir, filename);
    const thumbName = `${id}.jpg`;
    const thumbPath = join(thumbDir, thumbName);
    const hasThumb = makeThumbnail(source, thumbPath);
    const { width, height } = imageSize(source);
    const { caption, alt } = captionFor(captions, filename);
    const src = `photos/${encodeName(filename)}`;

    return {
      id,
      src,
      thumb: hasThumb ? `photos/thumbs/${encodeName(thumbName)}` : src,
      view: src,
      filename,
      caption,
      alt,
      demo: false,
      width,
      height,
      order: index
    };
  });
}

function demoPhotos() {
  return listImages(demoDir).map((filename, index) => {
    const id = slugify(parse(filename).name) || `sample-${index + 1}`;
    const { width, height } = imageSize(join(demoDir, filename));
    const thumbName = filename;
    const thumbPath = join(demoThumbDir, thumbName);

    return {
      id,
      src: `demo/${encodeName(filename)}`,
      thumb: existsSync(thumbPath) ? `demo/thumbs/${encodeName(thumbName)}` : `demo/${encodeName(filename)}`,
      view: `demo/${encodeName(filename)}`,
      filename,
      caption: "",
      alt: "",
      demo: true,
      width,
      height,
      order: index
    };
  });
}

mkdirSync(photosDir, { recursive: true });
mkdirSync(thumbDir, { recursive: true });

let photos = realPhotos();
let source = "photos";

if (!photos.length) {
  photos = demoPhotos();
  source = "demo";
}

const manifest = {
  generated: new Date().toISOString(),
  source,
  photos: photos.map(({ order, ...photo }) => photo)
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Wrote photos.json with ${manifest.photos.length} ${source === "demo" ? "sample cards" : "photos"}.`);

if (source === "demo") {
  console.log("Put Elsa's photos in photos/ and run npm run photos again.");
} else {
  console.log("Thumbnails are in photos/thumbs/.");
}
