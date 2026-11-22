# Plantilla de vídeo · NUVIA Academy · 22-10-2026

Sistema único para los vídeos del canal. Nace de descomponer «El PIB, de principio a fin», que es la generación más evolucionada del canal, y de medir el cierre de marca que el fundador tiene ya producido.

Objetivo: que hacer un vídeo nuevo sea **escribir el guion, elegir componentes y elegir objetos**, no rediseñar. Lo que no está aquí no se improvisa en cada pieza.

## Orden del fundador

«quiero calidad en el video sobre todo, es decir un fondo adecuado, elementos de calidad grafica y visual», «quiero crear una plantilla que sirva para futuros videos», «el corte final o el cierre lo tengo yo». Y sobre el orden de trabajo: «Empieza por la plantilla; el vídeo lo rehacemos con ella».

## 1 · Lienzo y formato

| | |
|---|---|
| Resolución de trabajo | 3840 × 2160 |
| Entrega | 1920 × 1080 y 3840 × 2160 |
| Fotogramas por segundo | 25 |
| Relación de aspecto | 16:9, sin letterbox en el cuerpo |
| Márgenes laterales | 8 % (307 px en 4K) |
| Banda de subtítulos | 22 % inferior libre de contenido |
| Banda de cabecera | 10 % superior reservada al cromo fijo |

El cierre de marca que ya existe va a 24 fps y lleva letterbox 2:1 propio. **No se replica ese letterbox en el cuerpo del vídeo**: se conserva tal cual solo en el cierre, como firma. La conversión de 24 a 25 fps se hace al montar.

## 2 · Fondo

El fondo **no es un color plano**. Es la plancha de papel hecho a mano de la propia marca, extraída del cierre del fundador (fotograma 2, sin logotipo, recortado el letterbox y escalado a cubrir sin deformar).

- `output/produccion/plantilla-nuvia-academy/papel-nuvia-3840x2160.png`
- `output/produccion/plantilla-nuvia-academy/papel-nuvia-1920x1080.png`

Tono medio 202/255, con viñeteado propio: centro `#D1CFC9`, esquina `#C5C0B9`. Lleva fibras y motas visibles. Es lo que separa esta plantilla de un fondo crema plano, y es el cambio de mayor efecto por menor coste.

**Movimiento del fondo:** deriva muy lenta, un 2 % de escala a lo largo de todo el vídeo, imperceptible plano a plano pero que impide que la imagen se sienta congelada.

## 3 · Color

Medido del cierre y de los fotogramas del canal, y contrastado con `estilos/nuvia-tokens.css`.

| Uso | Valor | Token del portal |
|---|---|---|
| Navy de marca, titulares y subtítulos | `#092C58` | próximo a `--nv-navy-900` |
| Oro de marca, hojas del logotipo | `#BA8942` | próximo a `--nv-bronze-500` |
| Terracota de cifras y estado activo | `#C05621` | `--nv-tint-05` |
| Papel | plancha, no color | — |
| Tarjeta activa | `#EEE7DC` con sombra suave | — |
| Texto secundario | `#6B6B6B` | próximo a `--nv-muted` |
| Elemento desvaído | navy al 35 % | — |
| Filete de progreso, parte vacía | `#CCCCC1` | — |

Regla: **el terracota solo marca lo activo y las cifras**. Si todo es terracota, nada destaca.

## 4 · Tipografía

- **Titulares y datos:** NUVIA Inter, pesos Regular, Medium, SemiBold y Bold. Ya instalada para el usuario.
- **Momentos de marca:** NUVIA Fraunces, el serif del portal, solo en careta, capítulos y cierre.

| Elemento | Cuerpo en 4K | Peso | Color |
|---|---|---|---|
| Rótulo de sección | 36 | Medium, versales, +180 de tracking | gris 45 % |
| Antetítulo | 44 | SemiBold, versales, +120 | terracota |
| Titular | 108 | SemiBold | navy |
| Cifra grande | 150 | Bold | terracota |
| Etiqueta de tarjeta | 60 | SemiBold | navy |
| Texto de apoyo | 48 | Regular | gris |
| Nota al pie | 32 | Regular | gris 60 % |
| Subtítulo | 96 | Medium | navy |

