# Módulo · Academia NUVIA y Lecturas con Criterio

**Qué es:** dos espacios editoriales de formación y lectura. Academia reúne lecciones, cursos, fundamentos, activos, el simulador de interés compuesto y el glosario; Lecturas es la biblioteca con criterio editorial propio. Se tratan juntos porque comparten forma de trabajo (publicar y ordenar contenido) y porque ninguno tiene motores de cálculo financieros más allá del interés compuesto.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | §1, §2.2 (mapa de Academia y Lecturas), §3.6 arquetipos B, C, D y **F (curso)**, §4 tono, §5 (vídeos), §7 («no se rediseña Lecturas con el patrón de los demás espacios»). |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | §3, §5 (lenguaje), **§10 (publicidad, monetización e independencia: sin afiliación ni derivación comercial en las lecturas)**, §12. |
| `docs/PIB_REVISION_20260915.md` | Modelo vigente de lección de Conocimientos esenciales. |
| `docs/ENTREGA_5A_4_ITINERARIO_ACADEMIA_20260902.md` y `docs/ENTREGA_5A_5_LECTURAS_CRITERIOS_CATALOGO_20260902.md` | Itinerario de Academia y criterios del catálogo de Lecturas (base de lo construido). |

## Archivos de este módulo

**Páginas:** `academia.html` (vistas `?tab=…`: Conocimientos esenciales, Cursos, Fundamentos, Activos, Interés compuesto, Glosario), `curso.html`, `lecturas.html`.

**Contenido:** `src/assets/education/`, `src/assets/lecturas/`, `src/assets/editorial/`.

**Estilos propios:** `estilos/nuvia-pib.css` (`.pib-`); el curso usa su composición propia en `nuvia-pages-foundations.css`; Lecturas conserva su diseño editorial en las hojas de página.

**Controles:** `scripts/check-academy-entry.mjs`, `scripts/check-family-review.mjs`, `scripts/check-readings-entry.mjs`, `scripts/check-form-controls.mjs` (curso).

**Pruebas:** `docs/nuvia-academy-entry.test.mjs`, `nuvia-academy-sin-intro`, `nuvia-family-review`, `nuvia-readings-entry`, `nuvia-academy-banner`, `nuvia-lecturas-banner`, `nuvia-external-content` (vídeos), `nuvia-form-controls` (curso).

## Comprobación local

```powershell
npm run validate:academia
```
Incluye entradas de Academia y Lecturas, revisión familiar, banners, vídeos, controles del curso y lenguaje.

## Decisiones vigentes del fundador

- Academia abre sin apertura audiovisual (`FICHA_REGULATORIA_INTRO_ACADEMIA`); las puertas de Academia llevan identidad visual y ornamento propios.
- Lecturas con Criterio conserva su diseño editorial; es la excepción expresa al patrón de portadas fotográficas.
- La lección del PIB es el modelo de Conocimientos esenciales: desde cero, con lenguaje llano.
- Sin afiliación, patrocinio ni derivación comercial en las lecturas.

## Historial de este módulo (contexto, no normativa)

`ACADEMIA_BANNERS_AULA_20260909`, `ACADEMIA_HERO_PANORAMICA_20260909`, `ACADEMIA_IMAGEN_APRENDIZAJE_20260909`, `FICHA_REGULATORIA_HERO_ACADEMY`, `FICHA_REGULATORIA_INTRO_ACADEMIA`, `FICHA_REGULATORIA_BANNER_LECTURAS`, `ENTREGA_4B_1_NAVEGACION_LECTURAS_20260902`, `VIDEO_QUE_ES_NUVIA_GUION_Y_COLOCACION_20260903`.
