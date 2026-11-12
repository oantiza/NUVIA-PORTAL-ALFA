/* Ejecutar contra la raíz estática local con BASE_URL. Sin servicios externos. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const base=(process.env.BASE_URL||'http://127.0.0.1:4188').replace(/\/$/,'');
const output=resolve('output/academia-claridad-20261112');await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});const checks=[],errors=[];
try {
for(const width of [1440,768]) {
 const context=await browser.newContext({viewport:{width,height:1000}});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push({width,url:page.url(),error:e.message}));
 const go=async route=>{await page.goto(base+'/'+route,{waitUntil:'networkidle'});await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('main h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));};
 const contains=async(selector,text)=>page.waitForFunction(({selector,text})=>document.querySelector(selector)?.textContent.includes(text),{selector,text});
 await go('academia.html?tab=calculadora#simulador-interes');
 await page.waitForFunction(()=>Math.abs(document.getElementById('simulador-interes').getBoundingClientRect().top)<150);
 assert.ok((await page.locator('#ac-initialCapital').boundingBox()).y<500,'El acceso directo debe mostrar el primer campo');
 assert.equal(await page.locator('iframe').count(),0);
 await page.locator('#ac-expectedReturn').fill('-5');await page.locator('#ac-expectedReturn').blur();
 await contains('.ac-x216 .ac-strong','49.049');
 assert.match(await page.locator('.ac-x209').innerText(),/−32\.951/);
 assert.doesNotMatch(await page.locator('.ac-x209').innerText(),/\+[-−]/);
 const points=await page.locator('.ac-compound-chart polyline').evaluateAll(es=>es.map(e=>e.getAttribute('points')));
 for(const series of points)for(const pair of series.split(' ')){const y=Number(pair.split(',')[1]);assert.ok(y>=10&&y<=204);}
 await page.locator('#ac-expectedReturn').fill('6.5');await page.locator('#ac-expectedReturn').blur();await contains('.ac-x216 .ac-strong','184.488');
 for(const rate of ['-1','0','2']) {await page.locator('#ac-inflationRate').fill(rate);await page.locator('#ac-inflationRate').blur();await contains('.ac-x223',rate+' %');}
 await page.locator('.ac-x206').scrollIntoViewIfNeeded();
 const rectangle=await page.locator('.ac-x206').evaluate(e=>{const p=e.getBoundingClientRect();const s=e.querySelector('[data-nuvia-external-status]').getBoundingClientRect();return {height:p.height,statusBottom:s.bottom-p.top,fullyVisible:s.bottom<=p.bottom+1&&s.top>=p.top};});
 assert.ok(rectangle.fullyVisible,'El aviso de vídeo debe caber completo');
 await page.screenshot({path:resolve(output,`calculadora-${width}.png`),fullPage:true});
 await page.locator('.ac-x206 [data-nuvia-external-load]').click();
 await page.locator('.ac-x206 iframe').waitFor();assert.match(await page.locator('.ac-x206 iframe').getAttribute('src'),/youtube-nocookie\.com\/embed\/N2MQm0Hvji4/);
 checks.push({width,case:'calculadora',rectangle,manualVideo:true,negativeReturn:true,inflationSigns:true});
 await go('academia.html?tab=fundamentos');
 const fundament=await page.locator('.ac-x43').evaluate(e=>{const p=e.getBoundingClientRect();const s=e.querySelector('[data-nuvia-external-status]').getBoundingClientRect();return s.bottom<=p.bottom+1&&s.top>=p.top;});assert.ok(fundament,'Aviso completo en Fundamentos');
 await go('academia.html?tab=inicio');assert.equal(await page.locator('main h1').innerText(),'Recorrido de aprendizaje');assert.equal(await page.locator('.nv-campus-navigation').count(),0);assert.equal(await page.locator('.ac-learning-step').count(),3);assert.ok(await page.locator('.ac-route-photo').isVisible());
 await page.screenshot({path:resolve(output,`recorrido-${width}.png`),fullPage:true});checks.push({width,case:'recorrido',photo:true,steps:3,compactEntry:true});
 await go('academia.html?tab=glosario');
 assert.equal(await page.locator('#glosario-resultados[role="tabpanel"] .ac-glossary-index').count(),1);
 assert.equal(await page.locator('.ac-glossary-index a').count(),13);
 await page.locator('.ac-glossary-index a').filter({hasText:/^Riesgo$/}).click();
 await page.waitForURL(/#termino-conceptos-riesgo$/);await contains('#termino-conceptos-riesgo-contenido','incertidumbre');
 assert.equal(await page.locator('#termino-conceptos-riesgo button').getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('#termino-conceptos-riesgo-contenido').isVisible());
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#termino-conceptos-riesgo button').getAttribute('aria-expanded'),'true');assert.ok(await page.locator('#termino-conceptos-riesgo-contenido').isVisible());
 await page.getByRole('tab',{name:'Indicadores de cartera'}).click();await page.waitForURL(/lista=indicadores$/);
 assert.equal(await page.locator('.ac-glossary-index a').count(),5);
 await page.locator('.ac-glossary-index a').filter({hasText:'Ratio de Sharpe'}).click();
 await page.waitForURL(/#termino-indicadores-ratio-de-sharpe$/);await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('#termino-indicadores-ratio-de-sharpe button').getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('#termino-indicadores-ratio-de-sharpe-contenido').isVisible());
 await page.goBack({waitUntil:'networkidle'});assert.ok(new URL(page.url()).searchParams.get('lista')==='indicadores');
 await page.locator('.ac-glossary-index a').filter({hasText:'Ratio de Sharpe'}).click();await page.locator('#termino-indicadores-ratio-de-sharpe-contenido').waitFor({state:'visible'});
 await page.screenshot({path:resolve(output,`glosario-${width}.png`),fullPage:true});checks.push({width,case:'glosario',concepts:13,indicators:5,reload:true,back:true});
 await go('curso.html');await page.locator('.curso-btn-calcular').click();await contains('.curso-panel[aria-live]','550');
 const results=await page.locator('.curso-resultado strong').allTextContents();assert.deepEqual(results.map(t=>t.replaceAll('\u00a0',' ').trim()),['550 €','25 %','12.300 €','1,5']);
 assert.doesNotMatch(await page.locator('#leccion-mapa').innerText(),/Primera prioridad|reducir las más caras|objetivo inicial|Conviene recuperar/i);
 for(let chapter=2;chapter<=5;chapter++){await page.locator('.curso-tab').nth(chapter-1).click();await page.waitForURL(new RegExp('capitulo='+chapter+'$'));await contains('.curso-cap__kicker','Capítulo '+chapter+' de 5');assert.equal(await page.locator('.curso-progreso').count(),0);assert.equal(await page.locator('.curso-pasos a').count(),2);assert.match(await page.locator('.curso-sin-practica').innerText(),/actividades interactivas están disponibles en el capítulo 1/);assert.ok(await page.locator(`a[href*="capitulo-0${chapter}-"][download]`).count());await page.reload({waitUntil:'networkidle'});await contains('.curso-cap__kicker','Capítulo '+chapter+' de 5');}
 await page.goBack({waitUntil:'networkidle'});await contains('.curso-cap__kicker','Capítulo 4 de 5');
 await page.locator('.curso-tab').first().click();await page.getByRole('button',{name:'Marcar vídeo como visto'}).click();await contains('.curso-progreso strong','20 %');await page.reload({waitUntil:'networkidle'});await contains('.curso-progreso strong','0 %');
 await page.screenshot({path:resolve(output,`curso-${width}.png`),fullPage:true});checks.push({width,case:'curso',fourCalculations:true,descriptive:true,chapters:5,reload:true,back:true,temporaryProgress:true});
 await context.close();
}
assert.deepEqual(errors,[]);
} finally {await browser.close();await writeFile(resolve(output,'browser.json'),JSON.stringify({base,checks,errors},null,2));}
console.log(JSON.stringify({checks:checks.length,errors},null,2));
