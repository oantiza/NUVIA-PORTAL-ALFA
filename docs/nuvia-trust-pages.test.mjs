import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const read = (file) => readFile(resolve(root, file), 'utf8');
const methodology = await read('metodologia.html');
const independence = await read('independencia.html');

for (const [file, html] of [['metodologia.html', methodology], ['independencia.html', independence]]) {
  assert.doesNotMatch(html, /name="robots"[^>]*noindex/i, `${file}: página pública e indexable`);
  assert.match(html, /<nav class="nv-breadcrumb"[^>]*>[\s\S]*?data-main-menu-return/, `${file}: regreso al inicio`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: un único título principal`);
  assert.match(html, /Contenido educativo e informativo|espacio educativo e informativo/, `${file}: alcance educativo visible`);
  assert.doesNotMatch(html, /<form\b|href="(?:mailto:|tel:)|>\s*(?:Agenda|Solicita)\s+(?:una\s+)?(?:reunión|consulta)/i,
    `${file}: sin captación o contacto comercial`);
}

for (const concept of ['fuente', 'fecha', 'fórmulas', 'supuestos', 'incertidumbre', 'revisión humana']) {
  assert.ok(methodology.toLocaleLowerCase('es').includes(concept.toLocaleLowerCase('es')),
    `Metodología explica ${concept}`);
}
assert.match(methodology, /Un dato ausente no se convierte en cero/,
  'Metodología conserva la diferencia entre ausencia y cero');
assert.match(methodology, /no determina qué decisión debe tomar una persona/,
  'Metodología no convierte el cálculo en decisión');

for (const commitment of ['no comercializa instrumentos financieros', 'Sin afiliación ni comisiones',
  'Sin recomendaciones personales', 'Sin influencia comercial', 'no se ordenan por atractivo inversor']) {
  assert.ok(independence.toLocaleLowerCase('es').includes(commitment.toLocaleLowerCase('es')),
    `Independencia declara: ${commitment}`);
}
assert.match(independence, /NUVIA no es una iniciativa de un banco, una gestora ni una plataforma de inversión/,
  'Separación profesional explícita');

let checked = 0;
for (const file of (await readdir(root)).filter((name) => name.endsWith('.html') && !name.startsWith('_'))) {
  const html = await read(file);
  if (!/<footer data-screen-label="Footer"/.test(html)) continue;
  checked++;
  const footer = html.match(/<footer data-screen-label="Footer"[\s\S]*?<\/footer>/)?.[0] || '';
  assert.match(footer, /href="metodologia\.html"/, `${file}: enlaza Metodología desde el pie`);
  assert.match(footer, /href="independencia\.html"/, `${file}: enlaza Independencia desde el pie`);
}
assert.ok(checked >= 20, 'El contrato cubre todas las páginas con pie público');

console.log(`Confianza pública: Metodología, Independencia y ${checked} pies verificados.`);
