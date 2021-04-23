import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../../helpers/NumberHelper";
import BetHistoryContainer from "../../../shared/bet-history";
import SeDieDot from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { BetLogs } from "./bet-history";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = countRedDot(bet.result);
        return (
            <div className="d-flex justify-content-center">
                <SeDieDot red={checkIsEven(countRed)} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const renderStake = (bet: BetLogs) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        return (
            <>
                {keysChoices.map((name, index) => {
                    if (bet[name] > 0) {
                        return (
                            <div key={index} className={bet.settlementResult[name] ? "font-weight-bold" : ""}>
                                {numberWithCommas(bet[name])}
                            </div>
                        );
                    }
                    return null;
                })}
            </>
        );
    }

    return <></>;
};

const renderBet = (bet: BetLogs, t: Function, odds: object) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        return (
            <>
                {keysChoices &&
                    keysChoices.map((name, index) => {
                        const classHighLight = bet.settlementResult[name] ? "font-weight-bold" : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(name)}@{odds[name]}
                                </div>
                            );
                        }
                        return "";
                    })}
            </>
        );
    }

    return <></>;
};

const SeDieBetHistory: React.FunctionComponent = () => {
    const { t } = useTranslation("xocxoc");
    return (
        <BetHistoryContainer
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs, t: Function, odds: object) => renderBet(bet, t, odds)}
            renderStake={(bet: BetLogs) => renderStake(bet)}
            translate={t}
        ></BetHistoryContainer>
    );
};

export default SeDieBetHistory;
