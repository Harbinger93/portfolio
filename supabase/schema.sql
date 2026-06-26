-- ==========================================
-- ESQUEMA DE BASE DE DATOS PARA PORTAFOLIO
-- ==========================================
-- Ejecutar este script en el SQL Editor de tu Dashboard de Supabase.

-- 1. Tabla de Contactos
create table if not exists public.contact (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text not null,
  telefono text,
  pais text,
  mensaje text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para la tabla contact
alter table public.contact enable row level security;

-- Política de RLS: Permitir inserciones (cualquier visitante)
create policy "Permitir inserciones de contactos" on public.contact
  for insert
  with check (true);

-- Política de RLS: Bloquear lecturas para evitar fuga de datos
create policy "Bloquear lecturas de contactos" on public.contact
  for select
  using (false);


-- 2. Tabla de Onboarding (Briefings)
create table if not exists public.onboarding (
  id text primary key, -- Se guarda el custom ID tipo 'onb_...' generado en el cliente
  client_uuid text,
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text,
  current_website text,
  business_description text,
  target_audience text,
  primary_goal text,
  hosting_status text,
  brand_assets_status text,
  required_sections text,
  features_selected text,
  deadline text, -- Se almacena como texto para dar compatibilidad de formatos
  estimated_budget_range text,
  drive_folder_link text,
  privacy_policy_accepted text,
  consent_timestamp timestamp with time zone,
  consent_version text,
  ip_address_hash text,
  status text default 'Awaiting_Content',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para la tabla onboarding
alter table public.onboarding enable row level security;

-- Política de RLS: Permitir inserciones
create policy "Permitir inserciones de onboarding" on public.onboarding
  for insert
  with check (true);

-- Política de RLS: Bloquear lecturas para proteger los briefings
create policy "Bloquear lecturas de onboarding" on public.onboarding
  for select
  using (false);

-- Política de RLS: Permitir actualizar el enlace de Drive en base al ID
create policy "Permitir actualizar enlace de Drive" on public.onboarding
  for update
  using (true)
  with check (true);
