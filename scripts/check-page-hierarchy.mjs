/* Jerarquía de lectura: comprobar el resultado pintado, no solo clases en HTML. */
export async function checkPageHierarchy(page, route) {
  const path = new URL(page.url()).pathname.split('/').pop();
  const homes = ['index.html', 'economia.html', 'patrimonio.html', 'bienestar.html', 'lecturas.html', 'sistema-visual.html'];
  if (homes.includes(path) || route === 'academia.html') return [];
  const parent = path === 'cartera.html' || path === 'mercados.html' ? 'economia.html'
    : path === 'academia.html' || path === 'curso.html' ? 'academia.html'
    : route.includes('topic=bienestar') ? 'bienestar.html'
    : ['colaboradores.html', 'metodologia.html', 'independencia.html', 'que-es-nuvia.html'].includes(path) ? 'index.html'
    : 'patrimonio.html';
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
