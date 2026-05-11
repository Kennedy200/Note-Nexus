import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, Clock, Download, Upload, Gift, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface Transaction {
  id: number;
  amount: number;
  transaction_type: string;
  description: string;
  timestamp: string;
}

interface Stats {
  current_balance: number;
  total_earned: number;
  total_spent: number;
  uploads: number;
  purchases: number;
}

const WalletPage: React.FC = () => {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = () => {
    fetch(`http://localhost:8000/api/wallet/transactions/${user.id}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => {
        console.error('Failed to fetch transactions:', err);
        showToast('error', 'Failed to load transactions', 'Please refresh the page');
      });
  };

  const fetchStats = () => {
    fetch(`http://localhost:8000/api/wallet/stats/${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        showToast('error', 'Failed to load wallet stats', 'Please refresh the page');
      });
  };

  const handleRedeem = async () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      showToast('error', 'Invalid phone number', 'Please enter a valid 11-digit phone number');
      return;
    }

    const coinsNeeded = amount / 10;
    if (stats && stats.current_balance < coinsNeeded) {
      showToast('warning', 'Insufficient balance', `You need ${coinsNeeded} NC but only have ${stats.current_balance} NC`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/airtime/redeem/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          network: network,
          amount: amount
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        showToast('success', 'Airtime redeemed successfully!', `${data.network} ₦${data.amount} sent to ${data.phone}`);
        const updatedUser = { ...user, coin_balance: data.new_balance };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        setShowRedeemModal(false);
        setPhoneNumber('');
        fetchTransactions();
        fetchStats();
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showToast('error', 'Redemption failed', data.detail || 'Unable to process request');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'UPLOAD_REWARD': return <Upload className="w-5 h-5 text-green-500" />;
      case 'SIGNUP_BONUS': return <Gift className="w-5 h-5 text-blue-500" />;
      case 'SALES_REWARD': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'AIRTIME_REDEEM': return <Smartphone className="w-5 h-5 text-purple-500" />;
      default: return <Coins className="w-5 h-5 text-gray-500" />;
    }
  };

  const coinsNeeded = amount / 10;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">💰 My Wallet</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">Manage your NoteCoins & Rewards</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-[3rem] p-10 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-blue-100 font-bold text-sm uppercase tracking-widest mb-2">Total Balance</p>
            <h1 className="text-6xl font-[1000] tracking-tighter">{stats?.current_balance || 0} <span className="text-3xl">NC</span></h1>
          </div>
          <Coins className="w-16 h-16 opacity-20" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-2 text-green-300 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-black uppercase">Earned</span>
            </div>
            <p className="text-2xl font-black">{stats?.total_earned || 0} NC</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-300 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-black uppercase">Spent</span>
            </div>
            <p className="text-2xl font-black">{stats?.total_spent || 0} NC</p>
          </div>
        </div>

        <button 
          onClick={() => setShowRedeemModal(true)}
          className="w-full mt-8 bg-white text-blue-600 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
        >
          <Smartphone className="w-5 h-5" />
          Redeem Airtime
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <Upload className="w-10 h-10 text-blue-500 mb-4" />
          <p className="text-3xl font-black text-gray-900 mb-1">{stats?.uploads || 0}</p>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Notes Uploaded</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <Download className="w-10 h-10 text-purple-500 mb-4" />
          <p className="text-3xl font-black text-gray-900 mb-1">{stats?.purchases || 0}</p>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Notes Purchased</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[3rem] p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900 uppercase italic">Transaction History</h3>
          <Clock className="w-6 h-6 text-gray-400" />
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-10 font-bold">No transactions yet</p>
          ) : (
            transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  {getTransactionIcon(txn.transaction_type)}
                  <div>
                    <p className="font-black text-gray-900">{txn.description}</p>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                      {new Date(txn.timestamp).toLocaleString('en-NG', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-black ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount} NC
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl animate-bounceIn">
            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic">📱 Redeem Airtime</h2>
            <p className="text-gray-500 font-bold mb-8">Convert NoteCoins to instant airtime</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="08012345678"
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Network</label>
                <div className="grid grid-cols-4 gap-3">
                  {['MTN', 'AIRTEL', 'GLO', '9MOBILE'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setNetwork(net)}
                      className={`py-4 rounded-xl font-black text-xs uppercase transition-all ${
                        network === net 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Amount (₦)</label>
                <div className="grid grid-cols-4 gap-3">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-4 rounded-xl font-black transition-all ${
                        amount === amt 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ₦{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-600">You'll Pay:</span>
                  <span className="text-2xl font-black text-blue-600">{coinsNeeded} NC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600">You'll Get:</span>
                  <span className="text-2xl font-black text-green-600">₦{amount}</span>
                </div>
                <p className="text-xs text-gray-500 font-bold mt-3 text-center">
                  Conversion Rate: 1 NC = ₦10
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowRedeemModal(false);
                    setPhoneNumber('');
                  }}
                  className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleRedeem}
                  disabled={loading || !phoneNumber || phoneNumber.length !== 11}
                  className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black uppercase text-sm hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      Redeem Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;