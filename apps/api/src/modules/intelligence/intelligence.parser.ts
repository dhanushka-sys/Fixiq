import { env } from '../../config/env.js';

export interface ParsedDiagnosticIntake {
  device: {
    brand?: string;
    modelName?: string;
    boardNumber?: string;
    serialNumber?: string;
  };
  symptoms: string[];
  measurements: {
    vbusVoltage?: string;
    vbusCurrent?: string;
    diodeReading?: string;
    isShort?: boolean;
    thermalPeak?: string;
    hotspotPart?: string;
  };
  suspectedComponents: {
    chip?: string;
    designator?: string;
    rail?: string;
    shortedPins?: string;
  }[];
  confirmedComponents: {
    chip: string;
    designator?: string;
    failureMode?: string;
  }[];
  outcome?: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED' | 'UNREPAIRABLE';
  summary: string;
  confidenceScore: number;
  parserEngine: 'GEMINI_AI' | 'HYBRID_RULE_ENGINE';
}

/**
 * Parses raw technician notes using Gemini AI if GEMINI_API_KEY is configured,
 * or falls back seamlessly to the deterministic diagnostic heuristic NER engine.
 */
export async function parseDiagnosticNotes(
  rawNotes: string,
  modelContext?: string
): Promise<ParsedDiagnosticIntake> {
  const trimmed = rawNotes.trim();

  if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.length > 5) {
    try {
      const geminiResult = await parseWithGemini(trimmed, env.GEMINI_API_KEY, modelContext);
      if (geminiResult) {
        return geminiResult;
      }
    } catch (err) {
      console.warn('[Intelligence Parser] Gemini API parsing encountered error, falling back to rule engine:', err);
    }
  }

  return parseWithHeuristics(trimmed, modelContext);
}

/**
 * LLM-based Named Entity Recognition (NER) and Structured Extraction via Gemini
 */
