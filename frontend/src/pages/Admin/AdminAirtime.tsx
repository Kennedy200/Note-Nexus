import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

interface Redemption {
  id: number;
  user_name: string;
  user_email: string;
  phone_number: string;
  network: string;
  amount: number;
  coins_spent: number;
  status: string;
  created_at: string;
}

const networkColors: Record<string, string> = {
  MTN: 'bg-yellow-500/20 text-yellow-400',
  AIRTEL: 'bg-red-500/20 text-red-400',
  GLO: 'bg-green-500/20 text-green-400',
  '9MOBILE': 'bg-emerald-500/20 text-emerald-400',
};

const AdminAirtime: React.FC = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/airtime')
      .then(res => res.json())
      .then(data => { setRedemptions(data); setLoading(false); });
  }, []);

  const totalNaira = redemptions.filter(r => r.status === 'SUCCESS').reduce((sum, r) => sum + r.amount, 0);
  const totalCoins = redemptions.filter(r => r.status === 'SUCCESS').reduce((sum, r) => sum + r.coins_spent, 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Airtime Redemptions</h1>
        <p className="text-gray-400 font-bold mt-1">{redemptions.length} total redemptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-600/10 border border-amber-600/20 rounded-3xl p-6">
          <Smartphone className="w-8 h-8 text-amber-400 mb-3" />
          <p className="text-3xl font-black text-white">{redemptions.length}</p>
          <p className="text-gray-400 font-bold text-sm">Total Redemptions</p>
        </div>
        <div className="bg-green-600/10 border border-green-600/20 rounded-3xl p-6">
          <Smartphone className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-3xl font-black text-white">₦{totalNaira.toLocaleString()}</p>
          <p className="text-gray-400 font-bold text-sm">Total Naira Redeemed</p>
        </div>
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-3xl p-6">
          <Smartphone className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl font-black text-white">{totalCoins} NC</p>
          <p className="text-gray-400 font-bold text-sm">Total Coins Spent</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">User</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Phone</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Network</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Amount</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Coins</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Status</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-4">
                  <p className="text-white font-black text-sm">{r.user_name}</p>
                  <p className="text-gray-500 text-xs font-bold">{r.user_email}</p>
                </td>
                <td className="px-6 py-4"><span className="text-white font-bold text-sm">{r.phone_number}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${networkColors[r.network] || 'bg-gray-500/20 text-gray-400'}`}>
                    {r.network}
                  </span>
                </td>
                <td className="px-6 py-4"><span className="text-green-400 font-black">₦{r.amount}</span></td>
                <td className="px-6 py-4"><span className="text-amber-400 font-black">{r.coins_spent} NC</span></td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${r.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 text-sm font-bold">
                    {new Date(r.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {redemptions.length === 0 && (
          <div className="text-center py-20">
            <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No airtime redemptions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAirtime;