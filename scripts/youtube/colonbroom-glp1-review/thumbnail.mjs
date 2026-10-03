/*
 * Renders the YouTube thumbnail (1280×720) to social/youtube/.
 *   node scripts/youtube/colonbroom-glp1-review/thumbnail.mjs
 */
import { chromium } from 'playwright-core';
import { existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const b64 = (p) => readFileSync(p).toString('base64');
const font = (pkg, file) => b64(join(dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', file));
const product = `data:image/jpeg;base64,${b64(join(here, 'assets', 'product.jpg'))}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{box-sizing:border-box;margin:0}
body{width:1280px;height:720px;overflow:hidden;background:#183b37;color:#fbf9f5;font-family:'DM Sans',sans-serif;font-weight:700;position:relative}
.blob{position:absolute;width:760px;height:760px;border-radius:50%;background:#2f7c72;opacity:.45;right:-180px;top:-200px}
.l{position:absolute;left:64px;top:56px;width:700px}
.logo{display:flex;align-items:center;gap:12px;font-size:30px}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#fbf9f5}.mark i:last-child{background:#7cc47e}
h1{margin-top:44px;font-size:112px;line-height:.98;letter-spacing:-.04em}
h1 em{display:block;font-family:'Newsreader',serif;font-weight:400;color:#d8b876;font-size:1.06em;letter-spacing:-.02em}
.tag{margin-top:34px;display:inline-block;background:#e07a5f;border-radius:999px;padding:16px 34px;font-size:44px;letter-spacing:-.02em}
.pack{position:absolute;right:70px;top:90px;width:440px;height:440px;border-radius:48px;background:#fff;display:grid;place-items:center}
.pack img{width:410px;height:410px;object-fit:contain}
.score{position:absolute;right:40px;bottom:36px;width:250px;height:250px;border-radius:50%;background:#fbf9f5;color:#1c2a28;border:14px solid #e07a5f;display:flex;flex-direction:column;align-items:center;justify-content:center}
.score b{font-size:118px;line-height:.95;letter-spacing:-.05em}.score span{font-size:28px;color:#5d6865}
</style></head><body><div class="blob"></div>
<div class="l"><div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>We read<br>the <em>label.</em></h1><div class="tag">200 mg of bark, not berberine</div></div>
<div class="pack"><img src="${product}"></div>
<div class="score"><b>2.8</b><span>out of 10</span></div>
</body></html>`;

const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const local = existsSync(pw) ? readdirSync(pw).filter((n) => /^chromium-\d+/.test(n)).map((d) => join(pw, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;
const executablePath = process.env.CHROMIUM_PATH || local;
const browser = await chromium.launch(executablePath ? { executablePath } : { channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
const dest = join(here, '..', '..', '..', 'social', 'youtube');
mkdirSync(dest, { recursive: true });
await page.screenshot({ path: join(dest, 'colonbroom-glp1-review-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('thumbnail written');
