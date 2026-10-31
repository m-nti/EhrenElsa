import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--disable-gpu", "--no-first-run"]
});

try {
  const page = await browser.newPage();
  for (const width of [320, 390, 414, 640]) {
    await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
    await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => {
      const rect = (sel) => {
        const r = document.querySelector(sel).getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), right: Math.round(r.right) };
      };
      return {
        viewport: window.innerWidth,
        scrollW: document.documentElement.scrollWidth,
        inner: rect(".masthead__inner"),
        wordmark: rect(".wordmark"),
        nav: rect(".masthead__nav"),
        lang: rect(".lang-switch"),
        sound: rect(".sound-toggle")
      };
    });
    console.log(width, JSON.stringify(data));
  }
} finally {
  await browser.close();
}
