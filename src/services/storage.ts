import { AppData, UserProfile, Subject, Chapter, StudyTask, BacklogItem, RevisionItem, FocusSession, Note, MockTest } from '../types';

const STORAGE_KEY = 'studyforge_app_data_v1';

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Aarav Sharma',
  email: 'aarav.study@example.com',
  targetExam: 'JEE Advanced / Boards',
  grade: 'Class 12',
  dailyTargetHours: 7,
  preferredSlots: ['Morning (6:00 - 9:00)', 'Evening (17:00 - 20:00)', 'Night (21:30 - 23:30)'],
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  theme: 'dark',
  soundEnabled: true,
  avatarSeed: 'Aarav',
  joinedDate: '2024-08-15'
};

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-phy', name: 'Physics', color: '#38bdf8', icon: 'Atom', targetScore: 90 },
  { id: 'sub-chem', name: 'Chemistry', color: '#a855f7', icon: 'FlaskConical', targetScore: 85 },
  { id: 'sub-math', name: 'Mathematics', color: '#10b981', icon: 'Calculator', targetScore: 95 }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'ch-rot',
    subjectId: 'sub-phy',
    title: 'Rotational Dynamics & Torque',
    totalLectures: 10,
    completedLectures: 7,
    status: 'in_progress',
    priority: 'high',
    difficulty: 'hard',
    notesCount: 4,
    lastStudied: '2024-11-18'
  },
  {
    id: 'ch-thermo',
    subjectId: 'sub-phy',
    title: 'Thermodynamics & Heat Transfer',
    totalLectures: 8,
    completedLectures: 8,
    status: 'completed',
    priority: 'medium',
    difficulty: 'moderate',
    notesCount: 3,
    lastStudied: '2024-11-15'
  },
  {
    id: 'ch-organic',
    subjectId: 'sub-chem',
    title: 'Aldehydes, Ketones & Carboxylic Acids',
    totalLectures: 12,
    completedLectures: 5,
    status: 'in_progress',
    priority: 'critical',
    difficulty: 'hard',
    notesCount: 2,
    lastStudied: '2024-11-17'
  },
  {
    id: 'ch-calc',
    subjectId: 'sub-math',
    title: 'Definite Integration & Area Under Curves',
    totalLectures: 14,
    completedLectures: 11,
    status: 'in_progress',
    priority: 'high',
    difficulty: 'hard',
    notesCount: 5,
    lastStudied: '2024-11-19'
  }
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Solve 25 PYQs on Moment of Inertia',
    subjectId: 'sub-phy',
    chapterId: 'ch-rot',
    type: 'practice',
    estimatedMinutes: 60,
    priority: 'high',
    dueDate: today,
    scheduledDate: today,
    completed: true,
    completedAt: `${today}T10:30:00.000Z`,
    order: 1
  },
  {
    id: 'task-2',
    title: 'Watch Lecture 6: Cannizzaro & Aldol Condensation',
    subjectId: 'sub-chem',
    chapterId: 'ch-organic',
    type: 'lecture',
    estimatedMinutes: 90,
    priority: 'critical',
    dueDate: today,
    scheduledDate: today,
    completed: false,
    order: 2
  },
  {
    id: 'task-3',
    title: 'Integration by Parts - Advanced Problem Set',
    subjectId: 'sub-math',
    chapterId: 'ch-calc',
    type: 'practice',
    estimatedMinutes: 75,
    priority: 'high',
    dueDate: today,
    scheduledDate: today,
    completed: false,
    order: 3
  },
  {
    id: 'task-4',
    title: 'Quick Revision of Carnots Engine & Entropy',
    subjectId: 'sub-phy',
    chapterId: 'ch-thermo',
    type: 'revision',
    estimatedMinutes: 45,
    priority: 'medium',
    dueDate: tomorrow,
    scheduledDate: tomorrow,
    completed: false,
    order: 4
  }
];

