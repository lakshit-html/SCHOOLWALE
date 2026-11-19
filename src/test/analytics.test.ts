import { describe, it, expect } from 'vitest';
import {
  calculateDashboardMetrics,
  calculateBacklogForecast,
  calculateRevisionMetrics,
  calculateTestAnalytics
} from '../services/analytics';
import { getInitialData, getDemoShowcaseData } from '../services/storage';
import { BacklogItem, MockTest, RevisionItem } from '../types';

describe('StudyForge Analytics Engine', () => {
  it('computes accurate dashboard KPI metrics from real stored state', () => {
    // Arrange: test with demo data
    const demoData = getDemoShowcaseData();

    // Act
    const metrics = calculateDashboardMetrics(demoData);

    // Assert
    expect(metrics.todayTargetHours).toBe(7);
    expect(metrics.currentStreak).toBe(5);
    expect(metrics.overallChapterCompletionPct).toBeGreaterThan(0);
    expect(metrics.upcomingRevisionsCount).toBeGreaterThan(0);
  });

  it('computes clean zeros on fresh startup state', () => {
    // Arrange: fresh initial state
    const freshData = getInitialData();

    // Act
    const metrics = calculateDashboardMetrics(freshData);

    // Assert
    expect(metrics.todayCompletedHours).toBe(0);
    expect(metrics.currentStreak).toBe(0);
    expect(metrics.totalBacklogHours).toBe(0);
    expect(metrics.pendingTasksTodayCount).toBe(0);
  });

  it('computes accurate backlog forecast and estimated zero-debt date', () => {
    // Arrange: 2 pending backlogs of 60 mins and 90 mins = 2.5 hours total
    const backlog: BacklogItem[] = [
      {
        id: 'b1',
        subjectId: 'sub-phy',
        chapterTitle: 'Optics',
        lectureTitle: 'Lec 1',
        durationMinutes: 60,
        priority: 'high',
        notesStatus: 'in_progress',
        assignmentStatus: 'pending',
        completed: false,
        addedDate: '2024-11-10'
      },
      {
        id: 'b2',
        subjectId: 'sub-phy',
        chapterTitle: 'Optics',
        lectureTitle: 'Lec 2',
        durationMinutes: 90,
        priority: 'critical',
        notesStatus: 'not_started',
        assignmentStatus: 'pending',
        completed: false,
        addedDate: '2024-11-11'
      },
      {
        id: 'b3',
        subjectId: 'sub-phy',
        chapterTitle: 'Optics',
        lectureTitle: 'Lec 3',
        durationMinutes: 60,
        priority: 'medium',
        notesStatus: 'done',
        assignmentStatus: 'submitted',
        completed: true,
        addedDate: '2024-11-09'
      }
    ];

    // Act: clearance pace = 1.25 hours/day
    const forecast = calculateBacklogForecast(backlog, 1.25);

    // Assert
    expect(forecast.totalPendingCount).toBe(2);
    expect(forecast.totalPendingHours).toBe(2.5);
    expect(forecast.clearedHours).toBe(1.0);
    expect(forecast.criticalCount).toBe(1);
    expect(forecast.estimatedCompletionDays).toBe(2);
  });

  it('computes revision compliance rate correctly', () => {
    // Arrange
    const revisions: RevisionItem[] = [
      {
        id: 'r1',
        subjectId: 'sub-1',
        chapterId: 'ch-1',
        chapterTitle: 'Ch 1',
        cycle: 1,
        intervalDays: 1,
        scheduledDate: '2024-11-19',
        status: 'completed',
        history: []
      },
      {
        id: 'r2',
        subjectId: 'sub-1',
        chapterId: 'ch-2',
        chapterTitle: 'Ch 2',
        cycle: 1,
        intervalDays: 1,
        scheduledDate: '2024-11-10',
        status: 'overdue',
        history: []
      }
    ];

    // Act
    const metrics = calculateRevisionMetrics(revisions);

    // Assert
    expect(metrics.totalCount).toBe(2);
    expect(metrics.completedCount).toBe(1);
    expect(metrics.overdueCount).toBe(1);
    expect(metrics.complianceRate).toBe(50);
  });

  it('computes test performance trajectory and averages accurately', () => {
    // Arrange
    const tests: MockTest[] = [
      {
        id: 'm1',
        title: 'Mock 1',
        testDate: '2024-11-01',
        totalMarks: 300,
        obtainedMarks: 180,
        percentage: 60,
        subjectScores: [],
        mistakesAnalysis: '',
        weakAreas: [],
        actionPlan: ''
      },
      {
        id: 'm2',
        title: 'Mock 2',
        testDate: '2024-11-15',
        totalMarks: 300,
        obtainedMarks: 240,
        percentage: 80,
        subjectScores: [],
        mistakesAnalysis: '',
        weakAreas: [],
        actionPlan: ''
      }
    ];

    // Act
    const result = calculateTestAnalytics(tests);

    // Assert
    expect(result.totalTestsTaken).toBe(2);
    expect(result.averageScorePct).toBe(70);
    expect(result.highestScorePct).toBe(80);
    expect(result.trend).toBe('improving');
  });
});
