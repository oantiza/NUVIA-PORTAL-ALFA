/**
 * Curvas de tipos del informe semanal: eurozona (BCE) y Estados Unidos (Tesoro).
 *
 * Dos publicadores de primera mano, sin intermediarios:
 *   · BCE, Data Portal: curva al contado de deuda pública con calificación AAA
 *     del área del euro (serie YC.B.U2.EUR.4F.G_N_A.SV_C_YM.SR_<plazo>).
 *   · Tesoro de EE. UU.: «Daily Treasury Par Yield Curve Rates», CSV anual.
 *
 * Se lee al publicar (`publicar.mjs`) o a mano con
 *   node scripts/informes-mercado/curvas.mjs --id semanal-AAAA-MM-DD
 * y deja en la edición el bloque `curvas`: dos curvas con el último cierre
 * disponible hasta el final del período y el último cierre anterior al inicio,
 * cada una con su fecha y su fuente. No calcula nada: transcribe. Si una de
 * las dos no responde, se publica la otra; si ninguna, no hay bloque (nunca
 * bloquea la publicación: es información complementaria).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { validarInforme } from './contrato.mjs';
import { informeAHtml } from './plantilla-html.mjs';
import { sincronizarInformes } from './sincronizar.mjs';

export const PLAZOS = [
  { plazo: '3 m', anios: 0.25, bce: 'SR_3M', tesoro: '3 Mo' },
  { plazo: '6 m', anios: 0.5, bce: 'SR_6M', tesoro: '6 Mo' },
  { plazo: '1 a', anios: 1, bce: 'SR_1Y', tesoro: '1 Yr' },
  { plazo: '2 a', anios: 2, bce: 'SR_2Y', tesoro: '2 Yr' },
  { plazo: '3 a', anios: 3, bce: 'SR_3Y', tesoro: '3 Yr' },
  { plazo: '5 a', anios: 5, bce: 'SR_5Y', tesoro: '5 Yr' },
  { plazo: '7 a', anios: 7, bce: 'SR_7Y', tesoro: '7 Yr' },
  { plazo: '10 a', anios: 10, bce: 'SR_10Y', tesoro: '10 Yr' },
  { plazo: '20 a', anios: 20, bce: 'SR_20Y', tesoro: '20 Yr' },
  { plazo: '30 a', anios: 30, bce: 'SR_30Y', tesoro: '30 Yr' },
];

const diasAntes = (fecha, dias) => new Date(Date.parse(`${fecha}T12:00:00Z`) - dias * 86400000).toISOString().slice(0, 10);

/** CSV sencillo: comillas dobles opcionales, sin saltos de línea dentro de un campo. */
function leerCsv(texto) {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
  const partir = (linea) => linea.match(/("([^"]|"")*"|[^,]*)(,|$)/g).slice(0, -1).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim());
  const cabecera = partir(lineas[0]);
  return lineas.slice(1).map((l) => Object.fromEntries(partir(l).map((v, i) => [cabecera[i], v])));
}

async function descargar(url, { aceptar = 'text/csv' } = {}) {
  const respuesta = await fetch(url, { headers: { Accept: aceptar, 'User-Agent': 'NUVIA-informes/1.0 (+https://oantiza.github.io/NUVIA-PORTAL-ALFA/)' }, signal: AbortSignal.timeout(30000) });
  if (!respuesta.ok) throw new Error(`${url} → HTTP ${respuesta.status}`);
  return respuesta.text();
}

/** Último cierre con la curva completa en una fecha ≤ tope. */
function ultimoCierre(porFecha, tope) {
  const fechas = [...porFecha.keys()].filter((f) => f <= tope).sort();
  for (let i = fechas.length - 1; i >= 0; i -= 1) {
    const valores = porFecha.get(fechas[i]);
    if (PLAZOS.every((p) => Number.isFinite(valores[p.plazo]))) return { fecha: fechas[i], valores };
  }
  return null;
}

export async function curvaBce({ desde, hasta }) {
  const claves = PLAZOS.map((p) => p.bce).join('+');
  const url = `https://data-api.ecb.europa.eu/service/data/YC/B.U2.EUR.4F.G_N_A.SV_C_YM.${claves}?startPeriod=${diasAntes(desde, 12)}&endPeriod=${hasta}&format=csvdata`;
  const filas = leerCsv(await descargar(url));
  const porFecha = new Map();
  for (const fila of filas) {
    const plazo = PLAZOS.find((p) => fila.KEY?.endsWith(`.${p.bce}`));
    if (!plazo || !fila.TIME_PERIOD) continue;
    if (!porFecha.has(fila.TIME_PERIOD)) porFecha.set(fila.TIME_PERIOD, {});
    porFecha.get(fila.TIME_PERIOD)[plazo.plazo] = Number(fila.OBS_VALUE);
  }
  return armar('eurozona', 'Eurozona · deuda pública AAA', porFecha, { desde, hasta }, {
    titulo: 'Banco Central Europeo · curva de tipos del área del euro (deuda AAA)',
    url: 'https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html',
  });
}

