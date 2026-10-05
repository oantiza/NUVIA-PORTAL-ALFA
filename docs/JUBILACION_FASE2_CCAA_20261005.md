# Jubilación · fase 2: escalas autonómicas de las 15 comunidades de régimen común · 05-10-2026

## 1. Orden del fundador

Verificar y activar, una a una, las escalas autonómicas de IRPF 2026 de las 15 comunidades de régimen común (Andalucía, Aragón, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Comunitat Valenciana, Extremadura, Galicia, Comunidad de Madrid, Región de Murcia y La Rioja). Activar una comunidad es solo añadir datos a su bloque de `CCAA` en `js/nuvia-jubilacion-fiscal.js`. Si alguna comunidad verificada tiene mínimo personal propio, se permite una única extensión: el campo `minimoAutonomico { base, edad65, edad75 }`, aplicado por `irpfComun` solo en la parte autonómica. El motor, la interfaz, las guías y el informe no se tocan. Las deducciones autonómicas quedan fuera en todas las fases. La escala de referencia (art. 65) sigue siendo la primera opción del selector, con su etiqueta. Sin commit ni despliegue sin orden expresa.

Punto de partida: fase 1 en producción (commits `89fe68b` y `78ebc49`); ficha `docs/JUBILACION_MULTITERRITORIO_20261004.md`.

Nota: la orden pedía leer `docs/JUBILACION_MULTITERRITORIO_REVISION_20261004.md`. No estaba en el repositorio al empezar; el fundador lo archivó en `docs/` el mismo 05-10-2026 y se leyó entonces. Sus hallazgos (edad a 31-12, plazos del RD 304/2004, Ceuta y Melilla) ya estaban aplicados en `78ebc49` y no afectan a esta fase.

### 1.1 Decisiones del fundador sobre el entregable intermedio (05-10-2026)

1. **Activación:** las 15 comunidades, como «verificada».
2. **Illes Balears:** el art. 2 del DL 1/2014 incrementa un 10 % «el mínimo del contribuyente mayor de sesenta y cinco años y mayor de setenta y cinco años». Se aplica la lectura de la AEAT (Manual práctico de Renta 2025, cuadro de mínimos autonómicos): 5.550 € con carácter general; desde los 65, 6.105 + 1.265 = 7.370 €; desde los 75, 1.540 € más (8.910 €). El resumen del Ministerio de Hacienda lo describe como un 10 % solo sobre los incrementos por edad; se descarta esa lectura.
3. **Fuentes visibles:** la ley de la comunidad encabeza la lista de fuentes del estatal (`configuracion()` del módulo fiscal), para que el simulador, la guía fiscal y el informe la citen. El motor y la interfaz no se tocan.
4. **Selector y pruebas:** cada comunidad lleva una nota breve en el campo `nota`, que la interfaz ya muestra bajo el selector (`descripcion` solo se muestra para la referencia). El estado «en preparación» se prueba con una entrada ficticia que solo existe durante la prueba. El contrato de render de Madrid pasa a ser el de una comunidad verificada.

### 1.2 Segunda orden del fundador (05-10-2026)

Tras el entregable final: corregir la redacción de la guía fiscal («con la escala autonómica de Comunidad de Madrid»), aunque exija tocar la interfaz de la guía; dar la fecha propia de la fuente donde exista en los textos «fuentes consultadas»; y hacer commit.

## 2. Investigación en fuentes oficiales

Fecha de consulta de todas las fuentes: **05-10-2026**. Ejercicio: IRPF 2026. Copias de trabajo en `tmp/fuentes-ccaa-20261005/` (ignorada por git), con la tabla de trabajo `INVESTIGACION_CCAA_20261005.md`.

- **Fuente A (dato):** texto consolidado de cada ley autonómica en el BOE, en `https://www.boe.es/buscar/act.php?id=<ID>&tn=1`.
- **Fuente B (contraste):** Ministerio de Hacienda, Secretaría General de Financiación Autonómica y Local, «Tributación Autonómica. Medidas 2026», capítulo IV, actualizado a 23-09-2026: https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-iv-tributacion-autonomica-2026.pdf
- **Fuente C (mínimos):** AEAT, Manual práctico de Renta 2025, «Importes del mínimo personal y familiar aprobados por las Comunidades Autónomas» y cuadro comparativo estatal-autonómico.
- **Fuente D:** INE, IPC de diciembre de 2025 por comunidades (La Rioja, 2,6 %).

