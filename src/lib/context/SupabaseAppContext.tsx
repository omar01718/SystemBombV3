'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuditLog, Loan, Maintenance, Resource, ShiftType, User } from '@/types';
import type { ActiveTab, ToastMessage } from './AppContext';
import { supabase } from '@/lib/supabase';
import { inventoryCsvCell } from '@/lib/csv';
import * as inventory from '@/lib/inventoryRepository';
import * as loansRepo from '@/lib/loanRepository';
import * as maintenance from '@/lib/maintenanceRepository';

type Result = { success: boolean; error?: string };
type LoanInput = { resourceId: string; firefighterName: string; firefighterRank: string; shift: ShiftType; expectedReturnDate: string; notes?: string };
type Context = {
  isAuthenticated: boolean; currentUser: User; login: (email: string, password: string) => Promise<boolean>; logout: () => Promise<void>;
  activeTab: ActiveTab; setActiveTab: (tab: ActiveTab) => void;
  resources: Resource[]; loans: Loan[]; maintenanceList: Maintenance[]; auditLogs: AuditLog[]; auditAvailable: boolean;
  addResource: (value: inventory.ResourceInput) => Promise<Result>;
  updateResource: (id: string, value: Partial<Resource>) => Promise<Result>;
  deleteResource: (id: string) => Promise<Result>;
  createLoan: (value: LoanInput) => Promise<Result>;
  returnLoan: (id: string, condition: NonNullable<Loan['conditionIn']>, notes?: string) => Promise<Result>;
  cancelLoan: (id: string, reason: string) => Promise<Result>;
  addMaintenance: (value: maintenance.MaintenanceInput) => Promise<Result>;
  updateMaintenance: (id: string, value: Partial<Maintenance>) => Promise<Result>;
  deleteMaintenance: (id: string) => Promise<Result>;
  toasts: ToastMessage[]; addToast: (type: ToastMessage['type'], title: string, message: string) => void; removeToast: (id: string) => void;
  exportInventoryCSV: () => void; resetToInitialData: () => void;
};

