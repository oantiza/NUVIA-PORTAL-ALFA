# Portada · puertas de Patrimonio y Academia intercambiadas

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

La revisión señaló que el aro azul claro de la escultura (color de Academia) quedaba junto a la puerta de Patrimonio, y el de bronce (color de Patrimonio) junto a la de Academia. Vistas las opciones montadas (`output/mejora-portada-aros-20261123/`), se recomendó intercambiar las dos puertas y se preguntó «¿La aplico en local, consultándote si alguna prueba choca?». Respuesta: «si».

## Qué cambia

Solo en escritorio (desde 1180 px, donde las puertas rodean la escultura): Academia NUVIA pasa arriba a la derecha y Patrimonio abajo a la derecha. Cada puerta queda junto al aro de su color. En tablet, donde la escultura va encima de las cuatro puertas, no cambia nada.

- `estilos/ecosistema/hub.css`: `grid-row` de `.hub-door--patrimonio` (de 1 a 2) y de `.hub-door--academia` (de 2 a 1).
- No cambian `index.html`, los textos, los enlaces ni la imagen.

## Lo que conviene saber

- El orden de lectura de la portada en escritorio pasa a ser Economía, Academia, Bienestar, Patrimonio. En la barra azul, el pie y la película sigue siendo Economía, Patrimonio, Bienestar, Academia.
- El orden del código no cambia, así que al tabular con el teclado el foco va de Economía a Patrimonio (abajo a la derecha), a Bienestar y a Academia (arriba a la derecha): no coincide con el orden visual. Igualarlo exige cambiar el orden en `scripts/ecosistema/hub.mjs` y revisar las pruebas que lo comparan; queda a decisión del fundador.

## Prueba regulatoria (§12 del marco)

Cambio de posición de dos accesos. No añade ni retira contenidos ni enlaces. Sin efecto regulatorio.

## Validación

- `node docs/nuvia-academy-banner.test.mjs`, `node docs/nuvia-navigation.test.mjs` y `node scripts/check-navigation-cards.mjs`: código de salida 0. Ninguna prueba se ha cambiado.
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 index.html`: 7 vistas de 7 correctas.
- No se ha ejecutado `npm run validate` ni `npm run build`.

## Publicación

Preguntado «¿Hago commit, paso la compilación y publico el cambio de la portada?», el fundador respondió «Sí, publica».

## Despliegues anteriores que no constaban en ningún acta

- N.º 191 (ejecución 45165841798, commit `48f4ff5`): texto de lectura a 16 px. Orden: «Pasa el npm run build y publica.» `npm run build` con código de salida 0; despliegue correcto; tres hojas de estilo publicadas idénticas a las locales.
- N.º 192 (ejecución 45186964894, commits `c634432` y `1a0387d`): ayudas del simulador, ajustes de coherencia, ampliación de la portada, casillas de Patrimonio, barra en tablet y orden del pie. Orden: «en paralelo despues el comit, npm y publica». `npm run build` con código de salida 0; despliegue correcto; cinco hojas de estilo publicadas idénticas a las locales.
