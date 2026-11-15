-- Ejecutar una sola vez, después de 001 a 004, en un proyecto de prueba.
-- Las operaciones de préstamo existentes mantienen los bloqueos y transacciones.
begin;

do $$
begin
  if exists (
    select 1 from public.resources r
    where (r.status = 'En Uso') <> exists (
      select 1 from public.loans l where l.resource_id = r.id and l.status = 'Activo'
    )
  ) then
    raise exception 'Hay recursos cuyo estado no coincide con sus préstamos activos; revise los datos antes de continuar';
  end if;
end;
$$;

create table public.audit_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text not null,
  actor_role text not null,
  action text not null,
  entity text not null,
  details text not null
);
alter table public.audit_events enable row level security;
revoke all on public.audit_events from public, anon, authenticated;
grant select on public.audit_events to authenticated;
create policy audit_events_read on public.audit_events for select to authenticated
  using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin_logistica'));

create function public.record_operational_event() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_row jsonb;
  v_name text;
  v_role text;
  v_action text;
begin
  v_row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  select full_name, role into v_name, v_role from public.profiles where id = (select auth.uid());
  v_action := case tg_op when 'INSERT' then 'CREACIÓN' when 'DELETE' then 'ELIMINACIÓN' else 'ACTUALIZACIÓN' end;
  insert into public.audit_events (actor_id, actor_name, actor_role, action, entity, details)
  values ((select auth.uid()), coalesce(v_name, 'Sistema'), coalesce(v_role, 'sistema'), v_action,
    tg_table_name, 'Código: ' || coalesce(v_row ->> 'code', '(sin código)'));
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.record_operational_event() from public, anon, authenticated;
create trigger audit_resources after insert or update or delete on public.resources
  for each row execute function public.record_operational_event();
create trigger audit_loans after insert or update or delete on public.loans
  for each row execute function public.record_operational_event();
create trigger audit_maintenance after insert or update or delete on public.maintenance
  for each row execute function public.record_operational_event();

-- Impide cambiar manualmente el estado de un recurso contradiciendo el préstamo.
-- La función de préstamo inserta primero el préstamo activo y actualiza después
-- el recurso; la devolución actualiza primero el préstamo y luego el recurso.
create function public.check_resource_loan_status() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_active boolean;
begin
  select exists (select 1 from public.loans where resource_id = new.id and status = 'Activo') into v_active;
  if (v_active and new.status <> 'En Uso') or (not v_active and new.status = 'En Uso') then
    raise exception 'El estado del recurso debe corresponder a sus préstamos activos' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function public.check_resource_loan_status() from public, anon, authenticated;
create trigger resource_loan_status before insert or update of status on public.resources
  for each row execute function public.check_resource_loan_status();

commit;
