import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Award, Plus } from 'lucide-react';
import { SubjectScore, MockTest } from '../../types';

interface MockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTest?: MockTest | null;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({
  isOpen,
  onClose,
  initialTest
}) => {
  const { data, addMockTest, updateMockTest } = useApp();

  const [title, setTitle] = useState(initialTest?.title || '');
  const [testDate, setTestDate] = useState(
    initialTest?.testDate || new Date().toISOString().split('T')[0]
  );
  const [mistakesAnalysis, setMistakesAnalysis] = useState(initialTest?.mistakesAnalysis || '');
  const [actionPlan, setActionPlan] = useState(initialTest?.actionPlan || '');
  const [weakAreasStr, setWeakAreasStr] = useState(initialTest?.weakAreas.join(', ') || '');

  // Subject scores
  const [subjectScores, setSubjectScores] = useState<SubjectScore[]>(() => {
    if (initialTest && initialTest.subjectScores.length > 0) {
      return initialTest.subjectScores;
    }
    return data.subjects.map(s => ({
      subjectId: s.id,
      subjectName: s.name,
      marksObtained: 70,
      maxMarks: 100
    }));
  });

  if (!isOpen) return null;

  const totalMarks = subjectScores.reduce((acc, s) => acc + s.maxMarks, 0);
  const totalObtained = subjectScores.reduce((acc, s) => acc + s.marksObtained, 0);
  const calculatedPercentage =
    totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 10000) / 100 : 0;

  const handleScoreChange = (
    idx: number,
    field: 'marksObtained' | 'maxMarks',
    value: number
  ) => {
    setSubjectScores(prev =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: Number(value) || 0 } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const weakAreas = weakAreasStr
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (initialTest) {
      updateMockTest(initialTest.id, {
        title: title.trim(),
        testDate,
        totalMarks,
        obtainedMarks: totalObtained,
        percentage: calculatedPercentage,
        subjectScores,
        mistakesAnalysis,
        weakAreas,
        actionPlan
      });
    } else {
      addMockTest({
        title: title.trim(),
        testDate,
        totalMarks,
        obtainedMarks: totalObtained,
        subjectScores,
        mistakesAnalysis,
        weakAreas,
        actionPlan
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          {initialTest ? 'Edit Mock Test Result' : 'Record Mock Test Performance'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Test Name / Series</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. All India Test Series - Test 04"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Test Date</label>
              <input
                type="date"
                value={testDate}
                onChange={e => setTestDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          {/* Subject Scores breakdown */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Subject Performance Breakdown</span>
              <span className="font-mono text-brand-300 font-bold">
                Total: {totalObtained} / {totalMarks} ({calculatedPercentage}%)
              </span>
            </div>

            <div className="space-y-2">
              {subjectScores.map((score, idx) => (
                <div
                  key={score.subjectId}
                  className="grid grid-cols-12 gap-3 items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800"
                >
                  <span className="col-span-5 text-xs font-bold text-slate-200 truncate">
                    {score.subjectName}
                  </span>

                  <div className="col-span-3 flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={score.maxMarks}
                      value={score.marksObtained}
                      onChange={e => handleScoreChange(idx, 'marksObtained', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 text-center font-mono"
                    />
                    <span className="text-xs text-slate-500">marks</span>
                  </div>

                  <div className="col-span-3 flex items-center gap-1">
                    <span className="text-xs text-slate-500">/</span>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={score.maxMarks}
                      onChange={e => handleScoreChange(idx, 'maxMarks', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 text-center font-mono"
                    />
                  </div>

                  <span className="col-span-1 text-[11px] font-mono text-right text-brand-400 font-semibold">
                    {score.maxMarks > 0
                      ? Math.round((score.marksObtained / score.maxMarks) * 100)
                      : 0}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">
              Mistakes Analysis & Root Causes
            </label>
            <textarea
              value={mistakesAnalysis}
              onChange={e => setMistakesAnalysis(e.target.value)}
              rows={2}
              placeholder="e.g. 4 calculation slips in organic, time mismanaged in Section B..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Weak Topics Identified (comma separated)
              </label>
              <input
                type="text"
                value={weakAreasStr}
                onChange={e => setWeakAreasStr(e.target.value)}
                placeholder="e.g. Rotational Torque, Aldol Reaction"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Action Plan & Corrective Strategy
              </label>
              <input
                type="text"
                value={actionPlan}
                onChange={e => setActionPlan(e.target.value)}
                placeholder="e.g. Solve 30 speed numericals with timer"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
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
              {initialTest ? 'Update Result' : 'Save Test Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
