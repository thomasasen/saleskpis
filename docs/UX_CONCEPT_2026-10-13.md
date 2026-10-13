# UX-Konzept und fachliche Gegenprüfung · Sales KPI Atlas
**Version:** 13. Oktober 2026 · **Status:** Umgesetzte UX-Iteration, automatisierte Abnahme im Repository.
**Evidenz:** Code- und UX-Heuristikreview, bestehendes Red-Team-Audit, Material-Design-/W3C-Leitlinien; **keine echten Stakeholder-Interviews und keine Nutzertests mit realen CSOs/AMs**. Die Rollenprüfung unten ist eine explizit *simulierte* Perspektivenprüfung und nicht als zitierte Aussage einer realen Person zu verstehen.

## 1. Problem und Designprinzip
Bisher waren fast alle Abschnitte gleich gewichtet: Sidebar mit vielen Links, langer Einstieg mit Beispielen, und der einzige grafische Zusammenhang war eine Vier-Stationen-Kette. Gleichzeitig vermittelte die dekorative Hero-Kurve Live-Daten, obwohl die Seite ein statisches Lern- und Modellierungswerkzeug ist. Zu häufige Verzweigungen können Orientierung und Rückweg erschweren.

**Leitidee: „Frage → Zusammenhang → Kennzahl → Berechnung → Entscheidung“.** Nicht ein Dashboard simulieren, sondern ein **Decision Support Learning Tool**: wenige klare Entscheidungen im Einstieg, dann begründet vertiefen. Alle 67 KPIs bleiben erhalten, ebenso Formeln, Quellen, Glossar, Coverage-Rechner, Risikotest und Browser-Zurückfunktion.

**Informationsarchitektur (5 gleichwertige Ziele):**
1. **Überblick:** Welches Problem will ich klären?
2. **Zusammenhänge:** Sechs Stationen einer vereinfachten B2B-Umsatzreise mit Drilldown und Hinweisen.
3. **KPI-Bibliothek:** gezielte Suche, sieben Fachbereiche und Einzelrechner.
4. **Pipeline berechnen:** vorhandenes Potenzial mit periodischem Ziel abgleichen.
5. **Begriffe lernen:** Glossar ohne vorausgesetzte Fachexpertise.

Vertiefungen (Fristrisiko, rückwärts planen, Methodik) werden im Seitenmenü angeboten, aber bewusst nicht als zusätzliche Hauptnavigation verwaltet. Auf Smartphones eine scrollbare, beschriftete Primärnavigation statt zwei konkurrierende Menüs.

## 2. Visualisierte Beziehungen
Die Grafik ist **eine navigierbare konzeptionelle Prozesskarte**, keine statistische Kausalgrafik. Sechs auswählbare Stationen:

| Station | Fokus | KPI-Drilldowns | Typische Fehlannahme |
| --- | --- | --- | --- |
| Akquise | Kontakte → qualifizierte Chancen | Lead Conversion, SQL→Opportunity, Source Yield | Mehr Leads = mehr Umsatz |
| Pipeline | Bestand, Ziel-Coverage und Timing | Pipeline Coverage, Required Coverage, In-Period Yield | 3× garantiert ausreichende Pipeline |
| Abschluss | wertgewichteter Gewinn und Ziel | Win Rate (Wert), Average Deal Size, Quota Attainment | Stückzahlquote = Wertquote |
| Forecast | Zeitraum und Prognosegüte | Forecast Error, Slippage, Commit Hit | Gewichtete Pipeline = Periodenumsatz |
| Kundenbindung | Bindung, Kündigung, Expansion | NRR, GRR, Logo Churn | NRR enthält Neukunden |
| Effizienz | Akquisekosten, Marge, Dienstleistung | CAC Payback, Gross Margin, Project Margin | Hoher Umsatz = hohe Profitabilität |

**Interaktion:** Auswahl per Maus, Touch, Enter oder Leertaste (native Buttons), sichtbarer Auswahlzustand mit aria-pressed. Daneben/darunter erscheint eine erklärende Station mit drei echten KPI-Links. Der Aufruf eines Rechners nutzt den bereits bestehenden Verlauf inklusive präzisem Rücksprung. Pfeile dienen der Orientierung, nicht als Definition mathematischer Abhängigkeiten. Für schmale Displays wird das Diagramm in Karten mit logischer Lesereihenfolge übersetzt. Kein unzugänglicher Canvas und kein komplexer Force-Directed-Graph aus 67 unlesbaren Knoten.

## 3. Simuliertes Red Team aus sechs Rollen (keine reale Befragung)

