/* ============================================================================
   NUVIA · Informe imprimible del simulador de jubilación
   ----------------------------------------------------------------------------
   Compone un informe A4 de tres hojas con los datos introducidos, el resultado,
   los impuestos, la evolución año a año y los escenarios, y lo imprime desde un
   iframe oculto. Nada sale del navegador.

   Maquetación (23-09-2026): cada hoja es un bloque de 210 × 297 mm con sus
   propios márgenes, y la regla @page va a margen cero. Así el informe sale
   centrado aunque el diálogo de impresión tenga «Márgenes: ninguno» o
   «Predeterminados», y cada hoja lleva su cabecera y su pie con paginación.
   Expone globalThis.NuviaJubilacionInforme.
   ========================================================================== */
(function (global) {
  'use strict';
  const f0 = (n) => { const v = Math.round(Number(n) || 0); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  const eur = (n) => f0(n) + ' €';
  const pct = (x, d = 1) => (x * 100).toFixed(d).replace('.', ',') + ' %';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LOGO = 'src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-rec-transp-web-04.svg';

  const CSS = `
@font-face { font-family: 'Newsreader'; font-style: normal; font-weight: 400 600; src: url('estilos/fuentes/newsreader-latin.woff2') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Newsreader'; font-style: normal; font-weight: 400 600; src: url('estilos/fuentes/newsreader-latin-ext.woff2') format('woff2'); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2C60-2C7F, U+A720-A7FF; }
@page { size: A4 portrait; margin: 0; }
:root { --tinta: #0b2347; --texto: #3a4a63; --suave: #6a7486; --acento: #2c4f8f; --filete: #d9e0ea; --fino: #e8edf3; --velo: #f4f7fb; --neg: #9c2f2f; --pos: #2f6b3d; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #e9edf2; font-family: Inter, system-ui, sans-serif; color: var(--tinta); font-size: 9.5pt; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-variant-numeric: tabular-nums; }
.hoja { position: relative; width: 210mm; height: 297mm; margin: 8mm auto; padding: 15mm 19mm 0; background: #fff; overflow: hidden; display: flex; flex-direction: column; }
.hoja + .hoja { break-before: page; }
.cuerpo { flex: 1 1 auto; display: flex; flex-direction: column; }
@media print { body { background: #fff; } .hoja { margin: 0; box-shadow: none; } }
@media screen { .hoja { box-shadow: 0 2px 10px rgba(11, 35, 71, .12); } }

/* Cabecera y pie de cada hoja */
.cab { display: flex; align-items: center; justify-content: space-between; padding-bottom: 4mm; margin-bottom: 9mm; border-bottom: .6pt solid var(--filete); }
.cab img { height: 7.5mm; width: auto; display: block; }
.cab p { margin: 0; text-align: right; font-size: 7.5pt; line-height: 1.5; color: var(--suave); letter-spacing: .02em; }
.cab p b { color: var(--tinta); font-weight: 600; }
.pie { flex: none; display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; margin-top: auto; padding: 3.5mm 0 11mm; border-top: .6pt solid var(--filete); font-size: 7pt; color: var(--suave); }
.pie span:last-child { white-space: nowrap; }

/* Portada de resultado */
.kicker { margin: 0 0 2.5mm; font-size: 7pt; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--acento); }
h1 { margin: 0; font-family: Newsreader, Georgia, serif; font-weight: 500; font-size: 25pt; line-height: 1.12; letter-spacing: -.005em; }
.entradilla { margin: 3mm 0 0; max-width: 150mm; font-size: 9.5pt; color: var(--texto); }
.hero { display: grid; grid-template-columns: 76mm 1fr; margin: 9mm 0 10mm; border-top: 1.4pt solid var(--tinta); border-bottom: .6pt solid var(--filete); }
.hero__main { padding: 6mm 7mm 6mm 0; border-right: .6pt solid var(--filete); }
.hero__main .lbl { font-size: 8pt; color: var(--texto); }
.hero__main strong { display: block; margin: 1.5mm 0 1mm; font-family: Newsreader, Georgia, serif; font-weight: 500; font-size: 40pt; line-height: 1; color: var(--tinta); }
.hero__main .sub { font-size: 8pt; color: var(--suave); }
.hero__main .dur { display: inline-block; margin-top: 4mm; padding: 1.2mm 2.8mm; border-radius: 1.2mm; background: var(--velo); font-size: 8pt; font-weight: 600; color: var(--acento); }
.hero__cifras { display: grid; grid-template-columns: 1fr 1fr; }
.hero__cifras div { padding: 5mm 0 5mm 7mm; }
.hero__cifras div:nth-child(-n+2) { border-bottom: .6pt solid var(--fino); }
.hero__cifras div:nth-child(odd) { border-right: .6pt solid var(--fino); }
.hero__cifras span { display: block; font-size: 7.5pt; color: var(--suave); }
.hero__cifras b { display: block; margin-top: 1mm; font-size: 14pt; font-weight: 600; }
.hero__cifras .neg b { color: var(--neg); }

/* Secciones */
.sec { margin-bottom: 9mm; break-inside: avoid; }
.sec:last-child { margin-bottom: 0; }
.sec__h { display: flex; align-items: baseline; gap: 3mm; margin-bottom: 4mm; padding-bottom: 2mm; border-bottom: .6pt solid var(--filete); }
.sec__h em { font-style: normal; font-size: 7.5pt; font-weight: 600; letter-spacing: .1em; color: var(--acento); }
.sec__h h2 { margin: 0; font-family: Newsreader, Georgia, serif; font-weight: 500; font-size: 14pt; line-height: 1.2; }
.sec__h small { margin-left: auto; font-size: 7.5pt; color: var(--suave); white-space: nowrap; }
.nota { margin: 2.5mm 0 0; font-size: 7.5pt; color: var(--suave); }

/* Datos en dos columnas */
.datos { display: grid; grid-template-columns: 1fr 1fr; column-gap: 10mm; margin: 0; }
.datos div { display: flex; justify-content: space-between; gap: 4mm; padding: 2mm 0; border-bottom: .5pt solid var(--fino); }
.datos div.ancho { grid-column: 1 / -1; }
.datos dt { color: var(--texto); white-space: nowrap; }
.datos dd { margin: 0; text-align: right; font-weight: 500; }

/* Tablas */
table.t { width: 100%; border-collapse: collapse; font-size: 8.8pt; }
.t th, .t td { padding: 1.7mm 2mm; border-bottom: .5pt solid var(--fino); text-align: right; vertical-align: baseline; }
.t th:first-child, .t td:first-child { padding-left: 0; text-align: left; }
.t th:last-child, .t td:last-child { padding-right: 0; }
.t thead th { padding-top: 0; font-size: 6.8pt; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--suave); border-bottom: .6pt solid var(--filete); }
.t tbody th { font-weight: 400; color: var(--texto); }
.t .grupo th { padding-top: 3.2mm; font-size: 7pt; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--acento); border-bottom: 0; }
.t .tot th, .t .tot td { font-weight: 600; color: var(--tinta); border-top: .9pt solid var(--tinta); border-bottom: 0; }
.t .fuerte { font-weight: 600; color: var(--tinta); }
.neg { color: var(--neg); }
.pos { color: var(--pos); }

/* Gráficos */
.chart { margin: 0; }
.chart svg { display: block; width: 100%; height: auto; }
.leg { display: flex; flex-wrap: wrap; gap: 2mm 6mm; margin: 3mm 0 0; font-size: 7.5pt; color: var(--texto); }
.leg i { display: inline-block; width: 2.6mm; height: 2.6mm; border-radius: .6mm; margin-right: 1.6mm; vertical-align: -.3mm; }

/* Método y aviso */
ol.metodo { margin: 0; padding: 0; list-style: none; counter-reset: m; display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 10mm; }
ol.metodo li { position: relative; padding-left: 7mm; font-size: 8.3pt; color: var(--texto); counter-increment: m; }
ol.metodo li::before { content: counter(m, decimal-leading-zero); position: absolute; left: 0; top: .2mm; font-size: 7pt; font-weight: 600; color: var(--acento); }
.aviso { margin-top: 8mm; padding: 4mm 5mm; background: var(--velo); border-radius: 1.5mm; font-size: 7.6pt; line-height: 1.5; color: var(--texto); }
.aviso b { color: var(--tinta); }
.hoja--densa .sec { margin-bottom: 6mm; }
.hoja--densa .sec__h { margin-bottom: 3mm; }
.hoja--densa ol.metodo li { font-size: 7.8pt; }
.hoja--densa .aviso { padding: 3mm 4mm; font-size: 7.2pt; }
.hoja--densa .t th, .hoja--densa .t td { padding-top: 1.4mm; padding-bottom: 1.4mm; }
.hoja--densa .aviso { margin-top: 5mm; }
.hoja--densa ol.metodo { gap: 2mm 10mm; }
`;

  function componer(res, op = {}) {
    const G = global.NuviaJubilacionGraficos;
    const o = res.entrada, r = res.resumen, y1 = res.anio1, b = res.base;
    const vista = op.vista === 'nominal' ? 'nominal' : 'hoy';
    const d = vista === 'hoy' ? y1.deflactor : 1;
    const m = (v) => eur(v / 12 / d);
    const a = (v) => eur(v / d);
    const unidades = vista === 'hoy' ? 'euros de hoy' : 'euros de cada año';
    const hoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const t = y1.irpf;
    const ahorrosHoy = o.liquidez + o.depositos + o.fondos + o.acciones + o.seguros;
    const cobro = { renta: 'en forma de renta', capital: 'de una vez (capital)', mixto: `mixto, ${f0(o.epsvPctCapital)} % de una vez` }[o.epsvCobro];
    const tipoRenta = { flexible: 'retiradas periódicas', temporal: `renta temporal de ${o.epsvAniosRenta} años`, vitalicia: 'renta vitalicia' }[o.epsvRenta];
    const pctIrpf = r.brutoMensual ? r.impuestoMensual / r.brutoMensual : 0;

    /* Datos introducidos */
    const datos = [
      ['Edad actual', o.edad + ' años'],
      ['Jubilación', o.aniosHastaJubilacion ? `A los ${o.edadJubilacion} años` : 'Ya jubilado/a'],
      ['Pensión pública bruta', `${eur(o.pension)} × 14 pagas`],
      ['Horizonte del plan', `Hasta los ${o.edadFin} años` + (o.horizonte === 'esperanza' ? ` (esperanza de vida + ${o.margen})` : '')],
      ['Ahorros e inversiones hoy', eur(ahorrosHoy)],
      ['Uso de los ahorros', o.estrategia === 'conservar' ? 'Vivir de lo que rinden' : 'Gastarlos a lo largo del plan'],
      ['EPSV', o.tieneEpsv ? `${eur(o.epsvPre + o.epsvPost)}, ${cobro}${o.epsvCobro !== 'capital' ? ' · ' + tipoRenta : ''}` : 'No'],
      ['Rentabilidad · IPC', `${pct(o.rentabilidad)} · ${pct(o.inflacion)} al año`],
    ];
    if (o.aniosHastaJubilacion && o.ahorroAnual > 0) datos.splice(5, 0, ['Ahorro anual hasta jubilarte', eur(o.ahorroAnual)]);
    const largo = ([, v]) => String(v).length > 26;
    const datosHtml = datos.filter((x) => !largo(x)).concat(datos.filter(largo))
      .map(([k, v]) => `<div${largo([k, v]) ? ' class="ancho"' : ''}><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

    const dur = b.saldoInicial <= 1 ? 'Sin ahorros que retirar' : o.estrategia === 'conservar' ? 'El capital mantiene su valor' : b.edadAgotado ? `Los ahorros se agotan a los ${b.edadAgotado} años` : `Los ahorros duran hasta los ${o.edadFin} años`;

    /* Mapa fiscal del primer año */
    const fila = (k, mes, cls = '') => `<tr${cls ? ` class="${cls}"` : ''}><th>${esc(k)}</th><td>${esc(mes)}</td></tr>`;
    const fiscal = (k, anual, signo = '', cls = '') => `<tr><th>${esc(k)}</th><td class="${cls}">${signo}${esc(m(anual))}</td><td class="${cls}">${signo}${esc(a(anual))}</td></tr>`;
    const hayEpsvTrab = y1.epsvTrabajo > .5, hayEpsvAh = y1.epsvRent - y1.epsvRentExenta > .5, hayExenta = y1.epsvRentExenta > .5;
    const tablaFiscal = `<table class="t"><thead><tr><th>Concepto</th><th>Al mes</th><th>Al año</th></tr></thead><tbody>
      <tr class="grupo"><th colspan="3">Qué tributa y dónde</th></tr>
      ${fiscal(`Pensión${hayEpsvTrab ? ' y aportaciones de la EPSV' : ''} · base general`, y1.pension + y1.epsvTrabajo)}
      ${fiscal(`Ganancias e intereses${hayEpsvAh ? ' y rentabilidad de la EPSV' : ''} · base del ahorro`, t.ahorro)}
      ${fiscal(`No tributa: capital propio${hayExenta ? ' y rentabilidad exenta de la EPSV' : ''}`, y1.principal + y1.epsvRentExenta)}
      <tr class="grupo"><th colspan="3">Impuesto</th></tr>
      ${fiscal('Cuota de la base general (23 % – 49 %)', t.cuotaGeneral, '−', 'neg')}
      ${fiscal('Cuota de la base del ahorro (19 % – 28 %)', t.cuotaAhorro, '−', 'neg')}
      ${t.deducciones > .5 ? fiscal('Deducciones aplicadas', t.deducciones, '+', 'pos') : ''}
      <tr class="tot"><th>IRPF total · ${pct(y1.bruto ? y1.impuesto / y1.bruto : 0)} de lo cobrado en bruto</th><td class="neg">−${esc(m(t.total))}</td><td class="neg">−${esc(a(t.total))}</td></tr>
    </tbody></table>
    <p class="nota">Tipo marginal de la base general: ${pct(t.marginalGeneral)} · tipo marginal de la base del ahorro: ${pct(t.marginalAhorro)}.</p>`;

    /* Tabla de evolución por edades */
    const filas = b.filas || [];
    const salto = Math.max(5, Math.ceil(filas.length / 6 / 5) * 5);
    const elegidas = filas.filter((f, i) => i % salto === 0 || i === filas.length - 1);
    const saldoVista = (f) => vista === 'hoy' ? f.saldo / (f.deflactor * (1 + o.inflacion)) : f.saldo;
    const tablaAnios = `<table class="t"><thead><tr><th>Edad</th><th>Pensión bruta</th><th>Retiradas</th><th>IRPF</th><th>Neto al mes</th><th>Ahorros al cierre</th></tr></thead><tbody>
      ${elegidas.map((f) => { const dd = vista === 'hoy' ? f.deflactor : 1; const mm = (v) => eur(v / 12 / dd); return `<tr><th>${f.edad} años</th><td>${mm(f.pension)}</td><td>${mm(f.retiradaAhorros + f.retiradaEpsv)}</td><td class="neg">−${mm(f.impuesto)}</td><td class="fuerte">${mm(f.neto)}</td><td>${eur(saldoVista(f))}</td></tr>`; }).join('')}
    </tbody></table>
    <p class="nota">Importes mensuales (media de 12 meses) en ${unidades}. Se muestra un año de cada ${salto}; el simulador ofrece la tabla completa.</p>`;

    /* Escenarios */
    const escen = res.escenarios.map((e) => {
      const finHoy = e.saldoFinal / (e.filas.at(-1).deflactor * (1 + o.inflacion));
      const resultado = e.saldoInicial <= 1 ? 'Sin ahorros' : e.edadAgotado ? `Se agotan a los ${e.edadAgotado} años` : finHoy > 1000 ? `Sobran ${eur(finHoy)} (euros de hoy)` : `Llegan justo a los ${o.edadFin} años`;
      const hip = e.clave === 'estres' ? '−12 % y −5 % los dos primeros años' : pct(e.r) + ' al año';
      const cob = typeof e.cobertura === 'number' ? pct(Math.min(1, e.cobertura), 0) : '';
      return `<tr${e.clave === 'base' ? ' class="fuerte"' : ''}><th${e.clave === 'base' ? ' class="fuerte"' : ''}>${esc(e.nombre)}</th><td>${esc(hip)}</td><td>${esc(cob)}</td><td>${esc(resultado)}</td></tr>`;
    }).join('');

    const cap = res.capital ? `<section class="sec"><div class="sec__h"><em>06</em><h2>Cobro de la EPSV de una vez</h2><small>Comparativa de regímenes</small></div>
      <table class="t"><thead><tr><th></th><th>Régimen transitorio</th><th>Régimen desde 2026</th></tr></thead><tbody>
      <tr><th>Cobro bruto</th><td>${eur(res.capital.transitorio.bases.bruto)}</td><td>${eur(res.capital.nuevo.bases.bruto)}</td></tr>
      <tr><th>Base general · base del ahorro</th><td>${eur(res.capital.transitorio.bases.general)} · ${eur(res.capital.transitorio.bases.ahorro)}</td><td>${eur(res.capital.nuevo.bases.general)} · ${eur(res.capital.nuevo.bases.ahorro)}</td></tr>
      <tr><th>Impuesto estimado</th><td class="neg">−${eur(res.capital.transitorio.impuesto)}</td><td class="neg">−${eur(res.capital.nuevo.impuesto)}</td></tr>
      <tr class="tot"><th>Neto</th><td>${eur(res.capital.transitorio.neto)}</td><td>${eur(res.capital.nuevo.neto)}</td></tr></tbody></table>
      <p class="nota">Aplicado: ${res.capital.elegido === 'transitorio' ? 'régimen transitorio' : 'régimen desde 2026'}${res.capital.automatico ? ' (menor impuesto estimado)' : ''}. El neto se suma a los ahorros del plan.</p></section>` : '';
    const nMetodo = res.capital ? '07' : '06';

    const leyenda = [['#2c4f8f', 'Pensión neta'], ['#0797a8', 'Ahorros netos'], ['#d09a2a', 'EPSV neta'], ['#c2413f', 'IRPF']]
      .filter(([, k]) => k !== 'EPSV neta' || o.tieneEpsv).map(([c, k]) => `<span><i style="background:${c}"></i>${k}</span>`).join('');

    const cab = `<header class="cab"><img src="${LOGO}" alt="NUVIA Family Wealth"><p><b>Informe de jubilación</b><br>Bizkaia · IRPF 2026 · ${esc(hoy)}</p></header>`;
    const pie = (n) => `<footer class="pie"><span>Estimación orientativa a partir de los datos introducidos. No constituye asesoramiento financiero, fiscal ni jurídico.</span><span>Página ${n} de 3</span></footer>`;
    const sec = (n, titulo, extra, cuerpo) => `<section class="sec"><div class="sec__h"><em>${n}</em><h2>${titulo}</h2>${extra ? `<small>${extra}</small>` : ''}</div>${cuerpo}</section>`;

    return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><base href="${esc(op.base || (global.location ? global.location.href : ''))}">
<title>Informe de jubilación · NUVIA</title>
<link rel="stylesheet" href="estilos/nuvia-fonts.css">
<style>${CSS}</style></head><body>

<article class="hoja">${cab}<div class="cuerpo">
  <p class="kicker">Tu estimación de jubilación</p>
  <h1>Tu ingreso en la jubilación</h1>
  <p class="entradilla">${o.aniosHastaJubilacion ? `Al jubilarte a los ${o.edadJubilacion} años` : `Primer año de jubilación, a los ${o.edadJubilacion} años`}. Importes mensuales en ${unidades}, como media de 12 meses, una vez descontado el IRPF de Bizkaia.</p>
  <div class="hero">
    <div class="hero__main"><span class="lbl">Ingreso neto mensual</span><strong>${esc(eur(r.netoMensual / d))}</strong><span class="sub">Bruto ${esc(eur(r.brutoMensual / d))} · IRPF ${esc(pct(pctIrpf))}</span><br><span class="dur">${esc(dur)}</span></div>
    <div class="hero__cifras">
      <div><span>Pensión neta</span><b>${esc(m(y1.pensionNeta))}</b></div>
      <div><span>Retiradas netas (ahorros${o.tieneEpsv ? ' y EPSV' : ''})</span><b>${esc(m(y1.restoNeto))}</b></div>
      <div><span>Ingreso bruto</span><b>${esc(m(y1.bruto))}</b></div>
      <div class="neg"><span>IRPF estimado</span><b>−${esc(m(y1.impuesto))}</b></div>
    </div>
  </div>
  ${sec('01', 'Tus datos', 'Introducidos en el simulador', `<dl class="datos">${datosHtml}</dl>`)}
  ${sec('02', 'De lo que cobras a lo que te queda', 'Primer año · al mes', `<div class="chart">${G.cascada(y1, { vista, ancho: 760, alto: 250 })}</div>`)}
</div>${pie(1)}</article>

<article class="hoja">${cab}<div class="cuerpo">
  ${sec('03', 'Qué impuesto se aplica', 'Primer año', tablaFiscal)}
  ${sec('04', 'Tu ingreso año a año', unidades.charAt(0).toUpperCase() + unidades.slice(1), `<div class="chart">${G.ingresos(filas, { vista, edadAgotado: b.edadAgotado, ancho: 760, alto: 225 })}</div><p class="leg">${leyenda}</p><div style="margin-top:5mm">${tablaAnios}</div>`)}
</div>${pie(2)}</article>

<article class="hoja${res.capital ? ' hoja--densa' : ''}">${cab}<div class="cuerpo">
  ${sec('05', '¿Cuánto dura el dinero si la rentabilidad cambia?', 'Mismas retiradas en todos los casos', `<div class="chart">${G.saldos(res.escenarios, { vista, inflacion: o.inflacion, deflactor0: y1.deflactor, ancho: 760, alto: res.capital ? 185 : 250 })}</div>
    <table class="t" style="margin-top:5mm"><thead><tr><th>Escenario</th><th>Rentabilidad</th><th>Cubierto</th><th>Resultado</th></tr></thead><tbody>${escen}</tbody></table>
    <p class="nota">«Cubierto» es la parte de las retiradas previstas que el patrimonio llega a pagar hasta el final del plan.</p>`)}
  ${cap}
  ${sec(nMetodo, 'Cómo se ha calculado', '', `<ol class="metodo">
    <li>La pensión y las retiradas suben cada año con el IPC indicado. Los importes «de hoy» descuentan esa inflación.</li>
    <li>La retirada de ahorros se calcula para que duren hasta la edad del plan o, si se conserva el capital, se retira solo la rentabilidad por encima del IPC.</li>
    <li>IRPF de Bizkaia 2026: la pensión y las aportaciones de la EPSV van a la base general; las ganancias, los intereses y la rentabilidad de la EPSV, a la del ahorro.</li>
    <li>Se aplican la bonificación del trabajo, la minoración de 1.615 € y la deducción por edad. Las escalas se mantienen fijas; no se compensan pérdidas ni se incluyen otros ingresos.</li>
  </ol>
  <div class="aviso"><b>Aviso importante.</b> Estimación orientativa elaborada con el simulador de NUVIA a partir de los datos introducidos por el usuario. No es una liquidación tributaria ni constituye asesoramiento financiero, fiscal o jurídico personalizado. Los resultados dependen de hipótesis de rentabilidad e inflación que pueden no cumplirse. Válido solo para contribuyentes del IRPF de Bizkaia.</div>`)}
</div>${pie(3)}</article>
</body></html>`;
  }

  function imprimir(res, op) {
    const doc = global.document; if (!doc) return;
    const html = componer(res, Object.assign({ base: global.location.href }, op || {}));
    const prev = doc.getElementById('jb-informe-frame'); if (prev) prev.remove();
    const fr = doc.createElement('iframe');
    fr.id = 'jb-informe-frame'; fr.title = 'Informe de jubilación'; fr.setAttribute('aria-hidden', 'true');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    doc.body.appendChild(fr);
    const w = fr.contentWindow; w.document.open(); w.document.write(html); w.document.close();
    /* El nombre del PDF sale del título de la página principal: se cambia mientras dura la impresión. */
    const tituloPrevio = doc.title;
    const fecha = new Date().toISOString().slice(0, 10);
    const restaurar = () => { doc.title = tituloPrevio; };
    const lanzar = () => {
      try { doc.title = `Informe de jubilación NUVIA ${fecha}`; w.focus(); w.print(); } catch (e) { console.error(e); }
      setTimeout(restaurar, 1000);
    };
    const imgs = [...w.document.images];
    Promise.all(imgs.map((i) => i.complete ? null : new Promise((ok) => { i.onload = i.onerror = ok; })))
      .then(() => (w.document.fonts ? w.document.fonts.ready : null)).then(() => setTimeout(lanzar, 150));
  }

  global.NuviaJubilacionInforme = { componer, imprimir };
})(typeof globalThis !== 'undefined' ? globalThis : this);
