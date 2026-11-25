'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, addToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberStation, setRememberStation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen w-full grid lg:grid-cols-[1.35fr_1fr] xl:grid-cols-[1.48fr_1fr] bg-[#070b12] text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Left Panel: Firefighter Hero Image + Institutional Branding */}
      <section className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Background Photo */}
        <Image
          src="/images/bombero-login.jpg"
          alt="Bombero de la Compañía B-233 en acción"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center scale-[1.01]"
        />

        {/* Dark Gradient Overlays for Contrast & Split Integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/35 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-[#070b12]/90" />

        {/* Top-Left Institutional Header */}
        <div className="relative z-10 max-w-2xl space-y-2">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-slate-300/90">
            VII COMANDANCIA DEPARTAMENTAL AREQUIPA
          </p>
          <h2 className="font-display text-xl sm:text-2xl lg:text-[26px] font-semibold tracking-tight text-white leading-snug">
            Compañía de Bomberos Virgen de Chapi N.° 233 (Paucarpata)
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-300/75 pt-0.5">
            DIOS • PATRIA • HUMANIDAD
          </p>
        </div>

        {/* Bottom-Left Subtle Tactical Telemetry */}
        <div className="relative z-10 hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-300/80">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-white/10 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>ESTACIÓN B-233 • PAUCARPATA, AREQUIPA</span>
          </span>
        </div>
      </section>

      {/* Right Panel: Tactical Dark Mode Login */}
      <section className="relative flex flex-col justify-between px-5 py-8 sm:px-10 sm:py-10 lg:px-12 bg-[#090e17] overflow-hidden">
        {/* Subtle Tactical Grid & Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.16) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 rounded-full bg-red-600/10 blur-3xl"
        />

        {/* Top Brand + Status Row */}
        <header className="relative z-10 w-full max-w-md mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/25 to-amber-500/10 border border-red-500/35 shadow-lg shadow-red-950/40">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                SystemBomb
              </span>
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-red-600 text-white tracking-wider">
                v3.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 font-mono text-[10px] font-medium text-emerald-400 tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SISTEMA EN LÍNEA</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/70 font-mono text-[9px] text-slate-300 leading-tight">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <div className="flex flex-col">
                <span className="tracking-wider">ACCESO ENCRIPTADO</span>
                <span className="text-slate-400">AES-256</span>
              </div>
            </div>
          </div>
        </header>

        {/* Center Tactical Card */}
        <div className="relative z-10 w-full max-w-md mx-auto my-8">
          <div className="relative rounded-2xl bg-[#0e1522]/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
            {/* Fine Tactical Corner Accents */}
            <span className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l border-slate-500/60 rounded-tl-2xl" />
            <span className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-500/60 rounded-tr-2xl" />
            <span className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-500/60 rounded-bl-2xl" />
            <span className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-500/60 rounded-br-2xl" />

            <div className="mb-6">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                CONTROL DE ACCESO{' '}
                <span className="font-normal text-slate-400">OPERATIVO</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090e17] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 transition-all"
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#090e17] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Alternar visibilidad de contraseña"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Station Remember + Support */}
              <div className="space-y-2.5 pt-0.5">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberStation}
                    onChange={(e) => setRememberStation(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-[#090e17] text-red-600 focus:ring-red-500/40 focus:ring-offset-0 cursor-pointer"
                  />
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

              {/* Red CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:via-red-500 hover:to-red-600 text-white font-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-red-950/60 border border-red-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>

        {/* Tactical Security Footer */}
        <footer className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            <span>SISTEMA DE SEGURIDAD MONITOREADO • ACCESO EXCLUSIVO CGBVP</span>
          </div>
          <span className="font-mono text-[10px] text-slate-600">v3.0.4</span>
        </footer>
      </section>
    </div>
  );
};
