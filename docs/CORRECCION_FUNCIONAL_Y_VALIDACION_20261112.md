# Correcciones funcionales y validación local · 12-11-2026

**Orden posterior:** el fundador autoriza publicar esta versión corregida, incluidos los vídeos actualizados, manteniendo el diseño. La publicación y sus verificaciones se registran en [el acta posterior](PUBLICACION_CORRECCIONES_FUNCIONALES_20261112.md). El estado local descrito a continuación corresponde a la entrega anterior a esa autorización.

## Orden y alcance

Orden del fundador: «Corrige esas incidencias sin cambiar el diseño ni perder contenidos o funcionalidades, y vuelve a comprobarlo todo en escritorio y tablet. No publiques todavía.»

Sobre los vídeos, el fundador eligió «Mantener YouTube; facilitaré los enlaces» y después aportó los cinco destinos nuevos. Se aplican a las piezas correspondientes según sus títulos comprobados, no según el orden del mensaje.

Se trabaja exclusivamente en NUVIA-PORTAL-ALFA. La referencia de partida es `07e8ad408045bc00d5e7f0cd6fb288e34c90d52a`. Los cambios quedan en fuentes y en el artefacto local `dist/`, sin commit, push, publicación ni escrituras en Firebase. Las revisiones anteriores de producción se conservan como evidencia histórica; este documento registra la reparación posterior.

## Incidencias corregidas

1. **Vídeo del curso asociado al capítulo anterior.** El contenedor se identifica por su URL de vídeo: cambiar de capítulo retira el reproductor anterior y restaura la portada y el botón correctos. Atrás y Adelante funcionan; marcar el progreso del mismo capítulo no interrumpe su vídeo. [Detalle técnico y pruebas](CORRECCION_REPRODUCTORES_20261112.md).
2. **Falso cambio de versión en los cierres anteriores de Empresas.** La comparación ordena las claves de los mapas antes de serializar; mantiene el orden de las listas y sigue detectando cambios reales. No cambia datos, cálculos ni controles de procedencia. [Detalle y prueba del §12](CORRECCION_SERIE_CIERRES_20261112.md).
3. **Panel TradingView vacío.** El runtime conserva el fragmento estático e inerte de `<template>`. El cargador comprueba su contenido antes de sustituir el marcador y conserva los accesos existentes si la plantilla está vacía. Las tres pestañas y los doce símbolos se mantienen. [Detalle](CORRECCION_REPRODUCTORES_20261112.md).
4. **Cuatro referencias oficiales con 404.** Corregidas las rutas de Hacienda de Bizkaia, el manual Renta 2025 de AEAT, el histórico IBEX 35 de BME y el resultado original de la subasta de Bundesbank del 09-09-2026. Se conservan fechas, cifras y textos. Los informes descargables y el lector integrado están sincronizados mediante `npm run informes:sync`. [Destinos y comprobaciones](CORRECCION_ENLACES_OFICIALES_20261112.md).
5. **Cinco vídeos de YouTube indisponibles.** Sustituidos por los enlaces facilitados por el fundador, tanto en el reproductor como en el acceso alternativo. No se incorporan vídeos locales al portal.

