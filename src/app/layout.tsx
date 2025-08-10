import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cool Career 診断 - あなたの理想のキャリアを見つける",
  description: "MBTI × Career DNA = 80タイプ診断システムで、あなたの価値観と性格から理想のキャリアを見つけ出す",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}