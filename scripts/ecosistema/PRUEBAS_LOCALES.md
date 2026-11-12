# Comprobaciones locales de la integración del ecosistema

`verificar-preservacion.mjs` y `verificar-funciones.mjs` necesitan la captura local anterior a la integración del 12 de noviembre de 2026. No forman parte de CI, no sustituyen `npm run validate` y no deben ejecutarse contra producción.

La captura vive en `output/integracion-ecosistema-20261112/`: `fuentes/` conserva los HTML originales; `original/` contiene la compilación anterior, incluidas bibliotecas, datos, descargas y Empresas. Los registros `contenido-integrado.json` y `academia-controlador.json` identifican las excepciones editoriales y el controlador de Academia aprobado. No se puede usar la compilación nueva como referencia.

Desde la raíz del repositorio:

```powershell
node scripts/ecosistema/verificar-preservacion.mjs
```

Por defecto compara fuente y `dist`; admite otras carpetas como argumentos. Revisa los 23 interiores, la rama original y el controlador de Academia, y todos los archivos del snapshot en `data/`, `js/` y `core/downloads/`, además de `support.js`, `nuvia-site-unified.js` y `web2-integration.js`. Exige igualdad por bytes de estos archivos; el informe incluye inventario, tamaños y SHA-256. Los nuevos archivos del ecosistema no pertenecen al inventario anterior. El resultado se guarda en `output/integracion-ecosistema-20261112/preservacion.json`.

Para la regresión funcional, servir por separado la compilación anterior y el nuevo `dist`, con URLs locales sin barra final:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH='C:/Users/oanti/AppData/Local/ms-playwright'
$env:BASELINE_URL='http://127.0.0.1:4186'
$env:PREVIEW_URL='http://127.0.0.1:4189'
node scripts/ecosistema/verificar-funciones.mjs
```

La prueba abre contextos efímeros, permite solo GET/HEAD locales y bloquea servicios externos. Compara nueve recorridos y los bytes del JavaScript compilado de Empresas mediante SHA-256, aunque cambie el nombre del asset por una dependencia CSS. No comprueba la actualidad de APIs remotas ni la reproducción de vídeos. Guarda `funciones.json` en la misma carpeta de evidencias; `ONLY_CASE` y `FUNCTION_REPORT` permiten una repetición acotada sin sobrescribir el informe completo.

Se debe repetir la auditoría de preservación después de la compilación final para comprobar también el `dist` definitivo. Estas herramientas no escriben en las fuentes, en la base de datos ni en los snapshots: únicamente generan informes locales.
