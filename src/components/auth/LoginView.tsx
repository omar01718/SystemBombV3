'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import {
  Flame,
  Shield,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, addToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-slate-950 text-slate-100 p-4 relative overflow-hidden selection:bg-red-600 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-radial from-slate-900/50 to-transparent pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Institutional Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 shadow-xl shadow-red-950/60 ring-2 ring-red-500/30 mb-2">
            <Flame className="w-9 h-9 text-white animate-pulse" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-[11px] font-semibold text-red-400 tracking-wide uppercase mb-1">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>VII Comandancia Departamental Arequipa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              SystemBomb <span className="text-red-500 text-lg">v3.0</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Compañía de Bomberos Virgen de Chapi N.° 233 (Paucarpata)
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Control de Acceso Operativo</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingrese con sus credenciales institucionales autorizadas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Contraseña de Seguridad
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  aria-label="Alternar visibilidad"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar al Puesto de Mando</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>


        </div>

        {/* Security Footer Note */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Acceso mediante cuenta autorizada • Estación B-233 Paucarpata</span>
        </div>

      </div>

    </div>
  );
};
