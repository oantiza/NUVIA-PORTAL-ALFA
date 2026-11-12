/**
 * Regresión funcional del sitio integrado contra una copia compilada anterior.
 * Ejecución: node scripts/ecosistema/verificar-funciones.mjs
 * Opcional: BASELINE_URL, PREVIEW_URL, FUNCTION_REPORT, ONLY_CASE.
 * Dos contextos nuevos por recorrido; sin perfil del usuario y sin red externa.
 * No simula respuestas de APIs, ni sustituye motores, contenido o cálculos.
 * Requiere un snapshot local original compilado servido por BASELINE_URL.
 * Es una comprobación local de esta migración; no forma parte de CI.
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const BASELINE = process.env.BASELINE_URL || 'http://127.0.0.1:4186';
const PREVIEW = process.env.PREVIEW_URL || 'http://127.0.0.1:4189';
assert.notEqual(BASELINE,PREVIEW,'La referencia y el sitio integrado deben tener servidores diferentes');
for (const url of [BASELINE, PREVIEW]) {
  assert.equal(url.endsWith('/'), false, 'Las URLs de los servidores no llevan barra final');
  assert(['127.0.0.1','localhost'].includes(new URL(url).hostname), 'Solo se permiten servidores locales');
}
const companyOriginal = await (await fetch(BASELINE + '/company-analysis/')).text();
assert.match(companyOriginal, /<script[^>]+src="\.\/assets\/[^"]+\.js"/, 'La referencia de Empresas debe ser una compilación real anterior');
assert.doesNotMatch(companyOriginal, /src\/alfa\/main\.jsx/, 'No se acepta el código JSX fuente como referencia');
assert.equal((await (await fetch(BASELINE+'/vivienda.html')).text()).includes('data-eco-theme='),false,'La referencia debe servir los archivos originales');
assert.equal((await (await fetch(PREVIEW+'/vivienda.html')).text()).includes('data-eco-theme='),true,'La maqueta debe servir la presentación nueva');
const REPORT = resolve(ROOT, process.env.FUNCTION_REPORT || 'output/integracion-ecosistema-20261112/funciones.json');
const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const sha = s => createHash('sha256').update(s).digest('hex');
const normalError = s => clean(s).replace(/http:\/\/(?:127\.0\.0\.1|localhost):\d+/g, 'http://local');
const settle = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
// textContent compara contenido, no el text-transform decorativo de las hojas.
// La visibilidad/expansión y los estados se comprueban explícitamente aparte.
const texts = async (p, selector) => p.locator(selector).evaluateAll(nodes => nodes.filter(n => n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden').map(n => (n.textContent || '').replace(/\s+/g, ' ').trim()));
const values = async p => p.locator('main input, main select').evaluateAll(nodes => nodes.filter(n => n.getClientRects().length).map(n => ({id:n.id,name:n.name,type:n.type,value:n.value,checked:['checkbox','radio'].includes(n.type)?n.checked:undefined})));
async function fill(p, selector, value) { await p.locator(selector).fill(String(value)); await p.locator(selector).press('Tab'); await settle(p); }
async function open(p, url, selector) { await p.goto(url, {waitUntil:'domcontentloaded'}); await p.locator(selector).first().waitFor({state:'visible'}); await settle(p); }
async function click(p, locator) { await locator.click(); await settle(p); }
async function blockSnapshot(p, selector) { const text = (await texts(p, selector)).join(' | '); return {text, sha256:sha(text)}; }

const cases = [
  {id:'vivienda', description:'Hipoteca, cambios de supuestos, amortización y cinco vistas', async run(p,base) {
    await open(p,base+'/vivienda.html','input[name="purchasePrice"]');
    const original=await texts(p,'.viv-result-grid .viv-figure__value');
    assert(original.length >= 5,'No se han renderizado los resultados de hipoteca');
    await fill(p,'input[name="purchasePrice"]',420000);
    await fill(p,'input[name="downPayment"]',84000);
    await fill(p,'input[name="years"]',20);
    await fill(p,'input[name="fixedRate"]',3.1);
    await click(p,p.getByRole('button',{name:'Fija',exact:true}));
    const changed=await texts(p,'.viv-result-grid .viv-figure__value');
    assert.notDeepEqual(changed,original,'La hipoteca no recalcula');
    const mortgage={original,changed,fields:await values(p),annualRows:await texts(p,'.viv-table__row')};
    assert.equal(mortgage.annualRows.length,20,'La amortización no refleja el nuevo plazo');
    const tabs=[];
    for (const name of ['Ofertas','Compra o alquiler','Amortización','Presupuesto','Hipoteca']) {
      const btn=p.locator('main .viv-pill--dark').filter({hasText:new RegExp('^'+name+'$')});
      await click(p,btn); assert.equal(await btn.getAttribute('aria-pressed'),'true');
      tabs.push({name,headings:await texts(p,'main h2,main h3'),fields:await values(p),results:await texts(p,'.viv-figure__value')});
    }
    return {mortgage,tabs};
  }},
  {id:'jubilacion', description:'Pensión, ahorros, supuestos, territorio y unidades del resultado', async run(p,base) {
    await open(p,base+'/jubilacion.html?territorio=bizkaia','#jb-pension');
    const original=await texts(p,'.jb-live__num,.jb-eq__tile strong');
    await fill(p,'#jb-pension',2600);
    await fill(p,'input[aria-label="Tu edad actual (valor exacto)"]',67);
    await click(p,p.locator('.jb-stepper__btn').nth(1));
    await fill(p,'#jb-liquidez',45000);
    await click(p,p.locator('.jb-stepper__btn').nth(3));
    await fill(p,'input[aria-label="Rentabilidad anual de tus ahorros (valor exacto)"]',4);
    const changed=await texts(p,'.jb-live__num,.jb-eq__tile strong');
    assert.notDeepEqual(changed,original,'Jubilación no recalcula los datos modificados');
    await p.locator('.jb-table-wrap > summary').click();
    const bizkaia={values:changed,table:await texts(p,'.jb-table tbody tr'),disclaimer:await texts(p,'.jb-disclaimer')};
    assert(bizkaia.table.length>10,'No se ha desplegado la tabla de jubilación');
    await click(p,p.getByRole('radio',{name:'Estatal',exact:true}));
    await p.locator('#jb-terr-ccaa').selectOption('madrid'); await settle(p);
    assert(new URL(p.url()).searchParams.get('ccaa')==='madrid','No se propaga Madrid en la URL');
    const madrid={values:await texts(p,'.jb-live__num,.jb-eq__tile strong'),territory:await texts(p,'.jb-terr__norma'),disclaimer:await texts(p,'.jb-disclaimer'),links:await p.locator('a[data-jub-territorio]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')))};
    assert.notDeepEqual(madrid.values,changed,'El cambio de territorio no afecta al resultado fiscal');
    await click(p,p.getByRole('radio',{name:'Euros de cada año',exact:true}));
    const nominal={selected:await texts(p,'.jb-results__tools [aria-checked="true"]'),table:await texts(p,'.jb-table tbody tr')};
    return {original,bizkaia,madrid,nominal};
  }},
  {id:'academia_compuesto', description:'Interés compuesto: importes y trazados antes y después de cambiar datos', async run(p,base) {
    await open(p,base+'/academia.html?tab=calculadora','#ac-initialCapital');
    const snapshot=async()=>({results:await texts(p,'.ac-x209 > .gu-stack > .gu-grid-3'),notes:await texts(p,'.ac-x223'),polylines:await p.locator('.ac-compound-chart polyline').evaluateAll(ns=>ns.map(n=>n.getAttribute('points'))),inputs:await values(p)});
    const before=await snapshot();
    await fill(p,'#ac-initialCapital',25000);await fill(p,'#ac-periodicContribution',350);await fill(p,'#ac-expectedReturn',4.5);
    await p.locator('#ac-contributionFrequency').selectOption('yearly');await settle(p);
    await p.locator('#ac-years').fill('18');await settle(p);
    const after=await snapshot();
    assert.notDeepEqual(before.results,after.results,'No se actualiza el capital del simulador');
    assert.notDeepEqual(before.polylines,after.polylines,'No se actualiza el gráfico');
    assert(after.polylines.every(s=>s && !s.includes('NaN')),'Trazado vacío o no numérico');
    return {before,after};
  }},
  {id:'academia_glosario_activos', description:'Acordeones, conceptos/indicadores y tres grupos de activos', async run(p,base) {
    await open(p,base+'/academia.html?tab=glosario','.ac-x229');
    const glossary=[];
    for(let i=0;i<2;i++){
      await click(p,p.locator('.ac-x227 .ac-tab').nth(i));
      const item=p.locator('.ac-x229').first();await click(p,item);
      assert.equal(await item.getAttribute('aria-expanded'),'true');
      const entry=await blockSnapshot(p,'.ac-x228:first-child');
      await click(p,item);assert.equal(await item.getAttribute('aria-expanded'),'false');
      glossary.push({tab:await texts(p,'.ac-x227 .is-active'),entry,closedBodies:await p.locator('.ac-accordion__body.is-closed').count()});
    }
    await open(p,base+'/academia.html?tab=activos','.ac-subtab');
    const assets=[];
    for(let i=0;i<3;i++){
      await click(p,p.locator('.ac-subtab').nth(i));
      assert.equal(await p.locator('.ac-subtab.is-active').count(),1);
      assets.push({selected:await texts(p,'.ac-subtab.is-active'),content:await blockSnapshot(p,'[role="tabpanel"]')});
    }
    assert(new Set(assets.map(s=>s.content.sha256)).size===3,'Los grupos no cambian de contenido');
    return {glossary,assets};
  }},
  {id:'curso', description:'Cinco capítulos, cálculo, caso práctico, cuestionario y progreso temporal', async run(p,base) {
    await open(p,base+'/curso.html','.curso-tab');
    const chapters=[];
    for(let i=0;i<5;i++){
      await click(p,p.locator('.curso-tab').nth(i));
      assert.equal(await p.locator('.curso-tab.is-active').count(),1);
      chapters.push({selected:await texts(p,'.curso-tab.is-active'),heading:await texts(p,'.curso-cap h2'),downloads:await p.locator('main a[href$=".pdf"]').evaluateAll(ns=>ns.map(n=>({text:n.textContent.trim(),href:n.getAttribute('href')}))),interactive:await p.locator('.curso-btn-calcular').count()});
    }
    assert(new Set(chapters.map(c=>c.heading.join())).size===5,'Los cinco capítulos no son distintos');
    await click(p,p.locator('.curso-tab').first());
    const before=await texts(p,'.curso-resultados');
    const amounts=[4100,1800,500,200,9000,25000,7000];
    for(let i=0;i<amounts.length;i++)await fill(p,'.curso-campo input >> nth='+i,amounts[i]);
    await click(p,p.locator('.curso-btn-calcular'));
    const calculated={results:await texts(p,'.curso-resultados'),context:await texts(p,'.curso-prioridad'),progress:await texts(p,'.curso-progreso strong')};
    assert.notDeepEqual(calculated.results,before,'El mapa no calcula');
    await click(p,p.locator('.curso-opcion').nth(2));
    const caseStudy=await texts(p,'.curso-feedback');assert(caseStudy.length===1,'No se explica el caso seleccionado');
    const check=p.getByRole('button',{name:'Comprobar respuestas',exact:false});
    assert(await check.isDisabled(),'El quiz incompleto debe seguir deshabilitado');
    for(const [i,answer] of [1,1,0,0,1].entries()){
      await p.locator('.curso-pregunta').nth(i).locator('input[type="radio"]').nth(answer).check();await settle(p);
    }
    assert(await check.isEnabled());await click(p,check);
    const quiz={score:await texts(p,'.curso-puntuacion'),explanations:await texts(p,'.curso-explicacion'),correct:await p.locator('.curso-radio.is-correct').count(),progress:await texts(p,'.curso-progreso strong')};
    assert.equal(quiz.correct,5);assert.equal(quiz.explanations.length,5);
    return {chapters,before,calculated,caseStudy,quiz};
  }},
  {id:'mercados', description:'Vistas, informes diario/semanal, archivo y filtros locales de cotizaciones', async run(p,base) {
    await open(p,base+'/mercados.html','.markets-viewnav__tab');
    const initial=await texts(p,'.markets-viewnav__tab.is-active');
    await click(p,p.locator('.markets-viewnav__tab').filter({hasText:/^Informes$/}));
    await p.locator('[data-report-edition="DIARIO"]').waitFor({state:'visible'});
    const daily=await blockSnapshot(p,'[data-report-edition="DIARIO"]');
    await click(p,p.locator('[data-report-select="SEMANAL"]'));
    assert(await p.locator('[data-report-edition="SEMANAL"]').isVisible());
    assert(!(await p.locator('[data-report-edition="DIARIO"]').isVisible()));
    const weekly=await blockSnapshot(p,'[data-report-edition="SEMANAL"]');assert.notEqual(daily.sha256,weekly.sha256);
    await p.locator('.nv-reports-archive > summary').click();
    const archive=await p.locator('.nv-reports-archive a').evaluateAll(ns=>ns.map(n=>({text:n.textContent.trim(),href:n.getAttribute('href')})));
    await click(p,p.locator('.markets-viewnav__tab').filter({hasText:/^Mercados y cotizaciones$/}));
    await p.locator('input[placeholder="Buscar empresa o ticker"]').waitFor({state:'visible'});
    await fill(p,'input[placeholder="Buscar empresa o ticker"]','Iberdrola');
    const filtered={headings:await texts(p,'#markets-components-title'),rows:await texts(p,'.markets-lab table tbody tr,.markets-lab__table tbody tr'),query:await p.locator('input[type="search"]').inputValue()};
    assert(filtered.rows.length>0,'La búsqueda local de Iberdrola no devuelve filas');
    await fill(p,'input[placeholder="Buscar empresa o ticker"]','zzzz_sin_coincidencia');
    await p.locator('.markets-lab__empty').waitFor({state:'visible'});
    await click(p,p.getByRole('button',{name:'Limpiar búsqueda y sector',exact:true}));
    assert.equal(await p.locator('input[placeholder="Buscar empresa o ticker"]').inputValue(),'');
    return {initial,daily,weekly,archive,filtered,finalTab:await texts(p,'.markets-viewnav__tab.is-active')};
  }},
  {id:'cartera_modelos', description:'Vistas de cartera y cuatro modelos; estado honesto sin catálogo remoto', async run(p,base) {
    await open(p,base+'/cartera.html','#vista-models');
    // El importe es un campo dinámico, oculto legítimamente sin posiciones.
    await p.locator('#constructor #importe-cartera').waitFor({state:'attached'});
    const initial={portfolioVisible:await p.locator('#laboratorio').isVisible(),modelsHidden:!(await p.locator('#carteras-modelo').isVisible()),controls:await values(p)};
    await click(p,p.locator('#vista-models'));
    await p.locator('.nv-modelos__tarjeta').first().waitFor({state:'visible'});
    await p.waitForFunction(()=>!document.querySelector('.nv-modelos__estado')?.textContent.includes('Comprobando'));
    assert.equal(await p.locator('.nv-modelos__tarjeta').count(),4);
    const models=await texts(p,'.nv-modelos__tarjeta');
    await click(p,p.locator('.nv-modelos__tarjeta button').first());
    await p.waitForFunction(()=>!document.querySelector('.nv-modelos__tarjeta button')?.disabled);
    const status=await texts(p,'.nv-modelos__estado');
    await click(p,p.locator('#vista-portfolio'));assert(await p.locator('#laboratorio').isVisible());assert(!(await p.locator('#carteras-modelo').isVisible()));
    return {initial,models,status,selectedAnalysisVisible:await p.locator('#modelo-seleccionado').isVisible(),limitation:'La API externa se bloquea deliberadamente: se comprueba el comportamiento sin conexión, no historiales ni análisis remoto.'};
  }},
  {id:'empresas', description:'Iframe React real, código JavaScript idéntico, búsqueda, elección y pestañas con respaldo local', async run(p,base) {
    await open(p,base+'/cartera.html?vista=companies','#nuvia-company-frame');
    const frame=p.frameLocator('#nuvia-company-frame');
    await frame.locator('#alpha-query').waitFor({state:'visible'});
    await frame.getByRole('status').filter({hasText:/empresas disponibles/}).waitFor({state:'visible'});
    const scripts=await frame.locator('script[src]').evaluateAll(ns=>ns.map(n=>n.src));
    const bundles=[];
    for(const src of scripts){assert.equal(new URL(src).origin,new URL(base).origin,'Los bundles deben proceder del servidor local de su propia variante');const response=await p.request.get(src);assert(response.ok());bundles.push({path:new URL(src).pathname,sha256:sha(await response.body())});}
    const initial=await frame.locator('.alpha-picker').innerText();
    assert.equal(await frame.locator('.alpha-company').count(),0,'Se seleccionó una empresa por defecto');
    await frame.locator('#alpha-query').fill('Iberdrola');
    await frame.getByRole('option').first().waitFor({state:'visible'});
    const matches=await frame.getByRole('option').allTextContents();
    await frame.locator('#alpha-query').press('ArrowDown');await frame.locator('#alpha-query').press('Enter');
    await frame.locator('.alpha-company h2').waitFor({state:'visible'});
    await frame.getByText('Respaldo local · Sin verificar en la base.',{exact:true}).waitFor({state:'visible'});
    const title=await frame.locator('.alpha-company').innerText();
    const tabs=[];
    for(const name of ['Resumen','Fundamentales','Técnico','Informe']){
      await frame.getByRole('tab',{name,exact:true}).click();await settle(p);
      assert.equal(await frame.getByRole('tab',{name,exact:true}).getAttribute('aria-selected'),'true');
      if(name==='Técnico')await frame.locator('#alpha-panel').getByText(/Cargando/).waitFor({state:'hidden'}).catch(()=>{});
      tabs.push({name,selected:clean(await frame.locator('[role="tab"][aria-selected="true"]').textContent()),headings:await frame.locator('#alpha-panel h2,#alpha-panel h3').allTextContents(),tableRows:await frame.locator('#alpha-panel table tbody tr').count()});
    }
    await frame.locator('.alpha-toolbar select').selectOption('10');await settle(p);
    return {bundles,initial:clean(initial),matches:matches.map(clean),company:clean(title),tabs,exerciseLimit:await frame.locator('.alpha-toolbar select').inputValue(),fallback:clean(await frame.getByText('Respaldo local · Sin verificar en la base.',{exact:true}).innerText()),limitation:'Sin consulta a APIs externas; se valida el respaldo local y la interacción, no la vigencia ni las cifras remotas.'};
  }},
  {id:'videos_voluntarios',description:'Vídeos de Bienestar y PIB cerrados hasta una acción expresa',async run(p,base){
    const results=[];
    for(const path of ['que-es-meditar.html','academia.html?tab=pib']){
      await open(p,base+'/'+path,'[data-nuvia-external-load]');
      assert.equal(await p.locator('main iframe').count(),0,'Hay vídeo cargado antes del clic');
      const target=await p.locator('[data-nuvia-external-frame]').first().getAttribute('data-src');
      await click(p,p.locator('[data-nuvia-external-load]').first());
      await p.locator('main iframe').first().waitFor({state:'attached'});
      const src=await p.locator('main iframe').first().getAttribute('src');assert.equal(src,target);
      results.push({path,initialFrames:0,afterFrames:await p.locator('main iframe').count(),src});
    }
    return {results,limitation:'Se verifica la carga voluntaria del iframe correcto; la reproducción remota queda fuera de esta prueba sin red externa.'};
  }}
];

const report={generatedAt:new Date().toISOString(),baseline:BASELINE,preview:PREVIEW,viewport:{width:1440,height:1000},isolation:'Chromium headless; contexto efímero nuevo por escenario y variante; service workers bloqueados; solo GET/HEAD a los servidores locales; no storageState ni perfil persistente; ningún dato real de usuarios.',results:[]};
report.companyBaseline={type:'Compilación original independiente',url:BASELINE,source:'Snapshot anterior servido por BASELINE_URL',comparison:'El nombre del asset puede cambiar al enlazar CSS; se exige igualdad SHA-256 del código JavaScript descargado.'};
const browser=await chromium.launch({headless:true});

async function variant(test,label,base){
  const context=await browser.newContext({viewport:report.viewport,locale:'es-ES',timezoneId:'Europe/Madrid',serviceWorkers:'block'});
  const blocked=new Map(),errors=[],consoleErrors=[],localFailures=[];
  const allowedOrigins=new Set([new URL(BASELINE).origin,new URL(PREVIEW).origin]);
  await context.route('**/*',route=>{
    const request=route.request();const url=new URL(request.url());
    if(!allowedOrigins.has(url.origin) && !['data:','blob:','about:'].includes(url.protocol)){
      const key=url.origin+' | '+request.resourceType();blocked.set(key,(blocked.get(key)||0)+1);return route.abort('blockedbyclient');
    }
    if(!['GET','HEAD'].includes(request.method()))return route.abort('blockedbyclient');
    return route.continue();
  });
  const p=await context.newPage();p.setDefaultTimeout(12000);p.setDefaultNavigationTimeout(20000);
  p.on('pageerror',e=>errors.push(normalError(e.message)));
  p.on('console',m=>{if(m.type()==='error')consoleErrors.push(normalError(m.text()+' @ '+m.location().url));});
  p.on('response',r=>{if(r.status()>=400 && allowedOrigins.has(new URL(r.url()).origin))localFailures.push({status:r.status(),url:normalError(r.url())});});
  const started=Date.now();let data,error;
  try{data=await test.run(p,base);}catch(e){error=normalError(e.stack || e.message);}
  const result={variant:label,passed:!error,durationMs:Date.now()-started,data,error,pageErrors:[...new Set(errors)],consoleErrors:[...new Set(consoleErrors)],localFailures,blockedExternal:[...blocked].map(([target,count])=>({target,count}))};
  await context.close();return result;
}

