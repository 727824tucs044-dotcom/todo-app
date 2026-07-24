import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Search,
  Download
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, onOpenAuth, searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow-blue">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
              TaskManager Pro
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Calendar & Reminder Suite</p>
          </div>
        </div>

        {/* Search Bar */}
        {user && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/80 transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Tabs & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'calendar'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>

                <button
                  onClick={() => setActiveTab('reminders')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'reminders'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reminders</span>
                </button>

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'admin'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/40'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
              </nav>

              {/* Profile Badge & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">{user.name}</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg glow-blue transition-all"
            >
              <User className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
