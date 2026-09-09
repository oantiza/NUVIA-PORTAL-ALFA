# Resumen descriptivo de cartera · 09-09-2026

Orden inicial del fundador en esta conversación: «Implementalo», referida a la
maqueta «Tu cartera, de un vistazo» con pentágono e integración en Mi cartera.
Orden posterior del 09-09-2026: «publica». Autoriza publicar esta implementación
en el repositorio oficial Alfa, mediante GitHub Actions y GitHub Pages. No incluye
cambios en Firebase, backend ni escrituras de datos personales.

## Revisión previa (§§12–13 del marco obligatorio)

Clasificación interna: **ámbar**, por mostrar posiciones elegidas y pesos de una
cartera. La validación jurídica externa queda fuera del alcance de la alfa (§0),
no se presenta como obtenida. Esta ficha documenta la revisión de producto y código.

1. Necesidad: explicar composición, variabilidad histórica y cobertura de datos.
2. Entrada: instrumentos y pesos elegidos por el visitante; series y fichas de la base Alfa.
3. Transformación: pesos sobre la cartera completa, clases conocidas con peso positivo,
   volatilidad de la serie histórica y cobertura ponderada del historial y desglose.
4. Salida: cinco cifras, pentágono, barras con las mismas escalas y explicaciones.
5. Instrumentos identificables: sí, los seleccionados por el visitante.
6. Circunstancias personales: ninguna entrada nueva de perfil, objetivos o patrimonio.
7. Operaciones: no sugiere comprar, vender, mantener ni rebalancear.
8. Valoración: no opina sobre precios presentes o futuros.
9. Atractivo: no calcula puntuaciones, clasificación de salud o mérito inversor.
10. Recomendaciones de terceros: ninguna.
11. Diseño: color único descriptivo; escalas en unidades nativas, sin semáforo;
    el área no es una nota y un dato ausente no recibe vértice ni relleno.
12. Acciones: solo selección de lectura y explicación metodológica.
13. Incentivos: ninguno nuevo, sin afiliación o patrocinio.
14. Separación profesional: solo datos de Alfa, sin fuente profesional ni marca bancaria.
15. Privacidad: procesamiento en memoria; sin nuevas escrituras, cuentas o telemetría.
16. IA: no interviene en los resultados.
17. Trazabilidad: periodo real, observaciones, fuente Alfa, fórmula y denominador;
    fechas disponibles de los desgloses. No se identifica cobertura con calidad absoluta.
18. Controles: pruebas numéricas con pesos excluidos, cero, datos parciales y ausentes;
    pruebas de integración, recálculos tardíos, teclado y visual en escritorio/tablet.

## Contrato y casos límite previstos

- Se conservan todos los pesos positivos originales para concentración y cobertura.
  El análisis existente del subconjunto conserva su comportamiento.
- Volatilidad del resumen: desviación muestral de los rendimientos de la combinación
  histórica sin rebalanceo, anualizada con 252 sesiones, coherente con Alfa. Se
  identifica el periodo realmente recibido; no se prometen tres años completos.
- Si falta historial de parte de la cartera, el eje de volatilidad de la cartera
  completa queda sin dato; el análisis existente del subconjunto sigue disponible.
- Desglose: acciones/bonos directos identificables se conocen directamente; en
  fondos/ETF se suma únicamente el peso interno identificable con unidad acreditada,
  sin normalizarlo al 100 %. Metadatos de cobertura no sustituyen las filas útiles.
  Los instrumentos de tipo desconocido no se dan por cubiertos.
- Carga, error de consulta y ausencia confirmada se distinguen. Un cero válido es cero.
- Escalas: concentración 0–100 %, clases mínimo 0–5 (se amplía si hace falta),
  volatilidad mínimo 0–25 % (se amplía si hace falta), coberturas 0–100 %.
  El extremo gráfico no es un límite recomendado; no se recortan valores altos.
