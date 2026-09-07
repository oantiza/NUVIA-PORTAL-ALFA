# Auditoría de diseño, estructura y coherencia de NUVIA

5 de septiembre de 2026 · Propuesta para el fundador · No implementada

## 1. Dictamen

**Recomiendo un rediseño integral de la experiencia sobre la identidad actual.** La portada ya proporciona una base reconocible: fotografía humana, azul profundo, tipografía limpia y una relación explícita entre patrimonio y vida familiar. El trabajo prioritario consiste en convertir esa dirección en una experiencia consistente al navegar, aprender y calcular.

NUVIA tiene identidad, contenido y herramientas. Su debilidad principal es la acumulación de capas: presentaciones sucesivas, títulos de distinto criterio, avisos repetidos, varias familias de tarjetas y navegación que mezcla espacios, contenidos y herramientas. La sensación de conjunto es más compleja que la promesa de claridad de la marca.

El objetivo propuesto es que una persona pueda contestar inmediatamente: **qué es este espacio, qué puedo hacer aquí, por dónde empiezo y qué significa lo que veo.** La estética debe transmitir serenidad, cercanía y rigor. El visitante debe sentirse capaz de comprender, incluso si empieza sin conocimientos financieros.

### Qué conservar

- La definición canónica: «NUVIA es un lugar donde las familias aprenden a entender su dinero».
- Los cinco espacios del proyecto y la portada como referencia visual principal.
- El azul NUVIA, el verde oliva, los blancos y papeles cálidos, con bronce discreto.
- Inter y Fraunces; la combinación ya es adecuada si cada familia tiene una función clara.
- La fotografía familiar, el horizonte de largo plazo y el enfoque de criterio propio.
- Las calculadoras, rutas, fuentes, contenido dinámico y copia independiente de empresas.
- Los avances existentes: cabecera y pie compartidos, fuentes autoalojadas, fichas con contexto, filtros y controles de presentación.

### Qué transformar

- La relación entre portada, espacios, guías y herramientas.
- La prioridad visual: tarea principal antes que explicaciones repetidas.
- La escala tipográfica y las reglas de uso de serif y sans serif.
- La continuidad entre Cartera y Empresas.
- La presentación de disponibilidad, procedencia, fechas y limitaciones.
- La densidad y distribución en tablet.

## 2. Alcance y evidencia

Se ha revisado la web oficial publicada en GitHub Pages y el código del repositorio oficial. Referencia local: commit `1699874`, de 4 de septiembre de 2026. No se ha acreditado una igualdad binaria entre cada activo publicado y ese commit; las observaciones visuales corresponden a producción y las de mantenimiento al código local.

Se leyeron íntegramente el marco obligatorio v1.2 y la definición canónica. También se contrastaron los contratos visuales y las decisiones recientes del módulo de empresas, para distinguir elecciones deliberadas de inconsistencias accidentales.

**Cobertura:** portada, Economía y Finanzas, cotizaciones, Patrimonio, Bienestar, Academia, Conocimientos esenciales, curso, Lecturas, Cartera, modelos, integración de Empresas y una ficha real de Iberdrola, Vivienda, Jubilación, Fiscalidad y las seis rutas de guías. La ruta `guia-impuestos.html` redirige a Fiscalidad; no constituye una sexta guía independiente disponible.

Se inspeccionaron capturas, texto visible, jerarquía de encabezados y estilos calculados. Se comprobó el filtro de Lecturas: pasó correctamente de cuatro a dos libros. Empresas cargó su catálogo de 73 referencias y la ficha consultada. El constructor de Cartera terminó cargando después de mostrar inicialmente textos de espera; no se considera que esté roto.

Se midieron 17 vistas a 768 y 1024 px —34 combinaciones— sin desbordamiento horizontal general del documento. Hubo inspección visual adicional a 820 px y revisión principal de escritorio a 1440 px; el manifiesto se comprobó también a 1280 px. **Esto no certifica cada tabla, ventana, gráfico ni estado interactivo a todos los tamaños.**

Controles locales ejecutados:

