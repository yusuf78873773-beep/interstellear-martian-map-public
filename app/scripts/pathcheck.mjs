// Deploy check: serves dist from a sub-folder on another port, loads it with playwright, runs the default route and reports
// failed requests, requests to other origins and console errors.  Usage (from app/): node scripts/pathcheck.mjs [port] [subfolder]
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), APP = path.resolve(here, '..');
const PORT = +(process.argv[2] || 8131), SUB = process.argv[3] || 'deep/er/site';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-sub-')); fs.cpSync(path.join(APP, 'dist'), path.join(root, SUB), { recursive: true });
const { chromium } = await import('playwright');
const srv = spawn(process.execPath, [path.join(here, 'serve.mjs'), root, String(PORT)], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch(); const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const origin = `http://localhost:${PORT}`, bad = [], foreign = [], errors = [], seen = new Set();
page.on('request', r => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith('blob:') && !u.startsWith('data:')) foreign.push(u); seen.add(u); });
page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
page.on('requestfailed', r => bad.push('failed ' + r.url()));
page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`${origin}/${SUB}/`); await page.waitForSelector('[data-layer="traverse"]');
await page.click('#welcomeGo').catch(() => {}); await page.click('#tabRouteBtn'); await page.click('#planBtn'); await page.waitForSelector('#ctxResults h3', { timeout: 40000 }); await page.waitForTimeout(1500);
await browser.close(); srv.kill(); fs.rmSync(root, { recursive: true, force: true });
console.log(`served from ${origin}/${SUB}/ : ${seen.size} requests`);
console.log('failed/4xx:', bad.length ? bad : 'none'); console.log('other origins:', foreign.length ? foreign : 'none'); console.log('console errors:', errors.length ? errors : 'none');
process.exitCode = bad.length || foreign.length || errors.length ? 1 : 0;
