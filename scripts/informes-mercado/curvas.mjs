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
 *
 * El mismo módulo completa dos referencias de la tabla de mercados que el
 * buscador casi nunca acredita con fuente primaria: el cambio euro/dólar (tipo
 * de referencia diario del BCE, serie EXR.D.USD.EUR.SP00.A) y el Brent (precio
 * al contado diario que publica la EIA). Sustituyen a la fila «Sin contrastar»
 * con el último cierre del período y la variación frente al último cierre
 * anterior al inicio, y añaden su publicador a las fuentes de la edición.
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

/* --- Referencias de mercado con publicador de primera mano ----------------- */

const variacionPct = (actual, anterior) => Number((((actual - anterior) / anterior) * 100).toFixed(2));
const fechaLarga = (f) => (f && /^\d{4}-\d{2}-\d{2}$/.test(f) ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'Europe/Madrid' }).format(new Date(`${f}T12:00:00Z`)) : f);
const formatoEs = (digitos) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: digitos, maximumFractionDigits: digitos });

function ultimoValor(porFecha, tope) {
  const fechas = [...porFecha.keys()].filter((f) => f <= tope && Number.isFinite(porFecha.get(f))).sort();
  return fechas.length ? { fecha: fechas[fechas.length - 1], valor: porFecha.get(fechas[fechas.length - 1]) } : null;
}

