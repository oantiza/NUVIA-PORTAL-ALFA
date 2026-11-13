# Publicación del vídeo de Qué es NUVIA · 13-11-2026

## Orden del fundador

«Súbelo y publica».

Autoriza commit, envío normal a `main` y publicación del vídeo institucional terminado y su integración en «Qué es NUVIA», exclusivamente en `oantiza/NUVIA-PORTAL-ALFA` mediante `.github/workflows/pages.yml`. Sustituye el estado sin publicar de la entrega anterior. No autoriza Firebase ni trabajos locales ajenos.

## Alcance

Película «Todo está conectado»: 58 segundos, Full HD, 25 fps, voz en español, música y efectos originales. Se publica la copia web de 11.414.443 bytes, su póster y los 17 subtítulos. El máster, Blender, Resolve, pistas y material de producción permanecen en `output/`, fuera del repositorio y del sitio.

La página incorpora reproducción voluntaria, controles nativos, subtítulos y transcripción. El HTML anterior se conserva exactamente al descontar el bloque nuevo. Los estilos se limitan a `.about-film`. El servidor de revisión local incorpora MIME VTT y rangos HTTP; no determina la configuración de GitHub Pages.

Se incluyen exclusivamente la página, estilos del vídeo, sus tres medios, servidor de revisión, actas de producción/publicación y entradas correspondientes de AGENTS/índice. Quedan fuera los cambios de Jubilación, sus pruebas y acta, los documentos audiovisuales de octubre y referencias ajenas del índice, el prototipo histórico y el cierre local de una publicación anterior. No se eliminan ni modifican estos trabajos.

## Prueba §12

Mantiene la prueba de la [producción](VIDEO_QUE_ES_NUVIA_3D_20261112.md): presentación institucional sin personalización, recomendaciones, juicio de idoneidad, llamada a operar ni promesas financieras o sanitarias. No incorpora datos personales, nuevas integraciones externas, patrocinios o derivación comercial. El reproductor entrega archivos propios y no contacta con los servicios utilizados durante la producción.

## Validación y publicación

Entrega previa: `validate:nucleo`, compilación completa con `validate` y `auditar`, decodificación íntegra y pruebas del vídeo en fuente y `dist/` correctas. Navegador Chromium a 1440, 1024 y 768 px, con emulación táctil en tablet: controles, audio, subtítulos, saltos temporales, transcripción por teclado y ausencia de desbordes y errores propios. Evidencias: `output/video-que-es-nuvia-20261112/qa/`.

La publicación valida una instantánea de los archivos exactos preparados para el commit, dentro de `output/publicacion-video-20261113/`, excluyendo los cambios ajenos del árbol de trabajo. La instantánea es un artefacto temporal de comprobación dentro del repositorio oficial, no otro proyecto ni canal de publicación. GitHub Actions repetirá sus controles completos y revisión de tablet.

Referencia inicial local y remota: `99fefce0bb8a2fe670719d33128ea2139df4e035`. El envío no fuerza la historia. Se identifica la ejecución por el SHA publicado y se comprueban después página, medios, MIME, rangos y reproducción pública. Esta preparación no declara éxito antes de observarlo. El cierre y los recibos se guardarán localmente tras la comprobación, sin provocar otra publicación solo documental.
