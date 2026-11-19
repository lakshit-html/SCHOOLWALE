import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Repeat,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Check
} from 'lucide-react';
import { calculateRevisionMetrics } from '../../services/analytics';
import { RevisionModal } from './RevisionModal';
import { ConfidenceLevel } from '../../types';

export const RevisionView: React.FC = () => {
  const { data, completeRevisionCycle, deleteRevisionItem } = useApp();
  const [filterTab, setFilterTab] = useState<'due_today' | 'overdue' | 'upcoming' | 'all'>(
    'due_today'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCompletingId, setActiveCompletingId] = useState<string | null>(null);

  const metrics = calculateRevisionMetrics(data.revisions);
  const today = new Date().toISOString().split('T')[0];
  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

  // Categorize revisions
  const filteredRevisions = data.revisions.filter(r => {
    const isOverdue = r.status === 'overdue' || (r.status !== 'completed' && r.scheduledDate < today);
    const isDueToday = r.scheduledDate === today && r.status !== 'completed';
    const isUpcoming = r.scheduledDate > today && r.status !== 'completed';

    if (filterTab === 'due_today') return isDueToday;
    if (filterTab === 'overdue') return isOverdue;
    if (filterTab === 'upcoming') return isUpcoming;
    return true;
  });

  const handleCompleteWithConfidence = (id: string, confidence: ConfidenceLevel) => {
    completeRevisionCycle(id, confidence);
    setActiveCompletingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-teal-400" />
            Spaced Repetition & Revision System
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Defeat the forgetting curve by revising topics at scientifically calibrated intervals: 1d, 3d, 7d, 14d, 30d.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Revision</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Revisions Due Today
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-300">
              {data.revisions.filter(r => r.scheduledDate === today && r.status !== 'completed').length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Topics</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Scheduled for review today</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Overdue Topics
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">
              {metrics.overdueCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Overdue</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Need immediate attention</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Retention Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {metrics.complianceRate}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Timely revisions completed</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Total Tracked Cycles
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{metrics.totalCount}</span>
            <span className="text-xs text-slate-400 font-semibold">In pipeline</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Spaced across 5 intervals</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterTab('due_today')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filterTab === 'due_today'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>Due Today</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">
            {data.revisions.filter(r => r.scheduledDate === today && r.status !== 'completed').length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('overdue')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filterTab === 'overdue'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>Overdue</span>
          {metrics.overdueCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-950 rounded-full text-[10px] text-rose-300">
              {metrics.overdueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilterTab('upcoming')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filterTab === 'upcoming'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>Upcoming Schedule</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">
            {data.revisions.filter(r => r.scheduledDate > today && r.status !== 'completed').length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterTab === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          All Topics ({data.revisions.length})
        </button>
      </div>

      {/* Revision Cards */}
      <div className="space-y-3">
        {filteredRevisions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <CheckCircle2 className="w-10 h-10 text-brand-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-200">No revisions in this queue</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              All caught up! Add newly completed chapters to automatically schedule their spaced revision rounds.
            </p>
          </div>
        ) : (
          filteredRevisions.map(rev => {
            const subject = subjectsMap.get(rev.subjectId);
            const isOverdue = rev.status === 'overdue' || rev.scheduledDate < today;
            const isDueToday = rev.scheduledDate === today;
            const isSelectingConfidence = activeCompletingId === rev.id;

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isOverdue
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/10'
                    : isDueToday
                    ? 'bg-slate-900/90 border-brand-500/40 shadow-lg shadow-teal-950/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {subject && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${subject.color}20`,
                            color: subject.color
                          }}
                        >
                          {subject.name}
                        </span>
                      )}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Cycle {rev.cycle} of 5
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          OVERDUE
                        </span>
                      )}
                      {isDueToday && (
                        <span className="text-[10px] font-extrabold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/30">
                          DUE TODAY
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-100">{rev.chapterTitle}</h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Target: {rev.scheduledDate}
                      </span>
                      <span>• Current Interval: {rev.intervalDays} days</span>
                      {rev.confidenceLevel && (
                        <span className="capitalize">
                          • Last Confidence: {rev.confidenceLevel}
                        </span>
                      )}
                    </div>

                    {/* History chips */}
                    {rev.history.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] text-slate-500 font-medium">History:</span>
                        {rev.history.map((h, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                            title={`Cycle ${h.cycle} on ${h.date} (${h.confidence} confidence)`}
                          >
                            C{h.cycle}: {h.confidence[0].toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions / Confidence selector */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {isSelectingConfidence ? (
                      <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
                        <span className="text-xs text-slate-400 font-medium px-2">Confidence:</span>
                        <button
                          onClick={() => handleCompleteWithConfidence(rev.id, 'low')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                          title="Struggled with retention — resets to a shorter interval"
                        >
                          Low (Needs work)
                        </button>
                        <button
                          onClick={() => handleCompleteWithConfidence(rev.id, 'medium')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                          title="Normal recall — moves to next standard spaced interval"
                        >
                          Medium (Good)
                        </button>
                        <button
                          onClick={() => handleCompleteWithConfidence(rev.id, 'high')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                          title="Solid mastery — extends the interval"
                        >
                          High (Mastered)
                        </button>
                        <button
                          onClick={() => setActiveCompletingId(null)}
                          className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveCompletingId(rev.id)}
                          className="px-4 py-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Complete Revision</span>
                        </button>

                        <button
                          onClick={() => deleteRevisionItem(rev.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Revision Reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Revision Modal */}
      <RevisionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
