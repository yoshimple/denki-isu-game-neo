/**
 * 電気イスゲーム - ゲーム状態管理フック
 *
 * このフックはゲームエンジンとReact UIを接続します。
 * ローカル対戦版ではブラウザ内の状態管理のみを行います。
 *
 * 【オンライン対戦への拡張ポイント】
 * - このフックをWebSocket対応版に差し替えることで、
 *   UIコンポーネントは変更なしでオンライン対戦に対応できます
 * - dispatchEventをWebSocket送信に変更
 * - 状態更新をWebSocketメッセージ受信で行う
 */

"use client";

import { useCallback, useReducer } from "react";
import {
  createSetupState,
  getCurrentPlayers,
  reduceGameState,
} from "@/core/gameEngine";
import type { GameEvent, GameState } from "@/core/gameTypes";

/**
 * ゲーム状態管理フックの戻り値
 */
export interface UseGameStateReturn {
  /** 現在のゲーム状態 */
  state: GameState;
  /** イベントを発行して状態を更新 */
  dispatch: (event: GameEvent) => void;
  /** 現在の着席側・スイッチ側プレイヤー */
  currentPlayers: ReturnType<typeof getCurrentPlayers>;
}

/**
 * ゲーム状態管理用Reducer
 *
 * 【オンライン対戦への拡張】
 * オンライン版ではこのReducerは使わず、
 * WebSocketから受け取った状態をそのままsetStateで設定します
 */
function gameReducer(state: GameState, event: GameEvent): GameState {
  return reduceGameState(state, event);
}

/**
 * ゲーム状態管理フック
 *
 * 【使い方】
 * ```tsx
 * const { state, dispatch, currentPlayers, ... } = useGameState();
 *
 * // イベントを発行
 * dispatch({ type: "SET_ELECTRIC_CHAIR", payload: { chairId: 5 } });
 * ```
 */
export function useGameState(): UseGameStateReturn {
  const [state, dispatchEvent] = useReducer(
    gameReducer,
    null,
    createSetupState,
  );

  /**
   * イベントを発行
   *
   * 【オンライン対戦への拡張ポイント】
   * オンライン版では、ここでWebSocketにイベントを送信する：
   *
   * ```typescript
   * const dispatch = useCallback((event: GameEvent) => {
   *   socket.emit('game_event', event);
   * }, [socket]);
   * ```
   *
   * 状態更新はWebSocketのメッセージ受信で行う：
   *
   * ```typescript
   * useEffect(() => {
   *   socket.on('state_update', (newState: GameState) => {
   *     setState(newState);
   *   });
   * }, [socket]);
   * ```
   */
  const dispatch = useCallback((event: GameEvent) => {
    dispatchEvent(event);
  }, []);

  const currentPlayers = getCurrentPlayers(state);

  return {
    state,
    dispatch,
    currentPlayers,
  };
}
