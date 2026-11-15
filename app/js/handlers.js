// Layer handlers: one per layer "kind". create(def, api) -> Promise<{ layer, setOpacity(o), controls?(el, rerender) }>
// api: { map, L, json(url), text(url), bounds(def), t, manifest }
import { t } from './i18n.js';

export const handlers = {};

const toLatLngBounds = b => [[b.south, b.west], [b.north, b.east]];

// ---- plain georeferenced image (pixel-edge bounds come from the data/*/bounds.json files)
handlers.image = {
  async create(def, api) {
    const [file, key] = def.boundsFrom;
    const j = await api.json(file);
    const b = toLatLngBounds(j.files[key].bounds);
    const layer = api.L.imageOverlay(def.url, b, { opacity: def.opacity ?? 1, pane: 'basePane', interactive: false, alt: '' });
    return { layer, setOpacity: o => layer.setOpacity(o) };
  },
};

// ---- CRISM browse images: one layer, selectable observation and browse product
handlers.crism = {
  async create(def, api) {
    const j = await api.json(api.files.crismBounds);
    const entries = Object.entries(j.files).filter(([k]) => k.startsWith('browse/'));
    const products = [...new Set(entries.map(([, v]) => v.product))];
    const params = ['phy', 'hyd', 'hys'];
    const sel = { product: products[0], param: 'phy' };
    const find = () => entries.find(([k, v]) => v.product === sel.product && k.includes('_br' + sel.param));
    const first = find();
    const layer = api.L.imageOverlay(api.dataUrl(first[0]), toLatLngBounds(first[1].bounds), { opacity: def.opacity ?? 0.85, pane: 'basePane', interactive: false, alt: '' });
    const apply = () => { const f = find(); if (!f) return; layer.setUrl(api.dataUrl(f[0], 'crism')); layer.setBounds(toLatLngBounds(f[1].bounds)); };
    return {
      layer, setOpacity: o => layer.setOpacity(o),
      controls(el) {
        el.insertAdjacentHTML('beforeend',
          `<label>${t('crism.product')}<select data-k="product">${products.map(p => `<option value="${p}"${p === sel.product ? ' selected' : ''}>${p.split('_')[0]} · ${j.files[entries.find(([, v]) => v.product === p)[0]].date}</option>`).join('')}</select></label>` +
          `<label>${t('crism.param')}<select data-k="param">${params.map(p => `<option value="${p}"${p === sel.param ? ' selected' : ''}>${t('crism.param.' + p)}</option>`).join('')}</select></label>`);
        el.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { sel[s.dataset.k] = s.value; apply(); }));
      },
    };
  },
};
