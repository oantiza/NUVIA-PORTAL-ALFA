import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const root=resolve(process.argv[2]||'.');
const html=readFileSync(resolve(root,'temas.html'),'utf8');
const redirect=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ecosystemNavigation=readFileSync(resolve(root,'js/nuvia-ecosistema.js'),'utf8');
/* Las portadas conservan los fragmentos antiguos mediante el controlador.
   Se ejecuta el código real y se exige el destino existente, tanto al cargar
   como al cambiar el hash: no basta con admitir que desaparezca el id antiguo. */
function legacyAnchor(route, bodyClass, targetSelector) {
  const url=new URL('https://example.test/NUVIA-PORTAL-ALFA/'+route);
  const events=new Map();
  const scrolls=[];
  let replacement=null;
  const location={href:url.href,hash:url.hash,search:url.search,replace:value=>{replacement=value;}};
  const document={
    currentScript:{src:'https://example.test/NUVIA-PORTAL-ALFA/js/nuvia-ecosistema.js'},
    body:{classList:{contains:className=>className===bodyClass},dataset:{}},
    addEventListener(){},
    querySelector:selector=>selector===targetSelector?{scrollIntoView:options=>scrolls.push([selector,options.block])}:null,
  };
  runInNewContext(ecosystemNavigation,{URL,URLSearchParams,document,
    window:{location,addEventListener:(name,callback)=>events.set(name,callback)},
    requestAnimationFrame:callback=>callback(),
  });
  return {scrolls,replacement,changeHash:()=>events.get('hashchange')?.()};
}
for(const [query,destination] of [
  ['', 'patrimonio.html'], ['?topic=patrimonio','patrimonio.html'],
  ['?topic=jubilacion','jubilacion.html'], ['?topic=vivienda','vivienda.html'],
  ['?topic=vivienda-coste-vida','vivienda.html'], ['?topic=fiscalidad','fiscalidad.html'],
  ['?topic=mis-impuestos','fiscalidad.html'], ['?topic=desconocido','patrimonio.html'],
  ['?topic=toString','patrimonio.html'],
  ['?topic=bienestar','bienestar.html'], ['?topic=planificacion-patrimonial',null],
]) {
  let result=null;
  const href='https://example.test/NUVIA-PORTAL-ALFA/temas.html'+query+(query?'&':'?')+'territorio=bizkaia#familia-legado';
  runInNewContext(redirect,{URL,location:{href,replace:value=>{result=value;}}});
  if(destination) assert.equal(result,`https://example.test/NUVIA-PORTAL-ALFA/${destination}?territorio=bizkaia#familia-legado`);
  else assert.equal(result,null,'Las páginas hijas con contenido propio permanecen accesibles');
}
const retirement=readFileSync(resolve(root,'jubilacion.html'),'utf8');
for(const [route,expected] of [
  ['temas.html#patrimonio-ambitos','patrimonio.html#recursos-patrimonio'],
  ['temas.html?topic=jubilacion#herramientas','jubilacion.html#seguir-jubilacion'],
]) {
  let result;
  runInNewContext(redirect,{URL,location:{href:'https://example.test/'+route,replace:value=>{result=value;}}});
  assert.equal(result,'https://example.test/'+expected,'El ancla antigua llega al contenido equivalente');
  const [file,anchor]=expected.split('#');
  const source=readFileSync(resolve(root,file),'utf8');
  if(file==='patrimonio.html') {
    assert.ok(source.includes('id="recursos"'),'El área equivalente sigue existiendo');
    const actual=legacyAnchor(`${file}#${anchor}`,'web-page--patrimonio','#recursos');
    assert.deepEqual(actual.scrolls,[['#recursos','start']],'El fragmento antiguo llega a los recursos aprobados');
    actual.changeHash();
    assert.equal(actual.scrolls.length,2,'La compatibilidad también funciona en hashchange');
  } else assert.ok(source.includes(`id="${anchor}"`));
}
assert.equal((retirement.match(/id="familia-legado"/g)||[]).length,1);
for(const content of ['Ayuda a hijos','Educación financiera','Transmisión patrimonial']) assert.ok(retirement.includes(content));
const readings=readFileSync(resolve(root,'lecturas.html'),'utf8');
assert.doesNotMatch(readings,/\bnv-entry\b/,'Lecturas conserva su diseño independiente');
assert.ok(readFileSync(resolve(root,'index.html'),'utf8').includes('id="webs"'));
assert.deepEqual(legacyAnchor('index.html#espacios','hub-page','#webs').scrolls,[['#webs','start']]);
for (const [fragment, tab] of [['ruta-aprendizaje','inicio'],['ruta-aprendizaje-titulo','inicio'],['glosario','glosario']]) {
  const result=legacyAnchor(`academia.html?origen=legado#${fragment}`,'web-page--academia',null);
  assert.equal(result.replacement,`https://example.test/NUVIA-PORTAL-ALFA/academia.html?origen=legado&tab=${tab}#${fragment}`,'Academia conserva parámetros y fragmentos en sus vistas originales');
}
console.log('Jerarquía: alias y fragmentos conservados, cuatro webs, recorrido original de Academia y excepción de Lecturas verificados.');
