export interface Round<R, S> {
    roundId?: number;
    result: R;
    settlementResult: S;
    time: Date;
    md5?: string;
    resultKey?: string;
    sum?: number;
}

export interface RoundKenoMatch {
    firstHalf: object;
    fullTime: object;
    id: number;
    odds: object;
}
