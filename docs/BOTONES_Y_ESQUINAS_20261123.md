# Regla única de botones y de esquinas

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

La revisión completa del sitio (capturas y medidas en `output/revision-completa-20261123/`) encontró que el botón principal cambiaba de color sin regla y que convivían radios de 3, 4, 5, 6, 8, 12, 20, 22, 24 y 26 px y la píldora. Se preparó una propuesta con maqueta de antes y después (`output/mejora-botones-20261123/hojas/`). A la pregunta de si se aplicaban las cuatro propuestas recomendadas, botones incluidos, el fundador respondió: «si».

## La regla

1. **Botón principal con el acento de su web**, un solo color por web: azul noche en Economía y Academia; bronce 700 en Patrimonio y Lecturas; verde 700 (`#4a5d23`, no el 600) en Bienestar y en los espacios comunes (Qué es NUVIA, Cómo trabajamos, Independencia, Colaboradores). El secundario con contorno usa el mismo acento.
2. **Opción elegida** (pestañas, píldoras, tarjetas de elección): azul noche en todo el sitio, para que «elegido» no se confunda con la acción principal de una web bronce o verde.
3. **Tres radios:** 6 px en botones y pestañas, 12 px en tarjetas y campos, píldora en los chips de valor corto.
4. **Botones suaves** (blanco con filete): texto azul y filete neutro en todo el sitio. `.nv-btn--outline`, que no existía en los componentes, se define como botón suave.

## Cómo se ha hecho

Sin `!important` ni reglas por página. Un par de tokens y un bloque de acento por web hacen el trabajo; los componentes leen el token.

- `--nv-action-primary-bg` y `--nv-action-primary-bg-hover` valen azul noche en `:root` y se redefinen en `body[data-eco-theme="patrimonio"|"lecturas"]` y `.web-page--patrimonio` (bronce 700 y 800), y en `body[data-eco-theme="bienestar"|"nuvia"|"colaboradores"]` y `.web-page--bienestar` (verde 700 y 800).
- `--nv-action-selected-bg` y `--nv-action-selected-text` (azul noche y blanco) son el color único de «opción elegida».
- Se retiran `--nv-action-secondary-*` y `--nv-action-accent-bg`: el secundario y `.nv-btn--accent` leen directamente el token del principal. `.nv-btn--accent` deja de ser otro color y pasa a ser el principal de la web.
- Un token que se define en `:root` con `var()` de otro token se resuelve en `:root`; por eso el secundario lee el token del principal en el propio componente y no en un alias.

## Antes y después

Inventario a 1440 px recorriendo las páginas de `scripts/paginas.mjs` más seis vistas con parámetro (`output/mejora-botones-20261123/inventario*.json`, `resumen_inv*.txt`).

| | Antes | Después |
|---|---|---|
| Fondo del botón principal | Azul, verde 600 y bronce, a veces en la misma página (Jubilación, Impuestos y la guía de planificación mezclaban azul y verde) | Azul (Economía, Academia), bronce 700 (Patrimonio, Lecturas), verde 700 (Metodología, Independencia y los dos ensayos de Bienestar); una sola tonalidad por página |
| Opción elegida | Bronce (Jubilación, Vivienda, guías), azul (Vivienda, Mercados), verde claro (chip de cotizaciones), bronce 800 (filtros de Lecturas) | Azul noche en todo |
| Texto del botón suave | Verde, azul 800 y azul 900 | Azul 900 |
| Radios distintos en elementos interactivos | 10 valores: 0, 3, 4, 6, 8, 12, 22, 24, 26 px y 999 px | 4 valores: 6, 12 y 999 px, más 0 px dentro de un control segmentado y de los enlaces de salto |
| Botones de las portadas de las webs | 4 px | 6 px |
| Estilos distintos de botón (fondo, texto, filete, radio, alto) | 69 | 67 |

Los 67 estilos que quedan ya no se distinguen por color de acento ni por radio sino por función (principal, secundario, suave, elegido, chip, tarjeta de elección) y por tamaño o alto.

## Contraste AA (texto blanco sobre el fondo)

| Fondo | Reposo | Hover |
|---|---|---|
| Azul noche 900 (`#0b2347`) | 15,61 : 1 | 12,18 : 1 (azul 800) |
| Bronce 700 (`#7a5c27`) | 6,20 : 1 | 7,18 : 1 (bronce 800) |
| Verde 700 (`#4a5d23`) | 7,29 : 1 | 8,83 : 1 (verde 800) |

Textos de acento sobre blanco: azul 900, 15,61; bronce 700, 6,20; verde 700, 7,29; bronce 800, 7,18; verde 800, 8,83. Todos superan 4,5 : 1. El comentario del token `--nv-text-editorial` dice 5,3 : 1 para el bronce 700; el cálculo da 6,20 : 1 con blanco.

