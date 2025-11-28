"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

/**
 * VS画面のメインコンテンツ
 * カラールール:
 * - 先攻: 青
 * - 後攻: 赤
 * - 電気・VS: 黄色
 */
function VSContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const player1Name = searchParams.get("p1") || "プレイヤー1";
  const player2Name = searchParams.get("p2") || "プレイヤー2";
  const firstPlayer = searchParams.get("first") || "p1";
  const [countdown, setCountdown] = useState(3);
  const [showVS, setShowVS] = useState(false);

  // 先攻・後攻の順でプレイヤーを並べる
  const frontPlayerName = firstPlayer === "p1" ? player1Name : player2Name;
  const backPlayerName = firstPlayer === "p1" ? player2Name : player1Name;

  useEffect(() => {
    // VSロゴを表示
    const vsTimer = setTimeout(() => {
      setShowVS(true);
    }, 500);

    // カウントダウン
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // ゲーム画面へ遷移
    const navigateTimer = setTimeout(() => {
      const params = new URLSearchParams({
        p1: player1Name,
        p2: player2Name,
        first: firstPlayer,
      });
      router.push(`/game?${params.toString()}`);
    }, 4000);

    return () => {
      clearTimeout(vsTimer);
      clearInterval(countdownInterval);
      clearTimeout(navigateTimer);
    };
  }, [router, player1Name, player2Name, firstPlayer]);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="flex items-center justify-between">
          {/* 先攻プレイヤー - 青 */}
          <div className="flex-1 flex flex-col items-center animate-slide-in-left">
            <p className="text-sm text-gray-400 mb-1">先攻</p>
            <h2 className="text-3xl md:text-5xl font-bold text-center max-w-[200px] truncate text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
              {frontPlayerName}
            </h2>
          </div>

          {/* VS - 黄色 */}
          <div
            className={`flex-shrink-0 mx-4 transition-all duration-500 ${showVS ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <div className="relative">
              {/* 雷エフェクト - VS周辺のみ */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <div className="lightning-effect" />
                <div className="lightning-bolt lightning-bolt-1" />
                <div className="lightning-bolt lightning-bolt-2" />
                <div className="lightning-bolt lightning-bolt-3" />
                <div className="lightning-bolt lightning-bolt-4" />
                <div className="lightning-flash" />
              </div>
              <span className="text-6xl md:text-8xl font-black text-yellow-400 animate-pulse drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] relative z-10">
                VS
              </span>
              {/* 稲妻エフェクト - 黄色 */}
              <div className="absolute -top-4 -left-4 text-4xl animate-bounce text-yellow-400 z-10">
                ⚡
              </div>
              <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce delay-100 text-yellow-400 z-10">
                ⚡
              </div>
            </div>
          </div>

          {/* 後攻プレイヤー - 赤 */}
          <div className="flex-1 flex flex-col items-center animate-slide-in-right">
            <p className="text-sm text-gray-400 mb-1">後攻</p>
            <h2 className="text-3xl md:text-5xl font-bold text-center max-w-[200px] truncate text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              {backPlayerName}
            </h2>
          </div>
        </div>

        {/* カウントダウン */}
        {countdown > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-lg mb-2">対戦開始まで</p>
            <span className="text-6xl md:text-8xl font-bold text-white animate-ping-slow">
              {countdown}
            </span>
          </div>
        )}
        {countdown === 0 && (
          <div className="mt-12 text-center">
            <span className="text-4xl md:text-6xl font-bold text-yellow-400 animate-pulse">
              START!
            </span>
          </div>
        )}
      </div>

      {/* CSSアニメーション */}
      <style jsx>{`
        .lightning-effect {
          position: absolute;
          top: -50px;
          left: -80px;
          right: -80px;
          bottom: -50px;
          background: radial-gradient(ellipse at center, rgba(250, 204, 21, 0.4) 0%, transparent 60%);
          animation: lightning-pulse 0.8s ease-in-out infinite;
        }

        .lightning-bolt {
          position: absolute;
          width: 6px;
          background: linear-gradient(to bottom, transparent, rgba(250, 204, 21, 1), rgba(255, 255, 255, 0.9), rgba(250, 204, 21, 1), transparent);
          animation: lightning-strike 0.15s ease-out infinite;
          filter: blur(1px);
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.8), 0 0 30px rgba(250, 204, 21, 0.5);
        }

        .lightning-bolt-1 {
          left: -60px;
          top: -40px;
          height: 120px;
          animation-delay: 0.2s;
          transform: rotate(-15deg);
        }

        .lightning-bolt-2 {
          right: -60px;
          top: -40px;
          height: 120px;
          animation-delay: 0.5s;
          transform: rotate(15deg);
        }

        .lightning-bolt-3 {
          left: -30px;
          bottom: -30px;
          height: 100px;
          animation-delay: 0.8s;
          transform: rotate(20deg);
        }

        .lightning-bolt-4 {
          right: -30px;
          bottom: -30px;
          height: 100px;
          animation-delay: 0.3s;
          transform: rotate(-20deg);
        }

        .lightning-flash {
          position: absolute;
          top: -30px;
          left: -50px;
          right: -50px;
          bottom: -30px;
          border-radius: 50%;
          background: rgba(250, 204, 21, 0.4);
          animation: flash 0.3s ease-out infinite;
        }

        @keyframes lightning-pulse {
          0%, 100% { opacity: 0.4; }
          25% { opacity: 1; }
          50% { opacity: 0.6; }
          75% { opacity: 0.9; }
        }

        @keyframes lightning-strike {
          0% { opacity: 0; transform: scaleY(0) translateX(0); }
          5% { opacity: 1; transform: scaleY(1) translateX(-2px); }
          10% { opacity: 1; transform: scaleY(1) translateX(2px); }
          15% { opacity: 0.8; transform: scaleY(1) translateX(-1px); }
          20% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes flash {
          0%, 90%, 100% { opacity: 0; }
          5% { opacity: 0.4; }
          10% { opacity: 0; }
          15% { opacity: 0.2; }
          20% { opacity: 0; }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }

        .animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/**
 * VS画面（対戦カード画面）
 *
 * プレイヤー同士のVS演出を表示し、数秒後にゲーム画面へ遷移します。
 */
export default function VSPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-yellow-400 text-2xl animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <VSContent />
    </Suspense>
  );
}
