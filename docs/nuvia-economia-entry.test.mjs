import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root=resolve(process.argv[2]||'.');
const read=file=>readFileSync(resolve(root,file),'utf8');
const markets=read('mercados.html'), portfolio=read('cartera.html');
assert.match(markets,/<h1[^>]*>Mercados y noticias<\/h1>/);
assert.doesNotMatch(markets,/class="markets-space-nav"|data-economia-area=/);
assert.match(markets,/<a href="economia.html">Economía y finanzas<\/a>/);
assert.match(markets,/id="actualidad" class="markets-area-views"/);
assert.match(markets,/aria-describedby="markets-views-label"/);
for(const name of ['description','og:description','twitter:description']) {
  const meta=markets.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]+)"`));
  assert.ok(meta?.[1].includes('Mercados y noticias en NUVIA:'),name);
}
assert.match(portfolio,/id="analysis-lead"[^>]*>Explora la composición, el riesgo y los escenarios/);
assert.match(portfolio,/id="analysis-current"/);
const availability=portfolio.match(/<p class="nuvia-analysis-availability">([^<]+)<\/p>/)?.[1];
assert.ok(availability,'Aviso de procedencia presente');
for(const text of ['Alfa en abierto y sin cuentas.', 'Cartera y fundamentales consultan la base propia.',
  'En empresas se identifica cualquier respaldo local, que puede estar desactualizado.',
  'Los datos no son en tiempo real.', 'no determina qué inversión elegir']) {
  assert.ok(availability.includes(text),`El aviso debe explicar: ${text}`);
}
assert.doesNotMatch(availability,/instantánea local|actualizados en tiempo real|siempre actualizados/,
  'No confundir el respaldo con la fuente principal ni prometer datos en directo');
assert.doesNotMatch(portfolio,/algunas requieren acceso autorizado/);
for(const [id,href] of [['portfolio','cartera.html?vista=portfolio#laboratorio'],['models','cartera.html?vista=models#carteras-modelo'],['companies','cartera.html?vista=companies#suite-nuvia']]) {
  assert.ok(portfolio.includes(`id="vista-${id}" href="${href}"`),id);
}
assert.match(portfolio,/data-src="company-analysis\/index.html"/);
const code=markets.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code,'Controlador de vistas conservado');
// Título de pestaña y titular siguen a la vista elegida.
const TEXTOS_VISTA={
  portada:{title:'NUVIA · Mercados y noticias',h1:'Mercados y noticias'},
  informes:{title:'NUVIA · Informes de mercado',h1:'Informes'},
  cotizaciones:{title:'NUVIA · Mercados y cotizaciones',h1:'Mercados y cotizaciones'}
};
function controller(query='',actions=[]) {
  const h1={textContent:'Mercados y noticias'};
  const document={title:'',getElementById:id=>id==='mercados-titular'?h1:null};
  class DCLogic { setState(state){Object.assign(this.state,state);} }
  const Component=runInNewContext(code+'; Component',{DCLogic,document,URLSearchParams,window:{location:{search:query,reload:()=>actions.push('reload'),assign:url=>actions.push(url)},history:{replaceState:(_state,_title,url)=>actions.push(url)},scrollTo:()=>{}}});
  const c=new Component(); c.componentDidMount();
  const esperado=TEXTOS_VISTA[c.state.vista];
  assert.equal(document.title,esperado.title,`Título tras montar: ${query||'portada'}`);
  assert.equal(h1.textContent,esperado.h1,`Titular tras montar: ${query||'portada'}`);
  c.document=document; c.h1=h1;
  return c;
}
for(const [query,view] of [['','portada'],['portada','portada'],['informes','informes'],['cotizaciones','cotizaciones'],['diario','portada'],['archivo','informes'],['semanal','cotizaciones'],['desconocido','portada']]) {
  const c=controller('?vista='+query);
  assert.equal(c.state.vista,view,query);
  c.renderVals(); // Las tres vistas y los alias siguen pudiendo producir contenido.
}
const c=controller();
for(const view of ['informes','cotizaciones','portada']) {
  c.ir(view);assert.equal(c.state.vista,view);c.renderVals();
  c.componentDidUpdate(); // React lo llama tras cada setState.
  assert.equal(c.document.title,TEXTOS_VISTA[view].title,`Título al cambiar a ${view}`);
  assert.equal(c.h1.textContent,TEXTOS_VISTA[view].h1,`Titular al cambiar a ${view}`);
}
for(const view of ['informes','cotizaciones']) {
  const actions=[], current=controller('',actions);
  current.ir(view); current.renderVals().abrirActualidad({preventDefault:()=>actions.push('prevent')});
  assert.deepEqual(actions,['prevent','mercados.html#actualidad','reload'],'El acceso recupera el arranque editorial, no la plantilla sin hidratar');
  const queryActions=[], withQuery=controller('?vista='+view,queryActions);
  withQuery.renderVals().abrirActualidad({preventDefault:()=>queryActions.push('prevent')});
  assert.deepEqual(queryActions,[],'Desde otra URL se conserva la navegación nativa');
  withQuery.renderVals().vistas[0].abrir();
  assert.deepEqual(queryActions,['mercados.html'],'La pestaña de noticias también recupera el contenido fechado');
}
assert.match(code,/\['portada', 'Noticias y contexto'\]/);
console.log('Economía 5A-2: cabecera especializada, tres vistas y alias, metadatos y empresas dentro de Cartera.');