Pendiente de confirmar: si el PIB usa otra familia distinta de Inter, se sustituye aquí y el resto del sistema no cambia.

**Cifras.** Punto para los miles, coma para los decimales. Espacio antes del `%`.

**El símbolo `€`.** Orden del fundador del 22-10-2026: **en las fórmulas no se pone**, que ahí estorba y alarga la línea; se queda en las tablas de importes, donde la cifra es el dato (`2.000 €`), y sobre todo **en los objetos de Blender**, acuñado en las monedas y impreso en los billetes. Es relieve, no rótulo: geometría con su extrusionado, de modo que la luz del plató lo revela igual que al resto de la pieza.

## 5 · Cromo fijo

**Cabecera.** A la izquierda, el rótulo de sección en versales espaciadas: `TEMA · PARTE N`. A su derecha, un filete de progreso de toda la pieza, relleno en terracota sobre `#CCCCC1`. El relleno se calcula a partir de la duración total: no se anima a mano.

**Subtítulo.** Centrado en la banda inferior, navy, sin caja, con sombra muy suave. Las palabras marcadas van en terracota, no en negrita.

No hay más elementos permanentes. La limpieza es parte del estilo.

## 6 · Componentes

Seis maquetas cubren todo lo visto en el canal más lo que faltaba.

1. **Tarjetas en fila.** De dos a cuatro. La activa, en blanco roto con sombra; las demás, al 35 %. Para comparar conceptos.
2. **Cadena de valor.** Eslabones con objeto y cifra unidos por flechas. Para procesos y acumulaciones.
3. **Tabla de datos.** Cabeceras en versales, filas con objeto pequeño, totales destacados y el resultado en terracota.
4. **Fórmula.** Expresión grande con el término activo recuadrado y etiquetas diminutas debajo.
5. **Objeto a pantalla completa.** *Nuevo.* El objeto 3D llena el cuadro con movimiento de cámara y profundidad de campo. Son las respiraciones y los clímax: entre seis y ocho por pieza.
6. **Cita o definición.** Una frase sola en grande, con filete, en el serif de marca. Para los remates conceptuales.

Al repartir los 75 planos del guion (22-10-2026) faltaron tres, que se añadieron:

7. **Barras.** Horizontales, con la etiqueta fuera y sin eje: se leen de un vistazo. La activa en terracota, el resto apagadas. Para pesos de la cesta e indicadores que pierden fuerza.
8. **Líneas.** Dos recorridos sin ejes ni rejilla, porque lo que importa es la forma y no el valor. Uno plano y otro con un escalón: la hipoteca fija y la variable.
9. **Título.** Careta y capítulos.

Nueve en total cubren los 58 planos de grafismo de la pieza. No hicieron falta más.

## 7 · Objetos

El mayor salto de calidad y la mayor fuente de incoherencia. Regla: **todos los objetos salen del mismo plató virtual de Blender**, con el mismo rig de luz, la misma lente y sombra de contacto propia, renderizados con alfa sobre fondo transparente.

- Cycles con OptiX, materiales PBR, geometría detallada de verdad.
- Luz principal grande y suave arriba a la izquierda, relleno amplio, contraluz corto.
- Dos salidas por objeto: fija para tarjetas y tablas, y giro lento de 150 fotogramas para los planos donde manda.
- Cada objeto modelado queda en la **biblioteca** y sirve para todos los vídeos siguientes. La biblioteca es el activo que crece.

**Lo aprendido al rehacer el billete y la cesta (22-10-2026).** Un objeto no falla por falta de polígonos, falla porque no se reconoce. El billete era tres losetas blancas: lo arregló darle papel —comba, canto redondeado y una trama fina que rompe el blanco— no más detalle. La cesta era un cajón de listones: lo arregló la rejilla de alambre, el asa y que algo asome por el borde. Regla práctica: **primero la silueta, después el material, y el detalle al final.** Y el género de dentro se separa por color, no por forma: dos verdes juntos se funden en una mancha.

