import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { renderResult } from "../../se-die/bet-history";
import { BetLogs } from "./bet-history";
import { Odd } from "../../se-die/sedie";

const renderBet = (bet: BetLogs, t: Function, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const odds = bet.odds ? bet.odds : mainOdds;

        return (
            <div className={`text-left ${bet.settlementResult[bet.choice] ? "font-weight-medium" : ""}`}>
                {t(`${gameName}:${bet.choice}`)}
                <FormatNumber>{odds ? `@${odds[bet?.choice]}` : ""}</FormatNumber>
            </div>
        );
    }

    return <></>;
};

const SeDieSpecialBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={true}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
        ></BetHistoryContainer>
    );
};
export default SeDieSpecialBetHistory;
