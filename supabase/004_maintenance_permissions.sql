-- Borrador para mantenimiento; requiere 001_initial_schema.sql.
-- No ejecutar hasta completar y probar la integración.
begin;

alter table public.maintenance
  add constraint maintenance_code_length check (length(trim(code)) between 1 and 50),
  add constraint maintenance_equipment_type_allowed check (equipment_type in (
    'Unidad Autobomba', 'Unidad Cisterna', 'Equipo ERA',
    'Herramienta Hidráulica', 'Motobomba'
  )),
  add constraint maintenance_type_allowed check (maintenance_type in (
    'Mantenimiento Preventivo', 'Mantenimiento Correctivo',
    'Inspección Periódica', 'Prueba Hidrostática NFPA'
  )),
  add constraint maintenance_technician_length check (length(trim(technician)) between 1 and 150),
  add constraint maintenance_observations_length check (length(observations) <= 2000);

create unique index maintenance_normalized_code
  on public.maintenance (upper(trim(code)));

create policy maintenance_admin_insert on public.maintenance
  for insert to authenticated with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));
create policy maintenance_admin_update on public.maintenance
  for update to authenticated
  using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ))
  with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));
create policy maintenance_admin_delete on public.maintenance
  for delete to authenticated using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));

grant insert, update, delete on public.maintenance to authenticated;
commit;
