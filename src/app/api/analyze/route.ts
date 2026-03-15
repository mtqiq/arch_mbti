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

## 分析の深さに関する指針
- 回答パターンを丁寧に読み解き、表面的な結果だけでなく**回答の揺れや矛盾**にも注目してください。
- 例えば「性格の質問ではI寄りなのに設計の質問ではE寄り」といったギャップがあれば、それを**建築的に解釈**してください（「普段は内向的だが、設計の現場では対話を求める。安藤忠雄が独学でありながらクライアントと激しく議論するのに通じる」など）。
- 各軸の分析では、具体的な**回答内容に言及**して「あなたはQ3で〜と答えている一方、Q21では〜と答えており…」のように、回答者自身が「ちゃんと読んでくれている」と感じるパーソナルな分析をしてください。
- 建築家の選定理由では、その建築家の**具体的な作品やエピソード**と回答パターンの共通点を挙げてください。
- 4軸の相互作用にも触れてください（例：「NとFの組み合わせは、概念を感性で空間に落とし込む力を示しており…」）。

## あなたの出力ルール
以下のJSON形式で出力してください。JSON以外のテキストは一切出力しないでください。

{
  "axisAnalyses": [
    {
      "axis": "EI",
      "title": "社交建築 vs 瞑想建築",
      "analysis": "（この軸に関する3-5文の深い分析。具体的な回答に言及し、回答間の一貫性・矛盾・揺れも読み解く。建築家や建築作品の具体例を交えて解説する）"
    },
    { "axis": "SN", "title": "...", "analysis": "..." },
    { "axis": "TF", "title": "...", "analysis": "..." },
    { "axis": "JP", "title": "...", "analysis": "..." }
  ],
  "crossAxisInsight": "（4軸の組み合わせから浮かび上がる、この人の建築的人格の本質。2つ以上の軸の相互作用に言及し、単一軸では見えない深層を語る。3-4文）",
  "selectedArchitect": "（2名の候補から1名を選定した建築家名）",
  "selectionReason": "（なぜこの建築家がフィットするのか。回答パターンと建築家の具体的な作品・設計哲学・エピソードを結びつけた4-5文の深い説明）",
  "architectInsight": "（選定した建築家の代表作を1つ取り上げ、その作品の設計思想とこの人の回答傾向の共鳴を語る。さらに、この建築家から学べること、逆にこの人が持っていてこの建築家にはない資質にも触れる。3-4文）",
  "growthHint": "（この人の回答パターンから見える「伸びしろ」や「意外な可能性」。弱い軸や揺れている軸を建築的に前向きに解釈し、具体的なアクション提案も1つ含める。2-3文）",
  "closingMessage": "（ユーモアと知性を感じる締めの一言。建築用語や建築家の名言・エピソードを絡める）"
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
    max_tokens: 4000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
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
      } catch (err) {
        console.error("Analyze Claude stream error:", err);
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
