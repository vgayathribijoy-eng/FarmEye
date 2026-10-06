import React from 'react';
import { Upload, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload or Capture',
      desc: 'Snap a clear photo of your cashew fruit and nut using your smartphone camera or drag & drop a file.',
      icon: Upload,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      step: '02',
      title: 'AI Neural Analysis',
      desc: 'Our deep computer vision model inspects cashew apple color, receptacle swelling, and nut density.',
      icon: Cpu,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      step: '03',
      title: 'Get Harvest Insights',
      desc: 'Receive immediate Mature / Not Mature status with confidence ratings and tailored farming tips.',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative bg-[#090D0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Simple 3-Step Process
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FarmEye Works
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Get precision maturity assessments powered by advanced machine learning in under 3 seconds.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="glass-card glass-card-hover rounded-2xl p-8 space-y-5 relative group border border-white/10"
              >
                {/* Step Number & Icon Header */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-slate-700/60 font-mono">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 text-left">
                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
