import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../se-die-helper";
import { BetLogs } from "./bet-history";

export const renderResult = (bet: BetLogs) => {
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

const SeDieBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return <BetHistoryContainer gameId={gameId} isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)}></BetHistoryContainer>;
};
export default SeDieBetHistory;
