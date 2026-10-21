// Small shared helpers: DOM lookup, SVG element factory, escaping, geometry.
export const $ = id => document.getElementById(id);
export const NS = 'http://www.w3.org/2000/svg';

export function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Pitch rectangle inside the 100x160 viewBox; positions elsewhere are percentages of it.
export const PITCH = { x0: 6, w: 88, y0: 10, h: 140 };
export const toVB = p => ({ X: PITCH.x0 + p.x * PITCH.w / 100, Y: PITCH.y0 + p.y * PITCH.h / 100 });
// Percent offset so an attached ball sits beside its player.
export const BALL_OFF = { x: 5, y: 2.5 };
