# Claridad editorial y espacios comunes · 12-11-2026

## Orden y alcance

El fundador solicita analizar la homogeneidad, claridad y facilidad del conjunto y, tras la auditoría, ordena «Sigue». Se implementan las propuestas editoriales de `AUDITORIA_INTEGRAL_CLARIDAD_Y_DISENO_20261112.md` en la portada de Familia y bienestar, sus cuatro subsecciones y dos ensayos, Lecturas, Colaboradores, Qué es NUVIA, Cómo trabajamos e Independencia.

Se mantiene el repositorio ALFA. Este trabajo no realiza publicación, commit, operaciones de Firebase ni cambios de motores. La cáscara y la definición canónica se coordinan desde Núcleo en la actuación general. Se conservan rutas, anclas, materiales, fichas de libros, fotografías, vídeos voluntarios y textos firmados.

## Prueba previa del §12

1. **Necesidad:** encontrar antes los materiales disponibles, distinguir su naturaleza, autoría y alcance, y consultar el método mediante ejemplos existentes.
2. **Entradas:** contenidos públicos ya presentes; selección local de filtros y enlaces por el lector. No hay nuevas entradas de datos.
3. **Transformación:** reorganización de bloques y aclaración de etiquetas; no cálculos ni tratamiento de datos.
4. **Salida:** mismos libros y ensayos, disponibilidad explícita de temas, personas diferenciadas de áreas de trabajo y ejemplos enlazados de fuentes/cálculos.
5. **Instrumentos o emisores:** no se añaden; se conservan las lecturas educativas existentes.
6. **Circunstancias personales:** no se solicitan ni se utilizan.
7. **Comprar/vender/mantener/no actuar:** no se sugiere ninguna de esas acciones.
8. **Valor o precio:** no se formula opinión sobre valor o precio de activos.
9. **Orden por atractivo inversor:** no; se conserva el orden de los cuatro libros y de los dos ensayos. La disponibilidad editorial distingue material publicado de material en preparación.
10. **Recomendaciones ajenas:** no se añaden; las notas siguen distinguiendo perspectiva del autor y criterio de NUVIA.
11. **Veredictos visuales:** no; el diseño distingue categorías y funciones, no idoneidad ni mérito financiero.
12. **Acciones/contactos:** enlaces a contenido existente y apertura voluntaria de vídeo/ficha. Sin formularios, contratación ni captación.
13. **Remuneración/conflicto:** no se añade remuneración, patrocinio ni afiliación. Se conservan los avisos de independencia.
14. **Separación profesional:** no se conecta a actividad comercial externa; Colaboradores describe aportaciones editoriales y técnicas.
15. **Datos personales:** no se recopilan ni almacenan. Las atribuciones existentes se conservan; no se inventan integrantes, credenciales o biografías.
16. **IA:** asistencia al desarrollo y redacción de interfaz; no se incorpora IA al producto ni se genera consejo individual.
17. **Fuentes y límites:** mismos enlaces y fechas de publicación; notas editoriales completas y aviso sanitario preservados. Ejemplos de metodología apuntan a herramientas/documentación existentes.
18. **Prevención de regresiones:** comparación de texto firmado, fichas, scripts y enlaces; pruebas editoriales y de módulos; revisión de escritorio/tablet y controles de Lecturas/vídeo.

**Clasificación y revisión:** reorganización informativa sin personalización decisoria; especial atención documental a colaboradores y contenido sanitario (§9). La implementación no añade personas, afirmaciones sanitarias ni recomendaciones. Se revisan las atribuciones y se conserva su texto. No se bloquean funciones.

## Cambios realizados

