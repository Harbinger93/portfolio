-- ==============================================================
-- ACTUALIZACIÓN: AGREGAR EMAIL A LA TABLA PROFILES
-- ==============================================================

-- 1. Agregar la columna email a la tabla profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Actualizar el Trigger para que guarde el email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email, total_points, is_admin)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    0,
    false
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

-- 3. Backfill: Actualizar los perfiles existentes con su email desde auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;
