# Jubilación · simulador y guías en cinco territorios (fase 1) · 04-10-2026

## 1. Orden del fundador

Ampliar el simulador de jubilación (`jubilacion.html`) y sus guías (`guia-planificacion.html`, `guia-fiscal.html`), que solo funcionaban con la normativa foral de Bizkaia, para que el usuario elija su residencia fiscal y todo se calcule y se explique con la normativa que le corresponde: Bizkaia (referencia, no puede romperse), Álava, Gipuzkoa, Navarra y estatal (territorio común, Ley 35/2006).

Fase 1 (esta entrega): arquitectura por territorio; los cuatro territorios forales completos; estatal con una escala de referencia etiquetada como tal; selector de comunidad autónoma construido con las comunidades no verificadas «en preparación» (no calculan); simulador, guías e informes adaptados. Fase 2 (posterior): añadir comunidades una a una, cada una con su escala verificada en fuente oficial, solo añadiendo un bloque de datos. Fuera de todas las fases: deducciones autonómicas del régimen común y deducciones propias de los territorios forales. Sin commit ni despliegue sin orden del fundador.

**Visto bueno del fundador (04-10-2026, «Adelante»)** a las siete propuestas del entregable intermedio: (1) escala de referencia estatal = art. 65 LIRPF, nunca llamada «supletoria»; (2) Ceuta y Melilla en preparación; (3) deducción navarra del art. 68 fuera del cálculo y declarada como límite; (4) en Navarra y estatal, entrada de datos del plan de pensiones por fecha de corte (2018 / 2007) sin desglose de rentabilidad; (5) tope del 40 % en la exención de la renta en Álava y Gipuzkoa; (6) estatal con gastos de 2.000 €, tres tramos del art. 20, sin DA 61.ª ni deducción por edad, escala del ahorro 19/21/23/27/30; (7) Bizkaia como residencia por defecto.

## 2. Investigación en fuentes oficiales

Fecha de consulta de todas las fuentes: **04-10-2026**. Ejercicio de referencia: IRPF 2026. Los textos oficiales descargados (BOB, NF 13/2013 consolidada, caso práctico DFB, texto refundido 2021) quedan en `tmp/fuentes-fiscales-20261004/` (carpeta ignorada por git). Los artículos clave de Navarra (59, 60, 62.5, 62.9, 68 y DT 25.ª) y del estatal (20, 57, 63, 65, 66, 74 y DA 32.ª) se verificaron además directamente en el BOE consolidado.

### 2.1 Tabla de parámetros por territorio

