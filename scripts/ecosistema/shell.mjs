/** Cáscaras del Ecosistema NUVIA. Definición única: _plantilla.html.
 * Genera rutas relativas a la raíz pública, también válidas bajo GitHub Pages.
 * No importa código de prototipos ni modifica contenido, metadatos o motores.
 */
import { PAGINAS } from '../paginas.mjs';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const definitionPattern = /<!-- NUVIA:SHELL:DEFINITION\s*([\s\S]*?)\s*NUVIA:SHELL:DEFINITION:END -->/;

export const HEADER_PATTERN = /<header\b[^>]*\bdata-screen-label="Header"[^>]*>[\s\S]*?<\/header>/;
export const FOOTER_PATTERN = /<footer\b[^>]*\bdata-screen-label="Footer"[^>]*>[\s\S]*?<\/footer>/;

export function readShellDefinition(templateHtml) {
  const source = templateHtml.match(definitionPattern)?.[1];
  if (!source) throw new Error('_plantilla.html: falta la definición canónica NUVIA:SHELL:DEFINITION');
  const definition = JSON.parse(source);
  if (definition.version !== 1 || definition.webs?.length !== 4 || definition.common?.length !== 2) throw new Error('_plantilla.html: se requieren cuatro webs y dos espacios comunes');
  const keys = new Set();
  for (const site of definition.webs) {
    if (!site.key || keys.has(site.key) || !site.name || !site.home || !site.modules?.length || !site.nav?.length) throw new Error('_plantilla.html: web incompleta o repetida');
    keys.add(site.key);
  }
  const links = [definition.brand, definition.hub.about, ...definition.hub.footerLinks, ...definition.webs.map(site => ({ href: site.home })), ...definition.webs.flatMap(site => site.nav), ...definition.common, ...definition.institutional];
  for (const item of links) {
    if (!item?.href || item.href.startsWith('/') || /^(?:[a-z]+:|\.\.)/i.test(item.href)) throw new Error('_plantilla.html: la navegación debe usar rutas relativas públicas');
  }
  if (!definition.footer?.paragraphs?.length || !definition.brand?.logo || !definition.hub?.logo || !Number.isFinite(definition.hub.logoWidth) || definition.hub.logoWidth <= 0 || !Number.isFinite(definition.hub.logoHeight) || definition.hub.logoHeight <= 0) throw new Error('_plantilla.html: marca o avisos incompletos');
  return definition;
}

function currentLink(href, current) {
  const target = new URL(href, 'https://nuvia.local/');
  return target.pathname === current.pathname && target.search === current.search;
}

function link(item, current, attributes = '') {
  return `<a${attributes} href="${escape(item.href)}"${current && currentLink(item.href, current) ? ' aria-current="page"' : ''}>${escape(item.label)}</a>`;
}

function markCurrentLinks(html, current) {
  return html.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g, (whole, before, href, after) => {
    const clean = after.replace(/\saria-current="[^"]*"/g, '');
    return `<a${before}href="${href}"${clean}${currentLink(href.replaceAll('&amp;', '&'), current) ? ' aria-current="page"' : ''}>`;
  });
}

