/**
 * Contrato del informe de mercado de NUVIA (`informe-mercado.v1`).
 *
 * Este informe NO es el informe de estrategia de BDB. Aquel lleva asignación de
 * activos, pesos tácticos y vistas Positiva/Neutral/Negativa, y aquí eso está
 * prohibido: el §5 de `docs/MARCO_REGULATORIO_OBLIGATORIO.md` no admite
 * «puntuaciones o semáforos de atractivo financiero» ni «rankings de emisores o
 * instrumentos por mérito inversor», y el §7 prohíbe que la IA traduzca una
 * métrica en un consejo. Lo que sí permite el §5 es describir hechos
 * verificables, mostrar resultados numéricos y señalar limitaciones: ese, y solo
 * ese, es el perímetro de este contrato.
 *
 * La validación no es decorativa. Es la barrera técnica que exige el §7 cuando
 * pide «controles para impedir recomendaciones» que «no dependan exclusivamente
 * de instrucciones textuales»: si el modelo se sale del guion, el informe no
 * llega a publicarse aunque el prompt dijera lo contrario.
 */

import { tieneFuentePrimaria } from './fuentes.mjs';

export const VERSION_CONTRATO = 'informe-mercado.v1';
export const VERSION_PROMPT = 'nuvia-mercados-2026-09';

export const TIPOS = {
  DIARIO: {
    id: 'DIARIO',
    prefijo: 'diario',
    etiqueta: 'diario',
    titulo: 'Informe diario de mercado',
    diasVigencia: 2,
    parrafos: [3, 6],
  },
  SEMANAL: {
    id: 'SEMANAL',
    prefijo: 'semanal',
    etiqueta: 'semanal',
    titulo: 'Informe semanal de mercado',
    diasVigencia: 10,
    parrafos: [4, 9],
  },
};

/**
 * Vocabulario vetado en el texto publicable.
 *
 * No sustituye al criterio humano: una frase puede recomendar sin usar ninguna
 * de estas palabras. Es una red que atrapa la deriva más común de un modelo de
 * lenguaje cuando escribe sobre mercados, para que el revisor no tenga que
 * cazarla a mano en cada edición.
 */
const EXPRESIONES_VETADAS = [
  /\bcompr(?:ar|e|amos|en)\b/i,
  /\bvend(?:er|a|emos|an)\b/i,
  /\bmantener\s+(?:posici|la\s+exposici)/i,
  /\bsobreponder(?:ar|amos)?\b/i,
  /\binfraponder(?:ar|amos)?\b/i,
  /\brecomend(?:amos|able|ación|acion)/i,
  /\boportunidad\s+de\s+(?:compra|inversión|inversion|entrada)/i,
  /\bmomento\s+de\s+(?:entrar|comprar|vender)/i,
  /\bes\s+(?:el\s+)?momento\s+(?:de|para)\b/i,
  /\baconsej(?:amos|able)/i,
  /\bapost(?:ar|amos)\s+por\b/i,
  /\bidóneo|\bidoneo|\badecuado\s+para\s+(?:ti|usted|su\s+perfil)/i,
  /\bprecio\s+objetivo\b/i,
  /\bpotencial\s+(?:alcista|bajista)\b/i,
  /\binfravalorad|\bsobrevalorad/i,
  /\bcartera\s+(?:recomendada|sugerida|ideal)\b/i,
  /\bdeberías?\b|\bdebería\s+usted\b/i,
];

/** Campos que delatan que alguien ha portado el informe de BDB tal cual. */
const CAMPOS_PROHIBIDOS = [
  'assetAllocation',
  'marketTemperature',
  'tailRisks',
  'temperatura',
  'vistas',
  'pesos',
];

class ErrorContrato extends Error {}
export { ErrorContrato };

function fallo(mensaje) {
  throw new ErrorContrato(mensaje);
}

function texto(valor, campo, { min = 1, max = 4000 } = {}) {
  if (typeof valor !== 'string') fallo(`${campo} debe ser texto.`);
  const limpio = valor.trim();
  if (limpio.length < min) fallo(`${campo} es demasiado corto (mínimo ${min}).`);
  if (limpio.length > max) fallo(`${campo} es demasiado largo (máximo ${max}).`);
  return limpio;
}

