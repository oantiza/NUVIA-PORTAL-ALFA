# Patrimonio · Rediseño ligero de la portada

Fecha: 22-09-2026.

Orden del fundador: aplicar a la portada de Patrimonio el mismo tipo de rediseño que a Economía (18-09) para que no quede sosa, incluido el tratamiento de Academia en el bloque «Una mirada de conjunto».

## Cambios aplicados

- `estilos/nuvia-components.css`: la sección de ámbitos de Patrimonio comparte el degradado `--nv-surface-page` → `--nv-surface-technical` de Economía (un solo selector `:is()` para las dos).
- `estilos/nuvia-pages-content.css`: «Una mirada de conjunto» se trata como texto editorial, no como secciones. Una primera versión con tres tarjetas, número de agua y ornamento de Academia se descartó por orden del fundador. El bloque queda sin caja: una banda abierta entre filetes horizontales, con la frase en Newsreader a la izquierda y tres párrafos separados por filetes verticales finos. El único color es una raya corta de 28 × 2 px sobre cada título: verde, bronce y azul. En tablet la frase sube arriba y los párrafos quedan en tres columnas. Todo va con selectores `.nv-space-page--patrimonio`, así que Bienestar no cambia, y no se usan variables locales.
- `patrimonio.html`: el bloque editorial sube a continuación del hero, dentro de `<div class="nv-container nv-space-intro">`, como entradilla de la sección. Así se lee antes de las cuatro tarjetas y deja de estar al final de los ámbitos. Solo lleva el filete inferior, que lo separa de «Simuladores y guías patrimoniales».

## Tarjetas con fotografía

- `patrimonio.html`: las cuatro tarjetas llevan la variante `.nv-space-tool-card--photo` de Economía. La banda de imagen es decorativa (`alt=""`, `aria-hidden`, carga diferida).
- `estilos/nuvia-components.css`: encuadre vertical de dos fotos dentro de la banda: planificación al 18 % y jubilación al 42 %.

Las cuatro imágenes las generó el fundador con ImageGen (Codex) a partir de los prompts acordados en la conversación. Son nuevas y no repiten ninguna otra imagen de la web. Los originales (JPEG 2752 × 1536) se guardan en `output/imagegen/patrimonio-card-*-20260922-original.jpg`, fuera de la publicación. Cada una se recortó a 2:1 y se convirtió a WebP 1200 × 600 con calidad 82:

- `src/assets/home/patrimonio-card-vivienda-20260922.webp`: salón de un piso recién estrenado con cajas de mudanza y flexómetro; fachadas de barrio al fondo.
- `src/assets/home/patrimonio-card-jubilacion-20260922.webp`: pareja de unos sesenta años conversando en una terraza de madera junto a un lago de montaña.
- `src/assets/home/patrimonio-card-impuestos-20260922.webp`: archivador metálico con carpetas colgantes, sobres atados, calculadora y libreta.
- `src/assets/home/patrimonio-card-planificacion-20260922.webp`: pareja repasando en la mesa de su casa carpetas, portátil y un esquema familiar en una libreta.

Retoque: ImageGen escribió texto legible en la de impuestos. Había pestañas con «IRPF 2023», «Hacienda» y «verde salvia», sobres con un logotipo parecido al de la Agencia Tributaria y la libreta rotulada. Se aplicó un desenfoque suave y localizado para que no se lea; el original no se ha tocado. En la de jubilación las personas son reconocibles en primer plano. El fundador la aceptó; son rostros generados, no personas reales.

## Revisión interna

Clasificación: VERDE. Es un cambio visual sin funciones nuevas: no toca datos, Firebase ni backend, y los elementos añadidos son decorativos y sin semántica.

## Validación

- `shell:check`, `check-parity`, `check-static-site`, `check-consistencia`, `check-lenguaje` y las pruebas `page-styles`, `academy-banner`, `surfaces`, `navigation-cards`, `patrimonio-entry`, `economia-entry`, `wellbeing-entry`, `page-hierarchy`, `layout-foundations` y `typography-foundations`: correctas.
- Revisión visual a 1440 y 1024 px con la copia local, incluidas las cuatro bandas de imagen.
- Pendiente: `npm run build` y la auditoría de render completa en el equipo del fundador antes de publicar.
