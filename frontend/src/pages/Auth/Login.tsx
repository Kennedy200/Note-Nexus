import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // THE KEY PART: Make sure data.user exists and has properties
      localStorage.setItem('notenexus_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      setError(data.detail || 'Login failed.');
    }
  } catch (err) {
    setError('Server connection error.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Column: Branding (Dark Theme for Login) */}
      <div className="lg:w-1/2 bg-gray-900 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2"></div>
        
        <Link to="/" className="flex items-center gap-2 z-10">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <span className="font-black text-2xl tracking-tighter uppercase italic">NoteNexus</span>
        </Link>

        <div className="z-10 max-w-md">
          <h2 className="text-5xl md:text-7xl font-[1000] leading-tight tracking-tighter mb-6 italic">
            Enter the <br /> <span className="text-blue-500 underline decoration-8">Nexus.</span>
          </h2>
          <p className="text-gray-400 font-bold text-lg leading-relaxed italic">
            Log in to manage your NoteCoin portfolio, redeem airtime, and continue your academic contribution journey.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-5 rounded-2xl w-fit z-10 backdrop-blur-sm">
            <Sparkles className="text-amber-400 w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">System Status: Financial Ledger Online</span>
        </div>
      </div>

      {/* Right Column: The Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-bold italic">Access your Caleb University academic wallet.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Student Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="jude@calebuniversity.edu.ng"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-blue-600 uppercase">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p className="text-xs font-black uppercase tracking-tighter">{error}</p>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? 'Verifying...' : 'Sign In Now'} 
              {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-bold italic">
            Don't have an account? <Link to="/signup" className="text-blue-600 underline">Join NoteNexus</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;