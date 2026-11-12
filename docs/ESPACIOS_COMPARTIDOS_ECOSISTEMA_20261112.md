# Espacios compartidos del Ecosistema NUVIA

**Orden del fundador, 12-11-2026:** «Ahora adapta también Lecturas con Criterio, Colaboradores y Qué es NUVIA al nuevo diseño del ecosistema, manteniendo todos sus contenidos.»

**Estado:** implementación local terminada, con revisión de contenido, interacción, impresión, escritorio y tablet superada. Se amplía la maqueta existente; no se publica ni se modifica la definición canónica.

## Diseño y alcance

Las tres páginas comparten una cabecera del ecosistema, navegación entre ellas y selector de las cuatro webs. Conservan su naturaleza transversal: no se presentan como otra web especializada. La cabecera y el pie se generan desde el Núcleo de la maqueta, en `webs.mjs`.

Lecturas conserva el carácter de biblioteca editorial y sus cubiertas, categorías, filtros, fichas y criterio de selección. Colaboradores da protagonismo a las personas y mantiene todas las aportaciones, biografías, contactos y enlaces. Qué es NUVIA ofrece una lectura institucional abierta con las mismas imágenes, definición, cinco ámbitos y valores actuales. La petición no autoriza a reescribirlos para acomodarlos a la propuesta de organización.

La base visual es la ya aprobada: azul NUVIA `#0b2347`, blanco `#ffffff`, nube `#f4f6f9`, verde criterio `#4a5d23`, bronce editorial `#7a5c27` y papel `#faf7ee`, consumidos mediante tokens existentes. Newsreader aporta la voz editorial; Inter, la lectura y los controles. La composición responde al contenido de cada página y no repite la apertura de las cuatro webs.

Los documentos originales se leen desde el servidor local. Se conserva `main` byte a byte, así como los scripts y sus enlaces. Se añaden tres hojas CSS limitadas a pantalla, sin cambiar fuentes productivas, impresión, datos ni motores. El puerto definitivo continúa en `127.0.0.1:4187`.

## Prueba regulatoria §12

| Pregunta | Respuesta para este cambio |
|---|---|
| 1. Necesidad | Continuidad visual y navegación de los tres espacios comunes |
| 2. Entradas | Ninguna nueva; filtros y fichas de lectura existentes |
| 3. Transformación | Presentación en pantalla y cáscara común; sin transformación de contenido o cálculos |
| 4. Resultado | El mismo contenido con la identidad del ecosistema |
| 5. Instrumentos/emisores | No se incorporan instrumentos, emisores ni selecciones |
| 6. Circunstancias personales | No se recogen ni utilizan |
| 7. Operar | Ninguna llamada a comprar, vender o mantener |
| 8. Precios/valoraciones | Ninguna valoración nueva |
| 9. Atractivo inversor | No se cambian clasificaciones, orden ni destacados financieros |
| 10. Terceros | Textos y autorías preservados, sin nuevas recomendaciones |
| 11. Colores/navegación | Identidad editorial, legibilidad y orientación |
| 12. Contactos | Los existentes se conservan; sin nuevos contactos, formularios ni derivación |
| 13. Remuneración | No se añaden afiliación, patrocinio ni remuneración |
| 14. Separación profesional | Se conserva la separación de NUVIA y las actividades profesionales |
| 15. Datos personales | Ninguna escritura ni recogida; no se prueban contactos enviando mensajes |
| 16. IA | Asistencia para el diseño, sin nueva función de IA ni contenido factual generado |
| 17. Fuentes/límites | Textos, enlaces, avisos y definición íntegros |
| 18. Regresión | Comparación fuente/HTML/DOM, filtros, cuatro fichas, teclado, enlaces, impresión y renders |

Clasificación: verde, cambio de presentación. Los contenidos originales conservan sus condiciones vigentes. §13: revisión local y pruebas antes de entrega; sin validación jurídica externa ni decisiones de bloqueo. No se realiza commit, despliegue ni escritura en Firebase.

## Implementación

