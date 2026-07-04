-- Fix for prediction lock trigger blocking admins from finalizing matches.
-- The trigger was blocking ANY updates to the `predictions` table once the match was locked.
-- When an admin finalizes a match, the `finalize_match` RPC updates the `points_earned` field on the `predictions` table.
-- This caused the transaction to fail.
-- Solution: We modify the trigger to allow UPDATE operations IF the actual prediction values (goals and winner) haven't changed.

CREATE OR REPLACE FUNCTION check_prediction_lock()
RETURNS TRIGGER AS $$
DECLARE
  match_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the match_time for the prediction
  SELECT match_time INTO match_start
  FROM matches
  WHERE id = NEW.match_id;

  -- If match is not found or match_time is null, allow it (fallback)
  IF match_start IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check if the current time is past (match_time - 15 minutes)
  IF NOW() >= (match_start - INTERVAL '15 minutes') THEN
    
    -- Allow updates if ONLY system-controlled fields (like points_earned) are changing.
    -- We verify that the actual prediction values haven't been tampered with.
    IF TG_OP = 'UPDATE' AND 
       OLD.pred_goals_home = NEW.pred_goals_home AND 
       OLD.pred_goals_away = NEW.pred_goals_away AND 
       OLD.pred_winner_id IS NOT DISTINCT FROM NEW.pred_winner_id THEN
      RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Match % is locked. Predictions must be submitted at least 15 minutes before the match starts.', NEW.match_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
