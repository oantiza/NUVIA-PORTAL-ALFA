# Índice de documentación · NUVIA Portal Alfa

**Actualizado:** 12-10-2026. Este índice dice **qué documento manda en cada tema** y cuáles son actas históricas. No mueve ningún archivo: todo sigue en `docs/`. Los históricos se conservan como registro de decisiones y verificaciones; no se usan como norma salvo que una ficha de módulo los cite.

Entrada de lectura: `AGENTS.md` (capas) → ficha del módulo en `docs/modulos/` → documentos de esta lista según la tarea.

---

## 1. Normativa transversal (vigente)

| Documento | Rango | Cuándo leerlo |
|---|---|---|
| `AGENTS.md` | Entrada única, capas 0-1-2 y órdenes del fundador íntegras | Siempre |
| `docs/ORDENES_PERMANENTES_FUNDADOR_ALFA_20260903.md` | Orden del fundador, texto íntegro | Siempre (resumida en la capa 0) |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` (v1.2) | Norma superior del proyecto | Secciones según ficha; entero en Cartera y empresas y ante cualquier función nueva |
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` (v1.1, 12-10-2026) | Guía operativa de diseño, estructura, contenido y validación | §1 siempre; entera en Núcleo y ante páginas nuevas |
| `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md` | Estructura canónica (niveles, cinco espacios, cabecera) | Estructura, navegación, páginas nuevas |
| `docs/DEFINICION_NUVIA.md` | Documento vivo: qué es NUVIA | Textos de presentación y comunicación |
| `docs/nuvia-design-system.md` | Organización de las hojas de estilo | Cualquier cambio de CSS |
| `docs/IDEAS_FUTURAS_NO_ACTIVAS_NUVIA_20260901.md` | Registro de ideas no activas | Antes de proponer algo «nuevo» |

## 2. Fichas de módulo (vigentes, creadas el 12-10-2026)

| Módulo | Ficha |
|---|---|
| Núcleo y diseño | `docs/modulos/nucleo.md` |
| Economía y Finanzas · mercados e informes | `docs/modulos/economia-informes.md` |
| Patrimonio | `docs/modulos/patrimonio.md` |
| Familia, Salud y Bienestar | `docs/modulos/bienestar.md` |
| Academia NUVIA y Lecturas con Criterio | `docs/modulos/academia-lecturas.md` |
| Mi cartera y Análisis y valoración de empresas | `docs/modulos/cartera-empresas.md` |

## 3. Documentos vigentes por módulo

Son los que fijan el estado actual de cada parte; cuando una ficha de fecha posterior sustituye a otra, aquí figura la posterior.

**Economía y Finanzas · mercados e informes**
- `docs/POLITICA_EDITORIAL_NOTICIAS_MERCADOS_20260902.md` — criterios editoriales de noticias y mercados.
- `docs/INFORMES_MERCADO_AUTOMATIZACION_20260919.md` — flujo vigente: borrador con Gemini, contraste sin IA, `/publicar`.
- `docs/INFORMES_MERCADO_V2_1_PRESENTACION_20260918.md` — diseño vigente de los informes.
- `scripts/informes-mercado/contrato.mjs` — contrato del informe (código normativo).

**Patrimonio**
- `docs/JUBILACION_MULTITERRITORIO_20261004.md` — simulador y guías en cinco territorios (fase 1).
- `docs/JUBILACION_FASE2_CCAA_20261005.md` — escalas autonómicas de las 15 comunidades (fase 2).
- `docs/JUBILACION_MULTITERRITORIO_REVISION_20261004.md` — despliegue y revisión de parámetros.
- `docs/JUBILACION_REDISENO_20260923.md` — auditoría de cálculo y rediseño del simulador.
- `docs/IMPUESTOS_DISENO_20260923.md` — diseño de Impuestos y guías.

**Familia, Salud y Bienestar**
- `docs/BIENESTAR_REDISENO_20261002.md` — portada, subsecciones y artículo.
- `docs/FICHA_RESPIRACION_20261002.md` — modelo de publicación de un artículo con vídeo.

