import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readPageStylesSync} from '../scripts/read-page-styles.mjs';

const root = resolve(process.argv[2] ?? resolve(import.meta.dirname, '..'));
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const css = readPageStylesSync(root);
const tokens = await readFile(resolve(root, 'estilos/nuvia-tokens.css'), 'utf8');

const section = (id) => home.match(new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0];
const exactAccess = [
  ['mercados', 'economia.html', 'Accede a Economía y Finanzas'],
  ['patrimonio', 'patrimonio.html', 'Accede a Patrimonio'],
  ['familia-salud', 'bienestar.html', 'Accede a Familia, Salud y Bienestar'],
  ['academia', 'academia.html', 'Accede a Academia NUVIA'],
  ['lecturas-con-criterio', 'lecturas.html', 'Accede a Lecturas con Criterio'],
];

for (const [id, href, label] of exactAccess) {
  const block = section(id);
  assert.ok(block, `${id}: la sección existe`);
  assert.equal((block.match(/<a\b/g) ?? []).length, 1, `${id}: un único acceso`);
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const arrow = ' <span aria-hidden="true">→<\\/span>';
  assert.match(block, new RegExp(`<a\\b[^>]*href="${escapedHref}"[^>]*>${escapedLabel}${arrow}<\\/a>`),
    `${id}: texto y destino exactos`);
}

const hero = section('inicio');
assert.match(home, /estilos\/nuvia-pages\.css\?v=home-2026-0901-r3/,
  'Inicio fuerza la descarga de los estilos visuales corregidos');
assert.ok(hero?.includes('class="nv-hero nv-hero--photo home-hero"'), 'El hero conserva su componente');
assert.ok(hero.includes('Información clara,<br>decisiones con propósito.'), 'El hero conserva el titular');
assert.ok(hero.includes('{{ barraPilares }}') && hero.includes('home-pillars'), 'El hero conserva la franja configurable');
assert.match(css.slice(css.indexOf('HOME 2026')), /\.home-hero__art\s*\{\s*object-position:\s*78% 50%;\s*\}/,
  'El único ajuste del hero es su encuadre');
const heroVeilRule = css.match(/\.home-hero__veil\s*\{\s*background:([\s\S]*?)\n\}/)?.[1];
assert.ok(heroVeilRule?.includes('linear-gradient(0deg, rgba(28, 58, 94, .55) 0%'),
  'El degradado inferior del hero termina en azul oscuro');
