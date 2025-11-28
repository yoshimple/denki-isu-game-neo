/**
 * 電気イスゲーム - ゲームエンジン
 */

import {
  type ChairState,
  type CurrentPlayers,
  DEFAULT_GAME_CONFIG,
  type GameConfig,
  type GameEndReason,
  type GameEvent,
  type GameState,
  type JudgmentResult,
  type PlayerId,
  type PlayerState,
  type RoundResult,
  type TurnSide,
} from "./gameTypes";

function createInitialPlayerState(id: PlayerId, name: string): PlayerState {
  return {
    id,
    name,
    score: 0,
    failureCount: 0,
    positionX: id === "player1" ? 150 : 250,
    positionY: 200,
    roundHistory: [],
  };
}

function createInitialChairs(count: number): ChairState[] {
  return Array.from({ length: count }, (_, i) => {
    const chairId = i + 1;
    const angle = chairId === 12 ? 0 : chairId * 30;
    return {
      id: chairId,
      isAvailable: true,
      angle,
    };
  });
}

export function createSetupState(): GameState {
  return {
    phase: "setup",
    currentRound: 1,
    currentTurnSide: "front",
    player1: createInitialPlayerState("player1", ""),
    player2: createInitialPlayerState("player2", ""),
    chairs: createInitialChairs(DEFAULT_GAME_CONFIG.initialChairCount),
    selectedElectricChairId: null,
    electricChairId: null,
    selectedSeatId: null,
    seatedChairId: null,
    lastJudgmentResult: null,
    winner: null,
    gameEndReason: null,
    firstPlayer: "player1",
  };
}

function createInitialGameState(
  player1Name: string,
  player2Name: string,
  firstPlayer: PlayerId = "player1",
  config: GameConfig = DEFAULT_GAME_CONFIG,
): GameState {
  const currentTurnSide: TurnSide = "front";
  return {
    phase: "switch_setting",
    currentRound: 1,
    currentTurnSide,
    player1: createInitialPlayerState("player1", player1Name),
    player2: createInitialPlayerState("player2", player2Name),
    chairs: createInitialChairs(config.initialChairCount),
    selectedElectricChairId: null,
    electricChairId: null,
    selectedSeatId: null,
    seatedChairId: null,
    lastJudgmentResult: null,
    winner: null,
    gameEndReason: null,
    firstPlayer,
  };
}

function getNextTurnSide(current: TurnSide): TurnSide {
  return current === "front" ? "back" : "front";
}

export function getCurrentPlayers(state: GameState): CurrentPlayers {
  const isFirstPlayerSeating = state.currentTurnSide === "front";

  if (state.firstPlayer === "player1") {
    return {
      seater: isFirstPlayerSeating ? state.player1 : state.player2,
      switcher: isFirstPlayerSeating ? state.player2 : state.player1,
      seaterId: isFirstPlayerSeating ? "player1" : "player2",
      switcherId: isFirstPlayerSeating ? "player2" : "player1",
    };
  } else {
    return {
      seater: isFirstPlayerSeating ? state.player2 : state.player1,
      switcher: isFirstPlayerSeating ? state.player1 : state.player2,
      seaterId: isFirstPlayerSeating ? "player2" : "player1",
      switcherId: isFirstPlayerSeating ? "player1" : "player2",
    };
  }
}

function getAvailableChairs(state: GameState): ChairState[] {
  return state.chairs.filter((chair) => chair.isAvailable);
}

function getAvailableChairCount(state: GameState): number {
  return getAvailableChairs(state).length;
}

function handleSelectElectricChair(
  state: GameState,
  chairId: number,
): GameState {
  if (state.phase !== "switch_setting") return state;
  const chair = state.chairs.find((c) => c.id === chairId);
  if (!chair || !chair.isAvailable) return state;
  return { ...state, selectedElectricChairId: chairId };
}

function handleConfirmElectricChair(state: GameState): GameState {
  if (state.phase !== "switch_setting") return state;
  if (state.selectedElectricChairId === null) return state;
  return {
    ...state,
    phase: "seating",
    electricChairId: state.selectedElectricChairId,
  };
}

function handleSelectSeat(state: GameState, chairId: number): GameState {
  if (state.phase !== "seating") return state;
  const chair = state.chairs.find((c) => c.id === chairId);
  if (!chair || !chair.isAvailable) return state;
  return { ...state, selectedSeatId: chairId };
}

function handleConfirmSeat(state: GameState): GameState {
  if (state.phase !== "seating") return state;
  if (state.selectedSeatId === null) return state;
  return {
    ...state,
    phase: "switch_press",
    seatedChairId: state.selectedSeatId,
  };
}

