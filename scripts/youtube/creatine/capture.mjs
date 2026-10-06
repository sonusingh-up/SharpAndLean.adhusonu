/*
 * Opens .out/video.html in Chromium and saves one JPEG per frame by calling
 * window.seek(f / 30).
 *
 *   node capture.mjs               all frames  → .out/frames/00000.jpg … (add --part=i/n to split the work)
 *   node capture.mjs 1.5 5 8.6     stills at those seconds → .out/stills/
 *
 * Chromium is found from CHROMIUM_PATH, then the usual install locations,
 * then whatever Chrome playwright-core can find on the machine.
 */
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const FPS = 30;
const { end } = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8'));

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(pw)) {
    for (const d of readdirSync(pw).filter((n) => /^chromium-\d+/.test(n)).sort().reverse()) {
      for (const rel of ['chrome-linux/chrome', 'chrome-win/chrome.exe', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        if (existsSync(join(pw, d, rel))) return join(pw, d, rel);
      }
    }
  }
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ];
  return candidates.find(existsSync);
}

const executablePath = findChromium();
const browser = await chromium.launch(executablePath ? { executablePath } : { channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(out, 'video.html')).href);
await page.evaluate(() => document.fonts.ready);

const stills = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
if (stills.length) {
  mkdirSync(join(out, 'stills'), { recursive: true });
  for (const t of stills) {
    await page.evaluate((x) => window.seek(x), t);
    await page.screenshot({ path: join(out, 'stills', `${t.toFixed(2)}.jpg`), type: 'jpeg', quality: 88 });
  }
  console.log(`${stills.length} stills written`);
} else {
  const dir = join(out, 'frames');
  if (!process.argv.some((a) => a.startsWith('--part='))) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const total = Math.round(end * FPS);
  // --part=i/n captures every n-th frame starting at i, so several copies can run side by side.
  const part = (process.argv.find((a) => a.startsWith('--part=')) || '--part=0/1').slice(7).split('/').map(Number);
  for (let f = part[0]; f < total; f += part[1]) {
    await page.evaluate((x) => window.seek(x), f / FPS);
    await page.screenshot({ path: join(dir, `${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  }
  console.log(`${total} frames written`);
}
await browser.close();
