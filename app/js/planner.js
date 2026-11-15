// Route planner: planning grid, speed models, A* least-time path, route metrics. Pure functions (no DOM), tested in Node.
import { M_PER_DEG } from './config.js';
import { NODATA16, NODATA8, molaBilinear, classOfSlope, roughness } from './terrain.js';

const D2R = Math.PI / 180;

// ---------------------------------------------------------------------------------------------------
// Speed models
// Walking: NTRS 20250005352, V = -0.01*S + 0.75 m/s, S = slope in PERCENT grade (data/suit/README.md section 2).
// The 0.25 m/s floor comes from data/suit/README.md section 6 (project proposal, not NASA data).
export const WALK = { v0: 0.75, perPercent: 0.01, floor: 0.25 };
export function walkSpeed(slopeDeg) {
  const S = 100 * Math.tan(Math.min(slopeDeg, 89) * D2R);
  return Math.max(WALK.floor, WALK.v0 - WALK.perPercent * S);
}
export const vehicleSpeed = kmh => () => kmh / 3.6; // user assumption, constant

// ---------------------------------------------------------------------------------------------------
// Planning grid. Block-averages the HiRISE grid (factor 4 -> ~32 m cells). A block is "HiRISE" when at least half of
// its cells have elevation and slope; otherwise it takes MOLA elevation and slope (src = 1, low confidence).
export function buildGrid(T, factor = 4) {
  const h = T.hirise, m = T.mola;
  const nx = Math.floor(h.W / factor), ny = Math.floor(h.H / factor), n = nx * ny;
  const elev = new Float32Array(n), slope = new Float32Array(n), src = new Uint8Array(n), cls = new Uint8Array(n);
  const half = (factor * factor) / 2;
  for (let by = 0; by < ny; by++) for (let bx = 0; bx < nx; bx++) {
    let cnt = 0, se = 0, ss = 0;
    for (let y = 0; y < factor; y++) { const row = (by * factor + y) * h.W + bx * factor; for (let x = 0; x < factor; x++) { const k = row + x; if (h.dem[k] !== NODATA16 && h.slope[k] !== NODATA8) { cnt++; se += h.dem[k]; ss += h.slope[k]; } } }
    const i = by * nx + bx;
    if (cnt >= half) { elev[i] = se / cnt; slope[i] = ss / cnt; src[i] = 0; }
    else {
      const lat = h.north - (by * factor + factor / 2) * h.step, lon = h.west + (bx * factor + factor / 2) * h.step;
      const e = molaBilinear(m, m.dem, lat, lon, NODATA16), s = molaBilinear(m, m.slope, lat, lon, NaN);
      elev[i] = e === e ? e : 0; slope[i] = s === s ? s : 0; src[i] = 1;
    }
    cls[i] = classOfSlope(slope[i]);
  }
  const stepDeg = h.step * factor;
  return makeGridMeta({ nx, ny, north: h.north, west: h.west, stepDeg, elev, slope, src, cls, factor, hW: h.W, rawRough: null, hRef: h });
}
export function makeGridMeta(g) { // adds metric cell size at the grid's mean latitude
  const latMid = g.north - (g.ny * g.stepDeg) / 2;
  g.dy = g.stepDeg * M_PER_DEG; g.dx = g.stepDeg * M_PER_DEG * Math.cos(latMid * D2R);
  return g;
}
export const cellOf = (g, lat, lon) => {
  const r = Math.floor((g.north - lat) / g.stepDeg), c = Math.floor((lon - g.west) / g.stepDeg);
  return (r < 0 || c < 0 || r >= g.ny || c >= g.nx) ? -1 : r * g.nx + c;
};
export const centerOf = (g, i) => { const r = Math.floor(i / g.nx), c = i % g.nx; return { lat: g.north - (r + 0.5) * g.stepDeg, lon: g.west + (c + 0.5) * g.stepDeg }; };

