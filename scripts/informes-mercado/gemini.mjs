/**
 * Cliente mínimo de la API de Gemini para los informes de mercado.
 *
 * Las dos listas de modelos no son un ranking «del mejor al peor»: son dos
 * trabajos distintos. Medido contra la API el 10-09-2026 con estos mismos
 * prompts, la fase de investigación y la de redacción premian a modelos
 * diferentes:
 *
 *   INVESTIGACIÓN (con google_search)
 *     gemini-3.8-flash        13-17 búsquedas, 56-62 fuentes
 *     gemini-3.1-pro-preview  0 búsquedas, 0 fuentes: responde de memoria
 *   REDACCIÓN (sin buscador, JSON)
 *     gemini-3.1-pro-preview  mejor síntesis; ~15 s, que aquí no importa
 *
 * Que un modelo conteste de memoria es justo el fallo que este informe no puede
 * permitirse, porque el §7 del marco regulatorio prohíbe «inventar precios,
 * ratios, fuentes o acontecimientos». Por eso la cascada descarta al que no
 * buscó en vez de aceptar su prosa.
 */

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const MODELOS_INVESTIGACION = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-pro-preview',
];

export const MODELOS_REDACCION = [
  'gemini-3.1-pro-preview',
  'gemini-3.8-flash',
  'gemini-pro-latest',
  'gemini-flash-latest',
];

export const MINIMO_FUENTES = 2;

export class ErrorGemini extends Error {}

export function leerClave() {
  const clave = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!clave) {
    throw new ErrorGemini(
      'Falta GEMINI_API_KEY en el entorno. El generador no guarda ni pide credenciales.',
    );
  }
  return clave;
}

function extraerTexto(respuesta) {
  let texto = '';
  for (const candidato of respuesta.candidates ?? []) {
    for (const parte of candidato.content?.parts ?? []) {
      if (typeof parte.text === 'string') texto += parte.text;
    }
  }
  return texto.trim();
}

/** Fuentes reales devueltas por el buscador, no las que el modelo diga citar. */
export function extraerFuentes(respuesta) {
  const vistas = new Set();
  const fuentes = [];
  for (const candidato of respuesta.candidates ?? []) {
    const meta = candidato.groundingMetadata ?? candidato.grounding_metadata ?? {};
    for (const trozo of meta.groundingChunks ?? meta.grounding_chunks ?? []) {
      const web = trozo.web ?? trozo.retrievedContext ?? {};
      const url = web.uri ?? web.url;
      if (!url || vistas.has(url)) continue;
      vistas.add(url);
      fuentes.push({ titulo: String(web.title ?? url).slice(0, 180), url });
      if (fuentes.length >= 12) return fuentes;
    }
  }
  return fuentes;
}

/**
 * Cambia las redirecciones de Google por la dirección real de cada fuente.
 *
 * El buscador no devuelve la URL de la fuente, sino un enlace propio del tipo
 * `vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQ…`. Publicar eso
 * es publicar un enlace que el lector no puede juzgar antes de pulsarlo y que,
 * además, **caduca**: comprobado el 10-09-2026, una redirección de dos horas
 * antes ya devolvía 404. Un informe descargable con doce enlaces muertos no
 * documenta nada.
 *
 * Por eso se resuelven aquí, nada más generar, mientras siguen vivas, y no al
 * publicar. La que no se pueda resolver se descarta: es preferible un informe
 * con menos fuentes que uno con enlaces rotos.
 */
export async function resolverRedirecciones(fuentes, { timeoutMs = 10000 } = {}) {
  const resueltas = await Promise.all(
    (fuentes ?? []).map(async (fuente) => {
      if (!/vertexaisearch\.cloud\.google\.com/.test(fuente.url)) return fuente;
      try {
        const control = new AbortController();
        const alarma = setTimeout(() => control.abort(), timeoutMs);
        const respuesta = await fetch(fuente.url, { redirect: 'manual', signal: control.signal });
        clearTimeout(alarma);
        const destino = respuesta.headers.get('location');
        if (!destino || !destino.startsWith('https://')) return null;
        return { titulo: fuente.titulo, url: destino };
      } catch {
        return null;
      }
    }),
  );
  return resueltas.filter(Boolean);
}

