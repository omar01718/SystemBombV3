'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Loan, ShiftType } from '@/types';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  User,
  Shield,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

const SHIFTS: ShiftType[] = [
  'Guardia Nocturna A',
  'Guardia Diurna B',
  'Guardia Bravo',
  'Comisión de Servicio Especial',
];

export const LoansView: React.FC = () => {
  const { loans, resources, createLoan, returnLoan, cancelLoan, currentUser, addToast } =
    useApp();

  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null);
  const [cancellingLoan, setCancellingLoan] = useState<Loan | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Create Form State
  const [formData, setFormData] = useState({
    resourceId: '',
    firefighterName: currentUser.fullName,
    firefighterRank: currentUser.rank,
    shift: SHIFTS[0],
    expectedReturnDate: '',
    notes: '',
  });

  // Return Form State
  const [returnCondition, setReturnCondition] = useState<
    'Óptimo' | 'Buen Estado' | 'Deteriorado' | 'Requiere Mantenimiento'
  >('Buen Estado');
  const [returnNotes, setReturnNotes] = useState('');

  const availableResources = resources.filter((r) => r.status === 'Disponible');

  const filteredLoans = loans.filter((l) => {
    const matchesTab = activeTab === 'activos' ? l.status === 'Activo' : l.status !== 'Activo';
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      l.code.toLowerCase().includes(q) ||
      l.resourceName.toLowerCase().includes(q) ||
      l.firefighterName.toLowerCase().includes(q) ||
      l.shift.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleOpenCreate = () => {
    if (availableResources.length === 0) {
      addToast(
        'warning',
        'Sin Equipos Libres',
        'No hay recursos con estado Disponible para prestar.'
      );
      return;
    }
    setFormData({
      resourceId: availableResources[0]?.id || '',
      firefighterName: currentUser.fullName,
      firefighterRank: currentUser.rank,
      shift: SHIFTS[0],
      expectedReturnDate: '',
      notes: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId) {
      addToast('error', 'Selección requerida', 'Debe seleccionar un equipo disponible.');
      return;
    }
    const returnDate = new Date(formData.expectedReturnDate);
    if (
      !formData.expectedReturnDate ||
      Number.isNaN(returnDate.getTime()) ||
      returnDate.getTime() <= Date.now()
    ) {
      addToast(
        'error',
        'Fecha requerida',
        'Seleccione una fecha y hora de retorno posteriores al momento actual.'
      );
      return;
    }
    const res = await createLoan(formData);
    if (res.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningLoan) return;
    const res = await returnLoan(returningLoan.id, returnCondition, returnNotes);
    if (res.success) {
      setReturningLoan(null);
      setReturnNotes('');
    }
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingLoan) return;
    const trimmed = cancelReason.trim();
    if (trimmed.length < 5 || trimmed.length > 500) {
      addToast('error', 'Motivo requerido', 'Escriba un motivo de entre 5 y 500 caracteres.');
      return;
    }
    setCancelling(true);
    try {
      const res = await cancelLoan(cancellingLoan.id, trimmed);
      if (res.success) {
        setCancellingLoan(null);
        setCancelReason('');
      }
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Préstamos en Guardia
            </h2>
            <span className="font-mono px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D1322] text-slate-300 border border-white/10">
              {loans.filter((l) => l.status === 'Activo').length} activos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Trazabilidad nominal de EPP, mangueras y herramientas durante las guardias operativas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-semibold text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(220,38,38,0.35)] border border-red-500/40 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Préstamo</span>
        </button>
      </div>

      {/* Segmented Tabs & Search */}
      <div className="p-4 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-1.5 bg-[#090E1A] p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('activos')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'activos'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activos ({loans.filter((l) => l.status === 'Activo').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('historial')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'historial'
                ? 'bg-white/10 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Historial ({loans.filter((l) => l.status !== 'Activo').length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por código, bombero o equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full pl-10 pr-9 rounded-xl bg-[#090E1A] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
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
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLoans.length === 0 ? (
          <div className="col-span-full py-12 px-4 text-center text-slate-400 text-sm bg-[#0D1322]/70 rounded-2xl border border-white/10">
            {activeTab === 'activos'
              ? 'No hay préstamos activos en este momento. Todo el equipo está en almacén.'
              : 'No se encontraron registros en el historial de devoluciones.'}
          </div>
        ) : (
          filteredLoans.map((loan) => {
            const isLoanActive = loan.status === 'Activo';

            return (
              <div
                key={loan.id}
                className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="font-mono text-xs font-bold text-sky-400">{loan.code}</span>
                    <span
                      className={`font-mono px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        loan.status === 'Activo'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/35'
                          : loan.status === 'Devuelto'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-white leading-snug">
                    {loan.resourceName}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Recurso: {loan.resourceCode}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.07] space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">{loan.firefighterName}</strong> ({loan.firefighterRank})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{loan.shift}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Salida: {loan.loanDate}</span>
                    </div>

                    {loan.actualReturnDate && (
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Devuelto: {loan.actualReturnDate} ({loan.conditionIn})
                        </span>
                      </div>
                    )}

                    {loan.notes && (
                      <div className="p-2.5 rounded-xl bg-[#090E1A] text-[11px] text-slate-300 italic border border-white/[0.07]">
                        {loan.notes}
                      </div>
                    )}
                    {loan.cancellationReason && (
                      <div className="p-2.5 rounded-xl bg-amber-950/35 text-[11px] text-amber-200 border border-amber-500/30">
                        Motivo de anulación: {loan.cancellationReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
                  {isLoanActive ? (
                    <button
                      type="button"
                      onClick={() => setReturningLoan(loan)}
                      className="h-9 flex-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Registrar Devolución</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {loan.status === 'Anulado'
                          ? 'Préstamo anulado'
                          : 'Completado en almacén'}
                      </span>
                    </div>
                  )}

                  {currentUser.role === 'admin_logistica' && isLoanActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingLoan(loan);
                        setCancelReason('');
                      }}
                      disabled={cancelling}
                      title="Anular préstamo registrado por error"
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#090E1A] border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/35 hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Nuevo Préstamo */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090E1A]/90 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-sky-400" />
                <h3 className="font-display text-base font-bold text-white">
                  Registrar Asignación de Guardia
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Equipo o Recurso a Asignar *
                </label>
                <select
                  required
                  value={formData.resourceId}
                  onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                  className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                >
                  {availableResources.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.code}] {r.name} ({r.location})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Al confirmar, el recurso pasará a estado{' '}
                  <span className="text-sky-400 font-semibold">&quot;En Uso&quot;</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Bombero Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firefighterName}
                    onChange={(e) => setFormData({ ...formData, firefighterName: e.target.value })}
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Grado / Rango *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firefighterRank}
                    onChange={(e) => setFormData({ ...formData, firefighterRank: e.target.value })}
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Turno de Guardia *
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({ ...formData, shift: e.target.value as ShiftType })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                  >
                    {SHIFTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Retorno Esperado *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.expectedReturnDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedReturnDate: e.target.value })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Motivo de Salida / Incidente
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej. Salida de autobomba a incendio de vivienda en Paucarpata..."
                  className="w-full p-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-display text-sm font-semibold shadow-lg shadow-sky-950/50 cursor-pointer"
                >
                  Confirmar Préstamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Devolución */}
      {returningLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Recepción y Devolución
                </h3>
                <p className="font-mono text-xs text-slate-400">Código: {returningLoan.code}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-white/10 text-xs space-y-1.5">
              <div>
                <strong className="text-slate-400">Recurso:</strong>{' '}
                <span className="text-white">{returningLoan.resourceName}</span>
              </div>
              <div>
                <strong className="text-slate-400">Retirado por:</strong>{' '}
                <span className="text-slate-200">{returningLoan.firefighterName}</span>
              </div>
              <div>
                <strong className="text-slate-400">Guardia:</strong>{' '}
                <span className="text-slate-200">{returningLoan.shift}</span>
              </div>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Condición Física de Retorno *
                </label>
                <select
                  value={returnCondition}
                  onChange={(e) =>
                    setReturnCondition(e.target.value as NonNullable<Loan['conditionIn']>)
                  }
                  className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                >
                  <option value="Óptimo">Óptimo (Limpio y listo para uso)</option>
                  <option value="Buen Estado">Buen Estado (Operativo)</option>
                  <option value="Deteriorado">Deteriorado (Requiere revisión)</option>
                  <option value="Requiere Mantenimiento">
                    Requiere Mantenimiento (Derivar a Taller)
                  </option>
                </select>
                {returnCondition === 'Requiere Mantenimiento' && (
                  <p className="text-[11px] text-amber-400 mt-1.5">
                    El recurso pasará automáticamente a estado{' '}
                    <span className="font-bold">&quot;En Mantenimiento&quot;</span>.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Novedades / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Detallar si se lavó el equipo, si perdió presión, si sufrió rasgadura..."
                  className="w-full p-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReturningLoan(null)}
                  className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-sm font-semibold shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  Confirmar Recepción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Anular Préstamo */}
      {cancellingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Anular Préstamo ({cancellingLoan.code})
                </h3>
                <p className="text-xs text-slate-400">
                  Use esta opción solo si el equipo no salió y está físicamente disponible.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider">
                    Motivo de Anulación *
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {cancelReason.trim().length}/500
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  minLength={5}
                  maxLength={500}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Describa el motivo del error de registro (mínimo 5 caracteres)..."
                  className="w-full p-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setCancellingLoan(null);
                    setCancelReason('');
                  }}
                  className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display text-sm font-semibold border border-red-500/40 disabled:opacity-60 cursor-pointer"
                >
                  {cancelling ? 'Anulando...' : 'Confirmar Anulación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
