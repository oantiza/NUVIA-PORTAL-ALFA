# Jubilación · auditoría de cálculo y rediseño del simulador · 23-09-2026

Encargo del fundador: comprobar la exactitud de los cálculos y rehacer el simulador para que sea fácil de usar y de entender, visualmente atractivo, con gráficos del resultado bruto y neto, con el impuesto que se aplica en cada caso y con un informe imprimible.

## 1. Auditoría del simulador anterior

**Parámetros fiscales: correctos.** Se contrastaron con la Hacienda Foral de Bizkaia (comparativa IRPF 2026 KA-01877, tributación EPSV 2025-2026 KA-01878, caso práctico CASO-PRACTICO-EPSV-26 y arts. 23, 74, 76 y 77 de la NF 13/2013):

- escala general del 23 % al 49 % y escala del ahorro del 19 % al 28 % (tramos de 2026);
- minoración de 1.615 € solo sobre la cuota general;
- bonificación del trabajo (8.000 € / 0,6098 / 3.000 €, y 3.000 € si otras rentas superan 7.500 €);
- deducción por edad (393 € y 714 €, con reducción entre 20.000 € y 30.000 €);
- EPSV: 70 % / 60 % transitorio, límite de 300.000 €, estimación del 1 % por año (máximo 35 %) o 25 %, y exención de la rentabilidad en las rentas vitalicias y en las temporales de 15 años o más.

**Errores y defectos encontrados (motor anterior):**

1. La «subida anual de la pensión» no intervenía en el cálculo: con 2,7 % y con 10 % salía lo mismo (2.593 €/mes).
2. Solo calculaba el primer año, así que no reflejaba cómo cambian los impuestos con el tiempo (plusvalía creciente, deducción por edad a partir de los 66 y de los 76).
3. El conservador y el optimista recalculaban las retiradas, de modo que los tres escenarios llegaban a 0 € justo en la edad final. El gráfico y las tarjetas no enseñaban riesgo alguno.
4. El escenario de estrés daba más renta neta (2.605 €) que el base (2.593 €). Era un efecto secundario del cálculo del impuesto con −12 %.
5. El cobro de la EPSV en capital no se sumaba a nada. Con el caso DFB aparecían 0 €/mes y el aviso «se agota en el año 1».
6. El botón «Cargar caso práctico DFB» ponía 0 € de rentabilidad anterior a 2026 en lugar de 27.000 €, y así el régimen 2026 salía mal calculado. El reparto transitorio usaba saldos y no la proporción de aportaciones (62/70) del caso oficial.
7. La renta temporal de 15 años se repartía en todo el horizonte (30 años), no en la duración del contrato.
8. Los intereses de la liquidez y de los depósitos no tributaban cada año.
9. «Restablecer» no limpiaba los campos (`defaultValue`), un fallo ya documentado el 22-09.
10. Todo se mostraba en euros nominales, sin opción de euros de hoy, y la subida de las retiradas era independiente de la pensión.

## 2. Nuevo motor (`js/nuvia-jubilacion-motor.js`)

- Proyección **año a año**. La pensión y las retiradas suben con el IPC y todo puede verse en euros de hoy o en euros de cada año.
- Fase previa a la jubilación opcional: edad de jubilación y ahorro anual.
- Dos formas de usar los ahorros: gastarlos hasta la edad elegida (retirada creciente que agota el capital) o **conservar el capital**, retirando solo la rentabilidad por encima del IPC.
- En cada año, cada ingreso va a su base. La pensión y las aportaciones de la EPSV van a la general. Las ganancias de fondos, acciones y seguros (a coste medio), los intereses del año y la rentabilidad de la EPSV no exenta van a la del ahorro. El capital propio retirado y la rentabilidad exenta no tributan.
- Escenarios con **las mismas retiradas del plan** y distinta rentabilidad (±1,5 puntos y mal comienzo −12 % / −5 %). Así se ve cuánto dura el dinero y qué parte de lo previsto se cubre.
- Cobro en capital según el caso práctico de la DFB, comparando régimen transitorio y régimen de 2026. El neto **se suma a los ahorros** del plan.
- Renta temporal limitada a la duración del contrato. La renta vitalicia se reparte hasta la edad del plan: es una aproximación y se indica como límite.
- Pruebas: `docs/nuvia-jubilacion-motor.test.mjs` (13 casos, incluido el caso práctico de la DFB), integradas en `npm run validate` mediante `test:jubilacion`.

