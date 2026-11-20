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
  XCircle,
  Award,
  GraduationCap,
  Scissors,
  Snowflake,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Bot
} from 'lucide-react';
import { soundEffects } from '../../services/audio';
import { fireConfetti } from '../../utils/confetti';
import { MathFormula } from '../common/MathFormula';
import {
  generateProceduralQuestions,
  generateAIQuiz,
  shuffleArray
} from '../../services/quizGenerator';

export type AcademicGrade = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12' | 'JEE / NEET';

interface Question {
  id: number;
  grade: AcademicGrade;
  subject: string;
  subjectColor: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ARENA_QUESTIONS: Question[] = [
  // CLASS 9
  {
    id: 101,
    grade: 'Class 9',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'According to Newton\'s Second Law of Motion, force is defined as the product of:',
    options: ['Mass and Velocity', 'Mass and Acceleration ($F = ma$)', 'Mass and Distance', 'Weight and Gravity'],
    correctIndex: 1,
    explanation: 'Newton\'s Second Law states that $F = \\frac{dp}{dt} = ma$ for constant mass.'
  },
  {
    id: 102,
    grade: 'Class 9',
    subject: 'Chemistry',
    subjectColor: '#a855f7',
    question: 'What is the chemical formula of Aluminium Oxide?',
    options: ['$AlO$', '$Al_2O_3$', '$Al_3O_2$', '$AlO_2$'],
    correctIndex: 1,
    explanation: 'Aluminium has valency +3 and Oxide has valency -2, giving the criss-cross formula $Al_2O_3$.'
  },
  {
    id: 103,
    grade: 'Class 9',
    subject: 'Biology',
    subjectColor: '#10b981',
    question: 'Which cellular organelle is universally known as the "Powerhouse of the Cell"?',
    options: ['Golgi Apparatus', 'Endoplasmic Reticulum', 'Mitochondria', 'Lysosome'],
    correctIndex: 2,
    explanation: 'Mitochondria produce cellular energy in the form of ATP through cellular respiration.'
  },
  {
    id: 104,
    grade: 'Class 9',
    subject: 'Mathematics',
    subjectColor: '#f59e0b',
    question: 'What is the degree of a non-zero constant polynomial (e.g. $P(x) = 7$)?',
    options: ['0', '1', 'Undefined', '7'],
    correctIndex: 0,
    explanation: 'Since $7 = 7x^0$, the degree of any non-zero constant polynomial is 0.'
  },
  {
    id: 105,
    grade: 'Class 9',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'What is the acceleration due to gravity ($g$) at the surface of the Earth?',
    options: ['$9.8\\text{ m/s}^2$', '$10\\text{ m/s}$', '$6.67\\times 10^{-11}\\text{ m/s}^2$', '$980\\text{ m/s}^2$'],
    correctIndex: 0,
    explanation: 'Standard gravitational acceleration near the Earth\'s surface is approximately $9.8\\text{ m/s}^2$.'
  },

  // CLASS 10
  {
    id: 201,
    grade: 'Class 10',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'Which formula correctly represents the Mirror Formula for spherical mirrors?',
    options: [
      '$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$',
      '$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$',
      '$f = u + v$',
      '$\\frac{1}{f} = \\frac{u}{v}$'
    ],
    correctIndex: 1,
    explanation: 'The spherical mirror formula is $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$. (Note: lenses use $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$).'
  },
  {
    id: 202,
    grade: 'Class 10',
    subject: 'Chemistry',
    subjectColor: '#a855f7',
    question: 'What is the pH value of pure neutral water at $25^\\circ\\text{C}$?',
    options: ['0', '7', '14', '1'],
    correctIndex: 1,
    explanation: 'Neutral water at $25^\\circ\\text{C}$ has $[H^+] = 10^{-7}\\text{ M}$, therefore $\\text{pH} = -\\log(10^{-7}) = 7$.'
  },
  {
    id: 203,
    grade: 'Class 10',
    subject: 'Mathematics',
    subjectColor: '#f59e0b',
    question: 'Which of the following is a fundamental Pythagorean trigonometric identity?',
    options: [
      '$\\sin^2\\theta - \\cos^2\\theta = 1$',
      '$\\sin^2\\theta + \\cos^2\\theta = 1$',
      '$\\tan^2\\theta - \\sin^2\\theta = 1$',
      '$\\sec^2\\theta + \\tan^2\\theta = 1$'
    ],
    correctIndex: 1,
    explanation: '$\\sin^2\\theta + \\cos^2\\theta = 1$ is the principal Pythagorean identity in trigonometry.'
  },
  {
    id: 204,
    grade: 'Class 10',
    subject: 'Biology',
    subjectColor: '#10b981',
    question: 'In human beings, which respiratory pigment binds and transports oxygen efficiently in the blood?',
    options: ['Chlorophyll', 'Haemoglobin', 'Keratin', 'Melanin'],
    correctIndex: 1,
    explanation: 'Haemoglobin present in Red Blood Cells binds with oxygen to form oxyhaemoglobin.'
  },
  {
    id: 205,
    grade: 'Class 10',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'If the length of a metallic conductor is doubled while keeping its cross-sectional area constant, its resistance will:',
    options: ['Halve', 'Double ($R \\propto l$)', 'Remain unchanged', 'Quadruple'],
    correctIndex: 1,
    explanation: 'From $R = \\rho \\frac{l}{A}$, resistance is directly proportional to length, so doubling length doubles resistance.'
  },

  // CLASS 11
  {
    id: 301,
    grade: 'Class 11',
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
    id: 302,
    grade: 'Class 11',
    subject: 'Chemistry',
    subjectColor: '#a855f7',
    question: 'What is the hybridization and molecular shape of Phosphorus Pentachloride ($PCl_5$)?',
    options: [
      '$sp^3d$, Trigonal Bipyramidal',
      '$sp^3d^2$, Octahedral',
      '$sp^3$, Tetrahedral',
      '$dsp^2$, Square Planar'
    ],
    correctIndex: 0,
    explanation: '$PCl_5$ has 5 bond pairs and 0 lone pairs, giving $sp^3d$ hybridization with trigonal bipyramidal geometry.'
  },
  {
    id: 303,
    grade: 'Class 11',
    subject: 'Mathematics',
    subjectColor: '#f59e0b',
    question: 'What is the eccentricity ($e$) of any standard parabola (e.g. $y^2 = 4ax$)?',
    options: ['$e = 0$', '$e = 1$', '$e > 1$', '$0 < e < 1$'],
    correctIndex: 1,
    explanation: 'By conic section definition: Circle $e = 0$, Ellipse $0 < e < 1$, Parabola $e = 1$, Hyperbola $e > 1$.'
  },
  {
    id: 304,
    grade: 'Class 11',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'In an adiabatic expansion of an ideal gas, how does the internal temperature change?',
    options: [
      'Temperature increases',
      'Temperature remains constant',
      'Temperature decreases',
      'Temperature first increases then drops'
    ],
    correctIndex: 2,
    explanation: 'In adiabatic expansion ($dQ = 0$), work is done at the expense of internal energy ($dU = -dW$), so temperature decreases.'
  },
  {
    id: 305,
    grade: 'Class 11',
    subject: 'Biology',
    subjectColor: '#10b981',
    question: 'During which phase of the eukaryotic cell cycle does actual DNA replication occur?',
    options: ['$G_1$ Phase', 'S Phase (Synthesis)', '$G_2$ Phase', 'M Phase'],
    correctIndex: 1,
    explanation: 'DNA replication and duplication of centrioles occur strictly during the S (Synthesis) phase of Interphase.'
  },

  // CLASS 12
  {
    id: 401,
    grade: 'Class 12',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'According to Gauss\'s Law in electrostatics, the total electric flux through any closed Gaussian surface equals:',
    options: [
      '$\\frac{q_{\\text{enclosed}}}{\\varepsilon_0}$',
      '$q_{\\text{enclosed}} \\cdot \\varepsilon_0$',
      'Zero for all surfaces',
      '$\\frac{E}{A}$'
    ],
    correctIndex: 0,
    explanation: 'Gauss\'s law states that $\\oint \\vec{E}\\cdot d\\vec{A} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0}$.'
  },
  {
    id: 402,
    grade: 'Class 12',
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
    id: 403,
    grade: 'Class 12',
    subject: 'Mathematics',
    subjectColor: '#f59e0b',
    question: 'What is the value of the definite integral $\\int_{-\\pi/2}^{\\pi/2} \\sin^3(x) \\, dx$?',
    options: ['0', '1', '2', '$\\pi/4$'],
    correctIndex: 0,
    explanation: 'Since $\\sin^3(x)$ is an odd function ($f(-x) = -f(x)$), integrating symmetrically from $-a$ to $a$ equals 0.'
  },
  {
    id: 404,
    grade: 'Class 12',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'Kirchhoff\'s First Rule (Junction Rule, $\\sum I = 0$) is a direct consequence of the conservation of:',
    options: ['Energy', 'Electric Charge', 'Momentum', 'Magnetic Flux'],
    correctIndex: 1,
    explanation: 'The junction rule states that total current entering equals total current leaving, which is the conservation of electric charge.'
  },
  {
    id: 405,
    grade: 'Class 12',
    subject: 'Biology',
    subjectColor: '#10b981',
    question: 'What is the classical phenotypic ratio obtained in the $F_2$ generation of Mendel\'s dihybrid cross?',
    options: ['$3:1$', '$9:3:3:1$', '$1:2:1$', '$9:7$'],
    correctIndex: 1,
    explanation: 'Mendel\'s law of independent assortment in a dihybrid cross yields the classical $9:3:3:1$ phenotypic ratio.'
  },

  // JEE / NEET
  {
    id: 501,
    grade: 'JEE / NEET',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'A solid cylinder of mass $M$ and radius $R$ rolls down an incline of angle $\\theta$ without slipping. Its linear acceleration is:',
    options: [
      '$\\frac{2}{3} g \\sin\\theta$',
      '$\\frac{1}{2} g \\sin\\theta$',
      '$\\frac{5}{7} g \\sin\\theta$',
      '$g \\sin\\theta$'
    ],
    correctIndex: 0,
    explanation: '$a = \\frac{g\\sin\\theta}{1 + I/(MR^2)} = \\frac{g\\sin\\theta}{1 + 1/2} = \\frac{2}{3} g\\sin\\theta$.'
  },
  {
    id: 502,
    grade: 'JEE / NEET',
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
    explanation: '$XeF_4$ has 4 bond pairs and 2 lone pairs ($sp^3d^2$), arranging the fluorine atoms in a square planar geometry.'
  },
  {
    id: 503,
    grade: 'JEE / NEET',
    subject: 'Mathematics',
    subjectColor: '#f59e0b',
    question: 'What is the value of the limit $\\lim_{x\\to 0} \\frac{\\sin x - x}{x^3}$?',
    options: ['$-\\frac{1}{6}$', '$\\frac{1}{6}$', '0', '$-\\frac{1}{3}$'],
    correctIndex: 0,
    explanation: 'Using Taylor series: $\\sin x = x - \\frac{x^3}{6} + \\dots \\implies \\frac{\\sin x - x}{x^3} = -\\frac{1}{6}$.'
  },
  {
    id: 504,
    grade: 'JEE / NEET',
    subject: 'Physics',
    subjectColor: '#38bdf8',
    question: 'What is the total work done by a purely magnetic Lorentz force ($\\vec{F} = q(\\vec{v}\\times\\vec{B})$) on a moving charged particle?',
    options: [
      'Always Zero (since $\\vec{F} \\perp \\vec{v}$)',
      'Depends on the magnitude of $\\vec{B}$',
      '$q v B d$',
      'Equal to change in kinetic energy'
    ],
    correctIndex: 0,
    explanation: 'Because $\\vec{F}_B$ is always perpendicular to velocity $\\vec{v}$, the power $P = \\vec{F}\\cdot\\vec{v} = 0$, meaning work done is identically zero.'
  }
];

const GRADE_LIST: AcademicGrade[] = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'JEE / NEET'
];

