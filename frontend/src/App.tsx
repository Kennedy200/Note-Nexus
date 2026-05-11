import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component/Page Imports
import Header from './components/Header/Header';
import About from './components/About/About';
import Features from './components/Features/Features';
import HowItWorks from './components/HowItWorks/HowItWorks';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import Documentation from './pages/Documentation/Documentation';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import BrowseNotes from './pages/Dashboard/BrowseNotes';
import UploadNote from './pages/Dashboard/UploadNote';
import MyUploads from './pages/Dashboard/MyUploads';
import MyPurchases from './pages/Dashboard/MyPurchases';
import WalletPage from './pages/Dashboard/WalletPage';
import ProfilePage from './pages/Dashboard/ProfilePage';

// Dashboard Home Component - WITH REAL BALANCE FETCHING
const DashboardHome = () => {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('notenexus_user') || '{}'));
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    // Fetch fresh user balance
    const fetchBalance = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/wallet/balance/${user.id}`);
        const data = await res.json();
        const updatedUser = { ...user, coin_balance: data.coin_balance };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    // Fetch wallet stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/wallet/stats/${user.id}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    if (user.id) {
      fetchBalance();
      fetchStats();
    }
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">
          👋 Welcome, {user.full_name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">
          Your learning journey continues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 italic opacity-90">
                🎓 NoteNexus Dashboard
              </h3>
              <p className="text-5xl font-[1000] tracking-tighter leading-none mb-4">
                Your hard work <br/> earns you rewards.
              </p>
              <p className="text-blue-100 font-bold text-lg">
                Share knowledge, earn coins, redeem airtime!
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                💰 Coin Balance
              </p>
              <p className="text-5xl font-black text-blue-600">{user.coin_balance || 0}</p>
              <p className="text-sm font-bold text-gray-500 mt-2">NoteCoins</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                📚 Quick Action
              </p>
              <a 
                href="/dashboard/browse" 
                className="block mt-4 bg-gray-900 text-white text-center py-4 rounded-xl font-black text-xs uppercase hover:bg-blue-600 transition-all"
              >
                Browse Notes
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <p className="text-3xl font-black text-green-600 mb-1">{stats.uploads}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Uploads</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <p className="text-3xl font-black text-purple-600 mb-1">{stats.purchases}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Purchases</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <p className="text-3xl font-black text-amber-600 mb-1">{stats.total_earned}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Total Earned</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tighter">
              💳 Wallet
            </h3>
            <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">
              Redeem NoteCoins for airtime on all networks.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-gray-300 mb-1">Rate</p>
              <p className="text-2xl font-black">1 NC = ₦10</p>
            </div>
          </div>
          <a 
            href="/dashboard/wallet"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl text-center hover:shadow-2xl transition-all"
          >
            Open Wallet
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a 
          href="/dashboard/upload" 
          className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">📤</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Upload Note</h3>
          <p className="text-sm text-gray-500 font-bold">
            Share your notes and earn 5 NC instantly!
          </p>
        </a>

        <a 
          href="/dashboard/my-uploads" 
          className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">📁</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">My Uploads</h3>
          <p className="text-sm text-gray-500 font-bold">
            Track your contributions and earnings
          </p>
        </a>

        <a 
          href="/dashboard/my-purchases" 
          className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">🛍️</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">My Library</h3>
          <p className="text-sm text-gray-500 font-bold">
            Access all your purchased notes
          </p>
        </a>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><About /><Features /><HowItWorks /><FAQ /><Footer /></>} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Routes - Using Outlet pattern */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="browse" element={<BrowseNotes />} />
            <Route path="upload" element={<UploadNote />} />
            <Route path="my-uploads" element={<MyUploads />} />
            <Route path="my-purchases" element={<MyPurchases />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;