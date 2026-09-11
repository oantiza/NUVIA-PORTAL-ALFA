/**
 * Prompts del informe de mercado de NUVIA.
 *
 * El §7 del marco regulatorio exige que las instrucciones de sistema estén
 * alineadas con él y que los controles «no dependan exclusivamente de
 * instrucciones textuales». Estos prompts son la primera capa; la segunda es
 * `contrato.mjs`, que rechaza la edición si el modelo se sale del guion.
 *
 * La diferencia con el informe de estrategia de BDB es deliberada: allí se pide
 * un posicionamiento, aquí se prohíbe. NUVIA describe lo ocurrido y lo que está
 * previsto; quien decide qué hacer con ello es el lector.
 */

import { TIPOS, VERSION_PROMPT } from './contrato.mjs';

const PERIMETRO = `PERIMETRO OBLIGATORIO. Este informe describe hechos; no orienta decisiones.
Está terminantemente prohibido:
- sugerir comprar, vender, mantener, entrar o salir de nada;
- calificar un activo como oportunidad, adecuado, atractivo, caro o barato;
- dar precios objetivo, potencial alcista o bajista, o veredictos de valoración;
- proponer una asignación de cartera, pesos por clase de activo o vistas del tipo
  positiva/neutral/negativa;
- publicar un termómetro, semáforo o puntuación de mercado;
- ordenar instrumentos o emisores por mérito inversor;
- dirigirse al lector diciéndole lo que debería hacer.
Sí se pide, en cambio: describir lo ocurrido con su cifra, su unidad y su fecha,
explicar qué variable movió a qué otra cuando la fuente lo establezca, y señalar
con claridad lo que todavía no se sabe.`;

/**
 * Refuerzo para el segundo intento.
 *
 * El buscador no siempre pisa las webs oficiales: en pasadas sucesivas del mismo
 * prompt, unas veces devuelve el BCE y el INE y otras solo prensa que los cita.
 * Cuando la primera documentación no trae ninguna fuente de primera mano, se
 * repite con esta instrucción en lugar de dar el informe por perdido.
 */
const INSISTIR_OFICIALES = `AVISO: la búsqueda anterior no encontró ninguna fuente de primera mano
y sin ella este informe no se publica. Empieza por búsquedas restringidas al sitio de quien
publica el dato, con el operador site:, antes de cualquier búsqueda general. Por ejemplo:
site:ecb.europa.eu, site:bde.es, site:ine.es, site:bls.gov, site:federalreserve.gov,
site:bolsasymercados.es, site:eia.gov o site:ec.europa.eu, según el dato que busques.
Al menos una de las fuentes que utilices debe salir de una de esas webs.`;

export function promptInvestigacion(tipo, hoy, { insistirOficiales = false } = {}) {
  const config = TIPOS[tipo];
  const ventana =
    tipo === 'DIARIO'
      ? `la última sesión de mercado y las últimas 24 horas`
      : `los últimos siete días naturales`;
  const agenda = tipo === 'DIARIO' ? 'de hoy y de mañana' : 'de los próximos siete días';

  const refuerzo = insistirOficiales ? `

${INSISTIR_OFICIALES}` : '';

  return `Actúa como documentalista económico. Reúne la base factual del informe ${config.etiqueta}
de mercado de un portal de educación financiera español.
Fecha de referencia en Europe/Madrid: ${hoy}.

Usa Google Search de forma obligatoria. Busca cada dato en la web de quien lo publica de
primera mano y no en quien lo comenta: para una decisión de tipos, la nota de prensa del banco
central; para un dato de inflación o de paro, el instituto de estadística; para un cierre de
mercado, la bolsa o el emisor del índice. Lanza búsquedas dirigidas a esos sitios oficiales
antes que búsquedas generales, y contrasta cada cifra anotando de dónde sale.

No cites brókeres, plataformas de negociación ni portales de recomendaciones: su negocio es que
el lector opere, y este informe no puede apoyarse en material comercial.

Cubre, siempre con cifra, unidad y fecha, lo ocurrido en ${ventana}:
1. Cierre de las principales bolsas de Europa, Estados Unidos y Asia, y qué lo explica según
   las fuentes.
2. Deuda pública, divisas, materias primas y volatilidad: nivel y variación.
3. Datos macroeconómicos publicados y decisiones o comparecencias de bancos centrales.
4. Calendario ${agenda}: publicaciones estadísticas, subastas, reuniones y comparecencias.

${PERIMETRO}

No inventes datos ni rellenes huecos. Distingue lo que es un hecho publicado de lo que es una
interpretación de un analista, y atribuye la interpretación a quien la firma. Si un dato aún no
se ha publicado, dilo en lugar de estimarlo.
Identifica el inicio y el final del período y la hora de corte. Siete días naturales no
equivalen necesariamente a una semana bursátil completa. Para una variación, documenta ambos
extremos, la moneda, el contrato y la hora; no mezcles niveles intradía y cierres. Distingue la
fecha de anuncio de la entrada en vigor. Para cada afirmación anota la URL exacta de la
publicación que la respalda; el dominio de una entidad no acredita cualquier dato.

Devuelve un memorando de documentación en español. Todavía no redactes el informe final.${refuerzo}`;
}

