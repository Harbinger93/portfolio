-- ==============================================================
-- ACTUALIZACIÓN: AVANCE AUTOMÁTICO DE EQUIPOS EN EL BRACKET
-- ==============================================================

create or replace function finalize_match(
  match_id_param bigint,
  actual_goals_home integer,
  actual_goals_away integer,
  actual_winner_id text
)
returns void
language plpgsql
security definer
as $$
declare
  pred record;
  earned integer;
  current_match record;
begin
  -- Obtener información del partido actual para conocer su next_match_id
  select * into current_match from matches where id = match_id_param;

  -- 1. Actualizar el partido con el resultado real
  update matches 
  set 
    goals_home = actual_goals_home,
    goals_away = actual_goals_away,
    winner_id = actual_winner_id,
    is_finished = true
  where id = match_id_param;

  -- =========================================================
  -- 1.5 AVANCE AUTOMÁTICO: Empujar al ganador al siguiente partido
  -- =========================================================
  if current_match.next_match_id is not null and actual_winner_id is not null then
    if current_match.bracket_match_number % 2 != 0 then
      -- Si el número de llave es Impar (Ej: 1, 3, 5), va como equipo Local
      update matches set team_home_id = actual_winner_id where id = current_match.next_match_id;
    else
      -- Si el número de llave es Par (Ej: 2, 4, 6), va como equipo Visitante
      update matches set team_away_id = actual_winner_id where id = current_match.next_match_id;
    end if;
  end if;

  -- 2. Recorrer todas las predicciones de este partido y calcular puntos
  for pred in (select * from predictions where match_id = match_id_param) loop
    earned := 0;

    -- A. Marcador exacto: 3 puntos
    if (pred.pred_goals_home = actual_goals_home and pred.pred_goals_away = actual_goals_away) then
      earned := earned + 3;
    
    -- B. Acertar al ganador o empate: 1 punto (solo si no acertó exacto)
    else
      -- Gana Local
      if (actual_goals_home > actual_goals_away and pred.pred_goals_home > pred.pred_goals_away) then
        earned := earned + 1;
      -- Gana Visitante
      elsif (actual_goals_home < actual_goals_away and pred.pred_goals_home < pred.pred_goals_away) then
        earned := earned + 1;
      -- Empate
      elsif (actual_goals_home = actual_goals_away and pred.pred_goals_home = pred.pred_goals_away) then
        earned := earned + 1;
      end if;
    end if;

    -- C. Acertar quién clasifica en caso de empate
    if (actual_goals_home = actual_goals_away and actual_winner_id is not null) then
      if (pred.pred_winner_id = actual_winner_id) then
        earned := earned + 1;
      end if;
    end if;

    -- D. Guardar puntos en la predicción
    update predictions 
    set points_earned = earned 
    where id = pred.id;

    -- E. Sumar puntos al perfil del usuario
    update profiles 
    set total_points = total_points + earned 
    where id = pred.user_id;

  end loop;
end;
$$;
