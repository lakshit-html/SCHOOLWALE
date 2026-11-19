export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'lecture' | 'practice' | 'reading' | 'assignment' | 'revision';
export type ChapterStatus = 'not_started' | 'in_progress' | 'completed' | 'revision';
export type Difficulty = 'easy' | 'moderate' | 'hard';
export type RevisionStatus = 'pending' | 'completed' | 'overdue';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type PomodoroMode = 'pomodoro' | 'short_break' | 'long_break';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetExam: string;
  grade: string;
  dailyTargetHours: number;
  preferredSlots: string[];
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  avatarSeed: string;
  joinedDate: string;
  hasCompletedOnboarding?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  targetScore?: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  totalLectures: number;
  completedLectures: number;
  status: ChapterStatus;
  priority: Priority;
  difficulty: Difficulty;
  notesCount: number;
  lastStudied?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  chapterId?: string;
  type: TaskType;
  estimatedMinutes: number;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO
  order: number;
}

export interface BacklogItem {
  id: string;
  subjectId: string;
  chapterTitle: string;
  lectureTitle: string;
  durationMinutes: number;
  priority: Priority;
  notesStatus: 'not_started' | 'in_progress' | 'done';
  assignmentStatus: 'pending' | 'submitted' | 'not_required';
  completed: boolean;
  completedAt?: string; // ISO
  addedDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface RevisionCycleRecord {
  cycle: number;
  date: string;
  confidence: ConfidenceLevel;
}

export interface RevisionItem {
  id: string;
  subjectId: string;
  chapterId: string;
  chapterTitle: string;
  cycle: number; // 1, 2, 3, 4, 5
  intervalDays: number; // e.g. 1, 3, 7, 14, 30
  scheduledDate: string; // YYYY-MM-DD
  status: RevisionStatus;
  confidenceLevel?: ConfidenceLevel;
  completedAt?: string; // ISO
  history: RevisionCycleRecord[];
}

export interface FocusSession {
  id: string;
  subjectId?: string;
  taskTitle?: string;
  durationMinutes: number;
  type: PomodoroMode;
  completedAt: string; // ISO
  rating?: 'productive' | 'flow' | 'distracted';
}

export interface Note {
  id: string;
  subjectId: string;
  chapterId?: string;
  title: string;
  content: string;
  pinned: boolean;
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
}

export interface MockTest {
  id: string;
  title: string;
  testDate: string; // YYYY-MM-DD
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  subjectScores: SubjectScore[];
  mistakesAnalysis: string;
  weakAreas: string[];
  actionPlan: string;
}

export interface AppData {
  profile: UserProfile;
  subjects: Subject[];
  chapters: Chapter[];
  tasks: StudyTask[];
  backlog: BacklogItem[];
  revisions: RevisionItem[];
  focusSessions: FocusSession[];
  notes: Note[];
  mockTests: MockTest[];
}
