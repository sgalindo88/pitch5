// Pointer-event dragging for tokens and ball (mouse + touch share one code path).
import { state } from './state.js';
import { svg, render, ballBase } from './pitch.js';
import { isActive, isPlaying, cancelAnim } from './animation.js';
import { doSub } from './roster.js';
import { syncUI } from './controls.js';
import { clamp, PITCH, BALL_OFF } from './util.js';

let drag = null;

function pointerPct(e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const m = svg.getScreenCTM();
  if (!m) return { x: 50, y: 50 };
  const p = pt.matrixTransform(m.inverse());
  return { x: (p.x - PITCH.x0) * 100 / PITCH.w, y: (p.y - PITCH.y0) * 100 / PITCH.h };
}
const snap = v => state.ui.snap ? Math.round(v / 5) * 5 : v;

function endDrag() {
  if (!drag) return;
  const d = drag; drag = null;
  if (d.el) d.el.classList.remove('dragging');
  if (d.kind === 'player' && !d.moved && state.ui.subFrom != null) doSub(d.slot);
  render();
}

export function initInput() {
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isPlaying()) return;
    const ballEl = e.target.closest('[data-ball]');
    const tok = e.target.closest('[data-slot]');
    if (!ballEl && !tok) return;
    if (isActive()) cancelAnim(); // dragging while paused discards the paused animation
    const pos = pointerPct(e);
    if (ballEl) {
      const b = ballBase(), disp = state.ball.free ? b : { x: b.x + BALL_OFF.x, y: b.y + BALL_OFF.y };
      state.ball.x = disp.x; state.ball.y = disp.y; state.ball.att = null; state.ball.free = true;
      drag = { kind: 'ball', dx: disp.x - pos.x, dy: disp.y - pos.y, moved: false, sx: pos.x, sy: pos.y };
    } else {
      const i = +tok.dataset.slot, p = state.players[i];
      drag = { kind: 'player', slot: i, el: tok, dx: p.x - pos.x, dy: p.y - pos.y, moved: false, sx: pos.x, sy: pos.y };
      tok.classList.add('dragging');
    }
    svg.setPointerCapture(e.pointerId);
    e.preventDefault();
    render(); syncUI();
  });

  svg.addEventListener('pointermove', e => {
    if (!drag) return;
    const pos = pointerPct(e);
    if (Math.hypot(pos.x - drag.sx, pos.y - drag.sy) > 1) drag.moved = true;
    const nx = clamp(snap(pos.x + drag.dx), 0, 100), ny = clamp(snap(pos.y + drag.dy), 0, 100);
    if (drag.kind === 'ball') { state.ball.x = nx; state.ball.y = ny; }
    else { state.players[drag.slot].x = nx; state.players[drag.slot].y = ny; }
    render();
  });

  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
}
