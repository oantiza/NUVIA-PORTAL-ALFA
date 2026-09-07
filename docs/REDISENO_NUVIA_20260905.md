# Rediseño NUVIA · implantación local · 5 de septiembre de 2026

## Encargo y alcance

El fundador respondió «GO» tras la auditoría y el plan de rediseño. Se registra esa respuesta como autorización para implantar localmente la propuesta de diseño. No se interpreta como orden de publicación, apertura de cuentas, modificación de API o almacenamiento de datos personales.

Referencias: [auditoría y plan](AUDITORIA_DISENO_Y_PLAN_NUVIA_20260905.md), [definición canónica](DEFINICION_NUVIA.md) y [marco obligatorio, v1.2](MARCO_REGULATORIO_OBLIGATORIO.md). El trabajo conserva la identidad de Inicio y aplica la revisión únicamente a escritorio y tablet.

## Resultado de diseño

| Ámbito | Cambio implantado | Propósito |
|---|---|---|
| Inicio | «Explorar NUVIA» y «Empezar a aprender» en el hero; mapa de cinco espacios antes del relato; accesos directos adelantados y numeración ordenada | Localizar el contenido sin recorrer todas las láminas |
| Navegación | Acceso directo a Empresas en Economía; ruta contextual con «Inicio»; cabecera de tablet con cinco espacios en una fila propia y presentación institucional arriba | Mantener todos los destinos visibles y comprensibles |
| Cabeceras interiores | Menos altura y espacio vacío en aperturas compartidas, Patrimonio, guías y Vivienda | Llegar antes al contenido útil |
| Tipografía | Inter para fases, controles y títulos funcionales; Fraunces en lectura y manifiesto; tamaños interiores compactos | Distinguir tarea y lectura conservando el carácter de la marca |
| Superficies | Las tarjetas dejan de alternar colores por su posición; conservan el acento del espacio | El color tiene un uso estable |
| Cartera | Título, introducción y ruta cambian con la vista; presentación del laboratorio trasladada al bloque de explicación; «Solapamientos» sustituye a «Apuestas repetidas» | Comprender dónde se está y acceder antes al constructor |
| Empresas | Cabecera interna compacta cuando está integrada; buscador con desplegable de hasta ocho coincidencias por nombre, ticker, ISIN o identificador; acceso explícito a fundamentales, análisis técnico e informe tras elegir una empresa | Evitar dos grandes aperturas, la lista permanente de 73 empresas y espacio vacío innecesario |
| Vivienda | Entrada «Ir al simulador»; guardar y recuperar junto al escenario; explicación disponible al final y enlazada desde la entrada | Priorizar calcular, manteniendo las ayudas y el guardado local |
| Guías | Índices con separación, superficie de pulsación y distribución; anchura de párrafos controlada; panel de contexto en tres columnas en tablet | Facilitar lectura, localización y vuelta a secciones |
| Academia | Tarjetas de entrada más compactas y títulos en la escala común | Reducir espacio decorativo antes de empezar |
| Lecturas | Cubierta y texto siguen en paralelo en tablet | Reducir la altura de las fichas conservando la excepción editorial |
| Qué es NUVIA | Índice de contenido, título y márgenes más contenidos | Dar acceso directo al propósito, espacios y valores sin reescribir la definición |
| Cotizaciones | Aviso de datos ilustrativos al principio del panel completo | Identificar la naturaleza de las cifras antes de leerlas |

Los anclajes utilizan ahora la altura real de la cabecera fija. Las rutas, calculadoras, pestañas, contenidos y fuentes existentes se conservan. Las indicaciones previas de disponibilidad siguen presentes. No se ha creado una versión móvil.

## Medidas observadas

Comparación con las mediciones de producción tomadas durante la auditoría, con el mismo ancho de ventana. Son observaciones de estas pantallas y estados, no una medida de satisfacción de usuarios.

| Medida | Antes | Después |
|---|---:|---:|
| Cabecera, tablet de 768 px | 149 px | 109 px |
| Texto principal del menú de tablet | 12 px | 14 px |
| Título de Vivienda, escritorio de 1440 px | 57,6 px | 44 px |
| Título del manifiesto, escritorio de 1440 px | 132,5 px | 86,4 px |
| Altura del manifiesto, escritorio de 1440 px | 8177 px | 7149 px |

