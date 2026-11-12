/* Contrato de presentación para pruebas. No se carga en el portal ni lee datos. */
import { PAGINAS } from './paginas.mjs';

/* Arquetipo y excepción de cada página: se declaran en scripts/paginas.mjs. */
export const VISUAL_ARCHETYPES = Object.fromEntries(PAGINAS.map((p) => [p.archivo, p.excepcion ? { type: p.tipo, exception: p.excepcion } : { type: p.tipo }]));

/* Selector, propiedad calculada, valor esperado. Se evalúan solo cajas visibles.
   Las fotos, estados y gráficos no se someten a una sustitución indiscriminada. */
export const PALETTE_SAMPLES = [
  ['navy', 'navy-900', '#0B2347'], ['green', 'green-500', '#7C9A44'],
  ['paper', 'paper', '#F3EEDF'], ['bronze', 'bronze-500', '#B69152'],
  ['cloud', 'cloud', '#F4F6F9'], ['white', 'white', '#FFFFFF'],
  ['copy', 'copy', '#40506A'], ['deep', 'navy-950', '#06172F'],
];

export const SURFACE_CONTRACT = [
  ['.nuvia-design-lab:not([data-eco-theme])', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nuvia-design-lab:not([data-eco-theme]) main', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nuvia-route-cartera main', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nv-system', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nv-hero--institutional:not(.nv-entry), .nuvia-analysis-hero:not(.nv-entry), .nv-guide-hero:not(.nv-entry)', 'backgroundImage', 'var(--nv-surface-institutional)'],
  ['.nv-entry', 'backgroundImage', 'none'],
  ['body:not([data-eco-theme]) .nv-entry, body[data-eco-theme="economia"] .nv-entry, body[data-eco-theme="nuvia"] .nv-entry:not(.about-hero)', 'backgroundColor', 'var(--nv-surface)'],
  ['body[data-eco-theme]:not(.web-page), .web-page, .web-header, .web-footer', 'backgroundColor', 'var(--nv-surface)'],
  ['body[data-eco-theme="academia"] main, body[data-eco-theme="bienestar"] main, body[data-eco-theme="lecturas"] main, .about-presentation', 'backgroundColor', 'var(--nv-surface)'],
  ['.hub-page, body[data-eco-theme="nuvia"] .about-hero.nv-entry', 'backgroundColor', 'color-mix(in srgb, var(--nv-surface-editorial) 38%, var(--nv-surface))'],
  ['.pa-opening, body[data-eco-theme="patrimonio"] .nv-entry', 'backgroundColor', 'color-mix(in srgb, var(--nv-surface-editorial) 72%, var(--nv-surface))'],
  ['body[data-eco-theme="academia"] .nv-entry, .ac-experiment', 'backgroundColor', 'var(--nv-surface-technical)'],
  ['body[data-eco-theme="bienestar"] .nv-entry', 'backgroundColor', 'color-mix(in srgb, var(--nv-green-100) 58%, var(--nv-surface))'],
  ['body[data-eco-theme="colaboradores"] .nv-entry', 'backgroundColor', 'color-mix(in srgb, var(--nv-surface-editorial) 68%, var(--nv-surface))'],
  ['.ec-analysis', 'backgroundColor', 'var(--nv-navy-900)'],
  ['.pa-perspective, body[data-eco-theme="lecturas"] #seleccion-lecturas, body[data-eco-theme="nuvia"] .about-purpose, body[data-eco-theme="nuvia"] .about-principle', 'backgroundColor', 'var(--nv-surface-editorial)'],
  ['.bi-reading, .ac-foundations', 'backgroundColor', 'var(--nv-green-100)'],
  ['body[data-eco-theme="nuvia"] .about-world', 'backgroundColor', 'color-mix(in srgb, var(--nv-surface-technical) 35%, var(--nv-surface))'],
  ['body[data-eco-theme="nuvia"] .about-finale', 'backgroundColor', 'var(--nv-navy-900)'],
  ['.nuvia-analysis-hero', 'backgroundImage', 'none', '::before'],
  ['.nv-section--white', 'backgroundColor', 'var(--nv-surface)'],
  ['.nv-section--paper, .nv-hero--editorial', 'backgroundColor', 'var(--nv-surface-editorial)'],
  ['.nv-section--technical', 'backgroundColor', 'var(--nv-surface-technical)'],
  ['.nv-section--deep', 'backgroundColor', 'var(--nv-surface-deep)'],
  ['.lecturas-hero, .lecturas-hero__banner', 'backgroundImage', 'none'],
  ...PALETTE_SAMPLES.map(([name, token]) => [`.nv-swatch--${name} .nv-swatch__color`, 'backgroundColor', `var(--nv-${token})`]),
];

/* Revisión aprobada del 12-11-2026: la escala editorial se define por familia,
   no ampliando la escala de todas las herramientas. Los controles conservan su
   contrato independiente (14 px/44 px). Los h1 se comprueban por fórmula exacta:
   el contrato anterior dejaba sin límite cualquier texto a partir de 40 px. */
