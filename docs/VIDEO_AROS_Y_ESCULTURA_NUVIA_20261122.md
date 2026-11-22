# NUVIA · Aros y escultura de portada

## Encargo del fundador

> ¿Puedes cambiar o mejorar el renderizado de Comblender de los anillos, darle más calidad para que al final parezca más fluida la transición de los propios anillos hacia el elemento final? De todo está conectado. Quiero anillos de más calidad

La revisión parte de la [película de voz continua](VIDEO_VOZ_CONTINUA_NUVIA_20261122.md). El trabajo se centra en la imagen de los aros, su acabado en los cuatro espacios y el movimiento que lleva a la escultura oficial de la portada. El destino es una copia local para visionado.

## Prueba del apartado 12 del marco

| Preguntas | Aplicación a la revisión |
| --- | --- |
| 1–4. Finalidad, entradas y resultado | Los cuatro aros identifican las webs. Su unión da forma visible a la relación que explica la locución. La entrada de producción es la escultura de la portada y se entrega un vídeo lineal. |
| 5–10. Instrumentos, circunstancias y decisiones | El cambio es una animación institucional. La descripción de las webs, los ejemplos educativos y su audio proceden de la edición anterior. |
| 11–14. Diseño e independencia | Los materiales diferencian los cuatro espacios sin ordenarlos por preferencia ni representar una valoración de inversiones. |
| 15–16. Datos y herramientas | La geometría, los materiales y la iluminación de estudio pertenecen a la escultura. La reproducción presenta la misma pieza a cada espectador. |
| 17–18. Fuentes y controles | La referencia gráfica es [Conexiones](../src/assets/ecosistema/PROCEDENCIA_PORTADA.md). Se comprueban la continuidad de movimiento, el ajuste a la figura original y la correspondencia con las marcas de la voz. |

## Imagen y movimiento

Las cuatro cintas tienen un perfil asimétrico con cantos redondeados. El acabado distingue zafiro, champán, verde salvia y nácar. Las luces de estudio recorren la superficie al girar. Los 620 fotogramas de los seis planos de presentación se renderizaron en Blender a resolución de entrega. La transición del capullo a los cuatro aros utiliza esa misma familia de formas y materiales.

En el cierre, desde el segundo 89,68, la cámara mantiene el encuadre a medida que las cuatro piezas se acercan, inclinan y entrelazan. Los perfiles exteriores, los huecos y los cruces se trazaron sobre el arte original de la portada. Los reflejos llegan a su posición definitiva cuando se asienta cada cinta. El rótulo entra de forma independiente sobre la figura.

El último fotograma limpio coincide píxel a píxel con la composición original antes de comprimir el vídeo. Véanse el [registro del cierre](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/escultura/control-registro.json), la [comparación de materiales](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/aros/comparacion-de-materiales.jpg) y la [progresión de la escultura](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/escultura/progresion-final.jpg).

## Entrega y validación

- [Película completa](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/NUVIA-Aros-entrelazados.mp4), [extracto con voz](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/Cierre-Todo-esta-conectado.mp4) y [cierre anterior y nuevo en paralelo](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/comparacion-cierre.mp4). La película dura 103,20 segundos y el extracto 17,76. La revisión se entrega localmente.
- El [proyecto de DaVinci Resolve](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/resolve/NUVIA-Aros-entrelazados.drp) se ha guardado y comprobado con sus siete escenas. En Blender quedan las fuentes editables de [la apertura](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/apertura/Hojas-a-cintas.blend), [los primeros planos](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/aros/Estudio-de-cintas.blend) y [el cierre](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/escultura/Cuatro-cintas-entrelazadas.blend).
- Se ha decodificado entera la película Full HD y se ha comprobado la cadencia de sus 2.580 fotogramas. Los ocho primeros segundos y el plano de profesionales y docentes se han cotejado con la edición de voz continua. La mezcla de voz y música del máster coincide con la anterior tanto comprimida como decodificada. [Control del máster](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/master-y-continuidad.json)
- Al empezar la firma, la coincidencia de la silueta con la portada pasa del 36,60 % al 98,13 %. La comparación emplea la misma zona y el mismo umbral de fondo en las dos ediciones. Las entradas de los rótulos de las cuatro webs, del plano de profesionales y del lema final se mantienen a un máximo de un fotograma de su palabra en la voz. [Comparación de continuidad](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/continuidad-y-portada.json) · [Medición de rótulos](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/sincronia-en-el-codificado.json)
- La validación del Núcleo y la general finalizaron con código 0. La comprobación de los reproductores cubrió 1440, 1024 y 768 px. La auditoría de render completó las 51 rutas a 1440 px. [Validación del Núcleo](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/validate-nucleo.log) · [Validación general](../output/nuvia-cuatro-webs-20261117/revision-aros-cierre-20261122/validacion/validate.log)
