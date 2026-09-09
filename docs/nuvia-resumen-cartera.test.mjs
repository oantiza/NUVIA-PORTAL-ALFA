import test from 'node:test';
import assert from 'node:assert/strict';
import { calculaResumenCartera as calcula, coberturaDesglose, geometriaPentagono } from '../js/nuvia-resumen-cartera.js';
import { serieCartera, pesosNormalizados, montaConstructor } from '../js/nuvia-constructor.js';
import { setImmediate as siguiente } from 'node:timers/promises';
import { metricasDesdeSerie } from '../js/nuvia-cartera.js';

const pos = (id, bruto, clase = 'EQUITY', tipo = 'FUND') => ({ activo: { asset_id: id, display_name: id, economic_asset_class: clase, instrument_type: tipo }, bruto });
const fechas = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'];
const historial = { dates: fechas, series: [
  { asset_id: 'A', values: [100, 110, 105, 120] },
  { asset_id: 'B', values: [100, 90, 95, 80] },
] };
const valores = r => r.ejes.map(e => e.valor);

test('el 60 % sin historial sigue siendo la mayor posición; el historial cubre el 40 %', () => {
  const posiciones = [pos('A', 60), pos('B', 40, 'FIXED_INCOME')];
  const r = calcula({ posiciones, historial: { ...historial, series: historial.series.slice(1) }, estadoHistorial: 'listo' });
  assert.deepEqual(valores(r).slice(0, 4), [60, 2, null, 40]);
  assert.equal(pesosNormalizados(posiciones, ['B']).B, 1, 'el análisis existente conserva su normalización');
  const g = geometriaPentagono(r.ejes);
  assert.equal(g.completo, false);
  assert.equal(g.puntos[2], null);
  assert.ok(g.segmentos.every(([a,b]) => a && b));
});

test('volatilidad idéntica a la serie del constructor, no media de volatilidades individuales', () => {
  const posiciones = [pos('A', 50), pos('B', 50)];
  const r = calcula({ posiciones, historial, estadoHistorial: 'listo' });
  const esperado = metricasDesdeSerie(serieCartera(historial.series, pesosNormalizados(posiciones))).volatilidad * 100;
  assert.equal(r.ejes[2].valor, esperado);
  assert.equal(esperado, 0, 'las dos series se compensan exactamente');
  assert.ok(metricasDesdeSerie(historial.series[0].values).volatilidad > 0);
  assert.equal(r.ejes[3].valor, 100);
  assert.equal(r.observaciones, 3);
});

test('vacío y pesos nulos, negativos, infinitos o no numéricos no inventan una cartera', () => {
  assert.equal(calcula(), null);
  assert.equal(calcula({ posiciones: [pos('A', 0), pos('B', -3), pos('C', NaN), pos('D', Infinity), pos('E', '50')] }), null);
});

test('no cuenta clases de posiciones sin peso ni convierte UNKNOWN en una clase conocida', () => {
  const r = calcula({ posiciones: [pos('A', 60), pos('B', 40, 'UNKNOWN'), pos('C', 0, 'FIXED_INCOME')] });
  assert.equal(r.ejes[1].valor, 1);
  assert.equal(r.sinClasificar, 40);
  assert.equal(r.posiciones, 2);
  assert.equal(calcula({ posiciones: [pos('A', 100, null)] }).ejes[1].valor, null);
});

test('fichas enriquecen la clasificación; duplicados no dividen la mayor posición', () => {
  const r = calcula({ posiciones: [pos('A', 30, null), pos('A', 30, null), pos('B', 40)], fichas: { A: { economic_asset_class: 'FIXED_INCOME' } } });
  assert.equal(r.posiciones, 2);
  assert.equal(r.ejes[0].valor, 60);
  assert.equal(r.ejes[1].valor, 2);
});