- Consistencia: 18 páginas, sin errores y cuatro avisos. Tres corresponden a la ruta de compatibilidad `guia-impuestos.html`; el restante señala dos imágenes de portada sin carga diferida. No se interpretan automáticamente como defectos.
- Lenguaje del laboratorio: superado. Su alcance es el laboratorio, no todos los textos del portal.

No se realizó una certificación completa de accesibilidad, medición de rendimiento en condiciones controladas, auditoría de fórmulas, revisión fiscal/jurídica externa, prueba de todas las empresas ni evaluación con usuarios reales. No se ensayaron envíos de formularios, cuentas o persistencia de datos personales.

Mediciones de trabajo: `output/auditoria-diseno-20260905/evidencia-mediciones.json`. Las capturas guardadas en ese directorio son evidencia local, excluida de publicación por la configuración actual.

## 3. Hallazgos priorizados

Las prioridades indican orden de mejora de la experiencia, no bloqueos del desarrollo. «Observado» identifica evidencia directa; «juicio de diseño» expresa una valoración que conviene contrastar con usuarios.

| ID | Prioridad | Evidencia y problema | Mejora propuesta |
|---|---|---|---|
| D01 | Alta | Observado: el hero de Inicio explica la promesa, pero no ofrece una acción principal. Comprender/Cuidar/Transmitir son etiquetas. | Incorporar «Explorar NUVIA», dirigido al mapa de espacios, y un acceso secundario a Academia. |
| D02 | Alta | Observado: Economía combina portada del espacio y página de Mercados. Después aparecen vistas, herramientas y filtros. | Separar visualmente el selector de ámbito y la navegación de la herramienta, con nombres estables y acceso directo a Empresas. |
| D03 | Alta | Observado: Cartera tiene hero institucional, otro banner de laboratorio, navegación, explicación y aviso antes del constructor. | Una apertura compacta y una zona de trabajo inmediata. Integrar el contenido del segundo banner en la cabecera, conservando su información. |
| D04 | Alta | Observado: Empresas se muestra bajo «Analítica de cartera» y una ruta que termina en «Cartera», aunque el usuario analiza una empresa. | Título y ruta contextual de la vista; acceso identificable desde Economía. Mantener las URL actuales y la copia local. |
| D05 | Alta | Observado: alternan Cartera, Mi cartera, Cartera y analítica, Analítica de cartera y Laboratorio de cartera. También Impuestos/Mis impuestos/Fiscalidad. | Glosario de nombres: un nombre principal por destino y subtítulos que expliquen su función. |
| D06 | Alta | Observado: H1 Inter de 57,6 px en varias entradas; 44 px en Cartera y guías; Fraunces 44 px en Lecturas; H1 del manifiesto con tamaño calculado de 132,48 px. | Definir tamaños por tipo de página, con excepciones editoriales explícitas y acotadas. |
| D07 | Alta | Observado: el H2 de indicadores macro utiliza Fraunces a 12 px y mayúsculas. Una regla amplia aplica serif a encabezados interiores. | Separar titulares editoriales, títulos funcionales y etiquetas. Inter para etiquetas y controles. |
| D08 | Alta | Observado: cabecera de unos 149 px a 768 px y 105 px a 1024 px. En 820 px «Qué es NUVIA» queda solo en una fila. | Composición de tablet intencionada, con alturas y filas estables. Mantener acceso a todos los espacios. |
| D09 | Alta | Observado: Vivienda presenta «Guardar escenario» antes del formulario; en tablet, la introducción ocupa prácticamente otra pantalla. | Acercar el inicio del cálculo al título y ubicar guardar/recuperar en el contexto del escenario. |
| D10 | Alta | Observado: «Datos ilustrativos» aparece junto a la tabla de cotizaciones, después de tarjetas de índices muy prominentes. | Identificar el carácter ilustrativo desde la cabecera del conjunto y en las tarjetas correspondientes. |
| D11 | Media | Observado: el sumario de Inicio presenta 01,05,02,06… al pasar a una columna. | Orden documental continuo y agrupación por espacio, manteniendo todos los enlaces. |
| D12 | Media | Observado: tres espacios tienen grandes bloques fotográficos en Inicio; Academia y Lecturas aparecen después como banners. | Mostrar los cinco espacios juntos en un mapa inicial; reservar bloques ampliados para desarrollar su relato. |
| D13 | Media | Observado: Conocimientos esenciales ofrece «Volver a la ruta de aprendizaje» y «Volver a la portada» cerca uno de otro. | Un retorno contextual inequívoco y recorrido de contenidos persistente. |
| D14 | Media | Observado: el manifiesto alcanza unos 8.177 px de documento a 1440 px; varias guías superan 6.000 px. | Resumen e índice útiles al principio; reducir espaciados redundantes; mantener el contenido íntegro. |
| D15 | Media | Observado: la portada de Lecturas incluye una marca de árbol ilustrada distinta del logotipo principal de la cabecera. | Tratar esa imagen como ilustración editorial y acordar una única firma oficial de marca. |
| D16 | Media | Juicio de diseño: abundan cápsulas, numeraciones grandes, filetes de varios colores, tarjetas y avisos con peso parecido. | Reducir variantes y asignar función a cada recurso visual. |
| D17 | Media | Observado: el CSS general de páginas ocupa 344.537 bytes sin comprimir y contiene 682 líneas con declaraciones de tamaño de fuente. | Consolidar componentes y estilos por familia de página; medir mejora real, sin inferir lentitud solo por tamaño. |
| D18 | Media | Observado: el contrato visual describe `guia-impuestos.html` como estado en preparación, mientras producción redirige a Fiscalidad. | Actualizar el inventario y las pruebas para distinguir contenido activo, redirecciones y páginas internas. |

