# Jubilación · texto pequeño del simulador a 13 px

**Fecha:** 22-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Punto 3 del traspaso (escala tipográfica de interiores). El fundador aprobó subir el texto pequeño un punto. La prueba del cambio global falló en dos comprobaciones y se deshizo; consultado, respondió: «Solo Jubilación».

## Por qué no se hizo global

Probado sobre los valores comunes de `estilos/nuvia-tokens.css` y restaurado después:

- `--nv-body-sm` 14→15: 15 px no pertenece a la escala tipográfica de los interiores de Economía ni de Patrimonio (Mercados 18 avisos, Cartera 16, Vivienda 15, Jubilación 38, Impuestos 7).
- `--nv-label` 12→13: 13 px queda fuera de la escala de `sistema-visual.html` (10 avisos) y, en Academia › Fundamentos, la cifra del gráfico histórico invade la zona de trazado.

Hacerlo global exige cambiar pruebas; el fundador eligió no hacerlo.

## Qué cambia

Solo en `jubilacion.html`, dentro de `main`. Cabecera y pie no cambian.

- `estilos/nuvia-jubilacion.css`: `.nv-retirement main:has(.jb-stepper) { --nv-label: 13px; }`. El texto del simulador que iba a 12 px pasa a 13 px. 13 px ya figura en la escala de Patrimonio, así que no se modifica ninguna prueba.
- Misma hoja, pestañas de pasos (`.jb-stepper__btn`): separación de 12 a 8 px y relleno lateral de 12 a 10 px, para que «65 años · 2.000 €/paga» entre entera a 1440 px.

Las guías que comparten la hoja (`guia-fiscal.html`, `guia-planificacion.html` y las demás) no tienen simulador y no cambian.

## Medidas

| | Antes | Ahora |
|---|---|---|
| Texto a 12 px en el simulador (1440 px) | 60 % | 7 % |
| Texto a 13 px | — | 53 % |
| Alto de la página a 1440 px | 7.503 px | 7.595 px |
| Textos cortados con puntos suspensivos a 1440 px | ninguno | ninguno |

A 1280 px la pestaña «65 años · 2.000 €/paga» se corta con puntos suspensivos (le faltan 14 px). No se midió cómo quedaba a ese ancho antes del cambio.

## Prueba regulatoria (§12 del marco)

Cambio de tamaño de letra. No altera cálculos, datos, textos ni enlaces. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre `jubilacion.html`, `jubilacion.html?territorio=estatal&ccaa=cataluna#resultados`, `guia-fiscal.html`, `academia.html?tab=fundamentos` y `sistema-visual.html`: 35 vistas de 35 correctas.
- No se ha ejecutado `npm run build`.
