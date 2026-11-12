# Empresas: periodos e identidad comprensibles · 12-11-2026

## Orden y alcance

El fundador ordena «Sigue» tras la auditoría integral de homogeneidad y claridad. Se aplican dos mejoras de presentación en la copia local de Empresas: periodo y fuente inmediatamente junto a los ratios, y explicación pública de `isin_conflict` sin lenguaje de coordinación interna. Se conserva el estado funcional, la trazabilidad, la posibilidad de reintentar y todos los datos.

Archivos modificados: `company-analysis/src/alfa/CompanyReport.jsx`, `App.jsx`, `theme.css`; prueba `docs/nuvia-company-presentation.test.mjs` y esta acta. No se modifican adaptadores, API, caché, backend, universo, fórmulas, búsqueda, orden de empresas ni las reglas de identidad. Sin datos de visitantes, escrituras en Firebase, commit o publicación.

## Prueba previa del §12

1. Necesidad: distinguir el margen anual calculado del ratio de la instantánea, y comprender una identidad pendiente.
2. Entradas: la ficha existente de la empresa elegida por el usuario; ninguna entrada nueva.
3. Transformación: únicamente formato de procedencia/periodo y texto de estado; se mantienen las expresiones de cálculo.
4. Resultado: mismos valores, con contexto junto a cada KPI; estado público y detalle de los mismos ISIN/símbolos.
5. Emisores identificables: sí, ya presentes. Se mantiene la clasificación ámbar del módulo.
6. Circunstancias personales: no se utilizan.
7. Sugerencia de operar: ninguna.
8. Precio o valor futuro: ninguna opinión ni estimación nueva.
9. Mérito: no se ordena, selecciona ni colorea por atractivo.
10. Recomendación ajena: no se incorpora.
11. Diseño como veredicto: no; tipografía y contexto neutrales.
12. Acción: ver detalles y reintentar la consulta ya existente; sin contratación o captación.
13. Remuneración: no se añade publicidad, patrocinio ni afiliación.
14. Separación profesional: no se conectan datos o servicios profesionales externos.
15. Datos personales: no se solicitan, guardan ni transmiten.
16. IA: no se incorpora al producto.
17. Fuentes/fechas: se muestra el cierre anual cuando existe; para ratios de instantánea se declara el cierre no informado. La actualización del proveedor no se presenta como periodo contable. La fuente procede del mismo documento.
18. Controles: pruebas renderizadas con cierres distintos, valores divergentes, ausencia y cero; prueba de identidad y reintento; regresiones existentes del módulo y render local sin conexiones externas.

La revisión es de presentación de una función existente. No reclasifica el módulo ni añade bloqueos. La validación jurídica externa permanece fuera del alcance de la alfa conforme al §0 del marco.

## Resultado y comprobaciones

Los cuatro indicadores del resumen muestran su cierre anual y fuente dentro de cada ficha. Los doce ratios de la instantánea muestran el periodo que acredita su campo y su fuente; cuando el archivo no aporta periodo o cierre, se dice expresamente. No se atribuye a `ProfitMargin` un periodo TTM no acreditado, ni se utiliza la fecha de actualización como cierre contable.

El estado `isin_conflict` se presenta como «Identidad pendiente de revisión». La explicación distingue las identidades sin decidir por el usuario; los ISIN, símbolos y estado técnico siguen disponibles en un detalle de teclado y en la impresión. «Reintentar consulta» conserva el mismo incremento de reintento. La ausencia ordinaria de fundamentales conserva su mensaje.

Comprobaciones realizadas:

- `node --test docs/nuvia-company-presentation.test.mjs docs/nuvia-fundamentales-alfa.test.mjs docs/nuvia-fundamentales-metadata.test.mjs docs/nuvia-fundamentales-remote.test.mjs`: 30 pruebas superadas, sin fallos ni pruebas omitidas. Se contrastan 14,3 % anual y 15,9 % de instantánea en una ficha ficticia, cierre distinto de la actualización, cero, ausencia, inmutabilidad de datos, trazabilidad y reintento.
- `node scripts/check-company-regulatory.mjs`: puerta superada, 18 archivos revisados.
- Render local con Chromium a 1440 y 768 px, componentes reales y hojas en su orden de producción, datos ficticios y conexiones externas bloqueadas. Los 16 contextos permanecen dentro de sus fichas; sin desbordamiento horizontal. El detalle abre con Enter y su control mide al menos 44 px.
- Media de impresión comprobado (`print=true`, `screen=false`): el detalle interactivo se oculta, la trazabilidad completa se imprime y los contextos de los indicadores siguen presentes.

Evidencias locales: `output/claridad-empresas-20261112/render-presentacion.json` y capturas de ambos anchos. Se empleó una página de prueba renderizada con los componentes, no una consulta real al proveedor. La validación transversal y la compilación final corresponden al cierre conjunto del cambio.
