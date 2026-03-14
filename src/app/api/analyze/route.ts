import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { questions } from "@/data/questions";
import { mbtiTypes, axisDefinitions } from "@/data/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { answers, typeCode, architectCandidates, selectedArchitectIndex, axisScores, userName } = body;

  const typeData = mbtiTypes[typeCode];
  if (!typeData) {
    return Response.json({ error: "Invalid type code" }, { status: 400 });
  }

  // 20問の回答を整形
  const answersText = questions
    .map((q) => {
      const score = answers[q.id];
      const labels = ["完全にA寄り", "どちらかといえばA", "どちらとも言えない", "どちらかといえばB", "完全にB寄り"];
      return `Q${q.id}（${q.axis}軸・${q.category}）${q.title}\n  A: ${q.optionA}\n  B: ${q.optionB}\n  回答: ${score}（${labels[score - 1]}）`;
    })
    .join("\n\n");

  // 軸スコアの整形
  const axisText = axisScores
    .map((s: { axis: string; average: number; letter: string }) => {
      const def = axisDefinitions[s.axis as keyof typeof axisDefinitions];
      return `${s.axis}軸（${def.label}）: 平均${s.average.toFixed(2)} → ${s.letter}（${s.letter === def.left.letter ? def.left.label : def.right.label}）`;
    })
    .join("\n");

  // 全16タイプの情報
  const allTypesText = Object.values(mbtiTypes)
    .map(
      (t) =>
        `${t.code}: ${t.name}（${t.reading}）「${t.catchcopy}」\n  建築家1: ${t.architects[0].name}（${t.architects[0].works.join("、")}）- ${t.architects[0].trait}\n  建築家2: ${t.architects[1].name}（${t.architects[1].works.join("、")}）- ${t.architects[1].trait}`
    )
    .join("\n\n");

  const systemPrompt = `あなたは「建築家MBTI」の診断結果を生成するAIです。
MBTIの4軸を建築的に翻訳した独自の性格診断で、診断結果として日本人建築家を割り当てます。

## 4つの診断軸
${Object.entries(axisDefinitions)
  .map(
    ([key, def]) =>
      `${key}: ${def.left.letter}（${def.left.label}: ${def.left.description}） vs ${def.right.letter}（${def.right.label}: ${def.right.description}）`
  )
  .join("\n")}

## 全16タイプ
${allTypesText}

## あなたの出力ルール
以下のJSON形式で出力してください。JSON以外のテキストは一切出力しないでください。

{
  "axisAnalyses": [
    {
      "axis": "EI",
      "title": "社交建築 vs 瞑想建築",
      "analysis": "（この軸に関する2-3文の分析。回答の矛盾や揺れがあればそれも読み解く）"
    },
    { "axis": "SN", "title": "...", "analysis": "..." },
    { "axis": "TF", "title": "...", "analysis": "..." },
    { "axis": "JP", "title": "...", "analysis": "..." }
  ],
  "selectedArchitect": "（2名の候補から1名を選定した建築家名）",
  "selectionReason": "（なぜこの建築家がフィットするのか、回答パターンと建築家の特徴を結びつけた3-4文の説明）",
  "architectInsight": "（この建築家の設計哲学や代表作品に関連づけた、その人へのアドバイスや考察。2-3文）",
  "closingMessage": "（ユーモアを交えた締めの一言。建築用語や建築家のエピソードを絡めると良い）"
}`;

  const userPrompt = `## 診断対象
名前: ${userName || "ゲスト"}

## 回答結果
${answersText}

## 軸スコア
${axisText}

## コード側の判定結果
タイプ: ${typeCode}（${typeData.name}）
建築家候補1: ${typeData.architects[0].name} - ${typeData.architects[0].trait}
建築家候補2: ${typeData.architects[1].name} - ${typeData.architects[1].trait}
コード側の仮選定: ${typeData.architects[selectedArchitectIndex].name}

上記の回答パターンを詳しく分析し、2名の建築家候補のうちよりフィットする1名を選定して、診断結果を生成してください。コード側の仮選定は参考値であり、回答パターンからあなた自身が判断してください。`;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
