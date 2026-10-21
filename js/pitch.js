// SVG rendering: static pitch, tokens, ball, ghosts, pass arrows, movement lines.
import { state, F } from './state.js';
import { GHOSTS } from './data/formations.js';
import { playerAt } from './storage.js';
import { t } from './i18n.js';
import { $, el, toVB, PITCH, BALL_OFF } from './util.js';

export const svg = $('pitch');

export function buildStatic() {
  const turf = $('turf');
  el('rect', { x: 6, y: 10, width: 88, height: 140, fill: 'url(#turfGrad)' }, turf);
  for (let i = 0; i < 8; i++) { // subtle grass striping
    el('rect', { x: 6, y: 10 + i * 17.5, width: 88, height: 17.5, fill: i % 2 ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.035)' }, turf);
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
    const tk = el('g', { class: 'token' + (i === 0 ? ' gk' : ''), 'data-slot': i, tabindex: '-1' }, g);
    el('circle', { class: 'ring', r: 6.4 }, tk);
    el('circle', { class: 'glow', r: 4.5, filter: 'url(#glow)' }, tk);
    el('circle', { class: 'body', r: 4.5 }, tk);
    el('text', { class: 'num' }, tk);
    el('rect', { class: 'pill', y: 6.3, height: 4, rx: 2 }, tk);
    el('text', { class: 'nm', y: 8.4 }, tk);
    el('text', { class: 'rl', y: 13 }, tk);
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
    const nm = pl.name, tag = f.tags[i];
    const ini = i === 0 ? tag : pl.name.trim().charAt(0).toUpperCase(); // GK badge shows its role, others an initial
    const [numEl, nmEl, rlEl] = tok.querySelectorAll('text');
    if (numEl.textContent !== ini) numEl.textContent = ini;
    if (nmEl.textContent !== nm) {
      nmEl.textContent = nm;
      const pill = tok.querySelector('.pill'), w = Math.max(9, nm.length * 1.6 + 3.4);
      pill.setAttribute('x', (-w / 2).toFixed(2)); pill.setAttribute('width', w.toFixed(2));
    }
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
    const dx = vb.X - va.X, dy = vb.Y - va.Y, len = Math.hypot(dx, dy), r = len > 11 ? 5.6 : 0; // stop the arrowhead at the token edge
    html += `<line x1="${va.X.toFixed(2)}" y1="${va.Y.toFixed(2)}" x2="${(vb.X - dx / len * r).toFixed(2)}" y2="${(vb.Y - dy / len * r).toFixed(2)}" marker-end="url(#runArrow)" opacity="${op.toFixed(2)}"/>`;
  }
  g.innerHTML = html;
}

export function render() {
  renderTokens(); renderBall(); renderGhosts(); renderArrows(); renderMoves();
}
