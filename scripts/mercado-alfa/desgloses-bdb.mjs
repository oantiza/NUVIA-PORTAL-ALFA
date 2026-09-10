#!/usr/bin/env node
/**
 * NUVIA · alfa · importación de desgloses de cartera desde un volcado en disco
 * de la base de activos de BDB.
 *
 *   node scripts/mercado-alfa/desgloses-bdb.mjs --origen <ruta al .ndjson[.gz]>
 *   node scripts/mercado-alfa/desgloses-bdb.mjs --origen <ruta> --escribir
 *
 * LAS DOS BASES SON INDEPENDIENTES Y SE QUEDAN ASÍ. Este script:
 *   · NO se conecta a ninguna base ajena: lee un fichero de copia que ya está
 *     en disco, en modo solo lectura, cuya ruta se pasa a mano.
 *   · NO escribe nada fuera de nuvia-family-wealth.
 *   · NO toca `assets/{id}`, `series/`, `catalog_*` ni el manifiesto: solo
 *     crea `assets/{id}/holdings/latest`. El pipeline de precios (run.mjs)
 *     sigue siendo el dueño de todo lo demás y no se entera.
 *   · NO pisa lo que ya existe: si un desglose está en la base, se respeta.
 *
 * Por qué hace falta: EODHD no publica el desglose de los fondos europeos
 * (el mercado EUFUND devuelve `{}`), así que la matriz de solapamiento solo
 * podía calcularse entre ETF. El volcado sí trae la cartera completa, y en la
 * misma forma que `carteraDesdeHoldings()` ya entiende (`holding_name` /
 * `holding_weight` / `identifiers.isin`).
 *
 * Qué se copia y qué no: solo nombre, ISIN, ticker, peso, país y sector de
 * cada posición. Se dejan fuera los campos que el portal no lee (`holding_id`,
 * `raw_source`, `fund_asset_id`, `quality_flags`…) —cuatro quintas partes del
 * peso— y todo lo que el marco editorial prohíbe publicar: ratings, scores,
 * estrellas y analítica propietaria (ver CLAVES_PROHIBIDAS en proyecta.mjs).
 *
 * Simulación por defecto: sin `--escribir` no se envía nada a Firestore.
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { leeCsv, validaUniverso } from './universo.mjs';
import { clavesProhibidasEn } from './proyecta.mjs';
import { commitLotes, tokenGcloud, PROYECTO_ALFA } from './firestore-rest.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CSV = join(RAIZ, 'universo', 'universo-alfa.csv');
const SALIDA = join(RAIZ, 'output', 'mercado-alfa');

/** Origen declarado en cada documento. Etiqueta corta a propósito: la
 *  procedencia se declara sin nombrar bases ajenas dentro de datos públicos. */
export const FUENTE = 'BDB';
export const SCHEMA_DESGLOSE = 'nuvia-alfa-holdings.v1';

/** Presupuesto por documento. Firestore corta en 1 MiB; se deja margen para
 *  la cabecera y para el recuento propio de Firestore, que no es el de JSON. */
export const LIMITE_BYTES = 900_000;

/**
 * Solo fondos. Una acción no tiene cartera por dentro, y los ETF ya los cubre
 * el pipeline de EODHD (`holdingsEtf` en proyecta.mjs): el volcado no mejora
 * su desglose —las mismas diez mayores posiciones— y pisarlo solo cambiaría la
 * procedencia a peor. Cada dato con un único dueño. Con `--con-etf` se fuerza.
 */
const TIPOS_CON_CARTERA = new Set(['FUND']);
const TIPOS_CON_ETF = new Set(['FUND', 'ETF']);

/* ───────────────────────── lectura del volcado ───────────────────────── */

/**
 * Una fila de posición de la maestra → la forma mínima que lee el portal.
 * Devuelve null si le falta lo imprescindible (nombre o peso en porcentaje):
 * una posición sin peso no se completa ni se estima, se descarta.
 */
export function posicionMinima(h) {
  const name = h?.holding_name ?? h?.name ?? h?.raw_source?.name ?? null;
  const bruto = h?.holding_weight ?? h?.weight_pct ?? h?.raw_source?.weight ?? null;
  const unidad = h?.holding_weight_unit ?? null;
  if (name == null || !Number.isFinite(bruto)) return null;
  if (unidad != null && unidad !== 'percent') return null;
  return {
    name: String(name),
    isin: h.isin ?? h.identifiers?.isin ?? null,
    ticker: h.ticker ?? h.identifiers?.ticker ?? null,
    weight_pct: bruto,
    country: h.country ?? null,
    sector: h.sector ?? null,
    instrument_type: ['equity', 'stock', 'bond', 'cash', 'money_market', 'other'].includes(h.instrument_type)
      ? h.instrument_type : null,
  };
}

