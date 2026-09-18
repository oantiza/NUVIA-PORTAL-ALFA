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

import { acreditarPorNombre, tieneFuentePrimaria } from './fuentes.mjs';

/**
 * v2 (14-09-2026). El informe deja de ser solo prosa: entran cuatro bloques
 * que la página y el descargable convierten en tablas y gráficos, todos
 * dentro del perímetro descriptivo del §5 («mostrar resultados numéricos»,
 * «explicar fórmulas y conceptos», «describir hechos verificables»):
 *
 *   claves     «En pocas palabras»: 3-5 ideas en lenguaje llano que explican
 *              qué ha pasado y por qué importa para entender la economía.
 *   mercados   tabla de referencias por grupo (bolsas, deuda, divisas,
 *              materias primas, volatilidad) con nivel, variación del período y
 *              variación en el año, como NÚMEROS, y `null` donde no hay fuente.
 *   agenda     cada cita con fecha AAAA-MM-DD, hora, región, dato anterior y
 *              por qué importa (la forma v1 `cuando`/`que` sigue siendo válida).
 *   glosario   los términos técnicos del texto, explicados.
 *
 * Lo que NO entra, aunque el informe de BDB lo lleve: escenarios con
 * probabilidad, riesgos con «impacto», termómetros, vistas o asignación. Eso
 * es opinión sobre precio o mérito inversor y el §5 lo prohíbe.
 *
 * Al LEER, los bloques nuevos son opcionales: las ediciones v1 publicadas
 * siguen validando. Al GENERAR (`exigirBloques`), son obligatorios: un
 * borrador nuevo sin tablas no llega a `output/`.
 */
export const VERSION_CONTRATO = 'informe-mercado.v2';
export const VERSION_PROMPT = 'nuvia-mercados-2026-09-r3';

export const TIPOS = {
  DIARIO: {
    id: 'DIARIO',
    prefijo: 'diario',
    etiqueta: 'diario',
    titulo: 'Informe diario de mercado',
    diasVigencia: 2,
    // v2: el cuerpo crece porque ahora explica el porqué de cada movimiento;
    // el mínimo se mantiene para que las ediciones v1 sigan siendo válidas.
    parrafos: [3, 10],
    periodo: 'Var. día',
  },
  SEMANAL: {
    id: 'SEMANAL',
    prefijo: 'semanal',
    etiqueta: 'semanal',
    titulo: 'Informe semanal de mercado',
    diasVigencia: 10,
    parrafos: [4, 14],
    periodo: 'Var. semana',
  },
};

/**
 * Bloques v2 que un borrador recién generado tiene que traer.
 *
 * `mercados` solo se le exige al semanal: en el diario la tabla repetía el
 * cierre que ya cuentan las cifras destacadas y los hechos, así que ni se pide
 * al modelo ni se publica (decisión del fundador, 14-09-2026). Si un diario la
 * trae igualmente, se valida como siempre; simplemente no es obligatoria.
 */
export const BLOQUES_V2 = ['claves', 'mercados', 'agenda', 'glosario'];
export const bloquesExigidos = (tipo) => BLOQUES_V2.filter((b) => !(b === 'mercados' && tipo === 'DIARIO'));

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
  // v2: tampoco escenarios con probabilidad ni riesgos con «impacto», que son
  // expectativas propias sobre precio (§5, «veredictos de valoración»).
  'scenarios',
  'escenarios',
  'riesgos',
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
  const partes = [informe.titular, informe.entradilla, informe.limitaciones];
  for (const hecho of informe.hechos ?? []) partes.push(hecho.texto, hecho.fecha);
  for (const cita of informe.agenda ?? []) partes.push(cita.que, cita.cuando);
  for (const indicador of informe.indicadores ?? []) partes.push(indicador.etiqueta, indicador.valor, indicador.referencia);
  for (const fuente of informe.fuentes ?? []) partes.push(fuente.titulo, fuente.nota);
  for (const seccion of informe.cuerpo ?? []) {
    partes.push(seccion.titulo);
    for (const parrafo of seccion.parrafos ?? []) partes.push(parrafo);
  }
  // v2: el veto alcanza a todo lo que se publica, también a lo nuevo.
  for (const clave of informe.claves ?? []) partes.push(clave.titulo, clave.texto);
  for (const grupo of informe.mercados ?? []) {
    partes.push(grupo.grupo);
    for (const fila of grupo.filas ?? []) partes.push(fila.nombre, fila.nivel, fila.nota);
  }
  for (const cita of informe.agenda ?? []) partes.push(cita.region, cita.porQueImporta, cita.anterior);
  for (const entrada of informe.glosario ?? []) partes.push(entrada.termino, entrada.definicion);
  return partes.filter((parte) => typeof parte === 'string').join('\n');
}

