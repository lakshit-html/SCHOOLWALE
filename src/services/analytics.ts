import { AppData, FocusSession, StudyTask, BacklogItem, MockTest, RevisionItem } from '../types';

export interface SubjectAnalytics {
  subjectId: string;
  name: string;
  color: string;
  totalStudyMinutes: number;
  totalLectures: number;
  completedLectures: number;
  chapterProgressPct: number;
  pendingTasksCount: number;
  backlogHours: number;
}

export interface DayProductivity {
  date: string;
  dayName: string;
  focusMinutes: number;
  taskMinutes: number;
  totalHours: number;
  targetHours: number;
  achievementPct: number;
}

export interface BacklogForecast {
  totalPendingCount: number;
  totalPendingMinutes: number;
  totalPendingHours: number;
  clearedHours: number;
  criticalCount: number;
  estimatedCompletionDays: number;
  projectedClearanceDate: string;
  dailyClearancePaceHours: number;
}

export interface RevisionMetrics {
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  overdueCount: number;
  complianceRate: number; // percentage
}

export interface TestPerformanceSummary {
  totalTestsTaken: number;
  averageScorePct: number;
  highestScorePct: number;
  lowestScorePct: number;
  trend: 'improving' | 'declining' | 'stable';
  recentScores: { date: string; title: string; percentage: number }[];
}

export interface DashboardMetrics {
  todayTargetHours: number;
  todayCompletedHours: number;
  todayProgressPct: number;
  pendingTasksTodayCount: number;
  overallChapterCompletionPct: number;
  currentStreak: number;
  upcomingRevisionsCount: number;
  totalBacklogHours: number;
  weeklyProductivityHours: number;
}

export function calculateDashboardMetrics(data: AppData): DashboardMetrics {
  const today = new Date().toISOString().split('T')[0];
  const targetHours = data.profile.dailyTargetHours || 6;

  // 1. Today study hours from focus sessions + completed tasks
  const todaySessions = data.focusSessions.filter(
    fs => fs.completedAt.startsWith(today) && fs.type === 'pomodoro'
  );
  const sessionMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const todayTasks = data.tasks.filter(
    t => t.completed && t.completedAt && t.completedAt.startsWith(today)
  );
  // Avoid double counting if session was for a task, but give realistic hours
  const taskMinutes = todayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const totalTodayMinutes = Math.max(sessionMinutes, taskMinutes, (sessionMinutes + taskMinutes) * 0.7);
  const todayHours = Math.round((totalTodayMinutes / 60) * 10) / 10;
  const todayProgress = Math.min(100, Math.round((todayHours / targetHours) * 100));

  // 2. Pending tasks for today
  const pendingTasksToday = data.tasks.filter(
    t => !t.completed && (t.scheduledDate === today || t.dueDate === today)
  ).length;

  // 3. Chapter completion
  const totalLectures = data.chapters.reduce((acc, c) => acc + c.totalLectures, 0);
  const completedLectures = data.chapters.reduce((acc, c) => acc + c.completedLectures, 0);
  const chapterPct = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  // 4. Upcoming Revisions (pending or overdue)
  const upcomingRevisions = data.revisions.filter(r => r.status !== 'completed').length;

  // 5. Total Backlog Hours
  const pendingBacklogs = data.backlog.filter(b => !b.completed);
  const backlogMinutes = pendingBacklogs.reduce((acc, b) => acc + b.durationMinutes, 0);
  const totalBacklogHours = Math.round((backlogMinutes / 60) * 10) / 10;

  // 6. Weekly productivity hours (past 7 days)
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 86400000).toISOString().split('T')[0];
  const weeklySessions = data.focusSessions.filter(
    fs => fs.completedAt >= sevenDaysAgo && fs.type === 'pomodoro'
  );
  const weeklyMins = weeklySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const weeklyHours = Math.round((weeklyMins / 60) * 10) / 10;

  return {
    todayTargetHours: targetHours,
    todayCompletedHours: todayHours,
    todayProgressPct: todayProgress,
    pendingTasksTodayCount: pendingTasksToday,
    overallChapterCompletionPct: chapterPct,
    currentStreak: data.profile.streak,
    upcomingRevisionsCount: upcomingRevisions,
    totalBacklogHours: totalBacklogHours,
    weeklyProductivityHours: Math.max(weeklyHours, todayHours)
  };
}

