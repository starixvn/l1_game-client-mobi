import React from "react";

interface Props<R, S> {
    roundId: number;
    result: R;
    settlementResult: S;
}

const RoundHistory = <R, S>({ roundId, result, settlementResult }: Props<R, S>) => {};
