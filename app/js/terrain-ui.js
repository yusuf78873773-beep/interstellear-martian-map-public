// M3: loads the terrain data lazily, draws HiRISE slope / hazard canvases as image overlays, pointer readout and legend.
import { FILES, HAZARD_COLORS } from './config.js';
import { t, onLangChange } from './i18n.js';
import { handlers } from './handlers.js';
import { makeHirise, makeMola, sample, NODATA16, NODATA8 } from './terrain.js';

let molaP = null, hiriseP = null;
const state = { T: { hirise: null, mola: null } };

export const getMola = app => (molaP ||= Promise.all([app.getJson(FILES.molaBounds), app.getBuf(FILES.molaDem)]).then(([b, d]) => (state.T.mola = makeMola(b, d))));
export const getHirise = app => (hiriseP ||= (async () => {
  busy(true, 'HiRISE DTM…');
  try {
    const [b, dem, slope, haz] = await Promise.all([app.getJson(FILES.hiriseBounds), app.getBuf(FILES.hiriseDem), app.getBuf(FILES.hiriseSlope), app.getBuf(FILES.hiriseHazard)]);
    return (state.T.hirise = makeHirise(b, dem, slope, haz));
  } finally { busy(false); }
})());
export async function getTerrain(app) { await getMola(app); await getHirise(app); return state.T; }
export const currentTerrain = () => state.T;

function busy(on, text) { const el = document.getElementById('busy'); if (!el) return; el.hidden = !on; if (on) { el.dataset.label = text; el.textContent = text; } }

// slope colour ramp (cividis-like, colour-blind safe): degrees -> RGB
const RAMP = [[0, [0, 32, 76]], [10, [66, 78, 108]], [20, [124, 123, 120]], [30, [188, 175, 106]], [40, [253, 231, 55]]];
function rampColor(s) {
  if (s <= RAMP[0][0]) return RAMP[0][1];
  for (let i = 1; i < RAMP.length; i++) if (s <= RAMP[i][0]) { const [a, ca] = RAMP[i - 1], [b, cb] = RAMP[i], u = (s - a) / (b - a); return ca.map((v, k) => Math.round(v + (cb[k] - v) * u)); }
  return RAMP[RAMP.length - 1][1];
}
const SLOPE_LUT = Array.from({ length: 91 }, (_, s) => rampColor(s));

function drawCanvas(h, mode) {
  const cv = document.createElement('canvas'); cv.width = h.W; cv.height = h.H;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(h.W, h.H), d = img.data;
  for (let k = 0; k < h.W * h.H; k++) {
    const o = k * 4;
    if (mode === 'slope') { const s = h.slope[k]; if (s === NODATA8) continue; const c = SLOPE_LUT[Math.min(90, s)]; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255; }
    else { const c = h.cls[k]; if (c === NODATA8) continue; const col = HAZARD_COLORS[c]; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255; }
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}
const toBlobUrl = cv => new Promise(res => cv.toBlob(b => res(URL.createObjectURL(b)), 'image/png'));

handlers.hirise = {
  async create(def, api) {
    const h = await getHirise(api.app); await getMola(api.app);
    const url = await toBlobUrl(drawCanvas(h, def.mode));
    const layer = api.L.imageOverlay(url, [[h.south, h.west], [h.north, h.east]], { opacity: def.opacity ?? 0.7, pane: 'analysisPane', interactive: false, className: 'pixelated', alt: '' });
    return { layer, setOpacity: o => layer.setOpacity(o) };
  },
};

// ---------------- legend
function updateLegend(app) {
  const el = document.getElementById('legend'); if (!el) return;
  const on = id => app.layers.get(id)?.on;
  let html = '';
  if (on('hirise_hazard')) {
    html += `<div><b>${t('legend.title')}</b></div>` + [0, 1, 2].map(c => `<div><span class="sw" style="background:rgb(${HAZARD_COLORS[c]})"></span>${t('class.' + c)}</div>`).join('');
  }
  if (on('hirise_slope')) {
    const g = `linear-gradient(90deg,${RAMP.map(([s, c]) => `rgb(${c}) ${s / 40 * 100}%`).join(',')})`;
    html += `<div style="margin-top:4px"><b>${t('layer.hirise_slope.name')}</b></div><div style="height:10px;width:170px;background:${g};border:1px solid #000"></div><div style="display:flex;justify-content:space-between;width:170px"><span>0°</span><span>20°</span><span>40°+</span></div>`;
  }
  el.innerHTML = html; el.hidden = !html;
}

// ---------------- pointer readout (HiRISE where available, otherwise MOLA, labelled as low confidence)
function readoutHtml(ll) {
  const s = sample(state.T, ll.lat, ll.lng);
  const pos = `${ll.lat.toFixed(4)}, ${ll.lng.toFixed(4)}`;
  if (!s) return `<span>${pos}</span> · ${t('readout.outside')}`;
  return `<span>${pos}</span> · ${t('readout.elev')}: <b>${Math.round(s.elev)} m</b> · ${t('readout.slope')}: <b>${s.slope.toFixed(1)}°</b> · ${t('readout.class')}: <b>${t('class.name.' + s.cls)}</b> · <span class="${s.source === 'mola' ? 'warn' : ''}">${t('readout.source.' + s.source)}</span>`;
}

export function initTerrainUi(app) {
  const ro = document.getElementById('readout'); let last = null, queued = false;
  const show = ll => { last = ll; if (queued) return; queued = true; setTimeout(() => { queued = false; if (state.T.mola) ro.innerHTML = readoutHtml(last); }, 40); };
  getMola(app).then(() => {
    app.map.on('mousemove', e => show(e.latlng));
    app.map.on('click', e => show(e.latlng)); // touch: tap
  });
  document.addEventListener('layerchange', () => updateLegend(app));
  onLangChange(() => { updateLegend(app); if (last && state.T.mola) ro.innerHTML = readoutHtml(last); });
}
export { NODATA16 };
