import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import { Odd } from "../three-cards";
import Card, { convertCardRankToIndex } from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderBet = (bet: BetLogs, t: TFunction, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;
        return (
            <div className={Styles["list-choice"]}>
                {keysChoices &&
                    keysChoices.map((name, index) => {
                        const classHighLight = bet.settlementResult[name] ? "font-weight-medium" : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(`${gameName}:${name}`)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
                                </div>
                            );
                        }
                        return "";
                    })}
            </div>
        );
    }

    return <></>;
};

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        return (
            <div className="d-flex justify-content-center">
                {bet.result.map((r, _) => {
                    const cardType = { card: convertCardRankToIndex(r.rank) - 1, type: r.suit };
                    return <Card key={`$card_${r.rank}_${r.suit}`} result={cardType} isSmall={true}></Card>;
                })}
            </div>
        );
    }
    return <></>;
};

const ThreeCardsBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
            renderResult={(bet: BetLogs) => renderResult(bet)}
        ></BetHistoryContainer>
    );
};
export default ThreeCardsBetHistory;
