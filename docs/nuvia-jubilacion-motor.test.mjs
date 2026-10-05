/* Motor del simulador de jubilación · IRPF 2026 por territorio.
   Contrasta el cálculo con importes verificables a mano y con el caso práctico
   de la Hacienda Foral de Bizkaia (CASO-PRACTICO-EPSV-26). Desde el 04-10-2026
   cubre también Álava, Gipuzkoa, Navarra y el estatal (escala de referencia),
   la regresión exacta de Bizkaia y las entradas «en preparación». Desde el
   05-10-2026 (fase 2) cubre las 15 comunidades de régimen común, con su escala
   autonómica y, en siete de ellas, su mínimo del contribuyente propio. Cada cifra
   esperada se calcula a mano a partir de la norma citada en
   js/nuvia-jubilacion-fiscal.js, nunca a partir de la salida del motor. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = {};
for (const f of ['fiscal', 'motor']) vm.runInNewContext(readFileSync(new URL(`../js/nuvia-jubilacion-${f}.js`, import.meta.url), 'utf8'), ctx);
const M = ctx.NuviaJubilacion;
const F = ctx.NuviaJubilacionFiscal;
const cerca = (a, b, tol = 0.01, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} ≠ ${b}`);

test('IRPF: pensión de 2.000 € × 14 a los 65 años', () => {
  // 28.000 − bonificación 3.000 = 25.000; 18.080 × 23 % + 6.920 × 28 % = 6.096; − 1.615 = 4.481.
  // Edad cumplida a 31-12 (04-10-2026): a los 65 ya se aplica la deducción por edad, 393 × (30.000 − 25.000) / 10.000 = 196,50 → 4.284,50.
  const t = M.irpf({ trabajo: 28000, edad: 65 });
  assert.equal(t.bonificacion, 3000);
  assert.equal(t.baseGeneral, 25000);
  cerca(t.deduccionEdad, 196.5); cerca(t.total, 4284.5);
  cerca(M.irpf({ trabajo: 28000, edad: 64 }).total, 4481, .01, 'A los 64 no hay deducción por edad');
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

test('IRPF: deducción por edad (edad cumplida a 31 de diciembre)', () => {
  assert.equal(M.deduccionEdad(64, 15000), 0, 'Antes de cumplir 65 no hay deducción');
  assert.equal(M.deduccionEdad(65, 15000), 393, 'Se aplica ya en el año en que se cumplen 65 (art. 83 NF 13/2013; FAQ 900006436 HFB)');
  assert.equal(M.deduccionEdad(70, 15000), 393);
  assert.equal(M.deduccionEdad(74, 15000), 393);
  assert.equal(M.deduccionEdad(75, 15000), 714, 'La mayor, desde el año en que se cumplen 75');
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

/* ----------------------------------------------------- Regresión Bizkaia -- */
test('Bizkaia: regresión exacta del motor (23-09-2026, refijada el 04-10-2026 por la regla de edad a 31-12)', () => {
  // La refactorización por territorios no movió ninguna cifra de Bizkaia (17 casos comparados campo a campo, 0 diferencias).
  // El 04-10-2026 se corrigió la deducción por edad (se aplica ya a los 65 y a los 75 cumplidos): solo cambian los casos
  // con un año a esas edades y base ≤ 30.000 €. Caso inicial: año 1 a los 65 con base 25.000 + ahorro ≈ 1.600 → deducción ≈ 134 €.
  const r = M.calcular({});
  assert.equal(r.cfg.id, 'bizkaia', 'Bizkaia es el territorio por defecto');
  cerca(r.resumen.netoMensual, 2575.58228, 1e-4);
  cerca(r.anio1.impuesto, 4975.003139, 1e-4);
  cerca(r.anio1.impuesto, 5053.156984 - r.anio1.irpf.deduccionEdad, 1e-4, 'Respecto al 23-09 solo cambia la deducción por edad del año 1');
  assert.equal(r.escenarios[0].agotado, 25);
  // Caso DFB: el cobro no tiene deducción (base > 30.000 €), pero el año «sin cobro» ahora sí la tiene (393 €): el coste del cobro sube 393 €.
  const dfb = M.calcular({ pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true, epsvPre: 89000, epsvPreRent: 27000, epsvPost: 11000, epsvPostRent: 3000, epsvCobro: 'capital' }).capital;
  cerca(dfb.transitorio.impuesto, 15224.942857 + 393, 1e-4); cerca(dfb.nuevo.impuesto, 17794.373086, 1e-4, 'régimen 2026: +392,41 € (la iteración del neto mueve ligeramente los intereses del año)'); cerca(dfb.neto, 84775.057143 - 393, 1e-4);
  const g = M.calcular({ pension: 4000, fondos: 500000, fondosCoste: 200000, acciones: 300000, accionesCoste: 100000, seguros: 50000, segurosCoste: 40000, rentabilidad: 5, inflacion: 3, otrasDeducciones: 300 });
  cerca(g.resumen.netoMensual, 6533.634285, 1e-4); cerca(g.base.filas[5].impuesto, 23904.94121, 1e-4);
  const m = M.calcular({ edad: 60, edadJubilacion: 67, pension: 2200, tieneEpsv: true, epsvPre: 50000, epsvPreRent: 10000, epsvPost: 5000, epsvPostRent: 500, epsvCobro: 'mixto', epsvPctCapital: 30 });
  cerca(m.resumen.netoMensual, 3355.585773, 1e-4); cerca(m.capital.neto, 16239.775612, 1e-4);
});

