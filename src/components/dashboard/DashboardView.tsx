import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateDashboardMetrics,
  calculateWeeklyProductivity
} from '../../services/analytics';
import {
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  Play,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQuickAdd: () => void;
  onOpenTutorial: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickAdd,
  onOpenTutorial
}) => {
  const { data, setActiveTab, toggleTaskCompleted, completeRevisionCycle } = useApp();
  const metrics = calculateDashboardMetrics(data);
  const weekly = calculateWeeklyProductivity(
    data.focusSessions,
    data.tasks,
    data.profile.dailyTargetHours
  );

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = data.tasks.filter(t => t.scheduledDate === today || t.dueDate === today);
  const upcomingRevisions = data.revisions.filter(r => r.status !== 'completed').slice(0, 3);
  const criticalBacklogs = data.backlog
    .filter(b => !b.completed && (b.priority === 'critical' || b.priority === 'high'))
    .slice(0, 3);

  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-teal-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: {data.profile.targetExam}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {data.profile.name}!
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {metrics.currentStreak > 0 ? (
                <>
                  You are on a{' '}
                  <span className="text-amber-300 font-bold">{data.profile.streak}-day streak</span>.
                  Logged <span className="text-brand-300 font-bold">{metrics.todayCompletedHours}h</span> towards your {metrics.todayTargetHours}h daily target.
                </>
              ) : (
                'Your clean academic slate is ready. Schedule your first task or launch a Pomodoro focus block below.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-400 hover:to-teal-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus Session</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>

            <button
              onClick={onOpenTutorial}
              title="Learn how all features work"
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-brand-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Study Hours */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Study</span>
            <Clock className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.todayCompletedHours}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              / {metrics.todayTargetHours} hrs
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgressPct}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
            {metrics.todayProgressPct}% achieved
          </span>
        </div>

        {/* Study Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Consistency Streak</span>
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">
              {metrics.currentStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Days active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-tight">
            {metrics.currentStreak > 0
              ? '🔥 Keep it up! Consistency builds mastery.'
              : '🌱 Log study today to start your streak!'}
          </p>
        </div>

        {/* Chapter Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Covered</span>
            <BookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.overallChapterCompletionPct}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Lectures done
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${metrics.overallChapterCompletionPct}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
            Across {data.chapters.length} tracked chapters
          </span>
        </div>

        {/* Pending Backlogs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Backlog Hours</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-300">
              {metrics.totalBacklogHours}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Hours pending
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-tight">
            {metrics.totalBacklogHours > 0
              ? 'Clearance pace: ~1.5h/day'
              : 'Zero backlog debt! All clear.'}
          </p>
        </div>
      </div>

      {/* Middle Row: Today's Tasks & Weekly Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  Today's Study Targets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {todayTasks.filter(t => t.completed).length} of {todayTasks.length} tasks completed
                </p>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Open Planner <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No tasks scheduled for today yet.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Add problem sets, reading targets, or lectures to start filling your daily plan.
                </p>
                <button
                  onClick={onOpenQuickAdd}
                  className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task for Today
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => {
                  const subject = subjectsMap.get(task.subjectId);
                  const isCompleted = task.completed;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/40 opacity-60'
                          : 'bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskCompleted(task.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isCompleted
                              ? 'bg-brand-500 border-brand-500 text-white'
                              : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-200'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {subject && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: `${subject.color}15`,
                                  color: subject.color
                                }}
                              >
                                {subject.name}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {task.estimatedMinutes} mins
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                task.priority === 'critical'
                                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                                  : task.priority === 'high'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('pomodoro')}
                        title="Start focus timer on this task"
                        className="p-2 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Productivity Visual Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                7-Day Productivity
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Insights <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 pb-2">
              {weekly.map(day => {
                const maxBarHours = Math.max(metrics.todayTargetHours, 8);
                const heightPct = Math.min(100, Math.round((day.totalHours / maxBarHours) * 100));
                const isToday = day.date === today;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {day.totalHours > 0 ? `${day.totalHours}h` : '0'}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-32 flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-brand-600 to-teal-400 shadow-md shadow-brand-500/20'
                            : day.totalHours >= day.targetHours
                            ? 'bg-teal-500/80'
                            : 'bg-slate-300 dark:bg-slate-600/60'
                        }`}
                        style={{ height: `${Math.max(6, heightPct)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isToday
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Daily Goal: {metrics.todayTargetHours}h</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              {metrics.weeklyProductivityHours}h this week
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Revisions & Critical Backlog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spaced Revisions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Spaced Revision Queue
            </h3>
            <button
              onClick={() => setActiveTab('revision')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingRevisions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No revisions due right now.
              </p>
              <button
                onClick={() => setActiveTab('revision')}
                className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                + Schedule a topic for revision
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingRevisions.map(rev => {
                const subject = subjectsMap.get(rev.subjectId);
                const isOverdue = rev.status === 'overdue' || rev.scheduledDate < today;

                return (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                        {rev.chapterTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {subject && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${subject.color}15`,
                              color: subject.color
                            }}
                          >
                            {subject.name}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Cycle {rev.cycle} ({rev.intervalDays}d)
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            OVERDUE
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => completeRevisionCycle(rev.id, 'medium')}
                      className="px-2.5 py-1.5 bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-700 dark:text-brand-300 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Mark Done
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Critical Backlogs */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              High Priority Backlogs
            </h3>
            <button
              onClick={() => setActiveTab('backlog')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Backlog Manager <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {criticalBacklogs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No high-priority backlogs recorded.
              </p>
              <button
                onClick={() => setActiveTab('backlog')}
                className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                + Log pending lecture
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {criticalBacklogs.map(item => {
                const subject = subjectsMap.get(item.subjectId);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                        {item.lectureTitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.chapterTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {subject && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${subject.color}15`,
                              color: subject.color
                            }}
                          >
                            {subject.name}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.durationMinutes} mins
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded uppercase">
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('pomodoro')}
                      className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
