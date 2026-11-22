# Todo está conectado · Las cuatro webs de NUVIA

## Encargo del fundador

Crear una película local que presente las cuatro webs de NUVIA, explique qué puede hacer una familia en cada una y muestre cómo se relacionan. El guion parte de una decisión cotidiana: elegir dónde vivir también determina cuánto tiempo queda para estar en casa y cuánto dinero queda al final del mes.

La revisión de contenido del 17 de noviembre de 2026 consultó las 28 páginas canónicas de la web publicada. Las 28 devolvieron HTTP 200. La descripción editorial se contrastó además con la [definición de NUVIA](DEFINICION_NUVIA.md) y el [mapa vigente del portal](ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md).

## Qué encontrará quien vea la película

| Tiempo | Espacio | Contenido presentado |
|---|---|---|
| 0:00–0:14 | NUVIA | La relación entre vivienda, tiempo y economía doméstica introduce las cuatro webs. |
| 0:14–0:35 | Economía y finanzas | Informes y noticias, análisis de empresas y exploración de la cartera para entender riesgos compartidos y formarse un criterio propio. |
| 0:35–0:55 | Patrimonio | Comparar compra y alquiler, explorar una hipoteca, estimar la pensión y entender la fiscalidad del ahorro y las herencias. |
| 0:55–1:13 | Familia y bienestar | Respiración, movimiento, alimentación y descanso, explicados desde la vida cotidiana. |
| 1:13–1:33 | Academia NUVIA | El curso disponible es *Dinero con criterio*. También se pueden consultar conceptos y probar el interés compuesto. La locución presenta como futuros los nuevos cursos de bolsa, activos financieros, economía, finanzas y cuestiones legales. |
| 1:33–1:47 | Lecturas con Criterio y Colaboradores | Dos espacios comunes. Uno reúne lecturas relacionadas con las cuatro webs. El otro presenta a las personas que aportan conocimiento al proyecto. |
| 1:47–1:57 | NUVIA | El aprendizaje vuelve al punto de partida, las decisiones que dan forma a la vida en familia. |

El guion con imagen y locución está en `output/nuvia-cuatro-webs-20261117/Guion-Todo-esta-conectado.md`. El fichero `guion.json` de esa misma carpeta conserva el texto hablado y la duración de cada bloque para el montaje.

## Prueba del apartado 12 del marco regulatorio

| Preguntas | Aplicación |
|---|---|
| 1–4. Necesidad, entradas, transformación y resultado | Orientar a una familia que llega por primera vez. El guion y la documentación editorial se convierten en una película lineal con locución en español. |
| 5–10. Instrumentos, personalización, operaciones, precios, selección y recomendaciones | El bono, las inversiones, la vivienda y la hipoteca ilustran contenidos. Las pantallas de vivienda e interés compuesto muestran resultados para los parámetros de los ejemplos. La narración deja las decisiones en manos de cada familia. Los informes se presentan como muestras de lectura y los libros conservan el orden del catálogo. |
| 11–14. Diseño, contratación, remuneración y actividad profesional | Los colores y aros identifican webs. La narración conserva la independencia del proyecto y dirige la atención a la comprensión de las opciones familiares. No incorpora captación comercial, patrocinio ni contacto con entidades. |
| 15–16. Datos e IA | La película no recibe datos del espectador. La síntesis de voz interpreta un guion cerrado, sin personalización ni generación de respuestas para el público. |
| 17–18. Fuentes, límites y controles | Se contrastaron la definición, el mapa y los contenidos publicados de NUVIA. Las referencias a futuro se formulan en tiempo futuro. El guion, la comprobación audiovisual y los controles del portal dejan evidencia de revisión. |

Clasificación interna verde para esta presentación educativa. El uso de los simuladores se describe de manera general y sus cálculos siguen en las páginas de cada herramienta.

## Controles del portal

Se completaron `npm run validate:nucleo` y `npm run validate`. Los reproductores se probaron a 1440, 1024 y 768 px. La auditoría de render incluida en la validación completa pasó en 51 rutas a 1440 px. Los registros íntegros están en `output/nuvia-cuatro-webs-20261117/validacion/validate-nucleo.log` y `output/nuvia-cuatro-webs-20261117/validacion/validate.log`. Estas pruebas corresponden al portal local.

## Locución y mezcla

La voz española de Charon y la partitura original tienen cada una una pista estéreo de 117 segundos a 48 kHz. La mezcla PCM mide −16,50 LUFS y −1,59 dBTP. La última frase, «Todo está conectado», comienza en 1:54,705. Las marcas acústicas están en `voz/marcas.json` y las mediciones de la mezcla, en `audio/mezcla-qa.json`, dentro de la carpeta de producción.

## Proyecto de montaje

DaVinci Resolve Studio 21.2 conserva el proyecto «NUVIA · Todo está conectado · Cuatro webs». La línea de tiempo contiene siete bloques de imagen a 1920 × 1080 y 25 fps. Empiezan en los fotogramas 0, 350, 875, 1375, 1825, 2325 y 2675, y terminan en el límite 2925, exactamente a 1:57. Las siete marcas del montaje coinciden con el guion. La pista de locución contiene además cuatro marcas acústicas de los espacios comunes y del cierre. La mezcla está activa y la voz y la partitura se conservan por separado en otras dos pistas estéreo.

El archivo de proyecto verificado es `resolve/NUVIA-Todo-esta-conectado-Cuatro-webs.drp`. Sus medios se encuentran en las carpetas hermanas `montaje/` y `audio/`. El resultado de la comprobación de la línea de tiempo y de la integridad del proyecto exportado está en `validacion/resolve.json`.

## Máster de revisión

`montaje/NUVIA-Todo-esta-conectado.mp4` dura exactamente 117 segundos y ocupa 50.628.876 bytes. Se decodificaron los 2.925 fotogramas H.264 en Rec.709 y la pista AAC estéreo a 48 kHz. En el MP4 se midieron −16,50 LUFS y −1,58 dBTP. La figura de la portada, `src/assets/ecosistema/conexiones.webp`, aparece en la apertura y en el cierre. Ambas composiciones coincidieron píxel a píxel antes de la codificación. La huella SHA-256 del máster es `a0f4056ea4931bb6c3f881ffb46a5f61df9e456b2000a10507ceb70945bed854`. Los resultados por plano están en `montaje/validacion-final.json`. La entrega queda en la carpeta local de revisión.
