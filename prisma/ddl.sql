-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  character_name text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  order integer DEFAULT 0,
  CONSTRAINT games_pkey PRIMARY KEY (id),
  CONSTRAINT games_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.predefined_games (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_ko text NOT NULL UNIQUE,
  default_image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name_en text,
  name_ja text,
  name_zh text,
  CONSTRAINT predefined_games_pkey PRIMARY KEY (id)
);

CREATE TABLE public.recommended_tasks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  game_id bigint NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['daily'::text, 'other'::text, 'misc'::text])),
  text_ko text NOT NULL,
  text_en text,
  text_ja text,
  text_zh text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recommended_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT recommended_tasks_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.predefined_games(id)
);

CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  user_id uuid NOT NULL,
  text text NOT NULL,
  category USER-DEFINED NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  due_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);