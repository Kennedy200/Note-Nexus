import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({ balance: 0, recent_transactions: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // In a real app, get this from your Auth context
    const userId = 1; 

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/user/${userId}/stats`);
                setStats(res.data);
            } catch (err) {
                console.error("Error loading dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10">Loading Academic Data...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[250px]">
                    <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-4">Academic Balance</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-slate-900">{stats.balance.toFixed(2)}</span>
                        <span className="text-blue-600 font-bold italic text-xl">NoteCoins</span>
                    </div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col justify-between">
                    <h3 className="font-bold uppercase tracking-wider text-slate-400">Quick Action</h3>
                    <button 
                        onClick={() => navigate('/wallet')}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
                    >
                        CONVERT TO AIRTIME
                    </button>
                </div>
            </div>

            {/* Recent Ledger / Transactions */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <h3 className="font-bold text-xl mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {stats.recent_transactions.length === 0 && <p className="text-gray-400">No recent transactions.</p>}
                    {stats.recent_transactions.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-slate-800">{tx.description}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-black ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount} NC
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;