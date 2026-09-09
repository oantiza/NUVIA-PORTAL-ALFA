/* Recorrido únicamente por páginas locales ya desarrolladas. No usa cuentas ni envía datos. */
export async function checkPatrimonioEntry(page, route) {
  const problems=[];
  if (route==='temas.html') {
    const start=page.url();
    const cards=page.locator('.nv-space-tool-card');
    if(await cards.count()!==4) return ['Patrimonio no muestra sus cuatro ámbitos'];
    if(await page.locator('main h1').textContent()!=='Patrimonio') problems.push('La entrada de Patrimonio muestra otro tema');
    if(!new URL(start).pathname.endsWith('/patrimonio.html')) problems.push('El acceso antiguo no lleva a la Home canónica');
    if(await page.title()!=='NUVIA · Patrimonio') problems.push('Título de pestaña incorrecto para Patrimonio');
    if(await page.locator('main input,main textarea,main form').count()) problems.push('La portada solicita datos');
    const routes=[['vivienda','vivienda.html'],['impuestos','fiscalidad.html'],['jubilacion','jubilacion.html'],['planificacion','temas.html?topic=planificacion-patrimonial']];
    for (const [area,destination] of routes) {
      const link=page.locator(`.nv-space-tool-card[href="${destination}"]`);
      if(await link.getAttribute('href')!==destination) {problems.push(`Destino incorrecto: ${area}`);continue;}
      await link.click();
      await page.waitForURL(new URL(destination,start).href);
      await page.locator('main h1').waitFor({state:'visible'});
      const back=page.locator('.nv-breadcrumb a[href="patrimonio.html"]').first();
      if(!await back.count()) {problems.push(`Sin regreso a Patrimonio: ${area}`);await page.goto(start);}
      else await back.click();
      await page.waitForURL(start);
      await page.locator('.nv-space-tool-card').first().waitFor({state:'visible'});
    }
    for (const [alias,target] of [['vivienda','vivienda.html'],['vivienda-coste-vida','vivienda.html'],['fiscalidad','fiscalidad.html'],['mis-impuestos','fiscalidad.html']]) {
      await page.goto(new URL('temas.html?topic='+alias,start).href);
      await page.waitForURL(new URL(target,start).href);
      await page.locator('main h1').waitFor({state:'visible'});
    }
    await page.goto(start);
    await page.locator('.nv-space-tool-card').first().waitFor({state:'visible'});
  }
  if(route==='temas.html?topic=planificacion-patrimonial') {
    if(await page.locator('.tm-overview__notice').count()!==1 || await page.locator('.tm-card__tag.nv-tag--pending').count()!==3) problems.push('Planificación no conserva su estado en preparación');
    if(await page.locator('main input,main textarea,main form').count()) problems.push('Planificación expone un formulario aplazado');
    if(await page.locator('.tm-back[href="patrimonio.html"]').count()!==1) problems.push('Planificación no ofrece regreso al espacio');
  }
  if(route==='temas.html?topic=jubilacion') {
    if(!new URL(page.url()).pathname.endsWith('/jubilacion.html')) problems.push('El acceso antiguo no llega a Jubilación');
    if(await page.locator('#familia-legado').count()!==1) problems.push('Se ha perdido el contenido de Familia y legado');
  }
  if(route==='temas.html?topic=bienestar') {
    if(await page.locator('#tema-titulo').textContent()!=='Cuerpo, mente y salud') problems.push('El contenido de Bienestar no tiene título propio');
    if(await page.locator('.tm-pills,.tm-back,#patrimonio-ambitos').count()) problems.push('Bienestar vuelve a mostrar navegación interna de Patrimonio');
  }
  return problems;
}
