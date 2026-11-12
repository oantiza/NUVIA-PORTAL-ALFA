# Logo oficial común en las cabeceras · 12-11-2026

## Orden del fundador

«Ahora pon ese mismo logo en las cabeceras de las cuatro webs y de los espacios comunes, adaptando su tamaño a cada cabecera y sin cambiar nada más del diseño.»

## Alcance e implementación

Se utiliza el mismo SVG oficial **11 · Horizontal Lineal** de la portada en las cabeceras de Economía y finanzas, Patrimonio, Familia y bienestar y Academia NUVIA, sus páginas interiores y los espacios comunes e institucionales. El archivo no se altera: `src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-horizontal-lineal-v0402.svg`.

La definición de marca de `_plantilla.html` apunta al SVG; `brandImage()` en `scripts/ecosistema/shell.mjs` sustituye el símbolo y nombre separados por una sola imagen accesible. `npm run shell:sync` aplica la cabecera canónica a 27 páginas y a la plantilla. No se editan cabeceras por página.

La clase `.web-brand-logo`, en `estilos/ecosistema/webs.css`, conserva las proporciones mediante `object-fit: contain` y adapta el tamaño al ancho disponible:

- Escritorio y tablet ancha, desde 1000 px: 240 × 60 px.
- De 820 a 999 px: 216 × 54 px.
- De 768 a 819 px: 192 × 48 px.

Todas estas cabeceras conservan sus 100 px de altura antes de la barra de navegación. No se cambian títulos de espacio, separadores, menús, enlaces, tipografías, paleta, textos, portadas, pies ni funcionalidades. Inicio mantiene su logo a 280 × 70 px y su diseño exacto. Tampoco se cambia el favicon.

## Prueba del §12

Necesidad: coherencia visual de la marca por orden expresa. Entrada: arte oficial ya incorporado y aprobado; sin datos financieros o personales. Transformación: representación proporcionada del mismo SVG. Resultado: identificación de NUVIA, sin cálculos, clasificaciones, recomendaciones, juicios de idoneidad, llamadas a operar ni promoción de terceros. Sin nuevas funciones, IA, integraciones, monetización, persistencia o cambios de separación profesional. Clasificación interna verde; se mantienen todos los límites y avisos existentes.

## Validación

Comparación exacta de los 28 HTML públicos antes y después: cambian únicamente los enlaces de marca de las 27 cabeceras contextualizadas; todo byte fuera de esos enlaces permanece idéntico. `index.html` no cambia. Evidencia: `output/logos-cabeceras-20261112/alcance.json`.

- `npm run build`: finaliza con código 0; incluye validación completa, auditoría de 51 páginas/vistas a 1440 px, construcción de `dist/`, contratos del artefacto y Empresas a cinco anchuras. Registro: `output/logos-cabeceras-20261112/build.log`.
- Auditoría adicional de nueve páginas representativas de las cuatro webs, espacios comunes e interiores a 1024 y 768 px: 18 vistas sin incidencias. Registro: `tablet.log`.
- Comparación visual anterior/posterior de esas nueve páginas a 1440, 1024 y 768 px: 27 vistas, todas con la misma altura de cabecera y posición inicial del contenido; sin desbordes. Evidencia: `revision-visual.json` y capturas en la misma carpeta de salida.
- Medida intermedia a 900 px verificada en Economía y Lecturas: logo de 216 × 54 px, fila de cabecera de 100 px y sin desbordes. Evidencia: `tablet-intermedia.json`.
- Revisión independiente de fuentes y capturas: sin cambios ajenos al bloque de marca. No ha sido necesario cambiar contratos ni pruebas existentes. `git diff --check` correcto.

La compilación queda preparada para revisión local. No se realiza commit, push, publicación ni modificación de Firebase en esta tarea.

## Publicación autorizada · orden posterior

«Perfecto, publica esta versión en GitHub Pages con el mismo logo en las cabeceras de las cuatro webs y los espacios comunes.»

La orden autoriza el commit y envío de esta versión aprobada a `main`, con publicación mediante `.github/workflows/pages.yml`. Sustituye el estado local de la entrega anterior. Se publica exclusivamente la sustitución de marca y sus dimensiones adaptativas, junto con su documentación; no se modifica ningún otro elemento del diseño. La base publicada es `4fe28d40fa4a3b1e0342fff934e4eb719b151e42`.

El árbol preparado para Git debe coincidir con las fuentes validadas. Quedan fuera los ocho documentos audiovisuales ajenos, sus dos referencias del índice, el prototipo histórico y los directorios de salida. `dist/` se construye en Actions. Se conserva el cierre documentado del despliegue anterior como antecedente.

El flujo oficial repite la validación, construcción y auditoría de tablet antes de desplegar. Se comprobará el SHA de la ejecución y su resultado, las 28 páginas públicas, la misma firma oficial en sus cabeceras y las dimensiones adaptativas en la hoja de estilos. Los recibos se guardan en `output/publicacion-logos-comunes-20261112/`. La publicación no añade funciones, datos personales, cálculos ni integraciones, por lo que mantiene la prueba del §12 anterior. No se modifica Firebase.
