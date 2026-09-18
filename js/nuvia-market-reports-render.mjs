// Render compartido por el portal y el documento descargable. Solo texto escapado.
export const escapar = (valor = '') => String(valor).replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export const fechaLegible = (fecha) => new Intl.DateTimeFormat('es-ES', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid',
}).format(new Date(`${fecha}T12:00:00Z`));
export const etiqueta = (tipo) => tipo === 'SEMANAL' ? 'Semanal' : 'Diario';
export const periodoLegible = (informe) => informe.periodo
  ? (informe.periodo.desde === informe.periodo.hasta ? fechaLegible(informe.periodo.hasta)
    : `${fechaLegible(informe.periodo.desde)} – ${fechaLegible(informe.periodo.hasta)}`)
  : fechaLegible(informe.fecha);
const destino = (informe) => `mercados.html?vista=informes&tipo=${informe.tipo.toLowerCase()}#lectura-informe`;
const descarga = (informe) => `core/downloads/informes/${informe.id}.html`;
const minutosLectura = (informe) => Math.max(1, Math.ceil([
  informe.entradilla, ...(informe.claves ?? []).map((c) => `${c.titulo} ${c.texto}`),
  ...informe.hechos.map((h) => h.texto),
  ...informe.cuerpo.flatMap((s) => [s.titulo, ...s.parrafos]),
  ...(informe.mercados ?? []).flatMap((g) => g.filas.map((f) => f.nota || '')),
  ...informe.agenda.map((a) => `${a.que} ${a.porQueImporta || ''}`),
  ...(informe.glosario ?? []).map((g) => `${g.termino} ${g.definicion}`),
  informe.limitaciones || '',
].join(' ').split(/\s+/).length / 220));
const numero = (i) => String(i + 1).padStart(2, '0');

/* --- v2: cifras de la tabla de mercados ---------------------------------- */

const ETIQUETA_PERIODO = { DIARIO: 'Var. día', SEMANAL: 'Var. semana' };
const formatoNumero = (digitos) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: digitos, maximumFractionDigits: digitos });

/** Variación con signo explícito y menos tipográfico: «+1,4 %», «−0,3 %»; raya si no hay dato. */
export function variacionLegible(valor, digitos = 1) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) return '—';
  const texto = `${formatoNumero(digitos).format(Math.abs(valor))} %`;
  return valor > 0 ? `+${texto}` : valor < 0 ? `−${texto}` : texto;
}
const claseSigno = (valor) => (typeof valor !== 'number' || !Number.isFinite(valor) || valor === 0 ? '' : valor > 0 ? ' nv-report__delta--up' : ' nv-report__delta--down');
const esDeuda = (grupo) => /deuda|bono|tipos/i.test(grupo);

/**
 * Cuatro referencias de la semana, en fichas con una barra de signo cada una
 * (SVG estático: el descargable no admite scripts). Se eligen por nombre entre
 * las filas del contrato; si una no viene, la ficha no se pinta. La barra
 * dibuja la variación publicada sobre su propia escala; no la calcula.
 */
const REFERENCIAS_SEMANA = [
  { clave: 'bono-eeuu', patron: /bono.*(ee\.? ?uu|estados unidos|estadounidense|american|treasury|tesoro)|treasury/i, titulo: 'Bono de EE. UU. a 10 años', lectura: 'Lo que paga Estados Unidos por pedir prestado a diez años.' },
  { clave: 'bono-aleman', patron: /bono.*(alem|bund)|\bbund\b/i, titulo: 'Bono alemán a 10 años', lectura: 'La referencia de la deuda europea: lo que paga Alemania a diez años.' },
  { clave: 'eur-usd', patron: /eur\s*\/\s*usd|euro.*d[oó]lar|d[oó]lar.*euro/i, titulo: 'Euro frente al dólar', lectura: 'Cuántos dólares vale un euro.' },
  { clave: 'petroleo', patron: /brent|petr[oó]leo|crudo|\bwti\b/i, titulo: 'Petróleo Brent', lectura: 'El precio del barril de referencia en Europa.' },
];
const filasMercado = (mercados) => mercados.flatMap((grupo) => grupo.filas.map((fila) => ({ ...fila, grupo: grupo.grupo })));

