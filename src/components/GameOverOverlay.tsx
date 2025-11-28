/**
 * ゲームオーバーオーバーレイコンポーネント
 *
 * ゲーム終了時の結果を表示します。
 * カラールール:
 * - 勝者: 黄色（強調）
 * - 先攻: 青、後攻: 赤（最終スコア部分のみ）
 * - スコアボード名前: 白
 * - 感電: 黄色⚡（灰色背景）
 * - 成功: 白文字（灰色背景）
 */

"use client";

import type { GameEndReason, GameState } from "@/core/gameTypes";

interface GameOverOverlayProps {
  state: GameState;
  onRestart: () => void;
  onBackToTop: () => void;
}

export function GameOverOverlay({
  state,
  onRestart,
  onBackToTop,
}: GameOverOverlayProps) {
  const winner = state.winner === "player1" ? state.player1 : state.player2;
  const loser = state.winner === "player1" ? state.player2 : state.player1;

  // 先攻・後攻プレイヤーを決定
  const frontPlayer =
    state.firstPlayer === "player1" ? state.player1 : state.player2;
  const backPlayer =
    state.firstPlayer === "player1" ? state.player2 : state.player1;

  // 先攻プレイヤーは常に"front"ターンで着席、後攻プレイヤーは常に"back"ターンで着席
  const frontPlayerTurnSide = "front";
  const backPlayerTurnSide = "back";

  const getEndReasonText = (reason: GameEndReason | null) => {
    switch (reason) {
      case "score_reached":
        return "40点達成！";
      case "failure_limit":
        return `${loser.name}さんが3回感電...`;
      case "chairs_exhausted":
        return "イスが残り1脚になりました";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 max-w-md w-full text-center border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20">
        {/* 結果 - 黄色強調 */}
        {/* <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
          ゲーム終了
        </h2> */}
        <p className="text-gray-400 mb-4">
          {getEndReasonText(state.gameEndReason)}
        </p>

        {/* 勝者 - 黄色強調 */}
        <div className="bg-yellow-900/20 rounded-xl p-4 mb-6 border border-yellow-500/30">
          <p className="text-gray-300 text-sm mb-1">勝者</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-400">
            {winner.name}
          </p>
          <p className="text-gray-400 text-sm mt-1">スコア: {winner.score}点</p>
        </div>

        {/* 各回のスコア履歴（スコアボード風） */}
        <div className="bg-gray-800/50 rounded-xl p-3 mb-6 overflow-x-auto border border-gray-700">
          <p className="text-gray-400 text-xs font-medium mb-2">
            📋 各回の結果
          </p>
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-xs text-gray-400">
                <th className="text-left font-normal w-auto" />
                {[1, 2, 3, 4, 5, 6, 7, 8].map((round) => (
                  <th key={round} className="font-normal text-center px-0.5">
                    {round}
                  </th>
                ))}
                <th className="font-bold text-center w-10">合計</th>
              </tr>
            </thead>
            <tbody>
              {/* 先攻プレイヤー行 */}
              <tr className="border-t border-gray-700">
                <td className="py-1 pr-1">
                  <span className="text-xs text-white whitespace-nowrap">
                    {frontPlayer.name}
                  </span>
                </td>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((round) => {
                  const result = frontPlayer.roundHistory.find(
                    (r) =>
                      r.roundNumber === round &&
                      r.turnSide === frontPlayerTurnSide,
                  );
                  return (
                    <td key={round} className="py-1 text-center">
                      <div className="flex justify-center">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            result?.wasShocked
                              ? "bg-gray-700 text-yellow-400"
                              : result
                                ? "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-500"
                          }`}
                        >
                          {result?.wasShocked ? "⚡" : (result?.score ?? "-")}
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="py-1 text-center text-white font-bold">
                  {frontPlayer.score}
                </td>
              </tr>
              {/* 後攻プレイヤー行 */}
              <tr className="border-t border-gray-700">
                <td className="py-1 pr-1">
                  <span className="text-xs text-white whitespace-nowrap">
                    {backPlayer.name}
                  </span>
                </td>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((round) => {
                  const result = backPlayer.roundHistory.find(
                    (r) =>
                      r.roundNumber === round &&
                      r.turnSide === backPlayerTurnSide,
                  );
                  return (
                    <td key={round} className="py-1 text-center">
                      <div className="flex justify-center">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            result?.wasShocked
                              ? "bg-gray-700 text-yellow-400"
                              : result
                                ? "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-500"
                          }`}
                        >
                          {result?.wasShocked ? "⚡" : (result?.score ?? "-")}
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="py-1 text-center text-white font-bold">
                  {backPlayer.score}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ボタン - 黄色 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🔄 もう一度プレイ
          </button>
          <button
            type="button"
            onClick={onBackToTop}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
          >
            🏠 トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
