-- Preparación para SystemBomb. Ejecutar solo en un proyecto nuevo o después de
-- revisar el estado de la base de datos. No contiene contraseñas ni usuarios.
-- La aplicación aún debe adaptarse a este esquema antes de utilizarlo.

begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) between 1 and 150),
  role text not null check (role in ('admin_logistica', 'bombero_operativo')),
  rank text not null default '',
  station text not null default ''
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (length(trim(code)) between 1 and 50),
  name text not null check (length(trim(name)) between 1 and 200),
  category text not null,
  location text not null,
  status text not null check (status in ('Disponible', 'En Uso', 'En Mantenimiento', 'Baja Lógica')),
  stock_actual integer not null check (stock_actual >= 0),
  stock_minimo integer not null check (stock_minimo >= 0),
  inspection_date date not null,
  serial_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  resource_id uuid not null references public.resources(id) on delete restrict,
  firefighter_name text not null check (length(trim(firefighter_name)) between 1 and 150),
  firefighter_rank text not null,
  shift text not null,
  loan_date timestamptz not null default now(),
  expected_return_date timestamptz not null,
  actual_return_date timestamptz,
  condition_out text not null check (condition_out in ('Óptimo', 'Buen Estado', 'Regular')),
  condition_in text check (condition_in in ('Óptimo', 'Buen Estado', 'Deteriorado', 'Requiere Mantenimiento')),
  status text not null check (status in ('Activo', 'Devuelto', 'Observado')),
  notes text,
  check (expected_return_date >= loan_date)
);

create unique index loans_one_active_per_resource
  on public.loans (resource_id) where status = 'Activo';

create table public.maintenance (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  equipment_name text not null check (length(trim(equipment_name)) between 1 and 200),
  equipment_type text not null,
  maintenance_type text not null,
  scheduled_date date not null,
  completed_date date,
  technician text not null,
  cost numeric(12,2) not null default 0 check (cost >= 0),
  status text not null check (status in ('Programado', 'En Curso', 'Completado', 'Vencido')),
  priority text not null check (priority in ('Alta', 'Media', 'Baja')),
  observations text not null default ''
);

alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.loans enable row level security;
alter table public.maintenance enable row level security;

-- Los usuarios solo pueden consultar su propio perfil. Nadie puede editar su
-- rol desde la aplicación; los perfiles los asigna un administrador confiable.
create policy profiles_read_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy resources_read on public.resources
  for select to authenticated using (exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
  ));
create policy loans_read on public.loans
  for select to authenticated using (exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
  ));
create policy maintenance_read on public.maintenance
  for select to authenticated using (exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
  ));

-- Solo lectura por ahora: las escrituras permanecen denegadas hasta definir
-- operaciones transaccionales y comprobaciones de rol desde el servidor.
revoke all on public.profiles, public.resources, public.loans, public.maintenance from anon, authenticated;
grant usage on schema public to authenticated;
grant select on public.profiles, public.resources, public.loans, public.maintenance to authenticated;

commit;
