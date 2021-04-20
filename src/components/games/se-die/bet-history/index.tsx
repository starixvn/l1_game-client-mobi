import { useTranslation } from "next-i18next";
import React from "react";

import { BetLogs } from "./bet-history";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistoryContainer from "../../../shared/bet-history";
import SeDieDot from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { numberWithCommas } from "../../../../helpers/NumberHelper";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = countRedDot(bet.result);
        return (
            <div className="d-flex justify-content-center">
                <SeDieDot red={checkIsEven(countRed)} value={countRed.toString()} />
            </div>
        );
    }
    return <></>;
};

const renderStake = (bet: BetLogs) => {
    const keysChoices = Object.keys(bet.settlementResult);
    return (
        <div className={Styles["choice"]}>
            {keysChoices &&
                keysChoices.map((name, index) => {
                    return <div key={index}>{numberWithCommas(bet[name])}</div>;
                })}
        </div>
    );
};

const renderBet = (bet: BetLogs) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("xocxoc");
    const odds = gameConfigs.odds;
    const keysChoices = Object.keys(bet.settlementResult);
    return (
        <div className={Styles["choice"]}>
            {keysChoices &&
                keysChoices.map((name, index) => {
                    const classHighLight = bet.settlementResult[name] ? "text-bold" : "";
                    return (
                        <div key={index} className={classHighLight}>
                            {t(name)}@{odds[name]}
                        </div>
                    );
                })}
        </div>
    );
};

const SeDieBetHistory: React.FunctionComponent = () => {
    return (
        <BetHistoryContainer
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            renderBet={(bet: BetLogs) => renderBet(bet)}
            renderStake={(bet: BetLogs) => renderStake(bet)}
        ></BetHistoryContainer>
    );
};

export default SeDieBetHistory;
