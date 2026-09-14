# Informes de mercado v2 · tablas, gráfico y lenguaje llano · 14-09-2026

Encargo del fundador: los informes diario y semanal eran «muy simples y aburridos»; pide
informes dignos de un profesional de la inversión, con lenguaje claro y comprensible para
cualquiera, y con tablas y gráficos que los hagan atractivos e interesantes. Alcance:
repositorio Alfa, escritorio y tablet. Decisiones del fundador en la sesión: audiencia
principal, el lector no profesional; las variaciones de mercado se pintan **en verde/rojo solo
en la cifra**, con signo explícito, porque una subida o bajada de un índice es un hecho y no un
juicio sobre un emisor (véase la prueba del §12, punto 11).

Aviso previo: el mismo trabajo se había empezado por error en el programa profesional del
fundador (BDB-ACTIVOS, con marca NUVIA en su PDF). Por orden suya se revirtió entero allí; la
separación entre NUVIA y la actividad profesional (§8 del marco) queda intacta.

## Qué cambia

### Contrato `informe-mercado.v2` (`scripts/informes-mercado/contrato.mjs`)

Cuatro bloques nuevos, todos descriptivos (§5: «describir hechos verificables», «mostrar
resultados numéricos», «explicar fórmulas y conceptos»):

| Bloque | Contenido | Al leer | Al generar |
|---|---|---|---|
| `claves` | 3-5 ideas «En pocas palabras»: título + 1-3 frases llanas sobre qué ha pasado y por qué importa para entender la economía | opcional | obligatorio |
| `mercados` | 2-6 grupos (bolsas, deuda pública, divisas, materias primas, volatilidad) con filas `nombre / nivel / variacion / variacionAnual / nota / fuentes`; mínimo cinco referencias | opcional | obligatorio |
| `agenda` (forma v2) | `fecha AAAA-MM-DD / hora / region / que / anterior / porQueImporta`; la forma v1 `cuando / que` sigue siendo válida | cualquiera de las dos | forma v2 en todas las citas |
| `glosario` | 2-10 términos técnicos del texto, explicados | opcional | obligatorio |

Reglas de los números: `variacion` y `variacionAnual` son **números en puntos porcentuales**
(0,8 = +0,8 %) o `null`; un texto («+1,4 %») se rechaza. En deuda pública la variación es la
de la rentabilidad, en puntos porcentuales (1 punto básico = 0,01). **Una fila con cifra y sin
fuente no se publica**: la misma regla que ya regía para las cifras de referencia; la
alternativa es nivel «Sin contrastar» y variaciones `null`.

El veto de lenguaje (`EXPRESIONES_VETADAS`) alcanza también a claves, notas de mercado,
agenda y glosario. Los campos del informe de estrategia siguen fuera y se amplían:
`scenarios`, `escenarios` y `riesgos` (escenarios con probabilidad y riesgos con «impacto» son
expectativas propias sobre precio; §5, veredictos de valoración).

El cuerpo admite más párrafos (diario 3-10, semanal 4-14; antes 3-6 y 4-9) porque ahora
explica el porqué de cada movimiento. Los mínimos no suben: las dos ediciones v1 publicadas
siguen validando sin cambios.

### Fuentes primarias de precios (`fuentes.mjs`)

Las ediciones del 10-09 salieron con bolsa, deuda y petróleo «sin contrastar» porque el
buscador solo traía prensa. Se añaden a `PRIMARIAS` los publicadores de primera mano de los
cierres, rentabilidades y volatilidades: Nikkei Indexes, JPX, HKEX, SIX, Borsa Italiana,
Cboe (VIX), Bundesbank, Banque de France, Tesoro de EEUU (`home.treasury.gov`), FRED / Fed de
San Luis y de Nueva York, LBMA (oro), Destatis, INSEE, ISTAT, ONS, estadísticas de Japón y
China, Banco Popular de China, SEPE y Ministerio de Trabajo. La lista `VETADAS` no cambia.

### Prompts (`prompts.mjs`, versión `nuvia-mercados-2026-09-r3`)

