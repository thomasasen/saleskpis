# Red-Team-Audit: Sales KPI Atlas

**Prüfstand:** 13. Oktober 2026 · Perspektiven: CSO/RevOps, Junior Sales, Modellvalidierung, UX/Accessibility.

## Executive Summary

Die erste Version konnte 66 Kennzahlen formal berechnen, erklärte aber wesentliche Ursachen und zeitliche Effekte nicht ausreichend. Besonders gefährlich war die Fehlinterpretation von 3× nomineller Pipeline Coverage als pauschal ausreichende Deckung. Im Rahmen des Audits wurden die Beziehungen differenziert, ein periodengerechtes Kohortenmaß ergänzt, ein Glossar eingeführt und ein transparenter Szenariorechner gebaut.

## Befunde, Schweregrad, Maßnahme

| Priorität | Befund | Maßnahme / Status |
| --- | --- | --- |
| P0 | 3× Pipeline Coverage wirkt wie eine universelle Zielgröße. | Als Faustregel gekennzeichnet; 3×/4× abhängig von historischen Abschluss- und Timingdaten erläutert. Umgesetzt. |
| P0 | Historische Win Rate allein begründet nicht die notwendige Periodendeckung. | **In-Period Pipeline Yield** als eingefrorene Startpipeline-Kohorte ergänzt und als wichtiger Indikator mit Coverage verbunden. Umgesetzt. |
| P0 | Durchschnittlicher Sales Cycle könnte als berechenbare On-Time-Wahrscheinlichkeit missverstanden werden. | Sales Cycle nur als Plausibilitätssignal modelliert; On-Time-Annahme wird separat eingegeben, nicht automatisch aus Tagen abgeleitet. Umgesetzt. |
| P1 | Gewonnene Ø Dealgröße und Ø Größe offener Opportunities werden verwechselt. | Klare Benennungen, getrennte Daten und Warnhinweis im Szenariorechner. Umgesetzt. |
| P1 | Win und Loss Rate werden als Abschlusswahrscheinlichkeit einzelner Deals fehlgedeutet. | Geschlossene historische Kohorten erklärt; kombinierter fristgerechter Gewinnanteil ausgewiesen. Umgesetzt. |
| P1 | Ungeklärte Begriffe für Einsteiger: Sales Cycle, SQL, Opportunity, ACV usw. | 41 Begriffe mit deutscher Erklärung, Beispiel, typischem Fehler und KPI-Verweis. Umgesetzt. |
| P1 | Zugehörige KPIs waren nur querverlinkt, ohne Beziehungsrichtung. | Gerichtete Erklärungen für zentrale Kennzahlen: direkt, indirekt, Risiko, Timing. Umgesetzt. |
| P1 | Großdeals können im Mittelwert die Risikolage verschleiern. | Anzahl grob aus offener Dealgröße, Anteil des größten Deals und Szenario ohne größten Deal ergänzt. Umgesetzt. |
| P1 | 3× kann trotz rechnerisch hoher nomineller Coverage zu Unterdeckung führen. | Szenario zeigt Ziel, benötigten Multiplikator, modellierten fristgerechten Abschlusswert, erwartete Lücke und zusätzliche Chancen. Umgesetzt. |
| P1 | Rückwärtsplanung ignorierte alle verspäteten Gewinne. | Optional zu kalibrierender fristgerechter Gewinnanteil explizit in die Formel aufgenommen. Umgesetzt. |
| P2 | Dateneingabefehler wie Division durch null, negative Beträge, Prozentwerte über 100 %. | Szenariomodell prüft die Eingaben; Tests ergänzen Grenzfälle. Umgesetzt. |
| P2 | Einzelnachweise der KPI-Definitionen. | Salesforce und HubSpot zusätzlich verlinkt, Studienwerte und Heuristiken weiterhin differenziert. Umgesetzt. |

## Zu den Formeln

**1. Nominelle Pipeline Coverage**

`Offene, im Zeitraum geplante und qualifizierte Pipeline / offenes Periodenziel`.

**2. Theoretisch erforderliche Coverage ohne Timingverlust**

`1 / wertgewichtete Gewinnwahrscheinlichkeit` (als Dezimalzahl).

**3. Vereinfachte Coverage mit Timing-Annahme**

`1 / (P(Gewinn) × P(rechtzeitig | Gewinn))`.

