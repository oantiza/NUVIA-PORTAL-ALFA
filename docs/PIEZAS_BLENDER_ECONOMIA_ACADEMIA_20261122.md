# Piezas nuevas de Economía y Academia, modeladas en Blender

**Fecha:** 22-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

«Lo que no me convence nada son los 2 elementos de economía y finanzas y academia. Propón alternativas coherentes con su sección (en 3D y con Blender, of course. Haz algo muy bueno).»

Se le enseñaron seis alternativas, sueltas y colocadas en su portada. A la propuesta de poner el globo en Economía y el ábaco en Academia respondió: «Sí, esas dos».

## Alternativas presentadas

| Web | A | B | C |
|---|---|---|---|
| Economía y finanzas | **El mundo** (globo de vidrio con retícula dorada) | Los mercados (columnas de vidrio y línea dorada) | Todo está conectado (cuatro ruedas dentadas) |
| Academia NUVIA | **El ábaco** (madera clara, cuatro filas de cuentas) | Los libros (cuatro libros de tela y una esfera) | Las piezas (formas básicas de construcción) |

En negrita, las elegidas. Sobre la opción B de Economía se advirtió al fundador de que una gráfica de mercado en la portada puede leerse como evolución de una inversión; no se eligió.

## Qué cambia

- `economia.html` muestra `src/assets/ecosistema/economia-mundo.webp` en lugar de `economia-perspectiva.webp`.
- `academia.html` muestra `src/assets/ecosistema/academia-abaco.webp` en lugar de `academia-ideas.webp`.
- Mismas dimensiones (1000 × 1000, con alfa), mismo marcado y mismos estilos. No cambian textos ni enlaces.

## Ficheros

- Nuevos: `src/assets/ecosistema/economia-mundo.webp`, `academia-abaco.webp` y `PROCEDENCIA_PIEZAS_BLENDER.md`.
- Fuentes de las portadas: `scripts/ecosistema/economia.mjs` y `academia.mjs` (una línea cada una); `economia.html` y `academia.html` regenerados con `node scripts/ecosistema/generar-portadas.mjs` (solo cambia la línea de la imagen) y `npm run shell:sync` (0 páginas actualizadas).
- `src/assets/ecosistema/PROCEDENCIA.md`: dos filas nuevas y una nota.
- **Prueba modificada:** `docs/nuvia-academy-banner.test.mjs` fija por nombre y SHA-256 la imagen aprobada de cada portada. Se han sustituido los dos nombres y las dos huellas por los de las imágenes nuevas. La prueba sigue exigiendo una imagen concreta, con su contenido intacto, en cada una de las cinco portadas. Queda a la vista del fundador por si prefiere otra forma de registrarlo.

## Fuentes de Blender

En `output/piezas-webs-20261122/` (carpeta ignorada por git): `piezas.py`, `exportar_elegidas.py`, las escenas `.blend` y los renders. Detalle en `src/assets/ecosistema/PROCEDENCIA_PIEZAS_BLENDER.md`. Al estar fuera de git, no tienen copia en el repositorio.

## Prueba regulatoria (§12 del marco)

Imágenes decorativas, sin cifras, textos, marcas ni afirmaciones. No añaden funciones, datos ni cálculos, y no sugieren recomendación, idoneidad ni llamada a operar. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768 economia.html,academia.html`: 14 vistas de 14 correctas.
- `node docs/nuvia-academy-banner.test.mjs`: correcta con las huellas nuevas.
- En navegador, a 1440, 1024 y 768 px: las dos imágenes cargan (1000 px naturales), sin desbordes y sin errores de consola.
- No se ha ejecutado `npm run build`.

## Pendiente de decisión del fundador

1. `economia-perspectiva.webp` y `academia-ideas.webp` quedan en el repositorio sin enlazar: conservar o borrar.
2. Guardar o no en git el guion y las escenas de Blender.
3. En el primer render de prueba quedó un fichero suelto en `C:\prueba\globo.png`, fuera del proyecto; el sistema no permitió retirarlo automáticamente.