- Documentación: pide la tabla de mercados referencia a referencia, con el operador `site:`
  apuntando a su publicador (BME, STOXX, S&P DJI, Nasdaq, Nikkei, MSCI, Bundesbank, BdE/Tesoro,
  Tesoro de EEUU, BCE para cambios, EIA/ICE, LBMA, Cboe), la variación del período y, si la
  hay, la del año; los hechos con su porqué documentado; la agenda con fecha exacta, hora, región
  y dato anterior desde los calendarios oficiales.
- Redacción: bloque `LENGUAJE_LLANO` (escribir para quien no trabaja en finanzas, explicar cada
  término la primera vez y llevarlo al glosario, cada cifra con unidad y fecha, cada hecho con su
  porqué según la fuente, números como números y `null` donde falte la fuente) más el
  `PERIMETRO` de siempre; JSON v2 con secciones fijas: diario «Qué ha pasado · Por qué importa ·
  Qué se publica ahora»; semanal «La semana en una idea · Economía y bancos centrales · Mercados ·
  Qué se publica ahora».
- `generar.mjs` valida con `exigirBloques: true`: un borrador sin tablas, claves o glosario no
  llega a `output/informes-borrador/`.

### Presentación (`js/nuvia-market-reports-render.mjs`, `estilos/nuvia-market-reports.css`)

Mismo diseño editorial del 11-09, con secciones nuevas en este orden: apertura · **En pocas
palabras** (dos columnas numeradas, sobre papel) · cifras de referencia · **Los mercados de un
vistazo** (gráfico de barras con signo en SVG estático de las bolsas —un solo gráfico por
edición; deuda y divisas no comparten escala— y una tabla por grupo con nivel, variación,
variación anual si la hay, qué lo explica y la fuente de cada fila) · los hechos del período ·
cuerpo · **agenda en tabla** por jornada (día, hora, región, cita, dato anterior, por qué se
sigue, fuente) · **glosario** · fuentes y alcance. Sin scripts en el descargable; los colores
salen de los tokens (`--nv-positive`, `--nv-negative`) que la plantilla incrusta. Las ediciones
v1 se pintan igual que antes (agenda en lista, sin tablas).

Formato de cifras: coma decimal, espacio antes del `%`, signo explícito y menos tipográfico
(«+0,86 %», «−1,93 %», «—» sin dato); dos decimales en tablas y gráfico.

## Prueba del §12 (v2)

1. Necesidad: lectura periódica comprensible de hechos económicos, ahora con las cifras en
   tabla y un gráfico, y con los términos explicados.
2. Entradas: publicaciones públicas de primera mano; elección de edición por el lector.
3. Transformación: documentación y redacción por IA, validación de contrato, revisión editorial;
   sin cálculos de inversión. El gráfico dibuja la variación publicada, no la calcula.
4. Salida: hechos, cifras con fuente, agenda, glosario, contexto y limitaciones fechados.
5. Instrumentos: índices, deuda pública, divisas y materias primas; ningún emisor concreto.
6. Circunstancias personales: ninguna.
7. Operaciones: no aconseja; el veto de lenguaje cubre todos los bloques nuevos.
8. Precio: no establece objetivos ni expectativas; los escenarios con probabilidad quedan
   prohibidos en el contrato.
9. Orden: grupos y filas en el orden de lectura habitual (bolsas, deuda, divisas, materias
   primas, volatilidad); agenda por fecha. Nunca por atractivo.
10. Terceros: no reproduce recomendaciones; las interpretaciones se atribuyen.
11. Diseño: verde/rojo solo en la cifra de una variación publicada, con el signo delante —una
    subida o una bajada es un hecho—; ningún color califica un activo ni una decisión. Decisión
    expresa del fundador el 14-09-2026.
