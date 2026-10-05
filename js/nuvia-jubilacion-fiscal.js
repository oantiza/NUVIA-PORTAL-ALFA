/* ============================================================================
   NUVIA · Parámetros y reglas fiscales por territorio · IRPF 2026
   ----------------------------------------------------------------------------
   Módulo de configuración del simulador de jubilación y de sus guías. Aquí
   viven TODOS los parámetros fiscales (escalas, mínimos, bonificaciones,
   reglas de la previsión social) con su fuente oficial y su fecha de consulta,
   y las tres estructuras de cálculo que esos parámetros alimentan:

     · modelo «vasco»   → Bizkaia, Álava y Gipuzkoa (EPSV; bonificación del
                          trabajo, minoración de cuota, deducción por edad).
     · modelo «navarra» → Navarra (planes de pensiones; deducciones en cuota
                          por trabajo y por mínimo personal).
     · modelo «comun»   → territorio común (planes de pensiones; gastos y
                          reducción del trabajo, mínimo personal «a escala»,
                          escala estatal + escala autonómica).

   El motor (js/nuvia-jubilacion-motor.js) no contiene ninguna cifra fiscal:
   recibe el territorio (y la comunidad autónoma, en el estatal) y llama a
   estas funciones. Añadir una comunidad autónoma en la fase 2 es añadir un
   bloque de datos a CCAA con su escala y su fuente; el motor no se toca.

   Estado de cada entrada: 'verificada' (fuente oficial consultada y citada) o
   'en-preparacion' (no calcula; la interfaz lo dice; desde el 05-10-2026 no
   queda ninguna comunidad en ese estado). Nada se calcula con una
   entrada que no esté verificada.

   Fecha de consulta de todas las fuentes: 04-10-2026 (ejercicio IRPF 2026),
   salvo las escalas y mínimos de las comunidades autónomas (fase 2): 05-10-2026.

   Fase 2 (05-10-2026): las 15 comunidades de régimen común quedan verificadas
   con su escala autonómica 2026 (texto consolidado de su ley en el BOE,
   contrastado con «Tributación Autonómica. Medidas 2026» del Ministerio de
   Hacienda, actualizado a 23-09-2026). Siete de ellas fijan un mínimo del
   contribuyente propio (art. 56.3 LIRPF y art. 46.1.a Ley 22/2009): se guarda
   en minimoAutonomico { base, edad65, edad75 } y se aplica SOLO en la parte
   autonómica (art. 74.1.2.º y parte autonómica del ahorro); la parte estatal
   conserva el mínimo del art. 57.
   Fuera de alcance en todas las fases: deducciones autonómicas del régimen
   común y deducciones propias de los territorios forales (alquiler, hijos,
   vivienda…), la deducción navarra del art. 68 por pensiones de jubilación
   inferiores a 15.400 €, y Ceuta y Melilla (decisión del fundador de
   04-10-2026: su deducción del 60 % del art. 68.4 LIRPF no está modelada).
   ========================================================================== */
