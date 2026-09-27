import {
  PrismaClient,
  UserRole,
  SymptomCategory,
  ComponentCategory,
  EvidenceConfidence,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Fixiq Database Seed...');

  // 1. Create Demo Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-diagnostics' },
    update: {},
    create: {
      name: 'Apex Board Diagnostics Lab',
      slug: 'apex-diagnostics',
    },
  });
  console.log(`✓ Organization created: ${org.name}`);

  // 2. Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'elena@apexfix.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'elena@apexfix.com',
      name: 'Elena Rostova',
      role: UserRole.OWNER,
      passwordHash,
    },
  });

  const leadTech = await prisma.user.upsert({
    where: { email: 'marcus@apexfix.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'marcus@apexfix.com',
      name: 'Marcus Vance',
      role: UserRole.MANAGER,
      passwordHash,
    },
  });

  const juniorTech = await prisma.user.upsert({
    where: { email: 'alex@apexfix.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'alex@apexfix.com',
      name: 'Alex Rivera',
      role: UserRole.TECHNICIAN,
      passwordHash,
    },
  });

  console.log(`✓ Seeded users: ${owner.email}, ${leadTech.email}, ${juniorTech.email}`);

  // 3. Create Hardware Models
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
      deviceType: 'Laptop',
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
      deviceType: 'Laptop',
      boardNumber: 'NM-D341',
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
      deviceType: 'Laptop',
      boardNumber: '820-01700',
    },
  });

  console.log('✓ Seeded hardware models: Dell 5420, ThinkPad T14, MacBook Pro A2141');

  // 4. Create Standard Components
  const tps65988 = await prisma.component.upsert({
    where: { partNumber: 'TPS65988' },
    update: {},
    create: {
      category: ComponentCategory.USB_PD_CONTROLLER,
      manufacturer: 'Texas Instruments',
      partNumber: 'TPS65988',
      designatorPrefix: 'UT',
      description: 'Dual-Port USB Type-C and USB PD Controller',
      packageType: 'QFN-56',
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
      packageType: 'VQFN-28',
    },
  });

  const cd3217 = await prisma.component.upsert({
    where: { partNumber: 'CD3217B12' },
    update: {},
    create: {
      category: ComponentCategory.USB_PD_CONTROLLER,
      manufacturer: 'Texas Instruments',
      partNumber: 'CD3217B12',
      designatorPrefix: 'U',
      description: 'Custom Apple USB-C Power Delivery Controller',
      packageType: 'BGA',
    },
  });

  const emb09n03v = await prisma.component.upsert({
    where: { partNumber: 'EMB09N03V' },
    update: {},
    create: {
      category: ComponentCategory.MOSFET,
      manufacturer: 'Excelliance MOS',
      partNumber: 'EMB09N03V',
      designatorPrefix: 'PQ',
      description: '30V Single N-Channel Trench Power MOSFET (High-Side)',
      packageType: 'EDFN 3x3',
    },
  });

  console.log('✓ Seeded standard electronic components: TPS65988, BQ24780S, CD3217, EMB09N03V');

  // 5. Create Standard Symptoms
  const noPowerSymptom = await prisma.symptom.upsert({
    where: {
      category_name_organizationId: {
        category: SymptomCategory.POWER,
        name: "Won't Turn On (No Power)",
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      category: SymptomCategory.POWER,
      name: "Won't Turn On (No Power)",
      description: 'Device completely unresponsive; zero current draw or stuck in sub-standby state',
      severity: 'HIGH',
      isCustom: false,
    },
  });

  const noVbusNegotiation = await prisma.symptom.upsert({
    where: {
      category_name_organizationId: {
        category: SymptomCategory.CHARGING,
        name: '0.00A on 5V VBUS (No Negotiation)',
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      category: SymptomCategory.CHARGING,
      name: '0.00A on 5V VBUS (No Negotiation)',
      description: 'USB-C ammeter reads 5V 0.00A without switching to 20V profile',
      severity: 'HIGH',
      isCustom: false,
    },
  });

  console.log('✓ Seeded standard symptoms');

  // 6. Seed Empirical Failure Pattern Intelligence
  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: dell5420.id,
        symptomId: noVbusNegotiation.id,
        componentId: tps65988.id,
        circuitDesignator: 'UT2',
      },
    },
    update: {
      totalCases: 47,
      confirmedCases: 35,
      successfulRepairs: 33,
      confidenceScore: 0.94,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
    create: {
      organizationId: org.id,
      deviceModelId: dell5420.id,
      symptomId: noVbusNegotiation.id,
      componentId: tps65988.id,
      circuitDesignator: 'UT2',
      totalCases: 47,
      confirmedCases: 35,
      successfulRepairs: 33,
      confidenceScore: 0.94,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: dell5420.id,
        symptomId: noPowerSymptom.id,
        componentId: bq24780s.id,
        circuitDesignator: 'PU301',
      },
    },
    update: {
      totalCases: 47,
      confirmedCases: 8,
      successfulRepairs: 7,
      confidenceScore: 0.62,
      confidenceLevel: EvidenceConfidence.MODERATE,
    },
    create: {
      organizationId: org.id,
      deviceModelId: dell5420.id,
      symptomId: noPowerSymptom.id,
      componentId: bq24780s.id,
      circuitDesignator: 'PU301',
      totalCases: 47,
      confirmedCases: 8,
      successfulRepairs: 7,
      confidenceScore: 0.62,
      confidenceLevel: EvidenceConfidence.MODERATE,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: dell5420.id,
        symptomId: noPowerSymptom.id,
        componentId: emb09n03v.id,
        circuitDesignator: 'PQ302',
      },
    },
    update: {
      totalCases: 24,
      confirmedCases: 19,
      successfulRepairs: 18,
      confidenceScore: 0.88,
      confidenceLevel: EvidenceConfidence.HIGH,
    },
    create: {
      organizationId: org.id,
      deviceModelId: dell5420.id,
      symptomId: noPowerSymptom.id,
      componentId: emb09n03v.id,
      circuitDesignator: 'PQ302',
      totalCases: 24,
      confirmedCases: 19,
      successfulRepairs: 18,
      confidenceScore: 0.88,
      confidenceLevel: EvidenceConfidence.HIGH,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: thinkpadT14.id,
        symptomId: noPowerSymptom.id,
        componentId: tps65988.id,
        circuitDesignator: 'UT2',
      },
    },
    update: {
      totalCases: 42,
      confirmedCases: 31,
      successfulRepairs: 28,
      confidenceScore: 0.9,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
    create: {
      organizationId: org.id,
      deviceModelId: thinkpadT14.id,
      symptomId: noPowerSymptom.id,
      componentId: tps65988.id,
      circuitDesignator: 'UT2',
      totalCases: 42,
      confirmedCases: 31,
      successfulRepairs: 28,
      confidenceScore: 0.9,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
  });

  await prisma.failurePattern.upsert({
    where: {
      organizationId_deviceModelId_symptomId_componentId_circuitDesignator: {
        organizationId: org.id,
        deviceModelId: macbookA2141.id,
        symptomId: noVbusNegotiation.id,
        componentId: cd3217.id,
        circuitDesignator: 'UB300',
      },
    },
    update: {
      totalCases: 58,
      confirmedCases: 49,
      successfulRepairs: 45,
      confidenceScore: 0.96,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
    create: {
      organizationId: org.id,
      deviceModelId: macbookA2141.id,
      symptomId: noVbusNegotiation.id,
      componentId: cd3217.id,
      circuitDesignator: 'UB300',
      totalCases: 58,
      confirmedCases: 49,
      successfulRepairs: 45,
      confidenceScore: 0.96,
      confidenceLevel: EvidenceConfidence.VERY_HIGH,
    },
  });

  console.log('✓ Seeded empirical failure pattern intelligence records');
  console.log('🚀 Fixiq Database Seed Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
