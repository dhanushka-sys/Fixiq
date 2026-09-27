import { RepairStatus, ValidationError } from '@fixiq/shared';

export const allowedTransitions: Record<RepairStatus, RepairStatus[]> = {
  [RepairStatus.RECEIVED]: [RepairStatus.INSPECTION, RepairStatus.CANCELLED],
  [RepairStatus.INSPECTION]: [
    RepairStatus.DIAGNOSIS,
    RepairStatus.CANCELLED,
    RepairStatus.UNREPAIRABLE,
  ],
  [RepairStatus.DIAGNOSIS]: [
    RepairStatus.AWAITING_APPROVAL,
    RepairStatus.REPAIRING,
    RepairStatus.CANCELLED,
    RepairStatus.UNREPAIRABLE,
  ],
  [RepairStatus.AWAITING_APPROVAL]: [
    RepairStatus.REPAIRING,
    RepairStatus.CANCELLED,
    RepairStatus.RETURNED,
  ],
  [RepairStatus.REPAIRING]: [RepairStatus.TESTING, RepairStatus.UNREPAIRABLE],
  [RepairStatus.TESTING]: [
    RepairStatus.COMPLETED,
    RepairStatus.REPAIRING, // Rework cycle if verification test failed
    RepairStatus.UNREPAIRABLE,
  ],
  [RepairStatus.COMPLETED]: [RepairStatus.RETURNED],
  [RepairStatus.CANCELLED]: [RepairStatus.RETURNED],
  [RepairStatus.UNREPAIRABLE]: [RepairStatus.RETURNED],
  [RepairStatus.RETURNED]: [], // Terminal state
};

export function canTransitionRepairStatus(
  currentStatus: RepairStatus,
  targetStatus: RepairStatus
): boolean {
  const allowed = allowedTransitions[currentStatus] || [];
  return allowed.includes(targetStatus);
}

export function validateRepairStatusTransition(
  currentStatus: RepairStatus,
  targetStatus: RepairStatus
): void {
  if (currentStatus === targetStatus) {
    return;
  }

  if (!canTransitionRepairStatus(currentStatus, targetStatus)) {
    throw new ValidationError(
      `Invalid repair status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${(
        allowedTransitions[currentStatus] || []
      ).join(', ')}]`
    );
  }
}
