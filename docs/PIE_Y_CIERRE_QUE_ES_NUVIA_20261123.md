# Pie más corto y cierre de «Qué es NUVIA» sobre marfil

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Tras la revisión completa del sitio se prepararon maquetas de antes y después (`output/mejora-pie-cierre-vacias-20261123/`). Sobre las propuestas A (pie más corto), B1 (cierre de Qué es NUVIA sobre marfil) y C (secciones vacías en el menú), el fundador respondió «si» a la pregunta «¿Aplico las cuatro que recomiendo…?». La propuesta C no se aplica.

Al chocar B1 con el contrato visual (`.about-finale` exigía azul noche), se le preguntó «¿Autorizas cambiar el contrato visual para que el cierre de Qué es NUVIA sea marfil?» y respondió: «Sí, cámbialo».

## Qué cambia

### A · Pie

Mismas webs, mismos enlaces (10), mismas frases legales y mismo azul noche (`--nv-surface-deep`). Se reparten en cuatro filas: regreso («Todo está conectado.» / «Inicio NUVIA») con las cuatro webs; enlaces comunes e institucionales; las cuatro frases legales en un solo párrafo corrido; y una fila final con el lema, «Cuatro webs conectadas…» y, al final, el «© 2026 NUVIA. Todos los derechos reservados.». El aviso que algunas páginas llevan encima del pie no se ha tocado.

| Ancho | Antes | Ahora |
|---|---|---|
| 1440 px | 496 px (506 px en Jubilación y Academia) | 317 px |
| 1024 px | 496 / 506 px | 362 px |
| 768 px | no medido | 428 px |

Por debajo de 1100 px el regreso baja a 25 px y las webs a 16 px (valores de la escala del pie en `nuvia-visual-contract.mjs`); con 26 y 18 px `check-render.mjs` marcaba «fuera de escala».

**Nota sobre el orden de tabulación.** `docs/nuvia-navigation.test.mjs` exige el orden de enlaces del pie: cuatro webs, regreso, comunes, institucionales. Para no tocar la prueba, el código conserva ese orden y el regreso se pinta a la izquierda con CSS (`order: -1`). Visualmente va primero «Inicio NUVIA», pero con el teclado se llega primero a las cuatro webs. Si el fundador prefiere que coincidan, habría que cambiar la prueba (línea de «cuatro webs, regreso, dos espacios comunes e información institucional»).

El «©» se coloca al final en el generador (`scripts/ecosistema/shell.mjs`), no en el JSON de `_plantilla.html`, que queda igual.

### B1 · Cierre de Qué es NUVIA

El bloque «NUVIA crece contigo.» pasa de azul noche a marfil (`--nv-surface-hub`, #efeae0), con titular, textos y botón secundario en azul oscuro, botón principal azul noche y logotipo de la firma lineal de la cabecera (`logo-horizontal-lineal-v0402.svg`, ya existente; no se generó ninguna imagen). Se quita el halo circular. El pie queda azul noche, separado del cierre por el cambio de color.

| | Antes | Ahora |
|---|---|---|
| Cierre (1440 px) | 588 px, azul noche | 568 px, marfil |
| Bloque oscuro continuo cierre + pie | 1.094 px | 317 px (solo el pie) |
| Página (1440 px) | 6.960 px | 6.750 px (incluye el pie más corto) |

Contraste de los textos del cierre sobre marfil (medido en el navegador): titular y «Cómo trabajamos» 13,02:1; texto de bienvenida 6,81:1; aviso inferior 4,99:1; botón principal (blanco sobre azul noche) 15,61:1. Todos por encima de 4,5:1.

## Ficheros

- `scripts/ecosistema/shell.mjs`: estructura del pie (cuatro filas, © al final).
- `estilos/ecosistema/webs.css`: reglas del pie. `estilos/ecosistema/interiores.css`: se retiran las reglas del bloque antiguo del pie.
- `estilos/ecosistema/interiores-nuvia.css`: cierre sobre marfil.
- `que-es-nuvia.html`: logotipo del cierre (`src`, `width`, `height`).
- Las 28 páginas con cabecera, sincronizadas con `npm run shell:sync` (incluidas `mercados.html` y `cartera.html`, donde solo cambia el pie).
- `scripts/nuvia-visual-contract.mjs`, línea 38: el fondo esperado de `.about-finale` pasa de `var(--nv-navy-900)` a `var(--nv-surface-hub)`. Es la única prueba modificada, con autorización expresa («Sí, cámbialo»); no se ha relajado ninguna otra.

## Prueba regulatoria (§12 del marco)

Cambio de composición y color. No añade, retira ni reescribe ningún texto legal, enlace, dato ni cálculo; el aviso del cierre y las cinco frases del pie se conservan íntegras (las cuatro del párrafo y el ©, que solo cambia de lugar). Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «Render verificado: 51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.»
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 que-es-nuvia.html,economia.html,jubilacion.html`: «Render verificado: 3 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.»
- Antes del cambio del contrato, `check-render.mjs` sobre otras seis páginas (economia, patrimonio, jubilacion, academia, lecturas y respiracion-relajacion) a los siete anchos: sin fallos.
- Medición propia (1440, 1024 y 768 px) en economia, patrimonio, jubilacion, academia y que-es-nuvia: 10 enlaces en el pie, © como última frase, sin desbordes.
- Capturas revisadas a 1440, 1024 y 768 px en Qué es NUVIA.

## Lo que no se ha verificado

- `npm run build`, la auditoría `npm run auditar` y las pruebas de contraste automáticas fuera de las incluidas en `validate`.
- El pie por debajo de 768 px (solo escritorio y tablet).
- Lectura con lector de pantalla del nuevo orden visual del pie.
