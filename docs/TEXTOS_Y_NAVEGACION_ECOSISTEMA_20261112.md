# Textos y navegación del Ecosistema NUVIA

**Orden del fundador, 12-11-2026:** «Ahora revisa los textos y la navegación de todo el ecosistema para que reflejen la nueva estructura de cuatro webs, con Lecturas y Colaboradores como espacios comunes, sin perder contenidos ni funcionalidades.»

**Alcance:** revisión de la maqueta local en `http://127.0.0.1:4187/`. No constituye publicación ni separación técnica en cuatro repositorios. Las páginas productivas y sus motores mantienen sus archivos originales.

## Criterio editorial y recorrido

Ecosistema NUVIA es la portada común. Da acceso a cuatro webs con sus nombres completos: Economía y Finanzas; Patrimonio; Familia, Salud y Bienestar; Academia NUVIA. Lecturas con Criterio y Colaboradores son espacios comunes. Qué es NUVIA, Metodología e Independencia explican el proyecto y sus criterios.

El documento vivo `DEFINICION_NUVIA.md` registra primero esta organización como propuesta local, separada de la presentación productiva. Los 16 párrafos originales de definición se conservan palabra por palabra. La revisión no cambia la misión, los valores, los límites educativos ni la independencia.

Las rutas siguen la jerarquía `Ecosistema NUVIA → web → contenido/herramienta`. La marca vuelve al ecosistema; el nombre de cada web y «Portada» vuelven a esa web; el selector distingue las cuatro webs, los espacios comunes y la información institucional. En Academia, «Interés compuesto» identifica el simulador al que lleva el enlace, en lugar de la etiqueta genérica «Herramientas».

Qué es NUVIA sustituye la explicación de cinco espacios por cuatro webs y un grupo propio de espacios comunes. Conserva íntegros los párrafos de las cuatro especialidades, Lecturas, propósito, valores y límites; añade el acceso a Colaboradores con la descripción registrada en la definición. Lecturas mantiene su catálogo, filtros y cuatro fichas. Colaboradores conserva las cuatro biografías, áreas, retrato, autorías y enlaces.

Metodología e Independencia usan también la cáscara común. El pie deja de afirmar que sus enlaces salen al «portal actual». Los accesos de las portadas indican el destino real. Se reincorpora a Bienestar el bloque original de fuentes y límites, con sus enlaces a OMS y MedlinePlus.

## Conservación y compatibilidad

`presentacion.mjs` contiene sustituciones editoriales limitadas al `main`. Cada cambio exige coincidencias exactas del texto anterior y guarda posición, texto anterior y texto nuevo. Deshacer exclusivamente ese registro debe reconstruir el `main` original byte a byte; cualquier diferencia adicional produce error. Los scripts originales mantienen sus firmas y orden. No se sustituyen números, resultados, gráficos, formularios, artículos firmados ni contenido dinámico.

Los enlaces nuevos de regreso a Bienestar usan `#recursos`; la ruta de aprendizaje de Academia incluye explícitamente `?tab=inicio`. Se conservan los enlaces entrantes antiguos mediante equivalencias de anclas en `ecosistema.js`: Inicio, las cuatro portadas y las rutas de aprendizaje. Se comprueba tanto la llegada inicial como un cambio posterior de fragmento. No se cambian el origen habitual 4187, los parámetros de cálculos ni el almacenamiento del usuario.

Las pruebas de conservación de la entrega visual anterior exigían ausencia de cualquier cambio en el texto. Esta orden sí autoriza revisar presentación y navegación: ahora exigen reversibilidad exacta de los cambios registrados y comparación de DOM/impresión contra el contenido editorial esperado. Se mantienen las comparaciones completas de fichas, scripts, recursos y funciones. Las pruebas normativas del proyecto no se modifican.

## Prueba regulatoria §12

