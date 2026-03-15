import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CREATE_TABLE_SQL = `
create table if not exists public.participants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type_code varchar(4) not null,
  architect_name varchar(100) not null,
  axis_scores jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.participants enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'participants' and policyname = 'Anyone can view participants') then
    create policy "Anyone can view participants" on public.participants for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'participants' and policyname = 'Anyone can insert participants') then
    create policy "Anyone can insert participants" on public.participants for insert with check (true);
  end if;
end $$;

create index if not exists idx_participants_created_at on public.participants (created_at desc);
`.trim();

export async function POST() {
  // Try to create the table using Supabase's SQL endpoint
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error: "SUPABASE_SERVICE_ROLE_KEY が設定されていません",
        sql: CREATE_TABLE_SQL,
        instructions:
          "Supabase ダッシュボードの SQL Editor で上記 SQL を実行するか、.env.local に SUPABASE_SERVICE_ROLE_KEY を追加してください。",
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
    });

    // The rpc endpoint won't work for DDL, try the pg-meta SQL endpoint instead
    const sqlRes = await fetch(
      `${supabaseUrl.replace(".supabase.co", ".supabase.co")}/pg/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({ query: CREATE_TABLE_SQL }),
      }
    );

    if (!sqlRes.ok) {
      const errBody = await sqlRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: `SQL実行に失敗: ${sqlRes.status}`,
          detail: errBody,
          sql: CREATE_TABLE_SQL,
          instructions:
            "Supabase ダッシュボードの SQL Editor で上記 SQL を実行してください。",
        },
        { status: 500 }
      );
    }

    // Verify table was created
    const supabase = await createClient();
    const { error: verifyError } = await supabase
      .from("participants")
      .select("id")
      .limit(1);

    if (verifyError) {
      return NextResponse.json(
        {
          error: "テーブル作成後の確認に失敗しました",
          detail: verifyError.message,
          sql: CREATE_TABLE_SQL,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "participants テーブルを作成しました" });
  } catch (err) {
    return NextResponse.json(
      {
        error: "セットアップに失敗しました",
        detail: err instanceof Error ? err.message : "Unknown error",
        sql: CREATE_TABLE_SQL,
        instructions:
          "Supabase ダッシュボードの SQL Editor で上記 SQL を実行してください。",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Check if participants table exists
  const supabase = await createClient();
  const { error } = await supabase.from("participants").select("id").limit(1);

  if (error) {
    return NextResponse.json({
      status: "テーブルが存在しません",
      sql: CREATE_TABLE_SQL,
      instructions:
        "以下の SQL を Supabase ダッシュボード (SQL Editor) で実行してください。",
    });
  }

  const { count } = await supabase
    .from("participants")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    status: "OK",
    participantCount: count ?? 0,
  });
}