function barraSigno(valor, unidad) {
  const extremo = Math.max(0.1, Math.abs(valor));
  const pasos = [0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100];
  const tope = pasos.find((paso) => paso >= extremo * 1.15) ?? Math.ceil(extremo * 1.15);
  const cero = 200;
  const medio = 160;
  const ancho = Math.max(3, (Math.abs(valor) / tope) * medio);
  const x = valor < 0 ? cero - ancho : cero;
  const clase = valor < 0 ? 'nv-report__bar--down' : 'nv-report__bar--up';
  const legible = (v) => variacionLegible(v, tope < 1 ? 2 : 1).replace(' %', unidad);
  return `<svg viewBox="0 0 400 64" role="img" aria-label="${escapar(`Variación de la semana: ${legible(valor)}`)}" preserveAspectRatio="xMidYMid meet">` +
    `<line class="nv-report__bar-grid" x1="${cero - medio}" y1="4" x2="${cero - medio}" y2="42"></line><line class="nv-report__bar-grid" x1="${cero + medio}" y1="4" x2="${cero + medio}" y2="42"></line>` +
    `<line class="nv-report__bar-axis" x1="${cero}" y1="2" x2="${cero}" y2="44"></line>` +
    `<rect class="${clase}" x="${x.toFixed(1)}" y="11" width="${ancho.toFixed(1)}" height="24" rx="5"></rect>` +
    `<text class="nv-report__bar-tick" x="${cero - medio}" y="60" text-anchor="start">${escapar(legible(-tope))}</text><text class="nv-report__bar-tick" x="${cero}" y="60" text-anchor="middle">0</text><text class="nv-report__bar-tick" x="${cero + medio}" y="60" text-anchor="end">${escapar(legible(tope))}</text></svg>`;
}

/**
 * Curva de tipos en SVG estático: la línea de la última fecha y, en gris
 * discontinuo, la de la semana anterior. Eje de plazos a espacios iguales
 * (de 3 meses a 30 años) y eje de rentabilidad ajustado a los datos, con
 * la cifra en los plazos que más se miran. Transcribe; no interpreta.
 */
function graficoCurva(curva) {
  const puntos = curva.puntos;
  const ancho = 460;
  const alto = 200;
  const izq = 44;
  const der = 14;
  const arriba = 16;
  const abajo = 30;
  const valores = puntos.flatMap((p) => [p.actual, p.anterior]).filter((v) => typeof v === 'number');
  const min = Math.floor((Math.min(...valores) - 0.15) * 4) / 4;
  const max = Math.ceil((Math.max(...valores) + 0.15) * 4) / 4;
  const x = (i) => izq + (i * (ancho - izq - der)) / (puntos.length - 1);
  const y = (v) => arriba + ((max - v) * (alto - arriba - abajo)) / (max - min);
  const camino = (campo) => puntos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[campo]).toFixed(1)}`).join(' ');
  const pasoY = max - min > 2 ? 0.5 : 0.25;
  const rejilla = [];
  for (let v = min; v <= max + 1e-9; v += pasoY) {
    rejilla.push(`<line class="nv-report__curve-grid" x1="${izq}" y1="${y(v).toFixed(1)}" x2="${ancho - der}" y2="${y(v).toFixed(1)}"></line><text class="nv-report__bar-tick" x="${izq - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${escapar(formatoNumero(2).format(v))}</text>`);
  }
  const conAnterior = puntos.every((p) => typeof p.anterior === 'number');
  const destacados = new Set(['2 a', '10 a', '30 a']);
  const marcas = puntos.map((p, i) => `<circle class="nv-report__curve-dot" cx="${x(i).toFixed(1)}" cy="${y(p.actual).toFixed(1)}" r="3.5"></circle>` +
    (destacados.has(p.plazo) ? `<text class="nv-report__curve-value" x="${x(i).toFixed(1)}" y="${(y(p.actual) - 9).toFixed(1)}" text-anchor="middle">${escapar(formatoNumero(2).format(p.actual))}</text>` : '') +
    `<text class="nv-report__bar-tick" x="${x(i).toFixed(1)}" y="${alto - 10}" text-anchor="middle">${escapar(p.plazo)}</text>`).join('');
  const lectura = puntos.map((p) => `${p.plazo}: ${formatoNumero(2).format(p.actual)} %`).join(', ');
  return `<svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${escapar(`${curva.nombre}, rentabilidad por plazo el ${fechaLegible(curva.fecha)}: ${lectura}`)}" preserveAspectRatio="xMidYMid meet">${rejilla.join('')}` +
    (conAnterior ? `<path class="nv-report__curve-prev" d="${camino('anterior')}"></path>` : '') +
    `<path class="nv-report__curve-now" d="${camino('actual')}"></path>${marcas}</svg>`;
}

