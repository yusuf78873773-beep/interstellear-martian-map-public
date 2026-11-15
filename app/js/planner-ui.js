// M4: Route tab (start/goal, parameters), A* run, route drawing and the results panel.
import { FILES, BRADBURY } from './config.js';
import { t, onLangChange } from './i18n.js';
import { buildGrid, astar, routeMetrics, walkSpeed, vehicleSpeed, cellOf, centerOf, straightLine, evaReachability, MODES, planHybrid, hybridReachability, combineMetrics, ROUGH, roughMaskFromRaw, applyRoughness, avoidedFormations, polygonMask, parseRouteHash } from './planner.js';
import { handlers } from './handlers.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const S = {
  mode: 'hybrid', start: { ...BRADBURY, label: 'bradbury' }, goal: null, picking: null, drills: [], grid: null,
  p: { evaHours: MODES.eva.evaHours, bufferHours: MODES.eva.bufferHours, evaMaxSlope: MODES.eva.maxSlope, vehicleLimit: 20, vehicleSpeed: MODES.vehicle.speedKmh, molaPenalty: MODES.vehicle.molaPenalty, standoffM: MODES.hybrid.standoffM, roughThreshold: ROUGH.thresholdM, roughPenalty: ROUGH.penalty, beltPenalty: ROUGH.beltPenalty },
  result: null, message: '',
};
export const routeState = S;
let app, L, layerGroup, markers = {};

const fmt = (v, d = 1) => (+v).toFixed(d).replace(/\.0+$/, '');
const hours = s => fmt(s / 3600, 1);

function pin(letter, color) { return L.divIcon({ className: 'pin', html: `<span style="background:${color}">${letter}</span>`, iconSize: [26, 26], iconAnchor: [13, 13] }); }
function drawMarkers() {
  for (const k of ['start', 'goal']) {
    markers[k]?.remove(); markers[k] = null;
    const p = S[k]; if (!p) continue;
    markers[k] = L.marker([p.lat, p.lon], { icon: pin(k === 'start' ? 'S' : 'G', k === 'start' ? '#009e73' : '#d55e00'), keyboard: false, title: t('route.' + k) }).addTo(app.map);
  }
}

// ---- shareable URL: #route=<mode>;s=<lat>,<lon>;g=<lat>,<lon>;so=<stand-off m>. Written after the first user change, read at load.
let hashReady = false;
export function writeHash() {
  if (!hashReady || !S.start || !S.goal) return;
  const h = `#route=${S.mode};s=${S.start.lat.toFixed(5)},${S.start.lon.toFixed(5)};g=${S.goal.lat.toFixed(5)},${S.goal.lon.toFixed(5)};so=${S.p.standoffM}`;
  try { history.replaceState(null, '', location.pathname + location.search + h); } catch (e) { /* sandboxed frame: sharing just stays unavailable */ }
}
function applyHash() { const h = parseRouteHash(location.hash); if (!h) return false; S.mode = h.mode; S.start = h.start; S.goal = h.goal; S.p.standoffM = h.standoffM; S.picking = null; drawMarkers(); render(); return true; }
async function copyLink() {
  const msg = document.getElementById('copyMsg'); writeHash();
  try { await navigator.clipboard.writeText(location.href); if (msg) msg.textContent = t('route.copied'); } catch (e) { if (msg) msg.textContent = location.href; }
}

