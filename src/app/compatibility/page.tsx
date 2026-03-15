"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mbtiTypes } from "@/data/types";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { getScoreLabel } from "@/lib/compatibility";
import type { ParticipantScores } from "@/lib/compatibility";

interface Participant {
  id: string;
  name: string;
  type_code: string;
  architect_name: string;
  axis_scores: ParticipantScores[];
  created_at: string;
}

interface ScoreData {
  score: number;
  scoreLabel: { label: string; color: string; description: string };
  pairDetails: { nameA: string; nameB: string; score: number }[];
}

interface AnalysisData {
  headline: string;
  analysis: string;
  advice: string;
}

type Step = "select" | "result";

export default function CompatibilityPage() {
  const router = useRouter();
  const [selfData, setSelfData] = useState<
    (DiagnosisResult & { userName: string }) | null
  >(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<Step>("select");
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchStarted = useRef(false);

  // Load self data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisData");
    if (!stored) {
      router.push("/");
      return;
    }
    setSelfData(JSON.parse(stored));
  }, [router]);

  // Load participants list
  useEffect(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;

    fetch("/api/participants")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => null);
          throw new Error(body?.error || `参加者の取得に失敗しました（${r.status}）`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setParticipants(data);
        } else {
          throw new Error("参加者データの形式が不正です");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch participants:", err);
        fetchStarted.current = false;
        setError(err instanceof Error ? err.message : "参加者の取得に失敗しました");
      })
      .finally(() => setLoadingParticipants(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  };

  const handleCheck = async () => {
    if (!selfData || selected.size === 0) return;
    setLoading(true);
    setScoreData(null);
    setAnalysis(null);
    setError(null);
    setStep("result");

    const selfParticipant = {
      name: selfData.userName || "あなた",
      typeCode: selfData.typeCode,
      architectName:
        mbtiTypes[selfData.typeCode].architects[
          selfData.selectedArchitectIndex
        ].name,
      axisScores: selfData.axisScores,
    };

    const others = Array.from(selected).map((id) => {
      const p = participants.find((pp) => pp.id === id)!;
      return {
        name: p.name,
        typeCode: p.type_code,
        architectName: p.architect_name,
        axisScores: p.axis_scores,
      };
    });

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ self: selfParticipant, others }),
      });

      if (!response.ok) throw new Error("エラーが発生しました");

      const reader = response.body?.getReader();
      if (!reader) throw new Error();

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6);
            if (raw === "[DONE]") continue;
            try {
              const parsed = JSON.parse(raw);
              if (parsed.type === "scores") {
                setScoreData({
                  score: parsed.score,
                  scoreLabel: parsed.scoreLabel,
                  pairDetails: parsed.pairDetails,
                });
              } else if (parsed.type === "text") {
                fullText += parsed.text;
              }
            } catch {
              // skip
            }
          }
        }
      }

      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setAnalysis(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!selfData) return null;

  const selfType = mbtiTypes[selfData.typeCode];

  // Filter out self by saved participant ID
  const selfParticipantId = typeof window !== "undefined"
    ? sessionStorage.getItem("participantId")
    : null;
  const selfArchitectName =
    selfType.architects[selfData.selectedArchitectIndex].name;
  const otherParticipants = participants.filter(
    (p) => p.id !== selfParticipantId
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white px-4 pt-10 pb-8 text-center">
        <h1 className="text-2xl font-black mb-1">相性チェック</h1>
        <p className="text-sm opacity-80">
          {selfData.userName || "あなた"}（{selfData.typeCode} /{" "}
          {selfArchitectName}）
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {step === "select" ? (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Instructions */}
              <div className="text-center mb-6">
                <p className="text-sm text-text-light">
                  相性を見たい人を選んでください（最大3人）
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {selected.size}人選択中
                  {selected.size >= 2 && " - チーム相性も表示されます"}
                </p>
              </div>

              {/* Participant list */}
              {loadingParticipants ? (
                <div className="text-center py-12">
                  <div className="flex justify-center gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted">
                    参加者を読み込んでいます...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-sm text-red-500 mb-2">
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoadingParticipants(true);
                      fetch("/api/participants")
                        .then((r) => {
                          if (!r.ok) throw new Error("参加者の取得に失敗しました");
                          return r.json();
                        })
                        .then((data) => {
                          if (Array.isArray(data)) {
                            setParticipants(data);
                          }
                        })
                        .catch((err) => {
                          setError(err instanceof Error ? err.message : "参加者の取得に失敗しました");
                        })
                        .finally(() => setLoadingParticipants(false));
                    }}
                    className="text-sm text-primary underline mt-2"
                  >
                    再試行する
                  </button>
                </div>
              ) : otherParticipants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🏚️</div>
                  <p className="text-sm text-text-light mb-2">
                    まだ他の参加者がいません
                  </p>
                  <p className="text-xs text-text-muted">
                    友達にシェアして一緒に診断してもらおう！
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {otherParticipants.map((p) => {
                    const isSelected = selected.has(p.id);
                    const typeData = mbtiTypes[p.type_code];
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => toggleSelect(p.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-text truncate">
                                {p.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-text-muted shrink-0">
                                {p.type_code}
                              </span>
                            </div>
                            <p className="text-xs text-text-light truncate">
                              {typeData?.name || p.type_code} /{" "}
                              {p.architect_name}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheck}
                  disabled={selected.size === 0}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 disabled:opacity-40 disabled:shadow-none"
                >
                  相性を診断する
                  {selected.size > 0 && `（${selected.size}人）`}
                </motion.button>
                <button
                  onClick={() => router.back()}
                  className="w-full py-3 text-text-muted text-sm"
                >
                  戻る
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Score display */}
              {scoreData ? (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="text-center mb-6"
                  >
                    <div className="relative inline-block">
                      <svg
                        width="180"
                        height="180"
                        viewBox="0 0 180 180"
                        className="mx-auto"
                      >
                        {/* Background circle */}
                        <circle
                          cx="90"
                          cy="90"
                          r="80"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="12"
                        />
                        {/* Score arc */}
                        <circle
                          cx="90"
                          cy="90"
                          r="80"
                          fill="none"
                          stroke={scoreData.scoreLabel.color}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(scoreData.score / 100) * 502.6} 502.6`}
                          strokeDashoffset="0"
                          transform="rotate(-90 90 90)"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-5xl font-black"
                          style={{ color: scoreData.scoreLabel.color }}
                        >
                          {scoreData.score}
                        </motion.span>
                        <span className="text-xs text-text-muted">/ 100</span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p
                        className="text-xl font-black mt-2"
                        style={{ color: scoreData.scoreLabel.color }}
                      >
                        {scoreData.scoreLabel.label}
                      </p>
                      <p className="text-sm text-text-light mt-1">
                        {scoreData.scoreLabel.description}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Pair scores (for team) */}
                  {scoreData.pairDetails.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-2xl shadow-lg p-5 mb-4"
                    >
                      <h3 className="text-sm font-bold mb-3">
                        ペアごとの相性
                      </h3>
                      <div className="space-y-3">
                        {scoreData.pairDetails.map((pair, i) => {
                          const label = getScoreLabel(pair.score);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-light truncate">
                                  {pair.nameA} × {pair.nameB}
                                </p>
                                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                                  <motion.div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{ backgroundColor: label.color }}
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${pair.score}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: 0.8 + i * 0.15,
                                    }}
                                  />
                                </div>
                              </div>
                              <span
                                className="text-lg font-black w-12 text-right shrink-0"
                                style={{ color: label.color }}
                              >
                                {pair.score}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Claude Analysis */}
                  {analysis ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white rounded-2xl shadow-lg p-5 mb-4"
                    >
                      <h3 className="text-lg font-black mb-2">
                        {analysis.headline}
                      </h3>
                      <p className="text-sm text-text-light leading-relaxed mb-4">
                        {analysis.analysis}
                      </p>
                      <div className="bg-primary/5 rounded-xl p-4">
                        <p className="text-xs font-bold text-primary mb-1">
                          プロジェクトのアドバイス
                        </p>
                        <p className="text-sm text-text leading-relaxed">
                          {analysis.advice}
                        </p>
                      </div>
                    </motion.div>
                  ) : loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-text-muted">
                          AIが相性を分析中...
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Error state */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent/10 rounded-2xl p-4 mb-4 text-center"
                    >
                      <p className="text-sm text-accent font-medium">
                        {error}
                      </p>
                      <button
                        onClick={handleCheck}
                        className="mt-2 text-xs text-accent underline"
                      >
                        再試行する
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-primary"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted">相性を計算中...</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setStep("select");
                    setSelected(new Set());
                    setScoreData(null);
                    setAnalysis(null);
                  }}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25"
                >
                  別の人とチェックする
                </button>
                <button
                  onClick={() => router.push("/result")}
                  className="w-full py-3 text-text-muted text-sm"
                >
                  結果に戻る
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
