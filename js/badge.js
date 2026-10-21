// Free-plan Netlify injects a fixed "Powered by Netlify" iframe in the bottom-right corner.
// When it shows up, reserve its height (--badge-space) so it never covers the controls.
const ID = 'nl-badge-frame';

function reserve(frame) {
  const h = Math.max(0, Math.round(frame.getBoundingClientRect().height) - 8); // the pill sits inside the iframe's own margin
  document.documentElement.style.setProperty('--badge-space', h + 'px');
}

export function initBadgeSpace() {
  const found = document.getElementById(ID);
  if (found) return reserve(found);
  const mo = new MutationObserver(() => {
    const f = document.getElementById(ID);
    if (f) { mo.disconnect(); reserve(f); }
  });
  mo.observe(document.body, { childList: true });
  setTimeout(() => mo.disconnect(), 30000); // not on this host: stop watching
}
