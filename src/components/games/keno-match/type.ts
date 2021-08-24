import { WithTranslation } from "next-i18next";
import { WithRouterProps } from "next/dist/client/with-router";
import { GameBaseProps, GameBaseState, GameDurations,  GameState} from "../../shared/game-base/type";
import { Round } from "../../../types";

export enum KenoMatchGameStateEnum  {
    // None,
    // BeforeStartRound,
    // ConnectFailed,
    // Disabled,
    ShowFullTimeResult,
    ShowFullTimeSettlementResult,
    HalfTime,
    HalfTimeLockingBet,
    ShowHalfTimeResult,
    ShowHalfTimeSettlementResult,
    FullTime,
    FullTimeLockingBet,
}

export type KenoMatchGameState = KenoMatchGameStateEnum | GameState;

export interface KenoMatchResult {
    blue: number[];
    red: number[];
}

export interface KenoMatchSettlementResult {
    blue: boolean;
    red: boolean;
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
}

export interface KenoMatchHalfResult {
    result: KenoMatchResult;
    sum: number;
    settlementResult: KenoMatchSettlementResult;
    time: Date;
}

export interface KenoMatchRound<KenoMatchResult,KenoMatchSettlementResult> extends Round<KenoMatchResult,KenoMatchSettlementResult> {
    roundId: number;
    halfTime: KenoMatchHalfResult;
    fullTime: KenoMatchHalfResult;
    time: Date;
}

export interface KenoMatchGameDurations extends GameDurations {
    wholeRound: number;
    showFullTimeSettlementResult: number;
    halfTimePlacingBets: number;
    resetResult: number;
    halfTimeLockingBet: number;
    finishHalfTime: number;
    showHalfTimeSettlementResult: number;
    fullTimePlacingBets: number;
    fullTimeLockingBet: number;
}

export type KenoMatchGameSetting = {
    id: number;
    gameName: string;
    durations: KenoMatchGameDurations;
};

export interface KenoMatchProps extends GameBaseProps
{
    GameSetting: KenoMatchGameSetting
}

// export type KenoMatchProps = GameBaseProps & KenoMatchGameSetting &
//     WithTranslation &
//     WithRouterProps;

// export type KenoMatchState = {
//     signedIn: boolean;
//     gameState: KenoMatchGameState;
//     remainingTime: number;
//     gameConfigs: GameConfigs;
//     roundId: number;
//     roundHistory: KenoMatchRound[];
//     ownBets: object;
//     halfTimeResult?: KenoMatchResult;
//     fullTimeResult?: KenoMatchResult;
//     settlementResult?: KenoMatchSettlementResult;
//     activeHalfTimeResult: boolean;
// };

export interface KenoMatchGameBaseState<KenoMatchResult, KenoMatchSettlementResult> extends GameBaseState<KenoMatchResult, KenoMatchSettlementResult> {
    // gameState: KenoMatchGameState;
    // kenoMatchGameSetting: KenoMatchGameSetting;
    roundHistory: KenoMatchRound<KenoMatchResult, KenoMatchSettlementResult>[];
    halfTimeResult?: KenoMatchResult;
    fullTimeResult?: KenoMatchResult;
    settlementResult?: KenoMatchSettlementResult;
    activeHalfTimeResult: boolean;
}