/** Cifra que puede faltar: `null` vale; un texto («+1,4 %») no. */
function numeroOpcional(valor, campo, minimo, maximo) {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    fallo(`${campo} debe ser un número (0.8 = +0,8 %) o null; llegó «${String(valor)}».`);
  }
  if (valor < minimo || valor > maximo) fallo(`${campo} está fuera de rango (${valor}).`);
  return valor;
}

function textoOpcional(valor, campo, opciones) {
  if (valor === null || valor === undefined || valor === '') return null;
  return texto(valor, campo, opciones);
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
function fechaReal(valor) {
  return FECHA.test(valor) && Number.isFinite(Date.parse(`${valor}T12:00:00Z`)) &&
    new Date(`${valor}T12:00:00Z`).toISOString().slice(0, 10) === valor;
}

function validarCurvas(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) fallo('curvas debe ser un objeto.');
  const curvas = lista(valor.curvas, 'curvas.curvas', 1, 2);
  const claves = new Set();
  return {
    obtenidoIso: texto(valor.obtenidoIso ?? new Date().toISOString(), 'curvas.obtenidoIso', { min: 20, max: 30 }),
    curvas: curvas.map((bruto, i) => {
      const campo = `curvas.curvas[${i}]`;
      const clave = texto(bruto?.clave, `${campo}.clave`, { min: 2, max: 20 });
      if (!/^(eurozona|eeuu)$/.test(clave)) fallo(`${campo}.clave debe ser eurozona o eeuu.`);
      if (claves.has(clave)) fallo(`${campo}: la curva «${clave}» está repetida.`);
      claves.add(clave);
      const fecha = texto(bruto?.fecha, `${campo}.fecha`, { min: 10, max: 10 });
      if (!fechaReal(fecha)) fallo(`${campo}.fecha no es un día real.`);
      const fechaAnterior = bruto?.fechaAnterior ? texto(bruto.fechaAnterior, `${campo}.fechaAnterior`, { min: 10, max: 10 }) : null;
      if (fechaAnterior && (!fechaReal(fechaAnterior) || fechaAnterior >= fecha)) fallo(`${campo}.fechaAnterior debe ser anterior a la fecha de la curva.`);
      const plazos = new Set();
      const puntos = lista(bruto?.puntos, `${campo}.puntos`, 4, 14).map((punto, j) => {
        const plazo = texto(punto?.plazo, `${campo}.puntos[${j}].plazo`, { min: 2, max: 8 });
        if (plazos.has(plazo)) fallo(`${campo}: el plazo «${plazo}» está repetido.`);
        plazos.add(plazo);
        const anios = punto?.anios;
        if (typeof anios !== 'number' || !(anios > 0) || anios > 50) fallo(`${campo}.puntos[${j}].anios debe ser un número de años positivo.`);
        const actual = numeroOpcional(punto?.actual, `${campo}.puntos[${j}].actual`, -5, 30);
        if (actual === null) fallo(`${campo}.puntos[${j}].actual es obligatorio.`);
        return { plazo, anios, actual, anterior: fechaAnterior ? numeroOpcional(punto?.anterior, `${campo}.puntos[${j}].anterior`, -5, 30) : null };
      });
      if (puntos.some((p, j) => j && p.anios <= puntos[j - 1].anios)) fallo(`${campo}: los plazos deben ir de menor a mayor.`);
      return {
        clave,
        nombre: texto(bruto?.nombre, `${campo}.nombre`, { min: 4, max: 80 }),
        fecha,
        fechaAnterior,
        puntos,
        fuente: { titulo: texto(bruto?.fuente?.titulo, `${campo}.fuente.titulo`, { min: 4, max: 180 }), url: urlSegura(bruto?.fuente?.url, `${campo}.fuente.url`) },
      };
    }),
  };
}

/**
 * Bloques v2. Cada validador devuelve la copia normalizada del bloque; las
 * referencias a fuentes (`fuentes: [n]`) se resuelven después, con las demás.
 */
