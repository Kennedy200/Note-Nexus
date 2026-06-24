import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('notenexus_admin', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Create Admin</h1>
          <p className="text-blue-300 font-bold mt-2">NoteNexus Administration</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-6 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-blue-200 uppercase tracking-widest mb-3">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Admin Name"
                  required
                  className="w-full pl-14 pr-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 font-bold outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-blue-200 uppercase tracking-widest mb-3">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@notenexus.com"
                  required
                  className="w-full pl-14 pr-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 font-bold outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-blue-200 uppercase tracking-widest mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-14 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 font-bold outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <><Shield className="w-5 h-5" /> Create Admin Account</>}
            </button>
          </form>

          <p className="text-center text-blue-300 font-bold mt-8 text-sm">
            Already have admin account?{' '}
            <Link to="/admin/login" className="text-white underline hover:text-blue-200">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;