const LECTURA_CURVA = {
  eurozona: 'Lo que paga la deuda pública europea más solvente según el plazo al que se presta.',
  eeuu: 'Lo que paga Estados Unidos según el plazo al que se presta.',
};

function fichasCurvas(informe) {
  const curvas = ['eurozona', 'eeuu'].map((clave) => informe.curvas?.curvas.find((c) => c.clave === clave)).filter(Boolean);
  return curvas.map((curva) => {
    const diez = curva.puntos.find((p) => p.plazo === '10 a');
    const dos = curva.puntos.find((p) => p.plazo === '2 a');
    const cambio = diez && typeof diez.anterior === 'number' ? diez.actual - diez.anterior : null;
    return `<article class="nv-report__tile nv-report__tile--curva nv-report__tile--${curva.clave}">
      <p class="nv-report__tile-name">Curva de tipos · ${escapar(curva.nombre)}<span>${escapar(LECTURA_CURVA[curva.clave] ?? '')}</span></p>
      <p class="nv-report__tile-delta"><span class="nv-report__tile-level">${diez ? `${escapar(formatoNumero(2).format(diez.actual))} %` : '—'}</span><span>a 10 años</span>${cambio !== null ? `<span class="nv-report__delta${claseSigno(Number(cambio.toFixed(3)))}">${escapar(variacionLegible(cambio, 2).replace(' %', ' puntos'))}</span><span>en la semana</span>` : ''}</p>
      <div class="nv-report__tile-chart nv-report__tile-chart--curva">${graficoCurva(curva)}</div>
      <p class="nv-report__curve-legend"><span class="nv-report__curve-legend-now">${escapar(fechaLegible(curva.fecha))}</span>${curva.fechaAnterior ? `<span class="nv-report__curve-legend-prev">${escapar(fechaLegible(curva.fechaAnterior))}</span>` : ''}${dos && diez ? `<span>De 2 a 10 años: ${escapar(variacionLegible(diez.actual - dos.actual, 2).replace(' %', ' puntos'))}</span>` : ''}</p>
      <p class="nv-report__tile-source">Fuente <a class="nv-report__citation" href="${escapar(curva.fuente.url)}" target="_blank" rel="noreferrer noopener">${escapar(curva.fuente.titulo)}</a></p>
    </article>`;
  }).join('');
}

