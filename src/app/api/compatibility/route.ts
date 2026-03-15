import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { mbtiTypes } from "@/data/types";
import {
  calculatePairScore,
  calculateTeamScore,
  getScoreLabel,
} from "@/lib/compatibility";
import type { ParticipantScores } from "@/lib/compatibility";

const anthropic = new Anthropic();

interface ParticipantInput {
  name: string;
  typeCode: string;
  architectName: string;
  axisScores: ParticipantScores[];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { self, others } = body as {
    self: ParticipantInput;
    others: ParticipantInput[];
  };

  if (!self || !others || others.length < 1 || others.length > 3) {
    return Response.json(
      { error: "1〜3人の相手を選択してください" },
      { status: 400 }
    );
  }

  const allParticipants = [self, ...others];
  const allScores = allParticipants.map((p) => p.axisScores);

  // スコア算出
  let score: number;
  let pairDetails: { nameA: string; nameB: string; score: number }[] = [];

  if (allParticipants.length === 2) {
    score = calculatePairScore(allScores[0], allScores[1]);
    pairDetails = [
      { nameA: self.name, nameB: others[0].name, score },
    ];
  } else {
    const teamResult = calculateTeamScore(allScores);
    score = teamResult.teamScore;
    pairDetails = teamResult.pairs.map((p) => ({
      nameA: allParticipants[p.indexA].name,
      nameB: allParticipants[p.indexB].name,
      score: p.score,
    }));
  }

  const scoreLabel = getScoreLabel(score);

  // Claude解説生成
  const participantsDesc = allParticipants
    .map((p) => {
      const typeData = mbtiTypes[p.typeCode];
      const architect = typeData?.architects.find(
        (a) => a.name === p.architectName
      );
      return `${p.name}: ${p.typeCode}（${typeData?.name || "不明"}）→ ${p.architectName}${architect ? `（${architect.works.join("、")}）` : ""}`;
    })
    .join("\n");

  const pairScoresDesc = pairDetails
    .map((p) => `${p.nameA} × ${p.nameB}: ${p.score}点`)
    .join("\n");

  const isTeam = allParticipants.length > 2;

  const systemPrompt = `あなたは「建築家MBTI」の相性診断を解説するAIです。
建築家や建築作品の知識を活かし、ユーモアと洞察を交えて相性を語ってください。

## ルール
- JSON形式で出力。JSON以外は出力しないこと。
- 相性スコアはアルゴリズムで算出済み。あなたはスコアを変えず、解説のみ担当。
- スコアが低い場合は無理にポジティブにせず、建築的な比喩で率直にコメントすること。
- 実在の建築家の関係性やエピソードを交えると面白い。

## 出力JSON
{
  "headline": "（10文字以内のキャッチーな見出し）",
  "analysis": "（3-4文の相性解説。建築的比喩を交えて。${isTeam ? "チーム全体の相性について語る。" : ""}）",
  "advice": "（${isTeam ? "このチームが" : "この2人が"}プロジェクトを一緒にやるとしたら？1-2文のアドバイス）"
}`;

  const userPrompt = `## メンバー
${participantsDesc}

## 相性スコア
${isTeam ? `チームスコア: ${score}点（${scoreLabel.label}）` : `相性スコア: ${score}点（${scoreLabel.label}）`}
${pairScoresDesc}

この相性を建築家MBTI的に解説してください。`;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // まずスコアデータを送信
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "scores",
            score,
            scoreLabel,
            pairDetails,
          })}\n\n`
        )
      );

      // Claude解説をストリーム
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`
            )
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
