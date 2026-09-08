import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchOfficialText, officialNumber, eurostatObservations, ecbObservations } from '../scripts/official-observations.mjs';
import { readFile } from 'node:fs/promises';

test('la fuente oficial distingue cero, ausencia e invalidez', () => {
  for (const value of [null, undefined, '', ' ', false, true, {}, [], NaN, Infinity, 'NA', ':']) assert.equal(officialNumber(value), null);
  for (const value of [0, '0', ' 0 ']) assert.equal(officialNumber(value), 0);
  assert.equal(officialNumber('-0.5'), -0.5);
});
test('Eurostat: huecos y orden del diccionario no inventan la observación más reciente', () => {
  const payload = { dimension: { time: { category: { index: { '2026-08': 0, '2026-06': 2, '2026-07': 1 } } } }, value: { 0: null, 1: 0, 2: 1.2 } };
  assert.deepEqual(eurostatObservations(payload), [{ period: '2026-06', value: 1.2 }, { period: '2026-07', value: 0 }]);
  assert.deepEqual(eurostatObservations({}), []);
});
test('BCE: orden cronológico y celdas vacías sin conversión a cero', () => {
  assert.deepEqual(ecbObservations(['TIME_PERIOD', 'OBS_VALUE'], [['2026-08', ''], ['2026-07', '0'], ['2026-06', '2.5']]), [{ period: '2026-06', value: 2.5 }, { period: '2026-07', value: 0 }]);
  assert.deepEqual(ecbObservations(['OTRA'], [['dato']]), []);
});
test('consulta oficial: reintenta una demora y conserva la identidad Alfa', async () => {
  let calls = 0;
  const delays = [];
  const body = await fetchOfficialText('https://example.test/data', {
    source: 'Fuente de prueba',
    retryDelayMs: 5,
    waitFn: async milliseconds => delays.push(milliseconds),
    signalFactory: milliseconds => ({ timeoutMs: milliseconds }),
    fetchFn: async (_url, options) => {
      calls += 1;
      assert.equal(options.signal.timeoutMs, 45_000);
      assert.match(options.headers['user-agent'], /NUVIA-Portal-Alfa/);
      if (calls === 1) throw new DOMException('demora simulada', 'TimeoutError');
      return { ok: true, text: async () => 'recuperado' };
    },
  });
  assert.equal(body, 'recuperado');
  assert.equal(calls, 2);
  assert.deepEqual(delays, [5]);
});
test('consulta oficial: identifica la fuente tras agotar dos intentos', async () => {
  let calls = 0;
  await assert.rejects(
    fetchOfficialText('https://example.test/data', {
      source: 'Eurostat · prueba',
      retryDelayMs: 0,
      signalFactory: () => undefined,
      fetchFn: async () => { calls += 1; throw new Error('sin respuesta'); },
    }),
    /Eurostat · prueba.*2 intento\(s\).*sin respuesta/,
  );
  assert.equal(calls, 2);
});
test('consulta oficial: un error de configuración no se reintenta', async () => {
  let calls = 0;
  await assert.rejects(
    fetchOfficialText('https://example.test/data', {
      source: 'Fuente mal configurada',
      retryDelayMs: 0,
      signalFactory: () => undefined,
      fetchFn: async () => { calls += 1; return { ok: false, status: 404 }; },
    }),
    /Fuente mal configurada.*1 intento\(s\).*HTTP 404/,
  );
  assert.equal(calls, 1);
});
test('la publicación programa noticias y macro antes de construir; conserva copias ante una incidencia', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  const macro = workflow.indexOf('node scripts/update-macro-data.mjs'), build = workflow.indexOf('run: npm run build');
  assert.ok(macro >= 0 && build > macro);
  assert.match(workflow, /run: node scripts\/update-macro-data\.mjs[\s\S]*?continue-on-error: true/);
  assert.match(workflow, /run: node scripts\/update-daily-news\.mjs/);
});
