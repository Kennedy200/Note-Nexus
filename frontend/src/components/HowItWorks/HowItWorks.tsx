import React from 'react';
import { 
  UserPlus, 
  UploadCloud, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: "01",
      icon: UserPlus,
      title: "Join the Nexus",
      desc: "Create your account using your student credentials. Every new member gets 5 NoteCoins as a welcome gift to start their journey.",
      action: "Sign Up Free"
    },
    {
      id: "02",
      icon: UploadCloud,
      title: "Share the Wealth",
      desc: "Upload your high-quality lecture notes (PDF/DOCX). Once our system verifies the file, 10 NoteCoins are instantly added to your wallet.",
      action: "Upload Now"
    },
    {
      id: "03",
      icon: Search,
      title: "Exchange & Conquer",
      desc: "Browse the library. Use your earned coins to unlock premium exam summaries and past questions from top-performing seniors.",
      action: "Explore Library"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 tracking-tighter mb-6">
            Three Steps to <span className="text-blue-600">Academic Glory.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
            We’ve removed the friction from note-sharing. No more begging on WhatsApp. 
            Just a clean, automated system designed for results.
          </p>
        </div>

        {/* --- STEPS GRID --- */}
        <div className="grid lg:grid-cols-3 gap-12 mb-24 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 flex flex-col items-center text-center">
                
                {/* Step Number Badge */}
                <div className="absolute -top-6 bg-white border border-gray-100 px-5 py-2 rounded-full shadow-lg">
                  <span className="text-blue-600 font-black text-lg italic tracking-tighter">{step.id}</span>
                </div>

                <div className="w-20 h-20 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                  <step.icon className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase tracking-tighter">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8 italic">
                  "{step.desc}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- THE OBVIOUS JOKE (Disclaimer Style) --- */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:bg-red-100/50 transition-colors">
            {/* Background Icon Decoration */}
            <AlertTriangle className="absolute -right-8 -bottom-8 w-48 h-48 text-red-200 opacity-20 -rotate-12" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shrink-0 animate-pulse shadow-lg shadow-red-200">
                <AlertTriangle className="w-10 h-10" />
              </div>
              
              <div className="text-center md:text-left">
                <h4 className="text-xl font-black text-red-900 uppercase tracking-tighter mb-2 italic">Legal Disclaimer (Kind of)</h4>
                <p className="text-red-700/80 font-bold leading-relaxed text-lg italic">
                  "NoteNexus is not a substitute for actually attending lectures. 
                  We cannot sign the attendance sheet for you, nor can we help you 
                  negotiate with the lecturer when you're 5 minutes late to an 8 AM class. 
                  <span className="text-red-900 font-black"> Nice try, though."</span>
                </p>
                <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-red-600 text-xs font-black uppercase tracking-[0.2em]">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Caleb Logic
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;