// ---------------------------------------------------------------------------------------------------
// Binary min-heap on (priority) with integer payloads
class Heap {
  constructor() { this.p = []; this.v = []; }
  push(pri, val) { const p = this.p, v = this.v; let i = p.length; p.push(pri); v.push(val); while (i > 0) { const q = (i - 1) >> 1; if (p[q] <= p[i]) break; [p[q], p[i]] = [p[i], p[q]]; [v[q], v[i]] = [v[i], v[q]]; i = q; } }
  pop() {
    const p = this.p, v = this.v, top = v[0], lp = p.pop(), lv = v.pop();
    if (p.length) { p[0] = lp; v[0] = lv; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < p.length && p[l] < p[s]) s = l; if (r < p.length && p[r] < p[s]) s = r; if (s === i) break; [p[s], p[i]] = [p[i], p[s]]; [v[s], v[i]] = [v[i], v[s]]; i = s; } }
    return top;
  }
  get size() { return this.p.length; }
}
const NB = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

// opts: { maxSlope (deg), speed(slopeDeg)->m/s, molaPenalty (>=1) }
// Returns { path: [cell indices], cost } or { path: null, reason }.
export function astar(g, start, goal, opts) {
  const { maxSlope, speed, molaPenalty = 1.5 } = opts;
  if (start < 0 || goal < 0) return { path: null, reason: 'outside' };
  const N = g.nx * g.ny, gScore = new Float64Array(N).fill(Infinity), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
  const vmax = speed(0), cell = Math.min(g.dx, g.dy);
  const gr = Math.floor(goal / g.nx), gc = goal % g.nx;
  const h = i => { const r = Math.floor(i / g.nx), c = i % g.nx; return Math.hypot((r - gr) * g.dy, (c - gc) * g.dx) / vmax; };
  const heap = new Heap(); gScore[start] = 0; heap.push(h(start), start);
  const passable = i => g.slope[i] <= maxSlope || i === start || i === goal;
  while (heap.size) {
    const i = heap.pop(); if (closed[i]) continue; closed[i] = 1;
    if (i === goal) { const path = []; for (let k = goal; k !== -1; k = came[k]) path.push(k); return { path: path.reverse(), cost: gScore[goal] }; }
    const r = Math.floor(i / g.nx), c = i % g.nx;
    for (const [dr, dc] of NB) {
      const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= g.ny || cc >= g.nx) continue;
      const j = rr * g.nx + cc; if (closed[j] || !passable(j)) continue;
      const hd = Math.hypot(dr * g.dy, dc * g.dx), dz = g.src[i] !== g.src[j] ? 0 : g.elev[j] - g.elev[i]; // HiRISE/MOLA datum offset (+1..+44 m): no elevation step across the boundary
      const len = Math.hypot(hd, dz), s = (g.slope[i] + g.slope[j]) / 2;
      const pen = (g.src[i] === 1 || g.src[j] === 1) ? molaPenalty : 1;
      const ng = gScore[i] + (len / speed(s)) * pen * (g.pen ? Math.max(g.pen[i], g.pen[j]) : 1);
      if (ng < gScore[j]) { gScore[j] = ng; came[j] = i; heap.push(ng + h(j), j); }
    }
  }
  return { path: null, reason: 'blocked' };
}

// ---------------------------------------------------------------------------------------------------
// Metrics along a path (cell index list). Time excludes the MOLA routing penalty (it is only a routing preference).
export function routeMetrics(g, path, speed) {
  let dist = 0, time = 0, maxSlope = 0, molaDist = 0, roughDist = 0; const byClass = [0, 0, 0]; const profile = []; const segs = [];
  let acc = 0; profile.push({ d: 0, z: g.elev[path[0]], src: g.src[path[0]] });
  for (let k = 1; k < path.length; k++) {
    const a = path[k - 1], b = path[k], ra = Math.floor(a / g.nx), ca = a % g.nx, rb = Math.floor(b / g.nx), cb = b % g.nx;
    const hd = Math.hypot((rb - ra) * g.dy, (cb - ca) * g.dx), dz = g.src[a] !== g.src[b] ? 0 : g.elev[b] - g.elev[a], len = Math.hypot(hd, dz), s = (g.slope[a] + g.slope[b]) / 2;
    dist += len; time += len / speed(s); acc += len; maxSlope = Math.max(maxSlope, g.slope[a], g.slope[b]);
    byClass[classOfSlope(s)] += len; const low = g.src[a] === 1 || g.src[b] === 1; if (low) molaDist += len; if (g.rough && (g.rough[a] || g.rough[b])) roughDist += len;
    profile.push({ d: acc, z: g.elev[b], src: g.src[b] });
    segs.push({ a, b, low });
  }
  return { distance: dist, time, maxSlope, molaDistance: molaDist, classDistance: byClass, classFraction: dist > 0 ? byClass.map(x => x / dist) : [0, 0, 0], molaFraction: dist > 0 ? molaDist / dist : 0, roughDistance: roughDist, roughFraction: dist > 0 ? roughDist / dist : 0, profile, segs };
}