(function (global) {
  'use strict';

  const CONSULTA = '04-10-2026';
  const CONSULTA_CCAA = '05-10-2026';
  const EJERCICIO = 2026;

  const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
  const pos = (v) => Math.max(0, num(v));
  /* Importes con punto de miles, como en el resto del simulador (es-ES no separa los miles por debajo de 10.000). */
  const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const eurN = (n) => miles(n) + ' €';
  /* Con céntimos solo si los hay (p. ej. el mínimo de Madrid, 5.956,65 €). */
  const eurD = (n) => { const c = Math.round(num(n) * 100); return c % 100 ? miles(Math.floor(c / 100)) + ',' + String(c % 100).padStart(2, '0') + ' €' : eurN(n); };

  /* ------------------------------------------------------------ Escalas --- */
  /* Cada escala es una lista [desde, tipo]; la cuota se acumula tramo a tramo. */
  const ESCALA_GENERAL_VASCA = [[0, .23], [18080, .28], [36160, .35], [54240, .40], [77450, .45], [107260, .46], [142960, .47], [208390, .49]];
  const ESCALA_AHORRO_VASCA = [[0, .19], [7500, .20], [15000, .22], [30000, .24], [50000, .255], [90000, .26], [120000, .265], [240000, .27], [300000, .28]];
  const ESCALA_GENERAL_NAVARRA = [[0, .13], [4458, .22], [10030, .25], [21175, .28], [35663, .365], [51266, .415], [66869, .44], [89159, .47], [139310, .49], [195034, .505], [334344, .52]];
  const ESCALA_AHORRO_NAVARRA = [[0, .20], [6000, .22], [10000, .24], [15000, .26], [200000, .27], [300000, .28]];
  const ESCALA_GENERAL_ESTATAL = [[0, .095], [12450, .12], [20200, .15], [35200, .185], [60000, .225], [300000, .245]];
  /* Escala del art. 65 LIRPF (residentes en el extranjero; Ceuta y Melilla por
     la DA 32.ª). Se usa como ESCALA DE REFERENCIA: no es la de ninguna
     comunidad autónoma y no existe escala autonómica supletoria desde 2011. */
  const ESCALA_ART65 = [[0, .095], [12450, .12], [20200, .15], [35200, .185], [60000, .225]];
  /* Ahorro en territorio común: parte estatal (art. 66) + parte autonómica
     (art. 76), idénticas (9,5/10,5/11,5/13,5/15 %). Se guarda la suma. */
  const ESCALA_AHORRO_COMUN = [[0, .19], [6000, .21], [50000, .23], [200000, .27], [300000, .30]];

  function escala(base, tramos) {
    const x = pos(base); let cuota = 0; let marginal = tramos[0][1];
    for (let i = 0; i < tramos.length; i++) {
      const [desde, tipo] = tramos[i]; const hasta = tramos[i + 1] ? tramos[i + 1][0] : Infinity;
      if (x <= desde) break;
      cuota += (Math.min(x, hasta) - desde) * tipo; marginal = tipo;
    }
    return { cuota, marginal };
  }

  /* ------------------------------------------------------ Fuentes comunes -- */
  const F_EUSKADI = [
    { k: 'Gobierno Vasco', t: 'Índice oficial de normativa EPSV', href: 'https://www.euskadi.eus/indice-epsv-normativa/web01-s2oga/es/', d: 'Ley 5/2012, Decreto 203/2015 y sus modificaciones.' },
    { k: 'Gobierno Vasco', t: 'Régimen de aportaciones y prestaciones 2025-2026', href: 'https://www.euskadi.eus/contenidos/documentacion/reforma_fiscal/es_def/REGIMEN-DE-LAS-APORTACIONES-Y-PRESTACIONES-25_2026.-25.06.205.pdf', d: 'Cuadro comparativo de los tres territorios históricos tras la reforma fiscal.' },
    { k: 'Registro público', t: 'Registro de EPSV de Euskadi', href: 'https://www.euskadi.eus/registro-epsv/web01-tramite/es/', d: 'Acceso al registro oficial de entidades de previsión social voluntaria.' },
  ];

  /* Plazos de la gestora del plan de pensiones (art. 10 del Reglamento de
     planes y fondos de pensiones, RD 304/2004; BOE consolidado, consulta
     04-10-2026). Compartido por Navarra y territorio común. */
  const PLAZO_RD304 = 'Según el art. 10 del Reglamento de planes y fondos de pensiones (RD 304/2004), la entidad gestora debe notificar el reconocimiento del derecho a la prestación en un máximo de 15 días hábiles desde que se presenta la documentación completa, y abonar la prestación en forma de capital inmediato en un máximo de 7 días hábiles desde esa presentación. En planes de empleo de prestación definida el plazo de pago puede ampliarse hasta 30 días hábiles cuando la cuantificación exige la intervención de un tercero.';
  const F_RD304 = { k: 'BOE · texto consolidado', t: 'Real Decreto 304/2004, Reglamento de planes y fondos de pensiones', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2004-3453&tn=1', d: 'Art. 10: plazos de reconocimiento (15 días hábiles) y pago (7 días hábiles) de las prestaciones.' };

  /* ------------------------------------------------ Parámetros modelo vasco */
  const VASCO = {
    escalaGeneral: ESCALA_GENERAL_VASCA,
    escalaAhorro: ESCALA_AHORRO_VASCA,
    minoracion: 1615,
    bonificacion: { maxima: 8000, minima: 3000, umbral1: 14800, umbral2: 23000, coeficiente: .6098, otrasRentas: 7500 },
    edad: { desde: 65, mayor: 75, importe: 393, importeMayor: 714, base1: 20000, base2: 30000 },
    prevision: {
      figura: 'EPSV', modelo: 'vasco', corte: 2026,
      capital: .70, capitalTransitorio: .60, limite: 300000,
      estimacionAnual: .01, estimacionMaxima: .35, estimacionSinAntiguedad: .25,
      rentaMinimaAnios: 15, exencionRentaMax: null, crecimientoPre: 'posterior',
      aportacion: { individual: 5000, empleo: 8000, autonomos: 4000, conjunto: 10000 },
    },
  };

  const TERRITORIOS = [
    {
      id: 'bizkaia', nombre: 'Bizkaia', etiqueta: 'Bizkaia · Hacienda Foral de Bizkaia', modelo: 'vasco', estado: 'verificada', ejercicio: EJERCICIO, consulta: CONSULTA,
      regimen: 'foral', hacienda: 'Hacienda Foral de Bizkaia', haciendaCorta: 'HFB', organismo: 'Diputación Foral de Bizkaia', siglas: 'DFB',
      irpf: 'IRPF de Bizkaia', norma: 'Norma Foral 13/2013 del IRPF de Bizkaia', normaCorta: 'NF 13/2013',
      caso: 'dfb',
      parametros: VASCO,
      normativa: [
        ['Norma Foral 13/2013:', 'marco general del IRPF de Bizkaia (texto consolidado a 1-1-2026).'],
        ['Norma Foral 2/2025:', 'reforma fiscal con efectos desde 2026 (EPSV: aportaciones al 70 % y rentabilidad al ahorro).'],
        ['Norma Foral 7/2025:', 'Presupuestos 2026: escala general, minoración de 1.615 € y deducción por edad.'],
        ['Decretos Forales 100/2025 y 133/2025:', 'desarrollo reglamentario de la previsión social.'],
      ],
      fuentes: [
        { k: 'Hacienda Foral de Bizkaia', t: 'Norma Foral 13/2013 consolidada a 1-1-2026', href: 'https://www.bizkaia.eus/documents/880307/15187815/ca_13_2013.pdf?idioma=CA', d: 'Arts. 9.38, 19, 23, 37.e, 63, 71, 74-77 y 83; DA 42.ª y DT 37.ª.' },
        { k: 'BOB 30-12-2025', t: 'Norma Foral 7/2025 de Presupuestos 2026', href: 'https://www.bizkaia.eus/lehendakaritza/Bao_bob/2025/12/30/I-1446_cas.pdf', d: 'Escala general 2026, minoración de cuota y deducción por edad con efectos 1-1-2026.' },
        { k: 'Hacienda Foral de Bizkaia', t: 'Caso práctico EPSV 2026', href: 'https://gidak.bizkaia.eus/content/imagenes/Renta/CASO-PRACTICO-EPSV-26.pdf', d: 'El ejemplo oficial de rescate en capital y en renta que usa el simulador.' },
        { k: 'Hacienda Foral de Bizkaia', t: 'Ficha KA-01877 · Modificaciones del IRPF en 2026', href: 'https://dfb.microsoftcrmportals.com/es-ES/Articulo/?Code=KA-01877', d: 'Comparativa con la normativa anterior.' },
        { k: 'Hacienda Foral de Bizkaia', t: 'Ficha KA-01878 · Tributación de las EPSV en 2025 y 2026', href: 'https://dfb.microsoftcrmportals.com/es-ES/Articulo/?Code=KA-01878', d: 'Aportaciones, prestaciones y régimen transitorio.' },
      ].concat(F_EUSKADI),
      tramitacion: { estado: 'verificada', entidad: 'La prestación se solicita a la propia EPSV, conforme a sus estatutos y a su reglamento de prestaciones; la Hacienda Foral interviene a través de la retención y de la autoliquidación del IRPF, donde se ejercita, si procede, la opción por el régimen transitorio.', plazo: 'Con carácter general, el Reglamento de EPSV de Euskadi prevé el abono dentro de los cinco días hábiles siguientes a una solicitud completa. En sistemas de empleo se aplica el plazo previsto en estatutos o reglamento, con el límite del último día del mes siguiente.' },
    },
    {
      id: 'alava', nombre: 'Álava', etiqueta: 'Álava · Hacienda Foral de Álava', modelo: 'vasco', estado: 'verificada', ejercicio: EJERCICIO, consulta: CONSULTA,
      regimen: 'foral', hacienda: 'Hacienda Foral de Álava', haciendaCorta: 'HFA', organismo: 'Diputación Foral de Álava', siglas: 'DFA',
      irpf: 'IRPF de Álava', norma: 'Norma Foral 33/2013 del IRPF de Álava', normaCorta: 'NF 33/2013',
      caso: null,
      parametros: Object.assign({}, VASCO, { prevision: Object.assign({}, VASCO.prevision, { exencionRentaMax: .40 }) }),
      normativa: [
        ['Norma Foral 33/2013:', 'marco general del IRPF de Álava (texto consolidado con la NF 21/2025).'],
        ['Norma Foral 3/2025:', 'revisión de impuestos: EPSV al 70 % y rentabilidad al ahorro desde 2026; escala del ahorro.'],
        ['Norma Foral 21/2025:', 'medidas tributarias para 2026: escala general, minoración de 1.615 € y deducción por edad.'],
        ['Norma Foral 17/2025:', 'ajustes de la previsión social con efectos 1-1-2026 (art. 37.e, DA 40.ª, límites de aportación).'],
      ],
      fuentes: [
        { k: 'BOTHA 29-12-2025', t: 'Norma Foral 21/2025 de medidas tributarias para 2026', href: 'https://www.araba.eus/botha/Boletines/2025/147/2025_147_03861_C.pdf', d: 'Escala general, minoración y deducción por edad con efectos 1-1-2026.' },
        { k: 'BOTHA 16-04-2025', t: 'Norma Foral 3/2025 de revisión de determinados impuestos', href: 'https://www.araba.eus/BOTHA/Boletines/2025/044/2025_044_01182_C.pdf', d: 'Título IV, previsión social: integración al 70 %, exención en renta (tope 40 %), régimen transitorio.' },
        { k: 'BOTHA 22-12-2025', t: 'Norma Foral 17/2025', href: 'https://www.araba.eus/botha/Boletines/2025/145/2025_145_03675_C.pdf', d: 'Rentabilidad de la EPSV (art. 37.e), estimación sin desglose y límites de aportación 2026.' },
        { k: 'Hacienda Foral de Álava', t: 'Norma Foral 33/2013 consolidada', href: 'https://web.araba.eus/documents/d/araba/indice_norma-foral_irpf_cas-7-pdf', d: 'Texto consolidado publicado por la Hacienda alavesa.' },
        { k: 'Hacienda Foral de Álava', t: 'Normativa tributaria actual', href: 'https://web.araba.eus/es/normativa-tributaria-actual', d: 'Índice oficial de disposiciones vigentes.' },
      ].concat(F_EUSKADI),
      tramitacion: { estado: 'verificada', entidad: 'La prestación se solicita a la propia EPSV, conforme a sus estatutos y a su reglamento de prestaciones; la Hacienda Foral de Álava interviene a través de la retención y de la autoliquidación del IRPF, donde se ejercita, si procede, la opción por el régimen transitorio (art. 105.1.l de la NF 33/2013).', plazo: 'Con carácter general, el Reglamento de EPSV de Euskadi prevé el abono dentro de los cinco días hábiles siguientes a una solicitud completa. En sistemas de empleo se aplica el plazo previsto en estatutos o reglamento, con el límite del último día del mes siguiente.' },
    },
    {
      id: 'gipuzkoa', nombre: 'Gipuzkoa', etiqueta: 'Gipuzkoa · Hacienda Foral de Gipuzkoa', modelo: 'vasco', estado: 'verificada', ejercicio: EJERCICIO, consulta: CONSULTA,
      regimen: 'foral', hacienda: 'Hacienda Foral de Gipuzkoa', haciendaCorta: 'HFG', organismo: 'Diputación Foral de Gipuzkoa', siglas: 'DFG',
      irpf: 'IRPF de Gipuzkoa', norma: 'Norma Foral 3/2014 del IRPF de Gipuzkoa', normaCorta: 'NF 3/2014',
      caso: null,
      parametros: Object.assign({}, VASCO, { prevision: Object.assign({}, VASCO.prevision, { exencionRentaMax: .40 }) }),
      normativa: [
        ['Norma Foral 3/2014:', 'marco general del IRPF de Gipuzkoa (texto consolidado 2026).'],
        ['Norma Foral 1/2025:', 'reforma fiscal: EPSV al 70 % y rentabilidad al ahorro desde 2026; escala del ahorro; bonificación del trabajo.'],
        ['Norma Foral 6/2025:', 'Presupuestos 2026: escala general, minoración de 1.615 € y deducción por edad.'],
        ['Decreto Foral 22/2025:', 'desarrollo reglamentario de la previsión social (retención, reparto pre/post 2026).'],
      ],
      fuentes: [
        { k: 'BOG 31-12-2025', t: 'Norma Foral 6/2025 de Presupuestos 2026', href: 'https://egoitza.gipuzkoa.eus/gao-bog/castell/bog/2025/12/31/c2508886.htm', d: 'Escala general, minoración y deducción por edad con efectos 1-1-2026.' },
        { k: 'BOG 15-05-2025', t: 'Norma Foral 1/2025 de reforma fiscal', href: 'https://egoitza.gipuzkoa.eus/gao-bog/castell/bog/2025/05/15/c2503564.htm', d: 'Previsión social desde 2026, escala del ahorro, bonificación del trabajo y límites de aportación.' },
        { k: 'BOG 15-12-2025', t: 'Decreto Foral 22/2025', href: 'https://egoitza.gipuzkoa.eus/gao-bog/castell/bog/2025/12/15/c2508389.htm', d: 'Reglamento: retención de la prestación y reparto de los derechos anteriores a 2026.' },
        { k: 'Hacienda Foral de Gipuzkoa', t: 'Norma Foral 3/2014 · texto vigente 2026', href: 'https://www.gipuzkoa.eus/documents/2456431/8.0759126E7/NF%203-2014%20(2026-0).pdf/8ab5c95c-3f89-8fdf-5cb8-01950e3983cc', d: 'Texto consolidado publicado por la Hacienda guipuzcoana.' },
        { k: 'Hacienda Foral de Gipuzkoa', t: 'Normativa aprobada', href: 'https://www.gipuzkoa.eus/es/web/ogasuna/normativa/aprobada', d: 'Índice oficial de disposiciones vigentes.' },
      ].concat(F_EUSKADI),
      tramitacion: { estado: 'verificada', entidad: 'La prestación se solicita a la propia EPSV, conforme a sus estatutos y a su reglamento de prestaciones; la Hacienda Foral de Gipuzkoa interviene a través de la retención (art. 99.3 del Reglamento) y de la autoliquidación del IRPF (modelo 109), donde se ejercita, si procede, la opción por el régimen transitorio (art. 104.1.m de la NF 3/2014).', plazo: 'Con carácter general, el Reglamento de EPSV de Euskadi prevé el abono dentro de los cinco días hábiles siguientes a una solicitud completa. En sistemas de empleo se aplica el plazo previsto en estatutos o reglamento, con el límite del último día del mes siguiente.' },
    },
    {
      id: 'navarra', nombre: 'Navarra', etiqueta: 'Navarra · Hacienda Foral de Navarra', modelo: 'navarra', estado: 'verificada', ejercicio: EJERCICIO, consulta: CONSULTA,
      regimen: 'foral', hacienda: 'Hacienda Foral de Navarra', haciendaCorta: 'HFN', organismo: 'Gobierno de Navarra', siglas: 'HFN',
      irpf: 'IRPF de Navarra', norma: 'Texto Refundido de la Ley Foral del IRPF (Decreto Foral Legislativo 4/2008)', normaCorta: 'DFL 4/2008',
      caso: null,
      parametros: {
        escalaGeneral: ESCALA_GENERAL_NAVARRA,
        escalaAhorro: ESCALA_AHORRO_NAVARRA,
        /* Art. 62.5: deducción en cuota por rendimientos del trabajo. */
        trabajo: { tramos: [[12500, 1400, 0], [17500, 1400, .14], [35000, 700, 0], [50000, 700, .02], [Infinity, 400, 0]] },
        /* Art. 62.9.a): deducción en cuota por mínimo personal. */
        minimo: { base: 1084, edad65: 264, edad75: 585, rentas: { importe: 1280, umbral1: 17500, coef1: .0904, umbral2: 30000, importe2: 150, coef2: .075, umbral3: 32000 } },
        prevision: {
          figura: 'plan de pensiones', modelo: 'reduccion', corte: 2018, reduccion: .40, ventanaAnios: 2,
          rentaMinimaAnios: 15, crecimientoPre: 'proporcional',
          aportacion: { general: 1500, empleo: 8500, autonomos: 4250, porcentaje: .30, porcentajeMayores50: .50, conyuge: 1000 },
        },
      },
      normativa: [
        ['Decreto Foral Legislativo 4/2008:', 'Texto Refundido de la Ley Foral del IRPF (arts. 17.2, 54, 55, 59, 60, 62 y DT 25.ª).'],
        ['Ley Foral 17/2025:', 'modificación de impuestos con efectos 2026: deducción por trabajo (art. 62.5), mínimo personal (art. 62.9) y art. 68.'],
        ['Ley Foral 22/2023:', 'escala general vigente (sin deflactar en 2026).'],
        ['Ley Foral 36/2022:', 'escala del ahorro vigente desde 2023.'],
      ],
      fuentes: [
        { k: 'BOE · texto consolidado', t: 'Texto Refundido de la Ley Foral del IRPF (DFL 4/2008)', href: 'https://www.boe.es/buscar/act.php?id=BON-n-2008-90013&p=20260420&tn=1', d: 'Última actualización publicada el 20-04-2026; incorpora la Ley Foral 17/2025.' },
        { k: 'BOE 20-02-2026', t: 'Ley Foral 17/2025 de modificación de diversos impuestos', href: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-3910', d: 'Deducción por trabajo y mínimo personal con efectos 1-1-2026.' },
        { k: 'Hacienda Foral de Navarra', t: 'Manuales de Renta y Patrimonio', href: 'https://www.navarra.es/es/hacienda/renta-y-patrimonio/manuales', d: 'Manual teórico de la campaña 2025 (actualizado a 2-2-2026): reducciones del art. 17.2 y DT 25.ª.' },
        { k: 'Hacienda Foral de Navarra', t: 'Portal de Hacienda Foral de Navarra', href: 'https://hacienda.navarra.es', d: 'Sede y servicios de la Hacienda Foral.' },
        F_RD304,
      ],
      tramitacion: { estado: 'verificada', entidad: 'La prestación se solicita a la entidad gestora del plan de pensiones, conforme a sus especificaciones. La Hacienda Foral de Navarra no publica un impreso propio para el rescate: la reducción del 40 % de la DT 25.ª se aplica en la autoliquidación del IRPF.', plazo: PLAZO_RD304 },
    },
    {
      id: 'estatal', nombre: 'Estatal (territorio común)', corto: 'Estatal', etiqueta: 'Estatal · territorio común (AEAT)', modelo: 'comun', estado: 'verificada', ejercicio: EJERCICIO, consulta: CONSULTA,
      regimen: 'comun', hacienda: 'Agencia Tributaria (AEAT)', haciendaCorta: 'AEAT', organismo: 'Agencia Estatal de Administración Tributaria', siglas: 'AEAT',
      irpf: 'IRPF estatal (territorio común)', norma: 'Ley 35/2006 del IRPF', normaCorta: 'Ley 35/2006',
      caso: null,
      parametros: {
        escalaGeneral: ESCALA_GENERAL_ESTATAL,
        escalaAhorro: ESCALA_AHORRO_COMUN,
        gastos: 2000,
        /* Art. 20: reducción por obtención de rendimientos del trabajo. */
        reduccionTrabajo: { tope: 19747.5, otrasRentas: 6500, tramos: [[14852, 7302, 0], [17673.52, 7302, 1.75], [19747.5, 2364.34, 1.14]] },
        /* Art. 57: mínimo del contribuyente. */
        minimo: { base: 5550, edad65: 1150, edad75: 1400 },
        prevision: {
          figura: 'plan de pensiones', modelo: 'reduccion', corte: 2007, reduccion: .40, ventanaAnios: 2,
          rentaMinimaAnios: 15, crecimientoPre: 'proporcional',
          aportacion: { general: 1500, empleo: 8500, autonomos: 4250, porcentaje: .30, conyuge: 1000 },
        },
      },
      normativa: [
        ['Ley 35/2006:', 'Ley del IRPF (arts. 17.2, 19.2.f, 20, 46, 52, 56, 57, 63, 65, 66, 74, 76; DA 32.ª y DT 12.ª).'],
        ['Ley 22/2009:', 'sistema de financiación: las comunidades aprueban su propia escala autonómica (art. 46).'],
        ['Real Decreto 439/2007:', 'Reglamento del IRPF.'],
        ['Real Decreto Legislativo 3/2004 (art. 17.2.b):', 'reducción del 40 % que conserva la DT 12.ª para aportaciones anteriores a 2007.'],
      ],
      fuentes: [
        { k: 'BOE · texto consolidado', t: 'Ley 35/2006 del IRPF', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&tn=1&p=20260930', d: 'Última actualización publicada el 30-09-2026.' },
        { k: 'BOE · texto consolidado', t: 'Ley 22/2009 de financiación de las comunidades autónomas', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2009-20375&tn=1', d: 'Art. 46: competencia autonómica sobre la escala general; sin escala supletoria.' },
        { k: 'BOE · texto consolidado', t: 'Real Decreto 439/2007, Reglamento del IRPF', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&tn=1', d: 'Desarrollo reglamentario.' },
        { k: 'AEAT · Manual Renta 2025', t: 'Régimen transitorio de las prestaciones en capital', href: 'https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c03-rendimientos-trabajo/rendimiento-neto-trabajo-integrar-base-imponible/fase-1-determinacion-rendimiento-integro-trabajo/reducciones-aplicables-sobre-determinados-rendimientos-integros/c-regimen-transitorio-reducciones-aplicable-prestaciones/prestaciones-percibidas-forma-capital-derivadas.html', d: 'Condiciones del 40 % para aportaciones anteriores a 2007.' },
        { k: 'AEAT', t: 'Manual práctico Renta 2025', href: 'https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025.html', d: 'Último manual publicado (la Renta 2026 se declara en 2027).' },
        F_RD304,
      ],
      tramitacion: { estado: 'verificada', entidad: 'La prestación se solicita a la entidad gestora del plan de pensiones, conforme a sus especificaciones. La Agencia Tributaria no publica un impreso propio para el rescate: la reducción del 40 % de la DT 12.ª se aplica en la declaración del IRPF.', plazo: PLAZO_RD304 },
    },
  ];

  /* ------------------------------------------- Comunidades autónomas ------ */
  /* Fase 1: solo la escala de referencia calculaba. Fase 2 (05-10-2026): las
     15 comunidades quedan verificadas, cada una con su escala autonómica 2026
     ([desde, tipo], cuotas acumuladas comprobadas contra la tabla publicada),
     su fuente (texto consolidado en el BOE) y, si la tiene, su mínimo del
     contribuyente propio (minimoAutonomico: importes del art. 57 que la
     comunidad sustituye; solo afecta a la parte autonómica). Una comunidad
     'en-preparacion' no calcula. Ceuta y Melilla quedan FUERA del alcance por decisión
     del fundador (04-10-2026): su escala autonómica es la del art. 65 (DA
     32.ª), pero la deducción del 60 % por rentas obtenidas allí (art. 68.4)
     no está modelada, así que no se ofrecen en el selector. */
  const CCAA = [
    { id: 'referencia', nombre: 'Escala de referencia (art. 65 LIRPF)', corto: 'Escala de referencia', estado: 'verificada', referencia: true,
      descripcion: 'Escala del art. 65 de la Ley 35/2006, la que la ley aplica a los residentes en el extranjero y, por la DA 32.ª, a Ceuta y Melilla. No es la escala de ninguna comunidad autónoma: sirve solo como referencia.',
      escalaAutonomica: ESCALA_ART65,
      fuente: { k: 'BOE · Ley 35/2006', t: 'Art. 65 y DA 32.ª', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&tn=1&p=20260930#a65', consulta: CONSULTA } },
    { id: 'andalucia', nombre: 'Andalucía', de: 'de Andalucía', estado: 'verificada',
      nota: 'Escala autonómica de Andalucía para 2026 (Ley 5/2021, art. 23) y mínimo del contribuyente propio (art. 23 bis), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .095], [13000, .12], [21100, .15], [35200, .185], [60000, .225]],
      minimoAutonomico: { base: 5790, edad65: 1200, edad75: 1460 },
      fuente: { k: 'BOE · texto consolidado', t: 'Ley 5/2021 de Tributos Cedidos de Andalucía', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2021-17915&tn=1', d: 'Art. 23 (escala, redacción del Decreto-ley 7/2022) y art. 23 bis (mínimo personal y familiar); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'aragon', nombre: 'Aragón', de: 'de Aragón', estado: 'verificada',
      nota: 'Escala autonómica de Aragón para 2026 (Decreto Legislativo 1/2005, art. 110-1). Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .095], [13072.5, .12], [21210, .15], [36960, .185], [52500, .205], [60000, .23], [80000, .24], [90000, .25], [130000, .255]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2005, texto refundido de tributos cedidos de Aragón', href: 'https://www.boe.es/buscar/act.php?id=BOA-d-2005-90006&tn=1', d: 'Art. 110-1 (escala, redacción de la Ley 17/2023); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'asturias', nombre: 'Principado de Asturias', de: 'del Principado de Asturias', estado: 'verificada',
      nota: 'Escala autonómica del Principado de Asturias para 2026 (Decreto Legislativo 2/2014, art. 2) y mínimo del contribuyente propio (art. 2 bis), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .09], [12450, .12], [17707.2, .14], [33007.2, .192], [53407.2, .215], [70000, .225], [90000, .25], [175000, .26]],
      minimoAutonomico: { base: 6105, edad65: 1265, edad75: 1540 },
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 2/2014, texto refundido de tributos cedidos del Principado de Asturias', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&tn=1', d: 'Art. 2 (escala) y art. 2 bis (mínimo del contribuyente), redacción de la Ley 3/2025; contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'baleares', nombre: 'Illes Balears', de: 'de las Illes Balears', estado: 'verificada',
      nota: 'Escala autonómica de las Illes Balears para 2026 (Decreto Legislativo 1/2014, art. 1) y mínimo del contribuyente mayor de 65 y de 75 años incrementado un 10 % (art. 2), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .09], [10000, .1125], [18000, .1425], [30000, .175], [48000, .19], [70000, .2175], [90000, .2275], [120000, .2375], [175000, .2475]],
      /* Art. 2: +10 % al mínimo del contribuyente mayor de 65 y de 75 años. Lectura
         de la AEAT (Manual Renta 2025; decisión del fundador de 05-10-2026): 5.550 €
         con carácter general; desde 65, 6.105 + 1.265 = 7.370 € (incremento 1.820 €);
         desde 75, 1.540 € más (8.910 €). */
      minimoAutonomico: { base: 5550, edad65: 1820, edad75: 1540 },
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2014, texto refundido de tributos cedidos de las Illes Balears', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&tn=1', d: 'Art. 1 (escala, redacción de la Ley 12/2023) y art. 2 (incremento del mínimo); importes del mínimo según el Manual práctico de Renta 2025 de la AEAT; contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'canarias', nombre: 'Canarias', de: 'de Canarias', estado: 'verificada',
      nota: 'Escala autonómica de Canarias para 2026 (Decreto Legislativo 1/2009, art. 18 bis) y mínimo del contribuyente propio (art. 18 quater), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .09], [13748, .115], [19422, .14], [35924, .185], [57566, .235], [93268, .25], [123745, .26]],
      minimoAutonomico: { base: 5606, edad65: 1162, edad75: 1414 },
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2009, texto refundido de tributos cedidos de Canarias', href: 'https://www.boe.es/buscar/act.php?id=BOC-j-2009-90008&tn=1', d: 'Art. 18 bis (escala, redacción de la Ley 9/2025) y art. 18 quater (mínimo del contribuyente); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'cantabria', nombre: 'Cantabria', de: 'de Cantabria', estado: 'verificada',
      nota: 'Escala autonómica de Cantabria para 2026 (Decreto Legislativo 62/2008, art. 1). Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .085], [13000, .11], [21000, .145], [35200, .18], [60000, .225], [90000, .245]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 62/2008, texto refundido de tributos cedidos de Cantabria', href: 'https://www.boe.es/buscar/act.php?id=BOCT-c-2008-90028&tn=1', d: 'Art. 1 (escala, redacción de la Ley 3/2023); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'castilla-la-mancha', nombre: 'Castilla-La Mancha', de: 'de Castilla-La Mancha', estado: 'verificada',
      nota: 'Escala autonómica de Castilla-La Mancha para 2026 (Ley 8/2013, art. 13 bis), con los mismos tramos y tipos que la del art. 65 LIRPF. Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .095], [12450, .12], [20200, .15], [35200, .185], [60000, .225]],
      fuente: { k: 'BOE · texto consolidado', t: 'Ley 8/2013 de Medidas Tributarias de Castilla-La Mancha', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2014-1368&tn=1', d: 'Art. 13 bis (escala, introducido por la Ley 9/2014); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'castilla-y-leon', nombre: 'Castilla y León', de: 'de Castilla y León', estado: 'verificada',
      nota: 'Escala autonómica de Castilla y León para 2026 (Decreto Legislativo 1/2013, art. 1). Su mínimo del contribuyente (art. 1 bis) coincide con el estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .09], [12450, .12], [20200, .14], [35200, .185], [53407.2, .215]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2013, texto refundido de tributos cedidos de Castilla y León', href: 'https://www.boe.es/buscar/act.php?id=BOCL-h-2013-90254&tn=1', d: 'Art. 1 (escala, redacción de la Ley 2/2022) y art. 1 bis (mínimos iguales a los estatales); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'cataluna', nombre: 'Cataluña', de: 'de Cataluña', estado: 'verificada',
      nota: 'Escala autonómica de Cataluña para 2026 (libro sexto del Código tributario, art. 611-1). Su mínimo del contribuyente (art. 611-2, 5.550 €) coincide con el estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .095], [12500, .125], [22000, .16], [33000, .19], [53000, .215], [90000, .235], [120000, .245], [175000, .255]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2024, libro sexto del Código tributario de Cataluña', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-6951&tn=1', d: 'Art. 611-1 (escala, redacción del Decreto-ley 5/2025) y art. 611-2 (mínimo del contribuyente); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'valenciana', nombre: 'Comunitat Valenciana', de: 'de la Comunitat Valenciana', estado: 'verificada',
      nota: 'Escala autonómica de la Comunitat Valenciana para 2026 (Ley 13/1997, art. 2, en la redacción de la Ley 5/2026) y mínimo del contribuyente propio (art. 2 bis), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      /* Ley 5/2026, art. 18: escala con efectos desde el 1-1-2026. Su DT 3.ª fija otra
         escala desde el 1-1-2027; el simulador mantiene fijas las reglas de 2026. */
      escalaAutonomica: [[0, .088], [12000, .117], [22000, .146], [32000, .17], [42000, .194], [52000, .219], [62000, .244], [72000, .261], [100000, .2735], [150000, .2835], [200000, .2935]],
      minimoAutonomico: { base: 6105, edad65: 1265, edad75: 1540 },
      fuente: { k: 'BOE · texto consolidado', t: 'Ley 13/1997 del tramo autonómico del IRPF de la Comunitat Valenciana', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&tn=1', d: 'Art. 2 (escala, redacción de la Ley 5/2026 con efectos desde el 1-1-2026) y art. 2 bis (mínimo personal y familiar); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'extremadura', nombre: 'Extremadura', de: 'de Extremadura', estado: 'verificada',
      nota: 'Escala autonómica de Extremadura para 2026 (Decreto Legislativo 1/2018, art. 1, en la redacción de la Ley 2/2026). Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .0775], [12450, .0975], [20200, .16], [24200, .175], [35200, .21], [60000, .235], [80200, .24], [99200, .245], [120200, .25]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2018, texto refundido de tributos cedidos de Extremadura', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-8159&tn=1', d: 'Art. 1 (escala, redacción de la Ley 2/2026 con efectos desde el 1-1-2026); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'galicia', nombre: 'Galicia', de: 'de Galicia', estado: 'verificada',
      nota: 'Escala autonómica de Galicia para 2026 (Decreto Legislativo 1/2011, art. 4) y mínimo del contribuyente propio (art. 4 bis), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .09], [12985.35, .1165], [21068.6, .149], [35200, .184], [60000, .225]],
      minimoAutonomico: { base: 5789, edad65: 1199, edad75: 1460 },
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2011, texto refundido de tributos cedidos de Galicia', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2011-18161&tn=1', d: 'Art. 4 (escala, redacción de la Ley 7/2022) y art. 4 bis (mínimo personal y familiar); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'madrid', nombre: 'Comunidad de Madrid', de: 'de la Comunidad de Madrid', estado: 'verificada',
      nota: 'Escala autonómica de la Comunidad de Madrid para 2026 (Decreto Legislativo 1/2010, art. 1) y mínimo del contribuyente propio (art. 2), que se aplica solo en la parte autonómica. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .085], [13362.22, .107], [19004.63, .128], [35425.68, .174], [57320.4, .205]],
      minimoAutonomico: { base: 5956.65, edad65: 1234.26, edad75: 1502.58 },
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2010, texto refundido de tributos cedidos de la Comunidad de Madrid', href: 'https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&tn=1', d: 'Art. 1 (escala) y art. 2 (mínimo del contribuyente), redacción de la Ley 13/2023; contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'murcia', nombre: 'Región de Murcia', de: 'de la Región de Murcia', estado: 'verificada',
      nota: 'Escala autonómica de la Región de Murcia para 2026 (Decreto Legislativo 1/2010, art. 2). Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      escalaAutonomica: [[0, .095], [12450, .112], [20200, .133], [34000, .179], [60000, .225]],
      fuente: { k: 'BOE · texto consolidado', t: 'Decreto Legislativo 1/2010, texto refundido de tributos cedidos de la Región de Murcia', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2011-10542&tn=1', d: 'Art. 2 (escala, redacción de la Ley 14/2018); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
    { id: 'rioja', nombre: 'La Rioja', de: 'de La Rioja', estado: 'verificada',
      nota: 'Escala autonómica de La Rioja para 2026 (Ley 10/2017, art. 31). Mínimo del contribuyente estatal. No incluye deducciones autonómicas.',
      /* Art. 31 ter: deflactación si el IPC de La Rioja de diciembre supera el 3 %;
         diciembre de 2025 fue el 2,6 % (INE), así que no opera en 2026. */
      escalaAutonomica: [[0, .08], [12450, .106], [20200, .136], [35200, .178], [40000, .183], [50000, .19], [60000, .245], [120000, .27]],
      fuente: { k: 'BOE · texto consolidado', t: 'Ley 10/2017 de tributos propios y cedidos de La Rioja', href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2017-13750&tn=1', d: 'Art. 31 (escala, redacción de la Ley 13/2023); contrastada con «Tributación Autonómica. Medidas 2026» del Ministerio de Hacienda (actualizado a 23-09-2026).', consulta: CONSULTA_CCAA } },
  ];
  /* Territorios de régimen común que quedan fuera del simulador (no aparecen
     en el selector). Se declaran en los límites visibles. */
  const FUERA_DE_ALCANCE = [
    { id: 'ceuta', nombre: 'Ceuta', motivo: 'Deducción del 60 % por rentas obtenidas en Ceuta (art. 68.4 LIRPF) no modelada.' },
    { id: 'melilla', nombre: 'Melilla', motivo: 'Deducción del 60 % por rentas obtenidas en Melilla (art. 68.4 LIRPF) no modelada.' },
  ];

  const TERRITORIO_DEFECTO = 'bizkaia';
  const CCAA_DEFECTO = 'referencia';

  const territorio = (id) => TERRITORIOS.find((t) => t.id === id) || null;
  /* «de la Comunidad de Madrid», «del Principado de Asturias»…: forma con
     artículo para los textos (campo de, o «de» + nombre si no lo hay). */
  const deComunidad = (c) => (c && c.de) || 'de ' + (c ? c.nombre : 'la comunidad elegida');
  const comunidad = (id) => CCAA.find((c) => c.id === id) || null;

  /* Configuración efectiva para el motor. Devuelve null si el territorio no
     existe; si existe pero no está verificado (o su comunidad no lo está),
     devuelve estado 'en-preparacion' y el motor no calcula. */
  function configuracion(idTerritorio, idCcaa) {
    const t = territorio(idTerritorio); if (!t) return null;
    const cfg = Object.assign({}, t, { ccaa: null, escalaAutonomica: null, minimoAutonomico: null });
    if (t.modelo === 'comun') {
      const c = comunidad(idCcaa || CCAA_DEFECTO);
      if (!c) return Object.assign(cfg, { estado: 'desconocida', ccaa: { id: idCcaa, nombre: 'Comunidad no reconocida', estado: 'desconocida' } });
      cfg.ccaa = c;
      cfg.escalaAutonomica = c.escalaAutonomica || null;
      cfg.minimoAutonomico = c.minimoAutonomico || null;
      if (c.estado !== 'verificada' || !cfg.escalaAutonomica) cfg.estado = 'en-preparacion';
      /* La ley de la comunidad encabeza las fuentes (decisión del fundador de
         05-10-2026), para que el simulador, las guías y el informe la citen. */
      else if (!c.referencia && c.fuente) cfg.fuentes = [{ k: c.fuente.k, t: c.fuente.t, href: c.fuente.href, d: (c.fuente.d ? c.fuente.d + ' ' : '') + 'Consultada el ' + c.fuente.consulta + '.', consulta: c.fuente.consulta }].concat(t.fuentes);
    }
    return cfg;
  }
  const disponible = (cfg) => !!cfg && cfg.estado === 'verificada';

  /* Fecha de consulta de las fuentes para los textos («fuentes consultadas
     …»). Si la ley de la comunidad se consultó otro día, se da su fecha. */
  function consultaFuentes(cfg) {
    if (!cfg) return '';
    const c = cfg.ccaa, fc = c && !c.referencia && c.estado === 'verificada' && c.fuente ? c.fuente.consulta : null;
    return 'el ' + cfg.consulta + (fc && fc !== cfg.consulta ? '; la ley autonómica ' + deComunidad(c) + ', el ' + fc : '');
  }

  /* Nombre completo para rótulos: «Bizkaia», «Estatal · Escala de referencia». */
  function nombreCompleto(cfg) {
    if (!cfg) return 'Territorio sin elegir';
    if (cfg.modelo === 'comun') return (cfg.corto || cfg.nombre) + (cfg.ccaa ? ' · ' + (cfg.ccaa.corto || cfg.ccaa.nombre) : '');
    return cfg.nombre;
  }

  /* ---------------------------------------------- Piezas del modelo vasco -- */
  function bonificacionTrabajo(P, trabajo, otrasRentas) {
    const b = P.bonificacion; const t = pos(trabajo);
    let importe;
    if (pos(otrasRentas) > b.otrasRentas) importe = b.minima;
    else if (t <= b.umbral1) importe = b.maxima;
    else if (t <= b.umbral2) importe = b.maxima - b.coeficiente * (t - b.umbral1);
    else importe = b.minima;
    return Math.min(t, Math.max(0, importe));
  }

  /* Edad: la que se tiene cumplida a 31 de diciembre (fecha de devengo). La
     deducción se aplica ya en el año en que se cumplen 65 (y la mayor, 75);
     criterio de las Haciendas forales (p. ej. FAQ 900006436 de la HFB). */
  function deduccionEdad(P, edad, baseTotal) {
    const e = P.edad; const b = pos(baseTotal);
    if (num(edad) < e.desde || b >= e.base2) return 0;
    const completa = num(edad) >= e.mayor ? e.importeMayor : e.importe;
    if (b <= e.base1) return completa;
    return Math.max(0, completa - completa * (b - e.base1) / (e.base2 - e.base1));
  }

  function irpfVasco(P, { trabajo, ahorro, edad, otrasDeducciones }) {
    const t = pos(trabajo), a = pos(ahorro);
    const bonificacion = bonificacionTrabajo(P, t, a);
    const baseGeneral = Math.max(0, t - bonificacion);
    const g = escala(baseGeneral, P.escalaGeneral);
    const minoracion = Math.min(g.cuota, P.minoracion);
    const cuotaGeneral = g.cuota - minoracion;
    const s = escala(a, P.escalaAhorro);
    const cuotaAhorro = s.cuota;
    const edadDed = deduccionEdad(P, edad, baseGeneral + a);
    const bruta = cuotaGeneral + cuotaAhorro;
    const deducciones = Math.min(bruta, edadDed + pos(otrasDeducciones));
    const total = bruta - deducciones;
    return {
      trabajo: t, ahorro: a, bonificacion, baseGeneral, cuotaGeneralBruta: g.cuota, minoracion, cuotaGeneral,
      cuotaAhorro, deduccionEdad: edadDed, otrasDeducciones: pos(otrasDeducciones), deducciones, total,
      marginalGeneral: baseGeneral > 0 ? g.marginal : 0, marginalAhorro: a > 0 ? s.marginal : 0,
      efectivo: t + a > 0 ? total / (t + a) : 0,
      desglose: {
        general: [
          { clave: 'bonificacion', etiqueta: 'Bonificación del trabajo', importe: bonificacion, signo: '-' },
          { clave: 'escala', etiqueta: 'Impuesto según escala', importe: g.cuota, sub: true },
          { clave: 'minoracion', etiqueta: 'Minoración de cuota', importe: minoracion, signo: '-' },
        ],
        ahorro: [],
        cuota: [{ clave: 'edad', etiqueta: 'Deducción por edad', importe: edadDed }, { clave: 'otras', etiqueta: 'Otras deducciones', importe: pos(otrasDeducciones) }],
      },
    };
  }

  /* -------------------------------------------- Piezas del modelo navarra -- */
  function deduccionTrabajoNavarra(P, rnt) {
    const x = pos(rnt); let importe = 0, prev = 0;
    for (const [hasta, base, coef] of P.trabajo.tramos) { if (x <= hasta) { importe = base - coef * (x - prev); break; } prev = hasta; }
    return Math.max(0, importe);
  }

  function minimoPersonalNavarra(P, edad, rentas) {
    const m = P.minimo; const r = pos(rentas); const e = num(edad);
    let importe = m.base + (e >= 75 ? m.edad75 : e >= 65 ? m.edad65 : 0);
    const R = m.rentas;
    if (r <= R.umbral1) importe += R.importe;
    else if (r <= R.umbral2) importe += Math.max(0, R.importe - R.coef1 * (r - R.umbral1));
    else if (r <= R.umbral3) importe += Math.max(0, R.importe2 - R.coef2 * (r - R.umbral2));
    return importe;
  }

  /* trabajo = rendimiento ya reducido (p. ej. con el 40 % de la DT 25.ª);
     trabajoBruto = íntegro sin integración parcial, que es el que fija los
     tramos de la deducción por trabajo (art. 62.5) y las «rentas» del mínimo
     personal (art. 64.5). */
  function irpfNavarra(P, { trabajo, ahorro, edad, otrasDeducciones, trabajoBruto }) {
    const t = pos(trabajo), a = pos(ahorro); const tb = Math.max(t, pos(trabajoBruto));
    const g = escala(t, P.escalaGeneral), s = escala(a, P.escalaAhorro);
    const integra = g.cuota + s.cuota;
    const dedTrabajo = t > 0 ? Math.min(deduccionTrabajoNavarra(P, tb), g.cuota) : 0;
    const minimo = minimoPersonalNavarra(P, edad, tb + a);
    const deducciones = Math.min(integra, dedTrabajo + minimo + pos(otrasDeducciones));
    const total = integra - deducciones;
    return {
      trabajo: t, ahorro: a, bonificacion: 0, baseGeneral: t, cuotaGeneralBruta: g.cuota, minoracion: 0, cuotaGeneral: g.cuota,
      cuotaAhorro: s.cuota, deduccionEdad: 0, deduccionTrabajo: dedTrabajo, minimoPersonal: minimo, otrasDeducciones: pos(otrasDeducciones), deducciones, total,
      marginalGeneral: t > 0 ? g.marginal : 0, marginalAhorro: a > 0 ? s.marginal : 0,
      efectivo: t + a > 0 ? total / (t + a) : 0,
      desglose: {
        general: [{ clave: 'escala', etiqueta: 'Impuesto según escala', importe: g.cuota, sub: true }],
        ahorro: [],
        cuota: [
          { clave: 'trabajo', etiqueta: 'Deducción por trabajo', importe: dedTrabajo },
          { clave: 'minimo', etiqueta: 'Mínimo personal' + (num(edad) >= 65 ? ' (con incremento por edad)' : ''), importe: minimo },
          { clave: 'otras', etiqueta: 'Otras deducciones', importe: pos(otrasDeducciones) },
        ],
      },
    };
  }

  /* ---------------------------------------------- Piezas del modelo común -- */
  function reduccionTrabajoComun(P, rn, otrasRentas) {
    const R = P.reduccionTrabajo; const x = pos(rn);
    if (pos(otrasRentas) > R.otrasRentas || x >= R.tope) return 0;
    let prev = 0, importe = 0;
    for (const [hasta, base, coef] of R.tramos) { if (x <= hasta) { importe = base - coef * (x - prev); break; } prev = hasta; }
    return Math.max(0, importe);
  }

  /* Edad cumplida a 31 de diciembre (fecha de devengo): el aumento se aplica
     ya en el año en que se cumplen 65 y 75 (Manual de Renta de la AEAT). */
  function minimoPersonalComun(P, edad) {
    const m = P.minimo; const e = num(edad);
    return m.base + (e >= 65 ? m.edad65 : 0) + (e >= 75 ? m.edad75 : 0);
  }

  /* cfg.escalaAutonomica es la escala de la comunidad (o la de referencia).
     minimoAutonomico (opcional) son los importes del mínimo del contribuyente
     que fija la comunidad (art. 56.3 LIRPF): se usan solo en la parte
     autonómica. El mínimo se reparte primero en la base general y el resto en
     la del ahorro (art. 56.2), por separado para cada parte. En el ahorro, la
     escala estatal (art. 66) y la autonómica (art. 76) son idénticas, cada una
     la mitad de ESCALA_AHORRO_COMUN: por eso el mínimo a escala del ahorro es
     la media de aplicar la escala conjunta al resto estatal y al autonómico.
     Sin mínimo propio, ambos restos coinciden y el resultado es el de antes. */
  function irpfComun(P, escalaAutonomica, { trabajo, ahorro, edad, otrasDeducciones }, minimoAutonomico) {
    const t = pos(trabajo), a = pos(ahorro);
    const gastos = Math.min(t, P.gastos);
    const rn = t - gastos;
    const reduccion = Math.min(rn, reduccionTrabajoComun(P, rn, a));
    const baseGeneral = Math.max(0, rn - reduccion);
    const minimo = minimoPersonalComun(P, edad);
    const minimoA = minimoAutonomico ? minimoPersonalComun({ minimo: minimoAutonomico }, edad) : minimo;
    const minGen = Math.min(minimo, baseGeneral), minAho = Math.min(a, minimo - minGen);
    const minGenA = Math.min(minimoA, baseGeneral), minAhoA = Math.min(a, minimoA - minGenA);
    const gE = escala(baseGeneral, P.escalaGeneral), gA = escala(baseGeneral, escalaAutonomica);
    const cuotaGeneralBruta = gE.cuota + gA.cuota;
    const minimoEscala = escala(minGen, P.escalaGeneral).cuota + escala(minGenA, escalaAutonomica).cuota;
    const cuotaGeneral = Math.max(0, cuotaGeneralBruta - minimoEscala);
    const s = escala(a, P.escalaAhorro);
    const minimoAhorro = (escala(minAho, P.escalaAhorro).cuota + escala(minAhoA, P.escalaAhorro).cuota) / 2;
    const cuotaAhorro = Math.max(0, s.cuota - minimoAhorro);
    const bruta = cuotaGeneral + cuotaAhorro;
    const deducciones = Math.min(bruta, pos(otrasDeducciones));
    const total = bruta - deducciones;
    return {
      trabajo: t, ahorro: a, bonificacion: 0, gastos, reduccionTrabajo: reduccion, baseGeneral, cuotaGeneralBruta, minoracion: 0, cuotaGeneral,
      cuotaAhorro, cuotaAhorroBruta: s.cuota, minimoPersonal: minimo, minimoAutonomico: minimoA, minimoEscala, minimoAhorro, deduccionEdad: 0, otrasDeducciones: pos(otrasDeducciones), deducciones, total,
      marginalGeneral: baseGeneral > 0 ? gE.marginal + gA.marginal : 0, marginalAhorro: a > 0 ? s.marginal : 0,
      efectivo: t + a > 0 ? total / (t + a) : 0,
      desglose: {
        general: [
          { clave: 'gastos', etiqueta: 'Gastos deducibles (art. 19.2.f)', importe: gastos, signo: '-' },
          { clave: 'reduccion', etiqueta: 'Reducción por rendimientos del trabajo', importe: reduccion, signo: '-' },
          { clave: 'escala', etiqueta: 'Impuesto según escala estatal + autonómica', importe: cuotaGeneralBruta, sub: true },
          { clave: 'minimo', etiqueta: 'Mínimo personal a escala (' + (minimoA !== minimo ? 'estatal ' + eurN(minimo) + ' · autonómico ' + eurD(minimoA) : eurN(minimo)) + ')', importe: minimoEscala, signo: '-' },
        ],
        ahorro: minimoAhorro > .5 ? [{ clave: 'minimo-ahorro', etiqueta: 'Resto del mínimo personal a escala', importe: minimoAhorro, signo: '-' }] : [],
        cuota: [{ clave: 'otras', etiqueta: 'Otras deducciones', importe: pos(otrasDeducciones) }],
      },
    };
  }

  /* --------------------------------------------------------- IRPF anual --- */
  function irpf(cfg, rentas) {
    const P = cfg.parametros;
    if (cfg.modelo === 'vasco') return irpfVasco(P, rentas);
    if (cfg.modelo === 'navarra') return irpfNavarra(P, rentas);
    return irpfComun(P, cfg.escalaAutonomica, rentas, cfg.minimoAutonomico);
  }

  /* ------------------------------------------ Previsión social: la renta -- */
  /* Reparte un cobro periódico (pago) en trabajo / ahorro / exento. ratio es
     la parte del cobro que es rentabilidad; exenta, si la renta cumple los
     requisitos de exención (vitalicia o ≥ 15 años constante). */
  function rentaPeriodica(cfg, pago, ratio, exenta) {
    const p = pos(pago); const pv = cfg.parametros.prevision;
    if (pv.modelo !== 'vasco') return { trabajo: p, ahorro: 0, exento: 0, rentabilidad: 0 };
    const rent = p * Math.max(0, Math.min(1, num(ratio)));
    let exento = 0;
    if (exenta) exento = pv.exencionRentaMax ? Math.min(rent, pv.exencionRentaMax * p) : rent;
    return { trabajo: p - rent, ahorro: rent - exento, exento, rentabilidad: rent };
  }

  /* --------------------------------------- Previsión social: el capital --- */
  /* Modelo vasco: bases del cobro en capital según el caso práctico de la DFB.
     ep = saldos a la jubilación {pre, post, preRent, postRent, ratio}. */
  function basesCapitalVasco(pv, o, regimen, ep, pct) {
    const pre = ep.pre * pct, post = ep.post * pct, bruto = pre + post;
    const exentoDosAnios = o.contingencia === 'invalidez' || o.contingencia === 'dependencia';
    const conReduccion = o.primerCobro && (o.dosAnios || exentoDosAnios);
    let limite = pv.limite, general = 0, ahorro = 0;
    const integrar = (importe, tipo) => {
      const x = pos(importe); if (!conReduccion) return x;
      const red = Math.min(x, limite); limite -= red; return red * tipo + (x - red);
    };
    const certificado = o.epsvDesglose === 'certificado';
    const rPre = certificado ? (ep.pre ? ep.preRent / ep.pre : 0) : ep.ratio;
    const rPost = certificado ? (ep.post ? ep.postRent / ep.post : 0) : ep.ratio;
    let detalle;
    if (regimen === 'transitorio') {
      /* Caso práctico DFB 2026: prestación × aportaciones previas / aportaciones totales. */
      const apPre = ep.pre - ep.preRent, apPost = ep.post - ep.postRent;
      const cuotaPre = certificado && apPre + apPost > 0 ? apPre / (apPre + apPost) : (ep.pre + ep.post ? ep.pre / (ep.pre + ep.post) : 0);
      const tramoPre = bruto * cuotaPre, tramoPost = bruto - tramoPre;
      const rentPost = Math.min(tramoPost, post * rPost), apTramoPost = tramoPost - rentPost;
      general += integrar(tramoPre, pv.capitalTransitorio);
      ahorro += rentPost;
      general += integrar(apTramoPost, pv.capital);
      detalle = { tramoPre, tramoPost, rentabilidad: rentPost, aportacion: apTramoPost };
    } else {
      const rent = pre * rPre + post * rPost, aport = Math.max(0, bruto - rent);
      ahorro = rent; general = integrar(aport, pv.capital);
      detalle = { rentabilidad: rent, aportacion: aport };
    }
    return { regimen, bruto, general, ahorro, conReduccion, detalle };
  }

  /* Modelos con reducción del 40 % (Navarra DT 25.ª: aportaciones hasta 2017;
     estatal DT 12.ª: aportaciones hasta 2006). ep.pre = derechos que derivan
     de esas aportaciones antiguas; ep.post = el resto. */
  function basesCapitalReduccion(pv, o, ep, pct) {
    const pre = ep.pre * pct, post = ep.post * pct, bruto = pre + post;
    const conReduccion = o.primerCobro && (o.dosAnios || o.contingencia === 'invalidez');
    const reduccion = conReduccion ? pre * pv.reduccion : 0;
    return { regimen: 'reduccion', bruto, general: bruto - reduccion, ahorro: 0, conReduccion, detalle: { antiguo: pre, reciente: post, reduccion } };
  }

  /* Opciones de cálculo del capital para un territorio: una por régimen que
     el contribuyente pueda elegir. El motor calcula el impuesto de cada una. */
  function opcionesCapital(cfg, o, ep, pct) {
    const pv = cfg.parametros.prevision;
    if (pv.modelo === 'vasco') return [
      { clave: 'transitorio', titulo: 'Régimen transitorio', sub: 'Lo aportado hasta ' + (pv.corte - 1) + ' integra el ' + Math.round(pv.capitalTransitorio * 100) + ' %; lo posterior, aportación al ' + Math.round(pv.capital * 100) + ' % y rentabilidad aparte.', bases: basesCapitalVasco(pv, o, 'transitorio', ep, pct) },
      { clave: 'nuevo', titulo: 'Régimen desde ' + pv.corte, sub: 'Aportaciones al ' + Math.round(pv.capital * 100) + ' % en la base general; toda la rentabilidad en la base del ahorro.', bases: basesCapitalVasco(pv, o, 'nuevo', ep, pct) },
    ];
    return [{ clave: 'reduccion', titulo: 'Rendimiento del trabajo con la reducción transitoria', sub: 'Todo el cobro es rendimiento del trabajo; la parte que deriva de aportaciones anteriores a ' + pv.corte + ' se reduce un ' + Math.round(pv.reduccion * 100) + ' % si se cumplen las condiciones.', bases: basesCapitalReduccion(pv, o, ep, pct) }];
  }

  /* Estimación reglada de la rentabilidad cuando no hay certificado (vasco). */
  function ratioEstimado(cfg, antiguedadConocida, antiguedad) {
    const pv = cfg.parametros.prevision;
    if (pv.modelo !== 'vasco') return 0;
    if (antiguedadConocida) return Math.min(pos(antiguedad) * pv.estimacionAnual, pv.estimacionMaxima);
    return pv.estimacionSinAntiguedad;
  }

  /* ----------------------------------------------------- Textos de apoyo -- */
  const pct = (x, d = 0) => (Math.round(x * 100 * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',') + ' %';
  const decimales = (tipo) => (Math.round(tipo * 1000) % 10 ? 1 : 0);
  const rangoEscala = (esc) => 'del ' + pct(esc[0][1], decimales(esc[0][1])) + ' al ' + pct(esc[esc.length - 1][1], decimales(esc[esc.length - 1][1]));

  /* Escala general «conjunta» que ve el usuario (en el estatal, suma de la
     estatal y la autonómica tramo a tramo). */
  function escalaGeneralVisible(cfg) {
    const P = cfg.parametros;
    if (cfg.modelo !== 'comun' || !cfg.escalaAutonomica) return P.escalaGeneral;
    const cortes = [...new Set(P.escalaGeneral.concat(cfg.escalaAutonomica).map((x) => x[0]))].sort((a, b) => a - b);
    const tipoEn = (esc, x) => { let t = esc[0][1]; for (const [d, tipo] of esc) if (x >= d) t = tipo; return t; };
    return cortes.map((c) => [c, Math.round((tipoEn(P.escalaGeneral, c) + tipoEn(cfg.escalaAutonomica, c)) * 1e4) / 1e4]);
  }

  /* Frases de parámetros para «Cómo lo calculamos» y el informe. */
  function resumenParametros(cfg) {
    const P = cfg.parametros, pv = P.prevision, eur = eurN;
    if (cfg.modelo === 'vasco') return [
      'Minoración de cuota: ' + eur(P.minoracion) + ' sobre la cuota general.',
      'Bonificación del trabajo: ' + eur(P.bonificacion.maxima) + ' hasta ' + eur(P.bonificacion.umbral1) + ' de rendimientos, bajando hasta ' + eur(P.bonificacion.minima) + ' a partir de ' + eur(P.bonificacion.umbral2) + ' (' + eur(P.bonificacion.minima) + ' si otras rentas superan ' + eur(P.bonificacion.otrasRentas) + ').',
      'Deducción por edad: ' + eur(P.edad.importe) + ' (desde el año en que se cumplen ' + P.edad.desde + ') o ' + eur(P.edad.importeMayor) + ' (desde los ' + P.edad.mayor + ') con base de hasta ' + eur(P.edad.base1) + ', que se reduce hasta desaparecer a ' + eur(P.edad.base2) + '. La edad es la cumplida a 31 de diciembre.',
      'EPSV en capital: ' + Math.round(pv.capital * 100) + ' % en el primer cobro por contingencia (' + Math.round(pv.capitalTransitorio * 100) + ' % en régimen transitorio para lo aportado hasta ' + (pv.corte - 1) + '), hasta ' + eur(pv.limite) + '.',
      'EPSV en renta vitalicia o temporal de ' + pv.rentaMinimaAnios + ' años o más: rentabilidad exenta' + (pv.exencionRentaMax ? ', con el límite del ' + Math.round(pv.exencionRentaMax * 100) + ' % de la renta' : '') + '.',
    ];
    if (cfg.modelo === 'navarra') return [
      'Deducción por trabajo (art. 62.5): 1.400 € hasta 12.500 € de rendimientos, bajando hasta 700 € a 17.500 €; 700 € hasta 35.000 €, bajando hasta 400 € a 50.000 €. No puede superar la escala aplicada a esos rendimientos.',
      'Mínimo personal (art. 62.9): deducción de 1.084 €, más 264 € desde los 65 años (585 € desde los 75) y 1.280 € si las rentas no superan 17.500 € (decrece hasta desaparecer a 32.000 €).',
      'Plan de pensiones: la prestación es rendimiento del trabajo al 100 %. En capital, la parte que deriva de aportaciones anteriores a ' + pv.corte + ' se reduce un ' + Math.round(pv.reduccion * 100) + ' % (DT 25.ª) si el cobro se produce en el año de la jubilación o en los dos siguientes y han pasado más de dos años desde la primera aportación.',
      'Sin minoración de cuota ni deducción por edad: la edad solo opera en el mínimo personal.',
      'No se calcula la deducción del art. 68 por pensiones de jubilación inferiores a 15.400 €.',
    ];
    return [
      'Gastos deducibles del trabajo: ' + eur(P.gastos) + ' (art. 19.2.f).',
      'Reducción por rendimientos del trabajo (art. 20): 7.302 € hasta 14.852 €, decreciente hasta desaparecer a 19.747,5 €; no se aplica si otras rentas superan 6.500 €.',
      cfg.minimoAutonomico
        ? 'Mínimo del contribuyente (art. 57): ' + eur(P.minimo.base) + ', más ' + eur(P.minimo.edad65) + ' desde el año en que se cumplen 65 y otros ' + eur(P.minimo.edad75) + ' desde los 75 (edad a 31 de diciembre); se aplica «a escala» en la parte estatal. En la parte autonómica se aplica, también «a escala», el mínimo propio ' + deComunidad(cfg.ccaa) + ' (art. 56.3): ' + eurD(cfg.minimoAutonomico.base) + ' (' + eurD(cfg.minimoAutonomico.base + cfg.minimoAutonomico.edad65) + ' desde los 65 y ' + eurD(cfg.minimoAutonomico.base + cfg.minimoAutonomico.edad65 + cfg.minimoAutonomico.edad75) + ' desde los 75).'
        : 'Mínimo del contribuyente (art. 57): ' + eur(P.minimo.base) + ', más ' + eur(P.minimo.edad65) + ' desde el año en que se cumplen 65 y otros ' + eur(P.minimo.edad75) + ' desde los 75 (edad a 31 de diciembre); se aplica «a escala» en la parte estatal y en la autonómica.',
      'Plan de pensiones: la prestación es rendimiento del trabajo al 100 %. En capital, la parte que deriva de aportaciones anteriores a ' + pv.corte + ' se reduce un ' + Math.round(pv.reduccion * 100) + ' % (DT 12.ª) si el cobro se produce en el año de la jubilación o en los dos siguientes y han pasado más de dos años desde la primera aportación.',
      'Escala autonómica: ' + (cfg.ccaa && cfg.ccaa.referencia ? 'la de referencia del art. 65 LIRPF, que no es la de ninguna comunidad autónoma.' : (cfg.ccaa ? cfg.ccaa.nombre : 'sin comunidad') + '.'),
      'Sin deducción estatal por edad; la DA 61.ª (deducción por rendimientos del trabajo) no alcanza a las pensiones.',
    ];
  }

  /* Límites comunes a todos los territorios, para avisos e informes. */
  function limites(cfg) {
    const l = ['No incluye deducciones autonómicas del régimen común ni deducciones propias de los territorios forales (alquiler, hijos, vivienda…).'];
    if (cfg && cfg.modelo === 'comun') {
      l.push(cfg.ccaa && cfg.ccaa.referencia ? 'La escala autonómica usada es la de referencia del art. 65 LIRPF, que no es la de ninguna comunidad autónoma.' : 'La escala autonómica aplicada es la ' + deComunidad(cfg.ccaa) + (cfg.minimoAutonomico ? ', con su mínimo del contribuyente propio en la parte autonómica (art. 56.3 LIRPF).' : '.'));
      l.push('Ceuta y Melilla quedan fuera del simulador: la deducción del 60 % por rentas obtenidas allí (art. 68.4 LIRPF) no está modelada.');
    }
    if (cfg && cfg.modelo === 'navarra') l.push('No se calcula la deducción del art. 68 por pensiones de jubilación contributivas inferiores a 15.400 €.');
    if (cfg && cfg.modelo !== 'vasco') l.push('Solo se modela la contingencia de jubilación del plan de pensiones; otras contingencias (invalidez, dependencia) tienen reglas propias que no se calculan.');
    return l;
  }

  /* Textos que dependen del territorio y que usan la interfaz, las guías y
     el informe. Centralizados para que no puedan discrepar. */
  function textos(cfg) {
    const pv = cfg.parametros.prevision; const vasco = pv.modelo === 'vasco';
    const fig = pv.figura;                      // 'EPSV' | 'plan de pensiones'
    const Fig = vasco ? 'EPSV' : 'Plan de pensiones';
    const la = vasco ? 'la EPSV' : 'el plan de pensiones';
    const tu = vasco ? 'tu EPSV' : 'tu plan de pensiones';
    const una = vasco ? 'una EPSV' : 'un plan de pensiones';
    return {
      figura: fig, Figura: Fig, la, tu, una, corte: pv.corte, vasco,
      irpf: cfg.irpf, ejercicio: cfg.ejercicio, nombre: nombreCompleto(cfg),
      escalaCorta: 'escala ' + (cfg.modelo === 'comun' ? 'estatal + autonómica' : 'de ' + cfg.nombre) + ' ' + cfg.ejercicio,
      ambito: cfg.modelo === 'comun'
        ? 'Usa las reglas del IRPF estatal de ' + cfg.ejercicio + ' con la escala autonómica ' + (cfg.ccaa && cfg.ccaa.referencia ? 'de referencia del art. 65 LIRPF (no la de ninguna comunidad autónoma)' : deComunidad(cfg.ccaa)) + '. No incluye deducciones autonómicas.'
        : 'Usa las reglas del ' + cfg.irpf + ' de ' + cfg.ejercicio + ' (' + cfg.hacienda + '). No incluye deducciones forales propias (alquiler, hijos, vivienda…).',
      rangoGeneral: rangoEscala(escalaGeneralVisible(cfg)),
      rangoAhorro: rangoEscala(cfg.parametros.escalaAhorro),
      etiquetaPre: vasco ? 'Aportado hasta el 31/12/' + (pv.corte - 1) : 'Derechos que vienen de aportaciones hasta el 31/12/' + (pv.corte - 1),
      etiquetaPost: vasco ? 'Aportado desde el 1/1/' + pv.corte : 'Resto de derechos (aportaciones desde ' + pv.corte + ')',
      tituloPre: 'Derechos anteriores a ' + pv.corte, tituloPost: 'Derechos desde ' + pv.corte,
      condicionPrimerCobro: vasco ? 'Es el primer cobro en capital por este motivo' : 'Lo cobro en el año de la jubilación o en los dos siguientes',
      condicionPrimerCobroNota: vasco ? 'La reducción solo se aplica una vez por contingencia.' : 'La reducción del ' + Math.round(pv.reduccion * 100) + ' % solo se aplica dentro de ese plazo.',
      reduccionCapital: vasco ? 'Se aplica la reducción (' + Math.round(pv.capitalTransitorio * 100) + ' % o ' + Math.round(pv.capital * 100) + ' %)' : 'Se aplica la reducción del ' + Math.round(pv.reduccion * 100) + ' % a la parte anterior a ' + pv.corte,
      bloqueRenta: vasco
        ? [{ v: 'flexible', t: 'Retiradas periódicas', d: 'Suben con el IPC. La rentabilidad tributa en la base del ahorro.' },
          { v: 'temporal', t: 'Renta de ' + pv.rentaMinimaAnios + ' años o más', d: 'Cuantía constante. La rentabilidad queda exenta' + (pv.exencionRentaMax ? ' (hasta el ' + Math.round(pv.exencionRentaMax * 100) + ' % de la renta)' : '') + '.' },
          { v: 'vitalicia', t: 'Renta vitalicia', d: 'Cuantía constante. La rentabilidad queda exenta' + (pv.exencionRentaMax ? ' (hasta el ' + Math.round(pv.exencionRentaMax * 100) + ' % de la renta)' : '') + '.' }]
        : [{ v: 'flexible', t: 'Retiradas periódicas', d: 'Suben con el IPC. Todo el cobro tributa como rendimiento del trabajo.' },
          { v: 'temporal', t: 'Renta temporal', d: 'Cuantía constante durante los años que elijas. Tributa como rendimiento del trabajo.' },
          { v: 'vitalicia', t: 'Renta vitalicia', d: 'Cuantía constante hasta la edad del plan. Tributa como rendimiento del trabajo.' }],
      fiscalRenta: vasco ? 'Lo que aportaste tributa como trabajo; la rentabilidad, en la base del ahorro o exenta según la renta.' : 'Todo el cobro tributa como rendimiento del trabajo.',
      edadDeduccion: cfg.modelo === 'vasco' ? 'La deducción por edad se aplica desde el año en que se cumplen ' + cfg.parametros.edad.desde + ' años.' : cfg.modelo === 'navarra' ? 'El mínimo personal aumenta desde los 65 y desde los 75 años.' : 'El mínimo del contribuyente aumenta desde los 65 y desde los 75 años.',
      pasoTres: cfg.modelo === 'vasco'
        ? 'Cada ingreso va a su base: la pensión y las aportaciones de la EPSV a la general; ganancias, intereses y rentabilidad de la EPSV a la del ahorro; lo que aportaste no tributa. Se aplican la bonificación del trabajo, la minoración de ' + eurN(cfg.parametros.minoracion) + ' y la deducción por edad.'
        : cfg.modelo === 'navarra'
          ? 'Cada ingreso va a su base: la pensión y los cobros del plan de pensiones a la general; ganancias e intereses a la del ahorro; tu propio capital no tributa. A la cuota se restan la deducción por trabajo y el mínimo personal.'
          : 'Cada ingreso va a su base: la pensión y los cobros del plan de pensiones a la general; ganancias e intereses a la del ahorro; tu propio capital no tributa. Se aplican los gastos y la reducción del trabajo, y el mínimo personal se descuenta a escala en la parte estatal y en la autonómica.',
    };
  }

  const api = {
    CONSULTA, EJERCICIO, TERRITORIOS, CCAA, FUERA_DE_ALCANCE, TERRITORIO_DEFECTO, CCAA_DEFECTO,
    ESCALAS: { ESCALA_GENERAL_VASCA, ESCALA_AHORRO_VASCA, ESCALA_GENERAL_NAVARRA, ESCALA_AHORRO_NAVARRA, ESCALA_GENERAL_ESTATAL, ESCALA_ART65, ESCALA_AHORRO_COMUN },
    territorio, comunidad, configuracion, disponible, nombreCompleto, deComunidad, consultaFuentes,
    escala, irpf, bonificacionTrabajo, deduccionEdad, deduccionTrabajoNavarra, minimoPersonalNavarra, reduccionTrabajoComun, minimoPersonalComun,
    rentaPeriodica, opcionesCapital, basesCapitalVasco, basesCapitalReduccion, ratioEstimado,
    escalaGeneralVisible, resumenParametros, limites, textos,
  };
  global.NuviaJubilacionFiscal = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
