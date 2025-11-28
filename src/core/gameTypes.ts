/**
 * 電気イスゲーム - 型定義
 *
 * このファイルはゲームロジックの型定義を集約しています。
 * UIから独立した純粋な型定義として設計されており、
 * 将来的にオンライン対戦版でも同じ型をサーバー/クライアント間で共有できます。
 */

// ============================================================
// プレイヤー関連
// ============================================================

/** プレイヤーID */
export type PlayerId = "player1" | "player2";

/** プレイヤーの状態 */
export interface PlayerState {
  /** プレイヤーID */
  id: PlayerId;
  /** プレイヤー名 */
  name: string;
  /** 現在の得点 */
  score: number;
  /** 失敗（感電）回数 */
  failureCount: number;
  /** アバターの位置（ステージ上のX座標） */
  positionX: number;
  /** アバターの位置（ステージ上のY座標） */
  positionY: number;
  /** 各回戦の結果履歴 */
  roundHistory: RoundResult[];
}

/** 回戦の結果 */
export interface RoundResult {
  /** 回戦番号 (1-8) */
  roundNumber: number;
  /** 表/裏 */
  turnSide: TurnSide;
  /** 獲得した点数（感電時は0） */
  score: number;
  /** 感電したかどうか */
  wasShocked: boolean;
  /** 座ったイスの番号（nullは着席側でなかった場合） */
  chairNumber: number | null;
}

// ============================================================
// イス関連
// ============================================================

/** イスの状態 */
export interface ChairState {
  /** イスのID（1〜12） */
  id: number;
  /** このイスがまだ使用可能かどうか */
  isAvailable: boolean;
  /** ステージ上の位置（角度、円形配置用） */
  angle: number;
}

// ============================================================
// ゲームフェーズ・ターン関連
// ============================================================

/**
 * ゲームフェーズ
 *
 * - setup: ゲーム開始前（プレイヤー名入力など）
 * - switch_setting: スイッチ側が電気イスを選択中
 * - seating: 着席側がイスを選んで座る
 * - confirm_seat: 着席側がイスを確定
 * - switch_press: スイッチ側が感電ボタンを押す
 * - judgment: 判定中（感電/成功の演出）
 * - round_result: ターン結果表示
 * - game_over: ゲーム終了
 */
export type GamePhase =
  | "setup"
  | "switch_setting"
  | "seating"
  | "confirm_seat"
  | "switch_press"
  | "judgment"
  | "round_result"
  | "game_over";

/**
 * ターンサイド
 * - front: 表（player1が着席側、player2がスイッチ側）
 * - back: 裏（player2が着席側、player1がスイッチ側）
 */
export type TurnSide = "front" | "back";

// ============================================================
// ゲーム状態
// ============================================================

/** ゲーム全体の状態 */
export interface GameState {
  /** ゲームフェーズ */
  phase: GamePhase;
  /** 現在の回戦番号 (1〜8) */
  currentRound: number;
  /** 現在のターンサイド（表/裏） */
  currentTurnSide: TurnSide;
  /** プレイヤー1の状態 */
  player1: PlayerState;
  /** プレイヤー2の状態 */
  player2: PlayerState;
  /** 全イスの状態 */
  chairs: ChairState[];
  /**
   * 選択中の電気イスのID（確定前）
   */
  selectedElectricChairId: number | null;
  /**
   * 電気イスのID（スイッチ側が確定後）
   * UIレベルでは着席側に見せないようにする
   */
  electricChairId: number | null;
  /** 選択中の着席イスのID（確定前） */
  selectedSeatId: number | null;
  /** 着席側が現在座っているイスのID */
  seatedChairId: number | null;
  /** 直前の判定結果（演出用） */
  lastJudgmentResult: JudgmentResult | null;
  /** 勝者（ゲーム終了時のみ設定） */
  winner: PlayerId | null;
  /** ゲーム終了理由 */
  gameEndReason: GameEndReason | null;
  /** 先攻プレイヤー（player1が先攻の場合、player1が表で着席側） */
  firstPlayer: PlayerId;
}