export function promptRedaccion(tipo, hoy, investigacion, fuentes = []) {
  const config = TIPOS[tipo];
  const [minParrafos, maxParrafos] = config.parrafos;

  return `Eres el redactor de mercados de un portal español de educación financiera. Redacta el
informe ${config.etiqueta} con fecha ${hoy} usando EXCLUSIVAMENTE la base factual incluida al
final. No añadas ninguna cifra ni acontecimiento que no esté en esa base.

El lector es una persona con ahorros, no un profesional: escribe claro, en frases cortas, y
explica el término técnico la primera vez que aparezca. Tono sereno y descriptivo.

${PERIMETRO}

Devuelve ÚNICAMENTE JSON válido, sin bloque de código alrededor, con esta forma exacta:
{
  "tipo": "${tipo}",
  "fecha": "${hoy}",
  "titular": "una frase de 12 a 120 caracteres que describa el hecho principal, sin juicio",
  "entradilla": "2 o 3 frases que resuman lo ocurrido",
  "hechos": [{"texto": "hecho con su cifra y unidad", "fecha": "cuándo ocurrió", "fuentes": [1]}],
  "indicadores": [{"etiqueta": "nombre", "valor": "valor con unidad", "referencia": "fecha y fuente", "fuentes": [1]}],
  "agenda": [{"cuando": "fecha u hora", "que": "qué se publica o quién comparece", "fuentes": [1]}],
  "cuerpo": [{"titulo": "título de sección", "parrafos": ["párrafo"], "fuentes": [1]}],
  "limitaciones": "Cobertura, datos sin contrastar y posibles fuentes con contenido mutable.",
  "generacion": {"versionPrompt": "${VERSION_PROMPT}"}
}

Reglas de tamaño: de 3 a 8 hechos; de 3 a 10 indicadores; de 2 a 10 citas de agenda; de 2 a 5
secciones con ${minParrafos} a ${maxParrafos} párrafos en total, cada uno de 60 caracteres como
mínimo. No incluyas un campo de fuentes: las añade el sistema a partir de las búsquedas reales.
Cada lista interna de fuentes contiene los números de las publicaciones que respaldan ese
bloque. No atribuyas una cifra a una publicación que no la contiene. Para un dato sin respaldo,
escribe "Sin contrastar", explica la carencia y usa una lista vacía. La agenda refleja lo que
estaba previsto a la fecha de corte. No conviertas un jueves en cierre de semana bursátil.

FUENTES DISPONIBLES (numeración desde 1):
${fuentes.map((fuente, i) => `${i + 1}. ${fuente.titulo}: ${fuente.url}`).join('\n')}

BASE FACTUAL DOCUMENTADA:
${String(investigacion).slice(0, 24000)}`;
}
