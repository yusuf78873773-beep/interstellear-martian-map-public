// M5: fills the route result with radiation, environment, science stops, "why this route" and the GeoJSON download.
import { FILES } from './config.js';
import { t } from './i18n.js';
import { parseCsv } from './csv.js';
import { remsConditions, radStats, radDose, remsAir, suitCompare, SUIT_TEMP_C, SUIT_SCENARIOS, analyzeCorridor, whyFacts, routeGeoJSON, DRILL_WEIGHT, CORRIDOR_M } from './context.js';
import { routeState } from './planner-ui.js';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f = (v, d = 1) => (+v).toFixed(d);
let app, data = null, token = 0;

async function loadData() {
  if (data) return data;
  const [rad, rems, chem, apxs, drills] = await Promise.all([
    app.getText(FILES.rad), app.getText(FILES.rems), app.getText(FILES.chemcam), app.getText(FILES.apxs), app.getJson(FILES.drills)]);
  return (data = { rad: radStats(rad), air: remsAir(rems), cond: remsConditions(rems), chem: parseCsv(chem), apxs: parseCsv(apxs), drills: drills.features });
}

function render(R, D) {
  const hy = R.mode === 'hybrid', eva = R.mode === 'eva', hours = (hy ? 2 * R.metrics.time : eva ? 2 * R.metrics.time : R.metrics.time) / 3600; // hybrid: whole trip out and back
  const dose = radDose(D.rad, hours), cor = analyzeCorridor(R.coords, D.chem, D.apxs, D.drills, CORRIDOR_M), why = whyFacts(R, cor), cmp = suitCompare(D.air);
  R.corridor = cor;
  const sepSols = D.rad.sep.map(s => s.sol).join(', ');
  const rad = `<h3>${t('ctx.rad.title')}</h3><p>${t('ctx.rad.line', { n: D.rad.n, rate: f(D.rad.mean, 2), hours: f(hours, 1), what: t('ctx.rad.what.' + R.mode), dose: Math.round(dose.typical) })}</p>` +
    (dose.sepWorst != null ? `<p>${t('ctx.rad.sep', { sols: sepSols, peak: f(D.rad.sepPeak, 1), dose: Math.round(dose.sepWorst) })}</p>` + `<table class="kv storm"><caption>${t('ctx.storm.title')}</caption><tr><th></th><th>${t('ctx.storm.quiet')}</th><th>${t('ctx.storm.spe')}</th></tr><tr><th>${t('ctx.storm.rate')}</th><td>${f(D.rad.mean, 2)}</td><td>${f(D.rad.sepPeak, 1)}</td></tr><tr><th>${t('ctx.storm.dose', { h: f(hours, 1) })}</th><td>${Math.round(dose.typical)}</td><td>${Math.round(dose.sepWorst)}</td></tr><tr><th>${t('ctx.storm.ratio')}</th><td>1×</td><td>${f(D.rad.sepPeak / D.rad.mean, 1)}×</td></tr></table><p class="note">${t('ctx.storm.note', { n: D.rad.sep.length, sols: sepSols })}</p>` : '') + `<p class="warn">${t('ctx.rad.warn')}</p>`;
  const wm = R.legs ? R.legs[1].metrics : (eva ? R.metrics : null), walkTxt = wm && wm.distance > 0 ? t('ctx.suit.route', { v: f(wm.distance / wm.time, 2), km: f(wm.distance / 1000, 2) }) : '';
  const suit = `<h3>${t('ctx.suit.title')}</h3><p>${t('ctx.suit.formula')} ${walkTxt}</p><table class="kv suit"><tr><th></th><th>${t('ctx.suit.a')}</th><th>${t('ctx.suit.b')}</th></tr>` +
    [['ctx.suit.row.suit', 'suitKg'], ['ctx.suit.row.astro', 'astronautKg'], ['ctx.suit.row.weight', 'marsWeightKg'], ['ctx.suit.row.inertia', 'inertiaKg']].map(([k, key]) => `<tr><th>${t(k)}</th>${SUIT_SCENARIOS.map(x => `<td>${x[key]}</td>`).join('')}</tr>`).join('') + `</table><p class="note">${t('ctx.suit.note')}</p>`;
  const env = `<h3>${t('ctx.env.title')}</h3><p>${t('ctx.env.air', { n: D.air.n, min: f(D.air.min, 0), max: f(D.air.max, 0), mean: f(D.air.mean, 0) })} ` +
    `${t(cmp.inside ? 'ctx.env.suit.in' : 'ctx.env.suit.out', { smin: SUIT_TEMP_C.min, smax: SUIT_TEMP_C.max })}</p><p class="note">${t('ctx.env.note')}</p>`;
  const c = D.cond, rr = (o, d) => o ? t('ctx.cond.range', { min: f(o.min, d), mean: f(o.mean, d), max: f(o.max, d) }) : t('ctx.cond.nodata');
  const cond = `<h3>${t('ctx.cond.title')}</h3><table class="kv cond"><tr><th>${t('ctx.cond.air')}</th><td>${rr(c.air, 0)} °C</td></tr><tr><th>${t('ctx.cond.pressure')}</th><td>${rr(c.pressure, 0)} Pa</td></tr><tr><th>${t('ctx.cond.rh')}</th><td>${rr(c.rh, 1)} %</td></tr>` +
    `<tr><th>${t('ctx.cond.uv')}</th><td>${c.uv ? t('ctx.cond.uvval', { n: c.uv.n, max: f(c.uv.max, 1) }) : t('ctx.cond.nodata')}</td></tr><tr><th>${t('ctx.cond.wind')}</th><td>${c.windSols > 0 ? t('ctx.cond.windsols', { n: c.windSols }) : t('ctx.cond.nodata')}</td></tr><tr><th>${t('ctx.cond.ground')}</th><td>${t('ctx.cond.notshown')}</td></tr></table>` +
    `<p class="note">${t('ctx.cond.note', { n: c.n, a: c.solFirst, b: c.solLast })}</p>`;
  const stops = cor.stops.map((s, i) => `<li><button type="button" class="linkish" data-fly="${s.lat},${s.lon}" title="${t('ctx.focus')}">${t('ctx.sci.stop', { lat: f(s.lat, 4), lon: f(s.lon, 4), dist: Math.round(s.dist), c: s.chem, a: s.apxs })}</button></li>`).join('');
  const drills = cor.drills.map(d => `<li><button type="button" class="linkish" data-fly="${d.lat},${d.lon}">${t('ctx.sci.drill', { name: esc(d.name), dist: Math.round(d.dist) })}</button></li>`).join('');
  const sci = `<h3>${t('ctx.sci.title', { w: CORRIDOR_M })}</h3><p>${t('ctx.sci.score', { wt: DRILL_WEIGHT, score: cor.score, c: cor.nChem, a: cor.nApxs, d: cor.nDrills })}</p>` +
    (cor.score === 0 ? `<p>${t('ctx.sci.none')}</p>` : `<ul class="stops">${drills}${stops}</ul><p class="note">${t('ctx.sci.note', { n: cor.nStopLocations })}</p>`);
  const why3 = why.overPct > 0.5 ? t('ctx.why.3', { sk: f(why.straightKm, 1), over: f(why.overPct, 0), limit: why.limit, detour: f(why.detourPct, 0) }) : t('ctx.why.3b', { sk: f(why.straightKm, 1), limit: why.limit, detour: f(why.detourPct, 0) });
  const whyHtml = `<h3>${t('ctx.why.title')}</h3><div class="why"><p>${t('ctx.why.1', { km: f(why.km, 1), h: f(why.hours, 1), v: f(why.avgSpeed, 2) })}</p><p>${t('ctx.why.2', { limit: why.limit, green: f(why.green, 0), yellow: f(why.yellow, 0), red: f(why.red, 0) })}</p><p>${why3}</p>` +
    (why.molaPct > 0.5 ? `<p>${t('ctx.why.4', { mola: f(why.molaPct, 0) })}</p>` : '') + `<p>${t('ctx.why.5', { w: CORRIDOR_M, c: why.nChem, a: why.nApxs, d: why.nDrills })}</p></div>`;
  return whyHtml + rad + suit + cond + env + sci + `<div class="actions"><button type="button" id="dlBtn" class="primary">${t('route.download')}</button></div>`;
}

async function fill() {
  const host = document.getElementById('ctxResults'); const R = routeState.result; if (!host || !R) return;
  const my = ++token; host.innerHTML = `<p class="note">${t('ctx.loading')}</p>`;
  let D; try { D = await loadData(); } catch (e) { console.error(e); host.innerHTML = `<p class="bad">${t('err.data', { what: 'context' })}</p>`; return; }
  if (my !== token) return;
  host.innerHTML = render(R, D);
  host.querySelectorAll('[data-fly]').forEach(b => b.addEventListener('click', () => { const [la, lo] = b.dataset.fly.split(',').map(Number); app.map.setView([la, lo], 16); }));
  host.querySelector('#dlBtn')?.addEventListener('click', () => {
    const gj = routeGeoJSON(R, { corridor_m: CORRIDOR_M, science_score: R.corridor?.score });
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(gj, null, 1)], { type: 'application/geo+json' }));
    a.download = `route_${R.mode}_${Math.round(R.metrics.distance)}m.geojson`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
}

export function initContextUi(appRef) { app = appRef; document.addEventListener('resultsrendered', fill); }
