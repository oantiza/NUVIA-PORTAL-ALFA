# Módulo · Patrimonio

**Qué es:** la portada del espacio y sus páginas hijas: Vivienda y coste de vida, Jubilación (simulador multiterritorio, guías e informe imprimible), Impuestos (página y guías) y Planificación patrimonial. Mezcla contenido editorial con motores de cálculo; los motores viven en `js/` separados del texto.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | §1, §2.2, §3.6 arquetipos B, C y **F (guías y curso conservan su composición propia)**, §4 tono. |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | §3 (calcula y muestra; el usuario decide), §5 (lenguaje), §12. Un simulador muestra supuestos, fuentes, fechas y límites; nunca una recomendación ni un veredicto de idoneidad. |
| `docs/JUBILACION_MULTITERRITORIO_20261004.md` | Vigente: simulador y guías en cinco territorios (fase 1). |
| `docs/JUBILACION_FASE2_CCAA_20261005.md` | Vigente: escalas autonómicas de las 15 comunidades de régimen común. |
| `docs/JUBILACION_REDISENO_20260923.md` y `docs/JUBILACION_MULTITERRITORIO_REVISION_20261004.md` | Auditoría de cálculo y revisión de parámetros; leer antes de tocar el motor. |
| `docs/IMPUESTOS_DISENO_20260923.md` | Diseño vigente de Impuestos y de las guías. |

## Archivos de este módulo

**Páginas:** `patrimonio.html`, `vivienda.html`, `jubilacion.html`, `fiscalidad.html`, `guia-fiscal.html`, `guia-planificacion.html`, `guia-ahorro.html`, `guia-calendario.html`, `guia-sucesiones.html`, `guia-impuestos.html`, `temas.html?topic=planificacion-patrimonial`.

**Motores y comportamiento:** `js/nuvia-jubilacion-motor.js` (cálculo año a año), `js/nuvia-jubilacion-fiscal.js` (escalas por territorio), `js/nuvia-jubilacion-ui.js`, `js/nuvia-jubilacion-graficos.js`, `js/nuvia-jubilacion-informe.js` (informe imprimible), `js/nuvia-guias-jubilacion-ui.js`, `js/nuvia-simulador.js`, `js/nuvia-formularios.js`.

**Estilos propios:** `estilos/nuvia-jubilacion.css` (`.jub-`), `estilos/nuvia-retirement.css`, `estilos/nuvia-fiscal.css`, `estilos/nuvia-guias-fiscales.css`; Vivienda usa `.viv-` en `nuvia-pages-content.css`.

**Controles:** `scripts/check-patrimonio-entry.mjs`, `scripts/check-destinos-locales.mjs`.

**Pruebas:** `docs/nuvia-jubilacion-motor.test.mjs`, `nuvia-guias-jubilacion`, `nuvia-patrimonio-entry`, `nuvia-formularios`, `nuvia-page-hierarchy` (parte), `nuvia-navigation-cards` (parte), `nuvia-tables-results` (parte).

## Comprobación local

```powershell
npm run validate:patrimonio
```
Incluye motor y guías de jubilación, formularios y destinos, entrada de Patrimonio, jerarquía, tarjetas, tablas y lenguaje.

## Decisiones vigentes del fundador

- El simulador de jubilación permite elegir residencia fiscal: Bizkaia, Álava, Gipuzkoa, Navarra y estatal; las guías fiscal y de planificación se amplían igual (oct. 2026).
- Estatal por fases: primero escala autonómica de referencia (fase 1, publicada el 04-10-2026); después las 15 comunidades una a una (fase 2, `JUBILACION_FASE2_CCAA_20261005`).
- Ceuta y Melilla quedan fuera del selector mientras no se modele la deducción del 60 % del art. 68.4 LIRPF.
- La deducción y el mínimo por edad se aplican desde el año en que se cumplen 65 y 75 años (edad a 31 de diciembre) en todos los territorios.
- Importes con decimales y foco centrado en los campos del simulador; informe imprimible en tres hojas A4.
- Las guías de Impuestos (calendario, ahorro, sucesiones) siguen el estilo de Jubilación.
- Imágenes de jubilación en etapa activa, nunca «muy de viejo».
- Plazos de Bizkaia según el calendario fiscal oficial de la DFB; las cifras fiscales se contrastan y se anotan en el registro antes de publicar.

## Historial de este módulo (contexto, no normativa)

`JUBILACION_DISENO_20260922`, `REDISENO_PORTADA_PATRIMONIO_20260922`, `ENTREGA_5A_1_ENTRADA_PATRIMONIO_20260902`, `REVISION_FORMULARIOS_ENLACES_20260902`, `ALINEACION_FORMULARIOS_20260904`, `FICHA_REGULATORIA_BANNER_PATRIMONIO`, `FICHA_REGULATORIA_VARIANTES_BANNERS_HOME`.