12. Acciones: leer, cambiar de edición y descargar; sin contratación ni contacto.
13. Remuneración: ninguna.
14. Separación: identidad NUVIA; el trabajo en el programa profesional se revirtió.
15. Datos personales: no recibe ni almacena; sin cambios en Firebase.
16. IA: identificada en el documento; los controles son técnicos (contrato), no solo textuales.
17. Evidencia: fecha de corte, período, fuente por fila, glosario y límites explícitos.
18. Regresión: 31 pruebas específicas (`npm run test:informes`), sincronización de páginas y
    descargables, y las comprobaciones de `npm run validate`.

Clasificación interna: ámbar (contenido financiero elaborado con IA), como hasta ahora.

## Verificación

- `npm run test:informes`: 31 pruebas (23 anteriores + 8 nuevas: bloques v2, cifra en texto,
  cifra sin fuente, veto en claves/notas/glosario, campos de estrategia, render con tablas y
  gráfico, descargable con tokens, formato de variaciones). Los descargables y las páginas se
  regeneraron con la presentación nueva y `npm run informes:check` pasa.
- Revisión visual del lector con una edición v2 de muestra a 1440 y 768 píxeles, y de las dos
  ediciones v1 publicadas (sin cambios visibles).
- `npm run validate` completo en el PC del fundador: en verde, incluida la revisión de render
  de 37 páginas a 1440 px sin fallos de contraste, tipografía, estructura ni desbordes.

## Operación

Nada cambia en el flujo: `npm run informe:generar -- --tipo diario|semanal` deja el borrador en
`output/informes-borrador/`; una persona lo lee; `npm run informe:publicar -- --id <id>` lo
incorpora. La primera edición v2 publicada será la primera con tablas: las del 10-09 siguen
siendo v1 y se muestran como hasta ahora.

## Cierre · borradores reales del 14-09-2026

Se generaron los dos borradores con el flujo nuevo (`npm run informe:generar`), sin publicar:

| Edición | Documentación | Redacción | Contenido | Fuentes |
|---|---|---|---|---|
| `diario-2026-09-14` | gemini-3.7-flash | gemini-3.1-pro-preview | 3 claves · 4 hechos · 3 indicadores · 12 referencias de mercado · 4 citas · 6 párrafos · 5 términos | 12, todas de publicadores de primera mano (BME, Nikkei, Cboe, STOXX, Deutsche Börse, S&P DJI, Nasdaq, MSCI, Bundesbank, Tesoro) |
| `semanal-2026-09-14` | gemini-3.8-flash | gemini-3.1-pro-preview | 4 claves · 4 hechos · 6 indicadores · 9 referencias · 6 citas · 8 párrafos · 5 términos | 9 (5 primarias; 4 medios secundarios para DAX y Nikkei) |

En la primera pasada los dos borradores cayeron porque el modelo escribía una cifra de deuda
sin el número de su fuente. Se cambió la regla: la fila sobrevive, la cifra no («Sin contrastar»,
variaciones a `null` y una nota que lo dice). Así el borrador llega al revisor y ninguna cifra sin
respaldo llega al lector.

Observaciones para la lectura del fundador antes de publicar (no corregidas por el ejecutor):

- Diario: la fila «EURO STOXX 50 (SX5EST)» a 3.948 puntos es una variante del índice (no el
  SX5E habitual); «Bono español a 10 años: 3,40 %» es el cupón de la referencia, no la
  rentabilidad; «cierre de posiciones cortas» es jerga que el glosario explica pero convendría
  evitar; la entradilla dice «aumenta la probabilidad de nuevas alzas», lectura de expectativas
  que el revisor debe decidir si mantiene atribuida al mercado.
- Semanal: DAX y Nikkei se apoyan en medios secundarios (finanzen.net, fuw.ch, morningstar);
  «El Brent rozó los 110 dólares» está en las claves sin fila de mercado contrastada.
- En ambos, divisas y Brent quedan «sin contrastar»: el buscador no trajo los tipos de referencia
  del BCE ni el spot de la EIA en estas pasadas. Es la misma limitación del 10-09, ahora visible en
  la tabla en lugar de en una lista de pendientes.

Las vistas previas de ambos borradores (HTML descargable) se entregaron al fundador en la sesión.
No se realiza commit, envío al repositorio ni despliegue.
