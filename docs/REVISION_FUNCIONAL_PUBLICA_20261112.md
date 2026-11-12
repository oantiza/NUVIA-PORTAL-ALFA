# Revisión funcional de la web publicada · 12-11-2026

## Orden y alcance

«Perfecto. Ahora revisa que todos los enlaces, calculadoras y herramientas de las cuatro webs y los espacios comunes funcionen correctamente en escritorio y tablet, sin cambiar el diseño.»

Se audita la [web publicada en GitHub Pages](https://oantiza.github.io/NUVIA-PORTAL-ALFA/), versión `07e8ad408045bc00d5e7f0cd6fb288e34c90d52a`. Las comprobaciones funcionales se realizan con Chromium a 1440 × 900, 1024 × 900 y 768 × 1024 px, utilizando contextos aislados y cifras ficticias. La navegación se comprueba contra producción, no contra una copia con respuestas simuladas.

**Resultado: la revisión encuentra incidencias; no se puede declarar que todo funcione correctamente.** Se confirman tres fallos funcionales propios, cinco vídeos de YouTube no disponibles y cuatro destinos externos con error 404. Las calculadoras y demás recorridos que se detallan más abajo superan los escenarios comprobados.

No se modifica el diseño ni ninguna fuente del producto. No se realiza commit, push, despliegue ni escritura en Firebase. Las correcciones descritas son propuestas, no cambios aplicados.

## Incidencias propias de NUVIA

### F-01 · El curso conserva el vídeo del capítulo anterior

Ruta: [Dinero con criterio](https://oantiza.github.io/NUVIA-PORTAL-ALFA/curso.html?capitulo=1). Reproducido a 1440 y 768 px.

1. Abrir el capítulo 1 y pulsar Reproducir.
2. Elegir el capítulo 2 en el programa.
3. La dirección, el título y los apuntes cambian, pero el iframe sigue apuntando al vídeo del capítulo 1. No aparece un nuevo botón de reproducción.

La recarga recupera el reproductor correspondiente al capítulo seleccionado, aunque no resuelve su indisponibilidad externa, descrita después.

Causa localizada: `curso.html:188` reutiliza el contenedor externo al cambiar de capítulo; el cargador de `nuvia-site-unified.js:190` sustituye su contenido por un iframe y conserva el estado cargado. El nuevo `data-src` no recrea ese iframe.

Corrección mínima propuesta: recrear el contenedor al cambiar `videoSrc`, conservando su portada y la activación voluntaria. Verificar reproducción, cambio de capítulo, nueva activación y navegación Atrás. No requiere cambiar el diseño.

Evidencia: `academia-comunes/reproduccion.json`, `academia-comunes/RESUMEN.md` y [captura en tablet](../output/auditoria-funcional-publica-20261112/academia-comunes/capitulo2-video1-768.png).

### F-02 · La serie de cierres anteriores de Empresas falla de forma intermitente

Ruta: [Análisis y valoración de empresas](https://oantiza.github.io/NUVIA-PORTAL-ALFA/cartera.html?vista=companies) → Iberdrola → Técnico → «Cierres anteriores · serie independiente».

Se muestra: «Los precios han cambiado durante la consulta. Reintenta para obtener una única versión.» Aparece en los tres tamaños. En una ronda adicional de seis consultas se reproduce cinco veces y una carga correctamente. La serie OHLCV sí funciona en los recorridos comprobados.

La evidencia incluye catorce respuestas del documento de Iberdrola: su fecha de actualización y valores coinciden, pero el orden de las claves de `history` varía. La comparación de versiones en `company-analysis/src/alfa/prices.js:13` y `:38` utiliza `JSON.stringify` sin ordenar esas claves y puede interpretar una diferencia de orden como un cambio de datos.

Corrección mínima propuesta: comparar una representación canónica de los datos, manteniendo el control de versiones; añadir una regresión con los mismos valores y distinto orden de claves. No exige modificar datos del servidor, relajar el control ni cambiar la interfaz.

Evidencia: `economia-cartera/repro-externos-legacy.json` y `economia-cartera/legacy-reintentos-768.png`.

### F-03 · El panel de TradingView queda vacío al cargarlo

Ruta: [Mercados](https://oantiza.github.io/NUVIA-PORTAL-ALFA/mercados.html) → «Ver el gráfico externo (TradingView)» → «Cargar panel de índices». Reproducido a 1440 y 768 px.

El marcador desaparece y deja un panel vacío; también se pierde el enlace alternativo «Abrir TradingView». La espera adicional no recupera el panel.

Causa localizada en NUVIA: el `<template>` que contiene la definición del widget llega vacío al DOM renderizado. El recorrido de nodos de `support.js` utiliza `childNodes`, sin conservar `template.content`. Después, el cargador de `nuvia-site-unified.js:218` clona el fragmento vacío, sustituye el marcador y marca la carga como realizada. La evidencia no atribuye este fallo al proveedor externo.

Corrección mínima propuesta: preservar la definición del widget al renderizar o construirla explícitamente al activarlo, manteniendo la carga voluntaria y el acceso alternativo. Evitar una modificación amplia del runtime si basta corregir esta integración.

Evidencia: `economia-cartera/diagnostico-widget.json`, `tradingview.json` y [captura en tablet](../output/auditoria-funcional-publica-20261112/economia-cartera/tradingview-final-768.png).

## Contenido audiovisual no disponible

El reproductor se abre, pero YouTube muestra «El vídeo no está disponible». La comprobación se hace sobre el estado visible, no se deduce de una respuesta HTTP 200.

| Ubicación | Identificador enlazado | Tamaños comprobados |
|---|---|---|
| [Lección del PIB](https://oantiza.github.io/NUVIA-PORTAL-ALFA/academia.html?tab=pib) | `ZwhTy0oqx9c` | 1440, 1024 y 768 |
| [Capítulo 2](https://oantiza.github.io/NUVIA-PORTAL-ALFA/curso.html?capitulo=2) | `cwHHU5okGqY` | 1440 y 768 |
| [Capítulo 3](https://oantiza.github.io/NUVIA-PORTAL-ALFA/curso.html?capitulo=3) | `K-AbB3tDmd0` | 1440 y 768 |
| [Capítulo 4](https://oantiza.github.io/NUVIA-PORTAL-ALFA/curso.html?capitulo=4) | `uOrdz0Gi96A` | 1440 y 768 |
| [Capítulo 5](https://oantiza.github.io/NUVIA-PORTAL-ALFA/curso.html?capitulo=5) | `OoZXhp9sJ_0` | 1440 y 768 |

No se ha determinado si son vídeos privados, retirados o sustituidos. La actuación propuesta es confirmar la disponibilidad pública/no listada y el identificador vigente de cada pieza. No se sustituyen, ocultan ni retiran vídeos durante esta revisión.

Los otros ocho vídeos comprobados cargan contenido, título y duración: tres de Activos, Fundamentos, Interés compuesto, los dos artículos de Bienestar y el capítulo 1. En este último se observa avance temporal de reproducción. No se afirma haber visionado íntegramente todas las piezas.

Evidencia: `academia-comunes/videos-curso.json`, `diagnostico.json` y capturas de cada error; [ejemplo PIB en tablet](../output/auditoria-funcional-publica-20261112/academia-comunes/pib-no-disponible-768.png).

## Enlaces externos

Cuatro destinos devuelven 404 tanto en la petición de lectura como en la comprobación posterior con navegador:

| Origen en NUVIA | Destino que falla |
|---|---|
| Impuestos, «Portal tributario de Bizkaia» | `https://www.bizkaia.eus/es/hacienda-y-finanzas` |
| Informes diario/semanal, referencia [1] | `https://www.bolsasymercados.es/es/bme-exchange/%C3%ADndices/ibex/historico/ibex-35-es0si0000005.html` |
| Informes diario/semanal, referencia [3] | `https://www.bundesbank.de/de/service/banken-und-unternehmen/bund-bietungs-system-bbs-/aktuelle-auktionen/bundesanleihen-zuteilung-1007314` |
| Jubilación/guías, territorio común, «AEAT · Manual práctico Renta 2025» | `https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025.html` |

Se propone localizar los destinos oficiales vigentes de Bizkaia y del manual de la AEAT, y las fuentes históricas exactas de los informes. No se deben sustituir referencias documentales por portadas genéricas que no acrediten la misma información.

Otros cuatro destinos no han podido verificarse por respuestas 403: una referencia de Morningstar y tres noticias de El País/Cinco Días. Las noticias muestran protección contra automatización. Se registran como **no verificables desde este entorno**, sin calificarlas como enlaces rotos ni intentar superar esa protección.

Evidencia: `enlaces-http.json`, `externos-reproducidos.json`, `enlaces-adicionales-noticias.json`, `enlaces-adicionales-patrimonio.json` y `externos-reproducidos-patrimonio.json`; [captura de Bizkaia](../output/auditoria-funcional-publica-20261112/externo-1.png).

## Cobertura y resultados correctos

### Navegación y documentos

- Inventario base: 28 páginas públicas y sus rutas derivadas/compatibles, **59 rutas y 118 vistas** a 1440 y 768 px. Todas cargan con HTTP 200, sin errores JavaScript ni desbordamiento horizontal observado.
- Se inventarían **4.376 apariciones de enlaces y 307 href distintos**. Son apariciones, no 4.376 clics independientes.
- **360 comprobaciones de destino de ancla**: 328 presentes al cargar y 32 correspondientes a las fases 02–05 de Cartera, que se crean tras calcular. La prueba funcional posterior confirma que esas cuatro fases se habilitan y son alcanzables en los tres tamaños.
- Los enlaces vacíos detectados inicialmente pertenecen a modales ocultos de Lecturas y Noticias. Al abrir las fichas, reciben su URL real; no son incidencias del producto.
- Los cinco PDF del curso responden correctamente y su contenido comienza por la firma `%PDF`. Los informes de mercados se descargan como documentos HTML reales.
- Comprobación HTTP inicial y enlaces de modales: **97 destinos únicos**, 90 respuestas correctas, tres 404 y cuatro 403. Incluye 16 recursos propios y 81 destinos externos.
- Ampliación territorial: **65 estados de Patrimonio** recorridos al cambiar territorio/comunidad; aparecen 355 href adicionales, que se reducen a 108 destinos HTTP sin fragmento: 57 propios y 51 externos. De ellos, 107 responden correctamente y uno devuelve 404 (AEAT).
- Los 304 href internos territoriales comprenden 247 con fragmento y 57 sin él. Una comprobación adicional de sus 57 rutas a 1440 y 768 px completa **114 vistas y 494 verificaciones de anclas, todas correctas**, sin errores JavaScript. Evidencia: `patrimonio/anclas-territorios.json`.
- **Total HTTP combinado: 205 destinos únicos, 197 respuestas correctas, cuatro 404 y cuatro 403.** No se contabiliza cada ancla como una petición HTTP independiente.

### Patrimonio

**60 de 60 escenarios funcionales correctos**, veinte por tamaño. Se comprueban las cinco herramientas de Vivienda, guardado y recuperación local, Jubilación con sus cuatro pasos y cinco territorios, quince comunidades y escala de referencia, modalidades de previsión, escenarios de estrés e informes. También Impuestos, las nueve pestañas de Ahorro, compensación de pérdidas, Sucesiones, calendario, filtros, listas de comprobación y guías.

Contrastes independientes: hipoteca al 0 % y al 3 %, amortización anticipada, compensación de pérdidas y ejemplo fiscal de 5.000 € de ganancia → 950 €. Detalle: `patrimonio/consolidated-results.json` y `patrimonio/README.md`.

### Academia, Familia y espacios comunes

Las nueve vistas de Academia, los dieciocho términos del glosario, sus pestañas y enlaces directos funcionan en los tres tamaños. La calculadora de interés compuesto coincide con cuatro ejemplos independientes: 10.000 al 10 % durante un año → 11.000; 1.000 + 100/mes durante dos años al 0 % → 3.400; 1.000 + 100/año al inicio durante dos años al 10 % → 1.441; y 1.000 con −10 % anual → 900. Se comprueban además ajuste fiscal, inflación y recuperación de campos inválidos.

El curso mantiene rutas, historial, materiales, ejercicio práctico, cuestionario, avance temporal y reinicio. La incidencia del reproductor se registra por separado. Lecturas supera filtros, colecciones, cuatro fichas, cierre por Escape/botón y devolución del foco. Bienestar, sus cuatro subsecciones, los dos artículos y Colaboradores funcionan en los recorridos descritos.

Detalle: `academia-comunes/RESUMEN.md`, `cierre.json`, `completar.json` y `reproduccion.json`.

### Economía, Cartera y Empresas

Se comprueban las once fichas de noticias, informes diario/semanal y descargas, búsqueda y filtros de cotizaciones/calendarios, búsqueda de instrumentos, construcción con acción y ETF, prevención de duplicados, pesos, importes, cinco referencias de comparación y guardado/carga/borrado de una cartera ficticia en el navegador aislado.

Los ejemplos incluyen pesos 25/75 sobre 10.000 → 2.500/7.500, cuatro modelos, navegación y datos de empresas, cambio de Iberdrola a Aena e impresión. La incidencia de la serie de cierres anteriores se registra separadamente; no invalida los recorridos correctos ni se oculta con una valoración global positiva.

El consolidado del módulo contiene **65 casos: 60 correctos y cinco manifestaciones de los dos fallos propios** de Empresas y TradingView descritos arriba. Detalle: `economia-cartera/RESULTADO.md`, `consolidado.json`, `complemento.json` y `repro-externos-legacy.json`.

## Validación, evidencia y límites

`npm run validate` termina con código 0: contratos estáticos, pruebas financieras y la auditoría visual incluida de **51 páginas/vistas a 1440 px**. Registro: `output/auditoria-funcional-publica-20261112/validate.log`. Su resultado no elimina las incidencias de producción detectadas mediante recorridos adicionales.

Las evidencias se guardan en `output/auditoria-funcional-publica-20261112/`, ignorado por Git. Los registros iniciales se conservan: se explican los fallos de selectores o expectativas del arnés y se repiten únicamente los casos afectados. No se modifica ni relaja ninguna prueba del repositorio.

La comprobación cubre los recorridos documentados, no todas las combinaciones numéricas posibles, los 700 instrumentos uno por uno ni todos los dispositivos físicos/navegadores. HTTP 200 acredita disponibilidad, no exactitud editorial ni acceso a contenido de suscripción. Las pruebas de impresión comprueban la generación y activación, no una impresora física. No se realiza una nueva auditoría de vigencia normativa de las tablas fiscales.

La consulta de documentos de Firestore utiliza `batchGet` —una operación de lectura aunque emplee HTTP POST—. No hay escrituras en la base. Las cifras y perfiles ficticios de prueba se limitan al almacenamiento de contextos de navegador desechables.

## Prueba del §12 y estado de entrega

Necesidad: verificar disponibilidad y funcionamiento por orden expresa. Entradas: páginas públicas y casos sintéticos elegidos para contrastar cálculos. Operación: lectura, navegación y ejecución de funciones existentes. Salida: evidencia de aciertos, incidencias reproducibles y propuestas de corrección. No se introducen recomendaciones, juicios de idoneidad, señales, llamadas a operar, funciones, IA, datos personales ni nuevas integraciones. No se alteran avisos o separación profesional.

Esta acta y su referencia en el índice son los únicos cambios nuevos fuera del directorio de evidencias. La web publicada, el diseño y las funcionalidades permanecen en su estado auditado. Las incidencias quedan registradas para corrección; no se bloquea ni retira ningún contenido.
