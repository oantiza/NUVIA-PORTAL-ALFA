# Academia · Claridad de resultados y recorridos

Fecha: 12-11-2026. Preparación local autorizada; sin publicación en esta entrega.

## Orden y alcance

El fundador responde **«Sigue»** al informe de auditoría integral que propone simplificar recorridos, corregir la presentación del simulador y sustituir la prioridad personal del presupuesto por una explicación descriptiva. Se aplica a los interiores de Academia y al curso. La portada generada y la cáscara común quedan a cargo del Núcleo. Se conservan vídeos, imágenes, PDF, textos de lecciones y fórmulas existentes salvo los ajustes editoriales expresamente descritos aquí.

## Prueba previa del §12 del marco v1.2

1. Necesidad: acceder directamente a herramientas y contenidos, recuperar la ubicación de lectura y comprender resultados sin contradicciones ni prioridades personales.
2. Datos: supuestos numéricos elegidos por quien usa las herramientas; capítulos y términos locales. Ningún dato nuevo solicitado.
3. Transformación: mismas fórmulas de acumulación y cuatro indicadores del presupuesto; signo y escala del gráfico se corrigen en la presentación. Capítulo/lista/término se representan en URL, sin cifras personales.
4. Resultado: capital y aportaciones, inflación explicada según su signo, cuatro indicadores descriptivos y sus límites; navegación recuperable. Se sustituye la rama que ordenaba una prioridad individual por una explicación de lo calculado.
5. No se añaden instrumentos ni emisores concretos.
6. Las herramientas permiten introducir cifras propias; no se derivan decisiones personales de ellas. Para las pruebas se usan cifras ficticias.
7. La salida nueva no sugiere comprar, vender, mantener ni una acción financiera prioritaria. La auditoría identificó y el fundador autorizó sustituir la salida prescriptiva anterior.
8. No se emiten opiniones sobre precios presentes o futuros.
9. No hay ranking o puntuación de atractivo; la selección indica capítulo o término, nunca mérito inversor.
10. No se añaden recomendaciones de terceros.
11. Colores describen series y selección de navegación; no convierten indicadores en veredictos.
12. Acciones: navegar, abrir explicaciones, calcular ejemplos, reproducir voluntariamente vídeos y descargar materiales existentes. Sin contratación ni derivación.
13. Sin remuneración, patrocinio, afiliación o conflicto nuevo.
14. Se mantiene separación respecto del agente y la entidad; no hay canales comerciales.
15. Ninguna persistencia, base de datos, telemetría o transmisión nueva. Las URL solo contienen ubicación de contenido; nunca cifras del presupuesto o simulador. Las marcas del curso siguen siendo temporales.
16. No se añade IA para visitantes.
17. Se mantienen materiales y fuentes actuales. Se explican supuestos del cálculo fiscal y de inflación; no se certifica la vigencia de datos históricos, impuestos, vídeos o PDF por este cambio de interfaz.
18. Pruebas previstas: equivalencia numérica, signos y escala para rentabilidad negativa, inflación −1/0/+2, navegación por URL/Atrás/recarga, términos únicos y apertura directa, vídeo manual sin recorte a 768 px, curso sin prioridad personal, conservación de los cinco PDF y vídeos, progreso temporal y controles existentes.

Clasificación interna: **ámbar** para las herramientas que reciben cifras patrimoniales, aunque el resultado nuevo es descriptivo; **verde** para la navegación y presentación editorial. Se registra antes de programar. No equivale a dictamen jurídico; la revisión jurídica externa está fuera de alcance en alfa por el §0. No hay bloqueo, backend, commit ni despliegue autorizado por esta entrega.

## Cambios y validación

