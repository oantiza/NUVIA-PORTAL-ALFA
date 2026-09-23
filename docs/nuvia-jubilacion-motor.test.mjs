/* Motor del simulador de jubilación · Bizkaia 2026.
   Contrasta el cálculo con importes verificables a mano y con el caso práctico
   de la Hacienda Foral de Bizkaia (CASO-PRACTICO-EPSV-26). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = {};
vm.runInNewContext(readFileSync(new URL('../js/nuvia-jubilacion-motor.js', import.meta.url), 'utf8'), ctx);
const M = ctx.NuviaJubilacion;
const cerca = (a, b, tol = 0.01, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} ≠ ${b}`);

test('IRPF: pensión de 2.000 € × 14 a los 65 años', () => {
  // 28.000 − bonificación 3.000 = 25.000; 18.080 × 23 % + 6.920 × 28 % = 6.096; − 1.615 = 4.481
  const t = M.irpf({ trabajo: 28000, edad: 65 });
  assert.equal(t.bonificacion, 3000);
  assert.equal(t.baseGeneral, 25000);
  cerca(t.total, 4481);
  assert.equal(t.marginalGeneral, .28);
});

test('IRPF: bonificación del trabajo y otras rentas', () => {
  assert.equal(M.bonificacionTrabajo(14000, 0), 8000);
  cerca(M.bonificacionTrabajo(23000, 0), 3000, .5);
  assert.equal(M.bonificacionTrabajo(14000, 8000), 3000, 'Con más de 7.500 € de otras rentas se limita a 3.000 €');
  assert.equal(M.bonificacionTrabajo(2000, 0), 2000, 'Nunca deja el rendimiento en negativo');
});

test('IRPF: minoración solo sobre la cuota general y escala del ahorro', () => {
  const t = M.irpf({ trabajo: 0, ahorro: 10000, edad: 60 });
  cerca(t.cuotaAhorro, 7500 * .19 + 2500 * .20);
  assert.equal(t.minoracion, 0, 'La minoración no reduce la cuota del ahorro');
});

test('IRPF: deducción por edad', () => {
  assert.equal(M.deduccionEdad(65, 15000), 0, 'Exige más de 65 años');
  assert.equal(M.deduccionEdad(70, 15000), 393);
  assert.equal(M.deduccionEdad(80, 15000), 714);
  cerca(M.deduccionEdad(70, 25000), 196.5);
  assert.equal(M.deduccionEdad(70, 30000), 0);
});

test('EPSV: caso práctico DFB 2026 en capital', () => {
  const dfb = { pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true,
    epsvPre: 89000, epsvPreRent: 27000, epsvPost: 11000, epsvPostRent: 3000, epsvCobro: 'capital' };
  const c = M.calcular(dfb).capital;
  // Régimen transitorio: 100.000 × 62/70 = 88.571,43 al 60 %; resto: 3.000 rentabilidad + 8.428,57 al 70 %.
  cerca(c.transitorio.bases.detalle.tramoPre, 88571.43, .01);
  cerca(c.transitorio.bases.general, 88571.43 * .6 + 8428.57 * .7, .02);
  cerca(c.transitorio.bases.ahorro, 3000);
  // Régimen 2026: 30.000 rentabilidad al ahorro; 70.000 × 70 % = 49.000 al trabajo.
  cerca(c.nuevo.bases.general, 49000);
  cerca(c.nuevo.bases.ahorro, 30000);
  assert.equal(c.elegido, c.transitorio.impuesto <= c.nuevo.impuesto ? 'transitorio' : 'nuevo');
  assert.ok(c.neto > 0 && c.neto < 100000);
});

test('EPSV: sin reducción si no es el primer cobro', () => {
  const c = M.calcular({ tieneEpsv: true, epsvPost: 100000, epsvPostRent: 20000, epsvCobro: 'capital', primerCobro: false, regimen: 'nuevo' }).capital;
  cerca(c.bases.general, 80000);
});

test('EPSV: renta temporal de 15 años exenta y limitada a su duración', () => {
  const r = M.calcular({ pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true,
    epsvPost: 100000, epsvPostRent: 30000, epsvRenta: 'temporal', epsvAniosRenta: 15 });
  const f = r.base.filas;
  assert.ok(f[0].retiradaEpsv > 0);
  cerca(f[0].retiradaEpsv, f[14].retiradaEpsv, .01, 'Cuantía constante');
  assert.equal(f[15].retiradaEpsv, 0, 'Termina con el contrato');
  assert.equal(f[0].irpf.ahorro, 0, 'Rentabilidad exenta');
  cerca(f[0].epsvRentExenta, f[0].retiradaEpsv * .3);
});

test('EPSV: estimación reglada sin certificado', () => {
  assert.equal(M.calcular({ tieneEpsv: true, epsvPost: 1000, epsvDesglose: 'estimacion', antiguedad: 20 }).resumen.ratioEpsv, .2);
  assert.equal(M.calcular({ tieneEpsv: true, epsvPost: 1000, epsvDesglose: 'estimacion', antiguedad: 50 }).resumen.ratioEpsv, .35);
  assert.equal(M.calcular({ tieneEpsv: true, epsvPost: 1000, epsvDesglose: 'estimacion', antiguedadConocida: false }).resumen.ratioEpsv, .25);
});

test('Retirada creciente: agota el capital justo al final', () => {
  const W = M.retiradaCreciente(200000, .03, .02, 30);
  let b = 200000; for (let k = 1; k <= 30; k++) b = b * 1.03 - W * 1.02 ** (k - 1);
  cerca(b, 0, .01);
});

test('Ejemplo inicial: cifras y coherencia del escenario base', () => {
  const r = M.calcular({});
  const y1 = r.anio1;
  cerca(y1.pension, 28000);
  cerca(y1.bruto, y1.pension + y1.retiradaAhorros + y1.retiradaEpsv, 1e-6);
  cerca(y1.neto, y1.bruto - y1.impuesto, 1e-6);
  cerca(r.resumen.pensionNetaMensual + r.resumen.restoNetoMensual, r.resumen.netoMensual, 1e-6, 'pensión neta + retiradas netas = total');
  cerca(r.base.saldoFinal, 0, 1);
  assert.equal(r.base.edadAgotado, null, 'El plan base dura hasta la edad elegida');
  cerca(r.base.filas[1].pension, 28000 * 1.02, 1e-6, 'La pensión se revaloriza con el IPC');
});

test('Escenarios: mismas retiradas, distinta duración', () => {
  const r = M.calcular({});
  const [con, base, opt, estres] = r.escenarios;
  cerca(con.filas[0].previsto, base.filas[0].previsto, 1e-6);
  assert.ok(con.edadAgotado && con.edadAgotado < 95, 'Con menos rentabilidad el dinero dura menos');
  assert.ok(opt.saldoFinal > 0, 'Con más rentabilidad sobra patrimonio');
  assert.equal(estres.clave, 'estres');
  assert.ok(estres.edadAgotado && estres.edadAgotado < 95);
});

test('Conservar el capital y fase previa a la jubilación', () => {
  const c = M.calcular({ estrategia: 'conservar' });
  const f = c.base.filas.at(-1);
  cerca(f.saldo / (f.deflactor * 1.02), 200000, 1, 'Mantiene el poder adquisitivo del capital');
  const a = M.calcular({ edad: 55, edadJubilacion: 65, ahorroAnual: 6000 });
  assert.ok(a.resumen.patrimonioJubilacion > 200000 * 1.03 ** 10);
  assert.ok(a.resumen.deflactor1 > 1.2, 'Euros de hoy descuentan diez años de IPC');
});

test('Avisos y límites', () => {
  assert.ok(M.avisos({ pension: 0, liquidez: 0, fondos: 0, acciones: 0 }).length);
  assert.equal(M.normalizar({ edad: 70, edadJubilacion: 60 }).edadJubilacion, 70);
  assert.equal(M.normalizar({ edad: 65, edadFin: 60 }).edadFin, 66);
});
