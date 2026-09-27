import { describe, it, expect } from 'vitest';
import {
  canTransitionRepairStatus,
  validateRepairStatusTransition,
} from '../src/modules/repairs/repair-lifecycle.js';
import { RepairStatus, ValidationError } from '@fixiq/shared';

describe('Repair Lifecycle State Machine', () => {
  it('should allow valid sequential lifecycle transitions', () => {
    expect(canTransitionRepairStatus(RepairStatus.RECEIVED, RepairStatus.INSPECTION)).toBe(true);
    expect(canTransitionRepairStatus(RepairStatus.INSPECTION, RepairStatus.DIAGNOSIS)).toBe(true);
    expect(canTransitionRepairStatus(RepairStatus.DIAGNOSIS, RepairStatus.REPAIRING)).toBe(true);
    expect(canTransitionRepairStatus(RepairStatus.REPAIRING, RepairStatus.TESTING)).toBe(true);
    expect(canTransitionRepairStatus(RepairStatus.TESTING, RepairStatus.COMPLETED)).toBe(true);
    expect(canTransitionRepairStatus(RepairStatus.COMPLETED, RepairStatus.RETURNED)).toBe(true);
  });

  it('should allow rework transition from TESTING back to REPAIRING', () => {
    // If a post-repair verification test fails, it should return to REPAIRING
    expect(canTransitionRepairStatus(RepairStatus.TESTING, RepairStatus.REPAIRING)).toBe(true);
  });

  it('should disallow invalid non-sequential transitions and throw ValidationError', () => {
    expect(canTransitionRepairStatus(RepairStatus.RECEIVED, RepairStatus.COMPLETED)).toBe(false);

    expect(() => {
      validateRepairStatusTransition(RepairStatus.RECEIVED, RepairStatus.COMPLETED);
    }).toThrow(ValidationError);
  });

  it('should treat RETURNED as a terminal state with no subsequent transitions', () => {
    expect(canTransitionRepairStatus(RepairStatus.RETURNED, RepairStatus.RECEIVED)).toBe(false);
    expect(canTransitionRepairStatus(RepairStatus.RETURNED, RepairStatus.REPAIRING)).toBe(false);
  });
});
