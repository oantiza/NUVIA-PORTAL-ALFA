import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

// Browser regression of NUVIA's integration. The provider stub deliberately
// tests activation/inertness independently from YouTube/TradingView availability.
const root = resolve(process.argv[2] || '.');
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.png':'image/png', '.webp':'image/webp' };
const server = createServer(async (req, res) => {
  const file = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    if (!(await stat(file)).isFile()) throw Error('Not a file');
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const base = `http://127.0.0.1:${server.address().port}/`;
let browser;
try {
  browser = await chromium.launch({ headless:true });
  for (const width of [1440, 1024, 768]) {
    const context = await browser.newContext({ viewport: { width, height: width === 768 ? 1024 : 900 } });
    let videoLoads = 0, widgetLoads = 0;
    await context.route('https://www.youtube-nocookie.com/**', async route => {
      videoLoads++;
      await route.fulfill({ contentType:'text/html', body:'<!doctype html><title>Reproductor de prueba</title>' });
    });
    await context.route('https://widgets.tradingview-widget.com/w/en/tv-market-overview.js', async route => {
      widgetLoads++;
      await route.fulfill({ contentType:'text/javascript', body:"customElements.define('tv-market-overview', class extends HTMLElement { connectedCallback() { this.attachShadow({mode:'open'}).innerHTML='<p>Panel de prueba</p>'; } });" });
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    const videoHost = page.locator('[data-nuvia-external-frame]');
    await page.goto(base + 'curso.html?capitulo=1');
    await videoHost.locator('[data-nuvia-external-load]').waitFor({ state:'visible' });
    assert.equal(await videoHost.locator('iframe').count(), 0, 'El curso no conecta antes del clic');
    assert.equal(videoLoads, 0);
    const firstSource = await videoHost.getAttribute('data-src');
    await videoHost.locator('[data-nuvia-external-load]').click();
    await videoHost.locator('iframe').waitFor();
    assert.equal(await videoHost.locator('iframe').getAttribute('src'), firstSource);
    await page.getByRole('button', { name:'Marcar vídeo como visto →' }).click();
    assert.equal(await videoHost.locator('iframe').getAttribute('src'), firstSource, 'El progreso del mismo capítulo conserva su vídeo');
    await page.locator('.curso-programa button').nth(1).click();
    await page.waitForURL('**/curso.html?capitulo=2');
    await videoHost.locator('[data-nuvia-external-load]').waitFor({ state:'visible' });
    assert.equal(await videoHost.locator('iframe').count(), 0, 'Cambiar capítulo retira el iframe anterior');
    assert.equal(await videoHost.getAttribute('data-nuvia-external-loaded'), null);
    const secondSource = await videoHost.getAttribute('data-src');
    assert.notEqual(secondSource, firstSource);
    await videoHost.locator('[data-nuvia-external-load]').click();
    await videoHost.locator('iframe').waitFor();
    assert.equal(await videoHost.locator('iframe').getAttribute('src'), secondSource);
    await page.goBack();
    await videoHost.locator('[data-nuvia-external-load]').waitFor({ state:'visible' });
    assert.equal(await videoHost.getAttribute('data-src'), firstSource, 'Atrás recupera el capítulo y su portada');
    assert.equal(await videoHost.locator('iframe').count(), 0);

    await page.goto(base + 'mercados.html');
    const widgetHost = page.locator('[data-nuvia-external-widget="tradingview"]');
    await page.locator('.markets-index-card__live-panel summary').click();
    const template = await widgetHost.locator('template').evaluate(el => ({
      liveChildren:el.childNodes.length,
      widgets:el.content.querySelectorAll('tv-market-overview').length,
      sectors:JSON.parse(el.content.querySelector('tv-market-overview').getAttribute('symbol-sectors')),
    }));
    assert.equal(template.liveChildren, 0, 'El contenido permanece en el fragmento inerte de template');
    assert.equal(template.widgets, 1, 'El render conserva la definición del widget');
    assert.deepEqual(template.sectors.map(s => s.symbols.length), [6, 3, 3], 'Se conservan todos los grupos y símbolos');
    assert.equal(await widgetHost.locator('tv-market-overview').count(), 0);
    assert.equal(widgetLoads, 0, 'TradingView no recibe peticiones antes de elegir cargar');
    await widgetHost.locator('[data-nuvia-external-load]').click();
    await widgetHost.locator('tv-market-overview').waitFor();
    assert.equal(widgetLoads, 1);
    assert.equal(await widgetHost.getAttribute('data-nuvia-external-loaded'), 'true');
    assert.deepEqual(await widgetHost.locator('tv-market-overview').evaluate(el => JSON.parse(el.getAttribute('symbol-sectors'))), template.sectors);
    assert.equal(await widgetHost.locator('tv-market-overview p').innerText(), 'Panel de prueba');

    // A damaged template must preserve retry feedback and the existing link.
    await page.goto(base + 'mercados.html');
    await page.locator('.markets-index-card__live-panel summary').click();
    await widgetHost.locator('template').evaluate(el => el.content.replaceChildren());
    const requestsBefore = widgetLoads;
    await widgetHost.locator('[data-nuvia-external-load]').click();
    await page.waitForFunction(() => !document.querySelector('[data-nuvia-external-load]').disabled);
    assert.match(await widgetHost.locator('[data-nuvia-external-status]').innerText(), /enlace alternativo/);
    assert.equal(await widgetHost.getAttribute('data-nuvia-external-loaded'), null);
    assert.equal(await widgetHost.getByRole('link', { name:'Abrir TradingView ↗' }).isVisible(), true);
    assert.equal(widgetLoads, requestsBefore, 'La plantilla vacía no inicia la conexión externa');
    assert.deepEqual(pageErrors, []);
    console.log(`Reproductores ${width}px: capítulo, progreso, Atrás, plantilla inerte, activación y recuperación correctos.`);
    await context.close();
  }
} finally {
  await browser?.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
