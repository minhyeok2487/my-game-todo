-- 기존 테이블 삭제
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.games;
DROP TYPE IF EXISTS public.task_category;

-- ENUM 타입 생성 (데이터 일관성)
CREATE TYPE public.task_category AS ENUM ('daily', 'other', 'misc');

-- games 테이블 생성
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- ON DELETE CASCADE 추가
  name TEXT NOT NULL,
  character_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tasks 테이블 생성
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- ON DELETE CASCADE 추가
  text TEXT NOT NULL,
  category public.task_category NOT NULL, -- ENUM 타입 적용
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
CREATE POLICY "사용자는 자신의 게임 데이터만 관리할 수 있습니다." ON public.games
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 할 일 데이터만 관리할 수 있습니다." ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- 인덱스 추가 (성능 향상)
CREATE INDEX ON public.games (user_id);
CREATE INDEX ON public.tasks (user_id);
CREATE INDEX ON public.tasks (game_id);
