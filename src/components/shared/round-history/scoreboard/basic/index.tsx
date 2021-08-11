import React from "react";

import { Round } from "../../../../../types";
import { RoundHistoryType } from "../../type";
import Styles from "../round-history.module.scss";
import { Props } from "./types";

const drawHistory = <R, S>(roundHistory: Round<R, S>[], getDotDetails: (round: R, roundId: number) => void) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getDotDetails(round.result, round.roundId);
    });
};

const ScoreboardBasic = <R, S>(props: Props<R, S>) => {
    const { roundHistory, getDotDetails } = props;
    return <div className={Styles["score-board-container"]}>{drawHistory([...roundHistory].reverse(), getDotDetails)}</div>;
};

export default React.memo(ScoreboardBasic);