function fichasSemana(informe, periodo) {
  const filas = filasMercado(informe.mercados ?? []);
  const curvas = fichasCurvas(informe);
  // Con curvas, los dos bonos a 10 años ya están dentro de ellas: la fila de
  // arriba son las curvas y la de abajo, divisa y petróleo.
  const referencias = curvas ? REFERENCIAS_SEMANA.filter((r) => !r.clave.startsWith('bono')) : REFERENCIAS_SEMANA;
  const fichas = referencias.map((ref) => ({ ref, fila: filas.find((f) => ref.patron.test(f.nombre)) })).filter((x) => x.fila);
  if (!fichas.length && !curvas) return '';
  return `<div class="nv-report__tiles">${curvas}${fichas.map(({ ref, fila }) => {
    const deuda = esDeuda(fila.grupo);
    const unidad = deuda ? ' puntos' : ' %';
    const conCifra = typeof fila.variacion === 'number' && Number.isFinite(fila.variacion);
    const sinContrastar = !fila.nivel || /sin contrastar/i.test(fila.nivel);
    const delta = conCifra ? `<span class="nv-report__delta${claseSigno(fila.variacion)}">${escapar(variacionLegible(fila.variacion, 2).replace(' %', unidad))}</span>` : '<span class="nv-report__delta">—</span>';
    return `<article class="nv-report__tile nv-report__tile--${ref.clave}${sinContrastar ? ' nv-report__tile--uncited' : ''}">
      <p class="nv-report__tile-name">${escapar(ref.titulo)}<span>${escapar(ref.lectura)}</span></p>
      <p class="nv-report__tile-level${sinContrastar ? ' nv-report__tile-level--uncited' : ''}">${escapar(fila.nivel ?? 'Sin contrastar')}</p>
      <p class="nv-report__tile-delta">${delta}<span>${escapar(periodo)}${deuda ? ' · en puntos de rentabilidad' : ''}</span></p>
      ${conCifra ? `<div class="nv-report__tile-chart">${barraSigno(fila.variacion, unidad)}</div>` : '<p class="nv-report__tile-empty">La documentación no acredita esta cifra con una publicación de primera mano; no se publica.</p>'}
      ${fila.nota && !sinContrastar ? `<p class="nv-report__note">${escapar(fila.nota)}</p>` : ''}
      <p class="nv-report__tile-source">${citas(fila, informe) ? `Fuente ${citas(fila, informe)}` : '<span class="nv-report__uncited">Sin contrastar</span>'}</p>
    </article>`;
  }).join('')}</div>
    <p class="nv-report__legend"><span class="nv-report__legend-up">Subida</span><span class="nv-report__legend-down">Bajada</span><span>Cada barra es la variación de la semana publicada por la fuente; a la derecha, sube; a la izquierda, baja.${curvas ? ' Las curvas de tipos muestran la rentabilidad de la deuda pública a cada plazo, tal como la publican el BCE (deuda AAA del área del euro) y el Tesoro de EE. UU.; en gris, la semana anterior. Si la rentabilidad baja, el precio del bono sube.' : ' En los bonos, la variación es la de su rentabilidad: si baja, el precio del bono sube.'}</span></p>`;
}

const diaAgenda = (fecha) => {
  const dia = new Intl.DateTimeFormat('es-ES', { weekday: 'long', timeZone: 'Europe/Madrid' }).format(new Date(`${fecha}T12:00:00Z`));
  return { dia: dia.charAt(0).toUpperCase() + dia.slice(1), fecha: fechaLegible(fecha) };
};

function tablaAgenda(informe) {
  // Sin hora conocida, la cita va al final de su día.
  const citasOrdenadas = [...informe.agenda].sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora ?? '99:99').localeCompare(b.hora ?? '99:99'));
  const jornadas = [];
  for (const cita of citasOrdenadas) {
    const ultima = jornadas[jornadas.length - 1];
    if (ultima && ultima.fecha === cita.fecha) ultima.citas.push(cita);
    else jornadas.push({ fecha: cita.fecha, citas: [cita] });
  }
  return `<ol class="nv-report__agenda-table nv-report__agenda-days nv-report__agenda-days--${Math.min(jornadas.length, 4)}">${jornadas.map(({ fecha, citas: lista }) => {
    const { dia, fecha: legible } = diaAgenda(fecha);
    return `<li class="nv-report__agenda-day"><div class="nv-report__agenda-head"><strong>${escapar(dia)}</strong><span>${escapar(legible)}</span></div>
      <ul>${lista.map((cita) => `<li class="nv-report__agenda-item"><span class="nv-report__hora">${escapar(cita.hora ?? '—')}</span><div><span class="nv-report__agenda-region">${escapar(cita.region)}</span><strong>${escapar(cita.que)}</strong>${cita.anterior ? `<p class="nv-report__agenda-prev"><span>Dato anterior</span>${escapar(cita.anterior)}</p>` : ''}${cita.porQueImporta ? `<p class="nv-report__note">${escapar(cita.porQueImporta)}</p>` : ''}${citas(cita, informe) ? `<span class="nv-report__cite">Fuente ${citas(cita, informe)}</span>` : ''}</div></li>`).join('')}</ul></li>`;
  }).join('')}</ol>`;
}

