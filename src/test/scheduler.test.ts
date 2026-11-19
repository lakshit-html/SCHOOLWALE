import { describe, it, expect } from 'vitest';
import { calculateTaskUrgencyScore, autoScheduleTasks } from '../services/scheduler';
import { StudyTask } from '../types';

describe('Smart Study Planner Scheduler', () => {
  const baseDate = '2024-11-20';

  const createTask = (overrides: Partial<StudyTask>): StudyTask => ({
    id: 'test-1',
    title: 'Test Task',
    subjectId: 'sub-phy',
    type: 'practice',
    estimatedMinutes: 60,
    priority: 'high',
    dueDate: '2024-11-20',
    scheduledDate: '2024-11-20',
    completed: false,
    order: 1,
    ...overrides
  });

  it('assigns 0 urgency score to already completed tasks', () => {
    // Arrange
    const task = createTask({ completed: true });

    // Act
    const score = calculateTaskUrgencyScore(task, baseDate);

    // Assert
    expect(score).toBe(0);
  });

  it('assigns higher urgency score to overdue tasks than future tasks', () => {
    // Arrange
    const overdueTask = createTask({ dueDate: '2024-11-18', priority: 'high' });
    const futureTask = createTask({ dueDate: '2024-11-25', priority: 'high' });

    // Act
    const overdueScore = calculateTaskUrgencyScore(overdueTask, baseDate);
    const futureScore = calculateTaskUrgencyScore(futureTask, baseDate);

    // Assert
    expect(overdueScore).toBeGreaterThan(futureScore);
  });

  it('gives critical priority higher urgency score than medium priority for same due date', () => {
    // Arrange
    const criticalTask = createTask({ dueDate: baseDate, priority: 'critical' });
    const mediumTask = createTask({ dueDate: baseDate, priority: 'medium' });

    // Act
    const criticalScore = calculateTaskUrgencyScore(criticalTask, baseDate);
    const mediumScore = calculateTaskUrgencyScore(mediumTask, baseDate);

    // Assert
    expect(criticalScore).toBeGreaterThan(mediumScore);
  });

  it('auto-schedules tasks across days without exceeding capacity', () => {
    // Arrange: 4 tasks of 90 minutes each = 360 mins. Target hours = 3 hrs (180 mins/day)
    const tasks: StudyTask[] = [
      createTask({ id: 't1', title: 'Task 1', estimatedMinutes: 90, priority: 'critical' }),
      createTask({ id: 't2', title: 'Task 2', estimatedMinutes: 90, priority: 'high' }),
      createTask({ id: 't3', title: 'Task 3', estimatedMinutes: 90, priority: 'medium' }),
      createTask({ id: 't4', title: 'Task 4', estimatedMinutes: 90, priority: 'low' })
    ];

    // Act
    const schedule = autoScheduleTasks(tasks, 3, baseDate, 3);

    // Assert
    const day1Plan = schedule.dailyPlans[baseDate];
    expect(day1Plan).toBeDefined();
    expect(day1Plan.totalAllocatedMinutes).toBeLessThanOrEqual(180);
    expect(day1Plan.tasks.length).toBe(2); // 2 * 90 = 180 min

    // Total distributed minutes must equal total task minutes
    const totalDistributed = Object.values(schedule.dailyPlans).reduce(
      (acc, d) => acc + d.totalAllocatedMinutes,
      0
    );
    expect(totalDistributed).toBe(360);
  });

  it('identifies day overload when allocated minutes exceed daily capacity', () => {
    // Arrange: Single task of 300 minutes on a 3-hour (180 mins) target day
    const tasks: StudyTask[] = [
      createTask({ id: 't-heavy', title: 'Heavy Mock Session', estimatedMinutes: 300 })
    ];

    // Act
    const schedule = autoScheduleTasks(tasks, 3, baseDate, 1);

    // Assert
    const plan = schedule.dailyPlans[baseDate];
    expect(plan.isOverloaded).toBe(true);
    expect(plan.capacityUtilization).toBeGreaterThan(100);
  });
});