## 4. Diagnóstico por sección

### Inicio

La fotografía familiar, la paleta y el titular funcionan como referencia. La composición tiene presencia y suficiente contraste visual en las capturas revisadas; esto no sustituye una medición exhaustiva de contraste.

La entrada tarda en convertir su promesa en opciones concretas. El bloque «El proyecto» vuelve a explicar ideas próximas al hero. Los cinco espacios no se presentan inicialmente como una familia equivalente. El sumario resulta útil, pero aparece después y su numeración pierde sentido al apilarse.

Propuesta de secuencia: hero con acceso a explorar → cinco espacios → accesos por necesidades cotidianas → explicación breve del proyecto → contenidos disponibles destacados por tema → Academia y Lecturas → pie. Los destacados serían editoriales, sin ordenar instrumentos por atractivo financiero. Cada espacio conservaría su destino y su estado real.

### Economía y Finanzas

Es acertado conectar los indicadores con la economía doméstica. El problema es que la cabecera funciona a la vez como directorio y como portada de noticias: el primer bloque ocupa hasta aproximadamente 700 px desde el inicio de la página a 1440 px de ancho, incluida la cabecera global.

Propuesta: apertura de 280–360 px como objetivo de diseño, con enlaces claros a Mercados, Cartera y Empresas. Después, la vista seleccionada comienza con su título y controles. Noticias, informes, cotizaciones y calendarios mantienen su información y sus rutas.

Los estados deben explicar lo observado: fecha del dato, fecha de actualización, origen e ilustrativo/real. «Mercados en directo» convive con un proveedor externo que puede mostrar tiempo real, diferido o último cierre; conviene que el título del bloque sea compatible con todos esos estados. No se ha contrastado aquí la exactitud económica de sus cifras.

### Patrimonio

Es una de las entradas más comprensibles: cuatro ámbitos y disponibilidad visible. Sirve como base para una plantilla de espacio. Puede ganar cercanía con títulos más cortos, menor repetición de «comprender» y una relación más directa entre pregunta y herramienta.

La planificación patrimonial general en preparación debe distinguirse de la guía de planificación de jubilación ya existente. No son el mismo contenido. El usuario debería ver esa diferencia sin tener que interpretar la arquitectura.

### Vivienda

Las cinco vistas —Hipoteca, Ofertas, Compra o alquiler, Amortización y Presupuesto— reúnen una propuesta útil. La entrada concede prioridad al guardado y al relato, mientras la tarea principal queda abajo.

