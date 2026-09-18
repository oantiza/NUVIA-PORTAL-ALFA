# Economía y Finanzas · Rediseño ligero de la portada

Fecha: 18-09-2026.

Orden del fundador: reducir la desproporción del bloque de informes diario y semanal (que siguen destacando, sin exagerar) y dar vida a las tres tarjetas de ámbitos, que quedaban vacías sobre fondo blanco, con una imagen coherente y poco llamativa.

## Cambios

- `estilos/nuvia-pages-content.css`: el bloque `.nv-report-lead` reduce escala (relleno 30/32 px y 26/28 px, título 28 px, texto 16/14 px, cifras 22 px, fecha 14 px, subtítulo 18 px — todo dentro de la escala 12/14/16/18/22/28/36, separaciones más cortas, ornamento más pequeño). Misma estructura, mismos tokens y misma jerarquía diario/semanal. El HTML entre los marcadores `NUVIA INFORMES destacado` no cambia; el pipeline de publicación sigue igual.
- `estilos/nuvia-components.css`: nueva variante `.nv-space-tool-card--photo` con banda superior `.nv-space-tool-card__media` (164 px en escritorio, 140 px en tablet), velo azul NUVIA al 14–34 %, saturación reducida y zoom suave al pasar el cursor (desactivado con `prefers-reduced-motion`). El símbolo del ámbito se apoya sobre el borde de la imagen. La sección de ámbitos de Economía lleva un degradado suave `--nv-surface-page` → `--nv-surface-technical`.
- `economia.html`: las tres tarjetas incorporan la banda de imagen (decorativa, `alt=""`, `aria-hidden`, carga diferida).

## Imágenes

Tres imágenes generadas por el fundador con ImageGen (Codex) a partir de prompts acordados en la conversación: fotografía realista, paleta apagada azul/verde, sin logos, marcas ni texto legible, sin personas reconocibles en primer plano. Originales (JPEG 16:9) conservados en `output/imagegen/economia-card-*-20260918-original.jpg`, fuera de la publicación. Recorte central a 2:1 y conversión a WebP 1200 × 600, calidad 82:

- `src/assets/home/economia-card-mercados-20260918.webp`: sala de mercados con pantallas de gráficos ilustrativos y personas de espaldas.
- `src/assets/home/economia-card-cartera-20260918.webp`: tableta con gráfico de distribución de cartera y línea, planta y escritorio claro.
- `src/assets/home/economia-card-empresas-20260918.webp`: estados financieros impresos, pluma y gafas sobre escritorio.

Los gráficos y cifras de las imágenes son ficticios y no legibles; no representan datos de mercado ni emisores.

## Revisión interna

Clasificación: VERDE, cambio visual sin nuevas funciones. Imágenes decorativas sin emisores identificables, sin series de mercado reales, sin señales operativas ni recomendaciones. No se tocan datos, Firebase ni backend. Solo escritorio y tablet.

## Validación

- `shell:check`, `check-parity`, `check-static-site`, `check-consistencia`, `check-lenguaje` y las pruebas `page-styles`, `surfaces`, `navigation-cards`, `economia-entry`, `page-hierarchy`, `layout-foundations`, `typography-foundations` e `informes`: correctas.
- Revisión visual a 1440 y 1024 px con la copia local. Pendiente `npm run build` y auditoría de render completa en el equipo del fundador antes de publicar.
