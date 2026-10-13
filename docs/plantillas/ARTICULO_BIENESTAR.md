# Plantilla editorial mínima · artículo de Familia, Salud y Bienestar

Paso 6 del plan de organización por módulos (12-10-2026). Se estrenó con «¿Qué es meditar?»
(13-10-2026). **Modelo vivo:** copiar `que-es-meditar.html` y sustituir lo marcado abajo; no
partir de cero.

## 1. Página del artículo (`<slug>.html`, arquetipo D)

Copiar `que-es-meditar.html` y cambiar, en este orden:

1. `<head>`: `description`, `canonical`, `og:*` y `twitter:*` (url, título, descripción) y `<title>NUVIA · <Título></title>`.
2. Ruta: `Inicio › Familia, Salud y Bienestar › <Subsección> › <Título>`.
3. Cabecera: eyebrow con la subsección; `<h1>`; `bn-article__meta` «Ensayo|Artículo · N min de lectura · Con vídeo».
4. `<article class="tm-breathing-essay bn-essay">`: firma y `<time datetime="AAAA-MM-DD">` (fecha de publicación); `bn-essay__lead` solo si el autor aporta entradilla o cita; cuerpo íntegro, un `<p>` por párrafo, sin epígrafes añadidos, con los énfasis del original.
5. Vídeo (si hay): ID en `data-src` (`youtube-nocookie.com/embed/<ID>?autoplay=1&rel=0`) y en «Abrir en YouTube»; `data-title`; portada local 1280 × 720 en `src/assets/home/bienestar-video-<tema>-portada-AAAAMMDD.webp`. Comprobar antes que el vídeo no está en Privado.
6. «Sobre el autor»: foto o iniciales y bio igual que en `colaboradores.html`.
7. «Notas editoriales de NUVIA»: qué es la pieza (reflexión, divulgación…), fuente complementaria verificada y sin aval, aviso sanitario.
8. `.bn-series`: enlaces «Ensayo anterior / siguiente» con las piezas vecinas de la misma subsección (y el enlace recíproco en la vecina).

## 2. Fila en la subsección

Añadir un `<li class="bn-entry">` en `.bn-entries` en el lugar que indique el fundador (por defecto, orden de la serie) y mover `bn-entry--latest` a la pieza nueva. Sin reproductor en la subsección. Actualizar la etiqueta de la cabecera («N ensayos con vídeo») y, si cambia, la frase de la tarjeta en `bienestar.html`.

## 3. Registro, contratos y pruebas

- `scripts/paginas.mjs`: alta con `modulo: 'bienestar'`, `padre: '<subsección>.html'`, `tipo: 'editorial'`, misma `excepcion`, `publica: true`; después `npm run sitemap:sync`.
- `scripts/check-render.mjs` → `CONTRATOS`: `[['h1',1],['.tm-breathing-essay',1],['.bn-player',1],['.bn-author',1],['.bn-series__link',N]]`; subir el recuento de `.bn-entry` de la subsección.
- `docs/nuvia-wellbeing-entry.test.mjs`: bloque del artículo (H1, firma, primer y último párrafo, recuento de párrafos, vídeo, notas, orden en la subsección).

## 4. Comprobar y documentar

`npm run validate:bienestar` → `node scripts/check-render.mjs . 1440,1024,768 "<slug>.html,<subsección>.html,bienestar.html"` → ficha `docs/<TEMA>_AAAAMMDD.md` (orden, cambios, notas editoriales, §12, validación) y línea en `docs/INDICE.md`.
