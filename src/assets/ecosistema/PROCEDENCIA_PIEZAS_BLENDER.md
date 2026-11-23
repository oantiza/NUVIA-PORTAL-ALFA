# Piezas de Economía, Academia y Mercados modeladas en Blender

Fecha: 22-11-2026. Sustituyen en las portadas a `economia-perspectiva.webp` y `academia-ideas.webp` por decisión del fundador.

| Uso | Archivo web | Dimensiones | Bytes | SHA-256 |
|---|---|---|---:|---|
| Economía y finanzas | `economia-mundo.webp` | 1000 × 1000, alfa | 118708 | `4bd39c833851b8eee4d69063acfa496d08ddecc174d2d4622074a71c3a13343a` |
| Academia NUVIA | `academia-abaco.webp` | 1000 × 1000, alfa | 141698 | `bb890e537e146e8eb3e5240cb9cbf2d48345580574278389294696a46642ee92` |

## Cómo se hicieron

- **Herramienta:** Blender 5.3, motor Cycles con OptiX (NVIDIA GeForce RTX 5070 Ti). Modelado íntegro por guion de Python; no se usan imágenes generadas, fotografías ni modelos de terceros.
- **Entorno de luz:** `studio.exr`, incluido en la instalación de Blender (`datafiles/studiolights/world/`), más cuatro cajas de luz y un telón luminoso propios.
- **Render:** 2000 × 2000 px, 800 muestras con reducción de ruido, fondo transparente. Exportación a WebP de 1000 px, calidad 90, con Pillow. En el ábaco se recorta el velo tenue que el suelo de sombra dejaba hasta los bordes (nivel de negro 16 sobre 255 en el canal alfa).
- **Materiales:** los de la escultura de la portada. Vidrio azul profundo (Economía), bronce (Patrimonio), vidrio verde esmerilado (Bienestar) y vidrio azul claro (Academia), con oro champán cepillado y madera clara.

## Qué representan

- **`economia-mundo.webp`:** un globo de vidrio azul profundo con retícula dorada de meridianos y paralelos, eje inclinado y una órbita con un satélite de vidrio claro. Acompaña al titular «Entender lo que mueve el mundo».
- **`academia-abaco.webp`:** un ábaco de madera clara con varillas doradas y cuatro filas de cuentas, una por cada web de NUVIA (azul profundo, bronce, verde y azul claro). Acompaña al titular «Saber es patrimonio».

Son imágenes decorativas (`alt=""`, contenedor con `aria-hidden`). No contienen cifras, textos, marcas ni afirmaciones.

## Fuentes

Desde el 23-11-2026 hay copia en el repositorio, en `scripts/blender/piezas-webs-20261122/` (`piezas.py`, `exportar_elegidas.py`, `globo.blend`, `abaco.blend`); no se publica en la web. La carpeta de trabajo completa, con renders y las seis escenas, sigue en `output/piezas-webs-20261122/`, ignorada por git:

- `piezas.py`: guion que modela, ilumina y renderiza las seis piezas propuestas (`globo`, `columnas`, `engranajes`, `abaco`, `libros`, `bloques`).
- `exportar_elegidas.py`: exportación de las dos elegidas.
- `elegidas/globo.blend` y `elegidas/abaco.blend`: escenas de Blender de las dos piezas publicables; `blend/` conserva las seis.

Para rehacer una pieza:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b --factory-startup -P piezas.py -- globo elegidas/globo.png 2000 800 elegidas/globo.blend
```

Las imágenes anteriores (`economia-perspectiva.webp`, `academia-ideas.webp`) siguen en esta carpeta, sin enlazar.

## Reloj de arena de Mercados y noticias (23-11-2026)

| Uso | Archivo web | Dimensiones | Bytes | SHA-256 |
|---|---|---|---:|---|
| Cabecera de Mercados y noticias | `mercados-reloj-arena.webp` | 1000 × 764, alfa | 51276 | `d0b91011ff922e7aa7d7e92d8b25b5cc08f19e230a1f8f3de614f64e1b264f8c` |

Sustituye en la cabecera de `mercados.html` a la foto `src/assets/home/mercados-noticias-manana-20260923.webp` por decisión del fundador. Acta: `docs/MERCADOS_RELOJ_DE_ARENA_20261123.md`.

- **Qué representa:** un reloj de arena de dos bulbos de vidrio azul claro, armazón de oro champán con tres varillas y arena azul marino a media caída. Habla de tiempo y de medir, no de subir ni de bajar. Sin cifras, textos, flechas, símbolos de moneda ni gráficos.
- **Cómo se hizo:** igual que el globo (Blender 5.3, Cycles con OptiX, entorno `studio.exr`, cuatro cajas de luz y telón luminoso propios, fondo transparente). Render apaisado de 2000 × 1528 px, 800 muestras con reducción de ruido; exportación a WebP de 1000 × 764, calidad 90. Un fundido del 6 % en los márgenes deja el alfa del borde en 0 (sin velo).
- **Imagen decorativa:** `alt=""` y contenedor con `aria-hidden`, como el globo.
- **Fuentes:** `scripts/blender/piezas-webs-20261122/` (`piezas_mercados.py`, `exportar_mercados.py`, `reloj_arena.blend`; ver `LEEME.md`). El guion también contiene el barómetro, propuesto y no elegido.
