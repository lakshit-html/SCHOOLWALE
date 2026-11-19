import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ClockAlert, Plus } from 'lucide-react';
import { Priority, BacklogItem } from '../../types';

interface BacklogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: BacklogItem | null;
}

export const BacklogModal: React.FC<BacklogModalProps> = ({
  isOpen,
  onClose,
  initialItem
}) => {
  const { data, addBacklogItem, updateBacklogItem } = useApp();

  const [subjectId, setSubjectId] = useState(initialItem?.subjectId || data.subjects[0]?.id || '');
  const [chapterTitle, setChapterTitle] = useState(initialItem?.chapterTitle || '');
  const [lectureTitle, setLectureTitle] = useState(initialItem?.lectureTitle || '');
  const [durationMinutes, setDurationMinutes] = useState(initialItem?.durationMinutes || 85);
  const [priority, setPriority] = useState<Priority>(initialItem?.priority || 'high');
  const [notesStatus, setNotesStatus] = useState<BacklogItem['notesStatus']>(
    initialItem?.notesStatus || 'not_started'
  );
  const [assignmentStatus, setAssignmentStatus] = useState<BacklogItem['assignmentStatus']>(
    initialItem?.assignmentStatus || 'pending'
  );
  const [notes, setNotes] = useState(initialItem?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !chapterTitle.trim() || !subjectId) return;

    if (initialItem) {
      updateBacklogItem(initialItem.id, {
        subjectId,
        chapterTitle: chapterTitle.trim(),
        lectureTitle: lectureTitle.trim(),
        durationMinutes: Number(durationMinutes) || 60,
        priority,
        notesStatus,
        assignmentStatus,
        notes: notes.trim()
      });
    } else {
      addBacklogItem({
        subjectId,
        chapterTitle: chapterTitle.trim(),
        lectureTitle: lectureTitle.trim(),
        durationMinutes: Number(durationMinutes) || 60,
        priority,
        notesStatus,
        assignmentStatus,
        notes: notes.trim()
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
          <ClockAlert className="w-5 h-5 text-rose-400" />
          {initialItem ? 'Edit Backlog Lecture' : 'Log Pending Backlog Lecture'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Subject</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Chapter Name</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={e => setChapterTitle(e.target.value)}
                placeholder="e.g. Thermodynamics, Optics..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Lecture Title / Number</label>
              <input
                type="text"
                value={lectureTitle}
                onChange={e => setLectureTitle(e.target.value)}
                placeholder="e.g. Lec 05: Carnot Cycle"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Duration</label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={360}
                  step={5}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500 pr-8"
                  required
                />
                <span className="absolute right-2 top-2 text-xs text-slate-500">m</span>
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

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Class Notes</label>
              <select
                value={notesStatus}
                onChange={e => setNotesStatus(e.target.value as BacklogItem['notesStatus'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="not_started">Not Done</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Assignment Status</label>
              <select
                value={assignmentStatus}
                onChange={e =>
                  setAssignmentStatus(e.target.value as BacklogItem['assignmentStatus'])
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="pending">Pending</option>
                <option value="submitted">Completed / Submitted</option>
                <option value="not_required">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Notes / Reason</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Missed due to fever, high weightage"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
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
              {initialItem ? 'Update Backlog' : 'Log Backlog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
