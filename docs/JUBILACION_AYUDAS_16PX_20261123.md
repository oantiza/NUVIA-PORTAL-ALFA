# Ayudas del simulador de jubilación a 16 px

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

En la subida del texto de lectura a 16 px (acta `docs/TEXTO_LECTURA_16PX_20261123.md`) las notas de ayuda, los avisos y las notas de pie del simulador de `jubilacion.html` se dejaron a 14 px a propósito. El público son personas cercanas a la jubilación y esas ayudas son lo que más leen. Se preparó una maqueta por inyección de CSS (hojas en `output/mejora-ayudas-jubilacion-20261123/`, variante mixta 16/15 px y variante de todo a 16 px) y se le preguntó: «¿Aplico los siete cambios que recomiendo…?» (este incluido, en la variante de todo a 16 px). Respuesta literal: «Sí, aplícalos».

Se aplicó la variante de todo a 16 px: el 15 px no está en la escala de `body[data-eco-theme="patrimonio"] main`, y así no se toca ninguna prueba.

## Qué cambia

Solo `estilos/nuvia-jubilacion.css`, regla por regla, sin `!important` y sin tocar HTML ni JS. A `var(--nv-body)` (16 px):

- l.28 `.jb-note, .jb-muted` (14; ojo, `.jb-muted` en las guías sigue a 14 por otra regla más específica)
- l.101 `.jb-field__help` (13) · l.102 `.jb-field__error` (13)
- l.133 `.jb-choices--cards .jb-choice__text span` (13) · l.141 `.jb-check span span` (13)
- l.143 `.jb-hint p` (14) · l.145 `.jb-alert p` (14)
- l.169 `.jb-epsv-box__title span` (13) · l.199 `.jb-live__cap` (13)
- l.249 `.jb-eq__note` (14) · l.297 `.jb-scen__item > span` (13) · l.341 `.jb-disclaimer` (14)

A `var(--nv-body-sm)` (14 px): l.592 `.jb-fuentes small` (era 11,67 por el `small` del navegador).

No cambian etiquetas, cifras, ejes, leyendas, tablas ni pestañas de pasos.

## Medidas (1440 px, alto de página de `jubilacion.html`)

| Vista | Antes | Ahora |
|---|---|---|
| Paso 1 | 7.439 | 7.500 |
| Paso 2 | 7.702 | 7.777 |
| Paso 3 | 7.228 | 7.272 |
| Paso 4 | 7.260 | 7.369 |
| Paso 1 a 1280 px | 7.639 | 7.679 |
| Paso 1 a 1024 px | 9.567 | 9.652 |

Textos cortados con puntos suspensivos: 0 antes y después. Desbordes horizontales: ninguno. La tarjeta «Ejemplo editable» (360 px) cabe a 1440 y 1280 px y pasa debajo a ancho completo a 1024 y 768 px, como antes; las pestañas de pasos caben en los cuatro anchos sin cortar el resumen. Revisado en el navegador: error de campo («El mínimo es 40; se calcula con 40.», 16 px), aviso en el paso 2 y las cinco guías (`guia-planificacion`, `guia-fiscal`, `guia-ahorro`, `guia-calendario`, `guia-sucesiones`) a 1440 y 1024 px, sin desbordes ni cortes. La regla compartida (l.28) no descoloca ninguna guía, así que no se limitó al simulador.

## Ficheros

`estilos/nuvia-jubilacion.css` (13 líneas). Ninguna prueba ni contrato modificados.

## Prueba regulatoria (§12 del marco)

Cambio de tamaño de letra. No añade ni retira contenidos, datos, cálculos, enlaces ni avisos regulatorios; los avisos y descargos se conservan y se leen más grandes. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «Render verificado: 51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» (salida en `output/mejora-ayudas-jubilacion-20261123/validate.log`).
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre `jubilacion`, `guia-planificacion`, `guia-fiscal`, `guia-ahorro`, `guia-calendario` y `guia-sucesiones`: código de salida 0; «Render verificado: 6 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» (salida en `render.log`, misma carpeta).

## Lo que no se ha verificado

- No se ha ejecutado `npm run build` ni se ha probado `dist/`.
- Las guías se revisaron a 1440 y 1024 px con medidas y una captura de `guia-planificacion` a 1440 px; el resto a 1280, 900, 820 y 768 px solo con `check-render`.
- Por debajo de 768 px no se ha medido.
- Estado de error y aviso revisados en un caso cada uno (edad inválida; aviso del paso 2), no en todos.
