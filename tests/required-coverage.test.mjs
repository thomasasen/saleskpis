import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calculateRequiredCoverage} from '../coverage-model.js';

const base = {pipeline:450000,goal:150000,method:'split',winRate:30,onTimeRate:80};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,String(a)+' != '+String(b));

test('Bedarfsrechnung: 30 % Win Rate und 80 % Fristquote ergibt 4,17x',()=>{
 const r=calculateRequiredCoverage(base);
 assert.equal(r.error,null);
 near(r.effectiveRatePercent,24);
 near(r.currentCoverage,3);
 near(r.requiredCoverage,100/24);
 near(r.requiredPipeline,625000);
 near(r.additionalPipeline,175000);
 near(r.expectedBookings,108000);
 near(r.expectedGap,42000);
});
test('Historischer In-Period Yield reproduziert das gleiche Ergebnis',()=>{
 const r=calculateRequiredCoverage({...base,method:'yield',inPeriodYield:24,winRate:NaN,onTimeRate:NaN});
 assert.equal(r.error,null);
 near(r.requiredCoverage,100/24);
 near(r.requiredPipeline,625000);
 near(r.additionalPipeline,175000);
});
test('3x ist nicht universell, 25 Prozent ohne Terminrisiko benötigt 4x',()=>{
 const r=calculateRequiredCoverage({...base,winRate:25,onTimeRate:100});
 near(r.requiredCoverage,4);
 near(r.requiredPipeline,600000);
 near(r.additionalPipeline,150000);
});
test('Vollständig ausreichende Pipeline ergibt 0 zusätzliche Pipeline, nicht negative Werte',()=>{
 const r=calculateRequiredCoverage({...base,pipeline:850000});
 near(r.currentCoverage,850000/150000);
 near(r.additionalPipeline,0);
});
test('Veränderung des offenen Ziels ändert Pipelinebedarf, nicht benötigten Faktor',()=>{
 const a=calculateRequiredCoverage(base);
 const b=calculateRequiredCoverage({...base,goal:300000});
 near(a.requiredCoverage,b.requiredCoverage);
 near(b.requiredPipeline,1250000);
 near(b.additionalPipeline,800000);
});
test('0 % Gewinn/Fristquote liefert keine falsche endliche Coverage',()=>{
 for(const input of [
  {...base,winRate:0},
  {...base,onTimeRate:0},
  {...base,method:'yield',inPeriodYield:0}
 ]){
  const r=calculateRequiredCoverage(input);
  assert.equal(r.error,'zero-yield');
  assert.equal(r.requiredCoverage,null);
  assert.equal(r.requiredPipeline,null);
  assert.equal(r.additionalPipeline,null);
 }
});
test('Bei Restziel 0 ist die Coverage mathematisch nicht definiert',()=>{
 const r=calculateRequiredCoverage({...base,goal:0});
 assert.equal(r.error,'target-reached');
 assert.equal(r.currentCoverage,null);
 assert.equal(r.requiredCoverage,null);
 assert.equal(r.additionalPipeline,0);
});
test('Ungültige Eingaben und Werte außerhalb des Prozentbereichs werden zurückgewiesen',()=>{
 const cases=[
  {goal:-1},{pipeline:-5},{pipeline:NaN},{winRate:NaN},
  {winRate:-1},{winRate:101},{onTimeRate:101},{onTimeRate:-0.1},
  {method:'yield',inPeriodYield:-1},{method:'yield',inPeriodYield:101},
  {method:'unknown'}
 ];
 for(const change of cases){
  const r=calculateRequiredCoverage({...base,...change});
  assert.equal(r.error,'invalid',JSON.stringify(change));
 }
});
test('Benötigte Coverage ist über eine klar benannte Formularstruktur erreichbar',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const style=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
 for(const id of ['coverage-benoetigt','required-coverage-form','required-win-rate','required-on-time',
    'required-yield','required-split-fields','required-yield-fields',
    'required-formula','required-explanation','required-coverage-value',
    'required-current-value','required-pipeline-value','required-gap-value','required-status']){
   assert.ok(html.includes('id="'+id+'"'),id+' fehlt in HTML');
 }
 assert.match(html,/value="split" checked/);
 assert.match(html,/name="required-method" value="yield"/);
 assert.match(app,/function renderRequiredCoverage/);
 assert.match(app,/calculateRequiredCoverage\(/);
 assert.match(app,/split.hidden=method!=='split'/);
 assert.match(app,/yieldFields.hidden=method!=='yield'/);
 assert.match(style,/\.required-method-fields\[hidden\]\{display:none!important\}/);
});
