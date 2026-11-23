/* Titular, título de pestaña y ruta siguen a la vista elegida. «Noticias y contexto» es la vista base. */
const VISTAS_MERCADOS={
  'Noticias y contexto':{h1:'Mercados y noticias',title:'NUVIA · Mercados y noticias',crumb:['Inicio NUVIA','Economía y finanzas','Mercados y noticias']},
  'Informes':{h1:'Informes',title:'NUVIA · Informes de mercado',crumb:['Inicio NUVIA','Economía y finanzas','Mercados y noticias','Informes']},
  'Mercados y cotizaciones':{h1:'Mercados y cotizaciones',title:'NUVIA · Mercados y cotizaciones',crumb:['Inicio NUVIA','Economía y finanzas','Mercados y noticias','Mercados y cotizaciones']}
};
async function textosDeVista(page,esperado,cuando){
  const out=[];
  const h1=await page.locator('main h1').textContent();
  if(h1!==esperado.h1) out.push(`El titular debe ser «${esperado.h1}» y es «${h1}» ${cuando}`);
  const title=await page.title();
  if(title!==esperado.title) out.push(`El título de pestaña debe ser «${esperado.title}» y es «${title}» ${cuando}`);
  const crumb=await page.locator('.nv-breadcrumb li').allTextContents();
  if(crumb.map(t=>t.trim()).join(' › ')!==esperado.crumb.join(' › ')) out.push(`La ruta debe ser «${esperado.crumb.join(' › ')}» ${cuando}`);
  if(await page.locator('.nv-breadcrumb [aria-current="page"]').count()!==1) out.push(`La ruta debe marcar un solo nivel actual ${cuando}`);
  return out;
}
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
    const rutaCartera=route.includes('vista=models')?'Inicio NUVIA › Economía y finanzas › Análisis de cartera › Carteras modelo':null;
    if(rutaCartera) {
      const ruta=(await page.locator('.nv-breadcrumb li:visible').allTextContents()).map(t=>t.trim()).join(' › ');
      if(ruta!==rutaCartera) problems.push(`La ruta de Carteras modelo debe ser «${rutaCartera}» y es «${ruta}»`);
    }
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
  const esperado=VISTAS_MERCADOS[route.includes('vista=informes')?'Informes':route.includes('vista=cotizaciones')?'Mercados y cotizaciones':'Noticias y contexto'];
  problems.push(...await textosDeVista(page,esperado,'al iniciar el controlador'));
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
      problems.push(...await textosDeVista(page,VISTAS_MERCADOS[name],`en la pestaña ${name}`));
      await page.getByRole('button',{name:'Noticias y contexto',exact:true}).click();
      await page.locator('.markets-secondary-card').first().waitFor({state:'visible'});
      await page.waitForFunction(date=>document.querySelector('[data-macro-updated]')?.textContent===date,originalDate);
      problems.push(...await textosDeVista(page,VISTAS_MERCADOS['Noticias y contexto'],'al volver a Noticias y contexto'));
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