/* ------------------------------------------------------ Álava y Gipuzkoa -- */
test('Álava y Gipuzkoa: misma escala, minoración, bonificación y deducción por edad que Bizkaia (NF 21/2025 y NF 6/2025)', () => {
  for (const t of ['alava', 'gipuzkoa']) {
    const x = M.irpf({ trabajo: 28000, edad: 65, territorio: t });
    assert.equal(x.bonificacion, 3000); cerca(x.total, 4284.5, .01, t); cerca(M.irpf({ trabajo: 28000, edad: 64, territorio: t }).total, 4481, .01, t);
    cerca(M.irpf({ trabajo: 0, ahorro: 10000, edad: 60, territorio: t }).cuotaAhorro, 7500 * .19 + 2500 * .20, .01, t);
    assert.equal(M.deduccionEdad(70, 15000, t), 393);
    cerca(M.deduccionEdad(70, 25000, t), 393 - .0393 * 5000, .01, t); // art. 83.2: 393 − 0,0393 × (BI − 20.000)
    const r = M.calcular({ territorio: t });
    cerca(r.resumen.netoMensual, M.calcular({}).resumen.netoMensual, 1e-6, t + ' sin EPSV coincide con Bizkaia');
  }
});

test('Álava y Gipuzkoa: la exención de la rentabilidad en renta no supera el 40 % de la renta (arts. 9.44 NF 33/2013 y 9.39 NF 3/2014)', () => {
  // Pago anual 10.000 € con 50 % de rentabilidad: 5.000 € de rentabilidad; exentos como máximo 4.000 €; 1.000 € a la base del ahorro.
  for (const t of ['alava', 'gipuzkoa']) {
    const rp = F.rentaPeriodica(F.configuracion(t), 10000, .5, true);
    cerca(rp.exento, 4000); cerca(rp.ahorro, 1000); cerca(rp.trabajo, 5000);
  }
  const b = F.rentaPeriodica(F.configuracion('bizkaia'), 10000, .5, true);
  cerca(b.exento, 5000, .01, 'Bizkaia: sin tope (art. 9.38 NF 13/2013)'); assert.equal(b.ahorro, 0);
  // Con 30 % de rentabilidad (por debajo del tope) los tres territorios coinciden.
  for (const t of ['alava', 'gipuzkoa']) cerca(F.rentaPeriodica(F.configuracion(t), 10000, .3, true).exento, 3000);
  // En la proyección: renta temporal de 15 años con 60 % de rentabilidad certificada deja el exceso en el ahorro en Álava, no en Bizkaia.
  const e = { pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true, epsvPost: 100000, epsvPostRent: 60000, epsvRenta: 'temporal', epsvAniosRenta: 15 };
  const fa = M.calcular(Object.assign({ territorio: 'alava' }, e)).base.filas[0], fb = M.calcular(e).base.filas[0];
  cerca(fa.epsvRentExenta, .4 * fa.retiradaEpsv, .01); cerca(fa.irpf.ahorro, .2 * fa.retiradaEpsv, .01);
  cerca(fb.epsvRentExenta, .6 * fb.retiradaEpsv, .01); assert.equal(fb.irpf.ahorro, 0);
});

