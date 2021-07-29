import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import { Odd } from "../dragon-tiger";
import Card from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Card result={bet.result.dragon} isSmall={true} isAnimation={false}></Card> |{" "}
                <Card result={bet.result.tiger} isSmall={true}></Card>
            </div>
        );
    }
    return <></>;
};

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

const DragonTigerBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
        ></BetHistoryContainer>
    );
};

export default DragonTigerBetHistory;
