/* ============================================================================
   NUVIA · Gráficos del simulador de jubilación
   ----------------------------------------------------------------------------
   Generadores de SVG en texto, sin dependencias. Los usa la página (dentro de
   un contenedor React) y el informe imprimible, para que ambos dibujen
   exactamente lo mismo. Expone globalThis.NuviaJubilacionGraficos.

   Paleta validada (dataviz · validate_palette, modo claro): pensión #2c4f8f,
   ahorros #0797a8, EPSV #d09a2a, IRPF #c2413f. El dorado queda por debajo de
   3:1 frente al fondo: por eso cada gráfico lleva leyenda con texto y la
   página ofrece la tabla año a año.
   ========================================================================== */
(function (global) {
  'use strict';

  const C = Object.freeze({
    pension: '#2c4f8f', ahorros: '#0797a8', epsv: '#d09a2a', irpf: '#c2413f', positivo: '#2f6b3d',
    tinta: '#0b2347', texto: '#40506a', suave: '#5b6472', rejilla: '#e3e8ef', eje: '#b9c3d0', fondo: '#ffffff',
    base: '#2c4f8f', conservador: '#0797a8', optimista: '#b07f1c', estres: '#6a4c9c',
  });

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f0 = (n) => { const v = Math.round(Number(n) || 0); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  const compacto = (n) => {
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace('.', ',') + ' M€';
    if (a >= 1e4) return f0(n / 1000) + ' mil €';
    return f0(n) + ' €';
  };
  const r1 = (n) => Math.round(n * 10) / 10;

  function escalaBonita(max, pasos = 4) {
    if (!(max > 0)) return { max: 1, ticks: [0, 1] };
    const bruto = max / pasos, mag = Math.pow(10, Math.floor(Math.log10(bruto)));
    const norm = bruto / mag, paso = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    const tope = Math.ceil(max / paso) * paso; const ticks = [];
    for (let v = 0; v <= tope + 1e-9; v += paso) ticks.push(v);
    return { max: tope, ticks };
  }

  /* Barra redondeada solo por arriba (4 px), anclada a la base. */
  function barra(x, y, w, hgt, color, redondear) {
    if (hgt <= 0.2) return '';
    const r = redondear ? Math.min(4, w / 2, hgt) : 0;
    if (!r) return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hgt)}" fill="${color}"/>`;
    return `<path d="M${r1(x)},${r1(y + hgt)}V${r1(y + r)}Q${r1(x)},${r1(y)} ${r1(x + r)},${r1(y)}H${r1(x + w - r)}Q${r1(x + w)},${r1(y)} ${r1(x + w)},${r1(y + r)}V${r1(y + hgt)}Z" fill="${color}"/>`;
  }

  /* ------------------------------------------------------------------------
     1 · Ingresos de cada año, apilados: pensión neta, ahorros netos, EPSV
     neta e IRPF. La altura total es el ingreso bruto. Importes mensuales.
     ------------------------------------------------------------------------ */
  function repartoAnual(f) {
    // El IRPF adicional se reparte entre ahorros y EPSV según lo que cada uno
    // aporta a la base imponible. Solo afecta al color, no a los totales.
    const impAh = f.interes + f.ganancia, impEp = f.epsvTrabajo + (f.epsvRent - f.epsvRentExenta);
    const tot = impAh + impEp; const extra = f.impuestoResto;
    const aAh = tot > 0 ? extra * impAh / tot : (f.retiradaAhorros + f.retiradaEpsv > 0 ? extra * f.retiradaAhorros / (f.retiradaAhorros + f.retiradaEpsv) : 0);
    return {
      pension: Math.max(0, f.pensionNeta), ahorros: Math.max(0, f.retiradaAhorros - aAh), epsv: Math.max(0, f.retiradaEpsv - (extra - aAh)),
      irpf: Math.max(0, f.impuesto),
    };
  }

  function ingresos(filas, op = {}) {
    const W = op.ancho || 760, H = op.alto || 300, m = { t: 16, r: 12, b: 34, l: 64 };
    const real = op.vista !== 'nominal';
    const datos = filas.map((f) => { const d = real ? f.deflactor : 1; const p = repartoAnual(f); return { edad: f.edad, pension: p.pension / 12 / d, ahorros: p.ahorros / 12 / d, epsv: p.epsv / 12 / d, irpf: p.irpf / 12 / d }; });
    const maxV = Math.max(1, ...datos.map((d) => d.pension + d.ahorros + d.epsv + d.irpf));
    const esc_ = escalaBonita(maxV);
    const iw = W - m.l - m.r, ih = H - m.t - m.b, n = datos.length;
    const paso = iw / Math.max(1, n), bw = Math.max(3, Math.min(22, paso - 2));
    const y = (v) => m.t + ih - (v / esc_.max) * ih;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(op.titulo || 'Ingreso mensual de cada año, bruto y neto')}" font-family="Inter, system-ui, sans-serif">`;
    for (const t of esc_.ticks) {
      s += `<line x1="${m.l}" x2="${W - m.r}" y1="${r1(y(t))}" y2="${r1(y(t))}" stroke="${t ? C.rejilla : C.eje}" stroke-width="1"/>`;
      s += `<text x="${m.l - 8}" y="${r1(y(t) + 4)}" text-anchor="end" font-size="12" fill="${C.suave}">${esc(f0(t))} €</text>`;
    }
    datos.forEach((d, i) => {
      const x = m.l + i * paso + (paso - bw) / 2; let base = 0;
      const seg = [['pension', C.pension], ['ahorros', C.ahorros], ['epsv', C.epsv], ['irpf', C.irpf]].filter(([k]) => d[k] > 0.5);
      seg.forEach(([k, col], j) => {
        const y0 = y(base), y1 = y(base + d[k]); const alto = y0 - y1 - (j < seg.length - 1 ? 0 : 0);
        s += barra(x, y1, bw, Math.max(0, alto - (j > 0 ? 1.5 : 0)), col, j === seg.length - 1);
        base += d[k];
      });
      if (op.sel === i) s += `<rect x="${r1(m.l + i * paso)}" y="${m.t}" width="${r1(paso)}" height="${ih}" fill="${C.tinta}" fill-opacity=".07"/>`;
      if (i % 5 === 0 || i === n - 1) s += `<text x="${r1(x + bw / 2)}" y="${H - m.b + 18}" text-anchor="middle" font-size="12" fill="${C.suave}">${d.edad}</text>`;
      s += `<rect data-i="${i}" x="${r1(m.l + i * paso)}" y="${m.t}" width="${r1(paso)}" height="${ih}" fill="transparent"><title>${esc(d.edad + ' años · bruto ' + f0(d.pension + d.ahorros + d.epsv + d.irpf) + ' €/mes · neto ' + f0(d.pension + d.ahorros + d.epsv) + ' €/mes')}</title></rect>`;
    });
    if (op.edadAgotado) {
      const i = datos.findIndex((d) => d.edad >= op.edadAgotado);
      if (i >= 0) { const x = m.l + i * paso; s += `<line x1="${r1(x)}" x2="${r1(x)}" y1="${m.t}" y2="${m.t + ih}" stroke="${C.tinta}" stroke-dasharray="4 4"/><text x="${r1(x + 6)}" y="${m.t + 12}" font-size="12" fill="${C.tinta}">Ahorros agotados</text>`; }
    }
    s += `<text x="${m.l}" y="${H - 4}" font-size="12" fill="${C.suave}">Edad</text></svg>`;
    return s;
  }

  /* ------------------------------------------------------------------------
     2 · Patrimonio restante por escenario (mismas retiradas previstas).
     ------------------------------------------------------------------------ */
  function saldos(escenarios, op = {}) {
    const W = op.ancho || 760, H = op.alto || 300, m = { t: 16, r: 190, b: 34, l: 76 };
    const real = op.vista !== 'nominal';
    const serie = escenarios.map((e) => ({ clave: e.clave, nombre: e.nombre, edadAgotado: e.edadAgotado, puntos: [e.saldoInicial].concat(e.filas.map((f) => f.saldo / (real ? f.deflactor * (1 + (op.inflacion || 0)) : 1))), edad0: e.filas[0] ? e.filas[0].edad : 0 }));
    if (real && serie.length) serie.forEach((sr) => { sr.puntos[0] = sr.puntos[0] / (op.deflactor0 || 1); });
    const maxV = Math.max(1, ...serie.flatMap((sr) => sr.puntos));
    const esc_ = escalaBonita(maxV);
    const n = Math.max(...serie.map((sr) => sr.puntos.length)) - 1;
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const x = (i) => m.l + (n ? i / n : 0) * iw, y = (v) => m.t + ih - (Math.max(0, v) / esc_.max) * ih;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Patrimonio que queda cada año según la rentabilidad" font-family="Inter, system-ui, sans-serif">`;
    for (const t of esc_.ticks) {
      s += `<line x1="${m.l}" x2="${W - m.r}" y1="${r1(y(t))}" y2="${r1(y(t))}" stroke="${t ? C.rejilla : C.eje}"/>`;
      s += `<text x="${m.l - 8}" y="${r1(y(t) + 4)}" text-anchor="end" font-size="12" fill="${C.suave}">${esc(compacto(t))}</text>`;
    }
    const e0 = serie[0] ? serie[0].edad0 : 0;
    for (let i = 0; i <= n; i += 5) s += `<text x="${r1(x(i))}" y="${H - m.b + 18}" text-anchor="middle" font-size="12" fill="${C.suave}">${e0 + i}</text>`;
    const estilo = { base: [C.base, 3, ''], conservador: [C.conservador, 2, '7 5'], optimista: [C.optimista, 2, '2 4'], estres: [C.estres, 2, '10 4 2 4'] };
    const base = serie.find((sr) => sr.clave === 'base');
    if (base) s += `<path d="M${x(0)},${y(0)} ${base.puntos.map((v, i) => `L${r1(x(i))},${r1(y(v))}`).join(' ')} L${r1(x(base.puntos.length - 1))},${r1(y(0))}Z" fill="${C.base}" fill-opacity=".08"/>`;
    const etiquetas = [];
    for (const sr of serie) {
      const [col, w, dash] = estilo[sr.clave] || [C.tinta, 2, ''];
      s += `<polyline points="${sr.puntos.map((v, i) => `${r1(x(i))},${r1(y(v))}`).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
      const fin = sr.puntos[sr.puntos.length - 1];
      etiquetas.push({ y: y(fin), col, texto: sr.nombre, valor: fin, detalle: sr.edadAgotado ? 'se agotan a los ' + sr.edadAgotado : fin > 1000 ? 'quedan ' + compacto(fin) : 'llegan justo al final' });
    }
    etiquetas.sort((a, b) => a.y - b.y);
    for (let i = 1; i < etiquetas.length; i++) if (etiquetas[i].y - etiquetas[i - 1].y < 32) etiquetas[i].y = etiquetas[i - 1].y + 32;
    const desborde = etiquetas.length ? etiquetas[etiquetas.length - 1].y - (m.t + ih + 8) : 0;
    if (desborde > 0) etiquetas.forEach((e) => { e.y -= desborde; });
    for (const e of etiquetas) {
      s += `<line x1="${W - m.r + 8}" x2="${W - m.r + 22}" y1="${r1(e.y)}" y2="${r1(e.y)}" stroke="${e.col}" stroke-width="3" stroke-linecap="round"/>`;
      s += `<text x="${W - m.r + 28}" y="${r1(e.y - 2)}" font-size="12" fill="${C.tinta}" font-weight="600">${esc(e.texto)}</text>`;
      s += `<text x="${W - m.r + 28}" y="${r1(e.y + 12)}" font-size="12" fill="${C.suave}">${esc(e.detalle)}</text>`;
    }
    s += `<text x="${m.l}" y="${H - 4}" font-size="12" fill="${C.suave}">Edad</text></svg>`;
    return s;
  }

  /* ------------------------------------------------------------------------
     3 · Cascada del primer año: de lo que cobras en bruto a lo que te queda.
     ------------------------------------------------------------------------ */
  function cascada(f, op = {}) {
    const W = op.ancho || 760, H = op.alto || 280, m = { t: 26, r: 12, b: 44, l: 12 };
    const d = op.vista === 'nominal' ? 1 : f.deflactor; const mes = (v) => v / 12 / d;
    const t = f.irpf; const pasos = [];
    pasos.push({ k: 'Pensión bruta', v: mes(f.pension), c: C.pension, tipo: 'suma' });
    if (f.retiradaAhorros > 0.5) pasos.push({ k: 'Retiradas de ahorros', v: mes(f.retiradaAhorros), c: C.ahorros, tipo: 'suma' });
    if (f.retiradaEpsv > 0.5) pasos.push({ k: 'Cobro de la EPSV', v: mes(f.retiradaEpsv), c: C.epsv, tipo: 'suma' });
    if (t.cuotaGeneral > 0.5) pasos.push({ k: 'IRPF base general', v: -mes(t.cuotaGeneral), c: C.irpf, tipo: 'resta' });
    if (t.cuotaAhorro > 0.5) pasos.push({ k: 'IRPF base del ahorro', v: -mes(t.cuotaAhorro), c: C.irpf, tipo: 'resta' });
    if (t.deducciones > 0.5) pasos.push({ k: 'Deducciones', v: mes(t.deducciones), c: C.positivo, tipo: 'suma' });
    const bruto = mes(f.bruto), neto = mes(f.neto);
    pasos.push({ k: 'Te queda cada mes', v: neto, c: C.tinta, tipo: 'total' });
    const maxV = Math.max(1, bruto + (t.deducciones > 0 ? mes(t.deducciones) : 0));
    const iw = W - m.l - m.r, ih = H - m.t - m.b, n = pasos.length, paso = iw / n, bw = Math.min(86, paso * .62);
    const y = (v) => m.t + ih - (v / maxV) * ih;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Del ingreso bruto al neto en el primer año" font-family="Inter, system-ui, sans-serif">`;
    s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}" stroke="${C.eje}"/>`;
    let acum = 0;
    pasos.forEach((p, i) => {
      const x = m.l + i * paso + (paso - bw) / 2; let y0, y1;
      if (p.tipo === 'total') { y0 = y(0); y1 = y(p.v); }
      else { const a = acum, b = acum + p.v; y0 = y(Math.min(a, b)); y1 = y(Math.max(a, b)); acum = b; }
      const alto = p.tipo === 'total' ? y0 - y1 : y0 - y1;
      s += p.tipo === 'total' ? barra(x, y1, bw, alto, p.c, true) : `<rect x="${r1(x)}" y="${r1(y1)}" width="${r1(bw)}" height="${r1(Math.max(1, alto))}" rx="3" fill="${p.c}"/>`;
      if (i < n - 1 && p.tipo !== 'total') { const yy = y(acum); s += `<line x1="${r1(x + bw)}" x2="${r1(x + paso)}" y1="${r1(yy)}" y2="${r1(yy)}" stroke="${C.eje}" stroke-dasharray="3 3"/>`; }
      const etiqueta = (p.v < 0 ? '−' : p.tipo === 'total' ? '' : '+') + f0(Math.abs(p.v)) + ' €';
      s += `<text x="${r1(x + bw / 2)}" y="${r1(y1 - 7)}" text-anchor="middle" font-size="12" font-weight="600" fill="${C.tinta}">${esc(etiqueta)}</text>`;
      const pal = p.k.split(' '); const l1 = pal.slice(0, Math.ceil(pal.length / 2)).join(' '), l2 = pal.slice(Math.ceil(pal.length / 2)).join(' ');
      s += `<text x="${r1(x + bw / 2)}" y="${H - m.b + 16}" text-anchor="middle" font-size="12" fill="${C.texto}">${esc(l1)}</text>`;
      if (l2) s += `<text x="${r1(x + bw / 2)}" y="${H - m.b + 31}" text-anchor="middle" font-size="12" fill="${C.texto}">${esc(l2)}</text>`;
    });
    s += '</svg>';
    return s;
  }

  /* 4 · Minilínea del patrimonio para el panel en vivo. */
  function minilinea(esc0, op = {}) {
    const W = op.ancho || 280, H = op.alto || 56;
    const pts = [esc0.saldoInicial].concat(esc0.filas.map((f) => f.saldo));
    const max = Math.max(1, ...pts), n = pts.length - 1;
    const x = (i) => 2 + (n ? i / n : 0) * (W - 4), y = (v) => H - 3 - (Math.max(0, v) / max) * (H - 8);
    const linea = pts.map((v, i) => `${r1(x(i))},${r1(y(v))}`).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" aria-hidden="true"><path d="M2,${H - 3} L${linea.replace(/ /g, ' L')} L${r1(x(n))},${H - 3}Z" fill="${C.base}" fill-opacity=".12"/><polyline points="${linea}" fill="none" stroke="${C.base}" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }

  global.NuviaJubilacionGraficos = { COLORES: C, ingresos, saldos, cascada, minilinea, repartoAnual, compacto };
})(typeof globalThis !== 'undefined' ? globalThis : this);
