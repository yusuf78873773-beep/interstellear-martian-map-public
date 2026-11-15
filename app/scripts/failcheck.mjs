// Resilience check: blocks data files and verifies the app keeps working and shows short messages. Usage (from app/): node scripts/failcheck.mjs
import { spawn } from 'node:child_process';
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), APP = path.resolve(here, '..'), PORT = 8135;
const { chromium } = await import('playwright');
const srv = spawn(process.execPath, [path.join(here, 'serve.mjs'), path.join(APP, 'dist'), String(PORT)], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch();
async function scenario(name, blocked, steps) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const uncaught = [];
  page.on('pageerror', e => uncaught.push(String(e)));
  await page.route(u => blocked.some(b => u.pathname.includes(b)), r => r.abort());
  await page.goto(`http://localhost:${PORT}/`); await page.waitForSelector('[data-layer="traverse"]'); await page.click('#welcomeGo').catch(() => {});
  const result = await steps(page); console.log(`${uncaught.length ? 'FAIL' : 'ok  '} ${name}: ${result}${uncaught.length ? ' | uncaught: ' + uncaught[0] : ''}`);
  if (uncaught.length) process.exitCode = 1; await page.context().close();
}
await scenario('manifest.json missing', ['manifest.json'], async p => `layer panel rows: ${await p.locator('.layer').count()}`);
await scenario('traverse layer file missing', ['traverse.geojson'], async p => { await p.click('[data-layer="traverse"] input[type=checkbox]'); await p.waitForTimeout(1500); return `status "${await p.textContent('[data-layer="traverse"] .status')}"`; });
await scenario('HiRISE grids missing', ['gale_hirise_'], async p => { await p.click('[data-layer="hirise_slope"] input[type=checkbox]'); await p.waitForTimeout(2000); const s = await p.textContent('[data-layer="hirise_slope"] .status'); await p.click('#tabRouteBtn'); await p.click('#planBtn'); await p.waitForTimeout(2500); return `layer status "${s}", route message "${(await p.textContent('#routeMsg')).slice(0, 90)}"`; });
await scenario('REMS/RAD csv missing (context panel)', ['rems_daily.csv', 'rad_daily_dose.csv'], async p => { await p.click('#tabRouteBtn'); await p.click('#planBtn'); await p.waitForSelector('#ctxResults', { timeout: 40000 }); await p.waitForTimeout(3000); return `context: "${(await p.textContent('#ctxResults')).slice(0, 90)}"`; });
await scenario('photos csv and image missing', ['photos.csv', 'nevado_sajama'], async p => { await p.click('#tabPhotosBtn'); await p.waitForTimeout(800); return `gallery text: "${(await p.textContent('#tab-photos')).slice(0, 80)}"`; });
await browser.close(); srv.kill();
