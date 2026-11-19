import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Sparkles,
  Clock,
  CheckCircle2,
  Smile,
  Meh,
  Zap,
  Sword
} from 'lucide-react';
import { PomodoroMode } from '../../types';
import { FocusMusicPlayer } from '../music/FocusMusicPlayer';

export const PomodoroView: React.FC = () => {
  const { data, logFocusSession } = useApp();

  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [focusDuration, setFocusDuration] = useState<number>(25);
  const shortBreakDuration = 5;
  const longBreakDuration = 15;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(data.subjects[0]?.id || '');
  const [sessionTaskTitle, setSessionTaskTitle] = useState<string>('');

  const [timeLeft, setTimeLeft] = useState<number>(focusDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  // Reflection rating modal
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [finishedMinutes, setFinishedMinutes] = useState<number>(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (mode === 'pomodoro') setTimeLeft(focusDuration * 60);
      else if (mode === 'short_break') setTimeLeft(shortBreakDuration * 60);
      else if (mode === 'long_break') setTimeLeft(longBreakDuration * 60);
    }
  }, [mode, focusDuration, shortBreakDuration, longBreakDuration, isRunning]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, focusDuration]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      const duration = focusDuration;
      setFinishedMinutes(duration);
      setCompletedSessionsCount(prev => prev + 1);
      setShowRatingModal(true);
    } else {
      setMode('pomodoro');
      setTimeLeft(focusDuration * 60);
    }
  };

  const handleSaveRating = (rating: 'flow' | 'productive' | 'distracted') => {
    logFocusSession({
      subjectId: selectedSubjectId || undefined,
      taskTitle: sessionTaskTitle.trim() || 'Deep Focus Block',
      durationMinutes: finishedMinutes,
      type: 'pomodoro',
      rating
    });
    setShowRatingModal(false);
    const nextMode = (completedSessionsCount + 1) % 4 === 0 ? 'long_break' : 'short_break';
    setMode(nextMode);
    setTimeLeft((nextMode === 'long_break' ? longBreakDuration : shortBreakDuration) * 60);
  };

  const toggleTimer = () => setIsRunning(prev => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(focusDuration * 60);
    else if (mode === 'short_break') setTimeLeft(shortBreakDuration * 60);
    else setTimeLeft(longBreakDuration * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setMode('short_break');
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setMode('pomodoro');
      setTimeLeft(focusDuration * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTotalDuration =
    (mode === 'pomodoro'
      ? focusDuration
      : mode === 'short_break'
      ? shortBreakDuration
      : longBreakDuration) * 60;
  const progressPct = ((currentTotalDuration - timeLeft) / currentTotalDuration) * 100;

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = data.focusSessions.filter(
    fs => fs.completedAt.startsWith(today) && fs.type === 'pomodoro'
  );
  const todayTotalFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <TimerIcon className="w-6 h-6 text-brand-500" />
            Pomodoro Focus Sanctuary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Build cognitive endurance with tactile controls, ambient audio alerts, and Boss quest damage.
          </p>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>Today: </span>
          <span className="font-bold text-brand-600 dark:text-brand-300 font-mono">
            {Math.floor(todayTotalFocusMinutes / 60)}h {todayTotalFocusMinutes % 60}m
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center gap-1">
            <Sword className="w-3 h-3" /> +300 DMG/session
          </span>
        </div>
      </div>

      {/* Skeuomorphic Tactile Focus Console */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.1),_inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col items-center justify-center relative overflow-hidden transition-colors">
        {/* Ambient Glow */}
        <div
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
            mode === 'pomodoro' ? 'bg-brand-500' : 'bg-cyan-500'
          }`}
        />

        {/* Tactile Mode Selector Switches */}
        <div className="flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-800 shadow-inner mb-6 sm:mb-8 z-10 flex-wrap gap-1 max-w-full">
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('pomodoro');
            }}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'pomodoro'
                ? 'bg-white dark:bg-brand-600 text-brand-600 dark:text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Focus ({focusDuration}m)
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('short_break');
            }}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-white dark:bg-cyan-600 text-cyan-600 dark:text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Short Break ({shortBreakDuration}m)
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('long_break');
            }}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Long Break ({longBreakDuration}m)
          </button>
        </div>

        {/* Subject & Task Link */}
        {mode === 'pomodoro' && (
          <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 z-10">
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
            >
              {data.subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={sessionTaskTitle}
              onChange={e => setSessionTaskTitle(e.target.value)}
              placeholder="What are you studying?"
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {/* Circular Display Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2 z-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className={`transition-all duration-500 ${
                mode === 'pomodoro' ? 'stroke-brand-500' : 'stroke-cyan-500'
              }`}
              strokeWidth="9"
              strokeDasharray="800"
              strokeDashoffset={800 - (800 * progressPct) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight select-none">
              {formattedTime}
            </span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mt-2">
              {mode === 'pomodoro'
                ? isRunning
                  ? '⚡ Deep Flow'
                  : 'Ready to Focus'
                : 'Rest & Recover'}
            </span>
          </div>
        </div>

        {/* Primary Tactile Mechanical Controls */}
        <div className="flex items-center gap-5 mt-8 z-10">
          <button
            onClick={resetTimer}
            className="p-3.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Big Skeuomorphic 3D Action Button */}
          <button
            onClick={toggleTimer}
            className={`px-10 py-4 rounded-2xl font-black text-base transition-all flex items-center gap-2.5 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_5px_0_#b45309] active:translate-y-1.5 active:shadow-none'
                : 'bg-brand-500 hover:bg-brand-400 text-white shadow-[0_5px_0_#0f766e] active:translate-y-1.5 active:shadow-none'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>START FOCUS</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-3.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Skip Session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Duration Presets */}
        <div className="flex items-center gap-2 mt-8 z-10">
          <span className="text-xs text-slate-400 mr-2">Preset:</span>
          {[25, 45, 50, 60].map(mins => (
            <button
              key={mins}
              onClick={() => {
                setFocusDuration(mins);
                if (mode === 'pomodoro' && !isRunning) {
                  setTimeLeft(mins * 60);
                }
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                focusDuration === mins
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Ambient Soundscape & Lo-Fi Generator */}
      <FocusMusicPlayer embedded />

      {/* Today's Focus Session History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Today's Focus Log ({todaySessions.length})
        </h3>

        {todaySessions.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
            No focus blocks completed yet today. Hit "Start Focus" above to begin your first round!
          </p>
        ) : (
          <div className="space-y-2.5">
            {todaySessions.map(session => {
              const subject = session.subjectId ? subjectsMap.get(session.subjectId) : null;
              const timeStr = new Date(session.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                        {session.taskTitle || 'Focus Session'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
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
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {session.durationMinutes} minutes
                        </span>
                        <span className="text-[11px] text-slate-400">at {timeStr}</span>
                      </div>
                    </div>
                  </div>

                  {session.rating && (
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        session.rating === 'flow'
                          ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                          : session.rating === 'productive'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {session.rating}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reflection Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-3 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Focus Session Complete!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
              You logged {finishedMinutes} minutes (+100 XP, 300 Boss DMG). How did this session feel?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSaveRating('flow')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex flex-col items-center gap-2"
              >
                <Zap className="w-5 h-5 text-brand-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Flow State</span>
                <span className="text-[10px] text-slate-500">Unstoppable</span>
              </button>

              <button
                onClick={() => handleSaveRating('productive')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex flex-col items-center gap-2"
              >
                <Smile className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Productive</span>
                <span className="text-[10px] text-slate-500">Solid Work</span>
              </button>

              <button
                onClick={() => handleSaveRating('distracted')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all flex flex-col items-center gap-2"
              >
                <Meh className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Distracted</span>
                <span className="text-[10px] text-slate-500">Restless</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
