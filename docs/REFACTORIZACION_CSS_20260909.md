# Refactorización CSS · 09-09-2026

## Alcance y resultado

Revisión del código fuente de NUVIA Portal Alfa para extraer estilos del HTML
y reglas fijas generadas desde React, conservando la apariencia existente.
Se ha reutilizado el sistema actual y su orden de cascada. No se han cambiado
contenidos, navegación, cálculos, tamaños, colores, imágenes ni degradados.
Los cambios de banners que ya estaban en la carpeta al iniciar esta tarea se
han conservado y no forman parte de esta refactorización.

El inventario abarca 29 archivos HTML fuente: 24 páginas publicadas del portal,
la plantilla, dos ejemplos locales y las dos entradas del módulo de empresas.
Tras la extracción no quedan atributos `style` ni bloques `<style>` reales en
esos archivos. Las menciones a `style` en las instrucciones de la plantilla son
texto de documentación, no atributos. Los valores que JavaScript calcula en
tiempo de ejecución se detallan como pendientes más abajo.

## Páginas revisadas

- Portada y espacios: `index.html`, `economia.html`, `patrimonio.html`,
  `bienestar.html`, `academia.html`, `lecturas.html`.
- Herramientas y formación: `cartera.html`, `mercados.html`, `vivienda.html`,
  `jubilacion.html`, `fiscalidad.html`, `independencia.html`, `temas.html`,
  `curso.html`.
- Guías: `guia-ahorro.html`, `guia-calendario.html`, `guia-fiscal.html`,
  `guia-impuestos.html` —redirección—, `guia-planificacion.html`,
  `guia-sucesiones.html`.
- Institucionales y muestra: `colaboradores.html`, `que-es-nuvia.html`,
  `metodologia.html`, `sistema-visual.html`.
- Auxiliares: `_plantilla.html`, `prototipos/laboratorio-cartera-B.html`,
  `docs/previews/banners.html`, `company-analysis/index.html`,
  `company-analysis/local.html`.

También se han revisado las hojas del portal y del módulo de empresas y los
usos de estilos generados en `js/` y `company-analysis/src/`. Se excluyen las
dependencias, los resultados compilados y el paquete de vídeo Remotion.

## Extracciones realizadas

| Origen | Eliminado | Destino |
| --- | --- | --- |
| `curso.html` | 1 atributo de anchura del progreso | `estilos/nuvia-components.css` |
| `guia-planificacion.html` | 1 atributo de anchura del progreso | La misma clase compartida en `nuvia-components.css` |
| `curso.html` —imagen creada con React— | 1 objeto de estilo fijo: display, anchura y altura | `.curso-figura__asset` en `estilos/nuvia-pages-foundations.css` |
| `prototipos/laboratorio-cartera-B.html` | 1 bloque CSS y 207 atributos | `prototipos/laboratorio-cartera-B.css` |
| `docs/previews/banners.html` | 1 bloque CSS | `docs/previews/banners.css` |
| `company-analysis/src/components/SvgCharts.jsx` | 5 objetos de estilo fijo: SVG, leyendas y separación del pie | `company-analysis/src/theme.css` |
| `company-analysis/src/views/tabs/FundamentalTab.jsx` | 11 objetos de estilo fijo: tablas, rótulos y nombres de instituciones | `company-analysis/src/theme.css` |
| `company-analysis/src/alfa/TechnicalChart.jsx` | 1 objeto de estilo fijo: muestra de color del volumen | `company-analysis/src/alfa/theme.css` |

Total: **209 atributos HTML, 2 bloques CSS y 18 objetos de estilo fijo de React**.
Las 207 combinaciones del prototipo se reúnen en 157 reglas distintas: los
elementos que tenían declaraciones idénticas comparten la misma clase.

Curso y planificación comparten la anchura del progreso mediante
`data-progress="…%"`. Se conservan sus cálculos enteros de 0 a 100, sus colores
y sus transiciones de 0,4 y 0,3 segundos, respectivamente. Las reglas de anchura
se declaran una vez en componentes; no se sustituyen los cálculos por otros.

