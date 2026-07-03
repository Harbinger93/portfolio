-- Actualizar perfiles existentes con el full_name de auth.users si existe y está vacío en profiles
UPDATE public.profiles p
SET full_name = coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', p.full_name)
FROM auth.users u
WHERE p.id = u.id AND (p.full_name IS NULL OR p.full_name = '');
