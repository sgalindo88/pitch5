// SVG rendering: static pitch, tokens, ball, ghosts, pass arrows, movement lines.
import { state, F } from './state.js';
import { GHOSTS } from './data/formations.js';
import { playerAt } from './storage.js';
import { t } from './i18n.js';
import { $, el, toVB, PITCH, BALL_OFF } from './util.js';

export const svg = $('pitch');

export function buildStatic() {
  const turf = $('turf');
  for (let i = 0; i < 8; i++) {
    el('rect', { x: 6, y: 10 + i * 17.5, width: 88, height: 17.5, fill: i % 2 ? '#166534' : '#15803d' }, turf);
  }
  const grid = $('grid');
  for (let i = 1; i < 10; i++) { const x = PITCH.x0 + i * PITCH.w / 10; el('line', { x1: x, y1: 10, x2: x, y2: 150 }, grid); }
  for (let j = 1; j < 16; j++) { const y = PITCH.y0 + j * PITCH.h / 16; el('line', { x1: 6, y1: y, x2: 94, y2: y }, grid); }
  GHOSTS.forEach((g, i) => {
    const v = toVB({ x: g[0], y: g[1] });
    el('circle', { class: 'ghost', cx: v.X, cy: v.Y, r: 4.2, 'data-ghost': i }, $('ghosts'));
  });
}

export function buildTokens() {
  const g = $('tokens');
  g.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const tk = el('g', { class: 'token', 'data-slot': i, tabindex: '-1' }, g);
    el('circle', { class: 'ring', r: 6.4 }, tk);
    el('circle', { class: 'body', r: 4.5, fill: i === 0 ? '#d97706' : '#2563eb' }, tk);
    el('text', { class: 'num' }, tk);
    el('text', { class: 'nm', y: 8.2 }, tk);
    el('text', { class: 'rl', y: 10.8 }, tk);
  }
}

// Position of a route/ball reference: s = our slot, g = ghost, anything else is a raw point.
export function refPos(r) {
  if (r.t === 's') return state.players[r.i];
  if (r.t === 'g') return { x: GHOSTS[r.i][0], y: GHOSTS[r.i][1] };
  return r;
}

function renderTokens() {
  const f = F();
  const toks = $('tokens').children;
  for (let i = 0; i < 5; i++) {
    const tok = toks[i], p = state.players[i], v = toVB(p), pl = playerAt(i);
    tok.setAttribute('transform', `translate(${v.X.toFixed(2)} ${v.Y.toFixed(2)})`);
    const nm = pl.name, ini = pl.name.trim().charAt(0).toUpperCase(), tag = f.tags[i];
    const [numEl, nmEl, rlEl] = tok.querySelectorAll('text');
    if (numEl.textContent !== ini) numEl.textContent = ini;
    if (nmEl.textContent !== nm) nmEl.textContent = nm;
    if (rlEl.textContent !== tag) rlEl.textContent = tag;
    const label = t('tokenAria', { name: pl.name, role: f.roles[i] });
    if (tok.getAttribute('aria-label') !== label) tok.setAttribute('aria-label', label);
  }
}

export const ballBase = () => state.ball.att ? refPos(state.ball.att) : state.ball;

function renderBall() {
  const b = ballBase();
  const p = state.ball.free ? b : { x: b.x + BALL_OFF.x, y: b.y + BALL_OFF.y };
  const v = toVB(p);
  $('ball').setAttribute('transform', `translate(${v.X.toFixed(2)} ${v.Y.toFixed(2)})`);
}

function renderGhosts() {
  const on = state.phase === 2;
  $('ghosts').querySelectorAll('.ghost').forEach(g => g.classList.toggle('on', on));
}

function renderArrows() {
  const g = $('arrows');
  let html = '';
  for (let k = 0; k < state.route.length - 1; k++) {
    const a = toVB(refPos(state.route[k])), b = toVB(refPos(state.route[k + 1]));
    const dx = b.X - a.X, dy = b.Y - a.Y, len = Math.hypot(dx, dy);
    if (len < 11) continue;
    const ux = dx / len, uy = dy / len, r = 5.4;
    html += `<line x1="${(a.X + ux * r).toFixed(2)}" y1="${(a.Y + uy * r).toFixed(2)}" x2="${(b.X - ux * r).toFixed(2)}" y2="${(b.Y - uy * r).toFixed(2)}" marker-end="url(#arrow)"/>`;
  }
  g.innerHTML = html;
}

function renderMoves() {
  const g = $('moves'), anim = state.anim;
  if (!anim) { g.innerHTML = ''; return; }
  const op = anim.p < 0.7 ? 0.85 : 0.85 * (1 - (anim.p - 0.7) / 0.3);
  let html = '';
  for (let i = 0; i < 5; i++) {
    const a = anim.from[i], b = anim.to[i];
    if (Math.hypot(a.x - b.x, a.y - b.y) <= 2) continue;
    const va = toVB(a), vb = toVB(b);
    html += `<line x1="${va.X.toFixed(2)}" y1="${va.Y.toFixed(2)}" x2="${vb.X.toFixed(2)}" y2="${vb.Y.toFixed(2)}" opacity="${op.toFixed(2)}"/>`;
  }
  g.innerHTML = html;
}

export function render() {
  renderTokens(); renderBall(); renderGhosts(); renderArrows(); renderMoves();
}
