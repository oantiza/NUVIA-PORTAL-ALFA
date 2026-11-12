# Integración principal del Ecosistema NUVIA · 12-11-2026

**Acta de la integración local previa a la publicación.** La orden posterior del mismo día autoriza publicar esta versión en GitHub Pages; se registra en [Publicación del ecosistema](PUBLICACION_ECOSISTEMA_GITHUB_PAGES_20261112.md). Los apartados siguientes conservan el alcance y los resultados de la fase local.

## Orden y alcance

Orden literal del fundador: «Ahora integra esta maqueta como la nueva versión principal de NUVIA Portal Alfa, manteniendo todos los contenidos, calculadoras y funcionalidades, sin publicarla todavía.»

Se integra la propuesta aprobada en los HTML y recursos principales del repositorio único. El ecosistema contiene cuatro webs con identidad propia, dos espacios comunes (Lecturas con Criterio y Colaboradores) y las páginas institucionales. Se mantiene una sola compilación estática compatible con el prefijo de GitHub Pages. La integración sustituye las prescripciones visuales anteriores sobre cinco espacios y cabeceras uniformes; no altera el marco regulatorio ni los motores de cálculo.

No se autoriza ni se realiza commit, push, despliegue, publicación ni escritura en Firebase. El sitio remoto conserva su versión anterior.

## Fuentes y continuidad

- `index.html`, `economia.html`, `patrimonio.html`, `bienestar.html` y la rama de portada de `academia.html` contienen las composiciones aprobadas. Fuentes editoriales: `scripts/ecosistema/`.
- `_plantilla.html` define la navegación y los avisos comunes. `npm run shell:sync` aplica la cáscara contextual sin reescribir los contenidos, metadatos ni controladores de cada página.
- `estilos/ecosistema/`, `js/nuvia-ecosistema.js` y `src/assets/ecosistema/` son recursos principales. Ninguna página publicada depende de `prototipos/`.
- Academia conserva un único documento y controlador. La entrada sin parámetros abre la nueva portada; `?tab=inicio` conserva el recorrido anterior. Las vistas, lecciones, progreso, gráficos y cálculos siguen disponibles. Las anclas históricas y los parámetros se conservan.
- Los interiores mantienen su contenido y scripts, con las transformaciones editoriales explícitas de `scripts/ecosistema/presentacion-20261112.mjs`. En Academia el breadcrumb cambia de «Inicio» a «Ecosistema NUVIA».
- Empresas incorpora una última importación de CSS y el atributo de identidad en el body. No cambia componentes, fuentes, datos, cálculos ni backend. Vite empaqueta la hoja con la aplicación local.
- Antes de modificar las fuentes se guardaron los HTML originales y la compilación previa en `output/integracion-ecosistema-20261112/fuentes/` y `original/`, para contrastar contenido y resultados reales. Esta evidencia local no forma parte de la publicación.

## Prueba del §12 del marco regulatorio

| Pregunta | Resultado para este cambio |
|---|---|
| 1. Necesidad | Facilitar la orientación entre cuatro webs y los espacios compartidos. |
| 2. Datos y elección | Recibe rutas y parámetros de navegación elegidos por el usuario; conserva las entradas originales de los simuladores. |
| 3. Transformación | Presentación, agrupación y navegación. Sin cambios de fórmulas, cálculos ni datos. |
| 4. Salida | Las mismas herramientas y contenidos, con nueva identidad visual y organización. |
| 5. Instrumentos identificables | Siguen presentes en los módulos originales; la integración no añade selecciones ni destacados de instrumentos. |
| 6. Circunstancias personales | No incorpora entradas nuevas ni personalización decisoria. |
| 7. Comprar, vender o mantener | No añade sugerencias ni señales. |
| 8. Valor o precio futuro | No incorpora opiniones ni precios objetivo. |
| 9. Atractivo inversor | No cambia puntuaciones, ordenaciones ni criterios. |
| 10. Recomendaciones de terceros | No añade ni modifica recomendaciones. |
| 11. Color y navegación | Los colores identifican webs, no resultados favorables/desfavorables. Se mantienen estados y significado de los controles financieros. |
| 12. Llamadas a actuar | Enlaces de lectura, aprendizaje y cálculo; sin contratación, contacto comercial ni ejecución. |
| 13. Remuneración y conflictos | Sin afiliación, patrocinio ni monetización nuevos. |
| 14. Actividad vinculada | Se conservan independencia y separación, con sus avisos y páginas accesibles. |
| 15. Datos personales | No introduce recogida, almacenamiento ni transmisión. Las pruebas usan perfiles desechables y entradas sintéticas. |
| 16. IA | No añade IA en ejecución. Conserva imágenes decorativas generadas para la maqueta y su procedencia. |
| 17. Fuentes y límites | Conserva textos, atribuciones, fechas, fórmulas, supuestos, avisos y enlaces existentes. |
| 18. Controles | Validaciones estáticas, render en escritorio/tablet, navegación por teclado, contraste, pruebas financieras y comparación con la compilación previa. Revisión visual local; no se firma aprobación humana en nombre del fundador. |

