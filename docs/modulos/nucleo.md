# Módulo · Núcleo y diseño

**Qué es:** todo lo que comparten las demás secciones: la cáscara (cabecera y pie), el sistema visual (tokens, componentes, plantillas de página), la Home global, las páginas institucionales, el proceso de construcción y publicación.
**Regla:** lo común **solo se modifica desde este módulo**. Un cambio en cabecera, pie, tokens o componentes afecta a las 29 páginas y se revisa en todos los espacios.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | **Entera.** Es la guía operativa de este módulo (§1 reglas de oro, §2 estructura, §3 sistema visual, §6 flujo de validación). |
| `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md` | Entera si se toca estructura, navegación o se crea una página. |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | §0 (jerarquía y alcance alfa), §5 (lenguaje), §12 (prueba por función), §14 (controles técnicos). |
| `docs/nuvia-design-system.md` | Organización de las hojas de estilo y cómo incorporar una regla. |
| `docs/DEFINICION_NUVIA.md` | Si se toca Inicio, «Qué es NUVIA» o cualquier texto de presentación. |

## Archivos de este módulo

**Páginas:** `index.html` (referencia visual del portal), `_plantilla.html` (cáscara única), `colaboradores.html`, `que-es-nuvia.html`, `metodologia.html`, `independencia.html`, `sistema-visual.html` (muestra del sistema; no es una página del sitio).

**Estilos:** `estilos/nuvia-tokens.css`, `estilos/nuvia-components.css`, `estilos/nuvia-pages.css` (entrada común: `nuvia-pages-foundations.css` → `nuvia-pages-content.css` → `nuvia-page-entry.css`), `estilos/nuvia-subseccion.css` (cabecera compacta de página hija), `estilos/fuentes/`. Las hojas de Cartera (`nuvia-pages-lab.css` → `nuvia-pages-cartera.css`) y de informes (`nuvia-market-reports.css`) pertenecen a sus módulos y solo se cargan en sus páginas (desde el 12-10-2026).

**Comportamiento:** `support.js`, `nuvia-site-unified.js`, `web2-integration.js`, `js/vendor/`.
Anclas entre páginas (`pagina.html#id`): como React pinta el contenido después de que el navegador busque el fragmento, `nuvia-site-unified.js` hace el salto una sola vez cuando el destino existe y el lector no ha desplazado la página (13-10-2026). Los destinos llevan `scroll-margin-top` con la altura de la cabecera fija (p. ej. `.nv-colaborador`).

**Imágenes y marca:** `src/assets/home/`, `src/assets/brand/`, `src/assets/social/`, `favicon.svg`; originales de trabajo en `output/imagegen/` (fuera de la publicación).

**Construcción y publicación:** `scripts/build-site.mjs`, `scripts/check-static-site.mjs`, `scripts/update-nav-footer.mjs` (`shell:sync` / `shell:check`), `scripts/site-shell.mjs`, `scripts/apply-social-metadata.mjs`, `scripts/build-social-card.mjs`, `scripts/optimizar-imagenes.mjs`, `scripts/optimizar-logos.mjs`, `scripts/serve-local.mjs`, `.github/workflows/pages.yml`.

**Registro único de páginas:** `scripts/paginas.mjs` (título, módulo, padre, arquetipo, pública, fecha de sitemap). De él leen `build-site`, `check-consistencia`, `check-render` (páginas base), `nuvia-visual-contract`, `check-page-hierarchy`, `update-sitemap` y `docs/nuvia-metadata.test.mjs`. `sitemap.xml` se genera con `npm run sitemap:sync` y se verifica con `sitemap:check` (dentro de `validate`).

**Controles transversales (sobre las 29 páginas):** `scripts/check-consistencia.mjs` (cero `style=""`), `scripts/check-lenguaje.mjs` (vocabulario prohibido), `scripts/check-parity.mjs`, `scripts/check-page-hierarchy.mjs`, `scripts/check-render.mjs` + `scripts/nuvia-visual-contract.mjs` (auditoría visual con Playwright), `sitemap.xml`, `robots.txt`.

**Pruebas:** `docs/nuvia-page-styles.test.mjs`, `nuvia-typography-foundations`, `nuvia-layout-foundations`, `nuvia-surfaces`, `nuvia-navigation`, `nuvia-navigation-cards`, `nuvia-metadata`, `nuvia-trust-pages`, `nuvia-definicion`, `nuvia-company-privacy`, `nuvia-form-controls`, `nuvia-notice-states`, `nuvia-tables-results`, `nuvia-external-content`, `nuvia-academy-banner`, `nuvia-lecturas-banner`, `nuvia-page-hierarchy`.

## Comprobación local

```powershell
npm run validate:nucleo
```
Incluye cáscara, sitemap, paridad, sitio estático, consistencia, lenguaje, estilos, navegación, metadatos, confianza, superficies, tarjetas, formularios, tablas, avisos, contenido externo y jerarquía. Después: `npm run auditar` (render visual con Playwright).
Antes de publicar: `npm run validate` completo (lo ejecuta también GitHub Actions).

## Al crear una página nueva

1. Alta en `scripts/paginas.mjs` y `npm run sitemap:sync`.
2. Contrato de render de la página (selectores esperados) en `CONTRATOS` de `scripts/check-render.mjs`.
3. Menú de su espacio en `_plantilla.html` + `npm run shell:sync`, y su entrada en `docs/nuvia-navigation.test.mjs`.
4. Prueba de entrada de su espacio (`docs/nuvia-<espacio>-entry.test.mjs`) si la portada debe enlazarla.

Los pasos 2-4 siguen siendo manuales a propósito: comprueban comportamiento, no inventario. Si todo saliera del registro, un registro equivocado nunca fallaría.

## Decisiones vigentes

- Inicio y su hero son la vara de medir; las páginas se adaptan a ellos, nunca al revés.
- Escritorio y tablet (1440 → 768 px). Sin versión móvil salvo orden expresa.
- Sin estilos inline, sin colores literales, sin fuentes externas, sin `<iframe>` al cargar.
- Las subsecciones llevan cabecera clara y compacta con foto enmarcada (`nv-sub-hero`), no el hero a sangre de las portadas (sep. 2026).
- Ninguna imagen se repite entre páginas; las genera el fundador a partir de los prompts que se le entregan.
- Producción: GitHub Pages desde `main` vía Actions. Firebase Hosting no es canal oficial.

## Historial de este módulo (contexto, no normativa)

`REFACTORIZACION_CSS_20260909`, `JERARQUIA_VISUAL_20260910`, `MEJORA_CONTINUISTA_HOMES_20260908`, `REDISENO_NUVIA_20260905`, `PANORAMICAS_ESPACIOS_20260909`, `SUBSECCIONES_CABECERA_20260923`, `AUDITORIA_DISENO_Y_PLAN_NUVIA_20260905`, `AUDITORIA_ESTRUCTURA_HOMOGENEIZACION_WEB_2026-09-01`, fichas regulatorias de Home, fondo, banners, navegación y páginas de confianza (ver `docs/INDICE.md`).
