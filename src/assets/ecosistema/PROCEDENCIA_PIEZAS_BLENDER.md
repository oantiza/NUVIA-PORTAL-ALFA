# Piezas de Economía y Academia modeladas en Blender

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

Viven en `output/piezas-webs-20261122/`, carpeta ignorada por git:

- `piezas.py`: guion que modela, ilumina y renderiza las seis piezas propuestas (`globo`, `columnas`, `engranajes`, `abaco`, `libros`, `bloques`).
- `exportar_elegidas.py`: exportación de las dos elegidas.
- `elegidas/globo.blend` y `elegidas/abaco.blend`: escenas de Blender de las dos piezas publicables; `blend/` conserva las seis.

Para rehacer una pieza:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b --factory-startup -P piezas.py -- globo elegidas/globo.png 2000 800 elegidas/globo.blend
```

Las imágenes anteriores (`economia-perspectiva.webp`, `academia-ideas.webp`) siguen en esta carpeta, sin enlazar.
