/** Resumen descriptivo. Los denominadores siempre incluyen la cartera completa. */
import { metricasDesdeSerie, DIAS_MERCADO } from './nuvia-cartera.js';
import { periodoAnalizado, fuenteDelAnalisis } from './nuvia-periodo-analisis.js';

const CLASES = {
  EQUITY: 'Renta variable', FIXED_INCOME: 'Renta fija', MONEY_MARKET: 'Monetario',
  REAL_ASSET: 'Activos reales', MIXED: 'Mixtos', ALTERNATIVE: 'Alternativos', OTHER: 'Otros',
};
const DIRECTOS = new Set(['STOCK', 'EQUITY', 'BOND', 'CASH']);
const FONDOS = new Set(['FUND', 'ETF']);
const numero = value => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(value);
const porcentaje = value => `${numero(value)} %`;
const finito = value => Number.isFinite(value) && value >= 0;

/** Porcentaje interno identificable: nunca normaliza una lista parcial a 100. */
export function coberturaDesglose(doc) {
  if (!Array.isArray(doc?.holdings) || !doc.holdings.length) return null;
  let suma = 0;
  let utiles = 0;
  const vistas = new Set();
  for (const h of doc.holdings) {
    if (!h || typeof h !== 'object') continue;
    const nombre = h.name ?? h.holding_name ?? h.raw_source?.name;
    const identidad = h.isin ?? h.identifiers?.isin ?? h.ticker ?? h.identifiers?.ticker ?? nombre;
    const peso = Number.isFinite(h.weight_pct) ? h.weight_pct
      : h.holding_weight_unit === 'percent' ? h.holding_weight : null;
    if (typeof identidad !== 'string' || !identidad.trim() || !finito(peso)) continue;
    const clave = `${identidad.trim()}|${peso}`;
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    suma += peso;
    utiles++;
  }
  // Un total incompatible no acredita una cobertura completa.
  if (!utiles || suma > 100.1) return null;
  const declarada = doc.cobertura_pct ?? doc.top10_weight;
  if (declarada != null && (!finito(declarada) || declarada > 100)) return null;
  return Math.min(100, suma, declarada ?? 100);
}

