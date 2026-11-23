# Guía «El balance patrimonial» · 23-11-2026

**Fecha:** 23-11-2026. **Estado:** montada en local; sin commit, sin envío y sin despliegue.

## Orden del fundador

Tras leer el borrador v2 completo, respondió: «lo firma: "NUVIA", PUBLICALO Y ELIMINA LA FECHA». Antes se le había dicho que publicarla «exige crear una página nueva, enlazarla desde la tarjeta "Balance patrimonial" de Planificación y actualizar las pruebas que hoy esperan tres ámbitos "en preparación"».

Esta acta cubre el montaje en local. La publicación en GitHub Pages sigue el flujo habitual y no se ha ejecutado aquí.

## Qué se publica

- **Página nueva:** `guia-balance-patrimonial.html`, título de pestaña «NUVIA · Balance patrimonial». Editorial de Patrimonio, padre `patrimonio.html`, sin imagen de cabecera, sin estilos en línea, un solo h1 («El balance patrimonial: qué tiene y qué debe un hogar») y texto de lectura a 16 px.
- **Ruta:** Inicio NUVIA › Patrimonio › Planificación › Balance patrimonial.
- **Autoría visible:** «NUVIA». **Fecha:** ninguna visible (ni en la cabecera ni en las fuentes). La fecha `2026-11-23` figura solo como `lastmod` técnico del sitemap.
- **Texto:** el cuerpo del borrador v2 (`output/propuesta-contenido-vacias-20261123/borrador-patrimonio-balance-patrimonial-v2.md`, entre `INICIO CUERPO` y `FIN CUERPO`), más «Antes de leer» y las fuentes. Dos cambios, ambos ordenados:
  1. Se retira la línea de fecha y el «leída el…» de las fuentes (quedan título, entidad y año de la publicación).
  2. Se unifica «patrimonio neto» en toda la pieza. La definición dice una sola vez que el Banco de España lo llama «riqueza neta»: «**Patrimonio neto.** El Banco de España, que lo llama «riqueza neta», lo define como el valor total de los activos, reales y financieros, menos el importe de las deudas.»
- No se ha añadido ninguna frase que no esté en el borrador. Elementos de página que no son del borrador: título de pestaña, meta descripción («Guía NUVIA sobre el balance patrimonial: qué tiene y qué debe un hogar, y en qué se diferencia del presupuesto familiar.») y la etiqueta de cabecera «Guía · lectura de unos 2 minutos · NUVIA» (los dos primeros datos vienen del borrador).
- La frase «Los valores no tienen todos la misma solidez» se mantiene tal como está en el borrador. El fundador está comprobando por su cuenta la fuente del Banco de España y avisará si hay que corregir una frase.

## Fuentes

- Banco de España, *Encuesta Financiera de las Familias (EFF) 2024: métodos, resultados y cambios desde 2022*, Documentos Ocasionales n.º 2610, 2026 (enlace al PDF de bde.es). Leída el 23-11-2026 en la sesión de redacción: la definición de riqueza neta y las categorías de activos reales, activos financieros y deudas.
- *Finanzas para todos* (CNMV, Banco de España y Ministerio de Asuntos Económicos): «¿Cómo elaborar tu presupuesto?». No se muestra año porque la fuente no lo indica en la página leída.
- Ninguna de las dos fuentes avala la pieza (así consta en la página).

## Cambios en `temas.html` y en la portada de Patrimonio

`temas.html?topic=planificacion-patrimonial`:
- La tarjeta «Balance patrimonial» deja de llevar la etiqueta «En preparación» y lleva el botón «Leer la guía →» a `guia-balance-patrimonial.html`. Las otras dos tarjetas quedan como estaban.
- Técnica: `R(titulo, descripcion, enlace)` admite un enlace opcional; `renderVals` añade `recursosPublicados` (con enlace) y `recursosPendientes` (sin él), y la plantilla pinta primero un bucle con las tarjetas enlazadas y después el de las pendientes. `recursos` conserva sus tres elementos. El resto de temas (Vivienda, Bienestar) no cambia.
- Aviso «Contenidos en preparación»: «Estos son los contenidos previstos.» pasa a «Uno de los tres ámbitos ya está disponible, el [balance patrimonial](guia-balance-patrimonial.html); los otros dos son contenidos previstos.» El enlace es estático para que la página sea alcanzable desde el HTML de origen.
- No se toca la tarjeta del resumen de `temas.html` (línea 146, «En preparación» y «Prepararemos contenidos educativos…»): la prueba `nuvia-patrimonio-entry.test.mjs:50-51` exige esa etiqueta y ese texto, y el fundador no ha ordenado cambiar esa tarjeta. Queda **pendiente de decisión**: sigue anunciando el espacio entero como en preparación.

