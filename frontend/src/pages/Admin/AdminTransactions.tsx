import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  transaction_type: string;
  description: string;
  timestamp: string;
}

const typeColors: Record<string, string> = {
  SIGNUP_BONUS: 'bg-blue-500/20 text-blue-400',
  UPLOAD_REWARD: 'bg-purple-500/20 text-purple-400',
  PURCHASE: 'bg-red-500/20 text-red-400',
  SALES_REWARD: 'bg-green-500/20 text-green-400',
  AIRTIME_REDEEM: 'bg-amber-500/20 text-amber-400',
};

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/transactions')
      .then(res => res.json())
      .then(data => { setTransactions(data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Transactions</h1>
        <p className="text-gray-400 font-bold mt-1">{transactions.length} total transactions</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">User</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Type</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Amount</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Description</th>
              <th className="text-left px-6 py-5 text-gray-400 font-black text-xs uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-6 py-4">
                  <p className="text-white font-black text-sm">{t.user_name}</p>
                  <p className="text-gray-500 text-xs font-bold">{t.user_email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${typeColors[t.transaction_type] || 'bg-gray-500/20 text-gray-400'}`}>
                    {t.transaction_type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {t.amount > 0 ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                    <span className={`font-black ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount} NC
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-300 text-sm font-bold">{t.description}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-400 text-sm font-bold">
                    {new Date(t.timestamp).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;