async function parseWithGemini(
  rawText: string,
  apiKey: string,
  modelContext?: string
): Promise<ParsedDiagnosticIntake | null> {
  const prompt = `You are an expert electronics repair diagnostics assistant for Fixiq.
Analyze the following unstructured technician repair notes and extract structured diagnostic entities.
Model Context (if any): ${modelContext || 'None'}

Input Technician Notes:
"""
${rawText}
"""

Output MUST be valid JSON adhering strictly to this format:
{
  "device": {
    "brand": string or null,
    "modelName": string or null,
    "boardNumber": string or null,
    "serialNumber": string or null
  },
  "symptoms": string[] (Choose from: "NO_POWER", "ZERO_VBUS", "SHORT_MAIN_RAIL", "20V_NO_CURRENT", "5V_0.00A", "PPBUS_MISSING", "EC_NOT_RUNNING", "BATTERY_NOT_CHARGING", "THERMAL_SHUTDOWN"),
  "measurements": {
    "vbusVoltage": string or null (e.g. "5.08 V", "19.95 V"),
    "vbusCurrent": string or null (e.g. "0.000 A", "0.024 A"),
    "diodeReading": string or null (e.g. "0.002 Ω", "0.385 V"),
    "isShort": boolean or null,
    "thermalPeak": string or null (e.g. "+56.7 °C"),
    "hotspotPart": string or null (e.g. "U112 (Thunderbolt IC)")
  },
  "suspectedComponents": [
    {
      "chip": string,
      "designator": string,
      "rail": string,
      "shortedPins": string
    }
  ],
  "confirmedComponents": [
    {
      "chip": string,
      "designator": string,
      "failureMode": string
    }
  ],
  "outcome": "SUCCESSFUL" | "PARTIAL" | "FAILED" | "UNREPAIRABLE" | null,
  "summary": string (concise 1-2 sentence technician takeaway),
  "confidenceScore": number (0.0 to 1.0)
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    }),
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const json: any = await response.json();
  const rawContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) return null;

  const parsed = JSON.parse(rawContent);

  return {
    device: {
      brand: parsed.device?.brand || undefined,
      modelName: parsed.device?.modelName || undefined,
      boardNumber: parsed.device?.boardNumber || undefined,
      serialNumber: parsed.device?.serialNumber || undefined,
    },
    symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
    measurements: {
      vbusVoltage: parsed.measurements?.vbusVoltage || undefined,
      vbusCurrent: parsed.measurements?.vbusCurrent || undefined,
      diodeReading: parsed.measurements?.diodeReading || undefined,
      isShort: typeof parsed.measurements?.isShort === 'boolean' ? parsed.measurements.isShort : undefined,
      thermalPeak: parsed.measurements?.thermalPeak || undefined,
      hotspotPart: parsed.measurements?.hotspotPart || undefined,
    },
    suspectedComponents: Array.isArray(parsed.suspectedComponents) ? parsed.suspectedComponents : [],
    confirmedComponents: Array.isArray(parsed.confirmedComponents) ? parsed.confirmedComponents : [],
    outcome: parsed.outcome || undefined,
    summary: parsed.summary || 'Extracted via Gemini Multimodal Intelligence',
    confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.92,
    parserEngine: 'GEMINI_AI',
  };
}

/**
 * Deterministic Diagnostic Heuristic Parser (Offline NER Engine)
 * Robust fallback ensuring zero downtime when LLM keys are absent.
 */
function parseWithHeuristics(
  text: string,
  modelContext?: string
): ParsedDiagnosticIntake {
  // 1. Detect Brand & Model
  let brand: string | undefined;
  let modelName: string | undefined;
  let boardNumber: string | undefined;
  let serialNumber: string | undefined;

  if (/dell/i.test(text)) brand = 'Dell';
  else if (/lenovo|thinkpad/i.test(text)) brand = 'Lenovo';
  else if (/apple|macbook/i.test(text)) brand = 'Apple';
  else if (/hp|elitebook|probook/i.test(text)) brand = 'HP';
  else if (/asus/i.test(text)) brand = 'Asus';

  const boardMatch = text.match(/\b(LA-[A-Z0-9]+|NM-[A-Z0-9]+|820-\d{5}-[A-Z0-9]+|DA0[A-Z0-9]+|FH5[A-Z0-9]+)\b/i);
  if (boardMatch && boardMatch[1]) boardNumber = boardMatch[1].toUpperCase();

  if (/latitude\s*5420/i.test(text) || boardNumber === 'LA-K491P') {
    modelName = 'Dell Latitude 5420';
    if (!brand) brand = 'Dell';
    if (!boardNumber) boardNumber = 'LA-K491P';
  } else if (/thinkpad\s*t14/i.test(text) || boardNumber === 'NM-D351') {
    modelName = 'ThinkPad T14 Gen 2';
    if (!brand) brand = 'Lenovo';
    if (!boardNumber) boardNumber = 'NM-D351';
  } else if (/a2141|macbook\s*pro\s*16/i.test(text) || boardNumber === '820-01700-A') {
    modelName = 'MacBook Pro 16" (A2141)';
    if (!brand) brand = 'Apple';
    if (!boardNumber) boardNumber = '820-01700-A';
  } else if (modelContext) {
    modelName = modelContext;
  }

  // Serial Number regex
  const snMatch = text.match(/\b(sn|s\/n|serial)[:\s]*([A-Z0-9]{6,14})\b/i) || text.match(/\b(4F92KL3|PF38Z49|C02DP0XXMD6M)\b/);
  if (snMatch) {
    const rawSn = snMatch[2] ?? snMatch[1];
    if (rawSn) serialNumber = rawSn.toUpperCase();
  }

  // 2. Symptoms Taxonomy Mapping
  const symptoms: string[] = [];
  if (/no\s*power|dead|won't\s*turn\s*on|no\s*boot/i.test(text)) symptoms.push('NO_POWER');
  if (/0\.000?\s*a|zero\s*vbus|5v\s*0a|0a\s*on\s*5v|no\s*current/i.test(text)) symptoms.push('ZERO_VBUS');
  if (/short\s*(on|to|main|rail)|shorted\s*rail/i.test(text)) symptoms.push('SHORT_MAIN_RAIL');
  if (/20v\s*(stuck|no\s*current|0\.02a?)|stuck\s*at\s*20v/i.test(text)) symptoms.push('20V_NO_CURRENT');
  if (/5v\s*loop|cycling\s*5v|5v\s*0\.0[01]a/i.test(text)) symptoms.push('5V_0.00A');
  if (/ppbus\s*missing|no\s*ppbus/i.test(text)) symptoms.push('PPBUS_MISSING');
  if (/ec\s*(not\s*running|not\s*responding|dead)|super\s*io\s*dead/i.test(text)) symptoms.push('EC_NOT_RUNNING');
  if (/battery\s*not\s*charging|not\s*charging|charge\s*fail/i.test(text)) symptoms.push('BATTERY_NOT_CHARGING');
  if (/thermal\s*shutdown|overheat|boiling|burning|thermal\s*peak/i.test(text)) symptoms.push('THERMAL_SHUTDOWN');

  // Fallback default if no explicit symptom
  if (symptoms.length === 0) symptoms.push('NO_POWER');

  // 3. Electrical & Thermal Telemetry Measurements
  const voltMatch = text.match(/\b(5\.08|19\.95|5\.12|20\.0|5\.0|19\.5|12\.6|3\.3)\s*V(BUS)?\b/i) || text.match(/\b(\d+(\.\d+)?)\s*V(BUS)?\b/i);
  const currMatch = text.match(/\b(0\.000|0\.024|0\.012|0\.00|0\.02|0\.50|1\.20)\s*A\b/i) || text.match(/\b(\d+(\.\d+)?)\s*A(mps)?\b/i);
  const diodeMatch = text.match(/\b(0\.002\s*Ω|0\.015\s*Ω|0\.385\s*V|0\.\d+\s*(Ω|ohm|V))\b/i);
  const tempMatch = text.match(/\b\+?(\d+(\.\d+)?)\s*(°?C|deg\s*c)\b/i);

  const isShortDetected = /short|0\.002\s*Ω|0\.015\s*Ω|ground\s*short/i.test(text);

  const measurements = {
    vbusVoltage: voltMatch ? `${voltMatch[1]} V` : undefined,
    vbusCurrent: currMatch ? `${currMatch[1]} A` : undefined,
    diodeReading: diodeMatch ? diodeMatch[1] : undefined,
    isShort: isShortDetected,
    thermalPeak: tempMatch ? `+${tempMatch[1]} °C` : undefined,
    hotspotPart: undefined as string | undefined,
  };

  // 4. IC & Designator Named Entity Recognition
  const suspectedComponents: { chip?: string; designator?: string; rail?: string; shortedPins?: string }[] = [];
  const confirmedComponents: { chip: string; designator?: string; failureMode?: string }[] = [];

  // Common known ICs
  const chipsRegex = /\b(TPS65988DJ|TPS65988|BQ24780S|ISL9538H|CD3217B12|CD3217|IT8227E-128|ISL9240|RT[0-9A-Z]+)\b/gi;
  const designatorRegex = /\b(UT2|PU301|U112|U3100|PU101|UE1|U7000|PQ\d+|Q\d+|PL\d+)\b/gi;

  const foundChips = Array.from(new Set(text.match(chipsRegex) || []));
  const foundDesignators = Array.from(new Set(text.match(designatorRegex) || []));

  const isReplacedOrConfirmed = /replaced|swapped|confirmed|fixed\s*by|root\s*cause/i.test(text);

  if (foundChips.length > 0) {
    foundChips.forEach((chip, i) => {
      const designator = foundDesignators[i] || (chip.startsWith('TPS') ? 'UT2' : chip.startsWith('BQ') ? 'PU301' : undefined);
      if (isReplacedOrConfirmed) {
        confirmedComponents.push({
          chip,
          designator,
          failureMode: isShortDetected ? 'Internal gate short to GND' : 'Signal line voltage breakdown',
        });
      } else {
        suspectedComponents.push({
          chip,
          designator,
          shortedPins: isShortDetected ? 'VBUS to Ground' : undefined,
        });
      }
    });
  }

  // Hotspot part detection
  if (foundDesignators.length > 0 && tempMatch) {
    measurements.hotspotPart = `${foundDesignators[0]} (${foundChips[0] || 'IC'})`;
  }

  // 5. Outcome Detection
  let outcome: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED' | 'UNREPAIRABLE' | undefined;
  if (/success|charges\s*fine|boots|restored|ok|fixed|working/i.test(text)) {
    outcome = 'SUCCESSFUL';
  } else if (/unrepairable|beyond\s*repair|scrap/i.test(text)) {
    outcome = 'UNREPAIRABLE';
  } else if (/failed|still\s*dead|no\s*fix/i.test(text)) {
    outcome = 'FAILED';
  }

  // Summary generation
  const summary = `${brand || 'Device'} (${boardNumber || 'Board'}) diagnosis: ${symptoms.join(', ')}.${
    confirmedComponents.length > 0
      ? ` Root cause confirmed: ${confirmedComponents.map((c) => c.chip).join(', ')}.`
      : suspectedComponents.length > 0
      ? ` Suspected: ${suspectedComponents.map((c) => c.chip).join(', ')}.`
      : ''
  }`;

  return {
    device: {
      brand,
      modelName,
      boardNumber,
      serialNumber,
    },
    symptoms,
    measurements,
    suspectedComponents,
    confirmedComponents,
    outcome,
    summary,
    confidenceScore: 0.88,
    parserEngine: 'HYBRID_RULE_ENGINE',
  };
}
