-- Tabla de Contactos
create table public.contacts (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid(),
  name text not null,
  nickname text null,
  relation text not null,
  avatar text null,
  frequency_days integer not null default 7,
  location text null,
  private_notes text null,
  interests text[] null,
  birthday date null,
  last_interaction_date timestamp with time zone null,
  constraint contacts_pkey primary key (id)
);

-- Tabla de Interacciones
create table public.interactions (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid(),
  contact_id uuid not null,
  type text not null,
  date timestamp with time zone not null,
  title text not null,
  notes text null,
  is_private boolean not null default false,
  location text null,
  constraint interactions_pkey primary key (id),
  constraint interactions_contact_id_fkey foreign key (contact_id) references contacts (id) on delete cascade
);

-- Habilitar seguridad (RLS)
alter table public.contacts enable row level security;
alter table public.interactions enable row level security;

-- Políticas de seguridad para Contactos
create policy "Usuarios pueden ver sus propios contactos" on public.contacts
  for select using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propios contactos" on public.contacts
  for insert with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus propios contactos" on public.contacts
  for update using (auth.uid() = user_id);

create policy "Usuarios pueden eliminar sus propios contactos" on public.contacts
  for delete using (auth.uid() = user_id);

-- Políticas de seguridad para Interacciones
create policy "Usuarios pueden ver sus propias interacciones" on public.interactions
  for select using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propias interacciones" on public.interactions
  for insert with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus propias interacciones" on public.interactions
  for update using (auth.uid() = user_id);

create policy "Usuarios pueden eliminar sus propias interacciones" on public.interactions
  for delete using (auth.uid() = user_id);
