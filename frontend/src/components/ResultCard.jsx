import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Download, 
  RotateCcw, 
  Info, 
  Check, 
  Sparkles,
  ShieldAlert,
  Leaf
} from 'lucide-react';

export const ResultCard = ({ result, imagePreview, onReset }) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!result) return null;

  const { label, confidence, message, mode } = result;
  const confidencePercent = Math.round((confidence || 0) * 100);

  // Status configuration mappings
  const getStatusConfig = () => {
    if (confidence < 0.70 || label === 'uncertain') {
      return {
        key: 'uncertain',
        title: 'Uncertain Maturity',
        badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        strokeColor: '#64748B',
        icon: HelpCircle,
        headerBg: 'from-slate-900 to-slate-950',
        tip: 'Photo quality or lighting prevented high-confidence prediction. Ensure proper lighting and a close-up angle of the cashew apple and nut.',
      };
    }
    if (label === 'mature') {
      return {
        key: 'mature',
        title: 'Mature Cashew',
        badgeColor: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
        strokeColor: '#22C55E',
        icon: CheckCircle2,
        headerBg: 'from-emerald-950/50 to-[#121816]',
        tip: 'Mature cashews are ready for harvest. Receptacle juices are ripe and the cashew nut has reached full kernel filling weight.',
      };
    }
    return {
      key: 'not_mature',
      title: 'Not Mature',
      badgeColor: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
      strokeColor: '#F5B544',
      icon: AlertTriangle,
      headerBg: 'from-amber-950/40 to-[#121816]',
      tip: 'The cashew receptacle is still developing. Harvesting now will result in lower nut yield and under-developed flavor profiles.',
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // SVG Gauge parameters
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidencePercent / 100) * circumference;

  const handleDownloadResult = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#0B0F0E',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `FarmEye_Cashew_Result_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
      {/* Printable Card Area */}
      <div
        ref={cardRef}
        className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
      >
        {/* Header branding on card export */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-white text-lg tracking-tight">FarmEye AI Report</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 items-center">
          {/* Image Thumbnail */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Analyzed Cashew"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                No preview available
              </div>
            )}
            
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-slate-300 backdrop-blur-sm border border-white/10">
              {mode === 'mock' ? 'Mock Mode AI' : 'Deep Neural Network'}
            </div>
          </div>

          {/* Status & Animated Meter */}
          <div className="space-y-5 text-center sm:text-left">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-lg ${statusConfig.badgeColor}`}>
              <StatusIcon className="w-5 h-5 shrink-0" />
              <span>{statusConfig.title}</span>
            </div>

            {/* Circular Meter */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={statusConfig.strokeColor}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-white">{confidencePercent}%</span>
                  <span className="text-[9px] uppercase font-semibold text-slate-400">Confidence</span>
                </div>
              </div>

              <div className="text-left space-y-1">
                <h4 className="text-sm font-semibold text-white">Diagnostic Score</h4>
                <p className="text-xs text-slate-400">
                  {confidencePercent >= 70
                    ? 'High precision classification'
                    : 'Low confidence threshold (< 70%)'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Low Confidence Warning Alert */}
        {confidence < 0.70 && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Uncertain State Active</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Because confidence is below 70%, FarmEye automatically classifies this scan as <strong>Uncertain</strong>. We recommend retaking the photo in direct daylight with a plain background.
              </p>
            </div>
          </div>
        )}

        {/* Diagnostic Explanation */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Analysis Breakdown</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
        </div>

        {/* Harvesting / Action Tips */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Farming & Harvesting Tip</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{statusConfig.tip}</p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-200 bg-[#121816] hover:bg-[#1A2320] border border-white/10 transition-all hover:scale-[1.02]"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Analyze another image</span>
        </button>

        <button
          onClick={handleDownloadResult}
          disabled={downloading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Exporting Report...' : 'Download Result (PNG)'}</span>
        </button>
      </div>
    </div>
  );
};
