# NUVIA · Ecosistema

## Plan de arquitectura, experiencia y transición

**Fecha:** 12 de noviembre de 2026 · **Estado:** propuesta para decisión del fundador.
**Proyecto:** NUVIA Portal Alfa · **Ámbito:** escritorio y tablet, de 1440 a 768 px.
**Dirección elegida por el fundador:** equilibrio entre cercanía familiar y profundidad profesional.

### La propuesta en una página

Convertir NUVIA en **una marca común con cuatro webs especializadas**, cada una con su portada, su menú, su lenguaje editorial y sus recursos. Una entrada común, **NUVIA · Ecosistema**, permite comprender el conjunto y elegir por dónde empezar. Lecturas con Criterio y Colaboradores ocupan dos espacios transversales visibles, accesibles desde todas las webs.

La autonomía que percibe el visitante debe ser real: al entrar en Patrimonio ve las opciones de Patrimonio; al entrar en Academia ve opciones de aprendizaje. El resto del ecosistema permanece a un paso mediante un selector común. La portada general presenta y orienta; cada web desarrolla su tema; las herramientas conservan toda su profundidad.

**Recomendación técnica:** realizar primero esta separación editorial y de navegación dentro del repositorio y origen actuales. Compartir marca, componentes, datos y controles. Preparar límites claros entre módulos para que una separación posterior de dominios o despliegues sea posible. Cambiar cuatro menús no requiere cuatro copias del código, y crear cuatro carpetas tampoco proporciona cuatro despliegues independientes.

La propuesta busca una experiencia más sencilla para el lector y una estructura más clara para trabajar. Su eficacia se comprobará con recorridos reales, revisión de escritorio y tablet y conservación de las herramientas actuales; no se presenta como una mejora de conversión ya demostrada.

| Elemento | Función propuesta | Qué debe percibir el visitante |
|---|---|---|
| NUVIA · Ecosistema | Portada común e identidad del conjunto | «Entiendo qué hay y encuentro mi punto de entrada» |
| Economía y Finanzas | Actualidad, informes, mercados y análisis descriptivo | Contexto económico accesible y herramientas con profundidad |
| Patrimonio | Vivienda, jubilación, impuestos y planificación educativa | Orden para comprender la economía familiar a largo plazo |
| Familia, Salud y Bienestar | Publicaciones generales sobre hábitos, cuerpo, mente y descanso | Una lectura cercana, serena y con límites claros |
| Academia NUVIA | Conceptos, cursos, fundamentos y herramientas educativas | Aprendizaje progresivo, con una entrada sencilla |
| Lecturas con Criterio | Biblioteca editorial transversal | Un lugar para profundizar y leer con calma |
| Colaboradores | Autoría, trayectoria acreditada y aportaciones | Quién escribe y qué aporta a NUVIA |

## 1. Orden recibida y alcance de esta entrega

El fundador solicita desarrollar un plan completo sobre la premisa de dividir la experiencia actual en cuatro webs —Economía y Finanzas; Patrimonio; Familia, Salud y Bienestar; Academia NUVIA—, reunidas bajo una portada común, con Lecturas con Criterio y Colaboradores como minisecciones. Solicita una propuesta estética, ordenada, clara y atractiva para el futuro público. En la consulta de orientación elige: **«Un equilibrio entre cercanía familiar y profundidad profesional»**.

Esta entrega prepara una decisión concreta mediante un plan y un prototipo local navegable. Es una propuesta de evolución de la arquitectura, no una constancia de aprobación de todos sus detalles. La orden de organización del 12-10-2026 sigue siendo la referencia del producto publicado hasta que el fundador ratifique la nueva estructura.

El alcance de trabajo comprende:

- Revisión del inventario, arquitectura, diseño y dependencias actuales.
- Arquitectura propuesta de las cuatro webs y la portada común.
- Dirección visual, textos de entrada y navegación de referencia.
- Prototipo local de la portada y las cuatro entradas, en `prototipos/ecosistema-nuvia-20261112/`.
- Plan técnico, editorial, de validación y de transición con decisiones explícitas.

La producción permanece en GitHub Pages. Esta entrega no implica commit, fusión, despliegue, contratación de dominios, creación de repositorios, escrituras en Firebase ni migración de datos de visitantes. No se interviene en el proyecto cerrado LAB. No se plantea una versión móvil dentro de este alcance.

La grafía propuesta conserva **NUVIA**, conforme a la marca y documentación existentes. «Ecosistema» funciona como descriptor del conjunto, no como sustitución del nombre.

## 2. Diagnóstico de partida

### 2.1 Lo que ya existe

El registro `scripts/paginas.mjs` contiene **30 archivos HTML, 28 de ellos indexables**. Son cifras del inventario revisado para este plan, no cifras de tráfico. Algunas fichas documentales aún citan 29 páginas; el registro de código es la referencia para la migración.

Las cuatro familias que se quieren separar ya tienen contenido, herramientas y fichas de módulo. La estructura publicada incluye además Lecturas como quinta portada de espacio. Por tanto, el trabajo principal consiste en reorganizar la experiencia y los límites del código; no se parte de cuatro productos vacíos.