| Parámetro | Bizkaia | Álava | Gipuzkoa | Navarra | Estatal (territorio común) |
|---|---|---|---|---|---|
| Escala general | 23/28/35/40/45/46/47/49 % en 18.080 / 36.160 / 54.240 / 77.450 / 107.260 / 142.960 / 208.390 € | Idéntica | Idéntica | 13/22/25/28/36,5/41,5/44/47/49/50,5/52 % en 4.458 / 10.030 / 21.175 / 35.663 / 51.266 / 66.869 / 89.159 / 139.310 / 195.034 / 334.344 € (sin deflactar en 2026) | Estatal 9,5/12/15/18,5/22,5/24,5 % en 12.450 / 20.200 / 35.200 / 60.000 / 300.000 € + escala autonómica |
| Escala del ahorro | 19/20/22/24/25,5/26/26,5/27/28 % en 7.500 / 15.000 / 30.000 / 50.000 / 90.000 / 120.000 / 240.000 / 300.000 € | Idéntica | Idéntica | 20/22/24/26/27/28 % en 6.000 / 10.000 / 15.000 / 200.000 / 300.000 € | 19/21/23/27/30 % en 6.000 / 50.000 / 200.000 / 300.000 € (estatal + autonómica) |
| Mínimo personal / minoración | Minoración de cuota 1.615 € (solo cuota general) | 1.615 € | 1.615 € | Deducción en cuota: 1.084 € + 264 € (≥ 65) / 585 € (≥ 75) + 1.280 € si rentas ≤ 17.500 € (decrece hasta 0 en 32.000 €) | Mínimo del contribuyente 5.550 € + 1.150 € (> 65) + 1.400 € (> 75), «a escala» en la parte estatal y en la autonómica |
| Trabajo / pensiones | Bonificación 8.000 € (≤ 14.800) → 8.000 − 0,6098·(RNT − 14.800) → 3.000 € (> 23.000); 3.000 € si otras rentas > 7.500 € | Igual | Igual | Deducción en cuota por trabajo: 1.400 € (≤ 12.500) → 1.400 − 0,14·(RNT − 12.500) → 700 € → 700 − 0,02·(RNT − 35.000) → 400 € (> 50.000); tope: escala aplicada al rendimiento | Gastos 2.000 € (art. 19.2.f) + reducción art. 20: 7.302 € (≤ 14.852) → 7.302 − 1,75·(RNT − 14.852) → 2.364,34 − 1,14·(RNT − 17.673,52) → 0 desde 19.747,5 €; solo si otras rentas ≤ 6.500 €. DA 61.ª no alcanza a pensiones |
| Deducción por edad | 393 € (> 65) / 714 € (> 75) con BI ≤ 20.000 €; decrece (0,0393 / 0,0714) hasta 0 en 30.000 € | Igual | Igual | No existe (solo el mínimo personal) | No existe |
| Figura de previsión | EPSV | EPSV | EPSV | Planes de pensiones | Planes de pensiones |
| Cobro en capital | 70 % de la parte de aportaciones (1.ª prestación por contingencia, > 2 años); rentabilidad al 100 % en ahorro; tope 300.000 €. Transitorio opcional: 60 % de lo derivado de aportaciones pre-2026 | Igual | Igual | 100 % rendimiento del trabajo; 40 % de reducción solo sobre la parte de aportaciones anteriores a 1-1-2018 (DT 25.ª), en el año de la contingencia o los dos siguientes, > 2 años | 100 % rendimiento del trabajo; 40 % solo sobre la parte de aportaciones anteriores a 1-1-2007 (DT 12.ª), mismas condiciones |
| Cobro en renta | Aportaciones: trabajo. Rentabilidad exenta si renta vitalicia o temporal ≥ 15 años constante (sin tope) | Igual, exención ≤ 40 % de la renta (art. 9.44) | Igual, exención ≤ 40 % de la renta (art. 9.39) | Trabajo 100 %, sin exención | Trabajo 100 %, sin exención |
| Estimación sin certificado | 1 %/año (máx. 35 %) o 25 % | Igual | Igual | No aplica | No aplica |
| Límite de aportación | 5.000 € individual / 8.000 € empleo / 10.000 € conjunto; sin límite por edad | Igual | Igual | Menor de 30 % RNT (50 % si > 50 años) o 1.500 € (+ 8.500 empleo; + 4.250 autónomos); cónyuge 1.000 € | Menor de 30 % RNT o 1.500 € (+ 8.500 empleo; + 4.250 autónomos); cónyuge 1.000 € |
| Ahorro: ganancias, intereses, seguros | Base del ahorro (art. 63) | Igual | Igual | Base especial del ahorro (art. 54); reinversión en renta vitalicia > 65 exenta hasta 240.000 € | Base del ahorro (art. 46); reinversión > 65 exenta hasta 240.000 € |
| Exenciones de pensiones | IPA y gran invalidez; IPT > 55 años | Igual | Igual | IPA y gran invalidez | IPA y gran invalidez (art. 7.f) |

### 2.2 Fuentes por territorio (todas en `js/nuvia-jubilacion-fiscal.js`, con URL)

