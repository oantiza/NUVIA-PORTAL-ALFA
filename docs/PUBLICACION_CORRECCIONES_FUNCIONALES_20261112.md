# Publicación de correcciones funcionales · 12-11-2026

## Orden del fundador

«Perfecto, publica esta versión corregida en GitHub Pages, con los vídeos actualizados y todas las correcciones, manteniendo el diseño.»

La orden autoriza commit, envío a `main` y despliegue de la versión corregida ya comprobada, exclusivamente desde `oantiza/NUVIA-PORTAL-ALFA` mediante `.github/workflows/pages.yml`. Sustituye el estado «sin publicar» de la entrega anterior. Producción: `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`.

## Versión que se publica

La versión aprobada es la descrita en [Correcciones funcionales y validación local](CORRECCION_FUNCIONAL_Y_VALIDACION_20261112.md):

- Vídeos de PIB y capítulos 2–5 actualizados con los enlaces aportados por el fundador y asignados por sus títulos comprobados.
- Reproductor del curso asociado al capítulo actual; cambio de capítulo, Atrás, Adelante y progreso conservados.
- TradingView recuperado mediante la conservación de la plantilla inerte y comprobación del fragmento antes de cargar.
- Lectura de cierres anteriores de Empresas con comparación estable de versiones, manteniendo la detección de cambios reales.
- Cuatro fuentes oficiales recuperadas y sincronizadas con los informes descargables y el lector integrado.
- Pruebas de regresión y documentación de las revisiones y correcciones.

No cambia CSS, logotipos, cabeceras, pies, textos editoriales, composición, navegación ni fórmulas. Se mantienen contenidos, herramientas, calculadoras, almacenamiento local y controles de activación de proveedores. No se incorporan vídeos MP4 al portal ni se escribe en Firebase.

El commit incluye las fuentes, pruebas y actas de esta reparación, las dos revisiones públicas que la precedieron y el cierre documental de la publicación anterior del logo común. Quedan fuera los ocho documentos audiovisuales locales de octubre, sus dos referencias del índice, el prototipo histórico y `output/`. El contenido excluido se conserva en el espacio de trabajo. `dist/` no se versiona: lo compila el flujo oficial.

## Validación de la versión aprobada

Antes de esta orden se completó `npm run build` con código 0, incluyendo `npm run validate`, `npm run auditar`, compilación y comprobación del artefacto. Antes del commit se vuelve a comparar su manifiesto: los 245 archivos conservan exactamente los hashes de la versión validada; no hay cambios de producto posteriores a las pruebas.

- 59 rutas y 177 vistas en 1440, 1024 y 768 px, sin errores de recursos propios, JavaScript o desbordamientos.
- Patrimonio: 60/60 escenarios y 494/494 anclas territoriales.
- Academia y espacios comunes: 33/33 grupos; vídeos nuevos y transiciones: 18/18.
- Economía, Cartera y Empresas: 63/63 recorridos; cierres anteriores: 15/15 consultas y reconsultas.
- TradingView real: correcto en los tres tamaños. Regresión de reproductores también correcta sobre `dist/`.
- 205 destinos HTTP: 201 correctos y cuatro referencias externas con protección 403, conservadas como no verificables automáticamente.
- Render del repositorio: 51 vistas a 1440 px; módulo compilado de Empresas correcto a 1440, 1280, 1024, 820 y 768 px.

La evidencia completa está en `output/correccion-funcional-20261112/` y en las actas técnicas enlazadas. GitHub Actions repetirá la construcción, validación completa y auditoría crítica de tablet antes de publicar. El flujo mantiene sus actualizaciones informativas habituales de fuentes oficiales; esas actualizaciones no alteran el diseño.

## Prueba del §12

La publicación no añade funciones ni transformaciones a la reparación validada. Conserva las pruebas del §12 de las actas de reproductores, cierres y enlaces. No introduce recomendaciones, juicios de idoneidad, llamadas a operar, perfiles personales, contratación, derivación, publicidad o nuevas integraciones. Se conservan fuentes, fechas, límites y separación profesional. El módulo de Empresas mantiene su clasificación ámbar por emisores identificables, sin ampliación del alcance.

## Comprobación del despliegue

Referencia inicial local y remota: `07e8ad408045bc00d5e7f0cd6fb288e34c90d52a`. Se enviará el commit sin forzar la historia, se identificará la ejecución por su SHA y se esperará su resultado final. Después se verificarán en la URL pública los cinco vídeos, la asociación del reproductor, TradingView, cierres anteriores, enlaces corregidos y conservación de recursos visuales. Los recibos se guardarán en `output/publicacion-correcciones-20261112/`.

Esta sección registra la preparación autorizada; no declara éxito del despliegue antes de observarlo. El cierre efectivo se añadirá después de comprobar GitHub Actions y la web pública, sin provocar una segunda publicación solo documental.