**Academia NUVIA y Lecturas con Criterio**
- `docs/PIB_REVISION_20260915.md` — modelo de lección de Conocimientos esenciales.
- `docs/ENTREGA_5A_4_ITINERARIO_ACADEMIA_20260902.md` — itinerario de Academia.
- `docs/ENTREGA_5A_5_LECTURAS_CRITERIOS_CATALOGO_20260902.md` — criterios del catálogo de Lecturas.

**Mi cartera y Análisis y valoración de empresas**
- `docs/BASES_ANALISIS_CARTERA.md` — bases funcionales.
- `docs/IMPLEMENTACION_ANALISIS_CARTERA.md` — guía de implementación.
- `docs/FICHA_REGULATORIA_ALFA_BASE_PROPIA.md` — base propia de la alfa (ÁMBAR).
- `docs/FICHA_REGULATORIA_EMPRESAS_BASE_PROPIA.md` y `docs/FICHA_REGULATORIA_ANALISIS_EMPRESAS.md` — módulo de empresas.
- `docs/INFORMACION_TECNICA_ALFA_20260903.md` — funcionamiento de la alfa.
- `docs/PASO_LOCAL_GUARDADO_CARTERAS_20260902.md` — carteras guardadas en el navegador.
- `universo/universo-alfa.LEEME.md` — universo de instrumentos.

**Núcleo y diseño**
- La guía maestra y la arquitectura (sección 1). Las fichas regulatorias de Home, fondo, banners, navegación, páginas interiores y páginas de confianza documentan decisiones ya incorporadas a la guía; se consultan solo para entender el porqué.

## 4. Pruebas y material auxiliar en `docs/`

- `docs/*.test.mjs` (79 archivos): pruebas que `package.json` invoca por ruta. **Moverlas de carpeta es un cambio funcional**; queda para el paso de comprobaciones por módulo.
- `docs/fixtures/`, `docs/evidence/`, `docs/previews/`, `docs/visuales/`: datos y capturas que usan las pruebas y las fichas.
- `docs/backend-recuperado/`: copia de referencia; no se ejecuta.
- `docs/pdf/`: PDF regenerables (ignorados por git).

## 5. Documentos históricos

Actas, entregas, verificaciones, planes y fichas de fecha concreta. Registran cómo se llegó al estado actual. Se citan desde las fichas de módulo cuando aportan contexto. Lista generada el 12-10-2026 a partir de los archivos existentes.

**Economía y Finanzas · mercados e informes** (10)

| Documento | Último cambio | Título |
|---|---|---|
| `CIERRE_ENTREGA_3A_NOTICIAS_MERCADOS_20260902.md` | 2026-09-07 | NUVIA · Cierre de la Entrega 3A · Noticias y Mercados |
| `ENTREGA_5A_2_ENTRADA_ECONOMIA_FINANZAS_20260902.md` | 2026-09-07 | Entrega 5A · Bloque 2: entrada de Economía y Finanzas |
| `FICHA_REGULATORIA_SISTEMA_EDITORIAL_ENTREGA_3_20260902.md` | 2026-09-07 | Ficha regulatoria · Sistema editorial de noticias y mercados |
| `INFOGRAFIAS_INFORMES_20260917.md` | 2026-09-17 | Apertura ilustrada de los informes · 17-09-2026 |
| `INFORMES_MERCADO_CONSULTA_20260910.md` | 2026-09-11 | Informes de mercado · consulta al fundador y decisión |
| `INFORMES_MERCADO_V2_20260914.md` | 2026-09-14 | Informes de mercado v2 · tablas, gráfico y lenguaje llano · 14-09-2026 |
| `MERCADOS_NOTICIAS_EDITORIAL_20260922.md` | 2026-09-22 | Mercados y noticias · Más noticias con maquetación editorial |
| `MERCADOS_NOTICIAS_REVISION_20260919.md` | 2026-09-19 | Mercados y noticias · cotizaciones reales, noticias variadas y franja de informes · 19-09- |
| `REDISENO_PORTADA_ECONOMIA_20260918.md` | 2026-09-18 | Economía y Finanzas · Rediseño ligero de la portada |
| `REVISION_INFORMES_20260911.md` | 2026-09-11 | Revisión e integración de informes · 11-09-2026 |

