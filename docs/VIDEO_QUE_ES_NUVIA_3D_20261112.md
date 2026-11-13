# Película 3D · Qué es NUVIA · 12-11-2026

**Orden posterior · 13-11-2026:** el fundador indica «Súbelo y publica». Autoriza publicar esta pieza y su integración mediante el flujo oficial de GitHub Pages. El estado local que documenta el resto de esta acta corresponde a la entrega previa; la ejecución y comprobación pública se registran en [el acta de publicación](PUBLICACION_VIDEO_QUE_ES_NUVIA_20261113.md).

## Orden y alcance

El fundador solicita un vídeo cinemático en 3D para «Qué es NUVIA», con elementos modernos relacionados con los de la portada, que explique lo que describe la página. Autoriza utilizar Blender, DaVinci Resolve y las herramientas disponibles para conseguir una pieza de calidad. En la consulta de sonido elige: **«Voz en español, música y textos breves»**. Posteriormente indica **«go»**, manteniendo el encargo.

Esta orden autoriza crear e integrar la pieza localmente. No se realiza commit, push, publicación ni escritura en Firebase. Las autorizaciones anteriores de publicación corresponden a versiones ya publicadas, no a esta nueva película.

## Pieza

**Todo está conectado.** Película horizontal de 58 segundos, 1920 × 1080, 25 fps. Escultura original de cuatro aros anchos entrelazados, con materiales azul profundo, champagne cepillado, salvia y porcelana hielo. Nueve planos con cámara 3D animada, iluminación de estudio y profundidad de campo. Las cámaras pasan del detalle al conjunto; las mallas no se atraviesan para fingir un ensamblaje.

Las cuatro webs y sus descripciones siguen los textos existentes de la portada. Lecturas con Criterio y Colaboradores se presentan como espacios comunes. Cierra con la firma oficial y el principio «NUVIA. Informa, explica y calcula. Tú comprendes y decides». No cambia la definición canónica de NUVIA.

Las cartelas utilizan Newsreader e Inter de los recursos del portal. El logo procede de `src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-horizontal-lineal-v0402.svg`; no se redibuja, deforma ni sustituye. La música y los efectos son una composición y síntesis originales, sin muestras de terceros. La voz sintética en español no imita a ninguna persona.

## Implementación

- `que-es-nuvia.html`: añade un bloque después del hero, con vídeo nativo, controles, póster, subtítulos en español, acceso al archivo y transcripción desplegable. Sin autoplay; `preload="none"`.
- Los atributos booleanos nuevos llevan valor explícito (`controls="controls"`, `playsinline="playsinline"`, `default="default"`) porque el compilador de plantillas existente transforma los atributos vacíos en cadenas vacías y React los descarta. La prueba en navegador comprobó el estado DOM y el funcionamiento real. No se modifica el compilador compartido.
- `estilos/ecosistema/interiores-nuvia.css`: reglas limitadas a `.about-film` y sus hijos. No modifica cabeceras, pies, otras secciones o páginas. El texto alternativo del reproductor dispone de contraste claro sobre fondo oscuro.
- `src/assets/video/que-es-nuvia-20261112.mp4`, `.webp` y `.vtt`: únicos medios que utiliza la web. La construcción ya recoge los recursos referenciados y no necesita un mecanismo nuevo.
- `scripts/serve-local.mjs`: añade MIME `text/vtt`, cabeceras de longitud y soporte de rangos HTTP/HEAD para poder buscar momentos del vídeo en la revisión local.
- `output/video-que-es-nuvia-20261112/`: escena Blender, fuentes, fotogramas, capas tipográficas, voz, música, efectos, subtítulos, montaje editable, exportaciones y pruebas. Material de producción fuera de la publicación.

No se añaden dependencias de ejecución al portal ni reproductores o cuentas externos. El visitante reproduce archivos locales al sitio. Se conservan todas las calculadoras, enlaces, herramientas y contenidos existentes.

## Herramientas y trazabilidad

Blender 5.2.4 LTS, Cycles y OptiX en la GPU local; DaVinci Resolve Studio 21.2 para revisión, transcripción de control y montaje; Python/Pillow/fontTools para cartelas, NumPy/SciPy para la composición original y FFmpeg para el audio y las copias de distribución. No se introduce Remotion en el proyecto.

La locución utiliza `es-ES-AlvaroNeural` mediante el servicio de Microsoft Edge y el cliente edge-tts 7.3.1, instalado solo en la carpeta de producción. Solo se envía el texto público de presentación. Los audios generados se conservan localmente; la reproducción del sitio no depende de este servicio. Un intento inicial con Higgsfield devolvió falta de créditos y no generó música; la banda sonora final se produjo localmente.

