import test from 'node:test';
import assert from 'node:assert/strict';
import {kpis,kpiById,categories,sources,evaluate} from '../kpis.js';

const check=(id,result)=>test(id+' – Beispielrechnung',()=>{
 const k=kpiById[id];assert.ok(k, id+' vorhanden');
 assert.ok(Math.abs(evaluate(k,k.fields.map(f=>f.value))-result)<.001,id+' Ergebnis');
});
test('Katalog hat eine breite, valide Abdeckung',()=>{
 assert.ok(kpis.length>=60);
 assert.equal(new Set(kpis.map(k=>k.id)).size,kpis.length,'eindeutige IDs');
 assert.equal(categories.length,7);
 for(const k of kpis){
  assert.ok(k.title&&k.description&&k.formula&&k.benchmark&&k.reading&&k.action&&k.watch&&k.example,k.id+' vollständig');
  assert.ok(categories.some(c=>c.id===k.category),k.id+' Kategorie existiert');
  assert.ok(k.fields.length>=1&&k.fields.every(f=>Number.isFinite(f.value)&&f.value>=0),k.id+' Felder gültig');
  assert.ok(Number.isFinite(evaluate(k,k.fields.map(f=>f.value))),k.id+' liefert ein endliches Beispielergebnis');
  assert.ok(k.related.every(id=>Boolean(kpiById[id])),k.id+' Verknüpfungen vorhanden');
  if(k.source)assert.ok(sources[k.source],k.id+' referenziert eine existierende Quelle');
 }
});
check('pipeline-coverage',3);
check('required-coverage',10000/(30*80));
check('pipeline-gap',180000);
check('weighted-pipeline',120000);
check('win-rate',30);
check('win-rate-value',30);
check('sales-velocity',6000);
check('forecast-error',10);
check('forecast-accuracy',92);
check('forecast-bias',10);
check('nrr',102);
check('grr',91);
check('revenue-churn',9);
check('net-new-arr',340000);
check('cac-ratio',2);
check('cac-payback',12);
check('ltv',160000);
check('utilization',75);
check('project-margin',37.5);
check('arr-growth',25);
check('rule-40',43);
test('Rule of 40 erlaubt negative EBITDA-Margen',()=>{
 assert.equal(evaluate(kpiById['rule-40'],[30,-15]),15);
});
check('dso',30);
test('Divisionen durch 0 werden kontrolliert zurückgewiesen',()=>{
 assert.equal(evaluate(kpiById['pipeline-coverage'],[50000,0]),null);
 assert.equal(evaluate(kpiById['cac-payback'],[20000,100000,0]),null);
 assert.equal(evaluate(kpiById['ltv'],[10000,80,0]),null);
 assert.equal(evaluate(kpiById['required-coverage'],[0]),null);
});
test('Ungültige Inputs sind kein scheinbar gültiges KPI-Ergebnis',()=>{
 assert.equal(evaluate(kpiById['win-rate'],[NaN,8]),null);
 assert.equal(evaluate(kpiById['arr'],[-500]),null);
 assert.equal(evaluate(kpiById['arr'],[]),null);
});