| Pregunta | Respuesta |
|---|---|
| 1. Necesidad | Comprender la organización y llegar a todos los contenidos y herramientas |
| 2. Entradas | Selección de enlaces; ninguna entrada nueva de datos |
| 3. Transformación | Etiquetas, presentación institucional, agrupación de enlaces y compatibilidad de rutas |
| 4. Resultado | Cuatro webs conectadas y espacios comunes inequívocos |
| 5. Instrumentos/emisores | Ninguno nuevo; datos existentes sin cambios |
| 6. Circunstancias personales | No se solicitan ni utilizan para navegar |
| 7. Operación | No se añaden llamadas a comprar, vender o mantener |
| 8. Precios/valoración | No se emiten nuevas opiniones o valoraciones |
| 9. Atractivo inversor | No se ordenan ni destacan instrumentos |
| 10. Recomendaciones de terceros | No se incorporan; textos firmados intactos |
| 11. Diseño/navegación | Orientación por materia, sin veredictos sobre resultados |
| 12. Acción/contacto | Acceso a páginas existentes; sin contratación ni contactos nuevos |
| 13. Remuneración | Sin patrocinio, afiliación ni derivación |
| 14. Separación profesional | Avisos y separación de NUVIA conservados |
| 15. Datos personales | Sin recogida, escrituras, migraciones ni uso del perfil personal para pruebas |
| 16. IA | Asistencia editorial y de código; no se crea una función de IA para lectores |
| 17. Fuentes/límites | Se conservan fuentes, fórmulas, supuestos y límites originales |
| 18. Regresión | Reversibilidad, comparación de DOM, navegación, anclas, funciones, contraste, render y build completa |

Clasificación del cambio: **verde, presentación y navegación educativas**. Las condiciones de los módulos existentes no cambian. §13: revisión local de contenido y código y pruebas antes de entrega. No se hace commit, publicación ni escritura en Firebase.

## Validación

Terminada sin incidencias pendientes. Evidencias en `output/ecosistema-20261112/`:

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Navegación completa | 42 rutas (37 vistas de interiores/comunes/institucionales y 5 portadas), 60 URL locales, 111 fragmentos, 9 recorridos y 13 compatibilidades; cero incidencias | `estructura-navegacion.json` |
| Conservación | 24 páginas originales, scripts en orden, 109 recursos y servidor GET/HEAD/Range; contenido idéntico fuera de las sustituciones registradas | `interiores-paridad.json` |
| Presentación | 37 vistas a 1440/1024/768: 111 comprobaciones, cero problemas | `estructura-render.json` |
| Portadas | 5 portadas a 7 anchos (1440–768), 35 comprobaciones; accesos, teclado, foco y movimiento reducido correctos | `prototipo-validacion.json`, `estructura-portadas.log` |
| Contenidos comunes/institucionales | 5 páginas, 10 comparaciones completas de DOM y 10 de impresión; cuatro fichas y tres filtros de Lecturas idénticos a 1440/768; 17 comprobaciones de navegación | `estructura-compartidos.json` |
| Funciones | 9 escenarios iguales al original: vivienda, jubilación, interés compuesto, glosario/activos, curso, mercados, modelos de cartera, empresas y vídeos voluntarios; cero errores nuevos | `estructura-funciones.json` |
| Regresión de navegación/impresión | Regresos desde cuatro webs, rutas antiguas de Academia, selección de Mercados y estilos de impresión de herramientas correctos | `estructura-regresion-navegacion.log` |
| Contraste | Cinco páginas comunes/institucionales a 1440/768 frente a su original; cero fallos AA de texto, errores o fondos sin resolver | `estructura-contraste.json`, `estructura-contraste-recortes.json` |
| Proyecto oficial | `npm run build` finalizó con código 0: incluye `validate`, `auditar`, compilación y comprobación de `dist/`, y Empresas en cinco anchos | `estructura-build.log` |

Las cuatro anclas de fases posteriores de Cartera se verifican como destinos condicionales «Tras calcular»: mismo `aria-disabled` y cancelación efectiva del clic que en la referencia, sin retirar enlaces ni alterar motores. Las fuentes de Bienestar se comparan contra el bloque original completo: exactamente OMS y MedlinePlus, con los mismos textos y límites. Ningún test normativo fue modificado o excluido.

Las pruebas funcionales se ejecutan en contextos temporales y sin red externa; verifican conservación y comportamiento local, no disponibilidad de servicios remotos. La maqueta habitual se reinició en 4187 con esta revisión, conservando el origen. La revisión de código independiente no detectó defectos nuevos en las transformaciones, las rutas ni la cáscara compartida.
