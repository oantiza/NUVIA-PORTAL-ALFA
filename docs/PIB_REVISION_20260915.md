# Academia · El PIB explicado desde cero

Fecha: 15-09-2026. Alcance: preparación local autorizada por el fundador. Sin publicación ni cambios de backend.

## Prueba regulatoria (§12)

1. Necesidad: comprender producción, gasto, renta y diferencias entre PIB nominal, real y por habitante.
2. Datos: vídeo y materiales aportados por el fundador; ejemplo ficticio de Fruitopia. Sin entradas personales.
3. Transformación: síntesis educativa y cálculos aritméticos explícitos.
4. Resultado: lección, reproducción del vídeo, tabla y preguntas con soluciones.
5–10. Sin instrumentos, emisores, circunstancias personales, operaciones, valoración financiera, ranking inversor ni recomendaciones de terceros.
11. Colores editoriales, sin veredictos de inversión.
12. Acciones: reproducir, navegar y consultar respuestas y fuentes.
13. Sin remuneración, patrocinio o afiliación añadidos.
14. Sin referencia ni derivación al agente o banco.
15. Sin recogida ni almacenamiento de datos personales nuevos.
16. IA utilizada para preparar texto revisable; no hay IA interactiva en la lección.
17. Fuentes: Krugman, módulos 10 y 11; sección 2.1 de Macroeconomía (extracto sin identificación editorial completa); Blanchard, capítulo 3. Contraste metodológico con INE y Eurostat. Ejemplos ficticios identificados; fórmulas y limitaciones visibles.
18. Controles previstos: validadores del portal, navegación directa y desde esenciales, reproducción real y revisión de escritorio/tablet. Resultados se registran tras ejecutarlos.

Clasificación interna: verde, educación macroeconómica objetiva. No equivale a dictamen jurídico ni aprobación del fundador.

## Revisión editorial

- El MP4 final dura 757,53 segundos; la locución suma 740 segundos. No trasladar automáticamente sus tiempos a capítulos o subtítulos. El vídeo ya incluye subtítulos visibles.
- Se conserva el contenido del vídeo. Se prepara una copia web con menor bitrate y portada tomada del original.
- El encadenamiento actual no debe explicarse como una media aritmética universal de tasas; se aclara en la lección.
- La contabilidad nacional estima actividad no observada: no afirmar que toda economía sumergida queda fuera del PIB.
- Las cifras históricas de España del vídeo no tienen fecha de publicación estadística identificada en los materiales; no se presentan como datos vigentes en la lección. Se enlaza el INE y se advierte sobre las revisiones.
- El 15–25 % de economía sumergida citado en la locución carece de fuente y periodo identificables en lo aportado; se indica expresamente que no es una cifra acreditada aquí.
- Los PDF se usan como documentación de estudio y se citan por sus capítulos; no se incorporan sus copias completas a los activos públicos.
- La notación de gasto distingue inversión privada (I, incluidas existencias) y compras públicas (G), como en el esquema pedagógico del vídeo. Se explica la convención estadística alternativa para no duplicar inversión pública.

## Referencias de contraste

- https://ec.europa.eu/eurostat/cache/metadata/en/nama_10_gdp_esms.htm
- https://ec.europa.eu/eurostat/documents/24987/6642470/FAQ-NA-1.pdf
- https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177057&idp=1254735576581

## Validación local

- Navegación desde la tarjeta de esenciales y entrada directa `academia.html?tab=pib`: correctas.
- Escritorio 1440 y tablet 1024, 820 y 768: sin desbordes; respuestas desplegables operativas; sin errores JavaScript.
- Auditoría visual del portal aplicada a PIB en 1440 y 820: sin fallos de contraste, tipografía, estructura, superficies, navegación o contenido. La comprobación se ejecuta sin servicios externos.
- Reproducción de la copia MP4 en Chromium: correcta, 1920 × 1080, duración 757,525 segundos y avance temporal comprobado.
- Se actualizan los contratos existentes para incluir la quinta tarjeta y la nueva vista del PIB.
- `npm run build`: completado con salida 0; validadores, pruebas y auditoría general superados, `dist/` generado localmente. La vista PIB se comprobó además con la auditoría específica indicada arriba. Sin despliegue.
- El fundador indica durante la preparación que el vídeo ya está en YouTube. Se solicita el enlace para sustituir la copia local por el reproductor externo bajo el patrón de carga voluntaria del portal. Integración de YouTube pendiente de ese dato; no se inventa un identificador.

## Integración final de YouTube

El fundador facilita `https://youtu.be/ZwhTy0oqx9c`. Se integra ese identificador con el controlador común de reproducción voluntaria y un enlace directo a YouTube. Se retira únicamente la copia MP4 generada para esta tarea; el original del fundador permanece intacto. Se conserva la portada local extraída del vídeo.

Verificaciones tras el cambio: ninguna solicitud a YouTube antes del clic; creación del iframe correcto al pulsar reproducir; geometría 16:9; contrato de contenido externo y referencias del sitio correctos. `dist/` regenerado y auditado en 1440 y 820 px, sin incidencias. La conexión externa falla en el navegador de este entorno (`chrome-error://chromewebdata/`), por lo que no se acredita reproducción remota ni disponibilidad de inserción. No se publica.

## Orden de publicación

El fundador solicita «publicalo» tras revisar la preparación y facilitar el enlace. Esta orden autoriza publicar los cambios de la sección del PIB en el repositorio Alfa y su GitHub Pages oficial mediante el flujo existente de GitHub Actions. No se modifica Firebase ni el backend.
