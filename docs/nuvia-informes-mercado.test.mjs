/**
 * Pruebas del informe de mercado de NUVIA.
 *
 * Lo que aquí se comprueba no es «que el código funcione»: es que el perímetro
 * regulatorio aguante aunque el modelo de lenguaje empuje contra él. Por eso la
 * mayoría de los casos son negativos.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

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
      { texto: 'El BCE mantuvo la facilidad de depósito en el 2,50%.', fecha: '10 de septiembre de 2026' },
      { texto: 'El IBEX 35 cerró en 19.659,80 puntos, un 0,18% menos.', fecha: '10 de septiembre de 2026' },
      { texto: 'El Brent alcanzó los 105,75 dólares por barril.', fecha: '10 de septiembre de 2026' },
    ],
    indicadores: [
      { etiqueta: 'IBEX 35', valor: '19.659,80 puntos', referencia: '10 de septiembre de 2026 (BME)' },
      { etiqueta: 'Brent', valor: '105,75 dólares', referencia: '10 de septiembre de 2026 (ICE)' },
      { etiqueta: 'EUR/USD', valor: '1,1625', referencia: '10 de septiembre de 2026 (BCE)' },
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

  // Siete párrafos: pasan de largo en el diario y caben en el semanal.
  const largo = informeValido();
  largo.cuerpo = [
    { titulo: 'Primera parte', parrafos: Array.from({ length: 4 }, () => parrafo) },
    { titulo: 'Segunda parte', parrafos: Array.from({ length: 3 }, () => parrafo) },
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

test('descarta las fuentes repetidas del mismo sitio', () => {
  const depuradas = depurarFuentes([
    { titulo: 'ecb', url: 'https://www.ecb.europa.eu/press/uno.html' },
    { titulo: 'ecb', url: 'https://www.ecb.europa.eu/press/dos.html' },
    { titulo: 'ine', url: 'https://www.ine.es/prensa/ipc.pdf' },
  ]);
  assert.equal(depuradas.length, 2);
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
