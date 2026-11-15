-- Ejecutar una sola vez después de las migraciones 001 a 005.
-- La anulación corrige un préstamo creado por error, no sustituye la devolución.
begin;

alter table public.loans drop constraint loans_status_check;
alter table public.loans add constraint loans_status_check
  check (status in ('Activo', 'Devuelto', 'Observado', 'Anulado'));
alter table public.loans
  add column cancellation_reason text,
  add column cancelled_at timestamptz,
  add column cancelled_by uuid references auth.users(id) on delete set null;

create function public.cancel_loan(p_loan_id uuid, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_loan public.loans%rowtype;
begin
  if not exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ) then
    raise exception 'Acceso denegado' using errcode = '42501';
  end if;
  if length(trim(coalesce(p_reason, ''))) not between 5 and 500 then
    raise exception 'El motivo debe tener entre 5 y 500 caracteres' using errcode = '22023';
  end if;
  select * into v_loan from public.loans where id = p_loan_id for update;
  if not found or v_loan.status <> 'Activo' then
    raise exception 'Solo se puede anular un préstamo activo' using errcode = '22023';
  end if;
  update public.loans
    set status = 'Anulado', cancellation_reason = trim(p_reason),
        cancelled_at = now(), cancelled_by = (select auth.uid())
    where id = v_loan.id;
  update public.resources set status = 'Disponible', updated_at = now()
    where id = v_loan.resource_id and status = 'En Uso';
  if not found then
    raise exception 'El estado del recurso no permite la anulación' using errcode = '22023';
  end if;
end;
$$;
revoke all on function public.cancel_loan(uuid, text) from public, anon;
grant execute on function public.cancel_loan(uuid, text) to authenticated;
commit;