export async function curvaTesoro({ desde, hasta }) {
  const anios = [...new Set([desde.slice(0, 4), hasta.slice(0, 4)])];
  const porFecha = new Map();
  for (const anio of anios) {
    const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${anio}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${anio}&page&_format=csv`;
    for (const fila of leerCsv(await descargar(url))) {
      const m = fila.Date?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!m) continue;
      const fecha = `${m[3]}-${m[1]}-${m[2]}`;
      porFecha.set(fecha, Object.fromEntries(PLAZOS.map((p) => [p.plazo, Number(fila[p.tesoro])])));
    }
  }
  return armar('eeuu', 'Estados Unidos · deuda pública', porFecha, { desde, hasta }, {
    titulo: 'Tesoro de EE. UU. · Daily Treasury Par Yield Curve Rates',
    url: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve',
  });
}

function armar(clave, nombre, porFecha, { desde, hasta }, fuente) {
  const actual = ultimoCierre(porFecha, hasta);
  const anterior = ultimoCierre(porFecha, diasAntes(desde, 1));
  if (!actual) throw new Error(`${nombre}: sin cierre completo hasta ${hasta}.`);
  return {
    clave,
    nombre,
    fecha: actual.fecha,
    fechaAnterior: anterior?.fecha ?? null,
    puntos: PLAZOS.map((p) => ({
      plazo: p.plazo,
      anios: p.anios,
      actual: Number(actual.valores[p.plazo].toFixed(3)),
      anterior: anterior ? Number(anterior.valores[p.plazo].toFixed(3)) : null,
    })),
    fuente,
  };
}

/** Las dos curvas o las que respondan; `null` si ninguna. Los fallos se devuelven, no se lanzan. */
export async function obtenerCurvas({ desde, hasta }) {
  const resultados = await Promise.allSettled([curvaBce({ desde, hasta }), curvaTesoro({ desde, hasta })]);
  const curvas = resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  const errores = resultados.filter((r) => r.status === 'rejected').map((r) => r.reason?.message ?? String(r.reason));
  return { bloque: curvas.length ? { obtenidoIso: new Date().toISOString(), curvas } : null, errores };
}

/** Añade (o renueva) el bloque en una edición publicada y regenera su descargable y las páginas. */
export async function incorporarCurvas({ id, raiz = process.cwd() }) {
  const rutaIndice = resolve(raiz, 'data/informes-mercado.json');
  const indice = JSON.parse(await readFile(rutaIndice, 'utf8'));
  const tipo = id.startsWith('semanal') ? 'SEMANAL' : 'DIARIO';
  const edicion = indice.ediciones?.[tipo];
  if (!edicion || edicion.id !== id) throw new Error(`La edición «${id}» no es la vigente en el índice.`);
  const periodo = edicion.periodo ?? { desde: edicion.fecha, hasta: edicion.fecha };
  const { bloque, errores } = await obtenerCurvas(periodo);
  if (!bloque) throw new Error(`Ninguna curva disponible: ${errores.join(' · ')}`);
  const informe = validarInforme({ ...edicion, curvas: bloque }, { tipoEsperado: tipo });
  indice.ediciones[tipo] = { ...edicion, curvas: informe.curvas };
  await writeFile(rutaIndice, `${JSON.stringify(indice, null, 2)}\n`, 'utf8');
  await mkdir(resolve(raiz, 'core/downloads/informes'), { recursive: true });
  await writeFile(resolve(raiz, `core/downloads/informes/${id}.html`), informeAHtml(validarInforme(indice.ediciones[tipo], { tipoEsperado: tipo })), 'utf8');
  await sincronizarInformes({ raiz });
  return { informe, errores };
}

if (process.argv[1] && process.argv[1].endsWith('curvas.mjs')) {
  const id = process.argv[process.argv.indexOf('--id') + 1];
  if (!id || !/^(diario|semanal)-\d{4}-\d{2}-\d{2}$/.test(id)) {
    process.stderr.write('\n  Indica la edición con --id semanal-AAAA-MM-DD\n\n');
    process.exitCode = 1;
  } else {
    incorporarCurvas({ id }).then(({ informe, errores }) => {
      process.stdout.write(`\n  Curvas incorporadas a ${id}: ${informe.curvas.curvas.map((c) => `${c.nombre} (${c.fecha}${c.fechaAnterior ? ` frente a ${c.fechaAnterior}` : ''})`).join('; ')}\n`);
      if (errores.length) process.stdout.write(`  Sin respuesta: ${errores.join(' · ')}\n`);
      process.stdout.write('\n');
    }).catch((error) => {
      process.stderr.write(`\n  No se han incorporado curvas.\n  ${error.message}\n\n`);
      process.exitCode = 1;
    });
  }
}
