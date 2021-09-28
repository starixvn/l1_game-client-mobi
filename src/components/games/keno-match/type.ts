import { Round, RoundKenoMatchBase } from "../../../types";
import { GameBaseProps, GameBaseState, GameDurations, GameSettings, GameState } from "../../shared/game-base/type";

export enum KenoMatchGameStateEnum {
    None = 20,
    BeforeStartRound,
    Disabled,
    HalfTimePlacingBet,
    ResetResult,
    BeforeStartFullTimePlacingBet,
    FullTimePlacingBet,
    LockingBet,
    ShowResult,
    ShowSettlementResult,
}

export type KenoMatchGameState = KenoMatchGameStateEnum | GameState;

export interface Result {
    blue: number[];
    red: number[];
}

export interface SettlementResult {
    blue: boolean;
    red: boolean;
    tie: boolean;
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
}

export type Odd = {
    blue: number;
    red: number;
    over: number;
    under: number;
    odd: number;
    even: number;
};

export interface HalfRoundResult {
    md5?: string;
    result?: Result;
    resultKey?: string;
    sum?: number;
    settlementResult?: SettlementResult;
    time?: string;
    totalBlue?: number;
    totalRed?: number;
}

export interface KenoMatchRound<Result, SettlementResult> extends Round<Result, SettlementResult> {
    firstHalf: HalfRoundResult;
    fullTime: HalfRoundResult;
    roundId: number;
    odds: Odd;
}

export interface KenoMatchGameDurations extends GameDurations {
    halfTimePlacingBets: number;
    halfTimeLockingBet: number;
    showHalfTimeResult: number;
    showHalfTimeSettlementResult: number;
    fullTimePlacingBets: number;
    fullTimeLockingBet: number;
    showFullTimeResult: number;
    showFullTimeSettlementResult: number;
    beforeStartFullTimePlacingBet: number;
    halfTimeDuration: number;
    fullTimeDuration: number;
    resetResult: number;
    settlementWinning: number;
}

export interface KenoMatchGameSetting extends GameSettings {
    durations: KenoMatchGameDurations;
}

export interface KenoMatchProps extends GameBaseProps {
    GameSetting: KenoMatchGameSetting;
    durations: KenoMatchGameDurations;
}

export interface KenoMatchGameBaseState<Result, SettlementResult> extends GameBaseState<Result, SettlementResult> {
    roundHistory: KenoMatchRound<Result, SettlementResult>[];
    halfTimeResult?: Result;
    fullTimeResult?: Result;
    halfTimeResultInline?: Result;
    fullTimeResultInline?: Result;
    settlementResult?: SettlementResult;
    liveOdds: any;
    firstHalfResult?: HalfRoundResult;
    roundHistoryFH: RoundKenoMatchBase<Result, SettlementResult>[];
    roundHistoryFT: RoundKenoMatchBase<Result, SettlementResult>[];
    isShowBlinkFH: boolean;
    isShowBlinkFT: boolean;
    isJoiningAtMiddleShowInlineResult: boolean;
    isFirstHalf: boolean;
    isShowSettlementResult: boolean;
    beforeStartFulltime: boolean;
}

export interface TimerProps {
    duration: number;
    initialRemainingTime: number;
    lockingBet: boolean;
}

export interface SeparateRoundHistoryProps {
    roundHistoryFH: RoundKenoMatchBase<Result, SettlementResult>[];
    roundHistoryFT: RoundKenoMatchBase<Result, SettlementResult>[];
}

export enum TimeMatch {
    FH,
    FT,
}
