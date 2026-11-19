import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Repeat, Plus } from 'lucide-react';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({ isOpen, onClose }) => {
  const { data, addRevisionItem } = useApp();

  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id || '');
  const [chapterId, setChapterId] = useState('');
  const [customChapterTitle, setCustomChapterTitle] = useState('');
  const [intervalDays, setIntervalDays] = useState(1);
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const filteredChapters = data.chapters.filter(c => c.subjectId === subjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedChapter = data.chapters.find(c => c.id === chapterId);
    const title = matchedChapter ? matchedChapter.title : customChapterTitle.trim();

    if (!title || !subjectId) return;

    addRevisionItem({
      subjectId,
      chapterId: chapterId || `ch-custom-${Date.now()}`,
      chapterTitle: title,
      cycle: 1,
      intervalDays: Number(intervalDays) || 1,
      scheduledDate
    });

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
          <Repeat className="w-5 h-5 text-teal-400" />
          Schedule Spaced Revision
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Chapter</label>
            {filteredChapters.length > 0 ? (
              <select
                value={chapterId}
                onChange={e => setChapterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500 mb-2"
              >
                <option value="">-- Choose Existing Chapter --</option>
                {filteredChapters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            ) : null}

            {!chapterId && (
              <input
                type="text"
                value={customChapterTitle}
                onChange={e => setCustomChapterTitle(e.target.value)}
                placeholder="Or type custom chapter / topic name..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required={!chapterId}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Initial Interval (Days)
              </label>
              <select
                value={intervalDays}
                onChange={e => {
                  const days = Number(e.target.value);
                  setIntervalDays(days);
                  setScheduledDate(
                    new Date(Date.now() + days * 86400000).toISOString().split('T')[0]
                  );
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value={1}>1 Day (Tomorrow - Recommended for Day 1)</option>
                <option value={3}>3 Days (Post-Class Recall)</option>
                <option value={7}>7 Days (Weekly Consolidation)</option>
                <option value={14}>14 Days (Bi-weekly Anchor)</option>
                <option value={30}>30 Days (Monthly Refresh)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
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
              Schedule Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
