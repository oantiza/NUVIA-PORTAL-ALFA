# Jerarquía visual y navegación · 10-09-2026

Implementación del plan de homogeneización presentado al fundador tras la auditoría de las capturas, las rutas y el portal. Autorización recibida en la conversación: «Ok adelante». La excepción expresa es Lecturas con Criterio. Alcance de presentación: escritorio y tablet, desde 768 px.

## Criterio común

La Home global presenta NUVIA. Las Homes de espacio orientan mediante su portada fotográfica y sus accesos. Las páginas hijas abren el contenido: una ruta de navegación, un título propio, una explicación breve y, cuando hace falta, controles o navegación local. No repiten las tarjetas de bienvenida ni añaden otra portada antes de la herramienta.

La clase optativa `nv-entry`, en `estilos/nuvia-page-entry.css`, aplica una superficie blanca, separación inferior y el mismo ancho de lectura. El título usa Newsreader a 36 px en escritorio y 28 px en tablet. Las portadas de espacio conservan su composición y títulos de mayor tamaño; en tablet, 36 px. Inter se mantiene en navegación, texto y datos. Azul NUVIA para selección, verde para enlaces, crema para contenido editorial y tonos técnicos para información auxiliar. El color no califica una inversión.

## Mapa de destinos

| Home de espacio | Páginas y vistas especializadas |
| --- | --- |
| Economía y Finanzas · `economia.html` | Mercados y noticias; Mi cartera; Carteras modelo; Análisis y valoración de empresas |
| Patrimonio · `patrimonio.html` | Vivienda y coste de vida; Impuestos; Jubilación; Planificación patrimonial |
| Familia, Salud y Bienestar · `bienestar.html` | Cuerpo, mente y salud |
| Academia NUVIA · `academia.html` | Conocimientos esenciales; Cursos; Fundamentos de inversión; Activos financieros; Interés compuesto; Glosario financiero |
| Lecturas con Criterio · `lecturas.html` | Catálogo y fichas: diseño propio conservado |

Las guías fiscales conservan su nivel dentro de Impuestos; las de planificación y rescate, dentro de Jubilación. El curso incorpora Cursos en su ruta. Colaboradores, Qué es NUVIA, Metodología e Independencia regresan a Inicio y usan una apertura contenida.

## Duplicidades resueltas

- Mercados identifica su contenido y enlaza con Economía; la orientación del espacio corresponde a su Home.
- Cartera y modelos reúnen su presentación en una sola cabecera. Desaparecen los dos banners decorativos repetidos y sus tesis; las fases, el pentágono, el constructor y las composiciones permanecen. La disponibilidad se consulta en un desplegable visible, y el aviso alfa y las fechas siguen junto a la herramienta.
- Empresas utiliza la entrada exterior de la suite y conserva su información de fuente dentro del módulo. La aplicación independiente mantiene su cabecera.
- Academia cambia el H1, la ruta y el título de pestaña según la vista. Mantiene un regreso a Academia y elimina los dos botones duplicados «Volver a la portada». Los títulos internos describen el contenido que sigue.
- Cuerpo, mente y salud desarrolla los temas de Bienestar sin repetir su Home ni una segunda bienvenida fotográfica. Se distinguen los cuatro pilares de la Home, cinco temas de contenido y tres guías en preparación.
- Los ocho regresos de herramientas y guías a Patrimonio apuntan a `patrimonio.html`. «Impuestos» se usa de forma coherente en las entradas y sus guías.
- `temas.html` y su antiguo tema Patrimonio llevan a la Home canónica. Los alias de Vivienda, Impuestos y Jubilación llevan a sus herramientas. Se conservan parámetros y fragmentos; el contenido único de Familia y legado pasa a Jubilación con su mismo identificador.
- Las páginas institucionales reducen sus aperturas y, en Qué es NUVIA, las grandes declaraciones ajustan su escala sin cambiar la definición del proyecto.
- El catálogo visual identifica Newsreader, que ya es la fuente editorial real. El sitemap incorpora las Homes de Economía, Patrimonio y Bienestar y Colaboradores.

## Prueba de alcance regulatorio del cambio (§12)

1. Necesidad: reconocer dónde se está, distinguir orientación de contenido y llegar antes a la herramienta.
2. Entradas: la ruta elegida y el estado de navegación; no añade datos al usuario.
3. Transformación: presentación, títulos, regresos y compatibilidad de rutas. Las fórmulas permanecen.
4. Salida: el mismo contenido y resultados dentro de una jerarquía más breve y consistente.
5. Instrumentos identificables: siguen en los módulos existentes, sin nuevas valoraciones.
6. Circunstancias personales: no añade usos, entradas ni almacenamiento.
7. Operaciones: no genera instrucciones de compra, venta, mantenimiento o inacción.
8. Precio o valor: no modifica estimaciones ni opiniones.
9. Atractivo inversor: no puntúa ni reordena instrumentos.
10. Recomendaciones ajenas: no añade ni reformula recomendaciones.
11. Diseño: los colores identifican navegación y magnitudes, sin veredicto de salud o idoneidad.
12. Acciones: navegación, lectura y herramientas existentes; sin contratación ni contacto nuevo.
13. Remuneración: no añade patrocinios, afiliación ni intereses comerciales.
14. Separación profesional: conserva los textos de independencia y el perímetro existente.
15. Datos personales: no hay nuevas recogidas ni escrituras. No se modifica Firebase ni backend.
16. IA: no añade generación ni decisiones de IA al producto.
17. Evidencia: fuentes, fechas, supuestos y avisos permanecen accesibles. La explicación general de disponibilidad en Cartera pasa a un desplegable; el origen dentro de Empresas se mantiene visible.
18. Regresión: contratos de navegación, alias, títulos, superficies y escala; pruebas financieras existentes; auditoría de la página pintada y revisión visual de escritorio/tablet. No se interpreta la revisión técnica como una aprobación jurídica externa.

Clasificación interna del cambio de presentación: informativo, sin decisión ni recomendación añadida. Los módulos financieros conservan sus controles existentes.

## Validación reproducible

- `npm run build`: compilación de Empresas, contratos estáticos, cálculos, datos, navegación y 36 rutas/estados a 1440 px; verificación del módulo compilado a cinco anchos.
- `node scripts/check-render.mjs . 1280 …`: revisión de entradas representativas y corrección de herencias de contraste.
- Auditoría adicional a 1024, 820 y 768 px: portadas, páginas hijas, controles y resultados.
- `docs/nuvia-page-hierarchy.test.mjs`: alias, parámetros, fragmentos y conservación de Familia y legado; Lecturas queda fuera de `nv-entry`.
- `scripts/check-page-hierarchy.mjs`: comprueba una única entrada, padre canónico, escala del título y ausencia de segunda portada.

Las auditorías locales con `NUVIA_RENDER_OFFLINE=1` verifican interfaz y funcionamiento con conexiones externas bloqueadas; no acreditan disponibilidad de proveedores remotos. La publicación requiere además que termine correctamente el flujo oficial de GitHub Pages.

Resultado local: compilación completa correcta; 36 rutas/estados a 1440 px, ocho entradas representativas a 1280 px y 18 rutas/estados a 1024, 820 y 768 px sin incidencias de contraste, escala, estructura, desbordes o interacción. El módulo de Empresas compilado supera sus comprobaciones a 1440, 1280, 1024, 820 y 768 px. Revisión visual adicional de su integración real: una sola entrada visible, fuente accesible y buscador disponible. Los anclajes antiguos de ámbitos de Patrimonio y herramientas de Jubilación se traducen a los bloques equivalentes en sus páginas canónicas.
