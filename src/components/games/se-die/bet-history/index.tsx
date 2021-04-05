import React from "react";
import Styles from "./bet-history.module.scss";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistory, { BetHistoryContainer } from "../../../shared/bet-history";
import { countRedDot, checkIsEven } from "../mini-round-history";
import SeDieDot from "../dot";
import { useTranslation } from "next-i18next";

type Props = {
    popupContentTitle: string;
    isReFun?: boolean;
};

const renderResult = (bet) => {
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

const renderBet = (bet) => {
    const { gameConfigs } = useGameContext();
    const { t } = useTranslation("xocxoc");
    const odds = gameConfigs.odds;
    const keys = Object.keys(odds);
    return (
        <div className={Styles["choice"]}>
            {keys.map((name, index) => {
                if (bet[name] > 0) {
                    return (
                        <div key={"choice-" + index}>
                            {t(name)}_{bet[name]} @ {odds[name]}
                        </div>
                    );
                }
                return "";
            })}
        </div>
    );
};

const SeDieTicketHistory = (props: Props) => {
    const { popupContentTitle } = props;
    const gameContext = useGameContext();

    if (gameContext.betHistory) {
        const { betLogs } = gameContext.betHistory;
        return (
            <BetHistoryContainer popupContentTitle={popupContentTitle} isStakeReturn={false}>
                {betLogs.map((bet: any) => {
                    return (
                        <BetHistory
                            key={bet.phien}
                            renderResult={() => renderResult(bet)}
                            renderBet={() => renderBet(bet)}
                            betHistoryItem={bet}
                            isStakeReturn={false}
                        ></BetHistory>
                    );
                })}
            </BetHistoryContainer>
        );
    } else {
        return "";
    }
};

export default SeDieTicketHistory;
