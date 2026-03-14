"use client";

import { motion } from "framer-motion";
import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onAnswer: (value: number) => void;
}

const scaleLabels = [
  { value: 1, label: "A", sublabel: "完全にA" },
  { value: 2, label: "", sublabel: "ややA" },
  { value: 3, label: "", sublabel: "中立" },
  { value: 4, label: "", sublabel: "ややB" },
  { value: 5, label: "B", sublabel: "完全にB" },
];

export default function QuestionCard({
  question,
  value,
  onAnswer,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Question header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary">
            Q{question.id}
          </span>
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-text-light">
            {question.category}
          </span>
        </div>
        <h2 className="text-xl font-bold text-text">{question.title}</h2>
      </div>

      {/* Options A and B */}
      <div className="space-y-4 mb-8">
        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            value !== undefined && value <= 2
              ? "border-primary bg-primary/5"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
              A
            </span>
            <p className="text-sm leading-relaxed text-text">
              {question.optionA}
            </p>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            value !== undefined && value >= 4
              ? "border-accent bg-accent/5"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm">
              B
            </span>
            <p className="text-sm leading-relaxed text-text">
              {question.optionB}
            </p>
          </div>
        </div>
      </div>

      {/* 5-scale buttons */}
      <div className="flex justify-center gap-3">
        {scaleLabels.map((scale) => (
          <button
            key={scale.value}
            onClick={() => onAnswer(scale.value)}
            className={`flex flex-col items-center gap-1 transition-all`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                value === scale.value
                  ? scale.value <= 2
                    ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                    : scale.value >= 4
                    ? "bg-accent text-white scale-110 shadow-lg shadow-accent/30"
                    : "bg-gray-600 text-white scale-110 shadow-lg"
                  : "bg-gray-100 text-text-light hover:bg-gray-200"
              }`}
            >
              {scale.value}
            </div>
            <span className="text-[10px] text-text-muted">
              {scale.sublabel}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
