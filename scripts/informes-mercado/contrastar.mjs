/**
 * Contraste de un BORRADOR contra publicadores de primera mano. No corrige ni
 * publica: escribe un informe en Markdown para quien revisa.
 *
 *   node scripts/informes-mercado/contrastar.mjs --id semanal-2026-09-19 [--salida ruta.md]
 *
 * No usa Gemini a propósito. Si la verificación dependiera del mismo modelo que
 * redactó, compartiría sus errores; aquí se pregunta a quien publica la cifra
 * (BCE, Tesoro de EE. UU., EIA) y se revisa el respaldo de cada fila.
 *
 * Lo que este script NO hace: no acredita una lectura humana ni rellena la nota
 * de `revision`. Esa nota la escribe el revisor al aprobar (`/publicar <nota>`).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { clasificarFuente } from './fuentes.mjs';
import { curvaBce, curvaTesoro, referenciaEurUsd, referenciaBrent } from './curvas.mjs';

const CARPETA_BORRADORES = 'output/informes-borrador';

/** Tolerancias por encima de las cuales una cifra se marca como discrepante. */
export const TOLERANCIAS = {
  nivelRelativo: 0.005, // 0,5 % sobre el nivel (divisas, materias primas)
  rentabilidadPp: 0.05, // 5 puntos básicos en rentabilidades de deuda
};

/** Expresiones que delatan una cifra que no es la que el nombre de la fila promete. */
export const SOSPECHOSAS = [
  { patron: /SX5EST|SX5GT|net return|total return/i, motivo: 'variante del índice (rentabilidad total), no el índice de precios habitual' },
  { patron: /cup[oó]n/i, motivo: 'el cupón de una emisión no es su rentabilidad de mercado' },
  { patron: /subasta/i, motivo: 'la rentabilidad media de una subasta no es el cierre de mercado' },
];

