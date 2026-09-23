/* ============================================================================
   NUVIA · Motor del simulador de jubilación · Bizkaia 2026
   ----------------------------------------------------------------------------
   Cálculo puro, sin DOM. Se usa en jubilacion.html (navegador) y en
   docs/nuvia-jubilacion-motor.test.mjs (Node). Expone globalThis.NuviaJubilacion.

   Qué calcula, en una frase: proyecta año a año la pensión pública (revalorizada
   con el IPC), las retiradas de tus ahorros y de tu EPSV y el IRPF de Bizkaia que
   pagarías cada año, y lo expresa en euros de cada año y en euros de hoy.

   Fuentes normativas (DFB · Hacienda Foral de Bizkaia, IRPF 2026):
     · Escala general y del ahorro, minoración de cuota (arts. 74-77 NF 13/2013).
     · Bonificación del rendimiento del trabajo (art. 23).
     · Deducción por edad (65-75 y más de 75 años).
     · EPSV desde 2026 (NF 2/2025 y NF 7/2025): aportación como rendimiento del
       trabajo; rentabilidad como capital mobiliario, exenta en rentas vitalicias o
       temporales de 15 o más años de cuantía constante; capital al 70 % (primer
       cobro por contingencia, límite 300.000 €) o, en régimen transitorio para lo
       aportado hasta 2025, al 60 %; estimación del 1 % por año (máx. 35 %) o 25 %.
       El reparto transitorio sigue el caso práctico de la DFB: la prestación se
       divide en proporción a las aportaciones anteriores y posteriores a 2026.
   ========================================================================== */
