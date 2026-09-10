# Recuperación de datos BDB para NUVIA

Fecha: 10-09-2026. Auditoría solicitada por el fundador. La fase inicial fue exclusivamente de lectura. Tras su orden «hazlo», se ejecutó la recuperación selectiva en Firestore Alfa y se verificó mediante una lectura independiente. No se modificaron los tres proyectos BDB ni se ejecutó su extractor. Las evidencias de ejecución permanecen en la salida local ignorada por Git; NUVIA no conserva código de conexión con la base de origen.

## Estado de ejecución

Recuperación completada el 10-09-2026 y verificada documento a documento:

- 617 fichas de fondos enriquecidas; 616 con composición global original y una con ausencia declarada.
- 617 fichas con costes; 465 con regiones; 447 con sectores; 357 con algún dato descriptivo de renta fija.
- 641 documentos de posiciones regenerados conservando el tipo de instrumento. Se almacenan 117.976 filas: dos carteras muy grandes se recortan por el límite documental y lo declaran mediante `truncado`, cobertura conservada y cobertura de origen.
- FONDIBAS verificado en la base destino: 20,72252 % bolsa, 76,39175 % renta fija, 2,88573 % liquidez y 0 % otros.
- Copia previa de las 617 fichas y 641 documentos destino en `output/recuperacion-fondos-bdb-20260910/`.
- Los 26 fondos sin ficha de Alfa continúan fuera del catálogo hasta disponer de un histórico reciente validado. La recuperación no ha convertido históricos antiguos en datos actuales.

## Conclusión

Sí: BDB conserva gran parte de la información que falta o está simplificada en NUVIA. La solución exige importar campos seleccionados y corregir su interpretación. Una copia literal del documento principal de BDB trasladaría también errores del extractor y de la plataforma.

Se han contrastado los 727 instrumentos incluidos en `universo/universo-alfa.csv`, de los que 643 son fondos. Los recuentos corresponden a ese universo, no al total de activos de BDB. La comprobación de históricos se ha concentrado en los 27 instrumentos sin ficha en Alfa; no es una auditoría de todas las series de ambas bases.

## Fuentes consultadas

1. `C:/Users/oanti/Proyectos/BDB/1-extractor`: código, `data/funds`, `export_bdb`, exportaciones NDJSON, archivos originales `cache/raw_morningstar_lt/{ISIN}/sal_allocationMap.json`, y `data/history_vl` para fondos ausentes.
2. `C:/Users/oanti/Proyectos/BDB/2-plataforma-datos`: contratos y transformaciones hacia la base maestra.
3. `C:/Users/oanti/Proyectos/BDB/3-BDB-ACTIVOS_app`: configuración y lectura de fichas, exposiciones, posiciones e históricos.
4. Firestore **`bbdd-activos-financieros`**, consulta directa de fichas, `holdings/latest`, manifiestos y fragmentos, y series de instrumentos ausentes.
5. Firestore **`nuvia-family-wealth`**, consulta directa de fichas y metadatos de posiciones del mismo universo.

Las consultas utilizaron campos seleccionados de instrumentos. No se han consultado cuentas, carteras personales o colecciones de clientes. La autenticación se utilizó en memoria, sin exportar credenciales. Los originales de asignación almacenados proceden del proveedor; no se han hecho nuevas peticiones a este.

## Disponibilidad comprobada

| Información | Origen BDB | Situación en Alfa / posibilidad |
|---|---:|---|
| Fichas de instrumentos del listado | 727 | 700; faltan 26 fondos y una acción |
| Fichas de fondos | 643 | 617 |
| Composición global original con seis componentes numéricos y suma del 100 % dentro de 0,001 puntos porcentuales | 641 fondos | Recuperable desde archivos originales; requiere conservar fecha, signo y tipo de exposición |
| Reparto de clases actualmente informado en Alfa | — | 524 fondos: 520 derivados del CSV y 4 recuperados previamente de BDB; otros 93 fondos con ficha carecen de reparto |
| Posiciones internas | 641 fondos, 124.322 filas en la maestra | Alfa tiene documentos para los mismos 641; dos declaran truncamiento. La copia previa descartó el tipo de instrumento |
| Sectores | Disponibles para 447 fondos ya presentes en Alfa | Sus campos de sectores están vacíos en Alfa |
| Regiones de la parte de bolsa | Disponibles para 465 fondos ya presentes en Alfa | Sus campos de regiones están vacíos en Alfa |
| Comisión de gestión | 641 fondos | Ninguna ficha de fondo de Alfa tiene campos de costes poblados |
| TER | 639 fondos | Recuperable conservando su definición y unidad |
| Gastos corrientes MiFID | 630 fondos | Recuperables sin sumarlos al TER o a la gestión como si fueran costes independientes |
| Duración efectiva de renta fija | 179 fondos | Posible ampliación descriptiva |
| Distribución crediticia | 221 fondos | Posible ampliación descriptiva |
| Distribución de vencimientos | 327 fondos | Posible ampliación descriptiva |

