import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {projectAlphaCompany} from '../company-analysis/alfa/project.mjs';

test('ratios muestran su periodo junto al valor sin confundir instantánea y ejercicio ni mutar cifras', async t=>{
  const originalError=console.error;
  t.mock.method(console,'error',(...args)=>{if(!String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server'))originalError(...args);});
  const {createServer}=await import('../company-analysis/node_modules/vite/dist/node/index.js');
  const React=(await import('../company-analysis/node_modules/react/index.js')).default;
  const {renderToStaticMarkup}=await import('../company-analysis/node_modules/react-dom/server.node.js');
  const server=await createServer({configFile:false,envDir:false,root:fileURLToPath(new URL('../company-analysis/',import.meta.url)),server:{middlewareMode:true,watch:null,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
  try{
    const {CompanySummary,CompanyRatios}=await server.ssrLoadModule('/src/alfa/CompanyReport.jsx');
    const {CompanyIdentityNotice}=await server.ssrLoadModule('/src/alfa/App.jsx');
    const yearly={'2025-06-30':{date:'2025-06-30',currency_symbol:'EUR',totalRevenue:2000,netIncome:286}};
    const company=projectAlphaCompany({General:{Code:'TEST',Type:'Common Stock',Exchange:'MC',Name:'Empresa de prueba',ISIN:'ES0000000001',CurrencyCode:'EUR',UpdatedAt:'2026-11-12'},Highlights:{ProfitMargin:.159,ReturnOnEquityTTM:0},Valuation:{PriceBookMRQ:1},Financials:Object.fromEntries(['Income_Statement','Balance_Sheet','Cash_Flow'].map(key=>[key,{currency_symbol:'EUR',yearly:structuredClone(yearly)}]))},'TEST.MC');
    const before=structuredClone(company);
    const render=component=>renderToStaticMarkup(React.createElement(component,{company}));
    const card=(html,label)=>html.split('<div class="kpi">').slice(1).find(part=>part.includes(`<span>${label}</span>`));
    const annual=card(render(CompanySummary),'Margen neto');
    assert.ok(annual);assert.match(annual,/14,3 %/);
    assert.match(annual,/Ejercicio cerrado: 30 jun 2025/);
    assert.match(annual,/Fuente: EODHD · cuentas anuales/);
    assert.doesNotMatch(annual,/12 nov 2026/,'La actualización del proveedor no pasa a ser el cierre del ejercicio');
    const snapshot=card(render(CompanyRatios),'Margen neto');
    assert.match(snapshot,/15,9 %/);
    assert.match(snapshot,/Periodo no informado · cierre no informado/);
    assert.match(snapshot,/Fuente: EODHD · instantánea/);
    assert.doesNotMatch(snapshot,/30 jun 2025|12 nov 2026/,'No atribuye al ratio ni el cierre anual ni la fecha de actualización');
    assert.match(card(render(CompanyRatios),'ROE'),/0,0 %/,'El cero sigue siendo cero');
    assert.match(card(render(CompanyRatios),'ROE'),/Últimos doce meses · cierre no informado/);
    assert.deepEqual(company,before,'La presentación no modifica la ficha ni los cálculos');

    company.statements.Income_Statement.rows=[];
    company.metrics.ProfitMargin=null;
    company.source.provider=null;
    assert.match(card(render(CompanySummary),'Margen neto'),/Ejercicio no disponible/);
    assert.match(card(render(CompanySummary),'Margen neto'),/>—</,'La ausencia no se convierte en cero');
    assert.match(card(render(CompanyRatios),'Margen neto'),/Fuente: no informada · instantánea/);
    assert.match(card(render(CompanyRatios),'Margen neto'),/>—</);

    const entry={state:'isin_conflict',isin:'ES0000000001',symbol:'TEST.MC',identityCandidates:[{symbol:'OTRO.MC',isin:'NL0000000002'},{symbol:'OTRO2.MC',isin:null}]};
    const entryBefore=structuredClone(entry);let retries=0;
    const element=CompanyIdentityNotice({entry,onRetry:()=>retries++});
    const notice=renderToStaticMarkup(element);
    assert.match(notice,/<h3>Identidad pendiente de revisión<\/h3>/);
    assert.match(notice,/<details class="alpha-identity-details screen-only">/);
    for(const value of ['ES0000000001','OTRO.MC','NL0000000002','OTRO2.MC','sin ISIN','isin_conflict'])assert.ok(notice.includes(value),value+' conserva trazabilidad');
    assert.match(notice,/<p class="print-only">ISIN del catálogo:/,'El detalle se conserva también en impresión');
    assert.doesNotMatch(notice,/fundador/,'La coordinación interna no aparece en el mensaje público');
    React.Children.toArray(element.props.children).find(child=>child.type==='button').props.onClick();
    assert.equal(retries,1,'Reintentar conserva su acción');
    assert.deepEqual(entry,entryBefore,'El estado y las identidades no se modifican');
    const missing=renderToStaticMarkup(React.createElement(CompanyIdentityNotice,{entry:{state:'missing'},onRetry:()=>{}}));
    assert.match(missing,/No hay fundamentales cargados/);
    assert.doesNotMatch(missing,/Identidad pendiente|<details/,'La ausencia de datos no se presenta como conflicto de identidad');
  }finally{await server.close();}
});
