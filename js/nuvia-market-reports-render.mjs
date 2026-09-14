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
 * Barras con signo, en SVG estático (sin scripts: el descargable no los admite).
 * Un solo gráfico por informe: las bolsas, que comparten escala. Deuda (puntos
 * de rentabilidad) y divisas no se mezclan en el mismo eje.
 */
function graficoVariaciones(grupo, periodo) {
  const filas = grupo.filas.filter((f) => typeof f.variacion === 'number' && Number.isFinite(f.variacion));
  if (filas.length < 2) return '';
  const extremo = Math.max(0.5, ...filas.map((f) => Math.abs(f.variacion)));
  const pasos = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100];
  const tope = pasos.find((paso) => paso >= extremo * 1.1) ?? Math.ceil(extremo * 1.1);
  const alto = 22;
  const hueco = 10;
  const etiquetas = 300;
  const cero = 650;
  const medio = 320;
  const altoTotal = filas.length * (alto + hueco) + 34;
  const barras = filas.map((fila, i) => {
    const y = i * (alto + hueco);
    const ancho = Math.max(2, (Math.abs(fila.variacion) / tope) * medio);
    const x = fila.variacion < 0 ? cero - ancho : cero;
    const clase = fila.variacion < 0 ? 'nv-report__bar--down' : 'nv-report__bar--up';
    const textoX = fila.variacion < 0 ? cero - ancho - 8 : cero + ancho + 8;
    const ancla = fila.variacion < 0 ? 'end' : 'start';
    return `<text class="nv-report__bar-label" x="${etiquetas - 12}" y="${y + alto / 2}" text-anchor="end" dominant-baseline="middle">${escapar(fila.nombre)}</text>` +
      `<rect class="${clase}" x="${x.toFixed(1)}" y="${y}" width="${ancho.toFixed(1)}" height="${alto}" rx="2"></rect>` +
      `<text class="nv-report__bar-value${claseSigno(fila.variacion)}" x="${textoX.toFixed(1)}" y="${y + alto / 2}" text-anchor="${ancla}" dominant-baseline="middle">${escapar(variacionLegible(fila.variacion, 2))}</text>`;
  }).join('');
  const ejeY = filas.length * (alto + hueco) + 4;
  const ejes = `<line class="nv-report__bar-axis" x1="${cero}" y1="0" x2="${cero}" y2="${ejeY - 6}"></line>` +
    `<text class="nv-report__bar-tick" x="${cero - medio}" y="${ejeY + 14}" text-anchor="start">${escapar(variacionLegible(-tope))}</text>` +
    `<text class="nv-report__bar-tick" x="${cero}" y="${ejeY + 14}" text-anchor="middle">0 · ${escapar(periodo.toLowerCase())}</text>` +
    `<text class="nv-report__bar-tick" x="${cero + medio}" y="${ejeY + 14}" text-anchor="end">${escapar(variacionLegible(tope))}</text>`;
  const descripcion = filas.map((f) => `${f.nombre} ${variacionLegible(f.variacion, 2)}`).join('; ');
  return `<figure class="nv-report__chart"><svg viewBox="0 0 1000 ${altoTotal}" role="img" aria-label="${escapar(`${grupo.grupo}, ${periodo.toLowerCase()}: ${descripcion}`)}" preserveAspectRatio="xMinYMin meet">${ejes}${barras}</svg><figcaption>${escapar(grupo.grupo)} · ${escapar(periodo.toLowerCase())}. Barras a la derecha, subidas; a la izquierda, bajadas. La cifra es la variación publicada por la fuente citada en la tabla.</figcaption></figure>`;
}

function tablaMercado(grupo, informe, periodo) {
  const conAnual = grupo.filas.some((f) => typeof f.variacionAnual === 'number');
  const conNota = grupo.filas.some((f) => f.nota);
  const deuda = esDeuda(grupo.grupo);
  const digitos = 2;
  return `<div class="nv-report__market"><h4>${escapar(grupo.grupo)}</h4>
    <div class="nv-report__table-wrap"><table class="nv-report__table"><thead><tr><th scope="col">Referencia</th><th scope="col" class="num">Nivel</th><th scope="col" class="num">${escapar(periodo)}</th>${conAnual ? '<th scope="col" class="num">En el año</th>' : ''}${conNota ? '<th scope="col">Qué lo explica</th>' : ''}<th scope="col">Fuente</th></tr></thead>
    <tbody>${grupo.filas.map((fila) => `<tr><th scope="row">${escapar(fila.nombre)}</th><td class="num">${escapar(fila.nivel ?? 'Sin contrastar')}</td><td class="num nv-report__delta${claseSigno(fila.variacion)}">${escapar(variacionLegible(fila.variacion, digitos))}</td>${conAnual ? `<td class="num nv-report__delta${claseSigno(fila.variacionAnual)}">${escapar(variacionLegible(fila.variacionAnual, 2))}</td>` : ''}${conNota ? `<td class="nv-report__note">${escapar(fila.nota ?? '')}</td>` : ''}<td class="nv-report__cite">${citas(fila, informe) || '<span class="nv-report__uncited">Sin contrastar</span>'}</td></tr>`).join('')}</tbody></table></div>
    ${deuda ? '<p class="nv-report__table-note">En deuda pública la variación es la de su rentabilidad, en puntos porcentuales: si baja, el precio del bono sube.</p>' : ''}
  </div>`;
}

