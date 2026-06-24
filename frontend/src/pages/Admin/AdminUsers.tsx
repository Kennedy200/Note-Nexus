import React, { useState, useEffect } from 'react';
import { Users, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';

interface User {
  id: number;
  full_name: string;
  email: string;
  coin_balance: number;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  total_uploads: number;
  total_purchases: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8000/api/admin/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); });
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    await fetch(`http://localhost:8000/api/admin/users/${userId}`, { method: 'DELETE' });
    fetchUsers();
  };

  const toggleUser = async (userId: number) => {
    await fetch(`http://localhost:8000/api/admin/users/${userId}/toggle`, { method: 'PUT' });
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Users</h1>
          <p className="text-gray-400 font-bold mt-1">{users.length} registered students</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white font-bold outline-none placeholder-gray-500"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">User</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Balance</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Uploads</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Purchases</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Status</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-5">
                  <p className="text-white font-black">{user.full_name}</p>
                  <p className="text-gray-400 text-sm font-bold">{user.email}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-amber-400 font-black">{user.coin_balance} NC</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-white font-black">{user.total_uploads}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-white font-black">{user.total_purchases}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleUser(user.id)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-blue-400">
                      {user.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;