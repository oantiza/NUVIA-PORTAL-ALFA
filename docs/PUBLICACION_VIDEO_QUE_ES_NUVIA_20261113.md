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

## Cierre comprobado

- Commit publicado: `b017a2372ab43c50ac506091a36be69fbd887821`, exactamente diez archivos autorizados. Árbol `6365823506be4ac8a1b562b018bde26e7e066055`. `main` local y remoto coinciden; envío normal, sin forzar historia.
- Instantánea local: `validate:nucleo`, `npm run build` completo, `auditar:tablet` y reproducción del vídeo sobre `dist/`, todos con código 0. La extracción inicial con `git archive` exponía finales de línea CRLF históricos y produjo un fallo de sincronización de informes. Se materializó con `git checkout-index` y los filtros de `.gitattributes`, como en el despliegue, y se repitieron todas las pruebas correctamente. No se alteraron los informes ni se relajaron pruebas. Ambos registros se conservan.
- [Ejecución 43476148367](https://github.com/oantiza/NUVIA-PORTAL-ALFA/actions/runs/43476148367): `completed / success`, SHA exacto, finalizada el 13-11-2026 a las 17:54:14 UTC. Construcción, validación, auditoría de tablet y despliegue correctos.
- Verificación pública terminada a las 17:55:05 UTC. Página y CSS publicados idénticos a la compilación autorizada al normalizar exclusivamente CRLF a LF. MP4, WebP y VTT idénticos por SHA-256 a los archivos del checkout autorizado. Respuestas HTTP 200 y MIME correctos; rangos inicial y final HTTP 206 con bytes exactos.
- Reproducción pública en Chromium a 1440, 1024 y 768 px: audio decodificado, duración de 58 s, 1920 × 1080, 17 subtítulos, reproducción/pausa por teclado, controles táctiles en emulación de tablet, saltos a 40 y 55 s y transcripción por teclado correctos. Cero errores JavaScript, HTTP propios, solicitudes fallidas propias o desbordamientos. No se presenta la emulación como prueba en hardware físico.
- Capturas públicas revisadas: póster en escritorio y cierre en tablet, con composición, logo, textos y controles legibles. El indicador nativo transitorio de carga de la captura inicial desaparece al reproducir, cuya prueba terminó correctamente.
- Los cambios ajenos protegidos conservan sus hashes y permanecen fuera del commit. No se publica el material editable de producción ni se escribe en Firebase.

Producción: [Qué es NUVIA](https://oantiza.github.io/NUVIA-PORTAL-ALFA/que-es-nuvia.html#about-film). Evidencias en `output/publicacion-video-20261113/`: `commit.json`, `validacion.json`, `recibo-despliegue.json`, `pasos-despliegue.json`, `publico/results.json` y capturas. Este cierre se registra localmente tras observar producción y no genera un segundo despliegue documental.
