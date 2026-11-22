# Enlace «Qué es NUVIA» en la portada · 14-11-2026

El fundador pidió dar más presencia al enlace de la esquina superior derecha de la portada, con letras más grandes y atractivas. La referencia visual identifica el enlace existente a `que-es-nuvia.html`.

En `estilos/ecosistema/hub.css`, el texto pasa de Inter a 14 px a Newsreader con peso 500 y 33 px en escritorio. Hasta 999 px, usa 30 px. Ambos tamaños pertenecen a la escala tipográfica de la portada. La flecha conserva su forma y se muestra en blanco sobre un círculo azul NUVIA de 48 px. Se mantienen la cabecera de 102 px, la firma oficial, el texto y el destino del enlace.

## Prueba del §12 del marco regulatorio

- (1–4) Facilita descubrir la presentación institucional. El enlace recibe la pulsación del lector y abre la página existente. El rótulo visible es «Qué es NUVIA».
- (5–11) El tamaño y el color destacan el acceso institucional. No se muestran instrumentos, circunstancias personales, recomendaciones, precios, valoraciones, comparativas ni veredictos.
- (12–17) El único destino es la presentación de NUVIA. El ajuste visual no incorpora contacto, contratación, ejecución, incentivos, conflictos, tratamiento de datos, IA, cifras ni fuentes.
- (18) Comprobaciones del Núcleo, validación general y revisión de la portada con Playwright en escritorio y tablet, incluida la activación por teclado.

**Clasificación interna** · Verde, navegación institucional informativa.

## Validación local

- `npm run shell:sync` comprobó la cáscara sin regenerar HTML. `npm run validate:nucleo` superó las comprobaciones del módulo.
- La auditoría de Playwright de `index.html` superó los siete anchos de 1440 a 768 px, con contraste AA y sin desbordes. En los siete anchos se comprobó además que Newsreader se carga, la cabecera mide 102 px y el enlace muestra el foco y abre `que-es-nuvia.html` al pulsar Intro.
- `npm run validate` finalizó con éxito, incluida la auditoría de 51 páginas y vistas a 1440 px en modo local.
