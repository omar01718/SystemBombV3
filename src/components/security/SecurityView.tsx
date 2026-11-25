'use client';

import React from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  History,
  Lock,
  DatabaseBackup,
  ShieldAlert,
  Info,
} from 'lucide-react';

const SECURITY_CONTROLS = [
  {
    title: 'Acceso y Autenticación',
    tag: 'SUPABASE AUTH',
    icon: KeyRound,
    accent: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
    description: 'Supabase Auth verifica las credenciales de cada cuenta autorizada.',
  },
  {
    title: 'Control de Roles (RBAC)',
    tag: 'POLÍTICAS RLS',
    icon: Users,
    accent: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    description:
      'Administrador y bombero operativo tienen permisos diferenciados, controlados mediante políticas de Supabase.',
  },
  {
    title: 'Trazabilidad Operativa',
    tag: 'BITÁCORA',
    icon: History,
    accent: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    description:
      'Registra cambios operativos desde su instalación; no incluye inicios de sesión ni cambios anteriores.',
  },
  {
    title: 'Cifrado en Tránsito',
    tag: 'HTTPS / TLS',
    icon: Lock,
    accent: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    description:
      'El intercambio con Supabase está cifrado en tránsito cuando se utiliza una URL HTTPS.',
  },
  {
    title: 'Respaldos y Restauración',
    tag: 'CONTINUIDAD',
    icon: DatabaseBackup,
    accent: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    description:
      'Deben configurarse y verificarse por separado en el proyecto, incluida la prueba periódica de restauración.',
  },
  {
    title: 'Gestión de Claves',
    tag: 'SECRETO',
    icon: ShieldAlert,
    accent: 'text-red-400 bg-red-500/15 border-red-500/30',
    description:
      'No comparta contraseñas ni claves secretas; nunca las coloque en código accesible desde el navegador.',
  },
];

export const SecurityView: React.FC = () => (
  <section className="space-y-5">
    {/* Header */}
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
          Seguridad y Gobernanza
        </h2>
        <span className="font-mono px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D1322] text-slate-300 border border-white/10">
          ESTACIÓN B-233
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
        Información sobre los controles de seguridad del sistema. Esta página no verifica automáticamente su configuración ni garantiza su funcionamiento.
      </p>
    </div>

    {/* Notice Banner */}
    <div className="p-4 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-sky-500/30 flex items-start gap-3 shadow-lg">
      <div className="h-9 w-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
        <Info className="w-4.5 h-4.5 text-sky-400" />
      </div>
      <div className="text-xs text-slate-300 leading-relaxed">
        <strong className="text-white font-semibold block mb-0.5">
          Alcance informativo de controles
        </strong>
        La verificación real de políticas RLS, respaldos y rotación de credenciales se realiza directamente desde el panel de Supabase y Vercel.
      </div>
    </div>

    {/* 6 Control Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {SECURITY_CONTROLS.map((ctrl) => {
        const Icon = ctrl.icon;
        return (
          <div
            key={ctrl.title}
            className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${ctrl.accent}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#090E1A] border border-white/10 text-slate-400 tracking-wider">
                  {ctrl.tag}
                </span>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{ctrl.title}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{ctrl.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