Ejemplo inicial (65 años, 2.000 € × 14, 200.000 €, 3 %, IPC 2 %): 2.569 €/mes netos en el primer año. La diferencia con el anterior (2.593 €) viene de que ahora sí tributan cada año los intereses de la liquidez.

## 3. Interfaz (`js/nuvia-jubilacion-ui.js`, `estilos/nuvia-jubilacion.css`)

- Arriba, un bloque «Qué calcula» con el esquema pensión + ahorros + EPSV − IRPF = neto.
- Cuatro pasos guiados (Tú · Tus ahorros · Tu EPSV · Supuestos), con un resumen de cada paso en el propio selector. Los ahorros se eligen con tarjetas: solo se piden los datos de lo que se marca. Lo técnico de la EPSV queda plegado.
- Resultado en vivo en un panel lateral fijo: neto, bruto, IRPF, composición y duración. En tableta pasa a una barra fija inferior. Ya no hay botón «Calcular».
- Análisis completo:
  - identidad «pensión neta + retiradas netas = ingreso neto»;
  - cascada de bruto a neto;
  - mapa fiscal en tres columnas (base general, base del ahorro, no tributa), con tipos marginales;
  - barras año a año con detalle al pasar el ratón;
  - saldos por escenario con rótulos directos;
  - comparativa del cobro en capital;
  - «Cómo lo calculamos» con los parámetros de 2026;
  - tabla año a año como alternativa accesible a los gráficos.
- Paleta de series validada (dataviz): pensión #2c4f8f, ahorros #0797a8, EPSV #d09a2a, IRPF #c2413f. El rojo se reserva a impuestos y cifras negativas y el verde a cifras positivas. Fondo claro neutro con acento azul.
- Campos controlados, con aviso junto al campo fuera de rango. `jubilacion.html` sale del interceptor genérico de `js/nuvia-formularios.js`, que cortaba el evento `input` antes de React.
- Informe imprimible (`js/nuvia-jubilacion-informe.js`): A4 de dos páginas (tres si hay cobro en capital), con datos, resultado, mapa fiscal, gráficos, escenarios y método. Se imprime desde un iframe oculto, sin enviar datos.

## 4. Prueba regulatoria (§12 del marco)

1. Necesidad: entender la renta de jubilación, sus impuestos y su duración.
2. Datos: los introduce el usuario. El ejemplo es ficticio y está identificado.
3. Transformación: cálculo local con reglas públicas de la DFB.
4. Resultado: importes estimados, escenarios y tabla, todo con sus supuestos a la vista.
5. Instrumentos identificables: no; solo categorías de producto.
6. Circunstancias personales: sí, en simulación local, sin juicio de idoneidad.
7-10. No sugiere operar, no opina sobre valores, no puntúa ni ordena por atractivo y no reproduce recomendaciones de terceros. La comparativa de regímenes usa una métrica objetiva y visible (el impuesto estimado) y remite a la EPSV.
11. Los colores identifican series. El agotamiento se expresa con texto y no hay semáforos de conveniencia.
12-13. No hay contratación, contacto ni remuneración.
14. No hay vínculo con la actividad del agente ni con la entidad.
15. No hay persistencia ni envío de datos; el informe se genera en el navegador.
16. No interviene la IA.
17. Se muestran las fuentes (DFB 2026), las fórmulas, los parámetros y los límites.
18. Pruebas del motor y de la interfaz, y validadores de render, familia de gráficos y alineación actualizados.

Clasificación: **ámbar** por datos patrimoniales. Es una revisión interna; la validación jurídica externa queda fuera del alcance alfa. Sin despliegue.

## 5. Validadores actualizados

`scripts/check-render.mjs` (contenido y espera de resultados), `scripts/check-family-review.mjs` (gráfico de escenarios), `scripts/check-tables-results.mjs` (cifra principal `.jb-live__num`, 48 px), `scripts/audit-field-alignment.mjs` y `scripts/check-field-alignment.mjs` (recorrido por pasos), y `docs/nuvia-formularios.test.mjs` (campos controlados, reinicio y avisos).

Verificado en el entorno de trabajo: el render de 1440, 1180, 1024, 900, 820 y 768 px, y la alineación de campos a 1440, 1024 y 820 px, pasan sin fallos. Las pruebas del motor y de formularios también pasan.
