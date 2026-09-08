# Mejora de las portadas sobre el diseño original · 08-09-2026

Orden del fundador: repetir el trabajo utilizando el estilo y los recursos de la Home original, mejorándolos, sin Sites. El rediseño anterior queda descartado. Se mantiene la fotografía principal, el titular, la tipografía y la paleta de Inicio. En una indicación posterior autoriza cambiar el banner de Academia para integrarlo con los tres primeros espacios y pide conservar expresamente la ilustración editorial de Lecturas con Criterio.

Fuentes de diseño y contenido: arquitectura canónica de 06-09-2026, DEFINICION_NUVIA.md y MARCO_REGULATORIO_OBLIGATORIO.md v1.2 de Alfa, leídos antes de editar.

## Ficha previa de control

Clasificación del cambio: verde, presentación educativa y navegación. No cambia la clasificación ni el funcionamiento de las herramientas enlazadas.

1. Necesidad: orientar al lector y hacer más legibles las portadas.
2. Datos: textos, fotografías, ilustraciones y destinos existentes de Alfa, junto con una nueva imagen ilustrativa de aprendizaje para Academia.
3. Transformación: disposición, jerarquía visual y claridad del contenido.
4. Resultado: Home, cinco portadas de espacio y refinamiento de Qué es NUVIA.
5. Emisores: no se incorpora selección de instrumentos ni emisores.
6. Circunstancias personales: no se solicitan ni utilizan.
7. Operaciones: no se añade consejo de compra, venta o mantenimiento.
8. Valor o precio: sin opiniones ni previsiones nuevas.
9. Clasificación: colores e iconos distinguen materias, no atractivo inversor.
10. Terceros: se conserva el catálogo bibliográfico y sus fuentes y límites.
11. Presentación: acciones para consultar, comprender y explorar escenarios.
12. Acción: navegación educativa; no se incorpora contratación o contacto.
13. Remuneración: no se añaden precios, suscripciones, patrocinios o afiliación.
14. Agente vinculado: sin marcas bancarias, derivación o datos profesionales.
15. Datos personales: sin formularios nuevos ni escrituras en bases de datos.
16. IA: sin nuevas funciones de IA del producto. Se genera una fotografía ilustrativa para Academia por autorización del fundador; representa una escena ficticia de aprendizaje, sin identificar a clientes, colaboradores ni personas reales.
17. Límites: se preservan avisos, fuentes, disponibilidad y definición canónica.
18. Verificación: contratos originales, compilación y revisión visual de escritorio y tablet.

## Implementación

Ampliación autorizada por el fundador: adaptar las cinco portadas de espacio a los banners aprobados de Inicio. Se aplica la ficha anterior (clasificación verde): reutilización de las cinco imágenes, composición y navegación educativa, sin nuevos datos, cálculos, recomendaciones o servicios. Se conservarán recursos, pestañas, filtros, catálogo, fuentes y límites. Controles previstos: navegación y contratos existentes, auditoría de render en escritorio/tablet y revisión visual de las cinco entradas.

