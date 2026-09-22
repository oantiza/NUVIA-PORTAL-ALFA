import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { eligibleNews } from '../scripts/news-editorial.mjs';
import { readPageStylesSync } from '../scripts/read-page-styles.mjs';

const root = resolve(process.argv[2] || '.');
const read = (path) => readFile(resolve(root, path), 'utf8');
const payload = JSON.parse(await read('data/daily-content.json'));
const integration = await read('web2-integration.js');
const markets = await read('mercados.html');
const styles = readPageStylesSync(root);
const updater = await read('scripts/update-daily-news.mjs').catch(() => '');

const allowedSources = new Set(['EL PAÍS Economía', 'Expansión']);
const iso = (value, label) => {
  assert.equal(typeof value, 'string', `${label} debe existir en formato ISO`);
  const date = new Date(value);
  assert.ok(!Number.isNaN(date.valueOf()), `${label} no es una fecha ISO válida`);
  assert.ok(date.valueOf() <= Date.now() + 15 * 60_000, `${label} no puede estar en el futuro`);
  return date;
};
const validateItem = (item, label) => {
  assert.ok(item?.title?.trim(), `${label}: falta título`);
  assert.ok(item?.summary?.trim(), `${label}: falta resumen`);
  assert.ok(item?.category?.trim(), `${label}: falta categoría`);
  assert.ok(allowedSources.has(item?.sourceName), `${label}: fuente no inventariada`);
  assert.match(item?.sourceUrl || '', /^https:\/\//, `${label}: la URL de fuente debe usar HTTPS`);
  assert.equal(eligibleNews({ title: item.title, sourceName: item.sourceName, url: item.sourceUrl,
    publishedAt: new Date(item.sourcePublishedAtIso || item.publishedAtIso) }, new Date(item.sourcePublishedAtIso || item.publishedAtIso)), true,
    `${label}: fuente y dominio deben corresponder`);
  assert.equal(item.contextMode, 'automatic-topic-context', `${label}: debe declarar el origen del contexto`);
  assert.match(item.summary, /Titular de .*medio de origen/, `${label}: no inventa un resumen del artículo`);
  iso(item?.sourcePublishedAtIso || item?.publishedAtIso, `${label}: publicación`);
  // 19-09-2026: una ilustración propia por tema (recursos ya aprobados en
  // src/assets/home), nunca una fotografía de prensa rehospedada.
  assert.match(item?.imageUrl || '', /^src\/assets\/(?:social\/nuvia-social-source-generated-v1\.png|home\/[\w-]+\.webp)$/,
    `${label}: debe usar un activo propio de NUVIA`);
  assert.match(item?.imageProvenance || '', /propi[ao] de NUVIA/,
    `${label}: falta documentar la procedencia de la imagen`);
};

assert.ok(['ok', 'degraded', 'failed'].includes(payload.editorialUpdate?.status),
  'La actualización editorial debe declarar ok, degraded o failed');
iso(payload.editorialUpdate?.lastAttemptAt, 'Último intento editorial');
if (payload.editorialUpdate.status !== 'failed') iso(payload.editorialUpdate?.lastSuccessAt, 'Último éxito editorial');
assert.equal(payload.editorialUpdate?.selectionMode, 'automatic', 'La selección actual debe identificarse como automática');

validateItem(payload.dailyEconomicNews, 'Noticia principal');
iso(payload.dailyEconomicNews?.selectedAt, 'Selección de la noticia principal');
assert.equal(payload.dailyEconomicNews?.impactPoints?.length, 3, 'La noticia principal debe incluir tres claves');

// 22-09-2026: la portada de Mercados muestra hasta doce noticias (la destacada
// y once breves). El actualizador publica las que haya, con un mínimo de tres.
const secondaryCount = payload.secondaryEconomicNews?.length ?? 0;
assert.ok(secondaryCount >= 3 && secondaryCount <= 11, 'Deben existir entre tres y once noticias breves');
payload.secondaryEconomicNews.forEach((item, index) => validateItem(item, `Noticia breve ${index + 1}`));

const urls = [payload.dailyEconomicNews.sourceUrl, ...payload.secondaryEconomicNews.map((item) => item.sourceUrl)];
const titles = [payload.dailyEconomicNews, ...payload.secondaryEconomicNews]
  .map((item) => item.title.toLocaleLowerCase('es-ES'));
const secondaryCategories = payload.secondaryEconomicNews.map((item) => item.category);
assert.ok(new Set(secondaryCategories).size >= 2, 'Las noticias breves deben cubrir al menos dos temas distintos');
assert.ok(new Set(payload.secondaryEconomicNews.map((item) => item.imageUrl)).size >= 2, 'Las noticias breves no repiten la misma ilustración');
assert.equal(new Set(urls).size, secondaryCount + 1, 'Todas las noticias deben tener URL distinta');
assert.equal(new Set(titles).size, secondaryCount + 1, 'Todas las noticias deben tener titular distinto');

assert.match(integration, /sourcePublishedAtIso/, 'La interfaz debe calcular la actualidad desde la publicación real');
assert.match(integration, /editorialUpdate/, 'La interfaz debe mostrar el estado del intento editorial');
assert.match(integration, /no resumen ni verifican los artículos/, 'El contexto automático no se presenta como resumen verificado');
assert.match(markets, /data-news-update-status/, 'Mercados debe reservar un estado visible de actualización');
assert.match(markets, /data-daily-news="date"[^>]*datetime=/, 'La fecha principal debe usar un elemento time con datetime');
assert.match(markets, /src\/assets\/social\/nuvia-social-source-generated-v1\.png/,
  'El contenido de reserva debe usar el activo editorial propio');
assert.doesNotMatch(markets, /daily-news-current|secondary-news-current/,
  'El contenido de reserva no debe rehospedar fotografías de prensa');
assert.match(markets, /data-market-news-slot="featured"[\s\S]*data-market-news-slot="grid"/,
  'Mercados reserva los contenedores de las noticias breves, sin titulares escritos a mano');
assert.match(integration, /renderSecondaryNews/, 'Las noticias breves se crean desde los datos diarios');
assert.match(markets, /data-report-reader/,
  'Mercados integra un lector de las ediciones fechadas disponibles');
assert.doesNotMatch(markets, /Archivo en preparación|Este archivo se habilitará/,
  'El archivo disponible no se presenta como pendiente');
assert.doesNotMatch(integration, /Datos oficiales revisados a diario/,
  'Los indicadores no deben prometer una revisión diaria que el sistema no acredita');
assert.doesNotMatch(styles, /\.markets-lead-news h3[^}]*line-clamp/s,
  'El titular principal no puede recortarse con line-clamp');
if (updater) {
  assert.doesNotMatch(updater, /fetchCandidateImage|og:image|twitter:image/,
    'La actualización no debe descargar ni rehospedar imágenes de prensa');
  assert.match(updater, /SECONDARY_TARGET = 11/, 'El actualizador prepara hasta once noticias breves');
  assert.match(updater, /consultorio/,
    'La selección debe excluir consultorios personales');
}

console.log(`Sistema editorial verificado en ${root}.`);
