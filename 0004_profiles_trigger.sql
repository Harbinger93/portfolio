-- ==============================================================
-- TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE
-- ==============================================================

-- 1. Creamos la función que Supabase ejecutará cuando un usuario se registre
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, total_points, is_admin)
  values (
    new.id,
    -- Intenta tomar el username del registro por email, o de Google, o usa la primera parte del correo
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    -- Intenta tomar el nombre completo si viene de Google
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    0,
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Asignamos la función como un Trigger en la tabla de auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==============================================================
-- BACKFILL: RECUPERAR USUARIOS QUE YA SE HABÍAN REGISTRADO
-- ==============================================================
-- Esto tomará tu usuario actual de auth.users y le creará su perfil para que no lo pierdas.
insert into public.profiles (id, username, full_name, total_points, is_admin)
select 
  id,
  coalesce(raw_user_meta_data->>'username', raw_user_meta_data->>'user_name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  0,
  false
from auth.users
where id not in (select id from public.profiles);
