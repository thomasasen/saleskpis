# Vollständiges Red-Team-Audit · Sales KPI Atlas

**Prüfdatum:** 13. Oktober 2026. **Repository:** thomasasen/saleskpis. **Umfang:** 67 KPI-Definitionen, Rechner, 41 Glossareinträge, 39 erklärte Abhängigkeiten, Benchmarks, Frontend, GitHub Pages, CI und Betrieb. **Perspektiven:** CSO/RevOps, SaaS-Finance, Professional Services, Einsteiger-UX, Accessibility und technische QA.

## Urteil

**Bedingt einsatzfähig als Lern- und Rechenhilfe. Nicht als freigegebene finanzielle Planungsgrundlage oder individueller Vertriebsforecast.** Die Anwendung arbeitet nur mit eingegebenen Werten, nicht mit belastbaren firmenspezifischen CRM-Perioden-Snapshots oder kundenspezifisch kalibrierten Wahrscheinlichkeiten. Statische Rechenkorrektheit ist weder Datenqualität noch Prognosegüte.

## Prüffelder und Befunde

| Priorität | Bereich | Befund | Maßnahme / Status |
|---|---|---|---|
| P0 / Methodik | Pipeline Coverage | `Offene Pipeline / Restziel` ist Bestandsverhältnis. `1 / Win Rate` ist ohne Zeitbezug keine verlässliche Mindestdeckung. Historisch entschiedene Deals und heute offene Deals sind verschiedene Grundgesamtheiten. | Konzeptionell erklärt und Stresstest ergänzt; **offen:** CRM-Kohortenkalibrierung auf echten Daten. |
| P1 | Forecast / Timing | Sales-Cycle-Durchschnitt enthält keine bedingte Prognose der Restlaufzeit bestehender Deals. | Keine automatische Ableitung der Fristwahrscheinlichkeit aus Sales Cycle. Stresstest trennt Timing vom Verhältnis. |
| P1 | Pipeline-Risiko | Wenige Großdeals können dieselbe Coverage erheblich riskanter machen. | Konzentrationsindikator und Sensitivität ohne größten Deal ergänzt; Konfidenzintervall bleibt offen. |
| P1 | Benchmarks | 2025/2026 SaaS-Studien und Software-/Service-Margen sind unterschiedliche Stichproben bzw. Umsatzarten. Ein früherer Text bezeichnete die gemischte 77%-Marge irreführend als SaaS-Bruttomarge. | Präzisere Segmentangaben, neue Benchmarkit-Quelle 2026, Stichprobenvergleich; keine erfundene universelle Norm. |
| P1 | CAC Ratio | Benchmarkit setzt gesamten Sales-&-Marketing-Aufwand in Relation zum Neukunden-ARR. Frühere Labelung `Akquise-S&M-Kosten` war zu eng und unter Umständen nicht benchmarkfähig. | KPI-Formel und Eingabelabel korrigiert. |
| P1 | KPI-Validierung | Ungültige Prozentwerte >100 sowie Churn-Verluste größer als Startbestand waren teilweise rechnerisch möglich. | Einheitliche Prozentschranken und Kohortenprüfungen ergänzt; begründet legitime >100% wie Quota/Capacity bleiben zulässig. |
| P1 | Mobilnavigation | Seitenleiste unter 1050px ausgeblendet, ohne sinnvolle Ersatznavigation. | Horizontale, tastaturbedienbare Abschnittsnavigation mit Ankern ergänzt. |
| P1 | Mobil-Layout | Horizontaler Überlauf bei 320px. | Topbar entschlackt, reale Chromium-Browser-Smoketests für 320, 390, 768, 1024px aufgenommen. |
| P1 | Deep Links | Bereits geladene Seite reagierte nicht auf neue `#kpi-...`-Fragmentnavigation. | `hashchange`-Handler ergänzt, Browsertest hinzugefügt. |
| P1 | Testabdeckung | Grüne reine Struktur-/Unit-Checks konnten DOM-, Navigations- und Smartphonefehler nicht entdecken. | 67 unabhängig erwartete KPI-Beispielwerte, zusätzliche Grenzfalltests und Browser-Smoketests in GitHub Actions integriert. |
| P1 | Barrierefreiheit | Viele Text-Metadaten waren unter 12px; automatische A11y-Prüfung fehlte. | Mindestgrößen wichtiger Inhaltstexte und axe-basierter WCAG-Smoketest ergänzt; gezielte Farbanpassungen anhand tatsächlicher Prüfungen. |
| P2 | Glossar | 41 Begriffe sind deutlich besser als null, aber Synonyme, mehrere mögliche Definitionen und Anfänger-Lernpfade fehlen teilweise. | Weiterführende Aufgabe, kein formaler Release-Blocker. |
| P2 | Datenqualität | Zähler/Nenner entsprechen nicht bei jeder Kennzahl automatisch derselben Kohorte/Periode, wenn Nutzer Werte falsch eingeben. | In Warntexten erklärt; echte Datenherkunft/Metadaten erfordern spätere CRM-Integration. |
| P2 | Gesamtmodell | Es fehlen Segment-/Reifegrad-Konfiguration, mehrperiodige Pipelineplanung und wirtschaftliche Zielkonflikte (z. B. Consulting-Kapazität). | Offen als Entwicklungsbedarf; keine Scheingenauigkeit durch erfundene Default-Werte. |
| P2 | Veröffentlichung | Versionierung und Browserprüfung sollten Pflichtchecks sein. | GitHub Actions um Build-freie Live-Browser-Checks erweitert; kein externes Laufzeitpaket. |
| P3 | Benennung/UI | Einige Bezeichnungen und Quellenhinweise sind technisch korrekt, aber textlastig; 67 Karten können trotz Suche überladen. | Perspektivisch geführte Lernpfade und progressive Disclosure prüfen. |

