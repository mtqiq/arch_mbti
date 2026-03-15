"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { mbtiTypes, axisDefinitions } from "@/data/types";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { toPng } from "html-to-image";

interface AnalysisData {
  axisAnalyses: { axis: string; title: string; analysis: string }[];
  crossAxisInsight: string;
  selectedArchitect: string;
  selectionReason: string;
  architectInsight: string;
  growthHint: string;
  closingMessage: string;
}

const SITE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function ResultPage() {
  const router = useRouter();
  const [diagnosisData, setDiagnosisData] = useState<
    (DiagnosisResult & { answers: Record<number, number>; userName: string }) | null
  >(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fetchStarted = useRef(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisData");
    if (!stored) {
      router.push("/");
      return;
    }
    const data = JSON.parse(stored);
    setDiagnosisData(data);

    // Check for cached analysis result
    const cachedAnalysis = sessionStorage.getItem("analysisResult");
    if (cachedAnalysis) {
      try {
        setAnalysis(JSON.parse(cachedAnalysis));
        setLoading(false);
        return;
      } catch {
        // cache invalid, re-fetch
      }
    }

    if (fetchStarted.current) return;
    fetchStarted.current = true;

    // Call Claude API
    const fetchAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("分析の取得に失敗しました");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("ストリームを開けませんでした");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                fullText += parsed.text;
                setStreamText(fullText);
              } catch {
                // skip invalid JSON
              }
            }
          }
        }

        // Parse the complete JSON response
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setAnalysis(parsed);
          sessionStorage.setItem("analysisResult", JSON.stringify(parsed));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [router]);

  // Auto-save participant data for compatibility feature
  useEffect(() => {
    if (!diagnosisData || !analysis) return;
    // Already saved this session
    if (sessionStorage.getItem("participantId")) return;

    const typeData = mbtiTypes[diagnosisData.typeCode];
    const selectedName =
      analysis.selectedArchitect ||
      typeData.architects[diagnosisData.selectedArchitectIndex].name;

    fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: diagnosisData.userName || "ゲスト",
        typeCode: diagnosisData.typeCode,
        architectName: selectedName,
        axisScores: diagnosisData.axisScores,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          sessionStorage.setItem("participantId", data.id);
        }
      })
      .catch(() => {});
  }, [diagnosisData, analysis]);

  const handleSaveImage = useCallback(async () => {
    if (!resultCardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(resultCardRef.current, {
        backgroundColor: "#F8F9FE",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "建築家MBTI結果.png";
      link.href = dataUrl;
      link.click();
    } catch {
      alert("画像の保存に失敗しました。スクリーンショットをお試しください。");
    } finally {
      setSaving(false);
    }
  }, []);

  if (!diagnosisData) return null;

  const typeData = mbtiTypes[diagnosisData.typeCode];

  // Loading state
  if (loading && !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-6">🔍</div>
          <h2 className="text-xl font-bold mb-3">分析中...</h2>
          <p className="text-sm text-text-light mb-6">
            あなたの回答を建築家と照らし合わせています
          </p>

          {/* Animated dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Show streaming text preview */}
          {streamText && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="text-xs text-text-muted text-left bg-white rounded-xl p-4 max-h-32 overflow-hidden">
                {streamText.slice(0, 200)}...
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p className="text-sm text-text-light mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    );
  }

  const selectedArchitectName = analysis?.selectedArchitect;
  const selectedArchitectData = typeData.architects.find(
    (a) => a.name === selectedArchitectName
  ) || typeData.architects[diagnosisData.selectedArchitectIndex];

  return (
    <div className="min-h-screen pb-20">
      {/* ===== Saveable result card area ===== */}
      <div ref={resultCardRef}>
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-primary to-primary-dark text-white px-4 pt-12 pb-16 text-center"
        >
          <p className="text-sm opacity-80 mb-2">
            {diagnosisData.userName
              ? `${diagnosisData.userName}さんは...`
              : "あなたは..."}
          </p>
          <div className="text-xs opacity-60 mb-4 tracking-widest">
            {diagnosisData.typeCode}
          </div>
          <h1 className="text-3xl font-black mb-2">{typeData.name}</h1>
          <p className="text-xs opacity-60 mb-4">{typeData.reading}</p>
          <p className="text-base opacity-90 italic">
            「{typeData.catchcopy}」
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto px-4 -mt-8 space-y-6">
          {/* Architect card with illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🏗️</div>
              <p className="text-xs text-text-muted mb-1">
                あなたに最も近い建築家
              </p>
              <h2 className="text-2xl font-black text-text">
                {selectedArchitectData.name}
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {selectedArchitectData.works.map((work) => (
                <span
                  key={work}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {work}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-light text-center leading-relaxed">
              {selectedArchitectData.trait}
            </p>
          </motion.div>

          {/* Axis scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold mb-4 text-center">
              4軸のスコア
            </h3>
            <div className="space-y-5">
              {diagnosisData.axisScores.map((score) => {
                const def =
                  axisDefinitions[
                    score.axis as keyof typeof axisDefinitions
                  ];
                const percentage = ((score.average - 1) / 4) * 100;
                // 左寄り(0%)→青(primary), 右寄り(100%)→赤(accent), 中間→紫混色
                const leanLeft = percentage < 50;
                const intensity = Math.abs(percentage - 50) / 50; // 0〜1
                const barColor = leanLeft
                  ? `color-mix(in srgb, var(--color-primary) ${50 + intensity * 50}%, var(--color-primary-light))`
                  : `color-mix(in srgb, var(--color-accent) ${50 + intensity * 50}%, var(--color-accent-light))`;
                const dotBorderColor = leanLeft ? "var(--color-primary)" : "var(--color-accent)";
                return (
                  <div key={score.axis}>
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className={`font-bold ${
                          score.letter === def.left.letter
                            ? "text-primary"
                            : "text-text-muted"
                        }`}
                      >
                        {def.left.letter} {def.left.label}
                      </span>
                      <span
                        className={`font-bold ${
                          score.letter === def.right.letter
                            ? "text-accent"
                            : "text-text-muted"
                        }`}
                      >
                        {def.right.label} {def.right.letter}
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ background: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow"
                        style={{ borderWidth: 2, borderStyle: "solid", borderColor: dotBorderColor }}
                        initial={{ left: 0 }}
                        animate={{ left: `calc(${percentage}% - 8px)` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    {analysis?.axisAnalyses && (
                      <p className="text-xs text-text-light mt-2 leading-relaxed">
                        {analysis.axisAnalyses.find(
                          (a) => a.axis === score.axis
                        )?.analysis || ""}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Cross-axis insight */}
          {analysis?.crossAxisInsight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold mb-3">
                4軸の交差点 ― あなたの建築的人格
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {analysis.crossAxisInsight}
              </p>
            </motion.div>
          )}

          {/* Selection reason */}
          {analysis?.selectionReason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold mb-3">
                なぜ{selectedArchitectData.name}なのか
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {analysis.selectionReason}
              </p>
            </motion.div>
          )}

          {/* Architectural insight */}
          {analysis?.architectInsight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold mb-3">建築的考察</h3>
              <p className="text-sm text-text-light leading-relaxed">
                {analysis.architectInsight}
              </p>
            </motion.div>
          )}

          {/* Growth hint */}
          {analysis?.growthHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold mb-3">
                あなたの伸びしろ
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {analysis.growthHint}
              </p>
            </motion.div>
          )}

          {/* Closing message */}
          {analysis?.closingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-6 text-center"
            >
              <p className="text-base font-medium text-text leading-relaxed italic">
                「{analysis.closingMessage}」
              </p>
            </motion.div>
          )}

          {/* Credit */}
          <div className="text-center py-2">
            <p className="text-xs text-text-muted">
              建築家MBTI / Created by 武藤
            </p>
          </div>
        </div>
      </div>
      {/* ===== End saveable area ===== */}

      {/* Share & Actions */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => {
              const text = `建築家MBTI診断の結果：${typeData.name}（${diagnosisData.typeCode}）\nあなたに近い建築家は「${selectedArchitectData.name}」でした！\n\nあなたも診断してみよう\n${SITE_URL}\n\n#建築家MBTI`;
              if (navigator.share) {
                navigator.share({ text, url: SITE_URL });
              } else {
                navigator.clipboard.writeText(text);
                alert("シェア用テキストをコピーしました！");
              }
            }}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25"
          >
            結果をシェアする
          </button>
          <button
            onClick={() => router.push("/compatibility")}
            className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/25"
          >
            友達との相性をチェック
          </button>
          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="w-full py-4 bg-white text-primary font-bold rounded-2xl border-2 border-primary disabled:opacity-50"
          >
            {saving ? "保存中..." : "結果を画像で保存する"}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("diagnosisData");
              sessionStorage.removeItem("analysisResult");
              sessionStorage.removeItem("participantId");
              router.push("/");
            }}
            className="w-full py-4 bg-white text-text-light font-medium rounded-2xl border-2 border-gray-200"
          >
            もう一度診断する
          </button>
        </motion.div>
      </div>
    </div>
  );
}
