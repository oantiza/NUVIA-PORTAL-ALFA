/* ============================================================================
   NUVIA · Interfaz del simulador de jubilación
   ----------------------------------------------------------------------------
   Construye la interfaz con React (window.React) a partir del estado del
   componente de la página. La página solo interpola {{ app }}: aquí vive todo
   el recorrido (cuatro pasos), el resultado en vivo y el análisis completo.

   Campos controlados: lo que se ve siempre coincide con el estado, también
   al restablecer o cargar un ejemplo.
   ========================================================================== */
(function (global) {
  'use strict';

  const M = () => global.NuviaJubilacion;
  const G = () => global.NuviaJubilacionGraficos;
  const h = (...a) => global.React.createElement(...a);
  const frag = (...kids) => h(global.React.Fragment, null, ...kids);

  const f0 = (n) => { const v = Math.round(Number(n) || 0); return (v < 0 ? '−' : '') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  const eur = (n) => f0(n) + ' €';
  const pct = (x, d = 1) => (Math.round(x * 100 * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',') + ' %';
  const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

  /* ------------------------------------------------------------ Estado ---- */
  const ACTIVOS = [
    { k: 'liquidez', nombre: 'Liquidez y cuentas', icono: 'monedas', valor: 'liquidez', ayuda: 'Cuentas corrientes y de ahorro.', fiscal: 'Sacar tu dinero no tributa; los intereses de cada año, sí (base del ahorro).' },
    { k: 'depositos', nombre: 'Depósitos y renta fija', icono: 'banco', valor: 'depositos', ayuda: 'Depósitos a plazo, letras, bonos.', fiscal: 'El capital no tributa; los intereses de cada año, sí (base del ahorro).' },
    { k: 'fondos', nombre: 'Fondos de inversión', icono: 'fondos', valor: 'fondos', coste: 'fondosCoste', ayuda: 'Valor actual y lo que aportaste.', fiscal: 'De cada retirada solo tributa la parte que es ganancia (base del ahorro).' },
    { k: 'acciones', nombre: 'Acciones y ETF', icono: 'acciones', valor: 'acciones', coste: 'accionesCoste', ayuda: 'Valor actual y lo que pagaste.', fiscal: 'Al vender, tributa la ganancia sobre lo que pagaste (base del ahorro).' },
    { k: 'seguros', nombre: 'Seguros de ahorro', icono: 'seguro', valor: 'seguros', coste: 'segurosCoste', ayuda: 'Valor de rescate y primas pagadas.', fiscal: 'En cada rescate tributa el rendimiento sobre las primas (base del ahorro).' },
  ];

  function estadoInicial() {
    return Object.assign({}, M().DEFECTO, { jubilado: true, activos: { liquidez: true, depositos: false, fondos: true, acciones: true, seguros: false } });
  }
  function estadoVacio() {
    return Object.assign(estadoInicial(), { pension: 0, liquidez: 0, depositos: 0, fondos: 0, fondosCoste: 0, acciones: 0, accionesCoste: 0, seguros: 0, segurosCoste: 0, activos: { liquidez: false, depositos: false, fondos: false, acciones: false, seguros: false } });
  }
  function casoDFB(s) {
    return Object.assign({}, s, { tieneEpsv: true, epsvDesglose: 'certificado', epsvPre: 89000, epsvPreRent: 27000, epsvPost: 11000, epsvPostRent: 3000, epsvCobro: 'capital', regimen: 'auto', contingencia: 'jubilacion', primerCobro: true, dosAnios: true });
  }
  function entradaMotor(s) {
    const e = Object.assign({}, s);
    for (const a of ACTIVOS) if (!s.activos[a.k]) { e[a.valor] = 0; if (a.coste) e[a.coste] = 0; }
    if (s.jubilado) e.edadJubilacion = s.edad;
    return e;
  }

  /* --------------------------------------------------------------- Iconos -- */
  const TRAZOS = {
    persona: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
    hucha: 'M4 11.5C4 8 7.6 5.5 12 5.5c1.7 0 3.2.4 4.5 1L19 5v3.2c.8.9 1.3 2 1.3 3.3h1.2v3h-1.8a7 7 0 0 1-2.2 2.3V20h-3v-2.2a9 9 0 0 1-3.8 0V20h-3v-3.2A6 6 0 0 1 4 11.5Zm11-.5h.01M9.5 8.5h4',
    escudo: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Zm-3 9 2 2 4-4',
    ajustes: 'M4 7h9m4 0h3M4 12h3m4 0h9M4 17h11m4 0h1M15 5v4M9 10v4M17 15v4',
    monedas: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm2.5-12.5c-.6-.6-1.5-1-2.5-1-1.7 0-3 1-3 2.3 0 2.9 6 1.5 6 4.4 0 1.3-1.3 2.3-3 2.3-1 0-2-.4-2.6-1M12 6v1.5m0 9V18',
    banco: 'M3 10h18L12 4 3 10Zm2 0v8m4.5-8v8m5-8v8M19 10v8M3 20h18',
    fondos: 'M11 4a8 8 0 1 0 9 9h-9V4Zm3-1v7h7a7 7 0 0 0-7-7Z',
    acciones: 'M3 17l6-6 4 4 8-8m-6 0h6v6',
    seguro: 'M3 12a9 9 0 0 1 18 0H3Zm9 0v6.5a2 2 0 0 0 4 0',
    impresora: 'M7 8V3h10v5M7 17H4v-7h16v7h-3M7 14h10v7H7v-7Z',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01',
    reloj: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2',
    balanza: 'M12 3v18M6 21h12M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7Zm14 0-3 6a3 3 0 0 0 6 0l-3-6Z',
    flecha: 'M5 12h14m-6-6 6 6-6 6',
    calculo: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8M8 12h2m4 0h2m-8 4h2m4 0h2',
    lista: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
    ruta: 'M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-14a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16',
    check: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6',
    casa: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
    familia: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 20a6 6 0 0 1 12 0m-1 0a4.5 4.5 0 0 1 9 0',
    calendario: 'M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4',
    documento: 'M14 3H6v18h12V7l-4-4Zm0 0v4h4M9 13h6M9 17h6',
    alerta: 'M12 3 2 20h20L12 3Zm0 6v5m0 3h.01',
    enlace: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
    objetivo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    salud: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
    grafico: 'M4 20V4m0 16h16M8 16v-4m4 4V8m4 8v-6',
    firma: 'M3 17c3-4 5-9 7-9s-1 9 1 9 3-4 5-4 1 3 3 3h2M3 21h18',
  };
  const icono = (n, cls) => h('svg', { className: 'jb-icon' + (cls ? ' ' + cls : ''), viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    h('path', { d: TRAZOS[n], fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }));

  /* Mide el ancho real del contenedor de un gráfico para dibujar el SVG a su
     tamaño: así los rótulos se leen a 12 px en escritorio y en tableta. */
  function medida(comp, clave, defecto) {
    comp._refs = comp._refs || {};
    if (!comp._refs[clave]) comp._refs[clave] = (el) => {
      if (!el || el._jbObs || typeof ResizeObserver === 'undefined') return;
      el._jbObs = new ResizeObserver((entradas) => {
        const w = Math.round(entradas[0].contentRect.width); const actual = (comp.state.anchos || {})[clave];
        if (w > 200 && (!actual || Math.abs(actual - w) > 6)) comp.setState({ anchos: Object.assign({}, comp.state.anchos, { [clave]: w }) });
      });
      el._jbObs.observe(el);
    };
    return { ref: comp._refs[clave], ancho: (comp.state.anchos || {})[clave] || defecto };
  }

  /* ------------------------------------------------------------ Controles -- */
  /* Aviso junto al campo cuando el valor no es válido. El motor nunca calcula
     con un valor fuera de rango: lo limita y el aviso dice cuál usa. */
  function errorCampo(valor, min, max, euros) {
    if (valor === '' || valor === undefined || valor === null) return euros ? '' : 'Escribe un número.';
    const n = Number(valor);
    if (!Number.isFinite(n)) return 'Introduce un número válido.';
    if (min !== undefined && n < min) return 'El mínimo es ' + f0(min) + '; se calcula con ' + f0(min) + '.';
    if (max !== undefined && n > max) return 'El máximo es ' + f0(max) + '; se calcula con ' + f0(max) + '.';
    return '';
  }

  function Campo({ id, etiqueta, valor, unidad, onChange, ayuda, min, max, paso, ancho }) {
    const ayudaId = ayuda ? id + '-ayuda' : undefined;
    const euros = /€/.test(unidad || '');
    const error = errorCampo(valor, min, max, euros); const errId = error ? id + '-error' : undefined;
    return h('div', { className: 'jb-field' + (ancho ? ' jb-field--' + ancho : '') },
      h('label', { htmlFor: id, className: 'jb-field__label' }, etiqueta),
      h('div', { className: 'jb-field__box' },
        euros
          ? h('input', { id, name: id, type: 'text', inputMode: 'numeric', autoComplete: 'off', value: valor === '' || valor === undefined || valor === null ? '' : f0(valor), onChange: (e) => onChange(e.target.value.replace(/[^\d]/g, '')), 'aria-describedby': [ayudaId, errId].filter(Boolean).join(' ') || undefined, 'aria-invalid': error ? 'true' : undefined })
          : h('input', { id, name: id, type: 'number', inputMode: 'decimal', value: valor === undefined || valor === null ? '' : valor, min, max, step: paso || 'any', onChange: (e) => onChange(e.target.value), 'aria-describedby': [ayudaId, errId].filter(Boolean).join(' ') || undefined, 'aria-invalid': error ? 'true' : undefined }),
        unidad ? h('span', { className: 'jb-field__unit', 'aria-hidden': 'true' }, unidad) : null),
      error ? h('p', { id: errId, className: 'jb-field__error', role: 'alert' }, error) : null,
      ayuda ? h('p', { id: ayudaId, className: 'jb-field__help' }, ayuda) : null);
  }

  function Deslizador({ id, etiqueta, valor, min, max, paso, unidad, onChange, ayuda, marcas, formato }) {
    const v = num(valor); const p = Math.max(0, Math.min(100, (v - min) / (max - min) * 100));
    const error = errorCampo(valor, min, max, false);
    return h('div', { className: 'jb-slider' },
      h('div', { className: 'jb-slider__head' },
        h('label', { htmlFor: id, className: 'jb-field__label' }, etiqueta),
        h('div', { className: 'jb-slider__value' },
          h('input', { type: 'number', value: valor, min, max, step: paso, 'aria-label': etiqueta + ' (valor exacto)', 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': error ? id + '-error' : undefined, onChange: (e) => onChange(e.target.value) }),
          h('span', { 'aria-hidden': 'true' }, unidad))),
      h('input', { id, type: 'range', className: 'jb-range', min, max, step: paso, value: Math.min(max, Math.max(min, v)), style: { '--jb-p': p + '%' }, onChange: (e) => onChange(e.target.value), 'aria-valuetext': (formato ? formato(v) : v + ' ' + unidad) }),
      error ? h('p', { id: id + '-error', className: 'jb-field__error', role: 'alert' }, error) : null,
      marcas ? h('div', { className: 'jb-slider__marks', 'aria-hidden': 'true' }, marcas.map((m) => { const q = (parseFloat(m) - min) / (max - min) * 100; return h('span', { key: m, style: { left: q + '%', transform: q <= 3 ? 'none' : q >= 97 ? 'translateX(-100%)' : 'translateX(-50%)' } }, m); })) : null,
      ayuda ? h('p', { className: 'jb-field__help' }, ayuda) : null);
  }

  function Opciones({ nombre, valor, opciones, onChange, grande }) {
    return h('div', { className: 'jb-choices' + (grande ? ' jb-choices--cards' : ''), role: 'radiogroup', 'aria-label': nombre },
      opciones.map((o) => h('button', {
        key: o.v, type: 'button', role: 'radio', 'aria-checked': valor === o.v ? 'true' : 'false',
        className: 'jb-choice' + (valor === o.v ? ' is-on' : ''), onClick: () => onChange(o.v),
      }, o.icono ? icono(o.icono) : null, h('span', { className: 'jb-choice__text' }, h('strong', null, o.t), o.d ? h('span', null, o.d) : null))));
  }

  function Casilla({ id, marcado, onChange, titulo, texto }) {
    return h('label', { className: 'jb-check', htmlFor: id },
      h('input', { id, type: 'checkbox', checked: !!marcado, onChange: (e) => onChange(e.target.checked) }),
      h('span', null, h('strong', null, titulo), texto ? h('span', null, texto) : null));
  }

  /* ------------------------------------------------------------ Render ---- */
  function render(comp) {
    if (!global.React || !M() || !G()) return null;
    const st = comp.state;
    const s = st.s || estadoInicial();
    const set = (k, v) => comp.setState({ s: Object.assign({}, s, { [k]: v }) });
    const setMany = (o) => comp.setState({ s: Object.assign({}, s, o) });
    const clave = JSON.stringify(s);
    if (!comp._cache || comp._cache.k !== clave) comp._cache = { k: clave, r: M().calcular(entradaMotor(s)) };
    const res = comp._cache.r;
    const ctx = { comp, st, s, set, setMany, res };
    return h('div', { className: 'jb' },
      intro(ctx),
      h('div', { className: 'jb-work', id: 'simulador-pasos' },
        h('div', { className: 'jb-steps' }, pasos(ctx), dock(ctx)),
        h('aside', { className: 'jb-live', 'aria-label': 'Resultado en vivo' }, enVivo(ctx))),
      resultados(ctx));
  }

  /* ---------------------------------------------------- Qué calcula ------- */
  function intro() {
    const bloque = (ic, t, d, cls) => h('div', { className: 'jb-flow__item ' + (cls || '') }, h('span', { className: 'jb-flow__icon' }, icono(ic)), h('div', null, h('strong', null, t), h('span', null, d)));
    const op = (t) => h('span', { className: 'jb-flow__op', 'aria-hidden': 'true' }, t);
    return h('section', { className: 'jb-intro', 'aria-labelledby': 'jb-que-calcula' },
      h('div', { className: 'jb-intro__text' },
        h('p', { className: 'jb-kicker' }, 'Qué calcula este simulador'),
        h('h2', { id: 'jb-que-calcula' }, 'Cuánto dinero tendrás cada mes al jubilarte, después de impuestos'),
        h('p', null, 'Suma tu pensión y lo que retires de tus ahorros y de tu EPSV, calcula el IRPF de Bizkaia de cada año y te dice cuánto te queda y hasta cuándo te llega el dinero. Los resultados cambian mientras escribes.'),
        h('p', { className: 'jb-intro__scope' }, h('strong', null, 'Solo para Bizkaia.'), ' Usa las reglas del IRPF foral de 2026; no sirve para Álava, Gipuzkoa, Navarra ni territorio común. Es una estimación orientativa, no asesoramiento.')),
      h('div', { className: 'jb-flow', role: 'img', 'aria-label': 'Pensión más ahorros más EPSV, menos IRPF, igual a tu ingreso neto mensual' },
        bloque('persona', 'Pensión', 'lo que cobras de la Seguridad Social', 'is-pension'), op('+'),
        bloque('hucha', 'Ahorros', 'lo que retiras cada año', 'is-ahorros'), op('+'),
        bloque('escudo', 'EPSV', 'en renta o de una vez', 'is-epsv'), op('−'),
        bloque('balanza', '− IRPF', 'escala de Bizkaia 2026', 'is-irpf'), op('='),
        bloque('calculo', 'Neto al mes', 'lo que te queda para vivir', 'is-neto')));
  }

  /* -------------------------------------------------------------- Pasos --- */
  const PASOS = [
    { t: 'Tú', d: 'Edad y pensión', ic: 'persona' },
    { t: 'Tus ahorros', d: 'Qué tienes y cómo usarlo', ic: 'hucha' },
    { t: 'Tu EPSV', d: 'Si tienes, cómo cobrarla', ic: 'escudo' },
    { t: 'Supuestos', d: 'Rentabilidad e IPC', ic: 'ajustes' },
  ];

  function resumenPaso(i, s, res) {
    const o = res.entrada;
    if (i === 0) return o.edad + ' años · ' + f0(num(s.pension)) + ' €/mes';
    if (i === 1) { const t = ACTIVOS.reduce((a, x) => a + (s.activos[x.k] ? num(s[x.valor]) : 0), 0); return t ? eur(t) : 'Sin ahorros'; }
    if (i === 2) return s.tieneEpsv ? eur(o.epsvPre + o.epsvPost) : 'Sin EPSV';
    return pct(o.rentabilidad) + ' · IPC ' + pct(o.inflacion);
  }

  function pasos(ctx) {
    const { comp, st, s, setMany, res } = ctx; const p = st.paso || 0;
    const ir = (i) => comp.setState({ paso: i });
    const cuerpo = [pasoTu, pasoAhorros, pasoEpsv, pasoSupuestos][p](ctx);
    return frag(
      h('div', { className: 'jb-steps__top' },
        h('p', { className: 'jb-kicker' }, 'Tus datos · 4 pasos'),
        h('div', { className: 'jb-steps__tools' },
          h('button', { type: 'button', className: 'jb-link', onClick: () => comp.setState({ s: estadoInicial(), paso: 0 }) }, 'Cargar el ejemplo'),
          h('button', { type: 'button', className: 'jb-link', onClick: () => comp.setState({ s: estadoVacio(), paso: 0 }) }, 'Empezar de cero'))),
      h('ol', { className: 'jb-stepper' },
        PASOS.map((x, i) => h('li', { key: i },
          h('button', { type: 'button', className: 'jb-stepper__btn' + (i === p ? ' is-on' : '') + (i < p ? ' is-done' : ''), 'aria-current': i === p ? 'step' : undefined, onClick: () => ir(i) },
            h('span', { className: 'jb-stepper__num' }, String(i + 1)),
            h('span', { className: 'jb-stepper__txt' }, h('strong', null, x.t), h('span', null, resumenPaso(i, s, res))))))),
      h('div', { className: 'jb-panel', role: 'group', 'aria-label': 'Paso ' + (p + 1) + ': ' + PASOS[p].t },
        h('header', { className: 'jb-panel__head' },
          h('span', { className: 'jb-panel__icon' }, icono(PASOS[p].ic)),
          h('div', null, h('p', { className: 'jb-kicker' }, 'Paso ' + (p + 1) + ' de 4'), h('h3', null, ['Cuéntanos tu punto de partida', '¿Con qué ahorros cuentas?', '¿Tienes una EPSV?', 'Los supuestos del cálculo'][p]))),
        cuerpo,
        res.avisos.length ? h('div', { className: 'jb-alert', role: 'status' }, res.avisos.map((a, i) => h('p', { key: i }, a))) : null,
        h('footer', { className: 'jb-panel__foot' },
          p > 0 ? h('button', { type: 'button', className: 'nv-btn nv-btn--soft', onClick: () => ir(p - 1) }, '← Anterior') : h('span'),
          p < 3 ? h('button', { type: 'button', className: 'nv-btn nv-btn--primary', onClick: () => ir(p + 1) }, 'Siguiente: ' + PASOS[p + 1].t + ' →')
            : h('a', { className: 'nv-btn nv-btn--primary', href: '#resultados' }, 'Ver mi análisis completo ↓'))));
  }

  function pasoTu({ s, set, setMany, res }) {
    const o = res.entrada;
    return h('div', { className: 'jb-panel__body' },
      h('div', { className: 'jb-grid-2' },
        Deslizador({ id: 'jb-edad', etiqueta: 'Tu edad actual', valor: s.edad, min: 40, max: 95, paso: 1, unidad: 'años', onChange: (v) => set('edad', v) }),
        h('div', { className: 'jb-field' },
          h('p', { className: 'jb-field__label', id: 'jb-jub-l' }, '¿Ya estás jubilado o jubilada?'),
          Opciones({ nombre: '¿Ya estás jubilado o jubilada?', valor: s.jubilado ? 'si' : 'no', onChange: (v) => setMany({ jubilado: v === 'si', edadJubilacion: Math.max(num(s.edad) + (v === 'si' ? 0 : 2), num(s.edadJubilacion)) }),
            opciones: [{ v: 'si', t: 'Sí, o me jubilo ya' }, { v: 'no', t: 'Todavía no' }] }),
          !s.jubilado ? Deslizador({ id: 'jb-edadjub', etiqueta: 'Me jubilaré a los', valor: s.edadJubilacion, min: Math.min(75, num(s.edad) || 40), max: 75, paso: 1, unidad: 'años', onChange: (v) => set('edadJubilacion', v) }) : null)),
      h('div', { className: 'jb-grid-2' },
        Campo({ id: 'jb-pension', etiqueta: 'Pensión pública bruta al mes', valor: s.pension, unidad: '€/mes', paso: 50, min: 0, onChange: (v) => set('pension', v),
          ayuda: 'Antes de impuestos, en cada una de las 14 pagas. ' + (s.jubilado ? 'La tienes en tu carta de revalorización.' : 'Pon la estimación en euros de hoy (simulador de la Seguridad Social).') }),
        h('div', { className: 'jb-hint' }, icono('info'), h('p', null, 'Al año son ', h('strong', null, eur(num(s.pension) * 14)), ' brutos. Tu pensión subirá cada año con el IPC que elijas en el paso 4.'))),
      h('div', { className: 'jb-block' },
        h('p', { className: 'jb-field__label' }, '¿Hasta qué edad quieres que te duren los ahorros?'),
        Opciones({ nombre: 'Horizonte del plan', valor: s.horizonte, onChange: (v) => set('horizonte', v), grande: true, opciones: [
          { v: 'edad', t: 'Hasta una edad concreta', d: 'Tú eliges la edad.', icono: 'reloj' },
          { v: 'esperanza', t: 'Según la esperanza de vida', d: 'Referencia demográfica más un margen de seguridad.', icono: 'persona' }] }),
        s.horizonte === 'edad'
          ? Deslizador({ id: 'jb-edadfin', etiqueta: 'Planificar hasta los', valor: s.edadFin, min: 70, max: 105, paso: 1, unidad: 'años', onChange: (v) => set('edadFin', v), marcas: ['70', '80', '90', '100', '105'] })
          : h('div', { className: 'jb-grid-2 jb-mt' },
            h('div', { className: 'jb-field' }, h('p', { className: 'jb-field__label' }, 'Referencia demográfica'),
              Opciones({ nombre: 'Referencia demográfica', valor: s.sexo, onChange: (v) => set('sexo', v), opciones: [{ v: 'hombre', t: 'Hombre' }, { v: 'mujer', t: 'Mujer' }] })),
            h('div', { className: 'jb-field' }, h('p', { className: 'jb-field__label' }, 'Margen de seguridad'),
              Opciones({ nombre: 'Margen de seguridad', valor: String(s.margen), onChange: (v) => set('margen', Number(v)), opciones: ['0', '5', '10', '15'].map((m) => ({ v: m, t: '+' + m + ' años' })) })),
            h('p', { className: 'jb-note jb-span-2' }, 'A tu edad, la referencia media llega a los ', h('strong', null, (o.edad + o.esperanza).toFixed(0) + ' años'), '; con el margen, el plan dura ', h('strong', null, 'hasta los ' + o.edadFin), '. Es una media estadística: no predice cuánto vivirá una persona.'))));
  }

  function pasoAhorros({ s, set, setMany, res }) {
    const o = res.entrada;
    const total = ACTIVOS.reduce((a, x) => a + (s.activos[x.k] ? num(s[x.valor]) : 0), 0);
    const toggle = (k) => setMany({ activos: Object.assign({}, s.activos, { [k]: !s.activos[k] }) });
    return h('div', { className: 'jb-panel__body' },
      h('p', { className: 'jb-lead' }, 'Marca lo que tienes y escribe cuánto vale hoy. Lo que no marques no cuenta.'),
      h('div', { className: 'jb-tiles' }, ACTIVOS.map((a) => h('button', { key: a.k, type: 'button', className: 'jb-tile' + (s.activos[a.k] ? ' is-on' : ''), 'aria-pressed': s.activos[a.k] ? 'true' : 'false', onClick: () => toggle(a.k) },
        icono(a.icono), h('strong', null, a.nombre), h('span', null, s.activos[a.k] ? eur(num(s[a.valor])) : 'No tengo')))),
      h('div', { className: 'jb-assets' }, ACTIVOS.filter((a) => s.activos[a.k]).map((a) => h('div', { key: a.k, className: 'jb-asset' },
        h('div', { className: 'jb-asset__name' }, icono(a.icono), h('div', null, h('strong', null, a.nombre), h('span', null, a.fiscal))),
        Campo({ id: 'jb-' + a.valor, etiqueta: a.coste ? 'Valor actual' : 'Saldo actual', valor: s[a.valor], unidad: '€', paso: 1000, min: 0, onChange: (v) => set(a.valor, v) }),
        a.coste ? Campo({ id: 'jb-' + a.coste, etiqueta: a.k === 'seguros' ? 'Primas pagadas' : a.k === 'acciones' ? 'Lo que pagaste' : 'Lo que aportaste', valor: s[a.coste], unidad: '€', paso: 1000, min: 0, onChange: (v) => set(a.coste, v) }) : h('span', { className: 'jb-asset__empty' })))),
      h('p', { className: 'jb-total' }, 'Total de tus ahorros hoy: ', h('strong', null, eur(total))),
      !s.jubilado ? h('div', { className: 'jb-grid-2' },
        Campo({ id: 'jb-ahorroanual', etiqueta: 'Ahorro anual hasta jubilarte (opcional)', valor: s.ahorroAnual, unidad: '€/año', paso: 500, min: 0, onChange: (v) => set('ahorroAnual', v), ayuda: 'Se suma cada año a tus inversiones, en euros de hoy.' }),
        h('div', { className: 'jb-hint' }, icono('info'), h('p', null, 'Hasta los ' + o.edadJubilacion + ' tus ahorros crecen con la rentabilidad del paso 4. Al jubilarte tendrías unos ', h('strong', null, eur(res.plan.ini.liq + res.plan.ini.V)), ' (euros de cada año).'))) : null,
      h('div', { className: 'jb-block' },
        h('p', { className: 'jb-field__label' }, '¿Cómo quieres usar tus ahorros?'),
        Opciones({ nombre: 'Uso de los ahorros', valor: s.estrategia, onChange: (v) => set('estrategia', v), grande: true, opciones: [
          { v: 'consumir', t: 'Gastarlos poco a poco hasta los ' + o.edadFin, d: 'Retiras cada año una cantidad que sube con el IPC y los ahorros se acaban a esa edad.', icono: 'reloj' },
          { v: 'conservar', t: 'Vivir solo de lo que rinden', d: 'Retiras solo la rentabilidad por encima del IPC: el capital mantiene su valor.', icono: 'hucha' }] })));
  }

  function barraEpsv(saldo, rent) {
    const t = num(saldo), r = Math.min(t, num(rent)); if (!t) return null;
    return h('div', { className: 'jb-mini', 'aria-hidden': 'true' },
      h('span', { className: 'jb-mini__ap', style: { width: ((t - r) / t * 100) + '%' } }), h('span', { className: 'jb-mini__re', style: { width: (r / t * 100) + '%' } }));
  }

  function pasoEpsv({ comp, s, set, setMany, res }) {
    const o = res.entrada;
    const cuerpoEpsv = !s.tieneEpsv ? h('p', { className: 'jb-note' }, 'Sin EPSV, el cálculo usa tu pensión y tus ahorros. Puedes probar cómo funciona con el ', h('button', { type: 'button', className: 'jb-link', onClick: () => comp.setState({ s: casoDFB(s) }) }, 'caso práctico de la Hacienda Foral'), '.') : frag(
      h('div', { className: 'jb-block' },
        h('p', { className: 'jb-field__label' }, '¿Tienes el certificado de tu EPSV con el desglose?'),
        Opciones({ nombre: 'Certificado de la EPSV', valor: s.epsvDesglose, onChange: (v) => set('epsvDesglose', v), opciones: [{ v: 'certificado', t: 'Sí, lo tengo' }, { v: 'estimacion', t: 'No, estimarlo' }] })),
      s.epsvDesglose === 'certificado'
        ? h('div', { className: 'jb-epsv-grid' },
          [['Pre', 'Aportado hasta el 31/12/2025', 'Derechos anteriores a 2026'], ['Post', 'Aportado desde el 1/1/2026', 'Derechos desde 2026']].map(([k, sub, tit]) => h('div', { key: k, className: 'jb-epsv-box' },
            h('p', { className: 'jb-epsv-box__title' }, tit, h('span', null, sub)),
            Campo({ id: 'jb-epsv' + k, etiqueta: 'Saldo', valor: s['epsv' + k], unidad: '€', paso: 1000, min: 0, onChange: (v) => set('epsv' + k, v) }),
            Campo({ id: 'jb-epsv' + k + 'Rent', etiqueta: 'De ese saldo, rentabilidad', valor: s['epsv' + k + 'Rent'], unidad: '€', paso: 500, min: 0, onChange: (v) => set('epsv' + k + 'Rent', v) }),
            barraEpsv(s['epsv' + k], s['epsv' + k + 'Rent']))),
          h('p', { className: 'jb-legend-mini jb-span-2' }, h('i', { className: 'is-ap' }), 'Lo que aportaste', h('i', { className: 'is-re' }), 'Rentabilidad generada'))
        : h('div', { className: 'jb-grid-2' },
          Campo({ id: 'jb-epsvPost2', etiqueta: 'Saldo total de la EPSV', valor: num(s.epsvPre) + num(s.epsvPost), unidad: '€', paso: 1000, min: 0, onChange: (v) => setMany({ epsvPre: v, epsvPost: 0 }) }),
          h('div', { className: 'jb-field' },
            h('p', { className: 'jb-field__label' }, '¿Sabes cuántos años llevas aportando?'),
            Opciones({ nombre: 'Antigüedad', valor: s.antiguedadConocida ? 'si' : 'no', onChange: (v) => set('antiguedadConocida', v === 'si'), opciones: [{ v: 'si', t: 'Sí' }, { v: 'no', t: 'No' }] }),
            s.antiguedadConocida ? Campo({ id: 'jb-antig', etiqueta: 'Años desde la primera aportación', valor: s.antiguedad, unidad: 'años', min: 1, max: 60, paso: 1, onChange: (v) => set('antiguedad', v) }) : null),
          h('p', { className: 'jb-note jb-span-2' }, 'Sin desglose, Hacienda estima que la rentabilidad es el ', h('strong', null, pct(res.resumen.ratioEpsv, 0)), ' de lo que cobras (1 % por año, máximo 35 %, o 25 % si no conoces la antigüedad).')),
      h('div', { className: 'jb-block' },
        h('p', { className: 'jb-field__label' }, '¿Cómo la cobrarás?'),
        Opciones({ nombre: 'Forma de cobro', valor: s.epsvCobro, onChange: (v) => set('epsvCobro', v), grande: true, opciones: [
          { v: 'renta', t: 'En forma de renta', d: 'Cobros periódicos durante años.', icono: 'reloj' },
          { v: 'capital', t: 'Todo de una vez', d: 'Un cobro único en capital, con reducción fiscal.', icono: 'monedas' },
          { v: 'mixto', t: 'Una parte de cada forma', d: 'Eliges qué porcentaje cobras de una vez.', icono: 'balanza' }] }),
        s.epsvCobro === 'mixto' ? Deslizador({ id: 'jb-pctcap', etiqueta: 'Parte que cobras de una vez', valor: s.epsvPctCapital, min: 5, max: 95, paso: 5, unidad: '%', onChange: (v) => set('epsvPctCapital', v) }) : null),
      s.epsvCobro !== 'capital' ? h('div', { className: 'jb-block' },
        h('p', { className: 'jb-field__label' }, 'Tipo de renta'),
        Opciones({ nombre: 'Tipo de renta', valor: s.epsvRenta, onChange: (v) => set('epsvRenta', v), grande: true, opciones: [
          { v: 'flexible', t: 'Retiradas periódicas', d: 'Suben con el IPC. La rentabilidad tributa en la base del ahorro.' },
          { v: 'temporal', t: 'Renta de 15 años o más', d: 'Cuantía constante. La rentabilidad queda exenta.' },
          { v: 'vitalicia', t: 'Renta vitalicia', d: 'Cuantía constante. La rentabilidad queda exenta.' }] }),
        s.epsvRenta === 'temporal' ? Deslizador({ id: 'jb-aniosrenta', etiqueta: 'Duración del contrato', valor: s.epsvAniosRenta, min: 15, max: 40, paso: 1, unidad: 'años', onChange: (v) => set('epsvAniosRenta', v) }) : null) : null,
      s.epsvCobro !== 'renta' ? h('details', { className: 'jb-details' },
        h('summary', null, 'Condiciones del cobro de una vez', h('span', null, o.primerCobro && (o.dosAnios || ['invalidez', 'dependencia'].includes(o.contingencia)) ? 'Se aplica la reducción (60 % o 70 %)' : 'Sin reducción')),
        h('div', { className: 'jb-grid-2' },
          h('div', { className: 'jb-field' }, h('label', { className: 'jb-field__label', htmlFor: 'jb-contingencia' }, 'Motivo del cobro'),
            h('select', { id: 'jb-contingencia', className: 'jb-select', value: s.contingencia, onChange: (e) => set('contingencia', e.target.value) },
              [['jubilacion', 'Jubilación'], ['invalidez', 'Invalidez'], ['dependencia', 'Dependencia'], ['enfermedad', 'Enfermedad grave'], ['desempleo', 'Desempleo de larga duración'], ['otro', 'Otro rescate']].map(([v, t]) => h('option', { key: v, value: v }, t)))),
          h('div', { className: 'jb-field' }, h('label', { className: 'jb-field__label', htmlFor: 'jb-regimen' }, 'Régimen fiscal de lo aportado hasta 2025'),
            h('select', { id: 'jb-regimen', className: 'jb-select', value: s.regimen, onChange: (e) => set('regimen', e.target.value) },
              h('option', { value: 'auto' }, 'Automático: el de menor impuesto estimado'), h('option', { value: 'transitorio' }, 'Transitorio: integrar el 60 %'), h('option', { value: 'nuevo' }, 'Desde 2026: aportación al 70 % y rentabilidad aparte'))),
          Casilla({ id: 'jb-primer', marcado: s.primerCobro, onChange: (v) => set('primerCobro', v), titulo: 'Es el primer cobro en capital por este motivo', texto: 'La reducción solo se aplica una vez por contingencia.' }),
          Casilla({ id: 'jb-dos', marcado: s.dosAnios, onChange: (v) => set('dosAnios', v), titulo: 'Han pasado más de 2 años desde la primera aportación', texto: 'No se exige en invalidez o dependencia.' }))) : null,
      h('p', { className: 'jb-note' }, h('button', { type: 'button', className: 'jb-link', onClick: () => comp.setState({ s: casoDFB(s) }) }, 'Cargar el caso práctico de la DFB'), ' (100.000 € de derechos cobrados de una vez en 2026).'));
    return h('div', { className: 'jb-panel__body' },
      Opciones({ nombre: '¿Tienes una EPSV?', valor: s.tieneEpsv ? 'si' : 'no', onChange: (v) => set('tieneEpsv', v === 'si'), opciones: [{ v: 'no', t: 'No tengo EPSV' }, { v: 'si', t: 'Sí, tengo una EPSV' }] }),
      cuerpoEpsv);
  }

  function pasoSupuestos({ s, set }) {
    return h('div', { className: 'jb-panel__body' },
      h('div', { className: 'jb-grid-2' },
        Deslizador({ id: 'jb-rent', etiqueta: 'Rentabilidad anual de tus ahorros', valor: s.rentabilidad, min: 0, max: 7, paso: .5, unidad: '%', onChange: (v) => set('rentabilidad', v), marcas: ['0 %', '2 %', '4 %', '6 %'],
          ayuda: 'Lo que ganan de media cada año tus ahorros y tu EPSV, después de gastos. Es una hipótesis, no una garantía: el análisis muestra también ±1,5 puntos.' }),
        Deslizador({ id: 'jb-ipc', etiqueta: 'Inflación (IPC) anual', valor: s.inflacion, min: 0, max: 5, paso: .1, unidad: '%', onChange: (v) => set('inflacion', v), marcas: ['0 %', '2 %', '4 %'],
          ayuda: 'Tu pensión y tus retiradas suben con el IPC cada año. Los resultados «en euros de hoy» descuentan esta subida de precios.' })),
      h('div', { className: 'jb-grid-2' },
        Casilla({ id: 'jb-estres', marcado: s.estres, onChange: (v) => set('estres', v), titulo: 'Probar también un mal comienzo', texto: 'Caída del 12 % el primer año y del 5 % el segundo, con las mismas retiradas. Perder al principio de la jubilación daña más que perder después.' }),
        Campo({ id: 'jb-otrasded', etiqueta: 'Otras deducciones en la cuota (opcional)', valor: s.otrasDeducciones, unidad: '€/año', paso: 50, min: 0, onChange: (v) => set('otrasDeducciones', v), ayuda: 'Por ejemplo, por donativos. La deducción por edad y la minoración ya se aplican solas.' })));
  }

  /* ----------------------------------------------------------- En vivo ---- */
  function estadoDuracion(res) {
    const o = res.entrada, b = res.base;
    const hayAhorro = b.saldoInicial > 1;
    if (!hayAhorro) return { t: 'Sin ahorros que retirar', d: 'El resultado es solo tu pensión.' };
    if (o.estrategia === 'conservar') return { t: 'Tu capital se mantiene', d: 'Con tu hipótesis, a los ' + o.edadFin + ' conservarías su valor en euros de hoy.' };
    if (b.edadAgotado) return { t: 'Tus ahorros se agotan a los ' + b.edadAgotado, d: 'Antes de la edad que has elegido (' + o.edadFin + ').' };
    return { t: 'Tus ahorros duran hasta los ' + o.edadFin, d: 'Con tu hipótesis de rentabilidad (' + pct(o.rentabilidad) + ').' };
  }

  function barraComposicion(res, grande) {
    const y1 = res.anio1; if (!y1) return null;
    const p = G().repartoAnual(y1); const tot = p.pension + p.ahorros + p.epsv + p.irpf || 1;
    const segs = [['pension', 'Pensión neta'], ['ahorros', 'Ahorros netos'], ['epsv', 'EPSV neta'], ['irpf', 'IRPF']].filter(([k]) => p[k] > 0.5);
    const d = y1.deflactor;
    return h('div', { className: 'jb-compo' + (grande ? ' jb-compo--lg' : '') },
      h('div', { className: 'jb-compo__bar', role: 'img', 'aria-label': segs.map(([k, t]) => t + ' ' + f0(p[k] / 12 / d) + ' € al mes').join(', ') },
        segs.map(([k]) => h('span', { key: k, className: 'is-' + k, style: { width: (p[k] / tot * 100) + '%' } }))),
      h('ul', { className: 'jb-compo__legend' }, segs.map(([k, t]) => h('li', { key: k }, h('i', { className: 'is-' + k }), h('span', null, t), h('strong', null, (k === 'irpf' ? '−' : '') + f0(p[k] / 12 / d) + ' €')))));
  }

  function enVivo(ctx) {
    const { res } = ctx; const r = res.resumen; const d = r.deflactor1; const dur = estadoDuracion(res);
    const o = res.entrada;
    return h('div', { className: 'jb-live__card' },
      h('p', { className: 'jb-kicker' }, 'Tu resultado, al momento'),
      h('p', { className: 'jb-live__label' }, 'Ingreso neto al mes', h('span', null, o.aniosHastaJubilacion ? ' · al jubilarte, en euros de hoy' : ' · primer año')),
      h('p', { className: 'jb-live__num', 'aria-live': 'polite' }, f0(r.netoMensual / d), h('span', null, ' €/mes')),
      h('div', { className: 'jb-live__row' },
        h('span', null, 'Bruto ', h('strong', null, eur(r.brutoMensual / d))),
        h('span', null, 'IRPF ', h('strong', { className: 'is-neg' }, '−' + eur(r.impuestoMensual / d)), ' (' + pct(r.brutoMensual ? r.impuestoMensual / r.brutoMensual : 0) + ')')),
      barraComposicion(res),
      h('div', { className: 'jb-live__dur' },
        h('div', null, h('strong', null, dur.t), h('span', null, dur.d)),
        res.base.saldoInicial > 1 ? h('div', { className: 'jb-live__spark', dangerouslySetInnerHTML: { __html: G().minilinea(res.base) } }) : null),
      res.capital ? h('p', { className: 'jb-live__cap' }, 'Cobro de la EPSV de una vez: ', h('strong', null, eur(res.capital.neto)), ' netos, que se suman a tus ahorros.') : null,
      h('div', { className: 'jb-live__actions' },
        h('a', { className: 'nv-btn nv-btn--primary', href: '#resultados' }, 'Ver el análisis completo'),
        h('button', { type: 'button', className: 'nv-btn nv-btn--soft jb-print', onClick: () => imprimir(ctx) }, icono('impresora'), 'Imprimir informe')));
  }

  /* Barra fija inferior en tableta: el resultado sigue a la vista mientras se
     rellenan los pasos. En escritorio la sustituye el panel lateral. */
  function dock({ res }) {
    const r = res.resumen, d = r.deflactor1, dur = estadoDuracion(res);
    return h('div', { className: 'jb-dock', 'aria-hidden': 'true' },
      h('div', null, h('span', null, 'Neto al mes'), h('strong', null, eur(r.netoMensual / d))),
      h('div', null, h('span', null, 'IRPF al mes'), h('strong', { className: 'is-neg' }, '−' + eur(r.impuestoMensual / d))),
      h('div', { className: 'jb-dock__dur' }, h('span', null, 'Duración'), h('strong', null, dur.t)),
      h('a', { className: 'nv-btn nv-btn--primary', href: '#resultados', tabIndex: -1 }, 'Ver análisis'));
  }

  function imprimir(ctx) {
    if (global.NuviaJubilacionInforme) global.NuviaJubilacionInforme.imprimir(ctx.res, { vista: ctx.st.vista || 'hoy' });
  }

  /* -------------------------------------------------------- Resultados ---- */
  function resultados(ctx) {
    const { comp, st, res } = ctx; const vista = st.vista || 'hoy';
    const r = res.resumen, y1 = res.anio1; const d = vista === 'hoy' ? y1.deflactor : 1;
    const o = res.entrada;
    return h('section', { id: 'resultados', className: 'jb-results', 'aria-labelledby': 'jb-res-t' },
      h('header', { className: 'jb-results__head' },
        h('div', null, h('p', { className: 'jb-kicker' }, 'Tu análisis'), h('h2', { id: 'jb-res-t' }, 'Así sería tu jubilación'),
          h('p', null, o.aniosHastaJubilacion ? 'Te jubilas a los ' + o.edadJubilacion + ' (dentro de ' + o.aniosHastaJubilacion + ' años). ' : 'Primer año de jubilación, a los ' + o.edadJubilacion + '. ', 'El plan llega hasta los ' + o.edadFin + ' años.')),
        h('div', { className: 'jb-results__tools' },
          Opciones({ nombre: 'Unidades', valor: vista, onChange: (v) => comp.setState({ vista: v }), opciones: [{ v: 'hoy', t: 'Euros de hoy' }, { v: 'nominal', t: 'Euros de cada año' }] }),
          h('button', { type: 'button', className: 'nv-btn nv-btn--primary jb-print', onClick: () => imprimir(ctx) }, icono('impresora'), 'Imprimir informe'))),
      ecuacion(res, d),
      cascadaCard(ctx, vista),
      mapaFiscal(res, d),
      ingresosAnio(ctx, vista),
      duracion(ctx, vista),
      res.capital ? capitalEpsv(res) : null,
      metodo(res),
      tabla(res, vista),
      h('p', { className: 'jb-disclaimer' }, 'Estimación orientativa con las reglas del IRPF de Bizkaia de 2026, que se mantienen fijas en todos los años. El cálculo se hace en tu navegador y no envía tus datos. No es una liquidación tributaria ni asesoramiento financiero o fiscal personalizado.'));
  }

  function cascadaCard(ctx, vista) {
    const md = medida(ctx.comp, 'cascada', 1100);
    return h('article', { className: 'jb-card' },
      h('p', { className: 'jb-kicker' }, 'Primer año · al mes'),
      h('h3', null, 'De lo que cobras a lo que te queda'),
      h('p', { className: 'jb-card__lead' }, 'Cada barra suma o resta. La última es lo que tendrías para vivir cada mes.'),
      h('div', { className: 'jb-chart', ref: md.ref, dangerouslySetInnerHTML: { __html: G().cascada(ctx.res.anio1, { vista, ancho: md.ancho, alto: 280 }) } }));
  }

  function ecuacion(res, d) {
    const r = res.resumen;
    const tile = (cls, t, v, sub) => h('div', { className: 'jb-eq__tile ' + cls }, h('p', null, t), h('strong', null, v), sub ? h('span', null, sub) : null);
    return h('div', { className: 'jb-eq', role: 'group', 'aria-label': 'Pensión neta más retiradas netas igual a ingreso neto mensual' },
      tile('is-pension', 'Pensión neta', eur(r.pensionNetaMensual / d), 'al mes'),
      h('span', { className: 'jb-eq__op', 'aria-hidden': 'true' }, '+'),
      tile('is-ahorros', 'Retiradas netas de ahorros y EPSV', eur(r.restoNetoMensual / d), 'al mes'),
      h('span', { className: 'jb-eq__op', 'aria-hidden': 'true' }, '='),
      h('div', { className: 'jb-eq__tile is-total' }, h('p', null, 'Ingreso neto'), h('strong', { className: 'jb-eq__num' }, f0(r.netoMensual / d), h('small', null, ' €/mes')),
        h('span', null, 'Bruto ' + eur(r.brutoMensual / d) + ' · IRPF −' + eur(r.impuestoMensual / d))),
      h('p', { className: 'jb-eq__note' }, 'Media mensual: el total del año dividido entre 12 (la pensión se cobra en 14 pagas). Importes redondeados.'));
  }

  function mapaFiscal(res, d) {
    const f = res.anio1, t = f.irpf, m = (v) => eur(v / 12 / d);
    const fila = (k, v, nota, cls) => h('li', { className: cls || '' }, h('span', null, k, nota ? h('small', null, nota) : null), h('strong', null, v));
    const gen = [];
    gen.push(fila('Pensión pública', m(f.pension), 'Rendimiento del trabajo'));
    if (f.epsvTrabajo > 0.5) gen.push(fila('EPSV: parte de aportaciones', m(f.epsvTrabajo), 'Rendimiento del trabajo'));
    gen.push(fila('Bonificación del trabajo', '−' + m(t.bonificacion)));
    gen.push(fila('Impuesto según escala', m(t.cuotaGeneralBruta), null, 'is-sub'));
    gen.push(fila('Minoración de cuota', '−' + m(t.minoracion)));
    const aho = [];
    if (f.ganancia > 0.5) aho.push(fila('Ganancias de lo que vendes', m(f.ganancia), 'Solo la plusvalía de fondos, acciones y seguros'));
    if (f.interes > 0.5) aho.push(fila('Intereses de liquidez y depósitos', m(f.interes), 'Tributan cada año, los retires o no'));
    if (f.epsvRent - f.epsvRentExenta > 0.5) aho.push(fila('EPSV: rentabilidad', m(f.epsvRent - f.epsvRentExenta), 'Rendimiento del capital mobiliario'));
    if (!aho.length) aho.push(h('li', { key: 'x', className: 'is-empty' }, 'Este año no tienes rentas en esta base.'));
    const exento = [];
    if (f.principal > 0.5) exento.push(fila('Tu propio capital', m(f.principal), 'Lo que aportaste o ya tributó: retirarlo no paga IRPF'));
    if (f.epsvRentExenta > 0.5) exento.push(fila('EPSV: rentabilidad exenta', m(f.epsvRentExenta), 'Renta vitalicia o de 15 años o más'));
    if (!exento.length) exento.push(h('li', { key: 'x', className: 'is-empty' }, 'Nada este año.'));
    const col = (cls, titulo, escala, items, cuota, marginal) => h('div', { className: 'jb-tax__col ' + cls },
      h('p', { className: 'jb-tax__title' }, titulo, h('span', null, escala)),
      h('ul', null, items),
      cuota !== undefined ? h('p', { className: 'jb-tax__sum' }, h('span', null, 'Impuesto', marginal ? h('small', null, 'Tu tipo marginal: ' + pct(marginal, 1)) : null), h('strong', { className: 'is-neg' }, '−' + m(cuota))) : null);
    return h('article', { className: 'jb-card jb-tax' },
      h('p', { className: 'jb-kicker' }, 'Primer año · al mes'),
      h('h3', null, 'Qué impuesto se aplica a cada ingreso'),
      h('div', { className: 'jb-tax__grid' },
        col('is-gen', 'Base general', 'Escala del 23 % al 49 %', gen, t.cuotaGeneral, t.marginalGeneral),
        col('is-aho', 'Base del ahorro', 'Escala del 19 % al 28 %', aho, t.cuotaAhorro, t.marginalAhorro),
        col('is-exe', 'No tributa', 'Sin IRPF', exento)),
      h('div', { className: 'jb-tax__total' },
        t.deducciones > 0.5 ? h('span', null, 'Deducciones (edad y otras): ', h('strong', { className: 'is-pos' }, '+' + m(t.deducciones))) : h('span', null, t.deduccionEdad === 0 && res.entrada.edadJubilacion <= 65 ? 'La deducción por edad empieza a partir de los 66 años.' : 'Sin deducciones en la cuota este año.'),
        h('span', null, 'IRPF total: ', h('strong', { className: 'is-neg' }, '−' + m(t.total)), ' · ', pct(f.bruto ? f.impuesto / f.bruto : 0), ' de lo que cobras en bruto')));
  }

  function ingresosAnio(ctx, vista) {
    const { comp, st, res } = ctx; const filas = res.base.filas;
    const sel = Math.min(filas.length - 1, Math.max(0, st.sel == null ? 0 : st.sel));
    const f = filas[sel]; const d = vista === 'hoy' ? f.deflactor : 1; const m = (v) => eur(v / 12 / d);
    const p = G().repartoAnual(f);
    const md = medida(comp, 'ingresos', 880);
    const mover = (e) => { const i = e.target && e.target.getAttribute && e.target.getAttribute('data-i'); if (i !== null && i !== undefined && Number(i) !== st.sel) comp.setState({ sel: Number(i) }); };
    return h('article', { className: 'jb-card jb-yearly' },
      h('div', { className: 'jb-card__head' },
        h('div', null, h('p', { className: 'jb-kicker' }, 'Año a año'), h('h3', null, 'Tu ingreso de cada año, bruto y neto'),
          h('p', { className: 'jb-card__lead' }, 'La altura de cada barra es lo que cobras en bruto; la parte roja, el IRPF. Pasa el ratón por un año para ver el detalle.')),
        h('ul', { className: 'jb-legend' }, [['pension', 'Pensión neta'], ['ahorros', 'Ahorros netos'], ['epsv', 'EPSV neta'], ['irpf', 'IRPF']].map(([k, t]) => h('li', { key: k }, h('i', { className: 'is-' + k }), t)))),
      h('div', { className: 'jb-yearly__grid' },
        h('div', { className: 'jb-chart jb-chart--hover jb-chart--ingresos', ref: md.ref, onMouseMove: mover, onClick: mover, dangerouslySetInnerHTML: { __html: G().ingresos(filas, { vista, sel, edadAgotado: res.base.edadAgotado, ancho: md.ancho, alto: 320 }) } }),
        h('div', { className: 'jb-yearly__detail', 'aria-live': 'polite' },
          h('p', { className: 'jb-yearly__age' }, 'A los ', h('strong', null, f.edad + ' años')),
          h('ul', null,
            h('li', null, h('span', null, 'Pensión bruta'), h('strong', null, m(f.pension))),
            f.retiradaAhorros > 0.5 ? h('li', null, h('span', null, 'Retirada de ahorros'), h('strong', null, m(f.retiradaAhorros))) : null,
            f.retiradaEpsv > 0.5 ? h('li', null, h('span', null, 'Cobro de la EPSV'), h('strong', null, m(f.retiradaEpsv))) : null,
            h('li', { className: 'is-neg' }, h('span', null, 'IRPF'), h('strong', null, '−' + m(f.impuesto))),
            h('li', { className: 'is-total' }, h('span', null, 'Neto al mes'), h('strong', null, m(f.neto)))),
          h('p', { className: 'jb-yearly__saldo' }, 'Ahorros restantes al final del año: ', h('strong', null, eur(f.saldo / (vista === 'hoy' ? f.deflactor * (1 + res.entrada.inflacion) : 1)))),
          h('p', { className: 'jb-muted' }, vista === 'hoy' ? 'En euros de hoy.' : 'En euros de ese año.'))));
  }

  function duracion(ctx, vista) {
    const { res } = ctx; const o = res.entrada; const y1 = res.anio1;
    const md = medida(ctx.comp, 'saldos', 1100);
    const txt = (e) => {
      if (e.saldoInicial <= 1) return { t: 'Sin ahorros', d: '' };
      const finHoy = e.saldoFinal / (e.filas.at(-1).deflactor * (1 + o.inflacion));
      if (e.edadAgotado) return { t: 'Se agotan a los ' + e.edadAgotado, d: 'Cubre el ' + pct(e.cobertura, 0) + ' de las retiradas previstas.' };
      return { t: finHoy > 1000 ? 'Llegan a los ' + o.edadFin + ' y sobran ' + G().compacto(finHoy) : 'Llegan justo a los ' + o.edadFin, d: finHoy > 1000 ? 'En euros de hoy.' : 'Como estaba previsto.' };
    };
    const hip = (e) => e.clave === 'estres' ? '−12 % y −5 % los dos primeros años; luego ' + pct(o.rentabilidad) : pct(e.r) + ' al año';
    return h('article', { className: 'jb-card' },
      h('div', { className: 'jb-card__head' },
        h('div', null, h('p', { className: 'jb-kicker' }, 'Escenarios'), h('h3', null, '¿Cuánto te dura el dinero si la rentabilidad cambia?'),
          h('p', { className: 'jb-card__lead' }, 'Todas las líneas retiran lo mismo que tu plan. Solo cambia lo que rinden tus ahorros, así ves cuánto margen tienes.'))),
      h('div', { className: 'jb-chart jb-chart--saldos', ref: md.ref, dangerouslySetInnerHTML: { __html: G().saldos(res.escenarios, { vista, inflacion: o.inflacion, deflactor0: y1 ? y1.deflactor : 1, ancho: md.ancho, alto: 320 }) } }),
      h('div', { className: 'jb-scen' }, res.escenarios.map((e) => { const x = txt(e); return h('div', { key: e.clave, className: 'jb-scen__item is-' + e.clave },
        h('p', { className: 'jb-scen__name' }, h('i', { 'aria-hidden': 'true' }), e.nombre), h('p', { className: 'jb-scen__hyp' }, hip(e)),
        h('strong', null, x.t), x.d ? h('span', null, x.d) : null); })));
  }

  function capitalEpsv(res) {
    const c = res.capital; const max = Math.max(c.transitorio.bases.bruto, 1);
    const bloque = (k, titulo, sub) => { const x = c[k]; return h('div', { className: 'jb-cap__opt' + (c.elegido === k ? ' is-on' : '') },
      h('p', { className: 'jb-cap__title' }, titulo, c.elegido === k ? h('span', { className: 'jb-tag' }, c.automatico ? 'Aplicado: menor impuesto estimado' : 'Aplicado') : null),
      h('p', { className: 'jb-muted' }, sub),
      h('div', { className: 'jb-cap__bar', role: 'img', 'aria-label': 'Neto ' + eur(x.neto) + ', impuesto ' + eur(x.impuesto) },
        h('span', { className: 'is-neto', style: { width: (x.neto / max * 100) + '%' } }), h('span', { className: 'is-irpf', style: { width: (x.impuesto / max * 100) + '%' } })),
      h('ul', null,
        h('li', null, h('span', null, 'Cobro bruto'), h('strong', null, eur(x.bases.bruto))),
        h('li', null, h('span', null, 'Tributa en base general'), h('strong', null, eur(x.bases.general))),
        h('li', null, h('span', null, 'Tributa en base del ahorro'), h('strong', null, eur(x.bases.ahorro))),
        h('li', { className: 'is-neg' }, h('span', null, 'Impuesto estimado'), h('strong', null, '−' + eur(x.impuesto))),
        h('li', { className: 'is-total' }, h('span', null, 'Neto'), h('strong', null, eur(x.neto))))); };
    return h('article', { className: 'jb-card' },
      h('p', { className: 'jb-kicker' }, 'EPSV · cobro de una vez'),
      h('h3', null, 'Cuánto te quedaría del cobro en capital'),
      h('p', { className: 'jb-card__lead' }, 'El impuesto es el que añade este cobro a tu IRPF del primer año. Lo neto se suma a tus ahorros y se reparte en tu plan. ' + (c.transitorio.bases.conReduccion ? 'Se aplica la reducción por primer cobro (límite 300.000 €).' : 'No se aplica reducción: revisa las condiciones del cobro.')),
      h('div', { className: 'jb-cap' },
        bloque('transitorio', 'Régimen transitorio', 'Lo aportado hasta 2025 integra el 60 %; lo posterior, aportación al 70 % y rentabilidad aparte.'),
        bloque('nuevo', 'Régimen desde 2026', 'Aportaciones al 70 % en la base general; toda la rentabilidad en la base del ahorro.')),
      h('p', { className: 'jb-muted' }, 'La comparación es solo un cálculo; confirma con tu EPSV el régimen que te corresponde.'));
  }

  function metodo(res) {
    const P = res.parametros;
    const paso = (n, t, d) => h('li', null, h('span', { className: 'jb-method__num' }, n), h('div', null, h('strong', null, t), h('p', null, d)));
    const tramos = (esc) => esc.map(([desde, tipo], i) => h('tr', { key: i }, h('td', null, i + 1 < esc.length ? eur(desde) + ' – ' + eur(esc[i + 1][0]) : 'Más de ' + eur(desde)), h('td', null, pct(tipo, tipo * 100 % 1 ? 1 : 0))));
    return h('article', { className: 'jb-card jb-method', id: 'metodo' },
      h('p', { className: 'jb-kicker' }, 'Transparencia'),
      h('h3', null, 'Cómo lo calculamos'),
      h('ol', { className: 'jb-method__steps' },
        paso('1', 'Tu punto de partida', 'Tomamos tus saldos de hoy. Si aún no te has jubilado, crecen con la rentabilidad elegida y con tu ahorro anual hasta la jubilación.'),
        paso('2', 'Un plan de retiradas', 'Calculamos la retirada anual que, subiendo con el IPC, agota tus ahorros justo a la edad elegida. Si prefieres conservar el capital, solo se retira la rentabilidad por encima del IPC.'),
        paso('3', 'El IRPF de cada año', 'Cada ingreso va a su base: la pensión y las aportaciones de la EPSV a la general; ganancias, intereses y rentabilidad de la EPSV a la del ahorro; lo que aportaste no tributa. Se aplican la bonificación del trabajo, la minoración de 1.615 € y la deducción por edad.'),
        paso('4', 'En euros de hoy', 'Dividimos cada importe por la inflación acumulada para que puedas compararlo con lo que cuesta vivir hoy.')),
      h('div', { className: 'jb-method__cols' },
        h('div', null, h('p', { className: 'jb-field__label' }, 'Qué no tiene en cuenta'),
          h('ul', { className: 'jb-bullets' },
            h('li', null, 'Las escalas de 2026 se mantienen fijas: si no se actualizan con el IPC, pagarías algo más de lo que muestra.'),
            h('li', null, 'No compensa pérdidas ni calcula ventas por lotes: usa el coste medio.'),
            h('li', null, 'No incluye otros ingresos (alquileres, trabajo), ni el IRPF de los años antes de jubilarte.'),
            h('li', null, 'La renta vitalicia se reparte hasta la edad del plan; la aseguradora calcula la suya con sus propias tablas.'),
            h('li', null, 'Las rentabilidades son hipótesis: los mercados suben y bajan cada año.'))),
        h('details', { className: 'jb-details' },
          h('summary', null, 'Parámetros fiscales de Bizkaia 2026', h('span', null, 'Hacienda Foral de Bizkaia')),
          h('div', { className: 'jb-params' },
            h('table', null, h('caption', null, 'Escala de la base general'), h('tbody', null, tramos(P.escalaGeneral))),
            h('table', null, h('caption', null, 'Escala de la base del ahorro'), h('tbody', null, tramos(P.escalaAhorro)))),
          h('ul', { className: 'jb-bullets' },
            h('li', null, 'Minoración de cuota: 1.615 € sobre la cuota general.'),
            h('li', null, 'Bonificación del trabajo: 8.000 € hasta 14.800 € de rendimientos, bajando hasta 3.000 € a partir de 23.000 € (3.000 € si otras rentas superan 7.500 €).'),
            h('li', null, 'Deducción por edad: 393 € (más de 65 años) o 714 € (más de 75) con base de hasta 20.000 €, que se reduce hasta desaparecer a 30.000 €.'),
            h('li', null, 'EPSV en capital: 70 % en el primer cobro por contingencia (60 % en régimen transitorio para lo aportado hasta 2025), hasta 300.000 €.')))));
  }

  function tabla(res, vista) {
    const filas = res.base.filas;
    return h('details', { className: 'jb-details jb-table-wrap' },
      h('summary', null, 'Ver la tabla año a año', h('span', null, vista === 'hoy' ? 'Importes anuales en euros de hoy' : 'Importes anuales en euros de cada año')),
      h('div', { className: 'jb-table-scroll', role: 'region', tabIndex: 0, 'aria-label': 'Tabla año a año' },
        h('table', { className: 'jb-table' },
          h('thead', null, h('tr', null, ['Edad', 'Pensión bruta', 'Retirada ahorros', 'EPSV', 'Bruto', 'IRPF', 'Neto', 'Neto al mes', 'Ahorros restantes'].map((t) => h('th', { key: t, scope: 'col' }, t)))),
          h('tbody', null, filas.map((f) => { const d = vista === 'hoy' ? f.deflactor : 1; return h('tr', { key: f.anio },
            h('th', { scope: 'row' }, f.edad), h('td', null, eur(f.pension / d)), h('td', null, eur(f.retiradaAhorros / d)), h('td', null, eur(f.retiradaEpsv / d)), h('td', null, eur(f.bruto / d)),
            h('td', { className: 'is-neg' }, '−' + eur(f.impuesto / d)), h('td', null, eur(f.neto / d)), h('td', null, eur(f.neto / 12 / d)), h('td', null, eur(f.saldo / (vista === 'hoy' ? d * (1 + res.entrada.inflacion) : 1)))); })))));
  }

  /* Piezas compartidas con las guías de jubilación (js/nuvia-guias-jubilacion-ui.js). */
  const kit = { h: (...a) => h(...a), frag: (...a) => frag(...a), icono, Opciones, Casilla, f0, eur, pct };
  global.NuviaJubilacionUI = { render, estadoInicial, estadoVacio, casoDFB, entradaMotor, kit };
})(typeof globalThis !== 'undefined' ? globalThis : this);
