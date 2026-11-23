# Academia · tarjeta destacada y enlace al canal de YouTube

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Sobre la tarjeta: «estoy de acuerdo contigo que la tarjeta de academia queda un poco vacía. Proponme soluciones.» Sobre el canal: «tenemos un canal de YouTube en el que están los vídeos de la academia ordenados y que puede ser interesante mencionarlo en el área de la academia» (`https://www.youtube.com/@nuvia_academy`). Vistos los ejemplos y la opinión sobre el canal, a la pregunta «¿Aplico en local la tarjeta a 36 px y el enlace al canal en los dos sitios?» respondió: «Sí, las dos cosas».

## Qué cambia

- **Tarjeta «El dinero también se aprende.»** de la portada de Academia: su título pasa de 29 a 36 px. Es la entrada destacada; las otras dos siguen a 29 px. Excepción deliberada a la regla de un solo tamaño de `docs/AJUSTES_COHERENCIA_20261123.md`: a 29 px la tarjeta quedaba vacía.
- **Portada de Academia**, bloque «La curiosidad no termina aquí.»: tercer enlace, «Vídeos de Academia en YouTube ↗».
- **Página de Cursos** (`academia.html?tab=cursos`): una línea bajo «Curso disponible»: «Los vídeos de Academia están también en nuestro canal de YouTube ↗. Se abre en una pestaña nueva.»

Los dos enlaces son externos, se abren en pestaña nueva con `rel="noopener noreferrer"` y no incrustan nada: YouTube solo se conecta si el visitante pulsa.

## Ficheros

- `estilos/ecosistema/academia.css` (título de la tarjeta).
- `scripts/ecosistema/academia.mjs` y `academia.html` (portada regenerada con `node scripts/ecosistema/generar-portadas.mjs`; la línea de Cursos, editada en `academia.html`).

## Lo que se dijo al fundador sobre el canal

Visto el 23-11-2026: 12 vídeos, 10 suscriptores, dos listas públicas (5 y 3 vídeos) y cuatro vídeos fuera de lista. Se le recomendó arreglar antes de enlazarlo el lema de la cabecera del canal («Entiende tu dinero. Invierte con criterio. Aprende a invertir…»), que es un imperativo de inversión y contradice el «NUVIA informa, no recomienda» de la web, y añadir en el canal el enlace de vuelta a la web. El fundador decidió enlazarlo ya. El canal no enlaza a la web y su identidad (negro y dorado, «NUVIA Academy») difiere de la de la web.

## Prueba regulatoria (§12 del marco)

Se añade un enlace a un canal propio de vídeos formativos. No hay datos del usuario, cálculo, instrumentos ni llamada a contratar. Punto de atención: el lema del canal usa un imperativo de inversión; es contenido propio fuera de la web y conviene alinearlo con el marco.

## Validación

- `npm run validate`: código de salida 0; «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- Pruebas de Academia, de contenido externo, de navegación y `npm run shell:check`: código de salida 0. Ninguna prueba se ha cambiado.
- Navegador a 1440, 1024 y 768 px: título de la tarjeta a 36 px, tres enlaces en el bloque final (el nuevo, de 48 px de alto), sin desbordes y con la consola limpia. En Cursos, el enlace va subrayado a 16 px.
- No se ha ejecutado `npm run build`.

## Despliegues anteriores que no constaban en ningún acta

- N.º 193 (ejecución 45191307653, commit `51337df`): puertas de Patrimonio y Academia intercambiadas en la portada. Orden: «Sí, publica». `npm run build` con código de salida 0; despliegue correcto.
- N.º 194 (ejecución 45233079347, commit `d3def4b`): reloj de arena en Mercados, Qué es NUVIA sin lema repetido, vídeo sin subtítulos al empezar e índice de portadas unificado. Orden: «Sí, publica». `npm run build` con código de salida 0; despliegue correcto; imagen publicada idéntica a la local.
