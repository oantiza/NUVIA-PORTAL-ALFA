# Portada del ecosistema · escala, fondo marfil y color por puerta · 22-11-2026

**Estado:** aplicado en local, **sin commit ni publicación**. El fundador indicó: «empieza por la portada y sigue con la cabecera y el pie comunes. Pero no publiques nada hasta que yo no te lo diga». La web publicada sigue con la versión anterior.

## Orden del fundador

Pidió examinar a fondo la portada y las cuatro webs y proponer mejoras («quizás el color de fondo, quizás la tipografía, aumentar el tamaño de alguna letra»), conservando el elemento central y la disposición, que le gustan. Aportó además un prototipo propio con seis fondos, botón cápsula y logotipo ampliado. Tras ver las maquetas autorizó empezar por la portada. La propuesta completa y las mediciones están en el proyecto de Claude (`PROPUESTA_PORTADA_Y_CUATRO_WEBS_2026-11-22.md`).

## Cambios

Se conservan la escultura, la disposición, los textos, los destinos y la estructura HTML. Cambia la presentación:

| Elemento | Antes | Ahora |
|---|---|---|
| Fondo | Blanco cálido plano (`color-mix` papel 38 %) | Marfil (`--nv-surface-hub`) con luz tras la escultura y base algo más densa |
| Titular | 104 px, interletrado −0,055 em | 104 px, interletrado −0,04 em |
| Entradilla | 15 px | 19 px (17 px hasta 1179 px) |
| Puertas | Título 33 px · frase 14 px · acción 12 px | Título 38 px · frase 17 px · acción 15 px en negrita (escala menor por tramos de ancho) |
| Marca de cada puerta | Punto de 7 px; Economía y Academia con el mismo azul | Barra de 44 × 3 px con el color de su aro; al pasar el cursor recorre todo el filete |
| «Qué es NUVIA» | Enlace (en local, 33 px Newsreader sin publicar) | Cápsula azul NUVIA con círculo bronce, 16 px, 48 px de alto |
| Logotipo | 280 × 70 px | 300 × 75 px (280 × 70 hasta 999 px) |
| Franja inferior | Dos franjas apiladas, enlaces a 13–14 px | Una fila: «La curiosidad nos une» + Lecturas + Colaboradores, y a la derecha las herramientas; enlaces a 16 px. Al abrir las herramientas su rejilla ocupa todo el ancho. Hasta 1279 px, dos filas |
| Pie | 12 px | 14 px |
| Pantallas grandes | Tope de 1180 px: en 2560 px ocupaba el 46 % del ancho | Ampliación por pasos (`zoom` 1,12 → 1,7) según ancho y alto de ventana, de modo que el escenario completo sigue visible |

Archivos: `estilos/ecosistema/hub.css` (reescrito sobre la misma estructura), `estilos/nuvia-tokens.css` (tokens nuevos), `scripts/ecosistema/hub.mjs` e `index.html` (envoltorio `.hub-common` alrededor de las dos secciones inferiores), `scripts/nuvia-visual-contract.mjs` (superficie y escala tipográfica de `.hub-page`), `scripts/check-render.mjs` (ancho del escenario: 1240 px) y `docs/nuvia-academy-banner.test.mjs` (columnas 345 px).

Tokens añadidos: `--nv-sky-700` y `--nv-sky-400` (azul claro de Academia, texto y filete) y `--nv-surface-hub`, `--nv-surface-hub-light`, `--nv-surface-hub-deep` (derivados de papel, blanco y bronce con `color-mix`; no introducen hexadecimales nuevos).

El cambio local anterior del enlace «Qué es NUVIA» a 33 px (acta del 14-11-2026, sin publicar) queda sustituido por la cápsula. Copia de aquel `hub.css` fuera del repositorio, en la sesión de trabajo.

## Prueba del §12 del marco regulatorio

- (1–4) Presentación de la entrada común y de sus cuatro accesos; no se recogen datos ni cambia ningún destino.
- (5–11) Cambian tamaños, fondo y color de los filetes. Los colores identifican cada web por su aro; no califican instrumentos ni expresan atractivo inversor. No hay instrumentos, circunstancias personales, precios, comparativas ni veredictos.
- (12–17) Sin contacto, contratación, ejecución, incentivos, tratamiento de datos, IA, cifras ni fuentes nuevas. Sin peticiones a terceros: fuentes e imagen siguen siendo locales.
- (18) Validación descrita abajo.

**Clasificación interna** · Verde, presentación y navegación.

## Validación realizada

- Superadas en local: `shell:check`, `check-parity`, `check-static-site`, `check-consistencia` (30 páginas), `check-lenguaje`, y las pruebas de estilos de página, portada del ecosistema, Lecturas, navegación, superficies, fundamentos tipográficos y de disposición, metadatos, jerarquía, tarjetas de navegación y definición.
- Comprobación propia con Chrome a 20 tamaños de ventana (768 a 2560 px): todas las medidas de texto dentro de la escala declarada, sin desbordes, todos los destinos de 44 px o más, ancho del escenario conforme al contrato, y herramientas abiertas sin recortes.
- **Pendiente en el PC:** `npm run auditar:urgente` y `npm run validate` completos. La auditoría con Playwright no pudo ejecutarse en el entorno de trabajo (sin Chromium disponible), así que el contraste AA y los contratos de render se han comprobado por cálculo y con la revisión propia, no con la auditoría oficial.

