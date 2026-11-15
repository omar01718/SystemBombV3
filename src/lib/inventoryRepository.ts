import { supabase } from '@/lib/supabase';
import type { Resource } from '@/types';

type ResourceRow = {
  id: string;
  code: string;
  name: string;
  category: Resource['category'];
  location: Resource['location'];
  status: Resource['status'];
  stock_actual: number;
  stock_minimo: number;
  inspection_date: string;
  serial_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>;

function client() {
  if (!supabase) throw new Error('Supabase no está configurado.');
  return supabase;
}

function fromRow(row: ResourceRow): Resource {
  return {
    id: row.id, code: row.code, name: row.name,
    category: row.category, location: row.location, status: row.status,
    stockActual: row.stock_actual, stockMinimo: row.stock_minimo,
    inspectionDate: row.inspection_date, serialNumber: row.serial_number ?? '',
    notes: row.notes ?? '', createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function toRow(value: ResourceInput) {
  return {
    code: value.code.trim().toUpperCase(), name: value.name.trim(),
    category: value.category, location: value.location, status: value.status,
    stock_actual: value.stockActual, stock_minimo: value.stockMinimo,
    inspection_date: value.inspectionDate, serial_number: value.serialNumber || null,
    notes: value.notes || null,
  };
}

export async function listResources(): Promise<Resource[]> {
  const { data, error } = await client().from('resources').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ResourceRow[]).map(fromRow);
}

export async function createResource(value: ResourceInput): Promise<Resource> {
  const { data, error } = await client().from('resources').insert(toRow(value)).select().single();
  if (error) throw error;
  return fromRow(data as ResourceRow);
}

export async function saveResource(id: string, value: ResourceInput): Promise<Resource> {
  const { data, error } = await client().from('resources')
    .update({ ...toRow(value), updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data as ResourceRow);
}

export async function removeResource(id: string): Promise<void> {
  const { data, error } = await client().from('resources').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Recurso no encontrado o sin permiso para eliminarlo.');
}
