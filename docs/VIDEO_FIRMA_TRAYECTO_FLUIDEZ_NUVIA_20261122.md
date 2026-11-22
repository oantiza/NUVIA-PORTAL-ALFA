# NUVIA · Firma frontal, trayecto y cierre

## Encargo del fundador

El fundador solicita una entrada directa, más estática y con mayor presencia para el logotipo, una revisión de los tirones al transformarse los aros y una alternativa al plano de la familia que mira la ciudad en el segundo 44.

Durante la revisión pide además sustituir dos capturas de página por imágenes originales que sigan siendo válidas si cambia la web. Las referencias corresponden al resultado hipotecario y al curso mostrado en Academia.

La referencia es la copia MP4 facilitada por el fundador. Su huella SHA-256 coincide con la entrega de [Aros y escultura](VIDEO_AROS_Y_ESCULTURA_NUVIA_20261122.md). La revisión es local.

## Decisiones de montaje

La firma NUVIA Family Wealth se presenta frontalmente. El desprendimiento de las hojas conserva su vínculo con la apertura del capullo y la aparición de los cuatro espacios. La composición del cierre toma como referencia la figura original de la portada.

La narración relaciona la elección de una vivienda con el desplazamiento al trabajo y el tiempo familiar. El plano del mirador se mostraba entre 42,68 y 50,16 segundos. Su imagen seguía presente durante el fundido hasta 50,48. La nueva secuencia hace visible ese razonamiento y enlaza con la frase sobre las dos preguntas que intervienen en una sola decisión.

La maqueta de vivienda emplea una casa de tejado azul, un medidor de latón y una pila de discos para relacionar los tipos de interés con la cuota mensual. La misma casa reaparece como punto de partida de un pequeño autobús hacia el trabajo. El regreso al hogar se representa con unas llaves y el dibujo de un niño sobre una mesa preparada. Las escenas tienen modelos propios y se han recreado sus fundidos.

Para Academia se ha encuadernado en Blender un libro de lino azul, papel crema y dos cintas de lectura. El paso de una hoja descubre el título «Cuaderno de estudio» y una lámina de cuatro conexiones. Las dos páginas iniciales y las dos que quedan al terminar tienen dibujos y composición propios. El encuadre acompaña el vuelo de la hoja y deja al menos un 8 % de margen vertical en las poses comprobadas. El plano ocupa la frase sobre profundizar en cada materia al ritmo de cada persona.

## Prueba del apartado 12

| Preguntas del marco | Aplicación |
| --- | --- |
| 1–4. Finalidad y resultado | Película institucional lineal destinada a explicar el propósito del proyecto. |
| 5–10. Datos y decisiones | La vivienda y el desplazamiento ilustran una situación hipotética. La secuencia evita atribuir distancias, tiempos o importes reales a una familia. |
| 11–14. Independencia y diseño | La película presenta las cuatro webs con los mismos textos, voz y alcance editorial de la versión de referencia. |
| 15–18. Personas, fuentes y revisión | La maqueta es una creación de producción. El arte de la marca y los aros procede de la portada. Se comprueban la duración, la sincronía de la voz, el movimiento y la reproducción del archivo local. |

## Entrega y comprobaciones

- [Película completa](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/NUVIA-Todo-esta-conectado-50p.mp4), [selección de los planos revisados](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/Seleccion-de-planos-NUVIA.mp4), [imagen original de vivienda](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/Vivienda-y-cuota.jpg) e [imagen original de Academia](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/Academia-NUVIA.jpg). El máster dura 103,20 segundos y la selección 52,96. La edición se entrega para revisión local.
- El logotipo ocupa el 90 % del ancho desde la primera imagen. Se comprobó que sus extremos permanecen en la misma coordenada horizontal al inicio. El capullo tiene 290 exposiciones consecutivas distintas durante su apertura. [Control de la firma](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/apertura/control-apertura.json)
- La maqueta de vivienda sustituye el resultado del simulador desde 37,12 s. El plano del trayecto empieza a 42,68 s. El libro entra a 75,36 s y acompaña la frase sobre formación. Se recompusieron los fundidos con los planos vecinos para eliminar los restos de las capturas. [Validación de vivienda y trayecto](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/trayecto/comprobacion-de-trayecto.json) · [Validación de Academia](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/academia/validacion-academia.json)
- El movimiento de los aros alcanza el reposo a 100,98 s y la palabra «Todo» se oye a 101,125 s. En el cierre codificado se verificaron 535 pares consecutivos sin repetir la escultura durante la aproximación. La figura final limpia coincide con el arte original antes de compresión. [Medición de los aros](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/cierre/validacion-cierre.json)
- El máster contiene 5.160 fotogramas Full HD a intervalos uniformes de 20 ms. La voz y la música coinciden con el archivo adjuntado por el fundador tanto en el audio comprimido como tras decodificarlo. Edge reprodujo los tres tramos de prueba, incluido el cierre de 90,10 a 102,30 s, sin pausas de carga ni cuadros descartados. [Control de entrega](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/validacion/entrega.json) · [Prueba de reproducción](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/validacion/reproduccion-final.json) · [Comparación de imágenes](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/validacion/movimiento-y-firma.json)
- El [proyecto de DaVinci Resolve](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/resolve/NUVIA-Firma-trayecto-y-cuaderno.drp) guarda el montaje en siete escenas, las catorce marcas de la voz y las pistas de mezcla, narración y música. Se comprobó la integridad del archivo exportado, y se hizo una lectura completa de audio y vídeo del máster. Las validaciones del Núcleo y del portal terminaron con código 0, incluida la auditoría de 51 rutas. [Validación del Núcleo](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/validacion/nucleo.log) · [Validación general](../output/nuvia-cuatro-webs-20261117/revision-firma-trayecto-fluidez-20261122/validacion/portal.log)
