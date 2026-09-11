/* Entrada informativa: solo rutas locales. No activa cuentas ni el módulo de empresas. */
export async function checkEconomiaEntry(page, route) {
  const problems=[];
  if(route.startsWith('cartera.html')) {
    if(await page.locator('.nv-breadcrumb a[href="economia.html"]').count()!==1) problems.push('Cartera no identifica su espacio de origen');
    const availability = page.locator('.nv-entry-details summary');
    if(!await availability.isVisible()) problems.push('Falta el acceso a disponibilidad y límites');
    else {
      await availability.click();
      if(!await page.locator('.nuvia-analysis-availability').isVisible()) problems.push('La aclaración de disponibilidad no se puede consultar');
      await availability.click();
    }
    if(await page.locator('.nuvia-analysis-tabs a').count()!==3) problems.push('Cartera pierde una de sus tres vistas');
  }
  if(!route.startsWith('mercados.html')) return problems;
  const start=page.url();
  if (route.includes('vista=informes')) {
    const inicial = new URL(start).searchParams.get('tipo')?.toUpperCase() || 'DIARIO';
    await page.waitForFunction(tipo => {
      const ediciones = [...document.querySelectorAll('[data-report-edition]')];
      return ediciones.filter(el => !el.hidden).length === 1 &&
        ediciones.find(el => el.dataset.reportEdition === tipo)?.hidden === false;
    }, inicial, { timeout: 5000 });
    for (const tipo of ['SEMANAL', 'DIARIO']) {
      await page.locator(`[data-report-select="${tipo}"]`).click();
      if (!await page.locator(`[data-report-edition="${tipo}"]`).isVisible()) problems.push(`No se abre el informe ${tipo}`);
      if (await page.locator('[data-report-edition]:visible').count() !== 1) problems.push('Debe verse una sola edición');
      if (await page.locator(`[data-report-select="${tipo}"]`).getAttribute('aria-current') !== 'true') problems.push('La edición seleccionada no está identificada');
    }
  }
  if(await page.locator('main h1').textContent()!=='Mercados y noticias') problems.push('La cabecera no identifica Mercados y noticias');
  if(await page.title()!=='NUVIA · Mercados y noticias') problems.push('El título cambia al iniciar el controlador');
  if(await page.locator('[data-economia-area]').count()!==0) problems.push('La cabecera repite los ámbitos de la portada');
  if(await page.locator('.nv-breadcrumb a[href="economia.html"]').count()!==1) problems.push('Falta el regreso a Economía y Finanzas');
  if(route==='mercados.html') {
    const originalDate=await page.locator('[data-macro-updated]').textContent();
    for(const name of ['Informes','Mercados y cotizaciones']) {
      await page.getByRole('button',{name,exact:true}).click();
      const view=name==='Informes'?'[data-report-reader]':'.markets-lab__quote';
      await page.locator(view).first().waitFor({state:'visible'});
      await page.waitForFunction(name=>{
        const pressed=document.querySelectorAll('.markets-viewnav [aria-pressed="true"]');
        return pressed.length===1 && pressed[0].textContent.trim()===name;
      },name,{timeout:5000});
      await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
      await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
      await page.waitForFunction(date=>document.querySelector('[data-macro-updated]')?.textContent===date,originalDate);
    }
    await page.getByRole('button',{name:'Informes',exact:true}).click();
    await page.locator('[data-report-reader]').waitFor({state:'visible'});
    await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
    await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
    await page.waitForFunction(date=>document.querySelector('[data-macro-updated]')?.textContent===date,originalDate);
  }
  // Desde Informes o Cotizaciones la pestaña debe recuperar la vista de noticias.
  await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
  await page.waitForURL(new URL('mercados.html',start).href);
  await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelectorAll('.markets-macro__item').length===5);
  if(await page.locator('.markets-macro__item').count()!==5) problems.push('El acceso a noticias no conserva sus indicadores');
  if(await page.getByRole('button',{name:'Noticias y contexto',exact:true}).getAttribute('aria-pressed')!=='true') problems.push('El acceso a noticias abre otra vista');
  if(await page.locator('#mercados').evaluate(el=>el.scrollTop!==0)) problems.push('El ancla desplaza el interior del hero y deja un hueco vacío');
  await page.goto(start);
  const ready=route.includes('cotizaciones')?'.markets-lab__quote':route.includes('informes')?'[data-report-reader]':'.markets-secondary-card';
  await page.locator(ready).first().waitFor({state:'visible'});
  return problems;
}
