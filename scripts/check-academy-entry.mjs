/* Rutas y estados locales; no reproduce vídeos ni consulta servicios externos. */
export async function checkAcademyEntry(page, route) {
  if(!route.startsWith('academia.html') && route!=='curso.html') return [];
  const problems=[], start=page.url();
  if(route.startsWith('academia.html')) {
    const titles={inicio:'Academia NUVIA',esenciales:'Conocimientos esenciales',cursos:'Cursos',fundamentos:'Fundamentos de inversión',activos:'Activos financieros',calculadora:'Interés compuesto',glosario:'Glosario financiero'};
    const title=titles[new URL(start).searchParams.get('tab')||'inicio'];
    if(await page.title()!=='NUVIA · '+title || (await page.locator('main h1').textContent()).trim()!==title) problems.push('La vista de Academia no tiene título propio');
  }
  if(route==='academia.html') {
    if(await page.locator('.ac-learning-step').count()!==3) problems.push('Faltan los tres pasos opcionales');
    for(const tab of ['fundamentos','activos','calculadora','glosario']) {
      await page.locator(`#ruta-aprendizaje a[href="academia.html?tab=${tab}"]`).focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(new URL(`academia.html?tab=${tab}`,start).href);
      await page.locator('.ac-learning-back a').waitFor({state:'visible'});
      await page.locator('.ac-learning-back a').click();
      await page.waitForURL(new URL('academia.html',start).href);
      await page.locator('.ac-learning-step').first().waitFor({state:'visible'});
    }
    await page.goto(start);
    await page.locator('.ac-x10').waitFor({state:'visible'});
  } else if(route.startsWith('academia.html')) {
    await page.locator('.ac-learning-back a').click();
    await page.waitForURL(new URL('academia.html',start).href);
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    await page.locator('.home26-plate__figure').waitFor({state:'visible'});
    await page.goto(start);
    await page.locator('.ac-learning-back a').waitFor({state:'visible'});
  } else {
    if((await page.locator('.curso-progreso strong').textContent()).trim()!=='0 %') problems.push('El curso arranca con progreso ficticio');
    await page.getByRole('button',{name:'Marcar vídeo como visto →',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.curso-progreso strong')?.textContent.trim()==='20 %',null,{timeout:3000});
    await page.reload();
    await page.locator('.curso-progreso strong').waitFor({state:'visible'});
    if((await page.locator('.curso-progreso strong').textContent()).trim()!=='0 %') problems.push('La recarga no coincide con el aviso de estado temporal');
    for(let i=1;i<5;i++) {
      await page.locator('.curso-tab').nth(i).click();
      await page.waitForFunction(()=>document.querySelector('.curso-cap__note')?.textContent.includes('sin seguimiento'),null,{timeout:3000});
      if(await page.locator('.curso-progreso').count()) problems.push('Capítulo sin actividades muestra progreso');
      if(await page.locator('.curso-notas,.curso-directrices').count()) problems.push('Se reutilizan apuntes del capítulo 1 en otro capítulo');
      if(!await page.locator('.curso-apuntes-disponibles').isVisible()) problems.push('Falta indicar dónde están los apuntes propios');
      if(await page.locator('.curso-btn-marcar,.curso-btn-reset').count()) problems.push('Capítulo sin actividades ofrece marcas o reinicio');
      if(await page.locator('.curso-pasos a').count()!==2) problems.push('Capítulo sin actividades enlaza secciones inexistentes');
      for(const link of await page.locator('.curso-pasos a').all()) {
        if(await page.locator(await link.getAttribute('href')).count()!==1) problems.push('Destino de capítulo ausente');
      }
    }
    await page.locator('.ac-learning-back a').click();
    await page.waitForURL(new URL('academia.html#ruta-aprendizaje',start).href);
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    await page.goto(start);
    await page.locator('.curso-progreso strong').waitFor({state:'visible'});
  }
  return problems;
}
