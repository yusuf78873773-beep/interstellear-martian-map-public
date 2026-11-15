// M2: vector / table layers (GeoJSON, CSV points, CSV boxes). Registers more handlers into ./handlers.js
import { handlers } from './handlers.js';
import { t } from './i18n.js';
import { popupPhotos } from './photos.js';
import { parseCsv, colIndex } from './csv.js';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f = (v, d = 2) => (v === '' || v == null || isNaN(+v)) ? '–' : (+v).toFixed(d);
const kvTable = rows => '<table>' + rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${v}</td></tr>`).join('') + '</table>';
let sharedRenderer = null;
const renderer = L => (sharedRenderer ||= L.canvas({ padding: 0.5, tolerance: 6 }));

function setGroupOpacity(group, o) {
  group.eachLayer(l => { if (l.setStyle) l.setStyle({ opacity: o, fillOpacity: (l.options._fill ?? 0.5) * o }); });
}

// ---- GeoJSON layers (traverse, drills, boxwork polygons, SHARAD tracks)
const GEO_STYLE = {
  traverse: { line: { color: '#ffffff', weight: 2, opacity: 1 }, point: { radius: 3, color: '#ffffff', fillColor: '#ffffff', weight: 1 } },
  drills: { point: { radius: 8, color: '#000', fillColor: '#e69f00', weight: 2, _fill: 0.95 } },
  boxwork: { poly: { color: '#f0e442', weight: 2, dashArray: '6 4', fillColor: '#f0e442', _fill: 0.12 } },
  sharad: { line: { color: '#56b4e9', weight: 2 } },
};

handlers.geojson = {
  async create(def, api) {
    const L = api.L, st = GEO_STYLE[def.id] || {}, rend = renderer(L);
    const gj = await api.json(def.url);
    const group = L.geoJSON(gj, {
      renderer: rend,
      style: feat => {
        if (def.id === 'sharad') return feat.properties.boxwork_koridoru ? { color: '#cc79a7', weight: 5, opacity: 1 } : { ...st.line, opacity: 1 };
        if (feat.geometry.type === 'Polygon') return { ...st.poly, fillOpacity: st.poly._fill };
        return { ...st.line };
      },
      pointToLayer: (feat, ll) => L.circleMarker(ll, { renderer: rend, ...st.point, fillOpacity: st.point?._fill ?? 0.9, bubblingMouseEvents: false }),
      onEachFeature: (feat, layer) => {
        const p = feat.properties || {};
        if (def.id === 'drills') layer.bindTooltip(p.name, { permanent: true, direction: 'right', offset: [8, 0] });
        layer.bindPopup(() => {
          if (def.id === 'sharad') {
            return `<b>${t('popup.sharad.title', { id: esc(p.product_id) })}</b>` + kvTable([[t('popup.sharad.date'), esc(p.date_utc)], ['orbit', esc(p.orbit)], ['columns', `${p.radargram_column_first}–${p.radargram_column_last}`]]) +
              (p.boxwork_koridoru ? `<p><b>${t('popup.sharad.boxwork')}</b></p>` : '') + `<p class="warn">${t('popup.sharad.warn')}</p>`;
          }
          if (def.id === 'drills') {
            return `<b>${esc(p.name)}</b>` + kvTable([['sol (source)', esc(p.sol_readme)], ['date', esc(p.date_readme || '–')], [t('layer.drills.name'), t('popup.drill.pose', { sol: p.pose_sol, site: p.pose_site, drive: p.pose_drive })], ['elevation (m)', f(p.elevation_m, 0)]]) + (p.note ? `<p class="warn">${esc(p.note)}</p>` : '') + popupPhotos(p.name);
          }
          if (def.id === 'boxwork') return `<b>${esc(p.name)}</b><p class="warn">${t('layer.boxwork.limit')}</p>`;
          if (def.id === 'traverse' && p.sol != null) return `<b>sol ${p.sol}</b>` + kvTable([['site', p.site], ['drive', p.drive], ['elevation (m)', f(p.elevation_m, 0)]]);
          return null;
        });
      },
    });
    return { layer: group, setOpacity: o => setGroupOpacity(group, o), data: gj };
  },
};

// ---- CSV point layers (ChemCam grouped by rover stop, APXS per measurement)
const CHEM_OX = ['SiO2', 'TiO2', 'Al2O3', 'FeOT', 'MgO', 'CaO', 'Na2O', 'K2O', 'MnO'];
const APXS_OX = ['SiO2', 'TiO2', 'Al2O3', 'FeO', 'MgO', 'CaO', 'Na2O', 'K2O', 'SO3', 'Cl', 'MnO'];

handlers['csv-points'] = {
  async create(def, api) {
    const L = api.L, rend = renderer(L);
    const { header, rows } = parseCsv(await api.text(def.url)); const ix = colIndex(header);
    const group = L.layerGroup();
    if (def.id === 'chemcam') {
      const byLoc = new Map();
      for (const r of rows) {
        if (r[ix.is_calibration_target] === '1') continue;
        const key = r[ix.rover_lat] + ',' + r[ix.rover_lon];
        let g = byLoc.get(key); if (!g) { g = { lat: +r[ix.rover_lat], lon: +r[ix.rover_lon], site: r[ix.site], drive: r[ix.drive], rows: [] }; byLoc.set(key, g); }
        g.rows.push(r);
      }
      for (const g of byLoc.values()) {
        const m = L.circleMarker([g.lat, g.lon], { renderer: rend, radius: 3 + Math.min(6, Math.log2(g.rows.length)), color: '#000', weight: 0.5, fillColor: '#cc79a7', fillOpacity: 0.75, _fill: 0.75, bubblingMouseEvents: false });
        m.bindPopup(() => {
          const shown = g.rows.slice(0, 12);
          return `<b>ChemCam · site ${g.site}/drive ${g.drive}</b>` + `<div>${g.rows.length} ${t('popup.measurements')}</div>` +
            `<div>${t('popup.chem.rover')}: ${g.lat.toFixed(5)}, ${g.lon.toFixed(5)}</div>` + `<div class="warn">${t('layer.chemcam.limit')}</div>` +
            `<table><tr><th>${t('popup.sol')}</th><th>${t('popup.target')}</th>${CHEM_OX.map(o => `<th>${o}</th>`).join('')}</tr>` +
            shown.map(r => `<tr><td>${r[ix.sol_from_sclk]}</td><td>${esc(r[ix.target])}</td>${CHEM_OX.map(o => `<td>${f(r[ix[o]], 1)}</td>`).join('')}</tr>`).join('') + '</table>' +
            (g.rows.length > shown.length ? `<div>${t('popup.moreRows', { n: g.rows.length - shown.length })}</div>` : '') + `<div>${t('popup.oxides')}</div>`;
        });
        group.addLayer(m);
      }
      return { layer: group, setOpacity: o => setGroupOpacity(group, o), table: { header, rows } };
    }
    for (const r of rows) { // apxs
      const lat = +r[ix.lat_from_northing], lon = +r[ix.lon_from_easting]; if (!isFinite(lat) || !isFinite(lon)) continue;
      const m = L.circleMarker([lat, lon], { renderer: rend, radius: 4, color: '#000', weight: 0.5, fillColor: '#e69f00', fillOpacity: 0.85, _fill: 0.85, bubblingMouseEvents: false });
      m.bindPopup(() => `<b>APXS · ${t('popup.sol')} ${esc(r[ix.Sol])} · ${esc(r[ix.Target])}</b>` +
        kvTable([[t('popup.apxs.prep'), esc(r[ix.Preparation_method])], ['elevation (m)', f(r[ix.Elevation_m], 0)], ['source', esc(r[ix.source_file])]]) +
        `<div>${t('popup.oxides')}</div>` + kvTable(APXS_OX.map(o => [o, f(r[ix[o + '_pct']], 2)])));
      group.addLayer(m);
    }
    return { layer: group, setOpacity: o => setGroupOpacity(group, o), table: { header, rows } };
  },
};

// ---- CRISM observation footprints (rectangles from the ODE query table)
handlers['csv-boxes'] = {
  async create(def, api) {
    const L = api.L, rend = renderer(L);
    const { header, rows } = parseCsv(await api.text(def.url)); const ix = colIndex(header);
    const group = L.layerGroup();
    for (const r of rows) {
      const rect = L.rectangle([[+r[ix.min_lat], +r[ix.west_lon]], [+r[ix.max_lat], +r[ix.east_lon]]], { renderer: rend, color: '#b07cff', weight: 1.5, dashArray: '4 3', fillColor: '#b07cff', fillOpacity: 0.06, _fill: 0.06 });
      rect.bindPopup(() => `<b>${esc(r[ix.product].replace('.img', ''))}</b>` + kvTable([[t('popup.crism.date'), esc(r[ix.date])], ['m/px', f(r[ix.approx_m_per_px], 0)], ['target', esc(r[ix.target_comment])]]) + `<a href="${esc(r[ix.ode_product_page])}" target="_blank" rel="noopener">ODE</a>`);
      group.addLayer(rect);
    }
    return { layer: group, setOpacity: o => setGroupOpacity(group, o) };
  },
};
