// Node tests for the route planner. Run: node tests/planner.test.mjs
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { astar, routeMetrics, walkSpeed, vehicleSpeed, makeGridMeta, buildGrid, cellOf, straightLine, evaReachability, MODES, planHybrid, hybridReachability, applyRoughness, avoidedFormations, polygonMask, roughMaskFromRaw, ROUGH, parseRouteHash } from '../js/planner.js';
import { makeHirise, makeMola, roughness } from '../js/terrain.js';

// ---- synthetic grid helper: nx x ny cells, slope(r,c) in degrees, flat elevation
function synth(nx, ny, slopeFn = () => 0, elevFn = () => 0) {
  const n = nx * ny, g = { nx, ny, north: 0, west: 0, stepDeg: 0.0005, elev: new Float32Array(n), slope: new Float32Array(n), src: new Uint8Array(n), cls: new Uint8Array(n) };
  for (let r = 0; r < ny; r++) for (let c = 0; c < nx; c++) { g.slope[r * nx + c] = slopeFn(r, c); g.elev[r * nx + c] = elevFn(r, c); }
  return makeGridMeta(g);
}
const walk = { maxSlope: 20, speed: walkSpeed, molaPenalty: 1.5 };
const id = (g, r, c) => r * g.nx + c;
const rc = (g, i) => [Math.floor(i / g.nx), i % g.nx];

// 1) walking speed model: V = 0.75 - 0.01*S (S in percent), floor 0.25
assert.ok(Math.abs(walkSpeed(0) - 0.75) < 1e-12);
assert.ok(Math.abs(walkSpeed(Math.atan(0.2) * 180 / Math.PI) - 0.55) < 1e-9, '20 percent grade -> 0.55 m/s');
assert.equal(walkSpeed(45), 0.25, 'floor at 0.25 m/s');
let prev = 1; for (let s = 0; s <= 40; s += 2) { const v = walkSpeed(s); assert.ok(v <= prev + 1e-12); prev = v; }

// 2) flat grid: the route is a straight line
{
  const g = synth(60, 40); const a = id(g, 20, 5), b = id(g, 20, 55);
  const r = astar(g, a, b, walk); assert.ok(r.path);
  assert.ok(r.path.every(i => rc(g, i)[0] === 20), 'straight along one row');
  assert.equal(r.path.length, 51);
  const m = routeMetrics(g, r.path, walkSpeed);
  assert.ok(Math.abs(m.distance - 50 * g.dx) < 1e-6 && Math.abs(m.time - m.distance / 0.75) < 1e-6);
  assert.deepEqual(m.classFraction.map(x => +x.toFixed(3)), [1, 0, 0]);
}

// 3) a wall of forbidden slope with one gap: the route goes through the gap, never through a forbidden cell
{
  const g = synth(60, 60, (r, c) => (c >= 28 && c <= 31 && r !== 50 ? 30 : 0));
  const a = id(g, 10, 5), b = id(g, 10, 55); const r = astar(g, a, b, walk); assert.ok(r.path, 'path through the gap');
  assert.ok(r.path.every(i => g.slope[i] <= 20), 'no forbidden cell on the route');
  assert.ok(r.path.some(i => rc(g, i)[0] === 50 && rc(g, i)[1] >= 28 && rc(g, i)[1] <= 31), 'passes through the gap');
  const straight = straightLine(g, a, b, 20); assert.ok(straight.fractionOver > 0.05);
  const m = routeMetrics(g, r.path, walkSpeed); assert.ok(m.distance > 50 * g.dx * 1.5, 'long detour');
  // a closed wall: unreachable
  const g2 = synth(60, 60, (r2, c) => (c >= 28 && c <= 31 ? 30 : 0));
  const none = astar(g2, id(g2, 10, 5), id(g2, 10, 55), walk); assert.equal(none.path, null); assert.equal(none.reason, 'blocked');
}

