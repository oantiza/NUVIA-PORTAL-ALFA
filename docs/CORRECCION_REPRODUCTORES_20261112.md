# Corrección de reproductores y TradingView · 12-11-2026

## Orden del fundador

«Corrige esas incidencias sin cambiar el diseño ni perder contenidos o funcionalidades, y vuelve a comprobarlo todo en escritorio y tablet. No publiques todavía.»

Este cambio resuelve F-01 y F-03 del acta `REVISION_FUNCIONAL_PUBLICA_20261112.md`. No sustituye los identificadores de los vídeos indisponibles ni afirma haber recuperado su disponibilidad externa. No modifica contenido, configuración de símbolos, cálculos, estilos, cabeceras o navegación.

**Actuación posterior:** el fundador facilitó los cinco enlaces nuevos de YouTube. Su sustitución y reproducción real están documentadas en `CORRECCION_FUNCIONAL_Y_VALIDACION_20261112.md`; los identificadores conservados durante la reparación inicial del reproductor se actualizaron en ese paso posterior.

## Curso: asociación del vídeo al capítulo

El contenedor del reproductor de `curso.html` recibe una clave dependiente de `videoSrc`. Al cambiar de capítulo, React desmonta el medio anterior y crea el marcador del nuevo capítulo. Se conserva la activación voluntaria. La navegación Atrás recupera el capítulo y su portada; los cambios de progreso dentro del mismo capítulo conservan el vídeo que ya está reproduciéndose.

Se mantienen íntegros el programa, títulos, textos, imágenes, identificadores audiovisuales, enlaces, PDF y actividades del curso. El cambio de fuente de vídeo no se trata como una nueva reproducción automática.

## TradingView: conservación de la plantilla inerte

`support.js` conserva el `innerHTML` estático de los elementos `<template>` dentro de su fragmento inerte. La API de React utiliza `dangerouslySetInnerHTML` exclusivamente con ese marcado ya escrito en la página; no recibe texto del lector ni del proveedor. El componente externo sigue sin existir en el árbol activo hasta la acción del usuario.

Inventario: solo existe un `<template>` en las fuentes publicables del portal, el de TradingView en `mercados.html`. No contiene interpolaciones. Se conserva su configuración exacta de tres grupos y doce símbolos. No se cambia la plantilla ni se duplica su configuración en otra ubicación.

El cargador común valida la presencia de `tv-market-overview` en el fragmento antes de iniciar la carga o sustituir el marcador. Si falta, mantiene el botón y el enlace alternativo, y comunica el error en el estado accesible existente. Con contenido válido, continúa cargando el módulo externo únicamente después del clic.

**Mantenimiento del runtime:** la cabecera de `support.js` lo identifica como generado, pero `dc-runtime/` y sus fuentes no se encuentran en este repositorio. Este parche local debe conservarse o trasladarse al generador cuando vuelva a incorporarse. La nueva regresión protege la semántica que debe mantenerse en una futura actualización.

## Prueba del §12

Necesidad educativa/informativa: poder reproducir el contenido elegido y consultar el panel ya existente. Entradas: URL de la pieza seleccionada y plantilla estática autorizada; sin circunstancias personales. Transformación: recrear el contenedor correcto y preservar la semántica inerte de HTML, sin nuevos cálculos, clasificación ni edición de resultados. Salida: mismo vídeo o widget previsto, tras la elección expresa.

No se añaden recomendaciones, juicios de idoneidad, precios objetivo, rankings, señales, llamadas a operar, contratación, derivaciones, patrocinios o remuneración. No interviene IA, no se registran datos personales, no se alteran fuentes financieras ni avisos, y no cambia la separación profesional. Los datos concretos del widget continúan procediendo del mismo proveedor y conservan sus límites. Clasificación interna del cambio: verde, reparación de integración y navegación audiovisual. Las regresiones de inercia, cambio de capítulo y recuperación impiden perder estos controles.

## Validación

- `node docs/nuvia-reproductores.test.mjs .`: correcto a 1440, 1024 y 768 px. Prueba persistente de capítulo 1 → reproducción → progreso → capítulo 2 → reproducción → Atrás; plantilla inerte antes del clic; conservación de los doce símbolos; activación explícita; recuperación ante plantilla vacía sin perder botón ni enlace.
- La regresión usa sustitutos explícitos de YouTube y TradingView para comprobar la integración de forma determinista. No presenta esas respuestas como prueba de disponibilidad del proveedor.
- Comprobación adicional con proveedores reales y fuentes locales: el curso desmonta el iframe al cambiar de capítulo y recupera la portada al volver. TradingView carga gráfica y cotizaciones en los tres tamaños, y sus pestañas permiten recorrer Índices/SPX500 → Divisas/EURUSD → Materias primas/GOLD → Índices/SPX500.
- El widget del proveedor utiliza Shadow DOM cerrado. La prueba real lee sus nodos mediante CDP y activa sus pestañas con clics reales, sin modificar el proveedor, la red ni sus respuestas. Los primeros selectores del auditor buscaban solo en Shadow DOM abierto y produjeron tiempos de espera, aunque la captura mostraba el panel correcto; los registros se conservan. El cierre válido es `widget-real.json` (3/3 correctos).
- `npm run validate:academia` y `npm run validate:nucleo`: código 0. No se modifica ni relaja ningún contrato previo. La validación y compilación globales se coordinan en el cierre general de la reparación.
- `git diff --check`: correcto para las fuentes afectadas. No hay cambios de CSS ni diferencias de contenido fuera de los mecanismos descritos.

Evidencias: `output/correccion-funcional-20261112/reproductores/`, con `regresion.log`, registros de validación, `widget-real.json`, capturas `tradingview-real-{1440,1024,768}.png` y las portadas recuperadas del capítulo 2. Los registros iniciales `live*.json/log` no son el resumen final de disponibilidad del widget.

No se realiza commit, publicación ni escritura en Firebase.
