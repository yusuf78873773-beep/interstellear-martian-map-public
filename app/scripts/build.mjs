// Builds the static site into app/dist: copies app sources and ONLY the data files the app needs,
// converts data/MANIFEST.csv to data/manifest.json, reports the total size (warns above 150 MB).
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(here, '..');
const REPO = path.resolve(APP, '..');
const DIST = path.join(APP, 'dist');
const LIMIT_MB = 150;

// data files the app loads (relative to <repo>/data)
const DATA = [
  'ctx/bounds.json', 'ctx/gale_ctx_overview.png', 'ctx/gale_ctx_detail_sharp_base.png', 'ctx/gale_ctx_detail_boxwork.png',
  'mola/bounds.json', 'mola/gale_mola_clrshade.png', 'mola/gale_mola_dem_int16le.bin',
  'themis/bounds.json', 'themis/gale_themis_day_ir.png', 'themis/gale_themis_night_ir.png',
  'crism/bounds.json', 'crism/gale_mtrdr_products.csv', 'crism/browse/*.png',
  'hirise/dtm_gale/bounds.json', 'hirise/dtm_gale/gale_hirise_dem_int16le.bin',
  'hirise/dtm_gale/gale_hirise_slope_deg_uint8.bin', 'hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin',
  'curiosity-traverse/traverse.geojson',
  'chemistry/chemcam_points.csv', 'chemistry/apxs_all.csv',
  'boxwork/boxwork_area.geojson', 'boxwork/drill_sites.geojson',
  'sharad/sharad_tracks.geojson',
  'curiosity-rad/rad_daily_dose.csv', 'rems/rems_daily.csv',
  'photos/photos.csv', 'photos/nevado_sajama_drillhole_sol4718_navcam.jpg', 'photos/boxwork_ridge_closeup_PIA26558.jpg', 'photos/boxwork_panorama_PIA26693.jpg', 'photos/hirise_boxwork_PIA26306.jpg',
];
const APP_ITEMS = ['index.html', 'css', 'js', 'vendor', 'vercel.json', 'favicon.svg']; // vercel.json (cache headers) is deployed with dist

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copy(src, dst) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.cpSync(src, dst, { recursive: true }); }
function parseCsv(text) { // small RFC4180 parser
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.length > 1);
}
function dirSize(p) { let s = 0; for (const e of fs.readdirSync(p, { withFileTypes: true })) { const a = path.join(p, e.name); s += e.isDirectory() ? dirSize(a) : fs.statSync(a).size; } return s; }

rmrf(DIST); fs.mkdirSync(DIST, { recursive: true });
for (const it of APP_ITEMS) copy(path.join(APP, it), path.join(DIST, it));
if (fs.existsSync(path.join(APP, 'screenshots', '01_overview_layers.png'))) copy(path.join(APP, 'screenshots', '01_overview_layers.png'), path.join(DIST, 'social.png')); // Open Graph preview image

let nFiles = 0;
for (const spec of DATA) {
  if (spec.includes('*')) {
    const dir = path.dirname(spec), ext = path.extname(spec);
    for (const f of fs.readdirSync(path.join(REPO, 'data', dir)).filter(f => f.endsWith(ext))) { copy(path.join(REPO, 'data', dir, f), path.join(DIST, 'data', dir, f)); nFiles++; }
  } else if (spec.endsWith('.bin')) { // terrain grids: gzip (the app requests <name>.bin.gz and inflates it in the browser)
    const out = path.join(DIST, 'data', spec + '.gz'); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, zlib.gzipSync(fs.readFileSync(path.join(REPO, 'data', spec)), { level: 9 })); nFiles++;
  } else { copy(path.join(REPO, 'data', spec), path.join(DIST, 'data', spec)); nFiles++; }
}
// MANIFEST.csv -> manifest.json (keyed by repo path)
const rows = parseCsv(fs.readFileSync(path.join(REPO, 'data', 'MANIFEST.csv'), 'utf8'));
const head = rows[0], manifest = {};
for (const r of rows.slice(1)) { const o = Object.fromEntries(head.map((h, i) => [h, r[i]])); manifest[o.folder + '/' + o.file] = { source: o.source_url, type: o.type, badge: o.badge, limit_tr: o.known_limit, bytes: +o.size_bytes }; }
fs.writeFileSync(path.join(DIST, 'data', 'manifest.json'), JSON.stringify(manifest));

const mb = dirSize(DIST) / 1e6;
console.log(`dist built: ${nFiles} data files, ${Object.keys(manifest).length} manifest entries, total ${mb.toFixed(1)} MB`);
if (mb > LIMIT_MB) { console.warn(`WARNING: dist is ${mb.toFixed(1)} MB, above the ${LIMIT_MB} MB limit`); process.exitCode = 1; }
