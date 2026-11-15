// Node test: reads the real data files and checks sampling + HiRISE/MOLA fallback. Run: node tests/terrain.test.mjs
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { makeHirise, makeMola, sample, classOfSlope } from '../js/terrain.js';
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data');
const rd = p => fs.readFileSync(path.join(D, p)), js = p => JSON.parse(rd(p).toString());
const mola = makeMola(js('mola/bounds.json'), rd('mola/gale_mola_dem_int16le.bin'));
const hirise = makeHirise(js('hirise/dtm_gale/bounds.json'), rd('hirise/dtm_gale/gale_hirise_dem_int16le.bin'), rd('hirise/dtm_gale/gale_hirise_slope_deg_uint8.bin'), rd('hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin'));
const T = { hirise, mola };
assert.equal(classOfSlope(14.9), 0); assert.equal(classOfSlope(15), 1); assert.equal(classOfSlope(20), 1); assert.equal(classOfSlope(20.1), 2);
// Bradbury landing cell has NO HiRISE data (flat sand, stereo matching failed): falls back to MOLA with low confidence
const b = sample(T, -4.5895, 137.4417); assert.ok(b && b.source === 'mola' && b.lowConfidence, 'Bradbury falls back to MOLA');
assert.ok(Math.abs(b.elev + 4501) < 60, 'MOLA elevation near -4500 m at Bradbury, got ' + b.elev);
// find a real HiRISE cell and check the lookup returns it
let hit = null; for (let r = 0; r < hirise.H && !hit; r += 37) for (let c = 0; c < hirise.W; c += 37) { const k = r * hirise.W + c; if (hirise.dem[k] !== -32768 && hirise.slope[k] !== 255) { hit = { r, c, k }; break; } }
assert.ok(hit); const lat = hirise.north - (hit.r + 0.5) * hirise.step, lon = hirise.west + (hit.c + 0.5) * hirise.step; const hs = sample(T, lat, lon);
assert.ok(hs.source === 'hirise' && hs.elev === hirise.dem[hit.k] && hs.slope === hirise.slope[hit.k] && hs.cls === hirise.cls[hit.k]);
// a point far outside the HiRISE crop falls back to MOLA and is flagged low confidence
const m = sample(T, -6.0, 138.5); assert.ok(m && m.source === 'mola' && m.lowConfidence);
// completely outside the region
assert.equal(sample(T, 10, 10), null);
// HiRISE vs MOLA elevation at the same real HiRISE cell: report only (known offsets of +1..+44 m, MOLA is 463 m resolution)
const mmx = sample({ hirise: null, mola }, lat, lon); assert.ok(Math.abs(mmx.elev - hs.elev) < 250, `MOLA ${mmx.elev} vs HiRISE ${hs.elev}`);
console.log('terrain tests passed; hirise grid', hirise.W, 'x', hirise.H, 'step m', (hirise.step * 59274.7).toFixed(2));
