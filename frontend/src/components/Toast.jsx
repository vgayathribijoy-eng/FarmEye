import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-950 border-emerald-500/50 text-emerald-200',
          iconColor: 'text-emerald-400',
        };
      case 'error':
        return {
          icon: XCircle,
          bg: 'bg-rose-950 border-rose-500/50 text-rose-200',
          iconColor: 'text-rose-400',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-950 border-amber-500/50 text-amber-200',
          iconColor: 'text-amber-400',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-slate-900 border-slate-700 text-slate-200',
          iconColor: 'text-slate-400',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slideUp">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${config.bg}`}>
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 text-xs font-medium leading-relaxed">{message}</div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
