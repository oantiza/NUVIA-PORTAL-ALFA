/**
 * Pruebas del informe de mercado de NUVIA.
 *
 * Lo que aquí se comprueba no es «que el código funcione»: es que el perímetro
 * regulatorio aguante aunque el modelo de lenguaje empuje contra él. Por eso la
 * mayoría de los casos son negativos.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { validarInforme, vigencia, ErrorContrato } from '../scripts/informes-mercado/contrato.mjs';
import { integrarEnIndice } from '../scripts/informes-mercado/publicar.mjs';
import { informeAHtml } from '../scripts/informes-mercado/plantilla-html.mjs';
import { primerObjeto } from '../scripts/informes-mercado/gemini.mjs';
import { depurarFuentes, clasificarFuente } from '../scripts/informes-mercado/fuentes.mjs';

function informeValido(extra = {}) {
  return {
    tipo: 'DIARIO',
    fecha: '2026-09-10',
    titular: 'El BCE mantiene los tipos y el Brent sube un 4%',
    entradilla:
      'El Banco Central Europeo dejó sin cambios sus tipos oficiales. El petróleo Brent subió un 4% en la sesión y las bolsas europeas cerraron con descensos moderados.',
    hechos: [
      { texto: 'El BCE mantuvo la facilidad de depósito en el 2,50%.', fecha: '10 de septiembre de 2026', fuentes: [1] },
      { texto: 'El IBEX 35 cerró en 19.659,80 puntos, un 0,18% menos.', fecha: '10 de septiembre de 2026', fuentes: [2] },
      { texto: 'El Brent alcanzó los 105,75 dólares por barril.', fecha: '10 de septiembre de 2026', fuentes: [2] },
    ],
    indicadores: [
      { etiqueta: 'IBEX 35', valor: '19.659,80 puntos', referencia: '10 de septiembre de 2026 (BME)', fuentes: [2] },
      { etiqueta: 'Brent', valor: '105,75 dólares', referencia: '10 de septiembre de 2026 (ICE)', fuentes: [2] },
      { etiqueta: 'EUR/USD', valor: '1,1625', referencia: '10 de septiembre de 2026 (BCE)', fuentes: [1] },
    ],
    agenda: [
      { cuando: '11 de septiembre', que: 'Publicación del IPC de agosto en Estados Unidos.' },
      { cuando: '12 de septiembre', que: 'Comparecencia de la presidenta del BCE ante el Parlamento.' },
    ],
    cuerpo: [
      {
        titulo: 'Política monetaria',
        parrafos: [
          'El Banco Central Europeo mantuvo sin cambios sus tres tipos de interés oficiales, según su comunicado del 10 de septiembre de 2026.',
        ],
      },
      {
        titulo: 'Materias primas',
        parrafos: [
          'El barril de Brent subió un 4% hasta los 105,75 dólares, según los datos publicados por ICE en la misma jornada.',
          'Las bolsas europeas cerraron con descensos moderados, según los datos de cierre difundidos por los operadores de mercado.',
        ],
      },
    ],
    fuentes: [
      { titulo: 'Banco Central Europeo', url: 'https://www.ecb.europa.eu/' },
      { titulo: 'Bolsas y Mercados Españoles', url: 'https://www.bolsasymercados.es/' },
    ],
    generacion: { modeloInvestigacion: 'gemini-3.8-flash', modeloRedaccion: 'gemini-3.1-pro-preview' },
    ...extra,
  };
}

test('acepta un informe diario dentro del perímetro', () => {
  const informe = validarInforme(informeValido());
  assert.equal(informe.id, 'diario-2026-09-10');
  assert.equal(informe.tipo, 'DIARIO');
  assert.equal(informe.revision.estado, 'borrador');
  assert.equal(informe.fuentes.length, 2);
});

test('rechaza el bloque de asignación de activos del informe de BDB', () => {
  // El fallo más probable a futuro no es que el modelo se desmadre, sino que
  // alguien porte el informe de estrategia de BDB por comodidad.
  const conAsignacion = informeValido({ assetAllocation: { overview: 'x', classes: [] } });
  assert.throws(() => validarInforme(conAsignacion), ErrorContrato);

  const conTermometro = informeValido({ marketTemperature: 'Bullish' });
  assert.throws(() => validarInforme(conTermometro), ErrorContrato);
});

test('rechaza el lenguaje que convierte la descripción en consejo', () => {
  const casos = [
    'Es una buena oportunidad de compra para el ahorrador paciente que quiera aprovecharla.',
    'Recomendamos vigilar la deuda soberana europea durante las próximas sesiones de mercado.',
    'El sector bancario cotiza infravalorado frente a su media histórica de los últimos diez años.',
    'Deberías revisar tu exposición a renta variable antes de la publicación del dato de inflación.',
  ];

  for (const parrafo of casos) {
    const informe = informeValido();
    informe.cuerpo[0].parrafos = [parrafo];
    assert.throws(
      () => validarInforme(informe),
      ErrorContrato,
      `debería rechazarse: ${parrafo}`,
    );
  }
});

test('el veto alcanza también al titular y a los hechos, no solo al cuerpo', () => {
  const enTitular = informeValido({ titular: 'Oportunidad de compra en la bolsa europea' });
  assert.throws(() => validarInforme(enTitular), ErrorContrato);

  const enHechos = informeValido();
  enHechos.hechos[0].texto = 'Los analistas fijan un precio objetivo de 12 euros para el valor.';
  assert.throws(() => validarInforme(enHechos), ErrorContrato);
});

test('exige fuentes https y al menos dos', () => {
  const insegura = informeValido();
  insegura.fuentes[0].url = 'http://www.ecb.europa.eu/';
  assert.throws(() => validarInforme(insegura), ErrorContrato);

  const escasa = informeValido();
  escasa.fuentes = [{ titulo: 'BCE', url: 'https://www.ecb.europa.eu/' }];
  assert.throws(() => validarInforme(escasa), ErrorContrato);
});

test('cada tipo tiene su propio rango de extensión', () => {
  const parrafo =
    'El Banco Central Europeo mantuvo sin cambios sus tres tipos de interés oficiales según su comunicado oficial.';

  // Doce párrafos: pasan de largo en el diario (tope 10) y caben en el semanal (tope 14).
  const largo = informeValido();
  largo.cuerpo = [
    { titulo: 'Primera parte', parrafos: Array.from({ length: 6 }, () => parrafo) },
    { titulo: 'Segunda parte', parrafos: Array.from({ length: 6 }, () => parrafo) },
  ];
  assert.throws(() => validarInforme(largo), ErrorContrato);

  const semanal = { ...largo, tipo: 'SEMANAL' };
  assert.equal(validarInforme(semanal).id, 'semanal-2026-09-10');
});

test('la vigencia distingue una edición del día de una de archivo', () => {
  const informe = validarInforme(informeValido());
  assert.equal(vigencia(informe, new Date('2026-09-11T08:00:00Z')).estado, 'vigente');
  assert.equal(vigencia(informe, new Date('2026-09-20T08:00:00Z')).estado, 'archivo');
});

test('el índice ordena por fecha, no duplica y acota el archivo', () => {
  const informe = validarInforme(informeValido());
  const antiguo = validarInforme(informeValido({ fecha: '2026-09-01' }));

  let indice = integrarEnIndice({ ediciones: {}, archivo: [] }, antiguo);
  indice = integrarEnIndice(indice, informe);
  // Republicar la misma fecha sustituye, no añade.
  indice = integrarEnIndice(indice, informe);

  assert.equal(indice.archivo.length, 2);
  assert.equal(indice.archivo[0].fecha, '2026-09-10');
  assert.equal(indice.ediciones.DIARIO.id, 'diario-2026-09-10');
  assert.ok(indice.ediciones.DIARIO.descarga.endsWith('diario-2026-09-10.html'));
});

test('la versión descargable escapa el texto del modelo', () => {
  // El contenido viene de un modelo que ha leído páginas web. Ninguna de esas
  // dos procedencias autoriza a inyectar marcado en el documento.
  const informe = validarInforme(
    informeValido({ titular: 'El BCE mantiene los tipos <script>alert(1)</script>' }),
  );
  const html = informeAHtml(informe);

  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

test('la versión descargable declara cómo se ha hecho y qué no es', () => {
  const html = informeAHtml(validarInforme(informeValido()));
  assert.ok(html.includes('inteligencia artificial'));
  assert.ok(html.includes('No es asesoramiento financiero'));
  assert.ok(html.includes('gemini-3.8-flash'));
  // Sin conexión también tiene que verse: nada externo.
  assert.ok(!/<link[^>]+href="http/.test(html));
  assert.ok(!/<script/.test(html));
});

test('del JSON del modelo se toma el primer objeto completo', () => {
  // Un modelo puede añadir una nota después del JSON. Cortar hasta la última
  // llave se la llevaría por delante y JSON.parse fallaría sin explicar nada.
  const texto = '{"a":1,"b":{"c":"}"}}\nY además, una nota final. {"otro":2}';
  assert.equal(primerObjeto(texto), '{"a":1,"b":{"c":"}"}}');
});

// --------------------------------------------------------------------------
// Procedencia de las fuentes
// --------------------------------------------------------------------------

test('deja fuera a los brókeres y a los portales de recomendaciones', () => {
  // No es un juicio sobre su rigor: su negocio es que el lector opere, y el §10
  // del marco pide independencia. Material comercial no sostiene un informe.
  const depuradas = depurarFuentes([
    { titulo: 'xtb.com', url: 'https://www.xtb.com/es/analisis' },
    { titulo: 'rankia.com', url: 'https://www.rankia.com/foro/bolsa' },
    { titulo: 'europa.eu', url: 'https://www.ecb.europa.eu/press/pr/date/2026/html/nota.es.html' },
  ]);

  assert.equal(depuradas.length, 1);
  assert.equal(depuradas[0].titulo, 'Banco Central Europeo');
});

test('pone delante a quien publica el dato de primera mano', () => {
  // El informe muestra doce como mucho: si las primarias fueran al final,
  // serían justo las que se caen del recorte.
  const depuradas = depurarFuentes([
    { titulo: 'efe.com', url: 'https://www.efe.com/mercados' },
    { titulo: 'democrata.es', url: 'https://democrata.es/economia' },
    { titulo: 'ine.es', url: 'https://www.ine.es/prensa/ipc.pdf' },
  ]);

  assert.deepEqual(
    depuradas.map((f) => f.titulo),
    ['Instituto Nacional de Estadística', 'efe.com', 'democrata.es'],
  );
});

test('el dominio más específico manda sobre el más general', () => {
  // ecb.europa.eu termina en europa.eu; el nombre correcto es el del banco.
  assert.equal(clasificarFuente('https://www.ecb.europa.eu/x').nombre, 'Banco Central Europeo');
  assert.equal(clasificarFuente('https://europa.eu/x').nombre, 'Unión Europea');
});

test('no publica un informe sin una sola fuente primaria', () => {
  const informe = informeValido();
  informe.fuentes = [
    { titulo: 'efe.com', url: 'https://www.efe.com/mercados' },
    { titulo: 'democrata.es', url: 'https://democrata.es/economia' },
  ];
  assert.throws(() => validarInforme(informe), ErrorContrato);
});

test('rechaza las redirecciones del buscador, que caducan en horas', () => {
  // Comprobado el 10-09-2026: una redirección de dos horas antes ya daba 404.
  // Si llega hasta aquí es que no se resolvió al generar.
  const informe = informeValido();
  informe.fuentes[1] = {
    titulo: 'bolsasymercados.es',
    url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGZTFM1o2Y',
  };
  assert.throws(() => validarInforme(informe), ErrorContrato);
});

test('conserva documentos distintos de un organismo y elimina la URL repetida', () => {
  const depuradas = depurarFuentes([
    { titulo: 'ecb', url: 'https://www.ecb.europa.eu/press/uno.html' },
    { titulo: 'ecb', url: 'https://www.ecb.europa.eu/press/dos.html' },
    { titulo: 'ine', url: 'https://www.ine.es/prensa/ipc.pdf' },
    { titulo: 'ine repetido', url: 'https://www.ine.es/prensa/ipc.pdf' },
  ]);
  assert.equal(depuradas.length, 3);
});

test('una republicación histórica no sustituye la última edición', () => {
  const reciente = validarInforme(informeValido());
  const antiguo = validarInforme(informeValido({ fecha: '2026-09-01' }));
  const indice = integrarEnIndice(integrarEnIndice({ ediciones: {}, archivo: [] }, reciente), antiguo);
  assert.equal(indice.ediciones.DIARIO.id, reciente.id);
  assert.equal(indice.archivo.length, 2);
});

test('rechaza días inexistentes, identidades incoherentes y fuentes inexistentes', () => {
  assert.throws(() => validarInforme(informeValido({ fecha: '2026-02-30' })), ErrorContrato);
  assert.throws(() => validarInforme(informeValido({ tipo: 'toString' })), ErrorContrato);
  assert.throws(() => validarInforme(informeValido({ fechaIso: '2026-09-09T00:00:00.000Z' })), ErrorContrato);
  const mal = informeValido(); mal.hechos[0].fuentes = [7];
  assert.throws(() => validarInforme(mal), ErrorContrato);
});

test('los campos de valores y limitaciones tampoco pueden contener consejo', () => {
  const mal = informeValido(); mal.indicadores[0].valor = 'Oportunidad de compra';
  assert.throws(() => validarInforme(mal), ErrorContrato);
  assert.throws(() => validarInforme(informeValido({ limitaciones: 'Deberías revisar tu exposición.' })), ErrorContrato);
});

test('vigencia se calcula al consultar en Madrid y no convierte el futuro en actual', () => {
  const informe = validarInforme(informeValido());
  assert.equal(vigencia(informe, new Date('2026-09-09T10:00:00Z')).estado, 'futuro');
  assert.equal(vigencia(informe, new Date('2026-09-12T22:30:00Z')).estado, 'archivo');
});

test('las dos ediciones reales tienen período, referencias y descarga idéntica al lector', () => {
  const indice = JSON.parse(readFileSync(new URL('../data/informes-mercado.json', import.meta.url), 'utf8'));
  for (const tipo of ['DIARIO', 'SEMANAL']) {
    const informe = validarInforme(indice.ediciones[tipo]);
    assert.ok(informe.periodo);
    assert.match(informe.revision.nota, /asistidos por IA/);
    for (const hecho of informe.hechos) assert.ok(hecho.fuentes.length);
    for (const cifra of informe.indicadores) {
      if (/\d/.test(cifra.valor)) assert.ok(cifra.fuentes.length, cifra.etiqueta);
    }
    const html = readFileSync(new URL(`../core/downloads/informes/${informe.id}.html`, import.meta.url), 'utf8');
    assert.equal(html, informeAHtml(informe), 'La descarga debe regenerarse cuando cambian datos o presentación');
    assert.ok(html.includes('data:font/woff2;base64,'), 'Tipografía autoalojada en el documento');
  }
  const markets = readFileSync(new URL('../mercados.html', import.meta.url), 'utf8');
  assert.match(markets, /data-report-select="DIARIO"/);
  assert.match(markets, /data-report-select="SEMANAL"/);
});

test('acota la cola secundaria y no toca las primarias', () => {
  // Doce enlaces de los que solo dos valen le dan al lector una falsa sensación
  // de respaldo documental.
  const muchas = [
    ...Array.from({ length: 9 }, (_, i) => ({ titulo: `medio${i}`, url: `https://medio${i}.example/nota` })),
    { titulo: 'ecb', url: 'https://www.ecb.europa.eu/press/nota.html' },
    { titulo: 'ine', url: 'https://www.ine.es/prensa/ipc.pdf' },
    { titulo: 'bls', url: 'https://www.bls.gov/news.release/ppi.htm' },
  ];
  const depuradas = depurarFuentes(muchas);

  assert.equal(depuradas.length, 7, 'tres primarias y cuatro secundarias');
  assert.deepEqual(
    depuradas.slice(0, 3).map((f) => f.titulo),
    ['Banco Central Europeo', 'Instituto Nacional de Estadística', 'Oficina de Estadísticas Laborales de Estados Unidos'],
  );
});


/* ------------------------------------------------------------------------- */
/* informe-mercado.v2: tablas, claves, agenda con fecha y glosario            */
/* ------------------------------------------------------------------------- */

