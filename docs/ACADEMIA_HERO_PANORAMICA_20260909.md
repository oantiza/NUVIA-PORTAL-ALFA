# Academia · Ampliación de la fotografía hacia la derecha

Fecha: 09-09-2026.

Petición del fundador: prolongar la fotografía del hero interior hasta el borde derecho con contenido nuevo, conservando el grupo aproximadamente en su posición actual o algo más a la derecha.

## Resultado e integración

- Archivo final: `src/assets/home/academia-aula-ampliada-derecha-20260909.webp` (2172 × 384 px, 168574 bytes, WebP calidad 90).
- SHA-256: `8db289ad4b3d8b4c65987079a9c8fb06faa0216ae8415288d039edc6b681d8fa`.
- Editada con la herramienta integrada ImageGen a partir de `academia-finanzas-moderna-20260909.webp`. Se genera la prolongación del aula con ventanas, mesas, sillas vacías y plantas. No se estira la fotografía ni se repiten personas.
- Original generado: `output/imagegen/academia-aula-ampliada-derecha-20260909.png`. El formato de salida lleva bandas negras de composición; para preparar el recurso web se extrae únicamente la franja fotográfica (x=0, y=171, ancho=2172, alto=384) y se convierte a WebP mediante Sharp.
- Consumida solo por `academia.html`; la fotografía de Academia en la Home global conserva su archivo anterior.
- Hero: 400 px en escritorio y 272 px en tablet. La fotografía empieza junto al contenido y se prolonga hasta el extremo derecho. Solo su borde izquierdo se funde con el fondo azul; el velo del texto se conserva.
- Ajuste solicitado durante la revisión: texto a la izquierda sobre una base más oscura (94% de opacidad inicial con transición gradual) y encuadre del grupo 64 px hacia la derecha a partir de 1600 px de ancho, manteniendo la fotografía hasta el extremo derecho.

## Revisión interna

Cambio visual de la misma escena educativa; mantiene la clasificación verde y las 18 respuestas de `ACADEMIA_BANNERS_AULA_20260909.md`. Actualización de las respuestas 3 y 16: ampliación generativa de una imagen estática con la herramienta integrada ImageGen; sin IA interactiva ni cambios funcionales. Las personas y gráficos siguen siendo ficticios. No se incorporan datos personales, instrumentos identificables, recomendaciones, vínculos comerciales ni nuevas acciones. No se modifica Firebase ni se publica.

## Prompt final utilizado

Validación: compilación local, referencias estáticas y prueba existente de banners correctas. Auditoría de `academia.html` a 768, 1440, 2560 y 3840 px sin fallos de contraste, estructura, desbordamiento ni interacción; registro en `output/academia-hero-ampliado-derecha.log`. Revisión visual en navegador de cabezas, manos, libros, lectura y continuidad hasta el borde derecho.

```text
Use case: identity-preserve, photographic outpainting for an extremely shallow website hero.
Input 1 is the exact EDIT TARGET. Preserve the three adults, faces, expressions, clothing, arrangement, studying poses and open book. Extend the original classroom only to the RIGHT with matching light oak table, empty grey chairs, tall windows with greenery, and a restrained plant. Same lighting and perspective. Exactly three people, no logos, added writing, duplicated people or artificial blur.
CRITICAL COMPOSITION / DELIVERY: produce a LETTERBOXED ultra-wide photograph. Output canvas 3:1. Across the exact MIDDLE HALF of the canvas height, place a 6:1 panorama occupying the entire width. The top 25% and bottom 25% of the canvas MUST be pure solid black horizontal letterbox bars, not more room. The central photographic strip must be exactly full width and half the output height. The original 3:1 input photograph, unchanged in proportions and including the ENTIRE original view, occupies the LEFT HALF of that photographic strip. New room content occupies the RIGHT HALF. Thus the original entire image is scaled to half the canvas width and half the canvas height, between y=25% and y=75%, and is extended horizontally to the right. Do not let any face, head, hand, or study material extend into the black bars. All three adults' heads and the table/books must be fully visible inside the middle strip. Do not enlarge the people to fill the whole canvas. Main people group is small in the overall canvas, centered near x=38% and y=50%. This is intentionally an EXTREMELY WIDE, SHORT PANORAMA with horizontal black letterboxing. Do not output a normal 3:1 unletterboxed photo. The classroom continues naturally to the extreme right of the central strip; no fading or vignette there. One continuous realistic photograph in the center strip, not a collage.
```
