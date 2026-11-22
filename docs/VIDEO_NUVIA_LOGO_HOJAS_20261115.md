# NUVIA · del logo a los cuatro aros

## Orden y alcance

El fundador pide: «Quiero que el vídeo empiece con el logotipo de Nubia Family Wealth en 3D, bonito, animado, brillante, que destaque mucho. Que de ese logotipo se desprendan las tres hojas de arriba hacia el elemento nuevo que hemos creado. Y de esas tres hojas partan los cuatro círculos. Y esos cuatro círculos, y a partir de ahí el vídeo sigue igual. Ajusta el elemento nuevo que hemos creado para que parezca que proviene de esas tres hojas. Haz una transición adecuada».

Añade: «Utiliza los elementos que te creas necesarios, Blender, también si resolve Studio, etcétera, todos los que disponemos».

La edición parte del minuto v6 con locución Charon. Se mantiene su carácter de revisión local sin publicar. El cambio afecta a la apertura y al nacimiento de los aros, hasta 00:19.60. Se conservan los rótulos, sus tiempos, los cuatro enfoques, los espacios comunes, la unión final con la imagen exacta de portada y la pista de voz ya aprobada. No cambia la página ni se sustituyen medios publicados.

## Producción

Fuentes en `output/video-que-es-nuvia-20261112/aros-en-movimiento/revision-portada/version-60s-v7/`.

Se usa Blender 5.2 y Cycles con la GPU local para geometría, materiales, iluminación y animación. La conexión del complemento de Blender no estaba activa; se utiliza el ejecutable instalado en segundo plano. FFmpeg realiza el montaje y copia la pista AAC existente sin volver a sintetizar ni recodificar la voz. No es necesario abrir o modificar proyectos de DaVinci Resolve para esta edición.

El logo parte de los veinte trazados oficiales de `src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-horizontal-lineal-v0402.svg`. Las hojas son exactamente los trazados 2, 3 y 4; no se confunden con las letras verdes del descriptor Family Wealth. La firma se extruye, bisela y anima con un reflejo móvil. Las hojas parten de sus posiciones originales, se desprenden y crecen hacia el área derecha. Sus superficies se curvan para formar la nueva escultura, manteniendo una geometría continua mediante claves de forma.

Durante la definición de NUVIA una hoja se desdobla: de las tres hojas iniciales se obtienen cuatro superficies. Cambian gradualmente a los materiales azul, latón, salvia y hielo de los cuatro enfoques y se abren como aros. El azul enlaza con la trayectoria original y los otros tres se retiran en profundidad antes de las presentaciones existentes. El montaje delega directamente en la composición v5 desde 00:19.60 y usa el audio de v6.

## Prueba regulatoria §12

Se aplica la clasificación informativa verde de la película institucional. La necesidad es comunicar visualmente el origen común de las cuatro áreas; las entradas son la marca propia, el montaje existente y el guion aprobado. La transformación es únicamente audiovisual. No cambian las 115 palabras de presentación ni la definición canónica de NUVIA. No intervienen instrumentos, emisores, datos de mercado, cálculos financieros, circunstancias personales, recomendaciones, idoneidad, llamadas a operar, contratación, patrocinio o derivación comercial. Los colores identifican áreas, no valoraciones financieras. La voz sintética existente se copia sin nueva generación; no se recogen datos personales ni se modifican servicios o credenciales.

Los controles comprueban encuadres, área de texto, continuidad, identidad del audio, duración, decodificación y preservación de la composición posterior. Las comprobaciones se registran con su resultado real; no se modifica ninguna prueba para aceptar la edición.

## Estado

Las pruebas de imagen y encuadre de la apertura están terminadas. El control evalúa los 490 fotogramas y realiza 2.957 comprobaciones de geometría: cero recortes, cero invasiones del texto con margen de 36 px y cero cuerpos detrás de la cámara. Se ajustó la trayectoria y se retrasó el crecimiento de las hojas para que pasaran por encima del primer texto. El relieve de las hojas se refinó para evitar un reflejo pinzado en su centro. La transformación mundial del aro azul en el relevo coincide con la del original, con diferencia numérica máxima de 1,19 × 10⁻⁷.

Se inspeccionan visualmente 16 pruebas de la apertura y muestras del montaje posterior. Las 42 comparaciones de fotogramas desde 00:19.60 dan identidad exacta de píxeles antes de comprimir; también se comparan 16 capas editoriales. Los rótulos y sus tiempos permanecen idénticos.

