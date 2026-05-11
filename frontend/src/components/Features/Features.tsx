import React from 'react';
import { 
  Wallet, 
  Search, 
  ShieldCheck, 
  BarChart3, 
  ArrowUpRight, 
  Fingerprint, 
  Layers,
  Sparkles
} from 'lucide-react';

const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: Wallet,
      title: "NoteCoin Economy",
      desc: "Your account is more than a profile—it's a digital wallet. Earn 10 coins for every upload and 5 coins for every 5-star review you receive.",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Search,
      title: "Semantic Discovery",
      desc: "Filter by Department, Academic Level (100L-400L), or Course Code. Find exactly what was taught yesterday in CSC 301.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: ShieldCheck,
      title: "Verified Integrity",
      desc: "Notes are peer-vetted. Only high-quality, readable materials survive. No more blurry photos of disorganized notebooks.",
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-blue-600"></div>
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm">Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 tracking-tight leading-none mb-6">
            Everything you need <br />
            to <span className="text-blue-600 underline decoration-8 underline-offset-[12px] decoration-blue-100">succeed.</span>
          </h2>
          <p className="max-w-xl text-lg text-gray-500 font-medium leading-relaxed">
            NoteNexus isn't just a folder of PDFs. It's a high-performance workspace 
            designed to reward the best students and support those in need.
          </p>
        </div>

        {/* --- FEATURE GRID --- */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((f, i) => (
            <div key={i} className="group p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2">
              <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">{f.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* --- DETAILED ACCOUNT EXPLANATION (THE HUB) --- */}
        <div className="relative bg-gray-900 rounded-[3.5rem] overflow-hidden p-8 md:p-20">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px] opacity-20"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl text-xs font-black mb-6 uppercase tracking-widest border border-blue-500/30">
                <Fingerprint className="w-4 h-4" />
                The NoteNexus Account
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                Your profile is your <br />
                <span className="text-blue-400 italic font-[1000]">Academic Resume.</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: Layers, 
                    t: "Centralized Dashboard", 
                    d: "Manage your uploads, track your NoteCoin balance, and see who's downloading your work in real-time." 
                  },
                  { 
                    icon: BarChart3, 
                    t: "Contribution Analytics", 
                    d: "Get insights on which departments need your notes most. High-demand topics earn 2x coins." 
                  },
                  { 
                    icon: Sparkles, 
                    t: "Reputation Badges", 
                    d: "Earn 'Top Contributor' or 'Subject Master' badges. These are visible to the entire Caleb University community." 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors duration-500">
                      <item.icon className="text-blue-400 w-6 h-6 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1 tracking-tight uppercase">{item.t}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Representation of the "Account" */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-[2.5rem] backdrop-blur-sm relative">
              <div className="p-6 bg-white rounded-3xl shadow-xl">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">AJ</div>
                       <div>
                          <p className="font-black text-gray-900 tracking-tight">Anyaeche Jude</p>
                          <p className="text-xs font-bold text-blue-600 uppercase">Computer Science • 400L</p>
                       </div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2">
                       <Wallet className="w-4 h-4 text-amber-500" />
                       <span className="font-black text-amber-700">1,240</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-gray-100 rounded-full"></div>
                    <div className="h-4 w-full bg-gray-100 rounded-full"></div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <div className="h-20 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Uploads</p>
                          <p className="text-2xl font-black text-blue-900">24</p>
                       </div>
                       <div className="h-20 rounded-2xl bg-green-50 border border-green-100 p-4">
                          <p className="text-[10px] font-black text-green-600 uppercase mb-1">Downloads</p>
                          <p className="text-2xl font-black text-green-900">458</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-3xl shadow-2xl animate-bounce-slow border-4 border-gray-900">
                 <Sparkles className="w-8 h-8 mb-2" />
                 <p className="font-black text-xs uppercase tracking-widest">Master<br/>Contributor</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;