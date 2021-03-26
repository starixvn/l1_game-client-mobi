interface Round<R, S> {
    id: number;
    result: R;
    settlementResult: S;
    time: Date;
}
