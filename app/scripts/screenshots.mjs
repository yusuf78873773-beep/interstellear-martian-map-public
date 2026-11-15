// Takes 13 PNG screenshots into app/screenshots/. Needs playwright (npm install --no-save playwright; npx playwright install chromium).
// Usage (from app/): node scripts/screenshots.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), APP = path.resolve(here, '..'), OUT = path.join(APP, 'screenshots'), PORT = 8124;
fs.mkdirSync(OUT, { recursive: true });
const { chromium } = await import('playwright');
const srv = spawn(process.execPath, [path.join(here, 'serve.mjs'), path.join(APP, 'dist'), String(PORT)], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => localStorage.setItem('lang', 'en'));
await page.goto(`http://localhost:${PORT}/`); await page.waitForSelector('[data-layer="traverse"]'); await page.waitForTimeout(800);
const on = async id => { await page.click(`[data-layer="${id}"] input[type=checkbox]`); for (let i = 0; i < 60; i++) { await page.waitForTimeout(250); if (!(await page.textContent(`[data-layer="${id}"] .status`))) break; } };
const shot = async name => { await page.waitForTimeout(700); await page.screenshot({ path: path.join(OUT, name) }); console.log('saved', name); };
const view = (lat, lon, z) => page.evaluate(([a, b, c]) => { window.__map.setView([a, b], c, { animate: false }); }, [lat, lon, z]);

// 0) opening card
await shot('09_welcome_card.png'); await page.click('#welcomeGo');
// 1) overview: CTX + Curiosity route + drill sites + boxwork areas
await on('traverse'); await on('drills'); await on('boxwork'); await view(-4.72, 137.42, 11); await shot('01_overview_layers.png');
// 2) slope / hazard layer with readout and legend
await on('hirise_hazard'); await view(-4.74, 137.4, 13); await page.evaluate(() => window.__map.fire('mousemove', { latlng: window.L.latLng(-4.76, 137.4) })); await page.waitForTimeout(300); await shot('02_slope_hazard.png');
await on('hirise_hazard'); // switch it off again for the next shots
// 3) route result (default: Bradbury Landing -> Nevado Sajama on foot)
await page.click('#tabRouteBtn'); await page.click('#planBtn'); await page.waitForSelector('#ctxResults h3', { timeout: 30000 }); await page.waitForTimeout(800);
await page.evaluate(() => { document.querySelector('#routeResults h3').scrollIntoView({ block: 'start' }); }); await shot('03_route_result.png');
// 4) science stops: ChemCam + APXS points along the route, list in the panel
await page.click('#tabLayersBtn'); await on('chemcam'); await on('apxs'); await page.click('#tabRouteBtn'); await page.evaluate(() => { const h = [...document.querySelectorAll('#ctxResults h3')].find(e => /Science stops/.test(e.textContent)); h?.scrollIntoView({ block: 'start' }); }); await shot('04_science_stops.png');
// 5) SHARAD track crossing the boxwork corridor, popup with the clutter warning
await page.click('#tabLayersBtn'); await on('sharad');
await page.evaluate(() => { let target = null; window.__map.eachLayer(l => { if (l.feature?.properties?.boxwork_koridoru && !target) target = l; }); const b = target.getBounds(); window.__map.fitBounds(b.pad(0.4), { animate: false }); target.openPopup(b.getCenter()); }); await shot('05_sharad_warning.png');
// 6) About & limits
await page.click('#aboutBtn'); await page.waitForSelector('#aboutDlg[open]'); await shot('06_about_limits.png');
// 7) hybrid route: zoom on the parking point and the walking leg (route tab, result panel with both legs)
await page.click('#aboutDlg .close'); await page.click('#tabRouteBtn'); await view(-4.8035, 137.3815, 16);
await page.evaluate(() => { document.querySelector('#routeResults h3').scrollIntoView({ block: 'start' }); }); await shot('07_hybrid_route.png');
// 8) photo gallery (lazy loaded images)
await page.click('#tabPhotosBtn'); await page.waitForSelector('#tab-photos img'); await page.evaluate(() => document.querySelectorAll('#tab-photos img').forEach(i => i.scrollIntoView()));
await page.waitForFunction(() => [...document.querySelectorAll('#tab-photos img')].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }); await page.evaluate(() => document.querySelector('#tab-photos').scrollTo?.(0, 0)); await page.evaluate(() => document.querySelector('#tab-photos h2').scrollIntoView({ block: 'start' })); await shot('08_photo_gallery.png');
// 10) rock avoidance: rough-ground layer + route + "Avoided rock formations"
await page.click('#tabLayersBtn'); await on('rough'); await view(-4.70, 137.41, 12); await page.click('#tabRouteBtn');
await page.evaluate(() => { const h = [...document.querySelectorAll('#routeResults h4')].find(e => /Avoided rock/.test(e.textContent)); h?.scrollIntoView({ block: 'start' }); }); await shot('10_rock_avoidance.png');
// 11) safety: solar storm comparison and suit effect
await page.evaluate(() => { const h = [...document.querySelectorAll('#ctxResults caption')].find(e => /Solar storm/.test(e.textContent)); h?.scrollIntoView({ block: 'start' }); }); await shot('11_safety_storm_suit.png');
// 12) current conditions (REMS) panel
await page.evaluate(() => { const h = [...document.querySelectorAll('#ctxResults h3')].find(e => /Current conditions/.test(e.textContent)); h?.scrollIntoView({ block: 'start' }); }); await shot('12_conditions_rems.png');
// 13) one-click scenarios (top of the Route tab)
await page.evaluate(() => { document.querySelector('#tab-route .scenarios').scrollIntoView({ block: 'start' }); }); await shot('13_scenarios.png');
await browser.close(); srv.kill();
if (errors.length) { console.log('console errors:', errors.slice(0, 5)); process.exitCode = 1; } else console.log('no console errors');