// Straight start-goal line: fraction of its length over cells steeper than the limit (for the "why this route" text)
export function straightLine(g, a, b, maxSlope) {
  const ra = Math.floor(a / g.nx), ca = a % g.nx, rb = Math.floor(b / g.nx), cb = b % g.nx, steps = Math.max(Math.abs(rb - ra), Math.abs(cb - ca), 1);
  let over = 0; for (let k = 0; k <= steps; k++) { const r = Math.round(ra + (rb - ra) * k / steps), c = Math.round(ca + (cb - ca) * k / steps); if (g.slope[r * g.nx + c] > maxSlope) over++; }
  return { length: Math.hypot((rb - ra) * g.dy, (cb - ca) * g.dx), fractionOver: over / (steps + 1) };
}

// Mode defaults and EVA reachability. Sources: data/suit/README.md (EVA 8 h, 2 h buffer, 4-5 km team estimate) and
// data/slope-hazard/README.md (walking astronaut 20 deg, Artemis LTV 20 deg, Apollo LRV 25 deg).
export const MODES = {
  eva: { maxSlope: 20, evaHours: 8, bufferHours: 2, teamRangeKm: [4, 5] },
  hybrid: { standoffM: 500 /* ASSUMPTION: vehicle stops at least this far from the target */ },
  vehicle: { maxSlope: 20, speedKmh: 5 /* ASSUMPTION */, molaPenalty: 1.5 /* ASSUMPTION */ },
};
export function evaReachability(timeOneWayS, distM, p) {
  const activeS = (p.evaHours - p.bufferHours) * 3600, roundTrip = 2 * timeOneWayS;
  return { roundTripS: roundTrip, activeLimitS: activeS, withinTime: roundTrip <= activeS, withinTeamRange: distM <= p.teamRangeKm[1] * 1000, ok: roundTrip <= activeS };
}

