# Patrimonio · casillas en neutro cálido · 23-11-2026

**Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Pidió resolver «queda gris frío dentro de algunas casillas de Jubilación, sobre el fondo marfil» y respondió «en paralelo despues el comit, npm y publica». Esta acta cubre solo las casillas; el commit, `npm` y la publicación los hace la dirección al final con todo junto.

## Inventario (DOM real, 1440 y 1024 px, cuatro pasos de Jubilación)

Se recorrió cada elemento visible con fondo gris azulado (script `output/mejora-patrimonio-casillas-20261123/inventario.mjs`; resultados en `inv-antes.txt` e `inv-despues.txt`).

**Casillas decorativas (se cambian).** Todas leen `--jb-canvas` (`#f4f6f9`, definido en `estilos/nuvia-jubilacion.css` y `estilos/nuvia-guias-fiscales.css`), salvo la última:

| Elemento | Página | % de la página (1440 / 1024) |
|---|---|---|
| `.jb-tax__col` (3) | jubilacion | 3,0 / 5,9 |
| `.jb-asset`, `.jb-yearly__detail`, `.jb-check`, `.jb-scen__item` (3 de 4), `.jb-live__dur`, `.jb-flow__item`, `.jb-method__steps li`, `.jb-stepper__num`, `.jg-route3__num` | jubilacion, guías | 0,01–0,8 cada uno |
| `.jg-questions`, `.jg-matrix__row--head`, `.jg-bases__figs div` (3) | guia-fiscal | 2,6 + 0,4 + 1,1 / 2,8 + 0,5 + 1,0 |
| `.fiscal-sim__compare` (`--nv-cloud` en `estilos/nuvia-fiscal.css`) | fiscalidad | 0,95 / 1,07 |

Total gris frío en casillas de Jubilación: 10,1 % → 1,9 % a 1440 px y 15,9 % → 2,0 % a 1024 px. `vivienda.html`, `guia-calendario.html` y `guia-planificacion.html` no tenían casillas frías relevantes (0–0,02 %, solo los números de ruta).

**Colores con significado (no se tocan).**
- Avisos y estados informativos azules, `--jb-accent-soft` (`#eaf0f8`): `.jb-hint`, `.jb-tax__total`, `.jb-scen__item.is-base`, `.jb-tile.is-on`, `.jb-terr__estado`, `.jb-slider__value`, `.jb-panel__icon`, `.jg-scope`, `.jg-next`, `.jg-card__icon`, `.gu-note` (1,7 % en `guia-ahorro` y `guia-sucesiones`), etiquetas y selección.
- Pistas y barras de gráficos, en `#e8edf3`/`#e3e8ef`/similares: `.jb-compo__bar`, `.jg-stack`, `.jg-bases__bar`, `.jg-meter__bar`, `.fiscal-sim__bar`, `.fiscal-tl__rail`, `.jg-tax--trabajo`, `.jg-tax--ahorro`, `.is-exe`.
- `.nv-tag` (`#e8edf3`) y la tarjeta de Academia (técnico, `#e8edf3`): fuera de Patrimonio o etiqueta de estado.

Quedan a propósito algunas piezas azules junto a casillas cálidas (p. ej. «Deducciones en la cuota»): son avisos informativos.

## Neutro elegido

`--nv-surface-editorial-strong` (`#f3eedf`, papel cálido que ya usa el resto de Patrimonio). Alternativa descartada: `--nv-surface-hub` (`#efeae0`), que distingue más pero deja el texto apagado en 4,99:1.

Contrastes calculados (WCAG), antes → después, sobre la casilla:

| Texto | Antes `#f4f6f9` | Después `#f3eedf` |
|---|---|---|
| Tinta `#0b2347` | 14,41:1 | 13,46:1 |
| Suave `#40506a` | 7,54:1 | 7,04:1 |
| Apagado `#5b6472` | 5,53:1 | 5,16:1 |
| Azul de acento `#2c4f8f` | 7,40:1 | 6,91:1 |
| Bronce 700 `#7a5c27` | 5,73:1 | 5,34:1 |
| Verde 700 `#4a5d23` | 6,73:1 | 6,28:1 |

Todo ≥ 4,5:1 (AA). Casilla sobre tarjeta blanca: 1,08:1 → 1,16:1. Casilla sobre el fondo marfil `#f7f3ea`: 1,02:1 → 1,05:1. Los textos de color por columna (`--jb-c`) los cubre la auditoría AA de `check-render` (0 fallos).

## Cambio

`estilos/ecosistema/interiores-patrimonio.css`, dentro de `@media screen`, dos reglas acotadas a `body[data-eco-theme="patrimonio"]`, sin `!important`:
- `--jb-canvas: var(--nv-surface-editorial-strong)` (redefine el lienzo de casillas solo en Patrimonio; la variable se hereda por todas las piezas de la tabla).
- `.fiscal-sim__compare { background: var(--nv-surface-editorial-strong) }`.

No se tocó ninguna otra hoja (`nuvia-jubilacion.css`, `nuvia-guias-fiscales.css` y `nuvia-fiscal.css` siguen igual), ni HTML, JS ni pruebas.

## Otras webs

`economia.html` y `academia.html`, a 1440 y 1024 px: captura antes y después idénticas píxel a píxel (diferencia nula). Academia sigue con su gris técnico (18,2 % / 19,3 %).

## Capturas

`output/mejora-patrimonio-casillas-20261123/`: `antes-*` y `despues-*` de las ocho páginas (Jubilación, un archivo por paso), Economía y Academia, a 1440 y 1024 px; comparativa `comparativa-jubilacion-1440.png`.

## Prueba regulatoria §12

Cambio solo de color de fondo de casillas ya existentes: sin cambios de cálculos, datos, textos, IA, colaboradores, monetización ni datos personales. No hay función nueva ni ficha regulatoria que actualizar.

## Validación

- `node docs/nuvia-surfaces.test.mjs`: «Superficies 4A-3: 30 páginas clasificadas; roles y excepciones verificados». Ninguna prueba exigía el gris actual; no se cambió ninguna.
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre las ocho páginas: «Render verificado: 8 páginas a 1440 y 1280 y 1180 y 1024 y 900 y 820 y 768 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.» (56 líneas OK, código de salida 0; `output/mejora-patrimonio-casillas-20261123/check-render.txt`).

No verificado: `npm run validate` y `npm run build` (los pasa la dirección al final); no se miró a ojo cada paso de Jubilación en cada ancho, solo la comparativa de 1440 px y las cifras del inventario.