**4. Bessere historische Kalibrierung bei verfügbaren Snapshots**

`In-Period Pipeline Yield = bis Frist tatsächlich gewonnener Wert aus Startpipeline / ursprünglicher Pipelinewert`.

Daraus folgt bei vergleichbaren Kohorten modellhaft `benötigte Coverage ≈ 1 / historischer Yield`.

**5. Deal-individueller Forecast (Zielbild)**

`Summe über Deals: Dealwert × P(Gewinn UND Abschluss bis Frist)`.

Der vereinfachte Rechner ist nur als Sensitivitätsanalyse zulässig, nicht als finanziell belastbares Forecast-Modell. Wenn Win Rates und Timing korreliert sind oder Segmente stark abweichen, ist eine aggregierte Multiplikation irreführend. Ein Durchschnitts-Sales-Cycle lässt sich nicht in eine fristgerechte Abschlusswahrscheinlichkeit umrechnen. Die bereits verstrichene Zykluszeit und der Fortschritt innerhalb der Phase sind gesondert auszuwerten.

## Rechenbeispiel

- Qualifizierte Pipeline: 450.000 €; offenes Periodenziel: 150.000 €.
- Nominelle Coverage: 3,0×.
- Historisch vergleichbare wertgewichtete Gewinnquote: 30 %.
- Bedingter Anteil rechtzeitiger Gewinne: 80 %.
- Modellierte Periodenkonversion: 0,30 × 0,80 = 24 %.
- Erwarteter fristgerechter Dealwert: 450.000 € × 0,24 = 108.000 €.
- Rechnerische Restlücke: 42.000 €; erforderliche Pipeline 150.000 € / 0,24 = 625.000 €; zusätzliche Pipeline: 175.000 €.
- Bei durchschnittlich 75.000 € pro **offener** Opportunity: zusätzliche 3 durchschnittliche Deals, gerundet (keine Garantie).
- Durchschnittlicher gesamter Sales Cycle: 120 Tage, bis Periodenende 60 Tage. Warnhinweis, **keine** quantitative Umrechnung auf Gewinnwahrscheinlichkeit.

## Offen, ausdrücklich nicht als erledigt ausweisen

1. **Keine reale CRM-Kohortenvalidierung.** Inputwerte sind fiktive Lernbeispiele. Ohne firmeneigene Daten lassen sich keine individuellen Coverage-Zielwerte bestätigen.
2. **Keine produktive visuelle Browserabnahme.** GitHub Actions prüfen JavaScript-Syntax, Datenintegrität, Beispielrechnungen und statische Seitenstruktur. Responsive Verhalten und tatsächliche Bedienbarkeit müssen zusätzlich in Desktop- und Mobilbrowsern begutachtet werden.
3. **Keine vollständige methodische Einzelprüfung aller 67 KPIs gegen Primärliteratur.** Die wichtigsten Coverage- und Vertriebsbeziehungen wurden vertieft. Weitere KPI-Definitionen sollten mit Unternehmensdaten und fachlich passenden Studien geprüft werden.
4. **Keine probabilistische Konfidenzgrenze.** Der Erwartungswert zeigt weder Varianz noch Worst-Case. Großdeal-Konzentration und Szenario ohne größten Deal sind qualitative Risikohinweise.
5. **Quoten und Zeiträume müssen konsistent sein.** Historische Closed-Deal-Kohorten und bestehende offene Pipeline haben unterschiedliche Selektionsmechanismen. Das Modell verlangt geeignete, ähnliche Segmente.

## Fachquellen

- Salesforce Revenue Insights KPI Calculations: https://help.salesforce.com/s/articleView?id=sales.revenue_insights_team.htm&language=en_US&type=5
- Salesforce Stage Analysis: https://help.salesforce.com/s/articleView?id=sf.Stage_analysis_use.htm&language=de&type=5
- HubSpot Sales Velocity: https://blog.hubspot.com/sales/sales-velocity
- HubSpot Sales Pipeline Stages: https://blog.hubspot.com/sales/sales-pipeline-stages-visual-guide
- Managed Outbound (2026), Pipeline Coverage Heuristics: https://www.managedoutbound.com/resources/pipeline-coverage-formula

**Verifikation:** Die automatisierten Tests müssen auf dem finalen Commit erfolgreich sein. Ein erfolgreiches CI-Ergebnis ist kein Ersatz für einen Browser-/UX-Test.
