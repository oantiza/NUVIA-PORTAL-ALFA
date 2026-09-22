# Jubilación · revisión de diseño · 22-09-2026

Alcance autorizado: presentación y claridad, incluida adaptación móvil solicitada expresamente. Se conservan entradas, valores iniciales, eventos, motor y resultados. Sin publicación ni cambios de backend.

## Revisión interna previa (§12 del marco)

1. Necesidad: entender la renta de jubilación y los supuestos sin conocimientos técnicos.
2. Datos: edades, pensión, patrimonio, EPSV e hipótesis elegidos por el usuario; ejemplos identificados.
3. Transformación: solo presentación; motor existente sin modificaciones.
4. Resultado: renta neta mensual del primer año, bruto, horizonte, patrimonio, escenarios, gráfico e impuestos existentes.
5. Instrumentos identificables: no; categorías patrimoniales.
6. Circunstancias personales: sí, en simulación local sin decisión de idoneidad.
7–10. Sin sugerencias de operaciones, opiniones de valor, selección por atractivo ni recomendaciones de terceros añadidas.
11. Navy para jerarquía y acciones; series con colores y trazos diferentes; estados positivos/agotamiento conservan texto explícito. El resultado no es un veredicto de idoneidad.
12–13. Sin contratación, contacto, ejecución, remuneración o afiliación añadida.
14. Sin vinculación con la actividad del agente ni la entidad representada.
15. Sin nuevos datos ni persistencia; pruebas con ejemplos ficticios.
16. Sin IA en la función.
17. Se conserva Bizkaia 2026 y se explican los supuestos del motor, promedio de 12 meses, cobro en capital separado y limitaciones. No se revalida legislación en esta tarea de diseño.
18. Comparación exacta del script y contratos de entradas/salidas; comprobaciones visuales y funcionales locales en escritorio, tablet y móvil.

Clasificación: ámbar por datos patrimoniales. Revisión interna de diseño; validación jurídica externa fuera del alcance alfa. No se añaden bloqueos ni se presume autorización de despliegue.

## Dirección visual

Reutilizar navy #0b2347, tinta secundaria #40506a, blanco #ffffff, niebla #e8edf3, papel #faf7ee y bronce #7a5c27 mediante sus tokens. Newsreader para la apertura existente e Inter para interfaz y cifras. Ritmo de 8 px, radios y controles existentes. Apertura compacta, guía enlazada y cuatro apartados de entrada seguidos del quinto paso de resultados; alineación izquierda. La cifra neta es el foco visual, sin introducir una portada que compita con Patrimonio.

## Incidencia preexistente independiente

`pensionRevaluation` se almacena desde «Subida anual estimada de la pensión», pero `calculateScenario` no lo utiliza: calcula `pensionAnnual = pensionMonthly * 14`. Cambiar esa entrada no modifica ninguna salida. No corregido por ser una tarea de diseño; requiere decisión separada sobre el alcance de la proyección de pensiones.

Se confirmó también en la versión original un problema de sincronización de campos: tras cambiar la edad de 65 a 70 y pulsar «Restablecer», el estado vuelve al ejemplo, pero el campo sigue mostrando 70. Los controles usan `defaultValue`. No se modifica este comportamiento durante el rediseño. Una edad inválida que permanece visible también puede impedir calcular tras restablecer. Requiere corrección funcional separada.

## Verificación posterior

- Script completo de cálculo y presentación dinámica idéntico byte a byte respecto de la copia anterior. Se conservan los contratos de todas las entradas (nombre, tipo, límites, paso, valor, evento) y enlaces a resultados numéricos.
- Comparación en navegador de versión anterior y nueva: mismos resultados por defecto (2.593 €/mes netos), al cambiar la edad (2.712 €/mes a los 70) y al cargar el ejemplo DFB. Mismos comportamientos de validación y restablecimiento, incluida la incidencia anterior.
- Auditoría del formulario y resultados a 1440, 768 y 390 px: sin fallos de contraste, desbordamiento, estructura, controles, ayudas, foco ni consola.
- 14 pruebas existentes de formularios y assets superadas; referencias locales, jerarquía, tablas/resultados y cabecera/pie compartidos verificados.
- La auditoría de cifras permite 36–60 px exclusivamente para el resultado principal de esta página, conforme a la petición explícita. Las cifras secundarias conservan la escala compacta.
- Sin despliegue. Estas verificaciones no equivalen a una validación fiscal externa.

## Segunda revisión visual · petición «aplica»

El fundador autoriza aplicar la propuesta de tres bloques: situación, ahorros (incluida EPSV) y estimación (incluidos supuestos). Esta disposición sustituye el recorrido de cinco pasos de la primera revisión. Los ejemplos se separan visualmente de las instrucciones y los productos se agrupan sobre superficies suaves. Todos los campos siguen disponibles.

El resultado presenta la identidad «pensión neta + retiradas netas = ingreso mensual estimado» utilizando exclusivamente las salidas existentes, con aviso de redondeo. El gráfico ocupa una fila completa y precede a la comparación de escenarios. Se conserva íntegro el script del simulador, sin cambios de cálculo ni de eventos.

Revisión posterior: formulario y resultados superan las auditorías a 1440, 768 y 390 px (contraste, estructura, controles, alineación, foco y consola). Las 11 pruebas existentes de formularios, las referencias locales y la jerarquía también pasan. La cifra del ejemplo permanece en 2.593 €/mes. Sin despliegue ni corrección de las dos incidencias funcionales preexistentes documentadas arriba.