| Pieza | Enlace vigente comprobado | ID anterior |
|---|---|---|
| El PIB, de principio a fin | [YouTube](https://youtu.be/xEZXLsY4B98) | `ZwhTy0oqx9c` |
| Capítulo 2 · Ahorrar con propósito | [YouTube](https://youtu.be/WtoHCXogKiw) | `cwHHU5okGqY` |
| Capítulo 3 · Invertir sin apostar | [YouTube](https://youtu.be/-afhqOyS-UQ) | `K-AbB3tDmd0` |
| Capítulo 4 · La economía en tu día a día | [YouTube](https://youtu.be/yRWuM64CAe8) | `uOrdz0Gi96A` |
| Capítulo 5 · Construye tu plan | [YouTube](https://youtu.be/idMdu9nTRmM) | `OoZXhp9sJ_0` |

Los cinco títulos y el autor NUVIA ACADEMY coinciden en la respuesta oEmbed, con HTTP 200. Se comprueba inicio efectivo de reproducción en cada tamaño: duración válida, `readyState: 4`, `paused: false` y tiempo reproducido superior a medio segundo. No se presenta esta prueba como visionado completo de las piezas.

## Conservación del diseño y del contenido

No cambian CSS, logotipos, cabeceras, pies, composiciones, navegación, nombres, textos editoriales ni fórmulas. La comparación exacta con HEAD, normalizando finales de línea, confirma que las páginas y datos afectados solo contienen las sustituciones de URL descritas y la clave del reproductor del curso. Los cinco PDF, actividades, glosario, libros, artículos, informes, herramientas y guardados locales siguen disponibles.

Las tres capturas de fichas de Lecturas son idénticas byte a byte a las capturas anteriores de producción en los mismos tamaños. Se revisan además las capturas de herramientas, cuestionario, vídeos, TradingView y cierres de Empresas. Los 245 archivos de `dist/` coinciden byte a byte con su fuente o con la compilación de Empresas correspondiente.

La regresión persistente `docs/nuvia-reproductores.test.mjs` se añade a `test:reproductores`, `validate`, `validate:nucleo` y `validate:academia`. Las pruebas anteriores se mantienen completas. La regresión usa proveedores sustitutos explícitos para comprobar la integración; las pruebas adicionales de YouTube y TradingView sí conectan a los proveedores reales.

## Validación completada

Navegador Chromium en 1440 × 900, 1024 × 900 y 768 × 1024. Las pruebas funcionales usan contextos nuevos y datos sintéticos; las carteras de ejemplo se guardan únicamente en almacenamiento local temporal.

| Ámbito | Resultado y cobertura |
|---|---|
| Recorrido transversal | 59 rutas, 177 vistas, 6.564 apariciones de enlaces y 307 destinos distintos; sin errores JavaScript, respuestas fallidas de recursos propios, desbordamiento horizontal ni enlaces vacíos visibles. |
| Destinos HTTP consolidados | 205 enlaces únicos del inventario ampliado: 201 respuestas correctas y cuatro 403 de protección externa. Incluye 73 destinos propios comprobados sobre `dist/`, las cuatro fuentes reparadas y los cinco vídeos nuevos. |
| Anclas generales | 540 observaciones: 492 presentes al abrir; 48 corresponden a las cuatro fases condicionales de Cartera en sus cuatro variantes y tres tamaños. Su activación y destino tras calcular se comprueban en el complemento de Cartera. |
| Patrimonio | 60/60 escenarios: Vivienda, Jubilación y Fiscalidad, con cálculos contrastados, entradas inválidas, guardado local, territorios, informes y guías. Además, 494/494 anclas territoriales en 114 vistas. |
| Academia y comunes | 33/33 grupos: interés compuesto, glosario, activos, curso, cinco PDF, presupuesto, cuestionario, progreso, Lecturas y Bienestar. |
| Vídeos actualizados | 18/18 grupos: cinco reproducciones reales y una secuencia de cambio de capítulo/Atrás/Adelante por tamaño. |
| Economía, Cartera y Empresas | 63/63 recorridos distintos sobre `dist/`: noticias, cotizaciones, informes y descargas, constructor, cuatro modelos, cálculos contrastados, guardado local, anclas y análisis de empresas. |
| Cierres anteriores | 15/15 consultas y reconsultas reales, cinco por tamaño, sin el falso aviso de revisión cambiada. Regresión de mapas reordenados y detección de seis cambios reales: 17/17 pruebas técnicas. |
| TradingView real | 3/3 tamaños: gráfica, cotizaciones y cambio Índices/SPX500 → Divisas/EURUSD → Materias primas/GOLD → Índices. |
| Validaciones del repositorio | `validate:cartera`, `validate:nucleo` y `validate:academia` correctas. Academia se repite después de actualizar los cinco vídeos. `npm run build` termina con código 0 e incluye `npm run validate`, `npm run auditar`, compilación y controles de `dist/`. |
| Render y artefacto | Auditoría completa configurada: 51 páginas/vistas a 1440 px sin fallos. El módulo compilado de Empresas supera además 1440, 1280, 1024, 820 y 768 px. Regresión adicional de reproductores sobre `dist/` correcta en los tres tamaños; paridad de 245/245 archivos. |

Los `href="#"` de los diálogos cerrados de Lecturas y noticias son marcadores inactivos; al abrir las fichas reciben sus destinos HTTPS y se comprueban mediante interacción. No se confunden con enlaces rotos ni se modifican para satisfacer el rastreo estático. Se conservan los registros originales y se documenta esta clasificación.

## Límites de la comprobación externa

Las cuatro referencias oficiales reparadas responden correctamente. Morningstar y tres artículos de El País/Cinco Días devuelven protección HTTP 403 a la comprobación automática. Se conservan sus enlaces y se registran como no verificables automáticamente, sin afirmar que estén rotos o que su contenido haya sido validado. No se intenta eludir la protección.

La repetición HTTP final registra 201 respuestas correctas de 205 destinos. EIA respondió 503 transitoriamente en el primer GET y 200 en un único reintento normal; ambos intentos quedan registrados. No quedaron otros errores HTTP.

Las pruebas de datos financieros comprueban motores, recorridos y una muestra de instrumentos y empresas; no son una auditoría de cada dato de los proveedores ni de cada instrumento del catálogo. Las pruebas de impresión comprueban generación del informe y activación de los controles en navegador, sin impresora física. La disponibilidad externa corresponde al momento de la prueba.

## Prueba del §12

Necesidad: recuperar funciones, vídeos y fuentes ya presentes. Entradas: selección de capítulo, plantilla estática existente, documentos financieros de lectura y enlaces oficiales. Transformación: reparar asociación de reproductor, conservación de plantilla, comparación de versiones y destinos. Salida: los mismos contenidos, gráficos y resultados previstos, sin nuevos cálculos ni inferencias personales.

No se introducen recomendaciones, juicios de idoneidad, precios objetivo, rankings, llamadas a operar, contratación, derivaciones, patrocinios, IA nueva ni tratamiento de datos personales. Se mantienen procedencia, fechas, avisos, límites y separación profesional. La clasificación del módulo de Empresas continúa siendo ámbar por emisores identificables; la reparación no amplía su alcance. Los detalles del control constan en las tres actas enlazadas. No se realizan escrituras remotas ni se publican los cambios.

## Evidencias

Carpeta local: `output/correccion-funcional-20261112/`.

- `build.log`, `validate-academia-videos.log`, `reproductores-dist.log` y `paridad-dist.json`.
- `inventario-enlaces.json`, `anclas.json`, `enlaces-http.json` y `enlaces-globales.log`.
- `enlaces/comprobacion-final.json`, `enlaces/revision-http-final.json`, `enlaces/conservacion-incluye-lector.json` y `conservacion-academia.json`.
- `patrimonio/README.md` y `consolidated-results.json`.
- `academia-comunes/RESUMEN_FINAL.md`, `videos-actualizados.json` y `oembed-videos-actualizados.json`.
- `economia-cartera/RESULTADO.md` y `consolidado.json`.
- `reproductores/widget-real.json` y capturas de los tres tamaños.

Los registros previos con IDs antiguos, restricciones del sandbox o selectores exploratorios se conservan por trazabilidad; no sustituyen a los resultados finales identificados en cada resumen. `dist/` está preparado exclusivamente como artefacto local de revisión.
