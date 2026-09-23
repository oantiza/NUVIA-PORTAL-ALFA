# Impuestos · rediseño de la página · 23-09-2026

Orden del fundador: «Implementa» la maqueta aprobada (`Claude outputs/maqueta-impuestos.html`), con cabecera de subsección clara y foto enmarcada, distinta de la portada de sección. Sin publicación ni cambios de backend.

## Qué cambia en `fiscalidad.html`

1. **Cabecera de subsección**: fondo blanco (superficie común de páginas hijas), foto `src/assets/home/card-impuestos.webp` (no se usaba en ninguna otra página) en un recuadro redondeado a la derecha, filete bronce en la esquina y selector de territorio montado sobre la foto. El título conserva la escala de páginas hijas (36 px; 28 px ≤ 1120 px), según la jerarquía aprobada el 10-09-2026 y `check-page-hierarchy`. La maqueta usaba 56 px: se descartó para no contradecir esa decisión.
2. **Próximo vencimiento y línea del año**: cuenta atrás calculada con la fecha del visitante y línea enero–diciembre con la campaña de Renta, los pagos del modelo 130 y el segundo plazo de Renta. Los hitos sin día confirmado se muestran por mes con aviso «consulta el día exacto en el calendario oficial». En móvil la línea se desplaza y se centra en «hoy».
3. **Tarjetas con cifra protagonista** (fecha fin de Renta, rango de la escala del ahorro, plazo de herencia) por territorio; los datos anteriores pasan a un desplegable. «Tu marco de referencia» (intro y enlace oficial) se integra en la cabecera del bloque.
4. **Ejemplo de tributación de una ganancia**: cálculo local por tramos de la escala del ahorro del territorio, tipo medio y comparación (forales y Navarra frente a territorio común; territorio común frente a Bizkaia). Sin persistencia, sin datos personales guardados, sin IA.
5. **Tres errores frecuentes** redactados de forma descriptiva.
6. Estilos nuevos en `estilos/nuvia-fiscal.css` (solo tokens). Posiciones y anchuras por `data-pos` / `data-w` (presupuesto de `style` en línea sigue en 0). Campos con `defaultValue` y clave de remontaje.

## Datos y fuentes

| Dato | Territorios | Fuente | Estado |
|---|---|---|---|
| Escala ahorro 2026, 9 tramos 19–28 % | Bizkaia | DFB, comparativa IRPF 2026 (KA-01877) | Oficial |
| Misma escala | Álava, Gipuzkoa | Art. 76.1 NF 33/2013 (Álava) según NF 3/2025, y art. 76.1 NF 3/2014 (Gipuzkoa) según NF 1/2025; efectos 1-1-2026 (texto consolidado en Iberley) | Contrastado 23-09 |
| Escala ahorro 6 tramos 20–28 % | Navarra | Art. 60 TR IRPF según Ley Foral 36/2022 (BOE-A-2023-3349), vigente desde 1-1-2023; no la modifican la LF 20/2024 (BOE-A-2025-719) ni las medidas de 2026 (alerta EY 12-01-2026). La cuota íntegra de 300.000 € del BOE (78.380 €) coincide con el cálculo de la página | Contrastado 23-09 |
| Escala 19/21/23/27/30 % | Territorio común | AEAT, manual Renta 2025 | Oficial |
| 130 3T hasta 26/10 y 2.º plazo Renta 10/11 | Bizkaia | 130: plazo del 1 al 25 de octubre, que pasa al lunes 26 por caer el 25 en domingo (billin.net, tukonta.com). 2.º plazo: la DFB indica «a primeros de noviembre» (KA-01186); el día 10 lo dan tukonta.com e ideiatek.net. El PDF del calendario de la DFB no se pudo abrir (certificado) | Contrastado con fuentes secundarias coincidentes y la regla oficial |
| 130: 10/2, 10/5, 10/8, 10/11 | Gipuzkoa | gipuzkoa.eus, modelo 130 | Oficial |
| 130 días 20 (abr, jul, oct) y 30/1; 2.º plazo 5/11 | Territorio común | Calendario AEAT / dato ya publicado | Oficial |
| 130 por mes (sin día) | Álava, Navarra | Meses ya publicados en la página | Día pendiente |
| Fechas de Renta y plazos de sucesiones | Todos | Datos ya publicados en la página | Sin cambios |

Los días de los pagos ya vencidos de Bizkaia (26/1, 27/4, 27/7) se infieren de la regla del día 25 hábil y solo se usan para situar puntos pasados, que se rotulan por mes.

## Revisión interna previa (§12 del marco)

1. Necesidad: situar plazos y entender cómo tributa una ganancia sin conocimientos técnicos.
2. Datos: territorio elegido (ya existía) e importe tecleado; no se guardan.
3. Transformación: presentación y un cálculo por tramos de una escala pública.
4. Resultado: cuota estimada, tipo medio y reparto por tramos de un ejemplo.
5. Instrumentos identificables: no.
6. Circunstancias personales: solo un importe de ejemplo; sin juicio de idoneidad.
7–10. Sin sugerencias de operaciones, opiniones de valor ni recomendaciones. Textos descriptivos; aviso de ejemplo educativo que no sustituye la declaración ni el asesoramiento.
11. Sin rojo/verde; diferencias con signo y texto.
12–14. Sin contratación, contacto, remuneración ni vinculación con la actividad del agente o la entidad.
15. Sin nuevos datos ni persistencia (el territorio ya se guardaba en localStorage).
16. Sin IA.
17. Escalas y plazos con fuente y estado en la tabla anterior; «Estado editorial: pendiente de revisión fiscal independiente» se mantiene.

Clasificación: ámbar por cálculo fiscal. Validación jurídica externa fuera del alcance alfa. No se añaden bloqueos ni se presume autorización de despliegue.

## Verificación

- `check-render` en 1440, 1280, 1180, 1024, 900, 820 y 768 px: sin fallos (contraste, escala tipográfica, estructura, superficies, desbordes, fugas, jerarquía, contenido `.fiscal-dato` ×9). A 390 px la única incidencia es la colisión de cabecera, que ya existía en la versión anterior.
- Pruebas estáticas: cáscara, paridad, sitio estático, consistencia (0 `style` en línea), lenguaje, estilos de página, navegación, metadatos, tarjetas, controles, superficies, fundamentos, avisos, tablas, jerarquía y Patrimonio en verde.
- Interacción en navegador: cambio de los seis estados del selector, chips, campo de texto y deslizador. Cálculos contrastados a mano (Bizkaia 120.000 € → 29.025 €; territorio común 7.500 € → 1.455 €; Navarra 300.000 € → 78.380 €).
- Sin despliegue.
