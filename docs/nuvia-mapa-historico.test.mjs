import test from 'node:test';
import assert from 'node:assert/strict';
import { mapaHistorico, puntoHistorico, IDS_BENCHMARK } from '../js/nuvia-mapa-historico.js';
import { perfilesReferencia } from '../js/nuvia-analisis.js';

const fechas = ['2024-01-01', '2024-07-01', '2025-01-01'];
const precios = [100, 110, 99];
const mismoPunto = (actual, esperado) => {
  assert.ok(Math.abs(actual.volatilidad - esperado.volatilidad) < 1e-12);
  assert.ok(Math.abs(actual.rentabilidad - esperado.rentabilidad) < 1e-12);
};
const entrada = {
  posiciones: [{ activo: { asset_id: 'JPM', display_name: 'JPMorgan Europe Equity Plus' } }],
  pesos: { JPM: 1 }, series: [{ asset_id: 'JPM', values: precios }], fechas,
  perfiles: perfilesReferencia(),
  benchmarks: { dates: fechas, series: IDS_BENCHMARK.map((asset_id, i) => ({ asset_id, values: [100, 103 + i, 102 + i] })) },
};

test('el mapa acepta cualquier tipo y composición, incluido el JPMorgan con otras exposiciones negativas', () => {
  for (const tipo of ['FUND', 'ETF', 'STOCK', 'BOND', 'CRYPTO', 'OTHER', undefined]) {
    for (const mix of [null, { equity: .9012317, fixed_income: .0019168, cash: .1055205, other: -.008669 },
      { equity: 1.3, cash: -.3 }, { other: 1 }]) {
      const d = mapaHistorico({ ...entrada, posiciones: [{ activo: { asset_id: 'JPM', instrument_type: tipo, asset_mix: mix } }] });
      mismoPunto(d.referencia, puntoHistorico(precios, fechas));
      assert.equal(d.perfiles.length, 5);
      assert.equal(d.cobertura, 1);
      assert.deepEqual(d.pendientes, []);
    }
  }
});

test('anualiza con los años reales y la frecuencia observada, también para series no diarias', () => {
  const anos = 366 / 365.25;
  const p = puntoHistorico(precios, fechas);
  assert.ok(Math.abs(p.rentabilidad - (.99 ** (1 / anos) - 1)) < 1e-6);
  // Retornos +10 %, -10 %; varianza muestral 0,02; dos observaciones en ese año.
  assert.ok(Math.abs(p.volatilidad - Math.sqrt(.02 * 2 / anos)) < 1e-6);
  assert.equal(puntoHistorico([100, 100, 100], fechas).volatilidad, 0);
});

test('interseca fechas exactas y aplica los pesos en el comienzo común, sin arrastrar el reparto anterior', () => {
  const d = mapaHistorico({ ...entrada, pesos: { A: .5, B: .5 },
    fechas: ['2023-01-01', ...fechas], series: [
      { asset_id: 'A', values: [100, 200, 220, 240] },
      { asset_id: 'B', values: [100, 50, 50, 50] },
    ] });
  assert.deepEqual(d.fechas, fechas);
  mismoPunto(d.referencia, puntoHistorico([1, 1.05, 1.1], fechas));
  const esperado = puntoHistorico([1, .1 * 1.035 + .9 * 1.055, .1 * 1.025 + .9 * 1.045], fechas);
  assert.ok(Math.abs(d.perfiles[0].volatilidad - esperado.volatilidad) < 1e-12);
  assert.ok(Math.abs(d.perfiles[0].rentabilidad - esperado.rentabilidad) < 1e-12);
});

test('un fallo de referencias nunca borra el punto ni lo mezcla con supuestos', () => {
  for (const benchmarks of [null, { dates: fechas, series: entrada.benchmarks.series.slice(1) }]) {
    const d = mapaHistorico({ ...entrada, benchmarks, errorReferencias: true });
    mismoPunto(d.referencia, puntoHistorico(precios, fechas));
    assert.deepEqual(d.perfiles, []);
    assert.match(d.avisoReferencias, /propio historial/);
  }
});

test('sin fechas comunes conserva la cartera sola en su periodo original', () => {
  const d = mapaHistorico({ ...entrada, benchmarks: { ...entrada.benchmarks,
    dates: ['2020-01-01', '2020-07-01', '2021-01-01'] } });
  assert.deepEqual(d.fechas, fechas);
  assert.ok(d.referencia);
  assert.equal(d.perfiles.length, 0);
});

test('declara el peso original sin historial y etiqueta la parte calculada; los pesos cero no cuentan', () => {
  const d = mapaHistorico({ ...entrada, pesos: { JPM: 20, AUSENTE: 60, CERO: 0 } });
  assert.equal(d.cobertura, .25);
  assert.equal(d.nombreCartera, 'Parte con historial');
  assert.equal(d.pendientes[0].peso, .75);
  assert.equal(d.pendientes.length, 1);
  mismoPunto(d.referencia, puntoHistorico(precios, fechas));
});

test('no inventa series para datos vacíos, inválidos, desordenados o sin observaciones suficientes', () => {
  for (const values of [[100, NaN, 110], [100, 0, 110], [100, -10, 110], [100, 110], []]) {
    assert.equal(mapaHistorico({ ...entrada, series: [{ asset_id: 'JPM', values }] }).referencia, null);
  }
  assert.equal(mapaHistorico({ ...entrada, fechas: [...fechas].reverse() }).referencia, null);
  assert.equal(mapaHistorico({ ...entrada, fechas: [fechas[0], fechas[0], fechas[2]] }).referencia, null);
  assert.equal(mapaHistorico({ ...entrada, pesos: { JPM: 0 } }).referencia, null);
});
