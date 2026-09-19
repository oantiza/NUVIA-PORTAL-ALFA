# Informes de mercado · automatización con revisión humana · 19-09-2026

Orden del fundador: automatizar la generación y publicación de los informes diario y
semanal. Se automatiza todo salvo la decisión de publicar (§7 del marco: revisión humana
proporcional al riesgo).

## Flujo (`.github/workflows/informes-mercado.yml`)

1. **Borrador programado.** Diario de lunes a viernes a las 06:00 UTC; semanal los sábados
   a las 07:00 UTC; también a mano (*Actions → Informes de mercado → Run workflow*).
   `generar.mjs` con la clave del secret `GEMINI_API_KEY`. Si el borrador no pasa el
   contrato, el job falla y no hay PR.
2. **Contraste sin IA** (`scripts/informes-mercado/contrastar.mjs`): compara EUR/USD (BCE),
   Brent (EIA), bono EE. UU. 10 años (Tesoro) y, a título orientativo, la curva AAA del BCE
   frente al bono alemán; marca filas sin fuente primaria, sin contrastar o con patrones
   sospechosos (variantes de índice, cupón, rentabilidad de subasta). No corrige nada.
3. **Pull request** en `informe/<id>` con el contraste en la descripción, el JSON del
   borrador editable y la vista previa HTML como artefacto (14 días).
4. **Aprobación**: el propietario del repositorio comenta
   `/publicar <nota de revisión>`. La nota (mínimo 20 caracteres) pasa literal a
   `revision.nota`. Se ejecutan `publicar.mjs`, `test:informes` e `informes:check`; merge
   *squash* a `main` (el borrador no llega a `main`) y se lanza `pages.yml`.

Sin comentario del propietario, o sin nota, no se publica nada. Un PR que no se quiera
publicar (festivo, borrador malo) se cierra sin más.

## Requisitos de configuración (los hace el fundador)

- Secret `GEMINI_API_KEY` (clave de pago, restringida a Generative Language API).
- *Settings → Actions → General → Workflow permissions*: permitir que GitHub Actions cree
  pull requests.

## Prueba del §12 (cambios respecto a v2)

- Operación y evidencia: cada publicación queda ligada a un PR, un comentario del fundador
  con su nota y la ejecución del workflow.
- IA: la verificación automática no usa el modelo que redactó.
- Datos personales, Firebase, contenido y presentación: sin cambios.

## Verificación

`test:informes` 42/42; `contrastar.mjs` probado sin red con la edición semanal publicada y
referencias simuladas. La primera ejecución real (red de los runners hacia Gemini, BCE,
Tesoro y EIA) queda pendiente del primer disparo programado o manual.
