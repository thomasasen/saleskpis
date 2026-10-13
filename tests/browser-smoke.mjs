import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base='http://127.0.0.1:8765';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const failures=[];
const run=async(name,fn)=>{
 try{await fn();console.log('PASS',name)}
 catch(e){failures.push(name+': '+e.message);console.error('FAIL',name,e.message)}
};
const attachErrors=page=>{
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 return errors;
};
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const desktop=await context.newPage();
 const jsErrors=attachErrors(desktop);
 await desktop.goto(base,{waitUntil:'networkidle'});
 await run('Barrierefreiheit: keine kritischen oder schweren WCAG 2.1 AA-Verstöße',async()=>{
  const audit=await new AxeBuilder({page:desktop}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const serious=audit.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
  if(serious.length)console.log('A11y-Audit',JSON.stringify(serious.map(v=>({
    id:v.id,impact:v.impact,description:v.description,
    nodes:v.nodes.slice(0,100).map(n=>({target:n.target,summary:n.failureSummary}))
  })),null,2));
  assert.equal(serious.length,0,'Es gibt '+serious.length+' kritische/schwere WCAG-Verstöße');
 });
 await run('Barrierefreiheit im Dark Mode',async()=>{
  await desktop.locator('#theme-toggle').click();
  const audit=await new AxeBuilder({page:desktop}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const serious=audit.violations.filter(v=>['critical','serious'].includes(v.impact));
  if(serious.length)console.log('Dark A11y',JSON.stringify(serious.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,100).map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));
  await desktop.locator('#theme-toggle').click();
  assert.equal(serious.length,0,'Dark Mode: '+serious.length+' schwere A11y-Verstöße');
 });
 await run('Startseite und JavaScript-Initialisierung',async()=>{
  assert.equal((await desktop.locator('#hero-kpi-count').innerText()).trim(),'67');
  assert.equal((await desktop.locator('#required-coverage-value').innerText()).trim(),'4,17×');
  assert.match(await desktop.locator('#coverage-benchmark-label').innerText(),/4,17×/);
  assert.equal(jsErrors.length,0,jsErrors.join('; '));
 });
 await run('Live-Änderung bestehende Pipeline propagiert in Bedarfsrechner',async()=>{
  await desktop.locator('#coverage-pipeline').fill('600000');
  assert.equal((await desktop.locator('#required-current-value').innerText()).trim(),'4,00×');
  assert.equal((await desktop.locator('#required-gap-value').innerText()).trim(),'25.000 €');
 });
 await run('Win Rate und Fristquote ändern benötigte Coverage',async()=>{
  await desktop.locator('#required-win-rate').fill('25');
  await desktop.locator('#required-on-time').fill('100');
  assert.equal((await desktop.locator('#required-coverage-value').innerText()).trim(),'4,00×');
  assert.equal((await desktop.locator('#required-gap-value').innerText()).trim(),'0 €');
 });
 await run('Alternativmethode historischer Yield ist verwendbar',async()=>{
  await desktop.locator('input[name="required-method"][value="yield"]').check();
  assert.equal(await desktop.locator('#required-split-fields').isVisible(),false);
  assert.equal(await desktop.locator('#required-yield-fields').isVisible(),true);
  await desktop.locator('#required-yield').fill('20');
  assert.equal((await desktop.locator('#required-coverage-value').innerText()).trim(),'5,00×');
  assert.equal((await desktop.locator('#required-gap-value').innerText()).trim(),'150.000 €');
 });
 await run('Eingabe 0 wird korrekt als nicht berechenbar markiert',async()=>{
  await desktop.locator('#required-yield').fill('0');
  assert.equal((await desktop.locator('#required-coverage-value').innerText()).trim(),'—');
  assert.match(await desktop.locator('#required-status').innerText(),/kein endlicher Pipelinewert/);
 });
 await run('KPI-Suche findet spezifische Kennzahl und Rechner',async()=>{
  const field=desktop.locator('#kpi-search');
  await field.fill('CAC Payback Period');
  assert.ok((await desktop.locator('.kpi-card').count())>=1);
  const card=desktop.locator('.kpi-card').filter({hasText:'CAC Payback Period'}).first();
  await card.locator('.kpi-expand').click();
  assert.equal(await card.locator('.calc-wrap').isVisible(),true);
  await card.locator('.calc-input').first().fill('300000');
  assert.match(await card.locator('output').innerText(),/Monate/);
 });
 await run('Barrierefreiheit bei geöffneter KPI-Karte',async()=>{
  const audit=await new AxeBuilder({page:desktop})
    .include('#kpi-grid').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const serious=audit.violations.filter(v=>['critical','serious'].includes(v.impact));
  if(serious.length)console.log('Expanded KPI A11y',JSON.stringify(serious.map(v=>({id:v.id,nodes:v.nodes.slice(0,100).map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));
  assert.equal(serious.length,0,'Expanded KPI: '+serious.length+' schwere A11y-Verstöße');
 });
 await run('Glossar erklärt Sales Cycle und verlinkt KPI',async()=>{
  await desktop.locator('#glossary-search').fill('Sales Cycle');
  const glossary=desktop.locator('.glossary-item').filter({hasText:'Sales Cycle'}).first();
  assert.ok(await glossary.count());
  await glossary.locator('summary').click();
  assert.match(await glossary.locator('.glossary-body').innerText(),/Vertriebsstart|Vertriebszyklus|Abschluss/);
 });
 await run('Link öffnet KPI und fokussiert Detailbutton',async()=>{
  await desktop.goto(base+'/#kpi-pipeline-coverage',{waitUntil:'networkidle'});
  const card=desktop.locator('#kpi-pipeline-coverage');
  assert.equal(await card.locator('.kpi-detail').isVisible(),true);
  assert.equal(await card.locator('.kpi-expand').getAttribute('aria-expanded'),'true');
 });
 await run('Sprungreise KPI → Glossar → KPI, UI-Zurück und Browser-Zurück',async()=>{
  await desktop.goto(base,{waitUntil:'networkidle'});
  assert.equal(await desktop.locator('#jump-return').isVisible(),false,'Kein Rückbutton auf Startseite');
  await desktop.locator('#kpi-search').fill('Pipeline Coverage');
  const original=desktop.locator('#kpi-pipeline-coverage');
  await original.locator('.kpi-expand').click();
  await original.locator('.calc-input').first().fill('610000');
  const sourceLink=original.locator('[data-glossary="sales-cycle"]');
  await sourceLink.scrollIntoViewIfNeeded();
  const sourceY=await desktop.evaluate(()=>window.scrollY);
  await sourceLink.click();
  await desktop.waitForURL('**/#begriff-sales-cycle');
  assert.equal(await desktop.locator('#begriff-sales-cycle').getAttribute('open'),'');
  assert.equal(await desktop.locator('#jump-return').isVisible(),true);
  await desktop.locator('#begriff-sales-cycle [data-jump="avg-cycle"]').click();
  await desktop.waitForURL('**/#kpi-avg-cycle');
  assert.equal(await desktop.locator('#kpi-avg-cycle .kpi-detail').isVisible(),true);
  await desktop.locator('#jump-return-button').click();
  await desktop.waitForURL('**/#begriff-sales-cycle');
  assert.equal(await desktop.locator('#begriff-sales-cycle').getAttribute('open'),'');
  await desktop.goBack();
  assert.equal(new URL(desktop.url()).hash,'');
  assert.equal(await desktop.locator('#kpi-search').inputValue(),'Pipeline Coverage');
  assert.equal(await desktop.locator('#kpi-pipeline-coverage .kpi-detail').isVisible(),true);
  assert.equal(await desktop.locator('#kpi-pipeline-coverage .calc-input').first().inputValue(),'610000');
  await desktop.waitForFunction(y=>Math.abs(window.scrollY-y)<=5,sourceY);
  assert.equal(await desktop.locator('#jump-return').isVisible(),false);
  await desktop.goForward();
  assert.equal(new URL(desktop.url()).hash,'#begriff-sales-cycle');
  assert.equal(await desktop.locator('#jump-return').isVisible(),true);
 });
 await run('Interner Abschnittslink bietet Rücksprung an ursprüngliche Scrollposition',async()=>{
  await desktop.goto(base,{waitUntil:'networkidle'});
  await desktop.locator('.mobile-section-nav a[href="#bibliothek"]').evaluate(el=>el.click());
  await desktop.waitForURL('**/#bibliothek');
  assert.equal(await desktop.locator('#jump-return').isVisible(),true);
  await desktop.locator('#jump-return-button').click();
  await desktop.waitForURL(base+'/');
  assert.equal(await desktop.locator('#jump-return').isVisible(),false);
 });
 await run('Direkt geteilter KPI-Link hat keinen fiktiven internen Rücksprung',async()=>{
  await desktop.goto(base+'/#kpi-win-rate',{waitUntil:'networkidle'});
  assert.equal(await desktop.locator('#kpi-win-rate .kpi-detail').isVisible(),true);
  assert.equal(await desktop.locator('#jump-return').isVisible(),false);
 });
 await desktop.close();
 await context.close();

 for(const width of [1024,768,390,320]){
  const mobileContext=await browser.newContext({viewport:{width,height:800},isMobile:false});
  const page=await mobileContext.newPage();
  const errs=attachErrors(page);
  await page.goto(base,{waitUntil:'networkidle'});
  await run('Mobilnavigation und Layout bei '+width+' px',async()=>{
   assert.equal(await page.locator('.mobile-section-nav').isVisible(),true);
   const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
   if(scrollWidth>width+2){
    const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')]
     .filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&getComputedStyle(el).overflowX!=='auto';})
     .map(el=>({tag:el.tagName,id:el.id,cls:typeof el.className==='string'?el.className.slice(0,70):'',right:Math.round(el.getBoundingClientRect().right)})).slice(0,12));
    console.log('Overflow offenders',width,JSON.stringify(overflow));
   }
   assert.ok(scrollWidth<=width+2,'Horizontales Überlaufen: '+scrollWidth+' > '+width);
   assert.equal(errs.length,0,errs.join('; '));
  });
  if(width===390)await run('WCAG-Kontraste und Semantik auf Mobiltelefon',async()=>{
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   const serious=audit.violations.filter(v=>['critical','serious'].includes(v.impact));
   if(serious.length)console.log('Mobile A11y',JSON.stringify(serious.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,100).map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));
   assert.equal(serious.length,0,'Mobil: '+serious.length+' schwere A11y-Verstöße');
  });
  await run('Mobiler Navigationslink zur Bibliothek bei '+width+' px',async()=>{
   await page.locator('.mobile-section-nav a[href="#bibliothek"]').click();
   assert.equal(new URL(page.url()).hash,'#bibliothek');
  });
  await page.close();
  await mobileContext.close();
 }
}finally{
 await browser.close();
}
if(failures.length)throw new Error(failures.length+' Browser-Checks fehlgeschlagen:\n'+failures.join('\n'));
console.log('Alle Browserchecks erfolgreich.');