function valorDestacado(valor) {
  const partes = String(valor).match(/^([+−-]?\d[\d.,]*(?:\s?%)?)(.*)$/u);
  return partes ? `<span class="nv-report__number">${escapar(partes[1])}</span>${partes[2].trim() ? `<span class="nv-report__unit">${escapar(partes[2].trim())}</span>` : ''}` : escapar(valor);
}

function citas(bloque, informe) {
  return (bloque.fuentes ?? []).map((n) => {
    const fuente = informe.fuentes[n - 1];
    if (!fuente) return '';
    let url;
    try { url = new URL(fuente.url); } catch { return ''; }
    if (url.protocol !== 'https:') return '';
    return `<a class="nv-report__citation" href="${escapar(url.href)}" target="_blank" rel="noreferrer noopener" aria-label="Fuente ${n}: ${escapar(fuente.titulo)}">[${n}]</a>`;
  }).join(' ');
}

// Solo decide la viñeta decorativa: nunca resume, cambia ni completa el texto.
function temaIlustrado(titulo) {
  const texto = String(titulo).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/inflacion|\bipc\b|precios|consumo|cesta/.test(texto)) return 'precios';
  if (/energia|energet|petroleo|brent|crudo|\bgas\b/.test(texto)) return 'energia';
  if (/agenda|publica|proxima|calendario|citas/.test(texto)) return 'agenda';
  if (/bce|banco|tipos|reserva federal|monetari/.test(texto)) return 'tipos';
  if (/industr|producci|actividad|\bpib\b|empleo|crecimiento/.test(texto)) return 'actividad';
  return 'panorama';
}

export function renderInfografia(informe) {
  const conClaves = Boolean(informe.claves?.length);
  const ideas = conClaves ? informe.claves : informe.hechos;
  if (!ideas?.length) return '';
  const semanal = informe.tipo === 'SEMANAL';
  return `<section class="nv-report__section nv-report__keys nv-report-graphic" aria-label="Resumen ilustrado del informe ${semanal ? 'semanal' : 'diario'}">
    <div class="nv-report-graphic__heading"><div><p class="nv-report-graphic__kicker">En pocas palabras · Resumen ilustrado</p><h3>${semanal ? 'La semana' : 'La sesión'}, de un vistazo</h3></div><p class="nv-report-graphic__date">${escapar(periodoLegible(informe))}<span>${ideas.length} ideas para situarte</span></p></div>
    <ol class="nv-report-graphic__ideas nv-report-graphic__ideas--${ideas.length}">${ideas.map((idea, i) => `<li class="nv-report-graphic__idea">
      <div class="nv-report-graphic__visual" aria-hidden="true"><span class="nv-report-graphic__number">${numero(i)}</span><span class="nv-report-graphic__illustration nv-report-graphic__illustration--${temaIlustrado(idea.titulo || idea.texto)}"></span></div>
      ${conClaves ? `<h4>${escapar(idea.titulo)}</h4>` : `<p class="nv-report__meta">${escapar(idea.fecha)}</p>`}
      <p class="nv-report-graphic__text">${escapar(idea.texto)}</p>
      <div class="nv-report-graphic__sources">${citas(idea, informe) || '<span>Sin fuente vinculada en esta edición</span>'}</div>
    </li>`).join('')}</ol>
    <p class="nv-report-graphic__foot">El contexto y las cifras, paso a paso en el informe.<span aria-hidden="true">↓</span></p>
  </section>`;
}