// ---------------------------------------------------------------------------------------------------
// Hybrid mode: drive to a parking cell near the goal, then walk (EVA). Two full cost fields (vehicle from the start,
// walking from the goal; the cost is symmetric), then the parking cell is the vehicle-reachable cell with the smallest walking
// time to the goal that is at least `standoffM` metres from it. The stand-off is an ASSUMPTION (both limits are 20 deg, so
// without it the vehicle could simply drive onto the goal). standoffM = 0 allows parking on the goal.
export function costField(g, src, opts) {
  const { maxSlope, speed, molaPenalty = 1.5 } = opts, N = g.nx * g.ny;
  const cost = new Float64Array(N).fill(Infinity), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N), heap = new Heap();
  cost[src] = 0; heap.push(0, src);
  while (heap.size) {
    const i = heap.pop(); if (closed[i]) continue; closed[i] = 1;
    const r = Math.floor(i / g.nx), c = i % g.nx;
    for (const [dr, dc] of NB) {
      const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= g.ny || cc >= g.nx) continue;
      const j = rr * g.nx + cc; if (closed[j] || g.slope[j] > maxSlope) continue;
      const hd = Math.hypot(dr * g.dy, dc * g.dx), dz = g.src[i] !== g.src[j] ? 0 : g.elev[j] - g.elev[i];
      const s = (g.slope[i] + g.slope[j]) / 2, pen = (g.src[i] === 1 || g.src[j] === 1) ? molaPenalty : 1;
      const ng = cost[i] + (Math.hypot(hd, dz) / speed(s)) * pen * (g.pen ? Math.max(g.pen[i], g.pen[j]) : 1);
      if (ng < cost[j]) { cost[j] = ng; came[j] = i; heap.push(ng, j); }
    }
  }
  return { cost, came };
}
const pathTo = (came, k) => { const p = []; for (; k !== -1; k = came[k]) p.push(k); return p.reverse(); }; // src ... k
export function planHybrid(g, start, goal, vehicleOpts, walkOpts, standoffM = 0) {
  if (start < 0 || goal < 0) return { path: null, reason: 'outside' };
  const V = costField(g, start, vehicleOpts), W = costField(g, goal, walkOpts), gr = Math.floor(goal / g.nx), gc = goal % g.nx;
  let best = -1;
  for (let i = 0; i < V.cost.length; i++) {
    if (!isFinite(V.cost[i]) || !isFinite(W.cost[i])) continue;
    if (Math.hypot((Math.floor(i / g.nx) - gr) * g.dy, ((i % g.nx) - gc) * g.dx) < standoffM) continue;
    if (best < 0 || W.cost[i] < W.cost[best] || (W.cost[i] === W.cost[best] && V.cost[i] < V.cost[best])) best = i;
  }
  if (best < 0) return { path: null, reason: 'blocked' };
  return { vehiclePath: pathTo(V.came, best), walkPath: pathTo(W.came, best).reverse(), park: best };
}
// Walking leg against the EVA limits: round trip time <= (EVA - buffer) AND distance <= upper end of the team estimate.
export function hybridReachability(walkTimeS, walkDistM, p) {
  const activeS = (p.evaHours - p.bufferHours) * 3600, roundTrip = 2 * walkTimeS, withinTime = roundTrip <= activeS, withinTeamRange = walkDistM <= p.teamRangeKm[1] * 1000;
  return { roundTripS: roundTrip, activeLimitS: activeS, withinTime, withinTeamRange, ok: withinTime && withinTeamRange };
}
// Joins the metrics of two consecutive legs (vehicle then walk) into one route summary.
export function combineMetrics(a, b) {
  const distance = a.distance + b.distance, classDistance = a.classDistance.map((x, i) => x + b.classDistance[i]), molaDistance = a.molaDistance + b.molaDistance;
  const off = a.profile[a.profile.length - 1].d;
  return { distance, time: a.time + b.time, maxSlope: Math.max(a.maxSlope, b.maxSlope), molaDistance, classDistance, classFraction: distance > 0 ? classDistance.map(x => x / distance) : [0, 0, 0], molaFraction: distance > 0 ? molaDistance / distance : 0, roughDistance: (a.roughDistance || 0) + (b.roughDistance || 0), roughFraction: distance > 0 ? ((a.roughDistance || 0) + (b.roughDistance || 0)) / distance : 0,
    profile: a.profile.concat(b.profile.slice(1).map(p => ({ ...p, d: p.d + off }))), segs: a.segs.concat(b.segs) };
}

