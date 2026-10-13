// Redaktionell geprüfte Begriffserklärungen, bewusst ohne automatisch erzeugte Definitionen.
export const glossary = [
  {
    "id": "sales-cycle",
    "title": "Sales Cycle",
    "translation": "Vertriebszyklus",
    "definition": "Zeitspanne vom festgelegten Vertriebsstart bis zu einem definierten Abschluss. Für die KPI wird häufig die Zeit von der Erstellung oder Qualifizierung einer Opportunity bis Closed Won gemessen.",
    "example": "Opportunity am 1. April qualifiziert, am 30. Juni gewonnen: 90 Tage.",
    "warning": "Startpunkt festlegen. Der bisherige Gesamtzyklus ist nicht die noch benötigte Restlaufzeit.",
    "kpi": "avg-cycle"
  },
  {
    "id": "pipeline",
    "title": "Sales Pipeline",
    "translation": "Vertriebspipeline",
    "definition": "Alle nach definierten Kriterien qualifizierten und noch offenen Verkaufschancen mit Wert, Phase und voraussichtlichem Abschlussdatum.",
    "example": "Sechs offene Chancen à 75.000 € entsprechen 450.000 € Pipeline.",
    "warning": "Offene Pipeline ist weder ein unterschriebener Auftrag noch bereits realisierter Umsatz.",
    "kpi": "pipeline-coverage"
  },
  {
    "id": "coverage",
    "title": "Pipeline Coverage",
    "translation": "Pipelineabdeckung",
    "definition": "Verhältnis aus relevantem offenen Pipelinewert und dem noch zu erreichenden Ziel derselben Periode.",
    "example": "450.000 € offene Pipeline / 150.000 € Restziel = 3,0×.",
    "warning": "3,0× ist keine prognostizierte Erfolgswahrscheinlichkeit.",
    "kpi": "pipeline-coverage"
  },
  {
    "id": "win-rate",
    "title": "Win Rate",
    "translation": "Abschlussquote",
    "definition": "Anteil gewonnener an allen entschiedenen Verkaufschancen. Für wertbasierte Planung idealerweise zusätzlich nach gewonnenem und verlorenem Vertragswert auswerten.",
    "example": "20 gewonnen, 60 verloren: 25 % anzahlbasierte Win Rate.",
    "warning": "Nicht mit 25 % Chance gleichsetzen, dass jede aktuell offene Opportunity gewonnen wird.",
    "kpi": "win-rate"
  },
  {
    "id": "loss-rate",
    "title": "Loss Rate",
    "translation": "Verlustquote",
    "definition": "Anteil verlorener an allen entschiedenen Verkaufschancen. Bei identischem Nenner ergänzt sie die anzahlbasierte Win Rate zu 100 %.",
    "example": "Bei 25 % Win Rate und ausschließlich Won/Lost als Endzuständen: 75 % Loss Rate.",
    "warning": "Verschobene offene Deals sind keine Verluste.",
    "kpi": "loss-rate"
  },
  {
    "id": "opportunity",
    "title": "Opportunity",
    "translation": "Verkaufschance",
    "definition": "Konkrete, qualifizierte Verkaufschance mit nachvollziehbarem Bedarf, Wert, verantwortlicher Person, Verkaufsphase und geplantem Abschluss.",
    "example": "Ein Kunde prüft ein CRM-Projekt über 80.000 €; der Vertrieb hat Bedarf und Prozess qualifiziert.",
    "warning": "Bloßes Interesse nicht automatisch als Opportunity zählen.",
    "kpi": "sql-opportunity"
  },
  {
    "id": "lead",
    "title": "Lead",
    "translation": "Kontakt mit möglichem Interesse",
    "definition": "Person oder Organisation mit einem ersten Kontaktpunkt, noch ohne zwingend geprüften Bedarf oder Kaufprozess.",
    "example": "Eine Person lädt ein Fachpapier herunter.",
    "warning": "Lead ist nicht dasselbe wie eine verifizierte Verkaufschance.",
    "kpi": "lead-conversion"
  },
  {
    "id": "mql",
    "title": "MQL",
    "translation": "Marketing Qualified Lead",
    "definition": "Ein Kontakt, der nach gemeinsam festgelegten Marketingkriterien für Vertriebsprüfung geeignet erscheint.",
    "example": "Download und passende Unternehmensgröße erfüllen ein internes MQL-Scoring.",
    "warning": "MQL-Kriterien müssen gemeinsam vereinbart werden.",
    "kpi": "mql-sql"
  },
  {
    "id": "sql",
    "title": "SQL",
    "translation": "Sales Qualified Lead",
    "definition": "Vom Vertrieb nach definierten Kriterien als weiter verfolgungswürdig bestätigter Lead.",
    "example": "Bedarf, Ansprechpartner und realistischer Zeithorizont wurden im Erstgespräch bestätigt.",
    "warning": "Nicht bereits mit einer verbindlich qualifizierten Opportunity verwechseln.",
    "kpi": "sql-opportunity"
  },
  {
    "id": "sales-stage",
    "title": "Deal Stage",
    "translation": "Vertriebsphase",
    "definition": "Ein definierter Abschnitt im Verkaufsprozess, z. B. Qualifizierung, Bedarfsklärung, Angebot, Verhandlung oder Entscheidung.",
    "example": "Ein Deal wechselt nach bestätigter Bedarfsklärung in die Angebotsphase.",
    "warning": "Stufen brauchen messbare Eintritts- und Austrittskriterien.",
    "kpi": "stage-conversion"
  },
  {
    "id": "close-date",
    "title": "Close Date",
    "translation": "Erwartetes Abschlussdatum",
    "definition": "Zeitpunkt, zu dem ein Deal voraussichtlich unterschrieben oder verbindlich gewonnen wird.",
    "example": "Ein Vertrag soll bis 15. Dezember unterschrieben sein.",
    "warning": "Nicht das gewünschte Datum des Vertriebsmitarbeiters übernehmen, sondern Kundenprozess abgleichen.",
    "kpi": "slippage"
  },
  {
    "id": "closed-won",
    "title": "Closed Won",
    "translation": "Gewonnen und abgeschlossen",
    "definition": "Eine Opportunity gilt nach eindeutig festgelegtem, dokumentiertem Abschlussereignis als gewonnen.",
    "example": "Rechtsgültig unterschriebener Vertrag liegt vor.",
    "warning": "Unterschrift, Auftragsbestätigung und Umsatzrealisierung sind unterschiedliche Ereignisse.",
    "kpi": "win-rate"
  },
  {
    "id": "closed-lost",
    "title": "Closed Lost",
    "translation": "Verloren und abgeschlossen",
    "definition": "Eine Verkaufschance wurde abschließend als nicht gewonnen klassifiziert.",
    "example": "Kunde entscheidet sich für einen Wettbewerber oder gegen das Projekt.",
    "warning": "Nicht jede auf einen späteren Zeitraum verschobene Opportunity ist verloren.",
    "kpi": "loss-rate"
  },
  {
    "id": "deal-size",
    "title": "Average Deal Size",
    "translation": "Durchschnittlicher Dealwert",
    "definition": "Mittlerer Vertrags- oder Opportunity-Wert. Der Durchschnitt offener Deals und der Durchschnitt gewonnener Deals sind zwei unterschiedliche Größen.",
    "example": "450.000 € Pipeline in sechs offenen Deals: Ø 75.000 € pro offenem Deal.",
    "warning": "Ein riesiger Deal kann den Mittelwert verzerren; Median und größten Einzeldeal ergänzen.",
    "kpi": "avg-deal"
  },
  {
    "id": "weighted-rate",
    "title": "Wertgewichtete Win Rate",
    "translation": "Wertbezogene Abschlussquote",
    "definition": "Gewonnener Vertragswert geteilt durch den Gesamtwert gewonnener und verlorener Deals derselben abgeschlossenen Kohorte.",
    "example": "300.000 € gewonnen / 1.000.000 € entschiedener Dealwert = 30 %.",
    "warning": "Anzahlbasierte Win Rate nicht ungeprüft in Umsatzprognosen einsetzen.",
    "kpi": "win-rate-value"
  },
  {
    "id": "slippage",
    "title": "Slippage",
    "translation": "Abschlussverschiebung",
    "definition": "Ein ursprünglich für eine Periode erwarteter Deal bleibt offen und wird in eine spätere Periode verschoben.",
    "example": "Abschluss ursprünglich Oktober, neuer Termin Januar.",
    "warning": "Von Lost und nicht entschiedenen, aber unverändert termingerechten Deals unterscheiden.",
    "kpi": "slippage"
  },
  {
    "id": "forecast",
    "title": "Forecast",
    "translation": "Vertriebsprognose",
    "definition": "Begründete Schätzung der künftig zu erwartenden Abschlüsse oder Umsätze bis zu einem festgelegten Stichtag.",
    "example": "Forecast für Q4: 700.000 € Bookings.",
    "warning": "Nicht mit der Summe aller offenen Angebotswerte verwechseln.",
    "kpi": "forecast-error"
  },
  {
    "id": "commit",
    "title": "Commit",
    "translation": "Verbindlich prognostizierter Abschluss",
    "definition": "Prognosekategorie für Deals, denen der Vertrieb nach klaren Kriterien eine hohe Abschlussverlässlichkeit zuweist.",
    "example": "Deal ist kaufmännisch freigegeben und soll vor Quartalsende unterschrieben werden.",
    "warning": "Commit ist keine Garantie; Kriterien und Trefferquote kontrollieren.",
    "kpi": "commit-hit"
  },
  {
    "id": "bookings",
    "title": "Bookings",
    "translation": "Auftragseingang",
    "definition": "Vertraglich vereinbarter Auftragswert gemäß einheitlicher interner Buchungsdefinition, unabhängig vom späteren Zahlungszeitpunkt.",
    "example": "Ein unterschriebener Auftrag erhöht die Bookings sofort nach Buchungsregel.",
    "warning": "TCV, ACV, ARR und fakturierter Umsatz dürfen nicht beliebig als Bookings bezeichnet werden.",
    "kpi": "book-to-bill"
  },
  {
    "id": "quota",
    "title": "Quota",
    "translation": "Vertriebsziel",
    "definition": "Vereinbarte Zielgröße für einen Verkäufer oder ein Team in einer Periode.",
    "example": "Jahresquota eines Account Managers: 800.000 € Bookings.",
    "warning": "Die Quota muss dieselbe Umsatzdefinition verwenden wie die Ist-Leistung.",
    "kpi": "quota-attainment"
  },
  {
    "id": "acv",
    "title": "ACV",
    "translation": "Annual Contract Value",
    "definition": "Auf ein Jahr umgerechneter laufzeitbezogener Vertragswert, hier ohne Einmalumsätze.",
    "example": "180.000 € wiederkehrend über drei Jahre: 60.000 € ACV.",
    "warning": "Einmalige Einführungskosten gehören bei der hier verwendeten Definition nicht hinein.",
    "kpi": "acv"
  },
  {
    "id": "tcv",
    "title": "TCV",
    "translation": "Total Contract Value",
    "definition": "Gesamter vertraglich vereinbarter Wert über die definierte Laufzeit, je nach Standard einschließlich einmaliger Leistungen.",
    "example": "180.000 € laufende Gebühren + 20.000 € Einführung = 200.000 € TCV.",
    "warning": "Mehrjahres-TCV ist nicht gleich einjähriger Umsatz.",
    "kpi": "tcv"
  },
  {
    "id": "arr",
    "title": "ARR",
    "translation": "Annual Recurring Revenue",
    "definition": "Auf ein Jahr normierter wiederkehrender Erlösbestand am Stichtag.",
    "example": "80.000 € monatlich wiederkehrend = 960.000 € ARR.",
    "warning": "Einmalprojekte und bereits vereinnahmte Vorauszahlungen sind kein ARR.",
    "kpi": "arr"
  },
  {
    "id": "mrr",
    "title": "MRR",
    "translation": "Monthly Recurring Revenue",
    "definition": "Auf einen Monat normierter wiederkehrender Erlösbestand.",
    "example": "1,2 Mio. € ARR entsprechen 100.000 € MRR.",
    "warning": "Nicht mit tatsächlichem Zahlungseingang desselben Monats verwechseln.",
    "kpi": "mrr"
  },
  {
    "id": "nrr",
    "title": "NRR",
    "translation": "Net Revenue Retention",
    "definition": "Umsatzbindung derselben Bestandskundenkohorte inklusive Upselling und Downgrades, ohne Neukunden.",
    "example": "Aus 1 Mio. € Start-ARR werden im gleichen Kundenbestand 1,08 Mio. €: NRR 108 %.",
    "warning": "Neukunden nicht in den Zähler aufnehmen.",
    "kpi": "nrr"
  },
  {
    "id": "grr",
    "title": "GRR",
    "translation": "Gross Revenue Retention",
    "definition": "Umsatzbindung derselben Bestandskundenkohorte ohne Expansion; Kündigungen und Downgrades werden abgezogen.",
    "example": "Start-ARR 1 Mio. €, 90.000 € verloren: GRR 91 %.",
    "warning": "Expansion darf die GRR nicht erhöhen.",
    "kpi": "grr"
  },
  {
    "id": "churn",
    "title": "Churn",
    "translation": "Kunden- oder Umsatzabwanderung",
    "definition": "Verlust von Kunden (Logo Churn) oder wiederkehrendem Umsatz (Revenue Churn), je nach gewählter Definition.",
    "example": "10 von 200 Anfangskunden gehen verloren: Logo Churn 5 %.",
    "warning": "Kundenabwanderung nicht mit Umsatzabwanderung verwechseln.",
    "kpi": "logo-churn"
  },
  {
    "id": "cac",
    "title": "CAC",
    "translation": "Customer Acquisition Cost",
    "definition": "Voll zugerechnete Vertriebs- und Marketing-Akquisekosten pro neu gewonnenem Kunden.",
    "example": "300.000 € Akquisekosten / 30 neue Kunden = 10.000 € CAC.",
    "warning": "Lange Sales Cycles erfordern zeitlich passende Kostenzuordnung.",
    "kpi": "cac"
  },
  {
    "id": "ltv",
    "title": "LTV",
    "translation": "Lifetime Value",
    "definition": "Modellierter wirtschaftlicher Wert eines Kunden über die angenommene Vertragsdauer, idealerweise auf Basis von Deckungsbeiträgen.",
    "example": "Kunde erzeugt über mehrere Jahre geschätzte 60.000 € Bruttogewinn.",
    "warning": "LTV ist eine Schätzung, keine sichere zukünftige Einnahme.",
    "kpi": "ltv"
  },
  {
    "id": "gross-margin",
    "title": "Gross Margin",
    "translation": "Bruttomarge",
    "definition": "Anteil des Umsatzes, der nach direkt zuordenbaren Umsatzkosten übrig bleibt.",
    "example": "1 Mio. € Umsatz minus 250.000 € direkte Kosten = 75 % Bruttomarge.",
    "warning": "Nicht mit EBIT-, EBITDA- oder Nettomarge gleichsetzen.",
    "kpi": "gross-margin"
  },
  {
    "id": "cogs",
    "title": "COGS",
    "translation": "Direkt zurechenbare Umsatzkosten",
    "definition": "Cost of Goods Sold: die definierten direkten Kosten zur Erbringung einer Leistung oder des Softwarebetriebs.",
    "example": "Hosting, operative Supportleistungen und direkt bezogene Leistung, soweit nach Firmenstandard als COGS erfasst.",
    "warning": "Die Kostenabgrenzung ist vom Rechnungslegungs- und Geschäftsmodell abhängig.",
    "kpi": "gross-margin"
  },
  {
    "id": "billable",
    "title": "Billable Hours",
    "translation": "Abrechenbare Stunden",
    "definition": "Projekt- oder Beratungsstunden, die grundsätzlich Kundenprojekten verrechenbar zugeordnet werden.",
    "example": "120 abrechenbare von 160 verfügbaren Stunden.",
    "warning": "Abrechenbar geleistet bedeutet noch nicht tatsächlich fakturiert oder bezahlt.",
    "kpi": "utilization"
  },
  {
    "id": "utilization",
    "title": "Utilization",
    "translation": "Auslastungsquote",
    "definition": "Anteil der als abrechenbar geleisteten Stunden an der definierten verfügbaren Kapazität.",
    "example": "120 / 160 = 75 % billable Utilization.",
    "warning": "Urlaub, Krankheit, interne Aufgaben und Schulungen konsistent behandeln.",
    "kpi": "utilization"
  },
  {
    "id": "realization",
    "title": "Realization",
    "translation": "Erlösrealisierungsquote",
    "definition": "Anteil des theoretischen Stundenwerts, der in der gewählten Erlösdefinition tatsächlich realisiert wird.",
    "example": "100.000 € theoretisch, 90.000 € realisiert: 90 %.",
    "warning": "Nicht automatisch eine Kennzahl für Zahlungseingang.",
    "kpi": "realization"
  },
  {
    "id": "backlog",
    "title": "Backlog",
    "translation": "Gesicherter Auftragsbestand",
    "definition": "Bereits verbindlich beauftragte, aber noch nicht erbrachte und nach Definition noch offene Leistungen.",
    "example": "900.000 € gesicherte Consulting-Projekte stehen zur Lieferung an.",
    "warning": "Auftragsbestand nicht mit ungewonnener Vertriebspipeline vermischen.",
    "kpi": "backlog-coverage"
  },
  {
    "id": "cohort",
    "title": "Kohorte",
    "translation": "Feste Vergleichsgruppe",
    "definition": "Eine eindeutig definierte Gruppe von Deals, Kunden oder Leads, deren Entwicklung über einen Zeitraum verfolgt wird.",
    "example": "Alle Opportunities, die im Januar qualifiziert wurden, bilden eine Kohorte.",
    "warning": "Den Nenner nicht durch später neu hinzugekommene Fälle verwässern.",
    "kpi": "stage-conversion"
  },
  {
    "id": "icp",
    "title": "ICP",
    "translation": "Ideal Customer Profile",
    "definition": "Beschreibung der Unternehmen, für die Produkt, Problem und Geschäftsmodell besonders gut passen.",
    "example": "Maschinenbauunternehmen ab 500 Mitarbeitern mit komplexem Außendienst.",
    "warning": "Ein ICP beschreibt passende Firmen, nicht automatisch entscheidungsbereite Käufer.",
    "kpi": "lead-conversion"
  },
  {
    "id": "stage-aging",
    "title": "Stage Aging",
    "translation": "Liegedauer in einer Vertriebsphase",
    "definition": "Zeit, die eine Opportunity bereits in ihrer aktuellen Vertriebsphase verbringt.",
    "example": "Ein Deal ist seit 45 Tagen in der Verhandlung.",
    "warning": "Eine lange Liegedauer kann auf Blocker oder echte Prozesskomplexität hinweisen.",
    "kpi": "stage-age"
  },
  {
    "id": "sales-velocity",
    "title": "Sales Velocity",
    "translation": "Vertriebsgeschwindigkeit / Wertdurchsatz",
    "definition": "Modellierte Wertleistung je Zeiteinheit aus Opportunity-Anzahl, mittlerem Dealwert, Win Rate und Sales Cycle.",
    "example": "60 × 40.000 € × 25 % / 100 Tage = 6.000 €/Tag.",
    "warning": "Keine Garantie, dass jeden Tag genau dieser Umsatz realisiert wird.",
    "kpi": "sales-velocity"
  },
  {
    "id": "conversion-rate",
    "title": "Conversion Rate",
    "translation": "Umwandlungsquote",
    "definition": "Anteil einer Ausgangsgruppe, der einen festgelegten nächsten Prozessschritt erfolgreich erreicht.",
    "example": "20 aus 100 SQL werden Opportunities: 20 %.",
    "warning": "Kohorten und Zeiträume müssen identisch abgegrenzt werden.",
    "kpi": "sql-opportunity"
  }
];
export const glossaryById = Object.fromEntries(glossary.map(t=>[t.id,t]));
