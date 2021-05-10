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
    BalancingBet,
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
    displayPopup?: PopupType;
    betPercentage?: object;
    errorMessage?: string;
    selectedBetChoice?: string;
    isProcessingBet?: boolean;
    isCompactMode: boolean;
    disabledMessage?: string;
    showWaitingTime: boolean;
    acceptedBetQueue: { [key: number]: number };
    showWinningBet: boolean;
    playResultAnimation: boolean;
    displayChips: DisplayChips;
}

export interface DisplayChips {
    [betChoice: string]: number[];
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
    resultAnimation: number;
    beforeStartRound: number;
    balancingBet?: number;
}

export interface UserBetChipStorageModal {
    [gameId: string]: {
        roundId: number;
        chips: DisplayChips;
    };
}

export interface RebetStorageModel {
    [gameId: string]: RebetStorageDetail;
}

export interface RebetStorageDetail {
    roundId: number;
    betInfo: object;
}

export interface UserStakeLevel {
    minBet: number;
    maxBet: number;
}

export type GameGuide = {
    gameConfigs: GameConfigs;
    userStakeLevel: UserStakeLevel;
    gameName: string;
    gameId?: number;
};

export interface BetLogsBase<Result, SettlementResult, Odd> {
    betLogDetails: [];
    betwin: number;
    freeBet: boolean;
    name: string;
    phien: number;
    result: Result;
    settlementResult: SettlementResult;
    time: string;
    odds?: Odd;
}
