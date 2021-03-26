import React from "react";

interface Props<R, S> {
    round: Round<R, S>;
    renderRoundDetail: (round: Round<R, S>) => void;
}

const RoundHistoryItem = <R, S>({ round, renderRoundDetail }: Props<R, S>) => {
    return <div></div>;
};

export default RoundHistoryItem;
