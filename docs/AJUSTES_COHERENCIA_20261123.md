# Ajustes de coherencia · 23-11-2026

**Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Tras la revisión completa del sitio (`output/revision-completa-20261123/`) se preparó el antes y después de seis ajustes (`output/mejora-ajustes-coherencia-20261123/`, hojas JPG, `INFORME.md`, `TITULOS.md`, `PATRON_INDICE.md`). Respuesta: «Aplicar 1 a 4 y 6». El ajuste 5 (patrón común de índice) queda sin decidir.

## Cambios

1. **Titular de Colaboradores:** `clamp(48px, 4.7vw, 68px)`, 56 px hasta 1179 px y 50 px hasta 899 px, como Lecturas con Criterio (`estilos/ecosistema/interiores-colaboradores.css`). Contrato: `TITLE_CONTRACT` de `scripts/nuvia-visual-contract.mjs` con la misma fórmula y saltos que Lecturas.
2. **Fondo de los interiores de Patrimonio:** `body[data-eco-theme="patrimonio"] main` usa `--nv-surface-hub-light` (`estilos/ecosistema/interiores-patrimonio.css`). La regla `.nuvia-design-lab main` no se toca; portadas y demás webs, igual. Contrastes AA calculados: tinta 14,1:1, texto suave 7,4:1, apagado 5,4:1, bronce 700 5,6:1, verde 700 6,6:1; tarjeta blanca sobre el fondo 1,107:1 (antes 1,083:1).
3. **Tarjeta «El dinero también se aprende.» de Academia:** `--nv-surface-technical` (`rgb(232,237,243)`), texto pequeño en azul 700 y titular en azul 900 (`estilos/ecosistema/academia.css`). Contrato: `SURFACE_CONTRACT` separa `.bi-reading` (verde 100) de `.ac-foundations` (técnico).
4. **Botón de la portada de Bienestar:** «Leer los dos ensayos» (mismo texto y destino `#lecturas-bienestar`) pasa de `web-link` a `web-button` en `scripts/ecosistema/bienestar.mjs`; `bienestar.html` regenerado con `node scripts/ecosistema/generar-portadas.mjs` (solo cambia esa línea); `estilos/ecosistema/bienestar.css` ajusta los dos selectores. Sustituye la excepción de `docs/BOTONES_Y_ESQUINAS_20261123.md` («se deja el enlace actual»).
6. **Títulos de pestaña en un solo formato, «NUVIA · X»:** se eliminan los `document.title` con «X | NUVIA» de `vivienda`, `jubilacion` y las cinco guías (el `<title>` estático ya es el canónico del registro); `cartera.html` fija «NUVIA · Análisis de cartera / Carteras modelo / Análisis y valoración de empresas»; `_plantilla.html` y `guia-impuestos.html` pasan al mismo formato. Ninguna prueba de títulos cambia.

## Fuera de alcance

Ajuste 5. Casillas de Jubilación y otras piezas con gris azulado propio dentro de tarjetas (ver `INFORME.md`). Altura del botón de Academia (48 px frente a 50 px).

## Validación

`npm run validate` completo en verde (incluida la auditoría de render de 51 páginas a 1440 px) y auditoría a 1024 y 768 px de Colaboradores, Academia, Bienestar, Vivienda, Jubilación y la guía fiscal, sin fallos. Sin commit ni publicación.

## Añadido por la dirección · botón de la portada de Academia

Aprobado en la misma orden («Sí, aplícalos»). `estilos/ecosistema/academia.css`, regla `.ac-start`: de 13 px de letra y 48 px de alto a 14 px y 50 px, como los botones de las otras tres portadas. Sin cambio de pruebas.

Validación del conjunto (ayudas del simulador, estos ajustes y el botón de Academia, que dos sesiones aplicaron a la vez): `npm run validate` con código de salida 0, «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas». Visto en el navegador a 1440 px: Colaboradores, portada de Academia, portada de Bienestar, Vivienda, simulador de Jubilación y guía de planificación, con la consola limpia. Títulos de pestaña comprobados en once rutas: todos en formato «NUVIA · X». No se ha ejecutado `npm run build`.

## Ajuste 5 · índice de las portadas, unificación mínima (opción D)

**Orden del fundador**, transmitida por la dirección: se le propuso «Un único tamaño para el título de cada sección. Hoy Academia usa tres distintos. Una etiqueta pequeña encima de cada entrada, en las cuatro. Hoy Economía no tiene.» y respondió «el resto tus peropuestas». No se rehace ninguna portada (opciones A y B descartadas; patrón en `output/mejora-ajustes-coherencia-20261123/PATRON_INDICE.md`).

**Qué cambia**
- **Título de entrada a 29 px en las cuatro.** Economía, Patrimonio y Bienestar ya lo tenían (Bienestar baja a 27 px a 1024, como antes). Academia pasa de 45 / 36 / 31 px a 29 px y se quitan los saltos propios de tablet (`estilos/ecosistema/academia.css`). La tarjeta destacada conserva fondo y forma; la altura del bloque baja de 573 a 540 px (1440) y de 594 a 578 px (1024).
- **Etiqueta en Economía** (`scripts/ecosistema/economia.mjs`, `estilos/ecosistema/economia.css`, `economia.html` regenerado, solo cambian esas líneas): «Contexto» en Informes de mercado y Mercados y noticias; «Datos» en Análisis de cartera y Análisis y valoración de empresas. Mismo estilo que `.pa-kind` de Patrimonio: 12 px, peso 400, 7 px de separación inferior, color de acento de la web (azul 700, 8,82:1 sobre blanco); sobre la tarjeta azul noche, `--nv-mist` (13,26:1 sobre `--nv-navy-900`). Los títulos de grupo se mantienen. El bloque pasa de 556 a 636 px (1440) y de 666 a 746 px (1024).
- **Etiquetas de las otras tres:** el texto no cambia. Patrimonio (12 px, peso 400, 7 px) y Bienestar (12 px, peso 400; va debajo del texto, no encima) ya coincidían en tamaño. Academia difería en la separación: 15 px bajo la etiqueta de la tarjeta y 10 px en las dos filas; ahora 7 px en las tres. La etiqueta «Aprender experimentando» (franja del interés compuesto) conserva sus 15 px. Sin tocar: Academia usa peso 500 frente al 400 de las demás.

**Medidas de antes y después:** `output/ajuste-5-indice-20261123/` (`medidas-antes.json`, `medidas-despues.json`, capturas `*-antes.png` y `*-despues.png` de las cuatro a 1440 y 1024 px).

**Validación:** `docs/nuvia-economia-entry.test.mjs`, `docs/nuvia-academy-entry.test.mjs`, `docs/nuvia-academy-banner.test.mjs`, `docs/nuvia-navigation.test.mjs`, `scripts/check-economia-entry.mjs` y `scripts/check-academy-entry.mjs` con código 0; `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 economia.html,patrimonio.html,bienestar.html,academia.html`: «sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas». Ninguna prueba ni contrato cambia (29 px ya estaba en la escala de Academia).

**No verificado:** `npm run validate` y `npm run build` (los pasa la dirección); 1280 a 768 px solo por la auditoría, sin captura; la etiqueta de Economía no se ha mirado en 768 px a ojo.
