# KPI-Interpretation – Redaktionsregeln und Evidenz
*13. Oktober 2026 · Gilt für alle 67 Kennzahlen im Sales KPI Atlas*

## Wofür die zusätzlichen Texte da sind
Ein KPI-Wert ohne Kontext führt leicht zu Fehlentscheidungen. Deshalb zeigt jede ausgeklappte KPI:
1. **Richtwert / Vergleichsbasis:** vorhandene Benchmarkangabe plus Kennzeichnung als Studie, Faustregel, mathematische Definition oder unternehmensindividueller Vergleich.
2. **Gutes Signal:** Bedingungen, unter denen der KPI eine positive Entwicklung stützt.
3. **Beobachten:** Frühwarnzeichen, die eine Kohorten-, Segment- oder Zeitraumanalyse erfordern.
4. **Kritisch / alarmierend:** eine konkret definierte Risikokonstellation, niemals bloß pauschal „unter X ist schlecht“.
5. **Warum?** Mathematischer oder betriebswirtschaftlicher Hintergrund.
6. **Konkreter nächster Schritt:** prüfbare Diagnose oder Gegenmaßnahme.

Alle 67 Einträge liegen unter `kpi-guidance.js` und werden mit `tests/kpi-guidance.test.mjs` automatisiert auf Abdeckung und Mindestqualität geprüft. Die ursprünglichen Formeln und Beispieldaten bleiben unverändert.

## Drei Arten von Richtwerten
- **Mathematisch:** NRR unter 100 % bedeutet Bestandsrückgang, Quota Attainment ab 100 % bezeichnet die Zielerreichung, geplante Capacity Coverage über 100 % die rechnerische Überbuchung. Diese Aussage ist aus der Kennzahlendefinition ableitbar, sagt aber nicht automatisch „gesamtes Unternehmen gesund/krank“.
- **Veröffentlichte Benchmarkstudie:** Ein Median beschreibt eine bestimmte Stichprobe und Zeit. Er ist **kein** allgemein gültiger Sollwert. Beispiel: SaaS Capital (2025) meldet NRR 101 % und GRR 91 % für private B2B-SaaS-Unternehmen. Benchmarkit (2026) meldet Software Gross Margin um 80 %, Rule-of-40-Median 25 Punkte, GRR 84 % für eine andere Kohorte. Unterschiedliche Populationen nicht als Zeitreihe interpretieren.
- **Praxisheuristik und internes Ziel:** 3–4× Pipeline Coverage, Rule of 40 ≥ 40 Punkte, LTV/CAC um 3× oder eine 12-monatige CAC-Amortisation sind **keine** allgemeingültigen „gut/rot“-Kriterien. Zielwerte aus Segment, Kapitaleinsatz, Marge, Vertriebszyklus und echten Kohorten ableiten.

## Wo automatische Live-Einstufungen zulässig sind
`assessKpiValue` liefert nur bei bewusst ausgewählten KPIs ein zusätzliches Rechensignal:
- NRR < 100 % / ≥ 100 %: Richtung des wiederkehrenden Kohortenumsatzes.
- Quota Attainment < 100 % / ≥ 100 %: Ziel mathematisch noch nicht erreicht / erreicht; unter 100 % vor Periodenende ist häufig normal.
- Capacity Coverage > 100 %: Überbuchung der angesetzten Kapazität; unter 100 % ist eine neutrale Kapazitätsreserve, kein automatisches Defizit.
- Project Overrun > 10 %: Deltek/SPI-Praxisschwelle 2026. > 0 %: Budget überschritten, aber nicht zwingend alarmierend.
- Rule of 40 ≥ 40: verbreitete Faustregel erreicht. Werte darunter werden **neutral**, nicht automatisch kritisch, bewertet.
- Net New ARR < 0: negativer Netto-Bestandszugang, daher prüfen.
- Negative Gross Margin: direkte Leistungskosten über Erlös.
- Book-to-Bill: rein richtungsbezogene Beschreibung ohne pauschal „gut“/„schlecht“.

Es gibt bewusst **keine** automatische Rot-Grün-Ampel für Win Rate, Sales Cycle, Lead-Conversion, CAC, Forecast Accuracy, Utilization und viele weitere ohne robuste, vergleichbare Normalwerte.

## Quellen zur Einordnung
- [SaaS Capital 2025: Private B2B SaaS Retention](https://www.saas-capital.com/blog-posts/what-is-a-good-retention-rate-for-a-private-saas-company/)
- [Benchmarkit 2026 B2B SaaS & AI-Native](https://www.benchmarkit.ai/2026-saas-ai-native-metrics)
- [Benchmarkit 2025 Benchmarks](https://www.benchmarkit.ai/2025benchmarks)
- [Deltek/SPI 2026 Professional Services Benchmark](https://www.deltek.com/resources/articles/professional-services-benchmarks/)
- [Deltek/SPI 2026: Projekt- und Delivery-Praxiswerte](https://www.deltek.com/resources/articles/5-kpis-from-the-spi-professional-services-maturity-benchmark-report-every-pso-must-track-for-sustainable-growth/)

## Bekannte Grenzen
Noch keine individuellen CRM-Snapshots, Pipeline-Kohortenkalibrierung, individuellen Zielschwellen, Forecast-Wahrscheinlichkeitsverteilung oder statistischen Unsicherheitsintervalle. Die Leitfäden sind **Entscheidungshilfen**, keine rechtssichere, finanzmathematische oder individuelle Unternehmensdiagnose. Für echte „RAG“-Ampeln müssen Benutzer eigene Segment- und Periodenziele konfigurieren können; diese Funktion ist noch nicht Bestandteil des Atlas.
