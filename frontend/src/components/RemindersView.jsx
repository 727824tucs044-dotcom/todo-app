import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, Clock, AlertTriangle, Send, X } from 'lucide-react';

export default function RemindersView({ tasks }) {
  const [testNotification, setTestNotification] = useState(null);
  const [permissionMsg, setPermissionMsg] = useState('');

  // Auto-dismiss the test alert toast after a few seconds
  useEffect(() => {
    if (!testNotification) return;
    const timer = setTimeout(() => setTestNotification(null), 6000);
    return () => clearTimeout(timer);
  }, [testNotification]);

  useEffect(() => {
    if (!permissionMsg) return;
    const timer = setTimeout(() => setPermissionMsg(''), 4000);
    return () => clearTimeout(timer);
  }, [permissionMsg]);

  const now = new Date();

  // Extract tasks with a reminder or deadline, tag overdue vs upcoming, sort chronologically
  const tasksWithReminders = tasks
    .filter(t => t.reminderDate || t.deadlineDate)
    .map(t => {
      const alertDate = new Date(t.reminderDate || t.deadlineDate);
      return { ...t, alertDate, isOverdue: alertDate < now && t.status !== 'COMPLETE' };
    })
    .sort((a, b) => a.alertDate - b.alertDate);

  const overdue = tasksWithReminders.filter(t => t.isOverdue);
  const upcoming = tasksWithReminders.filter(t => !t.isOverdue);

  const handleTestAlert = (task) => {
    setTestNotification({
      title: `Reminder Alert: ${task.title}`,
      body: `Due by ${task.alertDate.toLocaleString()}`,
    });

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Reminder: ${task.title}`, {
        body: task.description || 'Task deadline approaching!',
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const handleEnableNotifications = () => {
    if (!("Notification" in window)) {
      setPermissionMsg('Notifications are not supported in this browser.');
      return;
    }
    Notification.requestPermission().then(permission => {
      setPermissionMsg(
        permission === 'granted'
          ? 'Browser notifications enabled.'
          : permission === 'denied'
          ? 'Browser notifications were blocked.'
          : 'Notification permission dismissed.'
      );
    });
  };

  const renderReminderCard = (task) => (
    <div
      key={task.id}
      className={`glass-panel p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 ${
        task.status === 'COMPLETE'
          ? 'opacity-50'
          : task.isOverdue
          ? 'border-rose-500/40 hover:border-rose-500/60'
          : 'hover:border-purple-500/40'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${
          task.status === 'COMPLETE'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : task.isOverdue
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
        }`}>
          {task.status === 'COMPLETE' ? <CheckCircle2 className="w-5 h-5" /> : task.isOverdue ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <h4 className={`font-bold text-sm text-slate-100 truncate ${task.status === 'COMPLETE' ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          <p className={`text-xs ${task.isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
            {task.status === 'COMPLETE' ? 'Completed · ' : task.isOverdue ? 'Overdue · ' : 'Alert Date: '}
            {task.alertDate.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => handleTestAlert(task)}
        className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/40 text-purple-300 border border-slate-700 hover:border-purple-500/50 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
      >
        <Send className="w-3.5 h-3.5" /> Test Alert
      </button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Reminders Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Automated Task Reminders</h2>
            <p className="text-xs text-slate-400">In-App Alert Notifications &amp; Desktop Prompts</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-600/30 transition-all duration-200 flex items-center gap-2"
          >
            <Bell className="w-4 h-4" /> Enable Browser Notifications
          </button>
          {permissionMsg && (
            <p className="text-[11px] text-slate-400 animate-[fadeIn_0.2s_ease-out]">{permissionMsg}</p>
          )}
        </div>
      </div>

      {/* Simulated Alert Toast */}
      {testNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 shadow-2xl flex items-center justify-between gap-3 animate-[slideDown_0.25s_ease-out]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-purple-500 text-slate-950 font-bold shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-white truncate">{testNotification.title}</h4>
              <p className="text-xs text-purple-200 truncate">{testNotification.body}</p>
            </div>
          </div>
          <button
            onClick={() => setTestNotification(null)}
            aria-label="Dismiss"
            className="shrink-0 p-1.5 text-slate-300 hover:text-white bg-slate-900/50 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overdue Reminders */}
      {overdue.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-rose-500/20">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Overdue ({overdue.length})
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {overdue.map(renderReminderCard)}
          </div>
        </div>
      )}

      {/* Upcoming / Completed Reminders */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200">
          {overdue.length > 0 ? 'Other Reminders' : 'Active Task Reminder Schedule'}
        </h3>

        {upcoming.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No scheduled reminders active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {upcoming.map(renderReminderCard)}
          </div>
        )}
      </div>

    </div>
  );
}