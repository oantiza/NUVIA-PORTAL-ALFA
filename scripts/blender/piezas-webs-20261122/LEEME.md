# Fuentes de Blender · globo de Economía y ábaco de Academia

Copia en el repositorio de los fuentes de `src/assets/ecosistema/economia-mundo.webp` y `academia-abaco.webp`. No se publica en la web.

- `piezas.py`: modela, ilumina y renderiza las piezas (`globo`, `abaco` y las cuatro descartadas).
- `globo.blend`, `abaco.blend`: escenas de las dos piezas publicadas.
- `exportar_elegidas.py`: pasa los PNG a WebP de 1000 px. Espera los PNG en una subcarpeta `elegidas/`.

Para rehacer una pieza (Blender 5.3, Cycles con OptiX):

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b --factory-startup -P piezas.py -- globo elegidas/globo.png 2000 800 elegidas/globo.blend
```

Procedencia y detalle: `src/assets/ecosistema/PROCEDENCIA_PIEZAS_BLENDER.md`.

## Reloj de arena de Mercados y noticias (23-11-2026)

Fuentes de `src/assets/ecosistema/mercados-reloj-arena.webp`:

- `piezas_mercados.py`: copia ampliada de `piezas.py`. Añade las piezas `reloj` (la publicada) y `barometro`, y las descartadas `columnas_ancha` y `noticias`. Admite la variable de entorno `RATIO` (alto/ancho) para el encuadre apaisado. `piezas.py` no se ha tocado.
- `reloj_arena.blend`: escena del reloj de arena en encuadre apaisado.
- `exportar_mercados.py`: pasa los PNG a WebP de 1000 px con el borde de alfa limpio (ventana del 6 % y alfa por debajo de 3 a cero). Espera los PNG en `render/` y escribe en `webp/`; procesa `reloj` y `barometro`.

Para rehacer el reloj apaisado (el barómetro, descartado, se pide igual con `barometro`):

```powershell
$env:RATIO = '0.764'
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b --factory-startup -P piezas_mercados.py -- reloj render/reloj_apaisada.png 2000 800 render/reloj.blend
```
