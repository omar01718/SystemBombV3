import { supabase } from '@/lib/supabase';
import type { Maintenance } from '@/types';

type MaintenanceRow = {
  id: string;
  code: string;
  equipment_name: string;
  equipment_type: Maintenance['equipmentType'];
  maintenance_type: Maintenance['maintenanceType'];
  scheduled_date: string;
  completed_date: string | null;
  technician: string;
  cost: number;
  status: Maintenance['status'];
  priority: Maintenance['priority'];
  observations: string;
};

export type MaintenanceInput = Omit<Maintenance, 'id'>;

function client() {
  if (!supabase) throw new Error('Supabase no está configurado.');
  return supabase;
}

function fromRow(row: MaintenanceRow): Maintenance {
  return {
    id: row.id, code: row.code, equipmentName: row.equipment_name,
    equipmentType: row.equipment_type, maintenanceType: row.maintenance_type,
    scheduledDate: row.scheduled_date, completedDate: row.completed_date ?? undefined,
    technician: row.technician, cost: Number(row.cost), status: row.status,
    priority: row.priority, observations: row.observations,
  };
}

function toRow(value: MaintenanceInput) {
  return {
    code: value.code.trim().toUpperCase(), equipment_name: value.equipmentName.trim(),
    equipment_type: value.equipmentType, maintenance_type: value.maintenanceType,
    scheduled_date: value.scheduledDate, completed_date: value.completedDate || null,
    technician: value.technician.trim(), cost: value.cost, status: value.status,
    priority: value.priority, observations: value.observations,
  };
}

export async function listMaintenance(): Promise<Maintenance[]> {
  const { data, error } = await client().from('maintenance').select('*').order('scheduled_date', { ascending: false });
  if (error) throw error;
  return (data as MaintenanceRow[]).map(fromRow);
}

export async function createMaintenance(value: MaintenanceInput): Promise<Maintenance> {
  const { data, error } = await client().from('maintenance').insert(toRow(value)).select().single();
  if (error) throw error;
  return fromRow(data as MaintenanceRow);
}

export async function saveMaintenance(id: string, value: MaintenanceInput): Promise<Maintenance> {
  const { data, error } = await client().from('maintenance').update(toRow(value)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data as MaintenanceRow);
}

export async function removeMaintenance(id: string): Promise<void> {
  const { data, error } = await client().from('maintenance').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Mantenimiento no encontrado o sin permiso para eliminarlo.');
}
