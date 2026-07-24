import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Trash2, UserX, Search, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/api';

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load user accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setMsg(`User "${userName}" deleted successfully.`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user account.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Admin Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Administrator User Management</h2>
            <p className="text-xs text-purple-300">System Oversight & User Account Governance (SRS Appendix A)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Registered Accounts:</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            {users.length} Users
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
          {msg}
        </div>
      )}

      {/* Table & Controls */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user accounts by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">Loading user accounts...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No user accounts found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-3 px-4 font-mono text-slate-400">#{user.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{user.name}</td>
                    <td className="py-3 px-4 text-slate-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
