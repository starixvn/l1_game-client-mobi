import React from "react";
import Styles from "./bet-history.module.scss";
import { useTranslation } from "next-i18next";
import BetHistoryContainer from "../../../shared/bet-history";
import { BetLogs } from "./bet-history";
import ChoiceIcon from "../choice-icon";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const itemValues = Object.values(bet.result);
        return (
            <div className="d-flex justify-content-center">
                {itemValues.map((value: number, index) => {
                    return <ChoiceIcon key={index} type={value} isSmall={true}></ChoiceIcon>;
                })}
            </div>
        );
    }
    return <></>;
};
const FishPrawnCrabBetHistory: React.FunctionComponent = () => {
    const { t } = useTranslation("baucua");
    return <BetHistoryContainer isRefund={false} renderResult={(bet: BetLogs) => renderResult(bet)} translate={t}></BetHistoryContainer>;
};

export default FishPrawnCrabBetHistory;