**Patrimonio** (7)

| Documento | Último cambio | Título |
|---|---|---|
| `ALINEACION_FORMULARIOS_20260904.md` | 2026-09-07 | Alineación de formularios · 4 de septiembre de 2026 |
| `ENTREGA_4B_2_BOTONES_FORMULARIOS_20260902.md` | 2026-09-07 | Entrega 4B · Bloque 2: botones y formularios |
| `ENTREGA_5A_1_ENTRADA_PATRIMONIO_20260902.md` | 2026-09-07 | Entrega 5A · Bloque 1: entrada de Patrimonio |
| `FICHA_REGULATORIA_BANNER_PATRIMONIO.md` | 2026-09-07 | Ficha regulatoria — banner de Patrimonio en Inicio |
| `JUBILACION_DISENO_20260922.md` | 2026-09-22 | Jubilación · revisión de diseño · 22-09-2026 |
| `REDISENO_PORTADA_PATRIMONIO_20260922.md` | 2026-09-22 | Patrimonio · Rediseño ligero de la portada |
| `REVISION_FORMULARIOS_ENLACES_20260902.md` | 2026-09-07 | NUVIA · Formularios, calculadoras y destinos pendientes |

**Familia, Salud y Bienestar** (1)

| Documento | Último cambio | Título |
|---|---|---|
| `ENTREGA_5A_3_ENTRADA_FAMILIA_BIENESTAR_20260902.md` | 2026-09-07 | Entrega 5A · Bloque 3: Familia, Salud y Bienestar |

**Academia NUVIA y Lecturas con Criterio** (8)

| Documento | Último cambio | Título |
|---|---|---|
| `ACADEMIA_BANNERS_AULA_20260909.md` | 2026-09-09 | Academia NUVIA · Dos banners con aula moderna |
| `ACADEMIA_HERO_PANORAMICA_20260909.md` | 2026-09-09 | Academia · Ampliación de la fotografía hacia la derecha |
| `ACADEMIA_IMAGEN_APRENDIZAJE_20260909.md` | 2026-09-09 | Academia NUVIA · Fotografía de aprendizaje en familia |
| `ENTREGA_4B_1_NAVEGACION_LECTURAS_20260902.md` | 2026-09-07 | Entrega 4B · Bloque 1: navegación y tarjetas de Lecturas |
| `FICHA_REGULATORIA_BANNER_LECTURAS.md` | 2026-09-07 | Ficha regulatoria — banner de Lecturas en Inicio |
| `FICHA_REGULATORIA_HERO_ACADEMY.md` | 2026-09-07 | Ficha regulatoria · Fondo académico del hero Academy |
| `FICHA_REGULATORIA_INTRO_ACADEMIA.md` | 2026-09-07 | Ficha regulatoria — retirada de la apertura audiovisual de Academia NUVIA |
| `VIDEO_QUE_ES_NUVIA_GUION_Y_COLOCACION_20260903.md` | 2026-09-07 | Qué es NUVIA · valoración, guion y colocación del vídeo |

**Núcleo y diseño** (31)

