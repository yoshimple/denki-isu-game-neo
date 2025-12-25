"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  ControlPanel,
  GameOverOverlay,
  JudgmentOverlay,
  ScoreBoard,
  Stage,
} from "@/components";
import { useGameState } from "@/hooks/useGameState";

/**
 * ゲーム画面のメインコンテンツ
 */
function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const player1Name = searchParams.get("p1") || "プレイヤー1";
  const player2Name = searchParams.get("p2") || "プレイヤー2";
  const firstParam = searchParams.get("first");
  const firstPlayer = firstParam === "p2" ? "player2" : "player1";

  const { state, dispatch, currentPlayers } = useGameState();

  // 初回マウント時にゲームを初期化
  useEffect(() => {
    if (state.phase === "setup") {
      dispatch({
        type: "INITIALIZE_GAME",
        payload: {
          player1Name,
          player2Name,
          firstPlayer,
        },
      });
    }
  }, [dispatch, player1Name, player2Name, firstPlayer, state.phase]);

  // イスクリック時の処理
  const handleChairClick = (chairId: number) => {
    if (state.phase === "switch_setting") {
      // スイッチ側が電気イスを選択（確定前）
      dispatch({
        type: "SELECT_ELECTRIC_CHAIR",
        payload: { chairId },
      });
    } else if (state.phase === "seating" || state.phase === "confirm_seat") {
      // 着席側がイスを選択（確定前）
      dispatch({
        type: "SELECT_SEAT",
        payload: { chairId },
      });
    }
  };

  // 電気イス確定
  const handleConfirmElectricChair = () => {
    dispatch({ type: "CONFIRM_ELECTRIC_CHAIR" });
  };

  // 着席確定
  const handleConfirmSeat = () => {
    dispatch({ type: "CONFIRM_SEAT" });
  };

  // 感電ボタン押下
  const handlePressSwitch = () => {
    dispatch({ type: "PRESS_SWITCH" });
  };

  // 判定結果確認
  const handleAcknowledgeJudgment = () => {
    dispatch({ type: "ACKNOWLEDGE_JUDGMENT" });
  };

  // 次のターン
  const handleNextTurn = () => {
    dispatch({ type: "NEXT_TURN" });
  };

  // ゲームリスタート
  const handleRestart = () => {
    dispatch({ type: "RESTART_GAME" });
  };

  // トップに戻る
  const handleBackToTop = () => {
    router.push("/");
  };

  // スイッチ側のみ電気イスを表示
  // ローカル対戦なので、スイッチ設定フェーズでのみ表示（着席側は見ない前提）
  const showElectricChair = state.phase === "switch_setting";

  // 判定フェーズで感電したかどうか
  const isShocked =
    state.phase === "judgment" && state.lastJudgmentResult?.success === false;

  // ゲーム開始前は何も表示しない
  if (state.phase === "setup") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-yellow-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // 先攻・後攻プレイヤーを取得
  const _frontPlayerId = state.firstPlayer;

  return (
    <div className="min-h-screen p-2 flex flex-col overflow-y-auto">
      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto flex flex-col flex-1 gap-2 w-full">
        {/* スコアボード（上部横並び） */}
        <ScoreBoard
          player1={state.player1}
          player2={state.player2}
          currentRound={state.currentRound}
          currentTurnSide={state.currentTurnSide}
          firstPlayer={state.firstPlayer}
        />

        {/* コンパクトな情報バー（ステージの上） */}
        <ControlPanel
          phase={state.phase}
          currentPlayers={currentPlayers}
          selectedElectricChairId={state.selectedElectricChairId}
          selectedSeatId={state.selectedSeatId}
          onConfirmElectricChair={handleConfirmElectricChair}
          onConfirmSeat={handleConfirmSeat}
          onPressSwitch={handlePressSwitch}
          onAcknowledgeJudgment={handleAcknowledgeJudgment}
          onNextTurn={handleNextTurn}
          isSeaterFront={currentPlayers.seaterId === state.firstPlayer}
          isSwitcherFront={currentPlayers.switcherId === state.firstPlayer}
        />

        {/* ステージ */}
        <div className="rounded-xl p-2 flex-1 flex flex-col min-h-[300px]">
          <Stage
            chairs={state.chairs}
            seatedChairId={state.seatedChairId}
            electricChairId={state.electricChairId}
            selectedElectricChairId={state.selectedElectricChairId}
            selectedSeatId={state.selectedSeatId}
            showElectricChair={showElectricChair}
            onChairClick={handleChairClick}
            phase={state.phase}
            isShocked={isShocked}
            onConfirmElectricChair={handleConfirmElectricChair}
            onConfirmSeat={handleConfirmSeat}
            onPressSwitch={handlePressSwitch}
          />
        </div>

        {/* ルール情報（画面下部） */}
        <div className="mt-auto bg-gray-900/60 rounded-xl p-3 text-xs text-gray-300 border border-gray-800">
          <h3 className="font-bold text-yellow-400 mb-1">📖 ルール</h3>
          <ul className="list-disc list-inside space-y-0.5">
            <li>12脚のイスから1つを選んで座ります</li>
            <li>相手が電気イスを仕掛けています</li>
            <li>感電せずに座れたらイス番号分のポイント獲得</li>
            <li>40点先取で勝利！ / 3回感電したら負け</li>
          </ul>
        </div>

        {/* 作者リンク */}
        <div className="mt-2 text-center">
          <a
            href="https://x.com/yoshimple"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600/70 hover:text-yellow-400 text-xs transition-colors"
          >
            Created by @yoshimple
          </a>
        </div>
      </main>

      {/* 判定オーバーレイ */}
      {state.phase === "judgment" && state.lastJudgmentResult && (
        <JudgmentOverlay
          result={state.lastJudgmentResult}
          seater={currentPlayers.seater}
          electricChairId={state.electricChairId}
          onContinue={handleAcknowledgeJudgment}
        />
      )}

      {/* ラウンド結果オーバーレイ */}
      {state.phase === "round_result" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ターン終了
            </h2>
            <p className="text-xl text-gray-300">
              次は{currentPlayers.switcher.name}さんがイスに座る番です
            </p>
            <button
              type="button"
              onClick={handleNextTurn}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold text-xl rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              次のターンへ →
            </button>
          </div>
        </div>
      )}

      {/* ゲームオーバーオーバーレイ */}
      {state.phase === "game_over" && (
        <GameOverOverlay
          state={state}
          onRestart={handleRestart}
          onBackToTop={handleBackToTop}
        />
      )}

      {/* グローバルスタイル */}
      <style jsx global>{`
        @keyframes flash {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shock {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px) rotate(-2deg);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px) rotate(2deg);
          }
        }

        .animate-flash {
          animation: flash 0.2s ease-in-out 3;
        }

        .animate-shock {
          animation: shock 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * メイン対戦画面
 *
 * ゲームのメインプレイ画面です。
 * ステージ、操作パネル、スコアボードなどを表示します。
 */
export default function GamePage() {
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
      <GameContent />
    </Suspense>
  );
}
