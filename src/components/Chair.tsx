/**
 * イスコンポーネント
 *
 * ステージ上に配置される個々のイスを表示します。
 * カラールール:
 * - 通常のイス: 白
 * - 先攻が選択中/座ったイス: 青
 * - 後攻が選択中/座ったイス: 赤
 * - 電気イス（選択中/確定）: 黄色
 */

"use client";

import type { ChairState } from "@/core/gameTypes";

interface ChairProps {
  chair: ChairState;
  isSeated: boolean;
  isElectric: boolean;
  isSelectedElectric?: boolean; // 選択中の電気イス（確定前）
  isSelectedSeat?: boolean; // 選択中の座席（確定前）
  showElectric: boolean; // スイッチ側にのみ電気イスを表示
  onClick?: () => void;
  disabled?: boolean;
  isShocked?: boolean;
}

export function Chair({
  chair,
  isSeated,
  isElectric,
  isSelectedElectric,
  isSelectedSeat,
  showElectric,
  onClick,
  disabled,
  isShocked,
}: ChairProps) {
  if (!chair.isAvailable) {
    return (
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-900/50 border-2 border-gray-800 flex items-center justify-center"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)" }}
      >
        <span className="text-gray-700 text-lg line-through">{chair.id}</span>
      </div>
    );
  }

  // スタイル判定
  const getChairStyle = () => {
    // 座っている場合: 黄色で統一
    if (isSeated) {
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900";
    }
    // 選択中の座席: 黄色で統一
    if (isSelectedSeat) {
      return "bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900 ring-4 ring-yellow-400 scale-105";
    }
    // 確定済み電気イス: 黄色（スイッチ側のみ表示）
    if (isElectric && showElectric) {
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900";
    }
    // 選択中の電気イス: 黄色（背景色も変更）
    if (isSelectedElectric && showElectric) {
      return "bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900 ring-4 ring-yellow-400 scale-105";
    }
    // 通常: 白ベース
    return "bg-white text-gray-900 hover:bg-gray-100 hover:ring-2 hover:ring-yellow-400/50";
  };

  // 影のスタイル
  const getShadowStyle = () => {
    if (isSeated) {
      return {
        boxShadow:
          "0 8px 16px rgba(250, 204, 21, 0.4), 0 4px 8px rgba(0, 0, 0, 0.6)",
      };
    }
    // 選択中の座席にも影を追加
    if (isSelectedSeat) {
      return {
        boxShadow:
          "0 8px 16px rgba(250, 204, 21, 0.3), 0 4px 8px rgba(0, 0, 0, 0.6)",
      };
    }
    if (isElectric && showElectric) {
      return {
        boxShadow:
          "0 8px 16px rgba(250, 204, 21, 0.4), 0 4px 8px rgba(0, 0, 0, 0.6)",
      };
    }
    // 選択中の電気イスにも影を追加
    if (isSelectedElectric && showElectric) {
      return {
        boxShadow:
          "0 8px 16px rgba(250, 204, 21, 0.3), 0 4px 8px rgba(0, 0, 0, 0.6)",
      };
    }
    return { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)" };
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-12 h-12 md:w-14 md:h-14 rounded-lg font-bold text-lg
        transition-all duration-200 transform
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-110"}
        ${getChairStyle()}
        ${isShocked ? "animate-shock" : ""}
      `}
      style={getShadowStyle()}
    >
      <span className="relative z-10">{chair.id}</span>

      {/* 座っている表示 - 先攻は青、後攻は赤 */}
      {isSeated && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-yellow-400">
          👤
        </div>
      )}

      {/* 選択中の座席表示（確定前） */}
      {isSelectedSeat && !isSeated && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs animate-pulse bg-yellow-400">
          ？
        </div>
      )}

      {/* 電気マーク（スイッチ側のみ表示・確定済み）- 黄色 */}
      {isElectric && showElectric && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs animate-pulse">
          ⚡
        </div>
      )}

      {/* 選択中の電気イス表示（確定前）- 黄色 */}
      {isSelectedElectric && !isElectric && showElectric && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs animate-pulse">
          ⚡
        </div>
      )}
    </button>
  );
}