| Documento | Último cambio | Título |
|---|---|---|
| `AJUSTE_KPI_WEB_20260904.md` | 2026-09-07 | KPI compactos en NUVIA · 04-09-2026 |
| `AUDITORIA_DISENO_Y_PLAN_NUVIA_20260905.md` | 2026-09-07 | Auditoría de diseño, estructura y coherencia de NUVIA |
| `AUDITORIA_ESTRUCTURA_HOMOGENEIZACION_WEB_2026-09-01.md` | 2026-09-07 | Auditoría integral de estructura y homogeneización de NUVIA |
| `BORRADOR_AVISO_LEGAL_ENTREGA_2_20260902.md` | 2026-09-07 | Borrador interno · Aviso legal de NUVIA |
| `BORRADOR_CONDICIONES_USO_ENTREGA_2_20260902.md` | 2026-09-07 | Borrador interno · Condiciones de uso de NUVIA |
| `BORRADOR_DECLARACION_ACCESIBILIDAD_ENTREGA_2_20260902.md` | 2026-09-07 | Borrador interno · Declaración de accesibilidad de NUVIA |
| `BORRADOR_PRIVACIDAD_ENTREGA_2_20260902.md` | 2026-09-07 | Borrador interno · Política de privacidad de NUVIA |
| `BORRADOR_TECNOLOGIAS_ALMACENAMIENTO_ENTREGA_2_20260902.md` | 2026-09-07 | Borrador interno · Cookies, almacenamiento local y contenido externo |
| `DECISIONES_PENDIENTES_CONFIANZA_ENTREGA_2_20260902.md` | 2026-09-07 | NUVIA · Decisiones pendientes para cerrar las páginas de confianza |
| `ENTREGA_4A_1_FUNDAMENTOS_VISUALES_20260902.md` | 2026-09-07 | Entrega 4A · Bloque 1: escala de títulos y pruebas aisladas |
| `ENTREGA_4A_2_ANCHOS_ESPACIADOS_20260902.md` | 2026-09-07 | Entrega 4A · Bloque 2: anchos y espaciados |
| `ENTREGA_4A_3_SUPERFICIES_ARQUETIPOS_20260902.md` | 2026-09-07 | Entrega 4A · Bloque 3: superficies y arquetipos |
| `ENTREGA_4B_3_TABLAS_RESULTADOS_20260902.md` | 2026-09-07 | Entrega 4B · Bloque 3: tablas y resúmenes de resultados |
| `ENTREGA_4B_4_AVISOS_ESTADOS_20260902.md` | 2026-09-07 | Entrega 4B · Bloque 4: avisos, estados vacíos y actualización |
| `ENTREGA_4B_5_REVISION_FAMILIAS_20260902.md` | 2026-09-07 | Entrega 4B · Bloque 5: revisión de cierre por familias |
| `FICHA_REGULATORIA_ACCESIBILIDAD_ENTREGA_2_20260902.md` | 2026-09-07 | NUVIA · Ficha regulatoria de accesibilidad técnica |
| `FICHA_REGULATORIA_CONTENIDO_EXTERNO_ENTREGA_2_20260902.md` | 2026-09-07 | NUVIA · Ficha regulatoria de contenido externo |
| `FICHA_REGULATORIA_DISENO_INTERIOR.md` | 2026-09-07 | Ficha regulatoria — diseño de las páginas interiores |
| `FICHA_REGULATORIA_FONDO_INICIO.md` | 2026-09-07 | Ficha regulatoria — fondo unificado de Inicio |
| `FICHA_REGULATORIA_HOME_2026.md` | 2026-09-07 | Ficha regulatoria — rediseño de la portada · 1 de septiembre de 2026 |
| `FICHA_REGULATORIA_METADATOS_SOCIALES_ENTREGA_2_20260901.md` | 2026-09-07 | NUVIA · Ficha regulatoria de metadatos y tarjeta social |
| `FICHA_REGULATORIA_NAVEGACION_CABECERA.md` | 2026-09-07 | Cabecera común y categoría Planificación patrimonial |
| `FICHA_REGULATORIA_PAGINAS_CONFIANZA_20260908.md` | 2026-09-08 | NUVIA · Ficha regulatoria de las páginas de confianza |
| `FICHA_REGULATORIA_QUE_ES_NUVIA.md` | 2026-09-07 | Ficha regulatoria — página «¿Qué es NUVIA?» |
| `FICHA_REGULATORIA_VARIANTES_BANNERS_HOME.md` | 2026-09-07 | Ficha regulatoria — variantes locales de Patrimonio y Bienestar |
| `JERARQUIA_VISUAL_20260910.md` | 2026-09-10 | Jerarquía visual y navegación · 10-09-2026 |
| `MEJORA_CONTINUISTA_HOMES_20260908.md` | 2026-09-09 | Mejora de las portadas sobre el diseño original · 08-09-2026 |
| `PANORAMICAS_ESPACIOS_20260909.md` | 2026-09-09 | Panorámicas de los cuatro espacios · 09-09-2026 |
| `REDISENO_NUVIA_20260905.md` | 2026-09-07 | Rediseño NUVIA · implantación local · 5 de septiembre de 2026 |
| `REFACTORIZACION_CSS_20260909.md` | 2026-09-09 | Refactorización CSS · 09-09-2026 |
| `SUBSECCIONES_CABECERA_20260923.md` | 2026-09-23 | Cabecera de subsección en el resto de páginas hijas · 23-09-2026 |

