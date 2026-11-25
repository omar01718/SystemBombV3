'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Filter, Search, X } from 'lucide-react';

export const AuditView: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      log.entity.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q);
    return matchesAction && matchesSearch;
  });

  const actionColors: Record<string, string> = {
    CREACIÓN: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
    ACTUALIZACIÓN: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
    ELIMINACIÓN: 'bg-red-500/15 text-red-300 border-red-500/35',
    PRÉSTAMO: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
    DEVOLUCIÓN: 'bg-teal-500/15 text-teal-300 border-teal-500/35',
    LOGIN: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bitácora de Auditoría y Trazabilidad
          </h2>
          <span className="font-mono px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D1322] text-slate-300 border border-white/10">
            {auditLogs.length} eventos cargados
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Últimos 500 cambios registrados desde la activación de la auditoría. No incluye inicios de sesión ni operaciones anteriores a su instalación.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en la bitácora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full pl-10 pr-9 rounded-xl bg-[#090E1A] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="h-10 w-full sm:w-auto px-3.5 rounded-xl bg-[#090E1A] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          >
            <option value="ALL">Todas las Acciones</option>
            <option value="CREACIÓN">Altas / Creaciones</option>
            <option value="ACTUALIZACIÓN">Actualizaciones</option>
            <option value="ELIMINACIÓN">Bajas / Eliminaciones</option>
          </select>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D1322]/85 border border-white/10 text-center text-sm text-slate-400">
            No se encontraron registros de auditoría.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-[#0D1322]/85 border border-white/10 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    actionColors[log.action] || 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {log.action}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                <span className="font-semibold text-white truncate">{log.user}</span>
                <span className="font-mono text-[11px] text-red-400 shrink-0">{log.entity}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-white/[0.06]">
                {log.details}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-[#090E1A]/90 font-mono text-[11px] uppercase font-semibold text-slate-400 border-b border-white/10 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Acción</th>
                <th className="px-4 py-3.5">Usuario / Cargo</th>
                <th className="px-4 py-3.5">Entidad Afectada</th>
                <th className="px-4 py-3.5">Detalles del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron registros de auditoría.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`font-mono px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          actionColors[log.action] || 'bg-slate-800 text-slate-300 border-white/10'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                      {log.entity}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
