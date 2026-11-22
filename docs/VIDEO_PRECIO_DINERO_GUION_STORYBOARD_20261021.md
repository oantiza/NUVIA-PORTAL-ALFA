# El precio del dinero · Guion y storyboard · 21-10-2026

## Orden del fundador y alcance
El fundador solicitó un guion educativo en español de 900–1.400 palabras y 5–10 minutos, sin presentador, con locución externa, subtítulos dinámicos, tabla de producción para Blender/Cavalry/DaVinci Resolve Studio 21 y cambios visuales cada 4–8 segundos. Añadió: «crea un storyboard tambien».

Se prepara un paquete de preproducción local en `output/produccion/el-precio-del-dinero-20261021/`, excluido del repositorio y de la web. Contiene guion maestro, texto de locución, SRT provisional, plan de 80 momentos visuales, datos de producción, prompts y dos láminas de storyboard de diez viñetas cada una. No se han creado escenas nativas de Blender o Cavalry ni un proyecto de Resolve; las láminas son imágenes de previsualización generadas con IA. No se ha grabado locución ni renderizado vídeo. No hay integración en páginas, publicación, commit ni escrituras en Firebase.

## Prueba §12
1. Necesidad: explicar interés, inflación, poder adquisitivo y transmisión monetaria a principiantes.
2. Datos: ejemplos hipotéticos elegidos editorialmente; no se reciben datos del público.
3. Cálculos: interés anual con devolución al final; aumentos sucesivos del precio; rendimiento real exacto y aproximado.
4. Resultados: 1.000 × 1,05 = 1.050; 100 × 1,05 × 1,02 = 107,10; (1,03/1,05 − 1) ≈ −0,0190476 = −1,90476 %.
5. Instrumentos/emisores: ningún producto ni emisor invertible concreto. BCE como institución monetaria.
6. Circunstancias personales: ninguna; segunda persona narrativa genérica.
7. Operativa: no sugiere comprar, vender, mantener o abstenerse de una operación.
8. Valoración/precios: no hay valoración de activos ni pronóstico; los precios de cesta son ejemplos.
9. Atractivo: no puntúa ni ordena inversiones.
10. Terceros: no reproduce recomendaciones.
11. Diseño: colores de identificación y contraste, sin semáforos de conveniencia.
12. Acción: sin contacto, contratación, captación ni ejecución.
13. Remuneración/conflicto: sin publicidad, patrocinio, afiliación ni derivación.
14. Separación profesional: no se identifica ni promociona entidad representada o agente.
15. Datos personales: ninguno; ninguna escritura en bases de datos.
16. IA: asistencia editorial y generación de storyboard; el texto y las cifras de la tabla prevalecen sobre los rótulos de concepto.
17. Fuentes: BCE, Eurostat y documentación oficial de Blackmagic Design; enlaces en el guion. Consulta 21-10-2026. Supuestos visibles en los gráficos. Se distingue objetivo del BCE de dato observado y resta aproximada de cociente exacto.
18. Validación: comprobación de palabras, caracteres, tiempos, identidad textual TXT/SRT y aritmética; inspección visual de las láminas. Sin firma ni ratificación atribuida al fundador. La sincronización definitiva depende de la voz real.

Clasificación interna: **verde**, educación objetiva y general sin personalización decisoria ni llamada a operar. Esta clasificación no acredita una validación jurídica externa.

## Validación
- Locución: 1.234 palabras.
- Duración propuesta: 8:00; adaptar a la toma definitiva.
- 20 escenas × 4 estados visuales = 80 momentos, separados nominalmente por 6 segundos.
- TXT y SRT: máximo 45 caracteres por línea; 134 bloques de hasta dos líneas. Temporización provisional, no sincronización definitiva.
- Máximo de lectura aproximado en el SRT: 17,33 caracteres/segundo; bloque más breve: 1,63 segundos.
- `npm run validate`: pruebas previas completadas; la auditoría necesitó utilizar Chrome instalado mediante `NUVIA_CHROMIUM` y permitir acceso al servidor local fuera del aislamiento.
- `npm run auditar`: ejecutada finalmente a 1440 px. Detectó dos incidencias de contraste preexistentes en `academia.html?tab=activos`: 1,06:1 en «Acciones, fondos de inversión» y 1,08:1 en «Activos complementarios». No se considera superada la validación completa. No se han relajado ni modificado pruebas ni páginas para este encargo. Detalle en `output/produccion/el-precio-del-dinero-20261021/auditoria-portal.log`.
- Inspección visual de ambas láminas completada: 20 viñetas, etiquetas españolas, números de escena, tiempos y guías de subtítulos. La segunda lámina se ajustó para integrar la banda de subtítulos dentro del encuadre. La viñeta 02 usa «Préstamo»/«Devolución»; sus cifras definitivas se especifican en la tabla.
- No se requiere construir el sitio para usar estos archivos de preproducción. No se ha modificado HTML, CSS, JavaScript de producto, rutas o navegación.

