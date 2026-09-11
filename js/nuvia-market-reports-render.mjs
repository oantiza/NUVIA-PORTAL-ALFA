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
  informe.entradilla, ...informe.hechos.map((h) => h.texto),
  ...informe.cuerpo.flatMap((s) => [s.titulo, ...s.parrafos]),
  ...informe.agenda.map((a) => a.que), informe.limitaciones || '',
].join(' ').split(/\s+/).length / 220));
const numero = (i) => String(i + 1).padStart(2, '0');

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
    ${cifras.length ? `<section class="nv-report__section nv-report__data"><div class="nv-report__section-label"><h3>Cifras de referencia</h3><span>El período de cada dato, junto a su fuente</span></div>
      <dl class="nv-report__figures">${cifras.map((dato) => `<div><dt>${escapar(dato.etiqueta)}</dt><dd>${valorDestacado(dato.valor)}</dd><dd class="nv-report__reference">${escapar(dato.referencia)} ${citas(dato, informe)}</dd></div>`).join('')}</dl></section>` : ''}
    <section class="nv-report__section nv-report__highlights"><div class="nv-report__section-label"><h3>Las claves del período</h3><span>Una primera lectura</span></div>
      <ol class="nv-report__facts${informe.hechos.length % 2 === 0 ? ' nv-report__facts--even' : ''}">${informe.hechos.map((hecho, i) => `<li><span class="nv-report__fact-number" aria-hidden="true">${numero(i)}</span><div><span class="nv-report__meta">${escapar(hecho.fecha)}</span><p>${escapar(hecho.texto)} ${citas(hecho, informe)}</p></div></li>`).join('')}</ol>
    </section>
    <div class="nv-report__stories">${informe.cuerpo.map((seccion, i) => `<section class="nv-report__story"><div class="nv-report__story-heading"><span class="nv-report__chapter" aria-hidden="true">${numero(i)}</span><h3>${escapar(seccion.titulo)}</h3></div><div class="nv-report__story-copy">${seccion.parrafos.map((p) => `<p>${escapar(p)}</p>`).join('')}${citas(seccion, informe)}</div></section>`).join('')}</div>
    <section class="nv-report__section nv-report__calendar"><div class="nv-report__section-label"><h3>Agenda al cierre del informe</h3><span>Fechas previstas en la edición; no es un calendario en directo.</span></div>
      <ul class="nv-report__agenda">${informe.agenda.map((cita) => `<li><strong>${escapar(cita.cuando)}</strong><p>${escapar(cita.que)} ${citas(cita, informe)}</p></li>`).join('')}</ul>
    </section>
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
  </article>`.replaceAll('<h3>', independiente ? '<h2>' : '<h3>').replaceAll('</h3>', independiente ? '</h2>' : '</h3>');
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
