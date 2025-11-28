/**
 * スコアボードコンポーネント
 *
 * 各回戦の結果をコンパクトに横並び表示します。
 * カラールール:
 * - 名前/スコア: 白
 * - 現在のターン枠線: 黄色
 * - 感電: 黄色の⚡アイコン（背景は灰色）
 * - 成功: 白文字、灰色背景
 */

"use client";

import type { PlayerId, PlayerState, TurnSide } from "@/core/gameTypes";

interface ScoreBoardProps {
  player1: PlayerState;
  player2: PlayerState;
  currentRound: number;
  currentTurnSide: TurnSide;
  firstPlayer: PlayerId;
}

export function ScoreBoard({
  player1,
  player2,
  currentRound,
  currentTurnSide,
  firstPlayer,
}: ScoreBoardProps) {
  const rounds = [1, 2, 3, 4, 5, 6, 7, 8];

  // 先攻・後攻プレイヤーを決定
  const frontPlayer = firstPlayer === "player1" ? player1 : player2;
  const backPlayer = firstPlayer === "player1" ? player2 : player1;

  // 先攻プレイヤーは常に"front"ターンで着席、後攻プレイヤーは常に"back"ターンで着席
  const frontPlayerTurnSide: TurnSide = "front";
  const backPlayerTurnSide: TurnSide = "back";

  // 回戦・表裏ごとの結果を取得
  const getResult = (player: PlayerState, round: number, side: TurnSide) => {
    return player.roundHistory.find(
      (r) => r.roundNumber === round && r.turnSide === side,
    );
  };

  return (
    <div className="bg-gray-900/80 rounded-lg px-2 py-1 border border-gray-800 w-full">
      <table className="w-full table-fixed text-xs">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left font-normal w-16 py-0.5" />
            {rounds.map((round) => (
              <th
                key={round}
                className={`font-normal text-center px-0.5 py-0.5 ${
                  currentRound === round ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {round}
              </th>
            ))}
            <th className="font-bold text-center w-10 py-0.5">計</th>
          </tr>
        </thead>
        <tbody>
          {/* 先攻プレイヤーの行 */}
          <tr className="border-t border-gray-800">
            <td className="py-0.5 pr-1">
              <span className="text-xs font-medium text-white truncate block">
                {frontPlayer.name}
              </span>
            </td>
            {rounds.map((round) => {
              const result = getResult(frontPlayer, round, frontPlayerTurnSide);
              const isCurrent =
                currentRound === round &&
                currentTurnSide === frontPlayerTurnSide;

              return (
                <td key={round} className="py-0.5 text-center">
                  <div className="flex justify-center">
                    <div
                      className={`
                        w-5 h-5 rounded flex items-center justify-center text-xs font-bold
                        ${isCurrent ? "ring-2 ring-yellow-400" : ""}
                        ${
                          result?.wasShocked
                            ? "bg-gray-700 text-yellow-400"
                            : result
                              ? "bg-gray-700 text-white"
                              : "bg-gray-800 text-gray-500"
                        }
                      `}
                    >
                      {result?.wasShocked ? "⚡" : (result?.score ?? "-")}
                    </div>
                  </div>
                </td>
              );
            })}
            <td className="py-0.5 text-center">
              <span className="text-sm font-bold text-white">
                {frontPlayer.score}
              </span>
            </td>
          </tr>

          {/* 後攻プレイヤーの行 */}
          <tr className="border-t border-gray-800">
            <td className="py-0.5 pr-1">
              <span className="text-xs font-medium text-white truncate block">
                {backPlayer.name}
              </span>
            </td>
            {rounds.map((round) => {
              const result = getResult(backPlayer, round, backPlayerTurnSide);
              const isCurrent =
                currentRound === round &&
                currentTurnSide === backPlayerTurnSide;

              return (
                <td key={round} className="py-0.5 text-center">
                  <div className="flex justify-center">
                    <div
                      className={`
                        w-5 h-5 rounded flex items-center justify-center text-xs font-bold
                        ${isCurrent ? "ring-2 ring-yellow-400" : ""}
                        ${
                          result?.wasShocked
                            ? "bg-gray-700 text-yellow-400"
                            : result
                              ? "bg-gray-700 text-white"
                              : "bg-gray-800 text-gray-500"
                        }
                      `}
                    >
                      {result?.wasShocked ? "⚡" : (result?.score ?? "-")}
                    </div>
                  </div>
                </td>
              );
            })}
            <td className="py-0.5 text-center">
              <span className="text-sm font-bold text-white">
                {backPlayer.score}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