function render() {
  writeHash();
  const host = $('#tab-route'); const v = S.mode === 'vehicle', hy = S.mode === 'hybrid';
  const num = (key, label, min, max, step, src) => `<label class="fld">${label} <small>${src}</small><input type="number" data-p="${key}" min="${min}" max="${max}" step="${step}" value="${S.p[key]}"></label>`;
  const dr = S.drills.map(d => d.geometry
    ? `<option value="${d.properties.name}">${esc(d.properties.name)}</option>`
    : `<option value="" disabled>${t('route.noPos', { name: esc(d.properties.name) })}</option>`).join('');
  const sel = k => `<select data-sel="${k}" aria-label="${t('route.' + k)}"><option value="">${t('route.fromList')}…</option><option value="__bradbury">${t('route.bradbury')}</option>${dr}</select>`;
  const pos = p => p ? `${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}` : '–';
  const sc = SCENARIOS.filter(x => S.drills.some(d => d.properties.name === x.goal && d.geometry)).map((x, i) => `<button type="button" class="scn" data-scn="${i}">${t('route.bradbury')} → ${esc(x.goal)} <small>(${t('route.mode.' + x.mode)})</small></button>`).join('');
  host.innerHTML = `<p class="hint">${t('route.hint')}</p><div class="scenarios" role="group" aria-label="${t('route.scn.title')}"><b>${t('route.scn.title')}</b>${sc}<small class="note">${t('route.scn.note')}</small></div>` +
    `<fieldset class="modes"><legend>${t('route.mode')}</legend><label><input type="radio" name="mode" value="hybrid"${hy ? ' checked' : ''}> ${t('route.mode.hybrid')}</label> <label><input type="radio" name="mode" value="eva"${S.mode === 'eva' ? ' checked' : ''}> ${t('route.mode.eva')}</label> <label><input type="radio" name="mode" value="vehicle"${v ? ' checked' : ''}> ${t('route.mode.vehicle')}</label></fieldset>` +
    ['start', 'goal'].map(k => `<div class="pt"><b>${t('route.' + k)}</b>: <span class="coord">${pos(S[k])}</span><div class="row2"><button type="button" data-pick="${k}">${t('route.pick')}</button>${sel(k)}</div>${S.picking === k ? `<div class="warn">${t('route.picking', { what: t('route.' + k).toLowerCase() })}</div>` : ''}</div>`).join('') +
    `<details class="params" open><summary>${t('route.params')}</summary>` +
    (v || hy
      ? `<label class="fld">${t('route.vehicleLimit')}<select data-p="vehicleLimit"><option value="20"${S.p.vehicleLimit == 20 ? ' selected' : ''}>${t('route.vehicleLimit.ltv')}</option><option value="25"${S.p.vehicleLimit == 25 ? ' selected' : ''}>${t('route.vehicleLimit.lrv')}</option></select><small>${t('route.sourced', { src: 'data/slope-hazard/README.md' })}</small></label>` +
        num('vehicleSpeed', t('route.vehicleSpeed'), 1, 60, 0.5, `(${t('route.assumption')})`)
      : '') + (hy ? num('standoffM', t('route.standoff'), 0, 5000, 50, `(${t('route.assumption')})`) : '') + (!v ? (num('evaMaxSlope', t('route.maxSlope'), 5, 45, 1, `(${t('route.sourced', { src: 'NASA EVA, slope-hazard README' })})`) +
        num('evaHours', t('route.evaHours'), 1, 12, 0.5, `(${t('route.sourced', { src: 'suit README, xEMU' })})`) +
        num('bufferHours', t('route.bufferHours'), 0, 6, 0.5, `(${t('route.sourced', { src: 'suit README' })})`)) : '') +
    num('molaPenalty', t('route.molaPenalty'), 1, 5, 0.1, `(${t('route.assumption')})`) + num('roughThreshold', t('route.roughThr'), 0.2, 3, 0.1, `(${t('route.assumption')})`) + num('roughPenalty', t('route.roughPen'), 1, 20, 0.5, `(${t('route.assumption')})`) + num('beltPenalty', t('route.beltPen'), 1, 20, 0.5, `(${t('route.assumption')})`) + `<p class="note">${t('route.roughNote')}</p></details>` +
    `<div class="actions"><button type="button" id="planBtn" class="primary">${t('route.plan')}</button> <button type="button" id="clearBtn">${t('route.clear')}</button> <button type="button" id="copyBtn">${t('route.copy')}</button> <small id="copyMsg" role="status"></small></div>` +
    `<div id="routeMsg" class="warn" role="status">${esc(S.message)}</div><div id="routeResults"></div>`;
  host.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', () => { S.mode = r.value; render(); renderResults(); }));
  host.querySelectorAll('[data-scn]').forEach(b => b.addEventListener('click', () => runScenario(SCENARIOS.filter(x => S.drills.some(d => d.properties.name === x.goal && d.geometry))[+b.dataset.scn])));
  host.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => { S.picking = b.dataset.pick; render(); renderResults(); }));
  host.querySelectorAll('select[data-sel]').forEach(s => s.addEventListener('change', () => { if (s.value) setPoint(s.dataset.sel, s.value); }));
  host.querySelectorAll('[data-p]').forEach(i => i.addEventListener('change', () => { S.p[i.dataset.p] = +i.value; writeHash(); }));
  $('#planBtn').addEventListener('click', plan); $('#copyBtn').addEventListener('click', copyLink); $('#clearBtn').addEventListener('click', clearRoute);
  renderResults();
}

