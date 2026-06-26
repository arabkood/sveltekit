-- Functions

CREATE OR REPLACE FUNCTION public.auto_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.handle_streak_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    user_stats RECORD;
    today DATE := NEW.date;
BEGIN
    -- Lock stats row to avoid race conditions
    SELECT *
    INTO user_stats
    FROM users.stats
    WHERE user_id = NEW.user_id
    FOR UPDATE;

    -- First activity ever
    IF user_stats IS NULL THEN
        INSERT INTO users.stats (
            user_id,
            current_streak,
            longest_streak,
            last_active_date
        )
        VALUES (
            NEW.user_id,
            1,
            1,
            today
        );

        RETURN NEW;
    END IF;

    -- Continue streak
    IF user_stats.last_active_date = today - INTERVAL '1 day' THEN
        UPDATE users.stats
        SET
            current_streak = user_stats.current_streak + 1,
            longest_streak = GREATEST(
                user_stats.longest_streak,
                user_stats.current_streak + 1
            ),
            last_active_date = today
        WHERE user_id = NEW.user_id;

    -- Restart streak
    ELSIF user_stats.last_active_date < today - INTERVAL '1 day' THEN
        UPDATE users.stats
        SET
            current_streak = 1,
            last_active_date = today
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$;


-- Triggers
DROP TRIGGER IF EXISTS one_time_tokens_auto_updated_at
ON auth.one_time_tokens;
CREATE TRIGGER one_time_tokens_auto_updated_at
BEFORE UPDATE
ON auth.one_time_tokens
FOR EACH ROW
EXECUTE FUNCTION public.auto_updated_at();


DROP TRIGGER IF EXISTS user_subscriptions_auto_updated_at
ON auth.user_subscriptions;
CREATE TRIGGER user_subscriptions_auto_updated_at
BEFORE UPDATE
ON auth.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.auto_updated_at();


DROP TRIGGER IF EXISTS users_auto_updated_at
ON auth.users;
CREATE TRIGGER users_auto_updated_at
BEFORE UPDATE
ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_updated_at();


DROP TRIGGER IF EXISTS trigger_update_streak_on_new_day
ON users.daily_stats;
CREATE TRIGGER trigger_update_streak_on_new_day
AFTER INSERT
ON users.daily_stats
FOR EACH ROW
EXECUTE FUNCTION public.handle_streak_update();
