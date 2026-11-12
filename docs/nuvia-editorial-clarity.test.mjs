import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=resolve(process.argv[2]||'.');
const read=file=>readFileSync(resolve(root,file),'utf8');
const hash=text=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
const main=file=>read(file).match(/<main\b[\s\S]*?<\/main>/)[0];

// Huellas de los textos firmados anteriores a la reorganización del 12-11-2026.
// Solo se abstraen CRLF/LF para que el contrato sea idéntico en Windows y Linux.
const essays={
 'la-respiracion-como-el-escultor-del-cerebro.html':'1228a1e95b402898984b199275f3014a12a7fc36d2da0eaaef533701d8b9d6e4',
 'que-es-meditar.html':'f6dbbb597ec5a191a553b50b22c9f9f69cf2e9d7009267753dbfd70527d48c07',
};
for(const [file,expected] of Object.entries(essays)){
 const html=main(file),essay=html.match(/<article class="tm-breathing-essay[\s\S]*?<\/article>/)[0];
 assert.equal(hash(essay),expected,file+': texto, firma, fecha y entradilla de autora íntegros');
 assert.ok(html.indexOf('class="bn-editorial-intro"')<html.indexOf(essay),'Contexto antes del ensayo');
 assert.ok(html.indexOf('id="notas-editoriales"')>html.indexOf(essay),'Notas completas después del ensayo');
 assert.match(html,/href="#notas-editoriales"/,'Acceso directo al alcance y fuentes');
 assert.equal((html.match(/data-nuvia-external-frame/g)||[]).length,1,'Un solo vídeo voluntario');
 assert.doesNotMatch(html,/<iframe\b/,'No hay conexión inicial al reproductor externo');
}

const readings=main('lecturas.html');
assert.ok(readings.indexOf('id="seleccion-lecturas"')<readings.indexOf('class="nv-container nv-library-welcome"'),'Catálogo antes de la bienvenida conservada');
const bookHashes=[...readings.matchAll(/<article class="lecturas-card"[\s\S]*?<\/article>/g)].map(m=>hash(m[0]));
assert.deepEqual(bookHashes,[
 '96ba20470c28ec938e375603481adc3f24a757eaee2592980bb8350cc55ecc44',
 '708ea8797f6057847e7ecd07f048c3f477d45febf642af293182c4f23a09a63a',
 'dc28613c2502b576f1618b4def574a535f04407631d254bbe334ef6c8b32d304',
 '2484c1556e0a4c904206ee3e6b39c69ee07609e31c6129f29e18d2acd80d99ec',
],'Las cuatro fichas conservan íntegros contenido, enlaces y orden');
assert.equal((readings.match(/data-reading-collection=/g)||[]).length,3,'Los tres accesos temáticos siguen disponibles');

const wellbeing=main('bienestar.html');
assert.ok(wellbeing.indexOf('id="lecturas-bienestar"')<wellbeing.indexOf('id="recursos"'),'Ensayos disponibles antes de temas');
assert.equal((wellbeing.match(/<article class="bi-topic"/g)||[]).length,4,'Conserva cuatro temas');
assert.equal((wellbeing.match(/<span class="bi-status">Artículos en preparación<\/span>/g)||[]).length,3,'La disponibilidad de los tres temas pendientes es explícita');
for(const statement of ['no ofrece diagnóstico, tratamiento ni consejo sanitario individual','ni solicita datos sobre tu salud','revisión profesional de su contenido sanitario antes de publicarse','No implica un aval de la institución a NUVIA'])assert.ok(wellbeing.includes(statement),statement);

const contributors=main('colaboradores.html');
const people=contributors.slice(0,contributors.indexOf('id="areas-de-trabajo"'));
const areas=contributors.slice(contributors.indexOf('id="areas-de-trabajo"'));
for(const person of ['Óscar Antiza','Isabel Florido Mayor'])assert.ok(people.includes(`<h3>${person}</h3>`),person+' con ficha de persona');
for(const area of ['Equipo Cuantitativo','Comité Didáctico'])assert.ok(areas.includes(`<h3>${area}</h3>`),area+' en áreas de trabajo');
assert.match(contributors,/id="isabel-florido"/,'Permanece el destino de las firmas');
assert.doesNotMatch(contributors,/<form\b|href="mailto:|href="tel:/,'Sin nuevas vías comerciales');

const about=main('que-es-nuvia.html');
assert.ok(about.indexOf('id="about-start"')<about.indexOf('id="about-conviction"'),'Ejemplos de utilidad antes del manifiesto');
for(const destination of ['vivienda.html#simulador-vivienda','jubilacion.html','academia.html?tab=esenciales'])assert.ok(about.includes(`href="${destination}"`),'Ejemplo existente: '+destination);
const methodology=main('metodologia.html');
for(const destination of ['mercados.html','vivienda.html#como-funciona-vivienda','academia.html?tab=pib#pib-fuentes'])assert.ok(methodology.includes(`href="${destination}"`),'Ejemplo de método: '+destination);
assert.match(read('vivienda.html'),/id="como-funciona-vivienda"/);
assert.match(read('academia.html'),/id="pib-fuentes"/);
console.log('Claridad editorial: autora y fichas íntegras, material disponible primero, atribuciones y ejemplos verificables.');
