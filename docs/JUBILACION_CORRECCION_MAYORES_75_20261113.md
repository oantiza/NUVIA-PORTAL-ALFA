# Jubilación · corrección: jubilados de más de 75 años y frase de las escalas fijas · 13-11-2026

## 1. Orden del fundador

Los dos defectos se encontraron el 13-11-2026 al llevar el simulador a otro proyecto del fundador (Gestor de Activos Financieros), leyendo este repositorio sin modificarlo. Se le presentaron con sus cifras y se le consultó antes de tocar nada aquí.

- Consulta: «¿Corrijo ya en NUVIA los dos defectos de su simulador?»
- Respuesta del fundador (13-11-2026): «Sí, corrígelos».

Alcance: solo esas dos correcciones, con su prueba y esta acta. **Sin commit, envío ni despliegue**: la orden no los menciona y corresponden al fundador (capa 0, punto 8).

Punto de partida: `main` en `99fefce`, con trabajo local ajeno sin confirmar (vídeos, `que-es-nuvia.html`, estilos del ecosistema), que no se ha tocado.

## 2. Qué fallaba

### 2.1 La edad de jubilación se limitaba a 75 aunque la edad actual fuera mayor

`normalizar` (`js/nuvia-jubilacion-motor.js`) acotaba la edad de jubilación entre la edad actual y 75. Con una edad actual mayor de 75 el resultado era siempre 75, es decir, una jubilación anterior a la edad de hoy.

Afectaba a quien indica entre 76 y 95 años (el campo admite de 40 a 95), tanto si marca «Sí, o me jubilo ya» —la pantalla envía la edad actual como edad de jubilación— como «Todavía no». Consecuencias, todas en el mismo sentido:

- los años hasta la jubilación salían negativos (de −1 a −20);
- la pensión del primer año se dividía por la inflación de esos años, en vez de tomarse la de hoy;
- el IRPF se calculaba sobre esa pensión menor;
- el plan empezaba a los 75: la primera fila de «Año a año» decía 75 años, y los ahorros se repartían entre más años de los que quedan;
- el aviso «La edad de jubilación no puede ser anterior a tu edad actual: se usa tu edad actual» no era cierto por encima de los 75.

Medido el 13-11-2026 con el motor antes y después de corregir. Bizkaia, pensión de 2.000 € × 14, sin ahorros, IPC del 2 %:

| Edad actual | Pensión del año 1, antes | Después | IRPF, antes | Después | Neto al mes, antes | Después |
|---|---|---|---|---|---|---|
| 75 | 28.000,00 € | 28.000,00 € | 4.124,00 € | 4.124,00 € | 1.989,67 € | 1.989,67 € |
| 76 | 27.450,98 € | 28.000,00 € | 3.931,07 € | 4.124,00 € | 1.959,99 € | 1.989,67 € |
| 80 | 25.360,46 € | 28.000,00 € | 3.196,47 € | 4.124,00 € | 1.847,00 € | 1.989,67 € |
| 90 | 20.804,41 € | 28.000,00 € | 1.458,16 € | 4.124,00 € | 1.612,19 € | 1.989,67 € |
| 95 | 18.843,20 € | 28.000,00 € | 732,01 € | 4.124,00 € | 1.509,27 € | 1.989,67 € |

Sin pensión, con 100.000 € de liquidez, rentabilidad del 3 %, IPC del 2 % y plan hasta los 95:

| Edad actual | Años de plan, antes | Después | Retirada del año 1, antes | Después |
|---|---|---|---|---|
| 80 | 20 | 15 | 5.641,21 € | 7.345,47 € |
| 90 | 20 | 5 | 5.641,21 € | 21.003,90 € |

El simulador mostraba a esas personas menos ingreso y menos IRPF de los que resultan de sus propios datos.

### 2.2 La frase de «Qué no tiene en cuenta» decía lo contrario de lo que hace el cálculo

Antes: «Las escalas de 2026 se mantienen fijas: si no se actualizan con el IPC, pagarías algo más de lo que muestra.»

El cálculo ya mantiene las reglas de 2026 fijas, en euros de cada año, mientras la pensión y las retiradas suben con el IPC. Lo que muestra es, por tanto, el caso en que las escalas **no** se actualizan. Si se actualizan, el impuesto sería menor que el mostrado, no mayor.

Ahora: «Las escalas de 2026 se mantienen fijas todos los años, sin actualizarlas con el IPC: si se actualizan, pagarías menos de lo que muestra.»