- Recálculos: las respuestas de composiciones anteriores no sustituyen a la vigente.

## Validación de integración

- Implementación: `js/nuvia-resumen-cartera.js`, montaje en el constructor editable
  antes de las fases de análisis; estilos con los tokens existentes de Alfa.
- 14 pruebas nuevas superadas (`npm run test:resumen-cartera`), incluidas dos de
  integración del constructor para invalidar respuestas tardías y cartera vacía.
  Integradas en `test:analisis`, que forma parte de la compilación obligatoria.
- Regresiones de constructor, análisis, guardado local y carteras modelo superadas.
- `npm run build` completo: validadores, pruebas, auditoría de 36 estados a 1440 px,
  generación de `dist/` y revisión del módulo de empresas en escritorio/tablet.
  Registro local: `output/resumen-cartera-build.log`.
- Revisión visual del constructor integrado mediante
  `docs/fixtures/resumen-cartera.html`: cliente sintético, sin escritura remota.
  Áreas de contenido de 1120, 860 y 680 px (escritorio y contenido de tablet),
  sin desborde; cinco píxeles entre títulos y valores del radar; selección con Enter.
- Historial parcial comprobado en pantalla: ausencia de una posición del 19 %
  deja concentración 19 %, historial 81 %, volatilidad sin dato, cuatro puntos
  y ninguna área rellena. Error de consulta mantiene composición y desglose;
  cartera vacía retira el resumen; respuesta tardía conserva la nueva composición.
- La consulta inicial del entorno aislado no respondió. La comprobación posterior
  del 09-09-2026 identifica `EACCES` en ese entorno; al autorizar la consulta de
  lectura fuera del aislamiento, el manifiesto público devuelve HTTP 200.
  No se modificó el cliente, el servidor de datos ni las reglas de Firebase.
- Validación con el cliente real: catálogo de 700 instrumentos, actualizado el
  03-09-2026. Composición de prueba: 50 % IE00B18GC888, 30 % DE0005933956,
  20 % ES0144580Y14, sin vincular esos pesos a una cartera real o recomendación.
  Periodo común 11-09-2023 a 01-09-2026, 754 cierres, 753 rentabilidades.
  Concentración 50 %, dos clases, volatilidad 7,61 % (igual al constructor),
  cobertura histórica 100 %, desglose identificado 77,29047 %.
  El fondo aporta un desglose útil del 89,8118 % y el ETF, del 41,2819 %;
  la acción directa aporta su 20 % del patrimonio.
- Prueba de exclusión sobre esas series reales: retirar el historial de la
  posición del 50 % conserva la concentración 50 %, reduce cobertura al 50 % y
  deja volatilidad sin dato. No cambia el cálculo existente del subconjunto.
  Evidencia local no publicable: `output/resumen-cartera-validacion-real.json` y
  `output/resumen-cartera-datos-reales.json`; vista en `output/revision-real-cartera.html`.
- Revisión de lenguaje incluida en `scripts/check-lenguaje.mjs`; sin señales,
  clasificación de salud, incentivos o acciones de inversión. No hay IA nueva,
  tratamiento persistente nuevo ni modificaciones de backend.

La revisión interna anterior no es una validación jurídica externa. La autorización
de publicación procede de la orden expresa del fundador recogida al inicio.

## Preparación de la publicación

El primer despliegue y su reintento se detuvieron antes de compilar, por un
`Hash Sum mismatch` del índice APT de Chrome preinstalado en el runner de GitHub.
Se ajusta únicamente la instalación de las dependencias de las pruebas: una copia
temporal de las fuentes APT excluye ese repositorio ajeno a Chromium de Playwright.
Las fuentes originales del runner y las comprobaciones de integridad se conservan.
El navegador se descarga desde Playwright; compilación, pruebas y auditorías
de escritorio/tablet siguen siendo obligatorias antes del despliegue.
