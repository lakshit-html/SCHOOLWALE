import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Plus,
  TrendingUp,
  AlertCircle,
  Calendar,
  Trash2,
  Edit2,
  Target
} from 'lucide-react';
import { calculateTestAnalytics } from '../../services/analytics';
import { MockTestModal } from './MockTestModal';
import { MockTest } from '../../types';

export const MockTestsView: React.FC = () => {
  const { data, deleteMockTest } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);

  const analytics = calculateTestAnalytics(data.mockTests);

  const handleEdit = (test: MockTest) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTest(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            Mock Tests & Examination Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track exam simulations, diagnose mistakes, analyze subject-wise score trends, and enforce action plans.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Record Test Result</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Tests Evaluated
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {analytics.totalTestsTaken}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Exams</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Full & part syllabus mocks</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Average Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-300">
              {analytics.averageScorePct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Across all test series</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Personal Best
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {analytics.highestScorePct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Peak mock score</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
            Score Trajectory
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black capitalize ${
                analytics.trend === 'improving'
                  ? 'text-emerald-400'
                  : analytics.trend === 'declining'
                  ? 'text-rose-400'
                  : 'text-cyan-300'
              }`}
            >
              {analytics.trend}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {analytics.trend === 'improving' ? '📈 Upward momentum' : 'Steady performance'}
          </span>
        </div>
      </div>

      {/* Visual Score Trends Chart */}
      {analytics.recentScores.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Performance Progression Curve
          </h3>

          <div className="h-44 flex items-end justify-between gap-4 pt-6 pb-2 border-b border-slate-800">
            {analytics.recentScores.map((score, idx) => {
              const heightPct = Math.min(100, Math.max(10, score.percentage));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-mono font-bold text-brand-300">
                    {score.percentage}%
                  </span>
                  <div className="w-full max-w-[60px] bg-slate-800/80 rounded-t-lg h-32 flex items-end overflow-hidden p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-md transition-all duration-500 shadow-md shadow-brand-500/20"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px] text-center font-mono">
                    {score.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Test List */}
      <div className="space-y-4">
        {data.mockTests.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No mock tests recorded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your recent part or full syllabus test papers to track your marks and mistakes.
            </p>
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Test Result
            </button>
          </div>
        ) : (
          data.mockTests.map(test => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{test.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Conducted on: {test.testDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-300 font-mono">
                      {test.percentage}%
                    </span>
                    <span className="text-xs text-slate-400 font-semibold block -mt-1 font-mono">
                      {test.obtainedMarks} / {test.totalMarks} marks
                    </span>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                    <button
                      onClick={() => handleEdit(test)}
                      className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Test Result"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMockTest(test.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Test Result"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {test.subjectScores.map(score => {
                  const pct =
                    score.maxMarks > 0
                      ? Math.round((score.marksObtained / score.maxMarks) * 100)
                      : 0;

                  return (
                    <div
                      key={score.subjectId}
                      className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                        <span className="font-semibold">{score.subjectName}</span>
                        <span className="font-mono text-brand-300 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {score.marksObtained} / {score.maxMarks} marks
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mistakes & Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {test.mistakesAnalysis && (
                  <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <span className="text-rose-300 font-bold flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Mistakes Diagnosis
                    </span>
                    <p className="text-slate-300 leading-relaxed">{test.mistakesAnalysis}</p>
                  </div>
                )}

                {test.actionPlan && (
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5 mb-1">
                      <Target className="w-3.5 h-3.5" /> Action Plan
                    </span>
                    <p className="text-slate-300 leading-relaxed">{test.actionPlan}</p>
                  </div>
                )}
              </div>

              {/* Weak Topics */}
              {test.weakAreas.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">
                    Weak Areas:
                  </span>
                  {test.weakAreas.map((w, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <MockTestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTest(null);
        }}
        initialTest={editingTest}
      />
    </div>
  );
};