// One-click scenarios: start = Bradbury Landing, goal = an existing drill site with a position, mode preset.
const SCENARIOS = [{ goal: 'Nevado Sajama', mode: 'hybrid' }, { goal: 'Valle de la Luna', mode: 'hybrid' }, { goal: 'Nevado Sajama 2', mode: 'eva' }];
function runScenario(x) {
  if (!x) return; S.mode = x.mode; S.start = { ...BRADBURY, label: 'bradbury' }; S.picking = null; setPoint('goal', x.goal); // setPoint redraws markers and the panel
  plan();
}
function setPoint(k, name) {
  if (name === '__bradbury') S[k] = { ...BRADBURY, label: 'bradbury' };
  else { const d = S.drills.find(x => x.properties.name === name); if (d?.geometry) S[k] = { lat: d.geometry.coordinates[1], lon: d.geometry.coordinates[0], label: name }; }
  S.picking = null; drawMarkers(); render();
}

function clearRoute() { layerGroup.clearLayers(); S.result = null; S.message = ''; render(); document.dispatchEvent(new CustomEvent('routeresult', { detail: null })); }

function drawRoute(res) {
  layerGroup.clearLayers(); const g = S.grid;
  const drawLeg = (coords, segs, col) => {
    let cur = null; const flush = () => { if (!cur) return; const ll = cur.pts.map(p => [p.lat, p.lon]); L.polyline(ll, { color: '#000', weight: 7, opacity: 0.7, interactive: false, pane: 'routePane' }).addTo(layerGroup); L.polyline(ll, { color: col, weight: 3.5, opacity: 1, dashArray: cur.low ? '7 7' : null, interactive: false, pane: 'routePane' }).addTo(layerGroup); };
    for (let k = 1; k < coords.length; k++) { const low = segs[k - 1].low; if (!cur || cur.low !== low) { flush(); cur = { low, pts: [coords[k - 1]] }; } cur.pts.push(coords[k]); }
    flush();
  };
  if (res.legs) { for (const lg of res.legs) drawLeg(lg.coords, lg.metrics.segs, lg.kind === 'vehicle' ? COL.vehicle : COL.walk); L.marker([res.park.lat, res.park.lon], { icon: pin('P', '#e69f00'), keyboard: false, title: t('res.park') }).addTo(layerGroup); }
  else drawLeg(res.coords, res.metrics.segs, res.mode === 'eva' ? COL.walk : COL.vehicle);
}
const COL = { walk: '#00e5ff', vehicle: '#ffd400' };