export function calculaResumenCartera({ posiciones = [], fichas = {}, desgloses = null,
  historial = null, estadoHistorial = 'cargando', estadoDesglose = 'cargando' } = {}) {
  const porId = new Map();
  for (const p of posiciones) {
    if (!p?.activo?.asset_id || !Number.isFinite(p.bruto) || p.bruto <= 0) continue;
    const id = p.activo.asset_id;
    const anterior = porId.get(id);
    porId.set(id, { activo: p.activo, bruto: p.bruto + (anterior?.bruto || 0) });
  }
  const total = [...porId.values()].reduce((s, p) => s + p.bruto, 0);
  if (!total || !Number.isFinite(total)) return null;
  const entradas = [...porId.values()].map(p => {
    const ficha = fichas[p.activo.asset_id];
    return { ...p.activo, ...ficha, peso: p.bruto / total,
      nombre: ficha?.identity?.display_name || p.activo.display_name || p.activo.asset_id };
  });
  const mayor = entradas.reduce((a, b) => b.peso > a.peso ? b : a);
  const clases = [...new Set(entradas.map(p => p.economic_asset_class).filter(c => Object.hasOwn(CLASES, c)))];
  const pesoClasificado = entradas.reduce((s, p) => s + (Object.hasOwn(CLASES, p.economic_asset_class) ? p.peso : 0), 0);
  const periodo = periodoAnalizado(historial?.dates);
  const seriesValidas = new Map((historial?.series || []).filter(s =>
    periodo && periodo.cierres >= 3 && Array.isArray(s.values) && s.values.length === periodo.cierres
    && s.values.every(v => Number.isFinite(v) && v > 0)).map(s => [s.asset_id, s]));
  const coberturaHistorial = estadoHistorial === 'listo'
    ? entradas.reduce((s, p) => s + (seriesValidas.has(p.asset_id) ? p.peso * 100 : 0), 0) : null;
  const completo = entradas.every(p => seriesValidas.has(p.asset_id));
  let volatilidad = null;
  if (estadoHistorial === 'listo' && completo) {
    // Mismo modelo que serieCartera: pesos iniciales, series base 100, sin rebalanceo.
    const niveles = historial.dates.map((_, t) => entradas.reduce((s, p) => s + p.peso * seriesValidas.get(p.asset_id).values[t] / 100, 0));
    const m = metricasDesdeSerie(niveles, { periodosPorAno: DIAS_MERCADO });
    if (finito(m?.volatilidad)) volatilidad = m.volatilidad * 100;
  }
  let identificado = 0;
  const fechasDesglose = new Set();
  const pendientes = [];
  for (const p of entradas) {
    if (DIRECTOS.has(p.instrument_type)) identificado += p.peso * 100;
    else if (FONDOS.has(p.instrument_type)) {
      const doc = desgloses?.[p.asset_id];
      const cobertura = coberturaDesglose(doc);
      if (cobertura != null) {
        identificado += p.peso * cobertura;
        if (/^\d{4}-\d{2}-\d{2}$/.test(doc.as_of_date || '')) fechasDesglose.add(doc.as_of_date);
      }
      if (cobertura == null || cobertura < 100) pendientes.push(p.nombre);
    } else pendientes.push(p.nombre);
  }
  const todosDirectos = entradas.every(p => DIRECTOS.has(p.instrument_type));
  const coberturaInterna = todosDirectos || estadoDesglose === 'listo' ? Math.min(100, identificado) : null;
  const eje = (id, nombre, corto, valor, maximo, unidad) => ({ id, nombre, corto, valor, maximo, unidad });
  return {
    posiciones: entradas.length, mayor, clases: clases.map(c => CLASES[c]),
    sinClasificar: Math.max(0, 100 - pesoClasificado * 100), periodo,
    observaciones: periodo ? periodo.cierres - 1 : null,
    fechasDesglose: [...fechasDesglose].sort(), pendientes,
    estadoHistorial, estadoDesglose,
    ejes: [
      eje('concentracion', 'Concentración', 'Mayor posición', mayor.peso * 100, 100, '%'),
      eje('clases', 'Clases de activo', 'Clases', clases.length || null, Math.max(5, clases.length), 'clases'),
      eje('volatilidad', 'Volatilidad histórica', 'Volatilidad', volatilidad, Math.max(25, Math.ceil((volatilidad || 0) / 5) * 5), '% anualizado'),
      eje('historial', 'Cobertura de historial', 'Historial', coberturaHistorial == null ? null : Math.min(100, coberturaHistorial), 100, '% del peso'),
      eje('desglose', 'Desglose de posiciones internas', 'Desglose', coberturaInterna, 100, '% del peso'),
    ],
  };
}

/** Los huecos interrumpen el contorno; no se rellenan ni se conectan por el centro. */
export function geometriaPentagono(ejes, ancho = 400) {
  const radio = Math.min(120, ancho * .29), cx = ancho / 2, cy = 190;
  const punto = (i, r) => {
    const angulo = -Math.PI / 2 + i * 2 * Math.PI / 5;
    return [cx + Math.cos(angulo) * radio * r, cy + Math.sin(angulo) * radio * r];
  };
  const puntos = ejes.map((e, i) => e.valor == null ? null : punto(i, e.valor / e.maximo));
  return { cx, cy, punto, puntos, completo: puntos.every(Boolean),
    segmentos: puntos.flatMap((p, i) => p && puntos[(i + 1) % 5] ? [[p, puntos[(i + 1) % 5]]] : []) };
}

