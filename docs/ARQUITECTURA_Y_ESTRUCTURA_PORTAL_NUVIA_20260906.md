# NUVIA — Arquitectura y Estructura Global del Portal

**Subtítulo:** Home de entrada, 5 Homes de espacio, Colaboradores, Qué es NUVIA y Navegación dirigida  
**Fecha:** 6 de septiembre de 2026  
**Destinatario:** Fundador de NUVIA  
**Estado:** Referencia estructural canónica · Nueva fase Alfa
**Referencia canónica:** [Marco regulatorio obligatorio v1.2](MARCO_REGULATORIO_OBLIGATORIO.md) y [Definición canónica de NUVIA](DEFINICION_NUVIA.md)

**Decisión del fundador · 8 de septiembre de 2026:** se adopta íntegramente este
documento como estructura definitiva de referencia y punto de partida de la nueva
fase de desarrollo. Todo el trabajo se realizará exclusivamente en
`NUVIA-PORTAL-ALFA`; `NUVIA-PORTAL-LAB` queda cerrado y fuera de alcance.

---

## 1. Naturaleza y Propósito de la Nueva Estructura

La directriz del fundador establece un principio rector para NUVIA: **claridad arquitectónica absoluta mediante una jerarquía ordenada**. 

Hasta la fecha, el portal sufría de una mezcla entre **portadas de espacio** y **herramientas de trabajo**:
- En *Economía y Finanzas*, la página de *Mercados* actuaba a la vez como visor de noticias y como supuesta portada del espacio.
- En *Patrimonio*, la página de *Temas* funcionaba como un índice genérico por parámetros de URL, mientras que los simuladores vivían como herramientas desconectadas.
- En *Academia*, todas las utilidades (píldoras, glosario, calculadoras y cursos) competían en pestañas dentro de una misma pantalla.

La nueva arquitectura separa limpiamente la **bienvenida y orientación** de la **ejecución de cálculos o lectura profunda**, estructurando el portal en cuatro niveles nítidos:

1. **Nivel 1 · Entrada Principal (Home Global):** Puerta de entrada al portal, presentación del propósito y mapa distribuidor hacia los 5 espacios.
2. **Nivel 2 · Las 5 Homes de Espacio:** Sedes propias de cada ámbito que explican qué se aprende allí, ofrecen contexto familiar y distribuyen el acceso a sus recursos.
3. **Nivel 3 · Herramientas y Contenidos Especializados:** Simuladores (vivienda, jubilación, cartera), guías didácticas, cursos y análisis de empresas.
4. **Nivel 4 · Identidad y Equipo:** Páginas institucionales de *Colaboradores* y *Qué es NUVIA* (espíritu y filosofía).

![Diagrama de Arquitectura Canónica de NUVIA](pdf/diagrama-estructura-2x.png)
*Figura 1: Mapa jerárquico canónico de NUVIA (Nivel 1 Entrada Principal → Nivel 2 Los 5 Espacios con Home propia → Nivel 3 Herramientas de Espacio · Nivel Institucional / Identidad).*

---

## 2. Mapa Arquitectónico y Rutas Canónicas

| Destino | Ruta canónica | Rol funcional | Estado |
| :--- | :--- | :--- | :--- |
| **Home de Entrada** | `index.html` | Bienvenida global, presentación del propósito y cinco bloques visuales con acceso a las Homes de espacio. Las herramientas se consultan desde cada espacio y la navegación global, sin índices repetidos en el cuerpo de Inicio. | Simplificada sobre el diseño original. |
| **Home: Economía y Finanzas** | `economia.html` (o `mercados.html` redefinida) | Sede del espacio: contexto macroeconómico, relación con el hogar y derivación a mercados, cartera y empresas. | **Por diseñar / estructurar.** |
| **Home: Patrimonio** | `patrimonio.html` (reemplaza a `temas.html`) | Sede del espacio: mapa de la economía familiar (vivienda, retiro, impuestos) y acceso directo a simuladores. | **Por diseñar / estructurar.** |
| **Home: Familia, Salud y Bienestar** | `bienestar.html` | Sede del espacio: estilo de vida, hábitos saludables y serenidad familiar (sin diagnóstico médico). | **Por diseñar / estructurar.** |
| **Home: Academia NUVIA** | `academia.html` (reestructurada como portal) | Sede del campus: itinerarios pedagógicos, glosario, calculadoras didácticas y acceso a cursos. | **Por diseñar / estructurar.** |
| **Home: Lecturas con Criterio** | `lecturas.html` (reestructurada como espacio) | Sede de la biblioteca: criterio editorial, selecciones bibliográficas y ensayos de largo plazo. | **Por diseñar / estructurar.** |
| **Colaboradores** | `colaboradores.html` | Minisección / página de equipo: fotografía, perfil y breve currículum de quienes aportan al portal. | **Por diseñar / estructurar.** |
| **Qué es NUVIA** | `que-es-nuvia.html` | Manifiesto fundacional, espíritu, valores (Claridad, Honestidad, Independencia) y límites éticos. | Activa / Apta. |

