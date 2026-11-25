'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { useMounted } from '@/lib/useMounted';
import {
  Boxes,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Truck,
  ArrowRight,
  Activity,
  Radio,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { resources, loans, maintenanceList, setActiveTab, currentUser } = useApp();
  const mounted = useMounted();
  const formattedDate = mounted
    ? new Date().toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const totalResources = resources.length;
  const availableResources = resources.filter((r) => r.status === 'Disponible').length;
  const inUseResources = resources.filter((r) => r.status === 'En Uso').length;
  const inMaintenanceResources = resources.filter((r) => r.status === 'En Mantenimiento').length;
  const activeLoans = loans.filter((l) => l.status === 'Activo');
  const pendingMaintenance = maintenanceList.filter(
    (m) => m.status === 'Programado' || m.status === 'En Curso'
  );

  const operativityPct = Math.round((availableResources / (totalResources || 1)) * 100);
  const lowStockItems = resources.filter((r) => r.stockActual <= r.stockMinimo);

  const inspectionAlerts = resources.filter((r) => {
    if (!mounted) return false;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    return r.inspectionDate <= deadline.toISOString().substring(0, 10);
  });

  // Group resources by category for tactical readiness bars
  const categoryBreakdown = Array.from(
    resources.reduce((map, res) => {
      const entry = map.get(res.category) || { total: 0, available: 0 };
      entry.total += 1;
      if (res.status === 'Disponible') entry.available += 1;
      map.set(res.category, entry);
      return map;
    }, new Map<string, { total: number; available: number }>())
  );

  return (
    <div className="space-y-6">
      {/* C4i Command Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0D1322]/90 border border-white/10 p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        {/* Corner Accents */}
        <span className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-red-500/50 rounded-tl-2xl" />
        <span className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-red-500/50 rounded-tr-2xl" />
        <span className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-red-500/50 rounded-bl-2xl" />
        <span className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-red-500/50 rounded-br-2xl" />

        {/* Ambient Crimson Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-red-600/15 blur-3xl"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-red-500/15 text-red-300 border border-red-500/30 uppercase tracking-wider">
                <Radio className="w-3 h-3 text-red-400" />
                <span>Puesto de Comando Digital</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400 capitalize">
                {mounted ? formattedDate : 'Estación B-233'}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bienvenido, {currentUser.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Control logístico, trazabilidad de EPP y preparación operativa de la Compañía de Bomberos Virgen de Chapi N.º 233.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('loans')}
              className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-semibold text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(220,38,38,0.35)] border border-red-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Asignar en Guardia</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className="h-10 px-4 rounded-xl bg-[#090E1A] hover:bg-white/[0.06] border border-white/10 text-slate-200 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Boxes className="w-4 h-4 text-slate-300" />
              <span>Ver Inventario</span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-xl transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Catálogo Total
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <Boxes className="w-4.5 h-4.5 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {totalResources}
            </span>
            <span className="text-xs text-slate-400">equipos registrados</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">{categoryBreakdown.length} categorías</span>
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Catálogo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 shadow-xl transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Disponibles
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
              {availableResources}
            </span>
            <span className="text-xs text-slate-400">listos para salida</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-[#090E1A] overflow-hidden border border-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${operativityPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{operativityPct}% operatividad</span>
              <span className="text-emerald-400 font-semibold">APTOS</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-sky-500/30 shadow-xl transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              En Guardia Activa
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-sky-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-sky-400 tracking-tight tabular-nums">
              {activeLoans.length}
            </span>
            <span className="text-xs text-slate-400">préstamos en turno</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">{inUseResources} equipos en campo</span>
            <button
              type="button"
              onClick={() => setActiveTab('loans')}
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Préstamos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-amber-500/30 shadow-xl transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Mantenimiento
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Wrench className="w-4.5 h-4.5 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-amber-400 tracking-tight tabular-nums">
              {pendingMaintenance.length}
            </span>
            <span className="text-xs text-slate-400">órdenes en curso</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">{inMaintenanceResources} en taller</span>
            <button
              type="button"
              onClick={() => setActiveTab('maintenance')}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Flota <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Readiness Telemetry */}
      {categoryBreakdown.length > 0 && (
        <section className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-red-400" />
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                Disponibilidad por Categoría Táctica
              </h3>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              {availableResources} / {totalResources} disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryBreakdown.map(([category, counts]) => {
              const pct = Math.round((counts.available / (counts.total || 1)) * 100);
              return (
                <div
                  key={category}
                  className="p-3.5 rounded-xl bg-[#090E1A]/90 border border-white/[0.07] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-200 truncate">{category}</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                      {counts.available}/{counts.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 75
                          ? 'bg-emerald-500'
                          : pct >= 40
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Critical System Alerts */}
      {(lowStockItems.length > 0 || inspectionAlerts.length > 0) && (
        <section className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-amber-100">
                  Alertas Logísticas y Técnicas
                </h3>
                <p className="text-[11px] text-amber-300/75">
                  Equipos con stock mínimo o inspección próxima (30 días)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer shrink-0"
            >
              Revisar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {lowStockItems.map((item) => (
              <div
                key={`stock-${item.id}`}
                className="p-3.5 rounded-xl bg-[#090E1A]/90 border border-amber-500/25 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{item.name}</div>
                  <div className="text-xs text-amber-400 mt-0.5">
                    Stock bajo: {item.stockActual} unid. (Mínimo: {item.stockMinimo})
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  {item.code}
                </span>
              </div>
            ))}

            {inspectionAlerts.map((item) => (
              <div
                key={`insp-${item.id}`}
                className="p-3.5 rounded-xl bg-[#090E1A]/90 border border-red-500/25 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{item.name}</div>
                  <div className="text-xs text-red-400 mt-0.5">
                    Inspección programada: <span className="font-mono">{item.inspectionDate}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-500/30 shrink-0">
                  {item.code}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Loans */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Préstamos Activos en Guardia
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('loans')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              Gestionar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {activeLoans.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-xl bg-[#090E1A]/70 border border-white/[0.06] text-slate-400 text-xs sm:text-sm">
                No hay préstamos activos en este momento. Todos los equipos están en almacén.
              </div>
            ) : (
              activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3.5 rounded-xl bg-[#090E1A]/85 border border-white/[0.08] hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono text-[11px] text-sky-400 font-bold">
                        {loan.code}
                      </span>
                      <h4 className="text-sm font-semibold text-white truncate">
                        {loan.resourceName}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Asignado a: <strong className="text-white">{loan.firefighterName}</strong> ({loan.firefighterRank})
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/35 shrink-0">
                      {loan.shift}
                    </span>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
                    <span>Retiro: {loan.loanDate}</span>
                    <span>Retorno est.: {loan.expectedReturnDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Fleet Operational Readiness */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <Truck className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Estado de la Flota B-233
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('maintenance')}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              Mantenimientos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {/* Autobomba B-233 */}
            <div className="p-3.5 rounded-xl bg-[#090E1A]/85 border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/35 flex items-center justify-center font-mono text-red-400 font-bold text-xs shrink-0">
                  B-233
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Autobomba Spartan Gladiator 1500 GPM
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    Ataque urbano y rescate • 750 galones agua
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                OPERATIVA
              </span>
            </div>

            {/* Cisterna C-233 */}
            <div className="p-3.5 rounded-xl bg-[#090E1A]/85 border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center font-mono text-sky-400 font-bold text-xs shrink-0">
                  C-233
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Cisterna Freightliner M2
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    Abastecimiento pesado • 3500 galones agua
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                OPERATIVA
              </span>
            </div>

            {/* Unidad Rescate R-233 */}
            <div className="p-3.5 rounded-xl bg-[#090E1A]/85 border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center font-mono text-amber-400 font-bold text-xs shrink-0">
                  R-233
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    Unidad de Rescate R-233 Ford F-550
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    Extricación pesada, cojines y cuerdas
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                EN REVISIÓN
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
