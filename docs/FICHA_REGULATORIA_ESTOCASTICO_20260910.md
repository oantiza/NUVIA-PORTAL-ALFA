# Oscilador estocástico en el análisis técnico

Fecha: 10-09-2026. Alcance: copia local `company-analysis/` de NUVIA Portal Alfa.
Orden directa del fundador: «en análisis técnico añade el estocástico como indicador».

## Prueba regulatoria de 18 preguntas

1. **Necesidad.** Explicar dónde queda el cierre reciente dentro del rango observado de las últimas catorce sesiones.
2. **Datos.** Máximo, mínimo y cierre ajustados del emisor seleccionado por la persona en el catálogo cerrado de Empresas.
3. **Cálculo.** `%K = 100 × (cierre − mínimo 14) / (máximo 14 − mínimo 14)`; `%D` es la media simple de tres valores `%K`. Rango plano: 50. Reinicio tras huecos de más de diez días.
4. **Resultado.** Dos series de 0 a 100, sus últimos valores, las referencias 20/80 y las columnas correspondientes en la tabla.
5. **Instrumentos identificables.** Sí; el indicador pertenece a la empresa consultada. Clasificación interna ámbar por ese motivo.
6. **Circunstancias personales.** No recibe patrimonio, objetivos, tolerancia al riesgo ni otros datos de una persona.
7. **Actuación inversora.** No sugiere comprar, vender, mantener ni abstenerse.
8. **Opinión de valor.** No estima valor razonable, precio futuro ni atractivo.
9. **Selección o puntuación.** No ordena ni compara emisores y no genera una nota.
10. **Recomendación ajena.** No reproduce recomendaciones de terceros.
11. **Diseño.** Los colores distinguen `%K` y `%D`; 20 y 80 se nombran referencias de escala y no veredictos.
12. **Acción.** No añade contacto, contratación, ejecución ni derivación.
13. **Conflictos.** No existe remuneración, patrocinio ni afiliación vinculada al indicador.
14. **Agente vinculado.** El mismo método se aplica a todo el catálogo, sin distinguir productos distribuidos por la entidad representada.
15. **Datos personales.** No trata ni almacena datos personales.
16. **IA.** No interviene IA; el cálculo es local y determinista.
17. **Transparencia.** La pantalla muestra proveedor, fecha, fórmula, periodos, base ajustada, calentamiento, huecos y límites. Los datos proceden del histórico OHLCV ya documentado.
18. **Regresión.** Pruebas unitarias contrastan fórmula, calentamiento, rango plano, parámetros y reinicio; la regresión visual comprueba gráfico, impresión, tabla, anchos de escritorio/tablet y ausencia de red externa.

## Puertas de control

- Resultado permitido: lectura histórica descriptiva `%K/%D` sobre un único emisor.
- Estados prohibidos: señales, alertas, recomendación, lenguaje de oportunidad o interpretación personal.
- La serie usa las mismas velas ajustadas verificadas que el resto del análisis técnico y no realiza nuevas consultas.
- La validación jurídica externa permanece fuera del alcance de la alfa conforme al §0 del marco. No se presenta como realizada.
- No se modifica Firebase, la API, la aplicación fuente original ni el tratamiento de datos.

La función mantiene la clasificación ámbar del análisis de empresas por referirse a un emisor concreto. El resultado, por sí mismo, es un cálculo objetivo y descriptivo.
