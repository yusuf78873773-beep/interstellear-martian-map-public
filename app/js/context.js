// Route context: radiation estimate (Curiosity RAD), environment (REMS air temperature vs suit range), science stops in a 200 m corridor,
// "why this route" facts and GeoJSON export. Pure functions (no DOM).
import { M_PER_DEG } from './config.js';
import { parseCsv, colIndex } from './csv.js';

// Suit outer-surface design temperature range: data/suit/README.md section 5.A (NASA JSC), vacuum design.
export const SUIT_TEMP_C = { min: -157, max: 121 };
// Suit/payload scenarios: data/suit/README.md "Toplam Yuk Senaryolari" (Mars g = 0.38). Display only: the walking-speed formula does not take mass as an input.
export const SUIT_SCENARIOS = [
  { id: 'A', suitKg: 180, astronautKg: 80, marsWeightKg: 98.8, inertiaKg: 260 }, // current technology, xEMU class
  { id: 'B', suitKg: 60, astronautKg: 80, marsWeightKg: 53.2, inertiaKg: 140 },  // target Mars suit (concept)
];
export const CORRIDOR_M = 200;
export const DRILL_WEIGHT = 10; // ASSUMPTION: one drill site counts as 10 measurements in the stop score

// ---- RAD: data/curiosity-rad/rad_daily_dose.csv (E detector, absorbed dose rate in uGy/h, QC-filtered, sampled sols)
export function radStats(csvText) {
  const { header, rows } = parseCsv(csvText), ix = colIndex(header);
  const rates = rows.map(r => +r[ix.dose_E_mean]).filter(isFinite);
  const sep = rows.filter(r => r[ix.possible_sep] === '1').map(r => ({ sol: +r[ix.sol], peak: +r[ix.dose_E_max] }));
  return { n: rates.length, mean: rates.reduce((a, b) => a + b, 0) / rates.length, min: Math.min(...rates), max: Math.max(...rates), sep, sepPeak: sep.length ? Math.max(...sep.map(s => s.peak)) : null };
}
export const radDose = (stats, hours) => ({ hours, typical: stats.mean * hours, sepWorst: stats.sepPeak == null ? null : stats.sepPeak * hours }); // uGy

// ---- REMS: data/rems/rems_daily.csv (air temperature only; ground-temperature minima are doubtful and are NOT used)
export function remsAir(csvText) {
  const { header, rows } = parseCsv(csvText), ix = colIndex(header);
  const mn = rows.map(r => +r[ix.air_temp_min_C]).filter(isFinite), mean = rows.map(r => +r[ix.air_temp_mean_C]).filter(isFinite), mx = rows.map(r => +r[ix.air_temp_max_C]).filter(isFinite);
  return { n: rows.length, min: Math.min(...mn), mean: mean.reduce((a, b) => a + b, 0) / mean.length, max: Math.max(...mx) };
}
export const suitCompare = air => ({ inside: air.min >= SUIT_TEMP_C.min && air.max <= SUIT_TEMP_C.max, suit: SUIT_TEMP_C });

// All REMS columns we carry, as ranges over the sampled sols (one station: Curiosity, not along any route). Wind = number of sols with wind values.
export function remsConditions(csvText) {
  const { header, rows } = parseCsv(csvText), ix = colIndex(header);
  const col = name => rows.map(r => r[ix[name]]).filter(v => v !== '' && v != null).map(Number).filter(isFinite);
  const rng = (lo, mid, hi) => { const a = col(lo), m = col(mid), b = col(hi); return a.length ? { min: Math.min(...a), mean: m.reduce((x, y) => x + y, 0) / m.length, max: Math.max(...b) } : null; };
  const sols = rows.map(r => +r[ix.sol]).filter(isFinite), uvMax = col('uv_abc_max_Wm2');
  return { n: rows.length, solFirst: Math.min(...sols), solLast: Math.max(...sols),
    air: rng('air_temp_min_C', 'air_temp_mean_C', 'air_temp_max_C'), pressure: rng('pressure_min_Pa', 'pressure_mean_Pa', 'pressure_max_Pa'), rh: rng('rh_local_min_pct', 'rh_local_mean_pct', 'rh_local_max_pct'),
    uv: uvMax.length ? { n: uvMax.length, max: Math.max(...uvMax), meanOfMeans: col('uv_abc_mean_Wm2').reduce((x, y) => x + y, 0) / col('uv_abc_mean_Wm2').length } : null,
    windSols: col('n_wind_h_values').filter(v => v > 0).length };
}

