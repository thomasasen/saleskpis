import {dependencies} from './dependencies.js';
import {glossary,glossaryById} from './glossary.js';
import {diagnoseCoverage,calculateRequiredCoverage} from './coverage-model.js';
import {categories,kpis,kpiById,sources,evaluate} from './kpis.js';

const $=selector=>document.querySelector(selector);
const els={
 filters:$('#category-filters'),nav:$('#category-nav'),grid:$('#kpi-grid'),
 search:$('#kpi-search'),count:$('#result-count'),empty:$('#empty-state'),toast:$('#toast')
};
const featured=['pipeline-coverage','required-coverage','in-period-yield','pipeline-gap','win-rate','win-rate-value','sales-velocity','forecast-error','quota-attainment','arr','nrr','grr','cac-payback','utilization','project-margin'];
const state={category:'featured',query:''};
const nf=(n,digits=1)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n);
const nf0=n=>new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}).format(n);
function formatValue(value,unit){
 if(value===null||!Number.isFinite(value))return 'Nicht berechenbar';
 if(unit==='€'||unit==='€/Kunde'||unit==='€/FTE'||unit==='€/Jahr'||unit==='€/h'||unit==='€/Tag'||unit==='€/Monat')return nf0(value)+' '+unit;
 if(unit==='×')return nf(value,1)+'×';
 if(unit==='%')return nf(value,1)+' %';
 if(unit==='Punkte')return nf(value,1)+' Punkte';
 if(unit==='Tage'||unit==='Monate'||unit==='min')return nf(value,1)+' '+unit;
 return nf(value,1)+(unit?' '+unit:'');
}
function shortLabel(cat){return categories.find(c=>c.id===cat)?.name||cat;}
function createButton(value,label,count,active){
 const b=document.createElement('button');
 b.type='button';b.className='filter-button'+(active?' active':'');b.dataset.filter=value;
 b.setAttribute('aria-pressed',String(active));
 b.textContent=label+' ';
 const s=document.createElement('span');s.textContent=String(count);b.appendChild(s);
 return b;
}
function renderNav(){
 for(const c of categories){
   const a=document.createElement('a');a.href='#bibliothek';
   a.className='category-link'+(state.category===c.id?' active':'');
   a.dataset.filter=c.id;
   const n=document.createElement('span');n.className='category-numeral';n.textContent=c.icon;
   a.appendChild(n);a.appendChild(document.createTextNode(c.name));els.nav.appendChild(a);
 }
}
function renderFilters(){
 els.filters.replaceChildren();
 els.filters.append(
   createButton('featured','Zum Einstieg',featured.length,state.category==='featured'),
   createButton('all','Alle Kennzahlen',kpis.length,state.category==='all')
 );
 for(const c of categories)els.filters.appendChild(createButton(c.id,c.name,kpis.filter(k=>k.category===c.id).length,state.category===c.id));
 document.querySelectorAll('.category-link').forEach(a=>a.classList.toggle('active',a.dataset.filter===state.category));
}
function escapeHtml(s){
 return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function getVisible(){
 const query=state.query.toLocaleLowerCase('de-DE').trim();
 return kpis.filter(k=>{
   const belongs=state.category==='all'||(state.category==='featured'?featured.includes(k.id):k.category===state.category);
   if(!query)return belongs;
   // Mit aktiver Suche in allen KPI-Einträgen suchen, damit keine Kennzahl versehentlich verborgen bleibt.
   return (k.title+' '+k.description+' '+k.formula+' '+k.benchmark+' '+k.category+' '+k.related.join(' ')).toLocaleLowerCase('de-DE').includes(query);
 }).filter(k=>query||state.category==='all'||state.category==='featured'||k.category===state.category);
}

function termLinksForKpi(k){
 const termRefs={
  'pipeline-coverage':['coverage','pipeline','weighted-rate','sales-cycle','slippage'],
  'required-coverage':['coverage','weighted-rate','win-rate'],
  'in-period-yield':['in-period-yield','pipeline','slippage','weighted-rate','cohort'],
  'pipeline-gap':['coverage','quota','deal-size'],
  'weighted-pipeline':['pipeline','sales-stage','weighted-rate'],
  'win-rate':['win-rate','loss-rate','closed-won','closed-lost'],
  'win-rate-value':['weighted-rate','win-rate','deal-size'],
  'avg-cycle':['sales-cycle','closed-won','opportunity'],
  'avg-deal':['deal-size','opportunity','bookings'],
  'sales-velocity':['sales-velocity','sales-cycle','win-rate','deal-size'],
  'slippage':['slippage','close-date','forecast'],
  'forecast-error':['forecast','commit','bookings'],
  'forecast-accuracy':['forecast','commit'],
  'quota-attainment':['quota','bookings'],
  'grr':['grr','nrr','churn','cohort'],
  'nrr':['nrr','grr','churn','cohort'],
  'cac-payback':['cac','gross-margin','arr'],
  'utilization':['utilization','billable','realization'],
  'project-margin':['gross-margin','cogs','billable'],
  'backlog-coverage':['backlog','pipeline'],
  'arr':['arr','mrr','acv'],
  'tcv':['tcv','acv','bookings'],
  'acv':['acv','tcv','arr']
 };
 const exact=(termRefs[k.id]||[]).filter(id=>glossaryById[id]);
 const haystack=(k.title+' '+k.description+' '+k.formula).toLocaleLowerCase('de-DE');
 const matching=glossary.filter(t=>haystack.includes(t.title.toLocaleLowerCase('de-DE'))).map(t=>t.id);
 const ids=[...new Set([...exact,...matching])].slice(0,5);
 if(!ids.length)return '';
 return '<div class="card-term-links"><span>BEGRIFFE EINFACH ERKLÄRT</span><div>'+
  ids.map(id=>'<button type="button" class="term-pill" data-glossary="'+escapeHtml(id)+'">'+escapeHtml(glossaryById[id].title)+' ↗</button>').join('')+
  '</div></div>';
}
function renderGlossary(){
 const q=$('#glossary-search').value.trim().toLocaleLowerCase('de-DE');
 const entries=glossary.filter(t=>(t.title+' '+t.translation+' '+t.definition+' '+t.example).toLocaleLowerCase('de-DE').includes(q));
 $('#glossary-count').textContent=entries.length+' von '+glossary.length+' Begriffen';
 $('#glossary-empty').hidden=entries.length>0;
 $('#glossary-grid').innerHTML=entries.map(t=>
  '<details class="glossary-item" id="begriff-'+escapeHtml(t.id)+'">'+
  '<summary><span><strong>'+escapeHtml(t.title)+'</strong><small>'+escapeHtml(t.translation)+'</small></span><span aria-hidden="true" class="glossary-expand">+</span></summary>'+
  '<div class="glossary-body"><p>'+escapeHtml(t.definition)+'</p>'+
  '<p><b>Beispiel:</b> '+escapeHtml(t.example)+'</p>'+
  '<p class="glossary-caution"><b>Typischer Fehler:</b> '+escapeHtml(t.warning)+'</p>'+
  (kpiById[t.kpi]?'<button type="button" data-jump="'+escapeHtml(t.kpi)+'">Passende Kennzahl mit Rechner ansehen ↗</button>':'')+
  '</div></details>'
 ).join('');
}
function jumpToGlossary(id){
 if(!glossaryById[id])return;
 const search=$('#glossary-search');search.value='';renderGlossary();
 const entry=document.getElementById('begriff-'+id);
 if(!entry)return;
 entry.open=true;
 history.replaceState(null,'','#begriff-'+id);
 entry.scrollIntoView({behavior:motion(),block:'start'});
 entry.querySelector('summary').focus({preventScroll:true});
}


function dependencyExplanation(k){
 const links=dependencies[k.id];
 if(!links?.length)return '';
 return '<div class="dependency-info"><span class="detail-label">Wovon hängt die Kennzahl ab?</span><p>Jede Verbindung ist einzeln erklärt. „Indirekt“ bedeutet: Die Größe ändert nicht zwangsläufig die Rechenformel.</p>'+
 links.map(rel=>
  '<div class="dependency-row"><span class="dependency-kind">'+escapeHtml(rel.kind)+'</span><div><button type="button" data-jump="'+escapeHtml(rel.relatedId)+'">'+escapeHtml(rel.label)+' ↗</button>'+
  '<p>'+escapeHtml(rel.explanation)+'</p></div></div>'
 ).join('')+'</div>';
}

function cardMarkup(k){
 const inputs=k.fields.map((f,i)=>{
  const id='input-'+k.id+'-'+i;
  return '<div class="calc-field"><label for="'+id+'">'+escapeHtml(f.name)+'</label><div class="calc-input-wrap"><input class="calc-input" type="number"'+(k.id==='rule-40'?'':' min="0"')+' step="any" inputmode="decimal" id="'+id+'" data-index="'+i+'" value="'+escapeHtml(f.value)+'" aria-label="'+escapeHtml(f.name)+'"><span class="calc-unit" aria-hidden="true">'+escapeHtml(f.unit)+'</span></div></div>';
 }).join('');
 const related=k.related.filter(id=>kpiById[id]).map(id=>'<button type="button" data-jump="'+escapeHtml(id)+'">'+escapeHtml(kpiById[id].title)+' ↗</button>').join('');
 const ref=sources[k.source];
 const sourceHTML=ref?'<a class="source-link" target="_blank" rel="noopener noreferrer" href="'+escapeHtml(ref.url)+'">Quelle: '+escapeHtml(ref.name)+' ↗</a>':'';
 return '<article class="kpi-card" id="kpi-'+escapeHtml(k.id)+'" data-id="'+escapeHtml(k.id)+'">'+
  '<div class="kpi-main"><div class="kpi-card-head"><span class="kpi-card-category">'+escapeHtml(shortLabel(k.category))+'</span><span class="kpi-card-level">'+escapeHtml(k.level)+'</span></div>'+
  '<h3>'+escapeHtml(k.title)+'</h3><p class="kpi-summary">'+escapeHtml(k.description)+'</p>'+
  '<p class="kpi-benchmark"><span>EINORDNUNG</span> · '+escapeHtml(k.benchmark)+'</p>'+
  '<button type="button" class="kpi-expand" aria-expanded="false" aria-controls="detail-'+escapeHtml(k.id)+'">Formel, Beispiel & Rechner anzeigen <span class="expand-symbol" aria-hidden="true">+</span></button></div>'+
  '<div id="detail-'+escapeHtml(k.id)+'" class="kpi-detail" hidden>'+
  termLinksForKpi(k)+'<span class="detail-label">Die Formel</span><div class="formula-box">'+escapeHtml(k.formula)+'</div>'+
  '<span class="detail-label">Beispielrechnung</span><p class="sample-line">'+escapeHtml(k.example)+'</p>'+
  '<section class="calc-wrap" aria-label="KPI-Rechner '+escapeHtml(k.title)+'"><div class="calc-title"><strong>Mit eigenen Zahlen rechnen</strong><button class="calc-reset" type="button">Beispielwerte ↺</button></div>'+
  '<div class="calc-fields">'+inputs+'</div><div class="calc-result"><span>BERECHNETER WERT</span><output aria-live="polite">'+escapeHtml(formatValue(evaluate(k,k.fields.map(f=>f.value)),k.unit))+'</output></div>'+
  '<p class="calc-error" aria-live="polite"></p></section>'+
  dependencyExplanation(k)+'<div class="detail-block"><span class="detail-label">So liest du das Ergebnis</span><p>'+escapeHtml(k.reading)+'</p></div>'+
  '<div class="detail-block decision"><span class="detail-label">Was du daraus ableiten solltest</span><p>'+escapeHtml(k.action)+'</p></div>'+
  '<div class="detail-block warning"><span class="detail-label">Typischer Fehler / wichtige Abgrenzung</span><p>'+escapeHtml(k.watch)+'</p></div>'+
  (related?'<div class="detail-block"><span class="detail-label">Zusammenhängende KPIs</span><div class="related-links">'+related+'</div></div>':'')+
  sourceHTML+'</div></article>';
}
function renderGrid(){
 const data=getVisible();
 els.grid.innerHTML=data.map(cardMarkup).join('');
 els.count.textContent=data.length+' von '+kpis.length+' Kennzahlen'+(state.query?' · Suchergebnisse in allen Themen':state.category==='featured'?' · empfohlener Einstieg':'');
 els.empty.hidden=data.length!==0;
 renderFilters();
}
function selectFilter(cat,scroll=true){
 state.category=cat;state.query='';els.search.value='';renderGrid();
 if(scroll)$('#bibliothek').scrollIntoView({behavior:motion(),block:'start'});
}
function motion(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';}
function updateCardResult(article){
 const k=kpiById[article.dataset.id];if(!k)return;
 const raw=[...article.querySelectorAll('.calc-input')].map(n=>n.value.trim()===''?NaN:Number(n.value));
 const result=evaluate(k,raw);
 article.querySelector('output').textContent=formatValue(result,k.unit);
 const error=article.querySelector('.calc-error');
 if(result===null)error.textContent='Bitte gültige Zahlen eingeben. Negative Werte sind nur bei der Rule of 40 erlaubt. Prozentangaben müssen gültig sein; Verluste dürfen die ursprüngliche Kohorte nicht überschreiten.';
 else if(k.id==='grr'&&(result>100||result<0))error.textContent='Plausibilitätswarnung: GRR muss zwischen 0 und 100 % liegen. Churn-/Contraction-Werte prüfen.';
 else if(k.id==='nrr'&&result<0)error.textContent='Plausibilitätswarnung: Negativer Kohortenumsatz ist nicht sinnvoll. Eingaben prüfen.';
 else error.textContent='';
}
function toggleCard(article,open){
 const detail=article.querySelector('.kpi-detail');const btn=article.querySelector('.kpi-expand');
 if(!detail||!btn)return;
 const next=typeof open==='boolean'?open:detail.hidden;
 detail.hidden=!next;article.classList.toggle('open',next);btn.setAttribute('aria-expanded',String(next));
 btn.firstChild.textContent=next?'Rechner & Details schließen ':'Formel, Beispiel & Rechner anzeigen ';
 if(next)updateCardResult(article);
}
function jumpToKpi(id){
 if(!kpiById[id])return;
 state.category='all';state.query='';els.search.value='';renderGrid();
 const card=document.getElementById('kpi-'+id);if(!card)return;
 toggleCard(card,true);
 history.replaceState(null,'','#kpi-'+id);
 card.scrollIntoView({behavior:motion(),block:'start'});
 // Sichtbaren Tastaturfokus gewährleisten, ohne Scrollsprung.
 card.querySelector('.kpi-expand').focus({preventScroll:true});
}
let toastTimer;
function showToast(message){
 const el=els.toast;el.textContent=message;el.classList.add('visible');
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2500);
}
function coverage(){
 const n1=$('#coverage-pipeline').value,n2=$('#coverage-target').value;
 const p=n1.trim()===''?NaN:Number(n1),t=n2.trim()===''?NaN:Number(n2);
 const value=$('#coverage-value'),bar=$('#coverage-fill'),out=$('#coverage-explain');
 if(!Number.isFinite(p)||!Number.isFinite(t)||p<0||t<0){
  value.textContent='—';bar.style.width='0%';out.textContent='Bitte gültige, nichtnegative Zahlen eingeben.';return;
 }
 if(t===0){value.textContent='–';bar.style.width='100%';out.textContent='Das Restziel ist bereits 0 €. Eine Coverage-Ratio lässt sich dafür nicht sinnvoll berechnen.';return;}
 const c=p/t;
 value.innerHTML=escapeHtml(nf(c,1))+'<span>×</span>';
 bar.style.width=Math.min(100,c/5*100)+'%';
 const required=p>0?t/p*100:null;
 out.textContent=p===0?'Ohne offene Pipeline ist das Restziel mit den erfassten Deals nicht erreichbar.':
  'Um das Restziel zu erreichen, müssten '+nf(required,1)+' % des offenen Pipelinewerts innerhalb der Periode als Gewinn realisiert werden. Das ist nicht dieselbe Kennzahl wie die historische Win Rate.';
}


function renderRequiredCoverage(){
 const form=$('#required-coverage-form');
 const method=form.querySelector('input[name="required-method"]:checked')?.value||'split';
 const split=$('#required-split-fields'),yieldFields=$('#required-yield-fields');
 split.hidden=method!=='split';
 yieldFields.hidden=method!=='yield';
 // Werte aus dem direkt darüber stehenden Rechner werden mitverwendet.
 const inputValue=id=>{
  const raw=$('#'+id).value.trim();
  return raw===''?NaN:Number(raw);
 };
 const pipeline=inputValue('coverage-pipeline'),goal=inputValue('coverage-target');
 const winRate=inputValue('required-win-rate'),onTimeRate=inputValue('required-on-time');
 const inPeriodYield=inputValue('required-yield');
 const result=calculateRequiredCoverage({pipeline,goal,method,winRate,onTimeRate,inPeriodYield});
 const required=$('#required-coverage-value'),current=$('#required-current-value');
 const requiredPipeline=$('#required-pipeline-value'),gap=$('#required-gap-value');
 const formula=$('#required-formula'),explanation=$('#required-explanation');
 const status=$('#required-status');
 const shown=(n,unit)=>n===null||!Number.isFinite(n)?'—':(unit==='×'?nf(n,2)+'×':nf0(n)+' €');
 required.textContent=shown(result.requiredCoverage,'×');
 current.textContent=shown(result.currentCoverage,'×');
 requiredPipeline.textContent=shown(result.requiredPipeline,'€');
 gap.textContent=shown(result.additionalPipeline,'€');
 status.classList.remove('is-sufficient','is-shortfall');
 const effective=result.effectiveRatePercent;
 if(result.error==='invalid'){
  formula.textContent='Bitte die Eingaben prüfen.';
  explanation.textContent='Eingaben dürfen nicht leer oder negativ sein. Prozentwerte müssen zwischen 0 und 100 liegen.';
  status.textContent='Eine Berechnung ist mit diesen Eingaben nicht möglich.';
  return;
 }
 if(method==='split'){
  const lhs='10.000 ÷ ('+nf(winRate,1)+' × '+nf(onTimeRate,1)+')';
  formula.textContent=lhs+' = '+(result.requiredCoverage===null?'nicht berechenbar':nf(result.requiredCoverage,2)+'×');
  explanation.textContent='Von 100 € vergleichbarem Dealwert werden '+nf(winRate,1)+' € gewonnen. Davon kommen '+
   nf(onTimeRate,1)+' % rechtzeitig: Das entspricht '+nf(effective,1)+' € fristgerechtem Gewinnwert pro 100 € Pipeline.';
 }else{
  formula.textContent='100 ÷ '+nf(inPeriodYield,1)+' = '+
   (result.requiredCoverage===null?'nicht berechenbar':nf(result.requiredCoverage,2)+'×');
  explanation.textContent='Von 100 € offener Start-Pipeline habt ihr historisch '+
   nf(effective,1)+' € noch im Zielzeitraum gewonnen. Darauf basiert der benötigte Faktor.';
 }
 if(result.error==='target-reached'){
  status.textContent='Das Restziel beträgt 0 €. Ihr braucht keine zusätzliche Pipeline; eine Coverage ist dann nicht definiert.';
  return;
 }
 if(result.error==='zero-yield'){
  status.textContent='Bei 0 % fristgerechtem Gewinnanteil reicht kein endlicher Pipelinewert. Prüft zuerst die Annahmen und den Verkaufsprozess.';
  return;
 }
 if(result.additionalPipeline>0.005){
  status.classList.add('is-shortfall');
  status.textContent='Die bestehende Pipeline liegt rechnerisch um '+
   nf0(result.additionalPipeline)+' € unter dem benötigten Volumen. Das ist eine Planungslücke, kein sicherer Fehlbetrag.';
 }else{
  status.classList.add('is-sufficient');
  status.textContent='Die bestehende Pipeline erreicht die berechnete Mindestdeckung. Ein Sicherheitspuffer und die Qualität einzelner Deals sind trotzdem wichtig.';
 }
}

const stressDefaults={
 pipeline:450000,goal:150000,winRate:30,onTimeRate:80,
 averageDeal:75000,largestDeal:175000,averageCycle:120,daysLeft:60
};
const stressFields={
 pipeline:'stress-pipeline',goal:'stress-goal',winRate:'stress-win',onTimeRate:'stress-ontime',
 averageDeal:'stress-deal',largestDeal:'stress-largest',averageCycle:'stress-cycle',daysLeft:'stress-days'
};
function renderCoverageStress(){
 const values={};
 for(const [key,id] of Object.entries(stressFields)){
  const input=$('#'+id);
  values[key]=input.value.trim()===''?NaN:Number(input.value);
 }
 const model=diagnoseCoverage(values);
 const outputs={
  'stress-coverage':model?formatValue(model.ratio,'×'):'—',
  'stress-required':model?formatValue(model.requiredCoverage,'×'):'—',
  'stress-expected':model?formatValue(model.expected,'€'):'—',
  'stress-gap':model?formatValue(model.remainingGap,'€'):'—',
  'stress-pipeline-gap':model?formatValue(model.missingPipeline,'€'):'—',
  'stress-extra-deals':model&&model.additionalDeals!==null?nf0(model.additionalDeals):'—'
 };
 for(const [id,value] of Object.entries(outputs))$('#'+id).textContent=value;
 const interpretation=$('#stress-interpretation'),warnings=$('#stress-warnings');
 if(!model){
   interpretation.textContent='Eingaben prüfen: Win Rate und fristgerechter Anteil müssen zwischen 0 % und 100 % liegen. Der größte Deal darf den Pipelinewert nicht überschreiten; Dealgröße und Sales Cycle müssen positiv sein.';
   warnings.replaceChildren();return;
 }
 if(model.goalReached){
  interpretation.textContent='Das Restziel beträgt 0 €. Eine Pipeline Coverage ist in diesem Fall nicht sinnvoll interpretierbar.';
 }else if(model.missingPipeline===null){
  interpretation.textContent='Mit der aktuellen angenommenen Gewinn- und Fristgerechtigkeitsquote gibt es keinen endlichen Pipeline-Zielwert. Prüfe die Annahmen.';
 }else{
  interpretation.textContent='Von '+nf0(values.pipeline)+' € offener Pipeline werden im vereinfachten Modell '+nf0(model.expected)+' € rechtzeitig gewonnen. '+
  (model.remainingGap>0?'Für das Restziel fehlen '+nf0(model.remainingGap)+' € erwarteter Gewinnwert. ':'Das Restziel wird rechnerisch gedeckt. ')+
  'Dafür werden bei den eingestellten Quoten '+nf(model.requiredCoverage,2)+'× Pipeline Coverage benötigt.';
 }
 const messages=[
  'Die Verlustquote allein sagt nichts darüber aus, wann Deals gewonnen oder verloren werden. Verschiebungen bleiben offene Deals.',
  'Die Pipeline umfasst rechnerisch ungefähr '+nf(model.estimatedOpenDeals,1)+' durchschnittlich große Opportunities. Die tatsächliche Dealzahl und Verteilung können abweichen.',
  ...(model.shareLargest!==null?['Größter Deal: '+nf(model.shareLargest,1)+' % der Pipeline. Ohne ihn sinkt der modellierte fristgerechte Wert auf '+nf0(model.expectedWithoutLargest)+' €.']:[]),
  ...model.warnings
 ];
 warnings.replaceChildren(...messages.map(msg=>{const p=document.createElement('p');p.textContent=msg;return p;}));
}

function reverse(){
 const ids=['reverse-target','reverse-win','reverse-ontime','reverse-deal'];
 const nums=ids.map(id=>$('#'+id).value.trim()===''?NaN:Number($('#'+id).value));
 const [target,win,ontime,deal]=nums;
 const valid=nums.every(Number.isFinite)&&target>=0&&win>0&&win<=100&&ontime>0&&ontime<=100&&deal>0;
 const p=valid?win/100*ontime/100:null;
 const needed=p===null?null:target/p;
 const values=valid?[nf0(target)+' €',nf(1/p,1)+'×',nf0(needed)+' €',nf0(Math.ceil(needed/deal))]:['—','—','—','—'];
 ['target','factor','pipeline','deals'].forEach((k,i)=>$('#reverse-out-'+k).textContent=values[i]);
}
function renderSources(){
 const list=$('#sources-list');
 for(const [key,s] of Object.entries(sources)){
  if(key==='wcag')continue;
  const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.name+' ↗';
  const sm=document.createElement('small');sm.textContent=s.note;a.appendChild(sm);list.appendChild(a);
 }
}
function initTheme(){
 try{if(localStorage.getItem('saleskpi-theme')==='dark')document.body.classList.add('dark')}catch{}
 $('#theme-toggle').setAttribute('aria-pressed',String(document.body.classList.contains('dark')));
}
function init(){
 $('#hero-kpi-count').textContent=kpis.length;
 renderNav();renderGrid();renderSources();renderGlossary();initTheme();coverage();renderRequiredCoverage();reverse();renderCoverageStress();
 // Linkziel beim Teilen immer aus der tatsächlich geöffneten Seite ableiten.
 $('#mail-link').href='mailto:?subject='+encodeURIComponent('Sales KPI Atlas – Vertriebskennzahlen verstehen')+'&body='+encodeURIComponent('Ein praxisnahes Nachschlagewerk mit KPI-Rechnern:\n'+location.origin+location.pathname);
 els.filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b)selectFilter(b.dataset.filter,false)});
 els.nav.addEventListener('click',e=>{const a=e.target.closest('[data-filter]');if(a){e.preventDefault();selectFilter(a.dataset.filter,true)}});
 els.search.addEventListener('input',e=>{state.query=e.target.value;if(state.query)state.category='all';renderGrid()});
 $('#reset-filters').addEventListener('click',()=>selectFilter('featured',false));
 $('#empty-reset').addEventListener('click',()=>selectFilter('all',false));
 els.grid.addEventListener('click',e=>{
  const jump=e.target.closest('[data-jump]');
  if(jump){jumpToKpi(jump.dataset.jump);return;}
  const term=e.target.closest('[data-glossary]');
  if(term){jumpToGlossary(term.dataset.glossary);return;}
  const article=e.target.closest('.kpi-card');if(!article)return;
  if(e.target.closest('.kpi-expand'))toggleCard(article);
  if(e.target.closest('.calc-reset')){
   const k=kpiById[article.dataset.id];
   article.querySelectorAll('.calc-input').forEach((input,i)=>input.value=k.fields[i].value);
   updateCardResult(article);
  }
 });
 els.grid.addEventListener('input',e=>{if(e.target.matches('.calc-input'))updateCardResult(e.target.closest('.kpi-card'))});
 document.addEventListener('click',e=>{
  const term=e.target.closest('[data-glossary]');
  if(term&&!els.grid.contains(term)){e.preventDefault();jumpToGlossary(term.dataset.glossary);return;}
  const j=e.target.closest('[data-jump], [data-open-kpi]');
  if(j&&!els.grid.contains(j)){e.preventDefault();jumpToKpi(j.dataset.jump||j.dataset.openKpi);}
 });
 ['coverage-pipeline','coverage-target'].forEach(id=>$('#'+id).addEventListener('input',()=>{coverage();renderRequiredCoverage()}));
 $('#required-coverage-form').addEventListener('input',renderRequiredCoverage);
 $('#required-coverage-form').addEventListener('change',renderRequiredCoverage);
 $('#required-coverage-form').addEventListener('submit',e=>e.preventDefault());
 $('#required-reset').addEventListener('click',()=>{
   $('#required-win-rate').value='30';
   $('#required-on-time').value='80';
   $('#required-yield').value='24';
   $('#required-coverage-form').querySelector('input[value="split"][name="required-method"]').checked=true;
   renderRequiredCoverage();
 });
 $('#glossary-search').addEventListener('input',renderGlossary);
 $('#coverage-lab-form').addEventListener('input',renderCoverageStress);
 $('#coverage-lab-form').addEventListener('submit',e=>e.preventDefault());
 $('#stress-reset').addEventListener('click',()=>{for(const [key,id] of Object.entries(stressFields))$('#'+id).value=stressDefaults[key];renderCoverageStress()});
 $('#reverse-form').addEventListener('input',reverse);
 $('#reverse-form').addEventListener('submit',e=>e.preventDefault());
 $('#theme-toggle').addEventListener('click',()=>{
   const active=document.body.classList.toggle('dark');
   $('#theme-toggle').setAttribute('aria-pressed',String(active));
   try{localStorage.setItem('saleskpi-theme',active?'dark':'light')}catch{}
 });
 $('#share-button').addEventListener('click',async()=>{
  const url=location.origin+location.pathname+(location.hash||'');
  try{
   if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(url);
   else{
    const i=document.createElement('textarea');i.value=url;i.style.position='fixed';i.style.opacity='0';document.body.append(i);i.select();
    if(!document.execCommand('copy'))throw new Error('copy failed');i.remove();
   }
   showToast('Link wurde kopiert.');
  }catch{showToast('Kopieren nicht möglich. Bitte die Browser-Adresszeile nutzen.');}
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
   e.preventDefault();els.search.focus();$('#bibliothek').scrollIntoView({behavior:motion(),block:'start'});
  }
  if(e.key==='Escape'&&document.activeElement===els.search){els.search.blur()}
 });
 const anchor=decodeURIComponent(location.hash.replace(/^#/,''));
 if(anchor.startsWith('kpi-')&&kpiById[anchor.slice(4)]){
  const id=anchor.slice(4);
  jumpToKpi(id);
 }else if(anchor.startsWith('begriff-')&&glossaryById[anchor.slice(8)]){
  jumpToGlossary(anchor.slice(8));
 }
}
init();
