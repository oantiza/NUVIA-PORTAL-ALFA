# NUVIA Portal Alfa · Guía maestra de diseño y estructura

**Versión:** 1.0 · 03-10-2026 · **Destinatarios:** cualquier persona, programa o asistente que trabaje sobre la web, incluidos los externos.
**Carácter:** documento de obligado cumplimiento para toda tarea de diseño, estructura, contenido o código del portal. Si una petición entra en conflicto con esta guía, se consulta al fundador antes de actuar.

Esta guía resume y ordena lo que ya está decidido y construido. Las referencias canónicas siguen siendo `AGENTS.md`, `docs/MARCO_REGULATORIO_OBLIGATORIO.md`, `docs/DEFINICION_NUVIA.md` y `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md`; esta guía no las sustituye, las hace operativas.

---

## 1. Reglas de oro (léase antes de tocar nada)

1. **Un solo repositorio y una sola carpeta:** `https://github.com/oantiza/NUVIA-PORTAL-ALFA.git` y `C:\Users\oanti\Documents\NUVIA-PORTAL-ALFA`. Nada se lee ni escribe en `NUVIA-PORTAL-LAB`.
2. **Producción:** GitHub Pages en `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`. Cada actualización de `main` compila y publica `dist/` mediante GitHub Actions (`.github/workflows/pages.yml`). Firebase Hosting no es canal oficial.
3. **Escritorio y tablet solamente** (1440 → 768 px). No se diseña, optimiza ni prueba una versión móvil salvo petición expresa.
4. **Inicio y su hero son la referencia visual.** Todas las páginas se homogeneizan con ellos; nunca al revés.
5. **Solo el fundador decide.** No se bloquea, oculta, retira ni añade nada en la alfa sin consulta previa. No se guardan datos personales de nadie en base de datos. Los informes de colaboradores no sustituyen su decisión.
6. **Marco regulatorio obligatorio** (`docs/MARCO_REGULATORIO_OBLIGATORIO.md`, v1.2): NUVIA informa, explica y calcula; **no recomienda, no juzga idoneidad ni llama a operar**. Se describe sin prescribir: prohibidos «mejor», «recomendado», «óptimo», «conviene», «deberías», «ideal para» en las superficies del laboratorio (`scripts/check-lenguaje.mjs` rompe la build). Cada cambio material pasa la prueba del §12 y se documenta en una ficha en `docs/`.
7. **Separación estricta** entre NUVIA, la actividad profesional del agente financiero vinculado y la entidad a la que representa. Sin patrocinios, afiliación ni derivación comercial.
8. **Contenido sanitario (Bienestar):** divulgación general; nunca diagnóstico, protocolo terapéutico, consejo individual ni titulaciones no aportadas. Aviso de divulgación visible en el espacio.
9. **Sin estilos inline ni colores literales en las páginas.** Solo tokens (`var(--nv-…)`) y clases del sistema. `scripts/check-consistencia.mjs` exige cero `style=""` en cada página publicada.
10. **Contenido externo cerrado hasta la acción del usuario** (YouTube, TradingView): nunca un `<iframe>` al cargar la página.

---

## 2. Estructura del portal

### 2.1 Niveles

| Nivel | Qué es | Páginas |
|---|---|---|
| 1 · Entrada | Home global: presenta NUVIA y distribuye a los cinco espacios | `index.html` |
| 2 · Homes de espacio | Portada fotográfica de cada espacio, con entradilla y mapa de accesos | `economia.html`, `patrimonio.html`, `bienestar.html`, `academia.html`, `lecturas.html` |
| 3 · Páginas hijas | Herramientas, subsecciones, guías, cursos y artículos | `mercados.html`, `cartera.html`, `vivienda.html`, `jubilacion.html`, `fiscalidad.html`, `temas.html?topic=…`, `guia-*.html`, `curso.html`, subsecciones de Bienestar, artículos |
| 4 · Institucional | Identidad y confianza | `colaboradores.html`, `que-es-nuvia.html`, `metodologia.html`, `independencia.html` |

### 2.2 Los cinco espacios y sus hijas (mapa vigente)

