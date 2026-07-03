-- Añadir avatar_url a profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Actualizar perfiles existentes con el avatar_url de auth.users si existe
UPDATE public.profiles p
SET avatar_url = u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE p.id = u.id AND p.avatar_url IS NULL;

-- Actualizar el trigger para que incluya el avatar_url en el futuro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, total_points, is_admin)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url',
    0,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
