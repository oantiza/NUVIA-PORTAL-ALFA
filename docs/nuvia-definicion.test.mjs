import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const canonicalPath = fileURLToPath(new URL('./DEFINICION_NUVIA.md', import.meta.url));
const [canonicalRaw, pageRaw] = await Promise.all([
  readFile(canonicalPath, 'utf8'),
  readFile(resolve(root, 'que-es-nuvia.html'), 'utf8'),
]);

const normalize = (value) => value
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[*_`#]/g, ' ')
  .replace(/[.,:;!?¿¡“”«»()[\]—–-]/g, ' ')
  .toLocaleLowerCase('es')
  .normalize('NFC')
  .replace(/\s+/g, ' ')
  .trim();

const canonicalBody = canonicalRaw.replace(/^---\s*[\s\S]*?\s*---\s*/, '');
const publicSentences = canonicalBody
  .split(/\r?\n\s*\r?\n/)
  .map((block) => block.trim())
  .filter((block) => block && block !== '---' && !block.startsWith('#'))
  .flatMap((block) => block.replace(/\r?\n/g, ' ').split(/(?<=[.!?])\s+/))
  .map(normalize)
  .filter(Boolean);

const pageText = normalize(pageRaw);
assert.ok(publicSentences.length >= 18, 'La definición canónica contiene el relato público esperado');
for (const sentence of publicSentences) {
  assert.ok(pageText.includes(sentence), `Falta en la presentación canónica: «${sentence}»`);
}

assert.match(pageRaw, /<link rel="canonical" href="https:\/\/oantiza\.github\.io\/NUVIA-PORTAL-ALFA\/que-es-nuvia\.html">/,
  'La página pública mantiene la URL canónica oficial');
assert.match(pageRaw, /NUVIA informa, explica y calcula\.[\s\S]*Tú comprendes y decides\./,
  'El principio central canónico ocupa un bloque visible');
for (const space of [
  'Economía y finanzas',
  'Patrimonio',
  'Familia y bienestar',
  'Academia NUVIA',
  'Lecturas con Criterio',
]) {
  assert.match(pageRaw, new RegExp(`<h3>${space}</h3>`), `Puerta canónica publicada: ${space}`);
}
assert.equal((pageRaw.match(/class="about-world__item"/g) || []).length, 6,
  'La presentación conserva las cuatro webs y presenta los dos espacios comunes');
const commonStart=pageRaw.indexOf('id="about-common-title"');
assert.ok(commonStart>0,'Los espacios comunes tienen encabezado propio');
assert.equal((pageRaw.slice(0,commonStart).match(/class="about-world__item"/g)||[]).length,4,'Exactamente cuatro webs antes de los espacios comunes');
assert.match(pageRaw.slice(commonStart),/<h3>Lecturas con Criterio<\/h3>[\s\S]*<h3>Colaboradores<\/h3>/,'Los dos espacios comunes conservan su identidad');
assert.doesNotMatch(pageRaw,/cinco espacios|Cinco puertas/,'La definición refleja el ecosistema aprobado');
assert.doesNotMatch(pageRaw, /<h3>Analítica de cartera<\/h3>|<h3>Economía y mercados<\/h3>/,
  'Analítica está integrada y no quedan nombres anteriores como puertas');

console.log(`Definición NUVIA: ${publicSentences.length} enunciados canónicos presentes en ${root}.`);
