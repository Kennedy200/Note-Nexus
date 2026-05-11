import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Strict Caleb Email Validation
    if (!formData.email.toLowerCase().endsWith('@calebuniversity.edu.ng')) {
      setError('Access Denied: Only @calebuniversity.edu.ng emails are allowed.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup, redirect to login
        navigate('/login');
      } else {
        setError(data.detail || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection to server failed. Is your FastAPI running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Column: The Branding */}
      <div className="lg:w-1/2 bg-blue-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        
        <Link to="/" className="flex items-center gap-2 z-10">
          <img src="/logo.png" alt="NoteNexus" className="h-10 w-10 brightness-0 invert" />
          <span className="font-black text-2xl tracking-tighter uppercase italic">NoteNexus</span>
        </Link>

        <div className="z-10">
          <h2 className="text-5xl md:text-7xl font-[1000] leading-tight tracking-tighter mb-8 italic">
            Knowledge is <br /> <span className="text-blue-200 underline decoration-8">Currency.</span>
          </h2>
          <div className="space-y-6 max-w-md">
            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2 rounded-xl"><Zap className="w-5 h-5 text-blue-200" /></div>
              <p className="font-bold text-blue-100 italic tracking-tight">Post your lecture notes and instantly earn NoteCoins for each contribution.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2 rounded-xl"><ShieldCheck className="w-5 h-5 text-blue-200" /></div>
              <p className="font-bold text-blue-100 italic tracking-tight">Your coins are backed by the community. Convert them to Airtime anytime.</p>
            </div>
          </div>
        </div>

        <p className="text-blue-300 font-black text-xs z-10 tracking-[0.3em] uppercase">Caleb University • Final Year Project 2026</p>
      </div>

      {/* Right Column: The Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Join the Nexus</h1>
            <p className="text-gray-500 font-bold italic underline decoration-blue-100 underline-offset-4">Sign up with your official student email.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="e.g. Anyaeche Jude"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Student Email (@calebuniversity.edu.ng)</label>
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
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
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
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-black uppercase tracking-tighter leading-tight">{error}</p>
              </div>
            )}

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-blue-200'
              }`}
            >
              {loading ? 'Processing...' : 'Secure Sign Up'} 
              {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-bold italic">
            Already a member? <Link to="/login" className="text-blue-600 underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;