import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

// Orden del 12-11-2026: la portada común presenta cuatro webs y dos espacios
// compartidos. El recorrido anterior de Academia sigue accesible con ?tab=inicio.
const root=resolve(process.argv[2]??resolve(import.meta.dirname,'..'));
const read=file=>readFile(resolve(root,file),'utf8');
const home=await read('index.html'), academy=await read('academia.html');
const homeCss=await read('estilos/ecosistema/hub.css');
const academyCss=await read('estilos/ecosistema/academia.css');
const interiorCss=await read('estilos/ecosistema/interiores-academia.css');
const sharedCss=await read('estilos/ecosistema/webs.css');
const tokens=await read('estilos/nuvia-tokens.css');
const main=home.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
assert.ok(main,'La portada contiene su contenido principal');
assert.equal((main.match(/<h1\b/g)||[]).length,1);
assert.match(main,/<h1 id="hub-title">Todo está <em>conectado\.<\/em><\/h1>/);
assert.match(main,/<p class="hub-eyebrow">Cuatro webs\. Una misma mirada\.<\/p>/);
assert.match(main,/<nav id="webs" class="hub-stage" aria-label="Las cuatro webs de NUVIA">/);
const doors=[...main.matchAll(/<a class="hub-door\b[^>]*>[\s\S]*?<\/a>/g)].map(match=>match[0]);
assert.equal(doors.length,4,'La entrada principal contiene exactamente cuatro webs');
for(const [key,name,action] of [
  ['economia','Economía y finanzas','Entrar en Economía'],
  ['patrimonio','Patrimonio','Entrar en Patrimonio'],
  ['bienestar','Familia y bienestar','Entrar en Bienestar'],
  ['academia','Academia NUVIA','Entrar en Academia'],
]) {
  const door=doors.find(html=>html.includes(`hub-door--${key}`));
  assert.ok(door,`${key}: identidad propia`);
  assert.ok(door.includes(`href="${key}.html"`),`${key}: destino directo`);
  assert.ok(door.includes(`aria-label="${name}:`),`${key}: nombre accesible`);
  assert.ok(door.includes(`<h2>${name}</h2>`),`${key}: título legible`);
  assert.ok(door.includes(action),`${key}: acción explícita`);
  assert.equal((door.match(/<a\b/g)||[]).length,1,'Un único enlace semántico por entrada');
}
const shared=main.match(/<section class="hub-connections"[\s\S]*?<\/section>/)?.[0];
assert.ok(shared,'Lecturas y Colaboradores tienen su propio lugar común');
assert.equal((shared.match(/<a\b/g)||[]).length,2);
for(const [href,label] of [['lecturas.html','Lecturas con Criterio'],['colaboradores.html','Colaboradores']]) {
  assert.ok(shared.includes(`href="${href}">${label}`));
  assert.ok(!doors.some(door=>door.includes(`href="${href}"`)),'Los espacios comunes no se convierten en una quinta web');
}
assert.match(home,/<a[^>]*href="que-es-nuvia.html"[^>]*>Qué es NUVIA/);
assert.match(home,/href="estilos\/ecosistema\/hub.css"/);
assert.match(home,/src="js\/nuvia-ecosistema.js"/,'Se conservan los accesos históricos');
assert.doesNotMatch(home,/\sstyle=/i,'Sin estilos en línea');
assert.doesNotMatch(main,/data-macro-id=|data-daily-news|data-daily-impact|id="noticia"/,'El ecosistema no duplica herramientas ni datos de sus webs');
assert.match(main,/<div class="hub-art" aria-hidden="true">/,'La pieza central es decorativa');
assert.match(homeCss,/\.hub-page a:focus-visible\s*\{[^}]*outline:\s*3px/,'Foco visible de teclado');
assert.match(homeCss,/\.hub-door-action\s*\{[^}]*min-height:\s*44px/);
assert.match(homeCss,/\.hub-connections a\s*\{[^}]*min-height:\s*44px/);
assert.match(homeCss,/\.hub-about\s*\{[^}]*min-height:\s*48px/);
assert.match(homeCss,/\.hub-stage\s*\{[^}]*grid-template-columns:\s*290px 1fr 290px/,'Composición de escritorio alrededor de la pieza central');
assert.match(homeCss,/@media\s*\(max-width:\s*859px\)[\s\S]*?grid-template-columns:\s*1fr 1fr/,'Composición de tablet sin tapar los accesos');
assert.match(homeCss,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
for(const limit of homeCss.matchAll(/@media\s*\(max-width:\s*(\d+)px\)/g)) assert.ok(Number(limit[1])>=768,'El alcance sigue siendo escritorio y tablet');
assert.doesNotMatch(homeCss,/#[0-9a-f]{3,8}\b|rgba?\(/i,'Los colores del ecosistema proceden de tokens');
const definedTokens=new Set([...tokens.matchAll(/--([a-z0-9-]+)\s*:/gi),...homeCss.matchAll(/--([a-z0-9-]+)\s*:/gi)].map(match=>'--'+match[1]));
for(const match of homeCss.matchAll(/var\((--[a-z0-9-]+)/gi))assert.ok(definedTokens.has(match[1]),`Token existente: ${match[1]}`);
// Se protege el contraste de los textos con las superficies claras aprobadas.
const hex=name=>tokens.match(new RegExp('--nv-'+name+':\\s*(#[0-9a-f]{6})','i'))?.[1];
const lum=hex=>{const c=hex.slice(1).match(/../g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
for(const fg of ['navy-900','navy-700','green-800','green-700','bronze-700','copy'])for(const bg of ['white','paper']){
  const a=lum(hex(fg)),b=lum(hex(bg));assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${fg}/${bg}: contraste AA de texto`);
}
const assets=[
  ['index.html','conexiones.webp','f0ffd01c1d0573a703eae521fb58b922fa3a072b5dd19dc6aa6c69de8fe05436'],
  ['economia.html','economia-perspectiva.webp','60477dfdf132265f8a3a58b65fa910ae41ae68c5a707cd419673a083d609e26f'],
  ['patrimonio.html','patrimonio-hogar.webp','d2ccac26e2c41579e049011553f8e8e1ac22b042a2f3658b3c82cd8438ddd19f'],
  ['bienestar.html','bienestar-paseo.webp','ac13c912c981b6d1847d06ddbb7ff3f35b6d049ea71a597d4687b7077fc9e174'],
  ['academia.html','academia-ideas.webp','f002f277feef36983699569daa7a08a23ff00e7a718224a681caf419b79fd36b'],
];
for(const [page,name,expected]of assets){const asset='src/assets/ecosistema/'+name;assert.ok((await read(page)).includes(`src="${asset}"`),`${page}: imagen aprobada`);assert.equal(createHash('sha256').update(await readFile(resolve(root,asset))).digest('hex'),expected,`${asset}: contenido intacto`);}
assert.match(academy,/class="nv-academia-home"/);
assert.match(academy,/<h1 id="ac-title">Saber es<br>patrimonio\.<\/h1>/);
assert.match(academy,/href="academia.html\?tab=inicio#ruta-aprendizaje"/);
assert.equal((academy.match(/class="ac-def ac-def--wide ac-essential-card"/g)||[]).length,5,'Se mantienen las cinco tarjetas esenciales, incluida la lección del PIB');
assert.match(interiorCss,/\.ac-essential-card\s*\{[^}]*border-radius:[^}]*var\(--nv-surface-technical\)/,'Tarjetas esenciales adaptadas con los tokens aprobados');
assert.match(interiorCss,/\.ac-essential-card[^\n]*:focus-visible\s*\{[^}]*outline:/,'Foco visible en las tarjetas');
assert.match(sharedCss,/\.web-page :where\(svg\)/,'El reset de los iconos queda limitado a la portada');
assert.match(academyCss,/\.ac-opening h1\s*\{[^}]*var\(--nv-font-serif\)/);
const legacyHero=academy.match(/<section\b[^>]*id="academy"[\s\S]*?<\/section>/)?.[0];
assert.ok(legacyHero?.includes('nv-space-entry--academy'));
const learningRoute=academy.match(/<section\b[^>]*id="recursos-academia"[\s\S]*?<\/section>/)?.[0];
assert.ok(learningRoute?.includes('src/assets/home/academia-aula-ampliada-derecha-20260909.webp'),'El recorrido conserva su imagen junto a los materiales');
assert.match(learningRoute,/class="home26-plate__figure ac-route-photo"/,'La imagen del recorrido tiene una composición propia');
assert.doesNotMatch(legacyHero,/nv-campus-navigation|\{\{ pestanas \}\}/,'La entrada no duplica la navegación de la cabecera');
assert.match(academy,/inicio: \['Recorrido de aprendizaje'/,'El recorrido tiene un título diferente de la portada');
assert.doesNotMatch(academy,/data-academy-intro/);
const markets=await read('mercados.html');
for(const id of ['inflation-spain','euribor','ecb-rate','gdp-spain','unemployment-spain'])assert.ok(markets.includes(`data-macro-id="${id}"`),`Mercados conserva ${id}`);
console.log(`Ecosistema: cuatro webs, dos espacios comunes, imágenes aprobadas, foco, objetivos y contraste AA; Academia conserva su recorrido y sus contenidos (${root}).`);
