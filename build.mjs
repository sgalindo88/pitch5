// Production build: bundle the ES modules into one hashed file, inline the CSS and favicon into index.html.
// Result in dist/: index.html + assets/app.<hash>.js  (2 requests per first visit, 1 on repeat visits).
import { build, transform } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { basename } from 'node:path';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });

const js = await build({
  entryPoints: ['js/main.js'], bundle: true, minify: true, format: 'iife', target: ['es2020', 'safari15', 'chrome90', 'firefox90'],
  outdir: 'dist/assets', entryNames: 'app.[hash]', metafile: true, logLevel: 'warning'
});
const jsFile = basename(Object.keys(js.metafile.outputs).find(f => f.endsWith('.js')));

const css = (await transform(readFileSync('css/styles.css', 'utf8'), { loader: 'css', minify: true })).code.trim();
const icon = 'data:image/svg+xml,' + encodeURIComponent(readFileSync('assets/favicon.svg', 'utf8').trim());

let html = readFileSync('index.html', 'utf8');
const swap = (from, to) => { if (!html.includes(from)) throw new Error('index.html is missing: ' + from); html = html.replace(from, () => to); };
swap('<link rel="stylesheet" href="css/styles.css">', `<style>${css}</style>`);
swap('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">', `<link rel="icon" href="${icon}" type="image/svg+xml">`);
swap('<script type="module" src="js/main.js"></script>', `<script defer src="assets/${jsFile}"></script>`);
writeFileSync('dist/index.html', html);

console.log(`dist/index.html ${(html.length / 1024).toFixed(1)} KB, dist/assets/${jsFile}`);
