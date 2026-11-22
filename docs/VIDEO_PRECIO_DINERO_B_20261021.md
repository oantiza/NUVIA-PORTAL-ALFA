# El precio del dinero · versión B · guion y vídeo nuevos · 22-10-2026

## Orden del fundador y alcance

El fundador pidió, sobre el encargo de «El precio del dinero»: «haz uno nuevo. empieza de cero», «haz un video nuevo con ese guion. NO copies el existente. que sea totalmente nuevo y diferente», «utiliza los elementos disponibles. davinci resolve, blender y cavalry una tipografia de acuerdo con nuvia y subtitulos discretos» y «y elegantes y modernos».

Se crea una versión B completa —guion, dirección de arte, grafismo y montaje— independiente del vídeo de octubre documentado en `VIDEO_PRECIO_DINERO_GUION_STORYBOARD_20261021.md` y `VIDEO_PRECIO_DINERO_PRODUCCION_20261021.md`. La versión anterior se conserva intacta.

Todo vive en `output/produccion/el-precio-del-dinero-b-20261021/`, excluido del repositorio y de la web. No se ha tocado HTML, CSS, JavaScript de producto, rutas, navegación, Firebase ni publicación. No hay commit ni despliegue.

## Qué cambia respecto de la versión A

| | Versión A (21-10-2026) | Versión B (22-10-2026) |
|---|---|---|
| Estructura | 20 escenas de 24 s · 8:00 | 15 escenas de 30 s · 7:30 |
| Hilo conductor | La compra, el termostato y la escalera | El dinero mueve compras en el tiempo; el interés es el billete de ese viaje |
| Dirección de arte | Supermercado y objetos cálidos | «El andén del tiempo»: estación nocturna en miniatura, azul NUVIA y latón |
| Tipografía | Inter + Newsreader | **NUVIA Fraunces + NUVIA Inter**, las dos familias del portal |
| Ejemplo de interés | 1.000 € al 5 % → 1.050 € | 2.000 € al 6 % a 12 meses → 2.120 € |
| Desinflación | 100 → +5 % → 105 → +2 % → 107,10 € | 100 → +4 % → 104 → +2 % → **106,08 €** |
| Nominal frente a real | 1.030 vs 1.050 → ≈ −1,90 % | 10.300 vs 10.400 → ≈ **−0,96 %** |
| Conceptos nuevos | — | TAE junto al tipo nominal, IPC subyacente, euríbor |
| Locución | 1.234 palabras | 1.074 palabras |

## Trabajo realizado

- **Guion.** 15 escenas, 1.074 palabras, 114 bloques de subtítulo. `plan.py` es la fuente única: de ahí salen `plan.json`, `plan.csv`, `locucion.txt`, `subtitulos.srt` y `subtitulos-marcados.json`, que conserva las palabras a enfatizar.
- **Tipografía.** Los `woff2` autoalojados de `estilos/fuentes/` se convierten a TTF, se instancian los pesos y se instalan **solo para el usuario** (`%LOCALAPPDATA%\Microsoft\Windows\Fonts` y clave `HKCU`). Quedan disponibles «NUVIA Fraunces» (Regular, SemiBold) y «NUVIA Inter» (Regular, Medium, SemiBold). Es reversible borrando esas cinco entradas.
- **Color.** Paleta tomada de `estilos/nuvia-tokens.css`: `#06172f`, `#0b2347`, `#15365f`, `#284c75`, bronce `#b69152` y `#dcc59c`, papel `#f3eedf`.
- **Blender 5.2.2.** Mundo y utillaje nuevos (`blender_mundo.py`) y 29 planos (`blender_planos.py`): andén, raíles, farolas, reloj, banco, maleta, cesta, casas, tren, edificio institucional, cabina de señales, palanca, grúa, balanza y contrato. Encuadre automático por caja envolvente, con la acción en los dos tercios superiores. EEVEE, niebla volumétrica y profundidad de campo.
- **Cavalry.** 46 composiciones (`cavalry_gen.py` → `cavalry_build.js`) con 18 maquetas: título, concepto, titular, frase, pila, etiquetas, cifras, escalón, columnas, barras, cadena, bucle, diana, eje, línea y fórmula. El cuerpo de cada línea se ajusta midiendo el texto con `cavalry.measureText`, de modo que nada se parte ni se recorta.
- **DaVinci Resolve Studio 21.1.1.** Proyecto nuevo «El precio del dinero B», independiente del anterior. Dos líneas de tiempo de 75 planos y 11.250 fotogramas, 15 marcadores con la primera frase de cada escena, tres pistas de audio con **A1 vacía para la locución del fundador**, y 114 bloques de subtítulo nativos en la línea subtitulada.