function profileSvg(m) {
  const P = m.profile, W = 320, H = 96, pad = 4; const zs = P.map(p => p.z), zmin = Math.min(...zs), zmax = Math.max(...zs), D = P[P.length - 1].d || 1;
  const x = d => pad + (d / D) * (W - 2 * pad), y = z => H - pad - ((z - zmin) / Math.max(1, zmax - zmin)) * (H - 2 * pad - 10);
  let lines = '';
  for (let k = 1; k < P.length; k++) lines += `<line x1="${x(P[k - 1].d).toFixed(1)}" y1="${y(P[k - 1].z).toFixed(1)}" x2="${x(P[k].d).toFixed(1)}" y2="${y(P[k].z).toFixed(1)}" stroke="${P[k].src === 1 ? '#e69f00' : '#56b4e9'}" stroke-width="2"${P[k].src === 1 ? ' stroke-dasharray="4 3"' : ''}/>`;
  const mixed = P.some(p => p.src === 1) && P.some(p => p.src === 0);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${t('res.profile')}">${lines}<text x="${pad}" y="10" font-size="9" fill="#9fb0c3">${Math.round(zmax)} m</text><text x="${pad}" y="${H - 1}" font-size="9" fill="#9fb0c3">${Math.round(zmin)} m</text><text x="${W - pad}" y="${H - 1}" font-size="9" fill="#9fb0c3" text-anchor="end">${fmt(D / 1000, 1)} km</text></svg>` +
    `<div class="note">${t('res.profile.src')}</div>` + (mixed ? `<div class="warn">${t('res.profile.warn')}</div>` : '');
}

// EVA time budget bar: walk out | free time (science) | walk back | buffer, scaled to the EVA duration. Walking times are from the planner.
function timelineHtml(R, walkS) {
  const p = R.params, total = p.evaHours * 3600, buf = p.bufferHours * 3600, out = walkS, back = walkS, free = total - buf - out - back, over = free < 0;
  const segs = over ? [['#d55e00', out + back, 'res.tl.walk'], ['#cc79a7', buf, 'res.tl.buffer']] : [['#56b4e9', out, 'res.tl.out'], ['#009e73', free, 'res.tl.free'], ['#56b4e9', back, 'res.tl.back'], ['#e69f00', buf, 'res.tl.buffer']];
  const sum = segs.reduce((a, x) => a + x[1], 0);
  return `<div class="eva-tl" role="img" aria-label="${t('res.tl.title')}"><h4>${t('res.tl.title')}</h4><div class="bar2">${segs.map(([c, v, k]) => `<span style="background:${c};width:${(100 * v / sum).toFixed(2)}%" title="${t(k)}: ${hours(v)} h">${v / sum > 0.12 ? hours(v) + ' h' : ''}</span>`).join('')}</div>` +
    `<div class="legend2">${segs.map(([c, v, k]) => `<span><i class="sw" style="background:${c}"></i>${t(k)} ${hours(v)} h</span>`).join('')}</div><div class="note">${over ? `<span class="bad">${t('res.tl.over', { h: hours(-free) })}</span> ` : t('res.tl.free.note', { h: hours(free) }) + ' '}${t('res.tl.note', { eva: p.evaHours })}</div></div>`;
}
// Data confidence strip: share of the route on HiRISE DTM (8 m) vs MOLA (coarser, 463 m), and how much of the grid HiRISE covers.
const confHtml = R => { const m = R.metrics, mola = m.molaFraction * 100, hi = 100 - mola;
  return `<h4>${t('res.conf.title')}</h4><div class="confbar" role="img" aria-label="${t('res.conf.title')}"><span class="hi" style="width:${hi.toFixed(1)}%">${hi >= 12 ? 'HiRISE ' + hi.toFixed(0) + '%' : ''}</span><span class="mo" style="width:${mola.toFixed(1)}%">${mola >= 12 ? 'MOLA ' + mola.toFixed(0) + '%' : ''}</span></div>` +
    `<div class="note">${t('res.conf.text', { hi: hi.toFixed(0), mola: mola.toFixed(0), cov: fmt(R.coverage ?? 0, 1) })}</div>`; };