test('fecha inválida, serie incompleta y NaN no acreditan historial', () => {
  for (const h of [
    { ...historial, dates: ['2026-09-01', '2026-09-01', '2026-09-03', '2026-09-04'] },
    { ...historial, series: [{ asset_id: 'A', values: [100, 101] }] },
    { ...historial, series: [{ asset_id: 'A', values: [100, NaN, 102, 103] }] },
  ]) {
    const r = calcula({ posiciones: [pos('A', 100)], historial: h, estadoHistorial: 'listo' });
    assert.equal(r.ejes[2].valor, null);
    assert.equal(r.ejes[3].valor, 0);
  }
});

test('carga y error son desconocidos, consulta vacía confirmada es cobertura cero', () => {
  const posiciones = [pos('A', 100)];
  for (const estadoHistorial of ['cargando', 'error']) {
    assert.equal(calcula({ posiciones, estadoHistorial }).ejes[3].valor, null);
  }
  assert.equal(calcula({ posiciones, historial: { dates: [], series: [] }, estadoHistorial: 'listo' }).ejes[3].valor, 0);
});

test('desglose parcial se pondera sobre toda la cartera; acción directa cuenta por sí misma', () => {
  const r = calcula({ posiciones: [pos('A', 60), pos('B', 40, 'EQUITY', 'STOCK')], estadoDesglose: 'listo',
    desgloses: { A: { holdings: [{ name: 'Empresa 1', weight_pct: 20 }, { name: 'Empresa 2', weight_pct: 10 }], as_of_date: '2026-08-31' } } });
  assert.equal(r.ejes[4].valor, 58, '60 % × 30 % + 40 %');
  assert.deepEqual(r.fechasDesglose, ['2026-08-31']);
});

test('metadatos no sustituyen filas identificables y no se adivina la unidad', () => {
  assert.equal(coberturaDesglose({ cobertura_pct: 100 }), null);
  assert.equal(coberturaDesglose({ holdings: [{ holding_name: 'X', holding_weight: .2, holding_weight_unit: 'fraction' }] }), null);
  assert.equal(coberturaDesglose({ holdings: [{ holding_name: 'X', holding_weight: 20 }] }), null);
  assert.equal(coberturaDesglose({ holdings: [{ weight_pct: 20 }] }), null);
  assert.equal(coberturaDesglose({ holdings: [{ holding_name: 'X', holding_weight: 20, holding_weight_unit: 'percent' }] }), 20);
  assert.equal(coberturaDesglose({ cobertura_pct: 100, holdings: [{ name: 'X', weight_pct: 25 }] }), 25);
});

test('cotas de metadatos, duplicados, total incompatible y ceros', () => {
  assert.equal(coberturaDesglose({ top10_weight: 20, holdings: [{ name: 'X', weight_pct: 30 }] }), 20);
  assert.equal(coberturaDesglose({ holdings: [{ name: 'X', weight_pct: 25 }, { name: 'X', weight_pct: 25 }] }), 25);
  assert.equal(coberturaDesglose({ holdings: [{ name: 'X', weight_pct: 120 }] }), null);
  assert.equal(coberturaDesglose({ holdings: [{ name: 'X', weight_pct: 0 }] }), 0);
});

test('no atribuye cobertura a tipos desconocidos; error no es 100 % de calidad', () => {
  assert.equal(calcula({ posiciones: [pos('A', 100, 'EQUITY', 'UNKNOWN')], estadoDesglose: 'listo' }).ejes[4].valor, 0);
  assert.equal(calcula({ posiciones: [pos('A', 100)], estadoDesglose: 'error' }).ejes[4].valor, null);
  assert.equal(calcula({ posiciones: [pos('A', 100, 'EQUITY', 'STOCK')] }).ejes[4].valor, 100);
});

