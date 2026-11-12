# Patrimonio · claridad y manejo · 12-11-2026

## Orden y alcance previo

El fundador ha indicado «Sigue» tras la auditoría integral, autorizando implementar las propuestas de claridad y homogeneidad. Esta actuación se limita a las páginas y a los componentes de presentación de Patrimonio: Vivienda, Jubilación, Impuestos, sus guías y la entrada de Planificación. No autoriza publicación, cambios de motores o reglas fiscales, Firebase, cuentas ni almacenamiento adicional.

Se aplicarán nombres precisos, unidades junto al resultado, accesos directos a herramientas e índices, explicación del guardado e impresión y estado real de contenidos en preparación. Los identificadores de rutas, territorios y campos se conservarán. La cabecera y el pie corresponden a Núcleo y no se editan desde estas páginas.

## Prueba previa del §12 del marco

1. **Qué recibe:** las mismas entradas y selecciones actuales; no se añaden datos personales ni nuevos campos de perfil.
2. **Qué calcula:** los motores y parámetros no cambian. La intervención se limita a describir entradas y resultados existentes.
3. **Qué muestra:** diferencia entre pensión por paga (14 pagas/año) y media mensual (importe anual/12), unidades visibles, destinos y estados reales.
4. **Qué concluye:** ninguna recomendación, idoneidad, contratación ni operación. Se explican capacidades y resultados descriptivos; el usuario decide.
5. **Qué acción habilita:** navegar a herramientas existentes, cargar/guardar en el mismo navegador e imprimir mediante los mecanismos actuales. Sin cuentas, derivación comercial ni backend.
6. **Fuentes, fechas y límites:** se conservan las fuentes, avisos, territorios, fechas y datos. Renombrar «Estatal» como «Territorio común» en el selector no cambia las competencias fiscales ni la selección de comunidad.
7. **Privacidad y persistencia:** no se cambian claves, formato, ubicación ni duración del almacenamiento. Las pruebas usarán datos ficticios y contextos de navegador aislados.
8. **Revisión:** cambio de presentación de herramientas existentes; no reclasifica su alcance regulatorio. La validación jurídica externa sigue fuera de alcance de la alfa. No se crean bloqueos nuevos ni se eliminan los controles actuales.

## Riesgos y criterios de implementación

- Los campos numéricos de Vivienda y Ahorro dependen de validación nativa y de un interceptor compartido. Se conserva su parser y dominio admitido; la separación de miles no justifica convertir `type=number` ni alterar eventos. Se mejorarán unidades y lectura de resultados, preservando el formato de entrada actual.
- Los botones y etiquetas más largos deben seguir siendo utilizables a 768–1440 px. Se verificará render, anclas y ausencia de recorte.
- Los accesos directos no retirarán explicaciones, avisos, contenidos, tablas o capacidades. Los índices seguirán disponibles y los destinos tendrán margen para la cabecera.
- La carga de un escenario existente debe seguir funcionando con su misma clave y formato. La interfaz explicará que guardar sustituye el único escenario de Vivienda.

## Validación prevista

Pruebas del módulo `npm run validate:patrimonio`, cálculo y guías de Jubilación, formularios y destinos; comparación de resultados antes/después en ejemplos de Vivienda/Jubilación; recorridos de anclas y controles en escritorio y tablet. La validación completa e integración corresponde a la coordinación de Núcleo. No se modifican pruebas transversales para acomodar el cambio.

## Resultado

### Cambios aplicados

