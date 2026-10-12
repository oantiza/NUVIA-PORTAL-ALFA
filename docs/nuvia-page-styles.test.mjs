import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { readPageStylesSync, readCommonPageStylesSync, readStylesOfPageSync } from '../scripts/read-page-styles.mjs';

const root = resolve(process.argv[2] || '.');
const importsDe = (file) => [...readFileSync(resolve(root, file), 'utf8').matchAll(/@import\s+url\("([^"]+)"\);/g)].map((match) => match[1]);

assert.deepEqual(importsDe('estilos/nuvia-pages.css'), [
  'nuvia-pages-foundations.css',
  'nuvia-pages-content.css',
  'nuvia-page-entry.css',
], 'Entrada común: fundamentos → contenidos → entradas de página, sin Cartera ni informes');

assert.deepEqual(importsDe('estilos/nuvia-pages-lab.css'), [
  'nuvia-pages-foundations.css',
  'nuvia-pages-cartera.css',
  'nuvia-pages-content.css',
  'nuvia-page-entry.css',
], 'Entrada del laboratorio: Cartera entre fundamentos y contenidos, antes de las entradas de página');

/* Qué página carga qué entrada. Cartera es la única con la hoja del laboratorio;
   los informes de mercado solo van donde se muestran (Mercados y la portada de Economía). */
const paginas = readdirSync(root).filter((file) => file.endsWith('.html') && !file.startsWith('_'));
const hojasDe = (file) => [...readFileSync(resolve(root, file), 'utf8').matchAll(/href="estilos\/([^"?]+\.css)(?:\?[^"]*)?"/g)].map((m) => m[1]);
for (const pagina of paginas) {
  const hojas = hojasDe(pagina);
  if (pagina === 'sistema-visual.html') continue; // muestra del sistema: hoja propia
  if (pagina === 'guia-impuestos.html') continue; // redirección sin cáscara
  if (pagina === 'cartera.html') {
    assert.ok(hojas.includes('nuvia-pages-lab.css') && !hojas.includes('nuvia-pages.css'), 'cartera.html carga nuvia-pages-lab.css en lugar de la entrada común');
  } else {
    assert.ok(hojas.includes('nuvia-pages.css'), `${pagina}: carga la entrada común nuvia-pages.css`);
    assert.ok(!hojas.includes('nuvia-pages-lab.css') && !hojas.includes('nuvia-pages-cartera.css'), `${pagina}: no carga estilos de Cartera`);
  }
  const conInformes = ['mercados.html', 'economia.html'].includes(pagina);
  assert.equal(hojas.includes('nuvia-market-reports.css'), conInformes, `${pagina}: nuvia-market-reports.css solo en Mercados y Economía`);
  const i = hojas.indexOf('nuvia-market-reports.css');
  if (i >= 0) assert.ok(i > hojas.indexOf('nuvia-pages.css') && (hojas.indexOf('nuvia-subseccion.css') < 0 || i < hojas.indexOf('nuvia-subseccion.css')), `${pagina}: informes tras la entrada común y antes de la hoja de subsección`);
}

/* Impresión: el formato de papel es común. Toda página con cáscara debe recibir
   exactamente un @page A4 a través de sus propias hojas (no de otra página). */
for (const pagina of paginas) {
  if (['sistema-visual.html', 'guia-impuestos.html'].includes(pagina)) continue;
  const propio = readStylesOfPageSync(root, pagina);
  const paginas_a4 = (propio.match(/@page\s*\{\s*size:\s*A4;\s*margin:\s*15mm;\s*\}/g) || []).length;
  assert.equal(paginas_a4, 1, `${pagina}: formato de impresión A4 común, una sola vez`);
}

const expanded = readPageStylesSync(root);
const foundations = expanded.indexOf('ARMAZÓN COMÚN');
const portfolio = expanded.indexOf('CARTERA Y ANÁLISIS');
const content = expanded.indexOf('VIVIENDA Y COSTE DE VIDA');
assert.ok(foundations >= 0 && portfolio > foundations && content > portfolio,
  'Fundamentos, Cartera y contenidos conservan su orden original en la entrada del laboratorio');
assert.doesNotMatch(expanded, /@import\b/, 'Las pruebas deben leer las reglas expandidas');
assert.ok(expanded.split(/\r?\n/).length > 9800, 'No se ha perdido ningún tramo de estilos de página');
const common = readCommonPageStylesSync(root);
assert.ok(common.indexOf('CARTERA Y ANÁLISIS') < 0, 'La entrada común ya no arrastra la hoja de Cartera');

console.log(`Estilos de página: entrada común (3 módulos), entrada del laboratorio (4) y enlaces por página verificados en ${root}.`);
