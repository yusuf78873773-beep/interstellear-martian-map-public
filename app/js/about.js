// M6: "About & limits" dialog (attributions, known limits, AI statement). Content lives in the i18n dictionary.
import { t, onLangChange } from './i18n.js';
import { computeStory } from './planner-ui.js';
import { linkify, urlsOf } from './links.js';

let appRef = null;
// All source links of data/MANIFEST.csv (via manifest.json), grouped by data folder; entries without a URL are listed as derived by the team.
function sourcesHtml() {
  const m = appRef?.manifest || {}, byFolder = new Map(), derived = new Set();
  for (const [key, v] of Object.entries(m)) { const folder = key.split('/').slice(0, 2).join('/'); const urls = urlsOf(v.source); if (!urls.length) { derived.add(folder); continue; } if (!byFolder.has(folder)) byFolder.set(folder, new Set()); urls.forEach(u => byFolder.get(folder).add(u)); }
  if (!byFolder.size) return `<p class="note">${t('about.src.none')}</p>`;
  return '<ul class="src">' + [...byFolder].map(([f, set]) => `<li><b>${f}</b>: ${[...set].map(u => linkify(u)).join('; ')}</li>`).join('') + '</ul>' + `<p class="note">${t('about.src.derived', { n: derived.size })}</p>`;
}

const f1 = v => (+v).toFixed(1).replace(/.0$/, '');
function storyHtml(st) {
  if (st === 'wait') return `<p class="note">${t('about.story.computing')}</p>`; if (!st) return `<p class="warn">${t('about.story.failed')}</p>`;
  const d = { footKm: f1(st.footKm), footOneWayH: f1(st.footOneWayH), footRoundH: f1(st.footRoundH), limitH: f1(st.limitH), driveKm: f1(st.driveKm), driveH: f1(st.driveH), walkKm: f1(st.walkKm), walkRoundH: f1(st.walkRoundH), standoff: st.standoff, vehKmh: st.vehKmh };
  return `<p>${t(st.footOk ? 'about.story.footOk' : 'about.story.foot', d)}</p><p>${t(st.hybridOk ? 'about.story.hybrid' : 'about.story.hybridBad', d)}</p><p class="note">${t('about.story.note')}</p>`;
}

let story = 'wait';
function html() {
  const items = (prefix, n) => `<ul>${Array.from({ length: n }, (_, i) => `<li>${t(prefix + (i + 1))}</li>`).join('')}</ul>`;
  return `<button class="close" type="button" aria-label="${t('btn.close')}">✕</button><h2 id="aboutTitle">${t('about.title')}</h2><p>${t('about.what')}</p>` +
    `<p class="note">${t('about.honesty')}</p><h3>${t('about.story.title')}</h3><div id="aboutStory">${storyHtml(story)}</div><h3>${t('about.req.title')}</h3>${items('about.req.', 4)}<h3>${t('about.limits.title')}</h3>${items('about.limit.', 11)}<h3>${t('about.attr.title')}</h3>${items('about.attr.', 7)}` +
    `<h3>${t('about.src.title')}</h3>${sourcesHtml()}<h3>${t('about.ai.title')}</h3><p>${t('about.ai')}</p>`;
}

export function initAbout(app) {
  appRef = app;
  const dlg = document.getElementById('aboutDlg'), btn = document.getElementById('aboutBtn');
  const fill = () => { dlg.innerHTML = html(); dlg.querySelector('.close').addEventListener('click', () => dlg.close()); };
  btn.addEventListener('click', () => { fill(); dlg.showModal(); if (story === 'wait') computeStory().then(r => { story = r; if (dlg.open) fill(); }).catch(e => { console.error(e); story = null; if (dlg.open) fill(); }); });
  onLangChange(() => { if (dlg.open) fill(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); }); // click on backdrop
}