export function renderInforme(informe, { independiente = false } = {}) {
  const h = independiente ? 'h1' : 'h2';
  const corte = informe.periodo?.corteIso ? new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Madrid',
  }).format(new Date(informe.periodo.corteIso)) : null;
  const cifras = informe.indicadores.filter((dato) => /\d/.test(dato.valor));
  const cobertura = informe.indicadores.filter((dato) => !/\d/.test(dato.valor));
  const claves = informe.claves ?? [];
  const mercados = informe.mercados ?? [];
  const glosario = informe.glosario ?? [];
  const periodo = ETIQUETA_PERIODO[informe.tipo] ?? 'Variación';
  const agendaV2 = informe.agenda.every((cita) => cita.fecha);
  return `<article class="nv-report nv-report--${informe.tipo.toLowerCase()}" aria-label="Informe ${etiqueta(informe.tipo).toLowerCase()}">
    <header class="nv-report__header">
      <div class="nv-report__masthead"><p class="nv-report__eyebrow">NUVIA · Economía en perspectiva</p><span class="nv-report__edition">Informe ${etiqueta(informe.tipo).toLowerCase()}</span></div>
      <div class="nv-report__cover">
        <div><${h} class="nv-report__title">${escapar(informe.titular)}</${h}><p class="nv-report__period">${escapar(periodoLegible(informe))}</p></div>
        <div class="nv-report__art" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
      </div>
      <p class="nv-report__lead">${escapar(informe.entradilla)}</p>
      <div class="nv-report__toolbar"><span class="nv-report__reading">${minutosLectura(informe)} min de lectura aprox. · ${claves.length || informe.hechos.length} claves</span>${independiente ? '' : `<a class="nv-report__download" href="${descarga(informe)}" download>Descargar informe ${etiqueta(informe.tipo).toLowerCase()} (HTML) <span aria-hidden="true">↓</span></a>`}</div>
    </header>
    ${corte ? `<p class="nv-report__cutoff">Información hasta el ${escapar(corte)} · hora de Madrid</p>` : ''}
    ${renderInfografia(informe)}
    ${cifras.length ? `<section class="nv-report__section nv-report__data"><div class="nv-report__section-label"><h3>Cifras de referencia</h3><span>El período de cada dato, junto a su fuente</span></div>
      <dl class="nv-report__figures">${cifras.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd>${valorDestacado(dato.valor)}</dd><dd class="nv-report__reference">${escapar(dato.referencia)} ${citas(dato, informe)}</dd></div>`).join('')}</dl></section>` : ''}
    ${mercados.length && informe.tipo === 'SEMANAL' && fichasSemana(informe, periodo) ? `<section class="nv-report__section nv-report__markets"><div class="nv-report__section-label"><h3>Los mercados de un vistazo</h3><span>${informe.curvas ? 'Las curvas de tipos de la eurozona y de Estados Unidos, el euro y el petróleo' : 'Cuatro referencias de la semana: deuda, divisa y energía'} · cada cifra, con su publicador</span></div>
      ${fichasSemana(informe, periodo)}</section>` : ''}
    <section class="nv-report__section nv-report__highlights"><div class="nv-report__section-label"><h3>${claves.length ? 'Los hechos del período' : 'Las claves del período'}</h3><span>${claves.length ? 'Con su fecha, su cifra y su fuente' : 'Una primera lectura'}</span></div>
      <ol class="nv-report__facts${informe.hechos.length % 2 === 0 ? ' nv-report__facts--even' : ''}">${informe.hechos.map((hecho, i) => `<li><span class="nv-report__fact-number" aria-hidden="true">${numero(i)}</span><div><span class="nv-report__meta">${escapar(hecho.fecha)}</span><p>${escapar(hecho.texto)} ${citas(hecho, informe)}</p></div></li>`).join('')}</ol>
    </section>
    <div class="nv-report__stories">${informe.cuerpo.map((seccion, i) => `<section class="nv-report__story"><div class="nv-report__story-heading"><span class="nv-report__chapter" aria-hidden="true">${numero(i)}</span><h3>${escapar(seccion.titulo)}</h3></div><div class="nv-report__story-copy">${seccion.parrafos.map((p) => `<p>${escapar(p)}</p>`).join('')}${citas(seccion, informe)}</div></section>`).join('')}</div>
    <section class="nv-report__section nv-report__calendar"><div class="nv-report__section-label"><h3>Agenda al cierre del informe</h3><span>Fechas previstas en la edición; no es un calendario en directo.</span></div>
      ${agendaV2 ? tablaAgenda(informe) : `<ul class="nv-report__agenda">${informe.agenda.map((cita) => `<li><strong>${escapar(cita.cuando)}</strong><p>${escapar(cita.que)} ${citas(cita, informe)}</p></li>`).join('')}</ul>`}
    </section>
    ${independiente && glosario.length ? `<section class="nv-report__section nv-report__glossary"><div class="nv-report__section-label"><h3>Glosario</h3><span>Los términos técnicos de esta edición, explicados</span></div>
      <dl>${glosario.map((entrada) => `<div><dt>${escapar(entrada.termino)}</dt><dd>${escapar(entrada.definicion)}</dd></div>`).join('')}</dl></section>` : ''}
    ${cobertura.length ? `<section class="nv-report__coverage"><h3>Datos pendientes de contraste</h3><dl>${cobertura.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd class="nv-report__coverage-status">${escapar(dato.valor)}</dd><dd>${escapar(dato.referencia)} ${citas(dato, informe)}</dd></div>`).join('')}</dl></section>` : ''}
    ${independiente ? `<footer class="nv-report__footer">
      <h3>Fuentes y alcance</h3>
      <ol class="nv-report__sources">${informe.fuentes.map((fuente) => `<li><a href="${escapar(fuente.url)}" target="_blank" rel="noreferrer noopener">${escapar(fuente.titulo)}</a>${fuente.nota ? `<span>${escapar(fuente.nota)}</span>` : ''}</li>`).join('')}</ol>
      ${informe.limitaciones ? `<p>${escapar(informe.limitaciones)}</p>` : ''}
      <p>Contenido elaborado con ayuda de inteligencia artificial. No es asesoramiento financiero ni determina la adecuación de una inversión.</p>
      <details class="nv-report__trace"><summary>Elaboración y revisión de esta edición</summary>
        <p>Documentación inicial: ${escapar(informe.generacion.modeloInvestigacion)}. Redacción inicial: ${escapar(informe.generacion.modeloRedaccion)}. Versión del proceso: ${escapar(informe.generacion.versionPrompt)}.</p>
        <p>${escapar(informe.revision?.nota || 'La incorporación al índice no acredita por sí sola una lectura humana.')}</p>
      </details>
    </footer>` : ''}
  </article>`.replaceAll('<h3>', independiente ? '<h2>' : '<h3>').replaceAll('</h3>', independiente ? '</h2>' : '</h3>')
    // Los bloques opcionales vacíos dejaban líneas en blanco en las páginas sincronizadas.
    .replace(/^[ \t]+$\n/gm, '');
}

