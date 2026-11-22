# NUVIA · Todo está conectado · Edición de coherencia

**Estado:** descartada. El fundador aclaró después que la película a revisar era «Mar»; la edición vigente es la [edición coherente sobre «Mar»](VIDEO_MAR_COHERENTE_NUVIA_20261122.md). Sin commit y sin publicación.

## Encargo del fundador

El fundador entregó la película «Aros entrelazados» (103,20 s) y pidió examinarla y proponer cambios. La revisión señaló cinco puntos y, a la pregunta de por dónde empezar, respondió «todo»:

1. Los aros cambiaban cuatro veces de forma y de material.
2. Las capturas de la web eran planos fijos, con texto ilegible, y mostraban un diseño que va a cambiar.
3. El arranque (logotipo 3D con relieve y hojas de un verde vivo) no parecía de la marca, y la primera frase no tenía apoyo en pantalla.
4. El final se cortaba un segundo después de la voz.
5. Detalles: fondo gris al principio y cálido después, rótulos pegados al borde, trato desigual de las cuatro webs y subtítulos pequeños.

La referencia es la [edición de aros y escultura](VIDEO_AROS_Y_ESCULTURA_NUVIA_20261122.md). Se conservan el guion, la locución de Charon, sus marcas y la partitura.

## Qué cambia

| Punto | Antes | Ahora |
|---|---|---|
| Aros | Cintas gruesas de acabado metálico en el estudio, aros finos satinados al empezar el cierre y vidrio esmerilado solo en la figura final | Una sola familia en toda la película: vidrio esmerilado macizo en zafiro, nácar y salvia, y champán cepillado, con banda ancha y torsión como en la escultura de portada |
| Capturas de la web | Cuatro planos con capturas enmarcadas | Ninguna. El paseo por el olivar ocupa su plano con el rótulo «Tiempo para los tuyos.»; la hipoteca se explica con dos cifras del propio simulador (1.327,79 € → 1.636,85 € al mes si los tipos suben 2 puntos, préstamo de 280.000 € a 25 años, rotulado como ejemplo); Bienestar y Academia mantienen su aro mientras habla la voz |
| Arranque | Logotipo 3D con relieve, hojas verde vivo, sin texto | Logotipo plano oficial; sus hojas cobran vida y vuelan en el verde de la marca; rótulos «Sin ruido.» y «Sin venta de productos.» sobre la primera frase |
| Cierre | 1,0 s tras la última palabra | 4,0 s: la figura y el lema se mantienen tres segundos más y la música sube y se funde |
| Fondo | Gris frío en la apertura | Blanco cálido en toda la película |
| Subtítulos de las webs | 32 px | 40 px |
| Trato de las cuatro webs | Bienestar y Academia con captura | Las cuatro con el mismo patrón: aro, nombre y subtítulo |

Duración: 106,20 s (2.655 fotogramas a 25 fps). Las entradas de los rótulos conservan las marcas de la voz de la edición anterior.

## Prueba del apartado 12 del marco

| Preguntas | Aplicación |
|---|---|
| 1–4. Finalidad y resultado | Película institucional lineal. Explica qué es NUVIA y cómo se relacionan sus cuatro webs. Mismo contenido para cada espectador. |
| 5–10. Instrumentos, circunstancias, precios y valoraciones | La hipoteca ilustra una pregunta condicional con las cifras del ejemplo del simulador de vivienda, rotuladas como ejemplo ilustrativo. No hay productos, emisores, circunstancias personales ni llamadas a operar. |
| 11–14. Diseño e independencia | Los cuatro materiales identifican las webs; no ordenan ni valoran. «Sin venta de productos» resume la separación comercial que ya enuncia la locución. |
| 15–16. Datos y voz | No se recogen datos. La voz y el texto son los aprobados. |
| 17–18. Fuentes y controles | Cifras tomadas de la captura del simulador usada en la edición anterior. Validación descrita abajo. |

Clasificación interna verde por su finalidad informativa.

## Producción

Carpeta: `output/nuvia-cuatro-webs-20261117/revision-coherencia-20261122/` (fuera de la publicación).

- `aros/estudio_aros.py` genera el estudio (`Estudio-de-cintas.blend`): nuevo perfil de banda, vidrio con absorción por espesor y mundo con fondo de papel para los rayos transmitidos. 796 fotogramas en Cycles con OptiX; los planos de Bienestar y Academia duran ahora 139 y 189 fotogramas.
- `apertura/rodar.py` vuelve a rodar el paso de las hojas a los aros (124 fotogramas) con los materiales nuevos.
- `escultura/filmar.py` y `registrar.py` repiten el cierre (338 fotogramas) con los mismos vidrios al empezar; el registro final con la portada se mantiene (diferencia media final 0,0 tras el registro).
- `montaje/conformar.py` compone las siete escenas sobre la edición anterior y sustituye los planos indicados.
- `audio/grabar_mezcla.py` reinterpreta la partitura con tres segundos más y eleva la música tras la última palabra.
- `exportar.py` une escenas y mezcla y comprueba el máster.

El proyecto de DaVinci Resolve de la edición anterior no se ha actualizado: esta edición se monta con los guiones de la carpeta.

## Validación

Máster: `NUVIA-Todo-esta-conectado-Edicion-coherente.mp4` (55.351.576 bytes, sha256 `ff30a2ea…84fef0aa`). Datos en `validacion/master.json`; hoja de fotogramas (uno cada dos segundos) en `validacion/hoja-final.jpg`.

| Comprobación | Resultado |
|---|---|
| Contenedor | H.264 1920×1080 a 25 fps + AAC; decodificación completa sin errores |
| Duración | 106,20 s · 2.655 fotogramas · cortes de escena en 0, 344, 860, 1354, 1657, 1985, 2136 |
| Sonoridad | −16,4 LUFS integrados · pico −1,6 dBFS |
| Cola de música | −27/−29 dB entre 103 y 104 s; fundido hasta −77 dB en 105,7 s |
| Registro del cierre con la portada | Diferencia media 0,0 tras el registro (`escultura/control-registro.json`) |
| Tramos sin movimiento | 0–3,6 s (logotipo plano), 38,1–40,0 s y 40,3–42,7 s (tarjeta de cifras), 101,3 s–final (lema y figura). Todos son pausas previstas |
| Revisión visual | Hoja de 53 fotogramas revisada: sin capturas de la web, fondo cálido continuo, mismos materiales en estudio, apertura y cierre |

Límites de la validación:

- La mezcla se ha medido (sonoridad, pico y niveles por tramo) pero no se ha escuchado; falta la escucha del fundador.
- En la apertura los aros se ven más pálidos que en los primeros planos, por su tamaño y espesor en ese encuadre.
- El proyecto de DaVinci Resolve no refleja esta edición.
