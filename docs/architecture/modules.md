# Domain Modules Specification

Each domain module in Fixiq follows a strict **Controller-Service-Repository** pattern with explicit boundaries. Direct access to a module's internal tables by another module is prohibited; communication occurs through typed domain service contracts.

---

## 1. Identity Module (`modules/identity`)
* **Responsibility:** User authentication, password hashing (bcrypt), JWT issuance and verification, session management.
* **Entities:** `User`, `RefreshToken`, `AuditLog`.
* **Roles:** `OWNER`, `MANAGER`, `TECHNICIAN`, `VIEWER`.
* **Public Interface:**
  * `authenticate(credentials): Promise<{ user, token }>`
  * `validateToken(token): Promise<TokenPayload>`
  * `getUserById(userId, organizationId): Promise<User>`

---

## 2. Organizations Module (`modules/organizations`)
* **Responsibility:** Multi-tenant workspace management, tenant settings, membership, subscription state.
* **Entities:** `Organization`, `OrganizationMember`.
* **Public Interface:**
  * `getOrganization(organizationId): Promise<Organization>`
  * `updateSettings(organizationId, settings): Promise<Organization>`
  * `listMembers(organizationId): Promise<OrganizationMember[]>`

---

## 3. Customers Module (`modules/customers`)
* **Responsibility:** Customer profiles, contact details, communication preferences, device ownership history.
* **Entities:** `Customer`.
* **Public Interface:**
  * `createCustomer(data, organizationId): Promise<Customer>`
  * `findCustomerById(customerId, organizationId): Promise<Customer>`
  * `getCustomerDeviceHistory(customerId, organizationId): Promise<Device[]>`

---

## 4. Devices Module (`modules/devices`)
* **Responsibility:** Hardware registry, device catalog (Make, Model, Form Factor, Architecture), serial number tracking, asset identifiers.
* **Entities:** `Device`, `DeviceModel`, `DeviceManufacturer`.
* **Public Interface:**
  * `registerDevice(deviceData, organizationId): Promise<Device>`
  * `findDeviceBySerial(serialNumber, organizationId): Promise<Device>`
  * `getDeviceModel(modelId): Promise<DeviceModel>`

---

## 5. Repairs Module (`modules/repairs`)
* **Responsibility:** Repair job lifecycle management, ticket status transitions, technician assignment, priority, intake condition checklists.
* **Entities:** `RepairJob`, `PhysicalCondition`, `RepairStatusHistory`.
* **Lifecycle State Machine:**
  $$\text{RECEIVED} \rightarrow \text{INSPECTION} \rightarrow \text{DIAGNOSIS} \rightarrow \text{AWAITING\_APPROVAL} \rightarrow \text{REPAIRING} \rightarrow \text{TESTING} \rightarrow \text{COMPLETED}$$
  *(Terminal alternative states: `CANCELLED`, `UNREPAIRABLE`, `RETURNED`)*
* **Public Interface:**
  * `createRepairJob(data, organizationId): Promise<RepairJob>`
  * `transitionStatus(repairId, newStatus, technicianId, organizationId): Promise<RepairJob>`
  * `getRepairDetails(repairId, organizationId): Promise<FullRepairAggregate>`

---

## 6. Diagnostics Module (`modules/diagnostics`)
* **Responsibility:** Capturing symptoms, electrical/physical observations, and managing the segregation of suspected vs confirmed components.
* **Entities:** `Symptom`, `DiagnosticObservation`, `SuspectedComponent`, `ConfirmedComponent`.
* **Key Invariant:** Guarantees that unverified diagnostic guesses do not mutate confirmed failure models.
* **Public Interface:**
  * `logSymptom(repairId, symptomData, organizationId): Promise<Symptom>`
  * `recordObservation(repairId, observationData, organizationId): Promise<DiagnosticObservation>`
  * `setSuspectedComponent(repairId, componentData, organizationId): Promise<SuspectedComponent>`
  * `confirmComponentFailure(repairId, confirmedData, organizationId): Promise<ConfirmedComponent>`

---

## 7. Components Module (`modules/components`)
* **Responsibility:** Electronic component catalog, chip categories (PMIC, MOSFET, Buck Controller, Diode, Capacitor, Connector), part numbers, package footprints, donor board cross-references.
* **Entities:** `Component`, `ComponentCategory`, `DonorBoard`.
* **Public Interface:**
  * `searchComponents(query, category): Promise<Component[]>`
  * `getComponentById(componentId): Promise<Component>`
  * `findAlternativeParts(componentId): Promise<Component[]>`

---

## 8. Intelligence Module (`modules/intelligence`)
* **Responsibility:** Deterministic failure pattern aggregation, association rule mining, evidence confidence calculation, repeat failure (comeback) detection.
* **Entities:** `FailurePattern`, `ComponentRelationship`, `RepeatFailureAlert`.
* **Key Invariant:** Calculations are deterministic and mathematically auditable. No black-box generative AI guessing.
* **Public Interface:**
  * `getModelFailurePatterns(deviceModelId, organizationId): Promise<ModelFailureReport>`
  * `getSymptomComponentAssociations(symptomId, deviceModelId, organizationId): Promise<AssociationResult[]>`
  * `detectRepeatFailures(deviceId, organizationId): Promise<RepeatFailureAlert | null>`
  * `getTechnicianGuidance(deviceModelId, symptomIds, organizationId): Promise<TechnicianEvidenceRecommendation>`

---

## 9. Analytics Module (`modules/analytics`)
* **Responsibility:** High-level operational reporting, first-time fix rates, diagnostic turnaround time, supplier component defect rates.
* **Public Interface:**
  * `getShopDiagnosticMetrics(organizationId, dateRange): Promise<DiagnosticMetrics>`
  * `getComponentFailureDistribution(organizationId, filters): Promise<FailureDistribution>`
  * `getTechnicianQualitySummary(organizationId, dateRange): Promise<QualityReport>`
