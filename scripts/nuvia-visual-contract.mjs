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
  ['.nuvia-design-lab', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nuvia-design-lab main', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nuvia-route-cartera main', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nv-system', 'backgroundColor', 'var(--nv-surface-page)'],
  ['.nv-hero--institutional:not(.nv-entry), .nuvia-analysis-hero:not(.nv-entry), .nv-guide-hero:not(.nv-entry)', 'backgroundImage', 'var(--nv-surface-institutional)'],
  ['.nv-entry', 'backgroundImage', 'none'],
  ['.nv-entry', 'backgroundColor', 'var(--nv-surface)'],
  ['.nuvia-analysis-hero', 'backgroundImage', 'none', '::before'],
  ['.nv-section--white', 'backgroundColor', 'var(--nv-surface)'],
  ['.nv-section--paper, .nv-hero--editorial', 'backgroundColor', 'var(--nv-surface-editorial)'],
  ['.nv-section--technical', 'backgroundColor', 'var(--nv-surface-technical)'],
  ['.nv-section--deep', 'backgroundColor', 'var(--nv-surface-deep)'],
  ['.lecturas-hero, .lecturas-hero__banner', 'backgroundImage', 'none'],
  ...PALETTE_SAMPLES.map(([name, token]) => [`.nv-swatch--${name} .nv-swatch__color`, 'backgroundColor', `var(--nv-${token})`]),
];
