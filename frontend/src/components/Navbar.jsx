import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export const Navbar = ({ backendStatus, onNavigateToAnalyzer }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Analyze', href: '#analyzer' },
    { name: 'Photo Tips', href: '#photo-tips' },
    { name: 'History', href: '#history' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F0E]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1">
          <Logo iconSize={34} />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Status Badge */}
        <div className="hidden md:flex items-center gap-4">
          {/* API Health Pill */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/20 text-emerald-400"
            title={backendStatus.mockMode ? 'Backend using AI Mock Heuristic engine' : 'Backend connected to AI Model'}
          >
            {backendStatus.online ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{backendStatus.mockMode ? 'Mock AI Active' : 'AI Model Connected'}</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Standalone AI Engine</span>
              </>
            )}
          </div>

          <a
            href="#analyzer"
            onClick={onNavigateToAnalyzer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-md shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Analyze Now</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#121816] text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121816]/95 backdrop-blur-lg border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#analyzer"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateToAnalyzer) onNavigateToAnalyzer();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