- **Bizkaia:** NF 13/2013 consolidada a 01-01-2026 (bizkaia.eus); NF 7/2025 de Presupuestos 2026 (BOB 30-12-2025); caso práctico CASO-PRACTICO-EPSV-26 (gidak.bizkaia.eus); fichas KA-01877 y KA-01878; índice de normativa EPSV y cuadro comparativo 2025-2026 de euskadi.eus. Sin cambios respecto al motor anterior.
- **Álava:** NF 21/2025 de medidas tributarias para 2026 (BOTHA 29-12-2025); NF 3/2025 (BOTHA 16-04-2025); NF 17/2025 (BOTHA 22-12-2025); texto consolidado de la NF 33/2013 e índice de normativa tributaria actual (araba.eus).
- **Gipuzkoa:** NF 6/2025 de Presupuestos 2026 (BOG 31-12-2025); NF 1/2025 de reforma fiscal (BOG 15-05-2025); DF 22/2025 (BOG 15-12-2025); texto vigente 2026 de la NF 3/2014 y normativa aprobada (gipuzkoa.eus).
- **Navarra:** Texto Refundido de la Ley Foral del IRPF (DFL 4/2008) consolidado en el BOE, última actualización 20-04-2026, que incorpora la Ley Foral 17/2025 (BOE 20-02-2026); Manual teórico Renta 2025 de la Hacienda Foral de Navarra (actualizado a 02-02-2026).
- **Estatal:** Ley 35/2006 consolidada en el BOE (30-09-2026); Ley 22/2009 (art. 46); RD 439/2007; Manual práctico Renta 2025 de la AEAT (régimen transitorio de las prestaciones en capital).

### 2.3 Escala autonómica de referencia (estatal)

**No existe escala autonómica supletoria en la Ley 35/2006 desde 2011.** El art. 74.1 remite a la escala «que haya sido aprobada por la Comunidad Autónoma»; el preámbulo de la Ley 22/2009 «excepciona la aplicación supletoria de la normativa estatal en materia de tarifa autonómica»; la antigua DT 15.ª (escala supletoria) solo rigió en 2010 y hoy regula la deducción por alquiler. Lo único asimilable es la **escala del art. 65 LIRPF** (residentes en el extranjero), que la DA 32.ª declara aplicable como escala autonómica a Ceuta y Melilla: 9,5/12/15/18,5/22,5 % en 12.450 / 20.200 / 35.200 / 60.000 €. Sumada a la estatal: 19/24/30/37/45/47 %. Se usa etiquetada literalmente como «Escala de referencia (art. 65 LIRPF) · no es la de ninguna comunidad autónoma»; nunca «supletoria». Fuente: BOE, Ley 35/2006 consolidada, arts. 65 y 74 y DA 32.ª, consultada el 04-10-2026.

### 2.4 Tabla de comunidades autónomas (estado en fase 1)

| Comunidad | Estado | Nota |
|---|---|---|
| Escala de referencia (art. 65 LIRPF) | verificada | Única opción que calcula en fase 1; etiquetada como referencia, no como comunidad |
| Andalucía, Aragón, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Comunitat Valenciana, Extremadura, Galicia, Comunidad de Madrid, Región de Murcia, La Rioja | en preparación | No calculan; el selector las muestra y el simulador lo dice con claridad y ofrece la escala de referencia |
| Ceuta, Melilla | en preparación | Escala autonómica confirmada (art. 65 por la DA 32.ª), pero la deducción del 60 % del art. 68.4 no está modelada |

Añadir una comunidad en la fase 2 = añadir en `CCAA` (`js/nuvia-jubilacion-fiscal.js`) su `escalaAutonomica` verificada, su `fuente` con fecha y `estado: 'verificada'`. El motor, la interfaz, las guías y el informe no se tocan.

## 3. Cambios

### 3.1 Motor y configuración

