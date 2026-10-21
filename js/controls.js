// Control bar, language switch, keyboard shortcuts, UI sync.
import { state } from './state.js';
import { goPhase, play, pause, resetPositions, isPlaying } from './animation.js';
import { render } from './pitch.js';
import { renderFormationPanel, renderGuide } from './panels.js';
import { renderRoster, cancelSub } from './roster.js';
import { t, phaseName, getLang, toggleLang } from './i18n.js';
import { $ } from './util.js';

const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  snap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15V5a2 2 0 0 1 4 0v10a2 2 0 0 0 4 0V5a2 2 0 0 1 4 0v10a6 6 0 0 1-12 0z"/><path d="M6 8h4M14 8h4"/></svg>'
};

function buildControls() {
  $('phaseBtns').innerHTML = [0, 1, 2].map(i =>
    `<button class="btn" type="button" data-phase="${i}" aria-pressed="false">${i + 1} ${phaseName(i)}</button>`).join('');
  $('btnPlay').innerHTML = ICON.play + t('play');
  $('btnPause').innerHTML = ICON.pause + t('pause');
  $('btnReset').innerHTML = ICON.reset + t('reset');
  $('btnGrid').innerHTML = ICON.grid + t('grid');
  $('btnSnap').innerHTML = ICON.snap + t('snap');
}

// Translate everything on the page for the current language.
export function applyLang() {
  document.documentElement.lang = getLang();
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.i18nAria)); });
  $('btnLang').textContent = t('langBtn');
  $('btnLang').setAttribute('aria-label', t('langAria'));
  buildControls();
  renderFormationPanel(); renderGuide(); renderRoster();
  syncUI(); render();
}

export function syncUI() {
  $('phaseBtns').querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === state.phase));
  $('btnPlay').disabled = isPlaying();
  $('btnPause').disabled = !isPlaying();
  $('btnGrid').setAttribute('aria-pressed', state.ui.grid);
  $('btnSnap').setAttribute('aria-pressed', state.ui.snap);
  $('grid').style.display = state.ui.grid ? '' : 'none';
  document.querySelectorAll('#panel-guide .step').forEach((s, i) => {
    if (i === state.phase) s.setAttribute('aria-current', 'true'); else s.removeAttribute('aria-current');
  });
}

export function initControls() {
  $('btnLang').addEventListener('click', () => { toggleLang(); applyLang(); });
  $('phaseBtns').addEventListener('click', e => {
    const b = e.target.closest('[data-phase]');
    if (b) goPhase(+b.dataset.phase);
  });
  $('btnPlay').addEventListener('click', play);
  $('btnPause').addEventListener('click', pause);
  $('btnReset').addEventListener('click', resetPositions);
  $('speed').addEventListener('change', e => { state.ui.speed = +e.target.value; });
  $('btnGrid').addEventListener('click', () => { state.ui.grid = !state.ui.grid; syncUI(); });
  $('btnSnap').addEventListener('click', () => { state.ui.snap = !state.ui.snap; syncUI(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') return cancelSub();
    if (e.key === ' ' && !e.target.closest('input, select, textarea, button')) {
      e.preventDefault();
      if (isPlaying()) pause(); else play();
    }
  });
}
