/* Entrada informativa: solo rutas locales. No activa cuentas ni el módulo de empresas. */
export async function checkEconomiaEntry(page, route) {
  const problems=[];
  if(route.startsWith('cartera.html')) {
    if(await page.locator('main a[href="mercados.html"]').count()!==1) problems.push('Cartera no identifica su espacio de origen');
    if(!await page.locator('.nuvia-analysis-availability').isVisible()) problems.push('Falta la aclaración de disponibilidad');
    if(await page.locator('.nuvia-analysis-tabs a').count()!==3) problems.push('Cartera pierde una de sus tres vistas');
  }
  if(!route.startsWith('mercados.html')) return problems;
  const start=page.url();
  if(await page.locator('main h1').textContent()!=='Mercados y noticias') problems.push('La cabecera no identifica Mercados y noticias');
  if(await page.title()!=='NUVIA · Mercados y noticias') problems.push('El título cambia al iniciar el controlador');
  if(await page.locator('[data-economia-area]').count()!==0) problems.push('La cabecera repite los ámbitos de la portada');
  if(await page.locator('.nv-breadcrumb a[href="economia.html"]').count()!==1) problems.push('Falta el regreso a Economía y Finanzas');
  if(route==='mercados.html') {
    const originalDate=await page.locator('[data-macro-updated]').textContent();
    for(const name of ['Informes','Mercados y cotizaciones']) {
      await page.getByRole('button',{name,exact:true}).click();
      const view=name==='Informes'?'.markets-archive__empty':'.markets-lab__quote';
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
    await page.locator('.markets-archive__empty').waitFor({state:'visible'});
    await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
    await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
    await page.waitForFunction(date=>document.querySelector('[data-macro-updated]')?.textContent===date,originalDate);
  }
  // Desde Informes o Cotizaciones la pestaña debe recuperar la vista de noticias.
  await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
  await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
  if(await page.locator('.markets-macro__item').count()!==5) problems.push('El acceso a noticias no conserva sus indicadores');
  if(await page.getByRole('button',{name:'Noticias y contexto',exact:true}).getAttribute('aria-pressed')!=='true') problems.push('El acceso a noticias abre otra vista');
  if(await page.locator('#mercados').evaluate(el=>el.scrollTop!==0)) problems.push('El ancla desplaza el interior del hero y deja un hueco vacío');
  await page.goto(start);
  const ready=route.includes('cotizaciones')?'.markets-lab__quote':route.includes('informes')?'.markets-archive__empty':'.markets-secondary-card';
  await page.locator(ready).first().waitFor({state:'visible'});
  return problems;
}
