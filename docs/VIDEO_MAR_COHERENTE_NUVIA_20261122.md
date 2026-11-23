# NUVIA · Todo está conectado · Edición coherente sobre «Mar»

**Estado:** aprobada por el fundador el 22-11-2026 («sí») y colocada en «Qué es NUVIA»; publicado el 22-11-2026 (commit `5a331b3`, despliegue n.º 186).

## Encargo del fundador

El fundador aclaró que la película que quería revisar es la edición [«Mar»](VIDEO_HOJAS_MAR_Y_MUSICA_NUVIA_20261122.md) (93,44 s, 50 fps), y no «Aros entrelazados», que había enviado por error. La [edición de coherencia](VIDEO_EDICION_COHERENCIA_NUVIA_20261122.md) hecha sobre aquel montaje más antiguo queda descartada: perdía las maquetas, el plano del mar, la música «Corriente de fondo», los 50 fps y las hojas estabilizadas.

Tras examinar «Mar» se propusieron cinco cambios y se preguntó por la apertura. Respuesta del fundador: **«logotipo plano»**.

## Qué cambia respecto a «Mar»

| Punto | En «Mar» | En esta edición |
|---|---|---|
| Aros del estudio | Aros gruesos de esmalte brillante («Informamos…», «Cuatro webs», las cuatro webs) | Rodados de nuevo con el vidrio esmerilado (zafiro, nácar, salvia) y el champán cepillado del cierre, en la misma coreografía y con el mismo reloj |
| Aros de la apertura | Láminas y aros finos sobre gris | Misma toma, sobre el papel cálido y con más cuerpo de vidrio (corrección de imagen, no rodaje nuevo) |
| Apertura | Logotipo 3D con relieve sobre gris | Logotipo plano oficial; sus hojas cobran vida (las hojas 3D de «Mar») y vuelan como antes |
| Primera frase | Sin rótulo | «Sin ruido.» y «Sin venta de productos.» |
| Fondo de los primeros 12 s | Gris | Papel cálido, igual que el resto |
| Rótulos que se cruzaban | «Informamos…» con «Tú comprendes…»; «Dos preguntas…» con «Cuatro webs…»; «Cuatro webs…» con «Economía y finanzas»; «De generación…» con «El patrimonio…» | El rótulo que sale termina antes de que entre el siguiente |
| Subtítulos de las webs | 32 px | 40 px |
| Final | 0,97 s tras la última palabra | 3 s más de figura y lema; el último acorde se deja resonar y se apaga |

Duración: 96,44 s (4.822 fotogramas a 50 fps).

No se tocan las maquetas, el olivar, el plano del mar ni su título, el cuaderno, la locución de Charon, su reloj, la partitura ni la unión de los aros.

Queda como en «Mar» el cruce de «Tú comprendes y decides.» con «Elegir una vivienda.» en el fundido hacia el plano de las cajas: los dos rótulos están ya mezclados en esos fotogramas y no se separan con limpieza.

## Prueba del apartado 12 del marco

| Preguntas | Aplicación |
|---|---|
| 1–4. Finalidad y resultado | Película institucional lineal. Mismo contenido para cada espectador. |
| 5–10. Instrumentos, circunstancias, precios y valoraciones | Sin cambios respecto a «Mar». No hay productos, emisores, circunstancias personales ni llamadas a operar. |
| 11–14. Diseño e independencia | Los cuatro materiales identifican las webs; no ordenan ni valoran. «Sin venta de productos» resume la separación comercial que ya enuncia la locución. |
| 15–16. Datos y voz | No se recogen datos. La voz y el texto son los aprobados. |
| 17–18. Fuentes y controles | Máster «Mar», logotipo oficial y estudio de aros de Blender. Validación descrita abajo. |

Clasificación interna verde por su finalidad informativa.

## Producción

Carpeta: `output/nuvia-cuatro-webs-20261117/revision-mar-coherente-20261122/` (fuera de la publicación).