// 4) vehicle limit 25 passes a 22 degree band that walking (20) cannot cross
{
  const g = synth(40, 40, (r, c) => (c >= 18 && c <= 21 ? 22 : 0));
  const a = id(g, 20, 3), b = id(g, 20, 37);
  assert.equal(astar(g, a, b, walk).path, null);
  const v = astar(g, a, b, { maxSlope: 25, speed: vehicleSpeed(5), molaPenalty: 1.5 }); assert.ok(v.path);
}

// 5) the router prefers a longer flat detour over a steep short cut when that is faster (time cost, not distance)
{
  const g = synth(50, 50, (r, c) => (r >= 22 && r <= 28 && c >= 10 && c <= 40 ? 19 : 0));
  const a = id(g, 25, 3), b = id(g, 25, 47); const r = astar(g, a, b, walk); assert.ok(r.path);
  const direct = routeMetrics(g, Array.from({ length: 45 }, (_, k) => id(g, 25, 3 + k)), walkSpeed);
  const m = routeMetrics(g, r.path, walkSpeed); assert.ok(m.time < direct.time, `route ${m.time.toFixed(0)} s vs direct ${direct.time.toFixed(0)} s`);
}

// 6) MOLA cells are penalised in routing (a HiRISE detour is preferred), and elevation steps across the boundary are ignored
{
  const g = synth(40, 30); for (let r = 10; r < 20; r++) for (let c = 10; c < 30; c++) { g.src[r * 40 + c] = 1; g.elev[r * 40 + c] = 40; } // 40 m datum offset block
  const r = astar(g, id(g, 15, 3), id(g, 15, 37), { maxSlope: 20, speed: walkSpeed, molaPenalty: 3 }); assert.ok(r.path);
  assert.ok(r.path.filter(i => g.src[i] === 1).length < 5, 'goes around the low-confidence block');
  const m = routeMetrics(g, r.path, walkSpeed); assert.ok(m.molaFraction < 0.2);
}

// 7) EVA reachability: round trip walking time against (EVA hours - buffer)
{
  const p = MODES.eva; const near = evaReachability(1.5 * 3600, 4000, p), far = evaReachability(4 * 3600, 10000, p);
  assert.ok(near.ok && near.withinTeamRange); assert.ok(!far.ok && !far.withinTeamRange); assert.equal(far.activeLimitS, 6 * 3600);
}

