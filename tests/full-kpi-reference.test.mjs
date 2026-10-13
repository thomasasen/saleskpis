import test from 'node:test';
import assert from 'node:assert/strict';
import {kpis,kpiById,evaluate} from '../kpis.js';

// Zweite, unabhängig gepflegte Referenztabelle für alle 67 Beispielrechnungen.
// Keine Übernahme der Werte durch Aufruf von evaluate() zur Erzeugung der Erwartung.
const expected={
 'lead-conversion':15,'mql-sql':40,'sql-opportunity':40,
 'meeting-opportunity':40,'outbound-response':4.4,
 'lead-response':13,'no-show':10,'source-yield':12,
 'pipeline-coverage':3,'required-coverage':10000/2400,
 'in-period-yield':24,'pipeline-gap':180000,
 'weighted-pipeline':120000,'pipeline-created':540000,
 'pipeline-generation-ratio':3,'avg-deal':50000,'avg-cycle':90,
 'sales-velocity':6000,'stage-age':30,'slippage':30,
 'stage-conversion':50,'win-rate':30,'win-rate-value':30,
 'loss-rate':70,'quota-attainment':75,'forecast-error':10,
 'forecast-bias':10,'forecast-accuracy':92,'commit-hit':80,
 'discount-rate':15,'arr':960000,'mrr':100000,
 'net-new-arr':340000,'acv':60000,'tcv':210000,
 'nrr':102,'grr':91,'logo-churn':4,'revenue-churn':9,
 'expansion-share':40,'cac':10000,'cac-ratio':2,
 'cac-payback':12,'ltv':160000,'ltv-cac':4,
 'gross-margin':77,'arr-growth':25,'magic-number':0.8,
 'rule-40':43,'revenue-fte':10000000/55,
 'utilization':75,'realization':90,'effective-rate':150,
 'project-margin':37.5,'project-overrun':15,'on-time':75,
 'backlog-coverage':1.5,'capacity-coverage':71.875,
 'consultant-revenue':200000,'change-request-share':12.5,
 'target-gap':350000,'activity-productivity':5,
 'rep-productivity':400000,'quota-capacity':3750000,
 'dso':30,'book-to-bill':1.25,'attach-rate':70
};
test('Unabhängige Beispieltabelle erfasst alle 67 KPIs',()=>{
 assert.equal(kpis.length,67);
 assert.deepEqual(new Set(Object.keys(expected)),new Set(kpis.map(k=>k.id)));
});
for(const [id,reference] of Object.entries(expected)){
 test('Referenzrechnung: '+id,()=>{
  const k=kpiById[id];
  assert.ok(k,id+' existiert');
  const actual=evaluate(k,k.fields.map(x=>x.value));
  assert.ok(Number.isFinite(actual),id+' muss eine Zahl liefern');
  assert.ok(Math.abs(actual-reference)<=Math.max(0.00001,Math.abs(reference)*1e-8),
   id+': Ist '+actual+', erwartet '+reference);
 });
}
test('Prozentfelder über 100 % werden nicht als plausible Eingabe akzeptiert',()=>{
 for(const id of ['required-coverage','sales-velocity','weighted-pipeline','cac-payback','ltv','gross-margin']){
  const k=kpiById[id];
  const i=k.fields.findIndex(f=>f.unit==='%');
  if(i===-1)continue;
  const vals=k.fields.map(f=>f.value);
  vals[i]=101;
  assert.equal(evaluate(k,vals),null,id);
 }
});
test('Kohortenbindung verhindert negative GRR, NRR und Gross Revenue Churn über 100 %',()=>{
 assert.equal(evaluate(kpiById.grr,[100,80,30]),null);
 assert.equal(evaluate(kpiById.nrr,[100,80,30,100]),null);
 assert.equal(evaluate(kpiById['revenue-churn'],[80,30,100]),null);
});
test('Overbooking über 100 % bleibt als warnende Capacity Coverage zulässig',()=>{
 assert.equal(evaluate(kpiById['capacity-coverage'],[120,100]),120);
});
test('Rule of 40 lässt negative Margen und negatives Wachstum zu',()=>{
 assert.equal(evaluate(kpiById['rule-40'],[-10,-20]),-30);
});
test('Definitionsgemäß begrenzte Conversion-Kennzahlen akzeptieren keine >100%',()=>{
 assert.equal(evaluate(kpiById['lead-conversion'],[110,100]),null);
 assert.equal(evaluate(kpiById['no-show'],[110,100]),null);
});
