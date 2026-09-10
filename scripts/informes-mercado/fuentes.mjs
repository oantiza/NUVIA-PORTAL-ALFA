/**
 * Procedencia de las fuentes del informe.
 *
 * Dos problemas distintos que se resuelven aquí:
 *
 * 1. **Calidad.** La primera edición de prueba citó doce fuentes para una
 *    decisión del BCE y ninguna era del BCE: había un bróker, un foro de
 *    inversión y varios medios locales. Un informe que describe hechos tiene
 *    que apoyarse en quien los publica.
 * 2. **Independencia.** El §10 del marco regulatorio la exige, y la nota de
 *    mercado de un bróker es material comercial: su negocio es que el lector
 *    opere. No entra, aunque el dato que cite sea correcto.
 *
 * Las listas son ampliables. Añadir un dominio a `PRIMARIAS` es también darle
 * nombre legible: es el que verá el lector en lugar del dominio pelado.
 */

/** Quien publica el dato de primera mano. Dominio → nombre para el lector. */
export const PRIMARIAS = new Map([
  // Bancos centrales y supervisores
  ['ecb.europa.eu', 'Banco Central Europeo'],
  ['bde.es', 'Banco de España'],
  ['federalreserve.gov', 'Reserva Federal de Estados Unidos'],
  ['bankofengland.co.uk', 'Banco de Inglaterra'],
  ['boj.or.jp', 'Banco de Japón'],
  ['snb.ch', 'Banco Nacional de Suiza'],
  ['riksbank.se', 'Riksbank'],
  ['norges-bank.no', 'Norges Bank'],
  ['esma.europa.eu', 'ESMA'],
  ['eba.europa.eu', 'Autoridad Bancaria Europea'],
  ['cnmv.es', 'CNMV'],

  // Estadística y organismos públicos
  ['ine.es', 'Instituto Nacional de Estadística'],
  ['ec.europa.eu', 'Comisión Europea'],
  ['consilium.europa.eu', 'Consejo de la Unión Europea'],
  ['europa.eu', 'Unión Europea'],
  ['boe.es', 'Boletín Oficial del Estado'],
  ['tesoro.es', 'Tesoro Público'],
  ['hacienda.gob.es', 'Ministerio de Hacienda'],
  ['seg-social.es', 'Seguridad Social'],
  ['bls.gov', 'Oficina de Estadísticas Laborales de Estados Unidos'],
  ['bea.gov', 'Bureau of Economic Analysis'],
  ['census.gov', 'Oficina del Censo de Estados Unidos'],
  ['treasury.gov', 'Tesoro de Estados Unidos'],
  ['eia.gov', 'Administración de Información Energética de Estados Unidos'],
  ['imf.org', 'Fondo Monetario Internacional'],
  ['worldbank.org', 'Banco Mundial'],
  ['oecd.org', 'OCDE'],
  ['bis.org', 'Banco de Pagos Internacionales'],
  ['opec.org', 'OPEP'],
  ['iea.org', 'Agencia Internacional de la Energía'],

  // Bolsas, cámaras y emisores de índices
  ['bolsasymercados.es', 'Bolsas y Mercados Españoles'],
  ['bmerf.es', 'BME Renta Fija'],
  ['euronext.com', 'Euronext'],
  ['lseg.com', 'London Stock Exchange Group'],
  ['deutsche-boerse.com', 'Deutsche Börse'],
  ['nyse.com', 'New York Stock Exchange'],
  ['nasdaq.com', 'Nasdaq'],
  ['theice.com', 'Intercontinental Exchange'],
  ['cmegroup.com', 'CME Group'],
  ['stoxx.com', 'STOXX'],
  ['msci.com', 'MSCI'],
  ['spglobal.com', 'S&P Global'],
  ['ftserussell.com', 'FTSE Russell'],
]);

/**
 * Fuera del informe.
 *
 * No es un juicio sobre su rigor: es que su modelo de negocio depende de que el
 * lector opere o contrate, y NUVIA no puede apoyarse en eso ni parecer que lo
 * hace. Se excluyen aunque el dato citado sea correcto.
 */
export const VETADAS = [
  // Brókeres y plataformas de negociación
  'xtb.com',
  'etoro.com',
  'plus500.com',
  'ig.com',
  'capital.com',
  'avatrade.com',
  'admiralmarkets.com',
  'admirals.com',
  'cmcmarkets.com',
  'pepperstone.com',
  'oanda.com',
  'libertex.com',
  'activtrades.com',
  'forex.com',
  'tickmill.com',
  'darwinex.com',
  'degiro.es',
  'traderepublic.com',
  'freedom24.com',
  'interactivebrokers.com',
  'saxobank.com',
  'home.saxo',
  'swissquote.com',
  'lgt.com',
  'juliusbaer.com',
  // Portales cuyo producto son recomendaciones o señales
  'rankia.com',
  'estrategiasdeinversion.com',
  'investing.com',
  'benzinga.com',
  'motleyfool.com',
  'fool.com',
  'zacks.com',
];

/** Coincidencia por sufijo, quedándose con el dominio más específico. */
function dominioCoincidente(host, dominios) {
  const limpio = String(host || '').toLowerCase().replace(/^www\./, '');
  let mejor = null;
  for (const dominio of dominios) {
    if (limpio === dominio || limpio.endsWith(`.${dominio}`)) {
      if (!mejor || dominio.length > mejor.length) mejor = dominio;
    }
  }
  return mejor;
}

export function clasificarFuente(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return { tipo: 'invalida', nombre: null };
  }
  if (dominioCoincidente(host, VETADAS)) return { tipo: 'vetada', nombre: null, host };

  const primaria = dominioCoincidente(host, PRIMARIAS.keys());
  if (primaria) return { tipo: 'primaria', nombre: PRIMARIAS.get(primaria), host };

  return { tipo: 'secundaria', nombre: host.replace(/^www\./, ''), host };
}

/**
 * Depura la lista de fuentes: quita las vetadas y las repetidas, pone nombre
 * legible y coloca delante a quien publica el dato de primera mano.
 *
 * El orden importa porque el informe muestra doce como mucho: si las primarias
 * fueran al final, serían justo las que se caen.
 */
export function depurarFuentes(fuentes, { maximo = 12, maximoSecundarias = 4 } = {}) {
  const vistas = new Set();
  const primarias = [];
  const secundarias = [];

  for (const fuente of fuentes ?? []) {
    const url = fuente?.url;
    if (!url) continue;
    const { tipo, nombre, host } = clasificarFuente(url);
    if (tipo === 'vetada' || tipo === 'invalida') continue;
    if (vistas.has(host)) continue;
    vistas.add(host);
    (tipo === 'primaria' ? primarias : secundarias).push({ titulo: nombre, url });
  }

  // La cola secundaria se acota. Es donde acaba apareciendo el ruido —agregadores,
  // prensa local de otro continente, boletines de dudosa procedencia— y una lista
  // de doce enlaces en la que solo dos valen le da al lector una falsa sensación
  // de respaldo. Perseguir esos dominios uno a uno sería una carrera perdida;
  // limitar cuántos entran, no.
  return [...primarias, ...secundarias.slice(0, maximoSecundarias)].slice(0, maximo);
}

/** ¿Hay al menos una fuente de quien publica el dato de primera mano? */
export function tieneFuentePrimaria(fuentes) {
  return (fuentes ?? []).some((fuente) => clasificarFuente(fuente?.url).tipo === 'primaria');
}
