// Dev-only screenshot helper — screenshots a local page after a real wait,
// optionally clicking a selector first. Exists because plain
// `chrome --headless --screenshot` unreliably captures this site: the
// preloader (sessionStorage-gated, ~2.3s) and the WebGL/Three.js pages (the
// 360° VR viewer) keep a requestAnimationFrame loop running that confuses
// `--virtual-time-budget`, so a scripted browser with a fixed real-time wait
// is the reliable way to check a rendered state.
//
// Usage:
//   node scripts/screenshot.mjs <url> <outPath> [waitMs] [clickSelector]
//
// Example:
//   node scripts/screenshot.mjs http://localhost:3000/design-interiors/vr-experience out.png 5000
//   node scripts/screenshot.mjs http://localhost:3000/design-interiors/vr-experience out.png 4000 ".ih-vr-enter"
//
// Requires the dev server already running (`npm run dev`) and a local
// Chrome/Edge install — set CHROME_PATH to override the default lookup.

import puppeteer from "puppeteer-core";
import { existsSync } from "fs";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findChrome() {
  for (const path of CHROME_CANDIDATES) {
    if (existsSync(path)) return path;
  }
  throw new Error(
    "Couldn't find a Chrome/Edge install. Set CHROME_PATH to its full executable path."
  );
}

async function main() {
  const [url, outPath, waitMsArg, clickSelector] = process.argv.slice(2);
  if (!url || !outPath) {
    console.error("Usage: node scripts/screenshot.mjs <url> <outPath> [waitMs] [clickSelector]");
    process.exit(1);
  }
  const waitMs = Number(waitMsArg || 3500);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--window-size=1440,900"],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  // domcontentloaded, not networkidle — this dev site keeps a live HMR
  // websocket open, which stops "networkidle" from ever resolving.
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((r) => setTimeout(r, waitMs));

  if (clickSelector) {
    try {
      await page.click(clickSelector);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.log("click failed:", e.message);
    }
  }

  await page.screenshot({ path: outPath });
  await browser.close();
  console.log(`Saved ${outPath}`);
}

main();
