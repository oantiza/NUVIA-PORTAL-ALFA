// La entrada al ecosistema tiene una composición propia, independiente de las webs.
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const destinations = [
  ['economia', 'Economía y finanzas', 'Comprender el mundo que mueve tu dinero.', 'Entrar en Economía'],
  ['patrimonio', 'Patrimonio', 'Dar perspectiva a las grandes decisiones.', 'Entrar en Patrimonio'],
  ['bienestar', 'Familia y bienestar', 'Ampliar la mirada sobre cómo vivimos.', 'Entrar en Bienestar'],
  ['academia', 'Academia NUVIA', 'Aprender hoy. Construir criterio para mañana.', 'Entrar en Academia'],
];

export function renderHub() {
  return `<main id="contenido" tabindex="-1">
    <section class="hub-intro" aria-labelledby="hub-title">
      <p class="hub-eyebrow">Cuatro webs. Una misma mirada.</p>
      <h1 id="hub-title">Todo está <em>conectado.</em></h1>
      <p class="hub-intro-copy">Tu dinero, tu familia, lo que sabes y lo que está por venir.<br>Un ecosistema para comprenderlo en conjunto.</p>
    </section>
    <nav id="webs" class="hub-stage" aria-label="Las cuatro webs de NUVIA">
      <div class="hub-art" aria-hidden="true">
        <div class="hub-art-halo"></div>
        <img src="src/assets/ecosistema/conexiones.webp" alt="" width="1000" height="1000" fetchpriority="high" decoding="async">
      </div>
      ${destinations.map(([key,name,description,action])=>`<a class="hub-door eco-portal hub-door--${key}" href="${key}.html" aria-label="${name.replace('<br>',' ')}: ${description}">
        <span class="hub-door-marker" aria-hidden="true"></span>
        <h2>${name}</h2>
        <p>${description}</p>
        <span class="hub-door-action">${action} ${arrow}</span>
      </a>`).join('\n      ')}
    </nav>
    <section class="hub-connections" aria-label="Espacios comunes de NUVIA">
      <p>La curiosidad nos une.</p>
      <nav aria-label="Lecturas y colaboradores de NUVIA">
        <a href="lecturas.html">Lecturas con Criterio ${arrow}</a>
        <a href="colaboradores.html">Colaboradores ${arrow}</a>
      </nav>
    </section>
    <section class="hub-tools" id="herramientas" aria-label="Acceso directo a herramientas">
      <details>
        <summary><span>¿Buscas una herramienta?</span><span class="hub-tools-action">Ver las herramientas <span aria-hidden="true">+</span></span></summary>
        <nav aria-label="Herramientas de NUVIA">
          <a href="vivienda.html#simulador-vivienda"><span>Vivienda</span><small>Compra, alquiler y comparación de hipotecas</small>${arrow}</a>
          <a href="jubilacion.html#simulador-jubilacion"><span>Jubilación</span><small>Ingresos y escenarios de futuro</small>${arrow}</a>
          <a href="fiscalidad.html#guias"><span>Impuestos</span><small>Guías y ejemplos de cálculo fiscal</small>${arrow}</a>
          <a href="academia.html?tab=calculadora#simulador-interes"><span>Interés compuesto</span><small>Tiempo, aportaciones y rentabilidad supuesta</small>${arrow}</a>
          <a href="cartera.html#laboratorio"><span>Análisis de cartera</span><small>Composición, riesgo y escenarios</small>${arrow}</a>
          <a href="cartera.html?vista=companies#suite-nuvia"><span>Análisis de empresas</span><small>Datos, ratios y métodos de valoración</small>${arrow}</a>
        </nav>
      </details>
    </section>
  </main>`;
}