/** Peso del libro largo: lo único que el módulo de solapamiento normaliza a
 *  100 (los cortos se recortan a cero en `mapaNormalizado`). */
function pesoLargo(posiciones) {
  return posiciones.reduce((s, p) => s + Math.max(0, p.weight_pct), 0);
}

/**
 * Documento de desglose para NUVIA a partir de las filas ya reunidas de un
 * fondo (un `holdings/latest` o el manifiesto con todos sus trozos).
 *
 * `cobertura_pct` es la cifra honesta del documento: qué parte del fondo
 * describe de verdad. Vale ~100 con la cartera completa y mucho menos cuando
 * el origen solo trae las diez mayores posiciones, que es el caso de una
 * parte del volcado. El solapamiento renormaliza a 100 lo que reciba, así que
 * sin este número una cartera parcial se leería como si fuera entera.
 *
 * Si no cabe en el presupuesto de tamaño, se queda con las posiciones de
 * mayor peso que quepan y lo declara con `truncado: true`. Nunca se recorta
 * en silencio ni se completa lo que falta.
 */
export function documentoDesglose({ filas, asOfDate, limiteBytes = LIMITE_BYTES }) {
  const posiciones = filas.map(posicionMinima).filter(Boolean);
  if (!posiciones.length) return null;
  posiciones.sort((a, b) => b.weight_pct - a.weight_pct);
  const largoTotal = pesoLargo(posiciones);
  if (largoTotal <= 0) return null; // sin ninguna posición larga no hay nada que comparar

  const arma = (lista, truncado) => {
    const doc = {
      as_of_date: asOfDate ?? null,
      source: FUENTE,
      schema_version: SCHEMA_DESGLOSE,
      holdings_count: posiciones.length,
      cobertura_pct: Number(pesoLargo(lista).toFixed(4)),
      holdings: lista,
    };
    if (truncado) {
      doc.truncado = true;
      doc.cobertura_origen_pct = Number(largoTotal.toFixed(4));
    }
    return doc;
  };

  const completo = arma(posiciones, false);
  if (JSON.stringify(completo).length <= limiteBytes) return completo;

  // Búsqueda del corte: cuántas posiciones caben, de mayor a menor peso.
  let bajo = 1;
  let alto = posiciones.length;
  while (bajo < alto) {
    const medio = Math.ceil((bajo + alto) / 2);
    if (JSON.stringify(arma(posiciones.slice(0, medio), true)).length <= limiteBytes) bajo = medio;
    else alto = medio - 1;
  }
  return arma(posiciones.slice(0, bajo), true);
}

/**
 * Recorre el volcado NDJSON y reúne, para cada activo pedido, las filas de
 * `holdings/latest` o —si la cartera venía troceada— las de todos sus trozos.
 *
 * @param {string} ruta      fichero .ndjson o .ndjson.gz de la copia
 * @param {Set<string>} ids  activos del universo de NUVIA que interesan
 */
export async function leeDesgloses(ruta, ids) {
  const crudo = createReadStream(ruta);
  const flujo = ruta.endsWith('.gz') ? crudo.pipe(createGunzip()) : crudo;
  const lineas = createInterface({ input: flujo, crlfDelay: Infinity });
  const porActivo = new Map();
  let leidas = 0;
  let ajenas = 0;

  for await (const linea of lineas) {
    if (!linea.trim()) continue;
    leidas += 1;
    let fila;
    try { fila = JSON.parse(linea); } catch { continue; }
    const partes = String(fila.path || '').split('/');
    if (partes[0] !== 'assets' || partes[2] !== 'holdings') { ajenas += 1; continue; }
    const id = partes[1];
    if (!ids.has(id)) continue;

    const entrada = porActivo.get(id) || { filas: [], asOfDate: null, troceado: false };
    const datos = fila.data || {};
    if (partes.length === 4 && partes[3] === 'latest') {
      entrada.filas.push(...(datos.holdings || []));
      entrada.asOfDate = entrada.asOfDate ?? datos.as_of_date ?? null;
    } else if (partes.length === 4 && partes[3] === 'manifest') {
      entrada.asOfDate = entrada.asOfDate ?? datos.as_of_date ?? null;
      entrada.troceado = true;
    } else if (partes.length === 6 && partes[3] === 'manifest' && partes[4] === 'chunks') {
      entrada.filas.push(...(datos.holdings || []));
      entrada.troceado = true;
    } else {
      continue;
    }
    porActivo.set(id, entrada);
  }
  return { porActivo, leidas, ajenas };
}

