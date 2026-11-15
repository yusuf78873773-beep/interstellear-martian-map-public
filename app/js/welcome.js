// Opening card: 3 steps, dismissible (remembered in localStorage when available).
import { t, onLangChange } from './i18n.js';

const KEY = 'welcomeSeen';
const seen = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const remember = () => { try { localStorage.setItem(KEY, '1'); } catch { /* private mode: the card just shows again */ } };

export function initWelcome() {
  if (seen()) return;
  const host = document.querySelector('.main'); if (!host) return;
  const card = document.createElement('div'); card.id = 'welcome'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'welcomeTitle');
  const close = () => { remember(); card.remove(); };
  const fill = () => {
    card.innerHTML = `<button type="button" class="close" aria-label="${t('btn.close')}">✕</button><h2 id="welcomeTitle">${t('welcome.title')}</h2><ol>` +
      [1, 2, 3].map(n => `<li><b>${t('welcome.s' + n + '.h')}</b> ${t('welcome.s' + n)}</li>`).join('') + `</ol><p class="note">${t('welcome.note')}</p><button type="button" class="primary" id="welcomeGo">${t('welcome.go')}</button>`;
    card.querySelector('.close').addEventListener('click', close); card.querySelector('#welcomeGo').addEventListener('click', close);
  };
  card.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  fill(); host.appendChild(card); onLangChange(() => { if (card.isConnected) fill(); }); card.querySelector('#welcomeGo').focus();
}