- **Economía y Finanzas** (`economia.html`): Informes (`mercados.html?vista=informes`), Mercados y noticias, Cartera, Análisis y valoración de empresas (`cartera.html?vista=companies`, módulo `company-analysis/`).
- **Patrimonio** (`patrimonio.html`): Vivienda y coste de vida, Jubilación, Impuestos (`fiscalidad.html` y `guia-*.html`), Planificación patrimonial (`temas.html?topic=planificacion-patrimonial`).
- **Familia, Salud y Bienestar** (`bienestar.html`): Cuerpo, mente y salud (`temas.html?topic=bienestar`) con cuatro subsecciones propias, en este orden: `respiracion-relajacion.html`, `movimiento-consciente.html`, `nutricion-equilibrada.html`, `descanso-limites-tiempo-propio.html` (Familia y trabajo se retiró el 03-10-2026). Cada subsección lista sus publicaciones como filas a lo ancho (`.bn-entries`); cada artículo tiene página propia (p. ej. `la-respiracion-como-el-escultor-del-cerebro.html`).
- **Academia NUVIA** (`academia.html`): Conocimientos esenciales, Cursos, Fundamentos, Activos, Interés compuesto, Glosario (vistas `?tab=…`) y `curso.html`.
- **Lecturas con Criterio** (`lecturas.html`): catálogo y fichas; conserva su diseño editorial propio (excepción expresa).

### 2.3 Recorrido y jerarquía de una página hija

`Inicio › Espacio › [Bloque] › Página › [Artículo]`. Toda página hija lleva: ruta de navegación (`.nv-breadcrumb`), un único `<h1>`, una explicación breve y, si procede, controles o navegación local. No repite las tarjetas de bienvenida ni añade una segunda portada. Los accesos antiguos (anclas, `?topic=`) se conservan con redirección o alias.

### 2.4 Cáscara común (cabecera y pie)

La navegación y el pie son **un componente único** definido en `_plantilla.html` y sincronizado a todas las páginas con `npm run shell:sync` (`npm run shell:check` verifica). Nunca se edita la cabecera o el pie en una página suelta. El menú de cada espacio lista su portada y todas sus hijas (incluidas, en Bienestar, las cuatro subsecciones). El pie muestra los cinco espacios, las herramientas, la información de confianza y los avisos legales.

### 2.5 Contenido de colaboradores

Cada colaborador figura en `colaboradores.html` (`.nv-colaborador`, con `id` propio) con su área, sin titulaciones no aportadas. Sus artículos se publican en la subsección que corresponde a cada tema. Un artículo lleva: título, firma, fecha de publicación, texto íntegro del autor (sin epígrafes añadidos), vídeo si existe (un solo reproductor, en la página de lectura), bloque «Sobre el autor» y «Notas editoriales de NUVIA» al final, separadas del texto firmado. Las introducciones de serie que no sean del autor se presentan fuera de su texto.

---

## 3. Sistema visual

### 3.1 Hojas de estilo y orden de carga

```
estilos/nuvia-tokens.css        variables (color, tipografía, espaciado, superficies, medidas)
estilos/nuvia-components.css    componentes compartidos
estilos/nuvia-pages.css         entrada que importa, en este orden:
    nuvia-pages-foundations.css → nuvia-pages-cartera.css → nuvia-pages-content.css
    → nuvia-page-entry.css → nuvia-market-reports.css
hojas de página (solo donde se usan): nuvia-subseccion.css, nuvia-bienestar.css,
    nuvia-retirement.css, nuvia-jubilacion.css, nuvia-fiscal.css, nuvia-guias-fiscales.css, nuvia-pib.css
```

Reglas: buscar antes una clase existente con la misma función; lo compartido va a `nuvia-components.css`, lo propio de una composición a su módulo o a una hoja de página con **prefijo propio** (`.bn-` Bienestar, `.jub-` Jubilación, `.viv-` Vivienda, `.tm-` Temas, `.pib-` PIB…). No se crean variables locales de color: todo sale de `nuvia-tokens.css`. `docs/nuvia-page-styles.test.mjs` protege el orden de los módulos.

### 3.2 Color (tokens)

