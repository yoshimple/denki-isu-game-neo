import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プレイ中",
  description:
    "電気イスゲームをプレイ中。12脚のイスから安全なイスを選んで座ろう！感電せずに40点先取で勝利！",
  robots: {
    index: false, // ゲーム中の画面はインデックス不要
    follow: true,
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