## Escultura en Blender (propuesta aparte, sin integrar)

A petición del fundador se modeló una primera versión en Blender 5.3 con los cuatro aros como objetos separados y cada color junto a su puerta (bronce junto a Patrimonio, azul claro junto a Academia). Archivos en `output/escultura-blender-20261122/` (fuera de la publicación): escena `.blend`, guion que la genera, render de 1800 px y WebP de 1600 px. No sustituye a `src/assets/ecosistema/conexiones.webp` mientras el fundador no lo decida.

## Ajuste posterior del fundador (22-11-2026, tarde)

El fundador retocó la portada con otra herramienta sobre este rediseño. Estado local comprobado a las 18:05:

- Fondo «Arena cálida» (`--nv-surface-hub: #efeae0`, luz `#f7f3ea`, base `#e5decf`) en lugar del marfil; la luz pasa de un foco tras la escultura a un halo amplio.
- Logotipo fluido hasta 410 px (`clamp(270px, 30vw, 410px)`) en lugar de 300 px.
- Cápsula «Qué es NUVIA» más alta, con los tonos de la maqueta editorial (`--nv-hub-button*`).
- Retoques menores: interletrado de las puertas, pie en `--nv-text-soft`, compactación en escritorio bajo y tamaños de tablet.

Se conservan la escala, el color por puerta, la franja común y la ampliación escalonada. Comprobaciones sin navegador en verde (shell, consistencia, sitio estático, navegación, banner de Academia, estilos de página, paridad). La página mide 1.035 px de alto a 1440 de ancho (1.010 antes del ajuste). Sigue sin publicar.

## Corrección de la ampliación (22-11-2026, 18:45)

El fundador vio la portada «enorme» en su monitor (2560 × 1271 px útiles): la ampliación saltaba a 1,5 y la página medía 1.553 px, con la franja común y el pie fuera de la vista. Los umbrales de altura estaban calculados para una portada de 830 px y la real mide unos 1.040. Nueva escalera (`hub.css`): 1,1 · 1,2 · 1,33 · 1,5 · 1,7 con alturas mínimas de 1.144 · 1.248 · 1.384 · 1.560 · 1.770 px, de modo que la portada entera cabe siempre en la ventana. El fondo llena la ventana completa (`html` en rejilla), sin franja al pie.

## Escala contenida (22-11-2026, 19:00)

Comparada en su pantalla con la portada publicada, el fundador siguió viendo la nueva demasiado grande. Se le mostró una prueba en vivo y respondió «ok». Estado guardado en `hub.css`:

- Logotipo `clamp(260px, 22vw, 320px)` (antes hasta 410); cápsula «Qué es NUVIA» de 48 px de alto (mínimo que exige la prueba de la portada) con círculo de 30.
- Puertas: nombre a 35 px (antes 38), frase a 16 px (antes 17), «Entrar en…» con peso 500 (antes 600); escultura de 480 px (antes 510). El titular no cambia.
- Sin ampliación hasta ventanas de 1900 × 1400 px (pasos 1,2 · 1,4 · 1,6): en 2560 × 1271 la portada queda a escala 1.
- Cabecera arriba, pie abajo y bloque central centrado en el aire sobrante (`.hub-page` en columna flexible); el fondo pierde el oscurecimiento inferior.

Copia del estado anterior: `output/validacion-barra-20261122/hub-antes-de-reducir.css`.

## Pliegue en portátil (22-11-2026, noche)

Punto 4 del traspaso. A 1280 × 720 la segunda fila de puertas acababa en el píxel 779 (59 px bajo el pliegue); a 1366 × 768 se cortaba unos 11 px. Se enseñaron al fundador las capturas de antes y después y respondió «Sí, aplícala».

Regla nueva en `estilos/ecosistema/hub.css`, solo para escritorio con 800 px de alto o menos (`min-width: 1025px` y `max-height: 800px`): titular `clamp(58px, 6vw, 84px)` (77 px a 1280; antes 93), escultura de 400 px (antes 460), nombre de puerta a 32 px (antes 35), frase del titular a 18 px, 18 px entre las dos filas de puertas (antes 32) y cabecera y márgenes más ajustados. No cambian la cápsula «Qué es NUVIA» ni las columnas de 345 px.

Medido en navegador con la regla guardada: a 1280 × 720 la segunda fila acaba en 629 px y la franja común empieza en 657; en la prueba previa, 640 px a 1366 × 768 y 646 px a 1440 × 800. A 1440 × 900 la regla no actúa (titular a 104 px). `npm run validate:nucleo` termina sin errores. No se ha pasado `npm run validate` completo. Sin commit ni publicación.
