# Academia NUVIA · Dos banners con aula moderna

Fecha: 09-09-2026.

Orden del fundador: «bien sustituye la imagen los 2 banners de la web de la academia por esta. adaptada a cada seccion».

Se utiliza la imagen aprobada en esta conversación: tres adultos jóvenes estudiando en un aula moderna, libros y portátil sobre la mesa y gráficos de bolsa ilustrativos en la pantalla del fondo.

## Archivo y adaptación

- Archivo: `src/assets/home/academia-finanzas-moderna-20260909.webp`.
- Original aprobado: `output/imagegen/banner-academia-20260909-v8.png`, generado con ImageGen. Las personas y los gráficos son ficticios.
- Conversión a WebP de 2172 × 724 px, calidad 86: 149860 bytes. Sin alterar el contenido de la imagen.
- SHA-256: `a55ab77dbfd42c886591109249da3165237ca09918d8b20452771e5b7cad0270`.
- Inicio: encuadre a la derecha para conservar las tres personas; a 1280 px o menos se utiliza la composición apilada del portal para evitar cortar al primer alumno.
- Portada de Academia: altura común de 400 px en escritorio y 272 px en tablet. Por la siguiente petición del fundador, la escena se amplía con más aula a la derecha y llega hasta el extremo de la pantalla. Se conserva el velo detrás del texto; la altura ya no aumenta en pantallas anchas. Archivo y proceso en `ACADEMIA_HERO_PANORAMICA_20260909.md`.
- Se mantienen los títulos, enlaces, pestañas, cursos, calculadoras y demás contenidos.

## Revisión interna del cambio

Clasificación: VERDE, imagen decorativa educativa. Aplicación del marco obligatorio v1.2 y de la arquitectura canónica.

1. Necesidad: representar un espacio donde aprender finanzas.
2. Entrada: imagen elegida expresamente por el fundador; sin entradas personales.
3. Transformación: compresión y encuadre mediante CSS.
4. Salida: la misma escena ilustrativa en dos banners.
5. Instrumentos o emisores identificables: ninguno.
6. Circunstancias personales del usuario: ninguna.
7. Recomendaciones de compra, venta o mantenimiento: ninguna.
8. Opiniones sobre precios o valor: ninguna; los gráficos no son datos de mercado.
9. Puntuaciones o rankings: ninguno.
10. Recomendaciones de terceros: ninguna.
11. Diseño prescriptivo: no; imagen de aprendizaje sin señales operativas.
12. Acciones: únicamente la navegación educativa preexistente.
13. Remuneración, patrocinio o afiliación: no se incorporan.
14. Separación profesional: sin marcas bancarias, captación ni derivación.
15. Datos personales: no se tratan ni se escriben en ninguna base de datos.
16. IA: imagen estática generada con ImageGen, revisada y elegida en la conversación; no se añade IA interactiva.
17. Fuentes y límites: recurso ilustrativo, sin series financieras reales ni pretensión de exactitud de sus gráficos.
18. Controles: prueba existente de integridad de banners actualizada, revisión visual en escritorio y tablet, comprobación de referencias y compilación del sitio.

La solicitud se aplica a la copia local del portal. Este registro no añade una orden de publicación ni actuaciones sobre Firebase o backend.

## Validación realizada

- `npm run build`: compilación completa y comprobaciones del proyecto correctas, incluida la auditoría de 36 vistas a 1440 px y la del módulo de empresas.
- `node scripts/check-render.mjs . 768,1180,2560 index.html,academia.html`: seis combinaciones correctas, sin fallos de contraste, desbordamiento, estructura ni interacción.
- Revisión visual en navegador a 768, 1180, 1440 y 2560 px; corregidos los recortes laterales y superiores detectados.
- Los estilos y la imagen de `dist/` coinciden por SHA-256 con los archivos fuente finales.
- `git diff --check`: correcto.
- Capturas y registros locales en `output/imagegen/`, fuera de la publicación.

Comprobación del ajuste de altura: `node scripts/check-render.mjs . 1440,2560,3840,768 academia.html`, correcto en los cuatro tamaños. Revisión visual del encuadre completo en navegador; registro en `output/academia-altura-compacta.log`.