## Organización y archivos nuevos

La estructura existente distingue tokens, componentes y tres módulos de
páginas. Su mapa actualizado está en
[`nuvia-design-system.md`](nuvia-design-system.md). La documentación anterior
seguía describiendo una propuesta no aplicada y un CSS que ya no existía.

Solo se han creado dos hojas CSS: la del prototipo y la de la comparación local
de banners. Son páginas independientes, no publicadas por el build. Mantener
sus reglas al lado del HTML evita cargar estilos de revisión y tokens
históricos en el portal. No se añade ninguna hoja nueva al sistema público.

Se ha actualizado `scripts/check-consistencia.mjs`: presupuesto cero de
atributos inline para las 24 páginas y rechazo de bloques `<style>`. El control
existente del orden de módulos sigue pasando sin cambiar la cascada.

## Verificación

- Comparación anterior/actual de estilos computados a 1440 y 768 px: curso
  (653 elementos), planificación (436) y prototipo (740), sin diferencias en
  geometría, tipografía, espaciados, colores, fondos, bordes o transiciones.
- La comparación local de banners conserva su estado anterior de error
  —9 elementos sin diferencias—; no se presenta como una prueba de los banners.
- Interacción real con el curso: progreso del 20 %, anchura proporcional y
  transición conservadas. En planificación: 7 % al elegir horizonte y 13 %
  al marcar una pieza, con anchura y `aria-valuenow` sincronizados.
- Auditoría de render del curso y la guía a 1440 y 768 px: sin errores ni
  desbordamientos detectados.
- Compilación del módulo de empresas y su regresión existente a 1440, 1280,
  1024, 820 y 768 px: correctas, con datos simulados en memoria y sin API externa.
- Comparación de 30 capturas del módulo: 28 idénticas píxel a píxel. En las dos
  restantes la diferencia se limita al fondo de la pestaña «Informe», en un
  rectángulo de 110 × 50 px; la geometría y el resto de la captura son idénticos.
  Las reglas de esa pestaña no se han modificado. No se afirma identidad total
  de píxeles para esas dos capturas.
- `build-site`, comprobación estática y consistencia de `dist/`, prueba del
  orden de estilos y `git diff --check`: correctos. Permanece un aviso previo
  de imágenes sin `loading="lazy"` en Lecturas, ajeno a esta tarea.

Los inventarios, las métricas y las capturas locales quedan en
`output/refactor-css/`, excluido de la publicación. No se han probado versiones
móviles, escrito datos personales ni modificado servicios externos.

## Deuda y decisiones separadas

1. **Estilos dinámicos de gráficos y tooltips.** Se conservan los tres usos
   dinámicos de `style` en `IndicatorInfo.jsx`, `SvgCharts.jsx` y
   `TechnicalChart.jsx`, así como asignaciones de posiciones, colores, anchuras
   y gradientes en `js/nuvia-mapa.js`, `nuvia-analisis.js`, `nuvia-constructor.js`
   y `nuvia-simulador.js`. Una siguiente extracción debe preservar precisión,
   actualización de datos y colocación; no se discretizan medidas financieras.
2. **Temas y valores históricos.** El prototipo y el módulo de empresas tienen
   capas y colores propios ya existentes. Unificarlos con valores parecidos
   del portal podría cambiar el diseño, por lo que no se ha aplicado.
3. **Comparador local de banners desactualizado.** Su script busca la antigua
   clase `.home-section-banner` y falla con la Home actual. El fallo estaba
   presente antes de extraer CSS; corregirlo requiere una tarea funcional aparte.
4. **Plantilla histórica.** Su comentario inicial contiene un ejemplo de
   comentario HTML anidado (`<!-- TODO -->`) que cierra el comentario exterior.
   No se publica ni se ha modificado; conviene corregirlo antes de reutilizarla.

Al cerrar la refactorización, los cambios quedaron aplicados y compilados en
local, sin commit, push ni despliegue. Posteriormente, el fundador solicitó
expresamente su publicación en GitHub Pages.
