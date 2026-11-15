// Splices extra dictionary lines into js/i18n.js: node scripts/splice_i18n.mjs <en-file> <tr-file>
import fs from 'node:fs';
const [enF, trF] = process.argv.slice(2);
let t = fs.readFileSync('js/i18n.js', 'utf8');
const enAdd = fs.readFileSync(enF, 'utf8'), trAdd = fs.readFileSync(trF, 'utf8');
const lines = t.split('\n');
const idx = lines.map((l, i) => l.startsWith("    'err.data':") ? i : -1).filter(i => i >= 0);
if (idx.length !== 2) throw new Error('expected two err.data lines, got ' + idx.length);
lines.splice(idx[1], 0, trAdd.replace(/\n$/, ''));
lines.splice(idx[0], 0, enAdd.replace(/\n$/, ''));
fs.writeFileSync('js/i18n.js', lines.join('\n'));
console.log('spliced');
