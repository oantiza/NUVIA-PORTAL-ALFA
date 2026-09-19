/**
 * Cierres de los índices de referencia para «Mercados y noticias».
 *
 * Lee de Yahoo Finance (API pública de gráficos, sin clave) el último cierre,
 * el anterior y el primer cierre del año de seis índices, calcula la variación
 * diaria y la anual y escribe `data/index-quotes.json`. Después sustituye el
 * bloque marcado en `mercados.html` para que la página salga con las cifras
 * sin depender de JavaScript. Yahoo no es el publicador de los índices: se dice
 * en la propia tarjeta («Datos: Yahoo Finance · último cierre»), igual que el
 * panel de TradingView, que sigue disponible como gráfico en directo.
 *
 * Un fallo conserva la copia anterior con su fecha (nunca bloquea la
 * publicación). Uso: node scripts/update-index-quotes.mjs [--check]
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const dataPath = resolve(root, 'data/index-quotes.json');
const pagePath = resolve(root, 'mercados.html');

export const INDICES = [
  { id: 'ibex', symbol: '^IBEX', name: 'IBEX 35', region: 'España', lectura: 'Las 35 mayores empresas de la bolsa española.' },
  { id: 'stoxx50', symbol: '^STOXX50E', name: 'EURO STOXX 50', region: 'Eurozona', lectura: 'Las 50 grandes empresas de la zona euro.' },
  { id: 'dax', symbol: '^GDAXI', name: 'DAX 40', region: 'Alemania', lectura: 'Las 40 mayores empresas alemanas.' },
  { id: 'spx', symbol: '^GSPC', name: 'S&P 500', region: 'Estados Unidos', lectura: 'Las 500 mayores empresas de Estados Unidos.' },
  { id: 'nasdaq', symbol: '^IXIC', name: 'Nasdaq Composite', region: 'Estados Unidos', lectura: 'Bolsa estadounidense con peso de la tecnología.' },
  { id: 'nikkei', symbol: '^N225', name: 'Nikkei 225', region: 'Japón', lectura: 'Las 225 grandes empresas de la bolsa de Tokio.' },
];

const FUENTE = { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/markets/world-indices/' };

const numero = (digitos) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: digitos, maximumFractionDigits: digitos });
const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fechaLegible = (iso) => new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'Europe/Madrid' }).format(new Date(`${iso}T12:00:00Z`));
export const variacionLegible = (v, digitos = 2) => (typeof v !== 'number' || !Number.isFinite(v)) ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${numero(digitos).format(Math.abs(v))} %`;

async function serie(symbol, range) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  const respuesta = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (NUVIA-portal)' }, signal: AbortSignal.timeout(20000) });
  if (!respuesta.ok) throw new Error(`${symbol}: HTTP ${respuesta.status}`);
  const json = await respuesta.json();
  const r = json.chart?.result?.[0];
  if (!r) throw new Error(`${symbol}: respuesta sin datos (${json.chart?.error?.description ?? 'desconocido'})`);
  const cierres = r.indicators.quote[0].close;
  const tz = r.meta.exchangeTimezoneName || 'UTC';
  const fecha = (ts) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date(ts * 1000));
  return r.timestamp.map((ts, i) => ({ fecha: fecha(ts), cierre: cierres[i] })).filter((p) => typeof p.cierre === 'number' && Number.isFinite(p.cierre));
}

export async function obtenerCotizaciones() {
  const indices = [];
  const errores = [];
  for (const def of INDICES) {
    try {
      const [dias, anio] = await Promise.all([serie(def.symbol, '1mo'), serie(def.symbol, 'ytd')]);
      if (dias.length < 2) throw new Error(`${def.symbol}: menos de dos cierres`);
      const ultimo = dias[dias.length - 1];
      const previo = dias[dias.length - 2];
      const primero = anio[0];
      indices.push({
        ...def,
        cierre: Number(ultimo.cierre.toFixed(2)),
        fecha: ultimo.fecha,
        cierreAnterior: Number(previo.cierre.toFixed(2)),
        fechaAnterior: previo.fecha,
        variacionDia: Number((((ultimo.cierre - previo.cierre) / previo.cierre) * 100).toFixed(2)),
        variacionAnual: primero && primero.fecha < ultimo.fecha ? Number((((ultimo.cierre - primero.cierre) / primero.cierre) * 100).toFixed(2)) : null,
      });
    } catch (error) {
      errores.push(error.message);
    }
  }
  return { indices, errores };
}

export function renderCotizaciones(datos) {
  const filas = datos.indices.map((i) => `<li class="markets-quotes__row"><div class="markets-quotes__name" title="${escapar(i.lectura)}"><strong>${escapar(i.name)}</strong><span>${escapar(i.region)}</span></div><span class="markets-quotes__level">${numero(2).format(i.cierre)}</span><span class="markets-quotes__delta${i.variacionDia > 0 ? ' is-up' : i.variacionDia < 0 ? ' is-down' : ''}">${escapar(variacionLegible(i.variacionDia))}</span><span class="markets-quotes__ytd${i.variacionAnual > 0 ? ' is-up' : i.variacionAnual < 0 ? ' is-down' : ''}">${escapar(variacionLegible(i.variacionAnual, 1))}</span></li>`).join('');
  const fechas = [...new Set(datos.indices.map((i) => i.fecha))].sort();
  const cuando = fechas.length === 1 ? `Último cierre · ${fechaLegible(fechas[0])}` : `Últimos cierres · del ${fechaLegible(fechas[0])} al ${fechaLegible(fechas[fechas.length - 1])}`;
  return `<div class="markets-quotes" data-index-quotes>
      <p class="markets-quotes__when">${escapar(cuando)}</p>
      <ol class="markets-quotes__list" aria-label="Cierres de los índices de referencia"><li class="markets-quotes__head" aria-hidden="true"><span>Índice</span><span>Cierre</span><span>Día</span><span>En el año</span></li>${filas}</ol>
      <p class="markets-quotes__note">Datos: <a href="${escapar(datos.fuente.url)}" target="_blank" rel="noopener noreferrer">${escapar(datos.fuente.name)}</a> · cierres en puntos; variación diaria frente al cierre anterior y anual frente al primer cierre del año. El color solo señala el signo de la cifra.</p>
    </div>`;
}

export async function sincronizarCotizaciones({ comprobar = false } = {}) {
  const datos = JSON.parse(await readFile(dataPath, 'utf8'));
  const html = await readFile(pagePath, 'utf8');
  const patron = /(<!-- NUVIA INDICES: START -->)[\s\S]*?(<!-- NUVIA INDICES: END -->)/;
  if (!patron.test(html)) throw new Error('mercados.html no tiene el bloque NUVIA INDICES.');
  const siguiente = html.replace(patron, () => `<!-- NUVIA INDICES: START -->\n${renderCotizaciones(datos)}\n<!-- NUVIA INDICES: END -->`);
  if (siguiente !== html) {
    if (comprobar) throw new Error('mercados.html: ejecuta node scripts/update-index-quotes.mjs --sync para sincronizar las cotizaciones.');
    await writeFile(pagePath, siguiente, 'utf8');
  }
}

if (process.argv[1] && process.argv[1].endsWith('update-index-quotes.mjs')) {
  const soloSync = process.argv.includes('--sync');
  const comprobar = process.argv.includes('--check');
  try {
    if (!soloSync && !comprobar) {
      const { indices, errores } = await obtenerCotizaciones();
      if (indices.length < 4) throw new Error(`Solo ${indices.length} índices disponibles: ${errores.join(' · ')}`);
      await writeFile(dataPath, `${JSON.stringify({ checkedAt: new Date().toISOString(), fuente: FUENTE, indices }, null, 2)}\n`, 'utf8');
      console.log(`Cotizaciones actualizadas: ${indices.map((i) => `${i.name} ${i.cierre} (${variacionLegible(i.variacionDia)})`).join('; ')}${errores.length ? ` · sin respuesta: ${errores.join(' · ')}` : ''}`);
    }
    await sincronizarCotizaciones({ comprobar });
    if (comprobar) console.log('Cotizaciones: mercados.html sincronizado con data/index-quotes.json.');
  } catch (error) {
    console.error(`Cotizaciones no actualizadas: ${error.message}`);
    process.exitCode = 1;
  }
}
