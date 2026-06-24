import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, BookOpen, CreditCard, Smartphone, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = JSON.parse(localStorage.getItem('notenexus_admin') || 'null');

  useEffect(() => {
    if (!admin) navigate('/admin/login');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('notenexus_admin');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/notes', icon: BookOpen, label: 'Notes' },
    { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/admin/airtime', icon: Smartphone, label: 'Airtime' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-white/10 flex flex-col fixed h-full z-10">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg">NoteNexus</h1>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <p className="text-white font-black text-sm">{admin?.full_name}</p>
            <p className="text-gray-400 text-xs font-bold">{admin?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-600/30 text-blue-300 text-xs font-black rounded-full uppercase">
              {admin?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 font-black text-sm transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-10 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;