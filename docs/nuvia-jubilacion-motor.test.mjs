/* Motor del simulador de jubilación · IRPF 2026 por territorio.
   Contrasta el cálculo con importes verificables a mano y con el caso práctico
   de la Hacienda Foral de Bizkaia (CASO-PRACTICO-EPSV-26). Desde el 04-10-2026
   cubre también Álava, Gipuzkoa, Navarra y el estatal (escala de referencia),
   la regresión exacta de Bizkaia y las entradas «en preparación». Cada cifra
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

/* ----------------------------------------------------- Regresión Bizkaia -- */
test('Bizkaia: regresión exacta del motor anterior (23-09-2026)', () => {
  // Valores producidos por el motor anterior con los mismos datos; Bizkaia no puede moverse.
  const r = M.calcular({});
  assert.equal(r.cfg.id, 'bizkaia', 'Bizkaia es el territorio por defecto');
  cerca(r.resumen.netoMensual, 2569.06946, 1e-4);
  cerca(r.anio1.impuesto, 5053.156984, 1e-4);
  assert.equal(r.escenarios[0].agotado, 25);
  const dfb = M.calcular({ pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true, epsvPre: 89000, epsvPreRent: 27000, epsvPost: 11000, epsvPostRent: 3000, epsvCobro: 'capital' }).capital;
  cerca(dfb.transitorio.impuesto, 15224.942857, 1e-4); cerca(dfb.nuevo.impuesto, 17401.962586, 1e-4); cerca(dfb.neto, 84775.057143, 1e-4);
  const g = M.calcular({ pension: 4000, fondos: 500000, fondosCoste: 200000, acciones: 300000, accionesCoste: 100000, seguros: 50000, segurosCoste: 40000, rentabilidad: 5, inflacion: 3, otrasDeducciones: 300 });
  cerca(g.resumen.netoMensual, 6533.634285, 1e-4); cerca(g.base.filas[5].impuesto, 23904.94121, 1e-4);
  const m = M.calcular({ edad: 60, edadJubilacion: 67, pension: 2200, tieneEpsv: true, epsvPre: 50000, epsvPreRent: 10000, epsvPost: 5000, epsvPostRent: 500, epsvCobro: 'mixto', epsvPctCapital: 30 });
  cerca(m.resumen.netoMensual, 3355.585773, 1e-4); cerca(m.capital.neto, 16239.775612, 1e-4);
});

/* ------------------------------------------------------ Álava y Gipuzkoa -- */
test('Álava y Gipuzkoa: misma escala, minoración, bonificación y deducción por edad que Bizkaia (NF 21/2025 y NF 6/2025)', () => {
  for (const t of ['alava', 'gipuzkoa']) {
    const x = M.irpf({ trabajo: 28000, edad: 65, territorio: t });
    assert.equal(x.bonificacion, 3000); cerca(x.total, 4481, .01, t);
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
  // 28.000 − 2.000 gastos = 26.000; sin reducción (≥ 19.747,5). Mínimo 5.550 (65 años no es «superior a 65»).
  // Estatal: escala(26.000) = 2.112,75 + 5.800 × 15 % = 2.982,75; escala(5.550) = 527,25; cuota 2.455,50. Autonómica de referencia: idéntica → total 4.911.
  const t = M.irpf({ trabajo: 28000, edad: 65, territorio: 'estatal' });
  assert.equal(t.gastos, 2000); assert.equal(t.reduccionTrabajo, 0); assert.equal(t.baseGeneral, 26000); cerca(t.total, 4911);
  cerca(t.marginalGeneral, .30);
  // A los 70: mínimo 6.700 → escala(6.700) = 636,50 → 2 × (2.982,75 − 636,50) = 4.692,50.
  cerca(M.irpf({ trabajo: 28000, edad: 70, territorio: 'estatal' }).total, 4692.5);
  // 15.000 de trabajo: neto 13.000 → reducción 7.302 → base 5.698; estatal 541,31 − 527,25 = 14,06; total 28,12.
  const b = M.irpf({ trabajo: 15000, edad: 65, territorio: 'estatal' });
  assert.equal(b.reduccionTrabajo, 7302); cerca(b.baseGeneral, 5698); cerca(b.total, 28.12);
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
  const m = M.calcular({ territorio: 'estatal', ccaa: 'madrid' });
  assert.equal(m.disponible, false); assert.equal(m.estado, 'en-preparacion'); assert.equal(m.resumen, null); assert.equal(m.escenarios.length, 0);
  assert.match(m.mensaje, /en preparación/);
  assert.equal(M.calcular({ territorio: 'marte' }).estado, 'desconocido');
  assert.equal(M.calcular({ territorio: null }).estado, 'sin-territorio');
  assert.equal(M.calcular({ territorio: 'estatal', ccaa: 'atlantida' }).estado, 'desconocida');
  assert.equal(M.calcular({ territorio: 'estatal' }).cfg.ccaa.id, 'referencia', 'Sin comunidad, el estatal usa la escala de referencia');
  assert.equal(F.CCAA.filter((c) => c.estado === 'verificada').length, 1, 'En la fase 1 solo calcula la escala de referencia');
  assert.equal(F.CCAA.length, 18, '15 comunidades de régimen común + Ceuta y Melilla + referencia');
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