- **Nuevo `js/nuvia-jubilacion-fiscal.js`** (`NuviaJubilacionFiscal`): todos los parámetros fiscales por territorio con fuentes, fecha de consulta y estado; lista de comunidades; tres estructuras de cálculo parametrizadas (`vasco`, `navarra`, `comun`) para el IRPF anual; reparto fiscal de la renta periódica (con el tope del 40 % de la exención en Álava y Gipuzkoa); opciones de cálculo del capital (dos regímenes en el modelo vasco; reducción del 40 % sobre los derechos anteriores a la fecha de corte en Navarra y estatal); escala general «visible» (estatal + autonómica); textos, resumen de parámetros y límites por territorio, para que simulador, guías e informe no puedan discrepar.
- **`js/nuvia-jubilacion-motor.js`** refactorizado: sin ninguna cifra fiscal; recibe `territorio` (por defecto `bizkaia`) y `ccaa` (por defecto `referencia`); una entrada no verificada o desconocida devuelve `{ disponible: false, estado, mensaje }` y no calcula. Conserva proyección año a año, escenarios, cobro en capital con iteración, euros de hoy/nominales y el resto de la funcionalidad. Las funciones sueltas (`irpf`, `bonificacionTrabajo`, `deduccionEdad`, `basesCapital`) siguen calculando con Bizkaia salvo que se indique territorio.
- **Regresión de Bizkaia:** 17 casos de entrada (ejemplo inicial, conservar capital, fase previa, caso DFB, renta temporal, vitalicia, mixto, estimación, invalidez, otras deducciones…) comparados campo a campo entre el motor anterior y el nuevo: **0 diferencias** (tolerancia 1e-6). Las cifras clave quedan fijadas en la prueba «regresión exacta».

### 3.2 Simulador (`jubilacion.html`, `js/nuvia-jubilacion-ui.js`, `js/nuvia-jubilacion-graficos.js`, `estilos/nuvia-jubilacion.css`)

- Selector de residencia fiscal («Antes de empezar») con los cinco territorios, estado de la normativa (verificada / en preparación / sin determinar) y, en estatal, selector de comunidad con la escala de referencia como primera opción claramente etiquetada y las comunidades «en preparación». Nunca hay estado ambiguo: si el territorio o la comunidad no calculan, se muestra un bloque de estado sin cifras y, en el estatal, un botón para calcular con la escala de referencia.
- Todos los textos que decían «Bizkaia», «DFB», «EPSV» o «IRPF 2026 Bizkaia» dependen del territorio: «Qué calcula», paso 3 (EPSV / plan de pensiones, con entrada de datos por fecha de corte en Navarra y estatal), «Cómo lo calculamos» (parámetros, tablas de escalas, fuentes oficiales con fecha y límites), mapa fiscal (filas a partir del desglose que devuelve el módulo fiscal, rangos de escala y deducciones de cada modelo), comparativa del cobro en capital (dos regímenes en el modelo vasco; un solo régimen con reducción en Navarra y estatal), leyendas, tabla año a año y aviso final.
- `jubilacion.html?caso=dfb` solo aplica en Bizkaia; con otro territorio se ignora y se avisa. Al cambiar de territorio, la previsión se vacía si cambia el modelo fiscal o si había un caso práctico cargado, para que no se mezclen datos de una normativa con otra.
- Residencia compartida por URL (`?territorio=…&ccaa=…`), sin almacenamiento en el navegador: la página actualiza su URL con `history.replaceState` y los enlaces marcados con `data-jub-territorio` (guías, recorrido Ordenar → Calcular → Ejecutar). Parámetros desconocidos degradan al estado «Residencia fiscal sin determinar» con aviso, nunca a un cálculo silencioso.

### 3.3 Informe imprimible (`js/nuvia-jubilacion-informe.js`)

Cabecera con territorio y normativa; datos con la residencia fiscal; mapa fiscal con las correcciones propias de cada modelo y rangos de escala; comparativa del capital generalizada (una o dos columnas); método con la normativa, la Hacienda y la norma; bloque «Normativa y fuentes» (URL) y «Límites de esta estimación» (deducciones autonómicas y forales excluidas, escala de referencia si procede, art. 68 en Navarra, única contingencia modelada fuera del modelo vasco); aviso final por territorio.

### 3.4 Guías (`guia-fiscal.html`, `guia-planificacion.html`, `js/nuvia-guias-jubilacion-ui.js`)

