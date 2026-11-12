# Rediseño de las cuatro portadas del Ecosistema NUVIA

**Fecha:** 12-11-2026. **Estado:** maqueta local terminada y abierta en el navegador; sin publicación.

## Orden del fundador

«Me gusta esta línea. Ahora rediseña las portadas de las cuatro webs para que cada una tenga personalidad propia y encaje con el ecosistema, manteniendo ese equilibrio entre cercanía y profesionalidad.»

La orden se aplica a las cuatro portadas de la propuesta navegable. Autoriza extender la nueva dirección visual a las hijas; no implica migrar la arquitectura, modificar herramientas o publicar. El hub aprobado se conserva: su HTML mantiene exactamente el mismo SHA-256 que al inicio de esta intervención (`08362dea326435271e871e8873dfcbf424f02290de320ef849be989fc141befb`).

## Dirección de diseño

La idea compartida es conocimiento conectado y accesible. Se conservan logotipo, Newsreader para titulares e Inter para textos, fuentes locales y colores de los tokens: azul NUVIA, blanco, nube, verde y bronce. El énfasis de cada composición responde a su contenido. No se añade una marca distinta por web.

| Portada | Personalidad y composición | Accesos conservados |
|---|---|---|
| Economía y Finanzas | Observatorio editorial. Gran titular alineado a la izquierda, lente azul escultórica a la derecha y contraste entre actualidad abierta y panel azul de análisis. | Informes, Mercados, Cartera y Empresas |
| Patrimonio | Hogar y perspectiva. Fondo papel, acento bronce, escena de conversación familiar en arco y cuatro áreas en filas amplias. | Vivienda, Jubilación, Impuestos y Planificación |
| Familia, Salud y Bienestar | Naturaleza y pausa. Apertura tipográfica verde, fotografía de paseo compartido, cuatro temas abiertos y ensayos con autoría y fecha. | Respiración, Movimiento, Nutrición y Descanso; dos ensayos existentes |
| Academia NUVIA | Taller de ideas. Escultura de papel y vidrio a la izquierda, «Saber es patrimonio.» a la derecha, entradas por intención y una franja para experimentar con el interés compuesto. | Esenciales, Cursos, Glosario, Simulador, Fundamentos y Activos |

La cercanía procede de textos claros, escenas cotidianas y libertad para elegir el acceso. La profundidad profesional se expresa en la jerarquía, la precisión de los destinos y los avisos de alcance, sin aparentar asesoramiento o prometer resultados.

## Implementación

- `webs.mjs` y `webs.css`: plantilla común de cabecera, menú local, selector, pie y fundamentos visuales de las cuatro páginas de maqueta.
- `economia.mjs/.css`, `patrimonio.mjs/.css`, `bienestar.mjs/.css`, `academia.mjs/.css`: cuerpos y composiciones de cada portada.
- `generar.mjs`: datos de destino existentes y composición de las cinco páginas desde sus plantillas.
- `ecosistema.js`: conserva el cierre del selector con Escape y clic fuera. No se incorpora otro JavaScript de interfaz.
- README y plan actualizados; `plan.html` regenerado. Esta acta se añade al índice de propuestas.

Todos esos archivos están en `prototipos/ecosistema-nuvia-20261112/`, salvo las actas en `docs/`. La cáscara productiva, el registro de páginas, los tokens y las herramientas no se modifican. No se ejecuta `shell:sync` porque no se interviene en `_plantilla.html`. Las plantillas previas quedan archivadas en `output/ecosistema-20261112/antes-cuatro/`.

La navegación local lleva a recursos reales del portal, conservando parámetros y fragmentos. Desde cada portada se vuelve al hub por la marca, el selector o el pie. El selector también permite cambiar directamente de web. Lecturas, Colaboradores y Qué es NUVIA permanecen accesibles.

## Imágenes originales

Se crearon cuatro piezas con la herramienta integrada de generación de imágenes. Economía y Academia reciben esculturas de vidrio, metal y papel; Patrimonio y Bienestar, escenas familiares generadas. Se trata de imágenes decorativas, sin identidad atribuida a clientes o colaboradores, testimonios, cifras ni promesas. Ningún nombre o enlace está incrustado en ellas.

Los originales y versiones WebP viven en `prototipos/ecosistema-nuvia-20261112/assets/`. El inventario, tamaños, exportación técnica y prompts completos están en [Procedencia de las imágenes](../prototipos/ecosistema-nuvia-20261112/assets/PROCEDENCIA_CUATRO_WEBS.md). Las cuatro versiones web suman 827.242 bytes; se carga únicamente la correspondiente a la portada visitada. No se solicitan imágenes ni fuentes a terceros al navegar.

