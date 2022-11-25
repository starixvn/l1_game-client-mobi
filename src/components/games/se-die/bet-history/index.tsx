import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../se-die-helper";
import { BetLogs } from "./bet-history";
import Styles from "./bet-history.module.scss";

export const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = countRedDot(bet.result);
        return (
            <div className={Styles["w-result"]}>
                <RoundDot choice={checkIsEven(countRed) ? Choices.even : Choices.odd} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const SeDieBetHistory: React.FunctionComponent<{ gameId: number; fractionalOddsFormat: boolean | undefined }> = ({
    gameId,
    fractionalOddsFormat,
}) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            fractionalOddsFormat={fractionalOddsFormat}
        ></BetHistoryContainer>
    );
};
export default SeDieBetHistory;