- Ambas leen `?territorio=…&ccaa=…`, muestran el selector compacto y conservan el territorio en todos sus enlaces. Se mantiene el recorrido Ordenar → Calcular → Ejecutar y el mismo sistema visual.
- Guía fiscal: ámbito, matriz fiscal (columnas y filas según el modelo), preguntas previas, caso práctico, tramitación, checklist, normativa y fuentes salen del módulo de parámetros y del motor. El caso práctico de la DFB solo se muestra en Bizkaia; Álava y Gipuzkoa usan un ejemplo ficticio identificado como tal (120.000 € = 70.000 aportados + 30.000 de rentabilidad hasta 2025, 15.000 + 5.000 desde 2026), y Navarra y estatal otro (100.000 € con 60.000 de aportaciones anteriores a 2018 / 2007), todos calculados con el motor y comprobados a mano en las pruebas. Ninguna Hacienda distinta de la DFB publica un ejemplo oficial de 2026 (la FAQ alavesa y los criterios guipuzcoanos aún reflejan el 60 % anterior; AEAT y HFN no publican ejemplo numérico). La tramitación de los territorios forales vascos sale del Reglamento de EPSV de Euskadi; en Navarra y estatal la solicitud se dirige a la gestora del plan y los plazos de pago se marcan «En preparación» hasta contrastarlos en fuente oficial.
- Hoja de ruta: textos de previsión generalizados («EPSV, planes de pensiones…»), enlaces con territorio y tarjeta final según el territorio.

### 3.5 Pruebas y validadores

- `docs/nuvia-jubilacion-motor.test.mjs`: 22 casos (13 anteriores + regresión exacta de Bizkaia, Álava y Gipuzkoa con tope del 40 %, Navarra —escala, deducción por trabajo, mínimo personal, capital con DT 25.ª—, estatal —gastos, art. 20, mínimo a escala, escala de referencia, DT 12.ª—, entradas en preparación/desconocidas, fuentes y límites del módulo). Cada cifra esperada se calcula a mano a partir de la norma.
- `docs/nuvia-guias-jubilacion.test.mjs`: 8 casos (hoja de ruta con territorio, caso DFB en Bizkaia, ejemplos ficticios verificados a mano, Navarra y estatal, URL y comunidad en preparación, selector del simulador y no mezcla del caso DFB).
- `docs/nuvia-formularios.test.mjs` carga el módulo fiscal; `scripts/check-render.mjs` añade contratos para el selector y tres páginas nuevas (`jubilacion.html?territorio=navarra#resultados`, `jubilacion.html?territorio=estatal&ccaa=madrid`, `guia-fiscal.html?territorio=estatal&ccaa=referencia`).

## 4. Prueba regulatoria (§12 del marco)

1. Necesidad: entender la renta de jubilación, sus impuestos y su duración con la normativa del lugar de residencia del usuario.
2. Datos: los introduce el usuario; la residencia la elige él. Los ejemplos son ficticios e identificados, salvo el caso oficial de la DFB en Bizkaia.
3. Transformación: cálculo local con reglas públicas de cada Hacienda, citadas con fuente y fecha.
4. Resultado: importes estimados, escenarios, tabla y comparativa de regímenes, con supuestos, fuentes y límites a la vista.
5. Instrumentos identificables: no; categorías de producto.
6. Circunstancias personales: sí, en simulación local, sin juicio de idoneidad.
7-10. No sugiere operar, no opina sobre valores, no puntúa ni ordena por atractivo y no reproduce recomendaciones de terceros. No se comparan territorios entre sí ni se sugiere cambiar de residencia: cada cálculo se hace solo con la normativa elegida. La comparativa de regímenes del capital usa una métrica objetiva y visible (el impuesto estimado).
11. Los colores identifican series; el rojo se reserva a impuestos y cifras negativas; los estados «en preparación» se expresan con texto.
12-13. Sin contratación, contacto ni remuneración.
14. Sin vínculo con la actividad del agente ni con la entidad.
15. Sin persistencia ni envío de datos; la residencia viaja solo en la URL; el informe se genera en el navegador.
16. No interviene la IA.
17. Fuentes oficiales con URL y fecha de consulta, fórmulas, parámetros y límites en el simulador, las guías y el informe.
18. Pruebas del motor (regresión exacta de Bizkaia incluida), de las guías y de formularios; contratos de render ampliados.

