# Familia, Salud y Bienestar · Rediseño con el lenguaje global · 02-10-2026

Orden del fundador: aplicar el diseño global de la web al espacio Familia, Salud y
Bienestar con sus cinco subsecciones, colocar el ensayo de Isabel Florido Mayor en
Respiración y relajación de forma homogénea con el resto de la web e incrustar el
vídeo facilitado (https://youtu.be/XOGS8dDb1_o) en el artículo. Se aplica además el
informe de publicación del artículo aportado por el fundador (ubicación, introducción
fuera del ensayo, tarjeta, vídeo separado, notas editoriales al final).

## Portada (`bienestar.html`)

- Mismo tratamiento que Economía y Patrimonio: hero panorámico conservado, entradilla
  editorial «Una mirada de conjunto» (banda abierta con tres párrafos: el cuerpo, la
  mente, el tiempo) y cinco tarjetas con fotografía (`.nv-space-tool-card--photo`),
  tres arriba y dos centradas debajo (`.bn-grid`). Acento verde del espacio.
- Cada tarjeta enlaza a su subsección. La de Respiración anuncia el ensayo y el vídeo;
  las otras cuatro no anuncian contenidos inexistentes.

## Subsecciones (cinco páginas propias)

`movimiento-consciente.html`, `nutricion-equilibrada.html`, `respiracion-relajacion.html`,
`familia-trabajo.html`, `descanso-limites-tiempo-propio.html`.

- Cabecera compacta de subsección aprobada en Impuestos (`nuvia-subseccion.css`): texto a
  la izquierda, foto enmarcada a la derecha con filete bronce, etiqueta de estado
  («Un ensayo · Un vídeo» o «Artículos en preparación»).
- Bloque «Artículos y contenidos» con cabecera de sección y, al pie, navegación a los
  otros cuatro temas y regreso a Cuerpo, mente y salud (`temas.html?topic=bienestar`).
- Respiración y relajación: la introducción de la serie («En esta serie de vídeos…»)
  va antes de las tarjetas, fuera del ensayo, como entradilla destacada; tarjeta del
  ensayo (título, extracto de la autora, firma, fecha, «Leer el artículo») y tarjeta
  del vídeo con el reproductor del portal.

## Artículo (`la-respiracion-como-el-escultor-del-cerebro.html`)

- Cabecera de lectura (eyebrow, título, etiquetas), ensayo con firma y fecha de
  publicación, texto íntegro de la autora sin epígrafes y con la lista final de cinco.
- Vídeo incrustado con el mismo mecanismo de Academia (`data-nuvia-external-frame`,
  `youtube-nocookie`, carga solo al pulsar «Reproducir vídeo», enlace «Abrir en
  YouTube»). Se identifica como pieza separada; sin título ni autoría no verificados.
- Bloque «Sobre la autora» (colaboradora en yoga, respiración, meditación y gestión del
  estrés; sin titulaciones no aportadas) y «Notas editoriales de NUVIA» al final,
  separadas del texto firmado, con la fuente complementaria (NCCIH) y el aviso.
- Isabel Florido Mayor se incorpora a `colaboradores.html` (`#isabel-florido`).

## Imágenes (10 nuevas, ninguna repetida en otra página)

Generadas por el fundador con ImageGen a partir de los prompts acordados; originales
en `output/imagegen/bienestar-*-20261002-original.jpg` (fuera de la publicación).

| Uso | Archivo (`src/assets/home/`) | Motivo |
|---|---|---|
| Tarjeta Movimiento | `bienestar-card-movimiento-20261002.webp` (1200 × 600) | madre e hija caminando por la costa |
| Tarjeta Nutrición | `bienestar-card-nutricion-20261002.webp` | manos preparando una ensalada |
| Tarjeta Respiración | `bienestar-card-respiracion-20261002.webp` | mujer sentada en un porche, ojos cerrados |
| Tarjeta Familia y trabajo | `bienestar-card-familia-20261002.webp` | padre cerrando el portátil, niños poniendo la mesa |
| Tarjeta Descanso | `bienestar-card-descanso-20261002.webp` | hombre leyendo junto a una ventana con lluvia |
| Cabecera Movimiento | `bienestar-sub-movimiento-20261002.webp` (1500 × 900) | yoga suave en un parque al amanecer |
| Cabecera Nutrición | `bienestar-sub-nutricion-20261002.webp` | mujer en un puesto de mercado |
| Cabecera Respiración | `bienestar-sub-respiracion-20261002.webp` | persona de espaldas frente al mar al amanecer |
| Cabecera Familia y trabajo | `bienestar-sub-familia-20261002.webp` | familia desayunando antes de salir |
| Cabecera Descanso | `bienestar-sub-descanso-20261002.webp` | dormitorio sereno al despertar |

## Estilos y contratos

- Nueva hoja `estilos/nuvia-bienestar.css` (prefijo `.bn-`, solo tokens), enlazada en las
  siete páginas; `nuvia-subseccion.css` en subsecciones y artículo.
- `scripts/check-consistencia.mjs`: las seis páginas nuevas con techo 0 de estilos inline.
- `scripts/check-render.mjs`: contratos de contenido de la portada (5 tarjetas), las cinco
  subsecciones, el artículo y Colaboradores (4 fichas).

## Revisión interna

Clasificación: VERDE/ÁMBAR heredado de la ficha de respiración. Cambio visual y de
organización sin funciones nuevas: sin datos, formularios, Firebase ni backend. El
vídeo externo no conecta con YouTube hasta que el lector lo reproduce. No se añaden
afirmaciones sanitarias ni titulaciones.

## Validación

- Estáticas en verde: cáscara común, paridad, sitio estático, consistencia, lenguaje,
  estilos de página, navegación, metadatos, confianza, contenido externo, Bienestar
  5A-3, jerarquía, superficies, tarjetas, avisos, disposición, tipografía, revisión
  familiar. `build-site` genera `dist/` con las diez imágenes y la hoja nueva.
- `check-render` a 1440, 1024 y 768 px en portada, cinco subsecciones, artículo y
  Colaboradores: sin fallos (ejecutado en un entorno con Chromium; el equipo local no
  tiene Chromium registrado para Playwright). `temas.html?topic=bienestar` mantiene
  la intermitencia de anclas ya documentada el 23-09, también en la versión anterior.
- Pendiente: compilación completa (`npm run build`) y publicación desde `main` por
  decisión del fundador.

## Ajustes del 03-10-2026

- El vídeo estaba en privado en YouTube (sin miniatura y sin reproducción para visitantes). El fundador lo pasa a «No listado». Se guarda su miniatura como portada local (`src/assets/home/bienestar-video-respiracion-portada-20261003.webp`, recortada para retirar el subtítulo quemado); el reproductor sigue sin conectar con YouTube hasta pulsar «Reproducir».
- Orden del fundador: un solo reproductor y ningún vídeo en la primera página de Respiración y relajación. La subsección lista solo los ensayos y artículos (tarjeta del ensayo con extracto, firma y fecha); el vídeo se ve únicamente en la página de lectura.
- La introducción «En esta serie de vídeos y pequeños ensayos…» presenta el primer ensayo, no la sección: pasa a la página de lectura, antes del texto firmado y fuera de él. La prueba `nuvia-wellbeing-entry` recoge este orden (sin introducción ni `data-nuvia-external-frame` en la subsección; ambos en el artículo).
- `check-render` a 1440 y 768 px en las dos páginas sin fallos. Publicado desde `main`.

## Cuatro temas · 03-10-2026

Orden del fundador: Cuerpo, mente y salud pasa de cinco a cuatro temas. Se retira
«Familia y trabajo» (página y sus dos imágenes; los originales siguen en
`output/imagegen/`) y el orden queda: 01 Respiración y relajación, 02 Movimiento
consciente, 03 Nutrición equilibrada, 04 Descanso, límites y tiempo propio.
Afecta a la portada (rejilla 2 × 2), a la página Cuerpo, mente y salud, al menú
común, al sitemap, a las subsecciones (numeración y temas hermanos) y a los
contratos y pruebas del portal. También: el artículo se lee sin caja, en
Newsreader, con la entradilla de la autora dentro de la pieza firmada; la
subsección lista las publicaciones como filas a lo ancho (`.bn-entries`); el
vídeo lleva portada local y la miniatura solo muestra botones y una nota mínima.
Validación: pruebas estáticas en verde y render a 1440 y 768 px en las cinco
páginas afectadas. Publicado desde `main`.
