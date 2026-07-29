import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [recurring, setRecurring] = useState('NONE');
  const [reminderDate, setReminderDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);
  const overlayRef = useRef(null);

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
    setError('');
  }, [taskToEdit, isOpen]);

  // Lock background scroll + focus title + escape to close
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => titleInputRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (deadlineDate && reminderDate && new Date(reminderDate) > new Date(deadlineDate)) {
      setError('Reminder should be before the deadline.');
      return;
    }

    setLoading(true);
    const payload = {
      title: title.trim(),
      description,
      priority,
      deadlineDate: deadlineDate || null,
      recurring,
      reminderDate: reminderDate || null,
    };

    try {
      await onSave(payload, taskToEdit?.id);
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
      setError('Could not save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[overlayIn_0.15s_ease-out]"
    >
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-[modalIn_0.2s_ease-out]">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
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
            <p className="text-xs text-slate-400">Set deadlines, priority level &amp; reminders</p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-[shakeIn_0.3s_ease-out]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              placeholder="e.g. Prepare Quarter Sales Presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Add key notes, links, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-all duration-200 resize-none"
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
                    className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      priority === p
                        ? p === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm scale-[1.02]'
                          : p === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm scale-[1.02]'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm scale-[1.02]'
                        : 'bg-slate-900/40 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
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
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deadline Date &amp; Time</label>
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Set Reminder Alert</label>
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg glow-blue flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}