test('las escalas incluyen concentración del 100 % y volatilidad superior al 25 %', () => {
  const r = calcula({ posiciones: [pos('A', 100)], historial: { dates: fechas, series: [{ asset_id: 'A', values: [100, 200, 50, 250] }] }, estadoHistorial: 'listo', estadoDesglose: 'listo' });
  assert.equal(r.ejes[0].maximo, 100);
  assert.ok(r.ejes[2].valor > 25);
  assert.ok(r.ejes[2].maximo >= r.ejes[2].valor);
  const g = geometriaPentagono(r.ejes, 400);
  assert.equal(g.completo, true);
  assert.equal(g.segmentos.length, 5);
  assert.ok(g.puntos.every(p => p.every(Number.isFinite)));
});

// DOM mínimo para verificar el ciclo asíncrono del constructor sin navegador ni red.
class Nodo {
  constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.style = {}; this.eventos = {}; this.value = ''; this._texto = ''; this.classList = { toggle() {} }; }
  setAttribute(k,v) { this.attrs[k] = String(v); }
  append(...nodes) { this.children.push(...nodes); }
  addEventListener(k,fn) { (this.eventos[k] ||= []).push(fn); }
  set textContent(v) { this._texto = String(v); this.children = []; }
  get textContent() { return this._texto + this.children.map(n => n.textContent || '').join(' '); }
}
function preparaDom(t) {
  const doc = globalThis.document, fetchOriginal = globalThis.fetch;
  globalThis.document = { createElement: tag => new Nodo(tag), getElementById: () => null, addEventListener() {} };
  globalThis.fetch = async () => { throw Error('Red prohibida en pruebas'); };
  t.after(() => { globalThis.document = doc; globalThis.fetch = fetchOriginal; });
  const almacenamientoLocal = { getItem: () => null, setItem: () => assert.fail('No debe escribir'), removeItem: () => assert.fail('No debe borrar') };
  return { raiz: new Nodo('div'), destinoAnalisis: new Nodo('div'), almacenamientoLocal };
}

test('cambiar de composición descarta fichas y desgloses tardíos del resumen anterior', async t => {
  const opciones = preparaDom(t);
  let terminaA;
  const pendiente = new Promise(resolve => { terminaA = resolve; });
  const controlador = montaConstructor(opciones.raiz, { ...opciones, posicionesIniciales: [pos('A', 100)], cliente: {
    sesionActual: () => ({ tipo: 'alfa' }), nivelSesion: () => 'alfa',
    detalleActivo: id => id === 'A' ? pendiente : Promise.resolve({ asset_id: id, identity: { display_name: 'Vigente B' }, instrument_type: 'FUND' }),
    llama: async nombre => nombre === 'get_price_series' ? { dates: [], series: [] } : { holdings: {} },
  } });
  await controlador.cargaPosiciones([pos('B', 100)]);
  await siguiente();
  terminaA({ asset_id: 'A', identity: { display_name: 'Antigua A' }, instrument_type: 'FUND' });
  await siguiente();
  const resumen = opciones.destinoAnalisis.children.find(n => n.attrs.class === 'nv-resumen-cartera');
  assert.match(resumen.textContent, /Vigente B/);
  assert.doesNotMatch(resumen.textContent, /Antigua A/);
  assert.match(resumen.textContent, /100 %/);
});

test('vaciar la cartera invalida peticiones pendientes y retira el resumen anterior', async t => {
  const opciones = preparaDom(t);
  let termina;
  const pendiente = new Promise(resolve => { termina = resolve; });
  const controlador = montaConstructor(opciones.raiz, { ...opciones, posicionesIniciales: [pos('A', 100)], cliente: {
    sesionActual: () => ({ tipo: 'alfa' }), nivelSesion: () => 'alfa',
    detalleActivo: () => pendiente,
    llama: async () => ({ dates: [], series: [] }),
  } });
  await controlador.cargaPosiciones([]);
  termina({ asset_id: 'A', instrument_type: 'STOCK' });
  await siguiente();
  const resumen = opciones.destinoAnalisis.children.find(n => n.attrs.class === 'nv-resumen-cartera');
  assert.equal(resumen.hidden, true);
});