/* --------------------------------------------------------------- Navarra -- */
test('Navarra: escala general (art. 59.1), deducción por trabajo (art. 62.5) y mínimo personal (art. 62.9) de 2026', () => {
  // Pensión 2.000 × 14 = 28.000 a los 65 años. Escala: 4.458 × 13 % + 5.572 × 22 % + 11.145 × 25 % + 6.825 × 28 % = 6.502,63.
  // Deducción por trabajo: 700 € (tramo 17.500,01–35.000). Mínimo personal: 1.084 + 264 (≥ 65) + [1.280 − 0,0904 × (28.000 − 17.500)] = 1.678,80.
  // Cuota: 6.502,63 − 700 − 1.678,80 = 4.123,83.
  const t = M.irpf({ trabajo: 28000, edad: 65, territorio: 'navarra' });
  cerca(t.cuotaGeneralBruta, 6502.63); cerca(t.deduccionTrabajo, 700); cerca(t.minimoPersonal, 1678.8); cerca(t.total, 4123.83);
  assert.equal(t.marginalGeneral, .28);
  const P = F.configuracion('navarra').parametros;
  assert.equal(F.deduccionTrabajoNavarra(P, 12500), 1400);
  cerca(F.deduccionTrabajoNavarra(P, 15000), 1400 - .14 * 2500);   // 1.050
  cerca(F.deduccionTrabajoNavarra(P, 40000), 700 - .02 * 5000);     // 600
  assert.equal(F.deduccionTrabajoNavarra(P, 60000), 400);
  cerca(F.minimoPersonalNavarra(P, 70, 10000), 1084 + 264 + 1280);
  cerca(F.minimoPersonalNavarra(P, 76, 31000), 1084 + 585 + (150 - .075 * 1000));
  assert.equal(F.minimoPersonalNavarra(P, 60, 40000), 1084);
  // La deducción por trabajo no supera la escala aplicada al rendimiento: 3.000 € de trabajo → escala 390 € < 1.400 €.
  cerca(M.irpf({ trabajo: 3000, edad: 60, territorio: 'navarra' }).deduccionTrabajo, 390);
  // Escala del ahorro (art. 60): 10.000 € → 6.000 × 20 % + 4.000 × 22 % = 2.080.
  cerca(M.irpf({ trabajo: 0, ahorro: 10000, edad: 60, territorio: 'navarra' }).cuotaAhorro, 2080);
});

test('Navarra: plan de pensiones en capital con la reducción del 40 % solo sobre aportaciones anteriores a 2018 (DT 25.ª)', () => {
  const base = { territorio: 'navarra', pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true, epsvPre: 60000, epsvPost: 40000, epsvCobro: 'capital' };
  const c = M.calcular(base).capital;
  assert.equal(c.opciones.length, 1, 'Un solo régimen');
  cerca(c.bases.general, 100000 - .4 * 60000); assert.equal(c.bases.ahorro, 0); cerca(c.bases.detalle.reduccion, 24000);
  // Fuera de la ventana temporal (o sin dos años) no hay reducción.
  cerca(M.calcular(Object.assign({}, base, { primerCobro: false })).capital.bases.general, 100000);
  cerca(M.calcular(Object.assign({}, base, { dosAnios: false })).capital.bases.general, 100000);
  // Impuesto del cobro: escala(76.000) = 20.818,61 + 9.131 × 44 % = 24.836,25; deducción por trabajo 400 (rendimiento íntegro 100.000);
  // mínimo personal 1.084 + 264 (65 años); el ahorro del año (intereses del neto) queda absorbido igual con y sin cobro.
  const sinInteres = M.calcular(Object.assign({}, base, { rentabilidad: 0 })).capital;
  cerca(sinInteres.impuesto, 24836.25 - 400 - 1348, .01);
  // En renta, todo es trabajo: no hay parte en el ahorro ni exenta, aunque se elija renta temporal.
  const r = M.calcular(Object.assign({}, base, { epsvCobro: 'renta', epsvRenta: 'temporal' })).base.filas[0];
  assert.equal(r.irpf.ahorro, 0); assert.equal(r.epsvRentExenta, 0); cerca(r.epsvTrabajo, r.retiradaEpsv, 1e-6);
  assert.equal(M.normalizar(base).epsvPreRent, 0, 'Fuera del modelo vasco no hay desglose de rentabilidad');
});