function validarClaves(valor) {
  return lista(valor, 'claves', 3, 5).map((bruto, i) => ({
    titulo: texto(bruto?.titulo, `claves[${i}].titulo`, { min: 4, max: 90 }),
    texto: texto(bruto?.texto, `claves[${i}].texto`, { min: 40, max: 480 }),
  }));
}

function validarMercados(valor) {
  const grupos = lista(valor, 'mercados', 2, 6);
  const nombresGrupo = new Set();
  let totalFilas = 0;
  const salida = grupos.map((bruto, g) => {
    const grupo = texto(bruto?.grupo, `mercados[${g}].grupo`, { min: 3, max: 60 });
    if (nombresGrupo.has(grupo.toLowerCase())) fallo(`mercados: el grupo «${grupo}» está repetido.`);
    nombresGrupo.add(grupo.toLowerCase());
    const nombres = new Set();
    const filas = lista(bruto?.filas, `mercados[${g}].filas`, 1, 12).map((filaBruta, f) => {
      const campo = `mercados[${g}].filas[${f}]`;
      const nombre = texto(filaBruta?.nombre, `${campo}.nombre`, { min: 2, max: 80 });
      if (nombres.has(nombre.toLowerCase())) fallo(`${campo}: la referencia «${nombre}» está repetida en el grupo.`);
      nombres.add(nombre.toLowerCase());
      totalFilas += 1;
      const fila = {
        nombre,
        nivel: textoOpcional(filaBruta?.nivel, `${campo}.nivel`, { max: 60 }),
        variacion: numeroOpcional(filaBruta?.variacion, `${campo}.variacion`, -100, 1000),
        variacionAnual: numeroOpcional(filaBruta?.variacionAnual, `${campo}.variacionAnual`, -100, 5000),
        nota: textoOpcional(filaBruta?.nota, `${campo}.nota`, { max: 240 }),
      };
      return fila;
    });
    return { grupo, filas };
  });
  if (totalFilas < 5) fallo('mercados debe reunir al menos cinco referencias en total.');
  return salida;
}

function validarCitaAgenda(bruto, i) {
  const campo = `agenda[${i}]`;
  // Forma v1: `cuando` + `que`. Forma v2: fecha AAAA-MM-DD y campos separados.
  if (bruto?.fecha === undefined) {
    return {
      cuando: texto(bruto?.cuando, `${campo}.cuando`, { min: 3, max: 60 }),
      que: texto(bruto?.que, `${campo}.que`, { min: 10, max: 300 }),
    };
  }
  const fecha = texto(bruto.fecha, `${campo}.fecha`, { min: 10, max: 10 });
  if (!fechaReal(fecha)) fallo(`${campo}.fecha debe ser un día real en formato AAAA-MM-DD.`);
  return {
    fecha,
    hora: textoOpcional(bruto.hora, `${campo}.hora`, { max: 24 }),
    region: texto(bruto.region, `${campo}.region`, { min: 2, max: 40 }),
    que: texto(bruto.que, `${campo}.que`, { min: 10, max: 300 }),
    anterior: textoOpcional(bruto.anterior, `${campo}.anterior`, { max: 60 }),
    porQueImporta: textoOpcional(bruto.porQueImporta, `${campo}.porQueImporta`, { max: 260 }),
  };
}

function validarGlosario(valor) {
  const terminos = new Set();
  return lista(valor, 'glosario', 2, 10).map((bruto, i) => {
    const termino = texto(bruto?.termino, `glosario[${i}].termino`, { min: 2, max: 60 });
    if (terminos.has(termino.toLowerCase())) fallo(`glosario: «${termino}» está repetido.`);
    terminos.add(termino.toLowerCase());
    return { termino, definicion: texto(bruto?.definicion, `glosario[${i}].definicion`, { min: 30, max: 400 }) };
  });
}

/**
 * Valida una edición y devuelve una copia normalizada.
 *
 * `estado` distingue el borrador recién generado del que ya ha pasado por una
 * persona. La revisión humana la exige el §7 y la promete la propia página de
 * mercados: «No se presenta como diario ningún contenido que no haya sido
 * actualizado y revisado».
 */