**Modelos traídos de fuera.** Poly Haven queda activada en el complemento de Blender (22-10-2026). Los modelos ajenos se guardan en `output/produccion/plantilla-nuvia-academy/biblioteca/importados.blend` con nombres `lib_<objeto>_<variante>_<pieza>`, y el plató los trae con `importado()`, que los apoya en el suelo y los centra en planta. Así reciben **la misma luz, la misma lente y la misma sombra de contacto** que los modelados a mano, que es la única condición para que convivan.

Regla: se trae de biblioteca lo que **ya existe bien hecho y además se repite o se mueve**; se modela lo que tiene que cambiar de forma medible; se genera como imagen lo que se ve una vez. La maleta es el primer caso: cuero con grano, costura gastada y cierres de latón, muy por encima de lo que saldría modelándola.

Procedencia, para el registro: maleta de Poly Haven, Maximilian Schuster, CC0 (no exige crédito). Si en el futuro se usa algo con licencia CC-BY, el crédito en la descripción del vídeo es decisión del fundador.

**Retinte a la paleta.** Un modelo de biblioteca llega con el color de quien lo hizo. `tintar()` lo lleva al color de marca **sin perder el grano**: mezcla en modo «color», que toma tono y saturación del color nuevo y conserva la luminancia de la textura, que es donde vive el grano. Se aplica sobre una **copia** del material y solo en las piezas que tocan.

Lo aprendido con la maleta: en estos modelos **una sola textura cubre cuero y herrajes**, así que enmascarar por banda de tono deja manchas donde el desgaste cae fuera de la banda. Separar por objeto sale limpio. El precio es que los cierres, que van en la malla de la tapa, pierden el latón; el asa, que es objeto propio, lo conserva.

**La biblioteca va por colecciones.** Un modelo de Poly Haven llega como piezas sueltas, pero uno de Sketchfab llega con jerarquía: el tren son 99 objetos colgando de una raíz. Por eso cada modelo se guarda en `importados.blend` como **colección** `lib_<objeto>`, y `importado()` mueve solo las raíces: desemparentar para colocarlo esparciría el modelo, porque cada pieza está situada respecto de su padre.

**Crédito del tren · consulta resuelta.** Se trajo de Sketchfab una locomotora de **mrmrnaufal**, licencia **CC Attribution**, que obliga a acreditar al autor en la descripción del vídeo; se descartaron por licencia las «Free Standard» de Sketchfab y una CC-BY-NC, que excluye el uso comercial. **Decisión del fundador del 22-10-2026: se modela el tren aquí**, una locomotora de juguete en paleta de marca. El modelo importado se ha retirado de la biblioteca y del código, así que **la obligación de crédito desaparece**. La maleta, de Poly Haven, es CC0 y no exige nada: a día de hoy el proyecto no debe crédito a nadie.

Para retintar un modelo de biblioteca, mirar primero **cómo vienen nombrados sus materiales**. El tren importado los traía por nombre propio —`dark_green`, `brass`, `black`— y bastaba cambiar los dos fuera de paleta; con la maleta no se pudo, porque allí una sola textura cubre cuero y herrajes, y hubo que separar por objeto. Las dos vías quedan en `tintar()`.

**Estado de la biblioteca:** reloj, monedas, billete, cesta, maleta y tren. Cuatro modelados aquí, uno traído y retintado, y la locomotora de juguete, que es propia y además **se puede animar pieza a pieza** —ruedas girando, biela subiendo y bajando— porque conocemos su estructura. Eso era imposible con el importado.

**Qué se modela y qué se genera · orden del fundador del 22-10-2026**, «el 3D lo quiero, pero donde aporte valor real». El reparto no es orgánico contra geométrico, sino éste:

