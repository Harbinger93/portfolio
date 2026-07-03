-- ==============================================================
-- FIX: RECALCULAR PUNTOS CORRECTAMENTE SIN DUPLICAR Y AÑADIR UNFINALIZE
-- CON VALIDACIÓN ESTRICTA DE PERMISOS DE ADMINISTRADOR
-- ==============================================================

CREATE OR REPLACE FUNCTION finalize_match(
  match_id_param bigint,
  actual_goals_home integer,
  actual_goals_away integer,
  actual_winner_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pred record;
  earned integer;
  old_earned integer;
  current_match record;
BEGIN
  -- SEGURIDAD: Validar que quien invoca la función es un administrador
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Acceso denegado: Se requieren permisos de administrador';
  END IF;

  -- Obtener información del partido actual para conocer su next_match_id
  SELECT * INTO current_match FROM matches WHERE id = match_id_param;

  -- 1. Actualizar el partido con el resultado real
  UPDATE matches 
  SET 
    goals_home = actual_goals_home,
    goals_away = actual_goals_away,
    winner_id = actual_winner_id,
    is_finished = true
  WHERE id = match_id_param;

  -- 1.5 AVANCE AUTOMÁTICO: Empujar al ganador al siguiente partido
  IF current_match.next_match_id IS NOT NULL AND actual_winner_id IS NOT NULL THEN
    IF current_match.bracket_match_number % 2 != 0 THEN
      UPDATE matches SET team_home_id = actual_winner_id WHERE id = current_match.next_match_id;
    ELSE
      UPDATE matches SET team_away_id = actual_winner_id WHERE id = current_match.next_match_id;
    END IF;
  END IF;

  -- 2. Recorrer todas las predicciones de este partido y calcular puntos
  FOR pred IN (SELECT * FROM predictions WHERE match_id = match_id_param) LOOP
    earned := 0;
    old_earned := COALESCE(pred.points_earned, 0);

    -- A. Marcador exacto: 3 puntos
    IF (pred.pred_goals_home = actual_goals_home AND pred.pred_goals_away = actual_goals_away) THEN
      earned := earned + 3;
    
    -- B. Acertar al ganador o empate: 1 punto (solo si no acertó exacto)
    ELSE
      -- Gana Local
      IF (actual_goals_home > actual_goals_away AND pred.pred_goals_home > pred.pred_goals_away) THEN
        earned := earned + 1;
      -- Gana Visitante
      ELSIF (actual_goals_home < actual_goals_away AND pred.pred_goals_home < pred.pred_goals_away) THEN
        earned := earned + 1;
      -- Empate
      ELSIF (actual_goals_home = actual_goals_away AND pred.pred_goals_home = pred.pred_goals_away) THEN
        earned := earned + 1;
      END IF;
    END IF;

    -- C. Acertar quién clasifica en caso de empate
    IF (actual_goals_home = actual_goals_away AND actual_winner_id IS NOT NULL) THEN
      IF (pred.pred_winner_id = actual_winner_id) THEN
        earned := earned + 1;
      END IF;
    END IF;

    -- D. Guardar puntos en la predicción
    UPDATE predictions 
    SET points_earned = earned 
    WHERE id = pred.id;

    -- E. Sumar puntos al perfil del usuario (restando los que ya tenía de este partido para no duplicar)
    UPDATE profiles 
    SET total_points = COALESCE(total_points, 0) - old_earned + earned 
    WHERE id = pred.user_id;

  END LOOP;
END;
$$;


-- ==============================================================
-- NUEVA FUNCIÓN: REVERTIR FINALIZACIÓN DE PARTIDO
-- CON VALIDACIÓN ESTRICTA DE PERMISOS DE ADMINISTRADOR
-- ==============================================================
CREATE OR REPLACE FUNCTION unfinalize_match(
  match_id_param bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pred record;
  old_earned integer;
  current_match record;
BEGIN
  -- SEGURIDAD: Validar que quien invoca la función es un administrador
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Acceso denegado: Se requieren permisos de administrador';
  END IF;

  SELECT * INTO current_match FROM matches WHERE id = match_id_param;

  -- Si el partido no estaba finalizado, no hay nada que revertir
  IF NOT current_match.is_finished THEN
    RETURN;
  END IF;

  -- 1. Recorrer predicciones para restar los puntos que habían ganado
  FOR pred IN (SELECT * FROM predictions WHERE match_id = match_id_param) LOOP
    old_earned := COALESCE(pred.points_earned, 0);

    IF old_earned > 0 THEN
      -- Restar puntos del perfil
      UPDATE profiles 
      SET total_points = COALESCE(total_points, 0) - old_earned 
      WHERE id = pred.user_id;
      
      -- Resetear puntos en la predicción
      UPDATE predictions 
      SET points_earned = 0 
      WHERE id = pred.id;
    END IF;
  END LOOP;

  -- 2. Retroceder Avance Automático si es posible (solo si el ganador actual estaba en la siguiente llave)
  IF current_match.next_match_id IS NOT NULL AND current_match.winner_id IS NOT NULL THEN
    IF current_match.bracket_match_number % 2 != 0 THEN
      -- Limpiar team_home_id del siguiente partido si coincide con el que avanzó
      UPDATE matches SET team_home_id = NULL WHERE id = current_match.next_match_id AND team_home_id = current_match.winner_id;
    ELSE
      -- Limpiar team_away_id del siguiente partido si coincide con el que avanzó
      UPDATE matches SET team_away_id = NULL WHERE id = current_match.next_match_id AND team_away_id = current_match.winner_id;
    END IF;
  END IF;

  -- 3. Resetear el partido actual a su estado original
  UPDATE matches 
  SET 
    goals_home = NULL,
    goals_away = NULL,
    winner_id = NULL,
    is_finished = false
  WHERE id = match_id_param;

END;
$$;
