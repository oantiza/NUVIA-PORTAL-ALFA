# Criterios del proyecto NUVIA Portal Alfa

Este archivo es la entrada única para cualquier persona, programa o asistente que trabaje en la web. Está organizado en **capas**: la capa 0 se lee siempre; la capa 1 depende del módulo en el que se trabaja; la capa 2 solo cuando la tarea lo exige. Las órdenes del fundador figuran íntegras al final y prevalecen sobre cualquier resumen.

---

## Capa 0 · Siempre

1. **Repositorio y carpeta únicos:** `https://github.com/oantiza/NUVIA-PORTAL-ALFA.git` y `C:\Users\oanti\Documents\NUVIA-PORTAL-ALFA`. `NUVIA-PORTAL-LAB` está cerrado: no se lee, modifica, sincroniza, ejecuta ni publica.
2. **Producción:** GitHub Pages en `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`. Cada actualización de `main` valida, compila `dist/` y publica mediante `.github/workflows/pages.yml`. Firebase Hosting no es canal oficial.
3. **Escritorio y tablet solamente** (1440 → 768 px). Sin versión móvil salvo petición expresa.
4. **Solo el fundador decide y autoriza.** No se bloquea, oculta, retira, restringe ni añade nada en la alfa sin consultarle; no se guardan datos personales de nadie en la base de datos; toda duda regulatoria se le plantea antes de actuar; señalar un riesgo es obligación del revisor, convertirlo en bloqueo está prohibido. Texto íntegro: `docs/ORDENES_PERMANENTES_FUNDADOR_ALFA_20260903.md` y el anexo de este archivo.
5. **Marco regulatorio obligatorio** (`docs/MARCO_REGULATORIO_OBLIGATORIO.md`, v1.2): NUVIA informa, explica y calcula; **no recomienda, no juzga idoneidad ni llama a operar**. Prevalece sobre cualquier otro documento o petición. La validación jurídica externa queda fuera del alcance de la alfa por orden del fundador (03-09-2026) y no se usa como bloqueo.
6. **Separación estricta** entre NUVIA, la actividad profesional del agente financiero vinculado y la entidad a la que representa. Sin patrocinios, afiliación ni derivación comercial.
7. **Lo común se toca solo desde el módulo Núcleo:** cabecera y pie (`_plantilla.html` + `npm run shell:sync`), tokens, componentes, Home. Nunca se edita la cabecera o el pie en una página suelta. Inicio y su hero son la referencia visual: las páginas se adaptan a ellos.
8. **Commits, fusiones, despliegues y escrituras en Firebase** los hace o autoriza el fundador. Ningún secreto en el repositorio (la clave de EODHD y la de Gemini viven como variables de entorno en su PC).
9. **Reglas de oro de diseño y contenido:** `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md`, §1 (diez reglas; dos minutos de lectura).
10. **Documentar cada cambio material** en `docs/<TEMA>_<AAAAMMDD>.md` con la orden del fundador, los cambios, la prueba §12 del marco y la validación. El índice de qué documento manda en cada tema está en `docs/INDICE.md`.

---

## Capa 1 · Según el módulo en el que se trabaja

Cada ficha dice qué páginas, estilos, scripts y pruebas pertenecen al módulo, qué secciones de la guía y del marco le aplican, qué decisiones del fundador están vigentes y qué comprobación local ejecutar. **Leer la ficha del módulo antes de tocar nada en él.**