| Observación del repositorio | Implicación para el proyecto |
|---|---|
| Existe una cáscara común en `_plantilla.html`, sincronizada mediante `shell:sync` | La navegación por web debe resolverse desde Núcleo con configuración, conservando una implementación común |
| La navegación actual presenta el conjunto de espacios en las páginas | Los menús locales permitirán concentrar la atención en la tarea actual |
| Academia combina varias vistas `?tab=…` dentro de una página | Conviene separar claramente portada, categorías y lectura, conservando enlaces y estados existentes |
| Cartera y Empresas pertenecen a Economía y Finanzas | Deben seguir juntas como profundidad analítica de esa web |
| `company-analysis/` ya tiene compilación propia, pero comparte recursos y comunicación con Cartera | No es una pieza totalmente desacoplada; no debe trasladarse de dominio como si lo fuera |
| Las carteras del visitante se conservan en su navegador | Un cambio de origen requiere una estrategia específica de continuidad |
| Bienestar tiene cuatro subsecciones, pero los dos artículos actuales están en Respiración y relajación | La portada debe distinguir contenido disponible y secciones en preparación sin inventar un catálogo |
| Lecturas tiene una composición editorial propia aprobada | Debe conservarla aunque deje de competir como quinta web principal |
| La construcción publica el inventario registrado y no el directorio de prototipos | La propuesta puede revisarse localmente sin sustituir la Home actual |

### 2.2 Qué problema debe resolver la separación

Una persona que busca un simulador de jubilación no necesita recorrer el menú de mercados ni entender cómo está organizado el laboratorio. Quien busca formación necesita distinguir conceptos, cursos y glosario antes de enfrentarse a todas las posibilidades de una herramienta. La separación debe reducir esa carga de orientación.

El número de dominios no resuelve por sí mismo la complejidad. Si cada web hereda todos los menús y repite todos los índices, la dificultad continúa. El criterio de éxito será que cada entrada tenga un propósito reconocible, pocas opciones principales y una ruta de regreso visible.

## 3. Arquitectura de marca y propuesta visual

### 3.1 Nombre y presentación

**Nombre recomendado: NUVIA · Ecosistema.** Mantiene la marca reconocible y explica la relación entre las cuatro webs. En textos naturales puede decirse «el ecosistema NUVIA». No es necesario repetir el descriptor en todos los títulos internos.

Alternativas consideradas:

| Nombre | Ventaja | Límite |
|---|---|---|
| **NUVIA · Ecosistema** | Expresa unión de ámbitos con entidad propia | Necesita una frase de propósito que lo haga concreto |
| NUVIA | Máxima sencillez y continuidad de marca | Por sí solo no explica la nueva organización |
| Universo NUVIA | Tono más emocional | Describe peor la utilidad y puede sonar más abstracto |

La definición canónica sigue siendo: **«NUVIA es un lugar donde las familias aprenden a entender su dinero»**. La nueva organización no cambia esa misión ni convierte NUVIA en asesoría, entidad financiera o canal comercial. Si el fundador decide modificar el propósito, se actualizará primero `docs/DEFINICION_NUVIA.md`.

### 3.2 Dirección visual

**Una entrada singular; cercanía y rigor en la profundidad.** Por petición expresa del fundador del 12-11-2026, la portada del ecosistema se rediseña desde cero para diferenciarse de las cuatro webs. El concepto es una exposición breve: gran tipografía, una escultura original de cuatro formas conectadas y cuatro accesos tipográficos. El detalle del cambio está en [Rediseño de la portada](REDISENO_PORTADA_ECOSISTEMA_20261112.md).

Se conservan la marca, los colores de los tokens, Newsreader e Inter. Tras aprobar la línea del hub, el fundador solicita rediseñar también las cuatro portadas con personalidad propia. Economía y Academia emplean esculturas originales; Patrimonio y Bienestar, escenas familiares generadas con encuadres propios. La cabecera, el selector y el regreso al ecosistema comparten una plantilla local. La evolución se documenta en [Rediseño de las cuatro webs](REDISENO_CUATRO_WEBS_ECOSISTEMA_20261112.md). Al acceder a contenidos y herramientas, la referencia sigue siendo la jerarquía precisa, datos legibles, fuentes, supuestos y límites identificados.

| Capa | Tratamiento |
|---|---|
| Marca común | Azul NUVIA y marca existente; selector del ecosistema en las webs |
| Portada del ecosistema | Composición de exposición, fondo claro, escultura original y cuatro puertas tipográficas |
| Economía y Finanzas | Observatorio editorial: lente azul, gran titular y contraste entre contexto abierto y panel de análisis azul |
| Patrimonio | Hogar y perspectiva: papel, bronce, fotografía en arco y cuatro áreas en filas amplias |
| Bienestar | Naturaleza y pausa: titular verde, fotografía panorámica, cuatro temas y ensayos con autoría visible |
| Academia | Taller de ideas: escultura de papel y vidrio, composición invertida, accesos por intención e interés compuesto; mantiene «Saber es patrimonio» |
| Lecturas | Papel y tono editorial propios; no adopta la portada fotográfica de las cuatro webs |

Los colores identifican ámbitos, estados de interfaz o magnitudes; no califican una inversión. No se añaden logotipos diferentes para cada web ni cuatro sistemas de diseño incompatibles.

El prototipo debe demostrar: legibilidad a 768 px, foco visible, enlaces con nombres precisos, un H1 por página, controles de al menos 44 px y contraste conforme a la guía. Las imágenes decorativas no compiten con los textos; la carga de recursos externos mantiene la activación voluntaria vigente.

### 3.3 Portada común

La portada tiene cinco funciones, en este orden:

1. **Reconocer NUVIA.** Marca y explicación breve del conjunto.
2. **Comprender el propósito.** Titular humano, una frase concreta y una escultura que representa la conexión de los cuatro ámbitos.
3. **Elegir una web.** Cuatro accesos de igual importancia, cada uno con nombre, utilidad y acción explícita.
4. **Profundizar en el conjunto.** Dos enlaces discretos al pie: Lecturas con Criterio y Colaboradores.
5. **Conocer el proyecto.** Un único enlace «Qué es NUVIA» en la cabecera. Las webs y páginas institucionales desarrollan metodología, independencia y límites del contenido.

La primera zona de navegación no incluye cotizaciones, rankings, todos los simuladores ni un megamenú con la totalidad del portal. Esas posibilidades permanecen disponibles dentro de su web. La portada tampoco pide información personal para decidir dónde enviar al lector.

