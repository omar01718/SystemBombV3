'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { InventoryView } from '@/components/inventory/InventoryView';
import { LoansView } from '@/components/loans/LoansView';
import { MaintenanceView } from '@/components/maintenance/MaintenanceView';
import { AuditView } from '@/components/audit/AuditView';
import { SecurityView } from '@/components/security/SecurityView';
import { LoginView } from '@/components/auth/LoginView';
import { ToastContainer } from '@/components/ui/Toast';
import { Menu, X, ShieldAlert, FileSpreadsheet } from 'lucide-react';

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Tablero Operativo',
  inventory: 'Inventario de Recursos',
  loans: 'Préstamos en Guardia',
  maintenance: 'Flota y Mantenimiento',
  audit: 'Bitácora y Auditoría',
  security: 'Seguridad',
};

const MainAppContent: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser, auditAvailable, exportInventoryCSV } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <LoginView />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-slate-100 relative selection:bg-red-600 selection:text-white">
      {/* Subtle C4i Ambient Background Layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.35) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 w-[520px] h-[520px] rounded-full bg-red-600/[0.06] blur-3xl"
      />

      {/* Top Command Navbar */}
      <Navbar />

      {/* Mobile Tactical Action Bar */}
      <div className="md:hidden sticky top-16 z-30 flex items-center justify-between px-4 py-2.5 bg-[#090E1A]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-medium text-slate-100 px-3 py-1.5 rounded-xl bg-[#0D1322] border border-white/10 active:scale-[0.99] transition-all cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4 text-red-400" />
          ) : (
            <Menu className="w-4 h-4 text-red-400" />
          )}
          <span className="font-display font-semibold">{TAB_TITLES[activeTab] || 'Módulos'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportInventoryCSV}
            title="Descargar reporte CSV"
            className="p-1.5 rounded-lg bg-[#0D1322] border border-white/10 text-emerald-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Exportar inventario CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 font-mono text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>B-233</span>
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex animate-in fade-in duration-150">
            <div className="w-72 max-w-[85vw] bg-[#090E1A] border-r border-white/10 h-full shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08]">
                <div>
                  <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                    Navegación Táctica
                  </span>
                  <p className="font-mono text-[10px] text-slate-400">ESTACIÓN B-233</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div onClick={() => setMobileMenuOpen(false)} className="flex-1 overflow-y-auto flex">
                <Sidebar />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic View Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'loans' && <LoansView />}
          {activeTab === 'maintenance' && <MaintenanceView />}
          {activeTab === 'audit' && currentUser.role === 'admin_logistica' && auditAvailable && (
            <AuditView />
          )}
          {activeTab === 'audit' && (currentUser.role !== 'admin_logistica' || !auditAvailable) && (
            <div className="rounded-2xl border border-amber-500/30 bg-[#0D1322]/85 backdrop-blur-xl p-6 flex items-start gap-3.5 text-amber-100 shadow-xl">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wide">
                  Acceso de Auditoría Restringido
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentUser.role !== 'admin_logistica'
                    ? 'La bitácora de auditoría está reservada únicamente para el Administrador de Logística.'
                    : 'La auditoría no está disponible en este momento. Compruebe la migración 005 y la conexión con Supabase.'}
                </p>
              </div>
            </div>
          )}
          {activeTab === 'security' && <SecurityView />}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
