// Observatorio editorial · portada principal de Economía y finanzas.
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

export function renderEconomia(site) {
  const resources = Object.fromEntries(site.resources.map(resource => [resource[0], resource]));
  const url = key => `${escape(resources[key][4])}`;
  const entry = (key, heading, description, action) => `<article class="ec-entry" id="${key}">
    <h3><a href="${url(key)}">${heading} ${arrow}</a></h3>
    <p>${description}</p>
    <a class="ec-entry-action" href="${url(key)}">${action}</a>
  </article>`;

  return `<section class="ec-opening web-wrap" aria-labelledby="ec-title">
    <div class="ec-opening-copy">
      <p class="ec-intro-line">Economía y finanzas</p>
      <h1 id="ec-title">Entender lo que<br>mueve el mundo.</h1>
      <p class="ec-lead">Detrás de cada dato hay algo que cambia nuestra vida. Pon la actualidad, los mercados y tu dinero en perspectiva.</p>
      <div class="ec-opening-actions">
        <a class="web-button ec-primary" href="${url('informes')}">Consultar informes ${arrow}</a>
        <a class="web-link ec-secondary" href="${url('mercados')}">Ver mercados y noticias ${arrow}</a>
      </div>
    </div>
    <div class="ec-lens" aria-hidden="true">
      <img src="src/assets/ecosistema/economia-perspectiva.webp" alt="" width="1000" height="1000" fetchpriority="high" decoding="async">
    </div>
  </section>

  <section class="ec-observatory web-wrap" id="recursos" aria-label="Recursos de Economía y finanzas">
    <div class="ec-context" aria-labelledby="ec-context-title">
      <div class="ec-section-intro">
        <h2 id="ec-context-title">Seguir el contexto.</h2>
        <p>Una lectura para situarte. Los datos para profundizar.</p>
      </div>
      ${entry('informes', 'Informes de mercado', 'Consulta el diario, el semanal y el archivo de ediciones, con sus fuentes y fechas.', 'Consultar informes')}
      ${entry('mercados', 'Mercados y noticias', 'Noticias, indicadores y cotizaciones para entender qué está ocurriendo.', 'Ver mercados y noticias')}
    </div>
    <div class="ec-analysis" aria-labelledby="ec-analysis-title">
      <div class="ec-section-intro">
        <h2 id="ec-analysis-title">Explorar los datos.</h2>
        <p>Herramientas para observar, comparar y comprender.</p>
      </div>
      ${entry('cartera', 'Análisis de cartera', 'Explora la composición y el riesgo de una cartera o consulta las carteras modelo. Los métodos y límites acompañan al análisis.', 'Abrir el análisis de cartera')}
      ${entry('empresas', 'Análisis y valoración de empresas', 'Busca una empresa y consulta sus cuentas, ratios e históricos, con la procedencia y la fecha de los datos.', 'Buscar una empresa')}
    </div>
  </section>

  <section class="ec-learning web-wrap" aria-labelledby="ec-learning-title">
    <div>
      <h2 id="ec-learning-title">El criterio también se aprende.</h2>
      <p>Si aparece un concepto nuevo, Academia NUVIA te ayuda a empezar por las bases.</p>
    </div>
    <a class="web-link" href="academia.html">Ir a Academia NUVIA ${arrow}</a>
  </section>
  <aside class="ec-note web-wrap"><p>${escape(site.note)}</p></aside>`;
}
