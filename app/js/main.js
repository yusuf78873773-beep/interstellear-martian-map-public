// App bootstrap: map, layer panel (badges, opacity, info), language toggle, tabs, dialogs.
import { REGION, LAYERS, FILES, DATA } from './config.js';
import { t, getLang, setLang, onLangChange, applyDom } from './i18n.js';
import { handlers } from './handlers.js';
import './handlers2.js';
import { initTerrainUi, getTerrain } from './terrain-ui.js';
import { initPlannerUi } from './planner-ui.js';
import { initContextUi } from './context-ui.js';
import { initAbout } from './about.js';
import { linkify } from './links.js';
import { initPhotos } from './photos.js';
import { initWelcome } from './welcome.js';

const L = window.L;
const $ = s => document.querySelector(s);
const cache = new Map();
const getJson = url => { if (!cache.has(url)) cache.set(url, fetch(url).then(r => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); })); return cache.get(url); };
const getText = url => fetch(url).then(r => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.text(); });
// Binary grids: dist stores them as <name>.bin.gz. Download with progress (shown in #busy), inflate with DecompressionStream.
// If a server already inflated the file (Content-Encoding), the gzip magic bytes are missing and the bytes are used as they are.
const dl = { loaded: 0, total: 0, n: 0 };
function dlProgress() { const el = document.getElementById('busy'); if (el && !el.hidden && dl.total) el.textContent = (el.dataset.label || '') + ' ' + Math.min(99, Math.round((100 * dl.loaded) / dl.total)) + '%'; }
async function getBuf(url) {
  const src = url.endsWith('.bin') ? url + '.gz' : url, r = await fetch(src); if (!r.ok) throw new Error(src + ' ' + r.status);
  dl.n++; dl.total += +r.headers.get('content-length') || 0;
  try {
    const parts = []; let size = 0; const rd = r.body.getReader();
    for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); size += value.length; dl.loaded += value.length; dlProgress(); }
    let u8 = new Uint8Array(size), o = 0; for (const p of parts) { u8.set(p, o); o += p.length; }
    if (u8[0] === 0x1f && u8[1] === 0x8b) {
      if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot unpack the data (DecompressionStream missing).');
      u8 = new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    }
    return u8.buffer;
  } finally { if (--dl.n === 0) { dl.loaded = 0; dl.total = 0; } }
}

export const app = { map: null, manifest: {}, layers: new Map(), getJson, getText, getBuf };
app.getTerrain = () => getTerrain(app);

function typeOf(def) {
  if (def.approximate) return 'approximate';
  const m = app.manifest[def.manifest];
  return m ? m.type : 'derived';
}
const badgeHtml = def => { const ty = typeOf(def); return `<span class="badge ${ty}" title="${t('badge.' + ty + '.tip')}">${t('badge.' + ty)}</span>`; };

function initMap() {
  const map = L.map('map', { crs: L.CRS.EPSG4326, minZoom: 8, maxZoom: 16, zoomSnap: 0.25, preferCanvas: true, zoomControl: true, keyboard: true });
  map.createPane('basePane').style.zIndex = 210;
  map.createPane('routePane').style.zIndex = 450; // above the canvas markers (overlay pane, 400), below pins and popups
  map.createPane('analysisPane').style.zIndex = 230;
  map.fitBounds([[REGION.south, REGION.west], [REGION.north, REGION.east]]);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  map.attributionControl.addAttribution('NASA/JPL-Caltech · USGS · PDS · Caltech Murray Lab · U. Arizona');
  L.control.scale({ metric: true, imperial: false, position: 'bottomright' }).addTo(map);
  app.map = map;
  window.__map = map; // handy for tests and screenshots
}

function layerApi() {
  return { L, map: app.map, json: getJson, text: getText, buf: getBuf, files: FILES, manifest: app.manifest, app,
    dataUrl: (file) => DATA + 'crism/' + file };
}

async function ensureLayer(def) {
  const st = app.layers.get(def.id);
  if (st.obj) return st.obj;
  const h = handlers[def.kind];
  if (!h) throw new Error('no handler for ' + def.kind);
  st.status = t('layers.loading'); renderStatus(def.id);
  try { st.obj = await h.create(def, layerApi()); st.status = ''; st.err = false; }
  catch (e) { console.error(def.id, e); st.status = t('layers.failed'); st.err = true; st.obj = null; renderStatus(def.id); throw e; }
  st.obj.setOpacity?.(st.opacity);
  renderStatus(def.id);
  return st.obj;
}

async function setLayerOn(def, on) {
  const st = app.layers.get(def.id); st.on = on;
  const el = document.querySelector(`[data-layer="${def.id}"]`); el?.classList.toggle('on', on);
  if (on) {
    try { const obj = await ensureLayer(def); if (st.on) { obj.layer.addTo(app.map); obj.onAdd?.(); } }
    catch { st.on = false; const cb = el?.querySelector('input[type=checkbox]'); if (cb) cb.checked = false; el?.classList.remove('on'); }
  } else if (st.obj) { app.map.removeLayer(st.obj.layer); st.obj.onRemove?.(); }
  document.dispatchEvent(new CustomEvent('layerchange', { detail: { id: def.id, on: st.on } }));
}

function renderStatus(id) {
  const st = app.layers.get(id); const el = document.querySelector(`[data-layer="${id}"] .status`);
  if (el) { el.textContent = st.status || ''; el.classList.toggle('err', !!st.err); }
}