“Disponible” significa presente con datos numéricos en la fuente, no validación económica integral ni garantía de actualidad. Sectores y regiones tienen su propio denominador: un reparto de la parte de bolsa no es automáticamente un reparto de todo el fondo.

La lectura completa de posiciones reunió 617 documentos `latest` y 24 manifiestos con 70 fragmentos. Sus recuentos coinciden con las 124.322 filas recuperadas. No basta con leer únicamente `latest`. El `holdings_count` de Alfa representa el tamaño original incluso cuando se trunca; no debe confundirse con el número de filas realmente conservadas.

## Errores y pérdidas identificados

### 1. Alfa transforma una categoría en una composición

En `scripts/mercado-alfa/proyecta.mjs`, `exposicionesPorClase()` convierte `EQUITY`, `FIXED_INCOME` o `MONEY_MARKET` en 100 % de esa clase. Su procedencia se marca `csv-clase`.

Eso describe una categoría general, pero no acredita que el fondo carezca de liquidez, derivados o posiciones de otra naturaleza. De los 520 repartos así construidos, 512 difieren en más de 0,01 puntos porcentuales de algún componente del reparto original disponible en caché. Es una comparación con el último archivo local disponible, no una afirmación sobre la cartera actual del fondo.

El importador principal no incorpora los fundamentales de fondos de BDB: deja costes vacíos y añade un aviso de ausencia de sectores y regiones en EODHD. El importador posterior de posiciones no enriqueció esos otros campos. Por tanto, NUVIA es una combinación de fuentes y proyecciones parciales, no una copia completa de BDB.

### 2. El extractor puede sobrescribir la bolsa mundial con la estadounidense

En `1-extractor/fetchers/morningstar.py`, el bloque de `allocationMap` busca la palabra `equity` y guarda `candidatos[clase] = datos`. Tanto `AssetAllocNonUSEquity` como `AssetAllocUSEquity` se traducen a `rv`: el segundo sobrescribe el primero en lugar de sumarlos. Además, acepta el resultado si suma entre 80 y 120 %, lo que permite reemplazar un reparto completo del snapshot por uno parcial.

El archivo original contiene también `globalAllocationMap`, con el total global explícito. Es la vía preferible para una proyección corregida, manteniendo sus seis componentes y los datos netos/largos/cortos.

**FONDIBAS, ISIN ES0138936036, fecha de cartera 30-06-2026:**

| Componente | Original guardado |
|---|---:|
| Bolsa estadounidense | 4,48679 % |
| Bolsa fuera de EE. UU. | 16,23573 % |
| Bolsa total | **20,72252 %** |
| Renta fija | 76,39175 % |
| Liquidez | 2,88573 % |
| Total | **100 %** |

`data/funds/ES0138936036.json` conserva solo el 4,48679 % de bolsa. El snapshot original y `sal_allocationMap.json` sí contienen el 20,72252 %. La suma de posiciones internas confirma 20,72251 %, una diferencia de redondeo de 0,00001 puntos. La corrección previa de NUVIA a partir de posiciones coincide con el original dentro de ese redondeo.

Entre los 608 fondos cuyas fechas de cartera coinciden entre el archivo original de asignación y `data/funds`, hay 82 discrepancias de bolsa superiores a 0,01 puntos. Son casos para conciliación; no se atribuyen todos automáticamente al mismo defecto.

### 3. La plataforma transforma faltantes en «otros»

`2-plataforma-datos/src/ingestion/fondosdb/fondosDbMapper.ts`, `normalizePortfolioExposure()`, añade a `other` la diferencia hasta uno cuando la suma es inferior al 98 %. Registra la marca `EXPOSURE_RESIDUAL_IMPUTED`.