En escritorio, las cuatro puertas rodean una única pieza escultórica. En tablet estrecha, se disponen en dos columnas bajo una versión más contenida de la pieza, manteniendo el mismo orden y peso. El texto de los enlaces es HTML real, visible y activable sin depender del arte, de JavaScript ni del hover. La franja transversal distingue Lecturas y Colaboradores de las cuatro webs.

### 3.4 Textos de referencia

Estos textos son propuesta editorial para la arquitectura; el prototipo puede ajustar su extensión al encuadre.

**Portada:** «Todo está conectado.»
**Entradilla:** «Tu dinero, tu familia, lo que sabes y lo que está por venir. Un espacio para comprenderlo en conjunto.»
**Acciones principales:** cuatro accesos directos a Economía, Patrimonio, Bienestar y Academia.
**Firma del hub:** «Conocimiento para la vida en familia.»

| Web | Frase de entrada | Acción |
|---|---|---|
| Economía y Finanzas | «Entiende la economía que te rodea.» | «Explorar Economía y Finanzas» |
| Patrimonio | «Pon en perspectiva el patrimonio familiar.» | «Explorar Patrimonio» |
| Familia, Salud y Bienestar | «Un espacio para comprender el bienestar cotidiano.» | «Explorar Familia, Salud y Bienestar» |
| Academia NUVIA | «Saber es patrimonio.» | «Entrar en Academia NUVIA» |
| Lecturas con Criterio | «Ideas que merecen una lectura con calma.» | «Explorar las lecturas» |
| Colaboradores | «Conoce a quienes aportan conocimiento a NUVIA.» | «Conocer a los colaboradores» |

Se evita presentar al visitante como cliente de servicios financieros. El atractivo se construye con utilidad, claridad, contenido verificable y confianza, manteniendo la separación profesional vigente.

## 4. Mapa de las cuatro webs y los espacios comunes

```text
NUVIA · Ecosistema
│
├── Economía y Finanzas
│   ├── Portada
│   ├── Informes de mercado
│   ├── Mercados y noticias
│   ├── Cartera y analítica
│   └── Análisis y valoración de empresas
│
├── Patrimonio
│   ├── Portada
│   ├── Vivienda y coste de vida
│   ├── Jubilación
│   │   ├── Simulador
│   │   ├── Guía de planificación de la jubilación
│   │   └── Fiscalidad y rescate de la EPSV
│   ├── Impuestos
│   │   ├── Fiscalidad del ahorro
│   │   ├── Calendario fiscal
│   │   └── Sucesiones y donaciones
│   └── Planificación patrimonial educativa [estado actual conservado]
│
├── Familia, Salud y Bienestar
│   ├── Portada
│   ├── Respiración y relajación
│   │   ├── La respiración como el escultor del cerebro
│   │   └── ¿Qué es meditar?
│   ├── Movimiento consciente [artículos en preparación]
│   ├── Nutrición equilibrada [artículos en preparación]
│   └── Descanso, límites y tiempo propio [artículos en preparación]
│
├── Academia NUVIA
│   ├── Portada
│   ├── Conocimientos esenciales
│   │   └── El PIB [lección existente]
│   ├── Cursos
│   │   └── Dinero con criterio
│   ├── Fundamentos
│   ├── Activos
│   ├── Interés compuesto
│   └── Glosario
│
├── Lecturas con Criterio [biblioteca transversal]
├── Colaboradores [autoría y aportaciones]
├── Qué es NUVIA
├── Metodología
└── Independencia
```

El mapa representa destinos y contenidos existentes o su organización propuesta. No equivale a prometer nuevas funciones. La planificación patrimonial no se convierte por esta reorganización en un cuestionario, diagnóstico o recomendación personalizada. No se reintroduce «Familia y trabajo», retirado por decisión anterior.

### Navegación dentro de cada web

La cabecera incorpora una marca común con descriptor de la web, un **menú local de hasta cinco grupos** y un control «Ecosistema NUVIA» para cambiar de ámbito. El nombre de la web enlaza a su portada; el selector incluye la entrada común y las otras webs. El pie conserva los accesos transversales e institucionales.

| Web | Menú principal propuesto |
|---|---|
| Economía y Finanzas | Portada · Informes · Mercados · Cartera · Empresas |
| Patrimonio | Portada · Vivienda · Jubilación · Impuestos · Planificación |
| Familia, Salud y Bienestar | Portada · Respiración · Movimiento · Nutrición · Descanso |
| Academia NUVIA | Portada · Conocimientos · Cursos · Herramientas de aprendizaje · Glosario |

Los nombres abreviados de menú no sustituyen los títulos completos de las páginas. En Academia, Fundamentos y Activos se encuentran bajo Conocimientos; Interés compuesto, bajo Herramientas de aprendizaje. Todos los destinos seguirán siendo accesibles mediante enlaces directos.

Una página hija muestra una ruta como `Ecosistema › Patrimonio › Jubilación`. Si alguien llega desde un buscador, reconoce de inmediato dónde está y puede usar la herramienta sin pasar previamente por la portada común. Cambiar de web conserva la navegación habitual del navegador; no abre ventanas nuevas por defecto ni impone una pantalla intermedia.

### Lecturas con Criterio y Colaboradores

**Lecturas** conserva una única biblioteca y sus criterios editoriales. Las webs pueden enlazar lecturas relacionadas con su tema; no duplican las fichas ni generan cuatro catálogos separados. Su franja en el hub tiene carácter editorial y una acción hacia el catálogo.

**Colaboradores** conserva una página común. Cada ficha identifica nombre, área acreditada, breve trayectoria y contenidos publicados. En los artículos se mantiene el enlace a la ficha de autor. La reorganización no incorpora reservas, agenda, captación, enlaces comerciales ni títulos profesionales no aportados.

