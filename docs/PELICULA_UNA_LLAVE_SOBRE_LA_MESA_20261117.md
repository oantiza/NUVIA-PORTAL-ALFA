# Una llave sobre la mesa

## Encargo del fundador

Rediseñar la película de «Qué es NUVIA», escribir un guion original que comunique el espíritu del proyecto y sus cuatro webs, y producir una cinemática 3D de entre uno y dos minutos con Blender y DaVinci Resolve Studio. La entrega es una versión local de revisión.

## Guion y puesta en escena

La película parte de un diálogo ficticio entre un padre y su hija. La niña pregunta si algún día podrá tener una casa cerca. El padre empieza pensando en dinero y descubre que a ella le importa, sobre todo, vivir cerca de sus abuelos. Al final, la hija recibe la llave con la que empezó la conversación. El relato presenta la educación independiente de NUVIA, la posibilidad de experimentar con supuestos y el valor de aprender a formular preguntas.

Se revisaron la página institucional y la definición canónica en `docs/DEFINICION_NUVIA.md`. Los cuatro nombres se mantienen tal como aparecen en la web. La compra semanal introduce Economía y finanzas. La maqueta de una casa da pie a Patrimonio. Una silla infantil en la mesa de sus abuelos presenta Familia y bienestar. El ábaco sitúa la pregunta sobre el interés en Academia NUVIA. La secuencia de libros nombra expresamente los dos espacios comunes, Lecturas con Criterio y Colaboradores.

El guion de lectura y la locución por escenas están en `output/pelicula-nuvia-20261117/guion.md` y `guion.json`. El guion ocupa 96 segundos. Los cambios de escena son a los segundos 11, 24, 35, 48, 58, 70 y 82.

Se compararon las palabras de cada bloque de voz con el contenido principal de `que-es-nuvia.html`, sin distinguir mayúsculas ni puntuación. La coincidencia continua más larga fue de tres palabras. Entre esas coincidencias figuran «Economía y finanzas», «Familia y bienestar», «Lecturas con Criterio» y el cierre «Todo está conectado».

## Producción

Las miniaturas se modelaron e iluminaron en Blender 5.2.4 con Cycles. La mesa de estudio tiene un fondo continuo. La luz cálida incide sobre el latón y el papel y una luz fría recorta los perfiles. La cámara se desplaza por los escenarios mientras actúan la llave, las monturas, los platos de la balanza, las piezas de la casa, las sillas, las cuentas y los folios.

Cuatro cámaras de detalle añaden otra escala a la narración. La primera acompaña la caída de la llave durante los primeros 60 fotogramas. Las otras tres acercan al espectador a los platillos de la balanza, a la silla pequeña junto al café y a las filas del ábaco. Se revisaron la entrada, el centro y la salida de cada encuadre. Los primeros planos se presentan a pantalla limpia.

La voz española de Charon se generó para el texto definitivo en ocho tomas. Se midieron la entrada y la salida de cada frase y se verificaron contra la locución montada. La música es original y baja bajo la voz. El montaje utiliza la firma oficial en negativo y las familias Newsreader e Inter. La frase «Todo está conectado» se sincroniza con las últimas palabras de Charon.

## Prueba regulatoria del apartado 12

| Preguntas | Aplicación a la pieza |
|---|---|
| 1–4. Finalidad, entradas, transformación y resultado | Presentación educativa. Las entradas son el guion y la identidad de NUVIA, las miniaturas, voz y música creadas para la película. El resultado es un vídeo lineal que explica qué encontrará una familia en la web. |
| 5–10. Instrumentos, circunstancias, acciones, precios, selección y recomendaciones | El ejemplo de la compra y el de variar el plazo de una hipoteca ilustran preguntas. No aparecen instrumentos, entidades, ofertas identificables, cifras de mercado, previsiones, recomendaciones ni circunstancias de un espectador. |
| 11–14. Diseño, contacto y separación profesional | Los materiales y colores distinguen objetos. La pieza carece de puntuaciones, llamadas a contratar, patrocinios, afiliaciones o derivaciones a servicios profesionales. |
| 15–16. Datos e IA | La familia es ficticia. Charon interpreta un texto cerrado. El vídeo no recoge datos del público ni genera respuestas a sus circunstancias. |
| 17–18. Fuentes, límites y controles | Página institucional y definición canónica del proyecto. El relato sitúa los límites de una respuesta ante la pregunta de la hija. La revisión cubre el guion hablado, la duración, la legibilidad de los rótulos, la continuidad de imagen y sonido y la decodificación íntegra de la entrega. |

Clasificación informativa verde.

## Controles del portal

Pasaron `npm run validate:nucleo` y `npm run validate`, incluida la auditoría de render de las 51 rutas a 1440 px y las pruebas de reproductores a 1440, 1024 y 768 px. Los registros se encuentran en `montaje/validate-nucleo.log` y `montaje/validate.log`. Estos controles comprueban el portal existente. La nueva película se entrega aparte para revisión del fundador.

## Máster de revisión

`output/pelicula-nuvia-20261117/montaje/NUVIA-Una-llave-sobre-la-mesa.mp4` contiene 2.304 fotogramas en H.264 a 1280 × 720 y 24 fps. El audio estéreo AAC a 48 kHz mide −16,54 LUFS con pico verdadero de −1,48 dBTP. Tanto la imagen como el sonido duran 96 segundos. El archivo, de 51.565.225 bytes, se decodificó íntegro y su SHA-256 es `f4dcd20a0b9e9ad5a3e8c68b3e64cc7ed09265cd4885e37892e6fd7f39ad7b48`.

Se compararon el primer fotograma, el central y el último de los cuatro planos detalle codificados con sus imágenes de Blender. Se revisaron también quince fotogramas extraídos del MP4 para verificar la apertura, los cuatro nombres, los dos espacios comunes y el cierre. El informe de vídeo y audio está en `montaje/master-qa.json` y la hoja de visionado en `pruebas/visionado-master.jpg`.

El proyecto de DaVinci Resolve Studio 21.2 se exportó a `resolve/NUVIA-Una-llave-sobre-la-mesa.drp`. La línea de tiempo contiene ocho escenas contiguas, ocho marcadores y tres pistas de audio. La mezcla está activa y la voz y la música originales quedan disponibles por separado. El archivo enlaza los medios de las carpetas hermanas `montaje/` y `voz/`. Se verificaron la integridad del proyecto exportado y la duración de la línea de tiempo.