Hay 56 fondos del universo con esa marca. En FONDIBAS, la diferencia de bolsa perdida termina etiquetada como «otros». Esa etiqueta tiene una causa técnica y no representa una posición real en otra clase. No debe convertirse directamente en una exposición financiera de NUVIA.

### 4. Las fechas del documento y de la cartera no son equivalentes

El adaptador BDB obtiene `report_date` prioritariamente de la fecha de rentabilidad; no es necesariamente la fecha de posiciones o de asignación. En 462 de las 641 asignaciones completas, la fecha del original difiere de `source_metadata.report_date` de la maestra.

Las asignaciones originales revisadas van de diciembre de 2024 a julio de 2026: 21 son de 2025 o anteriores, 438 de enero-mayo de 2026 y 182 de junio-julio de 2026. La importación debe conservar la fecha propia de cada bloque. La fecha de descarga no rejuvenece la cartera.

## Qué queda realmente por obtener

No aparece un reparto global completo utilizable en los archivos originales consultados para:

- **LU1814994353**, Azvalor Lux SICAV Altum Faith – Consistent Equity R: hay archivo de asignación, pero sus seis componentes no están completos.
- **ES0127097030**, DUX Rentinver Renta Fija FI: no hay archivo `sal_allocationMap` ni posiciones internas en las rutas consultadas. Sí hay un histórico local de valor liquidativo hasta 01-06-2026.

De los **26 fondos sin ficha en Alfa**:

- **10** tienen series con puntos reales en la base maestra. Los recuentos declarados coinciden con los puntos y sus valores son positivos. Esto verifica existencia y formato básico; faltan controles de identidad, continuidad, ajustes y frecuencia antes de importarlas.
- **2 adicionales** tienen histórico local en el extractor: Carmignac Emerging Patrimoine E, LU0592699093 (hasta 11-03-2024), y DUX Rentinver, ES0127097030 (hasta 01-06-2026).
- **14** no tienen serie en las rutas `price_series` de la maestra ni fichero `data/history_vl/{ISIN}.jsonl` consultado. Necesitan localizar otra fuente/identidad o una nueva extracción. No se ha concluido que no existan en ninguna fuente externa.

| Fondo ausente con serie en la maestra | Último punto encontrado |
|---|---|
| AB American Growth · LU0232524495 | 09-09-2026 |
| Capital New Economy · LU2050929277 | 09-06-2026 |
| Capital New World · LU1481179858 | 09-06-2026 |
| Carmignac Investissement E · FR0010312660 | 08-01-2026 |
| Polar Artificial Intelligence · IE00BF0GL212 | 18-06-2026 |
| Polar Global Insurance · IE00B52VLZ70 | 22-05-2026 |
| Polar Healthcare Opportunities · IE00B3NLSS43 | 08-06-2026 |
| Amundi EM Corporate High Yield · LU1882457739 | 28-11-2025 |
| Global Evolution Frontier · LU0501220429 | 21-10-2025 |
| Mutuafondo · ES0165237001 | 13-07-2026 |

La acción ausente es Siemens Gamesa, ES0143416115. La maestra conserva histórico hasta 08-02-2023; la existencia de ese historial no justifica tratarla como cotización actual.

## Relación con el mapa de riesgo y retorno

Recuperar datos y poder representar cualquier fondo en el modelo actual son problemas distintos.

De los 641 repartos originales completos, 144 contienen algún componente neto negativo y 309 tienen peso positivo en otros, convertibles o preferentes; los grupos se solapan. No son automáticamente errores. Se han observado posiciones de peso negativo en 392 desgloses completos de la maestra.

Solo 263 repartos cumplen la condición conservadora de componentes no negativos, suma del 100 % dentro del redondeo y ausencia de esas otras exposiciones. Esta cifra indica compatibilidad aritmética con las clases simples, no una validación del modelo financiero ni una garantía de actualidad. Entre los 93 fondos con ficha de Alfa pero sin reparto, cuatro entrarían en ese grupo con la recuperación; otros requieren un tratamiento más amplio.

Por tanto, prometer que una copia hará aparecer todos los puntos sería incorrecto. La propuesta es:

