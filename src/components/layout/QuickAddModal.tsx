import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  ClockAlert,
  Repeat,
  BookOpen,
  Award,
  Timer,
  ChevronRight
} from 'lucide-react';
import { TaskModal } from '../planner/TaskModal';
import { BacklogModal } from '../backlog/BacklogModal';
import { RevisionModal } from '../revision/RevisionModal';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useApp();

  const [activeSubModal, setActiveSubModal] = useState<
    'none' | 'task' | 'backlog' | 'revision'
  >('none');

  if (!isOpen) return null;

  const handleSelect = (type: 'task' | 'backlog' | 'revision' | 'pomodoro' | 'note' | 'test') => {
    if (type === 'task') {
      setActiveSubModal('task');
    } else if (type === 'backlog') {
      setActiveSubModal('backlog');
    } else if (type === 'revision') {
      setActiveSubModal('revision');
    } else if (type === 'pomodoro') {
      setActiveTab('pomodoro');
      onClose();
    } else if (type === 'note') {
      setActiveTab('notes');
      onClose();
    } else if (type === 'test') {
      setActiveTab('tests');
      onClose();
    }
  };

  if (activeSubModal === 'task') {
    return (
      <TaskModal
        isOpen={true}
        onClose={() => {
          setActiveSubModal('none');
          onClose();
        }}
      />
    );
  }

  if (activeSubModal === 'backlog') {
    return (
      <BacklogModal
        isOpen={true}
        onClose={() => {
          setActiveSubModal('none');
          onClose();
        }}
      />
    );
  }

  if (activeSubModal === 'revision') {
    return (
      <RevisionModal
        isOpen={true}
        onClose={() => {
          setActiveSubModal('none');
          onClose();
        }}
      />
    );
  }

  const actions = [
    {
      id: 'task',
      title: 'Study Task',
      desc: 'Add lecture, practice problem sheet, or reading task to schedule',
      icon: Calendar,
      color: 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/20'
    },
    {
      id: 'backlog',
      title: 'Backlog Lecture',
      desc: 'Log a missed lecture, track duration and note requirements',
      icon: ClockAlert,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 'revision',
      title: 'Spaced Revision Cycle',
      desc: 'Schedule revision round for a completed chapter',
      icon: Repeat,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      id: 'pomodoro',
      title: 'Focus Pomodoro Session',
      desc: 'Launch a deep focus timer with session logging',
      icon: Timer,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'note',
      title: 'Academic Formula / Note',
      desc: 'Draft key points, reaction mechanisms or memory aids',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'test',
      title: 'Mock Test Result',
      desc: 'Record marks, mistake causes and action items',
      icon: Award,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quick Action</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">What would you like to record?</p>

        <div className="space-y-2.5">
          {actions.map(act => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() =>
                  handleSelect(
                    act.id as 'task' | 'backlog' | 'revision' | 'pomodoro' | 'note' | 'test'
                  )
                }
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${act.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                      {act.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
