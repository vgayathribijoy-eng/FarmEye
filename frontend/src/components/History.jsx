import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, CheckCircle2, AlertTriangle, HelpCircle, Eye, Calendar, X } from 'lucide-react';

export const History = ({ historyItems, onClearHistory }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const getStatusBadge = (label, confidence) => {
    if (confidence < 0.70 || label === 'uncertain') {
      return {
        text: 'Uncertain',
        bg: 'bg-slate-800 text-slate-300 border-slate-700',
        icon: HelpCircle,
      };
    }
    if (label === 'mature') {
      return {
        text: 'Mature',
        bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle2,
      };
    }
    return {
      text: 'Not Mature',
      bg: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
    };
  };

  return (
    <section id="history" className="py-16 md:py-24 bg-[#090D0C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <HistoryIcon className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Recent Analysis History</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Saved locally on your browser. Last 10 scans recorded.
            </p>
          </div>

          {historyItems && historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* History Grid / Empty State */}
        {!historyItems || historyItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-white/10 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <HistoryIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">No scan history yet</h4>
              <p className="text-xs text-slate-400">
                Your analyzed cashew photos and results will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems.map((item) => {
              const badge = getStatusBadge(item.label, item.confidence);
              const BadgeIcon = badge.icon;
              const dateStr = item.timestamp
                ? new Date(item.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now';

              return (
                <div
                  key={item.id}
                  className="glass-card glass-card-hover rounded-2xl p-4 border border-white/10 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex gap-4 items-center">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-left flex-1 min-w-0">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${badge.bg}`}>
                        <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{badge.text}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="font-bold text-white">
                          {Math.round((item.confidence || 0) * 100)}%
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px] truncate flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Action */}
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Detail</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#121816] rounded-2xl border border-white/10 shadow-2xl p-6 space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base">Historical Diagnostic Log</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedItem.thumbnail && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={selectedItem.thumbnail}
                    alt="Detail"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Classification:</span>
                  <span className="text-sm font-bold text-white uppercase">{selectedItem.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Confidence Rating:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {Math.round((selectedItem.confidence || 0) * 100)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400">AI Summary:</span>
                  <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                    {selectedItem.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400"
              >
                Close Log
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
