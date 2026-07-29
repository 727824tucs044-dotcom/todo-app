import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import TaskModal from './components/TaskModal';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import RemindersView from './components/RemindersView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import { taskApi } from './services/api';
import { Sparkles, Calendar, Bell, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, calendar, reminders, profile, admin
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Tasks whenever user logs in or search query changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, searchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const res = await taskApi.getTasks(params);
      setTasks(res.data);
    } catch (err) {
      console.warn('Backend unavailable, using client state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    setActiveTab('dashboard');
  };

  const handleSaveTask = async (taskPayload, taskId) => {
    try {
      if (taskId) {
        await taskApi.updateTask(taskId, taskPayload);
      } else {
        await taskApi.createTask(taskPayload);
      }
      fetchTasks();
    } catch (err) {
      // Fallback local state if offline
      if (taskId) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskPayload } : t));
      } else {
        const newTask = {
          id: Date.now(),
          ...taskPayload,
          status: 'INCOMPLETE',
          createdAt: new Date().toISOString()
        };
        setTasks(prev => [newTask, ...prev]);
      }
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskApi.toggleComplete(taskId);
      fetchTasks();
    } catch (err) {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: t.status === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE' };
        }
        return t;
      }));
    }
  };

  // Note: confirmation now happens via ConfirmModal inside DashboardView before this is called.
  // No window.confirm() here anymore — avoids double-confirming the same delete.
  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await taskApi.archiveTask(taskId);
      fetchTasks();
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Thin top loading bar while tasks are fetching */}
      {loading && (
        <div className="h-0.5 w-full bg-slate-800/60 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-indigo-500 animate-[loadingBar_1s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!user ? (
          /* Landing Hero / Auth Prompt */
          <div className="py-12 sm:py-20 text-center max-w-3xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 glow-blue">
              <Sparkles className="w-10 h-10" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              Advanced To-Do App with Calendar &amp; Reminders
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Organize your personal tasks, track deadlines with interactive monthly calendar views, setup automated reminder alerts, and export data effortlessly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl glow-blue transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started / Sign In
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
              <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-slate-200 text-sm">Task Management</h3>
                <p className="text-xs text-slate-400">Priorities, status tracking, recurring tasks, and live search.</p>
              </div>

              <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
                <Calendar className="w-6 h-6 text-indigo-400" />
                <h3 className="font-bold text-slate-200 text-sm">Interactive Calendar</h3>
                <p className="text-xs text-slate-400">Visual monthly calendar grid mapped to your task deadline dates.</p>
              </div>

              <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
                <Bell className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-slate-200 text-sm">Reminder System</h3>
                <p className="text-xs text-slate-400">Automated in-app popups and browser alert notifications.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Workspace Views */
          <div key={activeTab} className="animate-[fadeIn_0.2s_ease-out]">
            {activeTab === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleOpenEditModal}
                onDeleteTask={handleDeleteTask}
                onArchiveTask={handleArchiveTask}
                onOpenNewTaskModal={handleOpenNewModal}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                onOpenNewTaskModal={handleOpenNewModal}
                onEditTask={handleOpenEditModal}
              />
            )}

            {activeTab === 'reminders' && (
              <RemindersView
                tasks={tasks}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                tasks={tasks}
                onUserUpdated={(updated) => setUser({ ...user, ...updated })}
              />
            )}

            {activeTab === 'admin' && user.role === 'ADMIN' && (
              <AdminView />
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 mt-12">
        <p>© 2026 Advanced To-Do App with Calendar &amp; Reminders — Built according to SRS specifications</p>
      </footer>

    </div>
  );
}