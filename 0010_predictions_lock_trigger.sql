-- Create a function to check if the match is locked for predictions
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
    RAISE EXCEPTION 'Match % is locked. Predictions must be submitted at least 15 minutes before the match starts.', NEW.match_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the predictions table
DROP TRIGGER IF EXISTS enforce_prediction_lock_trigger ON predictions;
CREATE TRIGGER enforce_prediction_lock_trigger
BEFORE INSERT OR UPDATE ON predictions
FOR EACH ROW
EXECUTE FUNCTION check_prediction_lock();