Propuesta: «Vivienda y coste de vida» como identificador estable; «Explora una hipoteca, una compra o el presupuesto del hogar» como descripción. Una barra de vistas uniforme y el primer grupo de datos a continuación. Explicación de conceptos junto a los campos o en un bloque accesible de ayuda, manteniendo el contenido disponible.

Resultados: cuota, efectivo inicial y coste estimado con unidades y supuestos visibles; separación clara entre resultado del escenario y cualquier interpretación. Conservar tablas y alternativas. «Ofertas» puede describirse como «Comparar condiciones hipotecarias introducidas por ti», si representa fielmente su funcionamiento.

### Jubilación

La división en cuatro grupos y la identificación de Bizkaia son fortalezas. El formulario largo necesita un mapa de avance y una mejor síntesis. Los avisos de ámbito se repiten en la cabecera y debajo; se debe simplificar la redacción manteniendo el ámbito inequívoco antes de introducir datos.

Propuesta: cabecera compacta «Simulador de jubilación» con «Bizkaia · ejercicio 2026» inmediatamente visible; cuatro apartados, índice anclado y resultados agrupados en renta, impuestos y duración del escenario. No ampliar cobertura territorial mediante diseño ni presentar hipótesis como previsiones.

### Fiscalidad y guías

La elección de territorio, los enlaces de fuente y la distinción entre ejercicio y campaña aportan valor. La portada utiliza mucho espacio superior vacío. Las guías acumulan hero, territorio, navegación entre guías, aviso, objetivos e índice antes del contenido principal.

Propuesta: cabecera de guía compacta; territorio, ejercicio y revisión en una ficha común; breve resumen e índice lateral en escritorio. En tablet, índice en el flujo con acceso claro. Cuerpo de lectura de 60–75 caracteres por línea; tablas con ancho propio. Los documentos de más de 6.000 px necesitan navegación interna, no necesariamente menos contenido.

Calendario: diferenciar visualmente vencimientos oficiales y revisiones educativas, con fecha y tipo expresados en texto. Ahorro: mantener próximos el producto seleccionado, la regla explicada y su ejemplo. Sucesiones: separar comparación descriptiva, documentación y proceso. Guías de jubilación: el progreso representa actividades consultadas o marcadas, no la validez de un plan personal.

### Familia, Salud y Bienestar

La conexión entre vida cotidiana y patrimonio forma parte de la definición de NUVIA. El problema actual es de madurez editorial: la página presenta el enfoque, tres guías futuras y fuentes generales. No ofrece todavía la profundidad que su presencia en la navegación puede sugerir.

Propuesta: conservar el espacio y su estado visible; darle una presentación breve y cálida que diferencie qué se puede consultar hoy y qué está previsto. Una eventual ampliación de contenidos debe cubrir familia, hábitos, mente, descanso y tiempo compartido con autoría y fuentes reales. Ese trabajo editorial sería un encargo adicional, no un resultado ya existente.

### Academia y curso

«Saber es patrimonio» es una buena firma. La distinción entre consulta y curso es comprensible. Sin embargo, al profundizar se repite la cabecera y aparecen retornos solapados. La amplitud de NUVIA se estrecha en algunas entradas a «Guía del inversor».

Propuesta: mantener dos caminos —consultar un concepto y seguir un curso— con nombres constantes. En cada lección, mostrar capítulo, contenido, práctica y comprobación dentro del mismo marco. El titular del capítulo debe prevalecer sobre la repetición de «Dinero con criterio».

El primer capítulo medido alcanza unos 7.451 px. La misma frase «Pon orden a tu dinero» aparece como introducción, vídeo y apuntes. Conviene titular las partes por su función y utilizar navegación de lección. El estado de progreso debe decir claramente que es temporal, tal como ya informa la página; no proponer guardado remoto por defecto.

### Lecturas con Criterio

Es la sección que mejor admite una excepción editorial cálida. La selección limitada se declara con honestidad; filtros y contador funcionan. La portada ilustrada puede mantenerse dentro de un sistema compartido.

Conviene dar más jerarquía al título, autor y motivo de lectura que a la numeración y categorías. El acceso a la ficha debe ser la acción dominante; la librería, una referencia secundaria. El subtítulo «Historias sencillas de interés duradero» sugiere narrativa, mientras el catálogo es de no ficción: propongo «Libros e ideas para desarrollar criterio propio».

