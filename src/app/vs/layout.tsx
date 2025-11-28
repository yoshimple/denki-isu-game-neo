import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "対戦開始",
  description:
    "電気イスゲームの対戦が始まります。先攻・後攻を確認して心理戦に挑もう！",
  robots: {
    index: false, // ゲーム中の画面はインデックス不要
    follow: true,
  },
};

export default function VSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
