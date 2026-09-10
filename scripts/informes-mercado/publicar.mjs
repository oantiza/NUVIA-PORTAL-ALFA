/**
 * Publica un borrador ya revisado.
 *
 *   node scripts/informes-mercado/publicar.mjs --id diario-2026-09-10
 *
 * Ejecutar este comando ES la revisión humana: el borrador no llega al portal
 * por sí solo ni por un cron. Quien lo lanza declara que ha leído la edición.
 *
 * Escribe dos cosas:
 *   data/informes-mercado.json          — lo que lee la página de mercados
 *   core/downloads/informes/<id>.html   — la versión descargable
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { TIPOS, VERSION_CONTRATO, validarInforme, vigencia, ErrorContrato } from './contrato.mjs';
import { informeAHtml } from './plantilla-html.mjs';

const CARPETA_BORRADORES = 'output/informes-borrador';
const CARPETA_DESCARGAS = 'core/downloads/informes';
const INDICE = 'data/informes-mercado.json';
const LIMITE_ARCHIVO = 24;

function leerArgumentos(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) args.set(argv[i].slice(2), argv[i + 1]);
  }
  return { id: args.get('id') ?? null };
}

async function indiceActual(raiz) {
  const ruta = resolve(raiz, INDICE);
  if (!existsSync(ruta)) {
    return { schema_version: VERSION_CONTRATO, actualizadoIso: null, ediciones: {}, archivo: [] };
  }
  return JSON.parse(await readFile(ruta, 'utf8'));
}

/** Ficha corta para el archivo de la página: sin el cuerpo del informe. */
function fichaDeArchivo(informe) {
  return {
    id: informe.id,
    tipo: informe.tipo,
    fecha: informe.fecha,
    titular: informe.titular,
    descarga: `${CARPETA_DESCARGAS}/${informe.id}.html`,
  };
}

export function integrarEnIndice(indice, informe, ahora = new Date()) {
  const ficha = fichaDeArchivo(informe);
  const archivo = [ficha, ...(indice.archivo ?? []).filter((otra) => otra.id !== informe.id)]
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0))
    .slice(0, LIMITE_ARCHIVO);

  return {
    schema_version: VERSION_CONTRATO,
    actualizadoIso: ahora.toISOString(),
    ediciones: {
      ...(indice.ediciones ?? {}),
      [informe.tipo]: { ...informe, vigencia: vigencia(informe, ahora), descarga: ficha.descarga },
    },
    archivo,
  };
}

export async function publicar({ id, raiz = process.cwd(), ahora = new Date() } = {}) {
  const rutaBorrador = resolve(raiz, CARPETA_BORRADORES, `${id}.json`);
  if (!existsSync(rutaBorrador)) {
    const carpeta = resolve(raiz, CARPETA_BORRADORES);
    const disponibles = existsSync(carpeta)
      ? (await readdir(carpeta)).filter((n) => n.endsWith('.json')).map((n) => n.replace('.json', ''))
      : [];
    throw new ErrorContrato(
      `No hay un borrador con el identificador «${id}».` +
        (disponibles.length ? ` Disponibles: ${disponibles.join(', ')}.` : ' No hay borradores generados.'),
    );
  }

  const bruto = JSON.parse(await readFile(rutaBorrador, 'utf8'));
  // Se revalida al publicar, no solo al generar: entre una cosa y otra el
  // fichero ha estado en disco y ha podido editarse a mano.
  const informe = validarInforme(
    { ...bruto, revision: { estado: 'publicado', revisadoIso: ahora.toISOString() } },
    { tipoEsperado: bruto.tipo },
  );

  const carpetaDescargas = resolve(raiz, CARPETA_DESCARGAS);
  await mkdir(carpetaDescargas, { recursive: true });
  const rutaHtml = resolve(carpetaDescargas, `${informe.id}.html`);
  await writeFile(rutaHtml, informeAHtml(informe), 'utf8');

  const indice = integrarEnIndice(await indiceActual(raiz), informe, ahora);
  await writeFile(resolve(raiz, INDICE), `${JSON.stringify(indice, null, 2)}\n`, 'utf8');

  return { informe, rutaHtml, indice };
}

async function principal() {
  const { id } = leerArgumentos(process.argv.slice(2));
  if (!id) throw new ErrorContrato('Indica qué borrador publicar con --id <identificador>.');

  const { informe, rutaHtml, indice } = await publicar({ id });
  process.stdout.write(
    [
      '',
      `  Publicado: ${TIPOS[informe.tipo].titulo} del ${informe.fecha}`,
      `  Titular:   ${informe.titular}`,
      `  Descarga:  ${rutaHtml}`,
      `  Índice:    ${INDICE} (${indice.archivo.length} ediciones en el archivo)`,
      '',
      '  Queda escrito en el repositorio. Para verlo en el portal: npm run serve',
      '',
    ].join('\n'),
  );
}

const invocadoDirectamente = process.argv[1] && process.argv[1].endsWith('publicar.mjs');
if (invocadoDirectamente) {
  principal().catch((error) => {
    process.stderr.write(`\n  No se ha publicado nada.\n  ${error.message}\n\n`);
    if (!(error instanceof ErrorContrato)) process.stderr.write(`${error.stack}\n`);
    process.exitCode = 1;
  });
}