try{
  for(const test of cases.filter(t=>!process.env.ONLY_CASE || process.env.ONLY_CASE.split(',').includes(t.id))){
    const [before,after]=await Promise.all([variant(test,'original',BASELINE),variant(test,'ecosistema',PREVIEW)]);
    let equal=false,difference;
    // Vite incorpora la dependencia CSS al nombre del asset incluso cuando sus
    // bytes JavaScript son idénticos. Las rutas se conservan en la evidencia;
    // la comparación exige el SHA del código y todos los resultados funcionales.
    const comparable = data => test.id === 'empresas' && data ? {...data,bundles:data.bundles.map(({sha256})=>({sha256}))} : data;
    try{assert.deepEqual(comparable(after.data),comparable(before.data));equal=before.passed&&after.passed;}catch(e){difference=normalError(e.message);}
    if (test.id === 'empresas' && before.data && after.data) report.companyBundles={before:before.data.bundles,after:after.data.bundles,codeIdentical:JSON.stringify(before.data.bundles.map(b=>b.sha256))===JSON.stringify(after.data.bundles.map(b=>b.sha256))};
    const newPageErrors=after.pageErrors.filter(e=>!before.pageErrors.includes(e));
    const newConsoleErrors=after.consoleErrors.filter(e=>!before.consoleErrors.includes(e));
    const newLocalFailures=after.localFailures.filter(e=>!before.localFailures.some(b=>JSON.stringify(b)===JSON.stringify(e)));
    const result={id:test.id,description:test.description,equal,newPageErrors,newConsoleErrors,newLocalFailures,difference,before,after};
    report.results.push(result);
    console.log(JSON.stringify({id:test.id,original:before.passed,ecosistema:after.passed,equal,newPageErrors:newPageErrors.length,newConsoleErrors:newConsoleErrors.length,newLocalFailures:newLocalFailures.length,error:before.error||after.error||difference}));
  }
}finally{
  report.summary={scenarios:report.results.length,equal:report.results.filter(x=>x.equal).length,failed:report.results.filter(x=>!x.equal).map(x=>x.id),newPageErrors:report.results.reduce((n,x)=>n+x.newPageErrors.length,0),newConsoleErrors:report.results.reduce((n,x)=>n+x.newConsoleErrors.length,0),newLocalFailures:report.results.reduce((n,x)=>n+x.newLocalFailures.length,0)};
  await mkdir(resolve(REPORT,'..'),{recursive:true});await writeFile(REPORT,JSON.stringify(report,null,2)+'\n');
  await browser.close();
  console.log(JSON.stringify({report:REPORT,summary:report.summary}));
}
if(report.summary.failed.length || report.summary.newPageErrors || report.summary.newConsoleErrors || report.summary.newLocalFailures)process.exitCode=1;