| Uso | Token | Valor |
|---|---|---|
| Azul NUVIA (marca, texto fuerte, selección, superficies profundas) | `--nv-navy-900` / `-950` / `-800` / `-700` | `#0b2347` / `#06172f` / `#15365f` / `#284c75` |
| Azul del fundido fotográfico de portadas | `--nv-hero-photo-blue` | `#1c3a5e` |
| Verde criterio (enlaces, acento, filetes) | `--nv-green-700` (enlace) / `-800` (hover) / `-600` (filete) / `-100` (fondo suave) | `#4a5d23` / `#3f501e` / `#5f7a2c` / `#eef3df` |
| Bronce editorial | `--nv-bronze-700` (texto editorial) / `--nv-bronze-500` (solo filete/icono, nunca texto) | `#7a5c27` / `#b69152` |
| Superficies | `--nv-surface` blanco · `--nv-surface-page` nube `#f4f6f9` · `--nv-surface-technical` bruma `#e8edf3` · `--nv-surface-editorial` papel `#faf7ee` · `--nv-surface-deep` azul 900 | |
| Texto | `--nv-text` · `--nv-text-soft` · `--nv-text-muted` · `--nv-text-link` · `--nv-text-on-dark` | contrastes AA verificados |
| Líneas | `--nv-line` · `--nv-line-strong` · `--nv-line-on-dark` | |
| Cifras | `--nv-positive` `#2f6b3d` · `--nv-negative` `#9c2f2f` | **solo** para magnitudes positivas/negativas; el color nunca califica una inversión |

Acentos por espacio (`--nv-space-accent`): verde en Economía y Bienestar, bronce en Patrimonio. Crema/papel se reserva al contenido editorial (Lecturas, bloques editoriales); los tonos técnicos (bruma) a herramientas y datos.

### 3.3 Tipografía

- **Newsreader** (`--nv-font-serif`): títulos H1/H2 de página, titulares de portada, extractos y entradillas editoriales.
- **Inter** (`--nv-font-sans`): navegación, cuerpo, etiquetas, datos, botones.
- Escala: `--nv-display-lg` (portadas, clamp 44–60 px), `--nv-title-lg` 36 px (H1 de página hija; 28 px ≤ 1120 px), `--nv-title-md` 28 px, `--nv-title-sm` 22 px, `--nv-body-lg` 18, `--nv-body` 16, `--nv-body-sm` 14, `--nv-label` 12 (eyebrows en mayúsculas con tracking).
- Pesos: cuerpo 400, títulos 500, acciones 600, etiquetas 700. Interlineado de lectura 1,6–1,7.
- Fuentes autoalojadas en `estilos/fuentes/`; no se cargan fuentes externas.

### 3.4 Espaciado, medidas y relieve

- Escala de 4 px: `--nv-space-1` 4 … `-4` 16, `-6` 24, `-8` 32, `-10` 40, `-12` 48, `-16` 64, `-20` 80.
- Contenedor `--nv-container` 1240 px; margen de página `--nv-page-gutter` 48 px (28 px en tablet); cabecera fija `--nv-header-height` 88 px.
- Radios: `--nv-radius-sm` 6, `-md` 12, `-lg` 20, `-pill`. Sombras: `--nv-shadow-sm/md/lg` (azuladas, suaves).
- Botones y controles: alto mínimo 44 px; foco visible `outline: 3px solid var(--nv-green-600)`.

### 3.5 Componentes compartidos (clases)

| Pieza | Clase | Notas |
|---|---|---|
| Contenedor / sección | `.nv-container`, `.nv-section`, `.nv-section--tight/--white/--paper/--technical/--deep` | |
| Cabecera de sección | `.nv-section-heading` (eyebrow + h2 a la izquierda, párrafo a la derecha) | |
| Eyebrow | `.nv-eyebrow`, `--on-dark`, `--editorial` | raya corta + mayúsculas 12 px |
| Ruta | `.nv-breadcrumb` | |
| Botones | `.nv-btn--primary` (azul), `--accent`, `--secondary` (borde verde), `--soft`, `--text`; `.nv-btn-row` | |
| Tarjetas | `.nv-card`, `--technical`, `--editorial`, `--link`; rejilla `.nv-card-grid` (3), `--2`, `--4` | |
| Etiquetas | `.nv-tag`, `--accent`, `--editorial`, `--pending` («En preparación») | |
| Avisos | `.nv-note` (role="note"), `.nv-notice`, `.nv-disclaimer` | aviso de divulgación/limitaciones |
| Prosa | `.nv-prose`, `.nv-reading` | ancho de lectura ≈ 76ch |
| Contenido externo | `.nv-external-content` + `data-nuvia-external-frame` + `data-nuvia-external-load` + `data-nuvia-external-status` | ver §5 |
| Colaborador | `.nv-colaborador` (avatar de iniciales, rol, bio, área) | |
| Accesibilidad | `.nv-skip-link`, `.nv-visually-hidden`, `aria-labelledby` en secciones | |

