# Qué es NUVIA · versión prudente · 23-11-2026

Estado: aplicado en local. Sin commit, push ni despliegue.

## Orden del fundador

Se le propuso: «Quita el lema… como bloque propio, porque ya es la última línea del pie… Alinea a la izquierda los titulares "Qué puedes hacer aquí" y "Nuestro espíritu"… habría que retocar el texto de un mensaje de una prueba». Respondió: «el resto tus peropuestas». Se conserva el aviso del cierre (`about-finale__disclaimer`).

Propuesta y hojas comparativas: `output/mejora-que-es-nuvia-20261123/PROPUESTA.md`.

## Qué se quita

- `<section class="about-principle">` de `que-es-nuvia.html` («NUVIA informa, explica y calcula. Tú comprendes y decides.» como bloque propio). El lema sigue, idéntico, como primera línea de la franja inferior del pie.
- Sus reglas en `estilos/ecosistema/interiores-nuvia.css` (fondo, tamaño 43 px, `strong` verde y tamaño 35 px a ≤ 859 px).

## Qué se ordena

- «Qué puedes hacer aquí» (`about-start-heading`) y «Nuestro espíritu» (`about-values__heading`): etiqueta encima y titular a la izquierda, como «NUVIA, en imágenes». Antes quedaban a la derecha (x = 1019 y 1063 a 1440 px; 671 y 715 a 1024 px).
- Ajuste responsive de `about-values__heading` (≤ 859 px): hueco de 24 a 14 px para mantener el mismo ritmo.

## Vídeo sin subtítulos al empezar

Orden relayada: «y a la película sin subtítulos». Preguntado qué quería decir, el fundador eligió: «Que no salgan al empezar: los subtítulos siguen disponibles en el menú del reproductor, pero el vídeo arranca sin ellos».

Cambio: en `<track kind="captions" …>` de `que-es-nuvia.html` se quita solo `default="default"`. Siguen la pista, `srclang="es"`, `label="Español"`, el fichero `.vtt` y la transcripción escrita.

Comprobado en Chromium (Playwright): una pista «Español» (es), sin `default`; modo inicial `disabled`; tras reproducir sigue `disabled`; al elegirla pasa a `showing` con 30 cues cargados. El menú nativo del reproductor no se pulsó (se fijó `mode` por script).

Ninguna prueba ni script exige `default`: búsqueda de `track`, `captions`, `textTracks`, `default` y `.vtt` en `docs/`, `scripts/`, `nuvia-site-unified.js` y `js/` sin coincidencias salvo el tipo MIME en `scripts/serve-local.mjs:20`. `docs/nuvia-reproductores.test.mjs` pasa.

## Prueba

`docs/nuvia-definicion.test.mjs:41`: solo el texto del mensaje, de «El principio central canónico ocupa un bloque visible» a «El principio central canónico sigue en la página, en la última línea del pie». La expresión regular no cambia.

## Medidas (servidor local sobre el código fuente, 900 px de alto)

| | 1440 px | 1024 px |
|---|---|---|
| Antes | 6.750 | 6.737 |
| Después | 6.576 (−174) | 6.564 (−173) |

`about-start` 324 → 360 y 386 (1440 / 1024); `about-values` 640 → 686 y 690 → 736; `about-principle` −255. El cierre queda en 568.

Las cuatro anclas de `about-index` existen y, al pulsarlas, dejan el destino en pantalla: `#about-conviction`, `#about-purpose-title`, `#about-world-title`, `#about-values-title`. No hay enlaces a secciones de esta página desde otras.

## Prueba regulatoria (§12 del marco)

Sin función, cálculo, dato, IA, colaborador ni monetización nuevos. Solo se retira un bloque cuyo texto sigue en el pie y se cambia la alineación de dos titulares. No se escribe texto nuevo ni se altera el aviso de alcance educativo.

## Validación

- `node docs/nuvia-definicion.test.mjs`: «Definición NUVIA: 30 enunciados canónicos presentes».
- `node docs/nuvia-navigation.test.mjs`: «Navegación: 28 páginas, cuatro webs, dos espacios comunes, confianza y todos los recursos alcanzables».
- `node docs/nuvia-editorial-clarity.test.mjs`: «Claridad editorial: autora y fichas íntegras…».
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 que-es-nuvia.html`: OK en los siete anchos, todos los contadores a 0, consola limpia.

## Sin verificar

- Subtítulos: menú nativo del reproductor sin pulsar; probado solo en Chromium.
- `npm run validate`, `npm run auditar` y `npm run build` (los ejecuta la dirección con todo junto).
- `scripts/nuvia-visual-contract.mjs:35` (fondo de `.about-principle`) no se ha tocado: `check-render` no lo marca porque solo evalúa cajas visibles.
- Quedan reglas base de `.about-principle` sin uso en `estilos/nuvia-page-entry.css:129,131` y `estilos/nuvia-pages-foundations.css:2158-2351`; no se han tocado por quedar fuera del alcance.
- `dist/` no se ha regenerado.