- `montaje/reloj.py` reproduce el reloj de «Mar» (`revision-pulso-20261122/voz/reloj.json`): para cada fotograma de 50 fps da el instante de la edición de 103,20 s de la que proceden los planos de estudio.
- `aros/estudio_mar.py` rueda en Cycles (OptiX) los 1.120 fotogramas de estudio de «Mar», cada uno en su instante exacto (fotograma fraccionario), más los tres fotogramas que quedan fijos en los fundidos de salida. Geometría y materiales son los del cierre.
- `montaje/montar.py` recorre el máster «Mar» y solo trata los fotogramas afectados: apertura, planos de estudio y sus fundidos, y el paso al cierre. El resto pasa sin conversión de color.
- `audio/prolongar.py` deja intacta la mezcla de «Mar» y añade la cola: resonancia sintética de la propia música final.
- `exportar.py` une los tramos, mezcla y comprueba el máster.

El proyecto de DaVinci Resolve de «Mar» no refleja esta edición.

## Validación

Máster: `NUVIA-Todo-esta-conectado-Mar-coherente.mp4` (107.077.948 bytes, sha256 `96fe341b…68cf83ed`). Datos en `validacion/master.json`; hoja de fotogramas (uno cada dos segundos) en `validacion/hoja-final.jpg`.

| Comprobación | Resultado |
|---|---|
| Contenedor | H.264 1920×1080 a 50 fps + AAC; decodificación completa sin errores |
| Duración | 96,44 s · 4.822 fotogramas (4.672 de «Mar» + 150 de prolongación) |
| Fotogramas tratados | 1.810; los demás son los de «Mar» recodificados sin conversión de color |
| Comparación con «Mar» | Fotograma a fotograma (480×270): solo difieren la apertura (0–632), los planos de estudio y sus fundidos (1256–1559, 2441–3113, 3233–3408) y el paso al cierre (4047–4058) |
| Continuidad | Sin saltos entre fotogramas distintos de los cortes de «Mar»; la cadencia par/impar del estudio es uniforme (rodaje real a 50 fps, sin fotogramas duplicados) |
| Sonoridad | −16,2 LUFS integrados · pico −1,4 dBFS, iguales a los de «Mar» |
| Cola de música | −28/−30 dB entre 92,5 y 93,5 s; −37 dB en 94 s; silencio en 96,4 s (`audio/control-cola.json`) |
| Revisión visual | Hoja de 49 fotogramas y fotogramas sueltos de cada fundido revisados |

Límites de la validación:

- El sonido se midió sin escucharlo; la cola es una resonancia sintética. El 23-11-2026 el fundador recibió los últimos 12 s y, preguntado por cómo sonaba la cola, respondió «Bien». Queda cerrado.
- Los aros de la apertura no se han rodado de nuevo: son los de «Mar» con corrección de imagen, más finos que los del estudio.
- El cruce de «Tú comprendes y decides.» con «Elegir una vivienda.» sigue como en «Mar».
- El título del plano del mar conserva su forma (sin punto final), por ser el elegido por el fundador.
- El proyecto de DaVinci Resolve no refleja esta edición.

## Colocación en «Qué es NUVIA» (22-11-2026, 19:30)

A la pregunta de si la daba por buena y se colocaba en «Qué es NUVIA», el fundador respondió «sí».

- `src/assets/video/todo-esta-conectado-20261122.mp4`: copia para web (H.264 1080p a 50 fps, AAC, 18,9 MB; el máster de 107 MB supera el límite de GitHub).
- `…-20261122.webp`: imagen de portada, el fotograma final con el lema.
- `…-20261122.vtt`: 30 subtítulos con el texto y los tiempos de las catorce intervenciones (`revision-pulso-20261122/voz/marcas.json`).
- `que-es-nuvia.html`: el reproductor, el enlace «Abrir el vídeo» y la transcripción (catorce párrafos) pasan a la película nueva. Los tres ficheros del vídeo anterior (`que-es-nuvia-20261112.*`) quedaron en la carpeta sin enlazar; se borraron el 23-11-2026 por decisión del fundador (`docs/LIMPIEZA_Y_PUBLICACION_20261123.md`).
- `output/…/revision-mar-coherente-20261122/publicar_web.py` genera los tres ficheros.

Comprobado en Chrome: el reproductor carga la película (96,44 s, 1920 × 1080), la portada y los 30 subtítulos.
