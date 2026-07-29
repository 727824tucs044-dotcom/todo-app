import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Search,
  X,
  Menu
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, onOpenAuth, searchQuery, setSearchQuery }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <button
          className="flex items-center gap-3 shrink-0 group"
          onClick={() => handleTabClick('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow-blue transition-transform duration-300 group-hover:scale-105">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
              TaskManager Pro
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Calendar &amp; Reminder Suite</p>
          </div>
        </button>

        {/* Desktop Search Bar */}
        {user && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-blue-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/80 focus:bg-slate-800 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-all"
                aria-label="Toggle search"
              >
                {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>

              {/* Desktop nav tabs */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabClick(id)}
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeTab === 'admin'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/40'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
              </nav>

              {/* Profile Badge & Logout (desktop) */}
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-700/60">
                <button
                  onClick={() => handleTabClick('profile')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg glow-blue transition-all duration-200 hover:-translate-y-0.5"
            >
              <User className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile search panel */}
      {user && mobileSearchOpen && (
        <div className="md:hidden mt-3 animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/80 transition-all"
            />
          </div>
        </div>
      )}

      {/* Mobile nav menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-1 animate-[fadeIn_0.2s_ease-out]">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}

          {user.role === 'ADMIN' && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-purple-400 hover:bg-purple-950/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}

          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-indigo-600/30 text-indigo-200'
                : 'text-slate-400 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[9px] text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {user.name || 'Profile'}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}