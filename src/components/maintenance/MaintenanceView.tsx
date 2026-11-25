'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Maintenance, MaintenanceType, MaintenanceStatus } from '@/types';
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  X,
  Edit,
  Trash2,
  Search,
} from 'lucide-react';

const MAINTENANCE_TYPES: MaintenanceType[] = [
  'Mantenimiento Preventivo',
  'Mantenimiento Correctivo',
  'Inspección Periódica',
  'Prueba Hidrostática NFPA',
];

const EQUIPMENT_TYPES: Maintenance['equipmentType'][] = [
  'Unidad Autobomba',
  'Unidad Cisterna',
  'Equipo ERA',
  'Herramienta Hidráulica',
  'Motobomba',
];

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceList,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    currentUser,
    addToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Maintenance | null>(null);
  const [deletingItem, setDeletingItem] = useState<Maintenance | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    equipmentName: '',
    equipmentType: 'Unidad Autobomba' as Maintenance['equipmentType'],
    maintenanceType: MAINTENANCE_TYPES[0],
    scheduledDate: '',
    technician: '',
    cost: 0,
    status: 'Programado' as MaintenanceStatus,
    priority: 'Media' as 'Alta' | 'Media' | 'Baja',
    observations: '',
  });

  const totalCost = maintenanceList.reduce((acc, m) => acc + (m.cost || 0), 0);

  const filteredMaintenance = maintenanceList.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      m.equipmentName.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.technician.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    if (currentUser.role !== 'admin_logistica') {
      addToast(
        'error',
        'Permiso Restringido',
        'Solo el Administrador de Logística puede programar órdenes de mantenimiento.'
      );
      return;
    }
    const nextCode = `MNT-${crypto.randomUUID()}`;
    setFormData({
      code: nextCode,
      equipmentName: '',
      equipmentType: 'Unidad Autobomba',
      maintenanceType: MAINTENANCE_TYPES[0],
      scheduledDate: '',
      technician: '',
      cost: 0,
      status: 'Programado',
      priority: 'Media',
      observations: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (item: Maintenance) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Permiso Restringido', 'Solo el Administrador puede editar órdenes técnicas.');
      return;
    }
    setEditingItem(item);
    setFormData({
      code: item.code,
      equipmentName: item.equipmentName,
      equipmentType: item.equipmentType,
      maintenanceType: item.maintenanceType,
      scheduledDate: item.scheduledDate,
      technician: item.technician,
      cost: item.cost,
      status: item.status,
      priority: item.priority,
      observations: item.observations,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentName.trim() || !formData.technician.trim()) {
      addToast(
        'error',
        'Datos Incompletos',
        'Indique el equipo o vehículo y el técnico responsable.'
      );
      return;
    }
    const res = await addMaintenance(formData);
    if (res.success) setIsCreateModalOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const res = await updateMaintenance(editingItem.id, formData);
    if (res.success) setEditingItem(null);
  };

  const handleQuickStatusChange = (id: string, newStatus: MaintenanceStatus) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast(
        'error',
        'Permiso restringido',
        'Solo un administrador puede cambiar el estado de una orden.'
      );
      return;
    }
    const today = new Date().toISOString().substring(0, 10);
    updateMaintenance(id, {
      status: newStatus,
      completedDate: newStatus === 'Completado' ? today : undefined,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    await deleteMaintenance(deletingItem.id);
    setDeletingItem(null);
  };

  const isAdmin = currentUser.role === 'admin_logistica';

  return (
    <div className="space-y-5">
      {/* Header & Investment Stat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Flota y Mantenimientos Técnicos
            </h2>
            <span className="font-mono px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D1322] text-slate-300 border border-white/10">
              {maintenanceList.length} órdenes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inspecciones normadas NFPA, mantenimiento de bombas de agua y pruebas mecánicas B-233.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#0D1322]/90 border border-white/10 text-xs">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Inversión Logística
            </div>
            <div className="text-emerald-400 font-bold font-mono text-sm">
              S/. {totalCost.toFixed(2)} PEN
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-semibold text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(220,38,38,0.35)] border border-red-500/40 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Orden</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por equipo, código o taller..."
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

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 w-full sm:w-auto px-3.5 rounded-xl bg-[#090E1A] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="Programado">Programados</option>
          <option value="En Curso">En Curso / Taller</option>
          <option value="Completado">Completados</option>
        </select>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMaintenance.length === 0 ? (
          <div className="col-span-full py-12 px-4 text-center text-slate-400 text-sm bg-[#0D1322]/70 rounded-2xl border border-white/10">
            No hay órdenes de mantenimiento que coincidan con la búsqueda.
          </div>
        ) : (
          filteredMaintenance.map((mnt) => {
            const statusConfig: Record<MaintenanceStatus, { bg: string; label: string }> = {
              Programado: {
                bg: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
                label: 'Programado',
              },
              'En Curso': {
                bg: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
                label: 'En Taller / Curso',
              },
              Completado: {
                bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
                label: 'Completado',
              },
              Vencido: {
                bg: 'bg-red-500/15 text-red-300 border-red-500/35',
                label: 'Vencido',
              },
            };

            const priorityBadge = {
              Alta: 'bg-red-500/15 text-red-300 border-red-500/35',
              Media: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
              Baja: 'bg-white/[0.05] text-slate-300 border-white/10',
            };

            return (
              <div
                key={mnt.id}
                className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-400">{mnt.code}</span>
                      <span
                        className={`font-mono px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityBadge[mnt.priority]}`}
                      >
                        Prioridad {mnt.priority}
                      </span>
                    </div>

                    <span
                      className={`font-mono px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        statusConfig[mnt.status].bg
                      }`}
                    >
                      {statusConfig[mnt.status].label}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white leading-snug">
                    {mnt.equipmentName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{mnt.maintenanceType}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.07] space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Fecha: {mnt.scheduledDate}</span>
                      </div>
                      <div className="font-mono text-emerald-400 font-bold">
                        S/. {mnt.cost.toFixed(2)} PEN
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Responsable: <strong className="text-slate-200">{mnt.technician}</strong>
                      </span>
                    </div>

                    {mnt.observations && (
                      <div className="p-2.5 rounded-xl bg-[#090E1A] border border-white/[0.07] text-[11px] text-slate-300 leading-relaxed">
                        {mnt.observations}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Actions */}
                <div className="mt-4 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {!isAdmin && (
                      <span className="text-slate-400 text-[11px]">
                        Solo un administrador puede cambiar el estado.
                      </span>
                    )}
                    {isAdmin && mnt.status !== 'Completado' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(mnt.id, 'Completado')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marcar Listo</span>
                      </button>
                    )}
                    {isAdmin && mnt.status === 'Programado' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(mnt.id, 'En Curso')}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Iniciar Taller</span>
                      </button>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(mnt)}
                        className="p-2 rounded-lg bg-[#090E1A] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                        title="Editar orden"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(mnt)}
                        className="p-2 rounded-lg bg-[#090E1A] border border-red-500/25 text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors cursor-pointer"
                        title="Eliminar orden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Crear / Editar Mantenimiento */}
      {(isCreateModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090E1A]/90 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-red-500" />
                <h3 className="font-display text-base font-bold text-white">
                  {editingItem
                    ? `Editar Orden: ${editingItem.code}`
                    : 'Programar Mantenimiento de Flota'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Vehículo o Equipo Crítico *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="Ej. Autobomba B-233 Spartan / Lote 6 Cilindros ERA"
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Categoría de Equipo *
                  </label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        equipmentType: e.target.value as Maintenance['equipmentType'],
                      })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  >
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Tipo de Mantenimiento *
                  </label>
                  <select
                    value={formData.maintenanceType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceType: e.target.value as MaintenanceType,
                      })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  >
                    {MAINTENANCE_TYPES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Maintenance['priority'],
                      })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  >
                    <option value="Alta">Alta (Emergencia inmediata)</option>
                    <option value="Media">Media (Programada)</option>
                    <option value="Baja">Baja (Rutina)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha Programada *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Costo Estimado (PEN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Taller o Técnico *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    placeholder="Ej. Taller Arequipa Diesel"
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Detalles del Servicio Técnico
                </label>
                <textarea
                  rows={2}
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Especificar repuestos a cambiar, pruebas de presión o diagnóstico..."
                  className="w-full p-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display text-sm font-semibold shadow-lg shadow-red-950/50 border border-red-500/40 cursor-pointer"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Eliminación de Orden */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/35 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  ¿Eliminar Orden Técnica?
                </h3>
                <p className="text-xs text-slate-400">
                  Esta acción eliminará el registro de mantenimiento seleccionado.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-white/10 text-xs space-y-1.5">
              <div>
                <strong className="text-slate-400">Código:</strong>{' '}
                <span className="font-mono text-red-400 font-semibold">{deletingItem.code}</span>
              </div>
              <div>
                <strong className="text-slate-400">Equipo:</strong>{' '}
                <span className="text-white">{deletingItem.equipmentName}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display text-sm font-semibold border border-red-500/40 cursor-pointer"
              >
                Eliminar Orden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
