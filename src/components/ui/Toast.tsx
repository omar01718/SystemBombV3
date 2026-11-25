'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2.5 sm:max-w-sm sm:w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
        };

        const styles = {
          success: 'border-emerald-500/35 shadow-emerald-950/50',
          error: 'border-red-500/35 shadow-red-950/50',
          warning: 'border-amber-500/35 shadow-amber-950/50',
          info: 'border-sky-500/35 shadow-sky-950/50',
        };

        const bars = {
          success: 'bg-emerald-500',
          error: 'bg-red-500',
          warning: 'bg-amber-500',
          info: 'bg-sky-500',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-[#0D1322]/95 border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${styles[toast.type]}`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 bottom-0 w-1 ${bars[toast.type]}`}
            />
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-white leading-snug">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