---

## 3. Diagnóstico: Por qué «no vale lo que hay» en las Homes Actuales

La orden del fundador es taxativa: **«las home de cada espacio están todavía por diseñar / estructurar. NO me vale lo que hay»**. El análisis técnico y funcional confirma la necesidad de esta transformación:

### 3.1. Economía y Finanzas (`mercados.html`)
* **Problema actual:** La página arranca inmediatamente con las tarjetas de noticias macroeconómicas y el panel de cotizaciones de activos. Pretende ser a la vez la portada de un periódico financiero y la antesala de la analítica cuantitativa de carteras.
* **Carencia:** El usuario llega sin anestesia a datos técnicos. Falta una verdadera *Home* que explique primero al ciudadano común qué significan la inflación o los tipos de interés en su día a día y qué herramientas tiene NUVIA para ayudarle a entenderlos.

### 3.2. Patrimonio (`temas.html`)
* **Problema actual:** Es un contenedor genérico parametrizado (`?topic=jubilacion`, etc.). Resulta frío, técnico y puramente taxonómico.
* **Carencia:** No actúa como el centro neurálgico del patrimonio familiar. Una familia necesita ver cómo su hipoteca, sus impuestos anuales y su futura jubilación forman parte de un mismo flujo vital interconectado.

### 3.3. Familia, Salud y Bienestar (`temas.html?topic=bienestar`)
* **Problema actual:** Figura relegada como un subtema dentro de la página de patrimonio, perdiendo su identidad propia.
* **Carencia:** El bienestar, los hábitos y la relación con el tiempo y el dinero requieren un espacio visualmente sereno, diferenciado y con entidad autónoma.

### 3.4. Academia NUVIA (`academia.html`)
* **Problema actual:** Todo el catálogo (píldoras de activos, glosario, calculadora de interés compuesto y acceso a cursos) está comprimido en pestañas dentro de una única página interactiva.
* **Carencia:** Falta un vestíbulo pedagógico que guíe al estudiante: orientar según el nivel de partida (desde quien no sabe nada de finanzas hasta quien quiere analizar fondos de inversión).

### 3.5. Lecturas con Criterio (`lecturas.html`)
* **Problema actual:** Se reduce a una cuadrícula de libros con un filtro en JavaScript, sin jerarquía de lectura ni relato editorial.
* **Carencia:** Debe ser la biblioteca reflexiva de NUVIA, explicando el porqué de cada recomendación editorial y agrupando las obras por temas vitales (psicología del dinero, historia económica, toma de decisiones).

---

## 4. Patrón y Requerimientos de Diseño para las 5 Nuevas Homes de Espacio

Cada una de las 5 Homes de espacio contará con su propia identidad cromática y tonal, pero compartirá un **esqueleto estructural común y armonizado**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. APERTURA INSTITUCIONAL DEL ESPACIO                                    │
│    • Miga de pan contextual: Inicio > [Nombre del Espacio]              │
│    • Titular de perspectiva en tipografía Fraunces: ¿Qué se comprende?  │
│    • Párrafo de propósito: conexión con la vida familiar                │
└─────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. MAPA DE RECURSOS Y HERRAMIENTAS                                      │
│    Tarjetas visuales con indicador claro de función:                     │
│    [ Herramienta / Simulador ]   [ Guía Didáctica ]   [ Análisis ]      │
└─────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. CONCEPTO O DESTACADO ESENCIAL                                        │
│    La noción fundamental que la familia debe asimilar en este ámbito    │
└─────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. AVISO DE FUENTES, LÍMITES Y PERSPECTIVA INDEPENDIENTE                │
│    (Recordatorio de rigor académico y ausencia de asesoramiento)        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Especificaciones por espacio:

