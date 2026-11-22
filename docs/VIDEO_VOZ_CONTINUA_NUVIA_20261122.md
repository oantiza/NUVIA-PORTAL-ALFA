# Todo está conectado · Voz continua

## Encargo y alcance

El fundador señala diferencias perceptibles de velocidad, timbre y sincronización en la película institucional de NUVIA. Pide una locución algo más rápida y una escena de profesionales y docentes que prescinda de sus nombres y fotografías. El punto de partida es la [edición sobre patrimonio familiar](LOCUCION_PATRIMONIO_FAMILIAR_20261122.md) y el texto aprobado de 246 palabras. Se trabaja en una copia local para visionado.

## Prueba del apartado 12 del marco

| Apartado | Aplicación |
| --- | --- |
| 1–4. Propósito educativo, entradas y resultado | Una película lineal explica la relación entre las cuatro webs mediante un ejemplo de vivienda y tiempo familiar. La revisión afecta a la interpretación y a la correspondencia entre voz e imagen. |
| 5–10. Instrumentos y circunstancias individuales | El simulador ilustra el efecto de variar un supuesto hipotecario. La pieza carece de selección de inversiones o de juicios sobre la situación del espectador. |
| 11–14. Presentación e independencia | El plano de profesionales evoca la preparación de los contenidos. La voz explica el papel del propio criterio y mantiene la separación con cualquier actividad comercial. |
| 15–16. Datos y voz | La síntesis recibe el texto institucional aprobado. La escena de profesionales utiliza objetos de trabajo y la reproducción presenta a todos el mismo contenido. |
| 17–18. Fuentes y validación | Se cotejan el texto, la voz, los nombres de las cuatro webs y la firma con el guion y la [definición del proyecto](DEFINICION_NUVIA.md). La validación técnica se realiza en el MP4 destinado a revisión. |

## Interpretación y montaje

La película dura 103,20 segundos frente a los 118 de la edición anterior. Charon lee las 246 palabras en una sola toma. Se aplica un único ajuste de velocidad a la interpretación entera y una nivelación suave del volumen para mantener una distancia de escucha estable entre secciones. El ritmo global pasa de 125 a 143 palabras por minuto. Los catorce intervalos y las entradas de las palabras se midieron en esa grabación. La música se adaptó a la nueva duración.

Los cuatro nombres se oyen a los 57,55, 61,67, 66,49 y 72,03 segundos. La nueva escena de profesionales entra a los 79,40 segundos. El lápiz traza una línea en un cuaderno con un plano y una perspectiva de vivienda. El rótulo acompaña a la palabra «profesionales» a los 81,28 segundos. La figura original de la portada recibe la frase «Todo está conectado» a los 101,13 segundos.

## Entrega y comprobaciones

- [Película local](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/NUVIA-Todo-esta-conectado.mp4), [extracto de la mesa de estudio](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/Profesionales-y-docentes.mp4) y [guion con las marcas de locución](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/Guion-con-tiempos.md).
- El [máster](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/validacion/master.json) se decodificó completo. Contiene 2.580 fotogramas Full HD a 25 fps con mezcla estéreo de −16,51 LUFS y pico de −1,66 dBTP. La correlación de la pista exportada con la mezcla supera 0,9999 en las catorce intervenciones. Huella SHA-256 del MP4 `cb5f64a56a326510f359d330428ed2442b1ad51dccc0a6a73c8a4a6b578cec22`.
- Se compararon los 143 fotogramas del tramo completo del escritorio después del fundido con el render original de Blender. La [hoja de entradas](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/validacion/entradas.jpg) recoge los cuatro nombres, la mesa y la firma final. La [medición del plano](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/validacion/control-plano-profesionales.json) recoge los tiempos y el cotejo de las imágenes.
- El [proyecto de DaVinci Resolve](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/resolve/NUVIA-Voz-continua.drp) contiene las siete escenas y catorce marcas de la voz. La mezcla estéreo es la pista de reproducción. La voz y la partitura quedan disponibles por separado. Se comprobó la integridad del archivo exportado y sus enlaces a los medios de esta edición.
- El [análisis del contraste de los rótulos codificados](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/montaje/sincronia-rotulos-codificados.json) mide la mitad de la intensidad final de cada título. En las cuatro webs, «Profesionales y docentes» y el cierre, esa entrada se encuentra de 10 a 40 milisegundos después de la marca vocal medida, dentro de un fotograma.
- La validación del Núcleo y la validación general terminaron con código 0. Las pruebas de reproductores cubrieron escritorio y tablet y la auditoría renderizó 51 rutas a 1440 px. Resultados en [validación del Núcleo](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/validacion/validate-nucleo.log) y [validación general](../output/nuvia-cuatro-webs-20261117/revision-voz-continua-20261122/validacion/validate.log).
