import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppData,
  UserProfile,
  Subject,
  Chapter,
  StudyTask,
  BacklogItem,
  RevisionItem,
  FocusSession,
  Note,
  MockTest,
  ConfidenceLevel
} from '../types';
import { StorageService } from '../services/storage';
import { autoScheduleTasks } from '../services/scheduler';
import { soundEffects } from '../services/audio';
import { fireConfetti } from '../utils/confetti';

export type NavigationTab =
  | 'dashboard'
  | 'planner'
  | 'backlog'
  | 'revision'
  | 'pomodoro'
  | 'arena'
  | 'whiteboard'
  | 'ncert'
  | 'notes'
  | 'tests'
  | 'analytics'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export interface WhiteboardNote {
  title: string;
  bookTitle?: string;
  chapterNumber?: number;
  formulas: string[];
  points: string[];
}

interface AppContextValue {
  data: AppData;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Subjects & Chapters
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addChapter: (chapter: Omit<Chapter, 'id'>) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;

  // Tasks & Planner
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  autoRescheduleAll: () => void;

  // Backlog
  addBacklogItem: (item: Omit<BacklogItem, 'id' | 'completed' | 'addedDate'>) => void;
  updateBacklogItem: (id: string, updates: Partial<BacklogItem>) => void;
  toggleBacklogCompleted: (id: string) => void;
  deleteBacklogItem: (id: string) => void;

  // Revisions
  addRevisionItem: (item: Omit<RevisionItem, 'id' | 'status' | 'history'>) => void;
  completeRevisionCycle: (id: string, confidence: ConfidenceLevel) => void;
  deleteRevisionItem: (id: string) => void;

  // Focus Sessions
  logFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  togglePinNote: (id: string) => void;
  deleteNote: (id: string) => void;

  // Mock Tests
  addMockTest: (test: Omit<MockTest, 'id' | 'percentage'>) => void;
  updateMockTest: (id: string, updates: Partial<MockTest>) => void;
  deleteMockTest: (id: string) => void;

  // Gamification
  addXp: (amount: number, coins?: number) => void;
  damageBoss: (dmg: number) => void;
  recordGameResult: (score: number, maxCombo: number) => void;

  // Backup & Reset
  exportBackup: () => void;
  importBackup: (jsonContent: string) => void;
  resetDefaultData: () => void;
  loadDemoShowcase: () => void;
  clearAllData: () => void;

  // Whiteboard Active Annotations
  whiteboardNote: WhiteboardNote | null;
  setWhiteboardNote: (note: WhiteboardNote | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => StorageService.loadData());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [whiteboardNote, setWhiteboardNote] = useState<WhiteboardNote | null>(null);

  // Persist whenever state changes
  useEffect(() => {
    StorageService.saveData(data);
  }, [data]);

  // Apply dark/light theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (data.profile.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [data.profile.theme]);

  // Toast helper
  const showToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Streak verification helper
  const recordActivityForStreak = (prevData: AppData): UserProfile => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = prevData.profile.lastActiveDate;
    if (lastActive === today) {
      return prevData.profile;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = prevData.profile.streak;

    if (lastActive === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1; // Streak reset if gap was >1 day
    }

    return {
      ...prevData.profile,
      streak: newStreak,
      lastActiveDate: today
    };
  };

