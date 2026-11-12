# Corrección de la serie de cierres anteriores · 12-11-2026

## Orden del fundador

«Corrige esas incidencias sin cambiar el diseño ni perder contenidos o funcionalidades, y vuelve a comprobarlo todo en escritorio y tablet. No publiques todavía.»

Esta acta corresponde a F-02 de [la revisión funcional pública](REVISION_FUNCIONAL_PUBLICA_20261112.md). No autoriza publicación ni escrituras en la base de datos.

## Problema y corrección

Al consultar Empresas → Técnico → «Cierres anteriores · serie independiente», dos respuestas de la misma ficha podían contener los mismos valores en distinto orden de claves. La comparación directa con `JSON.stringify` las consideraba revisiones diferentes y mostraba «Los precios han cambiado durante la consulta».

`company-analysis/src/alfa/prices.js` pasa a ordenar recursivamente las claves de los objetos antes de serializar la revisión. Se aplica el mismo criterio que ya utiliza el lector OHLCV. El orden de los arrays permanece intacto: reordenar una secuencia continúa siendo un cambio real.

La segunda lectura de la ficha se conserva. También se conservan las comprobaciones de identidad, procedencia, fechas, cobertura, documentos anuales, cifras, cancelación y coincidencia del último dato. La transformación se limita a la representación empleada al comparar versiones: no modifica los datos recibidos ni los puntos entregados al gráfico, los cálculos, las fuentes, las fechas o la interfaz.

Archivos modificados en este paso:

- `company-analysis/src/alfa/prices.js`.
- `docs/nuvia-tecnico-alfa.test.mjs`, batería ya incluida en la compilación de `company-analysis`.
- Esta acta.

No se modifica `dist/`, el programa fuente externo, CSS, HTML, APIs ni datos de Firebase.

## Prueba del §12

| Pregunta | Aplicación a la corrección |
|---|---|
| 1. Necesidad | Recuperar la lectura descriptiva del historial existente evitando un falso cambio de versión. |
| 2. Datos y elección | Ficha y serie de la empresa elegida por el usuario, leídas de la base propia existente. |
| 3. Transformación | Representación determinista de mapas para comparar revisiones; arrays y valores se conservan. |
| 4. Resultado | Los mismos puntos, moneda y fechas previstos por el lector; errores existentes ante cambios reales o datos inválidos. |
| 5. Emisores identificables | Sí, los ya disponibles; no se amplía el universo. |
| 6. Circunstancias personales | Ninguna nueva entrada, perfil ni inferencia personal. |
| 7. Conducta inversora | No sugiere comprar, vender, mantener o no actuar. |
| 8. Valor o precio futuro | Ninguna opinión, estimación ni precio objetivo. |
| 9. Atractivo inversor | No puntúa, selecciona ni ordena instrumentos. |
| 10. Recomendaciones ajenas | No se añaden ni reproducen. |
| 11. Presentación | Diseño, textos, colores y navegación permanecen iguales. |
| 12. Acción comercial | Ninguna contratación, ejecución o derivación. |
| 13. Remuneración/conflicto | Sin cambios respecto del módulo existente. |
| 14. Agente vinculado | Sin conexión con sistemas profesionales ni reutilización de datos comerciales. |
| 15. Datos personales | Ninguno; pruebas con fixtures sintéticos y sin escrituras remotas. |
| 16. IA en la función | No interviene. |
| 17. Fuentes y límites | Se conservan EODHD, fechas y límites de la serie existente; no se corrigen ni rellenan cifras. |
| 18. Regresión | Caso de mapas reordenados y seis variaciones reales; batería técnica y lector OHLCV, más comprobaciones integrales coordinadas en la tarea principal. |

La clasificación del módulo continúa siendo ÁMBAR por emisores identificables. Esta reparación no amplía su alcance ni modifica las decisiones o firmas existentes. La validación jurídica externa sigue fuera del alcance de la alfa por la orden vigente.

## Validación

La nueva prueba de mapas reordenados se ejecutó antes de modificar el lector y reprodujo exactamente el error de cambio de precios. Tras la corrección:

- `node --test docs/nuvia-tecnico-alfa.test.mjs docs/nuvia-ohlcv-reader.test.mjs`: **17/17 correctas**.
- `npm run validate:cartera`: termina con **código 0**, incluidas las pruebas del módulo, el contrato estático de reglas y el control de lenguaje; no ejecuta permisos contra producción.
- La serie entregada con claves reordenadas coincide exactamente con la de referencia y conserva las ocho peticiones del fixture, incluida la comprobación final de la ficha.
- Cambiar `updated_at`, `source.fetched_at`, la cobertura inicial, un valor anidado, el orden de una lista o eliminar un campo sigue produciendo el error de revisión cambiado.
- `git diff --check` de los archivos del cambio: correcto.

Registros: `output/correccion-cierres-20261112/antes.log`, `despues.log` y `validate-cartera.log`. La validación global, compilación y revisión de escritorio/tablet se consolidan en el acta principal de correcciones; este paso no las sustituye ni las presenta como completadas antes de su ejecución.

Estado: reparación local, sin commit, push, publicación ni escritura de datos.