En tablet las fichas ocupan mucho alto. Probar una composición con cubierta lateral cuando el ancho lo permita. Mantener la comunidad prevista claramente identificada como futura, sin simular actividad ni participantes.

### Cartera y Empresas

Es la zona con mayor necesidad de reorganización. La aproximación mediante preguntas ayuda, pero se acumulan explicación institucional, marca, títulos, avisos y accesos. «Apuestas repetidas» es coloquial y potencialmente confuso; «Solapamientos» con la ayuda «Posiciones que se repiten entre instrumentos» resulta más preciso.

Propuesta: una zona de análisis con las vistas Cartera, Composiciones de estudio y Empresas. «Composiciones de estudio» es una alternativa de nombre a valorar, no una modificación autorizada de las carteras modelo. Las rutas, composiciones y cálculos se mantienen.

Cada vista comienza con su entrada: posiciones, composición o empresa. Resultados con la secuencia pregunta → gráfico o tabla → explicación → fuente, fecha y límites. Los avisos importantes acompañan al resultado; los detalles metodológicos mantienen un lugar localizable.

Empresas ya comparte fuentes y parte de la paleta. No es una aplicación sin relación visual. El salto procede de la doble cabecera, los niveles de navegación y su contenedor embebido de altura fija de 1.200 px. Hay varios contextos de desplazamiento: página, módulo y catálogo. Conviene estudiar una altura comunicada por el módulo y un único desplazamiento principal, conservando aislamiento y enlace para abrirlo aparte.

El ajuste de Empresas del 4 de septiembre documenta una petición concreta del fundador: pestañas, paneles rectangulares, títulos y cifras Fraunces. **No se propone deshacerlo unilateralmente.** La armonización debe partir de ese diseño y acordar cómo se integra en el sistema común.

### Qué es NUVIA

El contenido canónico es el mejor fundamento de la propuesta. Su versión actual es una pieza narrativa deliberada, con fotografía, animación, tipografía monumental y grandes pausas.

Mi juicio es que esa puesta en escena excede lo necesario para explicar el proyecto y puede transmitir exclusividad patrimonial: casa de gran tamaño, paisaje cuidado y tratamiento solemne. No es una conclusión de investigación con usuarios. Conviene contrastar si representa suficientemente a familias con situaciones diversas.

Propongo una explicación inicial de lectura rápida, cuatro bloques —qué es, para qué existe, qué encontrarás y principios— y accesos a los espacios. Puede conservarse una versión más narrativa dentro de la misma página. El texto canónico no debe alterarse indirectamente desde una maqueta.

## 5. Arquitectura propuesta

Los cinco espacios se mantienen como estructura principal. Se establece un único propietario para cada contenido; los accesos cruzados enlazan al mismo destino, evitando copias.

| Espacio | Organización visible propuesta | Rutas que se conservan |
|---|---|---|
| Economía y Finanzas | Mercados y noticias; Cartera; Empresas | `mercados.html`, sus vistas y `cartera.html?vista=...` |
| Patrimonio | Vivienda y coste de vida; Impuestos; Jubilación; Planificación patrimonial | `temas.html`, `vivienda.html`, `fiscalidad.html`, `jubilacion.html` y guías |
| Familia, Salud y Bienestar | Enfoque; temas; contenidos disponibles y previstos; fuentes | `temas.html?topic=bienestar` |
| Academia NUVIA | Conocimientos esenciales; Cursos; acceso contextual al glosario | `academia.html`, sus parámetros y `curso.html` |
| Lecturas con Criterio | Catálogo; fichas; criterios editoriales; comunidad prevista | `lecturas.html` |

«Qué es NUVIA» permanece como acceso institucional secundario. El logotipo vuelve a Inicio. La ruta contextual usa «Inicio › Espacio › Contenido», con nombres que coinciden con el título del destino. Las pestañas seleccionan vistas; los botones ejecutan acciones; los enlaces navegan. No dar a estos tres comportamientos la misma apariencia indiscriminadamente.

