import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistoryContainer from "../../../shared/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { BetLogs } from "./bet-history";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = 1;
        return (
            <div className="d-flex justify-content-center">
                <RoundDot choice={true ? Choices.big : Choices.small} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const BaccaratBetHistory: React.FunctionComponent = () => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return <BetHistoryContainer isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)} translate={t}></BetHistoryContainer>;
};
export default BaccaratBetHistory;
