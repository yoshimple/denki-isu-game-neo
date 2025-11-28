/**
 * ステージコンポーネント
 *
 * 12脚のイスを円形に配置したゲームステージを表示します。
 * 中央にアクションボタン（確定/感電）を配置します。
 */

"use client";

import type { ChairState, GamePhase } from "@/core/gameTypes";
import { Chair } from "./Chair";

interface StageProps {
  chairs: ChairState[];
  seatedChairId: number | null;
  electricChairId: number | null;
  selectedElectricChairId: number | null;
  selectedSeatId: number | null;
  showElectricChair: boolean;
  onChairClick: (chairId: number) => void;
  phase: GamePhase;
  isShocked?: boolean;
  // 中央ボタン用の追加props
  onConfirmElectricChair?: () => void;
  onConfirmSeat?: () => void;
  onPressSwitch?: () => void;
}

export function Stage({
  chairs,
  seatedChairId,
  electricChairId,
  selectedElectricChairId,
  selectedSeatId,
  showElectricChair,
  onChairClick,
  phase,
  isShocked,
  onConfirmElectricChair,
  onConfirmSeat,
  onPressSwitch,
}: StageProps) {
  const canClickChair =
    phase === "switch_setting" ||
    phase === "seating" ||
    phase === "confirm_seat";

  // 中央ボタンの状態を決定
  const getCenterButton = () => {
    if (phase === "switch_setting" && selectedElectricChairId !== null) {
      return {
        show: true,
        label: "確定",
        icon: "🔌",
        onClick: onConfirmElectricChair,
        color: "from-yellow-500 to-yellow-600",
        hoverColor: "hover:from-yellow-400 hover:to-yellow-500",
        pulse: true,
      };
    }
    if (
      (phase === "seating" || phase === "confirm_seat") &&
      selectedSeatId !== null
    ) {
      return {
        show: true,
        label: "確定",
        icon: "👩🏻‍🦼",
        onClick: onConfirmSeat,
        color: "from-yellow-500 to-yellow-600",
        hoverColor: "hover:from-yellow-400 hover:to-yellow-500",
        pulse: true,
      };
    }
    if (phase === "switch_press") {
      return {
        show: true,
        label: "電流を流す",
        icon: "⚡",
        onClick: onPressSwitch,
        color: "from-yellow-500 to-yellow-600",
        hoverColor: "hover:from-yellow-400 hover:to-yellow-500",
        pulse: true,
      };
    }
    return { show: false };
  };

  const centerButton = getCenterButton();

  return (
    <div className="relative w-[20rem] h-[20rem] md:w-[23rem] md:h-[23rem] mx-auto flex-shrink-0">
      {/* ステージ背景 - 暗い青みがかった黒 + 中心を明るく */}
      <div
        className="absolute inset-0 rounded-full border-4 border-gray-800"
        style={{
          background:
            "radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 40%, #0a0a12 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* 内側の装飾円 */}
        <div className="absolute inset-8 rounded-full border border-gray-700/30" />
        <div className="absolute inset-16 rounded-full border border-gray-700/20" />

        {/* 中央のアクションボタン */}
        <div className="absolute inset-0 flex items-center justify-center">
          {centerButton.show && centerButton.onClick && (
            <button
              type="button"
              onClick={centerButton.onClick}
              className={`
                w-28 h-28 md:w-36 md:h-36 rounded-full
                bg-gradient-to-br ${centerButton.color} ${centerButton.hoverColor}
                text-gray-900 font-bold text-sm md:text-base
                transition-all duration-200 transform hover:scale-110
                flex flex-col items-center justify-center gap-1
                border-4 border-yellow-300/80
                ${centerButton.pulse ? "animate-pulse" : ""}
              `}
              style={{
                boxShadow: `
                  0 0 20px rgba(250, 204, 21, 0.6),
                  0 0 40px rgba(250, 204, 21, 0.3),
                  0 8px 16px rgba(0, 0, 0, 0.4),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3)
                `,
              }}
            >
              <span className="text-3xl md:text-5xl drop-shadow-md">
                {centerButton.icon}
              </span>
              <span className="drop-shadow-sm">{centerButton.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* イスを円形に配置 */}
      {chairs.map((chair) => {
        // 角度をラジアンに変換（12時の位置から時計回り）
        const angleRad = ((chair.angle - 90) * Math.PI) / 180;
        // 中心からの相対位置をパーセントで計算（半径は43%程度）
        const radiusPercent = 43;
        // ハイドレーションエラー防止のため小数点以下2桁で丸める
        const xPercent =
          Math.round((50 + radiusPercent * Math.cos(angleRad)) * 100) / 100;
        const yPercent =
          Math.round((50 + radiusPercent * Math.sin(angleRad)) * 100) / 100;

        return (
          <div
            key={chair.id}
            className="absolute transition-all duration-300 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
            }}
          >
            <Chair
              chair={chair}
              isSeated={seatedChairId === chair.id}
              isElectric={electricChairId === chair.id}
              isSelectedElectric={selectedElectricChairId === chair.id}
              isSelectedSeat={selectedSeatId === chair.id}
              showElectric={showElectricChair}
              onClick={() => onChairClick(chair.id)}
              disabled={!canClickChair || !chair.isAvailable}
              isShocked={isShocked && seatedChairId === chair.id}
            />
          </div>
        );
      })}

      {/* 感電エフェクト - 黄色で電気イメージ */}
      {isShocked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-flash rounded-full bg-yellow-400/30" />
          <div className="absolute top-1/4 left-1/4 text-6xl animate-bounce text-yellow-400">
            ⚡
          </div>
          <div className="absolute bottom-1/4 right-1/4 text-6xl animate-bounce delay-100 text-yellow-400">
            ⚡
          </div>
        </div>
      )}
    </div>
  );
}
