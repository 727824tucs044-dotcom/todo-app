import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Clock, Repeat, AlignLeft, Sparkles, Check } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [recurring, setRecurring] = useState('NONE');
  const [reminderDate, setReminderDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'MEDIUM');
      setDeadlineDate(taskToEdit.deadlineDate ? taskToEdit.deadlineDate.slice(0, 16) : '');
      setRecurring(taskToEdit.recurring || 'NONE');
      setReminderDate(taskToEdit.reminderDate ? taskToEdit.reminderDate.slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDeadlineDate('');
      setRecurring('NONE');
      setReminderDate('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      description,
      priority,
      deadlineDate: deadlineDate ? deadlineDate : null,
      recurring,
      reminderDate: reminderDate ? reminderDate : null,
    };

    try {
      await onSave(payload, taskToEdit?.id);
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400">Set deadlines, priority level & reminders</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Prepare Quarter Sales Presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Add key notes, links, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Priority & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      priority === p
                        ? p === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                          : p === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/40 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recurring Schedule</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="NONE">None (One-time)</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
          </div>

          {/* Deadline & Reminder Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deadline Date & Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Set Reminder Alert</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg glow-blue flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