Las fuentes A y B coinciden en las 15 comunidades (tramos, tipos y cuotas). La aritmética de cada tabla está comprobada: la cuota acumulada al inicio de cada tramo, recalculada con tramos y tipos, coincide al céntimo con la columna «Cuota íntegra» publicada. La prueba «Fase 2: las 15 comunidades verificadas…» lo vuelve a comprobar en cada ejecución.

| Comunidad | Escala autonómica 2026 (desde € → tipo %) | Mínimo del contribuyente propio (general / +65 / +75) | Norma y fuente A | Estado |
|---|---|---|---|---|
| Andalucía | 0→9,5 · 13.000→12 · 21.100→15 · 35.200→18,5 · 60.000→22,5 | 5.790 / 1.200 / 1.460 | Ley 5/2021, arts. 23 y 23 bis · BOE-A-2021-17915 | verificada |
| Aragón | 0→9,5 · 13.072,50→12 · 21.210→15 · 36.960→18,5 · 52.500→20,5 · 60.000→23 · 80.000→24 · 90.000→25 · 130.000→25,5 | no (estatal) | DL 1/2005, art. 110-1 · BOA-d-2005-90006 | verificada |
| Principado de Asturias | 0→9 · 12.450→12 · 17.707,20→14 · 33.007,20→19,2 · 53.407,20→21,5 · 70.000→22,5 · 90.000→25 · 175.000→26 | 6.105 / 1.265 / 1.540 | DL 2/2014, arts. 2 y 2 bis (Ley 3/2025) · BOE-A-2015-945 | verificada |
| Illes Balears | 0→9 · 10.000→11,25 · 18.000→14,25 · 30.000→17,5 · 48.000→19 · 70.000→21,75 · 90.000→22,75 · 120.000→23,75 · 175.000→24,75 | 5.550 / 7.370 desde 65 / 8.910 desde 75 (lectura AEAT del art. 2) | DL 1/2014, arts. 1 y 2 · BOE-A-2014-6925 | verificada |
| Canarias | 0→9 · 13.748→11,5 · 19.422→14 · 35.924→18,5 · 57.566→23,5 · 93.268→25 · 123.745→26 | 5.606 / 1.162 / 1.414 | DL 1/2009, arts. 18 bis y 18 quater (Ley 9/2025) · BOC-j-2009-90008 | verificada |
| Cantabria | 0→8,5 · 13.000→11 · 21.000→14,5 · 35.200→18 · 60.000→22,5 · 90.000→24,5 | no (estatal) | DL 62/2008, art. 1 · BOCT-c-2008-90028 | verificada |
| Castilla-La Mancha | 0→9,5 · 12.450→12 · 20.200→15 · 35.200→18,5 · 60.000→22,5 (mismos tramos y tipos que el art. 65) | no (estatal) | Ley 8/2013, art. 13 bis · BOE-A-2014-1368 | verificada |
| Castilla y León | 0→9 · 12.450→12 · 20.200→14 · 35.200→18,5 · 53.407,20→21,5 | igual que el estatal (art. 1 bis) | DL 1/2013, arts. 1 y 1 bis · BOCL-h-2013-90254 | verificada |
| Cataluña | 0→9,5 · 12.500→12,5 · 22.000→16 · 33.000→19 · 53.000→21,5 · 90.000→23,5 · 120.000→24,5 · 175.000→25,5 | 5.550 (igual que el estatal, art. 611-2) | DL 1/2024, arts. 611-1 y 611-2 · BOE-A-2024-6951 | verificada |
| Comunitat Valenciana | 0→8,8 · 12.000→11,7 · 22.000→14,6 · 32.000→17 · 42.000→19,4 · 52.000→21,9 · 62.000→24,4 · 72.000→26,1 · 100.000→27,35 · 150.000→28,35 · 200.000→29,35 | 6.105 / 1.265 / 1.540 | Ley 13/1997, arts. 2 y 2 bis (Ley 5/2026, art. 18, con efectos desde el 1-1-2026) · BOE-A-1998-8202 | verificada |
| Extremadura | 0→7,75 · 12.450→9,75 · 20.200→16 · 24.200→17,5 · 35.200→21 · 60.000→23,5 · 80.200→24 · 99.200→24,5 · 120.200→25 | no (estatal) | DL 1/2018, art. 1 (Ley 2/2026, con efectos desde el 1-1-2026) · BOE-A-2018-8159 | verificada |
| Galicia | 0→9 · 12.985,35→11,65 · 21.068,60→14,9 · 35.200→18,4 · 60.000→22,5 | 5.789 / 1.199 / 1.460 | DL 1/2011, arts. 4 y 4 bis · BOE-A-2011-18161 | verificada |
| Comunidad de Madrid | 0→8,5 · 13.362,22→10,7 · 19.004,63→12,8 · 35.425,68→17,4 · 57.320,40→20,5 | 5.956,65 / 1.234,26 / 1.502,58 | DL 1/2010, arts. 1 y 2 (Ley 13/2023) · BOCM-m-2010-90068 | verificada |
| Región de Murcia | 0→9,5 · 12.450→11,2 · 20.200→13,3 · 34.000→17,9 · 60.000→22,5 | no (estatal) | DL 1/2010, art. 2 · BOE-A-2011-10542 | verificada |
| La Rioja | 0→8 · 12.450→10,6 · 20.200→13,6 · 35.200→17,8 · 40.000→18,3 · 50.000→19 · 60.000→24,5 · 120.000→27 | no (solo modifica el mínimo por discapacidad de descendientes) | Ley 10/2017, art. 31 · BOE-A-2017-13750 | verificada |

