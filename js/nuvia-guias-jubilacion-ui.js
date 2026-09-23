/* ============================================================================
   NUVIA · Guías de jubilación (hoja de ruta y fiscalidad del rescate de EPSV)
   ----------------------------------------------------------------------------
   Mismo lenguaje visual que el simulador de jubilación: pasos guiados, panel
   de resumen al momento, tarjetas con iconos y un informe imprimible. Reutiliza
   las piezas de js/nuvia-jubilacion-ui.js (NuviaJubilacionUI.kit) y el motor
   fiscal (NuviaJubilacion) para el ejemplo del caso práctico de la DFB.
   Expone globalThis.NuviaGuiasJubilacion.
   ========================================================================== */
(function (global) {
  'use strict';

  const K = () => global.NuviaJubilacionUI.kit;
  const h = (...a) => global.React.createElement(...a);
  const frag = (...k) => h(global.React.Fragment, null, ...k);
  const icono = (n, c) => K().icono(n, c);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Anillo de progreso (SVG en React). */
  function anillo(pct, tam = 120, etiqueta) {
    const r = (tam - 14) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, pct));
    return h('div', { className: 'jg-ring', style: { width: tam + 'px', height: tam + 'px' }, role: 'img', 'aria-label': (etiqueta || 'Progreso') + ': ' + v + ' %' },
      h('svg', { viewBox: `0 0 ${tam} ${tam}`, 'aria-hidden': 'true' },
        h('circle', { cx: tam / 2, cy: tam / 2, r, fill: 'none', stroke: '#e3e8ef', strokeWidth: 10 }),
        v > 0 && h('circle', { cx: tam / 2, cy: tam / 2, r, fill: 'none', stroke: '#2c4f8f', strokeWidth: 10, strokeLinecap: 'round', strokeDasharray: `${(v / 100) * c} ${c}`, transform: `rotate(-90 ${tam / 2} ${tam / 2})` })),
      h('span', { className: 'jg-ring__num' }, v, h('small', null, ' %')));
  }
  const barraProgreso = (n, t, etiqueta) => h('div', { className: 'jg-meter' },
    h('div', { className: 'jg-meter__head' }, h('span', null, etiqueta), h('strong', null, n + ' de ' + t)),
    h('div', { className: 'jg-meter__bar', role: 'progressbar', 'aria-label': etiqueta, 'aria-valuemin': 0, 'aria-valuemax': t, 'aria-valuenow': n },
      h('span', { style: { width: (t ? n / t * 100 : 0) + '%' } })));

  function tarjetaCheck({ on, onClick, icon, titulo, texto, key }) {
    return h('button', { key, type: 'button', role: 'checkbox', 'aria-checked': on ? 'true' : 'false', className: 'jg-check' + (on ? ' is-on' : ''), onClick },
      h('span', { className: 'jg-check__box', 'aria-hidden': 'true' }, on ? '✓' : ''),
      icon ? icono(icon, 'jg-check__icon') : null,
      h('span', { className: 'jg-check__text' }, h('strong', null, titulo), texto ? h('span', null, texto) : null));
  }

  /* Informe en iframe oculto, igual que el del simulador. */
  function imprimirHTML(html) {
    const doc = global.document; if (!doc) return;
    const prev = doc.getElementById('jg-informe-frame'); if (prev) prev.remove();
    const fr = doc.createElement('iframe');
    fr.id = 'jg-informe-frame'; fr.title = 'Informe'; fr.setAttribute('aria-hidden', 'true');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    doc.body.appendChild(fr);
    const w = fr.contentWindow; w.document.open(); w.document.write(html); w.document.close();
    const imgs = [...w.document.images];
    Promise.all(imgs.map((i) => i.complete ? null : new Promise((ok) => { i.onload = i.onerror = ok; })))
      .then(() => (w.document.fonts ? w.document.fonts.ready : null)).then(() => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { console.error(e); } }, 150));
  }
  const ESTILO_INFORME = `@page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:#0b2347;font-size:9.5pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3{margin:0;font-weight:500}h1{font-family:Newsreader,Georgia,serif;font-size:22pt;line-height:1.1}h3{font-size:10.5pt;font-weight:600;margin:0 0 5pt}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5pt solid #0b2347;padding-bottom:8pt;margin-bottom:12pt}.top img{height:28pt}.top p{margin:0;color:#5b6472;font-size:8.5pt;text-align:right}
.k{font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:#5b6472;font-weight:700;margin:0 0 3pt}.lead{color:#40506a;margin:4pt 0 12pt}
.hero{display:grid;grid-template-columns:auto 1fr;gap:14pt;align-items:center;background:#0b2347;color:#fff;border-radius:8pt;padding:12pt 14pt;margin-bottom:12pt}.hero .k{color:#c9d4e3}.hero strong{font-size:26pt;font-weight:600}.hero p{margin:2pt 0 0;color:#dfe6ef}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:10pt}.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:12pt}.blk{border:.75pt solid #d8dee7;border-radius:6pt;padding:8pt 10pt;margin-bottom:10pt;break-inside:avoid}
ul{margin:0;padding:0;list-style:none}li{display:flex;gap:6pt;padding:2.5pt 0;border-bottom:.5pt solid #eef1f5}li:last-child{border-bottom:0}.ok{color:#2f6b3d;font-weight:700}.no{color:#9aa3af}
.nota{font-size:8pt;color:#5b6472}.foot{margin-top:10pt;border-top:.75pt solid #d8dee7;padding-top:6pt;font-size:7.5pt;color:#5b6472}.chip{display:inline-block;padding:1pt 6pt;border-radius:8pt;background:#eaf0f8;font-size:8pt;font-weight:600}`;
  const cabecera = (base, titulo) => `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><base href="${esc(base)}"><title>${esc(titulo)} · NUVIA</title><link rel="stylesheet" href="estilos/nuvia-fonts.css"><style>${ESTILO_INFORME}</style></head><body>
<header class="top"><img src="src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-rec-transp-web-04.svg" alt="NUVIA Family Wealth"><p>Guías de jubilación · NUVIA<br>${esc(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))}</p></header>`;

  /* ======================================================================
     GUÍA 1 · HOJA DE RUTA
     ====================================================================== */
  const PLAN = {
    horizontes: [
      { id: 'more-than-10', period: 'Más de 10 años', label: 'Construcción', icono: 'objetivo', priority: 'Objetivo y disciplina de ahorro', description: 'Define el nivel de vida deseado, construye el hábito de ahorro y revisa el plan cuando cambie tu situación.' },
      { id: 'five-to-10', period: 'Entre 5 y 10 años', label: 'Concreción', icono: 'grafico', priority: 'Ingresos, patrimonio y brecha', description: 'Afina la pensión esperada, ordena el patrimonio y cuantifica la diferencia respecto a tus gastos futuros.' },
      { id: 'less-than-5', period: 'Menos de 5 años', label: 'Preparación', icono: 'calendario', priority: 'Liquidez y calendario de cobro', description: 'Reduce incertidumbres, prepara documentación y coordina pensión, ahorro privado y necesidades de liquidez.' },
      { id: 'retired', period: 'Ya jubilado/a', label: 'Seguimiento', icono: 'reloj', priority: 'Sostenibilidad y revisión anual', description: 'Contrasta el gasto real con lo previsto y adapta los cobros a la evolución familiar, patrimonial y fiscal.' },
    ],
    piezas: [
      { id: 'retirement-age', icono: 'calendario', label: 'Edad o fecha objetivo', detail: 'Cuándo te gustaría iniciar esta etapa.' },
      { id: 'public-pension', icono: 'persona', label: 'Estimación de pensión pública', detail: 'Una cifra actualizada o un rango razonable.' },
      { id: 'savings', icono: 'hucha', label: 'Ahorro y previsión acumulados', detail: 'EPSV, planes y otros recursos destinados a jubilación.' },
      { id: 'expenses', icono: 'lista', label: 'Presupuesto de vida futura', detail: 'Gastos esenciales, discrecionales y extraordinarios.' },
      { id: 'housing', icono: 'casa', label: 'Vivienda y deudas previstas', detail: 'Hipoteca, alquiler, reformas o cambio de residencia.' },
      { id: 'family', icono: 'familia', label: 'Compromisos familiares', detail: 'Personas dependientes, ayuda a hijos o legado.' },
    ],
    pasos: [
      { number: '01', icono: 'objetivo', eyebrow: 'Visión personal', title: 'Define tu jubilación', description: 'La planificación empieza por una vida concreta, no por una cifra aislada.', questions: ['¿A qué edad quieres jubilarte?', '¿Dónde y cómo imaginas tu vida cotidiana?', '¿Qué compromisos familiares seguirán activos?'], outcome: 'Una fecha objetivo y una descripción sencilla del nivel de vida deseado.' },
      { number: '02', icono: 'persona', eyebrow: 'Fuentes de ingreso', title: 'Construye tu mapa de ingresos', description: 'Reúne todos los flujos que podrán sostener el presupuesto de jubilación.', questions: ['Pensión pública estimada', 'EPSV y otros sistemas de previsión', 'Alquileres, rentas u otros ingresos recurrentes'], outcome: 'Una visión mensual y anual de los ingresos previsibles.' },
      { number: '03', icono: 'lista', eyebrow: 'Coste de vida', title: 'Estima tus gastos futuros', description: 'Separa el presupuesto estable de los gastos que pueden aparecer de forma puntual.', questions: ['Gastos esenciales del hogar', 'Ocio, viajes y ayuda familiar', 'Salud, dependencia, reformas e imprevistos'], outcome: 'Un presupuesto base, otro deseado y una reserva extraordinaria.' },
      { number: '04', icono: 'balanza', eyebrow: 'Suficiencia', title: 'Identifica la brecha', description: 'Compara ingresos y gastos para saber qué debe cubrir tu ahorro acumulado.', questions: ['Diferencia mensual entre ingresos y gastos', 'Duración prudente del horizonte', 'Efecto de la inflación sobre el presupuesto'], outcome: 'Una necesidad anual que puedas llevar al simulador de NUVIA.' },
      { number: '05', icono: 'casa', eyebrow: 'Arquitectura patrimonial', title: 'Ordena el patrimonio', description: 'Asigna una función clara a la liquidez, la vivienda y el ahorro de largo plazo.', questions: ['Reserva para los próximos años', 'Deudas que seguirán vigentes', 'Patrimonio destinado a uso, renta o legado'], outcome: 'Un mapa patrimonial por función, sin necesidad de elegir productos concretos.' },
      { number: '06', icono: 'calendario', eyebrow: 'Ejecución', title: 'Prepara el calendario de cobro', description: 'Coordina las necesidades de liquidez con la forma de rescatar la previsión privada.', questions: ['Capital inicial realmente necesario', 'Ingresos periódicos deseados', 'Impacto fiscal y documentación disponible'], outcome: 'Una primera decisión entre capital, renta o modalidad mixta para revisar fiscalmente.' },
    ],
    acciones: [
      { id: 'objective', label: 'He definido cómo quiero vivir la jubilación.' },
      { id: 'income-map', label: 'He reunido todas mis fuentes de ingresos futuros.' },
      { id: 'expense-map', label: 'He separado gastos esenciales y discrecionales.' },
      { id: 'gap', label: 'He estimado la diferencia entre ingresos y gastos.' },
      { id: 'liquidity', label: 'He previsto una reserva para imprevistos.' },
      { id: 'longevity', label: 'He considerado longevidad, salud y dependencia.' },
      { id: 'withdrawal', label: 'He comparado capital, renta y modalidad mixta.' },
      { id: 'review', label: 'He fijado una fecha anual para revisar el plan.' },
    ],
    riesgos: [
      { icono: 'reloj', titulo: 'Longevidad', descripcion: 'La jubilación puede durar más de lo previsto.', respuesta: 'Trabaja con un horizonte prudente y revisa el ritmo de gasto.' },
      { icono: 'acciones', titulo: 'Inflación', descripcion: 'El mismo presupuesto compra menos con el paso del tiempo.', respuesta: 'Actualiza gastos e ingresos en términos de poder adquisitivo.' },
      { icono: 'salud', titulo: 'Salud y dependencia', descripcion: 'Pueden aparecer necesidades difíciles de anticipar.', respuesta: 'Reserva liquidez y documenta preferencias y apoyos familiares.' },
      { icono: 'familia', titulo: 'Apoyo familiar', descripcion: 'La ayuda a hijos o dependientes puede prolongarse.', respuesta: 'Separa los compromisos previstos de las ayudas extraordinarias.' },
      { icono: 'monedas', titulo: 'Falta de liquidez', descripcion: 'Un patrimonio elevado no siempre permite pagar gastos inmediatos.', respuesta: 'Asigna una reserva específica a los primeros años y contingencias.' },
      { icono: 'balanza', titulo: 'Concentración fiscal', descripcion: 'Cobrar demasiado en un ejercicio puede alterar la tributación.', respuesta: 'Compara el calendario de rescate antes de ordenar el cobro.' },
    ],
  };

  function estadoPlan(st) {
    const sel = PLAN.horizontes.find((x) => x.id === st.horizonte) || null;
    const nP = PLAN.piezas.filter((p) => st.listas && st.listas[p.id]).length;
    const nD = PLAN.pasos.filter((p, i) => st.revisadas && st.revisadas[i]).length;
    const nA = PLAN.acciones.filter((a) => st.hechas && st.hechas[a.id]).length;
    const total = 1 + PLAN.piezas.length + PLAN.pasos.length + PLAN.acciones.length;
    const progreso = Math.round(((sel ? 1 : 0) + nP + nD + nA) / total * 100);
    let proxima = 'Elegir a qué distancia está tu jubilación.';
    if (sel) {
      const fp = PLAN.piezas.find((p) => !(st.listas || {})[p.id]);
      const fd = PLAN.pasos.findIndex((p, i) => !(st.revisadas || {})[i]);
      const fa = PLAN.acciones.find((a) => !(st.hechas || {})[a.id]);
      proxima = fp ? 'Reunir: ' + fp.label.toLocaleLowerCase('es-ES') + '.' : fd >= 0 ? 'Revisar la decisión «' + PLAN.pasos[fd].title + '».' : fa ? fa.label : 'Revisar el plan una vez al año o cuando cambie tu situación.';
    }
    return { sel, nP, nD, nA, progreso, proxima };
  }

  function planificacion(comp) {
    if (!global.React || !global.NuviaJubilacionUI) return null;
    const st = comp.state; const e = estadoPlan(st); const p = st.paso || 0;
    const set = (o) => comp.setState(o);
    const toggle = (campo, id) => set({ [campo]: Object.assign({}, st[campo], { [id]: !(st[campo] || {})[id] }) });
    const PASOS = [
      { t: 'Tu momento', d: e.sel ? e.sel.label : 'Sin elegir', ic: 'reloj', titulo: '¿A qué distancia está tu jubilación?' },
      { t: 'Lo que ya tienes', d: e.nP + ' de 6 piezas', ic: 'lista', titulo: 'Reúne las piezas básicas' },
      { t: 'Seis decisiones', d: e.nD + ' de 6 revisadas', ic: 'ruta', titulo: 'Seis decisiones, en el orden adecuado' },
      { t: 'Tu plan', d: e.nA + ' de 8 hechas', ic: 'check', titulo: 'Marca lo que ya has hecho' },
    ];
    const cuerpo = [pasoMomento, pasoPiezas, pasoDecisiones, pasoAcciones][p]({ st, e, set, toggle });
    return h('div', { className: 'jb jg' },
      h('div', { className: 'jb-work' },
        h('div', { className: 'jb-steps' },
          h('div', { className: 'jb-steps__top' }, h('p', { className: 'jb-kicker' }, 'Tu hoja de ruta · 4 pasos'),
            h('div', { className: 'jb-steps__tools' }, h('button', { type: 'button', className: 'jb-link', onClick: () => set({ horizonte: null, listas: {}, hechas: {}, revisadas: {}, paso: 0, decision: 0 }) }, 'Empezar de cero'))),
          h('ol', { className: 'jb-stepper' }, PASOS.map((x, i) => h('li', { key: i },
            h('button', { type: 'button', className: 'jb-stepper__btn' + (i === p ? ' is-on' : '') + (i < p ? ' is-done' : ''), 'aria-current': i === p ? 'step' : undefined, onClick: () => set({ paso: i }) },
              h('span', { className: 'jb-stepper__num' }, String(i + 1)), h('span', { className: 'jb-stepper__txt' }, h('strong', null, x.t), h('span', null, x.d)))))),
          h('div', { className: 'jb-panel', role: 'group', 'aria-label': 'Paso ' + (p + 1) + ': ' + PASOS[p].t },
            h('header', { className: 'jb-panel__head' }, h('span', { className: 'jb-panel__icon' }, icono(PASOS[p].ic)),
              h('div', null, h('p', { className: 'jb-kicker' }, 'Paso ' + (p + 1) + ' de 4'), h('h3', null, PASOS[p].titulo))),
            cuerpo,
            h('footer', { className: 'jb-panel__foot' },
              p > 0 ? h('button', { type: 'button', className: 'nv-btn nv-btn--soft', onClick: () => set({ paso: p - 1 }) }, '← Anterior') : h('span'),
              p < 3 ? h('button', { type: 'button', className: 'nv-btn nv-btn--primary', onClick: () => set({ paso: p + 1 }) }, 'Siguiente: ' + PASOS[p + 1].t + ' →')
                : h('button', { type: 'button', className: 'nv-btn nv-btn--primary jb-print', onClick: () => imprimirPlan(st) }, icono('impresora'), 'Imprimir mi hoja de ruta')))),
        h('aside', { className: 'jb-live', 'aria-label': 'Resumen de tu hoja de ruta' }, resumenPlan(st, e))),
      riesgosPlan(),
      siguientes('planificacion'));
  }

  function pasoMomento({ st, e, set }) {
    return h('div', { className: 'jb-panel__body' },
      h('div', { className: 'jb-choices jb-choices--cards jg-cards-4', role: 'radiogroup', 'aria-label': 'Distancia a la jubilación' },
        PLAN.horizontes.map((x) => h('button', { key: x.id, type: 'button', role: 'radio', 'aria-checked': st.horizonte === x.id ? 'true' : 'false', className: 'jb-choice' + (st.horizonte === x.id ? ' is-on' : ''), onClick: () => set({ horizonte: x.id }) },
          icono(x.icono), h('span', { className: 'jb-choice__text' }, h('strong', null, x.period), h('span', null, x.label))))),
      h('ol', { className: 'jg-timeline', 'aria-label': 'Etapas de la planificación' }, PLAN.horizontes.map((x, i) => h('li', { key: x.id, className: 'jg-timeline__item' + (st.horizonte === x.id ? ' is-on' : '') },
        h('span', { className: 'jg-timeline__dot', 'aria-hidden': 'true' }, String(i + 1)),
        h('strong', null, x.label), h('span', null, x.period), h('em', null, x.priority)))),
      e.sel ? h('div', { className: 'jb-hint' }, icono('info'), h('p', null, h('strong', null, 'Prioridad de esta etapa: ' + e.sel.priority + '. '), e.sel.description))
        : h('p', { className: 'jb-note' }, 'Elige una opción: la hoja de ruta ordenará las prioridades según tu etapa.'));
  }

  function pasoPiezas({ st, e, toggle }) {
    return h('div', { className: 'jb-panel__body' },
      h('p', { className: 'jb-lead' }, 'No necesitas conocer todas las respuestas. Marca solo lo que ya sabes o puedes documentar.'),
      h('div', { className: 'jg-grid-3' }, PLAN.piezas.map((x) => tarjetaCheck({ key: x.id, on: (st.listas || {})[x.id], onClick: () => toggle('listas', x.id), icon: x.icono, titulo: x.label, texto: x.detail }))),
      barraProgreso(e.nP, 6, 'Punto de partida preparado'));
  }

  function pasoDecisiones({ st, set, toggle }) {
    const i = st.decision || 0; const d = PLAN.pasos[i]; const rev = (st.revisadas || {})[i];
    return h('div', { className: 'jb-panel__body' },
      h('p', { className: 'jb-lead' }, 'Recorre cada decisión y usa las preguntas para preparar una conversación familiar o profesional.'),
      h('div', { className: 'jg-route' },
        h('ol', { className: 'jg-route__list' }, PLAN.pasos.map((x, j) => h('li', { key: j },
          h('button', { type: 'button', className: 'jg-route__btn' + (j === i ? ' is-on' : '') + ((st.revisadas || {})[j] ? ' is-done' : ''), 'aria-pressed': j === i ? 'true' : 'false', onClick: () => set({ decision: j }) },
            h('span', { className: 'jg-route__num' }, (st.revisadas || {})[j] ? '✓' : x.number), h('span', null, x.title))))),
        h('article', { className: 'jg-route__pane', 'aria-live': 'polite' },
          h('div', { className: 'jg-route__head' }, h('span', { className: 'jb-panel__icon' }, icono(d.icono)), h('div', null, h('p', { className: 'jb-kicker' }, d.eyebrow), h('h4', null, d.title))),
          h('p', { className: 'jb-note' }, d.description),
          h('p', { className: 'jb-field__label' }, 'Preguntas que debes responder'),
          h('ul', { className: 'jg-qs' }, d.questions.map((q) => h('li', { key: q }, h('span', { 'aria-hidden': 'true' }, '?'), q))),
          h('div', { className: 'jg-outcome' }, h('p', { className: 'jb-kicker' }, 'Resultado de este paso'), h('p', null, d.outcome)),
          h('div', { className: 'jg-route__actions' },
            h('button', { type: 'button', role: 'checkbox', 'aria-checked': rev ? 'true' : 'false', className: 'jb-choice' + (rev ? ' is-on' : ''), onClick: () => toggle('revisadas', i) }, rev ? '✓ Revisada' : 'Marcar como revisada'),
            i < 5 ? h('button', { type: 'button', className: 'jb-link', onClick: () => set({ decision: i + 1 }) }, 'Siguiente decisión →') : null))));
  }

  function pasoAcciones({ st, e, toggle }) {
    return h('div', { className: 'jb-panel__body' },
      h('p', { className: 'jb-lead' }, 'Úsalo como agenda de trabajo. Puedes imprimir tu hoja de ruta aunque tengas tareas pendientes.'),
      h('div', { className: 'jg-grid-2' }, PLAN.acciones.map((a) => tarjetaCheck({ key: a.id, on: (st.hechas || {})[a.id], onClick: () => toggle('hechas', a.id), titulo: a.label }))),
      barraProgreso(e.nA, 8, 'Acciones completadas'));
  }

  function resumenPlan(st, e) {
    return h('div', { className: 'jb-live__card' },
      h('p', { className: 'jb-kicker' }, 'Tu hoja de ruta, al momento'),
      h('div', { className: 'jg-live__top' }, anillo(e.progreso, 112, 'Plan completado'),
        h('div', null, h('p', { className: 'jb-live__label' }, 'Plan completado'), h('p', { className: 'jg-live__stage' }, e.sel ? e.sel.label : 'Etapa sin elegir', h('span', null, e.sel ? e.sel.period : 'Paso 1')))),
      barraProgreso(e.nP, 6, 'Piezas reunidas'),
      barraProgreso(e.nD, 6, 'Decisiones revisadas'),
      barraProgreso(e.nA, 8, 'Acciones hechas'),
      h('div', { className: 'jg-next', 'aria-live': 'polite' }, h('p', { className: 'jb-kicker' }, 'Próxima acción'), h('p', null, e.proxima)),
      h('div', { className: 'jb-live__actions' },
        h('button', { type: 'button', className: 'nv-btn nv-btn--primary jb-print', onClick: () => imprimirPlan(st) }, icono('impresora'), 'Imprimir mi hoja de ruta'),
        h('a', { className: 'nv-btn nv-btn--soft', href: 'jubilacion.html' }, 'Calcular en el simulador →')),
      h('p', { className: 'jb-muted jg-privacy' }, 'No se guarda nada: tu selección solo vive mientras tengas abierta esta página.'));
  }

  function riesgosPlan() {
    return h('section', { className: 'jg-section', 'aria-labelledby': 'jg-riesgos' },
      h('p', { className: 'jb-kicker' }, 'Riesgos que conviene anticipar'),
      h('h2', { id: 'jg-riesgos', className: 'jg-h2' }, 'Un buen plan también prepara lo inesperado'),
      h('div', { className: 'jg-grid-3' }, PLAN.riesgos.map((r) => h('article', { key: r.titulo, className: 'jg-card' },
        h('span', { className: 'jg-card__icon' }, icono(r.icono)), h('h3', null, r.titulo), h('p', { className: 'jb-note' }, r.descripcion),
        h('p', { className: 'jg-card__foot' }, h('strong', null, 'Cómo prepararlo: '), r.respuesta)))));
  }

  function siguientes(desde) {
    const card = (href, ic, k, t, d, cta) => h('a', { className: 'jg-next-card', href }, h('span', { className: 'jg-card__icon' }, icono(ic)),
      h('span', { className: 'jg-next-card__text' }, h('span', { className: 'jb-kicker' }, k), h('strong', null, t), h('span', null, d)), h('span', { className: 'jg-next-card__cta' }, cta, ' →'));
    return h('section', { className: 'jg-section', 'aria-label': 'Siguientes pasos' },
      h('div', { className: 'jg-grid-2' },
        card('jubilacion.html' + (desde === 'fiscal' ? '?caso=dfb' : ''), 'calculo', 'Siguiente paso · Calcular', desde === 'fiscal' ? 'Pruébalo con números' : 'Convierte la hoja de ruta en escenarios', desde === 'fiscal' ? 'El simulador compara capital, renta y combinaciones con tu pensión y tus ahorros. Se abre con el caso práctico de la DFB cargado.' : 'Introduce tus datos en el simulador para estimar ingresos, impuestos y hasta cuándo te llega el dinero.', 'Abrir el simulador'),
        desde === 'fiscal'
          ? card('guia-planificacion.html', 'ruta', 'Antes · Ordenar', 'Tu hoja de ruta de jubilación', 'Seis decisiones en orden, las piezas que necesitas y una lista de acciones imprimible.', 'Ver la guía')
          : card('guia-fiscal.html', 'escudo', 'Último paso · Ejecutar', 'Prepara el rescate de tu EPSV', 'Compara capital, renta y modalidad mixta, y su tratamiento fiscal en Bizkaia.', 'Ver fiscalidad y rescate')));
  }

  function componerPlan(st, base) {
    const e = estadoPlan(st);
    const li = (on, t, extra) => `<li><span class="${on ? 'ok' : 'no'}">${on ? '✓' : '○'}</span><span>${esc(t)}${extra ? `<br><span class="nota">${esc(extra)}</span>` : ''}</span></li>`;
    return cabecera(base, 'Mi hoja de ruta de jubilación') + `
<p class="k">Guía de planificación</p><h1>Mi hoja de ruta de jubilación</h1>
<p class="lead">Seis decisiones en orden, las piezas de partida y las acciones pendientes.</p>
<div class="hero"><div><p class="k">Plan completado</p><strong>${e.progreso} %</strong></div><div><p class="k">Etapa</p><p style="font-size:13pt;color:#fff;font-weight:600">${esc(e.sel ? e.sel.label + ' · ' + e.sel.period : 'Sin elegir')}</p><p>${esc(e.sel ? 'Prioridad: ' + e.sel.priority : '')}</p><p><strong style="font-size:10pt">Próxima acción:</strong> ${esc(e.proxima)}</p></div></div>
<div class="g2"><section class="blk"><h3>Piezas de partida · ${e.nP}/6</h3><ul>${PLAN.piezas.map((p) => li((st.listas || {})[p.id], p.label)).join('')}</ul></section>
<section class="blk"><h3>Acciones · ${e.nA}/8</h3><ul>${PLAN.acciones.map((a) => li((st.hechas || {})[a.id], a.label)).join('')}</ul></section></div>
<section class="blk"><h3>Seis decisiones · ${e.nD}/6 revisadas</h3><ul>${PLAN.pasos.map((p, i) => li((st.revisadas || {})[i], p.number + ' · ' + p.title, 'Resultado: ' + p.outcome)).join('')}</ul></section>
<section class="blk"><h3>Riesgos que conviene anticipar</h3><div class="g3">${PLAN.riesgos.map((r) => `<div><strong>${esc(r.titulo)}</strong><br><span class="nota">${esc(r.respuesta)}</span></div>`).join('')}</div></section>
<p class="foot">Guía educativa y orientativa de NUVIA. No constituye asesoramiento financiero, fiscal o jurídico y debe adaptarse a la situación personal, familiar y patrimonial de cada persona.</p></body></html>`;
  }
  const imprimirPlan = (st) => imprimirHTML(componerPlan(st, global.location ? global.location.href : ''));

  /* ======================================================================
     GUÍA 2 · FISCALIDAD Y RESCATE DE LA EPSV
     ====================================================================== */
  const MODOS = {
    capital: { t: 'Capital', k: 'Cobro único o parcial', icono: 'monedas', texto: 'Aporta liquidez inmediata para cancelar deuda, realizar una compra relevante o reorganizar el patrimonio. Puede concentrar más renta fiscal en un solo ejercicio.', ojo: 'Conviene revisar especialmente la parte generada antes de 2026 y si se cumplen los requisitos del régimen transitorio.' },
    renta: { t: 'Renta', k: 'Cobros periódicos', icono: 'reloj', texto: 'Convierte el ahorro en un complemento periódico de ingresos y permite acompasar el cobro al presupuesto de jubilación. Su tratamiento depende de la duración y de cómo se haya configurado la renta.', ojo: 'En el caso práctico oficial, la diferencia entre una renta de al menos 15 años y otra de menor duración es fiscalmente relevante.' },
    mixta: { t: 'Mixta', k: 'Combinación', icono: 'balanza', texto: 'Combina un capital inicial con cobros posteriores. Puede equilibrar liquidez, estabilidad de ingresos y distribución temporal de la tributación.', ojo: 'Exige separar bien cada tramo y documentar qué derechos corresponden al periodo anterior y posterior a 2026.' },
  };
  /* Tratamiento según el caso práctico de la DFB. clase: trabajo | ahorro | exento */
  const TRATAMIENTO = [
    { id: 'renta15', t: 'Renta de 15 años o más, constante', ap: ['trabajo', 'Trabajo al 100 %, a medida que se cobra'], re: ['exento', 'Exenta'] },
    { id: 'rentacorta', t: 'Renta de menor duración', ap: ['trabajo', 'Trabajo al 100 %, a medida que se cobra'], re: ['ahorro', 'Capital mobiliario al 100 %'] },
    { id: 'capital', t: 'Capital sin régimen transitorio', ap: ['trabajo', 'Trabajo integrado al 70 %'], re: ['ahorro', 'Capital mobiliario al 100 %'] },
    { id: 'transitorio', t: 'Capital con régimen transitorio', ap: ['trabajo', 'Tramo anterior a 2026 al 60 % (aportación y rentabilidad); posterior al 70 %'], re: ['ahorro', 'Solo la rentabilidad posterior a 2026, al 100 %'] },
  ];
  const PREGUNTAS = ['¿Cuánta liquidez necesitas realmente el primer año?', '¿Qué otros ingresos tendrás en el ejercicio del cobro?', '¿Qué parte de tus derechos corresponde a aportaciones anteriores a 2026?', '¿Has aplicado antes una reducción por cobro en capital?', '¿Prefieres estabilidad mensual o mayor control sobre el capital?'];
  const TRAMITE = [
    { ic: 'documento', t: 'Pide el desglose a tu EPSV', d: 'Solicita derechos consolidados, aportaciones y rendimientos separados, con identificación de la parte generada hasta el 31 de diciembre de 2025 y desde el 1 de enero de 2026.' },
    { ic: 'escudo', t: 'Acredita la contingencia', d: 'Aporta la resolución o certificado correspondiente a jubilación, incapacidad, dependencia, fallecimiento u otra contingencia admitida, junto con la identificación del beneficiario.' },
    { ic: 'calendario', t: 'Elige modalidad y fechas', d: 'Define si el cobro será en capital, renta o mixto. Antes de firmar, revisa el impacto conjunto con pensión, salario, alquileres y otras rentas del ejercicio.' },
    { ic: 'firma', t: 'Presenta la solicitud completa', d: 'Formaliza la petición conforme a los estatutos y al reglamento de prestaciones de la entidad. Conserva copia fechada de la solicitud y de todos los justificantes.' },
    { ic: 'lista', t: 'Guarda la trazabilidad fiscal', d: 'Conserva el certificado de retenciones y el detalle fiscal de la prestación para contrastarlo al preparar el IRPF y acreditar el régimen aplicado si fuera necesario.' },
  ];
  const DOCUMENTOS = ['DNI o documento de identificación.', 'Resolución o certificado de la contingencia.', 'Acreditación de beneficiario, cuando proceda.', 'Formulario de modalidad y cuenta de abono.', 'Desglose fiscal y temporal emitido por la EPSV.', 'Antecedentes de rescates en capital ya realizados.'];
  const CHECKLIST = ['He confirmado que tributo en Bizkaia.', 'Tengo el desglose anterior y posterior a 2026.', 'He revisado rescates en capital anteriores.', 'He comparado capital, renta y modalidad mixta.', 'He sumado la prestación al resto de ingresos del año.', 'Conozco la retención y sé que no es la cuota final.', 'La solicitud indica fechas e importes con claridad.', 'Conservaré certificados y justificantes fiscales.'];
  const FUENTES = [
    { href: 'https://www.bizkaia.eus/es/normativa-tributaria/novedades-tributarias', k: 'Hacienda Foral de Bizkaia', t: 'Novedades y normativa tributaria', d: 'Acceso al marco fiscal vigente y a las disposiciones que desarrollan el tratamiento de los sistemas de previsión social.' },
    { href: 'https://gidak.bizkaia.eus/content/imagenes/Renta/CASO-PRACTICO-EPSV-26.pdf', k: 'Hacienda Foral de Bizkaia', t: 'Caso práctico EPSV 2026', d: 'El ejemplo oficial de rescate en capital y en renta que resume esta guía.' },
    { href: 'https://www.euskadi.eus/indice-epsv-normativa/web01-s2oga/es/', k: 'Gobierno Vasco', t: 'Índice oficial de normativa EPSV', d: 'Incluye la Ley 5/2012, el Decreto 203/2015 y sus modificaciones, entre ellas el Decreto 13/2024.' },
    { href: 'https://www.euskadi.eus/contenidos/informacion/6021/es_2300/adjuntos/2025/DECRETO-2015.203.entrada-en-vigor.2024.04.02.pdf', k: 'Reglamento consolidado', t: 'Prestaciones, modalidades y plazos', d: 'Texto adaptado del Reglamento de la Ley de EPSV con las reglas administrativas aplicables a la solicitud y el pago.' },
    { href: 'https://www.euskadi.eus/registro-epsv/web01-tramite/es/', k: 'Registro público', t: 'Registro de EPSV de Euskadi', d: 'Información administrativa y acceso al registro oficial de entidades de previsión social voluntaria.' },
  ];

  /* Bases del caso práctico calculadas con el mismo motor que el simulador. */
  function casoDFB() {
    const M = global.NuviaJubilacion; if (!M) return null;
    const r = M.calcular({ pension: 0, liquidez: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, tieneEpsv: true, epsvPre: 89000, epsvPreRent: 27000, epsvPost: 11000, epsvPostRent: 3000, epsvCobro: 'capital' });
    const c = r.capital;
    return {
      transitorio: c.transitorio.bases, nuevo: c.nuevo.bases,
      renta15: { general: 70000, ahorro: 0, exento: 30000 }, rentacorta: { general: 70000, ahorro: 30000, exento: 0 },
    };
  }

  function fiscal(comp) {
    if (!global.React || !global.NuviaJubilacionUI) return null;
    const st = comp.state; const set = (o) => comp.setState(o);
    const modo = st.modo || 'capital';
    const hechos = CHECKLIST.filter((x, i) => (st.check || {})[i]).length;
    return h('div', { className: 'jb jg' },
      h('p', { className: 'jg-scope' }, icono('info'), h('span', null, h('strong', null, 'Ámbito de esta guía. '), 'Se refiere a EPSV y a contribuyentes sujetos al IRPF de Bizkaia. Es información orientativa, revisada en septiembre de 2026; la situación personal, los estatutos de la entidad y posibles cambios normativos pueden alterar el resultado.')),
      h('nav', { className: 'jg-index', 'aria-label': 'Contenido de la guía' },
        [['#ayuda-rescate', '1', 'Cómo elegir'], ['#fiscalidad-2026', '2', 'Fiscalidad 2026'], ['#tramite-administrativo', '3', 'Tramitación'], ['#checklist-rescate', '4', 'Checklist'], ['#normativa-oficial', '5', 'Normativa']].map(([a, n, t]) => h('a', { key: a, href: a }, h('span', null, n), t))),
      seccionElegir(st, set, modo),
      seccionFiscal(st, set),
      seccionTramite(),
      seccionChecklist(st, set, hechos),
      seccionNormativa(),
      h('p', { className: 'jg-scope jg-scope--warn' }, icono('alerta'), h('span', null, h('strong', null, 'Importante. '), 'Esta guía no sustituye el análisis fiscal individual ni la documentación contractual de tu EPSV. Antes de ordenar el cobro, confirma con la entidad y, cuando proceda, con un asesor fiscal, el régimen aplicable a tu expediente concreto.')),
      siguientes('fiscal'));
  }

  function chip(clase, texto) { return h('span', { className: 'jg-tax jg-tax--' + clase }, texto); }

  function seccionElegir(st, set, modo) {
    const m = MODOS[modo];
    const filas = modo === 'capital' ? ['transitorio', 'capital'] : modo === 'renta' ? ['renta15', 'rentacorta'] : ['transitorio', 'capital', 'renta15', 'rentacorta'];
    return h('section', { id: 'ayuda-rescate', className: 'jg-section', 'aria-labelledby': 'jg-elegir' },
      h('p', { className: 'jb-kicker' }, '1 · Ayuda para decidir'),
      h('h2', { id: 'jg-elegir', className: 'jg-h2' }, 'Tres formas de cobrar. Tres perfiles de decisión'),
      h('p', { className: 'jb-lead jg-measure' }, 'No existe una modalidad universalmente mejor. La elección depende de tus ingresos del año, tu necesidad de liquidez, la antigüedad de las aportaciones y el modo en que quieras ordenar el patrimonio durante la jubilación.'),
      h('div', { className: 'jb-choices jb-choices--cards jg-cards-3', role: 'radiogroup', 'aria-label': 'Forma de cobro' },
        Object.entries(MODOS).map(([k, x]) => h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': modo === k ? 'true' : 'false', className: 'jb-choice' + (modo === k ? ' is-on' : ''), onClick: () => set({ modo: k }) },
          icono(x.icono), h('span', { className: 'jb-choice__text' }, h('strong', null, x.t), h('span', null, x.k))))),
      h('div', { className: 'jg-detail' },
        h('div', null, h('h3', null, m.t), h('p', { className: 'jb-note' }, m.texto), h('div', { className: 'jb-hint jg-mt' }, icono('info'), h('p', null, m.ojo))),
        h('div', null, h('p', { className: 'jb-field__label' }, 'Cómo tributa (caso práctico DFB 2026)'),
          h('div', { className: 'jg-matrix', role: 'table', 'aria-label': 'Tratamiento fiscal por modalidad' },
            h('div', { className: 'jg-matrix__row jg-matrix__row--head', role: 'row' }, h('span', { role: 'columnheader' }, 'Modalidad'), h('span', { role: 'columnheader' }, 'Lo que aportaste'), h('span', { role: 'columnheader' }, 'La rentabilidad')),
            TRATAMIENTO.filter((x) => filas.includes(x.id)).map((x) => h('div', { key: x.id, className: 'jg-matrix__row', role: 'row' },
              h('strong', { role: 'cell' }, x.t), h('span', { role: 'cell' }, chip(x.ap[0], x.ap[1])), h('span', { role: 'cell' }, chip(x.re[0], x.re[1]))))),
          h('p', { className: 'jg-legend' }, chip('trabajo', 'Base general · 23–49 %'), chip('ahorro', 'Base del ahorro · 19–28 %'), chip('exento', 'Sin IRPF')))),
      h('div', { className: 'jg-questions' },
        h('h3', null, 'Las cinco preguntas previas'),
        h('ol', null, PREGUNTAS.map((q, i) => h('li', { key: i }, h('span', { className: 'jg-questions__num' }, String(i + 1)), q)))));
  }

  function seccionFiscal(st, set) {
    const K_ = K(); const eur = K_.eur;
    const caso = casoDFB(); const vista = st.vistaDFB || 'transitorio';
    const tot = 100000;
    const bloques = [['Aportado hasta 2025', 62000, 'is-ap1'], ['Rentabilidad hasta 2025', 27000, 'is-re1'], ['Aportado desde 2026', 8000, 'is-ap2'], ['Rentabilidad desde 2026', 3000, 'is-re2']];
    const opciones = [['transitorio', 'Capital · régimen transitorio'], ['nuevo', 'Capital · régimen 2026'], ['renta15', 'Renta de 15 años o más'], ['rentacorta', 'Renta más corta']];
    const b = caso ? caso[vista] : null;
    const gen = b ? b.general : 0, aho = b ? b.ahorro : 0, exe = b ? (b.exento != null ? b.exento : Math.max(0, tot - gen - aho)) : 0;
    const nota = {
      transitorio: 'La prestación se reparte en proporción a lo aportado: 100.000 × 62.000 / 70.000 = 88.571 € pertenecen al tramo anterior a 2026 y se integran al 60 %. Del resto (11.429 €), 3.000 € de rentabilidad van a la base del ahorro y 8.429 € se integran al 70 %.',
      nuevo: 'Toda la rentabilidad (30.000 €) va a la base del ahorro y lo aportado (70.000 €) se integra al 70 % en la base general.',
      renta15: 'Cobrada como renta vitalicia o de al menos 15 años con cuantía constante, la rentabilidad queda exenta y lo aportado tributa como trabajo a medida que se cobra.',
      rentacorta: 'En una renta más corta, lo aportado tributa como trabajo y la rentabilidad como capital mobiliario, en ambos casos a medida que se cobra.',
    }[vista];
    const barra = (v, cls, t) => v > 0.5 ? h('span', { className: cls, style: { width: (v / tot * 100) + '%' }, title: t + ': ' + eur(v) }) : null;
    return h('section', { id: 'fiscalidad-2026', className: 'jg-section', 'aria-labelledby': 'jg-fiscal' },
      h('p', { className: 'jb-kicker' }, '2 · Fiscalidad de Bizkaia'),
      h('h2', { id: 'jg-fiscal', className: 'jg-h2' }, 'La fecha de generación de los derechos importa'),
      h('div', { className: 'jg-grid-2' },
        h('article', { className: 'jg-card' }, h('span', { className: 'jg-card__icon' }, icono('calendario')), h('p', { className: 'jb-kicker' }, 'Derechos anteriores a 2026'), h('h3', null, 'Posible régimen transitorio'),
          h('p', { className: 'jb-note' }, 'El caso práctico de la Hacienda Foral contempla que la parte consolidada hasta el 31 de diciembre de 2025 pueda integrarse como rendimiento del trabajo al 60 % cuando el rescate en capital reúne las condiciones aplicables.'),
          h('p', { className: 'jg-card__foot' }, 'No se aplica automáticamente: deben comprobarse contingencia, modalidad, primera prestación y antecedentes del contribuyente.')),
        h('article', { className: 'jg-card' }, h('span', { className: 'jg-card__icon' }, icono('balanza')), h('p', { className: 'jb-kicker' }, 'Derechos desde 2026'), h('h3', null, 'Aportación y rendimiento se separan'),
          h('p', { className: 'jb-note' }, 'En el ejemplo oficial de cobro en capital, la parte procedente de aportaciones se integra como rendimiento del trabajo al 70 %, mientras que el rendimiento generado se integra al 100 % como rendimiento del capital mobiliario.'),
          h('p', { className: 'jg-card__foot' }, 'Por eso es esencial pedir a la EPSV un certificado que desglose aportaciones, rendimientos y periodos.'))),
      h('article', { className: 'jb-card jg-dfb' },
        h('div', { className: 'jb-card__head' },
          h('div', null, h('p', { className: 'jb-kicker' }, 'Caso práctico DFB 2026'), h('h3', null, 'Los mismos 100.000 €, cuatro formas de tributar'),
            h('p', { className: 'jb-card__lead' }, 'Así se reparten los derechos del ejemplo oficial y qué parte va a cada base según cómo se cobren. Son bases imponibles, no el impuesto final: ese depende del resto de ingresos del año.')),
          h('a', { className: 'jb-link', href: 'https://gidak.bizkaia.eus/content/imagenes/Renta/CASO-PRACTICO-EPSV-26.pdf', target: '_blank', rel: 'noopener noreferrer' }, 'Documento oficial ↗')),
        h('p', { className: 'jb-field__label' }, 'De dónde vienen los 100.000 €'),
        h('div', { className: 'jg-stack', role: 'img', 'aria-label': bloques.map(([t, v]) => t + ' ' + eur(v)).join(', ') }, bloques.map(([t, v, c]) => h('span', { key: t, className: c, style: { width: (v / tot * 100) + '%' } }))),
        h('ul', { className: 'jg-stack__legend' }, bloques.map(([t, v, c]) => h('li', { key: t }, h('i', { className: c }), t, h('strong', null, eur(v))))),
        h('div', { className: 'jg-dfb__switch' }, K_.Opciones({ nombre: 'Forma de cobro del ejemplo', valor: vista, onChange: (v) => set({ vistaDFB: v }), opciones: opciones.map(([v, t]) => ({ v, t })) })),
        h('div', { className: 'jg-bases' },
          h('div', { className: 'jg-bases__bar', role: 'img', 'aria-label': 'Base general ' + eur(gen) + ', base del ahorro ' + eur(aho) + ', sin tributar ' + eur(exe) },
            barra(gen, 'is-gen', 'Base general'), barra(aho, 'is-aho', 'Base del ahorro'), barra(exe, 'is-exe', 'No tributa o reducción')),
          h('div', { className: 'jg-bases__figs' },
            h('div', { className: 'is-gen' }, h('span', null, 'Base general'), h('strong', null, eur(gen))),
            h('div', { className: 'is-aho' }, h('span', null, 'Base del ahorro'), h('strong', null, eur(aho))),
            h('div', { className: 'is-exe' }, h('span', null, vista.indexOf('renta') === 0 ? 'Exento' : 'No integra (reducción)'), h('strong', null, eur(exe))))),
        h('p', { className: 'jb-note' }, nota),
        h('a', { className: 'nv-btn nv-btn--soft jg-cta', href: 'jubilacion.html?caso=dfb' }, 'Ver el impuesto de este caso en el simulador →')));
  }

  function seccionTramite() {
    return h('section', { id: 'tramite-administrativo', className: 'jg-section', 'aria-labelledby': 'jg-tramite' },
      h('p', { className: 'jb-kicker' }, '3 · Regulación administrativa'),
      h('h2', { id: 'jg-tramite', className: 'jg-h2' }, 'Del derecho al cobro: cómo preparar la solicitud'),
      h('p', { className: 'jb-lead jg-measure' }, 'La prestación debe solicitarse a la entidad gestora y acompañarse de documentación completa y suficiente para acreditar la contingencia y la condición de beneficiario.'),
      h('div', { className: 'jg-tramite' },
        h('ol', { className: 'jg-steps5' }, TRAMITE.map((x, i) => h('li', { key: i },
          h('span', { className: 'jg-steps5__dot' }, String(i + 1)),
          h('div', null, h('h3', null, icono(x.ic), x.t), h('p', { className: 'jb-note' }, x.d))))),
        h('div', { className: 'jg-stack-col' },
          h('aside', { className: 'jg-dark' }, icono('reloj'), h('h3', null, 'Plazos de pago'),
            h('p', null, 'Con carácter general, el Reglamento de EPSV prevé el abono dentro de los cinco días hábiles siguientes a una solicitud completa. En sistemas de empleo se aplica el plazo previsto en estatutos o reglamento, con el límite del último día del mes siguiente.'),
            h('p', { className: 'jg-dark__foot' }, 'El cómputo depende de que la documentación sea íntegra y suficiente.')),
          h('aside', { className: 'jg-card' }, h('h3', null, 'Documentación habitual'),
            h('ul', { className: 'jg-docs' }, DOCUMENTOS.map((d) => h('li', { key: d }, icono('documento'), d))),
            h('p', { className: 'jg-card__foot' }, 'La relación exacta depende de la contingencia, de la entidad y de sus estatutos.')))));
  }

  function seccionChecklist(st, set, hechos) {
    const toggle = (i) => set({ check: Object.assign({}, st.check, { [i]: !(st.check || {})[i] }) });
    const pct = Math.round(hechos / CHECKLIST.length * 100);
    return h('section', { id: 'checklist-rescate', className: 'jg-section', 'aria-labelledby': 'jg-check' },
      h('div', { className: 'jb-card jg-checklist' },
        h('div', { className: 'jg-checklist__side' }, h('p', { className: 'jb-kicker' }, '4 · Control previo'), h('h2', { id: 'jg-check', className: 'jg-h2' }, 'Checklist antes de firmar el rescate'),
          anillo(pct, 112, 'Checklist completado'), h('p', { className: 'jb-note' }, hechos + ' de ' + CHECKLIST.length + ' comprobaciones hechas.'),
          h('button', { type: 'button', className: 'nv-btn nv-btn--primary jb-print', onClick: () => imprimirHTML(componerFiscal(st, global.location ? global.location.href : '')) }, icono('impresora'), 'Imprimir mi checklist')),
        h('div', { className: 'jg-grid-2' }, CHECKLIST.map((c, i) => tarjetaCheck({ key: i, on: (st.check || {})[i], onClick: () => toggle(i), titulo: c })))));
  }

  function seccionNormativa() {
    const col = (k, t, items) => h('article', { className: 'jg-card' }, h('p', { className: 'jb-kicker' }, k), h('h3', null, t), h('ul', { className: 'jg-norma' }, items.map(([n, d]) => h('li', { key: n }, h('strong', null, n), ' ', d))));
    return h('section', { id: 'normativa-oficial', className: 'jg-section', 'aria-labelledby': 'jg-norma' },
      h('p', { className: 'jb-kicker' }, '5 · Normativa y fuentes'),
      h('h2', { id: 'jg-norma', className: 'jg-h2' }, 'La referencia oficial, a un clic'),
      h('p', { className: 'jb-lead jg-measure' }, 'La fiscalidad corresponde a la normativa foral de Bizkaia; la organización, supervisión y régimen administrativo de las EPSV se apoya en la normativa de Euskadi y en los estatutos de cada entidad.'),
      h('div', { className: 'jg-grid-2' },
        col('Marco fiscal · Bizkaia', 'IRPF y previsión social', [['Norma Foral 13/2013:', 'marco general del IRPF de Bizkaia.'], ['Norma Foral 2/2025:', 'revisión fiscal con efectos relevantes desde 2026.'], ['Decreto Foral 47/2014:', 'Reglamento del IRPF, con sus modificaciones vigentes.'], ['Decretos Forales 100/2025 y 133/2025:', 'desarrollo reglamentario de la previsión social y actualización del Reglamento.']]),
        col('Marco administrativo · Euskadi', 'Organización y prestaciones EPSV', [['Ley 5/2012:', 'régimen general de las entidades de previsión social voluntaria.'], ['Decreto 203/2015:', 'Reglamento de desarrollo de la Ley de EPSV.'], ['Decreto 13/2024:', 'modificación del reglamento, integrada en el texto adaptado oficial.'], ['Estatutos y reglamento de prestaciones:', 'concretan las condiciones de cada entidad y plan.']])),
      h('div', { className: 'jg-links' }, FUENTES.map((f) => h('a', { key: f.href, className: 'jg-link-card', href: f.href, target: '_blank', rel: 'noopener noreferrer' },
        h('span', { className: 'jb-kicker' }, f.k), h('strong', null, f.t), h('span', null, f.d), h('span', { className: 'jg-link-card__go' }, icono('enlace'), 'Consultar fuente oficial')))));
  }

  function componerFiscal(st, base) {
    const hechos = CHECKLIST.filter((x, i) => (st.check || {})[i]).length;
    const li = (on, t) => `<li><span class="${on ? 'ok' : 'no'}">${on ? '✓' : '○'}</span><span>${esc(t)}</span></li>`;
    return cabecera(base, 'Checklist del rescate de EPSV') + `
<p class="k">Fiscalidad y rescate de la EPSV · Bizkaia 2026</p><h1>Mi checklist antes de firmar el rescate</h1>
<p class="lead">Comprobaciones previas, documentación y pasos de la solicitud.</p>
<div class="hero"><div><p class="k">Comprobaciones hechas</p><strong>${hechos}/${CHECKLIST.length}</strong></div><div><p class="k">Forma de cobro que estás valorando</p><p style="font-size:13pt;color:#fff;font-weight:600">${esc(MODOS[st.modo || 'capital'].t)}</p><p>${esc(MODOS[st.modo || 'capital'].ojo)}</p></div></div>
<div class="g2"><section class="blk"><h3>Checklist</h3><ul>${CHECKLIST.map((c, i) => li((st.check || {})[i], c)).join('')}</ul></section>
<section class="blk"><h3>Documentación habitual</h3><ul>${DOCUMENTOS.map((d) => `<li><span>▫</span><span>${esc(d)}</span></li>`).join('')}</ul></section></div>
<section class="blk"><h3>Cómo tributa cada modalidad (caso práctico DFB 2026)</h3><ul>${TRATAMIENTO.map((x) => `<li><span style="min-width:150pt"><strong>${esc(x.t)}</strong></span><span>Aportado: ${esc(x.ap[1])}<br>Rentabilidad: ${esc(x.re[1])}</span></li>`).join('')}</ul></section>
<section class="blk"><h3>Pasos de la solicitud</h3><ul>${TRAMITE.map((x, i) => `<li><span class="chip">${i + 1}</span><span><strong>${esc(x.t)}.</strong> ${esc(x.d)}</span></li>`).join('')}</ul></section>
<section class="blk"><h3>Las cinco preguntas previas</h3><ul>${PREGUNTAS.map((q, i) => `<li><span class="chip">${i + 1}</span><span>${esc(q)}</span></li>`).join('')}</ul></section>
<p class="foot">Información orientativa para contribuyentes del IRPF de Bizkaia. No sustituye el análisis fiscal individual ni la documentación contractual de la EPSV. Confirma con la entidad y, cuando proceda, con un asesor fiscal el régimen aplicable.</p></body></html>`;
  }

  global.NuviaGuiasJubilacion = { planificacion, fiscal, estadoPlan, casoDFB, componerPlan, componerFiscal };
})(typeof globalThis !== 'undefined' ? globalThis : this);