// 8) real data: Bradbury Landing -> Nevado Sajama
{
  const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data'); const rd = p => fs.readFileSync(path.join(D, p)), js = p => JSON.parse(rd(p).toString());
  const T = { mola: makeMola(js('mola/bounds.json'), rd('mola/gale_mola_dem_int16le.bin')), hirise: makeHirise(js('hirise/dtm_gale/bounds.json'), rd('hirise/dtm_gale/gale_hirise_dem_int16le.bin'), rd('hirise/dtm_gale/gale_hirise_slope_deg_uint8.bin'), rd('hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin')) };
  const g = buildGrid(T, 4); assert.equal(g.nx, 567); assert.ok(Math.abs(g.dy - 32.4) < 0.1, 'cell about 32 m');
  const drills = js('boxwork/drill_sites.geojson').features, ns = drills.find(f => f.properties.name === 'Nevado Sajama').geometry.coordinates;
  const a = cellOf(g, -4.5895, 137.4417), b = cellOf(g, ns[1], ns[0]); assert.ok(a >= 0 && b >= 0);
  const t0 = Date.now(); const r = astar(g, a, b, walk); const dt = Date.now() - t0;
  console.log(`  real data: A* ${dt} ms, path ${r.path ? r.path.length + ' cells' : r.reason}`);
  if (r.path) {
    const m = routeMetrics(g, r.path, walkSpeed); const reach = evaReachability(m.time, m.distance, MODES.eva);
    console.log(`  distance ${(m.distance / 1000).toFixed(1)} km, walking time ${(m.time / 3600).toFixed(1)} h, max slope ${m.maxSlope.toFixed(1)} deg, MOLA share ${(100 * m.molaFraction).toFixed(0)}%, class share ${m.classFraction.map(x => (100 * x).toFixed(0)).join('/')}%`);
    assert.ok(m.distance > 12000 && m.distance < 30000, 'plausible length (straight line ~13 km)');
    assert.ok(!reach.ok, 'not reachable on foot within the EVA limit (suit README: ~15 km needs a rover-assisted plan)');
    assert.ok(r.path.every(i => g.slope[i] <= 20 || i === a || i === b));
  }
  // hybrid on the real grid: drive (5 km/h assumed) to >= 500 m from the target, then walk
  const veh = { maxSlope: 20, speed: vehicleSpeed(5), molaPenalty: 1.5 }, h = planHybrid(g, a, b, veh, walk, 500); assert.ok(h.vehiclePath, 'hybrid route found');
  const vm = routeMetrics(g, h.vehiclePath, veh.speed), wm = routeMetrics(g, h.walkPath, walkSpeed), hr = hybridReachability(wm.time, wm.distance, MODES.eva);
  console.log('  real hybrid: drive ' + (vm.distance / 1000).toFixed(1) + ' km ' + (vm.time / 3600).toFixed(1) + ' h, walk ' + (wm.distance / 1000).toFixed(2) + ' km, round trip ' + (hr.roundTripS / 3600).toFixed(2) + ' h, ok=' + hr.ok);
  const mk = roughMaskFromRaw(g, ROUGH.thresholdM); applyRoughness(g, mk, ROUGH); const h2 = planHybrid(g, a, b, veh, walk, 500), av = avoidedFormations(g, h.vehiclePath.concat(h.walkPath), h2.vehiclePath.concat(h2.walkPath));
  console.log('  real roughness: rough cells ' + mk.reduce((x, y) => x + y, 0) + ', formations ' + g.nClusters + ', avoided on default hybrid ' + av.avoided + ' (plain crosses ' + av.crossedPlain + ', penalised crosses ' + av.crossedRoute + ')');
  assert.ok(av.crossedRoute <= av.crossedPlain);
  assert.ok(hr.ok, 'walking alone fails, hybrid fits'); assert.ok(wm.distance >= 450 && wm.distance < 1500);
}


