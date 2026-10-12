/* sitemap.xml se genera desde el registro único de páginas (scripts/paginas.mjs).
     node scripts/update-sitemap.mjs           escribe sitemap.xml
     node scripts/update-sitemap.mjs --check   falla si sitemap.xml no coincide */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sitemapXml, PUBLICAS } from './paginas.mjs';

const ruta = resolve('sitemap.xml');
const esperado = sitemapXml();

if (process.argv.includes('--check')) {
  const actual = await readFile(ruta, 'utf8').catch(() => '');
  if (actual.replace(/\r\n/g, '\n') !== esperado) {
    console.error('sitemap.xml no coincide con scripts/paginas.mjs. Ejecuta: npm run sitemap:sync');
    process.exit(1);
  }
  console.log(`Sitemap: ${PUBLICAS.length} páginas públicas, coherente con el registro.`);
} else {
  await writeFile(ruta, esperado);
  console.log(`Sitemap: escrito con ${PUBLICAS.length} páginas públicas.`);
}
