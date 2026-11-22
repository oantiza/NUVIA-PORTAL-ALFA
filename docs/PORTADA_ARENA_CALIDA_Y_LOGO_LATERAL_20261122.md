# Portada NUVIA · Arena cálida y firma lateral XL

## Orden del fundador

El fundador aprobó aplicar a la portada la combinación «Arena cálida», «Lateral XL» y botón «Qué es NUVIA» en marino. En tablet pidió reducir ligeramente los aros para adelantar los cuatro accesos. Solicitó conservar los textos y dejar la revisión en local.

## Aplicación

Se actualizaron los colores propios de la portada en `estilos/nuvia-tokens.css` y su presentación en `estilos/ecosistema/hub.css`. El fondo parte de `#EFEAE0`, con luz `#F7F3EA` y un tono más profundo `#E5DECF`. La firma oficial se mantiene a la izquierda y adopta el tamaño adaptable de la maqueta, entre 270 y 410 píxeles. El botón de la derecha utiliza fondo `#0F2640`, texto marfil y una flecha sobre un círculo bronce.

En tablet se ajustan la imagen de los aros y el espacio que ocupa el conjunto. En la composición de dos columnas, la altura de la primera fila y el tamaño de la figura comparten la misma medida. Las puertas de las cuatro webs conservan su orden y los rótulos completos.

## Prueba del apartado 12 del marco

La intervención modifica la presentación de la entrada institucional. Los colores identifican la marca y los accesos. Las herramientas mantienen sus destinos y comportamiento. El cambio utiliza recursos locales y la misma estructura de navegación, sin añadir datos, cálculos, servicios externos ni recorridos comerciales. Clasificación interna verde.

## Comprobación de la portada

Se compararon la versión anterior y la final del repositorio a 1440 × 900, 1280 × 800, 1024 × 768, 992 × 800, 860 × 900, 834 × 1112 y 768 × 1024. El navegador conserva los mismos textos, destinos y orden de tabulación. Los cuatro accesos completos caben en la primera pantalla en los siete tamaños, sin solapar los aros y sin desplazamiento horizontal.

| Vista | Aros antes | Aros ahora | Avance de la primera y la segunda fila |
| --- | ---: | ---: | --- |
| 768 y 834 px | 240 px | 204 px | 41 px en ambas filas |
| 1024 px | 392 px | 328 px | 22 y 36 px |

El logo mide 410 px a 1440 y 270 px a 768. El contraste mínimo medido de los textos del pie sobre el degradado real es 6,08:1. Las capturas y resultados numéricos se guardan en [las comprobaciones locales](../output/portada-arena-20261122/despues/medidas.json).

Se completaron `npm run validate:nucleo`, `npm run build` (incluye la validación completa del portal) y la auditoría final de la portada en los siete anchos. En la franja inferior, la rejilla de herramientas se muestra únicamente al abrir el desplegable para evitar que reserve ancho cuando está cerrado. En la copia compilada se probaron con teclado la apertura, los seis enlaces y el cierre del desplegable a 1440, 1280, 1024 y 768 px. Se verificaron también los cuatro destinos principales y «Qué es NUVIA» desde el servidor local.
