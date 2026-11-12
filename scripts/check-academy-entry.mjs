/* Rutas y estados locales; no reproduce vídeos ni consulta servicios externos. */
export async function checkAcademyEntry(page, route) {
  if(!route.startsWith('academia.html') && route!=='curso.html') return [];
  const problems=[], start=page.url();
  const requested=new URL(start).searchParams.get('tab');
  const tab=requested==='interes'?'calculadora':requested||'portada';
  if(route.startsWith('academia.html')) {
    const titles={portada:'Academia NUVIA',inicio:'Recorrido de aprendizaje',esenciales:'Conceptos esenciales',cursos:'Cursos',fundamentos:'Fundamentos de inversión',activos:'Activos financieros',calculadora:'Interés compuesto',glosario:'Glosario financiero',pib:'El PIB, explicado desde cero'};
    const title=titles[tab];
    const heading=tab==='portada'?'Saber es patrimonio.':title;
    if(await page.title()!=='NUVIA · '+title || (await page.locator('main h1').innerText()).replace(/\s+/g,' ').trim()!==heading) problems.push('La vista de Academia no tiene título propio');
    if(await page.locator('main').count()!==1 || await page.locator('main h1').count()!==1) problems.push('Academia duplica el contenido principal');
    if(await page.locator('main iframe').count()) problems.push('Academia carga un vídeo sin activación manual');
    if(await page.locator('body.web-page').count()!==Number(tab==='portada')) problems.push('El reset de la portada invade una vista interior');
    if(tab!=='portada' && await page.locator('.nv-campus-navigation').count()) problems.push('La entrada duplica la navegación local');
  }
  if(route.startsWith('academia.html') && tab==='portada') {
    if(await page.locator('#academy,.ac-learning-step').count()) problems.push('La portada muestra simultáneamente el recorrido anterior');
    for(const next of ['esenciales','cursos','fundamentos','activos','calculadora','glosario']) {
      const link=page.locator(`.nv-academia-home a[href^="academia.html?tab=${next}"]`).first();
      const destination=new URL(await link.getAttribute('href'),start).href;
      await link.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(destination);
      await page.locator('.ac-learning-back a').waitFor({state:'visible'});
      await page.locator('.ac-learning-back a').click();
      await page.waitForURL(new URL('academia.html',start).href);
      await page.locator('.ac-opening').waitFor({state:'visible'});
    }
    await page.locator('.nv-academia-home a[href="academia.html?tab=inicio#ruta-aprendizaje"]').click();
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    await page.reload();
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    if(await page.locator('.ac-learning-step').count()!==3) problems.push('El recorrido completo no se conserva al recargar');
    await page.goto(start);
    await page.locator('.ac-opening').waitFor({state:'visible'});
  } else if(route.startsWith('academia.html') && tab==='inicio') {
    if(await page.locator('.ac-learning-step').count()!==3) problems.push('Faltan los tres pasos opcionales');
    for(const next of ['fundamentos','activos','calculadora','glosario']) {
      await page.locator(`#ruta-aprendizaje a[href="academia.html?tab=${next}"]`).focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(new URL(`academia.html?tab=${next}`,start).href);
      await page.locator('.ac-learning-back a').waitFor({state:'visible'});
      await page.locator('.ac-learning-back a').click();
      await page.waitForURL(new URL('academia.html',start).href);
      await page.locator('.nv-academia-home a[href="academia.html?tab=inicio#ruta-aprendizaje"]').click();
      await page.locator('.ac-learning-step').first().waitFor({state:'visible'});
    }
    await page.goto(start);
    await page.locator('.ac-x10').waitFor({state:'visible'});
  } else if(route.startsWith('academia.html')) {
    await page.locator('.ac-learning-back a').click();
    await page.waitForURL(new URL('academia.html',start).href);
    await page.locator('.ac-opening').waitFor({state:'visible'});
    await page.locator('.nv-academia-home a[href="academia.html?tab=inicio#ruta-aprendizaje"]').click();
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    await page.locator('.ac-route-photo').waitFor({state:'visible'});
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
    await page.waitForURL(new URL('academia.html?tab=inicio#ruta-aprendizaje',start).href);
    await page.locator('#ruta-aprendizaje').waitFor({state:'visible'});
    await page.goto(start);
    await page.locator('.curso-progreso strong').waitFor({state:'visible'});
  }
  return problems;
}