Comprobaciones de vigencia en 2026:

- La Comunitat Valenciana y Extremadura cambiaron su escala en 2026 (Ley 5/2026 de 31 de julio y Ley 2/2026 de 3 de agosto), en ambos casos con efectos desde el 1-1-2026; se usa la escala nueva.
- La Ley 5/2026 valenciana fija además otra escala desde el 1-1-2027 (DT 3.ª). No afecta al ejercicio 2026; el simulador mantiene fijas las reglas de 2026 en toda la proyección.
- Canarias: la escala vigente es la de la Ley 9/2025 (DF 11.ª.17).
- La Rioja: el art. 31 ter (Ley 9/2025) prevé deflactar la escala si el IPC riojano de diciembre del año anterior supera el 3 %; en diciembre de 2025 fue del 2,6 % (INE), así que no opera en 2026.
- Ninguna comunidad puede modificar la escala del ahorro (arts. 66 y 76 LIRPF): se mantiene la conjunta 19/21/23/27/30 %.
- La edad para el mínimo autonómico se toma, como en el estatal, cumplida a 31 de diciembre (criterio de devengo del Manual de Renta de la AEAT).

## 3. Cambios

En `js/nuvia-jubilacion-fiscal.js` (datos y la extensión del mínimo autorizada), en las pruebas y en el contrato de render. Por la segunda orden del fundador se tocan además tres líneas de texto de la interfaz: la guía (`js/nuvia-guias-jubilacion-ui.js`), el simulador (`js/nuvia-jubilacion-ui.js`) y el informe (`js/nuvia-jubilacion-informe.js`), solo para el nombre con artículo y las fechas de consulta. El motor no se ha modificado.

### 3.1 Datos

- Las 15 comunidades pasan a `estado: 'verificada'`, con `escalaAutonomica` (lista `[desde, tipo]`), `fuente { k, t, href, d, consulta: '05-10-2026' }` (texto consolidado en el BOE; en `d`, los artículos y el contraste con Hacienda) y `nota` (texto que la interfaz muestra bajo el selector, con el límite «No incluye deducciones autonómicas»).
- `minimoAutonomico { base, edad65, edad75 }` en las siete comunidades que fijan un mínimo del contribuyente propio: Andalucía, Asturias, Illes Balears, Canarias, Comunitat Valenciana, Galicia y Madrid. En Baleares, `edad65: 1.820` (= 6.105 − 5.550 + 1.265) reproduce la lectura de la AEAT. Cataluña y Castilla y León declaran un mínimo igual al estatal y no llevan el campo.
- Nueva constante `CONSULTA_CCAA = '05-10-2026'`; las demás fuentes conservan `CONSULTA = '04-10-2026'`.