**Visión, planes y actas generales** (10)

| Documento | Último cambio | Título |
|---|---|---|
| `ACTA_DECISIONES_FASE_0_NUVIA_20260901.md` | 2026-09-07 | NUVIA · Acta de decisiones de la Fase 0 |
| `AUDITORIA_CAMBIOS_20260901.md` | 2026-09-07 | Auditoría de cambios · 01-09-2026 |
| `ESTRUCTURA_MINIMA_ALFA_NUVIA_20260902.md` | 2026-09-07 | NUVIA · Estructura mínima y gratuita para la alfa (≤ 100 personas invitadas) |
| `INFORME_ESTRATEGICO_VISION_NUVIA_2026-09-01.md` | 2026-09-07 | Informe estratégico sobre la visión, la arquitectura y la presentación de NUVIA |
| `INFORME_FINAL_NUVIA_20260901.md` | 2026-09-07 | NUVIA |
| `INFORME_PARA_CLAUDE_FABLE_5_1_FASE_0_20260901.md` | 2026-09-07 | Informe de traspaso para Claude Fable 5.1 |
| `PLAN_APLICACION_FINAL_NUVIA_20260901.md` | 2026-09-07 | NUVIA |
| `PLAN_APLICACION_RECOMENDACIONES_NUVIA_2026-09-01.md` | 2026-09-07 | Plan detallado para aplicar las recomendaciones de visión y arquitectura de NUVIA |
| `PLAN_OPERATIVO_SOBRE_WEB_DESARROLLADA_20260902.md` | 2026-09-07 | NUVIA · Plan operativo sobre la web desarrollada |
| `VERIFICACION_ENTREGA_1_CLAUDE_FABLE_5_1_20260901.md` | 2026-09-07 | NUVIA · Verificación independiente de la Entrega 1 |

**Mi cartera y empresas · base propia, datos y cierre de la alfa** (60)

