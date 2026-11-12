// La entrada al ecosistema tiene una composición propia, independiente de las webs.
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const destinations = [
  ['economia', 'Economía y Finanzas', 'Comprender el mundo que mueve tu dinero.', 'Entrar en Economía'],
  ['patrimonio', 'Patrimonio', 'Dar perspectiva a las grandes decisiones.', 'Entrar en Patrimonio'],
  ['bienestar', 'Familia, Salud<br>y Bienestar', 'Ampliar la mirada sobre cómo vivimos.', 'Entrar en Bienestar'],
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
    <section class="hub-connections" aria-label="Contenidos comunes del ecosistema">
      <p>La curiosidad nos une.</p>
      <nav aria-label="Lecturas y colaboradores de NUVIA">
        <a href="lecturas.html">Lecturas con Criterio ${arrow}</a>
        <a href="colaboradores.html">Colaboradores ${arrow}</a>
      </nav>
    </section>
  </main>`;
}
