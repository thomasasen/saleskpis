# Sales KPI Atlas

**Freies Nachschlagewerk für die Vertriebssteuerung in B2B-Softwareunternehmen und Unternehmensberatungen.**

66 Kennzahlen in sieben Themengebieten. Jede KPI bietet Definition, Formel, Beispiel, Live-Rechner, Orientierung, Managementempfehlung, typische Fehler und inhaltliche Verknüpfungen.

## Funktionen

- Interaktives Beispiel für Pipeline Coverage mit frei änderbaren Werten.
- Rückwärtsplanung von Restziel über wertgewichtete Abschlussquote zum benötigten Pipelinewert und zur Opportunity-Anzahl.
- 66 durchsuchbare KPI-Karten mit eigenen Rechnern und Querverweisen.
- Grafische Wirkungskette Akquise → Pipeline → Abschluss → Wachstum.
- Tastaturkürzel / für Suche, Deep Links auf einzelne KPIs, Dark Mode und responsive Druckansicht.
- Kein Tracking, Login, Backend, externes Framework oder kostenpflichtige API.
- Der Button „Per E-Mail teilen“ öffnet das Mailprogramm. Er versendet nichts automatisch.

## Veröffentlichung mit GitHub Pages

Die App wird direkt aus statischen Dateien bereitgestellt. Einmalig nach Merge auf main:

1. Im Repository auf **Settings → Pages** gehen.
2. Unter **Build and deployment → Source** den Eintrag **Deploy from a branch** wählen.
3. Als Branch **main** und als Ordner **/(root)** auswählen.
4. Speichern. Die Seitenadresse lautet danach bei erfolgreicher Aktivierung: https://thomasasen.github.io/saleskpis/

**Hinweis:** Nur Dateien ins Repository zu schreiben aktiviert Pages noch nicht. Der Repository-Administrator muss diese Pages-Einstellung einmalig vornehmen.

## Lokale Entwicklung

Für Tests Node.js 22 installieren. Mit `npm test` laufen KPI-Formeltests; mit `npm run check` zusätzlich Syntaxprüfungen.
Mit `npm run dev` startet der einfache Python-HTTP-Server auf http://localhost:8000.
Die JavaScript-Module benötigen HTTP, nicht das Protokoll file://.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | Semantische Landingpage und Lernstruktur |
| `styles.css` | Responsive Design, Farbmodi, Druckansicht |
| `kpis.js` | 66 Kennzahlen, Rechenfunktionen, Quellen |
| `app.js` | Suche, Navigation, Rechner und Interaktionen |
| `tests/kpis.test.mjs` | Berechnungs- und Datenintegritätstests |
| `.github/workflows/quality.yml` | GitHub Actions CI bei Push und PR |

## Redaktionelle Qualitätsregeln

1. Faustregeln, empirische Stichprobenwerte und interne Zielgrößen klar unterscheiden.
2. Nur konsistente Zeiträume, Vertragsarten und Währungen vergleichen.
3. Für Pipelineplanung wertgewichtete Win Rate berücksichtigen. Anzahlbasierte Raten können stark abweichen.
4. NRR, GRR und Funnel-Konversion über saubere Anfangskohorten definieren.
5. Umsatz, Bookings, Pipeline, TCV, ACV und ARR niemals ohne Definition vermischen.
6. Bei SaaS-Kennzahlen Bruttomarge, Periodenbezug und Sales-Cycle-Versatz beachten.
7. Neue Kennzahlen mit konsistentem Zahlenbeispiel, Aktion, Datenwarnung und automatisiertem Test ergänzen.

## Weiterführende Quellen

- SaaS Capital (2025), Retention Benchmarks: https://www.saas-capital.com/blog-posts/what-is-a-good-retention-rate-for-a-private-saas-company/
- Benchmarkit (2025), SaaS Performance Metrics: https://www.benchmarkit.ai/2025benchmarks?preview=true
- Benchmarkit (2024), KPI-Methodik: https://www.benchmarkit.ai/2024benchmarks?missing=undefined
- Deltek / SPI (2026), Professional Services Benchmarks: https://www.deltek.com/resources/articles/professional-services-benchmarks/
- Managed Outbound (2026), Pipeline Coverage: https://www.managedoutbound.com/resources/pipeline-coverage-formula
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/

**Stand:** 13. Oktober 2026. Alle Kalkulationsbeispiele sind fiktiv. Branchenwerte nur im Kontext ihrer jeweiligen Stichprobe und Berechnung lesen.

## Lizenz

Die Lizenz steht in [LICENSE](./LICENSE). Verlinkte Fremdquellen bleiben Eigentum ihrer jeweiligen Rechteinhaber.
