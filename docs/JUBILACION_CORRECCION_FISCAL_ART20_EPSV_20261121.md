# Jubilación · corrección fiscal: reducción del art. 20 LIRPF y EPSV con rentabilidad negativa · 21-11-2026

## 1. Orden del fundador

Una auditoría independiente de la copia del simulador que vive en otro proyecto del fundador (Gestor de Activos Financieros, `3-BDB-ACTIVOS_app/src/core/jubilacion/`) encontró dos fallos de cálculo fiscal que también están en el motor de NUVIA, del que salió esa copia. El 21-11-2026 se corrigieron en el Gestor (commits `bd965197` y `0d37c181` de su rama `claude/jubilacion-fiscal-21-11`).

- Orden recibida por esta sesión desde la sesión del Gestor (texto del encargo, no firmado por el fundador): «Óscar, el dueño de los dos proyectos, aprobó llevar las dos correcciones a NUVIA.» El mismo encargo pide «Haz commits según las normas de este repositorio, sin subir ni desplegar nada».
- Se registra tal como llegó, sin firmar ni ratificar por él. Alcance: solo estas dos correcciones, sus pruebas y esta acta. **Commits locales sí; envío a `main` y despliegue no**: siguen pendientes de su orden (capa 0, punto 8). No se toca Firebase.
- Fuera de alcance: la compensación de pérdidas al vender (coste proporcional y cuatro años), que se está cambiando en el Gestor y llegará en otra sesión.

Punto de partida: `main` en `b017a23`, con trabajo local ajeno sin confirmar —entre él, la corrección de jubilados de más de 75 años del 13-11-2026 en `js/nuvia-jubilacion-motor.js`, `js/nuvia-jubilacion-ui.js` y `docs/nuvia-jubilacion-motor.test.mjs`—, que no se ha tocado ni se incluye en los commits de esta acta.

## 2. Qué fallaba y qué dice la norma

### 2.1 Territorio común: la reducción del art. 20 se medía después de los 2.000 € de gastos

`irpfComun` (`js/nuvia-jubilacion-fiscal.js`) restaba los 2.000 € de «otros gastos» del art. 19.2.f y medía la reducción del art. 20 sobre lo que quedaba.

Norma: art. 20 de la Ley 35/2006, redacción del art. 3.1 del RDL 4/2024, con efectos desde el 1-1-2024 (texto consolidado del BOE, última actualización publicada el 18-11-2026, consultado el 21-11-2026: <https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a20>): «A estos efectos, el rendimiento neto del trabajo será el resultante de minorar el rendimiento íntegro en los gastos previstos en las letras a), b), c), d) y e) del artículo 19.2 de esta Ley». Es decir, sin la letra f). La AEAT lo aplica igual (Manual práctico de Renta 2025, cap. 3). El último párrafo se mantiene: «el saldo resultante no podrá ser negativo».

Tramos (sin cambios): R ≤ 14.852 → 7.302; 14.852 < R ≤ 17.673,52 → 7.302 − 1,75 · (R − 14.852); 17.673,52 ≤ R < 19.747,5 → 2.364,34 − 1,14 · (R − 17.673,52); 0 a partir de 19.747,5 o si las otras rentas superan 6.500 €. Una pensión no tiene gastos de las letras a) a e): la reducción se mide sobre la pensión íntegra.

Cuentas a mano, a los 64 años y sin otras rentas:

| Pensión anual | Reducción antes | Ahora | Base general antes | Ahora |
|---|---|---|---|---|
| 8.000 € | 6.000 € (tope del saldo) | 6.000 € (tope del saldo) | 0 € | 0 € |
| 14.852 € | 7.302 € | 7.302 € | 5.550 € | 5.550 € |
| 15.000 € | 7.302 € | 7.302 − 1,75 × 148 = 7.043 € | 5.698 € | 5.957 € |
| 16.000 € | 7.302 € | 7.302 − 1,75 × 1.148 = 5.293 € | 6.698 € | 8.707 € |
| 18.000 € | 5.293 € | 2.364,34 − 1,14 × 326,48 = 1.992,15 € | 10.707 € | 14.007,85 € |
| 20.500 € | 1.422,15 € | 0 € | 17.077,85 € | 18.500 € |

### 2.2 EPSV vasca: una rentabilidad negativa antes de jubilarse creaba base e IRPF ficticios

En el modelo vasco, `situacionInicial` (`js/nuvia-jubilacion-motor.js`) lleva al tramo posterior a 2026 lo que la EPSV gana o pierde hasta la jubilación. Con rentabilidad negativa, los derechos y la rentabilidad de ese tramo quedan en negativo, y `basesCapitalVasco` los usaba tal cual:

- régimen transitorio: rentabilidad negativa en la base del ahorro y una «aportación» fantasma del mismo importe en la base general; sin certificado, la cuota de lo anterior a 2026 pasaba de 1;
- régimen de 2026: rentabilidad negativa en el ahorro y más base general que lo cobrado.