export const StudyArenaView: React.FC = () => {
  const { data, recordGameResult, damageBoss, showToast } = useApp();

  // Selected Grade Filter: Defaults to student profile grade if matches, else Class 11
  const initialGrade = GRADE_LIST.includes(data.profile.grade as AcademicGrade)
    ? (data.profile.grade as AcademicGrade)
    : 'Class 11';

  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>(initialGrade);

  // Active questions state: dynamically generated and shuffled on every attempt!
  const buildQuestionsForGrade = (grade: AcademicGrade): Question[] => {
    const base = ARENA_QUESTIONS.filter(q => q.grade === grade);
    const procedural = generateProceduralQuestions(grade, 3).map((pq, idx) => ({
      id: 9000 + idx + Date.now(),
      grade: grade,
      subject: pq.subject,
      subjectColor: pq.subject === 'Physics' ? '#38bdf8' : pq.subject === 'Chemistry' ? '#a855f7' : '#f59e0b',
      question: pq.question,
      options: pq.options,
      correctIndex: pq.correctAnswer,
      explanation: pq.explanation
    }));
    return shuffleArray([...base, ...procedural]);
  };

  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() =>
    buildQuestionsForGrade(initialGrade)
  );

  const [aiTopicInput, setAiTopicInput] = useState<string>('');
  const [isGeneratingAIQuiz, setIsGeneratingAIQuiz] = useState<boolean>(false);

  useEffect(() => {
    setActiveQuestions(buildQuestionsForGrade(selectedGrade));
  }, [selectedGrade]);

  const handleRollNewQuestions = () => {
    setActiveQuestions(buildQuestionsForGrade(selectedGrade));
    soundEffects.playTactileClick();
    showToast?.('Rolled fresh dynamic numericals & questions!', 'info');
  };

  const handleGenerateAIQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicInput.trim() || isGeneratingAIQuiz) return;
    setIsGeneratingAIQuiz(true);
    showToast?.(`Consulting Gemini AI for "${aiTopicInput.trim()}" questions...`, 'info');
    try {
      const generated = await generateAIQuiz(aiTopicInput.trim(), selectedGrade, 5);
      const formatted: Question[] = generated.map((g, idx) => ({
        id: 8000 + idx + Date.now(),
        grade: selectedGrade,
        subject: g.subject,
        subjectColor: g.subject === 'Physics' ? '#38bdf8' : g.subject === 'Chemistry' ? '#a855f7' : '#f59e0b',
        question: g.question,
        options: g.options,
        correctIndex: g.correctAnswer,
        explanation: g.explanation
      }));
      setActiveQuestions(formatted);
      soundEffects.playCompletionBeep();
      showToast?.(`AI Quiz Ready! Starting Battle on "${aiTopicInput.trim()}"!`, 'success');
      // Instantly start challenge with newly generated AI questions!
      setIsPlaying(true);
      setTimeRemaining(50);
      setQIndex(0);
      setScore(0);
      setCombo(0);
      setMaxSessionCombo(0);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setIsGameOver(false);
      setEliminatedIndices([]);
      setUsedFiftyFifty(false);
      setUsedFreeze(false);
      setShowHint(false);
      setFloatingDamage(null);
    } catch {
      setActiveQuestions(buildQuestionsForGrade(selectedGrade));
    } finally {
      setIsGeneratingAIQuiz(false);
    }
  };

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxSessionCombo, setMaxSessionCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Power-Ups & Gamification Battle FX
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<string | null>(null);

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
    setActiveQuestions(buildQuestionsForGrade(selectedGrade));
    setIsPlaying(true);
    setTimeRemaining(45);
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setMaxSessionCombo(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setIsGameOver(false);
    setEliminatedIndices([]);
    setUsedFiftyFifty(false);
    setUsedFreeze(false);
    setShowHint(false);
    setFloatingDamage(null);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty || isAnswerRevealed) return;
    const currentQ = activeQuestions[qIndex % activeQuestions.length];
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== currentQ.correctIndex);
    // Pick two wrong indices to eliminate
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedIndices(toEliminate);
    setUsedFiftyFifty(true);
    soundEffects.playTactileClick();
  };

  const handleTimeFreeze = () => {
    if (usedFreeze) return;
    setTimeRemaining(prev => prev + 15);
    setUsedFreeze(true);
    soundEffects.playTactileClick();
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

    const currentQ = activeQuestions[qIndex % activeQuestions.length];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      soundEffects.playCompletionBeep();
      const newCombo = combo + 1;
      const points = 25 * (newCombo >= 3 ? 2 : 1);
      setCombo(newCombo);
      setMaxSessionCombo(prev => Math.max(prev, newCombo));
      setScore(prev => prev + points);
      damageBoss(points * 2);
      setFloatingDamage(`💥 -${points * 2} CRIT!`);
      setTimeout(() => setFloatingDamage(null), 1200);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setEliminatedIndices([]);
      setShowHint(false);
      setQIndex(prev => prev + 1);
    }, 1200);
  };

  const currentQuestion = activeQuestions[qIndex % activeQuestions.length];
  const boss = data.game || {
    xp: 0,
    level: 1,
    coins: 0,
    bossHp: 1000,
    bossMaxHp: 1000,
    highestCombo: 0,
    unlockedBadges: [],
    gamesPlayed: 0
  };

  const bossHealthPercent = Math.max(0, Math.min(100, Math.round((boss.bossHp / boss.bossMaxHp) * 100)));

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Student Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              BrainForge Speed Recall Arena
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Class-Calibrated Study Arena & Boss Raid
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Questions calibrated directly to your curriculum: Class 9, 10, 11, 12, or JEE/NEET.
              Every correct answer deals direct critical damage to the Procrastination Hydra!
            </p>
          </div>

          {/* Gamification Stats HUD */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-sm">
                L{boss.level}
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Level</div>
                <div className="text-xs font-bold text-teal-300 font-mono">{boss.xp} XP</div>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Coins</div>
                <div className="text-xs font-bold text-amber-300 font-mono">{boss.coins}</div>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-rose-400 fill-rose-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Max Combo</div>
                <div className="text-xs font-bold text-rose-300 font-mono">{boss.highestCombo}x</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class / Grade Selector Switcher (Crucial user request!) */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Curriculum Level:
            </h3>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              {selectedGrade} Selected
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeQuestions.length} Active Questions in Deck
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {GRADE_LIST.map(g => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                disabled={isPlaying}
                onClick={() => {
                  setSelectedGrade(g);
                  setQIndex(0);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-[0_3px_0_#0f766e] ring-2 ring-brand-400/50'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 disabled:opacity-50'
                }`}
              >
                <span>{g}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Arena Game (Left) & Boss Raid Health (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Speed Recall Game (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[500px]">
          {!isPlaying && !isGameOver ? (
            /* Lobby state */
            <div className="text-center py-8 space-y-5 my-auto">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Gamepad2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedGrade} Flashcard Blitz
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Answer rapid-fire academic questions in 45 seconds. Build combos to unlock 2x/3x multipliers
                  and strike down the Procrastination Hydra!
                </p>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleStartGame}
                    className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_5px_0_#0f766e] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    Start {selectedGrade} Challenge
                  </button>
                  <button
                    type="button"
                    onClick={handleRollNewQuestions}
                    className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
                    title="Generate newly randomized variables and shuffle questions"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                    <span>Roll New Questions</span>
                  </button>
                </div>

                {/* AI Dynamic NCERT Topic Generator */}
                <form
                  onSubmit={handleGenerateAIQuiz}
                  className="w-full max-w-md pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Bot className="w-4 h-4 text-brand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`Enter any ${selectedGrade} topic (e.g. Thermodynamics, Matrices)...`}
                      value={aiTopicInput}
                      onChange={e => setAiTopicInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!aiTopicInput.trim() || isGeneratingAIQuiz}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    {isGeneratingAIQuiz ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Quiz</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : isPlaying ? (
            /* Active Playing State */
            <div className="space-y-6">
              {/* Game HUD Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-brand-500 animate-spin" />
                  <span className={timeRemaining <= 10 ? 'text-rose-500 animate-pulse font-black text-base' : ''}>
                    {timeRemaining}s
                  </span>
                </div>

                {combo >= 2 && (
                  <div className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-400 text-xs font-black animate-pulse flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {combo}x COMBO! (2x PTS)
                  </div>
                )}

                <div className="font-mono text-sm font-black text-teal-600 dark:text-teal-400">
                  {score} PTS
                </div>
              </div>

              {/* Current Question */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${currentQuestion.subjectColor}20`,
                      color: currentQuestion.subjectColor
                    }}
                  >
                    {currentQuestion.subject} • {currentQuestion.grade}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Question {(qIndex % activeQuestions.length) + 1} of {activeQuestions.length}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  <MathFormula text={currentQuestion.question} />
                </h4>

                {/* Academic Power-Ups & Lifelines Bar */}
                <div className="flex items-center gap-2 pt-1 pb-2">
                  <button
                    type="button"
                    disabled={usedFiftyFifty || isAnswerRevealed}
                    onClick={handleFiftyFifty}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      usedFiftyFifty
                        ? 'opacity-30 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30'
                    }`}
                    title="Eliminate two incorrect choices"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>50/50 Lifeline</span>
                  </button>

                  <button
                    type="button"
                    disabled={usedFreeze || isAnswerRevealed}
                    onClick={handleTimeFreeze}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      usedFreeze
                        ? 'opacity-30 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/30'
                    }`}
                    title="Add +15 seconds to countdown"
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>+15s Freeze</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-500/30"
                    title="Show formula hint"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Concept Hint'}</span>
                  </button>

                  {floatingDamage && (
                    <span className="ml-auto text-xs font-black text-rose-500 animate-bounce">
                      {floatingDamage}
                    </span>
                  )}
                </div>

                {showHint && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
                    💡 <span className="font-bold">Key Hint:</span> Think about the fundamental laws of {currentQuestion.subject} for {currentQuestion.grade}.
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  const isEliminated = eliminatedIndices.includes(idx);

                  if (isEliminated) {
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs opacity-40 line-through"
                      >
                        <MathFormula text={opt} />
                      </div>
                    );
                  }

                  let btnStyle = 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500';

                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      btnStyle = 'bg-teal-500/20 border-teal-500 text-teal-600 dark:text-teal-300 ring-2 ring-teal-500/40 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 ring-2 ring-rose-500/40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => handleAnswerClick(idx)}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between shadow-sm ${btnStyle}`}
                    >
                      <MathFormula text={opt} />
                      {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 ml-2" />}
                      {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {isAnswerRevealed && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs animate-fade-in">
                  <span className="font-bold">Explanation: </span>
                  <MathFormula text={currentQuestion.explanation} />
                </div>
              )}
            </div>
          ) : (
            /* Game Over Summary */
            <div className="text-center py-6 space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Session Complete!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You earned <span className="font-bold text-teal-600 dark:text-teal-400">{score} Points</span> and achieved a{' '}
                <span className="font-bold text-rose-500">{maxSessionCombo}x Max Combo</span>.
              </p>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Boss Raid & Quest Log (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <Sword className="w-4 h-4" /> Daily Boss Raid
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                HP: {boss.bossHp} / {boss.bossMaxHp}
              </span>
            </div>

            {/* Boss Portrait Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-950/30 to-slate-950 border border-rose-900/40 text-center mb-4">
              <div className="text-5xl my-2">🐉</div>
              <h4 className="text-base font-black text-white">The Procrastination Hydra</h4>
              <p className="text-xs text-slate-400 mt-1">
                Gains power when you delay your syllabus. Subdue it by completing Pomodoro timers and Arena challenges!
              </p>

              {/* Debossed Boss Health Bar */}
              <div className="mt-4">
                <div className="h-4 w-full bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${bossHealthPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{bossHealthPercent}% Health Remaining</span>
                  <span>{boss.bossHp <= 0 ? '🎉 HYDRA DEFEATED!' : 'Active Raid'}</span>
                </div>
              </div>
            </div>

            {/* Quests & Achievements */}
            <div className="space-y-2 mt-4">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Academic Achievements
              </h5>

              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">First Blood</div>
                      <div className="text-[10px] text-slate-400">Answer your first Arena question</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Combo Master</div>
                      <div className="text-[10px] text-slate-400">Reach a 5x streak in any class</div>
                    </div>
                  </div>
                  {boss.highestCombo >= 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">{boss.highestCombo}/5</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Hydra Slayer</div>
                      <div className="text-[10px] text-slate-400">Defeat the daily procrastination boss</div>
                    </div>
                  </div>
                  {boss.bossHp <= 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">In Progress</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
