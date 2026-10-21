// Phase animation engine: scripted ball paths, Play/Pause, per-phase transitions.
import { state, F, reducedMotion } from './state.js';
import { GHOST_PASS } from './data/formations.js';
import { render, refPos, ballBase } from './pitch.js';
import { clamp, BALL_OFF } from './util.js';

const PHASE_MS = 1600, GAP_MS = 600;
let queue = [];       // phases still to run during Play
let wait = 0;         // gap timer between queued phases (speed-scaled ms)
let paused = false;
let rafId = 0, lastTs = 0;

// UI refresh hook, registered by main.js (keeps this module independent of the DOM controls).
let onSync = () => {};
export const setSyncHandler = fn => { onSync = fn; };

const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const isActive = () => !!state.anim || queue.length > 0 || wait > 0;
export const isPlaying = () => isActive() && !paused;

export function routeFor(ph) {
  if (ph === 2) return GHOST_PASS.map(i => ({ t: 'g', i }));
  return F().phases[ph].pass.map(i => ({ t: 's', i }));
}

function setPhasePositions(ph) {
  F().phases[ph].pos.forEach((p, i) => { state.players[i].x = p[0]; state.players[i].y = p[1]; });
}

function startAnim(ph) {
  state.phase = ph;
  const route = routeFor(ph);
  const refs = route.slice();
  const att = state.ball.att;
  if (!(att && att.t === route[0].t && att.i === route[0].i)) {
    const b = ballBase();
    // compensate for the attach offset so a dragged (free) ball does not jump
    refs.unshift(state.ball.free ? { t: 'f', x: b.x - BALL_OFF.x, y: b.y - BALL_OFF.y } : { t: 'f', x: b.x, y: b.y });
  }
  const b0 = ballBase();
  state.ball.x = b0.x; state.ball.y = b0.y; state.ball.att = null;
  if (state.ball.free) { state.ball.free = false; state.ball.x -= BALL_OFF.x; state.ball.y -= BALL_OFF.y; }
  state.route = route;
  state.anim = {
    p: 0,
    from: state.players.map(p => ({ x: p.x, y: p.y })),
    to: F().phases[ph].pos.map(p => ({ x: p[0], y: p[1] })),
    refs
  };
  if (reducedMotion) state.anim.p = 1;
  stepAnim();
  kick();
}

function stepAnim() {
  const anim = state.anim, e = ease(Math.min(anim.p, 1));
  for (let i = 0; i < 5; i++) {
    state.players[i].x = anim.from[i].x + (anim.to[i].x - anim.from[i].x) * e;
    state.players[i].y = anim.from[i].y + (anim.to[i].y - anim.from[i].y) * e;
  }
  const segs = anim.refs.length - 1;
  if (segs > 0) {
    const t = Math.min(anim.p, 1) * segs, k = Math.min(Math.floor(t), segs - 1), f = t - k;
    const a = refPos(anim.refs[k]), b = refPos(anim.refs[k + 1]);
    state.ball.x = a.x + (b.x - a.x) * f;
    state.ball.y = a.y + (b.y - a.y) * f;
  }
  if (anim.p >= 1) finishAnim();
}

function finishAnim() {
  state.anim.to.forEach((p, i) => { state.players[i].x = p.x; state.players[i].y = p.y; });
  state.ball.att = state.route[state.route.length - 1];
  state.anim = null;
  if (queue.length) wait = reducedMotion ? 1 : GAP_MS;
  onSync();
}

function tick(ts) {
  const dt = clamp(ts - lastTs, 0, 100);
  lastTs = ts;
  if (!paused) {
    if (state.anim) {
      state.anim.p += dt * state.ui.speed / PHASE_MS;
      stepAnim();
    } else if (wait > 0) {
      wait -= dt * state.ui.speed;
      if (wait <= 0) { wait = 0; startAnim(queue.shift()); }
    }
  }
  render();
  if (isActive()) rafId = requestAnimationFrame(tick); else { rafId = 0; onSync(); }
}
function kick() {
  onSync();
  if (!rafId) { lastTs = performance.now(); rafId = requestAnimationFrame(tick); }
}

export function cancelAnim() {
  if (state.anim) {
    const b = ballBase();
    state.ball.x = b.x; state.ball.y = b.y; state.ball.att = null;
  }
  state.anim = null; queue = []; wait = 0; paused = false;
}

export function goPhase(ph) { cancelAnim(); startAnim(ph); }

export function play() {
  if (paused && isActive()) { paused = false; kick(); return; }
  if (isActive()) return;
  cancelAnim();
  queue = [1, 2];
  startAnim(0);
}
export function pause() { if (isActive()) { paused = true; onSync(); } }

export function resetPositions() {
  cancelAnim();
  setPhasePositions(state.phase);
  state.route = routeFor(state.phase);
  state.ball.att = state.route[0];
  state.ball.free = false;
  render(); onSync();
}
