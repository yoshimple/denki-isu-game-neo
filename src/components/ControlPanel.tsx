/**
 * 操作パネルコンポーネント（コンパクト版）
 *
 * ゲームフェーズに応じた情報とボタンを横並びでコンパクトに表示します。
 * メインのアクションボタン（確定/感電）はステージ中央に移動済み。
 */

"use client";

import type { CurrentPlayers, GamePhase } from "@/core/gameTypes";

interface ControlPanelProps {
  phase: GamePhase;
  currentPlayers: CurrentPlayers;
  selectedElectricChairId: number | null;
  selectedSeatId: number | null;
  onConfirmElectricChair: () => void;
  onConfirmSeat: () => void;
  onPressSwitch: () => void;
  onAcknowledgeJudgment: () => void;
  onNextTurn: () => void;
  isSeaterFront?: boolean;
  isSwitcherFront?: boolean;
}

export function ControlPanel({
  phase,
  currentPlayers,
  selectedElectricChairId,
  selectedSeatId,
  onAcknowledgeJudgment,
  onNextTurn,
  isSeaterFront,
  isSwitcherFront,
}: ControlPanelProps) {
  const { seater, switcher } = currentPlayers;

  // プレイヤー名の色（先攻: 青、後攻: 赤）
  const seaterTextColor = isSeaterFront ? "text-blue-400" : "text-red-400";
  const switcherTextColor = isSwitcherFront ? "text-blue-400" : "text-red-400";

  // フェーズごとのメッセージを取得（3行固定レイアウト）
  // line1: プレイヤー名（操作者）
  // line2: 本文（メインの指示）
  // line3: 補足説明
  const getMessage = () => {
    switch (phase) {
      case "switch_setting":
        return {
          icon: "🔌",
          line1Player: switcher.name,
          line1PlayerColor: switcherTextColor,
          line2: selectedElectricChairId
            ? "中央ボタンでイスを確定してください"
            : "電気イスを選んでください",
          line3: "相手が座りそうなイスを予想しよう！",
          line3Color: "text-gray-500",
        };
      case "seating":
      case "confirm_seat":
        return {
          icon: "👩🏻‍🦼",
          line1Player: seater.name,
          line1PlayerColor: seaterTextColor,
          line2: selectedSeatId
            ? "中央ボタンでイスを確定してください"
            : "座りたいイスを選んでください",
          line3: "安全なイスに座ってポイントを獲得！",
          line3Color: "text-gray-500",
        };
      case "switch_press":
        return {
          icon: "⚡",
          line1Player: switcher.name,
          line1PlayerColor: switcherTextColor,
          line2: "中央ボタンで電流を流してください",
          line3: "電気イスに座っていたら感電！",
          line3Color: "text-gray-500",
        };
      case "judgment":
        return {
          icon: "📢",
          line1Player: "",
          line1PlayerColor: "",
          line2: "結果発表！",
          line3: "判定結果を確認しましょう",
          line3Color: "text-gray-500",
          showButton: true,
          buttonLabel: "結果を確認 →",
          onButtonClick: onAcknowledgeJudgment,
        };
      case "round_result":
        return {
          icon: "🔄",
          line1Player: "",
          line1PlayerColor: "",
          line2: "ターン終了",
          line3: "攻守を交代して次のターンへ",
          line3Color: "text-gray-500",
          showButton: true,
          buttonLabel: "次のターンへ →",
          onButtonClick: onNextTurn,
        };
      default:
        return null;
    }
  };

  const message = getMessage();

  if (!message) return null;

  return (
    <div className="bg-gray-900/80 rounded-lg px-3 py-1.5 border border-gray-800 flex items-center justify-between gap-2 text-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-2xl flex-shrink-0">{message.icon}</span>
        <div className="min-w-0 flex flex-col leading-tight">
          {/* 1行目: プレイヤー名 */}
          <div className="truncate">
            {message.line1Player ? (
              <>
                <span className="text-gray-400">操作者：</span>
                <span className={`font-bold ${message.line1PlayerColor}`}>
                  {message.line1Player}さん
                </span>
              </>
            ) : (
              <span className="text-gray-400">―</span>
            )}
          </div>
          {/* 2行目: 本文 */}
          <div className="text-gray-300 truncate">{message.line2}</div>
          {/* 3行目: 補足 */}
          <div className={`text-xs ${message.line3Color} truncate`}>
            {message.line3}
          </div>
        </div>
      </div>
      {message.showButton && message.onButtonClick && (
        <button
          type="button"
          onClick={message.onButtonClick}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex-shrink-0"
        >
          {message.buttonLabel}
        </button>
      )}
    </div>
  );
}