## Kritische Modellunterscheidung: Coverage vs. Zielerreichung

- **Nominal:** `Pipeline Coverage = qualifizierte offene Pipeline mit Abschlussdatum in der Periode / Restziel`.
- **Vereinfachte Planung:** `Benötigte Coverage = 1 / (P(Gewinn) × P(rechtzeitig | Gewinn))` bei sinnvoll ausgerichteten, **wertbasierten** Kohorten.
- **Historisch vorzugswürdig:** `In-Period Pipeline Yield = aus eingefrorener Startpipeline bis Frist gewonnener Wert / eingefrorener Startpipelinewert`.
- **Bessere operative Prognose:** `Σ(Dealwert_i × P(Gewinn UND Abschluss im Zeitraum | aktuelle Stage und Kundenprozess))` statt unkalibrierter pauschaler Faktoren.
- **Nicht aus der Durchschnittslänge ableiten:** Wer 120 Tage durchschnittlichen gesamten Sales Cycle hat und 60 Tage bis Quartalsende, kann dennoch laufende Deals mit 10 Tagen Restlaufzeit besitzen. Diese Information ist im Durchschnitt nicht enthalten.

Ein Wert von 3× Coverage bedeutet **nicht**, dass das Ziel mit 33,3% historischer *Closed-Won-Rate* erreicht wird. Er bedeutet, dass mindestens ein Drittel der betrachteten offenen Pipeline bis zur Frist als gewonnener, anrechenbarer Wert benötigt wird.

## Fachlich geprüfte Benchmark-Abgrenzung

- **Benchmarkit 2025:** ca. 77 % Gross Margin auf Gesamtumsatz; 81 % Subscription Gross Margin; 30 % Professional Services Gross Margin. New CAC Ratio Median 2,0 auf Gesamtausgaben für Sales & Marketing je New Logo ARR.
- **Benchmarkit 2026:** nennt u. a. 80 % mediane Software-Bruttomarge und 84 % GRR für seine neueste Grundgesamtheit. Nicht als direkte Veränderung der SaaS-Capital-Kohorte lesen.
- **SaaS Capital 2025:** NRR- und GRR-Benchmarks beziehen sich auf private B2B-SaaS-Unternehmen und variieren besonders nach ACV; in der Plattform werden 101 % NRR und 91 % GRR als Gesamtstichprobenmediane eingeordnet.
- **SPI/Deltek 2026:** 66,4 % Billable Utilization, 37,7 % Projektmarge und 210.000 USD Umsatz pro Berater aus dem 2025er Datenjahr. Andere Kosten-/Währungsdefinitionen bei deutschen Beratungen beachten.

Quellen: https://www.benchmarkit.ai/2025benchmarks ; https://www.benchmarkit.ai/2026-saas-ai-native-metrics ; https://www.saas-capital.com/blog-posts/what-is-a-good-retention-rate-for-a-private-saas-company/ ; https://www.deltek.com/resources/articles/professional-services-benchmarks/

## QA-Protokoll

GitHub Actions `Quality checks` prüft JavaScript-Syntax, 67 unabhängige KPI-Referenzrechnungen, zentrale kohorten-/prozentbezogene Grenzen, Linkintegrität und Browser-Smoketests mit Chromium. Browserabnahme in mehreren Viewports kontrolliert aktuelle/berechnete Coverage, Yield-Alternative, Suchfilter, Glossar, Kachel-Deep-Links und horizontales Überlaufen. Ein axe-basierter A11y-Check prüft gravierende WCAG-2.1-AA-Verstöße. Ein grüner automatischer Durchlauf ist keine manuelle vollständige Barrierefreiheitszertifizierung.

## Offene Risiken vor einem Einsatz als CSO-Entscheidungssystem

1. **Keine CRM-Daten oder historische Konfidenz:** Ohne Stichtagskohorten, definierte Dealwerte, verloren-/verschoben-Zuordnung und kalibrierte Segmentquoten ist jeder Zielwert exemplarisch.
2. **Keine gewichtete Unsicherheit:** Erwartungswerte ohne Varianz, Korrelationen, Dealanzahl, Forecast-Intervall und Monte-Carlo-Szenarien können Entscheidungssicherheit suggerieren.
3. **KPI-Katalog ist noch kein Controlling-Datenmodell:** Owner, Stichtag, Datenquelle, Aktualisierungsfrequenz, Definition, Segment, Finanzmetrik-Typ und Alert-Schwelle fehlen als maschinenlesbare Felder.
4. **Studienvergleich ist kein Branchenstandard:** Benchmark-Population, Unternehmensgröße, Geografie, ACV, Produkt-/Service-Mix und Messzeitraum müssen dokumentiert werden.
5. **UX-Grundlagen sind noch nicht abschließend manuell abgenommen:** Zoom bei 200/400 %, Screenreader, Touch-Geräte, Tastatur-only und visuelle Farbkontraste benötigen ergänzende Prüfung.
6. **Keine automatische Prüfung externer Quellen auf Änderungen:** Verlinkte Research-Publikationen können Benchmarks aktualisieren oder URLs verschieben.

## Release-Gate

Die letzte Code-Version darf erst in `main` gemergt werden, wenn `Quality checks` mit allen Unit- und Browserjobs grün ist. Die vollständige Bedienungs- und Fachabnahme bleibt ausdrücklich ein weiteres Qualitätstor.
