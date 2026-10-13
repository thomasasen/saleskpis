import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {glossary,glossaryById} from '../glossary.js';
import {dependencies} from '../dependencies.js';
import {kpis,kpiById,evaluate} from '../kpis.js';

test('Das Glossar ist umfassend, eindeutig und didaktisch vollständig',()=>{
 assert.ok(glossary.length>=40);
 assert.equal(new Set(glossary.map(t=>t.id)).size,glossary.length);
 for(const t of glossary){
  assert.ok(t.title&&t.translation&&t.definition&&t.example&&t.warning,t.id);
  assert.ok(kpiById[t.kpi],t.id+' muss zu existierender Kennzahl verweisen');
  assert.equal(glossaryById[t.id],t);
 }
});
test('Gerichtete KPI-Abhängigkeiten sind konkret erklärt und verweisen auf existente KPIs',()=>{
 assert.ok(Object.keys(dependencies).length>=12);
 for(const [id,items] of Object.entries(dependencies)){
  assert.ok(kpiById[id],id+' existiert');
  assert.ok(items.length>0);
  for(const item of items){
   assert.ok(kpiById[item.relatedId],id+' -> '+item.relatedId+' existiert');
   assert.ok(item.kind&&item.label&&item.explanation.length>30,id+' vollständige Erklärung');
  }
 }
});
test('Periodenbezogener Yield ist mathematisch und zeitlich korrekt beschrieben',()=>{
 const k=kpiById['in-period-yield'];
 assert.ok(k);
 assert.equal(evaluate(k,[108000,450000]),24);
 assert.equal(evaluate(k,[1000,0]),null);
 assert.match(k.watch,/Startpipeline|Snapshot|ursprünglichen/);
});
test('Stresstest, Glossar und Informationsarchitektur sind angeschlossen',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 for(const id of ['glossar','glossary-grid','glossary-search','coverage-lab-form','stress-win','stress-ontime','stress-cycle','stress-deal','stress-largest','stress-days','stress-coverage','stress-required','stress-gap','reverse-ontime'])
  assert.ok(html.includes('id="'+id+'"'),id+' fehlt in HTML');
 assert.match(app,/diagnoseCoverage\(/);
 assert.match(app,/jumpToGlossary/);
 assert.match(app,/dependencyExplanation/);
 assert.match(app,/data-glossary/);
});
