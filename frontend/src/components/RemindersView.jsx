import React, { useState } from 'react';
import { Bell, BellRing, CheckCircle2, Clock, AlertCircle, Sparkles, Send } from 'lucide-react';

export default function RemindersView({ tasks }) {
  const [testNotification, setTestNotification] = useState(null);

  // Extract tasks with reminder set
  const tasksWithReminders = tasks.filter(t => t.reminderDate || t.deadlineDate);

  const handleTestAlert = (task) => {
    setTestNotification({
      title: `Reminder Alert: ${task.title}`,
      body: `Due by ${new Date(task.deadlineDate || task.reminderDate).toLocaleString()}`,
      time: new Date().toLocaleTimeString(),
    });

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Reminder: ${task.title}`, {
        body: task.description || 'Task deadline approaching!',
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

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
            <p className="text-xs text-slate-400">In-App Alert Notifications & Desktop Prompts</p>
          </div>
        </div>

        <button
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission().then(permission => {
                alert(`Browser Notification Permission: ${permission}`);
              });
            }
          }}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-600/30 transition-all flex items-center gap-2"
        >
          <Bell className="w-4 h-4" /> Enable Browser Notifications
        </button>
      </div>

      {/* Simulated Alert Toast */}
      {testNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500 text-slate-950 font-bold">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">{testNotification.title}</h4>
              <p className="text-xs text-purple-200">{testNotification.body}</p>
            </div>
          </div>
          <button
            onClick={() => setTestNotification(null)}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1 bg-slate-900/50 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upcoming Reminders List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Active Task Reminder Schedule</h3>

        {tasksWithReminders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No scheduled reminders active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {tasksWithReminders.map(task => (
              <div
                key={task.id}
                className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{task.title}</h4>
                    <p className="text-xs text-slate-400">
                      Alert Date: {new Date(task.reminderDate || task.deadlineDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleTestAlert(task)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/40 text-purple-300 border border-slate-700 hover:border-purple-500/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Test Alert Trigger
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