const roughHtml = R => { const q = R.rough; if (!q) return ''; return `<h4>${t('res.rough.title')}</h4><p><b>${t('res.rough.avoided', { n: q.avoided })}</b> ${t('res.rough.detail', { plain: q.crossedPlain, route: q.crossedRoute, total: q.total, pct: fmt(q.roughPct, 1), plainPct: fmt(q.plainRoughPct, 1), extra: fmt(q.extraKm, 2), thr: q.thr, pen: q.penalty })}</p><div class="note">${t('res.rough.limit')}</div>`; };
const legHtml = (lg, R) => {
  const m = lg.metrics, cls = [0, 1, 2].map(c => `<div class="bar"><span class="lab">${t('class.name.' + c)}</span><span class="track"><i class="c${c}" style="width:${(m.classFraction[c] * 100).toFixed(1)}%"></i></span><span class="val">${(m.classFraction[c] * 100).toFixed(0)}%</span></div>`).join('');
  return `<h4><span class="swatch" style="background:${lg.kind === 'vehicle' ? COL.vehicle : COL.walk}"></span>${t('res.leg.' + lg.kind)}</h4><table class="kv"><tr><th>${t('res.distance')}</th><td>${fmt(m.distance / 1000, 2)} ${t('res.km')}</td></tr><tr><th>${t('res.time')}</th><td>${hours(m.time)} ${t('res.h')}</td></tr>` +
    (lg.kind === 'walk' ? `<tr><th>${t('res.timeRound')}</th><td>${hours(R.reach.roundTripS)} ${t('res.h')}</td></tr>` : '') + `<tr><th>${t('res.maxSlope')}</th><td>${fmt(m.maxSlope, 1)}${t('res.deg')}</td></tr><tr><th>${t('res.mola')}</th><td>${(m.molaFraction * 100).toFixed(0)}%</td></tr></table>${cls}`;
};
function renderHybrid(host, R) {
  const m = R.metrics, ev = R.reach, wm = R.legs[1].metrics, d = { rt: hours(ev.roundTripS), lim: hours(ev.activeLimitS), eva: R.params.evaHours, buf: R.params.bufferHours, km: fmt(wm.distance / 1000, 1), range: MODES.eva.teamRangeKm[1] };
  const verdict = ev.ok ? `<div class="verdict ok"><b>${t('res.hy.ok')}</b><br>${t('res.hy.okDetail', d)}</div>` : `<div class="verdict bad"><b>${t('res.hy.bad')}</b><br>${t(ev.withinTime ? 'res.hy.badRange' : 'res.hy.badDetail', d)}</div>`;
  host.innerHTML = `<h3>${t('res.title')}</h3>${verdict}${timelineHtml(R, wm.time)}<div class="note">${t('res.hy.team', d)}</div>` + R.legs.map(l => legHtml(l, R)).join('') +
    `<h4>${t('res.total')}</h4><table class="kv"><tr><th>${t('res.distance')}</th><td>${fmt(m.distance / 1000, 2)} ${t('res.km')}</td></tr><tr><th>${t('res.time')}</th><td>${hours(m.time)} ${t('res.h')}</td></tr></table><div class="note">${t('res.hy.standoff', { m: R.params.standoffM })}</div>` +
    roughHtml(R) + confHtml(R) + `<h4>${t('res.profile')}</h4>${profileSvg(m)}<div id="ctxResults"></div>`;
  document.dispatchEvent(new CustomEvent('resultsrendered'));
}

