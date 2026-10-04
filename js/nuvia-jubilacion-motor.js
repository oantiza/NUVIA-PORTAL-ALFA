/* ============================================================================
   NUVIA · Motor del simulador de jubilación · IRPF 2026 por territorio
   ----------------------------------------------------------------------------
   Cálculo puro, sin DOM. Se usa en jubilacion.html (navegador), en las guías
   y en docs/nuvia-jubilacion-motor.test.mjs (Node). Expone
   globalThis.NuviaJubilacion. Necesita js/nuvia-jubilacion-fiscal.js cargado
   antes (globalThis.NuviaJubilacionFiscal): de ahí salen TODOS los parámetros
   y reglas fiscales; aquí no hay ninguna cifra tributaria.

   Qué calcula, en una frase: proyecta año a año la pensión pública
   (revalorizada con el IPC), las retiradas de tus ahorros y de tu EPSV o plan
   de pensiones y el IRPF que pagarías cada año con la normativa del
   territorio elegido (Bizkaia, Álava, Gipuzkoa, Navarra o territorio común),
   y lo expresa en euros de cada año y en euros de hoy.

   Territorio: entrada.territorio ('bizkaia' por defecto) y, en el estatal,
   entrada.ccaa ('referencia' por defecto). Una entrada no verificada o
   desconocida no calcula: calcular() devuelve { disponible: false, … }.
   ========================================================================== */
