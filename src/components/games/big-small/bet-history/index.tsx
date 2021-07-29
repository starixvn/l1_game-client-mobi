import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";

const renderResult = (bet: BetLogs) => {
    if (bet.result && bet.settlementResult) {
        return (
            <div className="d-flex justify-content-center">
                <FormatNumber>
                    {bet.result.dice1}-{bet.result.dice2}-{bet.result.dice3} {Object.values(bet.result).reduce((a, b) => a + b)}
                </FormatNumber>
            </div>
        );
    }
    return <></>;
};

const renderBet = (bet: BetLogs, t: TFunction, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const odds = bet.odds ? bet.odds : mainOdds;
        return (
            <div className={`text-left ${bet.settlementResult[bet.choice] ? "font-weight-medium" : ""}`}>
                {t(`${gameName}:${bet.choice}`)}@<FormatNumber>{`${odds[bet.choice]}`}</FormatNumber>
            </div>
        );
    }

    return <></>;
};

const BigSmallBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={true}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: object, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
        ></BetHistoryContainer>
    );
};

export default BigSmallBetHistory;