### 3.2 Extensión del mínimo autonómico (art. 56.3 LIRPF; art. 46.1.a Ley 22/2009)

- `configuracion()` copia `minimoAutonomico` de la comunidad y, para una comunidad verificada distinta de la referencia, antepone su fuente a las del estatal (decisión 3).
- `irpfComun(P, escalaAutonomica, rentas, minimoAutonomico)`:
  - La parte estatal conserva el mínimo del art. 57: `escala estatal(base general) − escala estatal(mínimo en la general)`.
  - La parte autonómica (art. 74.1.2.º) usa el mínimo de la comunidad: `escala autonómica(base general) − escala autonómica(mínimo autonómico en la general)`.
  - El mínimo se reparte primero en la base general y el resto en la del ahorro (art. 56.2), por separado para cada parte.
  - En el ahorro, la escala estatal (art. 66) y la autonómica (art. 76) son idénticas, cada una la mitad de la conjunta. Por eso el mínimo a escala del ahorro es `(escala conjunta(resto estatal) + escala conjunta(resto autonómico)) / 2`. Sin mínimo propio, los dos restos coinciden y el resultado es exactamente el anterior.
  - El resultado añade `minimoAutonomico` (importe aplicado), y la línea del desglose pasa a «Mínimo personal a escala (estatal 6.700 € · autonómico 7.190,91 €)» cuando los dos importes difieren.
- Nueva función interna `eurD` para mostrar céntimos cuando los hay (5.956,65 €).

### 3.3 Textos (matices exigidos por las comunidades verificadas)

- Con mínimo propio, la línea del mínimo en «Cómo lo calculamos» y en el informe (`resumenParametros`) dice que en la parte autonómica se aplica, también a escala, el mínimo propio de la comunidad (art. 56.3), con sus importes. Sin mínimo propio, el texto no cambia.
- **Nombre con artículo (segunda orden):** cada comunidad lleva el campo `de` («de la Comunidad de Madrid», «del Principado de Asturias», «de las Illes Balears», «de la Comunitat Valenciana», «de la Región de Murcia»…), y el módulo expone `deComunidad(c)`. Lo usan:
  - `limites()`: «La escala autonómica aplicada es la de la Comunidad de Madrid», con el añadido, si procede, «, con su mínimo del contribuyente propio en la parte autonómica (art. 56.3 LIRPF)»;
  - `textos().ambito`: «con la escala autonómica de la Comunidad de Madrid»;
  - `resumenParametros()`: «el mínimo propio de la Comunidad de Madrid (art. 56.3)»;
  - la guía fiscal (`js/nuvia-guias-jubilacion-ui.js`, «Normativa y fuentes»), que decía «de » + nombre: ahora «con la escala autonómica de la Comunidad de Madrid».
- **Fecha propia de la fuente (segunda orden):** la fuente de la comunidad lleva su `consulta`, y el módulo expone `consultaFuentes(cfg)`. Devuelve «el 04-10-2026» o, con una comunidad verificada, «el 04-10-2026; la ley autonómica de la Comunidad de Madrid, el 05-10-2026». La usan:
  - la línea «Normativa aplicada… · fuentes consultadas …» del selector y la cabecera «Fuentes oficiales (consultadas …)» del simulador (`js/nuvia-jubilacion-ui.js`);
  - el ámbito de la guía fiscal;
  - el método del informe (`js/nuvia-jubilacion-informe.js`).
  En la ficha de tramitación de la guía, cada fuente muestra su propia fecha (`f.consulta`, o la del territorio si no tiene).
- Para la referencia, «la de cada comunidad autónoma está en preparación» pasa a «que no es la de ninguna comunidad autónoma». `textos().ambito` (referencia): «(no la de tu comunidad, que está en preparación)» pasa a «(no la de ninguna comunidad autónoma)». La `descripcion` de la referencia ya no dice «hasta que cada comunidad esté verificada».
- Se mantiene en todas las comunidades, y en la referencia, el límite «No incluye deducciones autonómicas del régimen común…».

