// Fuente de la portada de Academia. Genera únicamente su rama estática;
// el recorrido anterior, las lecciones y el controlador viven en academia.html.
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

export function renderAcademia(site) {
  const resource = key => site.resources.find(item => item[0] === key);
  const href = key => `${escape(resource(key)[4])}`;
  return `<section class="ac-opening web-wrap" aria-labelledby="ac-title">
    <div class="ac-studio" aria-hidden="true">
      <div class="ac-studio-window"></div>
      <img src="src/assets/ecosistema/academia-ideas.webp" alt="" width="1000" height="1000" fetchpriority="high" decoding="async">
    </div>
    <div class="ac-opening-copy">
      <p class="ac-opening-name">Academia NUVIA</p>
      <h1 id="ac-title">Saber es<br>patrimonio.</h1>
      <p class="ac-opening-description">Hay ideas que cambian nuestra forma de mirar. Empieza por lo que te da curiosidad y aprende a tu ritmo.</p>
      <a class="web-button ac-start" href="${href('esenciales')}">Ver conocimientos esenciales ${arrow}</a>
      <a class="ac-quiet-link" href="#recursos">Ver las áreas de Academia <span aria-hidden="true">↓</span></a>
    </div>
  </section>

  <section id="recursos" class="ac-workshop web-wrap" aria-labelledby="ac-workshop-title">
    <div class="ac-section-heading">
      <h2 id="ac-workshop-title">Cada pregunta abre un camino.</h2>
      <p>Desde una palabra que no conoces hasta un concepto que quieres entender de verdad.</p>
    </div>
    <div class="ac-learning-desk">
      <article class="ac-foundations" id="esenciales">
        <p class="ac-intention">Quiero entender las bases</p>
        <h3>El dinero también<br>se aprende.</h3>
        <p>Conceptos esenciales explicados desde el principio, con lenguaje claro y su relación con la vida cotidiana.</p>
        <a class="web-link" href="${href('esenciales')}">Abrir conocimientos esenciales ${arrow}</a>
      </article>
      <div class="ac-desk-notes">
        <article id="cursos" class="ac-course">
          <p class="ac-intention">Quiero seguir un recorrido</p>
          <h3>Dinero con criterio</h3>
          <p>El curso disponible reúne cinco capítulos con vídeos y apuntes para avanzar a tu ritmo.</p>
          <a class="web-link" href="${href('cursos')}">Ver el programa del curso ${arrow}</a>
        </article>
        <article id="glosario" class="ac-glossary">
          <div>
            <p class="ac-intention">Tengo una duda concreta</p>
            <h3>Una palabra,<br> una explicación.</h3>
          </div>
          <div>
            <p>Consulta un término en el glosario y vuelve a tu lectura con más contexto.</p>
            <a class="web-link" href="${href('glosario')}">Consultar el glosario ${arrow}</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="ac-experiment" id="herramientas" aria-labelledby="ac-experiment-title">
    <div class="web-wrap ac-experiment-inner">
      <div class="ac-experiment-copy">
        <p class="ac-intention">Aprender experimentando</p>
        <h2 id="ac-experiment-title">¿Qué cambia<br>cuando pasa el tiempo?</h2>
      </div>
      <div class="ac-experiment-action">
        <p>Explora el interés compuesto. Cambia el plazo, las aportaciones y la hipótesis de rentabilidad para comprender su efecto matemático.</p>
        <a class="web-button" href="${href('herramientas')}">Simular el interés compuesto ${arrow}</a>
        <p class="ac-experiment-note">Los resultados ilustran supuestos; no predicen una rentabilidad.</p>
      </div>
    </div>
  </section>

  <section class="ac-deepen web-wrap" aria-labelledby="ac-deepen-title">
    <div>
      <h2 id="ac-deepen-title">La curiosidad no termina aquí.</h2>
      <p>Amplía las bases o explora cómo funcionan los instrumentos financieros.</p>
      <a class="ac-quiet-link" href="academia.html?tab=inicio#ruta-aprendizaje">Ver el recorrido de aprendizaje <span aria-hidden="true">→</span></a>
    </div>
    <nav aria-label="Más áreas de Academia">
      <a href="academia.html?tab=fundamentos">Fundamentos de inversión ${arrow}</a>
      <a href="academia.html?tab=activos">Activos financieros ${arrow}</a>
    </nav>
  </section>
  <aside class="ac-note web-wrap" aria-label="Alcance educativo"><p>${escape(site.note)}</p></aside>`;
}
