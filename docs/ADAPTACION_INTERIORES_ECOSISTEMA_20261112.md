# Adaptación de los interiores al Ecosistema NUVIA

**Orden del fundador, 12-11-2026:** «Ahora adapta también las páginas interiores de las cuatro webs a su nueva identidad visual, manteniendo todos los contenidos, calculadoras y funcionalidades actuales.»

**Estado:** implementación local completada; comprobaciones de contenido, render, funciones y navegación superadas. Se extiende la maqueta aprobada a las páginas reales, conservando sus rutas y sus motores. No se solicita ni realiza publicación.

## Arquitectura de preservación

El servidor local de revisión lee las páginas originales y añade la presentación del ecosistema en la respuesta. Las rutas, parámetros, fragmentos y origen se conservan; el servidor definitivo de revisión seguirá en `127.0.0.1:4187`. No se copian ni reconstruyen calculadoras. El contenido de main y los scripts originales se verifican antes y después de la transformación. El módulo Empresas se sirve desde su compilación local existente, en su ruta habitual.

La cabecera y pie de revisión proceden de una plantilla común del Núcleo de la maqueta. Las hojas visuales adicionales se cargan al final, por familia, sin alterar el orden original. Se limitan a pantalla para conservar la impresión. Los colores financieros, valores, controles, selección, fuentes y avisos conservan su función.

## Ficha previa, §12

| Pregunta | Respuesta para este cambio |
|---|---|
| 1. Necesidad | Continuidad visual y orientación entre portadas e interiores educativos |
| 2. Datos de entrada | No incorpora entradas; las herramientas conservan las elegidas por el lector |
| 3. Transformación | Apariencia y cáscara de navegación; ningún cálculo o transformación financiera nuevo |
| 4. Resultado | Los mismos contenidos y resultados dentro de la identidad de cada web |
| 5. Instrumentos o emisores | Los ya presentes en Cartera y Empresas; no se agregan ni seleccionan |
| 6. Circunstancias personales | Ninguna nueva; se mantienen los parámetros de los simuladores sin capturarlos |
| 7. Comprar, vender o mantener | No se incorpora ninguna sugerencia o llamada a operar |
| 8. Valor o precio | No se añaden opiniones o precios objetivo |
| 9. Atractivo inversor | Sin cambios de orden, clasificación, cobertura ni destacados de instrumentos |
| 10. Recomendaciones de terceros | No se añaden ni se reformulan contenidos como recomendaciones |
| 11. Color y navegación | Color por familia editorial, sin tocar el sentido de magnitudes, series o estados financieros |
| 12. Acción o contacto | Solo navegación a las funciones y contenidos existentes; sin contratación ni derivación |
| 13. Remuneración | Ninguna nueva |
| 14. Agente o entidad | Se mantiene la separación; no se añade marca o canal comercial |
| 15. Datos personales | Sin nuevas escrituras, persistencia, cuentas, logs de formularios ni transmisiones; origen del navegador conservado |
| 16. IA | No se incorpora IA en ejecución; no se generan nuevos contenidos factuales |
| 17. Fuentes y límites | Se conservan íntegros en main y en los documentos descargables |
| 18. Regresiones | Paridad de main/scripts/assets, pruebas actuales, comparación funcional y renders de las páginas y vistas |

Clasificación del cambio de presentación: verde; las funciones de instrumentos y datos patrimoniales conservan su clasificación y fichas vigentes, incluida la revisión ámbar de Empresas. El §13 se verifica en el alcance de la maqueta. No se añade ni retira ningún bloqueo funcional, ni se presume validación jurídica externa. Una discrepancia de contenido o función se corrige antes de entregar.

## Diseño aplicado

| Familia | Interior y personalidad |
|---|---|
| Economía y Finanzas | Aperturas editoriales en azul, lectores de informes, indicadores y laboratorio con bordes precisos; los colores de las magnitudes y las series se conservan |
| Patrimonio | Papel y bronce, titulares de libro, fotografías originales en arco, guías y formularios claros; la selección mantiene contraste y se distinguen los resultados de la navegación |
| Familia, Salud y Bienestar | Verde sereno, fotografía propia de cada tema y lectura amplia; ensayos, firma y vídeos conservan contenido, orden y activación voluntaria |
| Academia NUVIA | Azul hielo y papel, conocimientos esenciales, glosario, capítulos, lección del PIB y calculadora presentados como un cuaderno de aprendizaje |

La navegación compartida incluye selector del ecosistema, portada de cada web, sección activa y regreso. Los enlaces antiguos `academia.html#ruta-aprendizaje` y `#glosario` llegan a sus contenidos originales. La indicación de sección responde también a cambios de vista del motor existente. Metodología, Independencia y los textos informativos/legales del pie siguen disponibles. Lecturas y las páginas institucionales conservan su presentación actual; sus enlaces de regreso conducen al nuevo ecosistema local.