assert.ok(!/linear-gradient\(0deg,\s*var\(--nv-(?:bg|cloud)\)/.test(heroVeilRule),
  'El hero no conserva una franja clara en su base');

const project = section('que-es-nuvia');
assert.ok(project?.includes('class="nv-section home26-project-section"'),
  'El proyecto elimina la franja vacía posterior al hero');
assert.ok(project?.includes('class="home26-project"'), 'El proyecto usa la composición a dos columnas');
assert.match(css, /\.home26-project > div > \.nv-eyebrow\s*\{\s*margin:\s*0;\s*\}/,
  'El proyecto y Valores comparten la misma alineación superior');
assert.equal((project.match(/class="home26-project__body"/g) ?? []).length, 1, 'Una sola zona de lectura');
assert.equal((project.match(/class="home26-project__item"/g) ?? []).length, 3, 'Los tres valores permanecen');

for (const [id, variant] of [
  ['mercados', 'home26-plate--bleed'],
  ['patrimonio', 'home26-plate--light home26-plate--reverse'],
  ['familia-salud', 'home26-plate'],
]) assert.ok(section(id)?.includes(variant), `${id}: variante editorial asignada`);
assert.ok(!section('familia-salud').includes('home26-plate__badge'), 'Bienestar no lleva la etiqueta retirada por el fundador');
assert.doesNotMatch(home, /home26-plate__caption|imagen decorativa/i, 'Se retiran los pies de lámina repetidos');
assert.doesNotMatch(section('mercados'), /Lámina 01/i, 'Economía elimina la referencia de lámina');

assert.equal(section('sumario'), undefined, 'Inicio no duplica los accesos a herramientas de los espacios');
assert.doesNotMatch(home, /home26-spaces__grid/, 'Los cinco banners son la única presentación de los espacios');
assert.match(home, /id="espacios" class="nv-container home26-plate-label-wrap"/,
  'Explorar NUVIA conduce al comienzo de los bloques con fotografía');

const academy = section('academia');
assert.match(academy, /id="titulo-academia" class="home26-plate__title">Academia NUVIA<\/h2>/,
  'Academia identifica el espacio con el título HTML del componente común');
assert.match(academy, /home26-plate--light home26-plate--reverse/,
  'Academia comparte la composición fotográfica de los otros espacios');
assert.doesNotMatch(academy, /nuvia-academy-banner-2026\.webp/,
  'Inicio usa la nueva escena de aprendizaje solicitada');

const readings = section('lecturas-con-criterio');
assert.doesNotMatch(readings, /nv-section-heading|titulo-lecturas|<h2\b/,
  'Lecturas elimina la cabecera exterior y su espacio');
const readingsBanner = readings.match(/<div class="home-lecturas"[\s\S]*?<\/div>/)?.[0];
assert.ok(readingsBanner, 'Lecturas conserva su banner');
assert.doesNotMatch(readingsBanner, /<h[1-6]\b|<p\b/, 'Lecturas no superpone título ni descripción');
assert.doesNotMatch(readingsBanner, /<a\b/, 'El acceso de Lecturas no se superpone a la ilustración');
assert.match(readings, /class="home26-plate__body home26-panel__body"/,
  'Lecturas conecta su ilustración con la explicación y el acceso comunes');

assert.doesNotMatch(home, /\sstyle=/i, 'Inicio no contiene estilos en línea');
assert.doesNotMatch(home, /data-macro-id=|data-daily-news|data-daily-impact|id="noticia"/,
  'Inicio no incorpora cifras ni indicadores dinámicos');
assert.doesNotMatch(home, /nv-section--(?:white|paper)/, 'Inicio no usa fondos blancos o papel alternos');
assert.match(css, /\.home26-plate--light\s*\{\s*background:\s*var\(--nv-cloud\);\s*\}/,
  'La lámina clara conserva el fondo nube');
assert.match(css, /\.home26-band\s*\{[\s\S]*?background:\s*var\(--nv-mist\);/,
  'Las franjas usan el fondo técnico');
assert.match(tokens, /--nv-bg:\s*var\(--nv-mist\)/, 'El fondo global usa la bruma azul solicitada');

const homeCss = css.slice(css.indexOf('HOME 2026'));
assert.ok(homeCss.length > 0, 'El bloque HOME 2026 está al final de la hoja');
assert.match(homeCss, /\.home26-project-section\s*\{\s*padding-top:\s*var\(--nv-space-12\);\s*\}/,
  'El proyecto conserva un espacio moderado respecto al hero');
assert.doesNotMatch(css, /linear-gradient\(0deg,\s*var\(--nv-bg\)/,
  'El hero no crea una franja clara en su fundido inferior');
assert.doesNotMatch(homeCss, /#[0-9a-f]{3,8}\b|rgba?\(/i, 'HOME 2026 solo usa colores mediante tokens');
assert.match(homeCss, /@media\s*\(max-width:\s*1024px\)/, 'Existe el ajuste de tablet a 1024 px');
assert.doesNotMatch(homeCss, /@media\s*\(max-width:\s*(?:[0-9]{1,3})px\)/, 'No se crea una versión móvil');
for (const id of ['mercados', 'patrimonio', 'familia-salud', 'academia', 'lecturas-con-criterio']) {
  assert.match(section(id), /class="[^"]*nv-container[^"]*home26-plate/,
    `${id}: comparte el contenedor fijo y centrado de Academia y Lecturas`);
}
assert.equal((home.match(/class="nv-container home26-plate-label-wrap"/g) || []).length, 5,
  'Los cinco rótulos comparten posición, alineación y componente');
for (const label of ['Un lugar, cinco espacios', 'Decisiones de fondo', 'Vida y equilibrio', 'Formación', 'Sección editorial']) {
  assert.match(home, new RegExp(`class="nv-container home26-plate-label-wrap">\\s*<p class="nv-eyebrow home26-plate-label">${label}<`),
    `El rótulo exterior muestra ${label}`);
}
assert.doesNotMatch(home, /home26-(?:plate-label|showcase__label)[^>]*>[^<]*·\s*0[1-5]</,
  'Los cinco encabezados editoriales no muestran numeración');
assert.match(homeCss, /\.home26-plate-label-wrap\s*\{[\s\S]*?margin-top:\s*calc\(var\(--nv-space-12\) \+ var\(--nv-space-1\)\);[\s\S]*?margin-bottom:\s*var\(--nv-space-6\);/,
  'Los tres bloques conservan una separación ligeramente más amplia y homogénea');
assert.match(homeCss, /\.home26-plate__cta:focus-visible\s*\{[\s\S]*?outline:/, 'Las tres láminas tienen foco visible');
assert.match(homeCss, /\.home26-plate--bleed \.home26-plate__veil\s*\{[\s\S]*?var\(--nv-navy-950\) 86%, transparent\) 100%/,
  'Economía conserva contraste sin ocultar en exceso la fotografía');
assert.match(homeCss, /\.home26-plate__cta\s*\{[\s\S]*?border:\s*1px solid var\(--nv-green-300\);[\s\S]*?border-radius:\s*var\(--nv-radius-pill\);/,
  'Los tres accesos recuperan la forma redondeada y el filete verde');

const definedTokens = new Set([...tokens.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) => `--${match[1]}`));
for (const match of homeCss.matchAll(/var\((--[a-z0-9-]+)/gi)) {
  assert.ok(definedTokens.has(match[1]), `Token existente: ${match[1]}`);
}

const assets = new Map([
  ['src/assets/home/hero-family-finance-compact.webp', 'f143b8f10ec4326b462a481599a8ea26fd3fe5738f535f11cab7aa4ef7c33aa7'],
  ['src/assets/markets/secondary-news/wall-street-records.jpg', '4b0a025883086aab03b5f2c105b79f38dbacd1a23a7ae518260f6c83032f5cce'],
  ['src/assets/home/patrimonio-family-home-young-family-natural-20260901.webp', '905ee21798f11044a74d813750cd83584dcaeb26f1fa7e1016b3256146e7ef0e'],
  ['src/assets/home/wellbeing-life-balance-banner-v2.webp', '7af9d0ab2c2b0af67f9b7bc3665a40d3028bf8c87f6f4d88571ebd73f1ef6941'],
  ['src/assets/home/academia-aprendizaje-natural-20260908.webp', '11f5440e2206c50bc659d6bb529609347244cfe8269fc2e1163cbb85a87ecc44'],
  ['src/assets/home/lecturas-con-criterio-banner-sin-boton.webp', '59768e8b2f5a5ac19001c4a3d6cf9cd7b4e2568c7b5758f03eb0015a81dda02a'],
]);
for (const [asset, expected] of assets) {
  assert.ok(home.includes(`src="${asset}"`), `Inicio conserva ${asset}`);
  const hash = createHash('sha256').update(await readFile(resolve(root, asset))).digest('hex');
  assert.equal(hash, expected, `${asset}: hash intacto`);
}

const academyPage = await readFile(resolve(root, 'academia.html'), 'utf8');
assert.equal((academyPage.match(/class="ac-def ac-def--wide ac-essential-card"/g) || []).length, 4,
  'Conocimientos esenciales presenta cuatro tarjetas editoriales homogéneas');
assert.match(css, /\.ac-essential-card\s*\{[\s\S]*?border-radius:\s*var\(--nv-radius-md\);[\s\S]*?box-shadow:\s*var\(--nv-shadow-sm\);/,
  'Las tarjetas esenciales usan forma, profundidad y tokens del sistema');
assert.match(css, /\.ac-essential-card:focus-visible\s*\{[\s\S]*?outline:/,
  'Las tarjetas esenciales conservan foco visible');
const academyHero = academyPage.match(/<section\b[^>]*id="academy"[\s\S]*?<\/section>/)?.[0];
assert.ok(academyHero?.includes('nv-space-entry--academy'), 'Academia interior comparte la composición de Inicio');
assert.ok(academyHero.includes('src/assets/home/academia-aprender-en-familia-20260909.webp'), 'Academia usa la panorámica de aprendizaje en familia con la izquierda en penumbra');
assert.ok(academyHero.includes('{{ pestanas }}') && academyHero.includes('{{ p.abrir }}'), 'Las pestañas de Academia siguen conectadas');
assert.ok(!academyPage.includes('data-academy-intro'), 'No reaparece la entradilla de Academia');

const markets = await readFile(resolve(root, 'mercados.html'), 'utf8');
for (const id of ['inflation-spain', 'euribor', 'ecb-rate', 'gdp-spain', 'unemployment-spain']) {
  assert.ok(markets.includes(`data-macro-id="${id}"`), `Mercados conserva ${id}`);
}

console.log(`OK Home 2026: composición, accesos, fondos, foco e imágenes en ${root}`);
