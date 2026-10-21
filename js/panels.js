// Side panel: formation info, phase guide, tabs.
import { state, F } from './state.js';
import { FORMATIONS, SHORT_NAMES } from './data/formations.js';
import { cancelAnim, goPhase, resetPositions } from './animation.js';
import { renderRoster } from './roster.js';
import { t, phaseName, getLang } from './i18n.js';
import { $, esc } from './util.js';

const list = a => a.map(x => `<li>${esc(x)}</li>`).join('');

// --- Mobile bottom sheet: the tab panel slides up over the pitch on narrow screens ---
const narrow = window.matchMedia('(max-width: 900px)');

function updateSheetToggle() {
  $('btnSheet').innerHTML = `<span class="st-name">${esc(SHORT_NAMES[getLang()][state.formationId])}</span>`
    + `<span class="st-act">${esc(t('tactics'))}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></span>`;
}
export function openSheet() {
  if (!narrow.matches) return;
  document.body.classList.add('sheet-open');
  $('btnSheet').setAttribute('aria-expanded', 'true');
  $('btnSheetClose').focus();
}
export function closeSheet(restoreFocus = true) {
  if (!document.body.classList.contains('sheet-open')) return;
  document.body.classList.remove('sheet-open');
  $('btnSheet').setAttribute('aria-expanded', 'false');
  if (restoreFocus) $('btnSheet').focus();
}

export function renderFormationPanel() {
  const f = F(), names = SHORT_NAMES[getLang()];
  updateSheetToggle();
  $('panel-formation').innerHTML = `
    <h3>${t('formation')}</h3>
    <div class="pills" role="group" aria-label="${esc(t('formation'))}">
      ${FORMATIONS.map(x => `<button class="pill-btn" type="button" data-formation="${x.id}" aria-pressed="${x.id === f.id}">${esc(names[x.id])}</button>`).join('')}
    </div>
    <h3>${t('overview')}</h3><p style="margin:0">${esc(f.overview)}</p>
    <h3 class="h-pos">${t('positions')}</h3><div class="roles">${f.roles.map(r => `<span class="chip">${esc(r)}</span>`).join('')}</div>
    <div class="pc">
      <div><h3>${t('pros')}</h3><ul class="pros">${list(f.pros)}</ul></div>
      <div><h3>${t('cons')}</h3><ul class="cons">${list(f.cons)}</ul></div>
    </div>
    <h3>${t('responsibilities')}</h3><ul>${list(f.responsibilities)}</ul>`;
  $('panel-formation').querySelectorAll('[data-formation]').forEach(b => b.addEventListener('click', () => setFormation(b.dataset.formation)));
}

export function renderGuide() {
  const f = F();
  $('panel-guide').innerHTML = `<h3>${esc(f.name)}</h3><ol class="steps">` + f.phases.map((p, i) => `
    <li><button class="step" type="button" data-phase="${i}"${i === state.phase ? ' aria-current="true"' : ''}>
      <b>${i + 1}. ${phaseName(i)}</b><small>${esc(p.text)}</small></button></li>`).join('') + '</ol>';
}

export function setFormation(id) {
  cancelAnim();
  state.formationId = id;
  state.phase = 0;
  resetPositions();
  renderFormationPanel(); renderGuide(); renderRoster();
}

const TABS = ['formation', 'roster', 'guide'];
export function selectTab(name, focus) {
  TABS.forEach(n => {
    const sel = n === name;
    $('tab-' + n).setAttribute('aria-selected', sel);
    $('tab-' + n).tabIndex = sel ? 0 : -1;
    $('panel-' + n).hidden = !sel;
  });
  if (focus) $('tab-' + name).focus();
}

export function initPanels() {
  $('panel-guide').addEventListener('click', e => {
    const b = e.target.closest('[data-phase]');
    if (b) { goPhase(+b.dataset.phase); closeSheet(false); } // reveal the pitch so the animation is visible
  });
  $('btnSheet').addEventListener('click', () => (document.body.classList.contains('sheet-open') ? closeSheet() : openSheet()));
  $('btnSheetClose').addEventListener('click', () => closeSheet());
  $('sheetBackdrop').addEventListener('click', () => closeSheet());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  narrow.addEventListener('change', () => closeSheet(false));
  TABS.forEach((n, i) => {
    $('tab-' + n).addEventListener('click', () => selectTab(n));
    $('tab-' + n).addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      selectTab(TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length], true);
    });
  });
}