### 3.6 Plantillas de página (arquetipos)

**A · Home global** (`index.html`): hero fotográfico de referencia, presentación y cinco bloques hacia los espacios. Es la vara de medir.

**B · Home de espacio** (`body.nuvia-design-lab.nv-home-polish.nv-space-page.nv-space-page--<espacio>`):
1. Ruta `.nv-space-trail`.
2. Hero `.home26-plate` con panorámica propia (`src/assets/home/<espacio>-panoramica-*.webp`), eyebrow, H1 y párrafo de propósito; variantes `--light`, `--reverse`, `--bleed` según espacio.
3. Entradilla editorial `.nv-space-intro > .nv-space-insight` («Una mirada de conjunto»): banda abierta sin caja, frase en Newsreader a la izquierda y tres párrafos separados por filetes, con una raya corta de color (verde, bronce, azul). Es texto editorial, no tarjetas.
4. Mapa de accesos `.nv-space-resources` con tarjetas con fotografía `.nv-space-tool-card.nv-space-tool-card--photo` (banda de imagen 2:1 decorativa, símbolo `.nv-space-symbol`, badge, H3, párrafo, acción). Tres por fila en Economía; 2 × 2 (`.nv-card-grid--2`) en Patrimonio y Bienestar.
5. `.nv-note` con el aviso del espacio.
6. `.nv-space-next` «Sigue explorando NUVIA».

**C · Página hija / subsección** (`.nv-hero.nv-hero--institutional.nv-entry.nv-sub-hero`):
1. Ruta completa.
2. Cabecera clara y compacta (`nuvia-subseccion.css`): eyebrow, H1 36 px, lead y etiquetas a la izquierda; foto enmarcada a la derecha (`.nv-sub-hero__media > img.nv-sub-hero__img`, radio grande, sombra y filete bronce en la esquina). En tablet la foto baja bajo el texto.
3. Cuerpo: `.nv-section-heading` + contenido (catálogo de tarjetas, herramienta, guía).
4. Pie local: enlaces a páginas hermanas y regreso al nivel superior.

**D · Artículo / lectura** (`.nv-hero--institutional.nv-entry` sin foto): eyebrow «Subsección · Tipo», H1, etiquetas (tipo, duración, «Con vídeo»); columna de lectura ≈ 76ch con introducción (si la hay, fuera del texto firmado), `<article>` con firma y fecha, texto íntegro, reproductor único con portada local, «Sobre el autor» y notas editoriales; enlaces de regreso.

**E · Institucional** (Colaboradores, Qué es NUVIA, Metodología, Independencia): apertura contenida `.nv-hero--institutional.nv-entry` y regreso a Inicio.

**F · Guías y curso** (`guia-*.html`, `curso.html`): mantienen su composición propia (estilo aprobado en Jubilación); no llevan `nv-sub-hero`.

### 3.7 Imágenes

- Formato **WebP** en `src/assets/home/` (tarjetas 1200 × 600, cabeceras de subsección 1500 × 900, panorámicas ≈ 2172 × 724, portadas de vídeo 1280 × 720), calidad 82. Originales (JPG/PNG) en `output/imagegen/`, fuera de la publicación. Nombre: `<espacio>-<uso>-<tema>-<AAAAMMDD>.webp`.
- **Ninguna imagen se repite entre páginas**; pueden repetirse escenarios (mar, campo), no la misma foto. Cada imagen va acorde al tema de su página.
- Fotografía realista, luz natural, tonos cálidos y neutros, estética mediterránea y contemporánea; personas de aspecto natural, no reconocibles; sin texto, rótulos, logotipos ni marcas legibles (desenfocar si aparecen). Jubilación en etapa activa, nunca «muy de viejo».
- Las imágenes decorativas llevan `alt=""` y `aria-hidden="true"`; las informativas, `alt` descriptivo. `loading="lazy"` salvo la del hero (`fetchpriority="high"`). Siempre `width`/`height`.
- Las subsecciones no usan el hero a sangre de las portadas: foto enmarcada en cabecera compacta.

---

## 4. Contenido y tono