export const INITIAL_BACKLOG: BacklogItem[] = [
  {
    id: 'bl-1',
    subjectId: 'sub-chem',
    chapterTitle: 'Aldehydes & Ketones',
    lectureTitle: 'Lec 04: Nucleophilic Addition Mechanism',
    durationMinutes: 85,
    priority: 'critical',
    notesStatus: 'in_progress',
    assignmentStatus: 'pending',
    completed: false,
    addedDate: '2024-11-12',
    notes: 'Crucial for upcoming mock test'
  },
  {
    id: 'bl-2',
    subjectId: 'sub-phy',
    chapterTitle: 'Rotational Motion',
    lectureTitle: 'Lec 08: Angular Momentum Conservation & Collisions',
    durationMinutes: 95,
    priority: 'high',
    notesStatus: 'not_started',
    assignmentStatus: 'pending',
    completed: false,
    addedDate: '2024-11-14',
    notes: 'Complex derivation included'
  },
  {
    id: 'bl-3',
    subjectId: 'sub-math',
    chapterTitle: 'Definite Integration',
    lectureTitle: 'Lec 12: Leibnitz Rule and Limit of a Sum',
    durationMinutes: 60,
    priority: 'medium',
    notesStatus: 'done',
    assignmentStatus: 'submitted',
    completed: true,
    completedAt: `${yesterday}T16:00:00.000Z`,
    addedDate: '2024-11-10',
    notes: 'Cleared during weekend push'
  }
];

export const INITIAL_REVISIONS: RevisionItem[] = [
  {
    id: 'rev-1',
    subjectId: 'sub-phy',
    chapterId: 'ch-thermo',
    chapterTitle: 'Thermodynamics & Heat Transfer',
    cycle: 3,
    intervalDays: 7,
    scheduledDate: today,
    status: 'pending',
    history: [
      { cycle: 1, date: '2024-11-08', confidence: 'medium' },
      { cycle: 2, date: '2024-11-11', confidence: 'high' }
    ]
  },
  {
    id: 'rev-2',
    subjectId: 'sub-math',
    chapterId: 'ch-calc',
    chapterTitle: 'Definite Integration & Area Under Curves',
    cycle: 1,
    intervalDays: 1,
    scheduledDate: yesterday,
    status: 'overdue',
    history: []
  },
  {
    id: 'rev-3',
    subjectId: 'sub-chem',
    chapterId: 'ch-organic',
    chapterTitle: 'Aldehydes, Ketones & Carboxylic Acids',
    cycle: 2,
    intervalDays: 3,
    scheduledDate: tomorrow,
    status: 'pending',
    history: [
      { cycle: 1, date: '2024-11-16', confidence: 'medium' }
    ]
  }
];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'fs-1',
    subjectId: 'sub-phy',
    taskTitle: 'Moment of Inertia derivations',
    durationMinutes: 50,
    type: 'pomodoro',
    completedAt: `${today}T07:30:00.000Z`,
    rating: 'flow'
  },
  {
    id: 'fs-2',
    subjectId: 'sub-phy',
    taskTitle: 'Moment of Inertia PYQs',
    durationMinutes: 45,
    type: 'pomodoro',
    completedAt: `${today}T09:00:00.000Z`,
    rating: 'productive'
  },
  {
    id: 'fs-3',
    subjectId: 'sub-math',
    taskTitle: 'Integration standard substitutions',
    durationMinutes: 50,
    type: 'pomodoro',
    completedAt: `${yesterday}T15:20:00.000Z`,
    rating: 'productive'
  },
  {
    id: 'fs-4',
    subjectId: 'sub-chem',
    taskTitle: 'Named Reactions Flashcards',
    durationMinutes: 30,
    type: 'pomodoro',
    completedAt: `${yesterday}T18:00:00.000Z`,
    rating: 'flow'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    subjectId: 'sub-phy',
    chapterId: 'ch-rot',
    title: 'Parallel and Perpendicular Axes Theorems',
    content: `# Key Formulae & Traps\n\n1. **Parallel Axis Theorem**: $I = I_{cm} + Md^2$\n   - *Condition*: One axis must pass through the Center of Mass!\n2. **Perpendicular Axis Theorem**: $I_z = I_x + I_y$\n   - *Condition*: Applicable ONLY for 2D laminar planar bodies.\n\n### Common Mistake:\nDo not apply perpendicular axis theorem on solid cylinders or spheres!`,
    pinned: true,
    tags: ['Formula Sheet', 'High Yield'],
    createdAt: '2024-11-15T10:00:00.000Z',
    updatedAt: '2024-11-18T14:20:00.000Z'
  },
  {
    id: 'note-2',
    subjectId: 'sub-chem',
    chapterId: 'ch-organic',
    title: 'Aldol vs Cannizzaro Reaction Conditions',
    content: `## Reagent Checklist:\n- **Aldol Condensation**: Requires $\\alpha$-hydrogen and dilute base (e.g. 10% NaOH).\n- **Cannizzaro Reaction**: For aldehydes with NO $\\alpha$-hydrogen using concentrated alkali (50% KOH).\n- **Cross Aldol**: Always control concentration to prevent multiple side products!`,
    pinned: true,
    tags: ['Mechanisms', 'Exceptions'],
    createdAt: '2024-11-16T12:00:00.000Z',
    updatedAt: '2024-11-17T09:15:00.000Z'
  }
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'mt-1',
    title: 'All India Test Series - Part Test 03',
    testDate: '2024-11-10',
    totalMarks: 300,
    obtainedMarks: 218,
    percentage: 72.67,
    subjectScores: [
      { subjectId: 'sub-phy', subjectName: 'Physics', marksObtained: 74, maxMarks: 100 },
      { subjectId: 'sub-chem', subjectName: 'Chemistry', marksObtained: 68, maxMarks: 100 },
      { subjectId: 'sub-math', subjectName: 'Mathematics', marksObtained: 76, maxMarks: 100 }
    ],
    mistakesAnalysis: '3 silly calculation errors in chemistry stoichiometry. Left 2 easy calculus questions due to slow time management.',
    weakAreas: ['Organic reaction mechanisms', 'Moment of inertia integration tricks'],
    actionPlan: 'Dedicate 1 extra hour daily to high-speed numericals with a timer.'
  },
  {
    id: 'mt-2',
    title: 'Weekly Revision Mock - Physics & Maths',
    testDate: '2024-11-17',
    totalMarks: 200,
    obtainedMarks: 162,
    percentage: 81.0,
    subjectScores: [
      { subjectId: 'sub-phy', subjectName: 'Physics', marksObtained: 80, maxMarks: 100 },
      { subjectId: 'sub-math', subjectName: 'Mathematics', marksObtained: 82, maxMarks: 100 }
    ],
    mistakesAnalysis: 'Significant improvement in calculation accuracy. One sign error in torque equilibrium.',
    weakAreas: ['Torque with rolling friction'],
    actionPlan: 'Review rotational rolling dynamics notes and 10 advanced problems.'
  }
];

