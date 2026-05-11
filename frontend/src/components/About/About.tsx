import React from 'react';
import { ShieldCheck, Zap, Target, Quote } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- THE JOKE BOX (The "Obvious" Joke) --- */}
        <div className="mb-20 transform -rotate-1">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
            <div className="absolute -top-6 -left-6 bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Quote className="text-white w-8 h-8 rotate-180" />
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-white italic leading-relaxed">
                "We asked 100 Caleb University students why they missed their 8:00 AM lecture. 
                10% said they were sick. 90% said they knew <span className="text-blue-400 underline decoration-2 underline-offset-8">NoteNexus</span> would have the notes by noon anyway."
              </p>
              <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.3em] text-sm">
                — (Please don't tell the Dean, we're helping!)
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: PURPOSE --- */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-black mb-6 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 leading-[1.1] mb-8">
              Born from the chaos of <span className="text-blue-600">WhatsApp Groups.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-6">
              Let’s be honest: searching through 500 unread messages in a departmental WhatsApp group 
              to find a single PDF is a nightmare. Notes get lost, links expire, and contributors get zero credit.
            </p>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
              <span className="text-gray-900 font-bold">NoteNexus</span> is the solution. We’ve built a structured, 
              department-first ecosystem where quality academic materials are preserved, 
              vetted by peers, and rewarded with digital currency.
            </p>
          </div>

          <div className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform duration-500 -z-10 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Students Collaborating" 
              className="rounded-[3rem] shadow-2xl object-cover h-[400px] w-full border-4 border-white transition-transform duration-500 group-hover:-translate-y-2"
            />
          </div>
        </div>

        {/* --- THE "MUST-HAVES" (Requirements for Success) --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Content",
              desc: "Every resource must be rated 4-stars or higher by fellow students to remain in the premium library.",
              color: "bg-green-50 text-green-600"
            },
            {
              icon: Zap,
              title: "Instant Access",
              desc: "No more waiting for an admin to approve your request. Click, download, and study instantly.",
              color: "bg-amber-50 text-amber-600"
            },
            {
              icon: targetIcon, // Fixed variable below
              title: "Department Focused",
              desc: "Tailored specifically for Caleb University’s curriculum—from Computer Science to Law.",
              color: "bg-blue-50 text-blue-600"
            }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${item.color}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed italic">
                "{item.desc}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Internal icon fix for the map
const targetIcon = Target;

export default About;