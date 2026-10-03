/* Presentación y rutas locales de Familia, Salud y Bienestar; no abre fuentes externas ni recopila información. */
export async function checkWellbeingEntry(page, route) {
  if(route.startsWith('temas.html')) {
    return await page.locator('.tm-wellbeing-nav,#bienestar-ambitos,#bienestar-fuentes,.tm-pillars').count() ? ['Bienestar invade una vista de Patrimonio'] : [];
  }
  if(route!=='bienestar.html') return [];
  const problems=[], start=page.url();
  if(await page.locator('main h1').textContent()!=='Familia, Salud y Bienestar') problems.push('Nombre incorrecto del espacio');
  if(await page.locator('main input,main textarea,main form').count()) problems.push('Bienestar solicita datos');
  const topicLinks=page.locator('#pilares-bienestar a.nv-space-tool-card');
  if(await topicLinks.count()!==4) problems.push('Faltan los cuatro accesos a subsecciones');
  const destinations=await topicLinks.evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  for(const destination of destinations) {
    await page.locator('#pilares-bienestar a[href="'+destination+'"]').focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(new URL(destination,start).href);
    await page.locator('main h1').waitFor();
    if(await page.locator('main h1').count()!==1) problems.push('Subsección sin título propio');
    if(await page.locator('.nv-breadcrumb a[href="temas.html?topic=bienestar"]').count()) problems.push('La subsección conserva el nivel retirado en su ruta');
    if(destination==='respiracion-relajacion.html') {
      await page.locator('main a[href="la-respiracion-como-el-escultor-del-cerebro.html"]').first().click();
      await page.locator('.tm-breathing-essay').waitFor();
      await page.locator('.nv-breadcrumb a[href="respiracion-relajacion.html"]').click();
    }
    await page.locator('.nv-breadcrumb a[href="bienestar.html"]').click();
    await page.locator('#pilares-bienestar').waitFor();
  }
  if(await page.locator('.tm-breathing-essay').count()) problems.push('La portada contiene el artículo completo');
  const sources=page.locator('.bn-sources .tm-wellbeing-source__link');
  if(await sources.count()!==2) problems.push('Faltan los dos índices de consulta');
  for(const source of await sources.all()) {
    if(await source.getAttribute('target')!=='_blank'||await source.getAttribute('rel')!=='noopener noreferrer') problems.push('Enlace externo sin protección');
  }
  if(!await page.locator('#fuentes-bienestar').isVisible()) problems.push('Faltan las fuentes y los límites');
  return problems;
}
