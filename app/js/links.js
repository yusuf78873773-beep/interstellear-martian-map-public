// Escapes text and turns http(s) URLs into links (used for manifest sources in the info dialog and About).
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function linkify(text) {
  return esc(text).replace(/https?:\/\/[^\s)<]+/g, u => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
}
export const urlsOf = text => (String(text ?? '').match(/https?:\/\/[^\s)<]+/g) || []);
