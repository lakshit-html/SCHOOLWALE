import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Wand2,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  ArrowRight,
  AlertCircle,
  Layers
} from 'lucide-react';
import { TaskModal } from './TaskModal';
import { SubjectChapterModal } from './SubjectChapterModal';
import { StudyTask } from '../../types';

export const PlannerView: React.FC = () => {
  const { data, toggleTaskCompleted, deleteTask, updateTask, autoRescheduleAll } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);

  // Generate 7 upcoming dates
  const next7Days: Array<{ date: string; dayName: string; formatted: string }> = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const baseTime = new Date().getTime();

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseTime + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    next7Days.push({
      date: dateStr,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      formatted: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`
    });
  }

  const subjectsMap = new Map(data.subjects.map(s => [s.id, s]));
  const chaptersMap = new Map(data.chapters.map(c => [c.id, c]));

  // Selected date tasks
  const currentDayTasks = data.tasks.filter(t => t.scheduledDate === selectedDate);
  const totalAllocatedMinutes = currentDayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const totalAllocatedHours = Math.round((totalAllocatedMinutes / 60) * 10) / 10;
  const targetHours = data.profile.dailyTargetHours || 6;
  const isOverloaded = totalAllocatedHours > targetHours * 1.1;

  const handleEdit = (task: StudyTask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const shiftToTomorrow = (task: StudyTask) => {
    const nextDay = new Date(new Date(task.scheduledDate).getTime() + 86400000)
      .toISOString()
      .split('T')[0];
    updateTask(task.id, { scheduledDate: nextDay });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-brand-400" />
            Smart Study Planner
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize lectures, practice sets, and auto-balance your workload against daily availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCurriculumModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-colors"
          >
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Curriculum</span>
          </button>

          <button
            onClick={autoRescheduleAll}
            title="Automatically rebalance tasks to eliminate daily overloads and schedule overdue tasks"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <Wand2 className="w-4 h-4" />
            <span>Auto-Schedule</span>
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Date Navigator / Day selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {next7Days.map(item => {
          const isSelected = selectedDate === item.date;
          const dayTasks = data.tasks.filter(t => t.scheduledDate === item.date);
          const dayMins = dayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
          const dayHrs = Math.round((dayMins / 60) * 10) / 10;
          const isDayOverloaded = dayHrs > targetHours;

          return (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`flex-1 min-w-[110px] p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/50'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-bold ${isSelected ? 'text-brand-300' : 'text-slate-300'}`}>
                  {item.dayName}
                </span>
                {isDayOverloaded && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" title="Daily capacity exceeded" />
                )}
              </div>
              <div className="text-xs text-slate-400 font-medium">{item.formatted}</div>
              <div className="mt-2 text-[11px] font-mono flex items-center justify-between">
                <span className={dayHrs > targetHours ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {dayHrs}h / {targetHours}h
                </span>
                <span className="text-slate-500">{dayTasks.length} tasks</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Capacity Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          isOverloaded
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOverloaded ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-brand-400 shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold">
              Planned Workload: {totalAllocatedHours} hours ({totalAllocatedMinutes} mins)
            </p>
            <p className="text-xs text-slate-400">
              {isOverloaded
                ? `⚠️ Exceeds your daily capacity of ${targetHours}h by ${(
                    totalAllocatedHours - targetHours
                  ).toFixed(1)}h. Consider using "Auto-Schedule" to distribute tasks.`
                : `Optimal workload within your ${targetHours}h daily target.`}
            </p>
          </div>
        </div>

        {isOverloaded && (
          <button
            onClick={autoRescheduleAll}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-semibold rounded-lg transition-colors"
          >
            Balance Load
          </button>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {currentDayTasks.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No tasks for this day</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add lectures, practice problem sheets, or revisions to fill your daily study schedule.
            </p>
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Task Now
            </button>
          </div>
        ) : (
          currentDayTasks.map(task => {
            const subject = subjectsMap.get(task.subjectId);
            const chapter = task.chapterId ? chaptersMap.get(task.chapterId) : null;
            const isCompleted = task.completed;
            const isOverdue = !isCompleted && task.dueDate < todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 sm:mt-0 transition-all ${
                      isCompleted
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'border-slate-700 hover:border-brand-500 text-transparent'
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
                      {task.title}
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

                      {chapter && (
                        <span className="text-xs text-slate-400 font-medium">
                          • {chapter.title}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {task.estimatedMinutes} mins
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          task.priority === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300'
                            : task.priority === 'medium'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <span className="text-[11px] text-slate-500 capitalize">
                        Type: {task.type}
                      </span>

                      {isOverdue && (
                        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          OVERDUE (Due {task.dueDate})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Card Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {!isCompleted && (
                    <button
                      onClick={() => shiftToTomorrow(task)}
                      title="Postpone to tomorrow"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">+1 Day</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        defaultDate={selectedDate}
      />

      {/* Curriculum Modal */}
      <SubjectChapterModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
      />
    </div>
  );
};
