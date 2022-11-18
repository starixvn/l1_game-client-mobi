import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { renderResult } from "../../se-die/bet-history";
import { BetLogs } from "./bet-history";
import { Odd } from "../../se-die/sedie";
import { useSystemContext } from "../../../../contexts/system";
import { numberWithCommas } from "../../../../helpers/number-helper";

const renderBet = (bet: BetLogs, t: Function, mainOdds: object, gameName: string, fractionalOddsFormat: boolean | undefined) => {
    if (bet.settlementResult) {
        const odds = bet.odds ? bet.odds : mainOdds;

        return (
            <div className={`text-left ${bet.settlementResult[bet.choice] ? "font-weight-medium" : ""}`}>
                {t(`${gameName}:${bet.choice}`)}
                <FormatNumber>
                    {odds ? `@${fractionalOddsFormat ? numberWithCommas(+odds[bet?.choice] - 1) : odds[bet?.choice]}` : ""}
                </FormatNumber>
            </div>
        );
    }

    return <></>;
};

const SeDieSpecialBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    const { fractionalOddsFormat } = useSystemContext();
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={true}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) =>
                renderBet(bet, t, mainOdds, gameName, fractionalOddsFormat)
            }
        ></BetHistoryContainer>
    );
};
export default SeDieSpecialBetHistory;
