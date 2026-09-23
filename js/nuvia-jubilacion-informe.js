/* ============================================================================
   NUVIA · Informe imprimible del simulador de jubilación
   ----------------------------------------------------------------------------
   Compone un informe A4 (dos páginas) con los datos introducidos, el resultado
   y los gráficos, y lo imprime desde un iframe oculto. Nada sale del navegador.
   Expone globalThis.NuviaJubilacionInforme.
   ========================================================================== */
(function (global) {
  'use strict';
  const f0 = (n) => { const v = Math.round(Number(n) || 0); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  const eur = (n) => f0(n) + ' €';
  const pct = (x, d = 1) => (x * 100).toFixed(d).replace('.', ',') + ' %';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function componer(res, op = {}) {
    const G = global.NuviaJubilacionGraficos;
    const o = res.entrada, r = res.resumen, y1 = res.anio1, b = res.base;
    const vista = op.vista === 'nominal' ? 'nominal' : 'hoy';
    const d = vista === 'hoy' ? y1.deflactor : 1; const m = (v) => eur(v / 12 / d);
    const unidades = vista === 'hoy' ? 'euros de hoy' : 'euros de cada año';
    const hoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const t = y1.irpf;
    const ahorrosHoy = o.liquidez + o.depositos + o.fondos + o.acciones + o.seguros;
    const cobro = { renta: 'En forma de renta', capital: 'Todo de una vez (capital)', mixto: `Mixto: ${f0(o.epsvPctCapital)} % de una vez` }[o.epsvCobro];
    const tipoRenta = { flexible: 'retiradas periódicas', temporal: `renta temporal de ${o.epsvAniosRenta} años`, vitalicia: 'renta vitalicia' }[o.epsvRenta];
    const filaDato = (k, v) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`;
    const datos = [
      ['Edad actual', o.edad + ' años'],
      ['Jubilación', o.aniosHastaJubilacion ? `A los ${o.edadJubilacion} años` : 'Ya jubilado/a'],
      ['Pensión bruta', `${eur(o.pension)} al mes × 14 pagas`],
      ['Plan hasta', `${o.edadFin} años` + (o.horizonte === 'esperanza' ? ' (esperanza de vida + ' + o.margen + ')' : '')],
      ['Ahorros hoy', eur(ahorrosHoy)],
      ['Uso de los ahorros', o.estrategia === 'conservar' ? 'Vivir de lo que rinden' : 'Gastarlos hasta el final del plan'],
      ['EPSV', o.tieneEpsv ? `${eur(o.epsvPre + o.epsvPost)} · ${cobro}${o.epsvCobro !== 'capital' ? ', ' + tipoRenta : ''}` : 'No'],
      ['Rentabilidad / IPC', `${pct(o.rentabilidad)} / ${pct(o.inflacion)} al año`],
    ].map(([k, v]) => filaDato(k, v)).join('');
    const escen = res.escenarios.map((e) => {
      const finHoy = e.saldoFinal / (e.filas.at(-1).deflactor * (1 + o.inflacion));
      const resultado = e.saldoInicial <= 1 ? 'Sin ahorros' : e.edadAgotado ? `Se agotan a los ${e.edadAgotado}` : finHoy > 1000 ? `Sobran ${eur(finHoy)} (euros de hoy)` : `Llegan justo a los ${o.edadFin}`;
      const hip = e.clave === 'estres' ? '−12 % y −5 % al inicio' : pct(e.r) + ' al año';
      return `<tr><th>${esc(e.nombre)}</th><td>${esc(hip)}</td><td>${esc(resultado)}</td></tr>`;
    }).join('');
    const dur = b.saldoInicial <= 1 ? 'Sin ahorros que retirar' : o.estrategia === 'conservar' ? 'El capital mantiene su valor' : b.edadAgotado ? `Los ahorros se agotan a los ${b.edadAgotado}` : `Los ahorros duran hasta los ${o.edadFin}`;
    const cap = res.capital ? `<section class="blk"><h3>Cobro de la EPSV de una vez</h3><table class="t"><thead><tr><th></th><th>Transitorio</th><th>Desde 2026</th></tr></thead><tbody>
      <tr><th>Cobro bruto</th><td>${eur(res.capital.transitorio.bases.bruto)}</td><td>${eur(res.capital.nuevo.bases.bruto)}</td></tr>
      <tr><th>Base general / del ahorro</th><td>${eur(res.capital.transitorio.bases.general)} / ${eur(res.capital.transitorio.bases.ahorro)}</td><td>${eur(res.capital.nuevo.bases.general)} / ${eur(res.capital.nuevo.bases.ahorro)}</td></tr>
      <tr><th>Impuesto estimado</th><td class="neg">−${eur(res.capital.transitorio.impuesto)}</td><td class="neg">−${eur(res.capital.nuevo.impuesto)}</td></tr>
      <tr class="tot"><th>Neto</th><td>${eur(res.capital.transitorio.neto)}</td><td>${eur(res.capital.nuevo.neto)}</td></tr></tbody></table>
      <p class="nota">Aplicado: ${res.capital.elegido === 'transitorio' ? 'régimen transitorio' : 'régimen desde 2026'}${res.capital.automatico ? ' (menor impuesto estimado)' : ''}. El neto se suma a los ahorros del plan.</p></section>` : '';
    const leyenda = [['#2c4f8f', 'Pensión neta'], ['#0797a8', 'Ahorros netos'], ['#d09a2a', 'EPSV neta'], ['#c2413f', 'IRPF']].map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');

    return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><base href="${esc(op.base || (global.location ? global.location.href : ''))}">
<title>Informe de jubilación · NUVIA</title>
<link rel="stylesheet" href="estilos/nuvia-fonts.css">
<style>
@page { size: A4; margin: 14mm 14mm 16mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #0b2347; font-size: 10pt; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, h3 { margin: 0; font-weight: 500; }
h1 { font-family: Newsreader, Georgia, serif; font-size: 24pt; line-height: 1.1; }
h2 { font-family: Newsreader, Georgia, serif; font-size: 15pt; margin-bottom: 6pt; }
h3 { font-size: 10.5pt; font-weight: 600; margin-bottom: 6pt; }
.top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.5pt solid #0b2347; padding-bottom: 8pt; margin-bottom: 12pt; }
.top img { height: 30pt; }
.top p { margin: 0; color: #5b6472; font-size: 8.5pt; text-align: right; }
.kicker { font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: #5b6472; font-weight: 700; margin: 0 0 3pt; }
.hero { display: grid; grid-template-columns: 1.1fr 1fr; gap: 14pt; align-items: stretch; margin-bottom: 12pt; }
.big { background: #0b2347; color: #fff; border-radius: 8pt; padding: 12pt 14pt; }
.big .kicker { color: #c9d4e3; }
.big strong { display: block; font-size: 30pt; font-weight: 600; line-height: 1.1; font-variant-numeric: tabular-nums; }
.big p { margin: 4pt 0 0; color: #dfe6ef; font-size: 9pt; }
.eq { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt; }
.eq div { border: .75pt solid #d8dee7; border-radius: 6pt; padding: 7pt 9pt; }
.eq b { display: block; font-size: 13pt; font-variant-numeric: tabular-nums; }
.eq span { font-size: 8pt; color: #5b6472; }
.eq .neg b { color: #9c2f2f; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; }
.blk { margin-bottom: 12pt; break-inside: avoid; }
table.t { width: 100%; border-collapse: collapse; font-size: 9pt; font-variant-numeric: tabular-nums; }
.t th, .t td { padding: 3.5pt 4pt; border-bottom: .5pt solid #e3e8ef; text-align: left; vertical-align: top; }
.t td { text-align: right; }
.t thead th { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; color: #5b6472; }
.t th { font-weight: 500; color: #40506a; }
.t .tot th, .t .tot td { font-weight: 700; color: #0b2347; border-top: .75pt solid #0b2347; }
.neg { color: #9c2f2f; }
.pos { color: #2f6b3d; }
.chart { border: .75pt solid #e3e8ef; border-radius: 6pt; padding: 6pt; }
.leg { display: flex; gap: 10pt; font-size: 8pt; color: #40506a; margin: 4pt 0 0; }
.leg i { display: inline-block; width: 8pt; height: 8pt; border-radius: 2pt; margin-right: 4pt; vertical-align: -1pt; }
.nota { font-size: 8pt; color: #5b6472; margin: 4pt 0 0; }
.dur { border-left: 3pt solid #2c4f8f; padding: 4pt 8pt; margin: 0 0 8pt; font-weight: 600; }
.pg2 { break-before: page; }
.foot { margin-top: 12pt; border-top: .75pt solid #d8dee7; padding-top: 6pt; font-size: 7.5pt; color: #5b6472; }
ul.b { margin: 0; padding-left: 12pt; font-size: 8.5pt; color: #40506a; }
</style></head><body>
<header class="top"><img src="src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-rec-transp-web-04.svg" alt="NUVIA Family Wealth"><p>Simulador de jubilación · Bizkaia, IRPF 2026<br>${esc(hoy)}</p></header>
<p class="kicker">Tu estimación de jubilación</p>
<h1>Ingreso neto de ${esc(eur(r.netoMensual / d))} al mes</h1>
<p class="nota" style="margin:4pt 0 12pt">${o.aniosHastaJubilacion ? `Al jubilarte a los ${o.edadJubilacion}` : `Primer año de jubilación, a los ${o.edadJubilacion}`} · importes mensuales en ${unidades} · media de 12 meses</p>
<div class="hero">
  <div class="big"><p class="kicker">Lo que te queda para vivir cada mes</p><strong>${esc(eur(r.netoMensual / d))}</strong><p>Bruto ${esc(eur(r.brutoMensual / d))} · IRPF −${esc(eur(r.impuestoMensual / d))} (${pct(r.brutoMensual ? r.impuestoMensual / r.brutoMensual : 0)})</p><p>${esc(dur)}.</p></div>
  <div class="eq">
    <div><span>Pensión neta</span><b>${esc(m(y1.pensionNeta))}</b></div>
    <div><span>Retiradas netas (ahorros y EPSV)</span><b>${esc(m(y1.restoNeto))}</b></div>
    <div><span>Ingreso bruto</span><b>${esc(m(y1.bruto))}</b></div>
    <div class="neg"><span>IRPF estimado</span><b>−${esc(m(y1.impuesto))}</b></div>
  </div>
</div>
<div class="grid2">
  <section class="blk"><h3>Tus datos</h3><table class="t"><tbody>${datos}</tbody></table></section>
  <section class="blk"><h3>Qué impuesto se aplica (primer año, al mes)</h3><table class="t"><tbody>
    <tr><th>Pensión${y1.epsvTrabajo > .5 ? ' y aportaciones EPSV' : ''} · base general</th><td>${esc(m(y1.pension + y1.epsvTrabajo))}</td></tr>
    <tr><th>Ganancias, intereses${y1.epsvRent - y1.epsvRentExenta > .5 ? ' y rentab. EPSV' : ''} · base del ahorro</th><td>${esc(m(t.ahorro))}</td></tr>
    <tr><th>No tributa (capital propio${y1.epsvRentExenta > .5 ? ', rentab. EPSV exenta' : ''})</th><td>${esc(m(y1.principal + y1.epsvRentExenta))}</td></tr>
    <tr><th>Cuota base general (23–49 %)</th><td class="neg">−${esc(m(t.cuotaGeneral))}</td></tr>
    <tr><th>Cuota base del ahorro (19–28 %)</th><td class="neg">−${esc(m(t.cuotaAhorro))}</td></tr>
    ${t.deducciones > .5 ? `<tr><th>Deducciones</th><td class="pos">+${esc(m(t.deducciones))}</td></tr>` : ''}
    <tr class="tot"><th>IRPF total · ${pct(y1.bruto ? y1.impuesto / y1.bruto : 0)} de lo cobrado en bruto</th><td>−${esc(m(t.total))}</td></tr></tbody></table>
    <p class="nota">Marginal general ${pct(t.marginalGeneral)} · marginal del ahorro ${pct(t.marginalAhorro)}.</p></section>
</div>
<section class="blk"><h3>De lo que cobras a lo que te queda (primer año, al mes)</h3><div class="chart">${G.cascada(y1, { vista, ancho: 760, alto: 230 })}</div></section>
<div class="pg2"></div>
<section class="blk"><h2>Año a año</h2><h3>Ingreso mensual de cada año (${unidades})</h3><div class="chart">${G.ingresos(b.filas, { vista, edadAgotado: b.edadAgotado, ancho: 760, alto: 215 })}</div><p class="leg">${leyenda}</p></section>
<section class="blk"><h3>¿Cuánto dura el dinero si la rentabilidad cambia? (mismas retiradas)</h3><div class="chart">${G.saldos(res.escenarios, { vista, inflacion: o.inflacion, deflactor0: y1.deflactor, ancho: 760, alto: 215 })}</div>
<table class="t" style="margin-top:6pt"><thead><tr><th>Escenario</th><th>Rentabilidad</th><th>Resultado</th></tr></thead><tbody>${escen}</tbody></table></section>
${cap}
<section class="blk"><h3>Cómo se ha calculado</h3><ul class="b">
<li>La pensión y las retiradas suben cada año con el IPC indicado; los importes «de hoy» descuentan esa inflación.</li>
<li>La retirada de ahorros se calcula para que duren hasta la edad del plan (o, si se conserva el capital, solo se retira la rentabilidad por encima del IPC).</li>
<li>IRPF de Bizkaia 2026: pensión y aportaciones de la EPSV en la base general; ganancias, intereses y rentabilidad de la EPSV en la del ahorro; bonificación del trabajo, minoración de 1.615 € y deducción por edad.</li>
<li>Las escalas se mantienen fijas en el tiempo; no se compensan pérdidas ni se incluyen otros ingresos.</li></ul></section>
<p class="foot">Estimación orientativa elaborada con el simulador de NUVIA a partir de los datos introducidos por el usuario. No es una liquidación tributaria ni constituye asesoramiento financiero, fiscal o jurídico personalizado. Válido solo para contribuyentes del IRPF de Bizkaia.</p>
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
    const lanzar = () => { try { w.focus(); w.print(); } catch (e) { console.error(e); } };
    const imgs = [...w.document.images];
    Promise.all(imgs.map((i) => i.complete ? null : new Promise((ok) => { i.onload = i.onerror = ok; })))
      .then(() => (w.document.fonts ? w.document.fonts.ready : null)).then(() => setTimeout(lanzar, 150));
  }

  global.NuviaJubilacionInforme = { componer, imprimir };
})(typeof globalThis !== 'undefined' ? globalThis : this);