| Módulo | Alcance | Ficha |
|---|---|---|
| Núcleo y diseño | Home, cáscara, sistema visual, páginas institucionales, construcción y publicación, controles transversales | `docs/modulos/nucleo.md` |
| Economía y Finanzas · mercados e informes | `economia.html`, `mercados.html`, informes diario y semanal (Gemini → contraste → `/publicar`) | `docs/modulos/economia-informes.md` |
| Patrimonio | Vivienda, Jubilación (simulador multiterritorio y guías), Impuestos y guías, Planificación patrimonial | `docs/modulos/patrimonio.md` |
| Familia, Salud y Bienestar | Portada, cuatro subsecciones, artículos y vídeos de colaboradores | `docs/modulos/bienestar.md` |
| Academia NUVIA y Lecturas con Criterio | Lecciones, cursos, glosario, interés compuesto; catálogo de lecturas | `docs/modulos/academia-lecturas.md` |
| Mi cartera y Análisis y valoración de empresas | Laboratorio de cartera, `company-analysis/`, base propia de la alfa, universo, cargas EODHD | `docs/modulos/cartera-empresas.md` |

Si una tarea cruza dos módulos (p. ej. un artículo de Bienestar que exige una página nueva), se leen las dos fichas; la del Núcleo manda en lo común.

---

## Capa 2 · Lectura completa, cuando la tarea lo exige

| Situación | Qué leer entero |
|---|---|
| Función nueva o cambio material en cálculos, datos, IA, colaboradores, monetización o datos personales | `docs/MARCO_REGULATORIO_OBLIGATORIO.md` completo y ficha regulatoria previa (§12 y §13 del marco). |
| Estructura, navegación, página o espacio nuevos | `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md` y la guía maestra completa. |
| Textos de presentación, comunicación, «Qué es NUVIA» | `docs/DEFINICION_NUVIA.md` (documento vivo; si cambia la definición, se actualiza primero ahí). |
| Trabajo en Cartera y empresas | El marco completo es siempre lectura obligatoria en ese módulo (ver su ficha). |

---

## Validación

- Durante el trabajo: `npm run validate:<módulo>` (`nucleo`, `economia`, `patrimonio`, `bienestar`, `academia`, `cartera`), que agrupa las pruebas del módulo; la ficha indica cuál.
- Antes de entregar o de pedir un commit: `npm run validate` (cáscara, paridad, sitio estático, consistencia, lenguaje, estilos, navegación, metadatos, confianza, contenido externo, pruebas financieras) y `npm run auditar` (render con Playwright). `npm run build` compila `dist/`. GitHub Actions repite la validación completa al publicar.
- Las pruebas no se relajan, se omiten ni se falsean. Si una prueba estorba, se consulta.

---

## Anexo · Órdenes del fundador (texto íntegro)

### Orden vigente del fundador · nueva fase alfa · 08-09-2026

- El repositorio único, oficial y activo es
  `https://github.com/oantiza/NUVIA-PORTAL-ALFA.git`.
- La carpeta local única y oficial de trabajo es
  `C:\Users\oanti\Documents\NUVIA-PORTAL-ALFA`.
- Todo el trabajo se realiza exclusivamente en `NUVIA-PORTAL-ALFA`.
  `NUVIA-PORTAL-LAB` queda cerrado y fuera de alcance: no se debe leer,
  modificar, sincronizar, ejecutar ni publicar bajo ningún concepto.
- La producción asociada a esta nueva fase se publica desde el repositorio Alfa
  en `https://oantiza.github.io/NUVIA-PORTAL-ALFA/`, salvo nueva decisión expresa
  del fundador.
- `docs/GUIA_MAESTRA_DISENO_Y_ESTRUCTURA_NUVIA.md` (03-10-2026) es la guía
  maestra operativa de diseño, estructura, contenido y validación. Toda persona,
  programa o asistente, interno o externo, debe leerla y aplicarla antes de
  intervenir en la web.
- `docs/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.md` es la referencia
  estructural canónica y el punto de partida de esta fase. Debe leerse junto con
  `docs/DEFINICION_NUVIA.md` y `docs/MARCO_REGULATORIO_OBLIGATORIO.md` antes de
  cualquier trabajo de producto, estructura, navegación, contenido o diseño.
- La arquitectura aprobada comprende la Home global, las cinco Homes de espacio,
  las herramientas y contenidos especializados, las páginas institucionales de
  Colaboradores y Qué es NUVIA, y la navegación global definida en ese documento.