En Vivienda el primer campo aparece aproximadamente a 798 px desde el inicio del documento a 1440 px. Cartera mantiene varias explicaciones necesarias antes del buscador; el primer campo requiere un desplazamiento corto. No se afirma que todas las herramientas quepan completas en la primera pantalla.

## Comprobaciones y evidencias

- `npm run build` completado: validadores, pruebas funcionales, generación de `dist/` y revisión de 30 páginas y estados a 1440 px, sin incidencias. La copia de Empresas supera su revisión a 1440, 1280, 1024, 820 y 768 px, incluidos gráficos, pestañas, datos de respaldo, reintento y aislamiento.
- Matriz de Inicio, Patrimonio, guía fiscal de EPSV, Vivienda, Cartera, Academia, Lecturas y Qué es NUVIA: 1440, 1280, 1180, 1024, 900, 820 y 768 px. 56 combinaciones sin incidencias en los controles automatizados de contraste, tipografía, estructura, desborde e interacción.
- Revisión visual manual en navegador de Inicio y su mapa, Patrimonio, guía fiscal, Vivienda, Cartera, Lecturas y Empresas integrada. Búsqueda y apertura de la ficha descriptiva de Iberdrola; datos consultados de solo lectura, sin introducir datos personales.
- Las pruebas de integración comprueban ahora también la correspondencia entre título, ruta e introducción al cambiar de vista, manteniendo los alias, el historial y la carga diferida del módulo.
- Los contratos de navegación y disposición se actualizan para reflejar el diseño implantado, conservando las comprobaciones de destinos y geometría.
- Salto de Vivienda a 768 px verificado: destino a 125,7 px y cabecera de 109,3 px; el contenido queda visible por debajo de la cabecera.
- El validador estático excluye dos carpetas de herramientas temporales que no forman parte del sitio publicado y provocaban errores de permisos. No se ha omitido ninguna página publicada.
- Evidencias locales en `output/auditoria-diseno-20260905/`: capturas `*-redisenado-1440.png`, `mediciones-redisenadas.json`, `matriz-redisenada.txt`, `verificacion-final-ajustes.txt` y `compilacion-final.txt`.

Los controles automáticos no sustituyen una prueba con personas. La prueba de comprensión con cinco participantes propuesta en la auditoría sigue pendiente; no se ha simulado ni presentado como realizada.

## Revisión material según §12 del marco

1. Necesidad: comprensión y navegación del contenido existente.
2. Datos: documentos canónicos, código, interfaces públicas y una ficha de empresa de solo lectura.
3. Transformación: presentación, jerarquía, nombres y recorridos. Sin cambios en fórmulas financieras.
4. Resultado: información y herramientas con presentación más clara; sin recomendación inversora nueva.
5. Emisores: una ficha como muestra de interfaz, sin promoción ni valoración de atractivo.
6. Circunstancias personales: no utilizadas ni almacenadas.
7. Operaciones: ninguna compra, venta o instrucción de ejecución añadida.
8. Precios futuros: no se crean previsiones ni objetivos de precio.
9. Idoneidad: no se añaden puntuaciones o clasificaciones de idoneidad.
10. Terceros: no se incorporan recomendaciones de terceros.
11. Diseño: funciones existentes conservadas; sin bloqueos unilaterales.
12. Llamadas a la acción: explorar, aprender, consultar y acceder a cálculos existentes.
13. Remuneración: sin cambios.
14. Separación profesional: sin marcas ni vínculos bancarios nuevos.
15. Datos personales: sin escrituras en base de datos; guardado local existente conservado.
16. IA: no se añade al producto.
17. Fuentes y límites: se conservan y se refuerza la identificación del panel ilustrativo.
18. Regresiones: compilación, contratos, pruebas funcionales y comprobaciones visuales descritas arriba.

La validación jurídica externa no se usa como bloqueo en la alfa. Los puntos editoriales del informe que requieren una decisión específica —«Margen amplio», «Ejecutar», «Plan completado» y ciertas formulaciones del curso— no se han resuelto por iniciativa del ejecutor. Tampoco se han retirado sus funciones. Esta implantación no certifica el contenido financiero, fiscal o sanitario preexistente.

## Estado de entrega

Implantación local del sistema y recorridos principales, preparada para revisión del fundador. La publicación en GitHub Pages se mantiene separada. El plan de la auditoría sigue siendo la referencia para pruebas con personas y decisiones editoriales pendientes.
