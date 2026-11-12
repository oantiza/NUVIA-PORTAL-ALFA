import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const root=resolve(process.argv[2]||'.');
const academy=readFileSync(resolve(root,'academia.html'),'utf8');
const course=readFileSync(resolve(root,'curso.html'),'utf8');
class DCLogic {props={};setState(update,callback){Object.assign(this.state,update);callback?.();}}
function load(html,url) {
  let current=new URL(url);const listeners=new Map();const history=[];
  const window={get location(){return current;},history:{pushState(_s,_t,next){history.push(current.href);current=new URL(next,current);},replaceState(_s,_t,next){current=new URL(next,current);}},addEventListener(name,fn){listeners.set(name,fn);},removeEventListener(name){listeners.delete(name);},scrollTo(){}};
  const document={title:'',body:{dataset:{},classList:{toggle(){}}},getElementById(){return {scrollIntoView(){}};}};
  const Component=runInNewContext(html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1]+'; Component',{DCLogic,Intl,URL,URLSearchParams,window,document,requestAnimationFrame:fn=>fn(),React:{createElement:(type,props)=>({type,props})}});
  return {instance:new Component(),window,history,back(){current=new URL(history.pop());listeners.get('popstate')?.();}};
}
const fixture=load(academy,'https://example.test/academia.html?tab=calculadora');
const a=fixture.instance;
assert.equal(a.proyectar(a.cDefaults()).bruto,184488);
for(const [returnRate,bruto,aportado,interest] of [[6.5,184488,82000,'+102.488 €'],[-5,49049,82000,'−32.951 €'],[0,82000,82000,'0 €']]) {
  a.state.c={...a.cDefaults(),expectedReturn:returnRate};const v=a.renderVals();
  assert.equal(a.proyectar(a.c()).bruto,bruto);
  assert.equal(a.proyectar(a.c()).aportado,aportado);
  assert.equal(v.rIntereses,interest);
  for(const points of [v.lineaBruto,v.lineaAportado]) for(const pair of points.split(' ')) {
    const [x,y]=pair.split(',').map(Number);assert.ok(x>=52&&x<=632&&y>=10&&y<=204,`Fuera de escala: ${returnRate}: ${pair}`);
  }
  assert.equal(v.chartMax,returnRate<0?'82.000 €':v.rBruto);
}
for(const inflationRate of [-1,0,2]) {
  a.state.c={...a.cDefaults(),inflationRate};const v=a.renderVals();
  assert.ok(v.notaInflacion.includes(inflationRate+' %'));
  if(inflationRate<0) assert.match(v.notaInflacion,/deflación/);
  if(inflationRate>0) assert.match(v.notaInflacion,/\(inflación\)/);
  if(inflationRate===0) assert.match(v.notaInflacion,/coincide/);
  assert.doesNotMatch(v.notaFiscal,/rescatar el fondo/);
  assert.match(v.notaFiscal,/porcentaje fijo del supuesto/);
}
const glossary=load(academy,'https://example.test/academia.html?tab=glosario&lista=indicadores#termino-indicadores-ratio-de-sharpe');
const g=glossary.instance;g.componentDidMount();
assert.equal(g.state.sub,'indicadores');assert.equal(g.renderVals().terminos[1].abierto,true);
const ids=[];
for(const list of ['conceptos','indicadores']) {g.state.sub=list;const v=g.renderVals();ids.push(...v.terminos.map(t=>t.id));assert.equal(v.indiceTerminos.length,v.terminos.length);}
assert.equal(ids.length,18);assert.equal(new Set(ids).size,18);
g.abrirGlosario('conceptos',2);assert.match(glossary.window.location.href,/#termino-conceptos-riesgo$/);
glossary.back();assert.equal(g.state.sub,'indicadores');assert.equal(g.renderVals().terminos[1].abierto,true);g.componentWillUnmount();
const cfix=load(course,'https://example.test/curso.html?capitulo=2');const c=cfix.instance;c.componentDidMount();
assert.equal(c.renderVals().numeroCapitulo,'02');c.abrirCapitulo(4);assert.equal(cfix.window.location.search,'?capitulo=5');
assert.equal(c.renderVals().numeroCapitulo,'05');cfix.back();assert.equal(c.renderVals().numeroCapitulo,'02');
assert.equal(load(course,cfix.window.location.href).instance.renderVals().numeroCapitulo,'02');
c.abrirCapitulo(0);c.renderVals().calcularMapa();
const values=c.renderVals().resultados.map(r=>r.valor.replaceAll('\u00a0',' '));
assert.deepEqual([...values],['550 €','25 %','12.300 €','1,5']);
assert.equal(c.renderVals().prioridad,undefined);
assert.doesNotMatch(c.renderVals().lecturaIndicadores,/reducir|aumentar|conviene|deber|primera prioridad/i);
for(const dinero of [{income:0,essentials:10,flexible:0,debtPayment:0,savings:0,assets:0,debt:100},{income:1000,essentials:100,flexible:100,debtPayment:0,savings:5000,assets:10000,debt:0}]) {
  c.state.dinero=dinero;c.state.calculado=true;
  assert.doesNotMatch(c.renderVals().resultados.map(r=>r.ayuda).join(' '),/conviene|objetivo inicial|reduce|aumenta/i);
}
c.componentWillUnmount();
assert.match(academy,/id="simulador-interes"/);assert.match(academy,/href="#simulador-interes"/);
assert.doesNotMatch(academy,/aria-label="Áreas de Academia NUVIA" class="ac-x04"/);
assert.match(course,/Las actividades interactivas están disponibles en el capítulo 1/);
assert.doesNotMatch(course,/plantilla modernizada|Primera prioridad orientativa/);
assert.equal((course.match(/pdf: 'core\/downloads\/nuvia-academy\//g)||[]).length,5);
console.log('Academia: números preservados; signos y escala; inflación −1/0/+2; glosario enlazable; capítulos recuperables; presupuesto descriptivo.');
