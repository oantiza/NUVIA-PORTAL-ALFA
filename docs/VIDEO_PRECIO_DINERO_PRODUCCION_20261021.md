# El precio del dinero · Inicio de producción · 21-10-2026

## Orden y alcance

El fundador indicó: «comienza la creacion del video . y usa las herramientas mencionadas, blender, cavalry y davinci resolve cuando sea necesario.» Se inicia la producción local del guion y storyboard documentados en `VIDEO_PRECIO_DINERO_GUION_STORYBOARD_20261021.md`.

Los archivos se guardan en `output/produccion/el-precio-del-dinero-20261021/video-v01/`, excluidos de la web y del repositorio. Se utilizan efectivamente Blender 5.2.2 LTS, Cavalry mediante su editor de JavaScript y DaVinci Resolve Studio 21.1.1 mediante su API, incluido Fusion. No se emplea Remotion.

## Trabajo realizado

- Escena Blender editable con 134 objetos: moneda simbólica, cesta y productos, luces y tres cámaras animadas. Tres planos de seis segundos; composición corregida para subtítulos. La tipografía queda empaquetada.
- Título de seis segundos animado y renderizado en Cavalry, más 76 tarjetas de planificación correspondientes a las escenas restantes.
- Proyecto Resolve independiente con 80 segmentos de seis segundos, 20 marcadores de producción y 134 bloques nativos de subtítulos provisionales. Tres rótulos nativos Text+ en Fusion.
- Dos pistas originales de prueba para la apertura: efectos y música sintética sin voz, 48 kHz estéreo. No se utiliza material musical de terceros.
- Exportación de apertura en 1080p y montaje guía en 720p. Los tiempos, modelos y sonido son de primer pase; las imágenes de las escenas 02–20, el énfasis por palabra y la sincronización con la voz real quedan pendientes.

## Prueba §12 del marco

Se mantiene la prueba de 18 puntos del documento de preproducción: educación general sin recomendaciones, personalización decisoria, comercialización, datos personales ni conexión operativa. Las cifras y supuestos siguen siendo los del guion contrastado; esta fase no añade cálculos financieros ni recomendaciones. La moneda es una representación simbólica del dinero, no una reproducción de una denominación de 100 euros. Las tarjetas de planificación se identifican expresamente como imágenes pendientes. No se atribuye voz ni aprobación al fundador.

## Validación y límites

Se comprueban la duración de 24 segundos de la apertura, formato H.264 1920 × 1080 a 25 fps y audio AAC estéreo de 48 kHz. La pista de imagen del montaje tiene 12.000 fotogramas, 80 clips contiguos y sin huecos. La pista de subtítulos contiene 134 bloques; los marcadores conservan los caracteres españoles. Se inspeccionan fotogramas renderizados de la moneda, la cesta, la retirada de productos, el título y las tarjetas guía.

La mezcla provisional de la apertura tiene un pico de muestra de aproximadamente −11,3 dBFS; no es la mezcla final con voz. Los subtítulos están visibles en las exportaciones de revisión; su animación por palabra sigue pendiente.

No se ha tocado código de producto, rutas, base de datos, Firebase, publicación ni configuración del portal. Las comprobaciones de la web y las incidencias de contraste preexistentes se documentaron en el acta de preproducción; esta fase no las modifica ni declara superadas. No hay commit ni despliegue.

## Continuación v02 · Película completa de ocho minutos

Orden del fundador: «Continúa con las escenas restantes hasta completar los ocho minutos. Sustituye las tarjetas por animaciones de Blender y Cavalry y monta todo en DaVinci Resolve. La locución la añadiré yo después».

La producción se conserva en `output/produccion/el-precio-del-dinero-20261021/video-v02/`. Se mantiene la apertura producida en v01 y se sustituyen sus 76 tarjetas guía por animaciones renderizadas. El proyecto nuevo de Resolve se llama `El precio del dinero - Pelicula completa v02 - 20261021`; la versión anterior permanece disponible.

### Trabajo material

- Blender: 19 escenas de seis segundos, con modelos, cámaras, luces y animación. Se renderizan 2.850 fotogramas de las escenas nuevas a 1920 × 1080. Se corrige el encuadre de las fábricas y se empaqueta la tipografía en el archivo `.blend`.
- Cavalry: 19 composiciones de 18 segundos, con tres fases gráficas de seis segundos. Se renderizan 8.550 fotogramas. Las escenas 04 y 08 se revisan para impedir la aparición simultánea de dos fases; Resolve utiliza los clips corregidos con sufijo `-r2`.
- DaVinci Resolve: 80 clips consecutivos de seis segundos; 20 marcadores con la locución; dos líneas de tiempo, limpia y subtitulada. Se crean 134 subtítulos nativos Text+ con énfasis dorado y animación de entrada. El SRT se conserva en una pista de referencia desactivada.
- Audio: dos pistas originales de 480 segundos, música instrumental y efectos, estéreo a 48 kHz. A1 permanece vacía para la voz del fundador. La mezcla se terminará cuando exista esa grabación.
- Storyboard: HTML actualizado con 80 fotogramas reales y navegación por escenas; tabla maestra, guion limpio y plan de montaje CSV. Los fotogramas de gráficos se toman después de su entrada para mostrar las proporciones finales.

### Prueba §12 y alcance

Continúa vigente la prueba de 18 puntos de preproducción. Se mantienen los ejemplos hipotéticos y sus supuestos; no se añaden productos, recomendaciones ni decisiones personalizadas. El objetivo de inflación del BCE se distingue de una cifra observada. Las metáforas 3D no representan escalas estadísticas; los gráficos de cifras usan los valores del guion. No se incorporan datos personales ni se escribe en bases de datos. No se emplea Remotion.

La locución queda expresamente pendiente del autor. El SRT y los Text+ tienen tiempos provisionales, editables, que deberán ajustarse a la grabación. Esta entrega es una producción audiovisual local; no integra ni publica contenido en la web, no realiza commit ni despliegue y no modifica las incidencias previas de validación del portal.

### Validación del montaje v02

Se verifica mediante la API de Resolve que cada línea de tiempo contiene 80 clips de imagen, sin huecos, con final exclusivo en el fotograma 12.000 y duración uniforme de 150 fotogramas por plano. No quedan tarjetas guía. Ambas contienen 134 Text+ y 134 bloques SRT; la línea limpia tiene desactivados los subtítulos. A1 está vacía y A2/A3 cubren 480 segundos.

Se inspeccionan los 80 planos extraídos del MP4, además de ampliaciones de las cifras, las correcciones y el cierre. Se ajusta el espaciado entre fragmentos blancos y dorados de 78 subtítulos en ambas líneas de tiempo. El texto completo conserva los caracteres españoles; las líneas del SRT no superan 45 caracteres.

Los 38 clips nuevos y las dos exportaciones se comprueban con ffprobe: 1920 × 1080, 25 fps; las películas completas tienen 12.000 fotogramas, 480 segundos y audio AAC estéreo a 48 kHz. Los dos WAV originales tienen 23.040.000 muestras por canal. La mezcla de base tiene un pico de muestra de aproximadamente −14,86 dBFS; sigue pendiente el ajuste final con voz. Se contrastan también los cálculos 107,10 € y −1,90476 %.

Los archivos `.drp` y `.drt` se exportan desde Resolve. El proyecto requiere los medios conservados en las carpetas `video-v01` y `video-v02`; no es un archivo con todos los medios incrustados. Los resultados se registran en `video-v02/control/validacion-entrega.json` y las láminas de revisión en `video-v02/control/revision-final/`.
