/**
 * Genera un BORRADOR del informe de mercado. No publica nada.
 *
 *   node scripts/informes-mercado/generar.mjs --tipo diario
 *   node scripts/informes-mercado/generar.mjs --tipo semanal
 *
 * El borrador queda en `output/informes-borrador/`, que está fuera del control
 * de versiones y fuera del sitio compilado: nada de lo que salga de aquí llega
 * al lector hasta que una persona lo revise y ejecute `publicar.mjs`.
 *
 * Esa separación no es celo administrativo. El §7 del marco regulatorio exige
 * «revisión humana proporcional al riesgo», y la sección de informes de
 * `mercados.html` promete por escrito que «no se presenta como diario ningún
 * contenido que no haya sido actualizado y revisado».
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { TIPOS, validarInforme, ErrorContrato } from './contrato.mjs';
import {
  generarConReserva,
  extraerFuentes,
  resolverRedirecciones,
  leerJson,
  leerClave,
  ErrorGemini,
} from './gemini.mjs';
import { depurarFuentes, tieneFuentePrimaria } from './fuentes.mjs';
import { promptInvestigacion, promptRedaccion } from './prompts.mjs';

const CARPETA_BORRADORES = 'output/informes-borrador';

function leerArgumentos(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) args.set(argv[i].slice(2), argv[i + 1]);
  }
  const tipo = String(args.get('tipo') ?? 'diario').toUpperCase();
  if (!(tipo in TIPOS)) {
    throw new Error(`--tipo debe ser diario o semanal; llegó «${args.get('tipo')}».`);
  }
  return { tipo, fecha: args.get('fecha') ?? null };
}

/** Fecha de hoy en Madrid, que es la que ve el lector. */
function fechaMadrid(ahora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ahora);
  return partes;
}

export async function generarBorrador({ tipo, fecha = null, clave = null } = {}) {
  const apiKey = clave ?? leerClave();
  const hoy = fecha ?? fechaMadrid();

  // El orden importa: primero se cambian las redirecciones del buscador por la
  // dirección real —caducan en horas, así que hay que hacerlo ya— y solo
  // después se depuran, porque hasta tener el destino no se sabe quién publica.
  const documentar = async (insistirOficiales) => {
    const salida = await generarConReserva(apiKey, promptInvestigacion(tipo, hoy, { insistirOficiales }), {
      fundamentado: true,
      json: false,
    });
    const depuradas = depurarFuentes(await resolverRedirecciones(extraerFuentes(salida.respuesta)));
    return { ...salida, fuentes: depuradas };
  };

  // El buscador es irregular: el mismo prompt trae unas veces la nota del BCE y
  // otras solo prensa que la cita. Un segundo intento dirigido sale más a cuenta
  // que descartar el informe entero.
  let investigacion = await documentar(false);
  if (!tieneFuentePrimaria(investigacion.fuentes)) {
    investigacion = await documentar(true);
  }
  const fuentes = investigacion.fuentes;

  const redaccion = await generarConReserva(apiKey, promptRedaccion(tipo, hoy, investigacion.texto), {
    fundamentado: false,
    json: true,
  });

  const bruto = leerJson(redaccion.texto);
  // El sistema impone identidad, fuentes y trazabilidad: no se acepta lo que el
  // modelo diga de sí mismo ni las fuentes que afirme haber consultado.
  delete bruto.fuentes;
  const informe = validarInforme(
    {
      ...bruto,
      tipo,
      fecha: hoy,
      fechaIso: `${hoy}T00:00:00.000Z`,
      generadoIso: new Date().toISOString(),
      fuentes,
      generacion: {
        ...(bruto.generacion ?? {}),
        modeloInvestigacion: investigacion.modelo,
        modeloRedaccion: redaccion.modelo,
        fuentesConsultadas: fuentes.length,
      },
      revision: { estado: 'borrador', revisadoIso: null },
    },
    { tipoEsperado: tipo },
  );

  return informe;
}

async function principal() {
  const { tipo, fecha } = leerArgumentos(process.argv.slice(2));
  const raiz = resolve(process.cwd());

  process.stdout.write(`Generando el borrador ${TIPOS[tipo].etiqueta}…\n`);
  const informe = await generarBorrador({ tipo, fecha });

  const carpeta = resolve(raiz, CARPETA_BORRADORES);
  await mkdir(carpeta, { recursive: true });
  const destino = resolve(carpeta, `${informe.id}.json`);
  await writeFile(destino, `${JSON.stringify(informe, null, 2)}\n`, 'utf8');

  const parrafos = informe.cuerpo.reduce((suma, seccion) => suma + seccion.parrafos.length, 0);
  process.stdout.write(
    [
      '',
      `  Borrador: ${destino}`,
      `  Titular:  ${informe.titular}`,
      `  Contenido: ${informe.hechos.length} hechos · ${informe.indicadores.length} indicadores · ` +
        `${informe.agenda.length} citas · ${parrafos} párrafos`,
      `  Fuentes:  ${informe.fuentes.length}`,
      `  Modelos:  ${informe.generacion.modeloInvestigacion} (documentación) · ` +
        `${informe.generacion.modeloRedaccion} (redacción)`,
      '',
      '  Léelo antes de publicarlo. Cuando te convenza:',
      `    node scripts/informes-mercado/publicar.mjs --id ${informe.id}`,
      '',
    ].join('\n'),
  );
}

const invocadoDirectamente = process.argv[1] && process.argv[1].endsWith('generar.mjs');
if (invocadoDirectamente) {
  principal().catch((error) => {
    const conocido = error instanceof ErrorContrato || error instanceof ErrorGemini;
    process.stderr.write(`\n  No se ha generado el borrador.\n  ${error.message}\n\n`);
    if (!conocido) process.stderr.write(`${error.stack}\n`);
    process.exitCode = 1;
  });
}
