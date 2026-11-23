# Reloj de arena en la cabecera de Mercados y noticias

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit, sin publicación y sin compilar.

## Orden del fundador

Se le propuso cambiar la foto de la cabecera de `mercados.html` (un hombre con traje leyendo el periódico, que remite a la banca) por una pieza de vidrio modelada en Blender, como el globo de Economía. Descartó las columnas, que «se leen como un gráfico que sube». Se le propuso entonces «un barómetro o un reloj de arena: habla de medir y de tiempo, no de subir», y respondió:

- «Un barómetro o un reloj de arena».
- Tras ver las dos piezas montadas en la cabecera: «Reloj de arena».

## Qué cambia

- `mercados.html`: la imagen pasa de `src/assets/home/mercados-noticias-manana-20260923.webp` (1600 × 893) a `src/assets/ecosistema/mercados-reloj-arena.webp` (1000 × 764, con alfa, 51276 bytes, SHA-256 `d0b91011ff922e7aa7d7e92d8b25b5cc08f19e230a1f8f3de614f64e1b264f8c`). Es decorativa, como el globo de Economía: `alt=""` y contenedor con `aria-hidden="true"`; lleva además `fetchpriority="high"` y `decoding="async"`. Las tres vistas (Noticias y contexto, Informes, Mercados y cotizaciones) comparten esta cabecera.
- `estilos/ecosistema/interiores-economia.css`: clase propia `nv-sub-hero__img--pieza` (y `nv-sub-hero__media--pieza` en el contenedor), dentro del bloque de Economía. Sin marco, sin sombra, sin radio, `object-fit: contain`, sin el filete de la esquina y sin eventos de puntero. Las reglas comunes de `.nv-sub-hero__img` (`nuvia-subseccion.css`) no se han tocado, y ninguna otra página usa la clase.
- Fuentes y procedencia: `src/assets/ecosistema/PROCEDENCIA_PIEZAS_BLENDER.md` y `PROCEDENCIA.md`; guion, exportación y escena en `scripts/blender/piezas-webs-20261122/` (`piezas_mercados.py`, `exportar_mercados.py`, `reloj_arena.blend`, `LEEME.md` actualizado; `piezas.py` intacto); nota fechada en `docs/SUBSECCIONES_CABECERA_20260923.md`.
- La foto anterior se conserva sin enlazar. Comprobado con búsqueda en todo el repositorio, sin `dist/`: solo la citan `docs/SUBSECCIONES_CABECERA_20260923.md` y esta acta; ninguna página, hoja de estilos, script ni prueba la enlaza.

## Medidas

La pieza se muestra a 340 px de alto (en tablet, 280 px) y sobresale del hueco por arriba y por abajo mediante márgenes negativos (31 px, 24 px en tablet). Como el reloj va sobre fondo transparente, no se ve ningún recorte, y la cabecera no crece.

| Ancho | Cabecera antes | Cabecera después | Pieza |
|---|---:|---:|---|
| 1440 px | 407 px | 407 px | 445 × 340 px |
| 1024 px | 407 px | 407 px | 343 × 340 px |
| 820 y 768 px | 446 px | 446 px | 282 × 280 px |

Sin sobresalir, a 340 px la cabecera habría crecido 62 px. A 1440 y 1024 px la imagen se solapa 11 px con la franja de las migas, pero en su zona vacía (a la derecha), sin cubrir texto ni enlaces. Capturas de antes y después a 1440, 1024 y 768 px en `output/mejora-imagen-mercados-20261123/capturas/` (`antes-mercados-*` y `aplicado-mercados-*`) y hoja comparativa `hoja-aplicado.jpg`.

## Prueba regulatoria (§12 del marco)

Imagen decorativa sin cifras, textos, flechas, símbolos de moneda ni gráficos. **No sugiere tendencia:** el reloj de arena habla de tiempo y de medir, no de subir ni de bajar, y por eso se prefirió a las columnas. Tampoco sugiere recomendación, idoneidad ni llamada a operar. Retira la foto de un hombre de traje leyendo un periódico, que remitía a la banca. No añade funciones, datos ni cálculos. Sin efecto regulatorio.

## Validación

Con el servidor de la carpeta real en `http://localhost:4199/`:

- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 "mercados.html,mercados.html?vista=informes,mercados.html?vista=cotizaciones,economia.html"`: 28 vistas correctas; «Render verificado: 4 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- `node docs/nuvia-economia-entry.test.mjs`, `node scripts/check-economia-entry.mjs`, `node docs/nuvia-academy-banner.test.mjs` y `node scripts/check-static-site.mjs .` («49 páginas»): código de salida 0.
- Medición en navegador a 1440, 1024 y 768 px en las tres vistas: la imagen carga a 1000 px naturales, `object-fit: contain`, sin sombra ni radio, y la cabecera mide lo mismo que con la foto.
- Ninguna prueba cambia: ninguna fija la imagen de Mercados ni la clase nueva.

## No verificado

- `npm run validate` y `npm run build`: no se han ejecutado; los pasa la dirección. `dist/` no se ha regenerado.
- Ancho móvil (por debajo de 640 px): fuera de alcance; la regla de tablet (280 px) también se aplica allí y no se ha mirado.
- El reloj solo se ha visto en la cabecera clara; la pieza no se ha probado sobre otro fondo.
- La foto anterior sigue en el repositorio: conservarla o borrarla queda a decisión del fundador.
