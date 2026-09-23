/* Guías de jubilación (hoja de ruta y fiscalidad del rescate de EPSV). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const React = { Fragment: 'F', createElement: (t, p, ...c) => ({ t, p: p || {}, c: c.flat(Infinity) }) };
const ctx = { React, Intl, setTimeout: () => {}, document: { title: '' } }; ctx.window = ctx; ctx.globalThis = ctx;
for (const f of ['jubilacion-motor', 'jubilacion-graficos', 'jubilacion-informe', 'jubilacion-ui', 'guias-jubilacion-ui'])
  vm.runInNewContext(readFileSync(new URL(`../js/nuvia-${f}.js`, import.meta.url), 'utf8'), ctx);
const G = ctx.NuviaGuiasJubilacion;
const buscar = (n, f, out = []) => { if (n && typeof n === 'object') { if (f(n)) out.push(n); (n.c || []).forEach((k) => buscar(k, f, out)); } return out; };
const texto = (n) => typeof n === 'string' ? n : n && n.c ? n.c.map(texto).join(' ') : '';
const componente = (estado) => { const c = { state: estado, setState(o) { this.state = { ...this.state, ...o }; } }; return c; };

test('Hoja de ruta: progreso y próxima acción', () => {
  assert.equal(G.estadoPlan({}).progreso, 0);
  const e = G.estadoPlan({ horizonte: 'retired', listas: { 'retirement-age': true }, revisadas: { 0: true }, hechas: {} });
  assert.equal(e.progreso, Math.round(3 / 21 * 100));
  assert.match(e.proxima, /^Reunir: estimación de pensión pública/);
});

test('Hoja de ruta: los pasos y las casillas cambian el estado', () => {
  const c = componente({ horizonte: null, listas: {}, revisadas: {}, hechas: {}, paso: 0, decision: 0 });
  const radio = buscar(G.planificacion(c), (n) => n.t === 'button' && n.p.role === 'radio' && texto(n).includes('Menos de 5 años'))[0];
  radio.p.onClick(); assert.equal(c.state.horizonte, 'less-than-5');
  c.state.paso = 1;
  buscar(G.planificacion(c), (n) => n.p && n.p.role === 'checkbox')[0].p.onClick();
  assert.equal(Object.values(c.state.listas).filter(Boolean).length, 1);
  assert.match(G.componerPlan(c.state, 'https://x.test/'), /Mi hoja de ruta de jubilación[\s\S]*Preparación/);
});

test('Guía fiscal: caso práctico DFB con el motor del simulador', () => {
  const k = G.casoDFB();
  assert.ok(Math.abs(k.transitorio.general - (88571.43 * 0.6 + 8428.57 * 0.7)) < 0.05);
  assert.equal(k.transitorio.ahorro, 3000);
  assert.equal(k.nuevo.general, 49000);
  assert.equal(k.nuevo.ahorro, 30000);
  const c = componente({ modo: 'capital', vistaDFB: 'transitorio', check: {} });
  const arbol = G.fiscal(c);
  assert.equal(buscar(arbol, (n) => n.p && n.p.className === 'jg-check').length, 8, 'Ocho comprobaciones');
  for (const id of ['ayuda-rescate', 'fiscalidad-2026', 'tramite-administrativo', 'checklist-rescate', 'normativa-oficial'])
    assert.equal(buscar(arbol, (n) => n.p && n.p.id === id).length, 1, 'Ancla ' + id);
  assert.match(G.componerFiscal({ modo: 'renta', check: { 0: true } }, 'https://x.test/'), /1\/8[\s\S]*Renta/);
});
