-- 建築家MBTI DBスキーマ（Supabase用）

-- ユーザー名を保持する拡張テーブル（auth.usersと連携）
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own data" on public.users
  for insert with check (auth.uid() = id);

-- 診断結果
create table public.diagnoses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  answers jsonb not null,
  type_code varchar(4) not null,
  architect_name varchar(100) not null,
  analysis_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.diagnoses enable row level security;

create policy "Users can view own diagnoses" on public.diagnoses
  for select using (auth.uid() = user_id);

create policy "Users can insert own diagnoses" on public.diagnoses
  for insert with check (auth.uid() = user_id);

-- チーム（Phase 2用）
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code varchar(20) unique not null,
  created_by uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teams enable row level security;

-- チームメンバー（Phase 2用）
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

alter table public.team_members enable row level security;

-- 相性（Phase 2用）
create table public.compatibilities (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_a_id uuid references public.users(id) on delete cascade not null,
  user_b_id uuid references public.users(id) on delete cascade not null,
  score integer,
  analysis_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.compatibilities enable row level security;

-- 新規ユーザー作成時にpublic.usersにも自動挿入するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
