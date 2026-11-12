/** Fuentes principales de las portadas del ecosistema. Academia conserva su
 * motor en academia.html: su rama de portada se sincroniza por marcador.
 * No usa prototipos ni realiza publicación. Ejecutar desde la raíz del proyecto.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PAGINAS, urlCanonica } from '../paginas.mjs';
import { renderHub } from './hub.mjs';
import { renderEconomia } from './economia.mjs';
import { renderPatrimonio } from './patrimonio.mjs';
import { renderBienestar } from './bienestar.mjs';
import { renderAcademia } from './academia.mjs';
import { sites } from './sitios.mjs';

const root = resolve(import.meta.dirname, '../..');
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const renderers = {economia:renderEconomia, patrimonio:renderPatrimonio, bienestar:renderBienestar};
const social = 'https://oantiza.github.io/NUVIA-PORTAL-ALFA/src/assets/social/nuvia-social-card-2026-v1.webp';

// Validar los dos límites antes de escribir ninguna portada. En Academia no se
// reconstruyen la cáscara, el interior original ni el controlador del runtime.
const academyPath = resolve(root, 'academia.html');
const academyPrevious = await readFile(academyPath, 'utf8');
const academyStart = '<!-- ACADEMIA PORTADA: INICIO -->';
const academyEnd = '<!-- ACADEMIA PORTADA: FIN -->';
if (academyPrevious.split(academyStart).length !== 2 || academyPrevious.split(academyEnd).length !== 2) {
  throw new Error('Academia necesita un único par de marcadores para regenerar su portada');
}
const academyFrom = academyPrevious.indexOf(academyStart) + academyStart.length;
const academyTo = academyPrevious.indexOf(academyEnd);
if (academyTo < academyFrom) throw new Error('Los marcadores de la portada de Academia están invertidos');
const academyBody = renderAcademia(sites.find(site => site.key === 'academia')).replaceAll('\r\n', '\n');
const academyNext = academyPrevious.slice(0, academyFrom) + '\n' + academyBody + '\n' + academyPrevious.slice(academyTo);

function head(name, description, css) {
  const title = PAGINAS.find(p=>p.archivo===name).titulo;
  const canonical = urlCanonica(name);
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${canonical}">
<!-- NUVIA SOCIAL META: START -->
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="NUVIA">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${social}">
<meta property="og:image:type" content="image/webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="NUVIA · Un lugar donde las familias aprenden a entender su dinero">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${social}">
<meta name="twitter:image:alt" content="NUVIA · Un lugar donde las familias aprenden a entender su dinero">
<!-- NUVIA SOCIAL META: END -->
<link rel="icon" href="favicon.svg">
<link rel="stylesheet" href="estilos/nuvia-tokens.css">
<link rel="stylesheet" href="estilos/nuvia-components.css">
<link rel="stylesheet" href="estilos/nuvia-pages.css">
${name==='economia.html'?'<link rel="stylesheet" href="estilos/nuvia-market-reports.css">':''}
${css.map(file=>`<link rel="stylesheet" href="estilos/ecosistema/${file}.css">`).join('\n')}
<script defer src="js/nuvia-ecosistema.js"></script>
</head>`;
}

for (const key of ['index', 'economia', 'patrimonio', 'bienestar']) {
  const name = key + '.html';
  const site = sites.find(s=>s.key===key);
  const description = site?.copy || 'Ecosistema NUVIA reúne cuatro webs: Economía y Finanzas, Patrimonio, Familia, Salud y Bienestar y Academia NUVIA. Lecturas y Colaboradores son espacios comunes.';
  const main = key==='index' ? renderHub().match(/<main\b[\s\S]*?<\/main>/)[0] : `<main id="contenido" tabindex="-1">${renderers[key](site)}</main>`;
  const previous = await readFile(resolve(root,name),'utf8');
  const header = previous.match(/<header\b[^>]*data-screen-label="Header"[^>]*>[\s\S]*?<\/header>/)?.[0] || '<header data-screen-label="Header"></header>';
  const footer = previous.match(/<footer\b[^>]*data-screen-label="Footer"[^>]*>[\s\S]*?<\/footer>/)?.[0] || '<footer data-screen-label="Footer"></footer>';
  const html = `<!doctype html>\n<html lang="es">\n${head(name,description,key==='index'?['hub']:['webs',key])}\n<body class="${key==='index'?'hub-page':`web-page web-page--${key}`}">\n<a class="${key==='index'?'hub-skip':'web-skip'}" href="#contenido">Saltar al contenido</a>\n${header}\n${main}\n${footer}\n</body>\n</html>\n`;
  await writeFile(resolve(root,name), html, 'utf8');
}
await writeFile(academyPath, academyNext, 'utf8');
console.log('Generadas la portada común y las cuatro portadas de web. Academia actualiza solo su rama de portada y conserva el controlador y los interiores. Ejecutar npm run shell:sync.');
