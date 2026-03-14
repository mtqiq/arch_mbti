import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "建築家MBTI - あなたの中の建築家を見つけよう",
  description:
    "20問の診断であなたに似た日本人建築家がわかる。建築的感性でMBTIを再解釈した新しい性格診断。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
