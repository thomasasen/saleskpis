// Explizites, vereinfachtes Planungsszenario, nicht mit einem CRM-Forecast gleichzusetzen.
// Gewinnwahrscheinlichkeit = Chance, irgendwann zu gewinnen.
// On-Time-Quote = Anteil des erwarteten Gewinnwerts, der innerhalb des Planzeitraums realisiert wird.
// Ein tatsächlich kalibriertes Forecast-Modell sollte je Deal P(Win und OnTime) schätzen.

const has=(n)=>typeof n==='number'&&Number.isFinite(n);
const positive=(n)=>has(n)&&n>0;
const nonNegative=(n)=>has(n)&&n>=0;

export function diagnoseCoverage({pipeline,goal,winRate,onTimeRate,averageDeal,averageCycle,daysLeft,largestDeal}){
 const values=[pipeline,goal,winRate,onTimeRate,averageDeal,averageCycle,daysLeft,largestDeal];
 if(values.some(v=>!has(v))||!nonNegative(pipeline)||!nonNegative(goal)||
   winRate<0||winRate>100||onTimeRate<0||onTimeRate>100||
   !positive(averageDeal)||!positive(averageCycle)||!nonNegative(daysLeft)||
   !nonNegative(largestDeal)||largestDeal>pipeline)return null;
 const effectiveRate=winRate/100*onTimeRate/100;
 const ratio=goal>0?pipeline/goal:null;
 const expected=pipeline*effectiveRate;
 const remainingGap=Math.max(0,goal-expected);
 const requiredCoverage=effectiveRate>0?1/effectiveRate:null;
 const requiredPipeline=effectiveRate>0?goal/effectiveRate:null;
 const missingPipeline=requiredPipeline===null?null:Math.max(0,requiredPipeline-pipeline);
 const shareLargest=pipeline>0?largestDeal/pipeline*100:null;
 const winNeeded=pipeline>0&&onTimeRate>0?goal/(pipeline*(onTimeRate/100))*100:null;
 return {
  ratio,expected,remainingGap,requiredCoverage,requiredPipeline,missingPipeline,
  additionalDeals:missingPipeline===null?null:Math.ceil(missingPipeline/averageDeal),
  estimatedOpenDeals:pipeline/averageDeal,
  effectiveRate:effectiveRate*100,
  shareLargest,winNeeded,
  winRateRequiredFeasible:winNeeded!==null&&winNeeded<=100,
  cycleExceedsHorizon:averageCycle>daysLeft,
  // Sensitivität: Worst-Case ohne größten Deal; nicht probabilistische Annahme.
  expectedWithoutLargest:(pipeline-largestDeal)*effectiveRate,
  goalReached:goal===0,
  warnings:[
   ...(averageCycle>daysLeft?['Der mittlere gesamte Sales Cycle ist länger als der verbleibende Zeitraum. Die erwartete Restlaufzeit der bereits offenen Deals kann trotzdem kürzer sein. On-Time-Quote anhand ähnlicher Deals und ihrer aktuellen Phasen prüfen.']:[]),
   ...(shareLargest!==null&&shareLargest>=35?['Mindestens 35 % des Pipelinewerts hängen am größten Deal. Ein Konzentrationsrisiko, kein automatischer Abzug von der Coverage.']:[]),
   ...(effectiveRate===0&&goal>0?['Mit 0 % Gewinn- oder Fristgerechtigkeitsannahme kann rechnerisch keine endliche Pipeline das Restziel decken.']:[])
  ]
 };
}


/**
 * Benötigte Pipeline Coverage: Abhängigkeit von historischen, vergleichbaren Quoten.
 *
 * Methode "split":     P(rechtzeitiger Gewinn) = P(Gewinn) × P(rechtzeitig | Gewinn)
 * Methode "yield":     Historisch gemessener In-Period Pipeline Yield (Startkohorte).
 *
 * P(rechtzeitig | Gewinn) ist BEDINGT auf einen Gewinn, keine eigenständige
 * allgemeine Wahrscheinlichkeit. Werte sind wertbasiert und kohortenkompatibel.
 *
 * Das Ergebnis ist ein vereinfachter Erwartungswert ohne Risikoaufschlag.
 */
export function calculateRequiredCoverage({
  pipeline, goal, method = 'split',
  winRate, onTimeRate, inPeriodYield
}) {
  if (![pipeline,goal].every(Number.isFinite)||pipeline<0||goal<0||
      !['split','yield'].includes(method)) return {error:'invalid'};
  let effectiveRate;
  if (method === 'split') {
    if (![winRate,onTimeRate].every(Number.isFinite)||
        winRate<0||winRate>100||onTimeRate<0||onTimeRate>100) return {error:'invalid'};
    effectiveRate = (winRate/100) * (onTimeRate/100);
  } else {
    if (!Number.isFinite(inPeriodYield)||inPeriodYield<0||inPeriodYield>100) return {error:'invalid'};
    effectiveRate = inPeriodYield/100;
  }
  if (goal === 0) return {
    error:'target-reached', effectiveRatePercent:effectiveRate*100,
    currentCoverage:null, requiredCoverage:null, requiredPipeline:0,
    additionalPipeline:0, expectedBookings:pipeline*effectiveRate
  };
  const requiredCoverage = effectiveRate>0?1/effectiveRate:null;
  const requiredPipeline = effectiveRate>0?goal/effectiveRate:null;
  return {
    error:effectiveRate===0?'zero-yield':null,
    effectiveRatePercent:effectiveRate*100,
    currentCoverage:pipeline/goal,
    requiredCoverage,
    requiredPipeline,
    additionalPipeline:requiredPipeline===null?null:Math.max(0,requiredPipeline-pipeline),
    expectedBookings:pipeline*effectiveRate,
    expectedGap:Math.max(0,goal-pipeline*effectiveRate)
  };
}
