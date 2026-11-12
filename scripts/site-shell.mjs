import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PAGINAS } from './paginas.mjs';
import { readShellDefinition, shellForPage, HEADER_PATTERN, FOOTER_PATTERN } from './ecosistema/shell.mjs';

function requireFragment(html, pattern, label, fileName) {
  const fragment = html.match(pattern)?.[0];
  if (!fragment) throw new Error(`${fileName}: no se encontró ${label}`);
  return fragment;
}

export function applySiteShell(html, pageName, options) {
  const header = requireFragment(html, HEADER_PATTERN, 'la cabecera completa marcada', pageName);
  const footer = requireFragment(html, FOOTER_PATTERN, 'el pie marcado', pageName);
  for (const pattern of [HEADER_PATTERN, FOOTER_PATTERN]) {
    if ([...html.matchAll(new RegExp(pattern.source, 'g'))].length !== 1) throw new Error(`${pageName}: la cáscara debe aparecer una sola vez`);
  }
  const shell = shellForPage(pageName, options);
  // Git puede entregar LF o CRLF. Cada fragmento conserva su convención,
  // también en documentos históricos mixtos; el resto del HTML no se toca.
  // Solo se adapta el salto del texto generado, nunca se normaliza la página
  // ni se ignoran diferencias de contenido durante shell:check.
  const withOriginalEol = (generated, original) => {
    const eol = original.match(/\r\n|\n/)?.[0] || html.match(/\r\n|\n/)?.[0] || '\n';
    return generated.replace(/\r?\n/g, eol);
  };
  return html.replace(HEADER_PATTERN, () => withOriginalEol(shell.header, header))
    .replace(FOOTER_PATTERN, () => withOriginalEol(shell.footer, footer));
}

export async function synchronizeSiteShell({
  root = resolve(import.meta.dirname, '..'),
  check = false,
  dryRun = false,
  pages = PAGINAS,
  report = console.log,
} = {}) {
  const templateName = '_plantilla.html';
  const template = await readFile(resolve(root, templateName), 'utf8');
  const definition = readShellDefinition(template);
  const portalPages = [];
  const changed = [];
  const renderedTemplate = applySiteShell(template, templateName, { definition, pages });
  if (renderedTemplate !== template) {
    changed.push(templateName);
    if (!check && !dryRun) await writeFile(resolve(root, templateName), renderedTemplate, 'utf8');
  }

  for (const pageName of (await readdir(root)).filter((name) => name.endsWith('.html') && name !== templateName)) {
    const filePath = resolve(root, pageName);
    const html = await readFile(filePath, 'utf8');
    const registered = pages.find(page => page.archivo === pageName);
    if (!HEADER_PATTERN.test(html) && !FOOTER_PATTERN.test(html) && !registered?.publica) continue;
    portalPages.push(pageName);
    const next = applySiteShell(html, pageName, { definition, pages });

    if (next === html) continue;
    changed.push(pageName);
    if (!check && !dryRun) await writeFile(filePath, next, 'utf8');
  }

  if (check && changed.length) {
    throw new Error(`Cabecera o pie fuera de la plantilla común: ${changed.join(', ')}`);
  }

  report(check
    ? `Cáscara contextual verificada en ${portalPages.length} páginas.`
    : dryRun
      ? `Cáscara contextual preparada para ${portalPages.length} páginas; ${changed.length} pendientes, sin escribir archivos.`
      : `Cáscara contextual sincronizada en ${portalPages.length} páginas; ${changed.length} actualizadas.`);
  return changed;
}