/**
 * Qué rutas existen ya en la base de NUVIA. Lectura pública (las reglas de la
 * alfa permiten leer sin sesión), así que no hace falta token ni en seco.
 *
 * Se usa para no pisar nada: un desglose que ya está en la base tiene su
 * dueño —el pipeline de EODHD, o una copia anterior— y este script no lo
 * corrige ni lo reemplaza. Solo añade lo que falta.
 */
export async function rutasExistentes(rutas, { fetchFn = fetch, tamanoLote = 300 } = {}) {
  const prefijo = `projects/${PROYECTO_ALFA}/databases/(default)/documents/`;
  const url = `https://firestore.googleapis.com/v1/${prefijo}:batchGet`.replace('/documents/:batchGet', '/documents:batchGet');
  const existentes = new Set();
  for (let i = 0; i < rutas.length; i += tamanoLote) {
    const trozo = rutas.slice(i, i + tamanoLote);
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: trozo.map((r) => prefijo + r), mask: { fieldPaths: ['source'] } }),
    });
    if (!res.ok) throw new Error(`batchGet: ${res.status} ${await res.text()}`);
    for (const item of await res.json()) {
      if (item.found) existentes.add(item.found.name.slice(prefijo.length));
    }
  }
  return existentes;
}

/* ───────────────────────── orquestación ───────────────────────── */

function universoConCartera(conEtf = false) {
  const tipos = conEtf ? TIPOS_CON_ETF : TIPOS_CON_CARTERA;
  const { incluidas, errores } = validaUniverso(leeCsv(readFileSync(CSV, 'utf8')));
  if (errores.length) throw new Error(`El universo no valida:\n  · ${errores.join('\n  · ')}`);
  const mapa = new Map();
  for (const fila of incluidas) {
    if (tipos.has(fila.instrument_type)) mapa.set(fila.asset_id, fila);
  }
  return mapa;
}

function parseArgs(argv) {
  const args = { origen: null, escribir: false, limite: null, conEtf: false, reemplazar: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--origen') { args.origen = argv[i + 1]; i += 1; }
    else if (argv[i] === '--escribir') args.escribir = true;
    else if (argv[i] === '--con-etf') args.conEtf = true;
    else if (argv[i] === '--reemplazar') args.reemplazar = true;
    else if (argv[i] === '--limite') { args.limite = Number(argv[i + 1]); i += 1; }
  }
  return args;
}

