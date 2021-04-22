import React from "react";

import { Round } from "../../../types";
import Styles from "./statistic.module.scss";

type Props = {
    children: React.ReactNode;
    value: string | number;
};

export const countSettlementResult = (roundHistory: Round<any, any>[]) => {
    return roundHistory.reduce((result, { settlementResult }) => {
        for (const [choice, win] of Object.entries(settlementResult)) {
            if (win) {
                result[choice] = result[choice] ? (result[choice] += 1) : 1;
            }
        }
        return result;
    }, {});
};

export const calculatePercent = (
    statisticRuleEntries: [string, (countResult: object, total: number) => number][],
    countResult: object,
    total: number
) => {
    return statisticRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(countResult, total);
        return result;
    }, {});
};

const StatisticItem: React.FC<Props> = (props) => {
    return (
        <div className={Styles["statistic-group"]}>
            {props.children}
            <span className={Styles["number"]}>{props.value}</span>
        </div>
    );
};

export default StatisticItem;
