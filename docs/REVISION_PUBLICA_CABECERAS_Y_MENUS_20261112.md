# Revisión pública de logos, cabeceras y menús · 12-11-2026

## Orden del fundador

«Ahora revisa toda la web publicada en escritorio y tablet para comprobar que los logos, las cabeceras y los menús se ven bien y no hay solapamientos, sin cambiar el resto del diseño.»

## Versión y alcance

Revisión realizada contra la web real en [GitHub Pages](https://oantiza.github.io/NUVIA-PORTAL-ALFA/), correspondiente al commit publicado `07e8ad408045bc00d5e7f0cd6fb288e34c90d52a`. La [ejecución de publicación 43254798546](https://github.com/oantiza/NUVIA-PORTAL-ALFA/actions/runs/43254798546) terminó correctamente.

Se revisan las cabeceras, logos y navegación global y contextual de las 28 páginas públicas, incluidas las cuatro webs, sus interiores, los espacios comunes y las páginas institucionales. Se añaden diez vistas con parámetros y las anchuras inmediatamente anteriores y posteriores a los cambios de tamaño del logo. No se modifica el diseño, el contenido, los cálculos ni las funcionalidades.

## Matriz de comprobación

| Grupo | Tamaños del navegador en píxeles | Combinaciones |
|---|---|---:|
| 28 páginas públicas | 1440 × 900, 1280 × 800, 1024 × 768, 900 × 600 y 768 × 1024 | 140 |
| Economía, Patrimonio, Bienestar, Academia, Lecturas y Mercados | Anchuras 1000, 999, 820 y 819; altura 768 | 24 |
| Diez vistas derivadas | 1440 × 900, 1024 × 768 y 768 × 1024 | 30 |
| **Total** | **38 rutas y vistas distintas** | **194** |

Las vistas derivadas son las cinco pestañas de Academia (`inicio`, `esenciales`, `cursos`, `calculadora`, `glosario`), Informes en Mercados, las vistas `companies` y `models` de Cartera, y las páginas de temas `bienestar` y `planificacion-patrimonial`.

## Resultado

**194 de 194 comprobaciones completadas, sin incidencias en el alcance revisado.**

- El mismo SVG oficial carga correctamente en todas las cabeceras y conserva sus proporciones. Inicio mantiene 280 × 70 px; las cabeceras contextualizadas, 240 × 60, 216 × 54 o 192 × 48 px según la anchura.
- Las filas principales mantienen 102 px en Inicio y 100 px en las demás páginas. Logo, título del espacio, selector y navegación local caben sin colisiones ni recortes de texto detectados. No hay desbordamiento horizontal de la página.
- Los controles comprobados conservan superficies de interacción de al menos 44 × 44 px. El desplegable permanece dentro del área visible, también a 900 × 600 px, donde utiliza desplazamiento interno.
- El selector se abre con Enter; Tab recorre sus diez destinos con foco visible y alcanza el último enlace mediante desplazamiento interno. Escape lo cierra y devuelve el foco al selector. El clic exterior también lo cierra.
- La comprobación del elemento situado bajo cada enlace visible confirma que el contenido de la página no intercepta los enlaces del desplegable. Su superposición intencionada sobre el contenido queda delimitada por un fondo opaco y no produce colisiones entre controles.
- Al desplazar la página, la cabecera mantiene su comportamiento previsto y no queda flotando sobre el contenido.
- Durante la ejecución no se registran errores JavaScript de página ni fallos HTTP de los recursos propios comprobados (scripts, estilos, fuentes y SVG).

Se revisan además capturas reales de escritorio y tablet de manera independiente. La comprobación manual en el navegador de Lecturas a 900 × 600 px confirma la apertura, el recorrido completo hasta Independencia, el desplazamiento interno y el cierre con Escape. Al terminar se restaura el tamaño normal del navegador y se deja el menú cerrado.

La revisión se ejecuta con Chromium y tamaños de navegador correspondientes a escritorio y tablet; no es una prueba física de todos los modelos de dispositivo ni una nueva auditoría de cálculos o datos.

## Evidencia y validación

Evidencia local en `output/auditoria-publica-cabeceras-20261112/`:

- `auditar.mjs`: comprobación automatizada contra la URL pública, sin sustituir ni simular los recursos de producción.
- `resumen.json`: 194 vistas previstas y completadas, 38 rutas, 28 páginas públicas y cero fallos.
- `resultados.json` y `auditoria.log`: resultados detallados; ejecución finalizada con código 0.
- Capturas de las cabeceras de las 28 páginas a 1440 y 768 px, junto con desplegables representativos a 1440, 900 y 768 px.

Ejemplos: [Economía en tablet](../output/auditoria-publica-cabeceras-20261112/economia.html-768-cerrado.png), [Patrimonio con menú abierto](../output/auditoria-publica-cabeceras-20261112/patrimonio.html-768-abierto.png) y [Qué es NUVIA a 900 × 600](../output/auditoria-publica-cabeceras-20261112/que-es-nuvia.html-900-abierto.png).

No ha sido necesario corregir fuentes del producto ni volver a compilar o publicar: la versión desplegada conserva las validaciones de su publicación. Este trabajo añade únicamente el acta y su referencia en el índice; las evidencias de ejecución quedan en el directorio de salida ignorado por Git. Se conservan los trabajos locales ajenos.

## Prueba del §12

Necesidad: comprobar visualización y navegación por orden expresa. Entrada: páginas y recursos ya públicos. Operación: lectura, renderizado, medición y navegación de interfaz. Resultado: evidencia de presentación y funcionamiento de las cabeceras. No se introducen funciones, cálculos, recomendaciones, juicios de idoneidad, llamadas a operar, datos personales, IA, integraciones ni cambios de separación profesional. No se realizan escrituras en Firebase, commit, push ni despliegue.