export function calculateWeeklyProductivity(
  focusSessions: FocusSession[],
  tasks: StudyTask[],
  targetHours: number
): DayProductivity[] {
  const result: DayProductivity[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Last 7 days including today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];

    const daySessions = focusSessions.filter(
      s => s.completedAt.startsWith(dateStr) && s.type === 'pomodoro'
    );
    const focusMins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    const dayTasks = tasks.filter(
      t => t.completed && t.completedAt && t.completedAt.startsWith(dateStr)
    );
    const taskMins = dayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);

    const effectiveMins = Math.max(focusMins, taskMins, (focusMins + taskMins) * 0.7);
    const hours = Math.round((effectiveMins / 60) * 10) / 10;
    const achievement = targetHours > 0 ? Math.min(150, Math.round((hours / targetHours) * 100)) : 0;

    result.push({
      date: dateStr,
      dayName,
      focusMinutes: focusMins,
      taskMinutes: taskMins,
      totalHours: hours,
      targetHours,
      achievementPct: achievement
    });
  }

  return result;
}

export function calculateBacklogForecast(
  backlogItems: BacklogItem[],
  dailyClearancePaceHours: number = 1.5
): BacklogForecast {
  const pending = backlogItems.filter(b => !b.completed);
  const cleared = backlogItems.filter(b => b.completed);

  const totalPendingMinutes = pending.reduce((acc, b) => acc + b.durationMinutes, 0);
  const totalPendingHours = Math.round((totalPendingMinutes / 60) * 10) / 10;

  const clearedMinutes = cleared.reduce((acc, b) => acc + b.durationMinutes, 0);
  const clearedHours = Math.round((clearedMinutes / 60) * 10) / 10;

  const criticalCount = pending.filter(b => b.priority === 'critical').length;

  const pace = Math.max(0.5, dailyClearancePaceHours);
  const estimatedDays = totalPendingHours > 0 ? Math.ceil(totalPendingHours / pace) : 0;

  const clearanceDate = new Date(Date.now() + estimatedDays * 86400000)
    .toISOString()
    .split('T')[0];

  return {
    totalPendingCount: pending.length,
    totalPendingMinutes,
    totalPendingHours,
    clearedHours,
    criticalCount,
    estimatedCompletionDays: estimatedDays,
    projectedClearanceDate: clearanceDate,
    dailyClearancePaceHours: pace
  };
}

export function calculateRevisionMetrics(revisions: RevisionItem[]): RevisionMetrics {
  const total = revisions.length;
  if (total === 0) {
    return {
      totalCount: 0,
      completedCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      complianceRate: 100
    };
  }

  const completed = revisions.filter(r => r.status === 'completed').length;
  const overdue = revisions.filter(r => r.status === 'overdue').length;
  const pending = revisions.filter(r => r.status === 'pending').length;

  const complianceRate = Math.round((completed / (completed + overdue || 1)) * 100);

  return {
    totalCount: total,
    completedCount: completed,
    pendingCount: pending,
    overdueCount: overdue,
    complianceRate
  };
}

export function calculateTestAnalytics(mockTests: MockTest[]): TestPerformanceSummary {
  if (mockTests.length === 0) {
    return {
      totalTestsTaken: 0,
      averageScorePct: 0,
      highestScorePct: 0,
      lowestScorePct: 0,
      trend: 'stable',
      recentScores: []
    };
  }

  const sortedTests = [...mockTests].sort(
    (a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );

  const scores = sortedTests.map(t => t.percentage);
  const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (scores.length >= 2) {
    const last = scores[scores.length - 1];
    const prev = scores[scores.length - 2];
    if (last > prev + 1.5) trend = 'improving';
    else if (last < prev - 1.5) trend = 'declining';
  }

  return {
    totalTestsTaken: mockTests.length,
    averageScorePct: avg,
    highestScorePct: max,
    lowestScorePct: min,
    trend,
    recentScores: sortedTests.map(t => ({
      date: t.testDate,
      title: t.title,
      percentage: t.percentage
    }))
  };
}

export function calculateSubjectAnalytics(data: AppData): SubjectAnalytics[] {
  return data.subjects.map(subject => {
    // Subject focus hours
    const sessions = data.focusSessions.filter(
      s => s.subjectId === subject.id && s.type === 'pomodoro'
    );
    const studyMins = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // Subject chapters
    const chapters = data.chapters.filter(c => c.subjectId === subject.id);
    const totalLectures = chapters.reduce((acc, c) => acc + c.totalLectures, 0);
    const completedLectures = chapters.reduce((acc, c) => acc + c.completedLectures, 0);
    const chapterPct = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    // Pending tasks
    const pendingTasks = data.tasks.filter(t => t.subjectId === subject.id && !t.completed).length;

    // Backlog hours
    const backlogs = data.backlog.filter(b => b.subjectId === subject.id && !b.completed);
    const backlogMins = backlogs.reduce((acc, b) => acc + b.durationMinutes, 0);

    return {
      subjectId: subject.id,
      name: subject.name,
      color: subject.color,
      totalStudyMinutes: studyMins,
      totalLectures,
      completedLectures,
      chapterProgressPct: chapterPct,
      pendingTasksCount: pendingTasks,
      backlogHours: Math.round((backlogMins / 60) * 10) / 10
    };
  });
}