export function validarInforme(entrada, { tipoEsperado = null, exigirBloques = false, alRetirar = null } = {}) {
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
  if (!Object.hasOwn(TIPOS, tipo)) fallo(`tipo debe ser DIARIO o SEMANAL; llegó «${tipo}».`);
  if (tipoEsperado && tipo !== tipoEsperado) fallo(`Se esperaba un informe ${tipoEsperado}.`);
  const config = TIPOS[tipo];

  const fecha = texto(entrada.fecha, 'fecha', { min: 10, max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fallo('fecha debe tener el formato AAAA-MM-DD.');
  const fechaValida = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor) &&
    Number.isFinite(Date.parse(`${valor}T12:00:00Z`)) && new Date(`${valor}T12:00:00Z`).toISOString().slice(0, 10) === valor;
  if (!fechaValida(fecha)) fallo('fecha no corresponde a un día real.');

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
    agenda: lista(entrada.agenda, 'agenda', 2, 14).map(validarCitaAgenda),
    cuerpo: lista(entrada.cuerpo, 'cuerpo', 2, 5).map((bruto, i) => ({
      titulo: texto(bruto?.titulo, `cuerpo[${i}].titulo`, { min: 4, max: 90 }),
      parrafos: lista(bruto?.parrafos, `cuerpo[${i}].parrafos`, 1, 6).map((p, j) =>
        texto(p, `cuerpo[${i}].parrafos[${j}]`, { min: 60, max: 1200 }),
      ),
    })),
    fuentes: lista(entrada.fuentes, 'fuentes', 2, 12).map((bruto, i) => ({
      titulo: texto(bruto?.titulo, `fuentes[${i}].titulo`, { min: 2, max: 180 }),
      url: urlSegura(bruto?.url, `fuentes[${i}].url`),
      ...(bruto?.nota ? { nota: texto(bruto.nota, `fuentes[${i}].nota`, { max: 300 }) } : {}),
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
      ...(entrada.revision?.nota ? { nota: texto(entrada.revision.nota, 'revision.nota', { max: 600 }) } : {}),
    },
  };

  for (const campo of ['fechaIso', 'generadoIso']) {
    if (!Number.isFinite(Date.parse(informe[campo]))) fallo(`${campo} no es una fecha válida.`);
  }
  if (informe.fechaIso.slice(0, 10) !== fecha) fallo('fechaIso no coincide con la fecha de edición.');
  if (informe.revision.revisadoIso && !Number.isFinite(Date.parse(informe.revision.revisadoIso))) fallo('Fecha de revisión no válida.');
  if (entrada.periodo) {
    const { desde, hasta, corteIso } = entrada.periodo;
    if (!fechaValida(desde) || !fechaValida(hasta) || desde > hasta || hasta !== fecha) fallo('Período incoherente con la edición.');
    if (tipo === 'DIARIO' && desde !== hasta) fallo('El período diario debe identificar una jornada.');
    if (tipo === 'SEMANAL' && Date.parse(hasta) - Date.parse(desde) !== 6 * 86400000) fallo('El semanal debe abarcar siete días naturales.');
    if (corteIso && !Number.isFinite(Date.parse(corteIso))) fallo('Fecha de corte no válida.');
    informe.periodo = { desde, hasta, ...(corteIso ? { corteIso } : {}) };
  }
  if (entrada.limitaciones) informe.limitaciones = texto(entrada.limitaciones, 'limitaciones', { max: 1200 });

  // Bloques v2: se validan si vienen; al generar, tienen que venir.
  for (const bloque of BLOQUES_V2) {
    if (bloque === 'agenda') continue; // siempre presente; su forma v2 se admite arriba
    const bruto = entrada[bloque];
    if (bruto === undefined || bruto === null) {
      if (exigirBloques && bloquesExigidos(tipo).includes(bloque)) {
        fallo(`Falta el bloque «${bloque}»: un informe nuevo no se publica sin él.`);
      }
      continue;
    }
    informe[bloque] = bloque === 'claves' ? validarClaves(bruto) : bloque === 'mercados' ? validarMercados(bruto) : validarGlosario(bruto);
  }
  // Curvas de tipos (18-09-2026): bloque opcional que rellena `curvas.mjs` al
  // publicar, con datos transcritos del BCE y del Tesoro de EE. UU. Nunca se
  // exige: si un publicador no responde, el informe sale sin él.
  if (entrada.curvas !== undefined && entrada.curvas !== null) informe.curvas = validarCurvas(entrada.curvas);
  if (exigirBloques && !informe.agenda.every((cita) => cita.fecha)) {
    fallo('Cada cita de la agenda debe llevar fecha AAAA-MM-DD, hora si se conoce y región.');
  }

  const resolverRefs = (refs, campo) => {
    if (!Array.isArray(refs) || refs.some((n) => !Number.isInteger(n) || n < 1 || n > informe.fuentes.length)) fallo(`${campo}: referencia a fuente inexistente.`);
    return [...new Set(refs)];
  };
  for (const campo of ['hechos', 'indicadores', 'agenda', 'cuerpo', 'claves']) {
    (informe[campo] ?? []).forEach((bloque, i) => {
      const refs = entrada[campo][i].fuentes;
      if (refs !== undefined) bloque.fuentes = resolverRefs(refs, `${campo}[${i}]`);
    });
  }
  // Lo mismo que en la tabla de mercados, para el texto: un hecho que nadie
  // publica no es un hecho, y un indicador con cifra sin respaldo es peor que
  // no ponerlo. Antes de retirar nada se intenta acreditar por el nombre del
  // organismo —el modelo escribe «según el BCE» y olvida el número de la
  // fuente— y solo se retira lo que sigue sin respaldo. Se aplica al GENERAR:
  // las ediciones ya publicadas se leen tal cual.
  if (exigirBloques) {
    const retirados = [];
    for (const campo of ['hechos', 'indicadores']) {
      informe[campo] = (informe[campo] ?? []).filter((bloque) => {
        if (bloque.fuentes?.length) return true;
        const pistas =
          campo === 'hechos'
            ? bloque.texto
            : `${bloque.etiqueta} ${bloque.valor} ${bloque.referencia}`;
        const acreditadas = acreditarPorNombre(pistas, informe.fuentes);
        if (acreditadas.length) {
          bloque.fuentes = acreditadas;
          return true;
        }
        // Un indicador sin cifra (un texto cualitativo) no afirma un número:
        // no se le exige respaldo documental.
        if (campo === 'indicadores' && !/\d/.test(bloque.valor ?? '')) return true;
        retirados.push(`${campo}: ${campo === 'hechos' ? bloque.texto : `${bloque.etiqueta} (${bloque.valor})`}`);
        return false;
      });
    }
    if (retirados.length && typeof alRetirar === 'function') alRetirar(retirados);
    if (informe.hechos.length < 3) {
      fallo(
        'Menos de tres hechos con fuente que los publique de primera mano. ' +
          'Vuelve a generar el borrador: lo retirado no se sustituye con relleno.',
      );
    }
    if (informe.indicadores.length < 3) {
      fallo(
        'Menos de tres indicadores acreditados. Vuelve a generar el borrador: ' +
          'una cifra sin publicación que la respalde no se publica.',
      );
    }
  }

  // Una fila de mercado con cifra tiene que decir de dónde sale. Sin fuente, la
  // cifra NO se publica: la fila se queda en «Sin contrastar» con las variaciones
  // a null y una nota que lo dice. No se tumba el borrador entero por ello —el
  // modelo olvida a menudo el número de la fuente— pero tampoco se cuela una
  // cifra que nadie respalda (misma regla que las cifras de referencia).
  (informe.mercados ?? []).forEach((grupo, g) => {
    grupo.filas.forEach((fila, f) => {
      const refs = entrada.mercados[g].filas[f].fuentes;
      if (refs !== undefined) fila.fuentes = resolverRefs(refs, `mercados[${g}].filas[${f}]`);
      const conCifra = fila.variacion !== null || fila.variacionAnual !== null || /\d/.test(fila.nivel ?? '');
      if (conCifra && !(fila.fuentes?.length)) {
        fila.nivel = 'Sin contrastar';
        fila.variacion = null;
        fila.variacionAnual = null;
        fila.nota = 'La documentación no acredita esta cifra con una publicación de primera mano; no se publica.';
        fila.fuentes = [];
      }
    });
  });

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
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(ahora);
  const dias = Math.floor((Date.parse(`${hoy}T00:00:00Z`) - fecha.getTime()) / 86_400_000);
  return { estado: dias < 0 ? 'futuro' : dias <= config.diasVigencia ? 'vigente' : 'archivo', dias };
}