function el(tag, clase, texto) {
  const node = document.createElement(tag);
  if (clase) node.setAttribute('class', clase);
  if (texto != null) node.textContent = texto;
  return node;
}
const cifra = eje => eje.valor == null ? 'Sin dato' : eje.id === 'clases' ? numero(eje.valor) : porcentaje(eje.valor);
function lectura(resumen, indice) {
  const [c, k, v, h, d] = resumen.ejes;
  const estado = valor => valor === 'cargando' ? 'Consultando datos…' : valor === 'error' ? 'Consulta no disponible' : 'Sin dato suficiente';
  return [
    { detalle: `Mayor posición · ${resumen.mayor.nombre}`, titulo: `${porcentaje(c.valor)} en ${resumen.mayor.nombre}`,
      texto: 'Es la posición con más peso dentro de toda la cartera. Describe la concentración en un vehículo; su desglose interno permite conocer lo que contiene.',
      formula: 'Peso introducido / suma de todos los pesos positivos × 100.' },
    { detalle: `${resumen.clases.join(' · ') || 'Sin clasificación disponible'}${resumen.sinClasificar > .001 ? ` · ${porcentaje(resumen.sinClasificar)} sin clasificar` : ''}`,
      titulo: k.valor == null ? 'No hay clases conocidas' : `${numero(k.valor)} ${k.valor === 1 ? 'clase conocida' : 'clases conocidas'} en ${resumen.posiciones} ${resumen.posiciones === 1 ? 'posición' : 'posiciones'}`,
      texto: 'Se cuentan las clases económicas declaradas con peso positivo. El número de clases no mide el solapamiento entre fondos ni cómo se mueven juntos.',
      formula: 'Clases distintas declaradas en la base NUVIA. Las posiciones sin clase se identifican aparte.' },
    { detalle: v.valor == null ? (h.valor != null && h.valor < 99.999 ? 'Historial parcial · el eje de la cartera completa queda abierto' : estado(resumen.estadoHistorial))
      : `${resumen.observaciones} rentabilidades diarias · anualizada`,
      titulo: v.valor == null ? 'Volatilidad de la cartera completa sin dato' : `Oscilación histórica anualizada: ${cifra(v)}`,
      texto: v.valor == null ? 'No hay historial común suficiente para todas las posiciones con peso. Más abajo se conserva el análisis disponible del subconjunto, con sus exclusiones. Aquí no se inventa un valor.'
        : 'Mide la variabilidad de los rendimientos de la combinación histórica, con los pesos al inicio y sin rebalanceo. No es una pérdida esperada ni un límite de pérdidas futuras.',
      formula: 'Desviación típica muestral de las rentabilidades diarias × √252. Misma serie y método que el análisis histórico de Alfa.' },
    { detalle: h.valor == null ? estado(resumen.estadoHistorial) : `${cifra(h)} del peso original tiene serie utilizable en el periodo común`,
      titulo: h.valor == null ? 'Cobertura de historial pendiente' : `Historial utilizable para el ${cifra(h)} del peso`,
      texto: 'Las posiciones sin serie permanecen en el denominador. La ventana solicitada es de tres años; las fechas reales utilizadas figuran al pie. Esta cobertura no acredita continuidad diaria ni actualidad del último cierre.',
      formula: 'Suma de los pesos originales con series alineadas válidas / suma de todos los pesos positivos × 100.' },
    { detalle: d.valor == null ? estado(resumen.estadoDesglose) : `${cifra(d)} del peso total identificado · ${porcentaje(Math.max(0, 100 - d.valor))} sin desglose acreditado`,
      titulo: d.valor == null ? 'Desglose pendiente de consulta' : `Identificado por dentro: ${cifra(d)}`,
      texto: 'En fondos y ETF se suma solo el peso interno identificable, sin convertir listas parciales en carteras completas. Las acciones y bonos directos identificados cuentan por su propio peso. Tener una ficha no acredita un desglose.',
      formula: `Suma de peso del vehículo × proporción interna identificada.${resumen.fechasDesglose.length ? ` Fechas de desgloses: ${resumen.fechasDesglose.join(', ')}.` : ' Fecha de desgloses no disponible.'}` },
  ][indice];
}