// ---- corridor / science stops
const toXY = (lat, lon, lat0, lon0) => [(lon - lon0) * M_PER_DEG * Math.cos(lat0 * Math.PI / 180), (lat - lat0) * M_PER_DEG];
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy; let u = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0; u = Math.max(0, Math.min(1, u));
  return Math.hypot(px - (ax + u * dx), py - (ay + u * dy));
}
export function makeCorridor(coords, widthM = CORRIDOR_M) {
  const lat0 = coords.reduce((a, c) => a + c.lat, 0) / coords.length, lon0 = coords.reduce((a, c) => a + c.lon, 0) / coords.length;
  const keep = coords.filter((c, i) => i % 3 === 0 || i === coords.length - 1), xy = keep.map(c => toXY(c.lat, c.lon, lat0, lon0));
  const xs = xy.map(p => p[0]), ys = xy.map(p => p[1]), box = [Math.min(...xs) - widthM, Math.max(...xs) + widthM, Math.min(...ys) - widthM, Math.max(...ys) + widthM];
  const dist = (lat, lon) => { const [x, y] = toXY(lat, lon, lat0, lon0); if (x < box[0] || x > box[1] || y < box[2] || y > box[3]) return Infinity; let best = Infinity; for (let i = 1; i < xy.length; i++) { const d = distToSegment(x, y, xy[i - 1][0], xy[i - 1][1], xy[i][0], xy[i][1]); if (d < best) best = d; } if (xy.length === 1) best = Math.hypot(x - xy[0][0], y - xy[0][1]); return best; };
  return { dist, widthM };
}

// chem / apxs: {header, rows} from parseCsv; drills: GeoJSON features
export function analyzeCorridor(coords, chem, apxs, drills, widthM = CORRIDOR_M) {
  const C = makeCorridor(coords, widthM), stops = new Map();
  const add = (lat, lon, d, kind) => { const k = lat.toFixed(5) + ',' + lon.toFixed(5); let s = stops.get(k); if (!s) { s = { lat, lon, dist: d, chem: 0, apxs: 0 }; stops.set(k, s); } s[kind]++; s.dist = Math.min(s.dist, d); };
  let nChem = 0, nApxs = 0;
  if (chem) { const ix = colIndex(chem.header); for (const r of chem.rows) { if (r[ix.is_calibration_target] === '1') continue; const lat = +r[ix.rover_lat], lon = +r[ix.rover_lon], d = C.dist(lat, lon); if (d <= widthM) { nChem++; add(lat, lon, d, 'chem'); } } }
  if (apxs) { const ix = colIndex(apxs.header); for (const r of apxs.rows) { const lat = +r[ix.lat_from_northing], lon = +r[ix.lon_from_easting]; if (!isFinite(lat) || !isFinite(lon)) continue; const d = C.dist(lat, lon); if (d <= widthM) { nApxs++; add(lat, lon, d, 'apxs'); } } }
  const drillsIn = []; for (const f of drills || []) { if (!f.geometry) continue; const [lon, lat] = f.geometry.coordinates, d = C.dist(lat, lon); if (d <= widthM) drillsIn.push({ name: f.properties.name, lat, lon, dist: d }); }
  const list = [...stops.values()].sort((a, b) => (b.chem + b.apxs) - (a.chem + a.apxs));
  return { widthM, nChem, nApxs, nDrills: drillsIn.length, drills: drillsIn, score: nChem + nApxs + DRILL_WEIGHT * drillsIn.length, stops: list.slice(0, 8), nStopLocations: list.length };
}

// ---- "why this route": only numbers that were computed; no free-form claims
export function whyFacts(res, corridor) {
  const m = res.metrics, limit = res.opts.maxSlope, st = res.straight;
  return {
    km: m.distance / 1000, hours: m.time / 3600, avgSpeed: m.distance / m.time, limit,
    green: m.classFraction[0] * 100, yellow: m.classFraction[1] * 100, red: m.classFraction[2] * 100,
    straightKm: st.length / 1000, overPct: st.fractionOver * 100, detourPct: st.length > 0 ? (m.distance / st.length - 1) * 100 : 0,
    molaPct: m.molaFraction * 100, nChem: corridor?.nChem ?? 0, nApxs: corridor?.nApxs ?? 0, nDrills: corridor?.nDrills ?? 0, score: corridor?.score ?? 0,
  };
}

// ---- GeoJSON export (Mars coordinates [lon, lat], NOT WGS84)
export function routeGeoJSON(res, extra = {}) {
  const m = res.metrics;
  return {
    type: 'FeatureCollection',
    crs_note: '[longitude east, planetocentric latitude] degrees, Mars 2000 sphere (R = 3396190 m), not WGS84',
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: res.coords.map(c => [+c.lon.toFixed(6), +c.lat.toFixed(6)]) },
        properties: { kind: 'route', mode: res.mode, distance_m: Math.round(m.distance), time_one_way_s: Math.round(m.time), max_slope_deg: +m.maxSlope.toFixed(1),
          class_fraction_green_yellow_red: m.classFraction.map(x => +x.toFixed(3)), mola_fraction: +m.molaFraction.toFixed(3), slope_limit_deg: res.opts.maxSlope,
          parameters: res.params, note: 'Walking speed V = 0.75 - 0.01*S (S in percent grade). MOLA-routed parts are low confidence. Planner grid ~32 m. Estimate only.', ...extra } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [res.start.lon, res.start.lat] }, properties: { kind: 'start' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [res.goal.lon, res.goal.lat] }, properties: { kind: 'goal' } },
    ],
  };
}
