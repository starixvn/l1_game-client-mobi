import { GameBaseProps, GameBaseState, GameDurations,  GameState} from "../../shared/game-base/type";
import { Round } from "../../../types";

export enum KenoMatchGameStateEnum  {
    None,
    BeforeStartRound,
    ConnectFailed,
    Disabled,
    HalfTimePlacingBet,
    HalfTimeLockingBet,
    ShowHalfTimeResult,
    ShowHalfTimeSettlementResult,
    BeforeStartFullTimePlacingBet,
    FullTimePlacingBet,
    FullTimeLockingBet,
    ShowFullTimeResult,
    ShowFullTimeSettlementResult
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
    halfTimePlacingBets: number;
    halfTimeLockingBet: number;
    showHalfTimeResult: number;
    showHalfTimeSettlementResult: number;
    fullTimePlacingBets: number;
    fullTimeLockingBet: number;
    showFullTimeResult: number;
    showFullTimeSettlementResult: number;
    beforeStartFullTimePlacingBet: number;
    halfTimeDuration: number,
    fullTimeDuration: number,

    resetResult: number;
    // finishHalfTime: number;
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


export interface KenoMatchGameBaseState<KenoMatchResult, KenoMatchSettlementResult> extends GameBaseState<KenoMatchResult, KenoMatchSettlementResult> {
    roundHistory: KenoMatchRound<KenoMatchResult, KenoMatchSettlementResult>[];
    halfTimeResult?: KenoMatchResult;
    fullTimeResult?: KenoMatchResult;
    settlementResult?: KenoMatchSettlementResult;
    activeHalfTimeResult: boolean;
}


export interface TimerProps {
    duration: number;
    initialRemainingTime: number;
    lockingBet: boolean;
}