# NUVIA · Las tres hojas y el plano del mar

## Petición del fundador

El fundador señala pequeños saltos en las hojas de la N al principio de la película, pide cambiar la música y aporta como referencia el fotograma con la página «Respiración y relajación». Propone tratar la foto y el texto como parte del vídeo. Es una edición local de la [película con el olivar y la unión de los aros](VIDEO_OLIVAR_MUSICA_Y_UNION_NUVIA_20261122.md).

## Prueba del apartado 12 del marco

| Alcance | Aplicación |
| --- | --- |
| Objeto y público | Presentación institucional para las familias. Se ajustan la animación de marca, un plano de bienestar y la música de fondo. |
| Datos y resultado | La película es lineal. Las fuentes son la firma de la marca, la fotografía editorial del portal y la grabación de la voz de la edición anterior. |
| Independencia y lenguaje | Se conserva el guion aprobado. La frase del plano de respiración acompaña el pasaje que habla del descanso. |
| Verificación | Comprobación de la animación sobre la película decodificada, del paso por el plano del mar y del sonido en la exportación. |

## Tratamiento de la imagen y del sonido

En la edición anterior, durante la presentación frontal del logo, una hoja saltaba y regresaba en exposiciones contiguas. Los centros del pigmento verde medidos sobre el MP4 registraban hasta 116,87 píxeles de desplazamiento respecto de la pose de referencia durante la presentación de la marca. Para la revisión se fijó la pose de las tres hojas y se definieron trayectorias independientes hasta el capullo.

En el plano de Familia y bienestar se empleó el original fotográfico de 1679 × 937. La composición deja a la mujer a la derecha y abre el cielo hacia el título «Unos minutos para respirar», en Newsreader. El plano va del fotograma 3103 al 3242, del segundo 62,06 al comienzo de 64,86. Se verificaron tanto los fundidos con las escenas vecinas como el contraste del texto ya codificado. [Control del plano](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/mar/comprobacion-mar.json)

La música se titula «Corriente de fondo». Combina bajo electrónico, armonías sintetizadas y percusión de madera. La entrada deja espacio a la primera frase de Charon. La resolución coincide con la figura de portada a los 91,48 segundos. Se guardaron por separado la mezcla y la música. [Procedencia instrumental](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/audio/Procedencia.md) · [Control de la mezcla](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/audio/control-audio.json)

## Entrega para visionado local

- [Película completa](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/NUVIA-Todo-esta-conectado-Mar.mp4)
- [Entrada con la firma y las tres hojas](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/La-entrada-de-NUVIA.mp4)
- [El plano del mar con su entrada y salida](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/Unos-minutos-para-respirar.mp4)
- [Proyecto de DaVinci Resolve](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/resolve/NUVIA-Hojas-y-mar.drp) · [Apertura editable en Blender](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/apertura/NUVIA-Tres-hojas.blend)

## Verificación

1. Se decodificaron las 4.672 imágenes del archivo de 93,44 segundos, Full HD a 50 fps, con audio estéreo a 48 kHz. Se comparó con la edición anterior cada imagen de las diez bobinas ajenas a esta revisión. En las 3.660 imágenes comprobadas la luminancia reducida a 144 × 80 coincidió exactamente, incluido el cierre de los cuatro aros. [Máster](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/master.json) · [Continuidad](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/continuidad.json)
2. Se midieron por separado las tres hojas sobre el vídeo entre 0,46 y 3,00 s, durante la presentación frontal. En las 128 exposiciones se identificaron las tres. El mayor desplazamiento aparente de sus centros de pigmento respecto al fotograma de referencia fue de 0,5 px en la nueva compresión. También se revisaron el plegado y los empalmes en los segundos 8,20 y 8,46. [Medición](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/estabilidad-hojas.json) · [Detalle comparado](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/detalle-hojas.jpg) · [Empalmes](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/empalmes.jpg)
3. Las catorce intervenciones conservaron el tiempo de la grabación de Charon. La comprobación por correlación en la exportación AAC dio un desplazamiento de cero muestras a 12 kHz en todas las intervenciones y una correlación mínima de 0,9935. [Reloj de la voz](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/reloj-de-voz.json)
4. Se reprodujeron a velocidad normal la entrada, el plano del mar y el cierre en Edge. Se presentaron 660, 224 y 226 fotogramas respectivamente; los tres tramos registraron cero esperas y cero fotogramas descartados. [Reproducción](../output/nuvia-cuatro-webs-20261117/revision-hojas-mar-20261122/validacion/reproduccion.json)
5. El proyecto de DaVinci Resolve contiene trece bobinas, catorce marcas de locución y pistas separadas de voz, música y mezcla. Se completaron la validación del Núcleo y la validación completa del portal, incluida la auditoría de 51 páginas.
