# Módulo · Mi cartera y Análisis y valoración de empresas

**Qué es:** la parte de NUVIA que es **software y datos**, no contenido: el laboratorio de cartera (`cartera.html`), la copia local del módulo de empresas (`company-analysis/`), la base propia de la alfa en Firebase (`nuvia-family-wealth`), el universo de instrumentos y los scripts de carga desde EODHD. Concentra la mitad de las pruebas del proyecto y la mayor exposición regulatoria. Es el único candidato a independizarse algún día como aplicación aparte.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | **Entero.** En particular §3 (tres capas separadas), §4 (métodos permitidos del laboratorio), §5 (lenguaje), §6 (empresas, emisores e instrumentos), §11 (datos personales), §12, §13 (puertas de control), §14 (controles técnicos). |
| `docs/ORDENES_PERMANENTES_FUNDADOR_ALFA_20260903.md` | Entera. |
| `docs/BASES_ANALISIS_CARTERA.md` | Bases funcionales de la sección de análisis. |
| `docs/IMPLEMENTACION_ANALISIS_CARTERA.md` | Guía de implementación (77 KB; consultar por secciones). |
| `docs/FICHA_REGULATORIA_ALFA_BASE_PROPIA.md` | Ficha de la base propia de la alfa (clasificación ÁMBAR; validación jurídica fuera del alcance de la alfa por orden del fundador). |
| `docs/FICHA_REGULATORIA_EMPRESAS_BASE_PROPIA.md` y `docs/FICHA_REGULATORIA_ANALISIS_EMPRESAS.md` | Fichas del módulo de empresas. |
| `docs/INFORMACION_TECNICA_ALFA_20260903.md` | Cómo funciona la alfa (datos, lectura pública, carteras en el navegador). |
| `docs/PASO_LOCAL_GUARDADO_CARTERAS_20260902.md` | Protección de las carteras guardadas en el navegador (clave `nuvia.carteras-visitante.v1`). |
| `universo/universo-alfa.LEEME.md` | Universo de la alfa y cómo se marca `incluir`. |
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | §1, §3 (tokens: `--nv-positive`/`--nv-negative` solo para magnitudes; el color nunca califica una inversión), §5. |

## Archivos de este módulo

**Páginas:** `cartera.html` (`#laboratorio`, `?vista=companies`).

**Laboratorio de cartera (`js/`):** `nuvia-datos.js`, `nuvia-cartera.js`, `nuvia-constructor.js`, `nuvia-analisis.js`, `nuvia-concentracion.js`, `nuvia-solapamiento.js`, `nuvia-resumen-cartera.js`, `nuvia-periodo-analisis.js`, `nuvia-modelos.js`, `nuvia-informe.js`, `nuvia-mapa.js`, `nuvia-mapa-historico.js`, `nuvia-mapa-siluetas.js`, `nuvia-buscador.js`, `nuvia-cuenta.js`, `nuvia-estados.js`, `nuvia-etiquetas.js`, `nuvia-identidades.js`, `nuvia-guardado-local.js`.

**Módulo de empresas:** `company-analysis/` (copia independiente: `src/`, `alfa/`, `local/`, `public/`, paquete y compilación propios; `npm run build:company-analysis`). No se modifica ni publica el programa fuente original.

**Datos y base propia:** `universo/universo-alfa.csv` (725 instrumentos en euros; esquema `nuvia-alfa-asset.v1`), `scripts/mercado-alfa/` (`run.mjs`, `eodhd.mjs`, `firestore-rest.mjs`, `publicable.mjs`, `proyecta.mjs`, `universo.mjs`, `identidades.mjs`, `model-etfs.mjs`, `ohlcv-load.mjs`, `desgloses-bdb.mjs`, `enriquecimiento-bdb.mjs`), `scripts/load-*.mjs`, `scripts/prepare-company-alpha.mjs`, `scripts/migrate-company-identities.mjs`, `scripts/official-observations.mjs`, `scripts/update-ecb-risk-free.mjs`, `firebase.json`, `firestore.rules`, `.firebaserc`.