import { renderInforme, variacionLegible } from '../js/nuvia-market-reports-render.mjs';

function bloquesV2() {
  return {
    claves: [
      { titulo: 'El BCE mantiene el precio del dinero', texto: 'La facilidad de depósito sigue en el 2,50 %. Es el tipo que cobra un banco por dejar su dinero en el banco central y marca el suelo de lo que pagan los depósitos.', fuentes: [1] },
      { titulo: 'El petróleo se encarece', texto: 'El Brent subió un 4 % en la sesión. Un barril más caro encarece la gasolina y presiona la inflación de los próximos meses.', fuentes: [2] },
      { titulo: 'La bolsa española cierra casi plana', texto: 'El IBEX 35 cedió un 0,18 %. Un movimiento pequeño en un día es ruido; lo que cuenta es la tendencia de meses.', fuentes: [2] },
    ],
    mercados: [
      { grupo: 'Bolsas', filas: [
        { nombre: 'IBEX 35', nivel: '19.659,80 puntos', variacion: -0.18, variacionAnual: 12.4, nota: 'Pesaron los bancos.', fuentes: [2] },
        { nombre: 'Euro Stoxx 50', nivel: '5.410,10 puntos', variacion: 0.3, variacionAnual: null, nota: null, fuentes: [2] },
        { nombre: 'S&P 500', nivel: 'Sin contrastar', variacion: null, variacionAnual: null, nota: 'Sin publicación oficial en la base factual.', fuentes: [] },
      ] },
      { grupo: 'Deuda pública', filas: [
        { nombre: 'Bono alemán a 10 años', nivel: '2,65 %', variacion: -0.05, variacionAnual: null, nota: null, fuentes: [1] },
        { nombre: 'Bono español a 10 años', nivel: '3,30 %', variacion: -0.04, variacionAnual: null, nota: null, fuentes: [1] },
      ] },
      { grupo: 'Divisas', filas: [{ nombre: 'EUR/USD', nivel: '1,1625', variacion: 0.2, variacionAnual: null, nota: null, fuentes: [1] }] },
      { grupo: 'Materias primas', filas: [{ nombre: 'Brent', nivel: '105,75 dólares por barril', variacion: 4.0, variacionAnual: null, nota: 'Menos oferta prevista.', fuentes: [2] }] },
    ],
    agenda: [
      { fecha: '2026-09-11', hora: '14:30', region: 'EEUU', que: 'IPC de agosto', anterior: '2,8 %', porQueImporta: 'Mide la inflación que vigila la Reserva Federal.', fuentes: [1] },
      { fecha: '2026-09-12', hora: null, region: 'Eurozona', que: 'Comparecencia de la presidenta del BCE ante el Parlamento Europeo.', anterior: null, porQueImporta: null, fuentes: [1] },
    ],
    glosario: [
      { termino: 'Punto básico', definicion: 'Una centésima de punto porcentual: 25 puntos básicos son 0,25 %. Se usa para hablar de tipos de interés.' },
      { termino: 'Facilidad de depósito', definicion: 'Tipo de interés que el BCE paga a los bancos por el dinero que dejan en él de un día para otro.' },
    ],
  };
}

