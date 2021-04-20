import { useTranslation } from "next-i18next";
import React from "react";

import { BetLogs } from "./bet-history";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistoryContainer from "../../../shared/bet-history";
import SeDieDot from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
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

const renderBet = (bet: BetLogs) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("xocxoc");
    const odds = gameConfigs.odds;
    const keysChoices = Object.keys(bet.settlementResult);
    return (
        <div className={Styles["choice"]}>
            {keysChoices &&
                keysChoices.map((name, index) => {
                    if (bet[name] > 0) {
                        return (
                            <div key={index}>
                                {t(name)}_{bet[name]}@{odds[name]}
                            </div>
                        );
                    }

                    return <></>;
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
        ></BetHistoryContainer>
    );
};

export default SeDieBetHistory;
