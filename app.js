import {dependencies} from './dependencies.js';
import {glossary,glossaryById} from './glossary.js';
import {diagnoseCoverage,calculateRequiredCoverage} from './coverage-model.js';
import {categories,kpis,kpiById,sources,evaluate} from './kpis.js';
import {kpiGuidance,guidanceEvidence,assessKpiValue} from './kpi-guidance.js';

const $=selector=>document.querySelector(selector);
const materialIcon=name=>'<svg class="ms-icon" aria-hidden="true"><use href="./material-icons.svg#'+name+'"></use></svg>';
const graphStations={
 akquise:{
  label:'01 / AKQUISE',
  title:'Aus Kontakten qualifizierte Chancen machen',
  description:'Hier entsteht der Zufluss: Nicht die Anzahl der Leads allein zählt, sondern wie viele Kontakte zu relevanten, bearbeitbaren Opportunities werden.',
  caution:'Achtung: Hohe Lead-Mengen oder Conversion-Raten garantieren weder Dealqualität noch Umsatz. Gleiche Lead-Kohorten vergleichen.',
  kpis:['lead-conversion','sql-opportunity','source-yield']
 },
 pipeline:{
  label:'02 / PIPELINE',
  title:'Volumen und Abschlusschancen beurteilen',
  description:'Die Pipeline zeigt offene Verkaufschancen. Die benötigte Coverage hängt unter anderem von der rechtzeitigen Wertrealisierung ab – nicht von einer pauschalen 3×-Regel.',
  caution:'Wichtige Abgrenzung: Nominale Coverage ist keine Gewinnwahrscheinlichkeit. Perioden- und Stichtagskohorten konsistent halten.',
  kpis:['pipeline-coverage','required-coverage','in-period-yield']
 },
 abschluss:{
  label:'03 / ABSCHLUSS',
  title:'Erfolg in gewonnene Aufträge übersetzen',
  description:'Abschlussquote, durchschnittlicher Dealwert und Auftragsvolumen erklären, wie viel Wert aus qualifizierten Chancen tatsächlich gewonnen wird.',
  caution:'Stückzahlbasierte und wertgewichtete Win Rate beantworten unterschiedliche Fragen. Zeiträume und Segmente nicht vermischen.',
  kpis:['win-rate-value','avg-deal','quota-attainment']
 },
 forecast:{
  label:'04 / FORECAST',
  title:'Abschlusszeitpunkt und Prognose prüfen',
  description:'Forecast-Güte hängt nicht nur von Pipelinevolumen ab: Verschobene Close Dates und optimistische Commit-Angaben können die Periodenprognose verzerren.',
  caution:'Eine gewichtete Pipeline ist nicht automatisch ein Forecast für einen Zeitraum. Zeitfenster und Fehlerdefinition separat prüfen.',
  kpis:['forecast-error','slippage','commit-hit']
 },
 bestand:{
  label:'05 / KUNDENBINDUNG',
  title:'Wert des vorhandenen Kundenstamms sichern',
  description:'Churn und Expansion verändern den Bestand unabhängig davon, wie viele neue Logos akquiriert werden. NRR berücksichtigt Expansion, GRR nicht.',
  caution:'Retention nur anhand derselben Startkundenkohorte bewerten. Neukunden zählen nicht zum NRR-Zähler.',
  kpis:['nrr','grr','logo-churn']
 },
 effizienz:{
  label:'06 / EFFIZIENZ',
  title:'Wachstum und Wirtschaftlichkeit zusammenführen',
  description:'Ein steigender Auftragseingang kann teuer erkauft sein. Akquisekosten, Bruttomarge und produktive Kapazität helfen dabei, wirtschaftliches Wachstum zu bewerten.',
  caution:'CAC Payback, Consulting-Margen und SaaS-Bruttomargen verwenden verschiedene Bezugsgrößen. Geschäftsmodelle nicht blind vergleichen.',
  kpis:['cac-payback','gross-margin','project-margin']
 }
};
let selectedGraphStation='akquise';
function renderGraphStation(id,{focus=false}={}){
 const station=graphStations[id];if(!station)return;
 selectedGraphStation=id;
 document.querySelectorAll('[data-map-node]').forEach(button=>{
  const active=button.dataset.mapNode===id;
  button.classList.toggle('is-selected',active);
  button.setAttribute('aria-pressed',String(active));
 });
 $('#map-detail-kicker').textContent=station.label;
 $('#map-detail-title').textContent=station.title;
 $('#map-detail-description').textContent=station.description;
 $('#map-detail-caution').textContent=station.caution;
 const container=$('#map-detail-links');
 container.replaceChildren(...station.kpis.filter(k=>kpiById[k]).map(id=>{
  const button=document.createElement('button');
  button.type='button';button.className='map-kpi-link';
  button.dataset.jump=id;
  const strong=document.createElement('strong');strong.textContent=kpiById[id].title;
  const ico=document.createElement('span');ico.className='map-kpi-action';ico.innerHTML=materialIcon('arrow_forward');
  button.append(strong,ico);return button;
 }));
 if(focus)$('#map-detail-title').focus({preventScroll:true});
 saveCurrentView();
}

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