/** Un montaje estable: conserva selección, foco y observador durante recálculos. */
export function montaResumenCartera(raiz) {
  let resumen = null, seleccionado = 0;
  raiz.setAttribute('class', 'nv-resumen-cartera');
  raiz.hidden = true;
  const cabecera = el('header', 'nv-resumen-cartera__cabecera');
  const titulo = el('h2', '', 'Tu cartera, de un vistazo');
  const subtitulo = el('p', 'nv-resumen-cartera__subtitulo');
  const introduccion = el('div'); introduccion.append(titulo, subtitulo); cabecera.append(introduccion);
  const grid = el('div', 'nv-resumen-cartera__grid');
  const mapa = el('section', 'nv-resumen-cartera__mapa');
  mapa.setAttribute('aria-label', 'Pentágono descriptivo de la cartera');
  mapa.append(el('h3', '', 'Mapa de la cartera'));
  const dibujo = el('div', 'nv-resumen-cartera__dibujo');
  const nota = el('p', 'nv-resumen-cartera__nota');
  mapa.append(dibujo, nota);
  const lecturas = el('div', 'nv-resumen-cartera__lecturas');
  lecturas.setAttribute('role', 'group'); lecturas.setAttribute('aria-label', 'Selecciona una lectura para entenderla');
  const botones = Array.from({ length: 5 }, (_, i) => {
    const boton = el('button', 'nv-resumen-cartera__lectura'); boton.type = 'button';
    const linea = el('span', 'nv-resumen-cartera__linea');
    const nombre = el('span', 'nv-resumen-cartera__nombre'); const valor = el('span', 'nv-resumen-cartera__valor');
    linea.append(nombre, valor);
    const barra = el('span', 'nv-resumen-cartera__barra'); const relleno = el('span'); barra.append(relleno); barra.setAttribute('aria-hidden', 'true');
    const detalle = el('span', 'nv-resumen-cartera__detalle');
    boton.append(linea, barra, detalle);
    boton.addEventListener('click', () => { seleccionado = i; actualizaLecturas(); dibuja(); });
    lecturas.append(boton); return { boton, nombre, valor, relleno, detalle };
  });
  grid.append(mapa, lecturas);
  const explicacion = el('section', 'nv-resumen-cartera__explicacion');
  explicacion.setAttribute('aria-live', 'polite'); explicacion.setAttribute('aria-atomic', 'true');
  const encabezado = el('div'); encabezado.append(el('p', 'nv-resumen-cartera__etiqueta', 'Entender esta lectura'));
  const tituloLectura = el('h3'); encabezado.append(tituloLectura);
  const cuerpo = el('div'); const texto = el('p'); const formula = el('p', 'nv-resumen-cartera__formula'); cuerpo.append(texto, formula);
  explicacion.append(encabezado, cuerpo);
  const metodo = el('details', 'nv-resumen-cartera__metodo');
  metodo.append(el('summary', '', 'Cómo leer el pentágono y sus escalas'));
  const escalas = el('dl', 'nv-resumen-cartera__escalas');
  metodo.append(escalas, el('p', '', 'Cada color identifica una misma lectura en el gráfico y en las barras. El centro representa cero y el borde, el extremo indicado de cada escala. Las barras utilizan las mismas escalas. Son referencias gráficas; no definen límites de inversión. Los ejes miden cosas diferentes: el área no es una calificación global.'));
  const fuente = el('p', 'nv-resumen-cartera__fuente');
  raiz.append(cabecera, grid, explicacion, metodo, fuente);

  function actualizaLecturas() {
    if (!resumen) return;
    botones.forEach((b, i) => {
      const eje = resumen.ejes[i];
      b.boton.setAttribute('data-eje', eje.id);
      b.boton.setAttribute('data-disponible', String(eje.valor != null));
      b.boton.setAttribute('aria-pressed', String(i === seleccionado));
      b.nombre.textContent = eje.nombre; b.valor.textContent = cifra(eje);
      b.relleno.style.width = eje.valor == null ? '0%' : `${eje.valor / eje.maximo * 100}%`;
      b.detalle.textContent = lectura(resumen, i).detalle;
    });
    const actual = lectura(resumen, seleccionado);
    explicacion.setAttribute('data-eje', resumen.ejes[seleccionado].id);
    explicacion.setAttribute('data-disponible', String(resumen.ejes[seleccionado].valor != null));
    tituloLectura.textContent = actual.titulo; texto.textContent = actual.texto; formula.textContent = actual.formula;
  }
  function dibuja() {
    if (!resumen || raiz.hidden) return;
    const ancho = Math.round(dibujo.getBoundingClientRect?.().width || 0);
    if (!ancho) return; // La pestaña puede estar oculta; ResizeObserver la dibuja al abrir.
    const g = geometriaPentagono(resumen.ejes, ancho);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${ancho} 365`); svg.setAttribute('height', '365'); svg.setAttribute('width', '100%');
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', resumen.ejes.map(e => `${e.nombre}: ${cifra(e)}; escala 0–${e.maximo} ${e.unidad}`).join('. '));
    const marca = (tag, attrs, texto) => {
      const node = document.createElementNS(svg.namespaceURI, tag);
      for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
      if (texto != null) node.textContent = texto;
      svg.append(node); return node;
    };
    for (let paso = 1; paso <= 5; paso++) marca('polygon', { class: 'nv-resumen-cartera__rejilla', points: resumen.ejes.map((_, i) => g.punto(i, paso / 5).join(',')).join(' ') });
    resumen.ejes.forEach((_, i) => { const p = g.punto(i, 1); marca('line', { class: 'nv-resumen-cartera__rejilla', x1: g.cx, y1: g.cy, x2: p[0], y2: p[1] }); });
    if (g.completo) marca('polygon', { class: 'nv-resumen-cartera__area', points: g.puntos.map(p => p.join(',')).join(' ') });
    g.segmentos.forEach(([a, b]) => marca('path', { class: 'nv-resumen-cartera__contorno', d: `M${a.join(',')} L${b.join(',')}` }));
    g.puntos.forEach((p, i) => { if (p) marca('circle', { class: `nv-resumen-cartera__punto${i === seleccionado ? ' nv-resumen-cartera__punto--activo' : ''}`, 'data-eje': resumen.ejes[i].id, cx: p[0], cy: p[1], r: i === seleccionado ? 5 : 4 }); });
    const etiquetas = [[g.cx, 24, 'middle'], [ancho - 8, 106, 'end'], [ancho - 8, 320, 'end'], [8, 320, 'start'], [8, 106, 'start']];
    resumen.ejes.forEach((e, i) => {
      const [x, y, anchor] = etiquetas[i];
      marca('text', { x, y, 'text-anchor': anchor, class: 'nv-resumen-cartera__rotulo' }, e.corto);
      marca('text', { x, y: y + 29, 'text-anchor': anchor, class: 'nv-resumen-cartera__cifra', 'data-eje': e.id, 'data-disponible': String(e.valor != null) }, cifra(e));
    });
    dibujo.textContent = ''; dibujo.append(svg);
  }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(dibuja) : null;
  observer?.observe(dibujo);
  return {
    actualiza(entrada) {
      resumen = calculaResumenCartera(entrada); raiz.hidden = !resumen;
      if (!resumen) return;
      subtitulo.textContent = `${resumen.posiciones} ${resumen.posiciones === 1 ? 'posición' : 'posiciones'} con peso · Ventana solicitada: 3 años`;
      nota.textContent = resumen.ejes.every(e => e.valor != null)
        ? 'Cada eje tiene su escala. El área describe magnitudes, no una nota de salud.'
        : 'Cada eje tiene su escala. Los datos ausentes dejan el contorno abierto; no reciben una puntuación.';
      escalas.textContent = '';
      escalas.append(...resumen.ejes.map(e => {
        const grupo = el('div'); grupo.append(el('dt', '', e.corto), el('dd', '', `0–${numero(e.maximo)} ${e.unidad}`)); return grupo;
      }));
      fuente.textContent = fuenteDelAnalisis(entrada.historial?.dates, resumen.observaciones);
      actualizaLecturas(); dibuja();
    },
    destruye() { observer?.disconnect(); raiz.textContent = ''; },
  };
}