El punto de entrada por necesidades complementa los espacios: «Entender mi hipoteca», «Consultar impuestos», «Explorar mi jubilación», «Aprender desde el principio». Son accesos temáticos, no un cuestionario personal ni una recomendación de inversión.

## 6. Dirección visual concreta

**Una publicación contemporánea sobre economía familiar con herramientas claras y rigurosas.** Mantener la confianza del azul y añadir calidez en lectura y ejemplos. La diferencia entre una portada, una guía y una herramienta debe venir de su función, sin que cada sección invente una marca nueva.

### Tipografía

| Uso | Familia y peso propuestos | Escritorio | Tablet |
|---|---|---|---|
| Hero de Inicio | Inter 500 | 56–64 px | 40–44 px |
| Entrada de espacio | Inter 500 | 44–48 px | 36–40 px |
| Herramienta o guía | Inter 500 | 32–36 px | 28–32 px |
| Titular editorial | Fraunces 400–500 | 32–40 px | 28–32 px |
| Sección funcional | Inter 500–600 | 24–28 px | 24–28 px |
| Tarjeta | Inter 500–600 | 20–22 px | 20–22 px |
| Lectura | Inter 400 | 17–18 px | 16–18 px |
| Formulario, tabla, ayuda | Inter 400–600 | 14–16 px | 14–16 px |
| Etiqueta breve | Inter 600 | 12–13 px | 12–13 px |

Son especificaciones propuestas para prototipo, no cambios aplicados. Evitar mayúsculas en etiquetas largas y serif en rótulos pequeños. Interlineado de lectura 1,55–1,7; títulos 1,1–1,2. Cifras alineadas y tabulares en tablas. Mantener la excepción acordada de cifras Fraunces en Empresas hasta decidir su armonización. Verificar pesos realmente disponibles y unificar las declaraciones de fuentes compartidas.

### Color, fotografía y superficies

- Azul `#0B2347` como identidad y texto principal; azul profundo para cabeceras y cierres.
- Blanco para tareas y tablas; papel `#F3EEDF` para lectura y contexto; gris azulado para agrupaciones secundarias.
- Verde oscuro para acciones legibles. El verde claro `#7C9A44` funciona como acento, no como texto pequeño sobre blanco.
- Bronce como detalle editorial. El granate del módulo de empresas se trata como excepción existente que debe documentarse o armonizarse con el fundador.
- Colores de gráficos ligados a series y leyendas; positivos/negativos acompañados de signo y texto. El color no expresa conveniencia de una inversión.
- Fotografía de vida familiar diversa, gestos cotidianos y relaciones entre generaciones. Escenarios creíbles, con tratamiento luminoso y sin acumulación de símbolos de lujo.
- Un logotipo oficial, sin reinterpretarlo dentro de cada banner. Ilustraciones botánicas o paisajes pueden acompañar la marca, con función decorativa clara.

### Composición y componentes

Mantener el contenedor de aproximadamente 1.240 px ya definido. Márgenes de 40–48 px en escritorio y 24–28 px en tablet; ritmo de 8 px; separaciones de sección de 48–64 px. Reservar las aperturas amplias para Inicio y piezas editoriales específicas.

Cuatro plantillas: **entrada de espacio, guía, herramienta y ficha**. Biblioteca mínima: cabecera, ruta, apertura, navegación local, tarjeta de destino, ficha de contenido, campo, grupo de campos, indicador, tabla, gráfico, nota de fuente, aviso y estado vacío/carga/error. Cada una debe tener ejemplos de escritorio y tablet.

El estado «En preparación» se expresa con texto y una descripción de lo disponible. No convertir automáticamente una propuesta estética en retirada de enlaces o funciones. Las limitaciones esenciales permanecen junto al dato; se evita repetir el mismo párrafo en varios lugares.

## 7. Textos a revisar con el fundador

Estos puntos plantean coherencia de producto y posibles conflictos con el marco interno. No constituyen un dictamen jurídico. Se conservó el estado existente y no se impuso ningún bloqueo.

