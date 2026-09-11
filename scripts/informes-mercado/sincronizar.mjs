import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderTarjetas, renderLector, escapar, etiqueta, fechaLegible } from '../../js/nuvia-market-reports-render.mjs';

export async function sincronizarInformes({ raiz = process.cwd(), comprobar = false } = {}) {
  const indice = JSON.parse(await readFile(resolve(raiz, 'data/informes-mercado.json'), 'utf8'));
  const archivo = `<details class="nv-reports-archive"><summary>Archivo de ediciones · ${indice.archivo.length}</summary><ul>${indice.archivo.map((f) => `<li><a href="core/downloads/informes/${escapar(f.id)}.html">${etiqueta(f.tipo)} · ${fechaLegible(f.fecha)} · ${escapar(f.titular)}</a></li>`).join('')}</ul></details>`;
  for (const pagina of ['economia.html', 'mercados.html']) {
    const ruta = resolve(raiz, pagina);
    const previo = await readFile(ruta, 'utf8');
    let siguiente = previo;
    for (const [id, html] of [['tarjetas', renderTarjetas(indice)], ['lector', renderLector(indice) + archivo]]) {
      const patron = new RegExp(`(<!-- NUVIA INFORMES ${id}: START -->)[\\s\\S]*?(<!-- NUVIA INFORMES ${id}: END -->)`, 'g');
      siguiente = siguiente.replace(patron, () => `<!-- NUVIA INFORMES ${id}: START -->\n${html}\n<!-- NUVIA INFORMES ${id}: END -->`);
    }
    if (siguiente !== previo) {
      if (comprobar) throw new Error(`${pagina}: ejecuta npm run informes:sync para sincronizar las ediciones.`);
      await writeFile(ruta, siguiente, 'utf8');
    }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await sincronizarInformes({ comprobar: process.argv.includes('--check') });
  console.log('Informes: portadas, lector y archivo sincronizados.');
}
