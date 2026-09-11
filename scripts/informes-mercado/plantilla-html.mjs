import { readFileSync } from 'node:fs';
import { renderInforme, escapar, etiqueta, fechaLegible } from '../../js/nuvia-market-reports-render.mjs';

// Estilos y fuentes del portal incrustados: el informe funciona sin conexión.
const css = readFileSync(new URL('../../estilos/nuvia-market-reports.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('../../estilos/nuvia-tokens.css', import.meta.url), 'utf8');
function valorToken(nombre) {
  const valor = tokens.match(new RegExp(`${nombre}:\\s*([^;]+);`))?.[1];
  if (!valor) throw new Error(`Token desconocido: ${nombre}`);
  return valor.replace(/var\((--[\w-]+)\)/g, (_, referencia) => valorToken(referencia));
}
const nombres = [...new Set([...css.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];
const variables = `:root {${nombres.map((nombre) => `${nombre}:${valorToken(nombre)};`).join('')}}`;
const fuentes = [['Newsreader', 'newsreader-latin.woff2'], ['Inter', 'inter-latin.woff2']]
  .map(([familia, archivo]) => `@font-face {font-family:'${familia}';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(new URL(`../../estilos/fuentes/${archivo}`, import.meta.url)).toString('base64')}) format('woff2');}`).join('\n');

export function informeAHtml(informe) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NUVIA · Informe ${etiqueta(informe.tipo).toLowerCase()} · ${escapar(fechaLegible(informe.fecha))}</title>
<style>${variables}\n${fuentes}\n${css}
* { box-sizing:border-box; } body {margin:0;padding:40px 24px;background:var(--nv-paper-light);}
main {max-width:1100px;margin:0 auto;} .volver {display:block;color:var(--nv-text-link);font:14px var(--nv-font-sans);margin:0 0 24px;}
a:focus-visible, summary:focus-visible {outline:2px solid var(--nv-text);outline-offset:4px;}
@media print {body {padding:0;} .volver {display:none;} }
</style></head><body><main>
<a class="volver" href="https://oantiza.github.io/NUVIA-PORTAL-ALFA/mercados.html?vista=informes">← Informes de mercado · NUVIA</a>
${renderInforme(informe, { independiente: true })}
</main></body></html>\n`.replace(/[ \t]+$/gm, '');
}
export { escapar };
