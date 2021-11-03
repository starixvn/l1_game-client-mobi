import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import Card, { convertCardRankToIndex } from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        return (
            <div className={Styles["w-result"]}>
                {bet.result.map((r) => {
                    const cardType = { card: convertCardRankToIndex(r.rank) - 1, type: r.suit };
                    return <Card key={`$card_${r.rank}_${r.suit}`} result={cardType} isSmall={true}></Card>;
                })}
            </div>
        );
    }
    return <></>;
};

const ThreeCardsBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return <BetHistoryContainer gameId={gameId} isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)}></BetHistoryContainer>;
};
export default ThreeCardsBetHistory;
