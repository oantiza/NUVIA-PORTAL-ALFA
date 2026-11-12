import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';
import {renderAcademia} from '../scripts/ecosistema/academia.mjs';
import {sites} from '../scripts/ecosistema/sitios.mjs';

const root=resolve(process.argv[2]||'.');
const academy=readFileSync(resolve(root,'academia.html'),'utf8');
const course=readFileSync(resolve(root,'curso.html'),'utf8');
class DCLogic {props={};setState(s,callback){Object.assign(this.state,s);callback?.();}}
const component=(html,window={location:{search:'',hash:''}})=>runInNewContext(html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1]+'; Component',{DCLogic,Intl,URL,URLSearchParams,React:{createElement:(type,props)=>({type,props})},window});
const Academy=component(academy), Course=component(course);
assert.ok(academy.includes("document.title = 'NUVIA · ' + this.entrada()[0]"));
assert.doesNotMatch(academy,/Academia Nuvia|seguimiento del progreso/);
assert.equal((academy.match(/<main\b/g)||[]).length,1,'Portada y contenidos comparten un único main');
assert.match(academy,/<sc-if value="\{\{ esPortada \}\}"/);
assert.match(academy,/<sc-if value="\{\{ esInteriorAcademia \}\}"/);
const homeStart='<!-- ACADEMIA PORTADA: INICIO -->', homeEnd='<!-- ACADEMIA PORTADA: FIN -->';
assert.equal(academy.split(homeStart).length,2,'Un único comienzo de la portada generada');
assert.equal(academy.split(homeEnd).length,2,'Un único final de la portada generada');
assert.equal(academy.split(homeStart)[1].split(homeEnd)[0].replaceAll('\r\n','\n'),
  '\n'+renderAcademia(sites.find(site=>site.key==='academia')).replaceAll('\r\n','\n')+'\n',
  'La rama de portada coincide con su fuente de generación');
assert.match(academy,/<a href="index.html" data-main-menu-return>Ecosistema NUVIA<\/a>/);
assert.match(academy,/href="academia.html\?tab=inicio#ruta-aprendizaje"/,'La nueva portada ofrece el recorrido completo');
assert.equal(new Academy().state.tab,'portada','Sin parámetro se presenta la nueva portada');
for(const [query,hash,expected] of [
  ['','', 'portada'],['?from=curso','', 'portada'],['?tab=portada','', 'portada'],
  ['?tab=inicio','', 'inicio'],['?tab=esenciales','', 'esenciales'],['?tab=cursos','', 'cursos'],
  ['?tab=fundamentos','', 'fundamentos'],['?tab=activos','', 'activos'],['?tab=calculadora','', 'calculadora'],
  ['?tab=interes','', 'calculadora'],['?tab=glosario','', 'glosario'],['?tab=pib','', 'pib'],
  ['','#ruta-aprendizaje','inicio'],['','#ruta-aprendizaje-titulo','inicio'],['','#glosario','glosario'],
  ['?tab=pib','#glosario','pib'],['?tab=','', 'inicio'],['?tab=desconocido','', 'inicio'],['?tab=constructor','', 'inicio'],
]) {
  const Entry=component(academy,{location:{search:query,hash}}), a=new Entry(), values=a.renderVals();
  assert.equal(a.state.tab,expected,query+hash);
  assert.equal(values.esPortada,expected==='portada');
  assert.equal(values.esInteriorAcademia,expected!=='portada');
}
let currentUrl=new URL('https://example.test/NUVIA-PORTAL-ALFA/academia.html?from=curso#ruta-aprendizaje');
const navigation={get location(){return currentUrl;},history:{replaceState(_state,_title,next){currentUrl=new URL(next,currentUrl);}},scrollTo(){}};
const RoutedAcademy=component(academy,navigation), routed=new RoutedAcademy();
routed.normalizarRutaLegada(routed.state.tab);
assert.equal(currentUrl.search,'?from=curso&tab=inicio');
assert.equal(currentUrl.hash,'#ruta-aprendizaje');
routed.abrirTab('inicio');
assert.equal(currentUrl.searchParams.get('tab'),'inicio','El recorrido conserva su ruta al recargar');
assert.equal(currentUrl.searchParams.get('from'),'curso');
assert.equal(currentUrl.hash,'');
routed.abrirTab('portada');
assert.equal(currentUrl.searchParams.has('tab'),false);
assert.equal(currentUrl.searchParams.get('from'),'curso');
const ids=[...academy.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'Las dos ramas no duplican identificadores');
assert.equal((academy.match(/id="ruta-aprendizaje"/g)||[]).length,1);
const route=academy.match(/<section id="ruta-aprendizaje"[\s\S]*?<\/section>/)[0];
assert.equal((route.match(/class="ac-learning-step"/g)||[]).length,3);
for(const tab of ['fundamentos','activos','calculadora','glosario']) assert.ok(route.includes(`href="academia.html?tab=${tab}"`));
assert.doesNotMatch(route,/<form\b|<input\b|<iframe\b/);
assert.match(route,/sin orden obligatorio ni prueba de nivel/);
for(const tab of ['inicio','cursos','esenciales','fundamentos','activos','calculadora','glosario','pib']) {
  const a=new Academy(); a.state.tab=tab;
  assert.equal(a.renderVals().mostrarRegreso,tab!=='inicio',tab);
  const titles={inicio:'Academia NUVIA',esenciales:'Conocimientos esenciales',cursos:'Cursos',fundamentos:'Fundamentos de inversión',activos:'Activos financieros',calculadora:'Interés compuesto',glosario:'Glosario financiero',pib:'El PIB, explicado desde cero'};
  assert.equal(a.renderVals().entradaTitulo,titles[tab]);
  assert.equal(a.renderVals().claseCabecera.includes('nv-entry'),tab!=='inicio');
}
assert.match(academy, /class="nv-container ac-learning-back"[\s\S]*?href="academia.html"/);
assert.ok(course.includes('href="academia.html?tab=inicio#ruta-aprendizaje"'));
assert.match(academy,/los capítulos 2 a 5 ofrecen vídeos y apuntes/);
assert.match(course,/&quot;estadoProgreso&quot;: \{[^}]*&quot;default&quot;: &quot;nuevo&quot;/);
assert.doesNotMatch(course,/Tu progreso se guarda|guardar el capítulo como completado/);
const c=new Course();
assert.equal(c.renderVals().progresoTexto,'0 %');
assert.equal(c.renderVals().pasos.length,5);
assert.match(c.renderVals().notaSeguimiento,/No se guarda el progreso/);
c.renderVals().marcarVideo();
assert.equal(c.renderVals().progresoTexto,'20 %');
assert.equal(new Course().renderVals().progresoTexto,'0 %');
for(let i=1;i<5;i++) {
  c.renderVals().capitulos[i].abrir();
  assert.equal(c.renderVals().esCapituloUno,false);
  assert.equal(c.renderVals().pasos.length,2);
  assert.match(c.renderVals().notaSeguimiento,/sin seguimiento/);
  assert.match(c.renderVals().textoCierre,/No hay actividades marcables/);
}
c.renderVals().capitulos[0].abrir();
assert.equal(c.renderVals().progresoTexto,'0 %');
for(const chapter of c.capitulosData()) assert.ok(existsSync(resolve(root,chapter.pdf)),chapter.pdf);
console.log('Academia: portada estática, rutas y alias, recorrido opcional, vistas originales, cinco PDF y progreso temporal sin marcas ficticias.');