- **3D a mano** para lo que **persiste, se mueve o cambia de forma medible**: lo que la cámara recorre (no hay paralaje en una imagen fija), lo que reaparece idéntico en varios planos y lo que tiene que cambiar una cantidad exacta.
- **Imagen generada** para lo que **se ve una vez y tiene que ser rico**: escenas completas, arquitectura, props complejos de un solo uso.
- **Regla de mezcla:** la imagen generada va siempre a plano completo, nunca recortada dentro de una tarjeta; el objeto 3D va en tarjetas, tablas y cadenas. Así no hay que igualar nunca un recorte con el papel de marca.

Lo que permite mezclarlos en «El precio del dinero» es que sus 29 planos de Blender son un solo mundo, una maqueta de andén nocturno: no hay que igualar dos estilos, sino un mundo con la luz ya definida. El esqueleto de prompt común y las ocho imágenes están en `output/produccion/plantilla-nuvia-academy/prompts-imagenes-maqueta.md`.

## 7 bis · Las imágenes generadas · 22-10-2026

Las siete primeras están en `output/produccion/plantilla-nuvia-academy/imagenes/`, generadas con ChatGPT a partir de `prompts-imagenes-chatgpt.md`. Cubren ocho planos, porque el sobre de nómina sirve para el primero y el último.

**Salieron mejor de lo previsto, y eso cambia el plan.** No son siete props sueltos: son **un mundo**. El edificio institucional aparece al fondo de cuatro de ellas, la marquesina de hierro y las farolas en las siete, y el suelo mojado reflejando la luz cálida en todas. Esa continuidad es mejor de la que yo conseguiría construyendo el andén en Blender.

Consecuencia: **el andén deja de ser un decorado de Blender y pasa a ser imagen generada**. Blender se queda con lo que de verdad le toca —los objetos sobre papel de marca, y lo que tiene que moverse o cambiar de forma medible— y los planos de ambiente salen de aquí.

**Resolución · el punto débil.** Salen a 1536 × 1024. Recortadas a 16:9 quedan en 1536 × 864, y llegar a 4K pide ampliar 2,5 veces. Comprobado al 100 % sobre el sobre de nómina: **aguanta**, porque la fibra del papel sobrevive y la escena es nocturna, pero no es nitidez nativa. Es lo más flojo del conjunto y conviene saberlo antes de maquetar.

## 7 ter · Componer objetos sobre las placas · 22-10-2026

Las placas generadas resuelven el ambiente, pero varios planos piden un objeto **dentro** del andén: la maleta avanzando, el tren frenando. Para eso el plató tiene un **segundo ajuste de luz**, `luz_noche()`: misma estructura y misma lente, otros valores. Clave cálida por la izquierda, que son las farolas; relleno frío por la derecha, que es el cielo; contraluz corto al fondo; y un rebote cálido desde abajo, porque el suelo está mojado y devuelve la luz. La cámara además baja, porque estas placas están tomadas casi a ras de suelo.

`componer.py` hace el pegado. Lo que vuelve creíble una composición **no es el recorte**, que ya viene limpio con alfa, sino tres cosas que no están en el render:

1. **El reflejo del suelo mojado**, estirado y muy borroso, como los de la propia placa.
2. **El desenfoque que le toca por su profundidad.** La placa no está nítida; un objeto a foco perfecto se lee como pegatina.
3. **El nivel y el baño de ambiente.** Un objeto bien iluminado pegado en una escena oscura canta aunque el color case: hay que bajarlo al rango de luminancia de la placa y teñirlo hacia su luz dominante, aquí muy naranja.

Probado con la maleta sobre `05-institucion`. Las tres correcciones hicieron falta: sin ellas la maleta salía pálida, fría y recortada.

## 7 quater · Movimiento sobre una placa fija · 2,5D

`animar.py` resuelve los planos que pedían cámara dentro del andén, que eran la razón por la que varios planos no podían ser imagen fija. La placa no se mueve y el objeto no tiene volumen que girar, así que el movimiento lo venden otras cuatro cosas, todas a la vez:

1. **El tamaño crece como crecería en perspectiva** según se acerca.
2. **El desenfoque se afila** al acercarse, siguiendo la profundidad de campo de la placa.
3. **El reflejo le sigue** por el suelo mojado, estirado y borroso.
4. **Arrastra una estela corta**, tres copias rezagadas cada vez más tenues, que hace de desenfoque de movimiento.

