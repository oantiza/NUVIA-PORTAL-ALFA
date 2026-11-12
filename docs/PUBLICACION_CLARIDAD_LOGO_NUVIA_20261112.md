# Publicación de la versión revisada y logo ampliado · 12-11-2026

## Orden del fundador

«Perfecto, publica esta versión en GitHub Pages con el logo ampliado y sin “Ecosistema” en la cabecera.»

La orden autoriza el commit, envío a `main` y despliegue oficial de la versión local aprobada, incluida la revisión de claridad y las precisiones posteriores sobre textos y logo. Sustituye el estado de entrega local sin publicar recogido en las actas anteriores. El repositorio único es `oantiza/NUVIA-PORTAL-ALFA`; la producción es `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`. No autoriza escrituras en Firebase ni la publicación de trabajos audiovisuales ajenos.

## Versión autorizada

- Revisión de claridad aplicada a las cuatro webs, navegación, herramientas y espacios comunes, documentada en [el acta de aplicación](APLICACION_AUDITORIA_CLARIDAD_NUVIA_20261112.md) y sus fichas por módulo.
- Textos originales de la portada recuperados por orden expresa, incluida la descripción «Tu dinero, tu familia, lo que sabes y lo que está por venir. Un ecosistema para comprenderlo en conjunto».
- Firma oficial lineal 11 del pack v04.02 a 280 × 70 px. Sin el rótulo «Ecosistema» ni su separador en la cabecera; se conserva el acceso a «Qué es NUVIA». La altura de cabecera permanece en 102 px. Procedencia, alcance y controles: [acta del logo](LOGOS_OFICIALES_V0402_20261112.md).
- Se conservan contenidos, artículos firmados, rutas, calculadoras, vídeos de activación voluntaria, datos, almacenamiento local e integración de Empresas. El último ajuste de logo deja idénticos los 27 HTML públicos restantes y todo el contenido de Inicio fuera de su cabecera.

El commit incluye fuentes, recursos, pruebas y documentación de esta versión. Se excluyen ocho documentos audiovisuales locales de octubre y sus dos referencias del índice, el prototipo histórico y los directorios de salida. Se conserva su contenido en el espacio de trabajo. `dist/` lo genera el flujo oficial; no se versiona.

## Validación y prueba del §12

La publicación no introduce funciones ni transformaciones adicionales. La prueba regulatoria y las puertas del §13 de la revisión están en el acta de aplicación; el ajuste de marca es exclusivamente visual y está documentado en su propia acta. Se conservan límites informativos, fuentes, avisos e independencia. No se añaden recomendaciones, llamadas a operar, datos personales en base ni nuevas integraciones externas.

Validación de la versión exacta aprobada, antes de autorizar esta publicación:

- `npm run build`, código 0: incluye `npm run validate`, `npm run auditar`, compilación y contratos del artefacto.
- 51 páginas y vistas a 1440 px, sin incidencias; Empresas verificada a 1440, 1280, 1024, 820 y 768 px.
- Inicio verificado a 1440, 1024 y 768 px, sin desbordes, colisiones, errores de contraste o consola. Revisión visual directa e independiente del logo ampliado.
- Evidencia: `output/logo-protagonista-20261112/build.log`, `portada.log`, `alcance.json`, `visual.json` y capturas. La revisión general previa y sus controles funcionales se conservan en las actas de claridad.

Actions repite la construcción, validación completa y auditoría de tablet. Mantiene las actualizaciones de datos ya existentes en `.github/workflows/pages.yml`; por ello la comprobación pública usa el artefacto de esa ejecución como referencia cuando compara bloques de datos actualizados.

## Seguimiento de publicación

Base anterior publicada: `9727ef57499211772a82a24dcdc38346a788eb83`. Se comprueba el estado remoto antes de enviar y no se fuerza la historia. Se exige que el SHA del flujo oficial coincida con el commit enviado y que el paso de GitHub Pages finalice correctamente.

Después se comprueban la URL pública, el logo y sus dimensiones, la ausencia del rótulo en la cabecera, los textos conservados y los destinos de las cuatro webs y espacios comunes. Los identificadores de commit, ejecución y despliegue, así como la evidencia pública, se guardan en `output/publicacion-claridad-logo-20261112/`. Este documento registra autorización y alcance; el éxito se acredita con el resultado real de Actions y la comprobación pública.

## Cierre comprobado · 12-11-2026

- Commit publicado: `4fe28d40fa4a3b1e0342fff934e4eb719b151e42`, enviado a `main` sin forzar la historia.
- [Ejecución 43247243915](https://github.com/oantiza/NUVIA-PORTAL-ALFA/actions/runs/43247243915): construcción, validación completa, auditoría de tablet y publicación finalizadas con `success`; SHA coincidente con la versión aprobada.
- Las 28 páginas públicas responden correctamente. Inicio conserva los siete accesos a las cuatro webs, Lecturas, Colaboradores y Qué es NUVIA, junto a sus textos originales.
- La cabecera pública contiene el SVG oficial a 280 × 70 px, sin «Ecosistema» ni separador. El SVG y la hoja de estilos publicados coinciden con los recursos aprobados, normalizando únicamente finales de línea.
- Evidencias: `recibo-despliegue.json`, `verificacion-publica.json` e `index-publicado.html` en `output/publicacion-claridad-logo-20261112/`. No se realizaron escrituras en Firebase ni se incluyeron los documentos audiovisuales o prototipos ajenos.

Esta anotación de cierre se registra localmente después de comprobar el despliegue, para evitar una nueva publicación que solo añadiría el resultado de la anterior.
