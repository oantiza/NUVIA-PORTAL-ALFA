import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const navPattern = /<nav class="nuvia-site-nav"[\s\S]*?<\/nav>/;
const footerPattern = /<footer data-screen-label="Footer"[\s\S]*?<\/footer>/;

function requireFragment(html, pattern, label, fileName) {
  const fragment = html.match(pattern)?.[0];
  if (!fragment) throw new Error(`${fileName}: no se encontró ${label}`);
  return fragment;
}

function navigationForPage(canonicalNav, pageName) {
  if (pageName === 'colaboradores.html') {
    return canonicalNav.replace(
      '<a class="nuvia-site-nav__secondary" href="colaboradores.html">',
      '<a class="nuvia-site-nav__secondary is-active" href="colaboradores.html" aria-current="page">',
    );
  }
  if (pageName === 'que-es-nuvia.html') {
    return canonicalNav.replace(
      '<a class="nuvia-site-nav__secondary" href="que-es-nuvia.html">',
      '<a class="nuvia-site-nav__secondary" href="que-es-nuvia.html" aria-current="page">',
    );
  }
  return canonicalNav;
}

export async function synchronizeSiteShell({
  root = resolve(import.meta.dirname, '..'),
  check = false,
  report = console.log,
} = {}) {
  const templateName = '_plantilla.html';
  const template = await readFile(resolve(root, templateName), 'utf8');
  const canonicalNav = requireFragment(template, navPattern, 'la navegación canónica', templateName);
  const canonicalFooter = requireFragment(template, footerPattern, 'el pie canónico', templateName);
  const portalPages = [];
  const changed = [];

  for (const pageName of (await readdir(root)).filter((name) => name.endsWith('.html') && name !== templateName)) {
    const filePath = resolve(root, pageName);
    const html = await readFile(filePath, 'utf8');
    if (!navPattern.test(html) && !footerPattern.test(html)) continue;
    portalPages.push(pageName);
    requireFragment(html, navPattern, 'la navegación común', pageName);
    requireFragment(html, footerPattern, 'el pie común', pageName);

    const next = html
      .replace(navPattern, navigationForPage(canonicalNav, pageName))
      .replace(footerPattern, canonicalFooter);

    if (next === html) continue;
    changed.push(pageName);
    if (!check) await writeFile(filePath, next, 'utf8');
  }

  if (check && changed.length) {
    throw new Error(`Cabecera o pie fuera de la plantilla común: ${changed.join(', ')}`);
  }

  report(check
    ? `Cáscara común verificada en ${portalPages.length} páginas.`
    : `Cáscara común sincronizada en ${portalPages.length} páginas; ${changed.length} actualizadas.`);
  return changed;
}
