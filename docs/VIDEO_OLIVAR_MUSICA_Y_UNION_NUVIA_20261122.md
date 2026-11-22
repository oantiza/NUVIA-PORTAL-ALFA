# NUVIA · El paseo, la música y la unión de los aros

## Encargo del fundador

El fundador pide integrar en la película la fotografía de las dos mujeres que pasean por el olivar, cambiar la música y revisar el movimiento de las cuatro piezas en el cierre. Al preguntar qué música encaja con NUVIA, acepta la propuesta de piano acústico y violonchelo.

La referencia es la [edición de ritmo y partitura](VIDEO_RITMO_Y_PARTITURA_NUVIA_20261122.md). La nueva versión conserva la grabación de Charon y el reloj de 93,44 segundos.

## Criterio editorial

La toma del olivar parte del original fotográfico de 1536 × 1024. La foto ocupa toda la escena cuando la voz habla de la salud, el descanso y el tiempo compartido. El encuadre continúa en el plano del paseo y prescinde del marco, las llamadas a la acción y los textos de la página.

El cierre anterior asentaba las piezas antes de terminar la aproximación óptica y pasaba por dos fundidos de textura. El encargo requiere que el movimiento resulte legible a velocidad normal. La revisión se comprueba también sobre las siluetas, los cruces y los reflejos, además de la cadencia del archivo.

## Prueba del apartado 12 del marco

| Preguntas | Aplicación a la edición |
| --- | --- |
| 1–4. Finalidad y resultado | Película institucional para presentar el proyecto y la conexión entre sus cuatro webs. Se utilizan la foto procedente del material de NUVIA, el arte de la portada y la narración ya revisada. |
| 5–10. Datos y decisiones | La edición es lineal y mantiene el guion, el ejemplo de vivienda y el contexto explicativo. |
| 11–14. Diseño e independencia | El olivar acompaña la relación entre bienestar, familia y tiempo compartido. Las cuatro piezas conservan sus identidades y posición final. |
| 15–18. Personas y revisión | La música es una composición para la película. Se documentan las fuentes de los instrumentos muestreados y se contrasta la mezcla con la voz, así como el montaje exportado con los originales. |

## Sonido y vuelo de las cuatro piezas

«Madera y luz» se escribió para la voz de Charon. El piano vertical lleva un motivo en compás de tres. Los violonchelos entran cuando la narración pasa de una generación a la siguiente y acompañan a los aros hasta su unión. El piano responde después de «Todo está conectado». Se conservan la grabación de la voz y sus pausas. La [procedencia de los instrumentos](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/audio/Procedencia.md) identifica las sesiones y su licencia.

Para el cierre se prepararon por separado los cuatro aros en Blender. Los contornos ocultos en la figura de portada se completaron para los instantes en que cada aro está en el aire. El registro de cada cruce depende de la posición de las dos superficies implicadas. En particular, la [comparación ampliada en 1:27,20](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/material/verificacion-del-ajuste.jpg) muestra el interior del aro nacarado y el extremo del verde al encontrarse con el dorado.

## Archivos de revisión

- [Película completa](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/NUVIA-Todo-esta-conectado-Nueva-edicion.mp4)
- [Secuencia de cierre con la música y la voz](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/Cierre-Todo-esta-conectado.mp4)
- [Secuencia del olivar](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/El-olivar.mp4)
- [Proyecto de DaVinci Resolve](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/resolve/NUVIA-Olivar-y-cierre.drp). La línea de tiempo reúne las trece bobinas y catorce marcas de voz. A1 reproduce la mezcla. A2 conserva la voz y A3, la música por separado. Los medios se encuentran en las carpetas locales de la película y de la edición anterior.

## Verificación de la edición local

- Exportación H.264 Full HD a 50 fotogramas por segundo. Se decodificaron los 4.672 fotogramas del máster y se verificaron los tiempos del vídeo y del audio. La mezcla AAC estéreo mide −16,21 LUFS y −1,39 dBTP. [Control del archivo](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/master.json)
- Se compararon los 113 fotogramas en los que se retiró la captura del olivar y se verificaron las transiciones de entrada y salida. Las diez bobinas ajenas al encargo dieron una diferencia nula en la comparación de luminancia fotograma a fotograma a 144 × 80. [Olivar](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/olivar/comprobacion-olivar.json) · [Otras escenas y portada](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/escenas-y-portada.json)
- El movimiento termina en 91,48 s y la palabra «Todo» empieza en 91,4895 s. Se revisaron los bordes y reflejos durante los cruces y se comparó el color del fondo a ambos lados de la composición. Entre 81,56 y 91,36 s se comprobaron 491 fotogramas, todos diferentes de su vecino. [Seguimiento visual](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/seguimiento-del-cierre.json) · [Sincronía de la voz con los rótulos](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/sincronia.json)
- En la reproducción local de Edge a velocidad normal se comprobaron la entrada, el olivar y el cierre. En los tres intervalos se registraron cero esperas y cero fotogramas descartados. La prueba de cierre reprodujo 621 fotogramas. [Reproducción](../output/nuvia-cuatro-webs-20261117/revision-olivar-y-cierre-20261122/validacion/reproduccion.json)
- Se completaron las pruebas del Núcleo y la validación completa del portal, incluida la auditoría de 51 páginas. Se comprobó el archivo de proyecto de Resolve y se volvió a abrir su línea de tiempo con las trece bobinas vinculadas.
