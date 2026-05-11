import React, { useState } from 'react';
import { 
  Book, 
  Code2, 
  Database, 
  ShieldCheck, 
  Send, 
  Cpu, 
  MessageSquare, 
  Terminal,
  Layers,
  Sparkles,
  ArrowLeft,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending your message...');

    try {
      const response = await fetch('https://formspree.io/f/xjgjqygv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `NoteNexus Suggestion from ${formData.name}`,
          // Note: Formspree handles the receiver (jude@gmail.com) based on your dashboard settings
        })
      });

      if (response.ok) {
        setStatus('SUCCESS! YOUR MESSAGE IS IN JUDE\'S INBOX.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('OOPS! THERE WAS AN ERROR SENDING.');
      }
    } catch (error) {
      setStatus('NETWORK ERROR. PLEASE CHECK YOUR CONNECTION.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 'thinking', label: 'The Thinking', icon: Cpu },
    { id: 'stack', label: 'Tech Stack', icon: Code2 },
    { id: 'auth', label: 'Auth & DB', icon: Database },
    { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
      {/* --- TOP NAV --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all group-hover:-translate-x-1" />
            <span className="font-bold text-gray-600 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 opacity-60">
            <Terminal className="text-blue-600 w-5 h-5" />
            <span className="font-black text-xs uppercase tracking-[0.3em] hidden sm:block text-gray-900">Developer Docs v1.0</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 flex flex-col lg:flex-row gap-16">
        
        {/* --- SIDEBAR NAVIGATION (Desktop) --- */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Table of Contents</h4>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`} 
                  className="flex items-center gap-3 p-3 rounded-xl font-bold text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                >
                  <s.icon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 max-w-3xl">
          
          {/* Header Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">
              <Sparkles className="w-4 h-4" /> Technical Blueprint
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 tracking-tighter leading-[0.9] mb-8">
              Inside <span className="text-blue-600">NoteNexus.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-blue-200 pl-8 py-2">
              An exhaustive breakdown of the architectural choices, logic, and student-first philosophy driving the Caleb University sharing economy.
            </p>
          </div>

          {/* Section: The Thinking */}
          <section id="thinking" className="mb-24 scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-[1000] text-gray-900 uppercase italic tracking-tighter">The Thinking</h2>
            </div>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
              <p>
                The primary motivation behind NoteNexus was the <span className="text-gray-900 font-black italic">fragmentation of academic intelligence</span>. At Caleb University, 
                valuable lecture notes are often trapped in ephemeral WhatsApp groups, lost on broken devices, or kept by students who see no benefit in sharing.
              </p>
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <p className="text-2xl font-black italic leading-tight relative z-10 group-hover:text-blue-400 transition-colors">
                  "We didn't just build a folder; we engineered a circular economy where academic generosity is rewarded."
                </p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
              </div>
              <p>
                By introducing <span className="text-blue-600 font-black underline decoration-2 underline-offset-4">NoteCoins</span>, we solve the 'free-rider' problem. Every upload is a deposit into a student's personal brand, turning high-performing scholars into recognized Academic Assets.
              </p>
            </div>
          </section>

          {/* Section: Tech Stack */}
          <section id="stack" className="mb-24 scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                <Code2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-[1000] text-gray-900 uppercase italic tracking-tighter text-purple-900">Tech Stack</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { t: "React & TS", d: "Type-safe interface for high-speed interactions.", icon: Layers, color: "text-blue-500" },
                { t: "Tailwind v4", d: "Modern, high-fidelity design primitives.", icon: Sparkles, color: "text-amber-500" },
                { t: "FastAPI", d: "Python-based core for complex coin logic.", icon: Zap, color: "text-purple-500" },
                { t: "Lucide React", d: "Pixel-perfect iconography for user intuition.", icon: Terminal, color: "text-green-500" },
              ].map((item, i) => (
                <div key={i} className="p-8 border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group bg-white">
                  <item.icon className={`w-8 h-8 mb-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg">{item.t}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium mt-1">{item.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Auth & DB */}
          <section id="auth" className="mb-24 scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-[1000] text-gray-900 uppercase italic tracking-tighter">Auth & Database</h2>
            </div>
            <div className="bg-gray-100 rounded-[3rem] p-10 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-400 text-white rounded-2xl shadow-lg">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Powered by Firebase</h3>
                  <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">Security • Real-time • Scalability</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Firebase Auth", d: "Secure Google & Student Email verification." },
                  { label: "Cloud Firestore", d: "Real-time sync for coin balances and chat logic." },
                  { label: "Cloud Storage", d: "Enterprise hosting for lecture PDFs and media." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-black text-gray-900 uppercase text-xs block mb-1">{item.label}</span>
                      <p className="text-sm text-gray-600 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Suggestions Box */}
          <section id="suggestions" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-[1000] text-gray-900 uppercase italic tracking-tighter">Message Jude</h2>
            </div>
            <div className="bg-blue-600 rounded-[3.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 group">
              {/* Animated background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-[1000] mb-4 tracking-tighter leading-tight italic uppercase">Got a suggestion?</h3>
                <p className="text-blue-100 mb-10 font-medium text-lg italic max-w-md">Your feedback directly shapes the next iteration of the NoteNexus ecosystem.</p>
                
                <form onSubmit={handleSendMessage} className="space-y-4 text-gray-900">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name" 
                      value={formData.name}
                      className="w-full px-8 py-5 rounded-2xl bg-white/95 border-none outline-none font-bold text-sm shadow-inner focus:ring-4 focus:ring-white/20 transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Student Email" 
                      value={formData.email}
                      className="w-full px-8 py-5 rounded-2xl bg-white/95 border-none outline-none font-bold text-sm shadow-inner focus:ring-4 focus:ring-white/20 transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <textarea 
                    rows={4} 
                    required
                    placeholder="Describe your idea or suggestion..." 
                    value={formData.message}
                    className="w-full px-8 py-6 rounded-[2.5rem] bg-white/95 border-none outline-none font-bold text-sm shadow-inner focus:ring-4 focus:ring-white/20 transition-all resize-none"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                  <button 
                    disabled={isSubmitting}
                    className={`w-full py-6 rounded-[3rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all duration-500 ${
                      isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed text-white/50' 
                      : 'bg-gray-900 text-white hover:bg-black hover:-translate-y-1 active:scale-95'
                    }`}
                  >
                    {isSubmitting ? 'Sending Transmission...' : 'Submit to Jude'} 
                    {!isSubmitting && <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                  
                  {status && (
                    <div className={`text-center font-black uppercase tracking-[0.2em] text-[10px] mt-6 p-3 rounded-xl backdrop-blur-sm border ${
                      status.includes('SUCCESS') 
                      ? 'text-green-200 border-green-200/20 bg-green-200/5' 
                      : 'text-amber-200 border-amber-200/20 bg-amber-200/5'
                    }`}>
                      {status}
                    </div>
                  )}
                </form>
              </div>
              <Book className="absolute -left-12 -bottom-12 w-64 h-64 text-white opacity-[0.03] -rotate-12" />
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 font-bold text-[10px] tracking-[0.4em] uppercase italic">
          Architected & Documented by Anyaeche Jude
        </p>
      </footer>
    </div>
  );
};

export default Documentation;