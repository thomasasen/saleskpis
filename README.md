# Sales KPI Atlas

**Freies Nachschlagewerk für die Vertriebssteuerung in B2B-Softwareunternehmen und Unternehmensberatungen.**

67 Kennzahlen in sieben Themengebieten. Jede KPI bietet Definition, Formel, Beispiel, Live-Rechner, Orientierung, Managementempfehlung, typische Fehler und inhaltliche Verknüpfungen.

## Funktionen

- Interaktives Beispiel für Pipeline Coverage mit frei änderbaren Werten.
- **Sichtbarer Rechner direkt unter der Pipeline Coverage: „Welche Coverage brauchen wir?“** Wahlweise aus wertgewichteter Win Rate plus Fristquote oder unmittelbar aus dem historischen In-Period Pipeline Yield. Zeigt benötigten Faktor, erforderliche Pipeline und zusätzlichen Pipelinebedarf, immer auf Basis des dort angegebenen Restziels und der vorhandenen offenen Pipeline.
- Rückwärtsplanung von Restziel über wertgewichtete Abschlussquote zum benötigten Pipelinewert und zur Opportunity-Anzahl.
- 67 durchsuchbare KPI-Karten mit eigenen Rechnern und Querverweisen.
- **Rücksprung nach jedem internen Querverweis:** Sichtbarer Button „Zurück zur vorherigen Stelle“ und nativer Browser-Zurück/Vorwärts-Verlauf. Beim Rückweg werden Suchbegriff, Themenfilter, geöffnete KPI-/Glossareinträge, KPI-Rechnereingaben und Scrollposition wiederhergestellt. Auch Abschnittssprünge und mehrstufige Verweise sind berücksichtigt. Direkt aufgerufene Links zeigen keinen irreführenden Rückbutton.
- **Interaktives, barrierearm navigierbares KPI-Wirkungsmodell** mit sechs Stationen: Akquise → Pipeline → Abschluss → Forecast → Kundenbindung → Wirtschaftlichkeit. Jede Station erklärt fachliche Beziehungen und öffnet drei zugehörige KPI-Rechner; die Karte behauptet keine automatisch kausalen oder addierbaren Beziehungen.
- **Aufgabenorientierter Einstieg:** „Zusammenhänge verstehen“, „Ziel durchrechnen“ oder „Kennzahl nachschlagen“. Die fünf Hauptbereiche sind klar beschriftet, Vertiefungen und Themenfilter liegen in aufklappbaren Menüs.
- **Google Material Symbols Rounded** aus dem offiziellen Iconset (https://fonts.google.com/icons) als **lokale SVG-Sprite-Datei** statt externem Font-Request. Lizenz: `MATERIAL_SYMBOLS_LICENSE.txt` (Apache-2.0). Keine zusätzlichen externen Abhängigkeiten.
- **[Dokumentiertes UX-Konzept mit simulierter Sechs-Rollen-Design-Challenge](docs/UX_CONCEPT_2026-10-13.md)** (CRO, CSO, Head of Sales, Senior/Junior Account Management, Sales Operations). Diese Expertenperspektiven sind modelliert, keine realen Interviews.
- **Coverage-Stresstest** mit wertgewichteter Win Rate, fristgerechtem Gewinnanteil, Dealgröße, Konzentrationsrisiko und Sales Cycle als Plausibilitätscheck.
- **41 deutsch erklärte Fachbegriffe** mit Beispielen, Denkfehlern und Links zu passenden Rechnern.
- **Gerichtete KPI-Abhängigkeiten** für wichtige Kennzahlen: direkt, indirekt, zeitlich oder risikobezogen.
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



## Welche Pipeline Coverage ist erforderlich?

**1. Vorhandene Coverage:** \`Offene qualifizierte Pipeline / Restziel\`.

**2. Benötigte Coverage mit zwei Quoten:**
\`10000 / (wertgewichtete Win Rate in % × Fristquote der Gewinne in %)\`.
Die Fristquote ist die **bedingte** Quote: welcher Anteil der gewonnenen Werte wird bis zum Ende der betrachteten Periode gewonnen?

**3. Alternative mit realen CRM-Stichtagsdaten:**
\`100 / In-Period Pipeline Yield in %\`.
Dabei gilt \`Yield = in der Periode gewonnener Wert aus der eingefrorenen Startpipeline / ursprüngliche Startpipeline × 100\`.

**4. Benötigte Pipeline:** \`Restziel × benötigte Coverage\`.

**5. Zusätzlich benötigte Pipeline:** \`MAX(0, benötigte Pipeline − vorhandene qualifizierte Pipeline)\`.

**Beispiel:** Offene Pipeline 450.000 €, Restziel 150.000 €, wertgewichtete Win Rate 30 %, von den gewonnenen Werten kommen 80 % bis zum Periodenende: 3,00× vorhandene Coverage, 4,17× benötigte Coverage, 625.000 € benötigte offene Pipeline und 175.000 € zusätzliche Pipeline.

**Grenze:** Dieser Faktor ist ein vereinfachter Erwartungswert, kein garantierter Mindestbestand. Vor allem unterschiedliche Dealgrößen, Segmente und Verkaufsphasen können die Übertragbarkeit historischer Win Rates beeinträchtigen. Die reine mittlere Sales-Cycle-Dauer darf nicht mechanisch in eine Fristquote umgerechnet werden. Nach Möglichkeit kalibrierten In-Period Yield aus vergleichbaren Pipeline-Snapshots verwenden.

## Vollständiges Red-Team-Audit (13. Oktober 2026)

Der dokumentierte Audit erfasst 67 KPI-Beispielrechnungen, Forecast-/Kohortenrisiken, Benchmarks, Sicherheit, responsive UX und Accessibility:

**[Vollständiges Audit mit Prioritäten, Änderungen und offenen Risiken](docs/FULL_REDTEAM_AUDIT_2026-10-13.md)**.

Der Ziel-Coverage-Multiplikator ist ein vereinfachtes Planungsmodell, **kein garantierter Abschluss**. Die neue Coverage-Visualisierung zeigt die individuell berechnete statt einer fixen 3×-Referenz.

Die GitHub-Actions-Qualitätsprüfung beinhaltet jetzt sowohl Unit-Tests für sämtliche KPI-Beispielwerte als auch echte Chromium-Browser-Smoke-Tests (320 bis 1440 Pixel) und automatisierte axe-WCAG-2.1-AA-Prüfungen für helles und dunkles Design.

Als Quelle wird zusätzlich Benchmarkit 2026 geführt. Werte aus Benchmarkit 2025, Benchmarkit 2026 und SaaS Capital 2025 sind **verschiedene Stichproben** und deshalb keine direkte Zeitreihe.

## Lokale Entwicklung

Für Tests Node.js 22 installieren. Mit `npm test` laufen KPI-Formeltests; mit `npm run check` zusätzlich Syntaxprüfungen.
Mit `npm run dev` startet der einfache Python-HTTP-Server auf http://localhost:8000.
Die JavaScript-Module benötigen HTTP, nicht das Protokoll file://.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | Semantische Landingpage und Lernstruktur |
| `styles.css` | Responsive Design, Farbmodi, Druckansicht |
| `kpis.js` | 67 Kennzahlen, Rechenfunktionen, Quellen |
| `app.js` | Suche, Glossar, Navigation, Rechner und Interaktionen |
| `coverage-model.js` | Parametrisierter Coverage-Stresstest ohne Scheingenauigkeit |
| `glossary.js` | 41 Fachbegriffe mit deutscher Erläuterung |
| `dependencies.js` | Erklärte Zusammenhänge wichtiger Kennzahlen |
| `docs/RED_TEAM_AUDIT.md` | Befunde, Modelleinschränkungen und offene Risiken |
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

8. Für Pipelineplanung eine zu Periodenbeginn eingefrorene Kohorte und deren **In-Period Pipeline Yield** bevorzugen, wenn verfügbar. Für ein zeitgerechtes Szenario Win Rate und bedingten fristgerechten Anteil begründet ansetzen; nie den Durchschnitts-Sales-Cycle direkt in eine Abschlusswahrscheinlichkeit umrechnen.

## Weiterführende Quellen

- SaaS Capital (2025), Retention Benchmarks: https://www.saas-capital.com/blog-posts/what-is-a-good-retention-rate-for-a-private-saas-company/
- Benchmarkit (2025), SaaS Performance Metrics: https://www.benchmarkit.ai/2025benchmarks?preview=true
- Benchmarkit (2024), KPI-Methodik: https://www.benchmarkit.ai/2024benchmarks?missing=undefined
- Deltek / SPI (2026), Professional Services Benchmarks: https://www.deltek.com/resources/articles/professional-services-benchmarks/
- Managed Outbound (2026), Pipeline Coverage: https://www.managedoutbound.com/resources/pipeline-coverage-formula
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/

**Stand:** 13. Oktober 2026; Red-Team-Prüfung und methodische Nachschärfung dokumentiert. Alle Kalkulationsbeispiele sind fiktiv. Branchenwerte nur im Kontext ihrer jeweiligen Stichprobe und Berechnung lesen.

## Lizenz

Die Lizenz steht in [LICENSE](./LICENSE). Verlinkte Fremdquellen bleiben Eigentum ihrer jeweiligen Rechteinhaber.
