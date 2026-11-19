import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  ClockAlert,
  Repeat,
  Timer,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const { data, updateProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  // Quick personalization inputs in final step
  const [studentName, setStudentName] = useState(data.profile.name === 'Student' ? '' : data.profile.name);
  const [targetExam, setTargetExam] = useState(data.profile.targetExam);
  const [dailyHours, setDailyHours] = useState(data.profile.dailyTargetHours || 6);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Welcome to StudyForge',
      subtitle: 'Your Personal Academic Productivity Suite',
      badge: 'Academic Operating System',
      icon: Sparkles,
      iconColor: 'text-brand-400 bg-brand-500/15 border-brand-500/30',
      description:
        'StudyForge is engineered to help students, Class 11/12 scholars, and competitive aspirants organize daily studies, eliminate huge backlogs, and retain concepts without burnout.',
      highlights: [
        '🎯 Set daily study hours target and build an unbreakable streak',
        '⚡ 100% offline & private — all data stays right on your device',
        '🌗 Switch effortlessly between sleek Dark and crisp Light modes'
      ]
    },
    {
      title: 'Real-Time Dashboard',
      subtitle: 'Track Today’s Target & Weekly Momentum',
      badge: 'Executive Command Center',
      icon: LayoutDashboard,
      iconColor: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
      description:
        'The dashboard automatically calculates your completed hours, syllabus progress, pending tasks, and consistency streak using real session data.',
      highlights: [
        '⏱️ Today’s Hours: Combines verified focus sessions and completed tasks',
        '🔥 Consistency Streak: Rewards consecutive active study days',
        '📊 7-Day Output Graph: Visual comparison of daily hours vs your goal'
      ]
    },
    {
      title: 'Smart Study Planner',
      subtitle: 'Intelligent Scheduling & AI Auto-Balance',
      badge: 'Daily & Weekly Horizon',
      icon: Calendar,
      iconColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      description:
        'Plan lectures, practice problem sheets, and assignments. An intelligent urgency formula prioritizes tasks based on deadlines and criticality.',
      highlights: [
        '⚖️ Overload Detection: Flags days that exceed your daily capacity',
        '🪄 Auto-Schedule Button: 1-click rebalancing across upcoming days',
        '📚 Curriculum Manager: Organize chapters with difficulty & lecture counts'
      ]
    },
    {
      title: 'Backlog Clearance',
      subtitle: 'Liquidate Pending Lectures with Precision',
      badge: 'Zero-Debt Forecasting',
      icon: ClockAlert,
      iconColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      description:
        'Never feel overwhelmed by accumulated video lectures again. Track exact duration, notes status, and homework submissions.',
      highlights: [
        '📅 Projected Zero-Backlog Date: Calculates exact date you will be caught up',
        '🎚️ Dynamic Pace Controller: Adjust hours/day to see completion timelines',
        '⚡ 1-Click Move: Instantly move any backlog lecture into today’s schedule'
      ]
    },
    {
      title: 'Spaced Repetition System',
      subtitle: 'Scientific Intervals to Defeat the Forgetting Curve',
      badge: 'Long-Term Memory Retention',
      icon: Repeat,
      iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      description:
        'Based on the Ebbinghaus retention curve, topics are queued for revision across 5 calibrated cycles: 1 Day, 3 Days, 7 Days, 14 Days, and 30 Days.',
      highlights: [
        '🧠 Adaptive Confidence: Low confidence shortens interval; High expands it',
        '🚨 Overdue Indicators: Never let critical formulae slip from memory',
        '📜 Cycle History: Complete audit trail of past revision ratings'
      ]
    },
    {
      title: 'Focus Sanctuary & Notes',
      subtitle: 'Deep Work Timer & Academic Formula Vault',
      badge: 'Concentration & Recall',
      icon: Timer,
      iconColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      description:
        'A dedicated Pomodoro timer with Web Audio API sound synthesis and session logging, paired with a rich Markdown Formula Sheet vault.',
      highlights: [
        '⏲️ Presets (25m, 45m, 50m, 60m) with short/long recovery breaks',
        '✨ Post-session reflection mood logging (Flow, Productive, Distracted)',
        '📝 Formula sheets with subject filtering, tag search, and pin to top'
      ]
    },
    {
      title: 'Mock Tests & Exam Intelligence',
      subtitle: 'Diagnose Mistakes & Track Score Trajectories',
      badge: 'Exam Simulation',
      icon: Award,
      iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      description:
        'Record test scores, track subject-wise marks, perform root-cause mistake diagnosis, and build actionable improvement checklists.',
      highlights: [
        '📈 Score Progression Curve: Visual graph tracking percentage over time',
        '🎯 Weak Areas Tagging: Pinpoints topics that consistently cost marks',
        '🛠️ Action Plan Tracker: Enforces corrective problem-solving routines'
      ]
    },
    {
      title: 'Quick Personalization',
      subtitle: 'Configure your profile to start fresh',
      badge: 'Ready to Launch',
      icon: Sparkles,
      iconColor: 'text-brand-400 bg-brand-500/15 border-brand-500/30',
      description:
        'Tell us a little about your academic goals so StudyForge can calibrate your targets and schedules.',
      highlights: []
    }
  ];

  const currentSlide = slides[currentStep];
  const isFinalStep = currentStep === slides.length - 1;
  const SlideIcon = currentSlide.icon;

  const handleFinish = () => {
    updateProfile({
      name: studentName.trim() || 'Student',
      targetExam: targetExam.trim() || 'Academic Exams',
      dailyTargetHours: Number(dailyHours) || 6,
      hasCompletedOnboarding: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-slate-100 transition-colors">
        {/* Close / Skip button */}
        <button
          onClick={handleFinish}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Skip Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Counter & Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 text-brand-600 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentSlide.badge}</span>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-400">
            {currentStep + 1} of {slides.length}
          </span>
        </div>

        {/* Main Slide Content */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${currentSlide.iconColor}`}
          >
            <SlideIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentSlide.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400 mt-0.5">
              {currentSlide.subtitle}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {currentSlide.description}
        </p>

        {/* Slide Highlights or Final Personalization Form */}
        {!isFinalStep ? (
          <div className="space-y-2.5 mb-8 bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            {currentSlide.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                  What is your name?
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Alex, Rahul, Priya"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                  Target Exam / Goal
                </label>
                <input
                  type="text"
                  value={targetExam}
                  onChange={e => setTargetExam(e.target.value)}
                  placeholder="e.g. JEE, NEET, Class 12 Boards"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                Daily Study Target (Hours per day)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={14}
                  step={0.5}
                  value={dailyHours}
                  onChange={e => setDailyHours(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <span className="font-mono font-bold text-sm text-brand-600 dark:text-brand-300 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {dailyHours}h / day
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-6 bg-brand-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}

            {!isFinalStep ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Start StudyForge</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