Se añaden `interiores-lecturas.css`, `interiores-colaboradores.css` e `interiores-nuvia.css`, limitadas por `@media screen` y `body[data-eco-theme]`. El servidor identifica las tres páginas mediante `SHARED_PAGES` y utiliza la función común `renderSharedHeader` de `webs.mjs`. Conserva el pie informativo existente y muestra acceso directo al resto del ecosistema.

Lecturas presenta las cuatro cubiertas en una balda de escritorio y en dos columnas en tablet. Sus capas gráficas originales se escalan juntas en la proporción 2120 × 404; no se editan ni sustituyen imágenes. Las cuatro fichas nativas conservan texto íntegro, enlaces, cierre y foco. Colaboradores pasa a cuatro filas editoriales en su orden actual, con iniciales, retrato, áreas y biografías completas. Qué es NUVIA incorpora su fotografía original en la apertura, una lectura más amplia del manifiesto, la cita junto a la segunda fotografía y los cinco ámbitos y cuatro valores intactos.

`ecosistema.js` admite el fragmento histórico `index.html#espacios` y desplaza la portada al acceso de las webs. Así se mantiene literalmente el enlace ya presente en Qué es NUVIA. La portada generada en disco conserva el mismo HTML; el servidor añade únicamente el script de compatibilidad al servirla.

## Validación y evidencias

Todos los resultados están en `output/ecosistema-20261112/`.

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Fuente y contenido | `main` byte a byte, scripts originales en orden y recursos locales correctos en las tres páginas | `compartidos-conservacion.json` |
| DOM y enlaces | Texto, identificadores, imágenes y enlaces idénticos al original a 1440/768 px | `compartidos-conservacion.json` |
| Presentación | 3 páginas × 7 anchos (1440,1280,1180,1024,900,820,768): 21 comprobaciones sin incidencias de desbordes, imágenes, cabecera, controles o JavaScript | `compartidos-render.json` |
| Contraste | Las tres páginas a 1440/768 frente a su original: cero fallos AA de texto, errores o fondos sin resolver | `compartidos-contraste.json` |
| Lecturas | Tres filtros y cuatro fichas comparados con el original a 1440/768; texto, enlaces y cubiertas idénticos; teclado, Escape y devolución de foco correctos | `compartidos-conservacion.json` |
| Diálogos en tablet | Las cuatro fichas a 768 × 820 permiten desplazarse hasta el enlace final, sin desbordes horizontales | `lecturas-dialogo-fin-768x820.png` |
| Navegación | Ocho comprobaciones: selección/selector de cuatro webs, ida y vuelta desde el hub y fragmentos históricos de espacios e Isabel Florido | `compartidos-conservacion.json` |
| Impresión | Propiedades de presentación del contenido iguales al original en las tres páginas a 1440/768 | `compartidos-conservacion.json` |
| Regresión | 19 interiores y 5 portadas anteriores, recursos y servidor: paridad correcta | `compartidos-regresion-interiores.log` |
| Proyecto oficial | `npm run build` terminó con código 0, incluyendo `validate`, `auditar`, construcción y validación de `dist/` y Empresas a cinco anchos. `validate:academia` también terminó con código 0 | `compartidos-build.log`, `compartidos-academia.log` |

Se preservan los archivos fuente productivos de las tres páginas, sus imágenes, los scripts de libros, la definición canónica, los tokens y las pruebas normativas. Las pruebas usan contextos temporales sin perfil del usuario y sin contactar servicios externos; no envían mensajes, abren compras ni modifican almacenamiento personal. La conservación de enlaces externos no implica haber comprobado sus servicios remotos.

## Revisión local

El servidor habitual sigue siendo `node prototipos/ecosistema-nuvia-20261112/servir-interiores.mjs`, en `http://127.0.0.1:4187/`. Desde el hub se entra en Lecturas, Colaboradores y Qué es NUVIA. Para reproducir la comparación se sirve el original en 4186 y se ejecuta `verificar-compartidos.mjs`; los auditores de render y contraste admiten el filtro `lecturas.html,colaboradores.html,que-es-nuvia.html`.
