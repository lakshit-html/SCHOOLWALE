import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  Plus,
  HelpCircle,
  Calculator as CalcIcon
} from 'lucide-react';
import { calculateDashboardMetrics } from '../../services/analytics';
import { FocusMusicPlayer } from '../music/FocusMusicPlayer';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenMobileMenu: () => void;
  onOpenTutorial: () => void;
  onOpenCalculator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAdd,
  onOpenMobileMenu,
  onOpenTutorial,
  onOpenCalculator
}) => {
  const { data, updateProfile, setActiveTab } = useApp();
  const metrics = calculateDashboardMetrics(data);

  const toggleSound = () => {
    updateProfile({ soundEnabled: !data.profile.soundEnabled });
  };

  const toggleTheme = () => {
    const nextTheme = data.profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  const isDark = data.profile.theme === 'dark';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-colors overflow-x-hidden max-w-full">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              StudyForge
            </h1>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400 block mt-0.5">
              Academic OS
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Streak Badge */}
        <div
          onClick={() => setActiveTab('analytics')}
          title="Daily Study Consistency Streak"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-semibold text-xs cursor-pointer hover:bg-amber-500/20 transition-colors shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-pulse" />
          <span>{data.profile.streak}<span className="hidden sm:inline"> Days</span></span>
        </div>

        {/* Daily Target Progress indicator */}
        <div
          onClick={() => setActiveTab('planner')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          title="Daily Target Progress"
        >
          <span className="text-slate-500 dark:text-slate-400">Target:</span>
          <span className="font-semibold text-brand-600 dark:text-brand-300">
            {metrics.todayCompletedHours}h / {metrics.todayTargetHours}h
          </span>
          <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-medium text-xs rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Lo-Fi & Focus Ambient Sound Player */}
        <FocusMusicPlayer />

        {/* Quick Calculator Modal Trigger */}
        <button
          onClick={onOpenCalculator}
          title="Open Scientific Calculator"
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
          aria-label="Open Calculator"
        >
          <CalcIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </button>

        {/* Interactive Tutorial Guide Button */}
        <button
          onClick={onOpenTutorial}
          title="View Feature Guide & Tutorial"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-brand-500" />
          <span className="hidden md:inline">Tutorial</span>
        </button>

        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
          aria-label="Toggle theme mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Sound Toggle (hidden on mobile, accessible in settings) */}
        <button
          onClick={toggleSound}
          title={data.profile.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          className="hidden md:block p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
          aria-label="Toggle audio effects"
        >
          {data.profile.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Profile Avatar / Trigger */}
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 pl-1 sm:pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 cursor-pointer group"
          title="Student Settings & Profile"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-brand-500 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 sm:ring-2 ring-slate-200 dark:ring-slate-800 group-hover:ring-brand-500/50 transition-all">
            {data.profile.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-brand-500 transition-colors">
              {data.profile.name}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">{data.profile.targetExam}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
