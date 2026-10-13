import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {kpis} from '../kpis.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('Seite hat korrekte Sprache, Titel und Semantik',()=>{
 assert.match(html,/<html lang="de">/);
 assert.match(html,/<main id="main">/);
 assert.match(html,/<h1 id="hero-title">/);
 assert.match(html,/<nav id="category-nav"/);
 assert.match(html,/class="skip-link"/);
});
test('Alle für die interaktive Oberfläche nötigen UI-Ziele sind vorhanden',()=>{
 for(const id of ['category-filters','category-nav','kpi-search','kpi-grid','coverage-pipeline','coverage-target','reverse-target','reverse-win','reverse-deal','theme-toggle','share-button','mail-link','sources-list'])
   assert.ok(html.includes('id="'+id+'"'),id+' muss im HTML existieren');
});
test('Externe Abhängigkeiten, Tracking und Fremdskripte werden nicht benötigt',()=>{
 assert.match(html,/<script type="module" src="\.\/app\.js"><\/script>/);
 assert.doesNotMatch(html,/<script[^>]+src="https?:/);
 assert.doesNotMatch(html,/<link[^>]+stylesheet[^>]+href="https?:/);
 assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|\bgtag\s*\(|\banalytics\s*\(/);
});
test('Responsive und Tastaturbedienung sind implementiert',()=>{
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css, /prefers-reduced-motion/);
 assert.match(css, /focus-visible/);
 assert.match(js,/aria-expanded/);
 assert.match(js,/e\.key==='\/'/);
});
test('Katalog und Kopfangabe stimmen überein',()=>{
 assert.ok(kpis.length>=60);
 assert.ok(html.includes('id="hero-kpi-count"'));
 assert.ok(js.includes('kpis.length'));
});

test('Die sechs Stationen im interaktiven Wirkungsmodell sind erreichbar',()=>{
 for(const id of ['akquise','pipeline','abschluss','forecast','bestand','effizienz']){
  assert.match(html,new RegExp('data-map-node="'+id+'"'),id);
 }
 assert.match(html,/id="map-detail-links"/);
 assert.match(js,/function renderGraphStation/);
});
test('Offizielles Material-Icon-Sprite lokal integriert statt externen Google-Fonts-Request',()=>{
 assert.match(html,/material-icons\.svg#space_dashboard/);
 assert.doesNotMatch(html,/fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test('Lesbare rem-Typografie: keine festen Texte unter 14px mehr',()=>{
 const fixedSizes=[...css.matchAll(/font-size\s*:\s*([0-9.]+)px/g)];
 const tiny=fixedSizes.filter(m=>Number(m[1])<14);
 assert.equal(tiny.length,0,'Unlesbare feste Schriftgrößen: '+tiny.map(m=>m[0]).join(', '));
 for(const token of ['--font-caption:.8125rem','--font-small:.875rem','--font-support:.9375rem','--font-body:1rem']){
  assert.ok(css.includes(token),'Fehlende Typografiestufe: '+token);
 }
 for(const fragment of ['html{font-size:100%','.guidance-indicator p','.calc-fields input','@media(max-width:350px)']){
  assert.ok(css.includes(fragment),'Typografie-Regel fehlt: '+fragment);
 }
});
