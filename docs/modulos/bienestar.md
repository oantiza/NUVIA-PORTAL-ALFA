# Módulo · Familia, Salud y Bienestar

**Qué es:** la portada del espacio (que es a la vez el índice de Cuerpo, mente y salud), sus cuatro subsecciones y los artículos y vídeos de colaboradores. Es un módulo **editorial**: su trabajo habitual es publicar una pieza nueva en la subsección que le corresponde.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | §1 (en especial la regla 8: contenido sanitario), §2.2 (mapa de Bienestar), **§2.5 (contenido de colaboradores)**, §3.6 arquetipos B, C y **D (artículo)**, §5 (vídeos externos). |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | §5 (lenguaje), **§9 (colaboradores, directorios y contactos)**, §11 (datos personales), §12. |
| `docs/BIENESTAR_REDISENO_20261002.md` | Diseño vigente de portada, subsecciones y artículo. |
| `docs/FICHA_RESPIRACION_20261002.md` | Modelo de publicación de un artículo con vídeo; sirve de plantilla para los siguientes. |
| `docs/plantillas/ARTICULO_BIENESTAR.md` | **Plantilla editorial mínima**: qué copiar y qué cambiar para publicar un artículo nuevo (modelo vivo: `que-es-meditar.html`). |

Para editar un artículo existente, seguir las lecturas de esta ficha. Si se crea una página nueva, leer también la ficha del Núcleo, la arquitectura y la guía maestra completas, conforme a la capa 2 de `AGENTS.md`. Los cambios materiales en colaboradores u otros supuestos de la capa 2 requieren además el marco completo.

## Archivos de este módulo

**Páginas:** `bienestar.html`; subsecciones `respiracion-relajacion.html`, `movimiento-consciente.html`, `nutricion-equilibrada.html`, `descanso-limites-tiempo-propio.html`; artículos (`la-respiracion-como-el-escultor-del-cerebro.html`, `que-es-meditar.html`). La antigua `temas.html?topic=bienestar` redirige a la portada.

**Colaboradores:** cada autor figura en `colaboradores.html` (`.nv-colaborador`, `id` propio) con su área, sin titulaciones no aportadas. `colaboradores.html` pertenece al Núcleo; aquí solo se añade o edita la ficha del colaborador.

**Estilos propios:** `estilos/nuvia-bienestar.css` (`.bn-`), `estilos/nuvia-subseccion.css` (cabecera compacta).

**Imágenes:** `src/assets/home/bienestar-*.webp`; portadas de vídeo 1280 × 720.

**Controles y pruebas:** `scripts/check-wellbeing-entry.mjs`, `docs/nuvia-wellbeing-entry.test.mjs`, `docs/nuvia-navigation.test.mjs` y `docs/nuvia-metadata.test.mjs` (registro de páginas), `docs/nuvia-external-content.test.mjs` (vídeos cerrados hasta pulsar).

## Comprobación local

```powershell
npm run validate:bienestar
```
Incluye entrada de Bienestar, vídeos cerrados hasta pulsar, metadatos, navegación, jerarquía y consistencia (sin estilos inline).

## Publicar un artículo nuevo (procedimiento)

1. Página propia del artículo con el arquetipo D: eyebrow «Subsección · Tipo», H1, etiquetas, texto íntegro del autor sin epígrafes añadidos, firma y fecha, un solo reproductor con portada local (si hay vídeo), «Sobre el autor» y «Notas editoriales de NUVIA» separadas del texto firmado.
2. Fila de entrada (`.bn-entries`) en su subsección. Sin vídeo en la primera página de la subsección.
3. Ficha del autor en `colaboradores.html` si es nuevo.
4. Alta de la página en `scripts/paginas.mjs` (+ `npm run sitemap:sync`) y contrato de render en `CONTRATOS` de `scripts/check-render.mjs`; actualizar las pruebas de entrada afectadas. Si es una subsección nueva, además menú del espacio y prueba de navegación (ver `docs/modulos/nucleo.md`, «Al crear una página nueva»).
5. Vídeo de YouTube en **No listado** o Público, nunca Privado; `youtube-nocookie.com` y carga solo al pulsar.
6. Ficha en `docs/<TEMA>_<AAAAMMDD>.md` con la prueba §12 y la validación.

## Decisiones vigentes del fundador

- Cuerpo, mente y salud tiene cuatro temas, en este orden: Respiración y relajación · Movimiento consciente · Nutrición equilibrada · Descanso, límites y tiempo propio. «Familia y trabajo» se retiró (03-10-2026).
- Las publicaciones de cada subsección van como filas a lo ancho y de poca altura, no como tarjetas.
- En la primera página de cada subsección no hay vídeos; solo al entrar en cada artículo.
- La portada conserva su banda de foto alta y las cuatro tarjetas con encuadre fijado; incluye «Fuentes de consulta y límites» (`.bn-sources`).
- Divulgación general: nunca diagnóstico, protocolo terapéutico, consejo individual ni titulaciones no aportadas. Aviso visible en el espacio.
- Colaboradora de bienestar: Isabel Florido Mayor (ficha y foto en `colaboradores.html`). Ensayos publicados en Respiración y relajación, en orden de serie: «La respiración como el escultor del cerebro» (02-10-2026) y «¿Qué es meditar?» (13-10-2026), ambos con vídeo y enlazados entre sí (anterior / siguiente).

## Historial de este módulo (contexto, no normativa)

`ENTREGA_5A_3_ENTRADA_FAMILIA_BIENESTAR_20260902`, `FICHA_REGULATORIA_VARIANTES_BANNERS_HOME` (variante de Bienestar), actualización de Bienestar del 02-10-2026 recogida al final de `ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906`.
