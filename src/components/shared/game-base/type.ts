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

export interface GameBaseState {
    signedIn: boolean;
    gameState: GameState;
    remainingTime: number;
    gameConfigs: GameConfigs;
    roundHistory: any[];
    roundId: number;
}

export interface SocketInfo {
    uri: string;
    proxyRoute: string;
}

export interface GameDurations {
    wholeRound: number;
    placingBets: number;
    lockingBet: number;
}