Las otras dos menciones —el pie de la estimación en `js/nuvia-jubilacion-ui.js` y el informe imprimible en `js/nuvia-jubilacion-informe.js`— dicen solo que las reglas se mantienen fijas. Son correctas y no se tocan.

## 3. Cambios

- **`js/nuvia-jubilacion-motor.js`**, `normalizar`: el límite superior de la edad de jubilación pasa de `75` a `max(edad, 75)`. Una línea y su comentario.
- **`js/nuvia-jubilacion-ui.js`**, «Cómo lo calculamos»: la frase del §2.2.
- **`docs/nuvia-jubilacion-motor.test.mjs`**: prueba nueva, «Jubilados de más de 75 años: el plan empieza a su edad». Sus cifras se calculan a mano sobre la norma y sobre la fórmula de la retirada, no a partir de la salida del motor. Con el código anterior falla; con el corregido pasa.
- **`docs/INDICE.md`**: una línea para esta acta, en Patrimonio.

No cambia ninguna cifra fiscal, ningún otro texto, la pantalla, las guías, el informe imprimible ni los estilos.

**Para quien tiene 75 años o menos no cambia nada.** Comprobado con 756 combinaciones —edades de 40 a 75, siete edades de jubilación, Bizkaia, Navarra y estatal, con EPSV o plan en cobro mixto—: la suma de control de neto mensual, saldo final, IRPF del primer año, edad de jubilación e impuesto del cobro en capital es la misma antes y después (18.177.807,500985).

## 4. Prueba regulatoria (§12 del marco)

Es la corrección de un cálculo existente y de una frase informativa. No añade ninguna función.

1. Necesidad: que la estimación de quien ha cumplido 76 años o más corresponda a su edad y a sus datos.
2. Datos: los introduce el usuario; no se pide ninguno nuevo.
3. Transformación: la misma; el plan empieza a la edad actual cuando esta supera los 75.
4. Resultado: los mismos importes y tablas, corregidos para ese grupo de edad, y una frase de límites corregida.
5. Instrumentos identificables: no.
6. Circunstancias personales: sí (edad, ingresos y residencia), como antes; en simulación local y sin juicio de idoneidad.
7. Sugerencias de operar: no.
8. Opiniones sobre valor o precio: no.
9. Puntuaciones u orden por atractivo: no.
10. Recomendaciones de terceros: no se reproducen.
11. Color y diseño: sin cambios visuales.
12. Contratación o contacto: no hay.
13. Remuneración: no hay.
14. Agente vinculado: sin vínculo con su actividad ni con la entidad.
15. Datos personales: nada se guarda ni se envía.
16. IA: no interviene.
17. Transparencia: la frase corregida dice en qué sentido se desvía la estimación si las escalas se actualizan.
18. Control de regresiones: la prueba nueva, con cifras a mano, y la suma de control para 75 años o menos.

Clasificación interna: **ámbar**, sin cambios (datos patrimoniales y personalización fiscal). Revisión interna; la validación jurídica externa queda fuera del alcance de la alfa (§0 del marco). Sin commit ni despliegue.

## 5. Validación

Ejecutado el 13-11-2026 en el equipo del fundador (Windows, Node 24.15, Chromium de Playwright), sobre la copia de trabajo, que incluye el trabajo local ajeno sin confirmar.

- **La prueba nueva, con el código anterior:** falla (edad de jubilación 75 donde debe ser 80). Con el corregido, pasa.
- `npm run test:jubilacion`: **37/37** (29 del motor, una de ellas nueva, y 8 de las guías).
- `npm run validate:patrimonio`: **en verde** (salida 0).
- `npm run validate` completo: **en verde** (salida 0), incluido el render de 51 páginas a 1440 px sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas.
- **Render a 1440, 1024 y 768 px** de `jubilacion.html`, `jubilacion.html#resultados` y `jubilacion.html?territorio=estatal&ccaa=madrid#resultados`: 9 combinaciones sin fallos.
- **Medición antes y después:** las tablas del §2.1 y la suma de control del §3.

No se ha ejecutado `npm run build` ni se ha comprobado nada en producción: no hay publicación.

## 6. Límites y pendientes

- **Pendiente del fundador:** commit, envío a `main` y publicación. Hasta entonces, producción sigue con los dos defectos.
- **La pantalla no se ha tocado.** Quien tiene más de 75 años y marca «Todavía no» ve el deslizador «Me jubilaré a los» con 75 como único valor; el cálculo usa su edad actual, es decir, lo trata como si se jubilara ya. Permitir una jubilación posterior a los 75 sería un cambio de alcance, que decide el fundador.
- La copia del motor llevada al otro proyecto del fundador tiene la misma corrección desde que se trajo.
