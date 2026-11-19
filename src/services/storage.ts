import { AppData, UserProfile, Subject, GameProfile } from '../types';

const STORAGE_KEY = 'studyforge_app_data_v1';

export const INITIAL_GAME_PROFILE: GameProfile = {
  xp: 120,
  level: 1,
  coins: 40,
  bossHp: 750,
  bossMaxHp: 1000,
  highestCombo: 3,
  unlockedBadges: ['first_step'],
  gamesPlayed: 1
};

// Clean, fresh starter profile
export const FRESH_PROFILE: UserProfile = {
  id: 'usr-fresh',
  name: 'Student',
  email: '',
  targetExam: 'Competitive Exams / Boards',
  grade: 'Class 12',
  dailyTargetHours: 6,
  preferredSlots: ['Morning', 'Evening'],
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  theme: 'dark',
  soundEnabled: true,
  avatarSeed: 'Student',
  joinedDate: new Date().toISOString().split('T')[0],
  hasCompletedOnboarding: false
};

// Helpful clean starter subjects that any student can keep or customize
export const STARTER_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Physics', color: '#38bdf8', icon: 'Atom', targetScore: 90 },
  { id: 'sub-2', name: 'Chemistry', color: '#a855f7', icon: 'FlaskConical', targetScore: 85 },
  { id: 'sub-3', name: 'Mathematics', color: '#10b981', icon: 'Calculator', targetScore: 90 }
];

export const getInitialData = (): AppData => ({
  profile: { ...FRESH_PROFILE },
  subjects: STARTER_SUBJECTS.map(s => ({ ...s })),
  chapters: [],
  tasks: [],
  backlog: [],
  revisions: [],
  focusSessions: [],
  notes: [],
  mockTests: [],
  game: { ...INITIAL_GAME_PROFILE }
});

// Demo dataset for optional loading
export const getDemoShowcaseData = (): AppData => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return {
    profile: {
      ...FRESH_PROFILE,
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      targetExam: 'JEE Advanced / Boards',
      dailyTargetHours: 7,
      streak: 5,
      hasCompletedOnboarding: true
    },
    subjects: [
      { id: 'sub-phy', name: 'Physics', color: '#38bdf8', icon: 'Atom', targetScore: 90 },
      { id: 'sub-chem', name: 'Chemistry', color: '#a855f7', icon: 'FlaskConical', targetScore: 85 },
      { id: 'sub-math', name: 'Mathematics', color: '#10b981', icon: 'Calculator', targetScore: 95 }
    ],
    chapters: [
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
        lastStudied: yesterday
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
        lastStudied: yesterday
      }
    ],
    tasks: [
      {
        id: 'task-demo-1',
        title: 'Solve 20 Problem Sheet Questions on Moment of Inertia',
        subjectId: 'sub-phy',
        chapterId: 'ch-rot',
        type: 'practice',
        estimatedMinutes: 60,
        priority: 'high',
        dueDate: today,
        scheduledDate: today,
        completed: false,
        order: 1
      },
      {
        id: 'task-demo-2',
        title: 'Review Heat Engine Derivations',
        subjectId: 'sub-phy',
        chapterId: 'ch-thermo',
        type: 'revision',
        estimatedMinutes: 45,
        priority: 'medium',
        dueDate: tomorrow,
        scheduledDate: tomorrow,
        completed: false,
        order: 2
      }
    ],
    backlog: [
      {
        id: 'bl-demo-1',
        subjectId: 'sub-chem',
        chapterTitle: 'Chemical Kinetics',
        lectureTitle: 'Lec 04: Arrhenius Equation & Activation Energy',
        durationMinutes: 75,
        priority: 'critical',
        notesStatus: 'in_progress',
        assignmentStatus: 'pending',
        completed: false,
        addedDate: yesterday,
        notes: 'High weightage topic'
      }
    ],
    revisions: [
      {
        id: 'rev-demo-1',
        subjectId: 'sub-phy',
        chapterId: 'ch-thermo',
        chapterTitle: 'Thermodynamics & Heat Transfer',
        cycle: 2,
        intervalDays: 3,
        scheduledDate: today,
        status: 'pending',
        history: [{ cycle: 1, date: yesterday, confidence: 'medium' }]
      }
    ],
    focusSessions: [
      {
        id: 'fs-demo-1',
        subjectId: 'sub-phy',
        taskTitle: 'Moment of Inertia derivations',
        durationMinutes: 45,
        type: 'pomodoro',
        completedAt: `${today}T09:00:00.000Z`,
        rating: 'flow'
      }
    ],
    notes: [
      {
        id: 'note-demo-1',
        subjectId: 'sub-phy',
        chapterId: 'ch-rot',
        title: 'Parallel and Perpendicular Axes Theorems',
        content: `# Key Formulae\n\n1. **Parallel Axis Theorem**: $I = I_{cm} + Md^2$\n   - One axis must pass through Center of Mass!\n2. **Perpendicular Axis Theorem**: $I_z = I_x + I_y$\n   - Valid only for 2D laminar planar bodies.`,
        pinned: true,
        tags: ['Formula Sheet', 'High Yield'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    mockTests: [
      {
        id: 'mt-demo-1',
        title: 'Part Syllabus Test 01',
        testDate: yesterday,
        totalMarks: 300,
        obtainedMarks: 220,
        percentage: 73.33,
        subjectScores: [
          { subjectId: 'sub-phy', subjectName: 'Physics', marksObtained: 75, maxMarks: 100 },
          { subjectId: 'sub-chem', subjectName: 'Chemistry', marksObtained: 70, maxMarks: 100 },
          { subjectId: 'sub-math', subjectName: 'Mathematics', marksObtained: 75, maxMarks: 100 }
        ],
        mistakesAnalysis: 'Minor calculation error in stoichiometry. Improved speed in calculus.',
        weakAreas: ['Calculation speed'],
        actionPlan: 'Practice with timed questions.'
      }
    ]
  };
};

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
      const initial = getInitialData();
      return {
        profile: { ...initial.profile, ...parsed.profile },
        subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : initial.subjects,
        chapters: parsed.chapters || [],
        tasks: parsed.tasks || [],
        backlog: parsed.backlog || [],
        revisions: parsed.revisions || [],
        focusSessions: parsed.focusSessions || [],
        notes: parsed.notes || [],
        mockTests: parsed.mockTests || [],
        game: parsed.game ? { ...initial.game, ...parsed.game } : initial.game
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
      console.warn('LocalStorage quota reached, pruning large file payloads for offline safety:', e);
      try {
        const lightweightData = {
          ...data,
          notes: data.notes.map(n => ({
            ...n,
            attachments: n.attachments?.map(a => ({
              ...a,
              dataUrl: a.dataUrl.length > 200000 ? '' : a.dataUrl
            }))
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightData));
      } catch (inner) {
        console.error('Storage fallback failed:', inner);
      }
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
    const fresh = getInitialData();
    this.saveData(fresh);
    return fresh;
  },

  loadDemoShowcase(): AppData {
    const demo = getDemoShowcaseData();
    this.saveData(demo);
    return demo;
  },

  clearAllData(): AppData {
    const blank: AppData = {
      profile: {
        ...FRESH_PROFILE,
        name: 'Student',
        email: '',
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        hasCompletedOnboarding: true
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
