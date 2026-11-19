import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Zap,
  Sword,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { soundEffects } from '../../services/audio';
import { fireConfetti } from '../../utils/confetti';

interface Question {
  id: number;
  subject: string;
  subjectColor: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ARENA_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'Under what exact condition is the Perpendicular Axis Theorem ($I_z = I_x + I_y$) valid?',
    options: [
      'Only for planar 2D laminar bodies',
      'For any 3D body if center of mass is at origin',
      'Only for solid spheres and cylinders',
      'For bodies with constant angular velocity'
    ],
    correctIndex: 0,
    explanation: 'Perpendicular axis theorem is strictly applicable ONLY to 2D laminar planar bodies.'
  },
  {
    id: 2,
    subject: 'Chemistry',
    subjectColor: '#a855f7',
    question: 'Which reagent pair is required for the Cannizzaro Reaction?',
    options: [
      'Aldehydes with alpha-hydrogen and dilute base',
      'Aldehydes with NO alpha-hydrogen and concentrated alkali (50% NaOH)',
      'Ketones with zinc amalgam and concentrated HCl',
      'Esters with Grignard reagent'
    ],
    correctIndex: 1,
    explanation: 'Cannizzaro reaction requires aldehydes lacking alpha-hydrogens (like Benzaldehyde, Formaldehyde) reacting with 50% alkali.'
  },
  {
    id: 3,
    subject: 'Mathematics',
    subjectColor: '#10b981',
    question: 'What is the value of the integral $\\int_{-\\pi/2}^{\\pi/2} \\sin^3(x) \\, dx$?',
    options: ['0', '1', '2', '\\pi/4'],
    correctIndex: 0,
    explanation: 'Since $\\sin^3(x)$ is an odd function, integrating symmetrically from $-a$ to $a$ equals exactly 0.'
  },
  {
    id: 4,
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'In an adiabatic expansion of an ideal gas, how does temperature change?',
    options: [
      'Temperature increases',
      'Temperature remains constant',
      'Temperature decreases',
      'Temperature first increases then drops'
    ],
    correctIndex: 2,
    explanation: 'In adiabatic expansion ($dQ = 0$), work is done at the expense of internal energy ($dU = -dW$), so temperature drops.'
  },
  {
    id: 5,
    subject: 'Chemistry',
    subjectColor: '#a855f7',
    question: 'What is the hybridization and molecular geometry of Xenon Tetrafluoride ($XeF_4$)?',
    options: [
      '$sp^3d^2$, Square Planar',
      '$sp^3d$, See-Saw',
      '$sp^3$, Tetrahedral',
      '$sp^3d^2$, Octahedral'
    ],
    correctIndex: 0,
    explanation: '$XeF_4$ has 4 bond pairs and 2 lone pairs ($sp^3d^2$), arranging the atoms in a square planar geometry.'
  },
  {
    id: 6,
    subject: 'Mathematics',
    subjectColor: '#10b981',
    question: 'If a matrix has eigenvalue $\\lambda$, what is the eigenvalue of $A^2$?',
    options: ['$\\lambda$', '$\\lambda^2$', '$2\\lambda$', '$\\sqrt{\\lambda}$'],
    correctIndex: 1,
    explanation: 'If $A v = \\lambda v$, then $A^2 v = A(A v) = A(\\lambda v) = \\lambda(A v) = \\lambda^2 v$.'
  }
];