1. **Home de Economía y Finanzas:**
   * Apertura centrada en el contexto: cómo los precios, tipos y ciclos afectan al ahorro y los salarios.
   * Tres accesos principales: *Actualidad y Macro*, *Laboratorio de Cartera* y *Análisis de Empresas*.
   * Explicación de fuentes oficiales (BCE, Eurostat, INE).

2. **Home de Patrimonio:**
   * Apertura centrada en las decisiones de fondo del hogar.
   * Accesos directos y destacados a las cuatro áreas maestras: *Vivienda y coste de vida*, *Jubilación y futuro*, *Fiscalidad e impuestos* y *Guías patrimoniales*.
   * Mensaje de tranquilidad y planificación preventiva a largo plazo.

3. **Home de Familia, Salud y Bienestar:**
   * Apertura serena y humana sobre el equilibrio entre tiempo, salud y patrimonio.
   * Pilares divulgativos: cuerpo y actividad, mente y descanso, hábitos sostenibles.
   * Advertencia taxativa: divulgación basada en fuentes solventes, sin emisión de diagnósticos ni prescripciones sanitarias individuales.

4. **Home de Academia NUVIA:**
   * Apertura bajo el lema fundacional: «Saber es patrimonio».
   * Rutas de aprendizaje recomendadas por nivel de experiencia.
   * Accesos directos a los tres módulos: *Conocimientos esenciales*, *Glosario financiero* y *Cursos monográficos*.

5. **Home de Lecturas con Criterio:**
   * Apertura sobre la lectura pausada como antídoto contra el ruido y la impulsividad financiera.
   * Colecciones temáticas curadas: «Clásicos imprescindibles», «Comportamiento y sesgos», «Pensar a décadas vista».
   * Acceso al catálogo interactivo completo de fichas analíticas.

---

## 5. Página / Minisección de Colaboradores

Conforme a lo indicado por el fundador, esta página o minisección tendrá un formato sencillo, transparente y honesto: **«aparecerán los colaboradores de la web con una foto suya y un pequeño currículum»**.

### 5.1. Estructura de la ficha de colaborador
Cada colaborador se presentará en una tarjeta individual con los siguientes elementos:
* **Fotografía:** Retrato sobrio, natural y sin artificios comerciales, integrado con la paleta visual de NUVIA.
* **Nombre y especialidad:** Nombre completo y titulación o área de especialización profesional (ej. *Economista*, *Analista cuantitativo*, *Divulgador fiscal*).
* **Pequeño currículum:** Párrafo sintético (3 a 5 líneas) describiendo su trayectoria, experiencia y vocación educativa.
* **Contribución a NUVIA:** Mención a los contenidos o herramientas en los que colabora (ej. *Autor en Academia*, *Modelos de Cartera*, *Revisión didáctica de guías*).

### 5.2. Gobernanza regulatoria obligatoria (§9 del Marco)
Para garantizar la compatibilidad profesional y el blindaje deontológico:
* **Cero captación de clientes:** No se incluirán formularios de contacto directo, solicitudes de reunión, números de teléfono ni correos comerciales.
* **Prohibida la comercialización:** No se vincularán productos bancarios, plataformas de inversión ni enlaces de afiliación.
* **Separación estricta del agente vinculado:** El promotor de NUVIA que ostenta la condición de agente vinculado aparecerá identificado exclusivamente por su labor en la plataforma, sin exhibir logotipos ni marcas de la entidad bancaria a la que representa.

---

## 6. Página Institucional: «Qué es NUVIA» (Espíritu y Filosofía)

La página `que-es-nuvia.html` permanece como el bastión institucional del proyecto. Su función es explicar a cualquier ciudadano qué hace único a este portal:

1. **La Definición Canónica:** «NUVIA es un lugar donde las familias aprenden a entender su dinero».
2. **Los Tres Pilares:**
   * **Comprender:** La realidad de los ingresos, costes, deuda y patrimonio.
   * **Cuidar:** Proteger el capital familiar frente a la inflación y las comisiones innecesarias.
   * **Transmitir:** Dejar en legado conocimiento y criterio a las siguientes generaciones.
3. **Los Valores Fundacionales:**
   * **Claridad:** Si algo no se puede explicar de forma sencilla, no está listo para publicarse.
   * **Honestidad:** Se muestran siempre los límites, supuestos e incertidumbres de cada cálculo.
   * **Independencia:** No vende productos ni cobra de entidades financieras.
   * **Respeto por los profesionales:** La formación empodera a la familia, pero no sustituye al asesoramiento legal o fiscal cuando una decisión lo requiere.
