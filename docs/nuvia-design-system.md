# Organización de estilos de NUVIA Portal Alfa

Estado: estructura existente, revisada el 09-09-2026. Este documento describe
dónde mantener los estilos actuales; no propone un rediseño ni modifica sus valores.

## Nota vigente · integración y publicación autorizada · 12-11-2026

Por orden del fundador, el diseño aprobado del Ecosistema NUVIA es la versión principal: cuatro webs con identidad propia y dos espacios comunes, Lecturas con Criterio y Colaboradores. Se conserva un único repositorio ALFA y una sola compilación estática. La primera orden fue integrar esta versión sin publicarla todavía. El [acta de integración](INTEGRACION_PRINCIPAL_ECOSISTEMA_20261112.md) documenta la orden, los cambios, la prueba del §12 y la validación. Las descripciones anteriores se conservan como antecedente; esta nota actualiza la organización visual sin sustituir los límites regulatorios ni los controles funcionales.

**Orden posterior del fundador · 12-11-2026:** «Ahora publica esta nueva versión de NUVIA Portal Alfa en GitHub Pages, con la portada del ecosistema, las cuatro webs y los espacios comunes.» **Estado: publicación autorizada por esta orden; el resultado de cada despliegue se registra en GitHub Actions.** El [acta de publicación](PUBLICACION_ECOSISTEMA_GITHUB_PAGES_20261112.md) registra la ejecución y su resultado.

| Recurso principal | Responsabilidad vigente |
| --- | --- |
| `estilos/ecosistema/hub.css` | Composición propia de la portada común. |
| `estilos/ecosistema/webs.css` | Cáscara compartida y base de las cuatro portadas. |
| `estilos/ecosistema/{economia,patrimonio,bienestar,academia}.css` | Identidad de cada portada. |
| `estilos/ecosistema/interiores.css` y `interiores-{economia,patrimonio,bienestar,academia}.css` | Adaptación de interiores, después de la cascada original. |
| `estilos/ecosistema/interiores-{lecturas,colaboradores,nuvia}.css` | Identidad de los espacios comunes y las páginas institucionales. |
| `estilos/ecosistema/interiores-empresas.css` | Última capa de presentación de la copia local de Empresas. |
| `scripts/ecosistema/`, `_plantilla.html` y `js/nuvia-ecosistema.js` | Fuentes de portada, cáscara centralizada, navegación y compatibilidad de rutas. |
| `src/assets/ecosistema/` | Imágenes principales del ecosistema; sin dependencia de `prototipos/`. |

Los tokens y las fuentes autoalojadas siguen en `nuvia-tokens.css`. Los interiores se delimitan con `body[data-eco-theme]` y reglas de pantalla: no se les aplica `.web-page`, cuyo reinicio tipográfico y de SVG corresponde a las portadas. Se mantienen el orden relativo de las hojas originales, la impresión y el significado de gráficos, cifras y estados. La identidad distingue webs, no califica resultados financieros. Toda nueva regla sigue las comprobaciones de escritorio y tablet, contraste AA, foco, objetivos de 44 px y ausencia de desbordamientos.

## Capas del portal

### Claridad e identidad · 12-11-2026

La continuación «Sigue» aplica las propuestas de la auditoría y las órdenes posteriores incorporan la firma oficial del fundador en las cabeceras. Se conservan Newsreader, la tipografía de lectura y la paleta. La cáscara se genera desde `_plantilla.html`; las cuatro webs mantienen sus composiciones propias.

La firma oficial **11 · Horizontal Lineal** del pack v04.02 identifica todo el portal. En **Inicio** permanece a 280 × 70 px, sin rótulo adicional ni separador, con «Qué es NUVIA» y 102 px de altura de cabecera. Por la orden posterior «pon ese mismo logo en las cabeceras de las cuatro webs y de los espacios comunes», `.web-brand-logo` representa el mismo SVG a 240 × 60 px, 216 × 54 px hasta 999 px y 192 × 48 px hasta 819 px. Las cabeceras contextualizadas conservan sus 100 px de altura, nombres, menús y separadores. El favicon y los textos originales permanecen intactos. Procedencia: [Cabecera y textos de Inicio](LOGOS_OFICIALES_V0402_20261112.md); alcance y comprobación de la extensión: [Logo común en las cabeceras](LOGO_COMUN_CABECERAS_NUVIA_20261112.md).

Todos los interiores usan el mismo selector «Explorar NUVIA», con Inicio, cuatro webs, dos espacios comunes y las tres páginas institucionales. «Inicio» en la barra local identifica la web actual; su nombre accesible incluye el área. Las migas dicen «Inicio NUVIA». La portada incorpora un índice desplegable de seis herramientas, separado de las cuatro puertas y los dos espacios comunes.

La prioridad visual es contenido disponible y acciones concretas: libros antes del relato editorial, publicaciones de Bienestar antes del mapa temático, recorridos y glosario con enlaces recuperables. Los simuladores muestran unidades, supuestos y resultados sin convertirlos en instrucciones personales. Las comprobaciones y límites de esta fase figuran en [el acta](APLICACION_AUDITORIA_CLARIDAD_NUVIA_20261112.md).

El portal ya dispone de un sistema CSS propio. Se amplía ese sistema conservando
el orden de carga de cada página y la cascada vigente:

