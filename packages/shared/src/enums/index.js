"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceConfidence = exports.TestOutcome = exports.RepairActionType = exports.ComponentCategory = exports.SymptomCategory = exports.RepairStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["TECHNICIAN"] = "TECHNICIAN";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var RepairStatus;
(function (RepairStatus) {
    RepairStatus["RECEIVED"] = "RECEIVED";
    RepairStatus["INSPECTION"] = "INSPECTION";
    RepairStatus["DIAGNOSIS"] = "DIAGNOSIS";
    RepairStatus["AWAITING_APPROVAL"] = "AWAITING_APPROVAL";
    RepairStatus["REPAIRING"] = "REPAIRING";
    RepairStatus["TESTING"] = "TESTING";
    RepairStatus["COMPLETED"] = "COMPLETED";
    RepairStatus["CANCELLED"] = "CANCELLED";
    RepairStatus["UNREPAIRABLE"] = "UNREPAIRABLE";
    RepairStatus["RETURNED"] = "RETURNED";
})(RepairStatus || (exports.RepairStatus = RepairStatus = {}));
var SymptomCategory;
(function (SymptomCategory) {
    SymptomCategory["POWER"] = "POWER";
    SymptomCategory["DISPLAY"] = "DISPLAY";
    SymptomCategory["CHARGING"] = "CHARGING";
    SymptomCategory["AUDIO"] = "AUDIO";
    SymptomCategory["CONNECTIVITY"] = "CONNECTIVITY";
    SymptomCategory["THERMAL"] = "THERMAL";
    SymptomCategory["PERFORMANCE"] = "PERFORMANCE";
    SymptomCategory["PHYSICAL_DAMAGE"] = "PHYSICAL_DAMAGE";
    SymptomCategory["SENSORS"] = "SENSORS";
    SymptomCategory["OTHER"] = "OTHER";
})(SymptomCategory || (exports.SymptomCategory = SymptomCategory = {}));
var ComponentCategory;
(function (ComponentCategory) {
    ComponentCategory["PMIC"] = "PMIC";
    ComponentCategory["MOSFET"] = "MOSFET";
    ComponentCategory["BUCK_CONTROLLER"] = "BUCK_CONTROLLER";
    ComponentCategory["LDO"] = "LDO";
    ComponentCategory["CAPACITOR"] = "CAPACITOR";
    ComponentCategory["RESISTOR"] = "RESISTOR";
    ComponentCategory["DIODE"] = "DIODE";
    ComponentCategory["INDUCTOR"] = "INDUCTOR";
    ComponentCategory["USB_PD_CONTROLLER"] = "USB_PD_CONTROLLER";
    ComponentCategory["CHARGING_IC"] = "CHARGING_IC";
    ComponentCategory["AUDIO_CODEC"] = "AUDIO_CODEC";
    ComponentCategory["EMBEDDED_CONTROLLER"] = "EMBEDDED_CONTROLLER";
    ComponentCategory["CONNECTOR"] = "CONNECTOR";
    ComponentCategory["CRYSTAL_OSCILLATOR"] = "CRYSTAL_OSCILLATOR";
    ComponentCategory["LOGIC_GATE"] = "LOGIC_GATE";
    ComponentCategory["DISPLAY_PANEL"] = "DISPLAY_PANEL";
    ComponentCategory["BATTERY"] = "BATTERY";
    ComponentCategory["KEYBOARD"] = "KEYBOARD";
    ComponentCategory["OTHER"] = "OTHER";
})(ComponentCategory || (exports.ComponentCategory = ComponentCategory = {}));
var RepairActionType;
(function (RepairActionType) {
    RepairActionType["REPLACED"] = "REPLACED";
    RepairActionType["REPAIRED"] = "REPAIRED";
    RepairActionType["REFLOWED"] = "REFLOWED";
    RepairActionType["REBALLED"] = "REBALLED";
    RepairActionType["CLEANED"] = "CLEANED";
    RepairActionType["RESEATED"] = "RESEATED";
    RepairActionType["REPROGRAMMED"] = "REPROGRAMMED";
    RepairActionType["UPDATED"] = "UPDATED";
    RepairActionType["ADJUSTED"] = "ADJUSTED";
    RepairActionType["NO_ACTION"] = "NO_ACTION";
})(RepairActionType || (exports.RepairActionType = RepairActionType = {}));
var TestOutcome;
(function (TestOutcome) {
    TestOutcome["SUCCESSFUL"] = "SUCCESSFUL";
    TestOutcome["PARTIAL"] = "PARTIAL";
    TestOutcome["FAILED"] = "FAILED";
    TestOutcome["UNREPAIRABLE"] = "UNREPAIRABLE";
    TestOutcome["UNKNOWN"] = "UNKNOWN";
})(TestOutcome || (exports.TestOutcome = TestOutcome = {}));
var EvidenceConfidence;
(function (EvidenceConfidence) {
    EvidenceConfidence["VERY_LOW"] = "VERY_LOW";
    EvidenceConfidence["LOW"] = "LOW";
    EvidenceConfidence["MODERATE"] = "MODERATE";
    EvidenceConfidence["HIGH"] = "HIGH";
    EvidenceConfidence["VERY_HIGH"] = "VERY_HIGH";
})(EvidenceConfidence || (exports.EvidenceConfidence = EvidenceConfidence = {}));
//# sourceMappingURL=index.js.map