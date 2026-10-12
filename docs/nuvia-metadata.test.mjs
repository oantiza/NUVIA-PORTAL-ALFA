import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { PUBLICAS, EXCLUIDAS_SITEMAP, BASE_URL } from '../scripts/paginas.mjs';

const root = resolve(process.argv[2] || '.');
const base = BASE_URL;
const socialImage = `${base}src/assets/social/nuvia-social-card-2026-v1.webp`;
/* Títulos y páginas públicas: scripts/paginas.mjs (registro único). */
const pages = new Map(PUBLICAS.map((p) => [p.archivo, p.titulo]));

const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, pages.size, 'El sitemap contiene una URL por página canónica');
assert.equal(new Set(urls).size, urls.length, 'El sitemap no contiene duplicados');

for (const [file, title] of pages) {
  const html = await readFile(resolve(root, file), 'utf8');
  const canonical = file === 'index.html' ? base : base + file;
  assert.ok(html.includes(`<title>${title}</title>`), `${file}: título público canónico`);
  assert.match(html, /<meta name="description" content="[^"]{50,}">/, `${file}: descripción suficiente`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${file}: canonical oficial`);
  assert.ok(html.includes(`<meta property="og:title" content="${title}">`), `${file}: título Open Graph`);
  assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`), `${file}: URL Open Graph canónica`);
  assert.ok(html.includes(`<meta property="og:image" content="${socialImage}">`), `${file}: imagen social común`);
  assert.match(html, /<meta property="og:description" content="[^"]{50,}">/, `${file}: descripción Open Graph`);
  assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'), `${file}: Twitter Card grande`);
  assert.ok(html.includes(`<meta name="twitter:title" content="${title}">`), `${file}: título Twitter`);
  assert.ok(html.includes(`<meta name="twitter:image" content="${socialImage}">`), `${file}: imagen Twitter`);
  assert.doesNotMatch(html, /<meta\s+name="robots"[^>]*noindex/i, `${file}: la página pública es indexable`);
  assert.ok(urls.includes(canonical), `${file}: incluida en sitemap.xml`);
}

for (const excluded of [...EXCLUIDAS_SITEMAP, '_plantilla.html']) {
  assert.ok(!urls.some((url) => url.endsWith('/' + excluded)), `${excluded}: excluida del sitemap`);
}

/* Alfa (Entrega 2b): en dist/ el módulo de empresas no existe salvo con
   NUVIA_EMPRESAS=1; en el árbol de trabajo sí, y se comprueba igual. */
try {
  const company = await readFile(resolve(root, 'company-analysis/index.html'), 'utf8');
  assert.match(company, /<meta name="robots" content="noindex, nofollow">/,
    'El módulo embebido de empresas no compite como página pública independiente');
} catch (e) {
  if (e?.code !== 'ENOENT') throw e;
  console.log('Metadatos: company-analysis/ no está en este árbol (alfa: fuera de la publicación); se omite su comprobación.');
}

const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
assert.ok(robots.includes(`Sitemap: ${base}sitemap.xml`), 'robots.txt declara el sitemap oficial');
await access(resolve(root, 'robots.txt'));
const image = await sharp(resolve(root, 'src/assets/social/nuvia-social-card-2026-v1.webp')).metadata();
assert.equal(image.width, 1200, 'La imagen social mide 1200 px de ancho');
assert.equal(image.height, 630, 'La imagen social mide 630 px de alto');
console.log(`Metadatos: ${pages.size} páginas canónicas, sitemap y exclusiones verificados.`);
