import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
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

const DragonTigerBetHistory: React.FunctionComponent<{ gameId: number; fractionalOddsFormat: boolean | undefined }> = ({
    gameId,
    fractionalOddsFormat,
}) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            fractionalOddsFormat={fractionalOddsFormat}
        ></BetHistoryContainer>
    );
};

export default DragonTigerBetHistory;
