import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticoCarteraSupuestos } from '../js/nuvia-analisis.js';

const posiciones = [
  { activo: { asset_id: 'A', display_name: 'Acción', economic_asset_class: 'EQUITY' } },
  { activo: { asset_id: 'M', display_name: 'Fondo mixto', economic_asset_class: 'MIXED' } },
];
const calcula = mix => diagnosticoCarteraSupuestos(posiciones, { A: .7, M: .3 }, [{ asset_id: 'M', asset_mix: mix }]);
test('desglose completo permite comparar; faltante identifica nombre y peso afectado', () => {
  assert.ok(calcula({ equity: .6, fixed_income: .4 }).referencia);
  const d = calcula(null);
  assert.equal(d.referencia, null);
  assert.equal(d.pesoPendiente, .3);
  assert.equal(d.pendientes[0].nombre, 'Fondo mixto');
});
test('no renormaliza coberturas parciales ni acepta cifras inválidas o alias duplicados', () => {
  for (const mix of [{ equity: .8 }, { equity: .8, other: .2 }, { equity: 1.1 },
    { equity: '1' }, { equity: 1, cash: null }, { equity: 1, cash: -.1 },
    { fixed_income: .5, bond: .5 }, { equity: NaN }, []]) {
    assert.equal(calcula(mix).referencia, null);
  }
  assert.ok(calcula({ equity: 1, other: 0 }).referencia);
});
test('un desglose parcial tampoco se sustituye por la clase genérica del fondo', () => {
  const d = diagnosticoCarteraSupuestos([{activo:{asset_id:'A',economic_asset_class:'EQUITY',asset_mix:{equity:.8}}}],{A:1});
  assert.equal(d.referencia,null);
  assert.equal(d.pesoPendiente,1);
});
