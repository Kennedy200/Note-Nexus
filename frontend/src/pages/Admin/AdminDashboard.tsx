import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CreditCard, Smartphone, TrendingUp, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';

interface Stats {
  total_users: number;
  total_notes: number;
  total_transactions: number;
  total_airtime_redemptions: number;
  total_purchases: number;
  pending_notes: number;
  approved_notes: number;
  total_coins_in_circulation: number;
  total_coins_spent: number;
  total_airtime_naira: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'from-blue-600 to-blue-400', bg: 'bg-blue-600/10' },
    { label: 'Total Notes', value: stats?.total_notes, icon: BookOpen, color: 'from-purple-600 to-purple-400', bg: 'bg-purple-600/10' },
    { label: 'Total Purchases', value: stats?.total_purchases, icon: ShoppingCart, color: 'from-green-600 to-green-400', bg: 'bg-green-600/10' },
    { label: 'Transactions', value: stats?.total_transactions, icon: CreditCard, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-600/10' },
    { label: 'Airtime Redemptions', value: stats?.total_airtime_redemptions, icon: Smartphone, color: 'from-pink-600 to-pink-400', bg: 'bg-pink-600/10' },
    { label: 'Approved Notes', value: stats?.approved_notes, icon: CheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-600/10' },
    { label: 'Pending Notes', value: stats?.pending_notes, icon: XCircle, color: 'from-red-600 to-red-400', bg: 'bg-red-600/10' },
    { label: 'Coins Earned', value: stats?.total_coins_in_circulation, icon: TrendingUp, color: 'from-cyan-600 to-cyan-400', bg: 'bg-cyan-600/10' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-400 font-bold mt-2">Welcome back, Admin. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} border border-white/10 rounded-3xl p-6`}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-black text-white">{card.value?.toLocaleString()}</p>
            <p className="text-gray-400 font-bold text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Economy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-black text-white mb-6">💰 Economy Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400 font-bold">Coins in Circulation</span>
              <span className="text-white font-black">{stats?.total_coins_in_circulation} NC</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400 font-bold">Coins Spent</span>
              <span className="text-white font-black">{stats?.total_coins_spent} NC</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400 font-bold">Airtime Redeemed</span>
              <span className="text-green-400 font-black">₦{stats?.total_airtime_naira?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-black text-white mb-6">📚 Notes Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400 font-bold">Total Notes</span>
              <span className="text-white font-black">{stats?.total_notes}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400 font-bold">Approved</span>
              <span className="text-green-400 font-black">{stats?.approved_notes}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400 font-bold">Pending Review</span>
              <span className="text-amber-400 font-black">{stats?.pending_notes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;