## Prueba §12 del marco

1. Necesidad: explicar interés, inflación y poder adquisitivo a principiantes.
2. Datos: ejemplos hipotéticos elegidos editorialmente; no se recibe dato alguno del público.
3. Cálculos: interés simple a un año; dos subidas sucesivas de precios; rendimiento real exacto y aproximado.
4. Resultados: 2.000 × 1,06 = 2.120; 100 × 1,04 × 1,02 = 106,08; 10.000 × 1,03 = 10.300; 10.000 × 1,04 = 10.400; (10.300 ÷ 10.400) − 1 = −0,0096153846 ≈ −0,96 %; aproximación 3 % − 4 % = −1 %.
5. Instrumentos y emisores: ninguno invertible. BCE como institución monetaria; euríbor como índice de referencia; TAE como concepto contractual.
6. Circunstancias personales: ninguna; segunda persona genérica.
7. Operativa: no sugiere comprar, vender, mantener ni abstenerse.
8. Valoración y precios: sin valoración de activos ni pronóstico.
9. Atractivo: no puntúa ni ordena inversiones ni productos; hipoteca fija y variable se describen, no se comparan en conveniencia.
10. Terceros: no reproduce recomendaciones ajenas.
11. Diseño: color de identificación y contraste, sin semáforos de conveniencia.
12. Acción: sin contacto, contratación, captación ni ejecución.
13. Remuneración y conflicto: sin publicidad, patrocinio, afiliación ni derivación.
14. Separación profesional: no identifica ni promociona entidad ni agente.
15. Datos personales: ninguno; ninguna escritura en bases de datos.
16. IA: asistencia editorial y de producción; las cifras de `plan.py` prevalecen sobre cualquier rótulo.
17. Fuentes: el objetivo del 2 % a medio plazo se identifica como objetivo del BCE, no como dato observado; los pesos del IPC se rotulan «Proporciones ilustrativas»; los ejemplos numéricos llevan «Ejemplo hipotético».
18. Validación: comprobación automática de palabras, caracteres, tiempos y aritmética; `ffprobe` sobre los 75 planos; lectura del montaje mediante la API de Resolve.

Clasificación interna: **verde**, educación objetiva y general sin personalización decisoria ni llamada a operar. No acredita validación jurídica externa.

## Validación

- Guion: 1.074 palabras, 15 bloques, 114 subtítulos, máximo de 42 caracteres por línea, sin solapes entre bloques.
- Blender: 29 MP4 comprobados con `ffprobe`; los 29 a 1920 × 1080, 25 fps y 150 fotogramas exactos.
- Cavalry: 46 MP4 comprobados igual; los 46 a 1920 × 1080, 25 fps y 150 fotogramas. Construcción sin errores.
- Resolve: las dos líneas tienen 75 clips en V1, sin huecos, de 90000 a 101250 (11.250 fotogramas = 7:30). La subtitulada tiene 114 bloques entre los fotogramas 90013 y 101232, dentro de la imagen. A1 vacía en ambas. 15 marcadores.
- Exportación de revisión: `renders/revision-b-subtitulada.mp4`, 1920 × 1080, 25 fps, 11.250 fotogramas, 85 MB.
- Aritmética contrastada: 2.120 €, 106,08 €, 10.300 €, 10.400 € y −0,96 %.

## Límites y lo que queda pendiente

- **La locución no está grabada.** A1 queda vacía a propósito. Los tiempos del SRT y de los bloques de subtítulo son provisionales y habrá que ajustarlos a la toma real.
- **Estilo de subtítulos, aplicado a mano en el inspector** (22-10-2026). La API de Resolve no expone el estilo de la pista, así que se fijó desde el inspector de la pista ST1 de «Pelicula B - subtitulada»: **NUVIA Inter Regular, cuerpo 48, trazo 0, sombra activada (desenfoque 20, opacidad 75), posición Y 216**. Queda sin caja y sin contorno duro. El color sigue en blanco: el campo hexadecimal del selector no aceptaba la entrada automática y se dejó el valor por defecto en lugar de forzarlo; cambiarlo a `#f3eedf` es un paso manual de diez segundos. Comprobado en cuatro fotogramas del visor sobre gráficos y sobre planos 3D: `control/subtitulos-estilo-nuvia.png`.
- **El énfasis palabra a palabra tampoco es programable.** Las palabras marcadas están en `subtitulos-marcados.json` para aplicarlas en un pase manual.
- **No hay música ni efectos.** No se pidieron para esta versión; A2 y A3 están creadas y vacías.
- **Máster con subtítulos quemados** (22-10-2026): `renders/master-b-subtitulos-quemados.mp4`, 97 MB, 1920 × 1080, 25 fps, 11.250 fotogramas, 450,000 s exactos. Se renderizó con `SubtitleFormat: "BurnIn"`; `ffprobe` confirma que **no hay pista de subtítulos** en el archivo, es decir, van grabados en la imagen. Comprobado en catorce fotogramas repartidos por la película. La exportación anterior, `renders/revision-b-subtitulada.mp4`, es previa al estilo y lleva los subtítulos como pista incrustada; se conserva solo como referencia.
## Corrección de la banda de subtítulos · 22-10-2026

