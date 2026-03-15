-- 公開参加者テーブル（認証不要）
create table public.participants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type_code varchar(4) not null,
  architect_name varchar(100) not null,
  axis_scores jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.participants enable row level security;

-- 誰でも閲覧可能
create policy "Anyone can view participants" on public.participants
  for select using (true);

-- 誰でも登録可能
create policy "Anyone can insert participants" on public.participants
  for insert with check (true);

-- 名前での検索用インデックス
create index idx_participants_created_at on public.participants (created_at desc);
