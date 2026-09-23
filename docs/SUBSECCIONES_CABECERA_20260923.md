# Cabecera de subsección en el resto de páginas hijas · 23-09-2026

Orden del fundador: «aplica esta plantilla a las otras subsecciones» (la cabecera aprobada en Impuestos). Sin cambios de contenido, cálculo ni backend.

## Plantilla

`estilos/nuvia-subseccion.css`: cabecera clara (superficie común de páginas hijas), texto a la izquierda y foto enmarcada a la derecha (radio grande, sombra y filete bronce en la esquina). El título mantiene la escala de páginas hijas (36 px; 28 px ≤ 1120 px). En tablet y móvil la foto pasa debajo del texto.

## Páginas y fotos (ninguna se usaba en otra página)

| Página | Foto |
|---|---|
| Vivienda y coste de vida | `card-vivienda.webp` · fachada de vivienda |
| Jubilación | `card-jubilacion.webp` · pareja paseando junto al mar (etapa activa) |
| Mercados y noticias | `mercados-noticias-manana-20260923.webp` · foto nueva (23-09): lectura de la prensa económica al amanecer. Se retiraron la cabecera «Financial Times» del periódico y se desenfocaron los lomos de libros con títulos reales (marcas de terceros) |
| Mi cartera (y sus vistas) | `cartera-laboratorio-20260923.svg` · ilustración vectorial propia (23-09): panel con composición, riesgo y rentabilidad, escenarios y riesgo. Sin cifras ni datos, para que no se lea como resultado ni recomendación; animación de entrada desactivada con movimiento reducido |
| Planificación patrimonial (`temas.html`) | `planificacion-patrimonial-familia-20260923.webp` · foto nueva (23-09): pareja e hija revisando un esquema junto a un ventanal. Se borraron los rótulos en inglés de las carpetas (STRATEGY, LEGACY) y la etiqueta |
| Cuerpo, mente y salud (`temas.html?topic=bienestar`) | `card-wellness.webp` · familia haciendo ejercicio |

Ajustes de composición: en Vivienda las pestañas de herramientas pasan a lo ancho bajo la cabecera; en Jubilación «Cómo usar esta página» pasa a una franja de tres pasos bajo la cabecera. Impuestos conserva su cabecera propia (selector sobre la foto).

Quedan fuera las guías (`guia-*.html`), el curso y las páginas institucionales, que no son subsecciones del menú.

## Verificación

- `check-render` a 1440, 1280, 1180, 1024, 900, 820 y 768 px en Vivienda, Jubilación (y resultados), Mercados, Cartera (y carteras modelo), Planificación, Jubilación en temas e Impuestos: sin fallos.
- Cuerpo, mente y salud: la comprobación de anclas de `check-wellbeing-entry` es intermitente en este entorno también con la versión anterior (2 fallos por pasada en la versión publicada). En la nueva versión, algunas pasadas añaden fallos de jerarquía tras volver desde Lecturas; la medición manual del mismo recorrido da título de 28/36 px, fondo blanco y sin imagen de fondo. Pendiente de observar en la auditoría completa.
- Pruebas estáticas (cáscara, paridad, sitio estático, consistencia sin `style` en línea, navegación, metadatos, tarjetas, controles, superficies, fundamentos, avisos, tablas, jerarquía, Patrimonio, Economía, Bienestar, revisión familiar, privacidad, noticias, confianza, contenido externo): en verde.