4. **El Lema:** «NUVIA informa, explica y calcula. Tú comprendes y decides».

---

## 7. Dirección de la Cabecera Global (Header)

La cabecera del portal debe articular de forma limpia y directa el acceso tanto a las **Homes de cada espacio** como a sus **herramientas internas** y a las **páginas institucionales**.

### 7.1. Esquema de Navegación en Escritorio

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ NUVIA Family Wealth ]                                                                                 │
│   (Logo -> index.html)                                                                                  │
│                                                                                                         │
│   [1. Economía y Finanzas ▾]  [2. Patrimonio ▾]  [3. Bienestar]  [4. Academia ▾]  [5. Lecturas ▾]       │
│                                                                                                         │
│   ────────────────────────────────────────────── [ Colaboradores ]  [ Qué es NUVIA ] ─────────────────  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Arquitectura de los menús desplegables:
El primer destino dentro de cada menú desplegable es siempre la **Home del Espacio**:

1. **Economía y Finanzas ▾**
   * **`→ Portada del espacio (Home)`**
   * Mercados y noticias
   * Laboratorio de cartera
   * Análisis de empresas
2. **Patrimonio ▾**
   * **`→ Portada del espacio (Home)`**
   * Vivienda y coste de vida
   * Jubilación
   * Fiscalidad e impuestos
   * Guías patrimoniales
3. **Familia, Salud y Bienestar**
   * **`→ Portada del espacio (Home)`** *(enlace directo al tratarse de un espacio unitario)*
4. **Academia NUVIA ▾**
   * **`→ Portada del campus (Home)`**
   * Conocimientos esenciales
   * Glosario financiero
   * Cursos monográficos
5. **Lecturas con Criterio ▾**
   * **`→ Portada del espacio (Home)`**
   * Catálogo de libros y fichas
6. **Bloque Institucional (Navegación secundaria):**
   * **Colaboradores** *(enlace directo a `colaboradores.html`)*
   * **Qué es NUVIA** *(enlace directo a `que-es-nuvia.html`)*

### 7.2. Geometría y Rendimiento en Tablet (768 px – 1024 px)
* **Altura contenida:** Mantener el límite geométrico optimizado en la auditoría (**~109 px** a 768 px de ancho), impidiendo que la cabecera devore la primera pantalla útil.
* **Organización en dos alturas:**
  * Fila superior: Logotipo institucional a la izquierda; accesos a *Colaboradores* y *Qué es NUVIA* a la derecha.
  * Fila inferior: Los 5 espacios distribuidos de forma táctil y accesible, con un área mínima de pulsación de 44 px (cumpliendo WCAG AA).

---

## 8. Plan de Ejecución Técnico

**Actualización de jerarquía · 10-09-2026.** Tras la auditoría de duplicidades y la autorización «Ok adelante», las páginas hijas adoptan entrada compacta, nombre propio y regreso a su Home canónica. Las portadas conservan protagonismo; Lecturas con Criterio mantiene su diseño independiente. El mapa de destinos, la compatibilidad de enlaces anteriores y los controles se detallan en [Jerarquía visual y navegación](JERARQUIA_VISUAL_20260910.md). La fuente editorial implementada es Newsreader; las menciones históricas a Fraunces en las propuestas anteriores no cambian la tipografía vigente.

1. **Fase 1 · Maquetación de `colaboradores.html`:**
   * Creación del archivo base con la plantilla unificada `_plantilla.html`.
   * Rejilla de tarjetas de colaboradores (foto, nombre, especialidad, CV y rol en NUVIA).
2. **Fase 2 · Diseño estructural de las 5 Homes de espacio:**
   * Implementación de la plantilla común (apertura, mapa de herramientas, concepto destacado, aviso metodológico).
   * Generación de las 5 vistas de aterrizaje (`economia.html`, `patrimonio.html`, `bienestar.html`, `academia.html` y `lecturas.html`).
3. **Fase 3 · Actualización del Header y Enrutamiento Global:**
   * Modificación de `nuvia-site-header` en todas las páginas del portal.
   * Actualización del sincronizador de rutas `nuvia-site-unified.js`.
4. **Fase 4 · Verificación y Calidad Automatizada:**
   * Actualización de los contratos de navegación (`docs/nuvia-navigation.test.mjs`).
   * Ejecución de la auditoría visual completa con Playwright (`npm run auditar`) verificando los 30 estados a 1440 px y viewports de tablet sin regresiones.