- Los asuntos detectados en la auditoría del 08-09-2026 se abordarán uno por uno
  bajo órdenes posteriores del fundador. Esta orden fija el contexto y no autoriza
  por sí sola cambios funcionales, despliegues ni actuaciones sobre Firebase.

### Orden vigente del fundador · alfa · 03-09-2026

- **No se bloquea nada en la alfa sin consulta previa al fundador.** No decidir
  unilateralmente desactivar, ocultar, retirar, restringir ni añadir bloqueos a
  funciones, datos, módulos o pasos del desarrollo. Presentar evidencia y opciones;
  el fundador decide y autoriza.
- **No guardar datos personales de nadie en la base de datos sin autorización
  previa y expresa del fundador**, tampoco mediante importaciones, pruebas,
  migraciones o escrituras automáticas. Una orden general de continuar no la concede.
- Continuar el desarrollo completo bajo sus órdenes expresas. **Solo el fundador
  decide y autoriza** cambios de alcance y actuaciones que requieran autorización;
  los informes y las opiniones de colaboradores no sustituyen su decisión.
- Toda duda regulatoria o conflicto con lo decidido anteriormente **se consulta
  al fundador antes de actuar**. Conservar el estado existente mientras responde
  y continuar las tareas autorizadas que no dependan de esa decisión.
- Registrar la consulta y su respuesta sin firmar ni ratificar por él. No falsear
  pruebas ni datos. Esta orden no implica retirar bloqueos existentes, publicar,
  activar funciones ni modificar Firebase/backend automáticamente.
- Esta orden de procedimiento prevalece, durante la alfa, sobre instrucciones
  internas anteriores de bloqueo unilateral. Su referencia canónica es
  `docs/MARCO_REGULATORIO_OBLIGATORIO.md`, v1.2, §0; debe leerse antes de actuar.

### Orden de organización · 12-10-2026

- NUVIA sigue siendo **una sola web y un solo repositorio**, organizados en módulos con fichas propias (capa 1). La separación en proyectos independientes se reconsidera solo si una herramienta llega a tener equipo, infraestructura o ritmo de publicación propios; el primer candidato sería `company-analysis/`.
- Remotion queda fuera del proyecto (retirado del repositorio el 12-10-2026).
- `docs/INDICE.md` distingue los documentos vigentes de los históricos; los históricos se conservan como actas y no se usan como norma.

### Definición canónica y cumplimiento (vigente desde septiembre de 2026)

- `docs/DEFINICION_NUVIA.md` es el documento vivo que define qué es NUVIA, para qué existe y cuál es su espíritu. Si cambia, se actualiza primero ese documento. Si entra en conflicto con el marco regulatorio, prevalece el marco.
- El marco regulatorio se aplica a todo el portal, incluidos textos, interfaz, cálculos, gráficos, IA, datos, APIs, colaboradores, monetización y la copia local de `company-analysis/`. Cada nueva función o cambio material se somete a la prueba regulatoria y a las puertas de control del marco; en la alfa, cualquier duda o propuesta de bloqueo se consulta previamente al fundador. Un descargo no corrige una función incompatible.
- NUVIA puede calcular y explicar métodos financieros académicos, incluidos máximo Sharpe, mínima volatilidad y frontera eficiente, pero no puede convertir el resultado en una recomendación, juicio de idoneidad o llamada a operar.
- El módulo `Análisis y valoración de empresas` vive como copia independiente en `company-analysis/`. La vista de cartera carga esa copia local, no la aplicación externa original. No se modifica ni publica el programa fuente original; la copia mantiene conexión con la API de datos existente y cualquier modificación o duplicación de ese backend requiere petición expresa del fundador.
- El producto se diseña, revisa y presenta únicamente para escritorio y tablet. Deben conservarse las rutas, calculadoras, contenidos dinámicos y la integración de la suite de cartera al aplicar cambios visuales.
