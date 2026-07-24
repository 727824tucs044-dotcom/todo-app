import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await authApi.register({ name, email, password, role });
      } else {
        res = await authApi.login({ email, password });
      }

      const { token, id, name: userName, email: userEmail, role: userRole } = res.data;
      const userData = { id, name: userName, email: userEmail, role: userRole };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      onLoginSuccess(userData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'ADMIN') {
      setEmail('admin@todo.com');
      setPassword('admin123');
    } else {
      setEmail('user@todo.com');
      setPassword('user123');
    }
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Sign up to manage your tasks & calendar' : 'Sign in to access your personal dashboard'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Selection</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'USER'
                      ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" /> Standard User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'ADMIN'
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> Administrator
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg glow-blue flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-center text-[11px] font-semibold text-slate-400 mb-2.5">Quick Demo Fill</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin('USER')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 text-xs font-medium transition-all"
            >
              Demo User
            </button>
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 text-purple-300 text-xs font-medium transition-all"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-all"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
}
