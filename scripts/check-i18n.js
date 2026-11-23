const ar = require('../src/i18n/locales/ar.json');
const en = require('../src/i18n/locales/en.json');

function keys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

const a = new Set(keys(ar));
const e = new Set(keys(en));

const missingEn = [...a].filter((k) => !e.has(k));
const missingAr = [...e].filter((k) => !a.has(k));

if (!missingEn.length && !missingAr.length) {
  console.log(`✅ اللغتين متطابقين (${a.size} مفتاح)`);
} else {
  if (missingEn.length) console.log('❌ ناقص بـ en.json:\n  ' + missingEn.join('\n  '));
  if (missingAr.length) console.log('❌ ناقص بـ ar.json:\n  ' + missingAr.join('\n  '));
  process.exit(1);
}