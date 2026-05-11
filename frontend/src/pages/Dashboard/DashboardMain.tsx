import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardMain = () => {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');
    if (user.id) {
      axios.get(`http://localhost:8000/api/wallet/balance/${user.id}`)
        .then(res => setBalance(res.data.balance));
    }
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Dynamic Balance Card */}
      <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-center">
        <h3 className="text-xl font-black mb-4 uppercase text-gray-400">Academic Balance</h3>
        <p className="text-6xl font-[1000] text-gray-900 tracking-tighter italic">
          {balance.toFixed(2)} <span className="text-sm text-blue-600 not-italic ml-2">NoteCoins</span>
        </p>
      </div>

      {/* Quick Action Card */}
      <div className="p-10 bg-gray-900 rounded-[3rem] text-white flex flex-col justify-between">
        <h3 className="text-xl font-black mb-4 uppercase text-gray-400 tracking-widest">Quick Action</h3>
        <button 
          onClick={() => navigate('/dashboard/wallet')}
          className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-transform active:scale-95"
        >
          Convert to Airtime
        </button>
      </div>
    </div>
  );
};

export default DashboardMain;