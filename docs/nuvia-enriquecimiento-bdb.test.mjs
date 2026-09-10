import test from 'node:test';
import assert from 'node:assert/strict';
import { asignacionGlobalOriginal, costesPublicos, conservaEnriquecimientoFondo, exposicionesPublicas } from '../scripts/mercado-alfa/enriquecimiento-bdb.mjs';
import { diagnosticoCarteraSupuestos } from '../js/nuvia-analisis.js';

test('la asignación global suma las exposiciones adicionales sin perder bolsa', () => {
  const dato = (netAllocation) => ({ netAllocation });
  const original = { portfolioDateGlobal: '2026-06-30T05:00:00', globalAllocationMap: {
    assetAllocEquity: dato('20.72252'), assetAllocFixedIncome: dato('76.39175'),
    assetAllocCash: dato('2.88573'), assetAllocConvertible: dato('0'),
    assetAllocPreferred: dato('0'), assetAllocOther: dato('0'),
  } };
  assert.deepEqual(asignacionGlobalOriginal(original).asset_mix,
    { equity: 0.2072252, fixed_income: 0.7639175, cash: 0.0288573, other: 0 });
});

test('una asignación incompleta no se completa ni se normaliza', () => {
  assert.equal(asignacionGlobalOriginal({ globalAllocationMap: {
    assetAllocEquity: { netAllocation: 80 }, assetAllocFixedIncome: { netAllocation: 10 },
  } }), null);
});

test('los costes conservan sus conceptos y exponen fracciones compatibles', () => {
  assert.deepEqual(costesPublicos({ management_fee_pct: 1.5, ter_pct: 1.8, mifid_ongoing_pct: 1.75 }, '2026-06-30'), {
    source: 'BDB', as_of_date: '2026-06-30', management_fee_pct: 1.5, ter_pct: 1.8,
    mifid_ongoing_pct: 1.75, management_fee: 0.015, ongoing_charge: 0.018,
  });
});

test('el enriquecimiento se conserva en una actualización posterior de precios', () => {
  const actual = { instrument_type: 'FUND', exposures: { source: 'csv-clase' }, costs: {}, quality: { warnings: ['precios'] } };
  const existente = { data_enrichment: { system: 'BDB' }, exposures: { source: 'BDB' }, costs: { ter_pct: 1.2 }, quality: { warnings: ['datos'] } };
  const resultado = conservaEnriquecimientoFondo(actual, existente);
  assert.equal(resultado.exposures.source, 'BDB');
  assert.equal(resultado.costs.ter_pct, 1.2);
  assert.deepEqual(resultado.quality.warnings, ['precios', 'datos']);
});

test('la categoría de un fondo sin composición no se usa como si fuera su reparto', () => {
  const posicion = { activo: { asset_id: 'F', instrument_type: 'FUND', economic_asset_class: 'EQUITY' } };
  const resultado = diagnosticoCarteraSupuestos([posicion], { F: 1 });
  assert.equal(resultado.referencia, null);
  assert.equal(resultado.pendientes[0].id, 'F');
});

test('regiones y sectores conservan fracciones y fecha de procedencia', () => {
  const resultado = exposicionesPublicas({ asignacion: { as_of_date: '2026-06-30', basis: 'net', asset_mix: { equity: 1, fixed_income: 0, cash: 0, other: 0 }, detail: {} }, maestra: {
    portfolio_exposure: { equity_regions: { eurozone: 1 }, sectors: { financial_services: 1 } },
  } });
  assert.equal(resultado.regions.eurozone, 1);
  assert.equal(resultado.sectors_as_of_date, '2026-06-30');
});
