-- Operaciones transaccionales propuestas. Depende de 001_initial_schema.sql.
-- No ejecutar hasta revisar y probar junto con la integración de la aplicación.
begin;

create or replace function public.create_loan(
  p_code text,
  p_resource_id uuid,
  p_firefighter_name text,
  p_firefighter_rank text,
  p_shift text,
  p_expected_return_date timestamptz,
  p_notes text default ''
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resource public.resources%rowtype;
  v_loan_id uuid;
begin
  if not exists (select 1 from public.profiles where id = (select auth.uid())) then
    raise exception 'Acceso denegado' using errcode = '42501';
  end if;
  if length(trim(coalesce(p_code, ''))) not between 1 and 50
     or length(trim(coalesce(p_firefighter_name, ''))) not between 1 and 150
     or length(trim(coalesce(p_firefighter_rank, ''))) not between 1 and 150
     or p_shift is null or p_shift not in ('Guardia Nocturna A', 'Guardia Diurna B', 'Guardia Bravo', 'Comisión de Servicio Especial')
     or p_expected_return_date is null or p_expected_return_date <= now()
     or length(coalesce(p_notes, '')) > 2000 then
    raise exception 'Datos de préstamo inválidos' using errcode = '22023';
  end if;
  select * into v_resource from public.resources where id = p_resource_id for update;
  if not found or v_resource.status <> 'Disponible' then
    raise exception 'Recurso no disponible' using errcode = '22023';
  end if;
  insert into public.loans (code, resource_id, firefighter_name, firefighter_rank, shift,
    expected_return_date, condition_out, status, notes)
  values (trim(p_code), p_resource_id, trim(p_firefighter_name), trim(p_firefighter_rank),
    p_shift, p_expected_return_date, 'Óptimo', 'Activo', p_notes)
  returning id into v_loan_id;
  update public.resources set status = 'En Uso', updated_at = now() where id = p_resource_id;
  return v_loan_id;
end;
$$;

create or replace function public.return_loan(
  p_loan_id uuid,
  p_condition_in text,
  p_notes text default ''
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_loan public.loans%rowtype;
begin
  if not exists (select 1 from public.profiles where id = (select auth.uid())) then
    raise exception 'Acceso denegado' using errcode = '42501';
  end if;
  if p_condition_in is null or p_condition_in not in ('Óptimo', 'Buen Estado', 'Deteriorado', 'Requiere Mantenimiento')
     or length(coalesce(p_notes, '')) > 2000 then
    raise exception 'Datos de devolución inválidos' using errcode = '22023';
  end if;
  select * into v_loan from public.loans where id = p_loan_id for update;
  if not found or v_loan.status <> 'Activo' then
    raise exception 'Préstamo inexistente o ya devuelto' using errcode = '22023';
  end if;
  update public.loans set actual_return_date = now(), condition_in = p_condition_in,
    status = case when p_condition_in in ('Deteriorado', 'Requiere Mantenimiento') then 'Observado' else 'Devuelto' end,
    notes = concat_ws(' | ', nullif(v_loan.notes, ''), nullif(trim(p_notes), ''))
  where id = p_loan_id;
  update public.resources set
    status = case when p_condition_in in ('Deteriorado', 'Requiere Mantenimiento') then 'En Mantenimiento' else 'Disponible' end,
    updated_at = now()
  where id = v_loan.resource_id;
end;
$$;

revoke all on function public.create_loan(text, uuid, text, text, text, timestamptz, text) from public, anon;
revoke all on function public.return_loan(uuid, text, text) from public, anon;
grant execute on function public.create_loan(text, uuid, text, text, text, timestamptz, text) to authenticated;
grant execute on function public.return_loan(uuid, text, text) to authenticated;
commit;
