import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClockAlert,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  FileText,
  CheckSquare
} from 'lucide-react';
import { calculateBacklogForecast } from '../../services/analytics';
import { BacklogModal } from './BacklogModal';
import { BacklogItem } from '../../types';

export const BacklogView: React.FC = () => {
  const { data, toggleBacklogCompleted, deleteBacklogItem, addTask, setActiveTab } = useApp();

  const [paceHours, setPaceHours] = useState<number>(1.5);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'cleared' | 'all'>('pending');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);

  const forecast = calculateBacklogForecast(data.backlog, paceHours);
  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

  // Filtering
  const filteredBacklogs = data.backlog.filter(item => {
    if (selectedSubject !== 'all' && item.subjectId !== selectedSubject) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (selectedStatus === 'pending' && item.completed) return false;
    if (selectedStatus === 'cleared' && !item.completed) return false;
    return true;
  });

  const handleEdit = (item: BacklogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const convertToTodayTask = (item: BacklogItem) => {
    const today = new Date().toISOString().split('T')[0];
    addTask({
      title: `Watch Backlog: ${item.lectureTitle}`,
      subjectId: item.subjectId,
      type: 'lecture',
      estimatedMinutes: item.durationMinutes,
      priority: item.priority,
      dueDate: today,
      scheduledDate: today,
      completed: false,
      order: data.tasks.length + 1
    });
    setActiveTab('planner');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ClockAlert className="w-6 h-6 text-rose-400" />
            Backlog Management & Clearance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Systematically liquidate pending lectures and track your projected zero-backlog clearance date.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Log Pending Lecture</span>
        </button>
      </div>

      {/* Backlog Forecast Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/30 border border-slate-800 shadow-xl">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Remaining Backlog
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400">{forecast.totalPendingHours}</span>
            <span className="text-xs text-slate-400 font-semibold">Hours</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {forecast.totalPendingCount} pending lectures total
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Cleared So Far
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{forecast.clearedHours}</span>
            <span className="text-xs text-slate-400 font-semibold">Hours</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {data.backlog.filter(b => b.completed).length} lectures liquidated
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Zero-Backlog Date
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-brand-300">
              {forecast.totalPendingHours > 0 ? forecast.projectedClearanceDate : 'All Cleared! 🎉'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {forecast.estimatedCompletionDays > 0
              ? `Estimated in ~${forecast.estimatedCompletionDays} study days`
              : 'Zero debt remaining'}
          </span>
        </div>

        {/* Dynamic Clearance Pace Controller */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="font-semibold">Daily Clearance Pace</span>
              <span className="text-brand-300 font-bold font-mono">{paceHours}h/day</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.5}
              value={paceHours}
              onChange={e => setPaceHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block leading-tight">
            Adjust pace to view realistic completion forecasts based on your schedule.
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({data.backlog.filter(b => !b.completed).length})
            </button>
            <button
              onClick={() => setSelectedStatus('cleared')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedStatus === 'cleared'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cleared ({data.backlog.filter(b => b.completed).length})
            </button>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
          </div>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Subjects</option>
            {data.subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredBacklogs.length} lectures
        </span>
      </div>

      {/* Backlog List */}
      <div className="space-y-3">
        {filteredBacklogs.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-200">No backlogs matching filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You are on top of your coursework! Log any missed lectures here to never fall behind.
            </p>
          </div>
        ) : (
          filteredBacklogs.map(item => {
            const subject = subjectsMap.get(item.subjectId);
            const isCompleted = item.completed;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start md:items-center gap-3.5">
                  <button
                    onClick={() => toggleBacklogCompleted(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 md:mt-0 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-700 hover:border-emerald-500 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div>
                    <h4
                      className={`text-sm sm:text-base font-semibold ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {item.lectureTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {subject && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${subject.color}20`,
                            color: subject.color
                          }}
                        >
                          {subject.name}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium">
                        • {item.chapterTitle}
                      </span>

                      <span className="text-xs text-slate-400 font-mono">
                        ⏱️ {item.durationMinutes} mins
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          item.priority === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : item.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.priority}
                      </span>

                      {/* Notes Status */}
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-500" />
                        Notes: {item.notesStatus}
                      </span>

                      {/* Assignment Status */}
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-slate-500" />
                        Assignment: {item.assignmentStatus}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Backlog Item Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {!isCompleted && (
                    <button
                      onClick={() => convertToTodayTask(item)}
                      title="Add this backlog lecture into Today's Study Planner"
                      className="px-3 py-1.5 bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Plan for Today</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Backlog Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteBacklogItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Backlog Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Backlog Modal */}
      <BacklogModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        initialItem={editingItem}
      />
    </div>
  );
};
