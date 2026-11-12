# NUVIA · Validación de la propuesta de ecosistema

**Fecha:** 12 de noviembre de 2026. **Estado:** plan y maqueta local terminados para revisión; arquitectura de producción sin migrar.

**Actualización posterior del mismo día:** por orden expresa del fundador se ha rediseñado por completo la portada común. Este documento conserva la validación de la primera entrega; el diseño actual y sus nuevas pruebas se documentan en [Rediseño de la portada del ecosistema](REDISENO_PORTADA_ECOSISTEMA_20261112.md). Las cuatro portadas hijas conservan exactamente su contenido. Las nuevas capturas y el JSON de revisión están en la misma carpeta de evidencias; las capturas iniciales del hub y su JSON se conservan en `output/ecosistema-20261112/anterior/`.

## Orden y alcance

El fundador solicita un plan completo y una propuesta estética y ordenada para una portada común que distribuya a cuatro webs: Economía y Finanzas, Patrimonio, Familia, Salud y Bienestar y Academia NUVIA. Lecturas con Criterio y Colaboradores pasan a ser espacios transversales en la propuesta. Confirma el equilibrio entre cercanía familiar y profundidad profesional.

Se entrega el [plan completo](PLAN_ECOSISTEMA_NUVIA_20261112.md), una [versión visual de lectura](../prototipos/ecosistema-nuvia-20261112/plan.html) y [cinco portadas navegables](../prototipos/ecosistema-nuvia-20261112/index.html). Las herramientas y páginas editoriales enlazadas son las existentes; no se han reconstruido cuatro webs completas ni creado cuatro despliegues.

## Cambios realizados

- Documento de arquitectura, navegación, marca, contenido, alternativas técnicas, rutas, fases, mantenimiento, esfuerzo orientativo y decisiones para el fundador.
- Maqueta local en `prototipos/ecosistema-nuvia-20261112/`, con una plantilla de cabecera y pie en `generar.mjs`, estilos propios que consumen los tokens existentes y un selector accesible de webs.
- Cinco portadas estáticas, sin formularios, persistencia, llamadas a APIs, iframes ni recursos de terceros.
- Lectura visual del plan generada desde el Markdown, con índice de 16 secciones, en `plan.html`.
- Documentación de uso y revisión reproducible en `README.md` y `verificar.mjs`.
- Entradas en `docs/INDICE.md` bajo «Propuestas pendientes de decisión», conservando sus cambios anteriores.

No se modifican las fuentes de las páginas productivas, `_plantilla.html`, los tokens, el registro de páginas, el sitemap, la definición canónica, el backend ni Firebase. No se crean commits, repositorios o dominios ni se publica. Las validaciones regeneraron los artefactos locales ignorados de `company-analysis/build/` y `dist/`.

## Prueba regulatoria y revisión

Las 18 respuestas del §12 y el estado de las puertas del §13 están en los anexos A y B del plan. Clasificación interna propuesta de la nueva orientación y navegación: **verde**. No reclasifica las herramientas de Cartera/Empresas o las funciones de IA existentes. No constituye validación jurídica externa, fuera de alcance en alfa.

Se revisaron textos, orden, nombres y acciones: no hay perfilado, recomendación inversora, diagnóstico, contratación o derivación. Se muestra el contenido real de Bienestar: dos artículos en Respiración y tres áreas con artículos en preparación. No se añade «Familia y trabajo».

La revisión independiente de contenido y diseño propuso tres ajustes, incorporados: menús locales con enlaces directos al recurso, flechas de navegación interna y encuadre familiar de la portada en tablet. También se corrigieron un objetivo táctil pequeño, tamaños de texto inferiores a 12 px y la representación del símbolo de Lecturas. Las fotografías de las cinco vistas son distintas; se emplean activos existentes como referencias de rediseño, sin incorporarlos a otra página publicada.

## Resultados verificables