function handlePressSwitch(state: GameState): GameState {
  if (state.phase !== "switch_press") return state;
  if (state.seatedChairId === null || state.electricChairId === null)
    return state;

  const isShocked = state.seatedChairId === state.electricChairId;
  const { seater, seaterId } = getCurrentPlayers(state);
  const chairScore = state.seatedChairId;

  const judgmentResult: JudgmentResult = {
    success: !isShocked,
    seaterPlayerId: seaterId,
    chairNumber: state.seatedChairId,
    scoreGained: isShocked ? 0 : chairScore,
  };

  const roundResult: RoundResult = {
    roundNumber: state.currentRound,
    turnSide: state.currentTurnSide,
    chairNumber: state.seatedChairId,
    wasShocked: isShocked,
    score: isShocked ? 0 : chairScore,
  };

  const updatedSeater: PlayerState = {
    ...seater,
    score: seater.score + (isShocked ? 0 : chairScore),
    failureCount: seater.failureCount + (isShocked ? 1 : 0),
    roundHistory: [...seater.roundHistory, roundResult],
  };

  // 感電しなかった場合のみイスを撤去する（感電した場合はイスを残す）
  const updatedChairs = state.chairs.map((chair) =>
    chair.id === state.seatedChairId && !isShocked
      ? { ...chair, isAvailable: false }
      : chair,
  );

  const isPlayer1Seater = seaterId === "player1";
  const newPlayer1 = isPlayer1Seater ? updatedSeater : state.player1;
  const newPlayer2 = isPlayer1Seater ? state.player2 : updatedSeater;

  // 更新後の状態で終了条件をチェック
  const updatedState: GameState = {
    ...state,
    player1: newPlayer1,
    player2: newPlayer2,
    chairs: updatedChairs,
    lastJudgmentResult: judgmentResult,
  };

  const gameEnd = checkGameEndCondition(updatedState);
  if (gameEnd) {
    return {
      ...updatedState,
      phase: "game_over",
      winner: gameEnd.winner,
      gameEndReason: gameEnd.reason,
    };
  }

  return {
    ...updatedState,
    phase: "judgment",
  };
}

function handleAcknowledgeJudgment(state: GameState): GameState {
  if (state.phase !== "judgment") return state;
  return { ...state, phase: "round_result" };
}

function handleNextTurn(state: GameState): GameState {
  if (state.phase !== "round_result") return state;

  // 終了条件は handlePressSwitch でチェック済みのため、ここでは次のターンに進む
  const nextTurnSide = getNextTurnSide(state.currentTurnSide);
  // 先攻は常に "front" なので、次が "front" になるとき（後攻 "back" が終わった後）に回戦が進む
  const nextRound =
    nextTurnSide === "front" ? state.currentRound + 1 : state.currentRound;

  return {
    ...state,
    phase: "switch_setting",
    currentRound: nextRound,
    currentTurnSide: nextTurnSide,
    selectedElectricChairId: null,
    electricChairId: null,
    selectedSeatId: null,
    seatedChairId: null,
    lastJudgmentResult: null,
  };
}

function handleRestartGame(state: GameState): GameState {
  return createInitialGameState(
    state.player1.name,
    state.player2.name,
    state.firstPlayer,
  );
}

function handleInitializeGame(
  _state: GameState,
  player1Name: string,
  player2Name: string,
  firstPlayer: PlayerId,
): GameState {
  return createInitialGameState(player1Name, player2Name, firstPlayer);
}

function determineWinner(state: GameState): PlayerId | null {
  const p1 = state.player1;
  const p2 = state.player2;

  if (p1.score > p2.score) {
    return "player1";
  } else if (p2.score > p1.score) {
    return "player2";
  }

  if (p1.failureCount < p2.failureCount) {
    return "player1";
  } else if (p2.failureCount < p1.failureCount) {
    return "player2";
  }

  return null;
}

function checkFailureCount(state: GameState): PlayerId | null {
  if (state.player1.failureCount >= DEFAULT_GAME_CONFIG.maxFailures) {
    return "player1";
  }
  if (state.player2.failureCount >= DEFAULT_GAME_CONFIG.maxFailures) {
    return "player2";
  }
  return null;
}

/**
 * 得点が40点以上に達したプレイヤーをチェック
 */
function checkScoreReached(state: GameState): PlayerId | null {
  if (state.player1.score >= DEFAULT_GAME_CONFIG.winningScore) {
    return "player1";
  }
  if (state.player2.score >= DEFAULT_GAME_CONFIG.winningScore) {
    return "player2";
  }
  return null;
}

/**
 * ゲーム終了条件をチェックし、終了理由と勝者を返す
 * 条件:
 * 1. どちらかのプレイヤーの得点が40点以上
 * 2. どちらかのプレイヤーの失敗回数が3回
 * 3. イスが残り1脚になった場合（次のターンに進む前にゲーム終了）
 */
function checkGameEndCondition(
  state: GameState,
): { winner: PlayerId | null; reason: GameEndReason } | null {
  // 条件1: 得点が40点以上に達した
  const scoreWinner = checkScoreReached(state);
  if (scoreWinner) {
    return { winner: scoreWinner, reason: "score_reached" };
  }

  // 条件2: 失敗回数が3回に達した
  const failedPlayer = checkFailureCount(state);
  if (failedPlayer) {
    // 失敗したプレイヤーの相手が勝者
    const winner = failedPlayer === "player1" ? "player2" : "player1";
    return { winner, reason: "failure_limit" };
  }

  // 条件3: イスが残り1脚になった
  const availableCount = getAvailableChairCount(state);
  if (availableCount <= 1) {
    const winner = determineWinner(state);
    return { winner, reason: "chairs_exhausted" };
  }

  return null;
}

export function reduceGameState(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    case "INITIALIZE_GAME":
      return handleInitializeGame(
        state,
        event.payload.player1Name,
        event.payload.player2Name,
        event.payload.firstPlayer || "player1",
      );

    case "SELECT_ELECTRIC_CHAIR":
      return handleSelectElectricChair(state, event.payload.chairId);

    case "CONFIRM_ELECTRIC_CHAIR":
      return handleConfirmElectricChair(state);

    case "SELECT_SEAT":
      return handleSelectSeat(state, event.payload.chairId);

    case "CONFIRM_SEAT":
      return handleConfirmSeat(state);

    case "PRESS_SWITCH":
      return handlePressSwitch(state);

    case "ACKNOWLEDGE_JUDGMENT":
      return handleAcknowledgeJudgment(state);

    case "NEXT_TURN":
      return handleNextTurn(state);

    case "RESTART_GAME":
      return handleRestartGame(state);

    default:
      return state;
  }
}
