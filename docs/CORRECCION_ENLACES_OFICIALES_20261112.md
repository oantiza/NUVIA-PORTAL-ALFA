# Corrección de cuatro enlaces oficiales · 12-11-2026

## Orden del fundador

«Corrige esas incidencias sin cambiar el diseño ni perder contenidos o funcionalidades, y vuelve a comprobarlo todo en escritorio y tablet. No publiques todavía.»

Esta actuación resuelve los cuatro destinos 404 registrados en `REVISION_FUNCIONAL_PUBLICA_20261112.md`. Los cuatro destinos con respuesta 403 no se consideran rotos y no se alteran ni se intenta superar la protección del proveedor.

## Destinos recuperados y evidencia

| Referencia existente | Corrección comprobada |
|---|---|
| Portal tributario de Bizkaia | [Departamento de Hacienda y Finanzas](https://www.bizkaia.eus/es/hacienda-y-finanzas1): el destino oficial conserva el nombre y añade el sufijo `1` a la ruta anterior. HTTP 200 y título comprobado en navegador. |
| Manual práctico Renta 2025 | [Manual práctico de Renta 2025 de la AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/manual-practico-renta-2025.html): contiene los enlaces a la parte general y a las deducciones autonómicas de esa misma edición. HTTP 200. |
| Histórico IBEX 35 | [Precios históricos del IBEX 35, BME](https://www.bolsasymercados.es/es/bme-exchange/indices/ibex/historico/ibex-35-es0si0000005.html): se conserva el destino específico y el ISIN `ES0SI0000005`; se corrige únicamente `%C3%ADndices` por `indices`. La página de históricos de BME enlaza exactamente esta ruta. HTTP 200. |
| Bundesbank, subasta del 09-09-2026 | [Resultado original de la subasta](https://www.bundesbank.de/resource/blob/964502/57bbd5fd1d447057d94655d221c57cb8/472B63F073F071307366337C94F8C870/2026-09-09-tenderergebnis-download.pdf): documento original de Bundesbank, recuperado desde su archivo de notas de prensa. Confirma la fecha, el ISIN `DE000BU2Z072` y el rendimiento medio del **3,39 %** ya citado. HTTP 200, tipo PDF y firma `%PDF` comprobados. |

No se sustituye ninguna referencia por una portada genérica. Las cifras, fechas, autorías y textos del portal permanecen iguales. La corrección de BME solo afecta a la URL defectuosa del informe diario: el semanal ya contenía la variante correcta sin tilde.

## Archivos

- `fiscalidad.html`: URL de Bizkaia.
- `js/nuvia-jubilacion-fiscal.js`: URL del manual AEAT; se propaga a Jubilación, guías e informes que reutilizan esta fuente.
- `data/informes-mercado.json`: URL de BME en la edición diaria y PDF original Bundesbank en la semanal.
- `core/downloads/informes/diario-2026-09-14.html` y `semanal-2026-09-14.html`: regenerados con `informeAHtml()` desde las ediciones existentes, sin generación de texto ni nuevas ediciones.

La sincronización coordinada del lector integrado se realiza mediante `npm run informes:sync`, una vez terminada la corrección independiente del widget de `mercados.html`. No se modifican bloques ajenos del HTML durante la corrección de enlaces.

## Conservación y pruebas

- Los cuatro destinos corregidos responden con HTTP 200. Evidencia: `output/correccion-funcional-20261112/enlaces/comprobacion-final.json`.
- Navegador: título y contenido de Bizkaia, AEAT y selector oficial BME; archivo oficial Bundesbank usado para recuperar su PDF. Evidencia: `destinos.json` y capturas `destino-*.png`.
- Lectura del PDF original de Bundesbank: una página, fecha 9 de septiembre de 2026, rendimiento medio 3,39 %, mismo bono citado.
- Comparación exacta con `HEAD` de los cinco archivos anteriores, normalizando finales de línea: **solo cambian las cuatro URL y sus apariciones generadas**, ningún otro byte de contenido. Evidencia: `conservacion.json` y script `conservar.mjs`.
- `npm run test:jubilacion`: **36/36** pruebas correctas, sin omitidas.
- `npm run test:informes`: **42/42** pruebas correctas, sin omitidas.
- `git diff --check`: correcto. No se añade ni relaja ninguna prueba del producto.

La validación global y la comprobación final de las páginas locales en escritorio/tablet forman parte del cierre conjunto de las correcciones funcionales. Los registros de esta actuación están en `output/correccion-funcional-20261112/enlaces/`.

## Prueba del §12

Necesidad: recuperar acceso a las mismas fuentes oficiales. Entrada: cuatro URL defectuosas y las publicaciones oficiales correspondientes. Transformación: sustituir sus destinos sin alterar textos, fórmulas, parámetros, cifras ni fechas. Salida: acceso al departamento, manual, histórico y resultado de subasta ya citados. Sin recomendaciones, juicios de idoneidad, veredictos, incentivos o llamadas a operar; sin datos personales, IA nueva, monetización, derivación ni cambios de separación profesional. Clasificación interna verde para esta reparación de enlaces. La consulta documental confirma la identidad de las fuentes; no implica una nueva revisión jurídica de los contenidos.

No se modifica el diseño, no se oculta ni retira contenido, no se escribe en Firebase y no se publica. La orden vigente mantiene todos los cambios en local.
