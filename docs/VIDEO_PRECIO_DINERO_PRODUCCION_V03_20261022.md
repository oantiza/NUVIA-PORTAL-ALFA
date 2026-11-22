# El precio del dinero · Producción audiovisual v03 · 22-10-2026

## Orden del fundador

«Ahora crea el vídeo de ocho minutos siguiendo este storyboard, con animaciones de Blender y Cavalry y el montaje en DaVinci Resolve. La locución la añadiré yo después.»

## Alcance y ejecución

Trabajo audiovisual local en `output/produccion/el-precio-del-dinero-20261021/video-v03/`, siguiendo el CSV del storyboard técnico de 22-10-2026. Se conservan los 80 intervalos de seis segundos, 20 escenas y ocho minutos. Se reutiliza la apertura disponible y se generan 19 escenas nuevas de Blender y 19 composiciones de Cavalry, con tres fases gráficas por composición.

La versión v02 de la base de proyectos de Resolve seguía disponible, pero faltaban sus renders y fuentes nativas en la carpeta local. Se exporta una copia de recuperación y se importa como proyecto independiente `El precio del dinero - Storyboard v03 - 20261022`, conservando la edición, los 134 subtítulos Text+ y las dos líneas de tiempo. Los medios se sustituyen por las nuevas animaciones. No se emplean las tarjetas del montaje guía como película final.

Blender 5.2.2 se utiliza mediante su ejecutable y API Python nativos, dado que el conector no tenía una instancia conectada al iniciar el trabajo. Cavalry se utiliza mediante su editor JavaScript nativo y exportación PNG. Las secuencias se codifican a H.264 antes de incorporarlas a Resolve Studio 21.1.1. El montaje y las exportaciones finales se realizan en Resolve.

El archivo `blender/escenas-02-20-revisadas.blend` incluye ajustes de encuadre en reloj, maqueta de consumo, fábrica, viviendas y depósito; se separan los rótulos nominal/real de sus objetos y se colocan las monedas sobre el plato de la balanza. Las revisiones se identifican con `-blender-r2.mp4`. En Cavalry se corrige el orden de dibujo de las conexiones de la escena 09 para que queden detrás de la etiqueta BCE; se utiliza `escena-09-cavalry-r2.mp4`.

Se mantienen tres pistas de audio: A1 vacía para la locución, A2 efectos y A3 música. Se aplican +3 dB a los efectos y +7 dB a la música sobre las fuentes disponibles, dejando margen para incorporar la voz. La mezcla definitiva y la sincronización de subtítulos requieren la grabación del autor.

## Prueba §12

Se conserva íntegra la prueba de educación financiera general de `VIDEO_PRECIO_DINERO_GUION_STORYBOARD_20261021.md`. Mismos ejemplos hipotéticos y misma locución: 1.000 → 1.050; 100 → 105 → 107,10; 1.030 frente a 1.050; rendimiento real aproximado −1,90 %. Se distinguen el objetivo del BCE y el dato observado, así como el cálculo exacto y la aproximación por resta. Los esquemas de gasto y actividad sin estadísticas se rotulan como ilustrativos. No se incorporan productos, recomendaciones, personalización decisoria, llamadas a operar, datos personales ni conexiones a bases de datos.

## Validación

La comprobación audiovisual queda registrada en `video-v03/control/`: duración, número de fotogramas, continuidad de los 80 planos, existencia de los medios, identidad de los 134 subtítulos respecto al SRT e inspección visual de encuadres y composiciones.

Se verificó que los 134 bloques Text+ coinciden con el texto del SRT, sin discrepancias. Sus centros de línea están en 0,18 y 0,12 de la altura medida desde abajo. Los rótulos explicativos se mantienen por encima de la franja de subtítulos.

La inspección de la copia subtitulada detectó espacios artificiales antes de la puntuación y en las palabras «esperada» y «reales». Se recalculan los centros de los fragmentos Text+ con espacios explícitos solo entre palabras, se mantienen unidos esos dos términos y se vuelve a exportar la copia subtitulada. El contenido verbal no cambia.

Entrega final: dos MP4 H.264 de 1920 × 1080, 25 fps, 12.000 fotogramas y 480 segundos, con audio estéreo de 48 kHz. Resolve notificó ambas exportaciones como completas. Se exportaron también el DRP y las dos líneas de tiempo DRT. El pico de la mezcla de la película limpia es −10,2 dBFS; no contiene locución.

Se decodifican las películas y se extrae un fotograma de cada uno de sus 80 planos para la inspección final. Las hojas de contacto y los hashes de las películas quedan en `control/`. Los 40 medios de vídeo usados por cada línea de tiempo existen y presentan la duración esperada; A1 contiene cero clips y A2/A3 uno cada una. Los 80 intervalos son consecutivos, sin huecos. No quedan referencias de vídeo a las carpetas v01/v02 en las líneas de tiempo finales.

No se modifica el producto web, su navegación, dependencias, Firebase ni la publicación. No hay commit ni despliegue. Esta validación audiovisual no declara resueltas las incidencias de contraste del portal documentadas en la preproducción.
