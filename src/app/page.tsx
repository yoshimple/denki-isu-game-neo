"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FirstPlayer = "player1" | "player2" | "random";

// 構造化データ（JSON-LD）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "電気イスゲーム",
  description:
    "1台の端末で2人対戦！12脚のイスに電流を仕掛け合う心理戦ゲーム。40点先取で勝利、3回感電したら負け！",
  genre: ["パーティーゲーム", "心理戦", "対戦ゲーム"],
  gamePlatform: "Web Browser",
  applicationCategory: "Game",
  operatingSystem: "Any",
  numberOfPlayers: {
    "@type": "QuantitativeValue",
    minValue: 2,
    maxValue: 2,
  },
  author: {
    "@type": "Person",
    name: "yoshimple",
    url: "https://note.com/yoshimple",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    availability: "https://schema.org/InStock",
  },
  inLanguage: "ja",
  url: "https://denki-isu-game-neo.vercel.app",
};

export default function StartPage() {
  const router = useRouter();
  const [player1Name, setPlayer1Name] = useState("岡野");
  const [player2Name, setPlayer2Name] = useState("山添");
  const [firstPlayer, setFirstPlayer] = useState<FirstPlayer>("random");
  const [error, setError] = useState("");

  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      setError("両方のプレイヤー名を入力してください");
      return;
    }

    let first: "player1" | "player2";
    if (firstPlayer === "random") {
      first = Math.random() < 0.5 ? "player1" : "player2";
    } else {
      first = firstPlayer;
    }

    const params = new URLSearchParams({
      p1: player1Name.trim(),
      p2: player2Name.trim(),
      first: first === "player1" ? "p1" : "p2",
    });

    router.push(`/vs?${params.toString()}`);
  };

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: 構造化データはサニタイズ済み
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative z-10 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 whitespace-nowrap flex items-center justify-center gap-2">
              <span className="text-yellow-400">⚡</span>
              <span className="text-white">電気イスゲーム</span>
              <span className="text-yellow-400">⚡</span>
            </h1>
            <p className="text-gray-400 text-sm">
              12脚のイスに電流を仕掛け合う心理戦
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
            <div className="space-y-4">
              {/* プレイヤー1入力 */}
              <div>
                <label
                  htmlFor="player1-name"
                  className="block text-white text-sm font-medium mb-2"
                >
                  🎮 プレイヤー1の名前
                </label>
                <input
                  id="player1-name"
                  type="text"
                  value={player1Name}
                  onChange={(e) => {
                    setPlayer1Name(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="名前を入力..."
                  maxLength={10}
                />
              </div>

              {/* プレイヤー2入力 */}
              <div>
                <label
                  htmlFor="player2-name"
                  className="block text-white text-sm font-medium mb-2"
                >
                  🎮 プレイヤー2の名前
                </label>
                <input
                  id="player2-name"
                  type="text"
                  value={player2Name}
                  onChange={(e) => {
                    setPlayer2Name(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="名前を入力..."
                  maxLength={10}
                />
              </div>

              {/* 先攻選択 */}
              <div>
                <span className="block text-white text-sm font-medium mb-2">
                  🎯 先攻（着席側）を選択
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFirstPlayer("random")}
                    className={
                      "flex-1 py-2 px-3 rounded-lg font-medium transition-all " +
                      (firstPlayer === "random"
                        ? "bg-yellow-400/60 text-gray-900"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700")
                    }
                  >
                    🎲 ランダム
                  </button>
                  <button
                    type="button"
                    onClick={() => setFirstPlayer("player1")}
                    className={
                      "flex-1 py-2 px-3 rounded-lg font-medium transition-all " +
                      (firstPlayer === "player1"
                        ? "bg-yellow-400/60 text-gray-900"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700")
                    }
                  >
                    プレイヤー1
                  </button>
                  <button
                    type="button"
                    onClick={() => setFirstPlayer("player2")}
                    className={
                      "flex-1 py-2 px-3 rounded-lg font-medium transition-all " +
                      (firstPlayer === "player2"
                        ? "bg-yellow-400/60 text-gray-900"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700")
                    }
                  >
                    プレイヤー2
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* スタートボタン - 黄色（感電・ゲーム関連） */}
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-200 transform hover:scale-105 mt-4 animate-pulse"
              >
                ⚡ ゲームスタート ⚡
              </button>
            </div>
          </div>

          {/* ルール - 黄色タイトル、白文字 */}
          <div className="mt-6 bg-gray-900/60 rounded-xl p-3 text-xs text-gray-300 border border-gray-800">
            <h3 className="font-bold text-yellow-400 mb-1">📖 ルール</h3>
            <ul className="list-disc list-inside space-y-0.5">
              <li>12脚のイスから1つを選んで座ります</li>
              <li>相手が電気イスを仕掛けています</li>
              <li>感電せずに座れたらイス番号分のポイント獲得</li>
              <li>40点先取で勝利！ / 3回感電したら負け</li>
            </ul>
          </div>

          {/* 作者リンク */}
          <div className="mt-4 text-center">
            <a
              href="https://note.com/yoshimple"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-600/70 hover:text-yellow-400 text-xs transition-colors"
            >
              Created by @yoshimple
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