`patrimonio.html` (generado desde `scripts/ecosistema/sitios.mjs`, línea 31):
- «Espacio en preparación» → «Una guía disponible»; «Ver contenidos previstos» → «Ver los contenidos». Dos etiquetas, sin redactar frases. La descripción de la tarjeta queda igual.

Menú: `_plantilla.html` añade `"pages": ["guia-balance-patrimonial.html"]` a «Planificación», y `npm run shell:sync` marca «Planificación» como entrada activa (`aria-current`) en la página nueva. Cabecera y pie salen de `shell:sync`; ningún otro fichero cambió.

## Altas obligatorias de página nueva

- `scripts/paginas.mjs`: alta de `guia-balance-patrimonial.html` (módulo patrimonio, padre `patrimonio.html`, tipo editorial, pública).
- `npm run sitemap:sync`: `sitemap.xml` pasa a 29 páginas públicas.
- `scripts/check-render.mjs`: contrato `'guia-balance-patrimonial.html': [['main h1', 1], ['.nv-prose h2', 6]]`.

## Pruebas cambiadas

| Fichero | Cambio |
|---|---|
| `scripts/check-patrimonio-entry.mjs:34` | De «3 etiquetas `nv-tag--pending`» a «2», con mensaje «Planificación no conserva dos ámbitos en preparación»; se añade una comprobación nueva: exactamente un `.tm-card__cta[href="guia-balance-patrimonial.html"]`. El aviso (`.tm-overview__notice` = 1) se mantiene. |
| `docs/nuvia-navigation.test.mjs:28` | La página nueva se añade a la lista de Patrimonio (alta obligatoria; sin ella fallaban dos aserciones: la de contrato de navegación y la de alcanzabilidad). |
| `scripts/check-render.mjs` | Contrato de la página nueva (arriba). |

No se relajó ninguna prueba: dos exigen lo mismo que antes sobre las dos tarjetas pendientes y una exige además el enlace. `docs/nuvia-navigation.test.mjs:141` y `:146` y `docs/nuvia-patrimonio-entry.test.mjs:37, 50-51` siguen valiendo sin tocarse.

## Prueba regulatoria §12 (marco v1.2)

Clasificación: **verde**.

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | Necesidad educativa | Entender qué es un balance patrimonial y en qué se distingue del presupuesto. |
| 2 | Datos que recibe | Ninguno; es texto. |
| 3 | Cálculo | Ninguno; describe «activos menos deudas». |
| 4 | Resultado | Texto explicativo. |
| 5 | Instrumentos o emisores identificables | No. Las categorías (fondos, renta fija, planes de pensiones) son genéricas y proceden de la fuente. |
| 6 | Circunstancias personales | No. |
| 7 | Sugiere comprar, vender, mantener o no actuar | No. |
| 8 | Opina sobre valor o precio | No. Dice que el valor de un inmueble es una estimación; no dice cuánto. |
| 9 | Puntúa, selecciona u ordena por atractivo | No. |
| 10 | Reproduce recomendación de tercero | No. Reproduce una definición estadística del Banco de España, atribuida. |
| 11 | Color, diseño o navegación como veredicto | No. |
| 12 | Llamada a la acción | No. Tres enlaces a guías de NUVIA bajo «Dónde seguir». |
| 13 | Remuneración, patrocinio, conflicto | No. |
| 14 | Agente vinculado o entidad representada | No interviene. |
| 15 | Datos personales | Ninguno. |
| 16 | IA | No interviene en el texto publicado. El borrador lo redactó un asistente; el fundador lo leyó y lo firma como NUVIA. |
| 17 | Fuentes, fechas, supuestos | Dos fuentes visibles, con título, entidad y año cuando la fuente lo da. Sin cifras ni fórmulas distintas de la definición citada. |
| 18 | Prueba automática y revisión humana | Revisión humana: el fundador leyó el borrador completo. `check-lenguaje.mjs` no escanea esta página (solo las superficies de cartera); la expresión por expresión se hizo a mano sobre el borrador: 0 coincidencias con las 12 expresiones de la lista y 0 imperativos de instrucción. |

