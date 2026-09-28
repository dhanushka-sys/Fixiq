import {
  PrismaClient,
  UserRole,
  RepairStatus,
  SymptomCategory,
  ComponentCategory,
  RepairActionType,
  TestOutcome,
  EvidenceConfidence,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Comprehensive Fixiq Database Seed...');

  // 1. Organization (Tenant Isolation)
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-micro-lab' },
    update: {},
    create: {
      name: 'Apex Micro Lab',
      slug: 'apex-micro-lab',
    },
  });
  console.log(`✓ Organization created: ${org.name} (${org.id})`);

  // Ensure idempotent re-seeding for this organization
  await prisma.failurePattern.deleteMany({ where: { organizationId: org.id } });
  await prisma.repairTest.deleteMany({ where: { organizationId: org.id } });
  await prisma.repairAction.deleteMany({ where: { organizationId: org.id } });
  await prisma.confirmedComponent.deleteMany({ where: { organizationId: org.id } });
  await prisma.diagnosticObservation.deleteMany({ where: { organizationId: org.id } });
  await prisma.repairJobSymptom.deleteMany({ where: { repairJob: { organizationId: org.id } } });
  await prisma.repairJob.deleteMany({ where: { organizationId: org.id } });
  await prisma.symptom.deleteMany({ where: { organizationId: org.id } });
  await prisma.device.deleteMany({ where: { organizationId: org.id } });

  // 2. Users (RBAC)
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'dhanushka@fixiq.io' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'dhanushka@fixiq.io',
      name: 'Dhanushka M.',
      role: UserRole.OWNER,
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'marcus@fixiq.io' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'marcus@fixiq.io',
      name: 'Marcus Vance',
      role: UserRole.MANAGER,
      passwordHash,
    },
  });

  const techKamal = await prisma.user.upsert({
    where: { email: 'kamal@fixiq.io' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'kamal@fixiq.io',
      name: 'Kamal P.',
      role: UserRole.TECHNICIAN,
      passwordHash,
    },
  });

  const techNimal = await prisma.user.upsert({
    where: { email: 'nimal@fixiq.io' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'nimal@fixiq.io',
      name: 'Nimal S.',
      role: UserRole.TECHNICIAN,
      passwordHash,
    },
  });
  console.log('✓ Seeded 4 Users with RBAC');

  // 3. Customers
  const customerVertex = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: 'Vertex Corp (Enterprise IT)',
      email: 'dmiller@vertexcorp.com',
      phone: '+1 (555) 392-1049',
      address: '100 Silicon Way, Suite 400',
      notes: 'Enterprise SLA: 24h turnaround requested on Latitude laptops.',
    },
  });

  const customerApex = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: 'Apex Logistics LLC',
      email: 'elena@apexlogistics.io',
      phone: '+1 (555) 782-9921',
      address: '742 Logistics Blvd',
      notes: 'Fleet contract: ThinkPad T14 AMD & Intel fleet.',
    },
  });

  const customerSilva = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: 'Dr. Silva Medical Clinic',
      email: 'marcus@silvaclinic.org',
      phone: '+1 (555) 881-2041',
      address: '40 Medical Arts Pavilion',
      notes: 'Hospital ultrasound workstation laptops & MacBooks.',
    },
  });

  const customerTechCare = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: 'TechCare Warranty Services',
      email: 'claims@techcare.net',
      phone: '+1 (555) 431-8902',
      address: '880 Insurance Plaza',
      notes: 'Third-party warranty provider for HP and Apple devices.',
    },
  });
  console.log('✓ Seeded 4 Customer Profiles');

  // 4. Hardware Models & Board Schematics
  const dell5420 = await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'Dell',
        modelNumber: 'Latitude 5420',
      },
    },
    update: {},
    create: {
      manufacturer: 'Dell',
      modelName: 'Latitude 5420',
      modelNumber: 'Latitude 5420',
      deviceType: '14" Laptop',
      boardNumber: 'LA-K491P',
    },
  });

  const thinkpadT14 = await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'Lenovo',
        modelNumber: 'ThinkPad T14 Gen 2',
      },
    },
    update: {},
    create: {
      manufacturer: 'Lenovo',
      modelName: 'ThinkPad T14 Gen 2',
      modelNumber: 'ThinkPad T14 Gen 2',
      deviceType: '14" Laptop',
      boardNumber: 'NM-D351',
    },
  });

  const macbookA2141 = await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'Apple',
        modelNumber: 'A2141',
      },
    },
    update: {},
    create: {
      manufacturer: 'Apple',
      modelName: 'MacBook Pro 16" (2019)',
      modelNumber: 'A2141',
      deviceType: '16" Laptop',
      boardNumber: '820-01700-A',
    },
  });

  const hp840 = await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'HP',
        modelNumber: 'EliteBook 840 G7',
      },
    },
    update: {},
    create: {
      manufacturer: 'HP',
      modelName: 'EliteBook 840 G7',
      modelNumber: 'EliteBook 840 G7',
      deviceType: '14" Ultrabook',
      boardNumber: '6050A3136201',
    },
  });

  const macbookM1 = await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'Apple',
        modelNumber: 'A2337',
      },
    },
    update: {},
    create: {
      manufacturer: 'Apple',
      modelName: 'MacBook Air M1 (2020)',
      modelNumber: 'A2337',
      deviceType: '13.3" Laptop',
      boardNumber: '820-02016',
    },
  });

  await prisma.deviceModel.upsert({
    where: {
      manufacturer_modelNumber: {
        manufacturer: 'Lenovo',
        modelNumber: 'ThinkPad X1 Carbon Gen 9',
      },
    },
    update: {},
    create: {
      manufacturer: 'Lenovo',
      modelName: 'ThinkPad X1 Carbon Gen 9',
      modelNumber: 'ThinkPad X1 Carbon Gen 9',
      deviceType: '14" Laptop',
      boardNumber: 'NM-D141',
    },
  });
  console.log('✓ Seeded 6 Hardware Models');

  // 5. Individual Devices in Registry
  const devDell = await prisma.device.create({
    data: {
      organizationId: org.id,
      modelId: dell5420.id,
      customerId: customerVertex.id,
      serialNumber: '4F92KL3',
      assetTag: 'VTX-5420-01',
    },
  });

  const devThinkpad = await prisma.device.create({
    data: {
      organizationId: org.id,
      modelId: thinkpadT14.id,
      customerId: customerApex.id,
      serialNumber: 'PF38Z49',
      assetTag: 'APX-T14-02',
    },
  });

  const devMacbook = await prisma.device.create({
    data: {
      organizationId: org.id,
      modelId: macbookA2141.id,
      customerId: customerSilva.id,
      serialNumber: 'C02DP0XXMD6M',
      assetTag: 'SLV-MBP-01',
    },
  });

  const devHP = await prisma.device.create({
    data: {
      organizationId: org.id,
      modelId: hp840.id,
      customerId: customerTechCare.id,
      serialNumber: '5CG0391K8L',
      assetTag: 'TC-HP-840',
    },
  });

  const devAir = await prisma.device.create({
    data: {
      organizationId: org.id,
      modelId: macbookM1.id,
      customerId: customerVertex.id,
      serialNumber: 'C02G90XXQ6L4',
      assetTag: 'VTX-MBA-01',
    },
  });
  console.log('✓ Seeded 5 Active Devices');

  // 6. Solderable IC Components & Stock
  const tps65988 = await prisma.component.upsert({
    where: { partNumber: 'TPS65988' },
    update: {},
    create: {
      category: ComponentCategory.USB_PD_CONTROLLER,
      manufacturer: 'Texas Instruments',
      partNumber: 'TPS65988',
      designatorPrefix: 'UT',
      description: 'Dual-Port USB Type-C and USB PD Controller',
      packageType: 'QFN-56 (7x7mm)',
    },
  });

  const cd3217 = await prisma.component.upsert({
    where: { partNumber: 'CD3217B12' },
    update: {},
    create: {
      category: ComponentCategory.USB_PD_CONTROLLER,
      manufacturer: 'Texas Instruments / Apple',
      partNumber: 'CD3217B12',
      designatorPrefix: 'U',
      description: 'Custom Apple USB-C Power Delivery Controller',
      packageType: 'BGA-49',
    },
  });

  const bq24780s = await prisma.component.upsert({
    where: { partNumber: 'BQ24780S' },
    update: {},
    create: {
      category: ComponentCategory.CHARGING_IC,
      manufacturer: 'Texas Instruments',
      partNumber: 'BQ24780S',
      designatorPrefix: 'PU',
      description: '1-4 Cell Hybrid Power Boost Charge Controller',
      packageType: 'VQFN-28 (4x4mm)',
    },
  });

  await prisma.component.upsert({
    where: { partNumber: 'ISL95855' },
    update: {},
    create: {
      category: ComponentCategory.BUCK_CONTROLLER,
      manufacturer: 'Renesas / Intersil',
      partNumber: 'ISL95855',
      designatorPrefix: 'PU',
      description: 'Multi-Phase CPU Core Voltage Regulator Controller',
      packageType: 'QFN-48',
    },
  });

  await prisma.component.upsert({
    where: { partNumber: 'IT8227E-128' },
    update: {},
    create: {
      category: ComponentCategory.EMBEDDED_CONTROLLER,
      manufacturer: 'ITE Tech',
      partNumber: 'IT8227E-128',
      designatorPrefix: 'UE',
      description: 'Embedded Controller (EC / SuperIO) with 128KB Flash',
      packageType: 'LQFP-128',
    },
  });

  await prisma.component.upsert({
    where: { partNumber: 'ISL9538H' },
    update: {},
    create: {
      category: ComponentCategory.CHARGING_IC,
      manufacturer: 'Renesas',
      partNumber: 'ISL9538H',
      designatorPrefix: 'PU',
      description: 'Buck-Boost Narrow VDC Battery Charger',
      packageType: 'QFN-32',
    },
  });

  await prisma.component.upsert({
    where: { partNumber: 'TPS65988DJ' },
    update: {},
    create: {
      category: ComponentCategory.USB_PD_CONTROLLER,
      manufacturer: 'Texas Instruments',
      partNumber: 'TPS65988DJ',
      designatorPrefix: 'U',
      description: 'Thunderbolt 4 / USB4 Type-C Port Controller',
      packageType: 'QFN-56',
    },
  });
  console.log('✓ Seeded 7 Solderable IC Components');

  // 7. Standard Symptoms
  const symNoPower = await prisma.symptom.create({
    data: {
      organizationId: org.id,
      category: SymptomCategory.POWER,
      name: "Won't Turn On (No Power)",
      description: 'Device completely unresponsive, no LED, zero current draw',
      severity: 'HIGH',
      isCustom: false,
    },
  });

  const symZeroVbus = await prisma.symptom.create({
    data: {
      organizationId: org.id,
      category: SymptomCategory.CHARGING,
      name: '5V VBUS 0.00A Stuck (No 20V Negotiation)',
      description: 'Charger provides 5V but ammeter shows 0.00A and fails to negotiate 20V',
      severity: 'HIGH',
      isCustom: false,
    },
  });

  const symShortRail = await prisma.symptom.create({
    data: {
      organizationId: org.id,
      category: SymptomCategory.POWER,
      name: 'Short Circuit on Primary Power Rail (PPBUS/VCC)',
      description: 'Diode mode shows < 0.010V to ground on main DC-IN or PPBUS rail',
      severity: 'HIGH',
      isCustom: false,
    },
  });

  const symBatteryNoCharge = await prisma.symptom.create({
    data: {
      organizationId: org.id,
      category: SymptomCategory.CHARGING,
      name: 'Battery Not Detected / ACDRV 0V',
      description: 'System runs on charger only or reports battery missing',
      severity: 'MEDIUM',
      isCustom: false,
    },
  });
  console.log('✓ Seeded 4 Standard Symptoms');

  // 8. Repair Jobs across workflow states
  // Job 1: In DIAGNOSIS (Dell 5420)
  const job1 = await prisma.repairJob.create({
    data: {
      organizationId: org.id,
      deviceId: devDell.id,
      assignedTechnicianId: owner.id,
      status: RepairStatus.DIAGNOSIS,
      priority: 'HIGH',
      intakeCondition: { casing: 'Good', chargerSupplied: true, liquidMarks: false },
    },
  });
  await prisma.repairJobSymptom.createMany({
    data: [
      { repairJobId: job1.id, symptomId: symNoPower.id },
      { repairJobId: job1.id, symptomId: symZeroVbus.id },
      { repairJobId: job1.id, symptomId: symShortRail.id },
    ],
  });
  await prisma.diagnosticObservation.create({
    data: {
      organizationId: org.id,
      repairJobId: job1.id,
      technicianId: owner.id,
      powersOn: false,
      vbusVoltageVolts: 5.08,
      vbusCurrentAmps: 0.0,
      thermalDeltaCelsius: 48.2,
      shortedPowerRails: ['VBUS_CC1', 'PP3V3_G3H'],
      diodeModeReadings: { 'Pin14_VBUS': '0.002V', 'Pin19_CC1': '0.001V' },
      notes: 'Thermal camera detects +48.2°C hotspot directly on UT2 (TPS65988).',
    },
  });
  await prisma.suspectedComponent.create({
    data: {
      organizationId: org.id,
      repairJobId: job1.id,
      componentId: tps65988.id,
      circuitDesignator: 'UT2',
      confidenceNote: 'Internal gate puncture shorted VBUS to CC1.',
      technicianId: owner.id,
    },
  });

  // Job 2: In REPAIRING (ThinkPad T14)
  const job2 = await prisma.repairJob.create({
    data: {
      organizationId: org.id,
      deviceId: devThinkpad.id,
      assignedTechnicianId: techKamal.id,
      status: RepairStatus.REPAIRING,
      priority: 'NORMAL',
      intakeCondition: { casing: 'Scratched', chargerSupplied: false, liquidMarks: false },
    },
  });
  await prisma.repairJobSymptom.createMany({
    data: [
      { repairJobId: job2.id, symptomId: symNoPower.id },
      { repairJobId: job2.id, symptomId: symBatteryNoCharge.id },
    ],
  });
  await prisma.diagnosticObservation.create({
    data: {
      organizationId: org.id,
      repairJobId: job2.id,
      technicianId: techKamal.id,
      powersOn: false,
      vbusVoltageVolts: 19.95,
      vbusCurrentAmps: 0.024,
      thermalDeltaCelsius: 56.7,
      shortedPowerRails: ['PPBUS_G3H'],
      diodeModeReadings: { 'PU301_ACDRV': '0.000V' },
      notes: 'Stuck at 20V 0.024A. High-side MOSFET gate driver PU301 failing.',
    },
  });
  await prisma.suspectedComponent.create({
    data: {
      organizationId: org.id,
      repairJobId: job2.id,
      componentId: bq24780s.id,
      circuitDesignator: 'PU301',
      confidenceNote: 'PU301 ACDRV output transistor dead.',
      technicianId: techKamal.id,
    },
  });

  // Job 3: In TESTING (MacBook Pro 16")
  const job3 = await prisma.repairJob.create({
    data: {
      organizationId: org.id,
      deviceId: devMacbook.id,
      assignedTechnicianId: owner.id,
      status: RepairStatus.TESTING,
      priority: 'RUSH',
      intakeCondition: { casing: 'Mint', chargerSupplied: true, liquidMarks: false },
    },
  });
  await prisma.repairJobSymptom.create({
    data: { repairJobId: job3.id, symptomId: symZeroVbus.id },
  });
  // Confirmed root cause & action for Job 3
  await prisma.confirmedComponent.create({
    data: {
      organizationId: org.id,
      repairJobId: job3.id,
      componentId: cd3217.id,
      circuitDesignator: 'UB300',
      failureMode: 'PP1V5_UPC_LDO rail impedance short to Ground',
      isRootCause: true,
      technicianId: owner.id,
    },
  });
  await prisma.repairAction.create({
    data: {
      organizationId: org.id,
      repairJobId: job3.id,
      componentId: cd3217.id,
      circuitDesignator: 'UB300',
      actionType: RepairActionType.REPLACED,
      replacementPartNumber: 'CD3217B12',
      notes: 'Desoldered UB300 with hot air at 360°C. Replaced from new reel.',
      technicianId: owner.id,
    },
  });

  // Job 4: AWAITING_PARTS (HP EliteBook 840)
  const job4 = await prisma.repairJob.create({
    data: {
      organizationId: org.id,
      deviceId: devHP.id,
      assignedTechnicianId: techNimal.id,
      status: RepairStatus.AWAITING_APPROVAL,
      priority: 'NORMAL',
      intakeCondition: { casing: 'Dent on corner', chargerSupplied: true, liquidMarks: false },
    },
  });
  await prisma.repairJobSymptom.create({
    data: { repairJobId: job4.id, symptomId: symBatteryNoCharge.id },
  });

  // Job 5: COMPLETED with Closed-Loop Successful Test (MacBook Air M1)
  const job5 = await prisma.repairJob.create({
    data: {
      organizationId: org.id,
      deviceId: devAir.id,
      assignedTechnicianId: owner.id,
      status: RepairStatus.COMPLETED,
      priority: 'NORMAL',
      intakeCondition: { casing: 'Good', chargerSupplied: true, liquidMarks: true },
      completedAt: new Date(),
    },
  });
  await prisma.confirmedComponent.create({
    data: {
      organizationId: org.id,
      repairJobId: job5.id,
      componentId: tps65988.id,
      circuitDesignator: 'UF400',
      failureMode: 'Corrosion bridge between 3V3_G3H and feedback ground',
      isRootCause: true,
      technicianId: owner.id,
    },
  });
  await prisma.repairAction.create({
    data: {
      organizationId: org.id,
      repairJobId: job5.id,
      componentId: tps65988.id,
      circuitDesignator: 'UF400',
      actionType: RepairActionType.REPLACED,
      replacementPartNumber: 'TPS65988',
      notes: 'Ultrasonic cleaning and solder pad reconstruction under UF400.',
      technicianId: owner.id,
    },
  });
  // Closed-loop verification test (Invariant 5)
  await prisma.repairTest.create({
    data: {
      organizationId: org.id,
      repairJobId: job5.id,
      testType: 'FULL_LOAD_BATTERY_CYCLE',
      outcome: TestOutcome.SUCCESSFUL,
      measurements: {
        '20V_Negotiation': 'Passed (20.1V 2.85A)',
        'Battery_Charge_Rate': '42.5W',
        'Sleep_Wake_Cycle': 'Passed 10/10 iterations',
      },
      technicianId: owner.id,
    },
  });
  console.log('✓ Seeded 5 Full-Lifecycle Repair Jobs');

  // 9. Failure Patterns (Empirical Intelligence)
  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: dell5420.id,
        symptomId: symZeroVbus.id,
        componentId: tps65988.id,
        circuitDesignator: 'UT2',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      deviceModelId: dell5420.id,
      symptomId: symZeroVbus.id,
      componentId: tps65988.id,
      circuitDesignator: 'UT2',
      totalCases: 47,
      confirmedCases: 36,
      successfulRepairs: 34,
      confidenceScore: 0.765,
      confidenceLevel: EvidenceConfidence.HIGH,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: macbookA2141.id,
        symptomId: symZeroVbus.id,
        componentId: cd3217.id,
        circuitDesignator: 'UB300',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      deviceModelId: macbookA2141.id,
      symptomId: symZeroVbus.id,
      componentId: cd3217.id,
      circuitDesignator: 'UB300',
      totalCases: 51,
      confirmedCases: 45,
      successfulRepairs: 43,
      confidenceScore: 0.882,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: thinkpadT14.id,
        symptomId: symNoPower.id,
        componentId: bq24780s.id,
        circuitDesignator: 'PU301',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      deviceModelId: thinkpadT14.id,
      symptomId: symNoPower.id,
      componentId: bq24780s.id,
      circuitDesignator: 'PU301',
      totalCases: 32,
      confirmedCases: 22,
      successfulRepairs: 20,
      confidenceScore: 0.688,
      confidenceLevel: EvidenceConfidence.HIGH,
    },
  });
  console.log('✓ Seeded Empirical Failure Pattern Intelligence Records');

  console.log('🚀 Fixiq Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
