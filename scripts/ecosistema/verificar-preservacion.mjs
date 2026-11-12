/** Auditoría de preservación contra la captura anterior a la integración.
 * Uso: node scripts/ecosistema/verificar-preservacion.mjs [raíz ...]
 * Por defecto revisa fuente y dist. Solo lee contenido; escribe el informe.
 * Requiere el snapshot local output/integracion-ecosistema-20261112/.
 * Es una comprobación local de esta migración; no forma parte de CI.
 */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import {runInNewContext} from 'node:vm';
import {restorePresentation} from './presentacion-20261112.mjs';
import {renderAcademia} from './academia.mjs';
import {sites} from './sitios.mjs';

const root=resolve(import.meta.dirname,'../..');
const evidence=resolve(root,'output/integracion-ecosistema-20261112');
const manifest=JSON.parse(await readFile(resolve(evidence,'contenido-integrado.json'),'utf8'));
const academyApproval=JSON.parse(await readFile(resolve(evidence,'academia-controlador.json'),'utf8'));
const targets=(process.argv.slice(2).length?process.argv.slice(2):['.','dist']).map(dir=>resolve(root,dir));
const read=file=>readFile(file,'utf8');
const sha=text=>createHash('sha256').update(text).digest('hex');
const main=html=>{const value=html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0];assert.ok(value,'Falta el main');return value;};
const tags=html=>[...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(match=>match[0]);
const src=tag=>tag.match(/\bsrc="([^"]+)"/)?.[1];
const inline=html=>tags(html).filter(tag=>!src(tag));
const originalScripts=html=>tags(html).filter(tag=>src(tag)!=='js/nuvia-ecosistema.js');
const controller=html=>html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const methodClass=html=>runInNewContext(controller(html)+';Component',{DCLogic:class{},URL,URLSearchParams});
const normalize=text=>text.replaceAll('\r\n','\n');
const snapshotRoot=resolve(evidence,'original');
const originalDirectories=['data','js','core/downloads'];
async function inventory(directory) {
 const files=[];
 for(const entry of await readdir(resolve(snapshotRoot,directory),{withFileTypes:true})) {
  const file=directory+'/'+entry.name;
  if(entry.isDirectory())files.push(...await inventory(file));
  else if(entry.isFile())files.push(file);
  else throw new Error('El snapshot contiene una entrada no regular: '+file);
 }
 return files.sort();
}
const assetPaths=['support.js','nuvia-site-unified.js','web2-integration.js'];
const directoryCounts={};
for(const directory of originalDirectories){const files=await inventory(directory);directoryCounts[directory]=files.length;assetPaths.push(...files);}
assetPaths.sort();
assert.equal(new Set(assetPaths).size,assetPaths.length,'El inventario no puede duplicar archivos');
const expectedAssets=[];
for(const file of assetPaths){const bytes=await readFile(resolve(snapshotRoot,file));expectedAssets.push({file,bytes,byteLength:bytes.length,sha256:sha(bytes)});}
const inventoryHash=entries=>sha(entries.map(entry=>`${entry.file}\0${entry.byteLength}\0${entry.sha256}`).join('\n'));
const baselineAssets={reference:'output/integracion-ecosistema-20261112/original',scope:['support.js','nuvia-site-unified.js','web2-integration.js',...originalDirectories.map(dir=>dir+'/**')],directoryCounts,files:expectedAssets.map(({bytes,...entry})=>entry),fileCount:expectedAssets.length,byteLength:expectedAssets.reduce((n,entry)=>n+entry.byteLength,0),inventorySha256:inventoryHash(expectedAssets)};
const report={generatedAt:new Date().toISOString(),localSnapshotRequired:true,partOfCI:false,reference:'output/integracion-ecosistema-20261112/fuentes',declaredPresentation:'contenido-integrado.json',baselineAssets,targets:[]};
assert.equal(manifest.length,23,'El inventario debe seguir incluyendo los 23 interiores/páginas comunes');
for(const target of targets){
 const result={target:relative(root,target)||'.',pages:[],academia:null};
 for(const entry of manifest){
  const row={file:entry.file,passed:false};
  try{
   const before=await read(resolve(evidence,'fuentes',entry.file));
   const after=await read(resolve(target,entry.file));
   const beforeMain=main(before),afterMain=main(after);
   assert.equal(sha(beforeMain),entry.originalMainSha256,'El snapshot no coincide con la fuente registrada');
   assert.equal(sha(afterMain),entry.integratedMainSha256,'El main no coincide con la adaptación editorial registrada');
   assert.equal(restorePresentation(afterMain,entry.changes),beforeMain,'Se alteró contenido fuera de las sustituciones declaradas');
   assert.deepEqual(tags(before).map(sha),entry.originalScripts,'El inventario original de scripts es incompleto');
   assert.deepEqual(originalScripts(after),tags(before),'Se modificó, retiró o reordenó un script original');
   assert.deepEqual(inline(after),inline(before),'Se modificó un script inline original');
   Object.assign(row,{passed:true,mainRestoredExactly:true,inlineScriptsIdentical:inline(before).length,originalScriptsPreserved:tags(before).length,presentationChanges:entry.changes.map(change=>change.id),originalMainSha256:sha(beforeMain),integratedMainSha256:sha(afterMain)});
  }catch(error){row.error=error.message;}
  result.pages.push(row);
 }
 const academy={file:'academia.html',passed:false};
 try{
  const before=await read(resolve(evidence,'fuentes/academia.html'));
  const after=await read(resolve(target,'academia.html'));
  const start='<!-- ACADEMIA ORIGINAL: INICIO -->',end='<!-- ACADEMIA ORIGINAL: FIN -->';
  assert.equal(after.split(start).length,2);assert.equal(after.split(end).length,2);
  const branch=after.split(start)[1].split(end)[0];
  const oldBreadcrumb='<a href="index.html" data-main-menu-return>Inicio</a>';
  const newBreadcrumb='<a href="index.html" data-main-menu-return>Ecosistema NUVIA</a>';
  assert.equal(branch.split(newBreadcrumb).length,2,'La excepción editorial debe aparecer exactamente una vez');
  assert.equal(branch.replace(newBreadcrumb,oldBreadcrumb),main(before).replace(/^<main\b[^>]*>/,'').replace(/<\/main>$/,''),'La rama original contiene cambios no declarados');
  const oldTags=tags(before),newTags=originalScripts(after);
  assert.equal(newTags.length,oldTags.length,'Academia ha cambiado su inventario de scripts');
  for(let i=0;i<oldTags.length;i++)if(!oldTags[i].includes('type="text/x-dc"'))assert.equal(newTags[i],oldTags[i],'Script fuera del controlador alterado');
  assert.equal(sha(controller(after)),academyApproval.controllerHashAfter,'El controlador no coincide con la versión aprobada y probada');
  assert.equal(sha(controller(before)),academyApproval.controllerHashBefore,'El controlador original no coincide con el snapshot');
  const Old=methodClass(before),New=methodClass(after);
  const routingChanges=new Set(['entrada','sincronizaEntrada','componentDidMount','abrirTab','renderVals']);
  const unchangedMethods=Object.getOwnPropertyNames(Old.prototype).filter(name=>name!=='constructor'&&!routingChanges.has(name));
  for(const name of unchangedMethods)assert.equal(normalize(New.prototype[name].toString()),normalize(Old.prototype[name].toString()),'Método original alterado: '+name);
  const oldRender=normalize(Old.prototype.renderVals.toString());
  const newRender=normalize(New.prototype.renderVals.toString()).replace("      esPortada: tab === 'portada', esInteriorAcademia: tab !== 'portada',\n",'').replace("mostrarRegreso: tab !== 'inicio' && tab !== 'portada'","mostrarRegreso: tab !== 'inicio'");
  assert.equal(newRender,oldRender,'renderVals cambió fuera de los estados de presentación');
  const homeStart='<!-- ACADEMIA PORTADA: INICIO -->',homeEnd='<!-- ACADEMIA PORTADA: FIN -->';
  assert.equal(normalize(after.split(homeStart)[1].split(homeEnd)[0]),'\n'+normalize(renderAcademia(sites.find(site=>site.key==='academia')))+'\n','La portada no coincide con la plantilla');
  Object.assign(academy,{passed:true,originalBranchRestoredExactly:true,presentationChanges:[{id:'regreso-ecosistema',before:oldBreadcrumb,after:newBreadcrumb,count:1}],controllerSha256:sha(controller(after)),controllerChangedOnlyAsApproved:true,unchangedMethods,renderValuesUnchangedExceptPresentationFlags:true,newHomeMatchesTemplate:true});
 }catch(error){academy.error=error.message;}
 result.academia=academy;
 const assetRows=[];
 for(const expected of expectedAssets){
  const row={file:expected.file,passed:false};
  try{
   const actual=await readFile(resolve(target,expected.file));
   Object.assign(row,{byteLength:actual.length,sha256:sha(actual)});
   assert.ok(actual.equals(expected.bytes),'El archivo difiere por bytes del snapshot original');
   row.passed=true;
  }catch(error){row.error=error.message;}
  assetRows.push(row);
 }
 result.originalAssets={fileCount:assetRows.length,matched:assetRows.filter(row=>row.passed).length,inventorySha256:inventoryHash(assetRows),expectedInventorySha256:baselineAssets.inventorySha256,files:assetRows};
 result.passed=result.pages.every(row=>row.passed)&&academy.passed&&assetRows.every(row=>row.passed);
 report.targets.push(result);
}
report.summary={targets:report.targets.length,interiorsChecked:report.targets.reduce((n,target)=>n+target.pages.length,0),academiaChecked:report.targets.length,originalAssetsPerTarget:baselineAssets.fileCount,originalAssetComparisons:report.targets.reduce((n,target)=>n+target.originalAssets.fileCount,0),originalAssetsInventorySha256:baselineAssets.inventorySha256,allPassed:report.targets.every(target=>target.passed),failures:report.targets.flatMap(target=>[...target.pages,target.academia,...target.originalAssets.files].filter(row=>!row.passed).map(row=>({target:target.target,file:row.file,error:row.error})))};
await mkdir(evidence,{recursive:true});
await writeFile(resolve(evidence,'preservacion.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary,null,2));
if(!report.summary.allPassed)process.exitCode=1;