| Evidencia | Problema de comprensión | Alternativa para valorar |
|---|---|---|
| Vivienda: «Margen amplio», generado a partir del porcentaje de esfuerzo (`vivienda.html:553`) | Puede interpretarse como validación de capacidad personal. | Mostrar «Deuda mensual / ingresos: X %» y explicar el cálculo sin veredicto. |
| Guía de planificación: «Plan completado» y «Ejecutar» (`guia-planificacion.html:113`, `:137`) | Completar casillas puede confundirse con disponer de un plan validado. | «Apartados revisados» y «Comprender la tramitación». |
| Curso: «Diagnostica tus cuatro pilares» y «cuál debería ser tu primera prioridad» | El tono de diagnóstico/prescripción se aparta de la promesa de desarrollar criterio propio. | «Explora cuatro aspectos de tu economía» y «comprende cómo se relacionan». |
| Cotizaciones: etiqueta ilustrativa de menor jerarquía que los índices | Puede confundirse una demostración con información actual. | Estado ilustrativo visible desde el inicio del panel y junto a cada conjunto relacionado. |
| Guías: referencias a revisión externa pendiente | Debe distinguirse estado editorial de requisito para continuar la alfa. | Redacción factual de revisión y fecha; no presentar la validación jurídica externa como puerta de la alfa. |

Registro de consulta: 05-09-2026, asuntos planteados en este informe; respuesta del fundador pendiente. La auditoría solicita una decisión futura antes de actuar en esos puntos. No registra aceptación en su nombre ni amplía autorizaciones de datos o backend.

## 8. Alternativas y plan recomendado

| Alternativa | Resultado | Limitación |
|---|---|---|
| Homogeneización superficial | Ajustar tamaños, colores, márgenes y tarjetas. | Mantiene recorridos largos y duplicidad de navegación. |
| **Rediseño integral sobre la identidad actual — recomendado** | Reordenar entradas, navegación, textos y plantillas, preservando herramientas y marca. | Requiere prototipar y revisar por familias de página. |
| Cambio completo de identidad y tecnología | Nueva dirección gráfica y reconstrucción amplia. | No hay evidencia en esta auditoría que justifique ese coste y riesgo. |

### Fase 1 · Mapa y criterios

Cerrar nombres, jerarquía y propietario de cada contenido. Inventario de rutas y estados, incluidos parámetros y redirecciones. Definir las cuatro plantillas y resolver con el fundador los puntos de la sección 7.

Entrega: mapa completo de navegación, glosario de nombres, lista de componentes y criterios de aceptación. El cambio de arquitectura se mantiene en presentación; las rutas existentes continúan funcionando.

### Fase 2 · Prototipos representativos

Preparar Inicio, Patrimonio, una guía fiscal, Vivienda, Cartera y la integración de Empresas. Son suficientes para comprobar las diferencias de función. Incluir 1440/1280 px y 1024/820/768 px, con contenido real y estados representativos.

Entrega: comparación actual/propuesta, sistema tipográfico y de color, navegación utilizable y ejemplos de carga, ausencia y resultado. No sustituir los datos por cifras inventadas para que la maqueta parezca completa.

### Fase 3 · Base común e implantación

Consolidar tokens y componentes; después migrar cabecera, pie, rutas y aperturas. Implantar por familias: espacios → guías y aprendizaje → simuladores → Cartera y Empresas. Revisar Lecturas y manifiesto como excepciones editoriales controladas.

No añadir nuevas capas de CSS global al final para resolver cada página. Sustituir reglas duplicadas dentro de un ámbito concreto y mantener regresiones. Actualizar el sistema visual existente y el contrato de presentación para reflejar la decisión final.

### Fase 4 · Contenido y estados

Editar títulos y ayudas, normalizar metadatos, distinguir datos reales/ilustrativos/ausentes y revisar las transiciones entre aprender y calcular. Tratar las guías futuras como futuras. No añadir comunidad, perfiles ni guardado remoto como efecto colateral del rediseño.

### Fase 5 · Validación y entrega

Comprobar recorridos completos, teclado, foco, contraste, lectura, tablas, gráficos y comportamiento de las vistas. Pruebas funcionales existentes y compilación del sitio y de la copia de Empresas. Comparar resultados antes/después con los mismos supuestos para demostrar que el diseño no altera cálculos.

