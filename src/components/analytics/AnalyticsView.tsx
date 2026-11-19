import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  calculateDashboardMetrics,
  calculateWeeklyProductivity,
  calculateSubjectAnalytics,
  calculateBacklogForecast,
  calculateRevisionMetrics,
  calculateTestAnalytics
} from '../../services/analytics';

export const AnalyticsView: React.FC = () => {
  const { data } = useApp();

  const metrics = calculateDashboardMetrics(data);
  const weekly = calculateWeeklyProductivity(
    data.focusSessions,
    data.tasks,
    data.profile.dailyTargetHours
  );
  const subjectStats = calculateSubjectAnalytics(data);
  const backlogForecast = calculateBacklogForecast(data.backlog);
  const revisionStats = calculateRevisionMetrics(data.revisions);
  const testStats = calculateTestAnalytics(data.mockTests);

  const totalFocusMinutes = data.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = Math.round((totalFocusMinutes / 60) * 10) / 10;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          Academic Performance & Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Deep diagnostic insights into study time distribution, consistency, backlog velocity, and exam trajectory.
        </p>
      </div>

      {/* Top Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">All-Time Focus</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalFocusHours}</span>
            <span className="text-xs text-slate-400 font-semibold">Hours</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Across {data.focusSessions.length} logged sessions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300">{data.profile.streak}</span>
            <span className="text-xs text-slate-400 font-semibold">Days</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Continuous active consistency</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Syllabus Completion</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300">
              {metrics.overallChapterCompletionPct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {data.chapters.filter(c => c.status === 'completed').length} of {data.chapters.length} chapters finished
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Test Average</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">
              {testStats.averageScorePct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Peak: {testStats.highestScorePct}% ({testStats.trend})
          </span>
        </div>
      </div>

      {/* Middle Row: 7-Day Study Hours Graph & Backlog Clearance Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                7-Day Study Hours vs Target
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Goal: {data.profile.dailyTargetHours}h / day
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
              {weekly.map(day => {
                const maxBar = Math.max(data.profile.dailyTargetHours * 1.3, 8);
                const heightPct = Math.min(100, Math.round((day.totalHours / maxBar) * 100));

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {day.totalHours}h
                    </span>
                    <div className="w-full bg-slate-800/80 rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          day.totalHours >= day.targetHours
                            ? 'bg-gradient-to-t from-teal-600 to-emerald-400'
                            : 'bg-gradient-to-t from-slate-700 to-cyan-500'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Weekly Total: {metrics.weeklyProductivityHours} hours</span>
            <span className="text-emerald-400 font-semibold">
              Daily Average: {Math.round((metrics.weeklyProductivityHours / 7) * 10) / 10}h
            </span>
          </div>
        </div>

        {/* Backlog Clearance & Spaced Revision Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Backlog Velocity Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              Backlog Clearance Velocity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
                <p className="text-xl font-black text-rose-300">
                  {backlogForecast.totalPendingHours}h
                </p>
                <span className="text-[10px] text-slate-500">
                  {backlogForecast.totalPendingCount} lectures
                </span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cleared</span>
                <p className="text-xl font-black text-emerald-300">
                  {backlogForecast.clearedHours}h
                </p>
                <span className="text-[10px] text-slate-500">Already completed</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs text-slate-300">
              <div className="flex items-center justify-between font-semibold mb-1">
                <span>Estimated Zero-Backlog:</span>
                <span className="text-brand-300 font-mono">
                  {backlogForecast.projectedClearanceDate}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Paced at {backlogForecast.dailyClearancePaceHours}h per day (~
                {backlogForecast.estimatedCompletionDays} study sessions).
              </p>
            </div>
          </div>

          {/* Revision Health */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Spaced Revision Health
              </h3>
              <span className="text-xs font-mono font-bold text-brand-300">
                {revisionStats.complianceRate}% On-Time
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-brand-400 rounded-full"
                style={{ width: `${revisionStats.complianceRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Completed: {revisionStats.completedCount}</span>
              <span>Pending: {revisionStats.pendingCount}</span>
              <span className="text-rose-400">Overdue: {revisionStats.overdueCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Analytics Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Subject-Wise Study Allocation & Coverage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjectStats.map(stat => (
            <div
              key={stat.subjectId}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color
                  }}
                >
                  {stat.name}
                </span>

                <span className="text-xs font-mono font-semibold text-slate-300">
                  {Math.round((stat.totalStudyMinutes / 60) * 10) / 10}h studied
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Curriculum Coverage</span>
                  <span className="font-bold text-slate-200">{stat.chapterProgressPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stat.chapterProgressPct}%`,
                      backgroundColor: stat.color
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Pending Tasks</span>
                  <span className="font-semibold text-slate-200">{stat.pendingTasksCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Backlog</span>
                  <span className="font-semibold text-rose-300">{stat.backlogHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
