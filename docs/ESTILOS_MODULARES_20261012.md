# NUVIA · Estilos por módulo y conservación de la impresión

Fecha: 12-10-2026.

## Orden y alcance

Orden del fundador: «comit y publica», tras la revisión de los cambios de Claude y de sus correcciones. Publicación autorizada en GitHub Pages desde `main`.

- Entrada común: fundamentos, contenidos y entradas de página.
- Entrada específica de Cartera: fundamentos, cartera, contenidos y entradas de página.
- Informes enlazados solo en Economía y Mercados.
- Formato A4 común en fundamentos; declaración propia en la plantilla de informes autónomos y regeneración de las dos ediciones vigentes.
- Utilidad de pruebas por página, comprobación de A4 y documentación actualizadas.

## Revisión y validación

- `npm run build` correcto tras las correcciones: validación completa, 42 pruebas de informes, sincronización, 49 páginas o estados a 1440 px, comprobaciones de `dist/` y módulo de empresas en cinco anchos.
- Impresión comprobada con Chromium: A4 en 27 páginas con cáscara y dos informes autónomos. Se conservan formato y número de páginas impresas en seis comparaciones con la versión anterior.
- Matriz completa ejecutada durante la revisión inicial: 340 de 343 casos correctos. Los tres casos restantes son el informe semanal a 900, 820 y 768 px. Sus diez desbordamientos coinciden exactamente con los de HEAD y se han reproducido de nuevo después de corregir la impresión. Su corrección queda como tarea separada; no se presenta la matriz como totalmente correcta.
- El orden de carga de las hojas conservadas se contrastó en los 29 HTML. La revisión inicial comparó 62 casos de estilos calculados sin diferencias en pantalla.
- Ambas hojas dejan de cargarse en 25 HTML, incluida una redirección. El ahorro de aproximadamente 102 KB sin comprimir y 19 KB con gzip es orientativo, no tráfico garantizado por visita.
- Las pruebas del navegador bloquean conexiones externas; no verifican la disponibilidad de servicios remotos.

## Prueba del §12 del marco

Clasificación interna: mantenimiento de presentación y pruebas, verde en este alcance. No constituye dictamen jurídico.

| Pregunta | Respuesta |
|---|---|
| 1. Finalidad | Reducir la carga de estilos ajenos a cada módulo, conservando presentación e impresión. |
| 2. Datos de entrada | HTML, CSS, plantillas y datos existentes de los informes. |
| 3. Transformación | Reorganización de dependencias CSS y ubicación de la regla de impresión. |
| 4. Resultado | Páginas con cargas específicas y formato A4 conservado. |
| 5. Instrumentos identificables | Sin incorporación ni modificación de contenido sobre instrumentos. |
| 6. Circunstancias personales | No se utilizan. |
| 7. Consejos de actuación inversora | No se añaden. |
| 8. Opiniones sobre precio o valor | No se añaden. |
| 9. Rankings o atractivo | No se añaden. |
| 10. Recomendaciones de terceros | No se incorporan. |
| 11. Diseño como veredicto | La reorganización conserva la presentación en pantalla; no introduce juicios visuales. |
| 12. Contratación o ejecución | No se incorporan. |
| 13. Remuneración o afiliación | Sin cambios. |
| 14. Compatibilidad profesional | Sin cambio del perímetro del producto. |
| 15. Datos personales | No se recopilan ni escriben datos personales. |
| 16. IA | No se modifica ninguna función de IA. |
| 17. Fuentes y supuestos | Código e informes existentes; sin nuevas cifras financieras. |
| 18. Regresiones | Compilación, pruebas funcionales, contraste con HEAD, auditorías de pantalla e impresión. |
