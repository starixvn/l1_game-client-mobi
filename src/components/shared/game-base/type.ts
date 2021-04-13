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
}

export interface SocketInfo {
    uri: string;
    proxyRoute: string;
    api: string;
}

export interface GameDurations {
    wholeRound: number;
    placingBets: number;
    lockingBet: number;
    showResult: number;
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
