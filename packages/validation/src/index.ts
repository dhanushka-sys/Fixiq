import { z } from 'zod';
import {
  UserRole,
  RepairStatus,
  SymptomCategory,
  ComponentCategory,
  RepairActionType,
  TestOutcome,
} from '@fixiq/shared';

// Symptom Schema
export const createSymptomSchema = z.object({
  category: z.nativeEnum(SymptomCategory),
  name: z.string().min(1, 'Symptom name required'),
  description: z.string().optional().nullable(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  isCustom: z.boolean().default(false),
});

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.OWNER),
});

// Customer Schemas
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z.string().min(5, 'Invalid phone number').optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// Device Schemas
export const registerDeviceSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  manufacturer: z.string().min(1, 'Manufacturer required'),
  modelName: z.string().min(1, 'Model name required'),
  modelNumber: z.string().min(1, 'Model number required'),
  deviceType: z.string().default('Laptop'),
  boardNumber: z.string().optional().nullable(),
  serialNumber: z.string().min(1, 'Serial number required'),
  assetTag: z.string().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
});

// Physical Condition Schema
export const physicalConditionSchema = z.object({
  screen: z.string().optional().nullable(),
  chassis: z.string().optional().nullable(),
  keyboard: z.string().optional().nullable(),
  ports: z.string().optional().nullable(),
  liquidExposure: z.boolean().default(false),
  missingParts: z.string().optional().nullable(),
  accessoriesReceived: z.array(z.string()).default([]),
  photoUrls: z.array(z.string().url()).default([]),
});

// Repair Job Schemas
export const createRepairJobSchema = z.object({
  deviceId: z.string().uuid('Invalid device ID'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  intakeCondition: physicalConditionSchema,
  initialSymptomIds: z.array(z.string().uuid()).min(1, 'At least one symptom required'),
});

export const updateRepairStatusSchema = z.object({
  status: z.nativeEnum(RepairStatus),
  notes: z.string().optional(),
});

// Diagnostic Observation Schema
export const recordObservationSchema = z.object({
  repairJobId: z.string().uuid(),
  powersOn: z.boolean().optional().nullable(),
  standbyCurrentAmps: z.number().nonnegative().optional().nullable(),
  activeCurrentAmps: z.number().nonnegative().optional().nullable(),
  vbusVoltageVolts: z.number().nonnegative().optional().nullable(),
  vbusCurrentAmps: z.number().nonnegative().optional().nullable(),
  thermalDeltaCelsius: z.number().optional().nullable(),
  shortedPowerRails: z.array(z.string()).default([]),
  diodeModeReadings: z.record(z.string(), z.number()).default({}),
  notes: z.string().optional().nullable(),
});

// Suspected Component Schema
export const addSuspectedComponentSchema = z.object({
  repairJobId: z.string().uuid(),
  componentId: z.string().uuid(),
  circuitDesignator: z.string().min(1, 'Circuit designator required (e.g., U7000, C301)'),
  confidenceNote: z.string().optional().nullable(),
});

// Confirmed Component Schema
export const confirmComponentFailureSchema = z.object({
  repairJobId: z.string().uuid(),
  componentId: z.string().uuid(),
  circuitDesignator: z.string().min(1, 'Circuit designator required'),
  failureMode: z.string().min(1, 'Failure mode required (e.g., Internal Short, Cracked Solder Ball, Blown)'),
  isRootCause: z.boolean().default(true),
});

// Repair Action Schema
export const recordRepairActionSchema = z.object({
  repairJobId: z.string().uuid(),
  componentId: z.string().uuid().optional().nullable(),
  circuitDesignator: z.string().optional().nullable(),
  actionType: z.nativeEnum(RepairActionType),
  replacementPartNumber: z.string().optional().nullable(),
  donorBoardNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Repair Test Schema
export const recordRepairTestSchema = z.object({
  repairJobId: z.string().uuid(),
  testType: z.string().min(1, 'Test type required (e.g., Full Thermal Load, USB-C 20V Negotiation)'),
  outcome: z.nativeEnum(TestOutcome),
  measurements: z.record(z.string(), z.unknown()).default({}),
});

// Component Catalog Schema
export const createComponentSchema = z.object({
  category: z.nativeEnum(ComponentCategory),
  manufacturer: z.string().optional().nullable(),
  partNumber: z.string().min(1, 'Part number required'),
  designatorPrefix: z.string().min(1, 'Designator prefix required (e.g., U, C, R, L, Q)'),
  description: z.string().optional().nullable(),
  packageType: z.string().optional().nullable(),
});

// Query Schemas
export const intelligenceQuerySchema = z.object({
  deviceModelId: z.string().uuid(),
  symptomIds: z.array(z.string().uuid()).default([]),
});

// Diagnostic Note Parser Schema
export const parseDiagnosticNotesSchema = z.object({
  rawNotes: z.string().min(3, 'Diagnostic text must contain at least 3 characters'),
  modelContext: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
export type CreateRepairJobInput = z.infer<typeof createRepairJobSchema>;
export type RecordObservationInput = z.infer<typeof recordObservationSchema>;
export type AddSuspectedComponentInput = z.infer<typeof addSuspectedComponentSchema>;
export type ConfirmComponentFailureInput = z.infer<typeof confirmComponentFailureSchema>;
export type RecordRepairActionInput = z.infer<typeof recordRepairActionSchema>;
export type RecordRepairTestInput = z.infer<typeof recordRepairTestSchema>;
export type CreateComponentInput = z.infer<typeof createComponentSchema>;
export type CreateSymptomInput = z.infer<typeof createSymptomSchema>;
export type ParseDiagnosticNotesInput = z.infer<typeof parseDiagnosticNotesSchema>;
