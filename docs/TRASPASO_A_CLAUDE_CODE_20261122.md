# NUVIA · Traspaso de la sesión del 22-11-2026 a Claude Code

Este documento permite seguir el hilo sin releer la conversación. Lo escribió Claude al terminar la sesión de claude.ai del 22-11-2026; el fundador pidió continuar en Claude Code.

## Estado al cerrar (19:45)

- Rama `main` al día con `origin/main` (commit `5a331b3`). Publicación de GitHub Pages n.º 186 correcta; web en vivo comprobada.
- Único resto sin registrar: `prototipos/ecosistema-nuvia-20261112/` (prototipo antiguo de 12 MB, nunca subido; decisión del fundador pendiente).
- Este documento y `CLAUDE.md` están sin commit.

## Qué se hizo hoy

| Trabajo | Dónde está | Acta |
|---|---|---|
| Portada: fondo Arena, color por puerta, cápsula «Qué es NUVIA», franja común en una fila, escala contenida | `estilos/ecosistema/hub.css`, `estilos/nuvia-tokens.css`, `index.html`, `scripts/ecosistema/hub.mjs` | `docs/REDISENO_PORTADA_ESCALA_Y_FONDO_20261122.md` |
| Barra con las cuatro webs en las 28 páginas (sustituye a «Explorar NUVIA») y pie con las cuatro webs | `scripts/ecosistema/shell.mjs`, `estilos/ecosistema/webs.css`, `js/nuvia-ecosistema.js`, `npm run shell:sync` | `docs/BARRA_ECOSISTEMA_Y_PIE_20261122.md` |
| Película «Todo está conectado», edición coherente sobre «Mar», en «Qué es NUVIA» | `src/assets/video/todo-esta-conectado-20261122.*`, `que-es-nuvia.html` | `docs/VIDEO_MAR_COHERENTE_NUVIA_20261122.md` |

La propuesta completa para las cuatro webs (auditoría, esqueleto común, decisiones) está en el proyecto de claude.ai «NUVIA PORTAL ALFA», documento `claude/PROPUESTA_PORTADA_Y_CUATRO_WEBS_2026-11-22.md`.

## Reglas del fundador que siguen vigentes

- No publicar (commit, push, despliegue) sin orden expresa. «Todo ok» no es «súbelo».
- Antes de cambiar algo visible: decir exactamente qué se va a hacer y enseñar un ejemplo.
- Solo el fundador decide añadir, quitar o bloquear.
- No escribir nada en NUVIA-PORTAL-LAB.
- Respuestas en español, directas y breves; verificar antes de afirmar.

## Lo que queda abierto

1. Escucha del fundador de la película publicada, sobre todo la cola final (resonancia sintética añadida tras «Todo está conectado»; medida, no escuchada).
2. Escultura de la portada: rehacerla en Blender (hay una v1 en `output/escultura-blender-20261122/`, menos fina que la imagen actual) o dejar la actual.
3. Resto de la propuesta: portadas de las cuatro webs con un mismo esqueleto, escala tipográfica de interiores (mucho texto a 12–14 px), navegación duplicada de Economía, pie en azul noche (se dejó claro).
4. En portátil de 1280 × 720 la segunda fila de puertas de la portada queda cortada por el pliegue.
5. En la película sigue el cruce de «Tú comprendes y decides.» con «Elegir una vivienda.»; los aros de la apertura no se rodaron de nuevo (corrección de imagen).
6. Los tres ficheros `src/assets/video/que-es-nuvia-20261112.*` quedan sin enlazar.

## Cosas que conviene saber antes de tocar

- Validación: `npm run validate` (51 rutas con navegador, unos 5 min) y `npm run auditar:urgente`. Los registros de hoy están en `output/validacion-barra-20261122/`.
- `docs/nuvia-academy-banner.test.mjs` exige `.hub-about { min-height: 48px }` y las columnas `345px 1fr 345px` de la portada.
- `scripts/nuvia-visual-contract.mjs` fija superficies y escalas tipográficas; solo `nuvia-tokens.css` admite colores literales.
- La barra marca la web activa con `data-eco-active`; `aria-current` solo en la página exacta. `js/nuvia-ecosistema.js` recalcula `.eco-bar a` al cambiar de pestaña (falló en Academia hasta añadirlo).
- La portada mide unos 1.010 px a escala 1; la ampliación (`zoom`) empieza en ventanas de 1900 × 1400 px. El monitor del fundador da 2560 × 1271 px útiles: ahí va a escala 1.
- Vídeo: máster de 107 MB en `output/nuvia-cuatro-webs-20261117/revision-mar-coherente-20261122/` (carpeta ignorada por git). Se rehace con `aros/estudio_mar.py` (Blender 5.3, OptiX), `montaje/montar.py`, `audio/prolongar.py`, `exportar.py` y `publicar_web.py`. Python con PIL, numpy, scipy y fitz: `C:\Python314\python.exe`.
- Hoy coincidieron dos herramientas editando `hub.css` sin commit de por medio. Conviene registrar antes de cambiar de herramienta.
