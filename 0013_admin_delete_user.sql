-- ==============================================================
-- FUNCIÓN PARA ELIMINAR UN USUARIO COMO ADMINISTRADOR
-- ==============================================================

CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- SEGURIDAD: Validar que quien invoca la función es un administrador
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Acceso denegado: Se requieren permisos de administrador';
  END IF;

  -- Eliminar datos dependientes primero por si acaso las FK no tienen ON DELETE CASCADE
  DELETE FROM predictions WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;
  
  -- Finalmente eliminar el usuario del sistema de autenticación de Supabase
  DELETE FROM auth.users WHERE id = target_user_id;

END;
$$;