## Archivos y conservación

La implementación se limita a `prototipos/ecosistema-nuvia-20261112/` y documentación. Se añaden `servir-interiores.mjs`, `interiores.css`, cuatro hojas de familia e `interiores-empresas.css`. Se extraen las funciones de cabecera/pie de `webs.mjs` y se amplía `ecosistema.js` para la orientación local. Los archivos de las portadas no se regeneran por este cambio y el hub mantiene SHA-256 `08362dea326435271e871e8873dfcbf424f02290de320ef849be989fc141befb`.

Las 19 páginas originales, sus motores, el módulo fuente de Empresas, `_plantilla.html`, tokens, APIs, datos y configuración de publicación permanecen intactos. El servidor responde con HTML transformado, sin escribir copias de herramientas ni almacenar entradas. Empresas utiliza los bundles de `company-analysis/build`, generados por la compilación oficial. No se realiza commit, fusión, despliegue ni escritura en Firebase.

## Validación realizada

| Comprobación | Resultado y evidencia |
|---|---|
| Paridad de contenido | 19 `main` idénticos byte a byte; scripts originales idénticos y en el mismo orden. 5 portadas y 93 recursos locales comprobados. `interiores-paridad.json` |
| Servidor | GET/HEAD, contenido exacto, rangos de PDF/vídeo y rutas; bundles compilados idénticos. `interiores-paridad.json` |
| Presentación | 32 rutas/vistas × 1440, 1024 y 768 px = 96 comprobaciones sin desbordes, imágenes rotas, colisiones de cabecera ni errores JS/locales. Campos y botones mantienen el contrato existente. `interiores-render.json` |
| Portadas | 5 portadas × 7 anchos = 35 comprobaciones correctas; recursos, teclado y enlaces conservados. `prototipo-validacion.json`, `interiores-portadas.log` |
| Funciones | 9 recorridos comparados con el original, 9 equivalentes, cero errores nuevos. `interiores-funciones.json` |
| Navegación e impresión | Recorridos de las cuatro webs, enlaces antiguos, curso → ruta de aprendizaje, selección dinámica de Mercados y estilos de impresión del contenido en cuatro áreas: correctos. `interiores-navegacion.json` |
| Contraste de texto | 32 rutas × 2 anchos, comparadas con el original. Tras corregir la selección de Jubilación, la revisión dirigida de las 6 rutas afectadas da cero fallos AA. `interiores-contraste.json`, `interiores-contraste-parcial.json` |
| Proyecto oficial | `npm run build` terminó con código 0 e incluyó `validate` y `auditar`: 50 páginas/vistas originales, comprobaciones de `dist/` y Empresas a cinco anchos. `interiores-build.log` |

Todas las evidencias se guardan en `output/ecosistema-20261112/`. Las pruebas nuevas complementan las normativas, sin editarlas ni rebajar sus contratos. La revisión de contraste compara la maqueta con el original; el texto de las opciones seleccionadas de Jubilación se corrigió para conservar legibilidad sobre bronce.

El auditor adicional detectó inicialmente textos accesibles de los vídeos como si estuvieran pintados. Ya estaban recortados en el CSS original a 1 × 1 px. Se acreditó su ausencia visual con 16 comparaciones de píxeles antes/después de transparentar el texto, y el auditor ahora reconoce el recorte total de forma genérica, sin excepciones por selector ni cambios en la web. Evidencia: `interiores-contraste-parcial-recortes.json`. La comprobación de contraste se refiere al documento principal; no es una auditoría integral WCAG del iframe de Empresas.

Los recorridos funcionales incluyen las cinco vistas de Vivienda, cuota y tabla de amortización; Jubilación de Bizkaia a Madrid con cambio de supuestos; interés compuesto y gráficas; glosario y tipos de activos; cinco capítulos, calculadora y cuestionario del curso; informes diario/semanal y búsqueda; cuatro modelos de cartera; buscador y cuatro pestañas de Empresas; y vídeos que solo se activan tras pulsar reproducir.

## Límites y reproducción

La revisión automática se realizó con contextos temporales y red externa bloqueada **solo en las pruebas**. No se verificó la disponibilidad remota de Firestore, historiales ni reproducción de YouTube. Empresas se comparó con la misma compilación original y su respaldo local. Los controles de modelos conservan su comportamiento offline; no se afirma una ejecución remota de sus cálculos. El servidor entregado no añade ese bloqueo de red y mantiene las conexiones existentes.

Para abrir la maqueta completa desde la carpeta oficial:

```powershell
node prototipos/ecosistema-nuvia-20261112/servir-interiores.mjs
```

Abrir `http://127.0.0.1:4187/`. El servidor queda activo para la revisión. La producción continúa con su arquitectura vigente; esta entrega es la propuesta navegable integrada.