- Inicio mantiene su fotografía familiar, titular, tipografía y paleta. Por la indicación posterior de simplificar, el recorrido queda en hero, presentación del proyecto y cinco bloques visuales. Se retiran las cinco tarjetas y el sumario de herramientas que repetían destinos. Los banners conducen a las portadas canónicas; `#espacios` apunta al comienzo de esos bloques. Las herramientas continúan en la navegación global y dentro de sus espacios.
- Los cinco bloques de Inicio comparten ancho, esquinas, sombra, tipografía de contenido y botón de acceso. Academia utiliza una nueva fotografía de aprendizaje cotidiano y la misma composición de texto e imagen que Patrimonio; el título y la explicación son HTML. Lecturas conserva su ilustración original completa y añade debajo una explicación y un botón coherentes con los otros espacios. Cada bloque tiene un único acceso visible.
- Las cinco portadas reutilizan la composición de los banners de Inicio: Economía panorámica, Patrimonio con texto sobre fondo claro y fotografía a la derecha, Bienestar con fotografía a la izquierda y panel azul, Academia con la nueva escena de aprendizaje sobre fondo claro y Lecturas con su paisaje editorial. Comparten ancho, esquinas, sombra, accesos y ruta de navegación. Se mantienen los recursos y los enlaces para continuar hacia las otras áreas.
- Academia presenta tres accesos: conocimientos esenciales, glosario y cursos. La fotografía de aprendizaje sustituye al libro también en la portada del espacio. La cabecera se compacta al entrar en sus contenidos; las pestañas permanecen debajo, conectadas al controlador existente. Se conservan las siete vistas y el funcionamiento del curso.
- Lecturas mantiene el paisaje, el título HTML accesible y las cuatro fichas originales. Su ilustración interior conserva la proporción completa en escritorio y tablet; un acceso bajo el paisaje lleva al catálogo. Las tres entradas editoriales aplican los filtros existentes y llevan al catálogo, también con teclado.
- Qué es NUVIA conserva todos los enunciados de la definición, las imágenes, la tipografía y las animaciones. Se ajustan los saltos y espacios del manifiesto para facilitar la lectura y su futura grabación; las cinco áreas incorporan enlaces directos.
- Los retoques de texto evitan cifras de cobertura que pueden quedar desactualizadas, umbrales presentados como decisiones adecuadas y garantías generales de privacidad que no corresponden a una portada. No se modifica el funcionamiento de los simuladores.

## Validación

Revisión visual e interactiva local de las siete páginas en escritorio y tablet, con comprobaciones a 1440, 1024 y 768 px. La prueba de Lecturas espera a que termine el desplazamiento antes de pasar al siguiente enlace y verifica filtros, fichas, devolución del foco y destinos del teclado.

El rediseño de las siete páginas pasó la compilación integral con `NUVIA_RENDER_OFFLINE=1 npm run build` (salida 0): 36 rutas a 1440 px, comprobaciones de los archivos generados en `dist/` y módulo de empresas a 1440, 1280, 1024, 820 y 768 px. Sin errores de contraste, tipografía, distribución, navegación ni consola. La definición conserva sus 26 enunciados canónicos y los contratos de las imágenes originales siguen pasando.

Tras simplificar Inicio se repitió su auditoría a 1440, 1024 y 768 px, sin incidencias (`output/home-simplificada-render.log`). Se comprobó el salto de «Explorar NUVIA» y se regeneró `dist/` con `node scripts/build-site.mjs`. Los controles de referencias, navegación, composición de Inicio, imágenes originales y estilos pasan tanto en la fuente como en el paquete generado. Se actualizó el rol de Inicio en la arquitectura canónica.

Los registros de revisión están en `output/mejora-portadas-render.log` y `output/mejora-portadas-ajustes.log` (incluyen incidencias corregidas durante el trabajo), `output/mejora-lecturas-final.log` y `output/mejora-portadas-build.log` (ejecuciones finales satisfactorias).

Tras integrar Academia y Lecturas se repitió la auditoría de Inicio a 1440, 1024 y 768 px, sin incidencias (`output/home-academia-natural-render.log`). Se regeneró `dist/` y pasaron los controles de referencias estáticas, composición e imágenes de Inicio, preservación del banner editorial, navegación y módulos de estilos. La fotografía nueva está incluida en el paquete generado con el mismo SHA-256 que la fuente; el banner de Lecturas mantiene su SHA-256 original. Revisión visual adicional de ambos paneles en escritorio y tablet.

La adaptación posterior de las cinco portadas se revisó a 1440, 1024 y 768 px. El primer recorrido detectó etiquetas con contraste insuficiente en Economía y Bienestar y una consulta de prueba que suponía un solo enlace al catálogo; se corrigieron el contraste y la comprobación de ambos enlaces. Patrimonio y Academia pasaron los tres anchos desde el primer recorrido. Economía, Bienestar, Lecturas y tres vistas interiores de Academia pasan en `output/portadas-banners-ajustes.log`. El ajuste final del encuadre de Lecturas pasa en `output/portadas-lecturas-final.log`; las otras tres vistas interiores de Academia pasan a 1440 px en `output/portadas-academia-resto.log`. Las siete vistas del campus conservan contenido y consola limpia. Los filtros, fichas y destinos de Lecturas se verifican con teclado.

