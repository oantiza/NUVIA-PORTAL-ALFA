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

export function readPageStylesSync(root = '.') {
  return expandImports(resolve(root, 'estilos/nuvia-pages.css'), new Set());
}
