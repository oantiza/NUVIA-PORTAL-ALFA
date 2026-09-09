# Organización de estilos de NUVIA Portal Alfa

Estado: estructura existente, revisada el 09-09-2026. Este documento describe
dónde mantener los estilos actuales; no propone un rediseño ni modifica sus valores.

## Capas del portal

El portal ya dispone de un sistema CSS propio. Se amplía ese sistema conservando
el orden de carga de cada página y la cascada vigente:

| Archivo | Responsabilidad |
| --- | --- |
| `estilos/nuvia-tokens.css` | Variables globales de color, tipografía, espaciado, superficies y medidas; fuentes autoalojadas. |
| `estilos/nuvia-components.css` | Componentes compartidos: contenedores, botones, tarjetas, campos, estados, tablas y progresos. |
| `estilos/nuvia-pages.css` | Entrada que importa los tres módulos de páginas, sin cambiar su orden. |
| `estilos/nuvia-pages-foundations.css` | Armazón común y el primer grupo de composiciones de página, incluido el curso. |
| `estilos/nuvia-pages-cartera.css` | Composiciones y herramientas de cartera y análisis. |
| `estilos/nuvia-pages-content.css` | Vivienda, guías, espacios, portada y demás composiciones del grupo de contenidos. |

`nuvia-pages.css` importa **foundations → cartera → content**. Esta división ya
existía y no debe sustituirse por una hoja por cada página. Buscar primero el
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
