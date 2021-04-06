export interface Round<R, S> {
    roundId: number;
    result: R;
    settlementResult: S;
    time: Date;
}
