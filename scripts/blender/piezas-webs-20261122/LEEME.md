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
