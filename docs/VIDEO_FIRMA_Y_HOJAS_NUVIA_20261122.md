# Todo está conectado · Firma y hojas

## Encargo del fundador

> Quiero que la entrada sea Nubia Family Wealth en ligeramente más grande y ligeramente más llamativo. No sé si un color más oscuro. Y la transición de Nubia Family Wealth hacia el capó, el capullo que se abre de cuatro hojas también hazla un poco más lenta […] Quizás se puede hacer algo para darle un toque más de elegancia, un toque más quizás las esquinas redondeadas […].

Dar más presencia a la firma tridimensional de NUVIA Family Wealth al comienzo de la película, con un tamaño algo mayor y un azul más oscuro. La transformación desde la firma hasta el capullo de cuatro hojas debe avanzar más despacio, para que se distinga el nacimiento de la figura. La revisión incluye una entrada más pausada de los aros y un marco más elegante en las nueve capturas de las webs.

El material de referencia es la [edición con los nueve encuadres revisados](VIDEO_ENCUADRES_CUATRO_WEBS_20261122.md). El proyecto de esta revisión se conserva en `output/nuvia-cuatro-webs-20261117/revision-firma-y-hojas-20261122/`.

El fundador confirmó la elección con «Usar el nuevo guion que me has enseñado». La nueva locución de Charon parte del coste de una vivienda y del tiempo para cenar en familia. Desde esa decisión introduce el carácter educativo e independiente del proyecto, el criterio propio frente a una propuesta del banco, las cuatro webs y las aportaciones de profesionales, docentes y lecturas. La firma final conserva «NUVIA. Todo está conectado». Las once intervenciones están en `guion.json`. La duración fijada es de 118 segundos, equivalentes a 2.950 fotogramas a 25 fps.

## Prueba del apartado 12 del marco regulatorio

| Preguntas | Aplicación a la edición |
|---|---|
| 1–4. Necesidad, entradas, transformación y resultado | La apertura debe hacer reconocible la marca y mostrar cómo se relacionan las cuatro webs. Se animan la firma oficial, las hojas y los aros. Las nueve vistas sitúan cada parte de la explicación en una página real del portal. |
| 5–10. Instrumentos, circunstancias personales, operaciones, precios, selección y recomendaciones | Los contenidos de cartera, hipoteca, jubilación e interés compuesto se muestran como ejemplos de las herramientas. El vídeo es lineal y educativo. Ninguna decisión del espectador se introduce en su reproducción. |
| 11–14. Diseño, contacto, remuneración e independencia | El azul identifica a NUVIA y los aros distinguen sus webs. El marco debe delimitar cada captura completa y mantener visibles sus títulos, unidades y leyendas donde correspondan. El diseño carece de llamadas a contratar y de enlaces a entidades comerciales. |
| 15–16. Datos e IA | La película presenta un guion cerrado con locución en español. La reproducción no recaba datos personales ni genera respuestas adaptadas a la familia. |
| 17–18. Fuentes, límites y controles | La referencia editorial es la [definición de NUVIA](DEFINICION_NUVIA.md) y las pantallas proceden de los contenidos del portal. Se comprueban la animación, el encuadre, la continuidad de voz y música y la correspondencia entre la exportación y el proyecto editable. |

Clasificación interna verde para la presentación audiovisual.

## Locución y sonido

Charon grabó once intervenciones. El primer ataque se oye a los 0,476 segundos y la última sílaba termina a los 117,314. La mezcla estéreo a 48 kHz mide −16,50 LUFS y −1,58 dBTP. Las tres pistas de 118 segundos se conservan en `audio/mezcla.wav`, `audio/locucion.wav` y `audio/musica.wav`. El proyecto de montaje incluye once marcas de duración en la pista de voz. Cada marca corresponde a la intervención entre su entrada y salida acústicas, redondeadas al fotograma más próximo. Los tiempos en segundos constan en `voz/marcas.json`.

## Controles del portal

`npm run validate:nucleo` y `npm run validate` finalizaron con código 0. Las pruebas de los reproductores pasaron a 1440, 1024 y 768 px. La auditoría de render recorrió 51 rutas a 1440 px. Los registros de esta edición están en `validacion/validate-nucleo.log` y `validacion/validate.log`.

## Película y proyecto editable

La [película para revisión](../output/nuvia-cuatro-webs-20261117/revision-firma-y-hojas-20261122/montaje/NUVIA-Todo-esta-conectado-Firma-y-hojas.mp4) se decodificó en su totalidad. Contiene 2.950 fotogramas H.264 en Full HD a 25 fps y audio AAC estéreo a 48 kHz. La duración es de 1:58 y el archivo ocupa 55.371.256 bytes. La mezcla del MP4 mide −16,51 LUFS y −1,58 dBTP. Su SHA-256 es `04b834276e34d228398d6e3681590259a8e67fdf4cc0bc41e8a9c6afce6bcf27`.

Se cotejaron 30 fotogramas del MP4, tres por cada una de las nueve pantallas y tres de la figura final. Los nueve encuadres mantuvieron su posición y sus contenidos quedaron completos. El cierre se contrastó con `src/assets/ecosistema/conexiones.webp`. Las mediciones se conservan en `validacion/master.json` y `validacion/contraste-master.json`. La [hoja de visionado](../output/nuvia-cuatro-webs-20261117/revision-firma-y-hojas-20261122/validacion/visionado.jpg) reúne los momentos principales.

El [proyecto editable de DaVinci Resolve Studio](../output/nuvia-cuatro-webs-20261117/revision-firma-y-hojas-20261122/resolve/NUVIA-Todo-esta-conectado-Firma-y-hojas.drp) contiene siete clips con cortes en los fotogramas 0, 400, 935, 1410, 1831, 2205 y 2508. Se verificaron las rutas de los siete vídeos y de las tres pistas de audio de esta edición. La mezcla final es la única pista activa. La voz y la partitura quedan disponibles en pistas independientes. La línea de tiempo quedó abierta en el primer fotograma. La comprobación de integridad del proyecto y de sus 2.950 fotogramas consta en `validacion/resolve.json`. Para trasladar la edición se conservan juntas las carpetas `montaje/`, `audio/` y `resolve/`.
