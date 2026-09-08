const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export async function fetchOfficialText(url, {
  source = new URL(url).hostname,
  fetchFn = globalThis.fetch,
  attempts = 2,
  timeoutMs = 45_000,
  retryDelayMs = 1_000,
  waitFn = wait,
  signalFactory = milliseconds => AbortSignal.timeout(milliseconds),
} = {}) {
  if (!Number.isInteger(attempts) || attempts < 1) throw new Error('El número de intentos debe ser un entero positivo.');

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchFn(url, {
        headers: { 'user-agent': 'NUVIA-Portal-Alfa/1.0 (daily official-data updater)' },
        signal: signalFactory(timeoutMs),
      });
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        throw error;
      }
      return await response.text();
    } catch (error) {
      const retryable = error?.retryable !== false;
      if (!retryable || attempt === attempts) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`No se pudo consultar ${source} tras ${attempt} intento(s): ${detail}`, { cause: error });
      }
      if (retryDelayMs > 0) await waitFn(retryDelayMs * attempt);
    }
  }

  throw new Error(`No se pudo consultar ${source}.`);
}

// Lectura numérica estricta: un hueco de una fuente oficial nunca equivale a cero.
export function officialNumber(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function eurostatObservations(payload) {
  const index = payload?.dimension?.time?.category?.index;
  if (!index || !payload?.value) return [];
  return Object.entries(index)
    .map(([period, position]) => ({ period, value: officialNumber(payload.value[String(position)]) }))
    .filter(row => row.value !== null)
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function ecbObservations(header, rows) {
  const timeColumn = header.indexOf('TIME_PERIOD'), valueColumn = header.indexOf('OBS_VALUE');
  if (timeColumn < 0 || valueColumn < 0) return [];
  return rows.map(row => ({ period: row[timeColumn], value: officialNumber(row[valueColumn]) }))
    .filter(row => row.period && row.value !== null)
    .sort((a, b) => a.period.localeCompare(b.period));
}
