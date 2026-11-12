# Rediseño de la portada del Ecosistema NUVIA

**Fecha:** 12-11-2026. **Alcance:** nueva versión del hub de la maqueta local. La arquitectura publicada sigue vigente; no se realiza una migración.

## Orden del fundador

El fundador solicita: «Quiero que rediseñes por completo la portada del ecosistema. Se parece demasiado a las portadas de la web, de las webs. […] Parte de cero, crea algo nuevo, espectacular y que llame la atención». Pide además un enlace a «Qué es NUVIA» y ver el resultado.

Esta orden autoriza una dirección visual distinta para la portada de la propuesta. Sustituye el criterio continuista aplicado al primer hub, sin convertir la propuesta en la nueva arquitectura normativa ni autorizar publicación. Se conserva la preferencia anterior de equilibrio entre cercanía familiar y profundidad profesional.

## Diseño realizado

Concepto de trabajo: **Ágora**, una entrada concebida como una exposición breve. El nombre mostrado sigue siendo **NUVIA · Ecosistema**.

- Fondo claro, gran titular «Todo está conectado.» y una explicación de dos líneas.
- Escultura original de cuatro formas conectadas, generada expresamente para esta portada. Azul, verde, champagne y azul claro representan convivencia de ámbitos; no codifican atractivo inversor.
- Cuatro accesos tipográficos con nombre, utilidad y acción. En escritorio rodean la pieza; en tablet estrecha se ordenan en dos columnas bajo ella.
- Cabecera mínima con marca, descriptor Ecosistema y un único enlace «Qué es NUVIA».
- Franja breve «La curiosidad nos une», con Lecturas con Criterio y Colaboradores.
- Interacción moderada al pasar el cursor o enfocar una puerta: se eleva el acceso y gira levemente la escultura. La preferencia de movimiento reducido desactiva esos efectos.

Los enlaces son HTML real y funcionan sin JavaScript. La ilustración es decorativa, con alternativa vacía y fuera del árbol accesible; ningún destino depende de interpretar una parte de la imagen. La portada no tiene carrusel, puntos ocultos, temporizadores, formularios ni peticiones a terceros.

La revisión visual independiente confirmó claridad y ausencia de solapes en 1440, 1024, 900 y 768 px. Se incorporaron dos ajustes: alineación de filetes en escritorio y mayor separación entre escultura y enlaces en tablet.

## Implementación y alcance

Archivos principales en `prototipos/ecosistema-nuvia-20261112/`:

| Archivo | Función |
|---|---|
| `hub.mjs` | Plantilla exclusiva de la nueva portada |
| `hub.css` | Composición y estados visuales, consumiendo tokens existentes |
| `index.html` | Resultado navegable generado |
| `generar.mjs` | Importa la plantilla del hub y conserva las cuatro portadas hijas |
| `assets/conexiones-original.png` | Salida original de la generación de imagen |
| `assets/conexiones.webp` | Versión optimizada: 1000 × 1000, transparencia, 130.440 bytes |
| `assets/PROCEDENCIA.md` | Herramienta, archivo original, exportación y prompt completo |
| `verificar.mjs` | Revisión de las cinco portadas, destinos, recursos y teclado |

Se ajustan README y apartados 3.2–3.4 del plan para reflejar el diseño actual; se regenera su versión visual. El índice incorpora esta acta. El documento de validación inicial se conserva con referencia al rediseño.

Las cuatro portadas hijas se verificaron mediante SHA-256 antes y después de regenerar: **idénticas**. No cambian `_plantilla.html`, los tokens, las páginas publicadas, el registro de páginas, el backend ni Firebase. No se crean commits ni se publica.

## Prueba del §12 y puertas del §13

La ficha completa de 18 respuestas está en los anexos A y B de `PLAN_ECOSISTEMA_NUVIA_20261112.md`. Se revisa de nuevo para este cambio visual:

