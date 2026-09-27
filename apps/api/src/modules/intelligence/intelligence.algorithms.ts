import { EvidenceConfidence } from '@fixiq/shared';

export interface ConfidenceCalculationResult {
  confidence: EvidenceConfidence;
  evidenceStrength: number; // Normalized 0.0 to 1.0
  successRate: number; // 0.0 to 1.0
  frequency: number; // 0.0 to 1.0
}

/**
 * Calculates deterministic evidence confidence using sample size weighting and Laplace smoothing.
 * Prevents small-sample distortion (e.g., 1 case out of 1 cannot claim 100% high confidence).
 */
export function calculateEvidenceConfidence(
  totalSimilarCases: number,
  confirmedCases: number,
  successfulRepairs: number
): ConfidenceCalculationResult {
  if (totalSimilarCases <= 0 || confirmedCases <= 0) {
    return {
      confidence: EvidenceConfidence.VERY_LOW,
      evidenceStrength: 0,
      successRate: 0,
      frequency: 0,
    };
  }

  const boundedConfirmed = Math.min(confirmedCases, totalSimilarCases);
  const boundedSuccessful = Math.min(successfulRepairs, boundedConfirmed);

  const frequency = boundedConfirmed / totalSimilarCases;
  const successRate = boundedSuccessful / boundedConfirmed;

  // Laplace smoothed base probability
  const smoothedProb = (boundedConfirmed + 1) / (totalSimilarCases + 2);

  // Sample size dampening factor: scales from 0 to ~0.95 as sample size reaches 30+
  const sampleConfidenceFactor = 1 - 1 / Math.sqrt(totalSimilarCases + 1);

  // Evidence strength combines frequency, success rate, and sample size weight
  const evidenceStrength = Number(
    (smoothedProb * 0.5 + successRate * 0.5 * sampleConfidenceFactor).toFixed(3)
  );

  let confidence: EvidenceConfidence = EvidenceConfidence.VERY_LOW;

  if (totalSimilarCases >= 25 && evidenceStrength >= 0.7) {
    confidence = EvidenceConfidence.VERY_HIGH;
  } else if (totalSimilarCases >= 12 && evidenceStrength >= 0.55) {
    confidence = EvidenceConfidence.HIGH;
  } else if (totalSimilarCases >= 6 && evidenceStrength >= 0.4) {
    confidence = EvidenceConfidence.MODERATE;
  } else if (totalSimilarCases >= 2) {
    confidence = EvidenceConfidence.LOW;
  } else {
    confidence = EvidenceConfidence.VERY_LOW;
  }

  return {
    confidence,
    evidenceStrength,
    successRate: Number(successRate.toFixed(3)),
    frequency: Number(frequency.toFixed(3)),
  };
}

export interface RepeatFailureCheckParams {
  serialNumber: string;
  currentRepairDate: Date;
  previousRepairs: {
    repairJobId: string;
    completedAt: Date;
    symptoms: string[];
    confirmedComponents: string[];
  }[];
  windowDays?: number;
}

export interface RepeatFailureRisk {
  isRepeatFailure: boolean;
  repeatCount: number;
  daysSinceLastRepair: number;
  matchingSymptoms: string[];
  previouslyReplacedComponents: string[];
  warningMessage?: string;
}

/**
 * Detects if a device is a warranty comeback / repeat failure within an operational window (default 90 days).
 */
export function evaluateRepeatFailure(
  params: RepeatFailureCheckParams
): RepeatFailureRisk {
  const windowDays = params.windowDays ?? 90;
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  const recentRepairs = params.previousRepairs.filter((prev) => {
    const elapsed = params.currentRepairDate.getTime() - prev.completedAt.getTime();
    return elapsed >= 0 && elapsed <= windowMs;
  });

  if (recentRepairs.length === 0) {
    return {
      isRepeatFailure: false,
      repeatCount: 0,
      daysSinceLastRepair: -1,
      matchingSymptoms: [],
      previouslyReplacedComponents: [],
    };
  }

  const latestPrevious = recentRepairs.sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  )[0]!;

  const daysSince = Math.floor(
    (params.currentRepairDate.getTime() - latestPrevious.completedAt.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const allPreviousComponents = Array.from(
    new Set(recentRepairs.flatMap((r) => r.confirmedComponents))
  );

  return {
    isRepeatFailure: true,
    repeatCount: recentRepairs.length,
    daysSinceLastRepair: daysSince,
    matchingSymptoms: latestPrevious.symptoms,
    previouslyReplacedComponents: allPreviousComponents,
    warningMessage: `Device ${params.serialNumber} returned ${daysSince} days after previous repair. Repeat failure count: ${recentRepairs.length}. Previously replaced: ${allPreviousComponents.join(', ') || 'None'}. Inspect for secondary upstream power surge or cascade failure.`,
  };
}
