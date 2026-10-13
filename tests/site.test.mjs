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
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|analytics|gtag\(/);
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
