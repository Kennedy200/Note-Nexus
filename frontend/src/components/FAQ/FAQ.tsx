import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Info, Coins, ShieldAlert, GraduationCap } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: "Coins & Rewards",
      question: "How exactly do I earn NoteCoins?",
      answer: "You earn 10 coins for every verified upload. You also get bonus coins when your notes hit 50 downloads or maintain a 4.8-star rating. Basically, quality work = rich wallet."
    },
    {
      category: "Accountability",
      question: "What happens if I upload 'trash' or empty files?",
      answer: "Our peer-review system will flag it. If your content is consistently rated 1-star or flagged as spam, your account will be suspended and your coin balance wiped. Stay accountable."
    },
    {
      category: "Coins & Rewards",
      question: "Can I withdraw NoteCoins as real money?",
      answer: "As much as we'd love to pay your tuition, NoteCoins are strictly virtual. They are used to unlock premium past questions, exam summaries, and study guides within the platform."
    },
    {
      category: "Privacy",
      question: "Will my lecturers see what I share?",
      answer: "NoteNexus is a student-led collaborative platform. While it's public, the goal is peer-to-peer support. Just don't share leaked exam papers—that's a one-way ticket to the disciplinary committee."
    },
    {
      category: "Technical",
      question: "Which file formats are supported?",
      answer: "We support PDF, DOCX, and high-quality images (JPEG/PNG). Please ensure your handwriting is legible if you're uploading photo-scans. If we can't read it, we won't coin it!"
    },
    {
      category: "Academic",
      question: "Is this only for Computer Science students?",
      answer: "Currently, we are piloting with the Computer Science department, but our architecture supports every department in Caleb University. Tell your friends in Law and Mass Comm to get ready!"
    },
    {
      category: "Accountability",
      question: "Can I use NoteCoins to buy food at the cafeteria?",
      answer: "Nice try! But no. Your NoteCoins are for your brain, not your stomach. Use them to pass your exams so you can graduate and buy all the food you want later."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-sm mb-4">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 tracking-tighter leading-none">
              Got Questions? <br />
              <span className="text-blue-600">We’ve got answers.</span>
            </h2>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase">Still confused?</p>
              <p className="text-xs font-bold text-gray-500 underline cursor-pointer hover:text-blue-600 transition-colors">Contact Support</p>
            </div>
          </div>
        </div>

        {/* --- FAQ GRID --- */}
        <div className="grid lg:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group transition-all duration-300 rounded-[2rem] border ${
                openIndex === index 
                ? 'bg-white border-blue-200 shadow-xl shadow-blue-500/5' 
                : 'bg-white/50 border-gray-100 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full p-8 flex items-start justify-between text-left"
              >
                <div className="flex gap-4">
                  <div className={`mt-1 shrink-0 ${openIndex === index ? 'text-blue-600' : 'text-gray-400'}`}>
                    {faq.category === "Coins & Rewards" && <Coins className="w-5 h-5" />}
                    {faq.category === "Accountability" && <ShieldAlert className="w-5 h-5" />}
                    {faq.category === "Technical" && <Info className="w-5 h-5" />}
                    {faq.category === "Academic" && <GraduationCap className="w-5 h-5" />}
                    {faq.category === "Privacy" && <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <div className={`mt-1 p-2 rounded-lg transition-colors ${openIndex === index ? 'bg-blue-50 text-blue-600' : 'text-gray-400 group-hover:bg-gray-100'}`}>
                  {openIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8 pt-0 ml-9">
                  <p className="text-gray-600 text-lg leading-relaxed font-medium italic border-l-4 border-blue-100 pl-6">
                    "{faq.answer}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM DECORATION --- */}
        <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent opacity-50"></div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">
            Did we miss something?
          </h3>
          <p className="text-gray-400 font-medium mb-8 relative z-10 max-w-xl mx-auto">
            If your question is about the cafeteria menu or why your crush hasn't texted back, 
            we can't help. For everything else, hit our support team.
          </p>
          <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 relative z-10">
            Chat with Note-Nexus Team
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQ;