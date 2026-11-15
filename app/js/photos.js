// Surface photos: data/photos/photos.csv + 4 NASA images. A photo is linked to a map point ONLY when a drill-site name appears in its title
// (e.g. "Nevado Sajama drill hole"); every other photo is shown in the gallery and is NOT placed on the map (no invented matching).
import { FILES } from './config.js';
import { t, onLangChange } from './i18n.js';
import { parseCsv, colIndex } from './csv.js';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let photos = [], drillNames = [];
const base = FILES.photosDir;

const figure = (p, extra = '') => `<figure class="photo"><img src="${base + esc(p.file)}" alt="${esc(p.title)}" loading="lazy" decoding="async"><figcaption><b>${esc(p.title)}</b>` +
  `<div>${t('photos.credit')}: ${esc(p.credit)}</div><div>${t('photos.date')}: ${esc(p.date)}${p.sol && !/^(n\/a|not)/i.test(p.sol) ? ` · ${t('photos.sol')}: ${esc(p.sol)}` : ''}</div>` +
  `<div><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${t('photos.source')}</a></div>${extra}</figcaption></figure>`;

export const linkedTo = p => drillNames.find(n => p.title.toLowerCase().includes(n.toLowerCase())) || null;
// HTML for the drill popup (empty string when no photo is linked to this drill name)
export const popupPhotos = name => photos.filter(p => linkedTo(p) === name).map(p => figure(p)).join('');

function renderGallery() {
  const host = document.getElementById('tab-photos'); if (!host) return;
  host.innerHTML = `<h2 class="sec">${t('photos.title')}</h2><p class="note">${t('photos.intro')}</p>` + (photos.length ? photos.map(p => { const d = linkedTo(p);
    return figure(p, `<div class="note">${d ? t('photos.linked', { name: esc(d) }) : t('photos.unlinked')}</div>`); }).join('') : `<p class="warn">${t('photos.none')}</p>`);
}

// A photo that fails to load (gallery or popup) is replaced by a short message instead of a broken image.
document.addEventListener('error', e => { const i = e.target; if (i && i.tagName === 'IMG' && i.closest('.photo')) { const p = document.createElement('p'); p.className = 'warn'; p.textContent = t('err.photo'); i.replaceWith(p); } }, true);

export async function initPhotos(app) {
  try {
    const [csv, dr] = await Promise.all([app.getText(FILES.photos), app.getJson(FILES.drills)]);
    const { header, rows } = parseCsv(csv), ix = colIndex(header);
    photos = rows.filter(r => r[ix.file]).map(r => ({ file: r[ix.file], title: r[ix.title], url: r[ix.page_url], credit: r[ix.credit], date: r[ix.acquisition_or_release_date], sol: r[ix.sol] }));
    drillNames = dr.features.map(f => f.properties.name);
  } catch (e) { console.warn('photos', e); }
  renderGallery(); onLangChange(renderGallery);
}