const BASE_SCALE = [12, 14, 16, 18, 22, 28, 36];
export const TYPE_SCALES = [
  ['.hub-page', [12, 13, 14, 15, 16, 21, 24, 27, 29, 30, 33]],
  ['.web-page--economia', [12, 13, 14, 15, 16, 25, 29, 30, 31, 32, 35, 39]],
  ['.web-page--patrimonio', [12, 13, 14, 15, 17, 21, 23, 29, 33, 39, 41, 49]],
  ['.web-page--bienestar, .web-page--familia', [12, 13, 14, 15, 16, 26, 27, 28, 29, 30, 33, 39, 40, 49]],
  ['.web-page--academia', [12, 13, 14, 15, 16, 18, 29, 31, 33, 35, 36, 39, 40, 42, 45, 47]],
  ['body[data-eco-theme="economia"]:not(.web-page) main', [...BASE_SCALE, 13]],
  ['body[data-eco-theme="patrimonio"] main', [...BASE_SCALE, 13, 25, 26, 29]],
  ['body[data-eco-theme="academia"]:not(.web-page) main', [...BASE_SCALE, 13, 15, 27, 29, 30, 32, 34, 38, 40, 42, 44, 46]],
  ['body[data-eco-theme="bienestar"] main', [...BASE_SCALE, 13, 15, 21, 23, 25, 26, 29, 32]],
  ['body[data-eco-theme="lecturas"] main, body[data-eco-theme="lecturas"] .lecturas-book-dialog', [...BASE_SCALE, 13, 15, 19, 20, 24, 25, 26, 27, 29, 33, 34, 37, 38, 42]],
  ['body[data-eco-theme="nuvia"] main', [...BASE_SCALE, 13, 15, 17, 20, 24, 27, 30, 31, 35, 37, 42, 43, 44, 48]],
  ['body[data-eco-theme="colaboradores"] main', [...BASE_SCALE, 13, 15, 32, 34, 38, 42]],
  ['.jb-live__num', [48, 18]],
  ['.fiscal-agenda__n', [76, 52, 22]],
  ['.fiscal-guia__cifra', [60]],
  ['.fiscal-sim__res dd', [46, 36]],
  ['.web-header, .web-footer, .web-skip', [12, 13, 14, 16, 22, 23, 25, 32]],
];

/* Cifras del simulador y de la agenda: tamaños originales preservados en
   nuvia-jubilacion.css y nuvia-fiscal.css. Antes no se comprobaban por ser
   >=40 px. Ahora tienen valores exactos y selectores limitados al componente. */
export const NUMERIC_SIZE_CONTRACT = [
  ['.jb-live__num', 48], ['.jb-live__num > span:not(.sc-interp)', 18],
  ['.fiscal-agenda__n', 76], ['.fiscal-agenda__n--mes', 52],
  ['.fiscal-agenda__unit', 22], ['.fiscal-guia__cifra', 60],
  ['.fiscal-sim__res dd', 46], ['.fiscal-sim__res div + div dd', 36],
];

/* selector, tamaño base, sustituciones [ancho máximo, tamaño], peso excepcional.
   Las reglas más específicas van al final. Las fórmulas son independientes del
   CSS servido. La vista histórica de Academia conserva su peso original 500. */
export const TITLE_CONTRACT = [
  ['body[data-eco-theme] .nv-entry h1', 'clamp(40px, 3.8vw, 56px)', [[999, '40px']]],
  ['body[data-eco-theme="patrimonio"] .nv-entry h1', 'clamp(42px, 3.8vw, 55px)', [[999, '40px']]],
  ['body[data-eco-theme="academia"] .nv-entry h1', 'clamp(42px, 4vw, 58px)', [[1023, '44px']]],
  ['body[data-eco-theme="bienestar"] .nv-entry h1', 'clamp(42px, 4.2vw, 60px)', [[1023, '44px']]],
  ['body[data-eco-theme="nuvia"] .about-hero h1', 'clamp(52px, 4.7vw, 68px)', [[859, '49px']]],
  ['body[data-eco-theme="colaboradores"] .nv-entry h1', 'clamp(64px, 7.4vw, 106px)', [[1120, '76px'], [850, '68px']]],
  ['body[data-eco-theme="lecturas"] .nv-space-editorial h1', 'clamp(48px, 4.7vw, 68px)', [[1179, '56px'], [899, '50px']]],
  ['body[data-eco-theme="academia"] #academy:not(.nv-entry) h1', '42px', [[1120, '36px']], 500],
  ['.hub-intro h1', 'clamp(58px, 7.25vw, 104px)', [[859, '66px']]],
  ['.ec-opening h1', 'clamp(58px, 6.05vw, 86px)', [[1179, 'clamp(58px, 6.1vw, 74px)'], [959, '59px'], [819, '55px']]],
  ['.pa-opening h1', 'clamp(56px, 5.4vw, 79px)', [[1179, '65px'], [999, '54px']]],
  ['.bi-opening h1', 'clamp(53px, 5.3vw, 76px)', [[1179, '62px'], [999, '48px']]],
  ['.ac-opening h1', 'clamp(68px, 6.25vw, 90px)', [[1179, '72px'], [899, '62px']]],
];