Norma: el rendimiento del capital mobiliario es solo «la diferencia positiva entre los derechos económicos de la persona contribuyente y las aportaciones y contribuciones realizadas» (art. 37.e de la NF 33/2013 de Álava en la redacción de la NF 17/2025, BOTHA n.º 145 de 22-12-2025, leído en el PDF oficial el 21-11-2026: <https://www.araba.eus/botha/Boletines/2025/145/2025_145_03675_C.pdf>; el mismo texto en el art. 37.e de la NF 3/2014 de Gipuzkoa, redacción de la NF 1/2025, BOG de 15-05-2025; para Bizkaia, ficha KA-01878 de la DFB). El resto de la prestación es rendimiento del trabajo (art. 18.a) y no puede superar lo cobrado.

Arreglo, el mismo que en el Gestor: en el transitorio, la cuota de lo anterior a 2026 queda entre 0 y 1 y la rentabilidad del tramo posterior no baja de cero; en el régimen de 2026, la rentabilidad queda entre 0 y lo cobrado. El cobro en renta ya acotaba la proporción entre 0 y 1 en `rentaPeriodica`; no cambia.

Caso de comprobación (Bizkaia, cobro en capital, primer cobro): 100.000 € de derechos anteriores a 2026 (70.000 aportados y 30.000 de rentabilidad), nada posterior, diez años al −2 %: derechos 100.000 × 0,98¹⁰ = 81.707,28 €.

| Caso | Base general antes | Ahora | Base del ahorro antes | Ahora |
|---|---|---|---|---|
| Transitorio, con certificado: cuota 70.000 / 70.000 = 1 → 81.707,28 × 60 % | 61.829,27 € | 49.024,37 € | −18.292,72 € | 0 € |
| Transitorio, sin certificado: cuota 100.000 / 81.707,28 = 1,22 → 1 | 60.000,00 € | 49.024,37 € | −18.292,72 € | 0 € |
| Régimen de 2026, con certificado (sin cambio) | 49.000,00 € | 49.000,00 € | 11.707,28 € | 11.707,28 € |
| Régimen de 2026 con solo 5.000 € de rentabilidad: 81.707,28 × 70 % | 66.500,00 € | 57.195,10 € | −13.292,72 € | 0 € |
| Ese mismo caso cobrado en renta | todo trabajo | todo trabajo | 0 € | 0 € |

## 3. Cambios

- **`js/nuvia-jubilacion-fiscal.js`**
  - `irpfComun`: la reducción del art. 20 se mide sobre el rendimiento íntegro `t` y sigue acotada al saldo `rn`; comentario con la cita del BOE.
  - `basesCapitalVasco`: cuota del transitorio entre 0 y 1; rentabilidad del tramo posterior no menor que 0; en el régimen de 2026, rentabilidad entre 0 y lo cobrado; comentario con la cita de las normas forales.
  - `resumenParametros` (territorio común): la frase del art. 20 que ven «Parámetros fiscales» de la pantalla y el informe añade «medidos sobre el rendimiento antes de los 2.000 € de gastos».
- **`docs/nuvia-jubilacion-motor.test.mjs`**: dos pruebas nuevas, con la cuenta a mano en sus comentarios —«Estatal: la reducción del art. 20 se mide antes de los 2.000 € de gastos de la letra f)» (siete cortes, el tope y el caso de Madrid del §4) y «EPSV: una rentabilidad negativa antes de jubilarse no crea base ni impuesto»—, y dos casos existentes recalculados a mano con la regla nueva (15.000 € estatal; Madrid con 2.000 € de ahorro, cuyo trabajo pasa de 15.002 a 14.900 € para conservar una base exacta, como en el Gestor).
- **`docs/INDICE.md`**: una línea para esta acta, en Patrimonio.

No cambian Bizkaia, Álava, Gipuzkoa ni Navarra en el art. 20 (no lo aplican), ni ningún otro parámetro, texto, estilo o página.

**Mismo cálculo en pantalla, informe y guías.** La pantalla (`js/nuvia-jubilacion-ui.js`, `M().calcular`), el informe imprimible (`js/nuvia-jubilacion-informe.js`, que recibe el mismo `res`) y los casos de las guías (`js/nuvia-guias-jubilacion-ui.js`, `Mx.calcular`) leen el mismo motor; ninguno recalcula la reducción ni las bases de la EPSV por su cuenta. Comprobado en `jubilacion.html?territorio=estatal&ccaa=madrid` con pensión de 1.200 €: el desglose muestra «Reducción por rendimientos del trabajo −324 €» al mes (3.893 € al año) e «Impuesto −60 €» al mes en la base general (715,53 € al año), y «Parámetros fiscales» muestra la frase nueva; sin errores de consola.

## 4. Cuánto cambia una simulación típica

Medido con el motor antes (`HEAD`) y después, el 21-11-2026:

