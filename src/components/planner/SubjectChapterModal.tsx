import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, BookOpen, Layers } from 'lucide-react';
import { Priority, Difficulty, ChapterStatus } from '../../types';

interface SubjectChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubjectChapterModal: React.FC<SubjectChapterModalProps> = ({ isOpen, onClose }) => {
  const { data, addSubject, deleteSubject, addChapter, deleteChapter, updateChapter } = useApp();
  const [activeTab, setActiveTab] = useState<'subjects' | 'chapters'>('chapters');

  // New subject state
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#38bdf8');
  const [newSubTarget, setNewSubTarget] = useState(90);

  // New chapter state
  const [selectedSubId, setSelectedSubId] = useState(data.subjects[0]?.id || '');
  const [newChTitle, setNewChTitle] = useState('');
  const [newChTotalLectures, setNewChTotalLectures] = useState(8);
  const [newChPriority, setNewChPriority] = useState<Priority>('high');
  const [newChDifficulty, setNewChDifficulty] = useState<Difficulty>('moderate');

  if (!isOpen) return null;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    addSubject({
      name: newSubName.trim(),
      color: newSubColor,
      icon: 'BookOpen',
      targetScore: newSubTarget
    });
    setNewSubName('');
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChTitle.trim() || !selectedSubId) return;
    addChapter({
      subjectId: selectedSubId,
      title: newChTitle.trim(),
      totalLectures: Number(newChTotalLectures) || 1,
      completedLectures: 0,
      status: 'not_started',
      priority: newChPriority,
      difficulty: newChDifficulty,
      notesCount: 0
    });
    setNewChTitle('');
  };

  const colorPresets = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#6366f1'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          Manage Curriculum & Chapters
        </h3>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'chapters'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Chapters ({data.chapters.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Subjects ({data.subjects.length})
          </button>
        </div>

        {activeTab === 'chapters' ? (
          <div className="space-y-6">
            {/* Create Chapter Form */}
            <form onSubmit={handleCreateChapter} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-semibold text-slate-200">Add New Chapter</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Subject</label>
                  <select
                    value={selectedSubId}
                    onChange={e => setSelectedSubId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    {data.subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Chapter Title</label>
                  <input
                    type="text"
                    value={newChTitle}
                    onChange={e => setNewChTitle(e.target.value)}
                    placeholder="e.g. Wave Optics, Equilibrium..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Total Lectures</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={newChTotalLectures}
                      onChange={e => setNewChTotalLectures(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                    <select
                      value={newChPriority}
                      onChange={e => setNewChPriority(e.target.value as Priority)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Difficulty</label>
                    <select
                      value={newChDifficulty}
                      onChange={e => setNewChDifficulty(e.target.value as Difficulty)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="hard">Hard</option>
                      <option value="moderate">Moderate</option>
                      <option value="easy">Easy</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Chapter
              </button>
            </form>

            {/* Existing Chapters List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {data.chapters.map(ch => {
                const sub = data.subjects.find(s => s.id === ch.subjectId);
                return (
                  <div
                    key={ch.id}
                    className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {sub && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                          >
                            {sub.name}
                          </span>
                        )}
                        <h5 className="text-sm font-semibold text-slate-200">{ch.title}</h5>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>
                          Lectures: {ch.completedLectures} / {ch.totalLectures}
                        </span>
                        <span className="capitalize text-slate-500">• {ch.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ch.status}
                        onChange={e =>
                          updateChapter(ch.id, {
                            status: e.target.value as ChapterStatus,
                            completedLectures:
                              e.target.value === 'completed' ? ch.totalLectures : ch.completedLectures
                          })
                        }
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="revision">In Revision</option>
                      </select>
                      <button
                        onClick={() => deleteChapter(ch.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Subject Form */}
            <form onSubmit={handleCreateSubject} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-semibold text-slate-200">Add New Subject</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Subject Name</label>
                  <input
                    type="text"
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    placeholder="e.g. Physics, History, Botany..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Target Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newSubTarget}
                    onChange={e => setNewSubTarget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Accent Color</label>
                <div className="flex items-center gap-2">
                  {colorPresets.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewSubColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newSubColor === c ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </form>

            {/* Existing Subjects */}
            <div className="space-y-2">
              {data.subjects.map(s => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                    <span className="text-xs text-slate-400">Target: {s.targetScore}%</span>
                  </div>
                  <button
                    onClick={() => deleteSubject(s.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
