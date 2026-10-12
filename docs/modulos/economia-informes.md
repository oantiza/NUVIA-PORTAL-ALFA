# Módulo · Economía y Finanzas: portada, mercados e informes

**Qué es:** la portada del espacio, la página de Mercados y noticias, y los informes diario y semanal de mercado (generación con Gemini, contraste sin IA, revisión humana y publicación). Cartera y Empresas pertenecen al espacio pero son otro módulo: `docs/modulos/cartera-empresas.md`.

## Lectura obligatoria para trabajar aquí

| Documento | Qué leer |
|---|---|
| `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` | §1 reglas de oro, §2.2 (mapa del espacio), §3.6 arquetipos B y C, §4 tono, §5 contenido externo. |
| `docs/MARCO_REGULATORIO_OBLIGATORIO.md` | §3 (calcula y muestra, el usuario decide), §5 (lenguaje: prohibido valorar, recomendar o poner semáforos), **§7 (inteligencia artificial: revisión humana proporcional al riesgo)**, §12. |
| `docs/POLITICA_EDITORIAL_NOTICIAS_MERCADOS_20260902.md` | Entera: criterios de selección y presentación de noticias. |
| `docs/INFORMES_MERCADO_AUTOMATIZACION_20260919.md` | Flujo vigente de borrador → contraste → `/publicar`. |
| `docs/INFORMES_MERCADO_V2_1_PRESENTACION_20260918.md` | Diseño vigente de los informes (sustituye a `INFORMES_MERCADO_V2_20260914`). |
| `scripts/informes-mercado/contrato.mjs` | El contrato que todo informe debe cumplir; es código y norma a la vez. |

## Archivos de este módulo

**Páginas:** `economia.html`, `mercados.html` (`?vista=informes`, noticias, cotizaciones).

**Datos:** `data/daily-content.json` (noticia e indicadores de portada), `data/index-quotes.json` (cierres de índices), `data/informes-mercado.json` (índice de ediciones), `data/ecb-estr.json`; informes publicados en `src/assets/reports/`, imágenes en `src/assets/markets/` y `src/assets/home/`.

**Generación y publicación de informes:** `scripts/informes-mercado/` (`generar.mjs`, `gemini.mjs`, `prompts.mjs`, `contrato.mjs`, `contrastar.mjs`, `fuentes.mjs`, `curvas.mjs`, `plantilla-html.mjs`, `publicar.mjs`, `sincronizar.mjs`), `.github/workflows/informes-mercado.yml` (diario L–V 06:00 UTC, semanal sábado 07:00 UTC; publica solo tras el comentario `/publicar` del fundador con nota de revisión).

**Portada y noticias:** `scripts/update-daily-news.mjs`, `scripts/update-index-quotes.mjs`, `scripts/update-macro-data.mjs`, `scripts/news-editorial.mjs`, `scripts/check-economia-entry.mjs`.

**Render:** `js/nuvia-market-reports.js`, `js/nuvia-market-reports-render.mjs`, `estilos/nuvia-market-reports.css` (enlazada solo en `mercados.html` y `economia.html`, tras `nuvia-pages.css`; los informes descargables la incrustan desde `scripts/informes-mercado/plantilla-html.mjs`, que declara además su propio `@page` A4). Si cambia la hoja o la plantilla, las dos ediciones vigentes de `core/downloads/informes/` deben regenerarse (`test:informes` lo exige).

**Pruebas:** `docs/nuvia-informes-mercado.test.mjs`, `nuvia-news-editorial`, `nuvia-news-selection`, `nuvia-economia-entry`.

## Comprobación local

```powershell
npm run validate:economia
```
Incluye índice de ediciones, cierres de índices, contrato de informes, selección y maqueta de noticias, entrada de Economía y lenguaje.
Generar un borrador a mano: `npm run informe:generar` (necesita la clave de Gemini como variable de entorno; nunca en el repositorio).

## Decisiones vigentes del fundador

- Informes dignos de un profesional pero legibles por cualquiera; la audiencia es el lector final, no el profesional.
- En tablas y gráficos de mercado, verde y rojo **solo en la cifra**: una subida o bajada es un hecho, no un juicio. Nada de valoraciones, semáforos ni «atractivo» (14-09-2026).
- El diario no lleva bloque de mercados. El semanal lleva cuatro fichas en dos filas: curvas de tipos BCE y Tesoro de EE. UU. arriba; euro/dólar y petróleo abajo (18-09-2026).
- Mercados y agenda se presentan de forma clara y atractiva para un lector novel, no como tablas de datos; KPIs sin tamaño excesivo (18-09-2026).
- Antes de publicar, contraste real de cifras contra fuentes primarias; la nota de `revision` refleja lo corregido. No se inventa la nota ni se relaja la prueba que la exige.
- Automatización con la API de Gemini aprobada y subida a `main` (19-09-2026); la decisión de publicar sigue siendo humana.
- Mercados muestra hasta doce noticias en maqueta editorial, sin bloque de informes (22-09-2026).

## Historial de este módulo (contexto, no normativa)

`INFORMES_MERCADO_CONSULTA_20260910`, `REVISION_INFORMES_20260911`, `INFORMES_MERCADO_V2_20260914`, `INFOGRAFIAS_INFORMES_20260917`, `MERCADOS_NOTICIAS_REVISION_20260919`, `MERCADOS_NOTICIAS_EDITORIAL_20260922`, `REDISENO_PORTADA_ECONOMIA_20260918`, `CIERRE_ENTREGA_3A_NOTICIAS_MERCADOS_20260902`, `FICHA_REGULATORIA_SISTEMA_EDITORIAL_ENTREGA_3_20260902`, `ENTREGA_5A_2_ENTRADA_ECONOMIA_FINANZAS_20260902`.