Se regeneró el paquete local y pasaron los controles de referencias, navegación, imágenes, estilos, recorrido de Academia y catálogo de Lecturas en `dist/`. También pasan los controles de lenguaje, tipografía, disposición, superficies y consistencia de la fuente. No se ejecutó un nuevo despliegue.

Publicación no incluida en esta revisión local. No se utilizan Sites, Firebase ni otros repositorios. Las comprobaciones automáticas bloquean conexiones externas y no validan los servicios remotos.

## Emblema editorial y etiqueta de Bienestar

Nueva indicación del fundador: reducir a la mitad la altura del banner de Lecturas. La proporción del marco pasa de 2120/404 a 2120/202, conservando el ancho completo. El paisaje y el emblema mantienen su escala y se encuadran dentro de la franja más baja; el título sigue siendo HTML legible. Ajuste visual dentro de la misma ficha, sin cambios funcionales.

Corrección posterior: mostrar la imagen completa dentro de esa altura reducida. El grupo de ilustración se escala proporcionalmente al 50 % del ancho y al 100 % de la nueva altura, alineado a la derecha, sin recortes ni deformación. El papel del propio paisaje prolonga el fondo hasta el borde izquierdo del banner. El título y los accesos permanecen alineados con el contenido.

Ajuste posterior solicitado: acercar el árbol, las montañas y el logo al título. El borde derecho del grupo ilustrado queda alineado con el contenedor del contenido inferior, usando su mismo margen adaptable. Se conservan la imagen completa, sus proporciones y la altura reducida del banner.

Por indicación posterior del fundador, los extremos laterales del grupo ilustrado se funden gradualmente con el papel amarillo del fondo mediante una máscara CSS. El centro del paisaje, el árbol y el logo conservan su opacidad; no se modifican los archivos de imagen ni la alineación aprobada.

Corrección de «FAMILY WEALTH»: la franja original se limpia con ImageGen integrado y se guarda en `src/assets/home/lecturas-firma-limpia-20260908.webp`. El rótulo se compone como texto SVG, con `text-anchor="middle"` y centro en x=1804 sobre el lienzo de 2120 px, medido respecto de las letras originales de NUVIA. Solo se aplica en la portada de Lecturas. El texto deja de depender de una alineación rasterizada.

Por nueva indicación del fundador, el banner de la portada de Lecturas ocupa todo el ancho del navegador. Se conserva la proporción del paisaje; el título y la franja de explicación y acceso se alinean con el contenedor de contenido del portal. Se retiran el marco y las esquinas de tarjeta únicamente en esta portada.

Validación final: Lecturas pasa a 1440, 2560 y 768 px (`output/lecturas-banner-completo.log`), incluido el catálogo y los destinos con teclado. Se comprueba el ancho del banner desde x=0 hasta el borde derecho del documento y el centrado del rótulo con un desvío inferior a 0,01 px. `dist/` se regenera y pasa referencias y contratos de ambos banners. Sin publicación remota.

Prompt final para limpiar la firma:

> Use case: precise-object-edit. The attached banner is the edit target.
> Remove ONLY the small gold subtitle FAMILY WEALTH beneath NUVIA in the upper right of the banner, leaving clean continuous warm ivory paper in that small area. Remove every letter of that subtitle completely. The corrected subtitle will be typeset by the website as real vector text. Keep the large NUVIA word exactly, keep the open book exactly, keep the short gold rule below the erased subtitle exactly. Keep all other pixels, positions, the gold circle, large landscape tree, watercolor mountains, paper texture and canvas with white padding unchanged. Do NOT add any new text. Return the whole banner with the small subtitle erased.