/* --------------------------------------------------------------- Estatal -- */
test('Estatal · escala de referencia: gastos (art. 19.2.f), reducción (art. 20), mínimo a escala (arts. 57, 63 y 65)', () => {
  // 28.000 − 2.000 gastos = 26.000; sin reducción (≥ 19.747,5). A los 64, mínimo 5.550.
  // Estatal: escala(26.000) = 2.112,75 + 5.800 × 15 % = 2.982,75; escala(5.550) = 527,25; cuota 2.455,50. Autonómica de referencia: idéntica → total 4.911.
  const t = M.irpf({ trabajo: 28000, edad: 64, territorio: 'estatal' });
  assert.equal(t.gastos, 2000); assert.equal(t.reduccionTrabajo, 0); assert.equal(t.baseGeneral, 26000); cerca(t.total, 4911);
  cerca(t.marginalGeneral, .30);
  // Desde el año en que se cumplen 65 (edad a 31-12): mínimo 6.700 → escala(6.700) = 636,50 → 2 × (2.982,75 − 636,50) = 4.692,50. Igual a los 70.
  cerca(M.irpf({ trabajo: 28000, edad: 65, territorio: 'estatal' }).total, 4692.5);
  cerca(M.irpf({ trabajo: 28000, edad: 70, territorio: 'estatal' }).total, 4692.5);
  // Desde los 75: mínimo 8.100 → escala(8.100) = 769,50 → 2 × (2.982,75 − 769,50) = 4.426,50.
  cerca(M.irpf({ trabajo: 28000, edad: 75, territorio: 'estatal' }).total, 4426.5);
  cerca(M.irpf({ trabajo: 28000, edad: 74, territorio: 'estatal' }).total, 4692.5);
  // 15.000 de trabajo a los 64: neto 13.000 → reducción 7.302 → base 5.698; estatal 541,31 − 527,25 = 14,06; total 28,12. A los 65 el mínimo (6.700) cubre toda la base: 0.
  const b = M.irpf({ trabajo: 15000, edad: 64, territorio: 'estatal' });
  assert.equal(b.reduccionTrabajo, 7302); cerca(b.baseGeneral, 5698); cerca(b.total, 28.12);
  cerca(M.irpf({ trabajo: 15000, edad: 65, territorio: 'estatal' }).total, 0);
  // Tramos b) y c) del art. 20: 16.000 → 7.302 − 1,75 × 1.148 = 5.293; 19.000 → 2.364,34 − 1,14 × 1.326,48 = 852,15.
  const P = F.configuracion('estatal').parametros;
  cerca(F.reduccionTrabajoComun(P, 16000, 0), 7302 - 1.75 * 1148); cerca(F.reduccionTrabajoComun(P, 19000, 0), 2364.34 - 1.14 * 1326.48);
  assert.equal(F.reduccionTrabajoComun(P, 16000, 7000), 0, 'Sin reducción si otras rentas superan 6.500 €');
  // Solo ahorro 10.000 €: 6.000 × 19 % + 4.000 × 21 % = 1.980; el mínimo (5.550) se aplica al ahorro: 1.054,50 → 925,50.
  cerca(M.irpf({ trabajo: 0, ahorro: 10000, edad: 60, territorio: 'estatal' }).total, 925.5);
  assert.equal(JSON.stringify(F.escalaGeneralVisible(F.configuracion('estatal'))), JSON.stringify([[0, .19], [12450, .24], [20200, .30], [35200, .37], [60000, .45], [300000, .47]]));
});

test('Estatal: plan de pensiones en capital con el 40 % de la DT 12.ª solo sobre aportaciones anteriores a 2007', () => {
  const base = { territorio: 'estatal', pension: 2000, tieneEpsv: true, epsvPre: 60000, epsvPost: 40000, epsvCobro: 'capital' };
  const c = M.calcular(base).capital;
  cerca(c.bases.general, 76000); assert.equal(c.bases.ahorro, 0); assert.equal(c.opciones.length, 1);
  cerca(M.calcular(Object.assign({}, base, { primerCobro: false })).capital.bases.general, 100000);
  assert.ok(c.impuesto > 0 && c.neto < 100000);
});

/* ------------------------------------------------ Entradas sin verificar -- */
test('Una comunidad «en preparación», un territorio desconocido o vacío no calculan', () => {
  // Desde el 05-10-2026 ninguna comunidad real está «en preparación»: se comprueba con una entrada ficticia que solo existe en esta prueba.
  const ficticia = { id: 'prueba-en-preparacion', nombre: 'Comunidad de prueba', estado: 'en-preparacion' };
  F.CCAA.push(ficticia);
  try {
    const m = M.calcular({ territorio: 'estatal', ccaa: ficticia.id });
    assert.equal(m.disponible, false); assert.equal(m.estado, 'en-preparacion'); assert.equal(m.resumen, null); assert.equal(m.escenarios.length, 0);
    assert.match(m.mensaje, /en preparación/);
    // Una entrada con escala pero sin estado 'verificada' tampoco calcula.
    ficticia.escalaAutonomica = F.ESCALAS.ESCALA_ART65;
    assert.equal(M.calcular({ territorio: 'estatal', ccaa: ficticia.id }).estado, 'en-preparacion');
  } finally { F.CCAA.pop(); }
  assert.equal(M.calcular({ territorio: 'marte' }).estado, 'desconocido');
  assert.equal(M.calcular({ territorio: null }).estado, 'sin-territorio');
  assert.equal(M.calcular({ territorio: 'estatal', ccaa: 'atlantida' }).estado, 'desconocida');
  assert.equal(M.calcular({ territorio: 'estatal' }).cfg.ccaa.id, 'referencia', 'Sin comunidad, el estatal usa la escala de referencia');
  assert.equal(F.CCAA.filter((c) => c.estado === 'verificada').length, 16, 'Fase 2 (05-10-2026): la referencia y las 15 comunidades calculan');
  assert.equal(F.CCAA.length, 16, '15 comunidades de régimen común + referencia');
  assert.ok(!F.CCAA.some((c) => /ceuta|melilla/i.test(c.id)), 'Ceuta y Melilla no se ofrecen (fuera de alcance por decisión del fundador)');
  assert.equal(F.FUERA_DE_ALCANCE.map((x) => x.id).join(','), 'ceuta,melilla');
  assert.equal(M.calcular({ territorio: 'estatal', ccaa: 'ceuta' }).estado, 'desconocida', 'Un parámetro ceuta en la URL no calcula');
  assert.ok(F.limites(F.configuracion('estatal')).some((l) => /Ceuta y Melilla quedan fuera/.test(l)), 'El límite se declara en el estatal');
});

