'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Resource, ResourceCategory, LocationType, ResourceStatus } from '@/types';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';

const CATEGORIES: ResourceCategory[] = [
  'Protección Personal (EPP)',
  'Extinción de Incendios',
  'Rescate y Extricación',
  'Protección Respiratoria (ERA)',
  'Atención Prehospitalaria',
  'Comunicaciones y Señalización',
];

const LOCATIONS: LocationType[] = [
  'Almacén Central B-233',
  'Autobomba B-233',
  'Cisterna C-233',
  'Unidad Rescate R-233',
  'Ambulancia M-233',
  'Tópico y Trauma',
];

const STATUS_BADGE: Record<ResourceStatus, string> = {
  Disponible: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  'En Uso': 'bg-sky-500/15 text-sky-300 border-sky-500/35',
  'En Mantenimiento': 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  'Baja Lógica': 'bg-slate-700/40 text-slate-400 border-slate-600/50',
};

export const InventoryView: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource, currentUser, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: CATEGORIES[0],
    location: LOCATIONS[0],
    status: 'Disponible' as ResourceStatus,
    stockActual: 1,
    stockMinimo: 1,
    inspectionDate: '2026-11-08',
    serialNumber: '',
    notes: '',
  });

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        res.name.toLowerCase().includes(q) ||
        res.code.toLowerCase().includes(q) ||
        (res.serialNumber && res.serialNumber.toLowerCase().includes(q)) ||
        (res.notes && res.notes.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || res.status === selectedStatus;
      const matchesLoc = selectedLocation === 'ALL' || res.location === selectedLocation;

      return matchesSearch && matchesCat && matchesStatus && matchesLoc;
    });
  }, [resources, searchTerm, selectedCategory, selectedStatus, selectedLocation]);

  const handleOpenCreate = () => {
    if (currentUser.role !== 'admin_logistica') {
      addToast(
        'error',
        'Permiso Restringido',
        'Solo el Administrador de Logística puede dar de alta nuevos recursos.'
      );
      return;
    }
    const nextCodeNum = resources.length + 1;
    setFormData({
      code: `EQP-233-${String(nextCodeNum).padStart(3, '0')}`,
      name: '',
      category: CATEGORIES[0],
      location: LOCATIONS[0],
      status: 'Disponible',
      stockActual: 1,
      stockMinimo: 1,
      inspectionDate: new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10),
      serialNumber: '',
      notes: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast(
        'error',
        'Permiso Restringido',
        'Solo el Administrador de Logística tiene autorización para editar recursos.'
      );
      return;
    }
    setEditingResource(res);
    setFormData({
      code: res.code,
      name: res.name,
      category: res.category,
      location: res.location,
      status: res.status,
      stockActual: res.stockActual,
      stockMinimo: res.stockMinimo,
      inspectionDate: res.inspectionDate,
      serialNumber: res.serialNumber || '',
      notes: res.notes || '',
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addResource(formData);
    if (result.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    const result = await updateResource(editingResource.id, formData);
    if (result.success) {
      setEditingResource(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingResource) return;
    const result = await deleteResource(deletingResource.id);
    if (result.success) setDeletingResource(null);
  };

  const isAdmin = currentUser.role === 'admin_logistica';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Inventario de Recursos
            </h2>
            <span className="font-mono px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0D1322] text-slate-300 border border-white/10">
              {filteredResources.length} / {resources.length} registros
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control de EPP, mangueras, pitones, equipos ERA, herramientas hidráulicas e insumos B-233.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display font-semibold text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(220,38,38,0.35)] border border-red-500/40 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Recurso</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 space-y-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por código, nombre, serie o nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-10 pr-9 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all"
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
            className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Disponible">Disponible</option>
            <option value="En Uso">En Uso</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          >
            <option value="ALL">Todas las Ubicaciones</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-mono text-[11px] text-slate-400 mr-1 flex items-center gap-1 shrink-0 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" /> Categoría:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-medium cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-red-600 text-white font-semibold shadow-sm shadow-red-950/60'
                : 'bg-[#090E1A] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-medium cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-semibold shadow-sm shadow-red-950/60'
                  : 'bg-[#090E1A] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredResources.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D1322]/85 border border-white/10 text-center text-sm text-slate-400">
            No se encontraron recursos que coincidan con los criterios de búsqueda.
          </div>
        ) : (
          filteredResources.map((res) => {
            const isLowStock = res.stockActual <= res.stockMinimo;
            return (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-[#0D1322]/85 border border-white/10 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-red-400">{res.code}</span>
                    <h3 className="text-sm font-semibold text-white leading-snug mt-0.5">
                      {res.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{res.category}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border shrink-0 ${
                      STATUS_BADGE[res.status]
                    }`}
                  >
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.07] text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{res.location}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{res.inspectionDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.07]">
                  <span
                    className={`font-mono px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isLowStock
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/35'
                        : 'bg-[#090E1A] text-slate-200 border border-white/10'
                    }`}
                  >
                    Stock: {res.stockActual} / {res.stockMinimo} min
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(res)}
                      disabled={!isAdmin}
                      className={`p-2 rounded-lg border transition-colors ${
                        isAdmin
                          ? 'bg-[#090E1A] border-white/10 text-slate-200 hover:bg-white/[0.06] cursor-pointer'
                          : 'bg-[#090E1A]/40 border-white/5 text-slate-600 cursor-not-allowed'
                      }`}
                      aria-label={`Editar ${res.code}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingResource(res)}
                      disabled={!isAdmin}
                      className={`p-2 rounded-lg border transition-colors ${
                        isAdmin
                          ? 'bg-[#090E1A] border-red-500/25 text-red-400 hover:bg-red-950/60 cursor-pointer'
                          : 'bg-[#090E1A]/40 border-white/5 text-slate-600 cursor-not-allowed'
                      }`}
                      aria-label={`Dar de baja ${res.code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-[#090E1A]/90 font-mono text-[11px] uppercase font-semibold text-slate-400 border-b border-white/10 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Código</th>
                <th className="px-4 py-3.5">Recurso / Especificación</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Ubicación</th>
                <th className="px-4 py-3.5 text-center">Stock</th>
                <th className="px-4 py-3.5 text-center">Estado</th>
                <th className="px-4 py-3.5">Inspección</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron recursos que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => {
                  const isLowStock = res.stockActual <= res.stockMinimo;

                  return (
                    <tr key={res.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-red-400 whitespace-nowrap">
                        {res.code}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{res.name}</div>
                        {res.serialNumber && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            S/N: {res.serialNumber}
                          </div>
                        )}
                        {res.notes && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                            {res.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-300">{res.category}</td>

                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{res.location}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block font-mono px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isLowStock
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/35'
                              : 'bg-[#090E1A] text-slate-200 border border-white/10'
                          }`}
                        >
                          {res.stockActual} / {res.stockMinimo} min
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block font-mono px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            STATUS_BADGE[res.status]
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-xs text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{res.inspectionDate}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(res)}
                            title={isAdmin ? 'Editar datos del recurso' : 'Solo Administrador'}
                            disabled={!isAdmin}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdmin
                                ? 'text-slate-300 hover:text-white hover:bg-white/[0.08] cursor-pointer'
                                : 'text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingResource(res)}
                            title={isAdmin ? 'Dar de baja recurso' : 'Solo Administrador'}
                            disabled={!isAdmin}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdmin
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-950/60 cursor-pointer'
                                : 'text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear / Editar Recurso */}
      {(isCreateModalOpen || editingResource) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090E1A]/90 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <Boxes className="w-5 h-5 text-red-500" />
                <h3 className="font-display text-base font-bold text-white">
                  {editingResource
                    ? `Editar Recurso: ${editingResource.code}`
                    : 'Registrar Nuevo Recurso'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingResource(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingResource ? handleSubmitEdit : handleSubmitCreate}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Código Institucional *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ej. EPP-233-020"
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Nombre del Recurso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Pitón Akron 1.5 pulgadas"
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ResourceCategory })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Ubicación en Estación *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value as LocationType })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockActual}
                    onChange={(e) =>
                      setFormData({ ...formData, stockActual: parseInt(e.target.value) || 0 })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Stock Mínimo de Alerta
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockMinimo}
                    onChange={(e) =>
                      setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 1 })
                    }
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Próxima Inspección
                  </label>
                  <input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Número de Serie / Lote
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="Opcional"
                    className="h-10 w-full px-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Observaciones Técnicas
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalles sobre pruebas de presión, donante, estado del material..."
                  className="w-full p-3 rounded-xl bg-[#090E1A] border border-white/10 text-sm text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingResource(null);
                  }}
                  className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display text-sm font-semibold shadow-lg shadow-red-950/50 border border-red-500/40 cursor-pointer"
                >
                  {editingResource ? 'Guardar Cambios' : 'Registrar Recurso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Baja Lógica */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D1322] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/35 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  ¿Confirmar Baja de Recurso?
                </h3>
                <p className="text-xs text-slate-400">
                  Esta acción retirará el recurso del inventario activo.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090E1A] border border-white/10 text-xs space-y-1.5">
              <div>
                <strong className="text-slate-400">Código:</strong>{' '}
                <span className="font-mono text-red-400 font-semibold">{deletingResource.code}</span>
              </div>
              <div>
                <strong className="text-slate-400">Recurso:</strong>{' '}
                <span className="text-white">{deletingResource.name}</span>
              </div>
              <div>
                <strong className="text-slate-400">Ubicación actual:</strong>{' '}
                <span className="text-slate-200">{deletingResource.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingResource(null)}
                className="h-10 px-4 rounded-xl bg-[#090E1A] border border-white/10 text-slate-300 hover:bg-white/[0.06] text-sm font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-10 px-4 rounded-xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-display text-sm font-semibold border border-red-500/40 cursor-pointer"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