const diaAgenda = (fecha) => {
  const dia = new Intl.DateTimeFormat('es-ES', { weekday: 'long', timeZone: 'Europe/Madrid' }).format(new Date(`${fecha}T12:00:00Z`));
  return { dia: dia.charAt(0).toUpperCase() + dia.slice(1), fecha: fechaLegible(fecha) };
};

function tablaAgenda(informe) {
  // Sin hora conocida, la cita va al final de su día.
  const citasOrdenadas = [...informe.agenda].sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora ?? '99:99').localeCompare(b.hora ?? '99:99'));
  const conAnterior = citasOrdenadas.some((c) => c.anterior);
  const conPorQue = citasOrdenadas.some((c) => c.porQueImporta);
  return `<div class="nv-report__table-wrap"><table class="nv-report__table nv-report__agenda-table"><thead><tr><th scope="col">Día</th><th scope="col">Hora</th><th scope="col">Región</th><th scope="col">Cita</th>${conAnterior ? '<th scope="col" class="num">Dato anterior</th>' : ''}${conPorQue ? '<th scope="col">Por qué se sigue</th>' : ''}<th scope="col">Fuente</th></tr></thead>
    <tbody>${citasOrdenadas.map((cita, i) => {
      const primera = i === 0 || cita.fecha !== citasOrdenadas[i - 1].fecha;
      const { dia, fecha } = diaAgenda(cita.fecha);
      return `<tr${primera ? ' class="nv-report__agenda-day"' : ''}><th scope="row">${primera ? `<strong>${escapar(dia)}</strong><span>${escapar(fecha)}</span>` : ''}</th><td class="nv-report__hora">${escapar(cita.hora ?? '—')}</td><td>${escapar(cita.region)}</td><td>${escapar(cita.que)}</td>${conAnterior ? `<td class="num">${escapar(cita.anterior ?? '—')}</td>` : ''}${conPorQue ? `<td class="nv-report__note">${escapar(cita.porQueImporta ?? '')}</td>` : ''}<td class="nv-report__cite">${citas(cita, informe)}</td></tr>`;
    }).join('')}</tbody></table></div>`;
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
  const grupoGrafico = mercados.find((g) => /bolsa|índice|indice/i.test(g.grupo)) ?? mercados[0];
  const agendaV2 = informe.agenda.every((cita) => cita.fecha);
  return `<article class="nv-report nv-report--${informe.tipo.toLowerCase()}" aria-label="Informe ${etiqueta(informe.tipo).toLowerCase()}">
    <header class="nv-report__header">
      <div class="nv-report__masthead"><p class="nv-report__eyebrow">NUVIA · Economía en perspectiva</p><span class="nv-report__edition">Informe ${etiqueta(informe.tipo).toLowerCase()}</span></div>
      <div class="nv-report__cover">
        <div><${h} class="nv-report__title">${escapar(informe.titular)}</${h}><p class="nv-report__period">${escapar(periodoLegible(informe))}</p></div>
        <div class="nv-report__art" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
      </div>
      <p class="nv-report__lead">${escapar(informe.entradilla)}</p>
      <div class="nv-report__toolbar"><span class="nv-report__reading">${minutosLectura(informe)} min de lectura aprox. · ${informe.hechos.length} claves</span>${independiente ? '' : `<a class="nv-report__download" href="${descarga(informe)}" download>Descargar informe ${etiqueta(informe.tipo).toLowerCase()} (HTML) <span aria-hidden="true">↓</span></a>`}</div>
    </header>
    ${corte ? `<p class="nv-report__cutoff">Información hasta el ${escapar(corte)} · hora de Madrid</p>` : ''}
    ${claves.length ? `<section class="nv-report__section nv-report__keys"><div class="nv-report__section-label"><h3>En pocas palabras</h3><span>Lo que conviene entender de este período, sin tecnicismos</span></div>
      <ol class="nv-report__keys-list">${claves.map((clave, i) => `<li><span class="nv-report__key-number" aria-hidden="true">${i + 1}</span><div><strong>${escapar(clave.titulo)}</strong><p>${escapar(clave.texto)} ${citas(clave, informe)}</p></div></li>`).join('')}</ol></section>` : ''}
    ${cifras.length ? `<section class="nv-report__section nv-report__data"><div class="nv-report__section-label"><h3>Cifras de referencia</h3><span>El período de cada dato, junto a su fuente</span></div>
      <dl class="nv-report__figures">${cifras.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd>${valorDestacado(dato.valor)}</dd><dd class="nv-report__reference">${escapar(dato.referencia)} ${citas(dato, informe)}</dd></div>`).join('')}</dl></section>` : ''}
    ${mercados.length && informe.tipo === 'SEMANAL' ? `<section class="nv-report__section nv-report__markets"><div class="nv-report__section-label"><h3>Los mercados de un vistazo</h3><span>${informe.tipo === 'SEMANAL' ? 'Cierre a cierre de los siete días' : 'Cierre de la última sesión'} · cada cifra, con su publicador</span></div>
      ${grupoGrafico ? graficoVariaciones(grupoGrafico, periodo) : ''}${mercados.map((grupo) => tablaMercado(grupo, informe, periodo)).join('')}</section>` : ''}
    <section class="nv-report__section nv-report__highlights"><div class="nv-report__section-label"><h3>${claves.length ? 'Los hechos del período' : 'Las claves del período'}</h3><span>${claves.length ? 'Con su fecha, su cifra y su fuente' : 'Una primera lectura'}</span></div>
      <ol class="nv-report__facts${informe.hechos.length % 2 === 0 ? ' nv-report__facts--even' : ''}">${informe.hechos.map((hecho, i) => `<li><span class="nv-report__fact-number" aria-hidden="true">${numero(i)}</span><div><span class="nv-report__meta">${escapar(hecho.fecha)}</span><p>${escapar(hecho.texto)} ${citas(hecho, informe)}</p></div></li>`).join('')}</ol>
    </section>
    <div class="nv-report__stories">${informe.cuerpo.map((seccion, i) => `<section class="nv-report__story"><div class="nv-report__story-heading"><span class="nv-report__chapter" aria-hidden="true">${numero(i)}</span><h3>${escapar(seccion.titulo)}</h3></div><div class="nv-report__story-copy">${seccion.parrafos.map((p) => `<p>${escapar(p)}</p>`).join('')}${citas(seccion, informe)}</div></section>`).join('')}</div>
    <section class="nv-report__section nv-report__calendar"><div class="nv-report__section-label"><h3>Agenda al cierre del informe</h3><span>Fechas previstas en la edición; no es un calendario en directo.</span></div>
      ${agendaV2 ? tablaAgenda(informe) : `<ul class="nv-report__agenda">${informe.agenda.map((cita) => `<li><strong>${escapar(cita.cuando)}</strong><p>${escapar(cita.que)} ${citas(cita, informe)}</p></li>`).join('')}</ul>`}
    </section>
    ${glosario.length ? `<section class="nv-report__section nv-report__glossary"><div class="nv-report__section-label"><h3>Glosario</h3><span>Los términos técnicos de esta edición, explicados</span></div>
      <dl>${glosario.map((entrada) => `<div><dt>${escapar(entrada.termino)}</dt><dd>${escapar(entrada.definicion)}</dd></div>`).join('')}</dl></section>` : ''}
    ${cobertura.length ? `<section class="nv-report__coverage"><h3>Datos pendientes de contraste</h3><dl>${cobertura.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd class="nv-report__coverage-status">${escapar(dato.valor)}</dd><dd>${escapar(dato.referencia)} ${citas(dato, informe)}</dd></div>`).join('')}</dl></section>` : ''}
    <footer class="nv-report__footer">
      <h3>Fuentes y alcance</h3>
      <ol class="nv-report__sources">${informe.fuentes.map((fuente) => `<li><a href="${escapar(fuente.url)}" target="_blank" rel="noreferrer noopener">${escapar(fuente.titulo)}</a>${fuente.nota ? `<span>${escapar(fuente.nota)}</span>` : ''}</li>`).join('')}</ol>
      ${informe.limitaciones ? `<p>${escapar(informe.limitaciones)}</p>` : ''}
      <p>Contenido elaborado con ayuda de inteligencia artificial. No es asesoramiento financiero ni determina la adecuación de una inversión.</p>
      <details class="nv-report__trace"><summary>Elaboración y revisión de esta edición</summary>
        <p>Documentación inicial: ${escapar(informe.generacion.modeloInvestigacion)}. Redacción inicial: ${escapar(informe.generacion.modeloRedaccion)}. Versión del proceso: ${escapar(informe.generacion.versionPrompt)}.</p>
        <p>${escapar(informe.revision?.nota || 'La incorporación al índice no acredita por sí sola una lectura humana.')}</p>
      </details>
    </footer>
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

export function renderLector(indice) {
  const ediciones = ['DIARIO', 'SEMANAL'].map((tipo) => indice.ediciones?.[tipo]).filter(Boolean);
  if (!ediciones.length) return '<p>No hay ediciones incorporadas todavía.</p>';
  return `<div data-report-reader><nav class="nv-reports-nav" aria-label="Periodicidad del informe">${ediciones.map((informe, i) => `<a href="${destino(informe)}" data-report-select="${informe.tipo}"${i === 0 ? ' aria-current="true"' : ''}>Informe ${etiqueta(informe.tipo).toLowerCase()}<span>${escapar(periodoLegible(informe))}</span></a>`).join('')}</nav><div id="lectura-informe" tabindex="-1">${ediciones.map((informe, i) => `<div data-report-edition="${informe.tipo}"${i ? ' hidden' : ''}>${renderInforme(informe)}</div>`).join('')}</div></div>`;
}
