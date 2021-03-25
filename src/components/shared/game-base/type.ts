export interface GameConfigs {
    odds: object;
    minbet: number;
    maxbet: number;
    choices_maxbet: object;
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
    roundHistory: RoundHistory<Result, SettlementResult>[];
    roundId: number;
    result?: Result;
    settlementResult?: SettlementResult;
    totalBets: object;
    ownBets: object;
}

interface RoundHistory<Result, SettlementResult> {
    roundId: number;
    result: Result;
    settlementResult: SettlementResult;
}

export interface SocketInfo {
    uri: string;
    proxyRoute: string;
}

export interface GameDurations {
    wholeRound: number;
    placingBets: number;
    lockingBet: number;
    showResult: number;
    beforeStartRound: number;
}
