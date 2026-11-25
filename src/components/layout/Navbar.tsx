'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Shield, ShieldAlert, Flame, FileSpreadsheet, LogOut, Lock } from 'lucide-react';

function formatLimaTime24(): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

export const Navbar: React.FC = () => {
  const { currentUser, exportInventoryCSV, logout } = useApp();
  const [liveTime, setLiveTime] = useState<string>('--:--:--');

  useEffect(() => {
    const initial = setTimeout(() => {
      setLiveTime(formatLimaTime24());
    }, 0);
    const interval = setInterval(() => {
      setLiveTime(formatLimaTime24());
    }, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const isAdmin = currentUser.role === 'admin_logistica';

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#090E1A]/90 backdrop-blur-xl border-b border-white/[0.08] text-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        {/* Left: Institutional Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-amber-500/15 border border-red-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.25)] shrink-0">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                SystemBomb
              </h1>
              <span className="font-mono px-1.5 py-0.5 text-[10px] font-semibold bg-red-600 text-white rounded tracking-wider shrink-0">
                v3.0
              </span>
              <span className="hidden xl:inline-flex font-mono px-2 py-0.5 text-[10px] font-medium bg-white/[0.04] text-slate-300 border border-white/10 rounded-full tracking-wider">
                B-233 PAUCARPATA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              VII Comandancia Departamental Arequipa • CGBVP
            </p>
          </div>
        </div>

        {/* Center/Right: Telemetry, Quick CSV, User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Telemetry (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1322] border border-white/[0.08]">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-400 tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EN LÍNEA</span>
            </span>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <span className="font-mono text-[11px] text-slate-300 tabular-nums">{liveTime} PET</span>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
              <Lock className="w-3 h-3" />
              <span>TLS</span>
            </span>
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportInventoryCSV}
            title="Descargar reporte CSV de inventario"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D1322] hover:bg-white/[0.06] border border-white/10 text-slate-200 transition-colors text-xs font-medium cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-mono text-[11px]">CSV</span>
          </button>

          {/* Operator Profile Pill */}
          <div className="flex items-center gap-2 bg-[#0D1322] border border-white/10 px-2 py-1.5 sm:px-2.5 rounded-xl">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                isAdmin
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
              }`}
            >
              {isAdmin ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </div>

            <div className="text-left hidden sm:block pr-1 max-w-[160px]">
              <div className="text-xs font-semibold text-white leading-tight truncate">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight truncate">
                {currentUser.rank}
              </div>
            </div>

            <span
              className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                isAdmin
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
              }`}
            >
              {isAdmin ? 'Admin' : 'Operativo'}
            </span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión institucional y volver al Login"
            className="px-2.5 py-2 sm:px-3 rounded-xl bg-[#0D1322] hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-300 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
