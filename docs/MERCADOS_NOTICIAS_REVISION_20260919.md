# Mercados y noticias · cotizaciones reales, noticias variadas y franja de informes · 19-09-2026

Orden del fundador: aplicar la revisión propuesta de la pestaña «Noticias y contexto» de `mercados.html`.

## Cambios

1. **Cotizaciones de cierre en lugar del hueco de TradingView.** Nuevo `scripts/update-index-quotes.mjs` (`npm run indices:actualizar`): lee de Yahoo Finance (API pública de gráficos, sin clave) el último cierre, el anterior y el primer cierre del año de IBEX 35, EURO STOXX 50, DAX 40, S&P 500, Nasdaq Composite y Nikkei 225; calcula variación diaria y anual; escribe `data/index-quotes.json` y sustituye el bloque `NUVIA INDICES` de `mercados.html` (HTML estático, sin JavaScript). La tarjeta dice «Datos: Yahoo Finance · último cierre», con fecha, igual que hasta ahora decía «Información facilitada por TradingView». TradingView sigue disponible plegado («Ver el gráfico en directo») con el mismo consentimiento previo. Paso nuevo en `.github/workflows/pages.yml` (`continue-on-error`) y `indices:check` en `validate`.
2. **Noticias variadas.** `update-daily-news.mjs`: las tres breves cubren temas distintos entre sí y del destacado, alternan medio y rechazan titulares parecidos (umbral 0,35); si no hay suficientes, completa con las mejores restantes. Ilustración propia por tema (recursos ya aprobados de `src/assets/home`), documentada como decorativa. Se excluyen criptoactivos y se penalizan las «guías de valores» y «mejores acciones». La atribución «Titular de X…» sigue en los datos y en el diálogo; en la tarjeta la ocultan los estilos porque el medio y «Ampliar» ya lo dicen. Prueba `nuvia-news-editorial` adaptada (activo propio de NUVIA, al menos dos temas e ilustraciones distintas).
3. **Informes al pie de Noticias** como franja compacta (`.nv-reports-strip`): mismas tarjetas sincronizadas, sin entradilla y con menos altura.
4. **Ritmo**: la sección de índices y noticias lleva fondo suave (página → técnico) y menos aire sobre el título.

## Revisión interna

Yahoo Finance no es publicador de los índices; se declara en la tarjeta y no entra en los informes (que siguen exigiendo publicador de primera mano). Ninguna cifra se valora: el color solo marca el signo. Sin cambios en Firebase ni datos personales.

## Verificación

`indices:check`, `informes:check`, sitio estático, consistencia, lenguaje, estilos, disposición, tipografía, avisos, contenido externo, sistema editorial y entrada de Economía en verde; revisión visual a 1440 px. Pendiente `npm run build` en el equipo del fundador.
