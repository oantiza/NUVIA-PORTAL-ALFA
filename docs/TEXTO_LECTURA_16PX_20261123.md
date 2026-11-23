# Texto de lectura a 16 px en Economía, Patrimonio y Bienestar

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

La revisión completa del sitio midió que en Economía, Patrimonio y Bienestar entre el 40 % y el 70 % del texto iba a 14 px y entre el 10 % y el 33 % a 12 px. Se preparó una maqueta por inyección de CSS (hojas antes/propuesta en `output/mejora-texto-16px-20261123/`) y se le preguntó: «¿Aplico el texto de lectura a 16 px, con el cambio de la escala de Patrimonio?». Respuesta literal: «Sí, aplícalo».

## La escala

| Nivel | Tamaño | Qué entra |
|---|---|---|
| Lectura | 16 px (`--nv-body`) | Párrafos, descripciones y listas de contenido: introducciones de sección, tarjetas, listas de «qué aprenderás», pasos del método, normas, textos de las guías |
| Secundario | 14 px | Notas, avisos, ayudas, descargos y notas de pie que iban a 12 o 13 px |
| Etiquetas | 12–13 px | Cabeceras y celdas de tabla, ejes y rótulos de gráficos, chips, etiquetas de formulario, pestañas, kickers, migas, pie |

No cambian `--nv-body`, `--nv-body-sm` ni `--nv-label` globales: subir los tokens ya falló el 22-11-2026 y rompería las pruebas de controles, avisos y tablas (14 px). Se cambia regla por regla en la hoja de origen, sin `!important` nuevo y sin selectores amplios. La maqueta usaba selectores por atributo y hacía crecer la cabecera de la tabla de índices de Mercados («EN EL AÑO» quedaba cortada); la aplicación real no toca tablas ni controles.

## Ficheros y reglas

Todas las reglas pasan a `var(--nv-body)` salvo donde se indica.

- `estilos/nuvia-jubilacion.css`: `.jb-method__steps p` (era 13), `.jb-bullets` (13), `.jb-card__lead`, `.jg-card__foot`, `.jg-questions li`, `.jg-dark p`, `.jg-docs li`, `.jg-norma`, `.jb-terr__norma`, `.jb-intro__scope`. A `var(--nv-body-sm)` (secundario): `.jb-disclaimer`, `.jb-eq__note`, `.jg-privacy` (eran 13).
- `estilos/nuvia-components.css`: `.nv-section-heading p`, `.nv-card p`.
- `estilos/nuvia-pages-content.css`: `.gu-text--fill`, `.gu-rule-top`, `.gt-aprender__lista li`, `.gt-lista-check li`, `.jub-howto__text`, `.tm-card__text`, `.viv-card__lead`, `.viv-card__head p`.
- `estilos/nuvia-pages-cartera.css`: `.nv-modelos__composicion`, `.nv-modelos__tema`.
- `estilos/nuvia-pages-foundations.css`: `.markets-quotes__note` 12 → 14 px.
- `estilos/nuvia-bienestar.css`: `.bn-sources__text p:last-child`.
- `estilos/nuvia-fiscal.css`: `.fiscal-errores p`.
- `estilos/ecosistema/economia.css`: `.ec-section-intro > p`, `.ec-entry > p`, `.ec-learning p` y el ajuste de tablet de las dos primeras (era 13); `.ec-note p` 12 → 14 px.
- `estilos/ecosistema/patrimonio.css`: `.pa-areas-intro p` (era 15), `.pa-area > div > p`, `.pa-perspective p` (15); `.pa-note` 12 → 14 px.
- `estilos/ecosistema/bienestar.css`: `.bi-section-heading > p`, `.bi-topic > p`, `.bi-sources .bn-sources__text > p:last-child`; `.bi-sources-notice p` 13 → 14 px.
- `estilos/ecosistema/interiores-academia.css`: subtítulo de cada término del glosario de Academia (`.ac-x232`) 12 → 14 px.

El HTML no cambia.

## La prueba que cambia (autorizada)

`scripts/nuvia-visual-contract.mjs:56`, escala de `.web-page--patrimonio`: se añade 16 → `[12, 13, 14, 15, 16, 17, 21, 23, 29, 33, 39, 41, 49]`. Sin ese 16 la portada de Patrimonio (y `temas.html`) daba 7 avisos de escala cada una. No se ha modificado ninguna otra prueba.

