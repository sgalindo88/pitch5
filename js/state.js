// Single mutable app state plus the localized current-formation accessor.
import { FORMATIONS, ES_FORMATIONS } from './data/formations.js';
import { getLang } from './i18n.js';

export const state = {
  formationId: 'box',
  phase: 0,
  players: [0, 1, 2, 3, 4].map(() => ({ x: 50, y: 50 })),
  ball: { x: 50, y: 92, att: null, free: false },
  roster: null,
  route: [],
  anim: null, // active phase animation, read by the renderer for movement lines
  ui: { grid: false, snap: false, speed: 1, subFrom: null }
};

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Current formation with text fields localized (positions and pass paths are language-independent).
const locCache = {};
export function F() {
  const lang = getLang();
  const key = lang + state.formationId;
  if (!locCache[key]) {
    const f = FORMATIONS.find(x => x.id === state.formationId), es = lang === 'es' ? ES_FORMATIONS[f.id] : null;
    locCache[key] = !es ? f : Object.assign({}, f, es, { phases: f.phases.map((p, i) => Object.assign({}, p, { text: es.texts[i] })) });
  }
  return locCache[key];
}