function lista(valor, campo, min, max) {
  if (!Array.isArray(valor)) fallo(`${campo} debe ser una lista.`);
  if (valor.length < min || valor.length > max) {
    fallo(`${campo} debe tener entre ${min} y ${max} elementos; tiene ${valor.length}.`);
  }
  return valor;
}

function urlSegura(valor, campo) {
  const limpio = texto(valor, campo, { max: 600 });
  let url;
  try {
    url = new URL(limpio);
  } catch {
    return fallo(`${campo} no es una URL válida.`);
  }
  if (url.protocol !== 'https:') fallo(`${campo} debe usar https.`);
  // Las redirecciones del buscador caducan en horas y ocultan el destino. Si
  // una llega hasta aquí es que no se resolvió al generar, y publicarla sería
  // publicar un enlace roto con fecha de caducidad.
  if (/vertexaisearch\.cloud\.google\.com/.test(url.hostname + url.pathname)) {
    fallo(`${campo} sigue siendo una redirección del buscador, no la fuente real.`);
  }
  return url.toString();
}

/** Recorre todo el texto publicable de una edición. */
function textoPublicable(informe) {
  const partes = [informe.titular, informe.entradilla];
  for (const hecho of informe.hechos ?? []) partes.push(hecho.texto);
  for (const cita of informe.agenda ?? []) partes.push(cita.que);
  for (const indicador of informe.indicadores ?? []) partes.push(indicador.etiqueta, indicador.referencia);
  for (const seccion of informe.cuerpo ?? []) {
    partes.push(seccion.titulo);
    for (const parrafo of seccion.parrafos ?? []) partes.push(parrafo);
  }
  return partes.filter((parte) => typeof parte === 'string').join('\n');
}

/**
 * Valida una edición y devuelve una copia normalizada.
 *
 * `estado` distingue el borrador recién generado del que ya ha pasado por una
 * persona. La revisión humana la exige el §7 y la promete la propia página de
 * mercados: «No se presenta como diario ningún contenido que no haya sido
 * actualizado y revisado».
 */
