import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Plus } from 'lucide-react';
import { TaskType, Priority, StudyTask } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: StudyTask | null;
  defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  defaultDate
}) => {
  const { data, addTask, updateTask } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const targetDate = defaultDate || today;

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id || '');
  const [chapterId, setChapterId] = useState('');
  const [type, setType] = useState<TaskType>('practice');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState<Priority>('high');
  const [dueDate, setDueDate] = useState(targetDate);
  const [scheduledDate, setScheduledDate] = useState(targetDate);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubjectId(initialTask.subjectId);
      setChapterId(initialTask.chapterId || '');
      setType(initialTask.type);
      setEstimatedMinutes(initialTask.estimatedMinutes);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate);
      setScheduledDate(initialTask.scheduledDate);
    } else {
      setTitle('');
      setSubjectId(data.subjects[0]?.id || '');
      setChapterId('');
      setType('practice');
      setEstimatedMinutes(60);
      setPriority('high');
      setDueDate(targetDate);
      setScheduledDate(targetDate);
    }
  }, [initialTask, isOpen, targetDate, data.subjects]);

  if (!isOpen) return null;

  const filteredChapters = data.chapters.filter(c => c.subjectId === subjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        subjectId,
        chapterId: chapterId || undefined,
        type,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        priority,
        dueDate,
        scheduledDate
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        chapterId: chapterId || undefined,
        type,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        priority,
        dueDate,
        scheduledDate,
        completed: false,
        order: data.tasks.length + 1
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-400" />
          {initialTask ? 'Edit Study Task' : 'Add Study Task'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Solve 30 Questions on Electrostatics"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Subject</label>
              <select
                value={subjectId}
                onChange={e => {
                  setSubjectId(e.target.value);
                  setChapterId('');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              >
                {data.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Chapter (Optional)
              </label>
              <select
                value={chapterId}
                onChange={e => setChapterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="">General / None</option>
                {filteredChapters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as TaskType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="practice">Practice / PYQ</option>
                <option value="lecture">Lecture</option>
                <option value="reading">Reading</option>
                <option value="assignment">Assignment</option>
                <option value="revision">Revision</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Duration</label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500 pr-8"
                  required
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">min</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Scheduled Study Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Final Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {initialTask ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
