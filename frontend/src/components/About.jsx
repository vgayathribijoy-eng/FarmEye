import React from 'react';
import { ShieldCheck, Cpu, Leaf, Info, AlertTriangle } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Leaf className="w-3.5 h-3.5" />
            <span>Empowering Cashew Farmers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About FarmEye
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Combining agricultural domain science with state-of-the-art computer vision to optimize cashew harvest yields.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-8 border border-white/10 text-left">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Project Mission</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Harvesting cashews at peak maturity is critical for maximize kernel weight, raw cashew nut (RCN) quality, and processing value. Premature harvesting leads to shriveled kernels and lower oil content. <strong>FarmEye</strong> leverages deep learning image processing to analyze subtle visual maturity cues—such as apple color transition, receptacle firmness, and nut geometry—providing immediate feedback in the field.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy & Security</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Images uploaded or captured via camera are processed securely in memory during the prediction request. No photos are permanently stored or sold.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-amber-400" />
                <span>Easy Model Integration</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                FarmEye includes an intelligent built-in mock heuristic engine and a clean Python FastAPI architecture designed for plug-and-play integration of custom PyTorch, Keras, or ONNX neural networks.
              </p>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Agricultural Expert Disclaimer
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                FarmEye provides computer vision estimates based on optical surface analysis. Results are advisory and should always be verified by an experienced farmer or agricultural specialist prior to large-scale commercial harvesting decisions.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
