import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Zap, HelpCircle, MessageSquare, Info, Sparkles, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features', icon: Zap },
    { name: 'How it Works', href: '#how-it-works', icon: Info },
    { name: 'FAQ', href: '#faq', icon: HelpCircle },
    { name: 'Contact', href: '#contact', icon: MessageSquare },
  ];

  return (
    <>
      {/* --- NAVIGATION BAR --- */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Left: Mobile Toggle & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="NoteNexus"
                    className="h-10 w-10 object-contain transition-transform duration-500 group-hover:rotate-[10deg]"
                  />
                  <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                  Note<span className="text-blue-600">Nexus</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop Links */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[15px] font-bold text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            </nav>

            {/* Right: Buttons (Desktop Only) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Documentation Button */}
              <Link
                to="/documentation"
                className="flex items-center gap-2 bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all duration-300 shadow-sm border border-gray-200"
              >
                <FileText className="w-4 h-4" />
                Documentation
              </Link>

              {/* Admin Button */}
              <Link
                to="/admin/login"
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all duration-300 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transition-transform duration-500 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="font-black text-xl tracking-tighter">NoteNexus</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-between p-4 rounded-2xl text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <link.icon className="w-5 h-5 opacity-70 group-hover:text-blue-600" />
                  </div>
                  {link.name}
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}

            {/* Documentation in mobile sidebar */}
            <Link
              to="/documentation"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FileText className="w-5 h-5 opacity-70 group-hover:text-blue-600" />
                </div>
                Documentation
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Admin Portal in mobile sidebar */}
            <Link
              to="/admin/login"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Admin Portal
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </nav>

          <div className="p-6 border-t border-gray-50 space-y-3">
            <Link
              to="/login"
              onClick={() => setIsSidebarOpen(false)}
              className="block w-full py-4 text-center text-gray-900 font-black border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsSidebarOpen(false)}
              className="block w-full py-4 text-center bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </aside>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-white">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-blue-50/60 blur-[140px] animate-pulse" />
          <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50/60 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-black mb-10 animate-bounce-slow">
            <Sparkles className="w-4 h-4 fill-blue-700" />
            <span>The Academic Hub for Caleb University</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-[1000] text-gray-900 tracking-tight leading-[0.95] mb-8">
            Notes Shared. <br />
            <span className="text-blue-600">Rewards Earned.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-500 font-medium leading-relaxed mb-12">
            The premium collaborative platform for students to upload notes,
            earn NoteCoins, and dominate their exams together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-4xl font-black text-xl hover:bg-gray-50 transition-all duration-300 shadow-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Social Proof / Mini Stats */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 uppercase">1,200+</span>
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Resources</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 uppercase">500+</span>
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Students</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 uppercase">100%</span>
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Secure</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;