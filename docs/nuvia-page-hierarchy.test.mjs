import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const root=resolve(process.argv[2]||'.');
const html=readFileSync(resolve(root,'temas.html'),'utf8');
const redirect=html.match(/<script>([\s\S]*?)<\/script>/)[1];
for(const [query,destination] of [
  ['', 'patrimonio.html'], ['?topic=patrimonio','patrimonio.html'],
  ['?topic=jubilacion','jubilacion.html'], ['?topic=vivienda','vivienda.html'],
  ['?topic=vivienda-coste-vida','vivienda.html'], ['?topic=fiscalidad','fiscalidad.html'],
  ['?topic=mis-impuestos','fiscalidad.html'], ['?topic=desconocido','patrimonio.html'],
  ['?topic=toString','patrimonio.html'],
  ['?topic=bienestar',null], ['?topic=planificacion-patrimonial',null],
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
  assert.ok(readFileSync(resolve(root,file),'utf8').includes(`id="${anchor}"`));
}
assert.equal((retirement.match(/id="familia-legado"/g)||[]).length,1);
for(const content of ['Ayuda a hijos','Educación financiera','Transmisión patrimonial']) assert.ok(retirement.includes(content));
const readings=readFileSync(resolve(root,'lecturas.html'),'utf8');
assert.doesNotMatch(readings,/\bnv-entry\b/,'Lecturas conserva su diseño independiente');
console.log('Jerarquía: alias conservan parámetros y anclas; contenido propio y excepción de Lecturas verificados.');
