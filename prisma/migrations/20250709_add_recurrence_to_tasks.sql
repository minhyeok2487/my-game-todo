-- Migration: Add recurrence and auto-reset/delete fields to public.tasks table

-- NOTE: The 'category' column in public.tasks was defined as 'USER-DEFINED'.
-- Please ensure its actual type (e.g., TEXT or a specific ENUM) is correctly handled
-- when applying this DDL to your Supabase database.

ALTER TABLE public.tasks
ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN recurrence_type TEXT,
ADD COLUMN recurrence_value TEXT,
ADD COLUMN auto_reset_enabled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN auto_delete_after_days INTEGER,
ADD COLUMN last_reset_date TIMESTAMP WITH TIME ZONE;

-- Optional: Add indexes for performance
-- CREATE INDEX idx_tasks_user_id_is_recurring ON public.tasks (user_id, is_recurring);
-- CREATE INDEX idx_tasks_last_reset_date ON public.tasks (last_reset_date);