| Aspecto | Resultado del rediseño |
|---|---|
| Función y destinatario | Orientación general hacia cuatro áreas educativas; sin perfil individual |
| Entradas y datos | Ningún dato solicitado, almacenado o transmitido; no se añaden proveedores |
| Resultado | Enlaces de navegación y texto de presentación; no hay cálculo ni clasificación financiera |
| Instrumentos, idoneidad y acciones | No se presentan instrumentos, recomendaciones, juicios de idoneidad ni llamadas a operar |
| Profesional y entidad | Sin marcas, derivaciones o captación comercial de terceros |
| Salud | Acceso temático, sin diagnóstico, tratamiento ni consejo individual |
| Imagen generada | Ilustración abstracta decorativa; no aporta hechos, credenciales o testimonios |
| Revisión y control | Propuesta local, trazable y fuera de publicación; conserva las revisiones específicas de cada herramienta enlazada |

Las 18 respuestas conservan su sentido. Clasificación interna propuesta: **verde** para el hub; no reclasifica las herramientas de las webs. No hay conflicto regulatorio nuevo que requiera consulta. No se presenta como validación jurídica externa.

## Validación de la maqueta

- Cinco portadas × siete anchos: **35 comprobaciones correctas**, de 1440 a 768 px.
- Un H1 por página; sin desbordes, elementos fuera del ancho ni imágenes rotas; fuentes locales cargadas.
- Texto visible de al menos 12 px y enlaces/controles de al menos 44 px de alto; foco visible y salto al contenido comprobados.
- **38 destinos locales únicos**, con archivo existente. Se activan las cuatro puertas y se comprueba la vuelta al hub; se conserva correctamente el fragmento `#contenido` del salto accesible.
- Selector de las páginas hijas por teclado, cierre con Escape y recuperación de foco correctos.
- Un único enlace «Qué es NUVIA» en la cabecera del hub; movimiento reducido correcto.
- Cero errores de JavaScript y cero peticiones HTTP externas en la revisión local de las cinco portadas.
- Imágenes decodificadas antes de capturar para evitar evidencias tomadas antes de pintarse la escultura.
- El prototipo sigue excluido del registro de páginas productivas.

Evidencias: `output/ecosistema-20261112/prototipo-validacion.json`, capturas `index-{1440,768}.png`, `portada-resumen.png`, `review-{900,1024}.png` y `hijas-antes.json`. Las capturas originales del hub se conservan en `anterior/`. La revisión de geometría no equivale a certificación integral de accesibilidad ni a pruebas con usuarios.

## Vista disponible

La pestaña del navegador muestra «Ecosistema NUVIA · Todo está conectado», con los cuatro enlaces y el enlace institucional verificados en su árbol accesible. Se mantiene abierta como resultado de revisión.

URL local: `http://127.0.0.1:4187/prototipos/ecosistema-nuvia-20261112/index.html`. El servidor local se mantiene activo para permitir la navegación solicitada. No es una dirección publicada en Internet.

## Validación general del repositorio

| Comprobación | Resultado |
|---|---|
| `npm run validate:nucleo` | Correcto, código 0 |
| `npm run build` completo | Correcto, código 0, en una única ejecución |
| `npm run validate` y `npm run auditar`, incluidos en build | Correctos; auditoría de 50 páginas/vistas a 1440 px |
| Construcción y controles de `dist/` | Correctos |
| Render de Empresas | Correcto en 1440, 1280, 1024, 820 y 768 px; sin desbordes, errores ni red externa |
| Plan visual actualizado | Correcto en 1440 y 768 px, sin desborde, con un H1 y destinos del índice existentes |
| `git diff --check` | Correcto; aviso informativo de normalización CRLF/LF en el índice |

Se utiliza Chromium instalado y `NUVIA_RENDER_OFFLINE=1`, sin acceso a datos externos; las pruebas de Empresas usan su entorno de simulación. No se modifican ni relajan pruebas productivas. Logs: `output/ecosistema-20261112/redisenio-validate-nucleo.log` y `redisenio-build.log`.

Se conservan dos avisos anteriores: expresión de plantilla en el H1 de `academia.html` y tres imágenes sin `loading="lazy"` en `lecturas.html`; las auditorías de render pasan. Esta ejecución completa con código 0 sustituye la limitación operativa de la primera entrega, cuyo build se completó por etapas. No prueba disponibilidad de datos o servicios remotos.