| Comprobación | Resultado |
|---|---|
| `npm run validate:nucleo` | Correcto, código 0 |
| Compilación de `company-analysis` y batería global previa a render, dentro de `npm run build` | Correctas |
| `npm run auditar` con Chromium local y modo sin red externa | Correcto, código 0; 50 páginas/vistas del portal a 1440 px |
| Continuación de las 27 etapas de build posteriores a `validate`, en el orden de `package.json` | Correcta, código 0 en todas |
| Render específico de Empresas | Correcto a 1440, 1280, 1024, 820 y 768 px; incluye escenarios simulados, sin conexiones externas |
| Construcción resultante | `dist/`: 30 páginas, 69 assets, 20,4 MB; controles posteriores correctos |
| Exclusión de la propuesta | Confirmado que el prototipo no está registrado ni incluido en `dist/` |
| Cinco portadas × siete anchos (1440, 1280, 1180, 1024, 900, 820 y 768 px) | 35 comprobaciones correctas |
| Geometría de maqueta | Sin desbordes ni elementos fuera del ancho; controles visibles ≥44 px; texto ≥12 px |
| Recursos de maqueta | Imágenes y fuentes locales cargadas; 39 destinos locales únicos con archivo existente |
| Estructura e interacción de maqueta | Un H1 por portada; salto al contenido, selector por teclado, Escape con retorno de foco, navegación Atrás y movimiento reducido comprobados |
| JavaScript y red de las cinco portadas | Sin errores de ejecución ni solicitudes HTTP externas |
| Plan visual a 1440 y 768 px | Sin desborde de página, un H1 y los 16 destinos del índice presentes |
| `git diff --check` | Correcto; sin errores de whitespace en el diff rastreado |

### Incidencias de entorno resueltas

La primera ejecución de `npm run build` acabó con código 1 al buscar Chromium en un perfil sandbox que no contiene la instalación. Se fijó `PLAYWRIGHT_BROWSERS_PATH` a la caché local existente. El siguiente intento de auditoría encontró una restricción de acceso a `127.0.0.1`; la auditoría se ejecutó después con la escalación de entorno aprobada automáticamente y `NUVIA_RENDER_OFFLINE=1`.

Las etapas restantes se ejecutaron en orden, sin modificar ni relajar pruebas y sin repetir las que ya habían pasado. Por precisión, el resultado es **«build completado por etapas»**, no una única ejecución de `npm run build` con código 0. La maqueta se revisó directamente desde archivos locales y no necesitó red.

### Avisos existentes

- El comprobador estático avisa de una expresión de plantilla en el H1 de Academia; su render posterior pasó.
- Lecturas presenta tres imágenes sin `loading="lazy"`.

Son avisos previos al trabajo, conservados sin cambiar su código en esta propuesta. No hubo fallos en la auditoría de render completada.

## Evidencias locales

- `output/ecosistema-20261112/validation-summary.json`: resumen exacto de comandos y continuación.
- `output/ecosistema-20261112/validate-nucleo.log`, `build.log`, `auditar-local.log`, `build-continuation.log` y `build-continuation-results.json`.
- `output/ecosistema-20261112/prototipo-validacion.json`: 35 revisiones de las portadas.
- `output/ecosistema-20261112/{index,economia,patrimonio,bienestar,academia}-{1440,768}.png`: capturas para revisión visual.
- `output/ecosistema-20261112/portada-resumen.png` y `plan-{1440,768}.png`.

## Límites de la evidencia

Las pruebas de geometría, enlaces y teclado de la maqueta no equivalen a una certificación integral de accesibilidad. Se ha revisado visualmente su legibilidad con los tokens de marca; la evaluación completa del efecto del diseño seguirá formando parte de la integración final. La matriz de 35 renders corresponde a las cinco portadas propuestas; no a todas las páginas del portal en siete anchos.

La auditoría existente se realizó sin acceso a red externa y Empresas usó respuestas simuladas. No se verificó disponibilidad actual de proveedores, datos remotos ni Firebase. No se hicieron pruebas con usuarios, mediciones de conversión ni una migración real de datos o URLs.

La decisión pendiente es de producto: adoptar el nombre, la arquitectura, el diseño y el alcance de implantación propuestos. La publicación conserva su autorización propia. El plan no registra aprobación en nombre del fundador.
