import React from 'react';
import { Upload, Camera, Zap, ShieldCheck, Award, ArrowDown } from 'lucide-react';

export const Hero = ({ onSelectUpload, onSelectCamera }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Animated Light Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none animate-float" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Computer Vision Diagnostic Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Know your cashew's <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              maturity in seconds
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload or capture a photo of your cashew fruit and nut. Our trained neural network analyzes receptacle color, swelling, and nut density to guide your harvesting schedule.
          </p>

          {/* Call-to-action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#analyzer"
              onClick={onSelectUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-5 h-5 text-emerald-100" />
              <span>Upload Image</span>
            </a>

            <a
              href="#analyzer"
              onClick={onSelectCamera}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-[#121816] hover:bg-[#1A2320] border border-white/10 hover:border-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Use Camera</span>
            </a>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-xl mx-auto border-t border-white/5">
            <div className="text-center space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Instant</span>
              </div>
              <p className="text-xs text-slate-400">Real-time scan</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Harvest</span>
              </div>
              <p className="text-xs text-slate-400">Actionable advice</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>Strict</span>
              </div>
              <p className="text-xs text-slate-400">&gt;70% confidence cutoff</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
