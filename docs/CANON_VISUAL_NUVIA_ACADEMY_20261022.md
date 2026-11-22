# Canon visual · vídeos NUVIA Academy · 22-10-2026

Fondo, tipografía y estructura **quedan fijados aquí**. Lo de este documento no se
rediseña en cada vídeo: se aplica. Si algo tiene que cambiar, se cambia en este
archivo primero y después en el código, nunca al revés.

Orden del fundador: «de momento vamos a fijar el fondo y la tipografía y
estructura». Lo que queda abierto está al final, en §8, y está abierto a propósito.

Todas las cifras de aquí están medidas o leídas del código que las produce, no
estimadas.

---

## 1 · Lienzo

| | |
|---|---|
| Composición | 3840 × 2160 |
| Entrega | 1920 × 1080 |
| Fotogramas por segundo | 25 |
| Relación | 16:9 |

**Se compone en 4K y se entrega en 1080.** Las maquetas están escritas en
coordenadas de 3840 × 2160 y un factor `K = 0.5` las lleva a la entrega. No es
capricho: Cavalry se cuelga construyendo 58 composiciones a 3840, y escribir en
coordenadas grandes permite subir la entrega a 4K el día que haga falta cambiando
una sola constante.

La entrega es 1080 porque **el eslabón más débil manda**: las imágenes generadas
salen a 1536 píxeles de ancho y un máster 4K no sería más nítido, solo más pesado.

**Origen de coordenadas en el centro del cuadro.** Y crece hacia arriba.

---

## 2 · Rejilla y franjas

| Elemento | En 4K | En 1080 | Nota |
|---|---|---|---|
| Margen lateral `M` | 307 | 154 | el 8 % del ancho |
| Borde izquierdo `IZQ` | −1613 | −806 | |
| Borde derecho `DER` | +1613 | +806 | |
| Ancho útil | 3226 | 1613 | |
| Línea de cabecera `Y_CAB` | +920 | +460 | a 80 px del borde superior |
| Techo de contenido `TECHO` | +820 | +410 | a 130 px del borde superior |
| Suelo de contenido `SUELO` | −560 | −280 | a 820 px del borde superior |

**Por debajo del suelo no va nada.** Esos 260 píxeles finales —casi una cuarta
parte de la altura— son de los subtítulos y se quedan vacíos aunque no haya
subtítulo en ese plano. Un rótulo que invada esa franja se tapará en cuanto entre
la locución.

**La franja útil es de `TECHO` a `SUELO`**, 1380 unidades en 4K. Los bloques de
contenido se centran ahí, no se apoyan en el techo. Un bloque corto pegado arriba
deja medio cuadro muerto y es lo que hacía que la primera versión pareciera una
presentación.

---

## 3 · Fondo

El fondo **no es un color plano**. Es la plancha de papel hecho a mano de la propia
marca, extraída del cierre que el fundador tiene producido (`CIERRE YT.mp4`,
fotograma 2, sin logotipo, recortado el letterbox y escalado a cubrir sin
deformar).

```
output/produccion/plantilla-nuvia-academy/papel-nuvia-claro-1920x1080.png
output/produccion/plantilla-nuvia-academy/papel-nuvia-claro-3840x2160.png
```

Receta del aclarado, por si hubiera que rehacerla desde la plancha cruda:

```python
base  = GaussianBlur(14)          # el tono, sin fibra
fibra = original - base           # solo la fibra
b     = clip(base) ** 0.46 * [1.010, 1.000, 0.982]
final = clip(b + fibra * 0.42)    # media 230, desviación de fibra 2.21
```

Ese `0.42` es el resultado de tres pasadas con el fundador: la fibra se veía
demasiado marcada y la orden fue «que quede muy fina».

**Movimiento del fondo.** Deriva de escala muy lenta, del 2 % a lo largo de toda la
pieza. Cada plano recibe el tramo que le toca según dónde cae en el total, de modo
que la deriva es continua **entre planos** y no se reinicia en cada corte.
Imperceptible plano a plano; sin ella la imagen se siente congelada.

---

## 4 · Color

Medido del cierre y contrastado con `estilos/nuvia-tokens.css`.

| Uso | Valor |
|---|---|
| Navy · titulares, cifras, texto principal | `#092C58` |
| Oro · filetes y remates de marca | `#BA8942` |
| Terracota · **solo** lo activo y las cifras que importan | `#C05621` |
| Gris · texto secundario y rótulos | `#6B6B6B` |
| Vacío · raíles, guías, parte no cubierta | `#CCCCC1` |
| Tarjeta en reposo | `#E6DED0` |
| Tarjeta activa | `#FBF8F1` |
| Borde de tarjeta en reposo | `#D6CBB6` |
| Barra apagada | `#BDB4A4` |
| Fondo de composición (bajo el papel) | `#EDE9DF` |