- `academia.html`: interiores con una sola navegación de sección, entrada compacta y enlace de retorno al final. La vista histórica `?tab=inicio` pasa a **Recorrido de aprendizaje**; conserva sus tres etapas, materiales y fotografía. La portada generada se mantiene a cargo del Núcleo.
- Interés compuesto: acceso directo `?tab=calculadora#simulador-interes`, enlace a la explicación y etiquetas que distinguen supuestos. Se corrigen el signo de los intereses y la escala conjunta de capital/aportaciones. La función de proyección no cambia. Las notas diferencian inflación negativa, nula y positiva y describen el porcentaje fiscal como supuesto del ejemplo.
- Glosario: índice de 13 conceptos y 5 indicadores, identificadores únicos y apertura directa mediante `?tab=glosario&lista=…#termino-…`. La selección se recupera con recarga y Atrás. Índice y contenidos forman el panel controlado por las pestañas; se conservan todas las definiciones.
- `curso.html`: capítulo recuperable mediante `?capitulo=1…5`, enlace al siguiente, recarga y Atrás. Las marcas de avance siguen siendo temporales. Los capítulos 2–5 describen los formatos disponibles —vídeo, infografía y PDF— y sitúan las actividades interactivas en el capítulo 1. Se conservan los cinco vídeos, infografías y PDF.
- El ejemplo de presupuesto conserva las cuatro expresiones numéricas de margen mensual, peso del gasto flexible, patrimonio neto y meses de cobertura. La salida individual «prioridad» se sustituye, conforme a la propuesta autorizada, por **Qué muestran estas cifras** y una explicación descriptiva de alcance. El caso ficticio y su cuestionario se mantienen.
- `estilos/ecosistema/interiores-academia.css`: ajuste exclusivo de pantalla, a 1440–768 px. El aviso del vídeo crece con su texto antes de activarlo; el iframe conserva su proporción tras la activación manual. Campos en una columna a 768 px; anclas e índice con controles legibles. Sin cambios de impresión.

Validación local completada:

- `npm run validate:academia`: **superado**. Los contratos de entrada, recorrido y banner se adaptan al nuevo diseño y vocabulario; se mantienen las comprobaciones de materiales, contraste, controles, curso y contenido.
- `node docs/nuvia-academy-clarity.test.mjs .`: **superado**. Regresión sobre los controladores reales: rentabilidades −5/0/+6,5 %, escala de ambas series, inflación −1/0/+2 %, 18 términos enlazables, capítulos y cuatro resultados del presupuesto.
- `PLAYWRIGHT_BROWSERS_PATH=C:/Users/oanti/AppData/Local/ms-playwright node docs/nuvia-academy-clarity.browser.mjs`: **8 grupos superados**, cuatro a 1440 px y cuatro a 768 px; **sin errores de página**. Contextos aislados, solicitudes externas interceptadas y sin escrituras de datos. Resultado en `output/academia-claridad-20261112/browser.json` y ocho capturas en la misma carpeta. La prueba permite `BASE_URL` para otro servidor local.
- Auditoría oficial `scripts/check-render.mjs . 1024,768`, con `NUVIA_RENDER_OFFLINE=1`: **20 vistas superadas**. Incluye `academia.html`, `curso.html` y las ocho rutas adicionales de Academia registradas en el auditor: `inicio`, `activos`, `glosario`, `pib`, `cursos`, `esenciales`, `fundamentos` y `calculadora`. Todos los contadores de contraste, tipografía, estructura, superficies, desborde, controles, interacción, estados y contenido quedan a cero, con consola limpia. Log íntegro: `output/academia-claridad-20261112/auditoria-tablet.log`. El alias `?tab=interes` no forma parte del inventario oficial y no se atribuye a esta ejecución. No se han modificado contratos para hacer pasar esta matriz.
- Con los supuestos de prueba, capital final 184.488 € al +6,5 %, 49.049 € al −5 % y aportaciones 82.000 €. El caso negativo muestra **−32.951 €** y ambas series quedan dentro del gráfico. Con inflación −1 %, la nota identifica deflación y conserva el ajuste real existente.
- El ejemplo ficticio del curso mantiene **550 €**, **25 %**, **12.300 €** y **1,5 meses**. Los capítulos 2–5, sus enlaces PDF, recarga, Atrás y el reinicio de progreso temporal se comprueban en navegador.
- En ambos anchos el contenedor del vídeo previo a reproducción mide 260 px y el borde inferior del aviso queda a 201,69 px dentro de él. No existe iframe antes del clic; el clic crea el iframe esperado. La prueba verifica la activación, no la disponibilidad de reproducción de un servicio externo.

Las pruebas añadidas son `docs/nuvia-academy-clarity.test.mjs` y `docs/nuvia-academy-clarity.browser.mjs`. Se actualizan `docs/nuvia-academy-entry.test.mjs`, `docs/nuvia-academy-banner.test.mjs`, `scripts/check-academy-entry.mjs` y únicamente el contrato de `academia.html?tab=inicio` en `scripts/check-render.mjs`. Los controles generales y la compilación pertenecen al cierre del Núcleo y no se declaran superados desde este acta de módulo.
