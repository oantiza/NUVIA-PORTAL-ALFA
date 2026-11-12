# Publicación del Ecosistema NUVIA en GitHub Pages · 12-11-2026

## Orden del fundador

«Ahora publica esta nueva versión de NUVIA Portal Alfa en GitHub Pages, con la portada del ecosistema, las cuatro webs y los espacios comunes.»

Esta orden posterior autoriza el commit de la versión integrada, su envío a `main` y la publicación mediante el flujo oficial `.github/workflows/pages.yml`. Sustituye la restricción de no publicar de la fase anterior. No autoriza escrituras en Firebase ni la publicación de otros trabajos locales.

## Versión y alcance

- Entrada: Ecosistema NUVIA, `index.html`.
- Cuatro webs: Economía y Finanzas, Patrimonio, Familia, Salud y Bienestar y Academia NUVIA.
- Espacios comunes: Lecturas con Criterio y Colaboradores; información institucional en Qué es NUVIA, Metodología e Independencia.
- Conservación de rutas, calculadoras, vistas, artículos, vídeos voluntarios, lecturas, descargas, datos y aplicación local de empresas.
- Un único repositorio y sitio estático: [NUVIA Portal Alfa](https://oantiza.github.io/NUVIA-PORTAL-ALFA/).

El commit incluye fuentes, recursos, pruebas actualizadas y documentación de esta integración. El material audiovisual local ajeno y sus entradas del índice quedan fuera. El prototipo histórico y los originales PNG permanecen locales; se versionan las fuentes principales, los cinco WebP y sus fichas de procedencia. `dist/` se genera en Actions y no se versiona.

## Validación previa y control regulatorio

El [acta de integración](INTEGRACION_PRINCIPAL_ECOSISTEMA_20261112.md) contiene la prueba completa de 18 preguntas del §12 y la revisión de las puertas del §13. Este paso publica exactamente esa organización y presentación, sin nuevos cálculos, personalización, recomendaciones, tratamiento de datos personales ni derivación comercial. Clasificación del cambio: verde; no reclasifica las funciones preexistentes. Se mantienen los avisos, fuentes, independencia y separación profesional.

Resultados locales aprobados antes de preparar la publicación:

- `npm run build`, que incluye `npm run validate` y `npm run auditar`, terminó con código 0.
- 51 vistas a 1440 px y 102 comprobaciones adicionales a 1024/768 px, sin incidencias.
- Aplicación de empresas verificada a 1440, 1280, 1024, 820 y 768 px.
- Nueve escenarios funcionales con resultados iguales a la compilación anterior; JavaScript de Empresas idéntico.
- 23 interiores y Academia conservados en fuente y compilación; 96 comparaciones de archivos de datos, bibliotecas y descargas idénticas.
- 22 vistas del artefacto bajo el prefijo `/NUVIA-PORTAL-ALFA/`, sin enlaces ni recursos locales rotos.
- Impresión: 616 elementos del contenido principal conservados en seis páginas.

La comprobación del árbol preparado para Git detectó diferencias LF/CRLF en la cáscara. `applySiteShell` conserva ahora la convención de cada fragmento sin normalizar el resto del documento ni ignorar cambios de contenido. La regresión cubre LF, CRLF y documentos mixtos; 174 comprobaciones entre la raíz y la exportación confirmaron conservación e idempotencia. Se repite la validación completa después de este ajuste de empaquetado.

Las comprobaciones locales de navegador se aislaron de APIs externas; no acreditan actualidad de datos remotos. El flujo oficial conserva sus actualizaciones de datos y repite la validación completa, la auditoría de tablet, la construcción de `dist/` y el despliegue. No se omiten controles ni se publican artefactos de prueba.

## Trazabilidad y verificación de producción

El commit de esta acta identifica las fuentes autorizadas. El resultado del despliegue se comprueba en [las ejecuciones del flujo oficial](https://github.com/oantiza/NUVIA-PORTAL-ALFA/actions/workflows/pages.yml), exigiendo que el SHA desplegado coincida con el commit enviado y que el paso «Publicar en GitHub Pages» finalice correctamente.

Después se verifica la URL pública: nueva portada, cuatro destinos, espacios comunes, rutas interiores y recursos publicados. La evidencia local y el recibo del despliegue se guardan en `output/publicacion-ecosistema-20261112/`, fuera del artefacto. Esta acta registra la autorización y el procedimiento; el éxito de publicación se acredita mediante Actions y la comprobación pública, no mediante una aprobación humana simulada.

## Cierre comprobado · 12-11-2026

- Commit publicado: `9727ef57499211772a82a24dcdc38346a788eb83`, enviado a `main` sin forzar la historia.
- [Ejecución 43229859469](https://github.com/oantiza/NUVIA-PORTAL-ALFA/actions/runs/43229859469): validación, construcción, tablet y despliegue finalizados con `success`.
- Comparación pública: las 28 páginas y 12 recursos principales coinciden con el artefacto efectivamente publicado. Se usa el artefacto de Actions porque el flujo refresca los datos y el bloque de cierres de Mercados.
- Diez vistas públicas abiertas sin errores JavaScript ni respuestas HTTP fallidas del mismo origen; portada con cuatro accesos y dos espacios comunes, calculadora e integración de Empresas visibles.
- Portada pública abierta en el navegador del fundador. Evidencias: `verificacion-publica.json`, `recibo-despliegue.json` y `portada-publicada.png` en la carpeta de salida indicada.

La auditoría posterior de claridad y diseño se documenta separadamente en `AUDITORIA_INTEGRAL_CLARIDAD_Y_DISENO_20261112.md`; sus propuestas no forman parte del commit desplegado.
