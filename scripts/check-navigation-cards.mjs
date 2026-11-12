/* Pruebas locales de interacción: no siguen enlaces ni activan servicios externos. */
export async function checkNavigationAndCards(page, route) {
  const problems = [];
  const file = route.split(/[?#]/)[0];
  // La lámina técnica no pertenece a la navegación pública, y ya era una
  // excepción explícita. Verificamos su identidad en vez de omitir silenciosamente
  // cualquier página que accidentalmente pierda la cabecera.
  if (file === 'sistema-visual.html') {
    if (!await page.locator('meta[name="robots"][content*="noindex"]').count() || !await page.locator('#titulo-sistema').count()) problems.push('La excepción de navegación debe seguir siendo la muestra técnica no indexable');
    return problems;
  }
  const webs = ['economia.html', 'patrimonio.html', 'bienestar.html', 'academia.html'];
  const common = ['lecturas.html', 'colaboradores.html'];
  const institutional = ['que-es-nuvia.html', 'metodologia.html', 'independencia.html'];
  const header = page.locator('header[data-screen-label="Header"]');
  const footer = page.locator('footer[data-screen-label="Footer"]');
  if (await header.count() !== 1 || await footer.count() !== 1) return ['Debe existir exactamente una cabecera y un pie públicos'];
  const hrefs = locator => locator.evaluateAll(elements => elements.map(el => new URL(el.href).pathname.split('/').pop()));
  const same = (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected);
  const checkControls = async locator => problems.push(...await locator.evaluateAll(elements => {
    const previous = document.activeElement;
    const out = [];
    for (const el of elements) {
      const r = el.getBoundingClientRect();
      const name = (el.getAttribute('aria-label') || el.textContent || el.querySelector('img')?.alt || '').trim();
      if (!name) out.push('Control de navegación sin nombre accesible');
      if (r.width < 43.5 || r.height < 43.5) out.push(`${name}: objetivo menor de 44 × 44 px (${r.width.toFixed(1)} × ${r.height.toFixed(1)})`);
      el.focus();
      if (document.activeElement !== el) out.push(`${name}: no recibe el foco`);
      const css = getComputedStyle(el);
      if (el.matches(':focus-visible') && (css.outlineStyle === 'none' || parseFloat(css.outlineWidth) < 2) && css.boxShadow === 'none') out.push(`${name}: foco de teclado sin indicador visible`);
    }
    previous?.focus();
    return out;
  }));

  // Establece modalidad de teclado para comprobar los indicadores :focus-visible.
  await page.keyboard.press('Tab');
  if (file === 'index.html') {
    if (!same(await hrefs(header.locator('a')), ['index.html', 'que-es-nuvia.html'])) problems.push('El hub debe ofrecer marca y un único acceso a Qué es NUVIA');
    if (await header.locator('details').count()) problems.push('La portada del ecosistema conserva su cabecera sencilla');
    if (!same(await hrefs(page.locator('#webs .hub-door')), webs)) problems.push('El hub no presenta exactamente las cuatro webs');
    if (!same(await hrefs(page.locator('.hub-connections a')), common)) problems.push('El hub no distingue los dos espacios comunes');
    if (!same(await hrefs(footer.locator('a')), institutional.slice(1))) problems.push('El pie del hub debe enlazar Metodología e Independencia');
    await checkControls(page.locator('.hub-header a, #webs .hub-door, .hub-connections a, .hub-footer a'));
  } else {
    const groups = header.locator('details.eco-switch');
    if (await groups.count() !== 1) return [...problems, 'Cada web o espacio común debe tener un selector nativo del ecosistema'];
    const group = groups.first();
    const summary = group.locator('summary');
    const shared = await header.evaluate(el => el.classList.contains('web-header--shared'));
    if (!same(await hrefs(group.locator('a')), shared ? webs : ['index.html', ...webs, ...common, ...institutional])) problems.push('El selector no contiene las cuatro webs y los accesos globales previstos');
    const local = header.locator('.web-local a');
    if (await local.count() !== (shared ? 4 : 5)) problems.push('La navegación contextual ha perdido destinos');
    if (shared && !same(await hrefs(local), ['index.html', ...common, 'que-es-nuvia.html'])) problems.push('Los espacios comunes deben ofrecer portada, Lecturas, Colaboradores y Qué es NUVIA');
    if (!same(await hrefs(footer.locator('a')), ['index.html', ...common, ...institutional])) problems.push('El pie no conserva regreso, espacios comunes y páginas institucionales');
    problems.push(...await page.evaluate(() => {
      const current = new URL(location.href);
      const file = current.pathname.split('/').pop();
      const canonical = url => {
        const path = url.pathname.split('/').pop();
        const params = new URLSearchParams();
        if (path === 'academia.html') {
          let tab = url.searchParams.get('tab');
          if (['fundamentos', 'activos', 'pib'].includes(tab)) tab = 'esenciales';
          if (tab === 'interes') tab = 'calculadora';
          if (tab && !['inicio', 'portada'].includes(tab)) params.set('tab', tab);
        } else if (path === 'cartera.html') {
          if (['companies', 'technical', 'fundamental'].includes(url.searchParams.get('vista'))) params.set('vista', 'companies');
        } else if (path === 'mercados.html') {
          if (['informes', 'archivo'].includes(url.searchParams.get('vista'))) params.set('vista', 'informes');
        } else if (path === 'temas.html' && url.searchParams.get('topic')) params.set('topic', url.searchParams.get('topic'));
        return path + (params.size ? '?' + params : '');
      };
      const parents = {
        'guia-fiscal.html': 'jubilacion.html', 'guia-planificacion.html': 'jubilacion.html',
        'guia-ahorro.html': 'fiscalidad.html', 'guia-calendario.html': 'fiscalidad.html', 'guia-sucesiones.html': 'fiscalidad.html',
        'la-respiracion-como-el-escultor-del-cerebro.html': 'respiracion-relajacion.html', 'que-es-meditar.html': 'respiracion-relajacion.html',
        'curso.html': 'academia.html?tab=cursos'
      };
      const section = canonical(new URL(parents[file] || current.href, current));
      const out = [];
      for (const link of document.querySelectorAll('.web-local a')) {
        const expected = canonical(new URL(link.href)) === section;
        if (link.hasAttribute('aria-current') !== expected) out.push(`${link.textContent.trim()}: aria-current no corresponde a la vista o a su sección`);
      }
      // El enlace a una portada no es la página actual cuando estamos viendo
      // su calculadora, curso o antigua ruta educativa (?tab=inicio).
      const pageLocation = url => {
        const params = new URLSearchParams();
        for (const key of ['tab', 'vista', 'topic']) if (url.searchParams.has(key)) params.set(key, url.searchParams.get(key));
        if (url.pathname.endsWith('/academia.html') && params.get('tab') === 'portada') params.delete('tab');
        params.sort();
        return url.pathname + (params.size ? '?' + params : '');
      };
      for (const link of document.querySelectorAll('.web-name, .eco-switch a, .web-footer a')) {
        const expected = pageLocation(new URL(link.href)) === pageLocation(current);
        if (link.hasAttribute('aria-current') !== expected) out.push(`${link.textContent.trim()}: aria-current identifica una portada distinta de la vista actual`);
      }
      return out;
    }));
    await summary.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.eco-switch')?.open);
    problems.push(...await group.evaluate(el => {
      const box = el.querySelector('nav').getBoundingClientRect();
      const out = [];
      if (box.left < -1 || box.right > document.documentElement.clientWidth + 1) out.push('Desplegable fuera del ancho visible');
      if (document.querySelectorAll('.eco-switch[open]').length !== 1) out.push('Más de un desplegable abierto');
      return out;
    }));
    await checkControls(header.locator('a, summary'));
    await summary.focus();
    await page.keyboard.press('Tab');
    if (!await group.evaluate(el => el.querySelector('a') === document.activeElement)) problems.push('Tab no entra en el primer enlace del menú');
    await page.keyboard.press('Escape');
    if (!await group.evaluate(el => !el.open && el.querySelector('summary') === document.activeElement)) problems.push('Escape no cierra el menú y devuelve el foco');
    await checkControls(footer.locator('a'));
  }
  if (file === 'lecturas.html') {
    const cards = page.locator('.lecturas-card');
    if (await cards.count() !== 4) problems.push('Deben conservarse las cuatro fichas de Lecturas');
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      const img = card.locator('.lecturas-card__cover img');
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) => el.decode());
      problems.push(...await card.evaluate((el) => {
        const image = el.querySelector('.lecturas-card__cover img');
        const cover = image.parentElement;
        const a = image.getBoundingClientRect(), b = cover.getBoundingClientRect();
        const out = [];
        if (!image.naturalWidth || !a.width || !a.height) out.push('portada sin imagen o sin tamaño');
        if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1) out.push('portada recortada por su contenedor');
        if (getComputedStyle(image).objectFit !== 'contain') out.push('la portada no conserva su contenido completo');
        if (el.getAttribute('role') === 'button' || el.hasAttribute('tabindex')) out.push('tarjeta interactiva con controles anidados');
        return out.map((message) => `${el.dataset.bookId}: ${message}`);
      }));
      const button = card.locator('.lecturas-summary-button');
      const title = await card.locator('.lecturas-card__title').textContent();
      await button.focus();
      await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
      await page.locator('#lecturas-book-dialog').waitFor({ state: 'visible' });
      if ((await page.locator('#lecturas-dialog-title').textContent()).trim() !== title.trim()) problems.push('la ficha abierta no corresponde al libro');
      await page.locator('#lecturas-dialog-image').evaluate((el) => el.decode());
      if (i % 2) await page.locator('.lecturas-dialog-close').click();
      else await page.keyboard.press('Escape');
      await page.locator('#lecturas-book-dialog').waitFor({ state: 'hidden' });
      if (!await button.evaluate((el) => el === document.activeElement)) problems.push(`${title}: no se devuelve el foco al botón de apertura`);
    }
  }
  return problems;
}
