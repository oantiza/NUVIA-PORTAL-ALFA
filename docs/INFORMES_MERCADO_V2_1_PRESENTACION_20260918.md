# Informes de mercado v2.1 · mercados, agenda y cifras más legibles · 18-09-2026

Orden del fundador: «Los mercados de un vistazo» y «Agenda al cierre del informe» resultaban sosas, demasiado tabla; hacerlas más claras y atractivas para el lector no profesional, con algún gráfico más. Además, las cifras de referencia eran excesivamente grandes.

## Qué cambia (`js/nuvia-market-reports-render.mjs`, `estilos/nuvia-market-reports.css`)

- **Cifras de referencia**: número 36 → 28 px, etiqueta 12 px, relleno 16/18 px. Misma retícula de tres.
- **Los mercados de un vistazo** (solo semanal, como hasta ahora): dos gráficos de barras en lugar de uno, «Esta semana» y «En lo que va de año», siempre sobre el grupo de bolsas, cada uno con su propia escala y rejilla; leyenda en palabras («Subida», «Bajada») y una frase que explica cómo leer las barras. Cada grupo lleva un cuadrado de color y una frase llana que dice qué mide (bolsas, deuda pública, divisas, materias primas, volatilidad); las filas se presentan como fichas separadas con la referencia en 16 px, la variación con triángulo ▲/▼ por CSS y las filas «sin contrastar» atenuadas. El color sigue solo en la cifra y en la barra de una variación publicada (decisión del 14-09).
- **Agenda al cierre del informe**: de tabla a jornadas. Una tarjeta por día con cabecera de color (azul, verde, bronce, en ciclo), y dentro cada cita con su hora en un sello, región, título, «Dato anterior», por qué se sigue y fuente. Cuatro jornadas ocupan cuatro columnas; en tablet, dos. La lista mantiene la clase `nv-report__agenda-table` para que la prueba del contrato v2 siga identificando la agenda con fecha.
- Los descargables `diario-2026-09-14` y `semanal-2026-09-14` se regeneraron con la presentación nueva (la prueba exige identidad con el lector) y `mercados.html` se sincronizó. Sin cambios en datos, contrato ni prompts.
- El diario no lleva tablas de mercado (decisión previa); sí la agenda por jornadas y las cifras reducidas.

## Prueba del §12 (sin cambios de fondo)

Solo presentación: sin cálculos nuevos (el gráfico anual dibuja `variacionAnual` publicada, igual que el de la semana), sin ordenación por atractivo (grupos y filas en el orden del contrato; agenda por fecha y hora), sin calificar activos ni decisiones. Las frases por grupo describen qué mide cada bloque, no valoran. Clasificación interna: ámbar, como la v2.

## Verificación

`npm run test:informes` (41/41), `informes:check`, `check-static-site`, `check-consistencia`, `check-lenguaje`, `page-styles`, `typography-foundations`, `tables-results`, `economia-entry`, `news-editorial` correctos; revisión visual del semanal a 1280 px. Pendiente `npm run build` en el equipo del fundador.

## Ajuste v2.2 · misma jornada (18-09-2026)

Orden del fundador: quitar el selector grande de ediciones (redundante), sustituir toda la sección de mercados del semanal por cuatro gráficos resumen (bono de EE. UU. y bono alemán arriba; euro/dólar y petróleo abajo), retirar los botones de acceso de los heros de las homes e igualar las cabeceras de la agenda.

- **Selector de edición** (`renderLector`): pasa de dos cajas con título y período a dos píldoras compactas «Diario · Semanal», alineadas a la derecha sobre el informe; el período va en `title`. Se mantiene porque es el único mecanismo para cambiar de edición dentro de Informes (`data-report-select`, contado por `check-render` y `check-notice-states`).
- **Los mercados de un vistazo** (semanal): desaparecen el gráfico de bolsas y las tablas por grupo. En su lugar, cuatro fichas en dos filas —bono de EE. UU. a 10 años, bono alemán a 10 años, euro frente al dólar, petróleo Brent— elegidas por nombre entre las filas del contrato y en ese orden fijo. Cada ficha: qué mide en una frase, nivel, variación de la semana (en puntos de rentabilidad para los bonos) y una barra de signo SVG sobre su propia escala; si la fila viene «sin contrastar», la ficha lo dice y no dibuja barra. El contrato y los prompts no cambian: el generador sigue documentando todos los grupos.
- **Agenda**: cabecera de cada jornada en dos líneas (día y fecha) con altura mínima común; «Miércoles» ya no desalinea.
- **Heros de las homes** (`economia`, `patrimonio`, `bienestar`, `academia`): se retira el bloque `nv-space-entry__actions` (botón y enlace). Lecturas conserva su acceso al catálogo, que no está en el hero sino bajo la ilustración y lo protege `nuvia-lecturas-banner.test.mjs`; Inicio conserva los accesos de sus láminas, exigidos por `check-render`.
- Pruebas: `nuvia-informes-mercado.test.mjs` sustituye las aserciones de tabla y gráfico de bolsas por las de las cuatro fichas (orden fijo, deuda en puntos, «Sin contrastar» visible, sin `nv-report__table`); el juego de datos de prueba añade un bono de EE. UU. sin contrastar. 41/41. Descargables del 14-09 regenerados y `mercados.html` sincronizado; comprobaciones estáticas y de entrada de cada espacio en verde.