| Simulación | IRPF del año 1, antes | Ahora | Neto al mes, antes | Ahora |
|---|---|---|---|---|
| Madrid, 65 años, pensión 1.200 € × 14, sin ahorros | 101,91 € | 715,53 € | 1.391,51 € | 1.340,37 € |
| Madrid, 65 años, pensión 1.200 € × 14, ahorros del ejemplo | 674,07 € | 1.287,69 € | 2.000,66 € | 1.949,53 € |
| Escala de referencia, 65 años, 1.200 € × 14, sin ahorros | 151,62 € | 799,33 € | 1.387,37 € | 1.333,39 € |

Madrid sin ahorros, a mano: reducción 7.302 − 1,75 × (16.800 − 14.852) = 3.893; base 16.800 − 2.000 − 3.893 = 10.907; estatal (10.907 − 6.700) × 9,5 % = 399,67; Madrid (10.907 − 7.190,91) × 8,5 % = 315,87; total 715,53 €. Coincide con la cifra que dio el Gestor (de 101,91 € a 715,53 €).

EPSV en Bizkaia con el caso del §2.2 (sin otras rentas): el impuesto del cobro en capital pasa de 13.316,26 € a 11.058,33 €. Además cambia el régimen elegido automáticamente: antes el error encarecía el transitorio (15.769,51 €) y se aplicaba el de 2026; ahora el transitorio sale más barato y es el que se aplica. El neto cobrado sube de 68.391,02 € a 70.648,95 €.

## 5. Prueba regulatoria (§12 del marco)

Es la corrección de dos cálculos existentes y de una frase de parámetros. No añade ninguna función.

1. Necesidad: que el IRPF estimado corresponda a la norma vigente en territorio común y en la EPSV vasca con pérdidas.
2. Datos: los introduce el usuario; no se pide ninguno nuevo.
3. Transformación: la misma, con la base de la reducción del art. 20 y las bases de la EPSV acotadas como dice la norma.
4. Resultado: los mismos importes y tablas, corregidos; una frase de parámetros más precisa.
5. Instrumentos identificables: no.
6. Circunstancias personales: sí (edad, ingresos, residencia), como antes; en simulación local y sin juicio de idoneidad.
7. Sugerencias de operar: no. La elección automática de régimen ya existía y sigue mostrando ambos importes.
8. Opiniones sobre valor o precio: no.
9. Puntuaciones u orden por atractivo: no.
10. Recomendaciones de terceros: no se reproducen.
11. Color y diseño: sin cambios visuales.
12. Contratación o contacto: no hay.
13. Remuneración: no hay.
14. Agente vinculado: sin vínculo con su actividad ni con la entidad.
15. Datos personales: nada se guarda ni se envía.
16. IA: no interviene.
17. Transparencia: normas citadas en el código y en esta acta; la frase de parámetros dice sobre qué se mide la reducción.
18. Control de regresiones: las dos pruebas nuevas y los casos recalculados, con cifras a mano; fallan con el código anterior.

Clasificación interna: **ámbar**, sin cambios (datos patrimoniales y personalización fiscal). Revisión interna; la validación jurídica externa queda fuera del alcance de la alfa (§0 del marco).

## 6. Validación

Ejecutado el 21-11-2026 en el equipo del fundador (Windows, Node 24.15).

- **Las pruebas nuevas, con el código anterior:** fallan cuatro (las dos nuevas y los dos casos recalculados: 7.302 ≠ 7.043; 18.292,72 ≠ 0; 5.598 ≠ 5.682). Con el corregido, pasan.
- `npm run test:jubilacion`: **39/39** (31 del motor, dos de ellas nuevas, y 8 de las guías), sobre la copia de trabajo.
- `npm run validate:patrimonio`: **en verde** (salida 0).
- `npm run validate` completo: **en verde** (salida 0), incluido el render de 51 páginas a 1440 px sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.
- **Cada commit por separado**, extraído del índice sin el trabajo ajeno: las pruebas del motor pasan sobre el código confirmado (sin la corrección de mayores de 75 años).
- **Paridad con el Gestor** (`tests/jubilacionParidadConNuvia.test.ts` de su rama `claude/jubilacion-fiscal-21-11`, que solo lee NUVIA): **4/4** contra la copia de trabajo de NUVIA; antes de esta corrección fallaban 2 de 4.
- **Pantalla:** §3.

No se ha ejecutado `npm run build` ni se ha comprobado nada en producción: no hay publicación.

## 7. Límites y pendientes

- **Pendiente del fundador:** envío a `main` y publicación. Hasta entonces, producción sigue con los dos fallos.
- La paridad 4/4 se midió sobre la copia de trabajo, que incluye la corrección de mayores de 75 años del 13-11-2026, sin confirmar. Los commits de esta acta no la incluyen: hasta que se confirme, `main` sigue difiriendo del Gestor para edades actuales de 76 años o más.
- La compensación de pérdidas al vender, que se cambia en el Gestor, llegará en otra sesión.
