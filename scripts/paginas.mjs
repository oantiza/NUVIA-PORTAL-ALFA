/* Registro único de páginas del portal.
   ═════════════════════════════════════════════════════════════════════════════
   Una página nueva se da de alta AQUÍ y en ningún otro inventario. De este
   registro leen:

     · scripts/build-site.mjs            qué se copia a dist/
     · scripts/check-consistencia.mjs    techo de estilos inline (0 en todas)
     · scripts/check-render.mjs          páginas base de la auditoría visual
     · scripts/nuvia-visual-contract.mjs arquetipo y excepción de cada página
     · scripts/check-page-hierarchy.mjs  padre canónico (regreso en la ruta)
     · scripts/update-sitemap.mjs        sitemap.xml (generado; --check lo verifica)
     · docs/nuvia-metadata.test.mjs      título público, canonical y sitemap

   Lo que NO vive aquí, a propósito: el menú de `_plantilla.html` y su prueba
   (`docs/nuvia-navigation.test.mjs`), los contratos de render por página
   (`CONTRATOS` en check-render.mjs) y las pruebas de entrada de cada espacio.
   Son comprobaciones de comportamiento y deben seguir siendo independientes
   del inventario: si todo saliera de la misma lista, una lista equivocada
   nunca fallaría.

   Campos:
     archivo    nombre del HTML en la raíz
     titulo     <title> público canónico (null si la página no es pública)
     modulo     ficha en docs/modulos/: nucleo · economia-informes · patrimonio
                · bienestar · academia-lecturas · cartera-empresas
     padre      página a la que regresa la ruta de navegación; null en las
                portadas (Inicio y Homes de espacio) y en la muestra del sistema
     tipo       arquetipo visual: institucional · espacio · herramienta · editorial
     excepcion  motivo documentado de la excepción al contrato de superficies
     publica    true: indexable, con canonical y en sitemap.xml
     auditar    false: fuera de la auditoría visual (redirecciones)
     lastmod    fecha para el sitemap (solo páginas públicas) */

export const BASE_URL = 'https://oantiza.github.io/NUVIA-PORTAL-ALFA/';

