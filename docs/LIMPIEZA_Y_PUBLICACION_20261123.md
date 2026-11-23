# Publicación n.º 188 y limpieza del repositorio

**Fecha:** 23-11-2026.

## Publicación

**Orden del fundador:** «Punlica» (publica), con tres commits locales sin enviar.

- Envío: `2a1b377..8ac2175` en `main`.
  - `d32950c`: resultado del despliegue n.º 187 en su acta.
  - `f9fc9f1`: pestañas del simulador de Jubilación repartidas según su contenido; estados de las actas al día.
  - `8ac2175`: cola final de la película escuchada y aprobada por el fundador.
- Validación previa: `npm run validate` con código de salida 0 sobre el contenido de `f9fc9f1` (51 páginas sin fallos). `8ac2175` solo cambia una línea de documentación. No se ejecutó `npm run build` en local.
- Despliegue: flujo «Publicar NUVIA Portal Alfa en GitHub Pages» n.º 188 (ejecución 45110535507). Resultado: correcto. Comprobado por descarga: la hoja publicada `estilos/nuvia-jubilacion.css` contiene la regla `#simulador-pasos .jb-stepper`. No se ha mirado a ojo en un navegador.

## Limpieza

**Orden del fundador:** «Termina lo demas». Preguntado punto por punto, decidió:

| Asunto | Decisión | Hecho |
|---|---|---|
| Vídeo anterior `src/assets/video/que-es-nuvia-20261112.{mp4,vtt,webp}` (11,4 MB, sin enlazar ni publicar) | Borrarlos | Retirados del repositorio; recuperables desde el historial de git |
| Imágenes antiguas `economia-perspectiva.webp` y `academia-ideas.webp` | Conservarlas | Sin cambios |
| Fuentes de Blender del globo y el ábaco | A git | Copia en `scripts/blender/piezas-webs-20261122/` (guion, exportación, dos escenas y `LEEME.md`; 1,5 MB). No se publica |
| `CLAUDE.md` y `prototipos/ecosistema-nuvia-20261112/` | Solo `CLAUDE.md` | `CLAUDE.md` registrado; el prototipo sigue sin registrar |

Otras decisiones del mismo día, sin cambios en la web:

- Escultura de la portada: se modelaron dos alternativas en Blender («trenza» y «armilar», en `output/escultura-portada-20261123/`, fuera de git). El fundador respondió «De momento deja»: se conserva la actual.
- Película: el cruce de «Tú comprendes y decides.» con «Elegir una vivienda.» dura en torno a 0,2 s y no se toca. Los aros de la apertura siguen sin rodarse de nuevo.

Pendiente fuera del repositorio: `C:\prueba\globo.png`, que debe borrar el fundador.

## Prueba regulatoria (§12 del marco)

Retirada de ficheros no enlazados y alta de fuentes y documentación. No cambia contenidos, cálculos, datos ni enlaces de la web. Sin efecto regulatorio.

## Validación

`npm run validate` con código de salida 0 tras la limpieza: «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas». No se ha ejecutado `npm run build`. Estos cambios quedan en commit local, sin publicar.