`npm run validate:nucleo` y `npm run validate`, incluido `auditar`, terminan con código 0. Las 51 rutas a 1440 px pasan la revisión y los reproductores funcionan a 1440, 1024 y 768 px. Un primer intento aislado no accedió al servidor HTTP local; la repetición autorizada con el Chromium instalado pasó sin cambiar las pruebas. Registros en `validate-nucleo.log`, `validate.log` y `validacion-web.json` de v7.

Se completan los 490 fotogramas Full HD de la apertura con Cycles, 48 muestras, reducción de ruido OptiX y desenfoque de movimiento. El resto procede de sus composiciones anteriores.

**Entrega terminada:** `NUVIA-60s-Logo-Hojas-Charon-FullHD.mp4`, en la carpeta v7, 26.694.447 bytes. El archivo contiene exactamente 60,000000 segundos y 1.500 fotogramas H.264 de 1920 × 1080 a 25 fps, más una pista AAC estéreo de 48 kHz. No hay subtítulos. La decodificación completa termina sin errores. Se revisan además la firma inicial, los cuatro aros y el cierre extraídos del MP4 definitivo.

La comprobación independiente confirma hash de audio y tiempos de los 2.814 paquetes AAC idénticos a v6; la locución y su sincronización no cambian. Sonoridad de −16,06 LUFS, pico verdadero de −1,50 dBTP, cero saturación y silencio digital exacto en 00:00–00:03 y 00:58–01:00. Evidencia: `qa/validacion-final-independiente.json`; controles de montaje en `validacion-video.json`.

La pieza queda local y lista para revisión. Sin commit, push, despliegue ni escrituras en Firebase.

## Firma más prolongada y azul profundo · v8

**Orden posterior:** «Dale un par de segundos más a Nubia Family Wealth que destaque más la entrada y haz el azul más oscuro, el azul brillante más oscuro del logo de Nubia Family Wealth».

La firma inicial pasa de tres a cinco segundos. Se amplía su movimiento de relieve y reflejo, sin insertar un fotograma congelado. La película pasa a 62 segundos para conservar íntegro el ritmo posterior: texto, voz y animación restante se desplazan exactamente dos segundos. Se informa de esta duración durante el trabajo. La salida de las hojas conserva su animación, retrasada conjuntamente con la firma.

Solo cambia el material azul de las letras del logo inicial: base sRGB `#061A38`, componente metálico 0,94, rugosidad 0,19 y recubrimiento 0,09. El recubrimiento blanco anterior era 0,42 y aclaraba las caras; al reducirlo, los reflejos conservan más azul sin eliminar el brillo ni los biseles. El verde de las hojas y de Family Wealth, el fondo, los rótulos, los aros y la firma del cierre permanecen como en v7.

Fuentes en `output/video-que-es-nuvia-20261112/aros-en-movimiento/revision-portada/version-60s-v8/`. La prueba §12 sigue siendo informativa verde: modificación exclusiva de duración de marca y material 3D, sin cambio semántico, financiero, funcional o de datos. No se vuelve a generar la voz. La entrega es exclusivamente local y sin publicación.

Las siete pruebas de la nueva firma confirman un azul visualmente más oscuro con brillo en el relieve. El compositor pasa 56 comparaciones de continuidad con v7, desplazadas 50 fotogramas; mantiene las 115 palabras y retrasa el primer rótulo hasta 00:05. Dos intentos de render dentro del aislamiento finalizaron por una excepción de Blender en `ntdll.dll`; la ejecución local autorizada reanuda los fotogramas guardados sin modificar la escena ni reducir calidad. Se conservan los registros de ambos intentos y de la reanudación.

**Entrega v8 verificada:** `NUVIA-62s-Logo-Azul-Profundo-Charon-FullHD.mp4`, 27.356.339 bytes, 62,000000 segundos y 1.550 fotogramas Full HD a 25 fps. Se inspecciona también el logo a 00:03.40 extraído del MP4: sigue presente con las tres hojas unidas y el nuevo azul oscuro.

La comprobación independiente confirma los 2.814 paquetes AAC idénticos a v7, con PTS y DTS desplazados exactamente 96.000 muestras (dos segundos a 48 kHz). El audio PCM decodificado y alineado es idéntico bit a bit al anterior después del desplazamiento. Silencio digital de 00:00 a 00:05 y de 01:00 a 01:02, −16,05 LUFS, −1,50 dBTP y cero saturación. Decodificación completa correcta y sin subtítulos. Evidencia en `qa/validacion-final-independiente.json`.

`validate:nucleo` y `validate`, incluido `auditar`, finalizan con código 0: 51 rutas a 1440 px y reproductores a 1440, 1024 y 768 px correctos. No se modifica la web ni se hace commit, push, despliegue o escritura en Firebase.
