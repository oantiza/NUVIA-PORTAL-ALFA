import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PUBLICAS } from '../scripts/paginas.mjs';
import { applySiteShell } from '../scripts/site-shell.mjs';
import { readShellDefinition, HEADER_PATTERN, FOOTER_PATTERN } from '../scripts/ecosistema/shell.mjs';

const root = resolve(process.argv[2] || '.');
const read = (path) => readFile(resolve(root, path), 'utf8');
const text = html => html.replace(/<svg\b[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const linksIn = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, label]) => [href.replaceAll('&amp;', '&'), text(label)]);
const part = (html, tag, attribute) => html.match(new RegExp(`<${tag}\\b[^>]*${attribute}[^>]*>[\\s\\S]*?<\\/${tag}>`))?.[0] || '';

// Expectativas independientes del generador y de _plantilla.html: una lista
// incorrecta en la fuente canónica debe fallar, no reproducirse en esta prueba.
const webs = [
  ['economia.html', 'Economía y Finanzas'], ['patrimonio.html', 'Patrimonio'],
  ['bienestar.html', 'Familia, Salud y Bienestar'], ['academia.html', 'Academia NUVIA']
];
const common = [['lecturas.html', 'Lecturas con Criterio'], ['colaboradores.html', 'Colaboradores']];
const institutional = [['que-es-nuvia.html', 'Qué es NUVIA'], ['metodologia.html', 'Metodología'], ['independencia.html', 'Independencia']];
const families = {
  economia: {
    pages: ['economia.html', 'mercados.html', 'cartera.html'],
    links: [['economia.html', 'Portada'], ['mercados.html?vista=informes#lectura-informe', 'Informes'], ['mercados.html', 'Mercados'], ['cartera.html', 'Cartera'], ['cartera.html?vista=companies', 'Empresas']]
  },
  patrimonio: {
    pages: ['patrimonio.html', 'vivienda.html', 'jubilacion.html', 'fiscalidad.html', 'temas.html', 'guia-fiscal.html', 'guia-planificacion.html', 'guia-ahorro.html', 'guia-calendario.html', 'guia-sucesiones.html'],
    links: [['patrimonio.html', 'Portada'], ['vivienda.html', 'Vivienda'], ['jubilacion.html', 'Jubilación'], ['fiscalidad.html', 'Impuestos'], ['temas.html?topic=planificacion-patrimonial', 'Planificación']]
  },
  bienestar: {
    pages: ['bienestar.html', 'respiracion-relajacion.html', 'movimiento-consciente.html', 'nutricion-equilibrada.html', 'descanso-limites-tiempo-propio.html', 'la-respiracion-como-el-escultor-del-cerebro.html', 'que-es-meditar.html'],
    links: [['bienestar.html', 'Portada'], ['respiracion-relajacion.html', 'Respiración'], ['movimiento-consciente.html', 'Movimiento'], ['nutricion-equilibrada.html', 'Nutrición'], ['descanso-limites-tiempo-propio.html', 'Descanso']]
  },
  academia: {
    pages: ['academia.html', 'curso.html'],
    links: [['academia.html', 'Portada'], ['academia.html?tab=esenciales', 'Esenciales'], ['academia.html?tab=cursos', 'Cursos'], ['academia.html?tab=calculadora', 'Interés compuesto'], ['academia.html?tab=glosario', 'Glosario']]
  }
};
const expectedPages = ['index.html', ...Object.values(families).flatMap(family => family.pages), ...common.map(([href]) => href), ...institutional.map(([href]) => href)];
assert.deepEqual([...expectedPages].sort(), PUBLICAS.map(page => page.archivo).sort(), 'Cada página pública tiene contrato de navegación; ninguna se omite por no tener menú');
const sources = new Map();
for (const name of expectedPages) {
  const html = await read(name);
  sources.set(name, html);
  const header = part(html, 'header', 'data-screen-label="Header"');
  const footer = part(html, 'footer', 'data-screen-label="Footer"');
  assert.ok(header && footer, `${name}: cabecera y pie oficiales presentes`);
  assert.equal((html.match(/<header\b[^>]*data-screen-label="Header"/g) || []).length, 1, `${name}: cabecera única`);
  assert.equal((html.match(/<footer\b[^>]*data-screen-label="Footer"/g) || []).length, 1, `${name}: pie único`);
  assert.doesNotMatch(header, /nuvia-site-nav|Gestión de cartera|Temas clave|Curso ·/, `${name}: navegación anterior sustituida`);
  assert.doesNotMatch(text(header + footer), /cinco espacios|cinco puertas|portal actual|maqueta|prototipo/i, `${name}: presentación pública del ecosistema`);
  if (name === 'index.html') {
    assert.match(header, /class="hub-header"/);
    assert.deepEqual(linksIn(header).map(([href]) => href), ['index.html', 'que-es-nuvia.html'], 'El hub conserva su cabecera sencilla y un único acceso a Qué es NUVIA');
    assert.deepEqual(linksIn(footer), institutional.slice(1), 'El hub mantiene acceso directo a Metodología e Independencia');
  } else {
    const family = Object.values(families).find(item => item.pages.includes(name));
    const selector = part(header, 'details', 'class="eco-switch"');
    const local = part(header, 'nav', 'class="web-local"');
    assert.equal((header.match(/<details\b/g) || []).length, 1, `${name}: un selector nativo del ecosistema`);
    assert.match(selector, /<summary>[^<]+(?:<span[^>]*>[^<]+<\/span>)?<\/summary>/, `${name}: selector con nombre visible`);
    assert.deepEqual(linksIn(selector), family ? [['index.html', 'Portada del ecosistema'], ...webs, ...common, ...institutional] : webs, `${name}: cuatro webs y destinos globales`);
    assert.deepEqual(linksIn(local), family ? family.links : [['index.html', 'Portada del ecosistema'], ...common, institutional[0]], `${name}: navegación contextual completa`);
    assert.deepEqual(linksIn(footer).map(([href]) => href), ['index.html', ...common.map(([href]) => href), ...institutional.map(([href]) => href)], `${name}: regreso, dos espacios comunes e información institucional`);
    for (const sentence of [
      'NUVIA reúne información, formación y herramientas para comprender la economía familiar y pensar a largo plazo.',
      'Contenido educativo e informativo.', 'No constituye asesoramiento financiero, fiscal o jurídico personalizado.',
      '© 2026 NUVIA Family Wealth. Todos los derechos reservados.',
      'Las decisiones patrimoniales deben valorar las circunstancias personales de cada familia.'
    ]) assert.ok(footer.includes(sentence), `${name}: aviso institucional conservado: ${sentence}`);
    if (!webs.some(([href]) => href === name)) {
      const breadcrumb = part(html, 'nav', 'class="[^"]*nv-breadcrumb[^"]*"');
      assert.match(breadcrumb, /<a href="index.html" data-main-menu-return>Ecosistema NUVIA<\/a>/, `${name}: regreso explícito al ecosistema`);
      assert.equal((html.match(/data-main-menu-return/g) || []).length, 1, `${name}: regreso de breadcrumb único`);
    }
  }
  for (const [href] of linksIn(header + footer)) {
    assert.doesNotMatch(href, /^(?:\/|[a-z]+:|\.\.)|prototipos\/|plan\.html/i, `${name}: rutas relativas públicas`);
    await access(resolve(root, href.split(/[?#]/)[0]));
  }
}

const home = sources.get('index.html');
// Una exportación/check-out CRLF debe comprobar la misma cáscara que Linux,
// sin reescribir el contenido, metadatos o scripts del documento completo.
const definition = readShellDefinition(await readFile(new URL('../_plantilla.html', import.meta.url), 'utf8'));
const homeLf = home.replaceAll('\r\n', '\n');
const outsideShell = html => html.replace(HEADER_PATTERN, '<!-- header -->').replace(FOOTER_PATTERN, '<!-- footer -->');
for (const [name, fixture] of [
  ['LF', homeLf],
  ['CRLF', homeLf.replaceAll('\n', '\r\n')],
  ['mixto', homeLf.replaceAll('\n', '\r\n').replace(HEADER_PATTERN, fragment => fragment.replaceAll('\r\n', '\n'))]
]) {
  const stale = fixture.replace('>Ecosistema</span>', '>Navegación anterior</span>')
    .replace('Conocimiento para la vida en familia.', 'Pie anterior.');
  assert.notEqual(stale, fixture, `${name}: el caso contiene cambios reales de cáscara`);
  const corrected = applySiteShell(stale, 'index.html', { definition });
  assert.equal(corrected, fixture, `${name}: corrige cabecera y pie conservando sus finales de línea`);
  assert.equal(outsideShell(corrected), outsideShell(stale), `${name}: todo byte fuera de la cáscara permanece intacto`);
  assert.equal(applySiteShell(corrected, 'index.html', { definition }), corrected, `${name}: sincronización idempotente`);
}
const doors = [...home.matchAll(/<a\b[^>]*class="[^"]*\bhub-door\b[^"]*"[^>]*href="([^"]+)"[^>]*aria-label="([^"]+)"/g)];
assert.deepEqual(doors.map(([, href]) => href), webs.map(([href]) => href), 'El hub abre las cuatro webs en su orden editorial');
doors.forEach(([, , label], index) => assert.ok(label.startsWith(webs[index][1] + ':'), 'Cada puerta identifica su destino'));
assert.deepEqual(linksIn(part(home, 'section', 'class="hub-connections"')), common, 'Lecturas y Colaboradores son dos espacios comunes');
assert.match(home, /id="webs"/, 'Ancla estable para las cuatro webs');
const about = sources.get('que-es-nuvia.html');
assert.match(about, /<h1 id="que-nuvia-title"><span>¿Qué es<\/span> NUVIA\?<\/h1>/, 'Título institucional conservado');
assert.match(about, /NUVIA es un lugar donde las familias aprenden a entender su dinero\./, 'Definición principal publicada');
assert.match(about, /No constituye asesoramiento financiero, fiscal o jurídico personalizado\./, 'Aviso de alcance conservado');
assert.match(about, /href="que-es-nuvia\.html" aria-current="page">Qué es NUVIA<\/a>/, 'Identifica la página institucional activa');
assert.match(about, /href="index\.html#webs">Explorar las cuatro webs/, 'Regreso institucional a las cuatro webs');
const aboutWebs = part(about, 'div', 'class="about-world__list"');
const aboutCommon = part(about, 'div', 'class="about-world__list about-world__list--common"');
assert.deepEqual(linksIn(aboutWebs).map(([href]) => href), webs.map(([href]) => href), 'Qué es NUVIA presenta cuatro webs');
assert.deepEqual(linksIn(aboutCommon).map(([href]) => href), common.map(([href]) => href), 'Qué es NUVIA distingue los dos espacios comunes');

// Todos los recursos públicos deben alcanzarse siguiendo los enlaces del hub,
// las portadas y el contenido; ninguna página puede quedar huérfana.
const graph = new Map([...sources].map(([name, html]) => [name, linksIn(html).map(([href]) => href.split(/[?#]/)[0]).filter(href => sources.has(href))]));
const reached = new Set(['index.html']);
for (const name of reached) for (const destination of graph.get(name)) reached.add(destination);
assert.deepEqual([...reached].sort(), [...sources.keys()].sort(), 'Todos los recursos públicos se alcanzan desde el ecosistema');

// Contratos funcionales previos: la reorganización no retira las herramientas.
const topics = sources.get('temas.html');
assert.match(topics, /'planificacion-patrimonial': \['Planificación patrimonial'/);
assert.match(topics, /id: 'planificacion-patrimonial'[\s\S]*?tipo: 'recursos'/);
for (const concept of ['Balance patrimonial', 'Objetivos y horizontes', 'Documentación y continuidad familiar']) assert.ok(topics.includes(concept), 'Categoría informativa: ' + concept);
assert.ok(topics.includes("String(temasPatrimonio.length).padStart(2, '0')"), 'Patrimonio declara sus cuatro ámbitos');
assert.match(topics, /const temasPatrimonio = temas\.filter\(\(tema\) => tema\.id !== 'bienestar'\)/, 'Bienestar no aparece como tema interno de Patrimonio');
assert.match(topics, /mostrarSelector: !esBienestar/, 'Selector de Patrimonio ausente en Bienestar');
assert.match(topics, /'bienestar':\s+\['Cuerpo, mente y salud'/, 'Bienestar conserva su contenido propio');
assert.match(topics, /En preparación/, 'Los ámbitos introductorios declaran su estado editorial');
const academy = sources.get('academia.html');
assert.ok(academy.includes("'esenciales'") && academy.includes("'cursos'"), 'Pestañas de Academia conservadas');
const portfolio = sources.get('cartera.html');
assert.match(portfolio, /id="vista-companies" href="cartera.html\?vista=companies#suite-nuvia"/, 'Análisis de empresas sigue dentro de Cartera');
assert.ok(portfolio.includes('id="nuvia-company-frame"') && portfolio.includes('data-src="company-analysis/index.html"') && !portfolio.includes('id="empresas-en-preparacion"'), 'La vista de empresas carga el módulo alfa propio por selección del usuario');
console.log(`Navegación: ${sources.size} páginas, cuatro webs, dos espacios comunes, confianza y todos los recursos alcanzables.`);