Clasificación del cambio: **verde**, presentación y organización. Esto no reclasifica las funciones preexistentes de los módulos. Las puertas de diseño, programación e integración se documentan aquí; la puerta de publicación queda fuera de esta orden.

## Contratos de comprobación adaptados

Las pruebas de cinco banners iguales se sustituyen por cuatro accesos del hub y dos espacios comunes, con las cuatro áreas de cada web y la estructura 4+2 de Qué es NUVIA. Los límites tipográficos y fondos se especifican por identidad y anchura de pantalla; los títulos grandes ya no quedan fuera del control de escala. Academia exige dos ramas excluyentes en fuente y un solo h1 visible en cada estado.

Se conservan los controles AA, foco visible, objetivos de 44 px, enlaces, fuentes, avisos, contenidos externos, tablas, estados, SVG, cálculo y datos. No se desactiva ninguna prueba financiera. Las cabeceras nuevas se comprueban con selectores reales que deben encontrar elementos, evitando aprobaciones vacías.

## Validación

Evidencias en `output/integracion-ecosistema-20261112/`.

| Comprobación | Resultado y evidencia |
|---|---|
| `npm run build` | Finalizado con código 0. Incluye `npm run validate`, `npm run auditar`, compilación y validadores de `dist/`; los 51 estados de escritorio pasan. `build.log`. |
| Auditoría tablet completa | Finalizada con código 0: 51 vistas a 1024 y 768 px, 102 comprobaciones sin incidencias de contraste, tipografía, superficies, desbordes, foco, controles, interacción, contenido o consola. `auditar-tablet.log`. |
| Aplicación de empresas | Contratos completos a 1440, 1280, 1024, 820 y 768 px: pestañas, gráficos, fechas, datos, estados, cancelación y aislamiento. `build.log`. |
| Cáscara y navegación estática | 28 páginas; cuatro webs, dos comunes, institucionales y todos los recursos alcanzables. `validate-nucleo.log`. |
| Generación repetible | Dos ciclos de generación y sincronización dejan idénticos los 31 HTML de raíz. `generacion-idempotente.json`. |
| Academia | 20 variantes de URL/controlador; 26 comprobaciones de render y 20 contratos funcionales; seis métodos originales intactos. `academia-controlador.json`, `academia-estatica-render.json`, `academia-contratos-render.json`. |
| Navegación por teclado | 18 vistas a 1440/768 y 14 contextos con estado activo/aliases correctos. `navegacion-teclado.json`, `navegacion-vista-activa.json`. |
| Resultados funcionales | 9/9 escenarios iguales entre la compilación anterior y la integrada; cero errores nuevos de JS, consola o recursos locales. `funciones.json`. |
| Contenido y motores conservados | 23 interiores y Academia comprobados en fuente y `dist`; 48 archivos originales de datos, bibliotecas y descargas comparados en ambos destinos: 96/96 idénticos. `preservacion.json`. |
| Empresas | JavaScript compilado idéntico: SHA-256 `680b4ddb23187306bcd54336f6dc2384bad8f8cec35664cf3a7376e30a0483a0`. Cambia el nombre del asset por la dependencia CSS. `empresas-bundle.json`. |
| Despliegue estático simulado | 22 vistas en escritorio/tablet bajo `/NUVIA-PORTAL-ALFA/`, enlaces y recursos válidos, un h1 visible y ningún error local. `compilacion-prefijo.json`. |
| Impresión | Seis páginas y 616 elementos del contenido principal: mismos estilos calculados, visibilidad, etiquetas y valores. La nueva cabecera y el pie de navegación se ocultan al imprimir; la versión anterior los imprimía. `print-preservacion.json`. |

La primera ejecución de `auditar` detectó el espacio insuficiente del arte rotado, un enlace «Cursos» ligeramente menor de 44 px y contratos antiguos de cifras grandes. Se reservaron las dimensiones reales del arte sin cambiar su tamaño visible, se fijó el ancho mínimo de los enlaces y se documentaron por selector los tamaños numéricos originales. La revisión tablet detectó además el margen heredado del selector fiscal combinado con un ancho del 100%; se corrigió el margen, conservando el selector completo. `auditar.log` conserva esa primera ejecución; `build.log` y `auditar-tablet.log` recogen las pasadas finales aprobadas.

Las pruebas de navegador se ejecutan sin conexiones externas y con perfiles efímeros. Verifican los motores locales, estados sin conexión, respaldo de empresas y carga voluntaria de vídeo. No acreditan vigencia de cifras remotas ni reproducción de YouTube. La comparación histórica usa los motores reales y el respaldo local, sin simular respuestas de producción ni utilizar datos personales del usuario; los tests oficiales de estados mantienen sus fixtures sintéticos originales.

Los scripts de comparación histórica requieren la captura local previa en `output/`; no son requisitos nuevos de CI. Las comprobaciones del código versionado siguen ejecutándose mediante `npm run validate` y `npm run build`.

## Revisión local

La versión principal se abre en `http://127.0.0.1:4187/`, servida directamente desde `dist/`. Se conserva el origen del navegador de la maqueta sin migrar ni modificar el almacenamiento del usuario. El servidor de transformación de la maqueta deja de utilizarse. Los originales de diseño permanecen como antecedentes fuera de la compilación.
