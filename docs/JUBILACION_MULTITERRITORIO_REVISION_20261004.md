# Jubilación multiterritorio · despliegue y revisión de parámetros · 04-10-2026

Complementa `docs/JUBILACION_MULTITERRITORIO_20261004.md` (fase 1, elaborada con Fable 5.1). Recoge lo hecho desde la orden de commit: validación previa, commit, despliegue y revisión independiente de los parámetros fiscales contra fuentes oficiales.

## 1. Validación previa, commit y despliegue

| Paso | Resultado |
|---|---|
| Cambios pendientes | 15 archivos, todos de Jubilación (motor, nuevo `js/nuvia-jubilacion-fiscal.js`, simulador, guías, informe, pruebas, `check-render` y ficha) |
| `npm run test:jubilacion` | 30/30 |
| `npm run validate` | En verde; render de 45 páginas a 1440 px sin fallos, incluidas `jubilacion.html?territorio=navarra#resultados`, `jubilacion.html?territorio=estatal&ccaa=madrid` y `guia-fiscal.html?territorio=estatal&ccaa=referencia` |
| Incidencia | El primer commit falló por un bloqueo huérfano `.git/index.lock` (vacío, 14:30, probablemente de la sesión de Fable). Se comprobó que no había ningún proceso git activo y se retiró |
| Commit | `89fe68b` en `main`: «Jubilacion multiterritorio: Bizkaia, Alava, Gipuzkoa, Navarra y estatal (escala de referencia); simulador, guias e informes por territorio» (1.686 inserciones, 444 eliminaciones) |
| GitHub Actions | «Publicar NUVIA Portal Alfa en GitHub Pages»: `completed · success` |
| Producción | `jubilacion.html`, `guia-fiscal.html`, `guia-planificacion.html` y `js/nuvia-jubilacion-fiscal.js` (con Álava, Gipuzkoa y Navarra) sirven HTTP 200. La ficha de `docs/` da 404, como corresponde: `docs/` no se publica en `dist/` |

## 2. Revisión de parámetros contra fuentes oficiales

Fecha de consulta: 04-10-2026. Se revisaron los parámetros de mayor riesgo y se contrastaron con el código.

### 2.1 Navarra · correcto

| Parámetro | En el simulador | Fuente |
|---|---|---|
| Escala general | 13 % → 52 % en 11 tramos (4.458 … 334.344 €); sin cambios en 2026 | Art. 59 TR LF IRPF (DFL 4/2008); la LF 17/2025 no la modifica |
| Escala del ahorro | 20 / 22 / 24 / 26 / 27 / 28 % (6.000 / 10.000 / 15.000 / 200.000 / 300.000 €) | Art. 60 |
| Deducción por trabajo 2026 | 1.400 € hasta 12.500 €; 1.400 − 0,14 × (RNT − 12.500) hasta 17.500 €; 700 € hasta 35.000 €; baja a 400 € en 50.000 € | Art. 62.5, redacción de la LF 17/2025 (BOE-A-2026-3910) |
| Mínimo personal 2026 | 1.084 € + 264 € (65) / 585 € (75) + 1.280 € hasta 17.500 € de rentas, −0,0904 por euro hasta 30.000 € y de 150 € a 0 entre 30.000 y 32.000 € | Art. 62.9.a, LF 17/2025 |
| Rendimiento para los tramos | Sin la reducción del 40 % del art. 17.2 (el código usa el rendimiento bruto) | Último párrafo del art. 62.5 y concepto de rentas de la LF 17/2025 |
| Régimen transitorio | 40 % solo sobre aportaciones anteriores a 1-1-2018, cobro en el año de la contingencia o los dos siguientes | DT 25.ª, LF 16/2017 (BOE-A-2018-801) |
| Límite de aportación | 1.500 € y 30 % del RNT (50 % con más de 50 años) | Art. 55 |

### 2.2 Álava y Gipuzkoa · correcto

| Parámetro | Comprobación |
|---|---|
| Escala general 2026 | Idéntica a la de Bizkaia, con la deflactación del 2 % (primer tramo 18.080 €): Gipuzkoa NF 6/2025, Álava NF 21/2025 |
| EPSV en capital | Integración al 70 % en la primera prestación por contingencia: Gipuzkoa NF 1/2025, Álava NF 3/2025 |
| EPSV en renta | Exención de la rentabilidad con tope del 40 % de la renta (renta constante de 15 años o más) |

### 2.3 Estatal · correcto

| Parámetro | Comprobación |
|---|---|
| Escala del ahorro | 19 / 21 / 23 / 27 / 30 % (6.000 / 50.000 / 200.000 / 300.000 €), con el 30 % desde 2025 (arts. 66 y 76 LIRPF) |
| Escala de referencia | Art. 65 más escala estatal: 19 / 24 / 30 / 37 / 45 / 47 % |
| Mínimo del contribuyente | 5.550 € + 1.150 € (65) + 1.400 € (75), art. 57 |
| Rendimientos del trabajo | Gastos de 2.000 € y reducción del art. 20 (7.302 € hasta 14.852 €, nula desde 19.747,5 €) |
| Régimen transitorio | 40 % sobre aportaciones anteriores a 2007 (DT 12.ª) |

## 3. Hallazgos

