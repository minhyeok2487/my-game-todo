-- 1단계: 기존에 있던 스케줄 삭제하기
-- 새로운 스케줄을 등록하기 전에, 이전 스케줄을 깔끔하게 삭제하여 중복 실행을 방지합니다.
SELECT cron.unschedule('reset_daily_tasks');


-- 2단계: 새로운 함수 생성 및 기존 함수 업데이트

-- 함수 1: '일일 숙제'만 초기화하는 함수 (auto_reset_enabled 조건 추가)
CREATE OR REPLACE FUNCTION public.reset_daily_tasks()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET completed = false,
      last_reset_date = now()
  WHERE category = 'daily' AND auto_reset_enabled = TRUE;
END;
$$ LANGUAGE plpgsql;


-- 함수 2: '기간 숙제' 중 만료된 것을 처리하는 함수 (auto_reset_enabled 조건 추가)
CREATE OR REPLACE FUNCTION public.reset_expired_other_tasks()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET completed = false,
      last_reset_date = now()
  WHERE category = 'other' AND due_date < now() AND auto_reset_enabled = TRUE;
END;
$$ LANGUAGE plpgsql;

-- 함수 3: '주간 숙제'를 초기화하는 함수
CREATE OR REPLACE FUNCTION public.reset_weekly_tasks()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET completed = false,
      last_reset_date = now()
  WHERE recurrence_type = 'WEEKLY'
    AND auto_reset_enabled = TRUE
    AND CAST(recurrence_value AS INTEGER) = EXTRACT(DOW FROM NOW()); -- 일요일=0, 월요일=1, ..., 토요일=6
END;
$$ LANGUAGE plpgsql;

-- 함수 4: '월간 숙제'를 초기화하는 함수
CREATE OR REPLACE FUNCTION public.reset_monthly_tasks()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET completed = false,
      last_reset_date = now()
  WHERE recurrence_type = 'MONTHLY'
    AND auto_reset_enabled = TRUE
    AND CAST(recurrence_value AS INTEGER) = EXTRACT(DAY FROM NOW()); -- 1일부터 31일
END;
$$ LANGUAGE plpgsql;

-- 3단계: 새로운 스케줄 등록

-- 스케줄 1: '일일 숙제 초기화'는 매일 20시 00분(UTC)에 실행
SELECT cron.schedule(
  'daily-tasks-reset', -- 스케줄 이름
  '0 20 * * *',        -- Cron 표현식: 매일 20:00 UTC
  'SELECT public.reset_daily_tasks()' -- 실행할 함수
);

-- 스케줄 2: '기간 숙제 정리'는 매시간 0분에 실행
SELECT cron.schedule(
  'hourly-other-tasks-cleanup', -- 스케줄 이름
  '0 * * * *',                  -- Cron 표현식: 매시간 0분
  'SELECT public.reset_expired_other_tasks()' -- 실행할 함수
);

-- 스케줄 3: '주간 숙제 초기화'는 매일 20시 00분(UTC)에 실행 (주간 숙제 조건은 함수 내에서 처리)
SELECT cron.schedule(
  'weekly-tasks-reset', -- 스케줄 이름
  '0 20 * * *',         -- Cron 표현식: 매일 20:00 UTC
  'SELECT public.reset_weekly_tasks()' -- 실행할 함수
);

-- 스케줄 4: '월간 숙제 초기화'는 매일 20시 00분(UTC)에 실행 (월간 숙제 조건은 함수 내에서 처리)
SELECT cron.schedule(
  'monthly-tasks-reset', -- 스케줄 이름
  '0 20 * * *',          -- Cron 표현식: 매일 20:00 UTC
  'SELECT public.reset_monthly_tasks()' -- 실행할 함수
);
