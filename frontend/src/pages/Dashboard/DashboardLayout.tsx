import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Coins, Upload, FileText, ShoppingBag, LogOut, User, Settings, Trophy } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('notenexus_user') || '{}'));
  const [balance, setBalance] = useState(user.coin_balance || 0);

  // Fetch fresh balance from server on route change
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/wallet/balance/${user.id}`);
        const data = await res.json();
        setBalance(data.coin_balance);
        
        // Update localStorage
        const updatedUser = { ...user, coin_balance: data.coin_balance };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    if (user.id) {
      fetchBalance();
    }
  }, [location.pathname]); // Refresh on route change

  const handleLogout = () => {
    localStorage.removeItem('notenexus_user');
    navigate('/login');
  };

 const navItems = [
  { to: '/dashboard/browse', icon: BookOpen, label: 'Browse Notes' },
  { to: '/dashboard/upload', icon: Upload, label: 'Upload Note' },
  { to: '/dashboard/my-uploads', icon: FileText, label: 'My Uploads' },
  { to: '/dashboard/my-purchases', icon: ShoppingBag, label: 'My Purchases' },
  { to: '/dashboard/wallet', icon: Coins, label: 'Wallet' },
  { to: '/dashboard/profile', icon: Settings, label: 'Profile' },
  { to: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' }
];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-[1000] text-gray-900 tracking-tighter uppercase italic">NoteNexus</h1>
                <p className="text-xs text-gray-500 font-bold">Caleb University</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-2xl border border-amber-200">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="font-black text-amber-900 text-lg">{balance} NC</span>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-900">{user.full_name?.split(' ')[0]}</span>
              </div>

              <button 
                onClick={handleLogout}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <nav className="bg-white rounded-[2rem] p-4 border border-gray-100 sticky top-24 shadow-sm">
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;