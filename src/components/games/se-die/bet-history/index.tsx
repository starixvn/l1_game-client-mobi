import React from "react";
import Styles from "./bet-history.module.scss";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistory, { BetHistoryContainer } from "../../../shared/bet-history";
import { countRedDot, checkIsEven } from "../mini-round-history";
import SeDieDot from "../dot";
import { useTranslation } from "next-i18next";
import { BetLogs } from "./bet-history";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = countRedDot(bet.result);
        return (
            <div className="d-flex justify-content-center">
                <SeDieDot red={checkIsEven(countRed)} value={countRed.toString()} />
            </div>
        );
    } else {
        return "";
    }
};

const renderBet = (bet: BetLogs) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("xocxoc");
    const odds = gameConfigs.odds;
    const keysChoices = Object.keys(odds);
    return (
        <div className={Styles["choice"]}>
            {keysChoices.map((name, index) => {
                if (bet[name] > 0) {
                    return (
                        <div key={"choice-" + index}>
                            {t(name)}_{bet[name]}@{odds[name]}
                        </div>
                    );
                }
            })}
        </div>
    );
};

const SeDieTicketHistory: React.FunctionComponent = () => {
    const gameContext = useGameContext();

    if (gameContext.betHistory) {
        const { betLogs } = gameContext.betHistory;
        return (
            <BetHistoryContainer isRefund={false}>
                {betLogs.map((bet: BetLogs) => {
                    return (
                        <BetHistory
                            key={bet.phien}
                            renderResult={() => renderResult(bet)}
                            renderBet={() => renderBet(bet)}
                            betHistoryItem={bet}
                            isRefund={false}
                        ></BetHistory>
                    );
                })}
            </BetHistoryContainer>
        );
    } else {
        return <div></div>;
    }
};

export default SeDieTicketHistory;
