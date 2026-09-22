# Mercados y noticias · Más noticias con maquetación editorial

Fecha: 22-09-2026.

Orden del fundador: quitar de la portada de Mercados y noticias el bloque «Para leer con perspectiva · Informes de mercado», mostrar más noticias (de 3 a unas 9–12, sin inventar ninguna) y darles más impacto visual con una maquetación editorial, sin tocar la tabla de índices ni la destacada oscura.

## Cambios

- `mercados.html`: fuera la sección de tarjetas de informes (marcadores `NUVIA INFORMES tarjetas`). Los informes, su lector (`?vista=informes`), el destacado de `economia.html`, el archivo y el pipeline no cambian; `sincronizar.mjs` sigue funcionando (si no encuentra el marcador, no escribe nada). Las tres tarjetas escritas a mano se sustituyen por dos contenedores vacíos (`data-market-news-slot="featured"` y `"grid"`) y una nueva zona a todo el ancho, «Más titulares de la selección». Entradilla de la sección actualizada («…la noticia económica destacada y una selección de titulares…»).
- `web2-integration.js`: `renderSecondaryNews` crea las tarjetas desde `data/daily-content.json`: las dos primeras junto a la destacada, el resto en la rejilla. Tarjeta entera pulsable (el titular es un `<button>` con `::after` que cubre la tarjeta; abre la misma ficha ampliada con el enlace al medio). Si la carga falla, aviso visible y ningún titular de reserva. La rejilla se ordena por tema (Economía y mercados, Tipos de interés y deuda, Inflación y coste de vida, Empleo e ingresos, Vivienda y financiación), conservando dentro de cada tema el orden de la selección; las dos noticias de la columna no se reordenan.
- `estilos/nuvia-pages-foundations.css`: nuevo bloque de tarjetas (imagen 2:1 con `object-fit: cover`, 5:2 junto a la destacada; zoom y elevación suaves al pasar el cursor, anulados con `prefers-reduced-motion`; etiqueta de tema en color; pie fecha/medio/«Ampliar»; foco alrededor de la tarjeta). Rejilla 3/2/1 columnas (>1120, 641–1120, ≤640 px). Eliminadas las reglas `.nv-reports-strip`, que solo usaba el bloque retirado.
- `scripts/update-daily-news.mjs`: hasta 11 noticias breves (12 con la destacada), mínimo 3. Varias ilustraciones propias por tema y reparto sin repetir imagen mientras queden libres.
- `docs/nuvia-news-editorial.test.mjs`: admite de 3 a 11 breves, URL y titulares distintos en todas, y comprueba los contenedores.

## Colores de tema (texto blanco)

Economía y mercados `--nv-navy-900` (15,6:1) · Tipos de interés y deuda `--nv-navy-700` (8,8:1) · Inflación y coste de vida `--nv-cat-teal` (7,1:1) · Vivienda y financiación `--nv-green-700` (7,3:1) · Empleo e ingresos `--nv-cat-cyan` (7,8:1).

## Pendiente de decisión

- Imágenes: diez ilustraciones propias ya publicadas en otras páginas; con doce noticias puede repetirse alguna. Para imágenes exclusivas harían falta 7–8 nuevas (ImageGen).
- Fuentes: solo EL PAÍS Economía y Expansión (mercados). Las últimas ejecuciones registraron 18–32 candidatos válidos; las dos del 7 y 8-09 (18) podrían quedarse por debajo de 11 tras quitar temas repetidos. Añadir medios requiere ampliar la lista cerrada de `news-editorial.mjs`.
- Filtros por tema: no se añaden; con 9 titulares repartidos en 5 temas cada filtro dejaría 1–3 tarjetas.

## Validación

Pruebas `news-editorial` (también con una selección simulada de 11 breves), `notice-states`, `economia-entry`, `page-styles`, `surfaces`, `layout-foundations`, `typography-foundations`, `navigation`, `navigation-cards`, `page-hierarchy`, `metadata`, `external-content`, `tables-results`, `informes`, `news-selection`; `check-static-site`, `check-consistencia`, `check-lenguaje`, `check-parity`, `informes:check`, `shell:check`; auditoría de render de `mercados.html`, `mercados.html?vista=informes` y `economia.html` a 1440, 1024 y 768 px sin fallos. Teclado (Tab + Intro) y clic en cualquier punto de la tarjeta abren la ficha.
