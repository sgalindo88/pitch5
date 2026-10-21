// Language selection and string lookup.
import { STR } from './data/strings.js';

const LANG_KEY = 'pitch5.lang';
let lang = 'en';
try { const s = localStorage.getItem(LANG_KEY); if (s === 'es' || s === 'en') lang = s; } catch (e) { /* ignore */ }

export const getLang = () => lang;
export function toggleLang() {
  lang = lang === 'en' ? 'es' : 'en';
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
}
export const t = (key, vars) => (STR[lang][key] || STR.en[key] || key).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
export const phaseName = i => t('ph' + i);
