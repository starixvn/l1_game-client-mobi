import React from "react";
import BetHistoryContainer from "../../../shared/bet-history";
import { useTranslation } from "next-i18next";
import { BetLogs } from "./bet-history";
import Card from "../../../shared/card";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Card result={bet.result.dragon} isSmall={true} isAnimation={false}></Card> |{" "}
                <Card result={bet.result.tiger} isSmall={true}></Card>
            </div>
        );
    }
    return <></>;
};

const DragonTigerBetHistory: React.FunctionComponent = () => {
    const { t } = useTranslation("dragontiger");
    return <BetHistoryContainer isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)} translate={t}></BetHistoryContainer>;
};

export default DragonTigerBetHistory;