### 3.1 Edad del incremento por mayores de 65 y 75 años · error

El modelo vasco (`deduccionEdad`: `edad <= 65` → 0) y el estatal (`minimoPersonalComun`: `edad > 65`) aplican el incremento **a partir de los 66 y de los 76**. Navarra (`edad >= 65`) lo aplica desde los 65.

Las fuentes oficiales fijan la edad a la fecha de devengo (normalmente el 31 de diciembre). Por tanto, el incremento se aplica ya en el año en que se cumplen 65 o 75:

- **AEAT:** las circunstancias personales se determinan a la fecha de devengo, y el manual práctico de Renta 2025 habla de contribuyentes de «edad igual o superior a 65 años».
- **Hacienda Foral de Bizkaia:** la FAQ 900006436 resuelve el caso de un contribuyente que fallece el 1 de julio y habría cumplido 65 el 8 de agosto. Le niega la deducción porque en esa fecha no tenía 65 años; con 65 cumplidos sí le correspondería. Álava y Gipuzkoa tienen el mismo artículo 83 con la misma redacción.

**Impacto:** un solo año (el de los 65 y el de los 75). En el estatal son 1.150 € de mínimo, unos 220 € de cuota. En el modelo vasco, hasta 393 € (o 714 €) de deducción.

**Origen:** el error viene del simulador original de Bizkaia, validado el 23-09. Corregirlo cambia en esas edades la regresión exacta de Bizkaia.

**Propuesta:** aplicar en los cinco territorios la regla de «edad cumplida a 31 de diciembre», actualizar la prueba de regresión de Bizkaia y añadir casos en el año de los 65 y de los 75.

### 3.2 Plazos de pago del rescate (Navarra y estatal) · ya hay fuente

La ficha los dejaba «En preparación». El art. 10 del Reglamento de planes y fondos de pensiones (RD 304/2004) fija dos plazos desde que el beneficiario presenta la documentación completa:

- La gestora debe notificar el reconocimiento del derecho en un máximo de **15 días hábiles**.
- Un **capital inmediato** debe abonarse en un máximo de **7 días hábiles**. En algunos planes de empleo de prestación definida puede ampliarse hasta 30 días hábiles.

**Propuesta:** completar la tramitación de Navarra y estatal en `js/nuvia-jubilacion-fiscal.js` con esta fuente y quitar el estado «En preparación».

### 3.3 Fuera de alcance (sin cambios)

- Ceuta y Melilla: falta modelar la deducción del 60 % del art. 68.4 LIRPF; siguen «en preparación».
- Gipuzkoa y Álava: deducciones de 2025 por aportaciones a sistemas de previsión de empleo (15–25 %). Afectan a la fase de aportación, no al cobro.
- Comunidades autónomas: fase 2.

## 4. Fuentes consultadas

- BOE · Ley Foral 17/2025 de Navarra: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-3910
- BOE · Ley Foral 16/2017 de Navarra (DT 25.ª): https://boe.es/boe/dias/2018/01/23/pdfs/BOE-A-2018-801.pdf
- AEAT · Manual práctico de Renta 2025, mínimo del contribuyente: https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-contribuyente.html
- AEAT · Manual específico para mayores de 65 años (Renta 2025): https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/manual-especifico-irpf-2025-personas-anos/minimos/minimo-personal-familiar.html
- Hacienda Foral de Bizkaia · Deducción por edad (Gure Gida): https://www.bizkaia.eus/ogasuna/guregida/fitxabisorea.asp?Idioma=CA&Tem_Codigo=7884&IdPublicoMostrar=986&IdPublicoMostrarAnterior=708
- Hacienda Foral de Bizkaia · FAQ 900006436 (fallecimiento y deducción por edad): https://www.bizkaia.eus/ogasuna/guregida/noticia.asp?Idioma=CA&IdNoticia=900006436&Tem_Codigo=7884
- RD 304/2004, art. 10 (redacción vigente): https://www.iberley.es/legislacion/df-4-ordenacion-supervision-solvencia-entidades-aseguradoras-reaseguradoras
- Garrigues · resumen de la NF 1/2025 de Gipuzkoa: https://www.garrigues.com/sites/default/files/noticias/files/gipuzkoa-publica-la-norma-foral-para-la-reforma-fiscal.pdf

Las fuentes secundarias (asesorías y medios especializados) se usaron solo para localizar la norma; cada parámetro se contrastó con el texto oficial o con el código.

## 5. Estado y pendientes

- Publicado en producción: commit `89fe68b`.
- Desde el commit no se ha modificado ningún archivo del repositorio.
- Pendiente de decisión del fundador: aplicar las correcciones 3.1 (edad) y 3.2 (plazos), con pruebas, ficha, validación y nuevo despliegue.

## 6. Nota de archivo (05-10-2026)

Documento recibido por el fundador fuera del repositorio y archivado en `docs/` el 05-10-2026 sin modificar su contenido. Las propuestas 3.1 (edad cumplida a 31 de diciembre) y 3.2 (plazos del art. 10 del RD 304/2004) fueron aprobadas por el fundador y aplicadas en el commit `78ebc49`; la decisión sobre Ceuta y Melilla (§3.3) fue dejarlas fuera del alcance. Detalle en el §7 de `docs/JUBILACION_MULTITERRITORIO_20261004.md`.
