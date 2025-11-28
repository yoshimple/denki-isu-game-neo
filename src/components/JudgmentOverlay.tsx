/**
 * 判定結果オーバーレイコンポーネント
 *
 * 感電/成功の演出を表示します。
 * カラールール:
 * - 感電: 黄色（電気イメージ）
 * - 成功: 白文字
 * - 背景: 黒
 */

"use client";

import type { JudgmentResult, PlayerState } from "@/core/gameTypes";

interface JudgmentOverlayProps {
  result: JudgmentResult;
  seater: PlayerState;
  electricChairId: number | null;
  onContinue: () => void;
}

export function JudgmentOverlay({
  result,
  seater,
  electricChairId,
  onContinue,
}: JudgmentOverlayProps) {
  const { success, chairNumber, scoreGained } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="text-center animate-bounce-in">
        {success ? (
          // 成功演出 - 白文字ベース
          <div className="space-y-4">
            <div className="text-8xl">🎉</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              セーフ！
            </h2>
            <p className="text-xl md:text-2xl text-gray-300">
              {seater.name}さん、イス#{chairNumber}で成功！
            </p>
            <p className="text-lg md:text-xl text-gray-500">
              （電気イスは #{electricChairId} でした）
            </p>
            <p className="text-3xl md:text-4xl font-bold text-yellow-400">
              +{scoreGained}点
            </p>
          </div>
        ) : (
          // 感電演出 - 黄色（電気イメージ）
          <div className="space-y-4">
            <div className="text-8xl animate-shake text-yellow-400">⚡</div>
            <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 animate-pulse">
              感電！
            </h2>
            <p className="text-xl md:text-2xl text-white">
              {seater.name}さん、イス#{chairNumber}で感電！
            </p>
            <p className="text-2xl md:text-3xl text-gray-400">
              得点リセット...
            </p>
          </div>
        )}

        {/* 続行ボタン - 黄色 */}
        <button
          type="button"
          onClick={onContinue}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold text-xl rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          次へ進む →
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
