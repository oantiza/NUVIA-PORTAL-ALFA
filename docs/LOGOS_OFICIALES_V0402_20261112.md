# Cabecera y textos de portada · pack oficial v04.02 · 12-11-2026

## Orden posterior vigente · logo protagonista

El fundador precisa: **«quita la palabra ecosistema de la captura (ya que se repite abajo) deja solo el logo y dale mas protagonismo»**. Se retira únicamente el rótulo de la cabecera y su separador. El logo oficial lineal pasa de 210 × 52 a 280 × 70 px, conservando el SVG, sus proporciones y el acceso a Inicio. Se ajusta el margen vertical de la cabecera para mantener sus 102 px de altura y la posición del resto de la portada. El enlace «Qué es NUVIA» continúa en su lugar.

El cambio se realiza desde `_plantilla.html`, `scripts/ecosistema/shell.mjs` y `estilos/ecosistema/hub.css`, y se aplica con `npm run shell:sync`. El contrato de cabecera exige ahora sus dos elementos (logo y enlace institucional), conservando las verificaciones de colisión y los tres elementos mínimos de los interiores. La prueba de sincronización LF/CRLF altera ahora la clase del logo, en lugar del rótulo retirado, para continuar comprobando la reparación tanto de cabecera como de pie. La definición canónica valida el archivo y las dimensiones del logo en lugar del texto eliminado.

Prueba §12: ajuste exclusivamente visual por orden expresa; sin nuevas funciones, datos, cálculos, persistencia, recomendaciones o efectos externos. Se mantienen la frase «Un ecosistema para comprenderlo en conjunto» y todos los textos y funcionalidades.

Comparación de alcance: solo cambia el HTML de `index.html`; los 27 restantes y todo el contenido de Inicio fuera de la cabecera son idénticos a la versión previa. Evidencia: `output/logo-protagonista-20261112/alcance.json`.

Validación cerrada: `npm run build` finaliza con código 0, incluida la validación completa, auditoría de 51 vistas a 1440 px y revisión del módulo de empresas a cinco anchuras. La auditoría específica de Inicio a 1440, 1024 y 768 px tampoco presenta fallos. La revisión visual directa e independiente confirma el logo a 280 × 70 px, cabecera a 102 px, ausencia de rótulo y de desbordes, con la frase original intacta tanto a 1440 como a 768 px. Registros y capturas en `output/logo-protagonista-20261112/` (`build.log`, `portada.log`, `visual.json`, `cabecera.png`, `portada-1440.png`, `portada-768.png`). `git diff --check` correcto. Sin commit, push ni publicación.

## Antecedente · cabecera y textos recuperados

## Orden final y alcance

El fundador facilita el pack oficial de logos para su valoración. Después precisa: «Solo una cosa los textos de la portada deja los que habías puesto al principio […]» y cita literalmente «Tu dinero, tu familia, lo que sabes y lo que está por venir. Un ecosistema para comprenderlo en conjunto». A continuación adjunta dos veces la misma cabecera y delimita: **«cambia solo esto»**, **«lo demás estaba perfecto»**.

La aclaración final del fundador es: **«no, eso lo puedes cambiar, pero solo eso (si quieres)»**. Concede libertad únicamente sobre el bloque de logo y rótulo de la captura; no exige reproducirlo literalmente ni autoriza cambios adicionales. Tras revisar su legibilidad y composición, se conserva la combinación de firma oficial lineal y **ECOSISTEMA**. La recuperación de la descripción y los cuatro textos originales responde a la orden anterior y se mantiene. Se conservan los nombres de las cuatro webs, la navegación, el diseño, los interiores, los contenidos y las herramientas. La propuesta inicial de sustituir símbolos globales y favicon se descarta; se recuperan los anteriores antes de validar.

## Resultado implementado

- **11 · Horizontal Lineal.svg**, copia íntegra del pack, en la cabecera de Inicio. Se guarda como `src/assets/brand/nuvia-family-wealth-exact-2026-v2/logo-horizontal-lineal-v0402.svg`, junto a los demás artes de la marca. No se alteran trazados, colores, texto ni proporciones.
- La variante de cabecera se configura desde `_plantilla.html` (`hub.logo`, dimensiones y caption) y se genera en `scripts/ecosistema/shell.mjs`. Las cabeceras interiores mantienen el símbolo y texto anteriores.
- Rótulo «Ecosistema» presentado en mayúsculas junto al logo. Se conserva por criterio visual dentro del único bloque que el fundador permite revisar.
- Descripción literal: «Tu dinero, tu familia, lo que sabes y lo que está por venir. Un ecosistema para comprenderlo en conjunto.»
- Economía: «Comprender el mundo que mueve tu dinero.» Patrimonio: «Dar perspectiva a las grandes decisiones.» Familia y bienestar: «Ampliar la mirada sobre cómo vivimos.» Academia: «Aprender hoy. Construir criterio para mañana.» Acciones originales «Entrar en…».
- No se cambian favicon, iconos de acceso directo, vídeos, textos interiores, cálculos, datos, APIs, almacenamiento o servicios externos. Los originales de G: permanecen intactos. No se publica.

## Prueba del §12

Necesidad: ajustar únicamente la identidad y los textos de Inicio según la precisión del fundador. Datos de entrada: arte y texto facilitados por él; sin datos financieros ni personales. Transformación: copia exacta del SVG y representación proporcionada desde la cáscara existente. Resultado: presentación visual y editorial, sin cálculos, recomendaciones, rankings, juicios de idoneidad o llamadas a operar. Sin instrumentos, emisores, terceros promocionados, monetización, afiliación, cambio en la separación profesional, IA ni persistencia. Los 18 puntos del §12 no introducen riesgo funcional nuevo; clasificación interna verde. Se conservan independencia y límites del portal.

## Validación

- `npm run build`: finaliza con código 0. Incluye `npm run validate`, la auditoría de 51 vistas a 1440 px, construcción de `dist/`, contratos del sitio compilado y la revisión del módulo de empresas a 1440, 1280, 1024, 820 y 768 px. Registro: `output/logos-nuvia-v0402/build-final.log`.
- Auditoría específica de Inicio a 1440, 1024 y 768 px: sin errores de contraste, escala, estructura, superficies, desbordes, controles, foco, consola ni fugas. Registro: `output/logos-nuvia-v0402/portada-final.log`.
- Comparación de los 28 HTML públicos con la compilación validada previa (normalizando únicamente finales de línea): solo cambia `index.html`; los otros 27 permanecen iguales. Evidencia anterior a reconstruir `dist/`: `output/logos-nuvia-v0402/alcance.json`.
- SVG oficial sin alteración, SHA-256 `3046be77e11ada907ba985f27dcf26e6c1ac092566590f32679efb4ff54d28f2`. Revisión visual de cabecera y portada en escritorio y tablet, y revisión independiente del bloque de marca. Capturas: `output/logos-nuvia-v0402/cabecera-final.png`, `portada-1440.png` y `portada-768.png`.
- `git diff --check`: correcto. Sin commit, push, publicación ni escritura en Firebase. Vista previa de la compilación local en `http://127.0.0.1:4191/index.html`.