Y la cámara empuja muy despacio sobre la propia placa —un 4 % de escala en seis segundos— para que el fondo no se note congelado.

Dos cosas que hubo que corregir y que valen para los siguientes: el recorrido tiene que **empezar ya visible**, porque un objeto que arranca demasiado lejos deja el primer segundo vacío; y tiene que **terminar dentro del andén**, porque al pisar la línea amarilla del borde la maleta parecía a punto de caer a la vía.

**Perfiles de avance.** `animar.py` define el recorrido como una curva acumulada de 0 a 1, y **de su derivada sale la velocidad instantánea, que es la que gradúa la estela**. Por eso el frenado se ve y no solo se calcula: al perder velocidad la estela se apaga sola.

- `constante`: velocidad casi uniforme, para la maleta que viaja.
- `frenado`: integral de una velocidad que baja en línea recta de 1 a 0,25. **Decelera pero no se para**: termina avanzando al 25 % del ritmo. Esa cola es el plano entero, porque lo que dice el guion es que el tren frena y aun así sigue adelante.

Los planos se definen en el diccionario `PLANOS`, con su objeto, su placa, su perfil y su recorrido, y se lanzan por nombre: `python animar.py maleta-viaja`.

Probado: `compuestos/maleta-viaja.mp4`, 150 fotogramas, 1920 × 1080 a 25 fps.

**Lo que no funciona · comprobado y retirado el 22-10-2026.** Se montó el plano del tren frenando con la locomotora de juguete sobre la placa y el fundador lo rechazó. El movimiento y la curva de frenado estaban bien; lo que falla es el objeto. **Un objeto estilizado no se compone sobre una placa fotorrealista.** La maleta encaja porque es un modelo fotográfico con grano de cuero; la locomotora, de formas limpias y color plano, se lee como una pegatina encima de una fotografía por bien que case la luz.

Regla que sale de ahí, y que vale para todo el proyecto: **cada mundo pide su clase de objeto.** Sobre papel de marca, en tarjetas y tablas, objetos estilizados: ahí la locomotora es la correcta y se queda. Dentro de las placas de andén, objetos fotorrealistas o nada.

## 7 quinquies · La dosis · orden del fundador del 22-10-2026

«No vamos a crear una película para ganar un Óscar; algo claro pero bonito, que le dé vidilla al vídeo, pero sin pasarnos.» Esto es un vídeo financiero: lo que tiene que quedar claro es la explicación, y el 3D y las imágenes están para que no canse, no para lucirse.

Dosis para una pieza de siete minos y medio, 75 planos:

| Qué | Cuántos planos | Para qué |
|---|---|---|
| Grafismo sobre papel de marca | ~55 | El cuerpo. Aquí se explica. |
| Imágenes generadas, a plano completo | 8 | Respiraciones. Una cada 45-60 s. |
| Objetos 3D dentro de tarjetas | los que pida el guion | Dar materia a un concepto, pequeños. |
| Planos compuestos con movimiento | **1** | El golpe de efecto. Uno basta. |
| Ben | 2 | Entrada y salida. |

**La regla que cierra el asunto: un momento visual cada 45-60 segundos.** Más que eso deja de ser un vídeo financiero y empieza a parecer un carrete de demostración. Si un plano no ayuda a entender algo, sobra por bonito que sea.

Y el corolario práctico: **la biblioteca de objetos ya está terminada para esta pieza.** Reloj, monedas, billete, cesta, maleta y tren bastan. No se modela nada más salvo que el guion lo pida.

## 8 · Movimiento

- Entrada de elementos: aparecer y subir 26 px en 14 fotogramas, escalonando 7 entre hermanos. Sin rebotes.
- Cifras: contador ascendente, nunca aparición seca.
- Cambio de estado activo: cruce de 12 fotogramas.
- Fondo: deriva continua del 2 %.
- Cambio de plano: corte, salvo entre partes, donde hay un fundido corto.

