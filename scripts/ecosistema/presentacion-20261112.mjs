/** Cambios editoriales de la maqueta, explícitos y reversibles.
 * No se aplica a scripts, motores, artículos firmados ni datos.
 * Cada sustitución conserva su posición y ambos textos para verificar que
 * fuera de estos cambios autorizados el main sigue siendo idéntico al original.
 */
export function adaptPresentation(original, pathname) {
  let html = original;
  const changes = [];
  const replace = (id, before, after, count = 1) => {
    if (!before || before === after) throw new Error(`Cambio editorial no válido: ${id}`);
    const found = html.split(before).length - 1;
    if (found !== count) throw new Error(`${pathname}: ${id}, se esperaban ${count} coincidencias y hay ${found}`);
    for (let i = 0, offset = 0; i < count; i++) {
      const position = html.indexOf(before, offset);
      html = html.slice(0, position) + after + html.slice(position + before.length);
      changes.push({id, position, before, after});
      offset = position + after.length;
    }
  };
  replace('regreso-ecosistema', '<a href="index.html" data-main-menu-return>Inicio</a>', '<a href="index.html" data-main-menu-return>Ecosistema NUVIA</a>');

  if (pathname === '/que-es-nuvia.html') {
    replace('indice-estructura', '>Los cinco espacios</a>', '>Webs y espacios comunes</a>');
    replace('nombre-ecosistema', 'El universo NUVIA</p>', 'El ecosistema NUVIA</p>');
    replace('titulo-cuatro-webs', 'id="about-world-title">Qué vas a<br>encontrar</h2>', 'id="about-world-title">Las cuatro<br>webs</h2>');
    replace('introduccion-estructura', 'Cinco puertas para comprender la economía familiar, el patrimonio y la vida que queremos sostener.', 'Ecosistema NUVIA reúne cuatro webs: Economía y Finanzas, Patrimonio, Familia, Salud y Bienestar y Academia NUVIA. Lecturas con Criterio y Colaboradores son espacios comunes, y Qué es NUVIA presenta el propósito, los valores y los límites del proyecto.');
    for (const name of ['Economía y Finanzas', 'Patrimonio', 'Familia, Salud y Bienestar', 'Academia NUVIA']) {
      replace('acceso-web-' + name, `aria-label="Entrar en ${name}">Explorar el espacio</a>`, `aria-label="Entrar en ${name}">Entrar en la web</a>`);
    }
    replace('acceso-lecturas', 'aria-label="Entrar en Lecturas con Criterio">Explorar el espacio</a>', 'aria-label="Entrar en Lecturas con Criterio">Explorar las lecturas</a>');
    const reading = html.match(/<article class="about-world__item">\s*<span>05<\/span>[\s\S]*?<\/article>/)?.[0];
    if (!reading || !reading.includes('<h3>Lecturas con Criterio</h3>')) throw new Error('No se reconoce el bloque íntegro de Lecturas');
    replace('separar-espacios-comunes', reading, `</div>
        <header class="about-common-heading">
          <h2 id="about-common-title">Espacios comunes</h2>
          <p>Lecturas con Criterio y Colaboradores forman parte de las cuatro webs. Puedes llegar a ellos desde cualquier punto del ecosistema.</p>
        </header>
        <div class="about-world__list about-world__list--common" role="group" aria-labelledby="about-common-title">
          ${reading.replace('<span>05</span>', '<span aria-hidden="true">Le</span>')}
          <article class="about-world__item">
            <span aria-hidden="true">Co</span>
            <h3>Colaboradores</h3>
            <p>Las personas que aportan conocimiento y perspectiva a los contenidos y las herramientas de NUVIA, con vocación de servicio a las familias.</p>
            <a class="nv-about-space-link" href="colaboradores.html">Conocer a los colaboradores</a>
          </article>`);
    replace('explorar-cuatro-webs', 'href="index.html#espacios">Explorar los cinco espacios', 'href="index.html#webs">Explorar las cuatro webs');
    replace('volver-ecosistema', '>Volver al inicio</a>', '>Volver al ecosistema</a>');
  }
  if (pathname === '/colaboradores.html') {
    replace('colaboradores-comunes', 'Equipo y divulgación · NUVIA', 'Personas del ecosistema NUVIA');
  }
  if (['respiracion-relajacion.html','movimiento-consciente.html','nutricion-equilibrada.html','descanso-limites-tiempo-propio.html'].some(name => pathname === '/' + name)) {
    replace('regreso-temas-bienestar', 'href="bienestar.html#pilares-bienestar">Volver a los cuatro temas', 'href="bienestar.html#recursos">Volver a los temas de Bienestar');
  }
  if (pathname === '/curso.html') {
    replace('ruta-aprendizaje-directa', 'href="academia.html#ruta-aprendizaje"', 'href="academia.html?tab=inicio#ruta-aprendizaje"');
  }
  if (restorePresentation(html, changes) !== original) throw new Error(`Cambios no registrados en ${pathname}`);
  return {html, changes};
}

export function restorePresentation(html, changes) {
  for (const {position,before,after} of [...changes].reverse()) {
    if (html.slice(position,position + after.length) !== after) throw new Error('La presentación no coincide con el cambio editorial registrado');
    html = html.slice(0,position) + before + html.slice(position + after.length);
  }
  return html;
}
