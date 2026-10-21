# Pitch5 — 5v5 Tactics Board

Static web app. Vanilla JS (native ES modules), inline SVG, no build step, no dependencies, no network calls.

## Run locally

ES modules are blocked on `file://`, so serve the folder:

```sh
npm run dev        # or: python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html           markup only
css/styles.css       all styles
assets/favicon.svg
js/
  main.js            boot + wiring
  state.js           app state, localized formation accessor
  util.js            DOM/SVG helpers, pitch geometry
  i18n.js            language + string lookup
  storage.js         roster persistence (localStorage)
  pitch.js           SVG rendering
  animation.js       phase animation + ball paths + play/pause
  input.js           pointer-event dragging
  controls.js        control bar, language switch, shortcuts
  panels.js          formation panel, phase guide, tabs
  roster.js          roster editing + substitutions
  data/
    formations.js    formations, ES translations, ghosts
    roster.js        preset roster
    strings.js       UI strings (EN/ES)
```

## Deploy (free hosting)

The site root is this folder; there is nothing to build.

- **GitHub Pages**: push, then Settings → Pages → deploy from branch, `/ (root)`. `.nojekyll` is included. Paths are relative, so project-subpath URLs work.
- **Cloudflare Pages**: build command empty, output directory `/`.
- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repo with no build command and publish directory `.`.