// 9) hybrid: a goal that is unreachable on foot becomes reachable with a vehicle leg first
{
  const g = synth(400, 5), a = id(g, 2, 0), b = id(g, 2, 399), veh = { maxSlope: 20, speed: vehicleSpeed(5), molaPenalty: 1.5 };
  const foot = astar(g, a, b, walk), fm = routeMetrics(g, foot.path, walkSpeed);
  assert.ok(!hybridReachability(fm.time, fm.distance, { ...MODES.eva, teamRangeKm: MODES.eva.teamRangeKm }).ok, 'walking alone does not fit');
  const h = planHybrid(g, a, b, veh, walk, 1000); assert.ok(h.vehiclePath && h.walkPath);
  assert.equal(h.vehiclePath[0], a); assert.equal(h.walkPath[h.walkPath.length - 1], b); assert.equal(h.vehiclePath[h.vehiclePath.length - 1], h.walkPath[0], 'legs join at the parking cell');
  const wm = routeMetrics(g, h.walkPath, walkSpeed); assert.ok(wm.distance >= 1000 - 40 && wm.distance < 1400, 'walk leg is about the stand-off distance');
  const hr = hybridReachability(wm.time, wm.distance, MODES.eva); assert.ok(hr.ok, 'walking leg fits the EVA limits');
  // a steep wall (30 deg) around the goal: vehicle stops before it, walker limit is 20 so goal beyond the wall stays unreachable for both
  const g2 = synth(60, 5, (r, c) => (c >= 40 && c < 45 ? 30 : 0)); assert.ok(!planHybrid(g2, id(g2, 2, 0), id(g2, 2, 59), veh, walk, 0).vehiclePath, 'wall blocks both legs');
  // vehicle limit lower than the walking limit: vehicle parks before the ridge, walker crosses it
  const g3 = synth(60, 5, (r, c) => (c >= 40 && c < 45 ? 18 : 0)), h3 = planHybrid(g3, id(g3, 2, 0), id(g3, 2, 59), { ...veh, maxSlope: 15 }, walk, 0);
  assert.ok(h3.vehiclePath && h3.walkPath.length > 20, 'vehicle (15 deg) parks before the 18 deg ridge, walker crosses it');
  console.log('  hybrid: walk leg ' + Math.round(wm.distance) + ' m, ' + (wm.time / 3600).toFixed(2) + ' h');
}
// 10) rough ground: roughness of a plane is 0, of a bumpy window is > 0; penalty makes the route go around a rough block, formations are counted
{
  const plane = { W: 5, H: 5, dem: Int16Array.from({ length: 25 }, (_, k) => 3 * (k % 5) + 2 * Math.floor(k / 5)) }; const rp = roughness(plane);
  assert.ok(Math.abs(rp[2 * 5 + 2]) < 1e-9, 'tilted plane is not rough'); assert.ok(Number.isNaN(rp[0]), 'edge cells have no value');
  const bump = { W: 5, H: 5, dem: new Int16Array(25) }; bump.dem[2 * 5 + 2] = 9; assert.ok(roughness(bump)[2 * 5 + 2] > 2, 'a spike is rough');
  const g = synth(60, 30), mask = new Uint8Array(60 * 30); for (let r = 6; r < 24; r++) for (let c = 25; c < 33; c++) mask[r * 60 + c] = 1; // rough block with free rows above and below
  const a = id(g, 15, 2), b = id(g, 15, 57), plain = astar(g, a, b, walk); applyRoughness(g, mask, { penalty: 5, minCluster: 4 });
  assert.equal(g.nClusters, 1); const pen = astar(g, a, b, walk);
  const av = avoidedFormations(g, plain.path, pen.path); assert.equal(av.crossedPlain, 1, 'unpenalised route crosses the block'); assert.equal(av.crossedRoute, 0); assert.equal(av.avoided, 1);
  assert.ok(routeMetrics(g, pen.path, walkSpeed).roughFraction < routeMetrics(g, plain.path, walkSpeed).roughFraction);
  assert.ok(routeMetrics(g, pen.path, walkSpeed).distance > routeMetrics(g, plain.path, walkSpeed).distance, 'detour is longer');
  // groups smaller than minCluster are not formations
  const g2 = synth(20, 20), m2 = new Uint8Array(400); m2[210] = 1; m2[211] = 1; applyRoughness(g2, m2, { minCluster: 4 }); assert.equal(g2.nClusters, 0);
  // polygon mask
  const gm = synth(10, 10); const pm = polygonMask(gm, [[[0.0005 * 2, -0.0005 * 2], [0.0005 * 6, -0.0005 * 2], [0.0005 * 6, -0.0005 * 6], [0.0005 * 2, -0.0005 * 6]]]); assert.equal(pm.reduce((x, y) => x + y, 0), 16);
}
// 11) shareable URL hash
{
  const ok = parseRouteHash('#route=hybrid;s=-4.58950,137.44170;g=-4.80801,137.38100;so=500'); assert.equal(ok.mode, 'hybrid'); assert.equal(ok.standoffM, 500); assert.ok(Math.abs(ok.goal.lat + 4.80801) < 1e-9);
  assert.equal(parseRouteHash('#route=flying;s=-4.5,137.4;g=-4.8,137.3;so=500'), null, 'unknown mode'); assert.equal(parseRouteHash('#route=eva;s=10,137.4;g=-4.8,137.3;so=500'), null, 'outside the project box');
  assert.equal(parseRouteHash('#route=eva;s=-4.5,137.4;g=-4.8,137.3;so=99999'), null, 'stand-off out of range'); assert.equal(parseRouteHash(''), null); assert.equal(parseRouteHash('#foo'), null);
}
console.log('planner tests passed');
