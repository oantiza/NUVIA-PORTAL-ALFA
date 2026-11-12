const arrow='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
export function renderBienestar(site) {
  return `<section class="bi-opening web-wrap" aria-labelledby="bi-title"><div class="bi-opening-heading"><div><p class="bi-name">Familia, Salud y Bienestar</p><h1 id="bi-title">También importa<br>cómo vivimos.</h1></div><div class="bi-opening-description"><p>El cuerpo, la mente y el tiempo que compartimos. Un espacio para detenerse, aprender y ampliar la mirada.</p><a class="web-link" href="#recursos">Ver los cuatro temas ${arrow}</a></div></div><figure class="bi-photo"><img src="src/assets/ecosistema/bienestar-paseo.webp" alt="" width="1400" height="933" fetchpriority="high" decoding="async"><figcaption>Hay espacio para ir con calma.</figcaption></figure></section>
  <section id="recursos" class="bi-topics web-wrap" aria-labelledby="bi-topics-title"><div class="bi-section-heading"><h2 id="bi-topics-title">Cuatro formas de explorar.</h2><p>Divulgación para la vida cotidiana.</p></div><div class="bi-topics-grid">${site.resources.map((r,i)=>`<article class="bi-topic" id="${r[0]}"><div class="bi-symbol bi-symbol--${r[0]}" aria-hidden="true"></div><h3>${r[1]}</h3><p>${i===0?'Respirar, relajarse y observar la mente con más contexto.':r[3]}</p><span class="bi-status">${r[2]}</span><a class="web-link" href="${r[4]}">${r[5]} ${arrow}</a></article>`).join('')}</div></section>
  <section class="bi-reading"><div class="web-wrap bi-reading-inner"><div class="bi-reading-intro"><p class="bi-name">Para leer con calma</p><h2>Una pausa.<br>Una nueva mirada.</h2><p>Dos ensayos de Isabel Florido Mayor sobre respiración y meditación.</p></div><div class="bi-reading-list"><article><p>Respiración y relajación</p><h3><a href="la-respiracion-como-el-escultor-del-cerebro.html">La respiración como el escultor del cerebro ${arrow}</a></h3><span>Ensayo con vídeo · 2 de octubre de 2026</span></article><article><p>Respiración y relajación</p><h3><a href="que-es-meditar.html">¿Qué es meditar? ${arrow}</a></h3><span>Ensayo con vídeo · 13 de octubre de 2026</span></article><a class="web-link" href="colaboradores.html#isabel-florido">Ver la ficha de Isabel Florido Mayor ${arrow}</a></div></div></section>
  <aside class="web-wrap bi-note"><h2>Fuentes y límites</h2><p>${site.note} Las publicaciones identifican su autoría y sus fuentes de consulta.</p></aside>
  <section class="bi-sources web-wrap" aria-label="Información sanitaria y fuentes de consulta">
    <div class="bi-sources-notice" role="note">
      <p><strong>Aviso de divulgación general:</strong> Los contenidos de este espacio son informativos y educativos. No constituyen consejo médico, diagnóstico clínico ni prescripción sanitaria individualizada.</p>
    </div>
    <div id="fuentes-bienestar" class="bn-sources" aria-labelledby="titulo-fuentes-bienestar">
      <div class="bn-sources__text">
        <p class="nv-eyebrow">Información y alcance</p>
        <h3 id="titulo-fuentes-bienestar">Fuentes de consulta y límites</h3>
        <p>Este espacio no ofrece diagnóstico, tratamiento ni consejo sanitario individual. No sustituye la atención de un profesional sanitario ni solicita datos sobre tu salud. Cada contenido indica su autoría, fecha y fuentes; los contenidos sanitarios requieren revisión profesional de su contenido sanitario antes de publicarse.</p>
      </div>
      <ul class="bn-sources__list" aria-label="Índices públicos de consulta">
        <li><a class="tm-wellbeing-source__link" href="https://www.who.int/es/health-topics" target="_blank" rel="noopener noreferrer">Temas de salud · Organización Mundial de la Salud <span class="nv-visually-hidden">(se abre en otra pestaña)</span>↗</a><span>Índice público en español. No implica un aval de la institución a NUVIA.</span></li>
        <li><a class="tm-wellbeing-source__link" href="https://medlineplus.gov/spanish/healthtopics.html" target="_blank" rel="noopener noreferrer">Temas de salud · MedlinePlus en español <span class="nv-visually-hidden">(se abre en otra pestaña)</span>↗</a><span>Biblioteca Nacional de Medicina de Estados Unidos.</span></li>
      </ul>
    </div>
  </section>`;
}
