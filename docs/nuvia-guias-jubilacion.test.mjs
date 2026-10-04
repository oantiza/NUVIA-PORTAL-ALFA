/* Guías de jubilación (hoja de ruta y fiscalidad del rescate de la EPSV o del
   plan de pensiones) en los cinco territorios. Los casos prácticos se
   contrastan con cálculos a mano, no con la salida del motor. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const React = { Fragment: 'F', createElement: (t, p, ...c) => ({ t, p: p || {}, c: c.flat(Infinity) }) };
const ctx = { React, Intl, setTimeout: () => {}, document: { title: '' } }; ctx.window = ctx; ctx.globalThis = ctx;
for (const f of ['jubilacion-fiscal', 'jubilacion-motor', 'jubilacion-graficos', 'jubilacion-informe', 'jubilacion-ui', 'guias-jubilacion-ui'])
  vm.runInNewContext(readFileSync(new URL(`../js/nuvia-${f}.js`, import.meta.url), 'utf8'), ctx);
const G = ctx.NuviaGuiasJubilacion;
const F = ctx.NuviaJubilacionFiscal;
const UI = ctx.NuviaJubilacionUI;
const buscar = (n, f, out = []) => { if (n && typeof n === 'object') { if (f(n)) out.push(n); (n.c || []).forEach((k) => buscar(k, f, out)); } return out; };
const texto = (n) => typeof n === 'string' ? n : n && n.c ? n.c.map(texto).join(' ') : '';
const componente = (estado) => { const c = { state: estado, setState(o) { this.state = { ...this.state, ...o }; } }; return c; };
const conTerritorio = (estado, t, ccaa) => Object.assign(estado, { territorio: t, ccaa: ccaa || 'referencia', avisoTerritorio: null });
const cerca = (a, b, tol = 0.05, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} ≠ ${b}`);

test('Hoja de ruta: progreso y próxima acción', () => {
  assert.equal(G.estadoPlan({}).progreso, 0);
  const e = G.estadoPlan({ horizonte: 'retired', listas: { 'retirement-age': true }, revisadas: { 0: true }, hechas: {} });
  assert.equal(e.progreso, Math.round(3 / 21 * 100));
  assert.match(e.proxima, /^Reunir: estimación de pensión pública/);
});

test('Hoja de ruta: los pasos y las casillas cambian el estado', () => {
  const c = componente(conTerritorio({ horizonte: null, listas: {}, revisadas: {}, hechas: {}, paso: 0, decision: 0 }, 'bizkaia'));
  const radio = buscar(G.planificacion(c), (n) => n.t === 'button' && n.p.role === 'radio' && texto(n).includes('Menos de 5 años'))[0];
  radio.p.onClick(); assert.equal(c.state.horizonte, 'less-than-5');
  c.state.paso = 1;
  buscar(G.planificacion(c), (n) => n.p && n.p.role === 'checkbox')[0].p.onClick();
  assert.equal(Object.values(c.state.listas).filter(Boolean).length, 1);
  assert.match(G.componerPlan(c.state, 'https://x.test/'), /Mi hoja de ruta de jubilación[\s\S]*Preparación/);
});

test('Hoja de ruta: conserva el territorio en los enlaces y lo muestra en el selector', () => {
  const c = componente(conTerritorio({ horizonte: null, listas: {}, revisadas: {}, hechas: {}, paso: 0, decision: 0 }, 'navarra'));
  const arbol = G.planificacion(c);
  const enlaces = buscar(arbol, (n) => n.t === 'a' && /^(jubilacion|guia-fiscal)\.html/.test(n.p.href || '')).map((a) => a.p.href);
  assert.ok(enlaces.length >= 2 && enlaces.every((h) => /territorio=navarra/.test(h)), enlaces.join(' '));
  assert.equal(buscar(arbol, (n) => n.p && n.p.className === 'jb-terr jb-terr--compacto').length, 1, 'Selector compacto');
  assert.match(texto(arbol), /plan de pensiones/);
  const est = componente(conTerritorio({ horizonte: null, listas: {}, revisadas: {}, hechas: {}, paso: 0, decision: 0 }, 'estatal', 'referencia'));
  assert.ok(buscar(G.planificacion(est), (n) => n.t === 'a' && /guia-fiscal\.html\?territorio=estatal&ccaa=referencia/.test(n.p.href || '')).length);
});

test('Guía fiscal · Bizkaia: caso práctico DFB con el motor del simulador', () => {
  const k = G.casoDFB();
  assert.ok(Math.abs(k.transitorio.general - (88571.43 * 0.6 + 8428.57 * 0.7)) < 0.05);
  assert.equal(k.transitorio.ahorro, 3000);
  assert.equal(k.nuevo.general, 49000);
  assert.equal(k.nuevo.ahorro, 30000);
  const c = componente(conTerritorio({ modo: 'capital', vistaDFB: 'transitorio', check: {} }, 'bizkaia'));
  const arbol = G.fiscal(c);
  assert.equal(buscar(arbol, (n) => n.p && n.p.className === 'jg-check').length, 8, 'Ocho comprobaciones');
  for (const id of ['ayuda-rescate', 'fiscalidad-2026', 'tramite-administrativo', 'checklist-rescate', 'normativa-oficial'])
    assert.equal(buscar(arbol, (n) => n.p && n.p.id === id).length, 1, 'Ancla ' + id);
  assert.match(texto(arbol), /Caso práctico DFB 2026/);
  assert.ok(buscar(arbol, (n) => n.t === 'a' && n.p.href === 'jubilacion.html?caso=dfb&territorio=bizkaia').length, 'Enlace al caso en el simulador');
  assert.match(G.componerFiscal(c.state, 'https://x.test/'), /0\/8[\s\S]*Bizkaia/);
  assert.match(G.componerFiscal({ ...c.state, modo: 'renta', check: { 0: true } }, 'https://x.test/'), /1\/8[\s\S]*Renta/);
});

test('Guía fiscal · Álava y Gipuzkoa: ejemplo ficticio identificado, tope del 40 % en la exención y sin caso DFB', () => {
  // Ejemplo ficticio: 120.000 € = 70.000 aportados + 30.000 de rentabilidad hasta 2025, 15.000 + 5.000 desde 2026.
  // Transitorio: 120.000 × 70.000/85.000 = 98.823,53 al 60 % = 59.294,12; del resto (21.176,47), 5.000 al ahorro y 16.176,47 al 70 % = 11.323,53 → general 70.617,65.
  // Régimen 2026: rentabilidad 35.000 al ahorro; 85.000 × 70 % = 59.500 a la general.
  for (const t of ['alava', 'gipuzkoa']) {
    const caso = G.casoDe(F.configuracion(t));
    assert.equal(caso.oficial, false);
    cerca(caso.vistas.transitorio.general, 70617.65, .05, t); cerca(caso.vistas.transitorio.ahorro, 5000, .01, t);
    cerca(caso.vistas.nuevo.general, 59500, .01, t); cerca(caso.vistas.nuevo.ahorro, 35000, .01, t);
    cerca(caso.vistas.renta15.exento, 35000, .01, t + ': 35.000 < 40 % de 120.000, exención completa');
    const c = componente(conTerritorio({ modo: 'renta', vistaDFB: 'transitorio', check: {} }, t));
    const txt = texto(G.fiscal(c));
    assert.doesNotMatch(txt, /DFB/, t + ': el caso de la DFB solo se muestra en Bizkaia');
    assert.match(txt, /Ejemplo ficticio/); assert.match(txt, /hasta el 40 % de la renta/);
    assert.ok(buscar(G.fiscal(c), (n) => n.t === 'a' && n.p.href === 'jubilacion.html?territorio=' + t).length, 'Enlace al simulador con territorio');
    assert.ok(buscar(G.fiscal(c), (n) => n.t === 'a' && /araba\.eus|gipuzkoa\.eus/.test(n.p.href || '')).length >= 3, 'Fuentes oficiales propias');
  }
  // Bizkaia no tiene tope: la matriz dice «Exenta» sin paréntesis.
  assert.equal(G.tratamiento(F.configuracion('bizkaia'), F.textos(F.configuracion('bizkaia'))).filas[0].re[1], 'Exenta');
});

test('Guía fiscal · Navarra y estatal: planes de pensiones, reducción del 40 % y ejemplo verificable', () => {
  // Ejemplo ficticio: 100.000 € de derechos, 60.000 de aportaciones anteriores a la fecha de corte. Reducción 40 % × 60.000 = 24.000 → base general 76.000.
  for (const [t, corte, dt] of [['navarra', 2018, 'DT 25'], ['estatal', 2007, 'DT 12']]) {
    const cfg = F.configuracion(t); const caso = G.casoDe(cfg);
    assert.equal(caso.oficial, false);
    cerca(caso.vistas.reduccion.general, 76000); cerca(caso.vistas.reduccion.exento, 24000); cerca(caso.vistas.renta.general, 100000);
    const c = componente(conTerritorio({ modo: 'mixta', vistaDFB: 'transitorio', check: {} }, t));
    const arbol = G.fiscal(c); const txt = texto(arbol);
    assert.doesNotMatch(txt, /EPSV/, t + ': habla de planes de pensiones');
    assert.match(txt, new RegExp('anteriores a ' + corte));
    assert.match(txt, /plan de pensiones/);
    assert.equal(buscar(arbol, (n) => n.p && n.p.className === 'jg-check').length, 8);
    const matriz = buscar(arbol, (n) => n.p && n.p.className === 'jg-matrix__row' && n.p.role === 'row');
    assert.equal(matriz.length, 3, 'Mixta muestra las tres filas del modelo con reducción');
    assert.equal(G.checklist(cfg, F.textos(cfg))[1], 'Tengo el desglose anterior y posterior a ' + corte + '.');
    assert.match(G.componerFiscal(c.state, 'https://x.test/'), new RegExp(dt.replace('.', '\\.') + '|anteriores a ' + corte));
    assert.ok(txt.includes('15 días hábiles') && txt.includes('7 días hábiles'), t + ': plazos del art. 10 del RD 304/2004');
    assert.ok(!/Plazos de pago\s*En preparación/.test(txt), t + ': los plazos ya no están en preparación');
  }
  assert.match(texto(G.fiscal(componente(conTerritorio({ modo: 'capital', check: {} }, 'estatal', 'referencia')))), /art\. 65/);
});

test('Guía fiscal: territorio desde la URL, comunidad en preparación y parámetros desconocidos', () => {
  assert.equal(JSON.stringify(G.territorioInicial('?territorio=gipuzkoa')), JSON.stringify({ territorio: 'gipuzkoa', ccaa: 'referencia', avisoTerritorio: null }));
  assert.equal(G.territorioInicial('').territorio, 'bizkaia', 'Sin parámetro, Bizkaia por defecto');
  const raro = G.territorioInicial('?territorio=lunar');
  assert.equal(raro.territorio, null); assert.match(raro.avisoTerritorio, /No reconocemos el territorio/);
  const txt = texto(G.fiscal(componente(Object.assign({ modo: 'capital', check: {} }, raro))));
  assert.match(txt, /Residencia fiscal sin determinar/); assert.doesNotMatch(txt, /Caso práctico/);
  const madrid = componente(Object.assign({ modo: 'capital', check: {} }, G.territorioInicial('?territorio=estatal&ccaa=madrid')));
  const tm = texto(G.fiscal(madrid));
  assert.match(tm, /En preparación/); assert.doesNotMatch(tm, /Ejemplo ficticio/);
  assert.equal(buscar(G.fiscal(madrid), (n) => n.t === 'select').length, 1, 'El selector de comunidad sigue disponible');
});

test('Simulador: selector de residencia, caso DFB solo en Bizkaia y previsión que no se mezcla al cambiar', () => {
  const s0 = UI.estadoInicial();
  const nav = UI.desdeURL(s0, '?territorio=navarra&caso=dfb');
  assert.equal(nav.s.territorio, 'navarra'); assert.equal(nav.s.tieneEpsv, false); assert.match(nav.aviso, /solo se carga con la residencia fiscal en Bizkaia/);
  const biz = UI.desdeURL(s0, '?caso=dfb');
  assert.equal(biz.s.territorio, 'bizkaia'); assert.equal(biz.s.epsvPre, 89000); assert.equal(biz.paso, 2);
  const cambiado = UI.cambiarTerritorio(biz.s, 'alava');
  assert.equal(cambiado.territorio, 'alava'); assert.equal(cambiado.tieneEpsv, false, 'El caso DFB no viaja a Álava'); assert.equal(cambiado.casoDfb, false);
  const conEpsv = Object.assign({}, s0, { tieneEpsv: true, epsvPre: 50000, epsvPreRent: 10000 });
  assert.equal(UI.cambiarTerritorio(conEpsv, 'gipuzkoa').epsvPre, 50000, 'Entre territorios del mismo modelo se conservan los datos');
  assert.equal(UI.cambiarTerritorio(conEpsv, 'estatal').epsvPre, 0, 'Al cambiar de modelo la previsión vuelve a cero');
  assert.equal(UI.cambiarTerritorio(conEpsv, 'estatal').ccaa, 'referencia');
  assert.equal(UI.urlCon('guia-fiscal.html', { territorio: 'estatal', ccaa: 'referencia' }), 'guia-fiscal.html?territorio=estatal&ccaa=referencia');
  assert.equal(UI.urlCon('jubilacion.html?caso=dfb', { territorio: 'bizkaia' }), 'jubilacion.html?caso=dfb&territorio=bizkaia');
  const comp = componente({ s: Object.assign(UI.estadoInicial(), { territorio: 'estatal', ccaa: 'madrid' }), paso: 0, vista: 'hoy', sel: 0 });
  const arbol = UI.render(comp); const txt = texto(arbol);
  assert.match(txt, /En preparación/); assert.equal(buscar(arbol, (n) => n.p && n.p.className === 'jb-live__num').length, 0, 'Sin cifras cuando no calcula');
  buscar(arbol, (n) => n.t === 'button' && texto(n).includes('Calcular con la escala de referencia'))[0].p.onClick();
  assert.equal(comp.state.s.ccaa, 'referencia');
  assert.equal(buscar(UI.render(comp), (n) => n.p && n.p.className === 'jb-live__num').length, 1);
  for (const t of ['bizkaia', 'alava', 'gipuzkoa', 'navarra', 'estatal']) {
    const c = componente({ s: Object.assign(UI.estadoInicial(), { territorio: t, tieneEpsv: true, epsvPre: 40000, epsvPreRent: 10000, epsvPost: 10000, epsvPostRent: 1000, epsvCobro: 'mixto' }), paso: 2, vista: 'hoy', sel: 0 });
    const tx = texto(UI.render(c));
    assert.equal(/Cargar el caso práctico de la DFB/.test(tx), t === 'bizkaia', t + ': botón del caso DFB');
    assert.ok(tx.includes(F.configuracion(t).hacienda), t + ': nombra su Hacienda');
    assert.ok(tx.includes('Fuentes oficiales (consultadas el 04-10-2026)'), t + ': fuentes con fecha');
    const inf = ctx.NuviaJubilacionInforme.componer(c._cache.r, { base: 'https://x.test/' });
    assert.ok(inf.includes(F.configuracion(t).irpf) && inf.includes('Límites de esta estimación'), t + ': informe con territorio y límites');
  }
});
