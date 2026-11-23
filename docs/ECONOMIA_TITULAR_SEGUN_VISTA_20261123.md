# Economía: titular, ruta y título de pestaña según la vista

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

La revisión completa del sitio encontró que en Economía el menú ofrece «Informes» y «Empresas», pero al entrar en «Informes» el titular, la ruta y el título de pestaña seguían diciendo «Mercados y noticias». Se preparó una propuesta con hojas comparativas (`output/mejora-economia-vistas-20261123/`). A la pregunta «¿Aplico las cuatro que recomiendo, con el cambio de prueba de Economía incluido…?» el fundador respondió: «si».

## Qué cambia

El menú no cambia (cinco entradas, `_plantilla.html` sin tocar, sin `shell:sync`). «Mercados y cotizaciones» deja marcada «Mercados» y «Carteras modelo» deja marcada «Cartera»: ya ocurría así.

| Vista | h1 | Ruta tras «Economía y finanzas ›» | Título de pestaña | Texto de entrada |
|---|---|---|---|---|
| Mercados · Noticias y contexto | Mercados y noticias (igual) | Mercados y noticias (igual) | NUVIA · Mercados y noticias (igual) | igual |
| Mercados · Informes | antes «Mercados y noticias» → **Informes** | antes «Mercados y noticias» → **Mercados y noticias › Informes** | antes «NUVIA · Mercados y noticias» → **NUVIA · Informes de mercado** | **Dos ritmos para comprender la actualidad: la jornada en el diario y una mirada de siete días en el semanal.** |
| Mercados · Mercados y cotizaciones | → **Mercados y cotizaciones** | → **Mercados y noticias › Mercados y cotizaciones** | → **NUVIA · Mercados y cotizaciones** | **Consulta cotizaciones y revisa los acontecimientos económicos y empresariales que pueden mover los mercados.** |
| Cartera · Análisis de cartera | igual | igual | igual | igual |
| Cartera · Carteras modelo | igual | antes «Carteras modelo» → **Análisis de cartera › Carteras modelo** | igual | igual |
| Cartera · Empresas | igual | igual | igual | igual |

**Rótulo sobre el titular.** Se deja «Actualidad económica» en las tres vistas de Mercados. Los rótulos propuestos («Economía en perspectiva», «Datos de mercado») ya aparecen justo debajo, en la cabecera de cada sección, y se repetirían. «Actualidad económica» describe la página entera y no queda incoherente con «Informes» ni con «Mercados y cotizaciones».

**Comportamiento sin cambios.** Las pestañas de Mercados siguen sin modificar la URL, y «Atrás» del navegador se comporta igual que antes. El enlace «Mercados y noticias» de la ruta lleva a `mercados.html` y se alcanza con teclado. Sigue habiendo un solo enlace a `economia.html`.

## Ficheros

- `mercados.html`: el controlador (`textosVista`, `titulo`, `componentDidUpdate`) calcula la vista; la ruta y el texto de entrada se enlazan a la plantilla; el h1 estático lleva `id="mercados-titular"` y lo reescribe el controlador, como ya hace `cartera.html`. Al montar, el título y el titular de la vista pedida en la URL se fijan de inmediato (no esperan al `setState`). El `<title>` estático, la descripción y los metadatos no cambian.
- `cartera.html`: un nivel nuevo de la ruta (`#analysis-parent`), visible solo en Carteras modelo.
- `scripts/check-economia-entry.mjs` y `docs/nuvia-economia-entry.test.mjs`: cambio de pruebas (abajo).

## Cambio de pruebas, con autorización expresa

Ambas quedan cubiertas por la respuesta del fundador («con el cambio de prueba de Economía incluido» → «si»). Ninguna comprobación se ha retirado.

**1. `scripts/check-economia-entry.mjs`** (navegador real). Exigía el h1 «Mercados y noticias» y el título «NUVIA · Mercados y noticias» en todas las rutas de `mercados.html`. Diff resumido:
- Nueva tabla `VISTAS_MERCADOS` (h1, título y ruta de cada vista) y función `textosDeVista`.
- Sustituye las dos comprobaciones fijas por `textosDeVista` con los valores de cada ruta, y añade la ruta completa y un único nivel marcado como actual.
- Repite la comprobación tras cada cambio de pestaña y al volver a Noticias y contexto.
- En `cartera.html?vista=models` exige la ruta «Inicio NUVIA › Economía y finanzas › Análisis de cartera › Carteras modelo».

**2. `docs/nuvia-economia-entry.test.mjs`** (simulación del controlador, sin navegador). Exigía, tras montar el controlador, el título fijo «NUVIA · Mercados y noticias» para todas las consultas, incluidas `informes` y `cotizaciones`. Diff resumido:
- Nueva tabla `TEXTOS_VISTA` (título y h1 de las tres vistas).
- La simulación de `document` gana `getElementById` y un h1 simulado (`mercados-titular`); el controlador no falla en silencio si falta.
- Tras montar, exige en cada ruta (incluidos los alias `diario`, `archivo` y `semanal`) el título y el h1 de su vista; el valor fijo único desaparece.
- Al cambiar de vista con `ir()` y tras `componentDidUpdate()` (lo que hace React tras cada `setState`), exige también el título y el h1 de cada vista.

## Prueba regulatoria (§12 del marco)

Solo cambian titulares, rutas de navegación y títulos de pestaña con palabras que ya existían. No se añaden ni retiran datos, cálculos, fuentes, avisos ni enlaces. NUVIA sigue informando, explicando y calculando, sin recomendar. Sin efecto regulatorio.

## Validación

Resultados literales guardados en `output/mejora-economia-vistas-20261123/` (`validate.log`, `render.log`).

- `npm run validate`, en una sola pasada: código de salida 0 (`EXIT_VALIDATE=0`); última línea: «Render verificado: 51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.»
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 "mercados.html,mercados.html?vista=informes,mercados.html?vista=cotizaciones,cartera.html,cartera.html?vista=models,economia.html"`: «Render verificado: 6 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos…»; salida 0; 42 vistas correctas.
- Navegador (Playwright, 1440 px): las seis vistas, el cambio de pestañas, «Atrás» y los enlaces de la ruta comprobados; sin errores de consola nuevos (solo un aviso de tipo MIME de un módulo, ajeno a este cambio).

### Correcciones propias durante el trabajo

- Mi primera edición dejó los ficheros en CRLF y rompía `informes:check`; se devolvieron a LF. Antes ejecuté a mano `sincronizar.mjs` sin `--check`: solo igualó saltos de línea en el bloque de informes de `mercados.html`.
- El primer intento de `cartera.html` rompía `test:analisis` en su simulación; la búsqueda de `#analysis-parent` es ahora tolerante a que no exista. Esa prueba no se tocó.
- Probé dos formas de poner el h1 en la plantilla (tres h1 por rama, y un enlace de plantilla). La primera rompía una comprobación estática (un solo h1 por vista) y la segunda el patrón de `docs/nuvia-economia-entry.test.mjs`; quedó un h1 estático que reescribe el controlador.

## Lo que no se ha verificado

- 768 px a ojo (solo la comprobación automática de `check-render`).
- Lector de pantalla.
- `npm run build`.