## 9 · Presentador

El canal adopta un presentador sintético, **Ben**: agente financiero senior, 55-60 años, traje azul marino sin corbata, en una oficina clara. Decisión del fundador del 22-10-2026: **la narración de los vídeos es la voz generada de Ben**, no la del fundador.

**Dos apariciones por vídeo: entrada y salida.** Decisión del fundador del 22-10-2026.

1. **Apertura.** Ben de cuerpo entero en su oficina, unos 10 s, plantea la pregunta del vídeo.
2. **Cierre.** Ben de cuerpo entero, despedida, y de ahí entra el logotipo.

Se descarta el círculo en esquina durante el cuerpo del vídeo. Se intentó y se abandonó por dos motivos comprobados: el generador no respeta la orden de no hablar en planos cortos, y sobre todo **el decorado no se mantiene**. En los cuatro bucles de prueba Ben aparecía en cuatro despachos distintos y en ninguno estaba el cuadro de NUVIA ACADEMY, pese a invocar `@office-ben`. La referencia de entorno aguanta en plano general y se pierde en plano medio corto.

Consecuencia para el cuerpo del vídeo: manda el grafismo, y la continuidad la da la voz, no la cara.

**Requisitos técnicos.** 1080p y 16:9. Los clips llegan a 24 fps y se convierten a 25 al montar. Entrada y salida se generan en la misma sesión, con `@ben` y `@office-ben`, para que casen entre sí.

**Comprobado en las pruebas del 22-10-2026.** El 1080p es nativo: tiene un 38 % más de detalle que el 720p anterior. El audio sale en torno a −14 LUFS, bien, pero con pico real a −0,3 dBTP, que hay que bajar a −1,5 en la mezcla. En el clip de salida el cuadro de la pared cambia de oscuro a claro entre los segundos 7 y 8; como la cámara está fija, se parchea en el montaje o se usan solo los primeros 7 segundos.

## 9 bis · Transparencia sobre el presentador sintético · consulta resuelta

Se planteó al fundador que Ben, al presentarse como educador financiero senior con apariencia realista, podría ser tomado por un asesor real, y se propuso una línea de transparencia en pantalla y en la descripción de YouTube.

**Respuesta del fundador, 22-10-2026: no se incluye ninguna línea de transparencia.**

Queda constancia de la consulta y de su respuesta, sin firmarla ni ratificarla en su nombre. La declaración sigue existiendo en la ficha interna del personaje en Google Flow, que recoge que Ben es un personaje digital ficticio, que no representa a ninguna entidad financiera y que no ofrece asesoramiento personalizado ni recomienda contratar productos.

Pendiente de comprobación por el fundador, fuera del alcance de este trabajo: si la casilla de contenido alterado o sintético del formulario de subida de YouTube aplica a estos vídeos.

## 10 · Extremos de marca

- **Careta de entrada:** por producir. Logotipo sobre papel, tres segundos, con el tema del vídeo.
- **Cierre:** el del fundador, `CIERRE YT.mp4`, 10 s, tal cual, convertido a 25 fps.

## 11 · Cómo se produce un vídeo con esta plantilla

El orden cambia respecto de lo previsto: **la voz va primero**. Con locución generada ya no hay que estimar tiempos y luego ajustarlos a una toma futura; se genera el audio y todo lo demás se conforma a él.

1. **Guion** en `plan.json`: escenas, texto de locución y, por plano, componente y objetos.
2. **Voz de Ben** generada para el guion completo. Es la referencia temporal de la pieza.
3. **Conformado**: los tiempos de cada plano y de cada subtítulo se calculan sobre el audio real, no sobre una estimación.
4. **Clips de Ben** en apertura y cierre, generados a partir de esas mismas frases para que la sincronía labial cuadre.
5. **Cavalry** genera los planos de grafismo sobre la plancha de papel, con los tiempos ya definitivos.
6. **Blender** renderiza los objetos que falten; los de la biblioteca se reutilizan.
7. **Resolve** monta, aplica subtítulos, pega los extremos de marca y exporta.