async function generarContenido(modelo, clave, prompt, { fundamentado, json }) {
  const generationConfig = {
    // Gemini 3 está calibrado para temperature 1.0 y Google desaconseja bajarla:
    // por debajo aparecen bucles y degradación en tareas de razonamiento.
    temperature: 1.0,
    // Presupuesto conjunto de razonamiento y respuesta. Con thinkingLevel high
    // la investigación puede gastar más de 5.000 tokens pensando antes de
    // escribir la primera palabra.
    maxOutputTokens: 32768,
    thinkingConfig: { thinkingLevel: 'high' },
  };
  if (json) generationConfig.responseMimeType = 'application/json';

  const cuerpo = { contents: [{ parts: [{ text: prompt }] }], generationConfig };
  if (fundamentado) cuerpo.tools = [{ google_search: {} }];

  const respuesta = await fetch(`${BASE}/models/${modelo}:generateContent`, {
    method: 'POST',
    // La clave va en cabecera, no en la query: las URL acaban en registros
    // intermedios y una clave en la ruta es una clave filtrada.
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': clave },
    body: JSON.stringify(cuerpo),
  });

  if (!respuesta.ok) {
    const detalle = (await respuesta.text()).slice(0, 400);
    const error = new ErrorGemini(`Gemini ${modelo}: HTTP ${respuesta.status}. ${detalle}`);
    error.codigo = respuesta.status;
    throw error;
  }
  return respuesta.json();
}

/**
 * Recorre la lista de modelos hasta que uno entrega un resultado utilizable.
 *
 * En la fase fundamentada «utilizable» incluye haber buscado de verdad: un texto
 * impecable sin una sola fuente cede el turno al siguiente modelo.
 */
export async function generarConReserva(clave, prompt, { fundamentado, json }) {
  const modelos = fundamentado ? MODELOS_INVESTIGACION : MODELOS_REDACCION;
  const intentos = [];

  for (const modelo of modelos) {
    let respuesta;
    try {
      respuesta = await generarContenido(modelo, clave, prompt, { fundamentado, json });
    } catch (error) {
      intentos.push(error.message);
      if (error.codigo === 400 || error.codigo === 404) continue;
      throw error;
    }

    const texto = extraerTexto(respuesta);
    const motivo = respuesta.candidates?.[0]?.finishReason;
    if (!texto || (motivo && motivo !== 'STOP')) {
      intentos.push(`Gemini ${modelo}: respuesta incompleta (${motivo ?? 'sin texto'})`);
      continue;
    }

    if (fundamentado) {
      const fuentes = extraerFuentes(respuesta);
      if (fuentes.length < MINIMO_FUENTES) {
        intentos.push(`Gemini ${modelo}: respondió sin buscar (${fuentes.length} fuentes)`);
        continue;
      }
    }

    return { texto, respuesta, modelo };
  }

  throw new ErrorGemini(`Ningún modelo dio un resultado válido. ${intentos.join(' | ')}`);
}

/**
 * Extrae el primer objeto JSON completo del texto.
 *
 * Cortar entre la primera `{` y la última `}` parece equivalente y no lo es: si
 * el modelo escribe el objeto y luego añade una nota, o devuelve dos objetos
 * seguidos, ese recorte se lleva la basura por delante y JSON.parse falla con un
 * «Unexpected non-whitespace character after JSON» que no dice nada. Aquí se
 * cuentan las llaves respetando cadenas y escapes, y se corta en la que cierra.
 */
function primerObjeto(texto) {
  const inicio = texto.indexOf('{');
  if (inicio < 0) return null;

  let profundidad = 0;
  let enCadena = false;
  let escapado = false;

  for (let i = inicio; i < texto.length; i += 1) {
    const caracter = texto[i];
    if (enCadena) {
      if (escapado) escapado = false;
      else if (caracter === '\\') escapado = true;
      else if (caracter === '"') enCadena = false;
      continue;
    }
    if (caracter === '"') enCadena = true;
    else if (caracter === '{') profundidad += 1;
    else if (caracter === '}') {
      profundidad -= 1;
      if (profundidad === 0) return texto.slice(inicio, i + 1);
    }
  }
  return null;
}

/** Recorta el vallado de bloque de código que a veces envuelve al JSON. */
export function leerJson(texto) {
  let limpio = texto.trim();
  if (limpio.startsWith('```')) {
    limpio = limpio.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  }
  const objeto = primerObjeto(limpio) ?? limpio;
  try {
    return JSON.parse(objeto);
  } catch (causa) {
    throw new ErrorGemini(`El modelo no devolvió JSON válido: ${causa.message}`);
  }
}

export { primerObjeto };