**La regla del terracota es la que sostiene todo el sistema: marca lo activo y las
cifras, y nada más.** En una pantalla con cuatro barras solo una es terracota; en
una tabla de cifras solo una. Si todo es terracota, nada destaca.

El gris de barra apagada (`#BDB4A4`) es distinto del gris de vacío (`#CCCCC1`) a
propósito: el segundo tira a verde sobre el papel crema y chirría cuando ocupa
superficie grande.

---

## 5 · Tipografía

Dos familias, las del portal, instaladas como fuentes de sistema:

- **NUVIA Inter** — todo el texto de trabajo. Pesos Regular, Medium y SemiBold.
- **NUVIA Fraunces** — serif de marca, **solo** en citas y remates conceptuales.
  Es el único sitio donde aparece, y por eso significa algo cuando aparece.

### Escala

Cuerpos en coordenadas de composición (4K) y su equivalente real en la entrega.

| Elemento | 4K | 1080 | Peso | Color |
|---|---|---|---|---|
| Rótulo de sección (cabecera) | 36 | 18 | Medium | gris |
| Antetítulo | 56 | 28 | Medium, versales | terracota |
| Titular de careta | hasta 400 | hasta 200 | SemiBold | navy |
| Concepto (palabra sola) | hasta 430 | hasta 215 | SemiBold | navy |
| Cita, palabras apiladas | hasta 240 | hasta 120 | SemiBold | navy · **Fraunces** |
| Cita, frase | hasta 196 | hasta 98 | SemiBold | navy · **Fraunces** |
| Cifra acentuada | 200 | 100 | SemiBold | terracota |
| Cifra normal | 150 | 75 | SemiBold | navy |
| Etiqueta de cifra | 84 | 42 | Medium | gris |
| Fórmula | 176 | 88 | SemiBold | navy |
| Título de tarjeta | hasta 110 | hasta 55 | SemiBold | navy / gris |
| Número de tarjeta | 52 | 26 | Medium | terracota |
| Etiqueta de barra | 70 | 35 | Medium | navy / gris |
| Nodo de cadena | 80 | 40 | SemiBold | navy / terracota |
| Serie de líneas | 76 | 38 | SemiBold | navy / terracota |
| Texto de apoyo | 92–104 | 46–52 | Regular | gris |
| Nota al pie | 46 | 23 | Regular | gris |

**Los «hasta» no son decorativos.** Esos cuerpos pasan por `talla()`, que estima el
ancho del texto —en NUVIA Inter el avance medio ronda 0,52 em— y reduce el cuerpo
si no cabe en su caja. Sin eso, «El precio del dinero» a cuerpo 400 se sale del
cuadro. **Un titular nunca se recorta: se achica.**

Cuando el plano lleva objeto a la derecha, el titular dispone solo del 58–62 % del
ancho útil, y `talla()` lo tiene en cuenta.

### Lo que no existe

Comprobado en el registro de Cavalry 1.1: **no hay `characterSpacing`**. El
espaciado de letras de las versales no se puede aplicar por guion. Las versales van
sin tracking y hay que diseñar contando con ello.

---

## 6 · Estructura de un plano

### Cromo fijo

Dos elementos, siempre, en todos los planos de grafismo:

1. **Rótulo de sección** a la izquierda, en `Y_CAB`: `EL PRECIO DEL DINERO`.
2. **Filete de progreso** a su derecha, de `IZQ + 780` a `DER`: 3 unidades de alto,
   relleno en terracota sobre `#CCCCC1`. **El relleno se calcula solo** a partir de
   dónde cae el plano en la duración total. No se anima a mano y no puede
   desincronizarse del montaje.

No hay un tercer elemento permanente. La limpieza es parte del estilo.

### Los nueve componentes

Cubren los 58 planos de grafismo de una pieza de siete minutos y medio. No han
hecho falta más.

| Componente | Para qué | Anclaje |
|---|---|---|
| `titulo` | Careta de apertura y cierre | bloque a la izquierda, objeto a la derecha |
| `concepto` | Una palabra y su definición | ídem |
| `cita` | Remate conceptual, en Fraunces | centrado, filete de oro encima |
| `tarjetas` | Comparar de dos a cuatro cosas | fila, tarjeta activa en blanco roto |
| `cifras` | Tabla de importes | etiqueta izquierda, valor derecha, filete bajo cada fila |
| `formula` | Una expresión | caja de ancho completo, centrada |
| `cadena` | Procesos y transmisión | raíl horizontal, nodo activo mayor y en terracota |
| `barras` | Proporciones | horizontales, etiqueta fuera, **sin eje** |
| `lineas` | Dos recorridos | **sin ejes ni rejilla**, etiqueta encima de su línea |

