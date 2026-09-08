# NUVIA Portal Alfa

Repositorio oficial y único de la nueva fase Alfa de NUVIA Portal. Todo el trabajo se realiza exclusivamente en esta carpeta. `NUVIA-PORTAL-LAB` está cerrado y ningún proceso de este proyecto debe leerlo, modificarlo, sincronizarlo ni publicarlo.

La estructura canónica de esta fase está definida en [Arquitectura y Estructura Global del Portal](docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md). Se aplica junto con la [Definición canónica de NUVIA](docs/DEFINICION_NUVIA.md) y el [Marco regulatorio obligatorio](docs/MARCO_REGULATORIO_OBLIGATORIO.md).

## Gobernanza regulatoria

El documento [Marco regulatorio obligatorio y compatibilidad profesional](docs/MARCO_REGULATORIO_OBLIGATORIO.md)
es una norma transversal del proyecto. Debe aplicarse antes de diseñar,
programar o publicar cualquier página, contenido, cálculo, herramienta o función
de IA. Si entra en conflicto con otro documento funcional, prevalece el marco
regulatorio y la función queda bloqueada hasta su corrección o validación.

## Entornos

- **Local:** desarrollo y revisión en `http://127.0.0.1:4173`.
- **Producción:** `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`.

El repositorio oficial es `https://github.com/oantiza/NUVIA-PORTAL-ALFA.git`. Cada actualización de `main` ejecuta la validación, genera `dist/` y publica esa compilación en GitHub Pages.

## Trabajo local

Requisito: Node.js 20 o posterior.

```powershell
npm run serve
```

El comando valida el contenido, genera una publicación limpia en `dist/` y levanta la web local. La carpeta `dist/` es temporal y no se versiona.

## Validación y compilación

```powershell
npm run validate
npm run build
```

La validación comprueba las rutas funcionales, informes, materiales de Academia Nuvia, contenido diario, indicadores macroeconómicos y referencias locales de todas las páginas.

## Publicación

La publicación oficial se realiza automáticamente al enviar cambios a `main` mediante `.github/workflows/pages.yml`. Antes de enviar cambios se debe ejecutar:

```powershell
npm run build
```

GitHub Pages publica únicamente el artefacto generado en `dist/`. Firebase queda como infraestructura secundaria y no se publica salvo petición expresa.

## Contenido diario

La noticia económica y los cinco indicadores macroeconómicos se mantienen directamente en `data/daily-content.json`. La imagen editorial estable de portada está en `src/assets/home/daily-news/daily-news-desktop.webp`.

## Alcance

`core/` forma parte del contenido funcional de NUVIA Portal Alfa y se trata como un componente local consolidado. No se descarga ni se reconstruye desde otra web durante el trabajo o la publicación.
