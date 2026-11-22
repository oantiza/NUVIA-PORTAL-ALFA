# Portadas de las cuatro webs · esqueleto común

**Fecha:** 22-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Punto 3 del traspaso (`docs/TRASPASO_A_CLAUDE_CODE_20261122.md`). El fundador eligió empezar por las portadas («Antes las portadas»), vio una primera maqueta en el navegador y respondió «Sí, afínalo»; vista la maqueta afinada y avisado de que exigía cambiar el contrato de titulares, respondió «Sí, aplícalo».

## Qué cambia

Las cuatro aperturas (Economía y finanzas, Patrimonio, Familia y bienestar, Academia NUVIA) comparten ahora la misma estructura. Cada web conserva su imagen, su color y su fondo.

| Medida | Antes (Economía · Patrimonio · Bienestar · Academia) | Ahora, las cuatro |
|---|---|---|
| Titular a 1440 px | 86 · 78 · 76 · 90 px | 80 px, `clamp(56px, 5.6vw, 80px)` |
| Arranque del titular | 312 · 308 · 275 · 287 px | 309 px |
| Alto de la apertura | 528 · 604 · 668 · — | 580 px (470 px desde 1024 px de ancho) |
| Composición | texto-imagen · texto-foto · texto arriba y foto ancha · imagen-texto | texto a la izquierda, imagen a la derecha |
| Columnas | distintas en cada web | `1.15fr / .85fr`, separación `clamp(28px, 4.4vw, 64px)` |

- **Familia y bienestar:** la fotografía pasa de banda ancha bajo el texto a la columna derecha (460 px de alto, 380 px en tablet), reencuadrada para que se vea a las dos personas (`object-position: 74% 20%`; `90% 20%` por debajo de 1000 px).
- **Academia:** la pieza pasa a la derecha y el texto a la izquierda (`order: -1`; el HTML no cambia).
- **Patrimonio:** el texto de entrada sigue a 17 px, porque 16 px no figura en la escala tipográfica de esa web; la frase «La vida cambia. Las preguntas también.» sube 8 px para que la apertura mida lo mismo que las demás.
- Rótulo sobre el titular: 14 px, peso 500 y 22 px de separación en las cuatro.

No cambian los textos, los enlaces, las imágenes ni el HTML de ninguna portada.

## Ficheros

- `estilos/ecosistema/economia.css`, `patrimonio.css`, `bienestar.css`, `academia.css`: reglas de la apertura y eliminación de los tamaños de titular propios de cada ancho.
- `scripts/nuvia-visual-contract.mjs`: los cuatro titulares de `TITLE_CONTRACT` pasan a `clamp(56px, 5.6vw, 80px)` sin sustituciones por ancho. Es un cambio del contrato, autorizado expresamente por el fundador.

## Prueba regulatoria (§12 del marco)

Cambio de composición y tamaño. No añade ni retira contenidos, funciones, datos, cálculos ni enlaces; no introduce recomendaciones, juicios de idoneidad ni llamadas a operar. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 economia.html,patrimonio.html,bienestar.html,academia.html`: 28 vistas de 28 correctas.
- Medido en navegador: titular a 80 px y arranque en 309 px en las cuatro a 1440 × 900; apertura de 580 px en las cuatro; sin desbordes a 1024 ni a 768 px (Economía, Patrimonio, Bienestar y Academia).
- No se ha ejecutado `npm run build`.

## Relacionado

Las piezas de Economía y Academia se sustituyeron después por un globo y un ábaco modelados en Blender: `docs/PIEZAS_BLENDER_ECONOMIA_ACADEMIA_20261122.md`.