### 3.4 Pruebas y render

- `docs/nuvia-jubilacion-motor.test.mjs`:
  - La prueba «Una comunidad en preparación… no calculan» usa una entrada ficticia; siguen comprobándose las 16 entradas y Ceuta y Melilla fuera.
  - Se añaden cinco pruebas:
    - las 15 comunidades verificadas, con fuente del BOE fechada, nota, aritmética contra la cuota publicada, la ley citada en primer lugar y el límite visible;
    - la pensión de 28.000 € a los 64 años en las 15, calculada a mano en el comentario de cada caso;
    - los 65 y 75 años en las siete comunidades con mínimo propio;
    - el mínimo autonómico en la base del ahorro, incluido un caso en el que el mínimo autonómico desborda la base general y el estatal no;
    - la regresión de la referencia y de las comunidades sin mínimo propio.
- `docs/nuvia-guias-jubilacion.test.mjs`: el estado «en preparación» se prueba con la entrada ficticia. Madrid calcula en la guía fiscal y la guía enlaza la ley madrileña. Madrid, Valencia y Cataluña calculan en el simulador y muestran su nota sin ninguna mención «en preparación».
- `scripts/check-render.mjs`: el contrato `jubilacion.html?territorio=estatal&ccaa=madrid` (que esperaba el bloque «en preparación») se sustituye por `#resultados` de Madrid, Valencia y Cataluña. Se añaden `guia-fiscal.html?territorio=estatal&ccaa=madrid` y `…&ccaa=andalucia`, que exigen el enlace a la ley de la comunidad.

## 4. Prueba regulatoria (§12 del marco)

1. Necesidad: estimar el IRPF de la jubilación con la escala de la comunidad de residencia del usuario.
2. Datos: los introduce el usuario; la comunidad la elige él.
3. Transformación: escala estatal + escala autonómica de la comunidad elegida, menos el mínimo a escala (estatal y, si existe, autonómico), con reglas publicadas en el BOE.
4. Resultado: los mismos importes, escenarios y tablas que en la fase 1, con la ley de la comunidad citada y sus límites.
5. Instrumentos identificables: no.
6. Circunstancias personales: sí (edad, ingresos y residencia), en simulación local y sin juicio de idoneidad.
7. Sugerencias de operar: no.
8. Opiniones sobre valor o precio: no.
9. Puntuaciones u orden por atractivo: no. No se comparan comunidades ni se sugiere cambiar de residencia; cada cálculo usa solo la comunidad elegida, y el selector las lista en el orden fijo de la fase 1.
10. Recomendaciones de terceros: no se reproducen.
11. Color y diseño: sin cambios visuales; el estado se expresa con texto.
12. Contratación o contacto: no hay.
13. Remuneración: no hay.
14. Agente vinculado: sin vínculo con su actividad ni con la entidad.
15. Datos personales: nada se guarda ni se envía; la comunidad viaja en la URL.
16. IA: no interviene.
17. Transparencia: se muestran la ley de cada comunidad (URL del BOE y fecha de consulta), los parámetros, las escalas y los límites (deducciones autonómicas fuera, mínimo propio aplicado).
18. Control de regresiones: pruebas a mano por comunidad, aritmética de cada escala, regresión exacta de la referencia y de los territorios forales, y contratos de render.

Clasificación interna: **ámbar** (datos patrimoniales y personalización fiscal). Revisión interna; la validación jurídica externa queda fuera del alcance de la alfa (§0 del marco). Sin commit ni despliegue.

## 5. Validación

Ejecutado el 05-10-2026 en el equipo del fundador (Windows, Node 24, Chromium de Playwright), y repetido completo tras los cambios de la segunda orden, con el mismo resultado. Archivos de registro en `tmp/fuentes-ccaa-20261005/` (`validate-final.log`, `render-final.log`).

