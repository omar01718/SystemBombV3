-- Solo perfiles ya autorizados. Si aparece otra estación, revisar antes de continuar.
do $$
begin
  lock table public.profiles in share row exclusive mode;
  if exists (select 1 from public.profiles where station not in ('', 'B-233')) then
    raise exception 'Hay perfiles de estación no reconocida; revisar sin reasignarlos';
  end if;
  update public.profiles set station = 'B-233' where station = '';
  alter table public.profiles alter column station drop default;
  alter table public.profiles add constraint profiles_estacion_unica check (station = 'B-233');
end;
$$;