test('Navarra y estatal: plazos de la gestora verificados (art. 10 RD 304/2004)', () => {
  for (const t of ['navarra', 'estatal']) {
    const tr = F.territorio(t).tramitacion;
    assert.equal(tr.estado, 'verificada', t);
    assert.match(tr.plazo, /15 días hábiles/); assert.match(tr.plazo, /7 días hábiles/); assert.match(tr.plazo, /30 días hábiles/);
    assert.ok(F.territorio(t).fuentes.some((f) => /BOE-A-2004-3453/.test(f.href)), t + ': cita el RD 304/2004 en el BOE');
  }
});

test('Módulo fiscal: cada territorio verificado cita fuentes con fecha y declara sus límites', () => {
  for (const t of F.TERRITORIOS) {
    assert.equal(t.estado, 'verificada', t.id);
    assert.ok(t.fuentes.length >= 4 && t.fuentes.every((f) => /^https:\/\//.test(f.href)), t.id + ': fuentes');
    assert.equal(t.consulta, '04-10-2026');
    const cfg = F.configuracion(t.id);
    assert.ok(F.limites(cfg).some((l) => /deducciones autonómicas del régimen común ni deducciones propias de los territorios forales/.test(l)), t.id + ': límite común');
    assert.ok(F.resumenParametros(cfg).length >= 4);
  }
  assert.ok(F.limites(F.configuracion('estatal')).some((l) => /referencia del art\. 65/.test(l)));
  assert.ok(F.limites(F.configuracion('navarra')).some((l) => /art\. 68/.test(l)));
});

/* ------------------------------------------- Fase 2 · 15 comunidades -- */
/* Escalas autonómicas 2026: texto consolidado de cada ley en el BOE (consulta
   05-10-2026), contrastado con «Tributación Autonómica. Medidas 2026» del
   Ministerio de Hacienda (23-09-2026). Las cifras esperadas salen de esas
   tablas, calculadas a mano; nunca de la salida del motor. */

// Cuota íntegra publicada al inicio de cada tramo (columna «Cuota íntegra» de la ley).
const CUOTAS_PUBLICADAS = {
  andalucia: [0, 1235, 2207, 4322, 8910],
  aragon: [0, 1241.89, 2218.39, 4580.89, 7455.79, 8993.29, 13593.29, 15993.29, 25993.29],
  asturias: [0, 1120.5, 1751.36, 3893.36, 7810.16, 11377.62, 15877.62, 37127.62],
  baleares: [0, 900, 1800, 3510, 6660, 10840, 15190, 22015, 35077.5],
  canarias: [0, 1237.32, 1889.83, 4200.11, 8203.88, 16593.85, 24213.1],
  cantabria: [0, 1105, 1985, 4044, 8508, 15258],
  'castilla-la-mancha': [0, 1182.75, 2112.75, 4362.75, 8950.75],
  'castilla-y-leon': [0, 1120.5, 2050.5, 4150.5, 7518.83],
  cataluna: [0, 1187.5, 2375, 4135, 7935, 15890, 22940, 36415],
  valenciana: [0, 1056, 2226, 3686, 5386, 7326, 9516, 11956, 19264, 32939, 47114],
  extremadura: [0, 964.88, 1720.5, 2360.5, 4285.5, 9493.5, 14240.5, 18800.5, 23945.5],
  galicia: [0, 1168.68, 2110.38, 4215.96, 8779.16],
  madrid: [0, 1135.79, 1739.53, 3841.42, 7651.1],
  murcia: [0, 1182.75, 2050.75, 3886.15, 8540.15],
  rioja: [0, 996, 1817.5, 3857.5, 4711.9, 6541.9, 8441.9, 23141.9],
};

test('Fase 2: las 15 comunidades verificadas, con fuente oficial fechada, nota y aritmética de la escala comprobada', () => {
  const comunidades = F.CCAA.filter((c) => !c.referencia);
  assert.equal(comunidades.length, 15);
  assert.equal(F.CCAA[0].id, 'referencia', 'La escala de referencia sigue siendo la primera opción');
  assert.equal(F.CCAA[0].nombre, 'Escala de referencia (art. 65 LIRPF)');
  for (const c of comunidades) {
    assert.equal(c.estado, 'verificada', c.id);
    assert.match(c.fuente.href, /^https:\/\/www\.boe\.es\/buscar\/act\.php\?id=/, c.id + ': texto consolidado en el BOE');
    assert.equal(c.fuente.consulta, '05-10-2026', c.id);
    assert.ok(c.nota && /No incluye deducciones autonómicas/.test(c.nota), c.id + ': nota con el límite');
    const pub = CUOTAS_PUBLICADAS[c.id];
    assert.equal(pub.length, c.escalaAutonomica.length, c.id + ': mismo número de tramos que la ley');
    c.escalaAutonomica.forEach(([desde], i) => cerca(F.escala(desde, c.escalaAutonomica).cuota, pub[i], .006, c.id + ' tramo ' + i));
    // La ley de la comunidad encabeza las fuentes del simulador, las guías y el informe; la referencia conserva las del estatal.
    const cfg = F.configuracion('estatal', c.id);
    assert.equal(cfg.fuentes[0].href, c.fuente.href, c.id); assert.match(cfg.fuentes[0].d, /Consultada el 05-10-2026/);
    assert.equal(cfg.fuentes.length, F.territorio('estatal').fuentes.length + 1);
    assert.ok(F.limites(cfg).some((l) => l.startsWith('La escala autonómica aplicada es la ' + c.de)), c.id + ': límite');
    assert.match(c.de, /^(de|del) /, c.id + ': forma con artículo');
    assert.equal(F.consultaFuentes(cfg), 'el 04-10-2026; la ley autonómica ' + c.de + ', el 05-10-2026', c.id + ': fecha de la fuente');
    assert.equal(cfg.fuentes[0].consulta, '05-10-2026', c.id);
    assert.ok(F.limites(cfg).some((l) => /deducciones autonómicas del régimen común/.test(l)), c.id + ': deducciones autonómicas fuera');
  }
  assert.equal(JSON.stringify(F.configuracion('estatal', 'referencia').fuentes), JSON.stringify(F.territorio('estatal').fuentes));
  assert.equal(F.consultaFuentes(F.configuracion('estatal', 'referencia')), 'el 04-10-2026', 'La referencia conserva una sola fecha');
  assert.equal(F.consultaFuentes(F.configuracion('navarra')), 'el 04-10-2026');
  assert.equal(F.deComunidad(F.comunidad('asturias')), 'del Principado de Asturias'); assert.equal(F.deComunidad(F.comunidad('baleares')), 'de las Illes Balears');
  assert.match(F.textos(F.configuracion('estatal', 'valenciana')).ambito, /con la escala autonómica de la Comunitat Valenciana\./);
  assert.equal(F.CCAA.filter((c) => c.minimoAutonomico).map((c) => c.id).join(','), 'andalucia,asturias,baleares,canarias,valenciana,galicia,madrid');
});

test('Fase 2: pensión de 28.000 € a los 64 años en cada comunidad (escala estatal + autonómica, menos el mínimo a escala)', () => {
  // Común a todas: 28.000 − 2.000 gastos = 26.000 de base (sin reducción del art. 20). Parte estatal: 2.982,75 − escala(5.550) 527,25 = 2.455,50.
  const casos = {
    andalucia: 4847.45,            // 13.000 × 9,5 % + 8.100 × 12 % + 4.900 × 15 % = 2.942; mínimo propio 5.790 × 9,5 % = 550,05 → 2.391,95
    aragon: 4865.1375,             // 13.072,50 × 9,5 % + 8.137,50 × 12 % + 4.790 × 15 % = 2.936,8875; 5.550 × 9,5 % = 527,25 → 2.409,6375
    asturias: 4818.406,            // 12.450 × 9 % + 5.257,20 × 12 % + 8.292,80 × 14 % = 2.912,356; mínimo propio 6.105 × 9 % = 549,45 → 2.362,906
    baleares: 4896,                // 10.000 × 9 % + 8.000 × 11,25 % + 8.000 × 14,25 % = 2.940; a los 64 el mínimo es 5.550 × 9 % = 499,50 → 2.440,50
    canarias: 4761.71,             // 13.748 × 9 % + 5.674 × 11,5 % + 6.578 × 14 % = 2.810,75; mínimo propio 5.606 × 9 % = 504,54 → 2.306,21
    cantabria: 4693.75,            // 13.000 × 8,5 % + 8.000 × 11 % + 5.000 × 14,5 % = 2.710; 5.550 × 8,5 % = 471,75 → 2.238,25
    'castilla-la-mancha': 4911,    // misma escala que el art. 65: 2.982,75 − 527,25 = 2.455,50 (igual que la escala de referencia)
    'castilla-y-leon': 4818.5,     // 12.450 × 9 % + 7.750 × 12 % + 5.800 × 14 % = 2.862,50; 5.550 × 9 % = 499,50 → 2.363
    cataluna: 4943.25,             // 12.500 × 9,5 % + 9.500 × 12,5 % + 4.000 × 16 % = 3.015; 5.550 × 9,5 % = 527,25 → 2.487,75
    valenciana: 4728.26,           // 12.000 × 8,8 % + 10.000 × 11,7 % + 4.000 × 14,6 % = 2.810; mínimo propio 6.105 × 8,8 % = 537,24 → 2.272,76
    extremadura: 4700.875,         // 12.450 × 7,75 % + 7.750 × 9,75 % + 4.000 × 16 % + 1.800 × 17,5 % = 2.675,50; 5.550 × 7,75 % = 430,125 → 2.245,375
    galicia: 4779.648725,          // 12.985,35 × 9 % + 8.083,25 × 11,65 % + 4.931,40 × 14,9 % = 2.845,158725; mínimo propio 5.789 × 9 % = 521,01 → 2.324,148725
    madrid: 4584.11868,            // 13.362,22 × 8,5 % + 5.642,41 × 10,7 % + 6.995,37 × 12,8 % = 2.634,93393; mínimo propio 5.956,65 × 8,5 % = 506,31525 → 2.128,61868
    murcia: 4750.4,                // 12.450 × 9,5 % + 7.750 × 11,2 % + 5.800 × 13,3 % = 2.822,15; 5.550 × 9,5 % = 527,25 → 2.294,90
    rioja: 4617.8,                 // 12.450 × 8 % + 7.750 × 10,6 % + 5.800 × 13,6 % = 2.606,30; 5.550 × 8 % = 444 → 2.162,30
  };
  assert.equal(Object.keys(casos).length, 15);
  for (const [id, esperado] of Object.entries(casos)) {
    const t = M.irpf({ trabajo: 28000, edad: 64, territorio: 'estatal', ccaa: id });
    assert.equal(t.baseGeneral, 26000, id); assert.equal(t.minimoPersonal, 5550, id + ': la parte estatal conserva el mínimo del art. 57');
    cerca(t.total, esperado, .01, id);
    const r = M.calcular({ territorio: 'estatal', ccaa: id });
    assert.equal(r.disponible !== false, true, id + ': calcula'); assert.ok(r.resumen && r.resumen.netoMensual > 0, id);
  }
});

test('Fase 2: mínimo autonómico propio a los 65 años (solo en la parte autonómica; la estatal sigue con 6.700 €)', () => {
  // Parte estatal a los 65: 2.982,75 − escala(6.700) 636,50 = 2.346,25.
  const casos = {
    andalucia: [6990, 4624.2],          // 5.790 + 1.200 = 6.990 → 6.990 × 9,5 % = 664,05; 2.942 − 664,05 = 2.277,95
    asturias: [7370, 4595.306],         // 6.105 + 1.265 = 7.370 → 7.370 × 9 % = 663,30; 2.912,356 − 663,30 = 2.249,056
    baleares: [7370, 4622.95],          // lectura AEAT: 6.105 + 1.265 = 7.370 → 663,30; 2.940 − 663,30 = 2.276,70
    canarias: [6768, 4547.88],          // 5.606 + 1.162 = 6.768 → 609,12; 2.810,75 − 609,12 = 2.201,63
    valenciana: [7370, 4507.69],        // 6.105 + 1.265 = 7.370 → 7.370 × 8,8 % = 648,56; 2.810 − 648,56 = 2.161,44
    galicia: [6988, 4562.488725],       // 5.789 + 1.199 = 6.988 → 628,92; 2.845,158725 − 628,92 = 2.216,238725
    madrid: [7190.91, 4369.95658],      // 5.956,65 + 1.234,26 = 7.190,91 → 7.190,91 × 8,5 % = 611,22735; 2.634,93393 − 611,22735 = 2.023,70658
  };
  for (const [id, [minimoA, esperado]] of Object.entries(casos)) {
    const t = M.irpf({ trabajo: 28000, edad: 65, territorio: 'estatal', ccaa: id });
    assert.equal(t.minimoPersonal, 6700, id); cerca(t.minimoAutonomico, minimoA, 1e-9, id); cerca(t.total, esperado, .01, id);
    assert.match(t.desglose.general.find((x) => x.clave === 'minimo').etiqueta, /estatal 6\.700 € · autonómico/, id);
  }
  // Desde los 75: Madrid 7.190,91 + 1.502,58 = 8.693,49; Baleares 7.370 + 1.540 = 8.910; Andalucía 6.990 + 1.460 = 8.450.
  cerca(M.irpf({ trabajo: 28000, edad: 75, territorio: 'estatal', ccaa: 'madrid' }).minimoAutonomico, 8693.49, 1e-9);
  cerca(M.irpf({ trabajo: 28000, edad: 75, territorio: 'estatal', ccaa: 'baleares' }).minimoAutonomico, 8910, 1e-9);
  cerca(M.irpf({ trabajo: 28000, edad: 76, territorio: 'estatal', ccaa: 'andalucia' }).minimoAutonomico, 8450, 1e-9);
  // Baleares a los 64: sin incremento, 5.550 como el estatal (la etiqueta no distingue partes).
  assert.equal(M.irpf({ trabajo: 28000, edad: 64, territorio: 'estatal', ccaa: 'baleares' }).minimoAutonomico, 5550);
  const cfgM = F.configuracion('estatal', 'madrid');
  assert.ok(F.resumenParametros(cfgM).some((l) => l.includes('mínimo propio de la Comunidad de Madrid (art. 56.3): 5.956,65 € (7.190,91 € desde los 65 y 8.693,49 € desde los 75)')));
  assert.ok(F.limites(cfgM).some((l) => /^La escala autonómica aplicada es la de la Comunidad de Madrid, con su mínimo del contribuyente propio en la parte autonómica/.test(l)));
});

test('Fase 2: el mínimo autonómico en la base del ahorro (arts. 56.2, 66 y 76)', () => {
  // Madrid, solo ahorro 10.000 € a los 60: escala conjunta 6.000 × 19 % + 4.000 × 21 % = 1.980 (990 estatal + 990 autonómica).
  // Estatal: 990 − 5.550 × 9,5 % (527,25) = 462,75. Autonómica: 990 − 5.956,65 × 9,5 % (565,88175) = 424,11825. Total 886,86825.
  cerca(M.irpf({ trabajo: 0, ahorro: 10000, edad: 60, territorio: 'estatal', ccaa: 'madrid' }).total, 886.86825, 1e-6);
  // Base general 5.700 € (trabajo 15.002: 13.002 − 7.302) y 2.000 € de ahorro, Madrid a los 60.
  // Estatal: el mínimo 5.550 cabe en la general → 5.700 × 9,5 % − 527,25 = 14,25; ahorro 2.000 × 9,5 % = 190.
  // Autonómica: 5.700 del mínimo propio absorben toda la general (0) y 256,65 pasan al ahorro: 190 − 256,65 × 9,5 % = 165,61825.
  const x = M.irpf({ trabajo: 15002, ahorro: 2000, edad: 60, territorio: 'estatal', ccaa: 'madrid' });
  cerca(x.baseGeneral, 5700, 1e-9); cerca(x.cuotaGeneral, 14.25, 1e-6); cerca(x.cuotaAhorro, 190 + 165.61825, 1e-6); cerca(x.total, 369.86825, 1e-6);
  // Con la escala de referencia el mismo caso da exactamente lo de antes: 14,25 × 2 + 2.000 × 19 % = 408,50.
  cerca(M.irpf({ trabajo: 15002, ahorro: 2000, edad: 60, territorio: 'estatal' }).total, 408.5, 1e-9);
  cerca(M.irpf({ trabajo: 0, ahorro: 10000, edad: 60, territorio: 'estatal' }).total, 925.5, 1e-9);
});

test('Fase 2: regresión · la referencia y las comunidades sin mínimo propio calculan exactamente como antes', () => {
  // Castilla-La Mancha tiene la misma escala que el art. 65 y no tiene mínimo propio: todo debe coincidir con la referencia.
  const entradas = [{}, { edad: 60, edadJubilacion: 67, pension: 2200, fondos: 300000, fondosCoste: 200000 }, { pension: 1500, tieneEpsv: true, epsvPre: 60000, epsvPost: 40000, epsvCobro: 'capital' }, { pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, otrasDeducciones: 0 }];
  for (const e of entradas) {
    const ref = M.calcular(Object.assign({ territorio: 'estatal', ccaa: 'referencia' }, e)), clm = M.calcular(Object.assign({ territorio: 'estatal', ccaa: 'castilla-la-mancha' }, e));
    assert.equal(clm.resumen.netoMensual, ref.resumen.netoMensual); assert.equal(clm.anio1.impuesto, ref.anio1.impuesto);
    assert.equal(JSON.stringify(clm.base.filas.map((f) => f.impuesto)), JSON.stringify(ref.base.filas.map((f) => f.impuesto)));
  }
  for (const id of ['referencia', 'aragon', 'cantabria', 'castilla-la-mancha', 'castilla-y-leon', 'cataluna', 'extremadura', 'murcia', 'rioja']) {
    const cfg = F.configuracion('estatal', id);
    assert.equal(cfg.minimoAutonomico, null, id);
    const t = F.irpf(cfg, { trabajo: 28000, edad: 70 });
    assert.equal(t.minimoAutonomico, t.minimoPersonal, id); assert.match(t.desglose.general.find((x) => x.clave === 'minimo').etiqueta, /^Mínimo personal a escala \(6\.700 €\)$/, id);
    assert.ok(F.resumenParametros(cfg).some((l) => /se aplica «a escala» en la parte estatal y en la autonómica\.$/.test(l)), id);
  }
});