## Revisión del marco, §12 y §13

Se revisaron las 18 preguntas de la ficha completa del anexo A de `PLAN_ECOSISTEMA_NUVIA_20261112.md` contra los nuevos textos y destinos. Sus respuestas se mantienen: entradas públicas educativas, sin perfilado ni cálculo nuevo, sin instrumentos propuestos, contratación o derivación, y sin datos personales solicitados o persistidos.

| Cambio material | Resultado de la revisión |
|---|---|
| Nueva presentación de Economía y Patrimonio | Descripción de contenidos, herramientas y supuestos; sin selección de inversiones, idoneidad, recomendaciones o llamadas a operar |
| Presentación de Academia | Aprendizaje por intención, sin progreso, duración, catálogo o resultados inventados; interés compuesto explicado como escenario matemático |
| Destacados de Bienestar | Se enlazan los dos ensayos existentes de Isabel Florido Mayor, conservando sus títulos y fechas; no se modifica su contenido ni se añaden credenciales |
| Disponibilidad de Bienestar | Respiración muestra dos artículos; las otras tres áreas siguen indicando artículos en preparación, sin ocultarlas |
| Nuevas imágenes | Escenas y objetos decorativos generados; no son testimonios ni evidencias sanitarias o financieras |
| Datos y servicios | Sin formularios, analítica, cookies, persistencia, iframes o nuevas APIs |
| Separación profesional | No se incorpora captación, patrocinio, afiliación o conexión comercial con entidad alguna |

Clasificación interna propuesta **verde** para estas portadas y su navegación. No reclasifica las herramientas existentes, ni sustituye sus controles. Los avisos informativos figuran en las cuatro portadas; no se utilizan para justificar funciones incompatibles. Las puertas del §13 se mantienen en el alcance de una maqueta local, sin autorización de publicación ni validación jurídica externa.

## Revisión y validación

La revisión visual se realizó sobre capturas de las cuatro portadas a 1440 y 768 px. Economía y Academia recibieron además una revisión independiente. Se ajustaron el encuadre de Bienestar para conservar las cabezas dentro de la imagen, su escala de titular en tablet y un espacio tipográfico de Academia. Se retiró un ornamento innecesario de Patrimonio y se comprobó que todas las variables CSS utilizadas existen en los tokens.

| Comprobación | Resultado |
|---|---|
| Cinco portadas × siete anchos, 1440 a 768 px | 35 renders correctos |
| Estructura y geometría | Un H1; sin desbordes; recursos cargados; texto ≥12 px y objetivos ≥44 px |
| Destinos | 38 enlaces locales únicos con archivo existente y 20 destinos de contenido requeridos presentes dentro de main |
| Interacción | Cuatro entradas del hub, regreso, selector con teclado, Escape y recuperación de foco correctos |
| Movimiento reducido | Correcto; sin animaciones obligatorias o navegación dependiente del hover |
| JavaScript y red | Sin errores de ejecución ni peticiones a servicios externos en la maqueta |
| Hub aprobado | HTML idéntico, comprobado con SHA-256 |
| Validación por módulo | Núcleo, Economía, Patrimonio, Bienestar y Academia: código 0 |
| `npm run build` | Código 0; incluye validate, auditar, construcción y controles de dist |
| Auditoría global | 50 páginas/vistas del portal a 1440 px correctas |
| Empresas | Render correcto a 1440, 1280, 1024, 820 y 768 px, en modo de prueba sin red externa |

Evidencias en `output/ecosistema-20261112/`: `prototipo-validacion.json`, capturas `<web>-{1440,768}.png`, `cuatro-modulos-resultados.json`, `cuatro-build-resultado.json` y logs `cuatro-*.log`. Las validaciones productivas corrieron sin modificaciones de sus fuentes; el render de la maqueta se repitió tras los últimos ajustes.

Se mantienen dos avisos previos de producción: expresión de plantilla en el H1 de Academia y tres imágenes sin `loading="lazy"` en Lecturas. Los renders correspondientes pasan. Las pruebas se realizan con Chromium instalado y `NUVIA_RENDER_OFFLINE=1`; no prueban disponibilidad de servicios remotos. La revisión visual y geométrica no equivale a una certificación integral de accesibilidad ni a investigación con usuarios.

## Entrega

Las cuatro nuevas portadas se abrieron y verificaron en el navegador, conservadas como pestañas de revisión. El hub también permanece disponible. Base local: `http://127.0.0.1:4187/prototipos/ecosistema-nuvia-20261112/`. El servidor local sigue activo para permitir la navegación solicitada. No se crean commits, no se despliega y no se escribe en Firebase.
