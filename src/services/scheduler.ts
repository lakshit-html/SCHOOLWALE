import { StudyTask, Priority } from '../types';

export interface ScheduleRecommendation {
  date: string;
  tasks: StudyTask[];
  totalAllocatedMinutes: number;
  targetMinutes: number;
  capacityUtilization: number; // percentage 0 - 100+
  isOverloaded: boolean;
  overflowTasks: StudyTask[];
}

export interface SmartScheduleResult {
  dailyPlans: Record<string, ScheduleRecommendation>;
  rescheduledCount: number;
  priorityWeights: Record<string, number>;
}

const PRIORITY_SCORES: Record<Priority, number> = {
  critical: 100,
  high: 70,
  medium: 40,
  low: 15
};

/**
 * Calculates a scheduling urgency score for a task.
 * Higher score = needs to be scheduled earlier.
 */
export function calculateTaskUrgencyScore(task: StudyTask, referenceDateStr: string): number {
  if (task.completed) return 0;

  const refDate = new Date(referenceDateStr).getTime();
  const dueDate = new Date(task.dueDate).getTime();
  const daysUntilDue = Math.round((dueDate - refDate) / (1000 * 60 * 60 * 24));

  const priorityWeight = PRIORITY_SCORES[task.priority] || 40;

  // Overdue tasks get highest priority penalty
  let dueScore = 50;
  if (daysUntilDue < 0) {
    dueScore = 150 + Math.abs(daysUntilDue) * 20; // severely overdue
  } else if (daysUntilDue === 0) {
    dueScore = 100; // due today
  } else if (daysUntilDue === 1) {
    dueScore = 70; // due tomorrow
  } else if (daysUntilDue <= 3) {
    dueScore = 40;
  } else {
    dueScore = Math.max(5, 30 - daysUntilDue);
  }

  // Type multiplier: revisions and lectures take precedence
  const typeMultiplier = task.type === 'revision' ? 1.25 : task.type === 'lecture' ? 1.15 : 1.0;

  return Math.round((priorityWeight * 1.2 + dueScore) * typeMultiplier);
}

/**
 * Auto-scheduler algorithm that arranges tasks across available days based on:
 * - Available study hours per day (dailyTargetHours)
 * - Task estimated duration
 * - Priority & Due dates
 * - Avoiding burnout / overload (>100% capacity)
 */
export function autoScheduleTasks(
  tasks: StudyTask[],
  dailyTargetHours: number,
  startDateStr?: string,
  daysToPlan: number = 7
): SmartScheduleResult {
  const startStr = startDateStr || new Date().toISOString().split('T')[0];
  const targetMinutesPerDay = Math.round(dailyTargetHours * 60);

  // Generate target dates
  const dateList: string[] = [];
  const baseTime = new Date(startStr).getTime();
  for (let i = 0; i < daysToPlan; i++) {
    const d = new Date(baseTime + i * 86400000);
    dateList.push(d.toISOString().split('T')[0]);
  }

  // Separate completed and pending tasks
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Score each pending task
  const scoredTasks = pendingTasks.map(task => ({
    task: { ...task },
    score: calculateTaskUrgencyScore(task, startStr)
  }));

  // Sort tasks by score descending (most urgent first)
  scoredTasks.sort((a, b) => b.score - a.score);

  const dailyPlans: Record<string, ScheduleRecommendation> = {};
  dateList.forEach(date => {
    dailyPlans[date] = {
      date,
      tasks: [],
      totalAllocatedMinutes: 0,
      targetMinutes: targetMinutesPerDay,
      capacityUtilization: 0,
      isOverloaded: false,
      overflowTasks: []
    };
  });

  // Include already completed tasks in their scheduled date bucket for record keeping
  completedTasks.forEach(ct => {
    if (dailyPlans[ct.scheduledDate]) {
      dailyPlans[ct.scheduledDate].tasks.push(ct);
      dailyPlans[ct.scheduledDate].totalAllocatedMinutes += ct.estimatedMinutes;
    }
  });

  let rescheduledCount = 0;

  // Allocate scored tasks into date buckets considering capacity
  for (const item of scoredTasks) {
    const task = item.task;
    let allocated = false;

    // Check if task already has a scheduled date in our range with room
    const preferredDate = task.scheduledDate >= startStr ? task.scheduledDate : startStr;

    // Try allocating to preferred date first if under 90% capacity
    if (
      dailyPlans[preferredDate] &&
      dailyPlans[preferredDate].totalAllocatedMinutes + task.estimatedMinutes <= targetMinutesPerDay
    ) {
      dailyPlans[preferredDate].tasks.push(task);
      dailyPlans[preferredDate].totalAllocatedMinutes += task.estimatedMinutes;
      allocated = true;
    } else {
      // Find the earliest date with available capacity
      for (const date of dateList) {
        if (dailyPlans[date].totalAllocatedMinutes + task.estimatedMinutes <= targetMinutesPerDay) {
          if (task.scheduledDate !== date) {
            rescheduledCount++;
            task.scheduledDate = date;
          }
          dailyPlans[date].tasks.push(task);
          dailyPlans[date].totalAllocatedMinutes += task.estimatedMinutes;
          allocated = true;
          break;
        }
      }
    }

    // If still not allocated because all days are at target capacity, place in the least full day or as overflow
    if (!allocated) {
      let minDay = dateList[0];
      let minMinutes = dailyPlans[minDay].totalAllocatedMinutes;

      for (const date of dateList) {
        if (dailyPlans[date].totalAllocatedMinutes < minMinutes) {
          minMinutes = dailyPlans[date].totalAllocatedMinutes;
          minDay = date;
        }
      }

      dailyPlans[minDay].tasks.push(task);
      dailyPlans[minDay].totalAllocatedMinutes += task.estimatedMinutes;
      if (task.scheduledDate !== minDay) {
        rescheduledCount++;
        task.scheduledDate = minDay;
      }
    }
  }

  // Calculate final capacity utilization and order tasks
  for (const date of dateList) {
    const plan = dailyPlans[date];
    plan.capacityUtilization = Math.round((plan.totalAllocatedMinutes / targetMinutesPerDay) * 100);
    plan.isOverloaded = plan.capacityUtilization > 105;

    // Order tasks: completed first or sorted by priority
    plan.tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (PRIORITY_SCORES[b.priority] || 0) - (PRIORITY_SCORES[a.priority] || 0);
    });
  }

  return {
    dailyPlans,
    rescheduledCount,
    priorityWeights: PRIORITY_SCORES
  };
}