function normalizedLocation(pageName, search) {
  const url = new URL(pageName + search, 'https://nuvia.local/');
  if (pageName === 'academia.html') {
    const tab = url.searchParams.get('tab');
    if (['fundamentos', 'activos', 'pib'].includes(tab)) url.searchParams.set('tab', 'esenciales');
    if (tab === 'interes') url.searchParams.set('tab', 'calculadora');
    if (tab === 'inicio') url.searchParams.delete('tab');
  }
  if (pageName === 'cartera.html') {
    const view = url.searchParams.get('vista');
    if (['technical', 'fundamental'].includes(view)) url.searchParams.set('vista', 'companies');
    if (['portfolio', 'models'].includes(view)) url.searchParams.delete('vista');
  }
  if (pageName === 'mercados.html') {
    const view = url.searchParams.get('vista');
    if (view === 'archivo') url.searchParams.set('vista', 'informes');
    else if (view !== 'informes') url.searchParams.delete('vista');
  }
  // Parámetros de territorio, campaña o posición no cambian el menú de sección.
  for (const key of [...url.searchParams.keys()]) if (!['tab', 'vista', 'topic'].includes(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  return url;
}

function sectionLocation(pageName, search, site, pages) {
  const direct = site.nav.find(item => item.pages?.includes(pageName));
  if (direct) return new URL(direct.href, 'https://nuvia.local/');
  let current = normalizedLocation(pageName, search);
  const visited = new Set();
  let page = pages.find(item => item.archivo === pageName);
  while (!site.nav.some(item => currentLink(item.href, current)) && page?.padre && !visited.has(page.archivo)) {
    visited.add(page.archivo);
    if (page.padre === site.home) break;
    current = normalizedLocation(page.padre, '');
    page = pages.find(item => item.archivo === page.padre);
  }
  return current;
}

function brandImage(definition) {
  const brand = definition.brand;
  return `<span class="nv-brand-lockup" aria-hidden="true"><img class="nv-brand-mark" src="${escape(brand.logo)}" width="${brand.width}" height="${brand.height}" alt=""><span class="nv-brand-word">NUVIA</span></span>`;
}

function hubHeader(definition) {
  return `<header data-screen-label="Header" class="hub-header">
    <a class="hub-brand" href="${escape(definition.brand.href)}" aria-label="${escape(definition.brand.label)}" aria-current="page"><img class="hub-brand-logo" src="${escape(definition.hub.logo)}" width="${definition.hub.logoWidth}" height="${definition.hub.logoHeight}" alt="NUVIA Family Wealth"></a>
    <a class="hub-about" href="${escape(definition.hub.about.href)}">${escape(definition.hub.about.label)} <span class="hub-about-arrow">${arrow}</span></a>
  </header>`;
}

function hubFooter(definition) {
  return `<footer data-screen-label="Footer" class="hub-footer">
    <p>${escape(definition.hub.footerCopy)}</p>
    ${definition.hub.footerLinks.map(item => `<a href="${escape(item.href)}">${escape(item.label)} ${arrow}</a>`).join('\n    ')}
  </footer>`;
}

function ecosystemMenu(definition, current) {
  return `<nav aria-label="Explorar NUVIA">${link({ href: definition.brand.href, label: 'Inicio NUVIA' }, current)}<span class="eco-switch-label">Las cuatro webs</span>${definition.webs.map(site => link({ href: site.home, label: site.name }, current)).join('')}<span class="eco-switch-label">Espacios comunes</span>${definition.common.map(item => link(item, current)).join('')}<span class="eco-switch-label">Conoce NUVIA</span>${definition.institutional.map(item => link(item, current)).join('')}</nav>`;
}

function webHeader(definition, site, current, section) {
  return `<header data-screen-label="Header" class="web-header"><div class="web-wrap web-header-row">
    <a class="web-brand" href="${escape(definition.brand.href)}" aria-label="${escape(definition.brand.label)}">${brandImage(definition)}</a>
    ${link({ href: site.home, label: site.name }, current, ' class="web-name"')}
    <details class="eco-switch"><summary>Explorar NUVIA <span aria-hidden="true">⌄</span></summary>${ecosystemMenu(definition, current)}</details>
  </div><nav class="web-local" data-nav-family="${escape(site.key)}" aria-label="Navegación de ${escape(site.name)}"><div class="web-wrap">${link({ href: site.home, label: 'Inicio' }, section, ` aria-label="Inicio de ${escape(site.name)}"`)}${site.nav.map(item => link(item, section)).join('')}</div></nav></header>`;
}

function sharedHeader(definition, current) {
  const about = definition.institutional.find(item => item.href === definition.hub.about.href);
  return `<header data-screen-label="Header" class="web-header web-header--shared"><div class="web-wrap web-header-row">
    <a class="web-brand" href="${escape(definition.brand.href)}" aria-label="${escape(definition.brand.label)}">${brandImage(definition)}</a>
    <a class="web-name" href="${escape(definition.brand.href)}">Espacios comunes</a>
    <details class="eco-switch"><summary>Explorar NUVIA <span aria-hidden="true">⌄</span></summary>${ecosystemMenu(definition, current)}</details>
  </div><nav class="web-local" aria-label="Espacios compartidos de NUVIA"><div class="web-wrap">${link({ href: definition.brand.href, label: 'Inicio NUVIA' }, current)}${[...definition.common, about].map(item => link(item, current)).join('')}</div></nav></header>`;
}

function webFooter(definition, current) {
  const footer = definition.footer;
  const about = definition.institutional.find(item => item.href === definition.hub.about.href);
  const criteria = definition.institutional.filter(item => item !== about);
  return markCurrentLinks(`<footer data-screen-label="Footer" class="web-footer"><div class="web-wrap"><div class="web-footer-top"><a class="web-return" href="${escape(definition.brand.href)}">${escape(footer.returnTitle)}<span>${escape(footer.returnLabel)} ${arrow}</span></a><nav aria-label="Espacios comunes e información de NUVIA">${[...definition.common, about].map(item => link(item)).join('')}</nav></div><div class="web-trust"><div class="web-trust-copy">${footer.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</div><nav aria-label="Criterios de NUVIA">${criteria.map(item => link(item)).join('')}</nav></div><div class="web-footer-bottom"><p>${escape(footer.motto)}</p></div><p class="web-prototype-note">${escape(footer.structureNote)}</p></div></footer>`, current);
}

/** API pura para el generador de páginas y shell:sync. */
export function shellForPage(pageName, { definition, pages = PAGINAS, search = '' } = {}) {
  if (!definition) throw new Error('shellForPage necesita la definición leída de _plantilla.html');
  const page = pages.find(item => item.archivo === pageName);
  if (!page && pageName !== '_plantilla.html') throw new Error(`La página ${pageName} no está registrada`);
  if (pageName === definition.brand.href) return { kind: 'hub', family: null, header: hubHeader(definition), footer: hubFooter(definition) };
  const shared = [...definition.common, ...definition.institutional].some(item => item.href === pageName) || pageName === '_plantilla.html';
  const current = normalizedLocation(pageName, search);
  const site = shared ? null : definition.webs.find(item => item.home === pageName || item.modules.includes(page?.modulo));
  if (!shared && !site) throw new Error(`La página ${pageName} no tiene una cáscara contextual definida`);
  return { kind: shared ? 'shared' : 'web', family: site?.key || null,
    header: shared ? sharedHeader(definition, current) : webHeader(definition, site, current, sectionLocation(pageName, search, site, pages)),
    footer: webFooter(definition, current) };
}
