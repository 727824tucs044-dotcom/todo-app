import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

export default function CalendarView({ tasks, onOpenNewTaskModal, onEditTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to check if two dates fall on the same day
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Get tasks for the selected date
  const selectedDayTasks = tasks.filter(t => isSameDay(t.deadlineDate, selectedDate));

  // Calendar cells generation
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(year, month, day));
  }

  return (
    <div className="space-y-6">
      
      {/* Calendar Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Interactive Task & Deadline Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
          >
            Today
          </button>
          
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-20 sm:h-24 rounded-xl bg-slate-950/20" />;
              }

              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);
              const dayTasks = tasks.filter(t => isSameDay(t.deadlineDate, date));

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`h-20 sm:h-24 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                      : isToday
                      ? 'bg-indigo-950/40 border-indigo-500/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {date.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Chips preview */}
                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate border ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-semibold text-right">
                        +{dayTasks.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Day Tasks Sidebar */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm">Tasks Scheduled For</h3>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">
              {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px]">
            {selectedDayTasks.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No tasks due on this date.</p>
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-200 truncate">{task.title}</h5>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                      task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{new Date(task.deadlineDate).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