function renderLayerPanel() {
  const host = $('#tab-layers'); host.innerHTML = '';
  for (const group of ['base', 'terrain', 'data']) {
    const div = document.createElement('div'); div.className = 'group';
    div.innerHTML = `<h3>${t('group.' + group)}</h3>`;
    for (const def of LAYERS.filter(l => l.group === group)) {
      const st = app.layers.get(def.id);
      const row = document.createElement('div'); row.className = 'layer' + (st.on ? ' on' : ''); row.dataset.layer = def.id;
      row.innerHTML = `<div class="row"><label><input type="checkbox"${st.on ? ' checked' : ''}><span class="name">${t('layer.' + def.id + '.name')}</span></label>${badgeHtml(def)}<button type="button" class="infoBtn" aria-label="${t('layers.info')}: ${t('layer.' + def.id + '.name')}" title="${t('layers.info')}">i</button></div>` +
        `<div class="status"></div><div class="controls"><label>${t('layers.opacity')}<input type="range" min="0" max="1" step="0.05" value="${st.opacity}"></label></div>`;
      row.querySelector('input[type=checkbox]').addEventListener('change', e => setLayerOn(def, e.target.checked));
      row.querySelector('input[type=range]').addEventListener('input', e => { st.opacity = +e.target.value; st.obj?.setOpacity?.(st.opacity); });
      row.querySelector('.infoBtn').addEventListener('click', () => showInfo(def));
      div.appendChild(row);
      if (st.obj?.controls) st.obj.controls(row.querySelector('.controls'));
      renderStatusInto(row, st);
    }
    host.appendChild(div);
  }
}
const renderStatusInto = (row, st) => { const s = row.querySelector('.status'); s.textContent = st.status || ''; s.classList.toggle('err', !!st.err); };

function showInfo(def) {
  const m = app.manifest[def.manifest] || {};
  const ty = typeOf(def); const dlg = $('#infoDlg');
  dlg.innerHTML = `<button class="close" type="button" aria-label="${t('btn.close')}">✕</button><h2 id="infoTitle">${t('layer.' + def.id + '.name')} ${badgeHtml(def)}</h2>` +
    `<dl class="meta"><dt>${t('info.source')}</dt><dd>${m.source ? linkify(m.source) : '–'}</dd><dt>${t('info.resolution')}</dt><dd>${t('layer.' + def.id + '.res')}</dd><dt>${t('info.limit')}</dt><dd>${t('layer.' + def.id + '.limit')}</dd><dt>${t('info.file')}</dt><dd><code>${def.manifest || ''}</code></dd></dl>`;
  dlg.querySelector('.close').addEventListener('click', () => dlg.close());
  dlg.showModal();
}

function initTabs() {
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    document.querySelectorAll('[role=tabpanel]').forEach(p => { p.hidden = p.id !== 'tab-' + b.dataset.tab; });
    document.querySelectorAll('.tabs button').forEach(x => x.tabIndex = x === b ? 0 : -1);
    setTimeout(() => app.map.invalidateSize(), 50);
  }));
  // WAI-ARIA tabs: Left/Right (wrapping), Home, End move and activate; only the selected tab is in the Tab order
  const tabs = [...document.querySelectorAll('.tabs button')]; tabs.forEach(x => x.tabIndex = x.getAttribute('aria-selected') === 'true' ? 0 : -1);
  document.querySelector('.tabs').addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return; let j = -1;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = tabs.length - 1;
    if (j < 0) return; e.preventDefault(); tabs[j].focus(); tabs[j].click();
  });
  const tog = $('#panelToggle'), panel = $('#panel');
  tog.addEventListener('click', () => { const c = panel.classList.toggle('collapsed'); tog.setAttribute('aria-expanded', String(!c)); setTimeout(() => app.map.invalidateSize(), 50); });
  if (matchMedia('(max-width: 760px)').matches) { panel.classList.add('collapsed'); tog.setAttribute('aria-expanded', 'false'); }
}

async function main() {
  document.documentElement.lang = getLang();
  try { app.manifest = await getJson(FILES.manifest); } catch (e) { console.warn('manifest missing', e); }
  initMap();
  for (const def of LAYERS) app.layers.set(def.id, { on: false, opacity: def.opacity ?? 1, obj: null, status: '', err: false });
  renderLayerPanel(); applyDom(); initTabs();
  const labelA11y = () => { $('#langBtn').textContent = t('btn.lang'); $('#langBtn').setAttribute('aria-label', t('btn.lang.aria')); $('#langBtn').title = t('btn.lang.title'); document.querySelector('.tabs')?.setAttribute('aria-label', t('tab.aria')); }; labelA11y();
  $('#langBtn').addEventListener('click', () => setLang(getLang() === 'en' ? 'tr' : 'en'));
  onLangChange(() => { labelA11y(); renderLayerPanel(); document.dispatchEvent(new CustomEvent('langchange')); });
  for (const def of LAYERS.filter(l => l.on)) { await setLayerOn(def, true); const cb = document.querySelector(`[data-layer="${def.id}"] input[type=checkbox]`); if (cb) cb.checked = true; }
  initTerrainUi(app);
  initPlannerUi(app);
  initContextUi(app);
  initAbout(app); initPhotos(app); initWelcome();
  document.dispatchEvent(new CustomEvent('appready'));
}
main().catch(e => { console.error(e); document.body.insertAdjacentHTML('beforeend', `<p class="bad" style="padding:12px">${t('err.data', { what: 'app' })}</p>`); });
export { setLayerOn, ensureLayer };
