import { Round } from "../../../types";

export interface GameConfigs {
    odds: { [key: string]: number };
    minbet: number;
    maxbet: number;
    choices_maxbet: any;
    enableFreeBet: boolean;
}

export enum GameState {
    None,
    Disabled,
    InRound,
    LockingBet,
    Waiting,
    DisplayResult,
    BeforeStartRound,
}
export enum PopupType {
    Guide,
    BetHistory,
    Rebet,
    Error,
    PlaceBet,
}

export interface GameSettings {
    id: number;
    gameName: string;
    socketInfo: SocketInfo;
    durations: GameDurations;
}

export interface GameBaseProps {
    id: number;
    gameName: string;
    socketInfo: SocketInfo;
    durations: GameDurations;
}

export interface GameBaseState<Result, SettlementResult> {
    signedIn: boolean;
    gameState: GameState;
    remainingTime: number;
    gameConfigs: GameConfigs;
    roundHistory: Round<Result, SettlementResult>[];
    roundId: number;
    result?: Result;
    settlementResult?: SettlementResult;
    totalBets: object;
    ownBets: object;
    userStakeLevel: UserStakeLevel;
    betHistory?: GameBetHistory;
    displayPopup?: PopupType;
    betPercentage?: object;
    errorMessage?: string;
    selectedBetChoice?: string;
    isProcessingBet?: boolean;
    isCompactMode: boolean;
}

export interface SocketInfo {
    namespace: string;
    path: string;
}

export interface GameDurations {
    wholeRound: number;
    placingBets: number;
    lockingBet: number;
    showResult: number;
    highlightBeforeWaiting: number;
    beforeStartRound: number;
}

export interface RebetStorageModel {
    [gameId: string]: RebetStorageDetail;
}

export interface RebetStorageDetail {
    roundId: number;
    betInfo: object;
}

export interface GameBetHistory {
    betLogs: object[];
    page: number;
    pageSize: number;
    total: number;
}

export interface UserStakeLevel {
    minBet: number;
    maxBet: number;
}

export type GameGuide = {
    gameConfigs: GameConfigs;
    userStakeLevel: UserStakeLevel;
    gameName: string;
};

export interface BetLogsBase<Result, SettlementResult> {
    betLogDetails: [];
    betwin: number;
    freeBet: boolean;
    name: string;
    phien: number;
    result: Result;
    settlementResult: SettlementResult;
    time: string;
    odds?: object;
}