export const StudyArenaView: React.FC = () => {
  const { data, damageBoss, recordGameResult } = useApp();
  const game = data.game || {
    xp: 120,
    level: 1,
    coins: 40,
    bossHp: 750,
    bossMaxHp: 1000,
    highestCombo: 3,
    unlockedBadges: ['first_step'],
    gamesPlayed: 1
  };

  // Arena Speed Recall State
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxSessionCombo, setMaxSessionCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndGame();
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
  }, [isPlaying, timeRemaining]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setTimeRemaining(45);
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setMaxSessionCombo(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setIsGameOver(false);
  };

  const handleEndGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    recordGameResult(score, maxSessionCombo);
    damageBoss(score * 2);
    fireConfetti();
  };

  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswerRevealed) return;

    setSelectedAnswer(optionIdx);
    setIsAnswerRevealed(true);

    const currentQ = ARENA_QUESTIONS[qIndex % ARENA_QUESTIONS.length];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      soundEffects.playCompletionBeep();
      const newCombo = combo + 1;
      const points = 20 * (newCombo >= 3 ? 2 : 1);
      setCombo(newCombo);
      setMaxSessionCombo(prev => Math.max(prev, newCombo));
      setScore(prev => prev + points);
      damageBoss(points);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      setIsAnswerRevealed(false);
      setSelectedAnswer(null);
      setQIndex(prev => prev + 1);
    }, 1100);
  };

  const currentQ = ARENA_QUESTIONS[qIndex % ARENA_QUESTIONS.length];
  const bossHealthPct = Math.round((game.bossHp / game.bossMaxHp) * 100);

  const badges = [
    { id: 'first_step', name: 'First Blood', desc: 'Started the Study Arena', icon: '⚡' },
    { id: 'combo_king', name: 'Combo King', desc: 'Reached 3x answer streak', icon: '🔥' },
    { id: 'boss_slayer', name: 'Hydra Hunter', desc: 'Dealt over 500 Boss DMG', icon: '⚔️' },
    { id: 'focus_titan', name: 'Zen Grandmaster', desc: 'Level 2 Scholar reached', icon: '👑' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header Banner with Arcade Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 mb-2">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Gamified Study Quest</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Gamepad2 className="w-7 h-7 text-brand-500" />
            BrainForge Arena & Boss Quest
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Turn revision into an arcade battle: defeat the Backlog Beast, level up, and test speed recall!
          </p>
        </div>

        {/* Player Level & XP Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_4px_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
            L{game.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Scholar Tier</span>
              <span className="text-[10px] font-mono font-bold text-amber-500">🪙 {game.coins}</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(game.xp % 250) / 2.5}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5 block">
              {game.xp % 250}/250 XP to Level {game.level + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Skeuomorphic Boss Battle Quest Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 p-6 sm:p-8 text-white shadow-[0_12px_24px_-4px_rgba(0,0,0,0.4),_inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 border border-rose-500/30 text-rose-300">
                Daily Boss Battle
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Dealt {game.bossMaxHp - game.bossHp} damage today
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-400 flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30 border border-rose-400/30">
                🐉
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">
                  The Procrastination Hydra
                </h3>
                <p className="text-xs text-slate-400">
                  Every study task deals <span className="text-rose-400 font-bold">150 DMG</span>. Every Pomodoro deals <span className="text-amber-400 font-bold">300 DMG</span>!
                </p>
              </div>
            </div>

            {/* Boss HP bar (Skeuomorphic debossed groove) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Sword className="w-3.5 h-3.5" /> Boss Health
                </span>
                <span className="font-bold text-slate-300">
                  {game.bossHp} / {game.bossMaxHp} HP ({bossHealthPct}%)
                </span>
              </div>
              <div className="w-full h-4 bg-slate-950 rounded-full border border-slate-800 p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${bossHealthPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 text-center min-w-[160px]">
            <Trophy className="w-8 h-8 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-slate-200">Defeat Reward</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">+200 XP & 50 Coins</span>
          </div>
        </div>
      </div>

      {/* Speed Recall Arena Mode (Interactive Game) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {!isPlaying && !isGameOver ? (
          /* Lobby / Start Screen */
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-500/25 border-2 border-white/20">
              <Zap className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Speed Recall Flashcard Arena
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                45 seconds on the clock. Answer high-yield formulas and concepts to score points, build combos, and slash the boss!
              </p>
            </div>

            {/* Skeuomorphic 3D Push Button */}
            <div className="pt-2">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-400 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_6px_0_#0f766e] active:translate-y-1.5 active:shadow-[0_0px_0_#0f766e] transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>START RECALL BATTLE</span>
              </button>
            </div>
          </div>
        ) : isPlaying ? (
          /* Active Question Arena */
          <div className="space-y-6">
            {/* Top Game Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span>{timeRemaining}s</span>
                </div>

                {combo >= 2 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-black text-xs animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{combo}x COMBO!</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">SCORE</span>
                <p className="text-xl font-black font-mono text-brand-600 dark:text-brand-300">
                  {score} PTS
                </p>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${currentQ.subjectColor}20`,
                    color: currentQ.subjectColor
                  }}
                >
                  {currentQ.subject}
                </span>
                <span className="text-xs font-mono text-slate-400">Question #{qIndex + 1}</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Multiple Choice Options (Tactile Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle =
                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-brand-500 shadow-[0_3px_0_rgba(0,0,0,0.06)] dark:shadow-[0_3px_0_rgba(0,0,0,0.4)]';

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-500 text-white border-emerald-600 shadow-[0_3px_0_#047857]';
                  } else if (isSelected) {
                    btnStyle =
                      'bg-rose-500 text-white border-rose-600 shadow-[0_3px_0_#b91c1c]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={isAnswerRevealed}
                    className={`p-4 rounded-2xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle} active:translate-y-1 active:shadow-none`}
                  >
                    <span>{opt}</span>
                    {isAnswerRevealed && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerRevealed && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center animate-fade-in">
                💡 {currentQ.explanation}
              </p>
            )}
          </div>
        ) : (
          /* Game Over Screen */
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Battle Complete!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                You earned <span className="font-bold text-brand-500">{score} XP</span> and dealt{' '}
                <span className="font-bold text-rose-500">{score * 2} Damage</span> to the Backlog Beast!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Max Combo</span>
                <p className="text-lg font-black text-amber-500 font-mono">{maxSessionCombo}x Streak</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Coins Earned</span>
                <p className="text-lg font-black text-emerald-500 font-mono">+{Math.round(score / 5)}</p>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Badges & Achievements Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Unlocked Scholar Badges ({badges.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col items-center text-center space-y-1"
            >
              <span className="text-2xl mb-0.5">{b.icon}</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