export function validarInforme(entrada, { tipoEsperado = null } = {}) {
  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
    fallo('El informe debe ser un objeto.');
  }

  for (const campo of CAMPOS_PROHIBIDOS) {
    if (campo in entrada) {
      fallo(
        `El campo «${campo}» no pertenece a este contrato. El informe de NUVIA es ` +
          'descriptivo: no publica asignación de activos, vistas ni termómetros de mercado.',
      );
    }
  }

  const tipo = texto(entrada.tipo, 'tipo', { max: 20 });
  if (!(tipo in TIPOS)) fallo(`tipo debe ser DIARIO o SEMANAL; llegó «${tipo}».`);
  if (tipoEsperado && tipo !== tipoEsperado) fallo(`Se esperaba un informe ${tipoEsperado}.`);
  const config = TIPOS[tipo];

  const fecha = texto(entrada.fecha, 'fecha', { min: 10, max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fallo('fecha debe tener el formato AAAA-MM-DD.');

  const informe = {
    schema_version: VERSION_CONTRATO,
    tipo,
    id: `${config.prefijo}-${fecha}`,
    fecha,
    fechaIso: texto(entrada.fechaIso ?? `${fecha}T00:00:00.000Z`, 'fechaIso', { min: 20, max: 30 }),
    generadoIso: texto(entrada.generadoIso ?? new Date().toISOString(), 'generadoIso', { min: 20, max: 30 }),
    titular: texto(entrada.titular, 'titular', { min: 12, max: 120 }),
    entradilla: texto(entrada.entradilla, 'entradilla', { min: 80, max: 600 }),
    hechos: lista(entrada.hechos, 'hechos', 3, 8).map((bruto, i) => ({
      texto: texto(bruto?.texto, `hechos[${i}].texto`, { min: 20, max: 400 }),
      fecha: texto(bruto?.fecha, `hechos[${i}].fecha`, { min: 4, max: 40 }),
    })),
    indicadores: lista(entrada.indicadores, 'indicadores', 3, 10).map((bruto, i) => ({
      etiqueta: texto(bruto?.etiqueta, `indicadores[${i}].etiqueta`, { min: 2, max: 60 }),
      valor: texto(bruto?.valor, `indicadores[${i}].valor`, { min: 1, max: 60 }),
      referencia: texto(bruto?.referencia, `indicadores[${i}].referencia`, { min: 4, max: 120 }),
    })),
    agenda: lista(entrada.agenda, 'agenda', 2, 10).map((bruto, i) => ({
      cuando: texto(bruto?.cuando, `agenda[${i}].cuando`, { min: 3, max: 60 }),
      que: texto(bruto?.que, `agenda[${i}].que`, { min: 10, max: 300 }),
    })),
    cuerpo: lista(entrada.cuerpo, 'cuerpo', 2, 5).map((bruto, i) => ({
      titulo: texto(bruto?.titulo, `cuerpo[${i}].titulo`, { min: 4, max: 90 }),
      parrafos: lista(bruto?.parrafos, `cuerpo[${i}].parrafos`, 1, 6).map((p, j) =>
        texto(p, `cuerpo[${i}].parrafos[${j}]`, { min: 60, max: 1200 }),
      ),
    })),
    fuentes: lista(entrada.fuentes, 'fuentes', 2, 12).map((bruto, i) => ({
      titulo: texto(bruto?.titulo, `fuentes[${i}].titulo`, { min: 2, max: 180 }),
      url: urlSegura(bruto?.url, `fuentes[${i}].url`),
    })),
    generacion: {
      modeloInvestigacion: texto(
        entrada.generacion?.modeloInvestigacion,
        'generacion.modeloInvestigacion',
        { max: 80 },
      ),
      modeloRedaccion: texto(entrada.generacion?.modeloRedaccion, 'generacion.modeloRedaccion', { max: 80 }),
      versionPrompt: texto(entrada.generacion?.versionPrompt ?? VERSION_PROMPT, 'generacion.versionPrompt', {
        max: 60,
      }),
      fuentesConsultadas: Number(entrada.generacion?.fuentesConsultadas ?? 0),
    },
    revision: {
      estado: entrada.revision?.estado === 'publicado' ? 'publicado' : 'borrador',
      revisadoIso: entrada.revision?.revisadoIso ?? null,
    },
  };

  const totalParrafos = informe.cuerpo.reduce((suma, seccion) => suma + seccion.parrafos.length, 0);
  const [minParrafos, maxParrafos] = config.parrafos;
  if (totalParrafos < minParrafos || totalParrafos > maxParrafos) {
    fallo(
      `El cuerpo del informe ${config.etiqueta} debe tener entre ${minParrafos} y ${maxParrafos} ` +
        `párrafos en total; tiene ${totalParrafos}.`,
    );
  }

  if (!tieneFuentePrimaria(informe.fuentes)) {
    fallo(
      'Ninguna fuente es de quien publica el dato de primera mano (banco central, ' +
        'instituto de estadística, organismo público, bolsa o emisor de índices). ' +
        'Vuelve a generar el borrador: un informe descriptivo no se sostiene sobre ' +
        'comentarios de terceros.',
    );
  }

  const cuerpoCompleto = textoPublicable(informe);
  for (const patron of EXPRESIONES_VETADAS) {
    const encontrado = cuerpoCompleto.match(patron);
    if (encontrado) {
      fallo(
        `El texto contiene «${encontrado[0]}», que convierte la descripción en consejo. ` +
          'El informe de NUVIA describe lo ocurrido; no orienta sobre qué hacer con ello.',
      );
    }
  }

  return informe;
}

/** Vigencia declarada de una edición, con el mismo criterio que el resto del portal. */
export function vigencia(informe, ahora = new Date()) {
  const config = TIPOS[informe.tipo];
  const fecha = new Date(`${informe.fecha}T00:00:00.000Z`);
  const dias = Math.max(0, Math.floor((ahora.getTime() - fecha.getTime()) / 86_400_000));
  return { estado: dias <= config.diasVigencia ? 'vigente' : 'archivo', dias };
}