/** «19.838,50 puntos» → 19838.5 · «3,39 %» → 3.39 · «Sin contrastar» → null */
export function leerNumeroEs(texto) {
  const m = String(texto ?? '').match(/-?\d{1,3}(?:\.\d{3})*(?:,\d+)?|-?\d+(?:,\d+)?/);
  if (!m) return null;
  const n = Number(m[0].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

const fmt = (n, d = 2) => (n === null || n === undefined ? '—' : new Intl.NumberFormat('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n));

function filas(informe) {
  return (informe.mercados ?? []).flatMap((g) => g.filas.map((f) => ({ ...f, grupo: g.grupo })));
}

/** Respaldo de cada fila: primaria, solo secundaria, sin fuente o sin contrastar. */
export function revisarRespaldo(informe) {
  return filas(informe).map((fila) => {
    const tipos = (fila.fuentes ?? []).map((n) => clasificarFuente(informe.fuentes?.[n - 1]?.url ?? '').tipo);
    const avisos = [];
    const sinCifra = leerNumeroEs(fila.nivel) === null;
    if (sinCifra) avisos.push('sin contrastar: no se publica cifra');
    else if (!tipos.length) avisos.push('cifra sin fuente');
    else if (!tipos.includes('primaria')) avisos.push('solo fuentes secundarias');
    for (const s of SOSPECHOSAS) {
      if (s.patron.test(`${fila.nombre} ${fila.nota ?? ''}`)) avisos.push(s.motivo);
    }
    return { grupo: fila.grupo, nombre: fila.nombre, nivel: fila.nivel, respaldo: tipos, avisos };
  });
}

/** Busca la fila que corresponde a una referencia oficial. */
function buscar(informe, patron) {
  return filas(informe).find((f) => patron.test(f.nombre)) ?? null;
}

/**
 * Compara las cifras del borrador con las referencias oficiales ya descargadas.
 * `oficiales` = { eurUsd, brent, tesoro, bce } (cualquiera puede faltar).
 */
export function compararConOficiales(informe, oficiales) {
  const resultados = [];
  const nivelRelativo = (nombre, fila, oficial, unidad) => {
    if (!fila) return;
    const propio = leerNumeroEs(fila.nivel);
    if (propio === null) {
      resultados.push({ nombre, estado: 'sin cifra', borrador: fila.nivel, oficial: `${fmt(oficial.valor, 4)} ${unidad} (${oficial.fecha})`, fuente: oficial.fuente });
      return;
    }
    const desvio = Math.abs(propio - oficial.valor) / oficial.valor;
    resultados.push({
      nombre,
      estado: desvio > TOLERANCIAS.nivelRelativo ? 'DISCREPA' : 'coincide',
      borrador: fila.nivel,
      oficial: `${fmt(oficial.valor, 4)} ${unidad} (${oficial.fecha})`,
      fuente: oficial.fuente,
    });
  };

  if (oficiales.eurUsd) nivelRelativo('EUR/USD', buscar(informe, /eur\s*\/\s*usd|euro.*d[oó]lar|d[oó]lar.*euro/i), oficiales.eurUsd, 'USD');
  if (oficiales.brent) nivelRelativo('Brent', buscar(informe, /brent|petr[oó]leo|crudo/i), oficiales.brent, 'USD/barril');

  if (oficiales.tesoro) {
    const fila = buscar(informe, /(ee\.?\s*uu|estados unidos|eeuu|treasury|tesoro).*10|10.*(ee\.?\s*uu|estados unidos|eeuu|treasury)/i);
    const diez = oficiales.tesoro.puntos.find((p) => p.plazo === '10 a');
    if (fila && diez) {
      const propio = leerNumeroEs(fila.nivel);
      const oficial = `${fmt(diez.actual)} % (${oficiales.tesoro.fecha})`;
      resultados.push({
        nombre: 'Bono EE. UU. 10 años',
        estado: propio === null ? 'sin cifra' : Math.abs(propio - diez.actual) > TOLERANCIAS.rentabilidadPp ? 'DISCREPA' : 'coincide',
        borrador: fila.nivel,
        oficial,
        fuente: oficiales.tesoro.fuente,
      });
    }
  }

  // El bono alemán no tiene serie propia aquí: la curva AAA del BCE es solo una
  // orientación, no la rentabilidad del Bund. Se muestra sin juicio.
  if (oficiales.bce) {
    const fila = buscar(informe, /(alem|bund).*10|10.*(alem|bund)/i);
    const diez = oficiales.bce.puntos.find((p) => p.plazo === '10 a');
    if (fila && diez) {
      resultados.push({
        nombre: 'Bono alemán 10 años',
        estado: 'orientativo',
        borrador: fila.nivel,
        oficial: `${fmt(diez.actual)} % curva AAA del BCE (${oficiales.bce.fecha}); no es la serie del Bund`,
        fuente: oficiales.bce.fuente,
      });
    }
  }
  return resultados;
}

function valorReferencia(ref) {
  // armarReferencia devuelve la fila ya formateada; se recupera el número del nivel.
  const valor = leerNumeroEs(ref.fila.nivel);
  const fecha = ref.fila.nota?.match(/del (\d{1,2} de \w+ de \d{4})/)?.[1] ?? '';
  return { valor, fecha, fuente: ref.fuente };
}

export async function obtenerOficiales(periodo) {
  const [eur, brent, tesoro, bce] = await Promise.allSettled([
    referenciaEurUsd(periodo),
    referenciaBrent(periodo),
    curvaTesoro(periodo),
    curvaBce(periodo),
  ]);
  const errores = [eur, brent, tesoro, bce].filter((r) => r.status === 'rejected').map((r) => r.reason?.message ?? String(r.reason));
  return {
    oficiales: {
      ...(eur.status === 'fulfilled' ? { eurUsd: valorReferencia(eur.value) } : {}),
      ...(brent.status === 'fulfilled' ? { brent: valorReferencia(brent.value) } : {}),
      ...(tesoro.status === 'fulfilled' ? { tesoro: tesoro.value } : {}),
      ...(bce.status === 'fulfilled' ? { bce: bce.value } : {}),
    },
    errores,
  };
}

export function informeMarkdown(informe, { respaldo, comparacion, errores }) {
  const l = [];
  l.push(`## Contraste automático · ${informe.id}`, '');
  l.push(`**Titular:** ${informe.titular}`, '');
  l.push(
    `Modelos: ${informe.generacion?.modeloInvestigacion ?? '—'} (documentación) · ${informe.generacion?.modeloRedaccion ?? '—'} (redacción). ` +
      `Fuentes: ${informe.fuentes?.length ?? 0} (${(informe.fuentes ?? []).filter((f) => clasificarFuente(f.url).tipo === 'primaria').length} primarias).`,
    '',
  );

  l.push('### Cifras frente a publicadores oficiales', '');
  if (comparacion.length) {
    l.push('| Referencia | Estado | Borrador | Oficial |', '|---|---|---|---|');
    for (const c of comparacion) l.push(`| ${c.nombre} | ${c.estado === 'DISCREPA' ? '⚠️ **DISCREPA**' : c.estado} | ${c.borrador ?? '—'} | [${c.oficial}](${c.fuente.url}) |`);
  } else {
    l.push('_Ninguna fila del borrador tiene referencia oficial automática (el diario no lleva bloque de mercados)._');
  }
  if (informe.tipo === 'SEMANAL') {
    l.push('', '_En el semanal, `publicar.mjs` sustituye EUR/USD y Brent por la cifra del BCE y la EIA y añade las curvas de tipos al publicar; una discrepancia en esas dos filas se corrige sola, pero conviene revisar si el texto cita la cifra errónea._');
  }
  l.push('');

  const conAviso = respaldo.filter((r) => r.avisos.length);
  l.push('### Respaldo de cada fila', '');
  if (!respaldo.length) l.push('_Sin bloque de mercados._');
  else if (!conAviso.length) l.push('Todas las filas tienen al menos una fuente primaria y ningún patrón sospechoso.');
  else for (const r of conAviso) l.push(`- **${r.nombre}** (${r.grupo}, ${r.nivel ?? '—'}): ${r.avisos.join('; ')}.`);
  l.push('');

  if (errores.length) {
    l.push('### Publicadores que no respondieron', '');
    for (const e of errores) l.push(`- ${e}`);
    l.push('');
  }

  l.push(
    '### Qué falta y lo hace el revisor',
    '',
    '- Leer claves, hechos y cuerpo: el script no juzga la prosa ni las cifras citadas en el texto.',
    '- Corregir lo necesario editando el JSON del borrador en esta rama.',
    '- Aprobar con un comentario `/publicar <nota de revisión>` que diga qué se contrastó y qué se corrigió. Sin nota no se publica.',
    '',
  );
  return l.join('\n');
}

export async function contrastar({ id, raiz = process.cwd() }) {
  const informe = JSON.parse(await readFile(resolve(raiz, CARPETA_BORRADORES, `${id}.json`), 'utf8'));
  const respaldo = revisarRespaldo(informe);
  const periodo = informe.periodo ?? { desde: informe.fecha, hasta: informe.fecha };
  const { oficiales, errores } = informe.mercados?.length ? await obtenerOficiales(periodo) : { oficiales: {}, errores: [] };
  const comparacion = compararConOficiales(informe, oficiales);
  return { informe, respaldo, comparacion, errores, markdown: informeMarkdown(informe, { respaldo, comparacion, errores }) };
}

if (process.argv[1] && process.argv[1].endsWith('contrastar.mjs')) {
  const argv = process.argv.slice(2);
  const valor = (n) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : null);
  const id = valor('id');
  if (!/^(diario|semanal)-\d{4}-\d{2}-\d{2}$/.test(id ?? '')) {
    process.stderr.write('\n  Indica el borrador con --id diario-AAAA-MM-DD o semanal-AAAA-MM-DD\n\n');
    process.exitCode = 1;
  } else {
    contrastar({ id })
      .then(async ({ markdown }) => {
        const salida = valor('salida');
        if (salida) await writeFile(salida, markdown, 'utf8');
        else process.stdout.write(`${markdown}\n`);
      })
      .catch((error) => {
        process.stderr.write(`\n  No se ha podido contrastar.\n  ${error.message}\n\n`);
        process.exitCode = 1;
      });
  }
}
