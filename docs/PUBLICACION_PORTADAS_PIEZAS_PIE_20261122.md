# Publicación · portadas, piezas de Blender, pie y texto de Jubilación

**Fecha:** 22-11-2026.

## Orden del fundador

«Publica». Dada tras repasar lo pendiente, con dos commits locales sin enviar. Autoriza el envío de `main` y su despliegue por `.github/workflows/pages.yml`. No incluye Firebase ni trabajos ajenos.

## Qué se publica

| Commit | Contenido | Acta |
|---|---|---|
| `9a547f6` | Pliegue de la portada en portátil; esqueleto común de las cuatro portadas; globo en Economía y ábaco en Academia; texto del simulador de Jubilación a 13 px | `REDISENO_PORTADA_ESCALA_Y_FONDO_20261122.md`, `PORTADAS_ESQUELETO_COMUN_20261122.md`, `PIEZAS_BLENDER_ECONOMIA_ACADEMIA_20261122.md`, `JUBILACION_TEXTO_13PX_20261122.md` |
| `6e22c3a` | Pie en azul noche en las 28 páginas, sin franja blanca en los interiores | `BARRA_ECOSISTEMA_Y_PIE_20261122.md` |

Las notas «local, sin publicar» de esas actas describen el estado anterior a esta orden.

## Descartado, no se publica

- Reducir el menú de Economía a Inicio · Mercados · Cartera. Se probó y se deshizo por decisión del fundador («Deshaz el menú»): `scripts/check-navigation-cards.mjs` exige cinco destinos en el menú de cada web.
- Subir el texto pequeño en todo el sitio: exigía cambiar pruebas. Se aplicó solo al simulador de Jubilación.

## Validación previa

`npm run validate` con código de salida 0 sobre el contenido de `6e22c3a` (51 páginas sin fallos). No se ejecutó `npm run build` en local; el flujo de GitHub Actions valida y compila al publicar.

## Resultado del despliegue

Se anota al terminar el flujo.