export function renderTarjetas(indice, { compacto = false } = {}) {
  return `<div class="nv-reports-grid${compacto ? ' nv-reports-grid--compact' : ''}">${['DIARIO', 'SEMANAL'].map((tipo) => {
    const informe = indice.ediciones?.[tipo];
    if (!informe) return `<article class="nv-report-card"><p class="nv-report__eyebrow">Informe ${etiqueta(tipo).toLowerCase()}</p><h3>Próxima edición</h3><p>Las ediciones aparecerán aquí con su fecha y sus fuentes.</p></article>`;
    return `<article class="nv-report-card nv-report-card--${tipo.toLowerCase()}"><div class="nv-report-card__meta"><p class="nv-report__eyebrow">Informe ${etiqueta(tipo).toLowerCase()}</p><span data-report-age="${informe.fecha}" data-report-type="${tipo}">Edición fechada</span></div><p class="nv-report__meta">${escapar(periodoLegible(informe))}</p><h3><a href="${destino(informe)}">${escapar(informe.titular)}</a></h3><p>${escapar(informe.entradilla)}</p><div class="nv-report-card__bottom"><a class="nv-report-card__link" href="${destino(informe)}">Leer el ${etiqueta(tipo).toLowerCase()} <span aria-hidden="true">→</span></a><span>${minutosLectura(informe)} min de lectura aprox.</span></div></article>`;
  }).join('')}</div>`;
}

