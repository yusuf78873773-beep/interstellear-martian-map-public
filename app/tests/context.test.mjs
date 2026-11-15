// Node tests for the route context helpers. Run: node tests/context.test.mjs
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { radStats, radDose, remsAir, remsConditions, suitCompare, makeCorridor, analyzeCorridor, routeGeoJSON, DRILL_WEIGHT } from '../js/context.js';
import { parseCsv } from '../js/csv.js';
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data'), rd = p => fs.readFileSync(path.join(D, p), 'utf8');

// RAD: the repo README quotes 124-sol mean 9.94 uGy/h, solar-event candidate peak 28.8 uGy/h
const rad = radStats(rd('curiosity-rad/rad_daily_dose.csv'));
assert.equal(rad.n, 124); assert.ok(Math.abs(rad.mean - 9.94) < 0.01, 'mean ' + rad.mean); assert.ok(Math.abs(rad.sepPeak - 28.81) < 0.05); assert.deepEqual(rad.sep.map(s => s.sol).sort((a, b) => a - b), [351, 390]);
const dose = radDose(rad, 6); assert.ok(Math.abs(dose.typical - 59.6) < 0.2);

// REMS air temperature range stays inside the suit design range
const air = remsAir(rd('rems/rems_daily.csv')); assert.equal(air.n, 123); assert.ok(air.min < -50 && air.max > 0 && air.max < 20, JSON.stringify(air)); assert.ok(suitCompare(air).inside);
{ const c = remsConditions(rd('rems/rems_daily.csv')); assert.equal(c.n, 123); assert.ok(c.pressure.min > 600 && c.pressure.max < 1000, 'pressure in Pa'); assert.ok(c.windSols >= 0 && c.windSols < c.n, 'wind: only raw record counts, no speed column'); assert.ok(c.uv && c.uv.n > 100); assert.ok(c.rh.max >= c.rh.min); assert.equal(c.air.min, air.min); }

// corridor: points on and off a straight east-west route
const lat = -4.7, coords = Array.from({ length: 21 }, (_, i) => ({ lat, lon: 137.3 + i * 0.001 })); // ~1.2 km line
const C = makeCorridor(coords, 200); const mPerDegLat = 59274.7;
assert.ok(C.dist(lat, 137.31) < 1); assert.ok(Math.abs(C.dist(lat + 150 / mPerDegLat, 137.31) - 150) < 3); assert.ok(C.dist(lat + 250 / mPerDegLat, 137.31) > 240);
const chem = { header: ['rover_lat', 'rover_lon', 'is_calibration_target'], rows: [[lat, 137.31, '0'], [lat, 137.31, '0'], [lat, 137.31, '1'], [lat + 400 / mPerDegLat, 137.31, '0']] };
const apxs = { header: ['lat_from_northing', 'lon_from_easting'], rows: [[lat + 100 / mPerDegLat, 137.305], ['', '']] };
const drills = [{ geometry: { coordinates: [137.312, lat] }, properties: { name: 'D1' } }, { geometry: null, properties: { name: 'Altadena' } }];
const a = analyzeCorridor(coords, chem, apxs, drills);
assert.equal(a.nChem, 2, 'calibration target and far point excluded'); assert.equal(a.nApxs, 1); assert.equal(a.nDrills, 1); assert.equal(a.score, 2 + 1 + DRILL_WEIGHT);

// real chemistry: the corridor around the Curiosity route at the boxwork has measurements
const traverse = JSON.parse(rd('curiosity-traverse/traverse.geojson')); const line = traverse.features[0].geometry.coordinates.filter((c, i) => i % 20 === 0).map(([lon, la]) => ({ lat: la, lon }));
const ra = analyzeCorridor(line, parseCsv(rd('chemistry/chemcam_points.csv')), parseCsv(rd('chemistry/apxs_all.csv')), JSON.parse(rd('boxwork/drill_sites.geojson')).features);
assert.ok(ra.nChem > 20000 && ra.nApxs > 1000 && ra.nDrills >= 3, JSON.stringify({ c: ra.nChem, a: ra.nApxs, d: ra.nDrills }));

// GeoJSON export has [lon, lat] order
const res = { mode: 'eva', coords, start: coords[0], goal: coords[20], opts: { maxSlope: 20 }, params: {}, metrics: { distance: 1200, time: 1600, maxSlope: 5, classFraction: [1, 0, 0], molaFraction: 0 } };
const gj = routeGeoJSON(res); assert.equal(gj.features[0].geometry.coordinates[0][0], 137.3); assert.equal(gj.features[0].geometry.coordinates[0][1], -4.7);
console.log('context tests passed; RAD mean', rad.mean.toFixed(2), 'uGy/h; corridor on the real traverse:', ra.nChem, 'ChemCam,', ra.nApxs, 'APXS,', ra.nDrills, 'drills');