## 5. Recorridos que debe resolver el diseño

| Persona y necesidad | Recorrido esperado | Señal de que funciona |
|---|---|---|
| Primera visita: quiere comprender su jubilación | Ecosistema → Patrimonio → Jubilación | Identifica el acceso por su nombre; ve qué calcula, los supuestos y sus límites |
| Lectura habitual de actualidad | Acceso directo a Economía → Informes o Mercados | Encuentra fecha y tipo de contenido sin atravesar otras áreas |
| Quiere entender una palabra financiera | Academia → Glosario | Puede consultar el término y regresar al contenido de origen |
| Busca aprender desde cero | Ecosistema → Academia → Conocimientos esenciales | Distingue una lección de un curso y una herramienta |
| Quiere explorar una cartera | Economía → Cartera → Análisis | Conserva las herramientas y el guardado local existentes |
| Llega a un artículo de Bienestar desde un enlace | Artículo → Respiración y relajación → Bienestar | Reconoce autoría, contexto, fuentes y regreso; el vídeo se activa al pulsar |
| Busca quién escribe | Colaboradores → aportación publicada | Comprende el papel del autor sin confundirlo con una oferta de servicios |

Objetivo de diseño: desde el hub, la herramienta o categoría principal debe encontrarse normalmente en dos selecciones, sin contar acciones propias del simulador. Los artículos o lecciones pueden exigir una selección adicional. Se validará la localización real; el número de clics por sí solo no demuestra facilidad de uso.

## 6. Decisión técnica: qué significa dividir el proyecto

| Alternativa | Autonomía de experiencia | Autonomía de publicación | Coste y riesgo relativos | Valor para esta fase |
|---|---|---|---|---|
| **A. Un repositorio, un origen, cuatro webs con menús propios** | Alta si la navegación se separa correctamente | Sigue siendo una publicación conjunta en Pages | Menor; conserva integraciones y contexto del navegador | **Recomendada como primera entrega** |
| B. Un repositorio fuente, cuatro aplicaciones y despliegues propios | Alta | Alta con infraestructura de publicación específica | Medio/alto: integración entre orígenes, datos locales, dominios y operaciones | Evolución si aparece una necesidad real de ciclos independientes |
| C. Cuatro repositorios y un quinto para el hub | Alta | Alta | Alto: duplicación potencial, coordinación y versiones compartidas | Justificada cuando existan equipos o ritmos realmente separados |

La opción A es una separación de producto y mantenimiento por módulos; no se describirá como cuatro infraestructuras aisladas. La opción B permite mantener una fuente común sin renunciar a la independencia de despliegue, pero debe diseñarse y autorizarse como un cambio de publicación.

