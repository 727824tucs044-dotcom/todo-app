import React, { useState } from 'react';
import { User, Mail, Lock, Key, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { userApi } from '../services/api';

export default function ProfileView({ user, tasks, onUserUpdated }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', isError: false });

    try {
      const res = await userApi.updateProfile({ name, email });
      onUserUpdated(res.data);
      setMsg({ text: 'Profile updated successfully!', isError: false });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to update profile.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', isError: false });

    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setMsg({ text: 'Password changed successfully!', isError: false });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to change password.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tasks-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Description", "Priority", "Status", "Deadline", "Recurring"];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.deadlineDate || '',
      t.recurring || 'NONE'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-xl glow-blue">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            {user?.name}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {user?.role}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
        </div>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl border text-xs font-bold text-center ${
          msg.isError ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" /> General Profile Settings
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" /> Security & Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all"
            >
              Update Password
            </button>
          </form>
        </div>

      </div>

      {/* Task Data Export Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> Data Export Module (SRS Sec 2.2)
        </h3>
        <p className="text-xs text-slate-400">
          Download a complete backup copy of your personal tasks, deadlines, and priorities in standard JSON or CSV file formats.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition-all"
          >
            <Download className="w-4 h-4" /> Download JSON Backup
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" /> Download CSV Spreadsheet
          </button>
        </div>
      </div>

    </div>
  );
}
