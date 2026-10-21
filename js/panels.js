// Side panel: formation info, phase guide, tabs.
import { state, F } from './state.js';
import { FORMATIONS, ES_FORMATIONS } from './data/formations.js';
import { cancelAnim, goPhase, resetPositions } from './animation.js';
import { renderRoster } from './roster.js';
import { t, phaseName, getLang } from './i18n.js';
import { $, esc } from './util.js';

const list = a => a.map(x => `<li>${esc(x)}</li>`).join('');

export function renderFormationPanel() {
  const f = F(), es = getLang() === 'es';
  $('panel-formation').innerHTML = `
    <label for="formationSel" class="chip" style="display:inline-block;margin-bottom:6px">${t('formation')}</label>
    <select id="formationSel" class="btn formation-select">
      ${FORMATIONS.map(x => `<option value="${x.id}"${x.id === f.id ? ' selected' : ''}>${esc(es ? ES_FORMATIONS[x.id].name : x.name)}</option>`).join('')}
    </select>
    <h3>${t('overview')}</h3><p style="margin:0">${esc(f.overview)}</p>
    <h3>${t('positions')}</h3><div class="roles">${f.roles.map(r => `<span class="chip">${esc(r)}</span>`).join('')}</div>
    <h3>${t('pros')}</h3><ul class="pros">${list(f.pros)}</ul>
    <h3>${t('cons')}</h3><ul class="cons">${list(f.cons)}</ul>
    <h3>${t('responsibilities')}</h3><ul>${list(f.responsibilities)}</ul>`;
  $('formationSel').addEventListener('change', e => setFormation(e.target.value));
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
    if (b) goPhase(+b.dataset.phase);
  });
  TABS.forEach((n, i) => {
    $('tab-' + n).addEventListener('click', () => selectTab(n));
    $('tab-' + n).addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      selectTab(TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length], true);
    });
  });
}