test('v2: acepta los bloques nuevos y conserva las cifras nulas como nulas', () => {
  const informe = validarInforme(informeValido(bloquesV2()), { exigirBloques: true });
  assert.equal(informe.schema_version, 'informe-mercado.v2');
  assert.equal(informe.claves.length, 3);
  assert.equal(informe.mercados[0].filas[2].variacion, null);
  assert.equal(informe.mercados[0].filas[2].nivel, 'Sin contrastar');
  assert.deepEqual(informe.mercados[0].filas[0].fuentes, [2]);
  assert.equal(informe.agenda[0].fecha, '2026-09-11');
  assert.equal(informe.glosario[1].termino, 'Facilidad de depósito');
});

test('v2: una edición v1 sin bloques sigue siendo válida al leer, no al generar', () => {
  assert.equal(validarInforme(informeValido()).id, 'diario-2026-09-10');
  assert.throws(() => validarInforme(informeValido(), { exigirBloques: true }), /Falta el bloque «claves»/);
  const sinFechas = informeValido(bloquesV2());
  sinFechas.agenda = [{ cuando: '11 de septiembre', que: 'Publicación del IPC de agosto en Estados Unidos.' }, { cuando: '12 de septiembre', que: 'Comparecencia de la presidenta del BCE.' }];
  assert.throws(() => validarInforme(sinFechas, { exigirBloques: true }), /fecha AAAA-MM-DD/);
});

