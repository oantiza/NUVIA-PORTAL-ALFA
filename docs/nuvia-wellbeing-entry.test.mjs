import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root=resolve(process.argv[2]||'.');
const read=(file)=>readFileSync(resolve(root,file),'utf8');
const wellbeingTopics=['respiracion-relajacion','movimiento-consciente','nutricion-equilibrada','descanso-limites-tiempo-propio'];
const titles=['Respiración y relajación','Movimiento consciente','Nutrición equilibrada','Descanso, límites y tiempo propio'];

/* Portada de Bienestar: cuatro temas en orden, fuentes y límites explícitos. */
const home=read('bienestar.html');
const cards=[...home.matchAll(/<a class="nv-space-tool-card nv-space-tool-card--photo" href="([a-z-]+)\.html">/g)].map(m=>m[1]);
assert.deepEqual(cards,wellbeingTopics,'Las cuatro tarjetas siguen el orden canónico');
for(const title of titles) assert.ok(home.includes(`<h3>${title}</h3>`),title);
assert.match(home,/Cuatro temas de cuidado cotidiano/);
assert.doesNotMatch(home,/Los cuatro pilares|Cuidar lo que no cabe en una cuenta|familia-trabajo|topic=bienestar/);
for(const url of ['https://www.who.int/es/health-topics','https://medlineplus.gov/spanish/healthtopics.html']) {
  assert.ok(home.includes(`href="${url}" target="_blank" rel="noopener noreferrer"`),url);
}
assert.match(home,/no ofrece diagnóstico, tratamiento ni consejo sanitario individual/);
assert.match(home,/ni solicita datos sobre tu salud/);
assert.match(home,/revisión profesional de su contenido sanitario antes de publicarse/);
assert.doesNotMatch(home.match(/<main\b[\s\S]*?<\/main>/)[0],/<form\b|<input\b|<textarea\b/);

/* Subsecciones: ruta de dos niveles, catálogo propio y regreso a la portada. */
for(const id of wellbeingTopics) {
  const child=read(id+'.html');
  assert.match(child,/Artículos y contenidos/);
  assert.match(child,/href="bienestar.html#pilares-bienestar"/,id+' vuelve a la portada');
  assert.doesNotMatch(child.match(/<main\b[\s\S]*?<\/main>/)[0],/topic=bienestar|familia-trabajo/,id+' no conserva el nivel retirado');
  assert.doesNotMatch(child,/data-nuvia-external-frame/,'Las subsecciones no incrustan vídeos: solo las páginas de lectura');
}

/* temas.html ya no sirve Bienestar: redirige a la portada o a la subsección. */
const topics=read('temas.html');
assert.doesNotMatch(topics,/esBienestar \}\}" hint-placeholder-val="\{\{ false \}\}">/,'temas.html no conserva bloques de Bienestar');
const redirect=topics.match(/<script>([\s\S]*?)<\/script>/)[1];
for(const id of wellbeingTopics){
  let destination;
  runInNewContext(redirect,{URL,location:{href:'https://example.test/temas.html?topic=bienestar#'+id,replace:value=>{destination=value;}}});
  assert.equal(destination,id+'.html','El acceso antiguo abre la subsección independiente');
}
{
  let destination;
  runInNewContext(redirect,{URL,location:{href:'https://example.test/temas.html?topic=bienestar',replace:value=>{destination=value;}}});
  assert.equal(destination,'https://example.test/bienestar.html','El acceso antiguo a Cuerpo, mente y salud lleva a la portada');
}

/* Artículo de Isabel Florido Mayor. */
const articlePage=read('la-respiracion-como-el-escultor-del-cerebro.html');
const essay=articlePage.match(/<article class="tm-breathing-essay[^"]*">([\s\S]*?)<\/article>/)?.[1];
assert.ok(essay,'El ensayo publicado debe estar disponible');
assert.match(essay,/Isabel Florido Mayor/);
assert.match(essay,/datetime="2026-10-02"/);
const body=essay.match(/<div class="tm-breathing-essay__text">([\s\S]*?)<\/div>/)?.[1];
assert.doesNotMatch(body,/<h[1-6]\b/,'La autora pide texto seguido sin epígrafes');
assert.match(articlePage,/<h1>La respiración como el escultor del cerebro<\/h1>/);
assert.match(essay,/<div class="tm-breathing-essay__text">\s*<p>Podemos dejar de andar/);
assert.doesNotMatch(body,/En esta serie de vídeos/,'La entradilla no forma parte del cuerpo del ensayo');
assert.match(essay,/<p class="bn-essay__lead">En esta serie de vídeos/,'La entradilla de la autora presenta el ensayo en su página de lectura');
assert.match(essay,/llevar vida directamente al corazón/);
assert.match(essay,/en la mente, que/);
assert.match(essay,/nos acompaña a diario: la respiración/);
assert.match(essay,/hablar\. ¿Podemos dejar de respirar\?/);
assert.doesNotMatch(essay,/adentro|vida llevándola|La respiración, como el equilibrio|\[equilibrio\?\]|\[llevar\?\]/);
assert.equal((essay.match(/<li>/g)||[]).length,5);
const breathingSection=read('respiracion-relajacion.html');
assert.match(breathingSection,/href="la-respiracion-como-el-escultor-del-cerebro.html"/);
assert.doesNotMatch(breathingSection,/<article class="tm-breathing-essay/);
assert.doesNotMatch(breathingSection,/En esta serie de vídeos/,'La subsección no lleva la introducción del ensayo');
assert.match(articlePage,/data-nuvia-external-frame/);
assert.match(articlePage,/href="https:\/\/youtu.be\/XOGS8dDb1_o" target="_blank" rel="noopener noreferrer"/);
console.log('Bienestar 5A-3: portada con cuatro temas, fuentes y límites, subsecciones de dos niveles y ensayo verificados.');
