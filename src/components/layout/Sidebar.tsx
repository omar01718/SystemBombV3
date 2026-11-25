'use client';

import React from 'react';
import { useApp, ActiveTab } from '@/lib/context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Wrench,
  History,
  ShieldCheck,
  BadgeAlert,
  Lock,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  section: 'operaciones' | 'control';
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  restricted?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, resources, loans, maintenanceList, currentUser, auditAvailable } =
    useApp();

  const lowStockCount = resources.filter((r) => r.stockActual <= r.stockMinimo).length;
  const activeLoansCount = loans.filter((l) => l.status === 'Activo').length;
  const pendingMaintenanceCount = maintenanceList.filter(
    (m) => m.status === 'Programado' || m.status === 'En Curso'
  ).length;

  const isAdmin = currentUser.role === 'admin_logistica';

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Tablero Operativo',
      section: 'operaciones',
      icon: <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />,
    },
    {
      id: 'inventory',
      label: 'Inventario de Recursos',
      section: 'operaciones',
      icon: <Boxes className="w-4.5 h-4.5 shrink-0" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/35',
    },
    {
      id: 'loans',
      label: 'Préstamos en Guardia',
      section: 'operaciones',
      icon: <ClipboardList className="w-4.5 h-4.5 shrink-0" />,
      badge: activeLoansCount > 0 ? activeLoansCount : undefined,
      badgeColor: 'bg-sky-500/15 text-sky-300 border border-sky-500/35',
    },
    {
      id: 'maintenance',
      label: 'Flota y Mantenimiento',
      section: 'operaciones',
      icon: <Wrench className="w-4.5 h-4.5 shrink-0" />,
      badge: pendingMaintenanceCount > 0 ? pendingMaintenanceCount : undefined,
      badgeColor: 'bg-red-500/15 text-red-300 border border-red-500/35',
    },
    {
      id: 'audit',
      label: 'Bitácora y Auditoría',
      section: 'control',
      icon: <History className="w-4.5 h-4.5 shrink-0" />,
      restricted: !isAdmin || !auditAvailable,
    },
    {
      id: 'security',
      label: 'Seguridad',
      section: 'control',
      icon: <ShieldCheck className="w-4.5 h-4.5 shrink-0" />,
    },
  ];

  const renderGroup = (title: string, section: 'operaciones' | 'control') => (
    <div className="space-y-1">
      <div className="px-3 pt-2 pb-1 font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
        {title}
      </div>
      {navItems
        .filter((item) => item.section === section)
        .map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-red-600/25 via-red-600/10 to-transparent text-white border border-red-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-red-500"
                />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.restricted && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                {item.badge !== undefined && (
                  <span
                    className={`font-mono px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
    </div>
  );

  return (
    <aside className="w-full md:w-64 bg-[#090E1A]/80 backdrop-blur-xl border-r border-white/[0.08] flex flex-col shrink-0">
      {/* Navigation Links */}
      <nav className="p-3 space-y-4 flex-1">
        {renderGroup('Operaciones B-233', 'operaciones')}
        {renderGroup('Control y Seguridad', 'control')}
      </nav>

      {/* Emergency Hotline Footer */}
      <div className="p-3.5 border-t border-white/[0.08]">
        <div className="relative p-3.5 rounded-xl bg-[#0D1322]/90 border border-white/10 flex items-start gap-2.5">
          <span className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/40 rounded-tl-xl" />
          <span className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/40 rounded-br-xl" />
          <div className="h-8 w-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
            <BadgeAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xs min-w-0">
            <div className="font-display font-semibold text-white">Central CGBVP</div>
            <div className="font-mono text-emerald-400 text-[11px] mt-0.5">Emergencia: 116</div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
              Cuartel: (054) 46-2333
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
