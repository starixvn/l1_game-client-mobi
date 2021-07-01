import React from "react";

import { Round } from "../../../../../types";
import { RoundHistoryType } from "../../type";
import Styles from "../round-history.module.scss";
import { Props } from "./types";

const drawHistory = <R, S>(roundHistory: Round<R, S>[], getElementRound: (round: R, roundId: number) => void) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getElementRound(round.result, round.roundId);
    });
};

const ScoreboardBasic = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getElementRound } = props;
    return <div className={Styles["score-board-container"]}>{drawHistory([...roundHistory.slice(0, 30)].reverse(), getElementRound)}</div>;
};

export default React.memo(ScoreboardBasic);
