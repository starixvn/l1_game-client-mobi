import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices, SeDieSpecialId, SeDieSpecialName } from "../se-die-helper";
import { BetLogs } from "./bet-history";
import { Odd } from "../sedie";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = countRedDot(bet.result);
        return (
            <div className="d-flex justify-content-center">
                <RoundDot choice={checkIsEven(countRed) ? Choices.even : Choices.odd} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const renderBet = (bet: BetLogs, t: Function, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;

        return SeDieSpecialName.includes(gameName) ? (
            <div className={`text-left ${bet.settlementResult[bet.choice] ? "font-weight-medium" : ""}`}>
                {t(`${gameName}:${bet.choice}`)}
                <FormatNumber>{odds ? `@${odds[bet?.choice]}` : ""}</FormatNumber>
            </div>
        ) : (
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

const SeDieBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={SeDieSpecialId.includes(gameId) ? true : false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
        ></BetHistoryContainer>
    );
};
export default SeDieBetHistory;