export function renderResults() {
  const host = $('#routeResults'); if (!host) return; const R = S.result; if (!R) { host.innerHTML = ''; return; } if (R.mode !== S.mode) { host.innerHTML = '<p class="note">' + t('route.replan') + '</p>'; return; }
  if (R.mode === 'hybrid') return renderHybrid(host, R);
  const m = R.metrics, ev = R.mode === 'eva' ? R.reach : null;
  const cls = [0, 1, 2].map(c => `<div class="bar"><span class="lab">${t('class.name.' + c)}</span><span class="track"><i class="c${c}" style="width:${(m.classFraction[c] * 100).toFixed(1)}%"></i></span><span class="val">${(m.classFraction[c] * 100).toFixed(0)}%</span></div>`).join('');
  const evaHtml = ev
    ? (ev.ok ? `<div class="verdict ok"><b>${t('res.eva.ok')}</b><br>${t('res.eva.okDetail', { rt: hours(ev.roundTripS), lim: hours(ev.activeLimitS), eva: S.p.evaHours, buf: S.p.bufferHours })}</div>`
      : `<div class="verdict bad"><b>${t('res.eva.bad')}</b><br>${t('res.eva.badDetail', { rt: hours(ev.roundTripS), lim: hours(ev.activeLimitS), eva: S.p.evaHours, buf: S.p.bufferHours })}</div>`) +
      `<div class="note">${t('res.eva.team', { km: fmt(m.distance / 1000, 1) })}</div>`
    : `<div class="note">${t('res.vehicle.note')}</div>`;
  host.innerHTML = `<h3>${t('res.title')}</h3>${evaHtml}${ev ? timelineHtml(R, m.time) : ''}` +
    `<table class="kv"><tr><th>${t('res.distance')}</th><td>${fmt(m.distance / 1000, 2)} ${t('res.km')}</td></tr><tr><th>${t('res.time')}</th><td>${hours(m.time)} ${t('res.h')}</td></tr>` +
    (ev ? `<tr><th>${t('res.timeRound')}</th><td>${hours(ev.roundTripS)} ${t('res.h')}</td></tr>` : '') +
    `<tr><th>${t('res.maxSlope')}</th><td>${fmt(m.maxSlope, 1)}${t('res.deg')}</td></tr><tr><th>${t('res.mola')}</th><td>${(m.molaFraction * 100).toFixed(0)}%</td></tr></table>` +
    `<h4>${t('res.classes')}</h4>${cls}${roughHtml(R)}${confHtml(R)}<h4>${t('res.profile')}</h4>${profileSvg(m)}<div id="ctxResults"></div>`;
  document.dispatchEvent(new CustomEvent('resultsrendered'));
}


// Pure-ish route computation shared by the Route tab and the About story. Returns a result object or { error: i18n key }.
export function computeRoute(g, mode, start, goal, p) {
  const res = routeInner(g, mode, start, goal, p); if (!res.error) { if (g.hiriseShare == null) { let n = 0; for (let i = 0; i < g.src.length; i++) if (g.src[i] === 0) n++; g.hiriseShare = (100 * n) / g.src.length; } res.coverage = g.hiriseShare; }
  if (res.error || !g.rough) return res;
  const saved = g.pen; g.pen = null; const base = routeInner(g, mode, start, goal, p); g.pen = saved; // same route without the roughness/belt penalty
  const av = avoidedFormations(g, base.path, res.path), m = res.metrics;
  res.rough = { ...av, roughKm: m.roughDistance / 1000, roughPct: m.roughFraction * 100, plainRoughPct: base.metrics.roughFraction * 100, extraKm: (m.distance - base.metrics.distance) / 1000, thr: p.roughThreshold, penalty: p.roughPenalty, beltPenalty: p.beltPenalty };
  return res;
}
function routeInner(g, mode, start, goal, p) {
  const a = cellOf(g, start.lat, start.lon), b = cellOf(g, goal.lat, goal.lon); if (a < 0 || b < 0) return { error: 'route.outside' };
  const walkOpts = { maxSlope: p.evaMaxSlope, speed: walkSpeed, molaPenalty: p.molaPenalty }, vehOpts = { maxSlope: p.vehicleLimit, speed: vehicleSpeed(p.vehicleSpeed), molaPenalty: p.molaPenalty };
  const teamRangeKm = MODES.eva.teamRangeKm, pt = c => centerOf(g, c);
  const coordsOf = (path, first, last) => { const c = path.map(pt); if (first) c[0] = first; if (last) c[c.length - 1] = last; return c; };
  const sp = { lat: start.lat, lon: start.lon }, gp = { lat: goal.lat, lon: goal.lon };
  if (mode === 'hybrid') {
    const h = planHybrid(g, a, b, vehOpts, walkOpts, p.standoffM); if (!h.vehiclePath) return { error: 'route.noRoute' };
    const park = pt(h.park), vm = routeMetrics(g, h.vehiclePath, vehOpts.speed), wm = routeMetrics(g, h.walkPath, walkOpts.speed);
    const legs = [{ kind: 'vehicle', metrics: vm, coords: coordsOf(h.vehiclePath, sp, park) }, { kind: 'walk', metrics: wm, coords: coordsOf(h.walkPath, park, gp) }];
    const coords = legs[0].coords.concat(legs[1].coords.slice(1)), metrics = combineMetrics(vm, wm);
    const hp = { evaHours: p.evaHours, bufferHours: p.bufferHours, teamRangeKm };
    return { mode, opts: walkOpts, params: { ...p }, path: h.vehiclePath.concat(h.walkPath.slice(1)), metrics, legs, park, start: { ...start }, goal: { ...goal }, straight: straightLine(g, a, b, walkOpts.maxSlope),
      reach: hybridReachability(wm.time, wm.distance, hp), coords };
  }
  const eva = mode === 'eva', opts = eva ? walkOpts : vehOpts, r = astar(g, a, b, opts); if (!r.path) return { error: 'route.noRoute' };
  const metrics = routeMetrics(g, r.path, opts.speed);
  return { mode, opts, params: { ...p }, path: r.path, metrics, start: { ...start }, goal: { ...goal }, straight: straightLine(g, a, b, opts.maxSlope),
    reach: eva ? evaReachability(metrics.time, metrics.distance, { evaHours: p.evaHours, bufferHours: p.bufferHours, teamRangeKm }) : null, coords: coordsOf(r.path, sp, gp) };
}

