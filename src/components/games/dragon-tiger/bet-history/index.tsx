import React from "react";
import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { useTranslation } from "next-i18next";
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

const renderBet = (bet: BetLogs, t: Function, mainOdds: object) => {
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
                                    {t(name)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
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
    const { t } = useTranslation("dragontiger");
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            translate={t}
            renderBet={(bet: BetLogs, t: Function, mainOdds: Odd) => renderBet(bet, t, mainOdds)}
        ></BetHistoryContainer>
    );
};

export default DragonTigerBetHistory;
