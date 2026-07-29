import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, Plus } from 'lucide-react';

const priorityStyles = {
  HIGH: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const priorityDotColor = {
  HIGH: 'bg-rose-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-emerald-500',
};

export default function CalendarView({ tasks, onOpenNewTaskModal, onEditTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0); // -1 prev, 1 next, for transition key

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const selectedDayTasks = tasks.filter(t => isSameDay(t.deadlineDate, selectedDate));

  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(year, month, day));
  }

  const handleCellKeyDown = (e, date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-6">

      {/* Calendar Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white transition-all duration-200" key={`${month}-${year}`}>
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Interactive Task &amp; Deadline Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all duration-200"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg glow-blue transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div key={`${month}-${year}`} className="grid grid-cols-7 gap-2 animate-[monthFade_0.2s_ease-out]">
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
                  role="button"
                  tabIndex={0}
                  aria-label={`${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}${dayTasks.length ? `, ${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}` : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDate(date)}
                  onKeyDown={(e) => handleCellKeyDown(e, date)}
                  className={`h-20 sm:h-24 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
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
                        className={`flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded truncate border ${
                          priorityStyles[t.priority] || priorityStyles.LOW
                        } ${t.status === 'COMPLETE' ? 'opacity-50 line-through' : ''}`}
                      >
                        {t.status === 'COMPLETE' && <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />}
                        <span className="truncate">{t.title}</span>
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
                  className={`p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all duration-200 space-y-1.5 ${
                    task.status === 'COMPLETE' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h5 className={`font-bold text-xs text-slate-200 truncate ${task.status === 'COMPLETE' ? 'line-through' : ''}`}>
                      {task.status === 'COMPLETE' && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 inline mr-1 -mt-0.5" />
                      )}
                      {task.title}
                    </h5>
                    <span className={`shrink-0 flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${priorityStyles[task.priority] || priorityStyles.LOW}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDotColor[task.priority] || priorityDotColor.LOW}`} />
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