async function principal() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.origen) {
    console.error('Falta --origen <ruta al volcado .ndjson o .ndjson.gz de la BBDD Activos Financieros>.');
    console.error('Es un fichero de copia que ya tienes en disco: este script nunca se conecta a esa base.');
    process.exit(2);
  }
  const ruta = resolve(args.origen);
  if (!existsSync(ruta)) throw new Error(`No existe el volcado: ${ruta}`);

  const universo = universoConCartera(args.conEtf);
  console.log(`Universo de NUVIA a cubrir: ${universo.size} ${args.conEtf ? 'fondos y ETF' : 'fondos (los ETF los cubre EODHD)'}`);
  console.log(`Volcado de origen (solo lectura): ${ruta}`);

  const { porActivo, leidas, ajenas } = await leeDesgloses(ruta, new Set(universo.keys()));
  console.log(`Líneas leídas: ${leidas} · fuera de assets/*/holdings: ${ajenas}`);

  const documentos = [];
  const sinDesglose = [];
  const truncados = [];
  const parciales = [];
  const fechas = {};
  for (const [id, entrada] of porActivo) {
    const doc = documentoDesglose({ filas: entrada.filas, asOfDate: entrada.asOfDate });
    if (!doc) { sinDesglose.push(id); continue; }
    const malas = clavesProhibidasEn(doc);
    if (malas.length) throw new Error(`${id}: el desglose lleva claves prohibidas (${malas.join(', ')}); no se publica.`);
    if (doc.truncado) truncados.push({ asset_id: id, publicadas: doc.holdings.length, total: doc.holdings_count, retenido_pct: Number((100 * doc.cobertura_pct / doc.cobertura_origen_pct).toFixed(2)) });
    if (doc.cobertura_pct < 95) parciales.push({ asset_id: id, posiciones: doc.holdings_count, cobertura_pct: doc.cobertura_pct });
    const mes = String(doc.as_of_date || '?').slice(0, 7);
    fechas[mes] = (fechas[mes] || 0) + 1;
    documentos.push({ ruta: `assets/${id}/holdings/latest`, objeto: doc });
  }
  documentos.sort((a, b) => a.ruta.localeCompare(b.ruta));

  // Nada de pisar lo que ya está: lo que existe en la base tiene dueño.
  const existentes = await rutasExistentes(documentos.map((d) => d.ruta));
  const respetados = documentos.filter((d) => existentes.has(d.ruta)).map((d) => d.ruta.split('/')[1]);
  const nuevos = args.reemplazar ? documentos : documentos.filter((d) => !existentes.has(d.ruta));
  if (respetados.length) {
    console.log(`Ya en la base, no se tocan: ${respetados.length}${args.reemplazar ? ' (--reemplazar: SE PISARÁN)' : ''}`);
  }
  const seleccion = args.limite ? nuevos.slice(0, args.limite) : nuevos;

  const posiciones = seleccion.reduce((s, d) => s + d.objeto.holdings.length, 0);
  const bytes = seleccion.reduce((s, d) => s + JSON.stringify(d.objeto).length, 0);
  const faltan = [...universo.keys()].filter((id) => !porActivo.has(id));

  console.log('');
  console.log(`Desgloses a escribir: ${seleccion.length} · ${posiciones} posiciones · ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Sin desglose en el volcado: ${faltan.length}${faltan.length && faltan.length <= 12 ? ` (${faltan.join(', ')})` : ''}`);
  if (sinDesglose.length) console.log(`Con filas pero ninguna utilizable: ${sinDesglose.join(', ')}`);
  if (truncados.length) {
    console.log(`Truncados por tamaño (se declara la cobertura en el documento): ${truncados.length}`);
    for (const t of truncados) console.log(`  · ${t.asset_id}: ${t.publicadas}/${t.total} posiciones, ${t.retenido_pct.toFixed(1)} % del libro largo`);
  }
  if (parciales.length) {
    console.log(`Carteras parciales (el origen no trae el detalle completo): ${parciales.length}`);
    console.log(`  cobertura media ${(parciales.reduce((s2, p2) => s2 + p2.cobertura_pct, 0) / parciales.length).toFixed(0)} % del fondo · queda declarada en cobertura_pct`);
  }
  console.log('Fecha del desglose:', Object.entries(fechas).sort().reverse().map(([m, n]) => `${m}:${n}`).join(' '));

  const resumen = {
    origen: ruta,
    proyecto_destino: PROYECTO_ALFA,
    escrito: args.escribir,
    desgloses: seleccion.length,
    posiciones,
    bytes,
    sin_desglose: faltan,
    respetados,
    truncados,
    parciales,
    fechas,
    generado_en: new Date().toISOString(),
  };

  if (!args.escribir) {
    console.log('');
    console.log('Simulación: no se ha escrito nada. Añade --escribir para publicar en NUVIA.');
  } else {
    const token = tokenGcloud();
    const informa = (n, de) => { if (n % 100 === 0 || n === de) console.log(`  ${n}/${de}`); };
    // Lotes cortos: un desglose pesa ~23 KB de media pero los troceados
    // rozan los 900 KB, y el commit tiene su propio límite de tamaño.
    const { escritos } = await commitLotes(seleccion, { token, informa, tamanoLote: 50 });
    if (escritos !== seleccion.length) throw new Error(`Recuento: ${escritos} escritos frente a ${seleccion.length} esperados`);
    console.log(`Escritos ${escritos} desgloses en ${PROYECTO_ALFA}.`);
    resumen.escritos = escritos;
  }

  // Resumen al margen de `publicable/`: esa carpeta es del pipeline de
  // precios y no debe llevar generaciones a medio cerrar de otro proceso.
  mkdirSync(SALIDA, { recursive: true });
  const destino = join(SALIDA, 'resumen-desgloses-bdb.json');
  writeFileSync(destino, `${JSON.stringify(resumen, null, 2)}\n`, 'utf8');
  console.log(`Resumen: ${destino}`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  principal().catch((e) => { console.error(e.message); process.exit(1); });
}