  // Profile operations
  const updateProfile = (updates: Partial<UserProfile>) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
    showToast('Profile updated successfully', 'success');
  };

  // Subject operations
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: `sub-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
    showToast(`Subject "${newSubject.name}" created`, 'success');
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
    showToast('Subject updated', 'success');
  };

  const deleteSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      chapters: prev.chapters.filter(c => c.subjectId !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id)
    }));
    showToast('Subject deleted', 'info');
  };

  // Chapter operations
  const addChapter = (chapter: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: `ch-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
    showToast(`Chapter "${newChapter.title}" added`, 'success');
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setData(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => (c.id === id ? { ...c, ...updates } : c))
    }));
    showToast('Chapter updated', 'success');
  };

  const deleteChapter = (id: string) => {
    setData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(c => c.id !== id),
      tasks: prev.tasks.filter(t => t.chapterId !== id)
    }));
    showToast('Chapter deleted', 'info');
  };

  // Task operations
  const addTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
      order: task.order ?? data.tasks.length + 1
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    showToast('Task added to study schedule', 'success');
  };

  const updateTask = (id: string, updates: Partial<StudyTask>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, ...updates } : t))
    }));
    showToast('Task updated', 'success');
  };

  const toggleTaskCompleted = (id: string) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;

      const isNowCompleted = !task.completed;
      const updatedProfile = isNowCompleted ? recordActivityForStreak(prev) : prev.profile;

      if (isNowCompleted) {
        if (prev.profile.soundEnabled) soundEffects.playCompletionBeep();
        fireConfetti();
        showToast(`Task completed! +${task.estimatedMinutes}m logged (+50 XP)`, 'success');
      }

      const currentGame = prev.game || {
        xp: 0,
        level: 1,
        coins: 0,
        bossHp: 1000,
        bossMaxHp: 1000,
        highestCombo: 0,
        unlockedBadges: [],
        gamesPlayed: 0
      };

      const updatedGame = isNowCompleted
        ? {
            ...currentGame,
            xp: currentGame.xp + 50,
            bossHp: Math.max(0, currentGame.bossHp - 150),
            coins: currentGame.coins + 15
          }
        : currentGame;

      return {
        ...prev,
        profile: updatedProfile,
        game: updatedGame,
        tasks: prev.tasks.map(t =>
          t.id === id
            ? {
              ...t,
              completed: isNowCompleted,
              completedAt: isNowCompleted ? new Date().toISOString() : undefined
            }
            : t
        )
      };
    });
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
    showToast('Task removed', 'info');
  };

  const autoRescheduleAll = () => {
    const { dailyPlans, rescheduledCount } = autoScheduleTasks(
      data.tasks,
      data.profile.dailyTargetHours
    );

    // Update tasks with their scheduled dates
    const updatedTasks = data.tasks.map(t => {
      for (const date in dailyPlans) {
        if (dailyPlans[date].tasks.some(pt => pt.id === t.id)) {
          return { ...t, scheduledDate: date };
        }
      }
      return t;
    });

    setData(prev => ({
      ...prev,
      tasks: updatedTasks
    }));

    showToast(`Auto-scheduler balanced ${rescheduledCount} tasks across days!`, 'success');
  };

  // Backlog operations
  const addBacklogItem = (item: Omit<BacklogItem, 'id' | 'completed' | 'addedDate'>) => {
    const newItem: BacklogItem = {
      ...item,
      id: `bl-${Date.now()}`,
      completed: false,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      backlog: [newItem, ...prev.backlog]
    }));
    showToast('Backlog item logged', 'success');
  };

  const updateBacklogItem = (id: string, updates: Partial<BacklogItem>) => {
    setData(prev => ({
      ...prev,
      backlog: prev.backlog.map(b => (b.id === id ? { ...b, ...updates } : b))
    }));
    showToast('Backlog updated', 'success');
  };

  const toggleBacklogCompleted = (id: string) => {
    setData(prev => {
      const item = prev.backlog.find(b => b.id === id);
      if (!item) return prev;

      const isNowCompleted = !item.completed;
      const updatedProfile = isNowCompleted ? recordActivityForStreak(prev) : prev.profile;

      if (isNowCompleted) {
        if (prev.profile.soundEnabled) soundEffects.playCompletionBeep();
        fireConfetti();
        showToast(`Backlog cleared: "${item.lectureTitle}"!`, 'success');
      }

      return {
        ...prev,
        profile: updatedProfile,
        backlog: prev.backlog.map(b =>
          b.id === id
            ? {
              ...b,
              completed: isNowCompleted,
              completedAt: isNowCompleted ? new Date().toISOString() : undefined
            }
            : b
        )
      };
    });
  };

  const deleteBacklogItem = (id: string) => {
    setData(prev => ({
      ...prev,
      backlog: prev.backlog.filter(b => b.id !== id)
    }));
    showToast('Backlog item deleted', 'info');
  };

  // Revision operations
  const addRevisionItem = (item: Omit<RevisionItem, 'id' | 'status' | 'history'>) => {
    const newItem: RevisionItem = {
      ...item,
      id: `rev-${Date.now()}`,
      status: 'pending',
      history: []
    };
    setData(prev => ({
      ...prev,
      revisions: [newItem, ...prev.revisions]
    }));
    showToast(`Revision scheduled for ${newItem.scheduledDate}`, 'success');
  };

  const completeRevisionCycle = (id: string, confidence: ConfidenceLevel) => {
    setData(prev => {
      const rev = prev.revisions.find(r => r.id === id);
      if (!rev) return prev;

      const today = new Date().toISOString().split('T')[0];
      const nextCycle = rev.cycle + 1;

      // Intervals in days based on spaced repetition: Cycle 1=1d, Cycle 2=3d, Cycle 3=7d, Cycle 4=14d, Cycle 5=30d
      const intervalMap: Record<number, number> = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
      let nextInterval = intervalMap[nextCycle] || 30;

      // Adjust based on student confidence
      if (confidence === 'low') {
        nextInterval = Math.max(1, Math.round(nextInterval * 0.5));
      } else if (confidence === 'high') {
        nextInterval = Math.round(nextInterval * 1.3);
      }

      const nextScheduled = new Date(Date.now() + nextInterval * 86400000)
        .toISOString()
        .split('T')[0];

      if (prev.profile.soundEnabled) soundEffects.playCompletionBeep();
      fireConfetti();
      showToast(`Revision cycle ${rev.cycle} complete! Next in ${nextInterval} days.`, 'success');

      const updatedHistory = [
        ...rev.history,
        { cycle: rev.cycle, date: today, confidence }
      ];

      return {
        ...prev,
        profile: recordActivityForStreak(prev),
        revisions: prev.revisions.map(r =>
          r.id === id
            ? {
              ...r,
              cycle: nextCycle,
              intervalDays: nextInterval,
              scheduledDate: nextScheduled,
              status: 'pending',
              confidenceLevel: confidence,
              completedAt: new Date().toISOString(),
              history: updatedHistory
            }
            : r
        )
      };
    });
  };

  const deleteRevisionItem = (id: string) => {
    setData(prev => ({
      ...prev,
      revisions: prev.revisions.filter(r => r.id !== id)
    }));
    showToast('Revision reminder deleted', 'info');
  };

  // Focus Session logging
  const logFocusSession = (session: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const newSession: FocusSession = {
      ...session,
      id: `fs-${Date.now()}`,
      completedAt: new Date().toISOString()
    };

    setData(prev => {
      const currentGame = prev.game || {
        xp: 0,
        level: 1,
        coins: 0,
        bossHp: 1000,
        bossMaxHp: 1000,
        highestCombo: 0,
        unlockedBadges: [],
        gamesPlayed: 0
      };

      const updatedGame = {
        ...currentGame,
        xp: currentGame.xp + 100,
        bossHp: Math.max(0, currentGame.bossHp - 300),
        coins: currentGame.coins + 25
      };

      return {
        ...prev,
        profile: recordActivityForStreak(prev),
        game: updatedGame,
        focusSessions: [newSession, ...prev.focusSessions]
      };
    });

    if (data.profile.soundEnabled) soundEffects.playSessionEndAlarm();
    fireConfetti();
    showToast(`Focus session logged: ${session.durationMinutes} mins (+100 XP, 300 Boss DMG!)`, 'success');
  };

  // Gamification operations
  const addXp = (amount: number, coins: number = 10) => {
    setData(prev => {
      const currentGame = prev.game || {
        xp: 0,
        level: 1,
        coins: 0,
        bossHp: 1000,
        bossMaxHp: 1000,
        highestCombo: 0,
        unlockedBadges: [],
        gamesPlayed: 0
      };

      const newXp = currentGame.xp + amount;
      const newLevel = Math.floor(newXp / 250) + 1;
      const leveledUp = newLevel > currentGame.level;

      if (leveledUp) {
        showToast(`🎉 Level Up! You reached Level ${newLevel}!`, 'success');
        fireConfetti();
      }

      return {
        ...prev,
        game: {
          ...currentGame,
          xp: newXp,
          level: newLevel,
          coins: currentGame.coins + coins
        }
      };
    });
  };

  const damageBoss = (dmg: number) => {
    setData(prev => {
      const currentGame = prev.game || {
        xp: 0,
        level: 1,
        coins: 0,
        bossHp: 1000,
        bossMaxHp: 1000,
        highestCombo: 0,
        unlockedBadges: [],
        gamesPlayed: 0
      };

      const newHp = Math.max(0, currentGame.bossHp - dmg);
      if (newHp === 0 && currentGame.bossHp > 0) {
        showToast('⚔️ Backlog Beast Defeated! +200 Bonus XP & Victory Badge!', 'success');
        fireConfetti();
      }

      return {
        ...prev,
        game: {
          ...currentGame,
          bossHp: newHp === 0 ? currentGame.bossMaxHp : newHp,
          coins: currentGame.coins + (newHp === 0 ? 50 : 5)
        }
      };
    });
  };

  const recordGameResult = (score: number, maxCombo: number) => {
    addXp(score, Math.round(score / 5));
    setData(prev => {
      const currentGame = prev.game || {
        xp: 0,
        level: 1,
        coins: 0,
        bossHp: 1000,
        bossMaxHp: 1000,
        highestCombo: 0,
        unlockedBadges: [],
        gamesPlayed: 0
      };

      return {
        ...prev,
        game: {
          ...currentGame,
          gamesPlayed: currentGame.gamesPlayed + 1,
          highestCombo: Math.max(currentGame.highestCombo, maxCombo)
        }
      };
    });
  };

  // Notes operations
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    showToast('Note created', 'success');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    }));
    showToast('Note saved', 'success');
  };

  const togglePinNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
    showToast('Note deleted', 'info');
  };

  // Mock Tests operations
  const addMockTest = (test: Omit<MockTest, 'id' | 'percentage'>) => {
    const percentage =
      test.totalMarks > 0 ? Math.round((test.obtainedMarks / test.totalMarks) * 10000) / 100 : 0;
    const newTest: MockTest = {
      ...test,
      id: `test-${Date.now()}`,
      percentage
    };
    setData(prev => ({
      ...prev,
      profile: recordActivityForStreak(prev),
      mockTests: [newTest, ...prev.mockTests]
    }));
    showToast('Mock test result saved', 'success');
  };

  const updateMockTest = (id: string, updates: Partial<MockTest>) => {
    setData(prev => ({
      ...prev,
      mockTests: prev.mockTests.map(t => {
        if (t.id !== id) return t;
        const total = updates.totalMarks ?? t.totalMarks;
        const obtained = updates.obtainedMarks ?? t.obtainedMarks;
        const percentage = total > 0 ? Math.round((obtained / total) * 10000) / 100 : 0;
        return { ...t, ...updates, percentage };
      })
    }));
    showToast('Mock test updated', 'success');
  };

  const deleteMockTest = (id: string) => {
    setData(prev => ({
      ...prev,
      mockTests: prev.mockTests.filter(t => t.id !== id)
    }));
    showToast('Mock test entry removed', 'info');
  };

  // Backup & Reset operations
  const exportBackup = () => {
    const jsonStr = StorageService.exportDataJson(data);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyForge-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully', 'success');
  };

  const importBackup = (jsonContent: string) => {
    try {
      const imported = StorageService.importDataJson(jsonContent);
      setData(imported);
      showToast('Data imported successfully!', 'success');
    } catch {
      showToast('Failed to import backup. Please check file format.', 'error');
    }
  };

  const resetDefaultData = () => {
    const res = StorageService.resetToDefault();
    setData(res);
    showToast('Reset to clean starter state', 'info');
  };

  const loadDemoShowcase = () => {
    const demo = StorageService.loadDemoShowcase();
    setData(demo);
    showToast('Loaded demo showcase data for preview', 'success');
  };

  const clearAllData = () => {
    const blank = StorageService.clearAllData();
    setData(blank);
    showToast('All application data cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        removeToast,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        addChapter,
        updateChapter,
        deleteChapter,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        autoRescheduleAll,
        addBacklogItem,
        updateBacklogItem,
        toggleBacklogCompleted,
        deleteBacklogItem,
        addRevisionItem,
        completeRevisionCycle,
        deleteRevisionItem,
        logFocusSession,
        addNote,
        updateNote,
        togglePinNote,
        deleteNote,
        addMockTest,
        updateMockTest,
        deleteMockTest,
        exportBackup,
        importBackup,
        resetDefaultData,
        loadDemoShowcase,
        addXp,
        damageBoss,
        recordGameResult,
        clearAllData,
        whiteboardNote,
        setWhiteboardNote
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