(function (global) {
  'use strict';

  const PARAMETROS = Object.freeze({
    ejercicio: 2026,
    escalaGeneral: [[0, .23], [18080, .28], [36160, .35], [54240, .40], [77450, .45], [107260, .46], [142960, .47], [208390, .49]],
    escalaAhorro: [[0, .19], [7500, .20], [15000, .22], [30000, .24], [50000, .255], [90000, .26], [120000, .265], [240000, .27], [300000, .28]],
    minoracion: 1615,
    bonificacion: { maxima: 8000, minima: 3000, umbral1: 14800, umbral2: 23000, coeficiente: .6098, otrasRentas: 7500 },
    edad: { desde: 65, mayor: 75, importe: 393, importeMayor: 714, base1: 20000, base2: 30000 },
    epsv: { capital: .70, capitalTransitorio: .60, limite: 300000, estimacionAnual: .01, estimacionMaxima: .35, estimacionSinAntiguedad: .25, rentaMinimaAnios: 15 },
    estres: [-.12, -.05],
    diferencialEscenarios: .015,
  });

  /* Referencia demográfica aproximada: años de vida restantes por edad y sexo. */
  const TABLA_VIDA = { 50: [33.0, 37.6], 55: [28.5, 33.1], 60: [24.1, 28.5], 65: [19.9, 24.0], 70: [16.1, 19.9], 75: [12.7, 16.0], 80: [9.7, 12.6], 85: [7.1, 9.4], 90: [5.0, 6.6], 95: [3.4, 4.4] };

  const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, num(v, a)));
  const pos = (v) => Math.max(0, num(v));

  /* ---------------------------------------------------------------- IRPF --- */
  function escala(base, tramos) {
    const x = pos(base); let cuota = 0; let marginal = tramos[0][1];
    for (let i = 0; i < tramos.length; i++) {
      const [desde, tipo] = tramos[i]; const hasta = tramos[i + 1] ? tramos[i + 1][0] : Infinity;
      if (x <= desde) break;
      cuota += (Math.min(x, hasta) - desde) * tipo; marginal = tipo;
    }
    return { cuota, marginal };
  }

  function bonificacionTrabajo(trabajo, otrasRentas) {
    const b = PARAMETROS.bonificacion; const t = pos(trabajo);
    let importe;
    if (pos(otrasRentas) > b.otrasRentas) importe = b.minima;
    else if (t <= b.umbral1) importe = b.maxima;
    else if (t <= b.umbral2) importe = b.maxima - b.coeficiente * (t - b.umbral1);
    else importe = b.minima;
    return Math.min(t, Math.max(0, importe));
  }

  function deduccionEdad(edad, baseTotal) {
    const e = PARAMETROS.edad; const b = pos(baseTotal);
    if (num(edad) <= e.desde || b >= e.base2) return 0;
    const completa = num(edad) > e.mayor ? e.importeMayor : e.importe;
    if (b <= e.base1) return completa;
    return Math.max(0, completa - completa * (b - e.base1) / (e.base2 - e.base1));
  }

  /* IRPF de un año. trabajo = pensión + EPSV (aportaciones); ahorro = intereses,
     ganancias y rentabilidad EPSV no exenta. */
  function irpf({ trabajo = 0, ahorro = 0, edad = 65, otrasDeducciones = 0 } = {}) {
    const t = pos(trabajo), a = pos(ahorro);
    const bonificacion = bonificacionTrabajo(t, a);
    const baseGeneral = Math.max(0, t - bonificacion);
    const g = escala(baseGeneral, PARAMETROS.escalaGeneral);
    const minoracion = Math.min(g.cuota, PARAMETROS.minoracion);
    const cuotaGeneral = g.cuota - minoracion;
    const s = escala(a, PARAMETROS.escalaAhorro);
    const cuotaAhorro = s.cuota;
    const edadDed = deduccionEdad(edad, baseGeneral + a);
    const bruta = cuotaGeneral + cuotaAhorro;
    const deducciones = Math.min(bruta, edadDed + pos(otrasDeducciones));
    const total = bruta - deducciones;
    return {
      trabajo: t, ahorro: a, bonificacion, baseGeneral, cuotaGeneralBruta: g.cuota, minoracion, cuotaGeneral,
      cuotaAhorro, deduccionEdad: edadDed, otrasDeducciones: pos(otrasDeducciones), deducciones, total,
      marginalGeneral: baseGeneral > 0 ? g.marginal : 0, marginalAhorro: a > 0 ? s.marginal : 0,
      efectivo: t + a > 0 ? total / (t + a) : 0,
    };
  }

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

  function normalizar(entrada) {
    const s = Object.assign({}, DEFECTO, entrada || {});
    const o = {};
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
    o.epsvPreRent = Math.min(o.epsvPre, pos(s.epsvPreRent)); o.epsvPostRent = Math.min(o.epsvPost, pos(s.epsvPostRent));
    o.epsvDesglose = s.epsvDesglose === 'estimacion' ? 'estimacion' : 'certificado';
    o.antiguedadConocida = s.antiguedadConocida !== false;
    o.antiguedad = Math.round(clamp(s.antiguedad, 1, 60));
    o.epsvCobro = ['renta', 'capital', 'mixto'].includes(s.epsvCobro) ? s.epsvCobro : 'renta';
    o.epsvPctCapital = o.epsvCobro === 'capital' ? 100 : o.epsvCobro === 'renta' ? 0 : clamp(s.epsvPctCapital, 5, 95);
    o.epsvRenta = ['flexible', 'temporal', 'vitalicia'].includes(s.epsvRenta) ? s.epsvRenta : 'flexible';
    o.epsvAniosRenta = Math.round(clamp(s.epsvAniosRenta, PARAMETROS.epsv.rentaMinimaAnios, 40));
    o.contingencia = s.contingencia || 'jubilacion';
    o.primerCobro = s.primerCobro !== false; o.dosAnios = s.dosAnios !== false;
    o.regimen = ['auto', 'transitorio', 'nuevo'].includes(s.regimen) ? s.regimen : 'auto';
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
    if (s.tieneEpsv && s.epsvDesglose === 'certificado' && (num(s.epsvPreRent) > num(s.epsvPre) || num(s.epsvPostRent) > num(s.epsvPost))) a.push('La rentabilidad de la EPSV no puede superar su saldo: se limita al saldo.');
    if (!pos(s.pension) && !(pos(s.liquidez) + pos(s.depositos) + pos(s.fondos) + pos(s.acciones) + pos(s.seguros)) && !(s.tieneEpsv && pos(s.epsvPre) + pos(s.epsvPost))) a.push('Introduce al menos una pensión, ahorros o una EPSV para ver un resultado.');
    return a;
  }

  /* ----------------------------------------------------------- EPSV -------- */
  function ratioRentabilidad(o, pre, preRent, post, postRent) {
    const total = pre + post;
    if (!total) return { ratio: 0, metodo: 'sin-epsv' };
    if (o.epsvDesglose === 'certificado') return { ratio: (preRent + postRent) / total, metodo: 'certificado' };
    if (o.antiguedadConocida) return { ratio: Math.min(o.antiguedad * PARAMETROS.epsv.estimacionAnual, PARAMETROS.epsv.estimacionMaxima), metodo: 'antiguedad' };
    return { ratio: PARAMETROS.epsv.estimacionSinAntiguedad, metodo: 'sin-antiguedad' };
  }

  /* Bases del cobro en capital. ep = saldos EPSV a la jubilación. */
  function basesCapital(o, regimen, ep, pct) {
    const E = PARAMETROS.epsv;
    const pre = ep.pre * pct, post = ep.post * pct, bruto = pre + post;
    const exentoDosAnios = o.contingencia === 'invalidez' || o.contingencia === 'dependencia';
    const conReduccion = o.primerCobro && (o.dosAnios || exentoDosAnios);
    let limite = E.limite, general = 0, ahorro = 0;
    const integrar = (importe, tipo) => {
      const x = pos(importe); if (!conReduccion) return x;
      const red = Math.min(x, limite); limite -= red; return red * tipo + (x - red);
    };
    const certificado = o.epsvDesglose === 'certificado';
    const rPre = certificado ? (ep.pre ? ep.preRent / ep.pre : 0) : ep.ratio;
    const rPost = certificado ? (ep.post ? ep.postRent / ep.post : 0) : ep.ratio;
    let detalle;
    if (regimen === 'transitorio') {
      /* Caso práctico DFB 2026: prestación × aportaciones previas / aportaciones totales. */
      const apPre = ep.pre - ep.preRent, apPost = ep.post - ep.postRent;
      const cuotaPre = certificado && apPre + apPost > 0 ? apPre / (apPre + apPost) : (ep.pre + ep.post ? ep.pre / (ep.pre + ep.post) : 0);
      const tramoPre = bruto * cuotaPre, tramoPost = bruto - tramoPre;
      const rentPost = Math.min(tramoPost, post * rPost), apTramoPost = tramoPost - rentPost;
      general += integrar(tramoPre, E.capitalTransitorio);
      ahorro += rentPost;
      general += integrar(apTramoPost, E.capital);
      detalle = { tramoPre, tramoPost, rentabilidad: rentPost, aportacion: apTramoPost };
    } else {
      const rent = pre * rPre + post * rPost, aport = Math.max(0, bruto - rent);
      ahorro = rent; general = integrar(aport, E.capital);
      detalle = { rentabilidad: rent, aportacion: aport };
    }
    return { regimen, bruto, general, ahorro, conReduccion, detalle };
  }

  /* ------------------------------------------------ Situación a la jubilación */
  function situacionInicial(o, r) {
    const A = o.aniosHastaJubilacion, i = o.inflacion;
    let liq = o.liquidez + o.depositos;
    let V = o.fondos + o.acciones + o.seguros, K = o.fondosCoste + o.accionesCoste + o.segurosCoste;
    let pre = o.epsvPre, post = o.epsvPost, preRent = o.epsvPreRent, postRent = o.epsvPostRent;
    let aportado = 0;
    for (let y = 1; y <= A; y++) {
      liq *= 1 + r; V *= 1 + r;
      const creci = (pre + post) * r; post += creci; postRent += creci; // lo generado desde 2026 va al tramo posterior
      const ap = o.ahorroAnual * Math.pow(1 + i, y - 1); V += ap; K += ap; aportado += ap;
    }
    const rr = ratioRentabilidad(o, pre, preRent, post, postRent);
    return { liq, V, K, aportado, ep: { pre, post, preRent, postRent, ratio: rr.ratio, metodo: rr.metodo } };
  }

  /* ----------------------------------------------------- Plan y proyección -- */
  function construirPlan(o) {
    const r = o.rentabilidad, i = o.inflacion, n = o.aniosPlan, A = o.aniosHastaJubilacion;
    const ini = situacionInicial(o, r);
    const pct = o.epsvPctCapital / 100;
    const epsvTotal = ini.ep.pre + ini.ep.post;
    const Epsv0 = epsvTotal * (1 - pct);
    const pension1 = o.pension * 14 * Math.pow(1 + i, A);
    const exenta = o.epsvRenta !== 'flexible';

    // Pagos periódicos de la EPSV (plan del escenario base).
    const pagoEpsv = (k) => {
      if (!Epsv0) return 0;
      if (o.epsvRenta === 'temporal') return k <= o.epsvAniosRenta ? retiradaCreciente(Epsv0, r, 0, o.epsvAniosRenta) : 0;
      if (o.epsvRenta === 'vitalicia') return retiradaCreciente(Epsv0, r, 0, n);
      const w1 = o.estrategia === 'conservar' ? Epsv0 * Math.max(0, r - i) : retiradaCreciente(Epsv0, r, i, n);
      return w1 * Math.pow(1 + i, k - 1);
    };

    // Cobro en capital: el impuesto depende del resto de rentas del año 1, y la
    // retirada privada depende del neto cobrado. Se resuelve por iteración.
    const bases = { transitorio: basesCapital(o, 'transitorio', ini.ep, pct), nuevo: basesCapital(o, 'nuevo', ini.ep, pct) };
    let netoCapital = 0, capital = null, W1 = 0;
    const retiradaPlan = (C) => o.estrategia === 'conservar' ? C * Math.max(0, r - i) : retiradaCreciente(C, r, i, n);
    for (let it = 0; it < 4; it++) {
      const Cp = ini.liq + ini.V + netoCapital;
      W1 = retiradaPlan(Cp);
      const y1 = anio1Rentas(o, ini, netoCapital, W1, pension1, pagoEpsv(1), ini.ep.ratio, exenta, r);
      const sin = irpf({ trabajo: y1.trabajo, ahorro: y1.ahorro, edad: o.edadJubilacion, otrasDeducciones: o.otrasDeducciones }).total;
      const coste = (b) => irpf({ trabajo: y1.trabajo + b.general, ahorro: y1.ahorro + b.ahorro, edad: o.edadJubilacion, otrasDeducciones: o.otrasDeducciones }).total - sin;
      const tT = coste(bases.transitorio), tN = coste(bases.nuevo);
      let elegido = o.regimen === 'auto' ? (tT <= tN ? 'transitorio' : 'nuevo') : o.regimen;
      capital = {
        bruto: bases.transitorio.bruto,
        transitorio: { bases: bases.transitorio, impuesto: tT, neto: bases.transitorio.bruto - tT },
        nuevo: { bases: bases.nuevo, impuesto: tN, neto: bases.nuevo.bruto - tN },
        elegido, automatico: o.regimen === 'auto',
      };
      capital.impuesto = capital[elegido].impuesto; capital.neto = capital[elegido].neto; capital.bases = capital[elegido].bases;
      if (Math.abs(capital.neto - netoCapital) < .5) { netoCapital = capital.neto; break; }
      netoCapital = capital.neto;
    }
    W1 = retiradaPlan(ini.liq + ini.V + netoCapital);
    return { o, ini, pct, Epsv0, pension1, exenta, pagoEpsv, W1, capital: capital.bruto > 0 ? capital : null, netoCapital };
  }

  // Rentas imponibles del año 1 (para el cálculo del cobro en capital).
  function anio1Rentas(o, ini, netoCapital, W1, pension1, pago, ratio, exenta, r) {
    let liq = ini.liq + netoCapital, V = ini.V, K = ini.K;
    const interes = liq * r; liq += interes; V *= 1 + r;
    const disp = liq + V, w = Math.min(W1, disp);
    const deInv = disp ? w * V / disp : 0;
    const ganancia = V > K && V > 0 ? deInv * (1 - K / V) : 0;
    return { trabajo: pension1 + pago * (1 - ratio), ahorro: Math.max(0, interes) + ganancia + (exenta ? 0 : pago * ratio) };
  }

  /* Proyecta un escenario con el plan del escenario base (mismas retiradas
     previstas) y una rentabilidad distinta o una secuencia de estrés. */
  function proyectar(plan, r, estres) {
    const { o, ini, pct, pension1, exenta, pagoEpsv, W1 } = plan;
    const i = o.inflacion, n = o.aniosPlan, A = o.aniosHastaJubilacion, ratio = ini.ep.ratio;
    let liq = ini.liq + plan.netoCapital, V = ini.V, K = ini.K, E = plan.Epsv0;
    const filas = []; let agotado = null; let previstoTotal = 0, pagadoTotal = 0;
    const saldo0 = liq + V + E;
    for (let k = 1; k <= n; k++) {
      const edad = o.edadJubilacion + k - 1;
      const rk = estres && k <= PARAMETROS.estres.length ? PARAMETROS.estres[k - 1] : r;
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
      const epsvTrabajo = pago * (1 - ratio), epsvRent = pago * ratio;
      const trabajo = pension + epsvTrabajo;
      const ahorro = interes + ganancia + (exenta ? 0 : epsvRent);
      const edadFiscal = edad;
      const t = irpf({ trabajo, ahorro, edad: edadFiscal, otrasDeducciones: o.otrasDeducciones });
      const tPension = irpf({ trabajo: pension, ahorro: 0, edad: edadFiscal, otrasDeducciones: o.otrasDeducciones });
      const bruto = pension + w + pago;
      const saldo = liq + V + E;
      if (agotado === null && saldo < 1 && (objetivo + pagoObj) > 0 && k < n) agotado = k;
      const deflactor = Math.pow(1 + i, A + k - 1);
      filas.push({
        anio: k, edad, pension, retiradaAhorros: w, retiradaEpsv: pago, bruto,
        impuesto: t.total, impuestoPension: tPension.total, impuestoResto: t.total - tPension.total,
        neto: bruto - t.total, pensionNeta: pension - tPension.total, restoNeto: w + pago - (t.total - tPension.total),
        interes, ganancia, principal: w - ganancia, epsvTrabajo, epsvRent, epsvRentExenta: exenta ? epsvRent : 0,
        irpf: t, saldo, deflactor, previsto: objetivo + pagoObj,
      });
    }
    const fin = filas[filas.length - 1];
    return {
      r, estres: !!estres, filas, agotado, edadAgotado: agotado ? o.edadJubilacion + agotado : null,
      saldoInicial: saldo0, saldoFinal: fin ? fin.saldo : 0, cobertura: previstoTotal ? pagadoTotal / previstoTotal : 1,
    };
  }

  function calcular(entrada) {
    const o = normalizar(entrada);
    const plan = construirPlan(o);
    const r = o.rentabilidad, d = PARAMETROS.diferencialEscenarios;
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
      entrada: o, parametros: PARAMETROS, plan, escenarios, base, anio1: y1,
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

  const api = { PARAMETROS, DEFECTO, irpf, escala, bonificacionTrabajo, deduccionEdad, esperanzaVida, retiradaCreciente, normalizar, basesCapital, calcular, avisos };
  global.NuviaJubilacion = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
