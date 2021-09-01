import { GameBaseProps, GameBaseState, GameDurations, GameSettings, GameState } from "../../shared/game-base/type";
import { Round, RoundKenoMatchBase } from "../../../types";

export enum KenoMatchGameStateEnum {
    None = 20,
    BeforeStartRound,
    Disabled,
    HalfTimePlacingBet,
    HalfTimeLockingBet,
    ShowHalfTimeResult,
    ShowHalfTimeSettlementResult,
    HighLightFirstHalf,
    BeforeStartFullTimePlacingBet,
    FullTimePlacingBet,
    FullTimeLockingBet,
    ShowFullTimeResult,
    ShowFullTimeSettlementResult,
    HighLightFullTime,
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
    md5: string;
    result: Result;
    resultKey: string;
    sum: number;
    settlementResult: SettlementResult;
    time: string;
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
    highLightFirstHalf: number;
    highLightFullTime: number;
}

export interface KenoMatchGameSetting extends GameSettings {
    durations: KenoMatchGameDurations;
}

export interface KenoMatchProps extends GameBaseProps {
    GameSetting: KenoMatchGameSetting;
}

export interface KenoMatchGameBaseState<Result, SettlementResult> extends GameBaseState<Result, SettlementResult> {
    roundHistory: KenoMatchRound<Result, SettlementResult>[];
    halfTimeResult?: Result;
    fullTimeResult?: Result;
    halfTimeResultPopup?: Result;
    fullTimeResultPopup?: Result;
    settlementResult?: SettlementResult;
    isActiveLiveFullTime: boolean;
    liveOdds: any;
    md5?: string;
    firstHalfResult?: HalfRoundResult;
    roundHistoryH1: RoundKenoMatchBase<Result, SettlementResult>[];
    roundHistoryFH: RoundKenoMatchBase<Result, SettlementResult>[];
    isShowBlinkH1: boolean;
    isShowBlinkFH: boolean;
}

export interface TimerProps {
    duration: number;
    initialRemainingTime: number;
    lockingBet: boolean;
}

export interface SeparateRoundHistoryProps {
    roundHistoryH1: RoundKenoMatchBase<Result, SettlementResult>[];
    roundHistoryFH: RoundKenoMatchBase<Result, SettlementResult>[];
}