- `npm run test:jubilacion`: **36/36** (28 del motor, 5 de ellas nuevas de la fase 2, y 8 de las guías). `docs/nuvia-formularios.test.mjs`: 11/11.
- **Regresión numérica:** se compararon el módulo fiscal anterior y el nuevo con el motor, campo a campo, en 9 entradas × 5 territorios (Bizkaia, Álava, Gipuzkoa, Navarra y el estatal con la escala de referencia): 370.051 campos y **0 diferencias numéricas**. Las únicas diferencias son de texto: el límite de la referencia («…que no es la de ninguna comunidad autónoma»). Las cifras fijadas en las pruebas de Bizkaia, Álava, Gipuzkoa, Navarra y la referencia no se han tocado y siguen en verde. Castilla-La Mancha (misma escala que el art. 65 y sin mínimo propio) da exactamente las mismas cifras que la referencia en toda la proyección.
- `npm run validate` completo: **en verde** (salida 0), incluidos cáscara, informes, índices, paridad, sitio estático, consistencia (0 estilos inline), lenguaje, estilos, navegación, metadatos, confianza, contenido externo, superficies, tarjetas, avisos, jerarquía, entradas, `test:informes` 42/42, `test:jubilacion` 36/36, `test:reglas`, `test:analisis` (incluido `test:fundamentales-alfa`, 88/88) y `auditar`: 49 páginas a 1440 px sin fallos.
- **Render con Chromium a 1440, 1024 y 768 px** (`node scripts/check-render.mjs . 1440,1024,768 …`), 11 páginas y 33 combinaciones, sin fallos de contraste, tipografía, estructura, superficies, desborde, foco, estados ni consola:
  - `jubilacion.html`, `jubilacion.html#resultados` y `jubilacion.html?territorio=navarra#resultados`;
  - `jubilacion.html?territorio=estatal&ccaa=madrid#resultados`, `…&ccaa=valenciana#resultados` y `…&ccaa=cataluna#resultados`;
  - `guia-planificacion.html` y `guia-fiscal.html`;
  - `guia-fiscal.html?territorio=estatal&ccaa=referencia`, `…&ccaa=madrid` y `…&ccaa=andalucia`.
- **Revisión visual y de textos** (Madrid, 1024 px):
  - el selector muestra la nota de la comunidad;
  - «Cómo lo calculamos» muestra la escala autonómica de Madrid, la línea del mínimo propio (5.956,65 €; 7.190,91 € desde los 65; 8.693,49 € desde los 75) y la ley madrileña en primer lugar entre las fuentes;
  - el mapa fiscal rotula «Mínimo personal a escala (estatal 6.700 € · autonómico 7.190,91 €)»;
  - la guía fiscal enlaza el DL 1/2010 en el BOE.
- **Tras la segunda orden:**
  - la guía fiscal dice «con la escala autonómica de la Comunidad de Madrid» y «del Principado de Asturias»;
  - el selector, la cabecera de fuentes, la guía y el informe dicen «fuentes consultadas el 04-10-2026; la ley autonómica de la Comunidad de Madrid, el 05-10-2026»;
  - con la escala de referencia y en los territorios forales se conserva una sola fecha («el 04-10-2026»).
  Todo queda cubierto por pruebas.

## 6. Límites y pendientes

- Fuera de alcance en todas las fases, y así se declara en los límites visibles: las deducciones autonómicas (alquiler, hijos, vivienda…) y Ceuta y Melilla. Como en la fase 1, el simulador solo modela el mínimo del contribuyente; los mínimos por descendientes, ascendientes y discapacidad (estatales o autonómicos) no se calculan.
- Ninguna comunidad real queda «en preparación». El camino de código se conserva y se prueba con una entrada ficticia; ya no existe una URL real que muestre ese estado en el render.
- Illes Balears: se aplica la lectura de la AEAT del art. 2 (decisión del fundador). Si la AEAT o la comunidad publicaran otro criterio para 2026, bastaría con cambiar `minimoAutonomico.edad65`.
- Las reglas de 2026 se mantienen fijas en toda la proyección. La escala valenciana de 2027 y las futuras leyes autonómicas no se aplican hasta una nueva verificación.
- El Manual de Renta 2026 de la AEAT aún no existe (la Renta 2026 se declara en 2027); los mínimos se han contrastado con la ley consolidada y con el Manual 2025, al no haber cambios normativos en 2026 que los afecten.
- Resueltos por la segunda orden del fundador: la redacción de la guía fiscal («de la Comunidad de Madrid») y la fecha propia de la ley autonómica en los textos «fuentes consultadas».