test('v2: una variación escrita como texto no pasa, y una cifra sin fuente se queda sin contrastar', () => {
  const texto = informeValido(bloquesV2());
  texto.mercados[0].filas[0].variacion = '+1,4 %';
  assert.throws(() => validarInforme(texto), /debe ser un número/);

  // El modelo olvida a menudo el número de la fuente. La fila sobrevive, la
  // cifra no: nadie la respalda y el lector lo ve escrito.
  const sinFuente = informeValido(bloquesV2());
  sinFuente.mercados[0].filas[0].fuentes = [];
  const fila = validarInforme(sinFuente).mercados[0].filas[0];
  assert.equal(fila.nivel, 'Sin contrastar');
  assert.equal(fila.variacion, null);
  assert.equal(fila.variacionAnual, null);
  assert.match(fila.nota, /no se publica/);
});

test('v2: el veto de lenguaje alcanza a claves, notas de mercado y glosario', () => {
  for (const [ruta, valor] of [
    [['claves', 0, 'texto'], 'Con estos datos es momento de entrar en bolsa antes de que suba más.'],
    [['mercados', 0, 'filas', 0, 'nota'], 'Un nivel que muchos ven como oportunidad de compra.'],
    [['glosario', 0, 'definicion'], 'Cuando baja, recomendamos revisar los depósitos y cambiar de banco.'],
  ]) {
    const informe = informeValido(bloquesV2());
    let nodo = informe;
    for (const paso of ruta.slice(0, -1)) nodo = nodo[paso];
    nodo[ruta.at(-1)] = valor;
    assert.throws(() => validarInforme(informe), ErrorContrato, ruta.join('.'));
  }
});

