# Publicación n.º 190 · cabecera compacta y cuatro mejoras de la revisión

**Fecha:** 23-11-2026.

## Orden del fundador

«pasa npm run build y publica», con dos commits locales sin enviar.

## Qué se publica

| Commit | Contenido | Acta |
|---|---|---|
| `fa27cd1` | Cabecera compacta: una sola franja, espacios comunes sin menú repetido y alineación con el contenido | `CABECERA_COMPACTA_20261123.md` |
| `39937e5` | Pie más corto; cierre de Qué es NUVIA en marfil; titulares de Economía según la vista; regla única de botones y esquinas | `PIE_Y_CIERRE_QUE_ES_NUVIA_20261123.md`, `ECONOMIA_TITULAR_SEGUN_VISTA_20261123.md`, `BOTONES_Y_ESQUINAS_20261123.md` |

## Validación previa

`npm run build` en local, completo: código de salida 0. Incluye la validación («51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas»), la compilación de Empresas y las comprobaciones sobre `dist`.

## Resultado del despliegue

- Envío: `f93a5d0..39937e5` en `main`.
- Flujo «Publicar NUVIA Portal Alfa en GitHub Pages» n.º 190 (ejecución 45146186793): correcto.
- Comprobado por descarga de la web en vivo: `estilos/ecosistema/webs.css` lleva la franja única desde 1020 px y el pie nuevo; `jubilacion.html` lleva el pie nuevo; `mercados.html` lleva «Informes de mercado»; `interiores-nuvia.css` lleva el cierre en marfil. No se ha mirado a ojo en un navegador.

## Pendiente de anotar de antes

El despliegue n.º 189 (commit `f93a5d0`, limpieza del repositorio) terminó correcto el 23-11-2026 y no constaba en ningún acta.
