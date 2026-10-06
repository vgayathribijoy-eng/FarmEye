import React from 'react';
import { Logo } from './Logo';
import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070A09] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="space-y-2 text-center md:text-left">
            <Logo iconSize={32} />
            <p className="text-slate-400 text-xs max-w-sm">
              AI-driven cashew fruit & nut maturity diagnostic web application for modern agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-300">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#analyzer" className="hover:text-emerald-400 transition-colors">Analyze</a>
            <a href="#photo-tips" className="hover:text-emerald-400 transition-colors">Photo Tips</a>
            <a href="#history" className="hover:text-emerald-400 transition-colors">History</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FarmEye AI Systems. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time Local Processing</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
