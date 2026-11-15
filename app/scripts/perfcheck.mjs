// Measures first-load size and time with playwright and a throttled connection (CDP). Usage (from app/): node scripts/perfcheck.mjs [kbps] [latencyMs]
import { spawn } from 'node:child_process';
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), APP = path.resolve(here, '..');
const KBPS = +(process.argv[2] || 1600), LAT = +(process.argv[3] || 150), PORT = 8133;
const { chromium } = await import('playwright');
const srv = spawn(process.execPath, [path.join(here, 'serve.mjs'), path.join(APP, 'dist'), String(PORT)], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: LAT, downloadThroughput: (KBPS * 1024) / 8, uploadThroughput: (KBPS * 1024) / 8 });
const files = new Map(); cdp.on('Network.loadingFinished', e => { const f = files.get(e.requestId); if (f) f.bytes = e.encodedDataLength; }); cdp.on('Network.requestWillBeSent', e => files.set(e.requestId, { url: e.request.url, bytes: 0 }));
const t0 = Date.now(); await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' }); const tLoad = Date.now() - t0;
await page.waitForSelector('[data-layer="traverse"]'); const tUi = Date.now() - t0; await page.waitForTimeout(1500);
const rows = [...files.values()].filter(f => f.bytes > 0).sort((a, b) => b.bytes - a.bytes), total = rows.reduce((a, b) => a + b.bytes, 0);
console.log(`throttle ${KBPS} kbit/s, ${LAT} ms latency`); console.log(`load event ${tLoad} ms, layer panel ready ${tUi} ms, ${rows.length} requests, ${(total / 1024).toFixed(0)} KiB transferred (before any layer or route is opened)`);
for (const r of rows.slice(0, 8)) console.log(`  ${(r.bytes / 1024).toFixed(0).padStart(6)} KiB  ${r.url.replace(`http://localhost:${PORT}/`, '')}`);
// then open the heavy layers one by one and time them
for (const id of ['hirise_slope', 'hirise_hazard', 'rough']) {
  const t = Date.now(); await page.click(`[data-layer="${id}"] input[type=checkbox]`); for (let i = 0; i < 400; i++) { await page.waitForTimeout(250); if (!(await page.textContent(`[data-layer="${id}"] .status`))) break; } console.log(`layer ${id}: ${Date.now() - t} ms`);
}
await browser.close(); srv.kill();