- Vivienda: «Comparar hipotecas», ingresos anuales y cuotas mensuales explícitos, explicación del ejemplo inicial, «Guardar en este navegador» y «Cargar escenario guardado», alcance de sustitución y mensajes de error que no afirman un guardado inexistente.
- Jubilación: pensión bruta por paga, 14 pagas/año, resumen del paso en €/paga y media mensual anual/12 junto al resultado inmediato. Etiqueta de «Ejemplo editable», «Escenario editado» o caso DFB según la procedencia del escenario. Este indicador es estado de presentación, no se envía al motor ni se persiste.
- Selector compartido de Jubilación y sus guías: «Territorio común» y «Álava / Araba», manteniendo identificadores, CCAA, parámetros y competencias. «Comprender el rescate» sustituye al nombre de recorrido «Ejecutar».
- Accesos directos a las herramientas desde sus cabeceras; retorno al índice desde las secciones de las tres guías tributarias. No hay capas fijas que tapen contenido. Los nuevos accesos de navegación no se imprimen; el contenido imprimible se conserva.
- Cambio de territorio desde una guía tributaria con retorno explícito a la misma guía. El parámetro solo admite las tres rutas locales conocidas; no acepta direcciones arbitrarias. Usa la preferencia territorial existente, sin guardar datos nuevos.
- Impuestos declara que su entrada admite euros enteros, conforme a su parser actual. Ahorro identifica unidades, ejemplo y actualización inmediata; no se altera su validación ni el conjunto de valores admitidos.
- Impresión unificada como «Imprimir o guardar PDF»; «Lista de comprobación» y «Aspectos que revisar» sustituyen etiquetas menos claras, manteniendo controles y resultados.
- Calendario distingue revisar un evento de presentar o cumplir una obligación. Conserva todos los filtros y fechas, con «Todo el año» y «Este mes».
- Orden de navegación de Planificación alineado con Vivienda, Jubilación, Impuestos y Planificación. El estado «En preparación» de la portada se integra desde la fuente común de recursos por Núcleo.
- El rótulo del recorrido de las guías pasa a párrafo. Su selector compacto genera un H2 explícito; el selector del simulador sigue siendo H3 después de su introducción H2. Se conserva la escala tipográfica sin ampliar contratos.

### Corrección funcional encontrada durante la regresión

Al guardar una vivienda con precio ficticio de 420.000 €, editar a 500.000 € y cargar, el estado y el resultado recuperaban 420.000 €, pero el campo no controlado seguía mostrando 500.000 €. Se añade una revisión de presentación para remontar los formularios únicamente después de una carga correcta. Los mismos `defaultValue` reciben entonces el escenario recuperado. No cambia la clave `nuvia-vivienda-maqueta-v1`, el objeto `{s, ofertas}`, el parser ni las fórmulas. Un fallo de carga mantiene los datos en pantalla.

La regresión permanente `scripts/check-vivienda-scenario.mjs` comprueba en Chromium guardar → editar → cargar, valor visible, resultados, tabla, datos guardados y sustitución del escenario. Se invoca desde `checkFormControls` únicamente en Vivienda, por lo que forma parte de `auditar` y `build`. Usa contexto aislado, importes ficticios y conexiones limitadas al origen local; no toca la sesión del usuario ni APIs externas.

### Validación observada

- `npm run validate:patrimonio`: correcto, incluidos 36 tests de Jubilación/guías, 11 de formularios, destinos, entrada patrimonial, jerarquía, navegación, tablas y lenguaje.
- Comparación de resultados de los cinco modos de Vivienda y de Jubilación con importe decimal `2.345,67`: idénticos antes/después. Los hashes del motor de Vivienda, motor de Jubilación, parámetros fiscales y validador compartido son idénticos.
- Regresión de navegador adicional: vacío, denominador cero, carga, persistencia, ejemplo/editado, retorno a guía conservando Navarra, anclas y objetivos de interacción; correcta en las nueve rutas a 1440/1024/768, sin errores de página ni desbordes.
- La primera auditoría oficial de render detectó solo el tamaño heredado del selector territorial en las dos guías tras cambiar la jerarquía. Corregido en presentación y verificado de nuevo: las dos guías pasan a 1440/1024/768, con cero incidencias. Las otras siete rutas pasaron en los tres anchos; Vivienda pasó además con la nueva regresión permanente integrada. No se relajaron contratos.

Evidencia local: `output/claridad-patrimonio-20261112/`. El cierre global de validación y publicación, si se autoriza, corresponde a Núcleo. No se han hecho commits, despliegues ni escrituras en Firebase en esta actuación.