Clasificación: **ámbar** por datos patrimoniales y personalización fiscal. Revisión interna; la validación jurídica externa queda fuera del alcance alfa (§0 del marco). Sin commit ni despliegue.

## 5. Validación

- `npm run test:jubilacion`: 30/30. `docs/nuvia-formularios.test.mjs`: 11/11.
- `npm run validate` en el equipo del fundador: cáscara, informes, índices, paridad, sitio estático (42 páginas), consistencia (0 estilos inline en 29 páginas), lenguaje, estilos, navegación, definición, metadatos, confianza, contenido externo, privacidad, editorial, tipografía, layout, superficies, tarjetas, controles, tablas, avisos, familia, entradas, jerarquía, lecturas, informes, jubilación y reglas: todo en verde. La cadena se detiene después en `test:fundamentales-alfa` por un fallo de entorno ajeno a este trabajo (`rolldown` sin binario nativo en el entorno Linux del asistente: «Cannot find native binding»); nada de este cambio toca ese módulo.
- Render con Chromium (`scripts/check-render.mjs`) a **1440, 1024 y 768 px** de `jubilacion.html`, `jubilacion.html#resultados`, `jubilacion.html?territorio=navarra#resultados`, `jubilacion.html?territorio=estatal&ccaa=madrid`, `guia-planificacion.html`, `guia-fiscal.html` y `guia-fiscal.html?territorio=estatal&ccaa=referencia`: sin fallos de contraste, tipografía, estructura, superficies, desborde, foco, estados ni consola. Ejecutado en el contenedor del asistente (el entorno Linux del equipo no puede descargar Chromium); capturas revisadas del selector, del estado «en preparación», del mapa fiscal navarro, del método estatal, del capital en Bizkaia y de los casos prácticos de las guías.
- Coherencia comprobada en los cinco territorios: escenarios, tabla año a año, mapa fiscal, capital, guías e informe sin valores indefinidos ni textos de otro territorio (prueba automática).

## 6. Límites y pendientes

- Fuera de alcance en todas las fases (y así se dice en simulador, guías e informe): deducciones autonómicas del régimen común y deducciones propias de los territorios forales; deducción navarra del art. 68 por pensiones de jubilación contributivas inferiores a 15.400 €.
- Fuera del modelo vasco solo se modela la contingencia de jubilación del plan de pensiones; invalidez y dependencia tienen reglas propias no calculadas (el selector de contingencia queda fijado en jubilación).
- Navarra: el art. 55 no menciona la EPSV; los socios de EPSV residentes en Navarra quedan fuera. El tope de la deducción por trabajo se aplica con la escala sobre el rendimiento neto ya reducido (criterio conservador documentado en el código).
- Estatal: la escala de referencia del art. 65 no es la de ninguna comunidad; las 15 comunidades y Ceuta y Melilla quedan «en preparación» para la fase 2. Las rentas vitalicias aseguradas (porcentajes del art. 25.3) y la reinversión en renta vitalicia > 65 años no se modelan (igual que antes).
- Tramitación de Navarra y estatal: plazos de pago de la gestora marcados «En preparación» hasta contrastarlos en fuente oficial (RD 304/2004).
- Riesgo de cambios normativos: la Ley 35/2006 consolidada estaba marcada «última actualización en proceso» (30-09-2026) por el RDL 26/2026; ninguno de sus cambios afecta a los parámetros usados. Una ley foral navarra de finales de 2026 podría introducir cambios retroactivos.
- Archivos de trabajo que no forman parte del sitio (carpeta `tmp/`, ignorada por git): `tmp/fuentes-fiscales-20261004/` (textos oficiales descargados) y `tmp/render-bundle-20261004.tgz` (copia del sitio usada para el render en Chromium); pueden borrarse.
- Pendiente de orden del fundador: commit y despliegue.
