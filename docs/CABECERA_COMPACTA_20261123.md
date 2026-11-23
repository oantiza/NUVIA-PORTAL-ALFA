# Cabecera compacta en las cuatro webs y los espacios comunes

**Fecha:** 23-11-2026. **Estado:** aplicado en local; sin commit ni publicación.

## Orden del fundador

Tras la revisión completa del sitio («revisa completamente el proyecto… No hagas nada sin mi permiso»), se propuso reducir la cabecera. El fundador pidió ver un ejemplo («Sí, enséñalo.»), vio la maqueta de antes y después en escritorio, portátil y tablet, y respondió: «Aplica».

## Qué cambia

La cabecera de las páginas interiores y de las portadas de las cuatro webs. La portada principal (`index.html`) no cambia.

| | Antes | Ahora |
|---|---|---|
| Alto de la cabecera desde 1020 px de ancho | 195 px (barra azul, franja del logotipo y menú) | 125 px (barra azul y una franja con logotipo, nombre de la web y menú) |
| Alto por debajo de 1020 px | 195 px | 157 px (el menú no cabe junto al logotipo y sigue en su franja) |
| Logotipo | 240 × 60 px | 200 × 50 px (184 × 46 entre 1020 y 1239 px; 176 × 44 por debajo) |
| Nombre de la web | 25 px | 23 px (22 px entre 1020 y 1239 px) |
| Menú de la web | Franja propia bajo el logotipo | A la derecha de la misma franja |
| Lecturas, Colaboradores y Qué es NUVIA en la barra azul | Ocultos por debajo de 1240 px | Visibles hasta 1020 px, con la barra a 13 px |

El HTML no cambia: no se ha tocado `_plantilla.html` ni se ha sincronizado nada. Son solo reglas de estilo.

## Ficheros

- `estilos/ecosistema/interiores.css`: ancho y margen de cabecera y pie en los interiores.
- `scripts/check-render.mjs` y `scripts/check-navigation-cards.mjs`: las tres comprobaciones descritas más abajo.
- `estilos/ecosistema/webs.css`: franja única desde 1020 px (`.web-local` se superpone a la franja del logotipo y alinea el menú a la derecha), tamaños de logotipo y nombre, y barra azul en tablet.

## Segunda orden · menú repetido y alineación

Los dos puntos siguientes chocaban con pruebas y no se aplicaron en la primera pasada. El fundador pidió explicación con imágenes, las vio y respondió: «Sí, los dos».

- **Espacios comunes sin menú repetido.** En Lecturas, Colaboradores, Qué es NUVIA, Cómo trabajamos e Independencia, el menú ofrecía cuatro enlaces que ya están en la barra azul. Desde 1020 px de ancho ya no se pinta (`.web-header--shared .web-local`). Por debajo de 1020 px la barra esconde esos enlaces, así que el menú se conserva. El HTML no cambia.
- **Cabecera y pie alineados con el contenido en los interiores.** Usan el mismo ancho y margen que `.nv-container` (`estilos/ecosistema/interiores.css`). La desviación anterior era de 5 px a 1366, 16 px a 1280 y 23 px a 1024. Las portadas de las cuatro webs (`data-eco-view="portada"`) y la portada principal conservan el 90 % de la ventana.

### Pruebas modificadas, con autorización expresa

- `scripts/check-render.mjs`, cabecera: los enlaces comunes de la barra azul cuentan como elementos auditables en los espacios comunes. Sigue exigiendo al menos tres elementos visibles y sin colisiones.
- `scripts/check-render.mjs`, estructura: en los interiores, la cabecera y el pie deben medir lo mismo que el contenido (1240 px como máximo, con margen de 48 px o de 28 px hasta 1120 px). Antes se exigía el 90 % de la ventana. Portadas y portada principal no cambian.
- `scripts/check-navigation-cards.mjs`: se auditan tamaño, foco y nombre de los enlaces que el visitante puede usar. Si el menú no se pinta, exige que la página sea un espacio común y que sus enlaces se vean en la barra azul. El número y el destino de los enlaces del menú se siguen comprobando igual.

Ninguna comprobación se ha retirado.

## Lo que no se ha hecho

- **Desplegable «Más» en tablet estrecha.** Por debajo de 1020 px los espacios comunes se alcanzan desde su propio menú o desde el pie.
- **Qué es NUVIA:** por debajo de 1240 px su contenido empieza 4 px a la derecha de la cabecera (antes, 19 px a la izquierda a 1024 px). Es composición propia de esa página.
- **Nombre de la web a 21 px** entre 1020 y 1239 px: fuera de la escala tipográfica; se dejó en 22 px.

## Prueba regulatoria (§12 del marco)

Cambio de composición de la cabecera. No añade ni retira contenidos, enlaces, datos ni cálculos. Sin efecto regulatorio.

## Validación

- `npm run validate`: código de salida 0; «51 páginas a 1440 px, sin fallos de contraste, tipografía, estructura, superficies, desborde ni fugas».
- `node scripts/check-render.mjs . 1440,1280,1180,1024,900,820,768` sobre 18 páginas (las cuatro portadas, interiores de cada web y los cinco espacios comunes): 126 vistas de 126 correctas.
- Medición propia en 27 páginas y ocho anchos (1440 a 768 px): cabecera de 125 px desde 1020 px y de 157 px por debajo; logotipo y titular en el mismo borde en todas salvo Qué es NUVIA (4 px); sin desbordes; la barra azul no desborda.
- No se ha ejecutado `npm run build`.
