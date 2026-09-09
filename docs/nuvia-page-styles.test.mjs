import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readPageStylesSync } from '../scripts/read-page-styles.mjs';

const root = resolve(process.argv[2] || '.');
const entry = readFileSync(resolve(root, 'estilos/nuvia-pages.css'), 'utf8');
const imports = [...entry.matchAll(/@import\s+url\("([^"]+)"\);/g)].map((match) => match[1]);

assert.deepEqual(imports, [
  'nuvia-pages-foundations.css',
  'nuvia-pages-cartera.css',
  'nuvia-pages-content.css',
  'nuvia-page-entry.css',
], 'Mantener el orden de cascada y la entrada común de páginas hijas');

const expanded = readPageStylesSync(root);
const foundations = expanded.indexOf('ARMAZÓN COMÚN');
const portfolio = expanded.indexOf('CARTERA Y ANÁLISIS');
const content = expanded.indexOf('VIVIENDA Y COSTE DE VIDA');
assert.ok(foundations >= 0 && portfolio > foundations && content > portfolio,
  'Fundamentos, Cartera y contenidos conservan su orden original');
assert.doesNotMatch(expanded, /@import\b/, 'Las pruebas deben leer las reglas expandidas');
assert.ok(expanded.split(/\r?\n/).length > 9800, 'No se ha perdido ningún tramo de estilos de página');

console.log(`Estilos de página: cuatro módulos y orden de cascada verificados en ${root}.`);
