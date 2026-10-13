import test from 'node:test';
import assert from 'node:assert/strict';
import {kpis,sources} from '../kpis.js';
import {kpiGuidance,guidanceEvidence,assessKpiValue} from '../kpi-guidance.js';

test('67 KPI-Leitfäden vollständig und eindeutig referenziert',()=>{
 const ids=new Set(kpis.map(k=>k.id));
 assert.equal(ids.size,67);
 assert.equal(Object.keys(kpiGuidance).length,67);
 assert.deepEqual(new Set(Object.keys(kpiGuidance)),ids);
 for(const k of kpis){
  const g=kpiGuidance[k.id];
  assert.ok(g,k.id+' hat keinen Leitfaden');
  for(const field of ['good','warning','critical','why','next']){
   assert.ok(typeof g[field]==='string'&&g[field].trim().length>=35,k.id+': '+field+' nicht aussagekräftig');
  }
  assert.ok(k.benchmark?.length>12,k.id+': Benchmarkorientierung fehlt');
 }
});
test('Studienbelege zeigen auf tatsächlich registrierte Quellen',()=>{
 for(const [id,meta] of Object.entries(guidanceEvidence)){
  assert.ok(kpis.some(k=>k.id===id),'Meta enthält unbekannte KPI '+id);
  assert.ok(meta.type,'fehlender Typ bei '+id);
  if(meta.source){
   assert.ok(sources[meta.source]?.url,'kein Quellenlink für '+id);
   assert.match(sources[meta.source].url,/^https:\/\//);
  }
 }
});
test('Keine fiktive universelle Ampel: nur plausible mathematische Regeln',()=>{
 for(const id of ['lead-conversion','win-rate','avg-cycle','cac','arr','mql-sql','weighted-pipeline','utilization','grr','forecast-error']){
  assert.equal(assessKpiValue(id,25),null,id+' benötigt eigene Kohorten-/Zielkalibrierung');
 }
 assert.equal(assessKpiValue('nrr',99).level,'critical');
 assert.equal(assessKpiValue('nrr',100).level,'good');
 assert.equal(assessKpiValue('quota-attainment',99).level,'watch');
 assert.equal(assessKpiValue('quota-attainment',100).level,'good');
 assert.equal(assessKpiValue('capacity-coverage',101).level,'critical');
 assert.equal(assessKpiValue('capacity-coverage',80).level,'neutral');
 assert.equal(assessKpiValue('project-overrun',10).level,'watch');
 assert.equal(assessKpiValue('project-overrun',10.1).level,'critical');
 assert.equal(assessKpiValue('project-overrun',0).level,'good');
 assert.equal(assessKpiValue('rule-40',25).level,'neutral');
 assert.equal(assessKpiValue('rule-40',40).level,'good');
 assert.equal(assessKpiValue('gross-margin',-1).level,'critical');
 assert.equal(assessKpiValue('gross-margin',80),null);
 assert.equal(assessKpiValue('net-new-arr',-1).level,'watch');
 assert.equal(assessKpiValue('book-to-bill',1.5).level,'neutral');
 assert.equal(assessKpiValue('nrr',null),null);
 assert.equal(assessKpiValue('nrr',NaN),null);
});
