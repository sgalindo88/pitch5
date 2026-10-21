# Pitch5 — 5v5 Tactics Board

Static web app. Vanilla JS (native ES modules) and inline SVG. The source runs as-is in a browser; a small esbuild step bundles it for production.

## Run locally

ES modules are blocked on `file://`, so serve the folder (unbundled source, no install needed):

```sh
npm run dev        # or: python3 -m http.server 8000
# open http://localhost:8000
```

## Production build

```sh
npm install        # once (esbuild is the only dependency)
npm run build      # writes dist/: index.html (CSS + favicon inlined) + assets/app.<hash>.js
npm run preview    # serve dist/ locally on :8000
```

This takes a first visit from 17 requests to 2, and repeat visits to 1: the hashed JS is cached as immutable (see `netlify.toml`).

## Structure

```
index.html           markup only (source)
build.mjs            production bundler (esbuild)
netlify.toml         Netlify build + cache headers
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

`netlify.toml` already sets the build command (`npm run build`) and publish directory (`dist`).

- **Netlify**: connect the repo; no settings needed (`netlify.toml` overrides the UI). Drag-and-drop deploys must upload the `dist/` folder after `npm run build`.
- **Cloudflare Pages**: build command `npm run build`, output directory `dist`. (`netlify.toml` headers don't apply; add a `_headers` file in `dist/` if you want the same caching.)
- **GitHub Pages**: publish the contents of `dist/` (for example with a workflow that runs the build).
