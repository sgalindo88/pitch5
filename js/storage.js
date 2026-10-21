// Roster persistence (localStorage, always guarded).
import { PRESET_ROSTER } from './data/roster.js';
import { state } from './state.js';

const STORE_KEY = 'pitch5.roster.v2';

function validRoster(r) {
  try {
    if (!r || r.onPitch.length !== 5 || r.bench.length !== 5) return false;
    const ids = [...r.onPitch, ...r.bench].map(Number).sort((a, b) => a - b);
    if (ids.join() !== '1,2,3,4,5,6,7,8,9,10') return false;
    for (const id of ids) {
      const p = r.byId[id];
      if (!p || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 14) return false;
    }
    return true;
  } catch (e) { return false; }
}

export const presetRoster = () => JSON.parse(JSON.stringify(PRESET_ROSTER));

export function loadRoster() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const r = JSON.parse(raw); if (validRoster(r)) return r; }
  } catch (e) { /* storage unavailable */ }
  return presetRoster();
}
export function saveRoster() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state.roster)); } catch (e) { /* ignore */ }
}
export const playerAt = slot => state.roster.byId[state.roster.onPitch[slot]];
