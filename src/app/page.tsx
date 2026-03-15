"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [step, setStep] = useState<"top" | "name">("top");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const handleStart = () => {
    setStep("name");
  };

  const handleSubmitName = () => {
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name.trim());
    router.push(`/diagnosis?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {step === "top" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <div className="text-6xl mb-4">🏛️</div>
            <h1 className="text-3xl font-black mb-3 text-text">
              建築家MBTI
            </h1>
            <p className="text-base text-text-light leading-relaxed">
              20の質問に答えて
              <br />
              あなたの中の
              <span className="text-primary font-bold">建築家</span>
              を見つけよう
            </p>
          </div>

          <p className="text-sm text-text-muted mb-8">
            16タイプ × 32人の日本人建築家から
            <br />
            あなたにピッタリの建築家がわかる
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="w-full max-w-xs mx-auto py-4 px-8 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors"
          >
            診断をはじめる
          </motion.button>

          <p className="mt-6 text-xs text-text-muted">所要時間：約3分</p>
          <p className="mt-4 text-xs text-text-muted opacity-60">
            Created by 武藤
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="text-4xl mb-4">✏️</div>
          <h2 className="text-2xl font-bold mb-2">あなたのお名前は？</h2>
          <p className="text-sm text-text-light mb-8">
            ニックネームでもOK（空欄でも始められます）
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitName()}
            placeholder="名前を入力..."
            className="w-full max-w-xs mx-auto block px-6 py-4 text-center text-lg border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors bg-white"
            autoFocus
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmitName}
            className="mt-6 w-full max-w-xs mx-auto py-4 px-8 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors"
          >
            診断スタート
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
