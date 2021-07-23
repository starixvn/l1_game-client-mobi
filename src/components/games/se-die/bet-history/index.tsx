import { useTranslation } from "next-i18next";
import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { checkIsEven, countRedDot, Choices } from "../se-die-helper";
import { BetLogs } from "./bet-history";

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

const SeDieBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    const { t } = useTranslation("xocxoc");
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            translate={t}
        ></BetHistoryContainer>
    );
};
export default SeDieBetHistory;
