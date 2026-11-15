-- Borrador para inventario; requiere 001_initial_schema.sql.
-- No ejecutar hasta completar y probar la integración.
begin;

-- PostgreSQL también protege la unicidad cuando el código difiere solo por
-- mayúsculas o por espacios al inicio y al final.
create unique index resources_normalized_code
  on public.resources (upper(trim(code)));

alter table public.resources
  add constraint resources_category_allowed check (category in (
    'Protección Personal (EPP)', 'Extinción de Incendios',
    'Rescate y Extricación', 'Protección Respiratoria (ERA)',
    'Atención Prehospitalaria', 'Comunicaciones y Señalización'
  )),
  add constraint resources_location_allowed check (location in (
    'Almacén Central B-233', 'Autobomba B-233', 'Cisterna C-233',
    'Unidad Rescate R-233', 'Ambulancia M-233', 'Tópico y Trauma'
  )),
  add constraint resources_serial_length check (length(coalesce(serial_number, '')) <= 150),
  add constraint resources_notes_length check (length(coalesce(notes, '')) <= 2000);

-- La autorización se comprueba en PostgreSQL, no solamente en la interfaz.
create policy resources_admin_insert on public.resources
  for insert to authenticated
  with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));

create policy resources_admin_update on public.resources
  for update to authenticated
  using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ))
  with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));

create policy resources_admin_delete on public.resources
  for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin_logistica'
  ));

grant insert, update, delete on public.resources to authenticated;
commit;
