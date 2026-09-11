# Informes de mercado · consulta al fundador y decisión

Fecha: 10-09-2026. Registro de la consulta previa exigida por `AGENTS.md` §0 y por
`docs/MARCO_REGULATORIO_OBLIGATORIO.md` §13 (puertas de control antes de diseñar y antes de
programar). Este documento recoge la consulta y la respuesta del fundador. No la firma ni la
ratifica por él.

## Encargo

Integrar en NUVIA un informe diario y otro semanal en la sección «Informes de mercado» de
Mercados y noticias, elaborados mediante búsqueda en internet, visibles en la página y
descargables. Sin acceso al correo electrónico ni a ninguna otra fuente personal.

## Evidencia presentada

En `C:/Users/oanti/Proyectos/BDB/3-BDB-ACTIVOS_app` existe un generador de informes de
estrategia que ya funciona con esa mecánica: una fase de documentación con búsqueda en Google
y una segunda de redacción sin buscador, sobre la base factual de la primera. Portarlo tal
cual a NUVIA chocaba con el marco regulatorio en cuatro puntos:

| Elemento del informe de BDB | Norma |
|---|---|
| `assetAllocation` con pesos tácticos y vistas Positiva/Neutral/Negativa | §5, prohibidos los rankings por mérito inversor; §7, la IA no elabora carteras «adecuadas» |
| `marketTemperature` Bullish/Neutral/Bearish | §5, prohibidas las puntuaciones o semáforos de atractivo financiero |
| Autoría «Comité de Inversiones», procedente de la actividad bancaria | §8, no se reutilizan datos de la actividad bancaria ni se induce a creer que el banco supervisa el contenido |
| Publicación automática por cron, sin lectura previa | §7, revisión humana proporcional al riesgo |

Se añadió una quinta consideración: la propia sección de `mercados.html` promete por escrito
que «esta sección se publicará cuando exista una edición revisada» y que «no se presenta como
diario ningún contenido que no haya sido actualizado y revisado». Publicar sin revisión
contradecía el texto visible de la página.

La mitad factual del informe —cierres, datos macro publicados, decisiones de bancos centrales
y agenda, con cifra, unidad, fecha y fuente— sí encaja: es literalmente lo que el §5 enumera
como permitido.

No se propuso ningún bloqueo. Se presentaron opciones para que decidiera el fundador, conforme
a la orden de 03-09-2026.

## Decisión del fundador

1. **Contenido**: edición propia de NUVIA, solo factual. Sin asignación de activos, sin vistas
   y sin termómetro de mercado.
2. **Publicación**: borrador que el fundador revisa y publica. Nada se publica solo.
3. **BDB**: su informe de estrategia se mantiene aparte, con su asignación táctica, que en ese
   producto sí corresponde.

## Lo construido

- `scripts/informes-mercado/contrato.mjs` — contrato `informe-mercado.v1` y su validación. Es
  la barrera técnica que pide el §7: rechaza los campos del informe de BDB y veta el
  vocabulario que convierte una descripción en un consejo, en todo el texto publicable y no
  solo en el cuerpo.
- `scripts/informes-mercado/prompts.mjs` — instrucciones de sistema alineadas con el marco.
- `scripts/informes-mercado/gemini.mjs` — cliente con dos listas de modelos, una por fase, y
  descarte del modelo que responde sin haber buscado.
- `scripts/informes-mercado/generar.mjs` — `npm run informe:generar -- --tipo diario|semanal`.
  Escribe un borrador en `output/informes-borrador/`, fuera del control de versiones y fuera
  del sitio compilado.
- `scripts/informes-mercado/publicar.mjs` — `npm run informe:publicar -- --id <identificador>`.
  Revalida, escribe `data/informes-mercado.json` y la versión descargable en
  `core/downloads/informes/`. Ejecutar este comando es la revisión humana.
- `mercados.html` y `web2-integration.js` — la sección se sirve en estado de espera y solo se
  destapa cuando hay una edición publicada. Cualquier fallo deja la página como estaba.
- `scripts/informes-mercado/fuentes.mjs` — política de procedencia de las fuentes.
- `docs/nuvia-informes-mercado.test.mjs` — 18 pruebas, la mayoría negativas, incorporadas a
  `npm run validate`.

## Lo que queda fuera y por qué

- **No hay cron.** Ninguna tarea programada publica por su cuenta. Añadirlo requeriría una
  decisión expresa y reescribir el texto de la sección.
- **No se reutiliza dato alguno de la actividad bancaria.** El informe se documenta con
  búsquedas públicas; no lee la base de BDB ni ninguna cuenta.

---

## Corrección del 10-09-2026, por orden del fundador

La primera edición de prueba destapó dos defectos y se han corregido:

1. **Los enlaces de las fuentes no servían.** El buscador no devuelve la dirección de la
   fuente, sino una redirección propia (`vertexaisearch.cloud.google.com/grounding-api-redirect/…`)
   que oculta el destino y **caduca**: una de dos horas antes ya devolvía 404. Ahora se
   resuelven al generar, mientras siguen vivas, y la que no se resuelve se descarta. El
   contrato rechaza cualquier informe que aún lleve una de esas direcciones.
2. **Las fuentes eran de mala calidad.** Doce citas para una decisión del BCE y ninguna del
   BCE. Se ha añadido `scripts/informes-mercado/fuentes.mjs`, que veta brókeres, plataformas
   de negociación y portales de recomendaciones (§10, independencia), coloca delante a quien
   publica el dato de primera mano con su nombre legible, y acota la cola secundaria a cuatro.
   El contrato exige ahora **al menos una fuente primaria**; si la documentación no la trae, se
   repite una vez con búsquedas dirigidas (`site:`) antes de descartar el informe.

Resultado medido tras el cambio: seis fuentes, encabezadas por la nota de prensa del BCE y la
publicación del IPP de la Oficina de Estadísticas Laborales de Estados Unidos, todas con
dirección real y comprobable.

## Actualización del 11-09-2026

La [revisión e integración de los dos informes](REVISION_INFORMES_20260911.md)
actualiza el funcionamiento técnico descrito arriba. Ejecutar el programa de
incorporación **no acredita una revisión humana**: escribe los archivos locales y
sincroniza su presentación, sin desplegarlos por sí mismo. El lector permite
consultar ambas ediciones y descargar sus documentos con el diseño de NUVIA.
La decisión del fundador sobre la lectura previa a la publicación pública se conserva.
