# El precio del dinero · Producción audiovisual v04 · 22-10-2026

## Orden del fundador

Continuar la creación del vídeo con Blender, Cavalry y DaVinci Resolve; incorporar imágenes generadas porque la versión anterior resultaba visualmente pobre. Leer `CANON_VISUAL_NUVIA_ACADEMY_20261022.md`. Órdenes posteriores: «el presentador olvidalo», «usa solo los [objetos] que consideres necesarios», duración no fija. Tras «para», el fundador reanudó el encargo con «sigue». La locución la añadirá él.

## Alcance y cambios

Producción local en `output/produccion/el-precio-del-dinero-20261021/video-v04/`. Se conservan la v03 y sus fuentes. No se cambia el producto web, sus rutas, dependencias ni datos; no hay commit, despliegue ni escrituras en Firebase.

El nuevo montaje tiene 520 segundos, 80 planos de 5–8 segundos y 20 escenas. Mantiene la locución de 1.234 palabras. Se generan 12 imágenes cinematográficas y se obtienen 31 planos mediante acercamientos, alejamientos y desplazamientos sobre ellas. El edificio institucional es una ilustración ficticia, no una reproducción documental del BCE.

Se producen 49 composiciones nativas de Cavalry 1.1 con el papel de marca, NUVIA Inter y Fraunces, paleta del canon, cabecera, progreso y entradas animadas. Los 260 píxeles inferiores quedan reservados para subtítulos. Las barras y trazos entran por deslizamiento conforme a las limitaciones verificadas de Cavalry 1.1.

Blender 5.2.2 renderiza dos objetos animados con transparencia: reloj y monedas. Se utilizan en cuatro planos, con entrada gradual y posición a la derecha. La revisión visual desplazó los objetos para eliminar un solape entre las monedas y «Más euros».

Resolve Studio 21.1.1 monta y exporta ambas películas, limpia y subtitulada. A1 queda vacía para la locución; A2 contiene efectos originales sincronizados con cortes y revelados; A3 contiene música instrumental ajustada a 520 segundos. Se crean 134 bloques Text+ con palabras destacadas en terracota, una banda clara de lectura y movimiento breve de entrada. El SRT conserva tiempos provisionales y el TXT líneas de hasta 45 caracteres.

Se resuelve un problema de persistencia de Fusion: las composiciones creadas solo con `AddFusionComp` se veían en el editor pero no quedaban aplicadas al montaje guardado. Se confirma cada una exportando e importando su `.comp`, se vuelve a abrir el proyecto y se comprueba una exportación corta antes de renderizar las películas completas.

## Prueba §12

Se conserva la evaluación de educación financiera general de `VIDEO_PRECIO_DINERO_GUION_STORYBOARD_20261021.md`: misma locución y mismos ejemplos hipotéticos. 1.000 × 1,05 = 1.050; 100 × 1,05 × 1,02 = 107,10; (1,03 / 1,05 − 1) ≈ −1,90 %. Se distinguen el objetivo del BCE y el dato observado, el cálculo exacto y la resta aproximada. Los esquemas sin estadísticas se presentan como ilustrativos.

La ampliación del uso de IA afecta a las imágenes de apoyo; no introduce datos, testimonios, personas identificables, emisores invertibles ni recomendaciones. No se incorporan personalización decisoria, llamadas a operar, captación comercial ni datos personales. No se atribuye al fundador una ratificación de esta comprobación.

## Validación audiovisual

Se comprueban dos líneas de tiempo de 13.000 fotogramas, 80 planos continuos sin huecos, cuatro objetos y pistas de audio [0, 1, 1]. Los 134 bloques Fusion coinciden con el texto y las posiciones previstas. Las composiciones persisten después de guardar, cerrar y reabrir. Los medios existen.

Las exportaciones se verifican a 1920 × 1080, 25 fps, 520 segundos, audio estéreo a 48 kHz. Se decodifican completas sin errores; el pico de audio es −16,9 dBFS. Se extrae y revisa una muestra de cada plano, además de los encuadres 3D a resolución completa. Las hojas de contacto, los resultados y hashes quedan en `video-v04/control/`. La revisión genera el storyboard HTML con fotogramas del montaje.

El proyecto DRP y ambas líneas de tiempo DRT se exportan. Se entregan también Cavalry, Blender, imágenes, audio separado, guion y SRT. La sincronización de subtítulos y la mezcla definitiva requieren la voz del autor.

El cierre propietario `CIERRE YT.mp4` citado en el canon no se localizó entre los archivos consultados. No se recrea su identidad ni se utiliza otro cierre. La pieza termina con el remate conceptual del guion; la firma del fundador queda pendiente de disponer del archivo.

Esta verificación es audiovisual. No se ejecuta una nueva validación del portal, cuyo código no cambia, ni se declara resuelta su auditoría previa de contraste. No se publican los archivos.
