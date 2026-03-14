"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { questions } from "@/data/questions";
import { calculateDiagnosis } from "@/lib/diagnosis";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

function DiagnosisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // All questions answered - calculate and navigate
          const result = calculateDiagnosis(newAnswers);
          const data = {
            ...result,
            answers: newAnswers,
            userName,
          };
          sessionStorage.setItem("diagnosisData", JSON.stringify(data));
          router.push("/result");
        }
      }, 350);
    },
    [answers, currentIndex, currentQuestion.id, router, userName]
  );

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="text-text-light disabled:opacity-30 p-2 -ml-2"
          >
            ← 戻る
          </button>
          <span className="text-sm text-text-muted">
            {userName && `${userName}さんの診断`}
          </span>
        </div>
        <ProgressBar
          current={answeredCount}
          total={questions.length}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-1.5 py-4 flex-wrap">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex
                ? "bg-primary scale-125"
                : answers[q.id] !== undefined
                ? "bg-primary/30"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-text-muted">読み込み中...</div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
