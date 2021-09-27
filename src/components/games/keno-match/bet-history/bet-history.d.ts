import { Result, SettlementResult, HalfRoundResult } from "../type";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface OddsBetHistory {
    fhBlue?: number;
    fhEven?: number;
    fhOdd?: number;
    fhOver?: number;
    fhRed?: number;
    fhUnder?: number;
    ftBlue?: number;
    ftEven?: number;
    ftOdd?: number;
    ftOver?: number;
    ftRed?: number;
    ftUnder?: number;
    liveFTBlue?: number;
    liveFTOver?: number;
    liveFTRed?: number;
    liveFTUnder?: number;
}

export interface BetLogs extends BetLogsBase<Result, SettlementResult, OddsBetHistory> {
    fhBlue?: number;
    fhEven?: number;
    fhOdd?: number;
    fhOver?: number;
    fhRed?: number;
    fhUnder?: number;
    firstHalf: HalfRoundResult;
    ftBlue?: number;
    ftEven?: number;
    ftOdd?: number;
    ftOver?: number;
    ftRed?: number;
    ftUnder?: number;
    fullTime: HalfRoundResult;
    liveFTBlue?: number;
    liveFTEven?: number;
    liveFTOdd?: number;
    liveFTOver?: number;
    liveFTRed?: number;
    liveFTUnder?: number;
    odds: OddsBetHistory;
}

export interface BetDetailProps {
    amount: number;
    time: string;
    choice: string;
}