- Español de España, trato de tú, frases claras, sin jerga innecesaria. Títulos en minúscula tipográfica (solo mayúscula inicial). Eyebrows en mayúsculas.
- Se explica y se contextualiza; no se promete, no se prescribe, no se personaliza. Cada herramienta muestra fuentes, fechas, supuestos y límites.
- Avisos obligatorios: contenido educativo e informativo; no asesoramiento financiero, fiscal, jurídico ni sanitario personalizado. En Bienestar, además, sin diagnóstico ni prescripción.
- Lo que no existe se dice tal cual («En preparación»); no se anuncian artículos, guías o herramientas inexistentes.
- Metadatos por página: `<title>` «NUVIA · Nombre», `description`, `canonical`, bloque social `NUVIA SOCIAL META` (generado por `scripts/apply-social-metadata.mjs`), favicon de marca. El sitemap y las exclusiones se verifican en `docs/nuvia-metadata.test.mjs`.

---

## 5. Comportamiento y código

- HTML estático por página + `support.js` + `nuvia-site-unified.js` (navegación activa, pestañas accesibles, carga de contenido externo). React 18 autoalojado en `js/vendor/` solo para los módulos que lo usan.
- **Vídeos y widgets externos:** marcador `.nv-external-content` con portada local, eyebrow «Vídeo · YouTube», texto «El vídeo se conecta con YouTube solo cuando eliges reproducirlo», botón `data-nuvia-external-load` y enlace «Abrir en YouTube ↗»; el `<iframe>` (`youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`) solo se crea al pulsar. Los vídeos de YouTube deben estar en **No listado** o Público, nunca en Privado.
- Sin formularios ni recogida de datos de lectores en páginas de contenido. Sin escrituras en Firebase/backend salvo orden expresa.
- Cálculos financieros: pueden mostrarse métodos académicos (Sharpe, mínima volatilidad, frontera eficiente) sin convertirlos en recomendación ni veredicto.
- Accesibilidad: un `<h1>` por página, jerarquía de encabezados, `aria-label`/`aria-labelledby` en nav y secciones, foco visible, contraste AA (4,5:1 texto; 3:1 grande), controles ≥ 44 px, `prefers-reduced-motion` respetado.

---

## 6. Flujo de trabajo y validación obligatoria

1. Leer `AGENTS.md`, el marco regulatorio y esta guía. Buscar la ficha previa del tema en `docs/`.
2. Trabajar solo en la carpeta oficial. Reutilizar clases y tokens; nuevo CSS con prefijo propio y solo tokens.
3. Si se toca cabecera o pie: editar `_plantilla.html` y ejecutar `npm run shell:sync`.
4. Página nueva: añadirla a `PRESUPUESTO_INLINE` (`scripts/check-consistencia.mjs`, techo 0), a la lista y contratos de `scripts/check-render.mjs`, a las pruebas afectadas en `docs/*.test.mjs`, al menú de su espacio y al sitemap.
5. Validar: `npm run validate` (cáscara, paridad, sitio estático, consistencia, lenguaje, estilos, navegación, metadatos, confianza, contenido externo, superficies, tarjetas, avisos, jerarquía, entradas de cada espacio, pruebas financieras) y `npm run auditar` / `auditar:completo` (render a 1440…768 px con Chromium de Playwright: contraste, escala, desbordes, estructura, foco, estados, contenido). `npm run build` compila `dist/`.
6. Documentar en `docs/<TEMA>_<AAAAMMDD>.md`: orden del fundador, cambios, prueba §12, clasificación interna, validación.
7. Commit descriptivo en `main` y comprobación de que el flujo de GitHub Actions termina en verde y la web sirve el cambio.

---

## 7. Lo que no se hace

- No se crean páginas, bloqueos, funciones, formularios, bases de datos ni integraciones sin orden del fundador.
- No se usan colores literales, estilos inline, fuentes externas, iframes al cargar, ni imágenes repetidas.
- No se cambia la Home, su hero ni la cáscara común para «acomodar» una página: la página se adapta a ellos.
- No se rediseña Lecturas con Criterio con el patrón de los demás espacios.
- No se atribuyen títulos, autorías, avales ni fuentes no verificadas; no se mezclan las palabras del autor con las notas editoriales.
- No se publica desde Firebase ni se toca `company-analysis` fuera de su copia local.
