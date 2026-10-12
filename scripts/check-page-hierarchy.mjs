/* Jerarquía de lectura: comprobar el resultado pintado, no solo clases en HTML.
   El padre canónico de cada página se declara en scripts/paginas.mjs. */
import { PORTADAS, padreDe } from './paginas.mjs';
export async function checkPageHierarchy(page, route) {
  const path = new URL(page.url()).pathname.split('/').pop();
  if (PORTADAS.includes(path) || route === 'academia.html') return [];
  const parent = route.includes('topic=bienestar') ? 'bienestar.html' : (padreDe(path) ?? 'patrimonio.html');
  const problems = [];
  if (await page.locator('main .nv-entry').count() !== 1) problems.push('Debe haber una sola entrada de página hija');
  if (await page.locator(`.nv-breadcrumb a[href="${parent}"]`).count() !== 1) problems.push(`Falta el regreso al padre canónico: ${parent}`);
  problems.push(...await page.evaluate(() => {
    const out = [], heading = document.querySelector('main h1'), entry = document.querySelector('main .nv-entry');
    if (!entry || !heading) return ['Falta la entrada o el título'];
    if (document.querySelectorAll('main h1').length !== 1) out.push('Hay más de un título principal');
    const font = parseFloat(getComputedStyle(heading).fontSize);
    if (font > (innerWidth <= 1120 ? 28 : 36) + .1) out.push('El título de la página hija supera su escala');
    if (getComputedStyle(entry).backgroundImage !== 'none') out.push('La entrada hija conserva un hero de portada');
    if (getComputedStyle(entry).backgroundColor !== 'rgb(255, 255, 255)') out.push('La entrada hija pierde su superficie común');
    if (document.querySelector('.nv-portada-lab')) out.push('El laboratorio repite una segunda presentación');
    return out;
  }));
  return problems;
}