**Controles:** `scripts/check-company-*.mjs`, `scripts/check-alpha-*.mjs`, `scripts/check-model-*.mjs`, `scripts/check-institution-controls.mjs`, `scripts/check-ohlcv-preparation.mjs`, `scripts/reglas-alfa-local.mjs`, `scripts/sin-maestra.mjs`.

**Estilos:** `estilos/nuvia-pages-cartera.css`; `company-analysis/src/theme*.css`, `company-analysis/src/alfa/theme.css`.

**Pruebas:** todo `npm run test:analisis` (cartera, solapamiento, concentración, datos, constructor, resumen, cuenta, análisis, mapa, informe, modelos, etiquetas, mercado-alfa, fase 1, modelos-disponibilidad, guardado-local, interfaz-local, periodo-analisis, fundamentales-alfa, official-observations), `npm run test:reglas` (reglas de Firestore), `docs/ecb-risk-free.test.mjs`, `docs/nuvia-fase1.test.mjs` (crea y borra sus zonas temporales en `output/`).

## Comprobación local

```powershell
npm run validate:cartera
```
Equivale a `npm run test:analisis` (laboratorio y empresas completos) + `npm run test:reglas` (reglas de Firestore sin emulador) + lenguaje. `npm run test:fundamentales-alfa` ejecuta solo empresas.
`npm run build:company-analysis` compila la copia local; `scripts/check-company-alpha-render.mjs` la comprueba en `dist/`.

## Reglas fijas (ampliación de la capa 0 de `AGENTS.md`)

- Ninguna relación con `bbdd-activos-financieros` ni con `nuvia-market-data`. La alfa vive en `nuvia-family-wealth` (Firestore europe-west1, plan gratuito, lectura pública sin cuentas).
- Precios y fichas siempre de EODHD con la clave del fundador, que vive como variable de entorno en su PC. Ningún secreto en el repositorio.
- Nunca escribir en Firebase sin orden expresa. Las cargas autorizadas tienen su acta en `docs/CARGA_*`.
- Sin rating, ranking, recomendación, señal, precio objetivo, idoneidad, ejecución ni derivación. Los datos ausentes se declaran, no se estiman.
- Los ratios de empresas (PER, ROE, ROA, márgenes, crecimientos, P/VC, P/Ventas, EV/Ventas, EV/EBITDA) sí entran (decisión 03-09-2026).
- Máximo Sharpe, mínima volatilidad y frontera eficiente se muestran como métodos académicos, nunca como recomendación.
- Las carteras del visitante se guardan solo en su navegador; no hay cuentas ni registro.
- Ficha regulatoria antes de programar cualquier función nueva, como documento de consulta para el fundador.

## Historial de este módulo (contexto, no normativa)

Entregas y actas de septiembre de 2026 sobre base propia, fundamentales, OHLCV, dividendos, identidades, modelos y cierre de la alfa: `PLAN_ALFA_BASE_PROPIA_NUVIA_20260902`, `ANALISIS_BASE_DATOS_PROPIA_NUVIA_20260902`, `INFORME_PARA_CODEX_BASE_DATOS_ALFA_20260902`, `FASE_0/1/2_*`, `CARGA_*`, `CONTRASTE_*`, `PARIDAD_*`, `PASO_1/2/3_*`, `RECUPERACION_*`, `REACTIVACION_*`, `INTEGRACION_*`, `PREPARACION_OHLCV_*`, `AUDITORIA_LABORATORIO_CARTERA`, `PLAN_REDISENNO_LABORATORIO_CARTERA`, `AUDITORIA_FUENTE_BDB_20260910`, `MAPA_HISTORICO_CARTERA_20260910`, `FICHA_RESUMEN_CARTERA_20260909`, `RENOVACION_MODELOS_AUTORIZADA_20260909`, `FICHA_REGULATORIA_ESTOCASTICO_20260910`, `CORRECCION_COBERTURA_MAPA_20260910`. Lista completa en `docs/INDICE.md`.
