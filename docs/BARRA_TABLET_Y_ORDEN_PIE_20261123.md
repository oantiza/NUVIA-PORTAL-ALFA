# Barra azul en tablet estrecha y orden de tabulación del pie

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Pidió resolver «por debajo de 1020 px, Lecturas, Colaboradores y Qué es NUVIA solo están en el pie» y «el orden al tabular con el teclado no coincide con el visual», y respondió «en paralelo despues el comit, npm y publica».

## A · Espacios comunes en tablet estrecha (768 a 1019 px)

**Medición** (barra azul a 13 px, con los tres enlaces forzados a la vista): hacen falta unos 911 px (92 de «Inicio NUVIA», 455 de las cuatro webs y 335 de los tres espacios comunes, con huecos de 14 px). Caben a 1019 px (917 disponibles) y no caben a 900 (810), 820 (738) ni 768 (691): sobran 101, 173 y 232 px.

**Comparación**
- Desplegable `<details>` «Más»: exige cambiar dos pruebas. `docs/nuvia-navigation.test.mjs` exige 0 `<details>` en la cabecera («la barra del ecosistema sustituye al desplegable») y la lista exacta de enlaces de la barra; `scripts/check-navigation-cards.mjs` también rechaza `details` en la cabecera. **No aplicado.** Si el fundador lo quisiera, habría que cambiar esas dos aserciones y la lista de enlaces de la barra.
- Segunda línea de la barra: solo CSS, sin tocar HTML, JavaScript ni pruebas. **Aplicado.** Los tres enlaces quedan visibles, con objetivo de 44 px de alto, y el orden de tabulación coincide con el visual.

**Qué cambia (solo por debajo de 1020 px)**
- Los espacios comunes pasan a una segunda línea de la barra, separada por un filete fino.
- En los cinco espacios comunes el menú propio se oculta a cualquier ancho (repetía los mismos enlaces). La cabecera baja de 157 + menú a 167 px.
- En las webs y sus interiores la cabecera sube de 157 a unos 216 px por debajo de 1020 px (la segunda línea de la barra).
- Desde 1020 px nada cambia: barra de 46 px y cabecera de 125 px, como antes.

## B · Orden de tabulación del pie

**Qué exigen las pruebas.** `docs/nuvia-navigation.test.mjs` (línea de `linksIn(footer)`) y `scripts/check-navigation-cards.mjs` fijan este orden de enlaces del pie: Economía, Patrimonio, Bienestar, Academia, **Inicio NUVIA (regreso)**, Lecturas, Colaboradores, Qué es NUVIA, Cómo trabajamos, Independencia. `shell:check` compara con la plantilla, que ya lo cumple.

**Cambio.** Con `order: -1` el regreso se veía el primero a la izquierda pero se tabulaba el quinto. Se quita `order: -1` (`estilos/ecosistema/webs.css`): el regreso se ve ahora después de las cuatro webs (a la derecha en escritorio y debajo en tablet), igual que se tabula. No se toca ninguna prueba.

Antes → después, posición horizontal a 1440 px: regreso a 100 px → a 949 px; las cuatro webs de 665–1183 px → 100–618 px.

## Ficheros

- `estilos/ecosistema/webs.css` (barra a una o dos líneas, menú de espacios comunes oculto, sin `order: -1`).
- Capturas y guiones en `output/mejora-barra-tablet-pie-20261123/` (`antes-*`, `despues-*`).
- HTML, `_plantilla.html`, `shell.mjs`, JavaScript y pruebas: sin cambios.

## Prueba regulatoria (§12 del marco)

Cambio de composición y de orden visual. No añade ni retira contenidos, enlaces, datos ni cálculos. Sin efecto regulatorio.

## Validación

Ver resultados literales en el informe de la sesión (`render.txt` en la carpeta de salida). Medición propia en 7 páginas y 6 anchos (768, 820, 900, 1019, 1020, 1440): sin desbordes de la barra ni de la página, todos los enlaces dentro de la ventana, objetivos de 44 px o más.

## No verificado

- `npm run validate` y `npm run build` no se han ejecutado (los pasa la dirección).
- No se ha probado con teclado real ni lector de pantalla; el orden se comprobó por orden del código, que no cambia.
