/**
 * Versión descargable del informe, en un único fichero HTML autocontenido.
 *
 * Se descarga y se abre sin conexión, así que no carga tipografías ni hojas de
 * estilo externas: usa los colores del sistema visual de NUVIA
 * (`estilos/nuvia-tokens.css`) copiados aquí y las familias con su pila de
 * respaldo del sistema. Un informe que solo se ve bien con internet delante no
 * sirve para guardarlo.
 *
 * Todo el texto pasa por `escapar()`. El contenido lo escribe un modelo de
 * lenguaje a partir de páginas web, y ninguna de esas dos procedencias autoriza
 * a inyectar marcado en el documento.
 */

import { TIPOS } from './contrato.mjs';

function escapar(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fechaLarga(fecha) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${fecha}T12:00:00.000Z`));
}

const ESTILOS = `
  :root {
    --paper: #f3eedf;
    --paper-light: #faf7ee;
    --ink: #0b2347;
    --copy: #40506a;
    --muted: #5b6472;
    --bronze: #b69152;
    --line: rgba(11, 35, 71, .14);
    --serif: "Newsreader", Georgia, "Times New Roman", serif;
    --sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 48px 24px 72px;
    background: var(--paper);
    color: var(--copy);
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.6;
  }
  .hoja { max-width: 46rem; margin: 0 auto; }
  .marca {
    font-family: var(--sans);
    font-size: .75rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .filete { height: 2px; background: var(--bronze); border: 0; margin: 14px 0 26px; }
  h1 {
    font-family: var(--serif);
    font-size: 2.1rem;
    line-height: 1.2;
    color: var(--ink);
    margin: 0 0 12px;
    font-weight: 600;
  }
  .meta { font-size: .85rem; color: var(--muted); margin: 0 0 28px; }
  .entradilla {
    font-family: var(--serif);
    font-size: 1.2rem;
    line-height: 1.55;
    color: var(--ink);
    margin: 0 0 34px;
  }
  h2 {
    font-family: var(--serif);
    font-size: 1.3rem;
    color: var(--ink);
    margin: 34px 0 10px;
    font-weight: 600;
  }
  p { margin: 0 0 14px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 18px; font-size: .92rem; }
  th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { font-size: .74rem; letter-spacing: .09em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  td.valor { font-variant-numeric: tabular-nums; white-space: nowrap; }
  ul, ol { margin: 0 0 18px; padding-left: 1.15rem; }
  li { margin-bottom: 8px; }
  li .cuando { color: var(--muted); font-size: .85rem; display: block; }
  .aviso {
    background: var(--paper-light);
    border-left: 3px solid var(--bronze);
    padding: 16px 18px;
    margin: 34px 0 0;
    font-size: .85rem;
    color: var(--muted);
  }
  .aviso strong { color: var(--ink); }
  .fuentes { font-size: .85rem; }
  .fuentes a { color: var(--ink); word-break: break-word; }
  @media print {
    body { padding: 0; background: #fff; }
    .hoja { max-width: none; }
  }
`;

export function informeAHtml(informe) {
  const config = TIPOS[informe.tipo];
  const titulo = `${config.titulo} · ${fechaLarga(informe.fecha)}`;

  const indicadores = informe.indicadores
    .map(
      (indicador) => `<tr>
          <td>${escapar(indicador.etiqueta)}</td>
          <td class="valor">${escapar(indicador.valor)}</td>
          <td>${escapar(indicador.referencia)}</td>
        </tr>`,
    )
    .join('\n');

  const hechos = informe.hechos
    .map(
      (hecho) =>
        `<li><span class="cuando">${escapar(hecho.fecha)}</span>${escapar(hecho.texto)}</li>`,
    )
    .join('\n');

  const agenda = informe.agenda
    .map((cita) => `<li><span class="cuando">${escapar(cita.cuando)}</span>${escapar(cita.que)}</li>`)
    .join('\n');

  const cuerpo = informe.cuerpo
    .map(
      (seccion) =>
        `<h2>${escapar(seccion.titulo)}</h2>\n` +
        seccion.parrafos.map((parrafo) => `<p>${escapar(parrafo)}</p>`).join('\n'),
    )
    .join('\n');

  const fuentes = informe.fuentes
    .map(
      (fuente) =>
        `<li><a href="${escapar(fuente.url)}" rel="noreferrer noopener">${escapar(fuente.titulo)}</a></li>`,
    )
    .join('\n');

  const revisado = informe.revision?.revisadoIso
    ? `Revisado por una persona el ${fechaLarga(informe.revision.revisadoIso.slice(0, 10))}.`
    : 'Borrador sin revisar: no debe difundirse.';

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<style>${ESTILOS}</style>
</head>
<body>
<article class="hoja">
  <p class="marca">NUVIA · ${escapar(config.titulo)}</p>
  <hr class="filete">

  <h1>${escapar(informe.titular)}</h1>
  <p class="meta">${escapar(fechaLarga(informe.fecha))}</p>
  <p class="entradilla">${escapar(informe.entradilla)}</p>

  <h2>Cifras de referencia</h2>
  <table>
    <thead><tr><th>Indicador</th><th>Valor</th><th>Referencia</th></tr></thead>
    <tbody>
${indicadores}
    </tbody>
  </table>

  <h2>Qué ha ocurrido</h2>
  <ul>
${hechos}
  </ul>

${cuerpo}

  <h2>Qué está previsto</h2>
  <ul>
${agenda}
  </ul>

  <h2>Fuentes consultadas</h2>
  <ul class="fuentes">
${fuentes}
  </ul>

  <aside class="aviso">
    <p><strong>Cómo se ha elaborado.</strong> Documentación y redacción asistidas por
    inteligencia artificial sobre fuentes públicas contrastadas
    (${escapar(informe.generacion.modeloInvestigacion)} para la documentación y
    ${escapar(informe.generacion.modeloRedaccion)} para la redacción).
    ${escapar(revisado)}</p>
    <p><strong>Qué no es este documento.</strong> Es información económica de carácter
    divulgativo. No es asesoramiento financiero, no evalúa si algo resulta apropiado para tu
    situación y no contiene recomendaciones de compra o de venta. Las cifras conservan su fecha
    y su fuente para que puedas comprobarlas.</p>
  </aside>
</article>
</body>
</html>
`;
}

export { escapar };
