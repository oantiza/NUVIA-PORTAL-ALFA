# NUVIA · Barra del ecosistema y pie con las cuatro webs

**Estado:** cambio local para revisión del fundador. Sin commit y sin publicación.

## Orden del fundador

El 22-11-2026 se le explicaron dos formas de pasar de una web a otra: una barra con las cuatro webs siempre a la vista o el desplegable «Explorar NUVIA» que había. Respuesta: **«ok a»** (la barra). Antes confirmó que la otra herramienta con la que retocó la portada había terminado de trabajar en la carpeta.

## Qué cambia

| Pieza | Antes | Ahora |
|---|---|---|
| Cambio de web | Desplegable «Explorar NUVIA» a la derecha de la cabecera | Barra azul noche de 46 px sobre la cabecera: Inicio NUVIA · las cuatro webs · Lecturas con Criterio, Colaboradores y Qué es NUVIA |
| Web en la que se está | Solo el nombre junto al logotipo | Además, su nombre en la barra con filete bronce (`data-eco-active`) |
| Pantallas de menos de 1240 px | Desplegable | La barra conserva Inicio y las cuatro webs; los tres accesos comunes siguen en el pie |
| Pie | Regreso, espacios comunes y criterios | Primera fila con las cuatro webs; el resto, igual |

No cambian el logotipo, el nombre de la web, el menú propio de cada web, los avisos del pie ni la portada general (que no lleva barra). «Cómo trabajamos» e «Independencia» se alcanzan desde el pie, como antes.

## Ficheros

- `scripts/ecosistema/shell.mjs`: `ecosystemBar()` sustituye a `ecosystemMenu()`; el pie añade `nav.web-footer-webs`.
- `estilos/ecosistema/webs.css`: estilos `.eco-bar*` y `.web-footer-webs`; se retiran los de `.eco-switch` (también en `interiores.css`).
- `js/nuvia-ecosistema.js`: se retira el cierre del desplegable y la barra entra en el recálculo de la página actual.
- 28 páginas regeneradas con `npm run shell:sync`.
- Pruebas: `docs/nuvia-navigation.test.mjs` y `scripts/check-navigation-cards.mjs` comprueban la barra en lugar del desplegable.

## Validación

- `shell:check`, navegación (28 páginas), consistencia, sitio estático, paridad, lenguaje, metadatos, jerarquía, estilos de página, banner de Academia y las cuatro pruebas de portada de web: en verde.
- Medición con Chrome a 1440, 1240, 1024 y 768 px en `patrimonio.html`, `jubilacion.html` y `lecturas.html`: barra de 46 px, sin desbordes, cuatro webs e Inicio siempre visibles, web activa señalada. La cabecera pasa de 149 a 195 px.
- Auditoría con navegador, ejecutada en el PC del fundador: `npm run auditar:urgente` (portada, Mercados y Qué es NUVIA a 1440, 1280, 1180, 1024, 900, 820 y 768 px) y `npm run validate` completo (51 rutas a 1440 px y todas las pruebas): en verde. Registros en `output/validacion-barra-20261122/`.
- La primera pasada de `validate` falló en ocho vistas de Academia (`academia.html?tab=…`): la barra marcaba «Academia NUVIA» como página actual dentro de una pestaña. Corregido en `js/nuvia-ecosistema.js`, que ahora recalcula también los enlaces de la barra al cambiar de vista.
- La auditoría de la portada cubre también el ajuste de fondo, logotipo y cápsula hecho por el fundador esa tarde.

El fundador dio la barra por buena a las 19:07 («todo ok»). La guía maestra, `AGENTS.md` y `DEFINICION_NUVIA.md` recogen ya la barra como navegación global.
