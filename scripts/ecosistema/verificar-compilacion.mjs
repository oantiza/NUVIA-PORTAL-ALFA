/** Comprueba dist bajo el mismo prefijo de GitHub Pages, sin publicar ni APIs. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../..');
const dist = resolve(root, 'dist');
const output = resolve(root, 'output/integracion-ecosistema-20261112');
const prefix = '/NUVIA-PORTAL-ALFA/';
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};
const server = createServer(async (req,res) => {
  try {
    assert(['GET','HEAD'].includes(req.method));
    const path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    assert(path.startsWith(prefix));
    let file = resolve(dist, path.slice(prefix.length) || 'index.html');
    assert(file.startsWith(dist + sep));
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    assert((await realpath(file)).startsWith(dist + sep));
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('No encontrado'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const base = origin + prefix;
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
  for (const width of [1440,768]) {
    const context = await browser.newContext({viewport:{width,height:1000},locale:'es-ES',serviceWorkers:'block'});
    await context.route('**/*', route => {
      const req = route.request(), url = new URL(req.url());
      return (url.origin === origin && ['GET','HEAD'].includes(req.method())) || ['data:','blob:','about:'].includes(url.protocol) ? route.continue() : route.abort('blockedbyclient');
    });
    for (const path of ['index.html','economia.html','patrimonio.html','bienestar.html','academia.html','academia.html?tab=inicio','academia.html?tab=calculadora','lecturas.html','colaboradores.html','que-es-nuvia.html','cartera.html?vista=companies']) {
      const page = await context.newPage();
      const errors = [], failures = [];
      page.on('pageerror', e=>errors.push(e.message));
      page.on('response', r=>{if(r.url().startsWith(origin) && r.status() >= 400) failures.push({url:r.url(),status:r.status()});});
      const result = {path,width,passed:false};
      try {
        await page.goto(base+path, {waitUntil:'domcontentloaded'});
        await page.locator('main h1').first().waitFor({state:'visible'});
        await page.evaluate(()=>document.fonts.ready);
        if(path.startsWith('cartera')) {
          const frame = page.frameLocator('#nuvia-company-frame');
          await frame.locator('#alpha-query').waitFor({state:'visible'});
          assert((await page.locator('#nuvia-company-frame').getAttribute('src')).includes('company-analysis/'));
          result.companyTheme = await frame.locator('body').evaluate(el=>({theme:el.dataset.ecoTheme,background:getComputedStyle(el).backgroundColor}));
          assert.equal(result.companyTheme.theme,'economia');
        }
        const layout = await page.evaluate(()=>({
          h1s:[...document.querySelectorAll('main h1')].filter(el=>el.getClientRects().length).length,
          overflow:document.documentElement.scrollWidth > innerWidth+1,
          images:[...document.querySelectorAll('main img')].filter(el=>el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom>0).map(el=>({src:el.currentSrc,valid:el.complete && el.naturalWidth>0})),
          links:[...document.querySelectorAll('a[href]')].map(el=>el.href).filter(url=>url.startsWith(location.origin))
        }));
        assert.equal(layout.h1s,1);
        assert.equal(layout.overflow,false);
        for(const img of layout.images) assert(img.valid,`Imagen no cargada: ${img.src}`);
        for(const link of new Set(layout.links)) {
          assert(new URL(link).pathname.startsWith(prefix),`Enlace fuera del prefijo: ${link}`);
          const response = await page.request.get(link);
          assert(response.ok(),`Destino inexistente: ${link}`);
        }
        assert.equal(errors.length,0,errors.join('\n'));
        assert.equal(failures.length,0,JSON.stringify(failures));
        result.checkedLinks = new Set(layout.links).size;
        await page.screenshot({path:resolve(output,`principal-${path.replace(/[^a-z0-9.-]/gi,'_')}-${width}.png`),fullPage:true});
        result.passed = true;
      } catch (error) {result.error=error.stack;}
      result.pageErrors=errors; result.localFailures=failures;
      results.push(result); console.log(JSON.stringify(result));
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise(r=>server.close(r));
  await writeFile(resolve(output,'compilacion-prefijo.json'),JSON.stringify({prefix,results,passed:results.every(x=>x.passed)},null,2)+'\n');
}
assert(results.length===22 && results.every(x=>x.passed),'Falló la revisión de la compilación estática');