- **Familia y bienestar:** la portada generada presenta primero los dos ensayos disponibles, después las cuatro categorías en su orden original. Tres temas se identifican expresamente como preparación. Se conserva `#recursos` y se añade `#lecturas-bienestar`; los índices sanitarios siguen en `#fuentes-bienestar`. Los tres avisos previos se agrupan en una misma zona de fuentes y alcance, conservando las afirmaciones distintas sobre finalidad educativa, diagnóstico/tratamiento, atención profesional, ausencia de solicitudes de datos de salud, revisión sanitaria y ausencia de aval de las fuentes.
- **Subsecciones:** estados pendientes junto a sus accesos; las páginas en preparación ya remiten a los dos ensayos publicados, no solo a uno.
- **Ensayos:** una introducción editorial breve y un enlace a `#notas-editoriales` preceden al texto. Las notas completas siguen después, sin cambios en sus párrafos. El artículo firmado —incluidos firma, fecha y entradilla— y el bloque de vídeo permanecen idénticos.
- **Lecturas:** el catálogo completo precede a la bienvenida secundaria. Se mantienen las tres colecciones como filtros, las cuatro fichas en el mismo orden, los motivos, límites, fuentes, diálogo y comunidad futura. La entrada dice qué libros reúne; «Clásicos imprescindibles» pasa a una etiqueta temática. La frase literaria anterior se conserva en la bienvenida.
- **Colaboradores:** Óscar Antiza e Isabel Florido Mayor aparecen como personas; Equipo Cuantitativo y Comité Didáctico, como áreas de trabajo cuyas fichas no identifican integrantes. Se conservan las cuatro biografías, papeles, fotografía y enlace de Isabel; se añaden accesos a aportaciones existentes. No se añaden personas ni credenciales. «Cómo colaboramos» sustituye al rótulo normativo interno, manteniendo sus límites.
- **Qué es NUVIA:** tres ejemplos de utilidad —Vivienda, Jubilación y Conceptos esenciales— preceden al manifiesto completo. Las seis entradas y el relato canónico se conservan. El cierre diferencia «Explorar NUVIA» de «Cómo trabajamos».
- **Cómo trabajamos e Independencia:** tres ejemplos enlazados de dato, cálculo y explicación acercan el método a páginas existentes. Se mantiene todo el proceso y las declaraciones de independencia; las tarjetas eliminan alturas vacías en pantalla para mejorar la lectura en tablet. Los estilos propios nuevos no modifican las reglas de impresión.

## Archivos

- Fuente de portada: `scripts/ecosistema/bienestar.mjs`; se actualizó solo el `main` correspondiente en `bienestar.html`, sin ejecutar el generador global.
- Interiores de Bienestar: `respiracion-relajacion.html`, `movimiento-consciente.html`, `nutricion-equilibrada.html`, `descanso-limites-tiempo-propio.html`, `la-respiracion-como-el-escultor-del-cerebro.html`, `que-es-meditar.html`.
- Comunes/institucionales: `lecturas.html`, `colaboradores.html`, `que-es-nuvia.html`, `metodologia.html`, `independencia.html`.
- Estilos: `estilos/ecosistema/bienestar.css`, `interiores-bienestar.css`, `interiores-lecturas.css`, `interiores-colaboradores.css`, `interiores-nuvia.css`.
- Contrato editorial: `docs/nuvia-editorial-clarity.test.mjs`. No depende de prototipos, archivos ignorados o capturas; protege los textos firmados y fichas con huellas normalizadas únicamente por finales de línea, y la nueva jerarquía editorial con destinos reales.

## Validación local

- Pasan `node docs/nuvia-editorial-clarity.test.mjs .`, `nuvia-wellbeing-entry.test.mjs`, `nuvia-readings-entry.test.mjs` y `nuvia-trust-pages.test.mjs`.
- Comparación inmediata antes/después: scripts originales y cáscaras intactos en las doce páginas de esta actuación; cuatro fichas y diálogo íntegros; dos artículos firmados y bloques de vídeo íntegros. Las nuevas cáscaras y metadatos se sincronizan después desde Núcleo, como actuación separada.
- Chromium, recursos externos bloqueados: **24 vistas** (12 rutas × 1440/768), **dos recorridos completos de filtros, fichas y teclado de Lecturas**, y **dos aperturas reales del enlace a las fuentes del PIB**. Cero errores de página, desbordamientos horizontales o destinos internos ausentes. Ver `output/claridad-editorial-20261112/render-funciones.json` y capturas.
- Tras compactar las tarjetas institucionales, comprobación dirigida de **otras cuatro vistas** de Metodología/Independencia a 1440/768: cero incidencias (`render-confianza-final.json`).
- Auditor oficial `scripts/check-render.mjs` a **1024 y 768 px en 14 rutas**: Inicio, Economía, Bienestar, Lecturas, Colaboradores, Qué es NUVIA, Cómo trabajamos, Independencia y los seis interiores de Bienestar. La primera pasada de 28 vistas detectó únicamente el título nuevo de ejemplos de Qué es NUVIA a 33 px en tablet, fuera de su escala. Se eliminó esa excepción para conservar los 36 px ya aprobados, sin modificar pruebas. La repetición dirigida de esa ruta en ambos anchos pasa con cero incidencias. Registros: `auditoria-oficial-tablet.log` y `auditoria-oficial-tablet-correccion.log`, en la misma carpeta de evidencias.
- El primer libro pasa de 1455/1614 px en la auditoría a **968/985 px** en 1440/768, conservando la bienvenida más abajo. Son medidas del render local, no métricas de uso.
- La prueba de definición confirmó todos los enunciados canónicos; su lista literal de nombres antiguos estaba pendiente de adaptación por Núcleo en el momento de esta comprobación. Validación transversal, módulos completos y compilación corresponden al cierre coordinado de la actuación general; no se han omitido ni relajado controles.

No se publican cambios desde esta actuación ni se modifica Git o Firebase.