1. Recuperar y mostrar la composición real, con sus exposiciones adicionales y signos.
2. Mantener una distinción visible entre composición observada e hipótesis del modelo de perfiles.
3. Diseñar el tratamiento de derivados/otras exposiciones antes de atribuirles supuestos. Una vista histórica basada en series reales puede complementar el análisis, con sus propios perfiles históricos comparables, sin mezclar ese resultado con retornos hipotéticos de largo plazo.

Esta auditoría no introduce restricciones ni retira funciones.

## Plan de recuperación propuesto

1. **Proyección corregida dentro de NUVIA.** Leer la maestra y los originales autorizados del extractor. Priorizar asignación global explícita con fecha propia; conciliar con snapshot/posiciones. Tratar un componente desconocido como desconocido, sin convertirlo en cero o «otros» real. No modificar BDB para resolver la importación de Alfa.
2. **Una ficha enriquecida por ISIN.** Separar categoría del fondo, composición real, costes, regiones/sectores y perfil de renta fija. Guardar fuente, fecha del dato, fecha de extracción, método y estado de validación por bloque.
3. **Conservar todos los desgloses.** Recuperar también el tipo de instrumento, posiciones cortas y fragmentos. Usar almacenamiento fragmentado cuando haga falta, evitando perder las filas de los dos fondos truncados. Distinguir libro largo, neto y cobertura documental.
4. **Reconciliar las 26 fichas ausentes.** Importar históricos recuperables después de verificar identidad, divisa, frecuencia, duplicados, ajustes y fecha. Localizar fuente y símbolo correctos para los 14 casos sin serie encontrada. No sustituir silenciosamente una clase de fondo por otra.
5. **Generar un plan local revisable antes de escribir.** Comparación por campo entre estado actual y candidato; motivos de cambios y pendientes, sin mezclar redondeos con faltantes sustanciales. Respaldo de los documentos destino afectados y control de versión para no pisar actualizaciones concurrentes.
6. **Integrar la lectura del portal.** Hacer que composición, resumen, costes, solapamientos y mapa consuman la misma ficha enriquecida. Las actualizaciones de precios deben conservar los campos aportados por BDB; la protección local pendiente solo para fondos sin `asset_mix` no basta para los 520 repartos `csv-clase`.
7. **Validar antes/después y cerrar la recuperación.** Probar FONDIBAS, fondos de bolsa con liquidez, fondos de renta fija con convertibles, posiciones negativas, fechas diferentes, fragmentación, redondeo y verdaderos ausentes. Informar cuántos quedan completos y por qué quedan pendientes los demás.

La modificación del extractor BDB original, si se decide posteriormente, es una actuación separada: corregir la suma de bolsas, seleccionar explícitamente la taxonomía del snapshot, mantener la fecha por bloque y evitar que una respuesta parcial sobrescriba otra completa. No se ha realizado en esta revisión.

## Alcance y trazabilidad

Se han leído la definición, la arquitectura y el marco obligatorio de NUVIA. Esta auditoría no introduce un producto o cálculo nuevo: examina datos de instrumentos, sin circunstancias personales, recomendaciones, puntuaciones de atractivo, señales o ejecución. No se han importado perfiles de gestores, calificaciones comerciales ni contenidos narrativos de terceros. La disponibilidad técnica no acredita por sí sola derechos de redistribución; se debe conservar la procedencia y aplicar los controles de uso de datos del proyecto al preparar la importación, sin dar por obtenido un dictamen externo.

Evidencias locales en `output/auditoria-fuente-bdb-20260910/` y `output/recuperacion-fondos-bdb-20260910/`: fichas seleccionadas de ambas bases, posiciones de la maestra, manifiestos, 70 fragmentos, comparación por fondo, asignaciones originales proyectadas, copias previas de los documentos destino, resultado de escritura y verificación posterior. La primera comparación de posiciones recoge solo `latest`; el complemento incorpora los manifiestos para obtener el total de 641. Los scripts temporales de conexión y escritura se retiraron después de verificar el resultado, conforme a la separación de bases del proyecto.

No hace falta una contraseña, clave o fichero adicional del fundador para preparar esa recuperación: el acceso de lectura a BDB y a la maestra ha funcionado. Las posibles nuevas extracciones de los casos pendientes deberán partir de las fuentes y credenciales ya configuradas, sin copiarlas al frontend.