| Archivo | Responsabilidad |
| --- | --- |
| `estilos/nuvia-tokens.css` | Variables globales de color, tipografía, espaciado, superficies y medidas; fuentes autoalojadas. |
| `estilos/nuvia-components.css` | Componentes compartidos: contenedores, botones, tarjetas, campos, estados, tablas y progresos. |
| `estilos/nuvia-pages.css` | Entrada común: fundamentos → contenidos → entradas de página. |
| `estilos/nuvia-pages-lab.css` | Entrada de `cartera.html`: fundamentos → cartera → contenidos → entradas de página. |
| `estilos/nuvia-market-reports.css` | Informes de mercado; enlazada solo en `mercados.html` y `economia.html`. |
| `estilos/nuvia-pages-foundations.css` | Armazón común y el primer grupo de composiciones de página, incluido el curso. |
| `estilos/nuvia-pages-cartera.css` | Composiciones y herramientas de cartera y análisis. |
| `estilos/nuvia-pages-content.css` | Vivienda, guías, espacios, portada y demás composiciones del grupo de contenidos. |

Desde el 12-10-2026 la hoja de Cartera y la de informes no se cargan en todas las
páginas: `nuvia-pages.css` importa **foundations → content → page-entry**;
`cartera.html` carga `nuvia-pages-lab.css` (**foundations → cartera → content →
page-entry**, el mismo orden relativo de siempre) y los informes se enlazan donde
se muestran. Esta división no debe sustituirse por una hoja por cada página.

Reglas globales de impresión: el formato de papel (`@page { size: A4; margin: 15mm; }`)
es común a todo el portal y vive al final de `nuvia-pages-foundations.css`; los
informes descargables, que son documentos autónomos, lo declaran en su plantilla
(`scripts/informes-mercado/plantilla-html.mjs`). Al mover una hoja de sitio hay
que revisar también sus reglas-arroba globales (`@page`, `@font-face`,
`@keyframes`), que no dependen de que una clase esté en la página. Buscar primero el
selector y su bloque temático; añadir junto a las reglas del mismo componente.

La base heredada de `_ds/` forma parte del entorno de las páginas. No se edita
como destino de nuevas reglas propias. `estilos/sistema-visual.css` corresponde
a la muestra `sistema-visual.html`, no a un segundo sistema para las páginas.

La Home es la referencia visual del proyecto. Las composiciones fotográficas
actuales de los espacios y la composición editorial de Lecturas están en las
hojas de página. Cambiar sus medidas, imágenes o degradados requiere una tarea
de diseño: extraer CSS no autoriza cambiar su apariencia.

## Cómo incorporar una regla

1. Buscar una clase existente que tenga la misma función y los mismos valores.
2. Si la regla es compartida, mantenerla en `nuvia-components.css`; si es propia
   de una composición, usar su bloque en el módulo de páginas correspondiente.
3. Usar nombres del componente y sus variantes. Evitar clases genéricas de una
   sola propiedad cuando oculten el significado o dupliquen el sistema.
4. Utilizar los tokens existentes. No sustituir un valor anterior por un token
   parecido durante una refactorización: podría cambiar la apariencia.
5. Trasladar las declaraciones conservando especificidad efectiva, orden,
   estados, transiciones y reglas responsive. Eliminar después el inline.
6. Comprobar escritorio y tablet, incluidos desbordamientos y estados activos.

El HTML consolidado no incluye atributos `style` ni bloques `<style>`.
`scripts/check-consistencia.mjs` exige cero en las páginas publicadas.
`docs/nuvia-page-styles.test.mjs` protege el orden de los módulos.

## Progreso sin CSS inline

Curso y guía de planificación calculan porcentajes enteros de 0 a 100.
Comparten `.nv-progress-fill[data-progress="…%"]`, cuya anchura se declara en
`nuvia-components.css`. La lógica entrega el porcentaje existente y cada página
conserva sus colores, altura y transición. No se redondean valores nuevos ni se
modifica el cálculo. Este componente no representa datos financieros continuos.

## Módulo de empresas y ejemplos locales

La copia independiente de empresas conserva su estructura:

- `company-analysis/src/theme.css`: base, componentes de gráficos y tablas.
- `company-analysis/src/theme-b.css`: variante existente.
- `company-analysis/src/alfa/theme.css`: integración y composiciones Alfa.
- `company-analysis/src/local/preview.css`: entorno local de revisión.
- `estilos/nuvia-fonts.css`: fuentes sin importar el resto del tema del portal.

Los estilos estáticos escritos en JSX se trasladan a la hoja del mismo módulo.
No se fusionan sus temas ni se cambia su orden para limpiar CSS inline.

`prototipos/laboratorio-cartera-B.css` y `docs/previews/banners.css` contienen
exclusivamente las reglas de sus respectivos HTML locales. No se importan desde
el portal. El prototipo conserva sus tokens históricos y sus datos ficticios;
sus variantes `--demo-…` reúnen combinaciones estáticas idénticas y no son una
API de componentes del producto.

## Límite de esta primera extracción

Hay valores que el JavaScript genera a partir de datos: anchuras continuas de
gráficos, colores de series, gradientes circulares y coordenadas de tooltips.
Se conservan en esta fase para no cambiar cálculos, precisión ni colocación.
Son deuda inventariada, no una autorización para introducir nuevas reglas
estáticas inline. No se editan dependencias, archivos compilados ni estilos que
inyectan bibliotecas externas.

El inventario, los cambios y la validación están en
[`REFACTORIZACION_CSS_20260909.md`](REFACTORIZACION_CSS_20260909.md).