(function (global) {
  'use strict';

  const F = () => global.NuviaJubilacionFiscal;

  /* Ajustes del simulador que no son fiscales. */
  const AJUSTES = Object.freeze({ estres: [-.12, -.05], diferencialEscenarios: .015 });

  /* Referencia demográfica aproximada: años de vida restantes por edad y sexo. */
  const TABLA_VIDA = { 50: [33.0, 37.6], 55: [28.5, 33.1], 60: [24.1, 28.5], 65: [19.9, 24.0], 70: [16.1, 19.9], 75: [12.7, 16.0], 80: [9.7, 12.6], 85: [7.1, 9.4], 90: [5.0, 6.6], 95: [3.4, 4.4] };

  const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, num(v, a)));
  const pos = (v) => Math.max(0, num(v));

  /* ---------------------------------------------------------------- IRPF --- */
  /* IRPF de un año en el territorio de cfg. trabajo = pensión + parte de la
     previsión que es rendimiento del trabajo; ahorro = intereses, ganancias y
     rentabilidad no exenta; trabajoBruto = trabajo antes de reducciones. */
  const irpf = (cfg, rentas) => F().irpf(cfg, rentas);

  /* ------------------------------------------------------- Horizonte ------- */
  function esperanzaVida(edad, sexo) {
    const a = clamp(edad, 40, 110); const k = Object.keys(TABLA_VIDA).map(Number); const j = sexo === 'mujer' ? 1 : 0;
    if (a <= k[0]) return TABLA_VIDA[k[0]][j] + (k[0] - a) * .8;
    if (a >= k[k.length - 1]) return Math.max(.5, TABLA_VIDA[95][j] - (a - 95) * .4);
    for (let i = 0; i < k.length - 1; i++) if (a >= k[i] && a <= k[i + 1]) {
      const r = (a - k[i]) / (k[i + 1] - k[i]); return TABLA_VIDA[k[i]][j] + r * (TABLA_VIDA[k[i + 1]][j] - TABLA_VIDA[k[i]][j]);
    }
    return 20;
  }

  /* Retirada del primer año que agota el capital C en n años, con rentabilidad
     r y retiradas que crecen al ritmo g (pagos al final de cada año). */
  function retiradaCreciente(C, r, g, n) {
    const c = pos(C), N = Math.max(1, Math.round(num(n, 1)));
    if (!c) return 0;
    if (Math.abs(r - g) < 1e-10) return c * (1 + r) / N;
    const d = 1 - Math.pow((1 + g) / (1 + r), N);
    return Math.abs(d) < 1e-12 ? c / N : c * (r - g) / d;
  }

  /* ------------------------------------------------------- Normalización --- */
  const DEFECTO = Object.freeze({
    territorio: 'bizkaia', ccaa: 'referencia',
    edad: 65, sexo: 'hombre', edadJubilacion: 65, pension: 2000,
    horizonte: 'edad', edadFin: 95, margen: 5, estrategia: 'consumir',
    liquidez: 50000, depositos: 0, fondos: 100000, fondosCoste: 75000, acciones: 50000, accionesCoste: 40000, seguros: 0, segurosCoste: 0,
    ahorroAnual: 0,
    tieneEpsv: false, epsvPre: 0, epsvPreRent: 0, epsvPost: 0, epsvPostRent: 0,
    epsvDesglose: 'certificado', antiguedadConocida: true, antiguedad: 20,
    epsvCobro: 'renta', epsvPctCapital: 50, epsvRenta: 'flexible', epsvAniosRenta: 15,
    contingencia: 'jubilacion', primerCobro: true, dosAnios: true, regimen: 'auto',
    rentabilidad: 3, inflacion: 2, otrasDeducciones: 0, estres: true,
  });

  function configuracion(territorio, ccaa) {
    return F().configuracion(territorio === undefined ? DEFECTO.territorio : territorio, ccaa === undefined ? DEFECTO.ccaa : ccaa);
  }

  function normalizar(entrada) {
    const s = Object.assign({}, DEFECTO, entrada || {});
    const o = {};
    o.territorio = typeof s.territorio === 'string' ? s.territorio : null;
    o.ccaa = typeof s.ccaa === 'string' ? s.ccaa : null;
    const cfg = F().configuracion(o.territorio, o.ccaa);
    const pv = cfg ? cfg.parametros.prevision : null;
    const vasco = !!pv && pv.modelo === 'vasco';
    o.edad = Math.round(clamp(s.edad, 40, 95));
    o.sexo = s.sexo === 'mujer' ? 'mujer' : 'hombre';
    o.edadJubilacion = Math.round(clamp(s.edadJubilacion, o.edad, 75));
    o.pension = pos(s.pension);
    o.horizonte = s.horizonte === 'esperanza' ? 'esperanza' : 'edad';
    o.margen = Math.round(clamp(s.margen, 0, 20));
    o.estrategia = s.estrategia === 'conservar' ? 'conservar' : 'consumir';
    for (const k of ['liquidez', 'depositos', 'fondos', 'fondosCoste', 'acciones', 'accionesCoste', 'seguros', 'segurosCoste', 'ahorroAnual', 'otrasDeducciones']) o[k] = pos(s[k]);
    o.tieneEpsv = !!s.tieneEpsv;
    o.epsvPre = o.tieneEpsv ? pos(s.epsvPre) : 0; o.epsvPost = o.tieneEpsv ? pos(s.epsvPost) : 0;
    /* Fuera del modelo vasco no hay desglose de rentabilidad: todo el cobro es trabajo. */
    o.epsvPreRent = vasco ? Math.min(o.epsvPre, pos(s.epsvPreRent)) : 0; o.epsvPostRent = vasco ? Math.min(o.epsvPost, pos(s.epsvPostRent)) : 0;
    o.epsvDesglose = vasco && s.epsvDesglose === 'estimacion' ? 'estimacion' : 'certificado';
    o.antiguedadConocida = s.antiguedadConocida !== false;
    o.antiguedad = Math.round(clamp(s.antiguedad, 1, 60));
    o.epsvCobro = ['renta', 'capital', 'mixto'].includes(s.epsvCobro) ? s.epsvCobro : 'renta';
    o.epsvPctCapital = o.epsvCobro === 'capital' ? 100 : o.epsvCobro === 'renta' ? 0 : clamp(s.epsvPctCapital, 5, 95);
    o.epsvRenta = ['flexible', 'temporal', 'vitalicia'].includes(s.epsvRenta) ? s.epsvRenta : 'flexible';
    o.epsvAniosRenta = Math.round(clamp(s.epsvAniosRenta, pv ? pv.rentaMinimaAnios : 15, 40));
    o.contingencia = vasco ? (s.contingencia || 'jubilacion') : 'jubilacion';
    o.primerCobro = s.primerCobro !== false; o.dosAnios = s.dosAnios !== false;
    o.regimen = vasco && ['auto', 'transitorio', 'nuevo'].includes(s.regimen) ? s.regimen : (vasco ? 'auto' : 'reduccion');
    o.rentabilidad = clamp(s.rentabilidad, -2, 10) / 100;
    o.inflacion = clamp(s.inflacion, 0, 6) / 100;
    o.estres = s.estres !== false;
    const esperanza = esperanzaVida(o.edad, o.sexo);
    o.esperanza = esperanza;
    const fin = o.horizonte === 'esperanza' ? Math.ceil(o.edad + esperanza + o.margen) : Math.round(num(s.edadFin, 95));
    o.edadFin = Math.round(clamp(fin, o.edadJubilacion + 1, 110));
    o.aniosHastaJubilacion = o.edadJubilacion - o.edad;
    o.aniosPlan = o.edadFin - o.edadJubilacion;
    return o;
  }

  function avisos(entrada) {
    const s = Object.assign({}, DEFECTO, entrada || {}); const a = [];
    if (num(s.edadJubilacion) < num(s.edad)) a.push('La edad de jubilación no puede ser anterior a tu edad actual: se usa tu edad actual.');
    if (s.horizonte !== 'esperanza' && num(s.edadFin) <= Math.max(num(s.edad), num(s.edadJubilacion))) a.push('La edad hasta la que planificas debe ser posterior a la jubilación.');
    const cfg = F().configuracion(typeof s.territorio === 'string' ? s.territorio : null, s.ccaa);
    const vasco = !!cfg && cfg.parametros.prevision.modelo === 'vasco';
    if (s.tieneEpsv && vasco && s.epsvDesglose === 'certificado' && (num(s.epsvPreRent) > num(s.epsvPre) || num(s.epsvPostRent) > num(s.epsvPost))) a.push('La rentabilidad de la EPSV no puede superar su saldo: se limita al saldo.');
    if (!pos(s.pension) && !(pos(s.liquidez) + pos(s.depositos) + pos(s.fondos) + pos(s.acciones) + pos(s.seguros)) && !(s.tieneEpsv && pos(s.epsvPre) + pos(s.epsvPost))) a.push('Introduce al menos una pensión, ahorros o ' + (vasco || !cfg ? 'una EPSV' : 'un plan de pensiones') + ' para ver un resultado.');
    return a;
  }

  /* ----------------------------------------------------- Previsión social -- */
  function ratioRentabilidad(cfg, o, pre, preRent, post, postRent) {
    const total = pre + post;
    if (!total) return { ratio: 0, metodo: 'sin-epsv' };
    if (cfg.parametros.prevision.modelo !== 'vasco') return { ratio: 0, metodo: 'trabajo' };
    if (o.epsvDesglose === 'certificado') return { ratio: (preRent + postRent) / total, metodo: 'certificado' };
    return { ratio: F().ratioEstimado(cfg, o.antiguedadConocida, o.antiguedad), metodo: o.antiguedadConocida ? 'antiguedad' : 'sin-antiguedad' };
  }

  /* ------------------------------------------------ Situación a la jubilación */
  function situacionInicial(cfg, o, r) {
    const A = o.aniosHastaJubilacion, i = o.inflacion;
    const proporcional = cfg.parametros.prevision.crecimientoPre === 'proporcional';
    let liq = o.liquidez + o.depositos;
    let V = o.fondos + o.acciones + o.seguros, K = o.fondosCoste + o.accionesCoste + o.segurosCoste;
    let pre = o.epsvPre, post = o.epsvPost, preRent = o.epsvPreRent, postRent = o.epsvPostRent;
    let aportado = 0;
    for (let y = 1; y <= A; y++) {
      liq *= 1 + r; V *= 1 + r;
      const creci = (pre + post) * r;
      if (proporcional && pre + post > 0) { const q = pre / (pre + post); pre += creci * q; post += creci * (1 - q); }
      else { post += creci; postRent += creci; } // modelo vasco: lo generado desde 2026 va al tramo posterior
      const ap = o.ahorroAnual * Math.pow(1 + i, y - 1); V += ap; K += ap; aportado += ap;
    }
    const rr = ratioRentabilidad(cfg, o, pre, preRent, post, postRent);
    return { liq, V, K, aportado, ep: { pre, post, preRent, postRent, ratio: rr.ratio, metodo: rr.metodo } };
  }

  /* ----------------------------------------------------- Plan y proyección -- */
  function construirPlan(cfg, o) {
    const r = o.rentabilidad, i = o.inflacion, n = o.aniosPlan, A = o.aniosHastaJubilacion;
    const ini = situacionInicial(cfg, o, r);
    const pct = o.epsvPctCapital / 100;
    const epsvTotal = ini.ep.pre + ini.ep.post;
    const Epsv0 = epsvTotal * (1 - pct);
    const pension1 = o.pension * 14 * Math.pow(1 + i, A);
    const exenta = o.epsvRenta !== 'flexible';

    // Pagos periódicos de la previsión (plan del escenario base).
    const pagoEpsv = (k) => {
      if (!Epsv0) return 0;
      if (o.epsvRenta === 'temporal') return k <= o.epsvAniosRenta ? retiradaCreciente(Epsv0, r, 0, o.epsvAniosRenta) : 0;
      if (o.epsvRenta === 'vitalicia') return retiradaCreciente(Epsv0, r, 0, n);
      const w1 = o.estrategia === 'conservar' ? Epsv0 * Math.max(0, r - i) : retiradaCreciente(Epsv0, r, i, n);
      return w1 * Math.pow(1 + i, k - 1);
    };

    // Cobro en capital: el impuesto depende del resto de rentas del año 1, y la
    // retirada privada depende del neto cobrado. Se resuelve por iteración.
    const opciones = F().opcionesCapital(cfg, o, ini.ep, pct);
    let netoCapital = 0, capital = null, W1 = 0;
    const retiradaPlan = (C) => o.estrategia === 'conservar' ? C * Math.max(0, r - i) : retiradaCreciente(C, r, i, n);
    for (let it = 0; it < 4; it++) {
      const Cp = ini.liq + ini.V + netoCapital;
      W1 = retiradaPlan(Cp);
      const y1 = anio1Rentas(cfg, o, ini, netoCapital, W1, pension1, pagoEpsv(1), ini.ep.ratio, exenta, r);
      const sin = irpf(cfg, { trabajo: y1.trabajo, ahorro: y1.ahorro, edad: o.edadJubilacion, otrasDeducciones: o.otrasDeducciones, trabajoBruto: y1.trabajoBruto }).total;
      const coste = (b) => irpf(cfg, { trabajo: y1.trabajo + b.general, ahorro: y1.ahorro + b.ahorro, edad: o.edadJubilacion, otrasDeducciones: o.otrasDeducciones, trabajoBruto: y1.trabajoBruto + b.bruto }).total - sin;
      const calc = opciones.map((op) => { const impuesto = coste(op.bases); return Object.assign({}, op, { impuesto, neto: op.bases.bruto - impuesto }); });
      let elegido = calc[0].clave;
      const automatico = calc.length > 1 && o.regimen === 'auto';
      if (calc.length > 1) elegido = automatico ? calc.reduce((m, x) => (x.impuesto < m.impuesto ? x : m), calc[0]).clave : o.regimen;
      const sel = calc.find((x) => x.clave === elegido) || calc[0];
      capital = { bruto: calc[0].bases.bruto, opciones: calc, elegido: sel.clave, automatico, impuesto: sel.impuesto, neto: sel.neto, bases: sel.bases };
      for (const x of calc) capital[x.clave] = { bases: x.bases, impuesto: x.impuesto, neto: x.neto };
      if (Math.abs(capital.neto - netoCapital) < .5) { netoCapital = capital.neto; break; }
      netoCapital = capital.neto;
    }
    W1 = retiradaPlan(ini.liq + ini.V + netoCapital);
    return { o, cfg, ini, pct, Epsv0, pension1, exenta, pagoEpsv, W1, capital: capital.bruto > 0 ? capital : null, netoCapital };
  }

  // Rentas imponibles del año 1 (para el cálculo del cobro en capital).
  function anio1Rentas(cfg, o, ini, netoCapital, W1, pension1, pago, ratio, exenta, r) {
    let liq = ini.liq + netoCapital, V = ini.V, K = ini.K;
    const interes = liq * r; liq += interes; V *= 1 + r;
    const disp = liq + V, w = Math.min(W1, disp);
    const deInv = disp ? w * V / disp : 0;
    const ganancia = V > K && V > 0 ? deInv * (1 - K / V) : 0;
    const rp = F().rentaPeriodica(cfg, pago, ratio, exenta);
    return { trabajo: pension1 + rp.trabajo, ahorro: Math.max(0, interes) + ganancia + rp.ahorro, trabajoBruto: pension1 + pago };
  }

  /* Proyecta un escenario con el plan del escenario base (mismas retiradas
     previstas) y una rentabilidad distinta o una secuencia de estrés. */
  function proyectar(plan, r, estres) {
    const { o, cfg, ini, pension1, exenta, pagoEpsv, W1 } = plan;
    const i = o.inflacion, n = o.aniosPlan, A = o.aniosHastaJubilacion, ratio = ini.ep.ratio;
    let liq = ini.liq + plan.netoCapital, V = ini.V, K = ini.K, E = plan.Epsv0;
    const filas = []; let agotado = null; let previstoTotal = 0, pagadoTotal = 0;
    const saldo0 = liq + V + E;
    for (let k = 1; k <= n; k++) {
      const edad = o.edadJubilacion + k - 1;
      const rk = estres && k <= AJUSTES.estres.length ? AJUSTES.estres[k - 1] : r;
      const interes = liq * Math.max(r, 0); liq += interes; V *= 1 + rk; E *= 1 + rk;
      const objetivo = W1 * Math.pow(1 + i, k - 1);
      const disp = liq + V, w = Math.min(objetivo, disp);
      const deInv = disp ? w * V / disp : 0, deLiq = w - deInv;
      const ganancia = V > K && V > 0 ? deInv * (1 - K / V) : 0;
      const costeRetirado = V > 0 ? deInv * Math.min(1, K / V) : 0;
      K = Math.max(0, K - costeRetirado); V = Math.max(0, V - deInv); liq = Math.max(0, liq - deLiq);
      const pagoObj = pagoEpsv(k), pago = Math.min(pagoObj, E); E = Math.max(0, E - pago);
      previstoTotal += objetivo + pagoObj; pagadoTotal += w + pago;
      const pension = pension1 * Math.pow(1 + i, k - 1);
      const rp = F().rentaPeriodica(cfg, pago, ratio, exenta);
      const epsvTrabajo = rp.trabajo, epsvRent = rp.rentabilidad;
      const trabajo = pension + epsvTrabajo;
      const ahorro = interes + ganancia + rp.ahorro;
      const edadFiscal = edad;
      const t = irpf(cfg, { trabajo, ahorro, edad: edadFiscal, otrasDeducciones: o.otrasDeducciones, trabajoBruto: pension + pago });
      const tPension = irpf(cfg, { trabajo: pension, ahorro: 0, edad: edadFiscal, otrasDeducciones: o.otrasDeducciones, trabajoBruto: pension });
      const bruto = pension + w + pago;
      const saldo = liq + V + E;
      if (agotado === null && saldo < 1 && (objetivo + pagoObj) > 0 && k < n) agotado = k;
      const deflactor = Math.pow(1 + i, A + k - 1);
      filas.push({
        anio: k, edad, pension, retiradaAhorros: w, retiradaEpsv: pago, bruto,
        impuesto: t.total, impuestoPension: tPension.total, impuestoResto: t.total - tPension.total,
        neto: bruto - t.total, pensionNeta: pension - tPension.total, restoNeto: w + pago - (t.total - tPension.total),
        interes, ganancia, principal: w - ganancia, epsvTrabajo, epsvRent, epsvRentExenta: rp.exento,
        irpf: t, saldo, deflactor, previsto: objetivo + pagoObj,
      });
    }
    const fin = filas[filas.length - 1];
    return {
      r, estres: !!estres, filas, agotado, edadAgotado: agotado ? o.edadJubilacion + agotado : null,
      saldoInicial: saldo0, saldoFinal: fin ? fin.saldo : 0, cobertura: previstoTotal ? pagadoTotal / previstoTotal : 1,
    };
  }

  /* Resultado cuando el territorio o la comunidad no calculan. */
  function noDisponible(o, cfg, entrada) {
    let estado = 'desconocido', mensaje;
    if (!o.territorio) { estado = 'sin-territorio'; mensaje = 'Elige tu residencia fiscal para calcular.'; }
    else if (!cfg) mensaje = 'No reconocemos el territorio «' + o.territorio + '». Elige tu residencia fiscal en el selector.';
    else if (cfg.estado === 'desconocida') { estado = 'desconocida'; mensaje = 'No reconocemos la comunidad autónoma «' + (o.ccaa || '') + '». Elige una en el selector.'; }
    else { estado = 'en-preparacion'; mensaje = (cfg.ccaa ? cfg.ccaa.nombre : cfg.nombre) + ' está en preparación: su escala autonómica aún no se ha verificado en fuente oficial, así que el simulador no calcula con ella. Puedes ver una estimación con la escala de referencia (art. 65 LIRPF), que no es la de tu comunidad.'; }
    return { disponible: false, estado, mensaje, entrada: o, cfg, escenarios: [], base: null, anio1: null, resumen: null, capital: null, avisos: avisos(entrada) };
  }

  function calcular(entrada) {
    const o = normalizar(entrada);
    const cfg = F().configuracion(o.territorio, o.ccaa);
    if (!F().disponible(cfg)) return noDisponible(o, cfg, entrada);
    const plan = construirPlan(cfg, o);
    const r = o.rentabilidad, d = AJUSTES.diferencialEscenarios;
    const base = proyectar(plan, r, false);
    const escenarios = [
      Object.assign(proyectar(plan, Math.max(-.02, r - d), false), { clave: 'conservador', nombre: 'Rentabilidad más baja' }),
      Object.assign(base, { clave: 'base', nombre: 'Tu hipótesis' }),
      Object.assign(proyectar(plan, Math.min(.12, r + d), false), { clave: 'optimista', nombre: 'Rentabilidad más alta' }),
    ];
    if (o.estres) escenarios.push(Object.assign(proyectar(plan, r, true), { clave: 'estres', nombre: 'Mal comienzo' }));
    const y1 = base.filas[0];
    const patrimonioHoy = o.liquidez + o.depositos + o.fondos + o.acciones + o.seguros + o.epsvPre + o.epsvPost;
    const patrimonioJubilacion = plan.ini.liq + plan.ini.V + plan.ini.ep.pre + plan.ini.ep.post;
    return {
      disponible: true, cfg, textos: F().textos(cfg), limites: F().limites(cfg),
      entrada: o, parametros: Object.assign({}, cfg.parametros, { escalaGeneralVisible: F().escalaGeneralVisible(cfg), escalaAutonomica: cfg.escalaAutonomica }), plan, escenarios, base, anio1: y1,
      resumen: {
        netoMensual: y1 ? y1.neto / 12 : 0,
        brutoMensual: y1 ? y1.bruto / 12 : 0,
        impuestoMensual: y1 ? y1.impuesto / 12 : 0,
        pensionNetaMensual: y1 ? y1.pensionNeta / 12 : 0,
        restoNetoMensual: y1 ? y1.restoNeto / 12 : 0,
        deflactor1: y1 ? y1.deflactor : 1,
        patrimonioHoy, patrimonioJubilacion,
        ratioEpsv: plan.ini.ep.ratio, metodoEpsv: plan.ini.ep.metodo,
      },
      capital: plan.capital,
      avisos: avisos(entrada),
    };
  }

  /* Compatibilidad: las funciones sueltas calculan con Bizkaia salvo que se
     indique territorio (p. ej. M.irpf({ trabajo, edad, territorio: 'navarra' })). */
  const cfgDe = (a) => configuracion(a && a.territorio, a && a.ccaa);
  const api = {
    AJUSTES, DEFECTO,
    get PARAMETROS() { return configuracion().parametros; },
    configuracion,
    irpf: (a) => F().irpf(cfgDe(a), a || {}),
    escala: (base, tramos) => F().escala(base, tramos),
    bonificacionTrabajo: (t, o, territorio) => F().bonificacionTrabajo(configuracion(territorio).parametros, t, o),
    deduccionEdad: (e, b, territorio) => F().deduccionEdad(configuracion(territorio).parametros, e, b),
    basesCapital: (o, regimen, ep, pct, territorio) => F().basesCapitalVasco(configuracion(territorio).parametros.prevision, o, regimen, ep, pct),
    esperanzaVida, retiradaCreciente, normalizar, calcular, avisos,
  };
  global.NuviaJubilacion = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
