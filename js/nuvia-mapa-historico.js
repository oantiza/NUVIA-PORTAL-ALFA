/** Mapa descriptivo: mismas fechas, pesos iniciales y método para todos los puntos.
 * La clasificación y las posiciones internas de un instrumento no intervienen.
 */
import { periodoAnalizado } from './nuvia-periodo-analisis.js';

export const ACTIVOS_BENCHMARK = {
  bolsa: ['IE00B03HD191', 'IE00BYX5NX33'],
  bonos: ['LU0113257694', 'LU0132601682'],
};
export const IDS_BENCHMARK = [...ACTIVOS_BENCHMARK.bolsa, ...ACTIVOS_BENCHMARK.bonos];

const ANO_MS = 365.25 * 86400000;
const valida = (serie, fechas) => Array.isArray(serie?.values)
  && serie.values.length === fechas.length && fechas.length >= 3
  && serie.values.every(v => Number.isFinite(v) && v > 0);

/** Rentabilidades simples entre cierres. Anualización por frecuencia observada:
 * sigma = s(r) * sqrt(n / años); CAGR = (final / inicial) ** (1 / años) - 1.
 * Permite calendarios distintos sin inventar cierres ni aplicar 252 a datos semanales.
 */
export function puntoHistorico(niveles, fechas) {
  if (!periodoAnalizado(fechas) || !valida({ values: niveles }, fechas)) return null;
  const anos = (Date.parse(fechas.at(-1)) - Date.parse(fechas[0])) / ANO_MS;
  const retornos = niveles.slice(1).map((v, i) => v / niveles[i] - 1);
  const media = retornos.reduce((s, r) => s + r, 0) / retornos.length;
  const varianza = retornos.reduce((s, r) => s + (r - media) ** 2, 0) / (retornos.length - 1);
  const volatilidad = Math.sqrt(varianza * retornos.length / anos);
  const rentabilidad = (niveles.at(-1) / niveles[0]) ** (1 / anos) - 1;
  return Number.isFinite(volatilidad) && Number.isFinite(rentabilidad) ? { volatilidad, rentabilidad } : null;
}

function combina(series, pesos, fechasOrigen, fechas) {
  const indices = new Map(fechasOrigen.map((d, i) => [d, i]));
  const inicio = indices.get(fechas[0]);
  return fechas.map(d => series.reduce((suma, s) =>
    suma + pesos[s.asset_id] * s.values[indices.get(d)] / s.values[inicio], 0));
}

export function mapaHistorico({ posiciones = [], pesos = {}, series = [], fechas = [],
  benchmarks = null, perfiles = [], errorReferencias = false } = {}) {
  const total = Object.values(pesos).reduce((s, w) => s + (Number.isFinite(w) && w > 0 ? w : 0), 0);
  const nombres = new Map(posiciones.map(p => [p.activo.asset_id, p.activo.display_name || p.activo.asset_id]));
  const calendarioValido = Boolean(periodoAnalizado(fechas));
  const porId = new Map(series.map(s => [s.asset_id, s]));
  const incluidas = [], pendientes = [];
  for (const [id, w] of Object.entries(pesos)) {
    if (!Number.isFinite(w) || w <= 0) continue;
    const s = porId.get(id);
    if (calendarioValido && valida(s, fechas)) incluidas.push(s);
    else pendientes.push({ id, nombre: nombres.get(id) || id, peso: w / total,
      motivo: !s ? 'Sin historial disponible en el periodo solicitado'
        : 'La serie necesita al menos tres cierres positivos y fechas ordenadas' });
  }
  const pesoIncluido = incluidas.reduce((s, p) => s + pesos[p.asset_id], 0);
  const salida = { referencia: null, perfiles: [], fechas: [], pendientes,
    cobertura: total > 0 ? pesoIncluido / total : 0,
    nombreCartera: pendientes.length ? 'Parte con historial' : 'Tu combinación',
    avisoReferencias: '', referencias: [], huecos: 0 };
  if (!incluidas.length || pesoIncluido <= 0) return salida;
  const pesosCalculados = Object.fromEntries(incluidas.map(s => [s.asset_id, pesos[s.asset_id] / pesoIncluido]));
  let comunes = fechas;
  const refs = new Map((benchmarks?.series || []).map(s => [s.asset_id, s]));
  const fechasRef = benchmarks?.dates || [];
  const faltantes = IDS_BENCHMARK.filter(id => !valida(refs.get(id), fechasRef));
  let comparar = perfiles.length > 0 && Boolean(periodoAnalizado(fechasRef)) && !faltantes.length;
  if (comparar) {
    const fechasSet = new Set(fechasRef);
    const interseccion = fechas.filter(d => fechasSet.has(d));
    if (interseccion.length >= 3) comunes = interseccion;
    else {
      comparar = false;
      salida.avisoReferencias = 'Las referencias no tienen al menos tres cierres en las mismas fechas que la cartera. Se muestra la cartera con su propio historial.';
    }
  } else {
    salida.avisoReferencias = errorReferencias
      ? 'No se han podido cargar las referencias. La cartera se muestra con su propio historial.'
      : `Referencias históricas incompletas${faltantes.length ? ` (${faltantes.join(', ')})` : ''}. La cartera se muestra con su propio historial.`;
  }
  salida.fechas = comunes;
  salida.referencia = puntoHistorico(combina(incluidas, pesosCalculados, fechas, comunes), comunes);
  if (comparar) {
    salida.referencias = IDS_BENCHMARK;
    salida.perfiles = perfiles.map(({ nombre, tono, rv }) => {
      const w = Object.fromEntries([
        ...ACTIVOS_BENCHMARK.bolsa.map(id => [id, rv / 200]),
        ...ACTIVOS_BENCHMARK.bonos.map(id => [id, (100 - rv) / 200]),
      ]);
      const punto = puntoHistorico(combina(IDS_BENCHMARK.map(id => refs.get(id)), w, fechasRef, comunes), comunes);
      return punto ? { nombre, tono, rv, ...punto } : null;
    }).filter(Boolean);
  }
  salida.huecos = comunes.slice(1).filter((d, i) => Date.parse(d) - Date.parse(comunes[i]) > 7 * 86400000).length;
  return salida;
}
