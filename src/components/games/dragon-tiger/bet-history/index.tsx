import React from "react";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import Card from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        return (
            <div className={Styles["w-result"]}>
                <Card result={bet.result.dragon} isSmall={true} isAnimation={false}></Card> |{" "}
                <Card result={bet.result.tiger} isSmall={true}></Card>
            </div>
        );
    }
    return <></>;
};

const DragonTigerBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return <BetHistoryContainer gameId={gameId} isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)}></BetHistoryContainer>;
};

export default DragonTigerBetHistory;
