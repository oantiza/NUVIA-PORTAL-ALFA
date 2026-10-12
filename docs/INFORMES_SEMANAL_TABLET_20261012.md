# Informe semanal · desbordes en tablet · 12-10-2026

**Módulo:** Economía y Finanzas · mercados e informes (`docs/modulos/economia-informes.md`).
**Orden del fundador:** corregir los desbordamientos previos del informe semanal en tablet, detectados en la revisión independiente del paso 5 de organización (`docs/REVISION_ORGANIZACION_20261012.md` y revisión del paso 5).

## Diagnóstico

`npm run auditar` sobre `mercados.html?vista=informes&tipo=semanal` a 900, 820 y 768 px daba diez desbordes (2, 3 y 5) en `.nv-report__tile--curva`, `.nv-report__tile-source` y, a 768 px, en la rejilla `.nv-report__tiles`.

Causa única: `.nv-report__citation { white-space: nowrap; }` (pensado para las citas en línea dentro del texto del informe) se aplicaba también a la cita de la fuente al pie de cada ficha. El título largo del publicador («Banco Central Europeo · curva de tipos del área del euro (deuda AAA)», 396 px) no podía partirse; desbordaba su párrafo, el párrafo desbordaba la ficha (396 + 20 px de relleno = 416) y a 768 px la ficha estiraba la rejilla.

## Cambio

`estilos/nuvia-market-reports.css`, una regla con ámbito de ficha:

```css
.nv-report__tile .nv-report__citation { white-space: normal; overflow-wrap: anywhere; }
```

Las citas en línea del texto conservan `nowrap`. Los dos descargables vigentes (`core/downloads/informes/diario-2026-09-14.html`, `semanal-2026-09-14.html`) se regeneran porque incrustan la hoja.

## Prueba §12 del marco

Cambio de presentación sin efecto en datos, cálculos, lenguaje ni fuentes: no se añaden instrumentos, opiniones, rankings, consejos, enlaces nuevos ni tratamiento de datos. Clasificación interna: verde. No constituye dictamen jurídico.

## Validación

- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 "mercados.html?vista=informes&tipo=semanal"`: siete anchos sin fallos (Chromium de Playwright, conexiones externas bloqueadas).
- `node scripts/check-render.mjs . 1024,820,768 "mercados.html?vista=informes,economia.html,mercados.html"`: sin fallos.
- Inspección visual de las cuatro fichas a 768 px: la cita se parte en dos líneas dentro de la ficha; el resto no cambia.
- `npm run validate:economia`: correcto (incluye `test:informes` 42/42 con la descarga regenerada e `informes:check`).
