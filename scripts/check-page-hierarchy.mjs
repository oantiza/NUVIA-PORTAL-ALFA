/* Jerarquía pintada del ecosistema, revisión del 12-11-2026.
   Un h1, un acceso a su padre y una sola entrada siguen siendo obligatorios.
   La identidad sustituye el antiguo límite universal 36/28 y el fondo blanco;
   cada título y superficie tienen un valor independiente y exacto. */
import { PORTADAS, padreDe } from './paginas.mjs';
import { TITLE_CONTRACT, SURFACE_CONTRACT } from './nuvia-visual-contract.mjs';

export async function checkPageHierarchy(page, route) {
  const url = new URL(page.url());
  const path = url.pathname.split('/').pop();
  const problems = [];
  if (await page.locator('main h1').count() !== 1) problems.push('La vista debe tener un único título principal');
  const academyHome = path === 'academia.html' && (!url.searchParams.get('tab') || url.searchParams.get('tab') === 'portada');
  if (PORTADAS.includes(path) || academyHome) {
    if (await page.locator('main .nv-entry').count()) problems.push('La portada no puede mezclarse con una entrada de página hija');
    return problems;
  }

  /* El recorrido conserva sus materiales y adopta la entrada de página hija.
     Se comprueban foto, pasos, regreso y el mismo contrato visual del interior. */
  if (path === 'academia.html' && url.searchParams.get('tab') === 'inicio') {
    for (const [selector, count] of [
      ['#academy.nv-entry', 1],
      ['.ac-route-photo img', 1],
      ['#ruta-aprendizaje .ac-learning-step', 3],
      ['#academy .nv-breadcrumb a[href="index.html"]', 1],
    ]) if (await page.locator(selector).count() !== count) problems.push(`Recorrido original: se esperan ${count} elementos ${selector}`);
  }

  const parent = route.includes('topic=bienestar') ? 'bienestar.html' : (padreDe(path) ?? 'patrimonio.html');
  if (await page.locator('main .nv-entry').count() !== 1) problems.push('Debe haber una sola entrada de página hija');
  if (await page.locator(`.nv-breadcrumb a[href="${parent}"]`).count() !== 1) problems.push(`Falta el regreso al padre canónico: ${parent}`);
  problems.push(...await page.evaluate(({ titles, surfaces }) => {
    const out = [], heading = document.querySelector('main h1'), entry = document.querySelector('main .nv-entry');
    if (!entry || !heading) return ['Falta la entrada o el título'];
    if (!entry.contains(heading)) out.push('El título principal queda fuera de la entrada');
    const rule = titles.findLast(([selector]) => heading.matches(selector));
    if (document.body.hasAttribute('data-eco-theme') && !rule) out.push('La identidad de esta entrada no tiene contrato tipográfico');
    if (rule) {
      let size = rule[1];
      for (const [maxWidth, value] of rule[2]) if (innerWidth <= maxWidth) size = value;
      const probe = document.createElement('span');
      probe.style.cssText = `position:absolute;display:none;font-size:${size};font-family:var(--nv-font-serif);font-weight:${rule[3] || 400};`;
      heading.append(probe);
      try {
        for (const prop of ['fontSize', 'fontFamily', 'fontWeight']) {
          if (getComputedStyle(heading)[prop] !== getComputedStyle(probe)[prop]) out.push(`La entrada incumple ${prop} de su identidad`);
        }
      } finally { probe.remove(); }
    } else if (parseFloat(getComputedStyle(heading).fontSize) > (innerWidth <= 1120 ? 28 : 36) + .1) out.push('El título de la página hija supera su escala original');
    if (getComputedStyle(entry).backgroundImage !== 'none') out.push('La entrada hija conserva un hero de portada');
    const surface = surfaces.findLast(([selector, property]) => property === 'backgroundColor' && entry.matches(selector));
    if (!surface) out.push('La entrada no tiene superficie declarada');
    else {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;display:none;';
      probe.style.backgroundColor = surface[2];
      entry.append(probe);
      try {
        if (getComputedStyle(entry).backgroundColor !== getComputedStyle(probe).backgroundColor) out.push('La entrada pierde la superficie de su identidad');
      } finally { probe.remove(); }
    }
    if (document.querySelector('.nv-portada-lab')) out.push('El laboratorio repite una segunda presentación');
    return out;
  }, { titles: TITLE_CONTRACT, surfaces: SURFACE_CONTRACT }));
  return problems;
}