test('v2: los campos de escenarios y riesgos del informe de estrategia siguen fuera', () => {
  for (const campo of ['scenarios', 'escenarios', 'riesgos']) {
    assert.throws(() => validarInforme(informeValido({ [campo]: [] })), /no pertenece a este contrato/);
  }
});

function semanalValido() {
  const base = informeValido({ ...bloquesV2(), tipo: 'SEMANAL' });
  base.cuerpo[1].parrafos.push(
    'Las bolsas europeas cerraron la semana con signo mixto, según los datos de cierre difundidos por los operadores de mercado.',
    'El mercado de deuda acompañó el movimiento del crudo, con precios a la baja en los plazos largos durante toda la semana.',
  );
  return base;
}

test('v2: el lector pinta tablas, gráfico y glosario, con el signo en la cifra', () => {
  const html = renderInforme(validarInforme(semanalValido()));
  assert.match(html, /En pocas palabras/);
  assert.match(html, /<svg viewBox="0 0 1000/);
  assert.match(html, /nv-report__table/);
  assert.match(html, /nv-report__delta--down">−0,18 %/);
  assert.match(html, /nv-report__delta--up">\+4,00 %/);
  assert.match(html, /<td class="num">Sin contrastar<\/td>/);
  assert.match(html, /nv-report__agenda-table/);
  assert.match(html, /Glosario/);
  // El gráfico no lleva scripts ni colores en línea: los estilos salen de la hoja y sus tokens.
  assert.ok(!/<script/.test(html));
  assert.ok(!/fill="#/.test(html));
});

test('v2: el descargable incrusta los tokens de los estilos nuevos y no pierde el signo', () => {
  const html = informeAHtml(validarInforme(semanalValido()));
  assert.match(html, /--nv-positive:/);
  assert.match(html, /--nv-negative:/);
  assert.ok(!/<script/.test(html));
  assert.match(html, /−0,05 %/);
});

test('v2: variacionLegible usa coma, espacio antes del % y menos tipográfico', () => {
  assert.equal(variacionLegible(1.4), '+1,4 %');
  assert.equal(variacionLegible(-0.3), '−0,3 %');
  assert.equal(variacionLegible(0), '0,0 %');
  assert.equal(variacionLegible(null), '—');
  assert.equal(variacionLegible(-0.05, 2), '−0,05 %');
});

/**
 * Acreditación del texto (v2, 14-09-2026).
 *
 * La tabla de mercados ya no dejaba pasar una cifra sin fuente, pero los hechos
 * y los indicadores sí: la edición del 14 de septiembre se publicó con la
 * decisión del BCE, el IPC estadounidense y el IPI español sin una sola
 * publicación detrás. Lo que sigue fija la regla: se intenta acreditar por el
 * nombre del organismo y lo que siga sin respaldo no se publica.
 */
test('v2: un hecho sin fuente se acredita por el organismo que cita', () => {
  const entrada = informeValido(bloquesV2());
  entrada.hechos[0].fuentes = [];
  const informe = validarInforme(entrada, { exigirBloques: true });
  assert.equal(informe.hechos.length, 3);
  assert.deepEqual(informe.hechos[0].fuentes, [1], 'el texto nombra al BCE, que está en la lista');
});

test('v2: un indicador con cifra que nadie publica se retira y se avisa', () => {
  const entrada = informeValido(bloquesV2());
  entrada.indicadores.push({
    etiqueta: 'Probabilidad implícita de subida de tipos',
    valor: '90,4 %',
    referencia: 'mercados de futuros',
    fuentes: [],
  });
  const retirados = [];
  const informe = validarInforme(entrada, { exigirBloques: true, alRetirar: (l) => retirados.push(...l) });
  assert.equal(informe.indicadores.length, 3);
  assert.match(retirados.join(' '), /Probabilidad implícita/);
});

test('v2: un indicador sin cifra no necesita respaldo documental', () => {
  const entrada = informeValido(bloquesV2());
  entrada.indicadores.push({
    etiqueta: 'Tono de la reunión',
    valor: 'Sin contrastar',
    referencia: 'pendiente de acta',
    fuentes: [],
  });
  const informe = validarInforme(entrada, { exigirBloques: true });
  assert.equal(informe.indicadores.length, 4);
});

test('v2: sin hechos acreditados el borrador no sale', () => {
  const entrada = informeValido(bloquesV2());
  entrada.hechos = entrada.hechos.map((hecho) => ({ ...hecho, texto: 'Los operadores hablan de un mercado tenso.', fuentes: [] }));
  assert.throws(() => validarInforme(entrada, { exigirBloques: true }), /tres hechos con fuente/);
});

test('v2: al leer una edición publicada no se retira nada', () => {
  const entrada = informeValido();
  entrada.hechos[0].fuentes = [];
  assert.equal(validarInforme(entrada).hechos.length, 3);
});

test('v2: el diario no publica la tabla de mercados y el semanal sí', () => {
  const diario = renderInforme(validarInforme(informeValido(bloquesV2())));
  assert.ok(!/Los mercados de un vistazo/.test(diario), 'el diario ya la cuenta en cifras y hechos');
  assert.ok(!/<svg viewBox="0 0 1000/.test(diario));
  const semanal = renderInforme(validarInforme(semanalValido()));
  assert.match(semanal, /Los mercados de un vistazo/);
});

test('v2: el diario se genera sin bloque de mercados y el semanal no', () => {
  const { mercados, ...sinMercados } = bloquesV2();
  assert.equal(validarInforme(informeValido(sinMercados), { exigirBloques: true }).mercados, undefined);
  const semanal = { ...semanalValido() };
  delete semanal.mercados;
  assert.throws(() => validarInforme(semanal, { exigirBloques: true }), /Falta el bloque «mercados»/);
});
