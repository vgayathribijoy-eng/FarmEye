import React from 'react';
import { Sun, Focus, Image, ShieldAlert } from 'lucide-react';

export const PhotoTips = () => {
  const tips = [
    {
      title: 'Optimal Lighting',
      desc: 'Capture under natural daylight or bright indirect sun. Avoid heavy backlight or harsh dark shadows.',
      icon: Sun,
      color: 'text-amber-400',
    },
    {
      title: 'Plain Background',
      desc: 'Place the cashew against a simple, uncluttered background like a neutral sheet or palm surface.',
      icon: Image,
      color: 'text-emerald-400',
    },
    {
      title: 'Close-Up Framing',
      desc: 'Fill 60-80% of the camera frame with both the cashew apple (receptacle) and attached nut.',
      icon: Focus,
      color: 'text-emerald-400',
    },
    {
      title: 'Avoid Motion Blur',
      desc: 'Hold your camera steady and ensure sharp focus before snapping to prevent low confidence scores.',
      icon: ShieldAlert,
      color: 'text-amber-400',
    },
  ];

  return (
    <section id="photo-tips" className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Maximizing Accuracy
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Tips for Best Diagnostic Photos
          </h3>
          <p className="text-slate-400 text-sm">
            Following these 4 photo guidelines guarantees high model confidence (&gt;85%) and precise maturity ratings.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-xl p-6 space-y-4 border border-white/10 text-left hover:border-emerald-500/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