let belt = null;
async function prepareRough(g) {
  if (belt === null) { try { const f = (await app.getJson(FILES.boxwork)).features.find(x => x.properties.kind === 'orbital_belt_box'); belt = f ? polygonMask(g, f.geometry.coordinates) : false; } catch (e) { console.warn(e); belt = false; } }
  if (g.rkThr !== S.p.roughThreshold) { g.rkMask = roughMaskFromRaw(g, S.p.roughThreshold); g.rkThr = S.p.roughThreshold; }
  applyRoughness(g, g.rkMask, { penalty: S.p.roughPenalty, minCluster: ROUGH.minCluster, belt: belt || null, beltPenalty: S.p.beltPenalty }); refreshRoughLayer();
}
async function plan() {
  const btn = $('#planBtn'); S.message = ''; if (!S.start || !S.goal) { S.message = t('route.hint'); $('#routeMsg').textContent = S.message; return; }
  btn.disabled = true; btn.textContent = t('route.running'); const busy = $('#busy'); busy.hidden = false; busy.textContent = t('route.running');
  await new Promise(r => setTimeout(r, 30));
  try {
    const T = await app.getTerrain(); S.grid ||= buildGrid(T, 4); await prepareRough(S.grid);
    const g = S.grid, a = cellOf(g, S.start.lat, S.start.lon), b = cellOf(g, S.goal.lat, S.goal.lon);
    if (a < 0 || b < 0) { S.message = t('route.outside'); S.result = null; return; }
    const out = computeRoute(g, S.mode, S.start, S.goal, S.p); if (out.error) { S.message = t(out.error); S.result = null; layerGroup.clearLayers(); return; }
    S.result = out;
    drawRoute(S.result); app.map.fitBounds(L.latLngBounds(S.result.coords.map(c => [c.lat, c.lon])).pad(0.2), { maxZoom: 14 });
  } catch (e) { console.error(e); S.message = t('route.dataFail'); S.result = null; }
  finally { busy.hidden = true; render(); if (S.result) document.dispatchEvent(new CustomEvent('routeresult', { detail: S.result })); }
}

export async function initPlannerUi(appRef) {
  app = appRef; L = window.L; layerGroup = L.layerGroup().addTo(app.map);
  try { S.drills = (await app.getJson(FILES.drills)).features; const ns = S.drills.find(d => d.properties.name === 'Nevado Sajama'); if (ns?.geometry) S.goal = { lat: ns.geometry.coordinates[1], lon: ns.geometry.coordinates[0], label: 'Nevado Sajama' }; } catch (e) { console.warn(e); }
  app.map.on('click', e => { if (!S.picking) return; S[S.picking] = { lat: e.latlng.lat, lon: e.latlng.lng, label: 'map' }; S.picking = null; drawMarkers(); render(); });
  drawMarkers(); render(); onLangChange(() => { drawMarkers(); render(); });
  const fromLink = applyHash(); hashReady = true;
  if (fromLink) { document.getElementById('tabRouteBtn')?.click(); document.getElementById('welcome')?.remove(); plan(); }
  addEventListener('hashchange', () => { if (applyHash()) plan(); });
}

