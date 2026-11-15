import { supabase } from '@/lib/supabase';
import type { Loan, ShiftType } from '@/types';

type LoanRow = {
  id: string;
  code: string;
  resource_id: string;
  firefighter_name: string;
  firefighter_rank: string;
  shift: ShiftType;
  loan_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  condition_out: Loan['conditionOut'];
  condition_in: Loan['conditionIn'] | null;
  status: Loan['status'];
  notes: string | null;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  resources: { code: string; name: string } | null;
};

function client() {
  if (!supabase) throw new Error('Supabase no está configurado.');
  return supabase;
}

export async function listLoans(): Promise<Loan[]> {
  const { data, error } = await client().from('loans')
    .select('*, resources(code, name)').order('loan_date', { ascending: false });
  if (error) throw error;
  return (data as unknown as LoanRow[]).map(row => ({
    id: row.id, code: row.code, resourceId: row.resource_id,
    resourceCode: row.resources?.code ?? '', resourceName: row.resources?.name ?? '',
    firefighterName: row.firefighter_name, firefighterRank: row.firefighter_rank,
    shift: row.shift, loanDate: row.loan_date, expectedReturnDate: row.expected_return_date,
    actualReturnDate: row.actual_return_date ?? undefined, conditionOut: row.condition_out,
    conditionIn: row.condition_in ?? undefined, status: row.status, notes: row.notes ?? '',
    cancellationReason: row.cancellation_reason ?? undefined, cancelledAt: row.cancelled_at ?? undefined,
  }));
}

export async function createLoan(value: {
  code: string; resourceId: string; firefighterName: string; firefighterRank: string;
  shift: ShiftType; expectedReturnDate: string; notes?: string;
}): Promise<void> {
  const { error } = await client().rpc('create_loan', {
    p_code: value.code, p_resource_id: value.resourceId,
    p_firefighter_name: value.firefighterName, p_firefighter_rank: value.firefighterRank,
    p_shift: value.shift, p_expected_return_date: value.expectedReturnDate,
    p_notes: value.notes ?? '',
  });
  if (error) throw error;
}

export async function returnLoan(id: string, condition: NonNullable<Loan['conditionIn']>, notes?: string): Promise<void> {
  const { error } = await client().rpc('return_loan', {
    p_loan_id: id, p_condition_in: condition, p_notes: notes ?? '',
  });
  if (error) throw error;
}

export async function cancelLoan(id: string, reason: string): Promise<void> {
  const { error } = await client().rpc('cancel_loan', { p_loan_id: id, p_reason: reason });
  if (error) throw error;
}