export const PAGINAS = [
  // ── Nivel 1 · Entrada ──────────────────────────────────────────────────────
  { archivo: 'index.html', titulo: 'NUVIA · Entender tu dinero', modulo: 'nucleo', padre: null,
    tipo: 'institucional', excepcion: 'Portada fotográfica: composición y velos propios.', publica: true, lastmod: '2026-09-01' },

  // ── Nivel 2 · Homes de espacio ─────────────────────────────────────────────
  { archivo: 'economia.html', titulo: 'NUVIA · Economía y Finanzas', modulo: 'economia-informes', padre: null,
    tipo: 'espacio', excepcion: 'Home del espacio Economía y Finanzas.', publica: true, lastmod: '2026-09-10' },
  { archivo: 'patrimonio.html', titulo: 'NUVIA · Patrimonio', modulo: 'patrimonio', padre: null,
    tipo: 'espacio', excepcion: 'Home del espacio Patrimonio.', publica: true, lastmod: '2026-09-10' },
  { archivo: 'bienestar.html', titulo: 'NUVIA · Familia, Salud y Bienestar', modulo: 'bienestar', padre: null,
    tipo: 'espacio', excepcion: 'Home del espacio Familia, Salud y Bienestar.', publica: true, lastmod: '2026-09-10' },
  // Academia: sus vistas ?tab=… regresan a la propia portada de Academia.
  { archivo: 'academia.html', titulo: 'NUVIA · Academia NUVIA', modulo: 'academia-lecturas', padre: 'academia.html',
    tipo: 'espacio', excepcion: 'Categorías formativas: colores y leyendas propios.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'lecturas.html', titulo: 'NUVIA · Lecturas con Criterio', modulo: 'academia-lecturas', padre: null,
    tipo: 'editorial', excepcion: 'Lámina ilustrada sin degradado, no héroe institucional.', publica: true, lastmod: '2026-09-01' },

  // ── Nivel 3 · Economía y Finanzas ──────────────────────────────────────────
  { archivo: 'mercados.html', titulo: 'NUVIA · Mercados y noticias', modulo: 'economia-informes', padre: 'economia.html',
    tipo: 'espacio', publica: true, lastmod: '2026-09-01' },
  { archivo: 'cartera.html', titulo: 'NUVIA · Cartera y analítica', modulo: 'cartera-empresas', padre: 'economia.html',
    tipo: 'herramienta', excepcion: 'Aro de apertura y series analíticas; empresas se revisará en 4B.', publica: true, lastmod: '2026-09-01' },

  // ── Nivel 3 · Patrimonio ───────────────────────────────────────────────────
  { archivo: 'vivienda.html', titulo: 'NUVIA · Vivienda y coste de vida', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'herramienta', publica: true, lastmod: '2026-09-01' },
  { archivo: 'jubilacion.html', titulo: 'NUVIA · Jubilación', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'herramienta', publica: true, lastmod: '2026-09-01' },
  { archivo: 'fiscalidad.html', titulo: 'NUVIA · Impuestos', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'herramienta', publica: true, lastmod: '2026-09-01' },
  { archivo: 'guia-fiscal.html', titulo: 'NUVIA · Fiscalidad y rescate de la EPSV', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional compacta.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'guia-planificacion.html', titulo: 'NUVIA · Planificación de la jubilación', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional y recorrido educativo.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'guia-ahorro.html', titulo: 'NUVIA · Fiscalidad del ahorro', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional y panel de contexto.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'guia-calendario.html', titulo: 'NUVIA · Calendario fiscal', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional y panel de contexto.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'guia-sucesiones.html', titulo: 'NUVIA · Sucesiones y donaciones', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional y panel de contexto.', publica: true, lastmod: '2026-09-01' },
  // temas.html: Patrimonio por defecto; ?topic=bienestar regresa a Bienestar (caso tratado en check-page-hierarchy).
  { archivo: 'temas.html', titulo: 'NUVIA · Patrimonio', modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'espacio', excepcion: 'Vistas de Patrimonio y Bienestar sin cambiar rutas ni estados.', publica: true, lastmod: '2026-09-01' },
  // Redirección de compatibilidad a fiscalidad.html#guias: se publica, no se indexa ni se audita.
  { archivo: 'guia-impuestos.html', titulo: null, modulo: 'patrimonio', padre: 'patrimonio.html',
    tipo: 'editorial', excepcion: 'Redirección a fiscalidad.html#guias; noindex.', publica: false, auditar: false },

  // ── Nivel 3 · Familia, Salud y Bienestar ───────────────────────────────────
  { archivo: 'respiracion-relajacion.html', titulo: 'NUVIA · Respiración y relajación', modulo: 'bienestar', padre: 'bienestar.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },
  { archivo: 'movimiento-consciente.html', titulo: 'NUVIA · Movimiento consciente', modulo: 'bienestar', padre: 'bienestar.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },
  { archivo: 'nutricion-equilibrada.html', titulo: 'NUVIA · Nutrición equilibrada', modulo: 'bienestar', padre: 'bienestar.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },
  { archivo: 'descanso-limites-tiempo-propio.html', titulo: 'NUVIA · Descanso, límites y tiempo propio', modulo: 'bienestar', padre: 'bienestar.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },
  { archivo: 'la-respiracion-como-el-escultor-del-cerebro.html', titulo: 'NUVIA · La respiración como el escultor del cerebro', modulo: 'bienestar', padre: 'respiracion-relajacion.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },
  { archivo: 'que-es-meditar.html', titulo: 'NUVIA · ¿Qué es meditar?', modulo: 'bienestar', padre: 'respiracion-relajacion.html',
    tipo: 'editorial', excepcion: 'Contenido de Cuerpo, mente y salud con entrada común.', publica: true },

  // ── Nivel 3 · Academia ─────────────────────────────────────────────────────
  { archivo: 'curso.html', titulo: 'NUVIA · Dinero con criterio', modulo: 'academia-lecturas', padre: 'academia.html',
    tipo: 'editorial', excepcion: 'Cabecera institucional con navegación del curso.', publica: true, lastmod: '2026-09-01' },

  // ── Nivel 4 · Institucional ────────────────────────────────────────────────
  { archivo: 'colaboradores.html', titulo: 'NUVIA · Colaboradores', modulo: 'nucleo', padre: 'index.html',
    tipo: 'institucional', excepcion: 'Equipo editorial y divulgación pedagógica.', publica: true, lastmod: '2026-09-10' },
  { archivo: 'que-es-nuvia.html', titulo: 'NUVIA · Qué es NUVIA', modulo: 'nucleo', padre: 'index.html',
    tipo: 'institucional', excepcion: 'Cubierta y manifiesto editorial propios.', publica: true, lastmod: '2026-09-01' },
  { archivo: 'metodologia.html', titulo: 'NUVIA · Metodología', modulo: 'nucleo', padre: 'index.html',
    tipo: 'institucional', excepcion: 'Transparencia sobre fuentes, cálculos, revisión y límites.', publica: true, lastmod: '2026-09-08' },
  { archivo: 'independencia.html', titulo: 'NUVIA · Independencia', modulo: 'nucleo', padre: 'index.html',
    tipo: 'institucional', excepcion: 'Compromisos editoriales, comerciales y profesionales.', publica: true, lastmod: '2026-09-08' },

  // ── Muestra del sistema (se publica con noindex; no es una página del sitio) ─
  { archivo: 'sistema-visual.html', titulo: null, modulo: 'nucleo', padre: null,
    tipo: 'institucional', excepcion: 'Muestra de componentes, noindex.', publica: false },
];

/* Vistas derivadas, para que cada consumidor no repita el mismo filtro. */
export const ARCHIVOS = PAGINAS.map((p) => p.archivo);
export const PUBLICAS = PAGINAS.filter((p) => p.publica);
export const AUDITABLES = PAGINAS.filter((p) => p.auditar !== false).map((p) => p.archivo);
export const PORTADAS = PAGINAS.filter((p) => p.padre === null).map((p) => p.archivo);
export const EXCLUIDAS_SITEMAP = PAGINAS.filter((p) => !p.publica).map((p) => p.archivo);

export function padreDe(archivo) {
  return PAGINAS.find((p) => p.archivo === archivo)?.padre ?? null;
}

export function urlCanonica(archivo) {
  return archivo === 'index.html' ? BASE_URL : BASE_URL + archivo;
}

export function sitemapXml() {
  const filas = PUBLICAS.map((p) => {
    const lastmod = p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : '';
    return `  <url><loc>${urlCanonica(p.archivo)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join('\n')}\n</urlset>\n`;
}

/* Comprobaciones de coherencia del propio registro: fallan al importar si el
   registro está mal, para que ningún consumidor trabaje con datos inválidos. */
{
  const vistos = new Set();
  for (const p of PAGINAS) {
    if (vistos.has(p.archivo)) throw new Error(`paginas.mjs: ${p.archivo} está repetida`);
    vistos.add(p.archivo);
    if (!['institucional', 'espacio', 'herramienta', 'editorial'].includes(p.tipo)) throw new Error(`paginas.mjs: ${p.archivo} tiene un tipo desconocido`);
    if (p.publica && !p.titulo) throw new Error(`paginas.mjs: ${p.archivo} es pública y no tiene título`);
    if (p.padre !== null && !vistos.has(p.padre) && !ARCHIVOS.includes(p.padre)) throw new Error(`paginas.mjs: ${p.archivo} regresa a ${p.padre}, que no existe`);
  }
}
