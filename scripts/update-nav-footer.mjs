import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pages = [
  'index.html',
  'economia.html',
  'patrimonio.html',
  'bienestar.html',
  'academia.html',
  'lecturas.html',
  'colaboradores.html',
  'que-es-nuvia.html',
  'mercados.html',
  'cartera.html',
  'vivienda.html',
  'jubilacion.html',
  'fiscalidad.html',
  'temas.html',
  'curso.html',
  'guia-ahorro.html',
  'guia-calendario.html',
  'guia-fiscal.html',
  'guia-planificacion.html',
  'guia-sucesiones.html',
  '_plantilla.html'
];

function buildNav(pageName) {
  const isQueEsNuvia = pageName === 'que-es-nuvia.html';
  const isColaboradores = pageName === 'colaboradores.html';

  const queEsNuviaLink = isQueEsNuvia
    ? '<a class="nuvia-site-nav__secondary" href="que-es-nuvia.html" aria-current="page">Qué es NUVIA</a>'
    : '<a class="nuvia-site-nav__secondary" href="que-es-nuvia.html">Qué es NUVIA</a>';

  const colaboradoresLink = isColaboradores
    ? '<a class="nuvia-site-nav__secondary is-active" href="colaboradores.html" aria-current="page">Colaboradores</a>'
    : '<a class="nuvia-site-nav__secondary" href="colaboradores.html">Colaboradores</a>';

  return `      <nav class="nuvia-site-nav" data-nuvia-unified="true" aria-label="Navegación principal">
        <details class="nuvia-site-nav__topics" data-nav-area="economia">
          <summary>Economía y Finanzas</summary>
          <div class="nuvia-site-nav__menu">
            <a href="economia.html">Portada de Economía</a>
            <a href="mercados.html">Mercados y noticias</a>
            <a href="cartera.html">Cartera</a>
            <a href="cartera.html?vista=companies">Análisis y valoración de empresas</a>
          </div>
        </details>
        <details class="nuvia-site-nav__topics" data-nav-area="patrimonio">
          <summary>Patrimonio</summary>
          <div class="nuvia-site-nav__menu">
            <a href="patrimonio.html">Portada de Patrimonio</a>
            <a href="vivienda.html">Vivienda y coste de vida</a>
            <a href="jubilacion.html">Jubilación</a>
            <a href="fiscalidad.html">Impuestos</a>
            <a href="temas.html?topic=planificacion-patrimonial">Planificación patrimonial</a>
          </div>
        </details>
        <details class="nuvia-site-nav__topics" data-nav-area="bienestar">
          <summary>Familia, Salud y Bienestar</summary>
          <div class="nuvia-site-nav__menu">
            <a href="bienestar.html">Portada de Bienestar</a>
            <a href="temas.html?topic=bienestar">Cuerpo, mente y salud</a>
          </div>
        </details>
        <details class="nuvia-site-nav__topics" data-nav-area="academy">
          <summary>Academia NUVIA</summary>
          <div class="nuvia-site-nav__menu">
            <a href="academia.html">Portada de Academia</a>
            <a href="academia.html?tab=esenciales">Conocimientos esenciales</a>
            <a href="academia.html?tab=cursos">Cursos</a>
          </div>
        </details>
        <a href="lecturas.html">Lecturas con Criterio</a>
        ${colaboradoresLink}
        ${queEsNuviaLink}
      </nav>`;
}

const canonicalFooter = `  <footer data-screen-label="Footer" class="nuvia-site-footer">
    <div class="nuvia-site-footer__inner">
      <div class="nuvia-site-footer__grid">
        <div class="nuvia-site-footer__brand">
          <img src="src/assets/brand/nuvia-family-wealth-footer-reversed.svg"
               alt="NUVIA Family Wealth" width="852" height="412" loading="lazy">
          <p>NUVIA reúne información, formación y herramientas para comprender la economía familiar y pensar a largo plazo.</p>
        </div>
        <div>
          <h2 class="nuvia-site-footer__heading">Los cinco espacios</h2>
          <div class="nuvia-site-footer__links">
            <a href="economia.html">Economía y Finanzas</a>
            <a href="patrimonio.html">Patrimonio</a>
            <a href="bienestar.html">Familia, Salud y Bienestar</a>
            <a href="academia.html">Academia NUVIA</a>
            <a href="lecturas.html">Lecturas con Criterio</a>
          </div>
        </div>
        <div>
          <h2 class="nuvia-site-footer__heading">Herramientas</h2>
          <div class="nuvia-site-footer__links">
            <a href="cartera.html">Cartera y analítica</a>
            <a href="cartera.html?vista=companies">Análisis y valoración de empresas</a>
            <a href="vivienda.html">Vivienda y coste de vida</a>
            <a href="fiscalidad.html">Impuestos</a>
            <a href="jubilacion.html">Jubilación</a>
          </div>
        </div>
        <div class="nuvia-site-footer__info-column">
          <h2 class="nuvia-site-footer__heading">Información</h2>
          <div class="nuvia-site-footer__info">
            <a href="colaboradores.html">Colaboradores</a>
            <a href="que-es-nuvia.html">Qué es NUVIA</a>
            <span>Contenido educativo e informativo.</span>
            <span>No constituye asesoramiento financiero, fiscal o jurídico personalizado.</span>
          </div>
        </div>
      </div>
      <div class="nuvia-site-footer__legal">
        <span>© 2026 NUVIA Family Wealth. Todos los derechos reservados.</span>
        <span>Las decisiones patrimoniales deben valorar las circunstancias personales de cada familia.</span>
      </div>
    </div>
  </footer>`;

for (const pageName of pages) {
  const filePath = resolve(pageName);
  let html = await readFile(filePath, 'utf8');

  // Replace nav
  const navPattern = /<nav class="nuvia-site-nav"[\s\S]*?<\/nav>/;
  if (navPattern.test(html)) {
    html = html.replace(navPattern, buildNav(pageName));
  } else {
    console.warn(`No nav found in ${pageName}`);
  }

  // Replace footer
  const footerPattern = /<footer data-screen-label="Footer"[\s\S]*?<\/footer>/;
  if (footerPattern.test(html)) {
    html = html.replace(footerPattern, canonicalFooter);
  } else {
    console.warn(`No footer found in ${pageName}`);
  }

  await writeFile(filePath, html, 'utf8');
  console.log(`Updated nav and footer in ${pageName}`);
}