export const getInitialData = (): AppData => ({
  profile: { ...INITIAL_PROFILE },
  subjects: INITIAL_SUBJECTS.map(s => ({ ...s })),
  chapters: INITIAL_CHAPTERS.map(c => ({ ...c })),
  tasks: INITIAL_TASKS.map(t => ({ ...t })),
  backlog: INITIAL_BACKLOG.map(b => ({ ...b })),
  revisions: INITIAL_REVISIONS.map(r => ({ ...r, history: [...r.history] })),
  focusSessions: INITIAL_FOCUS_SESSIONS.map(f => ({ ...f })),
  notes: INITIAL_NOTES.map(n => ({ ...n, tags: [...n.tags] })),
  mockTests: INITIAL_MOCK_TESTS.map(m => ({
    ...m,
    subjectScores: m.subjectScores.map(s => ({ ...s })),
    weakAreas: [...m.weakAreas]
  }))
});

export const StorageService = {
  loadData(): AppData {
    if (typeof window === 'undefined') return getInitialData();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const initial = getInitialData();
        this.saveData(initial);
        return initial;
      }
      const parsed = JSON.parse(stored) as Partial<AppData>;
      // Ensure schema completeness
      const initial = getInitialData();
      return {
        profile: { ...initial.profile, ...parsed.profile },
        subjects: parsed.subjects || initial.subjects,
        chapters: parsed.chapters || initial.chapters,
        tasks: parsed.tasks || initial.tasks,
        backlog: parsed.backlog || initial.backlog,
        revisions: parsed.revisions || initial.revisions,
        focusSessions: parsed.focusSessions || initial.focusSessions,
        notes: parsed.notes || initial.notes,
        mockTests: parsed.mockTests || initial.mockTests
      };
    } catch (e) {
      console.error('Failed to parse stored StudyForge data:', e);
      return getInitialData();
    }
  },

  saveData(data: AppData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save StudyForge data to localStorage:', e);
    }
  },

  exportDataJson(data: AppData): string {
    return JSON.stringify(data, null, 2);
  },

  importDataJson(jsonString: string): AppData {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !parsed.profile) {
      throw new Error('Invalid StudyForge backup JSON file format.');
    }
    this.saveData(parsed as AppData);
    return parsed as AppData;
  },

  resetToDefault(): AppData {
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  },

  clearAllData(): AppData {
    const blank: AppData = {
      profile: {
        ...INITIAL_PROFILE,
        name: 'New Student',
        email: '',
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
      },
      subjects: [],
      chapters: [],
      tasks: [],
      backlog: [],
      revisions: [],
      focusSessions: [],
      notes: [],
      mockTests: []
    };
    this.saveData(blank);
    return blank;
  }
};