// Numbers for the About story: default route (Bradbury -> Nevado Sajama) on foot, by vehicle and as a hybrid, default parameters.
let story = null;
export async function computeStory() {
  if (story) return story;
  const T = await app.getTerrain(); S.grid ||= buildGrid(T, 4); const g = S.grid; await prepareRough(g);
  const dr = S.drills.length ? S.drills : (await app.getJson(FILES.drills)).features, ns = dr.find(d => d.properties.name === 'Nevado Sajama'); if (!ns?.geometry) return null;
  const start = { ...BRADBURY }, goal = { lat: ns.geometry.coordinates[1], lon: ns.geometry.coordinates[0] };
  const p = { evaHours: MODES.eva.evaHours, bufferHours: MODES.eva.bufferHours, evaMaxSlope: MODES.eva.maxSlope, vehicleLimit: 20, vehicleSpeed: MODES.vehicle.speedKmh, molaPenalty: MODES.vehicle.molaPenalty, standoffM: MODES.hybrid.standoffM, roughThreshold: S.p.roughThreshold, roughPenalty: S.p.roughPenalty, beltPenalty: S.p.beltPenalty };
  const foot = computeRoute(g, 'eva', start, goal, p), hy = computeRoute(g, 'hybrid', start, goal, p); if (foot.error || hy.error) return null;
  return (story = { footKm: foot.metrics.distance / 1000, footOneWayH: foot.metrics.time / 3600, footRoundH: foot.reach.roundTripS / 3600, limitH: foot.reach.activeLimitS / 3600, footOk: foot.reach.ok,
    driveKm: hy.legs[0].metrics.distance / 1000, driveH: hy.legs[0].metrics.time / 3600, walkKm: hy.legs[1].metrics.distance / 1000, walkRoundH: hy.reach.roundTripS / 3600, hybridOk: hy.reach.ok, standoff: p.standoffM, vehKmh: p.vehicleSpeed });
}

// ---- layer: rough ground (planning grid, ~32 m), same mask the planner penalises
let roughLayer = null;
function roughUrl() {
  const g = S.grid; if (!g?.rough) return null; const cv = document.createElement('canvas'); cv.width = g.nx; cv.height = g.ny; const ctx = cv.getContext('2d'), img = ctx.createImageData(g.nx, g.ny), d = img.data;
  for (let i = 0; i < g.nx * g.ny; i++) if (g.rough[i]) { const o = i * 4, big = g.cluster[i] > 0; d[o] = 213; d[o + 1] = 94; d[o + 2] = 0; d[o + 3] = big ? 215 : 95; }
  ctx.putImageData(img, 0, 0); return cv.toDataURL('image/png');
}
function roughBounds() { const g = S.grid; return [[g.north - g.ny * g.stepDeg, g.west], [g.north, g.west + g.nx * g.stepDeg]]; }
function refreshRoughLayer() { if (!roughLayer || !S.grid?.rough) return; roughLayer.setUrl(roughUrl()); roughLayer.setBounds(roughBounds()); }
handlers.rough = {
  async create(def, api) {
    const T = await api.app.getTerrain(); S.grid ||= buildGrid(T, 4); app = api.app; await prepareRough(S.grid);
    roughLayer = api.L.imageOverlay(roughUrl(), roughBounds(), { opacity: def.opacity ?? 0.8, pane: 'analysisPane', interactive: false, className: 'pixelated', alt: '' });
    return { layer: roughLayer, setOpacity: o => roughLayer.setOpacity(o) };
  },
};
