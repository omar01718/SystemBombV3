'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import {
  Flame,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Radio,
  Check,
} from 'lucide-react';

function formatLimaTime24(): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

export const LoginView: React.FC = () => {
  const { login, addToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberStation, setRememberStation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
    } catch {
      addToast('error', 'Error de conexión', 'No se pudo verificar el acceso. Inténtelo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportClick = () => {
    addToast(
      'info',
      'Soporte Estación B-233',
      'Solicite el restablecimiento de credenciales al Administrador de Logística de la compañía.'
    );
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[58%_42%] bg-[#070B14] text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Left Panel (58% desktop / 220px mobile header) */}
      <section className="relative h-[220px] sm:h-[260px] lg:h-auto lg:min-h-screen overflow-hidden flex flex-col justify-between p-5 sm:p-8 lg:p-12">
        {/* Background Photo with dark cinematic filter */}
        <Image
          src="/images/bombero-login.jpg"
          alt="Bombero de la Compañía B-233 en acción"
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-center brightness-[0.82] contrast-[1.08] saturate-[1.08]"
        />

        {/* Mobile bottom fade into #070B14 */}
        <div
          aria-hidden="true"
          className="lg:hidden absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(6,10,19,0.35) 0%, rgba(6,10,19,0.65) 60%, #070B14 100%)',
          }}
        />

        {/* Desktop smooth lateral gradient into #070B14 (no hard vertical border) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(6,10,19,0.15) 0%, rgba(6,10,19,0.55) 70%, #070B14 100%)',
          }}
        />

        {/* Subtle vertical vignette for top/bottom text legibility */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-0 bg-gradient-to-b from-[#060A13]/75 via-transparent to-[#070B14]/85"
        />

        {/* Top-Left Institutional Block */}
        <div className="relative z-10 max-w-xl space-y-1.5 lg:space-y-2.5">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-amber-400/90">
            VII COMANDANCIA DEPARTAMENTAL AREQUIPA
          </p>
          <h2 className="font-display text-xl sm:text-2xl lg:text-[32px] font-bold tracking-tight text-white leading-[1.15] text-balance">
            Compañía de Bomberos Virgen de Chapi N.º 233
          </h2>
          <p className="font-sans text-xs sm:text-sm lg:text-base font-medium text-slate-300">
            Paucarpata • Arequipa
          </p>
          <div className="hidden sm:flex items-center gap-2.5 pt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-300/80">
            <span>DIOS</span>
            <span className="text-red-500/80">•</span>
            <span>PATRIA</span>
            <span className="text-red-500/80">•</span>
            <span>HUMANIDAD</span>
          </div>
        </div>

        {/* Bottom-Left Glassmorphism Operational Telemetry Bar */}
        <div className="relative z-10 hidden lg:flex items-center">
          <div className="inline-flex items-center gap-4 px-4 py-2.5 rounded-xl backdrop-blur-md bg-black/40 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-200 tracking-wider">
              <Radio className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-semibold text-white">ESTACIÓN B-233</span>
            </div>
            <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
            <span className="font-mono text-[11px] text-slate-300 tracking-wider">
              PAUCARPATA, AREQUIPA
            </span>
            <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
            <span className="font-mono text-[11px] text-emerald-400 tracking-wider tabular-nums">
              {liveTime} PET
            </span>
          </div>
        </div>
      </section>

      {/* Right Panel (42% desktop): C4i Tactical Console */}
      <section className="relative flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-10 bg-[#070B14] overflow-hidden">
        {/* Layer 1: Topographic Contour SVG Pattern with radial mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cg fill='none' stroke='%2394a3b8' stroke-width='1'%3E%3Cpath d='M-40 60 C 40 10, 120 110, 200 60 C 280 10, 340 90, 440 50'/%3E%3Cpath d='M-40 120 C 50 70, 130 160, 210 110 C 290 60, 350 140, 440 100'/%3E%3Cpath d='M-40 180 C 60 130, 140 220, 220 170 C 300 120, 360 200, 440 160'/%3E%3Cpath d='M-40 240 C 50 190, 150 280, 230 230 C 310 180, 370 250, 440 220'/%3E%3Cpath d='M-40 300 C 60 250, 140 340, 220 290 C 300 240, 360 320, 440 280'/%3E%3Cpath d='M-40 360 C 50 310, 130 390, 210 350 C 290 310, 350 380, 440 340'/%3E%3Ccircle cx='200' cy='200' r='90' stroke-dasharray='4 6'/%3E%3Ccircle cx='200' cy='200' r='155' stroke-dasharray='2 8'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '400px 400px',
          }}
        />

        {/* Layer 2: Subtle Dark Red Ambient Glow behind top of login card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 28%, rgba(220,38,38,0.16) 0%, rgba(127,29,29,0.06) 42%, transparent 72%)',
          }}
        />

        {/* Tactical Console Outer Frame (max-w-[440px], balanced vertical rhythm) */}
        <div className="relative z-10 max-w-[440px] w-full mx-auto rounded-2xl border border-white/[0.08] bg-[#0A0F1C]/60 p-6 backdrop-blur-sm space-y-5">
          {/* Header aligned to card width */}
          <header className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/25 to-amber-500/10 border border-red-500/35 shadow-[0_0_20px_rgba(220,38,38,0.28)]">
                <Flame className="w-4.5 h-4.5 text-red-500" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display text-lg font-bold tracking-tight text-white truncate">
                  SystemBomb
                </span>
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-600 text-white tracking-wider shrink-0">
                  v3.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 font-mono text-[10px] font-medium text-emerald-400 tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SISTEMA EN LÍNEA</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#090E1A] border border-white/10 font-mono text-[10px] text-slate-300 tracking-wider">
                <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>AES-256</span>
              </div>
            </div>
          </header>

          {/* Premium Glassmorphism Login Card */}
          <div className="relative rounded-2xl bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {/* Tactical 8px Corner Accents in subtle red */}
            <span className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/50 rounded-tl-2xl" />
            <span className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/50 rounded-tr-2xl" />
            <span className="pointer-events-none absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500/50 rounded-bl-2xl" />
            <span className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/50 rounded-br-2xl" />

            <div className="mb-5">
              <h1 className="font-display text-lg font-bold tracking-tight text-white uppercase">
                CONTROL DE ACCESO{' '}
                <span className="font-normal text-slate-400">OPERATIVO</span>
              </h1>
              <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                Autenticación para personal autorizado y comando de incidentes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institutional Email / Code */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  CORREO INSTITUCIONAL / CÓDIGO EFECTIVO
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ejemplo@bomberos.pe"
                    className="h-12 w-full pl-10 pr-4 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  CONTRASEÑA
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-12 w-full pl-10 pr-11 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Alternar visibilidad de contraseña"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Custom Dark Mode Checkbox + Support */}
              <div className="space-y-2.5 pt-0.5">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <span className="relative inline-flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={rememberStation}
                      onChange={(e) => setRememberStation(e.target.checked)}
                      className="peer appearance-none h-4 w-4 rounded bg-[#090E1A] border border-white/20 checked:bg-red-600 checked:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 transition-colors cursor-pointer"
                    />
                    <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </span>
                  <span>Mantener sesión activa en esta estación (B-233)</span>
                </label>

                <button
                  type="button"
                  onClick={handleSupportClick}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  ¿Olvidó su contraseña o requiere soporte?
                </button>
              </div>

              {/* Crimson Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative h-12 w-full mt-1 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_25px_-5px_rgba(220,38,38,0.25)] border border-red-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <span className="font-mono">VERIFICANDO CREDENCIALES...</span>
                ) : (
                  <>
                    <span>INGRESAR AL PUESTO DE MANDO</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Legible Tactical Security Footer (11px text-slate-400) */}
          <footer className="w-full flex flex-col items-center gap-1 text-center pt-1">
            <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] tracking-wider text-slate-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/90 shrink-0" />
              <span>SISTEMA DE SEGURIDAD MONITOREADO • ACCESO EXCLUSIVO CGBVP • v3.0.4</span>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};
