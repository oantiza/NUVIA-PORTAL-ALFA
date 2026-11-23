# Portada: ampliación en monitores grandes · 23-11-2026

## Orden del fundador
Revisión del sitio: «en tu monitor de 2560 px se ve pequeña». Respuesta a la propuesta de cierre: «en paralelo despues el comit, npm y publica». Este acta cubre solo la ampliación; el commit, la compilación y la publicación los hace la dirección.

## Cambio (solo `estilos/ecosistema/hub.css`, bloque final de `zoom`)
Antes, tres escalones (1,2 / 1,4 / 1,6) con alturas mínimas de 1.400 / 1.620 / 1.850 px: una ventana de 2560 × 1271 se quedaba a escala 1.

Medido: la portada mide unos 1.002 px a escala 1 y su alto crece en proporción a la escala; a 1.440 px de ancho el ancho útil ya llega a 1.440 × escala (con 1,6 a 1.920 px aparece barra horizontal). Escalones nuevos, cada uno con ≈ 40 px de aire (1.002 × escala + 40):

| Escala | Mínimo ancho | Mínimo alto |
|---|---|---|
| 1,1 | 1900 | 1140 |
| 1,2 | 1900 | 1245 |
| 1,3 | 1900 | 1345 |
| 1,4 | 1900 | 1445 |
| 1,5 | 1900 | 1545 |
| 1,6 | 2000 | 1645 |

Por debajo de 1900 px de ancho no cambia nada. Columnas, titulares, textos e imagen, intactos.

## Medidas (Chromium, Playwright)
| Ventana | Antes: escala · alto doc. | Después: escala · alto doc. · holgura |
|---|---|---|
| 1440 × 900 | 1 · 1001 (barra vertical ya existente) | igual |
| 1920 × 1080 | 1 · 1080 | 1 · 1080 |
| 2560 × 1271 | 1 · 1271 | 1,2 · 1271 · ≈ 70 px |
| 2560 × 1440 | 1,2 · 1440 | 1,3 · 1440 · ≈ 138 px |
| 3440 × 1440 | 1,2 · 1440 | 1,3 · 1440 · ≈ 138 px |

Comprobados también los bordes de cada escalón (1900×1139/1140, 2560×1444/1445, 1999/2000 de ancho, 3840×2160 → 1,6): en todos, sin barra vertical ni horizontal.
Capturas: `output/portada-ampliacion-20261123/`.

## Prueba regulatoria §12
Cambio solo de presentación (tamaño de la portada en pantallas grandes): no toca cálculos, datos, IA, colaboradores, monetización ni datos personales. Sin ficha regulatoria nueva.

## Validación
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 index.html`: OK en los siete anchos, todos los contadores a 0, consola limpia.
- `node docs/nuvia-academy-banner.test.mjs`: pasa.
- No ejecutados `npm run validate` ni `npm run build` (los pasa la dirección).

## No verificado
- Solo Chromium; Safari/Firefox (`zoom` en Firefox ≥ 126) no probados.
- Ventanas reales con barra de herramientas del navegador: el alto útil es el de la ventana, no el del monitor.
- A 2560 × 1440 se pudo llegar a 1,4 con 39 px de aire; se dejó 1,3 por margen (el umbral 1,4 empieza en 1445).
