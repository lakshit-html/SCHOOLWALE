import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  ClockAlert,
  Repeat,
  Timer,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  Sparkles,
  X
} from 'lucide-react';
import { calculateDashboardMetrics } from '../../services/analytics';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, data } = useApp();
  const metrics = calculateDashboardMetrics(data);

  const overdueRevisions = data.revisions.filter(r => r.status === 'overdue').length;
  const criticalBacklog = data.backlog.filter(b => !b.completed && b.priority === 'critical').length;
  const todayPendingTasks = metrics.pendingTasksTodayCount;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'planner',
      label: 'Smart Planner',
      icon: Calendar,
      badge: todayPendingTasks > 0 ? todayPendingTasks : undefined,
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30'
    },
    {
      id: 'backlog',
      label: 'Backlog Manager',
      icon: ClockAlert,
      badge: criticalBacklog > 0 ? criticalBacklog : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'revision',
      label: 'Spaced Revision',
      icon: Repeat,
      badge: overdueRevisions > 0 ? overdueRevisions : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    { id: 'pomodoro', label: 'Focus Timer', icon: Timer },
    { id: 'notes', label: 'Notes Manager', icon: BookOpen },
    { id: 'tests', label: 'Mock Tests & Exam', icon: Award },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Data', icon: Settings }
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Logo in Sidebar */}
          <div className="h-16 px-6 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center shadow-md shadow-brand-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">StudyForge</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 shadow-sm border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Productivity Widget */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Today's Target</span>
            <span className="font-semibold text-brand-300">
              {metrics.todayCompletedHours}h / {metrics.todayTargetHours}h
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgressPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {metrics.todayProgressPct >= 100
              ? '🎯 Target reached! Great job today.'
              : `${Math.round((metrics.todayTargetHours - metrics.todayCompletedHours) * 10) / 10}h remaining to hit your daily goal.`}
          </p>
        </div>
      </aside>
    </>
  );
};