/**
 * Portada del espacio de Economía: el informe diario, en primer plano.
 * Toma las mismas cifras ya contrastadas del índice; no calcula ni interpreta.
 */
export function renderDestacado(indice) {
  const diario = indice.ediciones?.DIARIO;
  const semanal = indice.ediciones?.SEMANAL;
  if (!diario) return '<div class="nv-report-lead nv-report-lead--pendiente"><p class="nv-report__eyebrow">Informe diario</p><h3>Próxima edición</h3><p>Las ediciones aparecerán aquí con su fecha y sus fuentes.</p></div>';
  const cifras = (diario.indicadores ?? []).filter((dato) => /\d/.test(dato.valor)).slice(0, 3);
  const aside = semanal ? `<aside class="nv-report-lead__aside">
      <div class="nv-report-lead__body">
        <div class="nv-report-lead__flag"><p class="nv-report__eyebrow">Informe semanal</p><span class="nv-report-lead__age" data-report-age="${semanal.fecha}" data-report-type="SEMANAL">Edición fechada</span><span class="nv-report-lead__date">${escapar(periodoLegible(semanal))}</span></div>
        <h3 class="nv-report-lead__subtitle"><a href="${destino(semanal)}">${escapar(semanal.titular)}</a></h3>
        <p class="nv-report-lead__text">${escapar(semanal.entradilla)}</p>
      </div>
      <div class="nv-report-lead__bottom"><a class="nv-report-lead__cta" href="${destino(semanal)}">Leer el semanal <span aria-hidden="true">→</span></a><span class="nv-report-lead__reading">${minutosLectura(semanal)} min de lectura aprox.</span></div>
      <div class="nv-report-lead__art" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
    </aside>` : '';
  return `<div class="nv-report-lead">
    <article class="nv-report-lead__main">
      <div class="nv-report-lead__body">
        <div class="nv-report-lead__flag"><p class="nv-report__eyebrow">Informe diario</p><span class="nv-report-lead__age" data-report-age="${diario.fecha}" data-report-type="DIARIO">Edición fechada</span><span class="nv-report-lead__date">${escapar(periodoLegible(diario))}</span></div>
        <h3 class="nv-report-lead__title"><a href="${destino(diario)}">${escapar(diario.titular)}</a></h3>
        <p class="nv-report-lead__text">${escapar(diario.entradilla)}</p>
        <div class="nv-report-lead__bottom"><a class="nv-report-lead__cta" href="${destino(diario)}">Leer el informe diario <span aria-hidden="true">→</span></a><span class="nv-report-lead__reading">${minutosLectura(diario)} min de lectura aprox.</span></div>
      </div>
      ${cifras.length ? `<dl class="nv-report-lead__figures">${cifras.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd>${valorDestacado(dato.valor)}</dd></div>`).join('')}</dl>` : ''}
      <div class="nv-report-lead__art" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
    </article>
    ${aside}
  </div>`;
}

export function renderLector(indice) {
  const ediciones = ['DIARIO', 'SEMANAL'].map((tipo) => indice.ediciones?.[tipo]).filter(Boolean);
  if (!ediciones.length) return '<p>No hay ediciones incorporadas todavía.</p>';
  return `<div data-report-reader><nav class="nv-reports-nav" aria-label="Periodicidad del informe"><span>Edición</span>${ediciones.map((informe, i) => `<a href="${destino(informe)}" data-report-select="${informe.tipo}"${i === 0 ? ' aria-current="true"' : ''} title="${escapar(periodoLegible(informe))}">${etiqueta(informe.tipo)}</a>`).join('')}</nav><div id="lectura-informe" tabindex="-1">${ediciones.map((informe, i) => `<div data-report-edition="${informe.tipo}"${i ? ' hidden' : ''}>${renderInforme(informe)}</div>`).join('')}</div></div>`;
}
