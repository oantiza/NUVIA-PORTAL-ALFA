import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root=resolve(process.argv[2]||'.');
const html=readFileSync(resolve(root,'temas.html'),'utf8');
const code=html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code);
class DCLogic {props={temaInicial:'patrimonio'};setState(state){Object.assign(this.state,state);}}
const Component=runInNewContext(code+'; Component',{DCLogic,URLSearchParams,window:{location:{search:'?topic=bienestar'}}});
const model=new Component().renderVals();
assert.equal(model.titulo,'Cuerpo, mente y salud');
assert.equal(model.esBienestar,true);
assert.equal(model.mostrarSelector,false);
assert.equal(model.mostrarRegresoPatrimonio,false);
assert.equal(model.recursos.length,3);
assert.deepEqual(Array.from(model.recursos,r=>r.titulo),['Movimiento, nutrición y descanso','Calma y gestión del estrés','Familia, trabajo y tiempo propio']);
const nav=html.match(/<nav class="tm-wellbeing-nav"[\s\S]*?<\/nav>/)?.[0];
assert.ok(nav);
for(const id of ['bienestar-ambitos','respiracion-relajacion','bienestar-guias','bienestar-fuentes']) {
  assert.ok(nav.includes(`href="#${id}"`));
  assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,id);
}
const list=html.match(/<div class="tm-pillars"[\s\S]*?<\/article>/)?.[0];
assert.match(list,/role="list"/);
assert.equal((list.match(/role="listitem"/g)||[]).length,5);
assert.doesNotMatch(list,/<a\b|<button\b|tabindex=/);
assert.match(html,/Las tres guías anunciadas más abajo todavía no están publicadas/);
assert.match(html,/Tres guías en preparación/);
assert.doesNotMatch(html,/<p class="nv-eyebrow">Lecturas con criterio<\/p>/);
assert.match(html,/revisión profesional de su contenido sanitario antes de publicarse/);
assert.match(html,/no ofrece diagnóstico, tratamiento ni consejo sanitario individual/);
assert.match(html,/ni solicita datos sobre tu salud/);
assert.doesNotMatch(html.match(/<main\b[\s\S]*?<\/main>/)[0],/<form\b|<input\b|<textarea\b/);
for(const url of ['https://www.who.int/es/health-topics','https://medlineplus.gov/spanish/healthtopics.html']) {
  assert.ok(html.includes(`href="${url}" target="_blank" rel="noopener noreferrer"`));
}
assert.match(html,/href="lecturas.html" class="nv-btn nv-btn--secondary">Consultar el catálogo de lecturas/);
console.log('Bienestar 5A-3: cinco temas, tres guías pendientes, navegación, fuentes y límites explícitos.');
const essay=html.match(/<article class="tm-breathing-essay">([\s\S]*?)<\/article>/)?.[1];
assert.ok(essay,'El ensayo publicado debe estar disponible');
assert.match(essay,/Isabel Florido Mayor/);
assert.match(essay,/datetime="2026-10-02"/);
assert.equal((essay.match(/<h3>/g)||[]).length,0,'La autora pide texto seguido sin epígrafes');
assert.match(essay,/<h2 id="respiracion-title">La respiración como el escultor del cerebro<\/h2>/);
assert.match(essay,/<div class="tm-breathing-essay__text">\s*<p>En esta serie de vídeos/);
assert.match(essay,/llevar vida directamente al corazón/);
assert.match(essay,/en la mente, que/);
assert.match(essay,/nos acompaña a diario: la respiración/);
assert.match(essay,/hablar\. ¿Podemos dejar de respirar\?/);
assert.doesNotMatch(essay,/adentro|vida llevándola|La respiración, como el equilibrio/);
assert.equal((essay.match(/<li>/g)||[]).length,5);
assert.doesNotMatch(essay,/\[equilibrio\?\]|\[llevar\?\]/);
const home=readFileSync(resolve(root,'bienestar.html'),'utf8');
for(const topic of ['Movimiento consciente','Nutrición equilibrada','Respiración y relajación','Familia y trabajo','Descanso, límites y tiempo propio']) assert.ok(home.includes(`<h3>${topic}</h3>`),topic);
assert.match(home,/href="temas.html\?topic=bienestar#respiracion-relajacion"/);
assert.doesNotMatch(home,/Los cuatro pilares|Cuidar lo que no cabe en una cuenta/);