Frases que podrían leerse como juicio, revisadas: «Qué se incluye es, por tanto, un criterio que cada balance fija y declara» (describe), «Los valores no tienen todos la misma solidez» (juicio sobre la calidad del dato, no sobre el patrimonio) y «Un balance no valora si un patrimonio es suficiente o está bien repartido» (exclusión). No hay liquidez, concentración, umbrales ni cifras fiscales.

## Validación

Ejecutadas el 23-11-2026 sobre el árbol local (servidor `http://localhost:4199/`):

- `npm run shell:check`: «Cáscara contextual verificada en 29 páginas.»
- `npm run sitemap:check`: «Sitemap: 29 páginas públicas, coherente con el registro.»
- `node docs/nuvia-navigation.test.mjs .`: «Navegación: 29 páginas, cuatro webs, dos espacios comunes, confianza y todos los recursos alcanzables.»
- `node docs/nuvia-patrimonio-entry.test.mjs .`: «Patrimonio 5A-1: portada, cuatro ámbitos, disponibilidad, vistas y alias conservados.»
- `node docs/nuvia-metadata.test.mjs .`: «Metadatos: 29 páginas canónicas, sitemap y exclusiones verificados.»
- `node docs/nuvia-page-hierarchy.test.mjs .`: correcto.
- `node scripts/check-consistencia.mjs .`: «✓ 31 páginas validadas sin errores.» (con los avisos de imágenes sin `loading="lazy"` que ya existían).
- `node scripts/check-lenguaje.mjs .`, `node docs/nuvia-page-styles.test.mjs .`, `node scripts/check-static-site.mjs .`, `node scripts/check-parity.mjs .`, `node docs/nuvia-navigation-cards.test.mjs .`, `node docs/nuvia-editorial-clarity.test.mjs .`, `node docs/nuvia-trust-pages.test.mjs .`: correctos.
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 "guia-balance-patrimonial.html,temas.html?topic=planificacion-patrimonial,patrimonio.html"`: «Render verificado: 3 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» Incluye `checkPatrimonioEntry` con la comprobación cambiada. Repetida a 1440 y 768 px tras el último ajuste de formato de los avisos.
- Comprobación en el navegador (localhost:4199): un h1, 16 px en el texto, cero estilos en línea, «Planificación» activa en el menú, en Planificación una tarjeta con enlace y dos con «En preparación».

**No ejecutado:** `npm run validate` y `npm run build` (los pasa la dirección). Tampoco el resto de `npm run validate:patrimonio` (motor y guías de jubilación) ni `npm run auditar`.

**No verificado:**
- (Resuelto) La fuente del Banco de España la comprobó la dirección sobre el PDF el 23-11-2026: título y n.º 2610; definición de riqueza neta y exclusión de vehículos (p. 16); activos reales (p. 19); activos financieros y créditos a favor del hogar (pp. 25-35); tipos de deuda (pp. 36-39). La fuente de «Finanzas para todos» no se comprobó de nuevo.
- Que la plantilla de guía (arquetipo F) de la guía maestra admita esta composición corta: se siguió el patrón de las páginas editoriales sin territorio (`metodologia.html`) con la cabecera de las guías de Patrimonio; no se leyó el apartado 3.6 completo.
- Aspecto en tablet real: solo emulación de ancho.
- La tarjeta del resumen de `temas.html` (línea 146) y el resto de textos de «en preparación» fuera de los tocados.
- `scripts/ecosistema/generar-portadas.mjs` se ejecutó una vez al comprobar si admitía `--check` (no lo admite): regeneró las portadas sin dejar diferencias fuera de `patrimonio.html`.

## Añadido por la dirección · entrada activa del menú

Al revisar la guía, el menú no marcaba «Planificación»: `js/nuvia-ecosistema.js` recalcula la entrada activa al cargar y no conocía la página nueva. Se añadió `guia-balance-patrimonial.html` a su tabla de apartados padre, apuntando a `temas.html?topic=planificacion-patrimonial`, y la misma línea a la tabla equivalente de `scripts/check-navigation-cards.mjs`, que comprueba ese comportamiento con su propio inventario. Es un alta, no una relajación: la comprobación sigue siendo la misma. La primera compilación falló justo en esa comprobación («Planificación: aria-current no corresponde a la vista o a su sección») y no se publicó nada hasta corregirlo.