## Medidas reales (1440 px)

Reparto de caracteres de texto visible por tamaño (% a 12 / 13 / 14 / 15 / 16 px) y alto de página.

| Página | Antes | Ahora | Alto antes → ahora |
|---|---|---|---|
| economia.html | 21/19/39/0/6 | 13/19/19/0/34 | 1.808 → 1.836 |
| patrimonio.html | 19/23/27/11/1 | 12/23/17/0/29 | 2.080 → 2.145 |
| bienestar.html | 19/23/37/0/7 | 19/16/21/0/30 | 2.375 → 2.421 |
| mercados.html | 27/15/35/0/4 | 22/15/36/0/8 | 2.662 → 2.668 |
| mercados.html?vista=cotizaciones | 31/16/43/0/4 | 31/16/39/0/8 | 3.052 → 3.062 |
| cartera.html | 13/16/27/0/38 | 13/16/27/0/38 | 2.545 → 2.545 |
| vivienda.html | 23/9/53/0/7 | 23/9/49/0/11 | 3.160 → 3.170 |
| jubilacion.html | 3/45/38/0/8 | 3/23/24/0/43 | 7.154 → 7.439 |
| fiscalidad.html | 32/10/26/0/22 | 32/10/17/0/30 | 3.230 → 3.242 |
| guia-fiscal.html | 19/4/59/0/10 | 19/4/39/0/30 | 5.808 → 5.938 |
| guia-planificacion.html | 6/28/52/0/3 | 6/26/39/0/18 | 2.996 → 3.012 |
| guia-ahorro.html | 10/4/66/0/11 | 10/4/37/0/41 | 7.090 → 7.244 |
| respiracion-relajacion.html | 16/24/38/0/12 | 16/24/25/0/25 | 1.673 → 1.685 |
| academia.html?tab=glosario | 47/19/16/0/6 | 9/19/53/0/6 | 2.580 → 2.623 |
| academia.html, ?tab=fundamentos, cartera | sin cambio | sin cambio | sin cambio |

Medida con script propio sobre las mismas páginas a 1440, 1280, 1024 y 768 px, comparando antes y después: textos cortados con puntos suspensivos, desbordes horizontales, celdas o tablas que no caben, solapes de texto en gráficos y entre pestañas, controles que pasan a dos líneas y avisos de escala. **Ninguno nuevo en ningún ancho.** Los altos a 1280, 1024 y 768 px crecen en la misma proporción (por ejemplo, Jubilación a 1024 px: 9.238 → 9.567; a 768 px: 10.723 → 11.032).

Quedan a 14 px a propósito: notas y ayudas del simulador (`.jb-note`, `.jb-hint`), avisos (`.nv-note`, `.nv-notice`), notas de pie de las guías (`.gu-foot`), `.pa-tool-note`, `.nv-modelos__nota`. Las tablas, los controles y las etiquetas del simulador (13 px) no cambian. El Vivienda queda en 11 % a 16 px porque casi todo su texto son campos, tablas y avisos.

Revisado en el navegador a 1440 px: Jubilación (cabecera y simulador con pestañas, gráficos y tarjetas), Mercados (cabecera de la tabla de índices con «EN EL AÑO» entera), Vivienda y glosario de Academia.

## Prueba regulatoria (§12 del marco)

Cambio de tamaño de letra. No añade ni retira contenidos, datos, cálculos, enlaces ni avisos regulatorios. Los avisos y descargos se conservan; los que iban a 12 o 13 px suben a 14 px. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «Render verificado: 51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» (salida en `output/mejora-texto-16px-20261123/validate.txt`).
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre 16 páginas: salida en `output/mejora-texto-16px-20261123/render.txt`.

Código de salida 0 y línea final literal: «Render verificado: 16 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» (112 vistas, todas OK).

## Lo que no se ha verificado

- No se ha ejecutado `npm run build` ni se ha probado el sitio compilado (`dist/`).
- La revisión en el navegador fue a 1440 px; a 1280, 1024 y 768 px solo con medidas.
- `cartera.html?vista=companies` carga vacío en local, así que no se ha medido.
- Parte de los párrafos sin clase propia hereda su tamaño de reglas con la propiedad `font` abreviada; el recuento de texto a 14 px que queda incluye también textos de notas y avisos que se dejan así a propósito.
