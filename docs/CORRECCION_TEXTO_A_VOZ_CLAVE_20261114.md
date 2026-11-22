# Texto a Voz · Recuperación de Gemini · 14-11-2026

El fundador comunica el error «API key not valid. Please pass a valid API key» al generar la locución de NUVIA. Tras el diagnóstico, autoriza: «Sí, corrige la clave y Texto a Voz». La consulta especifica sustituir la clave y actualizar exclusivamente el servicio de Texto a Voz. No autoriza publicar el nuevo vídeo de NUVIA ni cambiar Firebase.

## Diagnóstico y reparación

La clave almacenada en `texto-a-voz-gemini-api-key` coincidía con `GEMINI_API_KEY` del PC. Google rechazó ambas con HTTP 400 y razón `API_KEY_INVALID`. La configuración del servidor usa Secret Manager; no se trata de un error del SRT ni de sus marcas.

Se crea una clave restringida a la API de Gemini en `nuvia-market-data` y se habilita `generativelanguage.googleapis.com`, que estaba deshabilitada. Esa clave permite listar modelos, pero la inferencia devuelve HTTP 403. No se modifican facturación, pagos, IAM ni políticas de organización para forzar acceso.

En la sesión del fundador en Google AI Studio se identifica una clave existente denominada **TEXTO A VOZ**, en el proyecto `gen-lang-client-0710174917`, mostrado con nivel 2. Una síntesis mínima con el modelo que ya usa la aplicación, `gemini-3.1-flash-tts-preview`, devuelve HTTP 200 y audio PCM de 24 kHz. Se reutiliza esa credencial dedicada a la propia aplicación; no se usan claves de otros productos.

La credencial verificada se transfiere en memoria a la versión **2** del secreto existente en `nuvia-market-data`, y el servicio queda fijado a esa versión. Se despliega únicamente la revisión **texto-a-voz-00017-pdp** en `europe-west1`, conservando el código, el modelo, las restantes variables y el control de acceso. La clave de prueba creada durante la intervención se retira al no ser necesaria. La variable del PC permanece intacta.

## Comprobación y alcance

Se verifica la síntesis real de una frase mínima con la clave activa; listar modelos no se considera una prueba suficiente de acceso a inferencia. La URL del servicio se conserva: `https://texto-a-voz-2qdvewjg7a-ew.a.run.app`. Tras el reinicio, la aplicación pide de nuevo la contraseña de acceso; se solicita al fundador que entre en su pestaña para verificar también el recorrido completo por la interfaz.

El guion cargado en el proyecto «NUVIA · Todo está conectado · 60 segundos» contiene diez frases, 115 palabras y marcas SRT hasta 00:58; el vídeo mantiene dos segundos finales sin voz. El máster local corregido es `NUVIA-60s-Ritmo-Equilibrado-FullHD.mp4`, Full HD, 25 fps y 60 segundos, documentado en `VIDEO_NUVIA_AROS_EN_MOVIMIENTO_20261114.md`.

**Prueba §12:** reparación técnica de autenticación para sintetizar el texto institucional aprobado. No cambia su contenido educativo ni incorpora datos personales, datos de mercado, recomendaciones, idoneidad o llamadas a operar. No se modifica el portal ni su publicación, ni se escribe en Firebase. Los valores de la credencial activa se mantienen fuera del repositorio y de los archivos de trabajo. Clasificación informativa verde.

Evidencias sanitizadas y scripts operativos en `output/video-que-es-nuvia-20261112/aros-en-movimiento/revision-portada/version-60s-v5/`: `reparacion-tts-estado.json` y `clave-existente-tts-verificada.json`. No contienen el valor de ninguna clave.

## Verificación final desde la aplicación

El fundador confirma «Ya he entrado». Se sintetiza únicamente la primera frase del proyecto NUVIA desde la interfaz de Texto a Voz. La aplicación pasa de 0/10 a **1/10**, conserva la voz **Kore (castellano de España)** y muestra «Escuchar Frase» y el enlace para descargar el clip. La ventana asignada es de 5,6 segundos y la interfaz indica velocidad 1,06×. No vuelve a aparecer el error de clave. Esta prueba confirma el recorrido por la aplicación y su servidor, además de la comprobación previa de la API. Las otras nueve frases quedan pendientes de generación por el fundador; el vídeo local no se modifica ni se publica.
