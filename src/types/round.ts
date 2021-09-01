export interface Round<R, S> {
    roundId: number;
    result: R;
    settlementResult: S;
}

export interface RoundKenoMatchBase<Result, SettlementResult> {
    md5?: string;
    result: Result;
    resultKey?: string;
    sum?: number;
    settlementResult: SettlementResult;
    time?: string;
    totalBlue?: number;
    totalRed?: number;
    roundId: number;
}