export async function referenciaEurUsd({ desde, hasta }) {
  const url = `https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?startPeriod=${diasAntes(desde, 12)}&endPeriod=${hasta}&format=csvdata`;
  const porFecha = new Map(leerCsv(await descargar(url)).filter((f) => f.TIME_PERIOD).map((f) => [f.TIME_PERIOD, Number(f.OBS_VALUE)]));
  return armarReferencia(porFecha, { desde, hasta }, {
    patron: /eur\s*\/\s*usd|euro.*d[oó]lar|d[oó]lar.*euro/i,
    nombre: 'EUR/USD',
    grupo: /divisa|cambio/i,
    nivel: (v) => `${formatoEs(4).format(v)} dólares por euro`,
    fuente: { titulo: 'Banco Central Europeo · tipos de cambio de referencia del euro (USD)', url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html' },
    nota: (a, b) => `Tipo de referencia del BCE del ${a}; variación frente al del ${b}.`,
  });
}

/** La EIA publica el histórico como tabla HTML por semanas: «AAAA Mmm-D to Mmm-D» y cinco celdas de lunes a viernes. */
export function leerTablaEia(html) {
  const texto = html.replace(/<[^>]+>/g, '|').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const meses = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  const porFecha = new Map();
  const patron = /(\d{4}) (\w{3})-\s?(\d{1,2}) to (\w{3})-\s?(\d{1,2})((?:\|\s*\|?\s*(?:\d+\.\d+)?\s*){1,5})/g;
  for (const m of texto.matchAll(patron)) {
    const inicio = new Date(Date.UTC(Number(m[1]), meses[m[2]] - 1, Number(m[3])));
    const celdas = m[6].split('|').map((c) => c.trim()).filter((c, i, arr) => !(c === '' && arr[i - 1] === ''));
    let dia = 0;
    for (const celda of celdas.slice(1)) {
      if (dia > 4) break;
      const fecha = new Date(inicio.getTime() + dia * 86400000).toISOString().slice(0, 10);
      if (/^\d+\.\d+$/.test(celda)) porFecha.set(fecha, Number(celda));
      dia += 1;
    }
  }
  return porFecha;
}

export async function referenciaBrent({ desde, hasta }) {
  const url = 'https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RBRTE&f=D';
  const porFecha = leerTablaEia(await descargar(url, { aceptar: 'text/html' }));
  return armarReferencia(porFecha, { desde, hasta }, {
    patron: /brent|petr[oó]leo|crudo/i,
    nombre: 'Petróleo Brent',
    grupo: /materia|energ/i,
    nivel: (v) => `${formatoEs(2).format(v)} dólares por barril`,
    fuente: { titulo: 'EIA · Europe Brent Spot Price FOB (dólares por barril)', url: 'https://www.eia.gov/dnav/pet/hist/RBRTEd.htm' },
    nota: (a, b) => `Precio al contado publicado por la EIA para el ${a}; variación frente al del ${b}.`,
  });
}

function armarReferencia(porFecha, { desde, hasta }, def) {
  const actual = ultimoValor(porFecha, hasta);
  const anterior = ultimoValor(porFecha, diasAntes(desde, 1));
  if (!actual) throw new Error(`${def.nombre}: sin dato publicado hasta ${hasta}.`);
  return {
    patron: def.patron,
    grupo: def.grupo,
    fila: {
      nombre: def.nombre,
      nivel: def.nivel(actual.valor),
      variacion: anterior ? variacionPct(actual.valor, anterior.valor) : null,
      variacionAnual: null,
      nota: def.nota(fechaLarga(actual.fecha), fechaLarga(anterior?.fecha ?? '—')),
    },
    fuente: def.fuente,
  };
}

/** Sustituye (o añade) EUR/USD y Brent en `mercados` y su publicador en `fuentes`. Devuelve una copia. */
export function aplicarReferencias(informe, referencias) {
  const fuentes = [...informe.fuentes];
  const mercados = informe.mercados.map((g) => ({ ...g, filas: g.filas.map((f) => ({ ...f })) }));
  for (const ref of referencias) {
    let n = fuentes.findIndex((f) => f.url === ref.fuente.url) + 1;
    if (!n) { fuentes.push({ titulo: ref.fuente.titulo, url: ref.fuente.url }); n = fuentes.length; }
    const fila = { ...ref.fila, fuentes: [n] };
    const grupo = mercados.find((g) => g.filas.some((f) => ref.patron.test(f.nombre))) ?? mercados.find((g) => ref.grupo.test(g.grupo));
    if (!grupo) { mercados.push({ grupo: ref.nombre === 'EUR/USD' ? 'Divisas' : 'Materias primas', filas: [fila] }); continue; }
    const i = grupo.filas.findIndex((f) => ref.patron.test(f.nombre));
    if (i >= 0) grupo.filas[i] = { ...fila, nombre: grupo.filas[i].nombre }; else grupo.filas.push(fila);
  }
  return { ...informe, fuentes, mercados };
}

/**
 * Una clave sin fuente que habla del petróleo, del cambio euro/dólar o de la
 * deuda pública a diez años queda acreditada con el publicador de primera mano
 * que ya está en la edición (EIA, BCE, Tesoro). Solo cuando no tiene ninguna.
 */
const ACREDITACIONES = [
  [/brent|petr[oó]leo|crudo|barril/i, /eia\.gov/],
  [/euro.*d[oó]lar|d[oó]lar.*euro|eur\/usd/i, /euro_reference_exchange_rates/],
  [/bono.*(tesoro|estadounidense|ee\.? ?uu|estados unidos)|treasury|deuda.*(estadounidense|ee\.? ?uu)/i, /treasury\.gov/],
  [/bono.*(alem|bund)|deuda.*(europea|alem)|\bbund\b/i, /euro_area_yield_curves|bundesbank\.de/],
];
export function acreditarClaves(informe) {
  const fuentes = [...informe.fuentes];
  if (informe.curvas) {
    for (const curva of informe.curvas.curvas) {
      if (!fuentes.some((f) => f.url === curva.fuente.url)) fuentes.push({ titulo: curva.fuente.titulo, url: curva.fuente.url });
    }
  }
  const claves = (informe.claves ?? []).map((clave) => {
    if (clave.fuentes?.length) return clave;
    const texto = `${clave.titulo} ${clave.texto}`;
    const n = ACREDITACIONES.filter(([patron]) => patron.test(texto)).map(([, dominio]) => fuentes.findIndex((f) => dominio.test(f.url)) + 1).filter(Boolean);
    return n.length ? { ...clave, fuentes: [...new Set(n)] } : clave;
  });
  return { ...informe, fuentes, claves };
}

export async function obtenerReferencias({ desde, hasta }) {
  const resultados = await Promise.allSettled([referenciaEurUsd({ desde, hasta }), referenciaBrent({ desde, hasta })]);
  return {
    referencias: resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value),
    errores: resultados.filter((r) => r.status === 'rejected').map((r) => r.reason?.message ?? String(r.reason)),
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
  const [{ bloque, errores }, refs] = await Promise.all([obtenerCurvas(periodo), edicion.mercados ? obtenerReferencias(periodo) : { referencias: [], errores: [] }]);
  errores.push(...refs.errores);
  if (!bloque && !refs.referencias.length) throw new Error(`Ningún publicador ha respondido: ${errores.join(' · ')}`);
  let entrada = refs.referencias.length ? aplicarReferencias(edicion, refs.referencias) : edicion;
  if (bloque) entrada = { ...entrada, curvas: bloque };
  entrada = acreditarClaves(entrada);
  const informe = validarInforme(entrada, { tipoEsperado: tipo });
  indice.ediciones[tipo] = { ...edicion, fuentes: entrada.fuentes, mercados: entrada.mercados, claves: entrada.claves, ...(bloque ? { curvas: informe.curvas } : {}) };
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
      if (informe.curvas) process.stdout.write(`\n  Curvas incorporadas a ${id}: ${informe.curvas.curvas.map((c) => `${c.nombre} (${c.fecha}${c.fechaAnterior ? ` frente a ${c.fechaAnterior}` : ''})`).join('; ')}\n`);
      const refs = (informe.mercados ?? []).flatMap((g) => g.filas).filter((f) => /EUR\/USD|Brent/i.test(f.nombre) && f.fuentes?.length);
      if (refs.length) process.stdout.write(`  Referencias acreditadas: ${refs.map((f) => `${f.nombre} ${f.nivel}`).join('; ')}\n`);
      if (errores.length) process.stdout.write(`  Sin respuesta: ${errores.join(' · ')}\n`);
      process.stdout.write('\n');
    }).catch((error) => {
      process.stderr.write(`\n  No se han incorporado curvas.\n  ${error.message}\n\n`);
      process.exitCode = 1;
    });
  }
}
