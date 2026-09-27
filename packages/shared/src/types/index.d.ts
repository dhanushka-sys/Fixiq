import { UserRole, RepairStatus, SymptomCategory, ComponentCategory, RepairActionType, TestOutcome, EvidenceConfidence } from '../enums/index.js';
export interface TenantContext {
    organizationId: string;
    userId: string;
    role: UserRole;
}
export interface UserDto {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    organizationId: string;
    createdAt: Date;
}
export interface OrganizationDto {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
}
export interface CustomerDto {
    id: string;
    organizationId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface DeviceModelDto {
    id: string;
    manufacturer: string;
    modelName: string;
    modelNumber: string;
    deviceType: string;
    boardNumber?: string | null;
}
export interface DeviceDto {
    id: string;
    organizationId: string;
    customerId: string;
    modelId: string;
    serialNumber: string;
    assetTag?: string | null;
    purchaseDate?: Date | null;
    model?: DeviceModelDto;
    customer?: CustomerDto;
    createdAt: Date;
    updatedAt: Date;
}
export interface PhysicalConditionDto {
    screen?: string | null;
    chassis?: string | null;
    keyboard?: string | null;
    ports?: string | null;
    liquidExposure: boolean;
    missingParts?: string | null;
    accessoriesReceived?: string[];
    photoUrls?: string[];
}
export interface SymptomDto {
    id: string;
    category: SymptomCategory;
    name: string;
    description?: string | null;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    isCustom: boolean;
}
export interface DiagnosticObservationDto {
    id: string;
    repairJobId: string;
    technicianId: string;
    powersOn?: boolean | null;
    standbyCurrentAmps?: number | null;
    activeCurrentAmps?: number | null;
    vbusVoltageVolts?: number | null;
    vbusCurrentAmps?: number | null;
    thermalDeltaCelsius?: number | null;
    shortedPowerRails?: string[];
    diodeModeReadings?: Record<string, number>;
    notes?: string | null;
    createdAt: Date;
}
export interface ComponentDto {
    id: string;
    category: ComponentCategory;
    manufacturer?: string | null;
    partNumber: string;
    designatorPrefix: string;
    description?: string | null;
    packageType?: string | null;
}
export interface SuspectedComponentDto {
    id: string;
    repairJobId: string;
    componentId: string;
    circuitDesignator: string;
    confidenceNote?: string | null;
    technicianId: string;
    createdAt: Date;
    component?: ComponentDto;
}
export interface ConfirmedComponentDto {
    id: string;
    repairJobId: string;
    componentId: string;
    circuitDesignator: string;
    failureMode: string;
    isRootCause: boolean;
    technicianId: string;
    confirmedAt: Date;
    component?: ComponentDto;
}
export interface RepairActionDto {
    id: string;
    repairJobId: string;
    componentId?: string | null;
    circuitDesignator?: string | null;
    actionType: RepairActionType;
    replacementPartNumber?: string | null;
    donorBoardNumber?: string | null;
    notes?: string | null;
    technicianId: string;
    createdAt: Date;
}
export interface RepairTestDto {
    id: string;
    repairJobId: string;
    testType: string;
    outcome: TestOutcome;
    measurements?: Record<string, unknown>;
    technicianId: string;
    testedAt: Date;
}
export interface RepairJobDto {
    id: string;
    organizationId: string;
    deviceId: string;
    assignedTechnicianId?: string | null;
    status: RepairStatus;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    intakeCondition: PhysicalConditionDto;
    symptoms: SymptomDto[];
    observations?: DiagnosticObservationDto[];
    suspectedComponents?: SuspectedComponentDto[];
    confirmedComponents?: ConfirmedComponentDto[];
    actions?: RepairActionDto[];
    tests?: RepairTestDto[];
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date | null;
}
export interface ModelFailureEvidence {
    deviceModelId: string;
    deviceModelName: string;
    symptomName: string;
    confirmedPartNumber: string;
    componentCategory: ComponentCategory;
    typicalDesignator: string;
    similarCaseCount: number;
    confirmedCount: number;
    successfulRepairCount: number;
    successRate: number;
    confidence: EvidenceConfidence;
    evidenceStrength: number;
}
export interface TechnicianGuidanceRecommendation {
    queryModel: string;
    querySymptoms: string[];
    totalHistoricalRepairsForModel: number;
    topConfirmedComponents: ModelFailureEvidence[];
    recommendedCheckSequence: string[];
    repeatFailureRiskWarning?: string;
}
export interface RepeatFailureAlertDto {
    deviceId: string;
    serialNumber: string;
    repairCountWithinWindow: number;
    daysSinceLastRepair: number;
    previousRepairs: {
        repairId: string;
        completedAt: Date;
        symptoms: string[];
        confirmedComponents: string[];
    }[];
    patternDetected: string;
}
//# sourceMappingURL=index.d.ts.map