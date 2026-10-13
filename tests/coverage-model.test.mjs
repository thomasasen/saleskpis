import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnoseCoverage} from '../coverage-model.js';

const base={
 pipeline:450000,goal:150000,winRate:30,onTimeRate:80,
 averageDeal:75000,largestDeal:175000,averageCycle:120,daysLeft:60
};
const close=(a,b)=>assert.ok(Math.abs(a-b)<.000001, a+' should equal '+b);
test('Red-Team-Beispiel trennt nominelle Coverage und zeitgerechten Modellwert',()=>{
 const x=diagnoseCoverage(base);
 assert.ok(x);
 close(x.ratio,3);
 close(x.effectiveRate,24);
 close(x.expected,108000);
 close(x.remainingGap,42000);
 close(x.requiredCoverage,1/.24);
 close(x.requiredPipeline,625000);
 close(x.missingPipeline,175000);
 assert.equal(x.additionalDeals,3);
 close(x.estimatedOpenDeals,6);
 close(x.shareLargest,175000/450000*100);
 close(x.expectedWithoutLargest,(450000-175000)*.24);
 assert.equal(x.cycleExceedsHorizon,true);
 assert.ok(x.warnings.length>=2);
});
test('Zeitrisiko verändert nicht die nominelle Coverage',()=>{
 const a=diagnoseCoverage({...base,onTimeRate:100});
 const b=diagnoseCoverage({...base,onTimeRate:50});
 close(a.ratio,b.ratio);
 assert.ok(a.expected>b.expected);
 assert.ok(a.requiredCoverage<b.requiredCoverage);
});
test('Dealgröße bestimmt grobe Stückzahl, nicht Coverage und Gewinnwert',()=>{
 const a=diagnoseCoverage({...base,averageDeal:30000});
 const b=diagnoseCoverage({...base,averageDeal:150000});
 close(a.ratio,b.ratio);
 close(a.expected,b.expected);
 assert.ok(a.additionalDeals>b.additionalDeals);
});
test('Gesamt-Sales-Cycle verändert nicht automatisch Abschlusswahrscheinlichkeit',()=>{
 const fast=diagnoseCoverage({...base,averageCycle:45});
 const slow=diagnoseCoverage({...base,averageCycle:220});
 close(fast.expected,slow.expected);
 assert.equal(fast.cycleExceedsHorizon,false);
 assert.equal(slow.cycleExceedsHorizon,true);
});
test('Ausgeschlossen: fehlerhafte Eingaben, Deal größer als Pipeline',()=>{
 const variants=[
  {largestDeal:500000},{goal:-1},{winRate:102},{winRate:-5},
  {onTimeRate:120},{onTimeRate:-1},{averageDeal:0},{averageCycle:0},{daysLeft:-2},{pipeline:NaN}
 ];
 for(const change of variants)assert.equal(diagnoseCoverage({...base,...change}),null,JSON.stringify(change));
});
test('0 % Win Rate: Ziel kann nicht durch endliche Pipeline gedeckt werden',()=>{
 const x=diagnoseCoverage({...base,winRate:0});
 close(x.expected,0);
 assert.equal(x.requiredCoverage,null);
 assert.equal(x.missingPipeline,null);
 assert.ok(x.warnings.length>0);
});
test('Bereits erreichtes Restziel wird ohne falsche Coverage behandelt',()=>{
 const x=diagnoseCoverage({...base,goal:0});
 assert.equal(x.ratio,null);
 assert.equal(x.goalReached,true);
 close(x.requiredPipeline,0);
});
test('100 % Gewinn und Rechtzeitigkeit ergibt 1x Mindest-Coverage',()=>{
 const x=diagnoseCoverage({...base,winRate:100,onTimeRate:100});
 close(x.requiredCoverage,1);
 close(x.expected,450000);
 close(x.remainingGap,0);
});
