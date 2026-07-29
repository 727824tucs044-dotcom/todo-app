import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListFilter,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
  Archive,
  Sparkles,
  Repeat,
  BellRing
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ConfirmModal from './ConfirmModal';

export default function DashboardView({ tasks, onToggleComplete, onEditTask, onDeleteTask, onArchiveTask, onOpenNewTaskModal }) {
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, INCOMPLETE, COMPLETE
  const [filterPriority, setFilterPriority] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW
  const [sortBy, setSortBy] = useState('DEADLINE'); // DEADLINE, PRIORITY
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Calculate Metrics
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'INCOMPLETE').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETE').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'HIGH' && t.status === 'INCOMPLETE').length;

  // Filter Tasks
  let filtered = tasks.filter(t => {
    if (filterStatus === 'INCOMPLETE' && t.status !== 'INCOMPLETE') return false;
    if (filterStatus === 'COMPLETE' && t.status !== 'COMPLETE') return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    return true;
  });

  // Sort Tasks
  filtered.sort((a, b) => {
    if (sortBy === 'PRIORITY') {
      const pOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    }
    // Default DEADLINE
    if (!a.deadlineDate) return 1;
    if (!b.deadlineDate) return -1;
    return new Date(a.deadlineDate) - new Date(b.deadlineDate);
  });

  const handleToggle = (task) => {
    if (task.status === 'INCOMPLETE') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    onToggleComplete(task.id);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner / Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Tasks</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{totalCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ListFilter className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400">Pending Tasks</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{pendingCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400">Completed</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{completedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-400">High Priority</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{highPriorityCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Control Bar: Filters, Sorting & Add Button */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {['ALL', 'INCOMPLETE', 'COMPLETE'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Tasks' : status === 'INCOMPLETE' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500 transition-all duration-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500 transition-all duration-200"
          >
            <option value="DEADLINE">Sort by Deadline</option>
            <option value="PRIORITY">Sort by Priority</option>
          </select>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-blue transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

      </div>

      {/* Task Cards List */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-200">No tasks found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any tasks matching the current filter. Create a new task to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 ${
                task.status === 'COMPLETE' ? 'opacity-60 bg-slate-900/40' : 'hover:border-blue-500/40'
              }`}
            >

              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggle(task)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                    task.status === 'COMPLETE'
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600 hover:border-blue-500 bg-slate-900/60'
                  }`}
                >
                  {task.status === 'COMPLETE' && <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </button>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-bold text-sm text-slate-100 truncate ${task.status === 'COMPLETE' ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      task.priority === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : task.priority === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {task.priority}
                    </span>

                    {task.recurring && task.recurring !== 'NONE' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        <Repeat className="w-3 h-3" />
                        {task.recurring.toLowerCase()}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    {task.deadlineDate && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Due: {new Date(task.deadlineDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                    )}

                    {task.reminderDate && (
                      <div className="flex items-center gap-1 text-purple-400 font-medium">
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Reminder set</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-center">
                <button
                  onClick={() => onEditTask(task)}
                  title="Edit Task"
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onArchiveTask(task.id)}
                  title="Archive Task"
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-all duration-200"
                >
                  <Archive className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setTaskToDelete(task)}
                  title="Delete Task"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete this task?"
        message={taskToDelete ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.` : ''}
        confirmLabel="Delete Task"
        danger
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setTaskToDelete(null)}
      />

    </div>
  );
}