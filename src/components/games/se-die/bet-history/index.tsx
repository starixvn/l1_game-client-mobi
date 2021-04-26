import { useTranslation } from "next-i18next";
import React from "react";

import BetHistoryContainer from "../../../shared/bet-history";
import SeDieDot from "../dot";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { BetLogs } from "./bet-history";

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

const SeDieBetHistory: React.FunctionComponent = () => {
    const { t } = useTranslation("xocxoc");
    return <BetHistoryContainer isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)} translate={t}></BetHistoryContainer>;
};

export default SeDieBetHistory;
