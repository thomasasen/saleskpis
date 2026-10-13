// Erklärung gerichteter Zusammenhänge für zentrale Kennzahlen. Nicht jede Beziehung ist kausal oder Teil der Formel.
export const dependencies = {
  "pipeline-coverage": [
    {
      "relatedId": "required-coverage",
      "label": "Wertgewichtete Abschlussquote",
      "kind": "indirekt",
      "explanation": "Eine geringere Win Rate erfordert mehr nominelle Pipeline. Sie ändert die Ratio bei unverändertem Zähler/Nenner nicht selbst."
    },
    {
      "relatedId": "avg-cycle",
      "label": "Abschlusszeitpunkt",
      "kind": "zeitlich",
      "explanation": "Die historische Gesamtdauer hilft, den Zeitraum zu beurteilen. Entscheidend ist jedoch die erwartete Restlaufzeit der offenen Deals."
    },
    {
      "relatedId": "slippage",
      "label": "Verschiebungsrisiko",
      "kind": "zeitlich",
      "explanation": "Verschobene Deals zählen für das laufende Ziel nicht als fristgerechte Abschlüsse."
    },
    {
      "relatedId": "avg-deal",
      "label": "Deal-Mix und Konzentration",
      "kind": "Risikotreiber",
      "explanation": "Größere Deals verändern die Stückzahl und die Volatilität, nicht unmittelbar die einfache Ratio."
    },
    {
      "relatedId": "stage-age",
      "label": "Pipelinequalität",
      "kind": "Datenqualität",
      "explanation": "Veraltete Phasen und nicht bestätigte Termine können den offenen Wert überzeichnen."
    }
  ],
  "win-rate": [
    {
      "relatedId": "win-rate-value",
      "label": "Wertgewichtung",
      "kind": "Verteilung",
      "explanation": "Eine hohe anzahlbasierte Win Rate kann mit niedriger wertgewichteter Win Rate einhergehen, wenn teure Deals öfter verloren gehen."
    },
    {
      "relatedId": "stage-conversion",
      "label": "Qualifikation",
      "kind": "Prozess",
      "explanation": "Frühe Stage-Konversion und stringentere Qualifizierung verändern die Zusammensetzung des Deal-Pools."
    },
    {
      "relatedId": "avg-deal",
      "label": "Dealgröße",
      "kind": "Segmentierung",
      "explanation": "Große Enterprise-Deals können andere Chancen haben als kleine Standardgeschäfte."
    }
  ],
  "avg-cycle": [
    {
      "relatedId": "stage-age",
      "label": "Bisherige Phasendauer",
      "kind": "Signal",
      "explanation": "Hohe Liegezeit einer offenen Opportunity deutet auf Engpässe, ist aber nicht identisch mit ihrer Restlaufzeit."
    },
    {
      "relatedId": "slippage",
      "label": "Close-Date-Qualität",
      "kind": "Folge",
      "explanation": "Lange oder unsichere Verkaufsprozesse erhöhen oft das Risiko terminlicher Verschiebung; die Quote ist separat zu messen."
    },
    {
      "relatedId": "sales-velocity",
      "label": "Wertdurchsatz",
      "kind": "Modell",
      "explanation": "Bei ansonsten gleichen Modellparametern sinkt Sales Velocity mit längerer Zyklusdauer."
    }
  ],
  "avg-deal": [
    {
      "relatedId": "pipeline-coverage",
      "label": "Pipelinevolumen",
      "kind": "Mengenhebel",
      "explanation": "Größere Deals erhöhen Pipeline nur, wenn deren Summe steigt. Bei fester Gesamtsumme bleibt Coverage unverändert."
    },
    {
      "relatedId": "sales-velocity",
      "label": "Wertdurchsatz",
      "kind": "Modell",
      "explanation": "Im Velocity-Modell erhöht ein größerer durchschnittlicher Dealwert den Durchsatz bei gleicher Dealanzahl."
    }
  ],
  "required-coverage": [
    {
      "relatedId": "win-rate-value",
      "label": "Wertgewichtete Win Rate",
      "kind": "Haupthebel",
      "explanation": "Bei 25 % Win Rate entspricht die theoretische Mindestdeckung 4×, sofern Gewinnwert zu 100 % im Zeitraum anfällt."
    },
    {
      "relatedId": "slippage",
      "label": "Fristgerechte Gewinnerwartung",
      "kind": "Zusatzhebel",
      "explanation": "Wenn Teile der später gewonnenen Deals zu spät kommen, muss die Perioden-Coverage höher ausfallen."
    },
    {
      "relatedId": "avg-cycle",
      "label": "Timing",
      "kind": "Einschränkung",
      "explanation": "Der durchschnittliche Gesamtzyklus allein reicht nicht für einen Timing-Abschlag."
    }
  ],
  "sales-velocity": [
    {
      "relatedId": "win-rate",
      "label": "Abschlussquote",
      "kind": "Multiplikator",
      "explanation": "Wird die Quote bei sonst gleichen Parametern um 20 % relativ erhöht, steigt der modellierte Wertdurchsatz um 20 %."
    },
    {
      "relatedId": "avg-deal",
      "label": "Dealwert",
      "kind": "Multiplikator",
      "explanation": "Höherer Durchschnittswert erhöht den modellierten Durchsatz bei konstanter Dealanzahl."
    },
    {
      "relatedId": "avg-cycle",
      "label": "Zyklusdauer",
      "kind": "Divisor",
      "explanation": "Kürzerer Sales Cycle erhöht den modellierten Durchsatz; nicht als garantierte Tageseinnahme interpretieren."
    }
  ],
  "forecast-error": [
    {
      "relatedId": "slippage",
      "label": "Dealverschiebungen",
      "kind": "Treiber",
      "explanation": "Zu optimistische Abschlussdaten führen zu Prognoseabweichungen."
    },
    {
      "relatedId": "commit-hit",
      "label": "Commit-Verlässlichkeit",
      "kind": "Signal",
      "explanation": "Eine sinkende Trefferrate von Commit-Deals kann auf schwache Dealinspektion hinweisen."
    },
    {
      "relatedId": "weighted-pipeline",
      "label": "Wahrscheinlichkeit",
      "kind": "Modell",
      "explanation": "Historisch kalibrierte Gewinnwahrscheinlichkeiten verbessern unter Umständen die Prognosequalität."
    }
  ],
  "weighted-pipeline": [
    {
      "relatedId": "win-rate-value",
      "label": "Kalibrierung",
      "kind": "Methode",
      "explanation": "Historische wertbasierte Übergangs- und Abschlussquoten helfen bei der Abschätzung von Stage-Wahrscheinlichkeiten."
    },
    {
      "relatedId": "slippage",
      "label": "Zeitraum",
      "kind": "Risiko",
      "explanation": "Ein erwarteter Gewinn kann außerhalb des Prognosefensters liegen."
    }
  ],
  "nrr": [
    {
      "relatedId": "grr",
      "label": "Grundbindung",
      "kind": "Abhängigkeit",
      "explanation": "Die GRR misst Verluste ohne Upsells. Expansion kann sie bei NRR überkompensieren."
    },
    {
      "relatedId": "revenue-churn",
      "label": "Umsatzverlust",
      "kind": "Treiber",
      "explanation": "Kündigungen und Downgrades reduzieren den Bestand."
    },
    {
      "relatedId": "expansion-share",
      "label": "Erweiterungsumsatz",
      "kind": "Treiber",
      "explanation": "Expansion erhöht NRR; Neukundenumsatz ist bei NRR ausgeschlossen."
    }
  ],
  "grr": [
    {
      "relatedId": "revenue-churn",
      "label": "Bruttoverlust",
      "kind": "Gegenstück",
      "explanation": "GRR entspricht bei konsistenter Kohorte 100 % minus Gross Revenue Churn."
    },
    {
      "relatedId": "nrr",
      "label": "Expansion",
      "kind": "Abgrenzung",
      "explanation": "NRR kann über 100 % steigen, GRR nicht."
    }
  ],
  "cac-payback": [
    {
      "relatedId": "cac-ratio",
      "label": "Akquisekosten",
      "kind": "Kosten",
      "explanation": "Höhere Kosten je gewonnenem Neukunden-ARR verlängern die Amortisation."
    },
    {
      "relatedId": "gross-margin",
      "label": "Bruttomarge",
      "kind": "Erlösqualität",
      "explanation": "Höhere direkte Leistungskosten reduzieren den Bruttogewinn und verlängern Payback."
    }
  ],
  "project-margin": [
    {
      "relatedId": "effective-rate",
      "label": "Realisierter Stundensatz",
      "kind": "Erlöshebel",
      "explanation": "Eine höhere tatsächliche Erlösrate kann die Marge erhöhen, wenn Lieferkosten stabil bleiben."
    },
    {
      "relatedId": "utilization",
      "label": "Auslastung",
      "kind": "Kapazität",
      "explanation": "Zu geringe Belegung verteuert häufig die Leistungserbringung, je nach Kostenrechnung."
    },
    {
      "relatedId": "project-overrun",
      "label": "Kostenüberschreitung",
      "kind": "Kostenhebel",
      "explanation": "Zusatzaufwand ohne Mehrvergütung reduziert die Projektmarge."
    }
  ],
  "utilization": [
    {
      "relatedId": "capacity-coverage",
      "label": "Auslastungsplanung",
      "kind": "Vorlauf",
      "explanation": "Geplante, bestätigte Stunden zeigen eine künftige Deckung der Kapazität an."
    },
    {
      "relatedId": "realization",
      "label": "Erlöswirkung",
      "kind": "Abgrenzung",
      "explanation": "Abrechenbare Stunden müssen nicht vollständig realisiert oder bezahlt werden."
    }
  ]
  ,"in-period-yield": [
    {"relatedId":"pipeline-coverage","label":"Coverage-Ziel","kind":"Kalibrierung","explanation":"1 geteilt durch den historischen periodenbezogenen Pipeline Yield liefert einen orientierenden Mindestmultiplikator."},
    {"relatedId":"win-rate-value","label":"Wertgewichtete Win Rate","kind":"Treiber","explanation":"Der Yield kann unter der wertgewichteten Abschlussquote liegen, weil nicht alle späteren Gewinne bereits innerhalb der Zielperiode eintreffen."},
    {"relatedId":"slippage","label":"Dealverschiebungen","kind":"Timing","explanation":"Wert von Deals, die erst nach der Frist gewonnen werden, zählt nicht zu rechtzeitig abgeschlossenem Pipelinewert."}
  ]

};
