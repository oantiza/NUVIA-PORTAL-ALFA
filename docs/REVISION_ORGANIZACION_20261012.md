# NUVIA · Revisión de la organización por módulos

Fecha: 12-10-2026. Revisión realizada por Codex sobre los cambios locales de Claude.

## Encargo y alcance

Orden del usuario: «comprueba los cambios realizados por claude y haz comit». Se revisan los cambios pendientes y se autoriza un commit local. No se realiza push, despliegue ni escritura en Firebase.

Cambios revisados:

- Retirada de Remotion, sus habilidades locales, manifiesto y script auxiliar, conforme a «no quiero usar remotion».
- Limpieza automática de las zonas temporales de la batería de fase 1 mediante un hook final.
- Instrucciones por capas, índice documental y seis fichas de módulo.
- Registro común de páginas y generación/verificación del sitemap.
- Uso del registro en construcción, metadatos y controles visuales y de consistencia.
- Comandos de comprobación local por módulo; validación global conservada.

No se han modificado páginas HTML, estilos publicados, motores financieros ni datos del portal en esta revisión. La separación de estilos y la plantilla editorial quedan fuera de este commit.

## Correcciones realizadas durante la revisión

- Corregidas las rutas de recursos de las fichas de Núcleo, Academia/Lecturas y Economía: se encuentran bajo `src/assets/`.
- Eliminadas tres instrucciones duplicadas en las fichas.
- Actualizada la versión de la guía maestra en el índice a 1.1.
- Aclarado que crear una página de artículo exige las lecturas del Núcleo y su contrato de render; se conserva la lectura completa del marco cuando la capa 2 la exige.

## Contraste independiente con HEAD anterior

- Mismo conjunto de 29 páginas publicadas.
- Mismo conjunto de 49 rutas y estados de la auditoría visual.
- Contratos visuales equivalentes, incluidas sus excepciones.
- Mismos títulos públicos y 27 entradas del sitemap; solo cambia el orden del XML.
- Ningún paso anterior de la validación general eliminado; se añade la comprobación del sitemap.
- Las pruebas de navegación y comportamiento siguen siendo independientes del registro.
- Una ejecución con fallo deliberado adicional terminó con error, como se esperaba, y no dejó zonas `fase1-prueba-*`. Las pruebas reales se ejecutan sin esa inyección.

## Prueba del §12 del marco

Clasificación interna: mantenimiento de infraestructura y documentación, sin cambio de salidas del producto; verde en el alcance revisado. No constituye dictamen jurídico.

| Pregunta | Respuesta en este cambio |
|---|---|
| 1. Finalidad | Facilitar el mantenimiento del portal educativo y conservar sus controles. |
| 2. Datos de entrada | Archivos locales, metadatos de páginas y datos sintéticos de pruebas. |
| 3. Transformación | Centralización de inventarios y limpieza de temporales. |
| 4. Resultado | Misma web publicable y sitemap equivalente; instrucciones de trabajo organizadas. |
| 5. Instrumentos identificables | No se añaden ni modifican contenidos sobre instrumentos. |
| 6. Circunstancias personales | No se utilizan. |
| 7. Consejos de actuación inversora | No se añaden. |
| 8. Opiniones sobre precio o valor | No se añaden. |
| 9. Rankings o atractivo | No se añaden. |
| 10. Recomendaciones de terceros | No se incorporan. |
| 11. Diseño como veredicto | No hay cambios visuales publicados. |
| 12. Contratación o ejecución | No se incorporan. |
| 13. Remuneración o afiliación | Sin cambios. |
| 14. Compatibilidad profesional | Sin cambio del perímetro del producto. |
| 15. Datos personales | No se recopilan ni escriben datos personales. |
| 16. IA | No se modifica ninguna función de IA. |
| 17. Fuentes y supuestos | Código y documentación local; sin cifras financieras nuevas. |
| 18. Regresiones | Comparación con HEAD, compilación, baterías funcionales y auditorías visuales. |

## Validación

- `npm run build`: correcto (salida 0). Incluye compilación de Empresas, validación completa, auditoría de 49 rutas a 1440 px, generación de `dist/`, comprobaciones del resultado publicado y revisión de Empresas a 1440, 1280, 1024, 820 y 768 px.
- `npm run auditar:tablet`: correcto (salida 0); Inicio, Mercados y Qué es NUVIA a 1024, 820 y 768 px, nueve combinaciones sin incidencias.
- Comparación independiente de inventarios, contratos, títulos, sitemap y pasos de validación con HEAD: correcta.
- Prueba controlada de limpieza ante fallo: correcta; sin carpetas residuales de fase 1.
- Referencias explícitas a archivos y carpetas en las fichas nuevas: verificadas tras las correcciones.

Las auditorías visuales se ejecutan con `NUVIA_RENDER_OFFLINE=1`: comprueban el portal local sin validar servicios remotos. No se ha publicado la web.