/** 判定結果 */
export interface JudgmentResult {
  /** 成功したかどうか */
  success: boolean;
  /** 着席側プレイヤーID */
  seaterPlayerId: PlayerId;
  /** 座ったイスの番号 */
  chairNumber: number;
  /** 獲得した点数（感電時は0） */
  scoreGained: number;
}

/** ゲーム終了理由 */
export type GameEndReason =
  | "score_reached" // 40点以上到達
  | "failure_limit" // 失敗3回
  | "chairs_exhausted"; // イス残り1脚

// ============================================================
// ゲームイベント（アクション）
// ============================================================

/**
 * ゲームイベント
 *
 * ゲーム状態の変更は全てイベントを通じて行われます。
 * これにより、将来的にWebSocket経由でイベントを送受信し、
 * オンライン対戦を実現できます。
 *
 * 【オンライン対戦への拡張ポイント】
 * - クライアントはローカルでイベントを発行
 * - WebSocketでサーバーに送信
 * - サーバーがreduceGameStateで新しい状態を計算
 * - 全クライアントに新しい状態をブロードキャスト
 */
export type GameEvent =
  | InitializeGameEvent
  | SelectElectricChairEvent
  | ConfirmElectricChairEvent
  | SelectSeatEvent
  | ConfirmSeatEvent
  | PressSwitchEvent
  | AcknowledgeJudgmentEvent
  | NextTurnEvent
  | RestartGameEvent;

/** ゲーム初期化イベント */
export interface InitializeGameEvent {
  type: "INITIALIZE_GAME";
  payload: {
    player1Name: string;
    player2Name: string;
    firstPlayer?: PlayerId; // 先攻プレイヤー
  };
}

/** 電気イス選択イベント（確定前の選択） */
export interface SelectElectricChairEvent {
  type: "SELECT_ELECTRIC_CHAIR";
  payload: {
    chairId: number;
  };
}

/** 電気イス確定イベント */
export interface ConfirmElectricChairEvent {
  type: "CONFIRM_ELECTRIC_CHAIR";
}

/** 着席イス選択イベント（確定前の選択） */
export interface SelectSeatEvent {
  type: "SELECT_SEAT";
  payload: {
    chairId: number;
  };
}

/** 着席確定イベント */
export interface ConfirmSeatEvent {
  type: "CONFIRM_SEAT";
}

/** スイッチ押下イベント */
export interface PressSwitchEvent {
  type: "PRESS_SWITCH";
}

/** 判定結果確認イベント（演出後に次へ進む） */
export interface AcknowledgeJudgmentEvent {
  type: "ACKNOWLEDGE_JUDGMENT";
}

/** 次のターンへ進むイベント */
export interface NextTurnEvent {
  type: "NEXT_TURN";
}

/** ゲームリスタートイベント */
export interface RestartGameEvent {
  type: "RESTART_GAME";
}

// ============================================================
// ユーティリティ型
// ============================================================

/** 現在の操作プレイヤーを取得するためのヘルパー型 */
export interface CurrentPlayers {
  /** 着席側プレイヤー */
  seater: PlayerState;
  /** スイッチ側プレイヤー */
  switcher: PlayerState;
  /** 着席側プレイヤーID */
  seaterId: PlayerId;
  /** スイッチ側プレイヤーID */
  switcherId: PlayerId;
}

/** ゲーム設定（将来の拡張用） */
export interface GameConfig {
  /** 初期イス数 */
  initialChairCount: number;
  /** 勝利に必要な得点 */
  winningScore: number;
  /** 失敗上限回数 */
  maxFailures: number;
  /** 最大回戦数 */
  maxRounds: number;
}

/** デフォルトのゲーム設定 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  initialChairCount: 12,
  winningScore: 40,
  maxFailures: 3,
  maxRounds: 8,
};
