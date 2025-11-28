/**
 * イス状況ミニマップコンポーネント
 *
 * 1〜12のイスの状態を簡易表示します。
 * カラールール:
 * - 通常のイス: 白
 * - 先攻が座ったイス: 青
 * - 後攻が座ったイス: 赤
 * - 電気イス: 黄色
 * - 使用済: 灰色
 */

"use client";

import type { ChairState } from "@/core/gameTypes";

interface ChairMinimapProps {
  chairs: ChairState[];
  seatedChairId: number | null;
  electricChairId: number | null;
  showElectric: boolean;
  isSeaterFront?: boolean; // 現在の着席者が先攻かどうか
}

export function ChairMinimap({
  chairs,
  seatedChairId,
  electricChairId,
  showElectric,
  isSeaterFront,
}: ChairMinimapProps) {
  return (
    <div className="bg-gray-900/80 rounded-xl p-3 md:p-4 border border-gray-800">
      <h3 className="text-yellow-400 font-bold text-sm md:text-base mb-3">
        🪑 イス状況
      </h3>

      {/* 円形にイスを配置 */}
      <div className="relative w-32 h-32 mx-auto">
        {chairs.map((chair) => {
          const angleRad = ((chair.angle - 90) * Math.PI) / 180;
          const radius = 50;
          const x = 64 + radius * Math.cos(angleRad) - 12;
          const y = 64 + radius * Math.sin(angleRad) - 12;

          const isSeated = seatedChairId === chair.id;
          const isElectric = electricChairId === chair.id && showElectric;

          // 色の決定
          let bgColor = "bg-white"; // 通常: 白
          let textColor = "text-gray-900";

          if (!chair.isAvailable) {
            bgColor = "bg-gray-800";
            textColor = "text-gray-600";
          } else if (isSeated) {
            // 座っている: 先攻は青、後攻は赤
            bgColor = isSeaterFront ? "bg-blue-500" : "bg-red-500";
            textColor = "text-white";
          } else if (isElectric) {
            // 電気イス: 黄色
            bgColor = "bg-yellow-400";
            textColor = "text-gray-900";
          }

          return (
            <div
              key={chair.id}
              className={`
                absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-200
                ${bgColor} ${textColor}
              `}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                boxShadow: chair.isAvailable
                  ? "0 2px 4px rgba(0, 0, 0, 0.6)"
                  : "none",
              }}
            >
              {chair.id}
            </div>
          );
        })}

        {/* 中央の凡例 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-xs text-gray-500">
            残り
            <br />
            <span className="text-lg font-bold text-white">
              {chairs.filter((c) => c.isAvailable).length}
            </span>
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-3 flex justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">先攻</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-400">後攻</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-800" />
          <span className="text-gray-400">使用済</span>
        </div>
      </div>
    </div>
  );
}
