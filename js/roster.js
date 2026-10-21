// Roster tab: inline editing, substitutions, reset.
import { state, F } from './state.js';
import { saveRoster, presetRoster } from './storage.js';
import { render } from './pitch.js';
import { t } from './i18n.js';
import { $, esc } from './util.js';

function rosterMsg(text, ok) {
  const m = $('rosterMsg');
  if (!m) return;
  m.textContent = text;
  m.style.color = ok ? 'var(--accent)' : 'var(--amber)';
}

export function startSub(id) {
  state.ui.subFrom = state.ui.subFrom === id ? null : id;
  document.body.classList.toggle('subbing', state.ui.subFrom != null);
  renderRoster();
}
export function cancelSub() {
  if (state.ui.subFrom == null) return;
  state.ui.subFrom = null;
  document.body.classList.remove('subbing');
  renderRoster();
}
// The incoming player takes the outgoing player's slot (and therefore position).
export function doSub(slot) {
  const r = state.roster, bi = r.bench.indexOf(state.ui.subFrom);
  if (bi < 0) return cancelSub();
  const out = r.onPitch[slot];
  r.onPitch[slot] = state.ui.subFrom;
  r.bench[bi] = out;
  state.ui.subFrom = null;
  document.body.classList.remove('subbing');
  saveRoster(); renderRoster(); render();
  rosterMsg(t('subDone', { in: r.byId[r.onPitch[slot]].name, out: r.byId[out].name }), true);
}

function rosterRow(id, label, isBench) {
  const p = state.roster.byId[id], sub = state.ui.subFrom;
  const selectable = !isBench && sub != null;
  const picked = isBench && sub === id;
  return `<div class="row${selectable ? ' selectable' : ''}${picked ? ' picked' : ''}" data-id="${id}"${selectable ? ` data-takeoff="${state.roster.onPitch.indexOf(id)}"` : ''}>
    <span class="role" title="${esc(label)}">${esc(label)}</span>
    <input class="num" data-id="${id}" data-field="number" value="${p.number}" inputmode="numeric" maxlength="2" aria-label="${esc(t('numAria', { name: p.name }))}">
    <input data-id="${id}" data-field="name" value="${esc(p.name)}" maxlength="14" aria-label="${esc(t('nameAria', { label }))}">
    ${isBench ? `<button class="btn" type="button" data-sub="${id}" aria-pressed="${picked}">${picked ? t('cancel') : t('sub')}</button>`
      : selectable ? `<button class="btn" type="button" data-takeoff="${state.roster.onPitch.indexOf(id)}">${t('takeOff')}</button>` : '<span></span>'}
  </div>`;
}

export function renderRoster() {
  const r = state.roster, f = F();
  $('panel-roster').innerHTML = `
    <div id="rosterMsg" role="status" aria-live="polite"></div>
    ${state.ui.subFrom != null ? `<p class="hint">${t('subHint')}</p>` : ''}
    <h3>${t('onPitch')}</h3>${r.onPitch.map((id, i) => rosterRow(id, f.roles[i], false)).join('')}
    <h3>${t('bench')}</h3>${r.bench.map((id, i) => rosterRow(id, t('subN', { n: i + 1 }), true)).join('')}
    <div style="margin-top:12px"><button class="btn" id="btnResetRoster" type="button">${t('resetRoster')}</button></div>`;
}

export function initRoster() {
  const panel = $('panel-roster');
  panel.addEventListener('change', e => {
    const inp = e.target.closest('input[data-field]');
    if (!inp) return;
    const id = inp.dataset.id, p = state.roster.byId[id], v = inp.value.trim();
    if (inp.dataset.field === 'name') {
      if (!v || v.length > 14) { inp.value = p.name; return rosterMsg(t('msgName')); }
      p.name = v;
    } else {
      const n = Number(v);
      if (!/^\d{1,2}$/.test(v) || n > 99) { inp.value = p.number; return rosterMsg(t('msgNumber')); }
      const clash = Object.keys(state.roster.byId).some(k => k !== id && state.roster.byId[k].number === n);
      if (clash) { inp.value = p.number; return rosterMsg(t('msgTaken', { n })); }
      p.number = n;
    }
    rosterMsg(t('saved'), true);
    saveRoster(); render();
  });

  panel.addEventListener('click', e => {
    const subBtn = e.target.closest('[data-sub]');
    if (subBtn) return startSub(+subBtn.dataset.sub);
    if (e.target.closest('#btnResetRoster')) {
      state.roster = presetRoster();
      cancelSub(); saveRoster(); renderRoster(); render();
      return rosterMsg(t('rosterReset'), true);
    }
    if (e.target.closest('input')) return;
    const row = e.target.closest('[data-takeoff]');
    if (row && state.ui.subFrom != null) doSub(+row.dataset.takeoff);
  });
}