La primera versión del máster tenía el subtítulo cruzando el sujeto en cerca de un tercio de los planos 3D (`control/contacto-colision.png`). La posición del subtítulo era correcta —216 px sobre el borde inferior, dentro de la banda reservada—; lo que no respetaba la banda era el encuadre de Blender. Por orden del fundador se corrigió en el origen y se volvió a renderizar.

- `blender_mundo.py` incorpora un resolutor de banda. Para cada plano proyecta la caja envolvente del sujeto en el encuadre con `world_to_camera_view`, muestreando cinco fotogramas a lo largo de la toma —de modo que también cubre cámaras y sujetos en movimiento—, y calcula la altura de su punto más bajo en coordenadas normalizadas. Si queda por debajo del 30 % inferior, resuelve el desplazamiento de cámara necesario para subirlo justo a esa línea. La pendiente se mide con una sonda en lugar de asumir el signo de `shift_y`.
- Se impone además un margen mínimo de encuadre: reservado el 30 % de la altura, el sujeto debe caber en el 67 % restante, lo que fija `margen >= 1 / (TECHO − SUELO)`.
- **24 de los 29 planos necesitaron corrección y los 24 quedan despejados.** Los cinco restantes son planos generales de la estación, cuyo sujeto es el andén entero: se excluyen a propósito porque no hay nada que tapar en la franja baja y forzarlos destruiría la composición.
- Incidencia durante el ajuste: la primera versión del resolutor dejó `e03b4` completamente negro. Medía el sujeto final del travelling también en los fotogramas en que aún estaba fuera de cuadro (−0,696) y se iba al tope del desplazamiento. Se corrigió midiendo solo desde la mitad del plano y acotando el desplazamiento a `[−0,22, 0,30]`.
- Evidencia: `control/contacto-banda.png` y `control/banda-viajes.png`, con la línea del 30 % dibujada sobre los fotogramas.

### Reexportación y comprobación

Se renderizaron de nuevo los 29 planos (`ffprobe`: los 29 a 1920 × 1080, 25 fps y 150 fotogramas) y se reexportó el máster.

El primer intento de reexportación **falló**: Resolve conservaba en caché los MP4 anteriores, que se habían sustituido en disco con los mismos nombres, y escribió un archivo de 38 fotogramas y 290 KB con el trabajo marcado como *Failed*. Se detectó al verificar con `ffprobe`, no por el aspecto del archivo. Se resolvió guardando, cerrando y reabriendo el proyecto, tras lo cual Resolve volvió a leer los clips nuevos (`e02b4`: 150 fotogramas desde la ruta correcta).

Máster definitivo: `renders/master-b-subtitulos-quemados.mp4`, **106 MB, 1920 × 1080, 25 fps, 11.250 fotogramas contados, 450,000 s exactos y sin pista de subtítulos**, es decir, grabados en la imagen. Comprobado en los ocho fotogramas en que antes se veía el choque —los mismos códigos de tiempo, para que la comparación sea directa—: en los ocho el sujeto queda por encima del subtítulo. Comparación en `control/contacto-colision.png` (antes) y `control/contacto-colision-corregido.png` (después).

**Lección de proceso:** sustituir medios en disco bajo un proyecto abierto de Resolve exige recargar el proyecto antes de renderizar, y toda exportación debe verificarse con `ffprobe` por número de fotogramas, no por que el archivo exista.
- Durante el primer intento de montaje, Resolve se cerró de manera inesperada al importar los 75 clips de una vez y al colocar los subtítulos con un tipo de medio inválido. Se rehízo por lotes y colocando los subtítulos antes que la imagen. No se envió el informe de error de Blackmagic.
- Tras ese cierre, el puente de scripting de Resolve dejó de levantar; el estilo y las comprobaciones finales se hicieron por interfaz. Reiniciar Resolve debería devolver el acceso por API.
- No se ejecutan `npm run validate` ni `npm run auditar`: este trabajo no toca ficheros del sitio. `output/` está excluido por `.gitignore`.
