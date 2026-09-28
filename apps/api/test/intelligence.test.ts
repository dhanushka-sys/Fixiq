import { describe, it, expect } from 'vitest';
import {
  calculateEvidenceConfidence,
  evaluateRepeatFailure,
} from '../src/modules/intelligence/intelligence.algorithms.js';
import { EvidenceConfidence } from '@fixiq/shared';

describe('Intelligence Engine: calculateEvidenceConfidence', () => {
  it('should return VERY_LOW confidence when sample size is zero', () => {
    const result = calculateEvidenceConfidence(0, 0, 0);
    expect(result.confidence).toBe(EvidenceConfidence.VERY_LOW);
    expect(result.evidenceStrength).toBe(0);
    expect(result.successRate).toBe(0);
  });

  it('should prevent 100% confidence inflation on 1/1 case via Laplace smoothing', () => {
    const result = calculateEvidenceConfidence(1, 1, 1);
    // Even though 1/1 is 100% raw, confidence must remain LOW or VERY_LOW
    expect(result.confidence).toBe(EvidenceConfidence.VERY_LOW);
    expect(result.evidenceStrength).toBeLessThan(0.6);
  });

  it('should grant HIGH or VERY_HIGH confidence on large empirical sample sizes with high success', () => {
    const result = calculateEvidenceConfidence(42, 35, 33);
    expect(result.confidence).toBe(EvidenceConfidence.VERY_HIGH);
    expect(result.successRate).toBeGreaterThan(0.9);
    expect(result.frequency).toBeGreaterThan(0.8);
    expect(result.evidenceStrength).toBeGreaterThan(0.7);
  });

  it('should downgrade confidence when repair success rate is poor despite high frequency', () => {
    // 30 cases confirmed, but only 5 repairs succeeded (failed repair attempts)
    const result = calculateEvidenceConfidence(30, 30, 5);
    expect(result.successRate).toBeCloseTo(0.167, 2);
    expect(result.evidenceStrength).toBeLessThan(0.6);
  });
});

describe('Intelligence Engine: evaluateRepeatFailure', () => {
  const baseDate = new Date('2026-09-27T10:00:00Z');

  it('should detect repeat failure within 90 days with matching symptoms', () => {
    const previousDate = new Date('2026-08-15T10:00:00Z'); // ~43 days ago
    const result = evaluateRepeatFailure({
      serialNumber: 'SN-TEST-4421',
      currentRepairDate: baseDate,
      previousRepairs: [
        {
          repairJobId: 'rep-prev-1',
          completedAt: previousDate,
          symptoms: ['Won not turn on', 'No VBUS 20V negotiation'],
          confirmedComponents: ['TPS65988'],
        },
      ],
      windowDays: 90,
    });

    expect(result.isRepeatFailure).toBe(true);
    expect(result.repeatCount).toBe(1);
    expect(result.daysSinceLastRepair).toBe(43);
    expect(result.previouslyReplacedComponents).toContain('TPS65988');
    expect(result.warningMessage).toBeDefined();
    expect(result.warningMessage).toContain('SN-TEST-4421');
  });

  it('should ignore repairs outside the operational comeback window', () => {
    const oldDate = new Date('2025-01-01T10:00:00Z'); // >1.5 years ago
    const result = evaluateRepeatFailure({
      serialNumber: 'SN-OLD-11',
      currentRepairDate: baseDate,
      previousRepairs: [
        {
          repairJobId: 'rep-old',
          completedAt: oldDate,
          symptoms: ['Battery degraded'],
          confirmedComponents: ['Battery Pack'],
        },
      ],
      windowDays: 90,
    });

    expect(result.isRepeatFailure).toBe(false);
    expect(result.repeatCount).toBe(0);
    expect(result.daysSinceLastRepair).toBe(-1);
  });
});

describe('AI/NLP Quick-Intake Diagnostic Parser', () => {
  it('should parse technician notes for Dell Latitude 5420 correctly', async () => {
    const { parseDiagnosticNotes } = await import('../src/modules/intelligence/intelligence.parser.js');
    const raw = `Dell Latitude 5420 board LA-K491P came in dead. Won't turn on, drawing 0.000A at 5.08V. Diode reading 0.002 Ω short on main rail. Thermal cam spotted UT2 TPS65988 shorted. Replaced UT2, tested ok, successful power on.`;

    const parsed = await parseDiagnosticNotes(raw);

    expect(parsed.device.brand).toBe('Dell');
    expect(parsed.device.boardNumber).toBe('LA-K491P');
    expect(parsed.symptoms).toContain('NO_POWER');
    expect(parsed.symptoms).toContain('ZERO_VBUS');
    expect(parsed.symptoms).toContain('SHORT_MAIN_RAIL');
    expect(parsed.measurements.vbusVoltage).toBe('5.08 V');
    expect(parsed.measurements.vbusCurrent).toBe('0.000 A');
    expect(parsed.measurements.isShort).toBe(true);
    expect(parsed.confirmedComponents.some((c) => c.chip.includes('TPS65988'))).toBe(true);
    expect(parsed.outcome).toBe('SUCCESSFUL');
  });

  it('should parse ThinkPad T14 telemetry and thermal hotspot accurately', async () => {
    const { parseDiagnosticNotes } = await import('../src/modules/intelligence/intelligence.parser.js');
    const raw = `ThinkPad T14 Gen 2 NM-D351 SN:PF38Z49 no power, stuck at 20V 0.024A. EC not responding. Thermal peak +56.7 C around U112 TPS65988DJ. Replaced chip, restored 20V negotiation.`;

    const parsed = await parseDiagnosticNotes(raw);

    expect(parsed.device.modelName).toBe('ThinkPad T14 Gen 2');
    expect(parsed.device.boardNumber).toBe('NM-D351');
    expect(parsed.device.serialNumber).toBe('PF38Z49');
    expect(parsed.symptoms).toContain('20V_NO_CURRENT');
    expect(parsed.symptoms).toContain('EC_NOT_RUNNING');
    expect(parsed.measurements.vbusVoltage).toBe('20 V');
    expect(parsed.measurements.vbusCurrent).toBe('0.024 A');
    expect(parsed.measurements.thermalPeak).toBe('+56.7 °C');
    expect(parsed.outcome).toBe('SUCCESSFUL');
  });
});