Corrección posterior solicitada: centrar «FAMILY WEALTH» respecto de «NUVIA» y del libro en la portada de Lecturas. Ajuste de alineación del emblema, dentro de la misma ficha visual; sin cambio de contenido ni funcionamiento.

El fundador pide sustituir el pequeño árbol dorado del emblema de Lecturas por un libro y, después, retirar la etiqueta «En preparación». Se aplica el libro a Inicio y a Lecturas; se retira la etiqueta superpuesta de Inicio y Bienestar. Continúa la clasificación verde de la ficha: ajuste ilustrativo sin nuevos datos, funcionalidades o promesas.

Edición con ImageGen integrado, sin CLI, guardada en `src/assets/home/lecturas-emblema-libro-20260908.webp` (2171 × 724 px, 66618 bytes). Se convierte a WebP y se muestra únicamente la zona del emblema mediante CSS, manteniendo íntegros el resto del paisaje y las letras de las dos imágenes originales.

Comprobado visualmente en Inicio a 1440 px y Lecturas a 1440 y 768 px. Se confirma la ausencia de la etiqueta superpuesta; los contratos de banners y las referencias locales pasan en la fuente y en el paquete `dist/` regenerado.

Prompt final:

> Use case: precise-object-edit.
> Asset type: existing panoramic website editorial banner, 2120 × 404.
> Input image 1 is the edit target. Input image 2 is a close-up reference identifying the small gold tree emblem to replace.
> Replace ONLY the small gold tree icon above the word NUVIA near the upper right (centered at approximately x=85.2%, y=23%). Replace it with one refined open-book emblem, drawn in the same muted antique gold, with fine page lines and a balanced classic editorial engraving style. The book must be immediately recognizable and occupy approximately the same small footprint as the old gold tree, above the existing NUVIA lettering.
> Keep the whole panoramic canvas and every other element unchanged: the large living tree in the landscape must stay; retain the watercolor mountains, warm ivory paper texture, fine gold circle and sweeping lines, and all the existing NUVIA / FAMILY WEALTH text exactly as it is. Keep the entire left side empty for the website's HTML title. Do not add any title, extra text or other objects. No change of layout, crop, aspect ratio, framing, lighting, palette or typography. Return the complete edited banner, not a close-up.

## Imagen de Academia en Inicio

Generada con la herramienta integrada ImageGen, sin CLI. Archivo incorporado: `src/assets/home/academia-aprendizaje-natural-20260908.webp`, 1536 × 1024 px, 180588 bytes. Conversión de PNG a WebP para optimizar el peso, sin retoques del contenido. SHA-256: `11f5440e2206c50bc659d6bb529609347244cfe8269fc2e1163cbb85a87ecc44`.

La ilustración editorial de Lecturas permanece sin modificaciones. La ilustración anterior de Academia sigue disponible en el repositorio; por la ampliación posterior del fundador, la portada propia del espacio utiliza ahora la misma fotografía que Inicio.

Prompt final utilizado:

> Use case: photorealistic-natural. Asset type: landscape editorial photograph for the Academia NUVIA education section of a Spanish family economy website. Create a refined, credible, candid photograph of an adult learning independently at an oak desk in a quiet Mediterranean home study. A mature adult in a navy knit shirt is seen obliquely from behind, shoulders and naturally posed forearms, consulting an open reference book while taking notes in a simple notebook with a pen. The human is secondary to the thoughtful learning activity. Reading glasses and two plain unbranded books on the desk; softly out-of-focus bookshelves and daylight through a tall window with greenery outside. Subtle natural linen, paper and wood textures. Warm but restrained afternoon daylight, muted navy, olive foliage and soft neutral stone colors, contemporary European editorial photography, realistic proportions and materials, no glossy advertising pose, no excessive orange grade. Landscape 3:2 composition. Keep the open book, notebook and writing hand together in the central safe area so the photo also crops well to a wide tablet frame. The website will place the title and description beside the image in HTML; do not add any titles, captions, typography, legible brand names, logos or watermark. No financial charts, coins, glowing books, neon, futuristic interfaces or surreal effects. High quality photographic asset, not a website mockup.