GitHub Pages publica sitios estáticos y limita los sitios de proyecto a uno por repositorio. Tener cuatro subdominios con publicaciones independientes no se obtiene únicamente añadiendo carpetas al repositorio actual. [Documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

### Organización de código propuesta

Se propone una separación lógica gradual, conservando la estructura que funciona mientras se extraen responsabilidades:

```text
Núcleo compartido
  marca, tokens, componentes, accesibilidad, navegación común
  registro de páginas, validaciones, metadatos y construcción

Ecosistema
  portada común, Lecturas, Colaboradores e institucionales

Economía y Finanzas
  entradas, informes, mercados
  Cartera y company-analysis como módulos especializados

Patrimonio
  entradas, guías y motores existentes

Bienestar
  categorías, artículos y contenido externo bajo acción

Academia
  categorías, lecciones, curso, glosario y cálculo didáctico
```

No se exige mover todos los archivos al principio. Primero se identifica qué módulo posee cada página, qué recursos comparte y qué dependencias acepta. Después, si aporta claridad, se materializan directorios de fuentes por web y paquetes comunes. Se evita cambiar rutas y cálculos al mismo tiempo.

El registro de páginas se ampliaría con la identidad de la web y la navegación local. Núcleo generaría la cáscara a partir de una plantilla común y la configuración de esa web. `shell:sync` y `shell:check` evolucionarían conjuntamente, conservando pruebas de comportamiento independientes del registro.

Las construcciones podrían preparar un artefacto por módulo para pruebas, aunque la primera publicación siga siendo conjunta. Una modificación de tokens o cabecera se valida en todas las webs; un cambio editorial se valida en su módulo y en los controles globales exigidos antes de entregar.

### Dependencias que se conservan

- La copia local de `company-analysis/`, su conexión existente y el contrato de comunicación con Cartera.
- Los motores de jubilación, vivienda, fiscalidad y sus pruebas; la separación visual no cambia resultados ni supuestos.
- La generación, contraste y aprobación humana de informes.
- Los nombres y formatos de almacenamiento local existentes; sin limpieza automática de datos.
- Los enlaces antiguos, parámetros y fragmentos que representan destinos o estados vigentes.

`localStorage` está asociado al origen del documento. Cambiar dominio, subdominio o protocolo afecta al acceso a esos datos. [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). **Inferencia aplicada a NUVIA:** una migración de dominio debe ofrecer continuidad explícita de las carteras guardadas; no puede asumirse que aparecerán en la nueva dirección. También habrá que revisar la validación de origen de los mensajes entre Cartera y Empresas. Un cambio de carpeta dentro del mismo origen no produce por sí solo ese cambio de almacenamiento.

## 7. Rutas, compatibilidad y posicionamiento

### Estrategia por etapas

**Primera integración:** conservar las URLs actuales y modificar su navegación y relación editorial. Esto permite evaluar la experiencia sin añadir simultáneamente una migración de direcciones.

**Ordenación opcional posterior:** adoptar rutas como `/economia/`, `/patrimonio/`, `/bienestar/` y `/academia/`, bajo la base de publicación actual o el dominio que se apruebe. Las rutas siguientes son propuestas, no rutas activadas ni dominios adquiridos.

En GitHub Pages, la base actual es `/NUVIA-PORTAL-ALFA/`. Los generadores de enlaces, assets y metadatos deben respetarla. No se escribirán enlaces absolutos a `/patrimonio/` suponiendo que la aplicación vive en la raíz del dominio.

### Matriz de correspondencia propuesta

| Ruta actual, relativa al portal | Destino lógico propuesto si se normalizan URLs |
|---|---|
| `index.html` | `/` · Ecosistema |
| `economia.html` | `/economia/` |
| `mercados.html` | `/economia/mercados/` |
| `mercados.html?vista=informes` | `/economia/informes/` |
| `cartera.html`, `cartera.html#laboratorio` | `/economia/cartera/`, conservando la entrada al laboratorio |
| `cartera.html?vista=companies` | `/economia/empresas/`, manteniendo la integración de la copia local |
| `company-analysis/` y sus recursos | Ubicación actual mientras no exista migración específica de integración |
| `patrimonio.html` | `/patrimonio/` |
| `vivienda.html` | `/patrimonio/vivienda/` |
| `jubilacion.html` | `/patrimonio/jubilacion/` |
| `fiscalidad.html` | `/patrimonio/impuestos/` |
| `guia-fiscal.html` | `/patrimonio/jubilacion/fiscalidad-epsv/` |
| `guia-planificacion.html` | `/patrimonio/jubilacion/planificacion/` |
| `guia-ahorro.html` | `/patrimonio/impuestos/ahorro/` |
| `guia-calendario.html` | `/patrimonio/impuestos/calendario/` |
| `guia-sucesiones.html` | `/patrimonio/impuestos/sucesiones-donaciones/` |
| `temas.html` | `/patrimonio/`, conservando la resolución de vistas heredadas |
| `temas.html?topic=planificacion-patrimonial` | `/patrimonio/planificacion/` |
| `guia-impuestos.html` | Alias a `/patrimonio/impuestos/#guias`; conserva su carácter no indexable |
| `bienestar.html` | `/bienestar/` |
| `temas.html?topic=bienestar` | `/bienestar/`, resolviendo también sus anclas heredadas |
| `respiracion-relajacion.html` | `/bienestar/respiracion-relajacion/` |
| `movimiento-consciente.html` | `/bienestar/movimiento-consciente/` |
| `nutricion-equilibrada.html` | `/bienestar/nutricion-equilibrada/` |
| `descanso-limites-tiempo-propio.html` | `/bienestar/descanso-limites-tiempo-propio/` |
| `la-respiracion-como-el-escultor-del-cerebro.html` | `/bienestar/respiracion-relajacion/la-respiracion-como-el-escultor-del-cerebro/` |
| `que-es-meditar.html` | `/bienestar/respiracion-relajacion/que-es-meditar/` |
| `academia.html`, `?tab=inicio` | `/academia/` |
| `academia.html?tab=esenciales` | `/academia/conocimientos-esenciales/` |
| `academia.html?tab=pib` | `/academia/conocimientos-esenciales/pib/` |
| `academia.html?tab=cursos` | `/academia/cursos/` |
| `academia.html?tab=fundamentos` | `/academia/fundamentos/` |
| `academia.html?tab=activos` | `/academia/activos/` |
| `academia.html?tab=calculadora` | `/academia/interes-compuesto/` |
| `academia.html?tab=glosario`, `academia.html#glosario` | `/academia/glosario/` |
| `curso.html` | `/academia/cursos/dinero-con-criterio/` |
| `lecturas.html` | `/lecturas/` |
| `colaboradores.html` | `/colaboradores/`, conservando IDs de autor |
| `que-es-nuvia.html` | `/que-es-nuvia/` |
| `metodologia.html` | `/metodologia/` |
| `independencia.html` | `/independencia/` |
| `sistema-visual.html` | Muestra técnica de Núcleo; conserva `noindex` |

Esta matriz cubre las páginas registradas y las vistas principales identificadas. Antes de migrar, se generará un inventario de **todos** los enlaces internos, parámetros aceptados y fragmentos de cada página; no se tratará esta tabla como catálogo exhaustivo de estados de las herramientas. Cada destino heredado tendrá prueba de llegada y de contenido.

Google aconseja preparar la correspondencia entre URLs antiguas y nuevas, probar el sitio y emplear redirecciones permanentes del servidor cuando sea posible. Desaconseja enviar muchas páginas antiguas a una portada irrelevante. [Google Search Central: migraciones con cambios de URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

**Aplicación propuesta a NUVIA:** conservar las rutas en la primera entrega; si después cambian, elegir un único destino canónico por contenido, actualizar enlaces y sitemap, y probar cada alias. No se prometerán redirecciones HTTP configurables con la infraestructura actual sin verificar su soporte. Un alias HTML con redirección en el navegador no se documentará como un 301. Las propiedades de búsqueda y dominios solo se modificarán con la autorización correspondiente.

## 8. Plan de ejecución y esfuerzo estimado

Los rangos siguientes son una **estimación de planificación**, no un presupuesto ni un compromiso de calendario. Suponen una persona de implementación con experiencia en el repositorio, revisión del fundador en cada hito y reutilización de contenido, imágenes y motores existentes. Una jornada representa un día de trabajo efectivo; las esperas de decisión o contenidos pueden ampliar el calendario.

| Fase | Entrega concreta | Criterio de salida | Esfuerzo estimado |
|---|---|---|---|
| 0. Decisión de arquitectura | Plan, prototipo, nombre y límites de la primera fase | El fundador decide la estructura y el alcance; se registra sin firmar en su nombre | Entrega actual; revisión 1–2 jornadas |
| 1. Inventario y contratos | Páginas, vistas, enlaces, fragmentos, assets, datos y dependencias por web | Todo recurso tiene propietario; se conserva la cobertura actual y se identifican rutas antiguas | 2–3 jornadas |
| 2. Núcleo preparado | Plantilla común con navegación por web, selector, pie y registro ampliado | Menús coherentes en escritorio y tablet; pruebas de cáscara y navegación superadas | 3–5 jornadas |
| 3. Hub y cuatro portadas | Diseño final integrado, textos y accesos verificables | Cada web se distingue y conduce a sus recursos; no promete contenido inexistente | 4–6 jornadas |
| 4. Páginas hijas y continuidad | Cabeceras locales, rutas de regreso, Academia ordenada, herramientas conservadas | Recorridos completos y equivalencia funcional de calculadoras, curso y analítica | 4–7 jornadas |
| 5. Calidad y revisión | Revisión de contenido, accesibilidad, render, enlaces, privacidad y regresiones | Resultados documentados y defectos resueltos o elevados con evidencia | 3–5 jornadas |
| 6. Publicación autorizada | Artefacto revisado, plan de reversión y comprobación de producción | Autorización expresa del fundador; Actions y verificación del resultado registradas | 1–2 jornadas |

**Total orientativo tras la propuesta:** 17–28 jornadas efectivas de ejecución, más la revisión de alcance. Como calendario de una persona, aproximadamente cuatro a siete semanas con revisiones razonablemente ágiles. El rango aumenta si se cambia el contenido, se crean fotografías nuevas, se rediseñan motores o se decide migrar de dominio simultáneamente.

**Separación de dominios y despliegues:** se estimará aparte tras una prueba técnica de Cartera/Empresas y continuidad de datos locales. No se asigna aquí un coste ficticio a hosting, dominios, proveedores o licencias que todavía no se han elegido.

### Orden de integración propuesto

Primero Núcleo y la portada; después Patrimonio y Academia, donde la jerarquía tiene valor inmediato; a continuación Bienestar con su catálogo real; por último Economía y Finanzas, conservando un recorrido específico de verificación de Cartera y Empresas. Este orden es una propuesta de reducción de dependencias, no una prioridad editorial permanente entre las cuatro webs.

La aprobación visual del hub no aprueba automáticamente cambios de cálculo, almacenamiento o proveedores. Si una dependencia exige ampliar el alcance, se documentará el cambio concreto y la decisión del fundador.

## 9. Validación, medición y continuidad operativa

### Criterios de aceptación de la integración futura

- Los cuatro accesos principales se reconocen por nombre y propósito; Lecturas y Colaboradores tienen una jerarquía transversal clara.
- Cada web presenta navegación propia y permite regresar al ecosistema en una acción visible.
- Todos los destinos actuales siguen accesibles; no hay enlaces internos rotos ni pérdida de parámetros o anclas relevantes.
- Cartera y Empresas conservan su integración; las carteras guardadas siguen disponibles bajo el origen conservado.
- Los motores de cálculo producen los mismos resultados para los casos de referencia existentes.
- La información nueva no añade prescripción financiera, juicios de idoneidad, captación ni diagnóstico sanitario.
- No se añaden formularios de captación, persistencia de datos personales ni rastreadores como consecuencia de este proyecto.
- Las imágenes no se repiten entre las páginas finales, las fuentes se autoalojan y los recursos externos mantienen la carga voluntaria.
- El diseño se revisa a 1440, 1280, 1024, 820 y 768 px, con teclado y foco visible, sin desbordamientos que impidan el uso.
- Metadatos, sitemap, canonical y estados `noindex` responden a la arquitectura efectivamente publicada.

Se ejecutarán las validaciones de cada módulo afectado, `npm run validate`, la auditoría de render y la construcción completa. `npm run build` ya incluye la validación global y `auditar`; se registrarán los comandos realmente ejecutados evitando presentar una repetición como prueba distinta. Las pruebas no se relajan para acomodar la propuesta.

### Comprobar utilidad sin introducir seguimiento

Se propone una revisión moderada con un pequeño grupo de lectores, coordinada por el fundador, utilizando tareas como «encuentra el simulador de jubilación» o «localiza el glosario». Se puede recoger un recuento agregado de aciertos, errores de navegación y dudas sin nombres, grabaciones ni perfiles. El método y la participación requieren organización expresa; este plan no contacta a nadie.

Objetivos de aceptación propuestos: que al menos cuatro de cinco participantes de una ronda pequeña encuentren cada destino principal sin ayuda y que ninguno confunda Colaboradores con contratación de servicios. Son criterios de diseño pendientes de medición, no resultados obtenidos ni conclusiones estadísticas.

El seguimiento técnico puede basarse en pruebas sintéticas de enlaces, tiempos de carga controlados y resultados de construcción. Si más adelante se desea analítica de uso, se definirá y autorizará aparte; no se presupone que «sin cookies» signifique ausencia de datos personales.

### Responsabilidades de mantenimiento

| Responsable funcional | Responsabilidad |
|---|---|
| Fundador | Prioridades, alcance, decisiones regulatorias y autorización de publicación |
| Núcleo | Marca, componentes, cáscara, registro de páginas, controles y publicación técnica |
| Responsable editorial de cada web, cuando se designe | Catálogo, fechas de revisión, fuentes y calidad de contenidos |
| Responsable de cada herramienta | Contratos de datos, cálculo, resultados y pruebas de regresión |
| Colaboradores | Contenido firmado y acreditación de su información, dentro del proceso editorial |

Cada contenido tiene una única ubicación canónica y un responsable; los demás espacios lo enlazan. Un cambio común se revisa en las cuatro webs. La separación en repositorios se reconsidera cuando existan necesidades observables de equipo, infraestructura o frecuencia de publicación; no se realiza solo por una preferencia de carpetas.

### Publicación y reversión

Antes de publicar se identificará el artefacto validado y la versión anterior recuperable. El fundador autorizará el commit y la publicación concretos. Tras Actions se comprobarán portada, cuatro entradas, rutas antiguas representativas y herramientas críticas.

Si aparece una regresión, se presentará evidencia al fundador y una acción concreta: corrección puntual o restauración de la versión anterior. No se eliminarán datos locales ni se modificarán bases de datos como parte de una reversión visual. Para evitar bucles de redirección, el mapa de rutas pertenecerá a la misma versión del sitio que se restaura.

## 10. Riesgos y decisiones que requieren criterio

| Riesgo | Evidencia o motivo | Respuesta propuesta |
|---|---|---|
| Cuatro webs que vuelven a crecer sin orden | La complejidad proviene también de menús y contenido | Menú local, catálogo con responsable y reglas de incorporación de nuevas páginas |
| Multiplicar mantenimiento | Cuatro copias divergentes de marca y componentes | Núcleo compartido y una fuente de cada contenido |
| Pérdida aparente de carteras guardadas al cambiar dominio | Almacenamiento por origen | Conservar el origen inicialmente; diseñar exportación/importación o continuidad específica si se autoriza migración |
| Ruptura de Cartera/Empresas | Comunicación e importaciones compartidas | Mantener integración actual; prueba específica antes de cualquier extracción |
| Presentar Bienestar como catálogo más completo de lo que es | Tres subsecciones sin artículos publicados | Estado «En preparación» y acceso al contenido real de Respiración |
| Exceso de promesa comercial | El usuario desea atractivo para su futuro público | Mostrar utilidad y confianza; mantener separación profesional y sin captación |
| Confusión entre nueva propuesta y norma vigente | Arquitectura de septiembre y orden de octubre siguen documentadas | Registrar la decisión posterior y actualizar referencias canónicas al integrar |
| Migración de enlaces mal planteada | Existen parámetros, fragmentos y páginas de compatibilidad | Inventario automatizado, mapa explícito y pruebas de destinos |
| Calidad visual desigual | Cuatro ámbitos con necesidades distintas | Compartir tipografía, escala, navegación y criterios de fotografía; diferenciar solo composición y acento |

Las incidencias se elevan con evidencia. Este plan no crea bloqueos unilaterales ni retira funciones existentes. La validación jurídica externa permanece fuera del alcance de la alfa por orden del fundador.

## 11. Decisiones concretas para el fundador

El prototipo y este plan permiten decidir sobre elementos identificables:

1. **Marca:** adoptar «NUVIA · Ecosistema» como descriptor de la portada común, conservando NUVIA y su propósito.
2. **Arquitectura de experiencia:** cuatro webs con igual peso; Lecturas con Criterio y Colaboradores transversales; Cartera y Empresas dentro de Economía y Finanzas.
3. **Primera fase técnica:** mantener repositorio, origen y publicación actual, con navegación y responsabilidades separadas por web.
4. **Diseño:** confirmar el equilibrio familiar/profesional y revisar la propuesta visual navegable antes de integrar.
5. **URLs:** conservar las direcciones actuales durante la primera integración; decidir una normalización posterior como fase independiente.
6. **Ejecución:** autorizar un alcance de implementación concreto y su secuencia. El commit y la publicación conservan sus autorizaciones propias.

Tras esa decisión se actualizarían, con fecha y alcance, la arquitectura canónica, la guía operativa, las fichas de módulo y el índice documental. La definición se mantendría si solo cambia la organización; cualquier cambio de propósito se registraría primero allí. No se considera la ausencia de respuesta como aprobación.

## Anexo A. Ficha de revisión interna previa · §12

**Objeto:** propuesta de portada distribuidora y navegación de cuatro webs.
**Necesidad:** hacer comprensible el conjunto y separar recorridos educativos.
**Clasificación propuesta de esta función:** **verde**, por distribución informativa sin perfilado, recomendación ni ejecución. Es una revisión interna de producto, no un dictamen jurídico. No modifica la clasificación de Cartera, Empresas, IA de informes u otras funciones heredadas; las superficies sensibles conservan sus fichas y revisiones propias.

| Pregunta obligatoria | Respuesta para esta propuesta |
|---|---|
| 1. ¿Qué necesidad educativa o informativa resuelve? | Orientar al lector y facilitar el acceso a información, formación y herramientas existentes. |
| 2. ¿Qué datos recibe y quién los elige? | Una selección de navegación del visitante. No se solicita perfil, patrimonio, salud ni identidad. |
| 3. ¿Qué cálculo o transformación realiza? | Ningún cálculo financiero nuevo; organiza y enlaza contenidos. |
| 4. ¿Qué resultado exacto muestra? | Portada común, cuatro entradas, navegación local y accesos transversales. |
| 5. ¿Se refiere a instrumentos o emisores identificables? | La portada y el selector no seleccionan ni valoran instrumentos. Las herramientas enlazadas conservan su revisión específica. |
| 6. ¿Utiliza circunstancias personales del usuario? | No. Las puertas son iguales para todos; la selección es explícita y temática. |
| 7. ¿Sugiere comprar, vender, mantener o no actuar? | No. Las acciones son explorar, leer, aprender y acceder a herramientas. |
| 8. ¿Opina sobre valor o precio actual o futuro? | No. |
| 9. ¿Puntúa, selecciona, destaca u ordena por atractivo inversor? | No. El orden corresponde a las cuatro familias de contenido. |
| 10. ¿Reproduce una recomendación de terceros? | No se introduce ninguna en el hub o la navegación. |
| 11. ¿Color, diseño o navegación convierten resultados en veredictos? | Los acentos identifican ámbitos; no hay puntuación, semáforo ni veredicto. Debe revisarse el efecto global al integrar. |
| 12. ¿Existe contacto, contratación o ejecución? | Solo acciones de navegación educativa. Colaboradores enlaza autorías y publicaciones, sin derivación comercial. |
| 13. ¿Existe remuneración, patrocinio, afiliación o conflicto? | No se añade ninguna de esas relaciones. Se mantienen las obligaciones existentes de independencia. |
| 14. ¿Puede afectar al agente vinculado o a la entidad representada? | No se añade conexión comercial ni marca de terceros. Una ampliación posterior se consultaría antes de actuar. |
| 15. ¿Qué datos personales trata y con qué base jurídica? | La propuesta no añade recogida ni almacenamiento de datos personales. No se modifican las condiciones del hosting o herramientas existentes. |
| 16. ¿Interviene IA y puede exceder el resultado permitido? | Se emplea asistencia de IA en el diseño y el documento; no se añade una función de IA para visitantes. Los flujos existentes mantienen controles propios. |
| 17. ¿Qué fuentes, fechas, fórmulas, supuestos y límites se muestran? | Fecha de propuesta, referencias del repositorio y fuentes técnicas citadas. Los accesos llevan a contenidos que conservan sus fuentes y límites. No hay fórmula nueva. |
| 18. ¿Qué pruebas y revisión humana impiden regresiones? | Inventario y enlaces, controles de lenguaje, navegación, render, contenido externo y regresión de herramientas; revisión del fundador sobre propuesta y resultado integrado. |

## Anexo B. Puertas de control · §13

| Momento | Estado y requisito de esta propuesta |
|---|---|
| Antes del diseño | Necesidad, datos y límites identificados; ficha anterior documentada. |
| Antes de programar producto | Acordar estructura final y contrato de navegación; revisar inventario de dependencias. El prototipo es una propuesta local, sin lógica financiera nueva. |
| Antes de integrar | Revisar código, textos, contraste, destinos y continuidad de las herramientas. No inferir aprobación desde una maqueta. |
| Antes de publicar | Registrar pruebas reales y autorización del fundador; conservar procedimiento de reversión. Requisitos contractuales concretos se consultarían si la modificación los afectara. |
| Validación jurídica externa | Fuera del alcance de la alfa; no obtenida ni requerida como bloqueo de esta propuesta. |

## Anexo C. Estado de validación de esta entrega

La propuesta local se ha comprobado en cinco portadas y siete anchos (35 renders, 1440–768 px), sin desbordes, imágenes rotas, errores de JavaScript ni conexiones externas; se verificaron enlaces locales, teclado, selector, regreso y movimiento reducido. El plan visual se comprobó a 1440 y 768 px.

La validación de Núcleo pasó. La auditoría del portal existente pasó en 50 páginas/vistas a 1440 px y el render específico de Empresas pasó a cinco anchos. La compilación completa se terminó por etapas tras resolver la ubicación de Chromium y el acceso local del sandbox; no se presenta como una ejecución única de `npm run build` con código 0. El prototipo queda fuera de `dist/`.

El [acta de validación](VALIDACION_ECOSISTEMA_NUVIA_20261112.md) detalla comandos, evidencias, avisos previos y límites. No se han realizado pruebas con usuarios, una auditoría integral de accesibilidad de la maqueta ni una migración de producción.

La aprobación de un plan, la calidad de un prototipo y el funcionamiento de una migración en producción son evidencias distintas. Esta entrega hace revisables las dos primeras; la tercera corresponde a la implementación y publicación que se autoricen posteriormente.

## Referencias de trabajo

**Revisión de textos y navegación:** la orden posterior del fundador unifica la presentación de cuatro webs y dos espacios comunes, incorpora Metodología e Independencia a la navegación del ecosistema y conserva enlaces antiguos. La definición registra la propuesta local sin cambiar sus párrafos públicos. Estado y pruebas actuales en [Textos y navegación del ecosistema](TEXTOS_Y_NAVEGACION_ECOSISTEMA_20261112.md).

**Espacios compartidos:** la orden posterior del fundador incorpora Lecturas con Criterio, Colaboradores y Qué es NUVIA a la misma maqueta, manteniendo todos sus contenidos. Diseño y verificación en [Espacios compartidos del ecosistema](ESPACIOS_COMPARTIDOS_ECOSISTEMA_20261112.md).

**Evolución posterior de esta misma propuesta:** por orden del fundador se han rediseñado las cuatro portadas y adaptado también los interiores. La maqueta completa se abre en `http://127.0.0.1:4187/` con `node prototipos/ecosistema-nuvia-20261112/servir-interiores.mjs`. El servidor incorpora las páginas y motores originales sin modificar su fuente. La entrega actual sí cuenta con una ejecución completa de `npm run build` con código 0, además de pruebas específicas de la presentación y funciones de los interiores. El alcance, evidencias y límites actualizados constan en [Adaptación de los interiores](ADAPTACION_INTERIORES_ECOSISTEMA_20261112.md); el anexo C anterior describe la entrega inicial, conservada como registro.

- `AGENTS.md`, órdenes de septiembre y octubre y alcance del fundador de 12-11-2026.
- `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` y `docs/nuvia-design-system.md`.
- `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md` y `docs/DEFINICION_NUVIA.md`.
- `docs/MARCO_REGULATORIO_OBLIGATORIO.md`, v1.2, especialmente §§0, 3, 5, 9, 11, 12–14.
- Las seis fichas en `docs/modulos/` y el inventario `scripts/paginas.mjs`.
- `scripts/build-site.mjs`, `scripts/site-shell.mjs`, `scripts/update-nav-footer.mjs` y `.github/workflows/pages.yml`.
- Implementaciones actuales de `cartera.html`, `company-analysis/`, Academia y subsecciones de Bienestar.
- Fuentes técnicas oficiales consultadas el 12-11-2026 y enlazadas junto a las afirmaciones correspondientes: GitHub Docs, MDN y Google Search Central.