// ---------------------------------------------------------------------------------------------------
// Rough ground / rock formations. Roughness = RMS residual of a plane fitted to each 3x3 window of the 8 m HiRISE DTM (terrain.js).
// A planning cell (4x4 DTM cells, ~32 m) is "rough" when at least ROUGH_FRACTION of its DTM cells exceed the threshold (metres).
// Single boulders are not resolved at 8 m. Rough cells get a cost multiplier (penalty); connected groups of rough cells
// (8-neighbourhood, at least minCluster cells) are counted as "rock formations / rough zones".
export const ROUGH = { thresholdM: 0.8 /* ~95th percentile of the real DTM: ASSUMPTION */, penalty: 3 /* ASSUMPTION */, minCluster: 4 /* ASSUMPTION */, fraction: 0.25, beltPenalty: 1 /* off by default */ };
export function roughMaskFromRaw(g, thr, fraction = ROUGH.fraction) {
  if (!g.rawRough) g.rawRough = roughness(g.hRef);
  const f = g.factor, W = g.hW, mask = new Uint8Array(g.nx * g.ny), need = Math.ceil(f * f * fraction);
  for (let by = 0; by < g.ny; by++) for (let bx = 0; bx < g.nx; bx++) {
    let c = 0; for (let y = 0; y < f; y++) { const row = (by * f + y) * W + bx * f; for (let x = 0; x < f; x++) if (g.rawRough[row + x] > thr) c++; }
    mask[by * g.nx + bx] = c >= need ? 1 : 0;
  }
  return mask;
}
// Sets g.rough (0/1), g.pen (cost multiplier), g.cluster (label per cell, 0 = none or too small) and g.nClusters.
export function applyRoughness(g, mask, { penalty = ROUGH.penalty, minCluster = ROUGH.minCluster, belt = null, beltPenalty = 1 } = {}) {
  const N = g.nx * g.ny; g.rough = mask; g.pen = new Float32Array(N).fill(1); g.cluster = new Int32Array(N); g.nClusters = 0;
  for (let i = 0; i < N; i++) { if (mask[i]) g.pen[i] = penalty; if (belt && belt[i]) g.pen[i] = Math.max(g.pen[i], beltPenalty); }
  const seen = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (!mask[i] || seen[i]) continue; const comp = [i], stack = [i]; seen[i] = 1;
    while (stack.length) { const k = stack.pop(), r = Math.floor(k / g.nx), c = k % g.nx; for (const [dr, dc] of NB) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= g.ny || cc >= g.nx) continue; const j = rr * g.nx + cc; if (mask[j] && !seen[j]) { seen[j] = 1; comp.push(j); stack.push(j); } } }
    if (comp.length >= minCluster) { g.nClusters++; for (const k of comp) g.cluster[k] = g.nClusters; }
  }
  return g;
}
const crossed = (g, path) => { const s = new Set(); for (const i of path) if (g.cluster[i]) s.add(g.cluster[i]); return s; };
// Formations on the cheapest route WITHOUT the penalty that the penalised route does not enter. pathPlain/pathPen: cell index lists.
export function avoidedFormations(g, pathPlain, pathPen) {
  if (!g.cluster) return { total: 0, crossedPlain: 0, crossedRoute: 0, avoided: 0 };
  const a = crossed(g, pathPlain), b = crossed(g, pathPen); let avoided = 0; for (const c of a) if (!b.has(c)) avoided++;
  return { total: g.nClusters, crossedPlain: a.size, crossedRoute: b.size, avoided };
}
// Rasterises polygon rings ([lon, lat] arrays) onto the planning grid (cell centres, even-odd rule).
export function polygonMask(g, rings) {
  const m = new Uint8Array(g.nx * g.ny);
  for (let r = 0; r < g.ny; r++) for (let c = 0; c < g.nx; c++) {
    const lat = g.north - (r + 0.5) * g.stepDeg, lon = g.west + (c + 0.5) * g.stepDeg; let inside = false;
    for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside; }
    m[r * g.nx + c] = inside ? 1 : 0;
  }
  return m;
}

// ---- shareable URL hash: #route=<mode>;s=<lat>,<lon>;g=<lat>,<lon>;so=<stand-off m>
const inBox = (la, lo) => isFinite(la) && isFinite(lo) && la >= -7 && la <= -3.5 && lo >= 136 && lo <= 139.5;
export function parseRouteHash(str) { // returns { mode, start, goal, standoffM } or null
  const m = /^#route=(hybrid|eva|vehicle);s=(-?[\d.]+),(-?[\d.]+);g=(-?[\d.]+),(-?[\d.]+);so=([\d.]+)$/.exec(str || ''); if (!m) return null;
  const [sl, sn, gl, gn, so] = [m[2], m[3], m[4], m[5], m[6]].map(Number); if (!inBox(sl, sn) || !inBox(gl, gn) || !(so >= 0 && so <= 5000)) return null;
  return { mode: m[1], start: { lat: sl, lon: sn, label: 'link' }, goal: { lat: gl, lon: gn, label: 'link' }, standoffM: so };
}

