import React from 'react';
import { Shield, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0813] border-t border-[#1a1425] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] p-1.5 rounded-lg">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-sm font-black text-white tracking-tighter">
            Safety<span className="text-[#ff4b91]">for</span>Her
          </span>
        </div>

        {/* Copyright & Info */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[#3e324d] text-[10px] font-black uppercase tracking-[0.2em]">
            © {currentYear} All Rights Reserved
          </p>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <a href="jnkarim" className="text-[#907aa9] hover:text-[#ff4b91] transition-colors">
            <Github size={18} />
          </a>
          <a href="#" className="text-[#907aa9] hover:text-[#ff4b91] transition-colors">
            <Mail size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;