La transcripción automática se usa como comprobación adicional, con revisión de discrepancias: «Nubia» y «NUVIA» son homófonos en español. El cierre se volvió a generar con una pausa tras la marca para mejorar la separación de «Informa». Las medidas de audio y la transcripción automática no se presentan como escucha humana.

## Prueba regulatoria §12

**Finalidad:** presentación institucional educativa. **Entradas:** definición, textos de las cuatro webs, espacios comunes y recursos de marca ya aprobados. **Transformación:** guion, escultura 3D, montaje, síntesis de voz y música. **Salida:** vídeo informativo, subtítulos y transcripción, idénticos para cualquier visitante.

No utiliza datos de mercado, instrumentos concretos, rentabilidades, perfiles individuales, datos personales o casos reales. No recomienda productos, selecciona inversiones, juzga idoneidad ni llama a operar. No promete resultados financieros o sanitarios. No incorpora patrocinios, afiliación, derivación comercial, formularios, registros ni nuevas escrituras o integraciones de datos. Mantiene la separación institucional existente.

La IA se limita a producción de voz y comprobaciones del material público; no se incorpora una función de IA al portal. Clasificación interna de esta pieza institucional: informativa, sin personalización. No altera la clasificación ni las puertas de control de las herramientas financieras existentes.

## Validación

Producción terminada e integrada localmente. Validaciones completas correctas, sin publicar.

- Conservación exacta del HTML anterior tras descontar el nuevo bloque: comprobada con `verify_sources.py`.
- Auditoría pintada de «Qué es NUVIA» a 1440, 1024 y 768 px: correcta tras ajustar el contraste del texto alternativo. Cero fallos de contraste, tipografía, estructura, superficies, desborde, cabecera, interacción o consola.
- Servidor local: rangos iniciales y finales responden 206 con longitud correcta; rangos inválidos responden 416; subtítulos con MIME `text/vtt`.
- Render: 1.450 fotogramas reales a 1920 × 1080, 25 fps, sin fotogramas ausentes ni negros. Integridad y metadatos registrados en `output/video-que-es-nuvia-20261112/qa/`. Cuatro aros comprobados por pares sin intersecciones de superficies y nueve cámaras animadas.
- Mezcla: 58 s, 48 kHz, estéreo, PCM 24 bits; −16,09 LUFS y −1 dBTP, sin recortes. Medición en `audio/mix-analysis.json`. Subtítulos con 17 entradas, sin solapamientos, con cortes semánticos, hasta dos líneas y un máximo de 37 caracteres por línea. Transcripción y subtítulos coinciden con el guion narrado.
- Máster H.264 de 18.989.345 bytes y copia web H.264 de 11.414.443 bytes, ambas de 58 s con audio AAC estéreo. Decodificación completa de la copia web correcta.
- `npm run validate:nucleo`: correcto. `npm run build`: correcto, incluyendo `npm run validate`, `npm run auditar`, construcción estática y controles posteriores de `dist/`. No se relajan ni omiten pruebas.
- Prueba específica en Chromium con Playwright, tanto en fuente como en `dist/`, a 1440, 1024 y 768 px: reproducción y pausa por teclado, eventos táctiles en tablet, decodificación de audio, 17 subtítulos activos, búsqueda temporal a 40 y 55 s, transcripción accesible por teclado, ausencia de desbordes horizontales, cero errores JavaScript y cero errores HTTP propios. Es emulación de tablet en navegador, no una prueba en hardware físico.
- Copias de medios en `dist/` idénticas a las de fuente. Resultados: `qa/validation-summary.json`, `qa/results.json`, `qa/build.log` y `qa/film-browser.log` dentro de la carpeta de producción. Capturas de póster, espacios comunes y cierre conservadas para los tres anchos.
- Montaje final de Resolve: 1.450 fotogramas, nueve planos contiguos sin huecos, cartelas con alfa y mezcla final activa; pistas de voz, música y efectos separadas disponibles como referencias desactivadas para evitar audio duplicado. Proyecto y timeline exportados correctamente.

## Entrega local

Carpeta `output/video-que-es-nuvia-20261112/`:

- `NUVIA-Todo-esta-conectado-1080p.mp4`: película completa, máster de revisión.
- `que-es-nuvia-web.mp4`: copia optimizada integrada en la web.
- `nuvia-film.blend`: escena editable.
- `NUVIA-Todo-esta-conectado.drp` y `.drt`: proyecto y timeline de DaVinci Resolve.
- `README-PRODUCCION.md`: fuentes, procedimiento y trazabilidad.

El resto del HTML anterior se conserva exactamente descontando el bloque añadido. Cabeceras, navegación, contenidos, calculadoras y funcionalidades preexistentes no se han modificado. No se realiza commit, push, despliegue ni escritura en Firebase.
