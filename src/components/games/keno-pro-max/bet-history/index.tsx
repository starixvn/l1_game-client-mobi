import { useTranslation } from "next-i18next";
import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../keno-pro-max-helper";
import { BetLogs } from "./bet-history";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = 1;
        return (
            <div className="d-flex justify-content-center">
                <RoundDot choice={true ? Choices.even : Choices.odd} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const KenoProMaxBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    const { t } = useTranslation("kenopromax");
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            translate={t}
        ></BetHistoryContainer>
    );
};
export default KenoProMaxBetHistory;
