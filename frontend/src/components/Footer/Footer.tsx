import React from 'react';
import { Link } from 'react-router-dom';
// Using Lu prefix for Lucide and Fa for FontAwesome (Brands)
import { LuHeart, LuExternalLink, LuMail, LuPhone } from 'react-icons/lu';
import { FaGithub, FaXTwitter, FaLinkedin } from 'react-icons/fa6';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- TOP SECTION: BRAND & LINKS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="NoteNexus" className="h-10 w-10" />
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                Note<span className="text-blue-600">Nexus</span>
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              The premier collaborative platform for Caleb University students. 
              Built to preserve knowledge and reward academic excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 italic">Platform</h4>
            <ul className="space-y-4">
              {['Browse Notes', 'Leaderboard', 'NoteCoin Economy', 'Documentation'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 font-bold hover:text-blue-600 transition-colors flex items-center gap-2 group text-sm uppercase tracking-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 italic">Community</h4>
            <ul className="space-y-4">
              {['Features', 'How it Works', 'FAQ', 'Contact Support'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-500 font-bold hover:text-blue-600 transition-colors flex items-center gap-2 group text-sm uppercase tracking-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <LuMail className="text-blue-600 w-5 h-5" />
                <span className="text-sm font-bold text-gray-600">support@notenexus.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <LuPhone className="text-blue-600 w-5 h-5" />
                <span className="text-sm font-bold text-gray-600">+234 [Your Number]</span>
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                Visit Caleb Uni <LuExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT & CREDITS --- */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-gray-400 tracking-tight uppercase italic">
              © {currentYear} NoteNexus Platform. All rights reserved.
            </p>
            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mt-1">
              Department of Computer Science • Caleb University
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 group hover:border-blue-200 transition-all">
            <span className="text-sm font-bold text-gray-500">Developed with</span>
            <LuHeart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">by Anyaeche Jude</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