## Ficheros

Tokens y componentes: `estilos/nuvia-tokens.css`, `estilos/nuvia-components.css`.

Páginas y webs: `estilos/nuvia-page-entry.css` (botón suave y píldoras en azul), `estilos/nuvia-pages-content.css` (píldora activa de Vivienda), `estilos/nuvia-pages-foundations.css` (chip de cotizaciones, enlace de fuente del diálogo de noticias, botones «Marcar» y «Calcular» de los cursos), `estilos/ecosistema/webs.css` (`.web-button`), `economia.css` y `patrimonio.css` (se retiran el fondo y el hover propios del botón de portada), `interiores-patrimonio.css`, `interiores-lecturas.css`, `interiores-economia.css`, `interiores-bienestar.css` e `interiores-academia.css`.

El HTML no cambia. `estilos/ecosistema/webs.css` conserva los saltos de línea CRLF que ya tenía en el árbol de trabajo (los de otra sesión); las demás hojas conservan LF.

## Excepciones que se dejan

- **Tarjetas y contenedores** con 3, 4, 5, 20, 24 o 28 px y formas asimétricas de las imágenes: no son controles; quedan fuera de esta regla.
- **Pasos activos** de Jubilación y de las guías (`.jb-stepper__btn.is-on`, `.jg-route__btn.is-on`, `.jg-route3`): conservan su fondo crema; el azul noche sustituye al bronce en el filete, la barra lateral y el número, no en el relleno entero.
- **Pestañas de capítulo** de Academia (`.curso-tab.is-active`): fondo claro con barra azul; ya eran azules.
- **Control segmentado** de Mercados (`.markets-tools-nav__tab`): radio 0 dentro de un contenedor de 12 px con recorte.
- **Chips sobre fondo oscuro** de Impuestos (`.fiscal-sim__chip.is-active`): blanco con texto azul, por contraste sobre el panel.
- **Descarga del informe de mercado**: el CSS de `nuvia-market-reports.css` se incrusta en los informes descargables y una prueba exige que coincida; el radio de 6 px se aplica solo en la página (`interiores-economia.css`) y el fichero descargable conserva 8 px.
- **Portada común** (`index.html`): el botón «Qué es NUVIA» conserva su píldora y su azul propios; su hoja es `hub.css`.
- **Cabecera, pie y cierre de Qué es NUVIA**: no se tocan. Se comprobó que los botones oscuros del cierre sobre marfil siguen igual.
- **Bienestar**: se deja el enlace actual de la portada; no se añade el botón sólido de la maqueta.

## Prueba regulatoria (§12 del marco)

Cambio de color y de forma de controles. No añade ni retira contenidos, enlaces, datos, cálculos ni textos. Sin efecto regulatorio.

## Validación

- `npm run validate`, en una pasada: código de salida 0; «Render verificado: 51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.». La primera pasada falló en `docs/nuvia-informes-mercado.test.mjs` porque el radio del botón de descarga se había cambiado en `nuvia-market-reports.css`, que se incrusta en los informes descargables; se revirtió y el radio se aplica solo en la página. Ninguna prueba se ha modificado.
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre 17 páginas (Jubilación, Vivienda, Impuestos, las guías fiscal y de ahorro, Patrimonio, Bienestar, Respiración, Cómo trabajamos, Independencia, Lecturas, Mercados, Cartera, Economía, Academia, Curso y Qué es NUVIA): código de salida 0; 119 vistas de 119 correctas.
- Revisión en el navegador a 1440 px: Jubilación, Vivienda, Mercados (cotizaciones), Lecturas, Cómo trabajamos, calculadora de Academia, Patrimonio, Bienestar y el cierre de Qué es NUVIA (sus botones oscuros sobre marfil siguen igual).
- Inventario repetido tras aplicar (`output/mejora-botones-20261123/inventario.json`): una sola tonalidad de botón principal por página; radios en controles reducidos a 6, 12 y 999 px (más el 0 de los casos descritos arriba).
- **No verificado:** no se ha ejecutado `npm run build`; no se ha revisado el aspecto a menos de 1440 px más allá de las comprobaciones automáticas; las páginas `temas.html`, `guia-calendario.html`, `guia-sucesiones.html`, `guia-planificacion.html` y las vistas de Academia distintas de la calculadora se cubren por el inventario y por el render, no a ojo.
- Saltos de línea: `webs.css` e `INDICE.md` estaban en CRLF en el árbol de trabajo antes de esta sesión (Git los espera en LF y avisa); se editaron respetando su formato y quedan como estaban.