Publicación solo con autorización correspondiente, mediante GitHub Actions y GitHub Pages del repositorio oficial. Firebase Hosting y la API existente quedan fuera del cambio de diseño.

No se ofrece una estimación cerrada de plazo: requiere fijar primero el alcance del prototipo y la profundidad de edición de contenidos. El orden anterior permite revisar entregas concretas sin rehacer todo a la vez.

## 9. Criterios de aceptación

- Las cinco áreas son localizables desde cualquier página; el nombre del destino coincide con título y ruta contextual.
- Cada pantalla explica su propósito y ofrece un siguiente paso claro sin duplicar presentaciones.
- Objetivo de prototipo: primer control útil de una herramienta visible o alcanzable con un desplazamiento corto en escritorio; verificar también con la altura real de tablet.
- Una sola apertura institucional por vista, con altura acorde a la tarea.
- Índices útiles para contenidos largos; las anclas no quedan bajo la cabecera fija.
- Fuentes y fechas junto a cifras relevantes; estados ilustrativos inequívocos antes de interpretar resultados.
- Sin pérdida de columnas, calculadoras, contenidos dinámicos, rutas, pestañas ni funciones existentes.
- Sin desbordes generales a 1440, 1280, 1180, 1024, 900, 820 y 768 px; las tablas con desplazamiento local lo indican y son operables.
- Objetivo de accesibilidad: contraste mínimo 4,5:1 en texto ordinario y 3:1 en texto grande y elementos no textuales relevantes; foco y operación por teclado, títulos semánticos y alternativas de gráficos. Requiere verificación específica, no se da por alcanzado aquí. Referencias consultadas: [W3C, contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [W3C, contraste no textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- Controles táctiles con objetivo interno de 44 px; textos esenciales nunca reducidos para hacer caber navegación.
- Animaciones que respetan reducción de movimiento y no retrasan el acceso a la información.
- Prueba con al menos cinco personas de distinta experiencia financiera: localizar hipoteca, identificar el ámbito de jubilación, llegar a una empresa y explicar si los datos son actuales o ilustrativos. Meta propuesta: cuatro de cinco completan cada tarea sin ayuda. No se ha realizado todavía.

## 10. Revisión del alcance conforme al marco interno (§12)

1. Necesidad: claridad de información, aprendizaje y herramientas existentes.
2. Datos: documentos y código del proyecto, páginas públicas y una consulta descriptiva de empresa; sin datos personales introducidos.
3. Transformación: análisis de presentación y propuesta documental; sin modificar cálculos.
4. Resultado: hallazgos, arquitectura, especificaciones y plan; ninguna recomendación inversora.
5. Emisores: la ficha de Iberdrola se usa solo como muestra de interfaz.
6. Circunstancias personales: no empleadas para personalización.
7. Operaciones: no se sugieren compras, ventas o mantenimiento.
8. Valor/precio futuro: no se opina.
9. Atractivo inversor: no se puntúa ni ordena.
10. Recomendaciones de terceros: no se reproducen como propuestas de NUVIA.
11. Diseño: se propone representación descriptiva; posibles veredictos actuales se elevan al fundador.
12. Llamadas a la acción: navegación, lectura y cálculo; sin ejecución ni contacto comercial.
13. Remuneración: no se incorpora.
14. Separación profesional: preservada; no se incluyen marcas ni conexiones bancarias.
15. Datos personales: no se guardan en base de datos ni se amplía su tratamiento.
16. IA: no se añade IA al producto.
17. Fuentes y límites: referencias al código, producción, documentos canónicos y límites explícitos de esta revisión.
18. Regresiones: criterios de la sección 9; controles locales ejecutados indicados en la sección 2.

La entrega documental es de presentación. La futura implementación de herramientas mantiene su clasificación correspondiente y requiere revisión material; este informe no reclasifica módulos ni autoriza publicación. La validación jurídica externa permanece fuera del alcance de la alfa conforme al §0.

**Decisión propuesta al fundador:** adoptar la alternativa de rediseño integral sobre la identidad actual y utilizar las seis pantallas de la fase 2 como primera entrega revisable. Todo lo descrito es una propuesta; no se ha cambiado el diseño de la web.