const AppContext = createContext<Context | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sessionVersion, setSessionVersion] = useState(0);
  useEffect(() => {
    if (!supabase) return;
    let lastId: string | undefined;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextId = session?.user.id;
      if (event === 'SIGNED_OUT' || (lastId && lastId !== nextId)) {
        // Desmontar también descarta resultados tardíos de la sesión anterior.
        setSessionVersion(version => version + 1);
      }
      lastId = nextId;
    });
    return () => subscription.unsubscribe();
  }, []);
  return <SessionProvider key={sessionVersion}>{children}</SessionProvider>;
}

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '', username: '', email: '', fullName: '', role: 'bombero_operativo', rank: '', station: '',
  });
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [maintenanceList, setMaintenance] = useState<Maintenance[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditAvailable, setAuditAvailable] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => setToasts(previous => previous.filter(item => item.id !== id)), []);
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = crypto.randomUUID();
    setToasts(previous => [...previous, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 6000);
  }, [removeToast]);

  const loadProfile = useCallback(async (id: string, email: string) => {
    if (!supabase) return false;
    const { data, error } = await supabase.from('profiles').select('full_name, role, rank, station').eq('id', id).maybeSingle();
    if (error || !data || !['admin_logistica', 'bombero_operativo'].includes(data.role)) return false;
    setCurrentUser({ id, username: email, email, fullName: data.full_name, role: data.role, rank: data.rank, station: data.station });
    setAuthenticated(true);
    return true;
  }, []);

  const refreshAudit = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('audit_events')
      .select('id, occurred_at, actor_name, actor_role, action, entity, details')
      .order('occurred_at', { ascending: false }).limit(500);
    if (error) { setAuditAvailable(false); setAuditLogs([]); return; }
    setAuditLogs((data || []).map(row => ({
      id: String(row.id), timestamp: row.occurred_at, user: row.actor_name,
      role: row.actor_role, action: row.action, entity: row.entity, details: row.details,
    })));
    setAuditAvailable(true);
  }, []);

  useEffect(() => {
    let active = true;
    if (supabase) {
      void supabase.auth.getUser().then(async ({ data }) => {
        if (active && data.user) await loadProfile(data.user.id, data.user.email || '');
      });
    }
    return () => { active = false; };
  }, [loadProfile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    Promise.all([inventory.listResources(), loansRepo.listLoans(), maintenance.listMaintenance()])
      .then(([r, l, m]) => { if (active) { setResources(r); setLoans(l); setMaintenance(m); } })
      .catch(() => { if (active) addToast('error', 'Error al cargar datos', 'No se pudieron cargar las tablas de Supabase. Compruebe la conexión y los permisos.'); });
    return () => { active = false; };
  }, [isAuthenticated, addToast]);

  useEffect(() => {
    if (isAuthenticated && currentUser.role === 'admin_logistica') {
      void Promise.resolve().then(refreshAudit).catch(() => setAuditAvailable(false));
    }
  }, [isAuthenticated, currentUser.role, refreshAudit]);

  const login = async (email: string, password: string) => {
    if (!supabase) { addToast('error', 'Configuración incompleta', 'Falta configurar Supabase.'); return false; }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) { addToast('error', 'Acceso denegado', 'No se pudo iniciar sesión. Revise sus credenciales y conexión.'); return false; }
    if (!await loadProfile(data.user.id, data.user.email || '')) {
      await supabase.auth.signOut();
      addToast('error', 'Acceso denegado', 'No se encontró un perfil autorizado o no se pudo consultar.');
      return false;
    }
    return true;
  };
  const logout = async () => {
    const result = await supabase?.auth.signOut();
    if (result?.error) {
      addToast('error', 'Sesión aún abierta', 'No se pudo cerrar la sesión. Compruebe la conexión y vuelva a intentarlo.');
      return;
    }
    setAuthenticated(false); setResources([]); setLoans([]); setMaintenance([]); setAuditLogs([]); setAuditAvailable(false); setActiveTab('dashboard');
  };
  const run = async (operation: () => Promise<void>, message: string): Promise<Result> => {
    try {
      await operation();
      if (currentUser.role === 'admin_logistica') {
        try { await refreshAudit(); } catch { setAuditAvailable(false); }
      }
      addToast('success', 'Guardado', message); return { success: true };
    }
    catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
      const messages: Record<string, string> = {
        '23505': 'Ya existe un registro con ese código o un préstamo activo para el equipo.',
        '23503': 'El registro está vinculado a otros datos y no puede eliminarse.',
        '23514': 'Los datos o el estado del recurso no cumplen las reglas de seguridad.',
        '22023': 'Los datos son inválidos o el equipo ya no está disponible.',
        '42501': 'No tiene permiso para realizar esta operación.',
        'PGRST116': 'No se encontró el registro o no tiene permiso para modificarlo.',
      };
      addToast('error', 'No se pudo guardar', messages[code] || 'Compruebe los datos, la conexión y sus permisos.');
      return { success: false };
    }
  };
  const addResource = (value: inventory.ResourceInput) => run(async () => {
    const item = await inventory.createResource(value); setResources(previous => [item, ...previous]);
  }, 'Recurso registrado en Supabase.');
  const updateResource = (id: string, value: Partial<Resource>) => run(async () => {
    const previous = resources.find(item => item.id === id); if (!previous) throw new Error('No encontrado');
    const item = await inventory.saveResource(id, { ...previous, ...value });
    setResources(items => items.map(old => old.id === id ? item : old));
  }, 'Recurso actualizado.');
  const deleteResource = (id: string) => run(async () => {
    await inventory.removeResource(id); setResources(items => items.filter(item => item.id !== id));
  }, 'Recurso eliminado.');
  const refreshLoans = async () => {
    const [r, l] = await Promise.all([inventory.listResources(), loansRepo.listLoans()]);
    setResources(r); setLoans(l);
  };
  const refreshAfterLoan = async () => {
    try { await refreshLoans(); }
    catch { addToast('warning', 'Actualización pendiente', 'La operación se guardó, pero no se pudo actualizar la lista. Recargue la página antes de continuar.'); }
  };
  const createLoan = (value: LoanInput) => run(async () => {
    const date = new Date(value.expectedReturnDate);
    if (Number.isNaN(date.getTime())) throw new Error('Fecha inválida');
    await loansRepo.createLoan({ ...value, code: `ASG-${crypto.randomUUID()}`, expectedReturnDate: date.toISOString() });
    await refreshAfterLoan();
  }, 'Préstamo registrado.');
  const returnLoan = (id: string, condition: NonNullable<Loan['conditionIn']>, notes?: string) => run(async () => {
    await loansRepo.returnLoan(id, condition, notes); await refreshAfterLoan();
  }, 'Devolución registrada.');
  const cancelLoan = (id: string, reason: string) => run(async () => {
    await loansRepo.cancelLoan(id, reason); await refreshAfterLoan();
  }, 'Préstamo anulado. El registro permanece en el historial.');
  const addMaintenance = (value: maintenance.MaintenanceInput) => run(async () => {
    const item = await maintenance.createMaintenance(value); setMaintenance(previous => [item, ...previous]);
  }, 'Mantenimiento registrado.');
  const updateMaintenance = (id: string, value: Partial<Maintenance>) => run(async () => {
    const previous = maintenanceList.find(item => item.id === id); if (!previous) throw new Error('No encontrado');
    const item = await maintenance.saveMaintenance(id, { ...previous, ...value });
    setMaintenance(items => items.map(old => old.id === id ? item : old));
  }, 'Mantenimiento actualizado.');
  const deleteMaintenance = (id: string) => run(async () => {
    await maintenance.removeMaintenance(id); setMaintenance(items => items.filter(item => item.id !== id));
  }, 'Mantenimiento eliminado.');
  const exportInventoryCSV = () => {
    const rows = [['Código', 'Nombre', 'Categoría', 'Ubicación', 'Estado', 'Stock actual', 'Stock mínimo'],
      ...resources.map(r => [r.code, r.name, r.category, r.location, r.status, String(r.stockActual), String(r.stockMinimo)])];
    const csv = rows.map(row => row.map(inventoryCsvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'inventario.csv'; link.click(); URL.revokeObjectURL(url);
  };
  const resetToInitialData = () => addToast('warning', 'Operación deshabilitada', 'Los datos de Supabase no se restauran desde el navegador.');

  return <AppContext.Provider value={{ isAuthenticated, currentUser, login, logout, activeTab, setActiveTab, resources, loans, maintenanceList, auditLogs, auditAvailable, addResource, updateResource, deleteResource, createLoan, returnLoan, cancelLoan, addMaintenance, updateMaintenance, deleteMaintenance, toasts, addToast, removeToast, exportInventoryCSV, resetToInitialData }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
