// Dynamic Quiz Generator: Procedural & AI-powered real-time quiz creation

import { geminiService } from './gemini';

export interface ArenaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

// Random integer generator [min, max]
const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fisher-Yates array shuffle (immutable)
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Dynamic algorithmic procedural question generators
export const generateProceduralQuestions = (
  _classLevel: string,
  count: number = 5
): ArenaQuestion[] => {
  const generated: ArenaQuestion[] = [];

  // Generator 1: Kinematics (v = u + at, s = ut + 1/2 at^2)
  const u1 = randInt(0, 15);
  const a1 = randInt(2, 6);
  const t1 = randInt(2, 8);
  const v1 = u1 + a1 * t1;
  generated.push({
    id: `dyn-kin-${Date.now()}-${Math.random()}`,
    question: `A particle starts with an initial velocity of $u = ${u1}\\text{ m/s}$ and accelerates uniformly at $a = ${a1}\\text{ m/s}^2$ for $t = ${t1}\\text{ s}$. What is its final velocity $v$?`,
    options: [
      `$${v1}\\text{ m/s}$`,
      `$${v1 + randInt(3, 8)}\\text{ m/s}$`,
      `$${Math.max(1, v1 - randInt(2, 6))}\\text{ m/s}$`,
      `$${v1 + randInt(10, 16)}\\text{ m/s}$`
    ],
    correctAnswer: 0,
    explanation: `Using the first equation of motion: $v = u + at = ${u1} + (${a1})(${t1}) = ${v1}\\text{ m/s}$.`,
    subject: 'Physics',
    difficulty: 'easy',
    topic: 'Motion in a Straight Line'
  });

  // Generator 2: Ohm's Law & Power (V = IR, P = V^2 / R)
  const v2 = randInt(10, 50) * 2;
  const r2 = randInt(2, 10);
  const i2 = v2 / r2;
  const p2 = v2 * i2;
  generated.push({
    id: `dyn-ohm-${Date.now()}-${Math.random()}`,
    question: `A resistor of resistance $R = ${r2}\\,\\Omega$ is connected across a potential difference of $V = ${v2}\\text{ V}$. Calculate the electrical power dissipated.`,
    options: [
      `$${p2}\\text{ W}$`,
      `$${p2 + randInt(20, 50)}\\text{ W}$`,
      `$${Math.max(10, p2 - randInt(15, 40))}\\text{ W}$`,
      `$${Math.round(p2 * 1.5)}\\text{ W}$`
    ],
    correctAnswer: 0,
    explanation: `Power dissipated is given by $P = \\frac{V^2}{R} = \\frac{${v2}^2}{${r2}} = ${p2}\\text{ W}$.`,
    subject: 'Physics',
    difficulty: 'medium',
    topic: 'Current Electricity'
  });

  // Generator 3: Mole Concept (n = mass / molar mass)
  const moles = randInt(2, 6);
  const molarMassH2O = 18;
  const massH2O = moles * molarMassH2O;
  generated.push({
    id: `dyn-mole-${Date.now()}-${Math.random()}`,
    question: `How many moles of water ($\\text{H}_2\\text{O}$, molar mass $= 18\\text{ g/mol}$) are present in $${massH2O}\\text{ g}$ of pure water?`,
    options: [
      `$${moles}\\text{ moles}$`,
      `$${moles + 1}\\text{ moles}$`,
      `$${Math.max(1, moles - 1)}\\text{ moles}$`,
      `$${moles * 2}\\text{ moles}$`
    ],
    correctAnswer: 0,
    explanation: `Number of moles $n = \\frac{\\text{Given mass}}{\\text{Molar mass}} = \\frac{${massH2O}}{18} = ${moles}\\text{ moles}$.`,
    subject: 'Chemistry',
    difficulty: 'easy',
    topic: 'Some Basic Concepts of Chemistry'
  });

  // Generator 4: Matrix Determinant 2x2
  const a = randInt(1, 5);
  const b = randInt(1, 4);
  const c = randInt(1, 4);
  const d = randInt(1, 6);
  const det = a * d - b * c;
  generated.push({
    id: `dyn-mat-${Date.now()}-${Math.random()}`,
    question: `Evaluate the determinant of the $2 \\times 2$ matrix: $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$.`,
    options: [
      `$${det}$`,
      `$${det + randInt(2, 5)}$`,
      `$${det - randInt(2, 6)}$`,
      `$${-det}$`
    ],
    correctAnswer: 0,
    explanation: `For a $2 \\times 2$ matrix, $|A| = ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}$.`,
    subject: 'Mathematics',
    difficulty: 'easy',
    topic: 'Determinants'
  });

  // Generator 5: Work Done by Spring (U = 1/2 k x^2)
  const kSpring = randInt(100, 500);
  const xSpringCm = randInt(2, 10);
  const xSpringM = xSpringCm / 100;
  const energyJ = 0.5 * kSpring * Math.pow(xSpringM, 2);
  generated.push({
    id: `dyn-spring-${Date.now()}-${Math.random()}`,
    question: `A spring of spring constant $k = ${kSpring}\\text{ N/m}$ is compressed by $x = ${xSpringCm}\\text{ cm}$. Find the elastic potential energy stored in the spring.`,
    options: [
      `$${energyJ.toFixed(3)}\\text{ J}$`,
      `$${(energyJ * 1.5).toFixed(3)}\\text{ J}$`,
      `$${(energyJ * 0.5).toFixed(3)}\\text{ J}$`,
      `$${(energyJ + 0.25).toFixed(3)}\\text{ J}$`
    ],
    correctAnswer: 0,
    explanation: `Convert compression to meters: $x = ${xSpringCm}\\text{ cm} = ${xSpringM}\\text{ m}$. Potential energy $U = \\frac{1}{2} k x^2 = 0.5 \\times ${kSpring} \\times (${xSpringM})^2 = ${energyJ.toFixed(3)}\\text{ J}$.`,
    subject: 'Physics',
    difficulty: 'medium',
    topic: 'Work, Energy and Power'
  });

  // Generator 6: Half-life first-order reaction (N = N0 * (1/2)^n)
  const tHalf = randInt(10, 30);
  const numHalfLives = randInt(2, 4);
  const totalTime = tHalf * numHalfLives;
  const remainingPercent = Math.pow(0.5, numHalfLives) * 100;
  generated.push({
    id: `dyn-kinet-${Date.now()}-${Math.random()}`,
    question: `A radioactive sample has a half-life of $t_{1/2} = ${tHalf}\\text{ minutes}$. What percentage of the initial substance remains after $${totalTime}\\text{ minutes}$?`,
    options: [
      `$${remainingPercent}\\%$`,
      `$${remainingPercent / 2}\\%$`,
      `$${remainingPercent * 2}\\%$`,
      `$${100 - remainingPercent}\\%$`
    ],
    correctAnswer: 0,
    explanation: `Number of half-lives $n = \\frac{${totalTime}}{${tHalf}} = ${numHalfLives}$. Remaining amount $= \\left(\\frac{1}{2}\\right)^${numHalfLives} \\times 100\\% = ${remainingPercent}\\%$.`,
    subject: 'Chemistry',
    difficulty: 'medium',
    topic: 'Chemical Kinetics'
  });

  // Randomize choices for each question so correctAnswer is not always index 0
  const shuffledQuestions = generated.map(q => {
    const indices = [0, 1, 2, 3];
    const shuffledIndices = shuffleArray(indices);
    const newOptions = shuffledIndices.map(idx => q.options[idx]);
    const newCorrect = shuffledIndices.indexOf(0);
    return {
      ...q,
      options: newOptions,
      correctAnswer: newCorrect
    };
  });

  return shuffleArray(shuffledQuestions).slice(0, count);
};

// AI-powered dynamic question generation on any custom NCERT topic
export const generateAIQuiz = async (
  topic: string,
  classLevel: string = 'Class 12',
  count: number = 5
): Promise<ArenaQuestion[]> => {
  const prompt = `Generate exactly ${count} multiple-choice academic quiz questions for ${classLevel} students on the topic: "${topic}".
Output ONLY valid JSON in this exact structure with no surrounding markdown codeblocks:
[
  {
    "question": "Question text using LaTeX math like $x^2$ or $\\\\frac{a}{b}$ where appropriate",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Clear step-by-step conceptual or numerical solution",
    "subject": "Physics",
    "difficulty": "medium",
    "topic": "${topic}"
  }
]`;

  try {
    const response = await geminiService.askAI(prompt);
    // Extract JSON block from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ArenaQuestion[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, idx) => ({
          ...q,
          id: `ai-gen-${Date.now()}-${idx}`
        }));
      }
    }
  } catch (err) {
    console.warn('AI Quiz Generation failed, falling back to procedural questions:', err);
  }

  // Fallback to dynamic procedural questions if offline or failed
  return generateProceduralQuestions(classLevel, count);
};
