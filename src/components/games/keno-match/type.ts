import { GameBaseProps, GameBaseState, GameDurations,  GameSettings,  GameState} from "../../shared/game-base/type";
import { Round } from "../../../types";

export enum KenoMatchGameStateEnum  {
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
    HighLightFullTime
}

export type KenoMatchGameState = KenoMatchGameStateEnum | GameState;

export interface Result {
    blue: number[];
    red: number[];
}

export interface SettlementResult {
    blue: boolean;
    red: boolean;
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
    result: Result;
    sum: number;
    settlementResult: SettlementResult;
    time: Date;
}

export interface KenoMatchRound<Result, SettlementResult> extends Round<Result, SettlementResult> {
    halfTime: HalfRoundResult;
    fullTime: HalfRoundResult;
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
    highLightFirstHalf: number
    highLightFullTime: number;
}

export interface KenoMatchGameSetting extends GameSettings {
    durations: KenoMatchGameDurations;
};

export interface KenoMatchProps extends GameBaseProps
{
    GameSetting: KenoMatchGameSetting
}

export interface KenoMatchGameBaseState<Result, SettlementResult> extends GameBaseState<Result, SettlementResult> {
    roundHistory: KenoMatchRound<Result, SettlementResult>[];
    halfTimeResult?: Result;
    fullTimeResult?: Result;
    halfTimeResultPopup?: Result;
    fullTimeResultPopup?: Result;
    settlementResult?: SettlementResult;
    activeHalfTimeResult: boolean;
}

export interface TimerProps {
    duration: number;
    initialRemainingTime: number;
    lockingBet: boolean;
}