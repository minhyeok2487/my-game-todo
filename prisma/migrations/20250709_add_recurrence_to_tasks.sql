ALTER TABLE public.tasks
ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT FALSE, -- 이 숙제가 반복되는 숙제인지 여부를 나타냅니다.
ADD COLUMN recurrence_type TEXT, -- 숙제의 반복 주기 (예: WEEKLY, MONTHLY 등)
ADD COLUMN recurrence_value TEXT, -- 구체적인 반복 값
ADD COLUMN auto_reset_enabled BOOLEAN NOT NULL DEFAULT FALSE, -- 숙제가 반복 주기에 따라 자동으로 초기화될지 여부
ADD COLUMN last_reset_date TIMESTAMP WITH TIME ZONE; -- 마지막으로 숙제가 초기화된 날짜