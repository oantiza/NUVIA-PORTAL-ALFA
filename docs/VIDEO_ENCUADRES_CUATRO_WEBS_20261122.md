# Revisión de encuadres de «Todo está conectado»

## Encargo del fundador

> Revisa el último vídeo porque los cuadros que has recortado de la web aparecen completamente descentrados, perdón, descuadrados y no quedan nada bien. Revísalos.

Revisar el encuadre de las pantallas que aparecen al recorrer las cuatro webs y sus espacios comunes. Como referencia de montaje se toma la [película del 17 de noviembre](VIDEO_CUATRO_WEBS_CONECTADAS_20261117.md). La revisión conserva su guion hablado, la mezcla, los siete bloques y la duración de 1 minuto y 57 segundos.

El trabajo se entrega en `output/nuvia-cuatro-webs-20261117/revision-encuadres-20261122/`. Los cinco bloques interiores ocupan el intervalo de 0:14 a 1:47. La apertura y el cierre utilizan los clips de la primera versión.

## Diagnóstico del vídeo original

Se extrajeron del MP4 nueve pantallas de Economía, Patrimonio, Familia, Academia y Lecturas. El encuadre anterior imponía 16:9 a componentes de alturas diferentes y ampliaba la imagen durante el plano. El margen inferior llegaba a quedar en 14–15 píxeles. En Respiración se interrumpían una fila y su miniatura. En Interés compuesto quedaba fuera casi todo el gráfico. En otras vistas se colaban fragmentos del bloque contiguo o el texto empezaba demasiado cerca del borde. Las capturas, las marcas de fotograma y el diagnóstico individual se conservan en `qa-inicial/`.

## Prueba del apartado 12 del marco regulatorio

| Preguntas | Resultado para esta revisión |
|---|---|
| 1–4. Necesidad, entradas, transformación y resultado | Se busca que el espectador pueda reconocer el contenido que explica la voz. Las entradas son las pantallas de NUVIA y los elementos gráficos de la película. La transformación es un ajuste visual dentro de un vídeo lineal. |
| 5–10. Instrumentos, circunstancias personales, operaciones, precios, selección y recomendaciones | Los ejemplos de cartera, vivienda, jubilación e interés compuesto remiten a sus herramientas educativas. Los datos mostrados corresponden a las pantallas de ejemplo. La película no recibe datos del espectador ni le indica una operación. |
| 11–14. Efecto del diseño, contacto, remuneración e independencia | Los cambios de escala y encuadre deben permitir reconocer a qué pantalla pertenece cada dato. El guion presenta el portal como recurso educativo. Se conserva la separación entre divulgación y actividad comercial. |
| 15–16. Datos e IA | La narración de Charon utiliza la grabación del guion cerrado. La película se reproduce como medio estático y no recoge información del público. |
| 17–18. Fuentes, límites y controles | Sirven de referencia la [definición de NUVIA](DEFINICION_NUVIA.md), las páginas representadas y el guion fechado el 17 de noviembre. Se cotejan los cortes con el guion y las pistas con el montaje, y se documentan por separado la revisión de imagen y los controles del portal. |

Clasificación interna verde para esta revisión audiovisual.

## Resultado comprobado

Se sustituyeron las nueve capturas por vistas de componentes completos. El título de cada plano conserva su lugar y, debajo, la captura mantiene sus proporciones naturales. La familia aparece entera bajo su texto, el simulador de jubilación muestra una sola explicación con sus cinco conceptos y el gráfico de interés compuesto incluye los ejes y la leyenda. La hoja `montaje/pruebas/contacto-9-encuadres.jpg` reúne los nueve encuadres.

El máster `montaje/NUVIA-Todo-esta-conectado-Encuadres-revisados.mp4` se decodificó íntegro. Contiene 2.925 fotogramas en 1920 × 1080 a 25 fps y dura 117 segundos. Las capturas ocupan 1.315 fotogramas. Los otros 1.610 coinciden píxel a píxel con el vídeo del 17 de noviembre. Los 5.486 paquetes AAC y sus marcas de tiempo también son idénticos. La revisión del primer fotograma, el central y el último de cada captura consta en `montaje/validacion-final.json`. El máster tiene 36.729.335 bytes y su SHA-256 es `96cce05b0b455ffcdc30479647d3b44594ab9b588699d4f22a7c0cd59e24674f`.

DaVinci Resolve Studio 21.2 conserva la edición en un proyecto independiente, «NUVIA - Cuatro webs - Encuadres 20261122». Los siete clips revisados están enlazados desde `montaje/`. Los cortes comienzan en los fotogramas 0, 350, 875, 1375, 1825, 2325 y 2675. Las tres pistas estéreo enlazan la mezcla, la locución y la partitura originales de `../audio/`, con la mezcla como pista activa. Se comprobaron la duración de los clips, las rutas de las pistas y la integridad del archivo `resolve/NUVIA-Todo-esta-conectado-Encuadres-revisados.drp`. La evidencia del proyecto está en `validacion/resolve.json`.

## Controles del portal

`npm run validate:nucleo` y `npm run validate` finalizaron con código 0. Los reproductores pasaron sus pruebas a 1440, 1024 y 768 px. La auditoría de render recorrió 51 rutas a 1440 px. Los registros completos se encuentran en `validacion/validate-nucleo.log` y `validacion/validate.log`.