Ya no quedan tiempos provisionales ni pistas de audio a la espera.

## 11 bis · Primera pieza montada con la plantilla · 22-10-2026

«El precio del dinero» está montado en Resolve con esta plantilla. Comprobado en la propia línea de tiempo, no dado por bueno:

| | |
|---|---|
| Proyecto | `El precio del dinero C` |
| Líneas | `Pelicula C - limpia` y `Pelicula C - subtitulada` |
| Duración | 11.250 fotogramas · 450 s · 1920 × 1080 a 25 fps |
| Planos en V1 | 75 de 75, ninguno ausente |
| Subtítulos | 114 en la línea subtitulada |
| Marcadores | 15, uno por escena |
| Audio | A1, A2 y A3 vacías, esperando la locución |

Reparto final: 58 planos de grafismo salidos de Cavalry, 9 imágenes generadas, 7 con objeto 3D sobre el papel y 1 compuesto. Cada plano se verificó con ffprobe antes de montar: resolución, fotogramas por segundo y duración contra la que pide el guion, sin una sola discrepancia.

**Lo que falta** no es montaje: es la **locución**. Los tiempos siguen siendo los previstos en el guion, no los reales. Cuando exista la voz de Ben, los planos se reconforman sobre el audio y los subtítulos se recolocan. También faltan los dos extremos de Ben y el cierre de marca.

**Defecto encontrado al conformar los objetos.** Los renders de Blender traen un velo del suelo captador de sombra: casi un millón de píxeles con alfa entre 1 y 10 cubriendo un rectángulo entero, que sobre el papel crema se ve como un recuadro gris. Se corrige en el compositor cortando el alfa por debajo de 11 y reescalando el resto, que respeta la sombra de contacto. Queda en `scripts/conformar.py`, función `sin_velo()`.

## 11 ter · Por qué la primera versión quedaba sosa · 22-10-2026

El fundador rechazó el primer máster: «hay fotogramas que son prácticamente una página». Tenía razón y la causa era concreta.

1. **No había movimiento dentro de los planos.** La §8 de esta plantilla lo especifica desde el principio y el generador no lo implementaba: los elementos se colocaban quietos y solo derivaba el papel. Un plano de seis segundos era una imagen fija durante seis segundos.
2. **La composición estaba hueca.** Todo el contenido vivía en la franja superior y debajo quedaba medio cuadro en blanco.
3. **La tipografía era pequeña** para un cuadro de 1080: un titular al 11 % de la altura no es una imagen, es un pie de foto grande.

Corregido: entradas escalonadas (aparecer y subir 30 unidades en 14 fotogramas, 7 de desfase entre hermanos), bloques centrados en la franja útil, cuerpos entre un 60 % y un 80 % mayores, y **ajuste automático de cuerpo** para que un titular largo no se salga del cuadro.

**Límites del guion de Cavalry 1.1, comprobados en su registro.** No existen `characterSpacing` ni `generator.roundness`, y `generator.dimensions.x` **no se puede animar**. Las tres estaban en el código envueltas en `try/catch`, así que no rompían nada pero **lanzaban 1.131 excepciones por construcción**, cada una escrita a disco: eso era lo que colgaba la aplicación. Consecuencias: no hay espaciado de letras, las tarjetas tienen esquinas vivas, y las barras y los trazos no crecen sino que entran deslizándose desde su origen.

**Regla de trabajo:** construir siempre en escena limpia. El primer build sobre una escena vacía tarda 40 segundos; el segundo, sobre una escena que ya tiene 58 composiciones, cuelga Cavalry.

Resultado: `renders/master-d-animado.mp4`, 450 s, 1920 × 1080 a 25 fps.

## 12 · Estado

Hecho: plancha de papel extraída y verificada sin costuras, paleta medida, especificación escrita.

Pendiente: componentes en Cavalry, rig de estudio y biblioteca de objetos en Blender, careta de entrada, y la escena de muestra que debe juzgar el fundador antes de producir en serie.

Esta plantilla no se ha aplicado todavía a ningún vídeo. No hay commit ni publicación.