function initSectionHighlight(){
 const all=[...document.querySelectorAll('main > section[id]')];
 const grouped={
  start:'start',einstieg:'start',zusammenhaenge:'zusammenhaenge',
  kernbeispiel:'kernbeispiel',einflussfaktoren:'kernbeispiel',
  'coverage-stresstest':'kernbeispiel',rueckwaerts:'kernbeispiel',
  bibliothek:'bibliothek',glossar:'glossar',methodik:'glossar'
 };
 let scheduled=false;
 const update=()=>{
  scheduled=false;
  const edge=window.scrollY+Math.min(180,window.innerHeight*.32);
  const current=all.filter(section=>section.offsetTop<=edge).at(-1)?.id||'start';
  const selected=grouped[current]||'start';
  document.querySelectorAll('.nav-primary .side-link,.mobile-section-nav a').forEach(link=>{
   const active=link.getAttribute('href')==='#'+selected;
   link.classList.toggle('is-current',active);
   if(active)link.setAttribute('aria-current','location');
   else link.removeAttribute('aria-current');
  });
 };
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 schedule();
}

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
   const n=document.createElement('span');n.className='category-numeral';n.innerHTML=materialIcon(({akquise:'groups',pipeline:'account_tree',abschluss:'trending_up',saas:'hub',effizienz:'analytics',consulting:'calculate',steuerung:'query_stats'})[c.id]||'space_dashboard');
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
function openGlossaryView(id){
 if(!glossaryById[id])return;
 $('#glossary-search').value='';
 renderGlossary();
 const entry=document.getElementById('begriff-'+id);
 if(!entry)return;
 entry.open=true;
 entry.scrollIntoView({behavior:'instant',block:'start'});
 entry.querySelector('summary').focus({preventScroll:true});
}
function jumpToGlossary(id,source){
 if(glossaryById[id])navigateWithinAtlas('#begriff-'+id,source);
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


function guidanceMarkup(k){
 const g=kpiGuidance[k.id];if(!g)return '';
 const e=guidanceEvidence[k.id]||{type:'Individueller Ziel-/Trendvergleich'};
 const source=e.source&&sources[e.source];
 const sourceLink=source?'<a href="'+escapeHtml(source.url)+'" target="_blank" rel="noopener noreferrer" class="guidance-citation">Nachweis: '+escapeHtml(source.name)+' ↗</a>':'';
 const title=k.title;
 return '<section class="guidance-panel" aria-label="Praxisbewertung für '+escapeHtml(title)+'">'+
  '<header class="guidance-header"><div><span class="detail-label">ENTSCHEIDUNGSHILFE</span>'+
  '<h4>Ist dieser Wert gut oder kritisch?</h4></div>'+
  '<span class="guidance-evidence">'+escapeHtml(e.type)+'</span></header>'+
  '<p class="guidance-reference"><strong>Bekannter Richtwert / Vergleich:</strong> '+escapeHtml(k.benchmark)+'</p>'+
  '<div class="guidance-result" hidden role="status" aria-live="polite"><span class="guidance-result-label"></span><span class="guidance-result-detail"></span></div>'+
  '<div class="guidance-scale" role="list">'+
   '<div class="guidance-indicator good" role="listitem"><span class="guidance-indicator-title">Gutes Signal</span><p>'+escapeHtml(g.good)+'</p></div>'+
   '<div class="guidance-indicator watch" role="listitem"><span class="guidance-indicator-title">Beobachten</span><p>'+escapeHtml(g.warning)+'</p></div>'+
   '<div class="guidance-indicator critical" role="listitem"><span class="guidance-indicator-title">Kritisch / alarmierend</span><p>'+escapeHtml(g.critical)+'</p></div>'+
  '</div>'+
  '<div class="guidance-reason-grid"><div><span class="detail-label">WARUM DAS WICHTIG IST</span><p>'+escapeHtml(g.why)+'</p></div>'+
  '<div><span class="detail-label">KONKRETER NÄCHSTER SCHRITT</span><p>'+escapeHtml(g.next)+'</p></div></div>'+
  (sourceLink?'<p class="guidance-reference-source">'+sourceLink+'</p>':'')+
  '<p class="guidance-disclaimer">Fachliche Einordnung statt automatisch belegter Unternehmensdiagnose. Segment, Definition, Zeitraum und Vergleichskohorte müssen passen.</p>'+
  '</section>';
}
function updateGuidanceResult(article,k,value){
 const panel=article.querySelector('.guidance-result');
 if(!panel)return;
 const message=assessKpiValue(k.id,value);
 panel.hidden=!message;
 if(!message)return;
 panel.className='guidance-result is-'+message.level;
 panel.querySelector('.guidance-result-label').textContent='Dein Rechenwert: '+message.label;
 panel.querySelector('.guidance-result-detail').textContent=message.detail;
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
  '<button type="button" class="kpi-expand" aria-expanded="false" aria-controls="detail-'+escapeHtml(k.id)+'">Formel, Beispiel & Rechner anzeigen <span class="expand-symbol" aria-hidden="true">'+materialIcon('arrow_forward')+'</span></button></div>'+
  '<div id="detail-'+escapeHtml(k.id)+'" class="kpi-detail" hidden>'+
  termLinksForKpi(k)+'<span class="detail-label">Die Formel</span><div class="formula-box">'+escapeHtml(k.formula)+'</div>'+
  '<span class="detail-label">Beispielrechnung</span><p class="sample-line">'+escapeHtml(k.example)+'</p>'+
  '<section class="calc-wrap" aria-label="KPI-Rechner '+escapeHtml(k.title)+'"><div class="calc-title"><strong>Mit eigenen Zahlen rechnen</strong><button class="calc-reset" type="button">Beispielwerte ↺</button></div>'+
  '<div class="calc-fields">'+inputs+'</div><div class="calc-result"><span>BERECHNETER WERT</span><output aria-live="polite">'+escapeHtml(formatValue(evaluate(k,k.fields.map(f=>f.value)),k.unit))+'</output></div>'+
  '<p class="calc-error" aria-live="polite"></p></section>'+
  guidanceMarkup(k)+dependencyExplanation(k)+'<div class="detail-block"><span class="detail-label">So liest du das Ergebnis</span><p>'+escapeHtml(k.reading)+'</p></div>'+
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
 updateGuidanceResult(article,k,result);
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
function openKpiView(id){
 if(!kpiById[id])return;
 state.category='all';state.query='';els.search.value='';
 renderGrid();
 const card=document.getElementById('kpi-'+id);if(!card)return;
 toggleCard(card,true);
 card.scrollIntoView({behavior:'instant',block:'start'});
 card.querySelector('.kpi-expand').focus({preventScroll:true});
}
function jumpToKpi(id,source){
 if(kpiById[id])navigateWithinAtlas('#kpi-'+id,source);
}


/**
 * Navigation mit echtem Browser-Verlauf. Jeder interne Sprung speichert den
 * Ausgangszustand, inklusive Suche, Filtern, offenen Karten und Rechnerwerten.
 * Zurück/Vorwärts rekonstruiert diesen Zustand an der ursprünglichen Scrollposition.
 * Absichtlich kein sessionStorage: Der Browserverlauf ist die einzige Quelle.
 */
let handledHash=location.hash;
let restoringNavigation=false;
function focusReference(element){
 if(!element||element===document.body)return null;
 if(element.id)return {kind:'id',value:element.id};
 const card=element.closest('.kpi-card');
 if(card){
  const id=card.dataset.id;
  if(element.matches('[data-jump]'))return {kind:'card-jump',id,value:element.dataset.jump};
  if(element.matches('[data-glossary]'))return {kind:'card-term',id,value:element.dataset.glossary};
  if(element.matches('.kpi-expand'))return {kind:'card-expand',id};
 }
 const entry=element.closest('.glossary-item');
 if(entry){
  if(element.matches('summary'))return {kind:'glossary-summary',id:entry.id};
  if(element.matches('[data-jump]'))return {kind:'glossary-jump',id:entry.id,value:element.dataset.jump};
 }
 if(element.matches('a[href^="#"]'))return {kind:'anchor',value:element.getAttribute('href')};
 return null;
}
function resolveFocus(ref){
 if(!ref)return null;
 if(ref.kind==='id')return document.getElementById(ref.value);
 if(ref.kind==='anchor')return [...document.querySelectorAll('a[href^="#"]')]
  .find(el=>el.getAttribute('href')===ref.value);
 if(ref.kind.startsWith('card-')){
  const card=document.getElementById('kpi-'+ref.id);
  if(!card)return null;
  if(ref.kind==='card-expand')return card.querySelector('.kpi-expand');
  const attr=ref.kind==='card-jump'?'jump':'glossary';
  return [...card.querySelectorAll('[data-'+attr+']')].find(el=>el.dataset[attr]===ref.value);
 }
 const entry=document.getElementById(ref.id);
 if(!entry)return null;
 if(ref.kind==='glossary-summary')return entry.querySelector('summary');
 if(ref.kind==='glossary-jump')return [...entry.querySelectorAll('[data-jump]')]
  .find(el=>el.dataset.jump===ref.value);
 return null;
}
function captureView(source){
 return {
  category:state.category,
  query:state.query,
  glossaryQuery:$('#glossary-search').value,
  graphStation:selectedGraphStation,
  openCards:[...els.grid.querySelectorAll('.kpi-card.open')].map(card=>({
   id:card.dataset.id,
   values:[...card.querySelectorAll('.calc-input')].map(input=>input.value)
  })),
  openGlossary:[...document.querySelectorAll('#glossary-grid .glossary-item[open]')].map(el=>el.id),
  y:window.scrollY,
  focus:focusReference(source||document.activeElement)
 };
}
function saveCurrentView(source){
 const current=history.state?.atlasView;
 if(!current||restoringNavigation)return;
 history.replaceState({
  ...history.state,
  atlasView:{...current,snapshot:captureView(source)}
 },'',location.href);
}
function updateBackButton(){
 const depth=history.state?.atlasView?.depth||0;
 $('#jump-return').hidden=depth<1;
}
function restoreView(snapshot){
 if(!snapshot){renderHashView(location.hash);return;}
 restoringNavigation=true;
 state.category=snapshot.category||'featured';
 state.query=snapshot.query||'';
 els.search.value=state.query;
 renderGrid();
 for(const saved of snapshot.openCards||[]){
  const card=document.getElementById('kpi-'+saved.id);
  if(!card)continue;
  toggleCard(card,true);
  card.querySelectorAll('.calc-input').forEach((input,i)=>{
   if(saved.values[i]!==undefined)input.value=saved.values[i];
  });
  updateCardResult(card);
 }
 renderGraphStation(graphStations[snapshot.graphStation]?snapshot.graphStation:'akquise');
 $('#glossary-search').value=snapshot.glossaryQuery||'';
 renderGlossary();
 for(const id of snapshot.openGlossary||[]){
  const entry=document.getElementById(id);if(entry)entry.open=true;
 }
 // Nach dem Wiederaufbau der DOM-Elemente scrollen und den Ausgangsfokus setzen.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  window.scrollTo({top:Math.max(0,snapshot.y||0),behavior:'instant'});
  const target=resolveFocus(snapshot.focus);
  if(target&&target.getClientRects().length)target.focus({preventScroll:true});
  restoringNavigation=false;
 }));
}
function renderHashView(hash){
 let id;
 try{id=decodeURIComponent(hash.replace(/^#/,''))}catch{return;}
 if(id.startsWith('kpi-')&&kpiById[id.slice(4)]){
  openKpiView(id.slice(4));
 }else if(id.startsWith('begriff-')&&glossaryById[id.slice(8)]){
  openGlossaryView(id.slice(8));
 }else if(id){
  const target=document.getElementById(id);
  if(target)target.scrollIntoView({behavior:'instant',block:'start'});
 }
}
function navigateWithinAtlas(hash,source,afterNavigation){
 const prior=history.state?.atlasView;
 const depth=prior?.depth||0;
 // Vor dem Sprung den Zustand des Ausgangsorts in dessen History-Eintrag sichern.
 if(prior)saveCurrentView(source);
 else history.replaceState({atlasView:{depth:0,snapshot:captureView(source)}},'',location.href);
 history.pushState({atlasView:{depth:depth+1,snapshot:null}},'',hash);
 if(afterNavigation)afterNavigation();
 renderHashView(hash);
 handledHash=location.hash;
 saveCurrentView();
 updateBackButton();
}
function goBackToSource(){
 if((history.state?.atlasView?.depth||0)>0)history.back();
}
function restoreFromHistory(event){
 handledHash=location.hash;
 if(event.state?.atlasView?.snapshot)restoreView(event.state.atlasView.snapshot);
 else renderHashView(location.hash);
 updateBackButton();
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
 // Die Visualisierung verwendet die tatsächliche, berechnete Ziel-Coverage.
 const cover=result.currentCoverage,requiredRatio=result.requiredCoverage;
 const scale=Math.max(5,Math.ceil(Math.max(
  Number.isFinite(cover)?cover:0,
  Number.isFinite(requiredRatio)?requiredRatio:0
 )*1.1));
 $('#coverage-scale-max').textContent=nf0(scale)+'×';
 $('#coverage-benchmark-label').textContent='Benötigt: '+(Number.isFinite(requiredRatio)?nf(requiredRatio,2)+'×':'—');
 const marker=$('#coverage-target-marker');
 marker.style.display=Number.isFinite(requiredRatio)?'block':'none';
 if(Number.isFinite(requiredRatio))marker.style.left=(requiredRatio/scale*100)+'%';
 $('#coverage-fill').style.width=Number.isFinite(cover)?Math.min(100,cover/scale*100)+'%':'0%';
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
 $('#theme-toggle').innerHTML=materialIcon(document.body.classList.contains('dark')?'light_mode':'dark_mode');
}
function init(){
 try{history.scrollRestoration='manual'}catch{}
 $('#hero-kpi-count').textContent=kpis.length;
 $('#hero-category-count').textContent=categories.length;
 $('#hero-glossary-count').textContent=glossary.length;
 renderNav();renderGrid();renderSources();renderGlossary();renderGraphStation('akquise');initTheme();coverage();renderRequiredCoverage();reverse();renderCoverageStress();initSectionHighlight();
 // Linkziel beim Teilen immer aus der tatsächlich geöffneten Seite ableiten.
 $('#mail-link').href='mailto:?subject='+encodeURIComponent('Sales KPI Atlas – Vertriebskennzahlen verstehen')+'&body='+encodeURIComponent('Ein praxisnahes Nachschlagewerk mit KPI-Rechnern:\n'+location.origin+location.pathname);
 els.filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){selectFilter(b.dataset.filter,false);saveCurrentView()}});
 els.nav.addEventListener('click',e=>{const a=e.target.closest('[data-filter]');if(a){e.preventDefault();navigateWithinAtlas('#bibliothek',a,()=>selectFilter(a.dataset.filter,false))}});
 els.search.addEventListener('input',e=>{state.query=e.target.value;if(state.query)state.category='all';renderGrid();saveCurrentView()});
 $('#reset-filters').addEventListener('click',()=>{selectFilter('featured',false);saveCurrentView()});
 $('#empty-reset').addEventListener('click',()=>{selectFilter('all',false);saveCurrentView()});
 els.grid.addEventListener('click',e=>{
  const jump=e.target.closest('[data-jump]');
  if(jump){jumpToKpi(jump.dataset.jump,jump);return;}
  const term=e.target.closest('[data-glossary]');
  if(term){jumpToGlossary(term.dataset.glossary,term);return;}
  const article=e.target.closest('.kpi-card');if(!article)return;
  if(e.target.closest('.kpi-expand')){toggleCard(article);saveCurrentView();}
  if(e.target.closest('.calc-reset')){
   const k=kpiById[article.dataset.id];
   article.querySelectorAll('.calc-input').forEach((input,i)=>input.value=k.fields[i].value);
   updateCardResult(article);saveCurrentView();
  }
 });
 els.grid.addEventListener('input',e=>{if(e.target.matches('.calc-input')){updateCardResult(e.target.closest('.kpi-card'));saveCurrentView()}});
 document.addEventListener('click',e=>{
  const term=e.target.closest('[data-glossary]');
  if(term&&!els.grid.contains(term)){
   e.preventDefault();jumpToGlossary(term.dataset.glossary,term);return;
  }
  const j=e.target.closest('[data-jump], [data-open-kpi]');
  if(j&&!els.grid.contains(j)){
   e.preventDefault();jumpToKpi(j.dataset.jump||j.dataset.openKpi,j);return;
  }
  // Auch reine Sprunglinks (z. B. zu einem Rechner oder Abschnitt) sind umkehrbar.
  const a=e.target.closest('a[href^="#"]');
  if(a&&!a.matches('[data-filter],[data-glossary],[data-open-kpi],[data-jump]')){
   e.preventDefault();navigateWithinAtlas(a.getAttribute('href'),a);
  }
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
 $('#glossary-search').addEventListener('input',()=>{renderGlossary();saveCurrentView()});
 $('#glossary-grid').addEventListener('toggle',()=>saveCurrentView(),true);
 $('#coverage-lab-form').addEventListener('input',renderCoverageStress);
 $('#coverage-lab-form').addEventListener('submit',e=>e.preventDefault());
 $('#stress-reset').addEventListener('click',()=>{for(const [key,id] of Object.entries(stressFields))$('#'+id).value=stressDefaults[key];renderCoverageStress()});
 $('#reverse-form').addEventListener('input',reverse);
 $('#reverse-form').addEventListener('submit',e=>e.preventDefault());
 $('#theme-toggle').addEventListener('click',()=>{
   const active=document.body.classList.toggle('dark');
   $('#theme-toggle').setAttribute('aria-pressed',String(active));
   $('#theme-toggle').innerHTML=materialIcon(active?'light_mode':'dark_mode');
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
 $('#jump-return-button').addEventListener('click',goBackToSource);
 $('.kpi-map').addEventListener('click',event=>{
  const button=event.target.closest('[data-map-node]');
  if(button){
   renderGraphStation(button.dataset.mapNode);
   if(window.matchMedia('(max-width:760px)').matches){
    requestAnimationFrame(()=>{
     $('#map-detail').scrollIntoView({behavior:motion(),block:'start'});
     $('#map-detail-title').focus({preventScroll:true});
    });
   }
  }
 });
 $('#map-change-station').addEventListener('click',()=>{
  $('.kpi-map').scrollIntoView({behavior:motion(),block:'start'});
  $('.map-node.is-selected')?.focus({preventScroll:true});
 });

 window.addEventListener('popstate',restoreFromHistory);
 window.addEventListener('hashchange',()=>{
  // Popstate verarbeitet Browser-Zurück bereits; Hashchange nicht doppelt ausführen.
  if(handledHash!==location.hash){handledHash=location.hash;renderHashView(location.hash);}
 });
 renderHashView(location.hash);
 // Direkte Links sind der Anfang einer Sitzung und besitzen keinen erfundenen Rücksprung.
 history.replaceState({
  ...(history.state||{}),
  atlasView:{depth:0,snapshot:captureView()}
 },'',location.href);
 updateBackButton();
}
init();
