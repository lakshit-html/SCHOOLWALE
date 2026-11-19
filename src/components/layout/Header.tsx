import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Volume2, VolumeX, Moon, Sun, Sparkles, Plus } from 'lucide-react';
import { calculateDashboardMetrics } from '../../services/analytics';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAdd, onOpenMobileMenu }) => {
  const { data, updateProfile, setActiveTab } = useApp();
  const metrics = calculateDashboardMetrics(data);

  const toggleSound = () => {
    updateProfile({ soundEnabled: !data.profile.soundEnabled });
  };

  const toggleTheme = () => {
    updateProfile({ theme: data.profile.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              StudyForge
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-400 block -mt-1">
              AI Academic Suite
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak Badge */}
        <div
          onClick={() => setActiveTab('analytics')}
          title="Daily Study Streak"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm cursor-pointer hover:bg-amber-500/20 transition-colors shadow-sm"
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{data.profile.streak} Days</span>
        </div>

        {/* Daily Target Progress indicator */}
        <div
          onClick={() => setActiveTab('planner')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs cursor-pointer hover:border-slate-700 transition-colors"
          title="Daily Study Target Progress"
        >
          <span className="text-slate-400">Target:</span>
          <span className="font-semibold text-brand-300">
            {metrics.todayCompletedHours}h / {metrics.todayTargetHours}h
          </span>
          <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={data.profile.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
        >
          {data.profile.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-brand-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${data.profile.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
        >
          {data.profile.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Profile Avatar / Trigger */}
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-800 cursor-pointer group"
          title="Student Settings & Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-brand-500 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-slate-800 group-hover:ring-brand-500/50 transition-all">
            {data.profile.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-brand-300 transition-colors">
              {data.profile.name}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">{data.profile.targetExam}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