Dos decisiones que no son estéticas sino de legibilidad, y que se mantienen:

- **Las barras no llevan eje.** En vídeo no hay tiempo de leer un eje: o la barra
  se entiende sola o sobra.
- **Las líneas no llevan rejilla.** Ahí importa la forma, no el valor.

Las tarjetas miden 900 de alto y su texto va centrado, no pegado al borde. Una
tarjeta que ocupa toda la franja útil con dos líneas dentro se lee como un hueco.

### Objetos

Los objetos 3D de la biblioteca entran **a la derecha** del bloque de texto, en los
componentes `titulo`, `concepto` y `cifras`. Se eligen **por sentido, nunca por
rellenar**: el reloj donde manda el tiempo, la cesta donde se compra, las monedas
donde está el dinero, el billete donde se devuelve. Un objeto que no dice nada
sobra, por bonito que sea.

Los PNG vienen en lienzo cuadrado de 1000 con el objeto centrado, de modo que la
escala es predecible: alto deseado dividido por 1000. Y vienen **sin el velo del
plato de sombra** —el render de Blender deja casi un millón de píxeles con alfa
entre 1 y 10 que sobre el papel crema se ven como un recuadro gris; se corta el
alfa por debajo de 11 y se reescala el resto.

---

## 7 · Movimiento

**La regla mínima, y es obligatoria:** ningún elemento aparece de golpe.

| | |
|---|---|
| Entrada | aparecer y subir 30 unidades (15 px) |
| Duración | 14 fotogramas |
| Desfase entre hermanos | 7 fotogramas |
| Cambio de plano | corte |

Las barras y los trazos no crecen: **entran deslizándose desde su punto de
origen**. No es una elección de estilo, es un límite de la herramienta —§8— pero
cuenta lo mismo.

Un plano sin esto es una imagen fija durante seis segundos, y seis segundos de
imagen fija son muchos. Fue la causa principal de que la primera versión de «El
precio del dinero» quedara sosa.

---

## 8 · Límites de la herramienta · comprobados

Cavalry 1.1, leídos de su propio registro de errores. Importan porque explican por
qué el canon es como es:

- **No existe `characterSpacing`.** Sin tracking en las versales.
- **No existe `generator.roundness`.** Las tarjetas tienen esquinas vivas.
- **`generator.dimensions.x` no se puede animar.** Por eso las barras y los trazos
  entran deslizándose en vez de crecer.

Las tres estaban en el código envueltas en `try/catch`: no rompían nada, pero
lanzaban **1.131 excepciones por construcción**, cada una escrita a disco, y eso
colgaba la aplicación. Están eliminadas.

**Regla de trabajo:** construir siempre con Cavalry recién abierto y escena vacía.
El primer build tarda 40 segundos; un segundo build sobre una escena que ya tiene
58 composiciones la cuelga.

---

## 9 · Lo que este documento no fija

A propósito, porque sigue en discusión:

- **Cuántas imágenes generadas lleva una pieza.** Hoy son 9 de 75 planos y el
  fundador ha dicho que se quedan cortas. El reparto cambiará; el fondo, la
  tipografía y la estructura, no.
- **El presentador.** Ben abre y cierra; su encaje con el resto está decidido pero
  no producido.
- **La careta de entrada de marca**, por producir.
- **El cierre**, que es el del fundador y se usa tal cual.

---

## Dónde vive cada cosa

| | |
|---|---|
| Papel de marca | `output/produccion/plantilla-nuvia-academy/papel-nuvia-claro-*.png` |
| Objetos limpios | `output/produccion/plantilla-nuvia-academy/objetos-limpios/` |
| Maquetas de los componentes | `.../el-precio-del-dinero-b-20261021/scripts/_bloques.py` |
| Generador de los planos | `.../scripts/cavalry_planos.py` |
| Texto en pantalla de cada plano | `.../scripts/textos.py` |
| Reparto de los 75 planos | `.../scripts/montaje.py` → `montaje.md` |

El documento operativo completo, con el procedimiento de producción y el historial
de decisiones, es `docs/PLANTILLA_VIDEO_NUVIA_ACADEMY_20261022.md`. Este archivo es
solo el canon visual: lo que no se toca.
