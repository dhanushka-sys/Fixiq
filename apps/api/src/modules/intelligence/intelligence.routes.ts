import { Router, Request, Response } from 'express';
import { prisma } from '@fixiq/database';
import { parseDiagnosticNotesSchema } from '@fixiq/validation';
import { calculateEvidenceConfidence } from './intelligence.algorithms.js';
import { parseDiagnosticNotes } from './intelligence.parser.js';
import { resolveOrganizationId } from '../../utils/tenant.js';

export const intelligenceRouter = Router();

// GET /api/patterns - List all empirical failure patterns
intelligenceRouter.get('/patterns', async (req: Request, res: Response) => {
  try {
    const orgId = await resolveOrganizationId(req);
    const patterns = await prisma.failurePattern.findMany({
      where: {
        OR: [{ organizationId: orgId }, { organizationId: null }],
      },
      include: {
        component: true,
        symptom: true,
        deviceModel: true,
      },
      orderBy: { confirmedCases: 'desc' },
    });

    const formatted = patterns.map((p, idx) => {
      // Re-evaluate deterministic confidence calculation
      const stats = calculateEvidenceConfidence(
        p.totalCases,
        p.confirmedCases,
        p.successfulRepairs
      );

      return {
        id: `PAT-00${idx + 1}`,
        dbId: p.id,
        chip: p.component.partNumber,
        category: p.component.category,
        manufacturer: p.component.manufacturer ?? 'Component OEM',
        models: [p.deviceModel.modelName],
        symptom: p.symptom.name,
        faultPinout: p.circuitDesignator === 'UT2'
          ? 'Pin 14 (VBUS) shorted to Pin 19 (CC1)'
          : p.circuitDesignator === 'PU301'
          ? 'Pin 4 (ACDRV) output transistor breakdown'
          : 'PP1V5_UPC_LDO rail impedance short to Ground',
        totalCases: p.totalCases,
        confirmedCases: p.confirmedCases,
        verifiedSuccessRate: Number((stats.successRate * 100).toFixed(1)),
        confidence: stats.confidence,
        evidenceStrength: stats.evidenceStrength,
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching failure patterns:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch failure patterns from database' });
  }
});

// POST /api/intelligence/recommend - Dynamic Bayesian root-cause calculator
intelligenceRouter.post('/intelligence/recommend', async (req: Request, res: Response) => {
  try {
    const { deviceModel, symptoms } = req.body;

    const orgId = await resolveOrganizationId(req);
    const whereClause: any = {
      OR: [{ organizationId: orgId }, { organizationId: null }],
    };
    if (deviceModel) {
      whereClause.deviceModel = {
        OR: [
          { modelName: { contains: deviceModel, mode: 'insensitive' } },
          { boardNumber: { contains: deviceModel, mode: 'insensitive' } },
        ],
      };
    }
    if (symptoms && Array.isArray(symptoms) && symptoms.length > 0) {
      whereClause.symptom = {
        name: { in: symptoms },
      };
    }

    const patterns = await prisma.failurePattern.findMany({
      where: whereClause,
      include: {
        component: true,
        deviceModel: true,
        symptom: true,
      },
      orderBy: { confirmedCases: 'desc' },
    });

    const recommendations = patterns.map((p) => {
      const stats = calculateEvidenceConfidence(
        p.totalCases,
        p.confirmedCases,
        p.successfulRepairs
      );

      return {
        chip: p.component.partNumber,
        designator: p.circuitDesignator,
        role: p.component.description ?? 'Circuit Controller',
        probability: Number((stats.evidenceStrength * 100).toFixed(1)),
        confirmedCount: p.confirmedCases,
        totalCases: p.totalCases,
        confidence: stats.confidence,
        failureMode: p.symptom.description ?? 'Internal gate breakdown',
        shortedPins: p.circuitDesignator === 'UT2' ? 'Pin 14 (VBUS) to Pin 19 (CC1)' : 'Pin 4 (ACDRV) to GND',
      };
    });

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error('Error calculating recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to compute failure recommendations' });
  }
});

// POST /api/intelligence/parse-notes - AI/NLP Quick-Intake Diagnostic Parser
intelligenceRouter.post('/intelligence/parse-notes', async (req: Request, res: Response) => {
  try {
    const validated = parseDiagnosticNotesSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validated.error.format(),
      });
      return;
    }

    const { rawNotes, modelContext } = validated.data;
    const parsed = await parseDiagnosticNotes(rawNotes, modelContext);

    res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error parsing diagnostic notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse diagnostic notes',
    });
  }
});