| Documento | Último cambio | Título |
|---|---|---|
| `ANALISIS_BASE_DATOS_PROPIA_NUVIA_20260902.md` | 2026-09-07 | NUVIA · Análisis: base de datos propia y migración desde la base maestra |
| `APLICACION_ACLARACIONES_FUNDAMENTALES_20260903.md` | 2026-09-07 | Fundamentales · aclaraciones y propuesta de metadatos |
| `AUDITORIA_FUENTE_BDB_20260910.md` | 2026-09-10 | Recuperación de datos BDB para NUVIA |
| `AUDITORIA_LABORATORIO_CARTERA.md` | 2026-09-07 | Auditoría medida · Laboratorio de Cartera (`cartera.html` · `#laboratorio`) |
| `AUDITORIA_METADATOS_FUNDAMENTALES_20260903.md` | 2026-09-07 | Fundamentales · monedas, escalas y comparabilidad |
| `CARGA_ETF_MODELOS_AUTORIZADA_20260903.md` | 2026-09-07 | Alta incremental autorizada · IWDA y VUSA |
| `CARGA_FECHAS_DIVIDENDOS_20260903.md` | 2026-09-07 | Carga autorizada · fechas de dividendos |
| `CARGA_FUNDAMENTALES_AUTORIZADA_20260903.md` | 2026-09-07 | Carga de fundamentales autorizada · 03-09-2026 |
| `CARGA_LIGERA_FUNDAMENTALES_20260903.md` | 2026-09-07 | Fundamentales · buscador ligero y respaldo por empresa |
| `CARGA_OHLCV_ALFA_20260904.md` | 2026-09-07 | Carga inicial OHLCV · resultado verificado |
| `CIERRE_ENTREGA_3B_ESTABILIZACION_20260902.md` | 2026-09-07 | Cierre de la Entrega 3B · Línea base estabilizada |
| `CIERRE_LOCAL_ALFA_20260903.md` | 2026-09-07 | NUVIA · Consolidación local y pendientes de cierre |
| `CIERRE_P5_PUBLICACION_20260903.md` | 2026-09-07 | NUVIA · Acta de cierre P5 · integración y publicación |
| `CIERRE_PENDIENTES_CONSOLIDADO_20260903.md` | 2026-09-07 | NUVIA · Cierre de pendientes consolidado |
| `COBERTURA_CINCO_ANIOS_PRECIOS_20260903.md` | 2026-09-07 | Cinco años de precios · comprobación y contraste con EODHD |
| `COHERENCIA_METODOS_CARTERA_20260903.md` | 2026-09-07 | Coherencia del resumen y la frontera · P6 |
| `COMPROBACION_BASE_FUNDAMENTALES_20260903.md` | 2026-09-07 | Comprobación directa de fundamentales en la base de NUVIA |
| `CONEXION_FUNDAMENTALES_BASE_PROPIA_20260903.md` | 2026-09-07 | Conexión del módulo a los fundamentales de la base propia |
| `CONSULTA_EODHD_LOGISTA_PERNOD_20260903.md` | 2026-09-07 | Consulta técnica a EODHD · Logista y Pernod Ricard |
| `CONTRASTE_EMISORES_METADATOS_20260903.md` | 2026-09-07 | Fundamentales · contraste de las tres filas recientes sin moneda |
| `CONTRASTE_FUNDAMENTALES_ALFA_20260903.md` | 2026-09-07 | Análisis fundamental: contraste con la alfa y siguiente entrega |
| `CONTRATO_FUNDAMENTALES_PROPUESTO_20260903.md` | 2026-09-07 | Fundamentales de empresas: contrato propuesto para revisión |
| `CORRECCION_COBERTURA_MAPA_20260910.md` | 2026-09-10 | Cobertura del mapa por supuestos |
| `EJECUCION_CIERRE_ALFA_20260903.md` | 2026-09-07 | Ejecución del cierre de la alfa · 03-09-2026 |
| `EJECUCION_IDENTIDADES_AENA_FERROVIAL_20260903.md` | 2026-09-07 | Aena y Ferrovial · corrección autorizada y carga completada |
| `ESTADO_ENTREGA_2B_20260902.md` | 2026-09-07 | NUVIA · Estado de la Entrega 2b (base propia de la alfa) · 2 de septiembre de 2026, tarde |
| `FASE_0_PROTECCION_ALFA_20260902.md` | 2026-09-07 | NUVIA · Fase 0: protección y preparación de la alfa |
| `FASE_1_FIABILIDAD_DATOS_ALFA_20260902.md` | 2026-09-07 | NUVIA · Fase 1: fiabilidad de los datos de la alfa |
| `FASE_2_DISPONIBILIDAD_MODELOS_20260902.md` | 2026-09-07 | NUVIA · Fase 2: disponibilidad de las carteras modelo |
| `FICHA_REGULATORIA_ESTOCASTICO_20260910.md` | 2026-09-10 | Oscilador estocástico en el análisis técnico |
| `FICHA_REGULATORIA_TERCEROS_EMPRESAS_ENTREGA_2_20260902.md` | 2026-09-07 | NUVIA · Ficha regulatoria de terceros del módulo de empresas |
| `FICHA_RESUMEN_CARTERA_20260909.md` | 2026-09-09 | Resumen descriptivo de cartera · 09-09-2026 |
| `INCIDENCIAS_FUNDAMENTALES_PARA_RESPONSABLE_BASE_20260903.md` | 2026-09-07 | Fundamentales NUVIA: revisión para el responsable de la base |
| `INFORME_CIERRE_PROCESO_ALFA_PENDIENTES_20260903.md` | 2026-09-07 | NUVIA · Informe completo de actuaciones pendientes para cerrar el proceso |
| `INFORME_PARA_CODEX_BASE_DATOS_ALFA_20260902.md` | 2026-09-07 | NUVIA · Informe de traspaso a Codex: la base de datos propia de la alfa |
| `INTEGRACION_FECHAS_DIVIDENDOS_20260903.md` | 2026-09-07 | Integración visual de fechas de dividendos |
| `INTEGRACION_TECNICO_OHLCV_ALFA_20260904.md` | 2026-09-07 | Técnico: velas, volumen y ATR integrados en la copia local |
| `INVENTARIO_ENTREGA_2_DATOS_METADATOS_PROVEEDORES_20260901.md` | 2026-09-07 | NUVIA · Inventario inicial de la Entrega 2 |
| `LECTOR_MUESTRA_FUNDAMENTALES_20260903.md` | 2026-09-07 | Lectura y presentación local de la muestra de fundamentales |
| `MAPA_HISTORICO_CARTERA_20260910.md` | 2026-09-10 | Mapa histórico de cartera · 10-09-2026 |
| `MUESTRA_NORMALIZADA_FUNDAMENTALES_20260903.md` | 2026-09-07 | Muestra local de fundamentales y preparación de incidencias |
| `PARIDAD_COMPLEMENTARIA_FUNDAMENTALES_20260903.md` | 2026-09-07 | Fundamentales · paridad complementaria de dividendos y accionariado |
| `PASO_1_DISCREPANCIAS_CONTABLES_20260903.md` | 2026-09-07 | Paso 1 · Logista y Pernod Ricard |
| `PASO_2_COBERTURA_INSTITUCIONAL_20260903.md` | 2026-09-07 | Paso 2 · Cobertura institucional |
| `PASO_3_IDENTIDAD_EDITORIAL_PENDIENTE_20260903.md` | 2026-09-07 | Paso 3 · Identidad pública y responsabilidad editorial |
| `PENDIENTE_ALFA_NUVIA_20260902.md` | 2026-09-07 | NUVIA · Lo que queda pendiente para la alfa (base propia, en abierto) |
| `PLAN_ALFA_BASE_PROPIA_NUVIA_20260902.md` | 2026-09-07 | NUVIA · Plan de ejecución: base propia de la alfa, desde cero (Entrega 2b) |
| `PLAN_ANALISIS_CARTERA.md` | 2026-09-07 | Plan de acción · Sección de análisis de cartera |
| `PLAN_IDENTIDADES_AENA_FERROVIAL_20260903.md` | 2026-09-07 | Aena y Ferrovial · diagnóstico y corrección propuesta |
| `PLAN_REDISENNO_LABORATORIO_CARTERA.md` | 2026-09-07 | Plan de rediseño · Laboratorio de Cartera |
| `PREPARACION_OHLCV_ALFA_20260904.md` | 2026-09-07 | Preparación de velas, volumen y ATR · alfa |
| `PROPUESTA_ALTA_ETF_MODELOS_20260903.md` | 2026-09-07 | Propuesta exacta · dos ETF pendientes de las carteras modelo |
| `REACTIVACION_FUNDAMENTALES_ALFA_20260903.md` | 2026-09-07 | Recuperación del módulo de fundamentales en la alfa |
| `RECUPERACION_FUNDAMENTAL_LOCAL_20260903.md` | 2026-09-07 | Recuperación local del análisis fundamental |
| `RECUPERACION_TECNICO_ALFA_20260903.md` | 2026-09-07 | Recuperación del análisis técnico en la alfa |
| `REDISENO_TECNICO_20260904.md` | 2026-09-07 | Ajuste visual del módulo de empresas · 04-09-2026 |
| `RENOVACION_MODELOS_AUTORIZADA_20260909.md` | 2026-09-09 | Renovación de las cuatro carteras modelo · 09-09-2026 |
| `REVISION_ENTREGA_LOCAL_20260903.md` | 2026-09-07 | NUVIA · Revisión de procedencia y entrega local |
| `VERIFICACION_BASE_LISTA_20260902.md` | 2026-09-07 | Verificación de la base lista · NUVIA |
| `VERIFICACION_ENTREGA_2B_CLAUDE_FABLE_5_1_20260902.md` | 2026-09-07 | NUVIA · Verificación independiente de la Entrega 2b (base propia de la alfa) · 2 de septie |