| Rollenperspektive | Herausfordernde Frage | UX-Entscheidung / Prüfmaßstab |
| --- | --- | --- |
| **CRO** | „Wie vermeide ich, dass ein hübscher Funnel operative Scheingenauigkeit vorgaukelt?“ | Keine synthetischen Trend-Charts, explizit Beispiellogik, keine Live-CRM-Daten; KPI-Grenzen in der Detailansicht |
| **CSO** | „Wo fange ich an, wenn die Zielerreichung gefährdet ist?“ | Drei Aufgaben-Einstiege, Pipeline-Rechner, direkt verlinkte Coverage-/Yield-KPIs und Forecast-Station |
| **Head of Sales** | „Kann ich Ursachen für Leistungslücken identifizieren, ohne 67 Kacheln abzuklappern?“ | Sechs priorisierte Stationen plus thematische Filter; KPI-Verknüpfungen und Rücksprung bleiben erhalten |
| **Senior Account Manager** | „Wie unterscheiden sich Pipeline-Menge, Dealqualität, Timing und echte Retention?“ | Erklärte Wechselwirkungen; gesonderte Pipeline-, Forecast- und Bestandssicht; mathematische Abgrenzung |
| **Junior Account Manager** | „Verstehe ich neue Begriffe und finde ich meine vorherige Stelle wieder?“ | Beschriftete Icons, verständliche Verben, Glossar, minimale Auswahl im Einstieg und reversible Navigation |
| **Sales Operations / RevOps** | „Sind Einheiten, Cohorts, Quellen und Eingaben konsistent?“ | Unveränderte 67 Datenmodelle und Validierungen; methodische Warnungen; keine generische Weltformel |

**Abgelehnte Alternativen:**
- **Ungefiltertes Netz mit 67 Knoten:** zu wenig lesbar und auf Mobilgeräten unbedienbar.
- **Für jede Rolle eine andere Website:** erhöht Pflegeaufwand, verdeckt gemeinsame Definitionen.
- **Dekorativer Live-Revenue-Trend:** suggeriert Daten, die nicht existieren.
- **Nur Symbol-Buttons ohne Text:** höhere Erinnerungsanforderungen und unklar für Anfänger.
- **Extern geladene Google-Icons:** unnötige Drittanfragen und Offline-Abhängigkeit.

**Explizit offen:** Die Rollenperspektiven sind eine methodische Design-Challenge, keine valide Nutzerevidenz. Eine echte Runde mit 1–2 Teilnehmenden je Vertriebsrolle, beobachteten Aufgaben, Think-Aloud-Interviews und Erfolgsquoten bleibt die nächste Validierungsstufe.

## 4. Designsystem und Material Icons
- **Material Symbols Rounded** direkt aus dem offiziellen Repository [google/material-design-icons](https://github.com/google/material-design-icons), als eigenes lokales SVG-Sprite `material-icons.svg`; Herkunfts-/Lizenznachweis in `MATERIAL_SYMBOLS_LICENSE.txt` (**Apache-2.0**). Keine Font-Datei, kein Google-Fonts-Netzwerkrequest.
- Zur Wiedererkennung immer **Icon + Text** in der Primärnavigation; keine icon-only-Hauptnavigation. Icons dekorativ `aria-hidden=true`; Buttons behalten Klartextlabel bzw. `aria-label`.
- Farbschema ruhig und kontrastorientiert: dunkles Petrol für Strategie, gedämpftes Grün als Aktionsakzent, neutrale Oberflächen. Interaktive Karten mit klaren Fokusindikatoren, 44px+ Touch-Zielen und expliziten Zuständen.
- Responsive: permanente Sidebar auf breiten Desktops, kompakte horizontale Hauptnavigation unter 1050px, zweispaltige KPI-Karte für mittlere Viewports, einzelne logische Stationen bei sehr schmalen Geräten. Kein horizontales Seitenscrolling.
- **Progressive Disclosure:** Aufgabenwahl → ausgewählte Station → relevante KPI → Formel/Rechner. Der Vollkatalog ist parallel suchbar, nicht versteckt.

## 5. Qualitätssicherung / Release Gate
Automatisierte Tests müssen vor Merge alle erfolgreich sein:
1. Alle unveränderten 67 KPI-Referenzrechnungen und Plausibilitätschecks.
2. Browser-Smokes für 320, 390, 768, 1024 und 1440px ohne horizontalen Überlauf.
3. Interaktive Auswahl der Stationen, drei KPI-Drilldowns, Navigationsverlauf, native Tastaturbedienung und Wiederherstellung.
4. Statisches SVG-Sprite erreichbar; keine externen Stylesheets, Analytics oder fremde Schrift-/Icon-Hosts.
5. axe-basierte WCAG-2.1-AA-Grundchecks für Desktop, Mobile, hell/dunkel und geöffnete KPI-Karten.
6. Kein Verlust von Rechnern, KPI-Karten, Fachtexten, Quellen oder geteilten Deep Links.

**Weiter offen für manuelle Abnahme:** echte Teilnehmer aus allen Rollen, Screenreader-Tests, kognitive Belastung unter Zeitdruck, Zoom bei 200/400 %, Safari und reale Touch-Hardware. Automatisierte Checks allein sind kein Beleg für „die beste“ Benutzeroberfläche.

## 6. Aktuelle Referenzen
- [Google Material Symbols / Material Icons – offizielle Integration und Lizenz](https://developers.google.com/fonts/docs/material_symbols)
- [Google: offizielles Icon-Repository](https://github.com/google/material-design-icons)
- [W3C: SVG Accessibility und Tastaturnavigation](https://www.w3.org/TR/SVG/latest/access.html)
- [Material Design 3: Adaptive Navigation Rail](https://md3.io/docs/components/navigation-rail/)
