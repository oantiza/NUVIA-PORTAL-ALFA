import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function expandImports(filePath, visited) {
  const absolute = resolve(filePath);
  if (visited.has(absolute)) throw new Error(`Importación CSS circular: ${absolute}`);
  visited.add(absolute);
  const css = readFileSync(absolute, 'utf8');
  const imports = [...css.matchAll(/@import\s+(?:url\()?['"]([^'")]+)['"]\)?\s*;/g)];
  const expanded = imports.length
    ? imports.map((match) => expandImports(resolve(dirname(absolute), match[1]), visited)).join('\n')
    : css;
  visited.delete(absolute);
  return expanded;
}

/* Reglas de página expandidas, para las pruebas que leen la cascada.
   Devuelve la unión de todas las hojas de página en su orden de cascada:
   la entrada del laboratorio (fundamentos → cartera → contenidos → entradas,
   que contiene a la entrada común) y los informes de mercado. Así las pruebas
   siguen viendo las reglas de Cartera e informes aunque ya no se carguen en
   todas las páginas. */
export function readPageStylesSync(root = '.') {
  return [
    expandImports(resolve(root, 'estilos/nuvia-pages-lab.css'), new Set()),
    expandImports(resolve(root, 'estilos/nuvia-market-reports.css'), new Set()),
  ].join('\n');
}

/* Las reglas que carga UNA página concreta, en su orden de enlace: lo que ve
   el navegador en esa página y nada más. Es la función que debe usar una prueba
   que afirme algo sobre una página, para no apoyarse en reglas de otra. */
export function readStylesOfPageSync(root, file) {
  const html = readFileSync(resolve(root, file), 'utf8');
  const hojas = [...html.matchAll(/href="(estilos\/[^"?]+\.css)(?:\?[^"]*)?"/g)].map((m) => m[1]);
  return hojas.map((hoja) => expandImports(resolve(root, hoja), new Set())).join('\n');
}

/* Solo la entrada común (lo que cargan las páginas hijas que no son Cartera). */
export function readCommonPageStylesSync(root = '.') {
  return expandImports(resolve(root, 'estilos/nuvia-pages.css'), new Set());
}
